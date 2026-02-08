# Prompt para Desenvolvimento da API - Registros Diários (FibroLog)

## Contexto

O **FibroLog** é um aplicativo mobile para monitoramento de sintomas da fibromialgia. Pacientes registram diariamente seus sintomas, locais de dor em um mapa corporal interativo, e intensidade de cada sintoma/dor.

## Objetivo

Criar ou refatorar o endpoint da API backend para suportar o registro completo de sintomas diários, incluindo:

- Sintomas selecionados com suas intensidades (escala 0-10)
- Regiões do corpo com dor e suas respectivas intensidades (escala 0-10)
- Observações opcionais do paciente
- Timestamp do registro

---

## 1. Estrutura do Endpoint

### POST `/registros-diarios`

**Autenticação**: Bearer Token (JWT) - obrigatório

**Descrição**: Cria um novo registro diário de sintomas e dor para o paciente autenticado.

### Request Body

```json
{
  "symptoms": [
    {
      "id": "1",
      "intensity": 7
    },
    {
      "id": "5",
      "intensity": 4
    }
  ],
  "painRegions": [
    {
      "id": "24",
      "intensity": 8
    },
    {
      "id": "10",
      "intensity": 5
    }
  ],
  "notes": "Hoje acordei com muita dor nas costas. O clima está chuvoso.",
  "timestamp": "2026-02-07T14:30:00.000Z"
}
```

### Estrutura dos Dados

**symptoms**: Array de objetos

- `id` (string, obrigatório): Identificador do sintoma
  - Valores possíveis: "1" (Dor de Cabeça), "2" (Dor nas Costas), "3" (Cansaço), "4" (Insônia), "5" (Rigidez), "6" (Névoa Mental), "7" (Ansiedade), "8" (Depressão)
- `intensity` (number, obrigatório): Intensidade do sintoma
  - Escala: 0 (sem sintoma) a 10 (sintoma muito intenso)

**painRegions**: Array de objetos

- `id` (string, obrigatório): ID da região corporal selecionada no mapa
  - Valores possíveis: "1" até "50" (correspondem às 50 regiões definidas no SVG do BodyMap)
- `intensity` (number, obrigatório): Intensidade da dor naquela região
  - Escala: 0 (sem dor) a 10 (dor máxima)

**notes** (string, opcional): Observações adicionais do paciente

**timestamp** (string ISO 8601, obrigatório): Data e hora do registro

### Response Success (201 Created)

```json
{
  "id": 123,
  "paciente_id": 45,
  "data_registro": "2026-02-07T14:30:00.000Z",
  "message": "Registro criado com sucesso"
}
```

### Response Error (400 Bad Request)

```json
{
  "detail": "Dados inválidos: symptoms é obrigatório"
}
```

### Response Error (401 Unauthorized)

```json
{
  "detail": "Token inválido ou expirado"
}
```

---

## 2. Sugestão de Schema do Banco de Dados

### Tabela: `registros_diarios`

| Coluna        | Tipo                    | Descrição                |
| ------------- | ----------------------- | ------------------------ |
| id            | SERIAL PRIMARY KEY      | ID único do registro     |
| paciente_id   | INTEGER NOT NULL        | FK para tabela pacientes |
| data_registro | TIMESTAMP NOT NULL      | Data/hora do registro    |
| observacoes   | TEXT                    | Observações opcionais    |
| criado_em     | TIMESTAMP DEFAULT NOW() | Timestamp de criação     |

### Tabela: `registro_sintomas`

| Coluna      | Tipo                                                            | Descrição                 |
| ----------- | --------------------------------------------------------------- | ------------------------- |
| id          | SERIAL PRIMARY KEY                                              | ID único                  |
| registro_id | INTEGER NOT NULL                                                | FK para registros_diarios |
| sintoma_id  | VARCHAR(10) NOT NULL                                            | ID do sintoma ("1" a "8") |
| intensidade | INTEGER NOT NULL CHECK (intensidade >= 0 AND intensidade <= 10) | Intensidade 0-10          |

### Tabela: `registro_regioes_dor`

| Coluna      | Tipo                                                            | Descrição                          |
| ----------- | --------------------------------------------------------------- | ---------------------------------- |
| id          | SERIAL PRIMARY KEY                                              | ID único                           |
| registro_id | INTEGER NOT NULL                                                | FK para registros_diarios          |
| regiao_id   | VARCHAR(10) NOT NULL                                            | ID da região corporal ("1" a "50") |
| intensidade | INTEGER NOT NULL CHECK (intensidade >= 0 AND intensidade <= 10) | Intensidade da dor 0-10            |

---

## 3. Regras de Negócio

1. **Autenticação Obrigatória**: Extrair `paciente_id` do token JWT
2. **Validação de Dados**:
   - `symptoms` pode ser array vazio (mas deve existir)
   - `painRegions` pode ser array vazio (mas deve existir)
   - `timestamp` deve ser ISO 8601 válido
   - `intensity` deve estar entre 0 e 10
   - `symptom_id` deve estar entre "1" e "8"
   - `region_id` deve estar entre "1" e "50"
