# 4-19 反制：41输入实际完成（2026-10-05）

4-19反制正常回访41输入实际完成；38X出生同刻捕空Blue，三cargo3/4/6,6与外人1,6均F0；末DDD把三载箱送5/6/7,6，外人最后死4,6SPIKE，三cargo活contained/ghost0。源及左右Prism45/46/47均traversed/testCompleted=true、lighten=false，completed=true。本成功回访0undo0retry，历史累计22undo0retry全部保留；自动World[-42,-12]F1。

完整有效串：

```text
WDAXDDWWWSAWWWWWWDSSSSDDWWSAWWWWWDWSWXDDD
```

|输入|实际状态|主JSON事件|
|---|---|---|
|9|C4cargo48/42=3,3F1/W，Blue43=4,3empty，free44=5,3F1/A|90|
|17|C4cargo3,6F1/W，free2,6F1/W，Blue仍4,3empty|92|
|24|C4cargo4,6F1/D，free5,2F1/D，Blue4,3empty|94|
|34|C4cargo5,6F1/D，Blue4,6empty，free3,6F1/D|96|
|37|预X cargo5,6F1/W、Blue4,6empty、free2,6F1/W|98|
|38|C4westchild推Blue4,6→3,6，free eastchild同格被捕；cargo49/43=3,6、48/42=4,6、51/50=6,6，outside44=1,6；四活ghost0/F0|100|
|39|free2,6，其余不动|102|
|40|Bluecargo4,6、C4cargo5,6/6,6、free3,6|104|
|41|三cargo5/6/7,6活；外44死4,6；三个固定Prism观察测试全部true，游戏completedtrue|113|

这条路线避免旧25的新三cargo把唯一外人困在下室。root的定向上区新资源搜索在4174展开/4255seen/81pending/depthCut0命中，cap5000，未穷尽。完整41固定模型复算valid/rays3，逐段9/8/7/10/3/单X/三个单D实际全部吻合；光学完成以游戏实际completed及Prism字段确认，没有用模型rays预记通关。旧12k/782/647/52以及stack27和新生捕获25的有限边界和历史仍保留，不重启已封存域。

---

# 4-19当前实际25：X新生角色被移动Blue捕获（2026-10-05）

新25实际完整 WDAXDDWWWSAWWSDDWWSAWSDAX：24 C4cargo48/42=3,5F1/A、emptyBlue43=3,4、free44=3,2F1/A。25X C4南child推Blue至3,3，free北child同在3,3被Blue捕获，成为52/container43/height1/F0/A/ghost0活cargo；C4 cargo48=3,4、新53/cargo54=3,6，outside44=3,1，四活角色均F0/ghost0，无stack/冲突/自动对话，单time25未完成。此前actual27叠体两相关叶全历史保留，正常undo18逐次回9后重部署；累计22undo0retry。此例确认X新生人物可被同输入移动空箱捕获；该source普通尾52/52/pending0/depthcut0未到光路，单外人仍被箱列困在下腔，不把三cargo库存当已闭Goal运输，不重跑该有限域。 主JSON events[81]。

---

# 4-19当前实际27：两层叠体关联推力分线（2026-10-04）

SaveSlot1 117关6星；唯一游戏输入owner `/root/ch4_1_readonly`。正常回访 actual27/time27，完整串 WDAXDDWWWSAWWSDDWDAXSSWDAAW。26 双free44=4,3/49=3,2；末W对同一C4底42+Blue上43叠体请求A/W，实际2相关叶。axis0 A胜整个叠体到2,3 SPIKE，cargo48 height2/container42/ghost0仍活，free44=3,3活、49maskedoff1。axis1 W胜叠体到3,4，free49=3,3/W活、44maskedoff1。两叶均Blue43 height2/contained1/container42、底42height1，旁观cargo51/BOX50=3,5保留。每叶2cargoF0+1freeF0，未完成，累计4undo0retry。新20刚性叠体普通first-light图647/647队列耗尽仅限无新增叠箱/冲突/occupied/ghost/X传播，未得完整光路运输；此实测补其拒绝边界，不将两物理层算独立4叶或新增活乘员。 主JSON events[39]，所有旧initial/17/21/undo4/新20历史保留。

---

# 4-19当前实际20：新异源一载一空叠体（2026-10-04）

SaveSlot1 117关6星，唯一输入owner `/root/ch4_1_readonly`。正常回访新20 WDAXDDWWWSAWWSDDWDAX：C4底42与Blue43在3,3异源叠体，Blueactive/contained1/container42/height2；cargo48 active/contained1/container42/height2/F0/A/ghost0。另一C4 50/cargo51在3,5F0，free44=5,2和49=4,3F0/A活，共4active、单time20、未完成。本次0undo0retry，累计旧4undo0retry。实际叠箱运输/光学后续待核，不把条件ray覆盖当完成。 主JSON events[32]，原initial与17/中央21负例/undo4全部历史保留。

---

# 4-19 三列观察预算独立只读审计

2026-10-04，`/root/ch4_1_readonly`。只读取 `artifacts/slot1-playthrough/4-19.json`、已验证机制与资源助手的公开只读模型，并做四个单串重放；**零BFS扩展**。未输入游戏、修改保存/主KB、读实现/提示/攻略。运输搜索由resourcehelper负责，本报告不重复它的完整域。

## 当前实际资源与未完成证据

实际17 `WDAXDDWWWSAAWWWAW`：C4 BOX42/cargo48在3,6，Fork1/faceW/ghost0；outside44在2,6，Fork1/faceW/ghost0；Blue43空箱4,3。两KEY均inactive。主JSON events[11]及normalundo4后的events[17]可直接复核。

