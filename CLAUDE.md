# CLAUDE.md

Context and conventions for working on this project. Read this before editing.

## What this is

A small data-visualisation site showing Scottish Government funding in Shetland —
where the ~£254m a year comes from, what it pays for, and a downloadable
share-card generator. Built for a newly-elected SNP Shetland MSP (James's friend);
James may take on a part-time digital role.

Live: https://shetlandj.github.io/da-siller-fae-holyrood/ — repo: ShetlandJ/da-siller-fae-holyrood.

## Stack

Vite vanilla-JS single-page app. **No charting library** — every chart is
hand-rolled SVG (treemap, donut) or canvas (share card). No framework, no build
plugins, no dependency drift. System font stack. Deploys to GitHub Pages via
`.github/workflows/deploy.yml` on every push to `main`. `vite.config.js` sets
`base: './'` so relative asset paths work for project pages without knowing the
repo slug.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

## Where things live

```
src/
  data.js              # SINGLE SOURCE OF TRUTH — every figure with source + status
  main.js              # assembles the page (no framework)
  styles.css           # palette vars at the top; everything plain CSS
  charts/
    treemap.js         # squarified SVG treemap with drill-down; colour by value (sqrt scale)
    donut.js           # SIC budget donut
    bars.js            # "Are we paying our way?" — chips + honest contribution bar
    countup.js         # animated counters + the reveal-on-scroll wiring
    sharecard.js       # canvas-based PNG generator for social posts
  components/
    statCard.js        # one achievement card (renders the `to verify` chip)
```

## Data conventions

**Every figure flows from `src/data.js`** — never hard-code numbers in markup
or charts. Each entry carries:

```js
{ value, label, source, status: 'confirmed' | 'to-verify' }
```

`to-verify` is the *explicit, visible* signal that a figure isn't yet pinned to
a primary public source. The cards render an amber chip for these; don't drop
them silently. A dev-only console assertion at the bottom of `data.js` checks
the funding lines sum to £254m and the SIC parts to £178.4m — keep it green.

Sources keyed in `sourcesList`: `BB` (SIC Budget Book 2025/26), `SiS`
(Shetland in Statistics 2024), `NHS`, `3S` (third-sector grants), `JW`
(Jonathan Wills letter), `SNP` (delivery briefing). The footer renders this list.

## Tone

**Middle ground.** Clearly SNP-leaning in palette and framing, but every figure
is sourced and caveats are visible so the page holds up to scrutiny. *Not* a
glossy campaign leaflet. Treat the "honest" treatments (the `to verify` chip,
the open-ended contribution bar that trails into unmeasured tax, the donut's
"Other income 1%" slice that makes it reconcile to £178.4m) as load-bearing —
they're the reason this can be shared without getting torn apart on Facebook.

If you're tempted to silently smooth over a discrepancy, don't — expose it.

## Visual conventions

Palette is in CSS vars at the top of `styles.css` (`--snp-yellow`, `--ink`,
`--cream`, `--slate`, `--verify`). **No purple, no AI gradients.** The treemap's
colour ramp encodes value (sqrt scale, light yellow → amber, biggest = darkest)
— if you change it, keep magnitude-encoded; rank-based ramps were misleading.

Reveal-on-scroll uses `IntersectionObserver` with `threshold: 0` and a
**3-second safety timer that force-reveals anything still hidden** — don't
tighten the threshold or remove the fallback. The animation is polish; it must
never leave content invisible (a previous build did exactly that on mobile,
where tall elements couldn't meet a 15% intersection ratio).

## Dialect

Shetland dialect is welcome in section *headings* (`Whar's it aa come fae?`,
`Whits da SNP dun fur Shetland?`). Keep the main page title and meta tags in
plain English so social previews and screenshots travel. **Don't reintroduce
"siller"** — it's Scots, not distinctively Shetlandic, and a native Shetlander
flagged it as unfamiliar. The repo slug `da-siller-fae-holyrood` is legacy —
don't rename without James's say-so (it changes the public URL).

## Outstanding / known

- A scheduled remote agent fires Sat 30 May 09:00 BST to do a first-pass
  verification of figures and open a PR (`verification-pass` branch) —
  see https://claude.ai/code/routines/trig_0175J5mx3FHrqyw4AeXry6Vn.
- `to verify` chips on: free school meals count, free swimming lessons, 76.9%
  superfast broadband. Don't ship these as confirmed without a primary source.
- `public/og-image.png` is referenced in `index.html` but doesn't exist yet —
  Facebook/Twitter previews will be unbranded until it's created.
- The Shetland household count is deliberately *not* in `data.js` — the
  relatable hero line (`£212/week per person, £800/week for a household of 4`)
  uses only multiples of the sourced per-head figure to avoid an unsourced
  divisor. Keep it that way unless you've pinned a census household count.
