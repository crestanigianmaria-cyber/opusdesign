/* ═══════════════════════════════════════════════════════
   OPUS DESIGN — showcase.js
   "Showroom Live": un nastro 3D di siti reali guidato dallo
   scroll. La card attiva si auto-scorre come se qualcuno la
   stesse navigando; il colore dell'intera sezione si adatta
   al brand del sito. Click → anteprima live a tutto schermo
   con switch Desktop / Tablet / Mobile.
═══════════════════════════════════════════════════════ */
import { DEMOS, pulsePath, AE_OPTIONS, AE_BASE } from './demos.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmtEur = (n) => '€ ' + n.toLocaleString('it-IT');

export function initShowcase() {
  const section = document.getElementById('demo');
  if (!section) return;

  const track   = section.querySelector('.sc-track');
  const stage   = section.querySelector('.sc-stage');
  const ghost   = section.querySelector('.sc-ghost');
  const hudNum  = section.querySelector('[data-hud="num"]');
  const hudName = section.querySelector('[data-hud="name"]');
  const hudCat  = section.querySelector('[data-hud="cat"]');
  const hudDesc = section.querySelector('[data-hud="desc"]');
  const hudBar  = section.querySelector('.sc-progress span');
  const dotsWrap = section.querySelector('.sc-dots');
  const n = DEMOS.length;

  section.style.setProperty('--n', n);
  section.querySelector('[data-hud="total"]').textContent = String(n).padStart(2, '0');

  // ─── Build cards ───────────────────────────────────
  track.innerHTML = DEMOS.map((d, i) => `
    <div class="demo-card" role="button" tabindex="0" data-index="${i}" style="--accent:${d.accent}" aria-label="Apri la demo live di ${d.name}">
      <div class="dc-glow"></div>
      <div class="dc-frame">
        <div class="dc-chrome">
          <span class="dc-dots"><i></i><i></i><i></i></span>
          <span class="dc-url"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>${d.url}</span>
          <span class="dc-live"><b></b>LIVE</span>
        </div>
        <div class="dc-screen"><div class="dc-scale"><div class="demo-root">${d.html}</div></div></div>
        <div class="dc-shade"></div>
      </div>
    </div>`).join('');

  dotsWrap.innerHTML = DEMOS.map((d, i) => `<button data-go="${i}" aria-label="Vai a ${d.name}"></button>`).join('');

  const cards = [...track.children];
  const roots = cards.map(c => c.querySelector('.demo-root'));
  const auto  = cards.map(() => ({ pos: 0, dir: 1, hold: 70, dist: 0 }));

  // ─── Measure ───────────────────────────────────────
  let cardW = 800, isMobile = false;
  function measure() {
    const vw = window.innerWidth, vh = window.innerHeight;
    isMobile = vw < 768;
    const maxByH = (vh * (isMobile ? 0.42 : 0.5) - 38) / 0.625;
    cardW = Math.round(Math.min(isMobile ? vw * 0.86 : vw * 0.56, 940, maxByH));
    section.style.setProperty('--cw', cardW + 'px');
    section.style.setProperty('--s', (cardW / 1280).toFixed(4));
    roots.forEach((r, i) => { auto[i].dist = Math.max(0, r.offsetHeight - 800); });
  }

  // ─── Scroll → position ─────────────────────────────
  let target = 0, current = 0, active = -1;
  let tmx = 0, tmy = 0, mx = 0, my = 0;

  function progress() {
    const r = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }
  function scrollToIndex(i) {
    const top = section.getBoundingClientRect().top + window.scrollY;
    const total = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (n - 1)) * total + 2, behavior: 'smooth' });
  }

  function setActive(i) {
    active = i;
    const d = DEMOS[i];
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    [...dotsWrap.children].forEach((b, k) => b.classList.toggle('on', k === i));
    section.style.setProperty('--sc-accent', d.accent);
    hudNum.textContent = String(i + 1).padStart(2, '0');
    hudName.textContent = d.name;
    hudCat.textContent = d.category;
    hudDesc.textContent = d.desc;
    ghost.classList.remove('swap');
    void ghost.offsetWidth; // restart animation
    ghost.textContent = d.name;
    ghost.classList.add('swap');
  }

  function render() {
    const spacing = isMobile ? 0.9 : 0.64;
    const depth = isMobile ? 220 : 340;
    for (let i = 0; i < n; i++) {
      const o = i - current;
      const a = Math.abs(o);
      const x = o * cardW * spacing;
      const z = -a * depth;
      const ry = clamp(-o * 42, -68, 68);
      const y = Math.pow(a, 1.6) * 18; // curva leggera: le card laterali "scendono"
      const s = 1 - Math.min(a, 2) * 0.05;
      const focus = Math.max(0, 1 - a * 2);
      const tiltY = mx * 9 * focus, tiltX = -my * 7 * focus;
      const c = cards[i];
      c.style.transform =
        `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${(ry + tiltY).toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      c.style.opacity = a > 3 ? 0 : clamp(1 - (a - 1.9) * 0.9, 0, 1).toFixed(3);
      c.style.zIndex = 100 - Math.round(a * 10);
      c.style.setProperty('--shade', Math.min(a, 1.3) * 0.62);
      c.style.setProperty('--focus', focus.toFixed(3));
    }
    hudBar.style.transform = `scaleX(${(current / (n - 1)).toFixed(4)})`;
    const idx = clamp(Math.round(current), 0, n - 1);
    if (idx !== active) setActive(idx);
  }

  // Auto-scroll interno: la card attiva "naviga" il suo sito
  function autoScroll() {
    for (let i = 0; i < n; i++) {
      const st = auto[i];
      const prev = st.pos;
      if (i === active && !reduceMotion) {
        if (st.hold > 0) st.hold--;
        else {
          st.pos += st.dir > 0 ? 2.4 : -7;
          if (st.pos >= st.dist) { st.pos = st.dist; st.dir = -1; st.hold = 110; }
          if (st.pos <= 0) { st.pos = 0; st.dir = 1; st.hold = 120; }
        }
      } else if (st.pos > 0.2) {
        st.pos += (0 - st.pos) * 0.1;
        st.dir = 1; st.hold = 60;
      } else if (st.pos !== 0) {
        st.pos = 0; st.dir = 1; st.hold = 60;
      }
      if (Math.abs(st.pos - prev) > 0.05) {
        roots[i].style.transform = `translate3d(0,${(-st.pos).toFixed(1)}px,0)`;
      }
    }
  }

  // Loop attivo solo quando la sezione è visibile
  let visible = false, rafId = 0, needsRender = true;
  function loop() {
    const dc = target - current, dmx = tmx - mx, dmy = tmy - my;
    if (Math.abs(dc) > 0.0005 || Math.abs(dmx) > 0.0005 || Math.abs(dmy) > 0.0005 || needsRender) {
      current += Math.abs(dc) < 0.0005 ? dc : dc * 0.085;
      mx += Math.abs(dmx) < 0.0005 ? dmx : dmx * 0.08;
      my += Math.abs(dmy) < 0.0005 ? dmy : dmy * 0.08;
      render();
      needsRender = false;
    }
    autoScroll();
    if (visible) rafId = requestAnimationFrame(loop);
  }
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(rafId);
    if (visible) { needsRender = true; rafId = requestAnimationFrame(loop); }
  }, { rootMargin: '100px' }).observe(section);

  window.addEventListener('scroll', () => { target = progress() * (n - 1); }, { passive: true });
  window.addEventListener('resize', () => { measure(); target = progress() * (n - 1); needsRender = true; });

  stage.addEventListener('mousemove', (e) => {
    const r = stage.getBoundingClientRect();
    tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  stage.addEventListener('mouseleave', () => { tmx = 0; tmy = 0; });

  // ─── Navigation ────────────────────────────────────
  cards.forEach((c, i) => {
    const go = () => (i === active ? openPreview(i) : scrollToIndex(i));
    c.addEventListener('click', go);
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  dotsWrap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (b) scrollToIndex(+b.dataset.go);
  });
  section.querySelector('[data-sc="prev"]').addEventListener('click', () => scrollToIndex(Math.max(0, active - 1)));
  section.querySelector('[data-sc="next"]').addEventListener('click', () => scrollToIndex(Math.min(n - 1, active + 1)));
  section.querySelector('[data-sc="open"]').addEventListener('click', () => openPreview(active));

  // Aeterna: nel carosello cambia configurazione da sola
  const aePresets = [[0, 0, 0], [1, 1, 2], [3, 2, 3], [2, 3, 1], [4, 1, 0]];
  let aeStep = 0;
  setInterval(() => {
    const i = DEMOS.findIndex(d => d.id === 'aeterna');
    if (!visible || active !== i || reduceMotion) return;
    aeStep = (aeStep + 1) % aePresets.length;
    const demo = roots[i].querySelector('.demo--aeterna');
    ['--dial', '--case', '--strap'].forEach((p, k) => applyAe(demo, p, aePresets[aeStep][k]));
  }, 2600);

  // ─── Live preview modal ────────────────────────────
  const modal  = document.getElementById('lpModal');
  const shell  = modal.querySelector('.lp-shell');
  const frame  = modal.querySelector('.lp-frame');
  const scroller = modal.querySelector('.lp-scroll');
  const urlEl  = modal.querySelector('[data-lp="url"]');
  const nameEl = modal.querySelector('[data-lp="name"]');
  let openIdx = -1;

  function setDevice(dev) {
    frame.dataset.device = dev;
    modal.querySelectorAll('[data-device]').forEach(b => b.classList.toggle('on', b.dataset.device === dev));
  }

  function openPreview(i) {
    openIdx = i;
    const d = DEMOS[i];
    scroller.innerHTML = `<div class="demo-root">${d.html}</div>`;
    scroller.scrollTop = 0;
    urlEl.textContent = d.url;
    nameEl.textContent = `${d.name} — ${d.category}`;
    modal.style.setProperty('--accent', d.accent);
    setDevice(window.innerWidth < 768 ? 'mobile' : 'desktop');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('lp-lock');
    tickClock();

    if (!reduceMotion) {
      const from = cards[i].querySelector('.dc-frame').getBoundingClientRect();
      const to = shell.getBoundingClientRect();
      shell.animate([
        { transform: `translate(${from.left - to.left}px,${from.top - to.top}px) scale(${from.width / to.width},${from.height / to.height})`, opacity: 0.6 },
        { transform: 'none', opacity: 1 },
      ], { duration: 750, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    modal.querySelector('.lp-close').focus({ preventScroll: true });
  }

  function closePreview() {
    if (!modal.classList.contains('open')) return;
    const finish = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('lp-lock');
      scroller.innerHTML = '';
      if (openIdx >= 0) cards[openIdx].focus({ preventScroll: true });
    };
    if (reduceMotion) return finish();
    const from = shell.getBoundingClientRect();
    const to = cards[openIdx].querySelector('.dc-frame').getBoundingClientRect();
    shell.animate([
      { transform: 'none', opacity: 1 },
      { transform: `translate(${to.left - from.left}px,${to.top - from.top}px) scale(${to.width / from.width},${to.height / from.height})`, opacity: 0 },
    ], { duration: 500, easing: 'cubic-bezier(.7,0,.84,0)' }).onfinish = finish;
    modal.classList.add('closing');
    setTimeout(() => modal.classList.remove('closing'), 520);
  }

  modal.addEventListener('click', (e) => {
    if (e.target.closest('.lp-close') || e.target.classList.contains('lp-backdrop')) closePreview();
    const dev = e.target.closest('[data-device]');
    if (dev) setDevice(dev.dataset.device);
    const nav = e.target.closest('[data-lp-nav]');
    if (nav) {
      const next = (openIdx + (+nav.dataset.lpNav) + n) % n;
      const d = DEMOS[next];
      openIdx = next;
      scroller.classList.add('swap');
      setTimeout(() => {
        scroller.innerHTML = `<div class="demo-root">${d.html}</div>`;
        scroller.scrollTop = 0;
        urlEl.textContent = d.url;
        nameEl.textContent = `${d.name} — ${d.category}`;
        modal.style.setProperty('--accent', d.accent);
        tickClock();
        scroller.classList.remove('swap');
      }, 280);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closePreview();
  });

  // ─── Interazioni dentro le demo ────────────────────
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const demo = t.closest('.demo');
    if (!demo) return;
    const act = t.dataset.act;

    if (act === 'cart') {
      const b = demo.querySelector('[data-cart]');
      b.textContent = +b.textContent + 1;
      b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
      t.textContent = 'Aggiunto ✓'; t.classList.add('done');
      setTimeout(() => { t.textContent = '+ Aggiungi'; t.classList.remove('done'); }, 1400);
    }
    if (act === 'range') {
      const p = pulsePath(t.dataset.range);
      demo.querySelector('.pu-line').setAttribute('d', p.line);
      demo.querySelector('.pu-area').setAttribute('d', p.area);
      t.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === t));
    }
    if (act === 'ae') applyAe(demo, t.dataset.prop, +t.dataset.i);
    if (act === 'bill') {
      const k = t.dataset.bill;
      t.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === t));
      demo.querySelectorAll('[data-m]').forEach(el => {
        el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip');
        setTimeout(() => { el.textContent = '€' + el.dataset[k]; }, 220);
      });
    }
  });

  // ─── Aeterna: orologio vero ────────────────────────
  function tickClock() {
    const now = new Date();
    const s = now.getSeconds(), m = now.getMinutes(), h = now.getHours() % 12;
    // gradi cumulativi (monotoni) per evitare il "giro all'indietro" a 60s
    const base = Math.floor(now.getTime() / 1000);
    const sDeg = base * 6;
    const mDeg = (m + s / 60) * 6;
    const hDeg = (h + m / 60) * 30;
    document.querySelectorAll('.demo--aeterna').forEach(d => {
      d.querySelector('.ae-hand.s').style.setProperty('--r', sDeg + 'deg');
      d.querySelector('.ae-hand.m').style.setProperty('--r', mDeg + 'deg');
      d.querySelector('.ae-hand.h').style.setProperty('--r', hDeg + 'deg');
      d.querySelector('[data-date]').textContent = now.getDate();
    });
  }
  tickClock();
  setInterval(tickClock, 1000);

  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  target = current = progress() * (n - 1);
  render();
}

function applyAe(demo, prop, i) {
  const opt = AE_OPTIONS[prop][i];
  demo.style.setProperty(prop, opt.val);
  demo.dataset[prop.slice(2)] = i;
  demo.querySelectorAll(`.ae-sw[data-prop="${prop}"]`).forEach(b => b.classList.toggle('on', +b.dataset.i === i));
  demo.querySelector(`[data-sel="${prop}"]`).textContent = opt.name;
  const total = AE_BASE + ['--dial', '--case', '--strap'].reduce((acc, p) => acc + AE_OPTIONS[p][+(demo.dataset[p.slice(2)] || 0)].price, 0);
  const priceEl = demo.querySelector('[data-price]');
  priceEl.textContent = fmtEur(total);
  priceEl.classList.remove('flash'); void priceEl.offsetWidth; priceEl.classList.add('flash');
}
