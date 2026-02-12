from datetime import datetime, timedelta
from http import HTTPStatus

import pytest

from fibrolog_api.models import (
    RegistroCrise,
    RegistroDiario,
    RegistroRegiaoDor,
    RegistroSintoma,
)


@pytest.mark.asyncio
async def test_get_dashboard_statistics_sucesso(client, token, paciente, session):
    # 1. Criar dados de teste
    hoje = datetime.now()
    ontem = hoje - timedelta(days=1)
    anteontem = hoje - timedelta(days=2)

    # Registro de Hoje
    r_hoje = RegistroDiario(paciente_id=paciente.id, tipo_registro='diario', observacoes='Hoje')
    r_hoje.data_hora = hoje
    session.add(r_hoje)
    await session.flush()
    session.add(RegistroSintoma(registro_id=r_hoje.id, sintoma_id='1', intensidade=8))  # Dor
    session.add(RegistroSintoma(registro_id=r_hoje.id, sintoma_id='4', intensidade=6))  # Fadiga
    session.add(RegistroRegiaoDor(registro_id=r_hoje.id, regiao_id='10', intensidade=5))

    # Registro de Ontem
    r_ontem = RegistroDiario(paciente_id=paciente.id, tipo_registro='diario', observacoes='Ontem')
    r_ontem.data_hora = ontem
    session.add(r_ontem)
    await session.flush()
    session.add(RegistroSintoma(registro_id=r_ontem.id, sintoma_id='1', intensidade=4))  # Dor
    session.add(RegistroSintoma(registro_id=r_ontem.id, sintoma_id='4', intensidade=7))  # Fadiga
    session.add(RegistroRegiaoDor(registro_id=r_ontem.id, regiao_id='10', intensidade=3))

    # Registro de Crise
    crise = RegistroCrise(
        paciente_id=paciente.id,
        tipo_registro='crise',
        intensidade_dor=9,
        contexto='Contexto',
        duracao='1h'
    )
    crise.data_hora = hoje - timedelta(hours=1)
    session.add(crise)

    await session.commit()

    # 2. Chamar o endpoint
    response = await client.get(
        '/estatisticas/dashboard',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()

    assert data['total_registros'] == 2
    assert data['total_crises'] == 1
    assert data['dias_ativos'] == 2
    assert data['media_intensidade_dor'] == 4.0  # (5+3)/2
    assert data['sintoma_mais_frequente'] in ['Dor', 'Fadiga']  # Ambos tem 2
    assert data['sequencia_dias_consecutivos'] == 2
    # taxa_adesao depende de created_at, que no conftest deve ser func.now()
    assert data['taxa_adesao'] is not None


@pytest.mark.asyncio
async def test_get_dashboard_statistics_novo_paciente(client, token, paciente):
    response = await client.get(
        '/estatisticas/dashboard',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()

    assert data['total_registros'] == 0
    assert data['total_crises'] == 0
    assert data['dias_ativos'] == 0
    assert data['media_intensidade_dor'] is None
    assert data['sintoma_mais_frequente'] is None
    assert data['sequencia_dias_consecutivos'] == 0


@pytest.mark.asyncio
async def test_get_dashboard_statistics_nao_autenticado(client):
    response = await client.get('/estatisticas/dashboard')
    assert response.status_code == HTTPStatus.UNAUTHORIZED


@pytest.mark.asyncio
async def test_sequencia_dias_com_gaps(client, token, paciente, session):
    # Mon, Tue, Thu
    hoje = datetime.now()
    d1 = hoje  # Thu
    d2 = hoje - timedelta(days=2)  # Tue
    d3 = hoje - timedelta(days=3)  # Mon

    for d in [d1, d2, d3]:
        reg = RegistroDiario(paciente_id=paciente.id, tipo_registro='diario')
        reg.data_hora = d
        session.add(reg)

    await session.commit()

    response = await client.get(
        '/estatisticas/dashboard',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    # Maior sequência é 2 (Mon-Tue)
    assert data['sequencia_dias_consecutivos'] == 2
