/** Pranešimai el. paštu: naujas užsakymas (jums ir pirkėjui) ir gautas apmokėjimas */
import { sendMail } from './email.ts';
import type { Env } from './env.ts';
import { money, type Catalog, type Customer, type PaymentMethod } from '../../lib/shop-core.ts';

const ownerEmail = (env: Env, catalog: Catalog) => env.ORDER_EMAIL_TO || catalog.shop.email;
const isOnline = (p: PaymentMethod) => p === 'paysera' || p === 'stripe';

function paymentInfo(catalog: Catalog, payment: PaymentMethod, orderNo: string, total: number): string {
  const { bank, shop } = catalog;
  if (payment === 'pavedimas') {
    return bank.iban
      ? [
          'Apmokėti galite pavedimu:',
          `Gavėjas: ${bank.receiver}`,
          `Sąskaita (IBAN): ${bank.iban}`,
          bank.bank ? `Bankas: ${bank.bank}` : '',
          `Suma: ${money(total)}`,
          `Mokėjimo paskirtis: Užsakymas ${orderNo}`,
        ]
          .filter(Boolean)
          .join('\n') + '\n\nPrekes išsiųsime gavę apmokėjimą.'
      : 'Sąskaitą apmokėjimui atsiųsime atskiru laišku. Prekes išsiųsime gavę apmokėjimą.';
  }
  if (payment === 'atsiimant') return `Apmokėsite atsiimdami prekes. Prieš atvykdami paskambinkite ${shop.phone} – susitarsime dėl laiko.`;
  return 'Gavę apmokėjimą atsiųsime patvirtinimą atskiru laišku.';
}

export async function notifyNewOrder(
  env: Env,
  catalog: Catalog,
  o: { orderNo: string; total: number; text: string; customer: Customer; payment: PaymentMethod },
): Promise<void> {
  const owner = ownerEmail(env, catalog);
  await sendMail(env, {
    to: owner,
    subject: `Naujas užsakymas ${o.orderNo} – ${money(o.total)}${isOnline(o.payment) ? ' (laukiama apmokėjimo)' : ''}`,
    text: `${o.text}\n\n—\nAtsakykite į šį laišką – atsakymas nueis pirkėjui (${o.customer.email}).`,
    replyTo: o.customer.email,
  });
  // Pirkėjo patvirtinimas – nesėkmė nestabdo užsakymo
  await sendMail(env, {
    to: o.customer.email,
    subject: `Jūsų užsakymas ${o.orderNo} – ${catalog.shop.name}`,
    text: [
      `Sveiki, ${o.customer.firstName},`,
      `ačiū už užsakymą! Jo numeris – ${o.orderNo}. Netrukus susisieksime ir patvirtinsime.`,
      paymentInfo(catalog, o.payment, o.orderNo, o.total),
      o.text,
      `Klausimų? Skambinkite ${catalog.shop.phone} arba tiesiog atsakykite į šį laišką.\n${catalog.shop.name} · ${catalog.shop.url}`,
    ].join('\n\n'),
    replyTo: owner,
  }).catch(() => {});
}

export async function notifyPaid(
  env: Env,
  catalog: Catalog,
  p: { orderNo: string; amount: number; provider: string; email?: string; test: boolean },
): Promise<void> {
  await sendMail(env, {
    to: ownerEmail(env, catalog),
    subject: `${p.test ? '[BANDYMAS] ' : ''}APMOKĖTA: užsakymas ${p.orderNo} – ${money(p.amount)} (${p.provider})`,
    text: `Užsakymas ${p.orderNo} apmokėtas per ${p.provider}: ${money(p.amount)}.${p.test ? '\n\nTai BANDOMASIS mokėjimas – pinigai nenuskaičiuoti.' : ''}\n\nUžsakymo turinys – laiške „Naujas užsakymas ${p.orderNo}“.`,
  });
  if (p.email) {
    await sendMail(env, {
      to: p.email,
      subject: `Apmokėjimas gautas – užsakymas ${p.orderNo}`,
      text: `Sveiki,\n\napmokėjimą už užsakymą ${p.orderNo} (${money(p.amount)}) gavome. Netrukus paruošime prekes ir pranešime apie išsiuntimą.\n\n${catalog.shop.name} · ${catalog.shop.phone} · ${catalog.shop.url}`,
      replyTo: ownerEmail(env, catalog),
    }).catch(() => {});
  }
}
