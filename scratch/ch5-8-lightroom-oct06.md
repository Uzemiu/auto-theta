# 5-8 光房：先校准两人光路（2026-10-06，只读）

私模[ch5-8-lightroom-oct06.cjs](ch5-8-lightroom-oct06.cjs)，公开源[5-8.json](../artifacts/slot1-playthrough/5-8.json)。起初手工0搜索；旧actual10动态域唯一2035扩展已封，新birth/搬盾确定重放，恢复43后的AS微域另展开5节点，累计2040扩展，无handle。不输入游戏，不用提示/启示/简化/外部攻略/隐藏实现/反射/存档读写；不写主KB或extraJSON。sole owner为slot1_owner_oct06。

stablefresh1/frame4551764：lightroom，size[15,12]、103实体/207tiles，无ICE/DARK。P79[7,8]/S/F0；Fork77[9,8]。C4 75[3,8]/76[4,9]，ShadowWhite78[4,8]由左侧75和北侧76护着。Goal72/Pri97[14,11]、Gate73[14,12]闭、Button74[2,1]。23个Pri按raw，不把Color1 Box等同Prism。Button北2,2、西1,1、南2,0均真Wall，唯一东3,1为SPIKE；sameWall+SPIKE有2/3/4,2及10/11,4，墙优先，不能字符图漏墙。

actualDD2 main3/frame4595885：79[9,8]/D/F1、Forkinactive、三箱初位active，Pri97 traversed=true/testfalse、其余22Pri标记false。rootfresh/DD独立4580483/4654175全部103dict+207tiles相等。CJS普通DD/拾Fork物理校准相等，初始光flags单列未建。actualX3 main6/frame4722823：79[9,9]/D与新103[9,7]/D两F0/g0/free，GMID100观察分配；箱盾保持。新ID只取actual。

owner提出0搜索手工尾14 `WDDDDDWSWWWSDD`，不碰箱/棱镜/Shadow，全部裸人安全。其前7 `WDDDDDW` 已到13,10/14,9：Goal南可被14,9观察，邻Pri96南可被13,10观察。必须独立核time10是否提前完成，若true立即停，余尾不执行。后7将人安全挪到13,9/14,10，也仅是新的光学fixture。CJS逐步完整实体预测供actual核；光flags只是从实际X3带入的未知假设，若实际改变会显示fullDiff，不包装为模型命中。

M053/054只明确棱镜分支覆盖、邻箱挡光与远挡不同，未证明这23Pri网络只需两个南观察者，也未证明闭Gate可按Wall关闭光轴。因此这条光学尾只能作为短actualprobe，不能直接宣称终局成立。

备用几何Goal方案需持续压Button2,1使Gate14,12开，free14,10单W推Pri97到Gate、自己占Goal14,11。**Button可由空箱压住，不必强制cargo**：若三箱缓冲运输最后让一free裸死，仍可保另一free赴Goal。具体三箱到Button未达，不能当完整解；真cargo可能另有观测价值。owner的右侧Wsafe装箱fixture（front12,10/rear13,10、pusher14,10与receiver11,9）也尚未可达，不先花预算追无全运输价值目标。

secondary独立固定3箱/23Pri导航到盾推者3,9/4,10，3000expanded/3060seen/60pending截断未hit，不重复其固定导航域。条件同步SSS可把75→3,5、76→4,6、Shadow78→4,5，保持左/北双盾，第四S不可发。主agent动态/capture域尚未启动，先完成安全光路actualprobe。

## 实际光学10阴性与旧有限图

actual4/8（frames4754104/4758548）全部104完整字段/terrain diff=[]。D9 main12/frame4762758新Pri96 traversed=true；W10 main14/frame4766578新Pri95/96/97 traversed=true但testCompleted全false，free79[13,10]/A与103[14,9]/W，箱盾不变，未完成。CJS保留携带source3光flags的两个预测差异，物理/static/terrain仍全部相等；证明西侧继续进入更远Pri，不是只观测邻13列南支就够。备用后7未执行，不把14尾假称17完成。

从旧actual10源仅一轮NEW dynamic3Box双盾阶段域，区别于secondary固定导航：**2035expanded/2035seen/pending0/closed=true/hit=null**，force1、裸刺876、合并59、shadowLight493、资源界限4等被排除。只保两active freeF0/三Box/上部y5..10、无capture/force/stack/死亡，光影按左/北射线候选，固定23Pri；并非全关无解。`recordedStageSearch`存小统计，未保存队列/extraJSON，不重跑。主20k预算余17965，不凑满。

