# 5-12 跃迁：保箱的短资源前置

只读私模[ch5-12-transition-oct07.cjs](ch5-12-transition-oct07.cjs)，唯一输入owner slot1_owner_oct06。禁止游戏输入/提示/启示/简化/攻略/隐藏实现/反射/存档编辑，零extraJSON/队列文件。累计2162expanded（2000截断+1固定死端+12/149两个新微域首hit即停），无handle，默认仅audit，搜索入口已禁重跑。全部pending是终端时内存余量，队列已释放。

公开[5-12.json](../artifacts/slot1-playthrough/5-12.json)：fresh0 main0/frame7040431，transition/跃迁，51entities/97tiles/size10,8；P50[2,3]/S/F0，Fork45[2,2]，普通C4 Box43[2,1]/44[6,4]，Color1 Shadow49[7,4]；Pri46[3,1]/47[2,7]/48[9,1]，Goal1,7/9,1。Floor合并GOAL.floor两个格，SPIKE与Wall覆盖优先，无ICE/DARK。真正裸SPIKE为4..7,5及6/7,6/7，6,8/9,8有Wall覆盖。左上区1..5,y6/7与下区、右上8/9区由刺隔断，裸角色不能按普通Floor横穿。

actualS1 main2/frame7046276，P50[2,2]/S/F1，物体原位；Pri46/48 traversedtrue/testfalse、47false。`calibrationS1`校准正常拾叉/几何/完整51字段，光学carry差异单列，不凭testtrue作持久记录。actualX2 main9/frame7145464：原50[3,2]/S/GMID48，新51[1,2]/S/GMID49，两F0/g0/free、52entities，三Box原位；实际46/48 testCompletedtrue而47false、整体false。IDs只从actual分配，不能把Birth前F1或solo35接在双free源。

新的潜在safe双链捕获fixture：43固定2,1（其南2,0真Wall），rear普通44[3,2]、frontShadow49[4,2]，free2,2和5,3均even。共享S，2,2人南推43被墙拒后回D推双链，44→4,2、49→5,2；另一人5,3直接S到5,2，与Shadow同刻，outside落3,2safe。Shadow装载属性与活性只actual，不预授5-11规则到本新光路。44在3,2还能临时邻封Pri46北向，避免影穿3,2/3,3提前受光，完整前置未找到。

唯一新有限域从actualSX2搜索上述fixture，upper44/49可移动，43/三Pri固定；拒force/hold/capture/death/merge，拒把两Upper箱永久送row1/9列或裸SPIKE，未校准的Shadow col3光照也拒。2000expanded/2575seen/pending575、limit2000截断nohit，非封闭/非全关无解；内存已释放，没有队列文件或自动重跑。未知资源/Force/牺牲、普通mask布置及动态光学没有由该域排除。

仍有具体手工可部署前置：actual2接4 WDDW，50由3,2→3,3→4,3→5,3→5,4；51由1,2→1,3→2,3→3,3，末W遇3,4Wall回A到2,3。三箱/三Pri全原位，两人safe。再singleD7，50右推44/49链到7,4/8,4并落6,4，51到3,3；52完整字段预测在`ordinarySetup4.trace`，`setupChecks`只取公开actual。该步仍保两箱可回收，绝不连续第二D把Shadow送9列；影活性/光学变化独立核，不把资源移动宣称通关。

上述WDDW+singleD7已实际：main11/frame7249548到6两Box原位、50 5,4/51 2,3，下Pri testfalse与carrytrue差异保留；main13/frame7251480到7，44[7,4]/Shadow49[8,4]active、50[6,4]/51[3,3]/D，下46/48testtrue，47false。7完整52字典/97tiles与预测相等，0Undo/retry；不是cargo或Goal完成。

由actual7，新的手工7 SDDDWWA可到14：50经6,3/7,3/8,3/9,3/9,4/9,5到8,5，51经3,2/4,2/5,2/6,2/6,3/6,4到5,4，三Box不动、无刺。末singleS15将Shadow49从8,4下送8,3，50停8,4，51到5,3；后DS+singleA18可由9,3推者左送49至7,3。`resourceTransport.trace`完整52字段、`resourceChecks`保公开校准；这些短移动都保持Box可回收，不是底35solo尾或2000旧域重跑。15/18影活性均需独立actual，尚未授予safe capture5,2或完整Goal解。

