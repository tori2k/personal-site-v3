import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.env.QA_BASE || 'http://127.0.0.1:4321';
const outDir = resolve('artifacts/qa');
const liveRoutes = ['/', '/privacy/', '/404.html', '/scratchik/', '/scratchik/privacy/', '/scratchik/terms/'];
const removedRoutes = ['/services', '/method', '/cases', '/razbor', '/articles', '/brief', '/lending-dlya-eksperta'];
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = { routes: {}, removedRoutes: {}, viewports: {}, motion: {}, consoleErrors: [] };

const waitForVisuals = async (page) => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => image.loading !== 'lazy')
        .map((image) => image.decode().catch(() => {})),
    );
  });
  await page.waitForTimeout(1400);
};

for (const path of liveRoutes) {
  const response = await fetch(`${base}${path}`);
  results.routes[path] = response.status;
  const expected = path === '/404.html' ? [200, 404].includes(response.status) : response.ok;
  if (!expected) throw new Error(`Route ${path} returned ${response.status}`);
}

for (const path of removedRoutes) {
  const response = await fetch(`${base}${path}`);
  results.removedRoutes[path] = response.status;
  if (response.status !== 404) throw new Error(`Removed route ${path} returned ${response.status}`);
}

for (const viewport of [
  { name: 'desktop', width: 1536, height: 1024 },
  { name: 'laptop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await context.addInitScript(() => localStorage.setItem('analyticsConsent', 'denied'));
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') results.consoleErrors.push(`${viewport.name}: ${message.text()}`);
  });
  page.on('pageerror', (error) => results.consoleErrors.push(`${viewport.name}: ${error.message}`));

  await page.goto(base, { waitUntil: 'load' });
  await waitForVisuals(page);

  const state = await page.evaluate(() => {
    const firstMainCta = Array.from(document.querySelectorAll('main a')).find((link) => link.textContent?.includes('Обсудить проект'));
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim(),
      h1Visible: !!document.querySelector('h1') && document.querySelector('h1').getBoundingClientRect().bottom <= innerHeight,
      ctaVisible: !!firstMainCta && firstMainCta.getBoundingClientRect().bottom <= innerHeight,
      caseSlugs: Array.from(document.querySelectorAll('[data-case]')).map((row) => row.dataset.case),
      serviceCount: document.querySelectorAll('.service').length,
      formCount: document.querySelectorAll('form').length,
      navText: document.querySelector('.site-header')?.textContent?.replace(/\s+/g, ' ').trim(),
    };
  });

  if (state.scrollWidth > state.innerWidth) {
    throw new Error(`${viewport.name} has horizontal overflow: ${state.scrollWidth} > ${state.innerWidth}`);
  }
  if (!state.h1 || !state.h1.includes('Сайты.') || !state.h1.includes('AI.')) {
    throw new Error(`${viewport.name} has an unexpected H1`);
  }
  if (!state.h1Visible || !state.ctaVisible) {
    throw new Error(`${viewport.name} hero content does not fit the initial viewport`);
  }
  if (state.caseSlugs.length !== 6 || new Set(state.caseSlugs).size !== 6 || state.serviceCount !== 3 || state.formCount !== 0) {
    throw new Error(`${viewport.name} page structure is incorrect`);
  }

  results.viewports[viewport.name] = state;
  await page.screenshot({
    path: resolve(outDir, `home-${viewport.name}-${viewport.width}x${viewport.height}.png`),
    fullPage: false,
  });

  // Scroll through every section before capturing: otherwise scroll-triggered
  // elements remain at their intentional entrance offsets in a full-page image.
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < pageHeight; y += viewport.height * 0.75) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(800);
  }
  const serviceTitles = await page.locator('.service h3').evaluateAll((titles) =>
    titles.map((title) => ({ text: title.textContent.trim(), width: title.clientWidth, scrollWidth: title.scrollWidth })),
  );
  if (serviceTitles.some((title) => title.scrollWidth > title.width + 1)) {
    throw new Error(`${viewport.name} service title overflow`);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: resolve(outDir, `home-${viewport.name}-full.png`), fullPage: true });

  const colorToggle = page.locator('[data-color-toggle]').first();
  await colorToggle.press('Space');
  if (await colorToggle.getAttribute('aria-pressed') !== 'true') throw new Error('Color toggle did not activate');
  await colorToggle.press('Space');
  if (await colorToggle.getAttribute('aria-pressed') !== 'false') throw new Error('Color toggle did not reset');

  await context.close();
}

const reducedContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
await reducedContext.addInitScript(() => localStorage.setItem('analyticsConsent', 'denied'));
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(base, { waitUntil: 'load' });
await waitForVisuals(reducedPage);
results.motion.reduced = await reducedPage.evaluate(() => ({
  heroLineTransform: getComputedStyle(document.querySelector('.title-line > span')).transform,
  revealTransform: getComputedStyle(document.querySelector('[data-reveal]')).transform,
  revealOpacity: getComputedStyle(document.querySelector('[data-reveal]')).opacity,
}));
if (results.motion.reduced.revealOpacity !== '1' || results.motion.reduced.heroLineTransform !== 'none' || results.motion.reduced.revealTransform !== 'none') {
  throw new Error('Reduced-motion view did not render final content');
}
await reducedContext.close();

await browser.close();
if (results.consoleErrors.length) {
  throw new Error(`Console errors: ${results.consoleErrors.join(' | ')}`);
}
console.log(JSON.stringify(results, null, 2));
