# 已观察入口与待完成关卡（2026-10-06）

本清单由四章公开世界观测中的 ENTRY.details.LinkLevel 去重，再与 slot1 已验证完成名单交叉得到。当前已验证119关，公开记录里另有37个入口标签尚无本轮完成证据；其中包括尚未进入、未解锁或无法用现有资源抵达的入口，不能把它们全称为已尝试关卡。第五、六章的普通关尚未探索，游戏总关数仍未核全。

3-27「色散」已于2026-10-06实际完成并从待办移除：主记录event151/frame815971显示completed=true，99次指令编码与slot1的dispersion关卡记录完全一致，LevelState=3、完成计数119。解法见 [3-27](solutions/3-27.md)。

此前“已知19关未完成、序章与第一章无欠关”仅来自当时登记的16个尝试条目和额外三个未进入入口，遗漏了世界记录中的字母入口。这次按公开实体补齐；不据入口观测增加完成计数。

| 入口编号所属章节 | 尚无完成证据数量 | 标签 |
|---|---:|---|
| 第1章 | 4 | 1-F、1-G、1-W、1-Z |
| 第2章 | 4 | 2-A、2-G、2-P、2-Q |
| 第3章 | 8 | 3-19、3-26、3-37、3-B、3-C、3-P、3-U、3-W |
| 第4章 | 19 | 4-10、4-16、4-17、4-18、4-20、4-21、4-22、4-J、4-K、4-L、4-M、4-N、4-O、4-U、4-V、4-W、4-X、4-Y、4-Z |
| 第5章 | 1 | 5-X |
| 第6章 | 1 | 6-X |

5-X、6-X的入口出现在第一章世界记录里；它们不证明已到达第五、六章。4-X在多个世界观测中出现，按同一标签只计一次。

## 来源与复算

派生目录保存在本地 `artifacts/knowledge-audits/world-entry-catalog-20261006.json`，包括每个 ENTRY 的公开 id、坐标、active、blockable、pushable；这些字段属于所列历史帧，不代表当前入口可达性。

| 世界 | 公开完整源帧 | 原始记录 |
|---|---:|---|
| Chapter1 | 1801701 | [chapter1-world.json](../artifacts/slot1-playthrough/chapter1-world.json) |
| Chapter2 | 1993408 | [chapter2-world.json](../artifacts/slot1-playthrough/chapter2-world.json) |
| Chapter3 | 527971 | [chapter3-world.json](../artifacts/slot1-playthrough/chapter3-world.json) |
| Chapter4 | 1358870 | [chapter4-world.json](../artifacts/slot1-playthrough/chapter4-world.json) |

后续仅将真实完成回执、正确关卡ID、正常存档状态及动作记录核验成功的关卡从待办移除。世界关卡、相加/叠加组合记录、模型命中和已解锁入口不另加独立完成数。恢复位置见 [当前交接](handoff.md)，成就与星星另见 [成就清单](achievements.json) 与 [收集物](collectibles.json)。