上述15/18已owner实际核：15 main19/frame7276608，Shadow8,3active、50 8,4/51 5,3；18 main23/frame7293665，Shadow7,3active、普通44 7,4，50 8,3/51 5,2。三Box仍保留、无cargo/Goal，原carry光flags差异保`resourceChecks`；root只独立17源全52dict/97tiles，不能把17证据挪作15/18独立核。

## 新下方恢复与完整safe捕获MODEL65

从actual18手工7 WWDDASS到25：先两W、两D让51把普通44右送8,4，50从9,6 AS到8,5，末S25把44下送8,3、50到8,4/51到6,2；Shadow49一直7,3不动。再8 DSAAAWAS到33：双箱横链左推仅3A，停Shadow4,3/普通5,3，WAS把普通44下送5,2，50 5,3/51 4,2。绝不第4A让Shadow无shield进入col3；也不把普通44降row1不可回收。

MODEL33固定Normal5,2/Shadow4,3目标free6,2的小域只有1expanded/1seen/pending0/nohit：所有可执行普通动作都需移动Box或进入未校准影光构型，因此不执意静态导航。手工DASDW将44先东送7,2，MODEL38的52物理状态为50 6,3/51 5,2。新的固定Normal7,2/Shadow4,3导航8,2域limit500，12expanded/15seen/pending3命中WDDDS即停；再AAAA把44回送3,2，MODEL47为50 5,3/51 4,2、普通44 3,2/Shadow49 4,3。33→47准确14串DASDWWDDDSAAAA，全部手工/微域物理候选，未把MODEL源说成actual。

MODEL47的第三新微域只固定44 3,2作为Pri46北邻盾，Shadow仅允许4,3→4,2一次南推；目标free2,2+5,3。limit500，149expanded/166seen/pending17首hit即停，命中18 SDDDDAAASSWWWASAWS。前14到61让50在4,4、51在6,4，singleS62将Shadow4,3下送4,2，50 4,3/51 6,3；随后AWS到65使50 2,2/51 5,3，两者S。源/范围与旧2000域不同，后两微域的原始函数没有保留可重跑入口，只有`recordedMicro`与短串重放，不保存前沿。

从actual18到MODEL65准确47串WWDDASSDSAAAWASDASDWWDDDSAAAASDDDDAAASSWWWASAWS，完整52字段在`lowerRecovery.trace`，对应实际校准在`lowerChecks`。singleS66才是未知capture：2,2人因43@2,1背2,0Wall不能S，回D推44/49双链；49→5,2与51从5,3下移同刻，44→4,2，outside50→3,2。此probe保三物理Box和一外人，不裸刺/Force/merge；Shadow活性、contained/ghost只认actual。完整Goal、跨刺、释放及root提出的外人死后迟Box接触尸体均未知，不因尸体规则候选授予复活，不把局部capture等同全解。

上述捕获前置已实际完成：33 frame7361027、62 canonical69/frame7394254、65 canonical72/frame7396903；singleS66 canonical75/frame7399099/time66，cargo是**新51**[5,2]active/ghost0/contained1/container49/F0，Shadow49同5,2active，outside原50[3,2]/D活free，普通44[4,2]、43[2,1]、三Pri原位。cargo.face仍S，outside回D，两个字段不混用。所有物理/static/97tiles与`lowerRecovery`一致，光flags携带差异保留；source66下46/48.testtrue，上47false、全completedfalse。`actualCapture66`保原字段，不能当C4 corpse复活或完整通关。

## 装载后新光学时序：先建普通箱下盾

actual66的手工17 AWDDDDSSAWDWASSAW：free50绕左row3和rightcol6到5,1，W把Shadow cargo5,2上推5,3；再经6,3 A左送cargo4,3，free绕5,1/4,1 W推动普通44[4,2]和cargo49[4,3]双链上移，83应得普通44[4,3]、Shadowcargo49/51[4,4]、outside50[4,2]，三Pri与43不动。此段避所有SPIKE、无Force/死亡/合并，完整52物理预测在`cargo17.trace`，每次cargo.face按输入更新而非外人fallback，实际核对在`cargoChecks`。

