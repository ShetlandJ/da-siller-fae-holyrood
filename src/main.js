import './styles.css';
import {
  headline,
  fundingSources,
  sicBudget,
  valueForMoney,
  themes,
  achievements,
  sourcesList,
} from './data.js';
import { countUp, wireReveal } from './charts/countup.js';
import { renderTreemap } from './charts/treemap.js';
import { renderFundingBars } from './charts/fundingbars.js';
import { renderDonut } from './charts/donut.js';
import { renderValue } from './charts/bars.js';
import { initShareCard } from './charts/sharecard.js';
import { statCard } from './components/statCard.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="hero">
    <div class="wrap">
      <p class="kicker">Scottish Government funding</p>
      <h1>What Scotland spends in Shetland</h1>
      <p class="lede">The Scottish Government puts more than a quarter of a billion pounds into Shetland every year. Here's where it comes from — and what it pays for.</p>
      <div class="hero-figures">
        <span class="bignum">
          <span class="n" id="n-total">£0</span>
          <span class="cap">a year from the Scottish Government</span>
        </span>
        <span class="bignum">
          <span class="n" id="n-head">£0</span>
          <span class="cap">for every woman, man and child</span>
        </span>
      </div>
      <p class="hero-relatable">That's about <b>£212 a week</b> for every person — over <b>£800 a week</b> for a household of four.</p>
      <p class="hero-link"><a href="./visits.html">See also: <b>Around Shetland</b> — where she's been across the islands <span aria-hidden="true">→</span></a></p>
    </div>
  </header>

  <main>
    <section class="block">
      <div class="wrap">
        <div class="section-head reveal">
          <p class="eyebrow">Section one</p>
          <h2>Whar's it aa come fae?</h2>
          <p>The £254m breaks down like this. Bigger means more money. Tap any block for the detail and source — the third-sector grants open up further.</p>
        </div>
        <div class="treemap-shell reveal">
          <div id="treemap"></div>
          <div id="funding-bars"></div>
          <div class="detail" id="tm-detail">
            <div class="d-head"><h4>Click a block to see the detail</h4></div>
            <p>Every figure is drawn from public budget documents — sources are listed at the foot of the page.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="block">
      <div class="wrap">
        <div class="cols">
          <div class="panel reveal">
            <h3>Who actually pays for the council?</h3>
            <p class="sub">SIC's £178.4m budget to run council services, 2025/26.</p>
            <div id="donut"></div>
          </div>
          <div class="panel reveal">
            <h3>Are we paying our way?</h3>
            <p class="sub">Shetland more than pulls its weight.</p>
            <div id="value"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="block">
      <div class="wrap">
        <div class="section-head reveal">
          <p class="eyebrow">Section two</p>
          <h2>Whits da SNP dun fur Shetland?</h2>
          <p>Beyond the headline funding, here's what that money has delivered on the ground. A handful of figures are flagged <span class="verify-chip">to verify</span> — they need checking against a named source before publication.</p>
        </div>
        <div id="achievements"></div>
      </div>
    </section>

    <section class="block">
      <div class="wrap">
        <div class="section-head reveal">
          <p class="eyebrow">Share it</p>
          <h2>Mak a graphic ta share</h2>
          <p>Pick a figure and download a ready-made card for Facebook or Instagram. Square for a feed post, or full-screen for a story.</p>
        </div>
        <div id="sharecard" class="reveal"></div>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <h3>Sources</h3>
      <ol id="sources"></ol>
      <p class="note"><b>About this page.</b> An independent visualisation compiled from public documents to show the scale of Scottish Government funding in Shetland. Figures are presented as published; those marked "to verify" are not yet tied to a named source. Not produced or paid for by any party.</p>
    </div>
  </footer>
`;

// --- Hero counters --------------------------------------------------------
countUp(document.querySelector('#n-total'), headline.total, {
  format: (n) => `£${n.toFixed(0)}m`,
});
countUp(document.querySelector('#n-head'), headline.perHead, {
  format: (n) => `£${Math.round(n).toLocaleString('en-GB')}`,
});

// --- Funding viz (treemap on desktop, bar list on mobile) + detail panel --
const detail = document.querySelector('#tm-detail');
const onFundingSelect = (sel) => {
  if (!sel) {
    detail.innerHTML = `<div class="d-head"><h4>Tap a block to see the detail</h4></div><p>Every figure is drawn from public budget documents — sources are listed at the foot of the page.</p>`;
    return;
  }
  if (sel.drilled) {
    detail.innerHTML = `<div class="d-head"><h4>${sel.label}</h4><span class="d-val">£${sel.value.toFixed(1)}m</span></div><p>${sel.detail}</p><p class="src">Source: ${sel.source}. Now showing the seven grants that make up this total.</p>`;
    return;
  }
  const val = sel.value >= 1 ? `£${sel.value.toFixed(1)}m` : `£${Math.round(sel.value * 1e6).toLocaleString('en-GB')}`;
  detail.innerHTML = `<div class="d-head"><h4>${sel.label}</h4><span class="d-val">${val}</span></div>` +
    (sel.detail ? `<p>${sel.detail}</p>` : '') +
    (sel.source ? `<p class="src">Source: ${sel.source}</p>` : '');
};
renderTreemap(document.querySelector('#treemap'), fundingSources, onFundingSelect);
renderFundingBars(document.querySelector('#funding-bars'), fundingSources, onFundingSelect);

// --- Donut + value bars ---------------------------------------------------
renderDonut(document.querySelector('#donut'), sicBudget);
renderValue(document.querySelector('#value'), valueForMoney);

// --- Achievement cards, grouped by theme ----------------------------------
const achWrap = document.querySelector('#achievements');
themes.forEach((theme) => {
  const items = achievements.filter((a) => a.theme === theme.id);
  if (!items.length) return;
  const group = document.createElement('div');
  group.className = 'theme-group reveal';
  const h = document.createElement('h3');
  h.textContent = theme.label;
  group.appendChild(h);
  const grid = document.createElement('div');
  grid.className = 'cards';
  items.forEach((a) => grid.appendChild(statCard(a)));
  group.appendChild(grid);
  achWrap.appendChild(group);
});

// --- Share-card generator -------------------------------------------------
initShareCard(document.querySelector('#sharecard'));

// --- Sources list ---------------------------------------------------------
const srcOl = document.querySelector('#sources');
sourcesList.forEach((s) => {
  const li = document.createElement('li');
  li.innerHTML = `<b>${s.key}</b> — ${s.text}`;
  srcOl.appendChild(li);
});

// --- Reveal-on-scroll -----------------------------------------------------
wireReveal();
