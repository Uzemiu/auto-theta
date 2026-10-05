# 4-17 上浮：COL11、双Lock和缺Floor只读审计

本助手只读 `artifacts/slot1-playthrough/4-17.json` initial/events[1]、已有mechanics和正常游戏历史；没有game输入、存档/主KB改写、提示、攻略或隐藏实现。没有BFS；仅读main模型并对普通8步去锁前及一回弹作短串replay。唯一owner为 `/root/resume_slot1_oct03`，main负责六Goal。

**结论：COL11保持unclassified /observed_uncollected。** 取物终点确有安全地板，缺的是合法的双Lock开锁/导入资源前置，不是把收藏本身误判为空格。以下两个上区路径是清楚标注的资源条件候选，尚不能从本关实际5态执行成功。

## 真实地图与库存

initial runtime=floating，timeline size=[8,13]、min_anchor=[0,0]；COLLECTION54 pos2,10、active=true、NID11、Reverse=false、floor=false，**同格tiles有SOLID Floor2,10，active/floor=true**，没有Wall。不按编号或Reverse推定星星/丝带，更不记取得。

两Lock为ID50 at4,8和ID51 at4,9，均active/blockable=true、Color1。对应4,8/4,9都有SOLID Floor。普通KEY资源不存在：KEY52 at2,3和KEY53 at6,3都是isFork=true；真实事件[1] `SDDDD` 得PLAYER57 at6,3、active/ghost0/contained0、split2/faceD、**key0**，两叉inactive。两空箱C4 BOX55=3,4、Blue BOX56=5,4没有改变。

上区有效Floor集合（含两Lock下的地板）为：

| y | 相关实际Floor/障碍 |
|---|---|
| 7 | x1/2/4/6/7为Floor；3/5为GOAL且floor=true |
| 8 | x0/1/2/3/5/6/7/8全真Wall，唯一中间格4,8是闭Lock |
| 9 | 仅4,9有Floor，叠闭Lock |
| 10 | 2,10收藏安全Floor；4,10安全Floor；**3,10无tile/无floor实体** |
| 11 | 2,11 /3,11 /4,11均安全Floor |
| 12 | 无Floor |
| 13 | 3/4/5,13真Wall（同时有SPIKE tile），其余无Floor |

因此从4,10直接A去3,10不是已建的普通路线；应先W到4,11，再AA沿地板到2,11，S取2,10。COL实体floor=false不妨碍它与安全地板重叠；与某些GOAL自己提供floor=true的表示方式有区别。

## 边界和锁口约束

M015已经实际证明边界按size+1环绕。本关固定图周期应为x9/y14。下区row0全列真Wall、row8全列真Wall或闭Lock；x0/x8在y0..8也都真Wall。当前角色从下区不能凭纵向wrap绕过row8，横向也不能先出到边缘再绕上岛。分裂只到相邻格，不能跳过这条一格Wall/Lock封条。

该封条分析**不依赖**“所有缺Floor一定等同于Wall”的更强推广：即便上方空白格的细节未知，已有下区真Wall和无钥匙Lock仍挡住第一步上行。它只约束当前固定普通图、key0、已证移动/分裂规则，不排除以后正常组合改变墙/尺寸/钥匙资源，或新的实测机制。

M013：无钥匙Lock可参与转向。M012/M014：普通钥匙可被X复制并逐锁消耗；Fork数量不能作为普通钥匙数量。M063证明本例类型的箱内钥匙角色可开锁，但当前没有普通钥匙，空盒、Fork2 cargo或隔箱推者的钥匙都不能未经证据自动解两Lock；M028已有钥匙不能隔空空箱开远Lock的反例。

M089在Chapter3世界已有角色尝试无地形而回弹；M091载入口在无floor边缘不能继续推；M111世界冰箱也不能推入缺tile。它们支持将本关普通模型的缺Floor列为阻挡，但适用场景须保留，不能据此断言所有颜色Ghost复制或一切初始化都不能进入缺Floor。当前floating没有DARK、PRISM或已实测active Ghost，不把M093 Color2幽灵复制推广成穿锁、穿墙或造地板。

