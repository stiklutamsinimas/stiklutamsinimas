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
const produktai = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produktai' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(320),
      price: z.number().nonnegative(),
      oldPrice: z.number().nonnegative().optional(),
      category: z.string(),
      images: z.array(image()).min(1),
      inStock: z.boolean().default(true),
      sku: z.string().optional(),
      draft: z.boolean().default(true),
    }),
});

export const collections = { services, naujienos, produktai };
