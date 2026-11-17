/* ═══════════════════════════════════════════════════════
   OPUS DESIGN — demos.js
   Sei mini-siti reali, interamente in codice (zero immagini).
   Ogni demo è responsive tramite container queries, quindi
   si adatta davvero quando cambi dispositivo nell'anteprima.
═══════════════════════════════════════════════════════ */

// ─── Helpers grafici (Pulse) ─────────────────────────
const PULSE_DATA = {
  '7g':  [42, 55, 48, 70, 64, 82, 95],
  '30g': [30, 38, 35, 50, 46, 58, 52, 66, 61, 72, 69, 80, 76, 88, 84, 95],
  '12m': [20, 28, 25, 40, 52, 48, 63, 70, 66, 82, 90, 100],
};

function smoothPath(data, w, h, pad = 12) {
  const max = Math.max(...data) * 1.08;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - (v / max) * (h - pad)]);
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx.toFixed(1)},${y0.toFixed(1)} ${cx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return { line: d, area: `${d} L${w},${h} L0,${h} Z` };
}

export function pulsePath(range) {
  return smoothPath(PULSE_DATA[range] || PULSE_DATA['30g'], 640, 220);
}

const spark = (data, color) => {
  const { line, area } = smoothPath(data, 200, 40, 4);
  return `<svg viewBox="0 0 200 40" preserveAspectRatio="none">
    <path d="${area}" fill="${color}" opacity=".12"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2"/>
  </svg>`;
};

// ═══════════════════════════════════════════════════════
// 1. AURUM — Ristorante fine dining
// ═══════════════════════════════════════════════════════
const aurum = () => `
<div class="demo demo--aurum">
  <nav class="au-nav">
    <div class="au-logo">AURUM</div>
    <ul><li>Menù</li><li>Lo Chef</li><li>Cantina</li><li>Eventi</li></ul>
    <a class="au-btn">Prenota</a>
  </nav>

  <header class="au-hero">
    <div class="au-hero-text">
      <p class="au-kicker">★ ★ &nbsp;Due stelle Michelin · Milano</p>
      <h1>L'arte<br><em>del gusto</em></h1>
      <p class="au-lead">Un viaggio sensoriale in nove portate, dove la tradizione italiana incontra l'audacia contemporanea.</p>
      <div class="au-cta">
        <a class="au-btn au-btn--solid">Prenota un tavolo</a>
        <a class="au-link">Scopri il menù →</a>
      </div>
    </div>
    <div class="au-plate-wrap">
      <div class="au-plate-ring"></div>
      <div class="au-plate">
        <div class="au-food">
          <span class="au-risotto"></span>
          <span class="au-leaf"></span>
          <span class="au-herb"></span>
        </div>
      </div>
      <div class="au-steam"><i></i><i></i><i></i></div>
    </div>
  </header>

  <div class="au-strip">
    <span>Stagionalità</span><em>✦</em><span>Km zero</span><em>✦</em>
    <span>1.200 etichette</span><em>✦</em><span>Chef Elena Moretti</span>
  </div>

  <section class="au-menu">
    <p class="au-kicker">Primavera 2026</p>
    <h2><em>Il</em> Menù Degustazione</h2>
    <div class="au-menu-grid">
      <div class="au-item"><div class="au-item-top"><span>Gambero rosso crudo</span><i></i><b>€ 38</b></div><p>Agrumi di Sicilia, caviale Oscietra, finocchietto selvatico</p></div>
      <div class="au-item"><div class="au-item-top"><span>Risotto allo zafferano</span><i></i><b>€ 46</b></div><p>Midollo arrostito, polvere di liquirizia, foglia d'oro 24k</p></div>
      <div class="au-item"><div class="au-item-top"><span>Piccione in due cotture</span><i></i><b>€ 52</b></div><p>Ciliegie fermentate, cacao amaro, jus al Barolo</p></div>
      <div class="au-item"><div class="au-item-top"><span>Rombo al burro nocciola</span><i></i><b>€ 49</b></div><p>Asparagi bianchi di Bassano, salsa allo champagne</p></div>
      <div class="au-item"><div class="au-item-top"><span>Tiramisù decostruito</span><i></i><b>€ 22</b></div><p>Mascarpone montato, caffè di Sumatra, gelo al marsala</p></div>
      <div class="au-item"><div class="au-item-top"><span>Percorso &laquo;Aurum&raquo;</span><i></i><b>€ 220</b></div><p>Nove portate con abbinamento vini del sommelier</p></div>
    </div>
  </section>

  <section class="au-gallery">
    <div class="au-tile t1"><span>01</span><h3>La Sala</h3></div>
    <div class="au-tile t2"><span>02</span><h3>La Cucina</h3></div>
    <div class="au-tile t3"><span>03</span><h3>La Cantina</h3></div>
  </section>

  <section class="au-book">
    <h2>Una serata <em>indimenticabile</em><br>ti aspetta.</h2>
    <div class="au-form">
      <div><small>Data</small>Sab 21 Nov</div>
      <div><small>Ospiti</small>2 persone</div>
      <div><small>Orario</small>20:30</div>
      <a class="au-btn au-btn--solid">Conferma</a>
    </div>
  </section>

  <footer class="au-foot"><span class="au-logo">AURUM</span><span>Via della Spiga 12 · Milano</span><span>© 2026</span></footer>
</div>`;

