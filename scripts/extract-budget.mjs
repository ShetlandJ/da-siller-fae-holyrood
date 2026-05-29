// One-off data extraction for public/budget-tracker.html
//
// Turns two primary, citable sources into a single inlined dataset:
//   1. GERS 2024-25, Table 3.6 — "Total Expenditure: Scotland (£ million)
//      1998-99 to 2024-25", spending by function for every year (cash terms).
//   2. HMT GDP deflators (Dec 2025 release), already rebased to 2024-25 = 100,
//      used to express every year in constant 2024-25 prices (real terms).
//
// GERS measures TOTAL public spending FOR Scotland (devolved + reserved), so it
// is broader than the ~£68bn devolved Scottish Budget. That breadth is the
// point here: it gives a single consistent 10-year functional series and lets
// us show, honestly, which functions are broadly set at Holyrood vs Westminster.
//
// Run:  node scripts/extract-budget.mjs
// Writes: scripts/data/budget-data.json (paste the `DATA = ` block into the page)
//
// Not part of the site bundle. `xlsx` is a devDependency only.

import XLSX from 'xlsx';
import { writeFileSync } from 'node:fs';

const DIR = new URL('./data/', import.meta.url);
const f = (name) => XLSX.readFile(new URL(name, DIR).pathname);

// --- 10-year window (inclusive) -------------------------------------------
const YEARS = [
  '2015-16', '2016-17', '2017-18', '2018-19', '2019-20',
  '2020-21', '2021-22', '2022-23', '2023-24', '2024-25',
];
const BASE_YEAR = '2024-25'; // real terms expressed in these prices

// --- Map GERS' 18 function rows -> public-facing bands ---------------------
// `control` is a *broad* characterisation of who sets the bulk of the spend.
// It is deliberately caveated on the page — social protection in particular is
// genuinely mixed (UK pensions/UC reserved; Scottish social security devolved).
const BANDS = [
  { key: 'social',    label: 'Social protection',      control: 'mixed',     rows: ['Social protection'] },
  { key: 'health',    label: 'Health',                 control: 'holyrood',  rows: ['Health'] },
  { key: 'education',  label: 'Education',              control: 'holyrood',  rows: ['Education and training'] },
  { key: 'economy',   label: 'Economy, rural & enterprise', control: 'holyrood', rows: [
      'Economic affairs Enterprise and economic development ',
      'Economic affairs Science and technology',
      'Economic affairs Employment policies',
      'Economic affairs Agriculture, forestry and fisheries',
  ] },
  { key: 'transport', label: 'Transport',              control: 'holyrood',  rows: ['Economic affairs Transport'] },
  { key: 'order',     label: 'Police, courts & safety', control: 'holyrood', rows: ['Public order and safety'] },
  { key: 'housing',   label: 'Housing & communities',  control: 'holyrood',  rows: ['Housing and community amenities'] },
  { key: 'environment', label: 'Environment',          control: 'holyrood',  rows: ['Environment protection'] },
  { key: 'culture',   label: 'Culture & recreation',   control: 'holyrood',  rows: ['Recreation, culture and religion'] },
  { key: 'defence',   label: 'Defence',                control: 'westminster', rows: ['Defence'] },
  { key: 'debt',      label: 'Debt interest',          control: 'westminster', rows: ['General public services Public sector debt interest'] },
  { key: 'other',     label: 'Other & accounting',     control: 'mixed',     rows: [
      'General public services Public and common services',
      'General public services International services',
      'EU Transactions',
      'Accounting adjustments',
  ] },
];

// --- Read GERS Table 3.6 ---------------------------------------------------
const t36 = XLSX.utils.sheet_to_json(f('gers-tables.xlsx').Sheets['Table_3.6'], {
  header: 1, blankrows: false,
});
// Row 2 = year header, repeated for Current | Capital | Total sections.
// We want the TOTAL section: the LAST occurrence of each year.
const yearRow = t36[2];
const totalCol = {};
yearRow.forEach((y, i) => { if (typeof y === 'string' && /^\d{4}-\d{2}$/.test(y)) totalCol[y] = i; });
// because we overwrite, totalCol[year] ends up as the rightmost (Total) column.

