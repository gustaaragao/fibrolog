# 🧠 CONTEXTO MESTRE: FibroLog (P2527) - API & Backend
Diretrizes, regras de negócio e arquitetura do sistema backend FibroLog.

---

## 1. VISÃO GERAL TÉCNICA

**Sistema:** Backend para suporte ao App FibroLog.
**Responsabilidade:** Gestão de usuários, persistência de registros, processamento de áudio (IA) e geração de relatórios.

### 1.1 Stack Tecnológica
- **Linguagem:** Python 3.12+
- **Framework:** FastAPI (Async)
- **Banco de Dados:** SQLite (Dev) / PostgreSQL (Prod) - Acesso via SQLAlchemy (Async) + Alembic.
- **Autenticação:** OAuth2 com JWT + Argon2 para hash de senhas.
- **IA/Processamento:** Integração com LLMs (Gemini/OpenAI) para transcrição e análise de áudio.

---

## 2. REGRAS DE NEGÓCIO (RN) - COMPLETO

Baseado no Documento de Visão P2527.

### 2.1 Autenticação e Usuários
- **RN001 - Senha Forte:** Mínimo 8 caracteres, letras maiúsculas, minúsculas, números e símbolos.
- **RN002 - Sessão:** Tokens JWT com expiração de 30 minutos. Refresh tokens para manter sessão.
- **RN003 - Segurança:** Armazenamento de senhas apenas como hash (Argon2).
- **RN011 - Privacidade:** Dados sensíveis criptografados em repouso e trânsito (HTTPS).

### 2.2 Registros de Sintomas (Diário)
- **RN004 - Obrigatoriedade:** Registro diário deve conter ao menos Nível de Dor (0-10) e Estado Emocional.
- **RN005 - Escala de Dor:** Utilizar escala numérica (NRS) de 0 (sem dor) a 10 (dor insuportável).
- **RN006 - Unicidade:** Apenas um registro diário por paciente. Novos envios no mesmo dia sobrescrevem o anterior (edição).
- **RN016 - Monitoramento:** O sistema é de monitoramento, NÃO de diagnóstico médico.

### 2.3 Crises e Áudio
- **RN007 - Registro Livre:** Crises podem ser registradas a qualquer momento, múltiplas vezes ao dia.
- **RN008 - Limite de Áudio:** Gravações de voz limitadas a 60 segundos por crise.
- **RN009 - Transcrição:** Áudios devem ser processados por IA para gerar texto descritivo.
- **RN010 - Persistência:** Texto transcrito é armazenado; áudio original pode ser descartado ou arquivado conforme política de armazenamento.

### 2.4 Rede de Apoio
- **RN012 - Isolamento:** Dados de um paciente nunca são compartilhados sem consentimento explícito.
- **RN013 - Notificações:** Rede de apoio recebe apenas alertas de crise configurados pelo paciente (via Push/Email/SMS).

### 2.5 Relatórios
- **RN014 - Exportação:** Geração de relatórios consolidados em PDF (períodos: semanal, mensal).
- **RN015 - Conteúdo:** Relatórios devem incluir gráficos de dor, sono e fadiga.

---

## 3. ARQUITETURA DE DADOS (ERD Resumido)

### Entidades Principais
- **User (Paciente):** `id`, `email`, `password_hash`, `nome`, `data_nascimento`.
- **DailyLog (Registro Diário):** `id`, `user_id`, `date`, `pain_level` (0-10), `fatigue_level`, `sleep_quality`, `mood`, `body_map_data` (JSON).
- **CrisisLog (Crise):** `id`, `user_id`, `timestamp`, `description` (texto/transcrição), `intensity` (0-10), `audio_url` (opcional).
- **SupportContact (Rede de Apoio):** `id`, `user_id`, `name`, `phone`, `email`, `notify_on_crisis` (bool).
- **Medication/Alert:** `id`, `user_id`, `name`, `schedule_time`, `frequency`.

---

## 4. CONVENÇÕES DE DESENVOLVIMENTO (Backend)

### 4.1 Estrutura de Código
- **Routers:** Divisão por domínio (`/auth`, `/pacientes`, `/registros`, `/relatorios`).
- **Schemas (Pydantic):**
    - `XCreate`: Entrada para criação.
    - `XUpdate`: Entrada para atualização (campos opcionais).
    - `XResponse` (ou `Public`): Saída da API (sem dados sensíveis).
- **Services:** Lógica de negócio isolada dos controladores (routers).

### 4.2 Padronização
- **Idioma:** Código e comentários em **Português**. Termos técnicos universais (framework, request, response) em inglês ou traduzidos conforme glossário.
- **Type Hints:** Obrigatório em todas as assinaturas de função.
- **Testes:** Cobertura mínima de 80%. Testes de integração para fluxos críticos (Login, Registro de Crise).

---

## 5. INTEGRAÇÃO LLM (IA)

- **Provedor:** Google Gemini ou OpenAI (via API Key no `.env`).
- **Prompting:** Utilizar prompts otimizados para transcrição médica precisa, filtrando ruídos e focando na descrição sintomática.
- **Fallback:** Se a IA falhar, permitir salvamento apenas do áudio ou texto manual.