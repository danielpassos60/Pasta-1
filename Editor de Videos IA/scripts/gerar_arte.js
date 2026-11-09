// Gera "imagens bonitonas" (cartazes na identidade verde) com o Chromium: node scripts/gerar_arte.js
const {chromium} = require('playwright'); const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..'); const out = path.join(root, 'public', 'midia'); fs.mkdirSync(out, {recursive: true});
const font = (n, w, f) => `@font-face{font-family:'${n}';font-weight:${w};src:url('file://${root}/node_modules/@fontsource/${f}')}`;
const css = `${font('IT',600,'inter-tight/files/inter-tight-latin-600-normal.woff2')}${font('IT',800,'inter-tight/files/inter-tight-latin-800-normal.woff2')}${font('PF',700,'playfair-display/files/playfair-display-latin-700-normal.woff2')}
*{margin:0;box-sizing:border-box}body{width:100vw;height:100vh;overflow:hidden;font-family:IT}
.lime{background:#CAFC00;color:#0A0A0A}.dark{background:#0B0B0D;color:#F3EFE6}.paper{background:#F3EFE6;color:#0A0A0A}
.c{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;gap:2vh}
.big{font-family:PF;font-weight:700;line-height:.9;letter-spacing:-.04em}.mono{font-weight:600;letter-spacing:.25em;font-size:3.2vh;text-transform:uppercase}
.tag{background:#CAFC00;color:#0A0A0A;padding:.6vh 2vh;font-weight:800;font-size:5vh;transform:rotate(-4deg)}
.bar{width:11vh;background:#CAFC00}`;
const arts = {
  t_real: ['lime', `<div class=c><div class=big style="font-size:46vh">R$</div></div>`],
  t_graf: ['dark', `<div class=c><div style="display:flex;align-items:flex-end;gap:2vh;height:40vh"><div class=bar style="height:30%"></div><div class=bar style="height:55%;background:#F3EFE6"></div><div class=bar style="height:42%"></div><div class=bar style="height:80%;background:#F3EFE6"></div></div><div class=mono style="color:#CAFC00">economia</div></div>`],
  t_poupar: ['paper', `<div class=c><div class=big style="font-size:14vh">poupar</div><div class=tag>agora</div></div>`],
  t_eleicao: ['dark', `<div class=c><div class=mono style="color:#CAFC00">pós</div><div class=big style="font-size:15vh;color:#F3EFE6">eleição</div><div class=mono>próximo ano</div></div>`],
  card_compras: ['dark', `<div class=c style="gap:4vh"><div class=tag style="font-size:4.5vh">promoção!!</div><div class=big style="font-size:19vh;color:#CAFC00">bolsa</div><div class=big style="font-size:19vh">roupa</div><div class=mono>R$ 899 · R$ 1.290 · R$ 349</div></div>`],
  float_botao: ['paper', `<div class=c style="gap:5vh"><div class=mono style="color:#777">1 clique</div><div style="background:#0A0A0A;color:#CAFC00;font-weight:800;font-size:6.5vh;padding:3vh 5vh;border-radius:6vh">COMPRAR AGORA</div><div style="font-size:4vh;font-weight:600">pagamento aprovado ✓</div></div>`],
};
(async () => {
  const b = await chromium.launch(); const sizes = {card_compras: [760, 1100], float_botao: [620, 760]};
  for (const [name, [cls, html]] of Object.entries(arts)) {
    const [w, h] = sizes[name] || [600, 800]; const p = await b.newPage({viewport: {width: w, height: h}, deviceScaleFactor: 2});
    await p.setContent(`<style>${css}</style><body class="${cls}">${html}</body>`); await p.waitForTimeout(400);
    await p.screenshot({path: path.join(out, name + '.png')}); await p.close(); console.log('arte', name);
  } await b.close();
})();
