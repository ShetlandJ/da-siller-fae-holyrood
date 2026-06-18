// Standalone share-card page. Just the social-media graphic generator —
// the same canvas tool that lives on the home page, on its own URL so it
// can be linked or bookmarked directly. Figures still flow from data.js
// via sharecard.js, so the cards stay in sync with the main site.
import './styles.css';
import { initShareCard } from './charts/sharecard.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="hero">
    <div class="wrap">
      <p class="kicker">What Scotland spends in Shetland</p>
      <h1>Mak a graphic ta share</h1>
      <p class="lede">Pick a figure and download a ready-made card for Facebook or Instagram. Square for a feed post, or full-screen for a story.</p>
      <p class="hero-link"><a href="./index.html"><span aria-hidden="true">←</span> Back to the full breakdown of where the <b>£254m a year</b> comes from</a></p>
    </div>
  </header>

  <main>
    <section class="block">
      <div class="wrap">
        <div id="sharecard"></div>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <p class="note"><b>About this page.</b> An independent visualisation compiled from public documents to show the scale of Scottish Government funding in Shetland. Figures are presented as published. Not produced or paid for by any party.</p>
    </div>
  </footer>
`;

initShareCard(document.querySelector('#sharecard'));
