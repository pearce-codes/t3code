# Brand icons

`pearce/app-icon.svg` is the source of truth for the full amber CRT icon. The standalone
`pearce/mark.svg` supplies the `PC` glyph for adaptive, monochrome, notification, and widget
surfaces.

Run `vp run icons:export` from the repository root to regenerate the tracked application, desktop,
mobile, web, and marketing assets. Run `vp run icons:check` to verify that committed derivatives
match the SVG sources without changing files.

The exporter requires `rsvg-convert`, `ffmpeg`, and macOS `iconutil`.
