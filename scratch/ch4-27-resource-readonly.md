# 4-27 blossom：CLOSED actual281，八叶实际覆盖八Goal

2026-10-04，SaveSlot1。助手 `/root/ch3_37_cargo_revisit_oct03`；输入owner `/root/resume_slot1_oct03`。依据 `artifacts/slot1-playthrough/4-27.json` initial及公开KB，只核静态/固定输入。未运行BFS、未游戏输入、未使用提示/攻略/隐藏实现、未写存档、主JSON或canonical KB。main负责全解；以下不是整关已完成证据。

**CLOSED actual281：owner已实际执行八叶尾并通关。** 89步正常部署＋X90形成八叶；每个numeric T0..7分别执行共同18尾 `SDDDDSSDDDWWDDWWWW`，接1/2/3/4/6/7/8/9个A，实际P75分别停Goal9/8/7/6/4/3/2/1,7，times109/110/111/112/114/115/116/117。最后最大time117的T7叶完成，level.completed=true。直接读取主JSON `events[54].observation`、`completion`和`run`一致：281有效输入、历史6undo/0retry，八叶每叶3活cargo＋P75均ghost0；八Goal全覆盖。root另核Slot1 blossom3/count116/record281及116audit issues[]、自动回World[-68,5]F1，来源区别见文末。

前面八Goal尾、fresh混色叠加、22＋X单force、row1双force及root原三force静态族保留历史范围。原构造本身曾缺ordinary前置，实际89镜像族与281完成现已补齐该结构的正常可达/完整解证据；未重新BFS或扩大cap。早期条件并非所有都实际执行，不把成功路线反向信用其它构造。

## 初态与Wall优先

initial level.id=blossom、size11,8、time0/completed=false。实际角色：P75在10,4/F0/uncontained；C2 BOX67/cargo76在2,2，C3 BOX68/cargo77在3,2，C1 BOX69/cargo78在4,2，三cargo均F1/faceS/ghost0/height1。五独立空C4：70在2,4、71在4,3、72在2,3、73在4,4、74在3,4。八Goal：row7的x1/2/3/4/6/7/8/9。无Fork、ICE、DARK、Key、Lock或Gate。

Wall实体是 `type=SOLID/class=Wall/blockable=true`，不是type=WALL。共有59真Wall。row6的x0..9全Wall，仅10,6开放；row8的x0..11全Wall；row7仅0,7与11,7是Wall，1..10皆有效floor（Goal也floor=true）。所有SPIKE tile均被真Wall覆盖，按已证Wall优先后本图没有裸SPIKE。不能把row8的SPIKE标签当有效出生格或死亡前置。

右廊10,3..7安全。左区到右廊可走row1经6,1→7,1→8,1→8,2→8,3→9,3→10,3；不能直穿7,2..6、8,4..6或9,4..6。

## P75被各叶继承后的八Goal固定尾

若某叶仍有P75在10,4且通路没有新箱阻挡，`WWW`依次到10,5/6/7；随后A沿row7向西，全部安全，无floor缺口。固定单人复算八条均valid：

| Goal | 从10,4的输入 | 输入数 |
|---|---|---|
| 9,7 | `WWWA` | 4 |
| 8,7 | `WWWAA` | 5 |
| 7,7 | `WWWAAA` | 6 |
| 6,7 | `WWWAAAA` | 7 |
| 4,7 | `WWWAAAAAA` | 9 |
| 3,7 | `WWWAAAAAAA` | 10 |
| 2,7 | `WWWAAAAAAAA` | 11 |
| 1,7 | `WWWAAAAAAAAA` | 12 |

row7空走廊里A/W/D均不导致死亡：北row8全Wall，A在最左1,7被0,7与1,6挡后转D到2,7；D在10,7被11,7与10,8挡后转A到9,7。W在其它row7格先撞北墙，再尝试A，最左仍转D。不要因此无条件推广有箱挡路后的fallback或任意世界线状态。

M042已有冲突叶继承未参与者、M076/M084/M109已有物体观察叶继承外人的实证，所以合法分叶后让P75在各叶分别停不同Goal是可信方向。只有实际确立的叶才能计覆盖；单叶逐个走过Goal不等于将历史位置全部累计。若完全只依靠一个P75覆盖八个不同坐标，就需要八条能保此人的叶；有cargo已站Goal时所需叶数可减少，八叶不是本关必要性证明。

