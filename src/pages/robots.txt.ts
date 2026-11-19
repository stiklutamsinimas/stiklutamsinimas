import type { APIRoute } from 'astro';

/**
 * Leidžiame visiems paieškos ir dirbtinio intelekto (AI) robotams skaityti svetainę –
 * kad ChatGPT, Google AI apžvalgos, Gemini, Copilot, Perplexity, Claude ir kt.
 * galėtų rasti ir cituoti stiklutamsinimas.eu. Draudžiamas tik /admin.
 */
const aiBots = [
  // OpenAI (ChatGPT paieška ir naudotojų užklausos)
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  // Google (Gemini, AI apžvalgos naudoja Googlebot)
  'Googlebot',
  'Google-Extended',
  // Microsoft Copilot (Bing)
  'Bingbot',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Anthropic (Claude)
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  // Apple (Siri, Apple Intelligence)
  'Applebot',
  'Applebot-Extended',
  // Kiti AI asistentai
  'DuckAssistBot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'Amazonbot',
  'MistralAI-User',
  'CCBot',
];

export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      '# stiklutamsinimas.eu – paieškos ir AI robotai laukiami.',
      `# Santrauka dirbtiniam intelektui: ${new URL('/llms.txt', site).href}`,
      '',
      ...aiBots.map((bot) => `User-agent: ${bot}`),
      'Allow: /',
      'Disallow: /admin',
      '',
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      '',
      `Sitemap: ${new URL('/sitemap-index.xml', site).href}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
