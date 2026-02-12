import uuid
from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import get_session
from fibrolog_api.models import Lembrete, Paciente
from fibrolog_api.schemas.reminders import (
    ReminderCreate,
    ReminderResponse,
    ReminderUpdate,
)
from fibrolog_api.security import get_current_paciente

router = APIRouter(prefix='/pacientes/lembretes', tags=['Lembretes'])

Session = Annotated[AsyncSession, Depends(get_session)]
DBPaciente = Annotated[Paciente, Depends(get_current_paciente)]


@router.get(
    '/',
    response_model=List[ReminderResponse],
    summary='Listar lembretes',
    description='Retorna todos os lembretes do paciente autenticado',
)
async def list_reminders(session: Session, current_paciente: DBPaciente):
    query = select(Lembrete).where(Lembrete.paciente_id == current_paciente.id)
    result = await session.scalars(query)
    return result.all()


@router.post(
    '/',
    response_model=ReminderResponse,
    status_code=HTTPStatus.CREATED,
    summary='Criar lembrete',
    description='Cria um novo lembrete para o paciente autenticado',
)
async def create_reminder(
    reminder: ReminderCreate, session: Session, current_paciente: DBPaciente
):
    reminder_id = reminder.id or str(uuid.uuid4())

    # Verificar se o ID já existe
    existing = await session.scalar(
        select(Lembrete).where(Lembrete.id == reminder_id)
    )
    if existing:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Lembrete com este ID já existe.',
        )

    db_reminder = Lembrete(
        id=reminder_id,
        paciente_id=current_paciente.id,
        titulo=reminder.titulo,
        tipo=reminder.tipo,
        hora=reminder.hora,
        minuto=reminder.minuto,
        ativo=reminder.ativo,
        dosagem=reminder.dosagem,
        intervalo=reminder.intervalo,
        data_exame=reminder.data_exame,
    )
    session.add(db_reminder)
    await session.commit()
    await session.refresh(db_reminder)
    return db_reminder


@router.patch(
    '/{reminder_id}',
    response_model=ReminderResponse,
    summary='Atualizar lembrete',
    description='Atualiza parcialmente um lembrete do paciente autenticado',
)
async def update_reminder(
    reminder_id: str,
    reminder: ReminderUpdate,
    session: Session,
    current_paciente: DBPaciente,
):
    db_reminder = await session.scalar(
        select(Lembrete).where(
            Lembrete.id == reminder_id,
            Lembrete.paciente_id == current_paciente.id,
        )
    )

    if not db_reminder:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Lembrete não encontrado ou permissão negada.',
        )

    reminder_data = reminder.model_dump(exclude_unset=True)
    for key, value in reminder_data.items():
        setattr(db_reminder, key, value)

    await session.commit()
    await session.refresh(db_reminder)
    return db_reminder


@router.delete(
    '/{reminder_id}',
    status_code=HTTPStatus.NO_CONTENT,
    summary='Excluir lembrete',
    description='Remove permanentemente um lembrete do paciente autenticado',
)
async def delete_reminder(
    reminder_id: str, session: Session, current_paciente: DBPaciente
):
    db_reminder = await session.scalar(
        select(Lembrete).where(
            Lembrete.id == reminder_id,
            Lembrete.paciente_id == current_paciente.id,
        )
    )

    if not db_reminder:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Lembrete não encontrado ou permissão negada.',
        )

    await session.delete(db_reminder)
    await session.commit()
