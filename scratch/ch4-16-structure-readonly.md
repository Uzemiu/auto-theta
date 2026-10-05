# 4-16 piston：静态第二X结构与短串核查

仅只读分析正常JSON和已观察规则。唯一输入owner是 `/root/resume_slot1_oct03`；本助手不操作游戏/存档/主KB，不使用提示、攻略或隐藏实现。没有新增BFS，也未重复main的12000轮；只调用其观察模型的单串replay做交叉核，所有未实测前缀明确标MODEL。

## 已实际边界

`artifacts/slot1-playthrough/4-16.json` initial：Color4 BOX45/cargo50在5,5、Fork2/ghost0/contained1/faceS；outside49在4,2/Fork0/faceS；三独立Blue46/47/48在3,3/4,3/5,3。Goal为1,1/7,1。

Wall实体优先：5,4，6,4..8，7,2及7,4..8，1,2，周边x0/x8、row0/8为墙。上区SPIKE是x3/4/5、y5/6/7；底行3/4/5,1也SPIKE。没有ICE。上方的4,4安全，2,5..7安全，但不能把5,5/5,6或3,5当裸人的安全推者站位。初C4原5,5的横推东侧6,5是墙，南行5,4是墙；不能虚设独立Blue也已经占5,5。

events[1] 单初X已实证仅一cargo到4,5/Fork1（面S左右/前方中只有西有效），outside仍4,2；events[3]正常undo恢复初态。

**`WWAXDX` 已由owner实测，不再提为待测探针：**events[5] `WWA` 得outside49=3,4、Blue47=4,5、初cargo50仍5,5/Fork2面A。events[7] `WWAXD` 两cargo50=5,6及54=4,5/Fork1面D，Blue47被首X推至3,5，outside49=4,4仍活uncontained。events[9] 末X后：

| 对象 | 实际末态 |
|---|---|
| outside49（原人物） | 4,4，active/ghost0/contained1/container57/height1/Fork0 |
| 新cargo58 | 同4,4，inactive/ghost0/contained1/container57/height1/Fork0，masked0 |
| 另外活cargo50/54/56 | 5,7 /4,6 /5,5，均Fork0、ghost0、contained1 |
| 有效箱 | C445=5,7，53=4,6，55=5,5，57=4,4；Blue46=3,3、47=3,5、48=5,3 |

同格边界是原外人被装入新子箱而新生cargo失活的融合实例，不是增加活外人、异源BOX stack或世界线。全部四活人均contained/Fork0、没有Goal，一条line/time6/completedfalse。因此在现已证普通规则下没有外部推者或剩余叉继续搬箱，直接重复该探针没有运输价值。events[11]已正常undo6恢复初态；本助手独立读JSON核，未执行任何输入。

ordinary时cargo朝向取global输入，外部被阻回弹者可取不同fallbackface；cargoX保原face。4-15 events[143] cargo面W而外人A已有实例。本轮不把“BOX移动的方向”误作所有cargo下一X面向。

## 常见首X父位的静态条件

首X前加普通W/A时通常得到两个Fork1父BOX在4,5/5,6；直接面S或D也可能只生成一个，不能把双父当所有首X的无条件结果。

在4,5/5,6且共享global face的双父条件中，最清楚的第二X方向冲突目标为独立Blue4,6：下面4,5父向北推它，上面5,6父向西推它。要迫使上父选前方A，面A时5,5（南侧）或5,7（北侧）必须有一个背Wall5,4/5,8而不可推的Blue；否则两个侧向5,5/5,7先满足，不会请求4,6。面W时也可通过Blue5,5背Wall6,5阻挡下父的东侧，从而下父退到前方W4,6，上父直接左推4,6。

这些是**条件谓词，未给出正常部署前缀**。Blue5,5的普通直接右推需要从3,5裸站，北推被5,4 Wall阻，直接南推需要5,7裸站；但这不能证明所有缓冲箱链或之后X部署都不可行。同样Blue5,7不能凭字面说完全不可达：多个箱的水平缓冲链有可能从左侧安全2,7送它。真正尚缺的是同时保父位、共享Blue4,6、背墙Blue及一个活outside的具体正常前缀。

