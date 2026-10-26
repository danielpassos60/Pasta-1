/* Nilda Panificadora e Confeitaria: comportamento do site */
(() => {
  'use strict';

  const WHATS = '5575991290114';
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (p, e0, e1) => {
    const t = clamp((p - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const rng = seed => {
    let s = seed >>> 0;
    return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  };
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- texto partido ---------- */
  function splitText(el, seed) {
    const text = el.textContent.trim();
    const rand = rng(seed);
    const sr = document.createElement('span');
    sr.className = 'sr';
    sr.textContent = text;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    const words = text.split(' ');
    words.forEach((word, i) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.style.setProperty('--th', (i / words.length * 0.55 + rand() * 0.05).toFixed(3));
      w.textContent = word;
      visual.appendChild(w);
      if (i < words.length - 1) visual.appendChild(document.createTextNode(' '));
    });
    el.textContent = '';
    el.appendChild(sr);
    if (el.dataset.fx === 'nevoa') {
      visual.classList.add('nitida');
      const soft = visual.cloneNode(true);
      soft.classList.replace('nitida', 'borrada');
      el.appendChild(visual);
      el.appendChild(soft);
    } else {
      el.appendChild(visual);
    }
  }
  document.querySelectorAll('.split').forEach((el, i) => splitText(el, 1907 + i * 31));

  /* ---------- hero: a câmera desce pelo vapor ---------- */
  const hero = document.querySelector('.hero');
  const img = document.querySelector('.cena-img');
  const dica = document.querySelector('.dica');
  const topo = document.querySelector('.topo');
  const zap = document.querySelector('.zap-flutuante');
  const bands = [...document.querySelectorAll('.band')].map((el, i, all) => ({
    el,
    a: parseFloat(el.dataset.a),
    b: parseFloat(el.dataset.b),
    first: i === 0,
    last: i === all.length - 1,
    op: -1,
    k: -1
  }));

  const GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  const MQLS = GATES.map(q => matchMedia(q));

  let scrubOn = false;
  let shown = 0;          // progresso exibido (suavizado)
  let rafId = null;
  let lastT = 0;
  const loadStart = performance.now();
  let lastTy = null, lastS = null;

  function heroProgress() {
    const r = hero.getBoundingClientRect();
    const range = hero.offsetHeight - innerHeight;
    return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
  }

  function paintScene(p) {
    const e = easeInOut(p);
    const ty = lerp(14, -5.5, e).toFixed(2);
    const s = lerp(1.3, 1.12, e).toFixed(4);
    if (ty !== lastTy) { img.style.setProperty('--ty', ty + '%'); lastTy = ty; }
    if (s !== lastS) { img.style.setProperty('--s', s); lastS = s; }
  }

  function updateBands(p, now) {
    const loadK = clamp((now - loadStart) / 1400, 0, 1);
    bands.forEach(band => {
      const { a, b } = band;
      const f = Math.min(0.02, (b - a) / 3);
      const inn = band.first ? (p >= a ? 1 : 0) : smoothstep(p, a, a + f);
      const out = band.last ? 1 : 1 - smoothstep(p, b - f, b);
      const op = Math.round(inn * out * 1000) / 1000;
      let k = clamp((p - a) / Math.min(0.08, (b - a) * 0.35), 0, 1);
      if (band.first) k = Math.max(k, easeInOut(loadK));
      k = Math.round(k * 125) / 125;
      if (op !== band.op) { band.el.style.opacity = op; band.op = op; }
      if (k !== band.k) { band.el.style.setProperty('--k', k); band.k = k; }
    });
    return loadK < 1;
  }

  function chrome(p) {
    const past = scrubOn ? p > 0.97 : scrollY > 80;
    topo.classList.toggle('solido', past || scrollY > hero.offsetHeight - 80);
    zap.classList.toggle('mostra', scrubOn ? p > 0.72 || scrollY > hero.offsetHeight : scrollY > innerHeight * 0.6);
    if (dica) dica.classList.toggle('some', p > 0.03);
  }

  function frame(now) {
    const dt = Math.min(64, now - (lastT || now));
    lastT = now;
    const target = heroProgress();
    const t = 1 - Math.pow(0.0015, dt / 1000);   // suavização igual em qualquer taxa de quadros
    shown = lerp(shown, target, t);
    if (Math.abs(target - shown) < 0.0004) shown = target;
    paintScene(shown);
    const loading = updateBands(shown, now);
    chrome(target);
    if (shown !== target || loading) rafId = requestAnimationFrame(frame);
    else { rafId = null; lastT = 0; }
  }

  function onScroll() {
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    bands.forEach(b => { b.op = -1; b.k = -1; });
    lastTy = lastS = null;
    shown = heroProgress();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    bands.forEach(b => { b.el.style.removeProperty('opacity'); b.el.style.removeProperty('--k'); b.op = -1; b.k = -1; });
    img.style.removeProperty('--ty');
    img.style.removeProperty('--s');
  }

  function applyHeroMode() {
    if (MQLS.some(m => m.matches)) disableScrub();
    else enableScrub();
  }
  MQLS.forEach(m => m.addEventListener('change', applyHeroMode));
  applyHeroMode();

  // o topo e o botão flutuante também valem no hero parado
  addEventListener('scroll', () => { if (!scrubOn) chrome(1); }, { passive: true });
  if (!scrubOn) chrome(1);

  /* ---------- vapor desenhado em canvas ---------- */
  function makeSteam(canvas, opts) {
    const ctx = canvas.getContext('2d');
    const rand = rng(opts.seed);
    let w = 0, h = 0, puffs = [], running = false, id = null, visible = false, last = 0;

    function spawn(anywhere) {
      return {
        x: opts.x0 * w + (rand() - 0.5) * opts.spread * w,
        y: anywhere ? rand() * h : h * (0.85 + rand() * 0.25),
        r: (opts.rMin + rand() * opts.rMax) * Math.max(w, 600) / 1000,
        vy: 14 + rand() * 22,
        drift: (rand() - 0.5) * 10,
        ph: rand() * Math.PI * 2,
        a: 0.035 + rand() * 0.05
      };
    }
    function resize() {
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(opts.count * (w < 720 ? 0.5 : 1));
      puffs = Array.from({ length: count }, () => spawn(true));
    }
    function draw(now) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const lift = opts.lift ? opts.lift() : 0;
      for (const p of puffs) {
        p.y -= (p.vy + lift) * dt;
        p.ph += dt * 0.6;
        p.x += (Math.sin(p.ph) * 6 + p.drift) * dt;
        p.r += dt * 6;
        if (p.y < -p.r) Object.assign(p, spawn(false));
        const life = clamp(p.y / h, 0, 1);
        const alpha = p.a * Math.sin(life * Math.PI);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(255,236,205,${alpha})`);
        g.addColorStop(1, 'rgba(255,236,205,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      id = running ? requestAnimationFrame(draw) : null;
    }
    function start() { if (running || reduceMQ.matches || document.hidden) return; running = true; last = 0; id = requestAnimationFrame(draw); }
    function stop() { running = false; if (id) cancelAnimationFrame(id); id = null; }

    resize();
    addEventListener('resize', resize);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); }).observe(canvas);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible) start(); });
    reduceMQ.addEventListener('change', () => { if (reduceMQ.matches) stop(); else if (visible) start(); });
  }

  const heroSteam = document.querySelector('.cena .vapor');
  if (heroSteam) {
    makeSteam(heroSteam, {
      seed: 77, count: 26, x0: 0.5, spread: 0.55, rMin: 90, rMax: 170,
      lift: () => (scrubOn && rafId !== null ? 40 : 0)   // o vapor sobe mais rápido enquanto a câmera desce
    });
  }
  const finalSteam = document.querySelector('.vapor-final');
  if (finalSteam) makeSteam(finalSteam, { seed: 12, count: 14, x0: 0.5, spread: 0.9, rMin: 120, rMax: 160 });

  /* ---------- entradas das seções ---------- */
  const contador = document.querySelector('.contador');
  let contou = false;
  function countUp() {
    if (!contador || contou) return;
    contou = true;
    const alvo = parseInt(contador.dataset.alvo, 10);
    const fmt = n => n.toLocaleString('pt-BR');
    if (reduceMQ.matches) { contador.textContent = fmt(alvo); return; }
    const t0 = performance.now();
    const passo = now => {
      const t = clamp((now - t0) / 1600, 0, 1);
      contador.textContent = fmt(Math.round(alvo * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      if (e.target.matches('.mural')) setTimeout(() => e.target.classList.add('pronto'), 1500);
      if (e.target.matches('.passo:last-child')) setTimeout(() => e.target.parentElement.classList.add('pronto'), 1200);
      if (e.target.matches('.prova-in')) countUp();
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.revela').forEach(el => io.observe(el));

  /* trilha pontilhada que se desenha com a rolagem */
  const trilhaPath = document.querySelector('.trilha path');
  const passosWrap = document.querySelector('.passos-wrap');
  let lastDesenho = -1;
  function drawTrail() {
    if (!trilhaPath) return;
    const v = reduceMQ.matches ? 1
      : Math.round(clamp((innerHeight * 0.9 - passosWrap.getBoundingClientRect().top) / (innerHeight * 0.6), 0, 1) * 200) / 200;
    if (v !== lastDesenho) { trilhaPath.style.setProperty('--desenho', v); lastDesenho = v; }
  }
  addEventListener('scroll', () => requestAnimationFrame(drawTrail), { passive: true });
  drawTrail();

  /* selo girando só quando está na tela */
  const selo = document.querySelector('.selo');
  if (selo) new IntersectionObserver(([e]) => selo.classList.toggle('vivo', e.isIntersecting)).observe(selo);

  /* pausa tudo quando a aba fica escondida */
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

  /* movimento reduzido ligado no meio da visita: tudo para no estado final */
  function pinToFinalStates() {
    document.querySelectorAll('.revela').forEach(el => el.classList.add('in'));
    document.querySelector('.mural')?.classList.add('pronto');
    document.querySelector('.passos')?.classList.add('pronto');
    drawTrail();
    countUp();
  }
  reduceMQ.addEventListener('change', e => {
    if (e.matches) pinToFinalStates();
    else { applyHeroMode(); drawTrail(); }
  });
  if (reduceMQ.matches) pinToFinalStates();

  /* ---------- monte sua encomenda ---------- */
  const escolha = { item: 'um bolo', ocasiao: 'um aniversário' };
  const msg = document.getElementById('msg');
  const btnEnviar = document.getElementById('btn-enviar');
  const sabor = document.getElementById('f-sabor');
  const data = document.getElementById('f-data');
  if (!msg || !btnEnviar || !sabor || !data) return;

  const hoje = new Date();
  data.min = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function dataBR(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
  }

  function montar() {
    const saborTxt = sabor.value.replace(/\s+/g, ' ').trim().slice(0, 60);
    let texto = `Olá, Nilda! Quero encomendar ${escolha.item} para ${escolha.ocasiao}.`;
    if (saborTxt) texto += ` Sabor: ${saborTxt}.`;
    const quando = dataBR(data.value);
    if (quando) texto += ` É para o dia ${quando}.`;
    return texto + ' Vou mandar a foto do modelo.';
  }

  let trocaTimer = null;
  function atualizar() {
    const texto = montar();
    btnEnviar.href = `https://wa.me/${WHATS}?text=${encodeURIComponent(texto)}`;
    if (reduceMQ.matches) { msg.textContent = texto; return; }
    msg.classList.add('troca');
    clearTimeout(trocaTimer);
    trocaTimer = setTimeout(() => { msg.textContent = texto; msg.classList.remove('troca'); }, 140);
  }

  document.querySelectorAll('.chips').forEach(grupo => {
    grupo.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      grupo.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      escolha[grupo.dataset.campo] = chip.dataset.v;
      atualizar();
    });
  });
  sabor.addEventListener('input', atualizar);
  data.addEventListener('change', atualizar);
  atualizar();
})();
