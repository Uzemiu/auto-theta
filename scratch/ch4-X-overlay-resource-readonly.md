# 4-X与已完成关卡overlay：静态备用目标与周期边界

2026-10-04，SaveSlot1。只读助手 `/root/ch3_37_cargo_revisit_oct03`；输入owner `/root/resume_slot1_oct03`。读取公开关卡initial、Chapter4世界主JSON及M090/M091；未发送游戏输入、未读隐藏实现/提示/攻略、未写存档、主JSON或canonical KB。只做有限初图集合比较和静态连通分量，不做双人/可推入口大BFS。

**本轮没有得到有物理桥接收益的4-X组合正候选；不建议现在长途搬入口。** 已完成4-26 D.N.A的固定入口[-46,6]仅保留为结构备用：它是现有18个已完成Chapter4普通关中，唯一不在sky两个Goal8,1/7,0以及skyFork0,4、Prism4,4叠上Wall的初图，且增加45Fork、Blue和另一Prism。但按Floor并集与Wall优先的线性图、或假设较大19×17周期图，它仍没有把sky中央棱镜岛与两Goal岛接通，并在sky初始P6,8加SPIKE。没有完整短解或运输前缀。root已核旧soloSky模型含9×9周期/source14闭合，本文不重复该域。更短的下一机制探针建议是下述未完成4-22的已实测34前态直接单X，检验相反推力在同一三箱链上的关联性，不能据此预认通关。

## 已证正常入口合成语义

M090：世界同一个人同时占3-28固定入口和未完可推3-X入口，实际加载 `3-28^3-X`。不同人各占不同入口产生的是M089横向`+`，不是同图`^`。M090实际初图的4,4双BOX成为两层，3-X角色1,4与3-28 Wall同格而contained1/container11；因此Wall重叠/初始化容纳都不能简单当overlay只增Floor。

M091：已完成可推3-X捕人后可留在world运输；未完成可推3-X同构型会立即入关。最终载3-X进入未完3-Y正常加载 `3-X^3-Y`，32输入实际完成，按真实存档计组成关。本项目允许合法组合完成后计组成关；不要求solo每关。

本轮直接比较原始3-28、3-X与3-28^3-X，以及3-X、3-Y与3-X^3-Y初图：两已观测合成都有**Floor并集、Wall并集、Goal坐标并集完全相等**，没有集合缺项/新增项。三个源和两个组合的size都是8,8/min_anchor0,0，tile范围0..8。因此支持当前同坐标初图union静态推断，但没有验证不同尺寸组合如何选period/如何处理超出小图范围的实体。

未完4-X不需先solo完成才可搬**空入口**；正常推空入口已有M118和4-X首次进入前证据。不能提前把人装入未完4-X再长途运，它会autoLoad。要到固定completed入口形成`^`，需要正常同步的另一角色与入口同格；当时Yellow叉资源/两人奇偶、ICE微拍、同向水晶排斥、固定completed入口的进入行为均须owner按新世界帧核。World角色Fork不会据此自动变成组合关卡的初始额外Fork。

## 静态候选比较

4-X/sky实际初态：size8,8，P3=6,8/F0/S、emptyPrism2=4,4、Fork4=0,4、Goal8,1与7,0；无Wall/裸SPIKE/ICE，只有离散Floor。Overlay比较以各源initial为准，不能拿completed终态箱/角色布局代替重进初态。

本轮检查所有4-1..27已有普通关JSON，completion=true的18关为4-1..9、4-11..15、4-23、4-25..27。除dna外全部在skyGoal7,0叠Wall；下面只详列owner建议的蛇/长颈鹿和dna：

| 已完成入口目标 | 世界坐标 | sky8,1 | sky7,0 | skyP6,8 | skyFork0,4 | skyPri4,4 |
|---|---|---|---|---|---|---|
| 4-23 snake | -43,3 | 无Wall | **Wall** | **Wall** | **Wall** | 无Wall |
| 4-25 giraffe | -43,6 | 无Wall | **Wall** | 无Wall/安全 | 无Wall | **Wall** |
| 4-26 dna | -46,6 | 无Wall | 无Wall | 无Wall但**SPIKE** | 无Wall/安全 | 无Wall/安全 |

