#requires -Version 7.0
[CmdletBinding()]
param([switch] $VerifyOnly)
$ErrorActionPreference = 'Stop'
$target = Join-Path $PSScriptRoot '../credentials/vastunord-dev-migrator.dpapi'
if (-not (Test-Path -LiteralPath $target -PathType Leaf)) { throw 'Protected migration credential is unavailable.' }
$secure = ConvertTo-SecureString ([IO.File]::ReadAllText((Resolve-Path -LiteralPath $target).Path))
$pointer = [IntPtr]::Zero
try {
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $env:VASTUNORD_DEV_MIGRATOR_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    $helper = Join-Path $PSScriptRoot 'prisma-development-deploy.ps1'
    if ($VerifyOnly) { & $helper -CredentialCheckOnly }
    else { & $helper }
    exit $LASTEXITCODE
} finally {
    Remove-Item Env:VASTUNORD_DEV_MIGRATOR_PASSWORD -ErrorAction SilentlyContinue
    if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
    $secure.Dispose()
}
