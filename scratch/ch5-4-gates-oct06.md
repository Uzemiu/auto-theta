# 5-4「自由」按钮与下室局部几何（只读，2026-10-06）

公开源：`artifacts/slot1-playthrough/5-4.json` initial/frame2701670，runtime `free`、time0、单叶59、instructions空。P58[8,4]/S、Fork0/key0/ghost0/free；Fork54[5,4] active。入场帧input_locked=true；下述候选以owner正常等到稳定fresh0、guards清除且实体同初态为前提，不能在加载中发动作。撰写时canonical events仍0，无已实际压钮对照。

**落盘后同步的新实态**：canonical已保存actual7、event7/frame2815207、`WAAASWX`，guards清除。P58[4,5]与P59[6,5]均活、free、Fork0；Fork已用于正常X，主helper继续独占该双free capture域。下述24步只是fresh0条件前缀，**不能接在当前7，也不建议为它撤销已实测前置**；新双free仍适用地形/按钮局部限制，具体共享动作必须重新由主helper核同步角色。

三个箱：55 Color4[7,6]、56 Color1[7,3]、57 Color2[6,6]，全active、普通height1、空箱。Goal48[1,7]、Goal49[7,2]、Goal50[7,1]；Button51[1,4]、Button52[1,1]；Gate53[1,2]/ID0当前blockable。只有SPIKE[5,6]，无ICE。箱颜色仅记录公开标签，不为本报告添加联动、生命或观测规则。

## 实际地形与两个切口

```
      x=0123456789
y8      ##########
y7      #G#...####
y6      #....^BB.#
y5      #........#
y4      #b#..K#.P#
y3      #.#####B##
y2      #g.....G##
y1      #b.....G##
y0      ##########
```

G=Goal，b=Button，g=闭Gate，K=Fork；BOX也记B。Goal本身floor=true但未列在tiles中，必须把公开floor实体并入地面，不可把Goal当虚空。

上室与底部两行之间只有两条普通喉道：左1,3→Gate1,2，右7,4→BOX56[7,3]→Goal7,2。row3的2..6与8都是Wall。

- 上Goal1,7当前普通安全可达。例如fresh0 `WAAAAAAAWW`：先8,5，再沿row5到1,5，W经1,6到Goal。此仅一个Goal访问，不等于三Goal完成。
- BOX56从7,3向S推一次到Goal7,2，推者从7,4停7,3，是安全局部动作；再S会把空箱送到7,1。7,1南7,0与东8,1为Wall，不能从下北推或从右西推，向东也受8,1Wall阻挡，**空箱7,1是永久角落**。不能拿连续SS把它当无代价打开下室的前缀。
- Gate实际打开、且左走廊没有BOX挡住时，左喉可安全进入下室。Gate-only-open的固定箱连通上界含两个底Goal；右箱依然7,3不会阻挡下室内的row1/row2横向通路。
- 同样，只在几何上移走7,3箱也能连通两个底Goal。该上界没有证明现实可安全回收被南推的箱，不能把“移走”直接当合法动作。

## Button配对需actual，持久箱位是1,4或1,1

Button.details没有公开ID。两个按钮是OR、AND、或其他条件均未知，不能由唯一Gate.ID0推出。已有M017证明普通空箱能持续压钮，M099证明具体载箱占自己的Gate能保持开启；本关的空Color2箱占门仍需看实际Gate字段。M031还提示首次踩钮当拍不能预授权另一人穿原闭门。

|箱位|具体交付方向与推者|局部限制|
|---|---|---|
|1,4上钮|BOX1,5，推者1,6单S；或BOX1,3，推者Gate1,2单W|左右0,4/2,4均Wall，只有竖直交付。箱1,4会挡住唯一左走廊，门开也不能裸走穿箱|
|1,1下钮|BOX2,1，推者3,1单A；或BOXGate1,2，推者1,3单S|0,1与1,0均Wall；此箱不能再普通回收，是持久角落占位|

持续压钮不要求箱内有cargo，也不要求Ghost裸踩。它要求该actual叶有active BOX在对应按钮位置；不能仅看Cargo活性、颜色或上一拍门开状态。

