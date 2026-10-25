import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../hero-parallax.js', import.meta.url), 'utf8');
function events(extra = {}) {
  const listeners = new Map();
  return Object.assign({
    listeners,
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    emit(type, event = {}) { return Promise.all([...listeners.get(type) || []].map(fn => fn(event))); }
  }, extra);
}
function setup({coarse = false, reduced = false, permission = 'granted', secure = true, api = true, css = true} = {}) {
  const styles = new Map(), frames = new Map(), timers = new Map();
  const hero = events({
    style: {setProperty: (key, value) => styles.set(key, value), removeProperty: key => styles.delete(key)},
    getBoundingClientRect: () => ({left: 10, top: 20, width: 1000, height: 700})
  });
  const button = events({hidden: true, disabled: false, textContent: ''});
  const status = {textContent: ''};
  const media = {
    reduced: events({matches: reduced}), fine: events({matches: !coarse}), coarse: events({matches: coarse})
  };
  const document = events({hidden: false, querySelector: selector => ({
    '.hero': hero, '.hero-sensor-toggle': button, '.sensor-status': status
  })[selector]});
  let id = 0, time = 0, observer, permissionCalls = 0;
  const orientation = events({angle: 0});
  const window = events({
    CSS: {supports: () => css}, isSecureContext: secure, screen: {orientation},
    matchMedia: query => query.includes('reduced') ? media.reduced : query.includes('coarse') ? media.coarse : media.fine,
    requestAnimationFrame: fn => { const key = ++id; frames.set(key, fn); return key; },
    cancelAnimationFrame: key => frames.delete(key),
    setTimeout: fn => { const key = ++id; timers.set(key, fn); return key; },
    clearTimeout: key => timers.delete(key),
    IntersectionObserver: class { constructor(callback) { observer = callback; } observe() {} }
  });
  if (api) window.DeviceOrientationEvent = permission === 'android' ? {} : {
    requestPermission() {
      permissionCalls++;
      return typeof permission === 'function' ? permission() : Promise.resolve(permission);
    }
  };
  vm.runInNewContext(source, {window, document, console});
  const numbers = () => ['--parallax-x', '--parallax-y', '--parallax-rx', '--parallax-ry'].map(key => parseFloat(styles.get(key) || 0));
  function step() {
    const queued = [...frames]; frames.clear(); time += 16.67;
    queued.forEach(([, fn]) => fn(time));
    numbers().forEach((value, index) => assert.ok(Number.isFinite(value) && Math.abs(value) <= (index < 2 ? 12 : 5)));
  }
  function settle() {
    let count = 0;
    while (frames.size && count++ < 200) step();
    assert.equal(frames.size, 0, 'RAF deve encerrar quando o alvo estabiliza');
  }
  observer?.([{isIntersecting: true}]);
  return {hero, button, status, media, window, document, styles, frames, timers, orientation, numbers, step, settle,
    visible: value => observer?.([{isIntersecting: value}]), permissionCalls: () => permissionCalls};
}

test('cursor: interpolação, limite, retorno neutro e encerramento do RAF', async () => {
  const h = setup();
  assert.equal(h.frames.size, 0);
  await h.hero.emit('pointermove', {pointerType: 'mouse', clientX: 3000, clientY: 2000});
  h.step();
  assert.ok(h.numbers()[0] > 0 && h.numbers()[0] < 12, 'primeiro frame deve interpolar');
  h.settle();
  assert.deepEqual(h.numbers(), [12, 12, -5, 5]);
  await h.hero.emit('pointerleave'); h.step();
  assert.ok(h.numbers()[0] > 0 && h.numbers()[0] < 12);
  h.settle(); assert.ok(h.numbers().every(value => value === 0));
});

test('toque não movimenta; preferência reduzida neutraliza', async () => {
  const h = setup();
  await h.hero.emit('pointermove', {pointerType: 'touch', clientX: 1000, clientY: 700});
  assert.equal(h.frames.size, 0);
  await h.hero.emit('pointermove', {pointerType: 'mouse', clientX: 900, clientY: 500}); h.step();
  h.media.reduced.matches = true; await h.media.reduced.emit('change');
  assert.equal(h.frames.size, 0); assert.equal(h.styles.size, 0);
  await h.hero.emit('pointermove', {pointerType: 'mouse', clientX: 900, clientY: 500});
  assert.equal(h.frames.size, 0);
});

