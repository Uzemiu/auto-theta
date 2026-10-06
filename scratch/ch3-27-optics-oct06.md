# 3-27 色散：可回收三次复活与五叶目标候选

2026-10-06。helper只读公开观测及机制知识；未操作游戏、未使用提示/外部攻略、未读隐藏实现/反射、未改存档或主记录。owner已实际核首次单列复活31，后续是候选；尚未证明关卡完成。没有后台进程。

实际 initial/frame5552015 是 **五个** Goal：(1,9)/(3,9)/(5,9)/(7,9)/(9,9)。两 Prism 为50[6,9]/51[4,9]，唯一 Fork 在[7,6]。之前复活只留下两活人线及一活人线，普通推力分线各损失一推者，不能当作两个双活人线。

## 当前优先：可回收 row9 Relay8（首次已经实测）

owner提出以8,9替代上排6,10。直接把初始6→7→8会在7Goal经旧左Prism4照掉4列，所以先fresh **`DDWAAWWW` 后单X**同时外推4→3、6→7：两源/relay都是奇数列，全部六DARK保留；随后D把右7→8也不清4/5/6。模型首次 setup21 **`DAASAAAAWDDASSADDSWWW`** 到time30：Ghost52[4,2]/S、free59[3,9]/W、Prism50[8,9]/51[4,9]、六DARKactive。末单D31将左Prism到5,9，52到5,2安全復活，光只清5列。

**实际闭环**：owner已将完整31 **`DDWAAWWWXDAASAAAAWDDASSADDSWWWD`** 实际执行并保存3-27.json event60/frame607320。axis0/time31两活52[5,2]/D/ghost0/F0及59[4,9]/D/F0；axis1对应52inactive/ghost1/maskedoff1，59仍活，两叶Prism50[8,9]/51[5,9]、4/6四DARKactive、5列inactive。helper独立读该记录，脚本 `actual31SelectedFields.equal=true`；校验选定玩家/Prism/DARK/KEY字段，未冒称所有静态字段/GMID都校准。0Undo/0retry是owner报告并写主记录的实际范围，不是私有模型统计。

## 逐段阳性，必须先核实际生叶再接下一段

以下源31已经实际核；50/62/84/85尚为MODEL。id只锚定本关公共实体，实际新axis/GMID按现场核，不猜分叶编号。

|阶段|源及setup|末步前态|单步预测|
|---|---|---|---|
|第二复活6列|实际31生叶接18 setup `SSWWSDDWAASDDDDDWA`|49：Ghost52[6,3]/W，free59[8,9]/A；Pri50[7,9]/51[3,9]，4/6四DARKactive|单A50：52[6,2]/S安全生死观测，59[7,9]/A；Pri50[6,9]/51[3,9]，只余4列DARK|
|第三复活4列|只在实际50生叶匹配后接11 setup `ASAASWWSDDW`|61：Ghost52[4,3]/W，free59[6,9]/W；Pri50[5,9]/51[3,9]，仅4列DARKactive|单A62：52[4,2]/S安全生死观测，59[5,9]/A；Pri50[4,9]/51[3,9]，DARK全inactive|
|最后两活分成两单活叶|只在实际62生叶匹配后接22 setup `SAAAWDDDDDSDSSSWDAWDWW`|84：52[8,8]/W、59[9,9]/W，两活F0；Pri50[9,10]、51[8,9]，DARK0|单W85借旧实际force：W胜叶52[8,9]、51[8,10]；A胜叶59[8,9]、51[7,9]，各仅一活，另一推者maskedoff；50[9,10]固定|

第二次前先将左源5→4→3，是保留第三次可用前置的关键：右Relay8→7→6照6列后，Prism3/6分离；第三可把6→5→4以源3折照4列。若第二只固定源5，会留下5/6相邻，不能把相邻链末A的错奇偶构型冒称第三复活阳性。

实际31的**下一单S**预测：52[5,2]→5,1/S、59[4,9]→4,8/S，两活F0，Pri5/8不动，四DARK保留。第二/第三每步完整比较数据已在脚本 stdout JSON 的 `secondRecoverable6.trace`（18行）、`thirdRecoverable4.trace`（11行）；force setup每步在 `finalForcePrefix.trace`（22行），无需另造结果JSON。

force目标必须有**另一棱镜9,10**：否则9,9角色W会踩9,10SPIKE死亡。此84的Players+Prisms id/pos/face/Ghost/Fork与旧已观测3-27 event9/frame5614342/time28完全相同（`observedFixture.playersAndPrismFieldsEqual=true`）；只有time、DARK及分叶历史等另论。旧event11的真实W/A分叶支持末单W，但新85的axis/GMID/masked字段仍必须实际观察，不能以借fixture当已实际。

