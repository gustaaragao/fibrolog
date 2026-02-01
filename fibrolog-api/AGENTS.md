# AGENTS.md - FibroLog API

Este documento fornece diretrizes para agentes de codificação (Claude, Cursor, Copilot, etc.) trabalhando neste repositório.

## Visão Geral do Projeto

- **Produto**: FibroLog - Sistema Digital para Monitoramento da Fibromialgia
- **Stack**: Python 3.12+, FastAPI, SQLAlchemy (async), Pydantic, Alembic
- **Banco de Dados**: SQLite (dev), PostgreSQL (prod)
- **Autenticação**: JWT + OAuth2 Bearer tokens, Argon2 para hash de senhas

---

## Comandos de Build/Lint/Test

### Comandos Principais (via Taskipy)

```bash
# Linting (verifica código)
task lint

# Formatação (corrige e formata código)
task format

# Executa servidor de desenvolvimento
task run

# Executa todos os testes com cobertura (roda lint como pre-hook)
task test

# Serve relatório de cobertura HTML na porta 8080
task coverage
```

### Executar um Único Teste

```bash
# Executa um arquivo de teste específico
pytest tests/test_auth.py -v

# Executa uma função de teste específica
pytest tests/test_auth.py::test_get_token -v

# Executa testes que correspondem a um padrão
pytest -k "test_create_paciente" -v

# Executa um teste específico com output detalhado
pytest tests/test_pacientes.py::test_create_paciente -s -vv
```

### Migrações de Banco de Dados

```bash
# Aplica todas as migrações
alembic upgrade head

# Cria nova migração automática
alembic revision --autogenerate -m "descrição da migração"

# Reverte última migração
alembic downgrade -1
```

---

## Estrutura do Projeto

```
fibrolog-api/
├── fibrolog_api/           # Código fonte principal
│   ├── app.py              # Entry point FastAPI
│   ├── database.py         # Configuração AsyncEngine/Session
│   ├── models.py           # Modelos SQLAlchemy ORM
│   ├── security.py         # JWT e hash de senhas
│   ├── settings.py         # Pydantic Settings (env vars)
│   ├── schemas/            # Schemas Pydantic (DTOs)
│   └── routers/            # Endpoints da API
├── migrations/             # Migrações Alembic
├── tests/                  # Testes automatizados
│   └── conftest.py         # Fixtures compartilhadas
├── gemini/                 # Documentação do projeto
│   └── GEMINI.md           # Contexto detalhado para IA
└── pyproject.toml          # Dependências e config
```

---

## Convenções de Código

### Idioma

- **Código, comentários, docstrings e mensagens de erro**: Português (pt-BR)
- **Nomes de variáveis e funções**: snake_case em português quando apropriado

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Arquivos | snake_case | `registros_diarios.py` |
| Variáveis/Funções | snake_case | `get_paciente`, `paciente_id` |
| Classes | PascalCase | `Paciente`, `RegistroDiario` |
| Constantes | UPPER_SNAKE_CASE | `DATABASE_URL`, `TIMEZONE` |
| Type Aliases | PascalCase | `Session`, `CurrentPaciente` |

### Formatação (Ruff)

- **Comprimento de linha**: 79 caracteres (PEP-8)
- **Aspas**: Simples (`'`) para todas as strings
- **Imports**: Organizados automaticamente pelo Ruff (isort)

### Ordem de Imports

```python
# 1. Biblioteca padrão
from http import HTTPStatus
from typing import Annotated

# 2. Terceiros
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# 3. Locais (absolutos)
from fibrolog_api.database import get_session
from fibrolog_api.models import Paciente
from fibrolog_api.schemas import PacienteSchema, PacientePublic
```

### Type Hints (Obrigatório)

```python
# Injeção de dependência com Annotated
Session = Annotated[AsyncSession, Depends(get_session)]
DBPaciente = Annotated[Paciente, Depends(get_current_paciente)]

# Funções sempre tipadas
async def get_paciente(paciente_id: int, session: Session) -> Paciente:
    ...

# SQLAlchemy com Mapped
class Paciente:
    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(255))
```

### Tratamento de Erros

```python
from http import HTTPStatus
from fastapi import HTTPException

# Use HTTPStatus enum, mensagens em português
if not paciente:
    raise HTTPException(
        status_code=HTTPStatus.NOT_FOUND,
        detail='Paciente não encontrado'
    )

if current_paciente.id != paciente_id:
    raise HTTPException(
        status_code=HTTPStatus.FORBIDDEN,
        detail='Permissões insuficientes'
    )
```

### Async/Await

- Todas as operações de I/O devem ser assíncronas
- Use `await session.scalar()` para resultado único
- Use `await session.scalars()` para múltiplos resultados
- Sempre `await session.commit()` e `await session.refresh()`

---

## Padrões de API

- **Prefixo de rotas**: Substantivos no plural (`/pacientes`, `/registros-diarios`)
- **Tags**: Nomes em português (`'Pacientes'`, `'Registros Diários'`)
- **Documentação**: Use `summary` e `description` nos endpoints

```python
@router.post(
    '/',
    status_code=HTTPStatus.CREATED,
    response_model=PacientePublic,
    summary='Criar paciente',
    description='Cria um novo paciente no sistema',
)
async def create_paciente(...):
    """Cria um novo paciente no sistema."""
    ...
```

---

## Padrões de Teste

- **Framework**: pytest + pytest-asyncio
- **Fixture**: Use `@pytest_asyncio.fixture` para fixtures async
- **Naming**: `test_<ação>_<cenário>` (ex: `test_create_paciente_duplicate_email`)

```python
import pytest
from http import HTTPStatus

pytestmark = pytest.mark.asyncio

async def test_create_paciente(client):
    response = await client.post('/pacientes/', json={...})
    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['nome'] == 'Nome Esperado'
```

---

## Regras de Negócio Principais

- **RN001**: Senha mínimo 8 caracteres (maiúsculas, minúsculas, números, símbolos)
- **RN006**: Apenas um registro diário por paciente (sobrescreve anterior)
- **RN012**: Dados do paciente são isolados (não acessíveis por outros)
- **RN015**: Sistema NÃO fornece diagnósticos médicos

---

## Checklist Antes do Commit

1. [ ] `task format` - Código formatado
2. [ ] `task lint` - Sem erros de lint
3. [ ] `task test` - Todos os testes passando
4. [ ] Se alterou `models.py` → criar migração com Alembic
5. [ ] Type hints completos em funções novas
6. [ ] Mensagens de erro em português

---

## Arquivos de Referência

- `.gemini/GEMINI.md` - Contexto detalhado do projeto e exemplos de código
- `pyproject.toml` - Configuração de ferramentas (Ruff, pytest, taskipy)
- `.env.example` - Variáveis de ambiente necessárias
