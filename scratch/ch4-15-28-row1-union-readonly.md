# 4-15：actual28 两叶普通尾、底行缓冲及六Goal联合审查

本助手仅做只读模型与实际证据复核；唯一游戏输入者为 `/root/resume_slot1_oct03`。未操作游戏、存档或主知识库，未使用提示、攻略或隐藏实现。以下原候选已由owner正常实测通关：**73有效输入、两叶time52、completed=true**。前文保留历史模型发现与旧ID起点，末节给本次重建的新ID及真实引用。

## 正候选与原域差异

找到两条各22输入的普通尾，两个叶态的**最终同时覆盖**集合union为全部六Goal：

| 真实旧28 axis | 空Color4盒位置 | 22输入尾 | 最终活cargo目标 | mask |
|---|---|---|---|---|
| `[0,0,0]` | 3,6 | `AWWAWDDASSSSDSWWWSSDWW` | 3,6 /6,7 /7,8 | 49 |
| `[1,0,0]` | 5,6 | `DSWDWAAASAAWAWWWDAWAWW` | 1,8 /2,7 /5,6 | 14 |

两叶各保三个cargo alive/ghost0/Fork0，外人最后分别死于7,7/1,7。此正例通过**交叉分配内侧目标**解决原先“每叶承担整侧三目标”的限制：axis0取得左内3,6及右外两目标，axis1取得右内5,6及左外两目标。两叶最终Color4盒都停4,6，活cargo不重叠。

本轮允许BOX落row1，但两叶均1091/1091耗尽、最小BOX y=6、row1状态0，与旧1091普通域计数相同。因此正例**不是**row1、更多状态预算或新机制的贡献。只改变目标分工即可命中。新尾无需X、ICE、新叠箱、融合、冲突或Ghost规则。

历史模型建议流程为：旧已实测28前缀 `AAAWXSAWWDDSSWSSSSSWASAWWXWX` → 确认axis0/1的精确物理seed → axis0上述22尾 → T选axis1 → axis1上述22尾。起初保留“必要时末T核最大time”的审查项；实际最后W已直接触发完成，**无需末T，共73输入**。旧28每线time30，两22尾真实均time52。执行前的35属于另一次回访，owner正常undo35回0重建28，未把尾误接到35。

## 真实起点与ID对应

仅读 `artifacts/slot1-playthrough/4-15.json` **events[28].observation.level**：instructions=`AAAWXSAWWDDSSWSSSSSWASAWWXWX`，两timelines、time30、dialog=false、completed=false。events[29]为该旧28对应后续记录，脚本固定sourceEvent28。

| 对象 | axis0 `[0,0,0]` | axis1 `[1,0,0]` |
|---|---|---|
| 空C4 BOX48 | 3,6 | 5,6 |
| Blue BOX49 /cargo51 | 2,6 | 2,6 |
| 中Blue /cargo | BOX52 /53在4,6 | BOX54 /55在4,6 |
| Blue BOX56 /cargo57 | 6,6 | 6,6 |
| outside PLAYER50 | 4,4 | 4,4 |
| 排除的已masked兄弟 | BOX54 /PLAYER55在3,6 | BOX52 /PLAYER53在5,6 |

四名有效PLAYER均active/ghost0/split0/faceW；三个cargo contained1且container指相应Blue，outside contained0。全部有效BOX height1，无stack。末Fork KEY46已inactive。脚本只载入active且maskedoff=0实体，不能把兄弟残影当额外箱或玩家。

## 有界结果与模型范围

自有脚本 `scratch/ch4-15-28-row1-union-readonly.cjs` 从上述实测seed建立每叶ordinary图；普通核心复用 `scratch/ch4-15-readonly.cjs`，同旧 `ch4-15-revisit-tail-readonly.cjs`，加入M015 size+1边界wrap。真实Wall优先于同格SPIKE/Goal，ICE4,5正常微tick，BOX普通链推和cargo随箱移动。不读任何隐藏游戏实现。

