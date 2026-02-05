## Context

This is a React Native Expo application for fibrolog, a healthcare application that requires user registration to collect medical information. The app currently uses React Hook Form for form management and Zod for validation. The project lacks styling infrastructure and needs TailwindCSS integration specifically adapted for React Native.

Current constraints:
- React Native environment (not standard web)
- Expo framework limitations
- Need for cross-platform compatibility (iOS/Android/Web)
- Healthcare context requires robust validation and data handling

## Goals / Non-Goals

**Goals:**
- Implement complete user registration flow with medical-specific fields
- Establish TailwindCSS styling system with custom purple theme
- Create reusable form components for future healthcare forms
- Ensure accessibility and responsive design across all platforms
- Integrate seamlessly with existing React Hook Form and Zod validation

**Non-Goals:**
- Backend API development (assumes endpoints exist or will be created separately)
- User authentication logic (focused only on registration)
- Data persistence beyond form submission
- Email verification or complex password reset flows

## Decisions

### 1. TailwindCSS for React Native
**Decision**: Use NativeWind (TailwindCSS for React Native) instead of standard TailwindCSS
**Rationale**: Standard TailwindCSS doesn't work with React Native. NativeWind provides TailwindCSS-like utilities that compile to React Native styles.
**Alternatives considered**: Styled Components, React Native StyleSheet - rejected for consistency with web development practices and design system scalability.

### 2. Purple Color Palette Implementation
**Decision**: Create custom color palette in tailwind.config.js with purple variants (purple-50 to purple-950)
**Rationale**: Provides consistent branding across the app and allows for theming flexibility.
**Alternatives considered**: CSS-in-JS color constants - rejected for lack of design system integration.

### 3. Form Architecture
**Decision**: Use React Hook Form with Zod validation schemas (already in project dependencies)
**Rationale**: Leverages existing dependencies, provides excellent performance, and integrates well with TypeScript.
**Alternatives considered**: Formik, native state management - rejected as React Hook Form already exists in project.

### 4. Component Structure
**Decision**: Create atomic components (Input, Button, DatePicker) that can be composed into the registration form
**Rationale**: Promotes reusability for future medical forms and maintains design consistency.
**Alternatives considered**: Monolithic form component - rejected for maintainability and reusability concerns.

### 5. Validation Strategy
**Decision**: Client-side validation with Zod schemas for immediate feedback, with server-side validation assumed
**Rationale**: Provides better UX with immediate feedback while maintaining security.
**Alternatives considered**: Server-side only validation - rejected for poor user experience.

## Risks / Trade-offs

**[NativeWind Learning Curve]** → Team may need time to adapt from standard TailwindCSS to NativeWind syntax
**[Platform-specific Styling Issues]** → Some TailwindCSS utilities may not work consistently across platforms → Mitigation: Thorough testing on all target platforms and fallback styles
**[Form Performance with Medical Data]** → Large forms with validation may impact performance → Mitigation: Use React Hook Form's optimized re-render strategy and lazy validation
**[Purple Theme Accessibility]** → Purple color palette may not meet accessibility contrast requirements → Mitigation: Ensure all purple variants meet WCAG AA standards for contrast ratios
**[Date Input Complexity]** → Date inputs (data_nascimento, data_diagnostico) are complex in React Native → Mitigation: Use platform-specific date pickers with consistent styling
**[Medical Data Sensitivity]** → Healthcare data requires special handling → Mitigation: Implement proper validation, sanitization, and ensure no sensitive data logging