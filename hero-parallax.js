(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  const button = document.querySelector('.hero-sensor-toggle');
  const status = document.querySelector('.sensor-status');
  if (!hero || !button || !status || !window.requestAnimationFrame ||
      !window.IntersectionObserver || !window.CSS?.supports('transform', 'perspective(1px) rotateX(1deg)')) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const coarse = window.matchMedia('(pointer: coarse)');
  const Sensor = window.DeviceOrientationEvent;
  const sensorsSupported = window.isSecureContext && !!Sensor;
  let visible = false;
  let targetX = 0, targetY = 0, x = 0, y = 0, frame = 0, lastTime = 0;
  let sensorEnabled = false, sensorListening = false, pending = false, unavailable = false;
  let baseline = null, sensorTimer = 0;
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
  function updateButton() {
    button.hidden = !sensorsSupported || !coarse.matches || reduced.matches;
    button.disabled = pending || unavailable;
    button.textContent = unavailable ? 'Movimento indisponível' : pending ? 'Ativando…' :
      sensorEnabled ? 'Desativar movimento' : 'Ativar movimento';
  }
  function stopSensors() {
    window.removeEventListener('deviceorientation', onOrientation);
    window.clearTimeout(sensorTimer);
    sensorTimer = 0;
    sensorListening = false;
    baseline = null;
  }
  function failSensors(message) {
    sensorEnabled = false;
    unavailable = true;
    stopSensors();
    reset();
    status.textContent = message;
    updateButton();
  }
  function onOrientation(event) {
    if (!sensorEnabled || !allowed() || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    window.clearTimeout(sensorTimer);
    if (!baseline) baseline = {beta: event.beta, gamma: event.gamma};
    // Compensa a posição de uso e a rotação da tela, incluindo a passagem por ±180°.
    const beta = ((event.beta - baseline.beta + 540) % 360) - 180;
    const gamma = event.gamma - baseline.gamma;
    const angle = (window.screen?.orientation?.angle ?? window.orientation ?? 0) * Math.PI / 180;
    target((gamma * Math.cos(angle) + beta * Math.sin(angle)) / 18,
      (beta * Math.cos(angle) - gamma * Math.sin(angle)) / 18);
  }
  function listenSensors() {
    if (sensorListening) return;
    sensorListening = true;
    window.addEventListener('deviceorientation', onOrientation, {passive: true});
    sensorTimer = window.setTimeout(() => {
      failSensors('Sensor indisponível. O copo permanece estático.');
    }, 3000);
  }
  function sync() {
    if (reduced.matches || !coarse.matches) sensorEnabled = false;
    if (!allowed() || !sensorEnabled) stopSensors();
    if (!allowed()) reset();
    else if (sensorEnabled) listenSensors();
    updateButton();
  }
  hero.addEventListener('pointermove', event => {
    if (!fine.matches || sensorEnabled || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    target((event.clientX - rect.left) / rect.width * 2 - 1,
      (event.clientY - rect.top) / rect.height * 2 - 1);
  }, {passive: true});
  hero.addEventListener('pointerleave', () => { if (!sensorEnabled) target(0, 0); });
  hero.addEventListener('pointercancel', () => { if (!sensorEnabled) target(0, 0); });
  button.addEventListener('click', async () => {
    if (pending || unavailable || !allowed() || !sensorsSupported || !coarse.matches) return;
    if (sensorEnabled) {
      sensorEnabled = false;
      stopSensors();
      target(0, 0);
      status.textContent = 'Movimento por inclinação desativado.';
      updateButton();
      return;
    }
    pending = true;
    updateButton();
    try {
      // A chamada de permissão ocorre somente nesta interação explícita.
      const permission = typeof Sensor.requestPermission === 'function' ? await Sensor.requestPermission() : 'granted';
      if (permission !== 'granted') {
        failSensors('Permissão não concedida. O copo permanece estático.');
      } else if (allowed() && coarse.matches) {
        sensorEnabled = true;
        listenSensors();
        status.textContent = 'Movimento ativado. Incline suavemente o aparelho.';
      }
    } catch {
      failSensors('Não foi possível ativar o sensor. O copo permanece estático.');
    } finally {
      pending = false;
      updateButton();
    }
  });
  new window.IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }).observe(hero);
  reduced.addEventListener('change', sync);
  coarse.addEventListener('change', () => { reset(); sync(); });
  fine.addEventListener('change', () => { reset(); sync(); });
  document.addEventListener('visibilitychange', sync);
  window.screen?.orientation?.addEventListener('change', () => { baseline = null; target(0, 0); });
  window.addEventListener('orientationchange', () => { baseline = null; target(0, 0); });
  updateButton();
})();
