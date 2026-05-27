// In-vs-out comparison bars + context chips. Plain DOM, animated on reveal.

export function renderValue(container, vfm) {
  const max = Math.max(vfm.paysIn, vfm.getsBack);
  const pct = (v) => `${(v / max) * 100}%`;

  const wrap = document.createElement('div');
  wrap.className = 'vbars';
  wrap.innerHTML = `
    <div class="vbar-row">
      <div class="vb-top"><span>Roughly paid in (income tax, est.)</span><b>£${vfm.paysIn}m</b></div>
      <div class="vbar-track"><div class="vbar-fill in" data-w="${pct(vfm.paysIn)}"></div></div>
    </div>
    <div class="vbar-row">
      <div class="vb-top"><span>Scottish Government spend in Shetland</span><b>£${vfm.getsBack}m</b></div>
      <div class="vbar-track"><div class="vbar-fill out" data-w="${pct(vfm.getsBack)}"></div></div>
    </div>
  `;

  const chips = document.createElement('div');
  chips.className = 'chips';
  vfm.context.forEach((c) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.innerHTML = `<b>${c.value}</b> ${c.label} <span>— ${c.note}</span>`;
    chips.appendChild(chip);
  });

  const caveat = document.createElement('p');
  caveat.className = 'caveat';
  caveat.textContent = vfm.caveat;

  container.innerHTML = '';
  container.appendChild(wrap);
  container.appendChild(chips);
  container.appendChild(caveat);

  // animate the fills when scrolled into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          wrap.querySelectorAll('.vbar-fill').forEach((f) => (f.style.width = f.dataset.w));
          io.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  io.observe(wrap);
}
