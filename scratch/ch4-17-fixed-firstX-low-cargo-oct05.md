# 4-17 固定首次X：低位持叉cargo资源

2026-10-05，**ACTUAL25/29 VERIFIED，关卡仍未完成**。唯一输入owner `/root/ch4_1_readonly`；本助手没有游戏输入权限。只读取公开initial、知识库和公开scratch几何，不读提示、隐藏实现、反射dump或存档，不修改主JSON/canonical。

新实证：主JSON `events[36]`/frame14630093为实际25，BOX55/cargo57=2,3/F1/D/ghost0、Blue56=3,3、outside62=4,3/F1/A。`events[44]`/frame14641052为实际29，BOX55/cargo57=2,2、BOX63/cargo64=2,4，均F0/A/contained1/ghost0；Blue56=3,3，free62=6,3/free65=4,3均F0/S/ghost0，四活、单叶66/time29。root另以正常MCP独立核实。以下“MODEL/待实测”为最初候选阶段的历史标签；25/29已真实吻合，31仍只模型历史源。

本轮首次新的Fork1低capture正例：

`SDDDDWAXDWAWSWAWSDSAWWSAA`（25输入）

模型25：Color4 cargo/初BOX55在2,3，Fork1/faceD/ghost0；emptyBlue56在3,3；outside在4,3，Fork1/faceA。全程两叉预算保持，两活角色。旧四free19的相似捕获几何不作为此Fork1资源的实证。

## 来源与限定域

- 真实地图来自 `artifacts/slot1-playthrough/4-17.json` initial，runtime floating；初P2,4，C4=3,4、Blue=5,4，两Fork2,3/6,3。
- 首5 `SDDDD` 正常取双叉已由旧实际证；本任务固定公共模型源 `SDDDDWAX`（8），没有把MODEL8写为新的actual8。
- 6W到6,4；7A因5,4蓝箱背4,4Wall不能向左推，fallbackS到6,3/F2/S；8X得到两free7,3/5,3，各F1/S，两空箱不动。两Fork均已拾取。
- 只从这个固定8出发做普通WASD。保两个Fork1活演员，首capture限定y3/4；优先C4=2,3、emptyBlue3,3、outside4,3。
- 拒绝新Ghost、force、stack和已占cargo再capture，不传播任何这些边界。允许箱row3及x1/row1，没有套旧禁止底行的剪枝。
- 没有重启actual5全首次X5000域，也没有跑actual9四F0图。模型使用公开Wall/Floor优先顺序；无ICE，新路径不经过上方Lock/缺Floor区域。

## 唯一一次定向搜索

cap4000/depth35；恰本固定8的新ordinary启发域。首次精确低capture正例即停，未追加cap。

| 项目 | 数值 |
|---|---:|
| expanded | 193 |
| seen（最短已见状态） | 373 |
| heapPending | 189 |
| stale popped | 3 |
| depthCut | 0 |

heap带改进路径的重复项，pending不能简单用seen减expanded。未穷尽，未触cap；无进程/session handle，`liveHandle=null`。启发搜索不保证17尾或25全串最短。拒绝force2、stack1；没有传播。capture计数2含命中串的固定重放，不当作两个不同首次capture事件。

后续范围修正：ordinary helper对两free同格曾暂按max合Fork；F1+F1→max1尚未实际确认，旧M025的0+1不能区分max/求和。此193域要求两个Fork1演员，合成单free的15转移均因actor库存减少而拒绝；不能据此排除可能的单Fork2融合资源。**完整25正串无free同格融合**，因此该未证假设不影响此正前缀。29各出生点也不同。owner将正常实测另一个短融合探针；本助手不因假max追加新搜索。

上述“未实际确认”为当时历史边界，现已更新：主JSON events50/52中两free F1+F1合一只保Fork1，不相加；正常undo3回固定8见events54。这里只确认本次1+1→1，不自行推广任意高Fork合并公式。193图不重跑。

首次force窗口：固定8+`DWAWSA`，空Blue5,3同时受5,4角色S推和6,3角色A推。首次stack窗口：固定8+`WWAWW`，C43,4与Blue4,5同帧移到3,5。它们都只记边界，不作为本正例路径，未请求owner追加实测。

## 25输入检查点

8后17普通尾：`DWAWSWAWSDSAWWSAA`。以下均MODEL，F1一直保留。