snake加2Goal、2Box和密集Fork，线性physical union为49格一组件（其中1裸SPIKE划开safe图）；但7,0 Goal、skyP及skyFork叠Wall，不能把这条“physical全连通”误说成目标全可达。giraffe加1Goal、2Box与Fork塔，physical组件65/7格；sky左叉仍独立7格，Prism叠Wall，7,0仍Wall。它们目前没有明确补sky二Goal的普通候选，因此不优先搬。

“Goal叠Wall”是明确初图兼容缺陷，不是任意光学/初始化/组合机制下的全局不可解证明；有M090的Wall容纳先例，须保留实际组合边界，不能只做坐标删格后宣称游戏一定无解。

## 4-X^dna Floor/Walls/资源与切口

dna实际初态size18,16，Blue46=14,4、emptyPrism92=16,4、P93=13,2/F0、45Fork、Goal3,15；无ICE/锁门。按可见Floor并集、Wall并集，忽略物体阻挡的有效Floor有144格，未被Wall覆盖的SPIKE47格。

无wrap的physical组件为129、9、4、1、1格。对应结构：

- skyP6,8、skyFork0,4与dna右腔P13,2/Blue14,4/Prism16,4在129格物理大组件；连接途径含SPIKE，不能当裸人安全路。
- skyPrism4,4所在中间3..5×3..5的9格岛仍与大组件分离；两源union没补它的周围缺Floor。
- 两个skyGoal仍在4格岛 `{7,0;8,0;7,1;8,1}`。邻6,0/6,1/7,2/8,2/9,0/9,1仍无Floor，普通相邻步无法入出。
- sky的孤点2,6及6,2也保留独立分量。

扣除裸SPIKE后的safe组件为48、22、11、9、4、1、1、1格。skyP6,8落在dna SPIKE；仅凭初始化free字段不能保证其在组合初始化/首动作保持alive或ghost0，必须实际观察。skyFork0,4为安全格，但从这角色能否先取叉、如何避新Spike、何时能与dna资源协作都没有fullprefix。dna45Fork/旧114完整尾并不能直接覆盖新sky两Goal，也不能不核额外角色同步就原样重放。

优势仅是保留两个skyGoal的无Wall坐标、增加载人/棱镜/Fork资源及连接部分原Floor组件；不足之处是两目标岛和中央Pri岛仍缺桥、额外SPIKE与不同尺寸周期。这使dna适合作为**结构备用/边界探针候选**，不是已知完整解法。

## 普通边界与周期连通必须分开

root公开Notebook15「穿越」观察说明关卡循环左右/上下相连；World在-83,4继续A不wrap并不能否定soloSky关内循环。root随后已核旧soloSky模型包含9×9周期/source14闭合，不在此重复其单图搜索。直接从公开initial复算静态图，sky总29格Floor，线性与9×9周期physical分量均14/9/4/1/1。

本报告上面的组件统计是线性四邻图。另仅假设组合采用较大size18,16对应19×17周期：按这一个明确假设重算，physical组件仍129/9/4/1/1，两个skyGoal岛及Pri岛仍分离；目标岛的7,0/8,0南向周期邻7,16/8,16恰是dna Wall。这不证明实际组合采用该周期。

若组合反而保留sky的9×9周期，则边界边7,0↔7,8、8,0↔8,8会变化，例如dna7,8有可用Floor，可能连接Goal岛。但**不同尺寸组合是否保留小图period、是否裁切/映射dna超界实体，都未有实际证据**；此处只举边界边的收益条件，不是把dna右侧实体丢掉后造一个完整小图模型。已有M090/M091两个合成都同尺寸，不能解决这个选择。

因此不再建议重复soloSky周期域。只有正常世界运输fullprefix及合成初态inspect可给出可审查收益时，才择dna备用；不因“新组合可能有用”盲走长运输。当前不同尺寸的period/重叠terrain/初始化Wall容纳仍是实际机制边界，而非已有解法。

