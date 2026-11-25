/**
 * Stripe Checkout (kortelės, Apple Pay, Google Pay): https://docs.stripe.com/api/checkout/sessions/create
 * Patvirtinimas – webhook /api/mokejimas/stripe (įvykis checkout.session.completed), parašas tikrinamas HMAC-SHA256.
 */
import type { Env } from './env.ts';
import type { PricedOrder, Customer } from '../../lib/shop-core.ts';

export async function stripeCheckoutUrl(env: Env, o: { orderNo: string; order: PricedOrder; customer: Customer; origin: string }): Promise<string> {
  const f = new URLSearchParams({
    mode: 'payment',
    locale: 'lt',
    client_reference_id: o.orderNo,
    customer_email: o.customer.email,
    success_url: `${o.origin}/parduotuve/aciu?nr=${encodeURIComponent(o.orderNo)}&b=apmoketa`,
    cancel_url: `${o.origin}/parduotuve/krepselis?atsaukta=1`,
    'metadata[order_no]': o.orderNo,
    'payment_intent_data[metadata][order_no]': o.orderNo,
  });
  const lines = o.order.lines.map((l) => ({ name: l.variant ? `${l.title} – ${l.variant}` : l.title, amount: l.unitPrice, qty: l.qty }));
  if (o.order.shipping > 0) lines.push({ name: `Pristatymas: ${o.order.delivery.name}`, amount: o.order.shipping, qty: 1 });
  lines.forEach((l, i) => {
    f.set(`line_items[${i}][price_data][currency]`, 'eur');
    f.set(`line_items[${i}][price_data][product_data][name]`, l.name.slice(0, 250));
    f.set(`line_items[${i}][price_data][unit_amount]`, String(l.amount));
    f.set(`line_items[${i}][quantity]`, String(l.qty));
  });

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: f.toString(),
  });
  const data = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !data.url) throw new Error(`Stripe klaida: ${data.error?.message ?? res.status}`);
  return data.url;
}

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

/** Tikrina Stripe-Signature antraštę (t=…,v1=…). Leidžiamas 5 min. laiko skirtumas. */
export async function verifyStripeSignature(secret: string, header: string | null, body: string, now = Date.now()): Promise<boolean> {
  if (!header) return false;
  const parts = header.split(',').map((p) => p.split('=') as [string, string]);
  const t = parts.find(([k]) => k === 't')?.[1];
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v);
  if (!t || !sigs.length || Math.abs(now / 1000 - Number(t)) > 300) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${body}`)));
  return sigs.some((s) => s.length === expected.length && timingSafeEqual(s, expected));
}

function timingSafeEqual(a: string, b: string) {
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
