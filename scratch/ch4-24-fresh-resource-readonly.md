# 4-24 新同步Fork1资源与双门分叶：实际62完成

2026-10-04，SaveSlot1。只读助手 `/root/ch3_37_cargo_revisit_oct03`；唯一输入owner `/root/ch4_1_readonly`。只读主JSON/solutions/公开scratch模型，无游戏输入、提示/攻略/隐藏实现（尤其未读plugin/ThetaBridge.cs）、存档/canonical/主JSON改写。

**CLOSED：owner 已正常实测完整62输入完成；本助手独立只读主JSON核验 completed=true。** 新资源方式先把单持叉头送到9,9，再在8,9同时生出两个F1，让下头8,7与上头6,9以相同三代延迟同步到5,7/4,8。无需Fork2、同源求和或新增外人。没有重新运行模型/BFS，无live handle。下文原候选与条件仲裁保留为历史，不再表示尚待实测。

## 实际闭环证明（2026-10-04追加）

主 `artifacts/slot1-playthrough/4-24.json` 的 `run.action_count=62`、`run.completed=true` 与 `completion.level.completed=true`；实际完整串为：

```text
SDDSDDDDAAWWWXWSDDDDDDDSDDWSAAWDSDWAXDXXAXXXXXXAAAAAXSSSTWWWWW
```

实际新47=`events[84]`，52=`[86]`，53=`[88..90]`。53单X真的形成两叶：axis0 Blue70[4,6]独占下Button，Gate64[1,2]/ID0 open、Gate65[1,8]/ID1 closed；axis1 Blue70[3,7]独占上Button，两门状态相反。各叶outside89[1,4]仍活F0/uncontained，cargo旁观4,9保留。因此本文原来的下按钮配对与同源冲突child处理边界已在这次实际53闭合，不再仅条件仲裁。

先axis0 `SSS` 到Goal1,1/time56（events[92]），再T到axis1，`WWWWW` 到Goal1,9/time58。events[96..101]与completion直接实证完成，两叶各一活outside89/ghost0/F0；下叶time56、上叶time58，最终当前时间足以覆盖下叶从56开始的Goal占位。不需要末T或下叶额外2S。

SaveSlot1 `snap=3/record62`、关数117/星6由root独立核验；本助手未读取或修改存档。root的 `artifacts/knowledge-audits/20261004T153119795989Z.json` recorded117/save117/issues[] 是父agent报告的交叉证明。下列固定模型仍保留其原先显式仲裁方式，不能把它称为独立游戏引擎。

## 以下为原模型候选与历史范围

## 初态、历史42与实证门配对

真实initial runtime snap/size10,10。P89[1,5]F0/S，C4 BOX88[4,4]、Color1 BOX87[5,4]、Blue70[4,7]，16 Fork，首7,3，上层4,8/9及5..9,7/9等。Goal68[1,1]/69[1,9]，BUTTONGATE64[1,2]/ID0、65[1,8]/ID1；Button66[4,6]/67[3,7]。唯一裸SPIKE9,5；无ICE/Lock/Prism。Wall实体优先，2,1..3及2,5..9为Wall，左列只有1,4↔2,4横路。上蛇道不能从3,7横穿2,7 Wall到左列。

直接核主 `artifacts/slot1-playthrough/4-24.json`：

- `events[29]`真实35：Color1 BOX87/cargo91[9,6]F1/W/ghost0/contained，C4empty88[9,5]，outside89[9,4]F0/W，Blue4,7原位。
- `events[43]`及后续稳定49真实历史42：Blue70[3,7]独占Button67，Gate1,8/ID1已open；Gate1,2/ID0仍closed。实际42 outside89[8,4]F0活，唯一Fork1 cargo109[6,9]；Fork4,8/4,9/5,9仍active。该42是旧 `35+XXAXXXX` 分布，与本候选新42不同。
- **4,6→ID0还没有单按钮实证**。候选利用唯一余Button/Gate一对一配对假设；必须在新53的S胜叶实际观察Gate0，不能拿模型当已证。

本文从历史35选择不同首次X，需未来正常重建35，不把当前4-22 owner现场当4-24可undo源。主旧42已经normalreturn，不从计划虚报新实际。

## 完整新47与52前缀（模型）

已实测35部分：

```text
SDDSDDDDAAWWWXWSDDDDDDDSDDWSAAWDSDW
```

接12新输入：

```text
AXDXXAXXXXXX
```

全47：

```text
SDDSDDDDAAWWWXWSDDDDDDDSDDWSAAWDSDWAXDXXAXXXXXX
```

固定模型的资源检查点（F0载箱均保留，未列全部）：

