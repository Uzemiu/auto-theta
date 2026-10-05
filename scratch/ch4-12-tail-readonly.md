# 4-12 鸭子：持叉载箱冲突后的条件尾审计

2026-10-04，只读助手 `/root/ch3_37_cargo_revisit_oct03`，唯一输入 owner `/root/resume_slot1_oct03`，SaveSlot1。未操作游戏或存档，未修改主KB，不用提示、外部攻略、隐藏实现；未搜索捕获/冲突前置。

## 真实来源与条件起点

只读 `artifacts/slot1-playthrough/4-12.json` initial / events[9] 的第17态。runtime duck，size8,8；目标1,7/2,7/3,7；Color4 BOX58=3,3。三活外人：59=7,1 fork0、60=6,3 fork1、61=7,2 fork1，三枚forkKEY均inactive。当前尚无cargo或冲突分支，这个真实17态不能当作下列条件起点已达成。

root提供待构造的冲突谓词：BOX2,3含active/ghost0/cargoFork1，外人3,3/2,2，同W。3,3人遇3,4真Wall转A推箱1,3；2,2人直接W推箱2,4。按M095可形成Left / Up两支，各继承一名cargoFork1和一名外人2,3；外人剩叉数可能0或1，由实际捕获前置决定，必须核明。

本审计只从这两个分支端点作有限普通重放，不宣称这个谓词或完整前缀已经构造。

## 关键Wall与X规则

- 1,4/1,5/1,6是真Wall，不能因同格Floor/SPIKE字符认为可走；0,3是真边墙；3,4/3,5也是真Wall。中廊2,4/2,5安全，2,6为SPIKE，2,7为目标。
- 1,7/3,7不是Wall，均为GOAL floor，尽管左1,6是被Wall覆盖的刺。Cargo在2,7复制到这两个目标有实际M098的Color4活容器复制支持。
- 普通M009/M011/M022：两侧受阻时各回退前方；同一前方落点只保留一个active分支，消耗一叉并保留父朝向。
- M099：cargo持叉X只有一侧有效时迁移原Color4载箱，fork归0，不额外留下源位箱/人。这里的Left/W仅右2,3有效，与已实测4-5的单侧迁移规则相符。

自有 `scratch/ch4-12-tail-readonly.cjs` 使用观察构建的普通模型核移动/外人X；仅在cargo1,3 faceW、left0,3与front1,4真Wall的特定边界，明确用M099代换cargoX到2,3。它不是泛化cargoX实现，也不读取隐藏代码。Up末X只核目标两侧几何并据M098推断，未以模型产生的新ID冒充游戏实测。

## Up：四步 `WWWX`

条件起点：cargo2,4 fork1，free2,3 fork0或1；不要求初始cargo朝向，因为W会设faceW。

| 动作后 | cargo | 外人 |
|---|---|---|
| W | 2,5，活，fork1，faceW | 2,4，活，原叉数 |
| WW | 2,6刺内，活，fork1 | 2,5，活 |
| WWW | 2,7目标，活，fork1 | 2,6刺死亡 |
| WWWX | 条件预期双cargo1,7/3,7，fork0 | 已inactive，不参与X |

末X cargo的左右落点1,7/3,7都有效，无其他活外人或箱占据；按M098应复制成两个活容器。外人是叉0还是叉1不影响本尾：第三W后它已经死亡，不能在末X再分裂。Up仅覆盖两侧目标，需要Left支补中央2,7。

## Left：必须先W，再按外人剩叉数选尾

条件起点：cargo1,3 fork1，外人2,3 fork0或1。

单 W：cargo仍1,3、faceW；外人上到2,4、faceW。cargoX的左0,3与前1,4均Wall，仅右2,3有效，所以原载箱迁到2,3 fork0；原1,3清空。

外人同时X的差异：

| 外人叉数 | X后外人 | X后cargo | 后续S次数 |
|---|---|---|---|
| fork1 | 2,5，fork0：两侧1,4/3,4Wall均回退2,5，再合并 | 2,3，fork0 | 先S到2,4，再S向下推箱2,2 |
| fork0 | 原位2,4，fork0等待 | 2,3，fork0 | 一S直接向下推箱2,2 |

对应完整条件尾：

- 外人fork1：**`WXSSDSSAWWWWW`**，13输入。
- 外人fork0：**`WXSDSSAWWWWW`**，12输入。

下送后共同状态：BOX/cargo2,2 fork0，外人2,3 fork0。`DSSA` 让外人绕3,3→3,2→3,1→2,1；cargo只改朝向而原地等待。随后5W连续北推载箱2,3→2,4→2,5→2,6→2,7；推动者最后落2,6刺死亡，cargo仍活在中央目标。

两条完整movement replay均有效，没有把BOX降到不可北推的row1，没有多cargo或剩活外人。叉1额外的第一S不能省：省掉会从2,5直接开始绕路，箱尚未下送，位置不等价。叉0则不要照搬多余第一S，否则会继续把2,2箱推到2,1，损坏此尾。

旧 `SX...` 不能当作单侧迁移：cargo1,3若先S，front1,2仍安全，可成为另一侧fallback，会多生一个容器。只采用先W将front1,4对墙的版本；没有忽略前方回退，也没有假设未消耗的叉子会自动消失。

