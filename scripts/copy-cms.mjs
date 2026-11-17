/**
 * Nukopijuoja straipsnių redaktorių (Sveltia CMS) iš node_modules į public/admin,
 * kad jis būtų talpinamas pačioje svetainėje (be išorinių CDN – saugiau).
 * Paleidžiama automatiškai prieš `npm run dev` ir `npm run build`.
 */
import fs from 'node:fs';

const src = 'node_modules/@sveltia/cms/dist/sveltia-cms.js';
const dest = 'public/admin/sveltia-cms.js';
fs.mkdirSync('public/admin', { recursive: true });
fs.copyFileSync(src, dest);
console.log('Sveltia CMS nukopijuota į', dest);
