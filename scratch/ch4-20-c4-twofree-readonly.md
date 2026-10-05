# 4-20 新C4-first SDWSX资源域（2026-10-05，未实测）

初源是已实际C4-first25，固定 `SDWSX` 得 MODEL30：空Blue4,3；C4cargo3,3和2,2各F1/S；free4,2与5,1各F1/S。与已实际新Blue-first26三cargo+onefree的598普通图不同。

仅WASD、保四活F1演员、无X/stack/ghost传播的一轮：cap8000/depth40，expanded8000/seen9919/pending1919/depthCut0，198个第三Bluecargo资源命中，**未穷尽**。程序同步退出，没有运行handle。不扩大这一轮。

最短 `AWWD` 虽捕Blue5,3F1，但另一C4被推1,2，普通运输差；`WSAWWD` 较强，得C4cargo2,4与4,3、Bluecargo5,3、free3,3，各F1，fixed replay全有效。前者普通dead-cell不能算六可运箱充分前缀。

手工进一步 `SAA+X` 虽六载箱，但free1,2分裂因1,3真Wall仅剩一个外人，不能信用双free六链；`SSA+X` 可从2,1/A生两free2,2/1,1，但尚未独立完成六盒运输/全Goal尾，没实测。这些是后续不同部署候选，不是已解决关卡。

root后选4-18出生ICE具体核验，当前未对MODEL30发任何游戏输入。所有旧horse实际26、5undo及有限598/4342历史保留。
