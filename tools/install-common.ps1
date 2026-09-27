# Shared discovery helpers. Dot-sourcing this file does not change the machine.
# A Python/PowerShell 7 parent can pass its module search path into Windows PowerShell.
# Load this shell's built-in utility module explicitly instead of selecting an incompatible one.
Import-Module (Join-Path $PSHOME 'Modules\Microsoft.PowerShell.Utility') -ErrorAction Stop

function Test-ThetaGamePath([string]$Path) {
    if (-not $Path) { return $false }
    return (Test-Path -LiteralPath (Join-Path $Path 'Theta and Paralldox on Worldlines.exe') -PathType Leaf) -and
        (Test-Path -LiteralPath (Join-Path $Path 'Theta and Paralldox on Worldlines_Data\Managed\Assembly-CSharp.dll') -PathType Leaf)
}

function Resolve-ThetaGamePath {
    param([string]$GamePath, [string]$Root, [string]$SteamPath)
    if (-not $GamePath) { $GamePath = $env:THETA_GAME_PATH }
    if ($GamePath) {
        $resolved = [IO.Path]::GetFullPath($GamePath).TrimEnd('\')
        if (-not (Test-ThetaGamePath $resolved)) { throw "Game executable/Mono assembly missing in: $resolved" }
        return $resolved
    }
    # Reuse a valid local installation, but rediscover if it was moved.
    if (-not $SteamPath -and $Root -and (Test-Path -LiteralPath "$Root\theta.local.json")) {
        $saved = (Get-Content -LiteralPath "$Root\theta.local.json" -Raw | ConvertFrom-Json).game_path
        if (Test-ThetaGamePath $saved) { return [IO.Path]::GetFullPath($saved).TrimEnd('\') }
    }
    $steamRoots = @()
    if ($SteamPath) { $steamRoots += $SteamPath }
    else {
        foreach ($key in @('HKCU:\Software\Valve\Steam', 'HKLM:\SOFTWARE\WOW6432Node\Valve\Steam', 'HKLM:\SOFTWARE\Valve\Steam')) {
            $item = Get-ItemProperty -LiteralPath $key -ErrorAction SilentlyContinue
            if ($item.SteamPath) { $steamRoots += $item.SteamPath }
            if ($item.InstallPath) { $steamRoots += $item.InstallPath }
        }
    }
    $libraries = @($steamRoots)
    foreach ($steamRoot in $steamRoots) {
        $vdf = Join-Path $steamRoot 'steamapps\libraryfolders.vdf'
        if (-not (Test-Path -LiteralPath $vdf)) { continue }
        $contents = Get-Content -LiteralPath $vdf -Raw -Encoding UTF8
        # Current VDF uses nested "path" entries; older versions used numeric keys.
        foreach ($match in [regex]::Matches($contents, '"(?:path|\d+)"\s+"((?:\\.|[^"\\])*)"')) {
            $path = $match.Groups[1].Value.Replace('\\', '\').Replace('\"', '"')
            if ([IO.Path]::IsPathRooted($path)) { $libraries += $path }
        }
    }
    $found = @()
    foreach ($library in ($libraries | Select-Object -Unique)) {
        $manifest = Join-Path $library 'steamapps\appmanifest_3219580.acf'
        if (-not (Test-Path -LiteralPath $manifest)) { continue }
        $contents = Get-Content -LiteralPath $manifest -Raw -Encoding UTF8
        $entry = [regex]::Match($contents, '"installdir"\s+"([^"\r\n]+)"')
        if (-not $entry.Success) { continue }
        $common = [IO.Path]::GetFullPath((Join-Path $library 'steamapps\common')).TrimEnd('\')
        $candidate = [IO.Path]::GetFullPath((Join-Path $common $entry.Groups[1].Value))
        if (-not $candidate.StartsWith($common + '\', [StringComparison]::OrdinalIgnoreCase)) { continue }
        if (Test-ThetaGamePath $candidate) { $found += $candidate }
    }
    $found = @($found | Select-Object -Unique)
    if ($found.Count -eq 1) { return $found[0] }
    if ($found.Count -gt 1) { throw "Multiple installations found; select one with -GamePath: $($found -join ', ')" }
    throw 'Steam game not found. Install app 3219580, or pass -GamePath (or THETA_GAME_PATH).'
}

function Resolve-ThetaPython([string]$Python) {
    if (-not $Python) { $Python = $env:THETA_PYTHON }
    $candidates = if ($Python) { @($Python) } else { @('python', 'py') }
    foreach ($candidate in $candidates) {
        $command = Get-Command $candidate -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
        if (-not $command) { continue }
        $arguments = @()
        if ([IO.Path]::GetFileNameWithoutExtension($command.Source) -eq 'py') { $arguments += '-3' }
        $arguments += @('-c', 'import sys; assert sys.version_info >= (3,10); print(sys.executable)')
        try { $output = & $command.Source @arguments 2>$null }
        catch { continue }
        if ($LASTEXITCODE -eq 0 -and $output -and (Test-Path -LiteralPath ([string]$output))) {
            return [IO.Path]::GetFullPath([string]$output)
        }
    }
    throw 'Python 3.10+ not found. Install Python in your chosen directory, or pass -Python / set THETA_PYTHON.'
}
