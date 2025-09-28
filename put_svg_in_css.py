from urllib.parse import quote as escape_url

SVG_FILE = "./assets/boards/shogiPlain.svg"
IN_CSS = "./raw_styles.css"
OUT_CSS = "./styles.css"

with open(SVG_FILE, "r") as svg:
    # Replacing `%22` with `'` as urllib.parse.quote() encodes `'` as `%22` (undesired)
    escaped_svg = escape_url(svg.read(), "/ =:;").replace("%22", "'")
    css_url_of_svg = f'url("data:image/svg+xml;charset=utf8,{escaped_svg}")'

with open(IN_CSS, "r") as in_css:
    with open(OUT_CSS, "w") as out_css:
        for line in in_css:
            newline = line.replace(f'"SVG-REPLACE {SVG_FILE}"', css_url_of_svg)
            out_css.write(newline)
