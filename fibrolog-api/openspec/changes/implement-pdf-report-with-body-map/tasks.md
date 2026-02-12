## 1. Setup and Dependencies

- [x] 1.1 Add `reportlab` and `svglib` to `pyproject.toml`
- [x] 1.2 Run `poetry install` to update environment

## 2. SVG Processing Utility

- [x] 2.1 Implement utility to modify `Body-Map.svg` colors based on region IDs
- [x] 2.2 Verify SVG manipulation produces valid ReportLab drawing objects via `svglib`

## 3. PDF Core Rendering

- [x] 3.1 Create PDF base template matching the prototype design (Header, Footer, Page numbers)
- [x] 3.2 Implement "Resumo Geral" rendering logic
- [x] 3.3 Implement "Dores Mais Frequentes" section with the highlighted Body Map
- [x] 3.4 Implement symptom timeline and crisis history tables

## 4. API Integration

- [x] 4.1 Add GET `/relatorios/pdf` endpoint to `fibrolog_api/routers/relatorios.py`
- [x] 4.2 Integrate consolidated report data with the PDF rendering logic
- [x] 4.3 Ensure proper response headers for PDF download (`application/pdf`)

## 5. Verification

- [x] 5.1 Create unit tests for PDF generation with mock data
- [x] 5.2 Manually verify the visual layout against the prototype
- [x] 5.3 Verify that multiple pages are handled correctly when data exceeds one page
