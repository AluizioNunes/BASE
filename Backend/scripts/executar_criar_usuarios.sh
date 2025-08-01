#!/bin/bash

# ========================================
# SCRIPT: Executar Criação da Tabela USUARIOS
# DESCRIÇÃO: Executa o script Python para criar a tabela USUARIOS usando psycopg-binary
# ========================================

echo "🚀 Iniciando criação da tabela USUARIOS com psycopg-binary..."
echo "=========================================================="

# Verifica se estamos no diretório correto
if [ ! -f "criar_usuarios.py" ]; then
    echo "❌ Erro: Execute este script do diretório Backend/scripts/"
    exit 1
fi

# Verifica se o Python está disponível
if ! command -v python3 &> /dev/null; then
    echo "❌ Erro: Python3 não encontrado"
    exit 1
fi

# Verifica se psycopg-binary está instalado
python3 -c "import psycopg" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️ Aviso: psycopg-binary não encontrado. Instalando..."
    pip install psycopg-binary
fi

# Executa o script Python
echo "📄 Executando script Python com psycopg-binary..."
python3 criar_usuarios.py

# Verifica o resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Tabela USUARIOS criada com sucesso usando psycopg-binary!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Verifique se a tabela foi criada no PostgreSQL"
    echo "2. Execute os testes para validar a estrutura"
    echo "3. Configure as APIs para usar o novo modelo"
    echo "4. Teste a performance com psycopg-binary"
else
    echo ""
    echo "❌ Erro na criação da tabela!"
    echo ""
    echo "🔧 Solução de problemas:"
    echo "1. Verifique se o PostgreSQL está rodando"
    echo "2. Confirme as credenciais de conexão"
    echo "3. Verifique se o banco de dados existe"
    echo "4. Confirme se psycopg-binary está instalado"
    exit 1
fi 