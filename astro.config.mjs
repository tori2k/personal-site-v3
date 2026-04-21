// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://tori2k.github.io',
  base: '/personal-site-v3',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