三独立Blue都在row3时，常见短首X/第二X没有异源stack；Cargo兄弟同格是同源融合，不是异源叠箱，更不能直接计新观测叶。只有一个无叉outside的普通动作也没有两个独立推者；有价值的首世界线仍需X的两请求争同一独立箱/链或实证异源stack后观察。

## 两Blue缓冲能改变父位：手工21前缀

MODEL ONLY，正常initial接：

```text
WSAAWDSDWXASDDDWASAWW
```

按手工资源部署再单串replay验证，不是搜索找到的最短路、不建议owner无尾盲执行。先把Blue46/47排成4,3/4,4，W推到4,4/4,5，再首X把高Blue47横送3,5；随后从6,3向左把剩Blue48放4,3，两个Blue后缓冲允许连续W北送载人箱，outside始终停在安全4,3或4,4，不裸踩4,5。

| 前缀步数 | C4cargo父位/Fork | Blue46 /47 /48 | outside |
|---|---|---|---|
| 9 | 原5,5/F2 | 4,4 /4,5 /5,3 | 4,3 |
| 10 X | 4,5 /5,6，均F1 | 4,4 /3,5 /5,3 | 4,3 |
| 17 A | 4,5 /5,6，均F1 | 4,4 /3,5 /4,3 | 5,3 |
| 20 W | 4,6 /5,6，均F1 | 4,5 /3,5 /4,4 | 4,3 |
| 21 W | **4,7 /5,6，均F1** | **4,6 /3,5 /4,5** | **4,4** |

这是对“lower父必固定4,5”过强判断的反例；必须考虑完整箱链。模型各步都single、goalMask0、cargo/outside alive ghost0，Blue保持独立。前缀未经本关实际执行。

只从这一明确21姿态各做 `WX /AX /SX /DX` 四个末串，ordinary先改变globalface、再X。W和D普通输入在4,4被上方链背Wall4,8或右Wall5,4挡住，outside回弹至3,4；S到4,3，A到3,4。

| 末串 | 第二X活C4cargo落点（全部F0） | Blue46 /47 /48 | outside | 新边界 |
|---|---|---|---|---|
| WX | 3,7 /5,7 /4,6 | 3,6 /3,5 /4,5 | 3,4 | 两兄弟同5,7同源融合 |
| AX | 4,6 /3,7 /5,5 /5,7 | 4,5 /3,5 /4,4 | 3,4 | 四cargo、无新stack/冲突 |
| SX | 5,7 /3,7 /4,6 /5,5 | 3,6 /3,5 /4,5 | 4,3 | 四cargo、无新stack/冲突 |
| DX | 4,6 /5,7 /5,5 | 4,5 /3,5 /4,4 | 3,4 | 两兄弟同5,7同源融合 |

四串各一条line，均GoalMask0；没有独立Blue/新cargo同格，也没有同Blue异向推力。因此本21+四方向有限家族没有达到首stack/conflict目标，不能把它当全关解法或全域排除。没有继续搜这四尾的运输；保留手工资源反例供main静态评估，不要求owner现在切回。

单串交叉核使用 `scratch/ch4-16-readonly.cjs` 的 `replay()` 和 `step()`，没有调用 `search()`。main同期将events[9]实证融合规则写入模型；本助手仅读并记录本轮具体结果，不改它的cjs。直接可复核命令为 `D:/nodejs/node.exe scratch/ch4-16-readonly.cjs replay WSAAWDSDWXASDDDWASAWW`，其它末串接在此串后。没有新快照JSON或新大模型文件。

截至本轮，没有首异源stack/方向冲突的可执行完整正前缀可给owner。剩余是不同正常Blue部署能否同时满足真实争推条件、或本未覆盖机制的短正探针；不得把本静态有限家族、主12k未展开队列或上述直接站位障碍写成游戏无解。owner正常世界推进不受此报告阻碍。
