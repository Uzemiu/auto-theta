# NID2 实际叠图再访候选（2026-10-02）

只读辅助，游戏 owner 为 resume_slot1_oct02。没有隐藏实现、提示、外部攻略或新全图搜索。保留 `star2-route-analysis.md` 的旧 dy2 / 74 输入历史假设；本文件基于本次真实 dy0 初态重新适配。

## 已实测世界组合与接缝

星1后实际 Chapter1 单人 [4,27]，朝下，fork1。52 输入导航至 [36,39] 朝左：

`WWWWWWDDSSSASDDDDSSWWWWWWDDDDDDDDDDDDDDDDDDDWWWDDDSW`

随后沿旧49输入第4步开始的46尾：

`XWAASSAWAWAWAWAWAWWSASSSSSAAAAAAWAWWWAAAAAAAAD`

Owner 已实测98输入并确认重入，实际得到 `1-6+1-20`，size=[21,12]，左图 dy0、右图 dx9。初态保存于 `artifacts/slot1-playthrough/1-6+1-20.json`。左人 [4,1]，右人 [15,1]，星 [7,6]，接缝锁 [8,4]，所以不能直接复用旧 dy2 资源路线。

实际前8输入 `DDDWWWDD` 已全部吻合：首 D 右原人落 [16,1] 刺变 inactive；第6输入存活人 [7,4] fork1/key2；第7 D 开接缝锁 key1；第8 D 安全进入 [9,4]。

## 48 输入资源前置

`DDDWWWDDDDDDWWAWWDDDDDDDWSASSASSASSAAWWAWSAAAAAA`

改变只有两处：从 [9,4] 沿 [13,5] 叉子所在安全桥到 [12,7]，提前收取该叉；回程从 [13,5] 下到 row4 再左返，而不是旧 dy2 的 row6 左返。

| 输入数 | 预测位置 | split/key |
|---|---|---|
| 8（已实测） | 9,4 | 1/1 |
| 13 | 13,5 | 2/1 |
| 16 | 12,7 | 3/1 |
| 25 | 19,9 | 4/1 |
| 28 | 18,7 | 5/1 |
| 31 | 17,5 | 6/1 |
| 34 | 16,3 | 7/1 |
| 38 | 14,3 | 8/1 |
| 41 | 13,5 | 8/1 |
| 48 | 7,4，朝左 | 8/1 |

## 30 输入取星尾

`XXAAAXXAAWXWWXXWWWWDWDDSXDDSDD`

完整78输入：

`DDDWWWDDDDDDWWAWWDDDDDDDWSASSASSASSAAWWAWSAAAAAAXXAAAXXAAWXWWXXWWWWDWDDSXDDSDD`

| 累计输入 | 关键预测 |
|---|---|
| 50 | 7,2 / 7,4，两人split6/key1 |
| 55 | 3,1 / 4,2 / 7,1 / 5,1，split4；4,2开中央锁后key0，其他key1 |
| 56 | 2,1 / 4,1 / 6,1，均split4/key1；4,1合并0+1，预测朝下；6,1合并1+1 |
| 61 | 左第二锁1,3已开 |
| 63 | 1,3合并0+1后key1，预测朝上；涉及原地人和分裂新人，须单步核 |
| 64 | 左三锁全开，前人1,4 key0 |
| 71 | 星路首锁4,6开；上区原3,7 key0 /4,6 key0 /3,5 key1 |
| 72 | 三者合并到3,6 key1、split1，预测朝下；另一人在4,1 key1、split1 |
| 73 | 最后X，上区4,6 /2,6，下区5,1 /3,1，均key1/split0 |
| 74 | 第二星锁5,6开 |
| 75 | 4,6的key0+key1合并保留key1，预测朝左 |
| 77 | 最后星锁6,6开 |
| 78 | 活人到星7,6，另外两人7,4 /7,2均key1，全部split0 |

这些为读取实际 initial 的确定性模型复放，尚不能替代真实分裂/合并语义与收集验证。继续采用旧报告的局部“同一前方分裂去重”保守模型，未修改共享模型。零与非零资源合并已有具体实证，但任意三人合并朝向、叉子保留、同输入钥匙锁结算仍须实际逐点验证。若任一点不匹配，停止后缀并按现场重算。

复放：`D:/nodejs/node.exe scratch/chapter1-nid2-revisit-readonly.cjs`，只读实际初态，打印78步预测，无游戏调用。星2最终应由游戏拾取及正常存档 Collections[2] /星数核验；普通组合完成不是必要验收替代。

## 实际执行更新

Owner 后续报告新78输入成功，56/63/72/75关键位置、朝向、钥匙全部吻合。第78步出现“2号星星 想要多少，就有多少”UI，人位于7,6/7,4/7,2。正在正常确认返回后核持久化，本报告不替代主JSON与存档最终验证。

正常返回后 owner 已核 Collections[2]=true，星数4。Chapter1 events[96] 单人 [38,21] 朝下、fork1、time0。
