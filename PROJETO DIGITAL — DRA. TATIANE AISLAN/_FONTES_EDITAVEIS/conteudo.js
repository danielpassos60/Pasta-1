// =====================================================================
//  CONTEÚDO OFICIAL — DRA. TATIANE AISLAN | CIRURGIÃ-DENTISTA
//  Arquivo-fonte editável: todas as artes, legendas e o manual são
//  gerados a partir deste arquivo (ver gerar.js).
// =====================================================================

const PERFIL = {
  nome: 'Dra. Tatiane Aislan',
  nomeCompleto: 'Tatiane Aislan Damascena Feitosa',
  titulo: 'Cirurgiã-Dentista',
  cro: 'CRO-BA 32044',
  formacao: 'UNIME — União Metropolitana de Educação e Cultura',
  whatsapp: '+55 71 99220-6132',
  whatsappLink: 'https://wa.me/5571992206132?text=' + encodeURIComponent('Olá, Dra. Tatiane! Encontrei seu site e gostaria de informações sobre uma consulta.'),
  whatsappLinkInsta: 'https://wa.me/5571992206132?text=' + encodeURIComponent('Olá, Dra. Tatiane! Vim pelo Instagram e gostaria de agendar uma avaliação.'),
  // >>> PREENCHER: @ oficial do Instagram (sem o @). Não foi enviado.
  instagram: '',
  procedimentos: ['Cirurgias odontológicas', 'Extrações, incluindo dentes do siso', 'Restaurações', 'Implantes dentários'],
};

// ---------------------------------------------------------------------
// REFERÊNCIAS (todas reais e verificáveis pelo DOI ou link indicado)
// ---------------------------------------------------------------------
const REFS = {
  who2022: { c: 'World Health Organization. Global oral health status report: towards universal health coverage for oral health by 2030. Geneva: WHO; 2022.', l: 'https://www.who.int/publications/i/item/9789240061484' },
  whoFact: { c: 'World Health Organization. Oral health — Fact sheet (versão vigente).', l: 'https://www.who.int/news-room/fact-sheets/detail/oral-health' },
  who2015: { c: 'World Health Organization. Guideline: sugars intake for adults and children. Geneva: WHO; 2015.', l: 'https://www.who.int/publications/i/item/9789241549028' },
  sanz2018: { c: 'Sanz M, Ceriello A, Buysschaert M, et al. Scientific evidence on the links between periodontal diseases and diabetes: Consensus report and guidelines of the joint workshop on periodontal diseases and diabetes by the International Diabetes Federation and the European Federation of Periodontology. J Clin Periodontol. 2018;45(2):138-149.', l: 'https://doi.org/10.1111/jcpe.12808' },
  sanz2020cv: { c: 'Sanz M, Marco del Castillo A, Jepsen S, et al. Periodontitis and cardiovascular diseases: Consensus report. J Clin Periodontol. 2020;47(3):268-288.', l: 'https://doi.org/10.1111/jcpe.13189' },
  sanz2020efp: { c: 'Sanz M, Herrera D, Kebschull M, et al. Treatment of stage I–III periodontitis — The EFP S3 level clinical practice guideline. J Clin Periodontol. 2020;47(Suppl 22):4-60.', l: 'https://doi.org/10.1111/jcpe.13290' },
  chapple2018: { c: 'Chapple ILC, Mealey BL, Van Dyke TE, et al. Periodontal health and gingival diseases and conditions on an intact and a reduced periodontium: Consensus report of workgroup 1 of the 2017 World Workshop. J Periodontol. 2018;89(Suppl 1):S74-S84.', l: 'https://doi.org/10.1002/JPER.17-0719' },
  papapanou2018: { c: 'Papapanou PN, Sanz M, Buduneli N, et al. Periodontitis: Consensus report of workgroup 2 of the 2017 World Workshop on the Classification of Periodontal and Peri-Implant Diseases and Conditions. J Periodontol. 2018;89(Suppl 1):S173-S182.', l: 'https://doi.org/10.1002/JPER.17-0721' },
  berglundh2018: { c: 'Berglundh T, Armitage G, Araujo MG, et al. Peri-implant diseases and conditions: Consensus report of workgroup 4 of the 2017 World Workshop. J Clin Periodontol. 2018;45(Suppl 20):S286-S291.', l: 'https://doi.org/10.1111/jcpe.12957' },
  herrera2023: { c: 'Herrera D, Berglundh T, Schwarz F, et al. Prevention and treatment of peri-implant diseases — The EFP S3 level clinical practice guideline. J Clin Periodontol. 2023;50(Suppl 26):4-76.', l: 'https://doi.org/10.1111/jcpe.13823' },
  thoma2014: { c: 'Thoma DS, Buranawat B, Hämmerle CHF, Held U, Jung RE. Efficacy of soft tissue augmentation around dental implants and in partially edentulous areas: a systematic review. J Clin Periodontol. 2014;41(Suppl 15):S77-S91.', l: 'https://doi.org/10.1111/jcpe.12220' },
  albrektsson1981: { c: 'Albrektsson T, Brånemark PI, Hansson HA, Lindström J. Osseointegrated titanium implants. Requirements for ensuring a long-lasting, direct bone-to-implant anchorage in man. Acta Orthop Scand. 1981;52(2):155-170.', l: 'https://doi.org/10.3109/17453678108991776' },
  howe2019: { c: 'Howe MS, Keys W, Richards D. Long-term (10-year) dental implant survival: A systematic review and sensitivity meta-analysis. J Dent. 2019;84:9-21.', l: 'https://doi.org/10.1016/j.jdent.2019.03.008' },
  chrcanovic2015: { c: 'Chrcanovic BR, Albrektsson T, Wennerberg A. Smoking and dental implants: A systematic review and meta-analysis. J Dent. 2015;43(5):487-498.', l: 'https://doi.org/10.1016/j.jdent.2015.03.003' },
  tyndall2012: { c: 'Tyndall DA, Price JB, Tetradis S, et al. Position statement of the American Academy of Oral and Maxillofacial Radiology on selection criteria for the use of radiology in dental implantology with emphasis on cone beam computed tomography. Oral Surg Oral Med Oral Pathol Oral Radiol. 2012;113(6):817-826.', l: 'https://doi.org/10.1016/j.oooo.2012.03.005' },
  tan2012: { c: 'Tan WL, Wong TLT, Wong MCM, Lang NP. A systematic review of post-extractional alveolar hard and soft tissue dimensional changes in humans. Clin Oral Implants Res. 2012;23(Suppl 5):1-21.', l: 'https://doi.org/10.1111/j.1600-0501.2011.02375.x' },
  schropp2003: { c: 'Schropp L, Wenzel A, Kostopoulos L, Karring T. Bone healing and soft tissue contour changes following single-tooth extraction: a clinical and radiographic 12-month prospective study. Int J Periodontics Restorative Dent. 2003;23(4):313-323.', l: 'https://pubmed.ncbi.nlm.nih.gov/12956475/' },
  ghaeminia2020: { c: 'Ghaeminia H, Nienhuijs MEL, Toedtling V, et al. Surgical removal versus retention for the management of asymptomatic disease-free impacted wisdom teeth. Cochrane Database Syst Rev. 2020;5:CD003879.', l: 'https://doi.org/10.1002/14651858.CD003879.pub5' },
  nice2000: { c: 'National Institute for Health and Care Excellence (NICE). Guidance on the extraction of wisdom teeth. Technology appraisal guidance [TA1]. London: NICE; 2000.', l: 'https://www.nice.org.uk/guidance/ta1' },
  sdcep2013: { c: 'Scottish Dental Clinical Effectiveness Programme (SDCEP). Management of Acute Dental Problems: Guidance for Healthcare Professionals. Dundee: SDCEP; 2013.', l: 'https://www.sdcep.org.uk/published-guidance/acute-dental-problems/' },
  sdcep2015: { c: 'Scottish Dental Clinical Effectiveness Programme (SDCEP). Management of Dental Patients Taking Anticoagulants or Antiplatelet Drugs. Dental Clinical Guidance. Dundee: SDCEP; 2015.', l: 'https://www.sdcep.org.uk/published-guidance/anticoagulants-and-antiplatelets/' },
  daly2012: { c: 'Daly B, Sharif MO, Newton T, Jones K, Worthington HV. Local interventions for the management of alveolar osteitis (dry socket). Cochrane Database Syst Rev. 2012;12:CD006968.', l: 'https://doi.org/10.1002/14651858.CD006968.pub2' },
  walsh2019: { c: 'Walsh T, Worthington HV, Glenny AM, Marinho VCC, Jeroncic A. Fluoride toothpastes of different concentrations for preventing dental caries. Cochrane Database Syst Rev. 2019;3:CD007868.', l: 'https://doi.org/10.1002/14651858.CD007868.pub3' },
  ms2009: { c: 'Brasil. Ministério da Saúde. Guia de recomendações para o uso de fluoretos no Brasil. Brasília: Ministério da Saúde; 2009.', l: 'https://bvsms.saude.gov.br/bvs/publicacoes/guia_recomendacoes_uso_fluoretos.pdf' },
  yaacob2014: { c: 'Yaacob M, Worthington HV, Deacon SA, et al. Powered versus manual toothbrushing for oral health. Cochrane Database Syst Rev. 2014;(6):CD002281.', l: 'https://doi.org/10.1002/14651858.CD002281.pub3' },
  ada: { c: 'American Dental Association. Toothbrushes — Oral Health Topics. Chicago: ADA (página institucional, versão vigente).', l: 'https://www.ada.org/resources/ada-library/oral-health-topics/toothbrushes' },
  worthington2019: { c: 'Worthington HV, MacDonald L, Poklepovic Pericic T, et al. Home use of interdental cleaning devices, in addition to toothbrushing, for preventing and controlling periodontal diseases and dental caries. Cochrane Database Syst Rev. 2019;4:CD012018.', l: 'https://doi.org/10.1002/14651858.CD012018.pub2' },
  pitts2017: { c: 'Pitts NB, Zero DT, Marsh PD, et al. Dental caries. Nat Rev Dis Primers. 2017;3:17030.', l: 'https://doi.org/10.1038/nrdp.2017.30' },
  gerritsen2010: { c: 'Gerritsen AE, Allen PF, Witter DJ, Bronkhorst EM, Creugers NHJ. Tooth loss and oral health-related quality of life: a systematic review and meta-analysis. Health Qual Life Outcomes. 2010;8:126.', l: 'https://doi.org/10.1186/1477-7525-8-126' },
  kassebaum2014: { c: 'Kassebaum NJ, Bernabé E, Dahiya M, et al. Global burden of severe tooth loss: a systematic review and meta-analysis. J Dent Res. 2014;93(7 Suppl):20S-28S.', l: 'https://doi.org/10.1177/0022034514537828' },
  opdam2014: { c: 'Opdam NJM, van de Sande FH, Bronkhorst E, et al. Longevity of posterior composite restorations: a systematic review and meta-analysis. J Dent Res. 2014;93(10):943-949.', l: 'https://doi.org/10.1177/0022034514544217' },
  demarco2012: { c: 'Demarco FF, Corrêa MB, Cenci MS, Moraes RR, Opdam NJM. Longevity of posterior composite restorations: not only a matter of materials. Dent Mater. 2012;28(1):87-101.', l: 'https://doi.org/10.1016/j.dental.2011.09.003' },
  gpt9: { c: 'The Glossary of Prosthodontic Terms: Ninth Edition. J Prosthet Dent. 2017;117(5S):e1-e105.', l: 'https://doi.org/10.1016/j.prosdent.2016.12.001' },
  felton2011: { c: 'Felton D, Cooper L, Duqum I, et al. Evidence-based guidelines for the care and maintenance of complete dentures: a publication of the American College of Prosthodontists. J Prosthodont. 2011;20(Suppl 1):S1-S12.', l: 'https://doi.org/10.1111/j.1532-849X.2010.00683.x' },
  nice2004: { c: 'National Institute for Health and Care Excellence (NICE). Dental checks: intervals between oral health reviews. Clinical guideline [CG19]. London: NICE; 2004.', l: 'https://www.nice.org.uk/guidance/cg19' },
  riley2013: { c: 'Riley P, Worthington HV, Clarkson JE, Beirne PV. Recall intervals for oral health in primary care patients. Cochrane Database Syst Rev. 2013;(12):CD004346.', l: 'https://doi.org/10.1002/14651858.CD004346.pub4' },
  leite2018: { c: 'Leite FRM, Nascimento GG, Scheutz F, López R. Effect of smoking on periodontitis: a systematic review and meta-regression. Am J Prev Med. 2018;54(6):831-841.', l: 'https://doi.org/10.1016/j.amepre.2018.02.014' },
  cabdh2003: { c: 'Canadian Advisory Board on Dentin Hypersensitivity. Consensus-based recommendations for the diagnosis and management of dentin hypersensitivity. J Can Dent Assoc. 2003;69(4):221-226.', l: 'https://pubmed.ncbi.nlm.nih.gov/12662460/' },
  lobbezoo2018: { c: 'Lobbezoo F, Ahlberg J, Raphael KG, et al. International consensus on the assessment of bruxism: Report of a work in progress. J Oral Rehabil. 2018;45(11):837-844.', l: 'https://doi.org/10.1111/joor.12663' },
  inca: { c: 'Brasil. Ministério da Saúde. Instituto Nacional de Câncer (INCA). Câncer de boca (página institucional, versão vigente).', l: 'https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/boca' },
  acog2013: { c: 'American College of Obstetricians and Gynecologists. Committee Opinion No. 569: Oral health care during pregnancy and through the lifespan. Obstet Gynecol. 2013;122(2 Pt 1):417-422.', l: 'https://doi.org/10.1097/01.AOG.0000433007.16843.10' },
  cfo118: { c: 'Conselho Federal de Odontologia. Resolução CFO-118/2012 — Código de Ética Odontológica.', l: 'https://website.cfo.org.br/ (seção Legislação)' },
  cfo196: { c: 'Conselho Federal de Odontologia. Resolução CFO-196/2019 — autoriza a divulgação de autorretratos (selfies) e de imagens relativas ao diagnóstico e ao resultado final de tratamentos odontológicos, com autorização do paciente.', l: 'https://website.cfo.org.br/ (seção Legislação)' },
};

