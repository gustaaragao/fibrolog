"""
Rotas para o CRUD de registros diários de sintomas.
"""

import zoneinfo
from datetime import datetime, timedelta
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import get_session
from fibrolog_api.models import Paciente, RegistroDiario
from fibrolog_api.schemas.registro_diario import (
    RegistroDiarioList,
    RegistroDiarioPublic,
    RegistroDiarioSchema,
    RegistroDiarioUpdate,
)
from fibrolog_api.security import get_current_paciente

router = APIRouter(prefix='/registros-diarios', tags=['Registros Diários'])

Session = Annotated[AsyncSession, Depends(get_session)]
CurrentPaciente = Annotated[Paciente, Depends(get_current_paciente)]

# Timezone for Brazil (São Paulo)
TIMEZONE = zoneinfo.ZoneInfo('America/Sao_Paulo')


@router.post(
    '/',
    response_model=RegistroDiarioPublic,
    summary='Criar registro diário',
    description='Cria ou atualiza o registro diário do dia atual',
)
async def create_registro_diario(
    registro_schema: RegistroDiarioSchema,
    session: Session,
    paciente: CurrentPaciente,
    response: Response,
):
    today = datetime.now(TIMEZONE).date()
    tomorrow = datetime.combine(
        today + timedelta(days=1), datetime.min.time()
    ).replace(tzinfo=TIMEZONE)
    today_start = datetime.combine(today, datetime.min.time()).replace(
        tzinfo=TIMEZONE
    )

    statement = (
        select(RegistroDiario)
        .where(RegistroDiario.paciente_id == paciente.id)
        .where(RegistroDiario.data_hora >= today_start)
        .where(RegistroDiario.data_hora < tomorrow)
    )
    result = await session.execute(statement)
    db_registro = result.scalar_one_or_none()

    if db_registro:
        response.status_code = HTTPStatus.OK
        for key, value in registro_schema.model_dump().items():
            setattr(db_registro, key, value)
        db_registro.data_hora = datetime.now(TIMEZONE)
        await session.commit()
        await session.refresh(db_registro)
        return db_registro

    response.status_code = HTTPStatus.CREATED
    db_registro = RegistroDiario(
        **registro_schema.model_dump(),
        paciente_id=paciente.id,
        tipo_registro='diario',
    )
    db_registro.data_hora = datetime.now(TIMEZONE)
    session.add(db_registro)
    await session.commit()
    await session.refresh(db_registro)
    return db_registro


@router.get(
    '/',
    response_model=RegistroDiarioList,
    summary='Listar registros diários',
    description='Retorna todos os registros diários do paciente autenticado',
)
async def get_registros_diarios(session: Session, paciente: CurrentPaciente):
    registros = await session.scalars(
        select(RegistroDiario).where(RegistroDiario.paciente_id == paciente.id)
    )
    return {'registros': registros.all()}


@router.get(
    '/{registro_id}',
    response_model=RegistroDiarioPublic,
    summary='Buscar registro diário',
    description='Retorna um registro diário específico',
)
async def get_registro_diario(
    registro_id: int, session: Session, paciente: CurrentPaciente
):
    registro = await session.scalar(
        select(RegistroDiario).where(
            RegistroDiario.id == registro_id,
            RegistroDiario.paciente_id == paciente.id,
        )
    )
    if not registro:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )
    return registro


@router.put(
    '/{registro_id}',
    response_model=RegistroDiarioPublic,
    summary='Atualizar registro diário',
    description='Atualiza um registro diário existente',
)
async def update_registro_diario(
    registro_id: int,
    registro_schema: RegistroDiarioSchema,
    session: Session,
    paciente: CurrentPaciente,
):
    registro = await session.scalar(
        select(RegistroDiario).where(
            RegistroDiario.id == registro_id,
            RegistroDiario.paciente_id == paciente.id,
        )
    )
    if not registro:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )

    for key, value in registro_schema.model_dump().items():
        setattr(registro, key, value)

    await session.commit()
    await session.refresh(registro)
    return registro


@router.patch(
    '/{registro_id}',
    response_model=RegistroDiarioPublic,
    summary='Atualizar parcialmente registro diário',
    description='Atualiza parcialmente um registro diário existente',
)
async def patch_registro_diario(
    registro_id: int,
    registro_schema: RegistroDiarioUpdate,
    session: Session,
    paciente: CurrentPaciente,
):
    registro = await session.scalar(
        select(RegistroDiario).where(
            RegistroDiario.id == registro_id,
            RegistroDiario.paciente_id == paciente.id,
        )
    )
    if not registro:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )

    update_data = registro_schema.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(registro, key, value)

    await session.commit()
    await session.refresh(registro)
    return registro


@router.delete(
    '/{registro_id}',
    status_code=HTTPStatus.NO_CONTENT,
    summary='Excluir registro diário',
    description='Exclui um registro diário',
)
async def delete_registro_diario(
    registro_id: int, session: Session, paciente: CurrentPaciente
):
    registro = await session.scalar(
        select(RegistroDiario).where(
            RegistroDiario.id == registro_id,
            RegistroDiario.paciente_id == paciente.id,
        )
    )
    if not registro:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )

    await session.delete(registro)
    await session.commit()
