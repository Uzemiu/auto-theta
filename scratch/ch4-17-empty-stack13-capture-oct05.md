# 4-17 actual13空叠体：严格ordinary持Fork1捕获域

2026-10-05，**此严格模型域穷尽，无首cargoFork1+outsideFork1**。这不是游戏全局无解。唯一输入owner `/root/ch4_1_readonly`；本助手零输入/UI/save/canonical写入，未读提示、隐藏实现、反射dump或攻略，仅私有scratch与公开实际帧。

## Actual13 source

主4-17 JSON `events[59]` / frame15085922，完整 `SDDDDWAXWWAWW`，单叶66/time13：

- C4BOX55在3,5，h1/active/contained0/container-1。
- BlueBOX56同3,5，h2/active/contained1/container55，整个组目前empty。
- free57=4,5/F1/A/h1、free62=3,4/F1/W/h1，均活/ghost0/uncontained。

root独立MCP与owner实际验证该首stack。本轮将两个active物理BOX抽象为**一个刚性body cell**，不把两层当相邻两格箱链；完整组ordinary运动依已公开的刚性组规则模型。后续高度/占有字段若有真实新差异，必须以实际帧修正。

## 一次有界图，真实穷尽

从此13，仅WASD，直到首live cargoF1入组+outsideF1。此前严格保两个freeF1；遇free融合、裸死、force、未知Goal observation、Ghost capture或doublecargo即停，不猜新合叉资源。不X，不建任何之前15/29/46的普通Goal尾。

| 项目 | 数值 |
|---|---:|
| cap / depth | 3000 / 35 |
| expanded | 2701 |
| seen | 2701 |
| pending | **0** |
| depthCut | **0** |
| exhausted | **true** |
| live cargo target | 0 |
| wait request / wait states | 0 / 0 |
| free parity mismatch | 0 |
| force boundary | 2 |
| rejected naked death | 928 |
| rejected free fusion | 254 |
| requested body moves | 438 |
| Goal observation / Ghost / doublecargo | 0 / 0 / 0 |

bodyMove438是检查转移的次数，包含随后被拒绝或重复的转移，不是438个不同终态。此次未触cap/深度上限；没有继续增cap、复跑图或遗留队列。无运行中session/liveHandle。

去重仅用组坐标和两相同Fork1演员的无序坐标，忽略两free的标签与face；普通选向不依赖已有face，完整最短边界串保原ID固定可复核。搜索在capture即停止，因此没有使用未证高叉合并或捕获高度来传播后续。

## 可达body与运输边界

穷尽域中的body仅15格：

`1,3 /1,4 /1,5 /1,6 /1,7 /2,5 /3,5 /4,5 /5,5 /6,5 /7,3 /7,4 /7,5 /7,6 /7,7`

minBodyY3 / maxBodyY7。初3,5可由右侧free向A推动，或从左侧向D推动；N目的3,6是Wall，S推者3,6是Wall。body到row3/4只能在x1/7边廊，不能从边廊水平送回内侧：向东推x1的推者在x0Wall，向西推x7的推者在x8Wall。

最短首到y7：13+`WWWW`，body1,7，free57=2,5/F1/W、free62=1,6/F1/W，仍两活。1,7不是Goal；该body角落没有安全普通回收方向，不建议把“上达7”当目标运输正例。全prefix `SDDDDWAXWWAWWWWWW` 仅模型固定结果，未发送游戏输入。

## 为何此组不能ordinary首捕获

两free初奇偶均odd：4+5与3+4。所有已接受普通输入都使每人移动恰一格，未见ordinarywait，所以两free同步翻转并始终同奇偶。

单body由pusher推动时，body初格是pusher邻格；移动后的body与pusher旧格同奇偶。而同奇偶receiver普通移动一格后，变为相反奇偶，不能同帧进入该body的终点。因此此一格刚性body不能给同奇偶两free提供双箱链的首capture。

另独立静态核main walkable组件：39个坐标，包括物理可走但会死亡的SPIKE；degree2=14格、degree3=16格、degree4=9格，**min degree2，没有degree0/1格**。只有一个body最多阻住一个相邻可走格，另外至少一个方向仍是普通合法移动（其它free是可融合角色，不是阻路墙）。若那个方向是SPIKE，游戏移动后死亡，不构成wait。闭Lock已当障碍，source无key；锁后上袋不是本组件。

这个degree核可解释穷尽图的wait0。它仅使用明确ordinary/墙/一body/无新角色机制；不把关内整体、组合关、force叶、Ghost/观测或其它首次X源排除。

## 最短被拒绝边界

| 13后尾 | 边界 | 精确情况 |
|---|---|---|
| `SS`（2） | 裸死 | pre组3,5、free5,5/3,3；末S第二free走3,2SPIKE，另一到5,4 |
| `WDW`（3） | free融合 | pre组2,5、free4,5/3,4；末W两人均到3,5；已实际F1+F1保1，但本严格域要求两freeF1，因此拒绝 |
| `DWWWWAWW`（8） | 同组反向force | pre组1,6，两free57=1,5与62=1,7/F1；末W前者向N推组，后者撞1,8Wall/0,7Wall后转S向南推同组 |

最后一条全prefix `SDDDDWAXWWAWWDWWWWAWW`。这是完整可复算的force窗口，不在本严格域传播，不把两层各一力独立算成4叶，也不预判丢哪位actor/height结果。没有完整目标尾时不建议盲执行partialforce。

## 仍缺的资源

此source13没有合法普通持Fork1捕获前缀；M130的“持叉载人组X复制整组”虽已在4-20证实，目前这里组未载人，不能直接信用该能力。新库存必须来自本严格域外、实际可复核的奇偶/角色/多个body/分支改变，而非提高3000cap或把两层算两格。

私有脚本 `scratch/ch4-17-empty-stack13-capture-oct05.cjs` 已结束一次图。`fixed A`可只固定核初始组左移及两个free的基本检查点，不会启动搜索；是否需要实际验证由owner/root决定。

```powershell
D:/nodejs/node.exe scratch/ch4-17-empty-stack13-capture-oct05.cjs fixed A
```

本报告不增加完成度/星，不修改owner的主知识库。公开实际13证据与后续模型域保持分离。
