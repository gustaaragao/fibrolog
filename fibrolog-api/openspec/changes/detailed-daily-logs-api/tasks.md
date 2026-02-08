## 1. Schema Updates

- [x] 1.1 Update `RegistroDiarioPublic` in `fibrolog_api/schemas/registro_diario.py` to include `symptoms` and `painRegions` fields using existing entry schemas.
- [x] 1.2 Ensure field names in `RegistroDiarioPublic` match frontend expectations (`symptoms`, `painRegions`).

## 2. Router Implementation

- [x] 2.1 Update `get_registros_diarios` in `fibrolog_api/routers/registros_diarios.py` to use `selectinload` for fetching associations.
- [x] 2.2 Update `get_registro_diario` (single entry) to also fetch associations.
- [x] 2.3 Map the database models (`sintomas`, `regioes_dor`) to the schema fields (`symptoms`, `painRegions`) in the response logic.

## 3. Verification and Documentation

- [x] 3.1 Update `test_get_registros_diarios` in `tests/test_registros_diarios.py` to verify that the returned logs contain the detailed data.
- [x] 3.2 Add a new test case for `GET /registros-diarios/{id}` verifying details.
- [x] 3.3 Create a prompt for the frontend developers to implement the API integration.
