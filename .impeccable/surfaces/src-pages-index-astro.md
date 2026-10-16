---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/styles/studio.css","src/layouts/PapercraftBase.astro","src/layouts/PapercraftLayout.astro","src/components/ProjectPreview.astro","src/components/CaseStories.astro","src/components/AIProcessDemo.astro","src/components/WorkingJourney.astro","src/scripts/home-motion.ts","src/scripts/home-interactions.ts","src/data/cases.ts"]
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
| Preview treatment | CSS duotone + interactive button | Strong lavender integration at rest, natural image revealed on hover/focus/tap; separate title link opens inline case details for the two hero projects, retaining the public-site URL as fallback |
| Glass control | CSS backdrop-filter | Small color control over screenshot; real pixels behind, accessible solid fallback; no global WebGPU dependency |
| Inline case stories | `CaseStories.astro` + existing actual screenshots | GoalSphere and Знамя Труда each have task/work/outcome copy and a three-frame gallery; both start closed, only one opens at a time beneath the existing hero |
| Lower cases | Semantic content + existing screenshots | Manifik and Ценцова retain the offset image layout; AI Project Manager includes the labelled interactive process demo; Aesoqua remains a text project without invented imagery |
| AI process demo | `AIProcessDemo.astro` + DOM/SVG motion | One labelled fictional project shows messages/meeting → memory → summary/task → sourced answers; no private screenshot or live-model claim |
| Services | Semantic rows | Three directions with moving arrow and hover sweep, no price |
| Working journey | `WorkingJourney.astro` + one changing scene | Four selectable stages pair customer/author responsibilities with one result sheet; selected step, count and progress stay synchronized; last stage exposes the Telegram CTA |
| Closing contact | Semantic typography + vector geometry | Oversized Telegram invitation with one fluid indigo sheet |

## Component grammar
Onest sans, solid black text, indigo emphasis. Filled pill controls. Screenshots 12–16px corner, diffused offset shadow; no decorative bordered cards. Captions outside images, no fake browser chrome. Spacious transitions, uneven image scale, short content.

## Interactive extension

The approved hero and visual world remain the baseline. The local extension uses the existing Onest hierarchy, lavender/indigo palette, rounded image edges and quiet controls; it introduces no new raster graphics. Interaction state and transitions live in `src/scripts/home-interactions.ts`.

### Inline case stories

`CaseStories.astro` expands GoalSphere or Знамя Труда in the page. Each story pairs “Задача”, “Моя работа” and “Что получилось” with original, full-color screenshots from `src/data/cases.ts`: GoalSphere offers “Кабинет”, “Игроки”, “География”; Знамя Труда offers “Матч-центр”, “Новости”, “Футболка”. The gallery shows one frame and caption at a time, with pressed-state selection buttons. The columns stack below 760px.

Opening a story updates `aria-expanded`, moves focus to “Свернуть” and scrolls to the expanded content. Closing via that button, Escape or the same opener restores focus to the opener. Switching stories closes the previous one; interrupted story/gallery transitions are cancelled. “Открыть сайт” remains a separate external action. Without JavaScript, the original hero title links still navigate to the public project sites.

### AI process demonstration

`AIProcessDemo.astro` explains the complete system with one fictional project. Four scenes show incoming chat messages and a meeting recording, connected project memory, a summary plus a task proposal, then a sourced team answer. Large scene captions state what the system does. Three preset questions let visitors try decision, owner/deadline and rationale queries; source buttons navigate back to the corresponding scene. Task confirmation is explicitly confined to the demo, preserves keyboard focus, and does not write to an external system.

`ai-demo-motion.ts` uses ScrollTrigger to pin the complete film at the vertical center of the viewport. A scroll span of 3.6 viewport heights seeks four paused scene timelines, with a reading hold at each scene's end. Scroll position is the only playhead: stopping holds the frame; scrolling back reverses the explanation. Pinning ends after the final answer. Chapter buttons and source links move to the corresponding scroll position; the skip control advances to the next case with focus preserved. There is no timer autoplay or wheel/touch interception. Font completion and existing case-expansion refreshes keep the pin geometry current.

Desktop and mobile compositions keep the heading, chapter navigation, scene and footer inside one viewport. The mobile result documents and copy are compacted. With reduced motion or a viewport shorter than 700px, the scene remains in normal document flow with immediate manual chapter selection. Without JavaScript the final answer and source names remain visible. Motion materials remain the incoming message cards, voice waveform, transcript mask, data routes, layered memory, fanning documents and sourced answers.

The three service rows remain unchanged; “Чат-боты + CRM” explicitly offers “Чат-боты любой сложности”, using the same copy as its Service schema.

### Working journey

`WorkingJourney.astro` presents “Задача”, “План”, “Рабочая версия”, “Запуск” as four tabs controlling one scene. Only the selected responsibilities panel and matching result sheet are shown. The selected tab, `01 / 04` counter, progress line, sheet progress and explanatory note change together. The sheet depicts the stage deliverable, not a screenshot or an additional case. Below 600px the responsibilities and sheet stack while all four stage selectors remain available.

Tabs use roving focus with ArrowLeft/ArrowRight and Home/End; direct selection and “Следующий этап” update the same state. The final stage replaces the next button with “Начнём с вашей задачи” linking to Telegram; advancing through the next button transfers focus to that final CTA. Directional transitions are cancelled when superseded; reduced motion switches state immediately. A no-script summary preserves the four-stage outline.

## Motion
Opening letter assembly, perspective unfolding of projects; scroll-driven separation of stage layers; lavender-to-color reveal; pointer tilt, lift and bounded highlight on previews; clip reveal of lower work; service focus/hover sweep; magnetic CTA feedback, footer sheet reveal, scroll-driven contours and arrow. Native scrolling, static visible content if JS unavailable, all decorative movement disabled by prefers-reduced-motion.

The extension adds bounded inline-story and gallery reveals, a cancellable four-step AI explanation, and directional journey-panel/result-sheet transitions. These supplement the existing motion grammar without scroll interception. The demo stages the full information flow while keeping one explanation and four selectable chapters visible.

## Boundaries
Six cases, no invented metrics, no private images, no prices. The AI demo's fictional samples are visibly qualified and are not additional portfolio entries or structured-data claims. Existing /scratchik routes added remotely are retained. Mobile rearranges the overlap into a legible sequential stage; color toggle is independent of navigation. No unresolved user decisions. The bounded interactive finish review is recorded in `.impeccable/review/interactive-finish-review.md` with disposition `ship`; its two clarity fixes are resolved.

## Approved cover amendment — 2026-10-16

User approved the separate object-cover concept and production implementation. This supersedes the duotone preview rows above. Four public projects use pale-lavender object covers with editable text; original screenshot pixels remain beneath. GoalSphere and Znamya sit adjacent at staggered heights, with content-driven stacking on mobile. Hover opens on fine-pointer desktop; tap/Enter/Space toggles and Escape closes. No whole-preview tilt remains. CSS mask/perspective transitions reveal the original screenshot; reduced motion uses opacity only. `project-preview.ts` waits for image decode and cancels superseded reveals. Native case links remain outside the button. Schema retains real project screenshot images; generated cover illustrations are not new cases or screenshots. Asset provenance and production prompts are in `docs/project-covers.md`.
