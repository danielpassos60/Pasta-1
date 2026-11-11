// Templates das artes: feed (1080x1350), stories (1080x1920), destaques (1080x1080)
// e elementos de antes/depois (PNG transparente).
const { C, sym, LOGO, FOTO, htmlDoc, esc, pad } = require('./base');
const { POR_POST, ilustracao } = require('./ilustracoes');
const PAL = {
  escuro: { l: C.areia, a: C.caramelo, f: '#384451', bg: C.ardosia },
  claro: { l: C.ardosia, a: C.caramEsc, f: '#DFD3C2', bg: C.areia },
  off: { l: C.ardosia, a: C.caramEsc, f: '#EAE0D3', bg: C.off },
};

// Ajuste de enquadramento de cada foto (object-position)
const FOTO_POS = {
  mesa: '50% 30%', estudio: '50% 22%', apresentacao_cientifica: '50% 30%', cirurgia_pb: '60% 40%',
  consultorio_scrubs: '50% 25%', selfie_jaleco: '50% 35%', bastidor_touca: '50% 40%', procedimento: '50% 40%',
};

const W = 1080, H = 1350;

const POST_CSS = `
.pg{position:relative;width:${W}px;height:${H}px;overflow:hidden}
.escuro{background:${C.ardosia};color:${C.areia}}
.claro{background:${C.areia};color:${C.ardosia}}
.off{background:${C.off};color:${C.ardosia}}
.wm{position:absolute;pointer-events:none}
.top{position:absolute;top:78px;left:96px;right:96px;display:flex;justify-content:space-between;align-items:center}
.cnt{font-family:'Inter';font-weight:400;font-size:22px;letter-spacing:.22em}
.foot{position:absolute;bottom:72px;left:96px;right:96px;display:flex;justify-content:space-between;align-items:flex-end;font-family:'Inter';font-weight:500;font-size:18px;letter-spacing:.24em;text-transform:uppercase}
.kick{font-family:'Inter';font-weight:500;font-size:24px;letter-spacing:.32em;text-transform:uppercase;display:flex;align-items:center;gap:22px}
.kick:before{content:'';width:56px;height:1.5px;background:currentColor;display:block}
.ttl{font-family:'Jost';font-weight:300;text-transform:uppercase;letter-spacing:.12em;line-height:1.12}
.sub{font-family:'Inter';font-weight:300;font-size:32px;line-height:1.45;letter-spacing:.01em}
.h{font-family:'Jost';font-weight:300;text-transform:uppercase;letter-spacing:.13em;font-size:52px;line-height:1.18}
.p{font-family:'Inter';font-weight:300;font-size:38px;line-height:1.56}
.rule{width:96px;height:1.5px;margin:44px 0}
.num{font-family:'Jost';font-weight:200;font-size:150px;line-height:1;letter-spacing:.02em}
.li{display:flex;gap:30px;align-items:baseline;padding:30px 0;border-top:1.5px solid rgba(160,122,85,.45);font-size:38px;line-height:1.4}
.li:last-child{border-bottom:1.5px solid rgba(160,122,85,.45)}
.li b{font-family:'Jost';font-weight:300;font-size:30px;color:${C.caramEsc};min-width:44px;letter-spacing:.08em}
.btn{display:inline-block;border:1.5px solid currentColor;padding:26px 44px;font-family:'Inter';font-weight:500;font-size:24px;letter-spacing:.24em;text-transform:uppercase}
.tag{display:inline-block;border:1.5px solid ${C.caramEsc};color:${C.caramEsc};padding:12px 26px;font-family:'Inter';font-weight:500;font-size:22px;letter-spacing:.3em;text-transform:uppercase;margin-bottom:46px}
.escuro .tag{border-color:${C.caramelo};color:${C.caramelo}}
`;

function corTexto(tom) { return tom === 'escuro' ? { tx: C.areia, ac: C.caramelo, sym: C.caramelo, est: C.estEscuro } : { tx: C.ardosia, ac: C.caramEsc, sym: C.caramEsc, est: C.estClaro }; }

