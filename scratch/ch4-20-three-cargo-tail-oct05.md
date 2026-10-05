# 4-20 新三载人箱资源：实际26，有限尾域已封

2026-10-05，只读助手 `/root/ch3_37_cargo_revisit_oct03`。唯一输入者 `/root/ch4_1_readonly`。本文只记录公开观测和私有模型，不修改游戏、存档、主知识库或主JSON。

## 当前事实与模型源

**26资源已实际成立，后续尾仍是模型；本轮没有完整Goal正例。** 主 `artifacts/slot1-playthrough/4-20.json` events[47]（frame12591791、time26）完整实际串为：

`SSSSSSDDSSSSAAWWSXAWWDSDAX`

| 实体 | 位置 | 资源/状态 |
|---|---|---|
| C4 BOX57 / cargo61 | 3,3 | F1、A、active、ghost0、contained1、height1 |
| Blue BOX58 / cargo60 | 5,2 | F1、A、active、ghost0、contained1、height1 |
| 同源 Blue BOX62 / cargo63 | 4,3 | F1、A、active、ghost0、contained1、height1 |
| outside59 | 3,1 | F1、A、active、ghost0、uncontained |

三Fork已取，无新Fork/ICE/门/锁。Goal为1,10。本私有模型将BOX62标作58同源，不猜未来出生ID。原模型26 `SSSSAASSSAAAAWWWSXAWWDSDAX` 的前15输入与实际不同，但终端几何/库存相同；实际26也已单串固定重放有效。模型pre25：空C4 4,3，Blue载人5,3 F2/A，外人3,2 F2/A。

脚本 `scratch/ch4-20-three-cargo-tail-oct05.cjs` 复制公开 `ch4-20-blue-resource-readonly.cjs` 的几何与step，补已证M116安全1+1载人与裸人融合。它是公开模型的私有副本，不能称独立游戏引擎。

## 直接X与最短双外人资源

实际26后直接X（尚未实际执行）的固定重放结果：C4载人箱3,2/2,3；Blue载人箱5,1/5,3/4,2/3,3，均F0/ghost0。外人北child3,2与C4 child同格，模型融合；仅另一外人2,1存活。**六物理箱不等于六箱加两外人。**

最短 `AX`（实际26后2输入，模型）先让外人从3,1到2,1；随后X得到上述六箱和外人2,2/1,1，八个活角色。它仍没有运输闭环：Blue5,1落row1，上推者5,0是真Wall，不能普通北移。若横移至6,1或7,1，上推者仍在row0 Wall；不能把底箱当可回收上方库存。

## 一次有限尾域实际运行

运行 `node scratch/ch4-20-three-cargo-tail-oct05.cjs search` 已返回exit0，无live handle。固定cap6000、相对depth45；**expanded598 / seen598 / pending0 / depthCut0**，该定义域队列已空，没有扩大预算。

- 起点为上述四F1实际26资源。
- X前只WASD，保恰三活cargoF1与一活outsideF1；全体恰一次最后X后只WASD。
- row1不排除；同源箱相遇按既有融合保max库存；普通箱链、墙优先、裸SPIKE死亡按公开模型处理。
- 新异源stack、不同方向force、未证高Fork occupied及Ghost传播均止于边界，不假补后续。全部叉耗尽且外人全消失的非Goal态无控制，不再展开。
- 搜寻任意活人/载人到Goal1,10，或严格旧条件六载人箱col2 y3..8加外人2,2/4,3。不把这个旧充分条件当全局必要。

结果：两个目标均未命中，max cargo箱y=5。统计：moves2458，force拒绝4次，异源stack拒绝17次，occupied0，Ghost0；X前失库存剪5次，无控制剪54次。状态hash忽略F0 face（未来只有普通输入），保持Fork角色的face、箱同源标签和颜色。此阴性只适用于以上资源保持/传播限制，**不是4-20全局无解**。

## 最短不同机制边界：26+WWWDX

没有给输入者盲走建议；此处供未来选择单动作机制probe。`WWWD` 四普通输入固定有效，逐态如下，所有角色仍F1/ghost0：

| 相对输入 | 外人 | 三箱 |
|---|---|---|
| W1 | 3,2 / W | 原位，各cargo faceW |
| W2 | 2,2 / A | 原位，各cargo faceW |
| W3 | 2,3 / W | 原位，各cargo faceW |
| D4 | 3,3 / D | C4 4,3；Blue5,2/5,3，各cargo faceD |

下一X的模型出生请求：C4向S到4,2、fallback前D到5,3；Blue5,2向N到5,3、S到5,1；Blue5,3的N5,4与前6,3均Wall，仅S到5,2。外人3,3向S到3,2、fallback前D到4,3，均安全。故**C4与Blue两个载人child同刻在5,3交汇**，模型记录异源stack边界并停止，未计层数/实际活cargo数量/分线/Goal。前态不虚设空箱，也不含裸SPIKE出生。M126已证其他场景两独立载人箱叠合会只留一个活cargo，本例仍需实际容器/height/masked审计；不能把出生前五箱载人库存直接全部信用为活库存。

另三个已见普通force窗口与其他stack窗口都未传播，不重复扩图。若继续，只能明确采用实际stack或force后的新seed/规则。

## 旧23输入条件尾复核

仅constructed源：六载人箱col2 y3..8全F0，两个outside2,2与4,3。`WWSDDDSDDWWWWAAAWWWWWAA`（23）固定重放有效：首WW把前箱送2,10，首推者死2,4；另一人经右廊到3,10，最后A把前箱推Goal1,10并自死2,10，活cargo仍保护于Goal。实际26尚未部署这个源，directX或AX都不可直接粘接；六箱与两外人的数量不是完成证据。

本轮已封，不重跑598图、不提高cap。主知识库及游戏输入均由owner负责。
