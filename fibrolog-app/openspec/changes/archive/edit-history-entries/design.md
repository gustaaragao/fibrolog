# Design: Sistema de Edição de Registros no Histórico

## Visão Geral

Este documento descreve o design técnico da funcionalidade de edição de registros históricos (crises e sintomas diários) no sistema FibroLog.

## Arquitetura

### Diagrama de Fluxo - Edição de Sintomas Diários

```
┌─────────────┐
│  Frontend   │
│  (React     │
│  Native)    │
└──────┬──────┘
       │ PUT /api/sintomas-diarios/:id
       │ { sintomas: [...], regioes_dor: [...], observacoes: "..." }
       ▼
┌──────────────────────────────────────────────────┐
│           Backend API (Node.js/Express)          │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  1. Middleware: Autenticação JWT         │   │
│  │     ├─ Validar token                     │   │
│  │     └─ Extrair userId                    │   │
│  └──────────────────────────────────────────┘   │
│                    ▼                             │
│  ┌──────────────────────────────────────────┐   │
│  │  2. Middleware: Validação de Dados       │   │
│  │     ├─ Validar estrutura do body         │   │
│  │     ├─ Validar tipos e ranges            │   │
│  │     └─ Verificar duplicatas               │   │
│  └──────────────────────────────────────────┘   │
│                    ▼                             │
│  ┌──────────────────────────────────────────┐   │
│  │  3. Controller                           │   │
│  │     └─ Chamar Service.update()           │   │
│  └──────────────────────────────────────────┘   │
│                    ▼                             │
│  ┌──────────────────────────────────────────┐   │
│  │  4. Service (Business Logic)             │   │
│  │     ├─ Verificar ownership               │   │
│  │     ├─ Iniciar transação                 │   │
│  │     ├─ Deletar relações antigas          │   │
│  │     ├─ Inserir novas relações            │   │
│  │     ├─ Atualizar timestamps              │   │
│  │     └─ Commit/Rollback                   │   │
│  └──────────────────────────────────────────┘   │
│                    ▼                             │
│  ┌──────────────────────────────────────────┐   │
│  │  5. Database Layer                       │   │
│  │     ├─ UPDATE sintomas_diarios           │   │
│  │     ├─ DELETE sintomas intermediários    │   │
│  │     ├─ INSERT sintomas intermediários    │   │
│  │     ├─ DELETE regioes intermediárias     │   │
│  │     └─ INSERT regioes intermediárias     │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
       │
       │ 200 OK: { id, sintomas, regioes_dor, ... }
       ▼
┌─────────────┐
│  Frontend   │
│  Atualiza   │
│  UI         │
└─────────────┘
```

### Diagrama de Fluxo - Edição de Crises

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │ PUT /api/crises/:id
       │ { intensidade_dor, contexto, duracao, ... }
       ▼
┌──────────────────────────────────────────────────┐
│           Backend API                            │
│                                                  │
│  1. Autenticação JWT                             │
│  2. Validação de Dados                           │
│  3. Controller                                   │
│  4. Service                                      │
│      ├─ Verificar ownership                      │
│      ├─ Validar data não no futuro               │
│      ├─ UPDATE crises                            │
│      └─ Atualizar updated_at                     │
│  5. Database                                     │
└──────────────────────────────────────────────────┘
       │
       │ 200 OK: { id, intensidade_dor, contexto, ... }
       ▼
┌─────────────┐
│  Frontend   │
└─────────────┘
```

## Modelo de Dados

### Diagrama ER

```
┌─────────────────────┐
│    usuarios         │
├─────────────────────┤
│ id (PK)             │
│ nome                │
│ email               │
│ ...                 │
└──────────┬──────────┘
           │
           │ 1:N
           │
     ┌─────┴─────┬──────────────────────────┐
     │           │                          │
     ▼           ▼                          ▼
