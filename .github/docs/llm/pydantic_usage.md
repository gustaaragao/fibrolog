# 🛡️ DIRETRIZES DE USO: PYDANTIC (FibroLog)

Este documento define os padrões para validação de dados e gestão de configurações no backend do FibroLog.

---

## 1. OBJETIVO

Garantir robustez, tipagem estrita e segurança nos dados que transitam pela API e nas configurações do ambiente.

---

## 2. SCHEMAS (Data Transfer Objects)

-   **Localização**: Os schemas devem ser organizados como um pacote em `fibrolog_api/schemas/`, separados por domínio (ex: `paciente.py`, `crise.py`, `auth.py`).
-   **Herança**: Todos devem herdar de `pydantic.BaseModel` ou `ConfigBase` (se houver uma classe base customizada).

### 2.1 Padrão de Nomenclatura e Estrutura

Para cada entidade, geralmente teremos 3 variações de schema:

1.  **Input de Criação (`XCreate`)**:
    -   Campos obrigatórios para criar o registro.
    -   Validações fortes (regex de senha, email).
    ```python
    class PacienteCreate(BaseModel):
        nome: str
        email: EmailStr
        password: str  # Plain text, será hasheado no service
    ```

2.  **Input de Atualização (`XUpdate`)**:
    -   Campos opcionais (`Optional[T] = None`).
    -   Permite atualização parcial (PATCH).
    ```python
    class PacienteUpdate(BaseModel):
        nome: str | None = None
        email: EmailStr | None = None
    ```

3.  **Output Público (`XPublic` ou `XResponse`)**:
    -   O que é retornado para o frontend.
    -   **PROIBIDO**: Retornar senhas, hashes ou metadados internos.
    -   `from_attributes = True` para compatibilidade com SQLAlchemy.
    ```python
    class PacientePublic(BaseModel):
        id: int
        nome: str
        email: EmailStr
        created_at: datetime

        model_config = ConfigDict(from_attributes=True)
    ```

### 2.2 Validação Avançada

-   Use `Field(...)` para validações simples (`min_length`, `gt`, `le`).
-   Use `@field_validator` para regras de negócio complexas.

```python
from pydantic import BaseModel, Field, field_validator

class RegistroDor(BaseModel):
    nivel: int = Field(..., ge=0, le=10, description="NRS 0-10")

    @field_validator('nivel')
    @classmethod
    def validar_nivel_dor(cls, v: int) -> int:
        if v > 10:
            raise ValueError('Dor não pode ser maior que 10')
        return v
```

---

## 3. SETTINGS (Variáveis de Ambiente)

-   **Localização**: `fibrolog_api/settings.py`.
-   **Ferramenta**: `pydantic-settings`.

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )

settings = Settings()
```

---

## 4. CHECKLIST DE QUALIDADE

- [ ] Schemas de Input nunca usam `orm_mode` (agora `from_attributes`).
- [ ] Schemas de Output não expõem campos sensíveis.
- [ ] Módulos em `schemas/` estão focados em um único domínio.
- [ ] Testes validam se o Pydantic está rejeitando dados inválidos corretamente.