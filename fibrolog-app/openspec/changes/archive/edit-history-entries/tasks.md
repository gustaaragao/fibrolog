# Tarefas: Implementação de Edição de Registros no Histórico

## Contexto

Este documento detalha as tarefas necessárias para implementar a funcionalidade completa de edição de registros de crises e sintomas diários no backend da aplicação FibroLog.

## Objetivo

Permitir que usuários editem seus registros históricos de crises e sintomas diários através de endpoints REST seguros e validados.

---

## Backend Tasks

### ✅ FASE 1: Endpoint de Atualização de Crises

#### Task 1.1: Criar/Atualizar Controller de Crises

- [ ] Implementar método `update()` no controller de crises
- [ ] Receber parâmetro `id` da URL
- [ ] Receber dados do body da requisição
- [ ] Chamar serviço de atualização
- [ ] Retornar resposta apropriada (200 ou erros)

**Arquivos afetados:**

- `backend/controllers/crises.controller.ts` (ou similar)

#### Task 1.2: Implementar Service/Model de Atualização de Crises

- [ ] Criar método `updateCrisis(id, userId, data)` no serviço
- [ ] Verificar se crise existe
- [ ] Verificar se crise pertence ao usuário (autorização)
- [ ] Atualizar campos: `data_hora`, `intensidade_dor`, `contexto`, `duracao`, `sintomas_relatados`, `observacoes`
- [ ] Atualizar campo `updated_at`
- [ ] Retornar crise atualizada

**Arquivos afetados:**

- `backend/services/crises.service.ts`
- `backend/models/crise.model.ts`

#### Task 1.3: Adicionar Validações de Entrada

- [ ] Validar `intensidade_dor`: número entre 0 e 10
- [ ] Validar `contexto`: string obrigatória (min 3, max 500 caracteres)
- [ ] Validar `data_hora`: formato DateTime válido, não no futuro
- [ ] Validar `duracao`: string opcional (max 100 caracteres)
- [ ] Validar `sintomas_relatados`: string opcional (max 1000 caracteres)
- [ ] Validar `observacoes`: string opcional (max 1000 caracteres)

**Arquivos afetados:**

- `backend/validators/crise.validator.ts` (criar se não existir)

#### Task 1.4: Adicionar Rota PUT

- [ ] Adicionar rota `PUT /api/crises/:id`
- [ ] Aplicar middleware de autenticação JWT
- [ ] Aplicar middleware de validação
- [ ] Conectar ao controller

**Arquivos afetados:**

- `backend/routes/crises.routes.ts`

#### Task 1.5: Tratamento de Erros

- [ ] Retornar 404 se crise não existe
- [ ] Retornar 403 se crise não pertence ao usuário
- [ ] Retornar 400 para dados inválidos
- [ ] Retornar 500 para erros internos
- [ ] Incluir mensagens descritivas em português

**Arquivos afetados:**

- `backend/middleware/error-handler.ts`

---

### ✅ FASE 2: Endpoint de Atualização de Sintomas Diários

#### Task 2.1: Criar/Atualizar Controller de Sintomas Diários

- [ ] Implementar método `update()` no controller
- [ ] Receber parâmetro `id` da URL
- [ ] Receber dados do body (sintomas, regiões de dor, observações)
- [ ] Chamar serviço de atualização
- [ ] Retornar resposta apropriada

**Arquivos afetados:**

- `backend/controllers/sintomas-diarios.controller.ts`

#### Task 2.2: Implementar Service de Atualização (Com Transação)

- [ ] Criar método `updateDailyLog(id, userId, data)`
- [ ] Verificar se registro existe
- [ ] Verificar se registro pertence ao usuário
- [ ] **Iniciar transação de banco de dados**
- [ ] Atualizar registro principal (data, observações)
- [ ] Deletar sintomas antigos (tabela intermediária)
- [ ] Inserir novos sintomas com intensidades
- [ ] Deletar regiões antigas (tabela intermediária)
- [ ] Inserir novas regiões com intensidades
- [ ] Atualizar `updated_at`
- [ ] **Commit da transação**
- [ ] Em caso de erro: **Rollback da transação**
- [ ] Retornar registro atualizado completo

**Arquivos afetados:**

- `backend/services/sintomas-diarios.service.ts`
- `backend/models/sintoma-diario.model.ts`