// Index data rows by their function label (col 0).
const t36ByLabel = {};
for (const r of t36) if (typeof r[0] === 'string') t36ByLabel[r[0].trim()] = r;

const get = (label, year) => {
  const r = t36ByLabel[label.trim()];
  if (!r) throw new Error(`GERS row not found: "${label}"`);
  const v = r[totalCol[year]];
  return typeof v === 'number' ? v : 0;
};

// --- Read GDP deflator (2024-25 = 100) -------------------------------------
const defRows = XLSX.utils.sheet_to_json(f('gdp-deflator.xlsx').Sheets[f('gdp-deflator.xlsx').SheetNames[0]], {
  header: 1, blankrows: false,
});
const deflator = {};
for (const r of defRows) {
  const fy = String(r[1] || '');
  if (/^\d{4}-\d{2}$/.test(fy) && typeof r[2] === 'number') deflator[fy] = r[2];
}
for (const y of YEARS) if (!deflator[y]) throw new Error(`No deflator for ${y}`);

// --- Build dataset ---------------------------------------------------------
const toReal = (cash, year) => cash * 100 / deflator[year]; // -> BASE_YEAR prices

const bands = BANDS.map((b) => {
  const cash = {}, real = {};
  for (const y of YEARS) {
    const sum = b.rows.reduce((a, lbl) => a + get(lbl, y), 0);
    cash[y] = Math.round(sum);
    real[y] = Math.round(toReal(sum, y));
  }
  return { key: b.key, label: b.label, control: b.control, cash, real };
});

// --- Reconciliation check: bands must sum to GERS published Total ----------
const totals = {};
let maxDrift = 0;
for (const y of YEARS) {
  const published = get('Total', y);
  const summed = bands.reduce((a, b) => a + b.cash[y], 0);
  const drift = Math.abs(published - summed);
  maxDrift = Math.max(maxDrift, drift);
  totals[y] = { published: Math.round(published), summed, driftPct: +(drift / published * 100).toFixed(3) };
}

const data = {
  meta: {
    title: 'Public spending for Scotland, by function',
    baseYear: BASE_YEAR,
    measure: 'GERS Total Expenditure (current + capital), £ million, cash and real terms',
    note: 'GERS measures all public spending FOR Scotland (devolved + reserved). Broader than the devolved Scottish Budget.',
    generated: process.env.GEN_DATE || 'see git',
  },
  years: YEARS,
  deflator: Object.fromEntries(YEARS.map((y) => [y, deflator[y]])),
  bands,
  reconciliation: totals,
  sources: [
    { key: 'GERS', label: 'Government Expenditure & Revenue Scotland 2024-25, Table 3.6 (Scottish Government, accredited official statistics, Aug 2025)', url: 'https://www.gov.scot/publications/government-expenditure-revenue-scotland-2024-25/' },
    { key: 'GDPDEF', label: 'GDP deflators at market prices (HM Treasury, Dec 2025), rebased to 2024-25 = 100', url: 'https://www.gov.uk/government/collections/gdp-deflators-at-market-prices-and-money-gdp' },
  ],
};

writeFileSync(new URL('budget-data.json', DIR).pathname, JSON.stringify(data, null, 2));

// --- Report ----------------------------------------------------------------
console.log('Bands (cash £m):');
for (const b of bands) {
  console.log('  ', b.label.padEnd(26), YEARS.map((y) => String(b.cash[y]).padStart(7)).join(' '));
}
console.log('\nReconciliation (Σ bands vs GERS Total):');
for (const y of YEARS) {
  const t = totals[y];
  console.log('  ', y, 'published', String(t.published).padStart(7), 'summed', String(t.summed).padStart(7), 'drift%', t.driftPct);
}
console.log('\nMax drift (£m):', Math.round(maxDrift), '(rounding only — should be < ~12)');
console.log('Wrote scripts/data/budget-data.json');
