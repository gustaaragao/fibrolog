from http import HTTPStatus

import pytest


@pytest.mark.asyncio
async def test_get_token(client, paciente):
    response = await client.post(
        '/auth/token',
        data={'username': paciente.email, 'password': paciente.password_plain},
    )
    token = response.json()

    assert response.status_code == HTTPStatus.OK
    assert 'access_token' in token
    assert token['token_type'] == 'bearer'


@pytest.mark.asyncio
async def test_get_token_invalid_credentials(client, paciente):
    response = await client.post(
        '/auth/token',
        data={'username': paciente.email, 'password': 'wrong_password'},
    )

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json()['detail'] == 'Email ou senha incorretos'


@pytest.mark.asyncio
async def test_get_token_inexistent_user(client):
    response = await client.post(
        '/auth/token',
        data={'username': 'nonexistent@example.com', 'password': 'password'},
    )

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json()['detail'] == 'Email ou senha incorretos'
