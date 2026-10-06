# 5-15「握手」fresh0静态地图/条件终局（2026-10-07）

第二helper，sole input owner为slot1_owner_oct06；primary负责动态构造。仅读本关新raw，不沿用其它关地形；零搜索/游戏输入/新JSON/hidden/hint/save edit，不改knowledge，无handle/后台。所有cargo/出生/光学与完成以actual为准，允许末推者死亡，不要求所有free全活。

## 准确源、目标与下Fork

canonical `artifacts/slot1-playthrough/5-15.json` **fresh0 event0/frame8325856**，runtime handshake，98 entities/118 tiles/size10,10/min0,0。P97[7,1]/S/F0，Goal62[5,6]/Goal63[7,6]，Pri96同7,6，10 BOX与22个Fork。

**Goal5,6/7,6均缺tile条目，GOAL.floor=true提供地面。** 前者裸Goal，后者由Pri96占；不能遗漏目标地面或把占Pri的Goal当不可用空洞。无Button/Gate/Lock/ICE/DARK。

下Fork64[6,2]/65[7,2]都是安全SOLID，无Wall/刺。fresh普通**WA**：W到7,2、A到6,2。现已实际 **event2/frame8365818，WA2/time2**：P97[6,2]/A/F2，两下Fork inactive，Player active/key0/ghost0/free。累加2是本关实际结果，不预授后续孩子/cargo库存。

其余20个Fork全在裸SPIKE上：左组x1,y6..9，x2/3/4,y9及x4,y6..8；右组x6,y6..9，x7/8/9,y9及x9,y6..8。不能把它们当普通裸free已能拾取的富余库存；箱内拾取/复制/生死状态由actual核。

## 完整Wall与裸SPIKE覆盖

62 Wall完整：底y0、顶y10的x0..10全Wall；左右x0/x10的y1..9全Wall；内x2,y3..8、y3的x3..8、4,5/6,5、x5,y7..9、x8,y4..8。

raw22 SPIKE全部无Wall覆盖，**本关没有被Wall盖住的SPIKE**：1,y5..9；2,9/3,9；4,y6..9；6,y6..9；7,9/8,9；9,y5..9。以实际Overlay核，不能混用前关covered列表。上20个Fork对应其中20格，另1,5/9,5裸刺无Fork。

```
       x=01234567890
y10      ###########
y9       #KKKK#KKKK#
y8       #K#BK#KB#K#
y7       #K#BK#KB#K#
y6       #K#BKGKR#K#
y5       #^#B#.#.#^#
y4       #.#BB...#.#
y3       #.#######.#
y2       #..BB.KK..#
y1       #......P..#
y0       ###########
```

K只表示Fork，图中上20个K底下都是刺。起区row1/2与上中区row4 x3..7隔着row3 x2..8 Wall及2,4/8,4 Wall；左右外侧1,3/1,4与9,3/9,4可普通到，但北1,5/9,5裸刺，不能普通裸人绕进上中岛。新容器/出生/堆叠可改变资源，不把这个普通地形切口写成全机制无解。

## 10 BOX的初始推侧/回收限制

BOX均active、pushable/blockable=true、height1、mask0、contained0/container-1、motion0/src-1/ext0；只有95.Shadow=true/Color1，86.Color2，87..94均Color4/Shadow=false。不能由Color2套入不存在的ICE惯性，也不授occupied/stack状态。

