import type { CaseStudy } from './types';

// Copy and sources: docs/CONTENT.md §2 and §4 ([README][CV][commits][live app][Penpot]).
// Screen captions were checked against both images (see the note above each caption that goes past CONTENT.md).
export const batchkeeper: CaseStudy = {
  slug: 'batchkeeper',
  name: 'Batchkeeper',
  titleLines: ['Batch', 'keeper'],
  tags: [
    { kind: 'paper', label: 'Product' },
    { kind: 'live', label: 'Live', dot: true },
    { kind: 'outline', label: '2026' },
  ],
  lede: 'A mobile-first, offline-first production log for makers of soap, cosmetics and cleaning products. Log a batch, see what it cost, and see which products a shortage affects.',
  stack: 'React · TypeScript · Supabase · PWA',

  outcome:
    'A mobile-first production log for makers of soap, cosmetics and cleaning products: log a batch, see what it cost, and see which products a shortage affects. It keeps working offline.',
  meta: [
    { label: 'Year', value: 'August 2026 to present' },
    { label: 'Status', value: 'Live and being refined' },
    { label: 'Design', value: 'Penpot' },
    {
      label: 'Stack',
      value: 'React 19, TypeScript, Vite, Tailwind CSS, Zustand, Supabase (Postgres, Auth, Edge Functions), PWA on Vercel, offline sync, Web Push',
    },
  ],
  links: [
    { label: 'Open the app', href: 'https://batchkeeper.vercel.app' },
    { label: 'GitHub', href: 'https://github.com/Gentle-Nuel/batchkeeper' },
  ],

  problem: [
    'Makers of soap, cosmetics and cleaning products track production in notebooks, spreadsheets and memory.',
    'The owner works during production, often on a phone, and the internet is sometimes unreliable, so the app had to keep working without a connection.',
  ],

  decisions: [
    {
      title: 'Design before code.',
      text: 'A phone-size wireframe in Penpot, 35 screens, and a written handoff.',
    },
    {
      title: 'Offline first.',
      text: 'Entries are saved on the device and synced when it is back online. A Sync Status screen explains what is waiting.',
    },
    {
      title: 'One alert that names the products affected.',
      text: 'The low-stock alert reads like “Coconut oil: affects Soap Bar A, Body Cream”.',
      reason: 'Materials are shared across products.',
    },
    {
      title: 'Plan versus actual on every batch.',
      text: 'Planned quantities come from the recipe and cannot be edited. Actual is what you really used. The gap is recorded, not smoothed over.',
    },
    {
      title: 'The maker sets the status, not the calendar.',
      text: 'A batch stays Processing until you tap Mark as Ready, “whenever you’ve actually checked it”.',
    },
    {
      title: 'Regulatory data stays optional.',
      text: 'A NAFDAC status field exists but is kept out of the daily flow. The terms say it reflects what you entered, not a real registration.',
    },
    {
      title: 'One login, several businesses, kept apart.',
      text: 'Row-Level Security isolates each business’s data.',
    },
  ],

  comparison: {
    lead: 'The wireframe on the left, the built app on the right. Where the two differ, the caption says how.',
    pairs: [
      {
        slug: '01-production',
        title: 'Production',
        caption:
          'The wireframe’s low-stock card named the materials and counted the products affected (“3 products affected”). The build names the products each material affects. The wireframe’s batch cards showed yield (“48 / 50 units”); the build’s show status only. “Curing” became “Processing”.',
        wireframeAlt: 'Batchkeeper wireframe, Production screen: a low-stock card, a Log a Batch button and recent batches with their yield.',
        buildAlt: 'Batchkeeper build, Production screen: a low-stock alert naming the products affected, and recent batches with their status.',
      },
      {
        slug: '03-batch-detail',
        title: 'Batch detail',
        caption:
          'Same structure in both: yield and loss, materials used, cost. The build lays yield out as planned, actual and lost, and ends the cost breakdown with a cost per unit (₦442 on this batch). The wireframe gave the loss a reason (“Trimming & spillage”); the build screen shows the lost units without one. The two screens show different batches: Body Cream in the wireframe, Soap Bar A in the build.',
        wireframeAlt: 'Batchkeeper wireframe, Batch Detail screen for a Body Cream batch: yield and loss, materials used, and cost.',
        buildAlt: 'Batchkeeper build, Batch Detail screen for a Soap Bar A batch: planned, actual and lost units, materials, and a cost breakdown.',
      },
      {
        slug: '04-materials',
        title: 'Materials',
        caption: 'The build puts a Restock button on each row and marks low stock with a warning icon. The wireframe marked low stock in orange text.',
        wireframeAlt: 'Batchkeeper wireframe, Materials screen: five materials with stock levels, two marked low in orange.',
        buildAlt: 'Batchkeeper build, Materials screen: nine materials, each with a Restock button, low stock marked with a warning icon.',
      },
      {
        slug: '08-products-recipes',
        title: 'Products and recipes',
        caption: 'Nearly identical: the same three products, each with a registration status pill. The build drops the row chevrons. A screen that needed almost no change.',
        wireframeAlt: 'Batchkeeper wireframe, Products screen: three products, each with a registration status pill and a chevron.',
        buildAlt: 'Batchkeeper build, Products screen: the same three products with status pills and no chevrons.',
      },
      {
        slug: '10-reports',
        title: 'Reports',
        caption:
          'Both have period and product filters, a profit and loss overview and a chart. The build’s chart is a six-month trend, and this capture is filtered to one product (Soap Bar A). The loss state is in the full set below.',
        wireframeAlt: 'Batchkeeper wireframe, Reports screen: period and product filters, an overview, a profit chart and profit by product.',
        buildAlt: 'Batchkeeper build, Reports screen: filters, a P&L overview, a six-month trend chart and profit by product.',
      },
      {
        slug: '13-sync-offline-data',
        title: 'Sync and offline data',
        caption:
          'The wireframe shows the state with two items waiting. The build capture shows the state with nothing waiting: “All changes synced”, and no Pending list.',
        wireframeAlt: 'Batchkeeper wireframe, Sync Status screen: two items waiting to sync, a Sync Now button and a Pending list.',
        buildAlt: 'Batchkeeper build, Sync Status screen: All changes synced, a Sync Now button and a note on how offline mode works.',
      },
      {
        slug: '17-help-support',
        title: 'Help and support',
        caption: 'The wireframe’s FAQ accordion became its own screen in the build. Help and Support now holds the contact options and feedback.',
        wireframeAlt: 'Batchkeeper wireframe, Help & Support screen: contact options, an FAQ accordion and a feedback link.',
        buildAlt: 'Batchkeeper build, Help & Support screen: contact options and Send Feedback, with no FAQ on the page.',
      },
      {
        slug: '21-change-password',
        title: 'Change password',
        caption:
          'The wireframe showed a fixed hint (“Use at least 8 characters, including a number and a symbol”). The build has a show/hide icon on each field and a live checklist of the requirements.',
        wireframeAlt: 'Batchkeeper wireframe, Change Password screen: three password fields and a fixed hint about requirements.',
        buildAlt: 'Batchkeeper build, Change Password screen: show/hide icons on the fields and a requirements checklist.',
      },
      {
        slug: '22-all-batches',
        title: 'All batches',
        caption: '“Curing” became “Processing”, and the build added a Selling status.',
        wireframeAlt: 'Batchkeeper wireframe, All Batches screen: filter tabs for Curing, Ready and Sold Out, and a list of batches.',
        buildAlt: 'Batchkeeper build, All Batches screen: filter tabs for Processing, Ready and Sold Out, with Processing and Selling batches listed.',
      },
      {
        slug: '23-onboarding-1-of-3',
        title: 'Onboarding',
        caption: 'Carried over almost unchanged.',
        wireframeAlt: 'Batchkeeper wireframe, first onboarding screen: a worker with a loaded trolley, a headline and a Next button.',
        buildAlt: 'Batchkeeper build, first onboarding screen: the same illustration and text, and a Next button.',
      },
    ],
    // Every screen except 15-account, which shows a real email address (docs/ASSETS.md). Pairs match by slug.
    moreScreens: [
      { slug: '01-production', title: 'Production' },
      { slug: '02-log-a-batch', title: 'Log a batch' },
      { slug: '03-batch-detail', title: 'Batch detail' },
      { slug: '04-materials', title: 'Materials' },
      { slug: '05-more', title: 'More' },
      { slug: '06-log-a-sale', title: 'Log a sale' },
      { slug: '07-edit-material', title: 'Edit material' },
      { slug: '08-products-recipes', title: 'Products and recipes' },
      { slug: '09-product-detail', title: 'Product detail' },
      { slug: '10-reports', title: 'Reports, profit' },
      { slug: '10b-reports-loss-state', title: 'Reports, loss' },
      { slug: '11-settings', title: 'Settings' },
      { slug: '12-business-profile', title: 'Business profile' },
      { slug: '13-sync-offline-data', title: 'Sync and offline data' },
      { slug: '14-notifications', title: 'Notifications' },
      { slug: '16-delete-account', title: 'Delete account' },
      { slug: '17-help-support', title: 'Help and support' },
      { slug: '18-send-feedback', title: 'Send feedback' },
      { slug: '19-about', title: 'About' },
      { slug: '20-change-email', title: 'Change email' },
      { slug: '21-change-password', title: 'Change password' },
      { slug: '22-all-batches', title: 'All batches' },
      { slug: '23-onboarding-1-of-3', title: 'Onboarding 1 of 3' },
      { slug: '24-onboarding-2-of-3', title: 'Onboarding 2 of 3' },
      { slug: '25-onboarding-3-of-3', title: 'Onboarding 3 of 3' },
      { slug: '26-sign-up', title: 'Sign up' },
      { slug: '27-sign-in', title: 'Sign in' },
      { slug: '28-forgot-password', title: 'Forgot password' },
      { slug: '29-reset-password', title: 'Reset password' },
      { slug: '30-email-confirmed', title: 'Email confirmed' },
      { slug: '31-business-setup', title: 'Business setup' },
      { slug: '32-add-stock', title: 'Add stock' },
      { slug: '33-faq', title: 'FAQ' },
      { slug: '34-privacy-policy', title: 'Privacy policy' },
      { slug: '35-terms-of-service', title: 'Terms of service' },
    ],
  },

  notes: [
    {
      title: 'How it was checked',
      text: [
        'Usability testing on live devices found two friction points: no live password validation and no show/hide toggle on the password fields. Both were fixed the same day.',
        'A full audit of every screen against the wireframes followed. It added the missing empty states and confirmation dialogs.',
      ],
    },
  ],

  after: [
    { date: 'Sep 9–10, 2026', text: 'Free-tier caps on batches, restocks and products.' },
    { date: 'Sep 11, 2026', text: 'Categories and units opened up, a NAFDAC toggle, “Curing” renamed “Processing”, and unit-name fixes.' },
    { date: 'Sep 12, 2026', text: 'Fabricated seed data removed from the real Reports.' },
    {
      date: 'Sep 19, 2026',
      text: 'Focus narrowed to makers of soap, cosmetics and cleaning agents. Fluid motion: springs, draggable sheets and press feedback. Swipeable onboarding. A fix for a refocus that blanked the app and wiped form state.',
    },
  ],
};
