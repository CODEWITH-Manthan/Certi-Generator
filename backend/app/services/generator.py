import io
import re
import uuid
import zipfile
import logging
import urllib.request
import pandas as pd
from pathlib import Path
from datetime import datetime
# pyrefly: ignore [import-error, missing-import]
from PIL import Image, ImageDraw, ImageFont
from app.config import FONTS, FONTS_DIR, TEMP_DIR

# Maps font names used in the designer UI → actual cached .ttf file base name
FONT_ALIAS_MAP: dict = {
    # ── Calligraphy & Script ────────────────────────────
    "greatvibes":        "greatvibes",
    "dancingscript":     "dancingscript",
    "pacifico":          "pacifico",
    "sacramento":        "sacramento",
    "pinyonscript":      "pinyonscript",
    "alexbrush":         "alexbrush",
    "allura":            "allura",
    "tangerine":         "tangerine",
    "italianno":         "italianno",
    "parisienne":        "parisienne",

    # ── Elegant Serif ───────────────────────────────────
    "playfairdisplay":   "serif",        # pre-existing file
    "cormorantgaramond": "cormorantgaramond",  # falls back to serif if download failed
    "cinzel":            "cinzel",
    "lora":              "lora",
    "merriweather":      "merriweather",        # falls back to serif if download failed
    "ebgaramond":        "ebgaramond",
    "librebaskerville":  "librebaskerville",    # falls back to serif if download failed
    "crimsontext":       "crimsontext",

    # ── Modern Sans-Serif ────────────────────────────────
    "inter":             "sans",         # pre-existing file
    "poppins":           "poppins",
    "outfit":            "outfit",
    "montserrat":        "accent",       # pre-existing file
    "raleway":           "raleway",
    "nunito":            "nunito",
    "dmsans":            "dmsans",
    "plusjakartasans":   "plusjakartasans",

    # ── Display & Decorative ─────────────────────────────
    "josefinsans":       "josefinsans",
    "oswald":            "oswald",
    "bebasneue":         "bebasneue",
    "abrilfatface":      "abrilfatface",
    "righteous":         "righteous",

    # ── Classic ──────────────────────────────────────────
    "roboto":            "roboto",
    "opensans":          "opensans",
    "open sans":         "opensans",
    "lato":              "lato",
    "ubuntu":            "ubuntu",
    "sourcesans3":       "sourcesans3",
    "source sans 3":     "sourcesans3",

    # Legacy aliases (keep backward compat) ──────────────
    "sourcesanspro":     "sans",
}

def _resolve_font_key(font_name_raw: str) -> str:
    """Normalises a designer font name to our cached .ttf base name."""
    key = font_name_raw.replace(" ", "").lower()
    return FONT_ALIAS_MAP.get(key, key)


def _format_cell_value(value: str) -> str:
    """If the value looks like a datetime timestamp, format it nicely."""
    v = value.strip()
    # Try parsing common pandas/Excel timestamp strings
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y"):
        try:
            dt = datetime.strptime(v, fmt)
            # strftime %d zero-pads; strip manually for cross-platform compatibility
            month_day_year = dt.strftime("%B %d, %Y")
            # Remove leading zero from day e.g. "March 08" → "March 8"
            return month_day_year.replace(" 0", " ")
        except ValueError:
            continue
    return v


logger = logging.getLogger(__name__)

def download_required_fonts():
    """Downloads configured Google Fonts if they are not already cached locally."""
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    for name, url in FONTS.items():
        font_path = FONTS_DIR / f"{name}.ttf"
        if not font_path.exists():
            try:
                logger.info(f"Downloading font '{name}' from {url}...")
                # Add User-Agent header to avoid HTTP 403 Forbidden from GitHub raw links
                req = urllib.request.Request(
                    url, 
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                )
                with urllib.request.urlopen(req) as response:
                    with open(font_path, 'wb') as out_file:
                        out_file.write(response.read())
                logger.info(f"Successfully cached font: {name}.ttf")
            except Exception as e:
                logger.error(f"Failed to download font '{name}': {e}")

def sanitize_filename(filename: str) -> str:
    """Sanitizes strings to be safe for filenames across Windows/Linux filesystems."""
    # Replace invalid chars with underscore
    sanitized = re.sub(r'[\\/*?:"<>|]', '_', filename)
    # Remove leading/trailing spaces and dots
    return sanitized.strip(" .")

