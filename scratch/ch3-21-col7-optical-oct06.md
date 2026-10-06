# 3-21 COL7 动态棱镜探针（2026-10-06，只读 helper）

对应纯私有模型：[ch3-21-col7-optical-oct06.cjs](ch3-21-col7-optical-oct06.cjs)。输入证据仅为[主公开记录](../artifacts/slot1-playthrough/3-21.json)和[原解法](../knowledge/solutions/3-21.md)。本 helper 没有操作游戏、修改存档、使用提示或读取隐藏实现；唯一游戏输入 owner 是 `slot1_owner_oct06`。

实际结果：当前到 time39，未获得 COL7。正常可达的新棱镜构型已实际复核，但 Prism2,8 与 COL2,6 对齐没有产生光照；后续幽灵拒绝走出 DARK 时也没有把 Prism 推到 COL 同格，不能执行假设复活后的 `ASSDS`。

## 源与校准范围

本轮 fresh 为 event30/frame1264337。实际 `ASSWWWDX` 八步源为 event34/frame1264741，axis0/id96/time8：PLAYER73[5,5]/D 和新 PLAYER95[5,3]/D，均 active/ghost0/Fork0/free/key0；Prism74[5,6] 无光、未遍历、testCompleted=false，Gate5,7 开、Gate8,3 闭，18 DARK 均活，COL76/NID7[2,6] 活。

模型重放旧成功53路线，在旧 event21/time10、event23/time25、event25/time32、event27/time38 的玩家位置/朝向/Fork/ghost、Prism位置、DARK集合、KEY状态一致。旧子玩家 ID 归一化只用于这组几何比较；不声称旧 time8 存在完整观测，也不把旧子 ID96 当成本轮95。新 actual8 几何比较亦一致。

模型明确不创造空 Goal 或 COL 光源。碰面、争推、动态捕获、自由幽灵 X 属未知，搜索不穿过这些状态。普通规则包括左转 fallback、幽灵目的格必须有活动 DARK，以及 M066 已支持的“幽灵进入仍有 DARK 的旧棱镜格，棱镜可被推出 DARK”。SPIKE 每步结算，只有 DARK 内幽灵保 active。

## 新域与执行的短路线

第一次加权搜索 730 expanded/1137 seen，找到从 actual8 的48步 setup。随后从旧实际 time25 几何出发缩短，1113 expanded/1413 seen，总新扩展 **1843 / 30000**；不是穷尽全关。无活进程 handle，所有计算 exit0。旧48保留在脚本 `.probe` 作历史，实际使用下列28步。

从 actual8 到 time25 的17步已知普通前缀：

`WWWDDDWDWDWDWSDAA`

time25 为幽灵73[3,8]/A、活人95[6,13]/A、Prism74[3,9]，均 Fork0，两门闭、18 DARK 活。新的11步为：

`WWWSSSSWDSA`

合计28步 setup：`WWWDDDWDWDWDWSDAAWWWSSSSWDSA`。到 time36：幽灵73[4,8]/A、幽灵95[2,10]/A、Prism74[3,8]，两门闭、18 DARK 活。独立末 `A` 到 time37 物理预测：Prism→2,8；73→3,8/A；95 的 A 目的1,10无 DARK，fallback S→2,9/S。

脚本 stdout `.shorterSearch.probe.trace` 给28个逐步预测；`.preA`/`.afterAWithoutAssumedLight` 给末态。每行 `.entityPredictions` 保留公开 actual8 的完整 PLAYER73/95、Prism74 静态字段并替换位置、朝向、ghost/Fork，供 owner 校验；它不预测未发生的分支 GMID/maskedoff，也不把静态保留当成已验证。

## actual37 阴性证据与适用范围

owner 已实际走28 setup+单A，主 **event56/frame1442933/time37**：Prism74[2,8] 的 lighten/traversed/testCompleted 全 false，18 DARK 仍活；幽灵73[3,8]/A、95[2,9]/S，均 active/ghost1/Fork0/free；COL7 仍 active，completed=false。本轮0 undo/0 retry。helper 独立读取该 event，物理模型一致。

该证据只否定“COL2,6 经2,7照到 Prism2,8 后触发光”这个构型。3-27 实证光源棱镜位于 Goal 本格；因此不能从这里推断 Prism 与 COL 同格也必定无光。空 Goal 光源从未被模型假定。

若将来合法得到2,9的 active/ghost0 玩家，`ASSDS` 可经1,9→1,8→1,7→2,7→COL2,6。当前玩家是 ghost1，不能据条件尾声称取星。

## 后续可判别边界（预测与实际对照）

actual37 后独立 `S38` 是标准 M066 预测：95由2,9→2,8/S，Prism2,8→2,7；73因3,7无 DARK，fallback D→4,8。两幽灵仍 active，棱镜到 DARK 外。

再独立 `S39` 首次测试“幽灵拒绝出 DARK 前是否已登记推请求”。保守模型在目的2,7无 DARK时先拒绝，故棱镜留2,7，95 fallback D→3,8，73 fallback D→5,8。如果实际先登记请求而后拒绝本体移动，棱镜可能推进2,6/COL本格；COL同格是否光照/拾取均未知。只把这一步作为机制探针，不给假定长尾。脚本 `.postProbe.standard38`、`.conservative39` 与 `.unknown39` 描述这两个预态/未知。

owner 已实际执行两次独立 S：**event59/frame1510904/time38** 与上述标准38预测相同；**event62/frame1514885/time39** 与保守39预测相同，Prism仍2,7、18 DARK活、Prism三光学flags全false、COL7活、单leaf。本例空Prism的 S 推请求在幽灵拒出 DARK 时整个被拒绝，没有发生“本体拒绝但箱仍推进”。helper 独立读这两条主记录并校准一致。脚本 `.postProbe.actual38`/`.actual39` 保存 stdout 证据索引和比较结果；没有到达 COL 同格，故未判定 colocated source。仍0 undo/0 retry，无活进程 handle。

当前39的有限结构排除：18 DARK去除真实Wall后仅15个可走暗格；Prism2,7的四个相邻推位中，只有2,8有 DARK，其朝S推已实际被拒。其余1,7、3,7、2,6无 DARK，两个自由 ghost1/Fork0 无法站入。因此当前态的普通 WASD 不再能搬动棱镜或到达收藏，无需重复续搜该图。这个结论不覆盖 fresh 其他活人、装载或未知前置；也不把 owner 其他有限 cargo 搜索的无命中升级为全关无解。

另外，Prism捕获幽灵后由另一个幽灵运入 COL 的路径尚未构造；其 cargo拾取及同样的拒走推箱顺序未知。此次不以局部棱镜或幽灵到袋口当全关/取星解。

## 地图约束

Prism8,9 西邻7,9为真实 Wall，7,8/7,10也有 Wall，不能声称在那里折照可直达2,9。Gate8,3由 Button6,11 控制；该 Button 格没有 DARK，6,10/6,12/7,11为 Wall，棱镜普通推入后不可随意回收。只有一个棱镜，不能套用3-27双棱镜回折线路。COL袋与原自由活人分量的旧静态56/12检查不是本次新结果；本次新增的是正常动态到达的两幽灵+棱镜可校准构型及实际无光探针。
