/**
 * Visa verslo informacija vienoje vietoje.
 * Pakeitus čia (telefoną, adresą, el. paštą) – pasikeičia visoje svetainėje,
 * įskaitant schema.org duomenis Google'ui.
 */

export interface Location {
  /** Miesto pavadinimas vardininku */
  city: string;
  /** Miestas vietininku („Panevėžyje“) – naudojamas tekstuose */
  cityIn: string;
  street: string;
}

const phone = '+37060564933';

export const site = {
  name: 'Stiklų tamsinimas',
  domain: 'stiklutamsinimas.eu',
  url: 'https://stiklutamsinimas.eu',
  tagline: 'Profesionalus klijavimas',
  description:
    'Automobilių ir pastatų stiklų tamsinimas, žibintų tamsinimas ir poliravimas, stiklų keitimas, dekoravimas plėvelėmis ir reklamos darbai. Kupiškis, Rokiškis, Panevėžys, Vilnius.',

  phone,
  phoneDisplay: '+370 605 64933',
  email: 'steponas@stiklutamsinimas.eu',
  whatsapp: `https://wa.me/${phone.replace('+', '')}`,
  viber: `viber://chat?number=${encodeURIComponent(phone)}`,

  experienceYears: 10,
  /** Minimali garantija visiems darbams (metais); priklausomai nuo medžiagų – ir ilgesnė */
  warrantyYears: 5,
  /** Visuose miestuose darbai atliekami tik iš anksto susitarus */
  appointmentNote: 'Darbai atliekami tik iš anksto susitarus',
  filmBrands: ['Solar Screen', 'Global Window Films', 'Ultra Vision'],

  locations: [
    { city: 'Kupiškis', cityIn: 'Kupiškyje', street: 'Gedimino g. 67' },
    { city: 'Rokiškis', cityIn: 'Rokiškyje', street: 'Miškininkų g. 5c' },
    { city: 'Panevėžys', cityIn: 'Panevėžyje', street: 'Molainių g. 15' },
    { city: 'Vilnius', cityIn: 'Vilniuje', street: 'Verkių g. 50' },
  ] satisfies readonly Location[],
} as const;
// Kainos saugomos paslaugų failuose (src/content/services/*.md → `prices`).

export const mapsUrl = (loc: Location) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.street}, ${loc.city}`)}`;

export const telHref = `tel:${site.phone}`;
export const mailHref = `mailto:${site.email}`;
