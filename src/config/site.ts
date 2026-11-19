/**
 * VIENA VIETA visai verslo informacijai.
 * Pakeitus čia – atsinaujina visa svetainė (antraštė, poraštė, kontaktai, Google duomenys).
 */

export interface Location {
  city: string;
  /** Vietininkas („Kupiškyje“) – tekstams */
  cityIn: string;
  street: string;
  /** Google Maps paieškos tekstas (žemėlapiui) */
  mapQuery: string;
  /** Koordinatės (schema.org) – tik tikslios, iš senos svetainės žemėlapio nuorodų */
  lat?: number;
  lng?: number;
}

const phone = '+37060564933';

export const site = {
  name: 'Stiklų tamsinimas',
  legalName: 'stiklutamsinimas.eu',
  domain: 'stiklutamsinimas.eu',
  /** Svetainės adresas – imamas iš astro.config.mjs (DOMAIN_LIVE) */
  url: String(import.meta.env.SITE).replace(/\/$/, ''),
  tagline: 'Profesionalus klijavimas',
  description:
    'Automobilių ir pastatų stiklų tamsinimas, žibintų tamsinimas ir poliravimas, matinės ir veidrodinės plėvelės, reklama. Kupiškis, Rokiškis, Panevėžys – ir visa Lietuva.',

  phone,
  phoneDisplay: '+370 605 64933',
  email: 'steponas@stiklutamsinimas.eu',

  /** Veiklos pradžios metai („Patirtis nuo 2007 m.“) */
  foundedYear: 2007,
  /** Garantija atliktiems darbams – priklauso nuo plėvelės rūšies */
  warranty: {
    short: '5–10 metų garantija',
    full: '5–10 metų garantija, priklausomai nuo plėvelės rūšies',
  },
  appointmentNote: 'Darbai atliekami tik iš anksto susitarus',
  filmBrands: ['Solar Screen', 'Global Window Films', 'Ultra Vision'],

  /** Tiesioginio susirašinėjimo kanalai */
  chat: {
    messenger: 'https://m.me/www.stiklutamsinimas.eu',
    whatsapp: `https://wa.me/${phone.replace('+', '')}`,
    viber: `viber://chat?number=${encodeURIComponent(phone)}`,
  },

  /** Socialiniai tinklai – poraštė, kontaktai, schema.org `sameAs` */
  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/www.stiklutamsinimas.eu' },
    { name: 'Instagram', url: 'https://www.instagram.com/stiklutamsinimas.eu/' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@stiklutamsinimas.eu' },
    { name: 'YouTube', url: 'https://www.youtube.com/channel/UC4It0mQo2qAH3oaIKSpyrhA' },
  ],
  instagramHandle: 'stiklutamsinimas.eu',

  /** Google verslo profilis (atsiliepimai) – Kupiškio padalinys */
  google: {
    /** Visi atsiliepimai Google Maps */
    reviewsUrl: 'https://www.google.com/maps?cid=8868999506228671504',
  },

  locations: [
    { city: 'Kupiškis', cityIn: 'Kupiškyje', street: 'Gedimino g. 67', mapQuery: 'Stiklų tamsinimas, Gedimino g. 67, Kupiškis', lat: 55.8384734, lng: 24.9716497 },
    { city: 'Rokiškis', cityIn: 'Rokiškyje', street: 'Miškininkų g. 5c', mapQuery: 'Miškininkų g. 5c, Rokiškis', lat: 55.944588, lng: 25.598657 },
    { city: 'Panevėžys', cityIn: 'Panevėžyje', street: 'Molainių g. 15', mapQuery: 'Molainių g. 15, Panevėžys', lat: 55.7217528, lng: 24.3301278 },
    { city: 'Vilnius', cityIn: 'Vilniuje', street: 'Verkių g. 50', mapQuery: 'Verkių g. 50, Vilnius' },
  ] satisfies readonly Location[],
} as const;

/**
 * Google Ads konversijų sekimas.
 * Kol `id` tuščias – svetainė NENAUDOJA jokių slapukų ir slapukų sutikimo langas nerodomas.
 * Įrašius ID (pvz. 'AW-123456789') atsiras sutikimo langas; Google žyma įkeliama TIK lankytojui paspaudus „Sutinku“.
 * Žymės (label) – Google Ads → Tikslai → Konversijos → veiksmas → „Žymos sąranka“ → send_to: 'AW-…/ŠITA_DALIS'.
 * ID galima nurodyti ir Cloudflare Pages kintamuoju PUBLIC_GOOGLE_ADS_ID.
 */
export const googleAds = {
  /** Įrašykite čia, pvz. 'AW-123456789' */
  id: (import.meta.env.PUBLIC_GOOGLE_ADS_ID as string | undefined)?.trim() || 'AW-473972961',
  labels: {
    /** Paspaudimas ant telefono numerio */
    call: 'OGumCLOgxrsdEOGBgeIB',
    /** Žinutė: WhatsApp, Viber, Messenger, el. paštas, užklausos forma */
    lead: 'xAv5CLagxrsdEOGBgeIB',
  },
};

/** Funkcijos, kurias galima įjungti vėliau */
export const features = {
  /** Internetinė parduotuvė (/parduotuve). Kol `false` – puslapiai negeneruojami ir nerodomi meniu. */
  shop: false,
} as const;

/** Lietuvos vidurys – automatinės temos (saulėtekis / saulėlydis) skaičiavimui */
export const themeGeo = { lat: 55.5, lng: 24.3 } as const;

export const mapsUrl = (loc: Location) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery)}`;
export const mapsEmbedUrl = (loc: Location) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(loc.mapQuery)}&z=15&hl=lt&output=embed`;

export const telHref = `tel:${site.phone}`;
export const mailHref = `mailto:${site.email}`;
