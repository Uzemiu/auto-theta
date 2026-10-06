# Chapter5公开世界资源与安全短导航（只读）

2026-10-06。唯一游戏输入owner另行处理5-1；本报告没有游戏输入、提示、存档/主知识库修改。只保存此MD，无CJS或JSON、无后台进程。

## 实际源与有限范围

canonical `artifacts/slot1-playthrough/chapter5-world.json` initial/frame1764756为正常4→5升层后的公开初态；events[7]/frame1781523稳定Chapter5 world=true、axis0/time0/instructions空、PLAYER265[-44,-25]/Fork0/key0/ghost0/free，busy/input_locked/dialog/paused均false。size97,76、anchor[-55,-71]、1373个tiles。此后owner进5-1，不把该spawn称现在live。

这张世界图已有5个Color4 BOX、5个Color1 PRISM、4个LOCK、3组门/按钮、6个INTERACTABLE、3个COLLECTION、1个普通KEY与45 ENTRY。资源实体是具体地图知识，名称/功能和交互结果仍由实际UI决定。

当前安全WASD图expanded=224/seen=224/pending=0；仅未来条件“5-1已完成可走过”投影另expanded=289/seen=289/pending=0。合计513节点，≤3000；没有复跑大资源搬运图。

移动规则：起步墙、关闭门/锁、缺Floor触发已实证左转；滑到ICE后沿原方向继续直到普通地面或硬阻挡。逐微tick拒绝SPIKE和任何未完成ENTRY。BOX/PRISM/可推ENTRY若能推动，整个该输入作为未知资源操作剪掉，**不会错误把可推实体当硬墙后假造转向路线**。进入任何按钮/KEY/COLLECTION都作为终止待实测边界，不能从未校准的拾取或按钮后继续规划。DARK覆盖本身不等于SPIKE或墙，正常活人沿安全地板穿过允许，但未假定生死/光学机制。

## COLLECTION / KEY / LOCK / 特殊入口

| 类型/ID | 坐标 | 原始标识/限制 | 当前可执行到格 | 当前安全邻位 |
|---|---|---|---|
|GOAL/0|[-23, -37]||无|无|
|ENTRY/8|[12, -38]|5-P；require=无；AlwaysEnable=True；blockable=False；pushable=False|无|无|
|ENTRY/9|[-7, -18]|5-G；require=5-25；AlwaysEnable=False；blockable=True；pushable=False|无|无|
|ENTRY/13|[-7, -68]|5-R；require=无；AlwaysEnable=True；blockable=False；pushable=False|无|无|
|ENTRY/14|[-7, -64]|5-Z；require=无；AlwaysEnable=True；blockable=False；pushable=False|无|无|
|ENTRY/15|[-7, -48]|5-Y；require=无；AlwaysEnable=True；blockable=True；pushable=True|无|无|
|ENTRY/30|[-27, -15]|5-X；require=无；AlwaysEnable=True；blockable=False；pushable=False|无|无|
|LOCK/96|[-7, -57]||无|无|
|LOCK/97|[-8, -57]||无|无|
|LOCK/98|[-7, -58]||无|无|
|LOCK/133|[-23, -25]||无|无|
|BUTTONGATE/165|[-19, -10]|ID=0；current blockable=True|无|无|
|BUTTONGATE/166|[-3, -33]|ID=3；current blockable=True|无|无|
|BUTTONGATE/167|[-3, -42]|ID=2；current blockable=True|无|无|
|BUTTON/168|[-2, -35]||无|无|
|BUTTON/169|[-15, -18]||无|无|
|BUTTON/170|[-22, -10]||无|无|
|KEY/176|[-7, -64]|ordinary KEY isFork=False|无|无|
|COLLECTION/266|[-17, -27]|NID=205|无|无|
|COLLECTION/267|[-3, -32]|NID=14|无|无|
|COLLECTION/268|[-15, -13]|NID=105|无|无|

COL105[-15,-13]仅以NID登记为新叉候选，实际名称、split变化与存档确认尚未取得；COL205[-17,-27]、COL14[-3,-32]也不能从编号直接授予星/成就。普通KEY176[-7,-64]与ENTRY5-Z同格，不能先假定在进入未完关前能拾得钥匙。锁96/97/98在[-7,-57]/[-8,-57]/[-7,-58]，锁133[-23,-25]在中央冰路；保持当前closed，不以完成度或Goal自动开锁。

