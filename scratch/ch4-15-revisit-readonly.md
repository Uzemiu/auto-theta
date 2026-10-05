# 4-15 回访只读分析

仅使用实际关卡观测、通用已证机制和自有模型。没有游戏输入、提示、攻略、隐藏实现、存档修改或主知识库写入。输入 owner 为 `resume_slot1_oct03`。

## 新资源顺序与真实前置

旧域是 solo 先取两叉再 X。本次改为先取底部一叉，再 X 成两名 fork0 外人，然后利用双箱链捕获与 ICE 取另外两叉。旧域有限失败不覆盖这一顺序。

完整 25 输入：`AAAWXSAWWDDSSWSSSSSWASAWW`。新模型在 12,477 个展开、16,729 个已见状态时找到此候选。owner 已逐段实测；独立读取主 JSON 的第 25 态与模型一致：

- Color3 Blue BOX49 / cargo51 在 4,6，active、contained、ghost0、Fork2、faceW。
- 空 Color4 BOX48 在 4,4；外人50 在 4,3，Fork0。
- 三叉均已取。有效输入 25，time26，ICE 产生一额外 tick。

关键第 24 W：双箱链向北，Blue4,3→4,4，右侧人5,4的 W 撞5,5墙后转 A 进入4,4，被 Blue 捕获为活 cargo。第 25 W 再推链，Blue 经 ICE4,5 滑至4,6，已装箱的人依次取冰叉与刺叉，保持 ghost0。

## 当前待验证机制

第 26 单 X 已实测并独立读取主 JSON：原 Blue BOX49/cargo51 在3,6，新 Blue BOX52/cargo53 在5,6，两者 Color3、active、contained、ghost0、Fork1、faceW；外人50仍4,3，空 Color4仍4,4。有效输入26、time27，无dialog。这确认本例 Color3 活 cargo 可以 X 复制容器。

`XWX` 已由 owner 实测至第28输入，独立 JSON 复核：首次 X 得 Blue cargo3,6 /5,6 Fork1；W 将空 Color4 经 ICE 送至4,6，外人到4,4；再次 X 的两名内向子体对中央 Color4 发起相反推力，实际形成两条线。第28稳定态 time30，无 input lock。

- axis0：空 Color4 3,6，活 Blue cargo51/53/57 在2,6 /4,6 /6,6，Fork0；外人50在4,4。
- axis1：空 Color4 5,6，活 Blue cargo51/55/57 在2,6 /4,6 /6,6，Fork0；外人50在4,4。
- 每支另一中央新子体 masked；3名 cargo 及一名外人活。此为容器内 X 侧向推力冲突的本关直接证据，父线目标计数仍未知。

每条实际子线都有 Blue cargo2,6 /4,6 /6,6 Fork0、外人4,4；一条空 Color4 在5,6，另一条在3,6。普通模型每侧三目标搜索都在 1,091 个状态后穷尽（深度上限45，禁止底行箱、不含再X/新冲突/堆叠），未找到侧三目标尾。这仅是给定子态的受限结果。

## 两条侧外目标条件尾

两条 20 步尾已由完整普通移动/ICE 模型逐步 replay 通过；它们各覆盖侧外两个目标，不能独立称为完整解。实际 axis0 对应右尾，axis1 对应左尾。

| 条件子态 | 尾 | 结果 |
| --- | --- | --- |
| 空 Color4 5,6，三个 Blue cargo2/4/6,6，外人4,4 | `DDWDWAADSSAAAAWWSAWW` | cargo1,8 /2,7 /4,6；空 Color4 3,6；外人死1,7 |
| 空 Color4 3,6，同样三个 cargo 与外人 | `AAWAWDDASSDDDDWWSDWW` | cargo4,6 /6,7 /7,8；空 Color4 5,6；外人死7,7 |

左尾分段：`DDWDW` 后外人7,6；`AA` 后 cargo1,6 /2,6 /4,6、空箱3,6、外人5,6；`DSSAAAA` 后外人2,4；`WW` 后中 cargo2,7；`SAWW` 后外 cargo1,8，推者死1,7。右尾为对应镜像。

两条20尾已全部实测吻合；最后两次T核最大相同time50仍 `completed=false`。总70输入，axis0活cargo4,6 /6,7 /7,8，axis1活cargo1,8 /2,7 /4,6，两外人均死。本例否定“冲突前父线上的inner3,6 /5,6仍可算完成信用”的完整性假说。没有记完成。此前第28 X 的容器分裂推力冲突仍是真实机制证据。

owner正常undo44精准回26/time27，随后undo1回25、A/X改新资源形状；旧70试验历史全保留，累计45undo、0retry。

## 跨行资源分裂实证

新有效27串：`AAAWXSAWWDDSSWSSSSSWASAWWAX`。

