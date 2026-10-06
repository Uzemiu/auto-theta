# 5-11「释放」实际31的静态布局/光学审计（2026-10-07）

第二helper独立只读审计。唯一游戏输入owner为slot1_owner_oct06，primary负责动态构造；本文零游戏输入、零动态搜索，不读隐藏实现/UI-api，不用提示/启示/简化/外攻略，不改主JSON/KB/存档，不保存JSON/队列/后台。静态可推侧和潜在光轴不等于完整解，尤其不把暂时不可回收推成全关无解。

## 准确公开源

canonical `artifacts/slot1-playthrough/5-11.json` **event36/frame6503565，actual31个输入、timeline time33**，runtime release，size9,8/min0,0，60 entities/88 tiles。准确指令：

`DSWWWDDSSSSAADDWDWWDDWWADSSAWSX`

|对象|实际31状态|
|---|---|
|Goal51|1,7 active/floor=true/nonblocking|
|Goal52|1,1 active/floor=true/nonblocking|
|Fork53|4,2 inactive，isFork=true，非普通钥匙|
|Pri54|1,1 active，Color1/Shadow=false，height1、mask0、无cargo|
|Pri55|2,1 active，其余同54|
|Shadow56|7,5 active，Color1/Shadow=true、height1、mask0、无cargo|
|Shadow57|6,5 active，其余同56|
|原Player58|8,3/S，active、key0/ghost0/F0、contained0/container-1|
|新Player59|6,3/S，active、key0/ghost0/F0、contained0/container-1|

两Pri均lighten=false/traversed=true/testCompleted=false，level.completed=false。BOX/PRISM均pushable/blockable=true；两PLAYER.pushable=true/blockable=false。所有动量0/src-1/ext0、动画稳定，不能把BOX Shadow视作额外Player或凭空Fork。新59的GMID57仅为实际出生分配，未来fresh回访必须按actual身份校准。

fresh0 event0/frame6225879是59 entities：Pri55原4,1，Shadow56/57原7,3/7,4，Player58原3,3/S/F0。root已独立actual31/frame6551740与event36全部60字典/88tiles/exact31严格等（root回报）；本文不操作游戏复建。

## Floor、Wall覆盖与上层唯一通道

**两个Goal[1,7]/[1,1]均缺tiles条目，但GOAL.floor=true提供地面。** 88 tiles不能直接当全部90个坐标的地面集合，合并Goal后再核Wall。没有Button/Gate/Lock。

51个active Wall完整分组：

- 底y0的x0..9全Wall。
- 左x0的y1..8全Wall；右x9的y1..8全Wall。
- 顶y8的x1..8全Wall。
- 下内墙1,2/2,2、5,2/5,3/5,4、8,1。
- 上屏障1,6/2,6/3,6与5,6/6,6/7,6/8,6。
- 上右封房5,7/6,7/7,7/8,7。

raw11个SPIKE为4,6、4,8、6/7/8各y6..8，**仅4,6无Wall覆盖**；其余十个同格active Wall优先，不能当可走地刺或Ghost穿墙路径。唯一ICE5,1，其左右4,1/6,1是SOLID，外侧7,1是SOLID、8,1Wall。4,1..5、4,7均SOLID，4,8是被Wall覆盖的SPIKE。

```
       x=0123456789
y8       ##########
y7       #G...#####
y6       ####^#####
y5       #.....BB.#
y4       #....#...#
y3       #....#P.P#
y2       ###..#...#
y1       #RR..~..##
y0       ##########
```

图中R对应实际31的54[1,1]/55[2,1]；~是ICE。4,6是通向上层row7的唯一普通地形缺口。裸free不能从4,5无条件W穿刺到4,7；cargo/Shadow跨刺与消影释放均须实际核。上Goal51所在1..4,7是安全横排，4,7向左AAA的地形没有刺，但必须先确有active effective free或满足目标的实际角色在那里。

## 当前Pri55为什么不能普通推回4,1

此结论只限定当前地形/实体的**普通WASD推链与free合法推侧**，不排除未来实测的容器、释放、堆叠/跨线等新规则。

Pri54[1,1]四向普通不可移动：北目的1,2Wall、南目的1,0Wall、西目的0,1Wall；向东推侧0,1Wall。这个不可移障碍正占Pri55向东所需的1,1推侧。

