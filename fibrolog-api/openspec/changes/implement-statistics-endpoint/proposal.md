## Why

The frontend currently relies on mock data for displaying patient statistics. Implementing a dedicated backend endpoint will provide users with real, data-driven insights into their condition, including pain trends, symptom frequency, and treatment adherence.

## What Changes

- **New Endpoint**: `GET /api/v1/estatisticas/dashboard` to return aggregated statistics for the authenticated patient.
- **Data Aggregation**: Implementation of server-side logic to calculate:
  - Total daily records and crises.
  - Active days (unique days with records).
  - Average pain intensity across all recorded regions.
  - Most frequent symptom.
  - Current streak of consecutive days with records.
  - Overall adherence rate since account creation.
- **Authentication**: Strict JWT-based authentication to ensure patients only access their own data.

## Capabilities

### New Capabilities
- `dashboard-statistics`: Aggregates patient health data (records, crises, symptoms, pain regions) into actionable dashboard metrics.

### Modified Capabilities
- None

## Impact

- **API**: New router `fibrolog_api/routers/estatisticas.py` and integration in `fibrolog_api/app.py`.
- **Schemas**: New Pydantic models in `fibrolog_api/schemas/estatisticas.py`.
- **Database**: Complex aggregation queries involving `registros_diarios`, `crises`, `registro_sintomas`, and `registro_regioes_dor`.
