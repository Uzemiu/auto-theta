# 5-6「清理」光学与可回收布局（只读，2026-10-06）

公开canonical：`artifacts/slot1-playthrough/5-6.json`，runtime `cleaning`。fresh0为event0/frame3530015，P47[2,2]/Fork0/key0/ghost0/free，单叶48。owner唯一singleS后，event2/3/frame3591691、actual1/time1、instructions `S`、guards清除、未完成；P47[2,1]/S仍活。本文无游戏输入、提示、实现/反射、存档或主KB改动。

## 参数与实际第一光学对照

|ID|类型/初态位置|公开属性|
|---|---|---|
|40|GOAL[7,1]|active/floor=true、blockable=false|
|41|BOX[5,6]|active、pushable/blockable=true、Shadow=false、Color4、height1、空箱|
|42|BOX[7,3]|同41，Shadow=false、Color4、height1、空箱|
|43|PRISM[3,6]|active、pushable/blockable=true、Shadow=false、Color1、height1、无cargo|
|44|PRISM[7,1]与Goal同格|active、pushable/blockable=true、Shadow=false、Color1、height1、无cargo|
|45|BOX[4,6]|active、pushable/blockable=true、Shadow=true、Color1、height1、无cargo|
|46|BOX[6,4]|同45|

六个可推对象都floor=false，mask0、contained0/container-1、movingdir0/movingsrc-1/movingsrcext0。BOX没有PLAYER.ghost或Fork/key字段；Shadow不能自动当作cargo、额外角色或分裂资源。

fresh0的43与44均 `lighten=false/traversed=false/testCompleted=false`。actual1后43仍三false；44变为 **lighten=false/traversed=true/testCompleted=false**，六物位置和active状态不变。说明P[2,1]进入西侧对44的公开遍历状态有实际影响，**traversed=true不足以完成**，也不能把lighten=false当作“此Goal不参与观察”。

## 光学轴与邻位箱条件

size[8,8]、min[0,0]，外圈真Wall，无ICE/DARK。SPIKE为3/4/5,5与3/4/5/6,2。

```
      x=012345678
y8      #########
y7      ##....###
y6      ##.RBB###
y5      #..^^^###
y4      #.....B.#
y3      #......B#
y2      #..^^^^.#
y1      #.P....R#
y0      #########
```

R=Pri43/44，B包括普通与Shadow箱；P是actual1。Goal44角落的**东8,1与南7,0真Wall**，当前两个开放相邻方向是：

- 西6,1，沿普通row1可到P2,1。
- 北7,2普通Floor，再到远处BOX42[7,3]。

M054的已实有限规则区分相邻箱与远处箱：邻接箱可关闭多余方向，远处箱不能同样当成无需观察的方向。因此**42在7,3不是44北邻箱**。actual1的“西侧有人但testCompleted=false”与北7,2仍须满足相容；本文不把它写成已穷尽证明唯一失败原因。

条件上，若合法将42移到**7,2**，其邻位可关闭44北方向；若其他棱镜网络不增加未满足分支，则西row1只留一个观察轴。必须看actual44.testCompleted/关卡completed；不能先把42邻位布局当真实可达解。

另一个纯光学终端fixture，可供primary检验而非运输批：44[7,1]、43[6,1]，普通BOX41[5,1]邻封43西，BOX42[7,2]邻封44北，46已inactive，活free[6,3]或[6,4]观察43北支。按M053/M054固定网络模型，44西→43北可只剩一支。**没有完整合法运输前缀，未实际部署；43[6,1]和42[7,2]都是终端不可回收位，只有完整运输与光学阳性才可采用。**

## 42推侧与46双切口

|42[7,3]方向|所需推者|结果/限制|
|---|---|---|
|S→7,2|7,4安全Floor|推者停7,3安全；目标邻箱条件。当前7,4被46/42切断，不能直接到达|
|W→7,4|7,2安全Floor|7,2当前被44、42、6,2SPIKE与8,2Wall围住；即使北推成功，箱7,4背7,5/8,4墙，无法普通回收，不作暂存|
|A→6,3|8,3|8,3是Wall，没有合法裸推者位|
|D→8,3|6,3安全Floor|目的地8,3是Wall，不能推|