// ═══════════════════════════════════════════════════════
// 2. NØRD — E-commerce moda
// ═══════════════════════════════════════════════════════
const nordProduct = (shape, color, bg, name, price, tag) => `
  <article class="nd-prod">
    <div class="nd-img" style="background:${bg}">
      ${tag ? `<span class="nd-tag">${tag}</span>` : ''}
      <div class="nd-shape sh-${shape}" style="--c:${color}"></div>
    </div>
    <div class="nd-meta"><h3>${name}</h3><span>€ ${price}</span></div>
    <button class="nd-add" data-act="cart">+ Aggiungi</button>
  </article>`;

const nord = () => `
<div class="demo demo--nord">
  <div class="nd-promo">Spedizione gratuita sopra 120€ — Resi entro 30 giorni</div>
  <nav class="nd-nav">
    <ul><li>Donna</li><li>Uomo</li><li>Drop</li></ul>
    <div class="nd-logo">NØRD</div>
    <div class="nd-icons"><span>Cerca</span><span>Account</span><span class="nd-cart">Carrello (<b data-cart>0</b>)</span></div>
  </nav>

  <header class="nd-hero">
    <h1 class="nd-giant">NØRD<sup>FW26</sup></h1>
    <div class="nd-hero-row">
      <p>Capi essenziali.<br>Costruiti per durare.<br><small>Collezione 04 — 24 pezzi</small></p>
      <div class="nd-hero-visual">
        <div class="nd-shape sh-jacket" style="--c:#0e0e0e"></div>
        <span class="nd-hv-label">OVERSHIRT 01 — € 189</span>
      </div>
      <a class="nd-btn">Shop the drop ↗</a>
    </div>
  </header>

  <div class="nd-marquee"><div>NEW IN ● LIMITED DROP ● ORGANIC COTTON ● MADE IN ITALY ● NEW IN ● LIMITED DROP ● ORGANIC COTTON ● MADE IN ITALY ●&nbsp;</div></div>

  <section class="nd-grid">
    ${nordProduct('tee', '#f6f3ea', '#d9d5c7', 'Heavy Tee', '59', 'NUOVO')}
    ${nordProduct('pants', '#3b3a34', '#c7c2b3', 'Cargo Wide', '139', '')}
    ${nordProduct('jacket', '#ff3b00', '#e2ded2', 'Overshirt', '189', '-20%')}
    ${nordProduct('bag', '#0e0e0e', '#d2cdbf', 'Tote 01', '79', 'ULTIMI 3')}
  </section>

  <section class="nd-split">
    <h2>Meno,<br>ma <span>meglio.</span></h2>
    <div class="nd-split-txt">
      <p>Ogni capo NØRD nasce in laboratori a meno di 200 km da Milano. Tessuti certificati, cuciture rinforzate, design senza tempo.</p>
      <div class="nd-stats"><div><b>200km</b><small>filiera corta</small></div><div><b>100%</b><small>cotone bio</small></div><div><b>10y</b><small>garanzia</small></div></div>
    </div>
  </section>

  <footer class="nd-foot">
    <div class="nd-logo">NØRD</div>
    <div class="nd-news"><span>La tua email</span><button>Iscriviti →</button></div>
  </footer>
</div>`;

