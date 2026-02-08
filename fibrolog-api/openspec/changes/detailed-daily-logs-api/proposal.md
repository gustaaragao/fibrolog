## Why

Patients and developers need to see the details of their daily logs (symptoms and pain regions) when listing or retrieving a specific log. Currently, the API only returns the main log entry without its associated details, making it difficult to review historical data.

## What Changes

- Modify `GET /registros-diarios/` to include nested symptoms and pain regions for each record.
- Modify `GET /registros-diarios/{id}` to include nested symptoms and pain regions.
- Ensure the data structure matches the frontend expectations for visualization.

## Capabilities

### New Capabilities
- `detailed-daily-logs`: Provides full details (symptoms and pain regions) when retrieving daily logs.

### Modified Capabilities
- `registro-diario-sintomas`: Update retrieval requirements to include detailed associations.

## Impact

- `fibrolog_api/routers/registros_diarios.py`: Logic update to fetch relations.
- `fibrolog_api/schemas/registro_diario.py`: Update schemas to include lists of symptoms and pain regions.
- Frontend: Requires update to handle the detailed response (handled by the prompt requested).
