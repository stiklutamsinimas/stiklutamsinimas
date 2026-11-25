import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { iconNames } from './lib/icon-names';
import { galleryFolders } from './data/gallery-folders';

/**
 * PASLAUGOS – src/content/services/*.md. Failo pavadinimas = URL (langu-tamsinimas.md → /langu-tamsinimas).
 * Jei laukas neteisingas – svetainė nesusikompiliuos ir parodys klaidą, todėl klaidos nepateks į internetą.
 */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['automobiliams', 'pastatams', 'reklama']),
      order: z.number(),
      icon: z.enum(iconNames),
      /** Pagrindinė paslauga – rodoma didesne kortele */
      featured: z.boolean().default(false),
      /** Miestai, rodomi paslaugos viršuje (pvz. mobiliam tamsinimui) */
      cities: z.array(z.string()).default([]),
      /** YouTube vaizdo įrašai (id iš nuorodos youtube.com/watch?v=ID) */
      videos: z.array(z.object({ id: z.string().regex(/^[\w-]{11}$/), title: z.string() })).default([]),

      seoTitle: z.string().min(20).max(65),
      seoDescription: z.string().min(80).max(165),

      h1: z.string(),
      lead: z.string(),
      excerpt: z.string().max(150),

      cover: image(),
      coverAlt: z.string(),

      highlights: z.array(z.string()).default([]),
      benefits: z.array(z.object({ title: z.string(), text: z.string(), icon: z.enum(iconNames) })).default([]),

      prices: z.array(z.object({ label: z.string(), value: z.string(), note: z.string().optional() })).optional(),
      priceFrom: z.number().optional(),
      /** Rodyti automobilių kainų lentelę (src/data/prices.ts) */
      priceTable: z.boolean().default(false),

      /** Galerijos – nuotraukos imamos iš src/assets/<folder> */
      galleries: z
        .array(z.object({ title: z.string().optional(), folder: z.enum(galleryFolders), text: z.string().optional() }))
        .default([]),
      /** Plėvelių pavyzdžiai (automobiliams) */
      films: z.enum(['visi', 'priekiniai', 'galiniai']).optional(),
      /** Prieš ir po palyginimai */
      beforeAfter: z
        .array(z.object({ title: z.string(), text: z.string().optional(), before: z.string(), after: z.string() }))
        .default([]),

      faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      related: z.array(reference('services')).default([]),
    }),
});

/**
 * NAUJIENOS (straipsniai) – src/content/naujienos/*.md.
 * Rašomi per administravimo puslapį /admin arba tiesiog sukuriant .md failą.
 * Straipsnio adresas = failo pavadinimas (kaip senoje svetainėje, pvz. /kaip-tamsinti-automobilio-stiklus).
 */
const naujienos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/naujienos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(5).max(120),
      seoTitle: z.string().max(70).optional(),
      description: z.string().min(40).max(320),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

/**
 * PARDUOTUVĖ – paruošta ateičiai (įjungiama src/config/site.ts → features.shop).
 */
/**
 * PARDUOTUVĖS PREKĖS – src/content/produktai/*.md (keliamos per /admin → „Parduotuvė – prekės“).
 * Adresas: /parduotuve/<kategorija>/<failo-pavadinimas>. Kategorijos – src/lib/shop.ts.
 */
const produktai = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produktai' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(3).max(100),
      category: z.enum(['pleveles', 'irankiai']),
      /** Trumpas aprašymas – kortelėje ir Google paieškoje */
      description: z.string().min(20).max(320),
      /** Kaina eurais (galutinė pirkėjui) */
      price: z.number().nonnegative(),
      /** Sena kaina – rodoma perbraukta (akcija) */
      oldPrice: z.number().nonnegative().nullish(),
      unit: z.enum(['vnt.', 'm', 'm²', 'ritinys', 'komplektas']).default('vnt.'),
      minQty: z.number().int().min(1).default(1),
      images: z.array(image()).min(1),
      imageAlt: z.string().nullish(),
      /** Variantai, pvz. tamsumas (5 %, 15 %, 35 %) ar plotis (76 cm, 152 cm). Kaina neprivaloma – tada imama pagrindinė */
      variantLabel: z.string().nullish(),
      variants: z
        .array(z.object({ name: z.string().min(1), price: z.number().nonnegative().nullish(), inStock: z.boolean().default(true) }))
        .nullish()
        .transform((v) => v ?? []),
      /** Techniniai duomenys, pvz. „Šviesos pralaidumas: 35 %“ */
      specs: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .nullish()
        .transform((v) => v ?? []),
      brand: z.string().nullish(),
      sku: z.string().nullish(),
      inStock: z.boolean().default(true),
      /** Rodyti parduotuvės pradžioje */
      featured: z.boolean().default(false),
      /** Rikiavimas (mažesnis – pirmiau) */
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

export const collections = { services, naujienos, produktai };