test('permissão só é solicitada pelo clique; calibração e orientação de tela', async () => {
  const h = setup({coarse: true});
  assert.equal(h.permissionCalls(), 0); assert.equal(h.window.listeners.get('deviceorientation')?.size || 0, 0);
  assert.equal(h.button.hidden, false);
  await h.button.emit('click'); assert.equal(h.permissionCalls(), 1);
  await h.window.emit('deviceorientation', {beta: null, gamma: null});
  assert.equal(h.frames.size, 0);
  await h.window.emit('deviceorientation', {beta: 40, gamma: 10}); h.settle();
  assert.ok(h.numbers().every(value => value === 0));
  await h.window.emit('deviceorientation', {beta: 58, gamma: 28}); h.settle();
  assert.deepEqual(h.numbers(), [12, 12, -5, 5]);
  h.orientation.angle = 90; await h.orientation.emit('change'); h.settle();
  await h.window.emit('deviceorientation', {beta: 45, gamma: 5}); h.settle();
  await h.window.emit('deviceorientation', {beta: 63, gamma: 5}); h.settle();
  assert.equal(h.numbers()[0], 12); assert.ok(Math.abs(h.numbers()[1]) < .001);
  await h.button.emit('click'); h.settle();
  assert.equal(h.window.listeners.get('deviceorientation').size, 0);
  assert.ok(h.numbers().every(value => value === 0));
});

test('Android sem requestPermission e passagem por ±180°', async () => {
  const h = setup({coarse: true, permission: 'android'});
  await h.button.emit('click'); assert.equal(h.permissionCalls(), 0);
  await h.window.emit('deviceorientation', {beta: 170, gamma: 0}); h.settle();
  await h.window.emit('deviceorientation', {beta: -175, gamma: 0}); h.settle();
  assert.equal(h.numbers()[1], 10);
});

test('recusa, erro e sensor sem dados deixam fallback estático', async () => {
  for (const permission of ['denied', () => Promise.reject(new Error('blocked'))]) {
    const h = setup({coarse: true, permission});
    await h.button.emit('click');
    assert.equal(h.button.disabled, true); assert.equal(h.frames.size, 0);
    assert.equal(h.window.listeners.get('deviceorientation')?.size || 0, 0);
    assert.ok(h.status.textContent.length > 0);
  }
  const h = setup({coarse: true}); await h.button.emit('click');
  [...h.timers.values()].forEach(fn => fn());
  assert.equal(h.button.disabled, true); assert.equal(h.styles.size, 0);
});

test('ocultar hero/aba cancela frames, desliga listener e recalibra na volta', async () => {
  const h = setup({coarse: true}); await h.button.emit('click');
  await h.window.emit('deviceorientation', {beta: 20, gamma: 0}); h.settle();
  await h.window.emit('deviceorientation', {beta: 35, gamma: 18}); h.step();
  h.visible(false); assert.equal(h.frames.size, 0); assert.equal(h.styles.size, 0);
  assert.equal(h.window.listeners.get('deviceorientation').size, 0);
  h.visible(true);
  await h.window.emit('deviceorientation', {beta: -30, gamma: -50}); h.settle();
  assert.ok(h.numbers().every(value => value === 0));
  h.document.hidden = true; await h.document.emit('visibilitychange');
  assert.equal(h.styles.size, 0); assert.equal(h.window.listeners.get('deviceorientation').size, 0);
  h.document.hidden = false; await h.document.emit('visibilitychange');
  assert.equal(h.window.listeners.get('deviceorientation').size, 1);
});

test('reduzir movimento durante pedido pendente impede ativação após resposta', async () => {
  let grant;
  const h = setup({coarse: true, permission: () => new Promise(resolve => { grant = resolve; })});
  const click = h.button.emit('click'); assert.equal(h.button.disabled, true);
  h.media.reduced.matches = true; await h.media.reduced.emit('change');
  grant('granted'); await click;
  assert.equal(h.button.hidden, true); assert.equal(h.frames.size, 0);
  assert.equal(h.window.listeners.get('deviceorientation')?.size || 0, 0);
});

test('API ausente, HTTP, CSS incompatível e movimento reduzido mantêm estático', async () => {
  for (const option of [{api: false}, {secure: false}, {css: false}, {reduced: true}]) {
    const h = setup({coarse: true, ...option});
    assert.equal(h.button.hidden, true);
    await h.button.emit('click');
    assert.equal(h.permissionCalls(), 0); assert.equal(h.styles.size, 0); assert.equal(h.frames.size, 0);
  }
});
