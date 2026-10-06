# 5-12「跃迁」fresh0静态资源/目标审计（2026-10-07）

只读第二helper，sole input owner为slot1_owner_oct06，primary负责动态路线。本文仅读公开主journal、手算指定推侧/固定串回放，**零动态图/新搜索节点、零游戏输入**，不读save/隐藏实现/UI-api，不用hint，不写主JSON/KB，不产额外JSON/队列/后台。所有条件光学/cargo/死亡后的有效观察按actual核，不加两free全程存活要求。

## 公开初态与覆盖

canonical `artifacts/slot1-playthrough/5-12.json` **event0/frame7040431，fresh0/time0**，runtime transition，51 entities/97 tiles/size10,8/min0,0。root独立7045074捕到同fresh0（root回报）。

|对象|fresh0|
|---|---|
|Goal41|1,7 active/floor=true/nonblocking|
|Goal42|9,1 active/floor=true/nonblocking|
|C4 Box43|2,1 active/Shadow=false/Color4|
|C4 Box44|6,4 active/Shadow=false/Color4|
|Fork45|2,2 active/isFork=true，非普通钥匙|
|Pri46|3,1 active/Color1/Shadow=false|
|Pri47|2,7 active/Color1/Shadow=false|
|Pri48|9,1 active/Color1/Shadow=false|
|Shadow49|7,4 active/Color1/Shadow=true|
|Player50|2,3/S/F0，active/key0/ghost0/free|

三BOX/三Pri均pushable/blockable=true、height1、mask0、contained0/container-1，motion0/src-1/ext0；三Pri fresh均lighten/traversed/testCompleted=false。无Button/Gate/Lock，没有通过参数猜新箱颜色规则或释放机制。

97 tiles不含两个Goal格**1,7/9,1**，均由公开GOAL.floor=true补地面；合并Goal后才检查可走/推格。41 Wall完整：底y0的x0..10全Wall、顶y8的x0..10全Wall、左右x0/x10各y1..7全Wall；内墙1,5/2,5/3,5、3,4、9,2。边界完整，无0,8式缺口。

raw SPIKE10个：4,5/5,5/6,5/7,5、6,6/6,7、7,6/7,7、6,8/9,8。仅最后6,8/9,8被顶Wall覆盖；**其余八格都是裸SPIKE**。没有ICE/DARK。Wall优先，不能把被Wall覆盖的刺当特殊通路。

```
       x=01234567890
y8       ###########
y7       #GR...^^..#
y6       #.....^^..#
y5       ####^^^^..#
y4       #..#..BB..#
y3       #.P.......#
y2       #.K......##
y1       #.BR.....R#
y0       ###########
```

图仅辅助定位。上层左安全区x1..5/y6..7，与下层之间的y5为Wall1..3及SPIKE4..7；右侧8/9,5虽安全，却与上层左区隔着x6/7,y6/7两列裸刺。不能把绕右路当普通单free已能进入上Goal。

## Goal与Pri的具体推侧

**右下Goal42[9,1]的Pri48普通不可移动**：N目的9,2Wall，S目的9,0Wall，E目的10,1Wall，W需推者10,1Wall。既不能从8,1用D挤开，也不能从其上方绕入Goal。当前仅开放西向几何：8,1..4,1 Floor，再接Pri46[3,1]。完成需实际观察/合法装载或未来其它机制，本文不补容器规则。

Pri46[3,1]南3,0Wall，西邻C4 43[2,1]，北3,2/3,3 Floor后3,4 Wall，东通4..8,1接48。原C4西邻可作为光学关闭方向的条件；北观察/邻BOX区别不能忽略，远处3,3箱不能直接套邻BOX规则。

上Goal41[1,7]裸Floor，其N1,8/W0,7 Wall、S1,6安全、E2,7由Pri47占据。从1,6 singleW是直接占位前置。Pri47北2,8Wall、南2,6安全后2,5Wall、西1,7Goal地面、东3..5,7 Floor再穿6/7,7 SPIKE至8/9,7 Floor与10,7 Wall。Pri47能在row7横推，但北推目的Wall、南推侧2,8Wall，不能普通抬走。

若释放free已在4,7且47仍2,7，**不能照搬5-11的AAA去Goal**：第二A会把47推到Goal1,7，随后47背0,7 Wall；这会挡住直接占位。一个单角色安全绕侧是**SAAAW**，经4,6→3,6→2,6→1,6→Goal1,7。若4,6有C4，首S会推它到4,5 SPIKE，推者仍4,6安全；BOX存活/另人同步轨迹需actual。SAAAW只核上角色，不能偷算成两Goal同时完成。

## C4 43的底排限制与底Goal条件缓冲

C4 43[2,1]下面整排y0是Wall。向北推动它需推者2,0 Wall，向南目的2,0 Wall；因此在普通推链模型内，它**始终只可row1水平移动**，不是现成上层缓冲。容器出生/复制等若已实际成立可改变资源，但本文不凭fork1自动生成新物。

