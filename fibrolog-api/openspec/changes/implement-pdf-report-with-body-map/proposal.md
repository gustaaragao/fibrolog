## Why

Patients and healthcare providers need a professional, printable, and visually intuitive way to review monitoring data. The current JSON-only output is not suitable for clinical consultations. A PDF report that includes a body map visualization will allow for immediate identification of pain patterns and trends, facilitating better communication and treatment decisions.

## What Changes

- **PDF Generation**: Implement an endpoint that generates a multi-page PDF report based on the design prototype.
- **Body Map Integration**: Incorporate the `Body-Map.svg` into the PDF, dynamically highlighting regions where the patient reported pain during the period.
- **Template Implementation**: The PDF must follow the structure and style of the provided prototype document (summaries, tables for symptoms/crises, and visual indicators).
- **New Dependencies**: Introduction of a PDF generation library (e.g., `xhtml2pdf` or `ReportLab`) and an SVG manipulation tool if needed.

## Capabilities

### New Capabilities
- `pdf-report-rendering`: Handles the transformation of aggregated monitoring data into a structured PDF document following the project's visual standards.
- `body-map-visualization`: Logic to map pain region IDs (1-50) to specific paths in the `Body-Map.svg` and apply visual highlights (e.g., red overlays) based on reported frequency or intensity.

### Modified Capabilities
- `report-generation`: The existing requirement to provide consolidated report data needs to be expanded to include the PDF format as a primary output delivery method.

## Impact

- `fibrolog_api/routers/relatorios.py`: New logic to handle PDF rendering and file response.
- `pyproject.toml`: Addition of PDF/SVG processing libraries.
- `openspec/specs/report-generation/`: New delta spec to define PDF-specific requirements.
- Assets: `Body-Map.svg` will be integrated as a core resource for report generation.