## 有限结论与实测前置

四个条件核对（Up外人叉0/1、Left外人叉0/1）几何通过。结果已发root、主helper、owner。此时尚无真实capture/冲突分支，不能把两尾拼接成已完成解法；需要owner正常核cargo.active/contained/ghost0/split1及外人split，再按BOX1,3或2,4辨别分支，选择对应Left尾。

之后若正常执行，应核Up两活cargo在1,7/3,7、Left一活cargo在2,7以及completed。存档计数另由root/owner核；本助手不读写save，不从有限尾模型作全局无解或全成就结论。

## 后续有限 ordinary-wait 几何核查

root/owner随后请求从真实17资源结构找普通等待，不重复主helper的捕获/冲突BFS。本助手自有 `scratch/ch4-12-wait-readonly.cjs` 仅枚举本图safe外人格与一个非Wall箱位（地图共29safe人位、31可容箱地板位），四个普通方向均不可移动才算wait；明确把SPIKE视为可移动但死亡，而不是阻挡。按门占用保持处理站在7,4门格的实体。假定无额外实体压6,2按钮时，只有：

| 等待者 | 单BOX | gate7,4 | 四向不可移动原因 |
|---|---|---|---|
| 7,5 | 7,6 | 关闭 | 左6,5/右8,5墙；上BOX背靠7,7墙；下关闭门 |
| 7,6 | 7,5 | 关闭 | 左6,6/右8,6/上7,7墙；下BOX背靠关闭门 |

按钮开启时，没有单箱四阻ordinarywait。上述结论只覆盖这张已观测普通图、一个箱和安全free；不排除X、cargo等待、其他实体数或组合图。

两个条件局部replay均能原地普通W一拍并保fork1，另一个free从6,1走到6,2开门，从而改变角色相对奇偶：

- Waiter7,5 / BOX7,6：`WSS`使waiter先不动，再7,4→7,3，fork1始终保留。BOX7,6不能普通下送，因为所需上方推位7,7是真Wall；左右也是墙，此箱普通不可回收。
- Waiter7,6 / BOX7,5：`WSS`使waiter先不动，再S推BOX7,5→7,4→7,3，waiter7,4且fork1保留。箱确能离开上袋，但仍在x7边界；普通左推需x8的真Wall站位，不能仅称“退到7,3”便当作回到主厅可用箱。后续cargo X、更多资源或其他已证机制必须另闭合。

纠正一个未执行的capture断言：如果另一个free已站7,4准备W推动BOX7,5，而holder在7,6，门会被7,4占用保持开启。Holder自己的W在上/左墙受阻后可以S推BOX7,5进已开的7,4；此时不再是四阻等待，可能形成W/S相反推力冲突，不能直接当作“推箱到7,6确定捕获等待者”。这个动态门反例已发root并传owner/main，未作游戏试验。

## 精确三free0资源状态的分阶段正候选

之后root给出**未实测模型前缀**：actual6后 `WASAWWDDSDWDAA`，条件末态BOX6,3/holder7,3 fork1/free4,2 fork0，7,6叉仍active；再X拟成BOX5,3，三个free0：旧waiter4,2、新6,3、新7,2。新两人同奇偶，旧waiter另一奇偶，若旧人取最后叉后被捕获，可保两名同奇偶外人作orthoconflict。这里的exact三人状态来自root/owner模型，**不是当前17的实际实体状态**。

本助手 `scratch/ch4-12-button-stages-readonly.cjs` 从该精确条件状态作四个窄阶段：不搜索capture/冲突，不用X，不准新两人取得叉、不准free死亡/合并/进容器，箱只能沿对应阶段指定行列运动。每阶段上限1500 processed，全部在上限内正达标：

| 阶段 | 普通候选串 | 末态 | processed / seen |
|---|---|---|---|
| 将箱左送且保留上方推者 | `AASAWWW` | BOX2,3；旧free1,2，新2,4/3,3 | 181 / 295 |
| 下送 | `S` | BOX2,2；旧free1,1，新2,3/3,2 | 2 / 3 |
| 沿row2横送按钮 | `WWAADDDD` | BOX6,2；旧free5,1，新6,3/5,2，gate开 | 145 / 231 |
| 旧人取最后叉 | `AAAAASWDDWDDWWW` | 旧free7,6 fork1，新2,4/3,3 fork0；BOX6,2 | 301 / 355 |

合并31串：**`AASAWWWSWWAADDDDAAAAASWDDWDDWWW`**。有限资源路线全部有效，无截断，没有把唯一箱沉到row1或推死边界；BOX6,2压按钮后保开7,4门，旧waiter实际模型拾取7,6叉。这证明该精确三free0条件下的资源阶段可行，尚未给此31串后的完整capture/冲突前置，不要求owner按它盲重试。

root随后通知主helper已另得完整70候选，owner正正常undo11逐段实测；本助手立即停止额外搜索，主线采用完整候选而不是上述替代资源串。保留以前Up/Left条件尾证据，不把旧有限失败或不同状态混用，也不新增全局不可解结论。实际完成闭环待root/owner真实记录。
