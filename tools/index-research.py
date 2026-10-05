"""Generate a filename index without executing research or reading game code."""
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRATCH = ROOT / "scratch"


def category(name: str) -> str:
    if name.startswith(("ch2-G", "2-G")):
        return "2-G 模型、校准与固定候选"
    if name.startswith(("ch3-", "3-")):
        return "第三章关卡"
    if name.startswith(("ch4-", "root-ch4-")):
        return "第四章关卡"
    if name.startswith(("chapter", "nid", "root-world", "icecart")):
        return "世界导航与收集物"
    return "基础模型与历史研究"


def main() -> None:
    groups = defaultdict(lambda: defaultdict(dict))
    for path in sorted(SCRATCH.iterdir()):
        if not path.is_file() or path.name == "README.md" or path.suffix not in {".md", ".cjs", ".py", ".json"}:
            continue
        groups[category(path.name)][path.stem][path.suffix] = path.name
    lines = [
        "# 研究文件索引", "",
        "当前游戏与暂停状态以[交接记录](../knowledge/handoff.md)为准。这里保存只读模型、有限计算报告、实际记录审计及历史候选；文件名或模型命中不代表实际完成。", "",
        "- 当前未实测的3-26尾：[23步候选与逐态](ch3-26-live92-two-observers-oct05.md)。按钮对应已用96个公开历史样本校准，光学动态仍需实测。",
        "- 2-G巨型队列：[保存事故](ch2-G-checkpoint-save-failure-oct05.md)。唯一旧前沿已丢失，原子分块保存修复不能恢复旧队列。",
        "- 十份历史JSON输出归于[results/](results/README.md)，原`.tmp`引用已更新，内容哈希不变。",
        "- 游戏主记录、存档备份和大型`.v8`留在本地`artifacts/`，不纳入Git；记录清单与哈希见[原始证据清单](../knowledge/artifact-inventory.json)。",
        "- 索引可用`python tools/index-research.py`重新生成；不会执行任何游戏操作或搜索。", "",
    ]
    for title, rows in sorted(groups.items()):
        lines += ["## " + title, "", "| 名称 | 脚本 | 报告 | 数据 |", "| --- | --- | --- | --- |"]
        for stem, files in sorted(rows.items()):
            scripts = " / ".join(f"[{ext[1:]}]({files[ext]})" for ext in (".cjs", ".py") if ext in files) or "—"
            report = f"[md]({files['.md']})" if ".md" in files else "—"
            data = f"[json]({files['.json']})" if ".json" in files else "—"
            lines.append(f"| {stem} | {scripts} | {report} | {data} |")
        lines.append("")
    (SCRATCH / "README.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"Indexed {sum(len(rows) for rows in groups.values())} research groups")


if __name__ == "__main__":
    main()
