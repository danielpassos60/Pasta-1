// Simulação do perfil do Instagram usando as artes efetivamente criadas.
const fs = require('fs');
const path = require('path');
const { render, close, htmlDoc, fileUrl, ROOT, FOTO, C } = require('./base');
const { POSTS, BIOS, BIO_RECOMENDADA, NOME_PERFIL, DESTAQUES } = require('./conteudo');
const { pastaPost, slug } = require('./gerar_artes');

// Usuário ILUSTRATIVO (substituir pelo @ oficial quando confirmado). Link = site publicado.
const USUARIO = 'dra.tatianeaislan';
const LINK = 'dratatianeaislan.netlify.app';

const capa = (p) => {
  const d = pastaPost(p);
  const f = fs.readdirSync(d).find((x) => /pagina1\.png$|post\d\d\.png$/.test(x));
  return fileUrl(path.join(d, f));
};
const hl = (i, d) => fileUrl(path.join(ROOT, '03_INSTAGRAM', 'CAPAS_DESTAQUES', `destaque${i + 1}_${slug(d.nome).toLowerCase()}.png`));

function perfil(n) {
  const posts = POSTS.slice(0, n).reverse(); // o mais recente aparece primeiro
  const bio = BIOS[BIO_RECOMENDADA].texto.split('\n').map((l) => `<div>${l}</div>`).join('');
  const W = 430;
  const rows = Math.ceil(posts.length / 3);
  const cellW = (W - 2) / 3, cellH = cellW * 4 / 3;
  const H = 548 + rows * (cellH + 1);
  const body = `<div style="width:${W}px;min-height:${H}px;background:#fff;font-family:-apple-system,'Inter',sans-serif;color:#000;font-weight:400">
   <div style="height:44px;display:flex;justify-content:space-between;align-items:center;padding:0 22px;font-size:15px;font-weight:600"><span>9:41</span><span style="letter-spacing:2px">▮▮▮ ◔ ▭</span></div>
   <div style="height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 16px"><span style="font-size:20px">‹</span><span style="font-weight:700;font-size:17px">${USUARIO}</span><span style="font-size:20px;letter-spacing:2px">···</span></div>
   <div style="display:flex;align-items:center;padding:10px 16px 0">
     <div style="width:88px;height:88px;border-radius:50%;padding:3px;background:linear-gradient(45deg,#C79E74,#A07A55)"><div style="width:100%;height:100%;border-radius:50%;border:3px solid #fff;overflow:hidden"><img src="${FOTO('mesa')}" style="width:100%;height:100%;object-fit:cover;object-position:52% 26%;transform:scale(1.9);transform-origin:52% 32%"></div></div>
     <div style="flex:1;display:flex;justify-content:space-around;text-align:center;font-size:13px"><div><b style="font-size:17px;display:block">${n}</b>publicações</div><div><b style="font-size:17px;display:block">—</b>seguidores</div><div><b style="font-size:17px;display:block">—</b>seguindo</div></div>
   </div>
   <div style="padding:10px 16px 0;font-size:13.5px;line-height:1.38">
     <div style="font-weight:600">${NOME_PERFIL}</div>
     <div style="color:#737373">Dentista</div>
     ${bio}
     <div style="color:#00376b;font-weight:600;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">🔗 ${LINK}</div>
   </div>
   <div style="display:flex;gap:6px;padding:12px 16px 0">${['Seguir', 'Mensagem', 'Contato'].map((t, i) => `<div style="flex:1;text-align:center;padding:7px 0;border-radius:8px;font-weight:600;font-size:13.5px;background:${i === 0 ? '#0095f6' : '#efefef'};color:${i === 0 ? '#fff' : '#000'}">${t}</div>`).join('')}</div>
   <div style="display:flex;gap:14px;padding:16px 16px 6px;overflow:hidden">${DESTAQUES.map((d, i) => `<div style="flex:none;width:66px;text-align:center;font-size:11.5px"><div style="width:66px;height:66px;border-radius:50%;border:1px solid #dbdbdb;padding:3px"><img src="${hl(i, d)}" style="width:100%;height:100%;border-radius:50%"></div><div style="margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.nome}</div></div>`).join('')}</div>
   <div style="display:flex;border-top:1px solid #dbdbdb;margin-top:10px"><div style="flex:1;text-align:center;padding:10px 0;border-bottom:1.5px solid #000;font-size:18px">▦</div><div style="flex:1;text-align:center;padding:10px 0;font-size:18px;color:#8e8e8e">▷</div><div style="flex:1;text-align:center;padding:10px 0;font-size:18px;color:#8e8e8e">◫</div></div>
   <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px">${posts.map((p) => `<div style="height:${cellH}px;overflow:hidden;position:relative"><img src="${capa(p)}" style="width:100%;height:100%;object-fit:cover">${p.pages.length > 1 ? '<span style="position:absolute;top:6px;right:7px;color:#fff;font-size:13px;text-shadow:0 0 3px rgba(0,0,0,.5)">❐</span>' : ''}</div>`).join('')}</div>
  </div>`;
  return { html: htmlDoc(body, '', W, Math.ceil(H), '#fff'), W, H: Math.ceil(H) };
}

(async () => {
  const out = path.join(ROOT, '03_INSTAGRAM', 'SIMULACAO_PERFIL');
  for (const n of [12, 35]) {
    const { html, W, H } = perfil(n);
    await render(html, path.join(out, n === 12 ? 'simulacao_perfil_primeiras_12_publicacoes.png' : 'simulacao_perfil_feed_completo_35_publicacoes.png'), { w: W, h: H, scale: 3 });
  }
  await close();
  console.log('simulacao ok');
})();