## 本轮起始世界源与最低正常前置

本轮最初读取的完整Chapter4世界观测：instructions=`AAAAAAAAAAAAAAAA`/time16，P66[-83,4]/Fork1/key0/faceS；4-X空可推Entry29[-32,4]/blockabletrue/AlwaysEnabletrue，4-23/25/26固定entry为[-43,3]/[-43,6]/[-46,6]，均active/pushablefalse/blockablefalse/Color1。候选target采用这帧位置，未把AlwaysEnable当必自动加载。收束时再次只读主JSON最新Chapter4 `events[345]`，time70/P66[-32,5]/Fork1/key0/faceS，空4-X仍[-32,4]，三候选固定入口位置未变。root已交接唯一输入职责给 `/root/ch4_1_readonly`；原 `/root/resume_slot1_oct03` 不再接收待执行前缀，本助手仍只读。

目前只给目标坐标与地图兼容理由，没有提供[-32,4]到[-46,6]的入口安全运输fullprefix；不能用差值14西＋2北当可推入口路线。最低资源前置是能正常到空4-X、保有可用一叉分成两个活外人、通过真实ICE/普通等待同步在最终fixed target处发生入口与人同格。必须避提前捕获未完4-X、其它未完入口autoLoad、无key锁及裸SPIKE；completed入口pass仅已有M110及具体世界证据支持。main右出口/普通key机制工作独立，本文未重复普通key路径搜索。

本轮只有一个自有MD，未生成模型输出JSON、未操作UI或存档。未建立合法fullprefix的组合不计关卡完成，未排除正常组合路线或新周期/光学机制。

## 18个completed初图完整审计表

完成条件直接读取各关主JSON `completion.level.completed=true`；不是从世界Entry.blockable=false推导。size为真实initial timeline字段，格范围从0到size，故单图period为size+1。下表组合period仅假设 `^` 采用两图各轴较大size+1，**不同尺寸尚未实测**。

physical图取真实Floor并集减Wall并集，忽略BOX/PRISM、裸SPIKE伤害、锁门和初始化容纳。`W`=目标同格有Wall；数字=该坐标所在physical分量大小。末列列全分量大小，未把它们当裸人可走路径。所有18项均为一次固定静态图遍历，没有角色/入口搬运搜索。

|completed源|真实size|假设组合period|Goal8,1 /7,0|SkyP6,8 /Pri4,4|全physical分量|
|---|---|---|---|---|---|
|4-1 dual|8,8|9×9|W/W|W/46|46|
|4-2 terminal|8,8|9×9|W/W|W/W|30|
|4-3 sharp|8,8|9×9|W/W|W/49|49|
|4-4 assimilation|8,8|9×9|W/W|W/29|29|
|4-5 bottleneck|8,8|9×9|W/W|W/33|33,1|
|4-6 popout|8,8|9×9|W/W|W/41|41|
|4-7 rabbit|8,8|9×9|W/W|W/43|43|
|4-8 insert|8,8|9×9|W/W|W/34|34|
|4-9 earthworm|8,8|9×9|W/W|W/W|33|
|4-11 elephant|8,8|9×9|W/W|W/43|43|
|4-12 duck|8,8|9×9|W/W|W/W|31|
|4-13 matrix|8,8|9×9|W/W|W/W|40|
|4-14 pyramid|8,8|9×9|W/W|W/40|40,1|
|4-15 align|8,8|9×9|W/W|W/42|42|
|4-23 snake|10,10|11×11|49/W|W/49|49|
|4-25 giraffe|9,18|10×19|65/W|65/W|65,7|
|4-26 dna|18,16|19×17|4/4|129/9|129,9,4,1,1|
|4-27 blossom|11,8|12×9|49/W|W/49|49|

dna初图7,0/8,1/0,4/4,4确实没有任何tile或实体；sky在这些格贡献自身Goal/Floor/叉/Prism。dna6,8为SPIKE tile而无Wall，sky同格有SOLID Floor。两种terrain叠格的实际优先规则仍待组合实证；不能因为无Wall就称P安全，也不能直接断定其初始化必死。

