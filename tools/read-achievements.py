"""Read Theta's Steam achievement cache; never writes Steam or game files."""
from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path
import struct
import winreg

ROOT = Path(__file__).resolve().parents[1]
APP_ID = "3219580"


def read_binary_vdf(data: bytes) -> dict:
    position = 0

    def string() -> str:
        nonlocal position
        end = data.index(b"\0", position)
        value = data[position:end].decode("utf-8")
        position = end + 1
        return value

    def node() -> dict:
        nonlocal position
        result = {}
        while position < len(data):
            kind = data[position]
            position += 1
            if kind == 8:
                return result
            key = string()
            if kind == 0:
                value = node()
            elif kind == 1:
                value = string()
            elif kind in (2, 3, 7, 10):
                fmt = {2: "<I", 3: "<f", 7: "<Q", 10: "<q"}[kind]
                value = struct.unpack_from(fmt, data, position)[0]
                position += struct.calcsize(fmt)
            else:
                raise ValueError(f"Unsupported binary VDF type {kind} at {position}")
            if key in result:
                raise ValueError(f"Duplicate VDF key: {key}")
            result[key] = value
        raise ValueError("Unterminated VDF object")

    result = node()
    if position != len(data):
        raise ValueError(f"Unparsed trailing data at {position}/{len(data)}")
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--update", action="store_true", help="Update project knowledge only")
    args = parser.parse_args()
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Valve\Steam") as key:
        steam = Path(winreg.QueryValueEx(key, "SteamPath")[0])
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Valve\Steam\ActiveProcess") as key:
        active_user = winreg.QueryValueEx(key, "ActiveUser")[0]
    if not active_user:
        raise RuntimeError("No active Steam user; refusing to choose another account cache")
    schema_file = steam / "appcache/stats" / f"UserGameStatsSchema_{APP_ID}.bin"
    user_file = steam / "appcache/stats" / f"UserGameStats_{active_user}_{APP_ID}.bin"
    schema = read_binary_vdf(schema_file.read_bytes())[APP_ID]["stats"]
    cache = read_binary_vdf(user_file.read_bytes())["cache"]
    observed = dt.datetime.now(dt.timezone.utc)
    achievements = []
    for group_id, group in schema.items():
        for bit_id, item in group.get("bits", {}).items():
            display = item.get("display", {})
            user_group = cache.get(group_id, {})
            timestamp = user_group.get("AchievementTimes", {}).get(bit_id)
            achievements.append({
                "api_name": item["name"],
                "name": display.get("name", {}).get("english"),
                "name_zh": display.get("name", {}).get("schinese"),
                "description_zh": display.get("desc", {}).get("schinese"),
                "description_en": display.get("desc", {}).get("english"),
                "hidden": str(display.get("hidden", "0")) == "1",
                "stat_group": group_id,
                "bit": int(bit_id),
                "unlocked_in_local_cache": bool(user_group.get("data", 0) & (1 << int(bit_id))),
                "unlock_time_utc": dt.datetime.fromtimestamp(timestamp, dt.timezone.utc).isoformat() if timestamp else None,
            })
    snapshot = {
        "observed_at_utc": observed.isoformat(),
        "source": "Steam local binary VDF cache, read-only; server synchronization not independently verified",
        "schema_file": str(schema_file),
        "account_cache_file": str(user_file),
        "account_cache_mtime_utc": dt.datetime.fromtimestamp(user_file.stat().st_mtime, dt.timezone.utc).isoformat(),
        "pending_changes": cache.get("PendingChanges"),
        "total": len(achievements),
        "unlocked_count": sum(a["unlocked_in_local_cache"] for a in achievements),
        "achievements": achievements,
    }
    if args.update:
        knowledge_path = ROOT / "knowledge/achievements.json"
        knowledge = json.loads(knowledge_path.read_text(encoding="utf-8-sig"))
        by_name = {a["name"]: a for a in achievements}
        if len(by_name) != knowledge["catalog_total"] or set(by_name) != {a["name"] for a in knowledge["achievements"]}:
            raise ValueError("Local schema differs from recorded catalog; review before updating")
        evidence = ROOT / "artifacts/achievements" / (observed.strftime("%Y%m%dT%H%M%S%fZ") + ".json")
        evidence.parent.mkdir(parents=True, exist_ok=True)
        evidence.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        relative_evidence = evidence.relative_to(ROOT).as_posix()
        knowledge.setdefault("first_account_observation", {
            "evidence_file": relative_evidence,
            "unlocked_count": snapshot["unlocked_count"],
            "note": "首次读取账户缓存发生于 slot1 开始游玩之后；不能作为零时刻基线。",
        })
        knowledge["latest_account_evidence"] = relative_evidence
        knowledge["updated_on"] = observed.astimezone().date().isoformat()
        knowledge["account_unlocked_count"] = snapshot["unlocked_count"]
        knowledge["account_status_source"] = snapshot["source"]
        knowledge["account_observed_at_utc"] = snapshot["observed_at_utc"]
        for achievement in knowledge["achievements"]:
            actual = by_name[achievement["name"]]
            achievement.update({
                "api_name": actual["api_name"],
                "name_zh": actual["name_zh"],
                "known_requirement": actual["description_zh"] or actual["description_en"] or None,
                "requirement_source": "Steam local official achievement schema",
                "account_status": "unlocked_in_local_cache" if actual["unlocked_in_local_cache"] else "locked_in_local_cache",
                "account_unlock_time_utc": actual["unlock_time_utc"],
            })
        knowledge_path.write_text(json.dumps(knowledge, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps({"evidence": relative_evidence, "total": snapshot["total"], "unlocked": snapshot["unlocked_count"]}, ensure_ascii=False))
    else:
        print(json.dumps(snapshot, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