function topo(tom, i, total) {
  const k = corTexto(tom);
  return `<div class="top">${sym(k.sym, 54, 1.6)}${total > 1 ? `<span class="cnt" style="color:${k.ac}">${pad(i)} / ${pad(total)}</span>` : ''}</div>`;
}
function rodape(tom, direita = '') {
  const k = corTexto(tom);
  return `<div class="foot" style="color:${k.ac}"><span>Dra. Tatiane Aislan · CRO-BA 32044</span><span>${direita}</span></div>`;
}
function marcaDagua(tom, size = 1180, right = -430, top = 40) {
  const k = corTexto(tom);
  return `<div class="wm" style="right:${right}px;top:${top}px">${sym(k.est, size, 3.2)}</div>`;
}
function tamTitulo(t, comIl) {
  const L = t.length;
  if (comIl) { if (L <= 16) return 96; if (L <= 24) return 84; if (L <= 32) return 76; if (L <= 40) return 68; return 62; }
  if (L <= 16) return 104; if (L <= 24) return 92; if (L <= 32) return 82; if (L <= 40) return 74; return 66;
}

// ---------------------------------------------------------------- páginas
function capa(post, pg, i, tot) {
  const tom = post.tom; const k = corTexto(tom);
  const bgc = tom === 'escuro' ? 'escuro' : 'claro';
  const il = POR_POST[post.n];
  const pal = PAL[tom === 'escuro' ? 'escuro' : 'claro'];
  const arte = il ? `<div style="position:absolute;right:84px;top:132px;width:560px;height:560px;border-radius:50%;background:${pal.f}"></div>
    <div style="position:absolute;right:56px;top:160px;width:560px;height:560px;border-radius:50%;border:1.5px solid ${k.ac};opacity:.55"></div>
    <div style="position:absolute;right:104px;top:152px">${ilustracao(il, 520, pal, 1.15)}</div>` : marcaDagua(tom);
  return `<div class="pg ${bgc}">${arte}${topo(tom, i, tot)}
  <div style="position:absolute;left:96px;right:${il ? 120 : 150}px;bottom:${il ? 200 : 250}px">
    <div class="kick" style="color:${k.ac};margin-bottom:${il ? 40 : 54}px">${esc(pg.kicker)}</div>
    <div class="ttl" style="font-size:${tamTitulo(pg.title, !!il)}px">${esc(pg.title)}</div>
    ${pg.sub ? `<div class="sub" style="margin-top:${il ? 30 : 40}px;opacity:.85;max-width:760px">${esc(pg.sub)}</div>` : ''}
  </div>${rodape(tom, tot > 1 ? 'Deslize →' : '')}</div>`;
}

function capaFoto(post, pg, i, tot) {
  return `<div class="pg off">
  <div style="position:absolute;left:64px;right:64px;top:64px;height:880px;overflow:hidden"><img src="${FOTO(pg.foto)}" style="width:100%;height:100%;object-fit:cover;object-position:${FOTO_POS[pg.foto] || '50% 50%'}"></div>
  <div style="position:absolute;left:96px;right:96px;top:1000px">
    <div class="kick" style="color:${C.caramEsc};margin-bottom:34px">${esc(pg.kicker)}</div>
    <img src="${LOGO.horizClaro}" style="height:196px;margin-left:-18px">
  </div>
  <div class="foot" style="color:${C.caramEsc}"><span>${esc(pg.sub)}</span><span>Deslize →</span></div></div>`;
}

function blocoFinal(pg, tom) {
  const k = corTexto(tom);
  return pg.cta ? `<div style="margin-top:70px"><span class="btn" style="color:${k.ac}">${esc(pg.cta)}</span><div style="margin-top:28px;font-size:24px;letter-spacing:.18em;text-transform:uppercase;font-weight:400;color:${k.ac}">Link na bio · WhatsApp</div></div>` : '';
}

