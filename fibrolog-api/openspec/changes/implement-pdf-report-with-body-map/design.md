## Context

The current reporting system only provides JSON data. We need to implement a professional PDF report that follows a specific prototype layout, including a body map that highlights areas of pain reported by the patient.

## Goals / Non-Goals

**Goals:**
- Implement a `/relatorios/pdf` endpoint that returns a generated PDF.
- Replicate the visual layout from the project's PDF prototype.
- Dynamically highlight pain regions in `Body-Map.svg` within the PDF.
- Use a robust PDF generation library suitable for Python/FastAPI.

**Non-Goals:**
- Interactive body map (PDF is static).
- Detailed anatomical labels in the body map (visualization only).

## Decisions

- **Library: ReportLab + svglib**: We will use `ReportLab` for high-quality PDF generation and `svglib` to process and embed the `Body-Map.svg`.
  - *Rationale*: `ReportLab` allows precise positioning required for the prototype's complex layout. `svglib` can convert SVG paths into ReportLab graphics, allowing us to programmatically change colors (highlighting) before rendering.
  - *Alternatives*: `xhtml2pdf` (easier but poor SVG support), `WeasyPrint` (great SVG/CSS support but heavy system dependencies).
- **SVG Manipulation**: We will treat the `Body-Map.svg` as XML. We will identify paths by their order (1-50) and modify their `fill` attribute to highlight them (e.g., from `#000000` to `#FF0000`) based on the `regiao_id`.
  - *Rationale*: Since the SVG paths lack IDs but there are exactly 50, a 1-to-1 mapping with `regiao_id` (1-50) is the most straightforward approach given the current assets.
- **Font: Helvetica/Arial**: Standard PDF fonts will be used to ensure compatibility and performance without embedding heavy custom font files initially.

## Risks / Trade-offs

- **[Risk] Path-to-Region Mapping Accuracy** → The current assumption is that paths in `Body-Map.svg` follow the ID sequence 1-50. If the order doesn't match anatomical expectations, we will need to create a manual mapping table (ID -> Path Index).
- **[Trade-off] Performance** → Generating PDFs on the fly can be CPU-intensive. We will implement this as a synchronous-like process within the async handler for now, but may need a task queue (e.g., Celery/Redis) if the load increases significantly.
