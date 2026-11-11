// Gera o Manual de Identidade Digital e Posicionamento Odontológico (PDF A4)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, DIR, C, sym, LOGO, FONTS, fileUrl, browser, close, esc, pad, render, TMP } = require('./base');
const { PERFIL, REFS, POSTS, BIOS, BIO_RECOMENDADA, NOME_PERFIL, DESTAQUES, STORIES } = require('./conteudo');
const { REELS } = require('./reels');
const { pastaPost, slug } = require('./gerar_artes');

const OUT = path.join(ROOT, '08_MANUAL_PDF', 'Manual_Identidade_Digital_Dra_Tatiane_Aislan.pdf');
const TH = path.join(DIR, 'previas', 'thumbs');
fs.mkdirSync(TH, { recursive: true });
const U = (p) => fileUrl(p);
const DIAS = ['segunda', 'quarta', 'sexta'];
const quando = (n) => `Semana ${Math.ceil(n / 3)} · ${DIAS[(n - 1) % 3]}-feira`;

// ---------- miniaturas JPEG (PDF mais leve)
function thumbs() {
  const py = `
import sys,os,glob
from PIL import Image
root,th=sys.argv[1],sys.argv[2]
def t(src,dst,w):
    if os.path.exists(dst) and os.path.getmtime(dst)>os.path.getmtime(src): return
    im=Image.open(src).convert('RGB'); im.thumbnail((w,w*3)); im.save(dst,quality=84,optimize=True)
for f in glob.glob(os.path.join(root,'04_FEED_35_POSTS','*','*.png')): t(f,os.path.join(th,os.path.basename(f)[:-4]+'.jpg'),640)
for f in glob.glob(os.path.join(root,'07_STORIES','*.png')): t(f,os.path.join(th,os.path.basename(f)[:-4]+'.jpg'),540)
for f in glob.glob(os.path.join(root,'03_INSTAGRAM','SIMULACAO_PERFIL','*.png')): t(f,os.path.join(th,os.path.basename(f)[:-4]+'.jpg'),900)
for f in glob.glob(os.path.join(root,'03_INSTAGRAM','CAPAS_DESTAQUES','*.png')): t(f,os.path.join(th,os.path.basename(f)[:-4]+'.jpg'),300)
for f in glob.glob(os.path.join(root,'06_REELS','CAPAS','*.png')): t(f,os.path.join(th,os.path.basename(f)[:-4]+'.jpg'),500)
`;
  execFileSync('python3', ['-I', '-c', py, ROOT, TH]);
}
const thumbPost = (p, i) => U(path.join(TH, p.pages.length > 1 ? `post${pad(p.n)}_pagina${i}.jpg` : `post${pad(p.n)}.jpg`));

// ---------- capturas do site
async function capturasSite() {
  const b = await browser();
  const site = U(path.join(ROOT, '02_SITE', 'site', 'index.html'));
  const d = await b.newPage({ viewport: { width: 1366, height: 820 } });
  await d.goto(site); await d.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('on'))); await d.waitForTimeout(300);
  await d.screenshot({ path: path.join(TH, 'site_desktop.jpg'), type: 'jpeg', quality: 85 }); await d.close();
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await m.goto(site); await m.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('on'))); await m.waitForTimeout(300);
  await m.screenshot({ path: path.join(TH, 'site_mobile.jpg'), type: 'jpeg', quality: 85 });
  await m.evaluate(() => window.scrollTo(0, document.querySelector('#procedimentos').offsetTop)); await m.waitForTimeout(200);
  await m.screenshot({ path: path.join(TH, 'site_mobile2.jpg'), type: 'jpeg', quality: 85 }); await m.close();
}

// ---------- CSS do manual
const CSS = `${FONTS}
@page{size:A4;margin:16mm 17mm 20mm 17mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter;font-weight:300;font-size:9.6pt;line-height:1.55;color:${C.ardosia};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sec{break-before:page}
.mk{font-size:1pt;color:#fff;line-height:1;height:1pt;overflow:hidden}
.secnum{font-family:Jost;font-weight:200;font-size:44pt;color:${C.caramelo};line-height:1}
h1{font-family:Jost;font-weight:300;text-transform:uppercase;letter-spacing:.14em;font-size:20pt;line-height:1.2;margin:6mm 0 3mm}
.lead{font-size:11pt;color:#55606b;max-width:150mm;margin-bottom:8mm}
.rule{width:18mm;height:.8pt;background:${C.caramelo};margin:4mm 0 7mm}
h2{font-family:Jost;font-weight:300;text-transform:uppercase;letter-spacing:.13em;font-size:12.5pt;margin:7mm 0 3mm}
h3{font-family:Inter;font-weight:500;font-size:8pt;letter-spacing:.24em;text-transform:uppercase;color:${C.caramEsc};margin:5mm 0 2mm}
p+p{margin-top:2.4mm}
ul,ol{margin:2mm 0 2mm 5mm}li{margin:1.2mm 0}
b,strong{font-weight:500}
.box{background:${C.off};border-left:1pt solid ${C.caramelo};padding:4mm 5mm;margin:4mm 0}
.warn{background:#F7EEE4;border-left:1pt solid ${C.caramEsc};padding:4mm 5mm;margin:4mm 0}
h2{break-after:avoid}h3{break-after:avoid}tr{break-inside:avoid}table{width:100%;border-collapse:collapse;font-size:8.6pt;margin:3mm 0}
th{text-align:left;font-weight:500;font-size:7.4pt;letter-spacing:.16em;text-transform:uppercase;color:${C.caramEsc};border-bottom:.8pt solid ${C.caramelo};padding:2mm 2mm}
td{border-bottom:.5pt solid #E3D9CB;padding:2mm 2mm;vertical-align:top}
.grid{display:grid;gap:4mm}
.cap{font-size:7.6pt;color:#7a838c;margin-top:1.5mm}
.chip{display:inline-block;border:.6pt solid ${C.caramelo};color:${C.caramEsc};font-weight:500;font-size:7pt;letter-spacing:.18em;text-transform:uppercase;padding:1mm 2.6mm;margin:0 1.5mm 1.5mm 0}
pre,.leg{white-space:pre-wrap;font-family:Inter;font-weight:300;font-size:8.3pt;line-height:1.42;background:${C.off};padding:3mm 4.5mm;border:.5pt solid #E6DCCD}
.post h3{margin:3mm 0 1.4mm}.compact .arts{grid-template-columns:repeat(4,28mm)}.compact .leg{font-size:7.9pt;line-height:1.36}.compact .small{font-size:7.3pt}.compact h3{margin:2.2mm 0 1mm}.post .small{font-size:7.7pt;line-height:1.45}
.tag{color:${C.caramEsc};font-weight:400}
.toc a{text-decoration:none;color:inherit}
.toc .row{display:flex;align-items:baseline;gap:3mm;padding:2.1mm 0;border-bottom:.5pt solid #E6DCCD}
.toc .n{font-family:Jost;font-weight:300;color:${C.caramelo};width:10mm}
.toc .t{flex:1;font-family:Jost;font-weight:300;text-transform:uppercase;letter-spacing:.12em;font-size:9.6pt}
.toc .pg{font-weight:400;color:${C.caramEsc}}
.pubhead{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:.8pt solid ${C.caramelo};padding-bottom:2.5mm;margin-bottom:4mm}
.pubhead .big{font-family:Jost;font-weight:300;font-size:17pt;letter-spacing:.16em}
.pubhead .big b{font-weight:300;color:${C.caramelo}}
.arts{display:grid;grid-template-columns:repeat(4,34mm);gap:2.4mm;margin:2mm 0 2mm}
.arts img{width:100%;border:.4pt solid #E3D9CB}
.arts.single{grid-template-columns:40mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.small{font-size:8.2pt;color:#5d6770}
img{max-width:100%}
.nobreak{break-inside:avoid}
`;

