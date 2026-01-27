# 🧠 CONTEXTO MESTRE: FibroLog (P2527)

Diretrizes, tecnologias e convenções do sistema FibroLog.

---

## 📋 1. VISÃO GERAL

**Produto:** Sistema Digital para Monitoramento da Fibromialgia  
**Objetivo:** App mobile para registro de sintomas (dor, fadiga, sono, humor) e crises  
**Diferencial:** Mapa corporal, áudio com transcrição IA, rede de apoio, relatórios PDF

**Componentes:**
- Backend (API): REST API Python/FastAPI
- Frontend: App mobile
- IA: Google Gemini/OpenAI para transcrição

---

## 🛠️ 2. STACK TECNOLÓGICA ATUAL (API)

### 2.1 Core Framework
- **Python:** 3.12+
- **Framework Web:** FastAPI 0.128.0+ (com suporte async/await)
- **ASGI Server:** Uvicorn (incluso no FastAPI[standard])

## 🛠️ 2. STACK TECNOLÓGICA

**Core:** Python 3.12+, FastAPI 0.128.0+, Uvicorn  
**Database:** SQLite (aiosqlite), SQLAlchemy 2.0.46+ (async), Alembic 1.18.1+  
**Validação:** Pydantic 2.12.5+, Pydantic Settings 2.12.0+  
**Segurança:** JWT (PyJWT 2.10.1+), Argon2 (pwdlib[argon2] 0.3.0+), OAuth2  
**Dev/Qualidade:** Poetry, Ruff 0.14.14+, pytest 9.0.2+, pytest-asyncio, pytest-cov, taskipy  
**Outros:** httpx, ZoneInfo
fibrolog-api/
├── fibrolog_api/              # Código fonte principal
│   ├── __init__.py
│   ├── app.py                 # Aplicação FastAPI (entry point)
│   ├── database.py            # Configuração AsyncEngine + SessionMaker
│   ├── models.py              # Modelos SQLAlchemy (ORM)
│   ├── schemas.py             # Schemas Pydantic (validação)
│   ├── security.py            # JWT, password hashing, auth
│   ├── settings.py            # Configurações (Pydantic Settings)
│   ├── routers/               # Rotas da API (organizadas por domínio)
│   │   ├── auth.py            # Autenticação (login, token)
│   │   ├── pacientes.py       # CRUD de pacientes
│   │   └── registros_diarios.py  # (futuro) CRUD de registros
│   └── schemas/               # Schemas organizados por domínio
│       ├── paciente.py
│       └── token.py
├── migrations/                # Migrações Alembic
│   ├── env.py
│   └── versions/              # Arquivos de migração
├── tests/                     # Testes automatizados
│   ├── conftest.py            # Fixtures pytest
│   ├── test_auth.py
│   └── test_pacientes.py
├── htmlcov/                   # Relatórios de cobertura de testes
├── alembic.ini                # Configuração Alembic
├── pyproject.toml             # Dependências e configurações
└── README.md                  # Documentação do projeto
```

### 3.2 Camadas da Arquitetura
1. **Presentation Layer (Routers):** Endpoints FastAPI, validação de entrada
2. **Application Layer (Schemas):** DTOs e validações Pydantic
3. **Domain Layer (Models):** Lógica de negócio e entidades
4. **Infrastructure Layer (Database/Security):** Persistência e serviços

### 3.3 Padrões de Design Utilizados
- **Dependency Injection:** Uso de `Depends()` do FastAPI
- **Repository Pattern:** Session as unit of work
- **DTO Pattern:** Separação clara entre modelos ORM e schemas Pydantic
- **Factory Pattern:** Fixtures no conftest.py para testes

---

## 📐 4. CONVENÇÕES DE CÓDIGO

### 4.1 Idioma e Tradução
- **Idioma de Código:** Português (pt)
- **Mensagens e Strings:** Sempre em português
- **Comentários e Docstrings:** Sempre em português
- **Documentação:** Seguir convenções do arquivo `llm-prompt.md`
- **Termos Técnicos Preservados:** Alguns termos em inglês devem ser mantidos conforme glossário:
  - `async context manager` → "gerenciador de contexto assíncrono"
### 4.3 Nomenclatura
### 3.2 Camadas
1. **Presentation (Routers):** Endpoints FastAPI
2. **Application (Schemas):** DTOs Pydantic
3. **Domain (Models):** Entidades e lógica
4. **Infrastructure (Database/Security):** Persistência

### 3.3 Padrões
Dependency Injection, Repository Pattern, DTO Pattern, Factory Pattern (fixtures)
- **Line Length:** 79 caracteres (PEP-8)
- **Quotes:** Single quotes (`'`) para strings
- **Indentação:** 4 espaços (sem tabs)
- **Import Organization:** Automática via Ruff (I rule)
- **Linting Rules:** `['I', 'F', 'E', 'W', 'PL', 'PT', 'FAST']`

