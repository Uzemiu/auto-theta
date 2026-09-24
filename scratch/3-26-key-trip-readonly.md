# 3-26 潜行：KEY往返与同格接触的候选、实测修正

本只读分析agent未操作游戏、未使用提示或攻略，未读取游戏实现。实际操作由owner完成。以下已按 `artifacts/slot1-playthrough/3-26.json` events 35/37/39 的完整观察修正；没有继续搜索。

## 已实测结果

从event7/time8起实际执行候选34步 `ASSSSDSAWSAAAAAAWWWWSDDSSASSSSSSWS`，幽灵确实取得普通KEY并返回15,7，子目标达成。但最后3步SWS与模型发生偏差，**并未保持三棱镜完全不动**。

主记录event35/time42：

- PLAYER70：active=true、ghost0、key0、位置13,1。
- PLAYER86：active=true、ghost1、key1、位置15,7。
- BOX65在6,1，BOX66在14,1。
- PRISM67在1,1，PRISM68在15,1，PRISM69在1,5。

偏差来自模型把PRISM当成不可推动的墙，进而预测人物转向；实际发生BOX13,1与PRISM14,1的混合推链，将它们分别推到14,1与15,1。BOX6,1仍挡光，幽灵未提前被照亮。此前“只移动两箱且棱镜完全固定”的34步预测不能继续当作真实全程描述。

owner依据真实末态重新给出接触路线 **`WDDWWWWD`**，不是旧模型的WWWDDDWD。

- event37/time49（前7步WDDWWWW后）：PLAYER70在15,6，active=true、ghost0、key0；PLAYER86在14,7，active=true、ghost1、key1。
- 再单步D，event39/time50：两者同帧到15,7，只剩PLAYER70 active=true，key1；PLAYER86 inactive。仍是单世界线。
- **关键修正：event39的PLAYER70 properties.ghost实际为1，不是0。** 因而本例支持“同格接触后存活实体取得钥匙，合并结果仍是活动幽灵”，不支持“接触已经复活成正常活人”。原来的“接触结果未知”已过时，但也不能把结果误记为ghost0。

## 历史候选与模型范围

原起点event7/time8：alive13,5/key0，ghost15,7/key0，BOX12,3与9,3。门12,7、9,7、6,7分别由12,1、9,1、6,1按钮控制，门占用保持。

原34步模型候选的分段预测如下；owner反馈前31步及KEY获取段匹配，末3步实际偏差已如上记录：

| 本候选累计步数 | 本段输入 | 模型alive | 模型ghost | 模型BOX65 / BOX66 |
| --- | --- | --- | --- | --- |
| 4 | ASSS | 12,2 | 15,7 key0 | 12,1 / 9,3 |
| 16 | SDSAWSAAAAAA | 7,1 | 7,7 key0 | 6,1 / 9,3 |
| 20 | WWWW | 7,5 | 3,7 key1 | 6,1 / 9,3 |
| 25 | SDDSS | 9,2 | 8,7 key1 | 6,1 / 9,1 |
| 31 | ASSSSS | 12,1 | 12,7 key1 | 6,1 / 13,1 |
| 34（已失配） | SWS | 12,2 | 15,7 key1 | 6,1 / 13,1 |

私有脚本 `scratch/3-26-key-trip-readonly.cjs` 来自root-dark-box，区分普通KEY与fork；PRISM和LOCK固定为墙，只有BOX可推。含active DARK边界、SPIKE处ghost活动、明确按钮映射与门占用保持；不含装箱、叠箱、光学、世界线或钥匙开锁。**把可推PRISM当墙会改变移动回退方向，因此并不等价于“寻找不移动PRISM的路线”。** 未来若要维持棱镜不动，应保留真实可推判定，在状态转移后拒绝发生棱镜位移的候选，不能简单让它们挡路。

搜索记录：第一次上限200000，处理200000、已见238557、待处理38557，截断；扩大上限1000000后处理521324、已见546803、待处理25479时找到34步候选，未截断也未穷尽。

从失配的模型34步末态曾找到旧接触串WWWDDDWD，处理67、已见72、待处理5；这串只适用于历史模型假设，**不可从实际event35直接执行**。真实接触已由owner的WDDWWWWD完成，旧串只保留为解释模型偏差的历史记录。

本报告不宣称整关完成；主记录与owner维护的知识库负责后续光学与目标完成证据。没有新增搜索JSON，没有运行中的搜索或其他后台进程。
