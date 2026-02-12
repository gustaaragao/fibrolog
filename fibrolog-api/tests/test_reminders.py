from datetime import datetime
from http import HTTPStatus

import pytest

# Constantes para testes de lembretes de medicação
MEDICATION_INTERVAL_HOURS = 8


@pytest.mark.asyncio
async def test_create_general_reminder(client, token):
    response = await client.post(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'titulo': 'Beber água',
            'tipo': 'geral',
            'hora': 10,
            'minuto': 30,
        },
    )
    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['titulo'] == 'Beber água'
    assert data['tipo'] == 'geral'
    assert 'id' in data


@pytest.mark.asyncio
async def test_create_medication_reminder(client, token):
    response = await client.post(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'titulo': 'Paracetamol',
            'tipo': 'medicamento',
            'hora': 8,
            'minuto': 0,
            'dosagem': '500mg',
            'intervalo': 8,
        },
    )
    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['dosagem'] == '500mg'
    assert data['intervalo'] == MEDICATION_INTERVAL_HOURS


@pytest.mark.asyncio
async def test_create_medication_reminder_missing_fields(client, token):
    response = await client.post(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'titulo': 'Paracetamol',
            'tipo': 'medicamento',
            'hora': 8,
            'minuto': 0,
            # missing dosagem/intervalo
        },
    )
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_create_exam_reminder(client, token):
    response = await client.post(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'titulo': 'Ressonância',
            'tipo': 'exame',
            'hora': 14,
            'minuto': 0,
            'data_exame': datetime(2026, 5, 20, 14, 0).isoformat(),
        },
    )
    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert 'data_exame' in data


@pytest.mark.asyncio
async def test_list_reminders(client, token):
    # Criar um lembrete primeiro
    await client.post(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
        json={'titulo': 'L1', 'tipo': 'geral', 'hora': 1, 'minuto': 0},
    )

    response = await client.get(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert len(data) >= 1
    assert data[0]['titulo'] == 'L1'


@pytest.mark.asyncio
async def test_update_reminder(client, token):
    # Criar
    create_res = await client.post(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
        json={'titulo': 'L1', 'tipo': 'geral', 'hora': 1, 'minuto': 0},
    )
    reminder_id = create_res.json()['id']

    # Atualizar
    patch_res = await client.patch(
        f'/pacientes/lembretes/{reminder_id}',
        headers={'Authorization': f'Bearer {token}'},
        json={'ativo': False, 'titulo': 'L1 Updated'},
    )
    assert patch_res.status_code == HTTPStatus.OK
    data = patch_res.json()
    assert data['ativo'] is False
    assert data['titulo'] == 'L1 Updated'


@pytest.mark.asyncio
async def test_delete_reminder(client, token):
    # Criar
    create_res = await client.post(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
        json={'titulo': 'L1', 'tipo': 'geral', 'hora': 1, 'minuto': 0},
    )
    reminder_id = create_res.json()['id']

    # Deletar
    delete_res = await client.delete(
        f'/pacientes/lembretes/{reminder_id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert delete_res.status_code == HTTPStatus.NO_CONTENT

    # Verificar se sumiu
    get_res = await client.get(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert all(r['id'] != reminder_id for r in get_res.json())


@pytest.mark.asyncio
async def test_ownership_enforcement(client, token, other_token):
    # Paciente 1 cria lembrete
    create_res = await client.post(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'titulo': 'Meu lembrete',
            'tipo': 'geral',
            'hora': 1,
            'minuto': 0,
        },
    )
    reminder_id = create_res.json()['id']

    # Paciente 2 tenta acessar
    response = await client.patch(
        f'/pacientes/lembretes/{reminder_id}',
        headers={'Authorization': f'Bearer {other_token}'},
        json={'titulo': 'Hacked'},
    )
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.asyncio
async def test_client_generated_id(client, token):
    custom_id = 'my-custom-uuid-123'
    response = await client.post(
        '/pacientes/lembretes/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'id': custom_id,
            'titulo': 'Lembrete com ID custom',
            'tipo': 'geral',
            'hora': 12,
            'minuto': 0,
        },
    )
    assert response.status_code == HTTPStatus.CREATED
    assert response.json()['id'] == custom_id
