# 2-G M045有限修正：无门校准与首窗口已封（2026-10-05）

**当前：无门校准通过、actual64固定吻合；root随后把首窗口细化为“本输入主动推箱停，稳定仍保3left”，同一≤5000预算续核已截断5000/6503/pending1503。此筛法没有命中；root选择最短17尾作正常实机判别，实际81已产生3轴，主events108可核，未完成。axis0/1只留right，axis2保存两名左人及right但仍含133时的运动字段，尚不作普通稳定seed。没有运行handle，不扩图。** ≥3left是本轮模型筛法，不是用户限制；此前“不推荐”只指未满足该筛法，不能据此否定两个惯性来源的实测价值。以下诊断与126早停都是历史阶段，实际闭环见末节。

现场仍实际64/time89/5free9BOX，未输入任何动作。仅私有 `ch2-G-m045-model-oct05.cjs` 克隆公开chord模型：同face且恰一个md>=0/另一个md=-1时不立即融合；双方停止和两个同face moving的旧规则没有推广。原owner模型、canonical、主JSON与存档未改。没有搜索/session handle，也没有使用提示或隐藏实现。

按root要求只固定两个M045窗口，各一次普通输入；没有全关旧解重放，没有按相同instructions长度误选其他历史。

## 2-21 events15→17 单S：几何校准通过

真实before19：1789,7/S、18310,7/S，BOX16017,7；其他5activeBOX也全部作为阻挡保留。真实after20/time29：17818,7/D、18317,7/D，BOX16019,7；两人active/uncontained/ghost0。

新克隆单S固定结果逐ID位置、face、全部6BOX与实际一致。模型第7微拍在17,7出现后人178仍D向移动、前人183刚推箱已停止，face皆D；保两人后178继续再推同箱，最终位置恰match。微拍计数是模型诊断编号，不作为游戏time或真实采样帧。

## 2-13 events84→86 单A：整输入未校准，原因是动态门模块缺失

真实before31/time46：58=9,1/S、59=8,1/S，BOX54=3,1；真实after32/time53：58=2,1/A、59=3,1/A，BOX54=1,1，两人active/uncontained/ghost0。这两帧是M045成功重访，不是旧31/32其它失败历史。

原chord base把所有active/blockable非BOX固定加入walls；本窗口Gate57[4,1]初始blockable=true，因此被整个单A锁死。它没有模拟ICE上的Button55[6,1]/56[7,1]微拍开关。新克隆于是前人在5,1停、后人在5,1与其同face一动一停交会，下一微拍因假固定门双方同格停止而融合；最终只58在5,1、BOX仍3,1，与实际不符。

这不是M045反例，而是校准关含chord没有的动态Gate。公开M037也明确门完整途中开关未逐帧采样、不可凭ID猜条件。本助手没有为强行match去删除Gate、猜按钮配对/同输入时序或开门oracle，也没有把受门污染的5,1模型cross当实际M045采样。

`ch2-G-m045-calibration-oct05.cjs` 可复算两份公开前态与单输入，输出 `passed=false`（一通过、一诊断）。依root“校准不吻合停在诊断”，**尚未启动从64/new60的新M045窗口/force图**，不把计划叫运行搜索。待确认只用2-21精确充分校准，或提供2-13实际微拍门时序后再决定；本助手不越权继续搜索。64既有fixed无任何角色重叠，原实际核验不因这处修正失效。

## root缩为无门范围后的固定actual64与单轮首窗口

root独立复算同结论并明确缩减其自定“两例全match”条件：2-G没有门，不必扩展本模型的动态Gate模块；只以2-21完整真实单输入作为无门M045校准，2-13仍未校准但不是该规则反例。随后本助手用新克隆固定64，对主2-G events79真实64/time89逐ID玩家坐标、face、active/ghost/contained以及9BOX位置核验全部match。root另独立核 diffs=[] /newCrossCount0。**模型trace计数总和96不是实际time89**，它包括结束的无移动微拍；所有游戏time一律取真实journal/MCP，不由本模拟ticks授予。

