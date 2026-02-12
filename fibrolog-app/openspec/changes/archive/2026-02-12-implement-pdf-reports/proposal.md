## Why

FibroLog users need a way to consolidate their recorded health data (daily symptoms, crises, and history) into a portable format. Generating PDF reports allows patients to share detailed monitoring data with healthcare professionals during appointments and maintain a personal record of their fibromyalgia journey.

## What Changes

- **New Reports Screen**: A dedicated screen (`app/relatorio.tsx`) for generating and managing reports.
- **Period Selection**: UI for choosing start and end dates for the report, including validation to ensure the end date is not before the start date.
- **Quick Periods**: Shortcut buttons to quickly select common timeframes: Last 7, 15, 30, and 60 days.
- **API Integration**: Integration with the `GET /relatorios/pdf` endpoint to fetch the generated PDF binary using JWT authentication.
- **PDF Preview**: In-app visualization of the generated PDF with support for multiple pages and zooming.
- **Native Sharing**: Ability to share the PDF file using the device's native sharing dialog (optimized for WhatsApp).
- **Download/Save**: Functionality to save the PDF directly to the device's storage.
- **UI/UX Enhancements**: Loading indicators during report generation, error handling for network or server issues, and empty state feedback.

## Capabilities

### New Capabilities
- `pdf-reports`: Period selection, API communication, PDF rendering/preview, native sharing, and local file storage.

### Modified Capabilities
- None.

## Impact

- **New Files**: `app/relatorio.tsx`, `services/reports-service.ts` (if needed, otherwise integrated into existing service pattern).
- **Dependencies**: Addition of `expo-file-system`, `expo-sharing`, and `react-native-pdf` (plus its peer dependencies like `react-native-blob-util` and `react-native-view-pdf` if applicable).
- **Navigation**: Update navigation to include the new Reports screen.
- **Styling**: Adherence to the project's pink/magenta theme (#D21F8F).
