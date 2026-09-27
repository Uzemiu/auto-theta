"""Theta and Paralldox on Worldlines CLI + MCP stdio server (Python stdlib only)."""
from __future__ import annotations

import argparse
import base64
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import time
from typing import Any

ROOT = Path(__file__).resolve().parent
CONFIG = ROOT / "theta.local.json"
ACTIONS = ["up", "down", "left", "right", "split", "undo", "retry", "tab", "shift", "confirm", "pause", "grid", "preview", "redo"]
PROTOCOLS = ["2024-11-05", "2025-03-26", "2025-06-18", "2025-11-25"]
MAX_RESPONSE = 64 * 1024 * 1024
OBSERVE_DEFAULTS = {
    "applies_to_classes": ["Wall", "Floor"],
    "entity": {"active": True, "floor": False, "pushable": False, "blockable": False,
               "anim_completed": True, "properties": {}, "details": {}},
    "properties": {"face": 0, "maskedoff": 0, "contained": 0, "container": -1, "height": 1,
                   "movingdir": 0, "movingsrc": -1, "movingsrcext": 0},
}


class BridgeError(Exception):
    pass


def find_steam() -> Path:
    """Use the installed Steam client rather than a steam:// URL or game EXE."""
    import winreg
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Valve\Steam") as key:
            path = Path(winreg.QueryValueEx(key, "SteamExe")[0])
    except OSError as exc:
        raise BridgeError("Steam installation not found in HKCU\\Software\\Valve\\Steam") from exc
    if not path.is_file():
        raise BridgeError(f"Steam executable missing: {path}")
    return path