42在7,2后，其下为固定Pri44[7,1]且背7,0Wall，东8,2Wall，西推者8,2Wall，北推者7,1被44占，因此不可普通回收。它适合**实际最终封轴**条件，不适合未经校准的中途缓冲。44自身也无合法普通推法：W/A的推者是Wall，S/D的目的地是Wall；不能预设挪走角落Pri44来救箱。

46[6,4]的北6,5是Wall，南6,3安全，西5,4安全，东7,4安全：

- 从5,4单D可把46推7,4、推者停6,4安全，但**46[7,4]永久卡角**：上7,5、右8,4都是Wall，向西所需推者8,4为Wall，向南所需推者7,5为Wall。不要给“D清影”批。
- 合法向A清到5,4需要推者7,4；当前这个位未可达。若其他实际机制先解开切口，A不会令推者或箱裸踏SPIKE，可作为条件回收侧。
- W目的地6,5Wall；S推者6,5Wall，无合法裸推位。
- 若光学实际令46 inactive，7,4就能由6,4进入，再合法S推42到7,2。但**本关Shadow遭光是否消影、何时消影不能由5-5直接上Goal的证据推广**，必须actual核active。

## 45、41与Pri43的安全暂存和缓冲

上腔row6的初始顺序是Pri43[3,6]—Shadow45[4,6]—C4BOX41[5,6]，右端6,6Wall；不能从2,6向D推整条链进入Wall。

- 45的安全裸推侧是**4,7向S**：箱可到SPIKE4,5，推者停普通4,6。向W所需4,5是SPIKE；直接从该格推会让角色先死亡。向A所需5,6初态被41占；向D所需3,6初态被43占且后接41/Wall。
- 45移到4,5仅是暂存，**不等于已清理/删除**。本关Shadow在SPIKE的active变化仍未知，应该单步读取。其四个独立裸推法都可能使玩家站刺或进入原刺格，不能直接继续推。
- 混合链可提供回收条件：若Pri43在4,4、45仍4,5，safe推者4,3单W可把43送4,5、45救回4,6，推者停4,4安全（M055模型）。这把刺上的位置转移给后箱，而不是让玩家裸踩。此具体Shadow混合链仍待actual，不提供未完成的长回收串。
- 41[5,6]唯一安全直接推侧是5,7向S，到SPIKE5,5、推者停5,6。之后直接再S会裸入5,5死亡；必须先布置后箱缓冲。W所需5,5是SPIKE，A所需6,6是Wall，D目的6,6是Wall。
- 43从3,6向S可到SPIKE3,5、推者停3,6安全，但下一S会裸入3,5；不能直接连续S下送到row4。更合适的普通暂存轴是先从4,6向A送43到2,6，再从2,7向S经2,5到**2,4**；col2全程安全，2,4的四个所需推者邻格均安全可达。

一个仅用于局部校准的手工骨架，从actual1 P2,1出发：六W经安全col2到2,7，DD到4,7，**singleS**推45到4,5、P停4,6；在此先核45.active与完整对象字段。若同普通混合推动一致，A将43送2,6，WA绕到2,7，SS将43送2,4、P停2,5。整体几何 `WWWWWWDDSAWASS` 为14方向，无玩家踩SPIKE；它不是通关或光学阳性，不能跨Shadow首个未知变化盲batch。

Pri43下送到row1的4,1或5,1虽然不令推者踩刺，但会把角色留在西侧；其北3..6,2全SPIKE，当前右入口42/46截断，不能立即绕东回推。43到6,1又与固定44邻夹永久不可回收。**本文不输出这些下送的长批作为普通可回收计划。** 只有primary完成整体运输并校准光学结果，才可将它们用作终端位。

## 范围与结论

只跑固定actual1普通安全单free连通图26节点，以及仅乐观忽略46的28节点，合计54不同域节点；不推物、不穿SPIKE。前者可到4,7/5,7/6,3，不能到42推者7,4或7,2；后者可到7,4，7,2仍被42/44截住。另做14步单推者手工几何校验，无完整BFS、双人或六对象域，无后台进程。

现在可靠的实际是S1的44.traversed变化与未完成。42远位与邻位应区分，46不能向东卡角，45/41的刺上暂存必须有缓冲。Shadow光学清理及任何终端光学布局均保留条件，由primary和唯一owner继续真实校准。本任务仅创建此MD，无额外JSON/CJS，不写进度或主KB。
