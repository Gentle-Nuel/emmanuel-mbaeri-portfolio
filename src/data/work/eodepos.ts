import type { CaseStudy } from './types';

// Copy and sources: docs/CONTENT.md §2 and §3 ([README][CV][commits]).
// Screens: docs/ASSETS.md §3. Redaction policy (corrected Sep 22): products, prices, stock and staff
// names/emails are shown as-is; only the store's own contact details are blurred. Every alt text below
// was checked against the actual (recaptured) image, not the old notes. Three screens also carry a second,
// hand-applied blur over personal emails the capture script doesn't cover — see screens.ts and ASSETS.md §3.
export const eodepos: CaseStudy = {
  slug: 'eodepos',
  name: 'EODEPos',
  titleLines: ['EODE', 'Pos'],
  tags: [
    { kind: 'ink', label: 'Client work' },
    { kind: 'live', label: 'Live', dot: true },
    { kind: 'outline', label: '2026' },
  ],
  lede: 'Point of sale and stock control for a drinks retailer in Owerri. Sales keep working when the network drops, and stock only goes up after an admin signs off.',
  stack: 'React Native · Expo · Supabase · Postgres · Vercel',

  outcome: 'A point-of-sale and stock system that keeps selling when the network drops, and only lets stock rise after an admin signs off.',
  meta: [
    { label: 'Client', value: 'Ebenezer-Online Digital Enterprise, a drinks and spirits retailer in Owerri, Imo State' },
    { label: 'Year', value: 'June 2026 to present' },
    { label: 'Status', value: 'In active daily use by the client' },
    {
      label: 'Stack',
      value:
        'React Native, Expo SDK 56, React Native Web, React Navigation, Supabase (Auth, Postgres, Edge Functions, Storage), Row-Level Security, AsyncStorage, NetInfo, Expo Notifications, Expo Print and Sharing, Secure Store, Vercel, Expo Application Services',
    },
  ],
  // The live system is private, so there is no "open the app" link.
  links: [{ label: 'GitHub', href: 'https://github.com/Gentle-Nuel/EODEPos' }],

  problem: [
    'The shop recorded sales and stock by hand. A shop’s connection can drop, so the system had to keep working offline.',
    'Stock counts also had to be trustworthy: a delivery that has not been checked must not quietly raise the numbers.',
  ],

  decisions: [
    {
      title: 'Sales are saved on the phone first.',
      text: 'A local queue (AsyncStorage) syncs when the signal returns, and the app shows an offline indicator.',
      reason: 'Retail cannot depend on connectivity.',
    },
    {
      title: 'Stock rules live in the database.',
      text: 'Postgres triggers subtract stock on a sale and add it on an approved delivery.',
      reason: 'Critical changes stay tied to database state, not to one client.',
    },
    {
      title: 'Deliveries are never taken on trust.',
      text: 'An attendant logs a delivery, an admin verifies it, and stock rises only on approval. A rejection carries a reason.',
      reason: 'Unverified deliveries must not silently inflate stock.',
    },
    {
      title: 'Privileged actions stay off the client.',
      text: 'Attendant account operations run in Edge Functions, the service key is never on the device, and Row-Level Security limits access by role.',
    },
    {
      title: 'Two roles, two workflows.',
      text: 'Admin and Attendant have separate navigation and permissions.',
    },
  ],

  flows: [
    {
      title: 'A sale, with no signal',
      steps: [
        { kind: 'ink', tag: 'Attendant', text: 'Records the sale on the phone.' },
        { kind: 'outline', tag: 'Offline', text: 'The sale waits in a local queue.', gap: true },
        { kind: 'live', tag: 'Synced', text: 'The queue flushes when the signal returns.' },
        { kind: 'signal', tag: 'Database', text: 'A Postgres trigger takes the items out of stock.' },
      ],
    },
    {
      title: 'A delivery, never taken on trust',
      steps: [
        { kind: 'ink', tag: 'Attendant', text: 'Logs an incoming delivery.' },
        { kind: 'amber', tag: 'Pending', text: 'Stock does not change yet.' },
        { kind: 'ink', tag: 'Admin', text: 'Verifies it, or rejects it with a reason.' },
        { kind: 'live', tag: 'Verified', text: 'Only now does stock go up.' },
      ],
    },
  ],

  appScreens: {
    lead: 'Real screens from the client’s live store, captured on my own test accounts, one role at a time. Products, prices, stock and staff details are shown as they are. I blurred the store’s own contact details, plus a second personal email of mine and an attendant’s that the app happened to show.',
    groups: [
      {
        title: 'Android app',
        items: [
          {
            file: 'android-splash-2026-08-26',
            title: 'Splash screen',
            alt: 'EODEPos Android app splash screen: the EODE badge on a navy background, with Point of Sale and a version number.',
          },
          {
            file: 'android-sign-in-2026-08-26',
            title: 'Sign in',
            alt: 'EODEPos Android app sign-in screen: an Attendant and Admin toggle above blank email and password fields.',
          },
        ],
      },
      {
        title: 'Admin',
        items: [
          {
            file: 'app/admin-01-dashboard',
            title: 'Dashboard',
            alt: 'EODEPos admin Dashboard: today’s revenue, sales and low-stock summary cards, low-stock alerts by product name, and recent sales with their amounts and times.',
          },
          {
            file: 'app/admin-02-inventory',
            title: 'Inventory',
            alt: 'EODEPos admin Inventory screen: a full product list filtered by All, Low and Out, each row showing its name, price and stock level.',
          },
          {
            file: 'app/admin-03-deliveries',
            title: 'Deliveries',
            alt: 'EODEPos admin Deliveries screen: a list of deliveries, each showing the product, quantity and date, all marked Approved.',
          },
          {
            file: 'app/admin-04-settings',
            title: 'Settings',
            alt: 'EODEPos admin Settings screen: a profile card with the login email blurred, and a menu for Store Details, Manage Attendants, Notifications, Export Data and Admin Account.',
          },
          {
            file: 'app/admin-05-store-details',
            title: 'Store details',
            alt: 'EODEPos admin Store Details screen: the business name and tagline shown, with the address, phone number and contact email blurred for privacy.',
          },
          {
            file: 'app/admin-06-manage-attendants',
            title: 'Manage attendants',
            alt: 'EODEPos admin Manage Attendants screen: two attendants with their names, join dates and sales counts, with one attendant’s personal email blurred.',
          },
          {
            file: 'app/admin-07-notifications',
            title: 'Notifications',
            alt: 'EODEPos admin Notifications screen: delivery, low-stock and daily sales-summary alerts, each naming the product or the day’s total.',
          },
          {
            file: 'app/admin-08-export-data',
            title: 'Export data',
            alt: 'EODEPos admin Export Data screen: a date range and CSV export for a sales summary or an itemized report.',
          },
          {
            file: 'app/admin-09-admin-account',
            title: 'Admin account',
            alt: 'EODEPos admin Account screen: display name and change-password fields, with the login email blurred for privacy.',
          },
        ],
      },
      {
        title: 'Attendant',
        items: [
          {
            file: 'app/attendant-01-new-sale',
            title: 'New sale',
            alt: 'EODEPos attendant New Sale screen: a searchable, alphabetised product list, each row showing its name, price and stock level, with an Add button.',
          },
          {
            file: 'app/attendant-05-checkout',
            title: 'Checkout',
            alt: 'EODEPos attendant checkout screen: a two-item cart with its total, split between Cash and Transfer, and a Charge button not yet tapped.',
          },
          {
            file: 'app/attendant-02-log-delivery',
            title: 'Log delivery',
            alt: 'EODEPos attendant Log Delivery screen: an empty form for product, quantity and a note, pending admin approval.',
          },
          {
            file: 'app/attendant-03-sales-history-today',
            title: 'Sales history',
            alt: 'EODEPos attendant Sales History screen, filtered to Today, with no sales yet recorded.',
          },
          {
            file: 'app/attendant-04-profile',
            title: 'Profile',
            alt: 'EODEPos attendant Profile screen: the attendant’s name and email, and a Sign Out button.',
          },
        ],
      },
    ],
  },

  after: [
    {
      date: 'Jul 1, 2026',
      text: 'An admin can delete a duplicate sale, and a database trigger restores stock for every line. Products can share a price through a price-group tag that a Postgres trigger keeps in sync. Receipts show the store email.',
    },
    { date: 'Aug 14, 2026', text: 'Low and Out stock filter chips, with live counts, on the admin Inventory screen.' },
    {
      date: 'Aug 26, 2026',
      text: 'An Android build through Expo Application Services (an APK preview profile), an EODE app icon generated by script, and a fix for the tab bar overlapping Android’s system bar.',
    },
    {
      date: 'Aug 26, 2026',
      text: 'Attendants are now deactivated, not deleted. A hard delete failed on a foreign-key rule once an attendant had logged a sale, so the login is banned and the profile marked inactive, which keeps past sales attributed.',
    },
  ],
};
