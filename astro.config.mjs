// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import profile from './src/content/portfolio/main.json' with { type: 'json' };

export default defineConfig({
  site: profile.basics.url,
  trailingSlash: 'never',
  vite: { plugins: [tailwindcss()] },
});
