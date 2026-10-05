# Chapter4 4-X返回后的4-19与COL12只读导航

2026-10-04，唯一输入 owner `resume_slot1_oct03`。仅读公开实际世界 JSON，无游戏输入、save/主KB/主JSON改动、提示、攻略或隐藏实现。parent随后要求优先封本报告、转4-19建模，故没有额外枚举所有其它普通入口。

## 4-19导航已实际闭环

来源 `artifacts/slot1-playthrough/chapter4-world.json`：

- events252：正常从4-X返回Chapter4 fresh0，P66[-31,-12] active/ghost0/key0/Fork1，单人，time0；4-X重新在[-32,4]。root当时核112关6星。ENTRY12/4-19在[-43,-12]，active、pushable=false/blockable=false、AlwaysEnable=false，普通未完入口。
- events253：请求10A，但首A进入ICE[-32,-12]时busy/input_locked，只实际executed1、remaining9；不能把请求10字符当已经10输入。
- events254：滑行稳定P66[-33,-12]，instructions A/time2。首A真实跨2格，经ICE入SOLID停止，Fork1未耗。
- events255/256：正常补9A，沿row-12真实SOLID到[-42,-12]，time11，叉仍1。
- events257：再单A踩[-43,-12]，回执input_locked。
- events258：真实正常加载 `counter /4-19 反制` fresh0；已进入，未预记完成。总11有效A输入/time12附近加载，以真实初始化为准。

所以从返回fresh[-31,-12]的路线是 **11A**，而从本助手首次读取的实际254[-33,-12]只剩 **10A**。任务过程中owner已经执行，助手没有补发输入。row-12从x=-33到-43连续实际SOLID，无墙覆盖/刺/KEY/LOCK或别的入口；4-16[-30,-11]、4-17[-34,-11]、4-18[-37,-11]处在上行，不被误踩。下一西方4-21[-46,-12]仍blockable，不能接着盲推。

本导航真实跨冰例也支持按完整滑行观察再补batch剩余输入；有效动作数与tile微拍/time不同。没有把世界pushable水晶当静态墙来制造假fallback。

## COL12：裸人普通导航的明确切口

events254/256完整world图：COLLECTION65/NID12在[-68,-17]，active、Reverse=false，底层SOLID。尚未收取，**收藏类型仍unclassified**，不从NID先当星。

其四个正交邻格都是SPIKE：北[-68,-16]、东[-67,-17]、南[-68,-18]、西[-69,-17]。周围还有[-67/-69,-16/-18]刺环。任何不跳格的裸活人普通WASD最终进入COL12前，都需踩一个裸刺；不能由当前Fork1推出可安全跨过这圈地形。普通X也不自动跳两格或使inactive裸Ghost复活。

上方4-Y在[-68,-10]是active/pushable/blockable的入口，南列[-68,-11..-15]是SOLID，[-68,-16]才是第一刺。可能的**资源条件**是一个可安全载活人的body加一个外推者：若正常可保持live cargo、把body送到[-68,-15]且外人[-68,-14]，两次S可把body送[-68,-16]再[-68,-17]，推者最后踩[-68,-16]死，cargo可在COL格保活。普通箱过刺M059/M108与已完成世界入口载人M091提供条件类比；是否COL12对contained角色拾取仍须actual核。

若body使用4-Y移动入口，未完成入口首次capture会正常入关，**不能直接假定它可载人留world**；需正常完成后恢复可载条件，或其它已真实获得的适用资源。main另做4-Y捕获，本助手不重复其搜索。本报告未给COL12完整合法前缀，不信用已取收藏，也不把当前裸人切口写为全机制无解。
