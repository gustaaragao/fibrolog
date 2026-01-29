"""
Schemas para validação de dados de crises.
"""
from datetime import datetime

from pydantic import BaseModel, Field


class CriseCreate(BaseModel):
    """Schema para criação de uma crise."""

    intensidade_dor: int = Field(..., ge=0, le=10)
    contexto: str


class CrisePublic(CriseCreate):
    """Schema para retorno público de uma crise."""

    id: int
    paciente_id: int
    data_hora: datetime

    class Config:
        from_attributes = True


class CriseList(BaseModel):
    """Schema para listagem de crises."""

    crises: list[CrisePublic]
