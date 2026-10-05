# 4-10 蜗牛：第二次只读分析

2026-10-04。唯一输入为 `resume_slot1_oct03`；本 helper 不操作游戏，不读取提示、攻略、隐藏实现，不改存档或主知识库。旧尝试23输入/12undo历史保留，本次实际已回访并重放到23输入/time23，0undo/0retry。关卡尚未完成。

## 实际起点及待实测捕获

本次主 JSON末events：`SDXASDDDAAAAAWWWAWWSSSS`。P60(3,1)Fork0、P63(1,3)Fork1；原BOX57(4,2)、58(3,3)、59(4,3)，key(3,6)仍active，LOCK(7,4)仍active，四门closed。

旧普通模型9尾 `WSSSSAWWA` 已由owner分段实测，本次32有效输入/time32。五尾WSSSS后free60(6,1)压button0/holder63(3,2)；AWW后free(5,3)/holder(2,4)，门closed。末A由free从5,3推两箱链：BOX59(4,3)→3,3、BOX58(3,3)→2,3；holder在2,4左碰closed1,4后转S到2,3，捕获到BOX58，faceS/Fork1/ghost0。free在4,3faceA/Fork0，BOX57仍4,2。cargo63 active/contained1，32最新真实状态与模型完全吻合；本次仍0undo/0retry。

## 两种直接X及明确的新前置

独立模型 `scratch/ch4-10-revisit-readonly.cjs` 调用自有旧普通模型，不读取游戏实现；对未建模的新增SPIKE捕获直接拒绝，避免将ghost1当ghost0。

- 捕获后DX：两cargo(2,4)/(2,2)，free(5,3)，空箱(3,3)/(4,2)。仅普通、保持actors/四箱、深≤36，5762/5762穷尽未取key。
- 捕获后SX：两cargo(1,3)/(3,3)，free(5,3)，旁空箱(3,3)被侧推4,3，另空箱4,2。保留原x1cargo，不伪称其可东移；6000展开/6735seen到cap，未取key。
- root提出先保持Fork1把cargo送3,3，再free压6,1，X进3,4占门。模型从捕获态得到20尾 `SSAASAAWWDAWAAWDDSSA`，1982展开/2550seen：cargo3,3Fork1面A，空箱2,3/4,3，free6,1。该前置不损箱；未执行，尚未完整解。
- 上述姿态X竖分cargo3,4/3,2，空箱2,3/4,3，free6,1。14尾 `AWAASAAWWDWDWW` 能free拾key3,6；cargo3,4先被右推4,4，free离3,4后门关闭，keyfree陷上房。仅取key不等于取回key；未建议实际执行该无尾段。
- 对该post-X求key带回y≤3的有限域：6000展开/7352seen到cap，深≤36，未命中。不含新的X、叠箱、世界线冲突、ghost捕获，排除新box y1/x1/3,6/5,6/6,2等普通难回收位置；不是全局无解证明。
- 从旧23两free/Fork1普通域只找第一次两异源箱同刻进入同格：6000展开/9761seen到cap，允许BOX x1/y1、不要求回收，但保持两活free与Fork1、深≤36，不做X/冲突/ghost捕获。未找到叠箱短positive；未要求owner回退32或升cap。若以后得到叠箱，cargo X是否复制整个嵌套仍需单独实测。

owner随后实测有限BOX占门判别：从实际32执行上述20前置，第52 cargo63/BOX58在3,3面A/Fork1、free60在6,1，两空箱57(2,3)/59(4,3)。第53 X原58/63到3,2、新64/65到3,4，两个cargo均active/ghost0/Fork0，free60留6,1。第54 A外人离button到5,1；实际gate3,4 `blockable=false`、gate4,5 `blockable=true`，无自动dialog。本 helper 独立读主JSON末event确认54串及实体状态。这证实本实例BOX占位与此前PLAYER相同：仅占据那一扇门保持开，不是同ID整组保持开。没有执行14取key死端尾，本次截至54仍0undo/0retry。

## 等待和库存边界

资源 helper 静态核了closedgate背箱等待：holder1,6/BOX1,5/closed1,4，或holder4,6/BOX3,6+5,6/closed4,5等。能够等待不表示箱可回收到右侧运输通道；x1箱无西推位，3,6与5,6箱背row7墙，不能仅凭邻箱或等待规则标为完整正前置。

owner的三BOX两free连续WWW接力已由root/资源 helper否定该精确条件：W2后后free7,4与rearBOX7,6隔一格，W3只踏7,5刺死，箱不动，未到7,9。仅否这个尾，不把四BOX充分构型推广为必要条件。另提Fork1cargo+两free先冲突、三箱链WW到7,8后另一线X到7,9，是条件资源结构；actual23尚未构造该三actor且保Fork1的状态。

## 本轮封存锚点

54占门探针后 owner 正常undo2回52，cargo63/BOX58(3,3)Fork1、free60(6,1)、empty57(2,3)/59(4,3)。累计14undo/0retry（旧轮12、本轮2）；本关仍未解。保留53/54实际probe及撤销历史，不发送14取key死端尾、不升搜索cap。新4-15 firstFork1→X两Fork0→再取冰/刺叉属于此前3790域外的资源顺序，当前只是后续候选范围，不要求盲更换首X或重入。