function interna(post, pg, i, tot) {
  const final = pg.t === 'final' || pg.final;
  const tom = final ? post.tom : 'off';
  const tomTxt = final ? post.tom : 'claro';
  const k = corTexto(tomTxt);
  const cls = final ? (post.tom === 'escuro' ? 'escuro' : 'claro') : 'off';
  const il = POR_POST[post.n];
  const pal = final ? PAL[post.tom === 'escuro' ? 'escuro' : 'claro'] : PAL.off;
  const mini = il ? `<div style="flex:none;margin-top:-10px">${ilustracao(il, 190, pal, 1.5)}</div>` : '';
  const linha = (a) => il ? `<div style="display:flex;justify-content:space-between;align-items:flex-start">${a}${mini}</div>` : a;
  let corpo = '';
  if (pg.t === 'texto' || pg.t === 'final') {
    corpo = `${linha(`<div class="num" style="color:${k.ac}">${pad(i)}</div>`)}<div style="height:${il ? 26 : 56}px"></div>
      <div class="h">${esc(pg.h)}</div><div class="rule" style="background:${k.ac}"></div>
      <div class="p" style="max-width:840px">${esc(pg.p)}</div>`;
  } else if (pg.t === 'lista') {
    corpo = `${linha(`<div class="num" style="color:${k.ac}">${pad(i)}</div>`)}<div style="height:${il ? 26 : 56}px"></div>
      <div class="h" style="margin-bottom:56px">${esc(pg.h)}</div>
      <div>${pg.items.map((it, j) => `<div class="li" style="border-color:${final && post.tom === 'escuro' ? 'rgba(199,158,116,.4)' : ''}"><b style="color:${k.ac}">${pad(j + 1)}</b><span>${esc(it)}</span></div>`).join('')}</div>`;
  } else if (pg.t === 'mito') {
    corpo = `${linha(`<span class="tag">${esc(pg.tag)}</span>`)}
      <div class="jost" style="font-weight:300;font-size:64px;line-height:1.22;letter-spacing:.01em">${esc(pg.h)}</div>
      <div class="rule" style="background:${k.ac}"></div><div class="p" style="max-width:840px">${esc(pg.p)}</div>`;
  } else if (pg.t === 'pergunta') {
    corpo = `${linha(`<div class="jost" style="font-weight:200;font-size:150px;line-height:1;color:${k.ac}">?</div>`)}<div style="height:${il ? 20 : 46}px"></div>
      <div class="jost" style="font-weight:300;font-size:70px;line-height:1.18">${esc(pg.h)}</div>
      <div class="rule" style="background:${k.ac}"></div><div class="p" style="max-width:840px">${esc(pg.p)}</div>`;
  } else if (pg.t === 'passo') {
    corpo = `${linha(`<div class="num" style="font-size:190px;color:${k.ac}">${esc(pg.num)}</div>`)}<div style="height:${il ? 24 : 50}px"></div>
      <div class="h">${esc(pg.h)}</div><div class="rule" style="background:${k.ac}"></div>
      <div class="p" style="max-width:840px">${esc(pg.p)}</div>`;
  }
  const tomTopo = final ? post.tom : 'claro';
  return `<div class="pg ${cls}">${final ? marcaDagua(post.tom, 900, -470, 560) : ''}${topo(tomTopo, i, tot)}
    <div style="position:absolute;left:96px;right:96px;top:190px;bottom:230px;display:flex;flex-direction:column;justify-content:center"><div>${corpo}${final ? blocoFinal(pg, post.tom) : ''}</div></div>
    ${rodape(tomTopo, final ? '' : 'Deslize →')}</div>`;
}

function frase(post, pg) {
  const tom = post.tom; const k = corTexto(tom);
  const cls = tom === 'escuro' ? 'escuro' : 'claro';
  return `<div class="pg ${cls}">
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 110px">
    <div style="position:relative;width:360px;height:360px">
      <div style="position:absolute;inset:0;border-radius:50%;background:${PAL[tom === 'escuro' ? 'escuro' : 'claro'].f}"></div>
      <div style="position:absolute;inset:0;transform:translate(22px,18px);border-radius:50%;border:1.5px solid ${k.ac};opacity:.55"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${sym(k.sym, 200, 2.4)}</div>
    </div>
    <div class="ttl" style="font-size:62px;line-height:1.3;letter-spacing:.14em;margin-top:80px">${esc(pg.frase)}</div>
    <div style="width:96px;height:1.5px;background:${k.ac};margin-top:70px"></div>
  </div>${rodape(tom)}</div>`;
}

