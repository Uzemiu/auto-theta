param([string]$GamePath = 'H:\Games\steamapps\common\Theta and Paralldoxs on Worldlines', [string]$Type = '', [string]$Method = '')
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Add-Type -Path "$root\.deps\bepinex\BepInEx\core\Mono.Cecil.dll"
$asm = [Mono.Cecil.AssemblyDefinition]::ReadAssembly("$GamePath\Theta and Paralldox on Worldlines_Data\Managed\Assembly-CSharp.dll")
foreach ($t in $asm.MainModule.Types) {
    if ($Type -and $t.Name -ne $Type) { continue }
    $t.FullName
    foreach ($field in $t.Fields) { '  ' + $field.Attributes + ' ' + $field.FieldType.FullName + ' ' + $field.Name }
    foreach ($m in $t.Methods) {
        if ($Method -and $m.Name -ne $Method) { continue }
        '  ' + $m.FullName
        if ($Method -and $m.HasBody) { $m.Body.Instructions | ForEach-Object ToString }
    }
}
