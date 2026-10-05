# Chapter4 世界导航有限只读核查

2026-10-04。助手 `/root/ch3_37_cargo_revisit_oct03`；唯一输入owner `/root/resume_slot1_oct03`。本轮仅正常bridge `theta_observe(full=true,include_map=true)`及只读 `artifacts/slot1-playthrough/chapter4-world.json`；未输入游戏、读取隐藏实现、写save或owner的KB/progress/handoff。没有解题或世界物体运输大搜索。

## 观察时点

实际scene4-0/world Chapter4，timeline74、time36。自由人66在-31,4，active/ghost0/key0/split0，朝A。这是owner从4-15正常返回-26,-11后，到4-X东邻的时点。只读live与主JSON events[101]的undo后状态一致；其后场景若变化必须以owner新观察为准。

入口关键字段：4-15在-27,-11，blockablefalse/pushablefalse；4-16在-30,-11，同样blockablefalse/pushablefalse；4-17在-34,-11、4-18在-37,-11仍blockabletrue/pushablefalse；4-25在-43,6仍blockabletrue/pushablefalse。4-X在-32,4，blockabletrue/pushabletrue。入口的blockablefalse只表示不阻挡，不能推导已完成、可无加载穿过。

## 4-16：不只是“wrapper避所有ENTRY”的假阴性

以owner返回点-26,-11为起点，固定所有当前实体/门/入口位置，普通四邻安全图分别作有限对照。Wall与当前blockable实体阻挡，SPIKE不当活外人安全路；仅target入口允许作为末格。

| ENTRY策略 | 地形策略 | 4-16目标-30,-11 | 可达安全格 |
|---|---|---|---:|
| 避所有ENTRY（target除外） | SOLID | None | 150 |
| 放行所有非blockable ENTRY，仅禁未完4-15 | SOLID | None | 371 |
| 同上 | 额外乐观允许ICE逐邻通行 | None | 395 |
| 只看实体blockable，错误地容许穿未完4-15 | SOLID | AAAA | 路径4步 |

4-15的上下-27,-10/-27,-12都是真Wall。最短AAAA会在第一A踩-27,-11，正常触发未完4-15加载；它不能当可继续穿越到4-16的四动作串。即使将其他全部非blockable ENTRY都当可通，唯独避4-15仍到不了4-16及其四邻。因此本时点4-16不是仅因过度避开其他已完成ENTRY而漏路；4-15是当前安全固定几何的切口。该结论不声称任意未来解锁、物体运输、叉分裂或组合机制都无路。

ICE版本是用于否定通路的乐观邻图，未模拟自动滑行与停格；不能把其中任意positive路径当已实测可执行。4-16的None在此乐观图仍成立，未用忽略ICE来误作封路。

## 4-X：可到东邻，不等于可进入或可推

从-26,-11，避所有ENTRY的SOLID路径 `WDDDWWWDDDWWWWWWWWWAWAWWAAAAAASAAA` 可到东邻-31,4；owner已实际走完34输入，主JSON events[90]/[91]验证。

局部地形：

- X入口-32,4是可推blockable实体，底层SOLID。
- 西背格-33,4是真Wall，无法从东邻向A将X推出。
- 东邻-31,4的北-31,5和南-31,3都是SPIKE；不能作为活外人绕北/绕南路径。
- X南-32,3、北-32,5虽是SOLID，但当前安全组件不能达到；允许其他非blockable ENTRY并仅禁4-15、甚至乐观放ICE也均None。

owner的真实主JSON闭环支持这个局部约束：events[92]/[93] confirm后仍scene4-0/time36/人-31,4；events[97]/[98]单A没有移动X，玩家受阻转S落-31,3，activefalse/ghost1，time37/player_count0；events[100]/[101]正常undo1恢复time36/-31,4。preview后的observe也未加载，但本助手未操作这些动作。root随后再次确认同一结果。

因此当前只得到“4-X东邻可达”；没有正常安全可执行的“去南侧后推W”前缀，也没有证据把confirm或东邻A当关卡进入。玩家当前叉0，未把同刻分裂、载入口或跨刺新机制当现成路线。NID104在-32,6，仍active，本报告不计收藏取得。

## 已有无需穿未完入口的普通候选

未完普通4-10在-21,-2，blockablefalse/pushablefalse。从返回点-26,-11，避全部其他ENTRY的安全SOLID路径 `WDDDWWWDDDWWWWA` 到南邻-21,-3，再单W踩4-10入口。普通导航图支持到邻及最后踩入口；本助手未执行，也未将它称已加载。其他已完成入口旁边可达不提供新增完成证据；4-25本时点仍是不可推、blockabletrue，抵达附近也不能据此称可进入。

root通知owner将正常回访4-10，本助手封存本导航范围并停止扩世界。当前固定单自由人安全几何没有提供绕未完4-15到4-16、或4-X南/北的路线；所有未来关卡完成、门变化、可推入口搬运与新资源机制均留待新的实际观察，不作Chapter4全局不可达断言。

## 2026-10-04 新出生点与开放普通字母关（`/root/ch4_1_readonly` 追加）

私有脚本 `scratch/ch4-world-open-letters-readonly.cjs` 只读取主journal的最后完整 `level.id=Chapter4` 世界观测。source event164实际P66=[2,4]，Fork0，零instructions；其后event168/169实际普通WW至[2,6]，Fork0/time2。未执行游戏输入、存档写入、提示或隐藏实现读取。

这次目标与旧4-15→4-16西侧搜索不同：4-J/K/L/M/N/O分别在[-19/-16/-13/-10/-7/-4,-18]，4-Z在[50,-3]，均实际blockable=false、AlwaysEnable=true、无UnlockRequireLevel，底层都是SOLID。普通J–O关需独立进入、完成后计关；已有组合通关不能替代普通完成。

模型使用普通WASD、真实ICE续滑、当前blockable覆盖tile、无X/推物/环绕。已验证完成ENTRY允许穿行（M110仍需现场遇到后核自动加载情况）；未完成ENTRY仅选定最终目标允许进入。4-U/V/W仍pushable=true，不将它们当墙触发虚构fallback，也不把接触推入当安全路线。

- 从event164 [2,4]到4-O：**374/374**稳定位置队列耗尽，无安全普通路线。
- 从WW后的event168 [2,6]把J–O/Z全部允许作最终目标：同样**374/374**耗尽，无hit。

J–O下方区域的明确切口：[-19,-14]为SOLID，[-19,-15]为SPIKE，[-19,-16/-17]为SOLID；[-20,-15]/[-18,-15]均无tile，[-20,-14]/[-18,-14]是真Wall覆盖SOLID。当前普通安全域可以到[-19,-14]，但跨至南区需踩该地刺。本轮不建议owner为此尝试死亡。

J–O入口本身及各四邻均SOLID、未被Wall盖住。Z入口北[50,-2]和东[51,-3]为SOLID，西[49,-3]及南[50,-4]无tile；当前安全域未能到Z两邻。故“入口开放”不等于当前单自由人安全可达。

timeline min_anchor=[-83,-19]、size=[139,29]。当前普通安全域仅在北界y10可停[-23,10]/[-43,10]两处ICE，而对应条件南边界[-23,-19]/[-43,-19]均无tile；不能只按普通关卡size+1环绕直接拼出有效入口路径。未额外扩大环绕、动态按钮/可推入口输送域。

本轮无新的可执行positive，未新访问或误记J–O/Z；没有运行中的搜索。后续若获得箱/载入口/鬼魂或其它合法世界资源，再按新实况核输送，当前374域不作全机制不可达结论。
