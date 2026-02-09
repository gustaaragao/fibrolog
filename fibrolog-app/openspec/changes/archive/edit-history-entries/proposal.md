# Proposta: Edição de Registros no Histórico (Crises e Sintomas Diários)

## Contexto

Atualmente, o app FibroLog permite que usuários visualizem seu histórico de crises e sintomas diários registrados. No entanto, não existe funcionalidade completa para editar estes registros após a criação. Esta proposta detalha as implementações necessárias no backend para suportar a edição completa de dados.

## Objetivos

1. Implementar endpoints de atualização (UPDATE) para registros diários de sintomas
2. Implementar endpoints de atualização (UPDATE) para registros de crises
3. Garantir validação apropriada dos dados
4. Manter integridade referencial e logs de auditoria
5. Retornar respostas adequadas para o frontend

## Status Atual

### Frontend

O frontend já possui:

- ✅ Tela de histórico (`app/history.tsx`) mostrando crises e sintomas diários
- ✅ Botões de edição em cada item do histórico
- ✅ Roteamento para telas de edição:
  - `/symptoms?id={id}` para editar sintomas diários
  - `/crisis-form?id={id}` para editar crises
- ✅ Formulários de edição que chamam serviços de atualização

### Backend

Funcionalidades existentes:

- ✅ POST para criar sintomas diários
- ✅ GET para listar sintomas diários
- ✅ POST para criar crises
- ✅ GET para listar crises
- ✅ DELETE para excluir crises

Funcionalidades faltantes:

- ❌ PUT/PATCH para atualizar sintomas diários
- ❌ PUT/PATCH para atualizar crises (parcialmente implementado)

## Requisitos Técnicos

### 1. Endpoint de Atualização de Sintomas Diários

#### Rota

```
PUT /api/sintomas-diarios/:id
```

#### Autenticação

- Requer token JWT válido
- Usuário só pode editar seus próprios registros

#### Parâmetros de Rota

- `id` (integer): ID do registro de sintoma diário a ser atualizado

#### Body da Requisição

```json
{
  "data": "2026-02-09",
  "sintomas": [
    {
      "sintoma_id": 1,
      "intensidade": 7
    },
    {
      "sintoma_id": 3,
      "intensidade": 5
    }
  ],
  "regioes_dor": [
    {
      "regiao_id": 1,
      "intensidade": 8
    },
    {
      "regiao_id": 5,
      "intensidade": 6
    }
  ],
  "observacoes": "Piora após atividade física intensa"
}
```

#### Validações Necessárias

1. **Verificar propriedade do registro**
   - O registro com o `id` fornecido deve pertencer ao usuário autenticado
   - Retornar `403 Forbidden` se não pertencer

2. **Validar existência do registro**
   - Verificar se o registro existe
   - Retornar `404 Not Found` se não existir

3. **Validar dados de entrada**
   - `data`: Formato de data válido (ISO 8601 ou yyyy-MM-dd)
   - `sintomas`: Array com pelo menos 1 item
   - `sintomas[].sintoma_id`: ID válido de sintoma existente
   - `sintomas[].intensidade`: Número entre 0 e 10
   - `regioes_dor`: Array (pode ser vazio)
   - `regioes_dor[].regiao_id`: ID válido de região existente
   - `regioes_dor[].intensidade`: Número entre 0 e 10
   - `observacoes`: String opcional (máx 1000 caracteres)

4. **Validar duplicatas**
   - Não permitir `sintoma_id` duplicado no array `sintomas`
   - Não permitir `regiao_id` duplicado no array `regioes_dor`

#### Lógica de Atualização

1. Iniciar transação de banco de dados
2. Atualizar registro principal de sintomas diários
3. **Deletar** todos os registros relacionados antigos:
   - Sintomas associados (tabela intermediária)
   - Regiões de dor associadas (tabela intermediária)
4. **Inserir** novos registros relacionados:
   - Novos sintomas com intensidades
   - Novas regiões de dor com intensidades
5. Atualizar campo `updated_at` com timestamp atual
6. Commit da transação

#### Resposta de Sucesso (200 OK)

```json
{
  "id": 123,
  "usuario_id": 456,
  "data": "2026-02-09",
  "sintomas": [
    {
      "sintoma_id": 1,
      "nome": "Fadiga",
      "intensidade": 7
    },
    {
      "sintoma_id": 3,
      "nome": "Rigidez Muscular",
      "intensidade": 5
    }
  ],
  "regioes_dor": [
    {
      "regiao_id": 1,
      "nome": "Pescoço",
      "intensidade": 8
    },
    {
      "regiao_id": 5,
      "nome": "Costas",
      "intensidade": 6
    }
  ],
  "observacoes": "Piora após atividade física intensa",
  "created_at": "2026-02-08T10:30:00Z",
  "updated_at": "2026-02-09T15:45:00Z"
}
```

