# 2-G MODEL60新库存：M131来源域历史记录（2026-10-05，只读）

**当前已按用户指令暂停。** TTY48564/PID49036 在1820000保存时真实exit1：2150311021字节单次write超过Node上限，原直接写法将唯一巨checkpoint截断为0字节，完整frontier不可恢复。未达到1844263、无livehandle、未新建根。游戏历史/固定probe/两个小派生checkpoint仍在。私有保存已改64MiB分块+partial write+fsync/close+temp rename，小型roundtrip/失败保旧current验证通过；事故和精确损失见 `ch2-G-checkpoint-save-failure-oct05.md`。以下“保队列/持续”等是对应历史时点，不能再当当前事实。

最后stdout：expanded1820000/seen2529619/pending752053、maxDepth55/depthLimit60/depthCut0/deferred0、forces1893/maxLeaves3、hit=null、history7/补命中父余动作4。只保统计文本，未保完整q。容量历史回扫6750489/1356/known3证据保留，不授全局无解。

当前strong38已真实98闭环：root/owner核主459/frame19330256两稳定轴皆time160，各保right105+两名free，axis0为106/A胜、axis1为109/W胜；所有14entity整体字典除GMID实例分配外diff=[]。累计112Undo0retry、118/6/link3未变，只有两叶、仍未完成2-G。原TTY1311排序100后在expanded1644263找到raw38，保存唯一checkpoint后真实exit0；完整ancestor固定全match，没有EOF/弃队列/新根。该根q/seen/history不动；后续两源仅派生到新小checkpoint，保守M132普通图W叶175/A叶2496 expanded/seen先穷尽、pending0、unknown分别4cross和3capture+4perp，没有授全局无解。详见strong38-second-forces与strong98-a-perp14报告。此前安全C实际87和79capture都保留历史；capture79后owner正常Undo19已到418/frame19240139/source60/time81，与350/259/173/131全14字典一致，再实际重放38到98。游戏只有ch4_1_readonly控制，本助手零输入、零canonical/主JSON/存档写入。M133受限模型及20项实际校准仍保原scope；强38用M131/M132旧模型也固定全match，不依赖新增M133腾格泛化。

## 源身份和旧尾差异

新来源固定有效：10610,7/A、107/108/109分别7/4/1,1/S，right10514,8/S；九Color2空单层BOX为1108,9、1118,5、1126,7、1133,9、1142,9、11511,8、1168,7、1177,7、1185,7。七行四箱连续5..8，且115留11,8，与actual64不同。

旧17尾`WDWDASSAWWWWDWADW`在这个源完整fixed有效但仅一叶：第11W经理死8,9，最后1085,7/W与1092,9/W活，right14,9/S；九箱保留，未产生force。不能把它套成actual64的三叶结论。以上都是模型固定，不是owner新增动作。

## 物理校准与去重范围

私有 `ch2-G-m131-source-model-oct05.cjs` 的8项真实M131帧校准已过，详见source-calibration报告；来源保存与败方mask取消其在途动作可复现实际80→81→83。额外加入“同微拍同时多个force目标”边界，因尚未校准这些目标的处理先后，不按BOX数组次序授予真实叶数。

`ch2-G-m131-box-permutation-oct05.cjs`只固定两个稳定样本：MODEL60与MODEL60+WDWD，各WASD分别交换BOX110/118的ID或反转BOX对象数组，共16项全部等价；actual80末W反转数组另1项仍三叶全match。比较具体PLAYER ID及状态、匿名BOX坐标/md/src、完整micro轨迹及来源选择。没有为此开启图。root另独立核42个公开单叶稳定观测、合计840个旧face/BOX数组置换单输入，failureCount0；其边界只比reason，本报告不声称校准所有边界细节。

去重仅用于本普通首force域：九箱皆Color2/h1/contained0，稳定时md0/src-1，匿名坐标可去掉仅BOX ID排列；活PLAYER ID保留，只有完全4blocked演员保旧face，因为有可移动方向时tick0会由输入/fallback重设face。无DARK，capture/stack仍停止，inactive旧坐标不参加下一输入；具体ID/face/parent路径仍保留用于完整重放和实机比较。right105在隔离安全廊，不参加左区碰撞，因此其相位不作为图键，候选最终从全串重新算right每输入一步与反弹。它不是全游戏物理等同定理。

## 实际执行窗口与队列恢复

首20k窗口：expanded20000、seen30027、pending10027、depthCut0、maxDepth25；7个firstforce没有四叶/保两left命中。之后原plain-pipe session92969真实续到100k：seen158790、pending58790、depthCut0、maxDepth28、forces31/maxLeaves2，hit=null。stdin EOF使readline在打印FRONTIER_RETAINED后立即退出，**该进程已exit0，不能声称队列仍活**；本助手明确向root报告实现失误。

