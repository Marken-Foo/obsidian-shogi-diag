import base64

PIECE_FOLDER_PATH = "./assets/pieces/kanji_light"
OUT_CSS = "./kanji_light.css"
EXTENSION = "png"

SIDES = ["0", "1"]
PIECE_TYPES = [
    "FU",
    "KY",
    "KE",
    "GI",
    "KI",
    "KA",
    "HI",
    "OU",
    "TO",
    "NY",
    "NK",
    "NG",
    "UM",
    "RY",
]

css_contents = {}

for side in SIDES:
    for piece_type in PIECE_TYPES:
        filepath = f"{PIECE_FOLDER_PATH}/{side}{piece_type}.{EXTENSION}"
        with open(filepath, "rb") as img:
            raw_bytes = img.read()
            base64_str = base64.b64encode(raw_bytes).decode("utf-8")
            data_url = f"data:image/{EXTENSION};base64,{base64_str}"
            css_contents[f"{side}{piece_type}"] = data_url

with open(OUT_CSS, "w") as out_css:
    for key, data_url in css_contents.items():
        out_css.writelines(
            (
                f".shogi_diag_{key} {{\n",
                f'  background-image: url("{data_url}");\n',
                "}\n",
            )
        )