#### Respostas de Erro

**400 Bad Request** - Dados inválidos

```json
{
  "erro": "Dados inválidos",
  "detalhes": [
    "Intensidade deve estar entre 0 e 10",
    "Sintoma ID 99 não existe"
  ]
}
```

**403 Forbidden** - Tentativa de editar registro de outro usuário

```json
{
  "erro": "Acesso negado",
  "mensagem": "Você não tem permissão para editar este registro"
}
```

**404 Not Found** - Registro não encontrado

```json
{
  "erro": "Registro não encontrado",
  "mensagem": "Sintoma diário com ID 123 não existe"
}
```

---

### 2. Endpoint de Atualização de Crises

#### Rota

```
PUT /api/crises/:id
```

#### Autenticação

- Requer token JWT válido
- Usuário só pode editar suas próprias crises

#### Parâmetros de Rota

- `id` (integer): ID da crise a ser atualizada

#### Body da Requisição

```json
{
  "data_hora": "2026-02-09T14:30:00Z",
  "intensidade_dor": 9,
  "contexto": "Crise desencadeada por estresse no trabalho e mudança brusca de temperatura",
  "duracao": "3 horas e 30 minutos",
  "sintomas_relatados": "Dor intensa generalizada, fadiga extrema, náusea, sensibilidade à luz",
  "observacoes": "Medicação de emergência administrada após 1 hora"
}
```

#### Validações Necessárias

1. **Verificar propriedade do registro**
   - A crise com o `id` fornecido deve pertencer ao usuário autenticado
   - Retornar `403 Forbidden` se não pertencer

2. **Validar existência do registro**
   - Verificar se a crise existe
   - Retornar `404 Not Found` se não existir

3. **Validar dados de entrada**
   - `data_hora`: Formato ISO 8601 válido (DateTime)
   - `intensidade_dor`: Número inteiro entre 0 e 10
   - `contexto`: String obrigatória (mín 3, máx 500 caracteres)
   - `duracao`: String opcional (máx 100 caracteres)
   - `sintomas_relatados`: String opcional (máx 1000 caracteres)
   - `observacoes`: String opcional (máx 1000 caracteres)

4. **Validar data**
   - `data_hora` não pode ser no futuro
   - Permitir datas passadas (correções são comuns)

#### Lógica de Atualização

1. Verificar propriedade do registro
2. Atualizar todos os campos permitidos
3. Atualizar campo `updated_at` com timestamp atual
4. Retornar registro atualizado

#### Resposta de Sucesso (200 OK)

```json
{
  "id": 789,
  "usuario_id": 456,
  "data_hora": "2026-02-09T14:30:00Z",
  "intensidade_dor": 9,
  "contexto": "Crise desencadeada por estresse no trabalho e mudança brusca de temperatura",
  "duracao": "3 horas e 30 minutos",
  "sintomas_relatados": "Dor intensa generalizada, fadiga extrema, náusea, sensibilidade à luz",
  "observacoes": "Medicação de emergência administrada após 1 hora",
  "created_at": "2026-02-09T14:30:00Z",
  "updated_at": "2026-02-09T18:15:00Z"
}
```

#### Respostas de Erro

**400 Bad Request** - Dados inválidos

```json
{
  "erro": "Dados inválidos",
  "detalhes": [
    "Intensidade de dor deve estar entre 0 e 10",
    "Contexto é obrigatório e deve ter pelo menos 3 caracteres",
    "Data/hora não pode ser no futuro"
  ]
}
```

**403 Forbidden** - Tentativa de editar crise de outro usuário

```json
{
  "erro": "Acesso negado",
  "mensagem": "Você não tem permissão para editar esta crise"
}
```

**404 Not Found** - Crise não encontrada

```json
{
  "erro": "Crise não encontrada",
  "mensagem": "Crise com ID 789 não existe"
}
```

---

## Considerações de Segurança

1. **Autenticação e Autorização**
   - Sempre verificar JWT token
   - Sempre verificar se o recurso pertence ao usuário autenticado
   - Retornar 403 (não 404) para evitar enumeration attacks

2. **Validação de Entrada**
   - Sanitizar todos os inputs de texto
   - Validar tipos e ranges de números
   - Prevenir SQL injection usando prepared statements/ORMs

3. **Rate Limiting**
   - Considerar implementar rate limiting para prevenir abuso
   - Ex: Máximo de 10 edições por minuto por usuário

4. **Auditoria**
   - Manter logs de quem editou o quê e quando
   - Considerar tabela de histórico de alterações (opcional)

