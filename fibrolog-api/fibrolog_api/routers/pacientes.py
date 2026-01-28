from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import get_session
from fibrolog_api.models import Paciente
from fibrolog_api.schemas import (
    FilterPage,
    Message,
    PacienteList,
    PacientePublic,
    PacienteSchema,
)
from fibrolog_api.security import get_current_paciente, get_password_hash

router = APIRouter(prefix='/pacientes', tags=['Pacientes'])

Session = Annotated[AsyncSession, Depends(get_session)]
DBPaciente = Annotated[Paciente, Depends(get_current_paciente)]


@router.post(
    '/',
    status_code=HTTPStatus.CREATED,
    response_model=PacientePublic,
    summary='Criar paciente',
    description='Cria um novo paciente no sistema',
)
async def create_paciente(paciente: PacienteSchema, session: Session):
    existing = await session.scalar(
        select(Paciente).where(Paciente.email == paciente.email)
    )
    if existing:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Email já cadastrado',
        )

    db_paciente = Paciente(
        nome=paciente.nome,
        email=paciente.email,
        password=get_password_hash(paciente.password),
        data_nascimento=paciente.data_nascimento,
        sexo=paciente.sexo,
        data_diagnostico=paciente.data_diagnostico,
        medicacoes=paciente.medicacoes,
    )
    session.add(db_paciente)
    await session.commit()
    await session.refresh(db_paciente)
    return db_paciente


@router.get(
    '/',
    response_model=PacienteList,
    summary='Listar pacientes',
    description='Retorna lista paginada de pacientes',
)
async def get_pacientes(
    session: Session, filter_page: Annotated[FilterPage, Query()]
):
    pacientes = await session.scalars(
        select(Paciente).offset(filter_page.offset).limit(filter_page.limit)
    )
    return {'pacientes': pacientes.all()}


@router.get(
    '/{paciente_id}',
    response_model=PacientePublic,
    summary='Buscar paciente',
    description='Retorna os dados de um paciente específico',
)
async def get_paciente(paciente_id: int, session: Session):
    paciente = await session.scalar(
        select(Paciente).where(Paciente.id == paciente_id)
    )
    if not paciente:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Paciente não encontrado'
        )
    return paciente


@router.put(
    '/{paciente_id}',
    response_model=PacientePublic,
    summary='Atualizar paciente',
    description='Atualiza os dados do paciente autenticado',
)
async def update_paciente(
    paciente_id: int,
    paciente: PacienteSchema,
    session: Session,
    current_paciente: DBPaciente,
):
    if current_paciente.id != paciente_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Permissões insuficientes'
        )

    try:
        current_paciente.nome = paciente.nome
        current_paciente.email = paciente.email
        current_paciente.password = get_password_hash(paciente.password)
        current_paciente.data_nascimento = paciente.data_nascimento
        current_paciente.sexo = paciente.sexo
        current_paciente.data_diagnostico = paciente.data_diagnostico
        current_paciente.medicacoes = paciente.medicacoes
        await session.commit()
        await session.refresh(current_paciente)
        return current_paciente
    except IntegrityError:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Email já existe',
        )


@router.delete(
    '/{paciente_id}',
    response_model=Message,
    summary='Excluir paciente',
    description='Exclui o paciente autenticado do sistema',
)
async def delete_paciente(
    paciente_id: int,
    session: Session,
    current_paciente: DBPaciente,
):
    if current_paciente.id != paciente_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Permissões insuficientes'
        )

    await session.delete(current_paciente)
    await session.commit()

    return {'message': 'Paciente excluído'}
