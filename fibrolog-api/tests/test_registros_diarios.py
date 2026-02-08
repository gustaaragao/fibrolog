from datetime import datetime
from http import HTTPStatus

import pytest


@pytest.mark.asyncio
async def test_create_registro_completo(client, token, paciente):
    data_hora = datetime.now().isoformat()
    response = await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [
                {'id': '1', 'intensidade': 7},
                {'id': '5', 'intensidade': 4},
            ],
            'regioes_dor': [
                {'id': '24', 'intensidade': 8},
                {'id': '10', 'intensidade': 5},
            ],
            'observacoes': 'Hoje acordei com muita dor nas costas.',
            'data_hora': data_hora,
        },
    )

    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['paciente_id'] == paciente.id
    assert 'id' in data
    assert data['message'] == 'Registro criado com sucesso'


@pytest.mark.asyncio
async def test_create_registro_vazio(client, token, paciente):
    data_hora = datetime.now().isoformat()
    response = await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [],
            'regioes_dor': [],
            'observacoes': '',
            'data_hora': data_hora,
        },
    )

    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['message'] == 'Registro criado com sucesso'


@pytest.mark.asyncio
async def test_create_registro_intensidade_invalida(client, token):
    data_hora = datetime.now().isoformat()
    response = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '1', 'intensidade': 11}],
            'regioes_dor': [],
            'data_hora': data_hora,
        },
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_create_registro_sintoma_id_invalido(client, token):
    data_hora = datetime.now().isoformat()
    response = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '9', 'intensidade': 5}],
            'regioes_dor': [],
            'data_hora': data_hora,
        },
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_create_registro_regiao_id_invalida(client, token):
    data_hora = datetime.now().isoformat()
    response = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [],
            'regioes_dor': [{'id': '51', 'intensidade': 5}],
            'data_hora': data_hora,
        },
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_create_registro_nao_autenticado(client):
    data_hora = datetime.now().isoformat()
    response = await client.post(
        '/registros-diarios/',
        json={'sintomas': [], 'regioes_dor': [], 'data_hora': data_hora},
    )

    assert response.status_code == HTTPStatus.UNAUTHORIZED

@pytest.mark.asyncio
async def test_create_registro_frontend_compatibility(client, token, paciente):
    timestamp = datetime.now().isoformat()
    response = await client.post(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'symptoms': [
                {'id': '1', 'intensity': 7},
                {'id': '5', 'intensity': 4},
            ],
            'painRegions': [
                {'id': '24', 'intensity': 8},
                {'id': '10', 'intensity': 5},
            ],
            'notes': 'Texto livre de observações...',
            'timestamp': timestamp,
        },
    )

    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['paciente_id'] == paciente.id
    assert 'id' in data
    assert data['message'] == 'Registro criado com sucesso'


@pytest.mark.asyncio
async def test_get_registros_diarios(client, token, paciente):
    # Criar um registro primeiro
    await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '1', 'intensidade': 7}],
            'regioes_dor': [{'id': '24', 'intensidade': 8}],
            'observacoes': 'Teste de listagem',
            'data_hora': datetime.now().isoformat(),
        },
    )

    response = await client.get(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert 'registros' in data
    assert len(data['registros']) > 0
    assert data['registros'][0]['paciente_id'] == paciente.id
    assert len(data['registros'][0]['symptoms']) > 0
    assert data['registros'][0]['symptoms'][0]['id'] == '1'
    assert len(data['registros'][0]['painRegions']) > 0
    assert data['registros'][0]['painRegions'][0]['id'] == '24'


@pytest.mark.asyncio
async def test_get_registro_diario_by_id(client, token, paciente):
    # Criar um registro primeiro
    response_post = await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '2', 'intensidade': 5}],
            'regioes_dor': [{'id': '10', 'intensidade': 3}],
            'observacoes': 'Teste de ID único',
            'data_hora': datetime.now().isoformat(),
        },
    )
    registro_id = response_post.json()['id']

    response = await client.get(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['id'] == registro_id
    assert len(data['symptoms']) == 1
    assert data['symptoms'][0]['id'] == '2'
    assert len(data['painRegions']) == 1
    assert data['painRegions'][0]['id'] == '10'
