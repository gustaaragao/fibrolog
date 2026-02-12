from http import HTTPStatus

import pytest


@pytest.mark.asyncio
async def test_get_me_success(client, token):
    response = await client.get(
        '/pacientes/me', headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert 'nome' in data
    assert 'email' in data
    assert 'celular' in data


@pytest.mark.asyncio
async def test_get_me_unauthorized(client):
    response = await client.get('/pacientes/me')
    assert response.status_code == HTTPStatus.UNAUTHORIZED


@pytest.mark.asyncio
async def test_update_paciente_celular_valid(client, token, paciente):
    celular = '(11) 98765-4321'
    response = await client.patch(
        f'/pacientes/{paciente.id}',
        json={'celular': celular},
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json()['celular'] == celular


@pytest.mark.asyncio
async def test_update_paciente_celular_only_digits(client, token, paciente):
    celular = '11987654321'
    response = await client.patch(
        f'/pacientes/{paciente.id}',
        json={'celular': celular},
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json()['celular'] == celular


@pytest.mark.asyncio
async def test_update_paciente_celular_invalid(client, token, paciente):
    celular = '123'
    response = await client.patch(
        f'/pacientes/{paciente.id}',
        json={'celular': celular},
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert 'Número de celular inválido' in response.json()['detail'][0]['msg']
