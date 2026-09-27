# Theta 游戏 MCP / CLI

为本机《茜塔和世界线悖论》（Theta and Paralldox on Worldlines）提供实际游戏状态读取、原生输入、菜单操作和画面截图。

已安装到 `H:\Games\steamapps\common\Theta and Paralldoxs on Worldlines`。Python 客户端只用标准库，复用 `D:\python14\python.exe`。新增编译依赖位于本项目的 `.deps`，插件和加载器位于 H 盘游戏目录，没有向 C 盘安装依赖。

## 立即使用

在本项目目录执行：

```powershell
.\theta.cmd launch
.\theta.cmd status
.\theta.cmd ui
.\theta.cmd observe
.\theta.cmd act left
.\theta.cmd act undo
.\theta.cmd batch right right up
.\theta.cmd screenshot
```

也可以双击 `play.cmd` 启动游戏。`launch` 只启动到游戏当前默认画面，不会自动进入或新建存档。已经连接时不会重复启动。

### Steam 启动参数确认框

启动器通过注册表找到现有 Steam 客户端，调用：

```text
Steam.exe -applaunch 3219580 -logFile <G盘项目日志> -screen-fullscreen 0 -screen-width 1280 -screen-height 720
```

不再直接运行游戏 EXE，也不使用携带参数的 `steam://` 链接。该方式已连续两次自动进入标题画面，不需要点击 Steam 的“允许使用以下参数启动”确认框。以后请使用 `play.cmd` 或 `theta.cmd launch`。Steam 登录、更新或云存档冲突属于另外的交互流程，不在这里自动确认。

## 命令

| 命令 | 用途 |
| --- | --- |
| `launch` | 通过 Steam 启动游戏，等待插件就绪 |
| `status` | 连接状态、进程、Unity 版本、场景与原有存档目录 |
| `observe` / `state` | 完整关卡、世界线、实体、地形、UI |
| `observe --no-map` | 省略静态地形，仍返回动态实体 |
| `ui` | 当前按钮 ID、路径、文字、暂停菜单选中项 |
| `click <id>` | 触发当前可见且可交互的按钮，仅返回简要结果 |
| `act <action>` | 单次原生游戏输入，仅返回执行回执和简要状态 |
| `batch <action> ...` | 在游戏内连续执行 1–50 步，返回执行数量、停止原因和最终摘要 |
| `wait [ms]` | 等待 0–5000 毫秒并返回简要状态，默认 250 |
| `screenshot [--out PATH] [--max-width 1280]` | 保存真实游戏帧，默认 `artifacts/screenshot.png` |
| `mcp` | 启动 MCP stdio 服务，标准输出仅包含 JSON-RPC |

动作名称：`up down left right split undo redo retry tab shift confirm pause grid preview`。

从 0.2.0 起，只有 `observe` 返回完整游戏状态。`act`、`batch`、`click`、`wait` 的回执仅包含执行信息和摘要：关卡 ID、忙碌/锁定/对话等状态、当前世界线最多 8 个活跃角色的 ID 与位置；`player_count` 表示该世界线全部活跃角色数量。不会附带实体属性、其他世界线、操作历史、静态地图或 UI 列表。`ui` 仍只返回菜单内容，`screenshot` 仍只返回图片，`status` / `launch` 仍只返回连接/启动信息。

`ok: true` 表示请求处理成功，`dispatched: true` 仅表示已注入输入，不保证实际移动。回执不是完整变化记录；需要检查推箱子、分裂结果或其他世界线变化时，再调用 `observe`。更新后需重新加载已经运行的 MCP 服务进程；新版客户端也会将旧插件的完整操作返回裁剪为同样的摘要。

`split`、`tab`、`shift`、`retry` 对应游戏自身的分裂、切换与重试输入；可用性由当前关卡和游戏规则决定。`confirm` 用于确认、交互及推进对话。暂停菜单可用 `up/down` 选择、`confirm` 确认，`pause` 通常返回游戏。主菜单的图标按钮可能没有文字，需结合 `path` 与截图识别，再用 `click` 操作；按钮 ID 只在当前实例有效。

### 批量动作（0.3.1）

MCP 工具 `theta_batch`：

```json
{"actions": ["right", "right", "up"]}
```

命令行：

```powershell
.\theta.cmd batch right right up
```

`actions` 是必填数组，支持与 `act` 相同的动作名称，每次 1–50 步。客户端和插件都会先校验整个列表；含非法动作或超过上限时，一步也不执行。

