# 5-13 栈：只读下降残影探针

[私模](ch5-13-stack-oct07.cjs)只读公开[5-13.json](../artifacts/slot1-playthrough/5-13.json)，唯一输入owner slot1_owner_oct06；不输入游戏、不使用提示/启示/简化/攻略、隐藏实现/反射、存档编辑，不另写JSON。资源前置全手工0搜索，后续两有限导航域合计4007已终端、无后台handle/队列；默认仅audit，搜索入口均禁重跑。完整58/59/61字典预测按对应实际源导出供逐步校准。

fresh canonical0/frame7564940，stack/栈，size9,12、58entities/111tiles。54[3,2]/S/F0，Fork52[4,3]/51[6,11]；Shadow53[6,5]active/Color1，Goal45/Pri55[1,8]，relay56[1,2]/57[1,9]；Buttons46[7,1]/47[4,10]/48[3,10]，Gate49[0,8]ID0/Gate50[5,11]ID1均闭。Floor包含GOAL/Button实体，Wall覆盖SPIKE优先，无ICE/DARK。右侧7,3..12是Wall；7,2与8,1/2是真裸SPIKE，不能把右侧通路当safe。

actualDW2 canonical2/frame7576563：P54[4,3]/W/F1，Fork52inactive，Shadow原位active，55/57.traversedtrue/testfalse、56false，整体未完成。`calibration2`从fresh按普通拾Fork规则核58字段/111tiles/Time，物理/static相等；55/57.traversed由freshcarryfalse变实际true两差异保留，并非全部rawdict相等。光学字段仅携带，不建立自动光照结论。

owner的手工安全5 WWDWD核为：3W→4,4；4W→4,5；5D→5,5；6W→5,6；7D→6,6。箱/棱镜全不动，推者所有格都是SOLID无裸刺。之后三个**singleS**：8影6,4/人6,5；9影6,3/人6,4；10影6,2/人6,3。S10首次与relay56的东row2相交，是否照灭残影只认实际；不要提前用traversedfalse推断无射线或认定Shadow保持active。

仅若actual10影保活，可再singleS11到Shadow6,1/P6,2，再ASD：12A到5,2，13S到5,1，14D右推影到Button7,1/P6,1safe。不得从6,2继续S：6,1箱背6,0Wall阻，回D到7,2裸SPIKE会杀唯一角色。7,1影的S/W/A推侧分别要求7,2/7,0/8,1裸SPIKE，不能由普通活人站位回收；7,0是真裸SPIKE而非Wall。虽可从6,1再D把箱送8,1裸刺，箱更不可回收且离钮，不部署。末D14只有持续压钮的明确机制价值时才能部署；Button→Gate0,8关联、Shadow存活与光学全Goal完成均待actual，不把局部压钮当通关。

该短probe不涉及第二Fork、upper两Button的ID1关联/叠体/出生，不抢owner普通运输图。若S10影去活，应立即停并保阴性，可正常Undo恢复前态；Undo及下一方案必须取实际记录。5-12的94释放阴性、2162终端域和真实Undo1全部另存旧pair，本新域没有复跑。

## 实际S10阴性与新的upper资源前置

7/8/9实际canonical6/frame7600880、8/frame7603065、10/frame7605204全部58dict/111tiles/Time与预测严格相等。S10 canonical12/frame7607268：Shadow53[6,2]inactive，P54[6,3]/S/F1活，56.traversed仍false，其他字段相等。只否定本构型的影活性，并不从flag否定真实射线。旧S11/ASD条件guardfalse，均未执行/撤回部署。

正常Undo1恢复9 canonical14/frame7642614，`undo9`比较原9完整58dict、111tiles、Time、instructions与timelineID均58严格相等；阴性历史保留，0retry。新的0search 8 AWWAWWWW：A5,4，WW5,6，A4,6，四W4,7/8/9/10。所有格safe、箱/棱镜不动、叉F1保留，`upperNav.trace`导出完整58字段，`upperChecks`独立保光flag差异。该nav已actual17 canonical19/frame7669112：Button4,10单压足以开Gate50[5,11]，blockabletrue→false与carry仅此一处差异，其他58字段/111tiles相等；13停点全字典相等。

末singleX18来自parent4,10/W，左3,10是Button，右5,10Wall，front4,11是真Floor。预测出生两位置3,10与4,11，ID与分配只认actual；5,11门不属于出生目标，所以不同于5-7 X的闭门front阴性。3,10单独能否续开ID1门需该actual核，4,10单开已实际。若门真开，再D可让Buttonchild到4,10续压、frontchild进入Gate5,11；再D取Fork6,11并让另一人4,11。