|BOX|初位|普通推侧/目的与回收限制|
|---|---|---|
|86 C2|4,2|N目的4,3Wall，S需pusher4,3Wall；仅row2横推。W需5,2安全，但先连推95；E需3,2被95占，须先有实际清侧。|
|95 Shadow|3,2|N目的3,3Wall，S需pusher3,3Wall；仅row2横推。W from4,2先被86占，E from2,2安全但要连86。活性/冲突/捕获按actual，不能普通抬上row3。|
|89..93 C4|3,8/7/6/5/4|整列x3,y4..8。W目的x2 Wall，E推侧x2 Wall；N下端推侧3,3Wall，S整链前端3,3Wall且top推侧3,9裸SPIKE。初态普通free没有合法移动第一步；cargo/出生后另论，不能把五箱列为已可抽用。|
|94 C4|4,4|N目的4,5Wall，S推侧4,5Wall；E推侧3,4被93占，W连93最终x2,4Wall。初态普通锁住，后续新容器机制不排除。|
|87 C4|7,7|E目的8,7Wall，W推侧8,7Wall；N推侧7,6由96占，S推侧7,8由88占。可作为96+87+88整体北推链。|
|88 C4|7,8|E目的8,8Wall，W推侧8,8Wall；N推侧7,7由87占，S推侧7,9裸刺。北目的7,9虽裸SPIKE仍有Floor，**没有Wall**，因此不是普通链的硬阻挡。|

下WA2后只读安全单人局部：A到5,2，下一A可把86+95左链送86[3,2]/95[2,2]，推者4,2，全Floor；再A送86[2,2]/95[1,2]、推者3,2；再A链前0,2Wall，应回S3,1，不自动造wait。这里只核推格，无实际前缀/多人响应授权，primary选择出生/箱色冲突域。

## Pri96光路与可推侧

Pri96[7,6]北邻87[7,7]是C4，东8,6 Wall，南7,5/7,4 Floor后7,3 Wall，西6,6 SPIKE→Goal5,6 Floor→4,6 SPIKE→91[3,6]远BOX后2,6 Wall。北邻BOX与西远BOX的光学作用不能混同；SPIKE不是Wall，Player也不自动替邻BOX遮影。

**光学条件候选**：至少一有效观察者在7,5/7,4南轴，另一有效角色占左Goal5,6且位于西轴；north邻C4/eastWall若实际关闭相应方向，可能满足右GoalPri。这是本关未校准条件，须完整读96.testCompleted与两个Goal/level.completed，不能仅traversed或位置相符便宣称完成。

**普通直接推Goal条件**更短：若active free合法站7,5，singleW推96+87+88三物北链：96→7,7、87→7,8、88→7,9 SPIKE，推者停Goal7,6安全。头C4空箱的刺上活性/混链移动须actual，但裸推者不踩刺，目的有公开地面、无Wall，不能把7,9裸刺当墙来拒绝这一推。

## 具体XWW条件终局（尚无进入上岛的prefix）

若**单effective free[6,4]/faceW/F1**已正常到上岛，且96/87/88仍原位空height1、5,4/7,4两出生格均空SOLID：singleX可尝试生5,4与7,4，接W→5,5/7,5，两格safe，末singleW使左人占Goal5,6、右人普通整链北推后占Goal7,6。简写**XWW**，但只代表这一前置的局部条件；若有其它持叉角色响应共同X/W，必须另按实际校准，不能省略。

两个Goal5,6/7,6同棋盘相位，与该水平出生布局相容；**没有从fresh起区到6,4/W/F1的完整合法前缀**，不对owner当前现场发XWW，不把上方刺Fork当已可用，也不重复primary动态图。

6,4的N6,5/S6,3均Wall，普通上下移动不能让自由角色到6,4并保持竖向face；点内W受阻会回A走5,4，不能凭空原地转W。上述6,4/W或S的出生取向需要已实际的出生/释放/合法朝向前置，不能把任何普通侧向到6,4的玩家直接套X。**两free5,5/7,5末singleW**本身不依赖这个额外朝向假说，优先保留其真实几何。

末W后立刻核completed/自动返回，**不要再加W**：若仍在双Goal5,6/7,6，右北链被7,10Wall封住，回A会踏6,6裸刺；左north5,7Wall，回A会踏4,6裸刺。不是可安全多按一步等待的尾。

本域ready，实际WA2/F2、新raw地形/箱推侧、南西光学条件和direct北推Goal/XWW局部末段已发owner/primary/root。零搜索/输入/新JSON/后台，不要求owner驻关或暂停。