一个批次只发送一次游戏请求，插件在 Unity 主线程中按顺序注入单帧输入，等待每步动画结束。重复方向也是离散的多步输入，不模拟不确定的长按。整个批次占用同一请求队列，不会被其他 MCP 客户端的操作插入；游戏本身仍正常运行，不会冻结世界或加速动画。

批次只用于已经加载、未暂停的关卡。标题画面、暂停菜单和对话请继续使用单步工具。遇到关卡切换、加载、对话、暂停、输入锁定、通关、冲突或循环时立即停止；也会在客户端断开、单步动画等待超过 4 秒或整个请求接近 43 秒时停止剩余动作。一次正常撞墙仍算已发送一步，不自动认定为异常。

回执额外包含：

- `requested`：请求步数。
- `executed`：已发送的输入数，不保证都成功移动。
- `remaining`：未发送步数。
- `stop_reason`：`finished` 表示整批完成；提前停止可能返回 `paused`、`dialog`、`input_locked`、`level_changed`、`loading`、`level_completed`、`conflicting`、`looping`、`busy`、`no_level`、`not_ready`、`animation_timeout`、`time_budget`、`cancelled`、`client_disconnected` 或 `error`。
- `last_action`：最后一个已发送的动作，仅已执行至少一步时出现。

提前停止不会撤销已经执行的步骤。检查摘要，必要时 `observe`，再决定如何执行剩余动作；不要原样重发整个批次。特别是最后一步触发暂停/对话时，`remaining` 可以为 0，`stop_reason` 仍会说明当前中断状态。

需重新加载 MCP 服务才能发现第 9 个工具；游戏插件需更新到 0.3.1 并重启游戏，才能使用 50 步上限；0.3.0 仍限制为 20 步。更早版本不支持 `batch`，客户端不会将失败的批次自动重发成单步调用。

### 自动游玩循环

1. `status`，未连接则 `launch`。
2. `ui` / `screenshot` 识别标题画面和当前存档；使用返回的按钮 ID 继续游戏。
3. `observe` 读取局面。等待加载、动画或对话结束。
4. 已确定的路线用 `batch`，需要试探的位置用 `act`；检查简要回执，需要详细局面时调用 `observe`，不能把已发送输入当成移动成功。
5. 按需截图或撤销，再读取状态。请求超时后先观察，避免重复执行刚才可能已生效的动作。

游戏仍按自身规则自动保存。实测前的原始存档副本保存在 `artifacts/save-backup-20260922-183218`；测试的移动、撤销、重做最终恢复到原角色位置 `[9,1]` 和空操作记录。游戏自己的原有存档仍在 Unity 的 AppData 目录，未迁移存档。

## MCP 接入

项目内 `.codex/config.toml` 已配置 `theta_game`，并已用 `codex mcp get theta_game --json` 验证能被识别。它使用现有 D 盘 Python；无需 pip/npm 安装。

当前会话已经可以使用 CLI。要将 `theta_*` 作为原生工具加载，请在应用的 MCP 设置中重启服务器，或重新打开本项目任务。项目配置需要项目被信任。其他 MCP 客户端可以参考 `mcp.example.json`。

提供 9 个工具：`theta_status`、`theta_launch`、`theta_observe`、`theta_act`、`theta_batch`、`theta_ui`、`theta_click`、`theta_screenshot`、`theta_wait`。截图通过 MCP 原生 `image` 内容返回。协议版本支持 `2024-11-05`、`2025-03-26`、`2025-06-18`、`2025-11-25` 的 initialize/stdio 流程。

## 安装、编译和卸载

先关闭游戏，再执行：

```powershell
.\tools\setup.ps1
# 仅编译，不安装：
.\tools\setup.ps1 -BuildOnly
# 其他安装目录或端口：
.\tools\setup.ps1 -GamePath 'H:\Games\steamapps\common\Theta and Paralldoxs on Worldlines' -Port 17643
# 卸载本项目安装的文件：
.\tools\uninstall.ps1
```

依赖下载到 `.deps`，按固定 SHA-256 校验；编译临时目录指向 `.runtime/temp`。安装器拒绝向 C 盘放置项目依赖或游戏插件，并拒绝覆盖不同版本的现有加载器文件。卸载按 `.runtime/install-manifest.json` 的文件清单和哈希操作，保留游戏文件、存档及生成的日志；发现安装文件被更改会停止卸载。

依赖为 BepInEx 5.4.23.5（Unity Mono x64）和 Microsoft.Net.Compilers.Toolset 4.14.0（便携编译器）。运行时复用游戏自己的 Unity、Newtonsoft.Json 和系统 .NET Framework。

## 实现与验证

