# 4-25 长颈鹿：阶梯Fork与顶端缓冲条件尾

2026-10-04，SaveSlot1，只读助手 `/root/ch3_37_cargo_revisit_oct03`。公开initial/KB模型，无提示、攻略、隐藏实现、游戏输入、存档或canonical/主JSON写入。本轮先固定复算条件串，再按root分别明确授权一次宽度5000与一次不同排序的定向best-first5000；每轮固定上限，不盲加cap。搜索起始为constructed，后与owner实际64部署完全吻合。

最新结果：**4-25已实际89输入/time89完成**。main手工构造actual64可接25尾 `SXWXXXXAXWXXAXSWXXSAXWWXX`，我固定逐步复算valid=true、Goal mask1后，owner正常游戏实测全匹配；我又直接读主JSON `events[60/62/64/66]`、`completion`与`run`核实86..89及completed=true。最终Goal5,15上的119活contained/ghost0，16活cargo均ghost0。root另独立核Save114/6、giraffeState3与record，自动返回world[-44,6]；这些save/world数据由root核，不是我的存档访问。这条正尾不需要历史F2源，不使用同源融合。下面的两次无hit截断仅保留各自探索范围，不能覆盖或否定已实测正例。

## 实际观测与地形

`artifacts/slot1-playthrough/4-25.json` runtime giraffe，唯一Goal5,15，初Blue64=6,6、C4 BOX83=6,5、P84=7,6/F0。首Fork65=5,4；owner实际4 `SSAA`拿到F1。历史主JSON `events[11].observation` 与main报告的actual21匹配：Blue64/cargo84=5,7/F0/active/contained1，emptyC4=5,6，outside85=5,5/F0/active；这个首capture没有剩叉。

随后owner完成实际64入口，root独立核，我再次直接读取 `events[29].observation`：Blue64/cargo84=3,4/F1/active/contained1/faceW/ghost0；emptyC4 BOX83=3,3 SPIKE；outside85=3,2/F0/active/uncontained/faceW/ghost0。仅首Fork65=5,4及Fork82=3,4 inactive，所有阶梯/side与末4,15仍active，completed=false。两次有限尾查的几何/库存源现已有实际依据，不需要再按constructed坐标部署；它仍不等于历史F2充分源。

唯一SPIKE3,3；无ICE/Lock/Gate/Prism。Wall1整列、2,3、4,3..14；顶2,16/3,16/4,16、3,17/18、5,14/16、6,14/15/16均Wall。Goal实体5,15提供floor，不能因缺普通tile误判不存在。

Fork阶梯：2,4..15连续；旁侧3,4/3,7/3,10/3,13；最后4,15。关键缺口是2,15→3,15为普通floor，无Fork；4,15才有末叉。4,15面D分裂左右4,16/4,14Wall，只能front5,15 Goal。

载箱分裂/带人保护/拾叉用M102/M108，旧Fork0 cargo被另一载箱X推到Fork恢复为F1用已实测M121。同源融合只依据M107及4-23的1+1→1、0+1→1，不相加库存；历史F2条件强尾的merge输入只有0+0/0+1/1+1。最新actual64的25尾日志没有任何融合，不依赖这些merge库存。Blue/C4 orig与Color交换只用已证两类普通cargo/X规则，不假设隐藏特性。

## actual64接25输入：手工全Goal尾的固定审计与实际闭环

源是已实测actual64：Blue64/cargo84=3,4/F1/W，C4空BOX83=3,3，outside85=3,2/F0/W；5,4与3,4两叉spent，其余active。owner曾normalreturn64，随后正常重入重放，root新fresh MCP再次核相同64源。报告初次发布时25尾尚待实测；现已实际闭环89，见后文主JSON引用。

完整尾 `SXWXXXXAXWXXAXSWXXSAXWWXX`，25字符，模型累计输入89。出处是main手工构造；我的复算使用私有 `scratch/ch4-25-resource-readonly.cjs` 的 `manual25` 模式，复用公开观测模型 `scratch/ch4-22-readonly.cjs` 的step并补同源max融合。这是独立进行的一次固定计算，**不是另一个独立引擎**。逐step要求恰一输出叶，25步全部通过，mask1。重置日志后：stack0、occupied0、conflict0、Ghost0、mergeInventory空；没有同格融合或库存相加，没有扩大任何搜索cap。

