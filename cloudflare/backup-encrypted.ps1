# Cópia independente cifrada para o perfil Windows. Requer sessão Wrangler válida.
param([string]$BackupDirectory = (Join-Path $env:USERPROFILE 'Documents\Furna-Backups'))
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security
New-Item -ItemType Directory -Force -Path $BackupDirectory | Out-Null
$resolved = (Resolve-Path -LiteralPath $BackupDirectory).Path
$repository = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
if ($resolved -eq $repository -or $resolved.StartsWith($repository + [IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) { throw 'A cópia não pode ficar no repositório.' }
$temp = Join-Path $env:TEMP ('furna-export-' + [Guid]::NewGuid().ToString('N') + '.sql')
$target = Join-Path $resolved ('furna-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.dpapi')
Push-Location $repository
try {
  # Evita guardar no registo o link temporário de exportação emitido pelo Wrangler.
  & npx.cmd wrangler d1 export furna-reservas --remote --output $temp --skip-confirmation *> $null
  if ($LASTEXITCODE -ne 0 -or !(Test-Path -LiteralPath $temp)) { throw 'Falha na exportação D1; verifica a sessão Wrangler e a rede.' }
  $bytes = [IO.File]::ReadAllBytes($temp)
  $encrypted = [Security.Cryptography.ProtectedData]::Protect($bytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
  [IO.File]::WriteAllBytes($target, $encrypted)
  Write-Output "Cópia cifrada criada: $target"
} finally {
  if (Test-Path -LiteralPath $temp) { Remove-Item -LiteralPath $temp -Force }
  Pop-Location
}
