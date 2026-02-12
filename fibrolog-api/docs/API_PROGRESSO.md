# Documentação da API - Endpoint de Progresso

## Visão Geral

Novo endpoint implementado para fornecer estatísticas de progresso do paciente com comparações temporais e insights automáticos.

---

## Endpoint

### `GET /estatisticas/progresso`

Retorna estatísticas de progresso do paciente autenticado com comparações entre períodos.

**Autenticação:** Bearer Token (JWT)

**Tags:** `Estatísticas`

---

## Request

### Headers

```http
Authorization: Bearer {access_token}
```

### Parâmetros

Nenhum parâmetro é necessário. O endpoint usa o paciente autenticado automaticamente.

---

## Response

### Status: 200 OK

```json
{
  "media_dor_semana": {
    "valor": 4.3,
    "variacao_percentual": -12.0,
    "tendencia": "baixa"
  },
  "dias_registrados_mes": {
    "valor": 29,
    "variacao_percentual": 15.0,
    "tendencia": "alta"
  },
  "crises_mes": {
    "valor": 3,
    "variacao_percentual": -33.0,
    "tendencia": "baixa"
  },
  "grafico_dor_semanal": [
    {
      "dia": "Seg",
      "data": "2026-02-05",
      "intensidade_dor": 6.0
    },
    {
      "dia": "Ter",
      "data": "2026-02-06",
      "intensidade_dor": 4.5
    },
    {
      "dia": "Qua",
      "data": "2026-02-07",
      "intensidade_dor": 7.0
    },
    {
      "dia": "Qui",
      "data": "2026-02-08",
      "intensidade_dor": 5.5
    },
    {
      "dia": "Sex",
      "data": "2026-02-09",
      "intensidade_dor": 3.0
    },
    {
      "dia": "Sáb",
      "data": "2026-02-10",
      "intensidade_dor": 6.5
    },
    {
      "dia": "Dom",
      "data": "2026-02-11",
      "intensidade_dor": null
    }
  ],
  "insights": [
    {
      "tipo": "success",
      "mensagem": "Seus níveis de dor diminuíram 12% em relação à semana passada",
      "icone": "📉"
    },
    {
      "tipo": "success",
      "mensagem": "Você registrou 29 dias este mês! Continue assim!",
      "icone": "📝"
    },
    {
      "tipo": "success",
      "mensagem": "Suas crises diminuíram 33% em relação ao mês passado",
      "icone": "✨"
    }
  ]
}
```

### Status: 401 Unauthorized

Retornado quando o token de autenticação não é fornecido ou é inválido.

```json
{
  "detail": "Not authenticated"
}
```

---

## Schemas

### `EstatisticasProgresso`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `media_dor_semana` | `MetricaProgresso` | Média de intensidade de dor da última semana |
| `dias_registrados_mes` | `MetricaProgresso` | Quantidade de dias com registros no mês atual |
| `crises_mes` | `MetricaProgresso` | Quantidade de crises no mês atual |
| `grafico_dor_semanal` | `List[DiaGrafico]` | Dados do gráfico de dor dos últimos 7 dias |
| `insights` | `List[Insight]` | Lista de insights automáticos |

### `MetricaProgresso`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `valor` | `float` | Valor atual da métrica |
| `variacao_percentual` | `float` ou `null` | Variação percentual em relação ao período anterior |
| `tendencia` | `string` | Tendência da métrica: `'alta'`, `'baixa'` ou `'neutro'` |

### `DiaGrafico`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `dia` | `string` | Abreviação do dia da semana (Seg, Ter, Qua, etc.) |
| `data` | `string` | Data no formato ISO (YYYY-MM-DD) |
| `intensidade_dor` | `float` ou `null` | Intensidade média da dor no dia (0-10), ou `null` se não houver registro |

### `Insight`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `tipo` | `string` | Tipo do insight: `'info'`, `'warning'`, `'success'`, `'danger'` |
| `mensagem` | `string` | Texto descritivo do insight |
| `icone` | `string` ou `null` | Emoji ou nome do ícone representativo |

---

## Regras de Negócio

### Cálculo de Métricas

1. **Média de dor da semana**:
   - Calculada a partir da média de todas as intensidades de dor registradas nos últimos 7 dias
   - Compara com a semana anterior (8 a 14 dias atrás)
   - Arredonda para 1 casa decimal

2. **Dias registrados no mês**:
   - Conta dias únicos com pelo menos um registro diário
   - Considera apenas o mês atual (a partir do dia 1)
   - Compara com o mês anterior completo

3. **Crises no mês**:
   - Conta quantidade de registros de crise no mês atual
   - Compara com o mês anterior completo

4. **Gráfico semanal**:
   - Sempre retorna 7 dias (últimos 7 dias a partir de hoje)
   - Dias sem registro terão `intensidade_dor: null`
   - Média calculada de todas as regiões de dor do dia

### Geração de Insights

Os insights são gerados automaticamente baseados nos dados:

1. **Insight de Dor**:
   - Diminuição > 5%: Insight positivo (success)
   - Aumento > 5%: Alerta (warning)
   - Variação <= 5%: Informativo (info)

2. **Insight de Registros**:
   - \> 20 dias: Parabenização (success)
   - 1-20 dias: Incentivo (info)
   - 0 dias: (não gera insight)

3. **Insight de Crises**:
   - 0 crises: Comemoração (success)
   - Diminuição: Positivo (success)
   - \> 5 crises: Alerta para consultar médico (warning)

### Interpretação de Tendências

- **Para dor e crises**: 
  - `'baixa'` é positivo (melhora)
  - `'alta'` é negativo (piora)
  
- **Para dias registrados**:
  - `'alta'` é positivo (mais engajamento)
  - `'baixa'` é negativo (menos engajamento)

---

## Exemplos de Uso

### cURL

```bash
curl -X GET "http://localhost:8000/estatisticas/progresso" \
  -H "Authorization: Bearer {seu_token_jwt}"
```

### JavaScript (Fetch API)

```javascript
const response = await fetch('http://localhost:8000/estatisticas/progresso', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const progressData = await response.json();
```

### Python (requests)

```python
import requests

headers = {'Authorization': f'Bearer {access_token}'}
response = requests.get(
    'http://localhost:8000/estatisticas/progresso',
    headers=headers
)
progress_data = response.json()
```

---

## Notas de Implementação

- O endpoint requer autenticação JWT válida
- Os dados são isolados por paciente (RN012)
- Apenas o paciente autenticado pode ver seus próprios dados
- Períodos de comparação são calculados dinamicamente
- Todos os cálculos consideram o timezone do servidor
- Valores `null` indicam ausência de dados para comparação

---

## Testes

Testes implementados em `tests/test_progresso.py`:

- ✅ Endpoint sem dados (retorna estrutura vazia)
- ✅ Endpoint com dados completos
- ✅ Comparação correta entre períodos
- ✅ Rejeição de requisições sem autenticação
- ✅ Isolamento de dados entre pacientes

Execute os testes:

```bash
pytest tests/test_progresso.py -v
```

---

## Arquivos Relacionados

- **Router**: `fibrolog_api/routers/estatisticas.py`
- **Schemas**: `fibrolog_api/schemas/progresso.py`
- **Testes**: `tests/test_progresso.py`
- **Documentação Frontend**: `docs/FRONTEND_PROGRESSO_PROMPT.md`

---

**Versão**: 1.0.0  
**Data**: 11/02/2026  
**Autor**: FibroLog API Team
