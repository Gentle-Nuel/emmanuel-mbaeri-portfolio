import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { buildServiceWorker } from './tools/build-sw.mjs';

// The free Vercel address for now; switch to a custom domain later if one is bought.
export default defineConfig({
  site: 'https://emmanuelmbaeri.vercel.app',
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
