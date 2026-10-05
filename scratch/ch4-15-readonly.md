# 4-15 align：实际前置与有限模型边界

只读分析，不操作游戏、不读取提示/隐藏实现、不改存档或主知识库。唯一输入 owner 为 `resume_slot1_oct03`。截至本稿，关卡未完成；以下条件尾不能当作完整解。

## 已实际验证的11前置

```text
WAASAWWWWSX
```

初态 player50(7,1)、Color4 BOX48(6,2)、Color3 Blue49(2,2)，叉(4,2)/(4,5)/(4,6)；ICE(4,5)、SPIKE(4,6)、Wall(4,7)。

1. `WAASAWWW` 八输入：Color4 BOX送至(4,6)，第八W箱从(4,4)进入ICE(4,5)自动滑到(4,6)，推者停(4,4)；player已取首叉、fork1。instructions8/time9。
2. 单W：player进入ICE(4,5)拾叉，因BOX(4,6)背Wall(4,7)不可推而停止；playeractive/ghost0/fork2，最后叉(4,6)仍active。instructions9/time10。
3. `SX`：先退(4,4)，朝S分裂至 free50(5,4)/free51(3,4)，两者fork1、faceS、active/ghost0。BOX仍(4,6)、Blue仍(2,2)，最后叉仍active。instructions11/time12，0undo/0retry；尚未有完整通关尾。

这证实“solo经过4,5必死”的简单假设不成立：背墙的箱阻止继续冰滑，可以安全拾ICE叉。若没有该挡箱，直接滑入(4,6)SPIKE的死亡风险仍存在；并没有从此推导能空身取完三叉。

## 有限查找范围

模型 `scratch/ch4-15-readonly.cjs` 读取真实墙、SPIKE与唯一ICE，支持两BOX普通推链、free X、同刻捕获与ICE微tick。新captured角色若在SPIKE则区分ghost1，不能冒充普通livecargo ghost0。没有实现cargo X、不同来源叠箱、世界线冲突或inactive历史角色的再捕获。

- actual11后仅WASD，保持两fork1与两原BOX、避BOX y1弃置：3056展开/3056seen，未找到live Color4cargo fork≥1+外free fork≥1。
- 同域只找 root 的短test前态 `Color4BOX4,6 / Blue4,4 / twoFreeFork1 at3,6 and4,3`：3056/3056，未命中。
- actual9后允许任意ordinary部署Blue/改变首X位置与face，再恰好一次X形成两aliveFork1，然后ordinary查同test前态：3790/3790，未命中，8000上限没有耗满。

这些结果仅覆盖所述域，不能判定关卡无解、ghost路线无效或所有首X顺序不行。尤其不包括独立箱叠加、先死后在同输入内ICE追撞、其他来源的世界线结构。

owner手构的 `SSSSAAAWDDSDWW` 从actual9可把Blue送(4,4)、solo(4,3)fork2，再 `SSX` 在下方形成两fork1；这一普通几何被新轮覆盖，尚无完整正尾，未要求为坐标更换而实际undo。Blue(4,4)切断唯一(4,3)→上部入口；暂推Blue至(4,5)可通，但上方Color4BOX(4,6)背Wall(4,7)让向北通路受阻，难从上面把Blue恢复(4,4)。

## 未验证的同输入追撞边界

root提出明确短D条件：Color4BOX(4,6)、Blue(4,4)，freeFork1(3,6)/(4,3)。D令左人把Color4推到(5,6)，自己进入(4,6)SPIKE并拾最后叉成为ghostFork2；下人撞(5,3)Wall转W推Blue(4,4)→ICE(4,5)→(4,6)。若同一输入内第二tick的Blue能捕获第一tick刚死亡角色，则可有Blue contained active ghostFork2+外freeFork1。

尚未构造该具体前态，未执行D，不能宣称捕获或复活。模型目前在第一tick删除未contained的SPIKE死者，因此拒绝后续微tick追撞；这个tick间先后规则未由本关实测证明。M064是后续输入才移箱到已死者的反例，不足以断言同一次输入内追撞必无效；M092/M093的同动作幽灵装箱与复制合法，但也不能反向认定本构型必有效。

## 独立条件尾（未执行）

root/资源 helper 核定左侧三目标条件：cargo(2,6)fork2面W、两个外free0(2,5)/(5,6)，`XXADWAW` 七尾；镜像 `XXDAWDW`。需要该前态全部资源，未提供initial完整prefix。

资源 helper 另核onefree+Blue缓冲左侧条件：cargo(2,6)fork2面W、free0(2,5)、Blue(1,5)，`XXWSSAWWSSDDDDDDWWAAA`21尾；或Blue(6,6)时 `XXWSSDDDDDWWAADSSAAAAWWAW`25尾。这些只覆盖一侧三个目标，仍需可达Blue布局、载箱资源及第二线/对侧安排；不计完成。

## 封存状态

2026-10-04 root通知 owner 已正常返回世界；本关仍未解，111/5进度不变。停止扩大本轮受限模型，保留实际11输入/time12和以上未执行候选，等待新机制或明确结构后回访。下一关仅依据 owner 新实际initial继续分析。
