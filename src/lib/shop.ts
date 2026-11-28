/**
 * Parduotuvė – kūrimo metu (Astro). Kategorijos, prekių sąrašai, katalogas serveriui.
 * Nustatymai (pristatymas, rekvizitai) – src/data/parduotuve.json, keičiami per /admin.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import { features, site } from '@/config/site';
import settings from '@/data/parduotuve.json';
import { CURRENCY, slugify, toCents, type Catalog, type CatalogItem, type DeliveryOption, type DeliveryType } from '@/lib/shop-core';

export type Product = CollectionEntry<'produktai'>;

export const shopCategories = [
  {
    slug: 'pleveles',
    name: 'Plėvelės',
    title: 'Plėvelės stiklams ir automobiliams',
    description:
      'Automobilių tamsinimo, saulės kontrolės, veidrodinės, matinės ir apsauginės plėvelės. Tos pačios, kurias klijuojame patys – su patarimu, kaip pasirinkti.',
  },
  {
    slug: 'irankiai',
    name: 'Įrankiai',
    title: 'Įrankiai plėvelių klijavimui',
    description: 'Mentelės, peiliai, purkštuvai, karšto oro pistoletai ir kitos priemonės plėvelėms klijuoti – išbandytos mūsų darbe.',
  },
] as const;

export type CategorySlug = (typeof shopCategories)[number]['slug'];
export const categoryBySlug = (slug: string) => shopCategories.find((c) => c.slug === slug);

export const shopUrl = '/parduotuve';
export const categoryUrl = (slug: string) => `${shopUrl}/${slug}`;
export const productUrl = (p: Product) => `${shopUrl}/${p.data.category}/${p.id}`;

/** Paskelbtos prekės (be juodraščių), surikiuotos */
export async function getProducts(category?: string): Promise<Product[]> {
  if (!features.shop) return [];
  const all = await getCollection('produktai', ({ data }) => !data.draft && (!category || data.category === category));
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'lt'));
}

/** Ar rodyti parduotuvę meniu (įjungta ir yra bent viena prekė) */
export async function shopVisible() {
  return features.shop && (await getProducts()).length > 0;
}

/** Kainų intervalas su variantais (eurais) */
export function priceRange(p: Product): { min: number; max: number } {
  const prices = p.data.variants.length ? p.data.variants.map((v) => v.price ?? p.data.price) : [p.data.price];
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Ar prekė siunčiama tiesiai iš tiekėjo (dropshipping). Nenustatyta – taip, jei įrašyta tiekėjo nuoroda */
export const isDropship = (p: Product) => p.data.dropship ?? Boolean(p.data.source);

const supplierDelivery = (settings as { dropship?: { name?: string; price?: number; note?: string } }).dropship;

export const deliveryOptions: DeliveryOption[] = [
  ...settings.delivery.map((d) => ({
    id: slugify(d.name),
    name: d.name,
    type: d.type as DeliveryType,
    price: toCents(d.price),
    note: d.note || undefined,
  })),
  // Pristatymas iš tiekėjo sandėlio (dropshipping prekėms) – visada į namų adresą
  ...(supplierDelivery?.name?.trim()
    ? [
        {
          id: `tiekejas-${slugify(supplierDelivery.name)}`,
          name: supplierDelivery.name.trim(),
          type: 'kurjeris' as DeliveryType,
          price: toCents(Number(supplierDelivery.price) || 0),
          note: supplierDelivery.note?.trim() || undefined,
          dropship: true,
        },
      ]
    : []),
];

/** Pristatymas iš tiekėjo (jei nustatytas) – rodomas tiekėjo prekių puslapiuose */
export const supplierDeliveryOption = deliveryOptions.find((d) => d.dropship);

export const shopSettings = settings;

/** Viešas katalogas serveriui ir krepšeliui (/parduotuve/katalogas.json) */
export async function buildCatalog(): Promise<Catalog> {
  const products = await getProducts();
  const items: CatalogItem[] = await Promise.all(
    products.map(async (p) => {
      const thumb = await getImage({ src: p.data.images[0]!, width: 160, height: 160, fit: 'cover', format: 'webp' });
      return {
        id: p.id,
        category: p.data.category,
        title: p.data.title,
        url: productUrl(p),
        image: thumb.src,
        price: toCents(p.data.price),
        unit: p.data.unit,
        minQty: p.data.minQty,
        inStock: p.data.inStock,
        variants: p.data.variants.map((v) => ({ name: v.name, price: toCents(v.price ?? p.data.price), inStock: v.inStock })),
        ...(isDropship(p) && { dropship: true }),
      };
    }),
  );
  return {
    currency: CURRENCY,
    products: items,
    delivery: deliveryOptions,
    freeShippingFrom: toCents(settings.freeShippingFrom),
    payOnPickup: settings.payOnPickup,
    bank: settings.bank,
    seller: settings.seller,
    shop: { name: site.name, email: site.email, phone: site.phoneDisplay, url: site.url },
  };
}
