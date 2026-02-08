## Context

The FibroLog system currently lacks a dedicated API for daily symptom logging. While the `RegistroDiario`, `RegistroSintoma`, and `RegistroRegiaoDor` models are already defined in `models.py`, we need to implement the schemas and endpoints to allow patients to submit this data from the frontend.

## Goals / Non-Goals

**Goals:**
- Implement Pydantic schemas that match the frontend payload (nested symptoms and pain regions).
- Create a `POST /registros-diarios` endpoint.
- Ensure all related data (main log, symptoms, pain regions) is saved in a single atomic transaction.
- Standardize error responses for validation and database failures.

**Non-Goals:**
- Implementing a frontend for this feature.
- Historical data migration for old log formats (if any).
- Advanced analytics or report generation (this belongs to a separate feature).

## Decisions

### 1. Schema Structure
We will use nested Pydantic schemas to represent the complete daily log.
- `DailyLogCreate`: Main schema containing `symptoms`, `painRegions`, `notes`, and `timestamp`.
- `SymptomEntry`: Sub-schema for `{id, intensity}`.
- `PainRegionEntry`: Sub-schema for `{id, intensity}`.

**Rationale:** This directly maps to the JSON structure provided by the frontend, simplifying validation and processing.

### 2. Implementation Pattern: Router and Service
We will implement the logic in `fibrolog_api/routers/registros_diarios.py`.
- The endpoint will use `get_current_user` dependency to associate the log with the correct patient.
- We will use SQLAlchemy's transactional management (`db.commit()`) to ensure atomicity.

**Rationale:** Follows the existing project pattern for other resources like `pacientes` and `medicacoes`.

### 3. Database Atomicity
The endpoint will:
1. Create the `RegistroDiario` entry.
2. Iterate through `symptoms` and `painRegions`, creating `RegistroSintoma` and `RegistroRegiaoDor` instances linked to the main entry.
3. Flush and commit the transaction.

**Rationale:** Guarantees that we don't end up with "orphan" records if part of the save fails.

## Risks / Trade-offs

- **[Risk] High volume of log details** → Mitigation: Use bulk inserts if performance becomes an issue, though daily logs are typically small (few symptoms/regions).
- **[Risk] Schema Mismatch** → Mitigation: Strict Pydantic validation and unit tests matching the provided frontend payload.
- **[Trade-off] String IDs for regions/symptoms** → We use `String(10)` in models to allow flexibility (e.g., "S1", "P24") instead of integers, matching the frontend's string IDs.

## Migration Plan

1. Run Alembic migrations (if any schema changes are needed, though existing models seem sufficient).
2. Deploy the new router in `app.py`.
3. Rollback: If deployment fails, revert the router inclusion in `app.py`.
