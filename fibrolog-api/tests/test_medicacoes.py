from http import HTTPStatus

import pytest
from httpx import AsyncClient

from fibrolog_api.models import Medicacao, Paciente


@pytest.fixture
def medicacao_payload():
    return {
        'nome': 'Dipirona',
        'dosagem': '500mg',
        'frequencia': 'a cada 6 horas',
    }


@pytest.mark.asyncio
async def test_create_medicacao(
    client: AsyncClient,
    paciente: Paciente,
    token: str,
    medicacao_payload: dict,
):
    response = await client.post(
        f'/medicacoes/{paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
        json=medicacao_payload,
    )
    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['nome'] == medicacao_payload['nome']
    assert data['dosagem'] == medicacao_payload['dosagem']
    assert data['frequencia'] == medicacao_payload['frequencia']
    assert data['id'] is not None


@pytest.mark.asyncio
async def test_create_medicacao_for_other_paciente(
    client: AsyncClient,
    other_paciente: Paciente,
    token: str,
    medicacao_payload: dict,
):
    response = await client.post(
        f'/medicacoes/{other_paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
        json=medicacao_payload,
    )
    assert response.status_code == HTTPStatus.FORBIDDEN


@pytest.mark.asyncio
async def test_list_medicacoes(
    client: AsyncClient, paciente: Paciente, token: str, session
):
    medicacao = Medicacao(
        nome='Ibuprofeno',
        dosagem='400mg',
        frequencia='a cada 8 horas',
        paciente_id=paciente.id,
    )
    session.add(medicacao)
    await session.commit()

    response = await client.get(
        f'/medicacoes/{paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert len(data['medicacoes']) == 1
    assert data['medicacoes'][0]['nome'] == 'Ibuprofeno'


@pytest.mark.asyncio
async def test_list_medicacoes_for_other_paciente(
    client: AsyncClient, other_paciente: Paciente, token: str
):
    response = await client.get(
        f'/medicacoes/{other_paciente.id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.FORBIDDEN


@pytest.mark.asyncio
async def test_get_medicacao(
    client: AsyncClient, paciente: Paciente, token: str, session
):
    medicacao = Medicacao(
        nome='Remedio Teste',
        dosagem='10mg',
        frequencia='1x ao dia',
        paciente_id=paciente.id,
    )
    session.add(medicacao)
    await session.commit()
    await session.refresh(medicacao)

    response = await client.get(
        f'/medicacoes/medicacao/{medicacao.id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['nome'] == 'Remedio Teste'
    assert data['dosagem'] == '10mg'
    assert data['frequencia'] == '1x ao dia'


@pytest.mark.asyncio
async def test_get_medicacao_for_other_paciente(
    client: AsyncClient, other_paciente: Paciente, token: str, session
):
    medicacao = Medicacao(
        nome='Outro Remedio',
        dosagem='10mg',
        frequencia='1x ao dia',
        paciente_id=other_paciente.id,
    )
    session.add(medicacao)
    await session.commit()
    await session.refresh(medicacao)

    response = await client.get(
        f'/medicacoes/medicacao/{medicacao.id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.FORBIDDEN


@pytest.mark.asyncio
async def test_get_non_existing_medicacao(client: AsyncClient, token: str):
    response = await client.get(
        '/medicacoes/medicacao/999',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.asyncio
async def test_update_medicacao(
    client: AsyncClient, paciente: Paciente, token: str, session
):
    medicacao = Medicacao(
        nome='Paracetamol',
        dosagem='750mg',
        frequencia='a cada 8 horas',
        paciente_id=paciente.id,
    )
    session.add(medicacao)
    await session.commit()
    await session.refresh(medicacao)

    updated_payload = {
        'nome': 'Paracetamol Forte',
        'dosagem': '1g',
        'frequencia': 'a cada 6 horas',
    }

    response = await client.put(
        f'/medicacoes/{medicacao.id}',
        headers={'Authorization': f'Bearer {token}'},
        json=updated_payload,
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['nome'] == updated_payload['nome']
    assert data['dosagem'] == updated_payload['dosagem']
    assert data['frequencia'] == updated_payload['frequencia']


@pytest.mark.asyncio
async def test_update_medicacao_for_other_paciente(
    client: AsyncClient,
    other_paciente: Paciente,
    token: str,
    session,
    medicacao_payload: dict,
):
    medicacao = Medicacao(
        nome='Outro Remedio',
        dosagem='10mg',
        frequencia='1x ao dia',
        paciente_id=other_paciente.id,
    )
    session.add(medicacao)
    await session.commit()
    await session.refresh(medicacao)

    response = await client.put(
        f'/medicacoes/{medicacao.id}',
        headers={'Authorization': f'Bearer {token}'},
        json=medicacao_payload,
    )
    assert response.status_code == HTTPStatus.FORBIDDEN


@pytest.mark.asyncio
async def test_update_non_existing_medicacao(
    client: AsyncClient, token: str, medicacao_payload: dict
):
    response = await client.put(
        '/medicacoes/999',
        headers={'Authorization': f'Bearer {token}'},
        json=medicacao_payload,
    )
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.asyncio
async def test_delete_medicacao(
    client: AsyncClient, paciente: Paciente, token: str, session
):
    medicacao = Medicacao(
        nome='Deletar Remedio',
        dosagem='1mg',
        frequencia='1x',
        paciente_id=paciente.id,
    )
    session.add(medicacao)
    await session.commit()
    await session.refresh(medicacao)

    response = await client.delete(
        f'/medicacoes/{medicacao.id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.NO_CONTENT

    result = await session.get(Medicacao, medicacao.id)
    assert result is None


@pytest.mark.asyncio
async def test_delete_medicacao_for_other_paciente(
    client: AsyncClient, other_paciente: Paciente, token: str, session
):
    medicacao = Medicacao(
        nome='Nao Deletar',
        dosagem='100mg',
        frequencia='sempre',
        paciente_id=other_paciente.id,
    )
    session.add(medicacao)
    await session.commit()
    await session.refresh(medicacao)

    response = await client.delete(
        f'/medicacoes/{medicacao.id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.FORBIDDEN


@pytest.mark.asyncio
async def test_delete_non_existing_medicacao(client: AsyncClient, token: str):
    response = await client.delete(
        '/medicacoes/999',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.NOT_FOUND
