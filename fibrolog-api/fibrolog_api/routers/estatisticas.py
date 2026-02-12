from datetime import datetime, timedelta
from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy import distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import get_session
from fibrolog_api.models import (
    Paciente,
    RegistroCrise,
    RegistroDiario,
    RegistroRegiaoDor,
    RegistroSintoma,
)
from fibrolog_api.schemas import (
    DiaGrafico,
    EstatisticasDashboard,
    EstatisticasProgresso,
    Insight,
    MetricaProgresso,
)
from fibrolog_api.security import get_current_paciente

router = APIRouter(prefix='/estatisticas', tags=['Estatísticas'])

Session = Annotated[AsyncSession, Depends(get_session)]
CurrentPaciente = Annotated[Paciente, Depends(get_current_paciente)]

# Mapeamento de IDs de sintomas para nomes legíveis (baseado em relatorios.py)
SINTOMAS_MAP = {
    '1': 'Dor',
    '3': 'Sono',
    '4': 'Fadiga',
    '5': 'Emoção',
}


def calcular_sequencia_dias(datas: List[datetime]) -> int:
    """
    Calcula a maior sequência atual de dias consecutivos com registros.
    """
    if not datas:
        return 0

    # Converter para conjunto de dates para busca rápida e remover duplicatas/horas
    datas_set = {d.date() for d in datas}
    datas_ordenadas = sorted(list(datas_set), reverse=True)

    if not datas_ordenadas:
        return 0

    # Verificar se o registro mais recente é hoje ou ontem para considerar sequência "atual"
    hoje = datetime.now().date()
    ultimo_registro = datas_ordenadas[0]

    if (hoje - ultimo_registro).days > 1:
        # Sequência quebrada (mais de 1 dia sem registro)
        # Mas o requisito pede a "maior sequência", vou implementar a maior de todas
        pass

    # Implementando a maior sequência de todas as datas
    datas_crescente = sorted(list(datas_set))
    max_sequencia = 1
    sequencia_atual = 1

    for i in range(1, len(datas_crescente)):
        if (datas_crescente[i] - datas_crescente[i - 1]).days == 1:
            sequencia_atual += 1
            max_sequencia = max(max_sequencia, sequencia_atual)
        else:
            sequencia_atual = 1

    return max_sequencia


