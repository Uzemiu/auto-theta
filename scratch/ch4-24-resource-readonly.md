# 4-24 响指：双压与左列目标条件审计

2026-10-04，SaveSlot1，只读助手 `/root/ch3_37_cargo_revisit_oct03`。依据 `artifacts/slot1-playthrough/4-24.json` 的公开initial及KB实证；不读隐藏实现、提示或攻略，不发游戏输入，不写canonical/存档/主JSON。没有BFS，仅固定短串条件复算。owner/main负责实际取叉、首次capture和完整部署，本文不要求回退或盲试。

## 初图与通路

runtime snap；P89=1,5/F0，首Fork71=7,3；Blue70=4,7，Color1 BOX87=5,4，C4 BOX88=4,4。Goal68=1,1、Goal69=1,9；Gate64=1,2/ID0，Gate65=1,8/ID1；Button66=4,6、Button67=3,7。两Button无可见ID，先分别核4,6→ID0/3,7→ID1与交换排列，不凭实体顺序认定配对。

唯一SPIKE9,5，无ICE/Prism/Lock。上区Fork包括4,9/4,8、5/6/7/8/9,9、5/6/7/8/9,7、9,8、8,8、9,6；8,8与5,7的额外Fork会改变4-23的分枝库存，不能直接套其微步状态。

4,5是真Wall；4,6的左右3,6/5,6也是Wall，3,7上下3,6/3,8与左2,7均Wall。上区没有从4/3,7横穿到左列1,7的路。左列1,1..9的唯一普通横向出入口是1,4↔2,4；2,1..3和2,5..9均Wall。不能从上蛇道4,9跨3,9/2,9去Goal1,9。

Color1在公开entity中确为BOX，已有M076可普通推动/叠加观测的实例；本文只把它保留为未动空BOX，不假设它能穿Wall、开门或存在特殊cargo能力。

## 条件双压：Fork2载箱 + 上Blue + 左外人

构造源：活C4 cargo4,8/Fork2（4,8叉已取），emptyBlue4,7；left live free1,5。其余箱可保持Color1=5,4；此源尚未由初态实际部署。

若left free为F0，`SXAX` 四输入模型成立：

1. S：cargo设faceS，左free1,5→1,4。
2. X：cargo4,8两侧3/5,8都是Wall，只用front4,7并推Blue至Button4,6；cargo生4,7/F1，freeF0留1,4。
3. A：cargo面A，free1,4撞西0,4Wall转S到1,3。
4. X：cargo4,7侧S的Blue4,6因背4,5Wall不能推；侧N4,8有效，frontA3,7有效。生两F0 cargo4,8与Button3,7，free留1,3。

Blue4,6和cargo3,7形成双压，在两种一对一配对排列中都使两Gate开。此处配对仍是条件假设，需实际Button帧确认；不是新配对实证。

两按钮体均普通不可回收：Blue4,6向南/东西为Wall，向北推需要pusher4,5 Wall；cargo3,7向西/南/北为Wall，向东推需要pusher2,7 Wall。因此这个条件族可长期保压，代价是把两个body锁在按钮位置。上cargo4,8/F0和一个左free不能仅按总数宣称两Goal已覆盖。

## Fork1左外人：五输入避免配对导致融合

若上述left free持F1，直接`SXAX`有配对差异：

| 首Button4,6配对 | 第一次SX后外人 | 下一A后 |
|---|---|---|
| ID0下门1,2先开 | 2,4与1,3/F0 | 1,4与1,2，保两个 |
| ID1上门1,8先开 | 2,4与1,3/F0 | 下门仍闭，1,3转回1,4，与另支融合为一个 |

该A用的是上一X末门态（M112普通旧门时序），不能假设最后双压打开下门会逆转已经发生的融合。

明确更稳的条件五输入为：

`SXDAX`

| 输入 | 上体 | 左外人 |
|---|---|---|
| S | cargo4,8/F2面S | 1,4/F1 |
| X | Blue4,6，cargo4,7/F1 | 2,4/1,3两F0 |
| D | cargo4,7面D | 3,4/1,4 |
| A | cargo4,7面A | 2,4/1,3 |
| X | Blue4,6 + cargo3,7双压；cargo4,8/F0 | 2,4/1,3两F0保持活 |

两种Gate配对均固定复算成功，无裸SPIKE、异源stack、冲突或新cargo吞人。D/A往返期间不走门，所以无需先知道哪个门开。最终四物理箱（两个cargo、Blue、未动Color1）和两个outside；这比F0版的一个outside多出明确后续输送预算，但还不是完整Goal尾。

## 左列Goal的充分条件与缺口

双Gate持续open后，一个mixed载箱/外人条件尾可直接同叶全覆盖：cargo1,3/F0、free1,4/F0，保持上区双压，输入：

`SSWWWWWWW`

前两S把cargo1,3→1,2→Goal1,1，free到1,2；七W让free沿1,3..9到Goal1,9，cargoF0不移动。模型mask3，无SPIKE或新机制。该9尾仅验证目标运输构型；cargo1,3/free1,4的合法部署尚未给出。尤其从右把箱送1,4后，不得假定pusher可以穿过该箱到1,5或1,3，1列两侧Wall会限制下一次竖向推者站位。

若只有F0 left free1,3，在同一叶不能因为先`SS`到下Goal、再走上Goal就计两Goal同时覆盖。若已经通过正常冲突/叠加观测得到两个兼容叶且各继承双压及left free1,3，则可分别`SS`到1,1、`WWWWWW`到1,9，利用既有M042等跨叶覆盖形成强union候选；两叶的实际产生仍需独立证据，freeX本身不自动生成两世界线。

