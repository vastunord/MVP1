#requires -Version 7.0
[CmdletBinding()]
param([switch] $ApplyReviewedMigrations, [switch] $ConcurrencyTest)
$ErrorActionPreference = 'Stop'
$credentialPath = Join-Path $PSScriptRoot '../credentials/vastunord-dev-migrator.dpapi'
if (-not (Test-Path -LiteralPath $credentialPath -PathType Leaf)) { throw 'Protected migrator credential unavailable.' }
$secure = ConvertTo-SecureString ([IO.File]::ReadAllText((Resolve-Path -LiteralPath $credentialPath).Path))
$pointer = [IntPtr]::Zero
$process = $null
try {
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    $uri = [UriBuilder]::new('postgresql://ep-holy-waterfall-bheg01mu.c-10.eu-central-1.aws.neon.tech/neondb')
    $uri.UserName = 'vastunord_dev_migrator'
    $uri.Password = [Uri]::EscapeDataString($password)
    $start = [Diagnostics.ProcessStartInfo]::new()
    $start.FileName = (Get-Command node -CommandType Application | Select-Object -First 1).Source
    if ($ApplyReviewedMigrations -and $ConcurrencyTest) { throw 'Choose one operation.' }
    if ($ConcurrencyTest) { $start.ArgumentList.Add('--conditions=react-server'); $start.ArgumentList.Add('--experimental-strip-types') }
    $scriptName = if ($ConcurrencyTest) { 'test-render-concurrency.mjs' } else { 'verify-isolated-render-test.mjs' }
    $start.ArgumentList.Add((Resolve-Path (Join-Path $PSScriptRoot "../apps/web/scripts/$scriptName")).Path)
    if ($ApplyReviewedMigrations) { $start.ArgumentList.Add('--apply-reviewed') }
    $start.UseShellExecute = $false
    $start.CreateNoWindow = $true
    $start.RedirectStandardInput = $true
    $process = [Diagnostics.Process]::Start($start)
    $process.StandardInput.WriteLine($uri.Uri.AbsoluteUri)
    $process.StandardInput.Close()
    if (-not $process.WaitForExit(180000)) { $process.Kill($true); throw 'Isolated test operation timed out; preserve state.' }
    $status = $process.ExitCode
} finally {
    if ($process) { $process.Dispose() }
    if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
    $secure.Dispose()
    $password = $null
    $uri = $null
}
exit $status