class Bridge:
    def __init__(self, config: Path = CONFIG):
        self.config_path = config

    def config(self) -> dict[str, Any]:
        try:
            conf = json.loads(self.config_path.read_text(encoding="utf-8-sig"))
        except (OSError, ValueError) as exc:
            raise BridgeError(f"Run tools/setup.ps1 first; cannot read {self.config_path}: {exc}") from exc
        if conf.get("host") != "127.0.0.1":
            raise BridgeError("Bridge host must be 127.0.0.1")
        return conf

    def call(self, method: str, **params: Any) -> dict[str, Any]:
        conf = self.config()
        message = {"token": conf["token"], "method": method, "params": params}
        try:
            with socket.create_connection((conf["host"], conf["port"]), timeout=3) as connection:
                connection.settimeout(50 if method == "batch" else 20)
                connection.sendall((json.dumps(message, ensure_ascii=False) + "\n").encode("utf-8"))
                with connection.makefile("rb") as stream:
                    line = stream.readline(MAX_RESPONSE + 1)
                if len(line) > MAX_RESPONSE:
                    raise BridgeError("Bridge response exceeded 64 MiB")
                if not line.endswith(b"\n"):
                    raise BridgeError("Incomplete bridge response; inspect state before retrying an action")
                response = json.loads(line)
        except (OSError, ValueError) as exc:
            raise BridgeError(f"Bridge unavailable: {exc}. Launch the game with `python theta.py launch`. "
                              "If an action was sent, inspect state before retrying.") from exc
        if not response.get("ok"):
            error = response.get("error", {})
            raise BridgeError(f"{error.get('code', 'error')}: {error.get('message', 'Bridge request failed')}")
        return response["result"]

    def status(self) -> dict[str, Any]:
        try:
            return {"connected": True, **self.call("ping")}
        except BridgeError as exc:
            return {"connected": False, "message": str(exc)}

    def launch(self) -> dict[str, Any]:
        status = self.status()
        if status["connected"]:
            return {"already_running": True, **status}
        if os.name != "nt":
            raise BridgeError("This game launcher requires Windows")
        conf = self.config()
        executable = Path(conf["game_exe"])
        if not executable.is_file():
            raise BridgeError(f"Game executable missing: {executable}")
        # Refuse duplicate launch when an unmodified or still-starting copy is running.
        query = subprocess.run(["tasklist", "/FI", f"IMAGENAME eq {executable.name}", "/FO", "CSV", "/NH"],
                               capture_output=True, creationflags=subprocess.CREATE_NO_WINDOW)
        if executable.name.lower().encode() in query.stdout.lower():
            raise BridgeError("Game is running but bridge is unavailable. Wait for startup or close and relaunch it.")
        artifacts = ROOT / "artifacts"
        artifacts.mkdir(exist_ok=True)
        steam_exe = find_steam()
        subprocess.Popen([str(steam_exe), "-applaunch", "3219580", "-logFile", str(artifacts / "Player.log"),
                          "-screen-fullscreen", "0", "-screen-width", "1280", "-screen-height", "720"],
                         cwd=str(steam_exe.parent), stdin=subprocess.DEVNULL,
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        # A final status call can take 20 seconds; stay within MCP's 60s tool budget.
        deadline = time.monotonic() + 35
        while time.monotonic() < deadline:
            time.sleep(0.5)
            status = self.status()
            if status["connected"] and status.get("scene"):
                return {"launched": True, **status}
        raise BridgeError(f"Game launched but bridge did not connect. Read {artifacts / 'Player.log'} "
                          f"and {Path(conf['game_path']) / 'BepInEx' / 'LogOutput.log'}")


def tool(name: str, description: str, properties: dict | None = None,
         required: list[str] | None = None, read_only: bool = True) -> dict:
    return {"name": f"theta_{name}", "description": description,
            "inputSchema": {"type": "object", "properties": properties or {},
                            "required": required or [], "additionalProperties": False},
            "annotations": {"readOnlyHint": read_only, "destructiveHint": not read_only,
                            "idempotentHint": read_only, "openWorldHint": False}}


TOOLS = [
    tool("status", "Check if the authenticated local Unity game bridge is connected."),
    tool("launch", "Launch through Steam -applaunch (avoids Steam URL launch-parameter confirmation), in a visible 1280x720 window. Wait for the bridge. Does not start a save.", read_only=False),
    tool("observe", "Read current level, all timelines, entities, goals, locks and visible UI. Only exact classes Wall and Floor omit repeated default fields, defined once in defaults; absent properties/details there mean empty objects before applying property defaults. All other entities including Box and Player retain every field, even default values and empty objects. Omits frame, screen size and instruction history. Set full=true for the original unabridged state. Set include_map=false to omit terrain already observed. Coordinates are grid [x,y]; up increases y.",
         {"include_map": {"type": "boolean", "default": True},
          "full": {"type": "boolean", "default": False}}),
    tool("act", "Dispatch one normal game input and return a compact receipt with status flags and up to 8 active players in the current timeline. No full state, entity lists or UI. Use theta_observe for details. Dispatch does not guarantee movement. May advance/save gameplay. Never automatically retry a timed-out action.",
         {"action": {"type": "string", "enum": ACTIONS}}, ["action"], False),
    tool("batch", "Execute 1..50 actions sequentially inside the game with one round trip, waiting for each animation. Requires an initialized, unpaused level. Stops on level change, dialog, input lock, completion, pause, conflict, looping, disconnect or timeout. Returns only executed/remaining counts, stop_reason and compact final state. Executed counts dispatched inputs, not successful moves. Never automatically retry a partial or timed-out batch. Use theta_observe for details.",
         {"actions": {"type": "array", "items": {"type": "string", "enum": ACTIONS}, "minItems": 1, "maxItems": 50}}, ["actions"], False),
    tool("ui", "List active menu buttons (ephemeral instance IDs), labels and text. Inspect before clicking."),
    tool("click", "Click an active, interactable menu button returned by theta_ui; return only a compact receipt, not full state. Use theta_observe or theta_ui to inspect details. Buttons can start/continue/delete saves; inspect the label and choose deliberately.",
         {"id": {"type": "integer"}}, ["id"], False),
    tool("screenshot", "Capture the actual Unity frame, returning an MCP image. Works without desktop focus.",
         {"max_width": {"type": "integer", "minimum": 320, "maximum": 3840, "default": 1280}}),
    tool("wait", "Let animations/dialogs advance, then return only compact status and current player positions. Use theta_observe for full state.",
         {"ms": {"type": "integer", "minimum": 0, "maximum": 5000, "default": 250}}, read_only=False),
]


def validate_args(spec: dict, arguments: Any) -> dict:
    if not isinstance(arguments, dict):
        raise ValueError("arguments must be an object")
    schema = spec["inputSchema"]
    for field in schema["required"]:
        if field not in arguments:
            raise ValueError(f"Missing argument: {field}")
    def validate_value(rule: dict, value: Any, field: str) -> None:
        types = {"string": str, "integer": int, "boolean": bool, "array": list}
        if type(value) is not types[rule["type"]]:
            raise ValueError(f"{field} must be {rule['type']}")
        if "enum" in rule and value not in rule["enum"]:
            raise ValueError(f"{field} must be one of {rule['enum']}")
        if "minimum" in rule and value < rule["minimum"] or "maximum" in rule and value > rule["maximum"]:
            raise ValueError(f"{field} is outside the supported range")
        if rule["type"] == "array":
            if len(value) < rule.get("minItems", 0) or len(value) > rule.get("maxItems", len(value)):
                raise ValueError(f"{field} must contain {rule['minItems']}..{rule['maxItems']} items")
            for index, item in enumerate(value):
                validate_value(rule["items"], item, f"{field}[{index}]")

    for field, value in arguments.items():
        if field not in schema["properties"]:
            raise ValueError(f"Unknown argument: {field}")
        validate_value(schema["properties"][field], value, field)
    return arguments


def compact_receipt(result: dict, command: str, arguments: dict) -> dict:
    """Whitelist public receipt fields, including compatibility with a running v0.1 plugin."""
    receipt = {"ok": result.get("ok", True), "scene": result.get("scene")}
    fields = ("busy", "input_locked", "completed", "conflicting", "undo_depth", "paused", "dialog", "current_timeline")
    if "level" in result:
        level = result.get("level") or {}
        receipt["level_id"] = level.get("id")
        receipt.update({key: level[key] for key in fields if key in level})
        current = next((t for t in level.get("timelines", []) if t.get("id") == level.get("current_timeline")), {})
        players = [e for e in current.get("entities", []) if e.get("type") == "PLAYER" and e.get("active")]
        if level:
            receipt["players"] = [{"id": p["id"], "pos": p["pos"]} for p in players[:8]]
            receipt["player_count"] = len(players)
        menu = result.get("ui", {}).get("pause_menu", {})
        if receipt.get("paused") and "selected_index" in menu:
            receipt["menu_index"] = menu["selected_index"]
    else:
        receipt["level_id"] = result.get("level_id")
        receipt.update({key: result[key] for key in fields + ("menu_index", "player_count") if key in result})
        if "players" in result:
            receipt["players"] = [{"id": p["id"], "pos": p["pos"]} for p in result["players"][:8]]
    if command in ("act", "click"):
        receipt["dispatched"] = result.get("dispatched", False)
    if command == "act": receipt["action"] = arguments["action"]
    elif command == "click": receipt["button_id"] = arguments["id"]
    elif command == "wait": receipt["waited_ms"] = arguments.get("ms", 250)
    elif command == "batch":
        for key in ("requested", "executed", "remaining", "stop_reason"):
            receipt[key] = result[key]
        for key in ("last_action", "error"):
            if key in result: receipt[key] = result[key]
    return receipt


def compact_observation(state: dict) -> dict:
    """Factor defaults out of Wall/Floor only; preserve every other entity verbatim."""
    import copy
    result = copy.deepcopy(state)
    result.pop("frame", None)
    result.pop("screen", None)
    level = result.get("level")
    if isinstance(level, dict):
        level.pop("instructions", None)
        for timeline in level.get("timelines", []):
            for collection in ("entities", "tiles"):
                for entity in timeline.get(collection, []):
                    if not isinstance(entity, dict) or entity.get("class") not in OBSERVE_DEFAULTS["applies_to_classes"]:
                        continue
                    properties = entity.get("properties")
                    if isinstance(properties, dict):
                        for key, default in OBSERVE_DEFAULTS["properties"].items():
                            if key in properties and type(properties[key]) is type(default) and properties[key] == default:
                                del properties[key]
                    for key, default in OBSERVE_DEFAULTS["entity"].items():
                        if key in entity and type(entity[key]) is type(default) and entity[key] == default:
                            del entity[key]
        result["defaults"] = copy.deepcopy(OBSERVE_DEFAULTS)
    return result


def call_tool(bridge: Bridge, name: str, arguments: dict) -> dict:
    spec = next((item for item in TOOLS if item["name"] == name), None)
    if spec is None:
        raise ValueError(f"Unknown tool: {name}")
    arguments = validate_args(spec, arguments)
    command = name.removeprefix("theta_")
    if command == "status":
        result = bridge.status()
    elif command == "launch":
        result = bridge.launch()
    elif command == "observe":
        result = bridge.call("state", **{k: v for k, v in arguments.items() if k != "full"})
        if not arguments.get("full", False):
            result = compact_observation(result)
    else:
        result = bridge.call("state" if command == "observe" else command, **arguments)
    if command in ("act", "click", "wait", "batch"):
        result = compact_receipt(result, command, arguments)
    if command == "screenshot":
        return {"content": [{"type": "image", "data": result["data"], "mimeType": result["mimeType"]},
                            {"type": "text", "text": json.dumps({k: v for k, v in result.items() if k != "data"})}]}
    response = {"content": [{"type": "text", "text": json.dumps(result, ensure_ascii=False)}],
                "structuredContent": result}
    if result.get("ok") is False:
        response["isError"] = True
    return response


class MCPServer:
    def __init__(self, bridge: Bridge):
        self.bridge = bridge
        self.initialized = False

    @staticmethod
    def error(request_id: Any, code: int, message: str) -> dict:
        return {"jsonrpc": "2.0", "id": request_id, "error": {"code": code, "message": message}}

    def dispatch(self, request: Any) -> dict | None:
        if not isinstance(request, dict) or request.get("jsonrpc") != "2.0" or not isinstance(request.get("method"), str):
            return self.error(request.get("id") if isinstance(request, dict) else None, -32600, "Invalid JSON-RPC request")
        method = request["method"]
        if "id" not in request:
            return None  # Notifications never receive a response.
        request_id = request["id"]
        params = request.get("params", {})
        if not isinstance(params, dict):
            return self.error(request_id, -32602, "params must be an object")
        if method == "initialize":
            if not isinstance(params.get("protocolVersion"), str):
                return self.error(request_id, -32602, "protocolVersion is required")
            self.initialized = True
            version = params["protocolVersion"]
            result = {"protocolVersion": version if version in PROTOCOLS else PROTOCOLS[-1],
                      "capabilities": {"tools": {"listChanged": False}},
                      "serverInfo": {"name": "theta-game", "version": "0.3.1"},
                      "instructions": "theta_observe factors repeated defaults out of Wall/Floor only; all other entities keep every field. Defaults apply only to classes listed in defaults.applies_to_classes. Pass full=true for original fields. act/batch/click/wait return compact receipts; ui returns only controls/text; screenshot returns only the image. Use batch for known routes of up to 50 actions; it stops early on interruptions. Check executed and stop_reason; do not blindly resend the original sequence. Use observe when detailed state is needed. Dispatch does not guarantee movement. Do not retry timed-out actions without observing. Normal game autosave applies."}
        elif method == "ping":
            result = {}
        elif not self.initialized:
            return self.error(request_id, -32002, "Initialize the MCP session first")
        elif method == "tools/list":
            result = {"tools": TOOLS}
        elif method == "tools/call":
            try:
                result = call_tool(self.bridge, params.get("name", ""), params.get("arguments", {}))
            except ValueError as exc:
                return self.error(request_id, -32602, str(exc))
            except (BridgeError, OSError, KeyError) as exc:
                result = {"isError": True, "content": [{"type": "text", "text": str(exc)}]}
        else:
            return self.error(request_id, -32601, f"Unknown method: {method}")
        return {"jsonrpc": "2.0", "id": request_id, "result": result}

    def serve(self) -> None:
        for line in sys.stdin:
            try:
                request = json.loads(line)
                response = self.dispatch(request)
            except (json.JSONDecodeError, UnicodeError):
                response = self.error(None, -32700, "Parse error")
            except Exception as exc:
                print(f"MCP request failed: {exc}", file=sys.stderr, flush=True)
                response = self.error(None, -32603, "Internal error")
            if response is not None:
                print(json.dumps(response, ensure_ascii=False), flush=True)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=CONFIG)
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ["status", "launch", "ui", "mcp"]:
        commands.add_parser(name)
    observe = commands.add_parser("observe", aliases=["state"])
    observe.add_argument("--no-map", action="store_true")
    observe.add_argument("--full", action="store_true", help="Return original state without field compaction")
    act = commands.add_parser("act")
    act.add_argument("action", choices=ACTIONS)
    batch = commands.add_parser("batch")
    batch.add_argument("actions", nargs="+", choices=ACTIONS)
    click = commands.add_parser("click")
    click.add_argument("id", type=int)
    wait = commands.add_parser("wait")
    wait.add_argument("ms", type=int, nargs="?", default=250)
    capture = commands.add_parser("screenshot")
    capture.add_argument("--out", type=Path, default=ROOT / "artifacts" / "screenshot.png")
    capture.add_argument("--max-width", type=int, default=1280)
    args = parser.parse_args(argv)
    bridge = Bridge(args.config)
    if args.command == "mcp":
        MCPServer(bridge).serve()
        return 0
    try:
        command = "observe" if args.command == "state" else args.command
        params: dict[str, Any] = {}
        if command == "observe": params = {"include_map": not args.no_map, "full": args.full}
        elif command == "act": params = {"action": args.action}
        elif command == "batch": params = {"actions": args.actions}
        elif command == "click": params = {"id": args.id}
        elif command == "wait": params = {"ms": args.ms}
        elif command == "screenshot": params = {"max_width": args.max_width}
        response = call_tool(bridge, "theta_" + command, params)
        if command == "screenshot":
            args.out = args.out.resolve()
            args.out.parent.mkdir(parents=True, exist_ok=True)
            args.out.write_bytes(base64.b64decode(response["content"][0]["data"], validate=True))
            result = {"path": str(args.out), **json.loads(response["content"][1]["text"])}
        else:
            result = response["structuredContent"]
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 1 if result.get("ok") is False or command == "status" and not result["connected"] else 0
    except (BridgeError, ValueError, OSError) as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
        sys.stdin.reconfigure(encoding="utf-8")
    raise SystemExit(main())
