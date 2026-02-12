## Why

Reminders are currently stored only locally via `AsyncStorage`. To ensure data persistence across multiple devices, allow for data recovery after app reinstallation, and enable future server-side features like push notifications, we need to synchronize these reminders with a FastAPI backend.

## What Changes

- **Backend Development Prompt**: Create a specialized markdown file (`docs/backend-reminders-prompt.md`) containing the FastAPI models, schemas, and endpoints required to handle categorized reminders (General, Medication, Exam).
- **Frontend API Integration**:
  - Update `reminder-service.ts` to perform CRUD operations via the backend API.
  - Implement a synchronization strategy (Local-First with Backend Sync).
- **Categorized Reminders Support**: Ensure the backend models support the specialized metadata (dosagem, intervalo, dataExame) introduced in previous frontend updates.

## Capabilities

### New Capabilities
- `reminder-sync-api`: API client implementation for synchronizing local reminder data with the FastAPI database.

### Modified Capabilities
- `reminder-management`: Update existing local CRUD logic to include background synchronization triggers.

## Impact

- **Services**: Refactoring of `reminder-service.ts` to include API calls.
- **Documentation**: New architecture guide for backend developers in `docs/`.
- **User Experience**: Seamless transitions between devices while maintaining offline-ready functionality.
