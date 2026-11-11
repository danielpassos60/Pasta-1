// Tokens de marca, fontes e utilitários de renderização (Playwright/Chromium)
const path = require('path');
const fs = require('fs');

const DIR = __dirname;
const ROOT = path.resolve(DIR, '..');
const fileUrl = (p) => 'file://' + encodeURI(p).replace(/#/g, '%23');

const C = {
  ardosia: '#2F3A45', areia: '#E9E0D3', caramelo: '#C79E74', caramEsc: '#A07A55',
  off: '#F4EEE6', estClaro: '#DCD1C1', estEscuro: '#394552',
};

const font = (fam, file, w) => `@font-face{font-family:'${fam}';src:url('${fileUrl(path.join(DIR, 'fonts', file))}') format('woff2');font-weight:${w};font-style:normal;font-display:block}`;
const FONTS = [
  font('Jost', 'jost-latin-200-normal.woff2', 200), font('Jost', 'jost-latin-300-normal.woff2', 300), font('Jost', 'jost-latin-400-normal.woff2', 400),
  font('Inter', 'inter-latin-300-normal.woff2', 300), font('Inter', 'inter-latin-400-normal.woff2', 400), font('Inter', 'inter-latin-500-normal.woff2', 500),
].join('\n');

// Símbolo oficial (molar com T na coroa e raízes formando A) — traçado idêntico ao kit
const SYM_PATHS = [
  'M0.06,0.42 C-0.02,0.20 0.06,0.02 0.24,0.0 C0.34,-0.01 0.42,0.05 0.50,0.07 C0.58,0.05 0.66,-0.01 0.76,0.0 C0.94,0.02 1.02,0.20 0.94,0.42 C0.90,0.55 0.86,0.70 0.82,1.0',
  'M0.06,0.42 C0.10,0.55 0.14,0.70 0.18,1.0',
  'M0.30,1.0 L0.50,0.50 L0.70,1.0',
  'M0.26,0.30 L0.74,0.30 M0.50,0.30 L0.50,0.50',
];
function sym(color, size, strokePx = Math.max(1.2, size * 0.0126), extra = '') {
  const sw = (strokePx / size) * 1.06;
  return `<svg ${extra} viewBox="-0.03 -0.03 1.06 1.06" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${color}" stroke-width="${sw.toFixed(5)}" stroke-linecap="round" stroke-linejoin="round">${SYM_PATHS.map((d) => `<path d="${d}"/>`).join('')}</g></svg>`;
}

const KIT = path.join(DIR, 'kit_original');
const LOGO = {
  horizClaro: fileUrl(path.join(KIT, '1-logo-horizontal/TA-horizontal-colorido-fundo-claro.svg')),
  horizEscuro: fileUrl(path.join(KIT, '1-logo-horizontal/TA-horizontal-colorido-fundo-escuro.svg')),
  vertClaro: fileUrl(path.join(KIT, '2-logo-vertical/TA-vertical-colorido-fundo-claro.svg')),
  vertEscuro: fileUrl(path.join(KIT, '2-logo-vertical/TA-vertical-colorido-fundo-escuro.svg')),
  horizBranco: fileUrl(path.join(KIT, '1-logo-horizontal/TA-horizontal-branco.svg')),
};
const FOTO = (nome) => fileUrl(path.join(DIR, 'fotos', nome + '.jpg'));

const BASE_CSS = `${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:transparent}
body{font-family:'Inter',sans-serif;font-weight:300;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
.jost{font-family:'Jost',sans-serif}
.caps{text-transform:uppercase}
`;

function htmlDoc(body, css = '', w = 1080, h = 1350, bg = 'transparent') {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${BASE_CSS}
  html,body{width:${w}px;height:${h}px;overflow:hidden;background:${bg}}
  ${css}</style></head><body>${body}</body></html>`;
}

let _browser;
async function browser() {
  if (!_browser) { const { chromium } = require('playwright'); _browser = await chromium.launch(); }
  return _browser;
}
const TMP = path.join(require('os').tmpdir(), 'ta_render');
fs.mkdirSync(TMP, { recursive: true });
let _i = 0;
async function render(html, out, { w = 1080, h = 1350, transparent = false, scale = 1, type } = {}) {
  const b = await browser();
  const page = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const f = path.join(TMP, `r${_i++}.html`);
  fs.writeFileSync(f, html);
  await page.goto(fileUrl(f), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const opts = { path: out, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } };
  if (type === 'jpeg' || out.endsWith('.jpg')) { opts.type = 'jpeg'; opts.quality = 90; }
  await page.screenshot(opts);
  await page.close();
}
async function pdf(html, out, { w, h, wUnit = 'px' } = {}) {
  const b = await browser();
  const page = await b.newPage();
  const f = path.join(TMP, `p${_i++}.html`);
  fs.writeFileSync(f, html);
  await page.goto(fileUrl(f), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.pdf({ path: out, width: w + wUnit, height: h + wUnit, printBackground: true, pageRanges: '1' });
  await page.close();
}
async function close() { if (_browser) await _browser.close(); _browser = null; }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pad = (n) => String(n).padStart(2, '0');

module.exports = { DIR, ROOT, C, sym, LOGO, FOTO, KIT, BASE_CSS, FONTS, htmlDoc, render, pdf, close, esc, pad, fileUrl, browser, TMP };
