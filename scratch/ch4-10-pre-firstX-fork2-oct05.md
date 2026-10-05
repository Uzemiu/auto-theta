# 4-10 snail：首个X之前，单自由人取两叉

状态：**MODEL POSITIVE，尚未在正常游戏实测。** 2026-10-05，唯一输入owner为 `/root/ch4_1_readonly`。本助手只读真实初态、公开机制与自有公开模型，只写本CJS/MD；未调用游戏、桥接、UI、存档、提示、隐藏实现或主知识库。

本轮命中17步：`WDDDSSAAAAWWAWWWW`。结束为单活自由人P60在1,5，Fork2/key0/faceW/ghost0/contained0；全程没有X。箱57=1,1，箱58=6,3，箱59=7,3，均Color4。KEY49仍active，Lock7,4仍闭。**不是完整解，也不能直接把三只物理箱记作三只当前可推箱。**

## 来源与旧域区别

- 真实来源：`artifacts/slot1-playthrough/4-10.json` 的 `initial`，runtime `snail`；单自由人P60=1,2/F0/S/key0，BOX57=4,2、58=3,3、59=4,3；Fork55=2,1、Fork56=1,5，KEY49=3,6。
- 核过旧 `ch4-10-readonly.md`、`ch4-10-resource-readonly.md`、`ch4-10-revisit-readonly.md`、首次stack与staggered Fork报告。这些既有资源域主要从actual8/19/23/32/52（已经用过首X）出发；未找到同初态、单人、纯WASD取Fork2的已结束结果。
- 新域仅普通WASD，不排BOX x1、row1或其它普通死角；目标只有单活free Fork>=2。没有要求三箱全部可回收，也没有用旧禁底行域的阴性结论。
- 私有脚本 `scratch/ch4-10-pre-firstX-fork2-oct05.cjs` 复用公开 `ch4-10-fork-stagger-tail-oct05.cjs` 的普通step，并从真实initial另建source。固定复算使用同一基础step，不声称独立物理引擎。
- 真实Wall优先于同格tiles，缺Floor不可走；逐箱推链、普通反弹顺序、旧帧按钮/门状态、已占门维持、普通KEY/Fork拾取依已有公开规则。snail无ICE，本串也不触及SPIKE、Lock、capture、force、stack或Ghost边界。

## 唯一一次有界搜索

一次BFS，cap6000 / depth45，首次Fork2正例即停：

| 项目 | 数值 |
|---|---:|
| expanded | 2459 |
| seen | 2716 |
| pending | 257 |
| depthCut | 0 |
| lostSingleFree | 670 |
| rejected null/unknown boundary | 0 |
| nonFree/Ghost rejection | 0 |
| duplicated transitions | 6447 |

命中17输入，固定重放valid/target均true。队列未穷尽，未触cap，未增加预算；无运行中进程或session handle（`liveHandle=null`）。BFS几何去重忽略三个相同Color4箱的标签与自由人朝向，但重放保原ID；纯ordinary动作不读初始face，Fork2目标也不要求特定face。这个17步为该有限普通模型的首个最短命中，不升级为实际最短证明。

## 17步逐态与按钮时序

输入分组：`WDDD | SSAAAA | WWA | WWWW`（4+6+3+4）。表中未变的箱仍在上一行位置；全部人物均活/free/ghost0。

