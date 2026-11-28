#requires -Version 7
[CmdletBinding()]
param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$path = Join-Path $PSScriptRoot '../credentials/vastunord-prod-migrator.dpapi'
if (!(Test-Path -LiteralPath $path -PathType Leaf)) { throw 'Protected Production migrator credential unavailable.' }
$secure = ConvertTo-SecureString ([IO.File]::ReadAllText($path))
try {
    $mode = if ($Apply) { '--apply' } else { '--status' }
    $password = [Net.NetworkCredential]::new('', $secure).Password
    $password | & node (Join-Path $PSScriptRoot '../apps/web/scripts/production-migrations.mjs') $mode
    $code = $LASTEXITCODE
} finally {
    $password = $null
    $secure.Dispose()
}
exit $code
