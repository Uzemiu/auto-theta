# 5-7 银河：持叉出生压钮与闭门前方（2026-10-06，只读）

私模[ch5-7-scroller-oct06.cjs](ch5-7-scroller-oct06.cjs)，公开源[5-7.json](../artifacts/slot1-playthrough/5-7.json)。起初手工0搜索；实际42后唯一新safe域12026扩展已闭合，无handle。无游戏输入、提示、外部攻略、隐藏实现/反射、存档或主KB读写。sole input owner为slot1_owner_oct06。

fresh0 main0/frame3969233：P76[4,2]/S/F0，Fork60[11,3]，ShadowWhite75[11,2]，C4 58[2,7]/59[2,6]，Gate61[2,5]闭、Button74[1,4]；Goal57/Pri63[1,9]、Pri62[1,8]。边界13列实际只有10个Pri（y0,1,3..10），**13,2空**，不是11个。size[14,10]，13,0/10为SPIKE，14列为Wall，无ICE/DARK。边界Pri是PRISM，不因Color1改成Box；不推动它们到地图外，也不假定地图外射线闭合或环绕。

actualS1 main2/3 frame4041196：P76[4,1]/S，62/63 traversed=true/testCompleted=false；Shadow75仍active在11,2。普通S物理/static校准与公开源相等，光flags单列未建边界模型；不把5-6的Shadow46直接光消失或循环规则泛化到本关。

几何终局候选是C4 58[2,9]/59[2,8]分别邻封63/62东射线，活free[1,7]观察62南。63北/西、62西均邻Wall，两个Pri互连，整列13可被东侧邻箱截断。合法pusher在Gate2,5内且原双箱2,6/2,7时，`WWA`两次上推安全（body2,6/2,7均非SPIKE），再A到1,7；也可第三W遇顶2,10Wall不能推，fallbackA到1,7。光学完成仍须actual核。

owner的新F1边界无需搜索：若actual10确为P11,3/W/F1，安全14 `SSAAAAAAAAAWWW` 到time24/P2,4/W/F1。SS下至11,1，A9沿安全row1到2,1，W3至2,4；不推任何箱/棱镜，不进入SPIKE。CJS在实际10存在后给14步完整实体预测与每个已有真实停点对照；原静态字典/GMID/Shadow/Color保留，不编造新出生ID。

实际资源源已存在：main12/frame4077043/time10，P76[11,3]/W/F1/g0/free。W9 main10/frame4063758（root独立4075489）将Shadow75由11,2推至11,3，75变inactive、仍Shadow=true，KEY60当时仍active；下一W10进入消影格才取Fork，KEY60 inactive。没有把影箱继续推11,4，也没有装箱或箱子拾Fork。只记录该消影fixture，不据此证明触发必须KEY格或某边界光路。实际10的62/63 traversed=true、其余边界10Pri traversed=false，全部testCompleted=false。14重放使用此实际源；每≤4停点14 P9,1/A、18 P5,1/A、22 P2,2/W、24 P2,4/W，F1不变、Gate仍闭。

14前置四段已实际校准：frames4098978/4099173/4099369/4099474分别time14/18/22/24，CJS完整77实体字典（含光flags）均diff=[]，terrain严格相等。preX24确为P76[2,4]/W/F1、Gate闭、原双C4与全部Pri不动。末X尚未知；这些确定重放不是搜索，扩展数仍0。

末singleX25未知：左落1,4是Button，右3,4是Wall，会尝试前方2,5（原闭Gate）。需实际核“左生子压Button可否在同一X中开Gate，允许前方出生”。M031只验证普通移动按旧闭门，未证明X内更新次序。若产生两active/F0/g0/free于1,4及2,5，且原双C4保持，则conditional `WWA`有完整运输价值：第一W仅钮上角色死于SPIKE1,5，另人推双箱到2,7/2,8并留2,6；后W与A到目标前态。门随后关不妨碍已在门上方推者。若只剩Button1,4单free或任何其他结果，立即停，不能W让唯一free裸刺；后续正常Undo由owner授权范围与实际记录处理。出生/Gate边界及最终Goal只取实际结果，不宣称已解。

更好的secondary手工尾为`DWD`，同样仅从实际X阳性源部署，保两个free：D26钮上人到2,4，门内人因3,5Wall回W，上推双箱到2,7/2,8、自身2,6，预计Gate关闭；W27内人推箱2,8/2,9、自身2,7，外人遇闭Gate回A到Button1,4（若门仍开则入2,5也安全）；D28内人遇3,7Wall、北链背2,10Wall，fallbackA至1,7观察，外人安全到2,4或2,6。三个边界逐单actual；旧WWA只留未执行历史，优先DWD不牺牲角色。CJS待实际X后才建全实体tail，不编造新ID/GMID或把门预测当实测。

## 实际X25阴性与恢复

