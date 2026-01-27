from datetime import datetime

from pydantic import BaseModel, EmailStr


class PacienteSchema(BaseModel):
    nome: str
    email: EmailStr
    password: str


class PacientePublic(BaseModel):
    id: int
    nome: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PacienteList(BaseModel):
    pacientes: list[PacientePublic]
