# 4-10 MODEL17：SSX 后保双 Fork1 的按钮/钥匙域

状态：**有限普通域已穷尽，无 KEY 或完整解候选。全部为模型；未实机部署。** 2026-10-05。本助手只读公开初态、机制、scratch 模型；唯一游戏输入 owner 是 `/root/ch4_1_readonly`，实际现场仍由 owner 管理。本轮没有游戏/桥接/UI调用，没有存档、主JSON或知识库修改。

## 精确来源和固定前置

沿用 `ch4-10-pre-firstX-fork2-oct05.cjs/.md` 已固定的 MODEL17；**未重跑其6000取叉搜索，也未重跑旧actual8/32/52的12000域。** 从主 `artifacts/slot1-playthrough/4-10.json` 真实 initial 输入 `WDDDSSAAAAWWAWWWW` 得到 MODEL17：P60=1,5/Fork2/key0/faceW/free/ghost0；BOX57=1,1，BOX58=6,3，BOX59=7,3，均Color4。KEY49=3,6仍active，Lock7,4仍闭。

17步仍不是 actual。BOX57永久压Button1,1，ID1的Gate1,4/4,1已开；ID0两门3,4/4,5仍闭。三只BOX此时普通可推方向全部为空：57在底角不可回收；58/59由Wall、彼此和Lock阻挡，开锁前不能移动。

先固定 `SSX`，不是另搜前置：

| 全输入号 | 动作 | 活人库存 | BOX与门 |
|---|---|---|---|
| 17 | 前置终态 | 1,5 / W / F2 / key0 | 57=1,1；58=6,3；59=7,3；ID1开、ID0闭 |
| 18 | S | 1,4 / S / F2 / key0 | Gate1,4在动作开始前已开 |
| 19 | S | 1,3 / S / F2 / key0 | 箱和按钮不变 |
| 20 | X | 2,3及1,2，各F1/key0/faceS/free/ghost0 | 原人面S，右侧2,3有效；西侧0,3真Wall，另一支用前方1,2；箱不动 |

完整20串：`WDDDSSAAAAWWAWWWWSSX`。第二演员的模型ID60001只是自有重放标记，不预称实际新ID；出生几何、叉数和门状态才是待实际对照字段。

## 唯一新资源搜索

从上述 MODEL20 仅走普通WASD，保两个活角色且各Fork1，允许合法capture；不限制箱x1、row1或普通死角。目标先是合法取得KEY并打开Lock；KEY首次命中单独记录，不授完成信用。没有第二X图、force/stack/占用载箱额外capture/Ghost/观测分支传播。

| 指标 | 结果 |
|---|---:|
| cap / depth | 5000 / 50 |
| expanded / seen | 114 / 114 |
| pending / depthCut | 0 / 0 |
| exhausted | true |
| first KEY / first escaped KEY / open Lock | 均无 |
| first cargo capture | 无 |
| 保人剪枝 lostActor | 97 |
| lostFork / Ghost / unknown | 0 / 0 / 0 |
| duplicate transitions | 246 |
| 原始死亡 / 原始融合计数 | 89 / 13 |

死亡/融合原始计数可能同时属于一个转移，不与97相加。这一图没有箱移动、force、stack、Ghost或Goal触发。cap和深度都未触及；没有运行中进程或session，`liveHandle=null`。搜索已结束，不加cap。

脚本复用公开 `ch4-10-fork-stagger-tail-oct05.cjs` 的ordinary step，并在私有包装内加了这一固定单人F2 freeX；没有声称另一套独立物理引擎。几何hash忽略face，因为队列中全是ordinary，每一步均重新设面/反弹；固定重放保留face与原BOX ID。

## 最短压ID0按钮正例及未闭合之处

MODEL20接 `ASASSS`（6输入）得到 MODEL26：

| 输入号 | 动作 | P60 | 模型新演员 |
|---|---|---|---|
| 20 | X后 | 2,3 / S / F1 | 1,2 / S / F1 |
| 21 | A | 1,3 / A / F1 | 2,2 / D / F1 |
| 22 | S | 1,2 / S / F1 | 2,1 / S / F1 |
| 23 | A | 2,2 / D / F1 | 3,1 / D / F1 |
| 24 | S | 2,1 / S / F1 | 4,1 / D / F1 |
| 25 | S | 3,1 / D / F1 | 5,1 / D / F1 |
| 26 | S | 4,1 / D / F1 | 6,1 / D / F1 |

完整26串：`WDDDSSAAAAWWAWWWWSSXASASSS`。两个角色都key0/ghost0/uncontained，三箱不动；末6,1按钮确实被占住，ID0两门开启，57仍压ID1，因此四门末态都开。**这只是一条按钮模型正例，KEY仍active/Lock仍闭，不是钥匙路线或值得单独消耗实测轮次的完成候选。**

普通门判定采用输入前快照（M112），不把同一步新踩按钮的末开门提前给予另一演员，也不把单个门占位推广成同组永久开门（M099）。

## 有限域卡点：同奇偶与第一道门

2,3和1,2两free同为奇格。此固定域里没有ordinary等待；每个被保留的角色每步移动一格，所以两人一直同奇偶。KEY所在上房的两个下入口Gate3,4和Gate4,5都在奇格；Button6,1也在奇格。

要**首次**普通走入任一ID0门，receiver动作前必须在门邻接偶格，controller动作前必须已占奇格6,1，才能保证旧帧门开。但两人同奇偶，不能同时满足。首次进入以前也不能靠该门自己的占位开门。这个精确结构解释了“能压按钮却无法进入钥匙房”，不是假设普通KEY无法拾取。

只做静态邻接审计（非另一次资源BFS）：暂闭两ID0门、Lock，去掉真Wall/SPIKE/三箱后，1,3所属安全组件有23格，每格至少有1个安全邻格；唯一度1点为1,6、5,5、7,2。其它自由人不当墙，遇人可能融合；所有箱在这时又不可动，因此不能造四向普通等待来改变相对奇偶。SPIKE是可移动但会裸死的地形，不当成可保资源的wait阻挡。

以上穷尽信用仅用于**固定SSX、保两个F1、ordinary、已列拒绝边界**。本轮没有枚举MODEL17全部不同首次X姿态、牺牲/融合后新X、force/stack/多叶等域，也不把这一无KEY结果称为整关不可解。

## 终局库存仍缺

即使另有合法路径取得KEY并打开Lock，MODEL17丢在1,1的57也不能普通回收，可移动原箱只剩58/59两只。已核的staggered `XWWW` 需要**一cargoFork1＋两个empty buffer**（3个可用body）；这里不能直接套用。

owner私有固定复核还排除了“一个buffer＋两个free替代”：cargo7,6/F1、empty7,5、free7,3/7,2时，XWWW第三W让后free落空7,5尖刺，接触不到7,6箱，仅覆盖7,8、缺7,9。另constructed F2 cargo的XWWX尾虽可行，但本MODEL17的首freeX只给各F1，不能凭融合相加授予F2，不能称已接全解。

结论：本轮没有可交owner实际部署的KEY或全Goal候选。后续需要真正不同的保箱前置、可改变门控制时序/奇偶的资源或已证force多叶完整尾，不能靠扩大这个114已闭普通域取得新结果。

## 固定复核命令

```powershell
D:/nodejs/node.exe scratch/ch4-10-model17-key-resource-oct05.cjs seed SSXASASSS
```

该命令只重放MODEL17后的固定串，不启动搜索。脚本search模式保留供可审计复现本114图，当前已运行一次，不应重复预算或生成逐步JSON。
