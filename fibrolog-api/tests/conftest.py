import asyncio

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import StaticPool

from fibrolog_api.app import app
from fibrolog_api.database import get_session
from fibrolog_api.models import Paciente, table_registry
from fibrolog_api.security import create_access_token, get_password_hash


@pytest.fixture(scope='session')
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture
async def session():
    engine = create_async_engine(
        'sqlite+aiosqlite:///:memory:',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(table_registry.metadata.create_all)

    async with AsyncSession(engine, expire_on_commit=False) as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(table_registry.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture
async def client(session):
    async def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url='http://test'
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def paciente(session):
    from datetime import datetime
    
    password_plain = 'Senha@123'
    paciente = Paciente(
        nome='Gustavo Silva',
        email='gustavo@example.com',
        password=get_password_hash(password_plain),
        data_nascimento=datetime(1990, 5, 15),
        sexo='M',
        data_diagnostico=datetime(2020, 3, 10),
        medicacoes='Pregabalina 75mg (2x/dia), Duloxetina 60mg (1x/dia)',
    )
    session.add(paciente)
    await session.commit()
    await session.refresh(paciente)

    # Adicionar senha não-hasheada para uso nos testes
    paciente.password_plain = password_plain
    return paciente


@pytest_asyncio.fixture
async def other_paciente(session):
    from datetime import datetime
    
    password_plain = 'Senha@456'
    paciente = Paciente(
        nome='Maria Santos',
        email='maria@example.com',
        password=get_password_hash(password_plain),
        data_nascimento=datetime(1985, 8, 22),
        sexo='F',
        data_diagnostico=datetime(2018, 11, 5),
        medicacoes='Gabapentina 300mg (3x/dia), Amitriptilina 25mg (1x/dia)',
    )
    session.add(paciente)
    await session.commit()
    await session.refresh(paciente)
    
    paciente.password_plain = password_plain
    return paciente


@pytest_asyncio.fixture
async def token(paciente):
    return create_access_token(data={'sub': paciente.email})
