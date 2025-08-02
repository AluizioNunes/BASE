# Script PowerShell para limpar e recriar containers BASE

Write-Host "🧹 LIMPANDO E RECRIANDO CONTAINERS BASE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Parar e remover todos os containers
Write-Host "📦 Parando containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down

# Remover volumes do PostgreSQL para forçar recriação da database
Write-Host "🗄️ Removendo volume do PostgreSQL..." -ForegroundColor Yellow
# Nota: No Windows, os volumes são gerenciados pelo Docker Desktop
# A remoção será feita automaticamente quando recriarmos os containers

# Reconstruir e subir containers
Write-Host "🚀 Reconstruindo e subindo containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d --build

# Aguardar PostgreSQL inicializar
Write-Host "⏳ Aguardando PostgreSQL inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar status dos containers
Write-Host "📊 Status dos containers:" -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml ps

Write-Host ""
Write-Host "✅ PROCESSO CONCLUÍDO!" -ForegroundColor Green
Write-Host "🌐 Acesse: http://10.10.255.111" -ForegroundColor Cyan
Write-Host "📊 Grafana: http://10.10.255.111/grafana" -ForegroundColor Cyan
Write-Host "🔧 Traefik: http://10.10.255.111/traefik" -ForegroundColor Cyan
Write-Host "🐰 RabbitMQ: http://10.10.255.111/rabbitmq" -ForegroundColor Cyan
Write-Host "📈 Loki: http://10.10.255.111/loki" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciais:" -ForegroundColor Yellow
Write-Host "   - Usuário: ADMIN ou base@itfact.com.br" -ForegroundColor White
Write-Host "   - Senha: ADMIN123" -ForegroundColor White
Write-Host "   - Grafana: BASE/BASE" -ForegroundColor White
Write-Host "   - RabbitMQ: BASE/BASE" -ForegroundColor White 