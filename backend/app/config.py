import os
from pathlib import Path

# Base Directory paths
BASE_DIR = Path(__file__).resolve().parent.parent
TEMP_DIR = BASE_DIR / "temp"
UPLOAD_DIR = TEMP_DIR / "uploads"
OUTPUT_DIR = TEMP_DIR / "output"
FONTS_DIR = BASE_DIR / "fonts"

# Ensure directories exist
TEMP_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
FONTS_DIR.mkdir(parents=True, exist_ok=True)

# Font names mapped to their GitHub Google Fonts raw URLs
# Three tiers: display names used in the UI map to local file base-names (see generator.py FONT_ALIAS_MAP)
FONTS = {
    # ── Core families (existing) ────────────────────────────────────────
    "sans":   "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf",
    "serif":  "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf",
    "accent": "https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf",

    # ── Calligraphy & Script ────────────────────────────────────────────
    "greatvibes":     "https://github.com/google/fonts/raw/main/ofl/greatvibes/GreatVibes-Regular.ttf",
    "dancingscript":  "https://github.com/google/fonts/raw/main/ofl/dancingscript/DancingScript%5Bwght%5D.ttf",
    "pacifico":       "https://github.com/google/fonts/raw/main/ofl/pacifico/Pacifico-Regular.ttf",
    "sacramento":     "https://github.com/google/fonts/raw/main/ofl/sacramento/Sacramento-Regular.ttf",
    "pinyonscript":   "https://github.com/google/fonts/raw/main/ofl/pinyonscript/PinyonScript-Regular.ttf",
    "alexbrush":      "https://github.com/google/fonts/raw/main/ofl/alexbrush/AlexBrush-Regular.ttf",
    "allura":         "https://github.com/google/fonts/raw/main/ofl/allura/Allura-Regular.ttf",
    "tangerine":      "https://github.com/google/fonts/raw/main/ofl/tangerine/Tangerine-Regular.ttf",
    "italianno":      "https://github.com/google/fonts/raw/main/ofl/italianno/Italianno-Regular.ttf",
    "parisienne":     "https://github.com/google/fonts/raw/main/ofl/parisienne/Parisienne-Regular.ttf",

    # ── Elegant Serif ───────────────────────────────────────────────────
    "cormorantgaramond": "https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    "cinzel":            "https://github.com/google/fonts/raw/main/ofl/cinzel/Cinzel%5Bwght%5D.ttf",
    "lora":              "https://github.com/google/fonts/raw/main/ofl/lora/Lora%5Bwght%5D.ttf",
    # NOTE: Merriweather — no stable TTF raw URL; place merriweather.ttf manually in fonts/ to enable it.
    #       The generator gracefully falls back to serif (Playfair Display) if merriweather.ttf is absent.
    "ebgaramond":        "https://github.com/google/fonts/raw/main/ofl/ebgaramond/EBGaramond%5Bwght%5D.ttf",
    "librebaskerville":  "https://github.com/google/fonts/raw/main/ofl/librebaskerville/LibreBaskerville-Regular.ttf",
    "crimsontext":       "https://github.com/google/fonts/raw/main/ofl/crimsontext/CrimsonText-Regular.ttf",

    # ── Modern Sans-Serif ───────────────────────────────────────────────
    "poppins":           "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf",
    "outfit":            "https://github.com/google/fonts/raw/main/ofl/outfit/Outfit%5Bwght%5D.ttf",
    "raleway":           "https://github.com/google/fonts/raw/main/ofl/raleway/Raleway%5Bwght%5D.ttf",
    "nunito":            "https://github.com/google/fonts/raw/main/ofl/nunito/Nunito%5Bwght%5D.ttf",
    "dmsans":            "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf",
    "plusjakartasans":   "https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf",

    # ── Display & Decorative ────────────────────────────────────────────
    "josefinsans":       "https://github.com/google/fonts/raw/main/ofl/josefinsans/JosefinSans%5Bwght%5D.ttf",
    "oswald":            "https://github.com/google/fonts/raw/main/ofl/oswald/Oswald%5Bwght%5D.ttf",
    "bebasneue":         "https://github.com/google/fonts/raw/main/ofl/bebasneue/BebasNeue-Regular.ttf",
    "abrilfatface":      "https://github.com/google/fonts/raw/main/ofl/abrilfatface/AbrilFatface-Regular.ttf",
    "righteous":         "https://github.com/google/fonts/raw/main/ofl/righteous/Righteous-Regular.ttf",

    # ── Classic ─────────────────────────────────────────────────────────
    "roboto":            "https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
    "opensans":          "https://github.com/google/fonts/raw/main/ofl/opensans/OpenSans%5Bwdth%2Cwght%5D.ttf",
    "lato":              "https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf",
    "ubuntu":            "https://github.com/google/fonts/raw/main/ufl/ubuntu/Ubuntu-Regular.ttf",
    "sourcesans3":       "https://github.com/google/fonts/raw/main/ofl/sourcesans3/SourceSans3%5Bwght%5D.ttf",
}
