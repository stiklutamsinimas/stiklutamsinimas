/**
 * PARDUOTUVĖS ŠERDIS – be Astro priklausomybių.
 * Naudoja: svetainės puslapiai (kūrimo metu), krepšelis naršyklėje ir serveris (functions/api/*).
 * Visos sumos – CENTAIS (sveikieji skaičiai), kad nebūtų apvalinimo klaidų.
 */

export const CURRENCY = 'EUR';

export interface CatalogVariant {
  name: string;
  price: number;
  inStock: boolean;
}

export interface CatalogItem {
  id: string;
  category: string;
  title: string;
  url: string;
  image: string;
  price: number;
  unit: string;
  minQty: number;
  inStock: boolean;
  variants: CatalogVariant[];
  /** Siunčiama tiesiai iš tiekėjo (dropshipping) – tada tinka tik pristatymas iš tiekėjo */
  dropship?: boolean;
}

export type DeliveryType = 'atsiemimas' | 'pastomatas' | 'kurjeris';

export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  type: DeliveryType;
  note?: string;
  /** Pristatymas iš tiekėjo sandėlio – tik tiekėjo (dropshipping) prekėms */
  dropship?: boolean;
}

/** Viešas katalogas: /parduotuve/katalogas.json (serveris kainas tikrina pagal jį, ne pagal naršyklę) */
export interface Catalog {
  currency: typeof CURRENCY;
  products: CatalogItem[];
  delivery: DeliveryOption[];
  /** Nemokamas pristatymas nuo šios sumos (centais); 0 – išjungta */
  freeShippingFrom: number;
  payOnPickup: boolean;
  bank: { receiver: string; iban: string; bank: string };
  seller: { name: string; code: string; vatCode: string; address: string };
  /** Parduotuvės kontaktai (el. laiškams) */
  shop: { name: string; email: string; phone: string; url: string };
}

export interface CartLine {
  id: string;
  /** Varianto pavadinimas arba '' */
  v: string;
  q: number;
}

export type PaymentMethod = 'pavedimas' | 'atsiimant' | 'paysera' | 'stripe';

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pavedimas: 'Bankinis pavedimas',
  atsiimant: 'Apmokėjimas atsiimant',
  paysera: 'El. bankininkystė / kortelė (Paysera)',
  stripe: 'Mokėjimo kortelė / Apple Pay / Google Pay (Stripe)',
};

export interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  /** Paštomatas (pvz. „LP Express, Kupiškio Maxima“) arba pristatymo adresas */
  address: string;
  city: string;
  postCode: string;
  company: string;
  comment: string;
}

export interface OrderRequest {
  items: CartLine[];
  delivery: string;
  payment: PaymentMethod;
  customer: Customer;
  terms: boolean;
  /** Apsauga nuo robotų – žmogus šio lauko nemato, todėl jis turi būti tuščias */
  website?: string;
}

export interface PricedLine {
  id: string;
  title: string;
  variant: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
  url: string;
}

export interface PricedOrder {
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  total: number;
  delivery: DeliveryOption;
}

export const money = (cents: number) => `${(cents / 100).toFixed(2).replace('.', ',')} €`;
export const toCents = (eur: number) => Math.round(eur * 100);

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const lineKey = (id: string, v: string) => `${id}::${v}`;

/**
 * Kokie pristatymo būdai tinka krepšeliui: jei yra prekė, siunčiama tiesiai iš tiekėjo (dropshipping) –
 * tik pristatymas iš tiekėjo (į namų adresą, ilgesnis terminas); kitaip – įprasti būdai.
 * Jei pristatymas iš tiekėjo nenustatytas – visada įprasti būdai.
 */
export function availableDeliveries(catalog: Catalog, items: CartLine[]): DeliveryOption[] {
  const supplier = catalog.delivery.filter((d) => d.dropship);
  if (!supplier.length) return catalog.delivery;
  const dropship = (items ?? []).some((it) => catalog.products.find((p) => p.id === it?.id)?.dropship);
  return dropship ? supplier : catalog.delivery.filter((d) => !d.dropship);
}

