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
function setup({coarse = false, reduced = false, css = true} = {}) {
  const styles = new Map(), frames = new Map();
  const hero = events({
    style: {setProperty: (key, value) => styles.set(key, value), removeProperty: key => styles.delete(key)},
    getBoundingClientRect: () => ({left: 10, top: 20, width: 1000, height: 700})
  });
  const media = {
    reduced: events({matches: reduced}), fine: events({matches: !coarse}), coarse: events({matches: coarse})
  };
  const document = events({hidden: false, querySelector: selector => ({
    '.hero': hero
  })[selector]});
  let id = 0, time = 0, observer, permissionCalls = 0;
  const window = events({
    CSS: {supports: () => css}, isSecureContext: true,
    matchMedia: query => query.includes('reduced') ? media.reduced : query.includes('coarse') ? media.coarse : media.fine,
    requestAnimationFrame: fn => { const key = ++id; frames.set(key, fn); return key; },
    cancelAnimationFrame: key => frames.delete(key),
    IntersectionObserver: class { constructor(callback) { observer = callback; } observe() {} }
  });
  window.DeviceOrientationEvent = {
    requestPermission() { permissionCalls++; return Promise.resolve('granted'); }
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
  return {hero, media, window, document, styles, frames, numbers, step, settle,
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

test('mobile não acessa sensores nem movimenta por toque', async () => {
  const h = setup({coarse: true});
  await h.hero.emit('pointermove', {pointerType: 'touch', clientX: 1000, clientY: 700});
  await h.hero.emit('pointermove', {pointerType: 'mouse', clientX: 1000, clientY: 700});
  assert.equal(h.frames.size, 0);
  assert.equal(h.permissionCalls(), 0);
  assert.equal(h.window.listeners.get('deviceorientation')?.size || 0, 0);
});

test('ocultar hero ou aba neutraliza e cancela o RAF; cursor retoma na volta', async () => {
  const h = setup();
  await h.hero.emit('pointermove', {pointerType: 'mouse', clientX: 900, clientY: 500}); h.step();
  h.visible(false);
  assert.equal(h.frames.size, 0); assert.equal(h.styles.size, 0);
  h.visible(true);
  await h.hero.emit('pointermove', {pointerType: 'mouse', clientX: 900, clientY: 500}); h.step();
  h.document.hidden = true; await h.document.emit('visibilitychange');
  assert.equal(h.frames.size, 0); assert.equal(h.styles.size, 0);
  h.document.hidden = false; await h.document.emit('visibilitychange');
  await h.hero.emit('pointermove', {pointerType: 'mouse', clientX: 3000, clientY: 2000}); h.settle();
  assert.deepEqual(h.numbers(), [12, 12, -5, 5]);
});

test('CSS incompatível e movimento reduzido mantêm o produto estático', async () => {
  for (const option of [{css: false}, {reduced: true}]) {
    const h = setup(option);
    await h.hero.emit('pointermove', {pointerType: 'mouse', clientX: 900, clientY: 500});
    assert.equal(h.permissionCalls(), 0); assert.equal(h.styles.size, 0); assert.equal(h.frames.size, 0);
  }
});
