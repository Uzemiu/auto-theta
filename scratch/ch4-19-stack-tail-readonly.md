# 4-19 实际20叠体：普通入光域与新推力窗口

2026-10-04，只读助手 `/root/ch3_37_cargo_revisit_oct03`，唯一游戏输入 owner `/root/ch4_1_readonly`。未输入游戏/改存档或 canonical/主JSON，未读隐藏实现、反射 dump、plugin、提示或攻略。模型只用主JSON与公开已实证机制。

**当前关卡已由不同的三载人箱路线实际41完成；本报告20/27叠体域是历史边界。** 2026-10-05本助手只读主JSON events[112/113]（frame12877609/12877692）及completion/run，独立核完整41串 `WDAXDDWWWSAWWWWWWDSSSSDDWWSAWWWWWDWSWXDDD`，time41、completed=true。cargo49/48/51分别在5/6/7,6，均active/ghost0/contained1/height1/F0；outside44死4,6，三Prism45/46/47均traversed/testCompleted=true、lighten=false。owner报告本次0undo、旧22undo；root核SaveSlot1 completed118。没有重跑叠体域或据旧有限阴性排除新路线。

历史20异源叠箱及27同叠体正交力两相关叶已实际成功，当时仍未完成Goal。一轮新的 ordinary-only 首次入光模型已结束，没有入光正尾；其 A/W 推力窗口已由owner正常实测。本助手只读主JSON events[37..39]核验，未增加预算或重跑旧782/12000图。下文原预26与条件末W保留历史推理标签，实际闭环以本段和追加段为准。

## 实际源

主 `artifacts/slot1-playthrough/4-19.json` **events[32]**，frame12118638，instructions/time20，单axis0，completed=false。完整前缀：

```text
WDAXDDWWWSAWWSDDWDAX
```

|实体|位置|实际属性|
|---|---|---|
|C4 BOX42|3,3|active，height1，contained0/container-1|
|Blue BOX43|3,3|active，height2，contained1/container42|
|cargo48|3,3|active/ghost0/F0/A，height2，contained1/container42|
|C4 BOX50 / cargo51|3,5|active/ghost0/F0/A，height1，contained1/container50|
|outside44|5,2|active/ghost0/F0/A，height1，uncontained|
|outside49|4,3|active/ghost0/F0/A，height1，uncontained|

两cargo与两outside共**4活角色**，3物理BOX组成2个运动叠体/单箱组。这里不是M126的两个载箱乘员融合：本次同格是一载C4孩子与一空Blue，实际仅一个乘员在两层叠体中。两个初Fork均已inactive；没有追加X库存。

Goal6,8同PRISM45，侧PRISM46/47在5,8/7,8。三Prism pushable/blockable，但普通推离没有合法站位或落点：row9各邻为Wall，横向整体5/6/7,8被4/8,8真Wall夹住；不能因pushable字段便假设可把源搬开。旧中央beam21未完成依然是实际边界，不称一列足够或三列必要。

## 新模型与运行范围

私有 `scratch/ch4-19-stack-tail-readonly.cjs` 从真实20归组，不使用游戏实现。普通WASD的左右fallback、墙/缺Floor、混合箱/Prism链、全局cargo朝向与裸人SPIKE死亡重写为有限几何模型；两层按M052作为刚性运动组，保留真实成员、cargo height/container来源。基础地形读取复用公开 `ch4-19-readonly.cjs`，**不是独立地形引擎**。

本轮目标只查两层叠体首次到column5/6/7、row6/7的潜在南向光路，不调用隐藏光学完成算法，也不在远处目标自动分线。无X、新stack、Ghost复活、occupied-cargo吞人或force-conflict传播。后几项发生时明确停止转移。允许空Prism正常推，只受真实Floor/Wall限制；没有BOX row1剪枝，没有固定整侧分工。

一次执行：

```text
D:/nodejs/node.exe scratch/ch4-19-stack-tail-readonly.cjs search
```

同步exit0，**liveHandle=null**；预设cap2000/depth35，实际 **expanded647 / seen647 / pending0 / depthCut0**，该受限域闭合。叠体最高y5，未抵达候选光路。2/3/4活角色节点分别7/210/430；拒绝forceConflict两次，未出现newOverlap/occupiedCapture/newStackCapture/ghostCapture转移。没有扩大cap。

这是**普通刚性组且未传播force的模型范围**。不能证明本关无解、真实叠体不可能入光或所有资源配置无解。运行时载height2 cargo到SPIKE的保护仍是类比边界，后续真实27的A胜叶已直接验证本例protected/ghost0；不同高度受力/观测/新capture仍需按具体实际后态另建源。

