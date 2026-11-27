/**
 * GET /api/auth – prisijungimas prie /admin su GitHub (1 žingsnis: nukreipimas į GitHub).
 * Veikia su Sveltia CMS (public/admin/config.yml → backend.base_url + auth_endpoint) ir importo puslapiu.
 * Reikia Cloudflare kintamųjų GITHUB_CLIENT_ID ir GITHUB_CLIENT_SECRET (žr. docs/admin-prisijungimas.md).
 */
import type { Ctx } from '../../src/server/shop/env.ts';

export const notConfigured = () =>
  new Response(
    `<!doctype html><meta charset="utf-8"><title>Prisijungimas neįjungtas</title>
<body style="font-family:system-ui,sans-serif;max-width:34rem;margin:3rem auto;padding:0 1rem;line-height:1.6">
<h1 style="font-size:1.4rem">Prisijungimas su GitHub dar neįjungtas</h1>
<p>Cloudflare nustatymuose trūksta <b>GITHUB_CLIENT_ID</b> ir <b>GITHUB_CLIENT_SECRET</b>. Kaip juos gauti – instrukcijoje <code>docs/admin-prisijungimas.md</code>.</p>
<p>Kol kas galite prisijungti su GitHub raktu („Sign In Using Access Token“).</p></body>`,
    { status: 501, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );

export const onRequestGet = ({ request, env }: Ctx) => {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return notConfigured();
  const url = new URL(request.url);
  if ((url.searchParams.get('provider') ?? 'github') !== 'github') return new Response('Unsupported provider', { status: 400 });

  const scope = /^[a-z_:, ]{1,60}$/.test(url.searchParams.get('scope') ?? '') ? url.searchParams.get('scope')! : 'repo';
  const state = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
  const target = new URL('https://github.com/login/oauth/authorize');
  target.search = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${url.origin}/api/callback`,
    scope,
    state,
    allow_signup: 'false',
  }).toString();

  return new Response(null, {
    status: 302,
    headers: {
      Location: target.href,
      'Set-Cookie': `gh_oauth_state=${state}; Path=/api/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
};
