// One source for the facts every page repeats: the name, the three offers and their prices,
// and each hand-written page's search metadata. build.mjs renders heads, the offers block,
// JSON-LD, llms.txt and the sitemap from this file, so a price can only change here.
export const SITE = {
  name: 'We Keep You Spry',
  short: 'WKYS',
  url: 'https://wekeepyouspry.com',
  email: 'hello@wekeepyouspry.com',
  ogImage: 'https://wekeepyouspry.com/assets/og.png',
  logo: 'https://wekeepyouspry.com/assets/mark.svg',
  slogan: 'The world moves fast. We keep you Spry.',
};

// formValue is the <option> value the inquiry form sends. functions/api/inquiry.js and
// google-apps-script/Code.gs accept exactly these three strings, so they never change here;
// only the visible label does (scripts/form-values-test.mjs pins both sides).
export const OFFERS = [
  {
    id: 'assessment',
    name: 'Assessment',
    display: '$1,500',
    price: 1500,
    from: false,
    page: '/ai-assessment',
    label: 'Assessment · $1,500, credited to the install',
    formValue: 'Exploring options',
    tag: 'START HERE',
    note: 'Credited to the install if you go ahead.',
    summary: 'We review how your business runs today, the tools you already pay for and where your data lives, then hand you a written roadmap: what to install first, what to leave alone, and what it will cost.',
    includes: ['A review of your workflows, tools, accounts and data', 'A written roadmap with priorities, costs and timeline', 'A fixed quote for the 30-day install', 'The fee credited to the install if you go ahead'],
    cta: 'Start with the Assessment',
  },
  {
    id: 'install',
    name: '30-day install',
    display: '$10,000',
    price: 10000,
    from: false,
    page: '/30-day-ai-implementation',
    label: '30-day install · $10,000',
    formValue: '$10K initial installation',
    tag: '30 DAYS',
    note: 'One scoped installation, finished in 30 days.',
    summary: 'We set up the agreed systems in accounts you own, connect them to the tools you already use, test them, write the manuals and train your team, then hand everything over.',
    includes: ['Configured tools and agreed working systems', 'Assistants and automations scoped in the Assessment', 'Manuals and recorded walkthroughs for your team', 'Ownership transfer of every account and file'],
    cta: 'Ask about the 30-day install',
  },
  {
    id: 'engagement',
    name: '90-day engagement',
    display: 'from $25,000',
    price: 25000,
    from: true,
    page: '/90-day-ai-engagement',
    label: '90-day engagement · from $25,000',
    formValue: '$30K / 90-day private engagement',
    tag: '90 DAYS',
    note: 'The install, then two more months of building and handover.',
    summary: 'The 30-day install, followed by two more months of scoped builds, tests and practice, until your team runs every system without us.',
    includes: ['Everything in the 30-day install', 'A technology roadmap across the business', 'More scoped builds, tested and documented', 'An independent-operation review before handover'],
    cta: 'Ask about the 90-day engagement',
  },
];

export const offer = id => OFFERS.find(o => o.id === id);

// {assessment}, {install} and {engagement} in any page text become the offer's display price.
export const fillPrices = text => text.replace(/\{(assessment|install|engagement)\}/g, (_, id) => offer(id).display);

// Hand-written pages (root *.html). updated = the date its words last really changed.
export const PAGES = [
  { file: 'index.html', path: '/', title: 'AI Implementation for Your Business in 30 Days | We Keep You Spry', description: 'We Keep You Spry installs AI across your business in 30 days, trains your team and hands it over. Assessment $1,500, 30-day install $10,000.', updated: '2026-11-28', home: true, clarity: true, offers: true },
  { file: 'discover.html', path: '/discover', title: 'Find Your AI Starting Point in Two Minutes | We Keep You Spry', description: 'Answer three questions and see which We Keep You Spry track fits: what to build first, how fast, and which offer it points to. Nothing is sent.', updated: '2026-11-28' },
  { file: 'privacy.html', path: '/privacy', title: 'Privacy Notice | We Keep You Spry', description: 'How We Keep You Spry handles what you send through the inquiry form, which analytics the site uses, and how to ask for your information to be deleted.', updated: '2026-11-28' },
  { file: 'portal.html', path: '/portal', title: 'Illustrative Client Portal Demo | We Keep You Spry', description: 'An illustrative demo of the We Keep You Spry client portal: installed systems, guides and next steps. No login, client data or live features.', updated: '2026-11-28', noindex: true },
  { file: 'thanks.html', path: '/thanks', title: 'Thank You | We Keep You Spry', description: 'Your inquiry to We Keep You Spry has been received. We will reply by email about whether the Assessment is the right first step for you.', updated: '2026-11-28', noindex: true },
  { file: '404.html', path: null, title: 'Page Not Found | We Keep You Spry', description: 'This page does not exist on the We Keep You Spry site. Go back to the home page to see the offers and send an inquiry.', updated: '2026-11-28', noindex: true },
];

// Order of the footer link columns; every landing page appears in exactly one.
export const FOOTER_GROUPS = [
  { name: 'Who it is for', kind: 'niche' },
  { name: 'Offers', kind: 'offer' },
  { name: 'Questions', kind: 'question' },
];
