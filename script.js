/* ═══════════════════════════════════════════════════════
   OPUS DESIGN — script.js  v4  (Awwwards level)
═══════════════════════════════════════════════════════ */

// ─── 1. LOADER ─────────────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  const prog   = document.getElementById('loaderProgress');
  const txt    = document.getElementById('loaderText');
  
  let p = 0;
  const int = setInterval(() => {
    p += Math.random() * 15;
    if (p >= 100) {
      p = 100;
      clearInterval(int);
      prog.style.width = '100%';
      txt.textContent = 'PRONTO';
      setTimeout(() => {
        loader.classList.add('done');
        bootAnimations();
      }, 600);
    } else {
      prog.style.width = p + '%';
      txt.textContent = `Caricamento ${Math.floor(p)}%`;
    }
  }, 100);
}

// ─── 2. CUSTOM CURSOR & GLOW ───────────────────────────
const curDot = document.getElementById('curDot');
const curRing = document.getElementById('curRing');
const curGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

function initCursor() {
  // Solo su schermi grandi
  if (window.matchMedia("(hover: none)").matches) {
    if(curDot) curDot.style.display = 'none';
    if(curRing) curRing.style.display = 'none';
    if(curGlow) curGlow.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(curDot) {
      curDot.style.left = mouseX + 'px';
      curDot.style.top = mouseY + 'px';
    }
    if(curGlow) {
      curGlow.style.left = mouseX + 'px';
      curGlow.style.top = mouseY + 'px';
      curGlow.classList.add('active');
    }
  });

  document.addEventListener('mouseleave', () => {
    if(curGlow) curGlow.classList.remove('active');
  });

  const renderRing = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    if(curRing) {
      curRing.style.left = ringX + 'px';
      curRing.style.top = ringY + 'px';
    }
    requestAnimationFrame(renderRing);
  };
  requestAnimationFrame(renderRing);

  // Hover states
  document.querySelectorAll('a, button, .svc-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if(curRing) curRing.classList.add('hovered');
      if(curDot) curDot.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      if(curRing) curRing.classList.remove('hovered');
      if(curDot) curDot.classList.remove('hovered');
    });
  });
}

// ─── 3. BACKGROUND CANVAS PARTICLES ────────────────────
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
let W, H;
let particles = [];
const CFG = {
  count: 60, connectDist: 150, repelDist: 200, speed: 0.2,
  colors: ['rgba(29,78,216,', 'rgba(56,189,248,', 'rgba(30,58,138,']
};

function resizeBg() {
  if(!bgCanvas) return;
  W = bgCanvas.width = window.innerWidth;
  H = bgCanvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * CFG.speed;
    this.vy = (Math.random() - 0.5) * CFG.speed;
    this.r = Math.random() * 1.5 + 0.5;
    this.a = Math.random() * 0.5 + 0.1;
    this.c = CFG.colors[Math.floor(Math.random() * CFG.colors.length)];
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
    
    // Repel
    const dx = mouseX - this.x, dy = mouseY - this.y;
    const d = Math.hypot(dx, dy);
    if (d < CFG.repelDist && d > 0) {
      const f = (CFG.repelDist - d) / CFG.repelDist;
      this.x -= (dx / d) * f * 2;
      this.y -= (dy / d) * f * 2;
    }
  }
  draw() {
    if(!bgCtx) return;
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    bgCtx.fillStyle = this.c + this.a + ')';
    bgCtx.fill();
  }
}

function initBgParticles() {
  if(!bgCanvas) return;
  particles = [];
  const n = Math.min(CFG.count, Math.floor((W * H) / 18000));
  for (let i = 0; i < n; i++) particles.push(new Particle());
}

function renderBg() {
  if(!bgCtx) return;
  bgCtx.clearRect(0, 0, W, H);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.hypot(dx, dy);
      if (d < CFG.connectDist) {
        const alpha = (1 - d / CFG.connectDist) * 0.15;
        bgCtx.beginPath();
        bgCtx.strokeStyle = `rgba(56,189,248,${alpha})`;
        bgCtx.lineWidth = 0.5;
        bgCtx.moveTo(particles[i].x, particles[i].y);
        bgCtx.lineTo(particles[j].x, particles[j].y);
        bgCtx.stroke();
      }
    }
  }
  requestAnimationFrame(renderBg);
}

