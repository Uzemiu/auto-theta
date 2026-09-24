# 3-29 只读候选：夹困安全幽灵后捕获

以下候选现已由输入owner分段实测成功；原模型推导保留如下。只读取公开游戏观测与私人模型，无游戏输入、无游戏实现/隐藏解法/攻略访问。实际输入owner为/root/slot1_resume_chapter2。

## 90输入运输候选

完整串：`WSDDDWWWWWWAAAAAASSSWWWDDDDDSSSSDSSAAWAAWXSSSSSWAWADSAAWDDWAADDDWWWWAAAAASSSSDDDDSDWWWWDWA`

- 初态41步 `WSDDDWWWWWWAAAAAASSSWWWDDDDDSSSSDSSAAWAAW`：单人持fork，把原上箱2,4从上方下推至2,3，最后回4,3朝W。箱为7,2 / 2,3 / 6,3；玩家4,3、fork1。这个长前缀是固定箱障碍下的安全步行路径，没有假设自动穿箱。
- 再2步 `XS`（time43）：live5,2与ghost3,2；箱不变。
- 再12步 `SSSSWAWADSAA`（time55）：live5,2与ghost3,2；箱4,2 / 2,3 / 5,3。
- 单 `W`（time56）：live的北侧5,3箱被墙5,4顶住，向左推4,2箱到3,2，自己4,2；ghost从3,2走3,3。此时ghost3,3左侧2,3箱背后1,3墙、南侧3,2箱背后3,1墙，上方和右方没有DARK，所以四面被阻挡。
- 再5步 `DDWAA`（time61）：活人绕至6,3，把第三箱从5,3经4,3推入ghost3,3，预期捕获；活人停4,3。ghost等待使两者相对奇偶改变，避开直接捕获的同奇偶障碍。
- 假设捕获实测成功，再29步 `DDDWWWWAAAAASSSSDDDDSDWWWWDWA`（time90）：活人从上方推开左箱2,3到2,2，自己占2,3后向右推出cargo；沿row3送至7,3，由7,2向上推至7,7，再从8,7左推至GOAL6,7。终态cargo6,7、free7,7，余箱3,2/2,2。

## 模型校验

- 初态到time56使用root-dark-box.cjs重放，41/43/55/56检查点一致、无null。该模型支持普通箱推链、fork、固定DARK边界，拒绝装箱/世界线/动态光。
- 从明确假设的time43状态，固定anchor2,3的局部搜索发现3657状态、扩展2484，找到12输入SSSSWAWADSAA。不是无界全图搜索。
- time56至61临时放开箱人与箱子最终同格拒绝，仅检测接触。结果ghost3,3和箱3,3同格，free4,3；它不证明真实捕获已经发生。
- 从假设已捕获的time61构型，root-cargo-keys.cjs内存变体29步重放至cargo6,7/free7,7。仅加入DARK实体白名单，运输阶段自由玩家均走安全格；载ghost作为普通货物运输。目标光照、复活、世界线、胜利都不在模型中。
- 初始普通ghost全图搜索200000扩展截断；箱同质规范化并排除边缘永久死箱后450000扩展仍截断。没有据此宣称无解。之后改分阶段构造得到上述候选，未再继续大搜索。

## 实测检查重点

最关键检查time56幽灵是否真正不能推动两个背墙箱且原地等待；time61是否contained1；time90目标观察是否复活分线。若time90生死分线：双活人线可将载人箱6,7左推到5,7，外部人留6,7；单人线外部人可从row8绕箱去4,7，再检查较晚线完成。此收尾尚未实际执行。

全部只读模型进程已结束；仅写本单一报告，无新增JSON/CJS。


## 实测完成补充（root只读核验）

操作owner已逐段执行并确认time56/57幽灵3,3原地等待、time61第三箱捕获contained1、time90载ghost到GOAL6,7产生生死两线。末尾ATAAA使复活支箱内人5,7/外人6,7，死亡支外人4,7；3-29.json event32完成观察completed=true。全95输入，SaveSlot1 capture state3且LevelRecords编码与实际instructions完全匹配，累计86关。上方历史“待实测”仅描述推导阶段，不再代表当前结果；实际证据与知识库M075/solutions/3-29.md优先。
