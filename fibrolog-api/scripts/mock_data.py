"""
Script para popular o banco de dados com dados de teste.

Cria usuário teste@gmail.com com diversos registros diários e crises
para geração de relatórios completos.
"""

import asyncio
from datetime import datetime, timedelta
import random

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fibrolog_api.database import async_session
from fibrolog_api.models import (
    Paciente,
    RegistroDiario,
    RegistroCrise,
    RegistroSintoma,
    RegistroRegiaoDor,
    Medicacao,
)
from fibrolog_api.security import get_password_hash


# Constantes de sintomas
S_PAIN = '1'
S_SLEEP = '3'
S_FATIGUE = '4'
S_EMOTION = '5'

# Regiões de dor comuns
PAIN_REGIONS = [
    '1', '2', '3', '4', '5',  # Cabeça, pescoço, ombros, costas, braços
    '6', '7', '8', '9', '10',  # Mãos, tórax, abdômen, quadril, pernas
]

# Emoções (índices para o sintoma de emoção)
EMOTIONS = [0, 1, 2, 3]  # FELIZ, ANSIOSO, IRRITADO, TRISTE

# Observações variadas
OBSERVACOES = [
    'Dia tranquilo, consegui fazer algumas atividades leves.',
    'Dor aumentou à tarde após esforço físico.',
    'Acordei com muita rigidez muscular.',
    'Clima frio intensificou os sintomas.',
    'Tomei medicação conforme prescrito.',
    'Fiz exercícios de alongamento pela manhã.',
    'Dificuldade para dormir devido à dor.',
    'Dia estressante no trabalho.',
    'Pratiquei meditação e relaxamento.',
    'Visita ao médico, ajuste na medicação.',
    None,
    None,
]

# Contextos de crise
CONTEXTOS_CRISE = [
    'Após dia estressante no trabalho',
    'Mudança brusca de temperatura',
    'Excesso de atividade física',
    'Falta de sono adequado',
    'Período de alta ansiedade',
    'Após consumo de alimentos específicos',
    'Durante período menstrual',
    'Sem gatilho identificado',
]

# Sintomas de crise
SINTOMAS_CRISE = [
    'Dor intensa generalizada, fadiga extrema, dificuldade de concentração',
    'Rigidez muscular, dor nas articulações, sensibilidade ao toque',
    'Dor de cabeça intensa, náusea, sensibilidade à luz',
    'Formigamento nas extremidades, dor muscular, fraqueza',
    'Dor lombar intensa, dificuldade de movimento',
    'Dor no pescoço e ombros, tensão muscular',
]


async def create_test_user(session: AsyncSession) -> Paciente:
    """Cria ou retorna usuário de teste."""
    # Verifica se já existe
    stmt = select(Paciente).where(Paciente.email == 'teste@gmail.com')
    result = await session.execute(stmt)
    existing = result.scalar_one_or_none()
    
    if existing:
        print(f'✓ Usuário teste@gmail.com já existe (ID: {existing.id})')
        return existing
    
    # Cria novo usuário
    paciente = Paciente(
        nome='Maria Silva Santos',
        email='teste@gmail.com',
        senha=get_password_hash('Senha@123'),
        data_nascimento=datetime(1985, 3, 15),
        sexo='Feminino',
        data_diagnostico=datetime(2020, 6, 10),
    )
    
    session.add(paciente)
    await session.commit()
    await session.refresh(paciente)
    
    print(f'✓ Usuário criado: {paciente.nome} ({paciente.email})')
    return paciente


async def create_medicacoes(session: AsyncSession, paciente: Paciente):
    """Cria medicações para o paciente."""
    medicacoes = [
        Medicacao(
            nome='Pregabalina',
            dosagem='75mg',
            frequencia='2x ao dia',
            paciente_id=paciente.id,
        ),
        Medicacao(
            nome='Amitriptilina',
            dosagem='25mg',
            frequencia='1x ao dia (noite)',
            paciente_id=paciente.id,
        ),
        Medicacao(
            nome='Duloxetina',
            dosagem='60mg',
            frequencia='1x ao dia',
            paciente_id=paciente.id,
        ),
    ]
    
    for med in medicacoes:
        session.add(med)
    
    await session.commit()
    print(f'✓ {len(medicacoes)} medicações criadas')