| 尾步 / 模型累计 | 关键状态 |
|---|---|
| 1S、2X / 66 | S让outside撤至3,1；X分到2,4/F1与3,3/F0，后者向南推C4至3,2；outside仍活3,1 |
| 3W、4..7X / 71 | outside推后箱一次到3,2，自身安全；主阶梯育到2,8/F1，并生3,7/F1，列3已有F0于4..6 |
| 8A、9X / 73 | side3,7面A分上下，南出生推低列向南、北生3,8/F0；主阶梯2,9/F1。outside2,2，C4退3,2，低列cargo3,3..6 |
| 10W、11..12X / 76 | outside2,1；主阶梯2,11/F1，side3,10/F1，列3另有8..9/F0 |
| 13A、14X / 78 | side3,10同样南推，把3,8/9两箱接到3,7/8；北生3,11/F0；主2,12/F1，outside3,1 |
| 15S、16W、17..18X / 82 | outside4,2；主2,14/F1与side3,13/F1，列3中仍有3,10缺口 |
| 19S、20A、21X / 85 | outside3,1；side3,13南推后填3,10并北生3,14/F0，主2,15/F1。C4=3,2，Bluecargo列3,3..12与3,14；3,13此刻空 |
| 22W / 86 | outside3,1→3,2仍活；C4→3,3，Bluecargo3,3..12→3,4..13，3,14旧head未动；完整竖链为C4 3,3 + Bluecargo3,4..14 |
| 23W / 87 | outside3,2把整链再上推，C4→3,4、Bluecargo→3,5..15，然后自身踩3,3 SPIKE死亡；2,15/F1仍在，head3,15/F0 |
| 24X / 88 | 2,15面W：west1,15与front2,16为Wall，仅east3,15有效。新child在3,15/F0，旧head被推4,15拾末叉成为F1/W；原2,15腾空 |
| 25X / 89 | 4,15/F1仍面W：west3,15的F0箱被推到已腾空2,15，east5,15是Goal；出生3,15/F0和5,15/F0，mask1 |

尾23W的死亡在这次推力之后，不在22W；外部人死亡后最后两X由活动contained cargo响应。尾25X无需D改面，也不是仅front出生：其合法west推力与east Goal同时有效。22/23W长箱链及尾24的M121拾叉现已实测吻合；本尾不涉及叠箱、推力冲突或新Ghost机制。

模型末态为C4空3,4；16个Blue源活cargo：列3,5..15，另2,7/2,10/2,13/2,15与5,15；全部F0/W/ghost0，outside无活人，所有Fork已inactive。脚本summary中每个Blue clone的`id:64`只是origin标签，不是实际创建后NID，实际89 IDs必须由owner主JSON核。

固定复算命令：`D:/nodejs/node.exe scratch/ch4-25-resource-readonly.cjs manual25`。不需要重跑`search`或`directed`。

实际主JSON零基索引闭环：

- `events[60].observation`：86输入/time86，outside85=3,2 active/ghost0；原head113=3,14/F0 activecontained。
- `events[62].observation`：87输入/time87，85=3,3 inactive/ghost1/uncontained；head113=3,15/F0 activecontained/ghost0。箱链已完成上推，符合推力之后刺亡。
- `events[64].observation`：88输入/time88，head113=4,15/F1 activecontained/ghost0，container112，face0=W；证明旧F0载人箱被X推到末叉补F1。
- `events[66].observation`及`completion`：89输入/time89、completed=true；Goal上的119=5,15 active/contained1/container118/F0/ghost0，16活cargo全ghost0；85仍死，未复活或被箱捕获。
- `run.action_count=89`、`run.completed=true`，完整输入为 `SSAADDXAAAAWDDWWAWAWWDWWWASSSSDSSSAAWDDWWASDSAASAWSDDDDDWAAAASAWSXWXXXXAXWXXAXSWXXSAXWWXX`。

