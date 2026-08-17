// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import { SITE_URL } from './src/config/business.js';

export default defineConfig({
  site: SITE_URL,
  vite: {
    plugins: [tailwindcss()],
  },
});
