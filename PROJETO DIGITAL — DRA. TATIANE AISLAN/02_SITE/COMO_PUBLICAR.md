# Site — Dra. Tatiane Aislan
Site de página única, responsivo e leve (cerca de 0,6 MB), pronto para ser o link da bio do Instagram e do TikTok.

## Conteúdo da pasta `site/`
- `index.html`: o site completo (HTML e CSS no mesmo arquivo).
- `assets/img`: fotos otimizadas (WebP e JPG), logomarca em SVG, favicon e imagem de compartilhamento.
- `assets/fonts`: fontes Jost e Inter hospedadas no próprio site (mais rapidez e privacidade).

## ✅ Site no ar — endereço provisório
**https://danielpassos60.github.io/Pasta-1/dratatianeaislan/**

Publicado em 11/11/2026 pelo GitHub Pages (gratuito), dentro do repositório `danielpassos60/Pasta-1`, branch `gh-pages`, pasta `dratatianeaislan/`. O site da Nilda, que já estava nessa branch, não foi alterado. Esse endereço já pode ir na bio. Para um endereço curto no nome da Dra., use uma das opções abaixo.

**Para atualizar o site provisório:** substitua o conteúdo da pasta `dratatianeaislan/` na branch `gh-pages` e faça o commit. O GitHub publica de novo em cerca de 1 minuto.

## Antes de publicar (2 ajustes no index.html)
1. **Instagram:** no final do arquivo, preencha `var INSTAGRAM = '';` com o usuário, sem @ (ex.: `'dra.tatianeaislan'`). Enquanto estiver vazio, o botão do Instagram fica oculto para não haver link quebrado.
2. **Endereço final (depois de publicado):** descomente a linha `<link rel="canonical" ...>` no topo e coloque o endereço real.

O WhatsApp já está configurado: **+55 71 99220-6132**, com a mensagem automática “Olá, Dra. Tatiane! Encontrei seu site e gostaria de informações sobre uma consulta.”

## Endereço curto: pesquisa de disponibilidade
Verificação feita em 11/11/2026, a partir do ambiente de produção deste projeto:

| Endereço | Plataforma | Resultado da verificação |
|---|---|---|
| dratatianeaislan.github.io | GitHub Pages | O usuário `dratatianeaislan` **não existe no GitHub** (a página de perfil retornou 404), o que indica que está livre. |
| tatianeaislan.github.io | GitHub Pages | O usuário `tatianeaislan` **também não existe** (404). |
| dratatianeaislan.netlify.app | Netlify | **Não foi possível verificar**: o acesso ao Netlify estava bloqueado no ambiente de produção. A própria Netlify confirma na hora de renomear o site (passo 4 abaixo). |
| dratatianeaislan.vercel.app | Vercel | **Não foi possível verificar** pelo mesmo motivo. A Vercel confirma ao criar o projeto. |

Nenhum endereço foi registrado em nome da Dra. Isso precisa ser feito por ela, ou por você, com a conta dela.

## Opção recomendada: Netlify (gratuita, sem programação)
1. Acesse **app.netlify.com/drop** e crie uma conta gratuita (pode usar o e-mail da Dra.).
2. **Arraste a pasta `site`** inteira para a área indicada. Em segundos, o site fica no ar com um endereço provisório.
3. Vá em **Site configuration → Change site name**.
4. Digite `dratatianeaislan`. Se o nome estiver livre, o endereço passa a ser **https://dratatianeaislan.netlify.app**. Se estiver ocupado, a Netlify avisa. Alternativas curtas, em ordem: `tatianeaislan`, `dratatiane`, `tatianeaislan-odonto`, `dratatianeaislan-odonto`.
5. Para atualizar o site no futuro: **Deploys → arraste a pasta `site` novamente**.

## Alternativa: GitHub Pages (gratuita)
1. Crie a conta **dratatianeaislan** no GitHub (o nome estava livre na verificação).
2. Crie um repositório chamado **dratatianeaislan.github.io** e envie o conteúdo da pasta `site`.
3. Em **Settings → Pages**, selecione a branch `main`. O endereço será **https://dratatianeaislan.github.io**.

## Domínio próprio (opcional, pago)
Para um endereço como **dratatianeaislan.com.br**, registre no **registro.br** (custo anual) e conecte na Netlify em **Domain management → Add a domain**. A disponibilidade aparece na busca do próprio registro.br.

## Depois de publicado
- Coloque o link na bio do Instagram e do TikTok.
- Teste o botão do WhatsApp em um celular.
- Opcional: cadastre o site no Google Search Console para acompanhar as buscas.

## Requisitos atendidos
Responsivo (testado em 1366 px e iPhone 13, sem rolagem horizontal) · fontes e imagens otimizadas (WebP) · SEO básico (title, description, Open Graph, dados estruturados `Dentist`) · acessibilidade (textos alternativos, link “pular para o conteúdo”, foco visível, contraste, respeito a “reduzir movimento”) · botão flutuante de WhatsApp.

## Procedimentos no site
Foram listados apenas os procedimentos confirmados: reabilitação oral (como abordagem de planejamento), implantes, cirurgias, extrações/siso, restaurações e avaliação. Para incluir prótese, periodontia ou outras áreas, basta confirmar a atuação da Dra. e duplicar um bloco `<article class="card">`.
