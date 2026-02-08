## Why

Patients with fibromyalgia need a structured way to record their daily symptoms and pain levels. Providing a digital log allows for better monitoring of the condition's progression and helps healthcare providers make informed decisions based on longitudinal data.

## What Changes

- Implementation of Pydantic schemas for daily symptom and pain region logging.
- Creation of a new FastAPI endpoint `POST /registros-diarios` to receive and validate daily logs.
- Integration with the database to store daily records, symptoms, and pain regions in a single transaction.
- Update to the authentication dependency to ensure logs are linked to the correct patient.

## Capabilities

### New Capabilities
- `registro-diario-sintomas`: Defines the requirements for capturing symptoms (ID and intensity) and pain regions (ID from BodyMap and intensity), along with optional notes and timestamps.

### Modified Capabilities
<!-- None -->

## Impact

- `fibrolog_api/schemas/`: New schemas for daily logs.
- `fibrolog_api/routers/registros_diarios.py`: New or updated routes for handling daily logs.
- `fibrolog_api/models.py`: Database models for `registros_diarios`, `registro_sintomas`, and `registro_regioes_dor`.
- `fibrolog_api/database.py`: Transactional logic for saving complex log data.
