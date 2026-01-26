# FibroLog API

API para gerenciamento de dados de pacientes com fibromialgia.

## Configuração do Ambiente

### Pré-requisitos
- Python 3.12+
- Poetry

### Instalação

1. Instale as dependências:
```bash
poetry install
```

2. Configure as variáveis de ambiente criando um arquivo `.env`:
```bash
DATABASE_URL="sqlite:///database.db"
```

## Gerenciamento do Banco de Dados

### Criar o banco de dados pela primeira vez

```bash
alembic upgrade head
```

### Criar uma nova migração

Após alterar os modelos em `fibrolog_api/models.py`:

```bash
alembic revision --autogenerate -m "descrição da alteração"
```

### Aplicar migrações pendentes

```bash
alembic upgrade head
```

## Executar o Projeto

### Modo desenvolvimento

```bash
task run
```

### Executar testes

```bash
task test
```

### Formatar código

```bash
task format
```

### Verificar lint

```bash
task lint
```

## Estrutura do Projeto

```
fibrolog-api/
├── fibrolog_api/          # Código fonte da aplicação
│   ├── __init__.py
│   ├── app.py            # Aplicação FastAPI
│   ├── database.py       # Configuração do banco de dados
│   ├── models.py         # Modelos SQLAlchemy
│   ├── schemas.py        # Schemas Pydantic
│   └── routers/          # Rotas da API
│       └── pacientes.py
├── migrations/           # Migrações do Alembic
│   └── versions/        # Arquivos de migração
├── tests/               # Testes automatizados
│   ├── conftest.py      # Fixtures do pytest
│   └── test_pacientes.py
├── alembic.ini          # Configuração do Alembic
├── pyproject.toml       # Dependências e configurações
└── README.md            # Este arquivo
```

## Documentação da API

Após iniciar o servidor, acesse:
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

