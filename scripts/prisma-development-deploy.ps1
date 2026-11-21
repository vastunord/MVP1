#requires -Version 7.0
# Owner-authorized deployment of two reviewed migrations to development only.
[CmdletBinding()]
param([switch] $PreflightOnly)
$ErrorActionPreference = 'Stop'
$migrationRoot = Join-Path $PSScriptRoot '../apps/web/prisma/migrations'
$allowed = @('20261121_phase02c_initial', '20261121_phase02d_auth_projects')
$hashes = @('d79088cf6d074033a017e28fe888f22cc65dee7136e9fd9d044de227497c8a3a', '0676683c33f1377708ec8e94e8b1b3357c0e686fb190de69dc86b4b4f7d04b31')
$folders = @(Get-ChildItem -LiteralPath $migrationRoot -Directory | Sort-Object Name | ForEach-Object Name)
if ($folders.Count -ne 2 -or (Compare-Object $folders $allowed)) { throw 'Unexpected migration directories. Stopping.' }
for ($i = 0; $i -lt 2; $i++) {
    $file = Join-Path (Join-Path $migrationRoot $allowed[$i]) 'migration.sql'
    if ((Get-FileHash -Algorithm SHA256 -LiteralPath $file).Hash.ToLowerInvariant() -ne $hashes[$i]) { throw 'Migration checksum mismatch. Stopping.' }
}
$start = [Diagnostics.ProcessStartInfo]::new()
$start.FileName = (Get-Command node -CommandType Application | Select-Object -First 1).Source
$start.WorkingDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../apps/web')).Path
$cli = (Resolve-Path (Join-Path $start.WorkingDirectory 'node_modules/prisma/build/index.js')).Path
foreach ($item in @($cli, 'db', 'execute', '--stdin')) { $start.ArgumentList.Add($item) }
$start.UseShellExecute = $false
$start.CreateNoWindow = $true
$start.RedirectStandardInput = $true
$start.RedirectStandardOutput = $true
$start.RedirectStandardError = $true
$start.Environment.Clear()
foreach ($name in @('SystemRoot','ComSpec','Path','TEMP','TMP','USERPROFILE','LOCALAPPDATA','APPDATA','PATHEXT')) {
    $value = [Environment]::GetEnvironmentVariable($name)
    if ($value) { $start.Environment[$name] = $value }
}
$start.Environment['CHECKPOINT_DISABLE'] = '1'
$query = @'
BEGIN READ ONLY;
DO $verify$
BEGIN
    IF current_database() <> 'neondb' OR current_user <> 'vastunord_dev_migrator'
       OR current_setting('neon.branch_id', true) IS DISTINCT FROM 'br-mute-resonance-bhea4dyx'
       OR current_setting('neon.endpoint_id', true) IS DISTINCT FROM 'ep-purple-fog-bhs946ij'
       OR current_schema() IS DISTINCT FROM 'public'
       OR NOT has_schema_privilege('public', 'USAGE,CREATE')
       OR has_database_privilege(current_database(), 'CREATE')
       OR pg_has_role(current_user, 'neon_superuser', 'MEMBER')
       OR to_regclass('public._prisma_migrations') IS NOT NULL
       OR EXISTS (SELECT FROM pg_class WHERE relnamespace = 'public'::regnamespace
                  AND relkind IN ('r','p','v','m','f','S'))
    THEN RAISE EXCEPTION 'Unexpected database identity or baseline';
    END IF;
END;
$verify$;
ROLLBACK;
'@

Write-Host 'Vastu Nord | authorized development migration'
Write-Host 'Credential is supplied through the Vastu Nord Development environment.'
$password = [Environment]::GetEnvironmentVariable('VASTUNORD_DEV_MIGRATOR_PASSWORD', 'Process')
[Environment]::SetEnvironmentVariable('VASTUNORD_DEV_MIGRATOR_PASSWORD', $null, 'Process')
$child = $null
$status = 1
try {
    if ([string]::IsNullOrEmpty($password)) { throw 'Development migration credential is unavailable' }
    $encoded = [Uri]::EscapeDataString($password)
    $start.Environment['DIRECT_DATABASE_URL'] = 'postgresql://vastunord_dev_migrator:' + $encoded + '@ep-purple-fog-bhs946ij.c-10.eu-central-1.aws.neon.tech/neondb?sslmode=require&sslaccept=strict&schema=public&connect_timeout=12'
    $child = [Diagnostics.Process]::Start($start)
    $stdout = $child.StandardOutput.ReadToEndAsync()
    $stderr = $child.StandardError.ReadToEndAsync()
    $child.StandardInput.WriteLine($query)
    $child.StandardInput.Close()
    if ($child.WaitForExit(60000)) {
        $status = $child.ExitCode
    } else {
        $child.Kill($true)
    }
    $child.Dispose()
    $child = $null
    if ($status -ne 0) { throw 'Identity or baseline check failed' }
    $start.ArgumentList.Clear()
    foreach ($item in @($cli, 'migrate', 'status')) { $start.ArgumentList.Add($item) }
    $start.RedirectStandardInput = $false
    $child = [Diagnostics.Process]::Start($start)
    $stdout = $child.StandardOutput.ReadToEndAsync()
    $stderr = $child.StandardError.ReadToEndAsync()
    if (-not $child.WaitForExit(60000)) {
        $child.Kill($true)
        throw 'Status timed out'
    }
    $message = $stdout.GetAwaiter().GetResult() + $stderr.GetAwaiter().GetResult()
    if ($message -match '(?i)(have not yet been applied|not yet been applied|no migration found in database)' -and $message -notmatch '(?i)(error:|P[0-9]{4})') {
        $status = 0
    } else { $status = 1 }
    if ($status -ne 0) { throw 'Pending migration status check failed' }
    foreach ($name in $allowed) {
        if (-not $message.Contains($name)) { throw 'Expected pending migration missing' }
    }
    if (-not $PreflightOnly) {
        $child.Dispose()
        $child = $null
        $start.ArgumentList.Clear()
        foreach ($item in @($cli, 'migrate', 'deploy')) { $start.ArgumentList.Add($item) }
        $child = [Diagnostics.Process]::Start($start)
        $stdout = $child.StandardOutput.ReadToEndAsync()
        $stderr = $child.StandardError.ReadToEndAsync()
        if (-not $child.WaitForExit(120000)) {
            $child.Kill($true)
            throw 'Deploy timed out. Preserve state for diagnosis.'
        }
        $status = $child.ExitCode
        if ($status -ne 0) {
            $diagnostic = $stderr.GetAwaiter().GetResult() + $stdout.GetAwaiter().GetResult()
            $codes = @([regex]::Matches($diagnostic, 'P[0-9]{4}') | ForEach-Object { $_.Value } | Select-Object -Unique)
            Write-Host ('Sanitized Prisma codes: ' + ($codes -join ', '))
        }
    }
} catch {
    $status = 1
} finally {
    if ($child) { $child.Dispose() }
    $start.Environment.Remove('DIRECT_DATABASE_URL') | Out-Null
    $password = $null
    $encoded = $null
}
if ($status -eq 0 -and $PreflightOnly) { Write-Host 'Development migration preflight passed.' }
elseif ($status -eq 0) { Write-Host 'Development Prisma migration deploy passed.' }
else { Write-Host 'Preflight or deploy did not pass. Stop and contact Codex before retrying.' }
exit $status
