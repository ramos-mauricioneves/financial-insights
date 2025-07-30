#!/bin/bash
set -e

echo "🚀 Instalando dependências do projeto..."

# Verificar se Python está instalado
if ! command -v python &> /dev/null; then
    echo "❌ Python não encontrado. Instale Python 3.8+ primeiro."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

echo "📦 Instalando dependências do backend..."
python -m pip install -r backend/requirements.txt --user

echo "📦 Instalando dependências do frontend..."
cd frontend
npm install

echo "🔨 Buildando frontend..."
npm run build
cd ..

echo "✅ Dependências instaladas com sucesso!"
echo "🎯 Para executar: bash run.sh"
