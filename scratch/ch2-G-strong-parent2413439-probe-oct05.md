# 2-G 新strong布局：精确父2413439

当前暂停/损盘状态：这个raw40固定proof与组件桥仍可独立重放；原巨checkpoint在后续1820000自动保存失败后为0字节，不能恢复完整队列。TTY48564曾真实归档该hit（history5→6）并补父A/S/D；末D同组件另归档history6→7、补余动作计数4。后来48564真实exit1，未到1844263。以下checkpoint保存/父剩余动作内容是其1748972历史时点，不是当前仍持久化事实；事故见 `ch2-G-checkpoint-save-failure-oct05.md`。

MODEL ONLY，未实测；已严格核为有限ordinary组件覆盖，不建议重复部署。它不是full concrete actual98/102 duplicate，不能称同一实际物理字典。由同source60巨frontier继承，不是新根。

原始串`DDAWDWAASSWDDASSDSASAWWDWAWDWADSDAWDWADW`，40输入；前39串`DDAWDWAASSWDDASSDSASAWWDWAWDWADSDAWDWAD`全部单叶/无force/无未知，最后单`W`另核。公开source259，恢复350/418与源整14字典由owner/root核。

checkpoint stats：`{"expanded":1748972,"seen":2429310,"pending":722772,"concreteNodes":2491326,"done":1748972,"depthLimit":60,"depthCut":0,"depthDeferred":0,"maxDepth":53,"forces":1671,"maxLeaves":3,"priorityLeft":100,"targetPolicy":"leaf-resource-upper-bound-four","historicalHits":5,"completedParentRemainders":3}`。唯一checkpoint保留此hit，父剩余动作索引1，不得丢余动作。实际执行session/PID/exit另据工具记录，不由旧报告猜。

39个concrete祖先逐ID p/b全部match，firstMismatch=null，末动作pre/force/leaves与checkpoint full modeled fields一致。full concrete signature repeatsActual98=false，repeatsActual102=false；不按理论箱总量授予四Goal完成。

| 前态输入数 | modeled所有实体 |
|---|---|
| 4 | 105(14,10)/W; 106(11,8)/W; 107(7,1)/S; 108(4,1)/S; 109(1,1)/S; BOX 110(8,9)/stop/src-1; 111(8,5)/stop/src-1; 112(6,7)/stop/src-1; 113(3,9)/stop/src-1; 114(2,9)/stop/src-1; 115(11,9)/stop/src-1; 116(8,7)/stop/src-1; 117(7,7)/stop/src-1; 118(5,7)/stop/src-1 |
| 8 | 105(14,8)/S; 106(10,9)/A; 107(7,1)/S; 108(4,1)/S; 109(1,1)/S; BOX 110(4,9)/stop/src-1; 111(8,5)/stop/src-1; 112(6,7)/stop/src-1; 113(3,9)/stop/src-1; 114(2,9)/stop/src-1; 115(8,9)/stop/src-1; 116(8,7)/stop/src-1; 117(7,7)/stop/src-1; 118(5,7)/stop/src-1 |
| 12 | 105(14,8)/W; 106(11,8)/D; 107(8,4)/W inactive(g1,m0); 108(6,7)/D; 109(3,9)/D; BOX 110(8,9)/stop/src-1; 111(8,5)/stop/src-1; 112(7,7)/stop/src-1; 113(4,9)/stop/src-1; 114(2,10)/stop/src-1; 115(10,9)/stop/src-1; 116(10,7)/stop/src-1; 117(8,7)/stop/src-1; 118(5,10)/stop/src-1 |
| 16 | 105(14,6)/S; 106(11,6)/S; 107(8,4)/W inactive(g1,m0); 108(5,1)/S; 109(2,1)/S; BOX 110(10,9)/stop/src-1; 111(8,5)/stop/src-1; 112(8,7)/stop/src-1; 113(8,9)/stop/src-1; 114(2,10)/stop/src-1; 115(11,9)/stop/src-1; 116(11,5)/stop/src-1; 117(10,7)/stop/src-1; 118(5,10)/stop/src-1 |
| 20 | 105(14,4)/S; 106(11,4)/S; 107(8,4)/W inactive(g1,m0); 108(5,1)/D; 109(2,1)/D; BOX 110(10,9)/stop/src-1; 111(8,5)/stop/src-1; 112(8,7)/stop/src-1; 113(8,9)/stop/src-1; 114(2,10)/stop/src-1; 115(11,9)/stop/src-1; 116(10,5)/stop/src-1; 117(10,7)/stop/src-1; 118(5,10)/stop/src-1 |
| 24 | 105(14,8)/W; 106(11,6)/D; 107(8,4)/W inactive(g1,m0); 108(5,1)/D; 109(2,1)/D; BOX 110(10,9)/stop/src-1; 111(8,5)/stop/src-1; 112(8,7)/stop/src-1; 113(8,9)/stop/src-1; 114(2,10)/stop/src-1; 115(11,9)/stop/src-1; 116(10,7)/stop/src-1; 117(10,8)/stop/src-1; 118(5,10)/stop/src-1 |
| 28 | 105(14,10)/W; 106(11,8)/D; 107(8,4)/W inactive(g1,m0); 108(5,1)/D; 109(2,1)/D; BOX 110(10,10)/stop/src-1; 111(8,5)/stop/src-1; 112(5,7)/stop/src-1; 113(8,9)/stop/src-1; 114(2,10)/stop/src-1; 115(11,9)/stop/src-1; 116(8,7)/stop/src-1; 117(10,9)/stop/src-1; 118(5,10)/stop/src-1 |
| 32 | 105(14,8)/S; 106(11,8)/S; 107(8,4)/W inactive(g1,m0); 108(5,1)/S; 109(2,1)/S; BOX 110(10,10)/stop/src-1; 111(8,5)/stop/src-1; 112(5,7)/stop/src-1; 113(2,9)/stop/src-1; 114(2,10)/stop/src-1; 115(11,10)/stop/src-1; 116(8,7)/stop/src-1; 117(8,9)/stop/src-1; 118(5,10)/stop/src-1 |
| 36 | 105(14,10)/W; 106(12,9)/D; 107(8,4)/W inactive(g1,m0); 108(5,1)/D; 109(2,1)/D; BOX 110(10,10)/stop/src-1; 111(8,5)/stop/src-1; 112(5,7)/stop/src-1; 113(2,9)/stop/src-1; 114(2,10)/stop/src-1; 115(11,10)/stop/src-1; 116(8,7)/stop/src-1; 117(8,9)/stop/src-1; 118(5,10)/stop/src-1 |
| 39 | 105(14,9)/W; 106(12,10)/D; 107(8,4)/W inactive(g1,m0); 108(5,2)/D; 109(2,2)/D; BOX 110(8,10)/stop/src-1; 111(8,5)/stop/src-1; 112(5,7)/stop/src-1; 113(2,9)/stop/src-1; 114(2,10)/stop/src-1; 115(10,10)/stop/src-1; 116(8,7)/stop/src-1; 117(8,9)/stop/src-1; 118(5,10)/stop/src-1 |

