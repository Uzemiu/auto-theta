# 4-11 大象：只读推演与真实闭环（2026-10-04）

唯一游戏输入 owner：`resume_slot1_oct03`。本 helper 仅读普通证据、地图与主 JSON，并写自己 scratch 模型/报告；未输入游戏、修改存档/主KB、调用提示或读取隐藏实现。

## 真实完成

`artifacts/slot1-playthrough/4-11.json` completion 已独立核 `completed=true`。81记录操作包含80移动/分裂输入与1次T切线；0 undo、0 retry。axis0 time58，cargo1,7 /2,7；axis1 time62，cargo6,7 /7,7。每线两cargo均active/ghost0、fork0，三个外人均在末端地刺死亡。root另核实际save108/5、elephant3。

完整记录：

`WWWDXSAAASXWWDDSSDDAXAAADDWDDSAAASDSDSDWASAWADSDSAAWWWAWWATASAAWAAWWAWDDSSSWWWWWD`

## 实图与资源

P1,1，三fork1,2 /1,3 /1,4，单Color4BOX4,3。GOAL1,7 /2,7 /6,7 /7,7。y6除4,6外主要为刺；3,7 /5,7为刺，4,7安全。实体 Wall 覆盖同格tile，未按截图索引推测坐标。

失败X与普通四面等待不同：面对1,1的S向X，left/right/front分别2,1 /0,1 /1,0均Wall，但身后1,2可走；该玩家依然在原地消耗一叉，另一人正常分裂。此结构实际验证，不能把它写成普通移动四面封闭。

## 分段真实路线

| 有效位置 | 动作 | 实际结果 |
|---|---|---|
| 5 | `WWWDX` | 三叉先取；2,4面D X得到free2,5 /3,4，均fork2，箱4,3 |
| 10 | `SAAAS` | 两free1,1 faceS /5,1 faceD，均fork2 |
| 11 | `X` | 1,1失败分裂原地fork1；另一人分裂5,2 /6,1 fork1，共三free异奇偶 |
| 19 | `WWDDSSDD` | cargo6,3 fork1，free5,3 /7,2 fork1；持叉接收者因右墙转A被推进箱 |
| 20 | `A` | cargo6,3/free4,3 /6,2都faceA |
| 21 | `X` | 两cargo6,2 /6,4；四free4,2 /4,4 /6,1 /6,3，全fork0且活 |
| 30 | `AAADDWDDS` | 先把下箱推6,3，再从6,5 S推竖链下退；两cargo6,2 /6,3，四free7,2 /5,4 /7,1 /6,4 |
| 39 | `AAASDSDSD` | 两cargo3,2 /6,3，四free7,3 /6,2 /7,2 /6,1 |
| 40 | `W` | 7,3北墙阻后转A与6,2的直接W对6,3箱正交冲突，分两世界线 |

第21 X 中新外人进入原盒格6,3，盒格同刻腾空，实际证实该插入保持外部状态，未被错误捕获。箱内X双cargo与外部X四free无重叠、无刺死亡。

第40冲突 axis0 A支：cargo3,2 /5,3；axis1 W支：cargo3,2 /6,4。每支外人6,3 /7,3 /6,2。两cargo都继承，而参与推力的两外人只保留一人；另两外人保留。

axis0 左18：`ASAWADSDSAAWWWAWWA`。

| 分段 | cargo | 外人 |
|---|---|---|
| ASAW 4 | 3,2 /4,4 | 4,3 /5,3 /4,2 |
| ADSDSAA 7 | 3,2 /4,4 | 3,1 /4,1 /5,2 |
| WWW 3 | 3,5 /4,5 | 3,4 /4,4 /5,5 |
| AWWA 4 | 1,7 /2,7两个左GOAL | 外人死2,6 /3,6 /3,7 |

然后T正常切axis1，右22：`ASAAWAAWWAWDDSSSWWWWWD`。

| 分段 | cargo | 外人 |
|---|---|---|
| ASAA 4 | 3,2 /6,4 | 4,1 /4,2 /3,1 |
| WAAWWAWDD 9 | 5,5 /6,4 | 5,3 /4,5 /5,4 |
| SSSWWW 6 | 5,5 /6,5 | 6,4 /4,5 /5,4 |
| WWD 3 | 6,7 /7,7两个右GOAL | 外人死6,6 /5,6 /5,7 |

两尾无X、无ICE、无新冲突/合并。资源 helper 独立普通模型重放完整冲突前置和两尾，随后owner分段实测全部匹配。

## 模型范围与有限搜索

- `scratch/ch4-11-readonly.cjs`：单箱已知普通移动、失败X、fork角色X与安全单cargo克隆pose。失败X前置93展开/221seen；安全克隆pose1835/3333。
- `scratch/ch4-11-post-readonly.cjs`：两fork0活cargo与外人，普通多箱链；冲突仅模拟已验证的同Color4单箱多方向推力，并拒绝未知多箱冲突。
- 解冻6,4箱短9尾779展开/1302seen；由实际30找10尾正交冲突1466展开。
- 普通尾直接GOAL BFS的6000边界未命中某些初构型，未宣称无解。随后按终点接力几何用加权定向staging：左9374展开/14688seen，右direct1784/2862；所得路线均完整重放，再独立核，再真实验证。
- 早先把row5边柱货物不可横运的构型作为两线候选失败；保留限制，不推广全关不可解。

4-11已闭环，继续4-12；4-10仍是attempted，不能因本关成功把4-10计作完成。
