# 2-G actual60后普通人正交接触movingBOX：固定11步探针（只读，2026-10-05）

当前已实际闭环：owner正常部署60+10到70/event146/time105，再单W到71/event150/time113。稳定仍单叶：只有105与109活，九箱全活、无mask/cargo/force，未完成。旧“正交接触movingBOX”模型边界实为旧A将被立即Wall挡住却未及时清除运动标志；本例不能证明真正仍能继续滑的正交碰撞规则。

源已实际：主2-G.json event131/frame17788995，actual60/time81，单叶五活F0/ghost0、九空Color2单层箱。私有固定脚本`ch2-G-m132-perpendicular-probe-oct05.cjs`直接读取该帧，另固定旧event74 actual50+`WDSAWWDWAA`，两源逐ID/坐标/face/active/ghost/mask/md/src完全相同。该脚本保历史未修正模型结果，新增实际窄修正由`ch2-G-m132-actual71-calibration-oct05.cjs`核验。

## 前十步检查点

所有坐标均为稳定终态，W/A/S/D为朝向；105为隔离右观察者。表中BOX只列本步改变，未列者沿用上一态。初始九箱：1108,9、1118,5、1126,7、1133,9、1142,9、11511,8、1168,7、1177,7、1185,7；初始10610,7/A，1077,1/S，1084,1/S，1091,1/S，10514,8/S。

| 总输入 | 新尾前缀 | 106 | 108 | 109 | 105 | 本步变化 |
| --- | --- | --- | --- | --- | --- | --- |
| 61 | D | 11,7/D | 5,1/D | 2,1/D | 14,9/W | 107→8,1/D |
| 62 | DD | 12,7/D | 5,2/W | 2,2/W | 14,10/W | 107→8,2/W |
| 63 | DDW | 12,8/W | 5,7/W | 2,9/W | 14,9/S | 107死8,4/W；114→2,10，118→5,10 |
| 64 | DDWA | 11,8/A | 5,2/S | 2,2/S | 14,8/S | 115→10,8 |
| 65 | DDWAS | 11,7/S | 5,1/S | 2,1/S | 14,7/S | 无箱变化 |
| 66 | DDWASA | 10,7/A | 4,1/A | 1,1/A | 14,6/S | 无箱变化 |
| 67 | DDWASAW | 10,8/W | 4,2/W | 1,2/W | 14,7/W | 115→10,9 |
| 68 | DDWASAWA | 8,8/A | 4,1/S | 1,1/S | 14,6/S | 无箱变化 |
| 69 | DDWASAWAD | 10,8/D | 5,1/D | 2,1/D | 14,7/W | 无箱变化 |
| 70 | DDWASAWADW | 10,9/W | 5,2/W | 2,2/W | 14,8/W | 115→10,10 |

前10步全部valid、单叶、没有force/capture/stack/cross边界，现已由owner正常4/3/3批次及event146/time105全字段实测匹配。pre70九箱为1108,9、1118,5、1126,7、1133,9、1142,10、11510,10、1168,7、1177,7、1185,10；所有稳定md0/src-1。107inactive/ghost1/masked0，其余四人活ghost0/masked0。这里模型微拍求和不能当游戏time，真实time以journal为准。

## 唯一末W的未校准微拍

末W（总71）的旧模型tick6之前，以下是历史模型边界（其中113的md/src正是被实际否定的字段）：

| 实体 | 位置/朝向 | 活性 | movingdir / movingsrc |
| --- | --- | --- | --- |
| P105 | 14,9/W | 活、ghost0 | 0 / -1 |
| P106 | 8,9/A | inactive、ghost1、masked0 | 0 / -1 |
| P107 | 8,4/W | inactive、ghost1、masked0 | 0 / -1 |
| P108 | 5,8/W | 活、ghost0 | W(真实1) / 108 |
| P109 | 2,8/W | 活、ghost0 | W(真实1) / 109 |
| BOX113 | 2,9 | 活 | A(真实3) / 106 |
| BOX110 | 3,9 | 活 | 0 / -1 |
| BOX114 | 2,10 | 活 | 0 / -1 |
| BOX115 | 10,10 | 活 | 0 / -1 |
| BOX118 | 5,10 | 活 | 0 / -1 |

BOX1118,5、1126,7、1168,7、1177,7也均停。P109下一W进入2,9，接触BOX113仍标A/src106的旧惯性；106已刺死但来源保留是M131/M035已证部分。**BOX113旧A下一1,9为真Wall，旧方向不能继续**，因此本探针只校准“普通free正交接触本来会被墙阻的movingBOX”，不是两方向都合法的通用冲突。P108还在5,8向北运动，BOX118在5,10，不能在未实测71前擅自授其死亡/分线/继承。

