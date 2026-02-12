from io import BytesIO
from pathlib import Path

from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.widgets.markers import makeMarker
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from fibrolog_api.utils.report_utils import get_highlighted_body_map

# Resolve assets directory path relative to this module
ASSETS_DIR = Path(__file__).resolve().parent.parent.parent / 'assets'

# Global configuration
PRIMARY_COLOR = colors.HexColor('#D21F8F')
SECONDARY_COLOR = colors.HexColor('#FCE4EC')


class ReportPDF(BaseDocTemplate):
    def __init__(self, filename, title='Relatório FibroLog', **kw):
        super().__init__(filename, pagesize=A4, title=title, **kw)

        # Define margins and frames
        margin_first = 1.5 * cm
        margin_later = 2.0 * cm  # Margem maior para páginas seguintes

        # Frame primeira página
        frame_first = Frame(
            margin_first,
            margin_first,
            A4[0] - 2 * margin_first,
            A4[1] - 2 * margin_first,
            id='first',
        )

        # Frame páginas seguintes (margem superior maior)
        frame_later = Frame(
            margin_later,
            margin_first,
            A4[0] - 2 * margin_later,
            A4[1] - margin_first - margin_later - 0.5 * cm,
            id='later',
        )

        # Add page templates
        self.addPageTemplates([
            PageTemplate(
                id='First', frames=frame_first, onPage=self._header_footer
            ),
            PageTemplate(
                id='Later', frames=frame_later, onPage=self._header_footer
            ),
        ])

    def _header_footer(self, canvas, doc):  # noqa: PLR6301
        """Callback method for page header/footer (required by ReportLab)."""
        canvas.saveState()

        # Logo
        logo_path = ASSETS_DIR / 'logo.jpeg'
        try:
            canvas.drawImage(
                str(logo_path),
                1.5 * cm,
                A4[1] - 1.7 * cm,
                width=1.2 * cm,
                height=1.2 * cm,
                preserveAspectRatio=True,
                mask='auto',
            )
        except Exception:
            pass  # Fallback if image not found

        # Header
        header_text = 'FIBROLOG   RELATÓRIO'
        canvas.setFont('Helvetica-Bold', 14)
        canvas.setFillColor(PRIMARY_COLOR)
        canvas.drawRightString(A4[0] - 1.5 * cm, A4[1] - 1.5 * cm, header_text)

        canvas.setStrokeColor(PRIMARY_COLOR)
        canvas.setLineWidth(1)
        canvas.line(
            1.5 * cm, A4[1] - 1.8 * cm, A4[0] - 1.5 * cm, A4[1] - 1.8 * cm
        )

        # Footer
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(colors.grey)
        footer_left = 'FibroLog - Monitoramento Digital da Fibromialgia'
        footer_right = f'Página {doc.page}'
        canvas.drawString(1.5 * cm, 1 * cm, footer_left)
        canvas.drawRightString(A4[0] - 1.5 * cm, 1 * cm, footer_right)

        canvas.restoreState()


def render_pain_chart(timeline_data):
    """
    Renders a pain intensity trend chart.
    """
    if not timeline_data:
        return None

    drawing = Drawing(400, 200)

    labels = []

    # Take up to last 30 entries to keep it legible
    recent_data = timeline_data[-30:]

    pain_points = []
    for i, entry in enumerate(recent_data):
        if entry['pain'] is not None:
            pain_points.append(entry['pain'])
            labels.append(entry['date'].strftime('%d/%m'))
        else:
            pain_points.append(0)
            labels.append('')

    lp = LinePlot()
    lp.x = 30
    lp.y = 30
    lp.height = 140
    lp.width = 350
    lp.data = [list(zip(range(len(pain_points)), pain_points))]
    lp.joinedLines = 1

    lp.lines[0].symbol = makeMarker('FilledCircle')
    lp.lines[0].strokeColor = PRIMARY_COLOR

    lp.yValueAxis.valueMin = 0
    lp.yValueAxis.valueMax = 10
    lp.yValueAxis.valueStep = 2
    lp.yValueAxis.labelTextFormat = '%d'

    lp.xValueAxis.labels.boxAnchor = 'n'
    lp.xValueAxis.labels.angle = 45
    lp.xValueAxis.labels.dx = 0
    lp.xValueAxis.labels.dy = -5
    lp.xValueAxis.valueMin = 0
    lp.xValueAxis.valueMax = len(labels) - 1
    lp.xValueAxis.valueStep = 1
    lp.xValueAxis.labelTextFormat = lambda x: (
        labels[int(x)] if 0 <= int(x) < len(labels) else ''
    )

    drawing.add(lp)
    return drawing


