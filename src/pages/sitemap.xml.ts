import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/business.js';

/*
  One page, so this is short — but a sitemap is how Google is told the canonical
  address of the site rather than left to infer it, and it is the file Search
  Console asks for on day one.

  lastmod is the build date: the content only changes when the site is rebuilt.
*/
const pages = ['/'];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map(
      (path) => `  <url>
    <loc>${new URL(path, SITE_URL).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`
    )
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