// ═══════════════════════════════════════════════════════
// 3. PULSE — Web App / Dashboard SaaS
// ═══════════════════════════════════════════════════════
const pulse = () => {
  const p = pulsePath('30g');
  const bars = [62, 80, 45, 90, 70, 100, 55];
  const days = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
  return `
<div class="demo demo--pulse">
  <aside class="pu-side">
    <div class="pu-logo"><i></i>Pulse</div>
    <nav class="pu-nav">
      <a class="on"><span></span>Dashboard</a>
      <a><span></span>Analytics</a>
      <a><span></span>Clienti</a>
      <a><span></span>Ordini</a>
      <a><span></span>Automazioni</a>
      <a><span></span>Impostazioni</a>
    </nav>
    <div class="pu-up"><b>Passa a Pro</b><p>Report AI illimitati e previsioni di vendita.</p><button>Upgrade</button></div>
  </aside>

  <main class="pu-main">
    <div class="pu-top">
      <div><h1>Buongiorno, Marco 👋</h1><p>Ecco come sta andando il tuo business oggi.</p></div>
      <div class="pu-search">Cerca qualsiasi cosa… <kbd>⌘K</kbd></div>
      <div class="pu-avatar">M</div>
    </div>

    <div class="pu-kpis">
      <div class="pu-card pu-kpi"><small>Fatturato</small><b>€128.4k</b><em>+12.5%</em>${spark([10, 14, 12, 18, 16, 22, 26], '#8b5cf6')}</div>
      <div class="pu-card pu-kpi"><small>Utenti attivi</small><b>24.8k</b><em>+8.1%</em>${spark([8, 10, 9, 12, 15, 14, 18], '#22c55e')}</div>
      <div class="pu-card pu-kpi"><small>Conversione</small><b>4.82%</b><em>+0.6%</em>${spark([4, 5, 4.5, 5.2, 5, 5.8, 6], '#38bdf8')}</div>
      <div class="pu-card pu-kpi"><small>Churn</small><b>1.9%</b><em class="neg">−0.3%</em>${spark([6, 5, 5.5, 4, 4.2, 3.4, 3], '#f43f5e')}</div>
    </div>

    <div class="pu-row">
      <div class="pu-card pu-chart">
        <div class="pu-ch-head">
          <div><h3>Ricavi</h3><p>€ 1.284.920 <em>+18.2%</em></p></div>
          <div class="pu-tabs">
            <button data-act="range" data-range="7g">7G</button>
            <button data-act="range" data-range="30g" class="on">30G</button>
            <button data-act="range" data-range="12m">12M</button>
          </div>
        </div>
        <svg viewBox="0 0 640 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="puFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".45"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient>
            <linearGradient id="puStroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#ec4899"/></linearGradient>
          </defs>
          <g class="pu-gridlines"><line x1="0" y1="55" x2="640" y2="55"/><line x1="0" y1="110" x2="640" y2="110"/><line x1="0" y1="165" x2="640" y2="165"/></g>
          <path class="pu-area" d="${p.area}" fill="url(#puFill)"/>
          <path class="pu-line" d="${p.line}" stroke="url(#puStroke)"/>
        </svg>
      </div>
      <div class="pu-card pu-donut-card">
        <h3>Sorgenti traffico</h3>
        <div class="pu-donut"><div><b>68k</b><small>visite</small></div></div>
        <ul class="pu-legend">
          <li><i style="background:#8b5cf6"></i>Organico<b>42%</b></li>
          <li><i style="background:#ec4899"></i>Social<b>28%</b></li>
          <li><i style="background:#38bdf8"></i>Ads<b>18%</b></li>
          <li><i style="background:#22c55e"></i>Diretto<b>12%</b></li>
        </ul>
      </div>
    </div>

    <div class="pu-row r2">
      <div class="pu-card pu-bars-card">
        <h3>Ordini settimanali</h3>
        <div class="pu-bars">${bars.map((b, i) => `<div><span style="--h:${b}%;--d:${i * 0.08}s"></span><small>${days[i]}</small></div>`).join('')}</div>
      </div>
      <div class="pu-card pu-table">
        <h3>Ultime transazioni</h3>
        <div class="pu-tr"><i style="background:#f59e0b">G</i><span>Giulia Bianchi<small>Piano Business</small></span><b>€ 249,00</b><em>Pagato</em></div>
        <div class="pu-tr"><i style="background:#6366f1">L</i><span>Luca Ferri<small>Piano Pro</small></span><b>€ 89,00</b><em>Pagato</em></div>
        <div class="pu-tr"><i style="background:#ec4899">S</i><span>Sara Conti<small>Piano Business</small></span><b>€ 249,00</b><em class="wait">In attesa</em></div>
        <div class="pu-tr"><i style="background:#22c55e">A</i><span>Andrea Galli<small>Piano Starter</small></span><b>€ 29,00</b><em>Pagato</em></div>
      </div>
    </div>
  </main>
</div>`;
};

