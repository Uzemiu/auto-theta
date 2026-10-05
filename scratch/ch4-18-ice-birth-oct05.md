# 4-18 实际56之后的X出生ICE边界：一次固定源审计已封

2026-10-05，readonly `/root/ch3_37_cargo_revisit_oct03`；当前唯一游戏输入者 `/root/ch4_1_readonly`。本报告只使用公开主JSON、解法、机制与scratch模型。没有任何游戏/UI输入、存档或canonical改写、提示、攻略、隐藏实现/反射dump读取。

**当前实际63出生ICE与71正交交汇已闭环，尚无完整Goal正例。** 原5000/7677/pending2677/depth28图不重跑、不扩大。最初三条窗口审计及286停止域保留为历史；下文追加的新规则域只传播实际71的唯一ICE、D/W、无箱交汇实例，不泛化任意ICE交错。

## 当前实际63/70/71闭环（2026-10-05）

本助手独立只读主JSON：

- **events[74] frame13052737，63有效输入/time68**：`56+ASDDSSX` 真实五活。cargo78在C2 BOX73=4,6，rear cargo81/BOX80=5,6，新cargo83/BOX82=3,5，均F0/S/ghost0/contained1/height1；outside79=8,4、84=9,2，均F0/S/key0活。空C4/Blue保持2,2/2,3。已确认本关自由出生ICE9,3沿S滑至9,2。
- **events[76] frame13075968，70/time76**：63后`SSAWWDS`，outside79=8,3/S、84=9,2/S，均F0/key0/ghost0活，三cargo原位/S。
- **events[77]单D receipt**：busy/input_locked，79与84首微拍同9,3，仍player_count5；这不是稳定终态，不补发D。
- **events[78] frame13076100，71/time78**：稳定79=9,3/D（10,3Wall止滑），84=9,4/W，均active/F0/key0/ghost0/uncontained，无融合；三cargo3,5/4,6/5,6各D/F0/ghost0，五活单叶未完成。

因此原“最短未知movingOverlap”已成为上述具体实例的正常实证。只允许同一次ordinary D输入中，两个F0/key0自由人从8,3沿D与9,2沿W同时进唯一ICE9,3，且9,3/9,4无箱参与、10,3真Wall；各自继续运动到不同终点。**没有宣称任意正交交汇、任意钥匙/叉或其他ICE碰撞都不合并。**

## 实际56 source与已有机制

主 `artifacts/slot1-playthrough/4-18.json` events[44/45]直接56帧，最新同态events[51] frame5500072：56有效输入/time60、未完成。

| 活实体 | 实际位置/库存 |
|---|---|
| Color2 BOX73 / cargo78 | 3,6，F1/A，active、ghost0、contained1、height1 |
| 同源 Color2 BOX80 / cargo81 | 4,6，F0/A，active、ghost0、contained1、height1 |
| outside79 | 5,6，F1/A、key0、ghost0、uncontained |
| emptyC4 BOX74 / emptyBlue BOX75 | 2,2 / 2,3 |

Lock9,5已inactive；全部Fork已取。两个Gate5,2/6,2关闭。唯一ICE9,3，Wall10,3覆盖边界。Goal6/7/8/9,9。

出生ICE不是没有真实证据的游戏机制：

- **M033，2-9**：在5,6朝D分裂，出生两支沿竖ICE续滑到5,11/5,1，face仍D；时间29→34，instructions只一X。分裂运动方向与保留face必须分开。
- **M108补充，4-15**：cargo4,6朝A的X，向S child生ICE4,5，续滑4,4并推动C4到4,3；cargo仍活contained/F1/ghost0。这是载箱出生ICE的真实有限实例。
- **4-18本身 events[7/9/11]的7/8/9帧**（frame5114097/5124923/5126992）：第7 D人物到9,3ICE但10,3真Wall使其止滑，不自动转向；第9 W从9,2经过9,3滑到9,4，time多一tick。可核普通ICE地形与止滑，本关尚未实际执行56后的X。
- **M035**：推者入ICE接触格后停、被推箱继续滑。不能把纯自由出生的续滑规则误推广为推者继续滑。

## 至多三条具体MODEL窗口

前两条是旧报告保存的ICE拒绝窗口；第三条只是固定短串构造的横向墙止滑对照，不声称它曾在旧8次拒绝中被记录。

| 从56追加 | X前外人 / 载人朝向 | X后外人稳定位置 | 预期稳定time |
|---|---|---|---:|
| `ASDDSSX`（7） | 9,4 F1/S；两cargo faceS | 8,4及9,2，均F0/S | 68 |
| `ASDDSSADX`（9） | 9,4 F1/D；两cargo faceD | 9,5及9,2，均F0/D | 70 |
| `ASDDSSASX`（9） | 8,3 F1/S；两cargo faceS | 7,3及9,3，均F0/S | 69 |

