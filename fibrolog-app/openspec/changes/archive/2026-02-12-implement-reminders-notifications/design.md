## Context

The FibroLog application needs to support patient adherence through a local reminder system. Currently, `app/reminder.tsx` is a basic placeholder. We need to implement a full CRUD interface for reminders and integrate with `expo-notifications` for local scheduling. This involves managing notification permissions and persistence using `AsyncStorage`.

## Goals / Non-Goals

**Goals:**
- Provide a UI for creating, listing, toggling, and deleting reminders.
- Integrate `expo-notifications` to trigger local alerts on Android and Web.
- Persist reminder data locally across app restarts.
- Handle notification permission requests gracefully.

**Non-Goals:**
- Server-side notification scheduling (push notifications).
- Syncing reminders across multiple devices.
- Complex recurring patterns beyond "daily" (at least for initial phase).

## Decisions

### 1. Library Choice: `expo-notifications`
- **Rationale:** Standard Expo library for notifications, provides a unified API for Android and Web.
- **Alternatives:** `react-native-push-notification` (too complex for local-only Expo apps), `Notifee` (powerful but requires manual linking/config-plugins and might be overkill for simple local alerts).

### 2. Storage: `AsyncStorage`
- **Rationale:** Reminders are small JSON objects. `AsyncStorage` is already used in the project (`utils/storage.ts`) and is sufficient for this volume of data.
- **Alternatives:** `SQLite` (overkill for simple lists), `expo-secure-store` (better for secrets, not needed for reminder text).

### 3. Scheduling Strategy: Local Only
- **Rationale:** To minimize complexity and avoid backend dependencies, notifications will be scheduled locally on the device. When a reminder is added or toggled ON, the app will schedule a local notification using `Notifications.scheduleNotificationAsync`.

### 4. Component Structure
- **ReminderList**: Main container in `app/reminder.tsx`.
- **ReminderItem**: Individual row with toggle and delete actions.
- **TimePicker**: Using `@react-native-community/datetimepicker` (already in `package.json`).

## Risks / Trade-offs

- **[Risk] Web Support** → **Mitigation**: Expo Notifications has limited support on Web compared to native. We will use the Web Notification API fallback provided by Expo, but inform the user that the browser must stay open or support Service Workers for reliability.
- **[Risk] Battery Optimization (Android)** → **Mitigation**: Modern Android versions might kill background processes or delay notifications. We will use `AndroidNotificationPriority.MAX` and encourage users to disable battery optimization for FibroLog.
- **[Risk] Sync Issues** → **Mitigation**: Since reminders are stored locally, if a user uninstalls the app or clears data, reminders are lost. This is acceptable for a local-first MVP.
