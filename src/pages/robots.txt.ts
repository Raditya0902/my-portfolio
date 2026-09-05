import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
export const GET: APIRoute = async () => {
  const entry = await getEntry('portfolio', 'main');
  if (!entry) throw new Error('Missing profile for sitemap origin');
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', entry.data.basics.url).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
