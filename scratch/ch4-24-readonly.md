# 4-24 响指：62输入实际完成（2026-10-04）

SaveSlot1，唯一输入owner `/root/ch4_1_readonly`，禁提示。正常回访重建已证35，改用 `AXDXXAXXXXXX` 同步两个持叉载箱，再5A保外人到左廊。53单X实际产生两条兼容叶，分别压上下按钮；axis0先3S到Goal1,1/time56，T实际切axis1后5W到Goal1,9/time58，游戏直接completed=true并自动返回World[-45,3]F1。成功本次0undo0retry；累计历史7undo0retry。主JSON completion/run及所有旧15/37/42历史保留。

完整62：

```text
SDDSDDDDAAWWWXWSDDDDDDDSDDWSAAWDSDWAXDXXAXXXXXXAAAAAXSSSTWWWWW
```

|输入|实际关键状态|主JSON事件|
|---|---|---|
|35|C1 BOX87/cargo90=9,6F1/W，C4empty88=9,5，outside89=9,4F0活|64|
|37|新AX：cargo90=9,5F0、cargo92/91=9,7F1/A，C4empty9,4，outside8,4；不同于旧XX37|68|
|47|charged C1 cargo100/99=4,8、106/105=5,7，均F1/A；Blue70=4,7，outside6,4|84|
|52|5A后outside89=1,4活F0；两个charged cargo与Blue不动|86|
|53|真实axis0 Blue4,6、下Gate1,2(ID0)open/上closed；axis1 Blue3,7、上Gate1,8(ID1)open/下closed；各9活=8cargo+1outside，ghost0|90|
|56|axis0 outside1,1，所有压门物体保留|92|
|57|T回执选axis1的PLAYER106而非100，outside回1,4，time53；另一叶显示历史投影|94|
|62|axis1 outside1,9/time58，axis0在time56的Goal1,1仍计覆盖，completedtrue|101|

53同一个Blue目标受到A/S正交推力。两冲突孩子来自同源Color1 cargo，实际先按力分成两叶，不因同格4,7出生先融合成单叶：axis0 cargo100/99胜4,7、106/105 masked；axis1 cargo106/105胜4,7、100/99 masked；旁观北child118/117=4,9与外89继承两叶。无异源叠体或自动对话。下Button4,6→ID0本次单占实证，补全旧42仅上Button3,7→ID1实证。M129只记录这一具体同源/同目标例，不推广任意排序。

原模型前35与新12固定复算全部与实际逐段吻合；最后53force由游戏实际判定。没有新BFS或增加旧cap。保留以下历史报告，其旧未完成状态只属于当时范围。

---

# 4-24 响指：只读资源前缀与有限分线范围

2026-10-04。唯一游戏输入 owner `resume_slot1_oct03`。本助手仅读取已观察地图/公开机制，维护本文件与同名 CJS；无提示、攻略、隐藏实现、存档或主 KB 修改。

## 实际地图

Template4/snap，size10×10、0..10边框墙，Wall优先。唯一 SPIKE(9,5)，无 ICE/LOCK/PRISM。Goal(1,1)/(1,9)，Gate(1,2)ID0/(1,8)ID1。实际42已核Blue(3,7)单压打开Gate(1,8)ID1，而Gate(1,2)仍闭；Button(4,6)单独配对尚未直接核。三箱：Blue70 Color3(4,7)、BOX87 Color1(5,4)、BOX88 Color4(4,4)。Fork16个：首(7,3)，上区(9,6/7/8/9)、(8,7/8/9)、(7,7/9)、(6,7/9)、(5,7/9)、(4,8/9)。

```text
10 ###########
 9 #G##FFFFFF#
 8 #|##F###FF#
 7 #.#bBFFFFF#
 6 #.##b####F#
 5 #P#######^#
 4 #...BB....#
 3 #.#....F..#
 2 #|#.......#
 1 #G#.......#
 0 ###########
```

## 实际37资源闭环（未完成）

`SDDSDDDDAAWWWXWSDDDDDDDSDDWSAAWDSDWXX`

|输入数|实际资源|证据|
|---|---|---|
|8|P89(7,3)F1/D，三箱原位|首叉安全取得，不碰箱/刺|
|13|P(3,4)F1/W|8后AAWWW|
|14|双F0(2,4)/(4,4)，C4移5,4、C1移6,4|X侧出生推动双箱|
|22|双F0(6,4)/(9,3)，空C4(7,4)/C1(8,4)|六D安全布站位|
|23|Color1 cargo91/87(9,4)F0/W/ghost0，C4empty(8,4)、out89(7,4)|event21，单D双链右推；右人东墙转W进入领头箱|
|27|C1cargo(9,5)，C4empty(8,4)、out(9,4)|SDDW，货物保护过刺|
|32|C1cargo(9,5)，C4rear(9,4)、out(8,4)|SAAWD把后箱接成竖链|
|34|同箱、out(9,3)|SD回背后|
|35|C1cargo(9,6)F1/W，C4rear(9,5)、out(9,4)F0活|event29，单W仅一拍，缓冲保外人|
|36|原C1cargo迁(9,7)，F1仍1，out原地|event31，X单侧前进、消1再拾1，无新箱/无分线|
|37|C1cargo91/87(8,7)F1与95/94(9,8)F1，out(9,4)活|event33，单X真实复制Color1，两侧分别取新叉|

