# auto-theta

A local MCP server and CLI for AI agents to observe and play **Theta and Paralldox on Worldlines**, with a portable Windows installer.

为《茜塔和世界线悖论》提供游戏状态读取、原生输入、菜单操作和截图。AI 可以通过 MCP 观察局面并执行操作，也可以通过 CLI 使用相同接口。

- 读取关卡、全部世界线、实体属性、地形和 UI。
- 执行单步动作，或一次提交最多 **50 步**动作序列。
- 默认精简 Wall/Floor 的重复属性，其他实体完整保留；支持获取原始完整状态。
- 自动发现 Python 和 Steam 游戏目录，按安装位置生成 MCP 配置。
- 保留游玩知识库与实验记录，方便研究和复现。

## 环境要求

- Windows x64、Windows PowerShell 5.1。
- 已通过 Steam 安装游戏（App ID `3219580`）。
- Python **3.10+**。客户端仅使用标准库，无需 pip/npm；安装器不会自动安装 Python。
- 首次安装需要联网下载 BepInEx 和 C# 编译器。

当前适配 Unity Mono 版本，已验证游戏 **1.1.0 / Unity 2022.3.34f1**。游戏更新后可能需要重新编译或调整插件。MCP 使用本机 stdio，运行游戏的电脑也需要运行 MCP 服务。

## 快速开始

### 1. 下载项目

在你希望存放项目的目录执行：

```powershell
git clone https://github.com/Uzemiu/auto-theta.git
cd auto-theta
```

也可以从 GitHub 下载 ZIP 并解压。编译依赖会保存在项目目录；如果希望避开 C 盘，将项目放在其他盘即可。

### 2. 安装插件并生成配置

先关闭游戏，再执行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1
```

安装器自动查找 Python 和 Steam 的游戏安装位置，支持多个磁盘上的 Steam 库；下载并校验依赖、编译插件，随后生成：

| 文件 | 用途 |
| --- | --- |
| `.runtime/mcp.json` | 通用 MCP 客户端配置 |
| `.runtime/codex-mcp.toml` | Codex MCP 配置片段 |
| `.runtime/python-path.txt` | CLI 使用的 Python 路径 |
| `theta.local.json` | 本机游戏路径、端口和连接令牌 |

这些本机配置均被 Git 忽略。安装器不修改系统 PATH，也不安装全局 Python 包。

若自动发现失败，可以指定位置。将以下占位符替换为实际路径：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 `
  -Python '<python.exe完整路径>' `
  -GamePath '<游戏安装目录>'
```

### 3. 接入 MCP

**其他本地 MCP 客户端：** 将 `.runtime/mcp.json` 中的 `theta_game` 条目合并到客户端的 `mcpServers` 配置，然后重新连接服务。生成的配置使用实际绝对路径，不依赖客户端的工作目录。`mcp.example.json` 是格式示例，不能直接当作已安装配置使用。

