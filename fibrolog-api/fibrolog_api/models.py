from datetime import datetime
from enum import Enum
from typing import List, Optional

from sqlalchemy import ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, registry, relationship

table_registry = registry()


class EstadoEmocional(str, Enum):
    FELIZ = 'FELIZ'
    ANSIOSO = 'ANSIOSO'
    IRRITADO = 'IRRITADO'
    TRISTE = 'TRISTE'


@table_registry.mapped_as_dataclass
class Paciente:
    __tablename__ = 'pacientes'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    nome: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(unique=True)
    senha: Mapped[str]
    data_nascimento: Mapped[datetime]
    sexo: Mapped[str] = mapped_column(String(50))
    data_diagnostico: Mapped[datetime]

    # Relacionamentos
    contatos: Mapped[List['ContatoApoio']] = relationship(
        back_populates='paciente', cascade='all, delete-orphan', init=False
    )
    alertas: Mapped[List['Alerta']] = relationship(
        back_populates='paciente', init=False
    )
    registros: Mapped[List['Registro']] = relationship(
        back_populates='paciente', cascade='all, delete-orphan', init=False
    )
    medicacoes: Mapped[List['Medicacao']] = relationship(
        back_populates='paciente', cascade='all, delete-orphan', init=False
    )

    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now(), onupdate=func.now()
    )


@table_registry.mapped_as_dataclass
class Medicacao:
    __tablename__ = 'medicacoes'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    nome: Mapped[str]
    dosagem: Mapped[str]
    frequencia: Mapped[str]
    paciente_id: Mapped[int] = mapped_column(ForeignKey('pacientes.id'))

    paciente: Mapped['Paciente'] = relationship(
        back_populates='medicacoes', init=False
    )
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now(), onupdate=func.now()
    )


@table_registry.mapped_as_dataclass
class ContatoApoio:
    __tablename__ = 'contatos_apoio'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    nome: Mapped[str]
    email: Mapped[str]
    telefone: Mapped[str]
    parentesco: Mapped[str]
    paciente_id: Mapped[int] = mapped_column(ForeignKey('pacientes.id'))

    paciente: Mapped['Paciente'] = relationship(
        back_populates='contatos', init=False
    )


@table_registry.mapped_as_dataclass
class Alerta:
    __tablename__ = 'alertas'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    tipo: Mapped[str]
    data_hora: Mapped[datetime]
    paciente_id: Mapped[int] = mapped_column(ForeignKey('pacientes.id'))
    descricao: Mapped[str] = mapped_column(Text)
    ativo: Mapped[bool] = mapped_column(default=True)

    paciente: Mapped['Paciente'] = relationship(
        back_populates='alertas', init=False
    )


@table_registry.mapped_as_dataclass
class Registro:
    """Classe base para RegistroDiario e RegistroCrise (Table-per-Class)"""

    __tablename__ = 'registros'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    tipo_registro: Mapped[str]
    paciente_id: Mapped[int] = mapped_column(ForeignKey('pacientes.id'))
    data_hora: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )

    paciente: Mapped['Paciente'] = relationship(
        back_populates='registros', init=False
    )

    __mapper_args__ = {
        'polymorphic_on': 'tipo_registro',
        'polymorphic_identity': 'registro',
    }


@table_registry.mapped_as_dataclass
class RegistroDiario(Registro):
    __tablename__ = 'registros_diarios'

    id: Mapped[int] = mapped_column(
        ForeignKey('registros.id'), primary_key=True, init=False
    )
    observacoes: Mapped[Optional[str]] = mapped_column(
        Text, default=None, init=True
    )

    # Relacionamentos
    sintomas: Mapped[List['RegistroSintoma']] = relationship(
        back_populates='registro', cascade='all, delete-orphan', init=False
    )
    regioes_dor: Mapped[List['RegistroRegiaoDor']] = relationship(
        back_populates='registro', cascade='all, delete-orphan', init=False
    )

    __mapper_args__ = {
        'polymorphic_identity': 'diario',
    }


@table_registry.mapped_as_dataclass
class RegistroSintoma:
    __tablename__ = 'registro_sintomas'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    registro_id: Mapped[int] = mapped_column(
        ForeignKey('registros_diarios.id')
    )
    sintoma_id: Mapped[str] = mapped_column(String(10))
    intensidade: Mapped[int]

    registro: Mapped['RegistroDiario'] = relationship(
        back_populates='sintomas', init=False
    )


@table_registry.mapped_as_dataclass
class RegistroRegiaoDor:
    __tablename__ = 'registro_regioes_dor'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    registro_id: Mapped[int] = mapped_column(
        ForeignKey('registros_diarios.id')
    )
    regiao_id: Mapped[str] = mapped_column(String(10))
    intensidade: Mapped[int]

    registro: Mapped['RegistroDiario'] = relationship(
        back_populates='regioes_dor', init=False
    )


@table_registry.mapped_as_dataclass
class RegistroCrise(Registro):
    __tablename__ = 'registros_crises'

    id: Mapped[int] = mapped_column(
        ForeignKey('registros.id'), primary_key=True, init=False
    )
    intensidade_dor: Mapped[int]
    contexto: Mapped[str] = mapped_column(Text)
    duracao: Mapped[Optional[str]] = mapped_column(String, default=None)
    sintomas_relatados: Mapped[Optional[str]] = mapped_column(
        Text, default=None
    )
    observacoes: Mapped[Optional[str]] = mapped_column(Text, default=None)

    __mapper_args__ = {
        'polymorphic_identity': 'crise',
    }
