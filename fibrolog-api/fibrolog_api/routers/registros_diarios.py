"""
Rotas para o CRUD de registros diários de sintomas.
"""

from http import HTTPStatus
from types import SimpleNamespace
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


def _mapear_sintomas_para_resposta(sintomas):
    """Helper para mapear sintomas do modelo para o schema de resposta."""
    return [{'id': s.sintoma_id, 'intensity': s.intensidade} for s in sintomas]


def _mapear_regioes_para_resposta(regioes_dor):
    """
    Helper para mapear regiões de dor do modelo para o schema de resposta.
    """
    return [
        {'id': r.regiao_id, 'intensity': r.intensidade} for r in regioes_dor
    ]


async def _buscar_registro_mesmo_dia(session, paciente_id, data_registro):
    """
    Helper para buscar registro existente do mesmo dia (RN006).
    Retorna o registro se encontrado, None caso contrário.
    """
    stmt = (
        select(RegistroDiario)
        .where(RegistroDiario.paciente_id == paciente_id)
        .where(RegistroDiario.tipo_registro == 'diario')
        .options(selectinload(RegistroDiario.sintomas))
        .options(selectinload(RegistroDiario.regioes_dor))
    )
    result = await session.execute(stmt)
    registros_existentes = result.scalars().all()

    # Filtrar registros do mesmo dia
    for reg in registros_existentes:
        if reg.data_hora.date() == data_registro:
            return reg
    return None


async def _limpar_itens_registro(session, registro):
    """Helper para remover sintomas e regiões antigas de um registro."""
    for sintoma in registro.sintomas:
        await session.delete(sintoma)
    for regiao in registro.regioes_dor:
        await session.delete(regiao)
    await session.flush()


async def _adicionar_itens_registro(session, registro, symptoms, pain_regions):
    """Helper para adicionar sintomas e regiões a um registro."""
    # Adicionar sintomas
    for sintoma in symptoms:
        db_sintoma = RegistroSintoma(
            registro_id=registro.id,
            sintoma_id=sintoma.id,
            intensidade=sintoma.intensity,
        )
        session.add(db_sintoma)

    # Adicionar regiões de dor
    for regiao in pain_regions:
        db_regiao = RegistroRegiaoDor(
            registro_id=registro.id,
            regiao_id=regiao.id,
            intensidade=regiao.intensity,
        )
        session.add(db_regiao)


