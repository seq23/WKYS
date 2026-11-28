// Comparison pages: who offers AI implementation help in one niche, described only from each
// firm's own website. Every fact carries its source; scripts/check-pages.mjs fails a fact whose
// source is not on that firm's own site, a competitor named in a title, H1, slug or description,
// "best" or "top" in them, and a page that does not say in its first 100 words that we wrote it.
// Firms are listed alphabetically; we do not rank them. Criteria come from the fan-out log
// (~/Work/tasks/wkys-fanout-log.md, 28 Nov 2026), not from our own selling points.
const D = '2026-11-28';
const US = 'https://wekeepyouspry.com';

const wkys = facts => ({ name: 'We Keep You Spry', us: true, kind: 'Install partner', url: US + '/', checked: D, facts });

export default [
  {
    slug: 'ai-implementation-partners-for-bail-bond-agencies', kind: 'comparison', nav: 'AI help for bail bond agencies', published: D, updated: D,
    title: 'AI Implementation Partners for Bail Bond Agencies, Compared | We Keep You Spry',
    description: 'The kinds of AI help a bail bond agency can get, from bail phone agents to install partners, with each firm described from its own website and the questions to ask.',
    eyebrow: 'COMPARE',
    h1: 'AI implementation partners for bail bond agencies',
    answer: 'A bail bond agency can get AI help in four forms: phone agents built for bail, AI platforms it sets up itself, custom software developers and install partners. This page is written by We Keep You Spry, one of the firms listed. Every firm, us included, is described only from its own website.',
    sections: [
      { h2: 'What should an agency check before choosing?', p: ['These questions come from what search engines and buyer guides raised when we asked about AI for bail agencies on 28 November 2026. Ask them of every firm below, including us.'], list: { type: 'ol', items: [
        'Does it sell a ready product, build something custom, or set up tools you choose? Each suits a different agency.',
        'Does it work with the bail software and the phone number you already use?',
        'How fast does an urgent or sensitive call reach a licensed agent?',
        'Where is defendant and indemnitor information stored, and is the account in your agency\'s name?',
        'Which of your state\'s rules does it write down for your counsel to review before anything goes live?',
      ] } },
      { h2: 'What kinds of help are there?', p: ['Four, and they are not substitutes for each other.'], table: { head: ['Kind', 'What you get', 'Suits'], rows: [
        ['Bail-specific phone agent', 'A ready product that answers and qualifies calls', 'Agencies whose main gap is missed or after-hours calls'],
        ['AI agent platform', 'A tool you configure with your own answers and rules', 'Agencies with staff time to set it up and keep it current'],
        ['Custom software developer', 'Software built to your specification', 'Agencies with a workflow no product covers'],
        ['Install partner', 'Existing tools set up, connected and handed to your staff', 'Agencies with several tools to connect and nobody to do it'],
      ] } },
      { firms: true },
      { h2: 'Which kind fits which agency?', p: ['If missed calls are the whole problem, a phone product may be all you need, and you can test it on your own line before committing. If you want your own answers on your website and phone and have someone to maintain them, a platform fits. If nothing on the market does what you need, a developer builds it, at a developer\'s price and timeline. If you need answering, reminders, paperwork and follow-up connected to the bail software you already run, and your office trained to run it, that is install work. [AI for bail bond agencies](/ai-for-bail-bond-agencies) lists those workflows and the state rules that shape them.'] },
      { h2: 'What this page does not do', p: ['It does not rank anyone. Firms are listed alphabetically, we have not tested their products, and nothing here is a claim about their quality, price or results beyond what each says on its own site. Search results for bail AI also include bail management software; those products hold bonds and records and are not compared here. If a description is out of date, email hello@wekeepyouspry.com and we will correct it.'] },
    ],
    firmsHeading: 'Who offers it, in their own words',
    firmsIntro: 'Listed alphabetically. Each description comes from the company\'s own website, read on 28 November 2026, and links to the page it came from.',
    firms: [
      { name: 'BondCall.AI', kind: 'Bail-specific AI phone agent', url: 'https://www.bondcall.ai/', checked: D, facts: [
        { text: 'Says it answers an agency\'s inbound calls, qualifies new bonds, routes hot leads to the agency\'s team and sends a call summary, day and night.', source: 'https://www.bondcall.ai/' },
        { text: 'Says it works behind the agency\'s current phone number.', source: 'https://www.bondcall.ai/' },
      ] },
      { name: 'Chetu', kind: 'Custom software developer', url: 'https://www.chetu.com/', checked: D, facts: [
        { text: 'Publishes a case study of a voice AI agent it built for a bail bond company, with modules for client onboarding, lead management and communication.', source: 'https://www.chetu.com/white-paper/voice-ai-agent-for-bail-bond-hyperautomation-solution.php' },
        { text: 'Says callers to that agent can be transferred to a live bail agent when needed.', source: 'https://www.chetu.com/white-paper/voice-ai-agent-for-bail-bond-hyperautomation-solution.php' },
      ] },
      { name: 'DocsBot', kind: 'AI agent platform', url: 'https://docsbot.ai/', checked: D, facts: [
        { text: 'Says agencies can build AI agents trained on their own FAQs, intake steps, office policies, court appearance guidance, payment explanations and escalation rules.', source: 'https://docsbot.ai/industry/bail-bonds' },
        { text: 'Says sensitive, legal, financial or high-impact questions are escalated to people.', source: 'https://docsbot.ai/industry/bail-bonds' },
      ] },
      wkys([
        { text: 'Says it sets up AI tools in accounts the agency owns, connected to the software it already uses, then trains staff and hands everything over in a 30-day install at {install}.', source: US + '/30-day-ai-implementation' },
        { text: 'Says it is not bail software: it sets up answering, reminders, paperwork and follow-up around the bail software the agency chooses.', source: US + '/ai-for-bail-bond-agencies' },
        { text: 'Publishes its prices; the Assessment is {assessment}, credited to the install.', source: US + '/pricing' },
      ]),
    ],
    faq: [
      { q: 'Is there AI software made for bail agencies?', a: 'Yes. Some products are built for bail calls and intake, and two of the firms above describe theirs. Whether one fits depends mostly on whether it works with your bail software and the number you already advertise.' },
      { q: 'Should a small agency hire anyone at all?', a: 'Not necessarily. A one-office agency whose only gap is night calls may do well with a phone product it sets up itself. Help is worth paying for when several tools need connecting and nobody in the office has the time.' },
      { q: 'Why is We Keep You Spry on a page it wrote?', a: 'Because we offer this service, and leaving ourselves off would hide that. We are listed alphabetically, described from our own site like everyone else, and labelled as the authors.' },
    ],
    related: ['ai-for-bail-bond-agencies', 'should-a-small-business-use-an-ai-receptionist', 'is-it-safe-to-put-client-data-into-ai-tools'],
    formHeading: 'Tell us about your agency.',
  },
  {
    slug: 'ai-implementation-partners-for-property-management', kind: 'comparison', nav: 'AI help for property management', published: D, updated: D,
    title: 'AI Implementation Partners for Property Management, Compared | We Keep You Spry',
    description: 'The kinds of AI help a property management company can get, from AI built into its software to consulting and install firms, each described from its own website.',
    eyebrow: 'COMPARE',
    h1: 'AI implementation partners for property management companies',
    answer: 'A property management company can get AI from its property software, from AI products for leasing and residents, or from firms that build or install AI for it. This page is written by We Keep You Spry, one of the firms listed. Every company, us included, is described only from its own website.',
    sections: [
      { h2: 'What should a property manager check before choosing?', p: ['These questions come from what search engines and buyer guides raised when we asked about AI for property management on 28 November 2026. Ask them of every company below, including us.'], list: { type: 'ol', items: [
        'Does it work inside the property management software you already run, or beside it?',
        'Does it build and hand over working systems, or advise only?',
        'How is resident and applicant data handled, and is the account in your company\'s name?',
        'Do screening, pricing and advertising decisions stay with your staff?',
        'What training does your team get, and who keeps it running afterwards?',
      ] } },
      { h2: 'What kinds of help are there?', p: ['Most firms already pay for the first kind.'], table: { head: ['Kind', 'What you get', 'Suits'], rows: [
        ['Property software with AI built in', 'AI features inside the system you already use', 'Firms whose software already covers the workflow'],
        ['AI leasing and resident products', 'A separate product for calls, messages and leasing', 'Firms with high call and message volume'],
        ['AI consulting and engineering firms', 'Strategy, custom builds or both', 'Larger firms with work no product covers'],
        ['Install partner', 'The tools you have set up, connected and handed to your staff', 'Firms that own the tools but have not set them up'],
      ] } },
      { firms: true },
      { h2: 'Which kind fits which firm?', p: ['Start with what your property software already includes; it may be most of what you need, switched off. Add a leasing or resident product when call and message volume outgrows your team. Bring in a consulting or engineering firm when the work crosses several systems and needs something built. An install partner fits the firm that already pays for the tools and needs them set up, connected and taught. [AI for property management](/ai-for-property-management) covers which workflows to start with and where fair housing rules apply.'] },
      { h2: 'What this page does not do', p: ['It does not rank anyone. Companies are listed alphabetically, we have not tested their products, and nothing here is a claim about their quality, price or results beyond what each says on its own site. The list is not complete: many more property software vendors and AI products exist. If a description is out of date, email hello@wekeepyouspry.com and we will correct it.'] },
    ],
    firmsHeading: 'Who offers it, in their own words',
    firmsIntro: 'Listed alphabetically. Each description comes from the company\'s own website, read on 28 November 2026, and links to the page it came from.',
    firms: [
      { name: 'AppFolio', kind: 'Property management software', url: 'https://www.appfolio.com/', checked: D, facts: [
        { text: 'Sells property management software and describes AppFolio Realm-X as embedded generative AI for property management.', source: 'https://www.appfolio.com/property-management-ai' },
      ] },
      { name: 'EliseAI', kind: 'AI platform for housing', url: 'https://www.eliseai.com/', checked: D, facts: [
        { text: 'Describes itself as an AI platform for property management and healthcare that automates communications.', source: 'https://www.eliseai.com/' },
      ] },
      { name: 'Nurture Boss', kind: 'AI products for multifamily', url: 'https://www.nurtureboss.io/', checked: D, facts: [
        { text: 'Describes its products as AI for multifamily, including a virtual leasing assistant, AI voice, rent reminders and emergency maintenance escalation.', source: 'https://www.nurtureboss.io/' },
      ] },
      { name: 'Phos AI Labs', kind: 'AI consulting firm', url: 'https://phosailabs.com/', checked: D, facts: [
        { text: 'Describes its work as AI strategy, implementation and team adoption for companies doing $5M+ in revenue.', source: 'https://phosailabs.com/' },
        { text: 'Publishes its own guide to AI implementation firms for property management companies.', source: 'https://phosailabs.com/blog/best-ai-implementation-firms-property-management-companies' },
      ] },
      { name: 'RTS Labs', kind: 'Applied AI consulting firm', url: 'https://rtslabs.com/', checked: D, facts: [
        { text: 'Describes itself as a boutique applied AI consulting firm that builds and operates AI agents, data platforms and generative AI.', source: 'https://rtslabs.com/' },
        { text: 'Lists real estate and construction among the industries it serves.', source: 'https://rtslabs.com/' },
      ] },
      wkys([
        { text: 'Says it wires up the property management tools a firm already pays for, connects them to each other and trains staff in 30 days, instead of selling another vendor.', source: US + '/ai-for-property-management' },
        { text: 'Says screening, approvals and pricing stay with the firm\'s staff in anything it builds.', source: US + '/ai-for-property-management' },
        { text: 'Publishes its prices: the 30-day install is {install}, and the Assessment is {assessment}, credited to the install.', source: US + '/pricing' },
      ]),
    ],
    faq: [
      { q: 'Do we need outside help if our software already has AI?', a: 'Sometimes not. If the AI features cover your workflow and someone on staff has time to set them up and train the team, start there. Outside help earns its fee when several tools need connecting or nobody has the hours.' },
      { q: 'Are AI leasing assistants safe for fair housing?', a: 'That depends on how each is set up and what it decides. Keep screening, pricing and advertising choices with your staff, and have your counsel review any resident-facing step before it goes live. We do not give legal advice.' },
      { q: 'How were these companies chosen?', a: 'They came up in what search engines returned for property management AI questions on 28 November 2026, and each publishes a page about this work. The list is not complete and is not a ranking.' },
    ],
    related: ['ai-for-property-management', 'should-a-small-business-use-an-ai-receptionist', 'how-much-do-ai-tools-cost-per-month'],
    formHeading: 'Tell us about your portfolio.',
  },
  {
    slug: 'ai-implementation-partners-for-holding-companies', kind: 'comparison', nav: 'AI help for holding companies', published: D, updated: D,
    title: 'AI Implementation Partners for Holding Companies and Search Funds | We Keep You Spry',
    description: 'Firms that help holding companies, search funds and PE owners put AI into the companies they own, each described from its own website, plus the questions to ask.',
    eyebrow: 'COMPARE',
    h1: 'AI implementation partners for holding companies and search funds',
    answer: 'Holding companies, search funds and private equity owners can get AI into the companies they own through consultancies, engineering firms, a university programme or an install partner. This page is written by We Keep You Spry, one of the firms listed. Every firm, us included, is described only from its own website.',
    sections: [
      { h2: 'What should an owner check before choosing?', p: ['These questions come from what search engines, buyer guides and searcher forums raised when we asked about AI for holding companies and search funds on 28 November 2026. Ask them of every firm below, including us.'], list: { type: 'ol', items: [
        'Can the same work be repeated in each company you buy, or does every company start from zero?',
        'Who owns what is built, so it can be reused in future acquisitions?',
        'Does the firm work at the holding-company level, inside each company, or both?',
        'Can it show work in companies of your size? Ask for references and call them.',
        'Would a hire do this better? Some owners appoint an AI lead or operating partner instead ([AI consultant vs hiring in-house](/ai-consultant-vs-hiring-in-house)).',
      ] } },
      { h2: 'What kinds of help are there?', p: ['They differ mainly in size and in what is left behind.'], table: { head: ['Kind', 'What you get', 'Suits'], rows: [
        ['Private equity consultancy', 'Finance, data and AI work tied to the value creation plan', 'Funds with a large portfolio and budget'],
        ['AI engineering firm', 'Custom builds, data platforms and agents', 'Companies with work no product covers'],
        ['University programme', 'Advice, builds and student talent', 'Owners who also want to hire AI-ready staff'],
        ['Install partner', 'Existing tools set up, connected and handed to each team', 'Small holdcos and searchers repeating one playbook'],
      ] } },
      { firms: true },
      { h2: 'Which kind fits which owner?', p: ['A fund with many portfolio companies and a value creation team can use a consultancy or engineering firm across the portfolio. A searcher who has just closed on one company needs something smaller: the departing owner\'s knowledge written down, the month-end close sped up and the phones answered, in the company\'s own accounts. A holding company buying several small businesses wants the same install repeated from a written playbook. [AI for holding companies](/ai-for-holding-companies) and [AI for search funds](/ai-for-search-funds) cover those workflows.'] },
      { h2: 'What this page does not do', p: ['It does not rank anyone. Firms are listed alphabetically, we have not worked with any of them, and nothing here is a claim about their quality, price or results beyond what each says on its own site. The list is not complete. If a description is out of date, email hello@wekeepyouspry.com and we will correct it.'] },
    ],
    firmsHeading: 'Who offers it, in their own words',
    firmsIntro: 'Listed alphabetically. Each description comes from the firm\'s own website, read on 28 November 2026, and links to the page it came from.',
    firms: [
      { name: 'Accordion', kind: 'Private equity consultancy', url: 'https://www.accordion.com/', checked: D, facts: [
        { text: 'Describes itself as the value creation partner for private equity, working with the office of the CFO across finance, data, technology and AI.', source: 'https://www.accordion.com/' },
      ] },
      { name: 'Northeastern University', kind: 'University AI programme', url: 'https://ai.northeastern.edu/', checked: D, facts: [
        { text: 'Says it helps portfolio companies plan the AI transformation, hire AI-ready talent and put AI to work, with one partner an owner can bring to every company it owns.', source: 'https://ai.northeastern.edu/ai-portfolio-partner' },
        { text: 'Says its AI Solutions Hub builds working solutions and leaves the capability behind.', source: 'https://ai.northeastern.edu/ai-portfolio-partner' },
      ] },
      { name: 'RTS Labs', kind: 'Applied AI consulting firm', url: 'https://rtslabs.com/', checked: D, facts: [
        { text: 'Says it builds AI inside private equity portfolio companies, including KPI reporting, month-end close, diligence and operations.', source: 'https://rtslabs.com/ai-consulting-for-private-equity' },
        { text: 'Describes its approach as one company and one workflow, then the next.', source: 'https://rtslabs.com/ai-consulting-for-private-equity' },
      ] },
      { name: 'STX Next', kind: 'AI and software engineering firm', url: 'https://www.stxnext.com/', checked: D, facts: [
        { text: 'Says it helps private equity and venture funds and their portfolio companies assess, build and scale AI and automation.', source: 'https://www.stxnext.com/industries/private-equity' },
        { text: 'Lists AI maturity assessments and implementation roadmaps among its services, and offers one accountable technical partner across a portfolio.', source: 'https://www.stxnext.com/industries/private-equity' },
      ] },
      wkys([
        { text: 'Says it does the first install in 30 days, writes the playbook down and quotes each later company from that same playbook.', source: US + '/ai-for-holding-companies' },
        { text: 'Says it installs in accounts each company owns, then trains the team and hands it over.', source: US + '/ai-for-search-funds' },
        { text: 'Publishes its prices: the 30-day install is {install}, and the 90-day engagement for larger work is {engagement}.', source: US + '/pricing' },
      ]),
    ],
    faq: [
      { q: 'Should a holding company hire an AI operating partner instead?', a: 'It can, once there are enough companies to keep one person busy. Before that, a firm doing the first installs and writing the playbook is usually cheaper, and the playbook is what a later hire would start from.' },
      { q: 'Can one firm work across every company we own?', a: 'Several of the firms above say they work across a portfolio. Ask each how the second company differs from the first: whether it reuses what was built or starts again, and who owns the result.' },
      { q: 'How were these firms chosen?', a: 'They appeared in what search engines and searcher forums returned for holding-company and search-fund AI questions on 28 November 2026, and each publishes a page about this work. The list is not complete and is not a ranking.' },
    ],
    related: ['ai-for-holding-companies', 'ai-for-search-funds', 'ai-for-independent-sponsors'],
    formHeading: 'Start with the portfolio Assessment.',
  },
];
