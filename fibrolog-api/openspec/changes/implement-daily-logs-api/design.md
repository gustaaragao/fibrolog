## Context

A API do FibroLog necessita de uma estrutura robusta para armazenar os registros diários de pacientes. Atualmente, a API utiliza FastAPI com SQLAlchemy e PostgreSQL. Este design detalha a implementação do novo endpoint e as tabelas relacionadas para garantir integridade referencial e performance.

## Goals / Non-Goals

**Goals:**
- Implementar as tabelas `registros_diarios`, `registro_sintomas` e `registro_regioes_dor`.
- Criar o endpoint `POST /registros-diarios`.
- Garantir validação rigorosa dos dados de entrada (intensidade e IDs).
- Manter a consistência dos dados através de transações atômicas.

**Non-Goals:**
- Implementação de endpoints de visualização (GET) ou edição (PUT) nesta fase.
- Implementação de dashboard ou relatórios.
- Refatoração profunda de sistemas de autenticação existentes.

## Decisions

### 1. Modelo de Dados Normalizado
**Decisão:** Utilizar três tabelas separadas em vez de campos JSONB.
- `registros_diarios`: Cabeçalho do registro (paciente, data, notas).
- `registro_sintomas`: Itens de sintomas (1:N com registros).
- `registro_regioes_dor`: Itens de regiões de dor (1:N com registros).
**Racional:** Facilita a agregação de dados e consultas estatísticas futuras (ex: frequência de um sintoma específico) sem necessidade de processamento complexo de JSON no banco de dados.

### 2. Validação via Pydantic Field
**Decisão:** Utilizar `Field(ge=0, le=10)` para intensidades e `pattern` (regex) para IDs.
**Racional:** Garante que dados inválidos sejam rejeitados antes mesmo de atingir a lógica de negócio ou o banco de dados, retornando erros claros para o frontend.

### 3. Transação Atômica com SQLAlchemy
**Decisão:** Utilizar o gerenciamento de sessão do SQLAlchemy para garantir que o registro e seus itens sejam salvos em um único bloco `commit()`.
**Racional:** Evita "registros órfãos" onde o cabeçalho é salvo mas os detalhes falham, mantendo a integridade dos dados.

## Risks / Trade-offs

- **[Risco] Alta cardinalidade nas tabelas de itens** → Com muitos pacientes e registros diários, as tabelas de itens podem crescer rapidamente.
  - *Mitigação*: Implementar indexação adequada em `registro_id` e monitorar a performance conforme a base cresce.
- **[Trade-off] Normalização vs Performance** → Múltiplos inserts por requisição.
  - *Mitigação*: O volume de dados por requisição é pequeno (máximo 8 sintomas e 50 regiões), o que é perfeitamente suportado pelo PostgreSQL em uma transação.
