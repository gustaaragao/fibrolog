from http import HTTPStatus

import pytest


@pytest.mark.asyncio
async def test_create_support_contact(client, token):
    response = await client.post(
        '/rede-apoio/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'João Silva',
            'email': 'joao@example.com',
            'telefone': '11999999999',
            'parentesco': 'Irmão',
        },
    )
    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['nome'] == 'João Silva'
    assert data['telefone'] == '11999999999'
    assert 'id' in data


@pytest.mark.asyncio
async def test_create_support_contact_duplicate_phone(client, token):
    # Criar o primeiro
    await client.post(
        '/rede-apoio/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'João Silva',
            'email': 'joao@example.com',
            'telefone': '11999999999',
            'parentesco': 'Irmão',
        },
    )

    # Tentar criar outro com o mesmo telefone
    response = await client.post(
        '/rede-apoio/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'João Segundo',
            'email': 'joao2@example.com',
            'telefone': '11999999999',
            'parentesco': 'Amigo',
        },
    )
    assert response.status_code == HTTPStatus.CONFLICT


@pytest.mark.asyncio
async def test_list_support_contacts(client, token):
    await client.post(
        '/rede-apoio/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'Maria',
            'email': 'maria@example.com',
            'telefone': '11988888888',
            'parentesco': 'Mãe',
        },
    )

    response = await client.get(
        '/rede-apoio/',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert 'contatos' in data
    assert len(data['contatos']) >= 1
    assert data['contatos'][0]['nome'] == 'Maria'


@pytest.mark.asyncio
async def test_delete_support_contact(client, token):
    create_res = await client.post(
        '/rede-apoio/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'Deletar',
            'email': 'del@example.com',
            'telefone': '11977777777',
            'parentesco': 'Outro',
        },
    )
    contact_id = create_res.json()['id']

    response = await client.delete(
        f'/rede-apoio/{contact_id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.NO_CONTENT


@pytest.mark.asyncio
async def test_ownership_enforcement_contact(client, token, other_token):
    # Paciente 1 cria contato
    create_res = await client.post(
        '/rede-apoio/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'Meu Contato',
            'email': 'meu@example.com',
            'telefone': '11966666666',
            'parentesco': 'Pai',
        },
    )
    contact_id = create_res.json()['id']

    # Paciente 2 tenta deletar
    response = await client.delete(
        f'/rede-apoio/{contact_id}',
        headers={'Authorization': f'Bearer {other_token}'},
    )
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.asyncio
async def test_notify_support_network_success(client, token):
    # Criar contato primeiro
    await client.post(
        '/rede-apoio/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'nome': 'Apoio',
            'email': 'apoio@example.com',
            'telefone': '11955555555',
            'parentesco': 'Amigo',
        },
    )

    response = await client.post(
        '/rede-apoio/notificar',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    assert 'Notificações enviadas' in response.json()['message']


@pytest.mark.asyncio
async def test_notify_support_network_empty(client, token):
    # Sem contatos cadastrados
    response = await client.post(
        '/rede-apoio/notificar',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert 'não possui contatos' in response.json()['detail']
