# 5-2 空间：双箱前端幽灵捕获与安全缓冲（2026-10-06）

只读 helper，模型 [ch5-2-space-oct06.cjs](ch5-2-space-oct06.cjs)，证据 [canonical 5-2](../artifacts/slot1-playthrough/5-2.json)。没有游戏输入、提示、隐藏实现、反射、存档或主KB改写，也没有额外JSON。输入由唯一 owner `slot1_owner_oct06` 完成。

**实际已107步完成**，完整完成帧 event91/frame2285381/completed=true。下文保留此前条件构造和未知边界；末节列出逐段实际验证，不能将历史未验证措辞当作当前进度。

## 完整公开资源和实际源

初 frame2076460，runtime `space`，P43[2,4]/S/Fork0；Fork39[4,2]；BOX40[4,6] Color4、41[7,4] Color1、42[2,6] Color2；Goal7,7/1,1/1,7。

三Box都是公开 typeBOX/classBox、active、pushable=true/blockable=true、height1、contained0/container-1、movingdir0/movingsrc-1、Shadow=false；只有颜色不同。没有PRISM、DARK、ICE或色箱相互链接实证。Color1未被当成棱镜。

关键真实Wall：row7 x3/x6；row6 x6；row4 x6；外围x0/x8/y0/y8。SPIKE为3,2/3,3/3,4、7,1/7,6。Goal7,7唯一南入口7,6是SPIKE，直接推一只cargo到Goal会使唯一外人落刺，必须有后箱缓冲。

owner实际资源 `WDDDSSSAX`：**event6/frame2147793/time9，axis0/id45**，P43[4,1]/A、44[4,3]/A均active/ghost0/Fork0/key0/free，两者相同奇偶；三Box原位、Fork39inactive。新搜索只从此精确源出发。普通初态至已实际8步 `WDDDSSSA` 的位置/朝向/Fork与三Box几何重放匹配 **event4/frame2144093**；X资源结果直接取actual9，没有捏造Fork或F0X。

## 新机制域

不是单箱捕获或普通等待旧图。两同奇偶free可同刻捕获**双箱链的前端**：pusher每次只进入第一只箱旧格，而前箱位移终点在pusher原格三格外，其奇偶可与另一个移动free一致。不需要等待改变奇偶，也不把三箱数量当三free。

固定有运输价值前置：C4 40[4,3]在双链前，C2 42[5,3]在后，C1 41[7,3]背靠Wall8,3做挡物；两个free在2,3和6,3。末D：6,3右遇不可推C1，转W又遇Wall6,4，转A推动双链；40→SPIKE3,3，另一free由2,3直D同到3,3。free推者进入safe5,3，Ghostcargo可由原后箱继续缓冲移出地刺。初三Box均保持物理存在，没有消箱。

搜索只包含普通fallback/箱链，禁止前缀裸死、碰面、争推、叠箱、提前捕获；不引入Ghost自由出界或色箱链接。**947 expanded/1583 seen/636 pending，cap20000** 找到候选，不是全图穷尽/最优证明。所有计算短时exit0，无活进程handle；后续运输为确定重放，不新增搜索预算。

## 捕获前54步：逐段校准，不直接跨未知

从actual9：

`WDDWWDWSSWWWWDSSWAWDDASASAAWDDSDSDWSAWWDWSSAAASASDSSWW`

到time63：43[2,3]/W、44[6,3]/W均active/ghost0/Fork0/free；40[4,3]、41[7,3]、42[5,3]均空。先可执行4步 `WDDW` 到time13：43[6,3]/W、44[5,6]/W，三Box仍初始位。其后完整逐步ID/face/pos及5动态实体静态保留字典在 stdout `.candidate.trace`，末前态 `.preD`。

独立 **D64** 模型：43直D→SPIKE3,3，与C4同刻相遇，参考5-1/M092期待active/ghost1/contained1/container40；44在6,3因右Box不可推/上墙改A，双箱推到40[3,3]/42[4,3]，自身safe5,3/A仍活。41保持7,3。这个新双链C4捕获仍要actual核，不把与5-1同规则候选当已取得。

## 捕获后的运输：借两个空箱保外人

从上述已核capture后才用24步：

`ASSAAWWWAWDDDDDASSSDDWWW`

这是owner人工给的较短条件尾，经helper逐tick独立重放通过；替换helper初26步中的多余绕行。分段用途：

