/**
 * Ar tekstas jau lietuviškas – kad importuojant nebūtų verčiama be reikalo.
 * Be priklausomybių: naudoja ir importo puslapis (naršyklėje), ir serveris.
 */

const LT_LETTERS = /[ąčęėįšųūž]/gi;
const LT_WORDS = /\b(ir|su|be|yra|skirta[s]?|tinka|naudojama[s]?|plėvelė\w*|langų|stiklų|automobili\w*|kaina|vnt|spalva|dydis|medžiaga)\b/gi;

export function looksLithuanian(text: string): boolean {
  const t = (text ?? '').slice(0, 3000);
  const letters = t.replace(/[^\p{L}]/gu, '').length;
  if (letters < 15) return false;
  const lt = (t.match(LT_LETTERS) ?? []).length;
  const words = (t.match(LT_WORDS) ?? []).length;
  // Lietuviškame tekste raidžių su diakritikais būna ~2–6 %, angliškame ar kiniškame – beveik nėra
  return lt / letters > 0.012 && words >= 1;
}