旧模型返回`perpendicular-free-box`，tick6，box113，player109，playerDirectionW，boxDirectionA，boxSource106，forces[]。正常输入与分帧核验只由owner操作；助手无游戏输入。

## 实际71与窄修正闭环

- event147为单W receipt，accepted1/remaining0；event148/time108：106已死8,9/A，BOX1106,9/A/src106，1085,5与1092,5均向W滑。
- event149/time111：BOX1103,9已停；BOX1132,9已movingdir0/src-1（旧A下一1,9真Wall）；1085,8/W、1092,8/W仍movingdir1/src自身。
- event150/frame17884981/time113稳定：10514,9/W与1092,9/W活ghost0；1068,9/A、1078,4/W、1085,10/W均inactive/ghost1，所有masked0。九箱1103,9、1118,5、1126,7、1132,10、1142,11、11510,10、1168,7、1177,7、1185,11全活h1/uncontained/md0/src-1，单axis/未完成。

私有克隆`ch2-G-m132-blocked-source-model-oct05.cjs`仅在BOX进入ICE且旧方向下一格立即真Wall/无Floor时清除md/src；不把更一般箱链阻塞或可运动正交接触当已校准。固定`ch2-G-m132-actual71-calibration-oct05.cjs`对event148/modeltick2、event149/modeltick5、event150/stable比较全部PLAYER/BOX具体ID、pos、face、active、ghost、mask、md、src，3/3 diffs=[]；原M131八项公开帧校准仍8/8 diffs=[]。这是固定复算，无新BFS。

只此特殊域得到受限真实闭环，不授叶数或完整Goal，不一般化free-perpendicular。真正oldDirectionCanChainMove仍保持unknown边界；须另找更早微步已证、至少两functional left的可实测前缀。

## 搜索进程保留

原TTY60372已到400k：expanded400000/seen551466/pending193900/maxDepth32/depthCut0/deferred0，firstforce90/max2leaf，hitnull；同frontier和唯一V8checkpoint保留，等待此实际机制结果。这里固定10+W没有启动新图，没有弃队列或提升预算。

## 新真正可动正交窗口（actual80接触微拍已证，历史前置保留）

root批准最窄规则后，原60372保存并exit0；新TTY62184从同400k checkpoint迁移，固定补查71条旧Wall/gap拒绝边，补1新节点，没有重新建根。真实500k/seen692337/pending234771，未穷尽；新分类`oldDirectionCanChainMove/playerDirectionCanChainMove`记录9次，最短模型20尾为`WWDDSASSWDAAWDWADWAW`。父源实际event173/time81与event131完全一致。私有`ch2-G-m132-moving-perpendicular-probe-oct05.cjs`固定前19+单W；没有开新图或从统计推完成。

前19`WWDDSASSWDAAWDWADWA`全部valid、单叶、没有更早boundary。关键稳定检查点如下（BOX只列变化/重要位置，脚本含每点所有实体）：

| 新尾步 | 前缀 | 活106 | 活108 | 109 | right105 | BOX重点 |
| --- | --- | --- | --- | --- | --- | --- |
| 4 | WWDD | 12,9/D | 5,2/W | 2,2/W活 | 14,10/W | 九箱仍actual60原位；1078,2/W活 |
| 8 | WWDDSASS | 11,6/S | 5,2/W | 2,2/W活 | 14,6/S | 11510,8，其余原位；1078,2/W活 |
| 12 | WWDDSASSWDAA | 10,7/A | 5,2/S | 2,2/S活 | 14,6/S | 11010,9/1125,7/1138,9/1142,10/1185,10；107死8,4/W |
| 16 | WWDDSASSWDAAWDWA | 10,9/A | 5,2/S | 死2,10/W | 14,8/S | 11010,10/1125,10/1132,9/1142,11/1158,9/11610,7/1185,11 |
| 19 | WWDDSASSWDAAWDWADWA | 10,10/A | 3,4/S | 死2,10/W | 14,9/S | 1108,10；其它同16，1118,5/1178,7不动 |

末输入前共有两functional left（106、108）和right105；107/109已ghost死，所有mask0/F0。九箱pre79完整：1108,10、1118,5、1125,10、1132,9、1142,11、1158,9、11610,7、1178,7、1185,11，全稳定。

