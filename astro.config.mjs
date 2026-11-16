// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://stiklutamsinimas.eu',

  // Seni adresai buvo be pasvirojo brūkšnio gale (pvz. /langu-tamsinimas),
  // todėl išlaikome tą pačią struktūrą – Google pozicijos neprarandamos.
  trailingSlash: 'never',
  build: { format: 'file' },

  compressHTML: true,
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },

  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
