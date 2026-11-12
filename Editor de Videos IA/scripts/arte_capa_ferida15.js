// Gera as 4 imagens da faixa da capa (ilustrações próprias): node scripts/arte_capa_ferida15.js
const {chromium} = require('playwright'); const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..'); const out = path.join(root, 'public', 'midia', 'ferida15'); fs.mkdirSync(out, {recursive: true});
const font = (n, w, f) => `@font-face{font-family:'${n}';font-weight:${w};src:url('file://${root}/node_modules/@fontsource/${f}')}`;
const css = `${font('IT',800,'inter-tight/files/inter-tight-latin-800-normal.woff2')}${font('PF',700,'playfair-display/files/playfair-display-latin-700-normal.woff2')}${font('JM',700,'jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2')}
*{margin:0;box-sizing:border-box}body{width:630px;height:840px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center}`;
const INK = '#0A0A0A', LIME = '#CAFC00', PAPER = '#F3EFE6', PINK = '#EFA3A8', PINK2 = '#D9838B';
const tongue = (lesion) => `<svg viewBox="0 0 400 533" width="630" height="840"><rect width="400" height="533" fill="${PAPER}"/>
 <path d="M60 -10 C50 170 62 320 100 400 C140 480 260 480 300 400 C338 320 350 170 340 -10 Z" fill="${PINK}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
 <path d="M200 20 C198 140 200 260 200 372" fill="none" stroke="${PINK2}" stroke-width="8" stroke-linecap="round"/>
 ${[[120,90],[150,150],[262,110],[286,190],[244,240],[142,330],[270,350],[228,400],[166,410]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.5" fill="${PINK2}" opacity=".75"/>`).join('')}
 ${lesion}</svg>`;
const leuco = `<path d="M84 196 C104 166 158 172 178 202 C200 234 190 276 164 302 C144 322 108 328 90 300 C70 270 66 222 84 196 Z" fill="#FFFDF7" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
 <path d="M108 214 q12 -9 24 0 M126 250 q12 -9 24 0 M104 272 q11 -8 22 0 M144 222 q9 -7 18 0" fill="none" stroke="#CFC8B8" stroke-width="5" stroke-linecap="round"/>
 <circle cx="130" cy="250" r="92" fill="none" stroke="${LIME}" stroke-width="9" stroke-dasharray="15 15"/>`;
const eritro = `<path d="M230 188 C258 162 312 178 324 214 C336 250 318 294 288 306 C256 318 220 298 212 262 C206 234 212 206 230 188 Z" fill="#D7263D" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
 ${[[248,214],[278,206],[300,236],[262,246],[288,274],[242,270]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#9E1326"/>`).join('')}
 <circle cx="268" cy="244" r="92" fill="none" stroke="${LIME}" stroke-width="9" stroke-dasharray="15 15"/>`;
const cal = `<div style="display:grid;grid-template-columns:repeat(3,150px);gap:18px">${Array.from({length:9}).map((_,i)=> i<8
  ? `<div style="width:150px;height:150px;border:4px solid #3a3a40;border-radius:22px;position:relative"><svg viewBox="0 0 100 100" style="position:absolute;inset:0"><path d="M22 22 L78 78 M78 22 L22 78" stroke="${LIME}" stroke-width="11" stroke-linecap="round"/></svg></div>`
  : `<div style="width:150px;height:150px;background:${LIME};border-radius:22px;display:flex;align-items:center;justify-content:center;font:700 78px JM;color:${INK}">15</div>`).join('')}</div>`;
const arts = {
  capa_15: [LIME, `<div style="font:700 400px/0.8 PF;color:${INK};letter-spacing:-.05em">15</div><div style="font:800 110px IT;color:${INK};letter-spacing:-.04em;margin-top:26px">dias</div>`],
  capa_leuco: [PAPER, tongue(leuco)],
  capa_cal: ['#0B0B0D', cal],
  capa_eritro: [PAPER, tongue(eritro)],
};
(async () => {
  const b = await chromium.launch();
  for (const [name, [bg, html]] of Object.entries(arts)) {
    const p = await b.newPage({viewport: {width: 630, height: 840}}); await p.setContent(`<style>${css}</style><body style="background:${bg}">${html}</body>`);
    await p.waitForTimeout(350); await p.screenshot({path: path.join(out, name + '.png')}); await p.close(); console.log('arte', name);
  } await b.close();
})();
