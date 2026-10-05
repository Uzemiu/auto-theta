# 4-22 侵蚀：钥匙资源与顶行输送有限审计

2026-10-04，SaveSlot1，只读助手 `/root/ch3_37_cargo_revisit_oct03`。没有游戏输入、存档/UI/主知识库/主JSON改动、提示、攻略或隐藏实现读取。本文早期只静态/短串审计；后续新的真实34直接X→35两叶及8000普通尾域，完整记录在 `scratch/ch4-22-force-tail-readonly.md`。唯一输入职责已由root交接给 `/root/ch4_1_readonly`，本助手仍只读。

## 历史实际36源（34接DX，不是最新35直接X两叶）

证据：`artifacts/slot1-playthrough/4-22.json` 的 `initial`、实际15/34及 `events[19].observation` 实际36。完整36输入是：

`SSSSSDDDWWDWWDSAAASAXWWDWADDDWWWAWDX`

实际36有六物理箱：C4 BOX87/cargo88 在3,8，C4 BOX90/cargo91 在4,9；两cargo均active、ghost0、contained1、Fork0、key2、faceD。空C4 86/85/84在3,5/6/7，Blue83在5,5；外人89/92在4,6/4,4，均active、ghost0、Fork0、key2、faceD。所有拾物已inactive，11把Lock仍blockable，Goal11,9/12,9未完成。主JSON36是实证，复制箱的运行ID90与模型所用同源标签87不要混淆。

此前实际15安全拿齐Fork2/key2，实际34四C4纵链捕获后仍保cargoF1+outsideF1；现在不建议回退15或重做首X。owner随后可能normalreturn，本文不把计划离关当已发生的世界观测。

## 地形与资源约束

本关无ICE、Prism、Button/Gate。Wall实体优先于同格tile。四C4原列的左邻2,5..8都是真Wall，不能从左把低列普通推向东，也不能向西推入这些Wall。3,3同样是真Wall。

顶行row9：1,9是SPIKE；2..5,9安全；6,9 SPIKE；7,9是Lock；8..10,9 SPIKE；11,9/12,9是Goal。row10及右端13,9为Wall。2,8/2,10与4,10皆Wall。

普通Key复制与分支开锁已有M012/M014；cargo自身Key拾取/开锁有M063/M079/M108。外推者的Key不能隔空箱链开远Lock（M028）。因此不能把“两个外人各key2”当顶行空箱可穿过Lock7,9；必须先有自身带Key的cargo进入或其他正常已证开锁前置。

实际34→DX同时完成两种复制：cargoF1复制C4容器与key2，outsideF1复制外人及key2。因此六箱、两cargo和两外人是实际库存收益；四名角色全Fork0，后续不能再凭空调用X。15直接两次freeX只增加外人，不增加物理箱，亦不能单凭外人数视为满足六箱尾。

## 34的第二X朝向审查

- `WX`：仅模型短串，未要求实测。W后外人3,5受上方四箱链背Wall阻挡、左2,5Wall，转S到3,4，faceS。其X左侧4,4有效，右侧2,4与front3,3均Wall，所以只有一个外人4,4。cargo面W生2,9/4,9两F0箱内角色。2,9的cargo若想向东普通回收，外推者需站1,9 SPIKE；北2,10/南2,8是Wall。该精确普通构型严重受限，不能把它误记为双外人资源。
- `DX`：已经实际35/36闭环。D外人3,5推Blue4,5→5,5并停4,5，cargo面D；X的north3,10Wall，因此cargo改用south3,8（推三空C4南移到3,5/6/7）与front4,9。外人则生4,6/4,4。私有单串复算与真实36的物理/库存匹配。
- `WDX`：只作为历史条件替代短串核。模型cargo仍为3,8/4,9，但外人4,5/4,3，Blue4,6；它尚未实测，也不是当前源或完整解，不要求owner回退试。

## 六箱顶行四D条件尾

构造前态：四个空箱在3/4/5/6,9；两个活cargo在7,9和8,9；free在2,9。Lock7,9已经正常开过（例如7,9 cargo原key2进入后余key1），无额外外人参与同步扰动。六箱无叠体、无冲突。

`DDDD` 单串模型通过，逐态如下：

| D次数 | 四空箱x（y均9） | 两cargo x | 外推者 |
|---|---|---|---|
| 0 | 3/4/5/6 | 7/8 | 2,9 活 |
| 1 | 4/5/6/7 | 8/9 | 3,9 活 |
| 2 | 5/6/7/8 | 9/10 | 4,9 活 |
| 3 | 6/7/8/9 | 10/11 | 5,9 活 |
| 4 | 7/8/9/10 | 11/12 | 6,9 SPIKE亡 |

最终两个cargo仍活、ghost0，覆盖全部两个Goal（模型mask3）。该结果验证的是尾构型的条件几何，不是可达前缀、真实完成或全局六箱必要性。其他箱数、后推接力、多叶Goal分工、碰撞/capture/stack、新机制仍不能由这个构型排除。

## 实际36到尾构型的缺口

实际36的3,9虽然空，但南邻cargo3,8、西邻2,9和东邻cargo4,9让裸外人的普通站位受限。2,9的非SPIKE邻接只有3,9；不能从1,9刺或2,8/2,10Wall假走进去。

低列3,5..8普通横向搬运受左Wall限制。由free3,4输入W上推该纵链，可令cargo3,8到3,9、空箱到3,6/7/8，却会再占据顶行西侧通道；从北向S降低这列则先需要free3,9。cargo4,9也不能垂直退下：向南推者4,10是Wall。由free5,9往西推它是一种条件横向操作，但若进一步推到2,9/1,9便涉及裸推者需踩刺/边界Wall的回收问题，不能无条件称箱可恢复。

因此当前尚无从实际36完整抽出四后箱、开Lock7,9、部署两front cargo并保free2,9的可执行输入串。2,9只是在上述六箱四D候选里的站位条件，不是所有完整解的必需前提。

main的actual36一次ordinary域报告为5000expanded/10522seen/5522pending，depth40，无Goal、未穷尽；这是main提供的范围，不是本助手另跑的搜索。本文不扩大其cap，也不把未命中写成全关无解。

## 可复算方式与停止范围

私有脚本 `scratch/ch4-22-resource-readonly.cjs` 调用main只读模型的公开几何/step，读取实际event19，复算34的WX/DX/WDX与constructed DDDD。运行：

`D:/nodejs/node.exe scratch/ch4-22-resource-readonly.cjs`

脚本不执行BFS、不输出新快照JSON、不读游戏实现。模型不传播异源stack/未知occupied capture；条件尾不使用这些行为。当前封存实际36与六箱尾条件，后续由owner/main选择新的完整前置或进入新教学；不请求盲试未闭合的抽箱片段。
