# Prompt para Desenvolvimento do Backend: Sincronização de Lembretes (FastAPI)

## Contexto
Estamos expandindo o **FibroLog** para suportar a sincronização de lembretes entre dispositivos. O sistema deve permitir que o paciente gerencie seus lembretes (Geral, Medicamento, Exame) localmente e os mantenha sincronizados com o servidor FastAPI.

## Objetivo
Implementar os modelos SQLAlchemy, schemas Pydantic e endpoints REST para o gerenciamento de lembretes.

## Modelos de Dados (FastAPI/SQLAlchemy)

### 1. Tabela `lembretes`
- `id`: UUID (Primary Key) - *Nota: O frontend gera UUIDs/Timestamps como strings.*
- `paciente_id`: ForeignKey para o usuário/paciente
- `titulo`: String
- `tipo`: Enum ("geral", "medicamento", "exame")
- `hora`: Integer (0-23)
- `minuto`: Integer (0-59)
- `ativo`: Boolean (default True)
- `dosagem`: String (Opcional, usado para medicamentos)
- `intervalo`: Integer (Opcional, em horas, usado para medicamentos)
- `data_exame`: DateTime (Opcional, usado para exames)
- `created_at`: DateTime
- `updated_at`: DateTime

## Schemas Pydantic

```python
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class ReminderBase(BaseModel):
    titulo: str
    tipo: Literal["geral", "medicamento", "exame"]
    hora: int = Field(ge=0, le=23)
    minuto: int = Field(ge=0, le=59)
    ativo: bool = True
    dosagem: Optional[str] = None
    intervalo: Optional[int] = None
    data_exame: Optional[datetime] = None

class ReminderCreate(ReminderBase):
    id: Optional[str] = None # Permitir que o frontend envie seu ID local

class ReminderUpdate(BaseModel):
    titulo: Optional[str] = None
    tipo: Optional[Literal["geral", "medicamento", "exame"]] = None
    hora: Optional[int] = None
    minuto: Optional[int] = None
    ativo: Optional[bool] = None
    dosagem: Optional[str] = None
    intervalo: Optional[int] = None
    data_exame: Optional[datetime] = None

class ReminderResponse(ReminderBase):
    id: str
    paciente_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
```

## Endpoints Necessários (Prefixo: `/pacientes/lembretes`)

Todos os endpoints devem exigir autenticação via JWT.

### 1. `GET /`
Retorna a lista de todos os lembretes do paciente autenticado.

### 2. `POST /`
Cria um novo lembrete. O `paciente_id` deve ser extraído do token.

### 3. `PATCH /{id}`
Atualiza campos específicos de um lembrete (útil para o "toggle" de ativo/inativo).

### 4. `DELETE /{id}`
Remove permanentemente um lembrete.

## Regras de Negócio
- Um paciente **só pode** acessar, editar ou deletar seus próprios lembretes.
- Os campos `dosagem` e `intervalo` devem ser validados se o `tipo` for "medicamento".
- O campo `data_exame` deve ser validado se o `tipo` for "exame".

## Instruções Adicionais
Siga as convenções de resposta JSON e tratamento de erros (404 para ID inexistente, 401/403 para falhas de permissão) já estabelecidas no projeto.
