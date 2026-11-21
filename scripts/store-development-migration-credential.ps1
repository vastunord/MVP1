#requires -Version 7.0
# One-time import into Windows current-user DPAPI. Never echoes the input.
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$directory = Join-Path $root 'credentials'
$target = Join-Path $directory 'vastunord-dev-migrator.dpapi'
if (Test-Path -LiteralPath $target) { throw 'Credential file already exists. Refusing to overwrite.' }
$password = [Environment]::GetEnvironmentVariable('VASTUNORD_DEV_MIGRATOR_PASSWORD', 'Process')
[Environment]::SetEnvironmentVariable('VASTUNORD_DEV_MIGRATOR_PASSWORD', $null, 'Process')
if ([string]::IsNullOrEmpty($password)) { throw 'Migration credential was not injected.' }
try {
    $secure = ConvertTo-SecureString -String $password -AsPlainText -Force
    $encrypted = ConvertFrom-SecureString -SecureString $secure
    if (-not (Test-Path -LiteralPath $directory)) {
        New-Item -ItemType Directory -Path $directory | Out-Null
    }
    [IO.File]::WriteAllText($target, $encrypted, [Text.UTF8Encoding]::new($false))
    Write-Output 'Encrypted migration credential stored for this Windows user.'
} finally {
    $password = $null
    $encrypted = $null
    if ($secure) { $secure.Dispose() }
}
