## Why

Implement the backend infrastructure for the "Registro Diário de Sintomas" feature. This allows patients to record their symptoms and pain regions daily, providing essential data for monitoring fibromyalgia progression and sharing with healthcare professionals.

## What Changes

- **New Endpoint**: `POST /registros-diarios` to receive and validate daily symptom logs.
- **Validation Schemas**: Implementation of Pydantic models for nested symptom and pain region data, including intensity validation (0-10).
- **Authentication Integration**: Extraction of `paciente_id` from JWT tokens for all registration requests.
- **Database Persistence**: Integration with the existing database layer (SQLAlchemy/SQLModel) to store records, symptom details, and pain region maps in a single transaction.

## Capabilities

### New Capabilities
- `daily-symptoms-api`: API endpoint, Pydantic validation, and database persistence layer for daily symptom and pain region recording.

### Modified Capabilities
- None.

## Impact

- **Backend**: New routes and schemas in the FastAPI application.
- **Database**: Introduction or utilization of `registros_diarios`, `registro_sintomas`, and `registro_regioes_dor` tables.
- **Authentication**: Dependency on the existing JWT authentication system.
