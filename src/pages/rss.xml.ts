import type { APIRoute } from 'astro';
import { site as cfg } from '@/config/site';
import { getPosts, postUrl } from '@/lib/content';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Naujienų RSS srautas */
export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const items = posts
    .map((p) => {
      const url = new URL(postUrl(p.id), site).href;
      return `<item><title>${esc(p.data.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${p.data.pubDate.toUTCString()}</pubDate><description>${esc(p.data.description)}</description></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(cfg.name)} – naujienos</title><link>${new URL('/naujienos', site).href}</link><description>Patarimai ir naujienos apie stiklų tamsinimą</description><language>lt</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
