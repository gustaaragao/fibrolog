## Why

A textual description of symptoms is often insufficient for patients with fibromyalgia to accurately report where they are feeling pain. Implementing a visual Body Map component based on existing SVG assets will provide a more intuitive and precise reporting tool, leading to better clinical data.

## What Changes

- Implement a React Native Body Map component using `react-native-svg` based on the paths from `Body-Map/public/body-map.html`.
- Integrate the Body Map into the symptom tracking flow in `app/symptoms.tsx`.
- Update `services/symptoms-service.ts` to handle pain location data.
- Refine `docs/api-refactoring-prompt.md` to specify how the backend should receive and store anatomical region data linked to symptom logs.

## Capabilities

### New Capabilities
- `body-map-reporting`: Visual reporting of pain locations using an interactive anatomical map with region selection.

### Modified Capabilities
- `symptom-tracking`: Extend the existing symptom tracking capability to associate specific pain locations (from the Body Map) with symptom entries.

## Impact

- `app/symptoms.tsx`: Will now include a new step for visual pain location selection.
- `services/symptoms-service.ts`: Payload structure will be updated to include region IDs.
- `docs/api-refactoring-prompt.md`: Updated with detailed requirements for body map data integration.
- Backend API: Will need to support the updated payload with pain location regions.
