# 4-26 D.N.A：114步实际完成与历史资源分析

2026-10-04，SaveSlot1。只读助手 `/root/ch3_37_cargo_revisit_oct03`；唯一游戏输入owner为 `/root/resume_slot1_oct03`。仅公开initial/KB；首轮固定串复算零搜索，后续root明确授权新relay条件域一次6000/depth45 best-first，实际计数见末段。无游戏输入、提示、攻略、隐藏实现、存档或canonical/主JSON写入。main负责首capture/完整前置；本文不把constructed carrier当实际部署。

**当前事实：owner已正常执行114步并完成本关。** 完整路线是root的47步合法前置、本文26步leading-empty-Prism转弯尾及main手构41步尾的连接；最终emptyPrism92在Goal3,15，南邻BlueBOX187/cargo188在3,14，Goal棱镜traversed/testCompleted=true、lighten=false。直接读主JSON `events[96].observation`、`completion`与`run`确认completed=true、time114、114输入、43个活cargo全contained1/ghost0。合法47源及后续完整Goal部署已实际闭环，不再是待部署条件。末段实证与完整输入见文末。

以下早期F2充分条件、F1弱条件及6000截断保留为历史资源分析；其中“缺来源/待实际”的措辞只描述当时所审条件族，并非当前关卡完成状态。旧Blue11,2/F1+Pri12,2+outside13,2 relay截断未命中；新Pri-first23/24证实的复制及0+0融合与最终leading-empty-Prism解法属于不同路径。实际完成路径不依赖F2条件源，也没有重跑或增加历史搜索cap。

## 实际initial与准确地形

`artifacts/slot1-playthrough/4-26.json` 的 `initial.level.id=dna`，size18,16，单Goal45=3,15。初Blue BOX46=14,4，PRISM92=16,4，P93=13,2/F0/faceS。45个KEY均isFork=true，无ICE、DARK、普通Key、Lock或Gate。

Fork分组：15,2首叉；11,1..4；row5的9/10/11；row6的9/11/12；row7的7..12；row8的7/9/11；row9的5..11；row10的5/7/9；row11的3..9；row12的3/5/7；row13的3..7，共45。

Goal3,15的west2,15、east4,15、north3,16均是真Wall；south3,14是真SPIKE且没有Fork。SPIKE tiles与Wall同格处以Wall优先，例如2,14、4,15、8,14/15/16、13..17,6；不可把这些当可出生地面。Goal实体floor=true，即使没有普通floor tile也可出生/推动进入。3,13是有Fork的安全格；3,12/11亦有Fork。

45把叉不能用32位`1 << index`：私有模型改为BigInt，满库存为35184372088831（2^45-1），summary序列化为string。几何/step复用公开观测模型 `scratch/ch4-22-readonly.cjs`，额外补M107同源max融合，**不是另一个独立物理引擎**。最早cargo-only固定族把原PRISM16,4作为静态阻挡；后续relay、实际23类型复算与leading模式才纳入可移动棱镜，各自边界见对应段落。模型没有实现光学完成算法；末态实际completed是当前完成证据。

## 最短顶端充分条件

以下cargo须active/contained/ghost0，面向设置动作可以在无outside条件下只转cargo；若实际还留outside，必须另核它的同步普通移动与生死，不能直接套用这些串。

| 条件源 | 固定输入 | 结果与前置缺口 |
|---|---|---|
| cargo3,14/F1，Goal3,15空 | WX；已面W可省为X | west2,14 Wall，east4,14 SPIKE有效、front3,15 Goal有效；出生4,14/F0与3,15/F0，mask1。缺F1 cargo到无叉SPIKE3,14的来源 |
| cargo3,13/F2，3,12叉active | AXWX；已面A可省首A | AX生south3,12/F2（消费后拾叉）与north3,14/F1；WX让北cargo进入Goal。低south叉spent时仍不减少北支的F1，但额外支整态须重放 |
| cargo3,13/F1 +旧F0载人head3,14 | AX；已面A可省首A | north child将旧head3,14推3,15，自己在3,14/F0；south3,12若有叉则补F1。fixed valid/mask1、无fusion/stack/conflict/Ghost。缺两载箱顶端部署，不能把空head等价为F0 cargo |
| live outside3,13/F0 +F0 cargo3,14 | W | 外人推head到Goal再踩SPIKE3,14死亡，cargo仍活；这是牺牲外人替代额外叉的静态条件，缺outside到3,13的安全同步前缀 |

上述前三种已固定重放。第四种只按普通推箱/刺亡已证规则静态组合，没有扩大首次捕获搜索。

