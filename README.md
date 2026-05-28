# What Scotland spends in Shetland

An independent data visualisation of Scottish Government funding in Shetland —
where the £254m a year comes from, and what it pays for. Built from public
documents (SIC Budget Book 2025/26, Shetland in Statistics 2024, NHS Shetland
board papers, FY23/24 grant figures and Jonathan Wills's *Shetland Times* piece).

Vanilla JS + Vite, hand-rolled SVG charts, no charting library.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/  (relative asset paths, drops onto GitHub Pages as-is)
npm run preview
```

## Where things live

- `src/data.js` — **single source of truth.** Every figure with its source and a
  `status` (`confirmed` / `to-verify`). Edit numbers here, not in markup. A dev-only
  console assertion checks the funding lines sum to £254m and the SIC parts to £178.4m.
- `src/main.js` — assembles the page.
- `src/charts/` — `treemap.js` (funding breakdown + drill-down), `donut.js` (SIC
  budget split), `bars.js` (in-vs-out), `countup.js` (animated counters + reveal).
- `src/components/statCard.js` — one achievement card, renders the `to verify` chip.

## To verify before publishing

Three figures carry a `to verify` chip (set in `data.js`): free school meals count,
free swimming lessons, and the 76.9% superfast-broadband figure. The original SNP
briefing itself queried these — tie each to a named source or drop it.

## TODO

- `public/og-image.png` is referenced in `index.html` for social link previews but
  not yet created (a 1200×630 share card).
- Confirm the GitHub Pages repo slug. `base: './'` means no config change is needed
  regardless of the name.
