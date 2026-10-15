---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/styles/studio.css","src/layouts/PapercraftBase.astro","src/layouts/PapercraftLayout.astro"]
---

# Homepage — Project stage
Mode: Persuade, with real work leading the decision. Primary action: Telegram discussion.
Approved comp: `.impeccable/mocks/02-project-stage.png`, 1536 × 1024, user selected 2026-10-16. Later explicit amendments: lavender duotone default, original colors on hover/focus/tap; rich coherent animation; glass references supplement composition.

## Spatial and material inventory
| Ingredient | Implementation | Commitment |
|---|---|---|
| Ground | CSS | #F1F2F7 sampled 200×40 at600,40 |
| Stage field | CSS geometry | #DFDFFD sampled200×25 at900,380; full width starting y365; large asymmetrical curve left,16px right |
| Indigo crest | CSS geometry | #4951F8 sampled30×25 at1440,315; curved tab rising behind stage right |
| Headline | Semantic text, selfhost Onest variable | 128px bold desktop, tight two lines, AI indigo; top120px left80px |
| Header | Semantic nav | Name left, two navigation links and black pill CTA right |
| Main CTA | Semantic anchor | Large black rounded button to right of headline, arrow motion |
| GoalSphere | Existing actual screenshot | public/cases/goalsphere/hero-desktop.webp; right56% stage, natural16:9, no fake interface |
| Знамя Труда | Existing actual screenshot | public/cases/znamya-truda/hero-desktop.webp; left36% overlaps GoalSphere; natural16:10 |
| Preview treatment | CSS duotone + interactive button | Strong lavender integration at rest, natural image revealed on hover/focus/tap; separate external project title link |
| Glass control | CSS backdrop-filter | Small color control over screenshot; real pixels behind, accessible solid fallback; no global WebGPU dependency |
| Lower cases | Semantic content + existing screenshots | Manifik and Ценцова offset image layout; AI Project Manager and Aesoqua text projects without fabricated private screenshots |
| Services | Semantic rows | Three directions with moving arrow and hover sweep, no price |
| Closing contact | Semantic typography + vector geometry | Oversized Telegram invitation with one fluid indigo sheet |

## Component grammar
Onest sans, solid black text, indigo emphasis. Filled pill controls. Screenshots 12–16px corner, diffused offset shadow; no decorative bordered cards. Captions outside images, no fake browser chrome. Spacious transitions, uneven image scale, short content.

## Motion
Opening letter assembly, perspective unfolding of projects; scroll-driven separation of stage layers; lavender-to-color reveal; pointer tilt, lift and bounded highlight on previews; clip reveal of lower work; service focus/hover sweep; magnetic CTA feedback, footer sheet reveal, scroll-driven contours and arrow. Native scrolling, static visible content if JS unavailable, all decorative movement disabled by prefers-reduced-motion.

## Boundaries
Six cases, no invented metrics, no private images, no prices. Existing /scratchik routes added remotely are retained. Mobile rearranges the overlap into a legible sequential stage; color toggle is independent of navigation. No unresolved user decisions.
