import type { CaseStudy } from './types';

// Copy and sources: docs/CONTENT.md §2 and §6 ([README][files][theme-init.js][site]). A concept: fictional business,
// stock photography. Never name the company it began as a pitch to.
// Design rationale (palette, theme, type) is sourced from that original site's own CSS comments, checked Sep 22 —
// see docs/ASSETS.md §5. That source lives outside this repo; do not add its path or the real name here.
export const wattforgeSolar: CaseStudy = {
  slug: 'wattforge-solar',
  name: 'Wattforge Solar',
  titleLines: ['Watt', 'forge', 'Solar'],
  tags: [
    { kind: 'signal', label: 'Concept' },
    { kind: 'outline', label: '2026' },
  ],
  lede: 'A seven-page marketing site for a fictional solar and electrical installer, built as a portfolio piece. Plain HTML, CSS and about 7 KB of JavaScript, with a light and dark theme and self-hosted fonts.',
  stack: 'HTML · CSS · JavaScript',

  outcome: 'A seven-page marketing site for a fictional solar and electrical installer, built as a portfolio piece in plain HTML, CSS and about 7 KB of JavaScript.',
  meta: [
    { label: 'Year', value: '2026' },
    { label: 'Status', value: 'Concept, not deployed' },
    { label: 'Pages', value: 'Home, Services, Our work, How it works, Contact, Privacy, Terms' },
    { label: 'Stack', value: 'HTML, CSS and about 7 KB of JavaScript. No build step or framework.' },
    { label: 'Type', value: 'Big Shoulders Display, Work Sans and IBM Plex Mono, self-hosted' },
    { label: 'Photos', value: 'Stock photography' },
  ],
  links: [{ label: 'GitHub', href: 'https://github.com/Gentle-Nuel/wattforge-solar' }],

  problemTitle: 'Where it came from',
  problem: [
    'It began as a pitch to a real company. For this portfolio it was rebranded as a fictional business, so nothing on the site describes a real one.',
  ],

  decisions: [
    {
      title: 'The whole page argues its own point.',
      text: 'Every section is built as a single evidence document instead of a stack of marketing sections.',
      reason: 'It has to make the same case as the headline: “Solar you can verify, not just trust.”',
    },
    {
      title: 'A palette built from real materials.',
      text: 'Charcoal, copper and porcelain, mapped to the trade itself: copper for wiring, porcelain for insulators, charcoal for painted enclosure metal. Copper stays the one constant accent across both themes.',
    },
    {
      title: 'Light and dark are two real places.',
      text: 'Dark is the inside of a breaker box; light is the installation itself in daylight. The toggle switch is styled after a physical switch used elsewhere on the page: flip it and the whole site’s lights change.',
    },
    {
      title: 'Type assigned by role, not by look.',
      text: 'Big Shoulders Display carries the headings, Work Sans carries the reading, and IBM Plex Mono is kept for spec labels and the scrolling data strip, so it reads like an equipment nameplate. All three are self-hosted.',
    },
    {
      title: 'Small physical details, never gloss.',
      text: 'A faint noise texture and a top-down lighting sheen simulate painted metal that is never quite flat. Both are switched off over the real photography, so it never gets an artificial tint.',
    },
    {
      title: 'Photos below the fold load lazily.',
      text: 'Only the hero image is loaded eagerly.',
    },
    {
      title: 'Search plumbing in place.',
      text: 'A sitemap, robots.txt, llms.txt, and canonical and social tags.',
    },
    {
      title: 'A WhatsApp call to action on every page.',
      text: 'Get a free estimate, WhatsApp Us and a Chat on WhatsApp bar on phones.',
    },
  ],

  shots: {
    lead: 'Three of the seven pages, each on desktop and on a phone.',
    stamp: 'Concept · fictional business',
    browserUrl: 'concept · not deployed',
    items: [
      {
        file: 'home',
        title: 'Home',
        desktopAlt: 'Wattforge Solar concept site on desktop: a hero over stock photography of solar panels, with Get a free estimate and See our work buttons.',
        mobileAlt: 'Wattforge Solar concept site on a phone: the hero headline over the same panel photograph, with a Chat on WhatsApp bar.',
      },
      {
        file: 'services',
        title: 'Services',
        desktopAlt: 'Wattforge Solar concept site, Services page on desktop: a What we install heading and the first service, solar power systems.',
        mobileAlt: 'Wattforge Solar concept site, Services page on a phone: the same heading and first service, with a Chat on WhatsApp bar.',
      },
      {
        file: 'how-it-works',
        title: 'How it works',
        desktopAlt: 'Wattforge Solar concept site, How it works page on desktop: a six-step process, starting with Enquiry and Site assessment.',
        mobileAlt: 'Wattforge Solar concept site, How it works page on a phone: the process heading and the first step, Enquiry.',
      },
    ],
  },

  notes: [
    {
      title: 'What is fictional',
      text: [
        'Every company claim, project and testimonial on the site is fictional, and the photography is stock.',
        'The page copy speaks as a real installer, for example “Real completed installs” on the home page. That copy belongs to the fictional business.',
        'The Our work page is left out of the screenshots here: its named projects and specs are invented but read as real.',
      ],
    },
  ],
};