### 4.2 Nomenclatura
- **Variáveis e Funções:** `snake_case` (ex: `get_current_paciente`)
- **Classes:** `PascalCase` (ex: `Paciente`, `RegistroDiario`)
- **Constantes:** `UPPER_SNAKE_CASE` (ex: `DATABASE_URL`)
- **Routers:** Prefixo descritivo (ex: `/pacientes`, `/auth`)
### 4.4 Anotações de Tipo (Type Hints)
- **Obrigatório:** Todas as funções devem ter anotações de tipo completas
- **SQLAlchemy:** Usar `Mapped[type]` para colunas
- **FastAPI:** Usar `Annotated[Type, Depends()]` para injeção de dependências
- **Retorno:** Sempre especificar tipo de retorno (incluindo `None` quando aplicável)
```python
# Exemplo de anotações de tipo
async def criar_paciente(
    paciente: PacienteSchema,
    session: Annotated[AsyncSession, Depends(get_session)]
) -> PacientePublico:
    """
    Cria um novo paciente no sistema.
    
    Args:
### 4.5 Async/Await
- **Regra:** Todas as operações de I/O devem ser async
- **Database:** Sempre usar `AsyncSession` e `await`
- **HTTP Requests:** Usar `httpx.AsyncClient` em vez de `requests`
- **Gerenciadores de Contexto:** Usar gerenciadores de contexto assíncronos quando aplicável

### 4.6 Status Codes HTTP
- **Importação:** Sempre usar `from http import HTTPStatus`
- **Constantes:** Usar `HTTPStatus.CREATED`, `HTTPStatus.NOT_FOUND`, etc.
- **Evitar:** Magic numbers (200, 404, etc.)

### 4.7 Tratamento de Erros
```python
# Padrão de erro com mensagens em português
raise HTTPException(
    status_code=HTTPStatus.NOT_FOUND,
    detail='Paciente não encontrado'
)

### 4.8 SQLAlchemy Models (Padrão Moderno)
```python
@table_registry.mapped_as_dataclass
class Paciente:
    """
    Modelo que representa um paciente no sistema.
    
    Attributes:
        id: Identificador único do paciente
        nome: Nome completo do paciente
        email: Email único para autenticação
        password: Senha hasheada com Argon2
        data_nascimento: Data de nascimento (opcional)
        registros: Lista de registros do paciente
        created_at: Data/hora de criação do registro
        updated_at: Data/hora da última atualização
    """
    __tablename__ = 'pacientes'
    
    # Primary Key
    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    
    # Campos obrigatórios (sem default)
    nome: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    
    # Campos opcionais (com default)
    data_nascimento: Mapped[Optional[datetime]] = mapped_column(
        default=None
    )
    
    # Relacionamentos
    registros: Mapped[List["Registro"]] = relationship(
        back_populates="paciente",
        init=False
    )
    
    # Timestamps automáticos
    created_at: Mapped[datetime] = mapped_column(
        init=False,
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        init=False,
        server_default=func.now(),
        onupdate=func.now()
    )
```

### 4.9 Pydantic Schemas
```python
class PacienteSchema(BaseModel):
    """Schema para criação de paciente."""
    nome: str
    email: EmailStr
    password: str


class PacientePublico(BaseModel):
    """Schema para retorno público de dados do paciente."""
    id: int
    nome: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # Para compatibilidade com SQLAlchemy


class Mensagem(BaseModel):
    """Schema para mensagens de resposta."""
    mensagem: str
```

