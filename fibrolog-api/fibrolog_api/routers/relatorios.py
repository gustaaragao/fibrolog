from datetime import datetime
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from fibrolog_api.database import get_session
from fibrolog_api.models import (
    Paciente,
    RegistroCrise,
    RegistroDiario,
    RegistroRegiaoDor,
    RegistroSintoma,
)
from fibrolog_api.schemas.relatorio import (
    CrisisReportEntry,
    GeneralSummary,
    PainRegionSummary,
    ReportPublic,
    SymptomTimelineEntry,
)
from fibrolog_api.security import get_current_paciente
from fibrolog_api.utils.pdf_generator import generate_report_pdf
from fibrolog_api.utils.string_utils import slugify

router = APIRouter(prefix='/relatorios', tags=['Relatórios'])

Session = Annotated[AsyncSession, Depends(get_session)]
CurrentPaciente = Annotated[Paciente, Depends(get_current_paciente)]

# Mapeamento presumido baseado no Documento de Visão e testes
S_PAIN = '1'
S_SLEEP = '3'
S_FATIGUE = '4'
S_EMOTION = '5'

EMOTIONS = {
    0: 'FELIZ',
    1: 'ANSIOSO',
    2: 'IRRITADO',
    3: 'TRISTE',
}


@router.get(
    '/gerar',
    response_model=ReportPublic,
    summary='Gerar dados do relatório',
    description='Retorna dados consolidados para o relatório de monitoramento no período especificado.',
)
async def gerar_relatorio(
    session: Session,
    paciente: CurrentPaciente,
    data_inicio: datetime = Query(...),
    data_fim: datetime = Query(...),
):
    # 1. Buscar Registros Diários no período
    stmt_diarios = (
        select(RegistroDiario)
        .where(
            RegistroDiario.paciente_id == paciente.id,
            RegistroDiario.data_hora >= data_inicio,
            RegistroDiario.data_hora <= data_fim,
        )
        .options(
            selectinload(RegistroDiario.sintomas),
            selectinload(RegistroDiario.regioes_dor),
        )
        .order_by(RegistroDiario.data_hora.asc())
    )
    result_diarios = await session.execute(stmt_diarios)
    diarios = result_diarios.scalars().all()

    # 2. Buscar Registros de Crise no período
    stmt_crises = (
        select(RegistroCrise)
        .where(
            RegistroCrise.paciente_id == paciente.id,
            RegistroCrise.data_hora >= data_inicio,
            RegistroCrise.data_hora <= data_fim,
        )
        .order_by(RegistroCrise.data_hora.asc())
    )
    result_crises = await session.execute(stmt_crises)
    crises = result_crises.scalars().all()

    # 3. Processar Estatísticas
    total_pain = 0
    peak_pain = 0
    intense_pain_days = 0
    total_fatigue = 0
    total_sleep = 0
    emotion_counts = {e: 0 for e in EMOTIONS.values()}
    pain_region_counts = {}
    
    timeline = []
    
    for d in diarios:
        entry = SymptomTimelineEntry(
            date=d.data_hora,
            notes=d.observacoes
        )
        
        for s in d.sintomas:
            if s.sintoma_id == S_PAIN:
                entry.pain = s.intensidade
                total_pain += s.intensidade
                if s.intensidade > peak_pain:
                    peak_pain = s.intensidade
                if s.intensidade > 7:
                    intense_pain_days += 1
            elif s.sintoma_id == S_SLEEP:
                entry.sleep = s.intensidade
                total_sleep += s.intensidade
            elif s.sintoma_id == S_FATIGUE:
                entry.fatigue = s.intensidade
                total_fatigue += s.intensidade
            elif s.sintoma_id == S_EMOTION:
                emotion_name = EMOTIONS.get(s.intensidade, 'DESCONHECIDO')
                entry.emotion = emotion_name
                if emotion_name in emotion_counts:
                    emotion_counts[emotion_name] += 1
        
        for r in d.regioes_dor:
            pain_region_counts[r.regiao_id] = pain_region_counts.get(r.regiao_id, 0) + 1
            
        timeline.append(entry)

    num_days = len(diarios)
    summary = GeneralSummary(
        averagePain=round(total_pain / num_days, 1) if num_days > 0 else 0,
        peakPain=peak_pain,
        intensePainDays=intense_pain_days,
        averageFatigue=round(total_fatigue / num_days, 1) if num_days > 0 else 0,
        averageSleep=round(total_sleep / num_days, 1) if num_days > 0 else 0,
        emotionFrequency=emotion_counts
    )

    # 4. Processar Regiões de Dor
    frequent_regions = [
        PainRegionSummary(id=rid, count=count)
        for rid, count in sorted(pain_region_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    # 5. Processar Crises
    crisis_history = [
        CrisisReportEntry(
            timestamp=c.data_hora,
            intensity=c.intensidade_dor,
            duration=c.duracao,
            symptoms=c.sintomas_relatados,
            context=c.contexto
        )
        for c in crises
    ]

    return ReportPublic(
        patientName=paciente.nome,
        period=f"{data_inicio.strftime('%d/%m/%Y')} - {data_fim.strftime('%d/%m/%Y')}",
        generationDate=datetime.now(),
        generalSummary=summary,
        frequentPainRegions=frequent_regions,
        symptomTimeline=timeline,
        crisisHistory=crisis_history
    )


@router.get(
    '/pdf',
    summary='Gerar relatório em PDF',
    description='Gera e retorna o arquivo PDF do relatório de monitoramento.',
)
async def gerar_relatorio_pdf(
    session: Session,
    paciente: CurrentPaciente,
    data_inicio: datetime = Query(...),
    data_fim: datetime = Query(...),
):
    report_public = await gerar_relatorio(session, paciente, data_inicio, data_fim)
    
    report_data = {
        'patientName': report_public.patientName,
        'period': report_public.period,
        'generationDate': report_public.generationDate,
        'generalSummary': report_public.generalSummary.model_dump(),
        'frequentPainRegions': [r.model_dump() for r in report_public.frequentPainRegions],
        'symptomTimeline': [e.model_dump() for e in report_public.symptomTimeline],
        'crisisHistory': [c.model_dump() for c in report_public.crisisHistory],
    }
    
    pdf_content = generate_report_pdf(report_data)
    
    filename = f"relatorio_{slugify(paciente.nome)}_{datetime.now().strftime('%Y%m%d')}.pdf"
    
    return Response(
        content=pdf_content,
        media_type='application/pdf',
        headers={
            'Content-Disposition': f'attachment; filename="{filename}"'
        }
    )
