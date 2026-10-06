# 5-3 浇筑：下腔三箱等待前置（2026-10-06，只读）

模型 [ch5-3-concrete-oct06.cjs](ch5-3-concrete-oct06.cjs)，公开证据 [5-3 canonical](../artifacts/slot1-playthrough/5-3.json)。helper无游戏输入/提示/隐藏实现/反射/存档或主KB改写；只留下本CJS/MD，唯一输入owner是 `slot1_owner_oct06`。

## 公开terrain与实际源

初frame2299260/runtime concrete。Goal2,6和同格Key68是safeSOLID；Goal6,8和6,7是safeSOLID。SPIKE仅2,4/8,6。**ICE是6,6与7,6**；简图普通dot不能当作没有ICE，不套用普通一步上房尾。Lock1,6初闭，Button2,5/Gate7,5初闭。

全部六物体都是BOX/classBox/active/pushable/blockable/height1/motion0，lower C1 69[4,3]/70[3,3]/74[2,3]，upper C4 71[3,6]/72[4,6]/73[5,6]。未把C1当Prism或链接实体。

本模型从owner **DDDX实际4/event4/frame2338260/axis0/id77** 出发：75[8,3]/D、76[8,1]/D，均active/ghost0/Fork0/key0/free/h1，六Box原位，Fork67inactive、Key68active、Lock/Gate初闭。已有实际DDD资源3的位置/朝向/Fork1及Box几何单独复核，X结果直接seed实际4。

## 下腔限定域与正前置

两free同奇偶；只移动lower三C1，upper三C4保持原位，所有玩家和C1都限制y≤4。该域不含ICE、死亡、装箱、碰面、叠箱、争推、取Goal/Key或任何色链接。三C1的初独立身份保留，状态哈希只对相同公开属性的空C1位置排列做几何归一化，逐步预测仍保持准确ID。

有界加权搜索 **5798 expanded/7505 seen/1707 pending，cap12000** 得到32步候选，非穷尽/最优。留总20k剩余14202给真正新后续域；默认脚本仅重放固定候选并审计实际观测，`searchExecuted=false/expanded=0`，原搜索统计在 `.recordedSearch`，只有显式 `--search` 才重算。无live搜索handle。

actual4后：

`AWASASAAWDDWASAASAWDSSWDWASSAAAA`

到time36：75[1,2]/A、76[3,2]/A活free/F0；69[2,2]、70[3,4]、74[3,3]，upper C4原位。stdout `.candidate.trace` 给32步八动态实体位置/朝向与完整源静态保留预测；`.preS` 给末前态。最初4步AWAS到time8应是75[6,3]/S、76[7,2]/D，六Box初位。

独立 **S37**：75南1,1Wall，fallbackD推69从2,2到3,2，75到2,2/D；76由3,2直S到3,1/S。三C1成为3,2/3,3/3,4链，背Wall3,5，76的3,1另三边皆Wall。

再独立 **D38**：75从2,2推首69到4,2，自身3,2/D；76按本tick旧三箱背墙不可推，在3,1原位仅朝D，发生一次普通等待，随后夹困已释放。两free活/F0/key0/ghost0，首次成为不同奇偶。参考已实测M060/M062，但本fixture必须实际S/D分开核，不把模型当新等待证据。

## 后续新候选边界（尚未搜索或执行）

actual38成立后，一个只用单C1、保另外两箱作buffer的SPIKE捕获fixture：70保持3,4，free4,4与1,4（异奇偶），单D。右人因5,4/4,5皆Wall，fallbackA把70送SPIKE2,4；左人直D同到2,4，模型参考M092/5-1期待Ghostcargo，右推者安全3,4。C1 Ghost捕获与后续装载字段仍需实际核，不仅凭颜色假定。

与之相反，早先需要Box1,2/1,3作双jam挡物的捕获会使两buffer不可回收，不能把局部Ghost2,4命中当运输解。当前不扩大这类无运输库存的域。

Goal2,6的cargo会按M063/M079拾Key68成key1；闭Lock1,6不能被固定当永远刹车。upper ICE6,6/7,6的运动需实际校准：只有初上三箱3..5时，A可左推而使人停5,6，D返回可能滑到8,6刺；空第四Box2,6不拾Key但不覆盖Goal，载人第四Box2,6能拾Key并可能开Lock，二者不等价。未知masked Ghost cargo在后续推链是否能用Key开Lock只能给短真实probe，不假设死叶无Key或保刹车。上房现无actual新尾或Goal完成声明。

## 后续实际验证：91 指令完成

上面的未验证边界保留为当时推理记录。actual38 main26/frame2485258 成立，root独立2500317对15动态实体和38指令严格diff=[]。owner提供六步 `WWDWDW`，helper只重放；actual44是75[2,3]/A、76[4,4]/W。独立W45把C1 Box70推到SPIKE2,4，同tick捕获75为active/ghost1/contained1/container70/key0；76安全3,4/A。actual45 main35/frame2572092，完整八动态字段diff=[]。这是实际采用的捕获前态，未执行前文1,4/4,4的单D构型。

owner给34步运输 `SSDDDWAAASAWSDDDDWDDSSAWDWAAAAASAW`，九个实际短停点到78的完整15动态字段与重放全部相等。独立W79让三箱柱到2,4/2,5/2,6并产生两观察叶；main57/frame2621908，root2635425对两叶30动态字段diff=[]。75/cargo70在Goal2,6：活叶active/ghost0/key1；死叶inactive/ghost1/masked_off1/**key1仍保留**。76两叶均安全2,3；Gate7,5开、Lock1,6闭，六物理箱完整保留。

owner选死叶后 `DDDDDWWWAWW`。独立A89 main70/frame2643595实际让76停ICE6,6；Lock仍闭，masked75仍key1，六箱未动。因此本关这个masked-key1 cargo链没有打开Lock；此结论仅限该实际构型，未推广到所有inactive持Key情形。末WW到Goal6,8，main74/frame2654095 **completed=true**；root正常Save122/exact91核验，helper未读取存档。完整真实串以canonical run为准：

`DDDXAWASASAAWDDWASAASAWDSSWDWASSAAAASDWWDWDWWSSDDDWAAASAWSDDDDWDDSSAWDWAAAAASAWTDDDDDWWWAWW`

本轮0Undo/0retry；仅最初5798节点搜索，之后捕获和运输均为owner手工候选的确定重放，新增搜索0，无live handle。CJS `.capturePrefixChecks`、`.actualCapture45`、`.transportChecks`、`.actualGoal79`、`.actualDeadTailAudit`、`.completionEvidence`保留实际审计。终态所有物理与静态字段相等；死叶76唯一稳定动画预测差异是实际 `anim_completed=false`，模型stable为true，不能声称终态原始全字典diff=[]。
