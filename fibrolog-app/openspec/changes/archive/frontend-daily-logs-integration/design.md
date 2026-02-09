## Context

The FibroLog backend has been updated to return a richer data structure for daily logs. Previously, the frontend would fetch a list of logs, but displaying detailed information (like specific symptoms or pain regions for each log) required either separate API calls or was limited by the data structure. The new API response nests `symptoms` and `painRegions` arrays directly within the log objects, allowing for a more efficient and detailed History view.

## Goals / Non-Goals

**Goals:**
- Update `services/symptoms-service.ts` to match the new API response structure.
- Enhance `app/history.tsx` to display symptom names, icons, and intensities.
- Improve the visualization of pain regions in the history details.
- Ensure smooth mapping between API IDs and frontend assets (icons, labels).
- Use local data for detail views to avoid redundant network requests.

**Non-Goals:**
- Modifying the symptom registration flow (`app/symptoms.tsx`).
- Implementing editing or deletion of historical logs in this phase.
- Changing the BodyMap component's internal logic.

## Decisions

### 1. Unified Interface for DailyLog
We will update the `DailyLog` interface to include the fields returned by the updated API, such as `data_registro` and `paciente_id`.
- **Rationale:** Ensures type safety across the application and aligns with backend nomenclature.
- **Alternatives:** Creating a separate `DailyLogDetail` interface, but since the list view now returns full details, a single unified interface is more efficient.

### 2. Snake_case to CamelCase Mapping
The API uses `data_registro`, while the frontend uses `timestamp`. We will map `data_registro` to `timestamp` (or a more descriptive name like `createdAt`) in the service layer to maintain frontend conventions.
- **Rationale:** Consistency with existing frontend code and cleaner property access.

### 3. Enhanced History Card UI
The history list cards will be updated to show a summary of symptoms with their respective icons, providing immediate visual feedback without opening details.
- **Rationale:** Better UX by allowing users to scan their history more quickly.

### 4. Detail Modal with Intensity Badges
The detail modal will use colored badges or small bars to represent symptom and pain intensity (0-10).
- **Rationale:** Makes the data more intuitive and visually distinct than plain text.

## Risks / Trade-offs

- **[Risk]** ID Mismatch: If the backend IDs for symptoms or regions change without a corresponding update in the frontend `SYMPTOMS_MAP`, labels will break. → **Mitigation:** Implement a fallback that displays "Sintoma [ID]" and add a unit test or check to ensure all IDs are mapped.
- **[Risk]** Large Payloads: Nesting all details in the list view increases payload size. → **Mitigation:** If performance degrades for users with hundreds of entries, we will implement pagination in a future phase.
