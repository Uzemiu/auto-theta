# 5-11 释放：先校准冰面接触棱镜

只读私模[ch5-11-release-oct07.cjs](ch5-11-release-oct07.cjs)，公开源[5-11.json](../artifacts/slot1-playthrough/5-11.json)。sole input owner仍slot1_owner_oct06；禁提示/启示/简化/攻略/隐藏实现/反射/存档编辑、不写主KB/extraJSON。累计1174expanded（182固定闭图+992新动态首hit即停），无handle；默认仅audit，两个搜索入口均禁止重跑。封存5-10所有旧域，不另首X遮罩图。

fresh0 main0/frame6225879，release/释放，size[9,8]，59entities/88tiles。P58[3,3]/S/F0；Fork53[4,2]；Goal51[1,7]/Goal52[1,1]；Pri54[1,1]/55[4,1]；双Shadow56[7,3]/57[7,4]。ICE唯一5,1。真正裸SPIKE为4,6；4,8和右上6..8/6..8同格Wall优先，不能误写可跨地刺。Floor取tiles加动态floor实体，两个Goal不遗漏。

实际DS2 main2/frame6248235：P58[4,2]/S/F1，Pri54/55 traversedtrue/testfalse，双Shadowactive。原freshflags的两个变化留`calibration2.fullDiff`，移动/拾叉物理字段相等。持叉资源保留，可选择有运输价值出生，不提前X。

从source2手工9 `WWWDDSSSS`：W3到4,5，经D2走唯一row5桥到6,5，再S4到6,1，preA11。全部safe、不碰ICE或Box/Pri，不产生SPIKE死亡、捕获/新资源。完整59预测在`setupTrace`，`setupChecks`只认公开actual。

singleA12才是ICE边界：从6,1入5,1ICE滑向Pri55[4,1]。M035只校准普通箱接触停止/惯性传递，尚无本关Prism细节。并列两个有限物理预测：普通Box接触停止类比为Pri3,1/player4,1；owner的较长Prism滑行设想为Pri2,1/player3,1。两者都保叉1与两Shadow、不裸死；精确微tick/time、光flags与Shadow去活只取实际，不硬写2,1为已证。若第一A只到3,1，后普通singleA可送2,1而玩家3,1，仍必须独立核。

上述firstA12已实际main10/frame6310540，12instructions/time13，Pri55[3,1]/P58[4,1]/A/F1，与M035接触停止候选完整59字典相等；较长候选两位置差异保留。再普通A13 main12/frame6326270，13instructions/time14：Pri55[2,1]/P58[3,1]/A/F1、Pri54/55 traversedtrue/testCompletedtrue、双Shadowactive，上Goal未完成。普通单A的物理/static全等，testfalse→true携带差异保`ordinary13Audit`；root独立6360120完整59dict/88tiles/exact13严格相等（据root回报）。

Pri最终2,1有具体目标价值：north2,2/south2,0真Wall、West连GoalPri1,1、East为3,1观察格，有望使底Goal光学只余East观察，是否testCompleted须actual。挪开原4,1也去掉了原north4列照影构型，给Shadow运输至4,5/4,6/上Goal通道留明确新前置；没有据此宣称任意Shadowcargo可释放或完成两个Goal。

`normalStep`明确拒ICE/cargo/birth/force/merge，不能把5-10无ICE模型当完整真规则。`iceAlternatives`保两候选，`iceActual`从真实firstA选取或反驳，默认仅audit，不搜索、不保存巨队列或新增JSON。

## 双残影横链安全捕获的资源前置

从实际13手工16 `DDWDWWDDWWADSSAW`：DD第二D为4,1→ICE5,1→6,1干净两microtick滑行，再WD到7,2；W先上推双箱至7,4/7,5，第二W因前端7,6Wall回A至6,3。DDWWA由8,5将上Shadow57左推6,5；DSSAW绕回7,3上推低Shadow56至7,5。最终29instructions/time31预态P58[7,4]/F1、前57[6,5]/后56[7,5]。角色全safe，未以影箱属性猜C4或cargo，也不因Prism2,1北有Wall就无条件预授所有消影顺序。

首4 DDWD的原生batch在第二D进ICE时只accepted2/DD、remainingWD，rawreceipt main13完整保留；owner overstrict脚本仍误期望7,2而退出，未gameRetry或重发DD。实际15 main14/frame6407991为P6,1/F1/time17，CJS完整物理预测与时间正确；下一只续remainingWD。`soloStep`仅建这种单人、5,1为空且出口普通安全Floor的ICE两步，其他ICE/多人碰撞仍拒模。