所有活角色 ghost0/contained 属性已直接核；37为单叶、未完成。7undo/0retry：旧首C4捕获历史仍保留。

### 旧C4首捕获历史

`SDDSDDDDWWSXWWW`15，实际event11：C4cargo90/88(3,4)F0/W，Color1empty(4,4)、outside89(5,4)F0/A，Blue未动。首小图324 expanded/442 seen/118 pending正命中，无深度截断。owner正常undo7回8，选择右端Color1领头缓冲；不删除旧历史、不假称原15已完整解。

新Color1领头定向小图1689 expanded/1903 seen/214 pending，depthcut0，正命中 `AAWWWXWSDDDDDDD`。仅保两safe free/all boxes empty直到精确D捕获，upperBlue固定；没有全关巨搜。

## 有限尾域

1. MODEL35普通WASD+cargoX目标“cargoF2且保一outside”：3000 expanded/5897 seen/2897 pending，depthcut0，maxFork1，无正命中；**截断并停止，不加cap**。独立叠箱、已有cargo再捕获与X推力冲突不传播。该结果不排除其他资源顺序或未知边界。
2. MODEL35+XX（现已实际37）压缩每代“可选一方向普通输入设face，再X”：1175 expanded/1175 seen，pending0/depthcut0，未遇首X force conflict/stack。模型真实重放代表outside位置并保活，但哈希省去其坐标；这是启发式代表选择域，不能称全部WASD部署队列耗尽。Color1复制现有actual36/37支持；Color1同源融合后续只按既有一般M107作模型条件，尚非本关逐帧融合实证。
3. 固定37后 `AXXXXXXXXX`（9，MODEL46）把Blue70推到3,7 Button、Color1 cargo到4,6 Button，Fork全部耗尽且只有一free(8,4)，仍单叶。这**不构成两个Goal同时覆盖**，owner未执行；不能把“两个门都开”当全解。

## 待闭合结构

resource条件：若同刻有F1 cargo(5,7)/(4,8)、两者面A，X可对独立Blue(4,7)分别请求A/S，预期两叶各保下区outside，分别按实际门配对到一Goal；该cargo/cargo出生冲突仍需实际验证，**同步源的完整prefix尚未找到**。固定线性AX族的西支41已5,7F1、42即耗叉推Blue；顶支45才4,8F1，所以线性串不能冒充同步条件。

不能把杀唯一outside后套4-23 snake尾当本关完成；也不把一叶两个button、一名控制者当两Goal已达。当前允许任意兼容叶Goal联合，未固定左右分工。没有运行中的process/session，所有上述轮次已结束。

复核命令：`node scratch/ch4-24-readonly.cjs capture`、`color1Front`、`upperResource`、`macroConflict`、`replay <串>`。均仅私有计算，不包含游戏 API。实际JSON由owner维护，本助手无逐步JSON输出。

## 独立补充：actual35首X前的其他face

parent明确指出旧1175宏域先固定35+XX，漏掉35/36改face的分布，因此另从**actual35本身**出发一次小轮：每代可选0/1个普通face输入后X，保至少一outside活，目标首次任意X不同推力冲突或Blue/其他异源stack；没有cargoF2目标限制。**2500 expanded/4858 seen/2358 pending、depthcut0，截断无hit，stack/conflict均0；停止不升cap。**包括35先A/S/D再X、36后改face，F0 cargo被X推链后拾未取Fork的规则正常传播。和旧1175域同样忽略outside坐标哈希但逐前缀模拟实际代表生存，所以未覆盖全部普通部署；这不是重复扩大旧源的预算。脚本 `macroFrom35` 可复核；该已运行范围两Gate保守关闭，未把随后42按钮配对倒灌当已经覆盖。

owner随后实际37后 `AXXXX` 到42：Blue(3,7)打开上Gate，outside(8,4)仍活；剩持叉carrier(6,9)F1与未取Fork(5,9)/(4,9)/(4,8)。这五步有按钮配对探针价值，**没有继续执行MODEL46或记完整Goal**。当前模型pair默认保守null、`setPairs({1:[3,7]})`可用于后续新的已确认域，ID0配对不虚称已实证。
