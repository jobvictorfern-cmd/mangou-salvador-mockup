'use strict';
document.documentElement.classList.add('js');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
menuToggle.hidden = false;
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  menu.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', open);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menuToggle.focus();
  }
});
window.matchMedia('(min-width: 900px)').addEventListener('change', closeMenu);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const elements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-waiting');
        reveal.unobserve(entry.target);
      }
    });
  }, {rootMargin: '0px 0px 30px 0px', threshold: 0.06});
  elements.forEach(element => { element.classList.add('is-waiting'); reveal.observe(element); });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      elements.forEach(element => element.classList.remove('is-waiting'));
      reveal.disconnect();
    }
  });
}
const hero = document.querySelector('.hero');
let scrollFrame = 0, heroVisible = true;
function updateScroll() {
  scrollFrame = 0;
  if (reducedMotion.matches || !heroVisible || document.hidden) return;
  const progress = Math.max(0, Math.min(hero.offsetHeight, -hero.getBoundingClientRect().top));
  hero.style.setProperty('--scroll-cup', (progress * .035).toFixed(2) + 'px');
  hero.style.setProperty('--scroll-strips', (progress * -.05).toFixed(2) + 'px');
}
function requestScroll() {
  if (!scrollFrame && heroVisible && !document.hidden && !reducedMotion.matches) scrollFrame = requestAnimationFrame(updateScroll);
}
window.addEventListener('scroll', requestScroll, {passive:true});
if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
  heroVisible = entries[0].isIntersecting;
  if (heroVisible) requestScroll();
}).observe(hero);
document.addEventListener('visibilitychange', requestScroll);
reducedMotion.addEventListener('change', () => {
  hero.style.removeProperty('--scroll-cup'); hero.style.removeProperty('--scroll-strips'); requestScroll();
});
document.querySelector('#year').textContent = new Date().getFullYear();
