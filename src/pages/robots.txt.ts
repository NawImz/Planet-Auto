import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/business.js';

/*
  Generated rather than kept as a static file so the sitemap line cannot drift
  away from SITE_URL when the domain changes.
*/
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap.xml', SITE_URL).href}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
