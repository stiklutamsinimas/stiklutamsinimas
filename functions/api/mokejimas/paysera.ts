/** /api/mokejimas/paysera – Paysera pranešimas apie mokėjimą (callbackurl). Atsakymas turi būti „OK“. */
import { loadCatalog, type Ctx } from '../../../src/server/shop/env.ts';
import { notifyPaid } from '../../../src/server/shop/notify.ts';
import { parsePayseraCallback } from '../../../src/server/shop/paysera.ts';

export const onRequest = async ({ request, env }: Ctx) => {
  if (!env.PAYSERA_PROJECT_ID || !env.PAYSERA_SIGN_PASSWORD) return new Response('Not configured', { status: 404 });
  const params = request.method === 'POST' ? new URLSearchParams(await request.text()) : new URL(request.url).searchParams;
  const cb = parsePayseraCallback(env, params.get('data') ?? '', params.get('ss1') ?? '');
  if (!cb) return new Response('Bad signature', { status: 400 });

  if (cb.status === '1') {
    try {
      const catalog = await loadCatalog(request, env);
      await notifyPaid(env, catalog, { orderNo: cb.orderNo, amount: cb.amount, provider: 'Paysera', email: cb.email, test: cb.test });
    } catch (e) {
      console.error('Paysera pranešimo klaida', e);
      // Ne „OK“ – Paysera bandys pranešti dar kartą
      return new Response('Retry', { status: 500 });
    }
  }
  return new Response('OK', { headers: { 'Content-Type': 'text/plain' } });
};
