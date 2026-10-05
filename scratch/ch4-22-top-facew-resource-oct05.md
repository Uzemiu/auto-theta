# 4-22 首cargo5,9后调外人：有限两阶段域（2026-10-05）

已封存本轮，不追加搜索：**cap12000/depth40，expanded12000、seen14664、pending3688、stale818、depthCut0**。按扩展上限截断，队列未穷尽；未得到首cargo5,9，phase1Expanded=0，未命中最终cargo5,9+outside3,9。这不是全关不可能，也不能说旧40147域已覆盖所有合法捕获后的调位。唯一游戏输入者仍是owner，本助手无输入、UI、存档、主知识库或主JSON改写。

## 实际源与新旧等价

actual15公开已实测完整输入 `SSSSSDDDWWDWWDS`：P6,5/Fork2/key2/faceS，五箱初位不动。私有固定复算15接 **`AWWWAWX`**：

| 相对15步 | 输入 | 普通父/分裂结果 |
|---|---|---|
| 1 | A | 5,5/A，F2/key2 |
| 2 | W | 5,6/W |
| 3 | W | 5,7/W |
| 4 | W | 5,8/W |
| 5 | A | 4,8/A |
| 6 | W | 4,9/W |
| 7 | X | 两free3,9与5,9，各F1/key2/W |

此新22现已由owner正常执行。独立只读主JSON `artifacts/slot1-playthrough/4-22.json` **events[60]/frame13777157** 首稳定源，以及重复稳定 **events[81]/frame13836665**：erosion timeline90/time22，完整串 `SSSSSDDDWWDWWDSAWWWAWX`；P88=3,9、P89=5,9，各active/uncontained/F1/key2/ghost0/faceW。空Blue83=4,5；空C4 84=3,7、85=3,6、86=3,5、87=3,8；五物体不动。本文件指保留的实际checkpoint，不根据后续计划猜当前UI位置。

固定核来源关系：

| 源 | 再接串 | 结果；五BOX不动、keys0、locks2047 |
|---|---|---|
| 旧15+`AWWWWAX` | `WD` | 两free3,9/5,9，F1/key2，均faceD |
| 新15+`AWWWAWX` | `AS` | 两free3,9/4,8，F1/key2，facesD/S |

两源可普通相互返回同一几何和库存；后续**仅WASD**时，当前face不会改变下一次普通输入的选择，所以“首X面W”或字符串不同本身不提供新的普通资源域。此等价不推广到下一次X，X仍依face。

单固定模型核新22**立即X**：3,9/W的两孩子为2,9与4,9；5,9/W的两孩子为4,9与6,9。**2,9是真SOLID，1,9才是SPIKE**；6,9裸孩子死，两个4,9孩子融合，末为free2,9/4,9各F0/key2，五箱未动。该第二X只有模型、未在游戏执行，不称新持叉强源，也不建议因本报告做盲probe。

## 本轮真正修改的目标阶段

旧公开 `scratch/ch4-22-top-pair-owner.cjs` 第13行：

`if(s.b.some(b=>b.c)&&!target(s)){lost++;continue;}`

其中target同时要求cargo5,9与outside3,9。因此旧strict子域会剪掉“cargo已经5,9，但外人尚在其他安全位置”的合法候选，未覆盖其后调位。

本次阶段0只允许首次cargo在5,9/F1/key2/ghost0，但**不同时要求outside已在3,9**；保留活outsideF1/key2。阶段1可继续普通移动，再查cargo5,9和outside3,9的最终pair。其它首次cargo仍按parent指定停止，不把此次改动变成任意cargo全解搜索。

局部几何应准确区分：单箱捕获5,9时，推者常结束4,9或5,8；但**两箱链3,9/4,9由2,9向D推**，头箱能到5,9、推者能结束3,9。因此旧同步target并非几何绝对不可能；问题是旧strict剪枝未允许捕获后调位。

五物理BOX保持；禁BOX落x1、row1和3,4指定死角。其余格不自动称可回收，例如空BOX2,9已无普通向右回收所需的安全1,9推者。因此即使将来有模型target命中，仍须逐箱检查具体后续；本轮没有正例，未对这种失去运输能力的库存授予Goal信用。

