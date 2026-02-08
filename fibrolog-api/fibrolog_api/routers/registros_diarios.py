"""
Rotas para o CRUD de registros diários de sintomas.
"""

from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from fibrolog_api.database import get_session
from fibrolog_api.models import (
    Paciente,
    RegistroDiario,
    RegistroRegiaoDor,
    RegistroSintoma,
)
from fibrolog_api.schemas.registro_diario import (
    DailyLogCreate,
    RegistroDiarioCreate,
    RegistroDiarioList,
    RegistroDiarioPublic,
)
from fibrolog_api.security import get_current_paciente

router = APIRouter(prefix='/registros-diarios', tags=['Registros Diários'])

Session = Annotated[AsyncSession, Depends(get_session)]
CurrentPaciente = Annotated[Paciente, Depends(get_current_paciente)]


@router.post(
    '/',
    status_code=HTTPStatus.CREATED,
    response_model=RegistroDiarioPublic,
    summary='Criar registro diário',
    description='Cria um novo registro diário de sintomas e dor (Suporta nomes em inglês do frontend)',
)
async def create_registro_diario(
    registro: DailyLogCreate,
    session: Session,
    paciente: CurrentPaciente,
):
    # Criar o registro principal (cabeçalho)
    db_registro = RegistroDiario(
        paciente_id=paciente.id,
        tipo_registro='diario',
        observacoes=registro.notes,
    )
    db_registro.data_hora = registro.timestamp

    session.add(db_registro)
    await session.flush()  # Para obter o ID do registro

    # Adicionar sintomas
    for sintoma in registro.symptoms:
        db_sintoma = RegistroSintoma(
            registro_id=db_registro.id,
            sintoma_id=sintoma.id,
            intensidade=sintoma.intensity,
        )
        session.add(db_sintoma)

    # Adicionar regiões de dor
    for regiao in registro.painRegions:
        db_regiao = RegistroRegiaoDor(
            registro_id=db_registro.id,
            regiao_id=regiao.id,
            intensidade=regiao.intensity,
        )
        session.add(db_regiao)

    await session.commit()
    await session.refresh(db_registro)

    return RegistroDiarioPublic(
        id=db_registro.id,
        paciente_id=db_registro.paciente_id,
        data_registro=db_registro.data_hora,
        message='Registro criado com sucesso',
    )


@router.post(
    '/pt',
    status_code=HTTPStatus.CREATED,
    response_model=RegistroDiarioPublic,
    summary='Criar registro diário (Português)',
    include_in_schema=False,
)
async def create_registro_diario_pt(
    registro: RegistroDiarioCreate,
    session: Session,
    paciente: CurrentPaciente,
):
    db_registro = RegistroDiario(
        paciente_id=paciente.id,
        tipo_registro='diario',
        observacoes=registro.observacoes,
    )
    db_registro.data_hora = registro.data_hora

    session.add(db_registro)
    await session.flush()

    for sintoma in registro.sintomas:
        db_sintoma = RegistroSintoma(
            registro_id=db_registro.id,
            sintoma_id=sintoma.id,
            intensidade=sintoma.intensidade,
        )
        session.add(db_sintoma)

    for regiao in registro.regioes_dor:
        db_regiao = RegistroRegiaoDor(
            registro_id=db_registro.id,
            regiao_id=regiao.id,
            intensidade=regiao.intensidade,
        )
        session.add(db_regiao)

    await session.commit()
    await session.refresh(db_registro)

    return RegistroDiarioPublic(
        id=db_registro.id,
        paciente_id=db_registro.paciente_id,
        data_registro=db_registro.data_hora,
        message='Registro criado com sucesso',
    )


@router.get(
    '/',
    response_model=RegistroDiarioList,
    summary='Listar registros diários',
)
async def get_registros_diarios(session: Session, paciente: CurrentPaciente):
    query = (
        select(RegistroDiario)
        .where(RegistroDiario.paciente_id == paciente.id)
        .options(
            selectinload(RegistroDiario.sintomas),
            selectinload(RegistroDiario.regioes_dor),
        )
        .order_by(RegistroDiario.data_hora.desc())
    )
    result = await session.execute(query)
    registros = result.scalars().all()

    registros_public = []
    for r in registros:
        registros_public.append(
            RegistroDiarioPublic(
                id=r.id,
                paciente_id=r.paciente_id,
                data_registro=r.data_hora,
                message='Registro recuperado com sucesso',
                symptoms=[
                    {'id': s.sintoma_id, 'intensity': s.intensidade}
                    for s in r.sintomas
                ],
                painRegions=[
                    {'id': p.regiao_id, 'intensity': p.intensidade}
                    for p in r.regioes_dor
                ],
            )
        )

    return {'registros': registros_public}


@router.get(
    '/{registro_id}',
    response_model=RegistroDiarioPublic,
    summary='Buscar registro diário',
)
async def get_registro_diario(
    registro_id: int, session: Session, paciente: CurrentPaciente
):
    registro = await session.scalar(
        select(RegistroDiario)
        .where(
            RegistroDiario.id == registro_id,
            RegistroDiario.paciente_id == paciente.id,
        )
        .options(
            selectinload(RegistroDiario.sintomas),
            selectinload(RegistroDiario.regioes_dor),
        )
    )
    if not registro:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )

    return RegistroDiarioPublic(
        id=registro.id,
        paciente_id=registro.paciente_id,
        data_registro=registro.data_hora,
        message='Registro recuperado com sucesso',
        symptoms=[
            {'id': s.sintoma_id, 'intensity': s.intensidade}
            for s in registro.sintomas
        ],
        painRegions=[
            {'id': p.regiao_id, 'intensity': p.intensidade}
            for p in registro.regioes_dor
        ],
    )
