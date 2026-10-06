# 5-8「光房」静态光学与缓冲布局（只读，2026-10-06）

公开canonical为 `artifacts/slot1-playthrough/5-8.json`。initial/frame4542440为真实入场inputlocked；**event1/frame4551764**是稳定fresh0、guards全清、runtime `lightroom`、单叶103、size[15,12]、min[0,0]。本文仅读完整raw实体与tiles，不以字符图代替Floor/Wall判定；不输入、提示、反射、实现或存档修改。

本文局部固定导航域已到3000扩展上限并退出，primary的新5-8 dynamic/capture域不重复这一段。只有本MD，没有额外CJS/JSON、巨检查点或后台handle。

## 公开完整资源与实际取叉/分裂

fresh0有103 entities：72个SOLID/Wall、23个PRISM、3个BOX、1 Goal、1 Gate、1 Button、1 Fork、1 PLAYER；207 tiles。P79[7,8]/S/F0/key0/ghost0/free。

|ID|位置|类型与属性|
|---|---|---|
|72|14,11|GOAL，active/floor=true、blockable=false|
|73|14,12|Gate/ID0，active、blockable=true、pushable=false，底层SOLID Floor|
|74|2,1|Button，active/floor=true、blockable=false|
|75|3,8|BOX Color4、Shadow=false、active/pushable/blockable、height1、空箱|
|76|4,9|同75|
|77|9,8|Fork KEY，active、isFork=true/defaultType-1|
|78|4,8|BOX Color1、Shadow=true、active/pushable/blockable、height1、空箱|

三箱均mask0、contained0/container-1、motion0/src-1/ext0。BOX没有PLAYER.ghost/Fork/key字段，不把Shadow78当额外角色、cargo或资源复制。

23 Pri全部active/pushable/blockable、height1、Shadow=false/Color1、mask0、contained0/container-1、motion0；fresh0均lighten/traversed/testCompleted=false。完整坐标/ID为：

- 左列x1、y2..11：102[1,2]、101[1,3]、100[1,4]、84[1,5]、85[1,6]、86[1,7]、80[1,8]、81[1,9]、82[1,10]、83[1,11]。
- 顶横行y11、x2..14：87[2,11]、98[3,11]、99[4,11]、88[5,11]、89[6,11]、90[7,11]、91[8,11]、92[9,11]、93[10,11]、94[11,11]、95[12,11]、96[13,11]、97[14,11]。

Goal同格97北邻Gate14,12、东15,11Wall、南14,10安全Floor、西邻Pri96。左列与顶横行构成连通L形，不能丢掉远处左列或把仅邻近两Pri当整个网络。

**实际资源校准**：fresh0 `DD` 经8,8与9,8两个SOLID且无阻挡格到Fork。event3/frame4595885实际2：P79[9,8]/D/F1。singleX3已实际event5/6/frame4722823：P79[9,9]、新P103[9,7]均active/ghost0/free/F0；GMID分别76/100，以actual分配为准。两侧9,9与9,7都是raw SOLID，非刺、无其他实体。

之后owner在短光学校准中已到actual10/event14/frame4766578、`DDXWDDDDDW`：P79[13,10]/A、P103[14,9]/W活；三箱仍原位active，Pri95/96/97 traversed=true/testCompleted=false，Pri80/99仍false。两角色已覆盖邻近的两条南观察方向却未完成，owner/root已撤回尚未执行的后7步，不把traversed=true计作完成。

## Floor/Wall与刺的实际覆盖

边界x0/x15与底y0全部Wall；顶y12仅14,12是Gate通道，其余Wall。左内墙1,1，2..4,y2..4为Wall；y2的x5..10也Wall；10,3/10,4/11,4为Wall。Wall uniformly active、blockable=true、pushable=false、floor=false。

raw SPIKE共20位置：2,2；3,1/3,2；4,1/4,2；5,1；5,y7..10；10,y4..7；11,y2..7。其中2/3/4,2、10,4、11,4同时被Wall覆盖，不能把它们当可走地刺。没有ICE/DARK。Goal14,11缺少tiles条目但GOAL.floor=true，离开Pri后仍有公开地面。

