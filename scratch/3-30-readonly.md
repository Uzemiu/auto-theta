# 3-30 只读叠箱接触候选

没有操作游戏；未读取游戏实现/隐藏答案/攻略。保持Color1与Color3箱的身份，不将它们作为相同箱规范化。

## 初态12输入候选

`SSSWWXWWWWWW`

- 前3个S因row0墙顺时序左转向右：玩家4,1→5,1→6,1取fork→7,1。
- WW到7,3门；7,2按钮开门，玩家占7,3时保持门通行。此门映射已经实际观测。
- X从7,3朝上产生6,3与7,4两人。
- 后续W把左人沿row3送到3,3再上行，右人沿7列向上到7,7再左推Color1箱。
- time11：players3,5和5,7（右人key1）；Color1箱4,7、Color3箱3,6。
- 第12W：右人因5,8墙向左推Color1箱4,7→3,7；左人向上推Color3箱3,6→3,7。两箱同刻汇入3,7，玩家预期3,6/4,7。

## 模型与真实机制界限

临时内存修改scratch/root-3-27-geometry.cjs：遇两个箱最终同格只返回stack接触标记及位置，不继续推演叠加/颜色结果。ordered_boxes=true；显式gate7,3→button7,2。搜索121已见状态找到上述12输入，未达到30000上限。

M052的3-1实测支持两个Color3箱同刻汇入同格触发height1/2叠加，之后整叠可移动。该证据不直接证明本关Color1+Color3混色也能叠加。3-30的不同颜色交互、叠层朝向、后续分线等均须以实际第12W后的完整属性为准。

普通模型1423状态或cargo模型2601状态没有解，均不包含此次叠箱接触后的真实结果，因此不能作为本关无解证明。

已向root和唯一输入owner/root/slot1_resume_chapter2发送候选，建议当前3-29完成后再回访；不催促或抢夺输入。所有只读进程已结束，无新增JSON/CJS。


## 后续实测与短收尾候选

初态12输入已由owner实际验证。event8/time12：BOX58 Color1 height1/contained0，BOX59 Color3 height2/contained1/container58，同在3,7；玩家55在3,6 key0、60在4,7 key1。不同颜色确实可形成叠加。

紧接第13A整叠到GOAL2,7时被观察，event10已出现两条世界线：axis0仅Color1箱，axis1仅Color3箱；两线均为箱2,7、双活人3,5 key0 / 3,7 key1。正常自动对话解释不同物体叠加被观测。原“整叠视为一物”的普通模型仅适用于观察之前，不能越过目标继续用于否定分线解。

从event8将contained上层箱从碰撞列表过滤、用一个刚性箱代表整叠，小模型399状态搜尽未到双goal；收到实测分线后立即停止该方向，无后台进程。这不是实际游戏无解证据。

从event10真实axis0/time13，普通cargo+门/钥匙模型找到8输入`SAASAWWW`（115已见状态，102扩展，min_players2），开2,3锁并到1,5目标，另一人3,5，无合并。另一真实axis1/time13仅需`A`，箱2,7左推1,7，持钥匙人到2,7目标，另一人3,4。最后切回较晚time21线检查完成。该收尾候选已发root/owner，最终是否实际完成以主JSON为准。


## 实际完成补充（root核验）

owner已按初始12步、单A、分线收尾全部实测。实际最终串为SSSWWXWWWWWWAATSSSSAAWW，共23输入；两分支均完成其目标，主JSON已有completed=true。root只读核验SaveSlot1 answer state3且LevelRecords编码完全匹配，累计87关。报告前述收尾串属于原候选，实际采用同长度SSSSAAWW而非SAASAWWW；不改写真实操作记录。M076与solutions/3-30.md保存最终解法。Creation成就仍未获得本地缓存确认。
