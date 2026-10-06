# Slot1收集物与升层回访清单（2026-10-07，只读）

唯一游戏输入仍为slot1_owner_oct06。本文先按knowledge/collectibles.json与achievements.json定位，再读取少量公开初态/已定位事件；没有路线搜索、游戏输入、提示/攻略/hidden/reflection、save读取或编辑，没有新增JSON/队列/后台，也不改knowledge/game files。不要求owner现在切关。

**已核六颗星1..6，彩叉101/102/103/104及怀表201已有Slot1持久化证据。** 本只读盘点定位时，collectibles.json的更新日为2026-10-04、保存检查为2026-10-03T22:34:38Z；不将旧六星记录冒充本helper新读Save。定位使用的成就缓存为2026-10-06T17:17:28.150029Z：14/28、Slot1条件核验13；Starry“9颗星”与Magic“所有星”仍locked，所有星总数没有本任务证据。Yellow叉104已取不等于Yellow“分裂关卡”成就已达成；105只能称新彩叉候选，名称/机制尚未通过收藏UI核验。

root随后补核：18:47:32.909016Z官方本地cache仍14/28；19:00:00.257097Z正常只读SaveSlot1仍125关/6星/CurWorld5，Collections中14/105/205均无取得标记。三项已补入collectibles.json为unclassified、counts_as_star=null、observed_uncollected，并更新last_save_check；这段正常保存核验由root完成，不算本helper输入或读取游戏存档。

## 已发现、尚无Slot1取得证据的项目

下表“active”均是准确**历史观察**，不是当前live或新Save检查。NID编号不能直接认定星/彩叉种类；7画面星形仅是视觉线索，7..12在收集物表均unclassified。第五章14/105/205尚未登记进该旧表，属于本次补列的公开发现。

|NID/位置|明确公开源、最近核验|必要正常前置/局限|
|---|---|---|
|7，3-21[2,6]|COL76；fresh首观察event0/frame4315433；最近关内event62/frame1514885仍active|普通3-21已完成，收藏未取。DARK/Wall/地刺分隔；本轮空Prism推出Dark的singleS39已阴性，不把Ghost能出Dark或旧光照假说当解。需新实际复活/合法cargo/其它前置再回访，不能重复屋顶假通路。|
|8，3-31[4,3]|COL34；首event0/frame6302758；event13/frame6466103两已观察线均active|普通3-31已完成；四邻4,4/3,3/5,3/4,2是Wall，不能普通直接走入。需合法墙容器/组合等实际前置；未构造。|
|9，Chapter3[39,11]|initial/frame527971、COL353 active；最近匹配Chapter3 world观察frame1606052仍active|收藏自身SOLID；N39,12/S39,10裸SPIKE，W38,11缺Floor，唯一普通E邻40,11是ENTRY352/3-W。初态该入口blocked、require3-20；最近world已unblocked，但3-W进度仍attempted。先核正常3-W完成后通行/回访 checkpoint或新运输；未完入口会入关，不能当自由走廊。没有给完整安全串。|
|10，4-7[4,5]|COL39；首event0/frame1086039；完成48的event19/frame1154645仍active|普通4-7已完成；COL与active Wall4,5同格。WWW直接接近失败已知，未证明全机制无解。4-5^4-7初态墙内出生是未构造假说，两世界入口不可推的限制仍保留。|
|11，4-17[2,10]|COL54；首event0/frame4584943；最近关内event66/frame15883989仍active|COL在安全SOLID而无Wall，但上袋经4,8/4,9两LOCK及缺地形分隔。4-17未完成；箱/叉库存可用不等于已经有上袋钥匙/可达路线，需正常实际开锁/运输前置。|
|12，Chapter4[-68,-17]|event0/frame1358870 COL65 active；world exit event499/frame1740308仍active|四正交邻[-68,-16]/[-67,-17]/[-68,-18]/[-69,-17]均裸SPIKE。条件cargo body[-68,-15]+外推者[-68,-14]可SS送到收藏，外人末步允许死；但body资源/世界保留/contained拾物全部未实测。未完4-Y捕人先入关，不能当现成世界箱。|
|105候选新叉，Chapter5[-15,-13]|event0/frame1773504、stable7/frame1781523 COL268 active；最近匹配world frame7562095仍active|自身及四邻均SOLID，但旧有限域只在反事实Gate165[-19,-10]持续open时有路。最近world同Gate仍closed，Button170[-22,-10]及配对/持压方法未核。需真实箱/另一人/已校准占门保持，不能按过一次就授通路；没有本次新可执行串。|
|14，Chapter5[-3,-32]|同上第5章源，COL267 active；最近world frame7562095仍active|自身SOLID，N/E/W均缺Floor，唯一S[-3,-33]是closed Gate166（ID3）。此门是普通到格的实际邻位切口；真实Button关联/保持条件未知，不能直接靠编号授开门。|
|205，Chapter5[-17,-27]|同上第5章源，COL266 active；最近world frame7562095仍active|自身/四邻均SOLID，无同格Wall，局部没有刺环；从当前世界spawn/入口是否有正常资源前缀未构造。种类/是否计星/是否普通剧情物都未验，不因2xx类比怀表201便排除它。|