只一次 `ch2-G-m045-first-window-oct05.cjs`，cap5000/depth35，从实际64找第一个“同face恰一moving/一stopped且当微拍仍保3left”的新增窗口或首安全force。不同face正交、capture、stack、movingBox正交仍停止；额外保守停止未经证明的相反face一动一停，不借旧base那条许可扩展前置。没有推广两个同face moving。单轮**expanded126、seen208、pending82、depthCut0**，hit后早停，不是穷尽；没有扩大图或用剩余预算再搜索。

首窗口完整实际64之后仅模型6输入：`WDWDSA`。前5输入稳定pre69：10612,6/S、1086,4/S、1093,4/S，107此前推箱后踩8,4SPIKE死亡；9BOX分别11010,9、1115,7、1126,7、1138,9、1142,10、11510,5、1168,5、1178,7、1185,10。右105仍在安全竖廊。末A：

| 模型微拍 | 108 | 109 | 106 |
| --- | --- | --- | --- |
| 0 | 5,4，faceA，moving A | 2,4，faceA，moving A | 11,6，停 |
| 1 | 4,4，moving A | 2,4，1,4 Wall阻A，已停 | 11,6 |
| 2 | 3,4，moving A | 2,4，已停 | 11,6 |
| 3 | 2,4，仍moving A | 2,4，已停 | 11,6 |
| 4 | 1,4 Wall阻止继续A，双方停止融合 | inactive后的旧模型同格合并 | 11,6 |

第3微拍是新增保留窗口；但本例停者因Wall停止，并不是M045两个校准例的推箱停止。后方亦被同一墙挡住，稳定只留1082,4/A与10611,6/A，2left、9BOX，右10514,6活。最终状态与旧即时融合模型的库存相同，没有force/分叶/通关信用。它验证新模型的首窗口可复算，但不改善四Goal资源；**没有建议owner为此6串输入，也没有把这个模型窗口称实际2-G规则实证**。

本轮只先找到首新增窗口并停止；未对“后方能继续推箱、稳定保三左人”的更强目标另起图，未重跑旧20k或封存64/new60图。若后续要推进，须明确新的真实库存或有用碰撞谓词，而不是将这82待展开状态当正在运行。

## 同一≤5000预算内细化：真正推箱停且稳定保3left

root明确授权继续细化同一窗口判据，允许重放先前126前段，不增加cap。私有克隆记录每人本输入stopCause/stopTick/stopBoxes，推箱停止必须能对应 `requested.by`；回合初始清空这些元数据，避免把上一输入停止误认本次推箱。只有moving与本输入box-push-stopped同face交汇、然后整个输入稳定仍有至少3functional left才算hit；停墙后合并不算。

实际一次精确新域预算到cap：**expanded5000、seen6503、pending1503、depthCut0、hit=null**，非穷尽。失去第三left剪枝4579，未知不同face crossing60，capture13，双惯性BOX正交6；唯一box-stopped交会稳定不保3left而被拒绝1次。旧20k、64/new60其他定向图没有重跑或抬cap。两个micro坐标视作功能角色不充分，验收用稳定结果人数。

该唯一推箱停窗口是64+`WWWDWDSDAAW`（11）。末W的前态为10610,9/A、1082,4/A、1092,2/S，BOX1132,9/1142,10。108先W推113/114双链到2,10/11、停2,9；第6模型微拍109仍W滑至2,9，与108同faceW。前链背2,12 Wall无法再推，下一拍双方停止融合，只2left，不能当M045带来可用新增资源。

## 6个惯性边界：只固定日志，不加图

第一轮实现只保存每类别first，root要求审全部6个。仅重放同一5000日志以保存6条拒绝路径，队列统计严格仍5000/6503/pending1503/depthCut0；没有继续第5001状态，也没有新目标/更大cap。然后 `ch2-G-m045-inertia-fixed-oct05.cjs` **只逐串固定重放**这些6条，确认最后输入之前每步accepted、没有更早unknown。所有右105逐输入独立核始终在安全14,4..10，窗口时都14,9。

