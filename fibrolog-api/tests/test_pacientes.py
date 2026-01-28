from http import HTTPStatus

import pytest


@pytest.mark.asyncio
async def test_create_paciente(client):
    response = await client.post(
        '/pacientes/',
        json={
            'nome': 'Gustavo Silva',
            'email': 'gustavo@example.com',
            'password': 'Senha@123',
            'data_nascimento': '1990-05-15T00:00:00',
            'sexo': 'M',
            'data_diagnostico': '2020-03-10T00:00:00',
            'medicacoes': 'Pregabalina 75mg (2x/dia)',
        },
    )

    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['nome'] == 'Gustavo Silva'
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
            'nome': 'Ana Costa',
            'email': 'ana@example.com',
            'password': 'Senha@123',
            'data_nascimento': '1992-07-20T00:00:00',
            'sexo': 'F',
        },
    )

    # Tentar criar outro com mesmo email
    response = await client.post(
        '/pacientes/',
        json={
            'nome': 'João Pedro',
            'email': 'ana@example.com',
            'password': 'Outra@123',
            'data_nascimento': '1988-12-05T00:00:00',
            'sexo': 'M',
        },
    )

    assert response.status_code == HTTPStatus.CONFLICT
    assert response.json()['detail'] == 'Email já cadastrado'


@pytest.mark.asyncio
async def test_create_paciente_invalid_password(client):
    response = await client.post(
        '/pacientes/',
        json={
            'nome': 'Carlos Alberto',
            'email': 'carlos@example.com',
            'password': 'fraca',
            'data_nascimento': '1987-03-12T00:00:00',
            'sexo': 'M',
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
            'nome': 'Roberto Lima',
            'email': 'roberto@example.com',
            'password': 'Senha@123',
            'data_nascimento': '1975-11-30T00:00:00',
            'sexo': 'M',
            'data_diagnostico': '2015-06-20T00:00:00',
            'medicacoes': 'Gabapentina 300mg',
        },
    )
    await client.post(
        '/pacientes/',
        json={
            'nome': 'Paula Oliveira',
            'email': 'paula@example.com',
            'password': 'Senha@456',
            'data_nascimento': '1982-04-18T00:00:00',
            'sexo': 'F',
            'data_diagnostico': '2019-02-14T00:00:00',
            'medicacoes': 'Pregabalina 150mg',
        },
    )

    response = await client.get('/pacientes/')

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert 'pacientes' in data
    assert data['pacientes'][0]['nome'] == 'Roberto Lima'
    assert data['pacientes'][1]['nome'] == 'Paula Oliveira'


@pytest.mark.asyncio
async def test_get_pacientes_with_pagination(client):
    # Criar vários pacientes
    sexos = ['M', 'F', 'M', 'F', 'M']
    for i in range(5):
        await client.post(
            '/pacientes/',
            json={
                'nome': f'Paciente {i + 1}',
                'email': f'paciente{i}@example.com',
                'password': 'Senha@123',
                'data_nascimento': f'198{i}-0{i + 1}-15T00:00:00',
                'sexo': sexos[i],
            },
        )

    # Testar paginação
    response = await client.get('/pacientes/?offset=1&limit=2')

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert 'pacientes' in data
    assert data['pacientes'][0]['nome'] == 'Paciente 2'
    assert data['pacientes'][1]['nome'] == 'Paciente 3'


@pytest.mark.asyncio
async def test_get_paciente_by_id(client):
    # Criar paciente
    create_response = await client.post(
        '/pacientes/',
        json={
            'nome': 'Fernanda Rocha',
            'email': 'fernanda@example.com',
            'password': 'Senha@123',
            'data_nascimento': '1993-09-08T00:00:00',
            'sexo': 'F',
            'data_diagnostico': '2021-05-25T00:00:00',
            'medicacoes': 'Amitriptilina 25mg (noite)',
        },
    )
    paciente_id = create_response.json()['id']

    # Buscar paciente por ID
    response = await client.get(f'/pacientes/{paciente_id}')

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['id'] == paciente_id
    assert data['nome'] == 'Fernanda Rocha'
    assert data['email'] == 'fernanda@example.com'


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
            'nome': 'Gustavo Silva Pereira',
            'email': 'gustavo.silva@example.com',
            'password': 'NovaSenha@123',
            'data_nascimento': '1990-05-15T00:00:00',
            'sexo': 'M',
            'data_diagnostico': '2020-03-10T00:00:00',
            'medicacoes': 'Pregabalina 150mg (2x/dia), Duloxetina 60mg',
        },
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['nome'] == 'Gustavo Silva Pereira'
    assert data['email'] == 'gustavo.silva@example.com'


@pytest.mark.asyncio
async def test_update_paciente_wrong_user(client, other_paciente, token):
    # Tentar atualizar outro paciente
    response = await client.put(
        f'/pacientes/{other_paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'Tentando Atualizar Maria',
            'email': 'tentando@example.com',
            'password': 'Senha@789',
            'data_nascimento': '1985-08-22T00:00:00',
            'sexo': 'F',
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
            'nome': 'Gustavo Silva',
            'email': other_paciente.email,
            'password': 'Senha@123',
            'data_nascimento': '1990-05-15T00:00:00',
            'sexo': 'M',
        },
    )

    assert response.status_code == HTTPStatus.CONFLICT
    assert response.json()['detail'] == 'Email já existe'


@pytest.mark.asyncio
async def test_patch_paciente(client, paciente, token):
    response = await client.patch(
        f'/pacientes/{paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'Gustavo S. Pereira',
            'medicacoes': 'Nenhuma medicação no momento',
        },
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['nome'] == 'Gustavo S. Pereira'
    assert data['medicacoes'] == 'Nenhuma medicação no momento'
    assert data['email'] == paciente.email  # Verificar que não mudou


@pytest.mark.asyncio
async def test_patch_paciente_wrong_user(client, other_paciente, token):
    response = await client.patch(
        f'/pacientes/{other_paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={'nome': 'Nome Invasor'},
    )
    assert response.status_code == HTTPStatus.FORBIDDEN
    assert response.json()['detail'] == 'Permissões insuficientes'


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