```
       x=0123456789012345
y12      ##############g#
y11      #RRRRRRRRRRRRRR#
y10      #R...^.........#
y9       #R..B^.........#
y8       #R.BB^.P.K.....#
y7       #R...^....^^...#
y6       #R........^^...#
y5       #R........^^...#
y4       #R###.....##...#
y3       #R###.....#^...#
y2       #R#########^...#
y1       ##b^^^.........#
y0       ################
```

该图仅辅助定位，推位以raw Wall/Floor/active/blockable为准。Gate顶边界不自动证明世界环绕、跨维度或成就。

## 右上方两条南轴的实际阴性

owner原提出从实际DDX3用14方向 **`WDDDDDWSWWWSDD`**，条件末free[13,9]与[14,10]。实际前7方向到整体10时，已在13,10/14,9分别覆盖Pri96和GoalPri97两条南轴，仍testCompleted=false/level.completed=false。未执行的后7步已撤回；不能把原整体17末点写成实际。97北原闭Gate与东Wall、96北13,12Wall可能关闭对应方向，但96西仍是95，继续连到整个顶行和左列。

具体未封支路例子：Pri80[1,8]东2,8是Floor，75[3,8]是**远箱**；Pri99[4,11]南4,10是Floor，76[4,9]也是**远箱**。M054的邻/远箱区分不能把这些远箱当相邻封轴。没有证明13,9/14,10二人同时满足整个23-Pri网络；也不只凭静态假设否定新的实际探针。验收以实际全部Pri的testCompleted、Goal与level.completed为准。

这是primary/owner已经实际校准到10的阴性，不是本文新搜索结果，不再推荐补后7。它只排除本固定双南轴方案；其它未实测光学规则保持UNKNOWN，不能假横向Prism只产生N/S两条方向或让左网凭空消失。

## Button与移动GoalPri的独立条件终局

Button2,1的北2,2、南2,0、西1,1均Wall；唯一东3,1是SPIKE，继续4,1/5,1也都是SPIKE。不得让裸人连续AAA进入按钮。

若某active BOX/cargo**实际持久压Button2,1**，并实测Gate14,12.blockable=false，则free合法站14,10后 **singleW** 可把Pri97从Goal14,11推到Gate14,12，推者停Goal14,11的safe Floor。该位置可直接占Goal，无需先满足23-Pri折射网络；这一推是MODEL条件，必须实际核移动与completed。只推进14,12，不再向边界外推进，不需要环绕假设。

这不是已构造的Button前缀。**下述第4缓冲只针对“末推者也安全存活”的特定链方案，不是通关资源必要条件，用户没有要求两free都存活。** 要在最后向西把某箱送入2,1且保留该裸推者，例如四个可推对象在3/4/5/6,1、推者7,1，单A后前箱2,1，推者6,1安全；三箱链同构终步会令该推者进入SPIKE5,1。不能自动补造第4对象或假定23 Pri随时可回收，也不能由这条全safe链未成立推成资源不足或全关无解。

**压Button不要求cargo。** primary的新方案是普通空箱送Button后，末推者可在3,1正常裸死，另一个free保活去14,10推动GoalPri；这可能只需当前物体，完整运输仍待actual。若仅有一个free而它死亡，才不能继续把同叶“留下按钮箱”当还有外人推Goal。本文不否定保留另一free的牺牲方案，死亡与末Goal仍按实际验证。

## 双盾保护Shadow的安全三步布局

78初态[4,8]的左方75[3,8]、上方76[4,9]可挡来自左列1,8及顶行4,11的光，三箱原位时Shadow确实active。双盾是与M144光学清影相容的布局假设，仍需actual；单独搬一个盾可能令Shadow去活，不能固定把78当永远可用箱。

