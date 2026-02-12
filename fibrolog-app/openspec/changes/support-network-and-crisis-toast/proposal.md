## Why

The app currently lacks a dedicated interface for managing a Support Network and does not provide immediate feedback (toasts) when a crisis is registered. Integrating the Support Network with the crisis registration flow is critical for patient safety, allowing for immediate notification of trusted contacts.

## What Changes

- **New Support Network Screen**: Implementation of a UI for managing trusted contacts (add, edit, delete) based on the provided design.
- **Support Service Integration**: Implementation of API routes and service logic for managing the Support Network.
- **Crisis Flow Enhancement**: Addition of a confirmation prompt to "Notify Support Network" upon registering a new crisis.
- **Crisis Registration Feedback**: Fix for the missing toast notification after successfully registering a crisis.
- **Notification Prompt**: Generation of a prompt/service logic to handle the notification of the support network.

## Capabilities

### New Capabilities
- `support-network`: Management of trusted contacts and integration with crisis notifications.
- `crisis-management`: Core logic for registering crises, providing feedback (toasts), and triggering support network alerts.

### Modified Capabilities
- `api-client`: Support for new support network and crisis notification endpoints.

## Impact

- **UI Components**: `app/support.tsx`, `app/crisis-form.tsx`, `components/ui/Toast.tsx` (if needed).
- **Services**: `services/support-service.ts`, `services/crises-service.ts`, `services/notification-service.ts`.
- **API**: New endpoints for support network CRUD and notification triggers.
