// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dgovalen.vercel.app',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    shikiConfig: {
      theme: 'catppuccin-mocha',
      wrap: false,
    },
  },
});
