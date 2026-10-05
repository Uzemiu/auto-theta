# 4-20 Blue-first资源只读核验

日期：2026-10-04。唯一输入 owner 为 `/root/resume_slot1_oct03`；本助手未输入游戏、调用UI、改存档、改主KB或主JSON，未用提示/攻略/隐藏实现。自有模型为 `scratch/ch4-20-blue-resource-readonly.cjs`。

## 真实来源与新域

读取 `artifacts/slot1-playthrough/4-20.json` 的initial与events。`events[1]`真实4：初态正常`SSSS`后P59=4,6/Fork3/S，三Fork已inactive，C4BOX57=3,3、Color3 BlueBOX58=4,3。`events[3]`真实15：P59=5,2/Fork3/W，双箱仍原位。旧16首X是5,2/W；本轮允许从真实4先普通部署，改变首次X站位或面向，再仅WASD直到首次活Blue cargoFork2+outsideFork2。不是旧16固定seed，也不是actual25全Goal域。

公开地图无ICE。Walls实体优先于tiles；SPIKE为2,4..10与1,3（后者同格有Wall，模型不当安全Floor）。3,4/4,4/5,4/6,2/6,3等Wall限制箱运输。模型使用普通回转顺序W→A→S→D、刚性BOX链、普通cargo面向随全局指令、新捕获cargo保留该free实际fallback face、已验证contained X复制箱和同源融合。保留所有BOX行，包括row1，不能因此把落底BOX当可回收。

独立异源stack、冲突、任何带叉free进入已有cargo的occupied捕获均停止并记边界；Ghost不传播。已知F1同格融合可以发生，但会损失本轮保四活F1的目标资源，所以此处保守停止，不把高叉融合假补成独立新cargo。没有光学/Goal/全关搜索。

## 正资源前缀：22输入（模型，未在游戏执行）

```text
SSSSAASSSAAAAWWWSXAWWD
```

从真实4接18输入尾 `AASSSAAAAWWWSXAWWD`（18字符，故总22）；从已有真实15可直接接七输入 `WSXAWWD`。私有完整单串与主助手 `scratch/ch4-20-readonly.cjs` 的独立`multiStep`逐步交叉，全部唯一且状态一致。

| 总输入 | P/BOX资源检查点 |
|---|---|
| 4（已实测） | P4,6/F3/S，C4=3,3，Blue=4,3。 |
| 15（已实测） | P5,2/F3/W，原双箱不动。 |
| 16 `W` | P5,3/F3/W；箱不动。 |
| 17 `S` | P5,2/F3/S；箱不动。 |
| 18 `X` | 两free4,2/5,1，均F2/S。朝东6,2为Wall，X使用西侧4,2和正前5,1。 |
| 19 `A` | free3,2/A与6,1/D，均F2。5,1向西4,1为Wall，因此转到D。 |
| 20 `W` | free2,2/A与5,1/A，均F2。 |
| 21 `W` | free2,3/W与5,2/W，均F2，双箱原位。 |
| 22 `D` | 左free2,3推C4+Blue双箱链向右：C4→4,3，Blue→5,3，pusher→3,3；另free5,2向D遇6,2Wall，转W进入5,3，被同刻移入的空Blue捕获。终Bluecargo5,3/F2/W/ghost0，outside3,3/F2/D，C4empty4,3。 |

末D只是普通双BOX链和首次空BOX捕获，没有conflict、stack、裸SPIKE或highFork occupied碰撞。旧actual25取得的是C4 cargoF2；此资源标签确实交换成Blue-first。

最小首次实际probe（未来正常回访再做，不要求owner现在打断4-21）：先正常复建已证15，再`WS`确认5,2/F3/S，单`X`确认18的4,2/5,1双F2；然后`AWW`核21双站位，单`D`核22 Blue捕获。当前只到4/15的历史部分已真实，16..24仍模型。

## 第二次X的合法资源与受限捕获失败范围

22直接X并不符合期望：Blue5,3/W只向左能生成cargo（北5,4、东6,3为Wall），而free3,3/D的前child也推C4向右，产生相向conflict；本模型停止，没有选择一个虚设胜者。

先`S`再`X`则私有与主模型单串均valid：

```text
SSSSAASSSAAAAWWWSXAWWDSX
```

23S：Bluecargo5,3/F2/S，outside3,2/F2/S，C4empty4,3。24X：Bluecargo西生4,3并推C4到3,3；另一Bluecargo正前5,2；两outside4,2/2,2；四actors均F1/活/ghost0，C4仍empty。两Blue来自同origin58，暂时各为单层，未重叠。

从此精确24 seed只用WASD，要求始终保四个活F1 actors，目标为首个活C4 cargoF1，继而三cargoF1+outsideF1。实际expanded70、seen70、pending0、depthCut0，depth35/cap11717均未触及，队列在该受限模型域完整闭合；没有命中。拒绝或损失85个过渡（死亡/合流等不再保四actor），不传播新X、异源stack、conflict、Ghost、高Fork occupied融合。不能推广为所有Blue-first布局无解，也未尝试改变24之前第二X的部署时序。

局部可恢复性限制：24 C4=3,3，北3,4真Wall，上推受阻，南推者也需3,4不可站；左推需4,3但为Bluecargo占据。由2,3右推两箱链可移一次成C44,3/Blue5,3，但receiver从4,2的同刻W不能假设旧Blue4,3已腾空（普通移动按旧占用规划，M102的X腾空规则不能无条件套普通动作）。单靠这份正确库存没有闭合六箱部署尾。

## 实际预算与边界计数

本轮固定合计cap12000，未扩大。第一目标283 expanded/403seen/120pending，正例即停，depth40无cut；这不是把全部首次X站位搜尽。第二阶段使用剩余11717预算，实跑70后完整闭合。两阶段总expanded353；最终确定性复算输出moves1497、conflict1、stack0、occupied0、ghost0、death44、capture3（过渡计数，不是独立节点数）。进程约0.4秒完成，无后台session。

第一阶段拒绝的短conflict样本：`SSSSAASSSAAAAWWXWWWDD`。该过渡前空C4=2,4、Blue4,3，free3,3/5,3各F2/D；D时左者推Blue向右，右者撞6,3Wall后转向左，争同Blue。模型明确停止，没有把任意胜者当唯一普通后态。

22与24资源正例已发parent/owner/main；owner当前已正常进入4-21，未执行本新前缀。本轮不继续扩cap，不声称4-20完成。main的已核六BOX条件终点尾仅作为后续资源目的，不因库存预测而算完整可达。