| 全输入号/动作 | C4 | Blue | 两free（位置/face） |
|---|---|---|---|
| 8 X | 3,4空 | 5,4空 | 7,3/S；5,3/S |
| 9 D | 3,4空 | 5,4空 | 7,4/W；6,3/D |
| 10 W | 3,4空 | 5,4空 | 7,5/W；6,4/W |
| 11 A | 3,4空 | 5,4空 | 6,5/A；6,3/S |
| 12 W | 3,4空 | 5,4空 | 5,5/A；6,4/W |
| 13 S | 3,4空 | **5,3空** | 5,4/S；6,3/S |
| 14 W | 3,4空 | 5,3空 | 5,5/W；6,4/W |
| 15 A | 3,4空 | 5,3空 | 4,5/A；5,4/A |
| 16 W | 3,4空 | 5,3空 | 3,5/A；5,5/W |
| 17 S | **3,3空** | 5,3空 | 3,4/S；5,4/S |
| 18 D | 3,3空 | 5,3空 | 3,5/W；6,4/D |
| 19 S | 3,3空 | 5,3空 | 3,4/S；6,3/S |
| 20 A | 3,3空 | **4,3空** | 2,4/A；5,3/A |
| 21 W | 3,3空 | 4,3空 | 2,5/W；5,4/W |
| 22 W | 3,3空 | 4,3空 | 1,5/A；5,5/W |
| 23 S | 3,3空 | 4,3空 | 1,4/S；5,4/S |
| 24 A | 3,3空 | 4,3空 | **1,3/S；5,3/S** |
| 25 A | **2,3 cargoF1/D** | **3,3空** | outside **4,3/A** F1 |

25的物理：右free5,3向A推动Blue4,3+C43,3双链，各到3,3/2,3；左free1,3的A撞0,3Wall、S撞1,2Wall，转D进入原本空2,3，被同帧到达的C4捕获。捕获者保自己的fallback faceD。该步不涉及裸SPIKE、旧箱格腾空或强行同源合并。

固定交叉检查：公开旧 `ch4-17-readonly.cjs` 的 `replay` 重放完整25，私有普通step重放8后17，均valid，25完整state逐字段相同。两者使用同一公开几何，不声称两套独立物理引擎。

## Owner较短29源：25+DWAX

只固定复算，未另开搜索。

| 输入 | 外人 | cargo2,3 | 备注 |
|---|---|---|---|
| 26 D | 5,3/F1/D | F1/D | 空Blue仍3,3 |
| 27 W | 5,4/F1/W | F1/W | 无推箱 |
| 28 A | 5,3/F1/**S** | F1/**A** | 左4,4Wall，外人fallbackS；cargo面等于全局A |
| 29 X | free **6,3/4,3 F0/S** | cargo **2,2/2,4 F0/A** | C4两子箱，emptyBlue3,3，四活ghost0 |

完整29：`SDDDDWAXDWAWSWAWSDSAWWSAADWAX`。

cargo面A的两侧S/N都有效；2,2是SPIKE，但载箱保护。外人面S的两侧D/A落6,3/4,3安全；没有同格出生、捕获、force或stack。不把预期四活当已实际验证，也不算六Goal完成。

## 保留31源：25+DWWADX

本助手原先固定较高外人源仍保留：25+`DWWAD`使外人依次5,3→5,4→5,5→4,5→5,5，最终F1/D；cargo仍2,3/F1/D，Blue3,3不动。

31的X：cargo2,4/2,2 F0/D；外free5,4/6,5 F0/D；emptyBlue3,3。因为5,6真Wall，外人D面北侧失败，南侧5,4有效，再以前方6,5补第二支。两cargo不碰Blue，也不互相合并，四活无Ghost；没有key/Lock/Collection11前置。

完整31：`SDDDDWAXDWAWSWAWSDSAWWSAADWWADX`。

29只需4尾输入，比31的6尾更短，外人位于row3；31作为不同普通运输库存历史保留。后续六Goal运输未在本轮搜索，不宣称29/31能直接完成。

## 可复核范围

私有文件 `scratch/ch4-17-fixed-firstX-low-cargo-oct05.cjs` 支持对固定8后的普通串复算；`secondX`只用于上述固定已知出生几何，不作为搜索边。真实新角色/容器ID须由owner实际帧分配，本文使用初箱origin55/56，不臆写新ID。

本轮193图已结束，25/29已由owner正常实测吻合；31仍待验证且未建议替换29。本文助手未发任何游戏输入。完成状态、星、关卡进度与主JSON由唯一owner依据实际帧同步。
