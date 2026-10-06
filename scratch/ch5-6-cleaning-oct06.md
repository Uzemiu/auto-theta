# 5-6 清洁：缓冲降箱与单观察者光路（2026-10-06，只读）

私模 [ch5-6-cleaning-oct06.cjs](ch5-6-cleaning-oct06.cjs)，证据 [canonical](../artifacts/slot1-playthrough/5-6.json)。只公开观测与手工确定重放，0搜索、无handle；无游戏输入/提示/外部攻略/隐藏实现/反射/存档或主KB改写。sole owner是slot1_owner_oct06。

fresh0/frame3530015：P47[2,2]/S/F0，无KEY/Fork；C4 Box41[5,6]/42[7,3]，ShadowWhite45[4,6]/46[6,4]，Pri43[3,6]，GoalPri44[7,1]永久角落。SPIKE row2 x3..6、row5 x3..5，无ICE/DARK。实际S1 main3/frame3591691：P2,1，44 traversed=true/lighten=false/testCompleted=false，全部对象原位；root3667634完整48实体与instructions diff=[]。远Box42[7,3]未像紧邻7,2一样关闭北方向，符合M054有限既有规则。

Shadow直接光束去活尚未本关验证，不把5-5的Shadow到Goal消失自动当全部光束规则。模型光学逐步计算GoalPrism传播、普通Box邻接/远阻差别、活人观察、递归Pri网络；循环采用最大固定点作为候选，光flags须实机核。无尸体/装载/分裂/叠加/force模型。

sourceS1后前32 `WWWWWWDDDSAWAASDDWDSAAASSSSASDDD`，末singleD34独立。先S把41降SPIKE5,5；A混链把43推2,6与45推3,6。43南推2,5腾2,6，45经DD送5,6，再由5,7 singleS双箱缓冲把41降5,4、45留5,5，pusher只在5,6安全。43沿安全col2下送2,1，再从1,1向右送到5,1的preD33。Shadow45始终active；光经过43在5,1时被41[5,4]远挡，未提前照掉buffer。

每4停点time5 P2,5/W；9 P4,7/D；13 P4,7/W；17 P3,6/D；21 P5,6/S；25 P2,5/S；29 P1,2/A；33 P4,1/D。pre33 guard：41[5,4]/42[7,3]、45[5,5]active Shadow、46[6,4]active Shadow、43[5,1]/44[7,1]，单P活free/F0/key0/g0。D34使43最终6,1、P5,1，预测北beam照46使inactive是首NEW边界；若阴性止，不部署后尾，可正常Undo1恢复并真实记数。43在6,1不可回收是最终fixture，不当后续中转。

若D34实测46inactive，完整几何后尾42：`AAAWWDDDDWDSWAAAASAAWWDSASDDDDWDSAAAASSDDD`。由7,4南推42到7,2紧邻Goal封北；41已在5,4，经左推2,4、安全2,5南推2,3、从1,3右推6,3，再从6,4南推到SPIKE6,2紧邻43封北。剩43西由row1活人覆盖，东连44，44西连43，其余邻Box/Wall或循环。此尾未actual，不盲布不可回收箱；模型会在time73 P2,1首次预测Goal满足，比尾末P5,1早三D，须actual回执停止，不重发剩余。45留5,5并不在最终光路上，不能另宣称全部Shadow均清除。

## 前缀实际校准与光flag反例

actual5/9/13/17/21/25六停点完整48实体字典和terrain均diff=[]。actual29 main17/frame3741535与root3778669严格一致，唯一旧model差异是43.traversed预测true、实际false；其余完整字段与物理/静态全部相等。actual33 main19/frame3800288与root3820869严格一致，同样43.traversed实际false（Pri5,1、P4,1），不是只在29离开光线时false。不能将`traversed`等同几何射线可达，也不能称前32 raw全字段皆严格相等。

CJS保留两处 `.rawEntityPredictions`/`.full48Diff`旧反例；具体已观测checkpoint的`.entityPredictions`改用实际false，`.calibrated48Diff`单列，不推导所有后续traversed规律。`.physicsStaticDiff`只去掉动画及三个光flag，GMID/Color/Shadow等details静态字段仍核。D34 Shadow46照光效应仍必须实测；不能据traversed false提前认定没有光射线，也不能用几何模型宣布已消影。

## D34实际照影阳性，后尾使用实际源

singleD34实际main22/frame3823354与root3848948全部48完整字段和instructions严格一致：46在6,4变inactive，45仍active于5,5，41/42不动，43[6,1] **traversed仍false**，44 traversedtrue，两个testCompleted=false，P5,1活free。因此几何光传播可照掉Shadow46，同时公共traversed标记保持false；它们不是同义。第三处旧model预测true/actualfalse也保留。

新私模将illumination与WASD顺序短路测试遍历分开，后者只是由29/33/34和既有邻箱规则推断的候选解释，不声称读取游戏实现。前两原始反例不因新解释而改写；先前照影未知已由这个46实例转为实际，不扩大到全部Shadow/叠体/乘员。

owner后尾使用39 `AAAWWDDDDWDSAWAAASAAWWDSASDDDDWDSAAAASS`，从真实D34源重放；与原42只有47/48绕行及省最后3D不同。11步到45/P7,4，singleS46推42到邻Goal7,2；后到66/P6,4、41[6,3]，singleS67推41到SPIKE6,2邻relay；最后6步AAAASS，末singleS73到P2,1预期西观察首次完成。各边界分别actual，不重发提前completion后的剩余D。CJS `.tail39Trace`给逐全48实体预测，`.tail39Checks`只记真实帧；无新搜索。

## 实际73完成

owner全部实际38/42/45/46/50/54/58/62/66/67/71/72短停点完整48实体字典与terrain严格diff=[]，包括光flags。S46把42送Goal北邻7,2后43.traversed实际由false变true；S67把41送relay北邻SPIKE6,2，p6,3仍不足西观察，两个testCompleted仍false。这支持分离光传播与测试遍历的具体解释，但不是全游戏控制流证明。

末singleS73 receipt49已接受一次并返回completedtrue；完整main51/frame3914170/time73 **completed=true**。P47[2,1]活/F0/key0/g0/free；43[6,1]与44[7,1]均traversed/testCompleted=true、lighten=false，41/42分别6,2/7,2邻封北支。Shadow46 inactive，Shadow45仍active在5,5，本构型可以通关，不声称全部Shadow清除。终P47唯一动画差异`anim_completed=false`保留，其余完整字段和terrain与模型相等；无补造稳定帧。

准确73：`SWWWWWWDDDSAWAASDDWDSAAASSSSASDDDDAAAWWDDDDWDSAWAAASAAWWDSASDDDDWDSAAAASS`。0搜索/0Undo/0retry/无handle，原42尾与末3D未执行；root负责正常Save核，helper不读存档。29/33/34原光flag预测反例始终保留在报告与CJS，不能回写成旧model原始全match。继续下一关。

据root报告，正常Save核于2026-10-06T12:35:26.799166Z完成：slot1、cleaningState3、准确73记录严格相等、accomplish124、6星/link3；存档SHA256为`2fae9592a3cbb4d1559581ed89ad57f7eda48276b7dbf5aad2ca1b752f7c20db`。公开全库审计[20261006T123837190646Z.json](../artifacts/knowledge-audits/20261006T123837190646Z.json)报告recorded124/save124/issues=[]。这是root的核验回报，helper未独立读取Save。
