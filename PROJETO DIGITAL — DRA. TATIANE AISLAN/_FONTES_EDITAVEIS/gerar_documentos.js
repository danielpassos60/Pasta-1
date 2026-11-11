// Gera os documentos de texto (.md) de cada pasta do projeto.
const fs = require('fs');
const path = require('path');
const { ROOT, pad } = require('./base');
const { PERFIL, REFS, POSTS, BIOS, BIO_RECOMENDADA, NOME_PERFIL, DESTAQUES, STORIES } = require('./conteudo');
const { REELS } = require('./reels');
const { pastaPost, slug } = require('./gerar_artes');
const W = (rel, txt) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt.trim() + '\n'); };
const ref = (k) => `${REFS[k].c} Disponível em: ${REFS[k].l}`;
const DIAS = ['segunda', 'quarta', 'sexta'];
const quando = (n) => `Semana ${Math.ceil(n / 3)} · ${DIAS[(n - 1) % 3]}-feira`;

const legendaCompleta = (p) => `${p.legenda}\n\n${p.cta}\n\nDra. Tatiane Aislan · Cirurgiã-Dentista · CRO-BA 32044\nConteúdo educativo: não substitui a avaliação individual.\n\n${p.hashtags.join(' ')}`;

// ---------------------------------------------------------------- 04 feed
W('04_FEED_35_POSTS/LEGENDAS_COMPLETAS.md', `# Legendas completas — 35 publicações
Copie o texto que está dentro de cada bloco cinza. A legenda já inclui a chamada para ação, a assinatura com o CRO e as hashtags.

${POSTS.map((p) => `## PUBLICAÇÃO ${pad(p.n)} — ${p.tema}
**Quando publicar:** ${quando(p.n)} · **Formato:** ${p.formato} · **Pasta:** \`${path.basename(pastaPost(p))}\`

\`\`\`
${legendaCompleta(p)}
\`\`\`
`).join('\n')}`);

W('04_FEED_35_POSTS/PLANEJAMENTO_E_CALENDARIO.md', `# Planejamento das 35 publicações
Ritmo sugerido: **3 publicações por semana (segunda, quarta e sexta)**, totalizando cerca de 12 semanas de conteúdo. A ordem abaixo já intercala os temas: siga a numeração.

| Nº | Quando | Área | Tema | Formato | Tom da capa |
|---|---|---|---|---|---|
${POSTS.map((p) => `| ${pad(p.n)} | ${quando(p.n)} | ${p.area} | ${p.tema} | ${p.formato} | ${p.tom === 'escuro' ? 'Ardósia' : 'Areia / foto clara'} |`).join('\n')}

## Objetivo estratégico de cada publicação
${POSTS.map((p) => `- **${pad(p.n)} · ${p.tema}:** ${p.objetivo}`).join('\n')}

## Por que esta ordem?
- As capas alternam fundo **ardósia** e **areia/foto clara**. Como a grade do Instagram tem 3 colunas, essa alternância forma um padrão xadrez equilibrado, que se mantém a cada nova postagem.
- Nunca há dois conteúdos seguidos da mesma área. Reabilitação oral, implantes, cirurgia, restaurações, gengiva e prevenção se revezam.
- Fotografias da Dra. e frases institucionais aparecem a cada 3 a 4 posts, para humanizar o perfil e dar respiro visual.
`);

const refsUsadas = [...new Set(POSTS.flatMap((p) => p.refs).concat(REELS.flatMap((r) => r.refs)))];
W('04_FEED_35_POSTS/REFERENCIAS_CIENTIFICAS.md', `# Referências científicas e institucionais
Todas as referências são publicações reais e podem ser conferidas pelo DOI ou pelo link indicado.

## Por publicação
${POSTS.map((p) => `**${pad(p.n)} · ${p.tema}**\n${p.refs.length ? p.refs.map((r) => `- ${ref(r)}`).join('\n') : `- ${p.fonte}`}`).join('\n\n')}

