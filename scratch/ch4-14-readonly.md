# 4-14 pyramid：蓝箱阻挡、同源融合及实际完成

只读帮助 owner `resume_slot1_oct03`。没有游戏输入、提示、隐藏实现读取、存档修改或主 KB 写入。

## 实际完成证据

2026-10-04 独立读取 `artifacts/slot1-playthrough/4-14.json` 的 `completion.level`/`run`：完整17输入、time17、单世界线、`completed=true`。历史保留首 `XX` 机械试验及普通undo2，0 retry。实际路线为 `SWWWSSAAWWWWAXWXX`，普通前置及三代分裂全部由 owner 分段实测。

最终六只 active cargo49/57/61/63/67/69 分别在六个目标，均 contained1、ghost0、split0；外人48仍在(3,4)active/ghost0。Color3 Blue46(6,5)/47(2,5)保持active。中部两对同源箱融合后：BOX45 active/58 inactive at(4,5)，BOX60 active/64 inactive at(4,7)，各自height1；对应loser cargo59/65 inactive。融合没有让箱体叠到height2。

## 初始结构与试验

初态 Color4 BOX45/cargo49(4,6)，cargo已 contained、fork3；外人48(4,1)fork0；Blue Color3 BOX46(5,3)/47(3,3)。六目标为(2,7)/(4,7)/(6,7)/(3,6)/(5,6)/(4,5)。两侧(2,5)/(6,5)是真实 Floor，不可虚构为墙。其侧后(1,5)/(7,5)是 Wall。

owner 先短实测 `XX`，实际在中央(4,6)发生同源箱融合，并出现普通自动教学“分裂自同一个体的箱子也会融合”。试验态三只载箱在(2,6)/(4,6)/(6,6)，各fork1；融合一份载箱active、另一份inactive并指向存活container。该试验完整保留，未计作通关。

在这一新实证之前本候选明确把第三X共享(4,5)/(4,7)作为未知，不假设合并；随后同源融合由短试验证实，完整17路线也实际验证了这两个终点的融合。

## 完整17实际路线及检查点

从试验 `XX` 普通undo2回initial，保持历史，再实际执行：

```text
SWWWSSAAWWWWAXWXX
```

| 长度 | 输入 | 实际检查点 |
|---|---|---|
| 4 | `SWWW` | free(5,4)，右Blue从(5,3)上推至(5,5)，停在刺上但外人未踏刺 |
| 8 | `SSAA` | free(4,1)，右Blue保持(5,5)，左Blue(3,3) |
| 13 | `WWWWA` | free(3,3)，左Blue也送(3,5)，原cargo(4,6)fork3面A |
| 14 | `X` | 原cargo竖分至(4,5)/(4,7)，均fork2，Blue未动，free原地 |
| 15 | `W` | 两cargo面W，free到(3,4)安全 |
| 16 | `X` | 下cargo(4,5)左右分支推Blue(3,5)→(2,5)、(5,5)→(6,5)，自身新cargo在(3,5)/(5,5)；上cargo分至(3,7)/(5,7)，四cargo均fork1 |
| 17 | `X` | 两Blue背靠Wall阻挡低cargo侧向；低cargo分别补front(3,6)/(5,6)及(4,5)，上cargo覆盖(2,7)/(4,7)/(6,7)。共享(4,5)/(4,7)同源副本实际融合，六goal均有活cargo，completed=true |

这一步利用 cargo 分裂分支推Blue完成最后侧向部署，因此唯一free无需从(3,5)/(5,5)刺格横推蓝箱而牺牲。初始对称cargo只有静态墙的三X枚举最多覆盖四目标，是受限条件，不是全关无解；Blue位置改变fallback使六目标可覆盖。

## 自有模型范围

`scratch/ch4-14-readonly.cjs` 读取实际初图，并仅重放13步普通前置及显式 cargo-X几何。普通BOX链按已验证相邻推移，Wall优先，外人落SPIKE死亡；所有13输入前置外人均安全。X子箱保持父face，向Blue出生格时推动Blue，侧分支若Blue背墙则改用front。模型把共享出生点打印为 `SHARED_BIRTH_UNKNOWN`，不自行伪造实体合并。

模型输出几何六目标完全覆盖；root 独立核本路线，owner完整实际执行确认，最终JSON再次独立核验。模型仍保留 `SHARED_BIRTH_UNKNOWN` 输出以准确表达其实现边界；真实融合结论来自实际观察，而不是模型自行把重叠对象去重。
