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


async def test_get_crise_by_id(
    client: AsyncClient, token: str, crise_data: dict
):
    # Cria uma crise
    create_response = await client.post(
        '/crises/',
        headers={'Authorization': f'Bearer {token}'},
        json=crise_data,
    )
    crise_id = create_response.json()['id']

    # Busca a crise
    response = await client.get(
        f'/crises/{crise_id}', headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['id'] == crise_id
    assert data['intensidade_dor'] == crise_data['intensidade_dor']
    assert data['contexto'] == crise_data['contexto']


async def test_get_crise_not_found(client: AsyncClient, token: str):
    response = await client.get(
        '/crises/999', headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json()['detail'] == 'Crise não encontrada.'


async def test_update_crise(
    client: AsyncClient, token: str, crise_data: dict
):
    # Cria uma crise
    create_response = await client.post(
        '/crises/',
        headers={'Authorization': f'Bearer {token}'},
        json=crise_data,
    )
    crise_id = create_response.json()['id']

    # Atualiza a crise
    updated_data = {
        'intensidade_dor': 5,
        'contexto': 'Crise moderada após descanso.',
    }
    response = await client.put(
        f'/crises/{crise_id}',
        headers={'Authorization': f'Bearer {token}'},
        json=updated_data,
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['id'] == crise_id
    assert data['intensidade_dor'] == updated_data['intensidade_dor']
    assert data['contexto'] == updated_data['contexto']


async def test_update_crise_not_found(client: AsyncClient, token: str):
    updated_data = {
        'intensidade_dor': 5,
        'contexto': 'Crise moderada.',
    }
    response = await client.put(
        '/crises/999',
        headers={'Authorization': f'Bearer {token}'},
        json=updated_data,
    )
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json()['detail'] == 'Crise não encontrada.'


async def test_patch_crise(
    client: AsyncClient, token: str, crise_data: dict
):
    # Cria uma crise
    create_response = await client.post(
        '/crises/',
        headers={'Authorization': f'Bearer {token}'},
        json=crise_data,
    )
    crise_id = create_response.json()['id']

    # Atualiza parcialmente a crise
    patch_data = {'intensidade_dor': 6}
    response = await client.patch(
        f'/crises/{crise_id}',
        headers={'Authorization': f'Bearer {token}'},
        json=patch_data,
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['id'] == crise_id
    assert data['intensidade_dor'] == patch_data['intensidade_dor']
    assert data['contexto'] == crise_data['contexto']  # Não mudou


async def test_patch_crise_not_found(client: AsyncClient, token: str):
    patch_data = {'intensidade_dor': 6}
    response = await client.patch(
        '/crises/999',
        headers={'Authorization': f'Bearer {token}'},
        json=patch_data,
    )
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json()['detail'] == 'Crise não encontrada.'


async def test_delete_crise(
    client: AsyncClient, token: str, crise_data: dict
):
    # Cria uma crise
    create_response = await client.post(
        '/crises/',
        headers={'Authorization': f'Bearer {token}'},
        json=crise_data,
    )
    crise_id = create_response.json()['id']

    # Delete a crise
    response = await client.delete(
        f'/crises/{crise_id}', headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == HTTPStatus.NO_CONTENT

    # Verifica que a crise foi deletada
    get_response = await client.get(
        f'/crises/{crise_id}', headers={'Authorization': f'Bearer {token}'}
    )
    assert get_response.status_code == HTTPStatus.NOT_FOUND


async def test_delete_crise_not_found(client: AsyncClient, token: str):
    response = await client.delete(
        '/crises/999', headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json()['detail'] == 'Crise não encontrada.'
