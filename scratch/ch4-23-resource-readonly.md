# 4-23 蛇：载人箱蛇道的资源模型与实际闭环

2026-10-04，SaveSlot1。只读助手 `/root/ch3_37_cargo_revisit_oct03`；仅公开 `artifacts/slot1-playthrough/4-23.json` initial 与知识库已证机制。没有游戏输入、提示、攻略、隐藏实现、存档或canonical修改，没有运行BFS。初稿下面运输/分裂序列为条件模型，当时尚未证明初态到条件前缀可达；随后唯一输入owner实际完成52步，root已独立核验，见下方实测闭环。条件构造过程保留，离线输出与后续真实执行分别作为证据。

## 52步实测闭环与存档核验

唯一输入owner正常执行完整`SSSDXDDDAAAAAWDSSDDDDDDSDDWSAAWDSDWWWWWXAXXXXXXXSXXX`，52/time52的[主JSON](../artifacts/slot1-playthrough/4-23.json)已保存`run.completed=true`和`completion.level.completed=true`。root独立读取36保护前置、48的4,8/F2与4,7/F0核心资源以及最终完成快照：cargo91/90在5,5、cargo127/126在3,5，均active/contained1/ghost0/F0，同叶七名活cargo。50/51连续分裂推旧F0 cargo到4,6及4,5拾最后Fork，52再分裂覆盖双Goal；此前条件部署已由真实52输入闭合。

游戏自动返回Chapter4世界[-44,3]fresh0，root MCP独立观察一致；只读Settings启动选择仍1，SaveSlot1完成数113、星数6，snake完成记录已保存。首Blue装箱15与undo11的旧试验历史保留，累计11undo/0retry。此证明4-23完成，不能据此声称全部成就已完成。

## 初图核查

runtime snake；Goal5,5与3,5；初P91在1,5，Blue74在4,2，C4 BOX90在5,2，首Fork75在1,3。唯一SPIKE为9,5，没有ICE、Lock、Prism或Gate。

蛇道Fork：9,6/7/8/9；8/7/6/5/4,9；4,8；8/7/6,7；4,5。Wall实体优先，特别是3,6..9、5,6/8、6..8,3..6以及6..8,8均不能绕过。4,7、4,6、5,7是安全但无Fork的连接格；4,5是Fork；3/5,5是普通Goal，实体提供floor，不因tile列表不含Goal坐标而错误判无地形。

cargo沿普通输入只改变face，不自行位移；X优先左右有效出生，不足两侧再用front；原持叉载箱同刻腾空，活cargo复制容器及叉库存并可推动其他箱（M102/M108）。同源箱相遇融合，既有M107的Fork1+Fork1→1实证支持模型保最大库存。本短尾实际相遇的是Fork0+Fork1并保1，这个新实例本身不能区分最大值与相加。

## 总Fork1单支的边界

条件只有一个cargo9,6/Fork1且无live outside，并已取9,6叉时，一条沿上蛇道逐格X的路线每步消耗1、每进入新Fork补1。因此4,8之后进入无Fork4,7会耗成Fork0，不能再直接沿4,6到4,5。

单串 `WXDXWXAXXXXXXSX` 在私有模型中有效，但最终仅9,6/9,8/4,7的Fork0 cargo，Goal mask0；未列分叉链推的所有可能性，不能据此断言所有Fork1源无解。9,7面W的X可同时出生8,7/9,8且各补Fork，正说明多支资源不能用“单支少一叉”一概排除。

## 更强条件源与两W库存收益

构造源（尚无初态部署输入）：活cargo9,5/Fork0，独立空rear BOX9,4，live free9,3/Fork0；Fork9,6与9,7尚active，其余蛇道Fork亦active。cargo虽在SPIKE9,5但已contained/active/ghost0，不能由裸人踩刺后假复活制造。

`WW` 模型逐态：

| 输入 | front cargo | rear empty | free |
|---|---|---|---|
| 初 | 9,5/F0 | 9,4 | 9,3 活 |
| W | 9,6/F1，拾9,6叉 | 9,5 | 9,4 活 |
| W | 9,7/F2，拾9,7叉 | 9,6 | 9,5刺亡 |