| 输入号/动作 | P60位置、face、Fork | BOX57 | BOX58 / BOX59 | 关键条件 |
|---|---|---|---|---|
| 0 | 1,2 S F0 | 4,2 | 3,3 / 4,3 | 四门闭，Lock7,4闭，三拾物active |
| 1 W | 1,3 W F0 | 4,2 | 3,3 / 4,3 | 无拾物 |
| 2 D | 2,3 D F0 | 4,2 | 3,3 / 4,3 | 无拾物 |
| 3 D | 3,3 D F0 | 4,2 | 4,3 / 5,3 | 横向推双箱链 |
| 4 D | 4,3 D F0 | 4,2 | 5,3 / 6,3 | 双链再右移 |
| 5 S | 5,3 D F0 | 4,2 | 6,3 / 7,3 | S推57需要落4,1，ID1门旧闭；转D推双链 |
| 6 S | 5,2 S F0 | 4,2 | 6,3 / 7,3 | 未踩6,2SPIKE |
| 7 A | 4,2 A F0 | 3,2 | 6,3 / 7,3 | 推57左移 |
| 8 A | 3,2 A F0 | 2,2 | 6,3 / 7,3 | 推57左移 |
| 9 A | 2,2 A F0 | 1,2 | 6,3 / 7,3 | 推57左移，尚未压按钮 |
| 10 A | 2,1 S F1 | 1,2 | 6,3 / 7,3 | 57左推目的0,2是Wall，转S取首Fork55 |
| 11 W | 2,2 W F1 | 1,2 | 6,3 / 7,3 | KEY49/Fork56仍active |
| 12 W | 2,3 W F1 | 1,2 | 6,3 / 7,3 | 四门仍闭 |
| 13 A | 1,3 A F1 | 1,2 | 6,3 / 7,3 | 为下推57就位 |
| 14 W | 1,2 S F1 | **1,1** | 6,3 / 7,3 | W撞闭Gate1,4，A撞Wall0,3，S推57压Button1,1；末态ID1两门开 |
| 15 W | 1,3 W F1 | 1,1 | 6,3 / 7,3 | 57继续压Button1,1 |
| 16 W | 1,4 W F1 | 1,1 | 6,3 / 7,3 | Gate1,4在动作开始前已开，安全穿过 |
| 17 W | **1,5 W F2** | 1,1 | 6,3 / 7,3 | 取Fork56，单自由人持两叉，未X |

本串按钮配对只用已证的ID1：Button1,1打开Gate1,4/4,1。ID0按钮6,1未被任何角色或箱压住，Gate3,4/4,5保持闭；不把占一个门推广为同组全开。14不依赖同动作新按钮提前放行：14只把BOX57落按钮，16才进入已打开的Gate1,4。因此不与M112旧门快照的失败实例冲突。KEY3,6全程未到，key始终0；Lock7,4也未到，始终闭。

## 三箱的具体代价

| BOX | 终点 | 当前普通可推性 |
|---|---|---|
| 57 | 1,1 / Button1,1 | 不可普通回收。北推者须站1,0Wall，东推者须站0,1Wall，西/南目的亦Wall；永久压ID1，但失去一个普通运输body |
| 58 | 6,3 | 当前无合法普通推向。北6,4Wall；南推者6,4Wall；西推者7,3被59占；向东推双链会撞8,3Wall |
| 59 | 7,3 | 当前无合法普通推向。东目的/西推者8,3Wall；北目的7,4为闭Lock；南推者需7,4闭Lock |

因此终态是**3只active物理箱，当前0只可普通推动**。57底角是明确普通不可逆损失；58/59不能直接称永久废箱：若后来通过合法资源路线开Lock7,4，59可由7,4向S推至7,2，随后可从7,3向A推58至5,3。该回收只是条件几何，本17串没有取得KEY或提供开Lock前缀；不把它计入已实现可用库存。

在实际完成任何X之前仍可普通离开上袋：17后`SS`到1,3/F2/S，永久按钮保证Gate1,4可回穿。单在1,5 faceW立即X会被左右0,5/2,5墙约束，不能不核方位便声称两名F1出生。两个F1的新预算与剩余箱/钥匙路线仍需后续正常实测与规划，本文只证纯普通取Fork2的模型前置。

## 备用与复核命令

先手构并固定过21步 `SDWWDDDSAAWASSSAWAWWW`，同Fork2/箱/门终态；之后仅运行上述一次BFS，17步取代它，未另搜其尾。

可只重放17步（不会启动搜索）：

```powershell
D:/nodejs/node.exe scratch/ch4-10-pre-firstX-fork2-oct05.cjs replay WDDDSSAAAAWWAWWWW
```

本轮没有任何实际输入，不能写入关卡完成、实际拾叉进度或全局不可解结论。若owner选择验证，可先核10的首叉、14的箱压按钮，再核17；实际箱或门字段有差异时以公开帧修正模型。