```text
Codex / 其他 MCP 客户端 → Python stdio MCP
命令行                 → Python CLI
                         ↓ 本机 TCP + 随机令牌
                      BepInEx 插件
                         ↓ Unity 主线程
                      游戏原生输入 / 状态 / 截图
```

插件绑定 `127.0.0.1:17643`，不监听局域网。认证信息在 `theta.local.json` 和游戏 `BepInEx/config/theta-agent.json`，已加入忽略规则。网络线程只接收请求，游戏对象读取、按钮调用和截图都在 Unity 主线程执行。输入补丁只在指定帧注入动作，不修改角色属性、存档解锁状态或原始游戏 DLL。

已验证游戏 1.1.0、Unity 2022.3.34f1，当前 `Assembly-CSharp.dll` 的 SHA-256：

```text
066EE7767C28806719F90075C0AD2B28B62605D490C143C92B6D31076B0637BF
```

```powershell
python -m unittest discover -s tests -v
# 游戏运行时执行只读端到端验证：
python tools\smoke-test.py
```

24 项自动测试已通过，包括 50 步请求接受、51 步请求拒绝、批次传输超时预算，以及 observe 精简与完整模式。0.3.1 插件已编译；为保留正在进行的关卡，尚未重启游戏进行新版实测。真实游戏中已验证状态/地形读取、截图、继续游戏、暂停与菜单导航、移动、撤销、重做。MCP 端到端测试验证了握手、工具列表、状态读取、原生图片和错误令牌拒绝。0.3.0 批量动作实测（当时上限为 20 步）：20 步左移/撤销约 4.8 秒完成并恢复位置与操作记录；暂停后停止剩余动作；已暂停时执行 0 步；标题画面拒绝开始；非法末尾动作和 21 步请求均在执行前拒绝。尚未逐关验证分裂与世界线切换，也未开发自动解谜算法。

证据文件：`artifacts/smoke-report.json`、`artifacts/batch-verification.json`、`artifacts/move-undo-redo-verification.json`、`artifacts/mcp-gameplay.png`。游戏更新后如接口失效，可重新编译；如果游戏内部 API 改名，需要更新适配代码。

插件在这个游戏的初始场景切换时需要 `HideFlags.HideAndDontSave` 保持管理对象存活，已在代码中处理。

## 排错

`status` 未连接时查看 `artifacts/Player.log` 和游戏目录的 `BepInEx/LogOutput.log`。若游戏启动前就已经运行，请先正常关闭再用启动器启动，以加载插件。出现 `Level is busy or input is locked` 时先 `observe` / `ui`，再等待、确认对话或退出菜单。启动器不会自动重发失败的游戏操作。

## 参考

- [BepInEx 官方发布](https://github.com/BepInEx/BepInEx/releases/tag/v5.4.23.5)
- [Valve Steam API 启动说明](https://partner.steamgames.com/doc/sdk/api)
- [Valve 对带参数 Steam URL 增加确认框的说明](https://store.steampowered.com/news/11052/)
- [OpenAI 官方 MCP 配置说明](https://developers.openai.com/codex/mcp)
- [MCP 2025-11-25 标准输入输出传输](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)

### Observe 字段精简

`theta_observe` 默认保留地图、全部世界线与实体、位置、解谜属性、状态和 UI，但省略帧号、屏幕尺寸、完整操作历史，以及仅限 `class` 为 `Wall`、`Floor` 的重复默认属性与空对象。Box、Player、Key 等其他实体的所有字段均原样保留，包括默认值和空对象。`defaults.applies_to_classes` 明确限定适用类别，不会根据 `type=SOLID` 或类名包含 Wall 就精简。返回的 `defaults.entity` 和 `defaults.properties` 统一列出省略值的含义；非默认值和未知属性仍原样保留，实体列表不会截断。

- 原始完整字段：`theta_observe({"full": true})`，CLI：`theta.cmd observe --full`。
- 已读取地图后省略地形：`theta_observe({"include_map": false})`，CLI：`theta.cmd observe --no-map`。
- 两个选项可以组合；`full` 不会覆盖 `include_map`。

精简在 Python 接口层完成，兼容正在运行的旧插件；重新连接 MCP 服务即可生效，无需重启游戏。底层 `Bridge.call("state")` 仍返回原始状态，已有直接使用它的解题脚本不受影响。

使用同一份只读观察快照验证：原始 JSON 47,626 字节，仅精简 Wall/Floor 后 27,487 字节，减少 42.3%；其余 26 个实体逐对象比对完全一致。大小按 UTF-8 JSON 计算，具体比例随关卡变化。
