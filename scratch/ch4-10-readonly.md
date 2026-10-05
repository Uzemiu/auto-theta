# 4-10 蜗牛：只读有限分析（2026-10-04）

唯一游戏输入 owner：`resume_slot1_oct03`。本 helper 仅读取主 JSON、已有普通机制笔记并写独立 scratch；没有游戏输入、提示、攻略、实现代码、存档或主知识库写入。当前未完成，不能把局部候选当完整解。

## 实际锚点

来源：`artifacts/slot1-playthrough/4-10.json`。

- 初态 P1,2，Color4 BOX3,3 /4,3 /4,2，fork2,1 /1,5，普通 key3,6，LOCK7,4，GOAL7,8 /7,9。
- SPIKE4,4 /5,6 /6,2 /7,5 /7,6 /7,7；实体 Wall 优先于同格 tiles。
- gate ID0：3,4 /4,5；gate ID1：4,1 /1,4。
- owner 已真实核 button1,1 控 ID1，button6,1 控 ID0。单按钮开门在动作后生效，不把本步将按按钮视为本步已可进入关闭门。
- actual8 `SDXASDDD`：free3,2 /6,1，fork0，三箱原位，ID0开、ID1闭。
- actual19 `SDXASDDDAAAAWWWAAWW` 曾取第二叉成功：fork1 1,5、fork0 1,3，箱3,3 /4,3 /4,4。空箱4,4在刺上，普通推出后推者会踏刺；此不是完整运输解。
- owner 正常 undo11 回8，改采用资源 helper 的保三箱路线 `AAAAAWWWAWWSSSS`。actual23：`SDXASDDDAAAAAWWWAWWSSSS`，fork0 free3,1 faceD，fork1 holder1,3 faceS；三箱4,2 /3,3 /4,3原位，key未取、LOCK未开，全部门闭。
- owner 再正常 undo1 到22核占门，holder1,4占ID1左门；两个按钮均空时，仅1,4 `blockable=false`，同ID另一4,1 `true`。随后S恢复23。累计12 undo、0 retry。确认局部占门，不推广同ID整组保持开。
- 最新读主 JSON event32：23有效输入、time23、`completed=false`、暂停菜单准备返回。保留 attempted。

## 有限模型与局部候选

脚本：`scratch/ch4-10-readonly.cjs`。只模拟已知普通移动、左转 fallback、同向多箱链、接收者装箱、资源拾取、单门占位和钥匙开锁；尚无 X 或世界线冲突模拟。

从 actual23 普通有限模型找到9尾 `WSSSSAWWA`：

| 尾长度 | 玩家 | 箱子 | 说明 |
|---|---|---|---|
| 5 `WSSSS` | free6,1 /holder3,2 | 三箱原位 | free短压button0 |
| 8 `WSSSSAWW` | free5,3 /holder2,4 | 三箱原位 | 两人同奇偶 |
| 9 `WSSSSAWWA` | free4,3 /cargo2,3 fork1 | cargo2,3 /empty3,3 /empty4,2 | free推两箱链向左，holder撞闭1,4门转S到2,3，被最前箱捕获 |

该9尾仅模型，owner未执行。搜索1158展开、1890 seen。偶数箱链使同奇偶两外人也可捕获，不能把单箱捕获奇偶约束推广至多箱。

取钥匙有限搜索：从actual8同人fork+key 20,000展开未命中；从actual23允许叉与钥匙分人30,000展开未命中。这些都不是无解证明。

恢复箱策略暂排除x1、y1、6,2刺和3,6死角箱；额外 `safe` 模式排除空箱入刺。该safe域中key20,000和等待20,000未命中，只能说明此受限范围。未扩大盲搜。

曾找到 `WDWW` 或safe14尾 `WDASSSWSASWWWW` 的 holder2,4 +BOX2,3邻接构型，但**这不等于完全等待**：BOX2,3仍能向S推2,2，不能把邻箱当阻挡。已向owner/root纠正，未实测此假等待。新wait谓词直接调用step检查一人原地、另一人移动，而不是按邻接判断。

## 尚未解决的完整解约束

- 普通两free同奇偶、都移动时，button6,1与gate3,4 /4,5均奇坐标，首次同步人按button0及另一人进门受奇偶限制。载箱等待或真实四面受阻可改变框架，但目前尚无可恢复正前置。
- holder6,1若普通W会进入6,2刺死亡，不能把临时按钮人视为无限静止。
- 原BOX4,2可暂下送5,1→6,1永久压button0，但row0全墙使普通BOX无法从row1北抬。横推回5,1不等于回收至上部；因此该短取key构型不是四箱终点解。
- 普通目标尾的一个充分构型：四箱竖链7,3 /7,4 /7,5 /7,6，最前两箱有活cargo，外推者7,2，WWW后cargo占7,8 /7,9、推者死7,5。此为几何分析，尚未模型或实测完整前置。
- 左侧箱送7,3后，外人可由5,3→5,2→5,1→6,1→7,1→7,2回到箱下，避6,2刺；所以右段单外人可逐个布链，不应套4-9横廊封死结论。
- cargo4,3链推入刺4,4后X可以回收空刺箱的思路仍需gate4,5打开且保全部四箱可运。不能依赖不可回收底行按钮箱而声称完成。

owner选择正常返回，保留4-10 attempted并推进4-11。本 helper 收束4-10搜索、保留上述局部范围与未验证候选。
