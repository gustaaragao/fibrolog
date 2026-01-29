from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import get_session
from fibrolog_api.models import Paciente, RegistroCrise
from fibrolog_api.schemas.crise import CriseCreate, CriseList, CrisePublic
from fibrolog_api.security import get_current_paciente

router = APIRouter(prefix='/crises', tags=['Crises'])

Session = Annotated[AsyncSession, Depends(get_session)]
CurrentPaciente = Annotated[Paciente, Depends(get_current_paciente)]


@router.post(
    '/',
    status_code=HTTPStatus.CREATED,
    response_model=CrisePublic,
    summary='Criar registro de crise',
    description='Cria um novo registro de crise para o paciente autenticado.',
)
async def create_crise(
    crise_schema: CriseCreate,
    session: Session,
    paciente: CurrentPaciente,
):
    db_crise = RegistroCrise(
        **crise_schema.model_dump(),
        paciente_id=paciente.id,
        tipo_registro='crise',
    )
    session.add(db_crise)
    await session.commit()
    await session.refresh(db_crise)
    return db_crise


@router.get(
    '/',
    response_model=CriseList,
    summary='Listar crises',
    description='Retorna todas as crises do paciente autenticado.',
)
async def get_crises(session: Session, paciente: CurrentPaciente):
    crises = await session.scalars(
        select(RegistroCrise).where(RegistroCrise.paciente_id == paciente.id)
    )
    return {'crises': crises.all()}
