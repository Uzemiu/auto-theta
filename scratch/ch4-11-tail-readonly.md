# 4-11 大象：左右双载箱终点尾段（只读）

2026-10-04，助手 `/root/ch3_37_cargo_revisit_oct03`。唯一输入 owner `/root/resume_slot1_oct03`。本轮只读取普通主记录、做有限模型核对并写本助手 scratch；不输入游戏、不写存档/主KB、不用提示/攻略/隐藏实现、不重复主helper的冲突前置搜索。

## 观察起点与模型范围

来源 `artifacts/slot1-playthrough/4-11.json` initial 及 events[11] 第21态，runtime elephant，size8,8，指令 `WWWDXSAAASXWWDDSSDDAX`：

- Color4 BOX45/cargo47=6,2；Color4 BOX51/cargo52=6,4；两cargo均active/ghost0/fork0/key0/contained1。
- 四个活外人 PLAYER46=4,2、49=6,1、50=4,4、53=6,3，均fork0/key0。
- 目标1,7/2,7/6,7/7,7。
- SPIKE1,6/2,6/3,6/3,7/5,6/5,7/6,6/7,6；中央4,6及4,7安全。
- 关键真Wall：1,5；2,1/2,2/2,3；7,4/7,5；整个x0/x8/y0/y8边界。同格 SOLID tile 不能覆盖实体Wall。

自有 `scratch/ch4-11-tail-readonly.cjs` 引用从真实观察建立的普通 `stack-cargo-readonly.cjs`，核两箱三外人的有限单串。容器内容保持活着，箱可运过刺，外人走入刺死亡；被刺杀的推动者已产生的箱推力仍完成。排除箱体合并（max_stack1），不建推力冲突、worldlines、ghost或cargo X。

下列 staging 全为**假定几何起点**，不是第21态已到达；保留两真实cargo身份，替换它们及三外人的位置，只核明示尾段。不能用它们当作实际通关证据。

## 三步确定几何尾

| 方向 | 两cargo起点 | 三外人起点 | 尾串 | 最终cargo |
|---|---|---|---|---|
| 左 | 2,5 / 3,5 | 2,4 / 3,4 / 4,5 | `WWA` | 1,7 / 2,7 |
| 右 | 5,5 / 6,5 | 5,4 / 6,4 / 4,5 | `WWD` | 6,7 / 7,7 |

第一 W：左两cargo到2,6/3,6刺，右到5,6/6,6刺，cargo仍活；两直接推者在y5安全，第三外人到4,6安全。

第二 W：两cargo到y7；左推者死2,6/3,6，右推者死5,6/6,6；第三外人仍活在4,7。此时左暂占2,7/3,7，右暂占5,7/6,7；3,7/5,7虽是刺，cargo在容器内仍活。

最后 A/D：中央外人把相邻两载箱链向左/右推一格，覆盖本线两目标。推动者落3,7/5,7刺死亡。最终只保留两active cargo；同一条普通线只覆盖对应半边目标，另半需主helper的合法冲突线覆盖并实际判完成。

## 四步中央 staging

| 方向 | 两cargo起点 | 三外人起点 | 尾串 |
|---|---|---|---|
| 左 | 3,5 / 4,5 | 3,4 / 4,4 / 5,5 | `AWWA` |
| 右 | 4,5 / 5,5 | 4,4 / 5,4 / 3,5 | `DWWD` |

首 A/D 由侧面外人推双箱链一格；另外两人同步横移到相应的竖推位，侧推者落中央4,5，恰好转成上述三步 staging。四步有限 replay 全部有效，最终两cargo在对应目标、三外人全死、无新冲突/合并。

此4步谓词可以作为冲突后运输的接近终点目标：不需要从较难的2,5直接初始竖送，也不要求一条线覆盖全部四目标。Cargo ID左右交换不影响这个无资源尾。

## 实际21附近的回收条件

6,4的左邻5,4是真安全Floor，右邻7,4是真Wall。左推需要站7,4，右推目标7,4，因此不能在6,4直接横移。可先从6,5向下推退6,3，再由7,3向左回收；也可从6,3向上送6,5，接右侧竖送，但必须同时保留正确的其他载箱与三外人站位。

下箱6,2不要当作无代价移到6,1或7,2：y0全Wall使row1箱不能普通北推恢复；7,2东推目标8,2为Wall，西推所需8,2为Wall，向上最多到7,3后7,4为Wall，不能横推回来（右推位8,3同为Wall）。这只是普通推箱回收限制，不排除尚未验证的其他机制。

