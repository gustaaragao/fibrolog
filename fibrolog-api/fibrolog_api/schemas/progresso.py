from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class MetricaProgresso(BaseModel):
    """Representa uma métrica com valor atual e variação percentual."""

    valor: float
    variacao_percentual: Optional[float] = None
    tendencia: str = 'neutro'  # 'alta', 'baixa', 'neutro'

    model_config = ConfigDict(from_attributes=True)


class DiaGrafico(BaseModel):
    """Representa um dia no gráfico de barras."""

    dia: str  # ex: "Seg", "Ter", "Qua"
    data: str  # formato ISO: "2026-02-05"
    intensidade_dor: Optional[float] = None  # None se não houver registro

    model_config = ConfigDict(from_attributes=True)


class Insight(BaseModel):
    """Representa um insight sobre os dados do paciente."""

    tipo: str  # 'info', 'warning', 'success', 'danger'
    mensagem: str
    icone: Optional[str] = None  # emoji ou nome do ícone

    model_config = ConfigDict(from_attributes=True)


class EstatisticasProgresso(BaseModel):
    """Estatísticas de progresso do paciente."""

    # Métricas principais
    media_dor_semana: MetricaProgresso
    dias_registrados_mes: MetricaProgresso
    crises_mes: MetricaProgresso

    # Dados para o gráfico
    grafico_dor_semanal: List[DiaGrafico]

    # Insights
    insights: List[Insight]

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            'example': {
                'media_dor_semana': {
                    'valor': 4.3,
                    'variacao_percentual': -12.0,
                    'tendencia': 'baixa',
                },
                'dias_registrados_mes': {
                    'valor': 29,
                    'variacao_percentual': 15.0,
                    'tendencia': 'alta',
                },
                'crises_mes': {
                    'valor': 3,
                    'variacao_percentual': -33.0,
                    'tendencia': 'baixa',
                },
                'grafico_dor_semanal': [
                    {
                        'dia': 'Seg',
                        'data': '2026-02-05',
                        'intensidade_dor': 6.0,
                    },
                    {
                        'dia': 'Ter',
                        'data': '2026-02-06',
                        'intensidade_dor': 4.5,
                    },
                    {
                        'dia': 'Qua',
                        'data': '2026-02-07',
                        'intensidade_dor': 7.0,
                    },
                    {
                        'dia': 'Qui',
                        'data': '2026-02-08',
                        'intensidade_dor': 5.5,
                    },
                    {
                        'dia': 'Sex',
                        'data': '2026-02-09',
                        'intensidade_dor': 3.0,
                    },
                    {
                        'dia': 'Sáb',
                        'data': '2026-02-10',
                        'intensidade_dor': 6.5,
                    },
                    {
                        'dia': 'Dom',
                        'data': '2026-02-11',
                        'intensidade_dor': None,
                    },
                ],
                'insights': [
                    {
                        'tipo': 'info',
                        'mensagem': (
                            'Seus níveis de dor diminuíram 12% '
                            'em relação à semana passada'
                        ),
                        'icone': '📉',
                    },
                    {
                        'tipo': 'success',
                        'mensagem': (
                            'Você registrou 29 dias este mês! '
                            'Continue assim!'
                        ),
                        'icone': '📝',
                    },
                ],
            }
        },
    )
