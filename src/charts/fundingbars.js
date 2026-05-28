// Mobile-friendly alternative to the treemap. Same data and drill-down, but
// rendered as a stack of full-width rows: each row is tappable, the coloured
// bar inside it sized by value (linear, so area still encodes magnitude).
// On a narrow screen this is far more legible than a treemap squeezed into a
// 390px column. The treemap stays on desktop; CSS picks which one renders.

const C_LIGHT = [0xff, 0xe8, 0x76];
const C_DARK = [0xe0, 0x96, 0x1a];

function colourForValue(v, maxV) {
  const t = maxV > 0 ? Math.sqrt(v / maxV) : 0;
  const ch = (i) => Math.round(C_LIGHT[i] + (C_DARK[i] - C_LIGHT[i]) * t);
  return `rgb(${ch(0)}, ${ch(1)}, ${ch(2)})`;
}

function fmtVal(v) {
  if (v >= 10) return v.toFixed(0);
  if (v >= 1) return v.toFixed(1);
  return v.toFixed(2);
}

export function renderFundingBars(container, data, onSelect) {
  const draw = (items, { backTo } = {}) => {
    container.innerHTML = '';

    if (backTo) {
      const back = document.createElement('button');
      back.type = 'button';
      back.className = 'fb-back';
      back.textContent = '← Back to all funding';
      back.addEventListener('click', () => {
        draw(backTo);
        onSelect && onSelect(null);
      });
      container.appendChild(back);
    }

    const sorted = [...items].sort((a, b) => b.value - a.value);
    const maxV = sorted[0].value;

    sorted.forEach((s) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'fb-row';
      if (s.children) row.classList.add('fb-row--drill');
      const pct = Math.max(1.5, (s.value / maxV) * 100);
      const fill = colourForValue(s.value, maxV);
      row.innerHTML = `
        <span class="fb-bar" style="width:${pct}%;background:${fill}"></span>
        <span class="fb-text">
          <span class="fb-label">${s.label}${s.children ? ' →' : ''}</span>
          <span class="fb-val">£${fmtVal(s.value)}m</span>
        </span>
      `;
      row.addEventListener('click', () => {
        if (s.children) {
          draw(s.children, { backTo: items });
          onSelect && onSelect({ ...s, drilled: true });
        } else {
          onSelect && onSelect(s);
        }
      });
      container.appendChild(row);
    });
  };

  draw(data);
}
