import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const pages = [];
function walk(dir) { for (const name of readdirSync(dir, { withFileTypes: true })) { const path = join(dir, name.name); if (name.isDirectory()) walk(path); else if (name.name.endsWith('.html')) pages.push(path); } }
walk('dist');
let validated = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (/yandex_[a-f0-9]+\.html$/.test(file)) { assert.equal(scripts.length, 0); continue; }
  if (file.endsWith('/404.html')) { assert.equal(scripts.length, 0, '404 must not describe a profile or service'); continue; }
  assert.equal(scripts.length, 1, `${file}: expected one connected graph`);
  const schema = JSON.parse(scripts[0][1]);
  assert.equal(schema['@context'], 'https://schema.org');
  const graph = schema['@graph'];
  const types = graph.map(node => node['@type']);
  assert(!types.includes('ProfessionalService'));
  assert.equal(graph.filter(node => node['@type'] === 'Person').length, 1);
  assert.equal(new Set(graph.map(node => node['@id'])).size, graph.length, 'Duplicate graph identity');
  const page = graph.find(node => ['ProfilePage', 'WebPage'].includes(node['@type']));
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert.equal(page.url, canonical);
  assert.equal(page.isPartOf['@id'], 'https://kirillbaryev.ru/#website');
  const publicText = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  if (file === 'dist/index.html') {
    assert.equal(page['@type'], 'ProfilePage');
    assert.equal(page.mainEntity['@id'], graph.find(node => node['@type'] === 'Person')['@id']);
    const services = graph.filter(node => node['@type'] === 'Service');
    assert.equal(services.length, 3);
    for (const service of services) {
      assert(publicText.includes(service.name)); assert(publicText.includes(service.description));
      assert(html.includes(`id="${new URL(service.url).hash.slice(1)}"`));
      assert.equal(service.provider['@id'], page.mainEntity['@id']);
    }
    const list = graph.find(node => node['@type'] === 'ItemList');
    const domCases = [...html.matchAll(/data-case="([^"]+)"/g)].map(match => match[1]);
    assert.equal(list.numberOfItems, 6); assert.equal(list.itemListElement.length, 6);
    list.itemListElement.forEach(({ position, item }, index) => {
      assert.equal(position, index + 1);
      assert.equal(item['@id'], `https://kirillbaryev.ru/#case-${domCases[index]}`);
      assert(publicText.includes(item.name));
      assert(html.includes(`id="case-${domCases[index]}"`));
      if (index >= 4) assert(!item.image, 'Private projects must not gain invented screenshots');
    });
    assert(!/"(?:price|priceRange|aggregateRating|review|address)"/.test(scripts[0][1]));
  } else {
    assert.equal(page['@type'], 'WebPage');
    assert(!types.includes('Service') && !types.includes('ItemList'), 'Other routes must not inherit homepage claims');
  }
  validated++;
}
console.log(`Schema checks passed: ${validated} page graphs, scoped 404, 3 visible services, 6 ordered cases.`);
