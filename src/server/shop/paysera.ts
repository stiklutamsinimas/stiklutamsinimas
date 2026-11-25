/**
 * Paysera mokėjimai (specifikacija v1.6): https://developers.paysera.com/en/checkout/integrations/integration-specification
 * Užklausa: data = base64(URL parametrai) su „/“→„_“, „+“→„-“; sign = md5(data + parašo slaptažodis).
 * Atsakymas (callback): tikrinamas ss1 = md5(data + slaptažodis); serveris turi atsakyti tekstu „OK“.
 */
import { md5 } from './md5.ts';
import { b64decode, b64encode, type Env } from './env.ts';
import type { Customer } from '../../lib/shop-core.ts';

const encode = (s: string) => b64encode(s).replace(/\//g, '_').replace(/\+/g, '-');
const decode = (s: string) => b64decode(s.replace(/_/g, '/').replace(/-/g, '+'));

export function payseraPaymentUrl(env: Env, o: { orderNo: string; total: number; customer: Customer; origin: string }): string {
  const params = new URLSearchParams({
    projectid: env.PAYSERA_PROJECT_ID!,
    orderid: o.orderNo,
    accepturl: `${o.origin}/parduotuve/aciu?nr=${encodeURIComponent(o.orderNo)}&b=apmoketa`,
    cancelurl: `${o.origin}/parduotuve/krepselis?atsaukta=1`,
    callbackurl: `${o.origin}/api/mokejimas/paysera`,
    version: '1.6',
    amount: String(o.total),
    currency: 'EUR',
    country: 'LT',
    lang: 'LIT',
    p_firstname: o.customer.firstName,
    p_lastname: o.customer.lastName,
    p_email: o.customer.email,
    test: env.PAYSERA_TEST === '1' ? '1' : '0',
  });
  const data = encode(params.toString());
  const sign = md5(data + env.PAYSERA_SIGN_PASSWORD);
  return `https://bank.paysera.com/pay/?data=${encodeURIComponent(data)}&sign=${sign}`;
}

export interface PayseraCallback {
  orderNo: string;
  /** '1' – apmokėta; '0' – neįvykdyta; '2' – priimta, bet dar neįvykdyta; '3' – papildoma informacija */
  status: string;
  amount: number;
  currency: string;
  test: boolean;
  email: string;
}

/** Patikrina parašą ir grąžina duomenis arba null (suklastota / ne mūsų projektas) */
export function parsePayseraCallback(env: Env, data: string, ss1: string): PayseraCallback | null {
  if (!data || !ss1 || md5(data + env.PAYSERA_SIGN_PASSWORD) !== ss1) return null;
  const p = new URLSearchParams(decode(data));
  if (p.get('projectid') !== env.PAYSERA_PROJECT_ID) return null;
  return {
    orderNo: p.get('orderid') ?? '',
    status: p.get('status') ?? '',
    amount: Number(p.get('amount') || 0),
    currency: p.get('currency') || 'EUR',
    test: p.get('test') === '1',
    email: p.get('p_email') ?? '',
  };
}
