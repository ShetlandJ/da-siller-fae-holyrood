// Client-side social share-card generator. Draws a branded card to a <canvas>
// and offers it as a PNG download — no server, no dependencies. Reuses the
// figures from data.js so the cards stay in sync with the site.

import { headline, achievements } from '../data.js';

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

const FORMATS = {
  square: { w: 1080, h: 1080, label: 'Square (Instagram / Facebook)' },
  story: { w: 1080, h: 1920, label: 'Story (Instagram / Facebook)' },
};

// Curated set of the punchiest stats, built from the site data.
function buildStats() {
  const stats = [
    { big: '£254m', label: 'from the Scottish Government into Shetland every year' },
    { big: '£11,043', label: 'for every woman, man and child in Shetland' },
    { big: '£212', label: 'a week for every person — over £800 for a household of four' },
    { big: '67%', label: 'of the council’s budget comes from the Scottish Government' },
  ];
  // add the strongest delivery stats (skip the qualitative "Free"/"Down" ones)
  achievements
    .filter((a) => !['Free', 'Down'].includes(a.value) && a.status !== 'to-verify')
    .forEach((a) => stats.push({ big: a.value + (a.unit ? ' ' + a.unit : ''), label: a.label }));
  return stats;
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function draw(canvas, stat, fmt) {
  const { w, h } = FORMATS[fmt];
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const pad = 90;

  // background
  ctx.fillStyle = '#1b1b1b';
  ctx.fillRect(0, 0, w, h);

  // kicker
  ctx.fillStyle = '#fff06b';
  ctx.font = `700 30px ${FONT}`;
  ctx.textBaseline = 'top';
  ctx.fillText('WHAT SCOTLAND SPENDS IN SHETLAND'.split('').join(' '), pad, pad);

  // big number — shrink to fit width
  let bigSize = w === 1080 && h === 1080 ? 230 : 250;
  ctx.fillStyle = '#fff06b';
  do {
    ctx.font = `800 ${bigSize}px ${FONT}`;
    bigSize -= 6;
  } while (ctx.measureText(stat.big).width > w - pad * 2 && bigSize > 60);

  const bigY = fmt === 'square' ? h * 0.34 : h * 0.32;
  ctx.fillText(stat.big, pad, bigY);

  // label — wrapped
  ctx.fillStyle = '#efe9da';
  const labelSize = fmt === 'square' ? 56 : 64;
  ctx.font = `600 ${labelSize}px ${FONT}`;
  const lines = wrapText(ctx, stat.label, w - pad * 2);
  let ly = bigY + bigSize + 50;
  const lineH = labelSize * 1.25;
  lines.forEach((l) => {
    ctx.fillText(l, pad, ly);
    ly += lineH;
  });

  // footer: source + site
  ctx.fillStyle = '#8f8a7c';
  ctx.font = `500 26px ${FONT}`;
  ctx.textBaseline = 'bottom';
  ctx.fillText('Figures from public sources · shetlandj.github.io/hmg', pad, h - pad - 26);

  // brand band
  ctx.fillStyle = '#fff06b';
  ctx.fillRect(0, h - 14, w, 14);
}

export function initShareCard(root) {
  const stats = buildStats();

  root.innerHTML = `
    <div class="share-controls">
      <label class="share-field">
        <span>Stat</span>
        <select id="share-stat"></select>
      </label>
      <label class="share-field">
        <span>Format</span>
        <select id="share-format">
          <option value="square">Square — feed post</option>
          <option value="story">Story — full screen</option>
        </select>
      </label>
      <button id="share-download" type="button">Download PNG</button>
    </div>
    <div class="share-preview">
      <canvas id="share-canvas" aria-label="Preview of the shareable graphic"></canvas>
    </div>
  `;

  const statSel = root.querySelector('#share-stat');
  const fmtSel = root.querySelector('#share-format');
  const canvas = root.querySelector('#share-canvas');
  const dlBtn = root.querySelector('#share-download');

  stats.forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `${s.big} — ${s.label}`.slice(0, 70);
    statSel.appendChild(opt);
  });

  const render = () => draw(canvas, stats[+statSel.value], fmtSel.value);
  statSel.addEventListener('change', render);
  fmtSel.addEventListener('change', render);
  render();

  dlBtn.addEventListener('click', () => {
    const slug = stats[+statSel.value].big.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shetland-${slug}-${fmtSel.value}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  });
}
