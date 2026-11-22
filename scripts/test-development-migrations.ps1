#requires -Version 7.0
[CmdletBinding()]
param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$credential = Join-Path $PSScriptRoot '../credentials/vastunord-dev-migrator.dpapi'
if (-not (Test-Path -LiteralPath $credential -PathType Leaf)) { throw 'Development migration credential is unavailable.' }
try { $secret = ConvertTo-SecureString ([IO.File]::ReadAllText((Resolve-Path -LiteralPath $credential).Path)) }
catch { throw 'Unable to unlock the Development migration credential for this Windows user.' }
$pointer = [IntPtr]::Zero
$start = [Diagnostics.ProcessStartInfo]::new()
$start.FileName = (Get-Command node -CommandType Application | Select-Object -First 1).Source
$start.UseShellExecute = $false
$start.Environment.Clear()
foreach ($name in @('SystemRoot','ComSpec','Path','TEMP','TMP','USERPROFILE','LOCALAPPDATA','APPDATA','PATHEXT')) {
    $value = [Environment]::GetEnvironmentVariable($name)
    if ($value) { $start.Environment[$name] = $value }
}
$start.ArgumentList.Add((Resolve-Path (Join-Path $PSScriptRoot '../apps/web/scripts/rehearse-development.mjs')).Path)
$start.ArgumentList.Add($(if ($Apply) { 'apply' } else { 'verify' }))
try {
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
    $start.Environment['VASTUNORD_DEV_MIGRATOR_PASSWORD'] = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    $child = [Diagnostics.Process]::Start($start)
    try { $child.WaitForExit(); $status = $child.ExitCode } finally { $child.Dispose() }
} finally {
    $start.Environment.Clear()
    if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
    $secret.Dispose()
}
exit $status
