// "Are we paying our way?" — the honest version.
//
// The old two-bar in-vs-out comparison drew £70m "in" against £254m "out", which
// invited a "Shetland is subsidised" read off a number we openly admit is only
// ~28% of the real contribution (VAT and corporation tax raised here aren't
// published). So instead: lead with the solid evidence (Shetland's economy is
// bigger per head than Scotland's or the UK's), then show the tax contribution
// as "at least £70m" trailing off into the unmeasured part — honest about what
// we can't count, without a misleading head-to-head.

export function renderValue(container, vfm) {
  container.innerHTML = '';

  // The evidence: per-head economy chips.
  const chips = document.createElement('div');
  chips.className = 'chips';
  vfm.context.forEach((c) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.innerHTML = `<b>${c.value}</b> ${c.label} <span>— ${c.note}</span>`;
    chips.appendChild(chip);
  });
  container.appendChild(chips);

  // The contribution bar: a known portion + an open-ended, hatched unknown.
  const contrib = document.createElement('div');
  contrib.className = 'contrib';
  contrib.innerHTML = `
    <div class="contrib-label">What Shetland pays in to the UK Treasury</div>
    <div class="contrib-track">
      <div class="contrib-known">£${vfm.paysIn}m income tax</div>
      <div class="contrib-unknown">+ VAT &amp; corp tax (not published) →</div>
    </div>
  `;
  container.appendChild(contrib);

  const note = document.createElement('p');
  note.className = 'caveat';
  note.innerHTML =
    'Shetland produces more per head than Scotland or the UK and contributes at least £70m in income tax — plus VAT and corporation tax that the Treasury doesn’t break out. The £254m isn’t charity: it’s the real cost of running schools, hospitals and ferries across scattered islands.';
  container.appendChild(note);

  // animate the known bar growing in
  const known = contrib.querySelector('.contrib-known');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          known.classList.add('grown');
          io.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  io.observe(contrib);
}
