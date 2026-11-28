#requires -Version 7
# Package only the tracked web application at HEAD. The CLI uses the linked
# project in the archive and the operator's isolated Vastu Nord CLI session.
[CmdletBinding()]
param([switch] $VerifyRuntime)
$ErrorActionPreference = 'Stop'
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
foreach ($flag in @('AUTH_ENABLED','MEDIA_UPLOADS_ENABLED','MEDIA_RECONCILIATION_ENABLED','MNML_RENDERING_ENABLED','MNML_SUBMISSION_ENABLED','NEWSLETTER_ENABLED','PRANA_ENABLED')) {
  $arguments += @('--env',"$flag=false",'--build-env',"$flag=false")
}
if ($VerifyRuntime) { $arguments += @('--env','VN_VERIFY_RELEASE=1') }
& (Join-Path $PSScriptRoot 'vercel-vastunord.ps1') -CliArguments $arguments