取第二叉后曾提0search条件4 ASWA再X：恢复同parity并消耗叉，未执行。owner采用更短SAA保F1，后续按其真实资源改构，原候选保历史不部署。

## 第二叉与一拍hold已实际，F1影箱捕获新前置

actualX18 canonical21/frame7671676：**原54[3,10]F0、新58[4,11]F0**，均W；3,10独钮也足以开Gate50。D19 canonical23/frame7675674：54[4,10]/D续压，58[5,11]/D过门。D20 canonical25/frame7678012：54[4,11]/W/F0，58[6,11]/D/F1，Fork51inactive，Gate50闭；两个Fork皆拾取只代表已分配的字段，第二叉属于58，不能再按出生前父ID推断。

三个single **SAA** 21/22/23实际canonical27/frame7704161、29/frame7706133、31/frame7708384。S21旧闭Gate四墙使58在6,11 hold一拍但face更新S、F1保，54到4,10开门；A22为54[3,10]/58[5,11]；A23为54[3,9]/S/F0与58[4,11]/A/F1，Gate又闭、Shadow6,3活。两人由一拍等待成为异parity。`pairStep`只允许这个已实证6,11hold，不授其他任意hold；`secondForkChecks`三帧全部59完整dict/111tiles/Time严格相等。上两Button独立开ID1门已实际，不再写AND/OR未核；下Button7,1仍未知。

从真实23手工17 **SSSSSSSDDDWAWWSSD** 到preD40，完整59字段在`captureNav.trace`，无搜索/队列。

- S7到30：54[3,2]/58[4,4]。
- DDD到33：54[6,2]/58[6,5]，后一D因7,4Wall回W，影仍6,3。
- singleW34：影53→6,4，54[6,3]/58[6,6]，影活性独核。
- AWW到37：54[5,5]/58[4,7]，58最后W因5,8Wall回A。
- SSD到40：54[6,3]/D/F0，58[5,5]/D/F1，影53[6,4]。

末**singleD41**：54右方7,3Wall，回W推影6,4→6,5，自己6,4safe；58直D到6,5与影同tick。实际contained、ghost、Fork1保持与影活性只从owner源验证，不能因M098普通Color4持叉箱复制就自动授NativeShadow复制。此前93/94型空Goal释放阴性不被混用成本构型否定。

仅若41真的活F1影箱cargo，推荐W42将其上送6,6/outside6,5，再A43令cargo.faceA、outside5,5，末singleX44可让两容器到south6,5与north6,7，均safe且避outside。两Box Shadow/Color/IDs/cargo状态必须actual；不预先写新箱必Normal。这个朝向比直接faceW的5,6/6,7更有机械回收价值：如果south6,5副本能活着越row2，outside WD到6,6，S4降南箱至6,1，再ASD送Button7,1；若bottomGate0,8真的开，outside6,1可AAAWWWWWWWAA（12）避刺推Goal55到0,8。全尾仅条件几何，没有盲发/计入actual，没有新图。

上述17前置已owner实际通过27/30/33/34/38/40各停点（canonical33/36/39/42/45/48），`captureNavChecks`全部59完整dict/111tiles/Time严格相等，0新增Undo/retry。singleD41 canonical51/frame7793454：58在6,5 **active/ghost0/contained1/container53/split1**，53同6,5 active/Shadowtrue/Color1，outside54在6,4/W/F0活free。IDs与叉所属均取实际；NativeShadow活F1捕获本构型已证，复制仍未知。`actualCapture41.entities`导出原59字典，`copyApproach.trace`按这个真正源生成singleW42/A43的59字段，cargo.face按输入更新，单X44不造未知Box/PLAYER ID或Shadow后态。

## 实际两Shadow复制，改核照光释放

actualX44 canonical57/frame7805226，root独立7852646对61实体/111tiles/exact44/time44严格相等：**原53/cargo58到south6,5，新59/cargo60到north6,7，两Box都Shadowtrue/Color1**。58/60皆active/ghost0/contained1/F0，container分别53/59；outside54[5,5]activefree。新GMID52/53只取实际，不把复制教学推广成普通箱。原“南箱持续越row2压Button”条件已因两箱仍Shadow撤回，未知不是复制阳性而是光照后cargo是否释放。

新0search短WD到outside6,6（45W5,6/46D6,6），三singleS47/48/49把南53及58送6,4/6,3/6,2、outside依次6,5/6,4/6,3；北59/60仍6,7，cargo60.face每次仍随输入更新。`releaseApproach.trace`导出完整61字段，inactive53/58释放只从singleS49实际拿，carryactive/contained不能被当release预测。若49真58alive/free，5W可逐步让外54从6,3到6,8，北59到6,9进入Pri57东row9光轴，另free58随走到6,7；末W54是否释放60再次singleactual。54之后3free导航只条件，不授两未观察的释放，更不盲发Goal尾。

