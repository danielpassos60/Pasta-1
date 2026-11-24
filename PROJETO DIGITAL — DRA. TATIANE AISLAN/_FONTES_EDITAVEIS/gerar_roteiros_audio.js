// Roteiros para gravação de áudio (Reels/TikTok) — PDF em formato de celular, com a identidade visual.
// Uso: node gerar_roteiros_audio.js
const fs = require('fs');
const path = require('path');
const { ROOT, C, FONTS, sym, browser, close, fileUrl, TMP, esc } = require('./base');
const { ilustracao } = require('./ilustracoes');

const OUT = path.join(ROOT, '06_REELS', 'ROTEIROS_PARA_AUDIO', 'Roteiros_para_gravacao_Dra_Tatiane_Aislan.pdf');
const LOGO_ESC = fileUrl(path.join(ROOT, '02_SITE/site/assets/img/logo-horizontal-escuro-1260.png'));
const LOGO_CLA = fileUrl(path.join(ROOT, '02_SITE/site/assets/img/logo-horizontal-1260.png'));

const APRESENTACAO = 'Eu sou a Dra. Tatiane Aislan, cirurgiã-dentista aqui em Salvador e Lauro de Freitas.';

const ROTEIROS = [
  {
    n: 1, arquivo: 'roteiro1_facetas', titulo: 'O que é faceta em resina?', il: 'restauracao', tema: 'Facetas em resina',
    blocos: [
      ['Gancho', 'Você já ouviu falar em faceta em resina… mas não sabe exatamente o que é? Então fica comigo, que eu te explico rapidinho.'],
      ['Apresentação', APRESENTACAO],
      ['O que é', 'A faceta em resina é uma camada fina de resina, aplicada na parte da frente do dente, direto no consultório. Ela é modelada ali, na hora, para melhorar a forma, a cor e a harmonia do sorriso.'],
      ['Para quem', 'Ela pode ajudar quando o dente tem manchas, pequenas fraturas, desgastes ou espacinhos entre os dentes. Mas atenção: antes da estética, vem a saúde. Se tiver cárie ou gengiva inflamada, a gente trata isso primeiro.'],
      ['Cuidados', 'E a faceta pede cuidado, viu? Escovação, fio dental e consultas de manutenção com polimento ajudam a manter o brilho e a durabilidade. Hábitos como roer unha ou ranger os dentes também fazem diferença.'],
      ['Final', 'O meu objetivo é sempre um resultado natural, que combine com você. Quer saber se a faceta em resina é indicada para o seu sorriso? Me chama no WhatsApp, o link está na bio. E salva esse vídeo pra não esquecer!'],
    ],
  },
  {
    n: 2, arquivo: 'roteiro2_siso', titulo: 'Preciso tirar o dente do siso?', il: 'siso', tema: 'Cirurgia e extração',
    blocos: [
      ['Gancho', 'Toda vez que alguém fala de siso, vem a mesma pergunta: precisa tirar? E a resposta pode te surpreender.'],
      ['Apresentação', APRESENTACAO + ' E cirurgia de siso faz parte da minha rotina.'],
      ['Nem todo siso sai', 'Primeiro: nem todo siso precisa ser extraído. Quando ele está saudável, bem posicionado e não causa nenhum problema, muitas vezes dá pra só acompanhar.'],
      ['Quando tirar', 'A extração costuma ser indicada quando tem inflamação ou infecção na gengiva ao redor do siso, cárie que não dá pra tratar, quando ele prejudica o dente vizinho, ou quando aparecem cistos e outras alterações.'],
      ['Quem decide', 'E quem decide isso não é a idade, nem o que o amigo fez. É a avaliação. Com o exame clínico e a radiografia, a gente vê a posição do dente, os riscos, e escolhe o caminho mais seguro pra você.'],
      ['Final', 'Se o seu siso tá incomodando, ou você nunca avaliou, não deixa pra depois. Me chama no WhatsApp, o link está na bio. E manda esse vídeo praquele amigo que vive reclamando do siso!'],
    ],
  },
  {
    n: 3, arquivo: 'roteiro3_carie', titulo: 'A cárie começa sem dor', il: 'carie', tema: 'Cárie e prevenção',
    blocos: [
      ['Gancho', 'Se o seu dente não dói, quer dizer que está tudo bem? Nem sempre. E eu vou te explicar o porquê.'],
      ['Apresentação', APRESENTACAO],
      ['Como começa', 'A cárie começa em silêncio. As bactérias da placa usam o açúcar que a gente come e produzem ácidos, que vão enfraquecendo o dente aos pouquinhos.'],
      ['Os primeiros sinais', 'No começo, ela pode aparecer só como uma manchinha branca, sem dor nenhuma. E é justamente nessa fase que muitas lesões podem ser controladas, às vezes sem precisar de restauração.'],
      ['Como prevenir', 'Pra prevenir: escova com creme dental com flúor pelo menos duas vezes ao dia, usa fio dental, e presta atenção no açúcar ao longo do dia, principalmente naqueles beliscos entre as refeições.'],
      ['Final', 'Quando a cárie já abriu um buraquinho, a restauração devolve a forma e a função do dente. Mas o melhor é descobrir cedo. Faz tempo que você não vai ao dentista? Me chama no WhatsApp, o link está na bio. E salva esse vídeo!'],
    ],
  },
];

