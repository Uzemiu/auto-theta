# 4-3 井字棋只读分析

2026-10-03；唯一输入 owner resume_slot1_oct03。没有游戏输入、提示、攻略、隐藏实现、存档写入或主知识库编辑。

## 实际地图

Runtime sharp，size8×8，PLAYER2,2，叉6,2 /2,6，Color4 BOX6,6，GOAL4,4；仅外边墙，内井字为地刺：

```text
8 #########
7 #.......#
6 #.fs.sB.#
5 #.sssss.#
4 #..sGs..#
3 #.sssss.#
2 #.Ps.sf.#
1 #.......#
0 #########
```

这里没有4-2的内墙三向X失败陷阱。两叉分两名角色先后取得更有利：第一X产生两fork0，只一人拾第二叉后，另一fork0在下次X中原地。无需先收集两叉再一起花掉。

## 已尝试前置的限制

owner真实有效19串 `SDDDDWDXWWWWWWAAASWX` 最后叉耗尽，三free1,7 /4,7 /3,7，BOX6,6不动。三人的奇偶为even/odd/even。固定三fork0普通方向、必须保三alive、不建未知Color4冲突的模型，在24方向深度内仅242见过状态，无cargo；不是游戏全局无解证明。

普通undo最后X后，叉1持者2,7/叉0持者4,7，BOX6,6。目标X捕获须叉0接收者4,6、叉1持者6,6面S、BOX5,6。固定此两人标签、保两人alive、无X前置模型24深度内163状态未到该目标。所有负搜索都有模型和额外保活限制，不作为游戏无解结论。

## 关键新构型：交换取叉顺序（待实测）

owner提出的X捕获几何成立：BOX5,6，fork0接收者4,6原地，fork1持者6,6面S。X的左枝进入5,6并把BOX推到4,6，同时接收者不响应X留4,6，形成cargo；左枝自己落5,6刺死亡，右枝7,6活。随后单外人 **WAAASS**，经7,7→4,7，再下推BOX4,6→4,5→goal4,4，自己最后死4,5。

从initial改先左叉，8输入 **AWWWWDWX**：P到2,6拾左叉、W至2,7，X产生两个free1,7 /3,7 fork0。保留右叉6,2。

之后22方向 **WAAAAAASSSSSSWDWWWWAWS**：

| 后续步 | BOX | F（无叉） / H（待取右叉） |
|---|---|---|
|0|6,6|1,7 /3,7|
|7 WAAAAAA|6,6|2,1 /1,2|
|13 SSSSSS|6,6|7,2 /6,1|
|14 W|6,6|7,3 /6,2（拾右叉，split1）|
|15 D|6,6|7,4 /7,2|
|19 WWWW|6,6|6,7 /7,6|
|20 A|5,6|5,7 /6,6|
|21 W|5,6|4,7 /6,7|
|22 S|5,6|4,6 fork0 /6,6 fork1，面S|

该前置小模型仅197扩展232见过状态。明确模拟拾右叉，状态哈希包含角色fork数，不把标签交换状态误合并。之后X尚需真实单步验证，尤其推力已产生再出生角色落刺死亡、同时原地接收者被装箱。沿M018/M058/M059推导，但以实际结果为准。

模型 scratch/ch4-3-readonly.cjs 只实现普通方向（含右叉拾取）和既有箱人移动，不实现X；前置8和最终X分别由owner实测。候选全37有效输入，不提前写完成。

## 实际完成闭环

已独立读取4-3主JSON completion：**completed=true**，time37，有效instructions共37字：

`AWWWWDWXWAAAAAASSSSSSWDWWWWAWSXWAAASS`

events11：30态BOX5,6/F4,6 fork0/H6,6 fork1真实匹配。

events12：31X真实BOX4,6，接收者active、contained1、ghost0；新右枝7,6active，新左推者5,6inactive。此步命令动作实际执行，但owner因记录辅助调用file参数错误没保存当时动作回执，未重复发送X，而用后续完整state/instructions补证。明确证据来源是实时state观察。

events14及completion：末尾WAAASS实际全部匹配，BOX和cargo均4,4、active/ghost0；外推者4,5inactive，另一出生推者5,6inactive，单条世界线。修改取叉顺序后保fork1的侧向推箱捕获成功，不是箱内X复制或普通方向全叉耗尽后捕获。

owner负责主知识库、进度与4-4；只读helper已完成本关推演与证据核验。
