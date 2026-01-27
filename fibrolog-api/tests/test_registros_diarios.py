"""
Testes para o CRUD de registros diários.
"""

from http import HTTPStatus

import pytest
from httpx import AsyncClient

from fibrolog_api.models import Paciente

pytestmark = pytest.mark.asyncio


@pytest.fixture
def registro_diario_data():
    return {
        'intensidade_dor': 5,
        'qualidade_sono': 7,
        'nivel_fadiga': 6,
        'estado_emocional': 'ansioso',
        'localizacao_dor': 'Cabeça',
    }


async def test_create_registro_diario(
    client: AsyncClient,
    paciente: Paciente,
    token: str,
    registro_diario_data: dict,
):
    response = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json=registro_diario_data,
    )

    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['intensidade_dor'] == registro_diario_data['intensidade_dor']
    assert data['paciente_id'] == paciente.id
    assert 'id' in data


async def test_create_registro_diario_sobrescrever(
    client: AsyncClient, token: str, registro_diario_data: dict
):
    # Cria o primeiro registro
    response1 = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json=registro_diario_data,
    )
    assert response1.status_code == HTTPStatus.CREATED
    id1 = response1.json()['id']

    # Tenta criar o segundo no mesmo dia (deve sobrescrever)
    nova_intensidade_dor = 8
    registro_diario_data['intensidade_dor'] = nova_intensidade_dor
    response2 = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json=registro_diario_data,
    )

    assert response2.status_code == HTTPStatus.OK  # Sobrescrita retorna OK
    data2 = response2.json()
    assert data2['intensidade_dor'] == nova_intensidade_dor
    assert data2['id'] == id1  # O ID deve ser o mesmo


async def test_get_registros_diarios_vazio(client: AsyncClient, token: str):
    response = await client.get(
        '/registros-diarios/', headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'registros': []}


async def test_get_registros_diarios(
    client: AsyncClient, token: str, registro_diario_data: dict
):
    # Cria um registro
    await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json=registro_diario_data,
    )

    response = await client.get(
        '/registros-diarios/', headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert len(data['registros']) == 1
    assert (
        data['registros'][0]['intensidade_dor']
        == registro_diario_data['intensidade_dor']
    )


async def test_get_registro_diario_by_id(
    client: AsyncClient, token: str, registro_diario_data: dict
):
    # Cria o registro
    create_response = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json=registro_diario_data,
    )
    registro_id = create_response.json()['id']

    response = await client.get(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['id'] == registro_id


async def test_get_registro_diario_not_found(client: AsyncClient, token: str):
    response = await client.get(
        '/registros-diarios/999',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.NOT_FOUND


async def test_update_registro_diario(
    client: AsyncClient, token: str, registro_diario_data: dict
):
    # Cria o registro
    create_response = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json=registro_diario_data,
    )
    registro_id = create_response.json()['id']

    # Atualiza
    update_data = registro_diario_data.copy()
    novo_nivel_fadiga = 9
    update_data['nivel_fadiga'] = novo_nivel_fadiga

    response = await client.put(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {token}'},
        json=update_data,
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['nivel_fadiga'] == novo_nivel_fadiga


async def test_update_registro_diario_not_found(
    client: AsyncClient, token: str, registro_diario_data: dict
):
    response = await client.put(
        '/registros-diarios/999',
        headers={'Authorization': f'Bearer {token}'},
        json=registro_diario_data,
    )
    assert response.status_code == HTTPStatus.NOT_FOUND


async def test_delete_registro_diario(
    client: AsyncClient, token: str, registro_diario_data: dict
):
    # Cria o registro
    create_response = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json=registro_diario_data,
    )
    registro_id = create_response.json()['id']

    # Deleta
    response = await client.delete(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.NO_CONTENT

    # Verifica se foi deletado
    get_response = await client.get(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert get_response.status_code == HTTPStatus.NOT_FOUND


async def test_delete_registro_diario_not_found(
    client: AsyncClient, token: str
):
    response = await client.delete(
        '/registros-diarios/999',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.NOT_FOUND
