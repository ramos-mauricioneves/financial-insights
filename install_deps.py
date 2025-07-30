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

def main():
    print("🚀 Instalando dependências do projeto...")
    
    # Verificar se pip está disponível
    try:
        import pip
        print("✅ pip já está disponível")
    except ImportError:
        print("📦 Instalando pip...")
        if not run_command("python -m ensurepip --user", "Instalação do pip"):
            print("❌ Falha ao instalar pip")
            sys.exit(1)
        
        # Adicionar ~/.local/bin ao PATH
        home = os.path.expanduser("~")
        local_bin = os.path.join(home, ".local", "bin")
        if local_bin not in os.environ.get("PATH", ""):
            os.environ["PATH"] = f"{local_bin}:{os.environ.get('PATH', '')}"
    
    # Instalar dependências do backend
    if not run_command("python -m pip install -r backend/requirements.txt --user", "Instalação das dependências Python"):
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