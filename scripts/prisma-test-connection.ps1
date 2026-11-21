#requires -Version 7.0
# This check is pinned to the Phase 02E-1D disposable branch.
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
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
       OR current_setting('neon.branch_id', true) IS DISTINCT FROM 'br-lively-wildflower-bhwpjl4q'
       OR current_setting('neon.endpoint_id', true) IS DISTINCT FROM 'ep-holy-waterfall-bheg01mu'
       OR current_schema() IS DISTINCT FROM 'public'
       OR to_regclass('public._prisma_migrations') IS NOT NULL
       OR EXISTS (SELECT FROM pg_class WHERE relnamespace = 'public'::regnamespace
                  AND relkind IN ('r','p','v','m','f','S'))
    THEN RAISE EXCEPTION 'Unexpected database identity or baseline';
    END IF;
END;
$verify$;
ROLLBACK;
'@

Write-Host 'Vastu Nord | disposable migration test | read-only Prisma connection'
Write-Host 'In Neon select migration-test-phase02e1d, neondb, and vastunord_dev_migrator.'
Write-Host 'Enter only the role password. Press Enter with an empty prompt to cancel.'
$secret = Read-Host 'Test branch migrator password' -AsSecureString
$ptr = [IntPtr]::Zero
$child = $null
$status = 1
try {
    if ($secret.Length -eq 0) { exit 2 }
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
    $encoded = [Uri]::EscapeDataString([Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr))
    $start.Environment['DIRECT_DATABASE_URL'] = 'postgresql://vastunord_dev_migrator:' + $encoded + '@ep-holy-waterfall-bheg01mu.c-10.eu-central-1.aws.neon.tech/neondb?sslmode=require&sslaccept=strict&schema=public&connect_timeout=12'
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
    # Raw diagnostics and the URL stay out of the console and log files.
} catch {
    $status = 1
} finally {
    if ($child) { $child.Dispose() }
    $start.Environment.Remove('DIRECT_DATABASE_URL') | Out-Null
    if ($ptr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
    $encoded = $null
    $secret.Dispose()
}
if ($status -eq 0) { Write-Host 'Read-only Prisma connection and expected baseline verified.' }
else { Write-Host 'Direct Prisma verification did not pass.' }
exit $status