| actual64后的完整模型尾 | 长度 | 单probe输入 |
| --- | --- | --- |
| WDWDASSAWWWWDWADW | 17 | W |
| WDWDASSAWWWWDWADD | 17 | D（fallback产生同结果） |
| WDWDASSAWWWWDWADSWW | 19 | W |
| WDWDASSAWWWWDWADSWD | 19 | D |
| WDWDASSAWWWWDDAWADW | 19 | W |
| WDWDASSAWWWWDDAWADD | 19 | D |

六条对应同一几何事件，不是6种可用资源：稳定pre都有10612,10、1085,2、1092,2；BOX1108,10、1115,7、1126,7、1138,9、1142,10、1158,5、1165,5、1178,7、1185,10。只有face或两步安全循环不同。

方向不能共用口头缩写：前两条pre三left均D；第三/四条均W；第五/六条为106D、108W、109W。六条right的probe前均14,10/W，最后W或D均经墙反弹到14,9/S。私有模型face索引是`WASD`，3=D。曾给owner的“最短pre三left A/right14,8”口头转换有误，已立即撤回；原fixed坐标与numeric face未变。

最后输入第2模型微拍，108向W推116并停5,5；第3微拍，经理106由12,10转A沿10行推110，自己进入8,10SPIKE死亡；此后110沿A惯性到6,10，111沿W惯性到5,9。第5微拍，目标1185,10收到两个 `by=-1` 请求，方向A与W。**它是两个移动箱对停止箱的惯性请求，完全不是自由人主动正交推正在滑行的箱，更不是已证主动force。** 当时仅1085,5停/1092,7仍W滑两个left，经理已经死；右105保活但未生成叶。当前模型停止，没有猜118应选哪个方向、叠体、旋转、融合或世界线分支。

因此六窗都不满足root“probe前至少3left、保未来控制资源”的价值要求，没有送owner任何建议输入串。即便允许仅两left测未知，整关四Goal闭合也没有证据。本轮只保存精确字段供未来不同更强库存对照，封存该≤5000域。capture13与cross60没有另起图、没有把数量当完成进度。本助手未发游戏动作，真实现场仍64，canonical由owner维护。

## root选择最短窗口作实际机制判别（结果待落盘）

root随后澄清≥3left只属于此前first-free-force筛法，不是用户要求，两个惯性BOX推同一118的真实结算仍有价值，已授权唯一owner实测最短17尾。正常部署64之后前16 `WDWDASSAWWWWDWAD` 的pre80应为10612,10/D、1085,2/D、1092,2/D及right10514,10/W，BOX位置如上；再单W81核分叶/实体来源/active/masked/contained。模型`by=-1`不能推断实际丢失的是Box还是Player，也不能替代实际branch字段。尚无第81结果，不把计划写成事实；本助手不输入、不建新图。

## 实际81：两次惯性请求产生3轴，有限边界闭环

上述计划现已实际执行。主 `artifacts/slot1-playthrough/2-G.json` events108 note为`after W81 stable 3-axis inertia collision proof`，instructions为原64+最短17尾、总81，completed=false；busy/input_locked/conflicting/looping皆false。没有为本报告新建JSON，所有游戏输入由owner执行。

| 实际axis | time | active玩家（均ghost0） | 关键Box终态 |
| --- | --- | --- | --- |
| 0 | 135 | 10514,9/S；1085,5与1092,9皆inactive/masked1 | 1105,10；1115,9；1141,10；1182,10 |
| 1 | 135 | 10514,9/S；108inactive/masked1；1092,10 inactive/ghost1 | 1105,10；1115,9；1142,11；1183,10 |
| 2 | 133 | 10514,9/S、1085,5/W、1092,8/W | 1106,10；1115,10；1142,10；1185,11 |

共同经理106在8,10 inactive/ghost1，axis1/2还masked1；旧107仍8,4 inactive/ghost1。九只BOX在所有三轴均active且maskedoff0；没有Box被该分歧失活。111的惯性来源与110的来源选择影响的是玩家mask，不能用private模型`by=-1`省略来源继承。event103已采到第一处分两轴，event104..108采到第二处分歧及最终三轴；报告只据这些公开帧描述本例，不推广任意双BOX碰撞的世界线数。

