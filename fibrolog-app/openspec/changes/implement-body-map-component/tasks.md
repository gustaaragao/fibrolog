## 1. Setup and Preparation

- [x] 1.1 Install `react-native-svg` dependency.
- [x] 1.2 Create the `components/ui/BodyMap.tsx` component scaffold.

## 2. Body Map Implementation

- [x] 2.1 Convert SVG paths from `Body-Map/public/body-map.html` into `react-native-svg` format in `BodyMap.tsx`.
- [x] 2.2 Implement region selection logic and visual highlighting (using pink theme colors).
- [x] 2.3 Ensure the component is responsive and fits the screen.

## 3. Integration and Payload

- [x] 3.1 Update `app/symptoms.tsx` to include the Body Map as step 2 in the reporting flow.
- [x] 3.2 Update `services/symptoms-service.ts` and its interfaces to include `painRegions`.
- [x] 3.3 Refine `docs/api-refactoring-prompt.md` with detailed requirements for body map data.

## 4. Verification

- [x] 4.1 Verify that region selection works correctly on the Body Map.
- [x] 4.2 Verify that `painRegions` are included in the submission payload.
- [x] 4.3 Test the multi-step navigation flow in `app/symptoms.tsx`.
