# 5-4 自由：真实双free源的动态前置（2026-10-06，只读）

私有模型 [ch5-4-free-oct06.cjs](ch5-4-free-oct06.cjs)，证据 [canonical](../artifacts/slot1-playthrough/5-4.json)。无游戏输入、提示、隐藏实现、反射、存档操作或主KB改写；唯一输入owner是slot1_owner_oct06。

完整公开terrain只有SPIKE5,6，无ICE/DARK。55 C4[7,6]、56 C1[7,3]、57 C2[6,6]均普通BOX/classBox/Shadowfalse/h1/pushable/blockable，未猜颜色联动。Goal1,7与7,2/7,1均安全；右下入口7,3被56挡住，不能把空56下推7,1角落。

实际source11 main12/frame2858739，`WAAASWXAAAS`：58[1,4]/S、59[3,4]/S，两free active/F0/key0/g0/h1；三箱初位、Fork54inactive，Gate53[1,2]blockable=false。root独立2855444全部12动态完整字段与指令diff=[]。上Button1,4单独有人时足够开本Gate；下Button1,1独占、撤压后关门及箱占门尚未按本关验证。

新域从真实11开始，仅普通安全双free与三物理箱；先冻结右56[7,3]找57到Button1,4的持久压钮前置。无cargo/同格/争推/叠箱/裸刺死亡，拒绝这些未知边界而非模型提前定性。仅上Button压力建门，未假定下钮或门内物体保持。先用已经实际存在的7→11 `AAAS`完整字段校准，再给末一步独立核。原fresh单free24只作其他helper的历史条件参考，未重跑或移植到本双free源。

搜索总上限20k，首stage cap12000；默认只读校准，只有显式`--search-button`执行这一新域。不会保存额外JSON/队列。当前候选与真实结果需分开记录。

338 expanded/428 seen/90 pending得到33步持久压钮候选，停止搜索，无live handle；总20k剩19662。默认CJS仅重放缓存候选（新增扩展0），原统计在recordedSearch，未重跑fresh24域。真实7→11 `AAAS`全部12动态完整字段diff=[]。

actual11后 `WDDDDDDWWSAAAWAWWDSASSDDWAAAAWAWA`。前32到time43：58[1,6]/A、59[1,4]/W，两活free/F0；57[1,5]、55空Box[5,6]在SPIKE、56仍[7,3]。独立A44使58因西墙fallbackS推57→Button1,4，自己1,5/S；59同A因西墙fallbackS到1,3/S。末Gate是否维持开由箱压钮待actual，未取得任何新Goal/cargo。

条件单步S45：58推57到1,3并自身Button1,4，59进入原已开Gate1,2。S46：57到Gate1,2、58到1,3、59到Button1,1。S47：57到Button1,1、58到Gate1,2、59遇南墙转D到2,1。后三步每步独立核，门占箱/下钮单占是新边界，CJS的门字段只用已证上钮压力，不将post46/47的关闭预测当实际结论。

早先55[6,6]+56[7,6]直接双链Ghost捕获只是运输条件，非本source已达；当前持久Button前置让55留SPIKE，需新的可运输捕获构型，不能照搬那一构型。新方向可用同时移走SPIKE55与从5,5推入56：free6,6因北墙转A推55→4,6，另一free5,4/W推56[5,5]→5,6，前者同tick落SPIKE并捕获56为Ghost，另一安全5,5。之后可从4,7把55降4,5，绕右送7,6再左推6,6作后buffer；A双链再让cargo56逃到4,6，55留SPIKE5,6，outside6,6。此仅新机理条件，需前置搜索与末W真实核，不把局部命中当Goal运输解。

## 真实38与有限等待排除

owner只执行首27步到actual38 main26/frame3021977：58[3,5]/A、59[1,5]/S，57[2,5]、55 SPIKE5,6、56[7,3]，Gate闭；七停点全部12动态字典与模型diff=[]，无Undo/retry。未执行A39：这一步会将57推到1,5；x0全Wall，物体一入x1列即不能由左侧向右推回，故不采用“压钮后回收57至右上三箱jam”的未成立建议。完整33步仍保历史候选，44尚未actual，SSS尚未actual。

