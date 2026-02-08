## 1. Pydantic Schemas

- [x] 1.1 Create `SymptomEntry` and `PainRegionEntry` schemas in `fibrolog_api/schemas/registro_diario.py` with intensity validation (0-10)
- [x] 1.2 Create `DailyLogCreate` schema matching the frontend payload structure (symptoms, painRegions, notes, timestamp)
- [x] 1.3 Create `DailyLogResponse` schema to return the created log ID

## 2. API Router Implementation

- [x] 2.1 Create or update `fibrolog_api/routers/registros_diarios.py` with a `POST /` endpoint
- [x] 2.2 Integrate `get_current_user` dependency to extract and use the patient's ID
- [x] 2.3 Implement the logic to create the main `RegistroDiario` entry and its related `RegistroSintoma` and `RegistroRegiaoDor` entries
- [x] 2.4 Ensure database atomicity by using a single transaction commit

## 3. Integration and Verification

- [x] 3.1 Register the `registros_diarios` router in `fibrolog_api/app.py`
- [x] 3.2 Create a unit test in `tests/test_registros_diarios.py` to verify a successful log submission
- [x] 3.3 Create a unit test to verify validation errors (e.g., invalid intensity)
- [x] 3.4 Create a unit test to verify authentication requirement