所有三条X后箱构型相同：emptyC4 2,2、emptyBlue2,3；三个同源Color2载人箱3,5/4,6/5,6，各F0/ghost0。旧rear4,6被侧出生推到5,6；另一cargo出生4,6及fallback3,5。没有Box出生ICE、叠箱或同源融合。

第一条最短普通前置逐输入：A受左双箱链+2,6Wall与南5,5Wall阻，转D到6,6；S受6,5Wall转D到7,6；DD到8,6/9,6；SS经已打开Lock9,5到9,4。前62/time66外人仍F1/S，cargo3,6F1/S和rear4,6F0/S，空箱未动。单63 X首微拍自由child分别8,4（出生方向A）与9,3（出生方向S）；后者额外一微拍S到普通9,2，前者等待。稳定time68，五活角色、五物理箱。**出生方向S续滑，face仍S；不能把最后输入X当cargo朝向X。**

第二条9,3 child仍沿S到9,2，另一child9,5安全，父faceD保留。第三条9,3 child方向D，被10,3Wall挡住，因此停9,3、不在本次自动左转、没有额外移动tick。

历史计划把第一条单X作为本关公开规则对照；现已由owner实际执行并按上方events[74]确认63。另两条固定窗口仍只MODEL，未执行。原出生模型保留父id标签79用于来源追踪，两free同标签不意味着实际有两个同ID实体；新规则域直接读取实际63的79/84等真实ID作为seed。

## 最小规则实现与一次固定后态普通尾

脚本 `scratch/ch4-18-ice-birth-oct05.cjs` 复制公开 `ch4-18-readonly.cjs` 的基础geometry/普通step，读取实际56实体为源；是私有公开模型副本，不是独立游戏引擎。

只补：**非推箱free X child生唯一ICE9,3后，按出生方向走向一个无箱普通邻格，或真Wall止滑，保留face**。遇出生BoxICE、继续冰链、推箱、同格运动或SPIKE均继续作为边界，不补隐藏物理。X后只WASD，允许一般已有箱链/保护运输；force、异源stack、occupied、Ghost、Box入ICE和移动中重叠停止。按钮7单独→Gate6,2仍是模型条件映射，prefix不经过这些gate；完整尾若依赖它必须实际核。

仅从第一条63后态运行一次 `search`，固定cap3000/depth35，exit0、无live handle：

| 指标 | 数值 |
|---|---:|
| expanded / seen / pending | 286 / 286 / 0 |
| depthCut | 0 |
| Goal mask | 仅0 |
| firstUpperFree / firstUpperCargo | 均无（y≥9 / y≥8） |
| movingOverlap停止 | 2 |
| force / stack / occupied / Ghost / BoxICE | 全0 |

队列已空，但只在上述停止边界范围闭合；不称4-18或actual56全局无解、不扩cap，不信用互斥终态union。此域没有任何firstGoal/上区载箱正例。

## 历史最短交汇窗口（现已实际71验证）

原模型63再追加 `SSAWWDSD`（8），前7有效，末D曾停止。首微拍两free同刻到9,3ICE，分别处于D与W运动；当时不猜融合或交错。原三个载箱仍3,5/4,6/5,6，左两空箱不变。此串现已实际71闭环并接入局部规则，详见顶部。

旧普通M036有限迎面交错/同向追尾不能独自替代这次正交实证。另一旧窗口63后`SSWWDAAAAASDDSSASSWD`（20）固定重放时，两个free角色顺序交换，但同样从8,3/D与9,2/W到9,3，无箱参与/F0/key0；可在同一受限新规则域传播。它不是额外实际输入；原prefaceW不同不影响下一ordinary D的全局起步选择。

## actual71局部规则的新一次普通队列

私有脚本保留旧关闭交汇开关的`search`历史模式；新`cross-fixed`单串读实际63/70/71并验证两窗口，`cross-search`只从实际63 seed开始。只在顶部完全满足的D/W条件下跳过同微拍融合，让两名外人各自完成已证后续微拍；其他movingOverlap仍停止，BoxICE/Ghost/stack/force/occupied边界不放宽。

`cross-fixed`复算`SSAWWDSD`稳定79=9,3/D、84=9,4/W及三cargo原位D，吻合events[78]；更长窗口成员顺序交换后同样匹配已证几何。

一次`cross-search`固定 **cap3000 / depth35** 已exit0、无live handle：**expanded286 / seen286 / pending0 / depthCut0**。实际D/W交汇条件传播2次；movingOverlap拒绝0，force/stack/occupied/Ghost/BoxICE全0。Goal mask仍仅0，firstUpperFree(y≥9)/firstUpperCargo(y≥8)都无。

计数恰与旧286停止域相同，不能把它写成“未接入交汇”：两条交汇边现已成功生成、固定重放也闭合，但未产生新增Goal或上区资源。没有新增未传播窗口，未提高cap、未重跑旧5000域。不把当前actual71或所有初态资源判为全局不可解。

当前结论：实际63/71五活资源与正交交汇明确成立，加入这条精确规则后仍没有本固定源普通完成尾。本轮报告已封，游戏及canonical同步继续由owner负责。
