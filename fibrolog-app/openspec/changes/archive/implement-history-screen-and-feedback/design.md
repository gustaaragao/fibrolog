## Context

The application needs a way for users to view their past symptom registrations (History). Additionally, the user experience for saving symptoms needs to be improved with clear feedback and automatic navigation.

## Goals / Non-Goals

**Goals:**
- Implement a functional History screen (`app/history.tsx`) that lists daily logs.
- Update `DailyLogService` to support fetching historical data.
- Improve `app/symptoms.tsx` with a success toast, success message (Alert), and redirection to the home screen.
- Match the visual identity of the project (pink theme).

**Non-Goals:**
- Editing or deleting past logs (out of scope for this change).
- Advanced filtering or search in the history list.

## Decisions

### 1. Data Fetching
**Decision**: Add `getAll()` to `DailyLogService`.
**Rationale**: Centralizes API logic. It will use `api.get('/registros-diarios/')` which automatically includes the authentication token.
**Alternatives**: Fetching directly in the component using `fetch`, but that breaks the service pattern.

### 2. Feedback Mechanism
**Decision**: Use both `react-native-toast-message` and `Alert.alert`.
**Rationale**: The user requested both a toast and a success message. The toast provides non-intrusive confirmation, while the Alert ensures the user sees the success before being redirected.
**Alternatives**: Using only a toast, but it might be missed during the transition to the home screen.

### 3. Navigation Flow
**Decision**: Redirect to `/home` using `router.push` or `router.replace` after the success alert is dismissed.
**Rationale**: Ensures a smooth user flow after a successful action.
**Alternatives**: Staying on the symptoms screen, but the user requested redirection.

### 4. History Screen UI
**Decision**: Use `FlatList` for performance and `MaterialIcons` for consistency with the home screen.
**Rationale**: `FlatList` is the standard way to render lists in React Native. Matching the home screen's design (cards, pink colors) provides a cohesive experience.

## Risks / Trade-offs

- [Risk] Empty History → Mitigation: Show a friendly "No records found" message.
- [Risk] Slow API Response → Mitigation: Use a loading state (spinner) while fetching history.
- [Risk] Data format mismatch → Mitigation: Ensure the `DailyLogPayload` or a similar interface is used for the list items.