async def create_registros_diarios(session: AsyncSession, paciente: Paciente, num_days: int = 60):
    """Cria registros diários para os últimos N dias."""
    data_atual = datetime.now()
    registros_criados = 0
    
    for i in range(num_days):
        data = data_atual - timedelta(days=i)
        
        # Cria registro diário
        registro = RegistroDiario(
            tipo_registro='diario',
            paciente_id=paciente.id,
            observacoes=random.choice(OBSERVACOES),
        )
        session.add(registro)
        await session.flush()  # Para obter o ID
        
        # Adiciona sintoma de dor (sempre presente)
        dor_intensidade = random.choices(
            range(1, 11),
            weights=[2, 3, 5, 8, 10, 12, 10, 8, 4, 2],  # Gaussiana centrada em 5-6
        )[0]
        
        sintoma_dor = RegistroSintoma(
            registro_id=registro.id,
            sintoma_id=S_PAIN,
            intensidade=dor_intensidade,
        )
        session.add(sintoma_dor)
        
        # Adiciona fadiga (80% dos dias)
        if random.random() < 0.8:
            fadiga = random.randint(3, 9)
            sintoma_fadiga = RegistroSintoma(
                registro_id=registro.id,
                sintoma_id=S_FATIGUE,
                intensidade=fadiga,
            )
            session.add(sintoma_fadiga)
        
        # Adiciona sono (90% dos dias)
        if random.random() < 0.9:
            sono = random.randint(1, 5)
            sintoma_sono = RegistroSintoma(
                registro_id=registro.id,
                sintoma_id=S_SLEEP,
                intensidade=sono,
            )
            session.add(sintoma_sono)
        
        # Adiciona emoção (70% dos dias)
        if random.random() < 0.7:
            emocao = random.choice(EMOTIONS)
            sintoma_emocao = RegistroSintoma(
                registro_id=registro.id,
                sintoma_id=S_EMOTION,
                intensidade=emocao,
            )
            session.add(sintoma_emocao)
        
        # Adiciona regiões de dor (2-5 regiões por dia)
        num_regioes = random.randint(2, 5)
        regioes_escolhidas = random.sample(PAIN_REGIONS, num_regioes)
        
        for regiao in regioes_escolhidas:
            intensidade = random.randint(3, 9)
            regiao_dor = RegistroRegiaoDor(
                registro_id=registro.id,
                regiao_id=regiao,
                intensidade=intensidade,
            )
            session.add(regiao_dor)
        
        # Atualiza data_hora do registro para o dia correto
        registro.data_hora = data
        
        registros_criados += 1
    
    await session.commit()
    print(f'✓ {registros_criados} registros diários criados')


async def create_crises(session: AsyncSession, paciente: Paciente, num_crises: int = 15):
    """Cria registros de crises aleatórias nos últimos 60 dias."""
    data_atual = datetime.now()
    crises_criadas = 0
    
    for _ in range(num_crises):
        # Data aleatória nos últimos 60 dias
        dias_atras = random.randint(0, 60)
        horas = random.randint(0, 23)
        minutos = random.randint(0, 59)
        
        data_crise = data_atual - timedelta(days=dias_atras, hours=horas, minutes=minutos)
        
        # Cria registro de crise
        crise = RegistroCrise(
            tipo_registro='crise',
            paciente_id=paciente.id,
            intensidade_dor=random.randint(7, 10),  # Crises são sempre intensas
            contexto=random.choice(CONTEXTOS_CRISE),
            duracao=random.choice(['30 min', '1-2h', '2-4h', '4-6h', 'Mais de 6h']),
            sintomas_relatados=random.choice(SINTOMAS_CRISE),
            observacoes=random.choice([
                'Precisei me deitar imediatamente',
                'Tomei medicação de resgate',
                'Não consegui realizar atividades',
                'Procurei ambiente escuro e silencioso',
                None,
            ]),
        )
        session.add(crise)
        await session.flush()
        
        # Atualiza data_hora
        crise.data_hora = data_crise
        
        crises_criadas += 1
    
    await session.commit()
    print(f'✓ {crises_criadas} registros de crises criados')


async def main():
    """Função principal para popular o banco de dados."""
    print('\n🚀 Iniciando população do banco de dados...\n')
    
    async with async_session() as session:
        # 1. Criar usuário de teste
        paciente = await create_test_user(session)
        
        # 2. Criar medicações
        await create_medicacoes(session, paciente)
        
        # 3. Criar registros diários (últimos 60 dias)
        await create_registros_diarios(session, paciente, num_days=60)
        
        # 4. Criar registros de crises
        await create_crises(session, paciente, num_crises=15)
    
    print('\n✅ Dados mockados com sucesso!\n')
    print('📋 Resumo:')
    print(f'   Email: teste@gmail.com')
    print(f'   Senha: Senha@123')
    print(f'   Registros: 60 dias de sintomas + 15 crises')
    print('\n💡 Use estes dados para gerar relatórios completos!\n')


if __name__ == '__main__':
    asyncio.run(main())
