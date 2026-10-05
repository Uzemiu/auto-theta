# 4-17：固定8后的首次空异源叠箱

2026-10-05，**ACTUAL13 VERIFIED**。唯一输入owner `/root/ch4_1_readonly`；本助手零游戏/UI/桥接输入，未改存档、canonical或主JSON，不读隐藏实现、反射dump、提示或攻略。

主JSON events59/frame15085922已真实完整13：C455在3,5 h1/active/contained0/container-1，Blue56同3,5 h2/active/contained1/container55，两外free57=4,5/F1/A及62=3,4/F1/W均活ghost0。单叶66/time13，无force/dialog。root另独立MCP核；以下“尚未实测/待height”保留为候选阶段历史，现13结果已准确匹配。后续source13严格ordinary持叉capture图另见 `ch4-17-empty-stack13-capture-oct05.md`，已2701/2701/0pending/0cut穷尽，无hit；不增加本first-stack阶段搜索或泛称关卡无解。

新严格阶段已有可复用正窗口：当前实际8接 **`WWAWW`**（5），完整 **`SDDDDWAXWWAWW`**（13）。两空原箱同步到3,5；预计两个free仍F1、活、不同格；没有cargo、free融合、force或额外X。固定复算在首个stack即停，没有启用叠体后捕获/Goal域。

## 实际源与旧范围

- 最新实际源：主4-17 JSON `events[54]` / frame14910488，正常undo3恢复 `SDDDDWAX`：P57=7,3、P62=5,3，均F1/S/contained0/ghost0；emptyC4BOX55=3,4、emptyBlueBOX56=5,4。
- 两Fork已inactive，未取得普通key；上区Lock仍不可通行，本串不接近它们。
- 原193首cargo域的 `stack` 拒绝样本已保存相同 `WWAWW`。它是在首叠箱处停止，不是完整排除本严格域。原193的capture正例25与本空stack13不同。
- 旧报告没有已穷尽的“先空stack并保两freeF1”阴性证明；已有5步完整正常窗口足够交owner核，不需要重新跑cap4000/depth35。
- **本次新BFS expanded=0，无队列、无liveHandle，固定审计5动作。** 不把重放写为新4000搜索进程，也不把它称最短严格stack路径。

## 8到13逐态（模型）

| 总输入/动作 | C4BOX55 | BlueBOX56 | P57 F1 | P62 F1 |
|---|---|---|---|---|
| 8 actual | 3,4 | 5,4 | 7,3/S | 5,3/S |
| 9 W | 3,4 | **5,5** | 7,4/W | 5,4/W |
| 10 W | 3,4 | 5,5 | 7,5/W | **5,3/S** |
| 11 A | 3,4 | 5,5 | 6,5/A | 4,3/A |
| 12 W | 3,4 | **4,5** | **5,5/A** | **3,3/A** |
| 13 W | **3,5** | **3,5** | **4,5/A** | **3,4/W** |

10的W：P62试推Blue5,5向5,6，5,6Wall；A4,4Wall，再S5,3安全。12的W：P57北6,6Wall后转A，将Blue5,5推4,5；P62北4,4Wall后转A到3,3。

13的两个请求严格不同对象：

- P57在5,5，W试5,6Wall，fallbackA推 **Blue56** 4,5→3,5，自己停4,5。
- P62在3,3，W直接推 **C455** 3,4→3,5，自己停3,4。

两个BOX原格/推者/结束格全部是真Floor且无SPIKE；13前各Box单独只受一个方向，所以不是“同一Box不同force方向”分线。两个free终点不同格，均不在3,5，不触capture/融合/死亡；Fork仍各1。整个5动作没有之前stack或cargo。

13的异源碰撞仅用M052等公开已知行为作为stack候选：两个原Box分别55/56，并非同源融合。底层/上层的具体ID、height、contained/container、是否稳定刚性组合与任何自动教学必须读取owner实际13公开帧后确认，私有脚本只输出同格碰撞几何，不擅自分配h1/h2，也不将Box视为inactive。

## 后续持叉capture的真实缺项

此新源的价值是“两个独立空对象在同一个可移动body cell + 两个freeF1”，不同于先capture单箱再X的29/46库存。若随后能合法将其中一个F1角色捕入组，M130在4-20已真实证明持叉载人双层组可以X复制整组；但本文**没有合法的13后持叉capture前缀**，不能把两层当两格链补预算。

root提供的捕获构型 `stack3,3 + receiver1,3 + pusher4,3`，单A时receiver因左/南Wall转D到2,3，pusher把组移2,3，可作为以后条件。不过其中两free奇偶不同（1+3偶、4+3奇），而本13两个free均奇（4+5、3+4）。只在无wait、每人每动作都走一格的普通规则内，二者同步维持同奇偶；同一刚性body一次位移不具有两个相邻body链的偶数长度。因此需要另证合法等待/奇偶转换、其它捕获机制或不同源，不能由“层数2”直接宣布Fork1capture。

这里没有穷尽所有等待点/后续机制，不称全局不可能。第一阶段已按要求停在首emptyStack，让实际height/刚性字段先可核。

另已核root撤回的假设：free5,3在globalS会直接走5,2SPIKE，不能假定fallbackA。本文全13用globalW、5,6Wall反弹，不采用那个错误S/A构型。

## 文件与复算

`scratch/ch4-17-first-empty-stack-oct05.cjs` 只读latest actual8；严格stop条件为firstEmptyStack/force/capture/freeFusion/nakedSPIKE。只有前4动作更新状态，第5返回firstEmptyStack候选，不传播未知高度或后续capture。无搜索函数，无游戏调用。

```powershell
D:/nodejs/node.exe scratch/ch4-17-first-empty-stack-oct05.cjs
```

实际F1+F1自由人融合探针已在主JSON events50/52证明只保1，undo3恢复8见events54；本文正窗口没有融合，不受该库存损失影响。没有新增提示、实际输入或完成/星计数。
