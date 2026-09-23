import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { buildServiceWorker } from './tools/build-sw.mjs';

// Temporary: the Vercel-assigned URL, until a custom domain is set (BUILD-PLAN §11). Every page
// still carries noindex (removed only at launch), so this doesn't put the temporary URL in search
// results — it just makes canonical links, the sitemap and OG images resolve to a real address.
export default defineConfig({
  site: 'https://emmanuel-mbaeri-portfolio.vercel.app',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
  integrations: [
    sitemap(),
    {
      name: 'service-worker',
      hooks: {
        'astro:build:done': ({ dir }) => buildServiceWorker(dir),
      },
    },
  ],
});
