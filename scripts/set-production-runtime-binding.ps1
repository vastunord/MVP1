#requires -Version 7.0
# The operator supplies only an RSA-OAEP SHA-256 envelope to stdin. Its
# single-use private key lives in this process and is disposed on exit.
$ErrorActionPreference = 'Stop'
$projectId = 'prj_LyZA1xMnM4efg5U8SIAfGD4GIDc0'
$wrapper = Join-Path $PSScriptRoot 'vercel-vastunord.ps1'
$meta = & $wrapper -CliArguments @('api',"/v10/projects/$projectId/env")
$entries = @(($meta -join "`n" | ConvertFrom-Json).envs | Where-Object { $_.key -eq 'DATABASE_URL' -and $_.target -contains 'production' })
if ($entries.Count -ne 1 -or $entries[0].type -ne 'sensitive' -or $entries[0].target.Count -ne 1) { throw 'Production Secret scope mismatch.' }
$rsa = [Security.Cryptography.RSA]::Create(4096)
try {
    [Console]::WriteLine($rsa.ExportSubjectPublicKeyInfoPem())
    $encrypted = [Convert]::FromBase64String([Console]::ReadLine())
    $clear = $rsa.Decrypt($encrypted, [Security.Cryptography.RSAEncryptionPadding]::OaepSHA256)
    $binding = [Text.Encoding]::UTF8.GetString($clear)
    $uri = [Uri]$binding
    if ($uri.Scheme -notin @('postgres','postgresql') -or $uri.Host -cne 'ep-shiny-block-bhmlplzm-pooler.c-10.eu-central-1.aws.neon.tech' -or $uri.AbsolutePath -cne '/neondb' -or $uri.UserInfo -cnotmatch '^vastunord_prod_runtime:.+' -or $uri.Query -notmatch '(?:^\?|&)sslmode=(require|verify-full)(?:&|$)') { throw 'Production target rejected.' }
    $null = $binding | & $wrapper -CliArguments @('env','update','DATABASE_URL','--environment','production','--project',$projectId,'--sensitive','--yes')
    Write-Output 'Production runtime Secret updated.'
} finally {
    if ($clear) { [Array]::Clear($clear) }
    $binding = $null
    $uri = $null
    $rsa.Dispose()
}
