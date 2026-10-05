# 4-X与新完成counter/snap：有限组合核查，已封存

2026-10-05，只读助手。输入owner为 `/root/ch4_1_readonly`。未调用游戏、未改存档/canonical/主JSON，未读提示、攻略、隐藏实现或反射资料。本轮没有BFS/搜索进程/session handle；仅自有脚本6个固定静态图比较已执行结束。

**当前没有新增完整4-X组合正前缀或Yellow持叉ENTRY正资源。** 复用 `scratch/ch4-X-overlay-resource-readonly.md` 已封的18关叠图、4组两顺序相加结果，不重复扫描。只追加后来实际完成的4-19 counter和4-24 snap。两者的直接叠图与两种相加接缝没有给出明确物理桥接收益，因此不建议为此盲搬天空水晶。下一可操作研究按root分工转2-G旧实际46的W/WA及旧三轨候选核查。

## 新增两源的固定结果

源为各主JSON的真实 `initial`，不是完成后的角色/箱部署。counter真实size8,9，snap10,10，sky8,8。`^` 此处只假设同坐标Floor/Wall并集、较大size+1周期；`+` 按已实测水平底对齐、左图宽度size.x+1平移，较大高度周期。**不同尺寸叠图实际对齐/period及重叠地形优先仍未证。** 统计忽略箱/锁/门、SPIKE伤害和初始化容纳，仅描述删Wall后的物理图。

|组合|假设period|skyGoal8,1 / 7,0|skyP6,8 / Pri4,4|物理分量|
|---|---|---|---|---|
|sky^counter|9×10|2格分量 / Wall|34格分量 / Wall|34,4,2,2|
|sky+counter / counter+sky|18×10|4格分量 / 4格分量|14格分量 / 9格分量|34,14,9,4,1,1|
|sky^snap|11×11|57格分量 / Wall|Wall / 57格分量|57|
|sky+snap / snap+sky|20×11|4格分量 / 4格分量|14格分量 / 9格分量|57,14,9,4,1,1|

counter在sky8,1原格没有自己的tile/entity，sky贡献Floor；7,0有真Wall。snap在8,1有Floor、7,0有真Wall。横向相加避免同坐标Wall叠目标，但两种顺序均没有从接缝或周期边界接入sky原4格目标岛或9格Prism岛；没有把接缝不可接误写成所有光学、容纳、新机制都不可解。

M090真实 `3-28^3-X` 中，原角色与Wall同格曾成为contained且活，不能把本表的Wall删格模型当实际初始化死亡/全局无解。Sky普通Goal是否能通过新的Prism部署观测、叠墙容纳是否可动、不同尺寸如何对齐，仍需要实际组合初态才能建立模型。本轮没有相应世界同步占位完整前缀，所以没有推荐无收益的长途probe。

## 世界与Yellow操作事实

最后读到的完整公开Chapter4帧为 `chapter4-world.json events[410].observation`，frame16122298，instructions SDDDDW/time7；P66[-31,-11]Fork1，空4-X29[-32,4]。它是已记录世界源，不声称owner当下仍在那里。新完成目标counter入口[-43,-12]、snap[-46,3]均不可推且blockable=false。

正常规则分别有实际依据：不同人同时占不同入口为 `+`；同一人同时占移动入口与固定入口为 `^`；不同世界线进入为 `×`。实际 `2-X-times-14.json initial` 的两线保留各自source map及实体，目标集合联合；`×` 不等同把另一图Floor直接铺入sky。空入口仅推到固定入口同格并不自动合成，M090需要同步人物占位；未完成4-X先装人会入关，不能先假设载入口可留世界长运。

COL104只有“黄色叉子/获得新的收藏品/有什么用呢”自动文案，没有新的操作键说明。公开Notebook与正常README未提供独立于普通X的水晶分裂输入。旧world70单Shift无变化、M118先DAX消耗唯一Fork的入关样本、旧UndoEnter前态回退审计均保留其局部范围；不把这些旧阴性重复包装成新probe。本轮没有得到 `active + contained ENTRY + Fork>=1` 源，也没有重复旧DAX并宣称分裂关卡。额外worldFork56,5及其门前置仍是此前已记录缺项，没有新可执行前缀。

