## 1. Schema and Initial Setup

- [x] 1.1 Create `fibrolog_api/schemas/estatistica.py` with `EstatisticasDashboard` Pydantic model
- [x] 1.2 Create `fibrolog_api/routers/estatisticas.py` with basic router setup and authentication dependency

## 2. Core Implementation (Logic & Queries)

- [x] 2.1 Implement `get_dashboard_statistics` endpoint in `fibrolog_api/routers/estatisticas.py`
- [x] 2.2 Add SQLAlchemy aggregation queries for total records, crises, and active days
- [x] 2.3 Add SQLAlchemy aggregation for average pain intensity (joining `RegistroRegiaoDor`)
- [x] 2.4 Add query for most frequent symptom from `RegistroSintoma`
- [x] 2.5 Implement Python utility/logic for calculating the current streak of consecutive days
- [x] 2.6 Implement logic for adherence rate (records / days since diagnosis/creation)

## 3. Integration

- [x] 3.1 Register the new estatisticas router in `fibrolog_api/app.py`
- [x] 3.2 Ensure proper exception handling for null values and new patients

## 4. Verification

- [x] 4.1 Create `tests/test_estatisticas.py`
- [x] 4.2 Add test case for successful statistics retrieval with existing data
- [x] 4.3 Add test case for new patient (zero/null values)
- [x] 4.4 Add test case for unauthorized access (no token)
- [x] 4.5 Verify streak calculation logic with various date gaps