## 2026-10-05追加：实际27推力闭环

完整 `WDAXDDWWWSAWWSDDWDAXSSWDAAW` 已由owner正常实测，主JSON **events[37]** frame12280434及稳定 **[38]/[39]**；两叶time27/completedfalse，没有新光路观测。

- axis0 A胜：BOX42底h1与BOX43上h2一并到SPIKE2,3；cargo48仍active/ghost0/F0/h2/contained1/container42。winner44在3,3活F0/A；loser49仍3,2、inactive/maskedoff1。前箱50/51仍3,5活F0，cargo51保faceA。
- axis1 W胜：同整叠到3,4；cargo48仍active/ghost0/F0/h2/container42。winner49在3,3活F0/W；loser44仍4,3、inactive/maskedoff1。前箱50/51仍3,5活F0，cargo51仍faceA。

本例验证两层普通推力相关为**2叶**，不是两箱各独立4叶；以及height2载人叠体被普通推到该SPIKE时仍ghost0。实际冲突后旁观cargo48/51的face不能一概按global W改写：48在两支仍A，51仍A，赢家free49才faceW；原有限普通模型的全局cargo面向不用于推断真实冲突后的朝向。每叶2cargo+1free，仍未完成。此前647域没有传播force，不从它冒称排除此新实际后态。

## 短运输为何不作Goal建议

从20接安全 `SAW`：叠体42/43由3,3北推3,4，另cargo50/51仍3,5；outside49=3,3、44=4,2。再W把两组链送叠体3,5/前cargo3,6，outsides3,4/4,3。

前cargo北3,7是真Wall。此时3,4的外人再W无法北推整链，会转A到2,4 SPIKE而死亡；横向搬前cargo3,6向右需推者2,6，现外人都在箱列下方，不能把3,5已占据箱格当裸人自由通过。初始直接W或A会把叠体西推2,3，向右回收需站1,3Wall；上下回收所需2,2/2,4又为SPIKE。以上解释具体模型瓶颈，不是全机制无解论证，不建议只为SAW弱片段消耗输入。

## 待实际的7输入推力探针

root已选择该窗口交owner；本助手没有发输入。20接：

```text
SSWDAAW
```

前6 `SSWDAA` 全程不移动BOX/Prism、不踩刺、不装箱：

|局部输入|outside44|outside49|两BOX组|
|---|---|---|---|
|0实际20|5,2/A|4,3/A|stack3,3；cargo50=3,5|
|1 S|5,1/S|4,2/S|不动，cargo全局S|
|2 S|6,1/D（南墙fallback）|4,1/S|不动，cargo全局S|
|3 W|6,2/W|4,2/W|不动，cargo全局W|
|4 D|6,3/W（右7,2Wall转W）|5,2/D|不动，cargo全局D|
|5 A|5,3/A|4,2/A|不动，cargo全局A|
|6 A：拟总26|4,3/A|3,2/A|stack42+43/cargo48=3,3 F0/A/h2；cargo50/51=3,5 F0/A/h1|

拟第27单W有两个合法请求：

- P44[4,3]北4,4Wall，转A请求推3,3叠体向2,3（SPIKE），自身拟到3,3。
- P49[3,2]直接W请求推3,3叠体向3,4（SOLID），自身也拟到3,3。
- C450/cargo51[3,5]此步不在推链中，仅globalfaceW，作为旁观cargo；原Prism不动。

M052支持普通推整叠，M042有正交推力分线，M128警告同一链力相关；本模型把该叠体归作一个受力对象并在冲突前停止。**真实两层force关系/叶数、赢家/输家mask、cargo height/container与SPIKE下ghost/active必须取实际帧，不能先算4叶或观测叶。** 若按整叠两请求仲裁，A胜条件stack2,3、44胜/49 masked；W胜条件stack3,4、49胜/44 masked；这只是request几何的解释，尚未执行。两条件都不是已闭Goal尾。

## 光学与下一来源边界

M084/M109支持一载人叠体进入真实光路后各颜色支继承乘员与旁观者；M126的远处Goal不测左叠体反例不能用来跳过本关入光运输。当前20没有测量，所以不把静态两层算已新增世界线；也不把两个移动组当完整三支光网络覆盖。

root另核“旧9部署→一次全体X→普通捕空Blue”为第三cargo的不同谓词，本助手未重复该域。旧9仅两F1演员、两初Fork都已消耗，不能凭重新capture在X前生成第三F1。是否能在X后两free利用双箱链捕获空Blue，须其具体合法新前缀及角色库存，不被本次647普通叠体域排除。
