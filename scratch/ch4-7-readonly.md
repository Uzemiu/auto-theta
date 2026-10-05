# 4-7 兔子只读分析

2026-10-03；唯一游戏输入owner resume_slot1_oct03。只读主JSON、普通机制小模型、自有scratch；禁止提示、外部攻略、隐藏实现、存档修改与主KB编辑。

## 真实地图与取星修正

Runtime rabbit，size8×8；P4,2，Color4 BOX3,3，叉2,2/6,2，ICE **5,3**（不是6,3），goal7,6。COLLECTION NID10位于 **4,5并与Wall4,5同格**。普通WWW不能取星，真实第三W撞墙转A至3,4，收藏仍active。

```text
8 #########
7 #...#sss#
6 #.#..ssG#
5 #.#.#s###
4 #.......#
3 #..B.i..#
2 #.f.P.f.#
1 #.......#
0 #########
```

图中墙4,5与收藏同格以Wall优先显示，不能让收藏字符覆盖墙而误判通路。星10记录未取；本次优先正常关卡目标，未宣称取星。箱链能穿两格刺：载箱4,6+5,6，free3,6，DD使前箱到7,6、后箱6,6，free在5,6刺死亡。

## 双叉与一次ICE的真实前置

从实际WWW后的3,4，owner追加 **ASSDDDDWX** 9，完整12有效 `WWWASSDDDDWX`。单人先取2,2/6,2双叉到6,3面W，真实6,3为SOLID不滑；X左枝落ICE5,3，再滑到4,3，右枝7,3停。最终time13、12instructions，BOX3,3、双free4,3/7,3均fork1、faceW且不同奇偶。已独立读取主JSON实际事件。

## 单箱preX有限模型

scratch/ch4-7-readonly.cjs 从上述真实12态起，不再允许玩家或箱进入ICE5,3（候选只走SOLID，因此不用不确定的中途滑动结算），只模拟正常左转、单箱推动、同刻捕获和箱内运输。15k扩展上限，在13486扩展16475seen找到14方向：

**SDDAAAWWWAAWWS**

| 后续分段 | BOX | free /第二fork1角色 |
|---|---|---|
|SDDAAA 6|3,3|3,2 /4,4，均fork1|
|WWW 3|3,6|3,5 free /cargo3,6 fork1|
|AAWWS 5|3,6|1,4面S fork1 /cargo3,6面S fork1|

WWW的首W：3,2角色上推BOX3,3→3,4；4,4角色撞4,5墙转A到3,4，同刻被装箱、叉1保留。后WW运输cargo至3,6。AAWWS将外人从3,5绕到1,4并面S；cargo收到末S面下。

## 双箱复制与后段候选（owner独立模型）

单X：cargo3,6面S右4,6有效、左2,6墙、前3,5有效，产生载箱4,6/3,5；外人1,4面S右2,4有效、左0,4墙、前1,3有效，产生两free2,4/1,3。所有fork应消耗0。

owner独立21方向候选 **AWWWDSSADWDSSSSDWWWDD**，scratch/ch4-7-chain-readonly.py，10009扩展11783seen。把下cargo3,5向下/横向移至5,4；一free由5,2上行ICE5,3自动推进到5,4并推BOX5,5，再W把BOX送5,6、自己死5,5；另free到3,6，最后DD推4,6+5,6串联至6,6/7,6，自己死5,6而前cargo覆盖目标。

总48有效候选：已有12 +preX14 +X1 +后21。两个自动ICE滑动额外time不等于instruction。后段与单X尚须实际核验，所有模型为候选而非完成证据；星10不因目标完成自动记取得。

## 实际完成闭环

已独立读取主JSON completion：**completed=true/time50**，有效instructions48字，0undo/0retry：

`WWWASSDDDDWXSDDAAAWWWAAWWSXAWWWDSSADWDSSSSDWWWDD`

preX14全部匹配，单X实际形成cargo4,6/3,5与free2,4/1,3，均fork0。owner后段21全部匹配，两次ICE自动滑动贡献额外time；后段WWW批次遇ICE只执行了2个W，owner核45instructions/time47后补最后WDD，未盲目重发整个批次。

最终BOX/cargo分别6,6和goal7,6，两cargo active/ghost0；两外推者分别5,5、5,6 inactive/ghost1。完成目标的同时COLLECTION NID10仍active于Wall4,5，**星10未取**，留待后续合法机制或组合探索，不将关卡完成当作取星证据。

本helper独立14前置模型及报告均在自有scratch，owner的链模型独立文件未被覆盖；主KB由owner负责。
