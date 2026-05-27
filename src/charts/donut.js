// Hand-rolled SVG donut for the SIC budget split. No library.

const SVGNS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}) {
  const node = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

// arc path for a donut segment
function arc(cx, cy, rOuter, rInner, startAng, endAng) {
  const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const large = endAng - startAng > Math.PI ? 1 : 0;
  const [x1, y1] = p(rOuter, startAng);
  const [x2, y2] = p(rOuter, endAng);
  const [x3, y3] = p(rInner, endAng);
  const [x4, y4] = p(rInner, startAng);
  return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`;
}

const COLOURS = ['#f4c81e', '#34506b', '#cfc8b6', '#e7e0cf'];

export function renderDonut(container, budget) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 118;
  const rInner = 72;

  const svg = el('svg', {
    viewBox: `0 0 ${size} ${size}`,
    width: '100%',
    style: 'max-width:300px;display:block;margin:0 auto;',
    role: 'img',
    'aria-label': `SIC budget: ${budget.parts.map((p) => `${p.label} ${p.pct}%`).join(', ')}`,
  });

  let ang = -Math.PI / 2;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  budget.parts.forEach((part, i) => {
    const sweep = (part.pct / 100) * Math.PI * 2;
    const path = el('path', { d: arc(cx, cy, rOuter, rInner, ang, ang + sweep), fill: COLOURS[i % COLOURS.length] });
    if (!reduceMotion) {
      path.style.opacity = '0';
      path.style.transition = `opacity 0.5s ${i * 0.12}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => (path.style.opacity = '1')));
    }
    svg.appendChild(path);
    ang += sweep;
  });

  // centre label: the headline number
  const big = el('text', { x: cx, y: cy - 2, 'text-anchor': 'middle', 'font-size': '30', 'font-weight': '800', fill: '#1b1b1b' });
  big.textContent = '67%';
  const small = el('text', { x: cx, y: cy + 20, 'text-anchor': 'middle', 'font-size': '12', fill: '#6b6b6b' });
  small.textContent = 'from Holyrood';
  svg.appendChild(big);
  svg.appendChild(small);

  container.innerHTML = '';
  container.appendChild(svg);

  const legend = document.createElement('ul');
  legend.className = 'legend';
  budget.parts.forEach((part, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="sw" style="background:${COLOURS[i % COLOURS.length]}"></span>` +
      `<span class="lg-label">${part.label}</span>` +
      `<span class="lg-val">£${part.value.toFixed(1)}m</span>` +
      `<span class="lg-pct">${part.pct}%</span>`;
    legend.appendChild(li);
  });
  container.appendChild(legend);
}
