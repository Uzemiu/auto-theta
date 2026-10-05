# 2-G 搜索保存事故与暂停记录

用户已要求暂停并整理提交。当前没有活搜索，不启动新根、不扩大窗口；游戏/存档/canonical 文件均未由本助手操作。

## 实际终态

原 TTY48564 / PID49036 同 source60 frontier 在 expanded1820000、seen2529619、pending752053、maxDepth55、depthLimit60、depthCut0/deferred0、forces1893/maxLeaves3、hit=null 后，自动保存发生 `RangeError [ERR_OUT_OF_RANGE]`，工具明确返回 exit1。不是正常完成1844263窗口，也不是游戏retry。historicalHits7、completedParentRemainders4；此前容量回扫6750489动作/1356force/qualified3全部knownActualLayouts的统计仍保在报告。

当时 `v8.serialize` 生成2150311021字节 Buffer；原 `fs.writeFileSync` 直接打开并截断 current 后，单次 writeSync 的长度超过2147483647上限。已只读确认 `artifacts/solver-frontiers/m131-model60-current.v8` 为0字节，mtime2026-10-05 13:22:52，无同名前缀temp/备份。相关process已结束；先前原巨队列handle均已terminal。因此不是只丢最后20k未保存窗口，而是唯一完整巨q/seen/heap/done/deferred/history持久化副本不可恢复。不能将新根复建称为同frontier续跑。

最后 stdout 保存的是统计证据，不含完整队列。真正moving perpendicular/preLeftAtLeast3累计10次是历史计数；runner每类别只存一个最短witness，而且该witness字典也随唯一巨checkpoint丢失。不能从这个计数伪造3条精确parent/瞬态候选。暂停后未做新BFS或补扫。

## 仍保留的证据

完整游戏主journal由owner保留，未受本事故影响；本助手未输入游戏。actual98/102固定probe、实际校准报告、各raw前缀及历史容量回扫文本仍在scratch。两个派生ordinary已封小checkpoint仍完整：strong38为2197546字节，strong42为2109506字节。它们不能代替原source60巨frontier。

1820000之前本轮归档：parent2413439 raw40的ordinary组件桥固定核通过；TTY48564从1748972恢复，history5→6，补父A/S/D；末D同组件又归档history6→7。原组件覆盖只限finite ordinary/noCargo/noX/noDARK，非actual duplicate、非关卡无解证据。0字节current保留用于事故元数据，没有自动删除其他agent文件。

## 必要保存修复（仅私有程序）

新增 `ch2-G-checkpoint-io-oct05.cjs`：序列化完成后写独立`.writing.<pid>`临时文件，每次Buffer.subarray至多64MiB、offset0，处理partial write，fsync并close后再rename替换current；失败保旧current和可诊断temp。读取也分64MiB，拒绝0字节/截短文件，避免readFileSync的单次大文件限制。原runner只换保存/加载函数，没有改物理规则/搜索policy或启动process。该修复不能恢复已丢队列。

独立小验证 `ch2-G-checkpoint-io-check-oct05.cjs` exit0，耗时0.61秒：67109187字节V8 roundtrip（64MiB+257字节payload）、65次强制partial write全部match，existing current替换成功；注入第2次write失败后prior current字节不变，temp为13字节。仅移除明确test-owned两个文件，没有动0字节solver current。未做multiGiB或大搜索验证，不声称大队列已保存。runner的node --check另通过。

所有搜索handle当前terminal：48564 exit1（本次保存上限）；此前42207、8708、6542等各按既有工具证据exit0。无新PID。canonical建议仅由root在进度说明中记录“计算暂停、派生frontier损盘、原game历史完整”，不要将模型事故计为游戏Undo/Retry或通关变化。
