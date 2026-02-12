## Why

Implementation of a "Support Network" (Rede de Apoio) feature to allow patients to manage trusted contacts and notify them during pain crises. This enhances the patient's safety and provides a structured way to request help or inform family/friends when needed.

## What Changes

- **New Data Model**: Introduction of a `SupportContact` model to store trusted contact information (name, phone, relationship).
- **CRUD Endpoints**: Implementation of API endpoints to list, create, and delete support contacts for the logged-in patient.
- **Crisis Notification Logic**: A new endpoint to trigger alerts to all registered support contacts when a crisis occurs.
- **Security Integration**: Ensure all support network operations are scoped to the authenticated patient.

## Capabilities

### New Capabilities
- `support-network-management`: Handles CRUD operations for trusted contacts and the logic for triggering notifications during crises.

### Modified Capabilities
- None

## Impact

- **Models**: New `SupportContact` table in `fibrolog_api/models.py`.
- **Database**: New migration to create the support contacts table.
- **API**: New router `fibrolog_api/routers/rede_apoio.py` and corresponding schemas in `fibrolog_api/schemas/support_network.py`.
- **Logic**: Simulation of notification dispatch (log-based or integrated service).
