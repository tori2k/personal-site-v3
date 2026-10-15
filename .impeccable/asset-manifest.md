# Homepage asset manifest

Reviewed 2026-10-16 against `PRODUCT.md`, the homepage surface brief, the approved `02-project-stage.png` comp (1536 × 1024), and all four source screenshots. Scope: the redesigned homepage; unrelated legacy rasters are excluded.

## Shipping raster inventory

GoalSphere, Знамя Труда and Manifik are **preexisting actual screenshots from the corresponding public client site, already in this project before this redesign**. Those three were not freshly captured, generated, or retouched in this pass. Ценцова was refreshed from its live public site on 2026-10-16 using a real CUA browser screenshot after accepting the cookie notice, then converted to WebP. Original capture dates are not asserted. Site addresses identify the projects; a current address is not a claim about which hostname was used for the historical capture.

| Existing asset | Dimensions / aspect | Project source | Homepage use |
|---|---|---|---|
| `public/cases/goalsphere/hero-desktop.webp` | 1280 × 720 / 16:9 | GoalSphere; current project URL `https://goalsphere.agency/`, legacy source registry URL `https://goalsphere-agency.vercel.app/` | Large right-hand stage screenshot; retain the actual interface |
| `public/cases/znamya-truda/hero-desktop.webp` | 1440 × 900 / 16:10 | ФК «Знамя Труда», `https://fczt1909.ru/` | Smaller foreground stage screenshot overlapping GoalSphere |
| `public/cases/manifik/hero-desktop.webp` | 1600 × 1000 / 16:10 | Manifik, `https://manifik-school.ru/` | Lower selected-work screenshot |
| `public/cases/tsentsova/hero-desktop.webp` | 1280 × 720 / 16:9 | Алиса Ценцова, `https://tsentsova.ru/` | Lower selected-work screenshot |

Each WebP has a sibling `.webp.json` provenance sidecar written and read by Impeccable's `embed-prompt.mjs`. This is that script's supported WebP fallback, not a generation claim. The three reused raster images remain unchanged. Ценцова provenance records the fresh capture.

## Medium review

| Visible ingredient | Appropriate medium | Verdict |
|---|---|---|
| Real project interfaces, photography and room scene inside them | Existing screenshots above | Reuse; do not redraw or synthesize client work |
| Lavender stage, indigo crest, curved overlap and footer sheet | CSS/SVG geometry | These are countable smooth shapes, not sculpted physical materials; keep them responsive and animated |
| Lavender duotone and natural-color reveal | CSS/SVG filter/compositing over the unchanged screenshots | Do not bake tint into the files; original pixels must return on hover/focus/tap |
| Small glass color controls | Semantic buttons with CSS backdrop treatment and solid fallback | Must remain interactive and keyboard accessible |
| Headlines, navigation, project captions and CTA | Semantic text, links and vector arrows | No raster UI text or fake browser frames |
| AI Project Manager and Aesoqua | Text-only project entries | No approved public screenshot available; do not fabricate imagery |

## Production verdict

**Produce bucket: empty. No additional art is required for the approved composition.** Its image-native content is fully supplied by the existing screenshots. SceneAI, Liquid Glass and OnePromptDesign guide motion/material treatment; they do not supply case evidence or require importing third-party imagery.

Retain the screenshots' aspect ratios and legible content. The existing Знамя Труда source includes a tiny clipped development toolbar at the extreme bottom. The Ценцова cookie-banner limitation was resolved by a fresh real screenshot. These are source-capture limitations, not missing artwork; they have not been silently edited. Any presentation crop must preserve the recognisable interface and avoid implying a new capture.

Verification: all four images opened, actual dimensions checked, provenance read back and a scan limited to these four files completed with zero missing records. No UI code or unrelated raster was modified by the asset pass.

## Social preview and portrait

`public/og-image.jpg` is a real 1536×1024 screenshot of the implemented first viewport after finish corrections, with its original client images and CSS tint. No generated interface pixels. `public/kirill.jpg` is the pre-existing user portrait referenced by Person schema; unchanged. Both carry provenance.

## Finish adjustment

The Znamya preview uses a CSS viewport crop of the bottom 40 source pixels (1440 × 860 visible region) to exclude a historical development toolbar. The source raster stays unchanged; both toned and original-color layers use the same crop.
