# Frontend Profile Screen Implementation Prompt

Use this prompt with the Gemini CLI in your frontend project to implement the patient profile screen.

---

**Prompt:**

"Implement a patient profile screen in the frontend using React and Material UI (or your project's chosen UI library). The screen should:

1.  **Fetch Data**: Call the `GET /pacientes/me` endpoint to retrieve the current patient's data.
2.  **Display Information**:
    *   Full Name (field: `nome`)
    *   Email (field: `email`)
    *   Birth Date (field: `data_nascimento`)
    *   Gender (field: `sexo`)
    *   Diagnosis Date (field: `data_diagnostico`)
    *   Phone Number (field: `celular`)
3.  **Edit Capability**:
    *   Provide an 'Edit' button that opens a form or enables inline editing.
    *   The form should allow updating the name, email, and phone number.
    *   The phone number field should have a mask for the Brazilian format: `(XX) 9XXXX-XXXX`.
    *   On save, call the `PATCH /pacientes/{id}` endpoint with the updated data.
4.  **Validation**:
    *   Include client-side validation for the phone number matching the backend requirements (digits and common Brazilian format).
    *   Ensure the email is valid.
5.  **Styling**:
    *   Follow the existing design system of the application.
    *   Ensure the layout is responsive and accessible."

---

**API Reference (for the LLM):**

*   **Endpoint**: `GET /pacientes/me`
*   **Response Schema**:
    ```json
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "celular": "(11) 98765-4321",
      "data_nascimento": "1990-01-01T00:00:00",
      "sexo": "Masculino",
      "data_diagnostico": "2020-05-15T00:00:00",
      "created_at": "...",
      "updated_at": "..."
    }
    ```
*   **Update Endpoint**: `PATCH /pacientes/{paciente_id}`
*   **Update Request Schema**: (Only fields to change)
    ```json
    {
      "nome": "João Silva Alterado",
      "celular": "11999999999"
    }
    ```