后缓冲箱使第二次推力仍能传到front，外人死亡发生在运输完成后。此源比“只有cargo9,6/F1、外人已经死”多出一个可实际取得的Fork。来源仍由main独立首capture/两箱部署任务负责，不要求owner盲走构造坐标。

## 完整cargo-only条件14尾

从上述两W后源，即cargo9,7/Fork2、empty9,6、无live free，Fork9,6/7 inactive且其余蛇道Fork active，输入：

`WXAXXXXXXXSXXX`

共14输入（W、X、A、七X、S、三X）。私有单串模型有效，最终同叶cargo3,5/5,5均活、ghost0、Fork0，Goal mask3；其余活cargo不在Goal不影响该强覆盖候选，真实completed仍须游戏验证。

| 尾动作数 | 关键cargo状态 | 几何/库存原因 |
|---|---|---|
| 1 W | 9,7/F2面W | 只设朝向 |
| 2 X | 8,7/F2、9,8/F2 | 西Fork有效，东10,7Wall，改front北Fork；消耗后各拾叉补回2 |
| 4 AX | 7,7/F2、9,9/F2；旁支9,7/F1 | 低支两侧Wall改front西；高支南北分裂 |
| 5 X | 6,7/F2、8,9/F2；旁支9,8/F1 | 同源Fork0与Fork1在9,8融合保1；另9,6出生推rear空箱至9,5 |
| 6 X | 5,7/F1、7,9/F2 | 低支首次无Fork，余1 |
| 7 X | 4,7/F0、6,9/F2 | 低支保留作缓冲，不把它误当失败废箱 |
| 8 X | 高5,9/F2 | 下邻5,8Wall，改front西Fork |
| 9 X | 高4,9/F2 | 沿顶Fork保持2 |
| 10 X | 高4,8/F2、低4,7/F0 | 西3,9与北4,10Wall，改南Fork |
| 11 S | 全cargo面S | 只设朝向，4,8/4,7不移动 |
| 12 X | 旧低cargo4,6/F0、新cargo4,7/F1 | 4,8两侧3/5,8Wall，front分裂推低箱4,7→4,6 |
| 13 X | 旧低cargo4,5/F1；新4,6/F0与5,7/F0 | 4,7面S左5,7有效、右3,7Wall，front推旧4,6→Fork4,5补1 |
| 14 X | 新3,5/F0与5,5/F0 | 4,5面S两侧正是两个Goal |

这条尾的关键是“Fork0旧cargo被另一载箱分裂推到Fork”，不是要求每支自携两叉过缺口。原4,7低支若被模型剪掉，便会遗漏这条正尾。

从更早构造源9,5F0+rear9,4+free9,3起完整条件16输入为：

`WWWXAXXXXXXXSXXX`

其中前两W取得9,7F2，其后的W是朝向输入；不要误计成连续三次普通推箱：第三W时已没有live outside，箱位置不再普通上移。

## 复算范围与待实测

私有脚本 `scratch/ch4-23-resource-readonly.cjs` 从公开4-22观察模型读取几何/step，在独立VM里只把观察文件换成snake，并补已证M107同源Fork max。运行：

`D:/nodejs/node.exe scratch/ch4-23-resource-readonly.cjs`

只复算上述两条单串，不调用resource/solve/BFS。正尾没有异源stack、推力冲突、Ghost、新占据载箱吞人或高Fork融合假设。普通死亡者不在后续active列表，未假复活。

实际42/43融合补证：主JSON `events[37]` 的42态cargo95在9,7/F1、cargo99在9,9/F2；`events[39]` 的43单X后，95的child103在9,8/F0 inactive，99在9,8/F1 active/contained1/container98；childBOX102 inactive、原BOX98 active。root已独立读取核验，main亦确认。因此此处准确库存是0+1→1，不是1+1→1；本例不能独立证明max，脚本更一般的max规则依据仍是既有M107的1+1→1。owner已逐段核至actual48，但本次更正文案时最终两个Goal实际完成尚未确认，完整尾仍保条件标签，不能作为已通关或新增成就证据。没有追加搜索、模型运行或游戏调用。