横链后普通S到30/P7,3/S/F1、singleX31的6,3/8,3均safe，分配只能actual。新的捕获条件为两free4,5与8,5：共同D，右人9,5Wall/8,6Wall后回A推动横链，使前57到5,5、后56到6,5；左人4,5直接D到5,5同tick碰前箱。该safe Shadow捕获为下一独立actual边界，不能预先当aliveC4或释放成功。

owner此前ICE首X错相候选DDWS+X与2A未执行，当前优先此箱staging。上Goal仅经4,6裸SPIKE通道；任何Shadow cargo存活、顶4,7箱去活释放以及两个Goal分支判定均未知。尤其当前Pri55在2,1、north2,2是Wall，恢复4列发光的完整资源还未构造；不把“北col4光解除”偷换成将来一定能释放。`staging16.trace`完整59字段，`stagingChecks`保存真实已接受前缀/旗标差异。

## 实际双人源与多人冰面

staging29已实际main32/frame6490786，29inputs/time31：P58[7,4]/W/F1、Shadow56[7,5]/57[6,5]active。随后S30/X31已实际main36/frame6503565，31inputs/time33：original58[8,3]/S/GMID56、新59[6,3]/S/GMID57，两F0/g0/free；59不与ShadowBox57的ID混淆。完整59/60字段和88tiles均保公开source；出生前光学testtrue携带至后续实际testfalse的差异保留，不称所有raw字段均相等。

actual31接WWAA至35/time37：58[6,5]/A、59[6,1]/S，56[5,5]/57[4,5]active。singleA36已实际frame6575191，36inputs/time39：58只第一微tick推双箱后停5,5，59从6,1经ICE5,1到4,1；56[4,5]/57[3,5]active。`dynamicChecks`物理/static/88tiles相等，34前完整字段相等；35/36底两Pri.testCompleted实际true、carry模型false，完整差异保留。新正反边界singleD37 main46/frame6629156，37inputs/time41：58[6,5]/D、59[6,1]/D，双影不动且active；59独享额外滑行微tick，另一人停6,5。`multiIceD37`物理/static/时间/地形均相等，旗标carry差异保留。M156由root记录，据root报告独立frame6641538核源37；本helper不读取存档。

## 已终端有限域与下一捕获单步

最初固定57[6,5]/56[7,5]、两Pri固定，从6,3/8,3资源集合（后实际31同几何）到free4,5+8,5：182expanded/182seen/pending0、closed/nohit，limit1500。只排无移箱/force/hold/捕获/死亡/合并且干净ICE的固定域；没有排整关、动态移箱或新出生。原singleD捕获fixture仍只是条件，没有执行。

新的actual37动态域允许双影只在row5 x2..7可回收横移，两Pri固定，两个F0free；禁止force/hold/捕获/死亡/合并，仅M034式干净ICE。limit2000，992expanded/1219seen/pending227，第一个目标命中即停、队列不保存，pending227是当时内存队列余量，终端已释放。命中13 `WWSAWWWDWWASW`，全段普通步、不再碰ICE；CJS用`row5Step`和`normalStep`双重重放实体/Time一致。完整60字段在`recordedRow5.trace`，执行核对在`row5Checks`。该13前置已实际到50inputs/time54 main60/frame6691208：58[2,4]/W、59[5,5]/A、Shadow57[3,5]/56[4,5]active。五停点全部物理/static/88tiles相等，底Pri.testCompleted carrytrue→actualfalse的光flags差异保留，不冒称全raw字段严格无差。

末singleW51/time55已实际main63/frame6695893：58直接2,4→2,5；59因5,6Wall回A推双链，使57由3,5到2,5与58同tick，56到3,5，59安全落4,5/A。Shadow57仍active/Color1，58 active/ghost0/contained1/container57/F0/key0；没有分叶或完成。root独立frame6716955全60实体完整字典/88tiles/exact51/time55严格相等（据root回报）。`actualCapture51`保原始字段，这只证安全Shadow活捕获，不能预授地刺保护、C4属性或release。

装载后的手工MODEL28 `SAAWWDDSDWDDSDDWAAASSSSSAWWW` 由actual51重放，完整60字段在`postCapture.trace`；只先部署7 SAAWWDD将cargo57送4,5、empty56送5,5、free59至3,5，再SD至4,4，singleW61独测Shadow cargo在4,6裸SPIKE保护。若此前影消失则立即按实际止，不批后尾。条件后尾把buffer从7,5回推4,5；outside经干净ICE回左区、到4,4，再singleW80/time85把cargo推4,7、buffer推4,6，outside59落4,5保护。这个顶通道运送几何不以“必须双人全活free”妨碍正常装载，也不预授影箱属性；containedface按已实证输入方向更新，运动随实际容器。

