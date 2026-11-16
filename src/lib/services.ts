import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type ServiceCategory = Service['data']['category'];

export const categories: Record<ServiceCategory, { title: string; short: string; description: string }> = {
  automobiliams: {
    title: 'Paslaugos automobiliams',
    short: 'Automobiliams',
    description: 'Stiklų tamsinimas, žibintų tamsinimas ir poliravimas, stiklų keitimas.',
  },
  pastatams: {
    title: 'Paslaugos namams ir verslui',
    short: 'Namams ir verslui',
    description: 'Langų tamsinimas, apsauginės ir dekoratyvinės plėvelės, stiklo pertvaros.',
  },
  reklama: {
    title: 'Reklamos darbai',
    short: 'Reklama',
    description: 'Lipdukai, transporto ir vitrinų apklijavimas, plačiaformatė spauda.',
  },
};

export const categoryOrder: ServiceCategory[] = ['automobiliams', 'pastatams', 'reklama'];

/** Visos paslaugos, surikiuotos pagal kategoriją ir `order`. */
export async function getServices(): Promise<Service[]> {
  const all = await getCollection('services');
  return all.sort(
    (a, b) =>
      categoryOrder.indexOf(a.data.category) - categoryOrder.indexOf(b.data.category) ||
      a.data.order - b.data.order,
  );
}

export async function getServicesByCategory() {
  const all = await getServices();
  return categoryOrder.map((key) => ({
    key,
    ...categories[key],
    items: all.filter((s) => s.data.category === key),
  }));
}

export const serviceUrl = (id: string) => `/${id}`;

/** Publikuoti tinklaraščio įrašai (be juodraščių), naujausi pirmi. */
export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