末W的force：`[{"tick":6,"box":114,"cell":[2,10],"requests":[{"d":0,"src":109,"kind":"player"},{"d":1,"src":106,"kind":"inertia"}],"path":[]}]`。每微拍完整p/b/requested在固定probe导出last.leaves[].trace；不把微拍加总写成游戏time。

| 胜者 | 终MODEL所有实体 |
|---|---|
| 109 /left2 | 105(14,10)/W; 106(10,10)/A inactive(g0,m1); 107(8,4)/W inactive(g1,m0); 108(5,7)/W; 109(2,9)/W; BOX 110(5,11)/stop/src-1; 111(8,5)/stop/src-1; 112(5,10)/stop/src-1; 113(2,10)/stop/src-1; 114(2,11)/stop/src-1; 115(8,10)/stop/src-1; 116(8,7)/stop/src-1; 117(8,9)/stop/src-1; 118(3,10)/stop/src-1 |
| 106 /left2 | 105(14,10)/W; 106(10,10)/A; 107(8,4)/W inactive(g1,m0); 108(5,7)/W; 109(2,8)/W inactive(g0,m1); BOX 110(5,11)/stop/src-1; 111(8,5)/stop/src-1; 112(5,10)/stop/src-1; 113(2,9)/stop/src-1; 114(1,10)/stop/src-1; 115(8,10)/stop/src-1; 116(8,7)/stop/src-1; 117(8,9)/stop/src-1; 118(2,10)/stop/src-1 |

physics保原conservative M133；derived finite A-wall/Wcross和one-front链没有默注原巨图。capture/stack/更广player crossing/未校准force保持边界，下一普通尾若遇必须实测，不把2free当全关必要预算。

## 四固定动作与唯一保库存桥

只对A106叶固定W/A/S/D，采用48公开props帧校过的finite clone，不开BFS。W/A/D均valid、无force/unknown，但只剩1functional left；S唯一仍保2free：106[10,9]/S、108[5,2]/S、right105[14,9]/S，九箱位置未改。S后ordinary key在旧A2496的index1/depth1/path `S`，也在新42 A2496的index1514/depth21/path `SAWSWDSSSSSASWWWWAWWS`。W109叶本身key直接等于新42 W175根index0。

因此没有新的ordinary secondforce小根值得重复展开；仅保此新A根及一输入桥证明。这个覆盖判断只用于普通无cargo/noX/noDARK模型及既有key（活PLAYER ID/位置、right位置face、匿名BOX坐标）；不证明真实BOX身份、inactive位置、timeline历史或Goal测量全局无关。所有capture/stack/其他未校准机制、父剩余动作和原巨队列完整保留。首四动作脚本初次将字符串m.A误当数组map而exit1，没有文件/队列/游戏变化；改为spread后同四fixed exit0。

只读巨audit session8708真实exit0：39个concrete祖先与末W全stored p/b/force match，checkpoint expanded1748972/seen2429310/pending722772/q2491326/done1748972/forces1671/history5；TTY42207此前真实exit0。没有把独立小域覆盖记为游戏完成。

## 已封普通组件只读比较

下表仅用既有ordinary key（活PLAYER IDs/坐标、right位置与face、匿名BOX坐标）判断有限模型覆盖；不是实机BOX身份/失活角色位置全局无关定理。没有为该比较开启BFS。

下列unknown名称来自原保存的历史boundary键，可能包含已校准迁移的旧窗口；不把历史名称都称为当前仍未传播项。

`artifacts/solver-frontiers/ch2-G-strong38-second-forces-oct05.v8` / m133-a-wall-w-cross-finite
- choices109：seen=false，matchedIndex=-1，depth=null，源后串``，sealed expanded/seen/pending=175/175/0，unknown=unverified-player-cross
- choices106：seen=false，matchedIndex=-1，depth=null，源后串``，sealed expanded/seen/pending=2496/2496/0，unknown=new-capture,perpendicular-free-box

`artifacts/solver-frontiers/ch2-G-strong42-second-forces-oct05.v8` / m133-a-wall-w-cross-finite
- choices109：seen=true，matchedIndex=0，depth=0，源后串``，sealed expanded/seen/pending=175/175/0，unknown=
- choices106：seen=false，matchedIndex=-1，depth=null，源后串``，sealed expanded/seen/pending=2496/2496/0，unknown=new-capture
