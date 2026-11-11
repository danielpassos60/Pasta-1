// Gera favicon PNG, apple-touch-icon e imagem de compartilhamento (og-image) do site
const path=require('path');const {render,close,htmlDoc,sym,C,LOGO,FOTO,ROOT}=require('./base');
const O=(f)=>path.join(ROOT,'02_SITE','site','assets','img',f);
(async()=>{
  const ic=(s)=>htmlDoc(`<div style="width:${s}px;height:${s}px;background:${C.ardosia};display:flex;align-items:center;justify-content:center">${sym(C.caramelo,Math.round(s*.68),Math.max(1.5,s*.045))}</div>`,'',s,s);
  await render(ic(32),O('favicon-32.png'),{w:32,h:32});
  await render(ic(180),O('apple-touch-icon.png'),{w:180,h:180});
  await render(htmlDoc(`<div style="width:1200px;height:630px;display:flex;background:${C.off}"><div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:70px"><img src="${LOGO.horizClaro}" style="width:560px"><div style="margin-top:40px;font-family:Jost;font-weight:300;font-size:30px;letter-spacing:.04em;color:${C.ardosia}">Técnica, cuidado e escuta.</div><div style="margin-top:18px;font-family:Inter;font-weight:500;font-size:16px;letter-spacing:.26em;color:${C.caramEsc}">CRO-BA 32044</div></div><img src="${FOTO('mesa')}" style="width:430px;height:630px;object-fit:cover;object-position:50% 30%"></div>`,'',1200,630),O('og-image.jpg'),{w:1200,h:630});
  await close();
})();
