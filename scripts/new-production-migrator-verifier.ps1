#requires -Version 7.0
# Returns a PostgreSQL SCRAM registration record to the provisioning process.
# The actual password stays in the current user's Windows protected store.
$ErrorActionPreference = 'Stop'
$path = Join-Path $PSScriptRoot '../credentials/vastunord-prod-migrator.dpapi'
if (!(Test-Path -LiteralPath $path)) {
    $password = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(36))
    $secure = ConvertTo-SecureString $password -AsPlainText -Force
    $file = [IO.File]::Open($path, 'CreateNew', 'Write', 'None')
    try {
        $bytes = [Text.Encoding]::UTF8.GetBytes((ConvertFrom-SecureString -SecureString $secure))
        $file.Write($bytes)
    } finally { $file.Dispose() }
} else {
    $secure = ConvertTo-SecureString ([IO.File]::ReadAllText($path))
    $password = [Net.NetworkCredential]::new('', $secure).Password
}
try {
    $salt = [Security.Cryptography.RandomNumberGenerator]::GetBytes(16)
    $salted = [Security.Cryptography.Rfc2898DeriveBytes]::Pbkdf2($password, $salt, 4096, 'SHA256', 32)
    $clientKey = [Security.Cryptography.HMACSHA256]::HashData($salted, [Text.Encoding]::ASCII.GetBytes('Client Key'))
    $storedKey = [Security.Cryptography.SHA256]::HashData($clientKey)
    $serverKey = [Security.Cryptography.HMACSHA256]::HashData($salted, [Text.Encoding]::ASCII.GetBytes('Server Key'))
    'SCRAM-SHA-256$4096:{0}${1}:{2}' -f [Convert]::ToBase64String($salt), [Convert]::ToBase64String($storedKey), [Convert]::ToBase64String($serverKey)
} finally { $secure.Dispose(); $password = $null }