## Testes Necessários

### Testes Unitários

1. **Sintomas Diários**
   - ✅ Atualização bem-sucedida com dados válidos
   - ✅ Rejeitar atualização de registro de outro usuário
   - ✅ Rejeitar ID inexistente
   - ✅ Rejeitar intensidade fora do range 0-10
   - ✅ Rejeitar sintomas duplicados
   - ✅ Rejeitar regiões duplicadas
   - ✅ Aceitar observações vazias
   - ✅ Aceitar regiões de dor vazias
   - ✅ Rejeitar sintomas vazios

2. **Crises**
   - ✅ Atualização bem-sucedida com dados válidos
   - ✅ Rejeitar atualização de crise de outro usuário
   - ✅ Rejeitar ID inexistente
   - ✅ Rejeitar intensidade fora do range 0-10
   - ✅ Rejeitar contexto vazio
   - ✅ Rejeitar data no futuro
   - ✅ Aceitar campos opcionais vazios

### Testes de Integração

1. Testar fluxo completo: criar → editar → buscar
2. Testar rollback em caso de erro na transação
3. Testar atualização com token expirado
4. Testar atualização sem token

## Banco de Dados

### Schema Esperado

#### Tabela: `sintomas_diarios`

```sql
id               INT PRIMARY KEY AUTO_INCREMENT
usuario_id       INT NOT NULL (FK)
data             DATE NOT NULL
observacoes      TEXT
created_at       TIMESTAMP
updated_at       TIMESTAMP
```

#### Tabela: `sintomas_diarios_sintomas` (tabela intermediária)

```sql
id                    INT PRIMARY KEY AUTO_INCREMENT
sintoma_diario_id     INT NOT NULL (FK)
sintoma_id            INT NOT NULL (FK)
intensidade           INT NOT NULL (0-10)
```

#### Tabela: `sintomas_diarios_regioes` (tabela intermediária)

```sql
id                    INT PRIMARY KEY AUTO_INCREMENT
sintoma_diario_id     INT NOT NULL (FK)
regiao_id             INT NOT NULL (FK)
intensidade           INT NOT NULL (0-10)
```

#### Tabela: `crises`

```sql
id                   INT PRIMARY KEY AUTO_INCREMENT
usuario_id           INT NOT NULL (FK)
data_hora            DATETIME NOT NULL
intensidade_dor      INT NOT NULL (0-10)
contexto             VARCHAR(500) NOT NULL
duracao              VARCHAR(100)
sintomas_relatados   TEXT
observacoes          TEXT
created_at           TIMESTAMP
updated_at           TIMESTAMP
```

---

## Implementação Frontend (Já Implementada)

O frontend já está preparado para consumir estes endpoints:

### Serviço de Sintomas Diários (`services/symptoms-service.ts`)

```typescript
async update(id: number, data: Partial<DailyLog>): Promise<DailyLog> {
  const response = await api.put(`/api/sintomas-diarios/${id}`, data);
  return response.data;
}
```

### Serviço de Crises (`services/crises-service.ts`)

```typescript
async update(id: number, data: Partial<Crisis>): Promise<Crisis> {
  const response = await api.put(`/api/crises/${id}`, data);
  return response.data;
}
```

## Cronograma Sugerido

1. **Fase 1** (1-2 dias): Implementar endpoint PUT /api/crises/:id
2. **Fase 2** (2-3 dias): Implementar endpoint PUT /api/sintomas-diarios/:id
3. **Fase 3** (1 dia): Testes unitários e de integração
4. **Fase 4** (1 dia): Testes de integração com frontend
5. **Fase 5** (0.5 dia): Documentação da API

**Total estimado**: 5-7 dias

## Critérios de Aceitação

- [ ] Endpoint PUT /api/crises/:id implementado e funcional
- [ ] Endpoint PUT /api/sintomas-diarios/:id implementado e funcional
- [ ] Validações de segurança implementadas (verificação de propriedade)
- [ ] Validações de dados implementadas
- [ ] Testes unitários com cobertura >= 80%
- [ ] Documentação da API atualizada
- [ ] Frontend consegue editar crises com sucesso
- [ ] Frontend consegue editar sintomas diários com sucesso
- [ ] Logs de auditoria funcionando

## Documentação Adicional

- Swagger/OpenAPI spec deve ser atualizado
- README do backend deve incluir exemplos de requisições
- Incluir exemplos de curl para testar manualmente

## Contato

Para dúvidas sobre esta proposta ou sobre a integração frontend-backend, consulte:

- Documentação do frontend: `/docs/api-integration-prompt.md`
- Guia de estilo: `/docs/style-guide.md`