/** Suskaičiuoja užsakymą pagal katalogą. Klaidos – lietuviškai, rodomos pirkėjui. */
export function priceOrder(catalog: Catalog, items: CartLine[], deliveryId: string): { ok: true; order: PricedOrder } | { ok: false; error: string } {
  if (!Array.isArray(items) || items.length === 0) return { ok: false, error: 'Krepšelis tuščias.' };
  if (items.length > 50) return { ok: false, error: 'Per daug skirtingų prekių viename užsakyme.' };

  const lines: PricedLine[] = [];
  for (const it of items) {
    const p = catalog.products.find((x) => x.id === it?.id);
    if (!p) return { ok: false, error: 'Vienos iš prekių nebėra parduotuvėje. Atnaujinkite krepšelį.' };
    const qty = Number(it.q);
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) return { ok: false, error: `Neteisingas kiekis: ${p.title}.` };
    if (qty < p.minQty) return { ok: false, error: `„${p.title}“ – mažiausias kiekis ${p.minQty} ${p.unit}` };
    if (!p.inStock) return { ok: false, error: `„${p.title}“ šiuo metu neturime.` };

    let unitPrice = p.price;
    let variant = '';
    if (p.variants.length) {
      const v = p.variants.find((x) => x.name === it.v);
      if (!v) return { ok: false, error: `Pasirinkite „${p.title}“ variantą.` };
      if (!v.inStock) return { ok: false, error: `„${p.title} – ${v.name}“ šiuo metu neturime.` };
      unitPrice = v.price;
      variant = v.name;
    }

    const existing = lines.find((l) => l.id === p.id && l.variant === variant);
    if (existing) {
      existing.qty += qty;
      existing.total = existing.unitPrice * existing.qty;
    } else {
      lines.push({ id: p.id, title: p.title, variant, qty, unit: p.unit, unitPrice, total: unitPrice * qty, url: p.url });
    }
  }

  const delivery = catalog.delivery.find((d) => d.id === deliveryId);
  if (!delivery) return { ok: false, error: 'Pasirinkite pristatymo būdą.' };
  const possible = availableDeliveries(catalog, items);
  if (!possible.some((d) => d.id === delivery.id)) {
    return {
      ok: false,
      error: delivery.dropship ? 'Pasirinkite pristatymo būdą.' : `Kai kurios prekės siunčiamos tiesiai iš tiekėjo – pasirinkite „${possible[0]?.name ?? 'pristatymą iš tiekėjo'}“.`,
    };
  }

  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const shipping = catalog.freeShippingFrom > 0 && subtotal >= catalog.freeShippingFrom ? 0 : delivery.price;
  return { ok: true, order: { lines, subtotal, shipping, total: subtotal + shipping, delivery } };
}

/** Kokie apmokėjimo būdai leidžiami pasirinktam pristatymui */
export function allowedPayments(catalog: Catalog, delivery: DeliveryOption | undefined, online: PaymentMethod[]): PaymentMethod[] {
  const list: PaymentMethod[] = [...online, 'pavedimas'];
  if (catalog.payOnPickup && delivery?.type === 'atsiemimas') list.push('atsiimant');
  return list;
}

/** Užsakymo tekstas – el. laiškams ir rankiniam siuntimui (WhatsApp, Viber, el. paštas) */
export function orderText(o: PricedOrder, c: Customer, payment: PaymentMethod, orderNo?: string): string {
  const rows = o.lines.map((l) => `• ${l.title}${l.variant ? ` (${l.variant})` : ''} – ${l.qty} ${l.unit} × ${money(l.unitPrice)} = ${money(l.total)}`);
  const addr =
    o.delivery.type === 'atsiemimas'
      ? ''
      : o.delivery.type === 'pastomatas'
        ? `Paštomatas: ${c.address}`
        : `Adresas: ${[c.address, c.postCode, c.city].filter(Boolean).join(', ')}`;
  const block = (lines: string[]) => lines.filter(Boolean).join('\n');
  return [
    orderNo ? `UŽSAKYMAS ${orderNo}` : 'UŽSAKYMAS',
    block(rows),
    block([
      `Prekės: ${money(o.subtotal)}`,
      `Pristatymas (${o.delivery.name}): ${o.shipping ? money(o.shipping) : 'nemokamai'}`,
      `IŠ VISO: ${money(o.total)}`,
      `Apmokėjimas: ${PAYMENT_LABELS[payment]}`,
    ]),
    block([
      `Pirkėjas: ${c.firstName} ${c.lastName}`.trim(),
      c.company ? `Įmonė: ${c.company}` : '',
      `Tel.: ${c.phone}`,
      `El. paštas: ${c.email}`,
      addr,
    ]),
    c.comment ? `Pastabos: ${c.comment}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

/** Pirkėjo duomenų patikra (serveryje). Grąžina klaidos tekstą arba null. */
export function validateCustomer(c: Partial<Customer> | undefined, delivery: DeliveryOption): string | null {
  if (!c) return 'Užpildykite pirkėjo duomenis.';
  const str = (v: unknown, max: number) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
  if (!str(c.firstName, 60) || !str(c.lastName, 60)) return 'Įrašykite vardą ir pavardę.';
  if (!str(c.phone, 30) || !/^[+\d][\d\s()-]{6,}$/.test(c.phone!.trim())) return 'Įrašykite teisingą telefono numerį.';
  if (!str(c.email, 120) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email!.trim())) return 'Įrašykite teisingą el. pašto adresą.';
  if (delivery.type === 'pastomatas' && !str(c.address, 160)) return 'Nurodykite paštomatą.';
  if (delivery.type === 'kurjeris' && (!str(c.address, 160) || !str(c.city, 60))) return 'Nurodykite pristatymo adresą ir miestą.';
  for (const k of ['company', 'postCode', 'comment', 'city', 'address'] as const) {
    const v = c[k];
    if (v !== undefined && (typeof v !== 'string' || v.length > (k === 'comment' ? 1000 : 160))) return 'Per ilgas tekstas formoje.';
  }
  return null;
}

/** Užsakymo numeris, pvz. 261125-7K3Q (data + 4 atsitiktiniai simboliai, be painių 0/O, 1/I) */
export function newOrderNo(now = new Date()): string {
  const d = now.toISOString().slice(2, 10).replace(/-/g, '');
  const abc = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const rnd = new Uint8Array(4);
  crypto.getRandomValues(rnd);
  return `${d}-${Array.from(rnd, (b) => abc[b % abc.length]).join('')}`;
}
