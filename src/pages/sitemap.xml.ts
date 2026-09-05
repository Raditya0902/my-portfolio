import type { APIRoute } from 'astro';
import { getPortfolio } from '../lib/content';
export const GET: APIRoute = async () => {
  const { profile, featured } = await getPortfolio();
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  const routes = ['/', '/projects', ...featured.map((project) => `/projects/${project.slug}`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${escape(new URL(route, profile.basics.url).href)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
