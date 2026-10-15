$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) { $labNode = $nodeCommand.Source } else {
  $labNode = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
  if (-not (Test-Path -LiteralPath $labNode)) { throw '需要安裝 Node.js 20.19+ 或 22.12+。' }
}
if (-not (Test-Path -LiteralPath 'node_modules/vite/bin/vite.js')) {
  $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
  if ($npmCommand) { & $npmCommand.Source ci } elseif (Test-Path -LiteralPath '.tools/package/bin/npm-cli.js') { & $labNode '.tools/package/bin/npm-cli.js' ci --cache .tools/npm-cache } else { throw '需要 npm 才能安裝依賴。' }
  if ($LASTEXITCODE -ne 0) { throw '套件安裝失敗。' }
}
& $labNode 'node_modules/vite/bin/vite.js' --host 127.0.0.1 --port 5173
