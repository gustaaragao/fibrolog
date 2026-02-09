## Context

The `BodyMap` component is a crucial part of the daily symptoms registration flow. Currently, it exhibits scaling and alignment issues, where the SVG body map does not fill the container's white background properly, leaving uneven margins or appearing too small. Additionally, the backend implementation for daily logs needs to be robust, and a specialized prompt for Gemini is required to ensure the FastAPI/Pydantic code matches the frontend's expectations and handles data integrity correctly.

## Goals / Non-Goals

**Goals:**
- Fix `BodyMap` scaling so it fills the white card container predictably.
- Ensure all 50 regions remain interactive and correctly styled when selected.
- Create a reusable, high-quality prompt for backend development that includes Pydantic schemas, FastAPI endpoints, and database considerations.
- Align frontend payload structure with backend requirements.

**Non-Goals:**
- Complete backend implementation (this change only provides the *prompt* for the developer/Gemini).
- Changing the body map paths themselves (SVG data).

## Decisions

- **SVG Scaling & Translation**: 
  - I will recalculate the bounding box of the existing `BODY_PATHS` to determine the optimal `viewBox` and `transform`.
  - The current `scale(0.1, -0.1)` and `translate(0, 623)` will be adjusted to center the map and remove unnecessary whitespace.
- **Container Layout**: 
  - The `container` style in `BodyMap.tsx` will be simplified to use flexbox for centering, ensuring the SVG occupies the maximum available space within the card.
  - Padding and margins will be reconciled between the component and its usage in `symptoms.tsx`.
- **API Prompt Location**: 
  - The prompt will be stored in `docs/api-integration-prompt.md` to be easily accessible for copy-pasting into a LLM.
  - It will explicitly mention the use of FastAPI, Pydantic, and SQLAlchemy/SQLModel (if applicable).

## Risks / Trade-offs

- [Risk] → Adjusting `viewBox` might clip some paths if not carefully calculated.
- [Mitigation] → Perform a bounding box analysis of all paths to ensure the `viewBox` covers all coordinates.
- [Risk] → The backend prompt might not perfectly match an existing (partially implemented) API.
- [Mitigation] → Include a section in the prompt instructing Gemini to "adapt to existing code" and provide the current state of `symptoms-service.ts`.
