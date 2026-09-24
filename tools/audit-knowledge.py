"""Cross-check recorded slot1 completions against evidence and the live save (read-only)."""
from __future__ import annotations

import datetime as dt
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KNOWLEDGE = ROOT / "knowledge"


def read(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def completion_evidence(value, internal_id: str) -> bool:
    if isinstance(value, dict):
        if value.get("completed") is True and (
            value.get("level_id") == internal_id
            or (value.get("id") == internal_id and value.get("world") is False)
        ):
            return True
        return any(completion_evidence(child, internal_id) for child in value.values() if isinstance(child, (dict, list)))
    if isinstance(value, list):
        return any(completion_evidence(child, internal_id) for child in value)
    return False


def main() -> None:
    progress = read(KNOWLEDGE / "progress.json")
    active = progress["active_playthrough"]
    if active["save_slot"] != 1:
        raise ValueError("Expected user-authorized slot1")
    save = read(Path(active["save_file"]))["PersistenceData"]["value"]
    results = []
    loaded_evidence = {}
    for label in active["verified_completed_levels"]:
        entry = progress["levels"][label]
        run = entry.get("slot1_run", {})
        runtime_id = run.get("runtime_level_id", entry["internal_level_id"])
        record_key = run.get("save_record_key", entry["internal_level_id"])
        relative_evidence = run.get("evidence_file", entry.get("evidence_file"))
        result = {
            "level": label,
            "internal_id": entry["internal_level_id"],
            "runtime_level_id": runtime_id,
            "save_record_key": record_key,
            "solution_file_exists": (KNOWLEDGE / entry["solution_file"]).is_file(),
            "evidence_file": relative_evidence,
            "completed_evidence_found": False,
            "save_record_present": record_key in save.get("LevelRecords", {}),
            "save_level_state": save.get("LevelStates", {}).get(entry["internal_level_id"]),
            "save_level_state_completed": save.get("LevelStates", {}).get(entry["internal_level_id"]) == 3,
        }
        evidence = None
        if relative_evidence:
            evidence_path = (KNOWLEDGE / relative_evidence).resolve()
            if evidence_path.is_file():
                if evidence_path not in loaded_evidence:
                    loaded_evidence[evidence_path] = read(evidence_path)
                evidence = loaded_evidence[evidence_path]
                result["completed_evidence_found"] = completion_evidence(evidence, runtime_id)
        if run.get("completion_kind") == "combined":
            component_ids = run.get("component_ids", [])
            operator = run.get("combination_operator", "+")
            result["combined_mapping_consistent"] = (
                len(component_ids) >= 2
                and entry["internal_level_id"] in component_ids
                and operator in ("+", "×")
                and record_key == operator.join(component_ids)
                and bool(run.get("combined_level"))
                and bool(run.get("runtime_level_id"))
            )
            title_texts = (evidence or {}).get("initial", {}).get("ui", {}).get("texts", [])
            result["combined_title_found"] = any(
                text.get("text") == run.get("combined_level") for text in title_texts
            )
            result["save_component_states_completed"] = bool(component_ids) and all(
                save.get("LevelStates", {}).get(component_id) == 3 for component_id in component_ids
            )
        actions = run.get("actions")
        action_count = run.get("action_count")
        result["action_source"] = "slot1_run"
        if actions is None and not run and result["solution_file_exists"]:
            # Early tutorial entries kept their actual route in Markdown only.
            solution = (KNOWLEDGE / entry["solution_file"]).read_text(encoding="utf-8-sig")
            route_match = re.search(r"^- 操作：`([^`]+)`", solution, re.MULTILINE)
            count_match = re.search(r"^- (?:关内)?动作数：(\d+)", solution, re.MULTILINE)
            actions = route_match.group(1) if route_match else None
            action_count = int(count_match.group(1)) if count_match else None
            result["action_source"] = "solution_markdown"
        # T=8 is verified by 2-1's actual TAB input and saved breakthrough record.
        result["action_count_consistent"] = isinstance(actions, str) and len(actions) == action_count
        result["action_encoding_supported"] = bool(actions) and set(actions) <= set("WASDXT")
        if result["action_encoding_supported"]:
            encoded = actions.translate(str.maketrans("WASDXT", "123458"))
            result["actions_match_saved_record"] = encoded == save.get("LevelRecords", {}).get(record_key)
        results.append(result)
    issues = []
    for result in results:
        for check in ("solution_file_exists", "completed_evidence_found", "save_record_present", "save_level_state_completed", "actions_match_saved_record", "action_count_consistent", "action_encoding_supported", "combined_mapping_consistent", "combined_title_found", "save_component_states_completed"):
            if result.get(check) is False:
                issues.append({"level": result["level"], "check": check})
    labels = active["verified_completed_levels"]
    if len(labels) != len(set(labels)):
        issues.append({"check": "duplicate_completed_levels"})
    expected_save_count = active.get("baseline_completed_count", 0) + len(set(labels))
    if save.get("accomplishLevelCount") != expected_save_count:
        issues.append({
            "check": "slot1_completion_count",
            "expected_from_knowledge": expected_save_count,
            "actual_in_save": save.get("accomplishLevelCount"),
            "note": "Live play may temporarily precede knowledge updates; recheck after the checkpoint is written.",
        })
    global_count = sum(e["status"] == "completed_verified" for e in progress["levels"].values())
    if global_count != progress["verified_completed_count"]:
        issues.append({"check": "global_completed_count"})
    observed = dt.datetime.now(dt.timezone.utc)
    report = {
        "observed_at_utc": observed.isoformat(),
        "scope": "Only recorded slot1 levels; not an all-level or all-achievement completion claim. Live files may change during play.",
        "recorded_slot1_completed": len(labels),
        "save_accomplish_level_count": save.get("accomplishLevelCount"),
        "checks": results,
        "issues": issues,
    }
    output = ROOT / "artifacts/knowledge-audits" / (observed.strftime("%Y%m%dT%H%M%S%fZ") + ".json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"report": output.relative_to(ROOT).as_posix(), "recorded": len(labels), "save_completed": report["save_accomplish_level_count"], "issues": issues}, ensure_ascii=False))


if __name__ == "__main__":
    main()
