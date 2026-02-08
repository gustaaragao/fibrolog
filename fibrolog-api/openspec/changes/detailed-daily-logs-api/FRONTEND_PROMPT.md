# Frontend Implementation Prompt: Detailed Daily Logs

The FibroLog API has been updated to provide full details for daily logs. Use this prompt to implement the frontend integration.

---

**Prompt:**

"Help me implement the frontend integration for the updated FibroLog Daily Logs API.

### 1. API Changes Overview
- `GET /registros-diarios/`: Now returns a list of logs with nested `symptoms` and `painRegions`.
- `GET /registros-diarios/{id}`: Returns a single log with nested `symptoms` and `painRegions`.

### 2. Response Structure
Both endpoints return the following structure for each log:
```json
{
  "id": 123,
  "paciente_id": 1,
  "data_registro": "2026-02-08T14:30:00",
  "message": "Registro recuperado com sucesso",
  "symptoms": [
    { "id": "1", "intensity": 7 },
    { "id": "5", "intensity": 4 }
  ],
  "painRegions": [
    { "id": "24", "intensity": 8 },
    { "id": "10", "intensity": 5 }
  ]
}
```

### 3. Tasks for Frontend
1. **Update Services**: Update your API service to handle these nested arrays.
2. **Visualize Logs**: Update the history view to render the list of symptoms and pain regions for each log entry.
3. **Detail View**: If you have a detailed view for a single log, use the nested data instead of making separate calls.
4. **Icons/Mapping**: Ensure the `id` (string) for symptoms and pain regions matches your local mapping to icons and labels.

Please generate the TypeScript interfaces and the React components (using your existing UI library) to display this data efficiently."
