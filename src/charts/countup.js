// Animated count-up that fires once when the element scrolls into view.
// Respects prefers-reduced-motion by jumping straight to the final value.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function countUp(el, target, { duration = 1400, format = (n) => Math.round(n).toLocaleString('en-GB') } = {}) {
  if (reduceMotion) {
    el.textContent = format(target);
    return;
  }
  let started = false;
  const run = () => {
    if (started) return;
    started = true;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = format(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = format(target);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  io.observe(el);
}

// Generic "reveal on scroll" wiring for any .reveal elements.
// The entrance animation is pure polish — it must NEVER leave content hidden.
// So: reveal on any intersection (threshold 0, not a ratio that a tall element
// on a narrow screen can never reach), bail to fully-visible if the API is
// missing, and a safety timer force-reveals anything still hidden.
export function wireReveal(root = document) {
  const els = root.querySelectorAll('.reveal');
  const showAll = () => els.forEach((el) => el.classList.add('in'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' }
  );
  els.forEach((el) => io.observe(el));

  // Safety net: if the observer never fires (no scroll, odd timing), show it.
  setTimeout(showAll, 3000);
}