// ---------------------------------------------------------------------
// HASHTAGS (enxutas: 5 a 8 por post)
// ---------------------------------------------------------------------
const H = {
  base: ['#odontologia', '#dentista', '#saudebucal', '#odontologiabahia'],
  ro: ['#reabilitacaooral', '#implantesdentarios', '#protesedentaria'],
  imp: ['#implantedentario', '#implantesdentarios', '#reabilitacaooral'],
  cir: ['#cirurgiaoral', '#extracaodentaria', '#dentedosiso'],
  per: ['#saudegengival', '#gengivite', '#periodontia'],
  den: ['#restauracao', '#carie', '#dentistica'],
  prev: ['#prevencao', '#higienebucal', '#sorrisosaudavel'],
  pro: ['#protesedentaria', '#reabilitacaooral'],
};
const tags = (...grupos) => [...new Set(grupos.flat())].slice(0, 8);

const ASSINATURA = '\n\nDra. Tatiane Aislan · Cirurgiã-Dentista · CRO-BA 32044\nConteúdo educativo: não substitui a avaliação individual.';

// ---------------------------------------------------------------------
// 35 PUBLICAÇÕES — ordem = ordem recomendada de postagem
// tom: 'claro' | 'escuro' (alternância cria efeito xadrez na grade)
// ---------------------------------------------------------------------
const POSTS = [
  {
    n: 1, area: 'Institucional', tema: 'Apresentação da Dra. Tatiane Aislan', tom: 'claro',
    objetivo: 'Apresentar a profissional, gerar proximidade e deixar claro o que ela faz. É a base do perfil para quem chega pela primeira vez.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capaFoto', foto: 'mesa', kicker: 'Muito prazer', title: 'Dra. Tatiane Aislan', sub: 'Cirurgiã-Dentista · CRO-BA 32044' },
      { t: 'texto', h: 'Quem sou', p: 'Sou cirurgiã-dentista formada pela UNIME (União Metropolitana de Educação e Cultura). Acredito em uma odontologia feita com técnica, escuta e respeito ao tempo de cada paciente.' },
      { t: 'lista', h: 'O que eu faço', items: ['Cirurgias odontológicas', 'Extrações, incluindo dentes do siso', 'Restaurações', 'Implantes dentários'] },
      { t: 'final', h: 'Meu compromisso', p: 'Planejar cada tratamento a partir da sua história, para devolver saúde, função e confiança ao seu sorriso.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa com a fotografia oficial no consultório (tons areia e madeira), moldura off-white e nome em Jost Light. Páginas internas em off-white com fios caramelo. Última página em areia.',
    legenda: `Muito prazer, eu sou a Dra. Tatiane Aislan. 🤍

Sou cirurgiã-dentista, formada pela UNIME, e criei este espaço para falar de saúde bucal de um jeito claro, próximo e baseado em ciência.

No consultório, atuo com cirurgias odontológicas, extrações (incluindo dentes do siso), restaurações e implantes dentários. Em cada atendimento, meu compromisso é o mesmo: ouvir com atenção, planejar com cuidado e explicar cada etapa para que você se sinta seguro(a) nas decisões sobre o seu tratamento.

Por aqui você vai encontrar conteúdos sobre reabilitação oral, implantes, saúde gengival, prevenção e respostas às dúvidas mais comuns do consultório.

Me conta nos comentários: qual assunto você quer ver primeiro?`,
    cta: 'Comente o assunto que você quer ver primeiro e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, ['#cirurgiadentista', '#implantesdentarios', '#reabilitacaooral']),
    refs: [], fonte: 'Conteúdo institucional: informações fornecidas pela profissional (formação, CRO e procedimentos).',
    postagem: 'Primeira publicação do perfil. Publique junto com a atualização da bio, da foto de perfil e dos destaques. Fixe esta publicação no topo do perfil.',
  },
  {
    n: 2, area: 'Saúde bucal', tema: 'Saúde bucal e saúde geral', tom: 'escuro',
    objetivo: 'Educar e ampliar o alcance com um tema de interesse geral, posicionando a saúde bucal como parte da saúde do corpo.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Saúde bucal', title: 'Sua boca fala sobre a sua saúde', sub: 'O que a ciência já sabe sobre essa conexão' },
      { t: 'texto', h: 'Um desafio mundial', p: 'Segundo a Organização Mundial da Saúde, as doenças bucais atingem quase 3,5 bilhões de pessoas. A maioria delas pode ser prevenida.' },
      { t: 'texto', h: 'Boca e corpo conectados', p: 'A periodontite, uma inflamação crônica dos tecidos que sustentam os dentes, tem relação de mão dupla com o diabetes e está associada a doenças cardiovasculares.' },
      { t: 'final', h: 'O que fazer', p: 'Higiene diária bem-feita, menos açúcar ao longo do dia e avaliação odontológica regular. Cuidar da boca é cuidar do corpo inteiro.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia com o símbolo em estampa sutil; título em areia. Internas em off-white; final em ardósia com chamada em caramelo.',
    legenda: `Saúde bucal não é só sobre dentes bonitos.

A Organização Mundial da Saúde estima que as doenças bucais afetam quase 3,5 bilhões de pessoas no mundo, e a maior parte delas é evitável.

A ciência também mostra que a boca conversa com o resto do corpo. A periodontite (inflamação crônica da gengiva e dos tecidos de suporte dos dentes) tem relação bidirecional com o diabetes e está associada a doenças cardiovasculares.

Por isso, cuidar da boca é um gesto de saúde integral: escovação com creme dental com flúor, limpeza entre os dentes, menos açúcar e acompanhamento odontológico regular.

Salve este post para lembrar e compartilhe com alguém que anda adiando a consulta.`,
    cta: 'Salve, compartilhe e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, ['#saudeintegral', '#prevencao', '#periodontite']),
    refs: ['who2022', 'sanz2018', 'sanz2020cv'],
    postagem: 'Publique 2 a 3 dias após a publicação 01.',
  },
  {
    n: 3, area: 'Reabilitação oral', tema: 'O que é reabilitação oral', tom: 'claro',
    objetivo: 'Apresentar o conceito de reabilitação oral, eixo central do posicionamento, de forma acessível.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Reabilitação oral', title: 'O que é reabilitação oral?', sub: 'Muito além da estética' },
      { t: 'texto', h: 'O conceito', p: 'Reabilitar é devolver à boca a função, o conforto e a harmonia perdidos por falta de dentes, desgastes, fraturas ou doenças.' },
      { t: 'lista', h: 'Quando pode ser necessária', items: ['Perda de um ou mais dentes', 'Dificuldade para mastigar', 'Dentes muito desgastados ou fraturados', 'Próteses que não se adaptam mais'] },
      { t: 'final', h: 'Cada caso é único', p: 'O plano pode envolver restaurações, cirurgias, implantes e próteses. Tudo começa com uma avaliação individualizada.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia com título em ardósia e fio caramelo. Página de lista com marcadores em linha fina.',
    legenda: `Reabilitação oral é devolver à boca aquilo que foi perdido: função, conforto e harmonia.

Ela pode ser indicada quando há perda de dentes, dificuldade para mastigar, dentes muito desgastados ou fraturados, ou próteses que já não se adaptam bem.

Estudos mostram que a perda dentária está associada a pior qualidade de vida relacionada à saúde bucal, com impacto na mastigação, na fala e na autoestima. Por isso, reabilitar vai muito além da estética.

O tratamento é sempre planejado de forma individual e pode envolver restaurações, cirurgias, implantes e próteses, em etapas bem definidas.

Tem alguma dúvida sobre reabilitação oral? Deixe nos comentários.`,
    cta: 'Deixe sua dúvida nos comentários ou chame no WhatsApp pelo link da bio.',
    hashtags: tags(H.base, H.ro),
    refs: ['gerritsen2010', 'kassebaum2014'],
    postagem: 'Publique 2 a 3 dias após a publicação 02.',
  },
  {
    n: 4, area: 'Institucional', tema: 'Frase institucional: técnica, cuidado e escuta', tom: 'escuro',
    objetivo: 'Reforçar os valores da marca e criar respiro visual no feed.',
    formato: 'Imagem única',
    pages: [{ t: 'frase', frase: 'Técnica, cuidado e escuta em cada detalhe.' }],
    visual: 'Fundo ardósia, símbolo em caramelo centralizado, frase em Jost Light areia. Muito espaço vazio.',
    legenda: `Técnica, cuidado e escuta em cada detalhe.

Essas três palavras resumem como eu enxergo a odontologia. A técnica garante segurança. O cuidado transforma o atendimento em uma experiência tranquila. E a escuta permite entender o que realmente importa para cada paciente.

Porque um bom tratamento começa com uma boa conversa.`,
    cta: 'Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, ['#cirurgiadentista', '#atendimentohumanizado']),
    refs: [], fonte: 'Conteúdo institucional (frase de posicionamento da marca).',
    postagem: 'Publique 2 a 3 dias após a publicação 03.',
  },
  {
    n: 5, area: 'Cirurgia odontológica', tema: 'Dente do siso: tirar ou não tirar?', tom: 'claro',
    objetivo: 'Responder uma dúvida muito buscada e mostrar atuação em cirurgia e extrações com critério clínico.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Cirurgia oral', title: 'Siso: tirar ou não tirar?', sub: 'A resposta depende do seu caso' },
      { t: 'texto', h: 'Nem todo siso precisa sair', p: 'Dentes do siso saudáveis, bem posicionados e sem sintomas podem, em muitos casos, apenas ser acompanhados.' },
      { t: 'lista', h: 'Quando a extração costuma ser indicada', items: ['Inflamação ou infecção na gengiva ao redor', 'Cárie que não pode ser tratada', 'Danos ao dente vizinho', 'Cistos ou outras alterações'] },
      { t: 'final', h: 'A decisão é clínica', p: 'Exame clínico e radiografias mostram a posição do dente e os riscos. Assim, a escolha é segura e individual.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia, título grande em duas linhas. Lista com fios finos entre os itens.',
    legenda: `“Doutora, preciso tirar o siso?” Essa é uma das perguntas que mais escuto.

A resposta honesta é: depende.

Revisões científicas e diretrizes internacionais indicam que sisos saudáveis, sem sintomas e sem alterações podem, em muitos casos, ser apenas acompanhados. A extração passa a ser indicada quando existe um problema, como inflamação ou infecção na gengiva ao redor (pericoronarite), cárie que não pode ser tratada, danos ao dente vizinho, cistos ou outras alterações.

Por isso, a decisão nunca deve ser automática. O exame clínico e as radiografias mostram a posição do dente e os riscos de cada caso.

Marque aqui alguém que vive adiando essa avaliação.`,
    cta: 'Marque alguém e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.cir),
    refs: ['ghaeminia2020', 'nice2000'],
    postagem: 'Publique 2 a 3 dias após a publicação 04.',
  },
  {
    n: 6, area: 'Periodontia / saúde gengival', tema: 'Gengiva que sangra não é normal', tom: 'escuro',
    objetivo: 'Alertar sobre um sinal comum e muitas vezes ignorado, gerando identificação e procura por avaliação.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Saúde gengival', title: 'Gengiva que sangra não é normal', sub: 'Entenda esse sinal' },
      { t: 'texto', h: 'O que pode significar', p: 'Sangramento ao escovar ou usar fio dental é o principal sinal da gengivite: uma inflamação causada pelo acúmulo de placa bacteriana.' },
      { t: 'texto', h: 'Por que não ignorar', p: 'A gengivite é reversível. Sem tratamento, pode evoluir para periodontite, que atinge os tecidos de suporte e pode levar à perda dos dentes.' },
      { t: 'final', h: 'O que fazer', p: 'Não pare de escovar. Mantenha a higiene, inclusive entre os dentes, e agende uma avaliação para identificar a causa.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia; a palavra “sangra” pode receber destaque em caramelo. Internas em off-white.',
    legenda: `Sua gengiva sangra quando você escova os dentes ou usa fio dental? Isso não é normal.

O sangramento gengival é o principal sinal da gengivite, uma inflamação causada pelo acúmulo de placa bacteriana. A boa notícia: a gengivite é reversível.

O problema é quando ela é ignorada. Sem tratamento, pode evoluir para periodontite, uma doença que atinge os tecidos que sustentam os dentes e pode levar à perda dentária.

Um erro comum é parar de escovar a região que sangra. Faça o contrário: mantenha a escovação, limpe entre os dentes e procure uma avaliação para identificar a causa e orientar o tratamento.

Salve para não esquecer.`,
    cta: 'Salve este post e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.per),
    refs: ['chapple2018', 'papapanou2018', 'sanz2020efp'],
    postagem: 'Publique 2 a 3 dias após a publicação 05.',
  },
  {
    n: 7, area: 'Autoridade profissional', tema: 'Bastidores: planejamento cirúrgico', tom: 'claro',
    objetivo: 'Mostrar a rotina clínica real e transmitir seriedade, sem expor o paciente.',
    formato: 'Imagem única (fotografia)',
    pages: [{ t: 'foto', foto: 'cirurgia_pb', kicker: 'Bastidores', frase: 'Cada procedimento começa muito antes: no planejamento.' }],
    visual: 'Fotografia em preto e branco da Dra. em procedimento, em moldura off-white, com frase curta abaixo. Nenhum dado do paciente aparece.',
    legenda: `Por trás de cada procedimento existe uma etapa que o paciente nem sempre vê: o planejamento.

Antes de qualquer cirurgia, avalio a saúde geral, os exames, os medicamentos em uso e as expectativas de cada pessoa. Durante o atendimento, biossegurança e atenção aos detalhes são inegociáveis.

É esse cuidado invisível que torna o tratamento mais seguro e previsível.`,
    cta: 'Ficou com alguma dúvida sobre cirurgias? Chame no WhatsApp pelo link da bio.',
    hashtags: tags(H.base, ['#cirurgiaoral', '#bastidores', '#biosseguranca']),
    refs: [], fonte: 'Conteúdo institucional (bastidores). Imagem da própria profissional; paciente não identificável.',
    postagem: 'Publique 2 a 3 dias após a publicação 06. Antes de publicar, confirme se a pessoa que aparece parcialmente ao fundo autorizou o uso da imagem.',
  },
  {
    n: 8, area: 'Implantes dentários', tema: 'Implante dentário: como funciona', tom: 'escuro',
    objetivo: 'Explicar o básico do implante e gerar confiança no tratamento.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Implantes dentários', title: 'Implante dentário: como funciona?', sub: 'Da raiz artificial à coroa' },
      { t: 'texto', h: 'O que é', p: 'O implante é uma peça, geralmente de titânio, instalada no osso para substituir a raiz de um dente perdido. Sobre ele é colocada a prótese.' },
      { t: 'texto', h: 'Osseointegração', p: 'Com o tempo, o osso se une à superfície do implante. Esse processo, chamado osseointegração, garante a estabilidade para mastigar.' },
      { t: 'final', h: 'Resultados duradouros', p: 'Uma revisão sistemática encontrou sobrevida dos implantes acima de 95% em 10 anos. Manutenção e cuidado diário fazem parte desse resultado.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia; internas em off-white com fio caramelo vertical lembrando a raiz.',
    legenda: `Você sabe como um implante dentário funciona?

O implante é uma peça, geralmente de titânio, instalada no osso para substituir a raiz de um dente perdido. Depois de um período de cicatrização, o osso se une à superfície do implante. Esse processo se chama osseointegração e foi descrito cientificamente há mais de 40 anos.

Sobre o implante é instalada a prótese (a coroa), que devolve a função e a estética do dente.

Os resultados de longo prazo são muito consistentes: uma revisão sistemática encontrou sobrevida acima de 95% em 10 anos. Mas lembre-se: higiene diária e consultas de manutenção fazem parte do sucesso.

Quer saber se o implante é uma opção para você?`,
    cta: 'Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.imp),
    refs: ['albrektsson1981', 'howe2019'],
    postagem: 'Publique 2 a 3 dias após a publicação 07.',
  },
  {
    n: 9, area: 'Mitos e verdades', tema: '3 mitos que atrasam o cuidado', tom: 'claro',
    objetivo: 'Gerar engajamento (salvamentos e compartilhamentos) desfazendo crenças comuns.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Mitos e verdades', title: '3 mitos que atrasam o seu cuidado', sub: '' },
      { t: 'mito', tag: 'Mito', h: '“Se não dói, está tudo bem.”', p: 'Cárie e doença periodontal podem evoluir sem dor por muito tempo. O diagnóstico precoce depende de avaliação.' },
      { t: 'mito', tag: 'Mito', h: '“Gestante não pode ir ao dentista.”', p: 'O cuidado odontológico é seguro e recomendado na gestação. Informe sempre a gestação à sua dentista.' },
      { t: 'mito', tag: 'Mito', h: '“Escovar com força limpa melhor.”', p: 'O que remove a placa é a técnica, não a força. A escovação agressiva pode contribuir para desgaste e sensibilidade.', final: true, cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia. Cada mito com selo “MITO” em caramelo escuro, frase entre aspas em Jost Light.',
    legenda: `Três crenças muito comuns que fazem as pessoas adiarem o cuidado com a saúde bucal:

1. “Se não dói, está tudo bem.” Mito. A cárie e a doença periodontal podem evoluir por muito tempo sem dor. Quando o desconforto aparece, o problema muitas vezes já está avançado.

2. “Gestante não pode ir ao dentista.” Mito. O cuidado odontológico é seguro e recomendado durante a gestação. Basta informar a gestação para que o atendimento seja adequado.

3. “Escovar com força limpa melhor.” Mito. Quem remove a placa é a técnica. A escovação agressiva pode contribuir para desgaste e sensibilidade.

Qual desses você já ouviu? Compartilhe com quem precisa ler isso.`,
    cta: 'Compartilhe com alguém e salve para consultar depois.',
    hashtags: tags(H.base, H.prev, ['#mitoseverdades']),
    refs: ['pitts2017', 'papapanou2018', 'acog2013', 'cabdh2003'],
    postagem: 'Publique 2 a 3 dias após a publicação 08.',
  },
  {
    n: 10, area: 'Cuidados pós-procedimento', tema: 'Cuidados após a extração', tom: 'escuro',
    objetivo: 'Oferecer conteúdo útil e salvável sobre extrações, reforçando a atuação cirúrgica.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Cuidados', title: 'Extraí um dente. E agora?', sub: 'Cuidados nas primeiras horas' },
      { t: 'lista', h: 'Nas primeiras horas', items: ['Mantenha a gaze mordida pelo tempo orientado', 'Evite bochechar e cuspir com força', 'Prefira alimentos frios ou mornos e macios'] },
      { t: 'lista', h: 'Evite', items: ['Fumar e ingerir bebidas alcoólicas', 'Esforço físico intenso', 'Mexer no local com a língua ou objetos'] },
      { t: 'final', h: 'Quando procurar a dentista', p: 'Sangramento que não cede, dor que piora depois de alguns dias, febre ou inchaço progressivo. Siga sempre as orientações individuais recebidas.', cta: 'Salve este post' },
    ],
    visual: 'Capa em ardósia. Listas em off-white com marcadores em linha fina.',
    legenda: `Fez uma extração? Estes cuidados ajudam na recuperação:

Nas primeiras horas
• Mantenha a gaze mordida pelo tempo orientado.
• Evite bochechar e cuspir com força: isso ajuda a preservar o coágulo.
• Prefira alimentos frios ou mornos e de consistência macia.

Evite
• Fumar e ingerir bebidas alcoólicas.
• Esforço físico intenso.
• Mexer no local com a língua ou com objetos.

Procure a sua dentista se houver sangramento que não cede, dor que piora depois de alguns dias, febre ou inchaço progressivo.

Importante: cada procedimento tem orientações específicas. Siga sempre as recomendações individuais recebidas na consulta.`,
    cta: 'Salve para consultar quando precisar.',
    hashtags: tags(H.base, H.cir, ['#posoperatorio']),
    refs: ['sdcep2013', 'daly2012'],
    postagem: 'Publique 2 a 3 dias após a publicação 09. Ótimo conteúdo para o destaque “Dúvidas”.',
  },
  {
    n: 11, area: 'Prevenção', tema: 'Limpeza entre os dentes', tom: 'claro',
    objetivo: 'Educar sobre higiene interdental com orientação prática.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Prevenção', title: 'A escova não alcança tudo', sub: 'Por que limpar entre os dentes' },
      { t: 'texto', h: 'Onde a placa se esconde', p: 'Entre os dentes e junto à gengiva, as cerdas da escova têm pouco alcance. É ali que a placa costuma se acumular.' },
      { t: 'texto', h: 'Fio dental ou escova interdental?', p: 'Os dois podem ajudar. Estudos indicam que a escova interdental, somada à escovação, reduz a gengivite. A escolha depende do espaço entre os seus dentes.' },
      { t: 'final', h: 'Peça orientação', p: 'Na consulta, indico o tipo e o tamanho adequados para você e mostro como usar.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia. Internas em off-white.',
    legenda: `A escova de dentes, sozinha, não alcança tudo.

Entre os dentes e junto à gengiva, as cerdas têm pouco alcance, e é justamente ali que a placa bacteriana costuma se acumular.

Fio dental ou escova interdental? Os dois podem ajudar. Uma revisão Cochrane indica que a escova interdental, somada à escovação, ajuda a reduzir a gengivite. A escolha ideal depende do espaço entre os seus dentes, da presença de próteses ou implantes e da sua habilidade com cada acessório.

Na consulta, eu indico o tipo e o tamanho certos para você e mostro como usar.

Você usa fio dental todos os dias? Responda com sinceridade nos comentários. 😉`,
    cta: 'Responda nos comentários e agende sua orientação pelo link da bio.',
    hashtags: tags(H.base, H.prev, ['#fiodental']),
    refs: ['worthington2019'],
    postagem: 'Publique 2 a 3 dias após a publicação 10.',
  },
  {
    n: 12, area: 'Dentística restauradora', tema: 'A cárie começa em silêncio', tom: 'escuro',
    objetivo: 'Explicar a cárie de forma simples e conectar prevenção a tratamento restaurador.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Restaurações', title: 'A cárie começa em silêncio', sub: '' },
      { t: 'texto', h: 'Como ela surge', p: 'Bactérias da placa usam o açúcar da dieta e produzem ácidos que, aos poucos, desmineralizam o dente.' },
      { t: 'texto', h: 'Os primeiros sinais', p: 'Manchas brancas e opacas podem ser o início. Nessa fase, muitas lesões podem ser controladas sem precisar de restauração.' },
      { t: 'final', h: 'Prevenir e tratar', p: 'Creme dental com flúor, menos açúcar ao longo do dia e avaliação periódica. Quando já existe cavidade, a restauração devolve forma e função.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia com título em três linhas. Internas em off-white.',
    legenda: `A cárie não aparece de um dia para o outro, e quase sempre começa em silêncio.

Ela surge quando as bactérias da placa usam o açúcar da alimentação e produzem ácidos que desmineralizam o dente aos poucos. Os primeiros sinais podem ser manchas brancas e opacas, e nessa fase muitas lesões podem ser controladas sem restauração.

Quando a cavidade já está formada, a restauração devolve a forma e a função do dente.

Para prevenir:
• creme dental com flúor, pelo menos duas vezes ao dia;
• menos açúcar ao longo do dia;
• avaliação odontológica periódica.

Quando foi a sua última consulta?`,
    cta: 'Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.den, ['#prevencao']),
    refs: ['pitts2017', 'who2015', 'walsh2019'],
    postagem: 'Publique 2 a 3 dias após a publicação 11.',
  },
  {
    n: 13, area: 'Autoridade profissional', tema: 'Ciência na prática: apresentação científica', tom: 'claro',
    objetivo: 'Construir autoridade com um fato real: apresentação de trabalho científico em evento da ABO-Bahia.',
    formato: 'Imagem única (fotografia)',
    pages: [{ t: 'foto', foto: 'apresentacao_cientifica', kicker: 'Ciência e prática', frase: 'Atualização constante para cuidar com segurança.' }],
    visual: 'Fotografia da Dra. ao lado do trabalho apresentado, em moldura off-white, frase em Jost Light.',
    legenda: `Estudar e compartilhar conhecimento também faz parte do cuidado com o paciente.

Este foi um momento especial: a apresentação do trabalho “Reabilitação de enxerto conjuntivo em região de implante”, desenvolvido em coautoria, no Meeting Acadêmico da ABO-Bahia.

O tema trata dos tecidos moles ao redor dos implantes, um detalhe que faz diferença na estética e na manutenção da saúde da região.

Para mim, a odontologia de qualidade nasce da união entre ciência atualizada e prática clínica cuidadosa. 🤍`,
    cta: 'Quer entender mais sobre implantes? Acompanhe o perfil e chame no WhatsApp pelo link da bio.',
    hashtags: tags(H.base, ['#cienciaodontologica', '#implantesdentarios', '#abobahia']),
    refs: ['thoma2014'], fonte: 'Fato institucional comprovado por fotografia enviada (apresentação no Meeting Acadêmico ABO-BA).',
    postagem: 'Publique 2 a 3 dias após a publicação 12. Se desejar, marque o perfil do evento (@laabo.bahia), conforme aparece na foto original.',
  },
  {
    n: 14, area: 'Prótese dentária', tema: 'Tipos de prótese', tom: 'escuro',
    objetivo: 'Explicar opções de reposição dentária, reforçando o tema de reabilitação oral.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Prótese dentária', title: 'Fixa, removível ou sobre implante?', sub: 'Conheça as diferenças' },
      { t: 'texto', h: 'Prótese removível', p: 'Pode ser retirada pelo paciente para higienização. Pode ser parcial, apoiada nos dentes que restam, ou total (dentadura).' },
      { t: 'texto', h: 'Prótese fixa', p: 'Cimentada sobre dentes preparados ou parafusada sobre implantes. Não é removida pelo paciente.' },
      { t: 'final', h: 'Sobre implante', p: 'Apoiada em implantes, pode substituir um dente, vários ou uma arcada inteira. A indicação depende de exames, osso disponível e expectativas.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia. Cada tipo de prótese em uma página, com título em Jost Light.',
    legenda: `Fixa, removível ou sobre implante: qual a diferença?

Prótese removível: pode ser retirada pelo paciente para limpeza. Pode ser parcial (apoiada nos dentes que restam) ou total, a conhecida dentadura.

Prótese fixa: cimentada sobre dentes preparados ou parafusada sobre implantes. O paciente não remove.

Prótese sobre implante: apoiada em implantes, pode substituir um único dente, vários dentes ou até uma arcada completa.

Não existe “a melhor prótese” para todo mundo. A indicação depende da saúde bucal e geral, da quantidade de osso, dos exames e das suas expectativas. Por isso, o planejamento é individual.

Salve para consultar depois.`,
    cta: 'Salve e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.pro, ['#implantesdentarios']),
    refs: ['gpt9'],
    postagem: 'Publique 2 a 3 dias após a publicação 13.',
  },
  {
    n: 15, area: 'Dúvidas frequentes', tema: 'Implante: as perguntas que mais ouço', tom: 'claro',
    objetivo: 'Responder objeções comuns sobre implantes (dor, indicação, tempo), aproximando o paciente do agendamento.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Dúvidas frequentes', title: 'Implante: as perguntas que mais ouço', sub: '' },
      { t: 'pergunta', h: 'Dói?', p: 'A instalação é feita com anestesia local. Algum desconforto nos dias seguintes é comum e costuma ser controlado com as orientações e medicações prescritas.' },
      { t: 'pergunta', h: 'Qualquer pessoa pode fazer?', p: 'Depende da saúde geral, do osso disponível e dos hábitos: o tabagismo, por exemplo, aumenta o risco de falha. Exames de imagem ajudam no planejamento.' },
      { t: 'pergunta', h: 'Quanto tempo leva?', p: 'Varia conforme o caso: há etapas de cicatrização e de integração ao osso. O cronograma é definido na avaliação.', final: true, cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia. Perguntas em Jost Light grande com ponto de interrogação em caramelo.',
    legenda: `Implante dentário: respondendo as perguntas que mais ouço no consultório.

Dói? A instalação é feita com anestesia local. Nos dias seguintes, algum desconforto é comum e costuma ser bem controlado com as orientações e as medicações prescritas.

Qualquer pessoa pode fazer? Depende da saúde geral, da quantidade de osso e dos hábitos. O tabagismo, por exemplo, está associado a maior taxa de falha. Exames de imagem, como a tomografia, ajudam a planejar com segurança.

Quanto tempo leva? Varia de caso para caso, porque há etapas de cicatrização e de integração do implante ao osso. O cronograma é definido na avaliação.

Ficou alguma dúvida? Pergunte nos comentários que eu respondo.`,
    cta: 'Pergunte nos comentários ou agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.imp, ['#duvidas']),
    refs: ['tyndall2012', 'chrcanovic2015', 'howe2019'],
    postagem: 'Publique 2 a 3 dias após a publicação 14. Salve também no destaque “Implantes”.',
  },
  {
    n: 16, area: 'Institucional', tema: 'Frase institucional: saúde, função e estética', tom: 'escuro',
    objetivo: 'Reforçar a filosofia de atendimento e dar respiro ao feed.',
    formato: 'Imagem única',
    pages: [{ t: 'frase', frase: 'Saúde, função e estética caminham juntas.' }],
    visual: 'Fundo ardósia com estampa do símbolo em tom próximo; frase em areia.',
    legenda: `Saúde, função e estética caminham juntas.

Um sorriso bonito precisa ser, antes de tudo, saudável e funcional. Por isso, cada plano de tratamento considera como você mastiga, fala e se sente, e não apenas a aparência dos dentes.

É assim que um resultado se torna duradouro.`,
    cta: 'Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.ro),
    refs: [], fonte: 'Conteúdo institucional (frase de posicionamento da marca).',
    postagem: 'Publique 2 a 3 dias após a publicação 15.',
  },
  {
    n: 17, area: 'Prevenção', tema: 'Escovação: o básico bem-feito', tom: 'claro',
    objetivo: 'Conteúdo prático de alto alcance para novos seguidores.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Prevenção', title: 'O básico bem-feito', sub: 'Escovação que realmente protege' },
      { t: 'texto', h: 'Creme dental com flúor', p: 'Use creme dental com 1.000 a 1.500 ppm de flúor, pelo menos duas vezes ao dia, como recomenda o Ministério da Saúde.' },
      { t: 'texto', h: 'Manual ou elétrica?', p: 'As duas funcionam. A elétrica pode remover um pouco mais de placa, mas técnica e regularidade fazem a maior diferença.' },
      { t: 'final', h: 'Troque a escova', p: 'Cerdas gastas limpam menos. Substitua a escova a cada 3 a 4 meses, ou antes, se as cerdas estiverem abertas.', cta: 'Salve este post' },
    ],
    visual: 'Capa em areia. Internas em off-white com números grandes em caramelo.',
    legenda: `Prevenção começa com o básico bem-feito.

• Creme dental com flúor: use um creme dental com 1.000 a 1.500 ppm de flúor (a concentração vem na embalagem), pelo menos duas vezes ao dia.
• Manual ou elétrica? As duas funcionam. Estudos mostram que a escova elétrica pode remover um pouco mais de placa, mas a técnica e a regularidade fazem a maior diferença.
• Troque a escova a cada 3 a 4 meses, ou antes, se as cerdas estiverem abertas.

E não se esqueça da limpeza entre os dentes!

Confere aí: quando foi a última vez que você trocou sua escova?`,
    cta: 'Salve e compartilhe com a família.',
    hashtags: tags(H.base, H.prev, ['#escovacao']),
    refs: ['ms2009', 'walsh2019', 'yaacob2014', 'ada'],
    postagem: 'Publique 2 a 3 dias após a publicação 16.',
  },
  {
    n: 18, area: 'Reabilitação oral', tema: 'Perdi um dente: preciso repor?', tom: 'escuro',
    objetivo: 'Mostrar as consequências da perda dentária e a importância da reabilitação.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Reabilitação oral', title: 'Perdi um dente. Preciso repor?', sub: '' },
      { t: 'texto', h: 'O osso muda', p: 'Após uma extração, o osso da região passa por remodelação. Um estudo clínico observou redução de cerca de metade da largura do rebordo em 12 meses.' },
      { t: 'texto', h: 'O dia a dia também', p: 'A perda dentária está associada a pior qualidade de vida relacionada à saúde bucal, com impacto na mastigação, na fala e na autoestima.' },
      { t: 'final', h: 'Avalie as opções', p: 'Implantes, próteses fixas ou removíveis: a melhor solução depende do seu caso. Quanto antes a avaliação, mais opções costumam existir.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia. Internas em off-white.',
    legenda: `Perdeu um dente e está pensando se vale a pena repor? Vale entender o que acontece depois.

Após uma extração, o osso da região passa por remodelação. Um estudo clínico acompanhou pacientes por 12 meses e observou redução de cerca de metade da largura do rebordo ósseo, com a maior parte acontecendo nos primeiros meses.

Além disso, a perda dentária está associada a pior qualidade de vida relacionada à saúde bucal, com impacto na mastigação, na fala e na autoestima.

Existem diferentes formas de reabilitar: implantes, próteses fixas ou removíveis. A melhor escolha depende de cada caso, e quanto antes a avaliação, mais opções costumam estar disponíveis.`,
    cta: 'Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.ro),
    refs: ['schropp2003', 'tan2012', 'gerritsen2010'],
    postagem: 'Publique 2 a 3 dias após a publicação 17.',
  },
  {
    n: 19, area: 'Autoridade profissional', tema: 'Rotina de consultório', tom: 'claro',
    objetivo: 'Humanizar o perfil com uma foto espontânea e próxima.',
    formato: 'Imagem única (fotografia)',
    pages: [{ t: 'foto', foto: 'consultorio_scrubs', kicker: 'Rotina', frase: 'Leveza no atendimento. Rigor na técnica.' }],
    visual: 'Fotografia da Dra. sorrindo no consultório, moldura off-white e frase curta.',
    legenda: `Leveza no atendimento. Rigor na técnica.

Ir ao dentista não precisa ser tenso. Gosto de receber cada paciente com calma, explicar o que vamos fazer e respeitar o tempo de cada um.

E, por trás da leveza, existe muito cuidado com biossegurança, planejamento e técnica.

Me conta: o que deixa você mais tranquilo(a) em uma consulta?`,
    cta: 'Responda nos comentários e agende pelo link da bio.',
    hashtags: tags(H.base, ['#rotinadedentista', '#atendimentohumanizado']),
    refs: [], fonte: 'Conteúdo institucional (fotografia da profissional).',
    postagem: 'Publique 2 a 3 dias após a publicação 18.',
  },
  {
    n: 20, area: 'Cirurgia odontológica', tema: 'Antes da cirurgia: o que contar à dentista', tom: 'escuro',
    objetivo: 'Educar sobre segurança cirúrgica e reforçar a atuação em cirurgia.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Cirurgia oral', title: 'Antes da cirurgia, conte tudo', sub: 'Informações que tornam o procedimento mais seguro' },
      { t: 'texto', h: 'Medicamentos', p: 'Informe todos os remédios que usa, principalmente anticoagulantes e antiagregantes (como o AAS). Nunca suspenda nenhum por conta própria.' },
      { t: 'lista', h: 'Saúde geral', items: ['Doenças como diabetes e hipertensão', 'Alergias a medicamentos ou anestésicos', 'Gestação ou suspeita de gestação'] },
      { t: 'final', h: 'Hábitos', p: 'O tabagismo está associado a mais complicações em procedimentos como implantes. Uma conversa sincera torna tudo mais seguro.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia; internas em off-white com lista.',
    legenda: `Vai fazer uma cirurgia odontológica? Conte tudo para a sua dentista.

• Medicamentos: informe todos os que você usa, especialmente anticoagulantes e antiagregantes plaquetários (como o AAS). Nunca suspenda um medicamento por conta própria: essa decisão é tomada com o seu médico, quando necessária.
• Saúde geral: diabetes, hipertensão, alergias e gestação mudam o planejamento.
• Hábitos: o tabagismo está associado a mais complicações em procedimentos como os implantes.

Essas informações não são burocracia: elas tornam o procedimento mais seguro e previsível.`,
    cta: 'Salve e chame no WhatsApp pelo link da bio para agendar sua avaliação.',
    hashtags: tags(H.base, H.cir, ['#segurancadopaciente']),
    refs: ['sdcep2015', 'chrcanovic2015'],
    postagem: 'Publique 2 a 3 dias após a publicação 19.',
  },
  {
    n: 21, area: 'Dentística restauradora', tema: 'Restauração tem prazo de validade?', tom: 'claro',
    objetivo: 'Esclarecer sobre durabilidade de restaurações e estimular avaliações periódicas.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Restaurações', title: 'Restauração tem prazo de validade?', sub: '' },
      { t: 'texto', h: 'Elas podem durar anos', p: 'Restaurações em resina bem indicadas e bem executadas podem ter boa longevidade. Mas não são eternas.' },
      { t: 'lista', h: 'O que influencia', items: ['Risco de cárie de cada pessoa', 'Hábitos como ranger ou apertar os dentes', 'Tamanho da restauração', 'Higiene e acompanhamento'] },
      { t: 'final', h: 'Sinais para avaliar', p: 'Fraturas, manchas na borda, sensibilidade ou comida prendendo. Nem toda restauração antiga precisa ser trocada: a avaliação decide.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia. Lista com fios caramelo.',
    legenda: `Restauração dura para sempre? Não, mas pode durar muitos anos.

Revisões científicas mostram que restaurações em resina bem indicadas e bem executadas têm boa longevidade. O tempo de vida depende principalmente de fatores do próprio paciente: risco de cárie, hábitos como ranger ou apertar os dentes, tamanho da restauração e qualidade da higiene.

Fique atento(a) a fraturas, manchas na borda, sensibilidade ou comida prendendo. E lembre-se: nem toda restauração antiga precisa ser trocada. Quem decide é a avaliação clínica.`,
    cta: 'Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.den),
    refs: ['opdam2014', 'demarco2012'],
    postagem: 'Publique 2 a 3 dias após a publicação 20.',
  },
  {
    n: 22, area: 'Periodontia / saúde gengival', tema: 'Diabetes e gengiva', tom: 'escuro',
    objetivo: 'Alcançar um público amplo (pessoas com diabetes e familiares) com informação baseada em consenso científico.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Saúde gengival', title: 'Diabetes e gengiva: via de mão dupla', sub: '' },
      { t: 'texto', h: 'O diabetes afeta a gengiva', p: 'O diabetes, principalmente quando descompensado, aumenta o risco e a gravidade da periodontite.' },
      { t: 'texto', h: 'E a gengiva afeta o diabetes', p: 'A periodontite pode dificultar o controle glicêmico. O tratamento periodontal está associado a uma melhora modesta da glicemia.' },
      { t: 'final', h: 'Cuidado integrado', p: 'Se você tem diabetes, conte à sua dentista e mantenha avaliações regulares. Médico e dentista podem trabalhar juntos.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia. Setas finas em caramelo indicando a relação bidirecional.',
    legenda: `Diabetes e saúde da gengiva: uma via de mão dupla.

Segundo consenso da Federação Internacional de Diabetes com a Federação Europeia de Periodontia, o diabetes (principalmente quando descompensado) aumenta o risco e a gravidade da periodontite.

E o caminho inverso também existe: a periodontite pode dificultar o controle da glicemia, e o tratamento periodontal está associado a uma melhora modesta do controle glicêmico.

Se você tem diabetes, informe sempre à sua dentista e mantenha consultas regulares. Compartilhe com alguém que precisa saber disso.`,
    cta: 'Compartilhe e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.per, ['#diabetes']),
    refs: ['sanz2018'],
    postagem: 'Publique 2 a 3 dias após a publicação 21. Uma boa data é 14 de novembro (Dia Mundial do Diabetes).',
  },
  {
    n: 23, area: 'Implantes / reabilitação', tema: 'A gengiva ao redor do implante', tom: 'claro',
    objetivo: 'Conectar a apresentação científica da Dra. a um conteúdo educativo de reabilitação com implantes.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Implantes', title: 'A gengiva ao redor do implante importa', sub: '' },
      { t: 'texto', h: 'Mais que o parafuso', p: 'Ao redor do implante existe um tecido mole que protege a região, assim como a gengiva protege os dentes.' },
      { t: 'texto', h: 'Enxerto de tecido conjuntivo', p: 'Quando esse tecido é fino ou insuficiente, um enxerto, geralmente retirado do próprio palato do paciente, pode aumentar sua espessura.' },
      { t: 'final', h: 'Por que isso importa', p: 'Um tecido mais espesso pode favorecer a estética e a higienização da região. A indicação é sempre individual.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia. Internas em off-white.',
    legenda: `No implante, não é só o parafuso que importa.

Ao redor do implante existe um tecido mole, a mucosa peri-implantar, que funciona como uma barreira de proteção, assim como a gengiva protege os dentes naturais.

Quando esse tecido é fino ou insuficiente, pode ser indicado um enxerto de tecido conjuntivo, geralmente retirado do próprio palato do paciente. Revisões científicas mostram que esse tipo de procedimento aumenta a espessura do tecido, o que pode favorecer a estética e a higienização da região.

Esse foi o tema do trabalho que apresentei no Meeting Acadêmico da ABO-Bahia. 🤍`,
    cta: 'Quer saber se é o seu caso? Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.imp, ['#enxertogengival']),
    refs: ['thoma2014', 'berglundh2018'],
    postagem: 'Publique 2 a 3 dias após a publicação 22.',
  },
  {
    n: 24, area: 'Institucional', tema: 'Propósito', tom: 'escuro',
    objetivo: 'Criar conexão emocional com retrato profissional elegante.',
    formato: 'Imagem única (fotografia)',
    pages: [{ t: 'foto', foto: 'estudio', kicker: 'Propósito', frase: 'Cuidar de sorrisos é cuidar de histórias.' }],
    visual: 'Retrato em estúdio com fundo escuro, moldura ardósia e frase em areia.',
    legenda: `Cuidar de sorrisos é cuidar de histórias.

Cada pessoa que chega ao consultório traz uma história: um dente perdido que mudou a forma de sorrir, um medo antigo de dentista, uma dor que foi sendo adiada.

Meu papel é acolher essa história com respeito e transformar o cuidado em algo leve, seguro e bem planejado.

Obrigada por estar aqui. 🤍`,
    cta: 'Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, ['#cirurgiadentista', '#proposito']),
    refs: [], fonte: 'Conteúdo institucional (fotografia da profissional).',
    postagem: 'Publique 2 a 3 dias após a publicação 23.',
  },
  {
    n: 25, area: 'Mitos e verdades', tema: 'Implante: mitos e verdades', tom: 'claro',
    objetivo: 'Desfazer medos sobre implantes e reforçar a importância da manutenção.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Mitos e verdades', title: 'Implante: mitos e verdades', sub: '' },
      { t: 'mito', tag: 'Mito', h: '“O corpo rejeita o implante como um órgão.”', p: 'O implante não sofre rejeição como um transplante: ele se integra ao osso. Quando há falha, outros fatores estão envolvidos.' },
      { t: 'mito', tag: 'Mito', h: '“Implante não precisa de cuidados.”', p: 'Os tecidos ao redor do implante podem inflamar (mucosite e peri-implantite). Higiene diária e manutenção são indispensáveis.' },
      { t: 'mito', tag: 'Verdade', h: '“Fumar aumenta o risco de falha.”', p: 'Revisões científicas mostram maior taxa de falha de implantes em fumantes.', final: true, cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia. Selos “MITO” e “VERDADE” em caramelo escuro.',
    legenda: `Implante dentário: mitos e verdades.

“O corpo pode rejeitar o implante como um órgão.” MITO. O implante não sofre rejeição imunológica como em um transplante: ele se integra ao osso por osseointegração. Quando há falha, ela está ligada a outros fatores, como infecção, hábitos e condições de saúde.

“Implante não precisa de cuidados.” MITO. Os tecidos ao redor do implante podem inflamar (mucosite e peri-implantite). Higiene diária e consultas de manutenção são indispensáveis.

“Fumar aumenta o risco de falha.” VERDADE. Revisões científicas mostram maior taxa de falha de implantes em fumantes.

Salve e compartilhe com quem está pensando em fazer implante.`,
    cta: 'Salve, compartilhe e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.imp, ['#mitoseverdades']),
    refs: ['albrektsson1981', 'berglundh2018', 'herrera2023', 'chrcanovic2015'],
    postagem: 'Publique 2 a 3 dias após a publicação 24.',
  },
  {
    n: 26, area: 'Prevenção', tema: 'Açúcar: a frequência importa', tom: 'escuro',
    objetivo: 'Conteúdo de prevenção com recomendação oficial da OMS.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Prevenção', title: 'Açúcar: a frequência importa', sub: '' },
      { t: 'texto', h: 'A cada consumo', p: 'Depois que você consome açúcar, a placa produz ácidos por um tempo. Beliscar doces ao longo do dia prolonga esse ataque ao esmalte.' },
      { t: 'texto', h: 'A recomendação da OMS', p: 'Limitar os açúcares livres a menos de 10% das calorias diárias, e idealmente a menos de 5%, traz benefícios adicionais.' },
      { t: 'lista', h: 'Na prática', items: ['Prefira o doce junto às refeições', 'Atenção a sucos, refrigerantes e cafés adoçados', 'Água entre as refeições'], final: true, cta: 'Salve este post' },
    ],
    visual: 'Capa em ardósia. Internas em off-white.',
    legenda: `Quando o assunto é cárie, não importa só quanto açúcar você consome, mas também com que frequência.

Depois de cada consumo de açúcar, as bactérias da placa produzem ácidos por um período. Quando beliscamos doces ao longo do dia, esse ataque ao esmalte se repete muitas vezes.

A Organização Mundial da Saúde recomenda limitar os açúcares livres a menos de 10% das calorias diárias e sugere que reduzir para menos de 5% traz benefícios adicionais.

Na prática:
• prefira o doce junto às refeições;
• atenção a sucos, refrigerantes e cafés adoçados;
• água entre as refeições.`,
    cta: 'Salve e compartilhe com a família.',
    hashtags: tags(H.base, H.prev, ['#carie']),
    refs: ['who2015', 'pitts2017'],
    postagem: 'Publique 2 a 3 dias após a publicação 25.',
  },
  {
    n: 27, area: 'Cuidados pós-procedimento', tema: 'Rotina de cuidados com o implante', tom: 'claro',
    objetivo: 'Orientar pacientes com implante e mostrar acompanhamento a longo prazo.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Cuidados', title: 'Seu implante precisa de rotina', sub: '' },
      { t: 'texto', h: 'Higiene diária', p: 'Escove com cuidado a região do implante e use os acessórios indicados, como escova interdental ou fio específico.' },
      { t: 'lista', h: 'Sinais de alerta', items: ['Sangramento ao redor do implante', 'Inchaço ou vermelhidão', 'Desconforto ao mastigar', 'Sensação de mobilidade'] },
      { t: 'final', h: 'Manutenção profissional', p: 'Consultas periódicas permitem identificar e tratar alterações cedo. A frequência é definida conforme o seu risco.', cta: 'Agende sua manutenção' },
    ],
    visual: 'Capa em areia. Lista de sinais com marcadores finos.',
    legenda: `Fez implante? Ele precisa de rotina, assim como os seus dentes.

Higiene diária: escove com cuidado a região do implante e use os acessórios indicados para você, como escova interdental ou fio específico.

Sinais de alerta: sangramento ao redor do implante, inchaço, vermelhidão, desconforto ao mastigar ou sensação de mobilidade. Se notar algum deles, procure avaliação.

Manutenção profissional: a diretriz europeia para prevenção das doenças peri-implantares recomenda acompanhamento periódico, com frequência definida conforme o risco de cada paciente.

O implante é um investimento na sua saúde. Cuide bem dele.`,
    cta: 'Agende sua consulta de manutenção pelo link da bio.',
    hashtags: tags(H.base, H.imp, ['#periimplantite']),
    refs: ['herrera2023', 'berglundh2018'],
    postagem: 'Publique 2 a 3 dias após a publicação 26.',
  },
  {
    n: 28, area: 'Importância da avaliação', tema: 'Por que ir ao dentista sem dor?', tom: 'escuro',
    objetivo: 'Estimular consultas preventivas, principal porta de entrada de novos pacientes.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Avaliação', title: 'Por que ir ao dentista sem dor?', sub: '' },
      { t: 'texto', h: 'Diagnóstico precoce', p: 'Muitos problemas bucais são silenciosos no início. Detectá-los cedo costuma permitir tratamentos mais simples.' },
      { t: 'texto', h: 'Qual a frequência ideal?', p: 'Não existe um intervalo único para todos. Diretrizes recomendam definir a frequência pelo risco individual de cada paciente.' },
      { t: 'lista', h: 'Na consulta de rotina', items: ['Exame de dentes, gengiva e mucosas', 'Avaliação de restaurações e próteses', 'Orientações personalizadas de higiene'], final: true, cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia. Internas em off-white.',
    legenda: `Por que ir ao dentista se não está doendo nada?

Porque muitos problemas bucais são silenciosos no início, e encontrá-los cedo costuma permitir tratamentos mais simples.

E a frequência ideal? Não existe um intervalo único para todo mundo. Diretrizes recomendam que o intervalo entre as consultas seja definido pelo risco individual de cada paciente: há quem precise voltar em poucos meses e há quem possa esperar mais.

Na consulta de rotina, avaliamos dentes, gengiva e mucosas, conferimos restaurações e próteses e ajustamos as orientações de higiene para você.

Quando foi a sua última avaliação?`,
    cta: 'Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.prev, ['#checkup']),
    refs: ['nice2004', 'riley2013'],
    postagem: 'Publique 2 a 3 dias após a publicação 27.',
  },
  {
    n: 29, area: 'Prótese dentária', tema: 'Cuidados com a prótese removível', tom: 'claro',
    objetivo: 'Orientar usuários de prótese removível, público importante em reabilitação oral.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Prótese dentária', title: 'Cuidados com a prótese removível', sub: '' },
      { t: 'texto', h: 'Limpe todos os dias', p: 'Retire a prótese e limpe com escova própria e produto não abrasivo. Produtos abrasivos podem riscar o material.' },
      { t: 'texto', h: 'À noite', p: 'Em geral, recomenda-se não dormir com a prótese, para o descanso dos tecidos. Guarde-a limpa, em recipiente com água.' },
      { t: 'final', h: 'Revisões periódicas', p: 'Com o tempo, a boca muda e a prótese pode perder a adaptação. Feridas, folgas ou dor são motivos para avaliação.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia. Internas em off-white.',
    legenda: `Usa prótese removível? Estes cuidados fazem diferença:

• Limpeza diária: retire a prótese e limpe com escova própria e produto não abrasivo. Produtos abrasivos podem riscar o material e facilitar o acúmulo de placa.
• À noite: em geral, a recomendação é não dormir com a prótese, para permitir o descanso dos tecidos da boca. Guarde-a limpa, em um recipiente com água.
• Revisões periódicas: com o tempo, a boca muda e a prótese pode perder a adaptação. Feridas, folgas ou dor são sinais de que é hora de avaliar.

Siga sempre as orientações específicas para a sua prótese.

Compartilhe com alguém da família que usa prótese.`,
    cta: 'Compartilhe e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.pro, ['#dentadura']),
    refs: ['felton2011'],
    postagem: 'Publique 2 a 3 dias após a publicação 28.',
  },
  {
    n: 30, area: 'Saúde bucal', tema: 'O cigarro e a sua boca', tom: 'escuro',
    objetivo: 'Conteúdo de saúde pública que relaciona periodontia, implantes e prevenção do câncer bucal.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Saúde bucal', title: 'O cigarro e a sua boca', sub: '' },
      { t: 'texto', h: 'Gengiva', p: 'O tabagismo é um importante fator de risco para a periodontite, a doença que destrói os tecidos de suporte dos dentes.' },
      { t: 'texto', h: 'Implantes', p: 'Fumantes apresentam maior taxa de falha de implantes dentários, segundo revisões científicas.' },
      { t: 'final', h: 'Câncer de boca', p: 'O tabaco é um dos principais fatores de risco para o câncer de boca. Parar de fumar traz benefícios à saúde em qualquer fase da vida.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia. Internas em off-white.',
    legenda: `O cigarro afeta a sua boca de várias formas.

Gengiva: o tabagismo é um importante fator de risco para a periodontite, a doença que destrói os tecidos de suporte dos dentes.

Implantes: revisões científicas mostram maior taxa de falha de implantes dentários em fumantes.

Câncer de boca: segundo o Instituto Nacional de Câncer (INCA), o tabagismo é um dos principais fatores de risco para o câncer de boca.

Parar de fumar traz benefícios à saúde em qualquer fase da vida. Se você está nesse processo, conte com apoio profissional. O SUS oferece tratamento gratuito para quem quer parar de fumar.`,
    cta: 'Compartilhe com alguém que precisa ler isso.',
    hashtags: tags(H.base, H.per, ['#tabagismo']),
    refs: ['leite2018', 'chrcanovic2015', 'inca'],
    postagem: 'Publique 2 a 3 dias após a publicação 29.',
  },
  {
    n: 31, area: 'Institucional', tema: 'Frase institucional: sem pressa, com planejamento', tom: 'claro',
    objetivo: 'Reforçar valores e criar respiro visual claro no feed.',
    formato: 'Imagem única',
    pages: [{ t: 'frase', frase: 'Sem pressa. Com planejamento.' }],
    visual: 'Fundo areia, símbolo em caramelo escuro, frase em ardósia.',
    legenda: `Sem pressa. Com planejamento.

Tratamentos odontológicos bem-feitos respeitam etapas: avaliação, exames, explicação das opções, execução e acompanhamento.

Pular etapas pode até parecer mais rápido, mas é o planejamento que traz segurança e resultados que duram.`,
    cta: 'Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, ['#planejamento', '#reabilitacaooral']),
    refs: [], fonte: 'Conteúdo institucional (frase de posicionamento da marca).',
    postagem: 'Publique 2 a 3 dias após a publicação 30.',
  },
  {
    n: 32, area: 'Dentística restauradora', tema: 'Dente sensível ao gelado', tom: 'escuro',
    objetivo: 'Responder uma queixa muito comum e incentivar o diagnóstico.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Sensibilidade', title: 'Dente sensível ao gelado?', sub: '' },
      { t: 'texto', h: 'Por que acontece', p: 'Quando a dentina fica exposta, por retração da gengiva ou desgaste, estímulos como frio e doce chegam mais facilmente ao interior do dente.' },
      { t: 'texto', h: 'Atenção ao diagnóstico', p: 'Cárie, fraturas e restaurações com falhas causam sintomas parecidos. Por isso, a sensibilidade precisa ser avaliada.' },
      { t: 'final', h: 'Tem tratamento', p: 'Cremes dentais dessensibilizantes, ajuste de hábitos e procedimentos em consultório podem ajudar, conforme a causa.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia. Internas em off-white.',
    legenda: `Aquela pontada ao tomar algo gelado tem explicação.

A sensibilidade dentinária acontece quando a dentina, camada abaixo do esmalte, fica exposta, seja por retração da gengiva ou por desgaste. Assim, estímulos como frio, calor e doce chegam com mais facilidade ao interior do dente.

Mas atenção: cárie, fraturas e restaurações com falhas podem causar sintomas parecidos. Por isso, o diagnóstico é importante antes de qualquer tratamento.

Dependendo da causa, cremes dentais dessensibilizantes, ajuste de hábitos e procedimentos feitos em consultório podem ajudar.`,
    cta: 'Sente sensibilidade? Agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.den, ['#sensibilidadedental']),
    refs: ['cabdh2003'],
    postagem: 'Publique 2 a 3 dias após a publicação 31.',
  },
  {
    n: 33, area: 'Saúde bucal', tema: 'Bruxismo: apertar ou ranger os dentes', tom: 'claro',
    objetivo: 'Gerar identificação com um problema comum e conectar com proteção de dentes e restaurações.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Bruxismo', title: 'Você aperta ou range os dentes?', sub: '' },
      { t: 'texto', h: 'O que é', p: 'Bruxismo é a atividade repetitiva dos músculos da mandíbula, apertando ou rangendo os dentes. Pode acontecer durante o sono ou acordado.' },
      { t: 'lista', h: 'Sinais comuns', items: ['Desgaste nos dentes', 'Dor ou cansaço na face ao acordar', 'Fraturas em dentes ou restaurações'] },
      { t: 'final', h: 'Proteja seus dentes', p: 'A avaliação identifica os sinais e define a conduta, que pode incluir placa de proteção e acompanhamento.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em areia. Internas em off-white.',
    legenda: `Você acorda com a face cansada ou percebe que aperta os dentes durante o dia?

Segundo o consenso internacional, bruxismo é a atividade repetitiva dos músculos da mandíbula, caracterizada por apertar ou ranger os dentes. Ele pode acontecer durante o sono ou em vigília (acordado).

Sinais comuns: desgaste nos dentes, dor ou cansaço na face ao acordar e fraturas em dentes ou restaurações. O bruxismo também é um dos fatores que podem reduzir a durabilidade das restaurações.

A avaliação odontológica ajuda a identificar os sinais e definir a melhor conduta, que pode incluir placa de proteção e acompanhamento.

Marque alguém que vive apertando os dentes. 😬`,
    cta: 'Marque alguém e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, ['#bruxismo', '#sorrisosaudavel']),
    refs: ['lobbezoo2018', 'opdam2014'],
    postagem: 'Publique 2 a 3 dias após a publicação 32.',
  },
  {
    n: 34, area: 'Prevenção', tema: 'Autoexame da boca', tom: 'escuro',
    objetivo: 'Conteúdo de utilidade pública (prevenção do câncer de boca) com alto potencial de compartilhamento.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Prevenção', title: 'Autoexame da boca: 2 minutos que importam', sub: '' },
      { t: 'texto', h: 'Observe com atenção', p: 'Em frente ao espelho e com boa luz, examine lábios, gengivas, bochechas, língua (inclusive embaixo), céu da boca e pescoço.' },
      { t: 'lista', h: 'Sinais de alerta', items: ['Feridas que não cicatrizam em 15 dias', 'Manchas brancas ou vermelhas', 'Caroços ou nódulos', 'Dificuldade para mastigar ou engolir'] },
      { t: 'final', h: 'Procure avaliação', p: 'O autoexame não substitui a consulta. Na avaliação odontológica, as mucosas também são examinadas.', cta: 'Agende sua avaliação' },
    ],
    visual: 'Capa em ardósia. Internas em off-white.',
    legenda: `Dois minutos em frente ao espelho podem fazer diferença.

O autoexame da boca ajuda a perceber alterações cedo. Com boa iluminação, observe lábios, gengivas, a parte interna das bochechas, a língua (inclusive embaixo), o céu da boca e apalpe o pescoço.

Segundo o INCA, alguns sinais merecem atenção:
• feridas que não cicatrizam em 15 dias;
• manchas brancas ou vermelhas;
• caroços ou nódulos;
• dificuldade para mastigar ou engolir.

O autoexame não substitui a consulta. Na avaliação odontológica, todas as mucosas da boca também são examinadas.

Compartilhe: essa informação pode ajudar alguém.`,
    cta: 'Compartilhe e agende sua avaliação pelo link da bio.',
    hashtags: tags(H.base, H.prev, ['#cancerdeboca']),
    refs: ['inca', 'who2022'],
    postagem: 'Publique 2 a 3 dias após a publicação 33.',
  },
  {
    n: 35, area: 'Institucional', tema: 'Como é a primeira consulta', tom: 'claro',
    objetivo: 'Reduzir a insegurança de quem ainda não é paciente e conduzir ao agendamento.',
    formato: 'Carrossel (4 páginas)',
    pages: [
      { t: 'capa', kicker: 'Agendamento', title: 'Como é a primeira consulta', sub: 'Sem pressa, com clareza' },
      { t: 'passo', num: '01', h: 'Escuta', p: 'Conversamos sobre sua história, queixas, saúde geral e expectativas. É o ponto de partida do plano.' },
      { t: 'passo', num: '02', h: 'Avaliação', p: 'Exame clínico de dentes, gengiva e mucosas e, quando necessário, solicitação de exames de imagem.' },
      { t: 'passo', num: '03', h: 'Plano de tratamento', p: 'Você recebe as opções explicadas com clareza, com etapas e cuidados. A decisão é sempre compartilhada.', final: true, cta: 'Agende pelo WhatsApp' },
    ],
    visual: 'Capa em areia. Páginas em formato de passo a passo (01, 02, 03) com números grandes em caramelo.',
    legenda: `Ainda não me conhece pessoalmente? Veja como é a primeira consulta:

01 · Escuta: conversamos sobre sua história, suas queixas, sua saúde geral e o que você espera do tratamento.

02 · Avaliação: exame clínico de dentes, gengiva e mucosas e, quando necessário, solicitação de exames de imagem.

03 · Plano de tratamento: você recebe as opções explicadas com clareza, com etapas, prazos e cuidados. A decisão é sempre compartilhada.

Será um prazer receber você. 🤍`,
    cta: 'Agende sua avaliação pelo WhatsApp: link na bio.',
    hashtags: tags(H.base, ['#primeiraconsulta', '#cirurgiadentista', '#reabilitacaooral']),
    refs: [], fonte: 'Conteúdo institucional: fluxo de atendimento. Revise com a Dra. se corresponde exatamente à rotina dela.',
    postagem: 'Publique 2 a 3 dias após a publicação 34. Fecha o primeiro ciclo de conteúdo.',
  },
];

