## 1. Banco de Dados

- [x] 1.1 Criar modelos SQLAlchemy para `RegistroDiario`, `RegistroSintoma` e `RegistroRegiaoDor` em `fibrolog_api/models.py`.
- [x] 1.2 Gerar nova migração Alembic para criar as tabelas `registros_diarios`, `registro_sintomas` e `registro_regioes_dor`.
- [x] 1.3 Executar a migração para atualizar o banco de dados local.

## 2. Schemas Pydantic

- [x] 2.1 Criar `SymptomEntry` e `PainRegionEntry` com validações de range e regex em `fibrolog_api/schemas/registro_diario.py`.
- [x] 2.2 Criar `RegistroDiarioCreate` incluindo listas de sintomas, regiões de dor e notas.
- [x] 2.3 Criar schema de resposta `RegistroDiarioPublic`.

## 3. API e Lógica de Negócio

- [x] 3.1 Criar o novo router `fibrolog_api/routers/registros_diarios.py`.
- [x] 3.2 Implementar o endpoint `POST /` protegido por autenticação JWT.
- [x] 3.3 Implementar a lógica de salvamento atômico (transação) do registro e seus itens.
- [x] 3.4 Registrar o novo router no arquivo principal `fibrolog_api/app.py`.

## 4. Testes e Verificação

- [x] 4.1 Criar arquivo de testes `tests/test_registros_diarios.py`.
- [x] 4.2 Testar criação de registro com sucesso (cenário completo).
- [x] 4.3 Testar criação com listas vazias.
- [x] 4.4 Testar falha na validação de intensidade (>10).
- [x] 4.5 Testar falha na validação de ID de sintoma ou região.
- [x] 4.6 Testar acesso não autenticado (401).