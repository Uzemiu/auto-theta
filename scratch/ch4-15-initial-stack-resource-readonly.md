# 4-15：AAAWX后先叠独立空箱的有限资源域

2026-10-04，只读 `/root/ch3_37_cargo_revisit_oct03`。唯一输入 owner 为 `/root/resume_slot1_oct03`。仅读取正常initial、现有自建普通stack模型和机制；未操作游戏/存档/主KB，未读提示、攻略、隐藏实现。本轮只新增本报告及同名CJS，没有每步JSON或后台搜索。

## 种子与边界

从已知初态 `AAAWX` 得 free[3,2]/[5,2]，两者Fork0；独立BOX48(Color4)[6,2]和BOX49(Color3)[2,2]，空箱；Fork4,2已收取并消费，Fork4,5(ICE)/4,6(SPIKE)仍未取。

自有 `ch4-15-initial-stack-resource-readonly.cjs` 调用 `stack-cargo-readonly.cjs` 的公开自建普通移动API。48与49用独立source mask区分，允许两者同刻同格形成mask3；不是M107同源融合，也不是Color3/4按颜色合并。该泛型模型依据正常M052/M055/M084等观察，不是游戏代码。

泛型API不支持ICE。因此仅在内存clone中把ICE4,5标为SOLID以便解析，之后拒绝**任何角色或BOX落入4,5**，没有把该格当真实普通地面接受路径，也没有把它当墙改变回退。每次普通WASD只移动一格，所有会落ICE的候选在转移后被排除；不模拟ICE续滑或叠体在ICE上的行为。

phase1保持恰好两名free、Fork0、无死亡/ghost/cargo，物体不入row1、任何角色或物体不入GOAL/ICE；只允许WASD，不允许后续X/观测/推力冲突。first stack若命中，要求在该实际模型状态存在至少一个下一普通输入，保两free并让合体移动到域内另一格，作为最低可动回收见证，不能只把封死角落的重叠当正候选。命中即停止，不搜后续cargo X。

## 有限结果

复现：工作区运行 `D:/nodejs/node.exe scratch/ch4-15-initial-stack-resource-readonly.cjs`。

| 指标 | 结果 |
|---|---:|
| cap / expanded | 10000 / 10000 |
| seen / queue | 11197 / 11197 |
| 尚未展开队列 | 1197 |
| 普通转移检查 | 40000 |
| 有可动见证的首次空箱叠体 | 尚未命中 |
| queue exhausted | false |

这是截断边界，不是域已穷尽，也不是关卡无解。没有盲目扩大cap、没有生成另一个10k搜索轮；目前不能给owner具体firststack前缀，更不能给stack+cargo+outside完整阶段或通关前缀。

## firststack之后仍缺装载前置

无ICE且仅两外人的普通首次空箱碰撞，需要两名推者分别推动两个独立body；同一推链按相同方向移动不能把两body压成同格。若两body分别进入同一落点q，其各自推者输入前在q沿推向后退两格，因此两推者输入前同奇偶，输入后各走一步仍同奇偶。合体是一个格位body；高度2不等于两个相邻可推链格。

随后若一人普通推动单body一格，另一名移动free同刻落入body新格以被活捕，前者旧位置与后者旧位置需异奇偶。这条限定单body移动捕获约束不推广到M078双body推链、ICE额外微步或普通wait。

为检查普通wait能否补这项资源，额外只做静态放置枚举（不是BFS）：真实Wall优先，free安全格含直接GOAL、排ICE，共36格；单body合法地面排Wall/ICE/GOAL/row1，共28格；1008对放置中，没有一个free四个方向全被墙或“body背后是墙”阻挡。地刺作为可进入但会死的地面处理，不能误当阻挡来制造假wait；另一free也不当墙。因此在这个受限单body域，没有已证普通原地wait来破坏双人同奇偶。

剩Fork4,5本身位于ICE，第二Fork4,6在SPIKE；完整Fork2载人叠体路线必然需要新的资源/地形处理。普通模型这轮故意不接收ICE状态，不能拿其规则直接模拟“叠体滑动后捕获”“载人叠体拾两叉”或复制整叠。可用的其他方向包括具体ICE微步、尚未失去的额外body/角色、正常捕获/观察前置，但本报告没有提供可执行正候选。

## 复制整叠仍是独立待证机制

即使之后有真实两层载人stackFork2，也不能直接套用M098单层Color4载人箱复制或M107同源单层融合，断言一次cargo-X会复制整两层。须在实际短probe核源ID、两层height/container、cargo继承、出生侧和活箱总数；目前既没有这个真实前置，也没有执行探针。

本报告只将“AAAWX后先独立空箱叠加”与旧26单层cargo-X、43/44真实stack观测域区分记录；保留新域有限边界，不记完成，不改变已实证机制，不要求owner盲试、回退或暂停。