## 五叶各自短尾（逐动作地图模型已核，尚待实际完成）

|按生成签名定位叶|尾|直接Goal、模型最终状态|
|---|---|---|
|31死亡叶：仅59[4,9]、Pri51[5,9]/50[8,9]|`D`|Goal5,9/time32；左Pri51→6,9|
|50死亡叶：仅59[7,9]、Pri51[3,9]/50[6,9]|`AAAA`|Goal3,9/time54；Pri51[1,9]/50[2,9]，4列Dark被光清但本叶无活动Ghost|
|62死亡叶：仅59[5,9]、Pri51[3,9]/50[4,9]|`DD`|Goal7,9/time64；两Pri不动|
|85 W胜叶：仅52[8,9]、Pri51[8,10]/50[9,10]|`AAAAAAA`|Goal1,9/time92；整段row9真实Floor，不需绕行，Pri都在row10|
|85 A胜叶：仅59[8,9]、Pri51[7,9]/50[9,10]|`D`|Goal9,9/time86；Pri不动|

上述15个尾输入全部逐步读取实际initial的Wall/SPIKE并模拟实际物体位置，未裸踩SPIKE、未merge/capture/新增资源。`fiveLeafSafeTails` 包含每条route/trace/goal/final。M027允许不同叶直接目标集合相并，但还需实际保持五叶与各Goal活人；若最后填较早time叶，按M067实例切回time92的Goal1叶再核全局判定。不能在五Goal都已实际覆盖前记 completed，也不能只靠私有叶数组当新成就证据。

四个新的有界阶段累计 **17398 expanded**：首次11526/12470seen、第二2273/2674seen、第三405/533seen、force3194/4350seen；总限30000，命中即停，未保存队列，全部exit0。未知capture/merge/叠体/不同推力接触分别505/77/5/117次截断；最后force特例仅借本关已实测event9→11。force使用有界加权A*，候选短但不声明最短。旧808状态上排探针是先前历史计算，未提供本路线资源。

## 下方保留：先前有限光路与上排诊断

以下上排6,10方案已被可回收Relay8阳性替代，不建议owner执行。其固定两actor光路结论只用于同一叶，不能否定现在三次复活+最后force形成五叶、每叶直接覆盖一个Goal的方向。

## 有限光路排除

[脚本](ch3-27-optics-oct06.cjs)只列举 row9/row10 的18个位置：5种 Goal 上的源 Prism ×17种第二 Prism，共 **85个**源构型。基于 M053/M068/M069 已观测的光路约束，若源 Goal 上没有直接活人，北路先经过 SPIKE row10；80个构型没有北路 relay 或安全观察者。余5个北邻 relay 即使额外宽容地允许 relay 内有受保护活人，源的南路与至少一条水平路仍需另外两名观察者，即至少3人；只有两名角色时仍不够。cargo 在源 Goal 上的直接坐标覆盖另计，不被此排除。

这是固定几何、同一叶的条件排除，不是全关无解证明；未证明任意载人/叠体/纠缠的光学递归，也没有假定各叶的半条光路能相并完成同一个源。它说明不能再把旧单活人+Prism1,9/traversedtrue/testCompletedfalse 当成额外目标信用；单纯移动旧 Prism 到另外一个 Goal 也没有解决北路。

空 Goal 不是已证光源。直接对照3-22.json event7/frame4509049/time17：Goal4,11空，Prism4,10，DARK4,4..7全active；event9/frame4509998/time18把Prism推到Goal4,11后才全清并复活。因此“两个棱镜放4,10/5,10可从空Goal5,9启动回折”的想法已撤回。

## 新的可判别候选：只照5列而保留4/6列

旧横推模型没有允许先把一个 Prism 送到 row10。先把右 Prism50 从6,9上推6,10，再用左 Prism51 开源5,9，右 Prism不再作为 row9 的6列 relay。最后输入D恰把 Ghost4,2送到安全5,2。它绕过了“首次复活必同时消耗两列”的过强直觉；**未建立后续全解**。

准确已观测源是 **3-27.json event3/frame5562760/axis[0,0,0]/time14/instructions `DDWAASSAXWWAWW`**：Ghost52[4,2]/faceS/F0、free59[3,9]/faceW/F0，Prism50[6,9]/51[4,9]；全部六个DARK active，Fork已取。

