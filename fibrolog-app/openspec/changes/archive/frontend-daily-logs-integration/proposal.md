## Why

The FibroLog API has been enhanced to return full details (symptoms and pain regions) directly within the daily log responses. This change is needed to integrate these backend improvements into the frontend, allowing the history view and detail screens to display comprehensive information without additional API calls, improving both performance and user experience.

## What Changes

- **Update Services**: Modify `DailyLogService` and TypeScript interfaces to support the new nested structure (`symptoms` and `painRegions` arrays).
- **History View Enhancement**: Update the history screen to visualize the specific symptoms and pain intensities for each record.
- **Pain Map Integration**: Update the visualization to show pain regions and their intensities derived from the nested API data.
- **Data Mapping**: Ensure string IDs for symptoms and regions correctly map to local icons, labels, and the body map UI.
- **Detail View Optimization**: Transition any existing detail views to use the pre-fetched nested data instead of making separate requests.

## Capabilities

### New Capabilities
- `history-visualization-details`: Comprehensive display of symptoms, pain regions, and intensities within the history list and detail views.

### Modified Capabilities
- None: This is an enhancement of data retrieval and display logic.

## Impact

- `services/symptoms-service.ts`: Update interfaces and API handling.
- `app/history.tsx`: UI updates to render nested data.
- `components/ui/BodyMap.tsx`: (Potential) verification of ID mapping for visualization.
- `app/symptoms.tsx`: Ensure consistency with how data is sent and retrieved.
