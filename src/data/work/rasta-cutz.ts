import type { CaseStudy } from './types';

// Copy and sources: docs/CONTENT.md §2 and §5 ([README][page source][commit]). Built on spec; page details are placeholders.
export const rastaCutz: CaseStudy = {
  slug: 'rasta-cutz',
  name: 'Rasta Cutz',
  titleLines: ['Rasta', 'Cutz'],
  tags: [
    { kind: 'ink', label: 'Pitch demo' },
    { kind: 'live', label: 'Live', dot: true },
    { kind: 'outline', label: '2026' },
  ],
  lede: 'A one-page site for a barbering and tattoo studio in Owerri, built on spec so the owner could see it before signing on. Plain HTML and CSS, WhatsApp booking, no framework. Details on the page are placeholders.',
  stack: 'HTML · CSS',

  outcome: 'A one-page site for a barbering and tattoo studio in Owerri, built on spec so the owner could see it before the shop signed on.',
  meta: [
    { label: 'Year', value: 'September 2026' },
    { label: 'Status', value: 'Live pitch demo' },
    { label: 'Stack', value: 'Plain HTML and CSS: one index.html and two images, no build step' },
    { label: 'Type', value: 'Fraunces, Inter and IBM Plex Mono, from Google Fonts' },
  ],
  links: [
    { label: 'Open the demo', href: 'https://rasta-cutz.vercel.app' },
    { label: 'GitHub', href: 'https://github.com/Gentle-Nuel/rasta-cutz' },
  ],

  problemTitle: 'The brief',
  problem: ['The shop had not signed on yet, so the site had to look finished on day one.'],

  decisions: [
    {
      title: 'One page, seven sections.',
      text: 'Hero, About, Services, VIP, Tattoo, Gallery and Contact.',
    },
    {
      title: 'Booking is a WhatsApp message.',
      text: 'Booking opens a prefilled WhatsApp message instead of using a booking backend.',
      reason: 'A pitch demo needs no server.',
    },
  ],

  shots: {
    lead: 'The home page on desktop and on a phone, as built.',
    stamp: 'Pitch demo · placeholder content',
    browserUrl: 'rasta-cutz.vercel.app',
    items: [
      {
        file: 'home',
        title: 'Home page',
        desktopAlt: 'Rasta Cutz pitch demo on desktop: a dark hero reading Sharp Cuts. Bold Ink., with Book Your Cut and See Services buttons.',
        mobileAlt: 'Rasta Cutz pitch demo on a phone: the same hero with a menu button and two booking buttons.',
      },
    ],
  },

  notes: [
    {
      title: 'What is placeholder',
      text: [
        'The address, phone or WhatsApp number, hours, Instagram handle, prices, gallery photos, both background images and the About copy are placeholders. The stamp on the screenshots says so.',
      ],
    },
  ],
};
