from datetime import datetime

from pydantic import BaseModel


class MedicacaoSchema(BaseModel):
    nome: str
    dosagem: str
    frequencia: str


class MedicacaoPublic(MedicacaoSchema):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MedicacaoList(BaseModel):
    medicacoes: list[MedicacaoPublic]
