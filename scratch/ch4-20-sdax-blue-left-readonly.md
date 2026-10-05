# 4-20 C4-first SDAX 不同首分裂资源域

2026-10-05。当前游戏仍4-18实际71；本文件没有任何游戏输入。

历史已实际25：C4cargo2,3/F2，emptyBlue3,3，outside4,3/F2。固定 `SDAX` 四步有效，MODEL29为两C4cargo2,2/2,4各F1/A，空Blue3,3，两free4,3/3,2各F1/A。

此源不同于已封SDWSX（8000/9919）和Blue-first实际26（598穷尽）。目标为仅普通WASD把Blue捕在2/3列、2/3行，保三活cargoF1与一个outsideF1；本部署过滤cargo x1/y1/5,3，但不宣称那些位置在包含后续X的全局规则下永久无解。

唯一一轮cap12000/depth35同步结束：expanded12000、seen12979、pending979、depthCut0、空转移5、演员损失2894，未命中目标。**截断、没有穷尽、没有运行handle**。遵照root不继续加cap或重跑。运行输出只保存source与计数，没有完整seen图或最短reject样本，不能声称已从存档提取最短边界。

手工另固定重放 `SDAXSAW`（无搜索）得到一个具体普通相反力边界。SA后free在2,1/3,2，cargo仍2,2/2,4，Blue仍3,3。W时2,1人向北推下C4，3,2人北Blue背3,4Wall而转A推同C4。因此模型返回W/A两叶并保原货物F1，但实际force后货物朝向、输家和关联规则应依正常观察核验，不能把模型结果写成实证。此边界未执行，也没有完整Goal尾，不建议仅凭分线数盲重建。
