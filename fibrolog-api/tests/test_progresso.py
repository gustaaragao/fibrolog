from datetime import datetime, timedelta
from http import HTTPStatus

import pytest

from fibrolog_api.models import (
    Registro,
    RegistroCrise,
    RegistroDiario,
    RegistroRegiaoDor,
)

pytestmark = pytest.mark.asyncio


async def test_get_progresso_sem_dados(client, token):
    """Testa endpoint de progresso sem dados registrados."""
    response = await client.get(
        '/estatisticas/progresso',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()

    assert 'media_dor_semana' in data
    assert 'dias_registrados_mes' in data
    assert 'crises_mes' in data
    assert 'grafico_dor_semanal' in data
    assert 'insights' in data

    # Com dados vazios
    assert data['media_dor_semana']['valor'] == 0.0
    assert data['dias_registrados_mes']['valor'] == 0
    assert data['crises_mes']['valor'] == 0
    assert len(data['grafico_dor_semanal']) == 7


async def test_get_progresso_com_dados(client, token, paciente, session):
    """Testa endpoint de progresso com dados registrados."""
    hoje = datetime.now()

    # Criar registros dos últimos 7 dias
    for i in range(7):
        dia = hoje - timedelta(days=i)

        # Criar registro base
        registro = Registro(
            tipo_registro='diario',
            paciente_id=paciente.id,
            data_hora=dia,
        )
        session.add(registro)
        await session.flush()

        # Criar registro diário
        registro_diario = RegistroDiario(
            id=registro.id,
            observacoes=f'Registro dia {i}',
        )
        session.add(registro_diario)
        await session.flush()

        # Adicionar região de dor
        regiao_dor = RegistroRegiaoDor(
            registro_id=registro_diario.id,
            regiao_id='1',
            intensidade=5 + i % 3,  # Varia entre 5, 6, 7
        )
        session.add(regiao_dor)

    # Criar crises no mês atual
    for i in range(3):
        dia_crise = hoje - timedelta(days=i * 5)
        registro_crise_base = Registro(
            tipo_registro='crise',
            paciente_id=paciente.id,
            data_hora=dia_crise,
        )
        session.add(registro_crise_base)
        await session.flush()

        crise = RegistroCrise(
            id=registro_crise_base.id,
            intensidade_dor=8,
            contexto='Contexto da crise',
        )
        session.add(crise)

    await session.commit()

    # Buscar estatísticas
    response = await client.get(
        '/estatisticas/progresso',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()

    # Verificar estrutura
    assert 'media_dor_semana' in data
    assert 'dias_registrados_mes' in data
    assert 'crises_mes' in data
    assert 'grafico_dor_semanal' in data
    assert 'insights' in data

    # Verificar métricas
    assert data['media_dor_semana']['valor'] > 0
    assert data['dias_registrados_mes']['valor'] >= 7
    assert data['crises_mes']['valor'] == 3

    # Verificar gráfico
    assert len(data['grafico_dor_semanal']) == 7
    for dia in data['grafico_dor_semanal']:
        assert 'dia' in dia
        assert 'data' in dia
        assert 'intensidade_dor' in dia

    # Verificar insights
    assert len(data['insights']) > 0
    for insight in data['insights']:
        assert 'tipo' in insight
        assert 'mensagem' in insight
        assert insight['tipo'] in ['info', 'warning', 'success', 'danger']


async def test_get_progresso_compara_periodos(client, token, paciente, session):
    """Testa se o endpoint compara corretamente os períodos."""
    hoje = datetime.now()

    # Criar registros na semana atual (últimos 7 dias) com dor média de 4
    for i in range(7):
        dia = hoje - timedelta(days=i)
        registro = Registro(
            tipo_registro='diario',
            paciente_id=paciente.id,
            data_hora=dia,
        )
        session.add(registro)
        await session.flush()

        registro_diario = RegistroDiario(
            id=registro.id, observacoes=f'Semana atual {i}'
        )
        session.add(registro_diario)
        await session.flush()

        regiao_dor = RegistroRegiaoDor(
            registro_id=registro_diario.id, regiao_id='1', intensidade=4
        )
        session.add(regiao_dor)

    # Criar registros na semana anterior (8-14 dias atrás) com dor média de 6
    for i in range(7, 14):
        dia = hoje - timedelta(days=i)
        registro = Registro(
            tipo_registro='diario',
            paciente_id=paciente.id,
            data_hora=dia,
        )
        session.add(registro)
        await session.flush()

        registro_diario = RegistroDiario(
            id=registro.id, observacoes=f'Semana anterior {i}'
        )
        session.add(registro_diario)
        await session.flush()

        regiao_dor = RegistroRegiaoDor(
            registro_id=registro_diario.id, regiao_id='1', intensidade=6
        )
        session.add(regiao_dor)

    await session.commit()

    # Buscar estatísticas
    response = await client.get(
        '/estatisticas/progresso',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()

    # Verificar que houve melhora (dor diminuiu)
    assert data['media_dor_semana']['valor'] == 4.0
    assert data['media_dor_semana']['variacao_percentual'] is not None
    assert (
        data['media_dor_semana']['variacao_percentual'] < 0
    )  # Diminuiu (negativo)
    assert data['media_dor_semana']['tendencia'] == 'baixa'


async def test_get_progresso_sem_autenticacao(client):
    """Testa endpoint sem autenticação."""
    response = await client.get('/estatisticas/progresso')
    assert response.status_code == HTTPStatus.UNAUTHORIZED
