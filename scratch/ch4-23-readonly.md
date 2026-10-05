# 4-23 蛇：只读完整候选与实测同步

2026-10-04。sole input owner `resume_slot1_oct03`；本助手只读观察数据，写本报告/同名 CJS。未操作游戏、提示、隐藏实现、存档或主 KB。

## 真实地形

Template4/snake，size10×10，边界0..10墙；**唯一SPIKE(9,5)**。Blue74(4,2)、C490(5,2)，P91(1,5)。Goal(3,5)/(5,5)。Fork共15个（按实体数，不用“十二”的口述计数）：(1,3)，(9,6/7/8/9)，(8,7/9)，(7,7/9)，(6,7/9)，(5,9)，(4,9/8/5)。无ICE/LOCK。北部需通过载人箱保护跨9,5，不能裸取蛇道第一叉。

## 完整52（已真实完成）

`SSSDXDDDAAAAAWDSSDDDDDDSDDWSAAWDSDWWWWWXAXXXXXXXSXXX`

四段：已实际 `SSSD`4；首C4捕获19 `XDDDAAAAAWDSSDDDDDD`；缓冲输送15 `SDDWSAAWDSDWWWW`；cargo蛇道14 `WXAXXXXXXXSXXX`。固定整串replay有效，owner已逐段真实执行52/time52，**completed=true**，11undo/0retry，最终同叶mask3（3,5与5,5各活cargoF0/ghost0），无fork推力冲突或异源叠箱。

|绝对输入|模型检查点|分段目的|
|---|---|---|
|4|P(2,2)F1/D，原箱4/5,2|安全拾首叉，已实际|
|8，4后XDDD|双F0(5,1)/(6,2)，Blue7,2/C48,2|右移初水平双箱，不丢资源|
|17，接AAAAA WD SS|双F0(4,1)/(1,2)，箱7/8,2不动|只安全下房移动|
|22，接5D|双F0(9,1)/(6,2)，箱7/8,2不动|右人靠东墙，使D转W|
|23，单D|C4cargo(9,2)F0/W，Blue8,2，outside7,2/D|双箱右推；9,1人同刻向北落入右端C4|
|27，SDDW|C4cargo9,3、Blue8,2、outside9,2|先抬领头cargo|
|32，SAAWD|C4cargo9,3、Blue9,2、outside8,2|把Blue接到后方|
|34，SD|C4cargo9,3+Blue9,2、outside9,1|竖链背后站位|
|36，WW|cargo9,5安全、Blue9,4、outside9,3|载人箱跨刺前一拍|
|37，W|cargo9,6F1、Blue9,5、outside9,4|保护拾第一蛇叉|
|38，W|cargo9,7F2、Blue9,6、outside死9,5|缓冲多提供一拍，取得第二叉|
|40，WX|cargo8,7/9,8，均F2|分裂出生分别花1再拾1|
|48，接A+7X|cargo4,8F2、低cargo4,7F0等旁支|Fork链向左到4列|
|49，S|仅改cargo全局faceS|无外人，不移动BOX|
|50，X|旧低BOX4,7被推4,6；新高child4,7F1|用出生推力跨无叉段|
|51，X|旧低BOX到4,5拾末叉F1；高child5,7F0|被推动的旧cargo也能拾叉|
|52，X|Goals3,5/5,5均活cargoF0/ghost0|最后fork左右分裂完成模型目标|

首捕获定向小图只搜索固定Boxes7/8,2的双F0站位，94 expanded/105 seen/11 pending正命中，无深度截断。并未运行全关巨量BFS。捕获关键是右端C4作领头，Blue作后缓冲；仅左端Blue捕获不能直接套同一竖链顺序。

14蛇道尾由resource助手独立单串核验（`scratch/ch4-23-resource-readonly.cjs/.md`），主助手再从initial拼接52全串复核。实测43的关键9,8融合为 **F0 child103 + F1 cargo99 → 活cargo99 F1**，不是两F1。本例直接支持max而非相加，但不外推任意颜色/资源优先级。owner37/38保护拾叉、48的4,8F2/4,7F0缓冲、50/51推动旧F0 cargo取末叉、52双Goal均有直接帧。

## 实际历史

- owner先实际4=`SSSD`，P(2,2)F1/D，箱未动，0undo/0retry。
- owner独立手工候选 `SSSDSDWXDSDDSWW` 到15，**真实Blue捕获**：cargo91/Blue74(5,2)F0/W、outside92(7,2)F0/A、C490(6,2)。历史保留；该捕获不是右端C4领头。
- owner正常undo11回4，随后按上述52分段核。最终主JSON明确completed=true；旧Blue捕获历史完整保留，没有retry。

本助手收到owner完成消息后独立读取主JSON最终52与43融合帧核对，才把报告从条件候选更新为真实完成。主KB、进度计数、正常return存档由owner/root负责。

复核：`node scratch/ch4-23-readonly.cjs full`；`replay <完整串>`；`capture`是原94态小图。程序只有读取JSON/私有计算，不含游戏API。