const palavras = (r) => r.blocos.map((b) => b[1]).join(' ').split(/\s+/).length;
const duracao = (r) => { const s = Math.round(palavras(r) / 2.4); return `${Math.floor(s / 60)}min${String(s % 60).padStart(2, '0')}s`; };

const W = 108, H = 192; // mm — proporção de tela de celular (9:16)
const CSS = `${FONTS}
@page{size:${W}mm ${H}mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter;font-weight:300;color:${C.ardosia};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:${W}mm;height:${H}mm;position:relative;overflow:hidden;break-after:page;padding:11mm 9mm}
.esc{background:${C.ardosia};color:${C.areia}}.cla{background:${C.areia}}.off{background:${C.off}}
.k{font-family:Inter;font-weight:500;font-size:6.2pt;letter-spacing:.3em;text-transform:uppercase;display:flex;align-items:center;gap:3mm}
.k:before{content:'';width:7mm;height:.6pt;background:currentColor}
.t{font-family:Jost;font-weight:300;text-transform:uppercase;letter-spacing:.12em;line-height:1.2}
.foot{position:absolute;left:9mm;right:9mm;bottom:7mm;display:flex;justify-content:space-between;font-family:Inter;font-weight:500;font-size:5.6pt;letter-spacing:.22em;text-transform:uppercase}
.bl{margin-bottom:4.4mm;break-inside:avoid}
.bl .lb{font-family:Inter;font-weight:500;font-size:6pt;letter-spacing:.26em;text-transform:uppercase;color:${C.caramEsc};margin-bottom:1.6mm;display:flex;align-items:center;gap:2mm}
.bl .lb b{font-family:Jost;font-weight:300;font-size:9pt;letter-spacing:.04em;color:${C.caramelo}}
.bl .tx{font-family:Inter;font-weight:400;font-size:12pt;line-height:1.48;color:${C.ardosia}}
.pausa{font-family:Inter;font-weight:500;font-size:6pt;letter-spacing:.24em;color:${C.caramelo};text-align:center;margin:-1.5mm 0 4mm}
.chip{display:inline-block;border:.6pt solid ${C.caramEsc};color:${C.caramEsc};font-weight:500;font-size:6pt;letter-spacing:.16em;text-transform:uppercase;padding:1.2mm 2.6mm;margin:0 1.5mm 1.5mm 0}
ol.dicas{padding-left:5mm}ol.dicas li{font-size:9.6pt;line-height:1.5;margin-bottom:2.6mm}
`;

function capa() {
  return `<div class="pg esc">
    <div style="position:absolute;right:-60mm;top:20mm;opacity:1">${sym('#394552', 520, 2.4)}</div>
    <div class="k" style="color:${C.caramelo}">Roteiros para gravação</div>
    <div style="position:absolute;left:9mm;right:9mm;top:58mm">
      <img src="${LOGO_ESC}" style="width:88mm;margin-left:-2mm">
      <div style="width:12mm;height:.6pt;background:${C.caramelo};margin:9mm 0 6mm"></div>
      <div class="t" style="font-size:15pt">3 vídeos curtos</div>
      <div style="font-size:9.5pt;line-height:1.55;margin-top:3mm;color:#DCD2C4">Reels e TikTok · cerca de 1 minuto cada.<br>Leia em voz alta, grave o áudio e envie.</div>
      <div style="margin-top:9mm">${ROTEIROS.map((r) => `<div style="display:flex;gap:3mm;align-items:baseline;padding:2.4mm 0;border-top:.5pt solid #44505D"><span style="font-family:Jost;font-weight:200;font-size:13pt;color:${C.caramelo}">0${r.n}</span><span class="t" style="font-size:8.2pt;letter-spacing:.1em">${esc(r.titulo)}</span></div>`).join('')}</div>
    </div>
    <div class="foot" style="color:${C.caramelo}"><span>Dra. Tatiane Aislan</span><span>CRO-BA 32044</span></div></div>`;
}

