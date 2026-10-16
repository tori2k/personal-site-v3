# Project cover assets — 2026-10-16

Approved direction: `.impeccable/review/project-cover-concept.png`. Production uses editable Onest text and separate native reveal controls. Covers are editorial illustrations; original client screenshots remain the actual case evidence and JSON-LD images.

| File | Source | Dimensions | Size |
|---|---|---|---|
| `public/cases/covers/football.webp` | Built-in ImageGen | 1000 × 1000, alpha | 99,782 bytes |
| `public/cases/covers/microphone.webp` | Built-in ImageGen | 1000 × 1000, alpha | 116,064 bytes |
| `public/cases/covers/documents.webp` | Built-in ImageGen | 1000 × 1000, alpha | 69,948 bytes |
| `public/cases/covers/znamya-crest.webp` | https://fczt1909.ru/logo.png | 900 × 900, alpha | 86,742 bytes |

The club crest preserves the original shapes and lettering. A static SVG lighting filter and CSS perspective apply the porcelain treatment at render time; no generated lettering. ImageGen originals are preserved in the session's generated_images folder. WebP conversion resizes and compresses with alpha preserved; no artwork is reconstructed in code.

## Exact generation prompts

All three built-in calls used `transparent_background: true` and the approved concept as `referenced_image_paths`. Each prompt was the following shared prefix plus its subject paragraph. No CLI/API fallback was used.

### Shared prefix

Use case: stylized-concept. Production website cover illustration for kirillbaryev.ru. Reference image is the APPROVED visual concept: match its white/very pale lavender material, expensive soft studio lighting, subtle texture, restrained #4951f8 accents, crisp high-end art direction. Output only the isolated object, genuinely transparent background, no canvas floor, no website layout, no typography, no UI, no watermark. Entire subject inside frame with 8% transparent padding. This image will sit over a pale lavender #dfdffd CSS background with live editable text.

### football.webp

A single large beautifully crafted regulation football, matte ivory leather panels with very light lavender shading, exactly one indigo pentagon near upper right. 3/4 front view. Beautiful finely textured leather and seams, natural volume. No brand names or logos. Slightly diagonal angle like the large GoalSphere ball in the reference. Square composition, isolated full spherical ball, absolutely no cropping.

### microphone.webp

A single sculptural vintage studio vocal microphone, pale porcelain-white body and finely detailed lavender metal mesh grille, a small indigo accent at the stem. Elegant 3/4 front view with the microphone subtly tilted diagonally, no bulky desktop base, only the mic body and small suspension mount. Expensive music-studio object, not a flat icon. Soft shadowing integrated into the object, fully isolated. Square composition. No branding, no invented text.

### documents.webp

One curated sculptural composition: three thick white paper document sheets gently fanning upward from an open matte pale-lavender document folder, with one thin indigo ribbon/clip. Refined soft paper folds and realistic edges; subtle embossed horizontal lines on the first page but no text, letters, numbers or checkmark. 3/4 view slightly from above, elegant professional legal-document editorial object. Square composition, full isolated object. No app icon or surrounding floating decoration.

## Interaction and verification

Mouse enter/leave opens/closes on fine-pointer desktop; narrow viewports and touch use the full-cover native button. Enter/Space toggle, Escape closes. Names, aria-expanded and screenshot visibility agree. Reduced motion uses a brief opacity change. The image decode guard preserves the cover while a screenshot loads and cancels a superseded reveal. A cover closes after scrolling out of view. Case links remain independent and work without JavaScript.

Build/schema checks include the original screenshot URLs and their actual presence in the output. External validation evidence is recorded in `schema-validation.md` after production deployment.