随后仅一次同参数重建到100k，各阶段数完全一致；改用TTY session60372，并以单文件`ch2-G-m131-model60-frontier-oct05.v8`保存q/seen/heap/done/深度前沿和计数。此二进制是计算恢复保底，不是游戏快照/存档，不新增逐动作JSON。100k同活frontier合并后seen96774、pending39208，原158790具体节点/ID路径仍保留；没有重置root或重新跑已展开状态。接着同handle正常继续200k与400k：

| 窗口 | expanded | seen | pending | maxDepth | depthCut/deferred | firstforce/maxLeaves | hit |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| 200k | 200000 | 253667 | 96101 | 29 | 0/0 | 51/2 | null |
| 400k | 400000 | 551466 | 193900 | 32 | 0/0 | 90/2 | null |

400k的lost396272；停止边界capture2579、perpendicular-free-box77、unverified-player-cross595、new-stack5。400k不是图穷尽，pending仍在同TTY进程；窗口末同V8文件已保存，不因无Goal结果创建同根重跑。此处不将计数授予全关否定。

目标是一次≥4兼容右观察者叶，或首force完成后至少一个叶保≥2functional left，便于后续再分线。预算是计算窗口而非全局否定；depth45节点保在deferred队列，不能称达到深度上限就是游戏不可解。

## 当前最短未传播边界

100k窗口留下capture907、自由人正交撞movingBOX13、未证玩家交汇239。所有边界保精确前态和全source60尾，不静默当全局失败。

最短capture尾仅模型`SWWDD`，末D前10611,8/D、1086,7/D、1093,9/D活、107已死。BOX11010,9、1138,9、1127,7、1178,7、11610,7，另1118,5/1142,10/11512,8/1185,10。末D第5模型微拍，109已推113后在8,9刺死，其箱惯性继续传给110并把110推入11,9，与已停止经理106同格；1087,7还活。脚本停在capture，没有自行把它解释成新cargo或完整四Goal路线。

最短正交free-BOX尾`DDWASAWADWW`，末W前10610,9/W、1085,2/W、1092,2/W活；BOX1133,9、1108,9、1142,10。第6模型微拍1092,8向W试推已在2,9向A滑行的113（source106）；经理已死8,9，108仍5,8向W滑。本例不同于已证停止箱上的M131双来源请求，保为实际可判别边界而非擅自传播。特别是113旧A的下一1,9为真Wall，因此这里只能校准oldDirectionBlocked特殊情形，不能据它将全部free-perpendicular边界放行。后续同frontier边界应按oldDirectionBlocked/oldDirectionCanChainMove分别保最短；若双方方向都可动且至少两left保留，价值不同。400k进程当前尚只保类型最短，未虚称已经保存77条完整边界轨迹。

没有给owner盲操作串。后续候选必须固定全source前缀和尾，核right继承、各叶来源与活资源，再由root/owner审实机次序。

## M132受限迁移（补边已完成，活队列继续）

root独立复跑实际71的3/3和原8/8全diffs=[]后批准最窄Wall/gap旧惯性清理。旧60372先SAVE得到CHECKPOINT_SAVED，再STOP得到exit0；恢复文件移至已由git check-ignore确认的`artifacts/solver-frontiers/m131-model60-current.v8`（旧400k长度484730673 bytes），它是派生临时恢复数据，不提交、不当游戏证据。只此单最新文件。

`ch2-G-m132-model60-resource-oct05.cjs`从同q/seen/heap/done加载，原expanded仍400000。迁移单独记录cursor/checkedActions/eligible/added/newBoundary及旧400k完整scope：固定重评此前done父节点的旧四个转移，只在首拒绝为perpendicular且旧方向下一格立即Wall/gap时用新模型补这条边。补入的新状态保旧parent索引/全ID可复现尾，不重建根，也不把固定重评算BFS expanded；新unknown仍停止。迁移游标保在同checkpoint，以便续接。

迁移实际完成：cursor400000、checkedActions1600000；旧77个perpendicular中71符合立即Wall/gap条件，71全部newValid、67稳定后不足两left不入队、3早在seen，新增1节点；其余6不属于已证窄补丁，未传播。newBoundary0、nohit。expanded仍400000，seen551467，pending193901。迁移同checkpoint保完整旧400k scope；原最短历史perpendicular仍作为旧模型证据保留，未声称当时已保存77条全部完整轨迹。

