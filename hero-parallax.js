(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero || !window.requestAnimationFrame ||
      !window.IntersectionObserver || !window.CSS?.supports('transform', 'perspective(1px) rotateX(1deg)')) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  let visible = false;
  let targetX = 0, targetY = 0, x = 0, y = 0, frame = 0, lastTime = 0;
  const properties = ['--parallax-x', '--parallax-y', '--parallax-rx', '--parallax-ry'];
  const clamp = value => Math.max(-1, Math.min(1, value));
  const allowed = () => visible && !document.hidden && !reduced.matches;

  function reset() {
    window.cancelAnimationFrame(frame);
    frame = lastTime = targetX = targetY = x = y = 0;
    properties.forEach(property => hero.style.removeProperty(property));
  }
  function render(time) {
    frame = 0;
    if (!allowed()) { reset(); return; }
    const elapsed = lastTime ? Math.min(64, Math.max(0, time - lastTime)) : 16.67;
    const blend = 1 - Math.exp(-elapsed / 110);
    lastTime = time;
    x += (targetX - x) * blend;
    y += (targetY - y) * blend;
    const settled = Math.abs(targetX - x) < .001 && Math.abs(targetY - y) < .001;
    if (settled) { x = targetX; y = targetY; lastTime = 0; }
    hero.style.setProperty(properties[0], (x * 12).toFixed(3) + 'px');
    hero.style.setProperty(properties[1], (y * 12).toFixed(3) + 'px');
    hero.style.setProperty(properties[2], (-y * 5).toFixed(3) + 'deg');
    hero.style.setProperty(properties[3], (x * 5).toFixed(3) + 'deg');
    if (!settled) frame = window.requestAnimationFrame(render);
  }
  function target(nextX, nextY) {
    if (!allowed()) return;
    targetX = clamp(nextX);
    targetY = clamp(nextY);
    if (!frame) frame = window.requestAnimationFrame(render);
  }
  function sync() {
    if (!allowed()) reset();
  }
  hero.addEventListener('pointermove', event => {
    if (!fine.matches || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    target((event.clientX - rect.left) / rect.width * 2 - 1,
      (event.clientY - rect.top) / rect.height * 2 - 1);
  }, {passive: true});
  hero.addEventListener('pointerleave', () => { target(0, 0); });
  hero.addEventListener('pointercancel', () => { target(0, 0); });
  new window.IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }).observe(hero);
  reduced.addEventListener('change', sync);
  fine.addEventListener('change', () => { reset(); sync(); });
  document.addEventListener('visibilitychange', sync);
})();
