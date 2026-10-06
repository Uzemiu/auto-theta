# 5-10「遮罩」公开静态布局审计（2026-10-06）

只读第二helper的静态几何报告。唯一输入owner为slot1_owner_oct06，primary负责动态/运输域；本文未发游戏输入、未跑动态图、未读游戏实现/UI-api或存档、未用提示，未输出额外JSON。本关runtime与公开实体按主journal为准，不由标题补造“遮罩”规则。

## 实际来源与资源

canonical `artifacts/slot1-playthrough/5-10.json`：fresh0 main0/frame5717560，size8,12/min0,0、65 entities/116 tiles；P61[3,2]/S/F0，Fork58[5,2]。双Shadow59[7,3]/60[4,9]均active、Color1、pushable/blockable=true、height1、mask0、contained0/container-1、movingdir0/src-1/ext0。没有普通C4箱、Lock或钥匙资源；58的isFork=true，不能把它当开锁钥匙。

actual2 main2/frame5759391是DD取叉；**actualX3 main4/frame5826750，DDX**：61[5,3]/D、新65[5,1]/D，均active/key0/ghost0/F0/free，58 inactive，双Shadow保持初位active。三Pri均traversed=true/lighten=false；62/63.testCompleted=false，仅64.testCompleted=true，level.completed=false。底Pri完成绝不等于Goal完成。

本读取还见actual6 main6/frame5843260、DDXAAA：61[2,3]/A、65[2,1]/A，双Shadow/Pri仍初位，完成字段仍只有64 true。它是已存在的公开历史观察，不是本文执行，也不把它假定为owner此刻现场。

随后公开actual10 main8/frame5846143、DDXAAAWWWW到61[2,7]/65[2,5]；actual11 main10/frame5850396再A到61[1,7]/65[2,4]，**三Pri testCompleted全部false、Goal未完成、双Shadow仍active**。1,7的Goal南观察已实际阴性，64的字段也离开true，不能把先前底Pri完成当永久累积观察。primary正从现场继续自己的安全路线，本文不要求Undo或重复11探针。

## 完整Wall/Floor与SPIKE覆盖

Goal54[1,8] active/floor=true/nonblocking；**tiles缺1,8**，须合并公开Goal.floor，不能误删它的地面。Pri62同格，active/pushable/blockable、height1、Shadow=false/Color1、mask0、无cargo。Gate55[2,8]与56[3,8]均ID0/TotalLength1，fresh与3/6均active/blockable=true，各自底下是SOLID Floor。Button57[7,9] active/floor=true，只有一个Button，Gate关联仍由actual验收。

Wall54个，完整按行/列归纳：

- 底y0的x0..8全Wall。
- 左x0的y1..7、y9..12 Wall，**唯独0,8没有Wall，且raw tile=SOLID**。
- 右x8的y1..12全Wall；8,8虽raw为SPIKE仍被Wall覆盖，不可裸进入。
- 左上x1/2/3各y9..12为Wall。
- 顶4,12/5,12为Wall；4/5,9..11有SOLID窄室。
- 内x6的y8..12为Wall；x7的y10..12为Wall。

raw SPIKE仅6,3/6,4/6,5/6,6/6,7、7,8、8,8。前六项无Wall遮盖，8,8被Wall盖；无ICE/DARK。Gate2,8/3,8闭时仍不可进入其底下Floor。

```
       x=012345678
y12      #########
y11      ####..###
y10      ####..###
y9       ####B.#b#
y8       .Rgg..#^#
y7       #.....^.#
y6       #.....^.#
y5       #R....^.#
y4       #.....^.#
y3       #....P^B#
y2       #.......#
y1       #R...P..#
y0       #########
```

图中PLAYER为实际3，Box均Shadow；真正推位仍以raw覆盖为准。特别0,8是孤立的公开地面推箱目的，不能把它补成边界Wall，也不假定它通往新维度/worldwrap。只推到0,8，不推动到缺Floor的-1,8。

## 三Pri网络的方向几何与未知光学

|Pri|北方向|南方向|西方向|东方向|
|---|---|---|---|---|
|62 Goal1,8|紧邻1,9 Wall|1,7/1,6 Floor后63[1,5]|0,8 SOLID，无Wall；再外侧无公开Floor|紧邻Gate2,8闭，后Gate3,8|
|63 relay1,5|1,6/1,7 Floor后62[1,8]|1,4/1,3/1,2 Floor后64[1,1]|紧邻0,5 Wall|2..5,5 Floor、6,5 SPIKE、7,5 Floor、8,5 Wall|
|64 bottom1,1|1,2..4 Floor后63[1,5]|紧邻1,0 Wall|紧邻0,1 Wall|2..7,1 Floor，8,1 Wall|

三者共享x1纵向，但不是23棱镜密排网络。actual3的65[5,1]位于64东轴，与64.testCompleted=true相容；它没有占62/63的独立东轴。三Pri traversed=true只说明公开访问标志，不证明全部开放分支被观察。