┌──────────┐ ┌─────────────────┐  ┌─────────────────┐
│ crises   │ │sintomas_diarios │  │ contatos_apoio  │
├──────────┤ ├─────────────────┤  ├─────────────────┤
│ id (PK)  │ │ id (PK)         │  │ id (PK)         │
│ usuario_id│ │ usuario_id (FK) │  │ usuario_id (FK) │
│ data_hora│ │ data            │  │ nome            │
│ intensid.│ │ observacoes     │  │ telefone        │
│ contexto │ │ created_at      │  │ relacao         │
│ duracao  │ │ updated_at      │  └─────────────────┘
│ sintomas │ └────────┬────────┘
│ observ.  │          │
│ created  │          │ 1:N
│ updated  │          │
└──────────┘     ┌────┴───────────────────────┐
                 │                            │
                 ▼                            ▼
     ┌──────────────────────┐  ┌────────────────────────┐
     │sintomas_diarios_     │  │sintomas_diarios_       │
     │sintomas              │  │regioes                 │
     ├──────────────────────┤  ├────────────────────────┤
     │ id (PK)              │  │ id (PK)                │
     │ sintoma_diario_id(FK)│  │ sintoma_diario_id (FK) │
     │ sintoma_id (FK)      │  │ regiao_id (FK)         │
     │ intensidade          │  │ intensidade            │
     └──────────┬───────────┘  └──────────┬─────────────┘
                │                         │
                │ N:1                     │ N:1
                ▼                         ▼
     ┌──────────────────┐      ┌──────────────────┐
     │    sintomas      │      │    regioes_dor   │
     ├──────────────────┤      ├──────────────────┤
     │ id (PK)          │      │ id (PK)          │
     │ nome             │      │ nome             │
     │ icone            │      │ descricao        │
     └──────────────────┘      └──────────────────┘
```

## Decisões de Design

### 1. Transações para Sintomas Diários

**Problema**: Atualizar sintomas diários envolve múltiplas operações no banco de dados:

- UPDATE do registro principal
- DELETE de sintomas antigos
- INSERT de novos sintomas
- DELETE de regiões antigas
- INSERT de novas regiões

**Solução**: Usar transações de banco de dados

**Justificativa**:

- Garante atomicidade (all-or-nothing)
- Previne inconsistências
- Permite rollback em caso de erro
- Mantém integridade referencial

**Implementação**:

```typescript
async updateDailyLog(id: number, userId: number, data: UpdateDailyLogDto) {
  const transaction = await db.startTransaction();

  try {
    // 1. Verificar ownership
    const existing = await db.sintomas_diarios.findOne({ id, usuario_id: userId });
    if (!existing) throw new ForbiddenError();

    // 2. Atualizar registro principal
    await db.sintomas_diarios.update(id, {
      data: data.data,
      observacoes: data.observacoes,
      updated_at: new Date(),
    }, { transaction });

    // 3. Deletar sintomas antigos
    await db.sintomas_diarios_sintomas.delete({ sintoma_diario_id: id }, { transaction });

    // 4. Inserir novos sintomas
    for (const sintoma of data.sintomas) {
      await db.sintomas_diarios_sintomas.insert({
        sintoma_diario_id: id,
        sintoma_id: sintoma.sintoma_id,
        intensidade: sintoma.intensidade,
      }, { transaction });
    }

    // 5. Deletar regiões antigas
    await db.sintomas_diarios_regioes.delete({ sintoma_diario_id: id }, { transaction });

    // 6. Inserir novas regiões
    for (const regiao of data.regioes_dor) {
      await db.sintomas_diarios_regioes.insert({
        sintoma_diario_id: id,
        regiao_id: regiao.regiao_id,
        intensidade: regiao.intensidade,
      }, { transaction });
    }

    await transaction.commit();

    // 7. Retornar registro completo
    return await this.getDailyLogById(id);

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### 2. Verificação de Ownership

**Problema**: Usuários não devem poder editar registros de outros usuários.

**Solução**: Verificação de propriedade em todas as operações de edição.

**Implementação**:

```typescript
async verifyOwnership(userId: number, resourceId: number, resourceType: 'crise' | 'dailyLog') {
  let query;

  if (resourceType === 'crise') {
    query = await db.crises.findOne({ id: resourceId, usuario_id: userId });
  } else {
    query = await db.sintomas_diarios.findOne({ id: resourceId, usuario_id: userId });
  }

  if (!query) {
    throw new ForbiddenError('Você não tem permissão para editar este registro');
  }

  return true;
}
```

### 3. Validação de Dados

**Problema**: Dados inválidos podem corromper o banco de dados.

**Solução**: Camada de validação robusta usando schemas.

**Implementação com Joi/Zod**:

```typescript
const updateDailyLogSchema = Joi.object({
  data: Joi.date().iso().max("now").required(),
  sintomas: Joi.array()
    .min(1)
    .items(
      Joi.object({
        sintoma_id: Joi.number().integer().positive().required(),
        intensidade: Joi.number().integer().min(0).max(10).required(),
      }),
    )
    .unique((a, b) => a.sintoma_id === b.sintoma_id)
    .required(),
  regioes_dor: Joi.array()
    .items(
      Joi.object({
        regiao_id: Joi.number().integer().positive().required(),
        intensidade: Joi.number().integer().min(0).max(10).required(),
      }),
    )
    .unique((a, b) => a.regiao_id === b.regiao_id),
  observacoes: Joi.string().max(1000).allow("", null),
});
```

### 4. Tratamento de Erros

**Problema**: Erros podem ocorrer em várias camadas.

**Solução**: Hierarquia de erros customizados + middleware global.

**Implementação**:

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(404, message);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(403, message);
  }
}

