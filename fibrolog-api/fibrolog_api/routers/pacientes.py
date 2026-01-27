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
    '/', status_code=HTTPStatus.CREATED, response_model=PacientePublic
)
async def create_paciente(paciente: PacienteSchema, session: Session):
    # Verificar se o email já existe
    result = await session.execute(
        select(Paciente).where(Paciente.email == paciente.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Email already registered',
        )

    db_paciente = Paciente(
        nome=paciente.nome,
        email=paciente.email,
        password=get_password_hash(paciente.password),
    )
    session.add(db_paciente)
    await session.commit()
    await session.refresh(db_paciente)
    return db_paciente


@router.get('/', response_model=PacienteList)
async def get_pacientes(
    session: Session, filter_page: Annotated[FilterPage, Query()]
):
    result = await session.scalars(
        select(Paciente).offset(filter_page.offset).limit(filter_page.limit)
    )
    pacientes = result.all()
    return {'pacientes': pacientes}


@router.get('/{paciente_id}', response_model=PacientePublic)
async def get_paciente(paciente_id: int, session: Session):
    result = await session.execute(
        select(Paciente).where(Paciente.id == paciente_id)
    )
    paciente = result.scalar_one_or_none()

    if not paciente:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Paciente not found'
        )

    return paciente


@router.put('/{paciente_id}', response_model=PacientePublic)
async def update_paciente(
    paciente_id: int,
    paciente: PacienteSchema,
    session: Session,
    current_paciente: DBPaciente,
):
    if current_paciente.id != paciente_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Not enough permissions'
        )

    try:
        current_paciente.nome = paciente.nome
        current_paciente.email = paciente.email
        current_paciente.password = get_password_hash(paciente.password)
        await session.commit()
        await session.refresh(current_paciente)

        return current_paciente

    except IntegrityError:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Email already exists',
        )


@router.delete('/{paciente_id}', response_model=Message)
async def delete_paciente(
    paciente_id: int,
    session: Session,
    current_paciente: DBPaciente,
):
    if current_paciente.id != paciente_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Not enough permissions'
        )

    await session.delete(current_paciente)
    await session.commit()

    return {'message': 'Paciente deleted'}
