## Context
The FibroLog system currently lacks a centralized way for patients to synchronize their reminders between devices. This design introduces a new `Reminder` entity and a corresponding API to manage general, medication, and exam reminders.

## Goals / Non-Goals

**Goals:**
- Provide a robust API for CRUD operations on reminders.
- Ensure strict ownership validation (patients can only see/edit their own reminders).
- Support specialized metadata for different reminder types (medication vs. exam).
- Allow client-side UUID generation to facilitate offline-first synchronization on the frontend.

**Non-Goals:**
- Implementation of the actual notification delivery system (push/local notifications) is out of scope for the API; the API only manages the synchronization of the notification schedules.
- Historical logging of dismissed reminders (only current active/inactive status is tracked).

## Decisions

### 1. Unified Table with Type-Specific Columns
**Decision:** Use a single `lembretes` table with nullable columns for type-specific data (`dosagem`, `intervalo`, `data_exame`).
- **Rationale:** Keeps the schema simple for a relatively small number of variations. Avoids the complexity of Table-per-Hierarchy (TPH) or Table-per-Type (TPT) for only 3 types.
- **Alternatives:** Creating separate tables for `MedicationReminder` and `ExamReminder`. This was rejected to avoid excessive joins and multiple endpoints for similar objects.

### 2. Client-Generated IDs
**Decision:** Allow the `id` field (String/UUID) to be provided by the client during creation.
- **Rationale:** Critical for frontend synchronization. The mobile app can generate a UUID locally while offline and sync it later without ID collisions or needing a mapping table.
- **Alternatives:** Server-only IDs. This makes offline-first sync significantly more complex as the client would need to update its local references after the first sync.

### 3. Pydantic-Based Polymorphic Validation
**Decision:** Use Pydantic's `root_validator` (or `model_validator` in v2) to enforce field presence based on the `tipo` field.
- **Rationale:** Ensures data integrity at the API layer without complex database triggers.
- **Alternatives:** Database-level CHECK constraints. While safer, these are harder to manage with Alembic across different DB backends and provide less friendly error messages than Pydantic.

## Risks / Trade-offs

- **[Risk] Data inconsistency in type-specific fields** → **Mitigation**: Strict Pydantic validation ensures that `dosagem` is present if type is `medicamento`, etc.
- **[Risk] Unauthorized access** → **Mitigation**: Every database query for a reminder by ID will include a filter for `paciente_id` derived from the JWT token.
- **[Risk] Large number of reminders per patient** → **Mitigation**: Add an index on `paciente_id` in the `lembretes` table.
