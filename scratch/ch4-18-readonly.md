# 4-18 Button7单独配对已实证；当前恢复53（2026-10-05）

正常回访完整52重建+单A53，再单D54清Button8，主events[104]/[106]/[108]直接核：54 Button7[7,6]仅活Color2 BOX80/cargo81占，Button8[8,6]无活BOX/PLAYER；Gate68[5,2]/ID0 blockable=true，Gate69[6,2]/ID1=false。正常Unity截图核左门关闭/右门开启。53外79停8,6仍压Button8，所以53不能当单按钮阴性/阳性。随后normalundo1恢复live53/time57/leaf82，主event[110]：cargo73/78=6,6、80/81=7,6全F0/A/ghost0活，outside79=8,6F1/A/ghost0活，左空箱2,2/2,3，末Fork3,6active，Lock9,5inactive，两门open。本次1undo0retry，旧1undo另保，累计2undo0retry；全部71/63/56/54历史保留。118关6星，未完成。

唯一输入owner /root/ch4_1_readonly，Slot1，禁止提示/反射/存档改写。当前无solver/session。

---

# 4-18新实际71：ICE正交运动交汇（2026-10-05）

实际63+SSAWWDS7→70/time76，free79=8,3/S、84=9,2/S。71单D首回执两free均9,3ICE，但稳定time78后79停9,3/faceD（east10,3Wall），84沿W续9,4/faceW，两个active/uncontained/F0/ghost0，没有融合/叠体/新叶/完成。三cargo仍3,5/4,6/5,6，F0/D/ghost0；五BOX五活单叶85。本次0undo0retry，历史1undo保留。只证同一ICE上D/W两个运动角色的交汇，不推广任意速度/朝向/资源完整融合。 主JSON events[78]。

---

# 4-18新实际63：分裂出生ICE续滑（2026-10-05）

新正常回访63：完整 WASXWDDSWAAAAAWDDAAAASWDWWXWSSAAAAAWWWDASDSSDDDDDWWWAAAAASDDSSX。56旧护叉强资源重建吻合；ASDDSS到62/time66，63singleX三cargo3,5/4,6/5,6和twofree8,4/9,2，五活均F0/S/ghost0；free84出生9,3ICE沿S自动续9,2，time68，五BOX/单叶85/未完成。本次0undo0retry，旧1undo0retry全保；三个batch因动画暂停只续receipt.remaining，未重发已接受输入。这是M033/M108出生ICE的本关实证；helper独立ordinary286/286/pending0/depthCut0无Goal，不扩该图。SSAWWDSD交汇ICE仅待判边界，没有完整Goal正尾。 主JSON events[74]。

---

# 4-18 混合：只读资源建模与实际闭环

2026-10-04。唯一输入 owner 为 `resume_slot1_oct03`。本助手只读关卡证据与已观测机制，写本报告/CJS；未操作游戏、读取实现/攻略/提示、修改存档或主知识库。主证据为 `artifacts/slot1-playthrough/4-18.json`。

## 实际状态与资源路线

初态 mingle，P77=8,3/F0；Color2 BOX73=8,2，Color4 BOX74=2,2，Color3 BOX75=2,3。叉8,4、7,4、3,4、3,6；3,6真实为 SPIKE，Fork字形不覆盖其危险性。普通钥匙4,5，锁9,5，门5,2/6,2，按钮8,6/7,6。四目标6/7/8/9,9。

右ICE仅9,3。M033允许进冰后续滑，到墙停止；该输入内不会自行左转。M035的“普通推者停接触冰格、箱继续滑”有2-11 events2/4直接证据，本关16捕获尾本身没有覆盖该边界。

| 有效输入 | 实际资源与判定 |
|---|---|
| 2 `WA` | P77=7,4/F2；右两叉已取，箱未动。 |
| 7 `WASXWDD` | P77=8,4/F1，P78=9,3/F1。最后D遇10,3墙停冰格，原“滑北9,4”手算已纠正。 |
| 9 `WASXWDDSW` | S到8,3/9,2；W后一人8,4，另一经ICE9,3到9,4，形成异奇偶，双F1保留。time10。 |
| 25 | 9后 `AAAAAWDDAAAASWDW` 实际全匹配；最后W使77从8,2推Box到8,4，78从9,4遇锁转A同落8,4，活着装箱。cargo78 F1/A/ghost0，外77=8,3/F1/W。 |
| 26/27/28 | `WXW`：先箱8,5；X活Color2载箱生7,5/8,6、外人7,4/9,4；W左推者死7,5，两个载箱压7,6/8,6，唯一外79活8,4。两门实际打开。time31。 |
| 34 | `SSAAAA`，79通过双门到4,2/F0，左两箱未动。 |
| 40/41/undo | 左取3,4安全叉与4,5钥匙，40为3,5/F1/key1；41裸W到SPIKE3,6先拾叉F2再inactive/ghost1。normalundo1恢复40，累计1undo/0retry。不是活F2资源。 |
| 56 | 从40 `SDSSDDDDDWWWAAAA` 实际全匹配：开锁9,5后从9,6向左推回两C2载箱；73/cargo78=3,6/F1/ghost0（保护拾末叉），80/cargo81=4,6/F0/ghost0，外79=5,6/F1/key0。左右空箱仍2,2/2,3；锁inactive，两门因按钮空置关闭。time60。 |

