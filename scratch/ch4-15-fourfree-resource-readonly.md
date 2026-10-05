# 4-15：旧实际11后第二次自由分裂的四人资源域

2026-10-04，只读助手 `/root/ch3_37_cargo_revisit_oct03`。唯一游戏输入为 `/root/resume_slot1_oct03`。仅读正常主JSON、机制M108/M109与自建模型；不输入游戏、改存档/主KB、用提示/攻略或读取隐藏实现。只新增本报告和同名私有CJS，无新JSON、后台搜索。

## 实际seed与新的条件四人前缀

主JSON `4-15.json` events[5]/[6]/[8]/[10]/[12] 独立核实旧实际11：instructions=`WAASAWWWWSX`、undo_depth11/time12；P50=5,4/P51=3,4，均active、ghost0、contained0、Fork1、faceS；空Color4 BOX48=4,6、空Color3 Blue BOX49=2,2，剩Fork4,6 active，Fork4,2和4,5 inactive。没有把它当owner当前真实现场。

模型中仅追加 `WX` 可避免立即XX的同生点融合：

| 从旧11的动作 | 模型状态 |
|---|---|
| W | 两free在4,4与2,4，均因北Wall转A，仍Fork1 |
| X | 四freeF0 at4,3/4,5/2,5/1,4，faceA；两个空BOX仍4,6/2,2；末Fork4,6 active |

4,5角色的向北冰滑被4,6空箱与其背后Wall4,7制动，没有额外微步，也未进入SPIKE4,6。完整13输入为 `WAASAWWWWSXWX`。**11是历史实测，12/13这里只是普通+free-X模型正前缀，尚未实测。** 不建议owner仅因这个四人前缀就返回试验，因为之后的Blue载人取末叉资源尾尚未闭合。

相比之下，旧11立即再X会从两父角色各向4,4生一人，同格融合后仅3个F0 free，其他两个在6,4/2,4；不能按发起次数算4人。

## 私有模型范围

脚本基于 `scratch/ch4-15-readonly.cjs`，按 `blue-first` 已有修正，在真实捕获/货箱移动后处理cargo拾叉；保留实测普通推链、转向、同格融合、ICE4,5额外tick。M108支持Blue普通捕获、载人ICE拾物和Color3 cargo-X，但本搜索**只建立到cargoFork1前置，未实现cargo-X**。

phase0从实际11开始，仅保两名活freeF1，普通调位后允许一次free X；只有得到恰好4名活freeF0才进入phase1。三人出生（可能同生融合或落刺损失）被排除，因为本任务目标明确需要真实四人。没有沿用旧 `Fork>=1/max2` 限制到phase1。

phase1仅普通WASD，可正常牺牲/融合角色，优先找Blue cargoFork1 at4,6且尽量多outside。排BOX row1不可普通回收状态、任何ghost、新stack和推力冲突；不模型裸人先死再被下一ICE tick追撞救活。目标必须货箱中的角色活着、ghost0，不能把活动ghost当成功live cargo。单层普通BOX在goal上的观测没有新增叠体分支，本域也没有完整六goal或自动完成的预设。

## 两个有限保人范围结果

| 范围 | cap/expanded | seen | 未展开 | 深度截断 | Blue4,6Fork1目标 |
|---|---:|---:|---:|---:|---|
| 四人后至少3总活人（1cargo+至少2outside） | 20000/20000 | 23474 | 3474 | 0 | 未命中 |
| 四人后至少2总活人（1cargo+至少1outside） | 20000/20000 | 23160 | 3160 | 0 | 未命中 |

两轮深度上限均40（从旧11起计），队列均未耗尽。第一轮检查83829转移、第二轮82974；各自首个四人状态都是WX。尚未展开的状态不是“已失败”；这些结果也不排除更多深度、row1/ghost/stack/conflict或不同资源顺序的正常路线。没有扩大到百万态，没有把同刻出生融合的计数当存活人数实证。

复现：

