import io
import json
from pathlib import Path
import socket
import subprocess
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from theta import Bridge, BridgeError, MCPServer, ROOT, TOOLS, call_tool, main, compact_observation


class FakeBridge:
    def __init__(self):
        self.calls = []

    def status(self):
        return {"connected": True}

    def call(self, method, **params):
        self.calls.append((method, params))
        if method == "screenshot":
            return {"data": "aGVsbG8=", "mimeType": "image/png", "width": 640, "height": 360}
        return {"scene": "test", "level": None}


class ProtocolTests(unittest.TestCase):
    def setUp(self):
        self.bridge = FakeBridge()
        self.server = MCPServer(self.bridge)

    def request(self, method, params=None):
        return self.server.dispatch({"jsonrpc": "2.0", "id": 7, "method": method, "params": params or {}})

    def initialize(self):
        return self.request("initialize", {"protocolVersion": "2025-11-25"})

    def test_initialization_and_version_negotiation(self):
        self.assertEqual(self.request("tools/list")["error"]["code"], -32002)
        result = self.initialize()["result"]
        self.assertEqual(result["protocolVersion"], "2025-11-25")
        self.assertEqual(len(self.request("tools/list")["result"]["tools"]), 9)
        self.assertEqual(self.request("initialize", {"protocolVersion": "unknown"})["result"]["protocolVersion"], "2025-11-25")

    def test_invalid_json_rpc_and_notifications(self):
        self.assertEqual(self.server.dispatch([])["error"]["code"], -32600)
        self.assertIsNone(self.server.dispatch({"jsonrpc": "2.0", "method": "notifications/initialized"}))
        self.assertEqual(self.request("ping")["result"], {})

    def test_validation_prevents_game_mutations(self):
        self.initialize()
        for name, arguments in [("theta_act", {"action": "delete_save"}), ("theta_click", {"id": True}),
                                ("theta_wait", {"ms": 5001}), ("theta_wait", {"ms": -1}),
                                ("theta_observe", {"include_map": "false"}), ("theta_act", {}),
                                ("theta_ui", {"execute": "arbitrary"}), ("not_a_tool", {})]:
            with self.subTest(name=name, arguments=arguments):
                response = self.request("tools/call", {"name": name, "arguments": arguments})
                self.assertEqual(response["error"]["code"], -32602)
        self.assertEqual(self.bridge.calls, [])

    def test_game_failure_becomes_tool_error(self):
        self.initialize()
        with patch.object(self.bridge, "call", side_effect=BridgeError("locked")):
            response = self.request("tools/call", {"name": "theta_act", "arguments": {"action": "left"}})
        self.assertTrue(response["result"]["isError"])

    def test_images_are_native_mcp_content(self):
        result = call_tool(self.bridge, "theta_screenshot", {"max_width": 640})
        self.assertEqual(result["content"][0]["type"], "image")
        self.assertEqual(result["content"][0]["mimeType"], "image/png")
        self.assertNotIn("data", json.loads(result["content"][1]["text"]))

    def test_action_receipts_do_not_leak_full_state_from_old_plugin(self):
        players = [{"id": i, "pos": [i, 1], "type": "PLAYER", "active": True,
                    "properties": {"history": "x" * 10000}} for i in range(20)]
        state = {"scene": "puzzle", "dispatched": True, "ui": {"texts": ["x" * 50000]},
                 "level": {"id": "fork", "current_timeline": 9, "busy": False, "input_locked": False,
                           "timelines": [{"id": 9, "entities": players, "tiles": ["x" * 50000]},
                                         {"id": 10, "entities": players}]}}
        for command, args in [("act", {"action": "left"}), ("click", {"id": 7}), ("wait", {})]:
            with self.subTest(command=command), patch.object(self.bridge, "call", return_value=state):
                response = call_tool(self.bridge, "theta_" + command, args)
                result = response["structuredContent"]
                self.assertEqual(result["level_id"], "fork")
                self.assertEqual(result["player_count"], 20)
                self.assertEqual(len(result["players"]), 8)
                self.assertEqual(json.loads(response["content"][0]["text"]), result)
                self.assertLess(len(json.dumps(response)), 2000)
                self.assertNotIn("level", result)
                self.assertNotIn("ui", result)
                self.assertNotIn("properties", json.dumps(result))
                if command == "wait":
                    self.assertEqual(result["waited_ms"], 250)
                    self.assertNotIn("dispatched", result)

    def test_compact_plugin_receipts_preserve_dispatch_and_status(self):
        result = {"scene": "puzzle", "level_id": "fork", "dispatched": True, "paused": True,
                  "busy": False, "menu_index": 2, "players": [{"id": 4, "pos": [2, 3]}], "player_count": 1}
        with patch.object(self.bridge, "call", return_value=result):
            receipt = call_tool(self.bridge, "theta_act", {"action": "down"})["structuredContent"]
        self.assertTrue(receipt["dispatched"])
        self.assertEqual(receipt["players"], result["players"])
        self.assertEqual(receipt["menu_index"], 2)
        self.assertEqual(receipt["action"], "down")

    def test_observe_keeps_full_information(self):
        full = {"scene": "puzzle", "ui": {"texts": ["dialog"]}, "level": {
            "id": "fork", "timelines": [{"entities": [{"properties": {"split": 2}}], "tiles": [[1, 2]]}]}}
        with patch.object(self.bridge, "call", return_value=full) as send:
            result = call_tool(self.bridge, "theta_observe", {"full": True})
        send.assert_called_once_with("state")
        self.assertEqual(result["structuredContent"], full)
        self.assertEqual(json.loads(result["content"][0]["text"]), full)

    def test_compact_observe_preserves_mechanics_and_does_not_mutate_source(self):
        entity = {"id": 1, "type": "PLAYER", "class": "Player", "pos": [2, 3],
                  "active": True, "floor": False, "pushable": True, "blockable": False,
                  "anim_completed": False, "properties": {"face": 2, "container": -1,
                  "height": 2, "split": 0, "unknown": False}, "details": {"Color": 3}}
        full = {"frame": 12, "screen": [1280, 720], "ui": {"texts": ["dialog"]},
                "level": {"instructions": "WASD", "dialog": True, "timelines": [
                    {"id": 5, "entities": [entity, {"id": 2, "active": False, "properties": {}, "details": {}}],
                     "tiles": [{"class": "Floor", "pos": [0, 0], "floor": True, "details": {}}]}]}}
        original = json.dumps(full)
        with patch.object(self.bridge, "call", return_value=full):
            result = call_tool(self.bridge, "theta_observe", {})["structuredContent"]
        self.assertEqual(json.dumps(full), original)
        self.assertNotIn("frame", result)
        self.assertNotIn("screen", result)
        self.assertNotIn("instructions", result["level"])
        self.assertEqual(result["ui"], full["ui"])
        timeline = result["level"]["timelines"][0]
        compact = timeline["entities"][0]
        self.assertEqual(compact, entity)
        self.assertEqual(result["defaults"]["entity"]["active"], True)
        self.assertEqual(result["defaults"]["properties"]["container"], -1)
        self.assertEqual(result["defaults"]["applies_to_classes"], ["Wall", "Floor"])
        self.assertEqual(compact["details"], {"Color": 3})
        self.assertTrue(compact["pushable"])
        self.assertFalse(compact["anim_completed"])
        self.assertFalse(timeline["entities"][1]["active"])
        self.assertTrue(timeline["tiles"][0]["floor"])
        self.assertNotIn("details", timeline["tiles"][0])
        self.assertEqual(timeline["entities"][1], full["level"]["timelines"][0]["entities"][1])

    def test_observe_only_compacts_exact_wall_and_floor_classes(self):
        entities = [{"class": cls, "type": "SOLID", "active": True, "floor": False,
                     "pushable": False, "properties": {"container": -1, "height": 1,
                     "maskedoff": 2, "unknown": 0}, "details": {}}
                    for cls in ("Wall", "Floor", "Box", "Player", "Key", "DynamicEntity", "SpecialWall", "Unknown")]
        source = {"level": {"timelines": [{"entities": entities, "tiles": entities}]}}
        result = compact_observation(source)["level"]["timelines"][0]
        for collection in ("entities", "tiles"):
            for original, actual in zip(entities, result[collection]):
                with self.subTest(collection=collection, cls=original["class"]):
                    if original["class"] in ("Wall", "Floor"):
                        self.assertNotIn("active", actual)
                        self.assertNotIn("details", actual)
                        self.assertEqual(actual["properties"], {"maskedoff": 2, "unknown": 0})
                    else:
                        self.assertEqual(actual, original)

    def test_compact_observe_without_level_or_map(self):
        self.assertEqual(compact_observation({"scene": "title", "level": None}),
                         {"scene": "title", "level": None})
        with patch.object(self.bridge, "call", return_value={"level": {"timelines": [{"entities": []}]}}) as send:
            result = call_tool(self.bridge, "theta_observe", {"include_map": False})["structuredContent"]
        send.assert_called_once_with("state", include_map=False)
        self.assertNotIn("tiles", result["level"]["timelines"][0])

    def test_observe_cli_full_option(self):
        with patch("theta.Bridge", return_value=self.bridge), patch("sys.stdout", new_callable=io.StringIO):
            self.assertEqual(main(["observe", "--full", "--no-map"]), 0)
        self.assertEqual(self.bridge.calls, [("state", {"include_map": False})])

    def test_receipt_without_level_or_players(self):
        with patch.object(self.bridge, "call", return_value={"scene": "NewTitle", "level": None}):
            result = call_tool(self.bridge, "theta_wait", {"ms": 0})["structuredContent"]
        self.assertEqual(result, {"ok": True, "scene": "NewTitle", "level_id": None, "waited_ms": 0})

    def test_stdio_process_contains_only_json_rpc(self):
        messages = ["not json", json.dumps({"jsonrpc": "2.0", "id": 1, "method": "initialize",
                    "params": {"protocolVersion": "2025-11-25"}}),
                    json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}),
                    json.dumps({"jsonrpc": "2.0", "id": 2, "method": "tools/list"})]
        process = subprocess.run([sys.executable, str(ROOT / "theta.py"), "mcp"],
                                 input="\n".join(messages) + "\n", text=True, capture_output=True, timeout=10)
        self.assertEqual(process.returncode, 0, process.stderr)
        responses = [json.loads(line) for line in process.stdout.splitlines()]
        self.assertEqual(len(responses), 3)
        self.assertEqual(responses[0]["error"]["code"], -32700)
        self.assertEqual(responses[2]["id"], 2)

    def test_batch_validates_entire_list_before_contacting_game(self):
        self.initialize()
        for args in [{}, {"actions": []}, {"actions": ["left"] * 51}, {"actions": "left"},
                     {"actions": ["left", "invalid"]}, {"actions": ["left", 1]},
                     {"actions": [None]}, {"actions": [["left"]]}, {"actions": ["left"], "repeat": 3}]:
            with self.subTest(args=args):
                response = self.request("tools/call", {"name": "theta_batch", "arguments": args})
                self.assertEqual(response["error"]["code"], -32602)
        self.assertEqual(self.bridge.calls, [])

    def test_batch_uses_one_game_request_and_small_result_at_limit(self):
        actions = ["left", "undo"] * 25
        native = {"ok": True, "scene": "test", "level_id": "puzzle", "requested": 50,
                  "executed": 50, "remaining": 0, "stop_reason": "finished", "last_action": "undo",
                  "debug_history": ["x" * 10000] * 20}
        with patch.object(self.bridge, "call", return_value=native) as send:
            response = call_tool(self.bridge, "theta_batch", {"actions": actions})
        send.assert_called_once_with("batch", actions=actions)
        self.assertEqual(response["structuredContent"]["executed"], 50)
        self.assertEqual(response["structuredContent"]["remaining"], 0)
        self.assertLess(len(json.dumps(response)), 1500)
        self.assertNotIn("debug_history", response["structuredContent"])

    def test_batch_preserves_partial_progress_without_retry(self):
        for executed, reason in [(0, "input_locked"), (1, "paused"), (2, "level_changed"), (2, "dialog")]:
            native = {"ok": True, "scene": "test", "level_id": "puzzle", "requested": 3,
                      "executed": executed, "remaining": 3 - executed, "stop_reason": reason}
            with self.subTest(reason=reason), patch.object(self.bridge, "call", return_value=native) as send:
                response = call_tool(self.bridge, "theta_batch", {"actions": ["right"] * 3})
                self.assertEqual(send.call_count, 1)
                self.assertEqual(response["structuredContent"]["stop_reason"], reason)
                self.assertEqual(response["structuredContent"]["executed"], executed)

    def test_batch_error_retains_partial_progress(self):
        native = {"ok": False, "scene": "test", "level_id": "puzzle", "requested": 3,
                  "executed": 1, "remaining": 2, "stop_reason": "error", "error": "animation failed"}
        with patch.object(self.bridge, "call", return_value=native):
            response = call_tool(self.bridge, "theta_batch", {"actions": ["right"] * 3})
        self.assertTrue(response["isError"])
        self.assertFalse(response["structuredContent"]["ok"])
        self.assertEqual(response["structuredContent"]["executed"], 1)

    def test_batch_timeout_is_not_retried_or_converted_to_single_steps(self):
        self.initialize()
        with patch.object(self.bridge, "call", side_effect=BridgeError("timeout")) as send:
            response = self.request("tools/call", {"name": "theta_batch", "arguments": {"actions": ["left", "right"]}})
        self.assertTrue(response["result"]["isError"])
        send.assert_called_once_with("batch", actions=["left", "right"])

    def test_batch_transport_has_longer_response_budget(self):
        bridge = Bridge()
        for method, timeout in [("batch", 50), ("act", 20), ("ping", 20)]:
            with self.subTest(method=method), patch.object(bridge, "config", return_value={
                    "host": "127.0.0.1", "port": 17643, "token": "test"}), \
                    patch("theta.socket.create_connection") as connect:
                connection = connect.return_value.__enter__.return_value
                stream = connection.makefile.return_value.__enter__.return_value
                stream.readline.return_value = b'{"ok":true,"result":{}}\n'
                self.assertEqual(bridge.call(method), {})
                connection.settimeout.assert_called_once_with(timeout)
                connection.sendall.assert_called_once()

    def test_batch_cli_order_and_receipt(self):
        native = {"ok": True, "scene": "test", "level_id": "puzzle", "requested": 2,
                  "executed": 2, "remaining": 0, "stop_reason": "finished"}
        with patch("theta.Bridge", return_value=self.bridge), patch.object(self.bridge, "call", return_value=native) as send:
            with patch("sys.stdout", new_callable=io.StringIO) as output:
                self.assertEqual(main(["batch", "right", "up"]), 0)
            self.assertEqual(json.loads(output.getvalue())["executed"], 2)
        send.assert_called_once_with("batch", actions=["right", "up"])


class TransportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        (ROOT / "artifacts").mkdir(exist_ok=True)

    def exchange(self, reply):
        listener = socket.socket()
        listener.bind(("127.0.0.1", 0))
        listener.listen(1)
        port = listener.getsockname()[1]
        requests = []

        def handle():
            try:
                with listener.accept()[0] as connection:
                    with connection.makefile("rb") as stream:
                        requests.append(json.loads(stream.readline()))
                    connection.sendall(reply)
            finally:
                listener.close()

        worker = threading.Thread(target=handle, daemon=True)
        worker.start()
        with tempfile.TemporaryDirectory(dir=ROOT / "artifacts") as directory:
            config = Path(directory) / "config.json"
            config.write_text(json.dumps({"host": "127.0.0.1", "port": port, "token": "test-secret"}))
            try:
                result = Bridge(config).call("state", include_map=True)
            finally:
                worker.join(2)
        return result, requests

    def test_authenticated_request_and_unicode_response(self):
        result, requests = self.exchange(json.dumps({"ok": True, "result": {"text": "世界线"}}, ensure_ascii=False).encode() + b"\n")
        self.assertEqual(result["text"], "世界线")
        self.assertEqual(requests[0]["token"], "test-secret")
        self.assertEqual(requests[0]["params"], {"include_map": True})

    def test_no_retry_on_ambiguous_disconnect(self):
        with self.assertRaisesRegex(BridgeError, "Incomplete bridge response"):
            self.exchange(b'{"ok": true')

    def test_server_error_preserved(self):
        with self.assertRaisesRegex(BridgeError, "unauthorized"):
            self.exchange(b'{"ok": false, "error": {"code": "unauthorized", "message": "bad token"}}\n')


if __name__ == "__main__":
    (ROOT / "artifacts").mkdir(exist_ok=True)
    unittest.main()
