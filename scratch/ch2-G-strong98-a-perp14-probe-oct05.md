# 2-G actual98 A轴：14步有链滑箱正交接触探针

ACTUAL112现已闭环（没有force/新轴/cargo）：主489/frame19391263/time206→490/frame19391273/time207直接相邻帧，115[6,10]/A/md3/src106移[5,10]停止；原静止111[5,10]移[4,10]/A/md3/src106；108[6,9]/W/md1/src108进入115旧格[6,10]仍W滑。经理106早已8,10 ghost1死亡，来源仍保留。491/time208：108到6,11SPIKE死亡，111到3,10且下一2,10/118+1,10/114背Wall0,10整链不可动，真实同帧已md0/src-1。最终493/frame19411322稳定A轴time208仅105[14,10]/W活，111[3,10]/115[5,10]、九BOX全active/h1/uncontained；没有争推/合并/装箱/分线。原W轴time160整个14entity（含GMID）与459严格同，root MCP19411402独立核。累计112Undo0retry，118/6/link3不变。以下旧M132停止微拍保留为当时模型未知记录，不再把末W称未执行。

私有finite clone `ch2-G-m133-one-front-chain-model-oct05.cjs`仅补本类rear ICE滑箱推动一个stationary SPIKE front到empty ICE并腾格的模型，以及这个被转移front在下一ICE格遭两个stationary挡箱背Wall/gap时当帧清motion/src。private `_oneFrontCarry`是同input内模型标记，非游戏property，稳定态不保留；其它链长、moving front、co-target/多层仍停unknown，旋转是假设不是实证。`ch2-G-m133-one-front-chain-calibration-oct05.cjs`固定校准旧20帧+本例485..493九帧+strong98八帧，37/37全部公开properties键match，unknown/missing键会fail；static type/class/details/动画/runtime时间不属于引擎字段验证（这些由owner/root真实整字典audit另证）。最初仅修腾格曾在491的front运动清理上不匹配，现明确补此有限终止链时序，未把仅末态一致当全帧校准。

历史前13实际111：owner正常按精确prefix `SDSAWWDSSWWSD`完成全部accepted（只续receipt.remaining），主482/frame19376228、axis0 time201，全14entity fields/GMID与本固定pre13 diff=[]、所有motion0/animationtrue。105[14,9]/W、106[12,10]/W、108[6,4]/D活，107旧ghost1、109旧mask1；九BOX如下13行。另一axis1仍strong98/time160，整14entity与原459不变。当时累计112Undo0retry/118关6星不变，末W尚未执行；最新已实际结算见开头。

实际源：主`2-G.json` event459/frame19330256，axis[0,0,0]/id119、真实98输入/time160。106[10,10]/A与108[5,5]/W活，109[2,8]/W inactive/masked1/ghost0；right105[14,10]/W活，107旧ghost1。九箱active/h1/uncontained。source p/b逐ID所有模型字段与raw38的106/A叶完全相同；GMID实例分配与模型无关。

完整叶内串由程序固定为`SDSAWWDSSWWSDW`（14），先13输入`SDSAWWDSSWWSD`，再单W；prefix13全valid、单叶、force0、无未知边界，且真实111核对；第14单W已实际112。原固定脚本仍只保M132的停止记录，无search/游戏调用，新的物理传播与37帧校准在独立finite clone中。

| 叶内步/总有效输入 | 精确前缀 | 所有PLAYER稳定态 | BOX110..118坐标（ID） |
|---|---|---|---|
| 1/99 | `S` | 105:14,9/S; 106:10,9/S; 107:8,4/W inactive(g1,m0); 108:5,2/S; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 2/100 | `SD` | 105:14,10/W; 106:11,9/D; 107:8,4/W inactive(g1,m0); 108:5,9/W; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 3/101 | `SDS` | 105:14,9/S; 106:11,8/S; 107:8,4/W inactive(g1,m0); 108:5,2/S; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 4/102 | `SDSA` | 105:14,8/S; 106:10,8/A; 107:8,4/W inactive(g1,m0); 108:4,2/A; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 5/103 | `SDSAW` | 105:14,9/W; 106:10,9/W; 107:8,4/W inactive(g1,m0); 108:4,1/S; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 6/104 | `SDSAWW` | 105:14,10/W; 106:10,10/W; 107:8,4/W inactive(g1,m0); 108:4,2/W; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 7/105 | `SDSAWWD` | 105:14,9/S; 106:12,10/D; 107:8,4/W inactive(g1,m0); 108:5,2/D; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 8/106 | `SDSAWWDS` | 105:14,8/S; 106:12,9/S; 107:8,4/W inactive(g1,m0); 108:5,1/S; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 9/107 | `SDSAWWDSS` | 105:14,7/S; 106:12,8/S; 107:8,4/W inactive(g1,m0); 108:5,2/W; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 10/108 | `SDSAWWDSSW` | 105:14,8/W; 106:12,9/W; 107:8,4/W inactive(g1,m0); 108:5,9/W; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 11/109 | `SDSAWWDSSWW` | 105:14,9/W; 106:12,10/W; 107:8,4/W inactive(g1,m0); 108:3,9/A; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 12/110 | `SDSAWWDSSWWS` | 105:14,8/S; 106:12,9/S; 107:8,4/W inactive(g1,m0); 108:3,4/S; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |
| 13/111 | `SDSAWWDSSWWSD` | 105:14,9/W; 106:12,10/W; 107:8,4/W inactive(g1,m0); 108:6,4/D; 109:2,8/W inactive(g0,m1) | 110:5,11; 111:5,10; 112:8,7; 113:2,9; 114:1,10; 115:8,10; 116:8,5; 117:8,9; 118:2,10 |

