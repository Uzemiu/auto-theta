# 5-7「银河」光学、双箱与门缓冲（只读，2026-10-06）

公开源：`artifacts/slot1-playthrough/5-7.json` events0/frame3969233、runtime `scroller`、size[14,10]、min[0,0]、time0、单叶77。P76[4,2]/S/F0/key0/ghost0/free。无ICE/DARK。本文不输入游戏，不使用提示、隐藏实现、反射或存档修改，仅创建此MD；primary独占新动态域。

## 最新实际源与已撤销的Shadow运输设想

初始Fork60[11,3]、Shadow75[11,2]。owner实际`SDDDDDDDW`到9，主event9/10/frame4063758：75[11,3] **inactive**，仍Shadow=true、Color1、pushable/blockable=true、mask0、contained0/container-1/height1；KEY60仍active，P76[11,2]/W/F0活。root独立4075489已核同态。

再W10，event12/frame4077043：P76[11,3]/W/F1，KEY60 inactive；75仍inactive。不能再把75当active可搬箱去压Button，本文已停止row6运输设想，不建议重建死影箱。

随后正常14方向 `SSAAAAAAAAAWWW`，**actual24/event20/frame4099474**：P76[2,4]/W/F1，Gate2,5仍closed；两C4仍58[2,7]/59[2,6]，75inactive、Fork已拾。

**最新actual25/event22/23/frame4157322**：唯一singleX实际只生成P76[1,4]/W/F0、active/ghost0/free；Gate2,5此后open，未生成门内child。所以本文DWD/WWW的门内前置**没有成立，不能从当前25执行**。已及时通知root/owner/primary，无下一输入建议，不让唯一活人W裸踩1,5。

9/10/24中Pri62与63均traversed=true/testCompleted=false；x13的十Pri仍traversed=false/testCompleted=false。与M144相同，不能用远处relay.traversed=false否认已发生的影箱去活，但也不能把这些光学标记推成已完成。

## 原图与边界字段

```
       x=012345678901234
y10      #############R#
y9       #R^^^........R#
y8       #R^^^........R#
y7       #.B##........R#
y6       ##B##........R#
y5       #^g##...^^...R#
y4       #b.##...^^...R#
y3       #^.##...^^.K.R#
y2       #...P...^^.B..#
y1       #............R#
y0       #############R#
```

Goal57[1,9]与Pri63同格；Pri62[1,8]；Button74[1,4]、Gate61[2,5]/ID0。58/59为active普通Color4空BOX、height1、Shadow=false，无cargo。62/63及十个边界Pri均active、pushable/blockable=true、Color1/Shadow=false、height1，无cargo；lighten=false。

**x13实际只有10棱镜，缺13,2**。按y递增分别：64[13,0]、70[13,1]、66[13,3]、65[13,4]、72[13,5]、73[13,6]、67[13,7]、68[13,8]、71[13,9]、69[13,10]。13,2是普通Floor，不能补造第11棱镜或把它当墙。

13,0/13,10的底层tiles是SPIKE；0,1/14,1也有SPIKE但同时有Wall，不能把Wall覆盖的刺格当裸可走地面。完整SPIKE另有1,3/1,5、2/3/4,8..9、3,7，以及8/9,2..5。3,7同时Wall，终局转向时先受Wall阻挡。

普通地图size+1环绕在M015有其他关实际证据，但本关边界Pri列不自动证明**玩家环绕、光学环绕、整列推动或任何新维度成就**。本文终局截断该列光路，无需使用这些假设。

## 两个邻箱可切断大型光路

GoalPri63[1,9]：北1,10与西0,9为Wall；东2,9为SPIKE但有Floor，南1,8为Pri62。Pri62[1,8]：西0,8为Wall，北63，东2,8为SPIKE，南1,7安全Floor。相邻Pri62不会像普通BOX一样关闭63南轴（M053及3-23反例），不能只让人站1,7就假定全部其它分支已封。

两个东支当前分别沿row9/8经过SPIKE2..4、普通5..12到边界Pri71/68；该连通可扩散到x13其他行，不能只数Goal一条射线。M054明确邻箱与远处挡箱有区别。