### 4.10 Docstrings e Comentários
- **Formato:** Google Style Python Docstrings
- **Idioma:** Sempre em português
- **Obrigatório para:**
  - Todas as classes (models, schemas, routers)
  - Todas as funções públicas
  - Funções complexas (mesmo privadas)
- **Opcional para:** Funções simples e auto-explicativas
```python
async def obter_paciente_por_id(
    paciente_id: int,
    session: AsyncSession
) -> Paciente | None:
    """
    Busca um paciente pelo ID.
    
    Args:
        paciente_id: ID do paciente a ser buscado
        session: Sessão assíncrona do banco de dados
        
    Returns:
        Instância do paciente se encontrado, None caso contrário
        
    Raises:
        SQLAlchemyError: Em caso de erro na consulta ao banco
    """
    result = await session.execute(
        select(Paciente).where(Paciente.id == paciente_id)
    )
    return result.scalar_one_or_none()
```

---
## 🔒 5. REGRAS DE NEGÓCIO

**Autenticação:**
- RN001: Senha min. 8 caracteres (maiúsculas, minúsculas, números, símbolos)
- RN002: JWT expira em 30 min
- RN003: Hash Argon2

**Sintomas:**
- RN004: Registro diário obrigatório (dor 0-10 NRS + estado emocional)
- RN005: NRS 0=sem dor, 10=dor máxima
- RN006: 1 registro/dia (sobrescreve)
- RN007: Registro crise a qualquer momento

**Crises:**
- RN008: Áudio max. 60s
- RN009: Transcrição automática (IA)
- RN010: Transcrição armazenada com registro

**Privacidade:**
- RN011: Criptografia dados sensíveis (LGPD)
- RN012: Isolamento de dados por paciente
- RN013: Rede apoio só notificações
- RN014: Relatórios compartilháveis (PDF)

**Ética:**
- RN015: Sistema NÃO diagnostica
- RN016: Apenas monitoramento

---

## 🎯 6. REQUISITOS FUNCIONAIS

**✅ Implementados:**
- RF001-003: Autenticação (login, JWT, validação)
- RF004-009: CRUD Pacientes (criar, listar, buscar, atualizar, deletar, email único)

**🚧 Pendentes:**
- RF010: CRUD Contatos Apoio
- RF011: CRUD Alertas
- RF012: CRUD Registros Diários
- RF013: CRUD Registros Crises
- RF014: Upload/transcrição áudio
- RF015: Relatórios PDF
- RF016: Notificações
- RF017: Histórico/gráficos

---

---
1. ✅ **Consultar `llm-prompt.md`:** Verificar convenções de tradução e termos técnicos
2. ✅ **Verificar Requisitos Funcionais:** Confirmar que a funcionalidade está especificada
3. ✅ **Validar Regras de Negócio:** Identificar RNs aplicáveis
4. ✅ **Verificar Convenções de Código:** Revisar seção 4 deste documento
5. ✅ **Planejar Testes:** Definir casos de teste antes da implementação

### 12.2 Durante o Desenvolvimento
1. ✅ **Idioma Português:** Código, comentários e strings em português (seguir `llm-prompt.md`)
2. ✅ **Anotações de Tipo:** Usar type hints completos em TODAS as funções
3. ✅ **Docstrings:** Documentar classes e funções públicas (Google Style)
4. ✅ **Async/Await:** Seguir padrão assíncrono para operações de I/O
5. ✅ **Mensagens de Erro:** Sempre em português e descritivas
6. ✅ **Testes Paralelos:** Escrever testes junto com a implementação

### 12.3 Antes de Commitar
1. ✅ **Lint:** Rodar `task lint` (zero erros)
2. ✅ **Format:** Rodar `task format` (auto-formatar)
3. ✅ **Tests:** Rodar `task test` (100% passando)
4. ✅ **Coverage:** Verificar cobertura de testes (mínimo 80%)
5. ✅ **Migrations:** Se alterou models, criar migração Alembic

### 12.4 Checklist de Criação de Arquivos Python
Ao criar novos arquivos Python, sempre:
- [ ] Consultar `llm-prompt.md` para traduções corretas
- [ ] Usar imports organizados (Ruff I rule)
- [ ] Incluir docstring no módulo (topo do arquivo)
- [ ] Seguir estrutura de nomenclatura em português
- [ ] Adicionar anotações de tipo em todas as funções
- [ ] Criar testes correspondentes em `tests/`
- [ ] Verificar se precisa de migration (models)

