# 4-1 对偶只读分析

2026-10-03；不操作游戏，只使用 4-1 主 JSON 的真实观测。唯一输入 owner：resume_slot1_oct03。

## 几何与已验证边界

初始 8×8（实际坐标 0..8）外边墙；内部墙1,6 /4,6 /7,6；两目标1,7 /7,7只有水平邻SPIKE2,7 /6,7可接近。Color4 BOX4,4，PLAYER4,2 fork0，两叉2,2 /6,2。

旧17输入 AAWDDWDDSSAAWWXWW 得两个free3,6/5,6 fork1，同奇偶。单箱普通移动/捕获机制在没有等待、额外分裂或新机制情况下无法打破双人的奇偶关系；不等价游戏无解，不把Color4未知属性直接当普通红/蓝箱。

真实新9态 AAXDDDDSX 有三free7,1/7,2/5,2均fork0，BOX4,4。旧WAWWWDD会在6,7牺牲其中一人，最终cargo6,5/BOX6,5和free5,5；owner实际普通Color4 cargo内fork0单X无时间、instructions或实体变化。

## 新候选：保三人装箱再同刻异向推

本模型排除任何多向同时推箱（Color4结果未知），只模拟已知左转受阻、单箱推动、同刻汇入装箱、普通地刺死亡和稳定合并。完整重放真实WAWWWDD得到同样cargo6,5/free5,5，并预报6,7死亡。

从新9态追加 **ASWWWAWDD**（9输入）得到：

| 新增步 | BOX | 三角色（其中容器标注） |
|---|---|---|
| 0 |4,4|7,1 /7,2 /5,2|
| 2 AS |4,4|7,1 /6,1 /4,1|
| 5 WWW |4,5|7,4 /6,4 /4,4|
| 7 AW |4,5|6,5 /5,5 /3,5|
| 8 D |5,5|7,5 /6,5 /4,5|
| 9 D |6,5|6,5 contained /7,5 free /5,5 free|

全部仍active且fork0。小型有界查找仅1743扩展、3226见过状态；22步上限，非全关巨量搜索。

这里下一单 **D** 具有明确几何异向推：5,5外人直接D推6,5箱向右；7,5外人先右8,5墙、再上7,6墙，再左A推同箱向左。cargo不主动推动，若此Color4冲突生成不同分支，需实测它是否如M042保留未参与cargo，两支各运载箱到一个目标；若复制/排斥等其他结果，按真实状态另拟路线。不能在测试前写成完成、默认蓝箱分裂或默认复制容器。

模型文件：scratch/ch4-1-readonly.cjs。只用于该固定fork0前置，无X/未知Color4冲突求解功能。

## 实测修正与可回收正交分支

owner先独立 WAWAWWAA 得 cargo2,5/free3,5/4,5全部活；但剩两外人异奇偶，模型22步16506状态未到同箱异向推位。普通undo8回9态后，实测ASWWWAWDD全部匹配，18态cargo6,5/free5,5/7,5。下一D在19态实际分支成功并复制cargo，不过右分支BOX7,5卡普通死角，因此普通undo1回18态。

追加 **W**（time19，主JSON events37）真实BOX5,5 cargo/free6,5/5,6；再单 **A**（time20，events39）真实产生两条线：

- axis0 BOX4,5 / cargo4,5 / free5,5，上方参与冲突玩家inactive。
- axis1 BOX5,4 / cargo5,4 / free5,5，右方参与冲突玩家inactive。

这是已读主JSON确认，不再只是Color4候选。未参与推力的cargo两支均保留active、contained1。正交构型避免反推右侧BOX7,5死角。

## 后续短尾（提供owner，待完成实际核验）

从axis0 BOX4,5/cargo4,5/free5,5，**AASAWWDWA** 9方向输入：前AA到BOX2,5，自由者3,5；SA绕到2,4；WW载BOX越刺到2,7/推者2,6；DW到3,7；末A载BOX到goal1,7，推者落SPIKE2,7死亡。

从axis1 BOX5,4/cargo5,4/free5,5，**ASDSDWWWAWD** 11方向输入：AS到4,4，D将BOX6,4；SD绕6,3；WWW载BOX到6,7/推者6,6；AW到5,7；末D将载BOX送goal7,7，推者落SPIKE6,7死亡。

这两条均用同一已校验模型逐步推演，未使用X/未知新行为。普通切线T按实际axis，各目标覆盖后切到较晚time31线核验completion，非当前线显示投影时勿当作本地末端。

## 完成实际闭环

已独立读取主JSON completion和events45：**completed=true**，有效instructions共41字：

`AAXDDDDSXASWWWAWDDWAAASAWWDWATASDSDWWWAWD`

最终axis0 time29，BOX和active contained PLAYER均1,7，外推者2,7 inactive；axis1 time31，BOX和active contained PLAYER均7,7，外推者6,7 inactive。正交冲突后两条9/11方向短尾真实全部匹配，切线T只发生一次（在两条短尾之间）；最后较晚线末D直接完成，**没有额外末T**。历史实验2次retry/9次undo保留，41只是最终有效instructions长度，不冒充初次无撤销路线。

owner负责主KB/机制M095/进度并继续4-2；本helper只写自身scratch两文件、没有游戏输入或存档写入，任务完成。