- `D:/nodejs/node.exe scratch/ch4-15-fourfree-resource-readonly.cjs 20000 3`
- `D:/nodejs/node.exe scratch/ch4-15-fourfree-resource-readonly.cjs 20000 2`

两轮是明确不同的保人剪枝范围；第二轮放宽因为“尽可能多outside”不能被私自解读成至少2outside的硬要求。目前没有BlueFork1+outside的完整模型正前缀，故未向owner交付部分路径要求试跑。

## 搬运瓶颈与未知，不作全局否定

空C4最初占4,6，背后4,7是真Wall。普通从下北推不可，向南推者需站4,7 Wall；向左/右推出时推者进入旧4,6 SPIKE，通常牺牲一外人。第一次侧推只把C4停到3,6或5,6，这两格下方3,5/5,5又是Wall；将它恢复作下区的两BOX安全捕获链需要具体接力前置，不能假定“挪开就可回收”。

另一方面，Blue从下区向北的BOX通道是4,3→4,4→4,5 ICE；C4留4,6时会卡住Blue的续滑。M108的真实安全捕获依赖两BOX链 at4,2/4,3和适当人物站位，不能因为现在多两名free就假定该箱布局已部署。

这些是局部约束，不证明四人域整体无解。后续若给具体不同构型，可独立短replay核；目前仅“历史11＋模型WX四人”已闭合，而Blue捕获、末叉运输和随后cargo-X/六goal尚未闭合。无需打断owner其他已授权的教学/收藏推进，不写主完成规则或进度。

## 新域：首次同tick SPIKE装箱与活外人（2026-10-04）

本节是另一个明确谓词，未重跑上面两轮20k的live Blue4,6目标或真实44之后的208普通尾。私有脚本为 `scratch/ch4-15-ghost-capture-readonly.cjs`，从实际旧11出发，普通WASD，允许至多再一次free X、至多4名角色；目标是第一次同tick进入SPIKE并被移动BOX捕获，形成active contained Ghost Fork≥1，同时至少一名ghost0外free仍活。也记录Ghost Fork0且至少2外free的备用目标，Fork≥1不是六goal通关的必要性断言。

脚本处理实际Wall/SPIKE/ICE、M015的size+1环绕、普通推链与同tick拾叉；自由角色在主tick踩刺而未装箱就移出活动列表，不能靠下一ICE微tick救回尸体。已有live capture和cargo普通推运允许，cargo X/ghost后续传播、stack和推力冲突未建。首次ghost捕获分支即停止；箱落y≤1依旧排除，因本任务优先可恢复资源而非底行库存损失。

单轮预设cap15000、从旧11起深度35：**expanded15000 / seen17868 / 未展开2868 / 深度截断0**，检查61489条转移，**同tickghost capture转移0**。Fork1+外人以及Fork0+至少2外人目标都未命中。队列未耗尽，不能称该域穷尽，更不能断言游戏无解。补入明确环绕后计数完全不变；这是同轮模型复算核验，没有扩cap或另加新搜索域。

同一轮接受19次新live capture转移，证明并未把cargo全部剪掉；其中没有live cargoFork≥1 + outsideFork≥1。旧 `ch4-15-readonly.md` 的actual11 3056域以Color4为目标、`ch4-15-blue-first-readonly.md` 的actual11 3056域以Color3为目标，均保留两名Fork≥1角色而**允许一人为cargo**；“保两角色”不能误读成“保两free”。旧actual9的3790只查具体test前态，4488查Blue livecargo与外人均Fork≥1；没有据此宣称所有actual9 Color4捕获顺序穷尽。

### 地形与条件捕获几何

真实SPIKE只有1,7 /3,7 /4,6 /4,7 /5,7 /7,7，4,7同时有Wall，按Wall处理。**2,6/6,6为SOLID安全，3,6/5,6为GOAL有地板**；不能用“2/6,6推者必死”否定侧向装箱。主helper自有ghost条件尾中的该坐标错误已经通知修正。

