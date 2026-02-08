## 1. BodyMap UI Refactoring

- [x] 1.1 Analyze `BODY_PATHS` coordinates and recalculate optimal `viewBox` and `transform`.
- [x] 1.2 Update `components/ui/BodyMap.tsx` with the new SVG scaling logic and simplified styles.
- [x] 1.3 Adjust container padding and margins in `BodyMap.tsx` and `app/symptoms.tsx` for full-width layout.

## 2. API Integration Prompt

- [x] 2.1 Develop the specialized Gemini prompt for FastAPI/Pydantic backend development.
- [x] 2.2 Save the prompt to `docs/api-integration-prompt.md`.
- [x] 2.3 Ensure the prompt explicitly references the `symptomsService.logSymptoms` payload structure for perfect alignment.

## 3. Verification

- [x] 3.1 Verify that the `BodyMap` fills the white card container correctly in the `symptoms.tsx` screen.
- [x] 3.2 Test the interactivity of at least 5 different body regions to ensure the fix didn't break hitboxes.
