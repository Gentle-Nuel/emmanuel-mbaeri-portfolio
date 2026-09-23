/**
 * Single source of truth for personal facts. Pages read from here.
 * To update after a CV change: replace public/Emmanuel_Mbaeri_CV.pdf, then ask Claude to
 * "sync my CV" (it compares the PDF with this file and shows the differences first).
 */
export const profile = {
  name: 'Emmanuel Mbaeri',
  legalName: 'Mbaeri Emmanuel Chidera',
  role: 'Creative technologist',
  lede: 'I design and build web and mobile software, from the first wireframe to the deployed app.',
  timezone: 'UTC+1',
  remote: 'Working remotely with clients worldwide',
  availability: 'Available',
  summary:
    'I am a creative technologist. I finished a B.Tech in Computer Science at the Federal University of Technology Owerri in 2026, and since 2024 I have been freelancing: designing and building web and mobile apps end to end, from requirements through deployment. I work remotely with clients worldwide, and I am open to full-time and part-time roles as well as freelance projects.',

  contact: {
    email: 'embaeri@gmail.com',
    whatsapp: {
      display: '+234 906 141 8974',
      href: 'https://wa.me/2349061418974?text=Hi%20Emmanuel%2C%20I%27d%20like%20to%20talk%20about%20a%20project.',
    },
    x: { handle: '@gentle_nuel_', href: 'https://x.com/gentle_nuel_' },
    github: { handle: 'Gentle-Nuel', href: 'https://github.com/Gentle-Nuel' },
  },

  cv: {
    href: '/Emmanuel_Mbaeri_CV.pdf',
    downloadName: 'Emmanuel-Mbaeri-CV.pdf',
    updated: '2026-09-08',
  },

  education: [
    {
      what: 'B.Tech, Computer Science',
      where: 'Federal University of Technology Owerri (FUTO)',
      years: '2021 – 2026',
    },
  ],

  // Grouped for scanning. Sourced from the Sep 2026 Full-Stack CV, plus design skills from the general CV.
  skills: [
    { group: 'Languages', items: ['JavaScript (ES6+)', 'TypeScript', 'HTML', 'CSS'] },
    { group: 'Frontend', items: ['React', 'React Native (Expo)', 'React Router', 'Zustand', 'Tailwind CSS'] },
    {
      group: 'Backend and data',
      items: ['Node.js', 'Express.js', 'RESTful APIs', 'PostgreSQL', 'Supabase (Auth, Edge Functions)'],
    },
    { group: 'Auth and security', items: ['Role-based access control', 'Row-Level Security', 'JWT', 'Supabase Auth'] },
    {
      group: 'Workflow and deployment',
      items: ['Git', 'Feature branches and pull requests', 'SQL migrations', 'Vercel', 'Netlify'],
    },
    {
      group: 'Design',
      items: ['UI/UX design', 'Figma', 'Penpot', 'Graphic design', 'Branding', 'Canva', 'CorelDraw'],
    },
  ],
} as const;
