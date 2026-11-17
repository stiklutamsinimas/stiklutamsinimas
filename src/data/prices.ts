/**
 * AUTOMOBILIŲ STIKLŲ TAMSINIMO KAINOS – vienoje vietoje.
 * Naudojama pradžios puslapyje, automobilių stiklų tamsinimo puslapyje ir Google duomenyse.
 */
export interface CarPrice {
  type: string;
  note?: string;
  from: number;
  to: number;
}

export const carPrices: CarPrice[] = [
  { type: 'Hečbekas', note: '2 ar 4 durų', from: 90, to: 120 },
  { type: 'Kupė', from: 90, to: 110 },
  { type: 'Sedanas', from: 100, to: 130 },
  { type: 'Džipas', note: 'Visureigis, SUV', from: 110, to: 130 },
  { type: 'Minivenas', from: 120, to: 150 },
  { type: 'Mikroautobusas', from: 145, to: 180 },
];

export const carPriceFrom = Math.min(...carPrices.map((p) => p.from));
export const formatRange = (p: CarPrice) => `${p.from}–${p.to} €`;
