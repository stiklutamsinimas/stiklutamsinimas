import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { iconNames } from './lib/icon-names';

/**
 * PASLAUGOS – kiekvienas failas src/content/services/*.md yra atskiras puslapis.
 * Failo pavadinimas = URL adresas (pvz. langu-tamsinimas.md → /langu-tamsinimas).
 * Jei laukas neteisingas ar per ilgas – svetainė nesusikompiliuos ir parodys klaidą,
 * todėl klaidos nepateks į gyvą svetainę.
 */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      /** Trumpas pavadinimas (meniu, kortelės) */
      title: z.string(),
      category: z.enum(['automobiliams', 'pastatams', 'reklama']),
      /** Rikiavimas kategorijos viduje */
      order: z.number(),
      icon: z.enum(iconNames),

      /** <title> – rekomenduojama iki 60 simbolių */
      seoTitle: z.string().min(20).max(65),
      /** Meta aprašymas – rekomenduojama 120–160 simbolių */
      seoDescription: z.string().min(80).max(165),

      h1: z.string(),
      lead: z.string(),
      /** Trumpas aprašymas paslaugų kortelėms */
      excerpt: z.string().max(140),

      cover: image(),
      coverAlt: z.string(),

      highlights: z.array(z.string()).default([]),
      benefits: z
        .array(z.object({ title: z.string(), text: z.string(), icon: z.enum(iconNames) }))
        .default([]),
      steps: z.array(z.object({ title: z.string(), text: z.string() })).optional(),

      prices: z
        .array(z.object({ label: z.string(), value: z.string(), note: z.string().optional() }))
        .optional(),
      /** Mažiausia kaina eurais – schema.org Offer duomenims */
      priceFrom: z.number().optional(),

      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      related: z.array(reference('services')).default([]),
    }),
});

/**
 * TINKLARAŠTIS – paruoštas ateičiai. Įrašai su `draft: true` nepublikuojami.
 * Kai atsiras bent vienas publikuotas įrašas, automatiškai atsiras
 * /tinklarastis puslapis ir nuoroda meniu.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string().max(65).optional(),
      description: z.string().min(80).max(165),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      services: z.array(reference('services')).default([]),
    }),
});

export const collections = { services, blog };