## 固定水平组合 `+` 的几何对照

先用已实际的 `3-28+3-X.json initial` 核语义：真实size17,8；3-X全部Floor/Wall向右平移9，与3-28集合并集后，和实际组合Floor/Wall完全相等。因此本轮固定按相邻无缝offset=size_left.x+1比较四个completed候选的两种左右顺序。不同高度的组合period仍仅假设宽度相加、高度取max；没有游戏实测。

|completed源|假设 `sky+源` / `源+sky` period|两顺序Sky Goal分量|Sky P /Pri分量|全physical分量（两顺序相同）|
|---|---|---|---|---|
|4-23 snake|20×11|4 /4|14 /9|49,14,9,4,1,1|
|4-25 giraffe|19×19|4 /4|14 /9|65,14,9,4,1,1|
|4-26 dna|28×17|4 /4|14 /9|118,14,9,4,1,1|
|4-27 blossom|21×9|4 /4|14 /9|49,14,9,4,1,1|

`+`避免在sky目标同格直接叠Wall，但这四种固定组合的接缝/周期接边没有连接sky目标岛或Pri岛。因此目前也不是物理bridge正候选。本文没有比较所有Chapter1..3或所有组合顺序，没有模拟Goal光学、初始化容纳、Yellow关卡复制及组合规则新能力，不能从此声称所有正常组合无解。

## 推荐更短的实际机制探针：4-22同链三推力（仅条件，未执行）

不建议现在为验证不同尺寸而盲搬4-X。一个已有完整正常前缀、只需新增**单X**的相关未完成数字关probe是4-22「侵蚀」真实actual34原态。它应用M127的新问题是**同一连续箱链上三个目标的推力选择是否关联**，并非重跑旧36 ordinary域或预认8叶。

直接读 `4-22.json events[15].observation`：34输入/time34，完整已实测前缀为：

```text
SSSSSDDDWWDWWDSAAASAXWWDWADDDWWWAW
```

该实态cargo88/BOX87在3,9，Fork1/key2/faceA/activecontainedghost0；outside89在3,5，Fork1/key2/faceW/activeghost0；空C4 BOX84/85/86分别3,8/3,7/3,6，Blue83在4,5。两角色的face不同来自捕获后全局动作/fallback，不能另加普通设face而保原站位。

单X的静态出生/力输入：

|parent/分枝|可见阻挡与fallback|条件力或旁观者|
|---|---|---|
|cargo88面A，北侧|3,10真Wall，改正前2,9；安全Floor|cargo child2,9/F0/key2，候选旁观者|
|cargo88面A，南侧|3,8空C4，链末3,5为当前另一parent原格|向南推84→85→86，三箱均收到S向链力|
|outside89面W，左侧|2,5真Wall，改正前3,6空C4；链末3,9为cargo原格|向北推86→85→84，三箱均收到W向链力|
|outside89面W，右侧|4,5 Blue可推，5,5安全Floor|Blue83→5,5，free child4,5/F0/key2|

两链末端都只在X的已证原parent/容器腾空规则下可用，不能套普通movement旧占用。涉及孩子出生推链的已知公开规则与M102/M108；但三箱共享连续链，不能直接把M127三个独立目标的8种选择当结果，也不能未经实际观测就当全链只会两种刚性结果。需要按实际timeline枚举观察每个84/85/86的pos、active/maskedoff/height、各child生存/容器、2,9旁观cargo是否继承。

这是未来正常回访可逆探针：复建已实测34并逐帧核两个不同face/三箱链，单X后读取全部axis，必要时正常undo1恢复。**root/inputowner尚未采用或执行本probe**；不声称所有child一定安全、获得8叶、覆盖Goal或整关可解。此前实际36是34接DX，改变了面向，不能当本直接X已经测过。它的优势是无需新增未知运输前缀，且直接检验已证M127在“共享箱链”这个新域的边界。后续全Goal/六箱运输仍需另有完整正尾，不因多叶数量自动计完成。
