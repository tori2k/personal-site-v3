// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://kirillbaryev.ru',
  integrations: [
    mdx(),
    sitemap({
      // Демо-шаблоны не индексируем — исключаем из sitemap
      filter: (page) => !page.includes('/templates'),
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
