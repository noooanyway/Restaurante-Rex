$ErrorActionPreference = 'Stop'
$secure = Read-Host 'Chave do painel (não aparece no ecrã)' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $env:FURNA_TEST_TOKEN = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  $env:FURNA_TEST_CODE = Read-Host 'Código atual da aplicação de autenticação'
  node (Join-Path $PSScriptRoot 'test-gmail-live.mjs')
  if ($LASTEXITCODE -ne 0) { throw 'Teste online falhou. Verifica a mensagem acima.' }
} finally {
  Remove-Item Env:FURNA_TEST_TOKEN -ErrorAction SilentlyContinue
  Remove-Item Env:FURNA_TEST_CODE -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
}
