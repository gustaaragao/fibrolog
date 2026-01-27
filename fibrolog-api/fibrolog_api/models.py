from datetime import datetime
from enum import Enum
from typing import List, Optional

from sqlalchemy import ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, registry, relationship

table_registry = registry()


class EstadoEmocional(str, Enum):
    FELIZ = "feliz"
    ANSIOSO = "ansioso"
    IRRITADO = "irritado"
    TRISTE = "triste"


@table_registry.mapped_as_dataclass
class Paciente:
    __tablename__ = 'pacientes'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    nome: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    data_nascimento: Mapped[Optional[datetime]] = mapped_column(default=None)

    # Relacionamentos
    contatos: Mapped[List["ContatoApoio"]] = relationship(
        back_populates="paciente",
        cascade="all, delete-orphan",
        init=False
    )
    alertas: Mapped[List["Alerta"]] = relationship(
        back_populates="paciente",
        init=False
    )
    registros: Mapped[List["Registro"]] = relationship(
        back_populates="paciente",
        init=False
    )

    created_at: Mapped[datetime] = mapped_column(
        init=False,
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        init=False,
        server_default=func.now(),
        onupdate=func.now()
    )


@table_registry.mapped_as_dataclass
class ContatoApoio:
    __tablename__ = 'contatos_apoio'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    nome: Mapped[str]
    email: Mapped[str]
    telefone: Mapped[str]
    parentesco: Mapped[str]  # [cite: 880]
    paciente_id: Mapped[int] = mapped_column(
        ForeignKey('pacientes.id')
    )

    paciente: Mapped["Paciente"] = relationship(
        back_populates="contatos",
        init=False
    )


@table_registry.mapped_as_dataclass
class Alerta:
    __tablename__ = 'alertas'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    tipo: Mapped[str]  # "medicação" ou "consulta" [cite: 1310]
    data_hora: Mapped[datetime]
    paciente_id: Mapped[int] = mapped_column(
        ForeignKey('pacientes.id')
    )
    descricao: Mapped[str] = mapped_column(Text)
    ativo: Mapped[bool] = mapped_column(default=True)

    paciente: Mapped["Paciente"] = relationship(
        back_populates="alertas",
        init=False
    )


@table_registry.mapped_as_dataclass
class Registro:
    """Classe base para RegistroDiario e RegistroCrise (Table-per-Class)"""
    __tablename__ = 'registros'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    tipo_registro: Mapped[str]
    paciente_id: Mapped[int] = mapped_column(
        ForeignKey('pacientes.id')
    )
    data_hora: Mapped[datetime] = mapped_column(
        server_default=func.now()
    )

    paciente: Mapped["Paciente"] = relationship(
        back_populates="registros",
        init=False
    )


@table_registry.mapped_as_dataclass
class RegistroDiario(Registro):
    __tablename__ = 'registros_diarios'

    id: Mapped[int] = mapped_column(
        ForeignKey('registros.id'),
        primary_key=True,
        init=False
    )
    # Escala NRS 0-10
    intensidade_dor: Mapped[int]
    qualidade_sono: Mapped[int]
    nivel_fadiga: Mapped[int]
    estado_emocional: Mapped[EstadoEmocional]
    localizacao_dor: Mapped[Optional[str]] = mapped_column(default=None)


@table_registry.mapped_as_dataclass
class RegistroCrise(Registro):
    __tablename__ = 'registros_crises'

    id: Mapped[int] = mapped_column(
        ForeignKey('registros.id'),
        primary_key=True,
        init=False
    )
    intensidade_dor: Mapped[int]
    duracao: Mapped[str]  # Ex: "2h" [cite: 1520]
    audio_path: Mapped[Optional[str]] = mapped_column(
        default=None
    )  # [cite: 409]
    texto_transcrito: Mapped[Optional[str]] = mapped_column(
        Text,
        default=None
    )  # [cite: 411]
