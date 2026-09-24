"""Read-only end-to-end MCP test against an already-running game."""
import base64
import json
from pathlib import Path
import socket
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from theta import Bridge


def main():
    bridge = Bridge()
    assert bridge.status()["connected"], "Launch the game first"
    requests = [
        {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {
            "protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "theta-smoke", "version": "1"}}},
        {"jsonrpc": "2.0", "method": "notifications/initialized"},
        {"jsonrpc": "2.0", "id": 2, "method": "tools/list"},
        {"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "theta_observe", "arguments": {"include_map": True}}},
        {"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "theta_screenshot", "arguments": {"max_width": 640}}},
        {"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "theta_wait", "arguments": {"ms": 0}}},
    ]
    process = subprocess.run([sys.executable, str(ROOT / "theta.py"), "mcp"],
                             input="\n".join(json.dumps(r) for r in requests) + "\n",
                             capture_output=True, encoding="utf-8", timeout=50)
    assert process.returncode == 0, process.stderr
    responses = [json.loads(line) for line in process.stdout.splitlines()]
    assert [r["id"] for r in responses] == [1, 2, 3, 4, 5]
    assert all("error" not in r and not r["result"].get("isError") for r in responses), responses
    assert len(responses[1]["result"]["tools"]) == 9
    state = responses[2]["result"]["structuredContent"]
    assert state["scene"]
    image = responses[3]["result"]["content"][0]
    assert image["type"] == "image" and image["mimeType"] == "image/png"
    data = base64.b64decode(image["data"], validate=True)
    assert data.startswith(b"\x89PNG\r\n\x1a\n")
    receipt = responses[4]["result"]["structuredContent"]
    assert receipt["ok"] and receipt["waited_ms"] == 0
    assert "level" not in receipt and "ui" not in receipt
    assert len(json.dumps(receipt)) < 2000
    (ROOT / "artifacts").mkdir(exist_ok=True)
    (ROOT / "artifacts" / "mcp-gameplay.png").write_bytes(data)
    # A caller without the local token must not reach the main-thread action queue.
    conf = bridge.config()
    with socket.create_connection((conf["host"], conf["port"]), timeout=5) as conn:
        conn.sendall(b'{"token":"wrong","method":"act","params":{"action":"left"}}\n')
        with conn.makefile("rb") as stream:
            denied = json.loads(stream.readline())
    assert denied["ok"] is False and denied["error"]["code"] == "unauthorized"
    assert bridge.status()["connected"]
    report = {"passed": True, "mcp_tools": 9, "scene": state["scene"],
              "level": state["level"]["id"] if state["level"] else None,
              "screenshot_bytes": len(data), "unauthenticated_input_rejected": True,
              "compact_wait_bytes": len(json.dumps(receipt)), "observe_bytes": len(json.dumps(state))}
    (ROOT / "artifacts" / "smoke-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