|总输入|当步|Fork1载箱位置/face|outside F0位置|关键收益|
|---|---|---|---|---|
|35已实测|W|9,6/W|9,4|Color1前端保护拾9,6叉，C4rear9,5。|
|36|A|9,6/A|8,4|安全设face，避唯一裸刺。|
|37|X|9,7/A|8,4|南child9,5F0推C4→9,4；北child9,7拾叉F1。与旧37有区别。|
|38|D|9,7/D|7,4|outside右侧C4/Wall阻挡，W侧8,5Wall，fallback A到7,4；cargo按global D。|
|39|X|9,8/D|7,4|北child取9,8叉；南9,6F0。|
|40|X|9,9/D|7,4|北child取9,9叉；南9,7F0。|
|41|A|9,9/A|6,4|安全设face。|
|42|X|8,9/A|6,4|北9,10Wall，前8,9取叉；南9,8F0。|
|43|X|8,8与7,9/A|6,4|两有效出生均有新叉，各F1。|
|44|X|8,7与6,9/A|6,4|低头南8,7取叉、高头前6,9取叉；另低头8,9F0。|
|45|X|7,7与5,9/A|6,4|两头各沿未取叉前进。|
|46|X|6,7与4,9/A|6,4|两头继续；额外8,8F0保留。|
|47|X|5,7与4,8/A|6,4|两个F1同步，Blue仍4,7；所有地图Fork已inactive。|

本新35→47过程中没有异源叠体、同源出生重叠/融合、occupied吞人或Ghost依赖。Color1 cargoX主动复制已有真实36/37标签实证；几何每一步仍需正常实测。复算模型用origin87同源标签，不预测新运行ID。

47后5A让outside沿6,4→5,4→4,4→3,4→2,4→1,4，全程安全，载箱只改faceA、不移动。lower原两箱已运到9,4/9,5，所以横路无BOX障碍。全52：

```text
SDDSDDDDAAWWWXWSDDDDDDDSDDWSAAWDSDWAXDXXAXXXXXXAAAAA
```

52精确资源：charged Color1 cargo5,7F1/A及4,8F1/A；Blue4,7；outside1,4F0/A；C4empty9,4；Color1 F0 cargo9,5/9,6/9,7/9,8/8,8/8,9。全部ghost0、非叠体。

## 53单X：一个独立Blue目标的正交推力（未实测）

|parent|出生与阻挡|推力|
|---|---|---|
|5,7F1/A|side5,6/5,8真Wall；front4,7可推Blue→3,7|A；child拟4,7F0|
|4,8F1/A|side S4,7可推Blue→4,6；N4,9有效但叉已取|S；冲突child拟4,7F0，旁观child4,9F0|
|outside1,4F0|不响应X|候选继承每叶|

只一个target Blue70收到A/S，不能套同链三箱独立组合。按已证M120/M127逻辑组件输家masked、旁观者继承的仲裁，显式构造两个叶：A胜Blue3,7/Button67、S胜Blue4,6/Button66；各winner cargo4,7F0、旁观cargo4,9F0、outside1,4活，其他F0 body保留，各10个活物理BOX。

**这里仍有具体实际判别边界**：两个冲突child来自同一Color1 origin，且都拟出生4,7。新53是否先按force分叶再处理出生/同源融合，不能仅凭M107/M126或不同origin的M127推定。私有脚本只是显式A/S仲裁条件重放，没有读游戏算法或宣称真实已有两线；单X必须观察完整axis、masked、container/height、Blue落点与两Gate状态。如果实际同源融合优先而没有分线，不能拿两种手工叶计完成。

## 两Goal尾与时间投影

确认单X实际两叶和按钮配对之后：

- Blue3,7的A胜叶：ID1配对已实证，outside1,4接5W，逐1,5/6/7/8/9，最后Goal1,9/time58。
- Blue4,6的S胜叶：仅在实际ID0 open时，接3S到Goal1,1/time56；若另一叶已经time58，必须再2S，使1,1→1,2→1,1，最终time58。

较早线切换会将其他线投影回当时历史；不能只把不同时刻的最终pos做union信用。安全统一尾为A叶5W、S叶5S，两叶都time58，mask2|mask1=3。门所压body不移动，无裸SPIKE或新分裂。上叶先则53+5W+T+5S=64有效输入；下叶先可3S+T+5W=62，末time58晚于另Goal开始time56。T用实际numeric axis判别，不提前猜数组或叶顺序；最终是否自动完成仍等游戏实证。

## 最小正常实际区分与复算

未来正常回访，先重建已实测35；首新增 `AX` 核37 cargo9,7F1+9,5F0/C4empty9,4/outside8,4，再 `DXXA` 核41单头9,9F1/outside6,4，再6X核47同步5,7/4,8F1。5A到左列1,4后单X53核真正分线/同源融合顺序及4,6→ID0。只有这些匹配后才走对应普通Goal尾；无需为了弱片段打断当前4-22。

私有复算：

```text
D:/nodejs/node.exe scratch/ch4-24-fresh-resource-readonly.cjs
```

先按公开base固定重放全52，再用独立写出的墙/链出生谓词核单Blue A/S，显式仲裁两条件叶，复用base逐步ordinary尾。**整体不是独立引擎**。输出status=fixed-model-positive-await-actual，searchStarted=false/liveHandle=null；程序同步结束无后台进程，无BFS/cap扩张，也没重跑旧4-22/overlay。实际只有35/旧42历史，当前新36..53及两Goal尾都仍模型候选。
