from http import HTTPStatus

import pytest


@pytest.mark.asyncio
async def test_create_paciente(client):
    response = await client.post(
        '/pacientes/',
        json={
            'nome': 'Gustavo',
            'email': 'gustavo@example.com',
            'password': 'Senha@123',
        },
    )

    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['nome'] == 'Gustavo'
    assert data['email'] == 'gustavo@example.com'
    assert 'id' in data
    assert 'created_at' in data
    assert 'updated_at' in data
    assert 'password' not in data  # Senha não deve ser retornada


@pytest.mark.asyncio
async def test_create_paciente_duplicate_email(client):
    # Criar primeiro paciente
    await client.post(
        '/pacientes/',
        json={
            'nome': 'Gustavo',
            'email': 'gustavo@example.com',
            'password': 'Senha@123',
        },
    )

    # Tentar criar outro com mesmo email
    response = await client.post(
        '/pacientes/',
        json={
            'nome': 'João',
            'email': 'gustavo@example.com',
            'password': 'Outra@123',
        },
    )

    assert response.status_code == HTTPStatus.CONFLICT
    assert response.json()['detail'] == 'Email já cadastrado'


@pytest.mark.asyncio
async def test_create_paciente_invalid_password(client):
    response = await client.post(
        '/pacientes/',
        json={
            'nome': 'Gustavo',
            'email': 'gustavo.invalid@example.com',
            'password': 'weak',
        },
    )
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_get_pacientes_empty(client):
    response = await client.get('/pacientes/')

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert 'pacientes' in data
    assert data['pacientes'] == []


@pytest.mark.asyncio
async def test_get_pacientes(client):
    # Criar alguns pacientes
    await client.post(
        '/pacientes/',
        json={
            'nome': 'Gustavo',
            'email': 'gustavo@example.com',
            'password': 'Senha@123',
        },
    )
    await client.post(
        '/pacientes/',
        json={
            'nome': 'João',
            'email': 'joao@example.com',
            'password': 'Senha@456',
        },
    )

    response = await client.get('/pacientes/')

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert 'pacientes' in data
    assert data['pacientes'][0]['nome'] == 'Gustavo'
    assert data['pacientes'][1]['nome'] == 'João'


@pytest.mark.asyncio
async def test_get_pacientes_with_pagination(client):
    # Criar vários pacientes
    for i in range(5):
        await client.post(
            '/pacientes/',
            json={
                'nome': f'Paciente {i}',
                'email': f'paciente{i}@example.com',
                'password': 'Senha@123',
            },
        )

    # Testar paginação
    response = await client.get('/pacientes/?offset=1&limit=2')

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert 'pacientes' in data
    assert data['pacientes'][0]['nome'] == 'Paciente 1'
    assert data['pacientes'][1]['nome'] == 'Paciente 2'


@pytest.mark.asyncio
async def test_get_paciente_by_id(client):
    # Criar paciente
    create_response = await client.post(
        '/pacientes/',
        json={
            'nome': 'Gustavo',
            'email': 'gustavo@example.com',
            'password': 'Senha@123',
        },
    )
    paciente_id = create_response.json()['id']

    # Buscar paciente por ID
    response = await client.get(f'/pacientes/{paciente_id}')

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['id'] == paciente_id
    assert data['nome'] == 'Gustavo'
    assert data['email'] == 'gustavo@example.com'


@pytest.mark.asyncio
async def test_get_paciente_not_found(client):
    response = await client.get('/pacientes/999')

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json()['detail'] == 'Paciente não encontrado'


@pytest.mark.asyncio
async def test_update_paciente(client, paciente, token):
    # Atualizar paciente
    response = await client.put(
        f'/pacientes/{paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'Gustavo Atualizado',
            'email': 'gustavo.novo@example.com',
            'password': 'Nova@123',
        },
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['nome'] == 'Gustavo Atualizado'
    assert data['email'] == 'gustavo.novo@example.com'


@pytest.mark.asyncio
async def test_update_paciente_wrong_user(client, other_paciente, token):
    # Tentar atualizar outro paciente
    response = await client.put(
        f'/pacientes/{other_paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'Tentando Atualizar',
            'email': 'tentando@example.com',
            'password': 'Senha@123',
        },
    )

    assert response.status_code == HTTPStatus.FORBIDDEN
    assert response.json()['detail'] == 'Permissões insuficientes'


@pytest.mark.asyncio
async def test_update_paciente_duplicate_email(
    client, paciente, other_paciente, token
):
    # Tentar atualizar com email já existente
    response = await client.put(
        f'/pacientes/{paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'Gustavo',
            'email': other_paciente.email,
            'password': 'Senha@123',
        },
    )

    assert response.status_code == HTTPStatus.CONFLICT
    assert response.json()['detail'] == 'Email já existe'


@pytest.mark.asyncio
async def test_delete_paciente(client, paciente, token):
    # Deletar paciente
    response = await client.delete(
        f'/pacientes/{paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    assert response.json()['message'] == 'Paciente excluído'

    # Verificar que foi deletado
    get_response = await client.get(f'/pacientes/{paciente.id}')
    assert get_response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.asyncio
async def test_delete_paciente_wrong_user(client, other_paciente, token):
    # Tentar deletar outro paciente
    response = await client.delete(
        f'/pacientes/{other_paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.FORBIDDEN
    assert response.json()['detail'] == 'Permissões insuficientes'
