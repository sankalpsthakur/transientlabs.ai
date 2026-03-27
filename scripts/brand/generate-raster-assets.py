#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path
from shutil import copyfile

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
PUBLIC_BRAND_DIR = ROOT / "public" / "brand"
FAVICON_DIR = PUBLIC_BRAND_DIR / "favicon"
SOCIAL_DIR = PUBLIC_BRAND_DIR / "social"
APP_FAVICON_PATH = ROOT / "src" / "app" / "favicon.ico"

PAPER = "#F8F2E9"
PAPER_ALT = "#FBF7F0"
INK = "#18120D"
WARM_GRAY = "#6F5D4C"
DIVIDER = "#D7C6B0"
SIGNAL_BLUE = "#1F3F93"


def ensure_dirs() -> None:
    FAVICON_DIR.mkdir(parents=True, exist_ok=True)
    SOCIAL_DIR.mkdir(parents=True, exist_ok=True)


def load_font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = (
        [
            "/System/Library/Fonts/HelveticaNeue.ttc",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
        if bold
        else [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/HelveticaNeue.ttc",
            "/System/Library/Fonts/Supplemental/Arial.ttf",
        ]
    )

    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)

    return ImageFont.load_default()


def alpha(color: str, value: int) -> tuple[int, int, int, int]:
    color = color.lstrip("#")
    return (
        int(color[0:2], 16),
        int(color[2:4], 16),
        int(color[4:6], 16),
        value,
    )


def ring_bounds(cx: float, cy: float, radius: float) -> tuple[float, float, float, float]:
    return (cx - radius, cy - radius, cx + radius, cy + radius)


def draw_long_exposure(
    image: Image.Image,
    *,
    center: tuple[float, float],
    radius: float,
    gap: float,
    stroke_width: int,
    palette: tuple[str, str, str] = (INK, SIGNAL_BLUE, INK),
    opacities: tuple[int, int, int] = (46, 148, 255),
) -> None:
    draw = ImageDraw.Draw(image, "RGBA")
    cx, cy = center

    for x_shift, color, opacity in zip((-gap, 0, gap), palette, opacities, strict=True):
        draw.ellipse(
            ring_bounds(cx + x_shift, cy, radius),
            outline=alpha(color, opacity),
            width=stroke_width,
        )


def build_symbol_plate(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image, "RGBA")

    draw.rounded_rectangle(
        (0, 0, size - 1, size - 1),
        radius=int(size * 0.24),
        fill=PAPER_ALT,
        outline=alpha(DIVIDER, 168),
        width=max(1, size // 64),
    )

    draw_long_exposure(
        image,
        center=(size * 0.5, size * 0.5),
        radius=size * (17 / 84),
        gap=size * (14 / 84),
        stroke_width=max(2, round(size * (5 / 84))),
    )

    return image


def build_social_card(size: tuple[int, int], *, twitter: bool = False) -> Image.Image:
    width, height = size
    image = Image.new("RGBA", size, PAPER)
    draw = ImageDraw.Draw(image, "RGBA")

    draw.rounded_rectangle(
        (40, 40, width - 40, height - 40),
        radius=36,
        outline=alpha(DIVIDER, 120),
        width=2,
    )

    draw_long_exposure(
        image,
        center=(width - 220, 172),
        radius=116,
        gap=72,
        stroke_width=16,
        opacities=(18, 42, 74),
    )
    draw_long_exposure(
        image,
        center=(width - 110, height - 108),
        radius=82,
        gap=52,
        stroke_width=12,
        opacities=(12, 28, 52),
    )

    badge = build_symbol_plate(152)
    image.alpha_composite(badge, (86, 108))

    draw.line((270, 124, 270, 262), fill=alpha(DIVIDER, 255), width=2)

    title_font = load_font(66 if twitter else 72, bold=True)
    descriptor_font = load_font(22, bold=True)
    tagline_font = load_font(40, bold=False)
    body_font = load_font(22, bold=False)

    draw.text((310, 132), "Transient Labs", font=title_font, fill=INK)
    draw.text(
        (312, 214),
        "AGENTIC SYSTEMS AND PRODUCT STUDIO",
        font=descriptor_font,
        fill=WARM_GRAY,
    )
    draw.text((92, 404), "Eternal Transience of Intelligence", font=tagline_font, fill=INK)
    draw.text(
        (92, 462),
        "The eternal transience of intelligence",
        font=body_font,
        fill=WARM_GRAY,
    )
    draw.text((92, 516), "100xai.engineering", font=body_font, fill=SIGNAL_BLUE)

    return image


def save_png(image: Image.Image, path: Path, *, size: tuple[int, int] | None = None) -> None:
    output = image
    if size is not None and image.size != size:
        output = image.resize(size, Image.Resampling.LANCZOS)
    output.save(path, format="PNG")


def main() -> None:
    ensure_dirs()

    master_symbol = build_symbol_plate(1024)
    save_png(master_symbol, FAVICON_DIR / "icon-512.png", size=(512, 512))
    save_png(master_symbol, FAVICON_DIR / "icon-192.png", size=(192, 192))
    save_png(master_symbol, FAVICON_DIR / "apple-touch-icon.png", size=(180, 180))
    save_png(master_symbol, FAVICON_DIR / "icon-32.png", size=(32, 32))
    save_png(master_symbol, FAVICON_DIR / "icon-16.png", size=(16, 16))

    favicon_master = master_symbol.resize((256, 256), Image.Resampling.LANCZOS)
    favicon_master.save(
        FAVICON_DIR / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )
    copyfile(FAVICON_DIR / "favicon.ico", APP_FAVICON_PATH)

    save_png(build_social_card((1200, 630)), SOCIAL_DIR / "og-default.png")
    save_png(build_social_card((1200, 630), twitter=True), SOCIAL_DIR / "twitter-default.png")


if __name__ == "__main__":
    main()
