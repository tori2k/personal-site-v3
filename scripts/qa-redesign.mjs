import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.env.QA_BASE || 'http://127.0.0.1:4321';
const outDir = resolve('artifacts/qa');
const liveRoutes = ['/', '/privacy', '/404.html'];
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
  await page.waitForTimeout(500);
};

for (const path of liveRoutes) {
  const response = await fetch(`${base}${path}`);
  results.routes[path] = response.status;
  const expected = path === '/404.html' ? response.status === 404 : response.ok;
  if (!expected) throw new Error(`Route ${path} returned ${response.status}`);
}

for (const path of removedRoutes) {
  const response = await fetch(`${base}${path}`);
  results.removedRoutes[path] = response.status;
  if (response.status !== 404) throw new Error(`Removed route ${path} returned ${response.status}`);
}

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
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
      workCount: document.querySelectorAll('.work-panel').length,
      serviceCount: document.querySelectorAll('.service-row').length,
      formCount: document.querySelectorAll('form').length,
      navText: document.querySelector('.site-header')?.textContent?.replace(/\s+/g, ' ').trim(),
    };
  });

  if (state.scrollWidth > state.innerWidth) {
    throw new Error(`${viewport.name} has horizontal overflow: ${state.scrollWidth} > ${state.innerWidth}`);
  }
  if (!state.h1 || !state.h1.includes('САЙТЫ.') || !state.h1.includes('AI.')) {
    throw new Error(`${viewport.name} has an unexpected H1`);
  }
  if (!state.h1Visible || !state.ctaVisible) {
    throw new Error(`${viewport.name} hero content does not fit the initial viewport`);
  }
  if (state.workCount !== 3 || state.serviceCount !== 3 || state.formCount !== 0) {
    throw new Error(`${viewport.name} page structure is incorrect`);
  }

  results.viewports[viewport.name] = state;
  await page.screenshot({
    path: resolve(outDir, `home-${viewport.name}-${viewport.width}x${viewport.height}.png`),
    fullPage: false,
  });

  if (viewport.name === 'desktop') {
    await page.locator('.work-panel').nth(1).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    results.motion.desktop = await page.evaluate(() => ({
      firstPanelTransform: getComputedStyle(document.querySelector('.work-panel__surface')).transform,
      secondPanelTop: Math.round(document.querySelectorAll('.work-panel')[1].getBoundingClientRect().top),
      visibleProject: document.querySelectorAll('.work-panel h3')[1]?.textContent?.trim(),
    }));
    if (results.motion.desktop.firstPanelTransform === 'none') {
      throw new Error('Desktop sticky-stack motion did not transform the previous project');
    }
    await page.screenshot({ path: resolve(outDir, 'home-work-desktop-1440x900.png'), fullPage: false });
  }

  if (viewport.name === 'mobile') {
    await page.locator('.service-row').nth(1).scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const serviceTitles = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.service-row h3')).map((title) => ({
        text: title.textContent?.trim(),
        width: Math.round(title.getBoundingClientRect().width),
        scrollWidth: title.scrollWidth,
      })),
    );
    if (serviceTitles.some((title) => title.scrollWidth > title.width + 1)) {
      throw new Error(`Mobile service title overflow: ${JSON.stringify(serviceTitles)}`);
    }
    results.viewports.mobile.serviceTitles = serviceTitles;
    await page.screenshot({ path: resolve(outDir, 'home-services-mobile-390x844.png'), fullPage: false });

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.screenshot({ path: resolve(outDir, 'home-contact-mobile-390x844.png'), fullPage: false });
  }

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
  heroLineTransform: getComputedStyle(document.querySelector('.hero__line > span')).transform,
  panelTransform: getComputedStyle(document.querySelector('.work-panel__surface')).transform,
  panelOpacity: getComputedStyle(document.querySelector('.work-panel__surface')).opacity,
}));
if (results.motion.reduced.panelOpacity !== '1') {
  throw new Error('Reduced-motion view did not render final content');
}
await reducedContext.close();

await browser.close();
if (results.consoleErrors.length) {
  throw new Error(`Console errors: ${results.consoleErrors.join(' | ')}`);
}
console.log(JSON.stringify(results, null, 2));