- 第26 A：外人4,3左受3,3墙阻后转S到4,2；唯一Bluecargo4,6面A、Fork2。
- 第27 X：下侧子体带Blue进入ICE4,5后微滑4,4，推空Color4→4,3；另一侧fallback Bluecargo3,6。实际Blue49/cargo51在4,4、Blue58/cargo59在3,6，两者Fork1、ghost0、active、faceA；free50在4,2、Fork0。time29。

此前我消息复述“25A后free3,3”是几何错误，3,3实际Wall；自有普通模型的Wall实体正确，已立即纠正owner/root。

新模型 `ch4-15-shift-readonly.cjs` 从旧26：521个普通前置状态（深度24）与80种已有inner目标的C4异向fork-X冲突family，320个受限侧尾没有正尾。进一步明确筛除X生成体位于ICE而未处理续滑的条件后，仍不能把失败推广整关。

从跨行27同一普通域262状态耗尽；假定父容器在同X全腾空、只有空C4参与相反推力，未出现已保inner的两支目标family，也没有更短Blue子体与C4同格probe。此范围排除未知父容器碰撞、不同来源堆叠、后续再冲突和幽灵，不作全局无解。

短新物理predicate已实测：从跨行27单W，lowerBlue4,4→ICE4,5→4,6，Color4→4,4，free4,3，另一Blue3,6仍Fork1；双方faceW。第29单X允许两内向子体落入彼此旧父盒格3,6/4,6，实际四Bluecargo2/3/4/5,6均Fork0、ghost0、height1、contained1、active，单线time32；没有堆叠、融合或新axis。本例验证相邻父容器同X腾空。此普通/fork0X域共5activePLAYER不足六目标，不扩普通BFS；未知异源叠加观测另域仍保留。

owner再正常undo4回25、X恢复横向26，累计49undo、0retry，旧29证据保留。原始Blue49/cargo51=3,6、新Blue64/cargo65=5,6 Fork1，空Color4 4,4、free4,3、time27。

明确新机制16步predicate从横向26：`WAWWWDASSSSDSWWD` →Color45,6、Blue4,6F1 /6,7F1、free7,6faceD。owner已实测16前置与第43单X；独立读取主JSON确认：一个Bluechild5,6推Color4→6,6，另Bluechild直接生6,6，真实不同来源叠加；另外新Blue4,5触ICE后真实微滑4,4。

第43稳定time46：Color4 BOX48在6,6，height1/contained0；Blue BOX64同在6,6，height2/contained1/container48；cargo65 activeghost0/height2/contained1/container48。另Blue49/cargo51在4,4，Blue66/cargo67在5,6，Blue68/cargo69在7,7；外人50在7,6。四cargo、一free均活，Fork全0，单线，completed=false。

第44单A：外人7,6向左推叠体6,6→GOAL5,6，同时把原Blue5,6推到4,6。实际两颜色线观测坍缩，time47：axis0只保Color4 BOX48且cargo65.container48，Blue64 masked；axis1只保Blue BOX64且cargo65.container64，Color4 BOX48 masked。两线cargo65均5,6、activeghost0，另三cargo51=4,4 /67=4,6 /69=7,7以及free50=6,6均继承；所有Fork0，无dialog。真实确认本关fork-X生成异源叠体后，Goal观测各颜色支均继承载人货物。仍 `completed=false`，不把新机制试验计完成。

当前有效44串：`AAAWXSAWWDDSSWSSSSSWASAWWXWAWWWDASSSSDSWWDXA`；累计49undo、0retry，旧70/新29实验保留。后续完整运输由root指定资源helper独立负责，main helper封存物理证据、不重复其BFS。

16前置分段 `WAWWW | DASSS | SDSWWD`：第31 free2,6/C44,6/Blue3,6+5,6；第36 free3,4/C45,6/Blue4,6+6,6；第42 free7,6/C45,6/Blue4,6+6,7，两cargo面D/Fork1。

另外定向枚举新stack family：横向26普通521状态、跨行27普通262状态（depth24队列耗尽），找fork-X生成Blue与被推Color4同刻同格、并排除新cargo1,7/7,7锁角，没有其他positive。该范围未包含X-ICE微tick新重叠、已叠体、未知多角色容器。在两个cargo均Fork1且KEY全部inactive的起点，已证X同时各花1叉；保另一Fork1需要改变资源前置，不能凭此域声称已有那种库存。

## 有限模型范围

资源模型文件 `ch4-15-revisit-readonly.cjs`：普通移动、已观测 ICE、free-X；无 cargo-X、推力冲突、异源堆叠或 ICE 后续 tick 尸体救活。深度40，最多20,000展开，箱不入 y1。

固定 `WAASAWX` 源的几个目标各达到20k上限无命中；切换 `AAAWX` 源才找到上述25前置。其他20k无命中结果不构成全关无解。

条件运输文件 `ch4-15-revisit-tail-readonly.cjs`：明确的假定冲突子态；普通方向输入、不新增容器或世界线。两条20尾只标模型已核，等待真实冲突后执行结果。
