## Context

The FibroLog application allows users to track their fibromyalgia symptoms and crises. Currently, there is no way for users to export this data for external use or sharing with medical professionals. The backend API provides an endpoint `GET /relatorios/pdf` that generates a PDF report based on a date range. This design documents the implementation of the frontend interface and logic to consume this API and present the report to the user.

## Goals / Non-Goals

**Goals:**
- Implement a report generation screen with date range selection.
- Provide quick selection buttons for common timeframes (7, 15, 30, 60 days).
- Integrate with the API to fetch the PDF binary.
- Provide an in-app PDF preview.
- Enable native sharing (WhatsApp, Email, etc.) and local saving of the PDF.
- Follow the established pink/magenta design theme.

**Non-Goals:**
- Client-side PDF generation (handled by backend).
- Editing report content within the app.
- Historical list of generated reports (they are generated on-demand).

## Decisions

### 1. Screen Location and Routing
- Use `app/relatorio.tsx` as the primary implementation.
- Update `app/home.tsx` to point the "Gerar PDF" menu item to `/relatorio` instead of `/pdf`.
- Keep `app/pdf.tsx` as a redirect or remove it to avoid confusion, but updating the menu is cleaner.

### 2. PDF Rendering
- **Choice**: `react-native-pdf`.
- **Rationale**: Provides a rich, performant in-app viewing experience compared to opening an external viewer. It supports multi-page navigation and zoom natively.
- **Dependency**: Requires `react-native-blob-util`.

### 3. File Management
- **Library**: `expo-file-system`.
- **Rationale**: Essential for saving the binary blob from the API into a temporary file that can be read by the PDF viewer and shared via `expo-sharing`.

### 4. Sharing and Saving
- **Library**: `expo-sharing`.
- **Rationale**: Provides a unified native interface for sharing files. On Android, it can also be used to "Save to Files" if configured correctly, or we can use `expo-file-system` to copy to a public directory.

### 5. API Service
- **New File**: `services/reports-service.ts`.
- **Approach**: Since the existing `api.ts` is optimized for JSON, a custom `fetch` call will be implemented to handle `response.blob()`. It will reuse the authentication token from `storage`.

### 6. UI Components
- **Date Pickers**: Reuse the existing `components/ui/DatePicker.tsx` which is already integrated with `react-hook-form`.
- **Theming**: Use `nativewind` classes and constants from `theme.ts` (Primary: #D21F8F).

## Risks / Trade-offs

- **[Risk] Native Dependencies** → `react-native-pdf` and `react-native-blob-util` require native code. If the user is using Expo Go, they might encounter issues. 
    - *Mitigation*: Recommend a Development Build (`npx expo run:android`) or use a Webview-based PDF viewer if strictly restricted to Expo Go. For this implementation, we assume a development build is feasible as it's the standard path for native modules in Expo.
- **[Risk] Large PDF Files** → Memory issues when handling large blobs.
    - *Mitigation*: Stream the response to a file directly using `FileSystem.downloadAsync` if the API supports it, or handle blobs carefully with temporary storage cleanup.
- **[Risk] API Availability** → The `localhost:8000` base URL might need adjustment for physical devices.
    - *Mitigation*: Use `EXPO_PUBLIC_API_URL` environment variable.
