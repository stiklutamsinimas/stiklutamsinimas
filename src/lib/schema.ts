/**
 * schema.org (JSON-LD) struktūriniai duomenys – padeda Google suprasti,
 * kas esate, kur esate ir ką siūlote (Google Maps, išplėstiniai paieškos rezultatai).
 */
import { site } from '@/config/site';

export const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;
const LOGO_URL = `${site.url}/logo.png`;
const DEFAULT_IMAGE = `${site.url}/og-default.jpg`;

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

/** Organizacija + 4 padaliniai (LocalBusiness) + svetainė. Įdedama į kiekvieną puslapį. */
export function siteGraph() {
  return [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: site.name,
      alternateName: site.domain,
      url: site.url,
      logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
      image: DEFAULT_IMAGE,
      email: site.email,
      telephone: site.phone,
      description: site.description,
      slogan: site.tagline,
      foundingDate: String(site.foundedYear),
      areaServed: { '@type': 'Country', name: 'Lietuva' },
      sameAs: site.social.map((s) => s.url),
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: site.phone,
        email: site.email,
        contactType: 'customer service',
        availableLanguage: ['lt'],
      },
      department: site.locations.map((loc) => ({ '@id': `${site.url}/#${slug(loc.city)}` })),
    },
    ...site.locations.map((loc) => ({
      '@type': ['LocalBusiness', 'AutomotiveBusiness'],
      '@id': `${site.url}/#${slug(loc.city)}`,
      name: `${site.name} – ${loc.city}`,
      url: `${site.url}/kontaktai`,
      image: DEFAULT_IMAGE,
      logo: LOGO_URL,
      telephone: site.phone,
      email: site.email,
      priceRange: '€€',
      address: { '@type': 'PostalAddress', streetAddress: loc.street, addressLocality: loc.city, addressCountry: 'LT' },
      ...('lat' in loc && loc.lat ? { geo: { '@type': 'GeoCoordinates', latitude: loc.lat, longitude: loc.lng } } : {}),
      areaServed: { '@type': 'City', name: loc.city },
      parentOrganization: { '@id': ORG_ID },
    })),
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: site.url,
      name: site.name,
      inLanguage: 'lt-LT',
      publisher: { '@id': ORG_ID },
    },
  ];
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.url, site.url).href,
    })),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export function serviceSchema(opts: { name: string; description: string; url: string; image?: string; priceFrom?: number }) {
  return {
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: new URL(opts.url, site.url).href,
    image: opts.image ?? DEFAULT_IMAGE,
    provider: { '@id': ORG_ID },
    areaServed: [{ '@type': 'Country', name: 'Lietuva' }, ...site.locations.map((l) => ({ '@type': 'City', name: l.city }))],
    ...(opts.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: opts.priceFrom,
            priceSpecification: { '@type': 'PriceSpecification', minPrice: opts.priceFrom, priceCurrency: 'EUR' },
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  published: Date;
  modified?: Date;
}) {
  const url = new URL(opts.url, site.url).href;
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: opts.title,
    description: opts.description,
    url,
    mainEntityOfPage: url,
    image: opts.image ?? DEFAULT_IMAGE,
    datePublished: opts.published.toISOString(),
    dateModified: (opts.modified ?? opts.published).toISOString(),
    inLanguage: 'lt-LT',
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  };
}
