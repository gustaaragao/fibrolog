## Context

Currently, the `registros-diarios` router only supports creation (POST), listing (GET), and retrieval by ID (GET). Although POST implicitly updates records for the same day (RN006), explicit PUT and DELETE operations are missing for better API ergonomics and full resource control.

## Goals / Non-Goals

**Goals:**
- Implement `PUT /registros-diarios/{id}` for explicit updates.
- Implement `DELETE /registros-diarios/{id}` for record removal.
- Ensure only the owner can perform these actions.
- Reuse existing mapping logic and schemas where possible.

**Non-Goals:**
- Changing the RN006 behavior in POST (it will remain as is).
- Refactoring the polymorphic model structure.

## Decisions

- **Reuse `DailyLogCreate` for PUT**: The `DailyLogCreate` schema contains all necessary fields for an update. We'll use it for the PUT endpoint to maintain consistency with POST.
- **Ownership Validation**: We will query the record by `id` AND `paciente_id` (from current user) to ensure authorization. If not found, return 404.
- **Cascade Delete**: Rely on SQLAlchemy's `cascade='all, delete-orphan'` on the `sintomas` and `regioes_dor` relationships in `RegistroDiario` model to clean up child records during deletion.
- **Update Strategy**: When updating via PUT, we will clear existing symptoms/regions and re-add them, similar to the logic in `create_registro_diario`.

## Risks / Trade-offs

- **[Risk]** Accidental deletion of records. → **Mitigation**: Standard DELETE operation requires the specific record ID and authentication.
- **[Trade-off]** Re-adding symptoms instead of patching. → **Rationale**: Simpler implementation and consistent with existing POST logic.