末单W已接受的MODEL微拍0..4与tick5停止前完整字段：

| 微拍 | 所有PLAYER | 所有BOX | 本拍requests |
|---|---|---|---|
| tick0后 | 105:14,10/W; 106:11,10/A; 107:8,4/W inactive(g1,m0); 108:6,5/W; 109:2,8/W inactive(g0,m1) | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,9/stop/src-1; 114:1,10/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:2,10/stop/src-1 | 无 |
| tick1后 | 105:14,10/W; 106:10,10/A; 107:8,4/W inactive(g1,m0); 108:6,6/W; 109:2,8/W inactive(g0,m1) | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,9/stop/src-1; 114:1,10/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:2,10/stop/src-1 | 无 |
| tick2后 | 105:14,10/W; 106:9,10/A; 107:8,4/W inactive(g1,m0); 108:6,7/W; 109:2,8/W inactive(g0,m1) | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,9/stop/src-1; 114:1,10/stop/src-1; 115:8,10/stop/src-1; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:2,10/stop/src-1 | 无 |
| tick3后 | 105:14,10/W; 106:8,10/A inactive(g1,m0); 107:8,4/W inactive(g1,m0); 108:6,8/W; 109:2,8/W inactive(g0,m1) | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,9/stop/src-1; 114:1,10/stop/src-1; 115:7,10/A/src106; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:2,10/stop/src-1 | BOX115/A/src106/player |
| tick4后 | 105:14,10/W; 106:8,10/A inactive(g1,m0); 107:8,4/W inactive(g1,m0); 108:6,9/W; 109:2,8/W inactive(g0,m1) | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,9/stop/src-1; 114:1,10/stop/src-1; 115:6,10/A/src106; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:2,10/stop/src-1 | BOX115/A/src106/inertia |
| tick5前（unknown，不传播） | 105:14,10/W; 106:8,10/A inactive(g1,m0); 107:8,4/W inactive(g1,m0); 108:6,9/W; 109:2,8/W inactive(g0,m1) | 110:5,11/stop/src-1; 111:5,10/stop/src-1; 112:8,7/stop/src-1; 113:2,9/stop/src-1; 114:1,10/stop/src-1; 115:6,10/A/src106; 116:8,5/stop/src-1; 117:8,9/stop/src-1; 118:2,10/stop/src-1 | 新W接触尚未结算 |

唯一关键窗口：108[6,9]/W/movingdir1/src108朝北进入115旧格[6,10]；115[6,10]/A/movingdir3/src106已向西滑。经理106已[8,10]SPIKE ghost1死亡，但BOX115仍保留src106；不能将来源改匿名。旧A方向的下一5,10有BOX111，后方4,10是合法empty ICE，故旧A的双BOX链几何能移动；新W方向6,11为合法empty SPIKE。这里同一目标115有两条几何合法方向，但尚未证明实际是让旧A链腾格、取消滑行、给108新W推力或形成分线。

| 关键格 | terrain | Wall覆盖 | 当拍BOX | active PLAYER |
|---|---|---|---|
| 6,9 | ICE | false | - | 108 |
| 6,10 | ICE | false | 115 | - |
| 5,10 | SPIKE | false | 111 | - |
| 4,10 | ICE | false | - | - |
| 6,11 | SPIKE | false | - | - |

旧链的条件request清单仅是几何分析：若惯性A继续，应向115、111请求A/src106（最终111到4,10）；若108能重新北推115，应向115请求W/src108（目的6,11）。并未在私有模型里新增这些request或传播force。BOX111在5,10自身目前stop/src-1，后续是否继承106由实际帧判别。BOX118仍2,10/stop，旧1141,10/stop；没有偷换它们为本链来源。

M133已证的目的格empty、独立单箱腾格不覆盖本例，因为5,10已被111占据。M131证明惯性来源保留，但未授予“任何滑箱正交接触均分线”。最后W必须正常实机采样，尤其115与111各帧pos/movingdir/movingsrc/movingsrcext；108/106的active/ghost/maskedoff；109旧mask保持；所有container/contained/height/split/key；time/axis数与选择后的未完滑行、9BOX是否仍active；right105应逐叶核活并记录位置face。不要预写winner、axis、箱cargo或稳定人数。

前13模型稳定14entity按原具体ID保留，实际字段需owner逐批独立核；建议批4/4/4/1再唯一W由root授权，ICE receipt未执行后缀只按真实remaining续。MODEL微拍数不是runtime时间。当前仅输出后续候选，不游戏调用、不新每步JSON、不改存档或canonical。
