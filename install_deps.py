#!/usr/bin/env python3
import subprocess
import sys
import os
import urllib.request
import tempfile
import shutil

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

def install_pip():
    """Instala pip usando get-pip.py"""
    print("📦 Instalando pip...")
    
    # Download get-pip.py
    get_pip_url = "https://bootstrap.pypa.io/get-pip.py"
    try:
        with urllib.request.urlopen(get_pip_url) as response:
            get_pip_content = response.read()
        
        # Salvar get-pip.py temporariamente
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.py', delete=False) as f:
            f.write(get_pip_content)
            get_pip_path = f.name
        
        # Executar get-pip.py
        if run_command(f"python {get_pip_path}", "Instalação do pip via get-pip.py"):
            os.unlink(get_pip_path)
            return True
        else:
            os.unlink(get_pip_path)
            return False
    except Exception as e:
        print(f"❌ Erro ao baixar get-pip.py: {e}")
        return False

def main():
    print("🚀 Instalando dependências do projeto...")
    
    # Tentar instalar pip primeiro
    if not install_pip():
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