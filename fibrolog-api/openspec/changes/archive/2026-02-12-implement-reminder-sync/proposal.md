## Why
Patients need a way to manage and synchronize their reminders (General, Medication, Exam) between different devices and the central server to ensure they don't miss important health-related events and maintain consistency across their digital profile.

## What Changes
- Implement a new `Reminder` (lembretes) database model in SQLAlchemy.
- Create Pydantic schemas for Reminder creation, update, and response validation.
- Develop a suite of RESTful endpoints under `/pacientes/lembretes` for full CRUD operations.
- Implement strict JWT-based ownership validation to ensure data privacy.
- Support specialized fields for different reminder types (e.g., dosage/interval for medications, date for exams).

## Capabilities

### New Capabilities
- `reminder-management`: End-to-end management of patient reminders, allowing for synchronization of general, medication, and exam-related notifications.

### Modified Capabilities
- (None)

## Impact
- `fibrolog_api/models.py`: Addition of the `Reminder` model.
- `fibrolog_api/schemas/`: New schema file for reminder data structures.
- `fibrolog_api/routers/`: New router or additions to existing patient routers for reminder endpoints.
- `migrations/`: New Alembic migration for the `lembretes` table.
- `tests/`: Integration tests for the new reminder functionality.
