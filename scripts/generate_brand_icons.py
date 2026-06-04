#!/usr/bin/env python3

from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont


REPO_ROOT = Path(__file__).resolve().parent.parent

PROD_DIR = REPO_ROOT / "assets" / "prod"
DEV_DIR = REPO_ROOT / "assets" / "dev"
NIGHTLY_DIR = REPO_ROOT / "assets" / "nightly"
DESKTOP_RESOURCES_DIR = REPO_ROOT / "apps" / "desktop" / "resources"
WEB_PUBLIC_DIR = REPO_ROOT / "apps" / "web" / "public"
MARKETING_PUBLIC_DIR = REPO_ROOT / "apps" / "marketing" / "public"

FONT_CANDIDATES = (
    Path.home() / "Library" / "Fonts" / "BerkeleyMono-Bold.ttf",
    Path.home() / "Library" / "Fonts" / "BerkeleyMono-Regular.ttf",
    Path("/System/Library/Fonts/SFNSMono.ttf"),
)


def ensure_directory(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for candidate in FONT_CANDIDATES:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    raise FileNotFoundError("Could not find Berkeley Mono or a compatible monospace fallback")


def lerp_color(a: tuple[int, int, int, int], b: tuple[int, int, int, int], t: float) -> tuple[int, int, int, int]:
    return tuple(int(round(x + (y - x) * t)) for x, y in zip(a, b))


def vertical_gradient(size: tuple[int, int], top: tuple[int, int, int, int], bottom: tuple[int, int, int, int]) -> Image.Image:
    width, height = size
    image = Image.new("RGBA", size)
    for y in range(height):
        t = y / max(height - 1, 1)
        color = lerp_color(top, bottom, t)
        ImageDraw.Draw(image).line([(0, y), (width, y)], fill=color)
    return image


def square_mask(size: int, rounded: bool) -> tuple[Image.Image, tuple[int, int, int, int]]:
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    if rounded:
        inset = round(size * 0.095)
        radius = round(size * 0.205)
        box = (inset, inset, size - inset, size - inset)
        draw.rounded_rectangle(box, radius=radius, fill=255)
        return mask, box

    box = (0, 0, size, size)
    draw.rectangle(box, fill=255)
    return mask, box


def apply_shape(canvas: Image.Image, art: Image.Image, mask: Image.Image) -> Image.Image:
    canvas.paste(art, mask=mask)
    return canvas


def draw_gloss(base: Image.Image, box: tuple[int, int, int, int], rounded: bool, mask: Image.Image) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    left, top, right, bottom = box
    height = bottom - top
    radius = round(height * (0.2 if rounded else 0.05))
    gloss_height = round(height * (0.19 if rounded else 0.12))
    draw.rounded_rectangle(
        (left + 10, top + 6, right - 10, top + gloss_height),
        radius=radius,
        fill=(255, 255, 255, 48),
    )
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=18))
    clipped = Image.new("RGBA", base.size, (0, 0, 0, 0))
    clipped.paste(overlay, mask=mask)
    base.alpha_composite(clipped)


def draw_vignette(base: Image.Image, mask: Image.Image, strength: int, blur_radius: int = 90) -> None:
    vignette = Image.new("L", base.size, 0)
    draw = ImageDraw.Draw(vignette)
    inset = round(base.size[0] * 0.06)
    draw.ellipse((inset, inset, base.size[0] - inset, base.size[1] - inset), fill=255)
    vignette = ImageChops.invert(vignette).filter(ImageFilter.GaussianBlur(radius=blur_radius))
    alpha = vignette.point(lambda value: round(value * (strength / 255)))
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow.putalpha(alpha)
    base.alpha_composite(shadow)
    base.putalpha(mask)


