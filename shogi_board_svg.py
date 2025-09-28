import xml.etree.ElementTree as ET

OUT_FILE = r".\assets\boards\shogiPlain.svg"
LINE_COLOUR = "#000000"

NUM_SHOGI_ROWS = 9
NUM_SHOGI_COLS = 9

BOARD_X_PAD = 1
BOARD_Y_PAD = 1
COL_GAP = 110
ROW_GAP = 120
LINE_WIDTH = 2
WIDTH = COL_GAP * NUM_SHOGI_COLS + 2 * BOARD_X_PAD
HEIGHT = ROW_GAP * NUM_SHOGI_ROWS + 2 * BOARD_Y_PAD

STAR_RADIUS = 8


# Draw a line from (x1, y1) to (x2, y2) where x and y are in the SVG units.
def _draw_line(parent: ET.Element, x1: int, y1: int, x2: int, y2: int) -> ET.Element:
    return ET.SubElement(
        parent,
        "line",
        {
            "x1": str(x1),
            "y1": str(y1),
            "x2": str(x2),
            "y2": str(y2),
        },
    )


def _draw_circle(parent: ET.Element, c1: int, r1: int, radius: int) -> ET.Element:
    return ET.SubElement(
        parent,
        "circle",
        {"cx": str(_x_from_col(c1)), "cy": str(_y_from_row(r1)), "r": str(radius)},
    )


def _x_from_col(c: int) -> int:
    return BOARD_X_PAD + COL_GAP * (c - 1)


def _y_from_row(r: int) -> int:
    return BOARD_Y_PAD + ROW_GAP * (r - 1)


# Draw a line from (r1, c1) to (r2, c2) where r and c are one-indexed row/column numbers from top left.
def draw_line(parent: ET.Element, c1: int, r1: int, c2: int, r2: int) -> ET.Element:
    return _draw_line(
        parent,
        x1=_x_from_col(c1),
        y1=_y_from_row(r1),
        x2=_x_from_col(c2),
        y2=_y_from_row(r2),
    )


# Draw a star point at (r, c) where r and c are one-indexed row/column numbers from top left.
def draw_star(parent: ET.Element, c: int, r: int) -> None:
    _draw_circle(parent, c, r, STAR_RADIUS)


root = ET.Element(
    "svg",
    {
        "version": "1.1",
        "xmlns": "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": f"0 0 {WIDTH} {HEIGHT}",
        "stroke": LINE_COLOUR,
        "stroke-width": str(LINE_WIDTH),
        "stroke-linecap": "square",
    },
)

for j in range(1, NUM_SHOGI_ROWS + 2):
    draw_line(root, 1, j, NUM_SHOGI_COLS + 1, j)

for i in range(1, NUM_SHOGI_COLS + 2):
    draw_line(root, i, 1, i, NUM_SHOGI_ROWS + 1)

draw_star(root, 4, 4)
draw_star(root, 4, 7)
draw_star(root, 7, 4)
draw_star(root, 7, 7)

tree = ET.ElementTree(root)
tree.write(OUT_FILE, encoding="UTF-8", xml_declaration=True)
