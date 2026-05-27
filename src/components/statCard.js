// One achievement card. Renders the big number, label, source code and a
// "to verify" chip for figures the original briefing itself queried.

export function statCard(a) {
  const card = document.createElement('div');
  card.className = 'card' + (a.status === 'to-verify' ? ' is-verify' : '');

  const unit = a.unit ? `<span class="u">${a.unit}</span>` : '';
  const chip = a.status === 'to-verify' ? '<span class="verify-chip" title="Flagged for checking before publication">to verify</span>' : '';

  card.innerHTML = `
    <div class="c-num">${a.value}${unit}</div>
    <div class="c-label">${a.label}</div>
    <div class="c-foot">
      <span class="c-src">Source: ${a.source}</span>
      ${chip}
    </div>
  `;
  return card;
}