## 新持叉出生与实际搬盾到34

owner正常Undo8从旧10回DD2持叉源，103实体/terrain/准确DD串严格恢复，仅timelineID103→保留104；真实8Undo/0retry。单free14 `SSAAAAAAAWWWWD`（**14，非旧口述13**）经row6跨col5安全，再col2向北到3,10/D/F1，preX16。四停frames4935791/4935992/4936196/4936314全部103dict/terrain diff=[]，三箱仍原位active。

singleX17 main27/frame4943560：北3,11Pri背3,12Wall不能推，改向front4,10，南3,9正常；实际原79[3,9]/D、新104[4,10]/D/GMID101，全F0/g0/free。原/新分配与身份以actual为准，未把旧103当新ID。接三个singleS至actual20 main34/frame4957562：75[3,5]/76[4,6]/Shadow78[4,5]仍active，79[3,6]/104[4,7]皆alive。18即时只5个动画false导致过严assertexit，随后稳定观察并只续remainingSS，未retry/重发；18稳定/19/20完整104字段和207tiles均diff=[]。第四S未发。

实际owner已经执行7 `WASSDDD`到27 main42/frame4993862：75[6,5]/76[7,6]/Shadow78[7,5]、79[5,5]/104[6,6]。原MODEL短5 `ASDDD`是未执行替代，只在CJS `transportASDDD`保留，**没有用模型25覆盖实际27或Undo减步**。24的WASS与25/26/27三个singleD均完整104字典/terrain相等，Shadow双盾实际保持。

继续实际7 `WDSASDD`至34 main52/frame5072030：75[8,4]/76[9,5]/Shadow78[9,4]全active，79[7,4]/104[8,5]双活F0/D。29/30/32/33/34完整104dict/terrain严格相等，root对27/32/34独立也严格相等。row4西光被真Wall2,4截断；第三D向10,4Wall未发。这里没有实证玩家可替箱挡影光，旧候选的同列玩家遮光假设已被下述W44反例否定。

## 实际39/43与W44玩家遮光反例

实际5 `ASDDW`至39 main57/frame5109240，75[8,5]/76[9,5]/Shadow78[9,4]全active，79[8,4]/W、104[8,6]/W。再4 `ASSD`至43 main59/frame5162960：79[9,3]/D、104[8,4]/D，三箱不动。以上普通物理/terrain完整104字典相等。

singleW44 **main62/frame5167533实际阴性**：75→8,6、76→9,6、Shadow78→9,5后 **inactive**，79→9,4/W、104→8,5/W仍活。唯一模型差异为Shadow.active；geometry/terrain其余相等。玩家8,5不能替代旧西邻实体箱75[8,5]，限定本fixture，不推论所有角色/光学。后续W3及AWDDD仅未执行旧候选，立即撤回。旧2035图曾把玩家当射线遮挡，保历史预算与nohit，不能用它作校准后的光学排除；CJS禁止重跑该已封图。

owner正常Undo1回43，main64/frame5205121三箱active与free9,3/8,4完整恢复，真实累计 **Undo9/0retry**；保留旧W44阴性，没有伪造成功北运。

新的固定三箱微域仅 **5expanded/8seen/pending3、hit=AS、即停**，与旧actual10域不同。actual43接A44：79[8,3]/A、104[7,4]/A；S45：79南8,2真Wall回D[9,3]，104[7,3]/S；三箱原位。**singleW46已实际阳性 main68/frame5310861**：79推9列双链使Shadow9,5、76 9,6，自身9,4；104直7,4，75仍8,5作真正西箱盾，Shadowactive。全部104dict/207tiles严格相等；Undo9保持。限定西实体Box与旧西Player替代的对照，不能泛化所有光路，也不代表更远运输已经可达。完整104预测在CJS `boxShieldProbe.trace`；`boxShieldChecks`核实际AS45/W46；`checkpointAudits`保39/43/44与恢复43的真实差异。

5-8仍未完成；主域累计2040扩展，20k余17960，不凑预算，无活process handle。主KB/Save/提交由root处理；默认CJS只audit，历史`--shield-search`已明确禁重跑。