右腔捕获搜索以实际9源为准：锁与真实 `BUTTONGATE` 类按关闭处理；ordinary WASD+ICE，保双F1，移动中同格、冲突、叠箱等边界停止。991 expanded /1090 seen 命中16尾，随后单串重放和owner实测均吻合。曾在未录入BUTTONGATE类型的开发草稿中发现门误放行，修正后才给出上述16尾；错误草稿短尾未发送或执行。

按钮的单侧证据可从主events25（第27X）独立读取：只有8,6占据时Gate5,2 false、Gate6,2 true；第28同时压7,6/8,6才两门false。只证明8单独能开5,2，及加入7后能开6,2；**7单独是否开6,2尚未隔离验证**，不能仅由加法对照排除AND/计数阈值。本轮脚本采用7→6,2的条件映射，完整域涉及7-alone时仅为模型假设。已实测16回收尾过门期间两button均占，故不依赖这个未隔离条件；主KB的谨慎描述由owner维护。

## actual56 新兼容多叶域（有界结束）

脚本：`scratch/ch4-18-readonly.cjs`，调用 `fullsearch 5000 28`。source为已实际验证的56资源，由真实40重放16尾得到，不冒称现场仍40。

- **5000 expanded /7677 seen /2677 pending；depth上限28，depth-cut=0。** 达到扩展上限，非队列耗尽。没有额外升cap或仍运行的process/session。
- 允许普通WASD、同时cargo/free X、父载箱腾空、同源融合、箱链、ordinary/X不同推力产生兼容子叶；所有partial Goal终态保留，Goal集合只在同一分支family内联合，不合并同一叶的不同互斥走法，也不信用祖先占目标。
- 已包含按钮/局部门占位、开锁后的墙、持叉活cargo；7-alone开6,2按上文条件映射，未称本关独立真证。source的全部叉已取，普通动作cargo朝向取全局输入，free取实际fallback方向。
- root可达Goal profile仅 **0/1**，未命中mask15。例56后 `XAASAWWWWWDWDSSS` 模型外人到6,9，只有一个Goal；该例不是实际解法或建议输入。
- 统计：X转移66，冲突0、异源stack0、已有cargo再捕获0、同源融合0。**8个X出生ICE边界停止**。普通冰滑按M033–M035传播，X出生冰面的后续微tick尚未接入此轮完整图；这不是否定该已观测机制，也不表示此资源全局无解。
- 不传播Ghost、生死观察、异源stack/Goal观测及未知不同资源再capture；这些都是本轮范围限制，不能据有限无命中否定全关。

## 留存的边界前置（仅MODEL，不要求当前owner执行）

均从实际56源：

1. `ASDDSSX`（7）：普通六步把持叉外人安全绕到9,4，cargo面S。X预计两个新C2 cargo3,5/4,6、旧cargo被推5,6；两free出生8,4及9,3。后者实际应按出生运动S续至9,2，需把该微tick传播接入模型再评估。用途是已有free-X冰续滑域的回访/模型校验，不是未知量子机制或fullGoal正例。
2. `ASDDSSADX`（9）：末X外人9,4面D生9,5/9,3，后者按S续至9,2；cargo资源同为3,5/4,6/5,6。该前置没有同源融合或主动Box冲突；用途同上，不保证有四目标收尾。

上部普通载箱运输仍有真实转角障碍：1,8向东推需0,8墙内站位；2,8向北推需2,7墙内站位。cargo3,6普通四向不可回收，需叉侧向退3,5或推邻箱，必须核叉预算。允许未来另分配右/左叉、普通叠箱观察或明确新机制；本轮没有将这些边界推广为全局不可能。

owner将4-18保 **attempted56/time60/1undo/0retry、未完成** 正常返回，后续优先合法4-X新关。没有建议执行partial Goal或盲X。