## fresh首X：水平相遇与竖向无冲突族

私有出生审计沿已证分裂候选顺序与M102源箱腾空模型。最初本关三个独立载箱同时腾空及两个预载容器相遇仅属预测；随后fresh actual1已实证，见表后。除直接X行外，其它短朝向族仍是固定模型/静态候选。

| 初态前普通输入 | X时朝向/外人 | 六个出生格与空箱影响 | force/stack边界 |
|---|---|---|---|
| 无，直接X（actual1） | cargo面S；P75=10,4 | 67→3,2与1,2；68→4,2与2,2；69→5,2与3,2 | 两独立67/69孩子同3,2，真实两层stack且cargo合一；不是force两叶 |
| W，再X | cargo面W；P75=10,5 | 与上行相同，左右尝试顺序相反 | 同一混色载人重叠边界 |
| A，再X | cargo面A；P75因9,4Wall转S至10,3 | 每源x2/3/4生x,1与x,3；两列C4链分别被北推至row4/5，中间cargo3,3不推原74在3,4 | 六个出生格互异；无共同box异向force |
| D，再X | cargo面D；P75因11,4Wall转W至10,5 | 与A族相同，南北尝试顺序相反 | 同上 |

六个children都F0；没有地图Fork可补。我直接读本关主JSON `events[1].observation` 核actual1：BOX67在3,2 height1/contained0，BOX86在同格height2/contained1/container67；P76活、height2/contained1/container67/F0/ghost0。root另独立核P87同格inactive/contained1/container67/height2/ghost0/maskedoff0，故两个预载来源形成两层独立stack，但同格两内人只剩一活动cargo。其它四cargo及P75活动；仅一时间线、completed=false。`events[3]`正常undo恢复fresh0。

root随后独立MCP核 `XWWWA`/time5：P75到Goal9,7，但远处3,2叠体没有被观测，仍singleaxis/completed=false。因此“外人站任意Goal就把全地图stack都坍缩”的假设已被这个精确实例排除；不能拿fresh叠加本身记多叶。此结论不排除真的将叠体送入目标光路或另一个有效光路。

M084/M109可支持实际共享一个cargo的叠体观察继承，但本关尚未实际观察这个叠体，不假定真实颜色叶数/角色NID。现模型只报overlap，不传播其叠体/观察。

main另提出三stack的**未部署条件源**：F1/W cargos在2,2/3,3/4,2，empty在1,2以及5,2/6,2，另外两empty须避开2,3/4,3及其推链。固定inspect验证west1,2背0,2Wall、east5,2/6,2背7,2Wall，外两父的阻侧分别改front2,3/4,3；中父左右生2,3/4,3。所以三处独立来源重叠为3,2、2,3、4,3。理论2³叶依赖三叠体全部合法观测、各层分支均成立且P75继承；remote Goal实测不会替代此观察前置。未做此源部署搜索。

## 手工部署22＋单X的明确相反推力源

从fresh0输入22 ordinary：

`SAASSAAAWWAASWDDWWAASS`

按真实Wall与普通Box chain固定复算valid=true，三F1始终保留、P75始终活。不是新BFS或constructed coordinates冒充合法前缀。

| 累计输入 | 核心动作/状态 |
|---|---|
| 10 `SAASSAAAWW` | P75从右廊经底通道到5,3；所有Box原位 |
| 11 A | 空71从4,3到3,3，P75=4,3 |
| 12 A | 71/72双链到2,3/1,3，P75=3,3 |
| 13 S | 将Blue68/cargo77从3,2推3,1，P75=3,2；其它两cargo仍2,2/4,2 |
| 14..20 `WDDWWAA` | P75绕3,3→4,3→5,3→5,4→5,5→4,5→3,5，不触cargo或其它Box |
| 21/22 SS | 从上方把74由3,4推3,3再3,2，P75=3,3 |

22源：C2 cargo2,2/F1/S，Blue cargo3,1/F1/S，C1 cargo4,2/F1/S；empty74=3,2，70=2,4/71=2,3/72=1,3/73=4,4；P75=3,3/F0/S。下一23 X的条件birth：

