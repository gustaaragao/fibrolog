## Why

Currently, patients can create daily records (registros diários) but cannot update or delete them. This leads to data entry errors that cannot be corrected and prevents users from managing their history effectively. Providing these operations is essential for a complete CRUD experience and better data quality.

## What Changes

- **Update Daily Record**: New endpoint to modify existing daily records, including symptoms and intensity.
- **Delete Daily Record**: New endpoint to remove a daily record.
- **Ownership Validation**: Ensure only the patient who created the record can update or delete it.

## Capabilities

### New Capabilities
- `registro-diario-management`: CRUD operations for daily patient symptoms and records.

### Modified Capabilities
- (None - no existing specs found)

## Impact

- **API**: New PUT and DELETE methods in `fibrolog_api/routers/registros_diarios.py`.
- **Schemas**: New Pydantic schemas for update requests in `fibrolog_api/schemas/registro_diario.py`.
- **Database**: Use existing SQLAlchemy models in `fibrolog_api/models.py`.
- **Tests**: New test cases in `tests/test_registros_diarios.py`.
