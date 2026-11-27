/**
 * POST /api/importas/issaugoti {product, skipBuild} – įrašo importuotą prekę į svetainę:
 * atsisiunčia nuotraukas, sukuria src/content/produktai/<pavadinimas>.md ir viską įrašo vienu GitHub commit'u.
 * skipBuild: true – svetainė dar neatnaujinama (kai keliama daug prekių, atnaujinama tik po paskutinės).
 */
import { json, type Ctx } from '../../../src/server/shop/env.ts';
import { bearer, checkPush, commitFiles, emptyCommit, fileExists, type NewFile } from '../../../src/server/shop/github.ts';
import { downloadImage, normalizeProduct, productMarkdown, productSlug } from '../../../src/server/shop/import.ts';

export const onRequestPost = async ({ request }: Ctx) => {
  const token = bearer(request);
  const auth = await checkPush(token);
  if (!auth.ok) return json({ ok: false, error: auth.error }, auth.status);

  let body: { product?: unknown; skipBuild?: boolean; rebuild?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Neteisinga užklausa.' }, 400);
  }
  // Tik atnaujinti svetainę (kai paskutinė iš kelių prekių nepavyko, o ankstesnės įrašytos be atnaujinimo)
  if (body.rebuild === true) {
    try {
      await emptyCommit(token, 'Parduotuvė atnaujinta po prekių importo');
      return json({ ok: true });
    } catch {
      return json({ ok: false, error: 'Nepavyko atnaujinti svetainės.' }, 502);
    }
  }
  const norm = normalizeProduct(body.product);
  if (!norm.ok) return json({ ok: false, error: norm.error }, 400);
  const p = norm.product;

  // Unikalus adresas
  let slug = productSlug(p.title);
  if (await fileExists(token, `src/content/produktai/${slug}.md`)) {
    slug = `${slug}-${Array.from(crypto.getRandomValues(new Uint8Array(2)), (b) => b.toString(16).padStart(2, '0')).join('')}`;
  }

  // Nuotraukos (tik tikri paveikslėliai: JPG, PNG, WebP, AVIF)
  const downloaded = await Promise.all(p.images.map((u) => downloadImage(u)));
  const files: NewFile[] = [];
  const paths: string[] = [];
  downloaded.forEach((img) => {
    if (!img) return;
    const name = `${slug}-${paths.length + 1}.${img.ext}`;
    files.push({ path: `src/assets/produktai/${name}`, base64: img.base64 });
    paths.push(`../../assets/produktai/${name}`);
  });
  if (!paths.length) return json({ ok: false, error: 'Nepavyko atsisiųsti nė vienos nuotraukos. Pažymėkite kitas nuotraukas.' }, 400);

  files.push({ path: `src/content/produktai/${slug}.md`, text: productMarkdown(p, paths) });

  try {
    const message = `Importuota prekė: ${p.title}${body.skipBuild ? ' [CF-Pages-Skip]' : ''}`;
    const sha = await commitFiles(token, files, message);
    return json({
      ok: true,
      slug,
      url: `/parduotuve/${p.category}/${slug}`,
      images: paths.length,
      skippedImages: p.images.length - paths.length,
      commit: sha,
    });
  } catch (e) {
    console.error('Importo klaida', e);
    return json({ ok: false, error: 'Nepavyko įrašyti į svetainę. Bandykite dar kartą.' }, 502);
  }
};