class ValidationError extends AppError {
  constructor(
    public details: string[],
    message = "Dados inválidos",
  ) {
    super(400, message);
  }
}

// Middleware global de erro
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      erro: err.message,
      detalhes: err instanceof ValidationError ? err.details : undefined,
    });
  }

  console.error(err);
  return res.status(500).json({
    erro: "Erro interno do servidor",
  });
});
```

### 5. Auditoria

**Problema**: Necessidade de rastrear mudanças para compliance e troubleshooting.

**Solução**: Tabela de logs de auditoria.

**Schema**:

```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,  -- 'update_crisis', 'update_daily_log'
  resource_type VARCHAR(50) NOT NULL,  -- 'crise', 'sintoma_diario'
  resource_id INT NOT NULL,
  old_values JSON,  -- Opcional: valores antes
  new_values JSON,  -- Opcional: valores depois
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  INDEX idx_resource (resource_type, resource_id)
);
```

**Implementação**:

```typescript
async logAudit(data: {
  userId: number;
  action: string;
  resourceType: string;
  resourceId: number;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  await db.audit_logs.insert({
    usuario_id: data.userId,
    action: data.action,
    resource_type: data.resourceType,
    resource_id: data.resourceId,
    old_values: JSON.stringify(data.oldValues),
    new_values: JSON.stringify(data.newValues),
    ip_address: data.ipAddress,
    user_agent: data.userAgent,
    created_at: new Date(),
  });
}
```

### 6. Rate Limiting

**Problema**: Prevenir abuso de endpoints de edição.

**Solução**: Rate limiting por usuário.

**Implementação com express-rate-limit**:

```typescript
import rateLimit from "express-rate-limit";

const updateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 requisições por minuto
  message: {
    erro: "Muitas requisições",
    mensagem: "Você excedeu o limite de edições. Tente novamente em 1 minuto.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit por usuário, não por IP
    return req.user?.id?.toString() || req.ip;
  },
});