def build_text_mask(
    size: int,
    font_size: int,
    chars: str,
    y_factor: float,
    gap_factor: float,
    stroke_factor: float = 0.01,
) -> tuple[Image.Image, Image.Image]:
    font = load_font(font_size)
    fill_mask = Image.new("L", (size, size), 0)
    stroke_mask = Image.new("L", (size, size), 0)
    fill_draw = ImageDraw.Draw(fill_mask)
    stroke_draw = ImageDraw.Draw(stroke_mask)

    metrics = []
    for char in chars:
        bbox = fill_draw.textbbox((0, 0), char, font=font, anchor="lt")
        metrics.append((char, bbox[2] - bbox[0], bbox[3] - bbox[1]))

    gap = round(size * gap_factor)
    total_width = sum(width for _, width, _ in metrics) + gap * (len(metrics) - 1)
    x = (size - total_width) / 2
    y = size * y_factor
    stroke_width = max(2, round(size * stroke_factor))

    for char, width, _ in metrics:
        center = (x + width / 2, y)
        fill_draw.text(center, char, fill=255, font=font, anchor="mm")
        stroke_draw.text(
            center,
            char,
            fill=255,
            font=font,
            anchor="mm",
            stroke_width=stroke_width,
            stroke_fill=255,
        )
        x += width + gap

    return fill_mask, stroke_mask


def outline_from_masks(fill_mask: Image.Image, stroke_mask: Image.Image) -> Image.Image:
    return ImageChops.subtract(stroke_mask, fill_mask)


def metallic_text(size: int, fill_mask: Image.Image, stroke_mask: Image.Image) -> Image.Image:
    gradient = vertical_gradient(
        (size, size),
        (255, 255, 255, 255),
        (188, 188, 190, 255),
    )
    result = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    cast_shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    cast_shadow.paste((0, 0, 0, 120), (0, 0), stroke_mask)
    cast_shadow = ImageChops.offset(cast_shadow, round(size * 0.014), round(size * 0.018)).filter(
        ImageFilter.GaussianBlur(radius=round(size * 0.012))
    )
    result.alpha_composite(cast_shadow)

    bevel_shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bevel_shadow.paste((0, 0, 0, 125), (0, 0), fill_mask)
    bevel_shadow = ImageChops.offset(bevel_shadow, round(size * 0.008), round(size * 0.012))
    result.alpha_composite(bevel_shadow)

    bevel_highlight = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bevel_highlight.paste((255, 255, 255, 155), (0, 0), fill_mask)
    bevel_highlight = ImageChops.offset(bevel_highlight, -round(size * 0.008), -round(size * 0.01))
    result.alpha_composite(bevel_highlight)

    result.paste(gradient, (0, 0), fill_mask)

    edge = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    edge.paste((245, 245, 248, 220), (0, 0), outline_from_masks(fill_mask, stroke_mask))
    result.alpha_composite(edge)

    cut_shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    cut_shadow.paste((0, 0, 0, 95), (0, 0), outline_from_masks(fill_mask, stroke_mask))
    cut_shadow = ImageChops.offset(cut_shadow, round(size * 0.004), round(size * 0.005))
    result.alpha_composite(cut_shadow)

    inner_gloss = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    highlight = vertical_gradient((size, size), (255, 255, 255, 175), (255, 255, 255, 0))
    inner_gloss.paste(highlight, (0, 0), fill_mask)
    result.alpha_composite(inner_gloss)

    return result


def hatch_pattern(size: int, spacing: int, color: tuple[int, int, int, int]) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    for offset in range(-size, size * 2, spacing):
        draw.line(
            ((offset, size), (offset + size, 0)),
            fill=color,
            width=max(1, spacing // 8),
        )
    return image


def blueprint_text(size: int, fill_mask: Image.Image, stroke_mask: Image.Image) -> Image.Image:
    result = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    hatch = hatch_pattern(size, max(12, round(size * 0.038)), (248, 250, 252, 92))
    result.paste(hatch, (0, 0), fill_mask)

    outline = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    outline_mask = outline_from_masks(fill_mask, stroke_mask)
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow.paste((252, 254, 255, 58), (0, 0), outline_mask)
    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(1, round(size * 0.005))))
    result.alpha_composite(glow)
    outline.paste((252, 254, 255, 245), (0, 0), outline_mask)
    result.alpha_composite(outline)
    return result


