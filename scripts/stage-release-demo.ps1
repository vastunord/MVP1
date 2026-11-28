#requires -Version 7
# Package only the tracked web application at HEAD. The CLI uses the linked
# project in the archive and the operator's isolated Vastu Nord CLI session.
[CmdletBinding()]
param(
    [switch] $VerifyRuntime,
    [switch] $VerifyProviders,
    [switch] $CheckPranaReplies,
    [switch] $EnableAuthentication,
    [switch] $EnablePrivateMedia,
    [switch] $EnableRendering,
    [switch] $EnableSubmission,
    [switch] $EnableGoogle,
    [switch] $EnablePrana,
    [ValidatePattern('^[a-zA-Z0-9_-]{1,100}$')] [string] $CampaignId
)
$ErrorActionPreference = 'Stop'
if ($CheckPranaReplies -and !$VerifyProviders) { throw 'Synthetic Prana checks require the explicit provider verification stage.' }
if (($EnablePrivateMedia -or $EnableGoogle -or $EnablePrana) -and !$EnableAuthentication) { throw 'These controlled services require verified-account authentication.' }
if ($EnableRendering -and !$EnablePrivateMedia) { throw 'Rendering requires private media.' }
if ($EnableSubmission -and (!$EnableRendering -or !$CampaignId)) { throw 'Submission requires rendering and the existing campaign ID.' }
if ($CampaignId -and !$EnableSubmission) { throw 'Only specify a campaign for controlled submission.' }
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$sha = (git -C $root rev-parse HEAD).Trim()
$link = Join-Path $root '.vercel/project.json'
$project = Get-Content -Raw -LiteralPath $link | ConvertFrom-Json
if ($project.projectId -ne 'prj_LyZA1xMnM4efg5U8SIAfGD4GIDc0' -or $project.orgId -ne 'team_XXq1MkmBmNipFuTqB7Ozv6GV') { throw 'Unexpected Vercel project' }
$stage = Join-Path $root ('.vercel/release-' + [guid]::NewGuid())
$null = New-Item -ItemType Directory -Path $stage
$archive = "$stage.zip"
git -C $root archive --format=zip "--output=$archive" $sha -- apps/web packages package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc
if ($LASTEXITCODE) { throw 'Source archive failed' }
Expand-Archive -LiteralPath $archive -DestinationPath $stage
$null = New-Item -ItemType Directory -Path (Join-Path $stage '.vercel')
Copy-Item -LiteralPath $link -Destination (Join-Path $stage '.vercel/project.json')
$arguments = @('deploy',$stage,'--prod','--skip-domain','--yes','--no-wait','--archive','tgz','--meta',"sourceCommit=$sha")
$flags = [ordered]@{
  AUTH_ENABLED = $EnableAuthentication.IsPresent
  MEDIA_UPLOADS_ENABLED = $EnablePrivateMedia.IsPresent
  MNML_RENDERING_ENABLED = $EnableRendering.IsPresent
  MNML_SUBMISSION_ENABLED = $EnableSubmission.IsPresent
  GOOGLE_OAUTH_ENABLED = $EnableGoogle.IsPresent
  PRANA_ENABLED = $EnablePrana.IsPresent
  GITHUB_OAUTH_ENABLED = $false
  APPLE_OAUTH_ENABLED = $false
  MEDIA_RECONCILIATION_ENABLED = $false
  NEWSLETTER_ENABLED = $false
}
foreach ($entry in $flags.GetEnumerator()) {
  $setting = $entry.Key + '=' + $entry.Value.ToString().ToLowerInvariant()
  $arguments += @('--env',$setting,'--build-env',$setting)
}
if ($EnableSubmission) { $arguments += @('--env',"MNML_TEST_CAMPAIGN_ID=$CampaignId",'--build-env',"MNML_TEST_CAMPAIGN_ID=$CampaignId") }
if ($VerifyRuntime) { $arguments += @('--env','VN_VERIFY_RELEASE=1') }
if ($VerifyProviders) { $arguments += @('--build-env','VN_PROBE_RELEASE_PROVIDERS=1') }
if ($CheckPranaReplies) { $arguments += @('--build-env','VN_CHECK_PRANA_REPLIES=1') }
& (Join-Path $PSScriptRoot 'vercel-vastunord.ps1') -CliArguments $arguments
