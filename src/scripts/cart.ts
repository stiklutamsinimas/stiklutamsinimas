/**
 * Krepšelis naršyklėje (localStorage). Saugomi tik prekių ID, variantai ir kiekiai –
 * kainos visada imamos iš katalogo, o užsakymą serveris perskaičiuoja iš naujo.
 */
import type { Catalog, CartLine } from '@/lib/shop-core';

const KEY = 'krepselis-v1';
export const CART_EVENT = 'krepselis:pakeistas';

export function readCart(): CartLine[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(raw)
      ? raw.filter((l) => l && typeof l.id === 'string' && Number.isInteger(l.q) && l.q > 0).map((l) => ({ id: l.id, v: String(l.v ?? ''), q: l.q }))
      : [];
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* privatus režimas – krepšelis galios tik iki puslapio uždarymo */
  }
  document.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function addToCart(id: string, v: string, q: number) {
  const lines = readCart();
  const found = lines.find((l) => l.id === id && l.v === v);
  if (found) found.q = Math.min(999, found.q + q);
  else lines.push({ id, v, q });
  writeCart(lines);
}

export function setQty(id: string, v: string, q: number) {
  const lines = readCart()
    .map((l) => (l.id === id && l.v === v ? { ...l, q: Math.min(999, q) } : l))
    .filter((l) => l.q > 0);
  writeCart(lines);
}

export const clearCart = () => writeCart([]);

export const cartCount = () => readCart().reduce((s, l) => s + l.q, 0);

let catalogPromise: Promise<Catalog> | null = null;
export function loadCatalog(): Promise<Catalog> {
  catalogPromise ??= fetch('/parduotuve/katalogas.json', { cache: 'no-cache' }).then((r) => {
    if (!r.ok) throw new Error('Katalogas nepasiekiamas');
    return r.json() as Promise<Catalog>;
  });
  return catalogPromise;
}