普通W把BOX4,5推到4,6，推者需4,4；若接收者也以W进入4,6，只能从已被BOX占据的4,5出发，这是非法普通free起点。接收者在3,6/5,6时W会进入3,7/5,7 SPIKE，不转向中央。侧推BOX3/5,6到4,6的推者2/6,6可以安全站立，但仍需要同一个输入让另一角色进入中央；该同步前置未构造，不能由上述W局部障碍排除整个侧推域。

另一合法条件几何是BOX1,6、推者1,5、接收者2,7：同W下箱到SPIKE1,7，推者1,6，接收者因Wall2,8转A到1,7，可满足同main tick Ghost捕获。它需要不同奇偶的两外人、BOX已经合法部署到1,6，尚无从实测checkpoint到此的完整输入，因此**不是可交给owner执行的正前缀**。右侧镜像同样只属条件。

main助手提出的free-X条件也保留为未知前置：Blue已合法稳定4,5 ICE、Color4真正腾开4,6，Fork1外人3,6面S与4,4面D，同X可让一新角色踩4,6拾末叉，另一新角色将Blue主tick推入4,6，另留4,3活外人。旧C4仍占4,6时推链被4,7Wall阻挡，不能凭同输入另侧动作就假设预先腾空；稳定ICE箱的来源、移开挡箱后的重启时序及人物站位均未证。本轮没有该前置或执行建议。

### 资源库存与最短待证边界

从初态仅取4,2后 `AAAWX` 是实测两freeF0，剩4,5/4,6两叉；这一时刻不能直接许诺cargoF2 + outsideF1（需要3总叉）。旧9先取两叉持F2、再有效X的实际11是双F1 + 剩Fork4,6，库存才允许将一名cargo推进4,6后形成cargoF2/outsideF1。库存充足不等于已证明捕获可达；上述明确普通范围尚无该正前缀。

若以后实际产生ghost cargo4,6 Fork≥1、至少一名live外人、两侧3,6/5,6空，cargo面W时单X是新Color3/Color4幽灵复制＋目标生死观察的最小条件probe。外人若持叉也会X，需逐个核落点；外人Fork0才原地保留。该尾详见main助手 `ch4-15-ghost-tail-readonly.md`，这里只记录入口未闭合。

M092/M093目前真实来源为2-21 Color2：同tick SPIKE捕获保active/ghost1/contained1/Fork1，下一X复制容器且cargo仍ghost1。Color3/4活cargo X已证，不代表其ghost X、纠缠箱穿墙、整叠复制或六goal信用已经证实。Fork0 ghost到goal的M074式观测也可能有用，不能因为不满足Creation探针就抛弃；本轮未得到可复play入口。

结论限于上述首次捕获新域：没有可交付的完整候选，不要求owner暂停、回访或盲试。保留2868待展开状态和未建机制范围，后续只在具体新前置或实测机制到来后核验。

## 蓝箱挡冰的新资源入口与普通图（同日后续明确委派）

这不是给旧15k加cap，而是root/owner明确提出的新seed：先将Color3 Blue送4,6，保Color4在下区。短普通+X前缀 `AAAAAAWDDSDWWWWSX` 已由owner正常实测；本助手独立核主JSON events[88]：17inputs/time18，Blue49=4,6、C448=6,2，两free50=5,4/51=3,4，均Fork1/ghost0/contained0，末Fork4,6 active、未完成。

第14步Blue从4,4经ICE4,5滑到4,6，第15W外人停ICE4,5持Fork2，第16S回4,4，第17X成双Fork1。旧actual11的C4在4,6/Blue在2,2不是这个标签配置；横镜加颜色互换因ordinary左转fallback的手性，不能直接把旧状态数当作此seed的等价证明。

