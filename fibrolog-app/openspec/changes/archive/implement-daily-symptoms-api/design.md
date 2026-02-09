## Context

The FibroLog application requires a robust backend API to receive daily symptom reports from patients. The frontend sends a JSON payload containing lists of symptoms and pain regions (with intensities 0-10), notes, and a timestamp. The backend (FastAPI) must validate this data, extract the user identity from a JWT, and persist the data into three related tables: `registros_diarios`, `registro_sintomas`, and `registro_regioes_dor`.

## Goals / Non-Goals

**Goals:**
- Define Pydantic schemas for request validation matching the frontend payload precisely.
- Specify the API endpoint `POST /registros-diarios`.
- Define the database transaction logic to ensure atomicity across the three related tables.
- Integrate with existing JWT authentication mechanisms.

**Non-Goals:**
- Frontend implementation (already exists).
- Historical data migration.
- Implementation of complex analytics or reporting features in this phase.

## Decisions

### 1. Pydantic Schemas for Nested Data
- **Decision**: Use nested Pydantic models (e.g., `SymptomEntry`, `PainRegionEntry`, `DailyLogCreate`) to validate the request payload.
- **Rationale**: Provides robust validation, automatic type conversion, and clear OpenAPI documentation.
- **Alternative**: Manual dictionary validation, which is brittle and less maintainable.

### 2. Transactional Database Persistence
- **Decision**: Use a single SQLAlchemy transaction to save the main log and its detail entries (symptoms and pain regions).
- **Rationale**: Prevents data inconsistency where a log might exist without its corresponding details if an error occurs mid-save.
- **Alternative**: Sequential saves without a transaction, risking orphaned records.

### 3. JWT Authentication Integration
- **Decision**: Utilize existing authentication dependencies (likely in `security.py`) to resolve the patient ID from the Bearer token.
- **Rationale**: Consistent security model across the entire API.

## Risks / Trade-offs

- **[Risk] Data Integrity** → **Mitigation**: Implement strict Pydantic validation and database-level constraints.
- **[Risk] Database Performance** → **Mitigation**: Ensure proper indexing on `paciente_id` and `timestamp` fields.
- **[Risk] API Versioning** → **Mitigation**: Follow existing route patterns and consider future versioning if the payload structure needs to change significantly.
