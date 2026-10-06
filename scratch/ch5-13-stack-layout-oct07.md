# 5-13 stack：公开静态地图/条件尾（2026-10-07）

第二helper只读审计，sole input owner为slot1_owner_oct06；primary负责动态路线。本文零动态搜索/游戏输入，不用提示，不读hidden/save/UI-api，不改主JSON/KB，不产额外JSON/队列/后台。不由runtime stack补造堆叠规则，不加所有free必须存活的限制。

## 源与已发生的row2阴性

canonical `artifacts/slot1-playthrough/5-13.json` **fresh0 event0/frame7564940**，runtime stack，58 entities/111 tiles/size9,12/min0,0。P54[3,2]/S/F0、Fork52[4,3]与Fork51[6,11]，唯一Shadow53[6,5] active/Color1，Goal45[1,8]与Pri55同格，relay56[1,2]/57[1,9]。

BOX/三Pri均active、height1、mask0、contained0/container-1、motion0/src-1/ext0、pushable/blockable=true；53.Shadow=true，三Pri.Shadow=false/Color1，fresh光flags均false。Player.active/key0/ghost0/free。两Fork均isFork=true，不能当普通钥匙。Buttons46[7,1]/47[4,10]/48[3,10]，Gate49[0,8] ID0与Gate50[5,11] ID1，fresh闭；Button本身details={}，**不能只凭排列推断双钮OR/AND或配对**。

actualDW2 event2/frame7576563：P54[4,3]/W/F1，52 inactive、51仍active，53原6,5活。owner后续公开观察：

|实际/源|P54/F1|Shadow53|备注|
|---|---|---|---|
|7 event6/frame7600880|6,6|6,5 active|singleD到南推侧的上方|
|8 event8/frame7603065|6,5|6,4 active|S1|
|9 event10/frame7605204|6,4|6,3 active|S2|
|10 event12/frame7607268|6,3|**6,2 inactive**|S3实际阴性|

准确10串`DWWWDWDSSS`。实际10的56仍traversed=false/testCompleted=false，55/57 traversed=true/testfalse，level.completed=false。**不能以56.traversed=false否认本具体消影边界，也不能再把inactive53当可推资源。** 这是已有owner实际输入，本文只读记录。若未来选择正常Undo1可回9，但本文未请求或执行撤销，owner无须驻关等报告。

## Goal.floor与完整地形覆盖

Goal45[1,8]缺tiles条目，由active GOAL.floor=true提供安全地面。Gate0,8/5,11底下均为公开SOLID；闭Gate仍blockable不可进入，不能因其有Floor跳过门。

45个Wall完整分组：

- 左x0的y0..7与9..12 Wall，唯一0,8为Gate49。
- 底y0的x1..6与9,0 Wall；7,0/8,0是裸SPIKE，**不是完整底Wall**。
- 顶y12的x1..7 Wall。
- 上左1,11与2,10/2,11 Wall。
- 内5,8/5,10、6,10 Wall。
- 内右x7的y3..11 Wall，以及8,3与9,1/9,2/9,3 Wall。

raw16 SPIKE：1,7；2,y2..7与2,9；5,9；7,0/7,2/7,8；8,y0..3。只有7,8与8,3同格Wall覆盖，其余14格裸SPIKE。无ICE/DARK。裸刺2列不能作为“等待墙”；尤其2,8是安全Floor而2,7/2,9是刺。

```
       x=0123456789
y12      ########
y11      ###..gK#
y10      #.#bb###
y9       #R^..^.#
y8       gR...#.#
y7       #^^....#
y6       #.^....#
y5       #.^...B#
y4       #.^....#
y3       #.^.K..###
y2       #R^P...^^#
y1       #......b^#
y0       #######^^#
```

右上x8/9的缺图位置没有公开Floor，不能补成走廊或wrap。图仅定位，实际推侧以Floor合并Wall/门覆盖为准。

## Pri方向与Shadow6,2的对齐

|Pri|北轴|南轴|西轴|东轴|
|---|---|---|---|---|
|56[1,2]|1,3..6 Floor、1,7 SPIKE后55[1,8]|1,1 Floor后1,0Wall|紧邻0,2Wall|2,2SPIKE后3..6,2Floor，再7/8,2SPIKE及9,2Wall|
|55 Goal[1,8]|紧邻57[1,9]|1,7SPIKE、1,6..3Floor后56[1,2]|紧邻Gate0,8闭|2..4,8Floor后5,8Wall|
|57[1,9]|1,10Floor后1,11Wall|紧邻55[1,8]|紧邻0,9Wall|2,9SPIKE、3/4,9Floor、5,9SPIKE、6,9Floor后7,9Wall|

