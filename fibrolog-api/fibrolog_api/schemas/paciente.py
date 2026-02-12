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
        raise ValueError('A senha deve conter pelo menos uma letra maiúscula')
    if not re.search(r'[a-z]', password):
        raise ValueError('A senha deve conter pelo menos uma letra minúscula')
    if not re.search(r'\d', password):
        raise ValueError('A senha deve conter pelo menos um número')
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValueError(
            'A senha deve conter pelo menos um caractere especial'
        )
    return password


def validate_phone_number(v: str | None) -> str | None:
    if v is None:
        return None
    # Permite (XX) 9XXXX-XXXX ou apenas números (11 dígitos para celular com 9, ou 10 para fixo/antigo)
    pattern = r'^((\(?\d{2}\)?\s?9?\d{4}-?\d{4})|(\d{10,11}))$'
    if not re.match(pattern, v):
        raise ValueError(
            'Número de celular inválido. Formatos aceitos: (XX) 9XXXX-XXXX ou apenas números.'
        )
    return v


class PacienteSchema(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    celular: Optional[str] = None
    data_nascimento: datetime
    sexo: str
    data_diagnostico: datetime

    @field_validator('senha')
    @classmethod
    def validate_senha(cls, v: str) -> str:
        return validate_password_strength(v)

    @field_validator('celular')
    @classmethod
    def validate_celular(cls, v: str | None) -> str | None:
        return validate_phone_number(v)


class PacienteUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    senha: Optional[str] = None
    celular: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    sexo: Optional[str] = None
    data_diagnostico: Optional[datetime] = None

    @field_validator('senha')
    @classmethod
    def validate_senha(cls, v: str | None) -> str | None:
        if v is None:
            return None
        return validate_password_strength(v)

    @field_validator('celular')
    @classmethod
    def validate_celular(cls, v: str | None) -> str | None:
        return validate_phone_number(v)


class PacientePublic(BaseModel):
    id: int
    nome: str
    email: EmailStr
    celular: Optional[str] = None
    data_nascimento: Optional[datetime]
    sexo: Optional[str]
    data_diagnostico: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PacienteList(BaseModel):
    pacientes: list[PacientePublic]