历史21 `WDAXDDWWWSAAWWWAWDDWX`：两cargo在4,6/6,6，Fork0；外人此前踏4,6 SPIKE死亡。**completed=false**。中央Prism45=6,8的traversed=true/testCompleted=false；左Prism46=5,8由false变traversed=true/testCompleted=false；右Prism47=7,8仍traversed=false/testCompleted=false。这可以由递归检测早停解释，不能由右false或侧棱镜未明显出光推导侧支无效。

## 三列几何与预算

三个Prism都是固定几何中的不可普通搬动结构：北y9是Wall；两外侧4,8/8,8是Wall；横向三Prism链也由这些Wall夹住。向下每列只有y7/y6两个开放格，y5的5/6/7列是真Wall。已知光学规则M053/M054/M068支持的条件是：

- x5、x6、x7各列的活外人或活cargo位于y7/y6，分别能作向下支的观察者；不要求全部是cargo。
- 邻接空BOX在y7可以关闭对应方向（M054的已验证局部规则）；远处空BOX在y6不能自动代替观察者或免除这一支。
- 相邻Prism并不普遍关闭方向（M068）。中央Goal6,8的整个光路仍需实际testCompleted/整体completed验收；不要未经观察把三条不完整叶线的各一条光枝拼成同一Goal已完成。此处不同于4-15六个独立Goal的目标集合分工。

17直接X的单串模型：C4cargo2,6/4,6，twofree1,6/3,6，均Fork0，Blue4,3不动，共 **4个活角色**，出生无同格融合。第三cargo不是库存硬需求；第三空箱捕获一个free时只是 **2cargo+2free→3cargo+1free**，不会凭空增加第五人。若新cargo出生吞另一个free，M116说明可融合成一个活角色，不能误算两名活动观察者。

两个直接X外人都在左安全岛。上右区域的普通切口4,6是SPIKE、4,7是Wall；下区x5/6/7,y4/5为Wall。因此单纯演员总数充足不等于已有第三条可运输的观察路径。

## 不重复搜索的另一部署单串

从实际17接 **`DSSSSDDWASAWWWSSSDWX`**（20输入）的模型单串全部合法，关键点：

| 尾输入数 | 资源 |
|---|---|
| 1 D | C4cargo4,6 Fork1，outside3,6 Fork1，Blue4,3。 |
| 9 A | Blue3,3，outside4,3；C4仍4,6。 |
| 14 W | Blue3,6，outside3,5。 |
| 19 W | outside4,3 Fork1/W；C4cargo4,6 Fork1/W；Blue3,6。 |
| 20 X | C4cargo3,6/5,6 Fork0；Blue被侧向出生推到2,6；free3,3/5,3 Fork0，共4活角色。 |

相比直接17X，它把一个cargo先放进右侧x5光支，两个free在下区，避免free出生被载箱吞掉。**没有完整三列光路尾，不建议owner仅为新坐标走20步。**已把这一不同部署family交给resourcehelper，无第二份BFS或额外cap。

## 首异源叠箱探针独立核查

resourcehelper的受限搜索没有传播异源stack，而是记录边界。两个短样本经本助手单串重放到preX有效：

1. **完整20输入** `WDAXDDWWWSAWWSDDWDAX`，不是19。末X前总19：C4cargo3,4 Fork1/A、Blue4,3、outside5,3 Fork1/A。X时cargo南/北出生3,3/3,5；free南侧5,2有效，北5,4为Wall，前备选4,3把Blue向A推到3,3，自己生4,3。因此预测新C4cargo盒与独立Blue在 **3,3** 同格，另cargo3,5、twofree5,2/4,3。不同源箱体重叠属于M084/M052方向的明确物理probe，不是M107同源融合，也不是M116两个角色直接同格。
2. **完整23输入** `WDAXDDWWWSAWWWSSDDWWSAX`，不是21。末X前总22；预测叠体3,4、另cargo3,6、twofree3,1/3,3。仅重放前置，末X由当前模型异源stack拒绝，不表示实际游戏会拒绝。

当前实际17若选择第1探针，已验证9checkpoint可通过**正常undo8**恢复，再11尾 `SAWWSDDWDAX`（前10普通→preX19，末X→20）。是否执行由owner/parent决定；本助手不发输入，也不把预测stack、height、cargo继承或光观测分线当已经发生。若实际stack成立，其后需要分别核载人、同格融合、叠体进入光束时的实体分线与每叶观察预算。M084给出了载人叠体观测后每颜色支保cargo的历史实证，但不保证这一新构型已能运输到全部光支。

## 可恢复等待谓词的范围

free5,4被W5,5、D6,4、A4,4三Wall包围。若三BOX占5,1/5,2/5,3且背5,0 Wall，则S整链也推不动，可普通等待。另一free从6,3向A移走上BOX5,3到4,3可释放并改变相对奇偶；不能把同奇偶单箱捕获的拒绝泛化到全部BOX布置。这个条件需要三BOX部署，其中row1箱不能普通上抬，回收和观察预算仍是实质限制。resourcehelper已经确认其17X普通782节点域保留row1箱，故此谓词并非因剪row1而漏掉的新cap理由。

结论：本轮证实4角色预算、三列观察条件、另一X部署family及两个合法stack前态。没有声称通关，也没有扩大运输搜索；最有具体物理价值的是总20输入的首次异源stack末X，等待owner实际观察。