6,2是56的直接东向同排，1,2到6,2之间没有Wall/Prism/邻BOX挡物；2,2是SPIKE而非Wall。实际10阴性与此几何相容，未隔离全部折射机制，不把它写成任意Shadow过任意光轴必灭。普通玩家站在6,3不是邻BOX遮光盾，不能据活玩家给53@6,2发active许可。

56可普通上推：free1,1推N目的1,3有Floor；可下推：free1,3推S目的1,1有Floor，但再向南1,0Wall。东西推受0,2Wall推侧/目的限制。移动56会改变整列/东横轴，不能仅将它挪一格便自动视作影已安全穿row2：移动时的中间Shadow同排、后续过新光轴均仍须primary/owner实际核。

55北推将同时接触57，前方1,10 Floor但推者1,7是裸SPIKE；南推需站1,9但57占；西推需要free2,8，Gate0,8必须open；东推需要free0,8，门闭时不能站。57横向受x0 Wall推侧/目的；free1,10单S可尝试把57+55整链南推至57[1,8]/55[1,7SPIKE]，但Shadow/棱镜光学与Goal由另一Pri覆盖的判定均未实测，本文不自动当绕过按钮解。

## Button7,1与GoalPri的安全条件尾

Button7,1四邻：W6,1安全，N7,2/S7,0/E8,1均裸SPIKE。**有active空箱[6,1]+free[5,1]时singleD可安全压钮**，箱→7,1、推者→6,1，不必牺牲末推者。不要接第二D，把箱推进8,1而人留7,1会释放Button；向北/南重新操作时裸刺推侧也不能忽略。

初影沿col6下运到6,1会先经过已实际阴性6,2，因此这不是已可部署前缀。若有新actual活箱出生/改Prism光路或其它合法运输，压钮才成为候选。空Shadow持久压钮、7,1→Gate49配对与门open由actual验收，不能凭Gate.ID0直接授配对。

若某active BOX已持久压7,1、Gate49[0,8].blockable实际false，至少一effective free合法站2,8，**singleA把55推到0,8、free占Goal1,8**。目的0,8是公开Gate/Floor，不越界、不推进-1,8；验completed，以自动返回为止。允许前一位推者死亡，但不能把死者当仍可走尾。

具体安全单角色尾：从3,2 **WWWWWWAA** 到3,8→2,8→Goal1,8；整个3列y3..8均safe Floor，避2列刺。若此前singleD送箱后free在6,1，则**AAAWWWWWWWAA**经3,1/3,8到同Goal（12方向）。这两串均是门已open/按钮箱不动的条件导航，未模拟另一free或cargo自动响应，不把它们拼成当前10的完整解。

若仅活PLAYER踩7,1，后续每个安全A会离开按钮，W/S/D则去裸刺，不能普通hold等待其他人走长尾。尸体是否继续压钮、门移动同刻保持或cargo条件不作猜测；本报告优先持久active BOX方案，仍允许已校准的牺牲方案改变资源。

## 上双钮、Gate5,11与第二Fork

Button3,10四邻：N3,11/S3,9/E4,10安全，W2,10Wall。Button4,10四邻：N4,11/S4,9/W3,10安全，E5,10Wall。两钮相邻但没有公开AND/OR参数，本轮未见压钮效果，必须actual读取Gate50，不将“同时按两钮”硬写成要求。

Gate50[5,11] ID1连接4,11与Fork51[6,11]；6,11的N6,12/S6,10/E7,11均Wall。**第二Fork死袋仅从左Gate进入**，没有右/下绕路。若门已open，free4,11用DD可到6,11取叉；门能否在玩家释放按钮/穿门后保持，以及取叉后是否能回5,11，都需要actual。不能把2个Fork实体数当已经有两个额外X资源，pickup/split以实际字段为准。

普通空箱可持续压上钮的静态侧：box3,9/pusher3,8单W→3,10，或box4,9/pusher4,8单W→4,10，两个推者格均safe；box3,11/free4,11单A→2,11Wall不能西送，应分辨目的。上影移动通过row8/9时分别对齐55/57东轴、5,9本是刺，活性与推者路线须actual；唯一原Shadow53在下部并非两个现成上钮箱。

若实际双钮需要两人同时站3/4,10，离开一钮去4,11不自动仍开Gate；若只需其中一钮、或已有active BOX持压，则资源条件不同。本文不根据还未隔离的门关联宣布Fork不可达或全关无解，也不强迫owner为静态报告暂停。

本报告ready，**零图/输入，无handle/后台**。actual10阴性、safe西推按钮与条件Goal尾、上死袋Fork及配对未知均已发owner/primary/root；主动态与全成就推进仍由唯一owner实测。
