# 4-6 蝴蝶只读分析

2026-10-03；唯一输入 owner resume_slot1_oct03。没有游戏输入、提示、攻略、隐藏实现、存档或主知识库编辑。

## 实际地图与按钮核验

runtime popout，size8×8；初始P4,4，Color4 BOX4,5，叉4,3/7,1；门6,1；BUTTON1,1与2,1；目标2,7/6,7。y6除4,6墙外均刺，初箱不能由普通活人从北向南搬往底部。

```text
8 #########
7 #sG###Gs#
6 #sss#sss#
5 #...B...#
4 #...P...#
3 #...f...#
2 ##..#..##
1 #bb.#.gf#
0 #########
```

owner5 `SASSA` 单人2,1/fork1，gate6,1实际blockable=false；再A到1,1同样false，两个button各自OR开同门，不根据缺失BUTTON details.ID臆测AND。

owner保留测试而不undo：追加DWSX，time10 `SASSAADWSX`，外free3,1/1,1均fork0，左者1,1压button，gate开；BOX4,5原地、右叉7,1未取。

## 末端几何改进

只需fork1 cargo+onefree，不用外人也保叉或先分裂两外推者。把cargo送BOX6,5、free6,4；**W**推载BOX至6,6(SPIKE)，外人6,5。**A**让外人5,5并使cargo面A；**X**上下复制BOX至6,5及goal6,7，两个cargo均fork0，外人5,5原地而不会被下侧箱捕获。

一个cargo已占右目标，外人 **SDDW** 绕7,5，再 **AAAASAWW** 把另一cargo6,5横推2,5、上推经2,6刺至goal2,7，自己在最终2,6刺死亡。完整尾 **WAXSDDWAAAASAWW** 15，其中盒内X需真实核验。

## 保叉捕获前置

模型 scratch/ch4-6-readonly.cjs 从真实10态起。动态OR按钮/门占用保持，右叉7,1拾取，closedgate7,1完全夹困等待、左转移动、同刻装箱和cargo运输；不实现X。专用剪枝初空BOX维持y5且x2..6，避免未经装箱先推空箱到顶部死槽。有限定向10110扩展10357seen找到36方向候选：

`WWDSSAAAASAWWWWAAAADDWDWAWSAAWDDDDSD`

| 从10后分段 | BOX | H（将持叉） /F（无叉） |
|---|---|---|
|WWDSSAAAASA 11|4,5|7,1 fork1（门闭等待1次） /2,1 button（刚重新开门）|
|WWWW 4|4,5|6,4 fork1 /2,5|
|AAAADDWDWAW 11|2,5|cargo2,5 fork1 /3,5|
|SAAWDDDDSD 10|6,5|cargo6,5 fork1 /6,4|

首段前10将H送7,1取叉，F离2,1至3,1导致门闭；第11A F回2,1开门，H本动作仍因前态gateclosed在7,1全夹困等待，改变两人相对奇偶。接下来WWWW让H经过6,1占门释放，再到6,4。

捕获分段末W：H2,4上行2,5，F4,5因4,6墙转A推BOX3,5→2,5，两者同刻汇入而装叉1。后段SAAW绕BOX左侧至1,5，DDDD横运至6,5，SD绕至6,4待向上推动。

候选全61有效输入：

`SASSAADWSXWWDSSAAAASAWWWWAAAADDWDWAWSAAWDDDDSDWAXSDDWAAAASAWW`

在真实completion核验前只作候选，不写成完成。初按钮测试已包含最终路径，不需要额外undo/retry。

## 实际完成闭环

已独立读取主JSON completion：**completed=true/time61**，完整61输入与上述候选相同，0undo/0retry。

全部前置和分段实际匹配：26方向捕获叉1角色；36方向运cargo6,5；WAX后time49由刺上BOX6,6沿cargo面A的上下两侧复制为BOX6,5/6,7，两cargo仍active/ghost0/fork0，外人5,5无叉原地没有装入新箱。末12 **SDDWAAAASAWW** 将下侧cargo移至左goal2,7，外人2,6落刺inactive/ghost1。

最终两BOX和两active contained PLAYER分别2,7/6,7、ghost0，单条世界线。按钮单独各OR开门的6步测试全部整合入成功路线，不需要撤销。此为先把一个cargo复制到目标，再让同一外推者交付另一cargo的真实证据，不宣称需要两外推者或未验证多线冲突。

helper只写自身scratch，owner负责主知识库和后续关卡。
