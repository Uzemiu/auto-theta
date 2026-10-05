# 4-20 C4-first25＋AX：普通域等价审计与未实测force边界

状态：**固定审计结束，取消重复搜索；没有完整Goal尾。** 2026-10-05。本助手全程只读公开JSON/模型，只写自有scratch，零游戏输入/UI/存档/canonical修改；唯一游戏输入owner为 `/root/ch4_1_readonly`。

## 已有actual与新MODEL27

真实C4-first25前缀：`SSSSSSDDSSSSAAWAASAXDDDWW`。主 `artifacts/slot1-playthrough/4-20.json` 有多次正常重建/撤销后的同源帧，最近精确同串匹配为events[67]/frame13476337/time25；更早events[13]/frame6366695等历史保持。已证cargoC4=2,3/F2/W，outside=4,3/F2/A，独立空Blue=3,3。

本轮仅MODEL固定接 `AX`：

| 步 | cargo与空箱 | 自由人 |
|---|---|---|
| actual25源 | C4cargo2,3/F2/W；Blue3,3空 | 4,3/F2/A |
| MODEL26 A | C4面A、位置不变 | Blue左推须连推C4至1,3真Wall，A受阻，转S到4,2/F2/S |
| MODEL27 X | C4cargo2,2和2,4各F1/A/ghost0；Blue3,3空 | 5,2和3,2各F1/S；两人活，无fusion/裸死 |

MODEL27四活，3个独立body格，无stack/force。本轮没有让owner执行这两个输入。

## source等价：5000没有启动

root指出旧 `ch4-20-sdax-blue-left-readonly.md/.cjs` 已有actual25接 `SDAX` 的普通捕获域，本轮固定核确认：

| 来源 | C4cargo | emptyBlue | free | 初始face区别 |
|---|---|---|---|---|
| actual25＋旧SDAX | 2,2/2,4，均F1 | 3,3 | 4,3/3,2，均F1 | cargo A；free A/A |
| 上行再接SD | 2,2/2,4，均F1 | 3,3 | **5,2/3,2**，均F1 | cargo D；free D/W |
| actual25＋新AX | 2,2/2,4，均F1 | 3,3 | **5,2/3,2**，均F1 | cargo A；free S/S |

旧SDAX+SD与新AX的orig、Color、BOX位置、是否cargo、Fork、ghost、free位置全部一致。区别是初始face。又分别固定核W、A、S、D四种下一输入，所有返回状态/分支（含face）均一致：ordinary先全局重设cargo面向，自由人也按本输入和真实阻挡重新设面。所以**AX后普通捕获域是旧SDAX ordinary域的已可达子域，不能仅凭较短字符串叫新资源域。**

本轮拟议cap5000/depth40在启动前撤销：**expanded=0，seen=0，pending=0，depthCut=0，liveHandle=null**。只有固定字符串审计，没有新BFS，也没有扩旧12000。

旧SDAX一轮的真实范围仍为expanded12000/seen12979/pending979/depthCut0，截断而非穷尽。旧部署过滤cargo x1/y1/5,3，严格保四活F1；此处不把它升级为所有force/融合/X后运输的全局否定。

初始face若立刻X会影响自由人出生，不能把上表等价误用于即时X：固定新AXX为3个C4cargoF0在2,1/2,3/2,5＋emptyBlue3,3，以及free4,2/5,1/2,2共3人；旧SDAXSDX则同cargo/Blue格、free5,3/5,1/2,2/4,2共4人。两者都未Goal，2,1箱是普通北回收受y0Wall限制的底行负担。这只核出生库存，没有运行其尾图。

## 旧SDAXSAW的具体未传播机制边界

从actual25源固定 `SDAXSA`（MODEL31），pre-W为：

- 两cargoC4仍2,2/2,4，各F1；空Blue3,3。
- 两free在2,1和3,2，各F1。
- 下一W：2,1者直推下cargo向北；3,2者向北推Blue3,3被3,4真Wall挡，转A推同一只下cargo向西。

完整MODEL32冲突串：`SSSSSSDDSSSSAAWAASAXDDDWWSDAXSAW`。M042等已有普通方向冲突可作模型依据，但**本具体持叉载箱的force/货物face/输家masked字段仍未正常实测**；以下只按公开multiStep的两个条件叶，不给真实axis编号：

| 条件胜向 | 两cargoF1/ghost0 | 幸存freeF1 | emptyBlue |
|---|---|---|---|
| A | 1,2 / 2,4，cargo全局面W | 2,2/A | 3,3 |
| W | 2,3 / 2,4，cargo全局面W | 2,2/W | 3,3 |

每叶2cargo＋1free，3活F1/3个body。不是原四活资源，不能在旧严格保四活图里自动继续；不是两叶各保两free。A叶1,2的cargo普通不可移动，虽仍能利用Fork单侧迁移，不能当作任意可回收缓冲。

## 每叶一方向＋最后X的固定预算核

只对上述两个constructed叶各核WX、AX、SX、DX，共8个短串；没有尾搜索。计数是固定模型最后态，不是实机分裂数：

| force叶 | 短尾 | body / cargo / free | Goal1,10 |
|---|---|---|---|
| A | WX | 3 / 2 / 1 | 未到 |
| A | AX | 4 / 3 / 1（含1,1死角cargo） | 未到 |
| A | SX | 4 / 3 / 1（含1,1死角cargo） | 未到 |
| A | DX | 5 / 4 / 2（含1,1死角cargo） | 未到 |
| W | WX | 3 / 2 / 1 | 未到 |
| W | AX | 5 / 4 / 1 | 未到 |
| W | SX | 4 / 3 / 2 | 未到 |
| W | DX | 5 / 4 / 2 | 未到 |

所有剩余Fork都为0。最大5body的W叶DX为C4cargo2,2/2,3/2,4/2,5＋emptyBlue3,3，twofree3,1/4,2；不是已验证六BOX col2 y3..8＋twofree2,2/4,3的23尾前置。旧六箱尾只是充分构型，不是全局必要数量，不能从这里仅5body推断所有解失败。

本轮没有给上述force叶闭合从实际源到Goal的完整输入串，也没有请求owner仅为了分线数盲重建32。普通force继承、同源融合、空箱捕获等模型均来自公开scratch/实证；新的叠层/Ghost/highFork occupied或其它观测若出现仍应停边界，不能假造库存。

## 结论与可复核文件

AX的新普通首Blue捕获5000域取消，原因是源等价，非预算阴性。只得到已可审计的AX出生、等价关系和conditional force叶库存，目前没有值得直接实际部署的全Goal候选。不重复旧SDAX12000、Blue-first26的598、first-Blue-left4342或SDWSX8000。

私有脚本 `ch4-20-c4-first-ax-equivalence-oct05.cjs` 只有fixed串/两叶检查，复用公开 `ch4-20-readonly.cjs`，不声称独立物理引擎。直接运行不会搜索：

```powershell
D:/nodejs/node.exe scratch/ch4-20-c4-first-ax-equivalence-oct05.cjs
```

全部actual标签仅指历史25源；27/32/后续叶是模型。没有新逐步JSON、没有遗留进程。
