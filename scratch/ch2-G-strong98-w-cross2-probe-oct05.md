# 2-G strong98 W轴：两个W的角色交汇探针

## ACTUAL101闭环与有限模型

唯一输入owner已正常选择原W轴并执行准确`WW`。主事件537/time173中108在ICE[2,9] faceA/md0/src-1活，109在[2,8] faceW/md1/src109活；紧邻538/time174中109进入同格后inactive、ghost0/maskedoff0/contained0/container-1/height1/Fork0，md0/src-1；108仍活、faceA/stop。没有force、capture、Box推动或新轴。540稳态仅right105[14,10]/W与108[2,9]/A活，九箱与原W叶源位置不变；A叶仍原459/time160整个实体字典保全（owner/root核）。当前实际结论替代下文历史待判别措辞，不把这个融合扩大到M045同face、一动一停的其他几何或两个moving交汇。

534/time170另有精确时序：108首次到ICE[2,9]时已md0/src-1，原M132诊断tick2还A/md3/src108；旧模型的六微拍不能声称全部吻合。新私有finite clone仅修A向ICE到达且西邻真Wall立即clear，再修有序停A/滑W同格令后者inactive。`ch2-G-wallstopped-a-moving-w-calibration-oct05.cjs`旧37+新11=48公开帧/叶记录的全部PLAYER/activeBOX properties键均match；static/details/animation/runtime时间不是离线引擎字段。其他方向、反向顺序、高度、Box-stopped和旋转仍未授通用规则。

`_oneFrontCarry`只在新input的!resume重置清理，same-input/resume保留。`ch2-G-onefront-transient-input-check-oct05.cjs`用实际112的模型microtick5中间态验证：resumeMarker[111]、freshMarker[]，续拍marked111到3,10立即stop，unmarked控制到同格仍A滑；新input与无marker控制相同，allMatch=true。该诊断没有提议或执行游戏动作。

2026-10-05同小派生checkpoint四个W边`WW/WSWW/WSSSWW/WSSSSSWW`全部具体祖先固定核通过，有限新规则均得到left1/right活、noForce；lost90→94，新节点0。旧未知窗口作为历史保留，原巨source60前沿不因此删除所有两free状态。以下源表/acceptedTrace及待测文本为原保守M132的历史诊断。

来源actual主459/frame19330256，axis[1,0,0]/id119/time160：活105[14,10]/W、108[5,5]/W、109[2,9]/W；106[10,10]/A inactive/masked1/ghost0，107旧8,4ghost死。九空Blue h1/noCargo/noStack，与raw38选择109叶物理相同。需要正常选中此签名的叶，不按timeline数组顺序代替T选择；具体Undo/T授权由root给sole owner。脚本require只固定两动作，无write/search/gamecalls。

准确raw串`WW`，先W稳定核后再唯一单W。早期口述WWW撤回，不存在额外第三W。第一次W全valid/noForce/noUnknown，稳定所有实体：

105:14,9/S/stop/src-1
106:10,10/A/stop/src-1 inactive(g0,m1)
107:8,4/W/stop/src-1 inactive(g1,m0)
108:5,9/W/stop/src-1
109:2,2/S/stop/src-1
110:5,11/stop/src-1
111:5,10/stop/src-1
112:8,7/stop/src-1
113:2,10/stop/src-1
114:2,11/stop/src-1
115:8,10/stop/src-1
116:8,5/stop/src-1
117:8,9/stop/src-1
118:3,10/stop/src-1

第二W接受的MODEL微拍0..5与tick6交汇停止前：

| MODEL微拍 | 所有PLAYER | 所有BOX | requested |
|---|---|---|---|
| tick0后 | 105:14,10/W/stop/src-1; 106:10,10/A/stop/src-1 inactive(g0,m1); 107:8,4/W/stop/src-1 inactive(g1,m0); 108:4,9/A/A/src108; 109:2,3/W/W/src109 | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,10/stop/src-1; 114:2,11/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:3,10/stop/src-1 | 无 |
| tick1后 | 105:14,10/W/stop/src-1; 106:10,10/A/stop/src-1 inactive(g0,m1); 107:8,4/W/stop/src-1 inactive(g1,m0); 108:3,9/A/A/src108; 109:2,4/W/W/src109 | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,10/stop/src-1; 114:2,11/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:3,10/stop/src-1 | 无 |
| tick2后 | 105:14,10/W/stop/src-1; 106:10,10/A/stop/src-1 inactive(g0,m1); 107:8,4/W/stop/src-1 inactive(g1,m0); 108:2,9/A/A/src108; 109:2,5/W/W/src109 | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,10/stop/src-1; 114:2,11/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:3,10/stop/src-1 | 无 |
| tick3后 | 105:14,10/W/stop/src-1; 106:10,10/A/stop/src-1 inactive(g0,m1); 107:8,4/W/stop/src-1 inactive(g1,m0); 108:2,9/A/stop/src-1; 109:2,6/W/W/src109 | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,10/stop/src-1; 114:2,11/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:3,10/stop/src-1 | 无 |
| tick4后 | 105:14,10/W/stop/src-1; 106:10,10/A/stop/src-1 inactive(g0,m1); 107:8,4/W/stop/src-1 inactive(g1,m0); 108:2,9/A/stop/src-1; 109:2,7/W/W/src109 | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,10/stop/src-1; 114:2,11/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:3,10/stop/src-1 | 无 |
| tick5后 | 105:14,10/W/stop/src-1; 106:10,10/A/stop/src-1 inactive(g0,m1); 107:8,4/W/stop/src-1 inactive(g1,m0); 108:2,9/A/stop/src-1; 109:2,8/W/W/src109 | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,10/stop/src-1; 114:2,11/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:3,10/stop/src-1 | 无 |
| tick6前unknown | 105:14,10/W/stop/src-1; 106:10,10/A/stop/src-1 inactive(g0,m1); 107:8,4/W/stop/src-1 inactive(g1,m0); 108:2,9/A/stop/src-1; 109:2,8/W/W/src109 | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,10/stop/src-1; 114:2,11/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:3,10/stop/src-1 | 最终PLAYER同格的结算未传播 |

关键：第二W中108[5,9]北面被5,10/5,11双箱+5,12Wall整链阻挡，fallbackA沿row9滑至2,9，被1,9Wall停止（faceA/md0src-1）。109从2,2向W滑至2,8，并在下一拍进入同一个ICE2,9，faceW/md1/src109。两个活人同格但恰一moving、一stopped、face相差90度；不是M045同face一动一停，也不是4-18两moving正交样本。Box1132,10/1142,11仍在北方，人物接触结算后再推该链/踩刺的时序未知，不能预写稳定人数或通关。

需要实测PLAYER108/109的active/face/movingdir/movingsrc/movingsrcext/ghost/maskedoff/contained/container/height/split/key，同2,9接触前后是否仍两活、是否合并/停止/继续；BOX113/114的来源和位置是否改变，right105是否保持活，axis数与time/未完滑行。新source另一A轴可能仅是历史投影，须与真实选择时刻区分；不得把不同时间静态Goal union直接当completed。

本探针只取两正常输入，未知规则未改，第二W未调用任何游戏工具；实际来源选中与动作由sole owner/root授权执行。
