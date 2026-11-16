# Exportação manual de segurança para uma pasta privada fora do repositório.
# Nunca colocares a cópia no Git: contém dados pessoais.
param([Parameter(Mandatory=$true)][string]$BackupDirectory)
$ErrorActionPreference = 'Stop'
$resolved = (Resolve-Path -LiteralPath $BackupDirectory).Path
$repository = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
if ($resolved -eq $repository -or $resolved.StartsWith($repository + [IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) { throw 'Escolhe uma pasta fora do repositório.' }
$target = Join-Path $resolved ('furna-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.sql')
Push-Location $repository
try { & npx wrangler d1 export furna-reservas --remote --output $target --skip-confirmation; if ($LASTEXITCODE -ne 0) { throw 'A exportação falhou.' } } finally { Pop-Location }
Write-Host 'Cópia criada. Guarda-a em local privado e testa o restauro numa base isolada:' $target
