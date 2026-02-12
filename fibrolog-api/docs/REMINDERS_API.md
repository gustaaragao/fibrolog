# API de Lembretes - Sincronização

Esta API permite que o paciente gerencie seus lembretes (Geral, Medicamento, Exame) e os mantenha sincronizados entre dispositivos.

**Prefixo:** `/pacientes/lembretes`
**Autenticação:** Requer Bearer Token (JWT)

## Modelos de Dados

### Tipos de Lembrete
- `geral`: Lembretes simples (ex: "Beber água").
- `medicamento`: Requer `dosagem` e `intervalo` (em horas).
- `exame`: Requer `data_exame`.

---

## Endpoints

### 1. Listar Lembretes
Retorna todos os lembretes do paciente logado.

- **URL:** `GET /pacientes/lembretes/`
- **Resposta:** `200 OK` (Array de objetos)

### 2. Criar Lembrete
Cria um novo lembrete. O ID pode ser gerado pelo frontend (UUID v4 recomendado).

- **URL:** `POST /pacientes/lembretes/`
- **Corpo:**
```json
{
  "id": "opcional-uuid-v4",
  "titulo": "Tomar Remédio",
  "tipo": "medicamento",
  "hora": 8,
  "minuto": 0,
  "dosagem": "1 comprimido",
  "intervalo": 12,
  "ativo": true
}
```
- **Resposta:** `201 Created`

### 3. Atualizar Lembrete (Patch)
Atualiza parcialmente um lembrete (ex: toggle de `ativo`).

- **URL:** `PATCH /pacientes/lembretes/{id}`
- **Corpo:** Enviar apenas os campos que deseja alterar.
- **Resposta:** `200 OK`

### 4. Excluir Lembrete
Remove permanentemente o lembrete.

- **URL:** `DELETE /pacientes/lembretes/{id}`
- **Resposta:** `204 No Content`

---

## Regras de Validação
- `hora`: 0 a 23.
- `minuto`: 0 a 59.
- Se `tipo == "medicamento"`, `dosagem` e `intervalo` são **obrigatórios**.
- Se `tipo == "exame"`, `data_exame` é **obrigatório**.
