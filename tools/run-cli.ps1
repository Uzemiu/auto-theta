$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
. "$PSScriptRoot\install-common.ps1"
$configuredPython = $env:THETA_PYTHON
if (-not $configuredPython -and (Test-Path -LiteralPath "$root\.runtime\python-path.txt")) {
    $configuredPython = (Get-Content -LiteralPath "$root\.runtime\python-path.txt" -Raw -Encoding UTF8).Trim()
}
$pythonExe = Resolve-ThetaPython $configuredPython
& $pythonExe "$root\theta.py" @args
exit $LASTEXITCODE
