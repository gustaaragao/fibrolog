## 1. Service Layer Updates

- [x] 1.1 Update `DailyLog` and `DailyLogPayload` interfaces in `services/symptoms-service.ts` to include `data_registro` and `paciente_id`.
- [x] 1.2 Update the `create` and `getAll` methods in `DailyLogService` to handle potential mapping between `data_registro` and frontend property names.

## 2. Shared Assets and Mappings

- [x] 2.1 Consolidate the `SYMPTOMS` list and its associated mapping (icons, names) into a shared constant or utility if not already present.
- [x] 2.2 Ensure the `SYMPTOMS_MAP` in `app/history.tsx` is consistent with the `SYMPTOMS` configuration in `app/symptoms.tsx`.

## 3. History List Enhancement

- [x] 3.1 Update the `renderLogItem` function in `app/history.tsx` to display icons for the first few symptoms in each log entry.
- [x] 3.2 Add intensity summaries to the log cards in the history list.
- [x] 3.3 Ensure dates are correctly formatted using `data_registro` from the API response.

## 4. History Detail Modal Enhancement

- [x] 4.1 Update the Detail Modal in `app/history.tsx` to use nested data for symptoms and intensities.
- [x] 4.2 Implement visual intensity indicators (badges or bars) for symptoms in the detail view.
- [x] 4.3 Update the pain region visualization in the modal to display intensities alongside the region IDs.
- [x] 4.4 Verify that `notes` are correctly displayed from the nested data.

## 5. Verification and Cleanup

- [x] 5.1 Test the history view with live or mocked data matching the new API structure.
- [x] 5.2 Verify that navigating from history list to details works seamlessly without additional API requests.
- [x] 5.3 Run linting and type checks to ensure codebase health.