- C2右生3,2需把74向D推4,2；另支1,2无推力。
- C1左生3,2需把同74向A推2,2；另支5,2无推力。
- Blue从3,1左右生4,1/2,1，无推力，是旁观cargo。

这是同一个空74受到D/A相反推力的精确谓词，可参考M120 cargo-X相反推力及M042旁观继承，预测两叶而不是把两个孩子硬并为stack。强制D胜时74→4,2、D赢家cargo→3,2；A胜时74→2,2、A赢家cargo→3,2。另四cargo及P75都未参与该冲突，按条件继承。所有cargo此后F0。败者的NID/masked/container细节必须看本关actual，脚本只保来源标签，不假称真实新NID。

在上述各条件叶，固定普通15尾 `DDDSSDDWWDDWWWW` 均valid：P75从3,3经6,3/6,1/8,1/8,3/10,3到10,7；其它箱未动，最后可接A分别停不同Goal。这个源只给两叶、没有上区cargo/新Fork，**不是八Goal完整候选**，未请求owner执行。

## row1三cargo＋两空箱：条件双force的四组合

owner/root提出未部署源：F1/W cargos分别4,1/6,1/8,1，empty5,1/7,1，另三empty不挡出生或推链；P75仍10,4/F0。固定inspect预测左父生3,1与5,1，中父生5,1与7,1，右父生7,1；右side9,1是真Wall，所以另一孩子fallback前8,2/F0。

5,1空箱受D/A，7,1空箱受D/A。条件组合如下，全部保8,2 cargo与P75，赢家在5,1/7,1，旁观cargo在3,1；各cargo F0：

| 5,1空箱胜向 | 7,1空箱胜向 | 两空箱结果 | 新边界 |
|---|---|---|---|
| D | D | 6,1与8,1 | 无附加同格 |
| D | A | 两者都6,1 | 两独立empty首次同格，必须另核stack，不能作为普通flat叶 |
| A | D | 4,1与8,1 | 无附加同格；中父两个孩子都胜 |
| A | A | 4,1与6,1 | 无附加同格 |

这四组合不是实际已得到的四叶。8,2那位是contained cargo，不是第二外人；在只用普通推箱的当前F0条件域，不能将它送到Goal：左右7,2/9,2墙，北推到8,3后东移须站7,3Wall，西/北方向也是真Wall；南推到8,1后左右出口9,1Wall且左推者也9,1Wall，北推者8,0Wall。buffer链不能合法把pusher放到这些Wall上。未证释放cargo/新观测/高度机制不在该推论范围内，不作全关无解断言。P75可覆盖一个Goal，但此源没有已闭合的每叶twoGoal普通尾。

## root新三force几何：八种无附加碰撞条件组合

本段最初**仅为constructed source**：F1 cargo分别2,2、3,3、2,4，全faceD；五empty分别2,1、2,3、2,5、3,2、3,4，P75=10,4/F0。脚本以67/68/69标三个来源，仅标签，不假定实际搬运后的NID。该具体原坐标源没有在本文部署；随后main正常部署并实际执行的是下段的x4/A镜像族，颜色标签/外人位置也不同。

下父2,2的south2,1空箱背2,0Wall，故south失败并fallback frontD；上父2,4的north2,5空箱背2,6Wall，故north失败并fallback frontD。中父3,3两侧north/south都可行。源箱腾空按M102模型处理，出生/推力为：

| parent | 孩子1 | 孩子2 |
|---|---|---|
| 低2,2/F1/D | W到2,3，推该empty到2,4 | D到3,2，推该empty到4,2 |
| 中3,3/F1/D | W到3,4，推该empty到3,5 | S到3,2，推该empty到3,1 |
| 高2,4/F1/D | S到2,3，推该empty到2,2 | D到3,4，推该empty到4,4 |

三个共享目标：2,3有W/S；3,2有D/S；3,4有W/D。后两组是正交推力，可参考M042（2-23）与M104（4-11）实际正交分叶；cargo出生推力参考M120与M124的Prism双cargo冲突。每个共享target按条件选一个胜者，得到八组合；三个empty胜后的坐标集分别 `{2,4;2,2}`、`{4,2;3,1}`、`{3,5;4,4}` 两两不交，三个赢家cargo都在各target旧格。因此八条件组合均无额外independent stack/箱人同格冲突，都是3个F0 cargo＋未参与的P75。

