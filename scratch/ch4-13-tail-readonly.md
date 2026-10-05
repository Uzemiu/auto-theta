# 4-13 矩阵：等待/捕获条件及两代载箱分裂的只读核对

2026-10-04。助手 `/root/ch3_37_cargo_revisit_oct03`；唯一游戏输入 owner `/root/resume_slot1_oct03`，SaveSlot1。只读主JSON普通观察、已有机制与独立有限模型；未输入游戏、读写存档、修改主KB，未用提示/攻略/隐藏实现，未做捕获或资源大BFS。

## 地图与普通模型

来源 `artifacts/slot1-playthrough/4-13.json` 实际 initial 零态，runtime matrix，size8,8；初BOX52=2,2，PLAYER53=6,1，三枚forkKEY在6,2/5,6/5,5。

目标1,5/3,5/1,7/3,7。SPIKE1,6/2,5/2,6/2,7/3,6；其中1,6/3,6没有实体Wall，2,5也是裸露刺，不能让活外人穿过。5,5与5,6的左右4,5/6,5/4,6/6,6都是真Wall，5,8也是真Wall。

有限模型显式采用root/mainhelper提供的配对：5,3 button→5,4 ID0 gate；6,7 button→5,7 ID1 gate。零态本身所有门闭，不能仅凭Button没有ID的details推出配对；本助手不额外操作测试它。普通门占用保持沿M049/M099，普通左转、拾叉和freeX沿真实教学机制。

自有 `scratch/ch4-13-tail-readonly.cjs` 引用观察模型 `stack-cargo-readonly.cjs`。仅有限重放一条给定前缀与两个条件局部动作，不搜索。模型不实现一般cargoX；末两代X明确按M098的活Color4复制规则及真实目标几何静态代换，不装成游戏实现或实测。

## 原等待方向的范围

条件BOX5,6、Fork2外人5,5、两门闭：该人上推箱将进入关闭5,7门，下为关闭5,4门，左右真Wall，确可普通原地等待并保叉。

但另一个外人抵达5,3按钮时，5,5和5,3都为偶格。最终等待状态可能将先前奇偶差消掉；随后普通邻移仍让两人同奇偶，不能直接保证达到原拟capture站位“free5,7（偶）/holder5,4（奇）”。这只是该release安排的限制，不排除所有等待构造。

如果**假定**已构造BOX5,6、free5,7、holder5,4，gate1/gate0分别被两人占住，同W的局部capture本身几何正确：上人撞5,8墙，左4,7墙，再向S把箱推到5,5；下holder向W移动5,5，进入箱的最终位置。两个起点相差3格、异奇偶，移动后捕获并不矛盾。缺陷在先前可达前置，不能把这个条件动作当完整prefix。

## root修正的反向等待/捕获：局部通过

更好条件为 BOX5,5、holder5,6，两门闭；左右与北门堵住，向S推箱的背后5,4门也闭，holder可fullywait保Fork2。

另一个Fork2外人从下区抵达5,3 button时，在该动作的旧closed时序holder再等一拍。下一W：

- free5,3向W进入已开的5,4。
- 旧waiter5,6向W遇关闭5,7门、转A遇4,6墙、转S推BOX5,5→5,4，自己落5,5。
- 最终BOX5,4捕获刚移动到5,4的外人，cargo仍Fork2，旧waiter成为free5,5 Fork2。

本助手有限普通模型单W准确得到上述一cargo一free；不是将旧waiter直接称为cargo。再SS可将cargo5,4→5,3 button→5,2，外人5,5→5,4→5,3，全程叉2保留，箱仍可运输；避免再S把箱推到row1。本轮没有搜索到这个trap的同步前置，主helper后来另提供完整正候选，因此停止新前置搜索。

## 完整66候选的独立普通前61重放

主helper/root给定串：

`AAAAWAWDDDSDDWDWWWWWWWWAAXSSAWWWWADDDAADDDWDWWAADWAADSAAASAWWWWXAX`

长度66。末5为 `WWXAX`；本助手独立从实际initial完整重放前61，普通模型全部有效：

