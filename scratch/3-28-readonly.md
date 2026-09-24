# 3-28 只读运输候选：三箱向上保护推者

本报告最初为候选；现前63输入及最终84输入通关均已实际核验。只读取主JSON公开观测、机制文档及私人模型，没有游戏输入、游戏实现或隐藏解法访问。

## 63输入候选

完整串：`WDDDDSXSWWWAWDDWWWWSSSWAADDSSSAAAWWSDDDWWWWWAAAASDDDWDSSSSSASDD`

1. 21步 `WDDDDSXSWWWAWDDWWWWSS`：双活人5,4和2,5；按初态箱顺序为2,4 / 3,4 / 2,2。普通几何模型8468已见状态找到此串，后已实测。
2. 第22步 `S`：上方角色把空箱2,4推至2,3，自己进入DARK+SPIKE2,4成为固定ghost；另一个活人到5,3。
3. 再 `WAA`（time25）：活人回5,4再左推3,4箱至2,4捕获ghost，活人3,4。形成2,2空箱 / 2,3空箱 / 2,4载ghost箱的三箱纵链。
4. 再 `DDSSSAAAWW`（time35）：活人绕下站2,1，连续WW推三箱链，自己停安全2,3，箱在2,4空 / 2,5空 / 2,6载ghost。两个空箱隔开推者和地刺，因此不会重演单箱上推后推者死亡。
5. 再28步 `SDDDWWWWWAAAASDDDWDSSSSSASDD`（time63）：活人绕5廊至1,6，向右把cargo从2,6推至5,6；绕到5,7向下连续5S把cargo送5,1，再从4,1推DD至GOAL7,1，活人6,1。

## 验证与边界

- 原始3-28 events4/8已验证ghost可被箱覆盖装载，载ghost随箱进入DARK外仍active/ghost1，早期实验尚未证明目标观察会复活；后续event44已实际验证。
- 初态21步由scratch/root-3-27-geometry.cjs普通模型找到。目标明确为players2,5/5,4及ordered boxes2,4/3,4/2,2。
- 对scratch/root-cargo-keys.cjs做仅内存变体：允许DARK实体；2,4入格保留角色，未装载的2,4角色原地等待；其余用普通cargo运输。完整63步重放均非null，检查点21/22/25/35/63与上述构型一致。这只校验几何，未模拟ghost光照、世界线或完成判定；未新增CJS/JSON文件。
- GOAL7,1观察boxed ghost产生生死两线已由event44验证。后续采用留boxed活人在底目标，让该线外部活人去一处上方目标，另一个单人线去另一处上方目标，是后续可检验方案。
- 先向下运输cargo到2,2的方案不推荐：cargo到5,2后会挡住5廊，不能直接假定外部活人能到5,3向下推；row8全为墙，也无法从5,8回收推到5,7的箱。

可分段检查time21、22、25、35与63。全部只读进程已结束。

## 实测完成更新

父任务已核验：上述63输入全部实测。3-28.json event44对应time63，载ghost在GOAL7,1被观察并产生双世界线，原ghost在一线复活。随后正常收尾，最终84输入completed=true；SaveSlot1本关state3、保存动作编码与执行记录一致，累计完成85关。原候选模型不模拟光照/世界线的边界仍然成立，实际完成以主JSON末完成记录为准。