## Lista consolidada (ordem alfabética)
${refsUsadas.map((k) => REFS[k].c + ' ' + REFS[k].l).sort().map((r) => `- ${r}`).join('\n')}

## Normas éticas consideradas
- ${ref('cfo118')}
- ${ref('cfo196')}
`);

// ---------------------------------------------------------------- 03 instagram
W('03_INSTAGRAM/BIOGRAFIAS_E_ORGANIZACAO_DO_PERFIL.md', `# Instagram — organização do perfil

## Diagnóstico do perfil atual
> **Pendência:** o print do Instagram atual não foi recebido, assim como o @ oficial. Por isso, não foi possível analisar o nome de usuário, a bio atual, o feed e os destaques existentes. Quando o print chegar, essa análise pode ser feita em poucos minutos.

Enquanto isso, este é o checklist de organização (aplique na ordem):
1. **Tipo de conta:** profissional, categoria **Dentista**.
2. **Nome (campo “Nome”):** \`${NOME_PERFIL}\`. Esse campo aparece na busca: incluir “Dentista” ajuda a ser encontrada.
3. **Nome de usuário (@):** curto e fácil de ditar. Se for trocar, prefira algo como \`dra.tatianeaislan\` (verifique a disponibilidade no próprio app).
4. **Foto de perfil:** recorte do rosto da fotografia oficial no consultório (sorrindo, jaleco branco). Alternativa: símbolo da marca em caramelo sobre ardósia (arquivo em \`01_IDENTIDADE_VISUAL/SIMBOLO_ISOLADO\`).
5. **Bio:** escolha uma das 6 opções abaixo.
6. **Link:** endereço do site (ver \`02_SITE/COMO_PUBLICAR.md\`).
7. **Botões de contato:** ative “WhatsApp” com o número ${PERFIL.whatsapp}.
8. **Destaques:** 7 capas prontas em \`CAPAS_DESTAQUES\`.
9. **Publicações antigas:** arquive (não exclua) as que não seguem o novo posicionamento ou que mostrem pacientes sem autorização.
10. **Fixar no topo:** publicação 01 (apresentação) e, depois, a 35 (primeira consulta).

## Seis opções de biografia (limite: 150 caracteres)
${BIOS.map((b, i) => `### Opção ${i + 1} — ${b.titulo}${i === BIO_RECOMENDADA ? ' ⭐ RECOMENDADA' : ''} (${[...b.texto].length} caracteres)\n\`\`\`\n${b.texto}\n\`\`\``).join('\n\n')}

**Por que a opção ${BIO_RECOMENDADA + 1} é a mais estratégica:** em quatro linhas ela responde o que o paciente procura (quem é, o que faz, como é o atendimento e como agendar), traz o CRO, como pede a ética do CFO, e coloca a reabilitação oral em primeiro lugar entre as áreas de atuação, sem usar o termo “especialista”, já que a Dra. não tem título de especialista registrado.

> Atenção (CFO): não use “especialista em…” nem nomes de especialidades como título (ex.: “implantodontista”) sem o registro de especialista no CRO. As bios acima foram escritas respeitando essa regra.

## Destaques (7 capas)
| Capa | Nome do destaque | O que colocar |
|---|---|---|
${DESTAQUES.map((d, i) => `| destaque${i + 1}_${slug(d.nome).toLowerCase()}.png | ${d.nome} | ${d.conteudo} |`).join('\n')}

**Como aplicar a capa:** abra o destaque → ⋯ Editar destaque → Editar capa → ícone de galeria → escolha a imagem → centralize.

## Simulação
Veja \`SIMULACAO_PERFIL/\`: uma versão mostra o perfil após as 12 primeiras publicações e a outra mostra o feed completo, com 35. O @ e o link da simulação são **ilustrativos** até a confirmação dos oficiais.
`);