已对八个条件leaf分别固定重放八条P75 Goal尾，64个普通replay全部valid：`WWW`加相应A数，不碰左区任何箱。**若actual真的生成八叶**，可任选一一分配八Goal，完成后切回最大局部time核全局completed；不能仅凭构造笛卡尔积就信用真实八叶。main负责普通合法部署，本文不另搜。

## 实际89→90镜像三force与共同18尾

main实际89 source：C2 BOX67/cargo76=3,3/F1/A；C3 BOX68/cargo77=4,4/F1/A；C1 BOX69/cargo78=4,2/F1/A；empty70=3,2、71=4,3、72=4,1、73=4,5、74=3,4；P75=1,4/F0/A。已实际完整89前置由main闭合，不在本文搜索。

我直接读主JSON实际90八叶帧（本轮首读`events[24]`，`observed90()`按内容定位首个八叶time90帧；当前文件亦有`events[23]`），完整90 instructions：

`AAAAAAAAAWSAWSAAWDDAAWWWDSSAADAAAWWDAWWDSDWASSSDDWDDDDDDSDSASSASSAWWWWAASAAWDDAAAAADWAWDAX`

单X90已actual证明此镜像族三cargo共享多force确实生成八种叶。所有叶time90、P75=1,4 active/ghost0/F0/uncontained/container-1；三个active cargo在3,2/4,3/3,4，均height1/contained1/ghost0/F0。其余五empty也height1，没有额外stack。败者BOX及PLAYER inactive/maskedoff1，不能当活动阻挡箱或额外cargo。精确角色/容器如下：

| axis | cargo@3,2 | cargo@4,3 | cargo@3,4 |
|---|---|---|---|
| 0 | 76/container67 | 77/container68 | 95/container94 |
| 4 | 99/container98 | 77/container68 | 95/container94 |
| 2 | 76/container67 | 77/container68 | 97/container96 |
| 6 | 99/container98 | 77/container68 | 97/container96 |
| 1 | 76/container67 | 78/container69 | 95/container94 |
| 3 | 76/container67 | 78/container69 | 97/container96 |
| 5 | 99/container98 | 78/container69 | 95/container94 |
| 7 | 99/container98 | 78/container69 | 97/container96 |

八叶共同guard72=4,1与73=4,5。接18普通尾：

`SDDDDSSDDDWWDDWWWW`

从主JSON实际八叶重组源后，八次fixed replay均valid，路线严格一致：

| 尾步数 | P75位置与动作 |
|---|---|
| 1 S | 1,3 |
| 2/3 DD | 2,3→3,3；3,3原输家已inactive/masked，不挡自由人 |
| 4/5 DD | 推各叶common4,3 cargo（BOX68/P77或69/P78）到5,3再6,3；P75到4,3再5,3，未装箱 |
| 6/7 SS | 5,2→5,1，未碰guard4,1 |
| 8..10 DDD | 6,1→7,1→8,1 |
| 11/12 WW | 8,2→8,3 |
| 13/14 DD | 9,3→10,3 |
| 15..18 WWWW | 10,4→10,5→10,6→10,7 |

途中只有4,3 cargo被平移两格；另两cargo在3,2/3,4，全部empty与guards保持原叶坐标。P75始终uncontained/ghost0/F0；无冲突、stack、再捕获或死亡边界。八个真实源各接8条Goal A尾也全部valid，共64次普通分配复算；从尾后10,7到Goal x,7直接 `A^(10-x)`。每叶最终局部time为108+(10-x)，八目标中最大117（Goal1,7）。该共同18尾及numeric分配随后已owner全部实际执行，并在最大time117叶完成，见下段CLOSED证据。

新增 `observed90()`/CLI `actual90` 只对真实八叶做固定尾复算，不调用fresh静态族/BFS。该模式要求level blossom、instructions长度90、八叶全部time90、sole free是P75在1,4；任何活体height不为1或P75状态差异均throw，不 silently用flat模型代替未知层数。

## CLOSED actual281：真实numeric T、Goal与存档闭环

