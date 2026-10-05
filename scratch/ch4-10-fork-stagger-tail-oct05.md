# 4-10 staggered Fork 四箱尾与资源前置（2026-10-05，只读）

**条件尾 `XWWW` 已固定模型验证，两个普通Goal均可覆盖；完整合法前置尚未得到。** 唯一授权资源轮 cap12000/depth60 已结束并截断：expanded12000/seen12763/heapPending1325/stale125/depthCut0；没有取Key、开Lock或达到所需预X库存。liveHandle=null，不升cap，不把有限未命中说成蜗牛不可解。本助手未操作游戏、UI、存档、主知识库或主JSON。

## 1. 条件预X源与尾

以下是parent给出的**constructed充分构型，不是实际存档现场**：3个独立height1 Color4 BOX，cargoFork1在7,6/faceD，两个空buffer在7,4/7,5，唯一outsideFork0在7,2；Lock7,4已经正常开启；其余物品已取。角色ghost0，cargo container指自己的箱。脚本中的ID57/58/59和63/60仅是构造标签，不声称具体历史实体已部署于这些坐标；X的新1000/1001等是模型占位ID。

| 尾步 | 指令 | 活cargo位置 / Fork / 面 | 空buffers | 活outside |
|---|---|---|---|---|
| 0 | — | 7,6 / F1 / D | 7,4；7,5 | 7,2 / F0 |
| 1 | X | 7,7与7,5 / 各F0 / D | 7,3；7,4 | 7,2，不被捕获 |
| 2 | W | 7,7与7,6 / F0 / W | 7,4；7,5 | 7,3 |
| 3 | W | 7,8与7,7 / F0 / W | 7,5；7,6 | 7,4，Lock已open |
| 4 | W | **7,9与7,8** / F0 / W | 7,6；7,7 | 推链后踏SPIKE7,5死亡 |

X的北child到7,7；南child到7,5，同时把既有7,5/7,4双箱链下推至7,4/7,3。W1只推下方三个相邻箱到4/5/6，随后与未动的上cargo7形成四格链4..7；W2/W3才推动完整四链，保护推者至Lock格7,4，最后死亡。两cargo始终active/contained1/height1/ghost0，固定重放valid、direct Goal mask=3。无新stack/force/Ghost或同源相遇。

所以这不是旧“cargo7,5/6+空箱7,4+双free7,2/3”的三箱WWW接力反例；区别是本X把两个缓冲下推、复制持叉cargo并构成**四个连续位置格**。该充分模型尾不表示已有游戏completed证据。

设面也已局部核清：若以上三原箱7,4/5/6、cargoFork1仍在6而outside在7,3，`SSD`把outside走7,2→7,1→（东8,1真Wall，转W）7,2，cargo普通最终设faceD。因此outside最终faceW与cargo最终faceD并不矛盾。

## 2. 右端更宽松的分阶段充分构型

新的固定手工充分源仍**没有来自历史8/32/52的完整前缀**：

- Lock7,4已开，cargo7,4/Fork1，两个独立空BOX5,3/6,3，outside4,3/Fork0；全活ghost0、高度1。
- 接24步 **`DSSDDWWSSAAWWDASSDDWWSSD`** 可到上述预X源；再XWWW共28步，固定重放Goal mask3。

| 相对此源步 | 关键库存 |
|---|---|
| 1 D | 空箱链5,3/6,3右移为6,3/7,3，outside5,3；cargo7,4不动 |
| 7（接SSDDWW） | cargo7,5；空buffer7,4、另一空箱6,3；outside7,3 |
| 14（接SSAAWWD） | cargo7,5；双空buffer7,3/7,4；outside6,3 |
| 21（接ASSDDWW） | cargo7,6；双空buffer7,4/7,5；outside7,3 |
| 24（接SSD） | cargo仍7,6但faceD；outside7,2/faceW；正是XWWW条件源 |

这条路把外人从6,3绕5,3→5,2→5,1→6,1→7,1进入7,2，避免直接S踏SPIKE6,2；全部buffer维持可运输格，没有Box沉row1。

另一个更早条件：cargo7,3同时持Fork1/key1，双空BOX5,3/6,3，outside7,2/F0，Lock仍闭。先 **`WSSAAWAW`** 8步：首W载箱进入7,4正常耗钥匙开锁，outside7,3；随后沿7,2/7,1/6,1/5,1/5,2/4,2/4,3回到前述源。接24+4总36步：

`WSSAAWAWDSSDDWWSSAAWWDASSDDWWSSDXWWW`

独立单串固定结果valid、mask3。其Key/Fork同乘员的合法来源、三箱抵达右侧以及未损箱条件仍缺前缀；不是推荐立即从实际52执行这36串，也不证明钥匙必须由cargo持有。

## 3. 真实资源源、公开模型与时序

独立脚本 `scratch/ch4-10-fork-stagger-tail-oct05.cjs` 读取 `artifacts/slot1-playthrough/4-10.json` 初态真实Wall/Floor/SPIKE及三个已实测checkpoint：

| 源 | 原JSON引用 | 载箱 / 外人 / 待取库存 |
|---|---|---|
| actual8 | events[35] / frame2484638 | Box57=4,2、58=3,3、59=4,3；free60=3,2与63=6,1，均F0/key0；Fork1,5和Key3,6仍active，Lock闭 |
| actual32 | events[61] / frame2575629 | cargo63/58=2,3F1/S，free60=4,3F0；empty57=4,2、59=3,3；Keyactive、Lock闭 |
| actual52 | events[77] / frame2650099 | cargo63/58=3,3F1/A，free60=6,1F0压button；empty57=2,3、59=4,3；Keyactive、Lock闭 |

