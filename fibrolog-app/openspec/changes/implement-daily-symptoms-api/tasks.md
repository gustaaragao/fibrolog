## 1. Pydantic Schemas

- [x] 1.1 Create `SymptomEntry` and `PainRegionEntry` schemas in `fibrolog_api/schemas/registro_diario.py` with 0-10 intensity validation.
- [x] 1.2 Create `DailyLogCreate` schema to handle nested lists of symptoms and pain regions.

## 2. API Route Implementation

- [x] 2.1 Implement `POST /registros-diarios` endpoint in `fibrolog_api/routers/registros_diarios.py`.
- [x] 2.2 Add `get_current_paciente` dependency to extract user identity from JWT.
- [x] 2.3 Integrate request validation using the `DailyLogCreate` schema.

## 3. Database Persistence & Transactions

- [x] 3.1 Implement database models if not fully present for symptoms and pain regions in `fibrolog_api/models.py`.
- [x] 3.2 Add transaction logic to ensure atomicity when saving the main record and its details.
- [x] 3.3 Ensure proper error handling and 422/400 responses for validation failures.

## 4. Verification

- [x] 4.1 Write automated tests in `tests/test_registros_diarios.py` for successful submission and validation failures.
- [x] 4.2 Verify database integrity after multiple submissions (checking relationships).
