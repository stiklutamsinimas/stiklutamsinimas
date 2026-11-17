/**
 * Naujausi Instagram įrašai – paimami svetainės kūrimo (build) metu.
 * Nuotraukos atsisiunčiamos ir optimizuojamos, todėl lankytojų naršyklė į Instagram nesikreipia.
 *
 * Kad įrašai rodytųsi, Cloudflare Pages → Settings → Variables nustatykite:
 *   INSTAGRAM_ACCESS_TOKEN – Instagram API (Instagram Login) ilgalaikis raktas
 * Be rakto rodomos jūsų darbų nuotraukos su nuoroda į Instagram profilį.
 */
export interface InstagramPost {
  id: string;
  caption: string;
  image: string;
  permalink: string;
  isVideo: boolean;
}

let cache: Promise<InstagramPost[]> | undefined;

async function load(limit: number): Promise<InstagramPost[]> {
  const token = import.meta.env.INSTAGRAM_ACCESS_TOKEN as string | undefined;
  if (!token) return [];
  try {
    const url = new URL('https://graph.instagram.com/me/media');
    url.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('access_token', token);
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      console.warn(`[instagram] HTTP ${res.status} – įrašai nerodomi`);
      return [];
    }
    const json = (await res.json()) as {
      data?: { id: string; caption?: string; media_type: string; media_url?: string; thumbnail_url?: string; permalink: string }[];
    };
    return (json.data ?? [])
      .map((p) => ({
        id: p.id,
        caption: (p.caption ?? '').split('\n')[0]?.slice(0, 140) ?? '',
        image: (p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url) ?? '',
        permalink: p.permalink,
        isVideo: p.media_type === 'VIDEO',
      }))
      .filter((p) => p.image);
  } catch (e) {
    console.warn('[instagram] nepavyko gauti įrašų:', (e as Error).message);
    return [];
  }
}

export const getInstagramPosts = (limit = 8) => (cache ??= load(limit));
