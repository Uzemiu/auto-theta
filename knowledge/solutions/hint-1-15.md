# 1-15 启示 ?lock

通过原关暂停菜单“获得启示”进入简化谜题，属于正常游戏内提示使用；原1-15在此之前已经独立解开。证据：[hint-1-15.json](../../artifacts/slot1-playthrough/hint-1-15.json)。

成功动作 `WDXDDDSWWWWSSDDAAAWWDDDD`，24步；0撤销、1重试，重试前用DDD实测按钮。按钮[4,2]或[5,2]各自单独均打开闸门[6,2]。候选由scratch/hint-or-gate.cjs和hint-lock-config.json生成并全部实测。

完成后自动回原1-15初始，未显示新奖励。主agent只读核验存档总数仍31、没有?lock的LevelState/LevelRecord，因此不作为第32普通关记录。
