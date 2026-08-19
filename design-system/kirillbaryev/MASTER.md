# Kirill Baryev Studio Design System

Updated 2026-08-19 after direct user feedback.

## Design read

Kinetic one-page portfolio for a personal engineering studio. It should feel like a digital poster, not a marketing funnel. Large typography and work are the interface.

Design dials: variance 9/10, motion 9/10, density 2/10.

## Information architecture

Only four scenes:

1. Hero.
2. Three selected works.
3. Three areas of work.
4. Direct Telegram contact.

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
- Headings can fill most of the viewport. Tight leading and negative tracking are intentional.
- Copy is short, factual and secondary to the work.
- No decorative section numbering, poetic microcopy or long explanatory paragraphs.

## Layout

- Desktop container: `min(1460px, 100vw - 64px)`.
- Mobile container: `100vw - 28px`.
- Hero is a two-line kinetic type composition over one generated visual.
- Work uses one desktop sticky stack. Mobile uses normal document flow.
- Services are full-width typographic rows, not cards.
- Contact is one high-contrast full-screen scene.

## Motion

- Hero sequence establishes hierarchy: type first, visual second, CTA last.
- Hero image parallax adds depth while leaving DOM order untouched.
- Work panels stack so each project replaces the previous one.
- Service rows move slightly into alignment as they enter.
- One contact reveal closes the story.
- No infinite marquees and no global scroll listener.
- All GSAP scenes are disabled under `prefers-reduced-motion`.

## Content rules

- Present Kirill as a personal engineering studio. Never imply a team.
- Show only confirmed client facts.
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
