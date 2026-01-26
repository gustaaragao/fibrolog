from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from fibrolog_api.database import get_session
from fibrolog_api.models import Paciente
from fibrolog_api.schemas import PacientePublic, PacienteSchema

router = APIRouter(prefix='/pacientes', tags=['Pacientes'])

SessionDep = Annotated[Session, Depends(get_session)]


@router.get('/', response_model=list[PacientePublic])
def get_pacientes(session: SessionDep):
    pacientes = session.query(Paciente).all()
    return pacientes


@router.post(
    '/', status_code=HTTPStatus.CREATED, response_model=PacientePublic
)
def create_paciente(paciente: PacienteSchema, session: SessionDep):
    db_paciente = Paciente(nome=paciente.nome)
    session.add(db_paciente)
    session.commit()
    session.refresh(db_paciente)
    return db_paciente
