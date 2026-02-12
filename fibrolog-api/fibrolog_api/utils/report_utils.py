import xml.etree.ElementTree as ET
from io import BytesIO

from svglib.svglib import svg2rlg


def get_highlighted_body_map(frequent_region_ids: list[str], svg_path: str = 'assets/Body-Map.svg'):
    """
    Reads Body-Map.svg, highlights specific regions, and returns a ReportLab drawing.
    
    Args:
        frequent_region_ids: List of region IDs (1-50) to highlight in red.
        svg_path: Path to the Body-Map.svg file.
    """
    # Parse the SVG as XML
    ET.register_namespace('', "http://www.w3.org/2000/svg")
    tree = ET.parse(svg_path)
    root = tree.getroot()

    # SVG paths are children of the first group <g>
    # We identified 50 paths, mapping 1-to-1 with regiao_id
    namespace = {'svg': 'http://www.w3.org/2000/svg'}
    group = root.find('svg:g', namespace)

    if group is not None:
        paths = group.findall('svg:path', namespace)
        for rid in frequent_region_ids:
            try:
                # regiao_id is 1-indexed, paths are 0-indexed
                idx = int(rid) - 1
                if 0 <= idx < len(paths):
                    # Highlight in Red
                    paths[idx].set('fill', '#FF0000')
            except ValueError:
                continue

    # Convert modified XML back to a string/bytes
    svg_data = ET.tostring(root, encoding='utf-8', method='xml')

    # Use svglib to convert to ReportLab drawing
    drawing = svg2rlg(BytesIO(svg_data))
    return drawing