def render_prod_icon(size: int, rounded: bool) -> Image.Image:
    mask, box = square_mask(size, rounded)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    art = vertical_gradient((size, size), (18, 18, 20, 255), (2, 2, 4, 255))
    inner_shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(inner_shadow).rectangle(box, fill=(0, 0, 0, 0))
    art = Image.alpha_composite(art, inner_shadow)

    apply_shape(canvas, art, mask)
    draw_gloss(canvas, box, rounded, mask)
    draw_vignette(canvas, mask, 95 if rounded else 70)

    border = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    border_draw = ImageDraw.Draw(border)
    if rounded:
        border_draw.rounded_rectangle(
            box,
            radius=round(size * 0.205),
            outline=(232, 232, 236, 22),
            width=max(1, round(size * 0.002)),
        )
    else:
        border_draw.rectangle(box, outline=(220, 220, 224, 24), width=max(1, round(size * 0.003)))
    canvas.alpha_composite(border)

    fill_mask, stroke_mask = build_text_mask(size, round(size * 0.68), "PC", 0.51, -0.055)
    canvas.alpha_composite(metallic_text(size, fill_mask, stroke_mask))
    return canvas


def draw_grid(base: Image.Image, mask: Image.Image) -> None:
    grid = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(grid)
    spacing = round(base.size[0] / 28)
    for x in range(0, base.size[0] + spacing, spacing):
        alpha = 56 if x % (spacing * 4) == 0 else 34
        draw.line(((x, 0), (x, base.size[1])), fill=(240, 248, 255, alpha), width=1)
    for y in range(0, base.size[1] + spacing, spacing):
        alpha = 56 if y % (spacing * 4) == 0 else 34
        draw.line(((0, y), (base.size[0], y)), fill=(240, 248, 255, alpha), width=1)
    grid = grid.filter(ImageFilter.GaussianBlur(radius=0.9))
    clipped = Image.new("RGBA", base.size, (0, 0, 0, 0))
    clipped.paste(grid, mask=mask)
    base.alpha_composite(clipped)


def draw_blueprint_paper_texture(base: Image.Image, size: int, mask: Image.Image) -> None:
    texture = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(texture)
    step = max(4, round(size * 0.01))
    for y in range(0, size, step):
        for x in range(0, size, step):
            value = ((x * 17 + y * 31) % 29) - 14
            if value > 7:
                draw.point((x, y), fill=(255, 255, 255, 12))
            elif value < -7:
                draw.point((x, y), fill=(0, 30, 70, 14))
    texture = texture.filter(ImageFilter.GaussianBlur(radius=1.1))
    clipped = Image.new("RGBA", base.size, (0, 0, 0, 0))
    clipped.paste(texture, mask=mask)
    base.alpha_composite(clipped)


def draw_blueprint_edge_bloom(base: Image.Image, box: tuple[int, int, int, int], size: int, mask: Image.Image) -> None:
    bloom_mask = Image.new("L", base.size, 0)
    draw = ImageDraw.Draw(bloom_mask)
    draw.rounded_rectangle(box, radius=round(size * 0.205), outline=210, width=max(5, round(size * 0.012)))
    bloom = Image.new("RGBA", base.size, (230, 246, 255, 0))
    bloom.putalpha(bloom_mask.filter(ImageFilter.GaussianBlur(radius=max(3, round(size * 0.014)))))
    clipped = Image.new("RGBA", base.size, (0, 0, 0, 0))
    clipped.paste(bloom, mask=mask)
    base.alpha_composite(clipped)