## 较低F2入口的26/25输入条件尾

constructed source：唯一Blue源cargo11,3/F2/W、无outside；11,3叉与15,2首叉spent，其他Fork均active，原棱镜仍在16,4。输入：

`XXXDXXXWXXXXXXDXXXXWXXDXWX`

26字符，fixed valid=true、Goalmask1；stack/occupied/conflict/Ghost均0。同源融合只有0+0、0+1、1+1，按max保库存，未利用相加。全体普通朝向/X必须重放，不仅沿选定单支计算。

| 输入段 / 累计 | 用于上行的持叉主支 |
|---|---|
| XXX / 3 | 11,3单侧北生11,4补叉；继而到11,5，第三X有10,5及11,6主支 |
| DXXX / 7 | 竖向生长到11,9 |
| WXXXXXX / 14 | 横向沿row9到5,9 |
| DXXXX / 19 | 竖向沿5,10/11/12至5,13 |
| WXX / 22 | 横向产生3,13/F2；旁支仍存在，不假删除它们 |
| DX / 24 | 3,13/F2生3,14/F1及3,12/F2 |
| WX / 26 | 3,14北前向fallback进入Goal3,15/F0；另一有效east branch到4,14/F0 |

若源已是cargo11,4/F2/W，省首X：`XXDXXXWXXXXXXDXXXXWXXDXWX`，25字符。另固定核11,1/2/3、11,4与15,2五叉全部spent而上层Forkactive时仍valid/mask1；下方Fork不是这条条件尾的补充来源。**主线路能否合法提供F2入口仍由main求解，本文不构造不存在的初态库存。**

对同一11,3/F1/W源、仅11,3与15,2 spent，固定26串也valid，但mask0：22有3,13/F1，24生3,14/F0与3,12/F1，最后WX耗在2,12/4,12，head3,14没有到Goal，所有cargoF0。这个精确族的失败只说明欠顶端补偿，不能断言所有F1源、其它方向、外人/Prism缓冲或完整关卡无解。

## PRISM92的光路替代与运输边界

初Prism16,4并未在Goal3,15或其邻接位置。其 `lighten/traversed/testCompleted=false` 只记录当前状态，不足以证明它必须参与完成，也不证明它没有用途。直接活cargo占Goal可用M058/M063/M084/M086及新4-25的真实容器目标实例作为充分候选，不需要先输送棱镜。

若另有合法部署把Prism放到Goal3,15：north/west/east皆Wall，南面3,14至3,13可形成唯一需要观测的直光。活cargo3,14紧邻南光，或未被其它body挡住的活人3,13，是按M053/M054/M063具体实例类比的光学候选；仍需实际completed判别，不能拿traversed=true直接计完成。不存在初始固定的“45叉全要取”或“棱镜必须搬上去”证据。

一个只作静态条件的混合链：Prism3,14 +cargo3,13/F1/faceA，同X north birth可依M055推Prism至3,15，保护自己的child到3,14，south child到3,12；Goal上棱镜的其余三方向Wall、南面活cargo邻接，类似M063。缺的是Prism从16,4进入此上层构型的完整运输前缀；本文脚本没有把Prism伪装成Box模拟此条件，更没有猜测单Prism载人X性质。

root追加的低端同类条件也静态成立：Bluecargo11,2/F1/faceA +emptyPrism11,3，11,1/3/4三个Fork仍active；单X南child11,1拾叉补F1，北child推Prism11,3→11,4，自身11,3保护拾叉补F1。Prism作为空body到11,4不自行拾Fork。第二X保持faceA：北parent11,3生北child11,4，推Prism11,4→11,5并拾11,4叉保持F1；南parent11,1 north birth与北parentsouth birth同至11,2，两个F0同源融合，按M107保0。这两次X可以沿混合链把棱镜前推而不要求Fork2，也没有使用PrismcargoX。

该条件源位于SPIKE11,2/3，需载人Blue先受保护部署，同时Prism必须已经在11,3；本段最初记录时源的合法初态prefix仍缺，随后root47已补齐并在完整114路线中实际执行。后续每个转弯会改变north/side优先与body推链，不能从这两次直推单独推广完整光学尾。光学目标不能仅用cargo坐标`mask`检验：Goal上Prism且cargo3,14的构型在directmask中可为0，**该0不是棱镜条件失败证据**；当前实际114已明确completed=true。

## 复算与范围

脚本 `scratch/ch4-26-resource-readonly.cjs` 默认仅固定以上5种历史源/串及25步变体；执行 `D:/nodejs/node.exe scratch/ch4-26-resource-readonly.cjs`。默认不搜索；`relay`为后续单轮新域，已实际执行且封存，不重跑或增加cap。无新per-step JSON。最初待owner/main补齐的完整前缀与实际完成现已由114闭环，见文末。

