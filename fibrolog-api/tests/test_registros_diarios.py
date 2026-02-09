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
            'symptoms': [{'id': '1', 'intensity': 11}],
            'painRegions': [],
            'timestamp': data_hora,
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
            'symptoms': [{'id': '9', 'intensity': 5}],
            'painRegions': [],
            'timestamp': data_hora,
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
            'symptoms': [],
            'painRegions': [{'id': '51', 'intensity': 5}],
            'timestamp': data_hora,
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


@pytest.mark.asyncio
async def test_rn006_upsert_registro_mesmo_dia(client, token, paciente):
    """RN006: Apenas 1 registro por dia - deve sobrescrever o existente."""
    # Criar o primeiro registro
    data_hoje = datetime.now()
    response1 = await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '1', 'intensidade': 5}],
            'regioes_dor': [{'id': '10', 'intensidade': 6}],
            'observacoes': 'Primeira versão',
            'data_hora': data_hoje.isoformat(),
        },
    )
    assert response1.status_code == HTTPStatus.CREATED
    primeiro_id = response1.json()['id']

    # Criar segundo registro no mesmo dia (deve sobrescrever)
    response2 = await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '2', 'intensidade': 8}],
            'regioes_dor': [{'id': '20', 'intensidade': 9}],
            'observacoes': 'Segunda versão (sobrescrita)',
            'data_hora': data_hoje.isoformat(),
        },
    )
    assert response2.status_code == HTTPStatus.CREATED
    segundo_id = response2.json()['id']

    # O ID deve ser o mesmo (sobrescreveu)
    assert primeiro_id == segundo_id

    # Listar todos os registros do paciente
    response_list = await client.get(
        '/registros-diarios/',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response_list.status_code == HTTPStatus.OK
    registros = response_list.json()['registros']

    # Deve ter apenas 1 registro para hoje
    registros_hoje = [
        r for r in registros 
        if datetime.fromisoformat(r['data_registro']).date() == data_hoje.date()
    ]
    assert len(registros_hoje) == 1

    # E os dados devem ser da segunda versão
    registro = registros_hoje[0]
    assert registro['id'] == primeiro_id
    assert len(registro['symptoms']) == 1
    assert registro['symptoms'][0]['id'] == '2'
    assert registro['symptoms'][0]['intensity'] == 8
    assert len(registro['painRegions']) == 1
    assert registro['painRegions'][0]['id'] == '20'
    assert registro['painRegions'][0]['intensity'] == 9
    assert registro['notes'] == 'Segunda versão (sobrescrita)'


@pytest.mark.asyncio
async def test_update_registro_diario(client, token, paciente):
    # Criar um registro primeiro
    response_post = await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '2', 'intensidade': 5}],
            'regioes_dor': [{'id': '10', 'intensidade': 3}],
            'observacoes': 'Antes do update',
            'data_hora': datetime.now().isoformat(),
        },
    )
    registro_id = response_post.json()['id']

    # Atualizar o registro
    response_put = await client.put(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'symptoms': [{'id': '3', 'intensity': 9}],
            'painRegions': [{'id': '15', 'intensity': 4}],
            'notes': 'Depois do update',
            'timestamp': datetime.now().isoformat(),
        },
    )

    assert response_put.status_code == HTTPStatus.OK
    data = response_put.json()
    assert data['id'] == registro_id
    assert data['notes'] == 'Depois do update'
    assert data['symptoms'][0]['id'] == '3'
    assert data['symptoms'][0]['intensity'] == 9


@pytest.mark.asyncio
async def test_update_registro_diario_outro_usuario(client, other_token, token):
    # Criar um registro com o primeiro usuário
    response_post = await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '2', 'intensidade': 5}],
            'regioes_dor': [{'id': '10', 'intensidade': 3}],
            'observacoes': 'Dono original',
            'data_hora': datetime.now().isoformat(),
        },
    )
    registro_id = response_post.json()['id']

    # Tentar atualizar com outro usuário
    response_put = await client.put(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {other_token}'},
        json={
            'symptoms': [{'id': '3', 'intensity': 9}],
            'painRegions': [{'id': '15', 'intensity': 4}],
            'notes': 'Tentativa de roubo',
            'timestamp': datetime.now().isoformat(),
        },
    )

    assert response_put.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.asyncio
async def test_delete_registro_diario(client, token, paciente):
    # Criar um registro primeiro
    response_post = await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '2', 'intensidade': 5}],
            'regioes_dor': [{'id': '10', 'intensidade': 3}],
            'observacoes': 'Para deletar',
            'data_hora': datetime.now().isoformat(),
        },
    )
    registro_id = response_post.json()['id']

    # Deletar o registro
    response_delete = await client.delete(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response_delete.status_code == HTTPStatus.NO_CONTENT

    # Tentar buscar o registro deletado
    response_get = await client.get(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response_get.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.asyncio
async def test_delete_registro_diario_outro_usuario(client, other_token, token):
    # Criar um registro com o primeiro usuário
    response_post = await client.post(
        '/registros-diarios/pt',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'sintomas': [{'id': '2', 'intensidade': 5}],
            'regioes_dor': [{'id': '10', 'intensidade': 3}],
            'observacoes': 'Dono original',
            'data_hora': datetime.now().isoformat(),
        },
    )
    registro_id = response_post.json()['id']

    # Tentar deletar com outro usuário
    response_delete = await client.delete(
        f'/registros-diarios/{registro_id}',
        headers={'Authorization': f'Bearer {other_token}'},
    )

    assert response_delete.status_code == HTTPStatus.NOT_FOUND