// ---------------------------------------------------------------- 07 stories
W('07_STORIES/ROTEIRO_DOS_STORIES.md', `# 10 stories para o mês
Sugestão: 2 a 3 stories por semana, intercalados com os bastidores do dia a dia. As artes já deixam espaço livre para as figurinhas interativas.

${STORIES.map((s) => `## Story ${pad(s.n)} — ${s.tema}
- **Arte:** \`story${pad(s.n)}_${slug(s.tema).toLowerCase()}.png\`
- **Texto:** ${s.kicker.toUpperCase()} · ${s.titulo}${s.texto ? ' · ' + s.texto : ''}${s.lista ? ' · ' + s.lista.join(' / ') : ''}
- **Elementos visuais:** ${s.tom === 'foto' ? 'fotografia da Dra. com faixa ardósia e fio caramelo' : (s.tom === 'escuro' ? 'fundo ardósia, símbolo em caramelo e estampa sutil' : 'fundo areia, símbolo em caramelo escuro e estampa sutil')}
- **Interação:** ${s.interacao}
- **CTA:** ${s.cta}
`).join('\n')}
## Como publicar um story com figurinha
1. Abra o Instagram → **+** → **Story** → escolha a arte na galeria.
2. Toque no ícone de figurinhas (quadrado sorridente) → escolha **Enquete**, **Perguntas**, **Quiz** ou **Link**.
3. Digite o texto indicado acima e posicione a figurinha no espaço livre da arte.
4. Depois de publicar, salve nos destaques correspondentes.
`);

// ---------------------------------------------------------------- 06 reels
W('06_REELS/ROTEIROS_REELS.md', `# Três roteiros de Reels
Gravação simples com celular: vertical, tripé, luz natural de frente e fala em tom de conversa. Edite no próprio Instagram ou no CapCut, usando as fontes da marca (Jost e Inter) nos textos da tela, quando possível.

${REELS.map((r) => `## Reels ${r.n} — ${r.titulo}
**Duração estimada:** ${r.duracao} · **Capa pronta:** \`CAPAS/capa_reels${pad(r.n)}.png\` (no Instagram: Editar capa → Adicionar da galeria)

**Gancho inicial (primeiros 3 segundos):** ${r.gancho}

**Texto completo da fala**
| Tempo | Fala |
|---|---|
${r.fala.map(([t, f]) => `| ${t} | ${f} |`).join('\n')}

**Orientação de gravação:** ${r.gravacao}

**Sugestão de cenas**
${r.cenas.map((c) => `- ${c}`).join('\n')}

**Textos na tela**
${r.textosTela.map((c) => `- ${c}`).join('\n')}

**Legenda**
\`\`\`
${r.legenda}
\`\`\`
**CTA final:** ${r.cta}

**Referências:** ${r.refs.map((k) => REFS[k].c + ' ' + REFS[k].l).join(' | ')}
`).join('\n')}`);

// ---------------------------------------------------------------- 05 antes/depois
W('05_ANTES_E_DEPOIS/COMO_USAR.md', `# Elementos gráficos de antes e depois (PNG transparente)
| Arquivo | Uso |
|---|---|
| 01_modelo_universal_antes_depois | Montagem lado a lado (antes à esquerda, depois à direita). Serve para qualquer procedimento, sem edição. |
| 02_modelo_sofisticado_resultado_clinico | Moldura fina com a etiqueta “Resultado clínico” sobre uma única foto final. |
| 03_modelo_minimalista_evolucao_do_tratamento | Cantoneiras e etiqueta “Evolução do tratamento” para fotos de etapas. |
| 04_modelo_institucional_assinatura | Faixa inferior com a logomarca e o CRO para qualquer foto clínica. |
| EXTRA_antes_depois_empilhado | Versão com antes em cima e depois embaixo. |

Cada elemento existe em dois tamanhos: **1080×1350 (feed vertical)** e **1080×1080 (quadrado)**.