**Codex：** 安装时加 `-ConfigureCodex`，或在安装后执行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 -ConfigureOnly -ConfigureCodex
```

该命令会创建项目的 `.codex/config.toml`；若已有文件仅包含 `theta_game` 配置，会先保留首次备份再更新。若包含其他设置，则拒绝覆盖：省略 `-ConfigureCodex` 生成配置片段，再手动合并 `.runtime/codex-mcp.toml`。信任项目并重新连接 MCP 后即可加载工具。

### 4. 启动并检查

```powershell
.\theta.cmd launch
.\theta.cmd status
.\theta.cmd observe
```

也可以双击 `play.cmd`。启动器通过 Steam 的 `-applaunch 3219580` 启动游戏，避免携带参数的 Steam URL 启动确认框。它不会自动选择或新建存档；已连接时不会重复启动。Steam 登录、更新或云存档冲突仍需自行处理。

## MCP 工具与 CLI

| MCP 工具 | CLI 示例 | 返回内容 |
| --- | --- | --- |
| `theta_status` | `.\theta.cmd status` | 连接、版本、进程与场景信息 |
| `theta_launch` | `.\theta.cmd launch` | 启动或已有连接的信息 |
| `theta_observe` | `.\theta.cmd observe` | 关卡、世界线、实体、地形与 UI |
| `theta_act` | `.\theta.cmd act left` | 单次输入回执与简要状态 |
| `theta_batch` | `.\theta.cmd batch right right up` | 执行数量、停止原因与最终摘要 |
| `theta_ui` | `.\theta.cmd ui` | 按钮 ID、文字与菜单选中项 |
| `theta_click` | `.\theta.cmd click 123` | 按钮点击回执；ID 应取自当前 `ui` |
| `theta_screenshot` | `.\theta.cmd screenshot` | MCP 返回图片；CLI 保存 PNG |
| `theta_wait` | `.\theta.cmd wait 250` | 等待后的简要状态 |

支持的动作：

```text
up down left right split undo redo retry tab shift confirm pause grid preview
```

坐标为游戏网格 `[x, y]`，向上移动增加 `y`。`confirm` 用于确认、交互或推进对话；暂停菜单可用 `up/down` 选择并用 `confirm` 确认。按钮 ID 仅在当前实例有效，请先读取 UI 再点击。

章节地图中的 `X`“传送至章节”对应 `act split`（桥接版本 0.3.2 起支持在暂停菜单发送）。先用 `ui` 或截图确认当前菜单与所选章节；关内忙碌、输入锁定时仍会拒绝分裂。

`act`、`batch`、`click`、`wait` 仅返回摘要，包括关卡状态与当前世界线最多 8 个活跃角色的位置；`player_count` 给出全部活跃角色数量。`ok: true` 表示请求处理成功，`dispatched: true` 表示输入已发送，均不保证角色实际移动。

### Observe：默认精简，按需完整

默认返回全部世界线和实体，仅对 **`class` 精确等于 `Wall` 或 `Floor`** 的对象省略重复默认属性与空对象。省略规则列在 `defaults.entity`、`defaults.properties` 中，适用范围由 `defaults.applies_to_classes` 指明。Box、Player、Key 及其他实体保留全部字段，包括默认值和空对象。

默认也省略帧号、屏幕尺寸与完整操作历史。需要原始字段或已读取过地图时，可使用：

| 需求 | `theta_observe` 参数 | CLI |
| --- | --- | --- |
| 原始完整状态 | `{"full": true}` | `.\theta.cmd observe --full` |
| 省略静态地形 | `{"include_map": false}` | `.\theta.cmd observe --no-map` |
| 完整字段但省略地形 | `{"full": true, "include_map": false}` | `.\theta.cmd observe --full --no-map` |

一次同状态快照对比中，JSON 从 **47,626 字节降到 27,487 字节（减少 42.3%）**，其余 26 个实体逐对象比对完全一致；具体比例随关卡变化。精简在 Python 层完成，底层 `Bridge.call("state")` 仍返回原始状态。

### Batch：最多 50 步

调用 `theta_batch` 的参数示例：

```json
{"actions": ["right", "right", "up"]}
```

插件先校验全部动作，再在游戏内逐步执行、等待每步动画。一个批次只发送一次请求，其他接口请求不会插入批次中间。它适用于已加载、未暂停的关卡；标题画面、菜单和对话请使用单步工具。

遇到切换关卡、加载、对话、暂停、锁定、通关、冲突或循环时，会停止剩余动作。客户端断开、单步动画等待超过 4 秒或整个请求接近 43 秒也会终止批次。因此，50 步是请求上限，不保证每次都执行完。

| 回执字段 | 含义 |
| --- | --- |
| `requested` | 请求动作数 |
| `executed` | 已发送的输入数，不等同于成功移动次数 |
| `remaining` | 尚未发送的输入数 |
| `stop_reason` | `finished` 表示完成；其他值说明中断原因 |
| `last_action` | 最后发送的动作，至少执行一步时出现 |

提前停止不会撤销已执行步骤。先检查回执，必要时重新 `observe`，再决定下一步；超时后不要直接重发整个批次。插件 **0.3.1+** 支持 50 步，0.3.0 上限为 20 步；更新插件后需要重启游戏。

## 建议的游玩流程

1. 用 `status` 检查连接，需要时 `launch`。
2. 用 `ui` 和 `screenshot` 确认画面、存档和菜单。
3. 用 `observe` 读取局面，等待加载或动画结束。
4. 已确定的路线使用 `batch`，需要试探的步骤使用 `act`。
5. 检查回执；推箱子、分裂或跨世界线变化后按需重新观察。

游戏操作仍按游戏自身规则自动保存。接口提供观察和控制能力，具体解题策略由调用它的 AI 或脚本决定。

## 更新、搬迁与卸载

更新代码后，关闭游戏并重新运行安装器：

```powershell
git pull
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1
```

如果只是搬迁项目、更换 Python 或刷新 MCP 配置，可以保持游戏运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 -ConfigureOnly
```

随后在 MCP 客户端重新导入生成的配置并重新连接。该模式不安装或更新游戏插件。

其他维护命令：

```powershell
# 仅编译，不安装
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\setup.ps1 -BuildOnly
# 指定桥接端口，安装后需更新客户端配置并重启游戏
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 -Port 17643
# 关闭游戏后卸载插件及本项目安装的加载器文件
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\uninstall.ps1
```

