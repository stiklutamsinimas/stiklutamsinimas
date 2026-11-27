/**
 * GitHub: prisijungimo patikra ir failų įrašymas į svetainės saugyklą (vienu commit'u).
 * Naudoja PRISIJUNGUSIO žmogaus GitHub raktą (iš /admin prisijungimo) – serveryje jokių raktų nesaugoma.
 * Įrašyti gali tik tie, kurie turi teisę keisti saugyklą (savininkas ir pakviesti bendradarbiai).
 */

export const REPO = 'stiklutamsinimas/stiklutamsinimas';
export const BRANCH = 'main';
const API = 'https://api.github.com';

export const ghHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'stiklutamsinimas.eu',
});

export const bearer = (request: Request) => request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '').trim() || '';

/** Ar raktas galioja ir ar jo savininkas gali keisti saugyklą */
export async function checkPush(token: string): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (!token) return { ok: false, status: 401, error: 'Prisijunkite su GitHub.' };
  const r = await fetch(`${API}/repos/${REPO}`, { headers: ghHeaders(token) });
  if (r.status === 401) return { ok: false, status: 401, error: 'Prisijungimas nebegalioja – prisijunkite iš naujo.' };
  if (!r.ok) return { ok: false, status: 403, error: 'Ši GitHub paskyra neturi prieigos prie svetainės.' };
  const repo = (await r.json()) as { permissions?: { push?: boolean } };
  if (!repo.permissions?.push) return { ok: false, status: 403, error: 'Ši GitHub paskyra negali keisti svetainės.' };
  return { ok: true };
}

export async function fileExists(token: string, path: string): Promise<boolean> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${encodeURI(path)}?ref=${BRANCH}`, { headers: ghHeaders(token) });
  return r.status === 200;
}

export type NewFile = { path: string; text: string } | { path: string; base64: string };

async function gh<T>(token: string, path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const r = await fetch(`${API}/repos/${REPO}${path}`, {
    method: init?.method ?? 'GET',
    headers: { ...ghHeaders(token), ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  if (!r.ok) throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json() as Promise<T>;
}

/** Tuščias commit'as – tik kad Cloudflare perkurtų svetainę (kai ankstesni buvo su [CF-Pages-Skip]) */
export async function emptyCommit(token: string, message: string): Promise<string> {
  const ref = await gh<{ object: { sha: string } }>(token, `/git/ref/heads/${BRANCH}`);
  const parent = await gh<{ tree: { sha: string } }>(token, `/git/commits/${ref.object.sha}`);
  const commit = await gh<{ sha: string }>(token, '/git/commits', { method: 'POST', body: { message, tree: parent.tree.sha, parents: [ref.object.sha] } });
  await gh(token, `/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: { sha: commit.sha, force: false } });
  return commit.sha;
}

/** Įrašo kelis failus vienu commit'u į main šaką. Jei kas nors tuo metu įrašė kitą pakeitimą – bando dar kartą. */
export async function commitFiles(token: string, files: NewFile[], message: string): Promise<string> {
  // Nuotraukos – kaip „blob“ (dvejetainiai duomenys), tekstas – tiesiai medyje
  const tree = await Promise.all(
    files.map(async (f) =>
      'base64' in f
        ? { path: f.path, mode: '100644', type: 'blob', sha: (await gh<{ sha: string }>(token, '/git/blobs', { method: 'POST', body: { content: f.base64, encoding: 'base64' } })).sha }
        : { path: f.path, mode: '100644', type: 'blob', content: f.text },
    ),
  );
  for (let attempt = 0; attempt < 2; attempt++) {
    const ref = await gh<{ object: { sha: string } }>(token, `/git/ref/heads/${BRANCH}`);
    const parent = await gh<{ tree: { sha: string } }>(token, `/git/commits/${ref.object.sha}`);
    const newTree = await gh<{ sha: string }>(token, '/git/trees', { method: 'POST', body: { base_tree: parent.tree.sha, tree } });
    const commit = await gh<{ sha: string }>(token, '/git/commits', { method: 'POST', body: { message, tree: newTree.sha, parents: [ref.object.sha] } });
    try {
      await gh(token, `/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: { sha: commit.sha, force: false } });
      return commit.sha;
    } catch (e) {
      if (attempt === 1) throw e;
    }
  }
  throw new Error('Nepavyko įrašyti');
}