root授权普通cap5000/depth40，保两Fork≥1活动角色（允许cargo）、排BOX row1，不传播X/ghost/stack/conflict：新图**3056/3056、队列0、深度截断0**，12224转移；没有live capture或ghost capture，未到anyColor cargoFork≥1 + outsideFork≥1。首次独立stack拒绝0；推力冲突拒绝5。仅复算同一图加日志，不扩图预算。

### 五个首次冲突拒绝转移

下表tail均接在真实17之后，末键才触发冲突。两free都Fork1/ghost0，Blue恒4,6、末Fork4,6 active；冲突winner、masked loser及分支方向尚未实测，依既有普通冲突作条件预测，不把模型null当游戏输入失败。

| tail（含最后冲突键） | 冲突前C4 | 两free位置 | 最后键/实际两推向 | 条件分支的C4位置 |
|---|---|---|---|---|
| WSASSSSDD | 6,2 | 7,2 /5,2 | D：A /D | 5,2 /7,2 |
| WSASSSSWAWA | 4,2 | 5,2 /4,3 | A：A /S | 3,2 /4,1 |
| WSASSSSSDWW | 4,2 | 5,2 /4,1 | W：A /W | 3,2 /4,3 |
| WSASSSDDDWSAWWW | 4,4 | 4,3 /4,5 | W：W /S | 4,5 /4,3 |
| WSASSSDDDWSAWWD | 4,4 | 4,3 /4,5 | D：W /S | 4,5 /4,3 |

每支预计只保一winnerfreeFork1在旧C4格，不是两支各保两free。第1的右BOX7,2四向普通不可回收：东8,2/北7,3 Wall，左推者8,2/南推者7,3 Wall；winner6,2面D的X只有南6,1有效，北6,3 Wall/front7,2 BOX不可推。第2南支BOX4,1沉row1，不能普通北抬。第4/5北支C44,5的两侧Wall，前Blue4,6背Wall4,7；回收仍须真实处理上方Blue，而非假定两箱自由可用。

第3两叶允许两有效free-X落点，root再授权各一轮普通资源核：

| 条件叶（未实际执行冲突） | 单X后两freeF0 | cap/depth | expanded/seen | 未展开/深度截断 | cargoFork1+outsideFork0 |
|---|---|---|---|---|---|
| A：C43,2、winner4,2F1面A | 4,1 /4,3 | 10000/40 | 3056/3056 | 0/0 | 未命中 |
| W：C44,3、winner4,2F1面W | 3,2 /5,2 | 10000/40 | 288/288 | 0/0 | 未命中 |

两叶都保Blue4,6/末Fork4,6，普通保两live角色，排Ghost、row1箱、stack/conflict、后续X。A叶首次冲突拒绝5，W叶0；两者新capture/ghost/stack都是0。两叶条件图耗尽，未闭合首捕获，不执行该第3冲突路线，也不作全局排除。

## 精确D微tick追尸前态的新5000范围

root/owner另明确授权fresh17的首次前pose谓词：允许ordinary调位后再一次free X，**三人或四人出生都接受**；之后普通可含live cargo，寻找Blue4,6/C44,4、末Fork4,6 active，至少3名live free且包含Fork0 at3,6/4,3。最后D只作潜在实验：3,6人推Blue到5,6，自己主tick踩4,6取末叉死亡；4,3人撞5,3 Wall转W推C4入ICE4,5，下一微tick到4,6。该第二tick是否能捕获刚死角色是未知；没有在模型里宣称成功。

预设cap5000/depth35：**expanded5000/seen6804、未展开1804、深度截断0**，21139转移，9次新live capture、ghost0、stack0、conflict拒绝87。没有命中精确前pose；队列未尽，不称排除。后续仅复算同轮收集capture日志，计数不变，没有扩大预算。

短DX静态replay也核实：fresh17 D使两父6,4/4,4面D，X得freeF0 at6,5 /7,4 /4,5 /4,3。6,3是真Wall，首父向南无效而用front7,4，不能写出生6,3；第二父的4,5冰滑被Blue4,6背Wall4,7阻止。这个出生转移允许在新5000域中，但1804未展开状态不能被当成该出生后的全域排除。