本轮只读收束直接复核本关主JSON `events[54].observation`、`completion.level`和`run`：id=blossom、completed=true、instructions/run.actions逐字相等且长度281、undo_depth281；run.action_count281、undo_count6、retry_count0。最后输入记录为`events[53]`，随后54终观测确认完成。无需另一次搜索或游戏输入。

注意主JSON timeline数组按0/4/2/6/1/3/5/7排列；**真实切线使用numeric T0..7**，不能把数组顺序当切线顺序。直接按axis数字核终态：

| numeric T / axis | 实际P75 Goal | 共同18后的A数 | 最终time |
|---|---|---|---|
| 0 | 9,7 | 1 | 109 |
| 1 | 8,7 | 2 | 110 |
| 2 | 7,7 | 3 | 111 |
| 3 | 6,7 | 4 | 112 |
| 4 | 4,7 | 6 | 114 |
| 5 | 3,7 | 7 | 115 |
| 6 | 2,7 | 8 | 116 |
| 7 | 1,7 | 9 | 117 |

每条终叶P75均active、ghost0、uncontained、container-1、Fork0/key0；另外三个cargo均active/contained1/ghost0。八个叶各四活人，共32活动角色投影；其24个cargo不需站Goal。八个P75分叶一一覆盖全部八Goal，最后T7已处最大time117，无需额外末T。完整281构成为90源输入＋8×18共同尾＋40个A＋7次T切换。

root独立正常存档核：LastUsedSaveSlot1、blossom state3、count116、record281与实际完整串匹配、collection6；116关完成审计issues[]。root另MCP核自动返回Chapter4 world[-68,5]、Fork1。本文只读主JSON完成证明；存档、审计和实时world证据来源是root，没有访问/改写游戏存档或发送输入。这个成功不等于全部成就已完成，后续实际域由root另行分派。

脚本新增 `closedActual281()`/CLI `closed281` 仅检查保存的completion/run及numeric0..7 Goal/time/存活状态，任何与上述281/6undo/0retry及八叶终态不同的证据会throw；不调用replay或BFS。历史`actual90`模式保留当时固定尾审查，当前描述明确已由实际281闭环。

## 共享parent会不会关联两个force：已有证据的准确范围

M044（2-25）是比仅引用M042更直接的实证。我直接读 `artifacts/slot1-playthrough/2-25.json`：`events[35]` pre两F1自由parent169在9,5/faceW、173在4,10/faceD；`events[37]`同一个X经ICE同时触发两target force，确有四叶，active组合为：

| 旧实证axis | active人物 |
|---|---|
| 0 | 169、174 |
| 2 | 173、174 |
| 1 | 169、175 |
| 3 | 173、175 |

174是parent169的新child，175是parent173的新child，所以axis0同父169的两个孩子都胜、173两个都败；axis3反过来，另两叶各父各胜一个。它明确说明至少这次自由分裂＋ICE双target的叶选择不被“每parent必须保一个孩子”绑定。`events[37]`某些支仍有ICE后续位置，不用其暂未稳定BOX坐标冒充终停位置。

这个旧四叶实证支持验证共享parent多target方向，但它本身没有直接证明任意三个载箱parent、多箱推链或三target都独立形成2³叶。现在本关actual90另给镜像三force的八叶、mask及P75继承的直接新实证；不把这一实例继续推广任意三target系统。

## 模型/证据边界与复算

`scratch/ch4-27-resource-readonly.cjs` 复用 `scratch/ch4-22-readonly.cjs` 的公开观察geometry/ordinary step，仅重组真实初始contained cargo。不是独立引擎。`inspectX()` 只提出生、共享推力和出生格重叠谓词；手工force两叶按M120条件组装，然后各重放15普通步，不模拟未知混色载人stack或任意多冲突归并。

执行 `D:/nodejs/node.exe scratch/ch4-27-resource-readonly.cjs` 仅复算fresh四种朝向、22普通源、两条件叶右行、八单人Goal尾、三stack条件出生、row1四force组合以及root原三force八组合；加参数 `actual90` 只固定重放历史实际90源共同18尾和Goal分配；`closed281`仅读完成证据。均零BFS，无game bridge或新快照JSON。freshX/actual90/actual281直接证据与其它未部署条件源分别记录；当前89镜像前置、八叶、18尾和Goal分配已全部actual完成，早期有限条件保历史，不作全局无解结论。