#### Task 2.3: Adicionar Validações de Entrada

- [ ] Validar `data`: formato Date válido
- [ ] Validar `sintomas`: array com pelo menos 1 item
- [ ] Validar `sintomas[].sintoma_id`: ID válido existente
- [ ] Validar `sintomas[].intensidade`: número entre 0 e 10
- [ ] Validar sem duplicatas em `sintomas[].sintoma_id`
- [ ] Validar `regioes_dor`: array (pode ser vazio)
- [ ] Validar `regioes_dor[].regiao_id`: ID válido existente
- [ ] Validar `regioes_dor[].intensidade`: número entre 0 e 10
- [ ] Validar sem duplicatas em `regioes_dor[].regiao_id`
- [ ] Validar `observacoes`: string opcional (max 1000 caracteres)

**Arquivos afetados:**

- `backend/validators/sintoma-diario.validator.ts`

#### Task 2.4: Adicionar Rota PUT

- [ ] Adicionar rota `PUT /api/sintomas-diarios/:id`
- [ ] Aplicar middleware de autenticação JWT
- [ ] Aplicar middleware de validação
- [ ] Conectar ao controller

**Arquivos afetados:**

- `backend/routes/sintomas-diarios.routes.ts`

#### Task 2.5: Tratamento de Erros

- [ ] Retornar 404 se registro não existe
- [ ] Retornar 403 se registro não pertence ao usuário
- [ ] Retornar 400 para dados inválidos (com detalhes)
- [ ] Retornar 400 para sintoma_id ou regiao_id inexistente
- [ ] Retornar 500 para erros internos
- [ ] Garantir rollback em caso de falha na transação

**Arquivos afetados:**

- `backend/middleware/error-handler.ts`

---

### ✅ FASE 3: Segurança e Auditoria

#### Task 3.1: Implementar Verificação de Propriedade

- [ ] Criar helper function `verifyOwnership(resourceType, resourceId, userId)`
- [ ] Usar em ambos os endpoints de atualização
- [ ] Retornar 403 Forbidden se usuário não é o dono

**Arquivos afetados:**

- `backend/utils/authorization.helper.ts` (criar)

#### Task 3.2: Adicionar Logs de Auditoria

- [ ] Criar tabela `audit_logs` (se não existe)
- [ ] Registrar edições de crises (quem, quando, o quê)
- [ ] Registrar edições de sintomas diários
- [ ] Incluir valores antes/depois (opcional)

**Arquivos afetados:**

- `backend/migrations/XXXX_create_audit_logs.ts`
- `backend/models/audit-log.model.ts`
- `backend/services/audit.service.ts`

#### Task 3.3: Rate Limiting

- [ ] Implementar rate limiting para endpoints de edição
- [ ] Limite sugerido: 10 edições por minuto por usuário
- [ ] Retornar 429 Too Many Requests se exceder

**Arquivos afetados:**

- `backend/middleware/rate-limiter.ts`

---

### ✅ FASE 4: Testes

#### Task 4.1: Testes Unitários - Crises

- [ ] Teste: Atualização bem-sucedida com dados válidos
- [ ] Teste: Rejeitar atualização de crise de outro usuário (403)
- [ ] Teste: Rejeitar ID inexistente (404)
- [ ] Teste: Rejeitar intensidade fora do range (400)
- [ ] Teste: Rejeitar contexto vazio (400)
- [ ] Teste: Rejeitar data no futuro (400)
- [ ] Teste: Aceitar campos opcionais vazios

**Arquivos afetados:**

- `backend/tests/unit/crises.service.test.ts`

#### Task 4.2: Testes Unitários - Sintomas Diários

- [ ] Teste: Atualização bem-sucedida com dados válidos
- [ ] Teste: Rejeitar atualização de registro de outro usuário (403)
- [ ] Teste: Rejeitar ID inexistente (404)
- [ ] Teste: Rejeitar intensidade fora do range (400)
- [ ] Teste: Rejeitar sintomas duplicados (400)
- [ ] Teste: Rejeitar regiões duplicadas (400)
- [ ] Teste: Aceitar observações vazias
- [ ] Teste: Aceitar regiões de dor vazias
- [ ] Teste: Rejeitar sintomas vazios (400)
- [ ] Teste: Rollback em caso de erro

