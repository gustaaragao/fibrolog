from datetime import datetime

from pydantic import BaseModel, EmailStr


class Message(BaseModel):
    message: str


class FilterPage(BaseModel):
    offset: int = 0
    limit: int = 100


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


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