## Como aplicar (Canva, celular ou computador)
1. Crie um design do mesmo tamanho do elemento (1080×1350 ou 1080×1080).
2. Coloque as fotos clínicas no fundo: no modelo universal, a foto “antes” ocupa a metade esquerda e a “depois”, a direita.
3. Insira o PNG por cima, ocupando a tela inteira. A área central é transparente e não cobre a fotografia.
4. Exporte em PNG ou JPG e publique.

## Regras éticas obrigatórias (CFO)
- Publique imagens de pacientes **somente com autorização escrita** (termo de consentimento específico para divulgação), conforme a Resolução CFO-196/2019.
- Use **fotos reais**, sem edição que altere o resultado. Nunca use imagens geradas por IA, de banco de imagens ou de outros profissionais como se fossem casos próprios.
- Não prometa resultados e não use expressões como “garantido” ou “perfeito”.
- Mantenha o nome e o **CRO-BA 32044** visíveis (todos os modelos já incluem).
- Não mostre o rosto do paciente, salvo autorização expressa. Prefira fotos intraorais ou do sorriso.
- Fotos de cirurgia com sangue não devem ser usadas como capa: use somente quando houver real valor educativo e autorização.
`);

// ---------------------------------------------------------------- 02 site
W('02_SITE/COMO_PUBLICAR.md', `# Site — Dra. Tatiane Aislan
Site de página única, responsivo e leve (cerca de 0,6 MB), pronto para ser o link da bio do Instagram e do TikTok.

## Conteúdo da pasta \`site/\`
- \`index.html\`: o site completo (HTML e CSS no mesmo arquivo).
- \`assets/img\`: fotos otimizadas (WebP e JPG), logomarca em SVG, favicon e imagem de compartilhamento.
- \`assets/fonts\`: fontes Jost e Inter hospedadas no próprio site (mais rapidez e privacidade).

## Antes de publicar (2 ajustes no index.html)
1. **Instagram:** no final do arquivo, preencha \`var INSTAGRAM = '';\` com o usuário, sem @ (ex.: \`'dra.tatianeaislan'\`). Enquanto estiver vazio, o botão do Instagram fica oculto para não haver link quebrado.
2. **Endereço final (depois de publicado):** descomente a linha \`<link rel="canonical" ...>\` no topo e coloque o endereço real.

O WhatsApp já está configurado: **${PERFIL.whatsapp}**, com a mensagem automática “Olá, Dra. Tatiane! Encontrei seu site e gostaria de informações sobre uma consulta.”

## Endereço curto: pesquisa de disponibilidade
Verificação feita em 11/11/2026, a partir do ambiente de produção deste projeto:

| Endereço | Plataforma | Resultado da verificação |
|---|---|---|
| dratatianeaislan.github.io | GitHub Pages | O usuário \`dratatianeaislan\` **não existe no GitHub** (a página de perfil retornou 404), o que indica que está livre. |
| tatianeaislan.github.io | GitHub Pages | O usuário \`tatianeaislan\` **também não existe** (404). |
| dratatianeaislan.netlify.app | Netlify | **Não foi possível verificar**: o acesso ao Netlify estava bloqueado no ambiente de produção. A própria Netlify confirma na hora de renomear o site (passo 4 abaixo). |
| dratatianeaislan.vercel.app | Vercel | **Não foi possível verificar** pelo mesmo motivo. A Vercel confirma ao criar o projeto. |

Nenhum endereço foi registrado em nome da Dra. Isso precisa ser feito por ela, ou por você, com a conta dela.

## Opção recomendada: Netlify (gratuita, sem programação)
1. Acesse **app.netlify.com/drop** e crie uma conta gratuita (pode usar o e-mail da Dra.).
2. **Arraste a pasta \`site\`** inteira para a área indicada. Em segundos, o site fica no ar com um endereço provisório.
3. Vá em **Site configuration → Change site name**.
4. Digite \`dratatianeaislan\`. Se o nome estiver livre, o endereço passa a ser **https://dratatianeaislan.netlify.app**. Se estiver ocupado, a Netlify avisa. Alternativas curtas, em ordem: \`tatianeaislan\`, \`dratatiane\`, \`tatianeaislan-odonto\`, \`dratatianeaislan-odonto\`.
5. Para atualizar o site no futuro: **Deploys → arraste a pasta \`site\` novamente**.

## Alternativa: GitHub Pages (gratuita)
1. Crie a conta **dratatianeaislan** no GitHub (o nome estava livre na verificação).
2. Crie um repositório chamado **dratatianeaislan.github.io** e envie o conteúdo da pasta \`site\`.
3. Em **Settings → Pages**, selecione a branch \`main\`. O endereço será **https://dratatianeaislan.github.io**.

## Domínio próprio (opcional, pago)
Para um endereço como **dratatianeaislan.com.br**, registre no **registro.br** (custo anual) e conecte na Netlify em **Domain management → Add a domain**. A disponibilidade aparece na busca do próprio registro.br.

## Depois de publicado
- Coloque o link na bio do Instagram e do TikTok.
- Teste o botão do WhatsApp em um celular.
- Opcional: cadastre o site no Google Search Console para acompanhar as buscas.

## Requisitos atendidos
Responsivo (testado em 1366 px e iPhone 13, sem rolagem horizontal) · fontes e imagens otimizadas (WebP) · SEO básico (title, description, Open Graph, dados estruturados \`Dentist\`) · acessibilidade (textos alternativos, link “pular para o conteúdo”, foco visível, contraste, respeito a “reduzir movimento”) · botão flutuante de WhatsApp.

## Procedimentos no site
Foram listados apenas os procedimentos confirmados: reabilitação oral (como abordagem de planejamento), implantes, cirurgias, extrações/siso, restaurações e avaliação. Para incluir prótese, periodontia ou outras áreas, basta confirmar a atuação da Dra. e duplicar um bloco \`<article class="card">\`.
`);