## 📊 9. MODELOS DE DADOS (ORM)

### 9.1 Entidades Implementadas
- **Paciente:** Usuário principal do sistema
- **ContatoApoio:** Rede de apoio do paciente
- **Alerta:** Lembretes de medicação/consultas
- **Registro:** Classe base para registros (herança)
- **RegistroDiario:** Sintomas diários (dor, sono, fadiga, humor)
- **RegistroCrise:** Episódios de crise com áudio

### 9.2 Relacionamentos
- `Paciente` 1:N `ContatoApoio`
- `Paciente` 1:N `Alerta`
- `Paciente` 1:N `Registro`
- `Registro` herança `RegistroDiario`
- `Registro` herança `RegistroCrise`

### 9.3 Enums
```python
class EstadoEmocional(str, Enum):
---

## 📄 15. REFERÊNCIAS

**GEMINI.md:** Contexto master (consultar antes de implementar)  
**llm-prompt.md:** Traduções e glossário (consultar ao criar arquivos Python)  
**README.md:** Setup e comandos  
**pyproject.toml:** Dependências e config

---

**⚠️ IMPORTANTE:** Consultar GEMINI.md + llm-prompt.md ao criar código Python
    TRISTE = "triste"
```
## 📄 15. REFERÊNCIAS

**GEMINI.md:** Contexto master (consultar antes de implementar)  
**llm-prompt.md:** Traduções e glossário (consultar ao criar arquivos Python)  
**README.md:** Setup e comandos  
**pyproject.toml:** Dependências e config

---

**⚠️ IMPORTANTE:** Consultar GEMINI.md + llm-prompt.md ao criar código Python
---

## 🎨 12. DIRETRIZES DE DESENVOLVIMENTO

### 12.1 Antes de Codificar
1. ✅ Verificar se a funcionalidade está nos Requisitos Funcionais
2. ✅ Validar Regras de Negócio aplicáveis
3. ✅ Verificar convenções de código (Ruff)
## 🔐 10. SEGURANÇA

**Variáveis .env:**
```bash
DATABASE_URL=sqlite+aiosqlite:///./fibrolog.db
SECRET_KEY=xxx  # openssl rand -hex 32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Boas Práticas:** Não commitar .env, SECRET_KEY forte (32+ bytes), rotacionar chaves

## 📞 13. INFORMAÇÕES DO PROJETO

- **Responsável:** Gustavo Aragão (gustavohenriquearagaosilva@gmail.com)
- **Repositório:** gustaaragao/fibrolog
- **Branch Atual:** feat/crud-sintomas-diarios
- **Python Version:** 3.12+
## 📚 11. REQUISITOS NÃO-FUNCIONAIS

**Performance:** Registros <2s, relatórios <5s, 100+ usuários  
**Usabilidade:** Interface p/ fibrofog, formulários simples, feedback imediato  
**Disponibilidade:** 99%, backup automático
- [ ] Upload de áudio
- [ ] Integração com IA (transcrição)
- [ ] Geração de relatórios PDF
- [ ] Sistema de notificações

### Fase 3 - Otimização e Deploy
- [ ] Testes de carga
- [ ] Otimização de queries
- [ ] Deploy em produção
- [ ] Monitoramento e logs

---

**⚠️ IMPORTANTE:** Este documento deve ser consultado antes de implementar qualquer nova funcionalidade. Mantenha-o atualizado conforme o projeto evolui.## 📞 13. INFORMAÇÕES

**Responsável:** Gustavo Aragão (gustavohenriquearagaosilva@gmail.com)  
**Repo:** gustaaragao/fibrolog  
**Branch:** feat/crud-sintomas-diarios  
**Python:** 3.12+  
**Status:** 🚧 Em desenvolvimento## 🔄 14. ROADMAP

**Fase 1 (Atual):** [x] Auth JWT, CRUD Pacientes | [ ] CRUD Contatos, Alertas, Registros  
**Fase 2:** Upload áudio, IA transcrição, PDF, notificações  
**Fase 3:** Testes carga, otimização, deploy, monitoramento