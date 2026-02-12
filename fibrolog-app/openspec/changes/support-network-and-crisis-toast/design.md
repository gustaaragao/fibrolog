## Context

The FibroLog application needs to enhance its crisis management capabilities by allowing users to notify a pre-configured Support Network (Rede de Apoio). Currently, the "Support Network" screen is a placeholder, and the crisis registration flow lacks both the notification trigger and visual feedback (toasts).

## Goals / Non-Goals

**Goals:**
- Implement a fully functional "Support Network" screen for CRUD operations on trusted contacts.
- Integrate a "Notify Support Network" prompt into the `app/crisis-form.tsx` submission flow.
- Add `Toast` notifications using `react-native-toast-message` to the crisis registration process.
- Implement the backend communication for notifying the support network via `supportService.notify()`.

**Non-Goals:**
- Implementing the actual SMS/Email/Push notification delivery system (this is handled by the backend).
- Modifying other parts of the crisis history or details unless necessary for feedback consistency.

## Decisions

### 1. Support Network UI Implementation
**Decision**: Use a list-based UI with a "Floating Action Button" (FAB) or a top "Add" button to manage contacts, following the Pink/Purple theme established in the project.
**Rationale**: Consistency with the design provided in `Rede de Apoio.png` and other app screens like `app/history.tsx`.

### 2. Crisis Notification Flow
**Decision**: After successful crisis creation in `app/crisis-form.tsx`, use `Alert.alert` to ask the user if they want to notify their support network.
**Rationale**: A modal alert ensures the user makes a conscious choice in a critical moment (crisis registration).
**Alternatives**: A toggle in the form itself. However, a post-submission prompt ensures the crisis is already saved before triggering notifications.

### 3. Toast Feedback Integration
**Decision**: Use `react-native-toast-message` for success and error feedback in `app/crisis-form.tsx`.
**Rationale**: This library is already used across the project (`app/_layout.tsx`, `app/symptoms.tsx`, etc.). It provides non-intrusive feedback that doesn't block navigation.

### 4. Support Service Extension
**Decision**: Add a `notify()` method to `services/support-service.ts` that calls a new POST endpoint `/rede-apoio/notificar`.
**Rationale**: Separates the concern of managing contacts from the action of notifying them.

## Risks / Trade-offs

- **[Risk]** User might accidentally dismiss the notification prompt. → **Mitigation**: Ensure the crisis is already saved so the data isn't lost.
- **[Risk]** API failure during notification trigger. → **Mitigation**: Show an error toast but don't revert the crisis registration.
- **[Trade-off]** Using `Alert.alert` for the prompt might feel "old-school" compared to a custom modal. → **Mitigation**: It's reliable and follows the established pattern in the app.
