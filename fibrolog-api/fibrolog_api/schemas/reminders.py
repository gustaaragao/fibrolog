from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator


class ReminderBase(BaseModel):
    titulo: str
    tipo: Literal['geral', 'medicamento', 'exame']
    hora: int = Field(ge=0, le=23)
    minuto: int = Field(ge=0, le=59)
    ativo: bool = True
    dosagem: Optional[str] = None
    intervalo: Optional[int] = None
    data_exame: Optional[datetime] = None


class ReminderCreate(ReminderBase):
    id: Optional[str] = None

    @model_validator(mode='after')
    def validate_type_fields(self) -> 'ReminderCreate':
        if self.tipo == 'medicamento':
            if not self.dosagem or self.intervalo is None:
                raise ValueError('Medicamentos exigem dosagem e intervalo.')
        elif self.tipo == 'exame':
            if not self.data_exame:
                raise ValueError('Exames exigem uma data.')
        return self


class ReminderUpdate(BaseModel):
    titulo: Optional[str] = None
    tipo: Optional[Literal['geral', 'medicamento', 'exame']] = None
    hora: Optional[int] = Field(None, ge=0, le=23)
    minuto: Optional[int] = Field(None, ge=0, le=59)
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
        from_attributes = True
