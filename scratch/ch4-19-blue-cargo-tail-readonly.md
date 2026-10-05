# 4-19 新25三cargo资源：固定复算与普通尾边界

2026-10-05。只读助手 `/root/ch3_37_cargo_revisit_oct03`；唯一游戏输入 owner `/root/ch4_1_readonly`。本轮零游戏输入/存档/canonical/主JSON写，未读隐藏实现、反射dump、plugin、提示或攻略。仅写自己的本MD/CJS，未重跑旧647/782/12000域。

**当前4-19已由另一条三载人箱路线实际41完成。** 本助手只读主JSON events[112/113]（frame12877609/12877692）及completion/run，核完整41串 `WDAXDDWWWSAWWWWWWDSSSSDDWWSAWWWWWDWSWXDDD`，time41、completed=true。cargo49/48/51在5/6/7,6均active/ghost0/contained1/F0，三Prism45/46/47均traversed/testCompleted=true/lightenfalse；本次0undo、旧22undo由owner报告，SaveSlot1 completed118由root核。下文52状态阴性只是旧25源范围，不排除这个新资源完成路线。

历史25资源也已正常实测：主JSON events[81] frame12523716（同态events[83/85/87]）C4cargo48=3,4、Bluecargo52=3,3、C4cargo54=3,6，各active/F0/A/ghost0/contained1/height1，outside44=3,1F0/A活。它吻合本模型固定资源，但solefree3,1被col3盒隔在下区。旧一次ordinary尾52状态闭合、没有任何南光路覆盖，不能将25当完成尾；实际20/27属于另一条历史。

## 来源与固定25

root的 `scratch/root-ch4-19-blue-capture-resource.cjs` 从真实9 `WDAXDDWWW` 作不同谓词搜索，报告expanded1965/seen2263/pending298、cap2500/depth40，命中即停，非穷尽。本助手只固定重放命中串，不重复该资源搜索。

完整初态前缀（25）：

```text
WDAXDDWWWSAWWSDDWWSAWSDAX
```

最后6个检查点：

|总输入|动作|C4 cargoF1|Blue空箱|outsideF1|
|---|---|---|---|---|
|19|S|3,4/S|3,3|4,2/S|
|20|A|3,4/A|3,3|3,2/A|
|21|W|3,5/W|3,4|3,3/W|
|22|S|3,5/S|3,4|3,2/S|
|23|D|3,5/D|3,4|4,2/D|
|24|A|3,5/A|3,4|3,2/A|

25X：cargo的S出生推动独立Blue3,4→3,3，C4子箱落3,4；另一C4子箱落3,6。外人S孩子落3,1，W孩子落3,3，与当刻移动到来的Blue重合被装箱。预测三物理载箱为 **Blue3,3 / C43,4 / C43,6，各cargoF0/A/ghost0**，唯一outside3,1 F0/A。没有新stack/force请求或原父格占据冲突，所有Prism45/46/47仍6/5/7,8。此同tick活人capture是按已观察ordinary/X装箱规则复算，尚须游戏核验，未分配真实新ID。

## 一次精确普通尾域

私有 `scratch/ch4-19-blue-cargo-tail-readonly.cjs` **复制公开 `ch4-19-readonly.cjs` 的geometry/step**，只加本轮专用入口、边界计数与ordinary尾；不是独立引擎。没有调用root的资源BFS、旧ordinary/timing搜索。只传播WASD，无后续X、异源stack、force分支、Ghost复活或高Fork occupied-cargo新机制。所有Box row1允许，固定Prism普通推遵循实际Floor/Wall；本图顶袋让它们没有推离路径。

目标仍是三列5/6/7的南光分支各在row6/7有活observer，或相邻row7普通BOX按M054关闭支路的**强充分候选**，不是读隐藏光学算法或证明三列为必要。

运行：

```text
D:/nodejs/node.exe scratch/ch4-19-blue-cargo-tail-readonly.cjs fixed
D:/nodejs/node.exe scratch/ch4-19-blue-cargo-tail-readonly.cjs search
```

前者单串valid，后者仅一次新ordinary轮，预设cap2000/depth35，实际 **expanded52 / seen52 / pending0 / depthCut0 / exhausted=true**；同步exit0，**liveHandle=null**。rayMax0、ever=[false,false,false]，cargo最高y6，outside最高y4。rejected stack=0/force=0/occupied=0/Ghost=0，无未传播边界转移发生。模型域闭合，不提高cap。

## 外推者切口与更强资源谓词

单free3,1只能从col3下方进入。col3的3,3/3,4两个载箱与3,6前箱让它无法裸走到3,5或2,5/2,6。向北推下两箱后形成3,4/3,5/3,6三箱链，前方3,7真Wall；右边4,4真Wall、左2,4 SPIKE。将箱侧推出2,2/2,3/2,4也不能假设可右回收，因为西侧pusher1,2/1,3/1,4均Wall。裸人SPIKE会死亡，不能只看box可站的Floor判断推者可达。

因此root原“每箱静态可回收到上部”的剪枝仅忽略其他箱与推者位置作乐观必要性过滤。更强的新命中谓词应同时要求：

1. 第三cargo实际产生后仍有活outside，且outside在真实BOX作阻挡的可行步行分量中可到 **2,5/2,6**（可直接筛outside这两个位置，或另检查完全不推动Box的安全可达性）；不能忽略boxed col3再算连通。
2. 保可用载箱库存与能够依次部署到row6的站位，不将“outside在upper-left”单独称充分解。

一个明确的终端充分构型是：**三活cargo在3,6/4,6/5,6、free在2,6**，Fork均0。条件 `DD`：第一D链到4/5/6,6、free3,6活；第二D链到5/6/7,6、free4,6踩刺死亡，三个cargo都在对应南光路。这里只给三光路全覆盖的可检验条件尾，需实际Prism flags/completed确认；还没有此构型的合法初态部署前缀。不能从本轮52否定其他第二X布局、先分叶/stack/活Ghost或新机制。

本轮不建议owner仅为得到库存数字重建25；需要先闭合outside所在分量及完整输送条件。root继续不同谓词资源审查，本助手不盲升cap或另跑相同图。
