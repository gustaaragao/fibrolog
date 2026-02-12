from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

from fibrolog_api.schemas.paciente import validate_phone_number


class ContatoApoioSchema(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    parentesco: str

    @field_validator('telefone')
    @classmethod
    def validate_telefone(cls, v: str) -> str:
        res = validate_phone_number(v)
        if res is None:
            raise ValueError('O telefone é obrigatório')
        return res


class ContatoApoioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    parentesco: Optional[str] = None

    @field_validator('telefone')
    @classmethod
    def validate_telefone(cls, v: Optional[str]) -> Optional[str]:
        return validate_phone_number(v)


class ContatoApoioPublic(BaseModel):
    id: int
    nome: str
    email: EmailStr
    telefone: str
    parentesco: str

    model_config = ConfigDict(from_attributes=True)


class ContatoApoioList(BaseModel):
    contatos: list[ContatoApoioPublic]
