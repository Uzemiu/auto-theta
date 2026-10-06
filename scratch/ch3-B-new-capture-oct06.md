# 3-B 延展：出生捕获、四物理箱叠体与Color3 Ghost边界

2026-10-06。仅只读公开主记录、旧私有模型及已经实测的机制；无游戏输入、无提示/外部攻略/隐藏实现/反射/存档编辑。只新增[脚本](ch3-B-new-capture-oct06.cjs)和本报告，无额外JSON、无后台handle。当前没有可交付的fresh Ghost捕获前缀或Goal1,6完整解。

## 准确起点与新机制适用性

[主记录](../artifacts/slot1-playthrough/3-B.json) event17/frame1005049/axis0/time0/instructions空：P34[2,1]/S/F0；唯一Fork33[6,5]；四Color3独立BOX35[5,6]/36[4,6]/37[4,5]/38[5,5]；Goal1,6。没有DARK/ICE/内部Wall，Spike不能当Wall；边界0/8才是墙。

- standalone唯一Fork只能产生一次分裂，生出的两free皆F0。同源载箱复制/1+1融合及保Fork1 cargo的第四章规则不能凭空引入本关：单人无ICE普通推动会落在旧箱格，箱在另一格，不能先自行装箱；首次X花掉唯一Fork后没有其它Fork。
- 旧 `stack-cargo-readonly.cjs` 已在生出X孩子、计算所有箱末态后检查同格捕获。出生捕获并非完全遗漏；缺的是它在land阶段先丢掉Spike演员。M092证明同主tick入Spike并动态装入箱会形成active Ghost1（原实测Color2）；将它写成Ghost0存活不诚实。Color3的相同具体实例仍待实际验证，不能借颜色无关假设冒称已证。
- 单个父演员第一次普通X没有已知自捕获方式：孩子只走邻接侧/前一格，所推箱离开该格；在本闭合Wall边界无循环、无ICE时不能把第一次X直接当作cargo或Fork1 cargo来源。这里是限定几何，不推广多父演员或载箱X。
- 四个初始独立BOX不能按相同Color3当作同源clone消掉。新模型保留原ID位mask，叠体始终计入全部四个物理对象；仅搜索等价键可在光学前交换同属性独立箱身份，真实witness保留ID。

## 旧7个Spike模板的进一步筛选

已读owner的 `3-B-spike-capture-oct06.cjs` 20k/22772seen结果，不重复其无stack、7模板全启发式域。三模板需另一演员已经站Goal1,6，先前已经完成，不能作为fresh首次未完成捕获；另两个模板当步pusher裸踩Spike，只剩被动cargo，违反保另一free的probe要求。

仍值得区分的三个保free模板为：

|捕获格|必须箱位|两个free|最后动作与pusher末格|
|---|---|---|---|
|3,5 Spike|3,3/3,4 +4,6/4,7|3,2及4,5|W；pusher3,3安全，receiver因顶链背Wall转A入3,5|
|5,4 Spike|5,2/5,3 +6,1/7,1|5,1及5,5|S；pusher底Wall/右双箱堵转W至5,2，receiverS入5,4|
|6,4 Spike|6,2/6,3 +7,1；第四箱不得冲突|6,1及6,5|S；pusher底Wall/右箱堵转W至6,2，receiverS入6,4|

这些是条件前态，不是从fresh可达证明。脚本人工fixture只核最后一个模板：单S后free6,2/faceW/ghost0仍活，cargo6,4/faceS/ghost1/container=旧6,3的BOX、四物理箱仍在。fixture明确标成MODEL不可直接从fresh执行，未伪造游戏观测。

## 新fresh域：允许独立叠体并显式Ghost状态

新搜索从上述实际fresh17开始，允许普通WASDX、同型独立BOX叠体，始终保四物理BOX原mask；拒绝force/光学/箱内有叉X，死亡在箱新位置捕获以后结算。cargo身上Ghost0/1显式保留，无箱的Spike人照常消失。两角色须保活，首次捕获定向6,4并保一free，不吸收旧底边5,1安全命中当新成果。

**结果：30000 expanded /31611 seen /1611 pending 截断，没有fresh6,4捕获前缀。** 不增加本域预算，不是有限队列穷尽，也不是游戏无解。

期间出现761次包含叠体的可生成转移；旧time30/prep限定stack轮曾0次、旧owner20k则明确禁止stack，因此确有新域状态。第一个stack witness在7,1含原BOX36+37，另外35[4,4]/38[5,4]，两free7,2/6,1，四物理对象皆保。到它的fresh71输入虽有脚本 `firstStackRoute/stackTrace`，但底边y1不能普通上抬，没有Goal运输价值，**不建议为它实际重玩**。这是独立BOX叠体，不是同源clone融合。

旧实际20/event6和30/event8路线 `WWDDDDDWWWWWWWSSWWDDSSADWWWWSS` 在新模型校准通过：单人坐标face/Fork、四箱坐标、ghost0都一致；未声称完整实体字典/GMID或Color3 Ghost实测。脚本exit0，搜索已终端，无livehandle。

## 小的正常出生探针，尚非Ghost捕获解

若owner之后正常回访B且决定校准该关初次X，可从fresh用12 **`DDDDDWWWWAWS`**：只走row1到x7、由右侧安全7列到Fork，W/S设置朝南，箱位不动；前X P34[6,5]/S/F1、Forkinactive、四初始箱不变。

然后**单X13**预计生出两free[7,5]/[5,5]、都faceS/F0/ghost0：左支推双BOX，37[4,5]→3,5 Spike、38[5,5]→4,5；35[5,6]/36[4,6]不动。两演员都在真实安全Floor，四BOX仍独立active/h1/uncontained，没有叠体、捕获或关卡完成。实际孩子ID按现场核，不能把模型匿名数组顺序当继承ID。

fresh的下一单D预测P34[2,1]→3,1/faceD/F0，所有BOX/Fork不动。脚本 `smallBirthProbe.trace/preX/postX` 保存13步MODEL比较字段。这个小探针只校准出生推两箱及空箱落Spike仍是空箱；没有验证Color3 Ghost，也没有Goal运输尾，不能拿它代替本任务想要的完整捕获路线。不建议为此中断3-19或其它已有可验证输入。

当前决策：没有值得盲执行的fresh Ghost前缀；继续root已安排的其它正常关卡，保3-B未完成/本次0输入。如将来有可实际实现的新前置或组合关新增Actor/Fork，须另核其资源，不机械扩当前30k图。
