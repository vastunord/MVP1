# Run interactively. The password is read without echo and exists only in memory.
# This helper can only inspect migration status. It cannot apply migrations.
$ErrorActionPreference = 'Stop'
$webRoot = Join-Path $PSScriptRoot '../apps/web'
$prismaEntry = (Resolve-Path (Join-Path $webRoot 'node_modules/prisma/build/index.js')).Path
$nodePath = (Get-Command node -CommandType Application).Source
$secret = Read-Host 'Vastu Nord development migrator password' -AsSecureString
$passwordPointer = [IntPtr]::Zero
$process = $null
try {
    $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
    $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
    if ([string]::IsNullOrEmpty($password)) { throw 'A development password is required.' }
    $start = [Diagnostics.ProcessStartInfo]::new()
    $start.FileName = $nodePath
    $start.WorkingDirectory = (Resolve-Path $webRoot).Path
    $start.UseShellExecute = $false
    $start.CreateNoWindow = $true
    $start.RedirectStandardOutput = $true
    $start.RedirectStandardError = $true
    $start.ArgumentList.Add($prismaEntry)
    $start.ArgumentList.Add('migrate')
    $start.ArgumentList.Add('status')
    $start.Environment.Remove('DATABASE_URL') | Out-Null
    $start.Environment['DIRECT_DATABASE_URL'] = 'postgresql://vastunord_dev_migrator:' + [Uri]::EscapeDataString($password) + '@ep-purple-fog-bhs946ij.c-10.eu-central-1.aws.neon.tech/neondb?sslmode=require&schema=public'
    $process = [Diagnostics.Process]::Start($start)
    $outputTask = $process.StandardOutput.ReadToEndAsync()
    $errorTask = $process.StandardError.ReadToEndAsync()
    $process.WaitForExit()
    # Suppress raw provider/CLI diagnostics, which may contain connection details.
    $outputTask.GetAwaiter().GetResult() | Out-Null
    $errorTask.GetAwaiter().GetResult() | Out-Null
    Write-Output ('Development Prisma status finished with exit code ' + $process.ExitCode + '. Pending migrations may produce a nonzero code. Raw diagnostics suppressed.')
    $result = $process.ExitCode
} finally {
    if ($passwordPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer) }
    $password = $null
    if ($null -ne $start) { $start.Environment.Remove('DIRECT_DATABASE_URL') | Out-Null }
    $secret.Dispose()
    if ($null -ne $process) { $process.Dispose() }
}
exit $result