## 运行范围与计数

脚本 `scratch/ch4-22-top-facew-resource-oct05.cjs`，仅公开初态/实体、公开 `ch4-22-readonly.cjs` 的规则与已有KB。源prefix及证据关系用公开base固定重放；搜索的ordinary planner是私有显式副本，按Wall优先、真实Floor、普通受阻轮转、多BOX链、同步捕获和资源规则复算。没有隐藏实现或反射访问。

阶段内只WASD、不X，empty C4按颜色/格子等价去重，Fork/key/载人类型保留；face在无后续X时忽略。采用best-first，启发倾向row9两箱链与捕头站位；**不声称其首次边界串是全域最短**。不同力、异源同格stack、occupied、Ghost和第一次Lock接触/开锁均停止，不传播。锁边界不是在此宣布普通开锁未知或非法，而是这次保完整key资源部署域的停止范围。

正式命令 `D:/nodejs/node.exe scratch/ch4-22-top-facew-resource-oct05.cjs search` 已直接退出，liveHandle=null。最初调用因公开base未export内部stats，在首态处理就发生TypeError，没有形成有效搜索图；修成私有显式ordinary planner后执行下述唯一正式12000轮。无新增快照JSON、无重复旧40147或升cap。

| 本次指标 | 结果 |
|---|---:|
| cap / depth | 12000 / 40 |
| 有效队列展开 | 12000（best-first可因更短路径重开同状态） |
| seen唯一状态键 | 14664 |
| pending heap项 | 3688（可能仍含过期项，非3688个唯一未展开状态） |
| 已跳过stale项 | 818 |
| depthCut | 0 |
| phase1Expanded / firstcargo5,9 / finalpair | 0 / 未命中 / 未命中 |
| 指定BOX陷格拒绝 | 2379 |
| 活人/Fork/key库存损失拒绝 | 2626 |
| Lock接触停止 | 1455 |
| force / stack边界 | 14 / 1 |
| 非目标首次cargo停止 | 2 |

ghost/occupied本轮未遇对应停止窗口，不能据此否定该机制。由于没有首cargo5,9，新增的“后调outside”阶段尚未进入；不能把这次有限未命中说成已排除全部修正stage路径。

## 所遇短边界（均未由本助手实际操作）

下表串都从实际22起算；是本次best-first首遇到的对应短窗口，不是全图最短保证。

| 边界 / 尾串 | 末步前准确模型姿态与末动作 |
|---|---|
| force：`WSDSSSAA`（8） | 前7步有效：Blue4,4，四C4仍3,5..8；两个free4,5与5,4，F1/key2。末A，右者A推Blue至3,4；上者A先遇3,5箱且其西2,5Wall，转S推Blue至4,3。是同一Blue的A/S正交force；私有模型停，不信用publicbase选的第一叶为真实axis。 |
| stack：`WSASDSAAAWWWDDSDWASA`（20） | 前19步有效：Blue4,4；顶C4原87已在2,9，其余3,5/6/7；free3,8与5,4，均F1/key2。末A，左上free遇2,8Wall转S，将3,7/6/5链下移，原底86到3,4；右free将Blue4,4左推3,4。两独立空箱同刻同格，停在叠加边界。**空87在2,9已难普通右回收，3,4叠体又处指定死角**，故该窗口并非五箱可用的完整运输候选。 |
| Lock：`WSASADDSD`（9） | 前8：Blue4,4、free4,8与6,4，四C4未动。D会使后一free入Lock7,4，公开base模型耗key2→1/open相应锁（locks2047→2046）。本域保存key2故停止；不是Goal尾。 |
| 非目标首cargo：`WSASASDSAAAWWDDSSWWWAW`（22） | 四原C4链同时上移，得到cargo3,9F1/key2和outside3,5F1/key2。这是已有旧actual34四箱链捕获结构的较长复现；依本轮“首cargo5,9”目标拒绝，不当新资源或强Goal候选。 |

各边界前串已用公开base单串复算；没有继续展开force/stack的未知状态，没有实际新增Goal。此报告到此封存。owner/parent另研究“任意非3,9首次cargo且可回收库存”是独立后续任务，本助手不并发重复该新域。
