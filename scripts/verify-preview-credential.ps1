#requires -Version 7.0
[CmdletBinding()]
param([switch] $Apply, [switch] $ApplyMaya)
$ErrorActionPreference = 'Stop'
$credentialPath = Join-Path $PSScriptRoot '../credentials/vastunord-dev-migrator.dpapi'
if (-not (Test-Path -LiteralPath $credentialPath -PathType Leaf)) {
    throw 'Protected credential is unavailable.'
}
$secure = ConvertTo-SecureString ([IO.File]::ReadAllText((Resolve-Path -LiteralPath $credentialPath).Path))
$pointer = [IntPtr]::Zero
$process = $null
try {
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    $uri = [UriBuilder]::new('postgresql://ep-frosty-violet-bhh19hyh.c-10.eu-central-1.aws.neon.tech/neondb')
    $uri.UserName = 'vastunord_dev_migrator'
    $uri.Password = [Uri]::EscapeDataString($password)
    $start = [Diagnostics.ProcessStartInfo]::new()
    $start.FileName = (Get-Command node -CommandType Application | Select-Object -First 1).Source
    if ($Apply -and $ApplyMaya) { throw 'Select only one migration operation.' }
    $scriptName = if ($ApplyMaya) { 'apply-preview-maya.mjs' } elseif ($Apply) { 'apply-preview-mnml.mjs' } else { 'verify-preview-migration.mjs' }
    $start.ArgumentList.Add((Resolve-Path (Join-Path $PSScriptRoot "../apps/web/scripts/$scriptName")).Path)
    $start.UseShellExecute = $false
    $start.CreateNoWindow = $true
    $start.RedirectStandardInput = $true
    $process = [Diagnostics.Process]::Start($start)
    $process.StandardInput.WriteLine($uri.Uri.AbsoluteUri)
    $process.StandardInput.Close()
    $timeout = if ($ApplyMaya) { 240000 } else { 30000 }
    if (-not $process.WaitForExit($timeout)) { $process.Kill($true); throw 'Preview verification timed out; preserve state and inspect before retrying.' }
    $status = $process.ExitCode
} finally {
    if ($process) { $process.Dispose() }
    if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
    $secure.Dispose()
    $password = $null
    $uri = $null
}
exit $status
