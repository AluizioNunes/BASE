# Script PowerShell para executar atualizações de autenticação no Docker
Write-Host "🔧 Executando atualizações de autenticação no Docker..." -ForegroundColor Green

# Verifica se o container backend está rodando
$backendRunning = docker ps --format "table {{.Names}}" | Select-String "backend"
if (-not $backendRunning) {
    Write-Host "❌ Container backend não está rodando. Iniciando..." -ForegroundColor Yellow
    Set-Location C:\BASE
    docker-compose -f docker-compose.prod.yml up -d backend
    Start-Sleep -Seconds 10
}

# Executa o script Python dentro do container
Write-Host "📝 Executando script de atualização..." -ForegroundColor Cyan
docker exec backend python /app/scripts/executar_atualizacao_auth.py

# Verifica se foi bem-sucedido
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Atualizações aplicadas com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔑 Credenciais de acesso:" -ForegroundColor Yellow
    Write-Host "   Email: base@itfact.com.br" -ForegroundColor White
    Write-Host "   Usuário: ADMIN" -ForegroundColor White
    Write-Host "   Senha: ADMIN" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Acesse http://10.10.255.111" -ForegroundColor White
    Write-Host "  2. Faça login com as credenciais acima" -ForegroundColor White
    Write-Host "  3. Configure MFA se necessário" -ForegroundColor White
} else {
    Write-Host "❌ Erro ao aplicar atualizações" -ForegroundColor Red
    exit 1
} 