若两个free已合法站在**[3,9]与[4,10]**，共享S分别推75及76+78混合链，连续仅 **SSS** 可保持Shadow每一步的左/上紧邻由两普通箱屏蔽：

|步|75|76|78|推者位置|
|---|---|---|---|---|
|0|3,8|4,9|4,8|3,9 / 4,10|
|S1|3,7|4,8|4,7|3,8 / 4,9|
|S2|3,6|4,7|4,6|3,7 / 4,8|
|S3|3,5|4,6|4,5|3,6 / 4,7|

所有推者格与箱目的地都是安全SOLID，不裸踏刺。每步须核78.active及三箱完整字段，不能把“盾还在”当已证明任意光学清影顺序。

**禁止第4S**：75前3,4是Wall；76+78链前4,4也Wall。4,7的角色若转D，会进SPIKE5,7；不能给SSSS批。此fixture首次审计时只有条件；后续owner从不同Fork点实际实现：event26/27/frame4943560、actual17 `DDSSAAAAAAAWWWWDX` 直接生79[3,9]/104[4,10]，event34/frame4957562、actual20接SSS后位置与上表相符，三箱均active。因此旧DDX固定导航阴性不能推出所有取叉/分裂位置都不能到此推侧。

75可由safe3,9向S下送3,7/3,6/3,5，3,4Wall处需止；76可由4,10向S，但会同时推动78、改变其光学位置。把76单独作为可回收独立箱时必须同时考虑78与屏蔽，不能忽略混合推链。边界23 Pri在顶行/左列的推侧大多是Wall、其它Pri或不可进入格，尤其97移动依赖Gate实际开启；不拿它们作无前置的第4缓冲。

## 固定导航有限域与实际界限

只读固定全部3箱和23 Pri，从条件DDX后的9,9/9,7导航到推者3,9/4,10，拒任何可推物移动、裸SPIKE、角色merge及未知swap。到上限：**3000展开、3060 seen、60 pending、无hit、截断**；pushBoundary209、spike1469、merge80、swap0。未封图，不作不可达或全关无解结论，未扩大预算。源DDX后来已实际校准；该同源导航未找到目标，但不同分裂点的actual17后来已直接生在目标推侧。

该域已结束、队列未存盘、无后台；primary已收到范围，主动态/capture图不重复此固定推侧目标。旧DDX源与新actual17的分裂点不同，后者已真实到该推侧，不把3000旧域结果当全局否定。真实完成和新机制由唯一owner与primary验收，本文不写主KB/进度。

## 34→44→46的新实际与末段资源审计

本次续审基准actual34/event52/frame5072030，root独立全部104字典、207tiles与指令严格相等：75[8,4]、76[9,5]、78[9,4]均active；free79[7,4]/104[8,5]皆F0/g0。

actual43/event59/frame5162960：75[8,5]、76[9,5]、78[9,4] active，free79[9,3]/104[8,4]。singleW44/event61/62/frame5167533把75移8,6、76移9,6、78移9,5；**78 inactive**，79[9,4]/104[8,5]仍活。104就在影的西邻8,5，也未替代普通西盾阻止该具体消影；不能把活PLAYER当本fixture的BOX遮光盾。

owner随后正常Undo1恢复43/event64/frame5205121，再ASW到**actual46/event68/frame5310861**：75[8,5]西盾、76[9,6]北盾、78[9,5]仍active，free79[9,4]/104[7,4]皆活F0。event70/frame5351228是相同46的正常暂停菜单，之后owner已正常返回世界进入5-9；本46是回访历史源，不能称仍在现场。累计Undo9留在主journal，未改存档或主动提示。

### 三有效对象的完整Button→Goal条件尾

此段是**完整末段候选，未有从46/34运输到该前置的实际positive**；角色ID可互换，以下仅以79作末推者、104作保留角色标识：

