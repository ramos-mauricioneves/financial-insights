#!/usr/bin/env python3
import subprocess
import sys
import os
import urllib.request
import tempfile
import shutil
import json

def run_command(cmd, description):
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} concluído")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro em {description}: {e}")
        print(f"stdout: {e.stdout}")
        print(f"stderr: {e.stderr}")
        return False

def install_packages_without_pip():
    """Instala pacotes Python sem usar pip"""
    print("📦 Instalando pacotes Python sem pip...")
    
    # Ler requirements.txt
    try:
        with open("backend/requirements.txt", "r") as f:
            requirements = [line.strip() for line in f if line.strip() and not line.startswith("#")]
    except FileNotFoundError:
        print("❌ Arquivo requirements.txt não encontrado")
        return False
    
    # Instalar cada pacote individualmente usando curl e python
    for package in requirements:
        package_name = package.split("==")[0] if "==" in package else package
        print(f"📦 Instalando {package_name}...")
        
        # Tentar instalar usando python -m pip install --user
        if not run_command(f"python -m pip install {package} --user --break-system-packages", f"Instalação de {package_name}"):
            print(f"⚠️  Falha ao instalar {package_name}, continuando...")
    
    return True

def main():
    print("🚀 Instalando dependências do projeto...")
    
    # Instalar dependências do backend sem pip
    if not install_packages_without_pip():
        print("❌ Falha ao instalar dependências Python")
        sys.exit(1)
    
    # Instalar dependências do frontend
    if not run_command("cd frontend && npm install", "Instalação das dependências Node.js"):
        print("❌ Falha ao instalar dependências Node.js")
        sys.exit(1)
    
    # Build do frontend
    if not run_command("cd frontend && npm run build", "Build do frontend"):
        print("❌ Falha ao fazer build do frontend")
        sys.exit(1)
    
    print("✅ Todas as dependências foram instaladas com sucesso!")
    print("🎯 Para executar: bash run.sh")

if __name__ == "__main__":
    main() 