# 4-15：43叠体、44目标观测后的有限尾核查

2026-10-04，只读助手 `/root/ch3_37_cargo_revisit_oct03`。唯一游戏输入 owner 为 `/root/resume_slot1_oct03`。本轮只读正常记录及地图、写本报告与同名自有 CJS；未操作游戏、存档、提示、主知识库，未读取隐藏实现或外部攻略。

## 结论与范围

43 的异源 C4+Blue 两层载人叠体与 44A 的目标观测继承均已由 owner 正常实测，并独立读取 `artifacts/slot1-playthrough/4-15.json` 的 events[69]/[71]/[72] 核实。两支各有四个 Fork0 活 cargo 和一个 Fork0 活 free，与此前条件 seed 一致。

从这个固定 44 状态，有限普通模型每支展开208个状态，始终不能覆盖1,8；两支覆盖集合也不能合为六目标。因此没有可交给 owner 的完整普通尾。这里仅穷尽了**不允许后续新增叠箱、目标观测、ghost 或 cargo X 的自定义普通模型域**，不是游戏全局无解，也不排除主 helper 正研究的新叠箱/冰面路线。没有要求 owner 执行部分尾、暂停或回退。

## 实际入口证据

实际26后16普通输入为 `WAWWWDASSSSDSWWD`。42 时 empty C4 BOX48 在5,6，Blue cargo Fork1 在4,6和6,7，free50在7,6，faceD。43X（events[69]，undo_depth43，time46，单线 axis[0,0,0]）形成：

| 对象 | 位置 | 实测状态 |
|---|---|---|
| C4 BOX48 | 6,6 | active=true，height1，contained0 |
| Blue BOX64 | 6,6 | active=true，height2，contained1，container48 |
| cargo65 | 6,6 | active=true，ghost0，height2，container48，Fork0 |
| Blue BOX49 / cargo51 | 4,4 | active/ghost0/Fork0；4,5 ICE 的向南续滑落点 |
| Blue BOX66 / cargo67 | 5,6 | active/ghost0/Fork0 |
| Blue BOX68 / cargo69 | 7,7 | active/ghost0/Fork0 |
| free50 | 7,6 | active=true，ghost0，Fork0 |

44A（events[71]、[72]，time47）先将已有5,6的 Blue BOX66/cargo67 推到4,6，再将6,6叠体推入5,6 GOAL。不存在把已有5,6 cargo 硬合并进新叠体的模型替换：该箱真实先被推链腾走。free50进入6,6。

目标观测产生 axis[0,0,0] 和 [1,0,0] 两支。axis0保 C4 BOX48，Blue64 maskedoff/inactive；axis1保 Blue64，C4 BOX48 maskedoff/inactive。两支 cargo65 均活、height1，分别 container48/64；旁观 cargo51/67/69、free50全部继承。两支均有 active cargo at5,6/4,6/4,4/7,7 + free6,6，全Fork0、ghost0、faceA；`completed=false`。这次入口与继承已实证，报告中的后续尾仍是模型结果。

43 状态中，A 是本模型唯一保 free 的普通首方向。W，或D撞右墙后转W，会把7,7 cargo送7,8但free死7,7；S死7,5。实际已选择A并验证所需观测，因此不再建议重复探针。

## 普通模型与有限结果

复现：在工作区运行 `D:/nodejs/node.exe scratch/ch4-15-stack-goal-tail-readonly.cjs`。普通 step 引用自有 `scratch/ch4-15-readonly.cjs`，地形来自4-15实测 initial，Wall优先于同格地面 SPIKE；含已观测 ICE4,5 的一次续滑规则。

显式 seed 按44两支真实状态替换；模型不实现43X或44目标观测。分别将5,6观测后箱设为Color4/Color3，其余三箱Color3。普通移动中箱色无差异，允许推链、cargo随箱移动和 free 死于SPIKE，禁止新 box 重叠、ghost 与任何后续世界线观测；无剩余 fork，cargo X 未建模。位置/容器/存活为状态键，面向在全Fork0普通域不改变后继，故不纳入状态键。

| 每支模型指标 | 结果 |
|---|---:|
| expanded / seen / queue | 208 / 208 / 208 |
| 预设扩展上限 / 深度上限 | 6000 / 35 |
| 实际最深 / 深度截断状态 | 16 / 0 |
| 不同目标覆盖集合 | 9 |
| 1,8曾被覆盖 | 否 |
| 任取两支集合可覆盖全部六goal | 否 |

两个箱色分支结果相同。队列耗尽且没有深度截断，表示上述受限模型域被完整展开，不表示所有真实机制被穷尽。没有扩大 cap 或加入主 helper 的相邻 Blue W/X 搜索。

以下路径都从44A观测后的**单支 seed**开始，仅是可复核的普通部分结果，不是整关候选。目标按活角色覆盖计，允许额外活角色离开goal（M023）。

| 模型路径 | 覆盖目标 | 备注 |
|---|---|---|
| 空串 | 5,6 | 初始cargo覆盖 |
| W | 5,6；6,7 | free站6,7 |
| A | 3,6；5,6 | 左推链，free到5,6 |
| AW | 3,6 | free在5,7死 |
| DW | 5,6；7,8 | free从7,6推上箱，在7,7死 |
| ASW | 3,6；6,7 | 两goal部分结果 |
| ASDW | 3,6；7,8 | 两goal部分结果 |
| SAAWAWWWW | 2,7；5,6 | 下方4,4 cargo可横移到1,4，free到2,7 |
| ASSAAWAWWWW | 3,6；2,7 | 同样保留可动下方cargo，但仍未覆盖1,8 |

## 结构限制与后续边界

7,7那只Fork0 cargo 向西普通推动需要站8,7 Wall，向东为8,7 Wall；可由7,6推北进7,8，但free立即在7,7 SPIKE死。不能把它直接算作可分配给左梯的第四 cargo。

左顶goal1,8左右为0,8/2,8 Wall，普通竖运需要先把箱置1,7，再由1,6北推。1,7 SPIKE使末推者死亡；若要留下推者还需额外箱链/叠体/资源机制。当前受限域不能部署该关键箱位置，因此总共有两支各四cargo并不自动意味着六goal可全部覆盖。

最初建议的短资源 probe 是43X确认后单A，检查叠体5,6观测、cargo65继承、旁观cargo/free继承与下方4,4 ICE后 cargo。现在43/44已实测闭合，该 probe 已完成，不需要重复。其后新叠体形成、同源/异源碰撞、ICE上的叠体移动或新增观测全部留给主 helper；本报告不排除这些正常机制，也不要求任何盲试。
