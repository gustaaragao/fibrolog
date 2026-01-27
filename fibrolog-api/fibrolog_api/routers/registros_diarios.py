"""
Rotas para o CRUD de registros diários de sintomas.
"""

import zoneinfo
from datetime import datetime
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
)
from fibrolog_api.security import get_current_paciente

router = APIRouter(prefix='/registros-diarios', tags=['Registros Diários'])

Session = Annotated[AsyncSession, Depends(get_session)]
CurrentPaciente = Annotated[Paciente, Depends(get_current_paciente)]


@router.post(
    '/',
    status_code=HTTPStatus.OK,
    response_model=RegistroDiarioPublic,
)
async def create_registro_diario(
    registro_schema: RegistroDiarioSchema,
    session: Session,
    paciente: CurrentPaciente,
    response: Response,
):
    """
    Cria um novo registro diário para o paciente logado.
    Se já existir um registro para o dia, ele será sobrescrito.
    """
    today = datetime.now(zoneinfo.ZoneInfo('America/Sao_Paulo')).date()

    statement = (
        select(RegistroDiario)
        .where(RegistroDiario.paciente_id == paciente.id)
        .where(RegistroDiario.data_hora >= today)
    )
    result = await session.execute(statement)
    db_registro = result.scalar_one_or_none()

    if db_registro:
        # Atualiza o registro existente
        for key, value in registro_schema.model_dump().items():
            setattr(db_registro, key, value)
        db_registro.data_hora = datetime.now(
            zoneinfo.ZoneInfo('America/Sao_Paulo')
        )
        session.add(db_registro)
        await session.commit()
        await session.refresh(db_registro)
        return db_registro

    # Cria um novo registro
    response.status_code = HTTPStatus.CREATED
    db_registro = RegistroDiario(
        **registro_schema.model_dump(),
        paciente_id=paciente.id,
        tipo_registro='diario',
    )
    session.add(db_registro)
    await session.commit()
    await session.refresh(db_registro)
    return db_registro


@router.get('/', response_model=RegistroDiarioList)
async def get_registros_diarios(session: Session, paciente: CurrentPaciente):
    """Retorna todos os registros diários do paciente logado."""
    statement = select(RegistroDiario).where(
        RegistroDiario.paciente_id == paciente.id
    )
    result = await session.scalars(statement)
    return {'registros': result.all()}


@router.get('/{registro_id}', response_model=RegistroDiarioPublic)
async def get_registro_diario(
    registro_id: int, session: Session, paciente: CurrentPaciente
):
    """Retorna um registro diário específico pelo ID."""
    statement = select(RegistroDiario).where(
        RegistroDiario.id == registro_id,
        RegistroDiario.paciente_id == paciente.id,
    )
    result = await session.scalar(statement)
    if not result:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )
    return result


@router.put('/{registro_id}', response_model=RegistroDiarioPublic)
async def update_registro_diario(
    registro_id: int,
    registro_schema: RegistroDiarioSchema,
    session: Session,
    paciente: CurrentPaciente,
):
    """Atualiza um registro diário existente."""
    statement = select(RegistroDiario).where(
        RegistroDiario.id == registro_id,
        RegistroDiario.paciente_id == paciente.id,
    )
    result = await session.scalar(statement)
    if not result:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )

    for key, value in registro_schema.model_dump().items():
        setattr(result, key, value)

    session.add(result)
    await session.commit()
    await session.refresh(result)

    return result


@router.delete('/{registro_id}', status_code=HTTPStatus.NO_CONTENT)
async def delete_registro_diario(
    registro_id: int, session: Session, paciente: CurrentPaciente
):
    """Deleta um registro diário."""
    statement = select(RegistroDiario).where(
        RegistroDiario.id == registro_id,
        RegistroDiario.paciente_id == paciente.id,
    )
    result = await session.scalar(statement)
    if not result:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )

    await session.delete(result)
    await session.commit()
