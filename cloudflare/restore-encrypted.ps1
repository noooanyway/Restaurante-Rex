# Descifra para um ficheiro privado para testar um restauro; usa apenas no mesmo perfil Windows.
param([Parameter(Mandatory=$true)][string]$BackupFile,[Parameter(Mandatory=$true)][string]$OutputFile)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security
if (Test-Path -LiteralPath $OutputFile) { throw 'O ficheiro de destino já existe.' }
$bytes = [IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $BackupFile).Path)
$plain = [Security.Cryptography.ProtectedData]::Unprotect($bytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)
[IO.File]::WriteAllBytes([IO.Path]::GetFullPath($OutputFile),$plain)
Write-Output 'Cópia descifrada; apaga o ficheiro SQL privado depois do restauro.'
