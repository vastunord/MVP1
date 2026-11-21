#requires -Version 7.0
# This read-only check is pinned to the Vastu Nord development branch.
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
       OR current_setting('neon.branch_id', true) IS DISTINCT FROM 'br-mute-resonance-bhea4dyx'
       OR current_setting('neon.endpoint_id', true) IS DISTINCT FROM 'ep-purple-fog-bhs946ij'
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

Write-Host 'Vastu Nord | development verification | read-only Prisma connection'
Write-Host 'In Neon select development, neondb, and vastunord_dev_migrator.'
Write-Host 'Enter only the role password. Press Enter with an empty prompt to cancel.'
$secret = Read-Host 'Development migrator password' -AsSecureString
$ptr = [IntPtr]::Zero
$child = $null
$status = 1
try {
    if ($secret.Length -eq 0) { exit 2 }
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
    $encoded = [Uri]::EscapeDataString([Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr))
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
    # Suppress the raw output and URL.
} catch {
    $status = 1
} finally {
    if ($child) { $child.Dispose() }
    $start.Environment.Remove('DIRECT_DATABASE_URL') | Out-Null
    if ($ptr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
    $encoded = $null
    $secret.Dispose()
}
if ($status -eq 0) { Write-Host 'Development identity, empty baseline and pending migration status verified.' }
else { Write-Host 'Direct Prisma verification did not pass.' }
exit $status
