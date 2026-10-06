# 5-5 坏死：Shadow观察与39步候选（2026-10-06，只读）

模型 [ch5-5-oct06.cjs](ch5-5-oct06.cjs)，公开证据 [canonical](../artifacts/slot1-playthrough/5-5.json)。helper不输入游戏、不用提示/外部攻略/隐藏实现/反射/存档或主KB改写；唯一输入owner是slot1_owner_oct06。仅确定重放owner手算，无搜索、无handle。

fresh0 event6/frame3361851/runtime necrosis：57[7,2]/S/F0，55[3,3]和56[5,1]均BOX/classBox/Shadow=true/Color1/h1/active/pushable/blockable。Fork53[1,7]，Button54[1,4]/Gate58[1,6]初闭，Goal1,1/3,1安全，无SPIKE/ICE/DARK。正常自动教学说明这些是死去箱子的残影，不把Shadowfalse空箱或死玩家规则直接套用。

owner先SAA至3，独立A4将56送Goal3,1；actual11/frame3389608，56在3,1变**inactive**，仍Shadow=true/mask0/height1/blockable=true，实体保留，57[4,1]/A活free/F0，无分线/dialog。此实际变化清除底道阻挡，才可从Goal3,1上入3,2推55。CJS先核已actual SAA普通几何，再核A4已有观察；不在模型先删除实体。

actual4后30普通输入 `AWWSSDDDWWWAAAAWAWWSSSSSWWDDSW`：前15至19把55送Button1,4，p57[2,4]/A；末A19单核Shadow箱压门。WAWW至23取Fork1,7。S5至28把55送Goal1,1，末S28单核同Shadow55是否inactive：26推者自身接替Button压力，27门可闭，之后无需再过上门。WWDDSW至34得到p57[3,4]/W/F1，两个Shadow箱都按已观测56机制预测inactive；第二个55仍需实际核，不能以共享字段当已证。

独立X35安全出生2,4/4,4，两人F0/g0/free；新ID/GMID现场核，不预设分配。最后ASSS39分别到Goal1,1/3,1。条件准确完整39串：`SAAAAWWSSDDDWWWAAAAWAWWSSSSSWWDDSWXASSS`。完整运输已核，未知仅19压门、28另一Shadow箱光观察及35实际出生字段；当前尚不声明completed。CJS `.candidate.trace`逐步完整动态预测，`.prefixChecks`只收真实已发生帧。

## 实际39完成审计

owner本轮实际采用上述39，0搜索/0Undo/0retry，无提示。4→8/12/16/18全部实体和terrain完整相等；独立A19 actual22/frame3419840，55 Shadow箱单压Button1,4实际让Gate58 blockable=false。23取得Fork1；独立S28 actual29/frame3433734，55到Goal1,1变inactive，仍Shadow=true/mask0，未删除实体、未产生世界线，57[1,2]/S/F1。其余已actual停点19/23/27/28/32/34的完整字典在CJS prefixChecks保留，不把两个具体Shadow实例推广成所有装载/纠缠或死者规则。

独立X35 main36/frame3450894，57[2,4]/W与新59[4,4]/W皆F0/g0/free；new59/GMID55是实际分配，未预设。出生全实体字典及terrain与几何预测相等；ASSS前3步至38全60entity+terrain相等。

末singleS39回执39已接受一次，完整completion main41/frame3463964 **completed=true**：57[1,1]与59[3,1]均active/ghost0/F0/free，55/56两Shadow在各Goal保留inactive。完整准确39为canonical run，未为另一helper未执行31优化回退。CJS `.completionEvidence`所有物理/static字段相等，末两PLAYER `anim_completed=false` 与stable模型true的差异如实保留，不能声称终raw完整字典diff=[]。无需补造动画稳定帧。root负责正常存档核，helper没有读取存档；无live handle，继续5-6。