def draw_blueprint_guides(base: Image.Image, size: int) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    line = (245, 248, 252, 120)
    width = max(2, round(size * 0.004))

    top_y = round(size * 0.26)
    left_x = round(size * 0.16)
    mid_x = round(size * 0.5)
    right_x = round(size * 0.84)
    draw.line(((left_x, top_y), (mid_x - 16, top_y)), fill=line, width=width)
    draw.line(((mid_x + 16, top_y), (right_x, top_y)), fill=line, width=width)
    draw.line(((left_x, top_y - 10), (left_x + 18, top_y)), fill=line, width=width)
    draw.line(((left_x, top_y + 10), (left_x + 18, top_y)), fill=line, width=width)
    draw.line(((mid_x - 16, top_y - 10), (mid_x - 34, top_y)), fill=line, width=width)
    draw.line(((mid_x - 16, top_y + 10), (mid_x - 34, top_y)), fill=line, width=width)
    draw.line(((mid_x + 16, top_y - 10), (mid_x + 34, top_y)), fill=line, width=width)
    draw.line(((mid_x + 16, top_y + 10), (mid_x + 34, top_y)), fill=line, width=width)
    draw.line(((right_x, top_y - 10), (right_x - 18, top_y)), fill=line, width=width)
    draw.line(((right_x, top_y + 10), (right_x - 18, top_y)), fill=line, width=width)

    bottom_y = round(size * 0.79)
    draw.line(((round(size * 0.23), bottom_y), (round(size * 0.38), bottom_y)), fill=line, width=width)
    draw.line(((round(size * 0.62), bottom_y), (round(size * 0.84), bottom_y)), fill=line, width=width)
    draw.line(((round(size * 0.23), bottom_y - 10), (round(size * 0.25), bottom_y)), fill=line, width=width)
    draw.line(((round(size * 0.23), bottom_y + 10), (round(size * 0.25), bottom_y)), fill=line, width=width)
    draw.line(((round(size * 0.38), bottom_y - 10), (round(size * 0.36), bottom_y)), fill=line, width=width)
    draw.line(((round(size * 0.38), bottom_y + 10), (round(size * 0.36), bottom_y)), fill=line, width=width)
    draw.line(((round(size * 0.62), bottom_y - 10), (round(size * 0.64), bottom_y)), fill=line, width=width)
    draw.line(((round(size * 0.62), bottom_y + 10), (round(size * 0.64), bottom_y)), fill=line, width=width)
    draw.line(((round(size * 0.84), bottom_y - 10), (round(size * 0.82), bottom_y)), fill=line, width=width)
    draw.line(((round(size * 0.84), bottom_y + 10), (round(size * 0.82), bottom_y)), fill=line, width=width)

    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=1))
    base.alpha_composite(overlay)


def draw_blueprint_scuffs(base: Image.Image, size: int, mask: Image.Image) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    mark = (235, 245, 255, 42)
    width = max(1, round(size * 0.003))
    draw.arc(
        (round(size * 0.11), round(size * 0.18), round(size * 0.52), round(size * 0.75)),
        205,
        292,
        fill=mark,
        width=width,
    )
    draw.arc(
        (round(size * 0.48), round(size * 0.32), round(size * 0.86), round(size * 0.82)),
        118,
        214,
        fill=mark,
        width=width,
    )
    draw.arc(
        (round(size * 0.18), round(size * 0.3), round(size * 0.76), round(size * 0.92)),
        312,
        26,
        fill=(235, 245, 255, 34),
        width=width,
    )
    draw.line(
        (
            (round(size * 0.75), round(size * 0.16)),
            (round(size * 0.83), round(size * 0.23)),
        ),
        fill=mark,
        width=width,
    )
    draw.line(
        (
            (round(size * 0.28), round(size * 0.18)),
            (round(size * 0.39), round(size * 0.13)),
        ),
        fill=(235, 245, 255, 28),
        width=width,
    )
    draw.line(
        (
            (round(size * 0.13), round(size * 0.72)),
            (round(size * 0.22), round(size * 0.83)),
        ),
        fill=(235, 245, 255, 30),
        width=width,
    )
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=1.4))
    clipped = Image.new("RGBA", base.size, (0, 0, 0, 0))
    clipped.paste(overlay, mask=mask)
    base.alpha_composite(clipped)