// ─── 4. NAVBAR & MOBILE MENU ───────────────────────────
function initNav() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  if(burger && menu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      menu.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

// ─── 5. TYPED TEXT EFFECT ──────────────────────────────
function initTyped() {
  const target = document.getElementById('typedTarget');
  if(!target) return;
  const words = ['Landing Page.', 'Siti Web.', 'Web App.', 'Configuratori.'];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIdx];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 40 : 100;

    if (!isDeleting && charIdx === currentWord.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 400;
    }
    setTimeout(type, speed);
  }
  setTimeout(type, 1000);
}

// ─── 6. SCRAMBLE TEXT ──────────────────────────────────
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
function initScramble() {
  const els = document.querySelectorAll('.scramble-text');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const el = entry.target;
        const fx = new TextScramble(el);
        fx.setText(el.dataset.text);
        obs.unobserve(el);
      }
    });
  }, {threshold: 0.5});
  els.forEach(el => obs.observe(el));
}

// ─── 7. ANIMATED CODE WINDOW ───────────────────────────
function initCodeWindow() {
  const codeBlock = document.getElementById('codeBlock');
  if(!codeBlock) return;
  const codeContent = `// Opus Design - Core Engine
import { Strategy, Design, Code } from '@opus/core';

class Project {
  constructor(vision) {
    this.vision = vision;
    this.performance = 100;
  }
  
  async execute() {
    await Strategy.analyze(this.vision);
    const ui = await Design.craftExperience();
    return Code.build(ui, { scalable: true });
  }
}

export const launch = new Project('Your Success');
`;
  codeBlock.textContent = '';
  
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        let i = 0;
        function typeCode() {
          if(i < codeContent.length) {
            codeBlock.textContent += codeContent.charAt(i);
            i++;
            setTimeout(typeCode, 15 + Math.random()*20);
          }
        }
        typeCode();
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.3});
  obs.observe(document.getElementById('codeWindow'));
}

// ─── 8. TIMELINE PROGRESS ──────────────────────────────
function initTimeline() {
  const processSec = document.getElementById('process');
  const ptProgress = document.getElementById('ptProgress');
  const steps = document.querySelectorAll('.pt-step');
  if(!processSec || !ptProgress || steps.length === 0) return;

  window.addEventListener('scroll', () => {
    const rect = processSec.getBoundingClientRect();
    const winH = window.innerHeight;
    
    if(rect.top < winH && rect.bottom > 0) {
      let progress = 0;
      const scrollPos = winH / 2 - rect.top;
      const totalH = rect.height;
      progress = Math.max(0, Math.min(1, scrollPos / totalH));
      
      ptProgress.style.width = (progress * 100) + '%';
      
      steps.forEach((step, idx) => {
        const threshold = idx / steps.length;
        if(progress > threshold) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }
  });
}

// ─── 9. SKILL BARS ─────────────────────────────────────
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const el = entry.target;
        const fill = el.querySelector('.sb-fill');
        if(fill) fill.style.width = el.dataset.pct + '%';
        obs.unobserve(el);
      }
    });
  }, {threshold: 0.5});
  bars.forEach(b => obs.observe(b));
}

// ─── 10. CTA CANVAS PARTICLES ──────────────────────────
function initCtaCanvas() {
  const cvs = document.getElementById('ctaCanvas');
  const ctx = cvs ? cvs.getContext('2d') : null;
  if(!ctx) return;
  let w, h;
  let pts = [];
  
  function resize() {
    const rect = cvs.parentElement.getBoundingClientRect();
    w = cvs.width = rect.width;
    h = cvs.height = rect.height;
  }
  window.addEventListener('resize', resize);
  resize();

  for(let i=0; i<40; i++) {
    pts.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5
    });
  }
  function draw() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(56,189,248,0.4)';
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── 11. GENERAL REVEAL & COUNTERS ─────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('in'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-up, .reveal-left').forEach(el => obs.observe(el));
}

function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const dur = 2000;
        const start = performance.now();
        const ease = t => 1 - Math.pow(1 - t, 4);

        (function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(ease(p) * target);
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

// ─── 12. SMOOTH SCROLL ─────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─── BOOT ANIMATIONS (Called after loader) ─────────────
function bootAnimations() {
  document.querySelectorAll('.split-word').forEach((w, i) => {
    setTimeout(() => w.classList.add('in'), 100 + i*100);
  });
  
  initTyped();
  initScramble();
  initReveal();
  initCounters();
  initCodeWindow();
  initSkillBars();
  initTimeline();
  initCtaCanvas();
}

// ─── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  resizeBg();
  initBgParticles();
  renderBg();
  initNav();
  initSmoothScroll();

  window.addEventListener('resize', () => {
    resizeBg();
    initBgParticles();
  });
});
