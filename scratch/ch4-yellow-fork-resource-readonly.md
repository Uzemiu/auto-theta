# Chapter4 黄色叉子：持叉 ENTRY 乘员资源审计

2026-10-04，只读。唯一游戏输入 owner 为 `/root/ch4_1_readonly`；本轮未调用游戏、未写存档、主 JSON 或 canonical KB，未读反射 dump / plugin 实现 / 提示 / 攻略。没有 BFS、没有新快照 JSON。本文使用实际日志、普通 Notebook 和既有机制；候选不是已执行结果。

**当前结论：尚无已验证的 `active + contained ENTRY + Fork>=1` 世界资源前缀。** 现有 4-X 捕获成功先消耗唯一 Fork，普通返回世界又会同时复位容器。正常“撤销进入”值得作为冰滑入场检查点判别，但已有实证支持退回入关前一输入，不能信用它会保留 post-capture 乘员。另有明确额外 Fork `KEY34[56,5]`，它需要先合法穿过闭门；这是真实库存线索，不是已闭合路线。

## 实际事实与文案来源

- `knowledge/achievements.json` 中官方本地 achievement schema 的 Yellow / `ACH_YELLOW` 条件为“分裂一个关卡”，状态仍 locked / unverified。这不是 COL104 自动对话的操作说明。
- `artifacts/slot1-playthrough/chapter4-world.json` **events[195]**：P66[-32,6]，Fork1/key0/ghost0/contained0；COL67 NID104 同格已 inactive。UI 只有“黄色叉子”“获得新的收藏品！”“（有什么用呢）”“确认”。没有明示分裂 ENTRY 的输入或前置。
- **events[207]** 普通 Notebook 10/15「关卡水晶」：不同位置同时进入相加、不同世界线进入叉乘，同位置多个进入形成叠加；另说明自旋同向相斥、异向相吸。`face` 是朝向，日志没有证据将 PLAYER 的朝向直接等同自旋，或把 Entry Color1 / pushable 当作无需捕获即可分裂的权限。
- **events[162]** 普通「分裂」说明向左右出生、受阻时前方 fallback、复制朝向及携带物。实际 **events[241]** 的单 Fork 自由 X 后两人都是 Fork0，故“复制携带物”不能忽略分裂自身消耗。
- **events[155]** 普通「融合」明确不同携带量取最多；F0+F0 不会凭融合恢复 Fork1。普通装箱/叠加文案没有给出“未完成 ENTRY 捕获之后可先留世界”等额外规则。
- **events[343]/[345]/[346]**：world70、P66[-32,5] Fork1/contained0/isSitting=false，Entry29[-32,4]；一次正常 Shift 后输入深度、位置、资源及 contained 状态不变。只排除该场景该输入的作用，不能推广成全局无其他水晶交互。

## 现有捕获与两种返回方式不能混用

M118 的已实测源为 P[-32,4] Fork1、空 4-X[-32,3]。`DAX + 15S + ASSDA` 23 输入正常入 sky，关键实际帧如下。

| 主 world JSON | 世界或关内状态 | Fork / 容器边界 |
|---|---|---|
| events[241] | 两人[-32,3]/[-32,5]，空 Entry[-32,2] | 两人 F0、活、未装箱 |
| events[249] | 单 D 后：两人[-30,-12]/[-32,-12]，Entry[-31,-12] | 两人 F0、contained0；推者停 ICE，不续推 |
| events[250] | 下一 A executed1，随后 busy/input_locked；回执两人[-31,-12]/[-33,-12] | 仅过渡回执，未存稳定 contained1 世界中间帧 |
| events[251] | sky fresh0，P3[6,8] F0 | 正常加载已实证；不称 Yellow 已触发 |
| events[252] | 正常「返回世界」后 world fresh0：P[-31,-12] F1，Entry 复位[-32,4] | 只有一人、未装箱；不是携带内部叉子出关或保留载入口 |

4-X 关内取自身 Fork 后仍 F1 的实际 11 态与 world 返回的 F1 不能相加。关内初态本来 F0，世界 F1 不直接转入关内角色；返回同时清除世界双人及移动水晶部署。

M091（Chapter3）证明**已完成**移动 3-X 可以捕获角色并留在 world，未完成的同构捕获则自动入关。不能据此先信用未完成 4-X 可留世界。该实例内外均 F0，也没有证明 ENTRY cargo-X。