def generate_certificates_zip(
    template_bytes: bytes,
    excel_data: list,
    mapping_config: dict
) -> bytes:
    """
    Parses Excel sheet, loops through rows, draws text at mapped coordinates,
    generates individual PDFs, aggregates into a ZIP, and returns the ZIP bytes.
    """
    # 1. Load data into pandas
    try:
        df = pd.DataFrame(excel_data)
        df = df.fillna("") # Replace NaNs with empty string
    except Exception as e:
        logger.error(f"Failed to parse Excel data: {e}")
        raise ValueError(f"Spreadsheet parse error: {e}")

    # 2. Open Certificate template image
    try:
        template_img = Image.open(io.BytesIO(template_bytes))
        # Pillow requires RGB mode to export directly to PDF container
        if template_img.mode == 'RGBA':
            template_img = template_img.convert('RGB')
    except Exception as e:
        logger.error(f"Failed to load template image: {e}")
        raise ValueError(f"Graphic template error: {e}")

    w, h = template_img.size
    
    # 3. Create unique temp folder for individual PDFs
    req_uuid = uuid.uuid4()
    pdf_temp_dir = TEMP_DIR / f"run_{req_uuid}"
    pdf_temp_dir.mkdir(parents=True, exist_ok=True)

    generated_files = []

    try:
        # Loop through each student row
        for idx, row in df.iterrows():
            # Copy template to avoid drawing over previous iteration
            cert_canvas = template_img.copy()
            draw = ImageDraw.Draw(cert_canvas)
            
            # Draw each mapped field
            for field_key, field_val in mapping_config.items():
                col_name = field_val.get("column")
                if not col_name or col_name not in df.columns:
                    continue
                
                # Fetch row value
                text_content = _format_cell_value(str(row[col_name]))
                if not text_content:
                    continue

                # Get coordinate percentages
                x_pct = float(field_val.get("x", 0.5))
                y_pct = float(field_val.get("y", 0.5))
                
                # Calculate absolute pixels
                px_x = x_pct * w
                px_y = y_pct * h

                # Fetch style toggles
                is_bold = field_val.get("isBold", False)
                is_italic = field_val.get("isItalic", False)

                # Load Font — resolve designer name → cached file base name
                font_base = _resolve_font_key(field_val.get("font", "Inter"))

                # Determine font size
                fs_ratio = float(field_val.get("fontSize", 0.03))
                pixel_font_size = max(8, int(fs_ratio * h * 1.333))

                # Build candidate paths in priority order
                style_suffix = ""
                if is_bold and is_italic:
                    style_suffix = "bolditalic"
                elif is_bold:
                    style_suffix = "bold"
                elif is_italic:
                    style_suffix = "italic"

                candidates = []
                if style_suffix:
                    candidates.append(FONTS_DIR / f"{font_base}{style_suffix}.ttf")
                candidates.append(FONTS_DIR / f"{font_base}regular.ttf")
                candidates.append(FONTS_DIR / f"{font_base}.ttf")

                loaded_font_path = None
                font = None
                for cand in candidates:
                    if cand.exists():
                        try:
                            font = ImageFont.truetype(str(cand), pixel_font_size)
                            loaded_font_path = str(cand)
                            break
                        except Exception:
                            continue

                if font is None:
                    # Ultimate fallback: try sans/serif/accent directly
                    for fb in ("sans", "serif", "accent"):
                        fb_path = FONTS_DIR / f"{fb}.ttf"
                        if fb_path.exists():
                            try:
                                font = ImageFont.truetype(str(fb_path), pixel_font_size)
                                loaded_font_path = str(fb_path)
                                logger.warning(f"Font '{font_base}' not found, using fallback '{fb}'.")
                                break
                            except Exception:
                                continue

                if font is None:
                    font = ImageFont.load_default()
                    logger.warning(f"No usable font found for '{font_base}', using bitmap default.")

                # Simulate bold via stroke only when bold was requested but no real bold TTF was loaded
                is_simulated_bold = is_bold and loaded_font_path and ("bold" not in loaded_font_path.lower())
                # Keep stroke very thin so it doesn't look smeared — 1px for small text, 2px for large
                stroke_width = max(1, min(2, int(pixel_font_size * 0.02))) if is_simulated_bold else 0

                # Determine PIL text drawing anchor
                # Left -> 'la' (left-ascender), Center -> 'ma' (middle-ascender), Right -> 'ra' (right-ascender)
                align = field_val.get("align", "center")
                anchor = "la"
                if align == "center":
                    anchor = "ma"
                elif align == "right":
                    anchor = "ra"

                # Text Color (hex code fallback to black)
                text_color = field_val.get("color", "#000000")

                # Draw text on copy
                draw.text(
                    (px_x, px_y), 
                    text_content, 
                    font=font, 
                    fill=text_color, 
                    anchor=anchor, 
                    stroke_width=stroke_width, 
                    stroke_fill=text_color
                )

            # Determine unique name for certificate PDF
            # Try to grab name field from config, otherwise fallback to index number
            recipient_val = ""
            name_col = mapping_config.get("name", {}).get("column")
            if name_col and name_col in df.columns:
                recipient_val = str(row[name_col]).strip()
            
            base_filename = f"Certificate_{idx + 1}"
            if recipient_val:
                base_filename = f"Certificate_{sanitize_filename(recipient_val)}"

            pdf_filename = f"{base_filename}.pdf"
            pdf_path = pdf_temp_dir / pdf_filename

            # Save frame directly as PDF page
            cert_canvas.save(pdf_path, "PDF")
            generated_files.append((pdf_path, pdf_filename))

        # 4. Pack all PDFs into an in-memory ZIP archive
        zip_io = io.BytesIO()
        with zipfile.ZipFile(zip_io, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file_path, name_in_zip in generated_files:
                zip_file.write(file_path, arcname=name_in_zip)
        
        return zip_io.getvalue()

    finally:
        # 5. Clean up individual temp PDFs from disk immediately
        try:
            for file_path, _ in generated_files:
                if file_path.exists():
                    file_path.unlink()
            if pdf_temp_dir.exists():
                pdf_temp_dir.rmdir()
        except Exception as cleanup_err:
            logger.error(f"Error during intermediate clean-up: {cleanup_err}")