def draw_ribbon(base: Image.Image, size: int, text: str) -> None:
    ribbon = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(ribbon)
    points = [
        (round(size * 0.72), size),
        (size, round(size * 0.72)),
        (size, round(size * 0.61)),
        (round(size * 0.61), size),
    ]
    draw.polygon(points, fill=(241, 202, 0, 235))

    label_size = round(size * 0.24)
    label = Image.new("RGBA", (label_size, label_size), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(label)
    font = load_font(round(size * 0.078))
    label_draw.text(
        (label_size / 2, label_size / 2),
        text,
        fill=(25, 25, 28, 255),
        font=font,
        anchor="mm",
    )
    label = label.rotate(45, resample=Image.Resampling.BICUBIC, expand=True)
    label_x = round(size * 0.79) - label.width // 2
    label_y = round(size * 0.83) - label.height // 2
    ribbon.alpha_composite(label, (label_x, label_y))
    base.alpha_composite(ribbon)


def render_blueprint_icon(size: int, rounded: bool, ribbon_text: str | None) -> Image.Image:
    mask, box = square_mask(size, rounded)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    art = vertical_gradient((size, size), (36, 132, 216, 255), (11, 82, 151, 255))
    apply_shape(canvas, art, mask)
    draw_blueprint_paper_texture(canvas, size, mask)
    draw_grid(canvas, mask)
    draw_gloss(canvas, box, rounded, mask)
    draw_blueprint_edge_bloom(canvas, box, size, mask)
    draw_vignette(canvas, mask, 54, blur_radius=74)
    draw_blueprint_scuffs(canvas, size, mask)

    fill_mask, stroke_mask = build_text_mask(size, round(size * 0.59), "PC", 0.55, -0.03, 0.006)
    canvas.alpha_composite(blueprint_text(size, fill_mask, stroke_mask))
    draw_blueprint_guides(canvas, size)

    border = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    border_draw = ImageDraw.Draw(border)
    if rounded:
        border_draw.rounded_rectangle(box, radius=round(size * 0.23), outline=(248, 250, 255, 64), width=max(2, round(size * 0.004)))
    else:
        border_draw.rectangle(box, outline=(248, 250, 255, 24), width=max(1, round(size * 0.003)))
    canvas.alpha_composite(border)

    if ribbon_text:
        draw_ribbon(canvas, size, ribbon_text)

    return canvas


def save_png(image: Image.Image, path: Path) -> None:
    ensure_directory(path)
    image.save(path)


def save_ico(image: Image.Image, path: Path) -> None:
    ensure_directory(path)
    image.save(path, format="ICO", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


def save_icns(source_png: Path, target_icns: Path) -> None:
    ensure_directory(target_icns)
    with tempfile.TemporaryDirectory(prefix="pearcecodes-iconset-") as tmp_dir:
        iconset = Path(tmp_dir) / "icon.iconset"
        iconset.mkdir(parents=True, exist_ok=True)
        source = Image.open(source_png)
        for size in (16, 32, 128, 256, 512):
            normal = source.resize((size, size), Image.Resampling.LANCZOS)
            retina = source.resize((size * 2, size * 2), Image.Resampling.LANCZOS)
            normal.save(iconset / f"icon_{size}x{size}.png")
            retina.save(iconset / f"icon_{size}x{size}@2x.png")

        subprocess.run(
            ["iconutil", "-c", "icns", str(iconset), "-o", str(target_icns)],
            check=True,
        )


def save_webp(source_png: Path, target_webp: Path) -> None:
    ensure_directory(target_webp)
    with Image.open(source_png) as image:
        image.save(target_webp, format="WEBP", quality=95)


def copy_file(source: Path, target: Path) -> None:
    ensure_directory(target)
    shutil.copy2(source, target)


def generate_theme_assets(
    *,
    mac_path: Path,
    universal_path: Path,
    favicon_16_path: Path,
    favicon_32_path: Path,
    apple_touch_path: Path,
    favicon_ico_path: Path,
    rounded_renderer,
    square_renderer,
) -> tuple[Path, Path]:
    mac = rounded_renderer(1024)
    universal = square_renderer(1024)

    save_png(mac, mac_path)
    save_png(universal, universal_path)
    save_png(universal.resize((16, 16), Image.Resampling.LANCZOS), favicon_16_path)
    save_png(universal.resize((32, 32), Image.Resampling.LANCZOS), favicon_32_path)
    save_png(universal.resize((180, 180), Image.Resampling.LANCZOS), apple_touch_path)
    save_ico(universal, favicon_ico_path)
    return mac_path, universal_path


def main() -> None:
    prod_mac, prod_universal = generate_theme_assets(
        mac_path=PROD_DIR / "black-macos-1024.png",
        universal_path=PROD_DIR / "black-universal-1024.png",
        favicon_16_path=PROD_DIR / "t3-black-web-favicon-16x16.png",
        favicon_32_path=PROD_DIR / "t3-black-web-favicon-32x32.png",
        apple_touch_path=PROD_DIR / "t3-black-web-apple-touch-180.png",
        favicon_ico_path=PROD_DIR / "t3-black-web-favicon.ico",
        rounded_renderer=lambda size: render_prod_icon(size, rounded=True),
        square_renderer=lambda size: render_prod_icon(size, rounded=False),
    )

    dev_mac, dev_universal = generate_theme_assets(
        mac_path=DEV_DIR / "blueprint-macos-1024.png",
        universal_path=DEV_DIR / "blueprint-universal-1024.png",
        favicon_16_path=DEV_DIR / "blueprint-web-favicon-16x16.png",
        favicon_32_path=DEV_DIR / "blueprint-web-favicon-32x32.png",
        apple_touch_path=DEV_DIR / "blueprint-web-apple-touch-180.png",
        favicon_ico_path=DEV_DIR / "blueprint-web-favicon.ico",
        rounded_renderer=lambda size: render_blueprint_icon(size, rounded=True, ribbon_text="Dev"),
        square_renderer=lambda size: render_blueprint_icon(size, rounded=False, ribbon_text="Dev"),
    )

    nightly_mac, nightly_universal = generate_theme_assets(
        mac_path=NIGHTLY_DIR / "blueprint-macos-1024.png",
        universal_path=NIGHTLY_DIR / "blueprint-universal-1024.png",
        favicon_16_path=NIGHTLY_DIR / "blueprint-web-favicon-16x16.png",
        favicon_32_path=NIGHTLY_DIR / "blueprint-web-favicon-32x32.png",
        apple_touch_path=NIGHTLY_DIR / "blueprint-web-apple-touch-180.png",
        favicon_ico_path=NIGHTLY_DIR / "blueprint-web-favicon.ico",
        rounded_renderer=lambda size: render_blueprint_icon(size, rounded=True, ribbon_text=None),
        square_renderer=lambda size: render_blueprint_icon(size, rounded=False, ribbon_text=None),
    )

    save_ico(Image.open(prod_universal), DESKTOP_RESOURCES_DIR / "icon.ico")
    save_png(Image.open(prod_mac).resize((512, 512), Image.Resampling.LANCZOS), DESKTOP_RESOURCES_DIR / "icon.png")
    save_icns(prod_mac, DESKTOP_RESOURCES_DIR / "icon.icns")

    copy_file(PROD_DIR / "t3-black-web-favicon.ico", WEB_PUBLIC_DIR / "favicon.ico")
    copy_file(PROD_DIR / "t3-black-web-favicon-16x16.png", WEB_PUBLIC_DIR / "favicon-16x16.png")
    copy_file(PROD_DIR / "t3-black-web-favicon-32x32.png", WEB_PUBLIC_DIR / "favicon-32x32.png")
    copy_file(PROD_DIR / "t3-black-web-apple-touch-180.png", WEB_PUBLIC_DIR / "apple-touch-icon.png")

    copy_file(PROD_DIR / "t3-black-web-favicon.ico", MARKETING_PUBLIC_DIR / "favicon.ico")
    copy_file(PROD_DIR / "t3-black-web-favicon-16x16.png", MARKETING_PUBLIC_DIR / "favicon-16x16.png")
    copy_file(PROD_DIR / "t3-black-web-favicon-32x32.png", MARKETING_PUBLIC_DIR / "favicon-32x32.png")
    copy_file(PROD_DIR / "t3-black-web-apple-touch-180.png", MARKETING_PUBLIC_DIR / "apple-touch-icon.png")
    copy_file(prod_mac, MARKETING_PUBLIC_DIR / "icon.png")
    save_webp(prod_mac, MARKETING_PUBLIC_DIR / "icon.webp")

    print("Generated PC icon assets:")
    print(f"  production: {prod_mac} and {prod_universal}")
    print(f"  development: {dev_mac} and {dev_universal}")
    print(f"  nightly: {nightly_mac} and {nightly_universal}")


if __name__ == "__main__":
    main()
