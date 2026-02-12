## Context

Currently, the API allows listing and retrieving patients by ID, but lacks a dedicated endpoint for the logged-in patient to retrieve their own data (`/me` pattern). Additionally, the `Paciente` model does not store contact information like a phone number, which is a requirement for the profile screen.

## Goals / Non-Goals

**Goals:**
- Implement `GET /pacientes/me` for authenticated patients.
- Add a `celular` field to the `Paciente` model and schemas.
- Ensure the phone number is validated on the backend.
- Provide a clear prompt for frontend implementation.

**Non-Goals:**
- Implementing SMS verification or multi-factor authentication.
- Modifying other entities like `ContatoApoio` or `Medicacao`.

## Decisions

### 1. Data Model Update
Add a `celular` column to the `pacientes` table in the database.
- **Type**: `String(20)` (allows for international formats and masks).
- **Rationale**: Standard way to store phone numbers in relational databases.

### 2. Validation Logic
Use a Pydantic `field_validator` in `PacienteSchema` and `PacienteUpdate`.
- **Format**: Regex to support Brazilian format `(XX) 9XXXX-XXXX` or a generic international format.
- **Decision**: Support a flexible format but enforce digits-only or a specific pattern if necessary.

### 3. API Endpoint
Implement `GET /pacientes/me` in `fibrolog_api/routers/pacientes.py`.
- **Authentication**: Reuse `get_current_paciente` dependency.
- **Rationale**: Follows REST best practices for "current user" resources.

### 4. Frontend Integration Prompt
Create a Markdown file or a specific section in the documentation with a prompt for the Gemini CLI to help the user build the profile screen in the frontend.

## Risks / Trade-offs

- **[Risk] Data Migration** → Adding a new required field to an existing table with data.
  - **Mitigation**: Make the field optional in the database initially or provide a default empty string, then update existing records if necessary. For this project, we'll allow it to be nullable.
- **[Risk] Validation Complexity** → Different phone formats.
  - **Mitigation**: Use a broad enough regex or a library like `phonenumbers` (if preferred, but regex is simpler for now).
