/**
 * POST /api/uzsakymas – užsakymo priėmimas.
 * 1) kainos perskaičiuojamos pagal /parduotuve/katalogas.json (ne pagal naršyklę);
 * 2) tikrinami pirkėjo duomenys, pristatymas ir apmokėjimo būdas;
 * 3) el. mokėjimas → nuoroda į Paysera / Stripe; kitaip → laiškai (jei įjungti) arba rankinis siuntimas.
 */
import { emailEnabled, json, loadCatalog, onlineMethods, type Ctx } from '../../src/server/shop/env.ts';
import { notifyNewOrder } from '../../src/server/shop/notify.ts';
import { payseraPaymentUrl } from '../../src/server/shop/paysera.ts';
import { stripeCheckoutUrl } from '../../src/server/shop/stripe.ts';
import {
  allowedPayments,
  newOrderNo,
  orderText,
  priceOrder,
  validateCustomer,
  type Catalog,
  type Customer,
  type OrderRequest,
} from '../../src/lib/shop-core.ts';

const clean = (c: Partial<Customer>): Customer => {
  const s = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');
  return {
    firstName: s(c.firstName),
    lastName: s(c.lastName),
    phone: s(c.phone),
    email: s(c.email).toLowerCase(),
    address: s(c.address),
    city: s(c.city),
    postCode: s(c.postCode),
    company: s(c.company),
    comment: typeof c.comment === 'string' ? c.comment.trim().slice(0, 1000) : '',
  };
};

export const onRequestPost = async ({ request, env }: Ctx) => {
  let body: OrderRequest;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Neteisinga užklausa.' }, 400);
  }
  // Robotas užpildė paslėptą lauką – apsimetame, kad viskas gerai
  if (body.website) return json({ ok: true, orderNo: newOrderNo(), total: 0, next: 'done' });
  if (body.terms !== true) return json({ ok: false, error: 'Pažymėkite, kad susipažinote su pirkimo taisyklėmis.' }, 400);

  let catalog: Catalog;
  try {
    catalog = await loadCatalog(request, env);
  } catch {
    return json({ ok: false, error: 'Parduotuvė laikinai nepasiekiama. Pabandykite po kelių minučių.' }, 503);
  }

  const priced = priceOrder(catalog, body.items, body.delivery);
  if (!priced.ok) return json({ ok: false, error: priced.error }, 400);
  const { order } = priced;

  const problem = validateCustomer(body.customer, order.delivery);
  if (problem) return json({ ok: false, error: problem }, 400);
  const customer = clean(body.customer);

  const online = onlineMethods(env);
  if (!allowedPayments(catalog, order.delivery, online).includes(body.payment)) {
    return json({ ok: false, error: 'Šis apmokėjimo būdas negalimas. Pasirinkite kitą.' }, 400);
  }

  const orderNo = newOrderNo();
  const text = orderText(order, customer, body.payment, orderNo);
  const origin = new URL(request.url).origin;
  const base = { ok: true, orderNo, total: order.total };

  if (body.payment === 'paysera' || body.payment === 'stripe') {
    try {
      // Pirmiausia laiškas jums – kad užsakymo turinys nepasimestų, net jei pirkėjas nebaigs mokėti
      await notifyNewOrder(env, catalog, { orderNo, total: order.total, text, customer, payment: body.payment });
      const url =
        body.payment === 'paysera'
          ? payseraPaymentUrl(env, { orderNo, total: order.total, customer, origin })
          : await stripeCheckoutUrl(env, { orderNo, order, customer, origin });
      return json({ ...base, next: 'redirect', url });
    } catch (e) {
      console.error('El. mokėjimo klaida', e);
      return json({ ok: false, error: 'Nepavyko pradėti el. mokėjimo. Pasirinkite bankinį pavedimą arba bandykite vėliau.' }, 502);
    }
  }

  if (emailEnabled(env)) {
    try {
      await notifyNewOrder(env, catalog, { orderNo, total: order.total, text, customer, payment: body.payment });
      return json({ ...base, next: 'done' });
    } catch (e) {
      console.error('Laiško klaida', e);
      // Laiškas neišėjo – pirkėjas išsiųs užsakymą pats
    }
  }
  return json({ ...base, next: 'send', text });
};
