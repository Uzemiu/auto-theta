# 4-21固定棱镜网络与资源条件只读审计

2026-10-04。源：`artifacts/slot1-playthrough/4-21.json` initial及真实43（events[35]）。唯一输入owner `/root/resume_slot1_oct03`；本助手无游戏/UI输入、无提示/攻略/隐藏实现、无存档/主KB/主JSON写。自有脚本 `scratch/ch4-21-optics-condition-readonly.cjs` 只做构造条件态的短串replay，无BFS，未扩大main43搜索预算。

## 实际43与固定光学范围

真实43：C4BOX83/cargo95=9,2/Fork1/A；outside94=10,2/F0/A、outside96=10,4/F0/S；empty81=10,3、empty82=7,3。Lock10,2已开，Fork与Key已拾取。两个outside的坐标和均为偶数；无wait/额外X/角色捕获的普通单位移动保持此相对奇偶。站在北两远端2,7与3,7的角色则必须相反奇偶。

Goal为1,5，Prism84/85/86位于1/2/3,5，Prism87/88/89位于1,4、1,3、2,3。六棱镜在此固定网络的静态四末射线如下；完成以同一叶整个目标网络的实际判据为准，不把不同叶的部分射线拼成该目标完成。

| 末支 | 棱镜位置 | 相邻地形/BOX挡光位 | 远端观察位 |
|---|---|---|---|
| 北2 | 2,5 | 2,6 SPIKE | 2,7 safe |
| 北3 | 3,5 | 3,6 SPIKE | 3,7 safe |
| 南1 | 1,3 | 1,2 SPIKE | 1,1 SPIKE |
| 南2 | 2,3 | 2,2 SPIKE | 2,1 SPIKE |

M054只支持紧邻普通BOX关闭一支，不能把2,7/3,7远处空BOX当作邻接mute；活cargo与free均可以按既有光照观察机制作为observer。`rayMask=15`在脚本中仅是本固定网络的强充分候选，仍需实际completed/testCompleted确认，不以traversed单独计完成。

## 南端X与北端替代X

条件南态：cargo2,1/F1/A、emptybuffer3,1，两个outside另处活且F0。单X的有效方向为北2,2与正前1,1；两cargoF0/ghost0落在SPIKE但受容器保护，南两支对应mask12。emptybuffer3,1不参与本次出生，不会被X复制；它是先前运输的缓冲资源，不能因摆在row1就认为可北推回收（pusher3,0为Wall）。当前43到此南态的合法前置尚未给出。

不同条件北态：cargo3,7/F1/A。单X向南3,6有效、向北3,8为Wall而使用前方2,7；得到cargo3,6/2,7F0，北两支mask3。该方案消耗同一唯一Fork，不能同时把南端X也算进可用动作。1/2,1裸SPIKE不能让free站南端替代cargo。

## 北邻emptyBOX普通部署的最后一步限制

固定六棱镜不搬动且没有新X出生/叠箱/其它机制时，不能直接给“emptyBOX2,6或3,6”的普通可达结论：

| 目标BOX格 | 向北推的前置 | 向南推的前置 | 向西推的前置 | 向东推的前置 |
|---|---|---|---|---|
| 2,6 | source2,5为Prism，pusher2,4为Wall | source2,7，pusher2,8为Wall | source3,6，pusher4,6为Wall | source1,6为Wall |
| 3,6 | source3,5为Prism，pusher3,4为Wall | source3,7，pusher3,8为Wall | source4,6为Wall | source2,6，pusher1,6为Wall |

这只是固定网络普通最后一步的几何边界，不排除cargoX出生或合法新机制。南邻1,2/2,2同样四向受到Wall/原Prism及不可站的推者格限制；不能无前置地使用空箱mute替代保护角色。

单人从上部7,8到3,7的安全静态路线是`AAASA`：7,8→6,8→5,8→4,8→4,7→3,7；再A可到2,7。3,8是真Wall，不是4,8向西的可走上绕路。双人同时走该串须另外核互相位置和裸SPIKE，不能把单人路径当双人前缀。