## 新条件域：F1+Prism+outside的旧head relay，6000固定截断

root在首轮静态审计后授权独立资源域，main仍负责右腔首次捕获。条件源：Blue46 cargo11,2/F1/W，emptyPrism92=12,2，outside13,2/F0/W，11,2及15,2两叉spent，其余43叉active，keys BigInt=30786325577726。这不是actual2或其它实际新checkpoint；首可回收capture及普通混合链把它部署出来的prefix仍未给出。

许可W/A/S/D/X，包含outside的同步fallback/刺亡、Blue cargo的全局朝向与X、普通Box+Prism混合推链、已证同源max融合。棱镜不再静止于初始16,4：作为独立pushable body移动；但首次单Prism捕人只记录边界而不传播其容器/X，异源stack/X推力冲突/Ghost仍停止。目标是direct活cargo3,15，或一个明确光学候选 `Prism3,15 +紧邻活cargo3,14`；后者即使命中仍要实际completed核。不要求F2，也没有剪掉合法普通推力积F2的状态。

本次选择best-first，固定cap6000、depth45实际输入，分数为 `12*最高cargoY +18*最高持叉cargoY +4*PrismY +2*总Fork +15*活outside数 +40*(3,14有F0head) +80*(head且3,13有持叉rear) -.3*输入数`。一个明确新source/资源谓词，不是增加此前26固定串的搜索cap。执行命令只调用 `.relay()`，真实exec session28114，正常exit0；没有游戏API或其它agent脚本修改。

实际计数：expanded6000、uniqueSeen5895、queueEntries8636、pending2550、stale86、depthCut226、exhausted=false、hit=null。较短路径会重开已展开state，所以expanded可大于uniqueSeen；队列统计满足6000+2550+86=8636。已展开最高cargo y14、持叉cargo y13，maxFork1、没有派生F2。stack/occupied/conflict/Ghost计数均0；另单列Prism装人拒绝1。不得把这些有限计数改成不存在F2来源/完整Goal尾或全局无解。

最先触及y14的模型路径为 `WXXXXDXXXSSAWWWXXAXXWXXAXXWXXXXAX`，其局部顶端是3,14/F0旧head与3,12/F1，Prism13,5、outside13,3活。这个33字符局部态不是完整正尾，缺3,13持叉rear/后续推进，**不建议owner为它盲走**。本轮未命中Goal、也未搜尽，2550队列及更深/未建机制仍是边界；不升cap。

唯一Prism容器边界恰是条件源单 `X`：cargo11,2面W，west10,2是Wall；east child11,2→12,2把Prism推13,2，与F0outside的静止13,2同格；另一front child11,3保护拾Fork补F1。generic body-capture模型给Pri13,2装外人/F0、Blue12,2/F0、Blue11,3/F1，全外人装箱且无free。在这轮执行时本例独立Prism装载尚未实核，故只记录1-input standby边界，不在搜索中传播其cargo/X；后来actual33真实装人已证M124，见下面新实证，不再称装人当前未知。先W让outside撤13,3，再X可避此同格，但该6000轮此类后续没有完整Goal positive；本轮没有在新证据后重跑。

owner/root另提出底row1可回收capture来源：Bluecargo被外人A送11,1 SPIKE拾Fork1，外人最后踩12,1死；cargo面A单X可由north11,2 freshFork补回F1。该**静态输入几何成立**，firstcapture与实际部署由main负责，Prism可以仍在右腔其它位置。这是无outside/不同Prism位置的来源族，不被本次固定Pri12,2+outside13,2的有限截断全覆盖；本文不为它重复旧无outside26族，更不据截断要求F2。

## 新实证：单Prism捕人及持叉cargo-X，随后固定23源

M124/root正常MCP核actual33：单Prism92在13,2捕outside94/F0，后者active/ghost0/contained1/container92，Prism仍typePRISM而不是BOX。正常undo回21后，main另给Pri-first完整21串 `DDWWWDSSSAXAAWAADSSAA`，owner实际重建成功。继续D+X得到新的actual23。我直接读取主JSON `events[39]`（22）与`events[41]`（23）核：

- 22：Pri92/cargo97=11,2/F1/D，Blue46空13,3，outside93=13,2/F0/D。
- 23完整输入 `DDWWWDSSSAXAAWAADSSAADX`：原Pri92/cargo97=11,3/F1/D、newPri98/cargo99=11,1/F1/D；两者active/contained1/ghost0。outside93仍13,2/F0/D活，Blue46仍空13,3。
- Fork47(15,2)、87(11,3)、88(11,1)、89(11,2) inactive，其余41active；BigInt库存27487790694398。此23单leaf/time23/completed=false，复制本身不是Goal完成。

