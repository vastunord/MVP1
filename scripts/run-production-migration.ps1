#requires -Version 7
[CmdletBinding()]
param([switch]$Apply, [switch]$RuntimeGrants, [switch]$EnrollTester)
$ErrorActionPreference = 'Stop'
$path = Join-Path $PSScriptRoot '../credentials/vastunord-prod-migrator.dpapi'
if (!(Test-Path -LiteralPath $path -PathType Leaf)) { throw 'Protected Production migrator credential unavailable.' }
$secure = ConvertTo-SecureString ([IO.File]::ReadAllText($path))
try {
    if (($Apply -and $RuntimeGrants) -or ($Apply -and $EnrollTester) -or ($RuntimeGrants -and $EnrollTester)) {
        throw 'Select one reviewed operator action at a time.'
    }
    $mode = if ($Apply) { '--apply' } elseif ($RuntimeGrants) { '--runtime-grants' } elseif ($EnrollTester) { '--enroll-tester' } else { '--status' }
    $password = [Net.NetworkCredential]::new('', $secure).Password
    $password | & node (Join-Path $PSScriptRoot '../apps/web/scripts/production-migrations.mjs') $mode
    $code = $LASTEXITCODE
} finally {
    $password = $null
    $secure.Dispose()
}
exit $code
