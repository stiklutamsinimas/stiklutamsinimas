/**
 * Automatinis prekės vertimas į lietuvių kalbą importuojant (Cloudflare Workers AI).
 * Įjungiama: Cloudflare → Workers & Pages → stiklutamsinimas → Settings → Bindings → Add → Workers AI, kintamasis „AI“.
 * Kaina: Workers AI nemokamai duoda 10 000 „neuronų“ per dieną – to užtenka maždaug 40–60 prekių vertimų per dieną.
 */

export interface TranslatableProduct {
  title: string;
  description: string;
  body: string;
  specs: { label: string; value: string }[];
}

/** Workers AI susiejimas (env.AI) – tik tai, ko reikia čia */
export interface AiBinding {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

/** Pirmas – geriausios kokybės; jei nepavyksta, bandomas kitas */
export const TRANSLATE_MODELS = ['@cf/openai/gpt-oss-120b', '@cf/mistralai/mistral-small-3.1-24b-instruct', '@cf/google/gemma-3-12b-it'] as const;

const MAX_BODY = 6000;

export const SYSTEM_PROMPT = `You translate product listings from AliExpress, Temu, Amazon and similar marketplaces into Lithuanian for a Lithuanian online shop (window tinting films and tools).

Rules:
- Write natural, grammatically correct Lithuanian with proper diacritics (ą, č, ę, ė, į, š, ų, ū, ž). Never answer in English.
- Do not invent facts. Keep all numbers, sizes, units, quantities, model codes and brand names exactly.
- "title": a clear Lithuanian product name, at most 90 characters, most important words first (what it is, key size/quantity). Remove marketplace spam such as "2024 New", "Hot Sale", "Free Shipping", "Dropshipping", "Wholesale", "High Quality", "AliExpress", emojis and long keyword lists.
- "description": 1–2 sentences, at most 280 characters, saying what the product is and what it is for.
- "body": the full product description translated into Lithuanian. Keep paragraphs; write lists as lines starting with "- ". Leave out seller and marketplace notes (shipping from China, "contact us", feedback or rating requests, store promotions). Keep useful notes about measurement tolerance or colour differences.
- "specs": translate every label and value. Leave out empty or meaningless entries (e.g. "NoEnName_Null", "Is Customized", "Model Number: None").
- Reply with ONE JSON object only, no other text: {"title": "...", "description": "...", "body": "...", "specs": [{"label": "...", "value": "..."}]}`;

/** Išrenka sugeneruotą tekstą iš įvairių Workers AI atsakymo formų */
export function aiText(out: unknown): string {
  if (typeof out === 'string') return out;
  if (!out || typeof out !== 'object') return '';
  const o = out as Record<string, any>;
  if (typeof o.response === 'string') return o.response;
  if (o.response && typeof o.response === 'object') return JSON.stringify(o.response);
  const choice = o.choices?.[0];
  if (typeof choice?.message?.content === 'string') return choice.message.content;
  if (typeof choice?.text === 'string') return choice.text;
  if (typeof o.output_text === 'string') return o.output_text;
  if (Array.isArray(o.output)) {
    const texts: string[] = [];
    for (const item of o.output) {
      if (item?.type === 'reasoning') continue;
      for (const c of Array.isArray(item?.content) ? item.content : []) if (typeof c?.text === 'string') texts.push(c.text);
    }
    if (texts.length) return texts.join('\n');
  }
  if (typeof o.result === 'object') return aiText(o.result);
  return '';
}

const clean = (v: unknown, max: number) =>
  typeof v === 'string'
    ? v
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
        .replace(/<[^>]*>/g, ' ')
        .trim()
        .slice(0, max)
    : '';
const oneLine = (v: unknown, max: number) => clean(v, max * 2).replace(/\s+/g, ' ').slice(0, max).trim();

/** Ištraukia ir patikrina JSON atsakymą. null – jei atsakymas netinkamas. */
export function parseTranslation(text: string): TranslatableProduct | null {
  const t = text.replace(/```(?:json)?/gi, '');
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  let raw: any;
  try {
    raw = JSON.parse(t.slice(start, end + 1));
  } catch {
    return null;
  }
  if (!raw || typeof raw !== 'object') return null;
  let title = oneLine(raw.title, 100);
  if (title.length > 100) title = title.slice(0, 100);
  if (title.length < 3) return null;
  let description = oneLine(raw.description, 400);
  if (description.length > 300) description = `${description.slice(0, 296).replace(/\s+\S*$/, '')} …`;
  const body = clean(raw.body, 20000);
  const specs = (Array.isArray(raw.specs) ? raw.specs : [])
    .map((s: any) => ({ label: oneLine(s?.label, 60), value: oneLine(s?.value, 120) }))
    .filter((s: { label: string; value: string }) => s.label && s.value)
    .slice(0, 20);
  return { title, description: description || title, body: body || description || title, specs };
}

/** Paruošia įvestį modeliui (ilgi aprašymai sutrumpinami) */
export function translationInput(p: TranslatableProduct): TranslatableProduct {
  return {
    title: oneLine(p.title, 300),
    description: oneLine(p.description, 600),
    body: clean(p.body, MAX_BODY),
    specs: (p.specs ?? []).slice(0, 30).map((s) => ({ label: oneLine(s.label, 80), value: oneLine(s.value, 160) })),
  };
}

export async function translateToLithuanian(
  ai: AiBinding,
  product: TranslatableProduct,
  models: readonly string[] = TRANSLATE_MODELS,
): Promise<{ ok: true; product: TranslatableProduct; model: string } | { ok: false; error: string }> {
  const input = translationInput(product);
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: JSON.stringify(input) },
  ];
  for (const model of models) {
    try {
      const out = await ai.run(model, { messages, max_tokens: 6000, temperature: 0.2 });
      const parsed = parseTranslation(aiText(out));
      if (parsed) return { ok: true, product: parsed, model };
      console.warn('Vertimas: netinkamas atsakymas', model);
    } catch (e) {
      console.warn('Vertimas: modelio klaida', model, e);
    }
  }
  return { ok: false, error: 'Nepavyko išversti. Bandykite dar kartą arba pataisykite tekstą rankiniu būdu.' };
}
