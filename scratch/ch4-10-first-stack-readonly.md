# 4-10：首次异源叠箱的有限扩大搜索

2026-10-04。助手 `/root/ch3_37_cargo_revisit_oct03`。root委派范围：从已核23态扩大首次异源叠箱搜索，最多100,000扩展、深度不超过50；保两free存活和Fork1，允许x1/y1；first overlap即停止，不模拟后续stack/cargoX。本助手未操作游戏、读写save、修改owner主KB、使用提示/攻略/隐藏实现；不阻碍owner保actual52正常返回去第三章欠关。

## 脚本与精确模型域

自有 `scratch/ch4-10-first-stack-readonly.cjs` 读取观察模型 `ch4-10-readonly.cjs`，没有改主helper的 `ch4-10-revisit-readonly.cjs` 或原模型。地图、墙、SPIKE、普通左转、门配对、钥匙与锁均来自实际4-10初图和已核普通机制。

起点23：free60=3,1/F0，holder63=1,3/F1；原BOX57=4,2、58=3,3、59=4,3，均Color4；四门闭、KEY49=3,6 active，锁7,4闭，两个forkKEY已inactive。此前本助手正常只读bridge已核本次回访live23，与历史23几何一致。此搜索只是从该检查点构造模型候选，不从owner实际52执行或逆推输入。

域仅普通WASD；全过程恰两free、无capture、无死亡/合并、至少一人保Fork1；三只原BOX可移动，x1/y1不裁剪。普通相反/正交同箱推力冲突不支持，返回null。首次不同BOX同格可按M052视为候选异源叠体，后续物体运动完全不模拟。

与旧脚本在`stack`标记处early return不同，本副本先完成**当步**人物落点、capture/死亡、资源和门状态，再要求两free活及Fork1保留；没有拿输入前的旧人物状态冒称输入后仍存活。canonical仅归并同型BOX顺序，positive后另按原始ID顺序重放，恢复来源ID。哈希中Fork0的朝向省略仅适用于本次ordinary/no-X域，不外推X。

## 第一个有限positive：23后15步

追加串：`WSSSWAWWDDWSAAS`（15）。从initial的完整**模型候选**为：

`SDXASDDDAAAAAWWWAWWSSSSWSSSWAWWDDWSAAS`（38）。

搜索在21,025扩展、30,045 seen、84,099普通候选转换处命中并停止；深15，未用满100k/深50，未穷尽整个域。它是该模型/pruning域的首次positive，不声称真实游戏已输入或全局最短。

| 状态 | 原BOX57 | 原BOX58 | 原BOX59 | free60 | holder63 |
|---|---|---|---|---|---|
| 23起点 | 4,2 | 3,3 | 4,3 | 3,1/F0 | 1,3/F1 |
| 37，末动作之前 | 3,2 | 2,1 | 4,4 | 3,3/F0/faceA | 1,1/F1/faceS |
| 38，S后 | 3,1 | 3,1 | 4,4 | 3,2/F0/faceS | 2,1/F1/faceD |

末S：free60从3,3向S推原BOX57 3,2→3,1，自己到3,2；holder63从1,1向S撞1,0真Wall，转D推原BOX58 2,1→3,1，自己到2,1。两只不同来源原57/58同刻重叠3,1。两free仍active普通安全格，Fork1保留；KEY未取、锁未开、四门最终闭。

又用独立 `stack-cargo-readonly.cjs` 从实际initial完整重放38输入，配置三原BOX可形成至多2层、禁止死亡，得到完全相同free与57+58来源组。独立max_stack1模型前37全部有效，仅第38拒绝，确认这条串没有较早stack。两个模型都停止在first overlap，没有用对叠体后的自造推进来支持候选。

## 回收限制：这不是完整可恢复positive

first positive叠体位于3,1。y0为真Wall，普通上抬需要pusher3,0，不可站；允许沿row1横移不等于恢复到row2+。候选只证明可先叠不同来源箱，未证明能把Fork1 holder装进叠体并保外人、更未证明整叠cargoX可恢复库存。

剩余原BOX59在4,4，底层SPIKE。它在纯物体几何上可向开门的3,4/4,5等方向移动，但**每次普通free推它都要进入旧格4,4而死亡**；门开不取消这一代价。不能把“箱目的格可通”描述为保持两个free且三箱可运的恢复证据。cargoX推开另一箱可避免外free踏旧格已有M102，但本候选尚无这个cargo状态，不能借机制名省去capture/资源前置。

本轮没有继续搜索“更可恢复的first stack”，也没有把15串要求owner盲试或中断第三章。若后续另委派筛选可恢复first-stack，应在同一明确模型域另标目标，不能沿本次命中结果宣称所有叠箱都受这些限制。

## 整叠X：待真实短probe的机制假说

root提出的假说是：不同源两箱先叠，Fork1 cargo再X是否复制整2层；若原3BOX变5BOX，并能避免超过一只箱不可运输，可能补足出口库存。**当前没有整叠复制的实测证据**；M098验证单Color4复制，M107验证同源融合，均不能直接推出不同源完整叠体复制。

最小判别应先具备合法前态，例如不同源57/58两层叠体在3,3，活cargoFork1真正contained、容器ID/height已核，朝W；两侧2,3/4,3空且无Wall，无外人占复制落点；另一个freeFork0及第三BOX避开，所有资源已核。只单X，核两侧活BOX数量/来源/height/contained/container及两cargo活性/叉数、是否生成新timeline：

- 若两侧各保完整2层且第三BOX不动、active BOX总数3→5，才支持本个例“整叠复制”。
- 若只增加单层、只迁移、某层留原位、出现inactive或其他结果，应按实际记录更窄规则，不能为库存方案强行补足箱数。

上述是**条件probe谓词**，不是从当前row1 first-stack到该前态的合法路线；本轮不请求执行、不预记新机制。后续完整路线还需KEY、锁、合法两线及出口推位，不由5BOX假说自动解决。

## 收束

限定扩大搜索有真实模型positive，未到cap/未穷尽：23后15输入首先叠原57+58于3,1，两free活/Fork1保留。剩余箱4,4踏刺回收和row1叠体复原均未闭合；整叠X仍待合法前态的真实单动作判别。结果已发root，未宣称4-10完成或全局无解。