一个具体底Goal观察fixture：C4 43[1,1]、Pri46[2,1]、C4 44[2,2]，三者active无cargo；Pri48[9,1]保持初位，至少一effective observer处在3..8,1之间。46西邻43、北邻44、南Wall，仅东连接48；48其它三侧为Wall，西通同一观察者。**是否全部testCompleted/Goal42满足待actual**，不把这一邻箱几何当光学实现已隔离。上Goal仍须另一个有效角色/条件资源，底观察者之后离开也不能把光flags当永久累加。

## fresh单人35步底缓冲候选：完整指定回放，非全关解

只针对**fresh0的单一P50**，无X/其它PLAYER，不隐藏第二人的同步动作；Fork1保留供primary选择后续出生。完整手算串：

**`SWDDDWDDSDDWWASDSAAAAAASAAWWDSDDSSA`**（35输入）。

分为6步取叉到推侧 **`SWDDDW`** 与29步搬运 **`DDSDDWWASDSAAAAAASAAWWDSDDSSA`**。指定串逐动作已按raw地面/推链核，每个推者目的均SOLID/Goal.floor，**没有裸SPIKE、merge/capture/堆叠/新出生**；零搜索。Shadow49只摆到9,6，未进Pri47的直接东row7；全部Shadow活性/折射效果仍MODEL逐段actual核，不说完整字典校准。

|累计停点|P50|C4 44|Shadow49|几何动作/停点|
|---|---|---|---|---|
|6|5,4/F1|6,4|7,4|SW取叉，DDD/W从row3到5,4，safe推侧|
|8|7,4|8,4|9,4|DD推44+49两物横链；禁止第3D顶10,4 Wall后回转踏7,5刺|
|11|9,3|8,4|9,4|SDD绕右侧，无物体接触|
|13|9,5|8,4|9,6|WW把影抬至9,6；不要再W送9,7光轴|
|15|8,4|8,3|9,6|AS从safe8,5推44向南一次，避7,5/6,5刺|
|17|9,3|8,3|9,6|DS到44东推侧|
|23|3,3|2,3|9,6|六A沿整条安全row3左运44|
|29|2,4|2,3|9,6|SAAWWD经1,2/1,3/1,4绕到箱北，避3,4Wall|
|30|2,3|2,2|9,6|S把44放2,2；再S受44+43+2,0Wall堵会回D3,3，不会自动把44压入2,1|
|34|4,1|2,2|9,6|DDSS由4列安全下行到46东推侧|
|35|3,1/F1|2,2|9,6|A普通混合链：43→1,1、46→2,1；另47/48不动|

从5,4开始的29指定串另独立检查每一个推者格/每条BOX+Pri混合链目的，没有分支图或全状态搜索。fresh实际Fork取法/移动物理与每段影active仍需owner/primary实际验收，owner当前若已出生或改箱构型则不直接套35，不要求正常回访等这份报告。

终P3,1直接X不是默认安全建议：south3,0Wall。Fork1怎样用于有价值的箱/棱镜出生或观察资源，由primary核，不能把现有一个玩家静态表变成“已经有两free/已完成”。底MASK耗用44与43的位置可能影响上层运输，不能据此认作唯一顺序或全局必需。

## 允许末推者牺牲的上层运输切口

一个明确单C4缓冲fixture：front active Shadow49[4,5]含一active cargo，rear C4 44[4,4]，外部free[4,3]。**WW**的普通位置预测为：W1影→4,6、C4→4,5、外人→4,4安全；W2影→4,7、C4→4,6、外人→4,5 SPIKE死亡。4,7正位于Pri47初2,7的东轴，中间3,7 Floor，消影释放可以作独立实测边界；**载人/影活性/释放全UNKNOWN**，未构造此fixture。

这说明不必额外要求末推者保活，短牺牲本身地形成立。但若只有上述cargo与外free两个角色，外人死后底9,1仍需有效观察资源；不能用先前完成过的Pri flags永久累加，或忽略尚未占的底Goal。因此该WW不是现有资源已通关，也不是“牺牲方案无效”的全局否定。若另一个有效cargo/投影/分支已实际满足底Goal，则可重新核该条件；本文不造第三角色。

外人若要全程safe，可能需要另一可推对象在后面保证第二W旧格仍安全；但43普通无法离row1，不能自动把它列为第2上层C4。新出生/同刻捕获/移动棱镜/Shadow缓冲的必要实际规则由primary负责，不在本静态报告加限制或开完整BFS。

本域ready：完整raw地形、右Goal不可普通移Pri、上Goal正确绕侧、底mask前置和fresh单人35条件搬运已发root/owner/primary。零图/输入/提示/存档修改，无handle/后台；本关未由本文证明完成。
