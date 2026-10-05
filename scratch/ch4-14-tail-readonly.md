# 4-14 金字塔：非对称条件家族与17候选末段只读审计

2026-10-04。助手 `/root/ch3_37_cargo_revisit_oct03`；唯一游戏输入owner `/root/resume_slot1_oct03`，SaveSlot1。只读 `artifacts/slot1-playthrough/4-14.json` 普通initial与已有机制，有限重放两条给定普通串、静态核两代X；未输入游戏、读写save、修改主KB，未用提示、攻略或隐藏实现。未做完整路线BFS，未生成逐步JSON。

## 实际初态与适用机制

runtime pyramid，time0，BOX45 Color4/cargo49在4,6，cargo `contained=1/container=45/split=3/ghost=0/active=true/faceS`；free48在4,1，叉0。两空Color3 BOX47在3,3、BOX46在5,3。

六个GOAL为3,6/5,6/4,5/2,7/4,7/6,7。SPIKE1,7/2,6/3,5/3,7/4,4/4,6/5,5/5,7/6,6/7,7。1,5/7,5是真Wall；3,8/5,8/2,8/4,8/6,8也是真Wall。始终以Wall实体优先，不把SPIKE当分裂阻挡。

载箱两有效侧复制沿M098；受阻侧front fallback沿M011/M101；载箱分裂推开空Color3箱沿4-8已实测M102。root补充的本关actual2与普通自动教学M107：同源复制箱交汇融合为height1，保留一活BOX/cargo、另一inactive，叉量取max而非相加；该证据由root提供，本助手未独立操作该试验。此同源融合不能替代独立箱的叠体规则。

## 非对称条件起点：普通前置通过，有限尾范围不足

root条件：初始cargo先面S单X得到两cargo3,6/5,6 Fork2；free叉0仍4,1。给定普通 `AWWWW` 在观察模型中全部有效：free先3,1，再3,2，推Color3 BOX47到3,4/3,5/3,6；末W同推箱链将左cargo到3,7，自己落3,5刺死亡。末态两活cargo3,7/5,6，叉2/faceW；空Color3 BOX47在3,6、BOX46仍5,3。首X在本助手模型中作为明确条件代换，不将其称实测；普通五动作由 `stack-cargo-readonly.cjs` 有限重放，未搜索。

仅考虑无外人后“统一转朝向→X→统一转朝向→X”的4×4静态家族：

| 首X朝向 | 首代候选cargo位置（均叉1） | 第二代目标2,7的结构约束 |
|---|---|---|
| W或S | 2,7/4,7/4,6/6,6 | 2,7上的parent末X至少有有效侧/前方，要离开；其余三个parent不在2,7的出生邻格 |
| A | 3,6/2,7/5,5/5,7 | 下侧向3,6可按M102推空BOX到3,5，北3,8Wall改front2,7；末X后同样不能保留或再生2,7 |
| D | 3,6/4,7/5,5/5,7 | 北3,8Wall改front4,7；首代无人位于2,7或它的有效出生邻格 |

2,7的相邻1,7/3,7/2,6都是裸SPIKE、2,8是真Wall。位于2,7的cargo朝W/S有两个非墙侧；朝A/D虽北侧受墙，另一侧2,6或front1,7/3,7仍有效。因此不能把该parent原地保留为目标覆盖。这个有限静态家族没有给出六目标完整尾。

第二代某些朝向会让相邻cargo、Color3箱或同刻新箱互相干涉；本报告没有任意套用vacated-cargo格，也未硬合并重叠容器。以上仅记录给定无外人起点及连续两代静态目标形成的边界，不排除普通中间运输、别的起点、复捕获、推力冲突或合法组合。root给出新完整候选后，本助手停止额外16家族枚举与搜索。

## 新17候选：前13独立普通重放通过

主helper/root给定完整候选：`SWWWSSAAWWWWAXWXX`（17）。前13为 `SWWWSSAAWWWWA`。

从实际initial在普通观察模型中重放前13，全部有效：cargo/BOX45仍4,6，Fork3、faceA；Blue BOX47/46到3,5/5,5；free48在3,3，Fork0、faceS。模型不实现通用cargoX，余四动作明确按已证机制和本关几何静态审计，等待owner正常实测。

## 末XWXX的六目标形成

| 输入数/动作 | 条件静态结果 |
|---|---|
| 14，X | cargo4,6 faceA两侧4,5/4,7均有效，生成两cargo Fork2；free3,3叉0不响应 |
| 15，W | 两cargo仅改faceW；free3,3→3,4安全；Blue仍3,5/5,5 |
| 16，X | 下cargo4,5左右复制到3,5/5,5，同时按M102将两Blue各推至2,5/6,5；上cargo4,7复制到3,7/5,7。四cargo均Fork1/faceW，无本次交汇 |
| 17，X | 下左cargo3,5左侧Blue2,5背后1,5Wall而不可推，fallback前3,6；右侧4,5有效。下右cargo5,5右侧Blue6,5背后7,5Wall而不可推，fallback前5,6；左侧4,5有效。上两cargo分别生2,7/4,7、4,7/6,7 |

最后八个出生请求只在4,5与4,7发生两两同源交汇；它们均来自初BOX45/cargo49，叉量都降为0。按root已actual确认的M107，各交汇可融合为一活箱/人，不引入新世界线、不叠成独立来源多层箱，也不相加叉量。六个独立有效位置恰为3,6/5,6/4,5/2,7/4,7/6,7，覆盖全部GOAL。外free保持3,4 Fork0，不响应两次X；没有需要借同刻腾出的旧cargo格作为出生点，也没有把同源融合外推成独立箱重叠。

这是一条已由本助手独立支持的完整17候选；普通前13通过有限模型，末四动作由M098/M102及root提供的actual M107有限静态核对。尚未收到本候选的真实completed回执时不计通关。本报告和可靠结果已发root/owner；本助手停止新增搜索，实际完成与save计数由owner/root核。
