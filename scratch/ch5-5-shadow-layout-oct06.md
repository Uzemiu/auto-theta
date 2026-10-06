# 5-5「坏死」Shadow与门局部审计（只读，2026-10-06）

公开源 `artifacts/slot1-playthrough/5-5.json`，runtime `necrosis`。initial/frame3352906是入场；event0/frame3354042正常自动教学，三次普通confirm后event6/frame3361851为稳定fresh0。初始P57[7,2]/S/Fork0/key0/ghost0/free、单叶59。本文仅读公开journal/地形，未操作游戏、提示、存档、主KB或实现。

开始分析时owner已正常`SAAA`到actual4/event10/11/frame3389608。文档落盘前又读到actual35/event35/36/frame3450894：两Shadow都inactive，新free57[2,4]与59[4,4]皆活F0，owner正按主helper已校准39方案继续。以下旧源手工候选不能接在35，也不建议撤销现前缀去缩步数。

## Shadow完整公开属性与actual消影

|字段|55 fresh0|56 fresh0|
|---|---|---|
|type/class|BOX / Box|BOX / Box|
|pos|3,3|5,1|
|active|true|true|
|floor|false|false|
|pushable/blockable|true / true|true / true|
|face|[0,1] / properties.face0|[0,1] / properties.face0|
|maskedoff|0|0|
|contained/container/height|0 / -1 / 1|0 / -1 / 1|
|movingdir/movingsrc/movingsrcext|0 / -1 / 0|0 / -1 / 0|
|details.Shadow/Color/GMID|true / 1 / 52|true / 1 / 53|

BOX.properties没有PLAYER.ghost/Fork/key字段；不能把Shadow=true改写成“幽灵玩家”、载人箱或叠箱。normal教学event0称它“箱子的残影，死去的箱子”，event4为“愿他们在箱子星球安息……”。这些是正常自动教学，没有使用提示。

本轮已有实际校准，不能继续称未知或要求重复：

- event7/frame3383805，`SAA`实际3：56从5,1被推到4,1仍active，P57[5,1]/A活free。
- event10/11/frame3389608，单A4：56到Goal3,1，**active=false**；其Shadow=true、Color1、pushable/blockable=true、mask0、contained0/container-1/height1、motion0仍保留。P57[4,1]/A活，55仍3,3 active，单叶，未完成。
- event21/22/frame3419840，actual19：55实际[1,4]active压Button，Gate1,6.blockable=false，P57[2,4]/A/F0。证明此Shadow在本关可普通推动并持续压上钮；不是从Color1猜的效果。
- event24/frame3427845，actual23：55仍active[1,4]，Gate开，P57[1,7]/W/Fork1，KEY53 inactive。
- event28/29/frame3433734，actual28：55被推到Goal1,1后**active=false**，残留Shadow/Color/pushable/blockable/height等字段同上；56仍inactive[3,1]，P57[1,2]/S/Fork1活free，Gate闭。没有新的cargo、Ghost、叠箱或分叶。

因此动态障碍至少须同时核active与blockable，不能只因残留blockable=true把已inactive影箱当永久墙。这两个具体Goal消影实例不推广到所有Shadow触碰、任意光路、装载、出生或世界线。

## 静态地形与门切口

size[8,8]、min[0,0]，全边界Wall；无SPIKE、ICE或DARK。

```
      x=012345678
y8      #########
y7      #K#######
y6      #g#######
y5      #.......#
y4      #b......#
y3      #.#B##..#
y2      #.#.##.P#
y1      #G#G.B..#
y0      #########
```

K=Fork53[1,7]；Button54[1,4]；Gate58[1,6]/ID0。两个Goal是1,1和3,1。两影箱初态B在3,3和5,1。