function foto(post, pg) {
  const tom = post.tom; const k = corTexto(tom);
  const cls = tom === 'escuro' ? 'escuro' : 'off';
  return `<div class="pg ${cls}">
  <div style="position:absolute;left:64px;right:64px;top:64px;height:900px;overflow:hidden"><img src="${FOTO(pg.foto)}" style="width:100%;height:100%;object-fit:cover;object-position:${FOTO_POS[pg.foto] || '50% 50%'}"></div>
  <div style="position:absolute;left:96px;right:96px;top:1018px">
    <div class="kick" style="color:${k.ac};margin-bottom:28px">${esc(pg.kicker)}</div>
    <div class="ttl" style="font-size:${pg.frase.length > 42 ? 40 : 46}px;line-height:1.3;letter-spacing:.12em">${esc(pg.frase)}</div>
  </div>${rodape(tom)}</div>`;
}

function postPage(post, pg, i, tot) {
  let body;
  switch (pg.t) {
    case 'capa': body = capa(post, pg, i, tot); break;
    case 'capaFoto': body = capaFoto(post, pg, i, tot); break;
    case 'frase': body = frase(post, pg); break;
    case 'foto': body = foto(post, pg); break;
    default: body = interna(post, pg, i, tot);
  }
  return htmlDoc(body, POST_CSS, W, H);
}

// ---------------------------------------------------------------- stories 1080x1920
const SW = 1080, SH = 1920;
const STORY_CSS = POST_CSS.replace(/\.pg\{[^}]*\}/, `.pg{position:relative;width:${SW}px;height:${SH}px;overflow:hidden}`);
function story(s) {
  const tom = s.tom === 'foto' ? 'escuro' : s.tom; const k = corTexto(tom);
  const cls = tom === 'escuro' ? 'escuro' : 'claro';
  const head = `<div style="position:absolute;top:200px;left:96px;right:96px;display:flex;align-items:center;gap:26px">${sym(k.sym, 64, 1.7)}<span style="font-family:'Inter';font-weight:500;font-size:22px;letter-spacing:.26em;text-transform:uppercase;color:${k.ac}">Dra. Tatiane Aislan</span></div>`;
  const foot = `<div style="position:absolute;bottom:300px;left:96px;right:96px;font-family:'Inter';font-weight:500;font-size:20px;letter-spacing:.24em;text-transform:uppercase;color:${k.ac}">CRO-BA 32044</div>`;
  const ctaHtml = `<div style="margin-top:56px"><span class="btn" style="color:${k.ac}">${esc(s.cta)}</span></div>`;
  if (s.tom === 'foto') {
    return htmlDoc(`<div class="pg escuro">
      <div style="position:absolute;left:0;right:0;top:0;height:1180px;overflow:hidden"><img src="${FOTO(s.foto)}" style="width:100%;height:100%;object-fit:cover;object-position:${FOTO_POS[s.foto] || '50% 40%'}"></div>
      <div style="position:absolute;left:0;right:0;top:1180px;height:1.5px;background:${C.caramelo}"></div>
      <div style="position:absolute;left:96px;right:96px;top:1250px">
        <div class="kick" style="color:${C.caramelo};margin-bottom:34px">${esc(s.kicker)}</div>
        <div class="ttl" style="font-size:54px;line-height:1.2">${esc(s.titulo)}</div>
        <div class="p" style="font-size:32px;margin-top:30px;opacity:.9">${esc(s.texto)}</div>
      </div></div>`, STORY_CSS, SW, SH);
  }
  const gap = s.espacoInteracao ? 470 : 0;
  const corpo = s.lista
    ? `<div style="margin-top:50px">${s.lista.map((it, j) => `<div class="li" style="font-size:38px"><b style="color:${k.ac}">${pad(j + 1)}</b><span>${esc(it)}</span></div>`).join('')}</div>`
    : `<div class="p" style="font-size:38px;margin-top:44px;opacity:.92">${esc(s.texto)}</div>`;
  return htmlDoc(`<div class="pg ${cls}">${marcaDagua(tom, 1500, -800, 360)}${head}
    <div style="position:absolute;left:96px;right:110px;top:${s.espacoInteracao ? 420 : 560}px">
      <div class="kick" style="color:${k.ac};margin-bottom:50px">${esc(s.kicker)}</div>
      <div class="ttl" style="font-size:${s.titulo.length > 46 ? 62 : 72}px;line-height:1.2">${esc(s.titulo)}</div>
      ${corpo}
      <div style="height:${gap}px"></div>
      ${s.espacoInteracao ? '' : ctaHtml}
    </div>${foot}</div>`, STORY_CSS, SW, SH);
}

