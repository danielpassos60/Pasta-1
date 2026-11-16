// Capa no padrão da marca Dr. Daniel Passos (grafite, papel, verde-água, Jost + Syncopate).
// Uso: node scripts/capa_marca.js <saida.jpg> [variação]
const {chromium} = require('playwright'); const path = require('path'); const fs = require('fs');
const root = path.join(__dirname, '..'); const MIME = {'.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg'};
const f = (p) => `data:${MIME[path.extname(p)]};base64,` + fs.readFileSync(path.join(root, p)).toString('base64');
const out = process.argv[2] || path.join(root, 'Videos Prontos/ferida15_capa_marca.jpg');
const fonts = ['200','300','400','500'].map(w => `@font-face{font-family:Jost;font-weight:${w};src:url('${f(`node_modules/@fontsource/jost/files/jost-latin-${w}-normal.woff2`)}')}`).join('') +
  ['400','700'].map(w => `@font-face{font-family:Syncopate;font-weight:${w};src:url('${f(`node_modules/@fontsource/syncopate/files/syncopate-latin-${w}-normal.woff2`)}')}`).join('');
const html = `<!doctype html><meta charset="utf-8"><style>${fonts}
:root{--papel:#F4F4F1;--grafite:#161718;--agua:#2F6B69;--agua2:#3E7C7A;--agua3:#7FB3B0;--claro:#EDEDEA;--claro2:#A9ACAD}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;background:var(--grafite);font-family:Jost;color:var(--claro);position:relative}
.foto{position:absolute;inset:0;background:url('${f('public/marca/daniel-retrato-estudio.jpg')}') no-repeat;background-size:auto 1920px;background-position:-180px 0}
.veu{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(22,23,24,.55) 0%,rgba(22,23,24,0) 17%,rgba(22,23,24,0) 40%,rgba(22,23,24,.84) 58%,rgba(22,23,24,.97) 74%,var(--grafite) 100%)}
.logo{position:absolute;top:60px;left:50%;transform:translateX(-50%);width:400px}
.rot{font-family:Syncopate;font-weight:400;font-size:21px;letter-spacing:.34em;text-transform:uppercase}
.bloco{position:absolute;left:84px;right:150px;top:1092px}
.bloco .rot{color:var(--agua3)}
h1{font-weight:200;text-transform:uppercase;line-height:1.02;letter-spacing:.01em;margin-top:30px}
h1 .l1{display:block;font-size:66px;color:var(--claro)}
h1 .l2{display:flex;align-items:baseline;gap:22px;margin-top:6px}
h1 .n{font-weight:300;font-size:250px;line-height:.86;letter-spacing:-.02em;color:var(--papel)}
h1 .d{font-weight:300;font-size:118px;color:var(--agua3)}
.traco{width:84px;height:3px;background:var(--agua2);margin:40px 0 30px}
.cta{display:flex;align-items:center;gap:20px}
.cta span{font-family:Syncopate;font-weight:700;font-size:25px;letter-spacing:.3em;text-transform:uppercase;color:var(--papel)}
.cta i{display:block;width:46px;height:2px;background:var(--agua3);position:relative}
.cta i::after{content:"";position:absolute;right:0;top:-6px;width:12px;height:12px;border-top:2px solid var(--agua3);border-right:2px solid var(--agua3);transform:rotate(45deg)}
.pe{position:absolute;left:84px;right:84px;bottom:76px;display:flex;justify-content:space-between;color:var(--claro2)}
.pe .rot{font-size:15px;letter-spacing:.3em}
.simbolo{position:absolute;right:-40px;top:1080px;width:300px;opacity:.10}
</style>
<body><div class="foto"></div><div class="veu"></div>
<img class="logo" src="${f('public/marca/logo-clara.png')}">
<div class="bloco">
  <div class="rot">Patologia oral · Prevenção</div>
  <h1><span class="l1">Ferida na boca<br>há mais de</span><span class="l2"><span class="n">15</span><span class="d">dias?</span></span></h1>
  <div class="traco"></div>
  <div class="cta"><span>Assiste isso</span><i></i></div>
</div>
<div class="pe"><span class="rot">@drdanielpassos</span><span class="rot">CRO-BA 32800</span></div>
</body>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1080, height: 1920}});
  await p.setContent(html, {waitUntil: 'load'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({path: out, type: 'jpeg', quality: 94}); await b.close(); console.log('capa ->', out);
})();