普通推侧切口也须保留：闭Gate下62向北目的1,9 Wall，向南推侧1,9 Wall，向西推侧2,8 closedGate；向东虽目的2,8本就闭，推侧0,8又被0,7/0,9 Wall及外侧缺Floor隔开，仅东邻1,8由Pri占据，普通free尚无进入0,8的路径。它不是可随取的按钮缓冲。64的南/西目的与北/东推侧均分别为1,0/0,1真Wall，四向普通无法抽出。63仅可在x1列普通上下搬至y2..7（南最终受64[1,1]+1,0 Wall、北最终受62[1,8]+1,9 Wall限制），横推东需x0 Wall推侧，横推西目的同为x0 Wall，不能直接送往Button。移动63可改变59要跨的东光轴位置，但保影结果仍UNKNOWN，不自动构成运输解。

62的0,8公开边界分支、穿SPIKE的63东轴、三Pri折射/观察传播及Shadow去活时序，本文只列几何，不自行增加“虚拟墙”“全分支自动满足”或“Player遮影”规则。5-8真实44已否定一个PLAYER代邻BOX西盾fixture，不能用活人站59西边6,5的裸SPIKE格来当Shadow护罩。所有新的光学完成/消影条件均UNKNOWN，以完整actual字段为准。

不移箱的短几何校准（仅历史6前置）：若仍是61[2,3]/65[2,1]，WW预测61[2,5]/65[2,3]，每格均SOLID且不碰Pri/Shadow，可读取63.testCompleted与全网/两Shadow.active。它不是Goal解或部署前缀；primary若已校准同域就不重复，当前owner也不需回到历史6。

## 空Shadow压钮与牺牲的必要推侧

Button7,9的N7,10、W6,9、E8,9全是真Wall，唯一S7,8是裸SPIKE。向北推空箱入Button必需推者最后进入7,8，允许其正常死亡，但必须保留另一个effective free去Goal。不能用“箱仍在7,9”代替剩余角色存在，也不能假Shadow会自动载人或有F0额外X。

59已在右侧col7、y3，**条件free[7,2]**可普通W六次把它送到7,9Button，沿途Box7,4/5/6/7/8/9均有公开Floor；最后推者7,8死亡，前五步的推者7,3..7均安全。**第二W的59[7,5]正处63东光轴**，需单步核active，不能批WWWWWW。Shadow箱在7,8 SPIKE上的存活与压Button有效性也须actual验收，不能当不变实体。

60初4,9无法在row9直接向右：5,9 Floor后6,9 Wall。要作备用按钮对象，必须先下运到其它横排再转右；row3..7跨col6 SPIKE的裸末推者可能先死，不能把它当普通安全搬运。row2横穿6,2是SOLID，具有静态绕行空间，但完整双人/Shadow保影运输由primary核，本文未构造可达prefix。

## 10方向完整条件尾（前置尚未达）

前置仅是几何fixture，**没有从真实3/6到此的正前缀**：active59[7,3]/60[4,9]、free末推者[7,2]与free保留者[4,7]，F0/g0；三Pri初位，Gate仍闭。两free同odd奇偶，不要求actor IDs与当前61/65对应固定。条件尾 **`WWWWWWSAAA`**，可部署必须先逐段actual建立前置和active Shadow；不得把下表批输入。

|累计|59|60|末推者|保留者|待核|
|---|---|---|---|---|---|
|W1|7,4|4,9|7,3|4,8|均普通安全Floor|
|W2|7,5|4,10|7,4|4,9|59进入63东光轴，active UNKNOWN|
|W3|7,6|4,11|7,5|4,10|保留者再推60；不能推进4,12 Wall|
|W4|7,7|4,11|7,6|4,9|保留者W被60+4,12 Wall堵、A3,10 Wall，回S|
|W5|7,8 SPIKE|4,11|7,7|4,10|空Shadow在刺上active UNKNOWN|
|W6|7,9 Button|4,11|7,8 SPIKE死亡|4,9|同W4普通回S；Gate2,8/3,8需actual open|
|S|7,9|4,11|inactive，不再可控|4,8|左房入口安全Floor|
|A1|7,9|4,11|inactive|3,8|仅已open的Gate允许进入|
|A2|7,9|4,11|inactive|2,8|第二Gate也必须open|
|A3|7,9|4,11|inactive|Goal1,8|普通推Pri62→公开SOLID0,8，验completed|

60只向上搬至4,11后受真Wall4,12限制，此局部位置不在三个x1 Pri的直接轴上；其active仍以actual核，不能用静态“无直轴”代替完整折射光学。保留者在4,9/4,10的W回转只依赖60确实仍active阻挡，若60去活，路径改变则本尾撤回，不能继续套表。

末AAA是独立Goal切口：只要Button已持久压且两Gate确实open、至少一个free合法到4,8，可经3,8/2,8后把Pri62向西推到0,8，占据Goal.floor1,8。这不要求仅靠光学把62.testCompleted变true；直接推Goal/完成依然MODEL须actual，若此前已completed则停止输入。Button/Shadow/末推者牺牲不假cargo，没有额外出生或堆叠。

本轮只做raw静态审计与10步条件尾手算，**零新图扩展**，无handle/队列/后台。重要0,8目的、按钮推侧/死亡、59[7,5]光学边界和条件尾已发root/owner/primary；完整运输/本关完成仍交唯一owner实测，本文不写主KB/进度。
