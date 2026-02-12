## 1. Schemas and Data Models

- [x] 1.1 Create Pydantic schemas for `ContatoApoio` (Create, Read, Update) in `fibrolog_api/schemas/support_network.py`
- [x] 1.2 Update `fibrolog_api/schemas/__init__.py` to export the new schemas
- [x] 1.3 Verify existing `ContatoApoio` and `Alerta` models in `fibrolog_api/models.py` (ensure they match requirements)

## 2. API Implementation

- [x] 2.1 Implement `GET /rede-apoio/` to list patient's support contacts
- [x] 2.2 Implement `POST /rede-apoio/` to add a new support contact with validation
- [x] 2.3 Implement `DELETE /rede-apoio/{id}` to remove a support contact
- [x] 2.4 Implement `POST /rede-apoio/notificar` to trigger a simulated crisis notification
- [x] 2.5 Register the new router in `fibrolog_api/app.py`

## 3. Logic and Utilities

- [x] 3.1 Create a notification service/utility to log simulated alerts
- [x] 3.2 Implement logic to record a new `Alerta` record when notifications are triggered

## 4. Testing and Verification

- [x] 4.1 Create tests for CRUD operations in `tests/test_rede_apoio.py`
- [x] 4.2 Create tests for the notification endpoint and verify alert recording
- [x] 4.3 Verify security: ensure patients can only manage their own contacts
