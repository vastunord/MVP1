param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CliArguments,
    [Parameter(ValueFromPipeline = $true)]
    [AllowEmptyString()]
    [string] $ForwardedInput
)

$ErrorActionPreference = 'Stop'
$hasForwardedInput = $PSBoundParameters.ContainsKey('ForwardedInput')
$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$configDir = Join-Path $repoRoot '.vercel-vastunord-cli'
$cliVersion = 'vercel@66.5.0'
$isolatedVariables = @('VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID')
$priorValues = @{}
$blockedOverrides = '^(--global-config|--scope|--team|--token|--api|--cwd)(=|$)|^(-Q|-S|-t)$'

foreach ($argument in $CliArguments) {
    if ($argument -match $blockedOverrides) {
        throw 'Account, team, credential and working-directory overrides are not allowed in the Vastu Nord wrapper.'
    }
}

try {
    Push-Location -LiteralPath $repoRoot
    foreach ($name in $isolatedVariables) {
        $priorValues[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
        [Environment]::SetEnvironmentVariable($name, $null, 'Process')
    }

    $identityJson = & pnpm dlx $cliVersion whoami --global-config $configDir --format json
    if ($LASTEXITCODE -ne 0) {
        throw 'The isolated Vastu Nord Vercel CLI is not signed in.'
    }
    $identity = $identityJson | ConvertFrom-Json
    if ($identity.username -ne 'vastunord' -or
        $identity.email -ne 'vastunord@gmail.com' -or
        $identity.team.id -ne 'team_XXq1MkmBmNipFuTqB7Ozv6GV') {
        throw 'Vercel CLI identity or team does not match Vastu Nord.'
    }

    if (-not $CliArguments -or $CliArguments.Count -eq 0) {
        Write-Output 'Verified Vastu Nord CLI context: vastunord@gmail.com / vastu-nord'
    } else {
        $separatorIndex = [Array]::IndexOf($CliArguments, '--')
        if ($separatorIndex -ge 0) {
            $before = @($CliArguments | Select-Object -First $separatorIndex)
            $after = @($CliArguments | Select-Object -Skip ($separatorIndex + 1))
            & pnpm dlx $cliVersion @before --global-config $configDir --scope vastu-nord -- @after
        } else {
            if ($hasForwardedInput) {
                $ForwardedInput | & pnpm dlx $cliVersion @CliArguments --global-config $configDir --scope vastu-nord
            } else {
                & pnpm dlx $cliVersion @CliArguments --global-config $configDir --scope vastu-nord
            }
        }
        if ($LASTEXITCODE -ne 0) {
            throw "Vastu Nord Vercel CLI command failed with exit code $LASTEXITCODE."
        }
    }
} finally {
    foreach ($name in $isolatedVariables) {
        [Environment]::SetEnvironmentVariable($name, $priorValues[$name], 'Process')
    }
    Pop-Location
}