| 范围 | axis0 | axis1 |
|---|---|---|
| 预设cap /depth | 10000 /50 | 10000 /50 |
| expanded /seen | 1091 /1091 | 1091 /1091 |
| 未展开 /深度截断 | 0 /0 | 0 /0 |
| 最深最短path | 40 | 40 |
| BOX row1状态 /最小BOX y | 0 /6 | 0 /6 |
| 最少活cargo | 3 | 3 |
| same-origin重叠拒绝 | 0 | 0 |
| independent stack拒绝 | 0 | 0 |
| 推力冲突拒绝 | 0 | 0 |

没有BOX y<=1剪枝；row1停放仍受真实row0 Wall及普通推者站位限制，未虚构拉箱或北向回收。允许outside正常死亡；没有outside的稳定cargo态记录覆盖后停止普通展开，因为cargo自身不能平移箱体。未建新同源融合、异源stack、冲突或Ghost转移，若出现则明确拒绝记录，不能当它们不存在；本两叶没有遭遇这类边界。所有有效Fork0，因此ordinary哈希省略face不影响移动几何。

每个mask取BFS第一次出现的**最终当前帧**最短path，不累计“曾经踏过”目标。bit顺序为 `3,6 /2,7 /1,8 /5,6 /6,7 /7,8`。两叶所有mask对中有3对union63，最短总尾为49+14，各22；其它两对为28+35、42+21，较长，不优先执行。未称这是所有正常游戏机制的图，也未证明全局最短。

## 独立单串replay和重点检查点

另用未经修改的旧tail脚本各作一次single replay，结果与新脚本完全一致：

```powershell
& 'D:/nodejs/node.exe' scratch/ch4-15-revisit-tail-readonly.cjs right replay AWWAWDDASSSSDSWWWSSDWW
& 'D:/nodejs/node.exe' scratch/ch4-15-revisit-tail-readonly.cjs left replay DSWDWAAASAAWAWWWDAWAWW
```

旧脚本的 `right` 表示C4初3,6，对应axis0；`left` 表示C4初5,6，对应axis1。这些名称只属旧整侧目标标签，不能代替真实axis识别。single replay不是新增BFS。

axis0的cargo顺序为51/53/57，axis1为51/55/57。下面表格保留原模型中间态和旧ID；尾现已实际吻合，重建ID不同，见末节。

| axis0尾输入数 | cargo51 /53 /57 | C4 BOX48 | outside50 |
|---|---|---|---|
| 0 | 2,6 /4,6 /6,6 | 3,6 | 4,4 |
| 5 `AWWAW` | 2,6 /4,6 /6,6 | 3,6 | 1,6 |
| 7 `DD`后 | 4,6 /6,6 /7,6 | 5,6 | 3,6 |
| 16（第二次向上推） | 4,6 /6,7 /7,6 | 5,6 | 6,6 |
| 17 `W` | 3,6 /6,7 /7,6 | 4,6 | 5,6 |
| 20 | 3,6 /6,7 /7,6 | 4,6 | 7,5 |
| 21 `W` | 3,6 /6,7 /7,7 | 4,6 | 7,6 |
| 22 `W` | 3,6 /6,7 /7,8 | 4,6 | 7,7裸死 |

**axis0尾17的关键回弹：**free6,6尝试W推6,7 cargo箱，但其背6,8为Wall；转A，推动空C45,6和相邻Blue49在4,6一起左移，使C4到4,6、cargo51到左内Goal3,6。free自己留5,6（安全），并不进SPIKE4,6。此前两个D的长箱链只横送箱，cargo不会按裸人SPIKE死亡。尾22的cargo进入7,8Goal，推者裸到7,7SPIKE才死。

