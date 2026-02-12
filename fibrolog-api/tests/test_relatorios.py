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
async def test_gerar_relatorio_sucesso(  # noqa: PLR0915, PLR0914
    client, token, paciente, session
):
    """Testa geração completa de relatório.

    Note: Complex test with comprehensive data setup is acceptable.
    """
    """Testa geração completa de relatório.

    Note: Complex test with comprehensive data setup is acceptable.
    """
    # 1. Criar dados de teste (Registros Diários)
    hoje = datetime.now()
    ontem = hoje - timedelta(days=1)

    # Registro de Hoje
    r_hoje = RegistroDiario(
        paciente_id=paciente.id,
        tipo_registro='diario',
        observacoes='Notas hoje',
    )
    r_hoje.data_hora = hoje
    session.add(r_hoje)
    await session.flush()

    # Dor
    session.add(
        RegistroSintoma(registro_id=r_hoje.id, sintoma_id='1', intensidade=8)
    )
    # Sono
    session.add(
        RegistroSintoma(registro_id=r_hoje.id, sintoma_id='3', intensidade=5)
    )
    # Fadiga
    session.add(
        RegistroSintoma(registro_id=r_hoje.id, sintoma_id='4', intensidade=6)
    )
    # Emoção: IRRITADO
    session.add(
        RegistroSintoma(registro_id=r_hoje.id, sintoma_id='5', intensidade=2)
    )
    session.add(
        RegistroRegiaoDor(registro_id=r_hoje.id, regiao_id='10', intensidade=5)
    )

    # Registro de Ontem
    r_ontem = RegistroDiario(
        paciente_id=paciente.id,
        tipo_registro='diario',
        observacoes='Notas ontem',
    )
    r_ontem.data_hora = ontem
    session.add(r_ontem)
    await session.flush()

    # Dor
    session.add(
        RegistroSintoma(registro_id=r_ontem.id, sintoma_id='1', intensidade=4)
    )
    # Sono
    session.add(
        RegistroSintoma(registro_id=r_ontem.id, sintoma_id='3', intensidade=7)
    )
    # Fadiga
    session.add(
        RegistroSintoma(registro_id=r_ontem.id, sintoma_id='4', intensidade=3)
    )
    # Emoção: FELIZ
    session.add(
        RegistroSintoma(registro_id=r_ontem.id, sintoma_id='5', intensidade=0)
    )
    session.add(
        RegistroRegiaoDor(
            registro_id=r_ontem.id, regiao_id='10', intensidade=3
        )
    )
    session.add(
        RegistroRegiaoDor(
            registro_id=r_ontem.id, regiao_id='20', intensidade=4
        )
    )

    # 2. Criar Registro de Crise
    crise = RegistroCrise(
        paciente_id=paciente.id,
        tipo_registro='crise',
        intensidade_dor=9,
        contexto='Contexto da crise',
        duracao='2h',
        sintomas_relatados='Dor de cabeça',
        observacoes='Obs da crise',
    )
    crise.data_hora = hoje - timedelta(hours=2)
    session.add(crise)

    await session.commit()

    # 3. Chamar o endpoint
    data_inicio = (hoje - timedelta(days=2)).isoformat()
    data_fim = (hoje + timedelta(days=1)).isoformat()

    response = await client.get(
        f'/relatorios/gerar?data_inicio={data_inicio}&data_fim={data_fim}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()

    media_dor_esperada = 6.0  # (8+4)/2
    pico_dor_esperado = 8
    dias_intensos_esperados = 1
    emocoes_esperadas = 1
    regioes_frequentes = 2
    count_regiao_10 = 2
    timeline_esperado = 2
    crises_esperadas = 1
    intensidade_crise = 9

    assert data['patientName'] == paciente.nome
    assert data['generalSummary']['averagePain'] == media_dor_esperada
    assert data['generalSummary']['peakPain'] == pico_dor_esperado
    assert data['generalSummary']['intensePainDays'] == dias_intensos_esperados
    assert (
        data['generalSummary']['emotionFrequency']['IRRITADO']
        == emocoes_esperadas
    )
    assert (
        data['generalSummary']['emotionFrequency']['FELIZ']
        == emocoes_esperadas
    )

    assert len(data['frequentPainRegions']) == regioes_frequentes
    assert data['frequentPainRegions'][0]['id'] == '10'
    assert data['frequentPainRegions'][0]['count'] == count_regiao_10

    assert len(data['symptomTimeline']) == timeline_esperado
    assert len(data['crisisHistory']) == crises_esperadas
    assert data['crisisHistory'][0]['intensity'] == intensidade_crise


@pytest.mark.asyncio
async def test_gerar_relatorio_periodo_vazio(client, token, paciente):
    data_inicio = '2020-01-01T00:00:00'
    data_fim = '2020-01-31T23:59:59'

    response = await client.get(
        f'/relatorios/gerar?data_inicio={data_inicio}&data_fim={data_fim}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['generalSummary']['averagePain'] == 0
    assert len(data['symptomTimeline']) == 0
    assert len(data['crisisHistory']) == 0


@pytest.mark.asyncio
async def test_gerar_relatorio_nao_autenticado(client):
    url = (
        '/relatorios/gerar?data_inicio=2024-01-01T00:00:00'
        '&data_fim=2024-01-31T00:00:00'
    )
    response = await client.get(url)
    assert response.status_code == HTTPStatus.UNAUTHORIZED
