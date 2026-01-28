from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import get_session
from fibrolog_api.models import Paciente
from fibrolog_api.schemas import Token
from fibrolog_api.security import create_access_token, verify_password

router = APIRouter(prefix='/auth', tags=['Autenticação'])


@router.post(
    '/token',
    response_model=Token,
    summary='Autenticar',
    description='Realiza autenticação e retorna token de acesso',
)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[AsyncSession, Depends(get_session)],
):
    paciente = await session.scalar(
        select(Paciente).where(Paciente.email == form_data.username)
    )

    if not paciente or not verify_password(form_data.password, paciente.password):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Email ou senha incorretos',
        )

    access_token = create_access_token(data={'sub': paciente.email})

    return {'access_token': access_token, 'token_type': 'bearer'}