axis2是time133的保留分支：109仍`movingdir=1/movingsrc=109`，其余active玩家movingdir0/src-1；它不是模型W整输入稳定后的普通seed。尚待owner切换此轴的真实receipt/稳定字段才能给普通尾。新规则域/完整Goal信用均未开启，本助手没有任何游戏输入。

## 实际81与T后83：新惯性三叶证据

2026-10-05正常从已实64接17尾WDWDASSAWWWWDWADW，81单W生成三叶；前16稳定逐ID/face全match，ICE中断只续receipt.remaining。主events100为80/time127前态，101即时W回执，102..107完整动画/稳定帧，108三轴full；正常T两次109..112选择axis2并完成其原W余滑行。当前83有效输入（81方向+2T），三轴0/1/2全time135，未完成/未暂停/无锁。axis0/1仅105[14,9]F0活；axis2为105[14,9]/108[5,5]F0活，109已2,10SPIKE死亡；1068,10、1078,4亦ghost1/inactive。九BOX每轴全活height1/uncontained；118分别2,10/3,10/5,11；axis2另1106,10/1115,10/1142,11。81观察中axis2/time133的109滑行三活属于未继续的历史状态，不能当最终三活资源；T后真实稳定仅一个左人。本回访仍0undo0retry，旧1undo全保；118关6星不变，当前唯一输入owner /root/ch4_1_readonly。M131只记此正常惯性来源分线实例，不假设任意惯性事件独立二分、不将私有by=-1当实际来源，亦未闭四Goal。


### M131 同次输入的滑动箱保留推者来源，连续争推产生三条兼容叶（2-G）

2026-10-05正常64资源之后17尾 `WDWDASSAWWWWDWADW`：80/time127前态三left106[12,10]/108[5,2]/109[2,2]皆faceD，右105[14,10]/W；九空Color2 BOX，包括110[8,10]、111[5,7]、116[5,5]、118[5,10]。前16所有稳定ID/face与固定复算一致。81单W即刻回执executed1/remaining0、busy/input_locked；主JSON逐次完整观察保留到稳定，没有重发。

公开动画event102/time130：108刚推116停5,5，BOX116[5,6] movingdir1/movingsrc108；经理106[9,10] faceA/movingdir3/movingsrc106。event103/time133已出现两轴：一轴108masked，118[4,10] movingdir3/movingsrc106，尽管106已在8,10SPIKE死亡；另一轴106masked，118[5,11]、108[5,5]活。event104仍保留118[3,10]/movingsrc106。event105..108随后三轴0/2/1；118分别[2,10]/[5,11]/[3,10]，0/1仅右105活，2/time133仍108及正在滑行的109活。实机因此否定本实例中将箱惯性统一作为无来源请求、提前拒绝整个输入的模型；不能凭稳定movingdir0/movingsrc-1推断此前不存在来源，也不能凭私有by=-1猜实际分叶数量。

正常T逐次两次（events109..112），第二T回执明确105/108/109三人签名并busy；稳定后axis2原W余滑行到time135，109推114到2,11后自己在2,10踩刺死亡。最终三轴均time135：0/1仅105[14,9]/S活，2是105[14,9]/S与108[5,5]/W活。1068,10、1078,4死；108在0/1 masked，109在0 masked、1/2 ghost1。每轴九BOX皆active/height1/uncontained，无cargo/stack/新增Fork。当前83有效输入、未完成；此前axis2较早时刻的三活不是最终资源。timeline id全119，T选择以即时玩家签名与对应轴time变化核，不能按数组0/2/1或只按id猜。

证据：artifacts/slot1-playthrough/2-G.json events100..112。本例只确认正常输入中的来源继承、连续分线与真实三叶结果，不推广任意多箱惯性独立二分、全部masked次序、再分线可达或四Goal完成。原M045校准/64/旧46与所有有限搜索历史完整保留；无存档进度或成就编辑。
