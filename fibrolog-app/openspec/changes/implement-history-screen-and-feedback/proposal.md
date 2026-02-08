## Why

The application currently lacks a history screen for users to track their symptom logs over time. Additionally, the user experience when saving a daily log needs improvement by providing clear visual feedback and automatic navigation to the home screen.

## What Changes

- **New History Screen**: Implementation of a dedicated screen to display historical records of symptoms and pain regions, following prototype page 0013.
- **Success Feedback**: Integration of a success message and a toast notification upon successful saving of a daily symptom log.
- **Navigation Flow**: Automatic redirection to the Home screen after a successful save operation in the Symptoms screen.

## Capabilities

### New Capabilities
- `history-screen`: UI and data fetching logic for displaying the list and details of previous symptom logs.

### Modified Capabilities
- `symptoms-registration`: Update the submission flow to include visual feedback (toasts/messages) and automated navigation to the Home screen.

## Impact

- `app/history.tsx`: Will be implemented with the history list.
- `app/symptoms.tsx`: Will be updated to include post-save feedback and navigation.
- `services/symptoms-service.ts`: May need updates to support fetching history if not already present.
- Navigation flow will be modified to return to 'home' after 'symptoms' submission.