// ---------------------------------------------------------------------
// 6 BIOGRAFIAS (limite do Instagram: 150 caracteres)
// ---------------------------------------------------------------------
const BIOS = [
  { titulo: 'Clássica e completa', texto: 'Cirurgiã-Dentista | CRO-BA 32044\nReabilitação oral, implantes, cirurgias e restaurações\nTécnica, cuidado e escuta\n↓ Agende sua avaliação' },
  { titulo: 'Foco em reabilitação', texto: 'Devolvendo saúde, função e confiança ao seu sorriso\nReabilitação oral • Implantes • Cirurgias\nCRO-BA 32044\n↓ Agende pelo WhatsApp' },
  { titulo: 'Acolhedora', texto: 'Odontologia com técnica e acolhimento 🤍\nImplantes, cirurgias, extrações e restaurações\nCRO-BA 32044\n↓ Agende sua consulta' },
  { titulo: 'Objetiva', texto: 'Cirurgiã-Dentista • CRO-BA 32044\nImplantes | Cirurgias | Restaurações\nReabilitação oral com planejamento\n↓ Avaliação pelo WhatsApp' },
  { titulo: 'Educativa', texto: 'Cirurgiã-Dentista | CRO-BA 32044\nConteúdo sobre reabilitação oral, implantes e saúde bucal\nAtendimento com planejamento\n↓ Agende aqui' },
  { titulo: 'Com assinatura de marca', texto: 'Saúde • Função • Estética\nReabilitação oral, implantes e cirurgias\nCirurgiã-Dentista | CRO-BA 32044\n↓ Agende sua avaliação' },
];
const BIO_RECOMENDADA = 0;
const NOME_PERFIL = 'Dra. Tatiane Aislan | Dentista';

