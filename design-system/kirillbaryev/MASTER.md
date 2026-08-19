# Kirill Baryev Studio Design System

Updated 2026-08-19 after direct user feedback.

## Design read

Screenshot-led editorial portfolio for a personal engineering studio. It should feel like an art-directed digital publication, not a marketing funnel. Real interfaces are the primary visual material.

Design dials: variance 8/10, motion 7/10, density 3/10.

## Information architecture

Only five scenes:

1. Hero.
2. Large screenshot gallery.
3. Full client-work registry.
4. Three areas of work.
5. Direct Telegram contact.

The only secondary routes are the privacy policy and 404. No forms, article archive, method page, diagnostics, process explanation, pricing cards or SEO landing pages.

## Core tokens

| Role | Value |
| --- | --- |
| Background | `#0A0A0A` |
| Surface | `#111111` |
| Text | `#F3F1EC` |
| Muted text | `#A7A49E` |
| Structural line | `rgba(243, 241, 236, .18)` |
| Accent | `#FF6534` |
| Accent ink | `#160A05` |
| Radius | `0` |

One dark theme and one accent. No gradients, outer glows, glass panels or card shadows.

## Typography

- Display and body: Onest.
- Small metadata: IBM Plex Mono.
- Headings can be large, but cannot overpower or cover project screenshots. Tight leading and negative tracking are intentional.
- Copy is short, factual and secondary to the work.
- No decorative section numbering, poetic microcopy or long explanatory paragraphs.

## Layout

- Desktop container: `min(1460px, 100vw - 64px)`.
- Mobile container: `100vw - 28px`.
- Hero uses one primary real interface screenshot with two supporting frames in a strict editorial grid.
- Work uses three distinct compositions: full-width sequence, desktop/mobile diptych and typography-only private-product chapter.
- One flagship heading is sticky on desktop. Mobile uses normal document flow.
- Services are full-width typographic rows, not cards.
- Contact is one high-contrast full-screen scene.

## Motion

- Hero sequence establishes hierarchy: type first, primary screenshot second, supporting frames third.
- Screenshot parallax adds controlled depth while leaving DOM order untouched.
- Real frames reveal through masks and maintain readable fallback states.
- Service rows move slightly into alignment as they enter.
- One contact reveal closes the story.
- No infinite marquees and no global scroll listener.
- All GSAP scenes are disabled under `prefers-reduced-motion`.

## Content rules

- Present Kirill as a personal engineering studio. Never imply a team.
- Show only confirmed client facts.
- Never use generated portfolio visuals, stock imagery, fake dashboards or reconstructed interfaces.
- Private work remains typographic until real redacted screenshots are approved.
- Public price statement: websites from 70,000 rubles.
- Use the same direct CTA everywhere: discuss the project in Telegram.
- Do not restore forms, diagnostics, method copy or generic process explanations.

## Delivery checklist

- Hero headline and CTA fit the first viewport.
- No horizontal overflow at 390, 768 and 1440 widths.
- Work remains readable without JavaScript.
- Sticky storytelling runs only on desktop.
- Reduced motion renders every scene in its final state.
- Keyboard focus and body text contrast remain visible.
