/**
 * Sugeneruoja ikonas ir socialinių tinklų paveikslėlį iš logotipo.
 * Paleidimas: npm run icons
 * Naudokite, jei pasikeitė logotipas (src/assets/brand/logo.png) arba OG nuotrauka.
 */
import fs from 'node:fs/promises';
import sharp from 'sharp';

const GLYPH = 'src/assets/brand/s-glyph.png'; // „S“ raidė iš logotipo
const LOGO_WHITE = 'src/assets/brand/logo-white.png';
const PHOTO = 'src/assets/darbai/audi-q7-tamsinti-galiniai-stiklai.jpg';
const OUT = 'public';
const BLUE = '#008ED2';

/** „S“ ženklas: baltas skritulys, mėlynas žiedas ir raidė (kaip logotipe) */
async function mark(size, { ring = true, bg = '#ffffff', round = true } = {}) {
  const stroke = Math.max(1, Math.round(size * 0.065));
  const glyphH = Math.round(size * (ring ? 0.62 : 0.78));
  const glyph = await sharp(GLYPH).resize({ height: glyphH }).toBuffer();
  const shape = round
    ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - (ring ? stroke / 2 : 0)}" fill="${bg}" ${ring ? `stroke="${BLUE}" stroke-width="${stroke}"` : ''}/>`
    : `<rect width="${size}" height="${size}" fill="${bg}"/>${ring ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.42}" fill="none" stroke="${BLUE}" stroke-width="${stroke}"/>` : ''}`;
  const base = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${shape}</svg>`);
  return sharp(base).composite([{ input: glyph, gravity: 'center' }]).png().toBuffer();
}

/** ICO failas su įterptais PNG (16, 32, 48 px) */
function toIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

async function ogImage() {
  const W = 1200;
  const H = 630;
  const photo = await sharp(PHOTO).resize(W, H, { fit: 'cover' }).toBuffer();
  const logo = await sharp(LOGO_WHITE).resize({ width: 560 }).toBuffer();
  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#052538" stop-opacity="0.97"/>
          <stop offset="0.6" stop-color="#052538" stop-opacity="0.82"/>
          <stop offset="1" stop-color="#052538" stop-opacity="0.25"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      <text x="80" y="330" font-family="Manrope, Segoe UI, Arial, sans-serif" font-size="64" font-weight="800" fill="#ffffff">${escape('Mažiau saulės.')}</text>
      <text x="80" y="405" font-family="Manrope, Segoe UI, Arial, sans-serif" font-size="64" font-weight="800" fill="#5BBDEE">${escape('Daugiau komforto.')}</text>
      <text x="80" y="500" font-family="Manrope, Segoe UI, Arial, sans-serif" font-size="30" fill="#E6F0F7">${escape('Automobilių ir pastatų stiklų tamsinimas')}</text>
      <text x="80" y="550" font-family="Manrope, Segoe UI, Arial, sans-serif" font-size="26" fill="#94ACBD">${escape('+370 605 64933 · Kupiškis · Rokiškis · Panevėžys · Vilnius')}</text>
    </svg>`);
  return sharp(photo)
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: logo, top: 90, left: 74 },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}

await fs.mkdir(OUT, { recursive: true });
const ico = toIco(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await mark(size, { ring: size >= 32 }) }))));
await fs.writeFile(`${OUT}/favicon.ico`, ico);
await fs.writeFile(`${OUT}/icon-192.png`, await mark(192));
await fs.writeFile(`${OUT}/icon-512.png`, await mark(512));
await fs.writeFile(`${OUT}/icon-maskable-512.png`, await mark(512, { round: false }));
await fs.writeFile(`${OUT}/apple-touch-icon.png`, await mark(180, { round: false }));
await fs.writeFile(`${OUT}/logo.png`, await mark(512, { round: false }));
await fs.writeFile(`${OUT}/og-default.jpg`, await ogImage());
console.log('Ikonos ir og-default.jpg sugeneruotos į public/');