// ═══════════════════════════════════════════════════════
// 4. AETERNA — Configuratore orologio
// ═══════════════════════════════════════════════════════
export const AE_OPTIONS = {
  '--dial': [
    { val: '#0f3b2e', name: 'Verde Imperiale', price: 0 },
    { val: '#14284b', name: 'Blu Abisso', price: 0 },
    { val: '#151515', name: 'Nero Onice', price: 0 },
    { val: '#e7a38d', name: 'Salmone', price: 400 },
    { val: '#8a8f99', name: 'Meteorite', price: 1200 },
  ],
  '--case': [
    { val: '#d9b56a', name: 'Oro giallo 18k', price: 6400 },
    { val: '#cfd3d6', name: 'Acciaio 904L', price: 0 },
    { val: '#e2a98a', name: 'Oro rosa 18k', price: 6400 },
    { val: '#3a3a3c', name: 'Titanio nero', price: 1800 },
  ],
  '--strap': [
    { val: '#8a4b25', name: 'Pelle cognac', price: 0 },
    { val: '#1d1d1d', name: 'Alligatore nero', price: 900 },
    { val: '#1f2d4d', name: 'Blu notte', price: 0 },
    { val: '#6f8a72', name: 'Verde salvia', price: 0 },
  ],
};
export const AE_BASE = 8900;

const aeSwatches = (prop) => AE_OPTIONS[prop].map((o, i) =>
  `<button class="ae-sw${i === 0 ? ' on' : ''}" data-act="ae" data-prop="${prop}" data-i="${i}" style="background:${o.val}" aria-label="${o.name}"></button>`
).join('');

const aeterna = () => `
<div class="demo demo--aeterna" style="--dial:#0f3b2e;--case:#d9b56a;--strap:#8a4b25">
  <nav class="ae-nav">
    <div class="ae-logo">AETERNA<small>Genève · 1894</small></div>
    <ul><li>Collezioni</li><li class="on">Configura</li><li>Atelier</li><li>Boutique</li></ul>
    <span class="ae-bag">Il tuo orologio</span>
  </nav>

  <section class="ae-stage">
    <div class="ae-info">
      <p class="ae-kicker">Configuratore · Edizione Aeterna 41</p>
      <h1>Crea il tuo<br><em>Tempo.</em></h1>
      <p class="ae-lead">Scegli quadrante, cassa e cinturino. Ogni combinazione è assemblata a mano dai nostri maestri orologiai.</p>
      <div class="ae-price"><small>Prezzo configurato</small><b data-price>€ 15.300</b></div>
      <a class="ae-btn">Richiedi in boutique</a>
    </div>

    <div class="ae-watch-wrap">
      <div class="ae-strap top"></div>
      <div class="ae-strap bottom"></div>
      <div class="ae-watch">
        <div class="ae-crown"></div>
        <div class="ae-case">
          <div class="ae-dial">
            <div class="ae-mticks"></div>
            <div class="ae-ticks"></div>
            <div class="ae-brand">AETERNA<small>AUTOMATIC</small></div>
            <div class="ae-date" data-date>17</div>
            <div class="ae-hand h"></div>
            <div class="ae-hand m"></div>
            <div class="ae-hand s"></div>
            <div class="ae-pin"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="ae-options">
      <div class="ae-opt"><h4>Quadrante</h4><div class="ae-sws">${aeSwatches('--dial')}</div><p data-sel="--dial">Verde Imperiale</p></div>
      <div class="ae-opt"><h4>Cassa</h4><div class="ae-sws">${aeSwatches('--case')}</div><p data-sel="--case">Oro giallo 18k</p></div>
      <div class="ae-opt"><h4>Cinturino</h4><div class="ae-sws">${aeSwatches('--strap')}</div><p data-sel="--strap">Pelle cognac</p></div>
    </div>
  </section>

  <section class="ae-specs">
    <div><b>72h</b><small>Riserva di carica</small></div>
    <div><b>100m</b><small>Impermeabilità</small></div>
    <div><b>312</b><small>Componenti</small></div>
    <div><b>28.800</b><small>Alternanze / ora</small></div>
  </section>

  <section class="ae-craft">
    <p>&laquo;Il tempo non si misura.<br><em>Si custodisce.</em>&raquo;</p>
    <small>— Maison Aeterna, dal 1894</small>
  </section>
</div>`;