@router.post(
    '/',
    status_code=HTTPStatus.CREATED,
    response_model=RegistroDiarioPublic,
    summary='Criar registro diário',
    description=(
        'Cria um novo registro diário de sintomas e dor '
        '(Suporta nomes em inglês do frontend)'
    ),
)
async def create_registro_diario(
    registro: DailyLogCreate,
    session: Session,
    paciente: CurrentPaciente,
):
    # RN006: Verificar se já existe um registro para o mesmo dia
    data_registro = registro.timestamp.date()
    db_registro = await _buscar_registro_mesmo_dia(
        session, paciente.id, data_registro
    )

    if db_registro:
        # Atualizar registro existente (RN006: sobrescrever)
        db_registro.data_hora = registro.timestamp
        db_registro.observacoes = registro.notes
        await _limpar_itens_registro(session, db_registro)
    else:
        # Criar novo registro
        db_registro = RegistroDiario(
            paciente_id=paciente.id,
            tipo_registro='diario',
            observacoes=registro.notes,
        )
        db_registro.data_hora = registro.timestamp
        session.add(db_registro)
        await session.flush()

    await _adicionar_itens_registro(
        session, db_registro, registro.symptoms, registro.painRegions
    )

    await session.commit()
    await session.refresh(db_registro, ['sintomas', 'regioes_dor'])

    return RegistroDiarioPublic(
        id=db_registro.id,
        paciente_id=db_registro.paciente_id,
        data_registro=db_registro.data_hora,
        message='Registro criado com sucesso',
        symptoms=_mapear_sintomas_para_resposta(db_registro.sintomas),
        painRegions=_mapear_regioes_para_resposta(db_registro.regioes_dor),
        notes=db_registro.observacoes,
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
    # RN006: Verificar se já existe um registro para o mesmo dia
    data_registro = registro.data_hora.date()
    db_registro = await _buscar_registro_mesmo_dia(
        session, paciente.id, data_registro
    )

    if db_registro:
        # Atualizar registro existente (RN006: sobrescrever)
        db_registro.data_hora = registro.data_hora
        db_registro.observacoes = registro.observacoes
        await _limpar_itens_registro(session, db_registro)
    else:
        # Criar novo registro
        db_registro = RegistroDiario(
            paciente_id=paciente.id,
            tipo_registro='diario',
            observacoes=registro.observacoes,
        )
        db_registro.data_hora = registro.data_hora
        session.add(db_registro)
        await session.flush()

    # Mapear para schema interno do helper
    symptoms = [
        SimpleNamespace(id=s.id, intensity=s.intensidade)
        for s in registro.sintomas
    ]
    pain_regions = [
        SimpleNamespace(id=r.id, intensity=r.intensidade)
        for r in registro.regioes_dor
    ]

    await _adicionar_itens_registro(
        session, db_registro, symptoms, pain_regions
    )

    await session.commit()
    await session.refresh(db_registro, ['sintomas', 'regioes_dor'])

    return RegistroDiarioPublic(
        id=db_registro.id,
        paciente_id=db_registro.paciente_id,
        data_registro=db_registro.data_hora,
        message='Registro criado com sucesso',
        symptoms=_mapear_sintomas_para_resposta(db_registro.sintomas),
        painRegions=_mapear_regioes_para_resposta(db_registro.regioes_dor),
        notes=db_registro.observacoes,
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
                symptoms=_mapear_sintomas_para_resposta(r.sintomas),
                painRegions=_mapear_regioes_para_resposta(r.regioes_dor),
                notes=r.observacoes,
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
        symptoms=_mapear_sintomas_para_resposta(registro.sintomas),
        painRegions=_mapear_regioes_para_resposta(registro.regioes_dor),
        notes=registro.observacoes,
    )


@router.put(
    '/{registro_id}',
    response_model=RegistroDiarioPublic,
    summary='Atualizar registro diário',
)
async def update_registro_diario(
    registro_id: int,
    registro_data: DailyLogCreate,
    session: Session,
    paciente: CurrentPaciente,
):
    db_registro = await session.scalar(
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

    if not db_registro:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )

    db_registro.data_hora = registro_data.timestamp
    db_registro.observacoes = registro_data.notes

    await _limpar_itens_registro(session, db_registro)
    await _adicionar_itens_registro(
        session, db_registro, registro_data.symptoms, registro_data.painRegions
    )

    await session.commit()
    await session.refresh(db_registro, ['sintomas', 'regioes_dor'])

    return RegistroDiarioPublic(
        id=db_registro.id,
        paciente_id=db_registro.paciente_id,
        data_registro=db_registro.data_hora,
        message='Registro atualizado com sucesso',
        symptoms=_mapear_sintomas_para_resposta(db_registro.sintomas),
        painRegions=_mapear_regioes_para_resposta(db_registro.regioes_dor),
        notes=db_registro.observacoes,
    )


@router.delete(
    '/{registro_id}',
    status_code=HTTPStatus.NO_CONTENT,
    summary='Excluir registro diário',
)
async def delete_registro_diario(
    registro_id: int,
    session: Session,
    paciente: CurrentPaciente,
):
    db_registro = await session.scalar(
        select(RegistroDiario).where(
            RegistroDiario.id == registro_id,
            RegistroDiario.paciente_id == paciente.id,
        )
    )

    if not db_registro:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Registro diário não encontrado.',
        )

    await session.delete(db_registro)
    await session.commit()
