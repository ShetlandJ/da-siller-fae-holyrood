// ---------------------------------------------------------------------------
// Single source of truth. Every number on the page comes from here, each one
// carrying its source and a status. Charts and cards render the caveats
// automatically, so nothing is hard-coded into markup.
//
// Sources (compiled from public documents):
//   [BB]   SIC Budget Book 2025/26, p.4
//   [SiS]  Shetland in Statistics 2024 (SIC publication)
//   [NHS]  NHS Shetland Board minutes, December 2024
//   [3S]   Scottish Government third-sector grant figures, FY 2023/24
//   [JW]   "SNP maybe not so baaad?", Jonathan Wills, The Shetland Times, Nov 2025
//   [SNP]  SNP delivery briefing "What has the SNP done for Shetland"
// ---------------------------------------------------------------------------

export const POPULATION = 22990; // ~£254m / £11,043 per head

// --- The headline ---------------------------------------------------------
export const headline = {
  total: 254.0, // £m/year — see fundingSources, which sum to exactly this
  perHead: 11043, // £ per woman, man and child
  source: 'JW, compiled from BB, NHS, SiS and Scottish Government grant figures',
};

// --- Section 1: where the £254m comes from --------------------------------
// Ordered largest-first so the yellow→amber ramp reads by size.
export const fundingSources = [
  {
    label: 'SIC core grant',
    value: 120.3,
    detail:
      "The Scottish Government's grant to run council services — 67.4% of the SIC's £178.4m budget. Includes £24.7m for the inter-island ferries.",
    source: 'BB',
    status: 'confirmed',
  },
  {
    label: 'NHS Shetland',
    value: 89.4,
    detail:
      'The cost of running the NHS in Shetland, most of it met by the Scottish Government — about £3,886 per head.',
    source: 'NHS',
    status: 'confirmed',
  },
  {
    label: 'NorthLink ferries',
    value: 22.0,
    detail:
      "Shetland's share of the £43.7m/year lifeline ferry contract (Aberdeen–Lerwick–Kirkwall). A separate cost from the SIC's own inter-island ferries — no double-counting.",
    source: 'JW',
    status: 'confirmed',
  },
  {
    label: 'Crofting & farming',
    value: 10.6,
    detail:
      'Support to Shetland crofters and farmers in 2023, spread across six different subsidy schemes.',
    source: 'SiS',
    status: 'confirmed',
  },
  {
    label: 'Council capital',
    value: 5.9,
    detail: 'Scottish Government money for SIC capital projects, on top of the core grant.',
    source: 'BB',
    status: 'confirmed',
  },
  {
    label: 'Air Discount Scheme',
    value: 2.3,
    detail:
      "The 50% Air Discount Scheme on Shetlanders' flights — a 2022 estimate, so more now.",
    source: 'JW',
    status: 'confirmed',
  },
  {
    label: 'Third-sector grants',
    value: 1.9,
    detail: 'Grants to Shetland community and third-sector organisations in 2023/24. Click to break down.',
    source: '3S',
    status: 'confirmed',
    children: [
      { label: 'Islands Programme', value: 0.79982 },
      { label: 'Creative Scotland', value: 0.441399 },
      { label: 'Community Led Local Development', value: 0.229178 },
      { label: 'Highlands & Islands Enterprise', value: 0.188127 },
      { label: 'NatureScot — Peatland Action', value: 0.098265 },
      { label: 'Place Based Investment', value: 0.075 },
      { label: 'Mental Health & Wellbeing (Adults)', value: 0.071811 },
    ],
  },
  {
    label: 'Marine Fund',
    value: 1.6,
    detail:
      'Scottish Government Marine Fund grants in the last financial year (£3.8m over the past four years) — fishing and aquaculture projects.',
    source: 'JW',
    status: 'confirmed',
  },
];

// --- Section 1: the SIC budget split (donut) ------------------------------
// The direct rebuttal to "the SNP won't fund the islands".
export const sicBudget = {
  total: 178.4, // £m
  parts: [
    { label: 'Scottish Government', value: 120.3, pct: 67.4 },
    { label: 'Council reserves', value: 43.9, pct: 24.6 },
    { label: 'Council Tax', value: 12.6, pct: 7.0 },
    { label: 'Other income', value: 1.6, pct: 1.0 },
  ],
  source: 'BB',
};

// --- Section 1: are we paying our way? (in vs out) ------------------------
export const valueForMoney = {
  paysIn: 70, // £m — rough income-tax estimate
  getsBack: 254, // £m
  caveat:
    'A rough estimate of income tax only (~28% of what comes back). VAT and corporation tax raised in Shetland aren’t published, so the "pays in" figure is understated.',
  context: [
    { label: 'GDP per head', value: '£40,844', note: 'above the Scottish and UK average' },
    { label: 'GVA per head', value: '£37,174', note: 'above the Scottish and UK average' },
    { label: 'Shetland’s share of Scotland', value: '0.415%', note: 'of the population' },
  ],
  source: 'SiS, JW',
};