| axis1尾输入数 | cargo51 /55 /57 | C4 BOX48 | outside50 |
|---|---|---|---|
| 0 | 2,6 /4,6 /6,6 | 5,6 | 4,4 |
| 5 `DSWDW` | 2,6 /4,6 /6,6 | 5,6 | 7,6 |
| 7 `AA`后 | 1,6 /2,6 /4,6 | 3,6 | 5,6 |
| 16（第二次向上推） | 1,6 /2,7 /4,6 | 3,6 | 2,6 |
| 17 `D` | 1,6 /2,7 /5,6 | 4,6 | 3,6 |
| 20 | 1,6 /2,7 /5,6 | 4,6 | 1,5 |
| 21 `W` | 1,7 /2,7 /5,6 | 4,6 | 1,6 |
| 22 `W` | 1,8 /2,7 /5,6 | 4,6 | 1,7裸死 |

**axis1尾17的关键箱链：**free2,6直接D推空C43,6及其前Blue56在4,6，一起右移，使C4停SPIKE4,6而仍为普通空箱、cargo57到右内Goal5,6。free自己3,6安全。尾22cargo到1,8，推者才裸死1,7。两条尾均在17之前保outside活，不会把箱可踩刺当作玩家可踩刺。

## 全部mask的最短尾

以下是本轮同图完整结果，便于审查“改变目标分工”而非只看整侧目标。空串为seed当前无Goal。

| mask | axis0最短path | axis1最短path |
|---|---|---|
| 0 | 空串 | 空串 |
| 1 | `AWWAWDD` | `AWWAWD` |
| 2 | `AWWW` | `AWWW` |
| 3 | `AWWWSSSSDSWDWAAW` | `AWWWD` |
| 4 | — | `DSWDWAAASAAWAWWAWW` |
| 5 | `DSWDWAAASAAWAWWAWW` | — |
| 6 | — | `DSWDWAAASAAWAWWWWAWW` |
| 8 | `DSWDWA` | `DSWDWAA` |
| 9 | `AWWAWD` | `DSWDWA` |
| 10 | `AWWWDW` | `AWWWDS` |
| 11 | `AWWWD` | `AWWWSSSSDSWDWA` |
| 12 | `DSWDWAAASAAWAWWAWDAW` | — |
| 13 | — | `DSWDWAAASAAWAWWAWDAW` |
| 14 | — | `DSWDWAAASAAWAWWWDAWAWW` |
| 16 | `DSWW` | `DSWW` |
| 17 | `DSWWWA` | `DSWWWW` |
| 18 | `AWWWSSSSDSWW` | `AWWWSSSSDSWW` |
| 19 | `AWWWSSSSDSWWWA` | `DSWWSAAWAWWWD` |
| 20 | `DSWDWAAASAAWAWWAWDDASSSSDSWWWSSAAWAWWWAW` | `DSWDWAAASAAWAWWAWDDASSSSDSWWSAAWAWWWAW` |
| 21 | — | `DSWDWAAASAAWAWWAWDDASSSSDSWWWSSAAWAWWWAW` |
| 24 | `DSWWW` | `DSWWSAAWAWWAWDDW` |
| 25 | `AWWAWDSSSSDSWW` | `DSWWW` |
| 26 | `AWWWSSSSDSWWW` | `DSWWSAAWAWWWDS` |
| 27 | `DSWWSAAWAWWWD` | `AWWWSSSSDSWWW` |
| 28 | `DSWDWAAASAAWAWWAWDDASSSSDSWWSAAWAWWWAW` | — |
| 32 | `AWWAWDDASSSSDSWDWW` | — |
| 33 | — | `AWWAWDDASSSSDSWDWADW` |
| 34 | `AWWAWDDASSSSDSWDWAASSAAWAWWWSSSSDSWWDW` | `AWWAWDDASSSSDSWDWAASSAAWAWWWDASSSSDSWWDW` |
| 35 | — | `AWWAWDDASSSSDSWDWAASSAAWAWWWSSSSDSWWDW` |
| 40 | — | `AWWAWDDASSSSDSWDWW` |
| 41 | `AWWAWDDASSSSDSWDWADW` | — |
| 42 | `AWWAWDDASSSSDSWDWAASSAAWAWWWDASSSSDSWWDW` | — |
| 48 | `AWWAWDDASSSSDSWWSDWW` | — |
| 49 | `AWWAWDDASSSSDSWWWSSDWW` | — |

