/**
 * /llms.txt – svetainės santrauka dirbtinio intelekto paieškoms (ChatGPT, Perplexity, Claude, Gemini, Copilot).
 * Formatas: https://llmstxt.org. Generuojama automatiškai iš svetainės turinio – rankomis taisyti nereikia.
 */
import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { cities, cityUrl } from '@/data/cities';
import { carPrices, formatRange } from '@/data/prices';
import { homeFaq } from '@/data/faq';
import { categories, categoryOrder, getPosts, getServices, postUrl, serviceUrl } from '@/lib/content';
import { getGoogleReviews } from '@/lib/google-reviews';
import local from '@/data/atsiliepimai.json';

/** 1 atsiliepimas, 2–9 atsiliepimai, 10–20 ir 0 gale – atsiliepimų */
const reviewsWord = (n: number) =>
  n % 10 === 1 && n % 100 !== 11 ? 'atsiliepimas' : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 'atsiliepimai' : 'atsiliepimų';
const clean = (s: string) => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

export const GET: APIRoute = async ({ site: base }) => {
  const abs = (p: string) => new URL(p, base).href;
  const services = await getServices();
  const posts = await getPosts();
  const api = await getGoogleReviews();
  const rating = (api?.rating ?? local.rating).toFixed(1).replace('.', ',');
  const count = api?.count ?? local.count;
  const carCities = cities.filter((c) => c.cars);
  const objectCities = cities.filter((c) => !c.cars);
  const address = (city?: string) => site.locations.find((l) => l.city === city);

  const lines: string[] = [
    `# ${site.name} – ${site.domain}`,
    '',
    `> Automobilių ir pastatų stiklų tamsinimas plėvelėmis Lietuvoje nuo ${site.foundedYear} m. Automobilių stiklus tamsiname dirbtuvėse ${carCities.map((c) => c.nameIn).join(', ').replace(/, ([^,]*)$/, ' ir $1')} (atvykti galima iš visos Lietuvos). Pastatų langų plėveles (saulės kontrolės, veidrodines, matines, apsaugines) klijuojame atvykę į objektą – ${carCities.map((c) => c.nameOf).join(', ').replace(/, ([^,]*)$/, ' ir $1')} rajonuose, ${objectCities.map((c) => c.nameIn).join(' ir ')}, kitur Lietuvoje – pagal susitarimą.`,
    '',
    '## Svarbiausi faktai',
    '',
    `- Pavadinimas: ${site.name} (${site.domain})`,
    `- Veikla nuo: ${site.foundedYear} m.`,
    `- Telefonas: ${site.phoneDisplay} (taip pat WhatsApp ir Viber)`,
    `- El. paštas: ${site.email}`,
    `- Darbo laikas: ${site.appointmentNote.toLowerCase()} – paskambinkite ar parašykite.`,
    `- Garantija: ${site.warranty.full}.`,
    '- Automobilio galinių stiklų tamsinimas trunka 2–3 valandas – automobilį atsiimsite tą pačią dieną.',
    `- Naudojamos plėvelės: ${site.filmBrands.join(', ')}.`,
    `- Google įvertinimas: ${rating} iš 5 (${count} ${reviewsWord(count)}, Kupiškio padalinys): ${site.google.reviewsUrl}`,
    '- Teisės aktai (Lietuva, nuo 2018-05-20): priekinis stiklas ir priekiniai šoniniai langai turi praleisti ne mažiau kaip 70 % šviesos (t. y. juos galima patamsinti daugiausia ~30 %). Galinius langus galima tamsinti be apribojimų.',
    '',
    '## Automobilio galinių stiklų tamsinimo kainos',
    '',
    ...carPrices.map((p) => `- ${p.type}${p.note ? ` (${p.note})` : ''}: ${formatRange(p)}`),
    '',
    'Tiksli kaina pasakoma iš anksto pagal automobilio modelį ir pasirinktą plėvelę.',
    '',
    '## Dirbtuvės (automobiliai ir pastatai)',
    '',
    ...carCities.map((c) => {
      const loc = address(c.location);
      return `- [${c.keyword} ${c.nameIn}](${abs(cityUrl(c.slug))}): ${loc ? `${loc.street}, ${c.name}. ` : ''}Aptarnaujame ir: ${c.areas.join(', ')}.`;
    }),
    '',
    '## Tik pastatai ir objektai (automobilių čia netamsiname)',
    '',
    ...objectCities.map((c) => {
      const loc = address(c.location);
      return `- [${c.keyword} ${c.nameIn}](${abs(cityUrl(c.slug))}): ${loc ? `${loc.street}, ${c.name}. ` : ''}${clean(c.areasText)}`;
    }),
    '',
    '## Paslaugos',
    '',
  ];

  for (const cat of categoryOrder) {
    const list = services.filter((s) => s.data.category === cat);
    if (!list.length) continue;
    lines.push(`### ${categories[cat].label}`, '');
    for (const s of list) lines.push(`- [${s.data.h1 ?? s.data.title}](${abs(serviceUrl(s.id))}): ${clean(s.data.seoDescription)}`);
    lines.push('');
  }

  lines.push('## Dažniausi klausimai', '');
  for (const f of homeFaq) lines.push(`### ${f.q}`, '', clean(f.a), '');

  for (const s of services.filter((x) => x.data.faq.length)) {
    lines.push(`## DUK: ${s.data.h1 ?? s.data.title}`, '');
    for (const f of s.data.faq) lines.push(`### ${f.q}`, '', clean(f.a), '');
  }

  lines.push('## Straipsniai (Naujienos)', '');
  for (const p of posts) lines.push(`- [${p.data.title}](${abs(postUrl(p.id))}): ${clean(p.data.description)}`);
  lines.push('');

  lines.push(
    '## Kita',
    '',
    `- [Kontaktai](${abs('/kontaktai')})`,
    `- [Apie mus](${abs('/apie-mus')})`,
    `- [Visos paslaugos](${abs('/paslaugos')})`,
    ...site.social.map((s) => `- [${s.name}](${s.url})`),
    '',
    '## In English',
    '',
    `${site.name} (${site.domain}) is a car and building window tinting company in Lithuania, operating since ${site.foundedYear}. Car window tinting is done at our workshops in ${carCities.map((c) => `${c.name} (${address(c.location)?.street})`).join(', ')}; customers can come from anywhere in Lithuania. Window films for homes and offices (solar control, mirror, frosted, safety films) are installed on site in these districts, in Vilnius and Kaunas, and elsewhere by arrangement. Rear window tinting costs ${formatRange(carPrices[0])} (hatchback) to ${formatRange(carPrices[carPrices.length - 1])} (minibus) and takes 2–3 hours; warranty 5–10 years depending on the film. Work by appointment only: ${site.phoneDisplay} (also WhatsApp, Viber).`,
    '',
  );

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
