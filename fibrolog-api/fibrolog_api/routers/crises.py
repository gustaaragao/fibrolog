from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import get_session
from fibrolog_api.models import Paciente, RegistroCrise
from fibrolog_api.schemas.crise import (
    CriseCreate,
    CriseList,
    CrisePublic,
    CriseUpdate,
)
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


@router.get(
    '/{crise_id}',
    response_model=CrisePublic,
    summary='Buscar crise',
    description='Retorna uma crise específica do paciente autenticado.',
)
async def get_crise(
    crise_id: int, session: Session, paciente: CurrentPaciente
):
    crise = await session.scalar(
        select(RegistroCrise).where(
            RegistroCrise.id == crise_id,
            RegistroCrise.paciente_id == paciente.id,
        )
    )
    if not crise:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Crise não encontrada.',
        )
    return crise


@router.put(
    '/{crise_id}',
    response_model=CrisePublic,
    summary='Atualizar crise',
    description='Atualiza uma crise existente do paciente autenticado.',
)
async def update_crise(
    crise_id: int,
    crise_schema: CriseCreate,
    session: Session,
    paciente: CurrentPaciente,
):
    crise = await session.scalar(
        select(RegistroCrise).where(
            RegistroCrise.id == crise_id,
            RegistroCrise.paciente_id == paciente.id,
        )
    )
    if not crise:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Crise não encontrada.',
        )

    for key, value in crise_schema.model_dump().items():
        setattr(crise, key, value)

    await session.commit()
    await session.refresh(crise)
    return crise


@router.patch(
    '/{crise_id}',
    response_model=CrisePublic,
    summary='Atualizar parcialmente crise',
    description='Atualiza parcialmente uma crise existente do paciente autenticado.',
)
async def patch_crise(
    crise_id: int,
    crise_schema: CriseUpdate,
    session: Session,
    paciente: CurrentPaciente,
):
    crise = await session.scalar(
        select(RegistroCrise).where(
            RegistroCrise.id == crise_id,
            RegistroCrise.paciente_id == paciente.id,
        )
    )
    if not crise:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Crise não encontrada.',
        )

    update_data = crise_schema.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(crise, key, value)

    await session.commit()
    await session.refresh(crise)
    return crise


@router.delete(
    '/{crise_id}',
    status_code=HTTPStatus.NO_CONTENT,
    summary='Excluir crise',
    description='Exclui uma crise do paciente autenticado.',
)
async def delete_crise(
    crise_id: int, session: Session, paciente: CurrentPaciente
):
    crise = await session.scalar(
        select(RegistroCrise).where(
            RegistroCrise.id == crise_id,
            RegistroCrise.paciente_id == paciente.id,
        )
    )
    if not crise:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Crise não encontrada.',
        )

    await session.delete(crise)
    await session.commit()