// ---------------------------------------------------------------- destaques 1080x1080
const ICONES = {
  pessoa: '<circle cx="50" cy="35" r="13"/><path d="M24 78 C24 60 36 52 50 52 C64 52 76 60 76 78"/>',
  dente: '<path d="M30 40 C26 26 33 18 42 19 C46 20 48 22 50 22 C52 22 54 20 58 19 C67 18 74 26 70 40 C68 48 66 60 63 80 C61 84 57 82 56 76 C54 66 52 60 50 60 C48 60 46 66 44 76 C43 82 39 84 37 80 C34 60 32 48 30 40 Z"/>',
  reabilitacao: '<path d="M36 44 C33 34 38 28 45 29 C48 29.5 49 31 50 31 C51 31 52 29.5 55 29 C62 28 67 34 64 44 C63 50 61 58 59 70 M36 44 C37 50 39 58 41 70"/><path d="M50 12 A38 38 0 1 1 18 30"/><path d="M14 22 L18 30 L26 27"/>',
  implante: '<path d="M33 22 C33 14 40 12 50 12 C60 12 67 14 67 22 C67 30 60 33 50 33 C40 33 33 30 33 22 Z"/><path d="M42 38 L58 38 M41 46 L59 46 M42 54 L58 54 M43 62 L57 62 M45 70 L55 70 M47 78 L53 78"/><path d="M41 38 L47 86 L53 86 L59 38"/>',
  resultados: '<rect x="14" y="26" width="72" height="48" rx="2"/><path d="M50 26 L50 74"/><path d="M58 52 L64 58 L76 44"/>',
  duvidas: '<circle cx="50" cy="50" r="34"/><path d="M40 40 C40 32 46 28 51 28 C57 28 61 32 61 38 C61 46 51 46 51 56"/><circle cx="51" cy="66" r="1.6" fill="currentColor"/>',
  contato: '<path d="M18 26 L82 26 L82 66 L44 66 L30 78 L30 66 L18 66 Z"/><path d="M32 42 L68 42 M32 52 L56 52"/>',
};
function destaque(d) {
  return htmlDoc(`<div style="width:1080px;height:1080px;background:${C.ardosia};display:flex;align-items:center;justify-content:center">
    <svg viewBox="0 0 100 100" width="460" height="460" fill="none" stroke="${C.caramelo}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" style="color:${C.caramelo}">${ICONES[d.icone]}</svg></div>`, '', 1080, 1080);
}

