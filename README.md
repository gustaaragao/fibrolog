<div align="center">

<img src="fibrolog-api/assets/logo.jpeg" alt="FibroLog Logo" width="200" height="200">

# FibroLog P2527
### Sistema Digital para Monitoramento da Fibromialgia

Plataforma completa para acompanhamento e gestão de sintomas da fibromialgia, desenvolvida como projeto acadêmico na disciplina de Engenharia de Software I e II da Universidade Federal de Sergipe.

</div>

## 📱 Sobre o Projeto

O **FibroLog** é uma solução digital inovadora projetada para auxiliar pacientes com fibromialgia no monitoramento diário de seus sintomas, dores e qualidade de vida. O sistema oferece uma interface intuitiva e funcionalidades específicas para o acompanhamento médico desta condição crônica.

### ✨ Principais Funcionalidades

- 📊 **Registro diário de sintomas** - Acompanhamento detalhado da dor e outros sintomas
- 📈 **Relatórios e gráficos** - Visualização do progresso ao longo do tempo  
- 💊 **Controle de medicamentos** - Lembretes e histórico de medicação
- 📋 **Exames médicos** - Agendamento e acompanhamento de consultas
- 🔔 **Notificações inteligentes** - Lembretes personalizados
- 📱 **Interface responsiva** - Acesso via aplicativo móvel e web

## 🏗️ Arquitetura do Sistema

O projeto segue uma arquitetura moderna de **microserviços** com separação clara entre frontend e backend:

```
fibrolog/
├── 📱 fibrolog-app/     # Aplicativo móvel (React Native + Expo)
├── 🔧 fibrolog-api/     # API backend (Python + FastAPI)
├── 📚 fibrolog-docs/    # Documentação do projeto
└── 📄 README.md         # Este arquivo
```

### 🛠️ Stack Tecnológica

#### Frontend (Mobile App)
- **Framework**: React Native 0.81.5 + Expo SDK 54
- **Linguagem**: TypeScript (strict mode)
- **Navegação**: Expo Router (file-based routing)
- **Estado**: React Hooks + Context API
- **UI**: NativeWind (Tailwind CSS para React Native)

#### Backend (API)
- **Framework**: FastAPI (Python 3.12+)
- **Banco de Dados**: SQLite (dev), PostgreSQL (prod)
- **ORM**: SQLAlchemy (async)
- **Autenticação**: JWT + OAuth2 Bearer tokens
- **Validação**: Pydantic
- **Migrações**: Alembic

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18.x ou superior
- **Python** 3.12 ou superior
- **Poetry** (gerenciador de dependências Python)
- **Expo CLI** (`npm install -g @expo/cli`)

### ⚡ Instalação Rápida

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/fibrolog.git
   cd fibrolog
   ```

2. **Configure o Backend (API)**
   ```bash
   cd fibrolog-api
   poetry install
   cp .env.example .env
   # Edite o .env com suas configurações
   alembic upgrade head
   ```

3. **Configure o Frontend (App)**
   ```bash
   cd ../fibrolog-app
   npm install
   ```

4. **Execute o projeto**
   
   Em um terminal (Backend):
   ```bash
   cd fibrolog-api
   task run
   ```
   
   Em outro terminal (Frontend):
   ```bash
   cd fibrolog-app
   npm start
   ```

## 📖 Documentação Detalhada

Cada módulo possui sua documentação específica:

- **[fibrolog-app/README.md](fibrolog-app/README.md)** - Guia do aplicativo móvel
- **[fibrolog-api/README.md](fibrolog-api/README.md)** - Documentação da API
- **[Documentação Completa](fibrolog-docs/)** - Especificações e arquitetura

### 🔗 Links Úteis

- **API Docs (Swagger)**: http://localhost:8000/docs
- **Expo DevTools**: Disponível após `npm start`

## 🧪 Execução de Testes

### Backend
```bash
cd fibrolog-api
task test           # Executa todos os testes com cobertura
task coverage       # Abre relatório HTML de cobertura
```

### Frontend
```bash
cd fibrolog-app
npm run lint        # Verifica qualidade do código
# Testes serão configurados em breve
```

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido por estudantes da **Universidade Federal de Sergipe** como parte do currículo de Engenharia de Software.

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<div align="center">

**FibroLog P2527** - Tecnologia a serviço do cuidado com a fibromialgia

*Desenvolvido com ❤️ na Universidade Federal de Sergipe*

</div>