很小的**条件终端fixture**为：

- 58[2,9]紧邻63，关闭Goal东轴。
- 59[2,8]紧邻62，关闭relay东轴。
- active/ghost0的free[1,7]满足62南轴。

这样63北/西为Wall，东为邻箱，只需经62观察南方向；62西为Wall、东为邻箱、北连接63、南有活人。这是M053/M054/M145支持的固定网络条件，仍须实际testCompleted和completed验收。x13大网络被两个邻箱截断，不需边界环绕。

## 原双箱的安全推进与回收界限

若某活free已经合法在Gate2,5，原双箱2,6/2,7仍保真：

1. W把59→2,7、58→SPIKE2,8；推者停安全2,6。
2. W把59→SPIKE2,8、58→SPIKE2,9；推者停安全2,7。
3. 再W，前箱背2,10Wall不能推；动作转A到安全1,7，满足南观察轴。

即门内单free的条件尾 **`WWW`**；同样也可用`WWA`显式指定最后观察位。最终两个邻箱是封轴终端，不能当还可自由回收的临时摆箱。2列的右侧3,6/3,7为Wall，顶箱南推者2,10为Wall，侧向回收的推者3,8/3,9为SPIKE或左Pri，因此这里没有普通裸人安全回收尾。

**如果另一个free仍在Button1,4，不能盲接共享WWW**：它首W会进SPIKE1,5。门内角色安全不等于所有角色安全。

## 实际singleX阴性与未执行的DWD条件尾

actual24 P[2,4]/W/F1，左生位置1,4 Button安全；右生3,4是Wall；改前位置2,5是**原闭Gate**。是否左生踩钮能同刻使前生穿Gate原是未知；actual25已校准为**本fixture没有前生，只有Button上的一人**。这只证明本次X时序结果，不推广所有分裂/门/实体更新顺序。

singleX后应核PLAYER数量、坐标、Fork、活性、Gate字段。本次实际**只生Button1,4一个F0角色**，需停止该条件尾；不得让该唯一活人W裸踩1,5地刺。普通D只会从Button移到2,4，不等于已经进门，后续Gate关闭/转回Button要看实际，不提出盲过门串。

若X实际同时生成两个active/ghost0/free/F0在**Button1,4与Gate2,5**，局部手工短尾 **`DWD`** 可在两个门更新分支下都保活：

|输入|原Button角色|原Gate角色|两箱|
|---|---|---|---|
|D|1,4→2,4|D遇3,5Wall，改W推双箱；停2,6|59[2,7]、58[2,8]|
|W|若门闭，2,4转A回Button1,4；若门仍开，则到Gate2,5|再推双箱，停2,7|59[2,8]、58[2,9]|
|D|由Button到2,4，或由Gate因3,5Wall转W到2,6；都安全|D遇3,7Wall；W推链背2,10Wall失败；改A到1,7|不变|

这不是假定Gate永开：首D后Button/Gate皆空，正常可能关闭；第二W外人回Button又可开启。即使首D后暂时保持门开，外人在门中续占，末态只是2,6而非2,4，内观察位和两邻箱不变。实际每步都必须核两PLAYER/两箱/Gate；不能把这个门更新分支枚举当实现证据。

另一个旧局部fixture是两个free预先[1,4]/[2,4]、门已开时的`DWWW`接替占门；但它相邻两人的相对奇偶与正常Fork两子不同，没有可达前置，已让位给当前24/X的同相两child条件，不能建议owner去造旧fixture。

## 范围与实测界限

无新BFS、没有重跑primary的20k域。只核公开地形/字段、两箱3步手工尾，以及DWD的两种Gate更新分支各3步；合计6步局部模型回放，玩家均未进入SPIKE，无捕获、争推、堆箱或环绕。实际24/X已经是上述单Button阴性；新的门内前置和终局结果由owner与primary校准，本文所有完成表述均为条件。

禁止把inactive75继续当普通运输资源、把边界缺口补Pri、把traversed=true当完成，或把只生Button一人时的裸W当探针。此文件只供局部布局与实际验收使用，不写主KB/进度，不创建额外JSON/CJS，无后台handle。
