from datetime import datetime, timedelta
from http import HTTPStatus

import pytest

from fibrolog_api.models import (
    RegistroDiario,
    RegistroRegiaoDor,
    RegistroSintoma,
)


@pytest.mark.asyncio
async def test_gerar_relatorio_pdf_sucesso(client, token, paciente, session):
    # Setup data
    hoje = datetime.now()
    r = RegistroDiario(paciente_id=paciente.id, tipo_registro='diario', observacoes='Teste PDF')
    r.data_hora = hoje
    session.add(r)
    await session.flush()

    session.add(RegistroSintoma(registro_id=r.id, sintoma_id='1', intensidade=8))
    session.add(RegistroRegiaoDor(registro_id=r.id, regiao_id='10', intensidade=5))
    await session.commit()

    data_inicio = (hoje - timedelta(days=1)).isoformat()
    data_fim = (hoje + timedelta(days=1)).isoformat()

    response = await client.get(
        f'/relatorios/pdf?data_inicio={data_inicio}&data_fim={data_fim}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    assert response.headers['content-type'] == 'application/pdf'
    assert 'attachment' in response.headers['content-disposition']
    assert len(response.content) > 0
    # PDF magic number
    assert response.content.startswith(b'%PDF')


@pytest.mark.asyncio
async def test_gerar_relatorio_pdf_muitas_paginas(client, token, paciente, session):
    # Setup many days of data to force page break
    hoje = datetime.now()
    for i in range(40):  # 40 days of logs should exceed one page
        data = hoje - timedelta(days=i)
        r = RegistroDiario(paciente_id=paciente.id, tipo_registro='diario', observacoes=f'Dia {i}')
        r.data_hora = data
        session.add(r)
        await session.flush()
        session.add(RegistroSintoma(registro_id=r.id, sintoma_id='1', intensidade=5))

    await session.commit()

    data_inicio = (hoje - timedelta(days=45)).isoformat()
    data_fim = hoje.isoformat()

    response = await client.get(
        f'/relatorios/pdf?data_inicio={data_inicio}&data_fim={data_fim}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    assert response.headers['content-type'] == 'application/pdf'
    # Check that it generated a non-trivial amount of content
    assert len(response.content) > 10000
    assert response.content.startswith(b'%PDF')


@pytest.mark.asyncio
async def test_gerar_relatorio_pdf_filename_slugified(client, token, session):
    # Create patient with complex name
    from fibrolog_api.models import Paciente
    from fibrolog_api.security import get_password_hash

    paciente_complexo = Paciente(
        nome="Gustavo Henrique Aragão Silva",
        email="gustavo.complexo@example.com",
        senha=get_password_hash("senha123"),
        data_nascimento=datetime(1990, 1, 1),
        sexo="Masculino",
        data_diagnostico=datetime(2020, 1, 1)
    )
    session.add(paciente_complexo)
    await session.commit()

    # Get token for new patient
    from fibrolog_api.security import create_access_token
    token_complexo = create_access_token(data={'sub': paciente_complexo.email})

    hoje = datetime.now()
    data_inicio = (hoje - timedelta(days=1)).isoformat()
    data_fim = hoje.isoformat()

    response = await client.get(
        f'/relatorios/pdf?data_inicio={data_inicio}&data_fim={data_fim}',
        headers={'Authorization': f'Bearer {token_complexo}'},
    )

    assert response.status_code == HTTPStatus.OK
    content_disp = response.headers['content-disposition']
    # Should contain "gustavo_henrique_aragao_silva"
    assert "gustavo_henrique_aragao_silva" in content_disp
