## 1. Data Model & Migration

- [x] 1.1 Add `celular` field to `Paciente` model in `fibrolog_api/models.py`
- [x] 1.2 Create Alembic migration to add `celular` column to `pacientes` table
- [x] 1.3 Run migration to update local database

## 2. Schema & Validation

- [x] 2.1 Update `PacientePublic` schema in `fibrolog_api/schemas/paciente.py` to include `celular`
- [x] 2.2 Update `PacienteSchema` and `PacienteUpdate` to include `celular` field
- [x] 2.3 Implement phone number validation in `fibrolog_api/schemas/paciente.py` using a regex field validator

## 3. API Implementation

- [x] 3.1 Implement `GET /pacientes/me` endpoint in `fibrolog_api/routers/pacientes.py`
- [x] 3.2 Ensure the endpoint uses the `get_current_paciente` dependency for authentication
- [x] 3.3 Verify that the response includes all required fields, especially `nome` (full name)

## 4. Documentation & Frontend Integration

- [x] 4.1 Create a frontend implementation prompt for Gemini CLI (e.g., `docs/FRONTEND_PROFILE_PROMPT.md`)
- [x] 4.2 Verify all requirements from `spec.md` are met through tests or manual verification