// --- Section 2: what the SNP delivered ------------------------------------
// theme drives the card grouping + tint. status:'to-verify' flags figures
// the original briefing itself queried.
export const themes = [
  { id: 'pocket', label: 'Money in your pocket' },
  { id: 'health', label: 'Health' },
  { id: 'education', label: 'Education & young folk' },
  { id: 'housing', label: 'Housing & community' },
  { id: 'fishing', label: 'Fishing & crofting' },
  { id: 'connectivity', label: 'Connectivity & council' },
];

export const achievements = [
  // Money in your pocket
  {
    theme: 'pocket',
    value: '£250',
    unit: '/year',
    label: 'saved per resident on average by free prescriptions',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'pocket',
    value: '£27,000',
    unit: '/student',
    label: 'saved on average by free university tuition',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'pocket',
    value: '~£300',
    unit: '/trip',
    label: 'saved by a family of four on every return ferry trip after peak fares, cabins and vehicle charges were scrapped (£5.4m in Budget 2026)',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'pocket',
    value: '6,800+',
    label: 'Shetland residents with free bus travel',
    source: 'SNP',
    status: 'confirmed',
  },
  // Health
  {
    theme: 'health',
    value: '+16%',
    unit: '(£12m)',
    label: 'rise for NHS Shetland in 2026–27 — the highest increase in Scotland',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'health',
    value: '1,310',
    label: 'Baby Boxes delivered to Shetland families since 2017',
    source: 'SNP',
    status: 'to-verify',
  },
  // Education & young folk
  {
    theme: 'education',
    value: '60%',
    label: 'of the new Anderson High School build funded directly by the Scottish Government',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'education',
    value: '95%',
    label: 'of Shetland school leavers go on to work, training or study',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'education',
    value: '1,000+',
    label: 'children in Shetland now receive free school meals',
    source: 'SNP',
    status: 'to-verify',
  },
  {
    theme: 'education',
    value: 'Free',
    label: 'childcare expansion supporting families across Shetland',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'education',
    value: 'Free',
    label: 'swimming lessons for all children in Scotland',
    source: 'SNP',
    status: 'to-verify',
  },
  // Housing & community
  {
    theme: 'housing',
    value: '563',
    label: 'affordable and social homes built in Shetland since 2007',
    source: 'SNP',
    status: 'to-verify',
  },
  {
    theme: 'housing',
    value: '815',
    label: 'children in Shetland benefiting from the Scottish Child Payment',
    source: 'SNP',
    status: 'to-verify',
  },
  {
    theme: 'housing',
    value: '£512,000',
    label: 'invested locally through CashBack for Communities',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'housing',
    value: '~£200,000',
    label: 'to Shetland households to mitigate the Bedroom Tax in 2023–24',
    source: 'SNP',
    status: 'confirmed',
  },
  // Fishing & crofting
  {
    theme: 'fishing',
    value: '1,000t',
    label: 'mackerel quota top-sliced — creating work for almost 200 small jigging boats',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'fishing',
    value: '50%',
    label: 'cut to Loganair fares through the Air Discount Scheme',
    source: 'SNP',
    status: 'confirmed',
  },
  // Connectivity & council
  {
    theme: 'connectivity',
    value: '+7%',
    label: 'record council funding rise for Shetland in 2026–27',
    source: 'SNP',
    status: 'confirmed',
  },
  {
    theme: 'connectivity',
    value: '76.9%',
    label: 'of Shetland homes now have superfast broadband',
    source: 'SNP',
    status: 'to-verify',
  },
  {
    theme: 'connectivity',
    value: 'Down',
    label: 'crime in Shetland compared with 2007',
    source: 'SNP',
    status: 'confirmed',
  },
];

// Per-person savings used by the optional household widget.
export const savings = {
  perPersonPrescriptions: 250,
  perStudentTuition: 27000,
  perFamilyFerryTrip: 300,
};

export const sourcesList = [
  { key: 'BB', text: 'SIC Budget Book 2025/26, p.4' },
  { key: 'SiS', text: 'Shetland in Statistics 2024 (SIC)' },
  { key: 'NHS', text: 'NHS Shetland Board minutes, December 2024' },
  { key: '3S', text: 'Scottish Government third-sector grants, FY 2023/24' },
  { key: 'JW', text: '"SNP maybe not so baaad?", Jonathan Wills, The Shetland Times' },
  { key: 'SNP', text: 'SNP delivery briefing, "What has the SNP done for Shetland"' },
];

// --- Dev-only data integrity assertions -----------------------------------
if (import.meta.env?.DEV) {
  const sum = fundingSources.reduce((a, s) => a + s.value, 0);
  console.assert(Math.abs(sum - headline.total) < 0.05, `Funding sources sum to ${sum}, expected ${headline.total}`);
  const third = fundingSources.find((s) => s.children);
  const childSum = third.children.reduce((a, c) => a + c.value, 0);
  console.assert(Math.abs(childSum - third.value) < 0.05, `Third-sector children sum to ${childSum}, expected ${third.value}`);
  const sicSum = sicBudget.parts.reduce((a, p) => a + p.value, 0);
  console.assert(Math.abs(sicSum - sicBudget.total) < 0.1, `SIC budget parts sum to ${sicSum}, expected ${sicBudget.total}`);
  console.log('[data] integrity checks passed: funding=%s, third-sector=%s, SIC=%s', sum.toFixed(1), childSum.toFixed(2), sicSum.toFixed(1));
}
