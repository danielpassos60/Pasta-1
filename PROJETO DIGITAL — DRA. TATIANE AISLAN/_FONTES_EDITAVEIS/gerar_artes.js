// Gera todas as artes PNG/PDF do projeto.  Uso:  node gerar_artes.js
const fs = require('fs');
const path = require('path');
const { ROOT, C, sym, render, pdf, close, htmlDoc, KIT, LOGO, pad, esc } = require('./base');
const { postPage, story, destaque, overlay, capaReels } = require('./artes');
const { POSTS, STORIES, DESTAQUES, REFS } = require('./conteudo');

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').toUpperCase();
const P = (...a) => path.join(ROOT, ...a);
const only = process.argv[2]; // opcional: feed|stories|destaques|overlays|logos

function pastaPost(p) { return P('04_FEED_35_POSTS', `PUBLICACAO_${pad(p.n)}_${slug(p.tema).slice(0, 48)}`); }

async function feed() {
  for (const p of POSTS) {
    const dir = pastaPost(p);
    fs.mkdirSync(dir, { recursive: true });
    const tot = p.pages.length;
    for (let i = 1; i <= tot; i++) {
      const nome = tot > 1 ? `post${pad(p.n)}_pagina${i}.png` : `post${pad(p.n)}.png`;
      await render(postPage(p, p.pages[i - 1], i, tot), path.join(dir, nome));
    }
    const refs = p.refs.length ? p.refs.map((r) => `• ${REFS[r].c} ${REFS[r].l}`).join('\n') : `• ${p.fonte}`;
    const txt = `PUBLICAÇÃO ${pad(p.n)} — ${p.tema}
Área: ${p.area}
Formato: ${p.formato}
Objetivo: ${p.objetivo}

================ LEGENDA (copie a partir da linha abaixo) ================
${p.legenda}

${p.cta}

Dra. Tatiane Aislan · Cirurgiã-Dentista · CRO-BA 32044
Conteúdo educativo: não substitui a avaliação individual.

${p.hashtags.join(' ')}
==========================================================================

TEXTO DAS PÁGINAS
${p.pages.map((pg, i) => `Página ${i + 1}: ${[pg.kicker, pg.title || pg.h || pg.frase, pg.sub, pg.p, (pg.items || []).join(' / '), pg.cta].filter(Boolean).join(' | ')}`).join('\n')}

ORIENTAÇÃO VISUAL: ${p.visual}
ORIENTAÇÃO DE POSTAGEM: ${p.postagem}

REFERÊNCIA(S)
${refs}
`;
    fs.writeFileSync(path.join(dir, `LEGENDA_post${pad(p.n)}.txt`), txt);
    process.stdout.write(`post ${p.n} `);
  }
  console.log();
}

async function stories() {
  for (const s of STORIES) {
    await render(story(s), P('07_STORIES', `story${pad(s.n)}_${slug(s.tema).toLowerCase()}.png`), { w: 1080, h: 1920 });
  }
  console.log('stories ok');
}

async function reels() {
  const capas = [
    [{ n: 1, kicker: 'Reabilitação oral', capa: 'O que é reabilitação oral?' }, 'reabilitacao', 'escuro'],
    [{ n: 2, kicker: 'Implantes', capa: 'O corpo pode rejeitar um implante?' }, 'implante', 'claro'],
    [{ n: 3, kicker: 'Saúde bucal', capa: '3 erros comuns na escovação' }, 'escova', 'escuro'],
  ];
  for (const [r, il, tom] of capas) await render(capaReels(r, il, tom), P('06_REELS', 'CAPAS', `capa_reels${pad(r.n)}.png`), { w: 1080, h: 1920 });
  console.log('capas reels ok');
}

async function destaques() {
  for (const [i, d] of DESTAQUES.entries()) {
    await render(destaque(d), P('03_INSTAGRAM', 'CAPAS_DESTAQUES', `destaque${i + 1}_${slug(d.nome).toLowerCase()}.png`), { w: 1080, h: 1080 });
  }
  console.log('destaques ok');
}