随后同TTY62184收到`CONTINUE 500000`，沿剩余frontier运行新规则。真实500k窗口结束：expanded500000/seen692337/pending234771/maxDepth34/depthCut0/deferred0；lost500216、firstforce138/maxLeaves2、hitnull。capture3123、playercross698、newstack5；旧perp77保历史，新真正可动perp分类9。进程仍活，窗口末checkpoint保存，未STOP或重新建根。优先固定提取该新类别最短20步物理探针，见m132-perpendicular-probe报告追加；未继续百万或授模型Goal。

新perpendicular分类按oldDirectionBlockedWallGap / oldDirectionBlockedChain / oldDirectionCanChainMove，再标玩家方向链可动性；它们是边界诊断，不授权传播。目标继续首force后至少一叶两left或四右观察者叶；更有价值的可动正交接触必须以前面微拍均已证的短串报告。后续窗口数待真实handle输出更新。

## M133迁移及700k同前沿重排

真实216/time149→217/time150直接证BOX112[3,10]A/src106腾至[2,10]停，free108[3,9]W/src108进入[3,10]继续滑，无force/capture/branch；旧ghost109同[2,10]保持inactive/uncontained。窄几何模型仅允许两者皆滑、PLAYER/旧BOX格皆ICE、垂直md、BOX下一直接格合法且无BOX/active PLAYER、独立惯性、无其他请求/取消/链冲突时同时腾格。方向旋转/BOX目的ICE尚是模型假设，其他正交不放行。

62184保存500k checkpoint并STOP exit0，66479恢复同q/seen/heap/done。迁移checkedActions2000000/cursor500000，旧6+新9真正可动perp共15条全部重评：newValid1、lost1、newBoundary14、added0。唯一放行边终态仅right活，不入队；其余14条保明确分类与完整前态，没有永久丢旧被拒边。expanded仍500000/seen692337/pending234771。

随后同66479真实推进700k：expanded700000/seen966119/pending308553/maxDepth34/depthCut0/deferred0；lost707348、firstforce153/maxLeaves2、hitnull。除历史边界，新增new-capture/preLeft2为578、preLeftAtLeast3为54，真正可动perp/preLeft2为3。该窗口不是穷尽。

只读checkpoint诊断700k pending：2left=294134（minDepth5/minScore46.2），3left=14402（minDepth8/minScore46.2），4left=17（minDepth11/minScore46.2）。root批准仅将排序的资源损失罚项3改12，优先丰富库存而不硬剪2left。保存并确认66479 exit0后，69831真实加载同700k：q concrete1028135、done700000、seen966119、pending308553、deferred0全部保留；重排后各minScore分别64.2/55.2/46.2，数量不变。新生成节点沿同评分，所有原两人状态仍可展开。收到CONTINUE 900000，后续实际计数待该handle输出，不声称计划已完成。

重排真实命中737611：seen1021855/pending326678/maxDepth37/depthCut0，forces329/max3叶；raw27尾`DWWDAASDSASSSSSSAWWWWWWWWDW`首force后left2/1。手抄多一S的28串已撤回；直接checkpoint raw字符串和全部parent状态由真实259固定重放全match，旧M131/M132模型也独立固定同结果。这个候选不依赖M133新增几何假设，详见retained-left-force-probe报告；仍只模型，不能当四Goal全解。

root授权保原hit历史并提高接受目标为所有初叶≥2left或≥4leaf。新TTY1311真实从同737611 checkpoint加载q1083871/done737611/seen1021855，补命中父尚未展开A/S/D，pending326679，expanded不重复计父，completedParentRemainders单独记录。原hitHistory保存，目标变更不删除边界/旧force/history。游戏仍由owner独占输入。

## 真实1100k窗口与新capture探针

同1311先完成900000：seen1256041/pending398475/maxDepth44/depthCut0/deferred0，forces641/maxLeaves3、hitnull。原depth45在此之前从未导致剪枝；将后续depthLimit改60，保全部frontier/deferred（当时为0）。随后真实1100000窗口：seen1518957/pending461391/maxDepth45/depthCut0/deferred0，lost980198，forces709/maxLeaves3，strong hitnull、历史hit1、命中父剩余动作补完计数1。不是穷尽、不作游戏不可解结论。当前同TTY1311继续1300000，单checkpoint仍在ignored artifacts/solver-frontiers。

