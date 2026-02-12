from typing import Optional

from pydantic import BaseModel, ConfigDict


class EstatisticasDashboard(BaseModel):
    total_registros: int
    total_crises: int
    dias_ativos: int
    media_intensidade_dor: Optional[float] = None
    sintoma_mais_frequente: Optional[str] = None
    sequencia_dias_consecutivos: int = 0
    taxa_adesao: Optional[float] = None

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            'example': {
                'total_registros': 45,
                'total_crises': 8,
                'dias_ativos': 32,
                'media_intensidade_dor': 6.5,
                'sintoma_mais_frequente': 'Fadiga',
                'sequencia_dias_consecutivos': 5,
                'taxa_adesao': 71.1,
            }
        },
    )
