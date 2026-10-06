# 5-10 遮罩：先核三棱镜两支观测

只读私模[ch5-10-delete-oct06.cjs](ch5-10-delete-oct06.cjs)，公开源[5-10.json](../artifacts/slot1-playthrough/5-10.json)。sole input owner仍slot1_owner_oct06；禁提示/启示/简化/攻略/隐藏实现/反射/存档读写，不输入、不写主KB/extraJSON。root处理正式知识与存档核验。

真实fresh0 main0/frame5717560：delete/遮罩，65entities/116tiles、size[8,12]、无ICE/DARK。P61[3,2]/F0；Fork58[5,2]；Shadow59[7,3]/60[4,9]；Button57[7,9]、Gate55[2,8]/56[3,8]均闭。Goal54/Pri62[1,8]、Pri63[1,5]/64[1,1]。Floor取tiles加动态floor实体，Goal1,8不遗漏；0,8是明确Floor，7,8裸SPIKE、8,8同格Wall优先。SPIKE6,3..7阻左右穿越，左主房与右7列经row1/2连通。

实际DD2 main2/frame5759391，P61[5,2]/D/F1；三Pri traversedtrue/testfalse、两Shadow原位active、双Gate闭。root独立5781638对完整65dict/116tiles/instructions相等。光学flags从实际源携带，不把traversed与消影混成同义；5-9原下移Pri过Shadow所在row的失败史继续适用。

先考虑新0运输光学probe：singleX3两侧5,3/5,1均safe，真实ID/GMID/分配待actual；保持全部Box/Prism原位，两个free到2,5与2,1观察两个向东支。GoalPri北1,9Wall、西0,8Floor后物理环绕8,8Wall；光学射线是否也同样封口不能只依物理模型。东双Gate仅知道blockable=true，未证明能封光学测试枝；撤回对M055或3-26混合构型的跨域推断。南col1串联Pri1,5和1,1，底Pri南1,0/西0,1墙，目标双east观测有可判别价值，是否完成必须actual。

另一条件完整Goal路线需Shadow59送Button7,9，末推者裸死7,8而另free保活，从4,8经双openGate向西推GoalPri到0,8自占Goal。新障碍是Pri1,5会照掉Shadow59经过7,5；不能复用5-9相位条件（该关右pusherx6，本关x7让旧blink两格奇偶不同），也不预设Shadow60或Player一定遮住此光。上Shadow60下移至4,8是否由closedGate保护、双Shadow同tick临时遮罩的光计算顺序均未实测，不能盲部署完整运输。

## 三棱镜光路的短阴性与当前11的安全双East前置

actualX3 main4/frame5826750：原61[5,3]/D、新65[5,1]/D/GMID61，两F0/g0/free，所有物体原位。三Pri traversedtrue，但仅底64.testCompleted=true，中63和Goal62.testfalse；root独立5830334全66dict/116tiles/instructions相等。不能把底true当全关完成。

新固定五物体导航域仅 **282expanded/302seen/pending20、limit1500、hit后停止**，hypbirth集合5,3/5,1使用私有-1/-2标签、不写成游戏ID。MODEL path19 `WWWWWWAAAWADSAAAADS`可到双free2,5/2,1，只有几何命中，是否Goal网络满足未知。没有实际执行该19，没有Undo8回3，也不重跑此图；`recordedObserverSearch`保小统计、`--observer-search`禁重跑。

owner优先更短手工8 `AAAWWWWA`：actual11 main10/frame5850396原61[1,7]/A、新65[2,4]/S，双Shadow全active原位、Gate双闭。Goal62 traversedtrue/testfalse、relay63/64 traversedfalse/testfalse，明确directGoalSouth observer不足；10时65在2,5也未使middle testtrue。几何/静态字段与116tiles相等，未知光flags差异保`observerChecks`，不反推Gate已等价封光学枝。

从真实11手工新33 `WWWDSADSSSSSWWWWWWWWWWWDSSSSSAASA` 确定回放，0追加搜索、所有五Box/Prism固定、两free全safe。关键23=61[5,1]/65[3,1]，34=61[4,11]/65[1,6]，40=61[5,6]/65[2,1]，preA43=61[3,5]/65[3,1]；末singleA44到2,5与2,1形成双East光学对照。该33不用Undo或原19重放，任意提前completed即停；末完成未知，只建议actual短段核。`eastProbe.trace`有66完整字段预测/真实IDs，`eastChecks`随公开实际比较，默认CJS不搜索，不保存巨队列/新增JSON。

actual44 **main36/frame5917081实际阴性**：61[2,5]/A、65[2,1]/A，relay63/64均traversedtrue/testCompletedtrue，但Goal62仍testfalse；所有物体位置不动、双Shadowactive、双Gate闭。全段物理/static与116tiles相等，变化光flags保`eastChecks`。说明两子网实测满足仍未完成sourceGoal，不能把M055引用成闭Gate封Goal枝或把testtrue当永久记录。

## 两个新有限导航排除与上残影短下降probe

owner提出Goal南夹持observer或可影响relay照影，区别于5-8西Player替Box反例，仍未知。从actual44固定五物体到free1,6+7,2的小域 **422expanded/422seen/pending0/closed/hitnull、limit2000**；保两free，无死/合并/capture/force/hold，仅排该固定构型，并非全关无解。

接owner实际手工6 `DDDSSS`及singleW到51 **main44/frame5997392**：原61[5,3]/W、新65[7,3]/W，Shadow59[7,4]active、60[4,9]active、三Pri不动，Gate双闭；全部物理/static/116tiles相等，携带的63/64 testtrue实际转false反例留`resource51Checks`。这个NEW Box7,4构型固定物体到free1,7+7,3，另一个微域 **443expanded/443seen/pending0/closed/hitnull、limit1500**。源先用44+已核手工7几何，再由实际51校准；不重跑422，不能假该目标已达而送Shadow过row5。

当前51的手工14 `SAAWWWWWWWWDAW`已实际安全到65，五物体完全不动，原61[1,7]/W、新65[4,10]/S。singleS66 **main58/frame6069718已实际** 把上Shadow60从4,9降到4,8且仍active，原61退1,6/S不推Pri，新65落4,9；Shadow59仍7,4active，双Gate闭，Goal62.testfalse、relay63/64.traversedfalse/testfalse。私replay全部物理/static/116tiles相等，携带的光flags差异保留；root独立6102208对主58完整66dict/116tiles/instructions严格相等（据root回报，不挪用旧44独立帧）。这只证明本次下降不去影、未完成Goal，不推断门必挡光或去活残影必遮光。**下一S67未执行**，左人会把relay63推1,4对齐Shadow59，仍有失影风险。`upperMaskProbe.trace`存66完整预测，`upperMaskChecks`保存实测差异。

从真正actual66的新构型（Shadow60[4,8]/59[7,4]）再仅一次固定物体导航，到两free1,7+7,3：**442expanded/442seen/pending0/closed/hitnull、limit1500**。不重复44的422或51的443，仍保两F0活free/五物体固定，拒death/merge/capture/force/hold；只封各源所在普通分量，不能称所有首Fork出生、动态运箱或新机制都无解。

本关未完成；三新固定nohit共1307，连旧282总 **1589扩展**，无活handle/队列文件。按root指令就此封存，不凑20k余量；owner可正常5-11继续，5-10回访需真正新birth/动态资源的具体短positive。默认CJS仅audit/历史搜索禁重跑，主KB与游戏唯一输入由root/owner处理。日期已至2026-10-07，保留oct06文件名承接原研究历史，未重命名或删失败记录。
