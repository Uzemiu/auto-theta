# 4-16正常回访fresh0：保F2与三个蓝缓冲箱（2026-10-05）

正常返回4-18实际53后，从World[-36,-11]F1走SDDDDWD进入4-16[-30,-11]；world events406..413保存完整收据与加载，ICE在第5方向D忙只续剩余W，末D单步入场。4-16主event[16]/frame16136487：fresh0/time0/leaf51，free49[4,2]F0/S，C4 BOX45/cargo50[5,5]F2/S/ghost0活contained1；Blue46/47/48空3,3/4,3/5,3。两个Fork库存全在初cargo，场上无KEY/Fork实体。没有关内输入；新回访0undo0retry，旧7undo0retry实验全保，未重放WWAXDX、未重跑旧12000，当前无solver/session。118完成6星，未完成本关。

地形Wall优先：

```text
8 #########
7 #..^^^###
6 #..^^^###
5 #..^^^###
4 #....####
3 #.......#
2 ##.....##
1 #G.^^^.G#
0 #########
```

Goal1,1/7,1；SPIKE仅3/4/5,1及3/4/5,y5..7。无ICE/DARK/门/锁，外框全Wall。已以正常Unity截图核fresh图；不能凭Floor层盖过43个Wall。唯一输入owner /root/ch4_1_readonly，Slot1，禁提示/隐藏实现/反射/存档改写。下一只核具有具体运输或分叶收益的新构型。

---

# 4-16 活塞：只读模型首轮

2026-10-04。脚本 `ch4-16-readonly.cjs`。仅读取普通关卡观察与已验证知识；无游戏输入、提示、攻略、隐藏实现、存档或主KB修改。

## 实际初态与回归

`artifacts/slot1-playthrough/4-16.json` initial为Template4、piston、零输入。目标 **1,1 / 7,1**；free49=4,2、Fork0；Color4 BOX45 / cargo50=5,5、Fork2、faceS、active、ghost0、contained1。独立Blue46/47/48在3,3 /4,3 /5,3。

真实Wall5,4和6,5；上层SPIKE为x3..5/y5..7，底行SPIKE3,1/4,1/5,1。无ICE，外框均Wall。只用真实坐标、Wall优先，不采用world wrap。

owner已直接实测初态单X：载箱5,5→4,5、Fork2→1、faceS、ghost0；free4,2原地，单线time1、无dialog。随后正常undo1回0，undo1/retry0。模型单X回归完全匹配此几何与库存。任何其他前缀均未要求owner执行。

## 模型范围与修正

- 普通WASD左转fallback、刚性Blue/Color4混合推链、裸SPIKE死亡、同拍空箱捕获。
- 已contained角色普通输入 **face=全局输入**；推动方向不覆盖其face。依据4-15既有cargo被fallbackA推移、仍faceW的实际反证，`CARGO_MOVE_FACE`默认false。可选true仅是未证诊断，不用于本轮结论；新捕获者保留其自身实际fallback face。
- cargoFork-X复制容器与内人、父盒同刻腾空、受阻侧分支改前方；同源C4交汇融合按M107。无叉外人X等待；无新增叉或钥匙。
- fork-X对同旧箱的异向请求可产生候选世界线，记录branch family；目标允许单叶同时两Goal，或同一兼容family的不同叶 **任意Goal mask union=3**。没有固定左右cargo分工。
- 死亡后只覆盖一个Goal的稳定叶先入队检查union，不因没有外人/剩余叉而提前删除；只有无控制资源且mask0的终态可立即剪枝。
- 不同源同刻叠箱记录sample但停止传播；已有cargo箱再遇外人的处理也记录sample后停止。没有擅自推断多角色箱、Ghost传播或叠体Goal坍缩。
- ordinary异向推力拒绝也记录计数/sample；初态唯一外人叉0、cargo-X仅产生contained人，因此当前实际模型没有多名自由推者，此计数为0。

三只独立同色Blue在此无叉pickup地图中不会获得可复制库存，身份交换不改变普通物理；哈希消除Blue原始ID排列冗余，仍保C4同源关系。Fork0 cargo面向不影响后续分裂，也作等价消重。原实体ID保留在输出检查点。

## 最终有限结果

正确规则版本最后一轮：**12000 expanded /19945 seen /7945 pending**，depth limit32，depth-cut0，**截断**。进程正常exit0，当前没有running handle。

检查7940次cargo-X；cargo-X推力冲突0、ordinary冲突0、异源stack0、同源融合394（转移计数）。箱人捕获118，其中已有cargo再捕获边界41；这些是模型转移计数，不能当实际机制或可运输角色预算。

无完整positive。普通free分别可由 `AAAA` 占1,1，或 `DDSS` 占7,1；这两条无分支路线不兼容，不能按mask并集冒充完成。没有first-conflict family可供两叶收尾。以上未到全图穷尽，也不证明本关无解；未增加cap。

