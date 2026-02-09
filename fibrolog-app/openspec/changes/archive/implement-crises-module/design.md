## Context

The FibroLog application needs a way for users to track acute pain events (crises) and quickly reach out to their support network. The backend provides a `/crises` endpoint for CRUD operations.

## Goals / Non-Goals

**Goals:**
- Implement a complete CRUD for Crises (Create, Read, Update, Delete).
- Provide a history list of crises.
- Implement a "Notify Support Network" feature that initiates phone calls.

**Non-Goals:**
- SMS notifications (only phone calls via dialer).
- Real-time location sharing.
- Advanced analytics for crises (just listing and details).

## Decisions

- **Crises Service**: A new `services/crises-service.ts` will be created using the existing `api` utility from `services/api.ts`.
- **Support Service**: A new `services/support-service.ts` will handle fetching support network contacts.
- **UI Architecture**:
  - `app/crisis.tsx`: Main screen listing crises history with a floating action button (FAB) or prominent button to add a new crisis.
  - New components for the Crisis Form (reusing UI components like `Input`, `TextArea`, `Button`, `Select`).
- **Intensity Selector**: A custom 0-10 scale component (or a simple `Select`/slider) for `intensidade_dor`.
- **Native Linking**: Use `react-native`'s `Linking.openURL('tel:${phoneNumber}')` for the support network feature.
- **Error Handling**: Standard try/catch around service calls with user feedback via `Alert` or error messages in the UI.

## Risks / Trade-offs

- **[Risk]** API endpoint structure might differ slightly from expectations. → **Mitigation**: Implement flexible services and verify with real backend calls early.
- **[Risk]** User has no support contacts registered. → **Mitigation**: Show an informative message or redirect to the support network setup screen if empty.
- **[Trade-off]** Using `Linking.openURL` instead of an in-app dialer. → **Rationale**: Simpler implementation and respects user's preferred dialer app.