本次仅定位现有登记、Chapter1..5世界公开初态与近末world观察、上述四个关内文件；没有遍历全部关卡找新COL。**NID13、未列编号、第六章/后续收集物均未知**，不能把表里九项当全部欠项或“全部星总数”。6星到Starry还需至少3颗正常计星收集，但不能先把任意3个unclassified项目授为星。

## COL105的可复用切口与新源要求

原报告scratch/chapter5-world-resources-oct06.md的Gate165开放投影仅证明当时具体条件下有路，不是actual positive，不能重新执行旧长串。COL105四邻安全和最近Gate仍closed已本次复核。最近普通BOX171[-26,-16]北[-26,-15]SPIKE、东[-25,-16]缺Floor，旧报告没有合法送Button170的完整串；门后BOX172[-19,-13]也不能提前当已取得资源。

回访应先以正常Chapter5新world snapshot核玩家/Fork/key、所有active箱/Prism/ENTRY及Gate，获得真实持压前置后才规划路线；入口完成状态与返场出生点可能已改变。取得收藏后只记录实际UI名称、split变化、normal返回/进入后的已授权保存核验，不用active变化替代持久化；本helper不读save。

## 已实测升层出口，不能替换成WorldGoal

|正常升层|准确UI源与位置/朝向|既有进入证据/正常前置|
|---|---|---|
|Chapter1→2|chapter1-world event63/frame1951558，P74[38,48]/W/F1，UI“前往上层”|1-X/1-Y上方y42桥正常向北；normal confirm后Chapter2首world frame1993408、位置82,8。当前章节地图重传9,1不是该历史落点，不从任意spawn直接续旧串。|
|Chapter2→3|chapter2-world event356/frame517802，双人[-4,1]/[-6,1]均A，UI“前往上层”|历史前置[9,1]/Fork1，用17串WAAAAAXAAWWAAAAAA，4,1按钮已实测开1,1门，再走西端。chapter3-world initial/frame527971为实际到Chapter3；需先正常重建9,1/F1，不能从82,7盲续17。|
|Chapter3→4|chapter3-world event460/frame1347564，P238[-23,4]/A/F1，UI“前往上层”|normal confirm后chapter4-world event0/frame1358870、Chapter4演生落点21,0。第三章旧欠关当时尚未全清，不把全部支线完成硬写成出口必要条件；非通天塔37,24。|
|Chapter4→5|chapter4-world event499/frame1740308，P66[-82,4]/W/F1；root独立1743132同UI|receipt500 normal confirm，Chapter5 initial/frame1764756、stable7/frame1781523。旧[-83,4]/S与[-83,5]没有UI，不能替代正确位置/朝向；ACH_PASSCH4已本地核解锁。|
|Chapter5→6或其它出口|**截至本次选取记录与chapter5-world针对“前往上层”的文本检查，未命中**|当前world最新核验frame7562095仅是第5章正常导航。未假定WorldGoal/边界/INTERACTABLE即出口，也不据未命中断言没有出口或必须清全部第五章。|

上述三个前章UI事件索引经公开events数组浅层结构定位确认，未解析整个庞大事件数组；World3/4/5近末world快照仅从文件尾约0.9/0.6/1.6MB定位读取并严格筛level.world=true/id=ChapterN，没有把关内最后观察当大地图。UI索引是63/356/460/499，非仅按缩进估算的旧误差值。

公开WorldGoal坐标分别为Chapter1[91,33]、Chapter2[8,25]、Chapter3[74,15]、Chapter4[54,-3]、Chapter5[-23,-37]（后者与Prism148同格）。**本次KB定位与少量源中没有可认作这些WorldGoal完成的证据**，也未逐事件查所有占位，所以不写“从未经过”。四个正常出口已实测，Goal无需被视为唯一楼梯。第一章东锁44,33、第四章东Goal路径等有限阴性不是全机制不可达。

普通剧情边界已知：Chapter2[2,6]是“冰冻栈桥”碑文（events91/93..96既有记录）；Chapter3[37,24]通天塔已正常复查，无升层UI；Chapter4[2,7]是“世界树海”（events166..169/frame3657231附近），不是电梯。Chapter5 INTERACTABLE48[-44,-16]/49[-44,0]只有旧安全邻位候选，未有本审计可确认的升层或内容证据；不用它们当出口。

## 回访顺序与验收范围

先继续owner当前第五章教学/出口。之后优先核COL105真实开Gate资源、NID14的唯一门邻以及COL205普通剧情/分类；旧7/8/10/11涉及未解的DARK/墙/锁容器规则，保留准确失败和组合前置而非重跑相同封闭域。NID9在3-W完成后可重新审唯一东侧普通通行，NID12允许合法末推者牺牲但cargo拾取需单实測。

本清单是已发现欠项/证据局限，不是新通关或收集正路线。彩叉105与其它unclassified正常取得后再由root按实际同步collectibles/成就/进度；本文只落此MD，零搜索/输入/新JSON/knowledge编辑。
