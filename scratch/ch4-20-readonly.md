# 4-20实际21：首分裂后持Fork2普通相反力（2026-10-05）

37整组复制probe后normalundo22回真实15，保原完整历史，再XWWWD→20：C4empty2,4/Blueempty4,3，free59=3,3与71=5,3各F2/D。21单D确生两叶/time21：axis0 Blue5,3、winner59=4,3/D/F2，71 inactive/maskedoff1/contained0；axis1 Blue3,3、winner71=4,3/A/F2，59 inactive/maskedoff1/contained0。两叶都仅一个活freeF2，没有载人箱/捕获，全部ghost0，C42,4未动。新增22undo，horse历史累计27undo0retry，未完成。 主JSON events[85]。

---

# 4-20实际37：持叉异源叠体连同箱层复制（2026-10-05）

新正常回访重建C4-first25，再WWAX→29、SAAWWA→35。36单W将Blue58与C4cargo57/60异源叠于2,3，C457底height1、Blue58上height2/container57、cargo60height2/container57/F1/W，另62/63在2,4F1；twofree3,3/A和2,2/W。37单X原双箱层组57/58+60迁3,3，新双箱65/66+67在2,4；上cargo62/63单侧迁2,5。三cargo各F0ghost0活，threefree59=3,2/A、61=1,2/W、64=2,3/A各F0ghost0活；freechild68同3,2 inactive且maskedoff0。实际五BOX/三刚性位置组、六活角色、单叶71/time37、无dialog/未完成，不能将五物体当五连续链格。本回访0undo0retry，历史5undo0retry全保。 主JSON events[73]/[75]。

---

# 4-20新实际26：三载箱各F1（2026-10-05）

新回访26实际 SSSSSSDDSSSSAAWWSXAWWDSDAX：22单D首捕Blue5,3F2，outside3,3F2、emptyC44,3；SDA后25面A，26X得到C4cargo61/57=3,3、Bluecargo60/58=5,2、63/62=4,3，outside59=3,1；四活均F1/A/ghost0，单time26，未完成。新回访0undo0retry，历史累计5undo0retry。新ordinary→lastX→ordinary域598/598/pending0/depthCut0无Goal，maxBoxY5；停止17stack/4conflict，未传播未知叠体。AX虽六盒两外人但Blue5,1不能普通北回收；WWWDX异源stack仅候选未实测。优先正常返回，转4-19新41完整光路候选，不扩大horse域。 主JSON events[48]。

---

# 4-20 馬 / horse：只读模型与实际资源证据

截至 2026-10-04，本关尚未完成。唯一输入 owner 为 `resume_slot1_oct03`。本报告与 `ch4-20-readonly.cjs` 只处理正常观察、已验证规则和私有模型；没有游戏输入、提示、实现读取、存档或主知识库修改。没有仍在运行的搜索 handle。

## 实际地图与进度

权威来源为 `artifacts/slot1-playthrough/4-20.json`。初态 P59=4,10/F0，Color4 BOX57=3,3、Color3 BOX58=4,3；三叉在4,6/7/8，唯一目标1,10。size8,11，坐标外沿0..8/0..11。无ICE、DARK、PRISM、Gate或Lock。缺Floor阻挡，Wall覆盖优先。

col2 y1..3安全，y4..10全SPIKE；1,10目标只经2,10进入。右侧安全迂回连接下房与4,5..10，3,10安全。不能把裸人沿col2上行当可活。

实际事件（零基索引）：

| event | 有效指令数 | 实际状态 |
|---|---:|---|
|1|4|`SSSS`：P59=4,6/F3/S，全部叉inactive，两箱原位|
|3|15|`SSSSSSDDSSSSAAW`：P59=5,2/F3/W|
|5|16|单X：P59=4,2、P60=5,3，均F2/W；两箱未动|
|7|15|正常undo1恢复15，历史16保留|
|9|19|`AASA`：P59=2,1/F3/A|
|11|24|`XDDDW`：P59=5,3/F2/W，P61=2,2/F2/A，两箱原位|
|13|25|末W双箱链捕获：C4 BOX57/cargo61=2,3/F2/W/ghost0；Blue58=3,3空；outside59=4,3/F2/A|
|15、16|26|单X出现两线，活实体均ghost0，completed=false|

26完整有效串为 `SSSSSSDDSSSSAAWAASAXDDDWWX`，当时历史累计1undo/0retry。

26的首 cargo/free-X 混合推力已经实证：cargo在2,3/W的一支向D推Blue，outside在4,3/A的前方分支向A推同Blue。

* axis0 / D胜：Blue58=4,3；C4 BOX57/cargo61=3,3/F1/W；BOX63/cargo64=2,4/F1/W；outside59=4,2/F1/A。输家62 inactive/maskedoff1。
* axis1 / A胜：Blue58=2,3；cargo64/BOX63=2,4/F1/W；outside59=4,2/F1/A、62=3,3/F1/A。原BOX57/cargo61 inactive/maskedoff1。不能把败者继续计入活资源。