const secoes = [];
function sec(id, titulo, lead, html) { secoes.push({ id, titulo }); return `<section class="sec"><div class="mk">⟦${id}⟧</div><div class="secnum">${id}</div><h1>${titulo}</h1>${lead ? `<div class="lead">${lead}</div>` : ''}<div class="rule"></div>${html}</section>`; }
const refLine = (k) => `${esc(REFS[k].c)} <span class="tag">${esc(REFS[k].l)}</span>`;

function corpo(tocPages = {}) {
  secoes.length = 0;
  let h = '';
  // ---------------- COMO UTILIZAR
  h += sec('00', 'Como utilizar este material', 'Guia rápido para a rotina de postagens. Leia esta seção primeiro: ela resume tudo o que você precisa para publicar com autonomia.', `
  <h2>1. A ordem das publicações</h2>
  <p>As 35 publicações estão numeradas de <b>01 a 35</b>, e essa é exatamente a ordem de postagem. <b>Comece pela Publicação 01</b> (apresentação), depois a <b>02</b>, a <b>03</b>, e assim por diante. Não pule números: a sequência intercala os temas e alterna capas escuras e claras, formando um feed equilibrado.</p>
  <div class="box"><b>Ritmo sugerido:</b> 3 publicações por semana (segunda, quarta e sexta). As 35 publicações cobrem cerca de 12 semanas. Se precisar pausar, retome do número em que parou.</div>
  <h2>2. Onde está cada arquivo</h2>
  <p>No computador ou no celular, abra a pasta <b>04_FEED_35_POSTS</b>. Cada publicação tem uma pasta própria, por exemplo <b>PUBLICACAO_01_…</b>, com as imagens (<i>post01_pagina1.png</i>, <i>post01_pagina2.png</i>…) e a legenda pronta (<i>LEGENDA_post01.txt</i>). Neste manual, cada publicação também aparece completa: arte, legenda, hashtags e referência na mesma página.</p>
  <h2>3. Como publicar um carrossel</h2>
  <ol><li>No Instagram, toque em <b>+</b> e depois em <b>Publicação</b>.</li><li>Toque no ícone de <b>seleção múltipla</b> (dois quadrados sobrepostos).</li><li>Selecione as imagens <b>na ordem</b>: página 1, página 2, página 3 e página 4. O número que aparece em cada foto indica a ordem.</li><li>Toque em <b>Avançar</b>. Não aplique filtros: as cores já estão ajustadas à marca.</li><li>Cole a legenda (passo 4) e toque em <b>Compartilhar</b>.</li></ol>
  <h2>4. Como copiar e usar a legenda</h2>
  <ol><li>Abra o arquivo <i>LEGENDA_postXX.txt</i> da pasta da publicação (ou o documento <i>LEGENDAS_COMPLETAS.md</i>).</li><li>Copie o texto que está entre as linhas “LEGENDA” e a linha de iguais (======). Ele já inclui a chamada para ação, a assinatura com o CRO e as hashtags.</li><li>Cole no campo “Escreva uma legenda” do Instagram.</li></ol>
  <p class="small">Dica: envie as pastas para o Google Drive ou para o seu próprio WhatsApp. Assim você abre as imagens e copia a legenda direto do celular.</p>
  <h2>5. Como usar as hashtags</h2>
  <p>Cada legenda já termina com <b>5 a 8 hashtags</b> escolhidas para o tema. Não é preciso acrescentar outras: poucas hashtags relevantes funcionam melhor do que listas longas. Mantenha-as no final da legenda.</p>
  <h2>6. Como usar os stories</h2>
  <p>As 10 artes estão na pasta <b>07_STORIES</b>. Publique 2 a 3 por semana. Algumas têm um espaço livre para a figurinha interativa (enquete, perguntas, quiz ou link): veja na seção 16 qual figurinha usar em cada uma. Depois de publicar, salve o story no destaque correspondente.</p>
  <h2>7. Como publicar os Reels</h2>
  <p>Grave com o celular na vertical, seguindo os roteiros da seção 15. No Instagram: <b>+ → Reel</b>, selecione o vídeo, adicione os textos na tela indicados no roteiro e cole a legenda pronta. Escolha uma capa limpa (um quadro em que você esteja olhando para a câmera).</p>
  <h2>8. Como usar os elementos de antes e depois</h2>
  <p>Os arquivos da pasta <b>05_ANTES_E_DEPOIS</b> são molduras transparentes. Coloque as fotos clínicas por baixo (no Canva, por exemplo) e o PNG por cima. <b>Somente com autorização escrita do paciente</b> (seção 14).</p>
  <div class="warn"><b>Antes de cada postagem, confira:</b> a imagem certa (número da publicação) · as páginas na ordem · a legenda completa colada · a ausência de dados ou imagens de pacientes sem autorização.</div>`);

  // ---------------- 01 apresentação
  h += sec('01', 'Apresentação do projeto', 'Posicionamento digital da Dra. Tatiane Aislan, cirurgiã-dentista (CRO-BA 32044).', `
  <p>Este manual reúne o projeto de identidade digital desenvolvido para a <b>Dra. Tatiane Aislan</b>, cirurgiã-dentista formada pela UNIME (União Metropolitana de Educação e Cultura), com atuação em <b>cirurgias odontológicas, extrações, restaurações e implantes dentários</b>.</p>
  <p>O objetivo é transmitir, antes mesmo do primeiro contato, aquilo que define o atendimento da Dra.: <b>técnica, cuidado e escuta</b>. Toda a comunicação foi pensada para ser sofisticada, acolhedora e baseada em ciência, com destaque para a <b>reabilitação oral</b>, entendida como devolver saúde, função e estética ao sorriso.</p>
  <h2>O que foi entregue</h2>
  <table><tr><th>Entrega</th><th>Onde encontrar</th></tr>
  <tr><td>Logomarca em SVG, PDF e PNG (7 versões), paleta e tipografia</td><td>01_IDENTIDADE_VISUAL</td></tr>
  <tr><td>Site profissional responsivo, com botão de WhatsApp</td><td>02_SITE</td></tr>
  <tr><td>6 biografias, 7 capas de destaques, simulação do perfil</td><td>03_INSTAGRAM</td></tr>
  <tr><td>35 publicações (119 artes) com legendas e referências</td><td>04_FEED_35_POSTS</td></tr>
  <tr><td>4 elementos de antes e depois (PNG transparente) + 1 extra</td><td>05_ANTES_E_DEPOIS</td></tr>
  <tr><td>3 roteiros de Reels</td><td>06_REELS</td></tr>
  <tr><td>10 stories</td><td>07_STORIES</td></tr>
  <tr><td>Este manual</td><td>08_MANUAL_PDF</td></tr></table>
  <h2>Princípios do conteúdo</h2>
  <ul><li><b>Verdade:</b> nenhum título, especialidade, resultado ou dado foi inventado. A Dra. não é apresentada como especialista.</li><li><b>Ciência:</b> cada conteúdo clínico tem referência real e verificável (DOI ou link).</li><li><b>Ética:</b> respeito ao Código de Ética Odontológica e às normas de publicidade do CFO.</li><li><b>Consistência:</b> a mesma identidade em todas as peças.</li></ul>`);

  // ---------------- 02 identidade
  h += sec('02', 'Identidade visual e paleta de cores', 'Um dente desenhado a partir das iniciais: o T na coroa e as raízes formando o A.', `
  <div class="two"><div>
  <p>O símbolo é um <b>molar em linha fina</b>, de espessura única. A barra horizontal da coroa e o eixo vertical formam a letra <b>T</b>, e as duas raízes se encontram no alto, formando a letra <b>A</b> sem barra (Λ). O resultado é um dente que também é o monograma <b>TA</b>.</p>
  <p>A linha fina e contínua traduz delicadeza, precisão e cuidado. A <b>ardósia</b> transmite seriedade e confiança, o <b>caramelo</b> traz acolhimento e a <b>areia</b> deixa tudo leve e limpo.</p></div>
  <div style="background:${C.areia};display:flex;align-items:center;justify-content:center;padding:8mm">${sym(C.ardosia, 160, 2.2)}</div></div>
  <img src="${U(path.join(ROOT, '01_IDENTIDADE_VISUAL', 'PALETA_E_TIPOGRAFIA', 'paleta_e_tipografia.png'))}" style="width:100%;margin-top:6mm;border:.5pt solid #E3D9CB">
  <table><tr><th>Cor</th><th>HEX</th><th>RGB</th><th>Uso</th></tr>
  <tr><td>Ardósia</td><td>#2F3A45</td><td>47, 58, 69</td><td>Cor principal, fundos e textos (≈ 60%)</td></tr>
  <tr><td>Areia</td><td>#E9E0D3</td><td>233, 224, 211</td><td>Fundos claros e respiro (≈ 30%)</td></tr>
  <tr><td>Caramelo</td><td>#C79E74</td><td>199, 158, 116</td><td>Destaques, símbolo, detalhes (≈ 10%)</td></tr>
  <tr><td>Caramelo escuro</td><td>#A07A55</td><td>160, 122, 85</td><td>Textos pequenos em caramelo sobre fundo claro</td></tr>
  <tr><td>Off-white</td><td>#F4EEE6</td><td>244, 238, 230</td><td>Fundos de posts e papelaria</td></tr></table>
  <h2>Tipografia</h2>
  <p><b>Nome no logo:</b> lettering desenhado letra por letra (geométrico, fino, A sem barra). Não é uma fonte instalável: use sempre os arquivos da logo. <b>Títulos:</b> Jost Light, caixa-alta, espaçamento amplo. <b>Textos:</b> Inter Light (corrido) e Inter Medium (chamadas). Ambas são gratuitas (Google Fonts).</p>`);

  // ---------------- 03 aplicações
  const lp = (f, bg) => `<div style="background:${bg};padding:5mm;display:flex;align-items:center;justify-content:center;height:34mm"><img src="${U(path.join(DIR, 'previas', 'logos', f))}" style="max-height:26mm;max-width:100%"></div>`;
  h += sec('03', 'Aplicações da logomarca', 'Versões oficiais. Todos os arquivos estão em 01_IDENTIDADE_VISUAL, em SVG e PDF vetoriais e PNG em alta resolução.', `
  <div class="grid" style="grid-template-columns:1fr 1fr">
   <div>${lp('TA_logo_horizontal_principal_colorido_PARA_FUNDO_CLARO.png', C.off)}<div class="cap">1 · Horizontal principal · fundo claro</div></div>
   <div>${lp('TA_logo_horizontal_principal_colorido_PARA_FUNDO_ESCURO.png', C.ardosia)}<div class="cap">7 · Horizontal · fundo escuro</div></div>
   <div>${lp('TA_logo_vertical_colorido_PARA_FUNDO_CLARO.png', C.areia)}<div class="cap">2 · Vertical · fundo claro</div></div>
   <div>${lp('TA_logo_vertical_colorido_PARA_FUNDO_ESCURO.png', C.ardosia)}<div class="cap">2 · Vertical · fundo escuro</div></div>
   <div>${lp('TA_logo_horizontal_principal_monocromatico_ardosia.png', '#fff')}<div class="cap">4 · Monocromática ardósia</div></div>
   <div>${lp('TA_logo_horizontal_principal_NEGATIVO_branco.png', C.ardosia)}<div class="cap">5 · Negativa (branca)</div></div>
  </div>
  <div class="grid" style="grid-template-columns:repeat(4,1fr);margin-top:4mm">
   ${[['caramelo', C.ardosia], ['ardosia', C.areia], ['caramelo-escuro', C.off], ['monocromatico_preto', '#fff']].map(([k, bg]) => `<div>${lp(`TA_simbolo_isolado_${k}.png`, bg)}<div class="cap">3 · Símbolo ${k.replace('monocromatico_', '').replace('-', ' ')}</div></div>`).join('')}
  </div>
  <div class="nobreak"><h2>Qual arquivo usar</h2>
  <table><tr><th>Aplicação</th><th>Arquivo</th></tr>
  <tr><td>Fachada e placa profissional</td><td>PDF ou SVG vetorial (envie à gráfica; nunca use PNG ampliado)</td></tr>
  <tr><td>Cartões e materiais impressos</td><td>PDF vetorial</td></tr>
  <tr><td>Jaleco (bordado)</td><td>SVG do símbolo ou do logo vertical, em uma cor. Mínimo de 8 mm de altura para o símbolo.</td></tr>
  <tr><td>Documentos, receituários</td><td>PNG ou PDF horizontal para fundo claro</td></tr>
  <tr><td>Redes sociais, favicon</td><td>PNG do símbolo isolado</td></tr></table></div>`);

  // ---------------- 04 orientações
  h += sec('04', 'Orientações de utilização da identidade', 'Regras simples para que a marca seja reconhecida em qualquer peça.', `
  <div class="two"><div><h3>Faça</h3><ul>
  <li>Use os arquivos originais da logo (nunca redigite o nome).</li><li>Respeite a área de proteção: espaço livre de 1/4 da altura do símbolo ao redor.</li><li>Use fundos ardósia, areia ou off-white.</li><li>Prefira muito espaço vazio e poucos elementos por peça.</li><li>Use fios finos em caramelo como divisores.</li><li>Fotos com luz natural e tons quentes e neutros.</li><li>Inclua sempre o nome e o CRO-BA 32044 nas peças de divulgação.</li></ul></div>
  <div><h3>Evite</h3><ul>
  <li>Distorcer, girar ou inclinar a logo.</li><li>Trocar as cores ou aplicar sombras, brilho, degradê ou metalizado.</li><li>Usar a logo sobre fundo sem contraste (ex.: caramelo sobre caramelo).</li><li>Fontes manuscritas, muitas cores ou excesso de informação.</li><li>Dentes ilustrados de forma infantil.</li><li>Fotos de banco muito saturadas.</li><li>Termos como “especialista” ou “o melhor”.</li></ul></div></div>
  <h2>Tamanhos mínimos</h2>
  <table><tr><th>Versão</th><th>Impresso</th><th>Digital</th></tr><tr><td>Horizontal</td><td>35 mm</td><td>160 px</td></tr><tr><td>Vertical</td><td>22 mm</td><td>100 px</td></tr><tr><td>Símbolo</td><td>8 mm</td><td>32 px</td></tr></table>`);

  // ---------------- 05 site
  h += sec('05', 'Site e instruções de acesso', 'Página única, elegante e rápida, pensada para ser o link da bio do Instagram e do TikTok.', `
  <div class="grid" style="grid-template-columns:2.3fr 1fr 1fr;align-items:start">
   <div><img src="${U(path.join(TH, 'site_desktop.jpg'))}" style="border:.5pt solid #ddd"><div class="cap">Versão para computador</div></div>
   <div><img src="${U(path.join(TH, 'site_mobile.jpg'))}" style="border:.5pt solid #ddd"><div class="cap">Celular: início</div></div>
   <div><img src="${U(path.join(TH, 'site_mobile2.jpg'))}" style="border:.5pt solid #ddd"><div class="cap">Celular: procedimentos</div></div></div>
  <h2>Estrutura</h2>
  <p>Início (logo, frase institucional, foto e botão de WhatsApp) · Saúde, Função e Estética · Sobre a profissional · Procedimentos (reabilitação oral, implantes, cirurgias, extrações e siso, restaurações, avaliação) · Primeira consulta · Agendamento · Rodapé com nome, CRO, WhatsApp e Instagram.</p>
  <p><b>WhatsApp configurado:</b> ${PERFIL.whatsapp}, com a mensagem automática “Olá, Dra. Tatiane! Encontrei seu site e gostaria de informações sobre uma consulta.”</p>
  <h2>Endereço do site</h2>
  <div class="warn"><b>Status:</b> o site está pronto, mas <b>ainda não está publicado</b>. A publicação precisa ser feita na conta da Dra., em cerca de 5 minutos, pela Netlify (gratuita). O passo a passo completo está em <i>02_SITE/COMO_PUBLICAR.md</i>.</div>
  <table><tr><th>Endereço sugerido</th><th>Verificação de disponibilidade (11/11/2026)</th></tr>
  <tr><td>dratatianeaislan.netlify.app <b>(recomendado)</b></td><td>Não foi possível testar daqui. A Netlify confirma na hora de renomear o site.</td></tr>
  <tr><td>dratatianeaislan.github.io</td><td>O usuário “dratatianeaislan” não existe no GitHub, o que indica que está livre.</td></tr>
  <tr><td>Alternativas curtas</td><td>tatianeaislan · dratatiane · tatianeaislan-odonto</td></tr></table>
  <h3>Publicar na Netlify</h3>
  <ol><li>Acesse <b>app.netlify.com/drop</b> e crie a conta gratuita.</li><li>Arraste a pasta <b>02_SITE/site</b>.</li><li>Em <b>Site configuration → Change site name</b>, digite <b>dratatianeaislan</b>.</li><li>Copie o endereço e coloque na bio do Instagram.</li></ol>
  <p class="small">Antes de publicar, preencha o @ do Instagram no final do arquivo index.html (variável INSTAGRAM). Enquanto estiver vazio, o botão fica oculto, para não haver link quebrado.</p>`);

  // ---------------- 06 instagram
  h += sec('06', 'Organização do Instagram', 'O perfil deve transmitir confiança antes mesmo do primeiro contato.', `
  <div class="warn"><b>Pendência:</b> o print do perfil atual e o @ oficial não foram recebidos. Por isso, o diagnóstico do perfil existente (nome de usuário, bio, feed e destaques atuais) ainda não foi feito. O checklist abaixo vale para qualquer situação.</div>
  <table><tr><th>Item</th><th>Como deixar</th></tr>
  <tr><td>Tipo de conta</td><td>Profissional · categoria <b>Dentista</b></td></tr>
  <tr><td>Nome (campo pesquisável)</td><td><b>${NOME_PERFIL}</b></td></tr>
  <tr><td>Nome de usuário</td><td>Curto e fácil de ditar. Se for trocar, algo como <i>dra.tatianeaislan</i> (confirme a disponibilidade no app).</td></tr>
  <tr><td>Foto de perfil</td><td>Recorte do rosto da fotografia oficial no consultório. Alternativa: símbolo caramelo sobre ardósia.</td></tr>
  <tr><td>Bio</td><td>Uma das 6 opções da seção 07 (recomendada: opção ${BIO_RECOMENDADA + 1}).</td></tr>
  <tr><td>Link</td><td>Endereço do site (seção 05).</td></tr>
  <tr><td>Botões de contato</td><td>WhatsApp ${PERFIL.whatsapp}</td></tr>
  <tr><td>Destaques</td><td>7 capas (seção 08)</td></tr>
  <tr><td>Publicações antigas</td><td>Arquivar (não excluir) as que fogem do novo posicionamento ou expõem pacientes sem autorização.</td></tr>
  <tr><td>Fixadas no topo</td><td>Publicação 01 e, depois, a 35.</td></tr></table>`);

  // ---------------- 07 bios
  h += sec('07', 'Seis opções de biografia', 'Todas com até 150 caracteres, CRO visível e chamada para agendamento, sem o termo “especialista”.', `
  <div class="grid" style="grid-template-columns:1fr 1fr">${BIOS.map((b, i) => `<div class="nobreak" style="border:.6pt solid ${i === BIO_RECOMENDADA ? C.caramelo : '#E3D9CB'};padding:4mm 5mm;${i === BIO_RECOMENDADA ? `background:${C.off}` : ''}"><h3 style="margin-top:0">Opção ${i + 1} · ${b.titulo}${i === BIO_RECOMENDADA ? ' · Recomendada' : ''}</h3><div style="white-space:pre-line;font-size:10pt;line-height:1.5">${esc(b.texto)}</div><div class="cap">${[...b.texto].length} caracteres</div></div>`).join('')}</div>
  <div class="box"><b>Por que a opção ${BIO_RECOMENDADA + 1}:</b> em quatro linhas, ela diz quem é a Dra., o que faz (com reabilitação oral em primeiro lugar), como é o atendimento e como agendar. Traz o CRO, como pede o CFO, e não usa “especialista”, já que a Dra. não tem título de especialista registrado.</div>`);

  // ---------------- 08 destaques
  h += sec('08', 'Destaques e suas categorias', 'Sete capas na mesma identidade, legíveis no círculo do Instagram.', `
  <div class="grid" style="grid-template-columns:repeat(7,1fr);text-align:center">${DESTAQUES.map((d, i) => `<div><img src="${U(path.join(TH, `destaque${i + 1}_${slug(d.nome).toLowerCase()}.jpg`))}" style="border-radius:50%"><div class="cap" style="color:${C.ardosia};font-size:8pt">${d.nome}</div></div>`).join('')}</div>
  <table style="margin-top:6mm"><tr><th>Destaque</th><th>O que salvar nele</th></tr>${DESTAQUES.map((d) => `<tr><td><b>${d.nome}</b></td><td>${esc(d.conteudo)}</td></tr>`).join('')}</table>
  <p class="small"><b>Como aplicar a capa:</b> abra o destaque → ⋯ → Editar destaque → Editar capa → galeria → escolha a imagem → centralize.</p>`);

  // ---------------- 09 planejamento
  h += sec('09', 'Planejamento das 35 publicações', 'Ordem estratégica: os temas se revezam e as capas alternam ardósia e areia, formando um xadrez equilibrado na grade.', `
  <table><tr><th>Nº</th><th>Quando</th><th>Área</th><th>Tema</th><th>Formato</th></tr>
  ${POSTS.map((p) => `<tr><td><b>${pad(p.n)}</b></td><td>${quando(p.n)}</td><td>${p.area}</td><td>${esc(p.tema)}</td><td>${p.formato.replace(' (fotografia)', ' · foto')}</td></tr>`).join('')}</table>`);

  // ---------------- 10 publicações
  let pubs = '';
  for (const p of POSTS) {
    const imgs = p.pages.map((_, i) => `<img src="${thumbPost(p, i + 1)}">`).join('');
    pubs += `<div class="sec post ${(p.refs.length >= 4 || p.legenda.split('\n').length >= 12) ? 'compact' : ''}"><div class="mk">⟦P${pad(p.n)}⟧</div>
    <div class="pubhead"><div class="big">PUBLICAÇÃO <b>${pad(p.n)}</b></div><div class="small">${quando(p.n)}</div></div>
    <div style="font-family:Jost;font-weight:300;font-size:13pt;text-transform:uppercase;letter-spacing:.1em">${esc(p.tema)}</div>
    <div style="margin:2.5mm 0"><span class="chip">${p.area}</span><span class="chip">${p.formato}</span><span class="chip">Capa ${p.tom === 'escuro' ? 'ardósia' : 'clara'}</span></div>
    <p class="small"><b>Objetivo:</b> ${esc(p.objetivo)}</p>
    <div class="arts ${p.pages.length === 1 ? 'single' : ''}">${imgs}</div>
    <h3>Legenda: copie e cole</h3>
    <div class="leg">${esc(p.legenda)}\n\n${esc(p.cta)}\n\nDra. Tatiane Aislan · Cirurgiã-Dentista · CRO-BA 32044\nConteúdo educativo: não substitui a avaliação individual.\n\n<span class="tag">${p.hashtags.join(' ')}</span></div>
    <div class="two" style="margin-top:3mm"><div><h3>Chamada para ação</h3><p class="small">${esc(p.cta)}</p><h3>Orientação visual</h3><p class="small">${esc(p.visual)}</p></div>
    <div><h3>Orientação de postagem</h3><p class="small">${esc(p.postagem)}</p><h3>Referência</h3><p class="small">${p.refs.length ? p.refs.map(refLine).join('<br>') : esc(p.fonte)}</p></div></div></div>`;
  }
  h += sec('10', 'As 35 publicações: artes, legendas e referências', 'Cada publicação aparece completa na própria página: arte, legenda pronta, hashtags, referência e orientação. Não é preciso procurar nada em outra parte.', `<p>As páginas a seguir seguem a ordem exata de postagem. Os arquivos em alta resolução estão em <b>04_FEED_35_POSTS</b>.</p>
  <div class="arts" style="grid-template-columns:repeat(7,1fr);gap:1.6mm;margin-top:6mm">${POSTS.map((p) => `<img src="${thumbPost(p, 1)}">`).join('')}</div><div class="cap">Capas das 35 publicações, na ordem de postagem.</div>`) + pubs;

  // ---------------- 11 legendas (índice rápido)
  h += sec('11', 'Índice de legendas', 'Primeira linha de cada legenda, para localizar rapidamente. O texto completo está junto de cada arte (seção 10) e no arquivo LEGENDA_postXX.txt de cada pasta.', `
  <table><tr><th>Nº</th><th>Início da legenda</th></tr>${POSTS.map((p) => `<tr><td><b>${pad(p.n)}</b></td><td>${esc(p.legenda.split('\n')[0])}</td></tr>`).join('')}</table>`);

  // ---------------- 12 referências
  const usadas = [...new Set(POSTS.flatMap((p) => p.refs).concat(REELS.flatMap((r) => r.refs)))].sort((a, b) => REFS[a].c.localeCompare(REFS[b].c));
  h += sec('12', 'Referências científicas', 'Publicações reais, verificáveis pelo DOI ou pelo link. Nenhum dado, autor ou estatística foi inventado.', `
  <ol style="font-size:8.4pt">${usadas.map((k) => `<li>${refLine(k)}<span class="small"> · usada em: ${POSTS.filter((p) => p.refs.includes(k)).map((p) => pad(p.n)).concat(REELS.filter((r) => r.refs.includes(k)).map((r) => 'Reels ' + r.n)).join(', ')}</span></li>`).join('')}</ol>
  <h3>Normas éticas consideradas</h3><p class="small">${refLine('cfo118')}<br>${refLine('cfo196')}</p>`);

  // ---------------- 13 orientações publicação
  h += sec('13', 'Orientações para publicação', 'Boas práticas para manter constância, qualidade e ética.', `
  <h2>Rotina semanal sugerida</h2>
  <table><tr><th>Dia</th><th>Feed</th><th>Stories</th></tr><tr><td>Segunda</td><td>Próxima publicação da sequência</td><td>1 story de bastidores</td></tr><tr><td>Terça</td><td>—</td><td>1 story da lista (seção 16)</td></tr><tr><td>Quarta</td><td>Próxima publicação</td><td>Repostar a publicação nos stories</td></tr><tr><td>Quinta</td><td>Reels (a cada 2 semanas)</td><td>Responder a caixinha de perguntas</td></tr><tr><td>Sexta</td><td>Próxima publicação</td><td>Chamada para agendamento</td></tr></table>
  <h2>Antes de publicar</h2><ul><li>Confira o número da publicação e a ordem das páginas.</li><li>Cole a legenda completa (com CRO e hashtags).</li><li>Não aplique filtros.</li><li>Responda os comentários nas primeiras horas.</li></ul>
  <h2>Ética na publicidade odontológica (CFO)</h2><ul>
  <li>Sempre identificar nome e CRO (as artes já trazem).</li><li>Não se apresentar como especialista sem registro de especialidade no CRO.</li><li>Não divulgar preços, promoções ou “condições imperdíveis”, e não prometer resultados.</li><li>Imagens de pacientes, incluindo “antes e depois”, só com autorização por escrito (Resolução CFO-196/2019).</li><li>Selfies e fotos no consultório são permitidas, desde que nenhum paciente seja identificável sem autorização.</li></ul>
  <p class="small">As normas do CFO são atualizadas periodicamente. Em caso de dúvida, consulte o site do CFO ou o CRO-BA.</p>`);

  // ---------------- 14 antes/depois
  const pv = (n, t) => `<div><img src="${U(path.join(DIR, 'previas', `previa_${n}.jpg`))}"><div class="cap">${t}</div></div>`;
  h += sec('14', 'Quatro elementos gráficos de antes e depois', 'PNG com fundo transparente, nos formatos 1080×1350 e 1080×1080. As prévias abaixo usam fundo listrado apenas para mostrar a transparência.', `
  <div class="grid" style="grid-template-columns:repeat(4,1fr)">${pv('01_modelo_universal_antes_depois', '1 · Universal: Antes | Depois')}${pv('02_modelo_sofisticado_resultado_clinico', '2 · Sofisticado: Resultado clínico')}${pv('03_modelo_minimalista_evolucao_do_tratamento', '3 · Minimalista: Evolução do tratamento')}${pv('04_modelo_institucional_assinatura', '4 · Institucional: assinatura')}</div>
  <h2>Como aplicar</h2><ol><li>No Canva (ou outro editor), crie um design de 1080×1350.</li><li>Posicione as fotos clínicas no fundo. No modelo universal, a foto de antes fica à esquerda e a de depois à direita.</li><li>Insira o PNG por cima, ocupando toda a tela.</li><li>Exporte e publique com legenda educativa (sem promessa de resultado).</li></ol>
  <div class="warn"><b>Obrigatório:</b> autorização escrita do paciente para divulgação · fotos reais, sem edição que altere o resultado · nunca usar imagens geradas por IA, de banco ou de outros profissionais como resultado · nunca prometer resultado · preferir fotos sem o rosto do paciente.</div>`);

  // ---------------- 15 reels
  h += sec('15', 'Três roteiros de Reels', 'Linguagem natural e educativa, fácil de gravar com celular.', REELS.map((r) => `<div class="${r.n > 1 ? 'sec' : ''}"><h2>Reels ${r.n} · ${esc(r.titulo)}</h2>
  <div style="display:grid;grid-template-columns:1fr 34mm;gap:6mm;align-items:start"><div><p><span class="chip">${r.duracao}</span></p><p><b>Gancho inicial:</b> ${esc(r.gancho)}</p><p class="small" style="margin-top:3mm">Capa pronta ao lado: <i>06_REELS/CAPAS/capa_reels${pad(r.n)}.png</i>. Ao publicar, toque em “Editar capa” → “Adicionar da galeria”.</p></div><img src="${U(path.join(TH, `capa_reels${pad(r.n)}.jpg`))}" style="border:.4pt solid #ddd"></div>
  <h3>Texto completo da fala</h3><table><tr><th style="width:18mm">Tempo</th><th>Fala</th></tr>${r.fala.map(([t, f]) => `<tr><td>${t}</td><td>${esc(f)}</td></tr>`).join('')}</table>
  <div class="two"><div><h3>Orientação de gravação</h3><p class="small">${esc(r.gravacao)}</p><h3>Sugestão de cenas</h3><ul class="small">${r.cenas.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
  <div><h3>Textos na tela</h3><ul class="small">${r.textosTela.map((c) => `<li>${esc(c)}</li>`).join('')}</ul><h3>CTA final</h3><p class="small">${esc(r.cta)}</p></div></div>
  <h3>Legenda</h3><div class="leg">${esc(r.legenda)}</div><p class="cap">Referências: ${r.refs.map((k) => esc(REFS[k].c)).join(' | ')}</p></div>`).join(''));

  // ---------------- 16 stories
  h += sec('16', 'Dez stories', 'Artes prontas em 07_STORIES (1080×1920). Use as figurinhas indicadas para gerar interação.', `
  <div class="grid" style="grid-template-columns:repeat(5,1fr)">${STORIES.map((s) => `<div><img src="${U(path.join(TH, `story${pad(s.n)}_${slug(s.tema).toLowerCase()}.jpg`))}" style="border:.4pt solid #ddd"><div class="cap">${pad(s.n)} · ${s.tema}</div></div>`).join('')}</div>
  <table style="margin-top:5mm"><tr><th>Nº</th><th>Texto</th><th>Interação</th><th>CTA</th></tr>${STORIES.map((s) => `<tr><td><b>${pad(s.n)}</b></td><td>${esc(s.titulo)}</td><td class="small">${esc(s.interacao)}</td><td class="small">${esc(s.cta)}</td></tr>`).join('')}</table>`);

  // ---------------- 17 simulação
  h += sec('17', 'Simulação do Instagram finalizado', 'Montada com as artes efetivamente criadas. O @ e o link são ilustrativos até a confirmação dos oficiais.', `
  <div class="grid" style="grid-template-columns:1fr 1fr;align-items:start">
   <div><img src="${U(path.join(TH, 'simulacao_perfil_primeiras_12_publicacoes.jpg'))}" style="border:.5pt solid #ddd;max-height:190mm;width:auto;object-fit:contain"><div class="cap">Perfil após as 12 primeiras publicações</div></div>
   <div><p>A alternância entre capas ardósia e areia forma um padrão xadrez que permanece equilibrado a cada nova postagem, porque a grade tem 3 colunas. Fotografias e frases institucionais aparecem a cada 3 ou 4 publicações, trazendo calor humano e respiro.</p>
   <p>A versão com o feed completo (35 publicações) está em <i>03_INSTAGRAM/SIMULACAO_PERFIL</i>.</p>
   <div class="box">Observação: no Instagram, a publicação mais recente aparece sempre no canto superior esquerdo. Por isso a simulação mostra a 12ª publicação no topo.</div></div></div>`);

  // ---------------- 18 manutenção
  h += sec('18', 'Manutenção do perfil', 'Hábitos que mantêm o perfil profissional, coerente e ativo depois das 35 publicações.', `
  <ul><li><b>Constância acima de quantidade:</b> 3 publicações por semana são suficientes.</li><li><b>Responda</b> comentários e mensagens no mesmo dia, sempre com orientação geral (diagnóstico só em consulta).</li><li><b>Reaproveite</b> os temas que tiveram mais salvamentos e compartilhamentos (veja em Insights).</li><li><b>Atualize os destaques</b> a cada mês com novos stories.</li><li><b>Fotos reais:</b> registre bastidores com luz natural e fundo limpo.</li><li><b>Novas artes:</b> use os templates da pasta _FONTES_EDITAVEIS ou reproduza o padrão no Canva: fundo ardósia ou areia, título em Jost Light caixa-alta, texto em Inter Light, fio caramelo, símbolo no topo e nome com CRO no rodapé.</li><li><b>Revisão trimestral:</b> confira bio, link, destaques e publicações fixadas.</li></ul>
  <h2>Pendências para concluir o projeto</h2>
  <table><tr><th>Item</th><th>Responsável</th></tr>
  <tr><td>Enviar o @ oficial e o print do Instagram atual</td><td>Dra. / Daniel</td></tr>
  <tr><td>Publicar o site na Netlify e preencher o @ no index.html</td><td>Daniel</td></tr>
  <tr><td>Confirmar autorizações de imagem (publicação 07 e story 08)</td><td>Dra.</td></tr>
  <tr><td>Revisar a publicação 35 (fluxo da primeira consulta)</td><td>Dra.</td></tr></table>
  <div style="margin-top:20mm;text-align:center"><img src="${LOGO.vertClaro}" style="height:42mm"><p class="small" style="margin-top:6mm">Projeto desenvolvido por <b>Daniel dos Passos Gomes</b> · Identidade Visual | Social Media | Estratégia Digital</p></div>`);

  // sumário
  const toc = `<section><div class="mk">⟦TOC⟧</div><div class="secnum">—</div><h1>Sumário</h1><div class="rule"></div><div class="toc">${secoes.map((s) => `<div class="row"><span class="n">${s.id}</span><span class="t">${esc(s.titulo)}</span><span class="pg">${tocPages[s.id] || ''}</span></div>`).join('')}</div></section>`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${toc}${h}</body></html>`;
}

function capa() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}html,body{width:210mm;height:297mm;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>
  <div style="width:210mm;height:297mm;background:${C.ardosia};position:relative;overflow:hidden;color:${C.areia}">
   <div style="position:absolute;right:-120mm;top:40mm">${sym(C.estEscuro, 760, 3)}</div>
   <div style="position:absolute;left:22mm;top:22mm;font-family:Inter;font-weight:500;font-size:8pt;letter-spacing:.32em;color:${C.caramelo}">PROJETO DIGITAL · 2026</div>
   <div style="position:absolute;left:22mm;right:22mm;top:88mm">
     <img src="${LOGO.horizEscuro}" style="width:150mm">
     <div style="width:22mm;height:.8pt;background:${C.caramelo};margin:16mm 0 9mm"></div>
     <div style="font-family:Jost;font-weight:300;font-size:24pt;line-height:1.25;letter-spacing:.14em;text-transform:uppercase">Dra. Tatiane Aislan</div>
     <div style="font-family:Jost;font-weight:300;font-size:14pt;line-height:1.45;letter-spacing:.06em;margin-top:5mm;color:#DCD2C4">Manual de Identidade Digital<br>e Posicionamento Odontológico</div>
   </div>
   <div style="position:absolute;left:22mm;bottom:24mm;font-family:Inter">
     <div style="font-size:7.5pt;letter-spacing:.3em;color:${C.caramelo};font-weight:500">DESENVOLVIDO POR</div>
     <div style="font-family:Jost;font-weight:300;font-size:13pt;letter-spacing:.12em;margin-top:2.5mm;text-transform:uppercase">Daniel dos Passos Gomes</div>
     <div style="font-size:8.5pt;margin-top:1.5mm;color:#CFC4B5;letter-spacing:.06em">Identidade Visual | Social Media | Estratégia Digital</div>
   </div>
   <div style="position:absolute;right:22mm;bottom:24mm;font-family:Inter;font-size:7.5pt;letter-spacing:.24em;color:${C.caramelo};font-weight:500">CRO-BA 32044</div>
  </div></body></html>`;
}