新阶段边界累计：capture/preLeft2=1380、capture/preLeftAtLeast3=878、真正可动perpendicular/preLeft2=3；历史边界独立保留。最短丰富库存capture是19尾 `WWDSSDSAAAWDSAASWDA`，程序固定前18无force/unknown，末A在tick6 BOX113惯性A/src106进入仍活P109[2,9]时停止。详见 `ch2-G-m133-capture19-probe-oct05.cjs/.md` 的程序18检查点及accepted微拍；捕获后的container/height/ghost/Fork/source/稳定资源未拟造。该新fixture不等同现有普通无货物域继续，也不因多一个容器就授四Goal完成。

同1311真实1300000：seen1785406/pending527840/maxDepth45/depthCut0/deferred0，forces790/maxLeaves3、strong hitnull。pending诊断：2left491784（minDepth7/minScore66.2/maxDepth46），3left36056（minDepth19/minScore66.2/maxDepth46）；没有4left pending只是当前队列事实，不是全局资源不可能。依原授权继续同frontier1500000，不以此计算窗口封图。capture/preLeftAtLeast3累计1006、perp/preLeft2新增8、未知玩家交汇2757；保未知，不依据搜索猜capture或多目标物理。

## 同1500k排序12→100（零状态丢弃）

真实1500000：seen2043808/pending586242/maxDepth46/depthCut0/deferred0、forces880/maxLeaves3/strong hitnull、历史C87保留。root批准仅把资源损失排序罚项12改100，使用原TTY1311直接PRIORITY；没有退出/新handle/新根/物理迁移。具体q节点2105824、done1500000、seen2043808、pending586242、deferred0和历史全部保留。

前后pending数量：2left546431、3left39811不变。minScore仅由66.8/66.8变242.8/154.8（分别2/3left），其minDepth7/19、maxDepth47不变。delta=88，score增加88*(4-freeCount)，所有2left仍保存后续备用及未知边界取证；不删除其seen或parent路径。继续同queue1700000，depthLimit60，若后续deferred非零须保留并扩大，不把计算窗口当推进终点。

排序论证仅限当前无cargo的已知普通首force模型：稳定输入前md/src清零，2free能产生的推动来源最多这2个ID，首次force全局mask输家并取消它的所有箱运动；每叶至多1free，且无第二不同来源再force，因此不能命中当前strong目标。capture/stack/多目标/新机制仍停止且没有否定实机能力；此模型论证不作为全游戏定理。M038的passive cargo与可推箱free须分开计数，不能用active数量扩functional预算。

真实强命中统计：expanded1644263/seen2274033/pending672204，q2336049/done1644263，depthLimit60/depthCut0/deferred0/maxDepth51，forces1221/maxLeaves3，priority100、strong policy，历史C87 hit1/旧命中父余动作补完1。新hit parent2266949/depth37，raw尾38 `DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADW`，sourceMatches=true、全37 concrete ancestor firstMismatch=null；当前新命中父的A/S/D尚未展开，必须在以后继续第一force队列时补回。该stronghit只证明模型两叶各2free；还没有四叶/Goal闭环，不清hit/history，不自动新根或继续当前搜索窗口。唯一checkpoint保q/seen/heap/done/deferred/边界，已结束的1311仍有明确exit0证据。只读audit37887/24752均exit0。
## 2026-10-05 原前沿后继（只读计算）

finite派生37+101校准48公开帧/叶全部properties键match，old20/37保持；marker新input清理/resume保留的中间态测试通过。派生小checkpoint同队列四W边迁移后真正有限关闭：109/W expanded=seen175、pending0、lost94；106/A expanded=seen2496、pending0、lost1880；depthCut/deferred0，A三capture未知保留。不能推广全关无解或硬删所有两free布局。

原巨checkpoint沿同1644263前沿继续，命令`D:/nodejs/node.exe --max-old-space-size=24576 scratch/ch2-G-m133-model60-resource-oct05.cjs --live --continue-actual98 --window-total=1844263`，真实TTY8126/PID45948。恢复expanded1644263/seen2274033/pending672204/q2336049/done1644263/history1/completedParentRemainders1。精确父2266949/depth37、raw38和37个concrete祖先及最后W全部modeled字段核过，strong98归档history2、同父补ASD（resumeFromAction1），pending672205，其余规模不变。入队不等于余动作已经展开，完成计数以后继实际stdout为准。保原conservative M133，不向巨queue默注派生finite chain/cross，不重根。窗口不是全局预算终点，heap/checkpoint仍可续。
### 同前沿重复fixture与严格父解析修正

TTY8126/PID45948真实exit0：提前新MODEL hit尾`DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADD`，末D代替旧末W。expanded1646845/seen2278033/pending673622/history2/completedParentRemainders2/forces1258。预态、force114/tick6和两叶完整modeled物理signature与actual98一致，没有安排重复游戏探针。

