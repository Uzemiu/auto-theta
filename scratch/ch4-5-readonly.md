# 4-5 鸵鸟只读分析

2026-10-03；唯一输入owner resume_slot1_oct03。仅读主JSON、有限模型和普通方向推导；无游戏输入、提示、攻略、隐藏实现、存档或主KB编辑。

## 实际地图与资源

runtime bottleneck，size8×8；初始free4,5及完全夹困active PLAYER4,1（其周围四墙、fork0，不能普通移动，模型只忽略其不变位置，不冒充inactive）；Color4 BOX3,3；叉6,3/6,1；BUTTON6,4→GATE6,2；BUTTON1,1→GATE2,7；目标7,7，左邻6,7刺。

```text
8 #########
7 #.g...sG#
6 #.#######
5 #...P...#
4 #.....b.#
3 ##.B..f.#
2 #..###g##
1 #b##P#f##
0 #########
```

owner实际5输入 `DDSSX`，外free5,3/7,3均fork0，BOX3,3，底叉6,1仍active，两门关闭；原4,1人仍active原地。

## 关键过门桥段

载BOX推到1,7后，普通向右推动需要pusher0,7墙，不能按平面直线直接过门。也不能普通把空BOX压BUTTON1,1：进入1,1只能从1,2向下，但pusher1,3是墙。

不需要第三名外人或永久箱压button。保留cargo fork1，将BOX运1,7、外人1,6。外人 **SSSSSAW** 经1,5→1,4→2,4→2,3→2,2→1,2→1,1；最后W遇1,3和0,2墙，实际向下入button，同时原地cargo收到输入W而面上。此时GATE2,7开。

单X（必须实测）：cargo1,7面W左0,7墙、右2,7已开门、前1,8墙，只右侧有效，应把载BOX移2,7；fork0外人留1,1。载BOX占gate2,7保持该门开放，外人可离button，**WDWWAWWW** 经1,2→2,2→2,3→2,4→1,4→1,5→1,6→1,7绕至箱后。再 **DDDDD** 连推载BOX2,7至goal7,7，外推者最终在6,7刺死。单侧箱内X与长期占gate都必须用实际状态核验。

## 有限中段模型

scratch/ch4-5-readonly.cjs：固定5态两外人，right叉6,1拾取，两门压力和占门保持，closedgate单人等待，同刻装箱与cargo运输。没有模拟X/未知Color4冲突，完全夹困4,1只不计入移动搜索。

首个30k扩展上限结果fork1 cargo被封BOX6,2，常规不能保持fork向上回收，拒绝采用。加入该目标专用剪枝BOX y<3 /x7（普通无法向上/向左回收且仍需保叉）的第二次同上限查找，找到可回收fork1 cargo5,5。未按owner建议扩大到200k盲搜。

从5态27方向 **WAAASASDWWWWSSDDDSSWADSDWWW**：

| 分段 | BOX | 外人 /H（将持叉） |
|---|---|---|
|WAAASASDWWWWSS 14|3,4|2,4 /3,3|
|DDDSSW 6|6,5|6,4 fork0 /6,2 fork1|
|ADSD 4|6,5|7,3 /6,3 fork1|
|WWW 3|5,5|6,5 /cargo5,5 fork1|

DDD先把BOX从3,4推至6,4压button，SS让H拾6,1叉，W移BOX到6,5；ADSD中A把H送回6,1并关门，D由外人回button6,4而H在封闭6,1等待一个动作，S释放H至6,2，D离窄廊。末WWW第3W，H5,4向上到5,5，另一人7,5撞北7,6墙转A推BOX6,5→5,5，与H同时汇入而捕获其叉1。

再 **AAAASAWW** 8：AAAA横推5,5→1,5，外人2,5；SA绕1,4；WW载BOX到1,7、外人1,6。随后上文button7+X+return8+push5桥段。候选全61有效输入，直到实测completion之前不作完成声明。

## 真实完成闭环

已独立读取主JSON completion：**completed=true/time61**，完整有效instructions 61字，0undo/0retry：

`DDSSXWAAASASDWWWWSSDDDSSWADSDWWWAAAASAWWSSSSSAWXWDWWAWWWDDDDD`

27中段、运输8、button7、单X和最终13方向全部真实匹配。time40载BOX/cargo1,7 fork1+外人1,6；time47外人1,1踩button、cargo面W、GATE2,7 blockable=false；time48单X仅原BOX和cargo移2,7，fork0，没有第二新容器。原地无叉外人仍1,1；这是单侧箱内分裂的有效位移实证，不概括成每次都产生两箱。

event13/time49：外人离button到1,2，BOX继续占gate2,7，blockable=false保持，证明桥段可回收同一推者。末time61：BOX和active contained cargo7,7 ghost0，外推者6,7 inactive/ghost1；初始完全夹困PLAYER4,1仍active/ghost0，未救出仍满足本关目标并完成，不将其状态改称inactive。

因此无需第三外人、永久button箱或先取双叉。独立helper完成4-5，owner负责主知识库及后续关卡。