Pri55[2,1]北2,2Wall、南2,0Wall；向西连54，整条推链最终到0,1Wall；向东目的3,1虽有Floor，但**推者须站1,1，那里固定54**。故不能从当前普通free在3,1用D“回推”，也不能从东侧A先挤出54。以当前普通模型，55恢复4,1没有合法第一推；不是全关无解结论。

只退回firstA后的55[3,1]也不自动恢复：此时向东推侧2,1虽是SOLID，其N2,2/S2,0是真Wall，W1,1由固定54占、E3,1由55占。在当时只有一个free、位于4,1的历史状态，2,1没有普通进入路线。应在搬55之前准备该推侧，而不是把“推侧有Floor”当已可达。

## 4列消影光路的实际改变与时序限制

fresh Pri54[1,1]北1,2/南1,0/西0,1均Wall，东经2,1/3,1通向原Pri55[4,1]。原55北轴为4,2→4,3→4,4→4,5→4,6 SPIKE→4,7 SOLID→4,8 Wall，**没有中途Wall**。SPIKE本身不是此处的Wall遮挡，不能因为4,6是刺而补造光轴关闭；是否照到cargo和如何释放仍实际判定。

当前55在2,1，北紧邻2,2 Wall、南2,0 Wall，西紧邻54；**原col4向上的光路已经移走**。不能引用fresh的55[4,1]来保证当前Shadow到4,7会消影释放。两Pri当前traversed=true也不能替代这条坐标变化。

若恢复55到4,1，col4轴会重新贯通，但**直接从开头永远保55原位**又可能让Shadow第一次到4,5时就被照灭，早于4,6/4,7的目标运输。没有actual前不能把“最终有光”当正确释放时刻；持cargo的Shadow.active、载人contained/container/mask/ghost及Goal完成须独立核。Player不能凭站在光线上自动当邻BOX遮光盾。

55若暂放3,1，北3,2/3/4/5开放，到3,6 Wall结束。它能暂时避开col4轴，却可能影响另一个Shadow在3,5的活性；不能把55@3,1说成对两个影都无光。向右推55也需审ICE5,1的停止/推侧，不能未经校准便授予任意新位置。

## 正常Undo范围与条件替代顺序

历史第一次改变55：

|历史输入/源|Pri55 / Player58|备注|
|---|---|---|
|11，event8/frame6302173，time11|4,1 / 6,1，Fork1|尚未搬55|
|12，event10/frame6310540，time13|3,1 / 4,1，Fork1|singleA穿ICE5,1碰Pri并停，M155实际|
|13，event12/frame6326270，time14|2,1 / 3,1，Fork1|第二普通A，移至当前陷阱位置|

从本文actual31若要正常回到11是Undo20；root随后报告owner已actual37/time41，则从37回11需Undo26，实际若继续前进必须重新按输入数计算，不能把ICE模拟time差当撤销次数。**本文未请求或执行Undo**；owner无需留关等待本审计，路线取舍由owner/primary决定。

一个可恢复55的替代**局部fixture，尚无可达前缀**：在55仍4,1时，先准备两个active free分别3,1与6,1、无cargo。singleA时：

- 6,1角色入ICE5,1再碰Pri，按M155实际接触停止，55→3,1、该推者→4,1。
- 另3,1角色同A离开到2,1，给55东侧恢复留下2,1活free。M156只校准本关多人ICE时另一人响应一次，不能据此自动预设本新同刻接触的所有后态。
- 由此条件几何中，55暂3,1能关闭col4轴。若cargo已真正到4,7、剩余free仍可控制，再用2,1角色D可以尝试把55推回4,1；另一4,1角色同D会经ICE5,1向6,1离开。该恢复同刻与Pri/旧角色占位、后续观测释放仍须single实际校准，不能先认作装载/冲突/成功。

这只是“搬55前留下恢复推侧”的具体方向，不是两free3,1/6,1已经可达，不保证二人能保持上述位置同时完成Shadow运输，也没有改写primary的动态构造。先出生/利用已实际的ICE相位差、正常Undo后的替代顺序由primary核；不能把当前F0复制成额外Fork或让被动cargo自行推55。

本静态域已完成，**零新增图节点、无handle/队列/后台**。当前不可普通回推的限定、4列光路改变、裸SPIKE唯一通道与上述条件fixture已发送owner、primary、root。未给完整通关候选，未作全关无解判断；实际影捕获/释放与完成仍待唯一owner验证。
