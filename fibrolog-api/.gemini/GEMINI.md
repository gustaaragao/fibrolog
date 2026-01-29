# CONTEXTO DE DESENVOLVIMENTO: FibroLog API

Este documento fornece as diretrizes, tecnologias e convenções para o desenvolvimento do backend (API) do sistema FibroLog.

---

## 1. VISÃO GERAL DO PROJETO

- **Produto**: Sistema Digital para Monitoramento da Fibromialgia (FibroLog).
- **Objetivo**: Desenvolver um aplicativo mobile que permita a pacientes com fibromialgia registrar sintomas (dor, fadiga, sono, humor), crises e outros dados relevantes para seu tratamento.
- **Componentes Principais**:
    - **Backend (API)**: API RESTful desenvolvida em Python com FastAPI.
    - **Frontend**: Aplicativo mobile (detalhado no contexto `fibrolog-app`).
    - **Inteligência Artificial**: Serviços de IA (Google Gemini/OpenAI) para transcrição de áudio.

---

## 2. ARQUITETURA E TECNOLOGIAS (BACKEND)

### 2.1. Stack Tecnológica

- **Core**: Python 3.12+, FastAPI, Uvicorn.
- **Banco de Dados**: SQLite (desenvolvimento), PostgreSQL (produção), SQLAlchemy (ORM Async), Alembic (migrações).
- **Validação de Dados**: Pydantic, Pydantic Settings.
- **Segurança**: JWT, OAuth2, Hash de senhas com Argon2 (`pwdlib`).
- **Testes e Qualidade**: Pytest, Pytest-asyncio, Pytest-cov, Ruff, Taskipy.
- **Outros**: HTTPX (para requisições async).

### 2.2. Estrutura de Diretórios

```
fibrolog-api/
├── fibrolog_api/              # Código fonte principal
│   ├── app.py                 # Aplicação FastAPI (entry point)
│   ├── database.py            # Configuração do banco de dados (AsyncEngine, SessionMaker)
│   ├── models.py              # Modelos SQLAlchemy (ORM)
│   ├── schemas.py             # Schemas Pydantic (validação de dados)
│   ├── security.py            # Funções de autenticação e segurança
│   ├── settings.py            # Configurações da aplicação
│   └── routers/               # Endpoints da API (organizados por recurso)
│       ├── auth.py
│       └── pacientes.py
├── migrations/                # Migrações Alembic
├── tests/                     # Testes automatizados
├── pyproject.toml             # Dependências e configurações do projeto
└── README.md                  # Documentação
```

### 2.3. Camadas da Arquitetura

1.  **Camada de Apresentação (Routers)**: Define os endpoints da API, recebe as requisições HTTP e retorna as respostas. Responsável pela validação da entrada de dados usando os Schemas.
2.  **Camada de Aplicação (Schemas)**: Utiliza Schemas Pydantic como DTOs (Data Transfer Objects) para validar, serializar e desserializar dados entre o cliente e o sistema.
3.  **Camada de Domínio (Models)**: Contém as entidades do negócio (Modelos SQLAlchemy) e a lógica de negócio principal.
4.  **Camada de Infraestrutura (Database, Security)**: Abstrai o acesso a serviços externos como banco de dados, sistemas de autenticação e outros.

### 2.4. Padrões de Design

-   **Injeção de Dependência**: Utiliza o sistema de `Depends()` do FastAPI para gerenciar dependências como sessões de banco de dados e autenticação de usuários.
-   **Padrão Repositório (implícito)**: A `AsyncSession` do SQLAlchemy atua como uma unidade de trabalho que gerencia a persistência dos modelos.
-   **Padrão DTO**: Separação clara entre os modelos ORM (`models.py`) e os schemas de dados (`schemas.py`) para evitar acoplamento.

---

## 3. CONVENÇÕES DE CÓDIGO

### 3.1. Idioma e Nomenclatura

-   **Idioma**: Todo o código, comentários, docstrings e mensagens de erro devem ser escritos em **Português (pt-BR)**.
-   **Nomenclatura de Arquivos**: `snake_case.py` (ex: `registros_diarios.py`).
-   **Variáveis e Funções**: `snake_case` (ex: `obter_paciente_por_id`).
-   **Classes**: `PascalCase` (ex: `Paciente`, `RegistroDiario`).
-   **Constantes**: `UPPER_SNAKE_CASE` (ex: `DATABASE_URL`).

### 3.2. Estilo de Código e Qualidade

