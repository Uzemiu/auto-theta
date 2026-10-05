# 4-10：一空箱加两个推者不能替代第二缓冲箱

2026-10-05，纯固定只读复算，未搜索、未游戏输入、未改存档或canonical。真实现场仍4-17 actual13，主记录完整保留。来源为公开4-10 initial地形与已实证WASD、cargo-X、旧帧推链规则；复用 `ch4-10-fork-stagger-tail-oct05.cjs`，不是独立物理引擎。脚本 `ch4-10-one-buffer-two-pushers-oct05.cjs` 不调用Bridge或读取隐藏实现。

## 指定的新库存反例

**constructed，不是合法初态部署前缀**：cargo7,6/F1/faceD，一个empty7,5，两free7,2/7,3均F0，Lock7,4已合法开启，无其它拾物。三箱同height1；下面模型ID只供跟踪，不冒充实际ID。

固定 `XWWW` valid，但只覆盖Goal7,8，mask2；另一个cargo停7,7。没有force、stack、同源重叠、free融合或Ghost捕获边界。

| 步 | empty | 后cargo | 前cargo | 后free | 前free | 发生的推力 |
|---|---|---|---|---|---|---|
| source | 7,5 | 7,6/F1 | — | 7,2 | 7,3 | 尚未X |
| X | 7,4 | 7,5/F0 | 7,7/F0 | 7,2 | 7,3 | 南侧出生推empty下移，父格腾空 |
| W1 | 7,5 | 7,6 | 7,7 | 7,3 | 7,4 | 前free推empty4+后cargo5两格链 |
| W2 | 7,6 | 7,7 | **7,8/Goal** | 7,4 | 死于7,5 | 前free推5/6/7三格链，再踩SPIKE |
| W3 | 7,6 | 7,7 | 7,8 | 死于7,5 | inactive | 后free只进入空7,5，未接触7,6箱，无第三推 |

两个free没有合并；普通计划读取输入前的箱位置，前free在7,5死亡后不会为后free填一个可推的箱格。尸体不是缓冲箱，也没有被位于7,6的empty捕获。因此不得把第三W算成继续推动三箱，或当作同步人物越过一格进行接力。

旧两empty的 `XWWW` 之所以正，是X把两empty推到7,3/4，W1从7,2立即接触7,3后箱并补齐7,4..7四格链，最后两拍还有缓冲格保护唯一推者。新替代库存X后最低箱在7,4，链少一个格，这个差距没有被第二名走路的人补上。旧stagger报告已包含类似三箱/双free的WWW失败结构；本轮只是严格复核root指定的X前库存，未重复大搜索。

## 第二叉的分配与更强条件

从一个cargoF1与一个outsideF0出发，最后cargo-X仍只保一个outside；若要最后X同时产生两个outside，应在X之前让outside持F1，然后它与cargo同时各耗一次叉。但两个新free均位于其父相邻格，通常同奇偶，不能直接指定它们恰落7,2/7,3这对相邻不同奇偶位置。即便已经正常部署了两个free到这两个格，上述固定尾仍失败，所以“给outside第二叉造第二推者”不是本尾的充分修复。

一个**更高库存的条件修复**固定成立：cargo7,6/F2/D、empty7,5、唯一outside7,3/F0，`XWWX`可覆盖双Goal。前两W送两cargo到7,7/8、唯一推者死7,5，但cargo各仍F1；最后X父格同时腾空，前方单侧出生到7,8/9、各F0。这只证明本构型多一把cargoFork的运输意义；没有从MODEL17/真实初态获得cargoF2的合法前缀。

MODEL17是soloF2，首free-X最多得到两名F1；如果它们随后一人装箱，普通装箱保其F1。已实际上浮关free1+1融合保1及M107 cargo1+1保1，不能靠合并把这库存反算成cargoF2。第二Fork是在首X之前由solo取完，或首X之后由某一F0接收者拾取，必须用真实完整顺序说明，不能凭总叉数授某个货物F2。

此报告不排除其它箱构型、兼容多叶分工、死亡/幽灵机制或Key-first的真正前置，只否定指定one-empty/two-pusher `XWWW`替换并标明额外Fork条件来源仍缺。

## 复核

`D:/nodejs/node.exe scratch/ch4-10-one-buffer-two-pushers-oct05.cjs`

主结果：validtrue/mask2；extraForkConditional：validtrue/mask3。全部固定复算，BFS expanded0，liveHandle null。无游戏通关或新成就信用。
