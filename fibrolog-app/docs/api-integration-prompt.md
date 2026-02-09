# Prompt para Desenvolvimento do Backend (FastAPI + Pydantic)

## Contexto
Você é um desenvolvedor backend especialista em Python e FastAPI. Estamos desenvolvendo o **FibroLog**, um sistema de monitoramento para pacientes com fibromialgia. O frontend (React Native/Expo) já possui uma tela de registro diário que envia dados de sintomas e localização da dor.

## Objetivo
Implementar ou refatorar os schemas Pydantic e os endpoints FastAPI para o recurso de **Registro Diário de Sintomas**.

## Requisitos Técnicos

### 1. Payload do Frontend
O backend deve ser capaz de receber e validar exatamente a seguinte estrutura JSON (enviada via `POST /registros-diarios`):

```json
{
  "symptoms": [
    { "id": "1", "intensity": 7 },
    { "id": "5", "intensity": 4 }
  ],
  "painRegions": [
    { "id": "24", "intensity": 8 },
    { "id": "10", "intensity": 5 }
  ],
  "notes": "Texto livre de observações...",
  "timestamp": "2026-02-08T14:30:00.000Z"
}
```

### 2. Validações Necessárias (Pydantic)
- `symptoms`: Lista de objetos. Cada objeto deve ter `id` (string) e `intensity` (inteiro de 0 a 10).
- `painRegions`: Lista de objetos. Cada objeto deve ter `id` (string, representando uma das 50 regiões do BodyMap) e `intensity` (inteiro de 0 a 10).
- `notes`: String opcional.
- `timestamp`: String ISO 8601 ou objeto datetime.

### 3. Sugestão de Endpoint
Implemente um endpoint `POST` que:
1. Extraia o ID do usuário do token JWT (dependência de autenticação).
2. Valide os dados de entrada usando o schema Pydantic.
3. Salve o registro principal e os detalhes (sintomas e regiões) no banco de dados em uma única transação.
4. Retorne `201 Created` com o ID do registro gerado.

### 4. Modelo de Dados (Referência)
Considere três tabelas relacionadas:
- `registros_diarios`: id, paciente_id, data_registro, observacoes.
- `registro_sintomas`: id, registro_id, sintoma_id, intensidade.
- `registro_regioes_dor`: id, registro_id, regiao_id, intensidade.

## Instrução Adicional
Adapte o código para seguir as convenções de projeto já existentes (use `SQLAlchemy` ou `SQLModel` se já estiverem em uso). Garanta que os erros de validação retornem o formato padrão do FastAPI (422 Unprocessable Entity) ou um erro 400 amigável.

---
**Nota para o Gemini**: Se houver código de autenticação ou configuração de banco de dados já implementado no repositório, use as classes e métodos existentes.