4,7角落箱不能普通左推至Goal1,7：north4,8/east5,7都是Wall，向左推侧5,7不可达。上Goal1,7横row7通4,7是否令影箱消失/角色释放仍是单步未知，不因当前无col4Pri而断言阴性，也不借5-5空影到Goal直接消失推广载人远距照影。Pri55@2,1普通无法回4,1的推侧限制保留，当前路径提供机制观测，不承诺全解。捕获前ICE错误较长预测、旧182nohit和未执行DDWS+X全部保留。

实际Shadow入裸SPIKE61已阳性main74/frame6756927，61inputs/time65：58[4,6]active/ghost0/contained57，Shadow57仍active，free59[4,5]/W活，buffer56[5,5]active。前7、SD及单W共四停点全部60完整字典/88tiles与`postCapture.trace`严格相等。此具体Shadow装载防刺实测不泛化任意颜色或出生时序，亦未释放。owner下一9 DDSDDWAAA只回收buffer至4,5，再9 SSSSSAWWW回到4,4，ICE76单独核，最后W80未知需actual。

仅在W80真实给Shadow57inactive、58 alive/ghost0/free4,7、59free4,5且buffer56 active4,6时，可采用候选11 ASASASDSAAA：58在行7的3/4格墙回转，最后1,7；59从4,5经左安全区到3,1观察底Pri。`releaseConditionalTail`完整60字段只是手工条件重放，无搜索、没有伪造释放；不能S从4,7先推buffer离刺，以免裸踩4,6死亡。若80仍cargo、死或有其它属性，则该尾不适用。

owner后给更短8 ASDSASDS，私模独立0search重放同样安全：58交替3/4,7，每次S前在3,7，59经3,5/3,4/4,4/4,3/3,3/3,2/4,2到4,1，88/time93时底部东观察、上方4,7。该8优先但完整completion仍unknown；若88已completed立即停，若仍false且几何/属性一致，可备用AAA使58真正到Goal1,7、59在3/4,1往返，91/time96。`ownerConditionalTail8`保全60字段，旧11未执行候选不删除，两者都依赖80实际release。

## 实际80释放阴性：条件尾全部撤回

61后9 DDSDDWAAA、9 SSSSSAWWW及singleW80已实际执行。actual79 main97/frame6872656，time84；未知W80 main100/frame6899719，80inputs/time85：Shadow57[4,7]仍active/Shadowtrue，cargo58同4,7仍active/ghost0/contained1/container57，buffer56[4,6]active、free59[4,5]/W活，两Pri1,1/2,1的testCompletedfalse，completedfalse。`actual80`与不含释放的纯运输预测完整60dict/88tiles/Time相等。cargo自身位于4,7不等于free，输入只改变containedface不能拿来执行自由移动尾。

root独立frame6902193对main100全部60完整字典/88tiles/exact80/time85严格相等（据root回报），M159保存该构型阴性；此处上Goal1,7横row7没有自动消影，不能授予无Pri的Goal远光源。条件8 ASDSASDS、旧11 ASASASDSAAA和备用AAA均**未执行并撤回对80的部署**，CJS保历史条件重放并标WITHDRAWN。释放阴性不否定所有Shadow释放，原安全捕获51/地刺保护61仍为实际阳性。

后段76的soloICE仍仅玩家59滑两拍、cargo58等在4,6；75/76时底Pri testfalse携带→实际true差异保在`postCaptureChecks`，79/80回false。其余后段完整物理/static/地形与预测相等，不能称所有carry光学字段全等。owner已正常离5-11继续5-12；root7010080已Chapter5，80是历史fixture。正常Save releaseState1/count125仅据root报告，本helper没有读存档。累计1174扩展、无追加域/handle，不要求owner驻场。

恢复光轴的新局部构型也有边界：两free3,1与6,1分别偶/奇，固定55@4,1且普通双生角色同parity时，不可用无动对象普通导航授予这对站位；唯一ICE5,1左入口4,1被55占，右滑会先推动55。若已有2,1 free、55@3,1，则2,1的W/A/S均被墙或固定54拒绝，D会推55→4,1，所以任一普通指令会自动回D，不是能长期留2,1等另一人完成运输的静止资源。尚无完整可部署恢复时序，不作全关无解。未来可用正常freshDS2、AS至3,1/F1、singleD核55从4,1入ICE是否停6,1（或7,1不可回收），北col6光对运影仍未知；这仅短probe，不是既有cargo80的续输入。
