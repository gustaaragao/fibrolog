## Context

The current reminder system is purely local, using `AsyncStorage`. This prevents data persistence across devices and limits server-side notification capabilities. We need to bridge the frontend with a FastAPI backend to synchronize reminders while maintaining high availability and offline support.

## Goals / Non-Goals

**Goals:**
- Implement a Local-First synchronization strategy: actions are immediate locally and eventually consistent with the backend.
- Create a comprehensive prompt for the FastAPI backend implementation.
- Refactor `reminder-service.ts` to integrate with the backend API.
- Maintain support for categorized reminders (Medicamento, Exame, Geral).

**Non-Goals:**
- Real-time WebSocket synchronization (HTTP REST is sufficient for this scope).
- Server-side notification triggering (this design focus is on data sync; scheduling remains local for now).

## Decisions

### 1. Synchronization Strategy: Local-First with Background Sync
- **Rationale**: Ensures the app remains snappy and works offline.
- **Approach**: All CRUD operations update the local state immediately. A background promise or service call then attempts to sync with the backend. If the sync fails, the item remains marked as "not synced".

### 2. Enhanced Data Model for Sync
Add a `synced` flag and a `backendId` (if different from local UUID) to the `Reminder` interface to track synchronization status.

### 3. API Contract (REST)
- `GET /pacientes/lembretes/`: List all reminders for the authenticated patient.
- `POST /pacientes/lembretes/`: Create a new reminder.
- `PATCH /pacientes/lembretes/{id}/`: Toggle active status or update details.
- `DELETE /pacientes/lembretes/{id}/`: Remove a reminder.

### 4. Backend Implementation Prompt
A dedicated markdown file in `docs/` will serve as the "Source of Truth" for the other repository, containing:
- SQLAlchemy models matching the frontend `Reminder` structure.
- Pydantic schemas for validation.
- CRUD logic ensuring each patient only accesses their own reminders.

## Risks / Trade-offs

- **[Risk] Conflict Resolution** → **Mitigation**: Simplistic "Last Write Wins" based on local timestamps, as reminders are usually managed by a single user.
- **[Risk] Sync Latency** → **Mitigation**: Provide visual feedback (spinner or icon) in the UI when a reminder is pending sync.
- **[Risk] Partial Sync** → **Mitigation**: On app boot, perform a full "reconciliation" fetch to ensure local storage matches the server.