4-23牺牲唯一外推者取得cargo9,7/F2的尾，不能直接算本关全解。其上层分枝可给按钮body，但本关4,5是Wall且Goal在左列；需要保留通达左列的outside、部署mixed cargo/free或合法多叶资源。本文只给双压及Goal充分构型，不宣布这些都是全局必要条件。

## 复算与范围

`scratch/ch4-24-resource-readonly.cjs` 私有复用公开观察模型，换4-24几何并实现两种Button配对下的输入前门态/末态占据；仅复算SXAX/SXDAX、两种单叶Goal路线和constructed mixed9尾，0 BFS。命令：

`D:/nodejs/node.exe scratch/ch4-24-resource-readonly.cjs`

实际initial以主JSON为准；上述源、配对、双压与全Goal尾均尚未实测。未假设Color1隐藏特性、尸体复活、载箱穿Wall或未观测世界线。main得到真实cargo源后应按实际body与outside库存适配，不把本报告的构造坐标当已执行前缀。

## 新条件：两个Fork1载箱同时正交推Blue，分别开单门

owner另提出完整构造源：活cargo5,7/Fork1/faceA，活cargo4,8/Fork1/faceA，独立emptyBlue4,7；唯一F0 outside留左列1,4或1,3。5,7/4,8叉已拾，4,9叉尚active。两个cargo可为同源克隆，但不能把它们直接当已部署或把Fork1+Fork1臆加成Fork2。

这一次X的合法几何计划如下：

| 逻辑child | 方向/墙判定 | 推力与出生 |
|---|---|---|
| parent5,7的front child | 左S5,6与右N5,8均Wall，改front A | 推独立Blue4,7→3,7 Button；cargo child拟生4,7/F0 |
| parent4,8的left child | 面A的左侧S4,7有效，Blue可被推到4,6 Button | 推同一Blue向S；cargo child拟生4,7/F0 |
| parent4,8的right child | N4,9有效，无Wall | 旁观child4,9消耗1后拾当地叉，Fork1；不参与冲突 |
| left outside | Fork0 | 不响应X，保原1,4或1,3 |

两个冲突child都拟落4,7，但先对同一独立Blue形成A/S正交推力。M120直接实证是cargo/free的相反A/D推Blue，输掉冲突的组件masked/inactive，另一非冲突cargo保留；本新cargo/cargo正交且child同格的解析次序未实际验证。不能由手工分叶先宣布游戏一定形成两线，也不能擅自把冲突双方合成一个普通cargo或异源stack。本脚本的通用X仍拒绝force conflict；下面显式构造两种仲裁叶，再独立核普通Goal短尾，未声称X引擎已证明仲裁。

若该X遵循M120式按推力选择：

- A胜叶：Blue在3,7，仅压Button67；parent5,7的冲突child4,7/F0活。parent4,8的S冲突child输掉、不能继续计作活cargo；其N旁观child4,9/F1仍活。
- S胜叶：Blue在4,6，仅压Button66；parent4,8的S child4,7/F0活。parent5,7唯一front child输掉、不能继续计作活cargo；parent4,8的N旁观child4,9/F1仍活。

以上“输掉child”指逻辑组件，不预测其真实inactive/contained/container/坐标或ID：M120里原组件可能留源位置且masked，而非必留拟出生格。这些桥字段需实际单X核验。左右两叶各只有一名active winner4,7/F0、旁观4,9/F1、唯一outsideF0；不把输者当额外body。尾中只用普通W/S，旁观4,9不会再次X，也不会丢叉，所压Blue不移动。

两种Button配对下的具体Goal尾：

| 配对假设 | A胜叶单Button | S胜叶单Button | outside1,4短尾 | outside1,3短尾 |
|---|---|---|---|---|
| 4,6→ID0，3,7→ID1 | 上门1,8开 | 下门1,2开 | A叶5W→1,9；S叶SSS→1,1 | A叶6W→1,9；S叶SS→1,1 |
| 4,6→ID1，3,7→ID0 | 下门1,2开 | 上门1,8开 | A叶SSS→1,1；S叶5W→1,9 | A叶SS→1,1；S叶6W→1,9 |

全部八条普通Goal尾固定复算有效，各叶mask1或mask2，每对兼容叶union3；旁观cargo4,9/F1全程保留。需要在首次X稳定后观察Blue压哪个Button与实际开门，再按真实配对选尾，不能在未知配对时猜叶编号。另一门关闭没有影响：去下Goal只穿1,2，去上Goal只穿1,8。末开门时序也不抢拍，因为Goal尾始于分叶后已稳定的门状态。

如果实际outside仍在9,4，且原lower BOX4,4/5,4都已被搬离、row4 x1..9无其他body，则8A可到1,4；若在8,4，则7A。该横路为额外条件，不能忽略仍留4,4/5,4的箱。它可把main较新的右侧outside库存接到本表，但不是对当前输入的指令。

本新域的最小有价值实际判别是到达同步F1源后单X：看是否两线、各Blue单Button、4,7仅winner活以及4,9旁观cargo继承。两头F1同步与独立Blue4,7的合法前缀仍由main负责；这份条件union尾与前面的Fork2+Fork1 outside双压源不是同一个资源前置。没有为此运行BFS或追加一般搜索cap。