## 正常可达锁前：实际5接8普通动作

MODEL ONLY，已证实际5 `SDDDD` at6,3后，接 **`DWWWWAAA`** 八步：

```text
6,3 →7,3 →7,4 →7,5 →7,6 →7,7 →6,7 →5,7 →4,7
```

全程真实安全Floor、两箱不动，Fork2保留，无新增worldline。main的观察模型single replay `SDDDDDWWWWAAA` 返回valid=true、13总输入、P4,7/faceA/Fork2。再W的single replay返回P3,7/faceA/Fork2：面对Lock4,8转A，不会进上袋。该锁前可达与COL可取得必须分开；无需owner为了再次证明已知key0锁转向而盲执行，此处不干扰main资源路线。

## 条件取物尾一：4,7持普通key2

仅当合法角色已经在4,7并持 **ordinary key2**，而其它同步角色不妨碍该路：

```text
WWWWAAS
```

7动作依次4,8（key1）→4,9（key0）→4,10→4,11→3,11→2,11→2,10。所有路径点都有真Floor；无需穿缺3,10/row12或wrap。它只证明资源条件后的几何，不是当前可执行完整前缀，也不能用当前Fork2代入key2。

## 条件取物尾二：一个普通key经X复制

不必有两独立钥匙来源。已有M012/M014允许一份普通key1先复制为两份，再各开一Lock。精确条件：**P4,7 faceA，ordinary key1、Fork>=1；两Lock闭，其余不干扰**。沿已证X侧向/前方规则，条件11动作：

```text
XWDDWWWWAAS
```

| 尾步 | 被保留钥匙的取物者 | 开第一锁的另一角色 | Lock状态 |
|---|---|---|---|
| 1 X | front3,7、key1 | north4,8、key0 | 4,8打开，4,9仍闭 |
| 2 W | 2,7（上墙转A）、key1 | 4,7（上闭锁/左墙转S）、key0 | 同上 |
| 3 D | 3,7 | 5,7 | 同上 |
| 4 D | 4,7 | 6,7 | 同上 |
| 5 W | 4,8、key1 | 5,7（上墙转A） | 同上 |
| 6 W | 4,9、key0 | 4,7（上墙转A） | 两Lock均已开 |
| 7 W | 4,10 | 4,8 | 两Lock已开 |
| 8 W | 4,11 | 4,9 | 两Lock已开 |
| 9 A | 3,11 | 若缺floor阻挡则回4,8 | 两Lock已开 |
| 10 A | 2,11 | 若缺floor阻挡则回4,7 | 两Lock已开 |
| 11 S | **2,10，COL格** | 5,7（南墙转D） | 两Lock已开 |

取物者自己的每步均是实际安全地板；第二角色在尾9的缺3,9判定只影响它自身后续，不为取物者制造关键开门时序。两Lock此前已消耗钥匙打开。此条件尾是静态规则推演，未执行未取得，更不能先计COL。当前缺普通key1的合法来源，而非缺两枚不同钥匙或Fork不足。

## 正常组合候选边界与后续最小证据

M091的 `3-X^3-Y` 是真实正常组合导入普通KEY再开另一地图Lock的先例；M047/094也有正常组合取得单关未取收藏的实证。因此不能排除合法组合提供一普通key、补Floor或改变上袋入口。本次没有4章组合已可操作的世界前置/实际合图，未选定来源关、尺寸、墙或人物的合法完整prefix，**不向owner发送假设组合执行要求**。叠图也可能添加墙，不能认为任一有KEY关叠上即可取物。

后续如果正常教学/组合实际给出KEY(isFork=false)，需核玩家ordinary key、split、Lock是否耗钥匙以及实际合图Floor/Wall，再使用对应条件尾。合法到COL2,10后，必须实际确认COL54 inactive/取得UI文字，并由owner/root读正常存档Collections11与计数判种类。当前只读报告不改unclassified，不写主KB、不扩大main BFS，不把当前普通瓶颈推为所有合法机制下不可取得。