| 模型输入数 | 箱/角色 |
|---|---|
| 25 | BOX5,2；P5,3 Fork3、faceS |
| 26，单X | BOX5,2；双free6,3/4,3 Fork2、faceS |
| 51 | BOX/cargo5,3 Fork2；free5,4 Fork2 |
| 61 | BOX/cargo2,4 Fork2；free2,3 Fork2，均faceW |

这里第25后**直接X**；不能套用早先“D再X产生6,2/7,3”的不同候选状态。前61由ordinary模型支持，不含cargoX。此为实测前的独立有限重放；下文另列owner完成后的真实主JSON核验。

## 两代X覆盖四目标

从第61模型态：cargo2,4 Fork2 /free2,3 Fork2。

1. W：cargo2,5刺内仍活；free2,4安全，叉2保留。
2. W：cargo2,6刺内仍活、faceW/Fork2；free落2,5刺死亡。此后唯一active人是cargo，死外人即便保留split字段也不参与X。
3. X：cargo朝W，左右1,6/3,6均有效地板、均SPIKE但无Wall。按M098复制两活Color4容器；两cargo继承Fork1、faceW。不存在外人或其他箱占据这些落点。
4. A：两个cargo不自行移动，只改faceA，Fork1仍保留。
5. X：左cargo1,6上下落点1,5/1,7，右cargo3,6上下落点3,5/3,7；四个落点全部GOAL、无Wall、无重叠。按M098两cargo各再复制，最终四活cargoFork0覆盖全部目标。

两代只使用有效侧向，无front fallback；没有借SPIKE当阻挡，也没有让已死外人响应最后X。实测前这段仅为有限静态M098几何审计，结果已及时发root/owner/mainhelper；现已由下面的真实观察闭环。

## owner实际66完成后的只读闭环

本助手重新只读核对主JSON：`run.action_count=66`、上述完整串与`run.actions`相同，`run.completed=true`；`completion.level.completed=true`，末timeline time66。root/owner报告本次0undo、0retry；本助手不读取存档，未核存档计数，不将JSON中的`undo_depth=66`误作undo次数。

真实`events[11]→events[13]`（time33→34）直接证实原方向的普通等待：BOX52固定5,6；两门47/48均`blockable=true`；P53停5,5，faceW→A、`split=2`保留；P54从2,4移到2,3、同样`split=2`。等待人留在偶格，另一人从偶格移到奇格，实际普通等待保叉并改变两人相对奇偶。前文原release安排的限制不能扩展成这个trap不可用；主线并没有采用本报告反向trap的条件局部候选。

真实`events[19]`（time51）：BOX52在5,3，P54同格`contained=1/container=52/split=2/ghost=0/active=true`；外P53在5,4、`split=2`。这是保两叉capture的实测，不只依赖普通模型。

真实末五动作与代换逐项一致：

| 主JSON事件 | time | 真实关键实体 |
|---|---:|---|
| events[21] | 61 | BOX52/P54在2,4、cargo叉2/faceW；P53在2,3叉2 |
| events[23] | 63 | BOX52/P54在2,6、cargo活/ghost0/叉2；P53死于2,5、activefalse/ghost1 |
| events[25] | 64，X | BOX52/P54在1,6，新增BOX55/P56在3,6；两cargo活/ghost0/contained1/叉1/faceW |
| events[27] | 65，A | 箱位不变，两cargo改faceA、保叉1；死P53仍不活动 |
| events[29]及completion | 66，X | P54/BOX52在1,5；P56/BOX55在3,5；新增P58/BOX57在1,7；新增P60/BOX59在3,7 |

末四cargo全部`active=true/ghost=0/contained=1/split=0`，覆盖四个GOAL；P53仍死于2,5，虽`split=2`字段保留但未响应两次X。Color4刺内的两代载箱分裂与四目标覆盖已由真实主JSON证实。本模型仍不实现通用cargoX，静态代换只能代表所列站位、朝向与侧向落点，不能外推其他fallback或未知容器行为。

## 当前范围

完整66已由owner正常实测完成，并由本助手只读主JSON独立核实上述等待、保叉capture及末两代分裂。本助手已停止额外搜索；反向trap仍只是未构造同步前置的条件候选。存档及全成就计数由root/owner另核，本助手不读写save或主KB，不作全局不可解结论。