@router.get(
    '/dashboard',
    response_model=EstatisticasDashboard,
    summary='Obter estatísticas do dashboard',
    description='Retorna estatísticas agregadas para o dashboard do paciente logado.',
)
async def get_dashboard_statistics(
    session: Session,
    paciente: CurrentPaciente,
):
    """
    Retorna estatísticas agregadas para o dashboard do paciente logado.
    """
    paciente_id = paciente.id

    # 1. Total de registros diários
    total_registros_stmt = select(func.count(RegistroDiario.id)).where(
        RegistroDiario.paciente_id == paciente_id
    )
    total_registros = await session.scalar(total_registros_stmt) or 0

    # 2. Total de crises
    total_crises_stmt = select(func.count(RegistroCrise.id)).where(
        RegistroCrise.paciente_id == paciente_id
    )
    total_crises = await session.scalar(total_crises_stmt) or 0

    # 3. Dias ativos (dias únicos com registro diário)
    dias_ativos_stmt = select(
        func.count(distinct(func.date(RegistroDiario.data_hora)))
    ).where(RegistroDiario.paciente_id == paciente_id)
    dias_ativos = await session.scalar(dias_ativos_stmt) or 0

    # 4. Média de intensidade de dor (de todas as regiões registradas)
    media_dor_stmt = (
        select(func.avg(RegistroRegiaoDor.intensidade))
        .join(
            RegistroDiario,
            RegistroRegiaoDor.registro_id == RegistroDiario.id,
        )
        .where(RegistroDiario.paciente_id == paciente_id)
    )
    media_intensidade_dor = await session.scalar(media_dor_stmt)
    if media_intensidade_dor is not None:
        media_intensidade_dor = round(float(media_intensidade_dor), 1)

    # 5. Sintoma mais frequente
    sintoma_stmt = (
        select(RegistroSintoma.sintoma_id, func.count(RegistroSintoma.id))
        .join(
            RegistroDiario,
            RegistroSintoma.registro_id == RegistroDiario.id,
        )
        .where(RegistroDiario.paciente_id == paciente_id)
        .group_by(RegistroSintoma.sintoma_id)
        .order_by(func.count(RegistroSintoma.id).desc())
        .limit(1)
    )
    result_sintoma = await session.execute(sintoma_stmt)
    sintoma_row = result_sintoma.first()
    sintoma_mais_frequente = None
    if sintoma_row:
        sintoma_id = sintoma_row[0]
        sintoma_mais_frequente = SINTOMAS_MAP.get(sintoma_id, sintoma_id)

    # 6. Sequência de dias consecutivos
    datas_stmt = select(RegistroDiario.data_hora).where(
        RegistroDiario.paciente_id == paciente_id
    )
    result_datas = await session.execute(datas_stmt)
    datas = result_datas.scalars().all()
    sequencia_dias_consecutivos = calcular_sequencia_dias(datas)

    # 7. Taxa de adesão
    # Calculada como (dias_ativos / dias_desde_cadastro) * 100
    # Usaremos created_at como data de cadastro, com fallback para data_diagnostico
    taxa_adesao = None
    data_referencia = None

    if hasattr(paciente, 'created_at') and paciente.created_at:
        data_referencia = paciente.created_at
    elif hasattr(paciente, 'data_diagnostico') and paciente.data_diagnostico:
        data_referencia = paciente.data_diagnostico

    if data_referencia:
        # Garantir que data_referencia seja date para comparação
        if isinstance(data_referencia, datetime):
            data_referencia = data_referencia.date()

        hoje = datetime.now().date()
        dias_desde_cadastro = (hoje - data_referencia).days + 1

        if dias_desde_cadastro > 0:
            taxa_adesao = round((dias_ativos / dias_desde_cadastro) * 100, 1)
            # Garantir que não passe de 100%
            taxa_adesao = min(taxa_adesao, 100.0)
        else:
            # Se a data de cadastro for no futuro (erro de sistema/relógio),
            # assumimos 1 dia para evitar divisão por zero ou negativa
            taxa_adesao = 100.0 if dias_ativos > 0 else 0.0
    # Se não houver data nenhuma, mas houver registros, a adesão é 100% dos dias que conhecemos
    elif dias_ativos > 0:
        taxa_adesao = 100.0

    return EstatisticasDashboard(
        total_registros=total_registros,
        total_crises=total_crises,
        dias_ativos=dias_ativos,
        media_intensidade_dor=media_intensidade_dor,
        sintoma_mais_frequente=sintoma_mais_frequente,
        sequencia_dias_consecutivos=sequencia_dias_consecutivos,
        taxa_adesao=taxa_adesao,
    )