### 同一图提取的九次live capture

均为主tick Color4 BOX48由6,2移动并捕获Fork0角色，结果cargoF0 + **2outsideF0**（3总actors），没有cargoF0+3outside。Blue始终4,6、末Fork4,6 active。下表tail接真实17；是模型中的最短到达该捕获转移的prefix，只有第2后来被owner实际执行闭环。

| # | tail | C4cargo落点 | 两outside | 可回收性 |
|---|---|---|---|---|
| 1 | WWXASSSSSDD | 7,2 | 6,2 /6,4 | 四向锁死 |
| 2 | WWXWSASSSSSD | 5,2 | 6,2 /5,4 | 普通可回收 |
| 3 | WWXWSASDDSSD | 5,2 | 6,2 /3,4 | 普通可回收 |
| 4 | WWXASSSSSSSW | 5,2 | 6,2 /4,3 | 普通可回收 |
| 5 | WWXASSSSSSSD | 5,2 | 6,2 /6,1 | 普通可回收 |
| 6 | WWXASSSSSSDW | 5,2 | 6,2 /4,5 | 普通可回收 |
| 7 | WWXASSSSSDSW | 5,2 | 6,2 /6,5 | 普通可回收 |
| 8 | WWXASSSDSSSD | 5,2 | 6,2 /7,6 | 普通可回收 |
| 9 | WSSASWXSSSDD | 7,2 | 6,1 /6,2 | 四向锁死 |

前八都由WWX建立三人资源：第二W后两父在4,5/2,5。4,5父的两side都是Wall、front Blue4,6背Wall4,7不可推，X无有效落点但原地活动并花掉叉；2,5父则生1,5/2,6两人。三人形成不同奇偶，允许后来的单BOX capture，因而这是旧“必须4free出生”域确实未覆盖的资源。第9来源不同，但仍只有3actors。

**实际闭环：**主JSON events[90] 的20inputs/time21=`AAAAAAWDDSDWWWWSXWWX`，真实P50=4,5、P51=1,5、P53=2,6，均active/ghost0/contained0/Fork0，证实零有效X落点角色原地花叉的这一个实例；没有拿M106普通等待去替代X实证。events[92] 真实29inputs/time30=`AAAAAAWDDSDWWWWSXWWXWSASSSSSD`，C448=5,2，P51 active/ghost0/contained1/container48/Fork0；free50=6,2、53=5,4均Fork0活，Blue49=4,6、Fork46=4,6仍active、completedfalse。父root也核实，主KB由owner同步，本助手只读。

### 实际29后的普通保三actor有限图

root进一步授权cap10000/depth40，从上述实际29资源出发，仅ordinary、保cargo和两outside都活、保独立Blue；目标为cargo4,6Fork1，或先到cargo3,6/free2,6（镜像5,6/free6,6）且Blue4,6的安全横向双箱链前态。结果**3246/3246、队列0、深度截断0**，12984转移，capture/ghost/stack/conflict0，两目标都未命中。

局部双箱链本身几何正确：cargoC43,6、free2,6，D使cargo入4,6安全取叉、Blue到5,6、free留3,6；镜像同理。缺的是从29到该前态的普通BOX航路。cargo由中心4,4横移2/6,4后北推需要2/6,3的推者，而二者都是Wall；下方箱进上区须中心4,5→4,6，Blue4,6背Wall4,7阻挡。不能把人物可绕上区推导成BOX也能绕，或把局部横推当完整来源。

已核新的每叶七尾是cargoFork1+独立缓冲空箱+free0的条件：左cargo2,6面W/empty1,5/free2,5，`XSAWWDW`；镜像右cargo6,6/empty7,5/free6,5，`XSDWWAW`。空箱让推者保活，最终两个cargo与free各覆盖侧边三goal；见main助手 `ch4-15-two-cargo-buffer-tail-readonly.md`。本轮29仍cargoFork0，cargo取末叉/两叶前置未闭合，不能据这两个条件尾计完成。

