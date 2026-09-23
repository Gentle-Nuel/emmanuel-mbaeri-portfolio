// Batchkeeper screen images, paired by filename: wireframe/<slug>.png and app/<slug>.png.
//
// 15-account is excluded on purpose: the app capture shows a real email address (docs/ASSETS.md).
// Everything matched here is emitted into dist/, used or not, so the exclusion has to be in the glob itself.
type Kind = 'wireframe' | 'app';
type Mod = { default: ImageMetadata };

const files: Record<Kind, Record<string, Mod>> = {
  wireframe: import.meta.glob<Mod>(['../../assets/batchkeeper/wireframe/*.png', '!../../assets/batchkeeper/*/15-account.png'], { eager: true }),
  app: import.meta.glob<Mod>(['../../assets/batchkeeper/app/*.png', '!../../assets/batchkeeper/*/15-account.png'], { eager: true }),
};

// Website captures for Rasta Cutz and Wattforge Solar. Wattforge's "our-work" captures show fictional named
// projects that read as real, so they are excluded here and never reach dist/ (docs/ASSETS.md).
const siteFiles: Record<string, Mod> = import.meta.glob<Mod>(
  ['../../assets/rasta-cutz/*.png', '../../assets/wattforge-solar/*.png', '!../../assets/wattforge-solar/our-work-*.png'],
  { eager: true },
);

/** e.g. siteImage('rasta-cutz', 'home-desktop-fold') */
export function siteImage(project: string, name: string): ImageMetadata {
  const mod = siteFiles[`../../assets/${project}/${name}.png`];
  if (!mod) throw new Error(`Missing or excluded site capture: ${project}/${name}`);
  return mod.default;
}

// EODEPos: the Android splash/sign-in and the web-app screens. Redaction policy (docs/ASSETS.md §3,
// corrected Sep 22): products, prices, stock and staff names/emails are shown as-is; only the store's
// own contact details are blurred, done live in the app before the screenshot is taken. Three files —
// admin-04-settings, admin-06-manage-attendants, admin-09-admin-account — needed one more redaction the
// capture script doesn't do: the user's own second email and an attendant's personal email. Those three
// working copies in src/assets/eodepos/app/ are edited (Gaussian-blurred over just that text) and
// intentionally differ from the untouched originals in assets-src/ — see ASSETS.md §3 for exact boxes.
const eodeposFiles: Record<string, Mod> = import.meta.glob<Mod>(['../../assets/eodepos/*.png', '../../assets/eodepos/app/*.png'], {
  eager: true,
});

/** e.g. eodeposImage('android-splash-2026-08-26') or eodeposImage('app/admin-01-dashboard') */
export function eodeposImage(name: string): ImageMetadata {
  const mod = eodeposFiles[`../../assets/eodepos/${name}.png`];
  if (!mod) throw new Error(`Missing or excluded EODEPos capture: ${name}`);
  return mod.default;
}

export function screenImage(kind: Kind, slug: string): ImageMetadata {
  const mod = files[kind][`../../assets/batchkeeper/${kind}/${slug}.png`];
  if (!mod) throw new Error(`Missing or excluded Batchkeeper ${kind} image: ${slug}`);
  return mod.default;
}
