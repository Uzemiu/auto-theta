param(
    [string]$GamePath,
    [string]$Python,
    [int]$Port = 17643,
    [switch]$ConfigureOnly,
    [switch]$ConfigureCodex
)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
. "$root\tools\install-common.ps1"
$pythonExe = Resolve-ThetaPython $Python
if (-not $ConfigureOnly) {
    $resolvedGame = Resolve-ThetaGamePath -GamePath $GamePath -Root $root
    # Separate process: setup's BuildOnly/exit behavior cannot terminate this installer.
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$root\tools\setup.ps1" -GamePath $resolvedGame -Port $Port
    if ($LASTEXITCODE -ne 0) { throw 'Game bridge installation failed; MCP configuration was not changed.' }
}
$arguments = @("$root\tools\configure-mcp.py")
if ($ConfigureCodex) { $arguments += '--write-codex' }
& $pythonExe @arguments
if ($LASTEXITCODE -ne 0) { throw 'MCP configuration failed.' }
Write-Output 'Ready. Use theta.cmd launch, then connect your MCP client using .runtime/mcp.json.'