因此本报告当前结论是实际通关。历史F2充分源未部署、两次5000截断均不再是当前待解结论；保留只为记录各自谓词/算法的有限边界，不新增模型无解推断。

## 更强F2入口的16输入充分尾

条件源：active contained cargo3,4/Fork2/faceW，3,4叉已取，2列与3,7/10/13及4,15叉尚active；无干扰的额外body或outside。例如emptyBlue仍6,6不影响阶梯。输入：

`XXXXXXXXXXXXXDXX`

十三X、D、两X，共16输入；若无outside且需先设faceW可加W，共17：`WXXXXXXXXXXXXXDXX`。

| X次数/动作 | 关键库存 |
|---|---|
| 1X | 2,4/F2、3,5/F1；前者消耗后拾Fork补2 |
| 7X | 2,10/F2，旁支补叉并生成缓冲 |
| 10X | 2,13/F2、3,12/F1 |
| 11X | 2,14/F2、3,13/F2 |
| 12X | 2,15/F2、3,14/F1；另2,13/F1等旁支 |
| 13X | 2,15原格已腾空；3,15/F1，由两个同源child的0+1融合保1 |
| D | 仅设faceD |
| X | 3,15 north3,16Wall，south可推旧F0支；front4,15有效，拾末Fork仍F1 |
| X | 4,15两side皆Wall，front5,15，Goal上活cargo/F0 |

私有固定模型valid、Goal mask1。最终额外cargo不在Goal，不影响这个单Goal充分候选；这条历史F2条件串没有单独实测。F2入口的合法来源未闭合，不能套用到actual21或普通刺口F0→3,4仅得F1的来源，也不能称F2是所有解的必要条件。已完成正例使用实际64/F1源。

另一个有后箱的constructed入口：SPIKE3,3上已经活contained cargo/F1，empty rear3,2、outside3,1/F0。单W推双链到cargo3,4/F2（取当地叉）、rear3,3、outside3,2仍活，再十三X+DXX。整个17输入 `WXXXXXXXXXXXXXDXX` 模型全Goal且outside最终4,2活。把C4cargo/Blue rear交换成Bluecargo/C4 rear亦固定验证有效；然而“SPIKE3,3已装箱且持F1”的合法来源依旧缺失，最新actual21/运输模型不是这个源。

若实际3,4/F2入口仍有outside3,2及rear3,3，就不能为了设朝向盲加W：那会推动并令outside踩SPIKE。应根据实际cargo已faceW直接用16尾，以上17例的首W来自更早3,3/F1源而非该入口。

## 顶端Fork0载人缓冲的4输入充分尾

条件：cargo2,15/F1、另一个已载Fork0的Bluecargo3,15；仅末Fork4,15需active，无live outside。输入：

`WXDX`

W设faceW；X因west1,15与front2,16是Wall，仅east3,15可用，推动旧Bluecargo到4,15。旧Fork0 cargo拾末Fork变F1，新的原cargo在3,15/F0。D设东面，下一X旧cargo4,15左右4,16/4,14Wall，只front5,15，Goal mask1。若初始faceW则可省首W为`XDX`三输入。

这里Blue必须已经含活Fork0 cargo；emptyBlue被推到4,15不会自行拾Fork，也不能把Goal上空箱当人物覆盖。旧蓝cargo与新父源可不同orig，不发生同格叠加；动作本身复用M121已证转移。缺口是3,15/F0载人缓冲的合法预置，并非所有路线都必须使用此构型。

## 一叉直北族的准确末态

从cargo3,4/F1/W、无outside，直十三X模型Goal0：第12X还有2,15/F1及3,14/F0；第13X把2,15原箱迁到3,15/F0，2,15已vacated，全活动cargo无叉。不能把第13X后的2,15仍记F1，也不能把一步一步踩Fork保持F1延伸过plain3,15。

main另提供运输MODEL：actual21后31普通输入 `DWWWWWAAADSAADWWAADSASAWWSSSWASAW` 到cargo3,3/F0、empty3,4、free3,2；下一W得cargo3,4/F1、empty3,5，outside3,3刺亡。该运输31由main模型提供，本文不冒充实际输入或 independently已核完整31。

