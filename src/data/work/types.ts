export interface WorkTag {
  kind: 'paper' | 'ink' | 'signal' | 'live' | 'amber' | 'alert' | 'outline';
  label: string;
  /** leading status dot, used for "Live" */
  dot?: boolean;
}

/** What the home page plates need. */
export interface WorkSummary {
  slug: string;
  name: string;
  tags: WorkTag[];
  lede: string;
  stack: string;
}

export interface FlowStep {
  kind: WorkTag['kind'];
  tag: string;
  text: string;
  /** dashed link into this step (used for "no signal" moments) */
  gap?: boolean;
}

export interface FlowDiagram {
  title: string;
  steps: FlowStep[];
}

/** One wireframe screen beside its built counterpart. Files pair by slug (see screens.ts). */
export interface ScreenPair {
  slug: string;
  title: string;
  caption: string;
  wireframeAlt: string;
  buildAlt: string;
}

export interface ScreenRef {
  slug: string;
  title: string;
}

/** One page of a website, shown as a desktop capture in a browser frame with the phone capture over its corner. */
export interface SiteShot {
  /** file prefix, e.g. 'home' for home-desktop-fold.png and home-mobile-fold.png */
  file: string;
  title: string;
  desktopAlt: string;
  mobileAlt: string;
}

/** One phone screenshot of a native or mobile-web app (no wireframe counterpart, no desktop capture). */
export interface AppScreen {
  /** path passed to eodeposImage(), e.g. 'app/admin-01-dashboard' */
  file: string;
  title: string;
  alt: string;
}

/** A full case study page at /work/<slug>. Every claim needs a source in docs/CONTENT.md. */
export interface CaseStudy extends WorkSummary {
  /** the name split into display lines, e.g. ['Batch', 'keeper'] */
  titleLines: string[];
  outcome: string;
  meta: { label: string; value: string }[];
  links: { label: string; href: string }[];
  /** heading for the opening section; defaults to "The problem" */
  problemTitle?: string;
  problem: string[];
  decisions: { title: string; text: string; reason?: string }[];
  flows?: FlowDiagram[];
  /** heading and lead line for the featured wireframe-vs-build section */
  comparison?: { lead: string; pairs: ScreenPair[]; moreScreens: ScreenRef[] };
  /** website captures. `stamp` is printed on every one, and `browserUrl` is the label in the frame */
  shots?: { lead: string; stamp: string; browserUrl: string; items: SiteShot[] };
  /** single-screen app captures, grouped (e.g. by role). No wireframe or desktop counterpart. */
  appScreens?: { lead: string; groups: { title: string; items: AppScreen[] }[] };
  /** short extra sections, each a heading and paragraphs (how it was checked, what is placeholder ...) */
  notes?: { title: string; text: string[] }[];
  /** dated changes after launch, when there are any */
  after?: { date: string; text: string }[];
}