// ═══════════════════════════════════════════════════════
// 5. MONOLITH — Studio di architettura
// ═══════════════════════════════════════════════════════
const monolith = () => `
<div class="demo demo--mono">
  <nav class="mo-nav">
    <div class="mo-logo">MONOLITH<span>architetti associati</span></div>
    <ul><li>Progetti</li><li>Studio</li><li>Premi</li><li>Contatti</li></ul>
    <span class="mo-menu">Menu <i></i></span>
  </nav>

  <header class="mo-hero">
    <div class="mo-hero-txt">
      <p class="mo-idx">(01) — Studio di architettura, Firenze</p>
      <h1>Spazi che<br>raccontano<br><em>silenzio.</em></h1>
    </div>
    <div class="mo-arches">
      <div class="mo-sun"></div>
      <div class="mo-arch a1"></div>
      <div class="mo-arch a2"></div>
      <div class="mo-arch a3"></div>
      <div class="mo-ground"></div>
    </div>
  </header>

  <section class="mo-projects">
    <div class="mo-sec-h"><h2>Progetti selezionati</h2><span>2019 — 2026</span></div>
    <div class="mo-row"><b>01</b><span class="mo-name">Casa Ombra</span><span>Pantelleria, IT</span><span>Residenziale</span><span>2026</span></div>
    <div class="mo-row"><b>02</b><span class="mo-name">Museo della Luce</span><span>Matera, IT</span><span>Culturale</span><span>2025</span></div>
    <div class="mo-row"><b>03</b><span class="mo-name">Villa Terra</span><span>Val d'Orcia, IT</span><span>Residenziale</span><span>2024</span></div>
    <div class="mo-row"><b>04</b><span class="mo-name">Padiglione Sabbia</span><span>Dubai, UAE</span><span>Expo</span><span>2023</span></div>
    <div class="mo-row"><b>05</b><span class="mo-name">Cappella del Vento</span><span>Dolomiti, IT</span><span>Sacro</span><span>2021</span></div>
  </section>

  <section class="mo-stats">
    <div class="mo-stat"><b>48</b><small>Opere realizzate</small></div>
    <div class="mo-stat"><b>12</b><small>Premi internazionali</small></div>
    <div class="mo-stat"><b>9</b><small>Paesi</small></div>
  </section>

  <section class="mo-quote">
    &laquo;L'architettura è il gioco sapiente, rigoroso e magnifico dei volumi <em>sotto la luce</em>.&raquo;
    <small>— Le Corbusier</small>
  </section>
</div>`;