收到该主动复制实证后才启用 `observedPrism23()` 固定类型复算。它从主JSON实际23组装库存，并要求该精确观测存在，否则throw；普通混合推链及cargo复制沿公开模型复用。报告初次固定这两27串时同源Pri融合尚属M107类比；随后actual24已证0+0，下面两串的merge库存都只有0+0，因此该具体融合边界已获得实证。**未证持叉Pri的1+1、0+1或一般max**；私有模型现在停止任何带叉Pri重叠，不借Box的规则外推。没有新搜索。

最小同源边界现已真实闭环：23直接单X、继续面D。我直接读主JSON `events[43].observation` actual24核北Pri92/cargo97=11,4/F1，南原Pri98/cargo99=11,2/F0 active/contained1/height1；相遇newPri100与cargo101同11,2 inactive，P101仍container98/height1，不是两层叠塔。另Pri102/cargo103=12,1/F0活，outside93=13,2活，Blue13,3不动，无conflict/dialog、completed=false。root另独立MCP核一致。只证明0+0同源棱镜融合保0，不能从此区分一般max与求和，也不证明1+1规则。

固定上行两variant（均27输入、保所有原南支/FK/outside，不是单北parent代换）：

| 来源实际23 | 固定输入 | 首棱镜融合类比点 | 末段与坐标Goal |
|---|---|---|---|
| 先W避立即11,2同生点 | `WXXXDXXXWXXXXXXDXXXXWXXDXWX` | 尾6（模型累计29）11,5的0+0，使用已证0+0类型规则 | 尾25/模型48有Pri3,14/F0及3,12/F1、7,12/F1；outside16,5活。末WX耗尽叉，50末Pri3,14/F0、outside15,5活，directmask0 |
| 先单X核11,2同生点再上行 | `XWXXDXXXWXXXXXXDXXXXWXXDXWX` | 尾1=actual24，11,2的0+0已真实证 | 顶端/末态同上，directmask0 |

两串conditional fixed valid，stack/occupied/conflict/Ghost均0，融合库存全部0+0。最后没有活cargo真正到3,15；与旧Blue同族相比，新增南Pri及outside没有在这两串提供顶端补偿。**directmask0只说明坐标Goal未被覆盖，光学没有实现，不能据此断言真实游戏一定不完成**。Prism3,14及其他带cargo棱镜是否触发目标光学须owner实际观测；这两27串没有建立完整光学充分布局，不建议为局部顶端结果盲执行长尾。

复算 `D:/nodejs/node.exe scratch/ch4-26-resource-readonly.cjs prism23`。这只单串重放，不调用relay6000；历史截断与新类型实证并存，没有重跑旧图或增加cap。

## leading-Prism47：先固定核验、后在114路线实际执行的转弯结构

root最初独立固定完整47串 `DDWWWASSWWDDDSAAWASDSWXDSSSAAWWASSDSAAADDDSAAAX`，当时作为未实测候选；后续owner已在完整114路线中实际执行。47源为Bluecargo11,2/F1/A、emptyPrism11,3、无outside；Fork15,2/11,1/11,2 spent，其余active，BigInt mask28587302322174。本文先从该条件源固定复算手工转弯，没有重做main首次capture或完整Goal搜索；当前合法部署状态以实际路线为准。

source47接18输入 `XXXXWXDXWXXAXWXAXX`，valid=true：Prism到9,8，Blue主carrier9,7/F1/A。再8输入 `XWXDXWXX`，累计26输入 `XXXXWXDXWXXAXWXAXXXWXDXWXX`，valid=true：Prism到8,9，Blue主carrier9,9/F1/W。全26的stack/occupied/conflict/Ghost与fusion计数均0，所有Bluecargo≤Fork1，Prism始终empty。不是Goal完整尾，不要求owner盲执行到局部。