- 普通C4 75[10,1]为最前推物，active Shadow78[11,1]与普通C4 76[12,1]在后，三物连续、height1、无cargo；最终由普通C4压Button，不依赖Shadow按钮的特殊规则。
- free79[13,1]与free104[7,3]，同相、F0/g0；GoalPri97[14,11]及其余Pri保持原位。
- 78在11,1的上方11,4为Wall，随后往西的3..10,1上方y2都是Wall；原左列的y1也没有直接连通Prism，影的存活与该Wall屏蔽相容，**仍须actual逐段核78.active**。本前置绝不能用当前inactive44的78冒充。

候选25方向：**`AAAAAAAADWWWWWDDDDDDDDWWW`**。

|末段累计|预测停点/对象|实际验收重点|
|---|---|---|
|7A|79[6,1]、104[6,3]均活；75[3,1]/78[4,1]/76[5,1]|影仍active，未误删SPIKE上的普通箱|
|8A|75[2,1]压Button，78[3,1]/76[4,1]；79进入SPIKE[5,1]正常死亡；104[5,3]活|只牺牲末推者，另一人仍effective free；读取Gate73是否实际打开|
|D|104[6,3]|死者不会作为可控角色继续输入|
|5W|104[6,8]|经6,4..8全SOLID，避5列地刺|
|8D|104[14,8]|row8 x7..14全SOLID；三个按钮箱不动|
|WW|104[14,10]|14,9/14,10安全，Gate必须已实测open|
|末W|97→Gate14,12，104→Goal14,11|唯一末推，认真实completed/自动返回；若此前已完成则不再输入|

8A中的104不是留在14,10等候，而是利用下室5,3/6,3的正常转向：5,3的A目标4,3Wall、下一S5,2Wall，因此回D到6,3；下一A又回5,3。这是从7,3开始的完整保活8A预测，不会走到上层5,8/5,10地刺。该候选允许末推者死亡，**压钮无需cargo且不要求双free全程都活**。实际Gate配对、Shadow存活、末Pri推门及完成仍待验证；没有把条件前置宣称从46可达。

### 两普通箱与第3棱镜的局部切口

若44只剩两个active C4，仍应允许牺牲/尸体/装载或未来新机制，不能据此全局判无解。但普通两箱向左连续链的一个明确末端是：front[6,1]/rear[7,1]、pusher[8,1]，三A后front[3,1]/rear[4,1]，推者在SPIKE5,1死亡，**Button2,1还未占**。此时继续裸角色站4,1/5,1均不安全，上方3/4/5,2为Wall，下方y0为Wall；不能把另一free仍存活就自动视为还能推完。到达该两箱前置同样未证明，本文不输出额外真实探针。

普通可推Prism作为第3缓冲也有严格推侧条件：在Gate闭、未堆叠/未穿墙、普通推链模型内，顶y11的x1..14满连排左右被0/15,11 Wall封死；左x1的y2..11满列上下被1,1/1,12 Wall封死。左列向东需0,y Wall推者，向西目的也是Wall。顶行向南需x,12推者、向北需x,12目的，除14,12 Gate外全是Wall；97唯一可北推目的Gate当前闭。**因此本有限检查中没有可直接抽出的第3Pri，不能只因pushable=true就列为现成缓冲。** 若Gate已实际开，97可取，但已可直接完成Goal；不把这个反事实当开门前的资源。

M064曾在Color3关验证迟到空箱不复活/装载死者，M092/M137则验证特定同刻落刺捕获可保active cargo，不能互相覆盖。当前末段所有推动只有普通一拍、无ICE；前箱/后箱都向左移动，裸推者死亡格在最后箱的原格，**不是已证明的同刻汇入新箱目标格**。C4尸体后来回收、Shadow载人消影释放、Prism特殊出生/堆叠等若有新actual可改变上述局部资源模型，本文均保持UNKNOWN，不假设它们不存在或已成功。

本续审仅做25步固定末段手工回放、推侧与两箱末端算术，未重跑旧3000或2035域，未开完整BFS。所有运输缺口、影失活与正常Undo历史如实保留；5-8仍未压Button/未完成，owner继续5-9全成就进程。
