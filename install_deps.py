#!/usr/bin/env python3
import subprocess
import sys
import os

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

def check_pip():
    """Verifica se pip está disponível"""
    try:
        result = subprocess.run(["python", "-m", "pip", "--version"], 
                              capture_output=True, text=True, check=True)
        print("✅ pip está disponível")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ pip não está disponível")
        return False

def install_python_packages():
    """Instala pacotes Python usando pip se disponível"""
    if check_pip():
        return run_command("python -m pip install -r backend/requirements.txt --user", "Instalação das dependências Python")
    else:
        print("⚠️  pip não disponível, pulando instalação de dependências Python")
        print("⚠️  As dependências Python devem ser instaladas manualmente")
        return True

def main():
    print("🚀 Instalando dependências do projeto...")
    
    # Instalar dependências do backend
    if not install_python_packages():
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