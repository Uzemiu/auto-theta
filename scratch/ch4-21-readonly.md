# 4-21 膨胀：只读证据与有限模型

输入 owner 为 `resume_slot1_oct03`。本文件与同名 CJS 只读分析游戏主 JSON；没有游戏输入、存档/主知识库修改、隐藏实现、提示或外部攻略。模型结论与 actual 分开。已直接读取 `4-21.json` events[35]核actual43，之后owner报告23普通尾实际完全匹配actual66/time66，未完成，14 undo/0 retry（undo 由 owner 正常执行，旧17路线仍保留）。

## 地形和光路

真实 initial 尺寸 `[13,9]`，坐标0..13/0..9；外框全Wall，墙优先于Floor。无ICE/DARK。SPIKE为1,1/1,2/2,1/2,2/3,1/2,6/3,6/10,3/11,3/11,8。9,4与9,6是真Wall，故9,8向南X推Box9,7至9,6，以及Button箱10,4向左推9,4，两种手算均不合法，未实际输入。

Goal1,5同位Prism；固定网络另有2,5/3,5/1,4/1,3/2,3。静态四末射线候选为x2北(2,6..7)、x3北(3,6..7)、x1南(1,2..1)、x2南(2,2..1)。按M054，邻接非Prism箱可遮闭末支，远处空箱不直接视为闭支。`traversed=false`不视为Prism阻断(M119)。完整同一Goal的分支不能未经实证跨叶拼接；本轮四ray mask只作固定网络同叶候选判据，actual completed才是完成依据。

北邻接遮闭格2,6/3,6不能用普通最后一步直接部署：南推所需2,8/3,8为Wall，北推所需2,4/3,4为Wall，横向最后一步受1,6/4,6Wall及Prism限制。因此不把“普通空箱任意移到这两格”作为前提。北safe观察点2,7/3,7相邻；两outside同棋盘奇偶时，若每步均邻移，不能同时占二者，须真正等待/装箱/出生等改变相对时序。不是全关无解证明。

条件末X（无已得运输prefix）：cargo2,1 F1/A可生2,2与1,1，覆盖南两支；cargo3,7 F1/A可生3,6与2,7，覆盖北两支。不能把普通cargo到3,7视为容易可达。

## Actual资源闭环

| actual输入 | 直接证据 | 状态与意义 |
|---|---|---|
|3 `WDD`|events[1]|6,8 F1，三箱原位|
|12 `WDDDSDWDDSSS`|events[5]|空Box83到Button10,4；12,7 Gate ID0 open，7,6 ID1 closed，单按钮配对已证|
|17 +`WWDDW`|events[7]|12,8 F2；后来正常undo14回3|
|7 `WDDDSWX`|events[13]|两F0在6,8/8,8；原8/9,7双箱仍在|
|9 +`DS`|events[15]|两free7,7/S与10,8/D，箱原位|
|10 +`S`|events[17]|7,7南Gateclosed转D推双链；Box81=9,7，Box83=10,7并捕获95 F0/ghost0；outside94=8,7/D。双箱链同奇偶捕获的本关实际实例|
|16 +`WDDSSS`|events[19]|cargo83=10,4压Button，outside10,5|
|23 +`WWWAASD`|events[21]|空81=10,7，cargo83仍10,4，outside9,7|
|27 +`WDSS`|events[23]|空81=10,5，与cargo10,4成竖缓冲；outside10,6|
|31 +`DDWW`|events[25]|outside12,8拾第二Fork成F1；cargo0+outside1，空81仍10,5|
|34 +`SAA`|events[27]|outside10,7/A F1|
|35 +`X`|events[29]|两F0 outside10,6/10,8，cargo0原位|
|36 +`A`|events[31]|下人受9,6Wall转S推双链，cargo10,3安全拾normalKey1，空81=10,4，outside10,5/9,8全活|
|37 +`A`|events[33]|cargo以自身Key开Lock10,2，Key→0；空81=10,3。推者留10,4未裸踩Key刺，另一outside8,8活|
|43 +`DDSSAA`|events[35]|cargo95/83=9,2 F1/A、ghost0；outside94=10,2 F0/A、96=10,4 F0/S；空81=10,3/82=7,3；所有Key/Forkinactive，Lockinactive，completedfalse|

实际43全串：

`WDDDSWXDSSWDDSSSWWWAASDWDSSDDWWSAAXAADDSSAA`

