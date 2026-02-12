## Why

Patients using FibroLog need a dedicated space to view and manage their personal information and diagnosis data. This implementation provides a centralized profile screen that allows users to keep their contact details up-to-date and review their health-related background (like diagnosis date).

## What Changes

- **New Profile Screen**: A dedicated screen (`app/profile.tsx` or similar based on navigation structure) for viewing patient details.
- **Data Fetching**: Integration with the `GET /pacientes/me` endpoint to retrieve personal, contact, and diagnosis information.
- **Profile Editing**: Implementation of editing capabilities for name, email, and phone number, interfacing with the `PATCH /pacientes/{id}` endpoint.
- **Input Masking**: A specialized input mask for the Brazilian phone number format `(XX) 9XXXX-XXXX`.
- **Validation Logic**: Client-side validation for email formats and Brazilian phone number requirements.
- **UI/UX Implementation**: A responsive and accessible layout following the project's established design system (pink/magenta theme).

## Capabilities

### New Capabilities
- `patient-profile`: Viewing patient data, editing personal information, phone number masking, and profile-specific validations.

### Modified Capabilities
- None.

## Impact

- **Navigation**: Update the navigation structure (e.g., `app/(tabs)/_layout.tsx` or main menu) to include the Profile screen.
- **Services**: Potential addition of a `patient-service.ts` or expansion of existing auth/user services.
- **Dependencies**: Use of `react-hook-form` and `zod` for form management and validation (standard in this project).
- **Styling**: Adherence to the primary theme color `#D21F8F`.
