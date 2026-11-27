/**
 * POST /api/importas/puslapis {url} – parsiunčia prekės puslapį (kai nuoroda įklijuojama importo puslapyje).
 * Tik prisijungusiems svetainės administratoriams. Kai kurios parduotuvės (Amazon, Temu) serveriams puslapio neduoda –
 * tada naudojamas naršyklės mygtukas „➕ Į mano parduotuvę“, kuris veikia jūsų pačių naršyklėje.
 */
import { json, type Ctx } from '../../../src/server/shop/env.ts';
import { bearer, checkPush } from '../../../src/server/shop/github.ts';

const MAX = 3 * 1024 * 1024;

export const onRequestPost = async ({ request }: Ctx) => {
  const auth = await checkPush(bearer(request));
  if (!auth.ok) return json({ ok: false, error: auth.error }, auth.status);

  let url: URL;
  try {
    url = new URL(String(((await request.json()) as { url?: string }).url ?? '').trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error();
  } catch {
    return json({ ok: false, error: 'Neteisinga nuoroda.' }, 400);
  }

  const blocked = { ok: false, blocked: true, error: 'Ši parduotuvė neleido nuskaityti puslapio. Atidarykite prekę naršyklėje ir spauskite mygtuką „➕ Į mano parduotuvę“.' };
  try {
    const r = await fetch(url.href, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; stiklutamsinimas.eu importas)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'lt,en;q=0.8',
      },
      redirect: 'follow',
    });
    if (!r.ok) return json(blocked, 200);
    const html = (await r.text()).slice(0, MAX);
    if (/captcha|robot check|punish|are you a human|verify you are human|access denied/i.test(html.slice(0, 20000)) && !/application\/ld\+json/.test(html)) {
      return json(blocked, 200);
    }
    return json({ ok: true, url: r.url || url.href, html });
  } catch {
    return json(blocked, 200);
  }
};
