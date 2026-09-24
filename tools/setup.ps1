param(
    [string]$GamePath = 'H:\Games\steamapps\common\Theta and Paralldoxs on Worldlines',
    [int]$Port = 17643,
    [switch]$BuildOnly
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$GamePath = [IO.Path]::GetFullPath($GamePath)
if ($root -match '^C:' -or $GamePath -match '^C:') { throw 'Dependencies and game bridge must be outside C:.' }
if ($Port -lt 1024 -or $Port -gt 65535) { throw 'Port must be 1024..65535' }
$managed = Join-Path $GamePath 'Theta and Paralldox on Worldlines_Data\Managed'
if (-not (Test-Path "$managed\Assembly-CSharp.dll")) { throw "Unity Mono game assembly missing: $managed" }
New-Item -ItemType Directory -Force -Path "$root\.deps", "$root\.runtime\temp", "$root\build" | Out-Null
$env:TEMP = "$root\.runtime\temp"
$env:TMP = $env:TEMP
function Get-PinnedArchive($Name, $Url, $Hash, $Destination) {
    $archive = Join-Path "$root\.deps" $Name
    if (-not (Test-Path $archive)) { Invoke-WebRequest $Url -OutFile $archive }
    if ((Get-FileHash $archive -Algorithm SHA256).Hash -ne $Hash) { throw "Checksum mismatch: $Name" }
    if (-not (Test-Path $Destination)) { Expand-Archive -LiteralPath $archive -DestinationPath $Destination }
}
Get-PinnedArchive 'BepInEx_win_x64_5.4.23.5.zip' 'https://github.com/BepInEx/BepInEx/releases/download/v5.4.23.5/BepInEx_win_x64_5.4.23.5.zip' '82F9878551030F54657792C0740D9D51A09500EEAE1FBA21106B0C441E6732C4' "$root\.deps\bepinex"
Get-PinnedArchive 'roslyn.zip' 'https://api.nuget.org/v3-flatcontainer/microsoft.net.compilers.toolset/4.14.0/microsoft.net.compilers.toolset.4.14.0.nupkg' '941A9CF3EA618D88D01A3DD6B1A45A06BCF07716A9F81CE4031CAA3EDD24A845' "$root\.deps\roslyn"
$refs = @('mscorlib.dll','netstandard.dll','System.dll','System.Core.dll','Assembly-CSharp.dll','Newtonsoft.Json.dll','UnityEngine.dll','UnityEngine.CoreModule.dll','UnityEngine.UI.dll','UnityEngine.UIModule.dll','UnityEngine.ImageConversionModule.dll','UnityEngine.ScreenCaptureModule.dll','Unity.TextMeshPro.dll') | ForEach-Object { '/reference:' + (Join-Path $managed $_) }
$refs += '/reference:' + "$root\.deps\bepinex\BepInEx\core\BepInEx.dll"
$refs += '/reference:' + "$root\.deps\bepinex\BepInEx\core\0Harmony.dll"
& "$root\.deps\roslyn\tasks\net472\csc.exe" /nologo /target:library /nostdlib+ /langversion:9 /optimize+ "/out:$root\build\ThetaBridge.dll" @refs "$root\plugin\ThetaBridge.cs"
if ($LASTEXITCODE -ne 0) { throw 'Bridge compilation failed' }
if ($BuildOnly) { Write-Output "Built $root\build\ThetaBridge.dll"; exit }
$gameExe = Join-Path $GamePath 'Theta and Paralldox on Worldlines.exe'
if (Get-Process | Where-Object { $_.Path -eq $gameExe }) { throw 'Close the game before installing/updating the bridge.' }
$manifestPath = "$root\.runtime\install-manifest.json"
$manifest = if (Test-Path $manifestPath) { Get-Content $manifestPath -Raw | ConvertFrom-Json } else { $null }
if ($manifest -and $manifest.game_path -ne $GamePath) { throw 'This workspace already manages a different game installation.' }
$owned = [Collections.Generic.List[string]]::new()
if ($manifest) { foreach ($item in $manifest.files) { $owned.Add($item) } }
$packageRoot = "$root\.deps\bepinex"
$configFile = Join-Path $GamePath 'BepInEx\config\theta-agent.json'
$pluginFile = Join-Path $GamePath 'BepInEx\plugins\ThetaAgent\ThetaBridge.dll'
foreach ($dest in @($configFile, $pluginFile)) {
    $rel = $dest.Substring($GamePath.Length + 1)
    if ((Test-Path $dest) -and -not $owned.Contains($rel)) { throw "Unmanaged bridge file exists: $dest" }
}
# Preflight every loader file before changing anything; never overwrite another mod loader.
$loaderFiles = Get-ChildItem -LiteralPath $packageRoot -File -Recurse
foreach ($file in $loaderFiles) {
    $rel = $file.FullName.Substring($packageRoot.Length + 1)
    $dest = Join-Path $GamePath $rel
    if ((Test-Path $dest) -and (Get-FileHash $dest).Hash -ne (Get-FileHash $file.FullName).Hash) { throw "Existing mod-loader file differs: $dest" }
}
foreach ($file in $loaderFiles) {
    $rel = $file.FullName.Substring($packageRoot.Length + 1)
    $dest = Join-Path $GamePath $rel
    if (-not (Test-Path $dest)) {
        New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
        Copy-Item -LiteralPath $file.FullName -Destination $dest
        $owned.Add($rel)
    }
}
foreach ($dest in @($configFile, $pluginFile)) {
    $rel = $dest.Substring($GamePath.Length + 1)
    if ((Test-Path $dest) -and -not $owned.Contains($rel)) { throw "Unmanaged bridge file exists: $dest" }
    New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
    if (-not $owned.Contains($rel)) { $owned.Add($rel) }
}
$token = if (Test-Path $configFile) { (Get-Content $configFile -Raw | ConvertFrom-Json).token } else {
    $random = [byte[]]::new(32)
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($random)
    $rng.Dispose()
    -join ($random | ForEach-Object { $_.ToString('x2') })
}
@{ port = $Port; token = $token } | ConvertTo-Json | Set-Content -LiteralPath $configFile -Encoding utf8
Copy-Item -LiteralPath "$root\build\ThetaBridge.dll" -Destination $pluginFile -Force
@{ host = '127.0.0.1'; port = $Port; token = $token; game_path = $GamePath; game_exe = $gameExe } | ConvertTo-Json | Set-Content "$root\theta.local.json" -Encoding utf8
$hashes = @{}
foreach ($rel in $owned) { $hashes[$rel] = (Get-FileHash -LiteralPath (Join-Path $GamePath $rel)).Hash }
@{ game_path = $GamePath; files = @($owned); hashes = $hashes; game_assembly_sha256 = (Get-FileHash "$managed\Assembly-CSharp.dll").Hash } | ConvertTo-Json -Depth 5 | Set-Content $manifestPath -Encoding utf8
Write-Output "Installed Theta bridge to $pluginFile"
Write-Output "CLI: python $root\theta.py status"