// ---------------------------------------------------------------- 01 identidade
W('01_IDENTIDADE_VISUAL/LEIA-ME_LOGOMARCA.md', `# Logomarca — arquivos em alta qualidade
Desenho original preservado: molar em linha fina, **T** na coroa e raízes formando o **A** (Λ).

## Versões
| Pedido | Arquivo |
|---|---|
| 1. Logo principal horizontal | \`LOGO_HORIZONTAL_PRINCIPAL/…colorido_PARA_FUNDO_CLARO\` e \`…PARA_FUNDO_ESCURO\` |
| 2. Logo vertical | \`LOGO_VERTICAL/\` (mesmas variações) |
| 3. Símbolo isolado | \`SIMBOLO_ISOLADO/\` (caramelo, caramelo escuro, ardósia, areia, branco, preto) |
| 4. Versão monocromática | \`…monocromatico_ardosia\`, \`…monocromatico_preto\` |
| 5. Versão negativa | \`…NEGATIVO_branco\` e \`…monocromatico_areia\` (para fundos escuros) |
| 6. Fundo claro | \`…colorido_PARA_FUNDO_CLARO\` |
| 7. Fundo escuro | \`…colorido_PARA_FUNDO_ESCURO\` |

Cada versão está em três formatos:
- **SVG_vetorial**: para sites, gráficas e edição (Illustrator, Inkscape, Figma, Canva).
- **PDF_vetorial**: para gráfica, fachada, placa, cartões e documentos. Pode ser ampliado sem perder qualidade.
- **PNG_alta_resolucao**: fundo transparente, cerca de 4.000 px, para redes sociais, Word e PowerPoint.

## Qual arquivo usar
| Aplicação | Arquivo recomendado |
|---|---|
| Fachada / placa | PDF ou SVG vetorial. Peça à gráfica o recorte em ACM, acrílico ou letra-caixa a partir do vetor. |
| Cartão de visita | PDF vetorial (frente ardósia com versão para fundo escuro; verso off-white) |
| Jaleco (bordado) | SVG do **símbolo** ou do **logo vertical** em uma cor (caramelo ou ardósia). Bordado mínimo: símbolo com 8 mm de altura. |
| Receituário / documentos | PNG ou PDF horizontal para fundo claro |
| Foto de perfil / favicon | Símbolo isolado |

## Cores
| Cor | HEX | RGB |
|---|---|---|
| Ardósia | #2F3A45 | 47, 58, 69 |
| Areia | #E9E0D3 | 233, 224, 211 |
| Caramelo | #C79E74 | 199, 158, 116 |
| Caramelo escuro (apoio) | #A07A55 | 160, 122, 85 |
| Off-white (apoio) | #F4EEE6 | 244, 238, 230 |

Para impressão, peça à gráfica uma **prova de cor** a partir dos valores HEX/RGB. As conversões para CMYK e Pantone variam conforme o papel e o equipamento.

## Tipografia
- Lettering do nome: desenhado letra por letra, por isso **use sempre os arquivos da logo**, nunca redigite o nome.
- Títulos: **Jost Light**, caixa-alta, espaçamento de 15% a 30% (Google Fonts, gratuita).
- Textos: **Inter** Light / Regular / Medium (Google Fonts, gratuita).
- Ambas têm licença SIL Open Font License: uso comercial liberado.

## Regras
Área de proteção = 1/4 da altura do símbolo · tamanho mínimo: horizontal 35 mm / 160 px; vertical 22 mm / 100 px; símbolo 8 mm / 32 px · não distorcer, girar, trocar cores, aplicar sombras ou efeitos.
`);

