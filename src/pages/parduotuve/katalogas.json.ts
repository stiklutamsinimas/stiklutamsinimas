/**
 * Viešas prekių katalogas (kainos centais). Pagal jį serveris (functions/api/uzsakymas.ts)
 * perskaičiuoja kiekvieną užsakymą – naršyklėje pakeista kaina neturi jokios įtakos.
 */
import type { APIRoute } from 'astro';
import { buildCatalog } from '@/lib/shop';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildCatalog()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