- Fork1,7只有南邻Gate1,6，其北/东/西都是Wall。没有避开闭门的普通Fork路线。
- Button1,4安全；从fresh0完全避开两个Shadow的普通走路前缀为 **`WWAAAAAA`**：7,2→7,3→7,4，再沿row4到1,4。
- 单free离Button到1,5之后，不能假定Gate仍开再W。Fork需要持续按钮占位或已实测的其他占门前置。本轮已用active Shadow55持续压1,4完成Fork访问。
- Goal1,1只可由1,2向S进入，东西/南为Wall。fresh0不推影箱的safe通路为 **`WWAAAAAASSS`**，经1,4/1,3/1,2到1,1；不经过Fork门。
- Goal3,1南/西为Wall，北3,2安全、东4,1安全。初态下，北入口上方被55[3,3]挡，东走廊又被56[5,1]挡；不能称其已经纯走路可达。actual4消去56后，P[4,1]单A即可进入3,1；此后主前缀实际使用这个位置。
- 两Goal彼此被x2,y1..3的墙分开，但row4上方连接左右。清掉55后，可由3,4连SSS到Goal3,1；左Goal仍从1,2进。

## 上钮普通箱缓冲与已实测前缀

Button1,4的左右是0,4Wall与2,4安全Floor；箱可从2,4向A推入（推者3,4），也可从1,5向S或1,3向W交付。后者一旦箱1,4，占据左单列通道，需推动它再下行，不能走穿。

从actual4 P[4,1]的局部手工19方向是 **`AWWSSDDDWWWAAAAWAWW`**。它后来与owner实际4→23相同几何闭环，关键停点已写主JSON：

|相对4之后新增步数|PLAYER|Shadow55|用途|
|---|---|---|---|
|1|3,1|3,3|实际可占已消影56的Goal|
|3|3,3|3,4|由3,2向W推出55|
|11|6,4|3,4|从底部绕右侧到推者位|
|15（整体19）|2,4|1,4 active|55压钮，Gate实际开|
|17|1,5|1,4 active|绕按钮箱到门下|
|19（整体23）|1,7/F1|1,4 active|Gate实际可通过并拾Fork|

该普通路线无X、争推、箱内人或盒色联动。actual23之后owner五S将55从1,4经1,3、1,2推到Goal1,1，actual28两影箱均inactive、角色仍Fork1。主helper继续按实际39方案，无需为本报告回访。

## 未执行的31手工短尾仅作历史候选

在尚未执行actual23→28时，本文曾从同一个23几何提出 **`SSSXSSSS`**，与前19组合可成为整体31的候选：

1. SSS从1,7回1,4/S，55送1,3。
2. X左侧生2,4，右侧0,4Wall改前方1,3，前生推55到1,2；这一步Shadow分裂前推尚未实际校准，不能声称发生。
3. S令2,4因2,3Wall转D到3,4；另人由1,3推55到Goal1,1、停1,2。55在普通S到该Goal消影现在已有actual28旁证，但此X前置仍未执行。
4. 若前两步真实成立，再SSS：3,4→3,3→3,2→Goal3,1；另一1,2→Goal1,1→1,2（S遇底/右墙回W）→Goal1,1。末两Goal同占。

这只是两条短走廊的手工几何候选，**没有实际31完成证据**，不替代owner当前已实际35的39方案，不要求Undo，也不把未执行X影推记入机制或进度。

## 范围与结果

三个只读固定active障碍普通single-free图：fresh0/闭Gate23节点，actual4/闭Gate27节点，actual4/只放行Gate的乐观上界29节点，合计79节点。Goal实体floor=true并入地面；没有以其缺少tiles条目误判虚空。另做19步单推者手工回放与8步局部候选尾，无完整双人/两箱BFS。

本任务要求的Shadow属性、按钮避影route、Fork门切口与两Goal通道均已列。当前最重要的新实际事实是**active Shadow55可持续压钮，两个Shadow各入Goal后消影**；残留pushable/blockable不代表仍active。主动态域与完成验收由另一helper和唯一owner执行。仅创建本MD，无CJS/额外JSON、无输入或后台进程。
