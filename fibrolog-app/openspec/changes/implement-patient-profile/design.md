## Context

The current application has a placeholder "Usuário" tab that only displays a menu and a logout option. Users need a dedicated screen to view and edit their patient profile information, including contact details and diagnosis history. This design outlines the implementation of a full-featured profile screen that integrates with the backend patient endpoints.

## Goals / Non-Goals

**Goals:**
- Implement a detailed Profile screen with view and edit modes.
- Integrate with `GET /pacientes/me` and `PATCH /pacientes/{id}`.
- Implement Brazilian phone number masking `(XX) 9XXXX-XXXX`.
- Ensure data validation for email and phone numbers.
- Reuse existing UI components (`Input`, `DatePicker`, `Select`, `Button`).

**Non-Goals:**
- Implement profile picture upload (out of scope for now).
- Change password functionality (handled in a separate flow if needed).

## Decisions

### 1. File Structure
- **Screen**: `app/profile.tsx` will be created as a new screen.
- **Service**: `services/patient-service.ts` will handle API calls to `/pacientes`.
- **Navigation**: The "Editar Perfil" item in `app/(tabs)/usuario.tsx` will be updated to navigate to `/profile`.

### 2. Form Management and Validation
- **Choice**: `react-hook-form` + `zod`.
- **Rationale**: Standard project practice for type-safe form handling and validation.

### 3. Phone Number Masking
- **Choice**: regex-based formatting within the `Input` component or a dedicated utility.
- **Rationale**: Since we want to keep dependencies low, a simple utility function to format the string as the user types is preferred.

### 4. Data Fetching and State
- **Approach**: Fetch data on screen mount using `useEffect`. Handle loading and error states with local state variables.
- **Refinement**: Since the patient ID is needed for the PATCH request, it will be stored in the local state after the initial `GET /pacientes/me` call.

### 5. UI Components
- **Input**: Use for Name, Email, Phone.
- **DatePicker**: Use for Birth Date and Diagnosis Date.
- **Select**: Use for Gender (Options: Masculino, Feminino, Outro, Prefiro não dizer).

## Risks / Trade-offs

- **[Risk] API Availability** → The `/pacientes/me` and `/pacientes/{id}` endpoints must be available and match the expected schema.
    - *Mitigation*: Fallback to mock data during development if needed, but implementation will target the provided spec.
- **[Risk] Formatting Complexity** → Brazilian phone numbers can have 10 or 11 digits.
    - *Mitigation*: Use a robust mask utility that handles the extra digit added to mobile numbers.
