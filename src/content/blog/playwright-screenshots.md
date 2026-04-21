---
title: 'Автоматические скриншоты портфолио: вместо iframe — Playwright'
description: 'Iframe в портфолио тормозит, падает на mobile Safari и крадёт SEO. Заменил на автоматические скриншоты — и портфолио ожило.'
date: '2026-04-17'
tags: ['Playwright', 'Portfolio', 'SEO', 'Performance']
readTime: '4 мин'
tldr: 'Iframe-превью проектов тормозит на мобильных, падает на Safari и рушит SEO. Скрипт на Playwright раз в деплой снимает скриншоты всех сайтов портфолио (1440×900, JPEG 85%). На главной — статичные картинки с view transitions в детальную страницу кейса.'
---

## Проблема

Портфолио из 8 проектов показывалось через `<iframe>`. На десктопе выглядело эффектно: ноутбук, внутри живой сайт. Но:

- **Mobile Safari** режет часть iframe — блокирует скрипты, убирает скролл.
- **LCP (Largest Contentful Paint)** улетал за 4 секунды из-за загрузки 8 сайтов одновременно.
- **Lighthouse performance** падал до 60 на мобильной эмуляции.
- **Блокировщики рекламы** иногда блокируют чужие домены в iframe.
- **SEO:** ссылки внутри iframe не передают вес, краулер не индексирует контент.

## Решение

Скрипт автоматически снимает скриншоты всех сайтов портфолио и сохраняет их в `public/screenshots/`. На главной — статичные `<img>`, клик ведёт на живой сайт в новой вкладке. Iframe — только на детальной странице кейса (по запросу).

## Код скрипта

```ts
// scripts/screenshots.mjs
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const cases = [
  { slug: 'manifik',       url: 'https://manifik-school.ru' },
  { slug: 'nails',         url: 'https://kb-nails.surge.sh' },
  { slug: 'cosmetologist', url: 'https://kb-cosmetologist.surge.sh' },
  // ...
];

await mkdir('public/screenshots', { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const c of cases) {
  const page = await ctx.newPage();
  await page.goto(c.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500); // чтобы анимации доиграли
  await page.screenshot({
    path: `public/screenshots/${c.slug}.jpg`,
    type: 'jpeg',
    quality: 85,
    fullPage: false,
  });
  await page.close();
}

await browser.close();
```

Запускаю командой `node scripts/screenshots.mjs` перед каждым деплоем.

## Результаты

| Метрика       | Iframe | Скриншоты |
|---------------|--------|-----------|
| LCP           | 4.2 с  | 1.1 с     |
| Lighthouse    | 62     | 98        |
| Mobile Safari | баги   | OK        |
| Размер главной| 8.4 МБ | 1.6 МБ    |

## Бонус — автообновление

Скриншоты актуальны на момент последнего деплоя. В GitHub Actions добавил шаг: раз в неделю cron запускает скрипт и коммитит новые картинки. Клиенты меняют сайты → у меня в портфолио всегда свежие скриншоты без ручной работы.

## Выводы

- **Iframe в портфолио — прошлый век.** Работает только на больших экранах, проседает везде.
- **Скриншоты + ссылка на живой сайт** — это и быстро, и честно.
- **Playwright за 5 минут настройки** даёт то, что иначе стоит часов фотошопа.
