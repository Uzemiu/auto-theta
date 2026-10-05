# 4-20 左侧首次Blue捕获：单轮有限资源审计

2026-10-05，readonly `/root/ch3_37_cargo_revisit_oct03`，唯一游戏输入者 `/root/ch4_1_readonly`。本轮已结束，无live handle，未操作游戏/存档/主KB/主JSON，不读取隐藏实现或提示。

## 范围与结果

这是改变首次捕获位置的新谓词，不是扩大旧26尾598图或旧70固定尾。源为实际4 `SSSS` 后：P4,6 F3/S，C4 BOX57=3,3空、Blue BOX58=4,3空；全部Fork已拾。实际源参考主 `4-20.json` events[1] frame6153620及events[33] frame12581088，time4。

目标：solo普通部署→恰首次自由X→仅普通，**首次Blue捕获在2,3或3,3**，BluecargoF2和outsideF2均活、ghost0，空C4不沉row1且至少一方向有合法普通推箱请求。后项只作墙/站位/推链静态筛查，不假设外人已可实际走到推者格；正例仍须逐箱可操作审计。

`scratch/ch4-20-first-blue-left-oct05.cjs` 是公开 `ch4-20-blue-resource-readonly.cjs` 的私有step副本，未改原脚本。一次固定 **cap12000 / 相对depth45** 已返回exit0：

| 指标 | 数值 |
|---|---:|
| expanded / seen / pending | 4342 / 4342 / 0 |
| depthCut | 2 |
| 命中 | 0 |
| force拒绝 / stack / occupied / Ghost | 3 / 0 / 0 / 0 |
| 错位置首次Blue捕获剪 | 1 |
| 不可再变空的C4捕获剪 | 3 |
| 资源/死亡等其他剪 | 1356 |

未触及cap，已见队列为空；但有两态在depth45截止，**不能称无限普通域穷尽**。无新Goal候选，不抬cap。

严格首捕获限定意味着：先在旧5,3捕获Blue再运输到左侧不计这个目标；剩余阶段没有X，C4先装人也不能重新变空，因此该类状态停止。保持X前1活F3、X后2活F2，禁止Ghost、独立stack或force后的未知传播。普通墙优先/箱链/裸SPIKE/人物同格融合按公开模型；没有特殊墙能力或循环假设。

## 最短有区分力的不同边界：双F2对Blue相反推力

完整模型串（21）：

`SSSSAASSSAAAAWWXWWWDD`

前20固定重放有效，末D被模型的force边界拒绝。pre20：空C4=2,4（SPIKE），空Blue=4,3；两个F2裸活人3,3/5,3，均faceD。末D：

- 左人3,3向D推Blue4,3→5,3，自身请求4,3。
- 右人5,3先D撞Wall6,3，转W撞Wall5,4，再A推Blue4,3→3,3，自身请求4,3。
- 同一Blue受到D/A相反请求；尚未实际执行或传播为模型叶。

其他两个force拒绝pre坐标同构，只face/输入历史不同：全串 `SSSSAASSSAAAAWWXWWWDSWD` 与 `SSSSAASSSAAAAWWXDSAWWDD`。不能把三次窗口当三个独立冲突或已获三条线。

按既有相反force经验，赢家/输家可能导致各叶只剩一个F2outside；这不满足BluecargoF2+outsideF2库存目标。C4仍空置于2,4SPIKE，后续要合法保护/外推动站位；不能只见两叉就推荐盲走为完整解。该窗口仅说明新传播边界，owner没有被要求回退现实际26执行。

## 旧firstHit被剪的明确依据

唯一普通首Blue捕获（旧已实际22来源）前态：emptyC4=3,3、emptyBlue=4,3，两freeF2=2,3/W与5,2/W。末D左人推双箱链C4→4,3、Blue→5,3，另一人D受墙后W进入5,3捕获Blue。后态Bluecargo5,3 F2/W、outside3,3 F2/D、emptyC4 4,3。这是右端5,3源，未误记为2,3/3,3新捕获。

本次未产生新的可执行左侧资源正前缀，有限阴性不排除普通force传播、再X、不同Fork保留/捕获类型或其他关卡机制的正常路线。实际26及全部历史不变；主KB更新由owner负责。
