// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dgovalen.dev',
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
