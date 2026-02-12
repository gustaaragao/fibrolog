## Why

Patients need a way to retrieve their own profile information to populate the frontend profile screen. Additionally, capturing contact information like a phone number is essential for communication and better patient management.

## What Changes

- **New Route**: Add `GET /pacientes/me` to retrieve the current logged-in patient's data.
- **Data Requirement**: Ensure the full name is included in the response.
- **New Field**: Add a `celular` (phone number) field to the `Paciente` model.
- **Validation**: Implement backend validation for the phone number format.
- **Frontend Prompt**: Generate a description/prompt for implementing the profile UI using the Gemini CLI.

## Capabilities

### New Capabilities
- `paciente-profile`: Management of the patient's own profile data, including retrieval and contact information updates.

### Modified Capabilities
- `paciente-management`: (Assuming this might exist or be relevant) Extend patient schema and model to include the phone field.

## Impact

- **Database**: Migration required to add `celular` column to the `pacientes` table.
- **Schemas**: Update `Paciente` Pydantic schemas to include the new field.
- **Routers**: New endpoint in `pacientes.py`.
- **API**: New capability for patients to access their own data.
