# 4-22新实际22：顶行两持叉自由人（2026-10-05）

新正常回访重建15两叉两Key，再AWWWAWX：actual22/time22两free88[3,9]/89[5,9]均F1/key2/W/ghost0，五原空BOX未动，单叶90，无dialog/未完成。本回访0undo0retry，erosion历史20undo0retry保留；horse21正常return，horse历史27undo0retry保留。

完整串 `SSSSSDDDWWDWWDSAWWWAWX`；主JSON events[60]。Slot1 118关6星，唯一输入owner `/root/ch4_1_readonly`，继续禁提示/反射/存档改写。

旧40147/40147、pending0/depthCut0结果只覆盖过强同步首捕子域：旧top-pair-owner.cjs在首次cargo5,9成立、outside尚不在3,9时立即剪枝，因此没有传播先捕获后普通调整outside3,9的合法阶段。保留旧统计作为历史，不能用其无命中排除capture→调位。新源与旧AWWWWAX源普通可达关系不扩大自由度；当前首X的W面/两出生格是真实不同checkpoint。helper只读修正目标阶段，owner不重复搜索。

---

# 4-22 侵蚀：只读模型与实际里程碑

2026-10-04。唯一输入 owner `resume_slot1_oct03`；本报告/同名 CJS 仅读取观察 JSON、采用已验证机制。未操作游戏、提示、存档或主 KB。当前已正常返回世界，关卡 **未完成**，保留 36 有效输入、time36、0undo/0retry。

## 地图与资源

实际 initial 为 erosion，size13×10。Wall 优先于地板/图标。无 ICE/DARK/PRISM。初态 P88(1,7)，F0/key0；Blue83(4,5)，四 C4 在(3,5..8)。叉(5,5)/(5,6)，钥匙(6,5)/(6,6)。锁实际共11：row4 x7..11、row2 x7..11、(7,9)。12,2 是 Wall，不能照口述视为锁。

右下可沿 row1 绕行两列五锁；目标11,9/12,9只能从顶层长刺路输送，不能把右下连通等价为目标可达。SPIKE为1,9、6..10,9以及被Wall覆盖的2,7。顶行7,9另有LOCK。1,9箱四邻均墙，普通无法恢复；2,9仅右3,9和左1,9有地板。

## 已实际闭环

源 `artifacts/slot1-playthrough/4-22.json`。

|实际输入|完整或新增串|稳定资源|
|---|---|---|
|15 / event3|`SSSSSDDDWWDWWDS`|P88(6,5) F2/key2/S；五箱原位、四KEY inactive|
|34 / event15|15后 `AAASAXWWDWADDDWWWAW`|C4原87/cargo88(3,9) F1/key2/A、outside89(3,5) F1/key2/W；空C4(3,6/7/8)、Blue(4,5)|
|36 / event19，21/23/25重复稳定帧|34后 `DX`|cargo88/87(3,8)，cargo91/90(4,9)，均F0/key2/D/ghost0；outside89(4,6)/92(4,4) F0/key2/D；空C4(3,5/6/7)、Blue(5,5)|

34末单W是四箱偶数链捕获：预态外人(3,4)/(4,9)同奇偶，北推四C4与另人W受北墙转A同时进入(3,9)。不能泛化“同奇偶不能装箱”。新捕获者保留自身实际fallback faceA。

36的两个cargo/两个outside和六物理箱为真实资源，不表示顶行组链已经成功。原(3,9)虽腾空，但其南(3,8)与东(4,9)均被cargo挡，左推位(2,9)仍需合法前置。

## 有界模型结果

|域|expanded / seen / pending|结果与边界|
|---|---|---|
|15首次任意safe cargoF1 + outsideF1，WASD/一次freeX，最多两活角色|5000 / 10312 / 5312，depth35无cut|截断无hit；stack/occupied/conflict停，非全局否定|
|初版固定五箱，目标(3,4)/(4,9)，含冗余F1 face/右区资源|5000 / 9623 / 4623|截断；未追加该域预算|
|精确固定五箱、x≤6/key2不消耗、首X后忽略无用face、只ordinary|428 / 438 / 10|positive19尾，已owner实测到34；`captureFixed`可复核|
|36六盒两F0 ordinary + 首普通冲突各叶任意Goal union|5000 / 10522 / 5522，depth40无cut|无Goal样例，顶cargo最东仍x4；独立stack/occupied停止、无Ghost传播、无wrap；不加cap|

36模型代表边界（均未实际输入）：

- `WWDWAAAAAW`：已有F0/key2 cargo捕获外人；模型停止，不假定新增活cargo或钥匙叠加。此时另一cargo在1,9，控制者合并未见运输价值。
- `AWWDDDWAA`：独立C4/Blue在3,5同刻叠箱。此前两cargo已在1,9/2,9，未得到目标运输闭合，因此没有请求owner仅为叠箱坐标实测。
- 一个固定BOX子图730/730耗尽，未到(3,4)/(3,9)双外人。该精确两格奇偶不同、源F0双人同奇偶且无等待；只是该固定BOX子域，不否定新的等待/叠箱/资源顺序。

## 新非顶捕获资源候选（MODEL ONLY，待回访）

root独立授权一次cap≤5000/depth40，目标“非(3,9)的safe cargoF1 + outsideF1(3,9)/faceA”，允许所有BOX坐标、仅首freeX，首后ordinary。A*3177 expanded /6160 seen /2984 pending，depthCut0命中，未升cap。

从实际15接 **`AXAAWWWWWWDSAWWDW`**（17）到MODEL32：C4原86/cargo(3,5) F1/key2/W，outside(3,9) F1/key2/A；空C4(3,6)/(5,9)/(1,9)，Blue(4,4)。下一X条件预测：cargo(4,5)/(3,6)，outside(3,8)/(2,9)，空C4(3,7)/(5,9)/(1,9)，Blue(4,4)。终于合法产生左推位free2,9，并避开cargo2,9锁边，但空BOX1,9已普通永久锁死，六盒中只有五盒可继续运输。**仅有正资源前缀，未证明两Goal，不请求盲回退。** 已交root/resource审计，owner优先4-23新图。

## 条件末尾（无合法前置证明）

若顶行x3..8六连续箱，最右两箱为活cargo（带钥匙），pusher2,9，则四次D能送cargo11/12,9，推者最后6,9刺死。Lock7,9需由进入其格的cargo自己持钥匙解；不得让outside隔空借Key给empty BOX。该静态正尾仅说明充分资源与位置，不代表36或MODEL32可部署，也不排除五盒/接力/多兼容叶的新方案。

复核入口：`node scratch/ch4-22-readonly.cjs captureFixed`、`replay <串>`、`solveDX 5000 40`、`nonTopCapture 5000 40`。后两者为封存原有界域，不要求继续运行或提高cap。
