# 4-15 对齐：单侧三目标条件尾，只读有限审计

2026-10-04。助手 `/root/ch3_37_cargo_revisit_oct03`；唯一输入owner `/root/resume_slot1_oct03`，SaveSlot1。只读 `artifacts/slot1-playthrough/4-15.json` 普通initial、M098/M102/M107；有限重放四条给定/结构构造的普通尾，不重复主helper取叉、ICE capture、资源或完整路线搜索。未输入游戏、读写save、修改主KB，未使用提示、攻略、隐藏实现，无逐步JSON。

## 地图及核验前提

runtime align。左三目标3,6/2,7/1,8，右三目标5,6/6,7/7,8。1,7/3,7/4,6/5,7/7,7为可入但杀外人的SPIKE；4,7既有SPIKE tile又有真Wall，以Wall为准。ICE在4,5；3,5/5,5、4,7/4,8、2,8/3,8/5,8/6,8及x0/x8边界有真Wall。2,6/6,6是安全SOLID，不能误判为刺。

实际initial只有一free50在7,1，叉0；Color4 BOX48在6,2、Color3 Blue BOX49在2,2；三forkKEY分别4,2、4,5（ICE）、4,6（SPIKE）。ASCII中fork符号不能掩盖底层地形。本助手未求初态取叉/capture前置。

下述所有尾都是条件状态：KEY应已inactive，避免cargo经过4,6意外再拾叉；cargo活/ghost0/contained1，fork值明确；其他箱不得干扰所列出生与运输路径。连续X沿M098、侧受阻front fallback沿M011/M101，同源交汇沿本关前一关已经实际验证的M107，不套独立箱硬stack或把叉量相加。

普通有限重放使用观察模型 `stack-cargo-readonly.cjs` 的条件种子，不实现通用cargoX/ICE。为让模型接受初图，仅在内存副本把4,5的ICE标为SOLID；下述四条ordinary尾中任何外人或箱均未经过4,5，因此该格的简化不参与结论，不能把模型外推到初态ICE资源路线。cargoX部分单列静态代换，没有伪称实测。

## root两free条件左尾 XXADWAW：7输入通过

必要条件为cargo2,6 Fork2/faceW，加**两名**叉0外人2,5/5,6；Blue远离上区且不挡路径。例如模型Blue保持2,2。

第一X：cargo左右出生1,6/3,6 Fork1，均非Wall。第二X仍面W：左cargo1,6的左0,6是Wall，改front1,7；右侧2,6有效。右cargo3,6向2,6/4,6出生。两同源请求在2,6融合，得到三活cargo1,7/2,6/4,6，叉均0。两外人叉0留原位，不响应X。不会进入ICE4,5。

给该postXX种子有限重放 `ADWAW` 五普通动作全部有效：

| 动作 | 外人与cargo变化 |
|---|---|
| A | 5,6外人推cargo4,6→3,6目标，自己落4,6刺死亡；2,5外人移1,5 |
| D | 剩外人1,5→2,5 |
| W | 推cargo2,6→2,7目标，自己落2,6安全 |
| A | 外人2,6→1,6安全 |
| W | 推cargo1,7→1,8目标，自己落1,7刺死亡 |

末三cargo1,8/2,7/3,6都活，叉0；两外人已牺牲。它只覆盖左侧三目标，**不是六目标全关完成证据**。条件总人数为一cargo加两free（三个active角色），当前“初态分出两总actors”不能直接贴此尾。

## 镜像两free右尾 XXDAWDW：7输入通过

条件cargo6,6 Fork2/faceW，加两叉0free6,5/3,6；Blue不挡，例如远离于6,2。XX静态得到cargo7,7/6,6/4,6 Fork0，在6,6同源融合。

`DAWDW` 普通五动作独立模型通过：首D由3,6外人推4,6cargo→5,6，自己死4,6；另一人6,5→7,5，再A回6,5，W送6,6cargo到6,7，D去7,6，W送7,7cargo到7,8，末死7,7。最终三活cargo5,6/6,7/7,8，仅右侧三目标。

## 一free加Blue缓冲的正条件：不必全局要求两free

若只有cargo2,6 Fork2/faceW与free2,5 Fork0，root原7串不能完成：它缺少5,6的第二推者。此处只指出原串的资源不符，不能据此断言一free三目标全局无解。

本助手独立结构构造并有限重放得到下列**一free正条件**，但增加Blue位置前提，不证明从initial可达。

### 优先可检验谓词：Blue6,6，总25输入

preXX条件cargo2,6 Fork2/faceW，唯一free2,5 Fork0，空Blue6,6。该Blue不挡左XX及2,6同源融合。XX后接：

`WSSDDDDDWWAADSSAAAAWWAW`（23普通动作，合XX为25）。

| 普通尾输入数 | 状态及目的 |
|---:|---|
| 1，W | cargo2,6→2,7，free落2,6安全 |
| 2–10，SS+5D+WW | free经2,4、row4绕到7,6；避开4,5ICE及所有SPIKE |
| 11，A | 推Blue6,6→5,6，free落6,6安全 |
| 12，A | 推Blue5,6+前cargo4,6的链：Blue→4,6，cargo→3,6目标；free停5,6安全，不必落4,6死亡 |
| 13–22，DSS+4A+WW+A | free经6,4、2,4绕回1,6，不触ICE，已占两目标不动 |
| 23，W | cargo1,7→1,8目标；free最终死1,7 |

有限普通模型23步全部有效；末活cargo1,8/2,7/3,6，空Blue4,6，外人死亡。Color3/Color4双箱链的普通推送沿已实际验证M102。Blue6,6的布置、cargoFork2 capture与free2,5仍由mainhelper解决，未当完整initial解，也未要求owner盲试。

### 另一正条件：Blue1,5，总21输入，前置受限

preXX条件同一cargo/free，但空Blue已在1,5；它同样不挡XX。postXX接：

`WSSAWWSSDDDDDDWWAAA`（19普通动作，合XX为21）。

先W占2,7，SS A使free到1,4；WW先送Blue1,5→1,6，再用Blue1,6+前cargo1,7的链把cargo送1,8，free留1,6安全。接SS+6D+WW绕右到7,6，AAA最后将4,6cargo左送3,6，free落4,6死亡。独立模型19步通过，末空Blue1,7，三活cargo覆盖左三目标。

Blue1,5的普通入口受限：从2,5左推它需要站3,5真Wall，从1,4上推需1,3真Wall，从1,6下推则需站1,7 SPIKE。因此这个预置不能当作轻易可达；本轮没有为它求前置。它只展示增加空箱缓冲可让一free完成三目标，不能据此建议丢掉资源问题。

## 当前范围

两free7条件尾与一free+特殊Blue位置的25/21条件尾都具有有限positive；连续X为明确静态M107代换，ordinary段独立有限重放。主helper继续负责初态资源、ICE、capture及整关跨左右目标策略，本助手未搜索这些前置。没有真实完成回执时不计任何侧/关进度，也不作全局不可解结论。可靠谓词与输入已发root/mainhelper/owner；本轮停止新增搜索。
