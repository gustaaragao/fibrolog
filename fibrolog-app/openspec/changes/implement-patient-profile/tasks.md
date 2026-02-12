## 1. Service Layer

- [x] 1.1 Create `services/patient-service.ts`
- [x] 1.2 Implement `getMe` function to fetch patient data
- [x] 1.3 Implement `updatePatient` function for PATCH requests

## 2. Profile Screen UI

- [x] 2.1 Create `app/profile.tsx` with basic layout
- [x] 2.2 Implement data fetching and display (Name, Email, Birth Date, Gender, Diagnosis Date, Phone)
- [x] 2.3 Implement "Edit" mode toggle and form fields using `react-hook-form`
- [x] 2.4 Add phone number masking utility and integrate with the Phone input
- [x] 2.5 Implement validation logic (Email and Phone) using `zod`

## 3. Navigation and Integration

- [x] 3.1 Update `app/(tabs)/usuario.tsx` to navigate to `/profile` on "Editar Perfil" click
- [x] 3.2 Add navigation header options for the Profile screen

## 4. Polishing

- [x] 4.1 Apply pink/magenta theme styling consistently (#D21F8F)
- [x] 4.2 Add loading and error states for data fetching and saving
- [x] 4.3 Verify accessibility labels and responsive behavior
