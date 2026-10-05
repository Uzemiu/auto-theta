# 4-13 matrix：只读模型与分段实测记录

本 helper 只读实际观察、按已验证普通规则建模、写自有 scratch。没有游戏输入、提示、隐藏实现读取、存档编辑或主知识库写入。唯一输入 owner 为 `resume_slot1_oct03`。

## 实际完成证据

2026-10-04：owner 完整66输入实际全部吻合，`completed=true`，0 undo、0 retry。此 helper 独立读取 `artifacts/slot1-playthrough/4-13.json` 的 `completion.level`/`run` 闭环：一条世界线 time66，四只 Color4 BOX/cargo 位于 (1,5)/(1,7)/(3,5)/(3,7)，均 active、contained1、ghost0、叉0。原外人53在63态最后推动后死于 (2,5)，ghost1/inactive；四个目标都有活载箱角色。

模型 `scratch/ch4-13-readonly.cjs` 从 `artifacts/slot1-playthrough/4-13.json` 初态读取墙与刺。按 gate0(5,4)←button(5,3)、gate1(5,7)←button(6,7) 建模，并用实际阶段校验配对。目标(1,5)/(3,5)/(1,7)/(3,7)，刺(1,6)/(2,5)/(2,6)/(2,7)/(3,6)。单Color4 BOX(2,2)、PLAYER(6,1)、叉(6,2)/(5,5)/(5,6)。

## 完整实际路线

```text
AAAAWAWDDDSDDWDWWWWWWWWAAXSSAWWWWADDDAADDDWDWWAADWAADSAAASAWWWWXAX
```

| 结束记录长度 | 新输入 | 检查点 |
|---|---|---|
| 10 | `AAAAWAWDDD` | BOX(5,3)压 button0，solo(4,3) |
| 13 | `SDD` | solo(6,2)取首叉1，BOX仍按钮 |
| 23 | `WDWWWWWWWW` | 经7列绕至button1，再占gate1进入5,6/5,5取完三叉；solo(5,5)叉3 |
| 25 | `AA` | 经gate0退出并把BOX下推至(5,2)，solo(5,3)实际faceS、叉3 |
| 26 | `X` | fork2 两外人53(6,3)/54(4,3)，BOX(5,2) |
| 33 | `SSAWWWW` | BOX(5,6)，53(5,5)叉2，54(2,4)叉2；两门均闭 |
| 34 | `A` | 53普通原地等待、仍叉2；54由(2,4)转S至(2,3)，两人奇偶不同 |
| 39 | `DDDAA` | BOX(5,6)，53(5,3)压button0、54(3,3)，两者叉2 |
| 46 | `DDDWDWW` | 53(6,7)压button1、54(5,4)占gate0，BOX仍(5,6)，两门开 |
| 51 | `AADWA` | 53从上回收BOX，并在gate0捕获54；末cargo54/BOX(5,3)、external53(5,4)，两者叉2 |
| 61 | `ADSAAASAWW` | cargo/BOX(2,4)，external(2,3)，两者叉2 |
| 63 | `WW` | cargo/BOX(2,6)叉2，external死于(2,5) |
| 64 | `X` | 面W cargo复制到(1,6)/(3,6)，各叉1，刺由载箱保护 |
| 65 | `A` | 两cargo面向左，坐标保持 |
| 66 | `X` | 两cargo分别上下复制至四个目标(1,5)/(1,7)/(3,5)/(3,7) |

## 普通等待为何成立

在实际33态，53位于(5,5)，下方gate0(5,4)已闭，东西(4,5)/(6,5)为Wall，上方BOX(5,6)的背后gate1(5,7)已闭。普通四方向都不能移动，末A实际保持原格但更新面向。54在(2,4)的A被左墙阻后转S至(2,3)，因此改变相对奇偶；两人均未消费叉。33/34两个观察均明确 `blockable=true` 两门。这个完整四向阻挡等待已真实证实，不能仅把邻近BOX视为墙。

回收时先让53经button0释放至下部，轮换button0后绕右侧占button1；54占gate0。53从上面(5,7)把BOX下推，54同步维持button0时再接应。50态W中，53从(5,6)因北墙/闭上门等 fallback 向下推BOX(5,5)至(5,4)，54从button0(5,3)上行至(5,4)被捕获并保叉2；51态继续下推到(5,3)。这样不会把箱留在(5,7)无法从上方普通下推的边界。

## 有限模型与末端核验范围

solo3fork 2049展开/2098seen；普通两fork2外人改变奇偶 1162/1896；限定载箱返回下部的捕获 1837/2039；送至(2,4)检查点 715/950。模型普通阶段明确拒绝不可回收 y1 箱和裸刺死亡；未把这些限制当全局无解结论。

模型当前没有实现 cargo X，末端 `WWXAX` 先由已经实证的载箱复制规则几何核对，再由 owner 实际验证；root 独立 stack-cargo replay 前51及后10普通输入通过，资源 helper 也独立重放前61与五尾边界。最后两代cargo均无外人存活，因此同X中没有额外外人或同格盒碰撞。owner 64、65、66分步观察证实两代复制、面向更新、四goal活cargo及最终完成。