// ═══════════════════════════════════════════════════════
// 6. KINETIC — Landing page app fitness
// ═══════════════════════════════════════════════════════
const kinetic = () => `
<div class="demo demo--kin">
  <nav class="ki-nav">
    <div class="ki-logo">KINETIC<i></i></div>
    <ul><li>Funzioni</li><li>AI Coach</li><li>Prezzi</li><li>Community</li></ul>
    <a class="ki-btn">Scarica l'app</a>
  </nav>

  <header class="ki-hero">
    <div class="ki-txt">
      <span class="ki-pill"><i></i>Nuovo · AI Coach 2.0</span>
      <h1>MOVE<br><span>DIFFERENT.</span></h1>
      <p>Allenamenti generati dall'intelligenza artificiale sul tuo corpo, i tuoi obiettivi e il tuo tempo. Ogni giorno, in 20 minuti.</p>
      <div class="ki-stores">
        <a><small>Scarica su</small>App Store</a>
        <a><small>Disponibile su</small>Google Play</a>
      </div>
      <div class="ki-rating"><b>★★★★★</b> 4.9 · 120.000 recensioni</div>
    </div>

    <div class="ki-phone-wrap">
      <div class="ki-chip c1">🔥 <b>642</b> kcal</div>
      <div class="ki-chip c2">♥ <b>128</b> bpm</div>
      <div class="ki-phone">
        <div class="ki-notch"></div>
        <div class="ki-screen">
          <small>Martedì 17 Nov</small>
          <h3>Ciao Giulia</h3>
          <svg class="ki-rings" viewBox="0 0 200 200">
            <circle class="trk" cx="100" cy="100" r="80" style="stroke:#ff3d7f"/>
            <circle class="trk" cx="100" cy="100" r="62" style="stroke:#d4ff3a"/>
            <circle class="trk" cx="100" cy="100" r="44" style="stroke:#3de1ff"/>
            <circle class="val" cx="100" cy="100" r="80" style="stroke:#ff3d7f;--c:502.6;--p:.78"/>
            <circle class="val" cx="100" cy="100" r="62" style="stroke:#d4ff3a;--c:389.6;--p:.64;--dl:.2s"/>
            <circle class="val" cx="100" cy="100" r="44" style="stroke:#3de1ff;--c:276.5;--p:.92;--dl:.4s"/>
          </svg>
          <div class="ki-sstats"><div><b>642</b><small>kcal</small></div><div><b>48</b><small>min</small></div><div><b>6.2</b><small>km</small></div></div>
          <div class="ki-work"><div><small>Prossimo</small><b>HIIT Esplosivo</b><small>32 min · Intenso</small></div><span>▶</span></div>
          <div class="ki-tab"><i class="on"></i><i></i><i></i><i></i></div>
        </div>
      </div>
    </div>
  </header>

  <section class="ki-feats">
    <div class="ki-feat lime"><span>⚡</span><div><h3>AI Coach</h3><p>Si adatta in tempo reale al tuo battito e alla tua energia.</p></div></div>
    <div class="ki-feat"><span>◎</span><div><h3>Anelli attività</h3><p>Chiudi i tuoi obiettivi ogni giorno e sblocca sfide esclusive.</p></div></div>
    <div class="ki-feat"><span>☰</span><div><h3>Piani pasti</h3><p>Ricette smart sincronizzate con i tuoi allenamenti.</p></div></div>
  </section>

  <section class="ki-pricing">
    <h2>Scegli il tuo ritmo.</h2>
    <div class="ki-toggle">
      <button data-act="bill" data-bill="m" class="on">Mensile</button>
      <button data-act="bill" data-bill="y">Annuale <em>-30%</em></button>
    </div>
    <div class="ki-plans">
      <div class="ki-plan"><h4>Base</h4><b data-m="0" data-y="0">€0</b><small>/mese</small><ul><li>Allenamenti base</li><li>Anelli attività</li><li>Community</li></ul></div>
      <div class="ki-plan hot"><h4>Pro <em>Più scelto</em></h4><b data-m="12" data-y="8">€12</b><small>/mese</small><ul><li>AI Coach illimitato</li><li>Piani pasti</li><li>Sync wearable</li></ul></div>
      <div class="ki-plan"><h4>Elite</h4><b data-m="29" data-y="20">€29</b><small>/mese</small><ul><li>Tutto di Pro</li><li>Coach umano 1:1</li><li>Analisi biometriche</li></ul></div>
    </div>
  </section>
</div>`;

// ═══════════════════════════════════════════════════════
// CATALOGO
// ═══════════════════════════════════════════════════════
export const DEMOS = [
  { id: 'aurum',    name: 'Aurum',    url: 'aurum-ristorante.it', category: 'Sito Web · Ristorazione',   desc: 'Fine dining immersivo con prenotazione integrata.',               accent: '#c9a45c', html: aurum() },
  { id: 'nord',     name: 'NØRD',     url: 'nord.store',          category: 'E-Commerce · Moda',         desc: 'Brutalismo editoriale, carrello reale, drop in tempo reale.',     accent: '#ff3b00', html: nord() },
  { id: 'pulse',    name: 'Pulse',    url: 'app.pulse.io',        category: 'Web App · SaaS Analytics',  desc: 'Dashboard con grafici dinamici e dati filtrabili.',              accent: '#8b5cf6', html: pulse() },
  { id: 'aeterna',  name: 'Aeterna',  url: 'aeterna.ch/configura', category: 'Configuratore · Luxury',   desc: 'Orologio che segna l\u2019ora vera. Configuralo, il prezzo si aggiorna.', accent: '#d9b56a', html: aeterna() },
  { id: 'monolith', name: 'Monolith', url: 'monolith.studio',     category: 'Sito Vetrina · Architettura', desc: 'Minimalismo materico per uno studio pluripremiato.',           accent: '#d9673a', html: monolith() },
  { id: 'kinetic',  name: 'Kinetic',  url: 'kinetic.app',         category: 'Landing Page · App Fitness', desc: 'Landing ad alta conversione per il lancio di un\u2019app.',       accent: '#d4ff3a', html: kinetic() },
];
