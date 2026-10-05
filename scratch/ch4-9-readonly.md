# 4-9 蚯蚓：只读阶段报告

唯一游戏输入 owner 为 resume_slot1_oct03。helper 不操作游戏/提示/攻略/隐藏实现/存档/主KB；文件仅为有限模型和几何分析。关卡尚未完成，不能把模型失败写为游戏无解。

## 实图

```
8 #########
7 #...i.###
6 #Pf#..#b#
5 #.f.###.#
4 #..B###s#
3 #.......#
2 #######.#
1 #G.g....#
0 #########
```

P1,6；叉2,6/2,5；Color4 BOX3,4；button7,6控制gate3,1 ID2；goal1,1。ICE4,7。SPIKE7,4处是右侧唯一纵向通路。额外SPIKE4/5/6,2和4..7,0均与真实Wall叠格，不能用Floor tile覆盖Wall导致误建图。目标可由普通free经过7,2/7,1再向左走到1,1，不要求cargo在goal；关键是保住另一角色压button并保留可下行free。

## 第一有限模型

从实际DS（取双叉，P2,5 fork2）的假定X双fork1状态1,5/3,5，只模拟普通方向、player ICE微滑、单箱capture，禁再X、BOX进入ICE、冲突世界线。队列2976状态穷尽，首次cargo：

`WWWDSSAWWASSDS` 14方向，BOX/cargo3,3 fork1 **faceD**，外人3,4 fork1 **faceS**。

新capture的cargo继承进入格时真实转向D，不是末请求S。此前给owner摘要面向不够清晰，owner实测修正已记录。模型可达cargo坐标仅row3的x1..7；此模型范围内没有cargo7,4，不泛化到游戏其他X/叠箱/幽灵条件。

owner实际按14前置，途中ICE批次只执行部分，按instructions核剩余后补发；实际17输入/time18符合位置和face。单X实际18输入/time19：cargo3,4/4,3，free2,4/3,3，全fork0活。前箱4,3切断左房和右廊，两free都在前箱左侧；不建议普通继续盲运。

## 修正X实际20态

owner正常undo1回17后AAX，实际20输入/time21：

`DSXWWWDSSAWWASSDSAAX`

两个cargo3,4/2,3，两个free1,3/1,5，全fork0活。历史1undo/0retry保留。

第二有限模型 ch4-9-post-readonly.cjs 含player ICE微滑、两箱链、动态button/gate，禁BOX-on-ICE/叠加/推力冲突/X。4153状态队列穷尽，外人最大x6，前箱7,3堵住x7，未找到goal或button。不是全游戏无解；该构型中的两箱挡上/下左房入口，右推下箱后前箱一直阻住所有free右路，缺先到7,2的角色。

## 有效尾部几何（owner独立模型）

假定两个cargo6,3/7,3，free5,3/7,2：`WSSWWWDDDDSSAAAAAA` 18方向可使一箱7,6永久压button，首推者死7,4，另free绕底行到1,1。此hypothetical由owner独立脚本验证，未在游戏达到该前置。

因此有限前置必须先保一个free在7,2侧，再让箱链送6,3/7,3，不能只看箱坐标忽略右廊封堵与奇偶。ICE4,7可造额外步差，模型含之。

## 左端capture备选的限制

单箱模型可 `WWWDSSAWAASSDSAAA` 到cargo1,3/free2,3 fork1。D后outside3,3，X静态产生cargo1,4/2,3 +free3,4/4,3，右廊外人位置改善，但1,4箱离开x1需pusher站x0墙；叉0后上箱不能横向送右廊，不能把它当作可运输第二箱。root同样指出该边界，故在完整post证明前不建议为此retry。

尚在寻找其他preX或未验证相互作用，不新增海量盲搜、不宣称普通游戏无解。真实JSON为证据，所有静态尾与模型候选明确是假定。

## 新完整候选：旧17后四次A保留不同面向

带face的有限前置枚举：solo357状态/215个首X种子，后续9082状态；未扩大盲搜。首版ICE停止face和X子体face建模有误，已根据实际4-7/4-9 JSON修正：ICE自动微滑保持原face，X子体保父face，不能把分支的移动方向写为face。新枚举找到一个可运输双箱且外人位于右通路侧的构型。进一步发现不必换首次X，可直接沿旧实际17修正。

从旧实测17 `DSXWWWDSSAWWASSDS`，cargo3,3 faceD，外人3,4 faceS。追加 `AAAA`：

|追加步|外人坐标/face|cargo|
|---|---|---|
|A1|2,4 /A|3,3 /A|
|A2|1,4 /A|3,3 /A|
|A3|1,3 /S，左墙转下|3,3 /A|
|A4|2,3 /D，左/下墙转右|3,3 /A|

再X：cargo面A分到3,4/2,3，外人面D分到2,4/3,3。外人3,3在上箱3,4之下且下箱2,3右侧，可以直接D进入右廊。这个双箱坐标与旧20相同，但外人位置和面向不同；仅按箱坐标或忽略face搜索会漏掉正确构型。

第二模型用此postX新initial，6646扩展7036seen找到24方向 `SDSAASSSSSWDSWSSWAAWWWWW`。完整46候选：

`DSXWWWDSSAWWASSDSAAAAXSDSAASSSSSWDSWSSWAAWWWWW`

|postX分段|cargo|free|
|---|---|---|
|SDSAAS 6|3,3 /2,3|1,3 /5,3|
|SSSS 4|7,3 /6,3|5,3 /7,1|
|WDSWSSW 7|7,6 button /7,5|7,2活；另推者7,4死|
|AAWWWWW 7|仍7,6 /7,5|1,1 goal|

尾段没有ICE。中段左人两次S因下墙转D推动链，右人及时下到7,1；之后D因右墙转W推前箱上，S令左人推后箱到7,3，两次上推箱链到按钮。第一次首X+14大部分已有真实证据，新增AAAA/X及完整尾仍由owner分段实测。普通模型只有2976状态时hash未含face，用于普通位置 reachability 不影响，但用于X目标会遗漏不同面向；新枚举已经含face。

## 实际完成闭环

owner正常从4-10未输入初态返回、重入4-9，沿旧已实证前置和新尾，实际46输入/time47 `completed=true`：

`DSXWWWDSSAWWASSDSAAAAXSDSAASSSSSWDSWSSWAAWWWWW`

helper已独立读取主JSON completion。第22 X实际cargo3,4/2,3、free2,4/3,3，全部fork0活；后24方向按6/4/7/7段实测完全匹配。第39态两cargo7,6 button /7,5，free7,2，另一外推者7,4 inactive/ghost1。最后外人1,1覆盖goal，两个cargo仍active/ghost0，门3,1开放。首次ICE额外time已按实际instructions补剩余，未重复整批。

历史旧18、旧20错误X和正常undo1等均保留；最终成功46不把历史试验抹去。主KB由owner同步，helper只保存独立模型及真实报告。