@router.get(
    '/progresso',
    response_model=EstatisticasProgresso,
    summary='Obter estatísticas de progresso',
    description='Retorna estatísticas de progresso com comparações temporais e insights.',
)
async def get_progress_statistics(
    session: Session,
    paciente: CurrentPaciente,
):
    """
    Retorna estatísticas de progresso do paciente com comparações temporais.
    
    Inclui:
    - Média de dor da última semana (vs semana anterior)
    - Dias registrados no mês (vs mês anterior)
    - Crises no mês (vs mês anterior)
    - Gráfico de dor dos últimos 7 dias
    - Insights automáticos baseados nos dados
    """
    paciente_id = paciente.id
    hoje = datetime.now()

    # Definir períodos
    inicio_semana_atual = hoje - timedelta(days=6)  # Últimos 7 dias
    inicio_semana_anterior = inicio_semana_atual - timedelta(days=7)
    fim_semana_anterior = inicio_semana_atual - timedelta(days=1)

    inicio_mes_atual = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    if inicio_mes_atual.month == 1:
        inicio_mes_anterior = inicio_mes_atual.replace(year=inicio_mes_atual.year - 1, month=12)
    else:
        inicio_mes_anterior = inicio_mes_atual.replace(month=inicio_mes_atual.month - 1)
    fim_mes_anterior = inicio_mes_atual - timedelta(days=1)

    # 1. Média de dor da semana atual
    media_dor_semana_stmt = (
        select(func.avg(RegistroRegiaoDor.intensidade))
        .join(RegistroDiario, RegistroRegiaoDor.registro_id == RegistroDiario.id)
        .where(
            RegistroDiario.paciente_id == paciente_id,
            RegistroDiario.data_hora >= inicio_semana_atual,
        )
    )
    media_dor_semana = await session.scalar(media_dor_semana_stmt)
    media_dor_semana = round(float(media_dor_semana), 1) if media_dor_semana else 0.0

    # Média de dor da semana anterior
    media_dor_semana_ant_stmt = (
        select(func.avg(RegistroRegiaoDor.intensidade))
        .join(RegistroDiario, RegistroRegiaoDor.registro_id == RegistroDiario.id)
        .where(
            RegistroDiario.paciente_id == paciente_id,
            RegistroDiario.data_hora >= inicio_semana_anterior,
            RegistroDiario.data_hora <= fim_semana_anterior,
        )
    )
    media_dor_semana_ant = await session.scalar(media_dor_semana_ant_stmt)
    media_dor_semana_ant = float(media_dor_semana_ant) if media_dor_semana_ant else None

    # Calcular variação
    variacao_dor = None
    tendencia_dor = 'neutro'
    if media_dor_semana_ant and media_dor_semana_ant > 0:
        variacao_dor = round(
            ((media_dor_semana - media_dor_semana_ant) / media_dor_semana_ant) * 100, 1
        )
        tendencia_dor = 'baixa' if variacao_dor < 0 else 'alta' if variacao_dor > 0 else 'neutro'

    # 2. Dias registrados no mês atual
    dias_registrados_mes_stmt = select(
        func.count(distinct(func.date(RegistroDiario.data_hora)))
    ).where(
        RegistroDiario.paciente_id == paciente_id,
        RegistroDiario.data_hora >= inicio_mes_atual,
    )
    dias_registrados_mes = await session.scalar(dias_registrados_mes_stmt) or 0

    # Dias registrados no mês anterior
    dias_registrados_mes_ant_stmt = select(
        func.count(distinct(func.date(RegistroDiario.data_hora)))
    ).where(
        RegistroDiario.paciente_id == paciente_id,
        RegistroDiario.data_hora >= inicio_mes_anterior,
        RegistroDiario.data_hora <= fim_mes_anterior,
    )
    dias_registrados_mes_ant = await session.scalar(dias_registrados_mes_ant_stmt) or 0

    # Calcular variação
    variacao_dias = None
    tendencia_dias = 'neutro'
    if dias_registrados_mes_ant > 0:
        variacao_dias = round(
            ((dias_registrados_mes - dias_registrados_mes_ant) / dias_registrados_mes_ant) * 100, 1
        )
        tendencia_dias = 'alta' if variacao_dias > 0 else 'baixa' if variacao_dias < 0 else 'neutro'

    # 3. Crises no mês atual
    crises_mes_stmt = select(func.count(RegistroCrise.id)).where(
        RegistroCrise.paciente_id == paciente_id,
        RegistroCrise.data_hora >= inicio_mes_atual,
    )
    crises_mes = await session.scalar(crises_mes_stmt) or 0

    # Crises no mês anterior
    crises_mes_ant_stmt = select(func.count(RegistroCrise.id)).where(
        RegistroCrise.paciente_id == paciente_id,
        RegistroCrise.data_hora >= inicio_mes_anterior,
        RegistroCrise.data_hora <= fim_mes_anterior,
    )
    crises_mes_ant = await session.scalar(crises_mes_ant_stmt) or 0

    # Calcular variação
    variacao_crises = None
    tendencia_crises = 'neutro'
    if crises_mes_ant > 0:
        variacao_crises = round(
            ((crises_mes - crises_mes_ant) / crises_mes_ant) * 100, 1
        )
        tendencia_crises = 'baixa' if variacao_crises < 0 else 'alta' if variacao_crises > 0 else 'neutro'

    # 4. Gráfico de dor dos últimos 7 dias
    dias_semana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    grafico_dados = []

    for i in range(7):
        dia_atual = inicio_semana_atual + timedelta(days=i)
        dia_inicio = dia_atual.replace(hour=0, minute=0, second=0, microsecond=0)
        dia_fim = dia_atual.replace(hour=23, minute=59, second=59, microsecond=999999)

        # Buscar média de dor do dia
        media_dia_stmt = (
            select(func.avg(RegistroRegiaoDor.intensidade))
            .join(RegistroDiario, RegistroRegiaoDor.registro_id == RegistroDiario.id)
            .where(
                RegistroDiario.paciente_id == paciente_id,
                RegistroDiario.data_hora >= dia_inicio,
                RegistroDiario.data_hora <= dia_fim,
            )
        )
        media_dia = await session.scalar(media_dia_stmt)
        intensidade = round(float(media_dia), 1) if media_dia else None

        grafico_dados.append(
            DiaGrafico(
                dia=dias_semana[dia_atual.weekday() + 1 if dia_atual.weekday() < 6 else 0],
                data=dia_atual.strftime('%Y-%m-%d'),
                intensidade_dor=intensidade,
            )
        )

    # 5. Gerar insights
    insights = []

    # Insight sobre tendência de dor
    if variacao_dor is not None:
        if variacao_dor < -5:
            insights.append(
                Insight(
                    tipo='success',
                    mensagem=f'Seus níveis de dor diminuíram {abs(variacao_dor):.0f}% em relação à semana passada',
                    icone='📉',
                )
            )
        elif variacao_dor > 5:
            insights.append(
                Insight(
                    tipo='warning',
                    mensagem=f'Seus níveis de dor aumentaram {variacao_dor:.0f}% em relação à semana passada',
                    icone='📈',
                )
            )
        else:
            insights.append(
                Insight(
                    tipo='info',
                    mensagem='Seus níveis de dor estão estáveis em relação à semana passada',
                    icone='➡️',
                )
            )

    # Insight sobre registros
    if dias_registrados_mes > 20:
        insights.append(
            Insight(
                tipo='success',
                mensagem=f'Você registrou {dias_registrados_mes} dias este mês! Continue assim!',
                icone='📝',
            )
        )
    elif dias_registrados_mes > 0:
        insights.append(
            Insight(
                tipo='info',
                mensagem=f'Você tem {dias_registrados_mes} registros este mês. Tente registrar diariamente!',
                icone='📝',
            )
        )

    # Insight sobre crises
    if crises_mes == 0:
        insights.append(
            Insight(
                tipo='success',
                mensagem='Nenhuma crise registrada este mês! Excelente!',
                icone='🎉',
            )
        )
    elif variacao_crises is not None and variacao_crises < 0:
        insights.append(
            Insight(
                tipo='success',
                mensagem=f'Suas crises diminuíram {abs(variacao_crises):.0f}% em relação ao mês passado',
                icone='✨',
            )
        )
    elif crises_mes > 5:
        insights.append(
            Insight(
                tipo='warning',
                mensagem=f'Você teve {crises_mes} crises este mês. Considere consultar seu médico',
                icone='⚠️',
            )
        )

    return EstatisticasProgresso(
        media_dor_semana=MetricaProgresso(
            valor=media_dor_semana,
            variacao_percentual=variacao_dor,
            tendencia=tendencia_dor,
        ),
        dias_registrados_mes=MetricaProgresso(
            valor=dias_registrados_mes,
            variacao_percentual=variacao_dias,
            tendencia=tendencia_dias,
        ),
        crises_mes=MetricaProgresso(
            valor=crises_mes,
            variacao_percentual=variacao_crises,
            tendencia=tendencia_crises,
        ),
        grafico_dor_semanal=grafico_dados,
        insights=insights,
    )