// ---------------------------------------------------------------------
// 7 DESTAQUES
// ---------------------------------------------------------------------
const DESTAQUES = [
  { nome: 'Sobre mim', icone: 'pessoa', conteudo: 'Story 01 (apresentação), publicação 01, bastidores e a formação (UNIME).' },
  { nome: 'Procedimentos', icone: 'dente', conteudo: 'Cirurgias, extrações, restaurações e implantes: um story por procedimento.' },
  { nome: 'Reabilitação', icone: 'reabilitacao', conteudo: 'Story 05, publicações 03, 14, 18 e 29 repostadas nos stories.' },
  { nome: 'Implantes', icone: 'implante', conteudo: 'Story 06 (quiz), publicações 08, 15, 23, 25 e 27 repostadas.' },
  { nome: 'Resultados', icone: 'resultados', conteudo: 'Casos reais com os elementos de antes e depois, SOMENTE com autorização escrita do paciente (CFO).' },
  { nome: 'Dúvidas', icone: 'duvidas', conteudo: 'Respostas da caixinha de perguntas (story 03), publicações 05, 10 e 15.' },
  { nome: 'Contato', icone: 'contato', conteudo: 'Story 10 (agendamento), endereço, horários e link do WhatsApp.' },
];

// ---------------------------------------------------------------------
// 10 STORIES
// ---------------------------------------------------------------------
const STORIES = [
  { n: 1, tema: 'Apresentação', tom: 'foto', foto: 'selfie_jaleco', kicker: 'Prazer!', titulo: 'Eu sou a Dra. Tatiane Aislan', texto: 'Cirurgiã-dentista. Aqui você encontra conteúdo sobre reabilitação oral, implantes e saúde bucal.', interacao: 'Figurinha de “Perguntas”: “Me conta: o que você quer saber sobre seu sorriso?”', cta: 'Deslize para conhecer o perfil' },
  { n: 2, tema: 'Curiosidade odontológica', tom: 'escuro', kicker: 'Você sabia?', titulo: 'O esmalte é o tecido mais duro do corpo humano.', texto: 'Mesmo assim, ele pode ser desmineralizado pelos ácidos produzidos a partir do açúcar. Por isso a prevenção é diária.', interacao: 'Figurinha de reação (emoji deslizante 😮).', cta: 'Salve e compartilhe' },
  { n: 3, tema: 'Pergunta frequente', tom: 'claro', kicker: 'Caixinha de perguntas', titulo: 'Qual é a sua dúvida sobre implantes?', texto: 'Respondo as perguntas aqui nos stories durante a semana.', interacao: 'Figurinha de “Perguntas” posicionada no espaço livre central.', cta: 'Envie sua pergunta', espacoInteracao: true },
  { n: 4, tema: 'Enquete educativa', tom: 'escuro', kicker: 'Enquete', titulo: 'Sua gengiva sangra quando você escova os dentes?', texto: 'Responda com sinceridade. No próximo story, eu explico o que isso pode significar.', interacao: 'Figurinha de “Enquete”: “Sim” / “Às vezes” / “Não”. No story seguinte, repostar a publicação 06.', cta: 'Vote na enquete', espacoInteracao: true },
  { n: 5, tema: 'Reabilitação oral', tom: 'claro', kicker: 'Reabilitação oral', titulo: 'Reabilitar é devolver função, conforto e confiança.', texto: 'Cada plano é único e começa com uma avaliação cuidadosa.', interacao: 'Figurinha de link para a publicação 03.', cta: 'Veja o post completo' },
  { n: 6, tema: 'Implantes (quiz)', tom: 'escuro', kicker: 'Quiz', titulo: 'O corpo pode rejeitar o implante como um órgão transplantado?', texto: 'Resposta: não. O implante se integra ao osso (osseointegração). Quando há falha, outros fatores estão envolvidos.', interacao: 'Figurinha de “Quiz”: “Sim” / “Não” (resposta correta: Não). A resposta aparece no texto: publique primeiro só o título e repita o story com o texto.', cta: 'Responda o quiz', espacoInteracao: true },
  { n: 7, tema: 'Saúde gengival', tom: 'claro', kicker: 'Saúde gengival', titulo: '3 sinais de alerta na gengiva', lista: ['Sangramento ao escovar', 'Gengiva vermelha ou inchada', 'Dentes “mais compridos” ou com mobilidade'], interacao: 'Figurinha de reação (emoji deslizante).', cta: 'Agende sua avaliação' },
  { n: 8, tema: 'Bastidores profissionais', tom: 'foto', foto: 'bastidor_touca', kicker: 'Bastidores', titulo: 'Dia de cirurgia', texto: 'Biossegurança, planejamento e atenção a cada detalhe.', interacao: 'Figurinha de música suave ou de localização do consultório.', cta: 'Acompanhe os bastidores' },
  { n: 9, tema: 'Orientação preventiva', tom: 'escuro', kicker: 'Dica rápida', titulo: 'Troque sua escova a cada 3 a 4 meses', texto: 'Ou antes, se as cerdas estiverem abertas. Cerdas gastas limpam menos.', interacao: 'Figurinha de enquete: “Já troquei” / “Vou trocar hoje”.', cta: 'Lembre alguém', espacoInteracao: true },
  { n: 10, tema: 'Chamada para agendamento', tom: 'claro', kicker: 'Agenda aberta', titulo: 'Agende sua avaliação', texto: 'Atendimento com técnica, cuidado e escuta.', interacao: 'Figurinha de LINK com o endereço do WhatsApp (wa.me/5571992206132), texto do link: “Agendar pelo WhatsApp”.', cta: 'Toque no link', espacoInteracao: true },
];

module.exports = { PERFIL, REFS, POSTS, BIOS, BIO_RECOMENDADA, NOME_PERFIL, DESTAQUES, STORIES };