已实测按钮配对保持：button6,1→Gate3,4/4,5，button1,1→Gate4,1/1,4。模型只按**输入前**snapshot的button或各自Gate占位判断可进；同组另一门不被占位联动打开，不使用同一输入先压button再放行的假设。Lock7,4必须由实际进入的free或前端cargo携钥匙才能打开，emptyBOX不会因后面的推者持钥匙而自行越Lock。缺Floor不可站，Wall优先。

正常保叉捕获用已有普通双箱链规则；Ghost捕获、不同方向force、异源stack/未知重叠与occupied吸收首次出现就停止。既有cargo普通仅随BOX移动并设全局face；独立Box/height1 cargo最后X使用已证Color4容器复制和M102源格腾空，不模拟未证层叠行为。

为校验新私有step，单固定复算两个**既有实际**段均完全匹配：

- actual8+`AAAAAWWWAWWSSSSWSSSSAWWA`24 → actual32的三Box/两个角色/叉1/Key待取/Lock闭。
- actual32+`SSAASAAWWDAWAAWDDSSA`20 → actual52，Gate0因free6,1开放、Gate1关闭，三Box位置与原contained归属均匹配。

这仅是公开历史一致性验证，不能让新constructed上层库存变成实际。

## 4. 唯一资源heuristic运行

执行 `D:/nodejs/node.exe scratch/ch4-10-fork-stagger-tail-oct05.cjs search`，进程直接退出、liveHandle=null，无尚在后台的搜索。三个checkpoint作为一张联合best-first图的起点，总预算12000（不是各源各跑12000），每条尾深度≤60；寻求精确cargo7,6F1/D+空buffer7,4/5+outside7,2F0且Lockopen。source历史前缀不计尾深度。保3独立BOX、2活角色、无提前X。

Box row1禁用于burn button6,1，x1以及BOX3,6/5,6普通死角也停止；不把这些搜索限制推广为游戏规则。普通无提前X时x1箱无法由x0墙侧向推出，3,6/5,6也缺合法普通回收站位。这里的限制服务于保留精确三箱/Fork1预X资源，不能排除提前X/新增层叠/其他资源预算的解。

去重将同色空箱视为几何等价、保留cargo Fork/key及其必要面；外人普通face不参与后继。启发倾向Key/Lock、右走廊运输和buffers；不是最短路证明。best-first可在更短路径出现时重开一个状态，seen为唯一状态键，pending为heap项（含可能未清理的stale），不可简单当作唯一未展开状态个数。

| 项目 | 结果 |
|---|---:|
| cap / depth | 12000 / 60 |
| expanded / seen / heapPending | 12000 / 12763 / 1325 |
| stale / depthCut | 125 / 0 |
| 穷尽 | 否，扩展数截断 |
| 展开来源归属52 / 32 / 8 | 6487 / 5325 / 188 |
| 首持Key / 首Lockopen / 目标预X | 均未命中 |
| maxCargoY | 5 |
| force停止 / 新stack或Ghost停止窗口 | 4 / 0 |
| 裸SPIKE死亡转移计数 / free融合计数 | 4392 / 10 |
| 两活人/三Box/指定陷格库存剪枝 | 4989 |

**Key-first的actual8源本轮只展开188次，尤其不能据此排除它的合法前置。** 没有扩大预算，没有重跑旧同域；未展开队列、先Key后叉、其他Box/Gate资源机制均仍有剩余范围。

最早所遇右廊载箱候选（仅模型）为actual52+ **`AWAWSAAWDDDD`**12：cargo7,3F1/D、free6,3F0/D，空Box2,4与4,4；Key3,6仍active、Lock7,4仍闭。空Box2,4需要左Gate的安全推者，空Box4,4位于SPIKE，不能仅按两个空箱计成已可回收缓冲。这不是前述可执行右侧stage，也不授Goal信用。

所遇最早cargo高点（仅模型）为actual52+`AWAAWWDDSSWW`12：cargo5,5F1、free5,4，空Box2,4/6,3，Key仍active/Lock闭。向北到5,6会进入普通死角；也没有全解尾。

首次force短窗口（仅模型）：actual8+ **`DWSAAWWAWW`**10。前9为free60=2,4/W、free63=3,3/A，emptyBox58=2,3、另外57=5,4/59=4,4，两个free均F0、Fork1,5/Key3,6仍active。

- 末W，60北2,5Wall、西1,4Gate闭，转S推58至2,2。
- 末W，63北3,4Gate闭，转A推58至1,3。
- 对同一empty58有S/A正交force，本轮不传播；不能当成仍有两名可同步操纵的活外人。

## 5. 剩余准确缺口

四箱staggered尾和右侧分阶段运输是已核的**充分条件**，不声称每个蜗牛解都必须这样排箱。当前未闭合的是：正常取Key、携出上部pocket并开Lock，同时保持Fork1 carrier及两可用buffer/一个外人；不是单纯缺右走廊的后段推力。上门只能由当前snapshot控制，普通BOX3,6取Key后也不能假设可裸向下回收；box落row1压button后不能仍按三原箱+复制第四箱的数量授运输通过。

本轮封存。所有新姿态、固定串和Goal mask均为模型候选，actual8/32/52以外没有新增真实游戏完成证据，不建议owner盲重放无钥匙的右廊短段。
