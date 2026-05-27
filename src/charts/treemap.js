// Hand-rolled squarified treemap in SVG — no charting library.
// Squarify algorithm (Bruls, Huizing & van Wijk) keeps tiles close to square
// so labels read well. Clicking a tile shows detail; a tile with children
// drills in, with a "back" control to return to the top level.

const W = 1000;
const H = 560;

const SVGNS = 'http://www.w3.org/2000/svg';

// Colour encodes magnitude: the bigger the block, the deeper the gold. Keyed to
// value (not rank) so the two giants — council grant + NHS, ~82% of the total —
// read as the heaviest blocks and the long tail of grants stays pale. sqrt scale
// stops the smaller tiles all collapsing to the same pale shade.
const C_LIGHT = [0xff, 0xe8, 0x76]; // pale warm yellow
const C_DARK = [0xe0, 0x96, 0x1a]; // amber

function colourForValue(v, maxV) {
  const t = maxV > 0 ? Math.sqrt(v / maxV) : 0;
  const ch = (i) => Math.round(C_LIGHT[i] + (C_DARK[i] - C_LIGHT[i]) * t);
  return `rgb(${ch(0)}, ${ch(1)}, ${ch(2)})`;
}

function el(name, attrs = {}) {
  const node = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

// --- squarify -------------------------------------------------------------
function worst(row, w, total, areaScale) {
  const sum = row.reduce((a, r) => a + r.area, 0) * areaScale;
  const max = Math.max(...row.map((r) => r.area)) * areaScale;
  const min = Math.min(...row.map((r) => r.area)) * areaScale;
  const w2 = w * w;
  const s2 = sum * sum;
  return Math.max((w2 * max) / s2, s2 / (w2 * min));
}

function layout(items, x, y, w, h) {
  // items: [{...data, area}] where area is proportional to value.
  const total = items.reduce((a, i) => a + i.area, 0);
  const rect = { x, y, w, h, total };
  const placed = [];
  squarify([...items], [], rect, placed);
  return placed;
}

function squarify(children, row, rect, placed) {
  if (children.length === 0) {
    if (row.length) layoutRow(row, rect, placed);
    return;
  }
  const w = Math.min(rect.w, rect.h);
  const areaScale = (rect.w * rect.h) / rect.total;
  const next = children[0];
  const tryRow = [...row, next];
  if (row.length === 0 || worst(row, w, rect.total, areaScale) >= worst(tryRow, w, rect.total, areaScale)) {
    squarify(children.slice(1), tryRow, rect, placed);
  } else {
    layoutRow(row, rect, placed);
    const used = row.reduce((a, r) => a + r.area, 0) * areaScale;
    if (rect.w >= rect.h) {
      const rw = used / rect.h;
      squarify(children, [], { x: rect.x + rw, y: rect.y, w: rect.w - rw, h: rect.h, total: rect.total - row.reduce((a, r) => a + r.area, 0) }, placed);
    } else {
      const rh = used / rect.w;
      squarify(children, [], { x: rect.x, y: rect.y + rh, w: rect.w, h: rect.h - rh, total: rect.total - row.reduce((a, r) => a + r.area, 0) }, placed);
    }
  }
}

function layoutRow(row, rect, placed) {
  const areaScale = (rect.w * rect.h) / rect.total;
  const rowArea = row.reduce((a, r) => a + r.area, 0) * areaScale;
  if (rect.w >= rect.h) {
    const rw = rowArea / rect.h;
    let yy = rect.y;
    for (const item of row) {
      const ih = (item.area * areaScale) / rw;
      placed.push({ ...item, x: rect.x, y: yy, w: rw, h: ih });
      yy += ih;
    }
  } else {
    const rh = rowArea / rect.w;
    let xx = rect.x;
    for (const item of row) {
      const iw = (item.area * areaScale) / rh;
      placed.push({ ...item, x: xx, y: rect.y, w: iw, h: rh });
      xx += iw;
    }
  }
}

// --- render ---------------------------------------------------------------
export function renderTreemap(container, data, onSelect) {
  const svg = el('svg', {
    class: 'treemap',
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: 'xMidYMid meet',
    role: 'img',
    'aria-label': 'Treemap of where Shetland’s Scottish Government money comes from',
  });
  container.innerHTML = '';
  container.appendChild(svg);

  const draw = (items, { backTo = null } = {}) => {
    svg.innerHTML = '';
    const topPad = backTo ? 34 : 0;
    const sorted = [...items].sort((a, b) => b.value - a.value).map((d) => ({ ...d, area: d.value }));
    const placed = layout(sorted, 2, 2 + topPad, W - 4, H - 4 - topPad);
    const maxV = Math.max(...placed.map((p) => p.value));

    placed.forEach((p, i) => {
      const g = el('g', { class: 'tm-tile' });
      g.appendChild(el('rect', { x: p.x, y: p.y, width: Math.max(0, p.w - 2), height: Math.max(0, p.h - 2), rx: 4, fill: colourForValue(p.value, maxV) }));
      const fmt = `£${p.value >= 10 ? p.value.toFixed(0) : p.value.toFixed(p.value < 1 ? 2 : 1)}m`;
      if (p.w > 70 && p.h > 34) {
        // wide enough: label and value stacked horizontally
        const tx = p.x + 10;
        const label = el('text', { class: 'tm-label', x: tx, y: p.y + 22 });
        label.textContent = p.label;
        svgTextClip(label, p.w - 18);
        const val = el('text', { class: 'tm-val', x: tx, y: p.y + 40 });
        val.textContent = fmt;
        g.appendChild(label);
        g.appendChild(val);
      } else if (p.h > 78 && p.w > 30) {
        // narrow but tall: read the label vertically up the tile
        const lx = p.x + 18;
        const by = p.y + p.h - 10;
        const label = el('text', { class: 'tm-label', x: lx, y: by, transform: `rotate(-90 ${lx} ${by})` });
        label.textContent = p.label;
        svgTextClip(label, p.h - 20);
        g.appendChild(label);
        if (p.w > 46) {
          const vx = lx + 17;
          const val = el('text', { class: 'tm-val', x: vx, y: by, transform: `rotate(-90 ${vx} ${by})` });
          val.textContent = fmt;
          g.appendChild(val);
        }
      }
      g.addEventListener('click', () => {
        if (p.children) {
          draw(p.children, { backTo: items });
          onSelect && onSelect({ ...p, drilled: true });
        } else {
          onSelect && onSelect(p);
        }
      });
      svg.appendChild(g);
    });

    if (backTo) {
      const back = el('text', { class: 'tm-back', x: 6, y: 22 });
      back.textContent = '← Back to all funding';
      back.addEventListener('click', () => {
        draw(backTo);
        onSelect && onSelect(null);
      });
      svg.appendChild(back);
    }
  };

  draw(data);
}

// crude truncation so long labels don't overflow tiles
function svgTextClip(textNode, maxPx) {
  const approxChar = 7.2;
  const max = Math.floor(maxPx / approxChar);
  const t = textNode.textContent;
  if (t.length > max && max > 1) textNode.textContent = t.slice(0, Math.max(1, max - 1)) + '…';
}
