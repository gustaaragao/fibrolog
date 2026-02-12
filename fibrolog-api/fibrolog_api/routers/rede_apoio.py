import logging
from datetime import datetime
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import get_session
from fibrolog_api.models import Alerta, ContatoApoio, Paciente
from fibrolog_api.schemas import (
    ContatoApoioList,
    ContatoApoioPublic,
    ContatoApoioSchema,
    Message,
)
from fibrolog_api.security import get_current_paciente

router = APIRouter(prefix='/rede-apoio', tags=['Rede de Apoio'])

Session = Annotated[AsyncSession, Depends(get_session)]
DBPaciente = Annotated[Paciente, Depends(get_current_paciente)]

logger = logging.getLogger(__name__)


@router.get(
    '/',
    response_model=ContatoApoioList,
    summary='Listar contatos de apoio',
    description=(
        'Retorna todos os contatos da rede de apoio do paciente '
        'autenticado'
    ),
)
async def list_support_contacts(
    session: Session, current_paciente: DBPaciente
):
    query = select(ContatoApoio).where(
        ContatoApoio.paciente_id == current_paciente.id
    )
    result = await session.scalars(query)
    return {'contatos': result.all()}


@router.post(
    '/',
    response_model=ContatoApoioPublic,
    status_code=HTTPStatus.CREATED,
    summary='Adicionar contato de apoio',
    description=(
        'Cria um novo contato na rede de apoio do paciente autenticado'
    ),
)
async def create_support_contact(
    contact: ContatoApoioSchema, session: Session, current_paciente: DBPaciente
):
    # Verificar duplicidade
    existing = await session.scalar(
        select(ContatoApoio).where(
            ContatoApoio.paciente_id == current_paciente.id,
            ContatoApoio.telefone == contact.telefone,
        )
    )
    if existing:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Contato com este telefone já existe na sua rede de apoio.',
        )

    db_contact = ContatoApoio(
        paciente_id=current_paciente.id,
        nome=contact.nome,
        email=contact.email,
        telefone=contact.telefone,
        parentesco=contact.parentesco,
    )
    session.add(db_contact)
    await session.commit()
    await session.refresh(db_contact)
    return db_contact


@router.delete(
    '/{contact_id}',
    status_code=HTTPStatus.NO_CONTENT,
    summary='Remover contato de apoio',
    description='Remove um contato da rede de apoio do paciente autenticado',
)
async def delete_support_contact(
    contact_id: int, session: Session, current_paciente: DBPaciente
):
    db_contact = await session.scalar(
        select(ContatoApoio).where(
            ContatoApoio.id == contact_id,
            ContatoApoio.paciente_id == current_paciente.id,
        )
    )

    if not db_contact:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Contato não encontrado ou permissão negada.',
        )

    await session.delete(db_contact)
    await session.commit()


@router.post(
    '/notificar',
    response_model=Message,
    summary='Notificar rede de apoio',
    description=(
        'Simula o envio de notificações para todos os contatos da rede '
        'de apoio'
    ),
)
async def notify_support_network(
    session: Session, current_paciente: DBPaciente
):
    query = select(ContatoApoio).where(
        ContatoApoio.paciente_id == current_paciente.id
    )
    contacts = (await session.scalars(query)).all()

    if not contacts:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=(
                'Você não possui contatos cadastrados na sua rede de '
                'apoio.'
            ),
        )

    # Registrar o Alerta no banco
    alerta = Alerta(
        paciente_id=current_paciente.id,
        tipo='CRISE_DOR',
        data_hora=datetime.now(),
        descricao=(
            f'Paciente {current_paciente.nome} disparou um alerta de '
            f'crise para {len(contacts)} contatos.'
        ),
        ativo=True,
    )
    session.add(alerta)

    # Simular notificação
    for contact in contacts:
        logger.info(
            f'SIMULAÇÃO DE NOTIFICAÇÃO: Enviando alerta de crise para '
            f'{contact.nome} ({contact.telefone})'
        )

    await session.commit()

    return {'message': 'Notificações enviadas com sucesso (simulado).'}