末单W模型tick5的第一未知接触：BOX1123,10/A/mdA/src106；P1083,9/W/mdW/src108向北进入其格。BOX112旧A下一2,10是SPIKE、有Floor、无Wall/BOX，但有早已inactive/ghost1的P109；新W下一3,11也是SPIKE、有Floor、无Wall/BOX。两个方向在普通箱几何上可动，角色进入3,10 ICE本身安全；不能把旧A目的格有死人忽略为已证完全空格，迟到箱与旧corpse的contained/height/active变化须随真实完整帧一并核验。这里没有证明老死人可装或不可装，模型np.active过滤不是物理证据。这与71的旧A→Wall特殊情形不同。

同微拍其他来源状态：P106已死8,10/A/ghost1/mask0/md0/src-1，旧BOX来源106仍保；P107死8,4/W，P109死2,10/W；P10514,10/W活并已停。BOX1105,10停、1132,9停、1142,11停、1158,9停、1185,11停；1118,5、11610,7、1178,7不动。只有108仍滑，脚本返回unknown而不解释为force/取消/捕获；不能从此直接计算真实叶数或后续资源，也不称全关解。

owner已按root授权实际完成新60+19到79/event205/time144，全ID/face/状态匹配上述pre；receipt206单Waccepted1/remaining0。event207/time147仍busy：BOX1106,10/A/src106，BOX1125,10停，P1083,7/W/md1活；event208/time151稳定只10514,10/W活，1083,11/W刺死、1068,10/A死、1092,10/W仍尸体。九箱1105,10、1118,5、1122,10、1132,9、1142,11、1158,9、11610,7、1178,7、1185,11全活单层/uncontained/md0/src-1；BOX112与尸体109同格但109仍inactive/ghost1/contained0/container-1/h1，无复活/新cargo/新BOX/force/mask/branch，关未完成。

没有截到3,10相遇的中间微拍，端点支持BOX旧A自走、freeW继续北，但不能仅凭端点fit证明其具体时序。私有`ch2-G-m133-actual80-calibration-oct05.cjs`生成hard-gated exact108/112/W/A/3,10/corpse109的条件vacate解释；207/208端点2项、71三项、原M131八项共13/13 match，包括完整PLAYER/BOX ID/md/src、contained/container/height/mask。但这些测试不能把未观察接触瞬间补成证据，脚本不是一般M133传播规则。

以上“仅端点、待复测”是首次208后的历史判据。随后owner按root授权正常undo1返回79核全properties与205同，再单W快速连续读95次公开state，签名去重保存7full212..218，一次复测已完成；没有助手游戏输入。

新增直接证据：216/time149，P108[3,9]W/movingdir1/src108活，BOX112[3,10]A/movingdir3/src106；217/time150，P108进入旧BOX格[3,10]仍W/md1/src108活，BOX112到[2,10]停md0/src-1。无force/branch/capture，旧109同[2,10]仍inactive/ghost1/contained0/container-1/h1。218/time151所有PLAYER+BOX公开fields与原208终态一致。只此几何实证，不将其他速度/方向、同目标碰撞、BOX旧md将被阻的情况自动推广。

私有`ch2-G-m133-source-model-oct05.cjs`据root批准的有限模型假设传播：free当前ICE滑、目标旧BOX格ICE、md垂直、BOX旧方向下一直接格合法且无BOX/active PLAYER、独立惯性、无其他source request/cancel/新chain force时同时腾格；不生成新PLAYER方向推箱请求、不停止free。BOX目的格ICE/方向旋转尚无第二实际fixture，仍只是本搜索域受限假设。blockedChain、目标占活人、多source、多target、stack保持unknown。

`ch2-G-m133-actual80-calibration-oct05.cjs`现在固定2个原端点+7个复测帧+3个M132+8个M131，共20/20 diffs=[]。补强断言每个PLAYER/active BOX的所有公开properties键：位置/active以及face/maskedoff/contained/container/height/movingdir/movingsrc/movingsrcext，PLAYER另key/split/ghost；movingsrcext0、PLAYER key0/split0、BOX face0显式核验，未知或缺键会报错，不忽略额外键。静态type/class/details、动画字段、runtime time没有模型，不称整个entity字典20帧全字段校准。此固定脚本不重写规则文件、不搜索。

同500k前沿已迁移：15条旧真正可动perp重评，1符合M133但最后只right活，14保持unknown，added0。66479沿同前沿至700k后仅排序调整，69831加载相同700k checkpoint继续900k窗口；真实现场owner已正常undo20恢复60、公开event259与131/173整个实体字典一致，总66Undo/0retry。报告当前不再称80待实际或现场停80。
