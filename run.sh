#!/bin/bash
set -e

echo "🚀 Iniciando Financial Insights..."

# Verificar se as dependências Python estão instaladas
if ! python -c "import fastapi" 2>/dev/null; then
    echo "⚠️  Dependências Python não encontradas. Instalando..."
    python -m pip install -r backend/requirements.txt --user --break-system-packages || {
        echo "❌ Falha ao instalar dependências Python"
        echo "🔄 Tentando instalar individualmente..."
        python -m pip install fastapi uvicorn httpx python-dotenv pydantic --user --break-system-packages || {
            echo "❌ Falha ao instalar dependências Python. Continuando..."
        }
    }
fi

# Verificar se o frontend foi buildado
if [ ! -d "frontend/dist" ]; then
    echo "⚠️  Frontend não buildado. Executando build..."
    cd frontend
    npm run build
    cd ..
fi

# Definir porta padrão
PORT=${PORT:-8000}
echo "🌐 Iniciando backend na porta $PORT..."

# Verificar se estamos em produção
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🏭 Modo produção ativado"
    cd backend/app
    uvicorn main:app --host 0.0.0.0 --port $PORT
else
    echo "🔧 Modo desenvolvimento ativado"
    cd backend/app
    uvicorn main:app --host 0.0.0.0 --port $PORT --reload
fi
