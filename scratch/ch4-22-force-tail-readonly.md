# 4-22 同链推力实际两叶与新普通尾域

2026-10-04，SaveSlot1，只读助手 `/root/ch3_37_cargo_revisit_oct03`。唯一input owner已由root交接给 `/root/ch4_1_readonly`。本助手没有游戏输入、UI/存档/主JSON/canonical改写、提示、攻略或隐藏实现读取。

**实际34直接X生成两叶，三箱共享整体南/北推力选择，没有8个独立组合。** 本轮从这两个真实35源运行一次固定8000普通尾域，未命中Goal且未穷尽；不扩cap，不作全关无解断言。原历史DX36源与本文源不同，不能混记。

## 实际source及mask

直接读取主 `artifacts/slot1-playthrough/4-22.json events[36].observation`，root也独立MCP核。实际全35输入：

```text
SSSSSDDDWWDWWDSAAASAXWWDWADDDWWWAWX
```

此前真实34，cargo88/BOX87在3,9/F1/A/key2，outside89在3,5/F1/W/key2；空C4 84/85/86在3,8/7/6，Blue83在4,5。X时cargo南侧向三箱链施S，北3,10Wall改前2,9；outside左2,5Wall改前3,6，向同链施W，右4,5推Blue至5,5。两原parent在X腾空，链末3,5/3,9可用；不能套普通旧占用。

|真实numeric axis|cargo（全active/F0/key2/ghost0/contained）|free（全active/F0/key2/ghost0）|空BOX|masked/inactive|
|---|---|---|---|---|
|0，time35|88/87[3,8]；91/90[2,9]|89[4,5]|C4 84[3,7]/85[3,6]/86[3,5]；Blue83[5,5]|free92失效/masked1|
|1，time35|91/90[2,9]|89[4,5]；92[3,6]|C4 84[3,9]/85[3,8]/86[3,7]；Blue83[5,5]|cargo88与BOX87失效/masked1|

active物理BOX数6/5；Goal均未覆盖，无完成。两叶共有旁观cargo91仍活；不能要求同父两个cargo孩子都保留。本例只证同连续三箱链N/S选择相关，M127三个独立target八叶不能直接套。

## 新ordinary任意Goal union域

私有 `scratch/ch4-22-force-tail-readonly.cjs` 从真实35读全部timeline，排除inactive/masked实体，按numeric axis建seed。复用 `scratch/ch4-22-readonly.cjs` 的公开几何/step，**不是独立引擎**。旧base的X冲突拒绝不影响source，因为此处不猜X胜者。

```text
D:/nodejs/node.exe scratch/ch4-22-force-tail-readonly.cjs 8000 45
```

真实运行约1秒，同步exit0，无后台session/handle。固定cap8000/depth45：expanded8000、seen15395、pending7395、depthCut0；axis0 seen3335，axis1 seen12060。free或ghost0 cargo都可直接覆盖Goal11/12,9；记录任意Goal mask并检查已有两个叶的union3。所有mask目前0，无完整positive，队列未穷尽。

WASD only，全部BOX行允许（没有row1剪枝），本图无ICE、外边界为真Wall，按自身key开锁。新增ordinaryforce-conflict18次拒绝传播（包括各方向分支计数）；独立stack/occupied-cargo捕获沿base停止，Ghost不传播，无新X。不能把未展开7395节点当搜尽，未扩大旧actual36的5000cap或复跑旧源。

仅为日志补充在同source/同cap/同顺序重算一次，指标完全相同，没有拓展图。已展开最短milestone随后固定单串复算valid：

|源|尾|资源收益与代价（均模型）|
|---|---|---|
|axis0|AAW|cargo87到3,9，空C43,6/7/8，free3,5；common90仍2,9，Blue5,5。|
|axis0|WWWWWW|free抵2,9，commoncargo90左沉1,9；有用cargo87仍3,8，空C43,5/6/7，Blue5,5。|
|axis1|WWWWWAWWW|新C4cargo85到3,9，common90沉1,9；空84=2,9、86=3,8、Blue5,5，solefree3,7；cargo key2/ghost0。|

两叶已展开区的row9 cargo最远x3，未见Blue capture。模型没有把双同奇偶free全部排除：普通双BOX链确可capture上述C4，单箱奇偶限制不能推广。上述片段无完整Goal尾，**不建议单独盲走**。

固定复算（不BFS）：

```text
D:/nodejs/node.exe scratch/ch4-22-force-tail-readonly.cjs --replay 0 WWWWWW
D:/nodejs/node.exe scratch/ch4-22-force-tail-readonly.cjs --replay 1 WWWWWAWWW
```

## 新源普通模型对Goal12的资源边界

11/12,10、11/12,8、13,9均真Wall；两个Goal只能从row9西侧进。lower row1/2/4的key/lock廊不能从南上Goal。所有live free起初在左侧safe区，裸free从row9 x5再D到6 SPIKE时完成该次push后死亡，不能自行活着越过6到右部。

在刚性BOX链、无新X、无Ghost/stack/失效体恢复、仅活裸free普通推动的模型里，致命D后front最大x为 `6+连续可运BOX数`，Goal12需要至少6个可运链body。commonBOX90在2,9的北2,10/南2,8均Wall；普通向右推需pusher1,9裸SPIKE，只能由3,9左推沉1,9腾free2,9，随后向右回收需0,9Wall。不能把它当可运东向链body。

因此当前axis0其余最多5个可运body，axis1其余最多4个；这个普通模型的库存不足以将front送到12,9。这只是actual35当前源及上述物理规则范围，不排除34前改变部署、Ghost载人、独立叠体目标观测/新叶、恢复masked实体或其他机制；**不证明整关无解，也不证明Goal11不可达**。Goal11未在此次截断区命中，仍待完整运输。

历史actual36为34接DX，其两cargo都在可运输的3,8/4,9，六BOX/两free；未由本次35的2,9沉箱约束排除。其旧5000 ordinary域本来也未穷尽。本文不新增相同预算域、不预宣称任何Goal实测。

当前同链probe已经真实完成；完整关卡目标仍未达。root与input owner收到source、指标、milestone和资源边界，可选不同有理由的前置/机制；本助手本轮停止额外搜索。
