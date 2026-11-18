// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * DOMENAS. Kol stiklutamsinimas.eu dar rodo seną (Hostinger) svetainę, visos nuorodos
 * (Facebook dalinimasis, paveikslėliai, Google duomenys) turi vesti į laikiną adresą,
 * kitaip Facebook rodo „Website Builder 404“.
 * PRIJUNGUS DOMENĄ PRIE CLOUDFLARE – pakeisti į true.
 */
const DOMAIN_LIVE = false;
const SITE = DOMAIN_LIVE ? 'https://stiklutamsinimas.eu' : 'https://stiklutamsinimas.pages.dev';

export default defineConfig({
  site: SITE,

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
      // YouTube vaizdo įrašų paveikslėliai
      { protocol: 'https', hostname: 'i.ytimg.com' },
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
