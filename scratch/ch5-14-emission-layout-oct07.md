# 5-14「放射」公开静态地图/推侧审计（2026-10-07）

第二helper只读，sole input owner为slot1_owner_oct06，primary负责动态构造。本文零游戏输入、搜索、新JSON，不读hidden/reflection/hint/save，不改knowledge；只保存本MD。允许普通末推者死亡，所有cargo/光学/新增角色以actual为准，不以静态限制推出全关无解。

## 准确源与双叉实际

canonical `artifacts/slot1-playthrough/5-14.json` **fresh0 event0/frame8036563**，runtime emission，61 entities/107 tiles/size10,9/min0,0。root独立8047551全量match（root回报）。P60[4,2]/S/F0；Fork54[1,1]/55[1,2]；Pri56[3,1]/57[9,1]；C4 Box58[7,3]/Shadow59[5,3]；Goal51[1,8]/52[1,7]/53[9,1]。

两个BOX/两个Pri active、pushable/blockable=true、height1、mask0、contained0/container-1、motion0/src-1/ext0。58.Shadow=false/Color4，59.Shadow=true/Color1，Pri.Shadow=false/Color1；fresh光flags全部false。两Fork isFork=true，非普通钥匙。无Button/Gate/Lock。

实际AAA3 **event3/frame8056375** 到P60[1,2]/A/F1，Fork55 inactive、54 active；singleS4 **event5/frame8058157** 到P60[1,1]/S/**F2**，两个Fork均inactive，双箱仍初位active。第二叉累加已有实际证据，不把owner计划误写成实测，也不将F2自动授予任意cargo/出生后库存。

从此真实4，正常离袋新5步 **WDDDW** 预测到4,3/W/F2，经1,2→2,2→3,2→4,2→4,3全SOLID，两个BOX/Pri不动。各格无刺/Wall/未取物，未知光flags不当完成。直接从1,1用DD会在第二D推Pri56由3,1→4,1，改变上方发光轴，不能把它当纯导航。

## Goal.floor、Wall覆盖与裸SPIKE

三个Goal格1,7/1,8/9,1均缺tiles条目，但active GOAL.floor=true提供地面。1,7/1,8无Pri/Wall，9,1由Pri57占；不能因为tiles缺失误删Goal，也不能把两个上Goal假成一个。

51 Wall完整：底y0的x0..10、顶y9的x0..10全Wall；左x0的y1..8与右x10的y1..8全Wall；内1,6；右x8的y4..8、x9的y2..8。raw26 SPIKE中3/4/5/6/9,9五格被顶Wall覆盖；**21裸SPIKE**如下：

- 1,4/1,5；2,4/2,5/2,6；3,4/3,5/3,6。
- 4,5/4,6/4,7/4,8；5,4/5,5/5,6/5,7/5,8。
- 7,4/7,5/7,6/7,8。

没有ICE/DARK。6列y1..8是普通安全竖通道；7,7亦安全，但7,4/5/6/8裸刺。上左安全区为x1..3/y7..8，下方1,6 Wall、2/3,6裸刺，右侧4/5列裸刺；不能由6列北行直接裸穿到左Goal。

```
       x=01234567890
y9       ###########
y8       #G..^^.^###
y7       #G..^^..###
y6       ##^^^^.^###
y5       #^^^^^.^###
y4       #^^^.^.^###
y3       #....B.B.##
y2       #K..P....##
y1       #K.R.....R#
y0       ###########
```

## Goal/棱镜推侧与光轴

右Goal Pri57[9,1]普通四推不可移：N9,2/S9,0/E10,1目的Wall，向W需推者10,1 Wall。只能通过有效观察/cargo等实际条件完成，不输出“从8,1 D推开Goal”。它唯一开放西向是8..4,1安全Floor接Pri56[3,1]。

原Pri56[3,1]南3,0 Wall、西2,1/1,1 Floor至0,1 Wall、东连57；北3,2/3,3 Floor后**3,4/5/6裸SPIKE**、3,7/3,8 Floor、3,9 Wall。北轴不存在中途Wall，top3,7或3,8对齐该轴；单以这些格有刺不能关闭光轴。56在底row1向北推需3,0 Wall、向南目的Wall，只能普通横移；需保留3列光时避免顺手D推至4,1。

上Goal1,7/1,8是两格裸Goal.floor，两个有效占位或其他经实际证明的满足方式须分别核。一个releasefree3,7可AA到1,7，或WAA经3,8/2,8到1,8，但同一个人走两个格不是同时满足两Goal。两个Goal棋盘奇偶不同，普通同相双free也不能凭“都已出生”当摆好；phase/被动cargo/额外角色的真实库存由primary核。不额外要求所有外推者保活。

## 初C4与Shadow的可回收推侧

**C4 58[7,3]**：

- 向N的pusher7,2是**SOLID安全Floor**，singleW可送58→7,4 SPIKE、推者停7,3安全；第二W才会使裸推者进7,4死亡。向S需pusher7,4裸刺，普通free不能站那里。
- 向W需pusher8,3，该格虽SOLID，但初态N8,4/E9,3是Wall，S8,2普通SOLID，W7,3由58占。是否能从8,2进入8,3须一并核8,2真实地形；本关raw8,2=SOLID，不能混用上一关的8,2刺。因此存在普通绕底东侧推位的局部几何，不能将8,3误判成仅出生可达。
- 向E从safe6,3推到8,3后，N8,4/E9,3 Wall，向S需8,4 Wall，向W需9,3 Wall：**四普通推都锁住**，不能当可回收buffer。cargo/出生若有其它实际规则另论。

**勘误：早先发给三方的短消息误把7,2/8,2沿用成5-13的裸刺，本关raw两格均SOLID/Floor、无Wall。owner与primary独立复核后本报告已改正；不能用那条错误排除普通北推或8,3西推侧。** 问题不是8,3自身不可达，角色同步可达性由primary核。西侧推者从8,2 singleW进入8,3在静态地形上安全；本helper没有双人导航图或某对位置不可达结论。

**Shadow59[5,3]**：

- safe4,3 singleD可推到6,3；下一D会把59+58连推，58落8,3上述角落，需停。
- safe6,3 singleA可推影到4,3；再A到3,3对齐56北轴，Shadow.active/释放未知，不能批AA认作活影运输。
- N推侧5,2安全，目的5,4是裸SPIKE；首次W裸推者停5,3安全，下次W推者进入5,4会死。S推侧5,4裸刺，普通不授。

需要actual的出生边界：若normal离袋后确在4,3/W/F2、影仍5,3，singleX的左右目标3,3安全Floor与5,3 occupied Shadow。3,3没有Wall/Spike，但5,3的出生装载、孩子Fork、shadow字段/height/后续X须single实际校准；不把公开普通C4出生机制直接套成Shadow成功。这是短probe几何，不是运输/通关候选，也未发游戏输入。

## 可恢复的邻C4光盾条件

条件布局：Pri56原3,1、active C4在**3,2北邻**，Cargo Shadow在top3,7或3,8待定。邻C4是否关闭56北轴按已有邻/远BOX区别提出模型，仍需本关实际核；不以Player3,2代BOX盾。

与5-11搬Pri进不可恢复角落不同，C4在3,2水平可回收：free4,2 singleA→C4[2,2]/free[3,2]，全部SOLID，可重新暴露原col3北轴；或者free2,2 D→C4[4,2]。N推需3,1 Pri占、S连Pri背3,0 Wall，故不选竖回收。**未证明58从初态送3,2的prefix**，光关闭/恢复与Cargo释放须独立actual，不说“摆上就解”。

只把C4置3,3是远箱，不能替代3,2邻盾，且下推到3,2要推者3,4裸刺。在4,3下推到4,2所需4,4是安全Floor，但推者必须已有进入4,4的实际路线，不能用可站地面自动授多角色同步前置。

## 允许末推者死亡的top横运切口

一个未可达的具体fixture：front active Shadow cargo[5,7]、rear C4[6,7]、外推者[7,7]，Pri56仍3,1。AA的普通位置为A1：影4,7 SPIKE、C4 5,7 SPIKE、外人6,7安全；A2：影3,7 SOLID、C4 4,7 SPIKE、外人5,7裸死。3,7对齐56北轴，若影消失释放出active free才可继续top；**消影/contained/mask/ghost/Fork均UNKNOWN**，不凭lighten或test flags授予release。

短牺牲地形可行，但目标还有top1,8及bottom9,1，需要另外实际有效资源；不能把一个cargo加一个外人就算三个Goal均满足。不要求死者复活或全角色存活，也不作资源总数无解判断。F2实际取到是新库存，合法复制/保留/相位前置由primary核，本文不跑其动态图。

owner随后回报已singleD10将Shadow只右移到6,3、actualX12，未执行D连推C4进8,3；primary的新固定双人域48closed仅是同步目标有限阴性，本文未参与/复跑，不以旧错误terrain解释它。上文4,3 singleX只是不同历史fixture的未知建议，不能因owner另处X12便记为已执行。

本域ready，raw覆盖、实际F2、安全离袋、C4东推角落、邻盾可恢复方向及条件top尾已发owner/primary/root。所有新物理/光学探针逐段读actual，本文零图/输入/后台，不要求owner驻关。
