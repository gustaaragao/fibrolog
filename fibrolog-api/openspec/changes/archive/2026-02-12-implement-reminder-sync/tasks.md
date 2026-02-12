## 1. Database and Models

- [x] 1.1 Create SQLAlchemy model `Lembrete` in `fibrolog_api/models.py` with fields: id (string/uuid), paciente_id, titulo, tipo, hora, minuto, ativo, dosagem, intervalo, data_exame, created_at, updated_at
- [x] 1.2 Generate and run Alembic migration to create the `lembretes` table

## 2. Schemas and Validation

- [x] 2.1 Create Pydantic schemas in `fibrolog_api/schemas/reminders.py`: `ReminderBase`, `ReminderCreate`, `ReminderUpdate`, `ReminderResponse`
- [x] 2.2 Implement polymorphic validation in `ReminderCreate` to ensure `dosagem`/`intervalo` are present for medication and `data_exame` for exams

## 3. Router and Endpoints

- [x] 3.1 Create `fibrolog_api/routers/lembretes.py` and register it in `fibrolog_api/app.py`
- [x] 3.2 Implement `GET /` to list current patient's reminders
- [x] 3.3 Implement `POST /` to create a new reminder (supporting client-side IDs)
- [x] 3.4 Implement `PATCH /{id}` for partial updates and ownership validation
- [x] 3.5 Implement `DELETE /{id}` for removal and ownership validation

## 4. Testing and Documentation

- [x] 4.1 Create integration tests in `tests/test_reminders.py` covering all CRUD scenarios and ownership enforcement
- [x] 4.2 Create a markdown file `docs/REMINDERS_API.md` explaining the routes for the frontend team
