# 存档说明与 GPT 游玩约定

更新日期：2026-09-22。路径和使用 slot1 的要求由用户指定；以下字段已读取本机文件核实。

## 存档目录

```text
C:\Users\Administrator\AppData\LocalLow\DeltaTheta\Theta and Paralldox on Worldlines
```

- `SaveSlot0.es3`：保留的原有存档，不用于本次从头游玩。
- `SaveSlot1.es3`：用户指定的 GPT 自动游玩存档（save slot1）。这里的 1 指文件和设置中的编号，不推测界面是否使用从 1 开始的显示编号。
- `Settings.es3`：游戏设置及上次使用的存档编号。
- 相应 `.bak` 文件：游戏目录中已有的备份文件；实验开始前另外在项目 `artifacts/` 下备份。

## 指定游戏启动存档

在 `Settings.es3` 中将 `Settings.value.LastUsedSaveSlot` 设为数字 `1`。以下仅为字段位置示意，不能用这段片段覆盖整个文件：

```json
{
  "Settings": {
    "value": {
      "LastUsedSaveSlot": 1
    }
  }
}
```

修改时保留 `__type`、其他设置及文件结构。先正常退出游戏并备份文件，再修改该字段，避免运行中的游戏把设置写回。修改启动选择不等于重置存档，也不保证正在运行的游戏已切换存档；启动后仍应核对界面和实际起点。

2026-09-22 本次准备时该字段已经为 `1`，无需修改。游戏桥未连接，后续由游玩 agent 启动游戏并核对。

## 本次新存档基线

读取 `SaveSlot1.es3` 的 `PersistenceData.value` 得到：

- `version`：`1.1.0`。
- `CurWorld`：`0`。
- `PlayerPosWorld`：`[6,0]`。
- `accomplishLevelCount`：`0`。
- `LevelEnteredState`、`LevelRecords`、`Collections` 均为空。
- `TotalTime`：`00:00:10.8199659`。

这是已创建、尚无完成关卡记录的起始存档，无需删除后重建。`LevelStates` 中部分条目已有数值 `1`，其枚举含义尚未核实，不能把它们直接计为通关。

本次基线备份：`artifacts/save-backup-slot1-20260922-212816/`，包含 slot0、slot1、Settings 及各自 `.bak`，六个文件均核对 SHA-256 与备份时源文件一致；哈希记录见该目录的 `manifest.json`。

## 自动游玩约定

1. GPT 从 slot1 的当前初始进度开始，使用游戏正常输入完成关卡；不得通过修改存档中的进度、解锁、道具或完成标记来过关。
2. 保留 slot0，不删除或覆盖用户已有存档；只有确需切换启动存档时才修改上述设置字段。
3. 先读取实时状态，再执行操作。超时先观察，不盲目重发。工具回执结构可能随版本变化，完整状态以 `observe` 为准。
4. 记录机制知识、关卡解法与实际通关证据，并及时更新 `progress.json`。
5. 本知识库先前的 1-1 重玩成功是历史能力验证，不代表 slot1 已完成该关。slot1 的本轮完成列表单独维护。
6. 同一时刻仅一个 agent 控制游戏；主 agent 在子 agent 游玩时只进行文件检查与协调。

## 2026-09-24 恢复游玩核验

发现启动选择为slot0。确认游戏进程已退出后，将Settings.value.LastUsedSaveSlot改为1；原设置备份于artifacts/settings-slot1-20260924-115030/Settings.es3，两份SaveSlot文件操作前后哈希一致。重新启动后标题显示β、58关、2星、第二章；点击开始实际抵达Chapter2[82,7]，split1。这里证明重启后需重新观察世界位置，不能直接继续旧关内WA现场。