普通chain递归已按M028/M063修正：每层BOX到目标Lock只使用该BOX内角色的钥匙，空BOX/Prism不借外推者钥匙；free只对自己的进入位置使用自身Key。43保护拾Key/开Lock实证对照通过。cargo位置统一使用BOX.r，不用旧嵌套角色字段作为实际坐标。

## 有限搜索记录

所有进程已结束，无运行handle。没有保存搜索快照JSON。

|轮次|上限/深度|结果|覆盖/限制|
|---|---|---|---|
|actual17首保叉capture|5000/35|5000 expanded，6051seen，1051pending，0depthcut，nohit|totalFork>=2/最多两活角色；所以不覆盖第二X后全F0库存；15 free-X冲突拒绝样本。ordinary冲突未计入此数|
|actual17四free域|5000/35|5000/7292/2292，0depthcut，max4actors，no首safe cargo/Ghost|保lastFork9,2，允许所有剩freeX，BOX无行剪枝；不传播冲突/stack/occupied/Ghost/cargoX|
|MODEL31缓冲护Key|3000/30|55expanded/116seen即正hit `SAAXA`|exact onecargo+第二X后两outside都活；随后固定replay再`ADDSSAA`闭合43，已actual|
|actual43光学候选|5000/50|5000/8385/3385，0depthcut，最大1/4ray，无Goal|ordinary+末cargoFork1X，同源融合；不传播异源stack、forceconflict、occupiedmerge/Ghost。Gate7,5→7,6配对仅显式假设，尚未actual。最短二cargo资源`WX`会牺牲一outside，不建议盲执行|
|早7固定箱body取第二Fork|1000/25|122/122队列耗尽，0depthcut，无hit|保持三箱原位，普通两F0；仅此固定布局范围|
|早7可移动箱body取第二Fork|1000/25|863expanded/1287seen命中12尾 `SSASSSAWDWDW`|MODEL19 free8,8 F0/12,8 F1，81=10,4，83=11,8 SPIKE，82=7,3；箱83普通回收推者会踩刺，未证明完整capture|
|早7三F0异奇偶资源|5000/40|5000/6710/1710，0depthcut，max3actors，无首safe cargo/Ghost|从两F0取第二Fork后freeX，目标safe cargo+两异奇偶outside及lastFork保留；不是扩旧17/43队列|
|actual43 Button7,5 probe|1000/25|358expanded/412seen，正23尾|ordinary only，保两outside与cargoF1；Gate7,6保守closed，未用未证配对|

cap到限且pending非零均是截断，非耗尽，更不是全局无解。不同源叠体、特定occupied融合、Ghost以及光学观测递归没有在失败轮传播，后续只能按明确边界/actual扩展，不重复提高cap。

## 可审核的MODEL里程碑/探针

1. 早7重新分配第二Fork并保旧waiter：`WDDDSWX`后`SSASSSAWDWDWSSSWX`17，完整MODEL24=`WDDDSWXSSASSSAWDWDWSSSWX`。最后三F0为old10,8(偶)、new11,6/12,7(奇)，三者活ghost0；三箱10,4/11,8/7,3，Key与9,2Fork仍active。尚未actual，尚无cargo+两outside尾，尤其11,8箱不可假定安全普通回收。提供owner请求的资源里程碑，不记作解法。

2. actual43普通23尾：`DDWWWWAAAWAADDSSAAAWAWW`。分6 `DDWWWW`→outside12,6/11,7；5 `AAAWA`→outside10,5/7,8；6 `ADDSSA`→outside11,2/8,7；6 `AAWAWW`→66：空Box82=7,5压Button、cargo83=6,2 F1/W、outside7,4/5,8 F0全活，空81仍10,3。最后两W分别把82送7,4/7,5。

   **最新actual闭环**：owner已经分段真实执行这23步，并已直接读取主JSON events[47]核66/time66全部match，cargo95/83=6,2 F1/W、outside94=7,4 F0/W与96=5,8 F0/A，三活ghost0。Button7,5单独占用，Gate7,6 open，Gate12,7 closed（Button10,4无人）。故第二按钮配对现在有本关实际证据；此前optical43轮将它标为假设，是保留当时范围，不继续声称未验证。仍completedfalse，没有完整光路正尾，不再泛搜旧cap；owner计划同步后正常返回/推进4-22。

资源helper独立条件单步：cargo6,2 F1+empty5,2+outside7,2/4,3同A，可双链捕获4,2 F0，保cargo5,2 F1与outside6,2。此只条件几何，没有从43达此前置或完整光学尾，本报告不冒充actual。
