# ========================================
# SCRIPT: Executar Criação da Tabela USUARIOS (PowerShell)
# DESCRIÇÃO: Executa o script Python para criar a tabela USUARIOS usando psycopg-binary
# ========================================

Write-Host "🚀 Iniciando criação da tabela USUARIOS com psycopg-binary..." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# Verifica se estamos no diretório correto
if (-not (Test-Path "criar_usuarios.py")) {
    Write-Host "❌ Erro: Execute este script do diretório Backend/scripts/" -ForegroundColor Red
    exit 1
}

# Verifica se o Python está disponível
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro: Python não encontrado" -ForegroundColor Red
    Write-Host "💡 Instale o Python em: https://python.org" -ForegroundColor Yellow
    exit 1
}

# Verifica se psycopg-binary está instalado
try {
    python -c "import psycopg" 2>$null
    Write-Host "✅ psycopg-binary encontrado" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Aviso: psycopg-binary não encontrado. Instalando..." -ForegroundColor Yellow
    try {
        pip install psycopg-binary
        Write-Host "✅ psycopg-binary instalado com sucesso" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao instalar psycopg-binary" -ForegroundColor Red
        exit 1
    }
}

# Executa o script Python
Write-Host "📄 Executando script Python com psycopg-binary..." -ForegroundColor Cyan
try {
    python criar_usuarios.py
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Tabela USUARIOS criada com sucesso usando psycopg-binary!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
        Write-Host "1. Verifique se a tabela foi criada no PostgreSQL" -ForegroundColor White
        Write-Host "2. Execute os testes para validar a estrutura" -ForegroundColor White
        Write-Host "3. Configure as APIs para usar o novo modelo" -ForegroundColor White
        Write-Host "4. Teste a performance com psycopg-binary" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Erro na criação da tabela!" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔧 Solução de problemas:" -ForegroundColor Yellow
        Write-Host "1. Verifique se o PostgreSQL está rodando" -ForegroundColor White
        Write-Host "2. Confirme as credenciais de conexão" -ForegroundColor White
        Write-Host "3. Verifique se o banco de dados existe" -ForegroundColor White
        Write-Host "4. Confirme se psycopg-binary está instalado" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao executar o script: $_" -ForegroundColor Red
    exit 1
} 