// ---------------------------------------------------------------- antes/depois (transparente)
function overlay(tipo, w = 1080, h = 1350) {
  const band = 'rgba(47,58,69,.62)';
  const lbl = `font-family:'Inter';font-weight:500;font-size:22px;letter-spacing:.3em;text-transform:uppercase;color:${C.areia}`;
  const assin = `<div style="position:absolute;right:40px;bottom:40px;display:flex;align-items:center;gap:14px;background:${band};padding:14px 22px 14px 18px">${sym(C.caramelo, 40, 1.4)}<span style="${lbl};font-size:16px;letter-spacing:.22em">Dra. Tatiane Aislan · CRO-BA 32044</span></div>`;
  let body = '';
  if (tipo === 'antes-depois') {
    body = `<div style="position:absolute;left:50%;top:0;bottom:0;width:2px;margin-left:-1px;background:${C.caramelo}"></div>
      <div style="position:absolute;left:40px;top:40px;background:${band};padding:14px 26px;${lbl}">Antes</div>
      <div style="position:absolute;right:40px;top:40px;background:${band};padding:14px 26px;${lbl}">Depois</div>${assin}`;
  } else if (tipo === 'antes-depois-vertical') {
    body = `<div style="position:absolute;top:50%;left:0;right:0;height:2px;margin-top:-1px;background:${C.caramelo}"></div>
      <div style="position:absolute;left:40px;top:40px;background:${band};padding:14px 26px;${lbl}">Antes</div>
      <div style="position:absolute;left:40px;top:calc(50% + 30px);background:${band};padding:14px 26px;${lbl}">Depois</div>${assin}`;
  } else if (tipo === 'resultado') {
    body = `<div style="position:absolute;inset:36px;border:2px solid ${C.caramelo}"></div>
      <div style="position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:${band};padding:12px 30px;display:flex;align-items:center;gap:16px;white-space:nowrap">${sym(C.caramelo, 34, 1.3)}<span style="${lbl};font-size:20px">Resultado clínico</span></div>
      <div style="position:absolute;right:58px;top:58px;${lbl};font-size:14px;letter-spacing:.24em;background:${band};padding:8px 14px">CRO-BA 32044</div>`;
  } else if (tipo === 'evolucao') {
    const c = (s) => `<div style="position:absolute;${s};width:70px;height:70px;border-color:${C.caramelo};border-style:solid;border-width:0"></div>`;
    body = `${c('left:36px;top:36px;border-left-width:2px;border-top-width:2px')}${c('right:36px;top:36px;border-right-width:2px;border-top-width:2px')}
      ${c('left:36px;bottom:36px;border-left-width:2px;border-bottom-width:2px')}${c('right:36px;bottom:36px;border-right-width:2px;border-bottom-width:2px')}
      <div style="position:absolute;left:60px;bottom:64px;background:${band};padding:16px 26px">
        <div style="${lbl};font-size:20px">Evolução do tratamento</div>
        <div style="display:flex;gap:14px;margin-top:14px;align-items:center"><span style="width:12px;height:12px;border-radius:50%;background:${C.caramelo}"></span><span style="width:40px;height:1.5px;background:${C.caramelo}"></span><span style="width:12px;height:12px;border-radius:50%;border:1.5px solid ${C.caramelo}"></span><span style="width:40px;height:1.5px;background:${C.caramelo}"></span><span style="width:12px;height:12px;border-radius:50%;border:1.5px solid ${C.caramelo}"></span>
        <span style="${lbl};font-size:14px;margin-left:12px;letter-spacing:.2em">CRO-BA 32044</span></div></div>`;
  } else if (tipo === 'institucional') {
    body = `<div style="position:absolute;left:0;right:0;bottom:0;height:150px;background:${band};display:flex;align-items:center;justify-content:space-between;padding:0 50px">
      <img src="${LOGO.horizEscuro}" style="height:96px">
      <span style="${lbl};font-size:18px;color:${C.caramelo}">CRO-BA 32044</span></div>`;
  }
  return htmlDoc(`<div style="position:relative;width:${w}px;height:${h}px">${body}</div>`, '', w, h, 'transparent');
}

function capaReels(r, il, tom) {
  const k = corTexto(tom); const pal = PAL[tom];
  return htmlDoc(`<div class="pg ${tom}" style="width:1080px;height:1920px">
    <div style="position:absolute;top:200px;left:96px;right:96px;display:flex;align-items:center;justify-content:space-between">${sym(k.sym, 64, 1.7)}<span class="cnt" style="color:${k.ac}">REELS ${pad(r.n)}</span></div>
    <div style="position:absolute;left:50%;top:430px;width:640px;height:640px;margin-left:-320px;border-radius:50%;background:${pal.f}"></div>
    <div style="position:absolute;left:50%;top:456px;width:640px;height:640px;margin-left:-294px;border-radius:50%;border:1.5px solid ${k.ac};opacity:.55"></div>
    <div style="position:absolute;left:50%;top:470px;margin-left:-280px">${ilustracao(il, 560, pal, 1.15)}</div>
    <div style="position:absolute;left:110px;right:110px;top:1150px;text-align:center">
      <div class="kick" style="color:${k.ac};justify-content:center;margin-bottom:40px">${esc(r.kicker)}</div>
      <div class="ttl" style="font-size:66px;line-height:1.2">${esc(r.capa)}</div>
    </div>
    <div style="position:absolute;bottom:300px;left:0;right:0;text-align:center;font-family:'Inter';font-weight:500;font-size:20px;letter-spacing:.24em;text-transform:uppercase;color:${k.ac}">Dra. Tatiane Aislan · CRO-BA 32044</div>
  </div>`, STORY_CSS, 1080, 1920);
}

module.exports = { capaReels, postPage, story, destaque, overlay, ICONES, FOTO_POS, POST_CSS, corTexto };