async function overlays() {
  const tipos = [
    ['antes-depois', '01_modelo_universal_antes_depois'],
    ['resultado', '02_modelo_sofisticado_resultado_clinico'],
    ['evolucao', '03_modelo_minimalista_evolucao_do_tratamento'],
    ['institucional', '04_modelo_institucional_assinatura'],
    ['antes-depois-vertical', 'EXTRA_antes_depois_empilhado'],
  ];
  for (const [t, nome] of tipos) {
    await render(overlay(t, 1080, 1350), P('05_ANTES_E_DEPOIS', 'FORMATO_FEED_1080x1350', `${nome}_1080x1350.png`), { w: 1080, h: 1350, transparent: true });
    await render(overlay(t, 1080, 1080), P('05_ANTES_E_DEPOIS', 'FORMATO_QUADRADO_1080x1080', `${nome}_1080x1080.png`), { w: 1080, h: 1080, transparent: true });
  }
  // prévias sobre fundo neutro (apenas para visualização no manual)
  for (const [t, nome] of tipos.slice(0, 4)) {
    const html = overlay(t, 1080, 1350).replace('<body>', `<body style="background:repeating-linear-gradient(45deg,#cfc6ba 0 20px,#bdb3a6 20px 40px)">`);
    await render(html, P('_FONTES_EDITAVEIS', 'previas', `previa_${nome}.jpg`), { w: 1080, h: 1350 });
  }
  console.log('overlays ok');
}

