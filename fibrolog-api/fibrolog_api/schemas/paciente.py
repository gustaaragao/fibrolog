from datetime import datetime

from pydantic import BaseModel


class PacienteSchema(BaseModel):
    nome: str


class PacientePublic(BaseModel):
    id: int
    nome: str
    created_at: datetime

    class Config:
        from_attributes = True
