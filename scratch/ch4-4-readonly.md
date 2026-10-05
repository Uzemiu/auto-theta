# 4-4 同化只读分析与实测闭环

2026-10-03；唯一输入owner resume_slot1_oct03。仅读主JSON、建有限模型和分段建议，不操作游戏、提示、攻略、隐藏实现、存档或主KB。

## 地图与完成结构

runtime assimilation，size8×8，初始P4,4/BOX2,3 Color4；左叉2,1，右叉6,1；BUTTON6,3控制BUTTONGATE6,2；两目标3,7/5,7。仅正常自动教学“是箱子在控制我，还是我在控制箱子”，owner确认完毕，没有主动提示。

```text
8 #########
7 ###GsG###
6 ####s####
5 #.......#
4 #...P...#
3 #.B...b.#
2 ##.###g##
1 ##f###f##
0 #########
```

完成需cargo保fork1。外人由4,4向上推载BOX4,5→4,6→4,7，自己在4,6刺死亡；cargo仍active/ghost0且面W，在4,7单X复制容器至左右两目标3,7/5,7。

## 已验证前置与动态门等待

owner实际初始10 `AAASDSSWWX`，得BOX4,3/free1,3及3,3fork0；DD到12时BOX6,3压button开门/free3,3及5,3。

原手算WDDSASSDDDWWDS不成立：第6S左人4,3撞4,2墙后左转为D，重新把BOX5,3推6,3；第7S BOX至7,3，free仍站6,3/button，门保持开，未让6,1持叉人等待。owner只实测前7、正常undo7回12，证据保留。

成功模型从12态22方向 **WDDDDSASAASSADSDWWWWSA**。模型包含button压力和gate被占用的保持、6,1右叉拾取、closedgate四向等待、同刻装箱与cargo运输；排除未知多向冲突及新X。30k扩展上限内在27470扩展31565seen找到目标，未继续额外搜索。

| 从12后分段 | BOX | H（将持叉） / F（外推者） | 门 |
|---|---|---|---|
|WDDDDSA 7步|5,3|6,3 /5,4|H压button，开|
|SA 2步|5,3|6,1 fork1 /5,4|闭|
|ASS 3步|6,3|H在6,1等三次 /5,3|最后BOX重新压button，开|
|ADSD 4步|6,4|6,3 fork1 /7,3|开|
|WWWW 4步|4,5|cargo4,5 fork1 /5,5|闭|
|SA 2步|4,5|cargo4,5 fork1 /4,4|闭|

WWWW中的第3W：H5,4上行5,5，F7,5北7,6墙而转A推动BOX6,5→5,5，同时捕获H。第4W F6,5同样撞6,6墙转A继续推载BOX到4,5。6,1闭门内三次等待改变双人相对奇偶，从而保持叉1成功装箱；没有先花右叉。

## 独立实测完成核验

完整有效instructions共37字：

`AAASDSSWWXDDWDDDDSASAASSADSDWWWWSAWWX`

主JSON completion **completed=true/time37**。最后WW后载BOX4,7、cargo仍active/ghost0/fork1、外推者4,6 inactive；单X生成两Color4 BOX3,7/5,7及两active contained PLAYER ghost0/fork0，单条世界线，两目标覆盖完成。明确验证活人cargo复制容器，未冒充幽灵纠缠或Blue冲突。

独立读events13：门6,2 blockable=true（右叉取得后封闭）；events15：BOX恢复button，门blockable=false；events21完成克隆状态，与候选分段全匹配。历史7undo/0retry保留；37只统计最终有效instructions长度。

独立模型 scratch/ch4-4-readonly.cjs；owner写主知识库、机制与进度，helper继续按root调度只读协助4-5。