-   **Formatação**: O código é formatado utilizando **Ruff**.
-   **Linting**: **Ruff** é usado para garantir a qualidade e a consistência do código. Siga as regras definidas no `pyproject.toml`.
-   **Organização de Imports**: As importações são organizadas automaticamente pelo Ruff.
-   **Comprimento da Linha**: Máximo de 79 caracteres.
-   **Aspas**: Use aspas simples (`'`) para strings, a menos que a string contenha uma aspa simples.

### 3.3. Anotações de Tipo (Type Hints)

-   **Obrigatoriedade**: Todas as funções, métodos e variáveis devem ter anotações de tipo completas.
-   **FastAPI `Depends`**: Use `Annotated` para injeção de dependências (ex: `db: Annotated[AsyncSession, Depends(get_session)]`).
-   **SQLAlchemy Models**: Use `Mapped` e `mapped_column` para definir os atributos dos modelos ORM.

### 3.4. Padrões de Código Específicos

-   **Async/Await**: Todas as operações de I/O (banco de dados, requisições HTTP) devem ser assíncronas. Use `async def` para funções e `await` para chamadas de I/O.
-   **Tratamento de Erros**: Lance `HTTPException` para erros relacionados a requisições HTTP. As mensagens de `detail` devem ser claras e em português.
-   **Códigos de Status HTTP**: Use as constantes do módulo `http.HTTPStatus` (ex: `HTTPStatus.CREATED`, `HTTPStatus.NOT_FOUND`).
-   **Docstrings**: Documente todas as funções e classes públicas utilizando o formato Google Style.

---

## 4. REGRAS DE NEGÓCIO PRINCIPAIS

-   **RN001 (Segurança de Senha)**: A senha do usuário deve ter no mínimo 8 caracteres, contendo letras maiúsculas, minúsculas, números e símbolos.
-   **RN004 (Registro Diário)**: O paciente deve registrar diariamente o nível de dor (escala de 0 a 10) e seu estado emocional. Outros campos como localização da dor e qualidade do sono são encorajados.
-   **RN006 (Consistência do Registro)**: O sistema permite apenas um registro diário por paciente. Um novo registro no mesmo dia sobrescreve o anterior.
-   **RN008 (Transcrição de Áudio)**: Áudios de descrição de crises, com no máximo 60 segundos, devem ser enviados para um serviço de IA para transcrição.
-   **RN012 (Isolamento de Dados)**: Os dados de um paciente são estritamente isolados e não podem ser acessados por outros pacientes.
-   **RN015 (Não Diagnóstico)**: O sistema é uma ferramenta de monitoramento e **não fornece diagnósticos médicos**.

---

## 5. FLUXO DE DESENVOLVIMENTO

1.  **Antes de Implementar**:
    -   Consulte este documento e o `README.md` do projeto.
    -   Verifique os requisitos funcionais e as regras de negócio aplicáveis.
    -   Planeje os casos de teste que cobrirão a nova funcionalidade.

2.  **Durante a Implementação**:
    -   Escreva testes (unitários e de integração) junto com o código da funcionalidade.
    -   Siga as convenções de código, nomenclatura e estilo definidas neste documento.
    -   Documente o código com docstrings e anotações de tipo.

3.  **Antes de Finalizar (Commit/PR)**:
    -   Execute `task format` e `task lint` para garantir que o código está limpo.
    -   Execute `task test` para garantir que todos os testes estão passando.
    -   Verifique a cobertura de testes com `task test --cov`.
    -   Se houver alterações nos `models.py`, crie uma nova migração com `alembic`.

---
## 6. EXEMPLOS DE CÓDIGO

### Modelo SQLAlchemy
```python
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, func, ForeignKey
from datetime import datetime
from typing import List

from fibrolog_api.database import Base

class Paciente(Base):
    __tablename__ = 'pacientes'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))

    registros: Mapped[List['RegistroDiario']] = relationship(
        'RegistroDiario', back_populates='paciente', cascade='all, delete-orphan'
    )

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
```

### Schema Pydantic
```python
from pydantic import BaseModel, EmailStr

class PacienteCreate(BaseModel):
    nome: str
    email: EmailStr
    password: str

class PacientePublic(BaseModel):
    id: int
    nome: str
    email: EmailStr

    class Config:
        from_attributes = True
```

### Endpoint FastAPI
```python
from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import get_session
from fibrolog_api.schemas import PacienteCreate, PacientePublic
from fibrolog_api.services import create_paciente_service

router = APIRouter(prefix='/pacientes', tags=['pacientes'])

@router.post('/', status_code=HTTPStatus.CREATED, response_model=PacientePublic)
async def create_paciente(
    paciente: PacienteCreate,
    db: Annotated[AsyncSession, Depends(get_session)],
):
    """Cria um novo paciente no sistema."""
    return await create_paciente_service(db, paciente)

```
