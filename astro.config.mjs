// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';

/** Straipsnių datos sitemap'ui (lastmod) – iš src/content/naujienos/*.md */
const ARTICLES = './src/content/naujienos';
/** @type {Record<string, Date>} */
const articleDates = {};
for (const f of fs.readdirSync(ARTICLES)) {
  if (!f.endsWith('.md')) continue;
  const s = fs.readFileSync(`${ARTICLES}/${f}`, 'utf8');
  const raw = (s.match(/^updatedDate:\s*(.+)$/m) ?? s.match(/^pubDate:\s*(.+)$/m))?.[1].replace(/['"]/g, '').trim();
  const d = raw ? new Date(raw) : null;
  if (d && !Number.isNaN(d.getTime())) articleDates[f.replace(/\.md$/, '')] = d;
}
const newestArticle = new Date(Math.max(...Object.values(articleDates).map((d) => d.getTime())));

/** Ar parduotuvėje yra paskelbtų prekių – tuščia parduotuvė į sitemap nededama */
const PRODUCTS = './src/content/produktai';
const hasProducts =
  fs.existsSync(PRODUCTS) &&
  fs.readdirSync(PRODUCTS).some((f) => f.endsWith('.md') && !/^draft:\s*true\s*$/m.test(fs.readFileSync(`${PRODUCTS}/${f}`, 'utf8')));

/**
 * DOMENAS. Kol stiklutamsinimas.eu dar rodo seną (Hostinger) svetainę, visos nuorodos
 * (Facebook dalinimasis, paveikslėliai, Google duomenys) turi vesti į laikiną adresą,
 * kitaip Facebook rodo „Website Builder 404“.
 * PRIJUNGUS DOMENĄ PRIE CLOUDFLARE – pakeisti į true.
 */
const DOMAIN_LIVE = true;
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
      filter: (page) =>
        !/\/(404|admin)(\/|$)/.test(page) &&
        !/\/parduotuve\/(krepselis|aciu)$/.test(page) &&
        (hasProducts || !/\/(parduotuve|pirkimo-taisykles)(\/|$)/.test(page)),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/^\//, '');
        if (articleDates[path]) item.lastmod = articleDates[path].toISOString();
        else if (path === 'naujienos' || path === '') item.lastmod = newestArticle.toISOString();
        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    // Skriptai visada atskiruose failuose (ne HTML viduje) – leidžia griežtą saugumo politiką (CSP)
    build: { assetsInlineLimit: 0 },
  },
});
