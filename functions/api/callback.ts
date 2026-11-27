/**
 * GET /api/callback – prisijungimas su GitHub (2 žingsnis: GitHub grąžina kodą → gauname raktą).
 * Raktas perduodamas TIK šios svetainės langui (/admin), kuris atidarė prisijungimą (Decap/Sveltia CMS protokolas).
 */
import type { Ctx } from '../../src/server/shop/env.ts';
import { notConfigured } from './auth.ts';

function result(status: 'success' | 'error', content: Record<string, string>) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const safe = JSON.stringify(message).replace(/</g, '\\u003c');
  const text = status === 'success' ? 'Prisijungta. Šis langas tuoj užsidarys.' : `Nepavyko prisijungti: ${content.error ?? ''}`;
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Prisijungimas</title>
<body style="font-family:system-ui,sans-serif;margin:3rem;line-height:1.6"><p>${text.replace(/[<>&]/g, '')}</p>
<script>
(() => {
  const msg = ${safe};
  let sent = false;
  const send = () => {
    if (sent || !window.opener) return;
    sent = true;
    window.opener.postMessage(msg, location.origin);
    ${status === 'success' ? 'setTimeout(() => window.close(), 600);' : ''}
  };
  window.addEventListener('message', (e) => {
    if (e.origin === location.origin && typeof e.data === 'string' && e.data.startsWith('authorizing:github')) send();
  });
  if (window.opener) window.opener.postMessage('authorizing:github', location.origin);
  setTimeout(send, 1500);
})();
</script></body>`,
    {
      status: status === 'success' ? 200 : 400,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'",
        'Set-Cookie': 'gh_oauth_state=; Path=/api/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
      },
    },
  );
}

export const onRequestGet = async ({ request, env }: Ctx) => {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return notConfigured();
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie')?.match(/(?:^|;\s*)gh_oauth_state=([a-f0-9]+)/)?.[1];
  if (url.searchParams.get('error')) return result('error', { error: url.searchParams.get('error_description') ?? 'atšaukta' });
  if (!code || !state || !cookie || state !== cookie) return result('error', { error: 'pasibaigė laikas – bandykite dar kartą' });

  const r = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'stiklutamsinimas.eu' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });
  const data = (await r.json().catch(() => ({}))) as { access_token?: string; error_description?: string };
  if (!data.access_token) return result('error', { error: data.error_description ?? 'GitHub nepateikė rakto' });
  return result('success', { token: data.access_token, provider: 'github' });
};
