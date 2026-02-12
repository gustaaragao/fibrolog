## Context

The current PDF report is functional but lacks trend visualization and has unoptimized filenames for some patient names. We need to implement a name slugification utility and add graphical trend charts to the PDF.

## Goals / Non-Goals

**Goals:**
- Implement a `slugify` function in `fibrolog_api/utils/string_utils.py`.
- Use the slugified name in the `Content-Disposition` header of the PDF response.
- Add a line chart showing pain intensity trends over time in the PDF.
- Refine the overall PDF aesthetics (colors, fonts, layout).

**Non-Goals:**
- Supporting interactive charts (PDF limitation).
- Advanced statistical forecasting.

## Decisions

- **Slugification Strategy**: Use the standard `unicodedata` approach.
  - *Rationale*: It's built into Python, efficient, and handles Unicode normalization (stripping accents) reliably without external libraries like `python-slugify`.
- **Chart Implementation**: Use `reportlab.graphics.charts.lineplots.HorizontalLineChart`.
  - *Rationale*: Since we already use `ReportLab`, its built-in charting engine is the most performant and consistent way to embed vector graphics without needing to generate temporary image files (as `matplotlib` would require).
- **Chart Data Preparation**: The `generate_report_pdf` function will process the `symptomTimeline` to extract dates and pain intensities for the chart.
- **Visual Design**: 
  - *Color Palette*: Use a professional blue (`#2E5A88`) for headers and accents.
  - *Charts*: Implement clean line plots with marked data points.

## Risks / Trade-offs

- **[Risk] Chart Scaling** → If the report covers a very long period (e.g., 90 days), the chart might become cluttered. 
  - *Mitigation*: We will implement a fixed aspect ratio and ensure data points are legible, potentially thinning points if density is too high.
- **[Trade-off] Dependency vs Simplicity** → Using ReportLab's charts is slightly more complex to code than Matplotlib but avoids adding a large heavy dependency to the project.
