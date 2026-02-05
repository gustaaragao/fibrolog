from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from fibrolog_api.database import get_session
from fibrolog_api.models import Medicacao, Paciente
from fibrolog_api.schemas.medicacao import (
    MedicacaoList,
    MedicacaoPublic,
    MedicacaoSchema,
)
from fibrolog_api.security import get_current_paciente

router = APIRouter(prefix='/medicacoes', tags=['Medicações'])

Session = Annotated[AsyncSession, Depends(get_session)]
CurrentPaciente = Annotated[Paciente, Depends(get_current_paciente)]


@router.post(
    '/{paciente_id}',
    response_model=MedicacaoPublic,
    status_code=HTTPStatus.CREATED,
)
async def create_medicacao(
    paciente_id: int,
    medicacao: MedicacaoSchema,
    session: Session,
    user: CurrentPaciente,
):
    if user.id != paciente_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Você não tem permissão para adicionar '
            'medicação a este paciente',
        )

    db_medicacao = Medicacao(
        nome=medicacao.nome,
        dosagem=medicacao.dosagem,
        frequencia=medicacao.frequencia,
        paciente_id=paciente_id,
    )
    session.add(db_medicacao)
    await session.commit()
    await session.refresh(db_medicacao)
    return db_medicacao


@router.get('/{paciente_id}', response_model=MedicacaoList)
async def list_medicacoes(
    paciente_id: int,
    session: Session,
    user: CurrentPaciente,
):
    if user.id != paciente_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Você não tem permissão para visualizar '
            'as medicações deste paciente',
        )
    result = await session.execute(
        select(Medicacao).where(Medicacao.paciente_id == paciente_id)
    )
    medicacoes = result.scalars().all()
    return {'medicacoes': medicacoes}


@router.get('/medicacao/{medicacao_id}', response_model=MedicacaoPublic)
async def get_medicacao(
    medicacao_id: int,
    session: Session,
    user: CurrentPaciente,
):
    result = await session.execute(
        select(Medicacao).where(Medicacao.id == medicacao_id)
    )
    db_medicacao = result.scalar_one_or_none()
    if not db_medicacao:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Medicação não encontrada',
        )
    if db_medicacao.paciente_id != user.id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Você não tem permissão para visualizar esta medicação',
        )
    return db_medicacao


@router.put('/{medicacao_id}', response_model=MedicacaoPublic)
async def update_medicacao(
    medicacao_id: int,
    medicacao: MedicacaoSchema,
    session: Session,
    user: CurrentPaciente,
):
    result = await session.execute(
        select(Medicacao).where(Medicacao.id == medicacao_id)
    )
    db_medicacao = result.scalar_one_or_none()

    if not db_medicacao:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Medicação não encontrada',
        )

    if db_medicacao.paciente_id != user.id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Você não tem permissão para atualizar esta medicação',
        )

    db_medicacao.nome = medicacao.nome
    db_medicacao.dosagem = medicacao.dosagem
    db_medicacao.frequencia = medicacao.frequencia
    await session.commit()
    await session.refresh(db_medicacao)
    return db_medicacao


@router.delete('/{medicacao_id}', status_code=204)
async def delete_medicacao(
    medicacao_id: int,
    session: Session,
    user: CurrentPaciente,
):
    result = await session.execute(
        select(Medicacao).where(Medicacao.id == medicacao_id)
    )
    db_medicacao = result.scalar_one_or_none()

    if not db_medicacao:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Medicação não encontrada',
        )

    if db_medicacao.paciente_id != user.id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Você não tem permissão para deletar esta medicação',
        )

    await session.delete(db_medicacao)
    await session.commit()
