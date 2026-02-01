import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator

MIN_PASSWORD_LENGTH = 8


def validate_password_strength(password: str) -> str:
    """
    Valida a força de uma senha de acordo com as regras de segurança.

    Args:
        password: A senha a ser validada

    Returns:
        A senha validada

    Raises:
        ValueError: Se a senha não atender aos requisitos de segurança
    """
    if len(password) < MIN_PASSWORD_LENGTH:
        raise ValueError(
            f'A senha deve ter pelo menos {MIN_PASSWORD_LENGTH} caracteres'
        )
    if not re.search(r'[A-Z]', password):
        raise ValueError(
            'A senha deve conter pelo menos uma letra maiúscula'
        )
    if not re.search(r'[a-z]', password):
        raise ValueError(
            'A senha deve conter pelo menos uma letra minúscula'
        )
    if not re.search(r'\d', password):
        raise ValueError('A senha deve conter pelo menos um número')
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValueError(
            'A senha deve conter pelo menos um caractere especial'
        )
    return password


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
        return validate_password_strength(v)


class PacienteUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    sexo: Optional[str] = None
    data_diagnostico: Optional[datetime] = None
    medicacoes: Optional[str] = None

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str | None) -> str | None:
        if v is None:
            return None
        return validate_password_strength(v)


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