3. **Transação Atômica**: Salvar registro principal e itens relacionados em uma única transação
4. **Evitar Duplicatas**: Validar se já existe registro para o mesmo paciente no mesmo minuto (opcional)

---

## 4. Endpoints Futuros (Planejamento)

### GET `/registros-diarios`

Retorna histórico de registros do paciente autenticado.

**Query Parameters**:

- `data_inicio` (ISO 8601): Data inicial do período
- `data_fim` (ISO 8601): Data final do período
- `limit` (number): Número máximo de registros (padrão: 30)
- `offset` (number): Paginação (padrão: 0)

**Response**:

```json
{
  "registros": [
    {
      "id": 123,
      "data_registro": "2026-02-07T14:30:00.000Z",
      "observacoes": "...",
      "symptoms": [...],
      "painRegions": [...]
    }
  ],
  "total": 50,
  "limit": 30,
  "offset": 0
}
```

### GET `/registros-diarios/{id}`

Retorna detalhes de um registro específico.

### PUT `/registros-diarios/{id}`

Atualiza um registro existente (permitir apenas nas primeiras 24h).

### DELETE `/registros-diarios/{id}`

Remove um registro (soft delete recomendado).

### GET `/registros-diarios/estatisticas`

Retorna estatísticas agregadas:

- Sintomas mais frequentes
- Regiões corporais com mais dor
- Evolução temporal
- Heatmap de intensidade

---

## 5. Referência: IDs das Regiões Corporais

O mapa corporal possui 50 regiões selecionáveis, divididas em:

**Cabeça e Pescoço**: 1-4
**Ombros e Braços**: 5-16
**Mãos e Dedos**: 17-35
**Tronco/Torso**: 36-38
**Quadril e Pernas**: 39-44
**Pés**: 45-50

_Nota_: O frontend envia apenas os IDs numéricos como string ("1" a "50"). O backend pode opcionalmente mapear para nomes descritivos.

---

## 6. Exemplo de Implementação (FastAPI/Python)

```python
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

router = APIRouter(prefix="/registros-diarios", tags=["Registros Diários"])

class SymptomEntry(BaseModel):
    id: str = Field(..., pattern="^[1-8]$")
    intensity: int = Field(..., ge=0, le=10)

class PainRegionEntry(BaseModel):
    id: str = Field(..., pattern="^([1-9]|[1-4][0-9]|50)$")
    intensity: int = Field(..., ge=0, le=10)

class RegistroDiarioCreate(BaseModel):
    symptoms: List[SymptomEntry]
    painRegions: List[PainRegionEntry]
    notes: Optional[str] = None
    timestamp: datetime

@router.post("/", status_code=status.HTTP_201_CREATED)
async def criar_registro(
    registro: RegistroDiarioCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Lógica de criação do registro
    novo_registro = RegistroDiario(
        paciente_id=current_user.id,
        data_registro=registro.timestamp,
        observacoes=registro.notes
    )
    db.add(novo_registro)
    db.flush()

    # Adicionar sintomas
    for symptom in registro.symptoms:
        db.add(RegistroSintoma(
            registro_id=novo_registro.id,
            sintoma_id=symptom.id,
            intensidade=symptom.intensity
        ))

    # Adicionar regiões de dor
    for region in registro.painRegions:
        db.add(RegistroRegiaoDor(
            registro_id=novo_registro.id,
            regiao_id=region.id,
            intensidade=region.intensity
        ))

    db.commit()

    return {
        "id": novo_registro.id,
        "paciente_id": current_user.id,
        "data_registro": novo_registro.data_registro,
        "message": "Registro criado com sucesso"
    }
```

---

## 7. Testes Recomendados

1. **Teste de Autenticação**: Requisição sem token deve retornar 401
2. **Teste de Validação**: Intensidade fora do range (ex: 11) deve retornar 400
3. **Teste de Registro Completo**: Com symptoms e painRegions preenchidos
4. **Teste de Registro Mínimo**: Com arrays vazios mas válidos
5. **Teste de Integridade**: Verificar se sintomas e regiões foram salvos corretamente
6. **Teste de Performance**: Registro com 8 sintomas + 50 regiões (carga máxima)

---

## 8. Considerações de Segurança

1. **Rate Limiting**: Limitar a 10 registros por hora por paciente
2. **Validação de Ownership**: Paciente só pode acessar seus próprios registros
3. **Sanitização**: Limpar campo `notes` para prevenir XSS
4. **Auditoria**: Registrar logs de criação/modificação para rastreabilidade

---

## 9. Próximos Passos

Após implementar o endpoint POST, considere:

1. Dashboard com visualização de heatmap das regiões de dor
2. Gráficos de evolução temporal dos sintomas
3. Exportação de relatórios em PDF
4. Notificações/alertas baseados em padrões de piora
5. Compartilhamento seguro de dados com profissionais de saúde
