# 4-22：保可回收箱的非顶首捕域（2026-10-05，已封）

现场真实22由 `SSSSSDDDWWDWWDSAWWWAWX` 复建：twofree88[3,9]/89[5,9]均F1/key2/W，五空BOX原位，单叶/time22，未解。本轮计算没有游戏输入，未撤销该22；主JSON events60及后续菜单返回帧完整保留。当前Slot1 118关6星，唯一输入owner仍为 `/root/ch4_1_readonly`。

本轮源为实际15资源，允许一次freeX，之后只普通WASD。目标：任意非[3,9]活cargoF1/key2，outside[3,9]/F1/key2/faceA；所有五源BOX避x1、row1、3,4死角及x>6东锁域，并固定复算随后X要求六BOX、两cargo+两free，其中一名free[2,9]。这替换了旧nonTopCapture在3177展开时早停于死箱1,9的弱命中，不复跑旧40147同步首捕图。BOX以Color/资源类别压缩标签；保留face、Key/Lock消耗，拒绝Ghost、普通推力冲突与不同源叠箱，不传播这些边界。

一次cap12000/depth40同步进程已经exit0，无live handle。结果：expanded12000，distinct seen17049，heap pending5050，stale0，depthCut0；无firstCargo、无目标hit。deadReject2981、resourceReject3846，forceReject28是输出分支拒绝次数，不是28个独立机制；unknownReject2。pending是堆条目数，可含尚未弹出的重复键，不要求expanded+pending等于distinct seen。达到展开上限且未穷尽，不扩大cap，不推出全关无解。

最早保存的普通force样本是15+`XWAAA`：Blue4,4、twofree4,5/5,4，各F1/key2，A/S请求同空Blue；没有既有cargo，非强运输正例。未传播的异源stack样本15+`AXAAWWWDDSDAWSA`：Blue4,4、空C4列3,5..7及空2,9，free5,4/3,8均F1/key2；末A使两个独立空箱同入3,4死角。没有完整Goal或可运输持叉stack前缀，不建议为样本单独实测。

旧40147/40147结果的限制已在canonical与原top-pair报告追加：旧代码首次cargo5,9成立而outside尚未3,9时立即剪枝，故未覆盖先capture、再普通调整outside的合法两阶段过程。原统计保留历史。helper修正后的另一12k两阶段首cargo5,9图也仅截断无首捕命中，不能当整个非顶cargo域已穷尽。

公开设置检查未改变游戏资源：游戏页仅默认显示网格、网格不透明度、显示转向箭头、滚轮灵敏度、丝带；全局页原文为“全局设置请在标题界面进行调整”。pause截图公开键位X分裂、Z撤销、B重做、R重置(长按重新加载)、C显示网格，没有新增Shift说明。`cancel`调用被Bridge以Unknown action拒绝，立即observe确认原setting/22不变，使用正常pause退setting、再pause恢复未暂停22；没有重发cancel，没有点击获得启示，没有更改设置。

脚本与结果：[ch4-22-nontop-recoverable-owner.cjs](ch4-22-nontop-recoverable-owner.cjs)、[result.tmp](results/ch4-22-nontop-recoverable-owner-result.json)。仅私有本地模型，零Bridge调用。