// ---------------------------------------------------------------- raiz
W('LEIA-ME.md', `# PROJETO DIGITAL — DRA. TATIANE AISLAN
Identidade visual aplicada, site, Instagram e manual · Desenvolvido por **Daniel dos Passos Gomes**

| Pasta | Conteúdo |
|---|---|
| 01_IDENTIDADE_VISUAL | Logomarca em SVG, PDF e PNG (horizontal, vertical, símbolo, mono, negativa, fundo claro/escuro), estampas, paleta e tipografia |
| 02_SITE | Site completo (\`site/\`) e instruções de publicação |
| 03_INSTAGRAM | 6 biografias, organização do perfil, 7 capas de destaques, simulação do perfil |
| 04_FEED_35_POSTS | 35 pastas (uma por publicação) com artes e legenda; legendas completas, referências e calendário |
| 05_ANTES_E_DEPOIS | 4 elementos PNG transparentes (+1 extra), em 2 tamanhos |
| 06_REELS | 3 roteiros completos + 3 capas ilustradas |
| 07_STORIES | 10 stories prontos + roteiro de interações |
| 08_MANUAL_PDF | Manual completo de identidade digital e posicionamento |
| _FONTES_EDITAVEIS | Arquivos-fonte para editar textos e gerar as artes novamente (ver abaixo) |

## Pendências (dependem da Dra.)
1. **@ do Instagram e print do perfil atual**: não foram enviados. O botão do Instagram no site está pronto, mas oculto até o preenchimento.
2. **Publicar o site**: siga \`02_SITE/COMO_PUBLICAR.md\` (cerca de 5 minutos).
3. **Autorizações de imagem**: a publicação 07 e o story 08 usam fotos da Dra. em atendimento. Confirme que nenhum paciente ou colega é identificável sem autorização.
4. **Revisar a publicação 35** (fluxo da primeira consulta): confirme se corresponde à rotina real da Dra.

## Como editar e gerar de novo (opcional, para quem usa computador)
Todo o conteúdo (textos das artes, legendas, bios, stories) está em \`_FONTES_EDITAVEIS/conteudo.js\`. Depois de editar, rode, com Node.js e Playwright instalados:
\`\`\`
cd _FONTES_EDITAVEIS
node gerar_artes.js        # artes do feed, stories, destaques, antes/depois, logos
node gerar_simulacao.js    # simulação do perfil
node gerar_documentos.js   # documentos .md
node gerar_manual.js       # manual em PDF
\`\`\`
`);
console.log('documentos ok');