TTY56204/PID44764恢复同checkpoint后严格父/path断言exit1，未修改checkpoint。该hit来自已done的2266949父补D，resume没有再次done.add，因此done最后元素不是命中父。修正为显式hit.parentIndex优先，否则只取history前37精确相同且path匹配的显式父；不猜位置或重建根。原历史actual98显式父2266949/depth37已核，下一恢复TTY19940/PID44156沿原1646845继续，只有逐concrete祖先/末动作和完整重复leaf fields皆match才归档重复。旧末D为动作索引3，nextAction4无需补余输入。新的runTo命中直接保存parentIndex/nextAction。这里是离线程序恢复，绝不是游戏retry。

## 同原前沿新102实测与容量政策回扫

TTY19940/PID44156真实exit0于新命中：expanded1687623/seen2338829/pending693640/q2400845/done1687623、maxDepth53、depthLimit60/cut0/deferred0、forces1356/maxLeaves3/history3/completedParentRemainders2。精确父2400844/depth41，raw42 `DDAWDWAASSWDDASAWDWSDAWDWASADSDSSSAWWWWDWW`；全部41concrete祖先/末W stored modeled fields固定match，详见parent2400844 probe报告。不同于实际98：旁观108[5,7]、A胜106[11,10]，BOX布局亦异。

现在该候选已ACTUAL102成立，主731/frame19897550两轴time165。助手逐PLAYER/activeBOX坐标、active及全部公开properties键比对各diffs=[]；Root另独立MCP19913105 whole14 statics/animations/guard/GMID allocation核对。两轴right105[14,10]/W都保留，axis0赢家106[11,10]/A及108[5,7]/W、axis1赢家109[2,9]/W及108[5,7]/W。并未完成四Goal。派生普通域保原真实source已有限closed：A2496/W175，没有第二force；其unknown三capture和有限范围不扩成全关否定。

Root授权从唯一checkpoint单loader继续。实际TTY6542/PID43024，CLI `D:/nodejs/node.exe --max-old-space-size=24576 scratch/ch2-G-m133-model60-resource-oct05.cjs --live --archive-proof-event=731 --capacity-policy --window-total=1844263`。严格source/41祖先/raw末W/731两叶public-property匹配通过，归档history3→4，expanded1687623/seen2338829不变，pending693640→693641；父2400844余ASD显式原heap保留，不重复计expanded。

新接受政策仅资源上界启发式：每叶right实际库存保留，既有all2/四叶候选继续接受，再允许sum(max(1,leftCount))>=4，覆盖如三叶[2,1,1]、二叶[3,1]。不是实际四Goal可行性或必要性证明。旧1356force未逐边保存，所以冻结done1687623索引，按历史已展开动作重评，checkedActions/forceEdges单独累计；旧普通q/seen/heap/done/expanded不重跑或删除。当前hit父只扫已展开W，ASD留原heap。其他物理仍原conservative M133，不默注finite childclone。

回扫已真实complete：cursor1687623/checkedActions6750489（比×4少3因当前父仅已展W）、forceEdges1356/qualified3/knownActualLayouts3/invalid12959，examples空。3个合格全是已核实际/重复布局，无新容量候选；原expanded/seen/pending仍1687623/2338829/693641。每20k父stdout响应；巨大恢复文件仅≥120秒或命中/完成/停止保存，新version6另存capacitySweep/policyHistory，来源q全部保留。没有把计划或队列命中当实机完成。

回扫后同6542先补当前父ASD：completedParentRemainders2→3，expanded1687623不增加，seen2338830、q2400846、pending693641。末D raw `DDAWDWAASSWDDASAWDWSDAWDWASADSDSSSAWWWWDWD`再次到与实际102完全相同的两叶具体字段；parent2400844/nextAction4明确。6542真实保存终止exit0，不由CIM猜测；没有部署重复游戏串。

Root批准后后继单loader真实TTY42207/PID47740，CLI `D:/nodejs/node.exe --max-old-space-size=24576 scratch/ch2-G-m133-model60-resource-oct05.cjs --live --skip-known-actual --window-total=1844263`。先从该同checkpoint固定41concrete祖先/末D/全部两叶具体PLAYER及BOX字段/choices，精确匹配已核731才归档duplicateOf731。真实stdout已接受：history4→5，expanded1687623/seen2338830/pending693641/q2400846/done1687623/completedParentRemainders3不变；remainingActions空，不再次补父。随后同heap继续普通后继；物理原M133、宽容量政策、历史sweep/cuts/unknown全部保留，不按匿名BOX/组件闭合做全游戏删除。
