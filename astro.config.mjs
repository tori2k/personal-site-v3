// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://kirillbaryev.ru',
  devToolbar: { enabled: false },
  integrations: [
    mdx(),
    react(),
    sitemap({
      // Демо-шаблоны и технические страницы (privacy) не индексируем
      filter: (page) => !page.includes('/templates') && !page.includes('/privacy'),
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