5-Y[-7,-48]是可推/阻挡ENTRY；5-X[-27,-15]附近有SPIKE[-28,-15]/[-26,-15]，不因入口nonblockable推断可从侧向合法抵达。5-G[-7,-18]当前blockable且require5-25；P/R/Z自身开放字段仅是观察，不等于安全可达或已经进入。

## INTERACTABLE正常剧情候选

| ID | 坐标 | 当前最短安全邻位/串 | 仅5-1完成条件下新增邻位/串 |
|---|---|---|---|
|48|[-44, -16]|[-44, -17] / `WWWWWWWW`|[-44, -17] / `WWWWWWWW`|
|49|[-44, 0]|[-45, 0] / `WWWWWWWWWWWWWWWWWWWDWWWWWWWW`|[-45, 0] / `WWWWWWWWWWWWWWWWWWWDWWWWWWWW`|
|50|[6, -12]|无|无|
|51|[-1, -35]|无|无|
|52|[36, -27]|无|无|
|53|[4, -27]|无|无|

这些INTERACTABLE内容尚未从本journal实际展开；到邻位后应先读取普通UI，只有出现“查看”才正常confirm。不能把任一交互物预命名为楼梯或提前计升层。当前world GOAL[-23,-37]与PRISM148同位，不是空地Goal；是否可达/满足光学及功能都保持未验证。

## 可交付短候选（MODEL，需要owner逐段核）

### 候选1：INTERACTABLE/48，current actual7 fixed geometry

完整串 `WWWWWWWW`（8输入）→[-44, -17]。所有microticks避未完ENTRY/SPIKE和可推资源动作；没有先过其他未校准COL/KEY/按钮。末格或邻位需要实际读取UI，不能称已取得。

| 本段累计输入 | 指令 | 稳定坐标 | 微tick/边界 |
|---:|---|---|---|
|5|W|[-44, -20]|1 / stable|
|8|W|[-44, -17]|1 / stable|

### 候选2：INTERACTABLE/49，current actual7 fixed geometry

完整串 `WWWWWWWWWWWWWWWWWWWDWWWWWWWW`（28输入）→[-45, 0]。所有microticks避未完ENTRY/SPIKE和可推资源动作；没有先过其他未校准COL/KEY/按钮。末格或邻位需要实际读取UI，不能称已取得。

| 本段累计输入 | 指令 | 稳定坐标 | 微tick/边界 |
|---:|---|---|---|
|5|W|[-44, -20]|1 / stable|
|10|W|[-45, -16]|1 / stable|
|15|W|[-45, -11]|1 / stable|
|20|D|[-44, -7]|1 / stable|
|25|W|[-45, -3]|1 / stable|
|28|W|[-45, 0]|1 / stable|

## 升层与后续机制边界

目前canonical只有正常4→5及初次5-1进入的记录。没有第五章新的“前往上层”UI或worldGoal完成证据；地图边界、INTERACTABLE和特殊ENTRY不能代替实际升层提示。当前普通路径若被新入口/物体阻断，优先正常完成教学及返回后重看世界字段，不把当前有限阴性记成全局不可达。

## COL105的具体前置切口（不是新的执行串）

另做一次明确反事实：只在内存视作Gate165[-19,-10]已由某个正常资源保持开启，同时仅允许已完成5-1通行，其余资源/入口不变。此投影expanded=419/seen=419/pending=0，本任务成功投影合计932节点；首次投影因set.keys格式错误在首节点退出，共933实际扩展（仍≤3000）。该条件下COL105[-15,-13]出现普通无SPIKE/不推物体的安全路径，因此此门是当前COL105访问的具体物理切口。

实际门仍closed，按钮配对也未核。按钮170[-22,-10]与门隔三个横向步，单free离按钮后不能假定门继续开启；需正常放置箱、另一人物持续压住、占门保持或第五章实际新机制。不能凭完成5-1、按过按钮一次或反事实路径授予105。

只作条件几何校核的完整串（**禁止在当前closed门状态执行**）：`WWWWWWWWDWWWWDDDDSSWDDDDDDSDDSDSDDDDWWDSSASDSSD`。此串不是本轮positive；一旦owner正常取得并观察到有效开门资源，需以新实际世界源重建再用。

公开最近BOX171[-26,-16]：北[-26,-15]是SPIKE，东[-25,-16]缺Floor；直接从南推北一次虽推者尚安全，但第二次会裸踩刺。没有已构造的无叉单free将它运到按钮170的完整安全串，所以本报告没有让owner盲推箱补门。BOX172[-19,-13]在门后的右侧区域，不能把未到达它的位置先当成可搬资源。
