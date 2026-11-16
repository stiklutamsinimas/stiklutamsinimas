/**
 * Sugeneruoja ikonas ir socialinių tinklų paveikslėlį iš logotipo.
 * Paleidimas: npm run icons
 * Naudokite, jei pasikeitė logotipas (src/assets/brand/logo-s.png)
 * arba pagrindinė nuotrauka (src/assets/bendros/...).
 */
import fs from 'node:fs/promises';
import sharp from 'sharp';

const LOGO = 'src/assets/brand/logo-s.png';
const HERO = 'src/assets/bendros/tamsinti-automobilio-langai-lietus.jpg';
const OUT = 'public';

/** Logotipas baltame apskritime ant permatomo fono */
async function roundIcon(size, padding = 0.08) {
  const inner = Math.round(size * (1 - padding * 2));
  const logo = await sharp(LOGO).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const circle = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);
  return sharp(circle).composite([{ input: logo, gravity: 'center' }]).png().toBuffer();
}

/** Logotipas ant balto kvadrato (Apple, schema.org) */
async function squareIcon(size, padding = 0.12) {
  const inner = Math.round(size * (1 - padding * 2));
  const logo = await sharp(LOGO).resize(inner, inner, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
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
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
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
  const bg = await sharp(HERO).resize(W, H, { fit: 'cover' }).modulate({ brightness: 0.7 }).toBuffer();
  const logo = await roundIcon(150, 0.06);
  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#070b12" stop-opacity="0.95"/>
          <stop offset="0.65" stop-color="#070b12" stop-opacity="0.7"/>
          <stop offset="1" stop-color="#070b12" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      <text x="80" y="330" font-family="Segoe UI, Arial, sans-serif" font-size="76" font-weight="800" fill="#ffffff">${escape('Stiklų tamsinimas')}</text>
      <text x="80" y="400" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="600" fill="#2cc8ff">${escape('Automobiliams ir pastatams')}</text>
      <text x="80" y="520" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#d3dae3">${escape('+370 605 64933 · stiklutamsinimas.eu')}</text>
      <text x="80" y="565" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#aab6c4">${escape('Kupiškis · Rokiškis · Panevėžys · Vilnius')}</text>
    </svg>`);
  return sharp(bg)
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: logo, top: 90, left: 80 },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}

await fs.mkdir(OUT, { recursive: true });
const ico = toIco(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await roundIcon(size, 0.02) }))));
await fs.writeFile(`${OUT}/favicon.ico`, ico);
await fs.writeFile(`${OUT}/icon-192.png`, await roundIcon(192));
await fs.writeFile(`${OUT}/icon-512.png`, await roundIcon(512));
await fs.writeFile(`${OUT}/apple-touch-icon.png`, await squareIcon(180));
await fs.writeFile(`${OUT}/logo.png`, await squareIcon(512, 0.06));
await fs.writeFile(`${OUT}/og-default.jpg`, await ogImage());
console.log('Ikonos ir og-default.jpg sugeneruotos į public/');
