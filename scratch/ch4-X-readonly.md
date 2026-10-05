# 4-X 天空：实际探针与单图连通范围

2026-10-04。owner `resume_slot1_oct03` 独占输入。本助手只读主JSON/已观察机制，写本MD与CJS；无游戏输入、存档/主KB改动、提示/攻略/实现访问。主证据 `artifacts/slot1-playthrough/4-X.json`。内部id为 sky，与旧3-X排斥不是同图。

## 实际初图及11步资源

size[8,8]，min_anchor[0,0]；地形坐标0..8。没有Wall、SPIKE、ICE或DARK；仅27 SOLID tiles加两GOAL地形，共29个安全Floor。PRISM2=4,4，初lighten/traversed/testCompleted均false；P3=6,8/F0/S；Fork4=0,4。目标8,1与7,0。

初态 `AAAAAASSSS` 实际10步取叉：P3沿top SOLID行到0,8，再沿左列到0,4/F1/S。单D第11步尝试1,4缺Floor，实际fallbackW到0,5/F1/W，仍active/ghost0/contained0；Prism未动。证明本关这处空白不允许普通走入。

从11单X第12步，两侧1,5/8,5均缺Floor，前方0,6为SOLID：实际只保单人0,6/F0，active/ghost0/contained0；单线、无dialog，没有跨空格出生。随后normalundo1恢复11/time11、0,5/F1/W，累计1undo/0retry。探针不是通关，也不声称新成就。

## 静态连通闭包（不运行BFS）

用真实Floor并集、Wall覆盖优先，按已观测M015的size+1循环邻接，得到五个分量：

- **14格源分量**：top行x0..6/y8，左列x0/y2..8，另1,7。源玩家与Fork均在其中。
- 中央9格：x3..5/y3..5，含Prism4,4。
- 孤立2,6与6,2各一格。
- 右下4格：7,0/8,0/7,1/8,1，含两个目标。

普通动作及本次实际X都只产生相邻Floor位置；因此在该已验证相邻移动/分裂域内，源分量闭合。分裂不会跨过缺Floor格，任何此域路线不能移动中央Prism或占右下目标。即使不采用环绕，源闭包也相同；本图边缘对侧均缺Floor，没有额外强行测试环绕。

初Prism不与两个Goal共行/共列，而且未照亮；现有14格动作不改变它的位置。未引入远距离无证观测或缺Floor光学行为来伪造目标满足。结论限当前单图、相邻WASD/X规则；不是排除合法关卡叠加/相加、其他导入实体/地形或未来正常教学机制。

脚本 `scratch/ch4-X-readonly.cjs` 仅打印五个组件、11普通路线与单X预测，无搜索预算或运行进程。owner将保未完成11/1undo/0retry正常返回，下一目标Y等实际初图待parent安排；没有建议耗尽叉或重复同域枚举。