## 一条fresh0普通安全的上钮箱前缀（MODEL待actual）

**`WWAASAAAWWDSASSDDWAAAWAS`，24有效方向，无X。**

它使用公开普通双箱链推移（M028），角色不踩SPIKE、不越Gate、没有捕获、争推或盒色规则。第17步正常拾取Fork54，最后保持Fork1。分段停止点：

|累计步|动作段|角色停点|动态箱位|
|---|---|---|---|
|4|WWAA|P58[6,6]/A，F0|55[5,6]空箱在SPIKE；57[4,6]；56[7,3]原位|
|12|SAAAWWDS|P58[4,6]/S，F0|57南推到4,5；55/56不变|
|18|ASSDDW|P58[5,5]/W，F1|17到5,4拾Fork；箱位不变|
|21|AAA|P58[2,5]/A，F1|57西推到1,5|
|24|WAS|P58[1,5]/S，F1|57[1,4]持续占上钮；55[5,6]、56[7,3]不变|

24后应首先观察Gate53.blockable，核本关**单上钮**效果。若只需要最短单角色按钮读数，fresh0的 **`WAAAAAAAS`** 9步到P[1,4]/S/F0，不碰Fork/箱/SPIKE；这是短暂角色占位，对持续开门不作承诺。

以上24不是完整通关候选；C4空箱仍在5,6刺上，三Goal未同时有人。另一helper独占新capture域；不能将该串接到它已推进、已X或已有两个free的源后。

## 上钮挡路时，用箱与推者接替占位的条件短尾

post24的BOX57[1,4]虽然压钮，也堵左喉。若actual确认单上钮使Gate1,2打开，则可逐单校准下列运输：

|单步|BOX57位置|P58位置|需要actual核的占位|
|---|---|---|---|
|S25|1,3|1,4|箱离上钮，角色留上钮，应复查Gate仍开|
|S26|Gate1,2|1,3|原上钮已空；空箱是否保持自身所在Gate开启，待actual|
|S27|Button1,1|Gate1,2|下钮现在箱占，角色自己占Gate；不能猜下钮OR/AND|
|D28|1,1|2,2|角色进入下室，复查Gate状态；即便它此后关闭，下室内两Goal路径仍安全|

如果上钮不能开门，S26会试图把1,3箱推入闭Gate，应停止，不把MODEL后态写成真实。若S26实际门关闭或实体有差异，也止于该校准点。不可未核直接一次batch跨四步。

到actual P[2,2]且BOX57确在1,1后，`DDDDD`可到Goal7,2，再单S可到Goal7,1；全程只走row2、最后进入公开Goal Floor，BOX56仍7,3不妨碍。也可从2,2单S到2,1、五D到7,1。这证明条件下两个底Goal分别可访问；它不制造第三角色、cargo、观测叶或完成记录。Fork1仍保留，后续capture/分裂由主helper与owner继续校验。

## 有限范围与验收

仅固定地形/固定箱的普通单free连通图：闭Gate24节点，单独开Gate38节点，单独移走右喉箱38节点，合计100新增节点。第一次简化地面读取误漏了floor=true的Goal，跑82节点即发现并修正；总计182节点，远低于3000。24动作仅固定单推者手工回放，不是双人/三箱BFS。

至少保存单上钮实际Gate读数、S25/26/27/28各自PLAYER/三BOX/Fork与Button/Gate状态；若采用其他capture源，用owner新的event/frame和真实箱位重核这些局部条件。无游戏输入、提示、实现读取、存档或主KB改动；只创建本MD，无额外JSON/CJS，无后台进程。

## 后续actual11校正（root独立只读核验）

owner已正常WAAASWXAAAS到11，58[1,4]单压上Button、59[3,4]，下Button1,1无人/无箱；Gate53[1,2]实际blockable=false。root frame2855444与主5-4 event12/frame2858739全部12动态完整字典及11动作严格diff=[]。因此本报告初态的关联未知现缩小为“上方单钮足够开门”；下方单钮、撤压、BOX门内接替仍未知。fresh0单free24仍是历史条件，不可接当前双free11；本补充无游戏输入或搜索。