私有模型生成的两活资源配置与这两叶吻合。

## 已完成的有限轮

| 范围 | expanded / seen / pending | 结果与边界 |
|---|---|---|
|actual16，WASD/free+livecargoX，cap5000/depth40|5000 / 7295 / 2295|未达Goal、未首F2capture；无深度截断，预算截断|
|actual16，只WASD、恰好两活F2，首cargoF2+outsideF2，cap5000/depth35|2944 / 2944 / 0|无命中、无深度截断；最短拒绝`WWWDD`为Blue相反普通推力，未传播此边界|
|actual25，普通+剩余cargo/freeX、显式推力冲突叶，cap5000/depth40|5000 / 9548 / 4548|未达Goal；最高cargo y7，最高持叉cargo y6；预算截断|
|actual26两实证叶，仅WASD、保至少1outside，在末Fork1-X前求持叉异源stack或3cargoF1，cap5000/depth35|2430 / 2430 / 0|未命中；**4个depth35截断**，不能称完整无限深图耗尽；无stack或occupied样本|

上述域均记录首ghost但不传播，异源stack与高Fork occupied capture停止；同源箱融合按M107，现有cargo普通朝向按global输入，X保持父面向。无额外叉拾取、ICE或环绕。不同origin对象不是因颜色相同而融合。

actual25的5000轮记录64次异源stack、18次高Fork occupied capture、330次conflict，其中stack样本全部已消耗为F0，未记录持叉stack。首stack样本从25为`WWXAX`：两cargo父2,3/2,4 F1/A、Blue3,3、outside4,3 F1/A；末X将Blue与新C4 child同到2,3。尚未实际验证，模型未传播它。该样本的叠加本身没有剩叉，不能假称能再复制整叠获得六盒。

## 正资源前缀及条件全Goal尾

owner改变首X位置的25资源前缀已经实际闭环：从15续 `AASAXDDDWW`。最短分段检查点为4/X/DDD/W/W：2,1/F3/A → 两F2在2,2与1,1 →5,2/D与3,2/W →5,3/W与2,2/A → C4 cargo2,3/F2/W、outside4,3/F2/A、Blue3,3空。

六盒链的库存条件是有效的，但尚未取得合法前置：假定六盒占col2 y3..8、最高盒2,8载活cargoF0，outside2,2与4,3，则固定普通尾

`WWSDDDSDDWWWWAAAWWWWWAA`

共23步已模型逐步核：首WW将六盒送y5..10，第一推者死2,4，另一outside落2,3；随后经下房、右col7、4,5..10绕至3,10，末A将最高cargo2,10送Goal1,10，第二推者死2,10。不要求末端cargo继续持叉，也不把六盒条件当实际已达。

普通n盒连续链若后盒2,3、pusher2,2，在第二次W时pusher死2,4，最前盒到y=n+4。因此该**具体两次推链**需要六盒到2,10。它不证明全局必须六盒；高Fork-X、Ghost、异源stack或其他接力未被排除。

## 持叉同格融合探针实际闭环

此前的待验证条件已由owner实际执行：26正常undo1→25，WA→27，单X→28（event18/20/22）。2,2确发生新cargo与另free的持Fork1融合：C4 BOX57/cargo61 active/Fork1/contained1/ghost0/height1；free child65同格 inactive/maskedoff0/ghost0/contained1/container57/Fork1。没有相加到Fork2，也不是两个活cargo。另一cargo67/BOX66=2,4/F1/A，outside59=3,1/F1/A仍活；单线completed=false，无dialog。本例cargo61获胜，与M116 Fork0中原free胜的ID不同，不推广存活ID优先规则。

之后normalundo3→event24精确恢复actual25：cargo2,3/F2/W，outside4,3/F2/A，Blue3,3空。累计5undo/0retry；28以及26两线历史均保留。owner准备正常return并推进4-21，本轮不再搜索。

`multiStep`现只为**安全格、cargoFork1+freeFork1**补此已实证合并（留Fork1）；并用`observedReplay WAX`逐步核验。旧base `step/replay`仍是历史边界模型。上表5000和2430轮是在此次补规则前运行的历史结果，未重新开cap，不能假称它们已覆盖新合并传播。

自由人1+1同格已有1-19 event3实际activeFork1/inactiveFork1，对该普通案例未求和；不能用它推广所有货物/高Fork融合。4-14同源cargo1+1融合仍1有直接证据，已用于模型。

复现命令：

```powershell
& D:/nodejs/node.exe scratch/ch4-20-readonly.cjs resource 5000 35
& D:/nodejs/node.exe scratch/ch4-20-readonly.cjs solve25 5000 40
& D:/nodejs/node.exe scratch/ch4-20-readonly.cjs beforeLastX 5000 35
```

这些是已有轮的复核入口，不是增加预算的建议。主JSON由owner维护，本报告只在实证到来时追加。