83后AAAS到free1,1，**singleD88**混合推链将43→3,1、Pri46→4,1，ordinary44@4,3在Shadow4,4下方保光盾是新的实际待核边界；不能以理论永远active授予安全。邻west43@3,1对Pri46光学补全仍待actual，光flag不当静态推力布尔值。若影保持且角色完整，WDD回4,2，再三个singleW92/93/94依次cargo4,5SPIKE、4,6Floor、4,7Floor；前两外50停4,3/4,4safe，末94外50裸死4,5、普通44停4,6、cargo51在4,7。是否Pri47[2,7]或其它实际光路让Shadow去活释放是未知；5-11无Pri空Goal横线阴性保留，不能借关名或这里的上方Prism位置宣布自动release，93后先读完整实际再决定94。

root提出的后续lateColor4 corpse probe只在94真释放51 alive/g0/free4,7而50deadGhost4,5时适用：singleS95把普通44从4,6推回4,5与尸体同格，51停安全4,6。迟C4捕获inactive尸体、Ghost活性/contained、Pri4照光生死分叶全部未知，M064旧空箱迟到阴性不直接否定本Color4构型，也不授予它阳性。仅若actual后50 alive cargo44 at4,5覆盖底光、51仍free4,6，AAAW可经3/2/1,6到Goal1,7；轴/Time/完成必须实际核。此为历史条件研究，实际94阴性使guard失效，`lateCorpse95`已撤回部署；95/AAAW均未执行，累计2162节点不追加。

当前已有真实边界：actual83 canonical92/frame7466783影cargo4,4/普通44 4,3、outside4,2；actualD88 canonical97/frame7485831确实底混合链变43 3,1/46 4,1，普通44北盾保住Shadow49 4,4active、51g0/contained49。底两个Pri testfalse，与carrytrue差异保留。WDD回91后底test又true；singleW92/93均实际，actual93 canonical103/frame7506014：影cargo51 4,6active/g0/contained49、普通44 4,5、outside50 4,4free活，底46/48 testtrue，上47false，全completedfalse。93完整52字典/97tiles/Time与purephysics预测严格相等；前面83/88只有物理/static相等，carry光flags差异不抹。

另只读复核M064旧3-19原始event15/frame4111441，迟到空Box68 Color=3/Shadowfalse，P70同5,5 inactive/g1/uncontained；本候选95普通Box44 Color4且已摆Pri4北光，是具体不同边界，但必须94实际free释放才可测试，不能从颜色差异断言会活捕/复活。当前没有部署95或AAAW，不靠未证Box自身复活机制作完整Goal承诺。

**实际W94释放阴性**：canonical105/frame7516957，94inputs/time94。Shadow49仍active[4,7]，51同格active/ghost0/contained1/container49/F0/W；普通44[4,6]active，外50[4,5]/W inactive/ghost1/mask0/free/container-1，稳定帧animtrue。Pri46[4,1]/48[9,1]traversedtrue但testfalse，47[2,7]traversedfalse/testfalse，整体completedfalse。`actual94`导出真实原字段，`cargoChecks`物理/static52/97tiles/Time完全相等；仅46/48.testCompleted由carrytrue变actualfalse两处光学差异保留。光盾保护与裸刺死亡已实际，释放没有发生，不能以面向变化当自由角色移动，不能自动认定Pri47或Goal1,7是发光源。

owner随后正常Undo1到93，canonical107/frame7536970；与原93/frame7506014全部52完整实体dict、97tiles、time93、instructions严格相同，timelineID均52。两角色活着，51仍cargo、50free；`undo94Recovery`保存该公开恢复校准，94阴性历史没有删除。接着正常离场到world（canonical110/frame7553806）；该93是历史保存点，当前runtime已进入5-13，未来回访须正常重建。0retry、仅此真实Undo1；条件S95及AAAW从未发送，无新增搜索/后台handle。

早前owner将44送8,1/35solo底mask构型均未执行，本报告不部署：43在底row1无法普通上提，44用于底mask会损上方buffer，Shadow9,6向左推侧10,6为Wall。两箱角色运输、释放和完整双Goal仍未知；若当前无短新positive可正常推进5-13，回访须重新校准fresh资源，不要求owner驻场等模型。
