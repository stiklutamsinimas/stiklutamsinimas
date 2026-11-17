import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type Post = CollectionEntry<'naujienos'>;

export const categories = {
  automobiliams: { label: 'Automobiliams', short: 'Automobiliams' },
  pastatams: { label: 'Namams ir verslui', short: 'Namams ir verslui' },
  reklama: { label: 'Reklama', short: 'Reklama' },
} as const;
export type CategoryKey = keyof typeof categories;
export const categoryOrder: CategoryKey[] = ['automobiliams', 'pastatams', 'reklama'];

export async function getServices(): Promise<Service[]> {
  const all = await getCollection('services');
  return all.sort(
    (a, b) => categoryOrder.indexOf(a.data.category) - categoryOrder.indexOf(b.data.category) || a.data.order - b.data.order,
  );
}

export async function getServicesByCategory() {
  const all = await getServices();
  return categoryOrder
    .map((key) => ({ key, ...categories[key], items: all.filter((s) => s.data.category === key) }))
    .filter((g) => g.items.length > 0);
}

export const serviceUrl = (id: string) => `/${id}`;
export const postUrl = (id: string) => `/${id}`;

/** Publikuoti straipsniai (be juodraščių), naujausi pirmi */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('naujienos', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);

/** Apytikslis skaitymo laikas minutėmis */
export const readingTime = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 200));