function dicas() {
  return `<div class="pg off">
    <div class="k" style="color:${C.caramEsc}">Antes de gravar</div>
    <div class="t" style="font-size:15pt;margin:5mm 0 7mm">Como gravar o áudio</div>
    <ol class="dicas">
      <li><b style="font-weight:500">Lugar silencioso</b>, de preferência um cômodo com cortinas, tapete ou roupas (menos eco). Ventilador e ar-condicionado desligados.</li>
      <li>Use o <b style="font-weight:500">gravador de voz do celular</b> (ou um áudio do WhatsApp), com o celular a um palmo da boca.</li>
      <li>Fale <b style="font-weight:500">sorrindo e com calma</b>, como se conversasse com uma paciente. Não precisa decorar: é só ler.</li>
      <li>Onde aparecer <b style="font-weight:500;color:${C.caramEsc}">· pausa ·</b>, respire e conte até 2. Isso ajuda na edição.</li>
      <li>Errou? <b style="font-weight:500">Não pare.</b> Respire e repita só a frase. A gente corta na edição.</li>
      <li><b style="font-weight:500">Um áudio por roteiro</b>, com o nome indicado no topo da página (ex.: roteiro1_facetas).</li>
    </ol>
    <div style="margin-top:5mm;padding:4mm;border-left:.8pt solid ${C.caramelo};background:${C.areia};font-size:9pt;line-height:1.5">Pode adaptar palavras para o seu jeito de falar. O importante é manter a ideia de cada bloco e a chamada final.</div>
    <div class="foot" style="color:${C.caramEsc}"><span>Dra. Tatiane Aislan</span><span>CRO-BA 32044</span></div></div>`;
}

function abertura(r) {
  const pal = { l: C.ardosia, a: C.caramEsc, f: '#DFD3C2', bg: C.areia };
  return `<div class="pg cla">
    <div style="display:flex;justify-content:space-between;align-items:center">${sym(C.caramEsc, 30, 1.1)}<span class="k" style="color:${C.caramEsc}">Roteiro ${r.n} de 3</span></div>
    <div style="position:absolute;left:50%;top:28mm;width:76mm;height:76mm;margin-left:-38mm;border-radius:50%;background:${pal.f}"></div>
    <div style="position:absolute;left:50%;top:31mm;width:76mm;height:76mm;margin-left:-35mm;border-radius:50%;border:.6pt solid ${C.caramEsc};opacity:.55"></div>
    <div style="position:absolute;left:50%;top:32mm;margin-left:-34mm">${ilustracao(r.il, 257, pal, 1.2)}</div>
    <div style="position:absolute;left:9mm;right:9mm;top:116mm">
      <div class="k" style="color:${C.caramEsc};margin-bottom:4mm">${esc(r.tema)}</div>
      <div class="t" style="font-size:17pt">${esc(r.titulo)}</div>
      <div style="margin-top:6mm"><span class="chip">≈ ${duracao(r)}</span><span class="chip">Áudio: ${r.arquivo}</span></div>
    </div>
    <div class="foot" style="color:${C.caramEsc}"><span>Dra. Tatiane Aislan</span><span>Vire a página →</span></div></div>`;
}

function texto(r) {
  // distribui os blocos em páginas de leitura confortável (3 blocos por página)
  const paginas = [r.blocos.slice(0, 3), r.blocos.slice(3)];
  return paginas.map((bls, pi) => `<div class="pg off">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6mm"><span class="k" style="color:${C.caramEsc}">${r.arquivo}</span><span style="font-family:Inter;font-weight:500;font-size:6pt;letter-spacing:.2em;color:${C.caramEsc}">${pi + 1}/2</span></div>
    ${bls.map(([lb, tx], i) => `<div class="bl"><div class="lb"><b>${String(pi * 3 + i + 1).padStart(2, '0')}</b>${esc(lb)}</div><div class="tx">${esc(tx).replace(/WhatsApp/g, '<b style="font-weight:500">WhatsApp</b>')}</div></div>${(pi * 3 + i + 1) < r.blocos.length ? '<div class="pausa">· pausa ·</div>' : ''}`).join('')}
    ${pi === 1 ? `<div style="margin-top:3mm;text-align:center;font-family:Inter;font-weight:500;font-size:6.4pt;letter-spacing:.26em;color:${C.caramEsc}">FIM DO ROTEIRO ${r.n} · ENVIAR ÁUDIO</div>` : ''}
    <div class="foot" style="color:${C.caramEsc}"><span>Dra. Tatiane Aislan</span><span>${esc(r.titulo)}</span></div></div>`).join('');
}

function final() {
  return `<div class="pg esc" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    ${sym(C.caramelo, 90, 1.6)}
    <div class="t" style="font-size:13pt;margin-top:9mm">Obrigado!</div>
    <div style="font-size:9.5pt;line-height:1.6;margin-top:4mm;color:#DCD2C4;max-width:76mm">Depois de gravar, envie os 3 áudios:<br><b style="font-weight:500;color:${C.areia}">roteiro1_facetas · roteiro2_siso · roteiro3_carie</b></div>
    <div class="foot" style="color:${C.caramelo}"><span>Dra. Tatiane Aislan</span><span>CRO-BA 32044</span></div></div>`;
}

(async () => {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${capa()}${dicas()}${ROTEIROS.map((r) => abertura(r) + texto(r)).join('')}${final()}</body></html>`;
  const f = path.join(TMP, 'roteiros_audio.html'); fs.writeFileSync(f, html);
  const b = await browser(); const page = await b.newPage();
  await page.goto(fileUrl(f)); await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await page.pdf({ path: OUT, printBackground: true, preferCSSPageSize: true });
  await close();
  ROTEIROS.forEach((r) => console.log(r.arquivo, palavras(r), 'palavras', duracao(r)));
  console.log('ok', OUT);
})();

module.exports = { ROTEIROS };
