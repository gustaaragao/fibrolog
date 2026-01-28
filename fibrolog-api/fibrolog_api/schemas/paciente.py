import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator

MIN_PASSWORD_LENGTH = 8


class PacienteSchema(BaseModel):
    nome: str
    email: EmailStr
    password: str
    data_nascimento: Optional[datetime] = None
    sexo: Optional[str] = None
    data_diagnostico: Optional[datetime] = None
    medicacoes: Optional[str] = None

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < MIN_PASSWORD_LENGTH:
            raise ValueError(
                f'Password must be at least {MIN_PASSWORD_LENGTH} '
                'characters long'
            )
        if not re.search(r'[A-Z]', v):
            raise ValueError(
                'Password must contain at least one uppercase letter'
            )
        if not re.search(r'[a-z]', v):
            raise ValueError(
                'Password must contain at least one lowercase letter'
            )
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError(
                'Password must contain at least one special character'
            )
        return v


class PacientePublic(BaseModel):
    id: int
    nome: str
    email: EmailStr
    data_nascimento: Optional[datetime]
    sexo: Optional[str]
    data_diagnostico: Optional[datetime]
    medicacoes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PacienteList(BaseModel):
    pacientes: list[PacientePublic]