世界目标周围裸刺优先级也须保留：giraffe[-43,6]的东侧[-41,7]是真SPIKE，不能把它当missing Floor触发转向后捕获；dna[-46,7]同为SPIKE。一个仅constructed、依赖把这些格当墙的同步捕获构型不成立。本轮没有把“可搬空入口”误称“已能在completed入口同时装人”。

## 运行与收束

复算脚本：`scratch/ch4-X-snap-counter-combination-oct05.cjs`，执行 `D:/nodejs/node.exe scratch/ch4-X-snap-counter-combination-oct05.cjs`。只读取3份公开initial，比较新增2源各3种组合，固定静态连通图；无角色/水晶状态枚举，无游戏调用，无JSON输出文件。

结论限于本轮新两源的公开静态几何和现有资源证据，不排除合法组合、不同尺寸初始化、新容器/自旋机制。尚未实际完成的组合不计完成；普通编号关的独立完成规则按公开Notebook保留，4-X作为元关允许正常组合研究。

## 2026-10-05 追加：旧验收没有光学，不能把Wall表当全局失败

root要求仅核验收谓词，不重扫旧18关、4组+、新增两源6比较。本助手重读旧脚本/报告与M053/M054/M125、4-19实际光学completion：上述静态脚本只统计Floor并集减Wall后的物理分量，**没有棱镜光学完成判据**。因此“Wall覆盖Goal”或“Goal不与玩家同组件”不足以证明任意初始化/光学组合不能完成。M090还实证过初始人被同格Wall容纳，实际合图必须先看active/contained/container/height。

已知充分光学路线与直接位置mask不同：4-19源Prism与Goal6,8同格，通过两个邻Prism把三南分支投向5/6/7列，实际三cargo5/6/7,6同时满足；4-26 M125把emptyPrism推进Goal3,15，三邻Wall仅留南ray，cargo3,14活而Goal格无人，实际完成。这些实例不能扩成任意远Prism均能从任何Goal发光。

固定^dna、较大19×17周期假设中，两Sky Goal8,1/7,0在同一4格岛，初态该岛没有Prism或PLAYER；Sky Pri4,4在独立9格岛，dna Pri16,4在主组件。已知普通推、活cargoX与Prism复制都要求合法Floor落点，尚无跨这条缺Floor切口把Prism送入Goal岛的公开前缀。因此该既定假设仍没有**已知充分光学正构型**，但不把“光源必须同Goal”当未经证明的全局必要条件，更不排除不同尺寸period或初始化容纳新域。

固定+四组和新增counter/snap两顺序的Sky Goal岛同样没有初Prism/PLAYER，而Pri岛分离；旧物理表不能给出光学全局排除，但目前没有用已知光学把缺的部署补上。没有重复静态连通扫描、角色BFS或世界运输。

新增snap^在假设57格组件内保Sky Pri4,4和Goal8,1，这允许以后研究把Pri送8,1的不同验收；其真实邻格7,1/9,1/8,2都是安全SOLID，8,0是真Wall。若Pri合法在8,1，只南方向已被Wall挡，仍须满足西/东/北三个方向（或合法邻BOX mute），不能只占一条南线当完成。另一Sky Goal7,0仍叠Wall且无初Prism。counter^的7,0及7,1/6,0/7,2均叠Wall，也没有初Prism在Sky Goal；三个counter Pri仍5/6/7,8。如何初始化或搬Pri到被Wall覆盖的Goal仍未证。

一个明确的未知机制条件是“Prism与Goal同格且同时被Wall覆盖，容器初始化后Prism仍active并作为Goal光源，剩一条邻接方向有活人”；这只能作为未来合图实际字段/光学判别，M090人被Wall容纳与M125无同格Wall的PrismGoal都不能直接证明它。当前没有正常世界完整组合前缀或已成立此条件的初态，故不建议盲搬入口，也没有新增成就/通关信用。光路跨missing Floor是否被截断也未从本轮数据验证，不用缺Floor自动充当挡光Wall。

本追加只有固定邻格/验收审计，没有新搜索handle。随后按root新资源分工转2-G MODEL60四box row7；不是复跑Sky旧域。