复现只读模型模式：`blue-blocker-live`（新17普通双F1图及五冲突）、`leaf-A`/`leaf-W`（条件第3叶X后资源图）、`blue-chase-pose`（新5000前pose与九capture日志）、`captured-resource`（实际29普通保三actor图）。都是 `D:/nodejs/node.exe scratch/ch4-15-ghost-capture-readonly.cjs <mode>`，没有游戏I/O或新JSON。模型未建所有ICE移障惯性、stack/conflict后续、ghost/cargo X；末节37/38已实测排除本例已停货箱自动恢复惯性，不扩大成任意新推入ICE的规则或整关不可解。

### 同3246图postprocess的最小blocked-ICE probe

root再次授权只从已有3246状态提取前pose，不扩BFS：找到从真实29接 **`WSDAAWWD`** 八步，到37输入的安全普通模型正前缀。另用基础replay重放同串，结果吻合。

| 总输入 | 动作 | C4cargo位置/Fork | 两outside | Blue |
|---|---|---|---|---|
| 29（实测） | D | 5,2 /0 | 6,2 /5,4 | 4,6 |
| 30 | W | 4,2 /0 | 5,2 /4,4 | 4,6 |
| 31 | S | 4,2 /0 | 5,1 /4,3 | 4,6 |
| 32 | D | 4,2 /0 | 6,1 /4,4 | 4,6 |
| 33 | A | 4,2 /0 | 5,1 /3,4 | 4,6 |
| 34 | A | 4,2 /0 | 4,1 /2,4 | 4,6 |
| 35 | W | 4,3 /0 | 4,2 /2,5 | 4,6 |
| 36 | W | 4,4 /0 | 4,3 /2,6 | 4,6 |
| 37（实测） | D | 4,5 /0 | 4,4 /3,6 | 4,6 |

末Fork4,6始终active，货箱/两outside都ghost0。37D时下方4,3人右撞Wall5,3，改W推C44,4→ICE4,5，冰滑被Blue4,6背Wall4,7挡；左方2,6人D到GOAL3,6。到37的完整输入为 `AAAAAAWDDSDWWWWSXWWXWSASSSSSDWSDAAWWD`。owner已正常实测这8步，主JSON events[96] 独立核37inputs/time38、C4 BOX48/cargo51=4,5，cargoFork0/active/ghost0/contained1，两outside50=4,4/53=3,6均Fork0活，Blue49=4,6/KEY46active。BOX48与cargo51均movingdir0/movingsrc-1/movingsrcext0。表中30–35为模型中间态，36/37实际稳定帧见events[94]/[96]；主KB由owner更新。

**单D（38）已实际执行，受限失败：**主JSON events[98] 为38inputs/time39，Blue49由4,6到5,6；P53到4,6，Fork1/ghost1但active=false、contained0/container-1，KEY46inactive，明确先取Fork后裸身踩刺死亡。另一outside50到5,4/Fork0活；C4 BOX48/cargo51仍在4,5，cargo仍active/ghost0/contained1/Fork0，movingdir0/movingsrc-1/movingsrcext0。没有自动恢复冰滑，没有这一步的尸体捕获，也没有得到active contained Ghost资源。

M064已有SPIKE先拾一般KEY再死、下一动作空箱迟到不复活的实际证据；本38D补充Fork同类实例。37稳定态的BOX48已经movingdir0/movingsrc-1，本38D移开阻挡Blue后依然不续滑，故本例根本没有第二微tick货箱到4,6的碰撞。**不能据此否定另一个同input新推C4由4,4→ICE4,5→4,6时捕获刚死者的候选**，也没有实际测试既有cargo在真实追撞时会如何接收死者；该不同前置由main助手负责，未重搜。

