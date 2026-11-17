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
    // Instagram įrašų nuotraukos atsisiunčiamos ir optimizuojamos kūrimo metu
    remotePatterns: [
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
    ],
  },

  integrations: [
    sitemap({
      filter: (page) => !/\/(404|admin)(\/|$)/.test(page),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    // Skriptai visada atskiruose failuose (ne HTML viduje) – leidžia griežtą saugumo politiką (CSP)
    build: { assetsInlineLimit: 0 },
  },
});
