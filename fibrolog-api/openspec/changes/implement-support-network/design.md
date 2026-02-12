## Context

The FibroLog system already has initial models for `ContatoApoio` (Support Contacts) and `Alerta` (Alerts) in `fibrolog_api/models.py`, but they are not yet exposed via API endpoints or fully integrated into the crisis workflow. This design aims to provide the necessary CRUD operations and the logic to trigger notifications.

## Goals / Non-Goals

**Goals:**
- Implement RESTful endpoints for managing `ContatoApoio`.
- Implement an endpoint to trigger notifications to all registered support contacts.
- Leverage the existing `Alerta` model to record when a notification is triggered.
- Ensure all operations are properly scoped to the authenticated patient.

**Non-Goals:**
- Implementing real SMS or email delivery (will be simulated via logs for now).
- Managing multiple types of alerts (focusing only on crisis notifications).

## Decisions

### 1. Reuse existing models
- **Decision**: Use `ContatoApoio` and `Alerta` instead of creating new ones.
- **Rationale**: Reduces redundancy and leverages existing database structure.
- **Alternatives**: Creating a new `SupportNetwork` table. Rejected because `ContatoApoio` already contains the necessary fields (`nome`, `telefone`, `parentesco`).

### 2. Router Placement
- **Decision**: Create a new router `fibrolog_api/routers/rede_apoio.py`.
- **Rationale**: Keeps the codebase organized and follows the existing pattern of separating concerns by feature.

### 3. Notification Simulation
- **Decision**: Implement a utility function or service that logs the notification details.
- **Rationale**: Provides a placeholder for future integration with real messaging services (e.g., Twilio, AWS SNS) without adding immediate complexity.

## Risks / Trade-offs

- **[Risk]** → Missing real notification delivery might mislead users during testing.
- **[Mitigation]** → Clear logging and API response indicating that the notification was "simulated".
- **[Risk]** → Duplicate contacts for the same patient.
- **[Mitigation]** → API validation to check if a contact with the same phone/email already exists for that patient.
