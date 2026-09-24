$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$manifestFile = "$root\.runtime\install-manifest.json"
$manifest = Get-Content -LiteralPath $manifestFile -Raw | ConvertFrom-Json
$gameRoot = [IO.Path]::GetFullPath($manifest.game_path).TrimEnd('\')
$gameExe = Join-Path $gameRoot 'Theta and Paralldox on Worldlines.exe'
if (Get-Process | Where-Object { $_.Path -eq $gameExe }) { throw 'Close the game before uninstalling.' }
$targets = foreach ($relative in $manifest.files) {
    $absolute = [IO.Path]::GetFullPath((Join-Path $gameRoot $relative))
    if (-not $absolute.StartsWith($gameRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid manifest path' }
    if (Test-Path -LiteralPath $absolute) {
        $expected = $manifest.hashes.PSObject.Properties[$relative].Value
        if ((Get-FileHash -LiteralPath $absolute).Hash -ne $expected) { throw "File changed since install; preserve it and inspect manually: $absolute" }
        $absolute
    }
}
foreach ($absolute in $targets) { Remove-Item -LiteralPath $absolute }
Remove-Item -LiteralPath $manifestFile
Remove-Item -LiteralPath "$root\theta.local.json" -ErrorAction SilentlyContinue
Write-Output 'Removed only the installed bridge/loader files. Saves, game files and generated logs were preserved.'