actualS49 canonical65/frame7873495：Shadow53[6,2]inactive，58同6,2 **active/ghost0/contained0/container-1/F0**真正释放；54[6,3]alivefree，north59/cargo60[6,7]活。`releaseApproachChecks`保carry差异（53.active与58.contained/container），不是预测早已释放；`actualRelease49.entities`原61字段供后续真实模型源。root报告7887464独立对61dict/111tiles/exact49/time49全部相等，本helper未替root声称独立游戏观察。46/47/48等此前其他关反例没有被拿来阻止本新已知ray阳性。

`northApproach.trace`从真正49生成5W：50/51/52角色54依次6,4/5/6、58依次6,3/4/5、cargo60/59仍6,7；singleW53影到6,8、54到6,7/58到6,6；singleW54影到6,9、54到6,8/58到6,7。最后row9光照释放仍unknown，完整61carry预测不造第三free。若该未知阳性，owner另准一次新≤5000固定地形导航到preA目标：一个free2,8、另一个free7,1；执行前必须新真实54，不沿用hyp源或0search声明。该新图尚未开始，当前无handle。

## 实际北侧释放与两次有限导航终端

actual52 canonical68/frame7922721与53 canonical70/frame7924508全部61dict/111tiles/time与carry严格相等。**singleW54 canonical72/frame7926388**北Shadow59[6,9]inactive，60同格active/ghost0/free/container-1/F0；54[6,8]、58[6,7]，三人均W/g0/F0/free、双Shadowinactive，双Gate闭、Prisms原位、completedfalse。`northApproachChecks`保54的59.active/60.contained-container两处实际释放差异，`actualRelease54.entities`原61字典；root报告7933342独立全部61/111/exact54/time54严格相等。该实际替代先前54未知，不抹历史条件。

从真54只跑一次新的三free固定域，目标是preA有一个free2,8、另一个free7,1。普通移动/Wall优先/GOAL.floor/clockwise fallback，所有Prisms固定、双Boxinactive；拒任何合法Prism推动/Force/死亡/merge/capture，只有已actual的6,11四墙hold；upper两Button OR由actual17/18得到；**未隔离的Player独占Gate5,11且无Button情形拒绝**。匿名位置key适用三个F0/无钥匙角色、faces不决定普通方向；A*采用两目标乐观单人走格距离的max作为lowerbound。3427expanded/3427seen/pending0，closed/hitnull、cuts3524、limit5000；全部队列在进程退出时释放，无后台handle/队列文件，`recordedNavigation54`留范围，搜索入口已throw禁重跑。没有检查owner备用三光学位置3,8/3,9/3,2，不能说全关或所有3free方案已排除。

新正常牺牲前置改变资源而不是重复该图：由54的6 S到60，54[6,2]/58[6,1]/60[6,3]全活；actual57 canonical74/frame7955917及60 canonical76/frame7957588完整61/111/time严格相等。**singleD61 canonical78/frame7959567**原54进7,2裸刺，inactive/ghost1/mask0/free/F0/D；58进Button7,1 active/g0/free/F0/D，60因7,3Wall回W到6,4活free。Gate49[0,8]blockablefalse、Gate50闭、双Shadowinactive、completedfalse。0,8是实际SOLID/Floor无Wall，目的不是地图外猜测；底Button单占足以开0,8已实际。root报告7973329对61完整dict/111tiles/exact61/time61严格相等，正常Undo仅先前S10那1次、retry0。

真61两名sameparityfree58/60的新域只用剩1573上限，同固定Prisms/Boxinactive，尸体54非blockable；拒第二死/merge/force/capture/Prism移动，沿用真实hold/upper OR/底Button开门，仍拒未隔离Player-only Gate占位。机械preA2,8+Button7,1目标：**580expanded/580seen/pending0、closed/hitnull/cuts460**，无保存队列/handle，`recordedNavigation61`与禁重跑入口保存。两个不同资源域总4007expanded，预算剩993未使用，不为凑额重跑closed图。末A同时令钮人离开与55入Gate的时序/completion没有实际probe，不能用“旧Gateopen”预授通关，也不能把普通闭域否定动态Prism、再生死/融合/其它出生、未查光学目标或新门时序。

没有完整可部署通关positive，已明确通知owner可正常推进5-14，61保历史；owner报告已正常菜单退出，当前5-13 runtime=false。未来回访须按正常游戏资源重建/实际Undo核验，新前置要改变上述范围，旧4007域不增预算、不再要求owner驻关等模型。本pair默认仅audit，node--check/gitdiff--check通过；只读helper未使用gameinput/提示/hidden/save修改。
