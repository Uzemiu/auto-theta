# 4-9 earthworm：幽灵复制箱的可信规则与最小实验

2026-10-03，只读分析。读取2-21再访主JSON及自动教学、4-9初态与已实测DS；未操作游戏、提示、存档或主KB，未读取隐藏实现，未进行完整路线搜索。本报告不要求切回2-21，也不打断4-9输入 owner。

## 2-21中的实际发生与桥输出

主证据 `artifacts/slot1-playthrough/2-21.json`，events索引均为0起算：

- events[108]：124有效输入/time184。PLAYER183在19,4，active=true、ghost1、contained1、container161、split1，BOX161亦在19,4。另外178/184已inactive；它们与活动ghost183不同。
- events[117]：第125输入单X/time185。原BOX161与cargo183到19,3，新BOX185与新cargo186到20,4；183/186都active=true、ghost1、contained1、split0，container分别161/185。仍单条axis0世界线。
- events[120]的普通自动教学说明新产生箱子的状态与幽灵角色纠缠；events[122]说明箱子具有类似幽灵态的性质及可见纠缠边框。events[124]关闭教学后状态未进一步移动，未发生目标/光观测实验。

| 125输入后的字段 | 原BOX161 | 新BOX185 |
|---|---|---|
|type/class|BOX/Box|BOX/Box|
|active / floor|true / false|true / false|
|pushable / blockable|true / true|true / true|
|pos|19,3|20,4|
|properties|face0、maskedoff0、contained0、container-1、height1、movingdir0、movingsrc-1、movingsrcext0|相同字段及值|
|details|Shadow=false、Color2、GMID157|Shadow=false、Color2、GMID163|

**BOX properties/details没有独立ghost或entangled字段。** 新旧箱在这些行为字段上的区别不能由桥输出直接识别；id、pos、GMID的不同只证明复制产生了新实体。实际纠缠来源需要保留X前后对应关系和教学/边框证据。ghost1出现在箱内PLAYER，而非上述BOX字段。不要把普通BOX的ghost字段缺失记作“纠缠取消”，也不要从blockable=true/false臆推未实测的穿墙或自主移动。

该次幽灵复制容器为**Color2 BOX**。M098/M100/M101中的活人复制Color4 BOX已实测；当前4-9的BOX53为Color4。因此“Color4活cargo可复制”和“Color2 ghost cargo可复制纠缠箱”分别有实证，Color4 ghost复制的具体输出仍应在本关核实，不能把颜色差异隐去。

## 已证与未知

已证：同刻落刺和入箱能形成active/ghost1/contained1的角色，持叉仍保留；这一例未依赖DARK。这样的持叉活动ghost单X可以移动原载箱并新增一载ghost箱，两角色各消耗一叉而split降0。两箱分裂落点可因墙阻塞使用前方回退（2-21的上侧19,5有墙）。这不是取得额外叉，也不是产生两条新世界线。

已证的邻近机制：M074普通载ghost箱进目标可分出生/死线，生支箱内活人可满足目标；但该例没有幽灵复制出的新箱，不能把其BOX保留/消失结果当作纠缠箱已有实测。M099的活Color4箱仅一有效方向时只迁移原箱，没有新增箱。

本次证据仍未知：纠缠新箱收到普通方向时能否自主移动；是否和普通箱一样需要外人推；它能否压按钮或保持开门；目标观察是否让新BOX本身在死支消失、cargo生死是否与源角色同步；新箱和源cargo的具体纠缠对应关系。没有已验证的穿Wall/关闭gate、无叉再复制或无限复分裂规则。

## 当前4-9的明确边界

`4-9.json.initial`：size8×8，Color4 BOX53在3,4；PLAYER54在1,6，split0；fork49在2,5、fork52在2,6；唯一SPIKE7,4。实测DS后人2,5、split2，两叉已拾。

按钮51在7,6，北7,7及左右6,6/8,6均墙；去按钮的走廊为7,3→SPIKE7,4→7,5→7,6。GOAL1,1前有gate50在3,1、details.ID2；没有DARK或PRISM。初态按钮未占、gate blockable=true。BUTTON51的details未暴露ID，因此配对最好通过实际门状态变化确认，不能只把索引顺序当规则。

不存在“已构造的ghost cargo”证据，DS仅是当前双叉前置。普通载人箱跨刺有已有实证，并不自动使箱内原来活人变ghost；活动ghost仍需要核同刻刺/捕获等真实事件。下面的局部checkpoint是**实验前提**，不是从DS已经到达的路线。

## 两类最小局部检验

### A：复制、被动移动及按钮效果（条件式XWW）

只有owner在本关的正常求解中真的构造并观察到以下状态时才适用：BOX/cargo在7,4；cargo active/ghost1/contained1、fork至少1、面A；一个free在7,2且fork0；7,3与7,5为空；没有其他会同时推这条链的角色。

1. **单X后full观察。** 两侧几何是南7,3、北7,5，按既有普通复制类比应出现两载箱，但Color4 ghost输出需以实测为准。核新旧BOX id、各cargo的active/ghost/container/split、worldline数量；不要预设新旧id对应哪一侧。若叉起点1，预计两cargo皆0。
2. 若实测下箱7,3、上箱7,5，外人仍7,2，**单W**。按被动普通箱模型，下箱到7,4、外人7,3，上箱保持7,5。若新BOX恰在上方且自行到7,6，这一步没有外人对它施推，可区分自主移动与被动容器；若新BOX在下方，它受推，不能用同一步证明自主移动。任一分歧先观察，不批量继续。
3. 若第一W符合被动模型，**再单W**应推7,4+7,5两箱链至7,5+BUTTON7,6，外人进入7,4刺并死亡。核按钮处实际哪一只BOX/cargo、BOX active、cargo active/ghost，以及gate3,1的blockable是否变false。这检验实用的“该载箱占按钮是否开门”；由于箱内ghost和箱同格，不能再细分成一定是BOX而非cargo压按钮。

这是从指定checkpoint起最多3输入的机制实验，**没有证明该checkpoint可达，也没有证明4-9通关**。最后推者牺牲，若没有其他可用外人，就不能凭开门结果声称能到GOAL。真实状态若仅一有效复制方向，或出现不同位置/遮蔽/叉资源，则此XWW不适用。

### B：目标观测的关联谓词（只在正常路线自然到目标时采集）

不要专门切关或为此重建2-21。若4-9的正常路线把可溯源的纠缠新BOX送到GOAL1,1，记录送入前和单次送入后的full状态，重点比较每条实际axis：

- 新BOX是否active/存在/同位置，源原BOX是否存在；
- 对应cargo的active、ghost、contained、container是否仍引用存在的BOX；
- 源角色和新角色是否同时生/死，或仅被观察者改变；
- gate3,1、按钮7,6的占用/开闭、最高时间completed。

如果出现“箱内cargo死亡且新BOX消失”，可支持该具体关联；如果死支仍有BOX，只排除“此条件必定让它消失”。active/ghost1也不能当作满足活人GOAL；完成必须核actual completed及后续正常保存。仅教学“类似幽灵性质”不足以预填上述任何结果。

## 给主路线模型的使用原则

当前可靠基础是保叉、普通BOX复制、同刻捕获、箱链和末推者牺牲。涉及新ghostBOX自主走动、穿墙、自动开gate、生死观测联动或无叉续复制的转移都应保留为待证分支，不能当成已知模型边。优先让owner及路线helper继续正常4-9构造；本报告只补证据字段与条件式短检验，不给未经构造的完整解法。
