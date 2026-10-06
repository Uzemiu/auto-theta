# 5-1 弥留：只读同刻装箱候选（2026-10-06）

私有模型：[ch5-1-capture-oct06.cjs](ch5-1-capture-oct06.cjs)，只读[canonical公开记录](../artifacts/slot1-playthrough/5-1.json)。本 helper 无游戏输入/提示/隐藏实现/存档或主KB改写，也不额外写 JSON。唯一输入 owner 为 `slot1_owner_oct06`。

## 精确源

初 frame1805085，runtime `limbo`。本次搜索只从 owner 实际 `AAXX` 出发：**event12/frame1871448/time4，axis0/id45**，P42[2,1]/A、43[2,2]/A、44[2,4]/A 都 active/ghost0/Fork0/key0/free/height1，空 C4 BOX41[5,6]，Fork39/40 inactive。没有重做或假装实际的 fresh 资源模拟。

3个 Goal 为3,7/6,1/7,1，无 DARK/ICE/Prism。row6 x1..3 是 SPIKE；row7 x4/x5 都有真实 Wall，x5下层SPIKE不能覆盖其Wall。row7 x6/x7为可走SPIKE。

## 修正后的可达机制域

root 给出的有效前置是 Box4,6 + pusher5,6 + receiver3,5。单 W 时 pusher 北方5,7被真实Wall挡，fallback A 把Box送3,6；receiver直W也到SPIKE3,6。它不需要 Box3,5，也不需要角色先站在SPIKE或Goal。helper先前只考虑同指令A，漏掉这个fallback，已撤回“初row6箱无SPIKE capture”推断；错误域没有进入搜索。

模型保一物理C4和三名实际F0自由活人，逐tick检查裸SPIKE死亡；前缀拒绝争推/碰面合并/提前捕获和任何裸死。移动使用已公开左转fallback。终捕获参考 M092 的同一主tick落刺与装箱机制，暂预测 active Ghost cargo，但 **本C4/runtime fixture仍需实际核验**，不能与M114迟ICE箱追撞死者等价。

有界搜索只用 **62 expanded / 125 seen / 63 pending，cap8000** 得到下列正前置。不是穷尽或最优证明；无活进程 handle。脚本 stdout `.candidate.trace` 给24步 ID/pos/face、Box位置和完整源静态字段保留的字典；`.preW`、`.afterWModel` 是边界前后预测。没有文件输出或游戏API。

## 短 positive：到捕获前即停

从 actual4 的24步：

`WDDDWDWDWAASAWDDDWASAADW`

到 time28：P42[5,6]/W、P43[3,5]/A、P44[2,4]/W，均 active/ghost0/Fork0/free；Box41[4,6] 空。先供实际逐小批校准，不能按模型跳过完整 PLAYER 字段。

最先4步 `WDDD` 到 time8：42[5,2]/D、43[5,3]/D、44[5,5]/D；Box仍5,6。随后每步预测以 `.candidate.trace` 为准。

独立末 **W29**：42因5,7墙fallbackA→4,6，仍活；43直W→3,6，与4,6向A来的Box同tick相遇，模型期待43 active/ghost1/contained1/container41，Box41[3,6]；44直W→2,5仍活。这一步应保两名自由活人，若 actual43 为ghost0、inactive或未装箱，不沿假定生死分线继续。

### 已实际验证到31

owner 分6小批执行前缀，主 event14/16/18/20/22/24 为 time8/12/16/20/24/28，最后 frame1975351。helper 独立对四动态实体42/43/44/41完整字典的全部顶层key比较，六批 `fullEntityDiff=[]`，含 properties/details/GMID/动画，而不只核位置。脚本 `.publicPrefixChecks` 输出索引与差异。

末 W29 已实际成功：**event27/frame1998821/time29**，BOX41[3,6] C4，P43同格 active/ghost1/contained1/container41/Fork0/W/height1；42[4,6]/A、44[2,5]/W两free仍活。运动静止、动画完成、单axis0/id45，无dialog/guard/completed。helper再次对完整四实体比较 `fullEntityDiff=[]`；这是本C4同主tick刺装箱实证，非后续ICE迟箱，也不是普通活cargo。

owner随后实际 S30、A31：**event32/frame2025378/time31**，42[3,5]/A、44[1,4]/A活free；43/Box保持3,6，cargo仍active/ghost1/contained1且朝向随S/A改变。owner的过严 wholeCargo 断言曾只因这两个朝向字段变化停止，没有重发S；观察后仅接A，未增加撤销。脚本 `.postCapture.trace` 给 SA 与末W的物理预测，`.setupChecks` 核实际前两步。