对此差异front-empty seed，仅新增固定replay，没有再BFS：cargoBlue3,4/F1+emptyC4前3,5、无outside，W+12X后2,15/F1、3,14/F0；W+13X后3,15/F0、2,15vacated，emptyC4由第一次front child推到3,6后停留，Goal0。它与下面已搜rear-empty seed不同，不能互称搜尽；直北失败不排除改face、其它捕获/推力或新缓冲结构。

## 单次新F1入口宏域：有限截断

root额外授权时的constructed源为Blue64 cargo3,4/F1/W、emptyC4 BOX83 rear3,3、outside3,2/F0；3,4与5,4叉spent，其余所有阶梯/旁Forkactive。现已是主JSON实际64源，模型没有为此重跑旧宽度图。outside是预算的一部分，普通W会推后箱并踩SPIKE死亡，模型不硬剪死亡，也不把后续尸体当活cargo。

私有单轮宏BFS选择X、WX/AX/SX/DX与普通W/A/S/D，cap5000、depth20宏边（最多40实际输入）。目标为完整Goal，或预置3,15/F0且同时2,15/F1；未知异源stack、X推力冲突、occupied-cargo碰撞与Ghost传播停止，不凭假融合放行；无边界循环。

- 实际完成一次：expanded5000、seen12489、pending7489、depthCut0、exhausted=false，未hit，未加cap。
- 已展开节点最高持叉cargo y10，路径`WXXXXXX`；此为已展开范围，不是全图最高或未展开队列边界。
- stack0、conflict0、Ghost0；occupied拒绝转移5次，首记录`SXDXWXXXAX`，需核到底是新Color3容器接人还是既有cargo/外人碰撞，不在此假补M116。同源merge库存只有0+0。
- 剩7489未展开，加上停止的未模型机制，绝不能称F1源、front-empty源或4-25全局无解。

## 文件与可复算范围

模型 `scratch/ch4-25-resource-readonly.cjs` 默认只做固定短串；`search`模式对应上述宽度cap，`directed`对应下述另一次明确授权的不同算法。两轮已执行并封存，不建议重复同轮或扩大预算。默认复算：

`D:/nodejs/node.exe scratch/ch4-25-resource-readonly.cjs`

所有模型从公开initial和KB复用；无新快照JSON。历史F2入口16输入与顶端F0载人缓冲3/4输入的独立前置仍有缺口；actual64的25手工尾已经实际89完成，不继续建议F2部署。完成证据是主JSON真实completed及root独立save核验，不是单靠模型mask。

## 新算法：actual64源定向best-first，已触顶但截断

宽度首轮在5000上限只展开到持叉y10，而固定直北已可到顶，故root另授权一次定向best-first5000，不是把旧cap累加为更大的同次宽度图。物理源/许可动作同上，宏深20、最多40输入；目标仍是Goal或3,15/F0+2,15/F1的充分预fill，不将后者视为所有解必要条件。

排序分数为 `20*最高持叉cargoY + 8*最高cargoY + 3*总Fork + 30*(3,15有F0cargo) - 0.5*输入数`；相同状态可保较短宏深，使用优先队列。outside普通行动/死亡仍真实回放，X本身不自动移动F0 outside；未知occupied、异源stack、X冲突及Ghost仍停止。

已实际运行完成一次：expanded5000、uniqueSeen7585、queueEntries7585、pending2585、staleSkipped0、depthCut0、exhausted=false；没有Goal或预fill命中。只用了单轮授权预算，不新增搜索。

这次已展开最高持叉y15，记录路径 `WXAXXWXXXXXXXX` 到2,15/F1、3,14/F0（其它F0散在低列），outside已牺牲；只有末Fork4,15尚active（模型keys32）。它确已触及最相关塔顶结构，但仍缺预放3,15/F0，而非足够多未用普通Fork。没有要求owner执行该无完整尾路径。

该轮stack0、occupied0、conflict0、Ghost0，同源merge仅0+0；这些是已探索转移的计数，不抹去首轮occupied边界或未展开队列。现仍2585待展开节点，且未知机制停止，因此只能记这一排序下的有限截断，不能改成F1实际源或全关无解。