随后owner正常undo1，events[100] 恢复37inputs/time38：Blue4,6、C4cargo4,5、两outside4,4/3,6全活，KEY46active。累计undo50/retry0（本次回访undo1），没有完成信用。root与本助手均独立读JSON核此闭环；本节只更新自有报告，无新模型轮、无游戏输入或主KB改写。

### 同3056图postprocess：X出生的新推动ICE probe（已实测失败）

owner提出两个F1父先到5,2/2,5的新路径，root授权只审原fresh17普通3056个已见状态，不新增BFS或cap。本助手从该同图找到最短 **`WSASSSSWWWSAWWAD`** 16步尾，接实际17至33：空C4 BOX48=4,4、Blue49=4,6，两个freeFork1在5,2/2,5，均面D，末Fork4,6 active。这16步已独立以基础普通模型单串replay复核。

| 总输入/后续 | 模型前后态 |
|---|---|
| 33（17＋16尾） | 空C44,4，Blue4,6，F1父5,2 /2,5 |
| 34 W | F1父4,2面A /2,6面W；箱不动 |
| 35 X | 四名live freeFork0 at4,1 /4,3 /1,6 /3,6；箱不动，末Forkactive |
| 36 D 主tick | 4,3 child右撞5,3 Wall转W推空C4至ICE4,5；3,6 child D推Blue至5,6，自己进4,6SPIKE取Fork1死亡；另三名free5,1 /4,4 /2,6安全 |
| 同一36的ICE微tick | 新推动C4从4,5继续到4,6；后来实际未捕获这一input刚死Fork1角色，模型未实现追尸救回 |

安全到35的完整候选为 `AAAAAAWDDSDWWWWSXWSASSSSWWWSAWWADWX`，最后单D36是独立机制probe。与37/38旧失败的区别是本36 **新给空C4北推力**，不是期待此前movingdir0的已停货箱移障后重启；也不涉及已有cargo接收第二人。main助手独立WXD几何replay吻合。此前fixed20三free-only的noX末步障碍，不能套到X直接出生4,3/3,6的本前缀。

**实际闭环，受限失败：**唯一owner正常undo20回真实17，执行16步尾和W/X后，主JSON events[116] 为35inputs/time36，指令 `AAAAAAWDDSDWWWWSXWSASSSSWWWSAWWADWX`，空C4 BOX48=4,4、Blue49=4,6，四名free50=4,1/51=1,6/54=4,3/55=3,6均active、ghost0、contained0、Fork0；末Fork KEY46仍active。上述35安全前态已实际吻合，不再标待测。

events[118] 单D36后time38（增加2），证明空C4确实由4,4经ICE4,5到4,6；Blue49到5,6。receiver P55同格4,6却仍 **active=false、ghost1、split1、contained0、container=-1**，KEY46inactive，没有任何cargo。三名outside50=5,1/51=2,6/54=4,4仍active、ghost0、Fork0。dialog=false、一条axis、completed=false，BOX48与玩家最终movingdir0/movingsrc-1/movingsrcext0。与旧38移障不重启的失败不同，本36确有新推动及同input第二微tick到尸体格，依然没有复活或装载。这是本空Color4盒追撞本刚死角色的实际边界，不能与M092主tick同刻捕获混同，也不推广成所有颜色、已有cargo接收第二人或其它初始化情形的否定。

M064已证明一般KEY先拾后死；旧38与本36进一步实际证明Fork也可先取后裸死。因此失败原因不是未拾末叉，而是死亡角色没有成为active contained Ghost。root/owner已把该例同步为M114与主solution/progress/handoff，本助手仅读主JSON核证。

events[120] 正常undo1恢复35inputs/time36的四名活free、空C44,4/Blue4,6和KEY46active；root/owner报告累计undo72、redo1、retry0。本节只补真实闭环，没有新增模型轮或游戏输入。随后另执行此前授权的actual28底行缓冲/六Goal联合普通尾审查，正例与范围见自有 `ch4-15-28-row1-union-readonly.md`；该正例来自两叶目标分工改变，不来自本追尸实验。
