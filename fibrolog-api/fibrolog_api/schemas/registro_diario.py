"""
Schemas para validação de dados de registros diários.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class SymptomEntry(BaseModel):
    """Schema para entrada de um sintoma individual (Frontend compatibility)."""
    # Padrão valida IDs de 1 a 8
    id: str = Field(..., pattern='^[1-8]$')
    intensity: int = Field(..., ge=0, le=10)


class PainRegionEntry(BaseModel):
    """Schema para entrada de uma região de dor individual (Frontend compatibility)."""
    # Padrão valida IDs de 1 a 50: [1-9] (1-9), [1-4][0-9] (10-49), 50
    id: str = Field(..., pattern='^([1-9]|[1-4][0-9]|50)$')
    intensity: int = Field(..., ge=0, le=10)


class DailyLogCreate(BaseModel):
    """Schema para criação de um registro diário completo (Frontend compatibility)."""
    symptoms: List[SymptomEntry]
    painRegions: List[PainRegionEntry]
    notes: Optional[str] = None
    timestamp: datetime


class EntradaSintoma(BaseModel):
    """Schema para entrada de um sintoma individual."""
    id: str = Field(..., pattern='^[1-8]$')
    intensidade: int = Field(..., ge=0, le=10)


class EntradaRegiaoDor(BaseModel):
    """Schema para entrada de uma região de dor individual."""
    id: str = Field(..., pattern='^([1-9]|[1-4][0-9]|50)$')
    intensidade: int = Field(..., ge=0, le=10)


class RegistroDiarioCreate(BaseModel):
    """Schema para criação de um registro diário completo."""
    sintomas: List[EntradaSintoma]
    regioes_dor: List[EntradaRegiaoDor]
    observacoes: Optional[str] = None
    data_hora: datetime


class RegistroDiarioPublic(BaseModel):
    """Schema para retorno público de um registro diário."""
    id: int
    paciente_id: int
    data_registro: datetime
    message: str = 'Registro recuperado com sucesso'
    symptoms: List[SymptomEntry] = Field(default_factory=list)
    painRegions: List[PainRegionEntry] = Field(default_factory=list)
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class RegistroDiarioList(BaseModel):
    """Schema para listagem de registros diários."""
    registros: List[RegistroDiarioPublic]


class DailyLogResponse(BaseModel):
    """Schema para resposta de criação de um registro diário (Frontend compatibility)."""
    id: int
    message: str = 'Registro criado com sucesso'
