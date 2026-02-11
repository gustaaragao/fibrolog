## 1. String Utilities

- [x] 1.1 Create `fibrolog_api/utils/string_utils.py`
- [x] 1.2 Implement `slugify` function with Unicode normalization and regex sanitization
- [x] 1.3 Add unit tests for `slugify` (handle accents, spaces, special chars)

## 2. PDF Visualization Enhancements

- [x] 2.1 Refine `ParagraphStyle` definitions in `pdf_generator.py` (updated colors and spacing)
- [x] 2.2 Implement `render_pain_chart` helper in `pdf_generator.py` using ReportLab's `HorizontalLineChart`
- [x] 2.3 Integrate the pain trend chart into the `generate_report_pdf` Flowables list

## 3. Router Integration

- [x] 3.1 Import `slugify` in `fibrolog_api/routers/relatorios.py`
- [x] 3.2 Update `gerar_relatorio_pdf` to use `slugify(paciente.nome)` for the `Content-Disposition` filename

## 4. Verification

- [x] 4.1 Run existing PDF tests to ensure no regressions
- [x] 4.2 Verify new filename format via manual or automated test
- [x] 4.3 Regenerate `sample_report.pdf` and verify chart appearance
