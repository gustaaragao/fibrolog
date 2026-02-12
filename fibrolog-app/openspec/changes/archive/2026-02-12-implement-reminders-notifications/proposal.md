## Why

Patients with fibromyalgia often need to manage multiple daily tasks such as taking medications, performing specific stretches, or maintaining hydration. A reminder system with active notifications ensures treatment adherence even when the application is not actively in use, significantly improving self-care management.

## What Changes

- **New Reminders Screen**: A dedicated UI (`app/reminder.tsx`) for patients to:
  - View a list of active and inactive reminders.
  - Set new reminders with specific times and titles.
  - Delete or toggle existing reminders.
- **Local Notifications Integration**: Implementation of `expo-notifications` to:
  - Request user permissions for notifications.
  - Schedule local alerts that trigger at the user-defined times.
  - Provide cross-platform support (Android and Web).
- **Persistent Storage**: Use `AsyncStorage` to persist reminders locally so they are not lost when the app is closed.

## Capabilities

### New Capabilities
- `reminder-management`: CRUD operations for local reminders and toggle logic.
- `local-notifications-service`: abstraction layer for requesting permissions and scheduling alerts using `expo-notifications`.

## Impact

- **Frontend**: Significant update to `app/reminder.tsx`.
- **Dependencies**: Addition of `expo-notifications` and `expo-device`.
- **Permissions**: App will now require notification permissions on first use of the feature.
- **Platform Specifics**: Web notifications will use the Browser's Notification API (via Expo), while Android will use native channels.
