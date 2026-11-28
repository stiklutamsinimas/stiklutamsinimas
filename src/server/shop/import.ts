/**
 * Importuotos prekės paruošimas: patikra, nuotraukų atsisiuntimas, .md failo sudarymas.
 * Patikros atitinka src/content.config.ts (produktai) – kad netinkama prekė nesugadintų svetainės atnaujinimo.
 */
import { slugify } from '../../lib/shop-core.ts';

export interface ImportProduct {
  title: string;
  category: 'pleveles' | 'irankiai';
  price: number;
  description: string;
  body: string;
  images: string[];
  specs: { label: string; value: string }[];
  brand: string;
  sku: string;
  source: string;
  sourcePrice: number | null;
  sourceCurrency: string | null;
  draft: boolean;
}

const str = (v: unknown, max: number) =>
  typeof v === 'string'
    ? v
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
        .trim()
        .slice(0, max)
    : '';
const oneLine = (v: unknown, max: number) => str(v, max * 2).replace(/\s+/g, ' ').slice(0, max).trim();

/** Sutvarko ir patikrina prekę. Grąžina klaidą lietuviškai arba sutvarkytą prekę. */
export function normalizeProduct(raw: any): { ok: true; product: ImportProduct } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Nėra prekės duomenų.' };
  const title = oneLine(raw.title, 100);
  if (title.length < 3) return { ok: false, error: 'Per trumpas pavadinimas.' };
  if (raw.category !== 'pleveles' && raw.category !== 'irankiai') return { ok: false, error: 'Pasirinkite kategoriją.' };
  const price = Math.round(Number(raw.price) * 100) / 100;
  if (!Number.isFinite(price) || price <= 0 || price > 100000) return { ok: false, error: 'Įrašykite pardavimo kainą.' };

  // HTML žymės išmetamos – tiekėjų aprašymuose būna svetimo kodo
  const body = str(raw.body, 20000)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\]\(\s*javascript:[^)]*\)/gi, '](#)');
  let description = oneLine(raw.description || body, 400);
  if (description.length > 320) description = `${description.slice(0, 316).replace(/\s+\S*$/, '')} …`;
  if (description.length < 20) description = `${title}. ${description}`.trim();
  if (description.length < 20) description = `${title} – užsisakykite internetu, pristatome visoje Lietuvoje.`.slice(0, 320);

  const images = (Array.isArray(raw.images) ? raw.images : [])
    .filter((u: unknown) => typeof u === 'string' && /^https?:\/\//.test(u) && u.length < 2000)
    .slice(0, 8);
  if (!images.length) return { ok: false, error: 'Pažymėkite bent vieną nuotrauką.' };

  let source = '';
  try {
    const u = new URL(String(raw.source ?? ''));
    if (u.protocol === 'https:' || u.protocol === 'http:') source = u.href.slice(0, 1000);
  } catch {
    /* be nuorodos */
  }
  const sp = Number(raw.sourcePrice);
  return {
    ok: true,
    product: {
      title,
      category: raw.category,
      price,
      description,
      body: body || description,
      images,
      specs: (Array.isArray(raw.specs) ? raw.specs : [])
        .map((s: any) => ({ label: oneLine(s?.label, 60), value: oneLine(s?.value, 120) }))
        .filter((s: { label: string; value: string }) => s.label && s.value)
        .slice(0, 20),
      brand: oneLine(raw.brand, 60),
      sku: oneLine(raw.sku, 60),
      source,
      sourcePrice: Number.isFinite(sp) && sp > 0 ? Math.round(sp * 100) / 100 : null,
      sourceCurrency: /^[A-Z]{3}$/.test(String(raw.sourceCurrency ?? '')) ? String(raw.sourceCurrency) : null,
      draft: raw.draft === true,
    },
  };
}

/** Pagal pirmus baitus – kad į svetainę nepatektų ne paveikslėlis (sugadintų atnaujinimą) */
export function imageType(b: Uint8Array): 'jpg' | 'png' | 'webp' | 'avif' | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'webp';
  if (ascii(4, 8) === 'ftyp' && /avi[fs]/.test(ascii(8, 12))) return 'avif';
  return null;
}

const MAX_IMAGE = 6 * 1024 * 1024;

export async function downloadImage(url: string): Promise<{ ext: string; base64: string } | null> {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; stiklutamsinimas.eu importas)', Accept: 'image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8' },
      redirect: 'follow',
    });
    if (!r.ok) return null;
    const len = Number(r.headers.get('content-length') || 0);
    if (len > MAX_IMAGE) return null;
    const bytes = new Uint8Array(await r.arrayBuffer());
    if (bytes.length < 1000 || bytes.length > MAX_IMAGE) return null;
    const ext = imageType(bytes);
    if (!ext) return null;
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return { ext, base64: btoa(bin) };
  } catch {
    return null;
  }
}

export const productSlug = (title: string) => slugify(title).slice(0, 70).replace(/-+$/, '') || 'preke';

const q = (s: string) => JSON.stringify(s);

/** .md failas – tokio pat formato kaip per /admin sukurtos prekės */
export function productMarkdown(p: ImportProduct, imagePaths: string[]): string {
  const lines = [
    '---',
    `title: ${q(p.title)}`,
    `category: ${p.category}`,
    `description: ${q(p.description)}`,
    `price: ${p.price}`,
    'unit: vnt.',
    'minQty: 1',
    'inStock: true',
    'images:',
    ...imagePaths.map((i) => `  - ${i}`),
    `imageAlt: ${q(p.title)}`,
    ...(p.specs.length ? ['specs:', ...p.specs.flatMap((s) => [`  - label: ${q(s.label)}`, `    value: ${q(s.value)}`])] : []),
    ...(p.brand ? [`brand: ${q(p.brand)}`] : []),
    ...(p.sku ? [`sku: ${q(p.sku)}`] : []),
    'featured: false',
    'order: 100',
    `draft: ${p.draft}`,
    ...(p.source ? [`source: ${q(p.source)}`] : []),
    ...(p.sourcePrice !== null ? [`sourcePrice: ${p.sourcePrice}`] : []),
    ...(p.sourceCurrency ? [`sourceCurrency: ${p.sourceCurrency}`] : []),
    // Importuota prekė siunčiama tiesiai iš tiekėjo – krepšelyje siūlomas pristatymas iš tiekėjo
    ...(p.source ? ['dropship: true'] : []),
    '---',
    '',
    p.body,
    '',
  ];
  return lines.join('\n');
}
