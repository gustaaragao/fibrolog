"""
Schemas para validação de dados de registros diários.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from fibrolog_api.models import EstadoEmocional


class RegistroDiarioSchema(BaseModel):
    """Schema para criação e atualização de um registro diário."""

    intensidade_dor: int = Field(..., ge=0, le=10)
    qualidade_sono: int = Field(..., ge=0, le=10)
    nivel_fadiga: int = Field(..., ge=0, le=10)
    estado_emocional: EstadoEmocional
    localizacao_dor: Optional[str] = None


class RegistroDiarioPublic(RegistroDiarioSchema):
    """Schema para retorno público de um registro diário."""

    id: int
    paciente_id: int
    data_hora: datetime

    class Config:
        from_attributes = True


class RegistroDiarioList(BaseModel):
    """Schema para listagem de registros diários."""

    registros: list[RegistroDiarioPublic]