左侧箱2,4不能用普通北推起步，因为直接推者需站2,3真Wall。左竖送应先将载箱横移到2,5，并让推者在2,4。2,5箱下方可站，2,6为刺，所以两次W的牺牲时序是实质前置。

## 主helper完整候选的独立有限核验

主helper后来给出 actual21 后19步 **`AAADDWDDSAAASDSDSDW`**，末W制造正交冲突。本助手独立普通模型从真实 events[11] 重放前18步 **`AAADDWDDSAAASDSDSD`**，全部有效，无死亡或新捕获，得到：

- BOX45/cargo47=3,2；BOX51/cargo52=6,3。
- 四free分别7,3、7,2、6,2、6,1。

最后W的几何：7,3外人被7,4真Wall阻挡，左转A推6,3载箱到5,3；6,2外人直接W推同箱到6,4。7,2和6,1两旁观者正常到7,3和6,2。按M095的已实测Color4冲突继承，拟得两分支，各保留两cargo和三free6,3/7,3/6,2；真正的输家masked和具体axis必须在owner实际冲突后核，不由本模型生成或当作实测。

| 按箱位辨识分支 | 两cargo | 三free | 主helper尾串 | 本助手有限replay结果 |
|---|---|---|---|---|
| A侧 | 3,2 / 5,3 | 6,3 / 7,3 / 6,2 | `ASAWADSDSAAWWWAWWA`（18） | 有效；活cargo1,7/2,7、0free |
| W侧 | 3,2 / 6,4 | 6,3 / 7,3 / 6,2 | `ASAAWAAWWAWDDSSSWWWWWD`（22） | 有效；活cargo6,7/7,7、0free |

左尾第14步达到本报告的中央左staging（cargo3,5/4,5+free3,4/4,4/5,5），剩 `AWWA`。右尾第19步达到普通右staging（cargo5,5/6,5+free6,4/4,5/5,4），剩 `WWD`。两尾均没有额外冲突、箱合并或货物耗叉，不需要未经核验的幽灵能力。外人此前均存活，末两步按上述次序死亡；两个cargo一直active且contained。

这已闭合**主helper所报冲突分支条件下**的完整运输尾。本助手做的是18步前置单串与18/22两尾的独立有限重放，没有搜索冲突前置。核验后立即发owner/root/主helper，由owner正常实测，结果见下。

## 真实闭环：81输入完成

owner随后正常执行完整81串，报告0undo/0retry。本助手独立读取更新主JSON的 events[19]/[24]/[26]/[32]/[34] 和 completion，核得：

- **events[19] 第40输入**：axis0 A支，BOX45/cargo47=3,2、BOX51/cargo52=5,3；free46/49/53=6,3/7,3/6,2，输家50 inactive/maskedoff1。axis1 W支，同cargo45=3,2、cargo51=6,4；free50/49/53=6,3/7,3/6,2，输家46 inactive/maskedoff1。两支两cargo全部active/contained1/ghost0，与静态前置完全吻合。
- **events[24] axis0 time54**：cargo3,5/4,5，free3,4/4,4/5,5，真正到达左中央 staging，末 `AWWA`。
- **events[26] axis0 time58**：活cargo47在1,7/BOX45，cargo52在2,7/BOX51；另外三free在2,6/3,6/3,7均inactive/ghost1，原冲突输家仍inactive/maskedoff1。左两目标覆盖，整关暂未完成。
- **events[32] axis1 time59**：cargo5,5/6,5，free4,5/6,4/5,4，真正到达右 staging，末 `WWD`。
- **events[34] 与 completion**：`completed=true`，左线time58活cargo1,7/2,7，右线time62活cargo6,7/7,7，四cargo均active/ghost0/contained1；右三free在5,7/6,6/5,6均inactive/ghost1，两条线的六名末推者实际全部死亡。Inactive的ghost1死亡外人不能当作可继续输入的活幽灵。

完整已实测串（T正常切换到右支，不计作该线的时间前进）：

`WWWDXSAAASXWWDDSSDDAXAAADDWDDSAAASDSDSDWASAWADSDSAAWWWAWWATASAAWAAWWAWDDSSSWWWWWD`

21初始 +19冲突前置 +18左尾 +1个T +22右尾 =81输入。两分支时间分别58/62，主JSON完成标记真实为true。

root另已核真实save：完成计数108、星数5、`LevelStates.elephant=3`、record81；这些存档数据来自root的实际核验，不是本助手读取。本助手没有读取或修改游戏存档，未新增全局成就结论。4-10资源报告仍保留候选与有限失败范围，不由此改写为全局不可解。
