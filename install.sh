#!/bin/bash
echo "Instalando backend..."
python -m pip install --upgrade pip
python -m pip install -r backend/app/requirements.txt
echo "Instalando frontend..."
cd frontend
npm install
npm run build
cd ..
echo "Dependências instaladas com sucesso."
