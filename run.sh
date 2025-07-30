#!/bin/bash
echo "Iniciando backend na porta 443..."
cd backend/app
uvicorn main:app --host 0.0.0.0 --port 443 --reload
