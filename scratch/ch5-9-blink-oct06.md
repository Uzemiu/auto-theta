# 5-9 眨眼：换行避光、残影压钮，实际60完成

只读私模[ch5-9-blink-oct06.cjs](ch5-9-blink-oct06.cjs)，公开源[5-9.json](../artifacts/slot1-playthrough/5-9.json)。不输入、不用提示/启示/简化/攻略/隐藏实现/反射/存档读写、不写主KB或extraJSON。起初手工回放，后仅新固定物体导航634扩展即阳性终止、无handle；sole input owner仍slot1_owner_oct06。

stablefresh1/frame5368250，blink、size[7,12]、57实体/103tiles，无ICE/DARK。P54[3,2]/S/F0，Fork52[4,2]，ShadowC1 Box53[6,3]，Button51[6,9]/Gate50[2,8]，Goal49/Pri55[1,8]与Pri56[1,5]。真实0,8为Floor，可让GoalPrism西移；7,8虽SPIKE但同格Wall优先。SPIKE5,4..7、6,8，其余按raw，不能字符图遗漏墙。

唯一Goal1,8的地板由动态实体49.floor=true提供，未另列tiles；私模最初只收103tiles曾错误拒绝末推入1,8，已按公开raw改为tiles加floor实体。0,8有SOLID Floor tile，这次只是私模地板集合遗漏，不是游戏边界发现。

**已被actual S10否定安全的旧28几何候选，余段未执行：**`DAAWWWWASSSSDDDDSWXWWWWWWAAA`。先D取Fork，AAWWWWA到1,6，不动两Pri与Shadow；原拟四singleS将Pri56从1,5向下移到1,1，P1,2。此处拟将横向光路留row1，但Pri经过1,3会先照灭初Shadow；不能接第三/第四S或旧出生尾。以下旧X19/六W/AAA仅保留失败方案的几何推理历史，不是可执行建议。

若actualX19为两active/F0/g0/free且Box53仍active，六singleW：左人col4从4,2→4,8全safe；右人推Box53从6,3→6,9/Button，自己末到6,8裸SPIKE死亡，左人必须仍有效。每进入有光路的row5、row8以及末W25需独立核Shadow.active与Gate.blockable。这里**不用玩家遮影**：5-8W44已限定玩家替邻箱遮影失败；row8真正西侧Wall5,8挡光是本关实体条件，仍不能代替actual。

若actual25 Box53[6,9]active/压钮、Gate50已open、左free[4,8]活，接AAA依次3,8→2,8Gate→1,8。末A28推GoalPri55到0,8Floor，自身占唯一Goal；completed必须真实观察。W25正常死亡与A28终点是两独立边界，任何提前completion立即停，不发后续输入。

CJS保留原`preXTrace`、`prefixChecks`与28推理历史，但下述actual S10已否定其Shadow安全前提，不接剩余28输入。

## S10阴性与新的眨眼换行候选

owner实际S9 main10/frame5485588：Pri56[1,4]、Shadow6,3active。S10 main12/frame5485649：Pri56[1,3]/traversedfalse，Shadow53[6,3]inactive，P54[1,4]/F1；原28“先向下移到1,1”的安全解释撤回，不能因traversed=false假无光。正常Undo1回9，真实Undo计数由owner保留；从该源安全6 `DSSAWW`拟送Pri回1,6/P1,5并保持Shadow6,3，需actual校准。

新的完整几何候选从上述source15接7 `DDDSSDS`到preX22/P5,2/S/F1；singleX23两侧4,2/6,2都是安全Floor，真实身份分配才写完整实体。两W使Shadow6,3→6,5、两free4,4/6,4，此时Pri1,6避免同row，仍须实测Shadow存活。

上述source15、preX22与X23/两W25已实际：15 main21/frame5520468，Pri1,6/P1,5/F1、Shadow6,3active；22 main25/frame5532395，P5,2/S/F1；X23 main28/frame5540113分配原54[6,2]/S、新57[4,2]/S/GMID54，两F0/g0/free。WW25 main32/frame5545700：Shadow6,5active/Pri1,6，原54[6,4]/W、新57[4,4]/W；CJS从实际X23重放24/25全58dict与103tiles相等，出生以前仅携带fresh光flags的差异仍留`blinkPrefixChecks`，不假称全程raw无差异。

仅新固定三物体导航域，从假定上述两W成功的源，**634expanded/654seen/pending20、limit2000、MODEL hit后终止**。path `SAAWWWWWDWDSASSDDSDASSAWDWDW`（**28**）把两free送1,7与6,4，Pri55/56与Shadow位置完全固定；拒裸SPIKE、合并、捕获、force。只对公开几何建抽象出生集合，clone=-1是私有模型标签，不是游戏ID/GMID，不把未实际X当真源。新完整几何候选为60指令，核心换行在time54，末死57、Gate59、Goal60仍待actual。

28固定导航已实际：29/33/37/41/45/49/53（frames5596392/5596591/5596795/5597000/5597207/5597422/5597634）全58物理/static与103tiles相等；33/49/53仅Pri56.traversed从携带source23的true变实际false，差异留`blinkChecks`。在53原54已到左1,7/A、新57到右6,4/W，不能沿用初次出生左右角色。

末singleW54 **已实际换行阳性 main49/frame5604702**：左54因GoalPri55背1,9Wall、左0,7Wall，改S推Pri56从1,6→1,5并落1,6；右57推Shadow6,5→6,6并落6,5，Shadowactive。物理/static/tiles完全相等，Pri56.traversed实际false仍保携带true预测差异，不称所有rawflags均等。

后续三个singleW实际55/56/57（main51/53/55，frames5629072/5629141/5629212）将Shadow53到Button6,9且active、Gate50 open。末57右57[6,8]裸SPIKE正常死亡（active=false/ghost1/F0/free），左54[1,7]保活；死亡帧57.anim_completed=false如实保留。物理/static与103tiles均相等，Pri56.traversed实际false的carry差异保留。

真实D+W到59 main57/frame5637988：54[2,8]占openGate，两棱镜/Shadow/死57其余状态完整58raw字段与103tiles均diff=[]。最后singleA60 **main59/frame5643594 completed=true**：54[1,8]活/free/F0/g0占唯一Goal，Pri55被推0,8Floor；Shadow6,9仍active/压Button，57死6,8、Pri56在1,5。完整物理/static/tiles相等，最终Pri55/56.traversed实际false而携带source23的true预测仍留在`blinkCompletionEvidence.fullDiff`；未包装为光学模型完整匹配。死亡57即时帧anim=false，而59/终60已为true，不能把即时false复制成终态或擅造稳定帧。

实际准确60串：`DAAWWWWASDSSAWWDDDSSDSXWWSAAWWWWWDWDSASSDDSDASSAWDWDWWWWWDWA`。本关真实normalUndo1（S10阴性恢复）、0retry；没有撤销或优化实际已接受动作。完整actual completion保在主JSON，不伪造终帧、不读取Save。正常保存核验由root处理。

据owner回报已正常核Save `blink=3`、exact60、accomplish125；helper未独立读取存档，主KB与正式保存证据仍由root/owner负责。

`blinkPrefixTrace`保存新出生前全57预测；实际X23出现后`blinkRouteFromBirth`只按actual分配生成全58字段，`blinkTrace`/`blinkChecks`审计后续，`recordedBlinkNavigation`保有限统计不重跑。默认audit不搜索，0新JSON；旧28失败史不覆盖。主JSON与私重放支持实际60完成，helper未独立核Save，无活handle。