**Arquivos afetados:**

- `backend/tests/unit/sintomas-diarios.service.test.ts`

#### Task 4.3: Testes de Integração

- [ ] Teste: Fluxo criar → editar → buscar (crises)
- [ ] Teste: Fluxo criar → editar → buscar (sintomas diários)
- [ ] Teste: Atualização com token expirado (401)
- [ ] Teste: Atualização sem token (401)
- [ ] Teste: Transação com rollback em erro

**Arquivos afetados:**

- `backend/tests/integration/crises.test.ts`
- `backend/tests/integration/sintomas-diarios.test.ts`

---

### ✅ FASE 5: Documentação

#### Task 5.1: Documentar API (Swagger/OpenAPI)

- [ ] Adicionar especificação para `PUT /api/crises/:id`
- [ ] Adicionar especificação para `PUT /api/sintomas-diarios/:id`
- [ ] Incluir schemas de requisição
- [ ] Incluir schemas de resposta
- [ ] Incluir códigos de erro possíveis

**Arquivos afetados:**

- `backend/swagger.yaml` ou `backend/docs/openapi.yaml`

#### Task 5.2: Atualizar README do Backend

- [ ] Documentar novos endpoints
- [ ] Incluir exemplos de requisições cURL
- [ ] Incluir exemplos de respostas
- [ ] Documentar códigos de erro

**Arquivos afetados:**

- `backend/README.md`

#### Task 5.3: Criar Guia de Troubleshooting

- [ ] Documentar erros comuns e soluções
- [ ] Explicar validações
- [ ] Documentar comportamento de transações

**Arquivos afetados:**

- `backend/docs/troubleshooting.md` (criar)

---

## Checklist de Deploy

### Pré-Deploy

- [ ] Todos os testes passando
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Migration scripts testados
- [ ] Rollback plan documentado

### Deploy

- [ ] Executar migrations no banco de dados de staging
- [ ] Testar endpoints em staging
- [ ] Validar integração frontend-backend em staging
- [ ] Executar migrations no banco de dados de produção
- [ ] Deploy do backend em produção
- [ ] Verificar logs de erro
- [ ] Monitorar performance

### Pós-Deploy

- [ ] Testar endpoints em produção
- [ ] Validar integração frontend-backend em produção
- [ ] Monitorar logs de erro por 24h
- [ ] Coletar feedback de usuários beta (se aplicável)

---

## Estimativas de Tempo

| Fase                              | Estimativa    |
| --------------------------------- | ------------- |
| Fase 1: Endpoint Crises           | 1-2 dias      |
| Fase 2: Endpoint Sintomas Diários | 2-3 dias      |
| Fase 3: Segurança e Auditoria     | 1-2 dias      |
| Fase 4: Testes                    | 1-2 dias      |
| Fase 5: Documentação              | 0.5-1 dia     |
| **TOTAL**                         | **5-10 dias** |

---

## Recursos Necessários

- 1 desenvolvedor backend (Node.js/TypeScript ou similar)
- Acesso ao banco de dados de desenvolvimento
- Acesso ao banco de dados de staging
- Ferramenta de teste de API (Postman, Insomnia, etc.)
- Acesso ao repositório Git

---

## Riscos e Mitigações

| Risco                                    | Probabilidade | Impacto | Mitigação                                       |
| ---------------------------------------- | ------------- | ------- | ----------------------------------------------- |
| Perda de dados em transação mal feita    | Baixa         | Alto    | Testes rigorosos de rollback, usar transações   |
| Usuário editar dados de outro usuário    | Média         | Alto    | Verificação rigorosa de propriedade (ownership) |
| Performance degradada com muitas edições | Média         | Médio   | Implementar rate limiting, otimizar queries     |
| Breaking changes na API                  | Baixa         | Alto    | Manter versionamento da API, comunicar mudanças |

---

## Contato e Aprovações

- **Solicitante**: Equipe Frontend
- **Responsável Backend**: [A definir]
- **Revisor Técnico**: [A definir]
- **Aprovador**: [A definir]

---

## Notas Adicionais

- O frontend já está preparado e espera estes endpoints
- Priorizar Fase 1 (Crises) pois é mais simples
- Fase 2 (Sintomas Diários) requer mais atenção devido às relações N:N
- Considerar feature flags para habilitar gradualmente em produção