M046 的“撤销进入”有可核历史对照：`chapter2-world.json` **events[140]** 80 输入末 S 到 2-X；**[141]** 普通 refuse fresh0；**[142]** 回 Chapter2，instructions/undo_depth=79，当前 axis0 P[34,19]、time227，另 axis1 time136 仍保留，活人各 F0/contained0。日志未记录该次菜单每个按键，M046 已注明使用正常“撤销进入”；前后帧支持**入关前一输入回退与保留世界历史**，不支持 post-entry 容器或补叉。

## 不同机制的最小候选：冰滑入场后的「撤销进入」

这是**未执行的检查点判别**，不是 Yellow 正例。只有 owner 正常回世界并重新 observe 源符合后才可复用；不要从当前别关现场直接按串。

1. 若回到旧 world70 源 P[-32,5] F1、Entry[-32,4]，先正常 S 到 P[-32,4]/Entry[-32,3]，然后已实测的 `DAX + 15S + ASSDA` 入 4-X。源到入场共24有效方向/X；COL104 已 inactive，不再补叉。
2. sky fresh0 稳定后，立即打开正常暂停菜单，核选项文字“撤销进入”。旧 `4-X.json` **events[9]** 的菜单初选 index0=继续游戏、index1=返回世界、index2=撤销进入；若当时 UI 仍如此，可正常下两次再确认。不进入“获得启示”。
3. 只观察返回的世界 instructions/time、各 PLAYER split/contained/container/active/ghost、Entry 位置与 movingdir；勿接着盲 X。当前菜单是否相同以真实 UI 为准。

区别谓词：

| 返回结果 | 能证明什么 | 对持叉乘员是否有收益 |
|---|---|---|
| 恢复 events249 的相对前态：P[-30,-12]/[-32,-12]，Entry[-31,-12]，两 F0 | M046 的 pre-input 回退也适用于这次 ICE 入关 | 没有，capture 被撤销 |
| 保留入场 A 的某个 world 微拍 / ENTRY 乘员，但 Fork0 | ICE 入关检查点与 plain-entry 有区别 | 仍缺额外 Fork；不能当 Yellow 已达成 |
| 单人 F1、Entry[-32,4] fresh0 | 实际发生了世界重置；须核是否选成“返回世界” | 没有载容器 |
| 活 ENTRY 乘员实际 Fork>=1，且 world 稳定不再自动入关 | 新资源规则；需逐属性和菜单标签核验 | 才构成有价值的新候选源，仍未证明 ENTRY X / 成就 |

已有 M046 使第一结果最有依据；本轮没有声称 UndoEnter 是持叉资源方案。M118 最后一 A 经过 Entry 自身额外 ICE 微拍，因而**回退到输入前还是入场前微拍**是尚可区分的有限问题。即使回退保住容器，也不能凭空给原 F0 补 F1。

## 真实额外 Fork 线索与局部门缺项

本轮最后读到的完整 Chapter4 world 为 **events[357]**，frame11809460，P66[-45,3] F1/key0，time12。它是历史来源帧，不代表 owner 当下仍在世界。

此帧 **KEY34[56,5] active，details.isFork=true**；不是普通钥匙。COL104 inactive、COL12[-68,-17] active/unclassified。

静态只核 KEY 房间：56,5 有 SOLID Floor，四邻中只有南56,4有 Floor；55,5/57,5/56,6缺 Floor。56,4 有 **BUTTONGATE ID3、blockabletrue**。56,1 有普通 BUTTON；未实际单证其配对 ID3，也未给出持续占位或运输源。

因此不同资源域的条件是：先 freeX 得双 F0，若其中一人/其他可合法世界实体能持续开 ID3，另一人可取真实 Fork34 成 F1；无需假设初单人必须先持 F2。但是下列前置均未闭合：到56,1及56,3的合法世界路线、按钮配对与释放时序、取叉后回收控制者与移动 Entry、未完成入口捕获后的可用世界窗口。没有提出盲搬或全世界新 BFS。

## 收束范围

已证资源路径仍缺至少一个环节：**保叉捕获的正常前缀**，或捕获 F0 后补叉并保留世界的正常前缀，或真实可用的 ENTRY 留世界/分裂时机。额外 Fork34 是公开实际库存，UndoEnter 是有旧实证支持的普通菜单探针；二者尚不能拼成已验证正解。本文不排除更远资源、新机制或关卡组合，不将两个相同 Sky 的静态拼图当实际组合/成就，也未复算旧18关 overlay、水平+、西界16A及旧捕获 BFS。