main23/frame4157322（root独立4176244完整77dict/instructions diff=[]）实际仅原P76[1,4]/W/F0/g0/free，Gate61已open；无新PLAYER或新实体，两个C4原位。因此这个X中左落Button没有使原闭Gate前方出生有效，DWD/WWA条件均不成立，未执行。CJS将初始X未知与事后完整77字段audit分开，不回写成旧预测命中。

owner正常Undo1已恢复actual24 main25/frame4193819：77实体/terrain/准确24串与原20严格相等，仅timeline ID原77→保留78。真实累计Undo1/0retry，不重试同24/X25。helper始终无输入、0搜索/无handle。

新的保影资源入口只是假设：原actual8/P11,1可绕`DWWA`至11,3拾Fork，不先W9推75到3行；75是否保持11,2须实际核。75向左从11,2可推到9,2、pusher10,2安全，但下一A使裸pusher踏9,2 SPIKE，缺buffer；该局部不能当完整运输到Button1,4的解。没有为未知相位/出生重复20k图，也未作全关不可达证明。

另一个不同的有限边界probe（未执行）可从恢复24持叉源，3S+10D+W+D安全至13,2（唯一空Pri行），再独立W核13,3..10八Pri链是否允许推至地图外13,11。若按有限floor拒绝，fallbackA到12,2；若接受，P13,3/整链上移，是新的物理资源。地图外floor/光线规则未建模、不输出依赖该假设的长解；此probe由root择有运输价值时部署，否则可先正常5-8教学后回访。0搜索上限20k尚未使用，不人为凑预算。

## 实际纵环绕与第二出生

上述15前置已actual28/32/36/39（frames4337952/4338155/4338365/4338534）完整77dict/terrain严格diff=[]。singleW40 main51/frame4341471（root4382289）真正结果为**全部10Pri环绕**：69由13,10→13,0，64由13,0→13,1，70由13,1→13,2，原13,3..9依次→13,4..10；P76由13,2→13,3/W/F1。没有13,11对象，size[14,10]/anchor[0,0]/164tiles不变。先前finite-floor拒绝与outside13,11分支均被实际推翻，原反例不改历史；新wrap模型全77字段和terrain diff=[]。普通size+1环绕早有M015，此次只新增整圈棱镜链的具体应用，不称发现新的通用维度或新增成就。

singleX41 main54/frame4431048：原76[12,3]/W、新78[13,4]/W，均active/F0/g0/key0/free；10Pri又向北完整环绕一格，timeline79/新GMID74。完整78字段/terrain与确定几何重放相等，ID78/GMID74单列为实际分配，不假初始预测知道分配号。此与X25闭门出生阴性不同。两free同奇偶；原“8W+A越界改相”不可部署，因为从13,4第6W即裸SPIKE13,10，13,0也SPIKE，Prism推走后新gap不保护pusher。

singleD42 main57/frame4475145，后来同源59/frame4534369：外76原12,3向D遇13,3Pri背14,3Wall，真实fallbackW至12,4；内78原13,4向D遇14,4Wall，fallbackW推整环到13,5。两人仍活F0/free，没有cargo、force或相位差；全78字典/terrain diff=[]。普通请求仍按这个原阻挡前态转向，未因另一人上推棱镜腾格而允许外人进入13,3。CJS保留各原始边界假设与actual完整audit分开。

## 唯一新的safe图封存

由实际42来源59/frame4534369，只做一次新拓扑域，20k上限，**12026 expanded/12026 seen/pending0/closed=true/hit=null**；6254裸SPIKE边及314合并损员边排出“双F0 free都活”域。状态只保两个无资源自由人坐标与13列唯一空格，10个Pri仍物理存在且同类型/Color/无Shadow/无资源；GMID/身份不影响此无cargo域几何，实际审计仍逐ID。没有保存前沿或extraJSON，无handle。

目标是任一wait、不同奇偶、正常入Gate2,5/到1,7、移动两个C4、force或几何cargo，均未命中。实际D42校准紧邻横向原blocked→W规则；wrap按M015及实际40全链。潜在同tick保护接触应先判再拒SPIKE，CJS不把可能cargo当裸死静默丢弃；本域同奇偶且只有一个列gap，至多一free在列中，pusher新格就是新gap，外人不能经背14Wall的旧Pri横推进入，故没有该保护接触/force边。此有限闭图排除的是42保双活free的普通输入域，**不是本关无解**：保75的新fresh前置、尸体迟捕、cargo/叠体/force/额外出生等不在图内，未重复该图或凑满20k。

owner已正常退出5-7历史42，world53/frame4538081，进入5-8/lightroom fresh1/frame4551764；5-7仍未完成。任何未来候选必须正常回访重建，不能盲接5-8或冒称仍处在旧42。主KB/存档/提交由root与owner处理；helper私报收尾。
