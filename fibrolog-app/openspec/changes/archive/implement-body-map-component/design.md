## Context

The application currently has a symptom selection and intensity tracking screen. Patients need to be able to specify the exact location of their pain. We have a set of SVG paths in an HTML file that can be used to build an interactive Body Map in React Native.

## Goals / Non-Goals

**Goals:**
- Implement a reusable `BodyMap` component using `react-native-svg`.
- Map the SVG paths from `body-map.html` to interactive `Path` elements in the React Native component.
- Integrate the `BodyMap` as a new step in the `SymptomsScreen` flow.
- Ensure the selected anatomical regions are included in the API submission payload.
- Improve the backend refactoring prompt to include these new data requirements.

**Non-Goals:**
- Detailed 3D modeling (sticking to the provided 2D SVG paths).
- Implementing heatmaps or advanced visualization (just selection).

## Decisions

- **Library**: Install and use `react-native-svg` for rendering the anatomical map. This is the industry standard for SVG in React Native.
- **Component Structure**: Create `components/ui/BodyMap.tsx`. It will accept `selectedRegions` as a prop and an `onRegionToggle` callback.
- **Data Model**: Use the numeric IDs from the SVG paths in `body-map.html` as the primary identifiers for anatomical regions.
- **Flow Integration**: Update `app/symptoms.tsx` to have a 3-step process:
    1. Symptom Selection.
    2. Body Map (Pain Location).
    3. Intensities and Notes.
- **API Payload**: Extend `SymptomsLogPayload` to include `painRegions: string[]`.

## Risks / Trade-offs

- [Risk] → `react-native-svg` might need a project rebuild if native modules are not pre-linked in the current Expo environment. [Mitigation] → Use `npx expo install react-native-svg` to ensure compatibility.
- [Risk] → High number of paths (50+) might impact performance. [Mitigation] → Use `React.memo` for the `Path` components if rendering becomes sluggish.