从该源的新有限模型搜索上限4000 expanded：808 expanded/948 seen/140 pending 时找到 setup **`SDDDWWSASWAW`**；5次未知接触被截断，没有继续建模装载/叠体/融合。这个新域允许只把50升至6,10、保持51在4,9与全部DARK，不是重复旧水平图的13845/223352预算。

**下一单S预测**：free59到3,8/faceS；Ghost52因南方不在DARK转D到5,2/faceD，仍active/ghost1/F0；两Prism不动，六DARK全部active。执行setup后应在time26核：Ghost52[4,2]/S、free59[3,9]/W、Prism50[6,10]/51[4,9]，所有motion0/无busy，DARK六个全active。**然后只测最后单D**：Prism51[5,9]、free59[4,9]/D、Ghost52[5,2]/D；预计产生生死两叶，生叶52ghost0/active，死叶52ghost1/inactive/maskedoff，59均活；只DARK5,2/5,3 inactive，4/6两列仍active。Prism的traversed/testCompleted不预填，必须读实际。

若正常重新入关，从fresh可更短地准备同一构型并测复活：**`DDWAWWWDSSSSSAAAXWWAWWD`**，23输入。前22应核Ghost4,2/free3,9/Pri6,10及4,9/六DARK；第23D才是判别输入。fresh下一D预测初始52到6,5/faceD/F0，KEY及所有DARK仍active。实际新入关id/GMID以现场为准；上述编号只锚定已观测源。

建议仅在输入owner正常回访3-27且决定检验这个光学边界时做；不要为这项机制探针打断正在推进的3-26，也不要盲批量越过22/26前态或最后D。若只关心是否能提供完整尾，这还不是可执行通关串。

## 不能忽略的资源代价

Prism50送row10后，普通F0模型无法回收：下推要站row11真Wall，横推要有row10活free，而所有row10均SPIKE且没有DARK；F0 cargo仅改face，不能主动搬容器。另一个底排 Prism 单独占奇数Goal只能直照对应奇数列，不能再照剩余4/6列。故这个旧上排探针不会自动给出三次复活或第五个观察者，不能把保留两列等同保留可用复活资源。当前优先本报告前部的新可回收Relay8路线；不扩大已封普通横推图冒充答案。

脚本既有校准：旧实际time9/event1、14/event3、15/event5的生叶、28/event9的生叶，其玩家id/pos/face/ghost/Fork、两Prism id/pos、DARK active集合及KEY状态均一致。校准范围不含GMID、动画、光学完成标志、死叶完整字典或未知接触；不会把它说成完整实体校验。脚本运行exit0，纯私有有限计算，无游戏API及文件输出。

## 实际完成补证：99输入（2026-10-06）

唯一owner已将31→50→62三个复活、84前置及单W85五叶逐段真实核对后完成。helper独立读取[主记录3-27](../artifacts/slot1-playthrough/3-27.json)的 **completion/event151/frame815971**：`completed=true`、undo_depth99、当前axis0/time92；五叶活人分别axis0 P52[1,9]/time92、axis4 P59[3,9]/time32、axis3 P59[7,9]/time50、axis2 P59[5,9]/time62、axis1 P59[9,9]/time86，五个Goal全部实际覆盖。owner报告本次0Undo/0retry；root另已严格核SaveSlot1 record119，进度由root/owner维护。

实际完整99串：`DDWAAWWWXDAASAAAAWDDASSADDSWWWDSSWWSDDWAASDDDDDWAAASAASWWSDDWASAAAWDDDDDSDSSSWDAWDWWWAAAAAAATDTTTAT`。

实际用了更短收尾：W叶7A到Goal1，T后A叶D到Goal9，再T保死亡62叶原在Goal5，再T保死亡50叶原在Goal7，再T到死亡31叶单A到Goal3，最后T回time92触发真实完成。没有执行旧6,10上抬诊断，也没有执行本报告原五叶分工的105输入收尾；31/50/62已天然占5/7两Goal，故省略AAAA/DD并改死亡31取3。原候选及差别保留为研究历史。

这项实证支持本关可回收Relay8、保四DARK、逐次重新进入未清列形成三个旁观死亡叶、末已知force再分两单活叶并跨叶完成五目标的具体构型；不推广任意叠体/容器光学、多层复制或所有关卡。helper从头到尾未发送游戏输入，模型结果没有代替实际journal。

root最终存档核验：SaveSlot1 `dispersionState=3`、本关准确 `record=99`、完成总数119；前述“record119”应读为总数119。root已写M134和正式[3-27解法](../knowledge/solutions/3-27.md)，真实准确串及进度以正式解法和主记录为准；模型长尾只保留为候选历史。owner实际99含5次T，实际game completion不是模型推断。
