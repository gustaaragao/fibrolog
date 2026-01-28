"""
Módulo que inicializa o pacote de schemas, expondo os principais schemas
para facilitar a importação em outros módulos.
"""

from .base import FilterPage, Message
from .paciente import (
    PacienteList,
    PacientePublic,
    PacienteSchema,
    PacienteUpdate,
)
from .registro_diario import (
    RegistroDiarioList,
    RegistroDiarioPublic,
    RegistroDiarioSchema,
    RegistroDiarioUpdate,
)
from .token import Token, TokenData

__all__ = [
    'FilterPage',
    'Message',
    'PacienteList',
    'PacientePublic',
    'PacienteSchema',
    'PacienteUpdate',
    'RegistroDiarioList',
    'RegistroDiarioPublic',
    'RegistroDiarioSchema',
    'RegistroDiarioUpdate',
    'Token',
    'TokenData',
]