- 单A利用rear42缓冲，把cargo/40由SPIKE3,3送safe2,3，42→3,3、free44→4,3。
- `SSAAWWW` 绕row1至2,2，再两W将cargo升至2,5，外人在2,4。
- `AW` 至1,5，五D将cargo送7,5，外人在6,5。
- `ASSSDD` 绕5列/row2至7,2，避开Wall6,4和SPIKE7,1。
- 三W先把原41从7,3推7,4，再推41+carrier双链两次。第二次W后cargo40[7,6]、buffer41[7,5]、free7,4；**最后W88应独立**，cargo进Goal7,7、41停SPIKE7,6、free留safe7,5。

42仍是3,3的空C2，没有假定可穿它。全程free不踩刺，cargo受箱保护；Goal光照/生死观察未被运输模型模拟，输出停在 `.candidate.transport.goalPreObservation`。实际capture和外人活性不符合时不要使用此长尾。

## 条件完整三Goal收尾（执行前候选）

仅当actualGoal88像5-1/M074实证那样产生生cargo43[7,7]+free44[7,5]与死cargo43+同free44两叶，才按实际axis/活性/GMID继续。生叶 `AAAAAAWW`：沿safe row5到1,5，再W2到Goal1,7/time96；cargo保Goal7,7。T至死叶 `AASSSSAAAA`：先到5,5，S4至5,1，再A4到Goal1,1/time98。两尾避开所有SPIKE和Box；不要从7,5直接S4去SPIKE7,1。

在默认生叶被选中且这些actual边界都成立时，总指令 **107**：资源9 +setup54 +captureD1 +transport24 +生叶8 +T1 +死叶10。最高time98应检查三Goal联合覆盖。只是完整MODEL候选，没有游戏完成、存档或成就信用；无需F0X。`.candidate.conditionalLeafTails` 提供每步位置/箱子预测，条件dead叶GMID还未实际产生，因此不能照源GMID冒充其完整实测字典。

## 实际闭环与准确107

owner从actual9分14批执行前缀，主 event28..54（time13/17/21/25/29/33/37/41/45/49/53/57/61/63），最后frame2241600。helper对43/44及三Box共五实体完整字典逐顶层key核验，每批 `fullEntityDiff=[]`，含properties/details/GMID/动画；不是仅对位置。`.publicPrefixChecks` 给索引和结果。

独立 **D64，event57/frame2249212** 实际捕获43：43[3,3]/D active/ghost1/contained1/container40，40C4[3,3]；44[5,3]/A活free，42C2[4,3]、41C1[7,3]。helper与模型全五实体严格diff=[]。root另外独立MCP frame2250372核所有9动态实体及64指令，差异为空；本helper未伪装该root核为自己读取现场。

owner采用上文改短24运输，实际time65/68/72/76/80/84/87的五实体完整字典与模型全相等，helper独立复核7批 `fullEntityDiff=[]`。最后 **W88，event75/frame2273383** 实际产生两叶：axis0 cargo43[7,7]活ghost0；axis1该cargo ghost1/inactive/maskedoff1；44两叶均[7,5]活free。40在7,7、41在7,6、42在3,3，三物理箱完整保留；没有箱叠加、Color1棱镜、色箱链接、额外Fork或第三free。

之后使用真实actual88每叶字典和每叶GMID重建尾，不复用虚拟条件dead GMID。生叶4A到time92、再AAW到95、单W到96：44到Goal1,7，43固定cargo/Goal7,7；全部五实体完整dict diff=[]。T到死叶后AA到90、SSSS到94、AAA到97：44到2,1，全部五实体完整dict diff=[]。独立末A使44到Goal1,1/time98。

最终 **event91/frame2285381** 有完整公开completed=true实体观察，和前一events[90]单A accepted1/remaining0完成回执。两叶真实time96/98，共同覆盖三Goal。末frame的dead44 anim_completed=false（运动字段已0/src-1），helper稳定模型预测true；这个唯一动画差异如实保存在 `.actualTailChecks`/`.completionEvidence.leafFinalChecks`，其余所有物理/static字段均相等。没有把动画尚未完成改写为完整raw字典全相等；也没有5-1那种缺最终completed实体帧的采样限制。

准确实际107串：

`WDDDSSSAXWDDWWDWSSWWWWDSSWAWDDASASAAWDDSDSDWSAWWDWSSAAASASDSSWWDASSAAWWWAWDDDDDASSSDDWWWAAAAAAWWTAASSSSAAAA`

与初条件107逐字相同，本次0 undo/0 retry。root负责正常SaveSlot1的121关核验；本helper没有读写存档，不把其核验冒称自己的。5-2任务结束，不继续扩本关图，无活进程handle。脚本默认只重放已找到路径并校准公开观测，`searchExecuted=false/expanded=0`；初947搜索统计在`.recordedSearch`，只有显式`--search`才重算有界新前置，普通审计不重复队列。
