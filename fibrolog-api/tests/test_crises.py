"""
Testes para o CRUD de crises.
"""

from http import HTTPStatus

import pytest
from httpx import AsyncClient

from fibrolog_api.models import Paciente

pytestmark = pytest.mark.asyncio


@pytest.fixture
def crise_data():
    return {
        'intensidade_dor': 8,
        'contexto': 'Crise forte após um dia estressante de trabalho.',
    }


async def test_create_crise(
    client: AsyncClient,
    paciente: Paciente,
    token: str,
    crise_data: dict,
):
    response = await client.post(
        '/crises/',
        headers={'Authorization': f'Bearer {token}'},
        json=crise_data,
    )

    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['intensidade_dor'] == crise_data['intensidade_dor']
    assert data['contexto'] == crise_data['contexto']
    assert data['paciente_id'] == paciente.id
    assert 'id' in data
    assert 'data_hora' in data


async def test_get_crises_vazio(client: AsyncClient, token: str):
    response = await client.get(
        '/crises/', headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'crises': []}


async def test_get_crises(
    client: AsyncClient, token: str, crise_data: dict
):
    # Cria uma crise
    await client.post(
        '/crises/',
        headers={'Authorization': f'Bearer {token}'},
        json=crise_data,
    )

    response = await client.get(
        '/crises/', headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert len(data['crises']) == 1
    assert (
        data['crises'][0]['intensidade_dor']
        == crise_data['intensidade_dor']
    )
    assert data['crises'][0]['contexto'] == crise_data['contexto']