async function printPdf(html, out, footer) {
  const b = await browser();
  const page = await b.newPage();
  const f = path.join(TMP, 'manual_' + path.basename(out) + '.html');
  fs.writeFileSync(f, html);
  await page.goto(fileUrl(f), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: out, format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: !!footer,
    headerTemplate: '<div></div>',
    footerTemplate: footer ? `<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:6.5pt;letter-spacing:1.6px;color:#A07A55;padding:0 17mm;display:flex;justify-content:space-between"><span>DRA. TATIANE AISLAN · MANUAL DE IDENTIDADE DIGITAL</span><span class="pageNumber"></span></div>` : '<div></div>',
  });
  await page.close();
}

function paginasDasSecoes(pdfPath) {
  const n = +execFileSync('pdfinfo', [pdfPath]).toString().match(/Pages:\s+(\d+)/)[1];
  const map = {};
  for (let i = 1; i <= n; i++) {
    const t = execFileSync('pdftotext', ['-f', String(i), '-l', String(i), '-layout', pdfPath, '-']).toString();
    for (const m of t.matchAll(/⟦(\w+)⟧/g)) if (!map[m[1]]) map[m[1]] = i;
  }
  return { map, n };
}

(async () => {
  thumbs();
  await capturasSite();
  const tmpBody = path.join(TMP, 'corpo.pdf');
  await printPdf(corpo(), tmpBody, true);
  let { map } = paginasDasSecoes(tmpBody);
  await printPdf(corpo(map), tmpBody, true); // 2ª passada com números no sumário
  ({ map } = paginasDasSecoes(tmpBody));
  const tmpCapa = path.join(TMP, 'capa.pdf');
  await printPdf(capa(), tmpCapa, false);
  await close();
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  // capa sem número; numeração do corpo começa em 1 (rótulos de página)
  const py = `
import sys
from pypdf import PdfWriter, PdfReader
from pypdf.constants import PageLabelStyle
w=PdfWriter()
for f in sys.argv[2:4]:
    for p in PdfReader(f).pages: w.add_page(p)
w.set_page_label(0,0,prefix='Capa')
w.set_page_label(1,len(w.pages)-1,style=PageLabelStyle.DECIMAL,start=1)
w.add_metadata({'/Title':'Dra. Tatiane Aislan — Manual de Identidade Digital e Posicionamento Odontológico','/Author':'Daniel dos Passos Gomes'})
for k in ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18']:
    pass
w.compress_identical_objects()
with open(sys.argv[1],'wb') as fh: w.write(fh)
`;
  execFileSync('python3', ['-I', '-c', py, OUT, tmpCapa, tmpBody]);
  const info = execFileSync('pdfinfo', [OUT]).toString();
  console.log(info.match(/Pages:.*/)[0], (fs.statSync(OUT).size / 1048576).toFixed(1) + ' MB');
  console.log('seções:', JSON.stringify(map).slice(0, 400));
})().catch((e) => { console.error(e); process.exit(1); });