| 条件源后步数 | 转弯/接力几何与库存 |
|---|---|
| 4X / 4 | cargo沿11,3..6出生取叉，连续北推领先Prism到11,7，主Blue11,6/F1；原始11,1与后续11,2..4保留F0箱 |
| WX / 6 | 从11,6横生west10,6/F0旧箱，以及east12,6/F1（当地叉）；Prism仍11,7。必须保留10,6旧F0，它是后续9,6南推者的资源 |
| DX / 8 | 从12,6面D：north12,7有Fork，south12,5 Wall、front13,6 Wall，所以单侧迁到12,7/F1。无需虚设东推者 |
| WXX / 11 | 12,7面W左child推Prism11,7→10,7并在11,7拾Fork保持F1；第二X再推Pri→9,7，主Blue10,7/F1 |
| AX / 13 | 主10,7南birth10,6，推旧F0 Blue10,6→10,5 freshFork恢复F1（M121），北branch10,8/F0。Pri9,7未动 |
| WX / 15 | 恢复的旧Blue10,5/F1西生9,5 freshFork保持F1；东branch11,5/F0。只算原主10,7消费后新child会漏这位真正继承Fork的旧箱 |
| AXX / 18 | 从9,5先北生9,6/F1，再从9,6北生9,7推动Prism9,7→9,8；新Blue9,7拾叉仍F1。所需south pusher9,6在17已合法到位 |
| X / 19 | 保faceA，主9,7继续北推Prism→9,9，自己出生9,8/F1 |
| WX / 21 | 9,8横生east10,8，推旧F0 Blue10,8→11,8 freshFork恢复F1；west8,8/F0。第二次转弯需要保第一次pivot北支10,8 |
| DX / 23 | 旧箱11,8恢复F1后北生11,9/F1 |
| WXX / 26 | 西生10,9/F1，再从10,9西birth推Prism9,9→8,9并在9,9拾叉保持F1；完成east pusher绕到Prism右边的转弯 |

9,6与7,6的区别：9,6有Fork，所以Fork1 parent在9,5分裂，north child消耗后能补F1。7,6是真SPIKE但**没有Fork**；在这个no-outside、仅F1开始且已证先消耗后拾叉的纯cargo-X域，直接在7,6出生通常只能F0，不能假设它可自行X向北推Pri7,7。若额外F2预算、普通外推者、新容器/碰撞机制或不同relay布局改变条件，本局部论据不排除它们，也不称所有7,6路线不可达。

main接这两次转弯与所有F0前置手构41输入，owner已实际完成连接后的114路线。这里保留转弯原固定核验，不扩大main全Goal域。复算 `D:/nodejs/node.exe scratch/ch4-26-resource-readonly.cjs leading-turns`；不调用搜索。

## 实际114闭环：empty-Prism Goal与唯一南侧cargo

完整输入由三段组成，长度47+26+41=114：

| 来源 | 实际执行输入 |
|---|---|
| root合法初态前置47 | `DDWWWASSWWDDDSAAWASDSWXDSSSAAWWASSDSAAADDDSAAAX` |
| 本文leading转弯26 | `XXXXWXDXWXXAXWXAXXXWXDXWXX` |
| main手构后续41 | `XDXWXDXXXWXDXWXXXDXWXDXXXWXDXWXXXAXWXDXXX` |

连接串与主JSON `run.actions`、`completion.level.instructions`一致：

`DDWWWASSWWDDDSAAWASDSWXDSSSAAWWASSDSAAADDDSAAAXXXXXWXDXWXXAXWXAXXXWXDXWXXXDXWXDXXXWXDXWXXXDXWXDXXXWXDXWXXXAXWXDXXX`

本次只读收束直接检查 `artifacts/slot1-playthrough/4-26.json`：`events[95]`为最后输入receipt，`events[96].observation`为最终观测，与`completion`及`run`一致。level.id=dna、completed=true、time114、instructions长度114，input_locked=true。全部43个active PLAYER均contained1且ghost0。

- Goal45在3,15；emptyPrism92同3,15，active、height1、contained0，`traversed=true/testCompleted=true/lighten=false`。不存在Prism92载人cargo。
- BlueBOX187在3,14，active、Color3；cargo188同3,14，active、contained1/container187、Fork0/key0/ghost0、faceD。
- 因3,15另三邻均Wall，这一实际末态完成了Goal棱镜和唯一南光分支的覆盖。它证明这次具体光学构型成立；不需要把坐标directmask改写成光学判据，也不把`lighten=false`误读为未完成。

root另独立核SaveSlot1的dna state3、record114与完整输入精确匹配、总完成115/collection6，并核MCP自动回world fresh[-45,6]。这些存档与实时world结论的来源是root；本文没有访问或改写存档、没有发送任何游戏输入。主JSON记本关历史累计undo101、retry0，不能把最终成功串误记为整段历史零undo。

本轮仅追加实际证据并修正当前结论，未搜索、未扩大cap、未写主KB/主JSON。旧6000截断、两个弱Prism27尾与F2充分条件保留历史范围；它们不否定已经实际完成的114解法。
