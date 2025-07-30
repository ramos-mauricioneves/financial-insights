# Financial Insights

Aplicação de insights financeiros que integra com a API do Organizze.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python + HTTPX
- **Deploy**: Railway
- **Build**: Nixpacks

## 📁 Estrutura do Projeto

```
financial-insights/
├── frontend/          # Aplicação React
├── backend/           # API FastAPI
├── railway.json       # Configuração do Railway
├── nixpacks.toml     # Configuração do Nixpacks
├── Procfile          # Configuração do Railway
├── run.sh            # Script de inicialização
└── env.example       # Exemplo de variáveis de ambiente
```

## 🚀 Deploy no Railway

1. Conecte seu repositório ao Railway
2. Configure as variáveis de ambiente:
   - `ORGANIZZE_API_KEY`: Sua chave da API do Organizze
   - `ENVIRONMENT`: `production`
   - `CORS_ORIGINS`: URLs permitidas para CORS
3. O Railway detectará automaticamente a configuração
4. O build será executado usando Nixpacks
5. A aplicação será iniciada usando o comando em `run.sh`

## 💻 Desenvolvimento Local

### Pré-requisitos
- Python 3.8+
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clonar repositório
git clone <seu-repositorio>
cd financial-insights

# Instalar dependências
bash install.sh

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas configurações

# Executar aplicação
bash run.sh
```

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 8000 |
| `ENVIRONMENT` | Ambiente (development/production) | development |
| `ORGANIZZE_API_KEY` | Chave da API do Organizze | - |
| `CORS_ORIGINS` | URLs permitidas para CORS | localhost:3000,localhost:5173 |
| `ALLOWED_HOSTS` | Hosts permitidos | localhost,127.0.0.1 |

## 📊 Funcionalidades

- **Dashboard**: Visão geral das finanças
- **Transações**: Listagem e análise de transações
- **Orçamento**: Planejamento e controle de gastos
- **Insights**: Análises e relatórios financeiros
- **Investimentos**: Acompanhamento de investimentos
- **Integração Organizze**: Sincronização com API externa

## 🔌 Endpoints da API

- `GET /api/accounts` - Listar contas
- `GET /api/transactions` - Listar transações (com paginação)
- `GET /api/categories` - Listar categorias
- `GET /health` - Health check

## 🛡️ Segurança

- CORS configurado adequadamente
- Middleware de segurança em produção
- Validação de entrada
- Tratamento de erros robusto

## 📝 Licença

MIT 