# 4-19「反制」只读资源与目标审计

日期：2026-10-04。唯一游戏输入 owner 为 `/root/resume_slot1_oct03`；本助手只读公开桥观测与既有机制，只写自己的 scratch。未使用提示、攻略、隐藏实现、存档改写或主知识库改写。

## 场景和模型边界

源为 `artifacts/slot1-playthrough/4-19.json` 的真实 initial 与 actual2/4/8/9。Goal 在6,8，与Prism45同格；侧Prism46/47在5,8/7,8。初BOX42（Color4）4,3、BOX43（Color3）5,3；P44初4,1。Fork在4,2与5,2。无ICE。SPIKE为2,1..4及4,5/4,6；Wall实体优先于Floor，尤其4,4/4,7及5/6,4/5。私有模型 `scratch/ch4-19-readonly.cjs` 复算普通混合推链、叉分裂、活角色装箱和已有cargo的全局面向；不实现未知异源叠箱/幽灵/推力冲突，也不把人物站在某个发光格直接算完成。

M053/M054证实目标的开放光分支需覆盖、邻接普通BOX可关闭一支。M068记录3-23相邻Prism1,8/1,9仍traversed的实例，因此不把邻Prism普遍等同邻BOX。4-19 actual2中央45 traversed=true而侧46/47=false，只是本场景有限观察；既不能据此先宣称三列必要，也不能先宣称单列足够。完成判据须读取实际 `completed` 与Prism的 `testCompleted`。

## 已实测短资源前缀

`WDAXDDWWW`（9）：owner已逐段正常实测并报告全部吻合。本模型单串独立重放一致。

| 输入总数 | 动作/关键态 |
|---|---|
| 2 | `WD`：P44=5,2/Fork2/D，两箱原位，两Fork已取。 |
| 4 | `AX`：两free=4,1与3,2，均Fork1/A。北侧4,3的BOX被4,4墙挡，X使用南侧和前方替代。 |
| 8 | 再`DDWW`：free6,3/W、free3,2/A，两箱仍4,3/5,3。 |
| 9 | `W`：右free因6,4墙转A，把Blue+C4两箱左推至4,3/3,3；左free同刻W进入3,3，被C4捕获。实际cargo48/BOX42=3,3/Fork1/W/ghost0；outside44=5,3/Fork1/A。 |

无ICE、无裸人踏SPIKE，也没有额外worldline。

## 12输入尾：已实测运输吻合，但Goal未完成

从真实9接 `SAAWWWAWDDWX`；完整21输入为：

```text
WDAXDDWWWSAAWWWAWDDWX
```

私有单串replay为valid=true。owner已分段正常实测到21，全部运输吻合，但completed=false；随后正常undo4恢复17。以下检查点保留为历史已验证运输，不能重用作完成路线。

| 总输入 | cargo/外人/其它资源 |
|---|---|
| 15（`SAAWWW`） | cargo3,6/Fork1/W；free3,5/Fork1/W；Blue4,3。 |
| 17（`AW`） | cargo3,6/Fork1/W；free2,6/Fork1/W。 |
| 18（`D`） | cargo4,6受容器保护；free3,6安全。 |
| 19（第二`D`） | cargo5,6/Fork1/D；外人进入SPIKE4,6死亡；Blue4,3。 |
| 20（`W`） | 无活outside；cargo不移动但面向改W。 |
| 21（`X`） | cargo左右有效出生4,6/6,6，两者Fork0/ghost0，C4同源；Blue4,3未动。6,6位于中央Prism的向下几何射线。 |

直接证据：主JSON `events[11]` 为真实17，`events[13]` 为20，`events[15]` 为21，`events[17]` 为undo4后的17。21中央45保持traversed=true/testCompleted=false；左46从false变true但testCompleted=false，右47仍traversed=false。BOX42/cargo48在4,6，新增BOX49/cargo50在6,6，两cargo active/ghost0/contained1/Fork0；原P44在4,6死亡。该具体中央光路不足已实际验证。递归检查早停可以解释左右flags变化，但这是推断，不读隐藏算法，也不固定“三列必要”。

## 一次完整普通子域：真实17立即X

模型seed为真实17接一个X：cargo2,6/4,6均Fork0；free1,6/3,6均Fork0；Blue4,3。此X尚未在游戏执行。目标采用强正候选：5/6/7各列的向下光路有活observer，或紧邻Prism下方BOX关闭相应一支（M054）；只作为充分候选，不作必要性证明。

固定cap12000/depth40，实际单轮结果为expanded782、seen782、pending0、depthcut0，模型域队列完全闭合。保BOX row1（未剪），允许活Blue捕获；普通混合推链、已有cargo普通运动/全局face按公开规则；不传播异源stack、推力conflict、Ghost复活，不增加X。低于3actors的后态在此子域剪去，因此“完整”只适用于此精确受限域，并非完整游戏状态。

没有三个光路全部覆盖的候选，最多覆盖2支。最短记录的2支例为seed后 `DDSSSSDDWWSAWWWWWD`，终cargo5,6/6,6、emptyBlue4,6、free3,6；再D会把两cargo送6,6/7,6、Blue送5,6、free死4,6，远处空Blue不能按M054当成关闭5,8的向下分支。未要求owner执行。

## 一次不同域：真实9先部署，再全体X，再普通尾

parent明确授权的单轮固定预算：cap12000/depth45。源为真实9 cargo3,3/Fork1/W、outside5,3/Fork1/A、Blue4,3；允许普通重部署后最多再一次全体X（命中路径若有须恰一次），之后普通移动/活Blue捕获。无row1剪枝、无新增叉、无Ghost/新stack/conflict传播。光学目标仍为上述全部三支的强充分候选。

实际执行 `D:/nodejs/node.exe` 在约1秒内返回，无后台session。expanded12000、seen14222、pending2222，cap已截断，depthcut0；没有完整候选，最多2支。840个接受过渡后态含Blue活cargo（这是过渡计数，不是唯一节点数）。拒绝异源stack3次、conflict82次、occupied-Fork碰撞0次。没有增加预算，剩余2222不能称排除或无解。

最短首次异源stack边界的完整初态前缀为：

```text
WDAXDDWWWSAWWSDDWDAX
```

该字符串为20输入，末X前为总19：cargoC4在3,4/Fork1/A；Blue4,3；outside5,3/Fork1/A。末X的模型几何：cargo生3,3与3,5/Fork0；free生5,2与4,3/Fork0，后者把Blue左推3,3，与C4子箱同格。这是独立来源42/43同格的候选物理事件；本模型在该点停止，不能把结果自动算成已形成2层、已观察分线或已完成。此前19普通/叉动作可私有单串重放，末态必须由实际游戏或更完整的公开机制模型核验。此前协作消息误写total19，已修正为20，未影响模型实际路径或预算。

另外两个同类stack拒绝样本为 `WDAXDDWWWSAWWSDDWDDX`（20输入）与 `WDAXDDWWWSAWWWSSDDWWSAX`（23输入、preX22）。已把样本pre/post发给结构助手；其负责独立stack/capture资源审计，不重复本轮BFS。最短即时X conflict是 `WDAXDDWWWX`：C4右生推Blue向D与outside前生推同Blue向A，属于模型拒绝边界而不是合法单线结果。

owner计划从17 normalreturn，待实际world帧确认；root最新独立只读核验仍为counter17/time17、双活Fork1，累计4undo/0retry保留，返回尚未执行。接下来优先新4-20（如果正常开放）。本助手不会要求盲试stack、重复中央失败尾或延长本轮预算；后续若有新的公开机制或具体资源状态才另开不同域。4-19保持未完成。
