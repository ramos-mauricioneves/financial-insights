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
    """Verifica se pip está disponível de várias formas"""
    # Tentativa 1: Importar pip
    try:
        import pip
        print("✅ pip disponível via import")
        return True
    except ImportError:
        pass
    
    # Tentativa 2: Verificar se o comando pip existe
    try:
        result = subprocess.run(["python", "-m", "pip", "--version"], 
                              capture_output=True, text=True, check=True)
        print("✅ pip disponível via comando")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    
    # Tentativa 3: Verificar se pip está no PATH
    try:
        result = subprocess.run(["pip", "--version"], 
                              capture_output=True, text=True, check=True)
        print("✅ pip disponível no PATH")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    
    return False

def main():
    print("🚀 Instalando dependências do projeto...")
    
    # Verificar se pip está disponível
    if not check_pip():
        print("❌ pip não está disponível. Tentando instalar...")
        if not run_command("python -m ensurepip --user", "Instalação do pip"):
            print("❌ Falha ao instalar pip")
            sys.exit(1)
    
    # Instalar dependências do backend
    if not run_command("python -m pip install -r backend/requirements.txt", "Instalação das dependências Python"):
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