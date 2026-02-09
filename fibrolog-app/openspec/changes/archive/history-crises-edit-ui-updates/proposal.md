## Why

The current history view only shows daily symptoms, making it difficult for users to track crises in context. Additionally, users need the ability to correct or update their entries (both symptoms and crises) to maintain an accurate health log. This change also aims to improve branding and streamline the crisis registration experience.

## What Changes

- **History Integration**: Display crisis events within the history list/calendar alongside daily symptom logs.
- **Edit Functionality**: Allow users to edit previously submitted daily symptoms and crisis logs.
- **Header Branding**: Add a stylized "F" logo to the right side of the application header.
- **Streamlined Crisis Form**: Simplify the `crisis` route to show only the description form initially, while retaining the support network notification button.
- **Backend Sync**: Definition of a prompt/contract for backend updates required to support editing and enhanced history retrieval.

## Capabilities

### New Capabilities
- `record-editing`: Ability to modify existing daily symptom logs and crisis records.
- `integrated-history-view`: Unified view of symptoms and crises in the history module.

### Modified Capabilities
- `crises-module`: Simplified form UI in the registration flow.
- `app-branding`: Header updates for consistent visual identity.

## Impact

- `app/history.tsx`: UI updates to show crises.
- `app/crisis-form.tsx`: Form simplification.
- `app/_layout.tsx`: Header modification for the "F" logo.
- `services/`: API service updates for PUT/PATCH operations on symptoms and crises.
- `docs/`: New prompt for backend implementation details.