仅保存一份报告和一个自有cjs，无新每步JSON。已把positive、真实ID起点、尾17与末态同步root/owner/main；没有新增搜索，以下仅补owner实际闭环。

## 正常实测闭环：73输入完成

本助手与root分别独立读取主 `artifacts/slot1-playthrough/4-15.json`，定位 **completion.level、run及events[136]/[137]/[143]/[145]/[153]/[155]**。原旧28 events[28]仍保留，未把两次回访ID混用。

owner先正常undo35回0，再执行已证28前缀；events[136]/[137] 真实重建28，两个axis time30，C4分别3,6/5,6、outside50=4,4、各三cargo2,6/4,6/6,6。events[137].note明确累计107undo/1redo/0retry，本次重建用normalundo，不是retry。

| 重建对象 | axis0真实种子与终点 | axis1真实种子与终点 |
|---|---|---|
| Blue BOX49 /cargo56 | 2,6 → **3,6** | 2,6 → **1,8** |
| 中Blue /cargo | BOX57 /58：4,6 → **6,7** | BOX59 /60：4,6 → **2,7** |
| Blue BOX61 /cargo62 | 6,6 → **7,8** | 6,6 → **5,6** |
| 空Color4 BOX48 | 3,6 →4,6 | 5,6 →4,6 |
| outside50 | 4,4 →7,7死 | 4,4 →1,7死 |

所有最终cargo均active=true、ghost0、split0、contained1，container分别49/57/61或49/59/61；outside50两支均inactive/ghost1/contained0。masked兄弟在axis0为cargo60（BOX59），axis1为cargo58（BOX57），不参与覆盖。与历史模型ID51/53/55/57不同，只是重建实例ID变化，资源与坐标吻合。

**axis0尾17实际：**events[143] 为45总输入、axis0 time47、axis1 time30。实际cargo56=3,6、58=6,7、62=7,6、C448=4,6、outside50=5,6，均对应模型W反弹后的箱链。events[145] 为50总输入，axis0 time52，右侧三目标覆盖完成、axis1仍time30。

T切线后，**axis1尾17实际：**events[153] 为68总输入、axis1 time47，cargo56=1,6、60=2,7、62=5,6、C448=4,6、outside50=3,6，与模型D链推取对侧内Goal吻合。

events[155] 和 **completion.level** 均真实 completed=true，instructions为：

```text
AAAWXSAWWDDSSWSSSSSWASAWWXWXAWWAWDDASSSSDSWWWSSDWWTDSWDWAAASAAWAWWWDAWAWW
```

**run.action_count=73、run.completed=true**；两叶time52，mask0=49、mask1=14，union63。最后W直接触发完成，无末T、无dialog。events[156] 是正常return后的Chapter4世界，不是另一个未完成4-15状态；已保存的completion仍保完整终帧。

成功尾从未使用row1箱或未验证Ghost/新ICE追尸、stack、融合、额外冲突，全部箱尾位y>=6。成功关键是联合任意目标分工：左内归右外叶、右内归左外叶，而非每叶独占整侧三目标。旧1091/208等有限报告只能保其旧谓词/资源范围，不能扩大成游戏无解；本真实完成直接证实原整侧目标谓词过窄。

保存/总进度由root与owner核对和写主KB，本助手未读写存档；owner称root已核通关数112。至此只读报告闭环，未新建JSON、未扩BFS预算、未操作游戏或改主KB，等待后续明确分工。
