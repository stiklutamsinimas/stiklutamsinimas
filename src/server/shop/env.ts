/**
 * Serverio (Cloudflare Pages Functions) aplinka.
 * Kintamieji nustatomi: Cloudflare → Workers & Pages → stiklutamsinimas → Settings → Variables and Secrets.
 * Raktai (API key, slaptažodžiai) – kaip „Secret“, ne paprastas tekstas. Žr. docs/parduotuve.md.
 */
import type { Catalog, PaymentMethod } from '../../lib/shop-core.ts';

export interface Env {
  ASSETS?: { fetch: (input: Request | URL | string) => Promise<Response> };
  /** El. laiškai (resend.com) – užsakymai jums ir patvirtinimai pirkėjams */
  RESEND_API_KEY?: string;
  /** Siuntėjas, pvz. „Stiklų tamsinimas <uzsakymai@stiklutamsinimas.eu>“ (domenas patvirtintas Resend) */
  ORDER_EMAIL_FROM?: string;
  /** Kam siųsti užsakymus (jei tuščia – svetainės el. paštas) */
  ORDER_EMAIL_TO?: string;
  /** Paysera: projekto ID ir parašo slaptažodis (Paysera → Projektai → Projekto nustatymai) */
  PAYSERA_PROJECT_ID?: string;
  PAYSERA_SIGN_PASSWORD?: string;
  /** '1' – bandomieji mokėjimai (pinigai nenuskaičiuojami) */
  PAYSERA_TEST?: string;
  /** Stripe: slaptas raktas (sk_live_… / sk_test_…) ir webhook parašo raktas (whsec_…) */
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

export interface Ctx {
  request: Request;
  env: Env;
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export const emailEnabled = (env: Env) => Boolean(env.RESEND_API_KEY && env.ORDER_EMAIL_FROM);

/** El. mokėjimai įjungiami tik kai yra raktai IR el. laiškai (kitaip užsakymo duomenys nepasiektų jūsų) */
export function onlineMethods(env: Env): PaymentMethod[] {
  if (!emailEnabled(env)) return [];
  const list: PaymentMethod[] = [];
  if (env.PAYSERA_PROJECT_ID && env.PAYSERA_SIGN_PASSWORD) list.push('paysera');
  if (env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET) list.push('stripe');
  return list;
}

export async function loadCatalog(request: Request, env: Env): Promise<Catalog> {
  const url = new URL('/parduotuve/katalogas.json', request.url);
  const res = env.ASSETS ? await env.ASSETS.fetch(url) : await fetch(url);
  if (!res.ok) throw new Error(`Katalogas nepasiekiamas (${res.status})`);
  return res.json() as Promise<Catalog>;
}

/** UTF-8 ↔ base64 (Paysera ir kt.) */
export function b64encode(s: string): string {
  let bin = '';
  for (const b of new TextEncoder().encode(s)) bin += String.fromCharCode(b);
  return btoa(bin);
}
export function b64decode(s: string): string {
  const bin = atob(s);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}
