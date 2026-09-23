import { defineConfig } from 'astro/config';
import { buildServiceWorker } from './tools/build-sw.mjs';

// `site` is set once the domain is known (canonical URLs, sitemap, OG).
export default defineConfig({
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
  integrations: [
    {
      name: 'service-worker',
      hooks: {
        'astro:build:done': ({ dir }) => buildServiceWorker(dir),
      },
    },
  ],
});