两个相反奇偶free已在4,8/5,8时，`AAA`是北端短收束：第一A→4,7/4,8（前者撞3,8Wall后转S）；第二A→3,7/4,7；第三A→2,7/3,7，两人全活，无SPIKE。若南cargo已在1,1/2,2且不被推，完整constructed条件态的该三输入为mask15；这是可部署目标，不是从43完成的路线。

## 不依赖Gate7,6的可恢复ordinarywait条件

constructed前态：cargoF1=8,2，empty=7,3/6,3，twofree=8,3/9,2，各F0且同奇偶。8,3北8,4、东9,3均Wall；南cargo8,2背8,1Wall；西双箱7,3/6,3背5,3Wall。此人四向均不能移动。

单串`ASAAW`已用公开模型复算valid，无新X、无conflict/stack、无Gate7,6配对假设：

| 步 | cargo/empty | outside与奇偶变化 |
|---|---|---|
| 0 | cargo8,2/F1；empty7,3/6,3 | free8,3与9,2均odd |
| A | cargo7,2；双empty不动 | 8,3等待；另一9,2→8,2，变相反奇偶 |
| S | cargo7,2不动 | 等待者→8,2；另一8,2撞8,1Wall转D→9,2，相反奇偶保留 |
| AA | cargo依次6,2→5,2 | 两free终6,2/7,2，相反奇偶 |
| W | cargo5,2/F1/W；empty升6,4/7,4 | free6,3/7,3，相反奇偶，全活 |

三body均未沉row1或刺区，可继续普通回收；先从7,3把BOX7,4向7,5推可腾出7,4，再从7,4把BOX6,4向西5,4推（直接从6,3向北推会被6,5Wall挡住）。cargo5,2仍能从6,2或4,2横向推动。资源成本为全部三BOX，不牺牲actor或Fork。

关键缺前置：真实43的empty81已在SPIKE10,3，任一普通裸pusher把它移走时会踏其旧SPIKE格10,3；无额外同刻保护时该pusher死亡，不能称无成本回收。故不能直接把43两free完整送入本wait前态。此target应在更早可部署阶段构造，或先证明新的保护/资源机制。未搜索该前置，未要求owner盲试。

## 一个更小的两BOX链活capture条件

不移动SPIKE上的81，constructed条件为cargoFork1=6,2、empty82=5,2、free7,2/4,3（两者均odd）。单A：右free推动cargo+empty两箱链向左，cargo→5,2、empty→4,2、pusher→6,2；左free4,3撞3,3Wall转S→4,2，被同刻移入的empty82捕获，生成cargoF0/S/ghost0。终两个cargo5,2F1/A与4,2F0/S，加outside6,2，全活，Fork1保持。独立短串replayvalid，无新X、stack、conflict或occupied捕获。

此条件用原cargo作推链后缓冲，只需可搬的empty82，成本低于三bodywait；empty82从7,3可先由7,4向S降7,2，再由8,2向A横推（须每步重新核其它角色和已有cargo占据，不能算完整前缀）。新增cargo4,2可从4,1向N回收，未被row1锁死。真实43到cargo6,2/empty5,2/free7,2/4,3的同步前置尚未给出；双cargo+一free随后如何分配南/北全网也未闭合。仅提供main不同的可部署资源谓词，不把正capture当解关。

## 门、等待边界与本轮范围

Gate12,7受Button10,4控制已有实际证据，脚本只使用这一已证配对。Gate7,6与Button7,5尚未单证；本轮全部正短串均避开它。尤其不能把P7,5+南三箱链+“北门闭”当确定wait：若Button7,5正控制Gate7,6，P本身就会开北门，转W即可走，fullywait前提失效。

本轮只有两个单X、五输入wait、单A捕获、三输入北收束的constructed条件核验，无43 BFS、无队列预算、无游戏实验、无Goal实际完成结论。报告与条件短串已发送parent/owner/main。parent最新通知owner正实测43→66的新23普通尾；本助手未执行、未将该计划66当已实测。该计划目标empty81仍10,3SPIKE，故本wait条件也不能无前置套用66；后续以完整正常前缀或新真实机制再接力，不扩大同域搜索。
