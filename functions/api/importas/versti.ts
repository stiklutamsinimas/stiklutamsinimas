/**
 * POST /api/importas/versti {title, description, body, specs} – išverčia importuojamą prekę į lietuvių kalbą.
 * Tik prisijungusiems svetainės administratoriams. Naudoja Cloudflare Workers AI (env.AI) – žr. src/server/shop/translate.ts.
 */
import { json, type Ctx } from '../../../src/server/shop/env.ts';
import { bearer, checkPush } from '../../../src/server/shop/github.ts';
import { translateToLithuanian, type TranslatableProduct } from '../../../src/server/shop/translate.ts';

export const onRequestPost = async ({ request, env }: Ctx) => {
  const auth = await checkPush(bearer(request));
  if (!auth.ok) return json({ ok: false, error: auth.error }, auth.status);

  if (!env.AI) {
    return json(
      {
        ok: false,
        disabled: true,
        error: 'Automatinis vertimas neįjungtas: Cloudflare → stiklutamsinimas → Settings → Bindings → Workers AI (pavadinimas „AI“).',
      },
      501,
    );
  }

  let p: Partial<TranslatableProduct>;
  try {
    p = await request.json();
  } catch {
    return json({ ok: false, error: 'Neteisinga užklausa.' }, 400);
  }
  const product: TranslatableProduct = {
    title: typeof p.title === 'string' ? p.title : '',
    description: typeof p.description === 'string' ? p.description : '',
    body: typeof p.body === 'string' ? p.body : '',
    specs: Array.isArray(p.specs) ? p.specs.filter((s) => s && typeof s.label === 'string' && typeof s.value === 'string') : [],
  };
  if (product.title.trim().length < 3) return json({ ok: false, error: 'Nėra pavadinimo vertimui.' }, 400);

  const res = await translateToLithuanian(env.AI, product);
  if (!res.ok) return json({ ok: false, error: res.error }, 502);
  return json({ ok: true, ...res.product, model: res.model });
};
