## Why

Enhancing the PDF report visualization and formatting is essential for professional delivery and better clinical interpretation. Slugifying patient names in filenames ensures compatibility across different operating systems and browsers, while improved visual layouts and trend charts allow healthcare providers to quickly identify patterns in pain and symptoms.

## What Changes

- **Filename Slugification**: Implement logic to convert complex patient names (e.g., 'Gustavo Henrique Aragão Silva') into URL-friendly and filesystem-safe strings (e.g., 'gustavo_henrique_aragao_silva').
- **Data Visualization**: Integrate graphical charts (e.g., line charts for pain intensity over time) into the PDF report.
- **Enhanced Formatting**: Improve the overall PDF layout with better typography, color usage, and spacing to align with modern design standards.

## Capabilities

### New Capabilities
- `report-filename-utility`: Provides centralized logic for sanitizing and slugifying strings for use in filenames.

### Modified Capabilities
- `pdf-report-rendering`: Update requirements to include trend charts and refined visual styles.

## Impact

- `fibrolog_api/utils/pdf_generator.py`: Updated to include chart rendering and improved styling.
- `fibrolog_api/routers/relatorios.py`: Updated to use the slugification utility for the response header.
- `fibrolog_api/utils/string_utils.py`: New utility module for name slugification.
