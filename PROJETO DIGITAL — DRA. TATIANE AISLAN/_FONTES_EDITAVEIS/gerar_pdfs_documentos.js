// Converte os documentos .md do projeto em PDFs legíveis no celular (A4, identidade visual da marca).
// Requer o pacote "marked" (npm i marked). Uso: node gerar_pdfs_documentos.js [caminho/para/node_modules/marked]
const fs = require('fs');
const path = require('path');
const { ROOT, C, FONTS, LOGO, browser, close, fileUrl, TMP } = require('./base');
const { marked } = require(process.argv[2] || 'marked');

const DOCS = [
  'LEIA-ME.md',
  '01_IDENTIDADE_VISUAL/LEIA-ME_LOGOMARCA.md',
  '02_SITE/COMO_PUBLICAR.md',
  '03_INSTAGRAM/BIOGRAFIAS_E_ORGANIZACAO_DO_PERFIL.md',
  '04_FEED_35_POSTS/PLANEJAMENTO_E_CALENDARIO.md',
  '04_FEED_35_POSTS/LEGENDAS_COMPLETAS.md',
  '04_FEED_35_POSTS/REFERENCIAS_CIENTIFICAS.md',
  '04_FEED_35_POSTS/VERIFICACAO_DAS_REFERENCIAS.md',
  '05_ANTES_E_DEPOIS/COMO_USAR.md',
  '06_REELS/ROTEIROS_REELS.md',
  '07_STORIES/ROTEIRO_DOS_STORIES.md',
];
const CSS = `${FONTS}
@page{size:A4;margin:16mm 16mm 18mm 16mm}
body{font-family:Inter;font-weight:300;font-size:10.5pt;line-height:1.6;color:${C.ardosia};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.top{display:flex;justify-content:space-between;align-items:center;border-bottom:.8pt solid ${C.caramelo};padding-bottom:4mm;margin-bottom:7mm}
.top img{height:13mm}.top span{font-size:7.5pt;letter-spacing:.24em;color:${C.caramEsc};font-weight:500}
h1{font-family:Jost;font-weight:300;text-transform:uppercase;letter-spacing:.12em;font-size:19pt;line-height:1.25;margin:0 0 5mm}
h2{font-family:Jost;font-weight:300;text-transform:uppercase;letter-spacing:.1em;font-size:13pt;margin:8mm 0 3mm;color:${C.ardosia};border-left:1.2pt solid ${C.caramelo};padding-left:3mm;break-after:avoid}
h3{font-family:Inter;font-weight:500;font-size:9pt;letter-spacing:.18em;text-transform:uppercase;color:${C.caramEsc};margin:6mm 0 2mm;break-after:avoid}
strong{font-weight:500}a{color:${C.caramEsc}}
table{width:100%;border-collapse:collapse;font-size:8.8pt;margin:3mm 0}
th{text-align:left;font-weight:500;font-size:7.6pt;letter-spacing:.12em;text-transform:uppercase;color:${C.caramEsc};border-bottom:.8pt solid ${C.caramelo};padding:2mm}
td{border-bottom:.5pt solid #E3D9CB;padding:2mm;vertical-align:top}tr{break-inside:avoid}
pre{white-space:pre-wrap;background:${C.off};border:.5pt solid #E6DCCD;padding:4mm 5mm;font-family:Inter;font-size:9.6pt;line-height:1.5;break-inside:auto}
code{font-family:Inter;background:${C.off};padding:0 1.5mm;font-size:9pt}pre code{background:none;padding:0}
blockquote{margin:4mm 0;padding:3mm 5mm;background:#F7EEE4;border-left:1pt solid ${C.caramEsc}}
ul,ol{padding-left:6mm}li{margin:1mm 0}hr{border:none;border-top:.5pt solid #E3D9CB}`;

(async () => {
  const b = await browser();
  for (const rel of DOCS) {
    const md = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="top"><img src="${fileUrl(path.join(ROOT, "02_SITE/site/assets/img/logo-horizontal-1260.png"))}"><span>CRO-BA 32044</span></div>${marked.parse(md)}</body></html>`;
    const f = path.join(TMP, 'doc.html'); fs.writeFileSync(f, html);
    const page = await b.newPage(); await page.goto(fileUrl(f)); await page.evaluate(() => document.fonts.ready);
    const out = path.join(ROOT, rel.replace(/\.md$/, '.pdf'));
    await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<div></div>',
      footerTemplate: '<div style="width:100%;font-family:Helvetica,Arial;font-size:6.5pt;letter-spacing:1.4px;color:#A07A55;padding:0 16mm;display:flex;justify-content:space-between"><span>DRA. TATIANE AISLAN</span><span class="pageNumber"></span></div>' });
    await page.close(); console.log('pdf', rel);
  }
  await close();
})();