async function logos() {
  const map = [
    ['1-logo-horizontal', 'LOGO_HORIZONTAL_PRINCIPAL'],
    ['2-logo-vertical', 'LOGO_VERTICAL'],
    ['3-simbolo', 'SIMBOLO_ISOLADO'],
    ['4-estampa', 'ESTAMPA'],
  ];
  const nomes = {
    'colorido-fundo-claro': 'colorido_PARA_FUNDO_CLARO', 'colorido-fundo-escuro': 'colorido_PARA_FUNDO_ESCURO',
    'monocromatico-ardosia': 'monocromatico_ardosia', 'monocromatico-areia': 'monocromatico_areia',
    preto: 'monocromatico_preto', branco: 'NEGATIVO_branco',
  };
  for (const [src, dst] of map) {
    const dir = path.join(KIT, src);
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.svg'))) {
      const svg = fs.readFileSync(path.join(dir, f), 'utf8');
      const w = +svg.match(/width="([\d.]+)"/)[1], h = +svg.match(/height="([\d.]+)"/)[1];
      const key = f.replace(/^TA-(horizontal|vertical|simbolo|estampa)-/, '').replace('.svg', '');
      const base = `TA_${dst.toLowerCase()}_${nomes[key] || key}`;
      fs.mkdirSync(P('01_IDENTIDADE_VISUAL', dst, 'SVG_vetorial'), { recursive: true });
      fs.copyFileSync(path.join(dir, f), P('01_IDENTIDADE_VISUAL', dst, 'SVG_vetorial', base + '.svg'));
      const dark = /escuro|branco|areia/.test(key) && src !== '4-estampa';
      const doc = (bg) => `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:${w}px ${h}px;margin:0}html,body{margin:0;width:${w}px;height:${h}px;background:${bg}}img{display:block;width:${w}px;height:${h}px}</style></head><body><img src="file://${encodeURI(path.join(dir, f))}"></body></html>`;
      await pdf(doc('transparent'), P('01_IDENTIDADE_VISUAL', dst, 'PDF_vetorial', base + '.pdf'), { w, h });
      const scale = Math.max(4, Math.ceil(4000 / Math.max(w, h)));
      await render(doc('transparent'), P('01_IDENTIDADE_VISUAL', dst, 'PNG_alta_resolucao', `${base}_${Math.round(w * scale)}px.png`), { w, h, scale, transparent: src !== '4-estampa' });
      if (src !== '4-estampa') {
        await render(doc(dark ? C.ardosia : C.off), P('_FONTES_EDITAVEIS', 'previas', 'logos', base + '.png'), { w, h, scale: 1 });
      }
    }
  }
  // Paleta e tipografia
  const cores = [['Ardósia', C.ardosia, '47, 58, 69', 'Principal · 60%', C.areia], ['Areia', C.areia, '233, 224, 211', 'Principal · 30%', C.ardosia], ['Caramelo', C.caramelo, '199, 158, 116', 'Destaque · 10%', C.ardosia], ['Caramelo escuro', C.caramEsc, '160, 122, 85', 'Apoio · textos pequenos', C.off], ['Off-white', C.off, '244, 238, 230', 'Apoio · fundos', C.ardosia]];
  const paleta = htmlDoc(`<div style="width:2400px;height:1500px;background:${C.off};padding:120px;color:${C.ardosia}">
    <div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div style="font-family:Inter;font-weight:500;font-size:28px;letter-spacing:.32em;color:${C.caramEsc}">PALETA OFICIAL</div><div class="jost caps" style="font-size:86px;font-weight:300;letter-spacing:.14em;margin-top:24px">Cores e tipografia</div></div><img src="${LOGO.horizClaro}" style="height:170px"></div>
    <div style="display:flex;gap:30px;margin-top:90px">${cores.map(([n, hx, rgb, uso, tx]) => `<div style="flex:1;height:560px;background:${hx};color:${tx};padding:44px;display:flex;flex-direction:column;justify-content:flex-end;${hx === C.off ? 'border:1.5px solid #ddd2c2' : ''}"><div class="jost caps" style="font-size:44px;font-weight:300;letter-spacing:.12em">${n}</div><div style="font-size:30px;margin-top:20px;font-weight:400">${hx}</div><div style="font-size:24px;margin-top:8px">RGB ${rgb}</div><div style="font-size:22px;margin-top:22px;letter-spacing:.14em;text-transform:uppercase;font-weight:500">${uso}</div></div>`).join('')}</div>
    <div style="display:flex;gap:120px;margin-top:90px;align-items:flex-end">
      <div><div style="font-size:24px;letter-spacing:.3em;color:${C.caramEsc};font-weight:500">TÍTULOS · JOST LIGHT</div><div class="jost caps" style="font-size:72px;font-weight:300;letter-spacing:.16em;margin-top:16px">Sorrisos com técnica</div></div>
      <div><div style="font-size:24px;letter-spacing:.3em;color:${C.caramEsc};font-weight:500">TEXTOS · INTER LIGHT / MEDIUM</div><div style="font-size:44px;font-weight:300;margin-top:16px">Texto corrido em Inter Light. <span style="font-weight:500;letter-spacing:.2em;font-size:30px;color:${C.caramEsc}">AGENDE SUA AVALIAÇÃO</span></div></div>
    </div></div>`, '', 2400, 1500, C.off);
  await render(paleta, P('01_IDENTIDADE_VISUAL', 'PALETA_E_TIPOGRAFIA', 'paleta_e_tipografia.png'), { w: 2400, h: 1500 });
  await pdf(paleta, P('01_IDENTIDADE_VISUAL', 'PALETA_E_TIPOGRAFIA', 'paleta_e_tipografia.pdf'), { w: 2400, h: 1500 });
  console.log('logos + paleta ok');
}

if (require.main === module) (async () => {
  if (!only || only === 'feed') await feed();
  if (!only || only === 'stories') await stories();
  if (!only || only === 'reels') await reels();
  if (!only || only === 'destaques') await destaques();
  if (!only || only === 'overlays') await overlays();
  if (!only || only === 'logos') await logos();
  await close();
})().catch((e) => { console.error(e); process.exit(1); });

module.exports = { pastaPost, slug };