// Aplicar em rotas específicas
router.put(
  "/api/crises/:id",
  authenticate,
  updateLimiter,
  crisesController.update,
);
router.put(
  "/api/sintomas-diarios/:id",
  authenticate,
  updateLimiter,
  sintomasDiariosController.update,
);
```

## Performance

### Otimizações

1. **Índices de Banco de Dados**

   ```sql
   -- Índice composto para verificação rápida de ownership
   CREATE INDEX idx_sintomas_diarios_user_id ON sintomas_diarios(id, usuario_id);
   CREATE INDEX idx_crises_user_id ON crises(id, usuario_id);

   -- Índices para deleção rápida de relações
   CREATE INDEX idx_sintomas_diarios_sintomas_log ON sintomas_diarios_sintomas(sintoma_diario_id);
   CREATE INDEX idx_sintomas_diarios_regioes_log ON sintomas_diarios_regioes(sintoma_diario_id);
   ```

2. **Caching** (Opcional para versão futura)
   - Cache de sintomas e regiões (raramente mudam)
   - Invalidar cache do usuário após update
   - Usar Redis ou similar

3. **Batch Operations**
   - Usar bulk insert para sintomas/regiões quando possível
   - Exemplo com Sequelize:
     ```typescript
     await SintomasDiariosSintomas.bulkCreate(
       data.sintomas.map((s) => ({
         sintoma_diario_id: id,
         sintoma_id: s.sintoma_id,
         intensidade: s.intensidade,
       })),
       { transaction },
     );
     ```

## Segurança

### Checklist de Segurança

- [x] Autenticação JWT obrigatória
- [x] Verificação de ownership
- [x] Validação rigorosa de inputs
- [x] Sanitização de strings (prevenir XSS)
- [x] Prepared statements (prevenir SQL injection)
- [x] Rate limiting
- [x] Logs de auditoria
- [x] HTTPS obrigatório em produção
- [x] Validação de tipos TypeScript
- [x] Erro 403 (não 404) para recursos não autorizados

### OWASP Top 10 Compliance

| Vulnerabilidade                   | Mitigação Implementada                         |
| --------------------------------- | ---------------------------------------------- |
| A01: Broken Access Control        | Verificação de ownership em todas as operações |
| A02: Cryptographic Failures       | HTTPS, senhas hasheadas, JWTs assinados        |
| A03: Injection                    | Prepared statements, validação de inputs       |
| A04: Insecure Design              | Transações, rollbacks, validações robustas     |
| A05: Security Misconfiguration    | Configurações seguras de produção              |
| A07: Identification/Auth Failures | JWT com expiração, refresh tokens              |
| A10: Server-Side Request Forgery  | Validação de URLs, whitelist de domínios       |

## Escalabilidade

### Considerações Futuras

1. **Soft Deletes**
   - Em vez de DELETE, usar flags `deleted_at`
   - Permite recuperação de dados

2. **Versionamento de Registros**
   - Manter histórico de todas as edições
   - Tabela `sintomas_diarios_versions`

3. **WebSockets para Atualizações em Tempo Real**
   - Notificar outros dispositivos do usuário sobre mudanças
   - Usar Socket.io ou similar

4. **Cache Distribuído**
   - Redis cluster para ambientes multi-servidor
   - Cache de sessões JWT

5. **Banco de Dados Read Replicas**
   - Separar leituras de escritas
   - Master-slave replication

## Monitoramento

### Métricas Importantes

1. **Performance**
   - Tempo de resposta de PUT requests
   - Tempo de transação no banco de dados
   - Taxa de sucesso de transações

2. **Uso**
   - Número de edições por dia/hora
   - Usuários mais ativos
   - Endpoints mais usados

3. **Erros**
   - Taxa de erro 400/403/404/500
   - Rollbacks de transação
   - Falhas de validação

### Ferramentas Sugeridas

- **APM**: New Relic, DataDog, Sentry
- **Logs**: Winston, Morgan
- **Metrics**: Prometheus + Grafana

## Referências

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Database Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
