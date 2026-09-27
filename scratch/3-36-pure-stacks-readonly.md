# 3-36 纯两塔、PRISM装载与连锁观察候选（只读，2026-09-27）

仅用普通3-36主观察、现有规则与候选模型；无游戏输入、无提示/隐藏实现/攻略。输入owner已收到分段。以下是独立模型重放一致的候选，不是实际通关。

## 175步到观察前置

| 输入范围 | 串 | 预期状态 |
|---|---|---|
| 1–58 | ASSSSSSSWWWWWAWWSAAXSSWDWDWWAAWWWDDDSWWAAAADSWWDSAADSSWWWA | 双BOX6,6，单PRISM6,7/7,6；双人6,8/8,6 |
| 59–86 | WWSADDWSSSAAWWWWWDWASAADSWWW | 双BOX5,6、双PRISM6,7；双人6,8/6,6 |
| 87–99 | SADASAWAWWDWS | 双BOX4,6、双PRISM5,6；双人6,5/3,6 |
| 100 | D | 双链捕获：BOX5,6、PRISM6,6含人，free4,6 |
| 101–175 | SWWAAAASSWWWSAASSSWWWAWWAWWSSAAAWWWWWDSSDSSWWWWWWWAWWDSSSAAAWWAWWSSAAAWWWWW | cargo双PRISM3,8、双BOX3,7、free3,6 |
| 176 | W | 物理预测PRISM3,9含人、BOX3,8、free3,7；真正的连锁观察实验 |

前两段共86输入；早期消息的57/27长度为手工误计，已程序校正为58/28。工具batch上限20，须按上限拆分，且86、99、100、175、176为建议完整观测点。

全175输入：

`ASSSSSSSWWWWWAWWSAAXSSWDWDWWAAWWWDDDSWWAAAADSWWDSAADSSWWWAWWSADDWSSSAAWWWWWDWASAADSWWWSADASAWAWWDWSDSWWAAAASSWWWSAASSSWWWAWWAWWSSAAAWWWWWDSSDSSWWWWWWWAWWDSSSAAAWWAWWSSAAAWWWWW`

## 几何结构

两个BOX实体76/79只彼此合并，两个PRISM实体77/78只彼此合并；整个前置禁止混合叠加，避免time32混叠后两链争用的真实分线。

与35不同，36左臂有3,6/4,6/5,6，可利用4,5墙使左推者按S转向D，与北方下推同刻汇合。所有四实体保留，未弃row3、6,9或9列。

第99步两组刚体构成水平双链4,6/5,6；第100D由3,6角色右推双链，另一角色6,5受右墙转上到6,6，与前端PRISM叠体同格捕获。这是两格推链的同奇偶捕获，不需要额外等待或ICE。PRISM是否确实承载并在观察后保留角色必须实际核验。

75步运输先把BOX支撑塔让到6列，再将载PRISM经横臂送左侧3列并抬到3,7；回收BOX到3,6作为下方推链。最终两塔一同上行一格到3,8/3,7，外人3,6安全。前175步没有把叠体送目标光，因此没有预先依赖连锁观测假设。

## 有界搜索与独立重放

- 保类型全局纯叠搜索初始120000展开时只找到一纯塔；没有把截断称为失败。抽取首个双BOX解：88595展开/99409已见，58步。
- 从双BOX真地图候选末态再找双PRISM：30598展开/34850已见，28步命中。
- 从双纯塔找PRISM装载：2231展开/2680已见，14步命中。
- 单自由人载物运输：4825展开/4843已见，75步命中。
- 全175串用另一份root-cargo-movable-prisms.cjs独立逐步复放。仅在内存去掉重复箱拒绝和PRISM装载拒绝、每步归并纯物体并重映射container索引；所有里程碑一致。公共脚本未改，不写假观察JSON。

## 需要实测的边界与条件收尾

第100步首先验证PRISM叠体装载，核active/contained/container/ghost，不能只看同坐标。

第176步预期前双PRISM被目标观察成两支，各支南光再观察后双BOX，最终四支；每支都应保留PRISM内角色3,9及外人3,7。3-35真实M085已验证重复同色BOX按实体各自成支，但没有直接证明本关的PRISM装载、连锁时序或容器继承。

若四支及右目标覆盖确实成立，各支外人执行 `SSSSDDDDDDSSAAAAAAAA` 到1,1，再分别5/6/7/8个W到左目标1,6/1,7/1,8/1,9。按实际axis选择T，不盲拼切线；最后以真实completed及存档核验。root已有条件分析在 `scratch/3-36-cascade-readonly.md`。

只有这一份新增报告，无新增JSON、模型脚本或后台进程。等待owner实际验证，不自行推进游戏。

## 实测结果更新

Owner已逐段实际执行全部175步，所有核验点吻合。第100D真实把PLAYER81装入PRISM77叠体；第176W产生四支，PRISM77/78与BOX76/79四种配对均保留载人PRISM3,9与free3,7。随后四条左列尾全部成功，285输入completed=true；Root独立核对SaveSlot1 deepin1状态3、动作编码一致、累计95关。上述前置与条件收尾均已实际验证，详见knowledge/solutions/3-36.md及M086；原候选段落保留推导与模型边界。
