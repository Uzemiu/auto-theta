# Chapter1 WorldGoal91,33与东侧入口验收（只读）

2026-10-06。只读公开journal、知识库与当前进度；没有游戏输入、提示、存档改写或隐藏实现访问。仅本MD，无CJS/JSON/后台进程。

## 实际验收：WorldGoal尚未到达/完成

主 `artifacts/slot1-playthrough/chapter1-world.json` 当前122个events中，筛选level.id=Chapter1/world=true的42份世界观测：活PLAYER实际站到GOAL[91,33]的记录 **0**，Chapter1世界completed=true的记录 **0**。活玩家保存坐标范围x=1..43、y=1..48。这些记录没有证明本轮WorldGoal真正占据或完成；不能以已通过第一章成就/Lift升层替代。

历史[38,48]真实显示“前往上层”，confirm进入Chapter2；该楼梯机制与东WorldGoal[91,33]不同。知识 `world-mechanics.md` 也明确记录升层后Chapter1 LevelStates没有完成项。当前章节地图3→4→1→2→3循环仅证明已解锁world列表，不把ENTRY5-X/6-X当作第五/六章地图。

| 已有Lift事件 | frame | 坐标/世界指令 | UI |
|---:|---:|---|---|
|63|1951558|[[38, 48]] / `DDDDDDDDDDDDDDDDDDDDDDWWWAWWDDDWWWWWW`|['前往上层']|
|65|1954384|[[38, 48]] / `DDDDDDDDDDDDDDDDDDDDDDWWWAWWDDDWWWWWW`|[]|

## 最新完整公开几何

event120/frame317929，Chapter1世界，axis0/time0，instructions为空，PLAYER74[9,1]/Fork1/key0，size93,52/anchor0,0，589个tiles。paused=true/input_locked=true，因此只作为地图快照，不能称当前live。

- GOAL0 `[91,33]` active/floor/nonblockable。
- LOCK4 `[44,33]` active/blockable，是通东部前的具体切口。
- 公开源没有任何KEY实体；不存在可直接拾取的普通世界钥匙。COL101[38,14]红叉已inactive，不是普通锁钥匙。
- 没有BOX或PRISM。公开可移实体是ENTRY69/3-X `[72,40]` 与ENTRY70/4-X `[72,43]`，两者active/blockable/pushable=true；它们都已在Lock44,33东侧。不能说全图没有可移物体，也不从Entry类型假定已经载人或可携普通钥匙。
- 东部Gate33 `[72,32]` closed，Button34 `[72,35]`；同关配对仅由当前实体及既有知识登记，不因将来到目标自动开门。
- INTERACTABLE73 `[38,39]` active/blockable，为已有正常碑文/互动范围；不是91,33的替代。

| 入口 | 坐标 | 当前字段 | 位于何处 |
|---|---|---|---|
|1-Z|[77, 33]|active, nonblockable, AlwaysEnable=true, pushable=false|LOCK44,33之后的东部；当前连邻位也不在西部安全组件|
|1-W|[68, 33]|active, nonblockable, AlwaysEnable=true, pushable=false|LOCK44,33之后的东部；当前连邻位也不在西部安全组件|
|1-F|[86, 29]|active, nonblockable, AlwaysEnable=true, pushable=false|LOCK44,33之后的东部；当前连邻位也不在西部安全组件|
|1-G|[86, 25]|active, nonblockable, AlwaysEnable=true, pushable=false|LOCK44,33之后的东部；当前连邻位也不在西部安全组件|
|5-X|[72, 46]|active, nonblockable, AlwaysEnable=true, pushable=false|LOCK44,33之后的东部；当前连邻位也不在西部安全组件|
|6-X|[72, 49]|active, nonblockable, AlwaysEnable=true, pushable=false|LOCK44,33之后的东部；当前连邻位也不在西部安全组件|

## 单锁切口审计，不能当作执行路径

不是追加旧410正常导航图预算来找同一目标。这里使用封锁投影作对照，另外核单锁反事实切口及3-X/4-X移动水晶的二次阻隔；两个四邻安全地板**连通性上界**投影：乐观允许所有nonblockable ENTRY穿行，把ICE允许逐格停下，不模拟真实入口加载/滑动动作；当前blockable实体保留。它比普通可执行单free路径更宽，阴性可以识别地图切口，阳性不授予真实路线。

当前封锁投影：expanded=410/seen=410/pending=0，GOAL及六目标ENTRY与其邻位均不在spawn9,1组件。唯一可达LOCK44,33邻位为[[43, 33]]。
仅在**反事实计算**中去掉LOCK44,33的blockable格（没有修改任何游戏/存档/主数据）：expanded=528/seen=528/pending=0，GOAL及1-F/G/W/Z四入口连通，但5-X/6-X仍不连通：固定的可推ENTRY3-X72,40与4-X72,43在同一北向72列挡路。这证明普通世界锁是第一切口，北列移动水晶是另一待操作边界；不能证明游戏允许打开锁、移动后自动进关或入口可自由穿过。
成功投影复核共938节点；首次输出阶段因list-as-set-key格式错误退出后重做同两投影，实际本任务总节点1876，低于3000，无扩大路径搜索。

反事实最短Goal地板路径还会跨这些当前未完成ENTRY：[{'pos': [68, 33], 'entry': '1-W'}, {'pos': [77, 33], 'entry': '1-Z'}]。因此即使未来合法获得钥匙，也不能把连通性投影直接交给owner当完整WorldGoal前缀。

## 可以交给owner的边界

**本轮没有尚未实测的正常WorldGoal/交互短前缀。** GOAL91,33及东部入口在当前key0、无已可达可搬实体的单free安全上界之外；不建议盲走Lock、强切scene、修改存档或以AlwaysEnable字段当第5/6章解锁。下一有效证据必须来自正常公开机制给出钥匙/跨越切口资源，或出现实际可操作的新world传送/UI；本报告没有这种正例。

5-X/6-X仅是第一章地图里LinkLevel字段对应的关卡入口命名，不能当作第五/六章world已解锁，也不等于关卡已经进入/完成。有限切口阴性不证明所有跨关组合、世界机制或后续内容不可达。

北向入口的准确固定顺序：Button72,35 → 2-X72,37（nonblockable）→ 3-X72,40（blockable/pushable）→ 4-X72,43（blockable/pushable）→ 5-X72,46 → 6-X72,49。北列各格有SOLID，后两入口自身并没有关闭；真正当前前置分别是合法越Lock44,33、处理前面两枚可移水晶及实际进入行为。没有把这些条件提升为现成路线。