def generate_report_pdf(report_data):  # noqa: PLR0915, PLR0914
    """
    Generates the PDF report based on report_data.

    Note: High complexity is acceptable here as it's a sequential
    document generation with many formatting steps.
    """
    buffer = BytesIO()

    # Define título do PDF com nome do paciente
    pdf_title = f'Relatório FibroLog - {report_data["patientName"]}'
    doc = ReportPDF(buffer, title=pdf_title)
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=PRIMARY_COLOR,
        alignment=1,  # Center
        spaceAfter=12,
    )

    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.whitesmoke,
        alignment=0,  # Left
        spaceBefore=15,
        spaceAfter=8,
        backColor=PRIMARY_COLOR,
        borderPadding=4,
        leftIndent=0,
        borderRadius=2,
    )

    elements = []

    # Title
    elements.append(
        Paragraph('Relatório de Monitoramento – Fibromialgia', title_style)
    )
    elements.append(
        Paragraph(f'Período: {report_data["period"]}', styles['Normal'])
    )
    elements.append(Spacer(1, 0.5 * cm))

    # Patient Info
    elements.append(
        Paragraph(
            f'<b>Paciente:</b> {report_data["patientName"]}', styles['Normal']
        )
    )
    elements.append(
        Paragraph(
            f'<b>Data de geração:</b> '
            f'{report_data["generationDate"].strftime("%d/%m/%Y")}',
            styles['Normal'],
        )
    )
    elements.append(Spacer(1, 0.5 * cm))

    # Resumo Geral
    elements.append(Paragraph('RESUMO GERAL', section_style))

    summary = report_data['generalSummary']
    summary_data = [
        [
            f'Média de dor diária: {summary["averagePain"]}/10',
            f'Pico de dor mais alto: {summary["peakPain"]}/10',
        ],
        [
            f'Dias com dor intensa (>7): {summary["intensePainDays"]}',
            f'Nível médio de fadiga: {summary["averageFatigue"]}/10',
        ],
        [f'Qualidade média do sono: {summary["averageSleep"]}/5', ''],
    ]

    summary_table = Table(summary_data, colWidths=[8 * cm, 8 * cm])
    summary_table.setStyle(
        TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ])
    )
    elements.append(summary_table)

    # Emotion frequency
    elements.append(Spacer(1, 0.3 * cm))
    elements.append(
        Paragraph('<b>Frequência de estados emocionais:</b>', styles['Normal'])
    )

    emotions = summary['emotionFrequency']
    emotion_list = ', '.join([
        f'{k}: {v} d' for k, v in emotions.items() if v > 0
    ])
    elements.append(
        Paragraph(
            emotion_list or 'Nenhum registro no período.', styles['Normal']
        )
    )

    # Trend Chart
    elements.append(Paragraph('EVOLUÇÃO DA DOR', section_style))
    chart = render_pain_chart(report_data['symptomTimeline'])
    if chart:
        elements.append(chart)
    else:
        elements.append(
            Paragraph(
                'Dados insuficientes para gerar o gráfico.', styles['Normal']
            )
        )

    # Dores Mais Frequentes
    elements.append(Paragraph('MAPEAMENTO DE DORES', section_style))

    frequent = report_data['frequentPainRegions'][:5]
    frequent_list = [
        f'• Região ID {r["id"]}: {r["count"]} registros' for r in frequent
    ]

    frequent_ids = [r['id'] for r in report_data['frequentPainRegions']]
    drawing = get_highlighted_body_map(frequent_ids)
    drawing.scale(0.22, 0.22)

    layout_data = [
        [
            Paragraph(
                '<br/><br/>'.join(frequent_list) or 'Nenhuma região relatada.',
                styles['Normal'],
            ),
            drawing,
        ]
    ]

    layout_table = Table(layout_data, colWidths=[7 * cm, 9 * cm])
    layout_table.setStyle(
        TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ])
    )
    elements.append(layout_table)

    # Linha do Tempo de Sintomas
    elements.append(PageBreak())
    elements.append(Paragraph('DETALHAMENTO DIÁRIO', section_style))

    timeline_header = [
        ['Data', 'Dor', 'Fad.', 'Sono', 'Emoção', 'Observações']
    ]
    timeline_data = timeline_header + [
        [
            e['date'].strftime('%d/%m'),
            f'{e["pain"]}' if e['pain'] is not None else '-',
            f'{e["fatigue"]}' if e['fatigue'] is not None else '-',
            f'{e["sleep"]}' if e['sleep'] is not None else '-',
            e['emotion'] or '-',
            Paragraph(e['notes'] or '', styles['Normal']),
        ]
        for e in report_data['symptomTimeline']
    ]

    timeline_table = Table(
        timeline_data,
        colWidths=[1.5 * cm, 1.2 * cm, 1.2 * cm, 1.2 * cm, 2.5 * cm, 9.5 * cm],
        repeatRows=1,
    )
    timeline_table.setStyle(
        TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (4, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            (
                'ROWBACKGROUNDS',
                (0, 1),
                (-1, -1),
                [colors.white, SECONDARY_COLOR],
            ),
        ])
    )
    elements.append(timeline_table)

    # Registros de Crise
    if report_data['crisisHistory']:
        elements.append(Paragraph('HISTÓRICO DE CRISES', section_style))

        crisis_header = [
            ['Data/Hora', 'Int.', 'Dur.', 'Sintomas Relatados', 'Contexto']
        ]
        crisis_data = crisis_header + [
            [
                c['timestamp'].strftime('%d/%m %H:%M'),
                f'{c["intensity"]}',
                c['duration'] or '-',
                Paragraph(c['symptoms'] or '-', styles['Normal']),
                Paragraph(c['context'] or '-', styles['Normal']),
            ]
            for c in report_data['crisisHistory']
        ]

        crisis_table = Table(
            crisis_data,
            colWidths=[2.5 * cm, 1.2 * cm, 1.5 * cm, 5.5 * cm, 6.5 * cm],
            repeatRows=1,
        )
        crisis_table.setStyle(
            TableStyle([
                (
                    'BACKGROUND',
                    (0, 0),
                    (-1, 0),
                    colors.HexColor('#A52A2A'),
                ),  # Dark red for crises
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (2, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ])
        )
        elements.append(crisis_table)

    doc.build(elements)
    pdf_value = buffer.getvalue()
    buffer.close()
    return pdf_value