## 最短未知边界：WWAXDX

仅MODEL，未实测。它检查载人子箱出生到另一名外人所在格时的处理，不是新增独立箱stack。

| 累计 | cargo / Blue / free |
| --- | --- |
| WW | 原cargo5,5 F2/W；Blue47到4,5；free4,4 |
| WWA | cargo面A；free3,4 |
| WWAX | 两cargo5,6 /4,5 F1/A；Blue47被向左推3,5；free3,4 |
| WWAXD | 两cargo5,6 /4,5 F1/D；Blue46=3,3、47=3,5、48=5,3；free4,4 |
| WWAXDX候选 | 四Fork0载箱5,7 /5,5 /4,6 /4,4；最后子箱4,4与free同格 |

在这一步，箱里已有原cargo子体，而独立初始free49也处于4,4。其实际capture/合并/容器归属尚未验证，模型明确停止。不套普通空箱捕获，亦不假定此处自动获得额外世界线。

该边界会耗尽所有叉；若外人全部装箱/合并，现有预测没有Goal也没有外部推者。因此当前缺乏完整运输收益，**未建议为局部坐标而实测或回退**。若后续普通教学或实际观察给出此处理，可再评估其资源变化。

## 可用结构与限制

空Blue可作为上行缓冲，允许free停安全4,4而把4,5 cargo送到4,6；不能把这个缓冲直接当下行回收。4,4 cargo普通向下需SPIKE4,5推者，向左需Wall5,4推者，故静态坐标安全不等价可送到下目标。

底行三Blue链确实可缓冲载人箱越SPIKE到一侧Goal；终推者可能死亡，可接受条件是另一Goal已在同叶覆盖或另一兼容叶另行覆盖。模型没有要求双cargo终点，但未找到合法运输/分线前置。

当前交给root的结果是有限截断与明确未知边界；游戏实际仍可由唯一owner继续。无新完成、星或成就信用。

## 最新实际样本：WWAXDX与正常undo闭环

上文“未知边界”保留为当时待实测记录。现在独立读取主JSON events[7]/[9]/[11]确认：

- event7，`WWAXD`，time5：两个C4载箱5,6/4,5各F1/D，free49在4,4/D。
- event9，`WWAXDX`，time6：新C4 BOX57在4,4；原free49 active/ghost0/contained1/container57/F0，newcargo58同格inactive、masked0、contained1/container57/F0；height1。其余三名源cargo子体5,7/4,6/5,5活F0。仅一条线，无dialog，未完成。
- event11，正常undo6后 instructions空/time0，free4,2F0与原cargo5,5F2、三Blue原位全部恢复。先前初X的undo1仍是历史，不被覆盖。

因此此实际样本是玩家融合/替换，只保留一名活contained角色，不产生额外外人、两活cargo、叠体或世界线。私有模型仅对安全格上的末叉Color4子箱与F0外人这一已观察情况启用替换；普通已有cargo捕获、Ghost、带余叉或不同颜色仍不由该例推广。没有重新运行任何cap搜索；此前12000结果仍属于更新前的边界停止域。

## y≤3 cargo短见证：WXSAAWDDDDX（仅MODEL）

按正确global-face规则手构并单串replay11输入；没有新BFS，也不声称全图最短。

| 累计 | 关键状态 |
| --- | --- |
| WX | cargo4,5/5,6 F1/W；Blue47=4,4；free4,3 |
| WXSAAW | free2,3；两cargoF1/W；三Blue3,3/4,4/5,3 |
| WXSAAWDDD | 两侧Blue向右成为6,3/7,3，Blue47保4,4；free5,3；cargoF1/D |
| WXSAAWDDDD | D受右链/上墙阻挡，free fallbackA到4,3；cargo仍globalD |
| WXSAAWDDDDX | 4,5父箱向下child4,4推Blue47到4,3，捕获唯一free；Bluecargo4,3 F0/ghost0/faceA；另四C4cargo4,6/4,4/5,7/5,5全F0/D |

此时outside0、余叉0、Goal mask0。低区cargo几何确实存在，但控制资源全失，是可正确剪掉的终止态，不能当完整可运输前置或建议owner盲执行。原seen图没有保存，故只能报告这条短合法模型见证，不能回答全图最短性。

## 公开操作复查与正常返回

2026-10-05本轮fresh0回访仅公开Notebook复查：4-16.json events18..35，event29装箱页<14/15>仅列重叠装箱、防刺/光观测、拾物/开锁、连箱分裂四项。未出现新容器移动/释放键，未选择获得启示/提示/简化，未试无说明Shift；正常关闭笔记恢复fresh0后返回世界。本轮关内零输入/0undo0retry，无新模型cap/机制/Goal；旧7undo和WWAXDX等历史保留。现已转Chapter2并正常进入2-G fresh0。
