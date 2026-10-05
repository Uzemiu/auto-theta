# 2-G 新60后安全C分线：actual87 两稳轴已验证（2026-10-05，只读审计）

当前结论：从真实event259/frame18255298/time81的新60源，完整27尾 `DWWDAASDSASSSSSSAWWWWWWWWDW` 已由唯一输入 owner 正常实测到 actual87/event295/frame18640694：两稳轴均 time135，所有 md0/src-1。actual axis0 是106/A胜，只有108这一左控制者活；actual axis1是109/W胜，108与109两左控制者活；right105两轴都活。两轴九箱全保，completed=false；这是已验证的安全C资源，不是四Goal全解。owner及root完整14实体公开字典比对除新轴GMID分配外diff=[]；本助手固定动态properties审计也全match。原手抄28字符串在第7步后多加S，已撤回且未执行；直接读取checkpoint raw27、逐parent全部字段重放，firstMismatch=null。旧M131和M132模型单独固定这条27也有效且同2/1left，所以该路线不依赖新增M133几何假设。

分组由原始27串确认：`DWWD | AASD | SASS | SSSS | AWWW | WWWW | WDW`。末段先`WD`到总86（尾26，真实time128），再唯一`W`到总87（尾27，两轴真实time135）。模型microtick计数不授游戏time。

私有固定脚本 `ch2-G-m133-retained-left-force-probe-oct05.cjs` 输出各检查点、最后输入全部微拍/request、每叶PLAYER/BOX具体IDs。`ch2-G-m133-hit-path-audit-oct05.cjs`已在原737611 checkpoint固定核验原始字符串、26条parent edges与最终force，全match。零游戏输入、零canonical/存档/主JSON写入。

## 稳定检查点

除107在8,4刺死，以下三左都活F0/ghost0/mask0/uncontained/h1；每稳定点md0/src-1。九BOX全Color2/empty/h1/活。

| 尾步 / 总输入 | 前缀 | 106 | 108 | 109 | right105 |
| --- | --- | --- | --- | --- | --- |
| 4 /64 | DWWD | 12,9/D | 6,7/D | 3,9/D | 14,10/W |
| 8 /68 | DWWDAASD | 11,8/D | 5,2/W | 2,2/W | 14,8/W |
| 12 /72 | DWWDAASDSASS | 10,5/S | 5,2/W | 2,2/W | 14,4/S |
| 16 /76 | DWWDAASDSASSSSSS | 11,2/S | 5,2/W | 2,2/W | 14,4/S |
| 20 /80 | DWWDAASDSASSSSSSAWWW | 12,5/W | 4,1/S | 1,1/S | 14,8/W |
| 24 /84 | DWWDAASDSASSSSSSAWWWWWWW | 12,9/W | 4,1/S | 1,1/S | 14,10/W |
| 25 /85 | DWWDAASDSASSSSSSAWWWWWWWW | 12,10/W | 4,2/W | 1,2/W | 14,9/S |
| 26 /86 | DWWDAASDSASSSSSSAWWWWWWWWD | 11,10/A | 5,2/D | 2,2/D | 14,10/W |

pre86九箱：110[8,9]、111[8,5]、112[5,7]、113[2,9]、114[2,10]、115[8,10]、116[8,7]、117[7,7]、118[5,10]。关键C方向后盒113[2,9]给109保安全推位，和原81裸入2,10刺死不同。

## 末W来源与两叶

tick0：106向W受11,11Wall后转A至10,10/ICE；108/109沿W从5/2,2上滑，right105从14,10反弹至14,9/S并停止。

tick2：106推115进入7,10后自己到8,10SPIKE死亡，115保106惯性向A。tick4，115撞118，后者继承106/A；108推112从5,7→5,8，自己停5,7安全。tick5：109到2,8/W/src109；118到3,10/A/src106；1132,9/1142,10仍停，1125,9/W/src108，1155,10停。

tick6：109的W请求作用于113+114竖链，106惯性118的A请求作用于118+114横链，在共同BOX114[2,10]发生W/A force。M131按来源mask，不以匿名惯性by=-1授叶。

- W/109胜：106 ghost死体被masked1，106的所有在途箱运动取消；109推113→2,10、114→2,11，自己留安全2,9/W。旁观108仍5,7/W活。112→5,10与115→5,11由108来源移动，118停3,10。九箱全保。
- A/106胜：109在2,8/W被masked1/inactive/ghost0；106仍原8,10/A刺死/ghost1/mask0。118→2,10、114→1,10；113停2,9，旁观1085,7活。112/115同上仍由108来源移动。九箱全保。

两叶105都14,9/S活，最终全部BOX md0/src-1。第一叶仅证明有两名可继续操作者，第二叶仅一名；尚没有四叶/四Goal完整路径，不把它当全解。要两叶后各继续分线，更强候选需两初叶均至少两left，或首次四兼容叶。

## 同frontier后续

真实69831在737611expanded/seen1021855/pending326678/maxDepth37/depthCut0命中此资源并保存后exit0。root授权提高目标，1311从同checkpoint恢复，原hit及所有来源/状态/force保存历史；命中父的剩余A/S/D动作补回，pending仅326678→326679，q1083871/done737611/seen不变，未重建根或遗弃待展开动作。目标改为所有初叶均≥2left或≥4leaf，排序仍资源罚项12，沿同frontier收到CONTINUE900000。这是计算继续，不授实机完成。

## Actual87 闭环及复原源

主日志 events287..292 是实际末 W 的 time129..134 每拍；event293/time135 初次两稳轴，294/295继续稳定。本助手 `--actual` 输出12个帧/轴记录全部匹配，检查每个公开 PLAYER/active BOX properties 键以及 ID、坐标、active。静态 type/class/details/animation 本助手动态引擎没有建模；owner 的 `ch2-G-c87-actual-audit-oct05.cjs` 与root另作完整字典校验，唯一排除项是新轴GMID分配447..460（原源102..115）。

actual axis0/A：105[14,9]/S、108[5,7]/W活；109[2,8]/W masked1 inactive/ghost0，106[8,10]/A ghost1 inactive/mask0。axis1/W：105[14,9]/S、108[5,7]/W、109[2,9]/W活；106[8,10]/A masked1/ghost1 inactive。两轴107都[8,4]刺死；全部稳定移动来源清零。

共用BOX位置：110[8,9]、111[8,5]、112[5,10]、115[5,11]、116[8,7]、117[7,7]。axis0其余113[2,9]、114[1,10]、118[2,10]；axis1其余113[2,10]、114[2,11]、118[3,10]。九箱全active/h1/uncontained；两轴没有货物角色。

随后owner按root授权正常Undo27，真实source60 event350/frame18760837/time81，与259/173/131全部14实体整个字典含GMID/animation diff=[]，累计93Undo/0retry。旧87及动画全部保留；本助手无游戏输入。