新`--search-jam`从真实38出发，三Box/两free普通安全域，允许56回收和所有箱移动，目标是任何一人原地等一拍、另一人运动的相位改变；启发偏右上8,4三箱构型。拒contact/stack/force/cargo/裸死亡，不消箱，唯一额外运输剪枝是空箱7,1永久角落。门仅按已证上钮压力，未扩门占位/下钮未知。**12000 expanded/12616 seen/616 pending截断无hit**；这是有限普通域，非全关无解。与按钮338合计12338、总20k余7662，无live handle；不重复该图预算。

静态直线箱链阻挡核算中，safe floor上用≤3箱封住全部四向的唯一构型是free8,4、箱7,4/8,5/8,6，最少三箱；8,6是永久角落，需考虑运输库存。左侧1,3的北箱链必须含1,4按钮，会打开南Gate，不能把它同时当封闭南墙。该结构核算不包含contact/force/叠箱/门动态未知，不能据此宣布所有相位机制被排除。

可判别的新短probe（未actual）：source38 singleS39使58[3,4]/S、59Button1,4/S，三箱未动；singleS40使58因南Wall转D[4,4]、59[1,3]/S，读Gate。北离钮已实际闭，但南离至门前邻位1,3未单独核；若仍开才singleS41核进入Gate1,2，若闭则止40，不把门占位M099扩到门前邻格。此probe保两free与三物理箱，可直接改变下一实际动作。

后续owner实际singleS39开门、singleS40 **门已闭**，末full frame3114152：58[4,4]/D、59[1,3]/S，三Box同38，双活F0/g0/free。南邻位保持已被此fixture排除，没有执行S41；0Undo/无handle。CJS `.actualSouthButtonProbe`保留39/40全部12动态审计，未将门前邻位当占门，也未写Gate内箱/下钮为已验证。现有模型不足以给全Goal解；新fresh持叉、出生箱捕获或其他未校准机制仍是不同域，不能小改这12k图继续重复预算。

## 新F1出生静态Box边界（尚未actual）

公开旧source6 event4/frame2800589为单free58[5,5]/W/Fork1，三Box初位。与双free12k域不同，single F1安全setup小域271 expanded/334 seen/63 pending得到32步但含无关永久压钮，被owner手算14取代；没有继续2k预算。累计12609、余7391，无live handle，未部署那32步。

owner正常Undo34回6后必须核实际恢复；helper只重放 `DDDWAASAAAWWDS`，CJS `.birthProbe14.trace`给每步11动态完整预测。末time20：58[4,6]/S/F1/g0/free，55在SPIKE5,6、57[4,5]仍可回收、56[7,3]。无需把Blue先锁x1；末X独立核。普通birth-push几何预期东子把55推6,6，自身停5,6后裸死inactive/g1/F0/uncontained，西新子3,6活free/F0；新ID需实际核，不假定撤销后复用59。若出生与静态BOX接触先结算，东子也可能active/g1/contained55随Box到6,6；这是未实证新边界，私模不实现它、更不称阳性或全解。

后续normalUndo34真实恢复actual6 main40/frame3215507：全部59entity完整字段、地形和`WAAASW`与旧source6严格相等，仅timeline59→60保留。owner脚本过严whole-timeline断言exit1已记录，未重发/无retry。14人工前缀四停点time10/14/18/20全部59entity与terrain严格相等。

独立 **X21 actual negative**，main51/frame3272946：55移6,6，原58停SPIKE5,6 inactive/ghost1/F0/contained0/container-1/mask0；新60[3,6]/S active/ghost0/F0/free，GMID54（未复用旧59/GMID53）。56仍7,3、57仍4,5，单axis/timeline61/time21、completed=false。出生进入旧Box格并未产生箱内幽灵，此结论仅限该C4出生推箱fixture。回执49及即时50/稳定51均保canonical；CJS `.actualBirthX21`分开列实际分配ID/GMID和模型物理字段，未倒推声称预先预测分配。34Undo/0retry，无新Goal/箱层/活cargo，无额外搜索或handle；5-4本域收尾，继续后关，不把阴性探针当通关。
