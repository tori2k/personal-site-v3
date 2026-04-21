import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public/screenshots');

const cases = [
  { slug: 'manifik', url: 'https://kb-manifik.surge.sh' },
  { slug: 'cosmetologist', url: 'https://kb-cosmetologist.surge.sh' },
  { slug: 'psychologist', url: 'https://kb-psychologist.surge.sh' },
  { slug: 'tutor', url: 'https://kb-tutor.surge.sh' },
  { slug: 'nails', url: 'https://kb-nails.surge.sh' },
  { slug: 'silverstandard', url: 'https://kb-silverstandard.surge.sh' },
  { slug: 'fleshka', url: 'https://kb-fleshka.surge.sh' },
  { slug: 'vaultkey', url: 'https://kb-vaultkey.surge.sh' },
];

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const c of cases) {
  const page = await ctx.newPage();
  console.log(`→ ${c.slug}  ${c.url}`);
  try {
    await page.goto(c.url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: resolve(OUT_DIR, `${c.slug}.jpg`),
      type: 'jpeg',
      quality: 85,
      fullPage: false,
    });
    console.log(`  ✓ saved ${c.slug}.jpg`);
  } catch (e) {
    console.error(`  ✗ ${c.slug} failed:`, e.message);
  }
  await page.close();
}

await browser.close();
console.log('done');