## 捕获实证后才可用的条件尾

仅当 actual29 与 Ghost cargo 前提相同：独立小段 `SA` 到31，42→4,5→3,5，44→2,4→1,4，cargo43/Box仍3,6。再独立 **W32** 把Box/cargo送Goal3,7；42落SPIKE3,6预计裸死，44到1,5仍活。

M074已在其他实际关卡支持“Goal观测箱内Ghost产生生死两叶”，但本C4/Goal3,7必须 actual 核验，不预设光或世界线。若 actual32 确有一叶 active/ghost0 cargo43[3,7] + free44[1,5]，另一叶 cargo43 inactive/ghost1 + 同free44，则可逐叶分配：生叶 `SSSSDDDDD` 使44到Goal6,1/time41，死叶 `SSSSDDDDDD` 使44到Goal7,1/time42，两条路线均仅经过安全row1..5；cargo生叶固定覆盖Goal3,7。切线需使用实际axis/GMID，不能按未发生ID猜。先推进生叶再T至死叶可在最高time42检查联合覆盖，若当前选择不同应先调整选择而不是假定单T。

在上述所有 actual 边界均成立且默认生叶选中时，候选总长度52：4个已实际资源动作 +24setup +Wcapture +SAW +9生叶尾 +T +10死叶尾。**它仍是条件MODEL，不是已通关**；本 helper 不使用 Fork0 X，也不把被刺死亡的pusher计成额外活人。

### Goal32 实证：条件分叶成立，安全尾核验

独立 W32 已实际分成两叶：**event37/frame2030946**。axis0 cargo43[3,7] active/ghost0/contained1/container41；axis1该43 inactive/ghost1/maskedoff1且仍cargo41。两叶裸刺42[3,6]均inactive/ghost1/free，44[1,5]均active/ghost0/free/Fork0，Box41[3,7]，各time32。helper独立读取完整公开四实体字典，两叶差异与owner报告一致；axis1新GMID为Box77、42=78、43=79、44=80，而axis0保留37/38/39/40，不能跨叶复用whole dict。

从实际32重建安全尾，不再假设分叶。1,5四S至1,1，再沿row1五D至6,1或六D至7,1，都为真实安全SOLID，无SPIKE/Box/接触。生叶cargo43仍固定Goal3,7，只响应朝向；死叶cargo43与两叶的42均inactive不响应方向。脚本 `.actualGoal32` 提供证据索引和实际叶源，`.actualTailVerification.tails` 提供每叶纯确定尾trace及之后公开观察的完整字段校准（保各叶实际GMID）。owner正常推进尾声，取得completed前仍不记本关完成。

## 已实际完成：准确52，保留采样限制

owner 执行的准确串为：

`AAXXWDDDWDWDWAASAWDDDWASAADWWSAWSSSSDDDDDTSSSSDDDDDD`

完整源之后，活叶尾 event39/time36、event41/time41，死叶尾 event45/time36、event47/time41，helper基于 actual32 每叶字典独立重放，各 selected leaf 的四动态实体 `fullEntityDiff=[]`。切到较早叶时，其他叶实体可能显示该较早时刻投影，不能把其仍标最高time的历史实体当新最终状态；脚本按这条实际双叶串的T选择核当前叶，而不靠重复的timeline id45跨叶匹配。

最后独立 **D52，events[48].receipt**：completed=true、stop_reason=`level_completed`、executed1/remaining0、undo_depth52、free44[7,1]；准确 instructions 与52候选一致。本轮0 undo/0 retry。随后正常自动返回第5章世界，frame2061018。

最终完成时 input_locked=true，owner旧等待逻辑等到锁解除时已自动退world，因此**没有保存全关 completed 实体帧**；这里只确认真实完成回执、先前两叶time41完整实测和准确指令，不补造最终Box/cargo全字典。正常SaveSlot1最终记录由root另外核，本helper没有读写存档或把未核save当证据。`.completionEvidence` 输出回执来源、exactCandidate=true及 fullCompletedStateCaptured=false。

5-1只读任务完成，不再扩展该图。搜索唯一域62 expanded，后续均为实际源的确定重放/核对；无活进程handle。只留下本CJS/MD两文件。