卸载按照 `.runtime/install-manifest.json` 中的文件清单和哈希执行，保留原始游戏文件、存档及日志；发现文件已变更时会停止。请保留该安装清单。卸载后可自行移除 MCP 客户端中的 `theta_game` 配置。

## 路径与依赖

| 项目 | 发现顺序或位置 |
| --- | --- |
| 游戏目录 | `-GamePath` → `THETA_GAME_PATH` → 有效本地配置 → Steam 注册表与库清单 |
| Python | `-Python` → `THETA_PYTHON` → PATH 的 `python` → `py -3` |
| 下载依赖 | 项目 `.deps/`，固定版本并校验 SHA-256 |
| 临时文件与生成配置 | 项目 `.runtime/` |
| 编译结果 | 项目 `build/ThetaBridge.dll` |
| 插件 | 游戏 `BepInEx/plugins/ThetaAgent/ThetaBridge.dll` |
| 截图和运行日志 | 项目 `artifacts/` |

CLI 优先使用 `THETA_PYTHON`，否则使用安装器记录的解释器。多份游戏安装并存时，可用 `-GamePath` 明确选择。

编译使用 **BepInEx 5.4.23.5** 和 **Microsoft.Net.Compilers.Toolset 4.14.0**，运行时使用游戏自身的 Unity、Newtonsoft.Json 与系统 .NET Framework。安装器拒绝覆盖不同版本的现有加载器。

## 实现与实验记录

```text
MCP 客户端 / CLI
       ↓
Python stdio MCP / CLI
       ↓ 本机 TCP + 随机令牌
BepInEx 插件
       ↓ Unity 主线程
游戏原生输入、状态与截图
```

桥接仅监听 `127.0.0.1`，默认端口为 `17643`。网络线程接收请求，游戏对象读取与输入在 Unity 主线程执行。令牌保存在本机配置中，不包含在生成的 MCP 连接片段里。

| 目录 | 内容 |
| --- | --- |
| `plugin/` | 游戏内桥接插件源码 |
| `tools/` | 安装、配置、卸载与验证工具 |
| `tests/` | 协议、回执与可移植安装测试 |
| [`knowledge/`](knowledge/) | 机制、关卡解法、进度与验证记录 |
| [`scratch/`](scratch/) | 探索脚本、候选解法和中间实验结果 |

**实验记录包含剧透。** `knowledge` 和 `scratch` 作为历史研究材料保留，不参与安装；其中的路径、存档约定、实验指令与进度描述属于当时的实验环境，不代表新安装用户的当前游戏状态。

继续本轮实验前读取 [当前交接](knowledge/handoff.md)；研究脚本与报告见 [分类索引](scratch/README.md)，本次暂停和整理见 [2026-10-05记录](knowledge/checkpoints/2026-10-05-pause.md)。

## 验证

```powershell
python -m unittest discover -s tests -v
# 游戏已运行且插件可连接时，执行只读端到端验证
python tools\smoke-test.py
```

目前 28 项自动测试通过，覆盖 MCP 协议、摘要与完整返回、50/51 步边界、超时处理、多 Steam 库、中文和空格路径、目录搬迁，以及从其他工作目录启动 MCP。隔离目录中也验证了完整安装和卸载，原始游戏文件保持完整。

真实游戏已验证状态读取、截图、菜单导航、移动、撤销和重做。0.3.0 的 20 步批次完成及中断处理经过实测；50 步版本的校验与编译已通过，尚未完成真实游戏中的 50 步整批验证。游戏更新后请重新验证适配情况。

`artifacts/` 中的本地报告、截图和快照不随仓库分发；运行验证后可在本机生成相应结果。

## 常见问题

| 问题 | 处理方式 |
| --- | --- |
| 找不到 Python | 安装 Python 3.10+，或通过 `-Python` 指定解释器 |
| 找不到游戏或找到多份安装 | 通过 `-GamePath` 指定含游戏 EXE 的目录 |
| 游戏正在运行，安装被拒绝 | 关闭游戏后重试；只刷新 MCP 配置则用 `-ConfigureOnly` |
| 现有加载器版本不同 | 检查已有 Mod/BepInEx 安装并协调版本，安装器不会强行覆盖 |
| Codex 配置含其他设置 | 不带 `-ConfigureCodex` 生成片段，再手动合并 |
| `status` 未连接 | 确认插件已安装且游戏已重启；查看 `artifacts/Player.log` 与游戏 `BepInEx/LogOutput.log` |
| 工具仍显示旧字段或旧上限 | 重新连接 MCP；50 步支持还需要游戏加载新版插件 |
| 游戏忙碌、输入锁定或动作超时 | 先 `observe` / `ui` 确认状态，再等待或处理对话；不要盲目重发动作 |
