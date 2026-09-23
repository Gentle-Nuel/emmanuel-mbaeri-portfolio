// Runs after `astro build` (wired in astro.config.mjs's astro:build:done hook).
// Fills the placeholders in dist/sw.js: a cache name hashed from the precache list,
// and the list itself (the four case-study routes and home, their CSS, the two
// preloaded Latin font files, and the images in the hero + first work plate — the
// content visible above the fold before any scrolling). No image beyond that is
// precached: the rest of each project's screens load and cache lazily on first visit.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import path from 'node:path';

const PAGES = ['index.html', 'work/eodepos/index.html', 'work/batchkeeper/index.html', 'work/rasta-cutz/index.html', 'work/wattforge-solar/index.html'];

function routeFor(page) {
  const trimmed = page.replace(/index\.html$/, '').replace(/\/$/, '');
  return '/' + trimmed;
}

function extractAssetHrefs(html) {
  const urls = new Set();
  for (const match of html.matchAll(/(?:href|src)="(\/_astro\/[^"]+)"/g)) urls.add(match[1]);
  return urls;
}

export async function buildServiceWorker(distDirUrl) {
  const dist = fileURLToPath(distDirUrl);
  const urls = new Set();

  for (const page of PAGES) {
    let html;
    try {
      html = await readFile(path.join(dist, page), 'utf8');
    } catch {
      continue; // page not built, e.g. removed at launch
    }
    urls.add(routeFor(page));

    // CSS and font preloads apply to every page (Base.astro is shared).
    for (const match of html.matchAll(/<link[^>]+rel="(?:stylesheet|preload)"[^>]+href="(\/_astro\/[^"]+)"/g)) {
      urls.add(match[1]);
    }
  }

  // Above-the-fold images: the hero (text only, no raster images) plus the first
  // work plate, bounded to that one <article> so the rest of the work section and
  // every case-study screen gallery is excluded.
  const home = await readFile(path.join(dist, 'index.html'), 'utf8').catch(() => '');
  const heroStart = home.indexOf('<section class="hero"');
  const firstPlateEnd = home.indexOf('</article>', heroStart);
  if (heroStart !== -1 && firstPlateEnd !== -1) {
    const aboveFold = home.slice(heroStart, firstPlateEnd);
    for (const href of extractAssetHrefs(aboveFold)) urls.add(href);
  }

  const sorted = [...urls].sort();
  const hash = createHash('sha1').update(sorted.join('\n')).digest('hex').slice(0, 8);

  const swPath = path.join(dist, 'sw.js');
  const sw = (await readFile(swPath, 'utf8'))
    .replace('__CACHE_NAME__', `stockroom-${hash}`)
    .replace('/* __PRECACHE_URLS__ */ []', JSON.stringify(sorted));
  await writeFile(swPath, sw);
}
