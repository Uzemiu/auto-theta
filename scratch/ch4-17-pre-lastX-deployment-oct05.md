# 4-17：actual25之后、最后X之前的低目标运输

2026-10-05，**固定MODEL47/49/51正例；尚未实测，不是六Goal解。** source25与owner短尾29已实际验证。唯一输入owner `/root/ch4_1_readonly`，本助手严格只读，不发游戏输入，不写save、canonical或主JSON，不读隐藏实现/反射/提示/攻略。

与owner的actual29 cap5000/depth40普通Goal尾、候选46普通兼容Goal尾独立。此轮只做一组从真实25出发的手构固定运输，**没有启动新搜索/队列**，无session/liveHandle；不复跑旧15/29/46图。

## Actual源

主 `4-17.json` events36/frame14630093：完整25 `SDDDDWAXDWAWSWAWSDSAWWSAA`，C4BOX55/cargo57=2,3/F1/D/contained1/ghost0，emptyBlue56=3,3，outside62=4,3/F1/A。两Fork已inactive，无普通key，两Lock上区未开。

私有 `ch4-17-pre-lastX-deployment-oct05.cjs` 直接读取这一公开帧转为抽象state，用已核公开普通step固定重放；不从尚未实际的31源开图。

## 25+22到47，保cargo与outside各Fork1

25后的22输入：`DWWAASASAWWDDDDSSAAWAS`。

全47：`SDDDDWAXDWAWSWAWSDSAWWSAADWWAASASAWWDDDDSSAAWAS`。

| 总输入号 | 检查点 | 库存 |
|---|---|---|
| 32 /7 A | outside到2,4 | cargo2,3/F1，Blue3,3 |
| 33 /8 S | cargo向下推到2,2SPIKE，outside停2,3 | cargo保护，未Ghost，仍F1；Blue3,3 |
| 43 /18 A | outside绕左上/右侧回4,3 | cargo2,2/F1，Blue3,3 |
| 44 /19 A | outside推Blue3,3→2,3，停3,3 | cargo仍2,2/F1 |
| 45 /20 W | outside3,4 | 3,4是真Floor，非Wall |
| 46 /21 A | outside2,4 | Blue2,3与cargo2,2竖向连排 |
| 47 /22 S | outside推双箱链后停2,3 | **cargo2,1/F1/S占Goal；Blue2,2；outside2,3/F1/S** |

全部普通固定重放valid，两演员始终活、Fork1/ghost0，无force/stack/占有cargo再capture。33载人箱落SPIKE由container保护，47由空Blue作缓冲使推者没有进入2,2SPIKE。

47恰实现root最初假设的Goal2,1 parentF1+Blue2,2+outside2,3/F1/S构型；已给合法完整前置，**不等于它已经实际部署**。

## 立即X不是保双Goal

47直接X，cargo2,1/S的右侧3,1Goal有效，左1,1与前2,0是Wall，只有一个活cargo迁到3,1/F0。outside2,3/S的两侧3,3/1,3有效，生两个F0free；Blue2,2不动。原2,1被腾空，所以只保3,1一个Goal、共3演员；不能把消耗前2,1的占位累计到新状态当双目标证据。

## 固定47+WXDS到51：双Goal成立，几何需修正

| 输入 | cargo | Blue | free |
|---|---|---|---|
| 48 W | 2,1/F1/W | 2,2 | 2,4/F1/W |
| 49 X | **3,1/2,2 F0/W** | **2,3** | **1,4/3,4 F0/W** |
| 50 D | 不移，仅faceD | 2,3 | 2,4/D；3,5/W |
| 51 S | **3,1/2,1 F0/S** | **2,2** | **2,3/3,4 F0/S** |

49 cargoW先侧3,1，再以前方2,2推动Blue到2,3并生另一个cargo2,2。outside2,4/W的两侧1,4、**3,4**都有效；3,4真实有Floor且无Wall，不应fallback到2,5。51上free3,5直接S到3,4，不应误当Wall转D到4,5。

51四演员全部活/ghost0，modelGoalMask34（按真实Goal顺序）=Goal2,1+3,1。Blue是空箱，无Goal身份。没有强行合并同源Box，49各出生/推动目标均不同格；51也无Ghost/force/stack。

全51：`SDDDDWAXDWAWSWAWSDSAWWSAADWWAASASAWWDDDDSSAAWASWXDS`。

## 51运输代价：三箱当前全部无安全普通推向

| Box | 精确普通限制 |
|---|---|
| cargo2,1 | 西目标1,1Wall；东推者1,1Wall；北推者2,0Wall；南目标2,0Wall |
| cargo3,1 | 东推者2,1被不可回收cargo占；西推者4,1SPIKE不供裸活人站；北推者3,0Wall；南目标3,0Wall |
| Blue2,2 | 西目的/东推者1,2Wall；北推者2,1已有cargo；南推双链前端2,0Wall |

因此51是两个实际可判别的下Goal资源条件，**不是三个可继续运输body**。其余下Goal5,1/6,1未覆盖，当前三箱不能供自由人普通回收或横渡SPIKE；两个free仍可在安全上区移动。这个局部限制只适用于本51库存/普通动作，不泛称4-17无解，不排除其它最后X部署、真实新机制、多叶或此前Fork保留域。

没有完整六Goal尾时不建议盲实测到这个运输受限终点。47仍持叉，固定WXDS提供明确出生/箱缓冲判别意义；完整Goal候选应由owner/root另审有持续运输能力的库存。

## 范围与复核

本任务只固定22运输、直接X对照以及WXDS；没有运行新的BFS，没有pending队列，不追加任何旧预算。raw实际证据与候选状态严格分开。脚本 `run()`会列47/48/49/51、Wall/Floor3,4以及51局部safe-pusher审计；使用同一公开基础几何，不能声称独立游戏物理实证。

owner另准备从真实8检查free F1+F1同格合叉是否max/求和；这个行为尚未实际证，不能把旧0+1融合推广为一般max。本文固定25→47→51没有free同格融合，不依赖它。本助手未启动任何以假max为前提的新prep队列。

```powershell
D:/nodejs/node.exe scratch/ch4-17-pre-lastX-deployment-oct05.cjs
```

该命令仅只读JSON与复算，不会搜索、调用游戏或写其他文件。
