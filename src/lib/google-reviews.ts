/**
 * Google atsiliepimai – paimami svetainės kūrimo (build) metu per Google Places API.
 * Raktas niekada nepatenka į naršyklę.
 *
 * Kad atsiliepimai rodytųsi, Cloudflare Pages → Settings → Variables nustatykite:
 *   GOOGLE_PLACES_API_KEY – Google Cloud raktas su įjungtu „Places API (New)“
 *   GOOGLE_PLACE_ID       – jūsų Google verslo profilio Place ID (pvz. ChIJ...)
 * Be jų rodoma nuoroda į atsiliepimus Google Maps.
 */
export interface Review {
  author: string;
  rating: number;
  text: string;
  when: string;
  url?: string;
}

export interface ReviewsData {
  rating: number;
  count: number;
  reviews: Review[];
  mapsUrl?: string;
  writeUrl?: string;
}

let cache: Promise<ReviewsData | null> | undefined;

async function load(): Promise<ReviewsData | null> {
  const key = import.meta.env.GOOGLE_PLACES_API_KEY as string | undefined;
  const placeId = import.meta.env.GOOGLE_PLACE_ID as string | undefined;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=lt`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews,googleMapsUri',
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.warn(`[google-reviews] HTTP ${res.status} – atsiliepimai nerodomi`);
      return null;
    }
    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: {
        rating?: number;
        relativePublishTimeDescription?: string;
        text?: { text?: string };
        originalText?: { text?: string };
        authorAttribution?: { displayName?: string; uri?: string };
      }[];
    };
    const reviews = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? 'Google naudotojas',
        rating: r.rating ?? 5,
        text: (r.text?.text ?? r.originalText?.text ?? '').trim(),
        when: r.relativePublishTimeDescription ?? '',
        url: r.authorAttribution?.uri,
      }))
      .filter((r) => r.text.length > 0);
    if (!data.rating) return null;
    return {
      rating: data.rating,
      count: data.userRatingCount ?? reviews.length,
      reviews,
      mapsUrl: data.googleMapsUri,
      writeUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
    };
  } catch (e) {
    console.warn('[google-reviews] nepavyko gauti atsiliepimų:', (e as Error).message);
    return null;
  }
}

export const getGoogleReviews = () => (cache ??= load());
