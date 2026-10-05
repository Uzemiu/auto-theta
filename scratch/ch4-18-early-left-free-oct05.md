# 4-18 早期actual40+AX：双左外人/可操作空箱资源

2026-10-05，只读 `/root/ch3_37_cargo_revisit_oct03`，唯一输入 owner `/root/ch4_1_readonly`。没有游戏/UI输入、存档/canonical/主JSON修改、隐藏实现/反射dump/plugin源码、提示或攻略读取。本文只写自有公开模型与有限范围；不重跑fixed63/71或旧5000图。

**当前：actual40源成立；40+AX与空Blue3,5部署仅MODEL，末叉尚未获得活cargo保护。** 本轮4000扩展上限已结束并截断，不能写成已解/队列穷尽。没有可回收载箱沿3,3→3,4→3,5→3,6拾Fork的正前缀，不提高cap。

## 实际40源与两步出生

主 `4-18.json` 最新actual40 **events[66] frame13043189、time43**：

| 资源 | 实际状态 |
|---|---|
| outside79 | 3,5 / F1 / key1 / A，active、ghost0、uncontained |
| C2 BOX73/cargo78、BOX80/cargo81 | 7,6 / 8,6，各F0/key0/A、aliveghost0contained1；压双button |
| empty C4 BOX74、Blue BOX75 | 2,2 / 2,3 |
| Gate5,2 / Gate6,2 | 都blockable=false |
| Lock9,5 | active；3,6 SPIKE上的最后Fork仍active |

完整实际40串：`WASXWDDSWAAAAAWDDAAAASWDWWXWSSAAAAAWWWDA`。此源是正常历史checkpoint，不冒称owner现场已从71撤销回40。

固定`AX`：A到2,5仍F1/key1/A；X的南侧2,4有效，北侧2,6真Wall，fallback前1,5有效。预计得到twofree2,4/1,5，各F0/key1/A，两个右C2cargo原位且F0，左空箱不动。无ICE/裸SPIKE/箱碰撞，四活角色，双门仍开、总持叉0但最后Fork未取。Fork消耗及keys复制依据公开分裂模型；本次42尚未实际验证，不能预先填写真实出生新ID。

未来最小正常对照只需实际40上的A、X两输入，分别核2,5/F1/key1及双F0/key1/双门/Box原位。当前未要求owner执行此候选。

## 安全空Blue上方部署（非取叉）

42后固定9输入：`WWAAADWWD`。从40共11新增，即`AXWWAAADWWD`，模型总51/time54。

| 相对42输入 | 两free | 左空箱变化 |
|---|---|---|
| W1 | 2,5 / 1,6 | 不动 |
| W2 | 1,5（A fallback）/ 1,7 | 不动 |
| A3 | 1,4 / 1,6 | 不动 |
| A4 | 1,3 / 1,5 | 不动 |
| A5 | 1,2 / 1,4 | 不动 |
| D6 | 2,2 / 2,4 | C4从2,2到3,2 |
| W7 | 2,3 / 2,5 | Blue2,3→2,4 |
| W8 | 2,4 / 1,5（A fallback）| Blue2,4→2,5 |
| D9 | 3,4 / 2,5 | Blue2,5→3,5 |

两free均F0/key1/ghost0，右两cargo仍7/8,6压双button，两门持续开，emptyC4=3,2、**emptyBlue=3,5**，Lock与末Fork均active。全部固定重放有效，没有BoxICE、冲突、叠箱或捕获。

**不能把51当已取叉或载人部署。** 此后单W只会把空Blue送3,6，前推者停3,5；另一人从2,5因2,6Wall转A到1,5，不会同刻装箱。Fork不会被空箱拾取。必须先得到活cargo，再由下方外人沿3,3→3,4→3,5→3,6运输；本轮没有这条可回收捕获前缀。没有要求owner为完整目标盲走这9输入。

## 首捕获被保留，但row1不能北回收

42后最短已保留首capture固定串：`SSSDWASSS`（9），模型四活、无Ghost。末态Bluecargo=4,1 F0/key1/S，outside=2,1 F0/key1/D，emptyC4=3,1；两个右cargo7/8,6不动、两门仍开、最后Forkactive。

这是真实可复算的模型捕获，而**不是可运输正资源**：Blue4,1北推需4,0Wall，西推需5,1Wall，东/南目标5,1/4,0均Wall，四向普通无法移动。C4 3,1也不能普通上抬，因为row0整行Wall，水平挪动不改变北推者缺口。没有把它推荐给owner为末叉准备；也没有将所有捕获路线都排除。

## 一次新有限域执行与边界

自有脚本 `scratch/ch4-18-early-left-free-oct05.cjs` 复制公开4-18基本step及受限ICE副本；是模型复用，不是独立游戏引擎。只从上述40+AX新源展开WASD，保四活，不设row1剪枝，目标左C4/Blue活cargo在3,6取得Fork1且≥1outside活。记录首安全capture、3,5部署与上区载箱，但不做泛四Goal搜索。

运行一次固定 **cap4000 / depth30**，exit0、无live handle：

| 指标 | 值 |
|---|---:|
| expanded / seen / pending | 4000 / 7218 / 3218 |
| depthCut | 0 |
| protected-Fork cargo命中 / upper左载箱 | 无 / 无 |
| actor-loss剪 | 1410 |
| Ghost / occupied / movingOverlap | 0 / 0 / 0 |
| force / stack / BoxICE停止 | 26 / 3 / 4 |

达到扩展上限，**明显非穷尽**；未提高cap、未复跑同轮来提取未存路径。只保留了上文最短capture与empty3,5 milestone。没有可直接提取的可回收left cargo3,3正前缀；不伪称已经找到可接末叉的链。

model step使用真实Wall/Floor、已证箱链/保护、旧输入门态、持key开锁；BoxICE、force、独立stack、occupied、Ghost及未证运动碰撞停止。Button7-alone配对仍只条件映射；上面两个短固定串两右cargo一直压双button，因此不依赖此未隔离条件。四活保持排除了合并/死亡后的不同库存域，不由此否定它们。

最短force窗口仅MODEL：40后`AXSSADS`（7），pre末S emptyC4=2,1、Blue=3,2，free3,3/2,2 F0/key1。单S：上人向S推Blue到3,1；左下人S被C42,1背2,0Wall挡，转D推Blue到4,2，两人请求同格3,2。这是对同一Blue的S/D正交force，不传播成多叶、不把胜者mask后的单outside当原双outside库存，也不当完成候选。

本轮封存。更强早期库存可以考虑改变原26X前Fork/捕获分配，但root尚未构造具体源，本报告不替它虚构完整解。后续等待真正新的实际resource/heldFork1 stack条件，不泛扩40+AX。
