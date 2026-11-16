"""Consolida a base de clínicas a partir dos dados brutos coletados em 16/11/2026.

Fontes brutas (pasta RAW): CNES/DataSUS (API de dados abertos), Receita Federal via BrasilAPI,
localizador oficial da OdontoCompany, página de unidades da AmorSaúde, páginas da Oral Sin e
Odonto Excellence e classificados do CRO-BA. Gera dados/clinicas.json.
"""
import json, os, re, glob, sys, urllib.parse
from bs4 import BeautifulSoup

RAW = os.environ.get('RAW', '/tmp/claude-0/-home-user-Pasta-1/4d61b036-939b-50d5-a201-d9670eed5fff/scratchpad/raw')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dados', 'clinicas.json')
VER = '16/11/2026'

MUN = {292910: 'São Felipe', 290830: 'Conceição do Almeida', 292960: 'Sapeaçu', 291160: 'Governador Mangabeira',
       290730: 'Castro Alves', 291030: 'Dom Macedo Costa', 292220: 'Muniz Ferreira', 292230: 'Muritiba', 292250: 'Nazaré',
       292900: 'São Félix', 292240: 'Mutuípe', 292060: 'Maragogipe', 290490: 'Cachoeira', 290980: 'Cruz das Almas',
       292870: 'Santo Antônio de Jesus', 292860: 'Santo Amaro', 290100: 'Amargosa', 293290: 'Valença',
       291080: 'Feira de Santana', 291610: 'Itaparica', 293320: 'Vera Cruz'}
# Distância rodoviária aproximada a partir de São Felipe (estimativa; confirmar no mapa)
DIST = {'São Felipe': 0, 'Conceição do Almeida': 13, 'Dom Macedo Costa': 22, 'Sapeaçu': 27, 'Maragogipe': 28,
        'Santo Antônio de Jesus': 30, 'Cruz das Almas': 38, 'Muniz Ferreira': 38, 'Nazaré': 42, 'Governador Mangabeira': 48,
        'Muritiba': 52, 'São Félix': 55, 'Cachoeira': 57, 'Castro Alves': 72, 'Mutuípe': 80, 'Amargosa': 82,
        'Vera Cruz': 85, 'Itaparica': 95, 'Santo Amaro': 95, 'Valença': 105, 'Feira de Santana': 110, 'Candeias': 150,
        'Simões Filho': 170, 'Salvador': 190, 'Camaçari': 190, "Dias d'Ávila": 195, 'Lauro de Freitas': 200}
PRIORIDADE_MAX = ['São Felipe', 'Conceição do Almeida', 'Cruz das Almas', 'Santo Antônio de Jesus', 'Sapeaçu',
                  'Governador Mangabeira', 'Castro Alves', 'Dom Macedo Costa', 'Muniz Ferreira', 'Nazaré', 'Santo Amaro',
                  'Cachoeira', 'São Félix', 'Maragogipe']
CAT = {'A': 'A — Vaga confirmada', 'B': 'B — Indício forte de contratação', 'C': 'C — Prospecção estratégica',
       'D': 'D — Baixa prioridade'}
NAO = 'Não localizado'


def q(s):
    return urllib.parse.quote_plus(s)


def maps(nome, cidade):
    return f'https://www.google.com/maps/search/?api=1&query={q(nome + " " + cidade + " BA")}'


def insta_busca(nome, cidade):
    return f'https://www.google.com/search?q={q("instagram " + nome + " " + cidade + " BA odontologia")}'


def linkedin_busca(nome):
    return f'https://www.linkedin.com/search/results/all/?keywords={q(nome)}'


def tel_link(t):
    d = re.sub(r'\D', '', t or '')
    return f'tel:+55{d}' if len(d) in (10, 11) else ''


def wa_link(t):
    d = re.sub(r'\D', '', t or '')
    return f'https://wa.me/55{d}' if len(d) == 11 else ''


def fmt_tel(t):
    d = re.sub(r'\D', '', t or '')
    if len(d) == 9 and d[0] in '3':  # sem DDD
        return ''
    if len(d) == 10:
        if d[2] in '89':  # celular antigo sem o nono dígito
            d = d[:2] + '9' + d[2:]
        else:
            return f'({d[:2]}) {d[2:6]}-{d[6:]}'
    if len(d) == 11 and len(set(d[2:])) > 2:
        return f'({d[:2]}) {d[2:7]}-{d[7:]}'
    return ''


def titulo(s):
    s = (s or '').strip()
    if not s:
        return ''
    low = {'de', 'da', 'do', 'das', 'dos', 'e', 'em'}
    up = {'LTDA', 'ME', 'EPP', 'SAJ', 'CISO', 'CLIRC', 'COMEDE', 'IRCO', 'IOB', 'ARMOS', 'CLIMOD', 'COB', 'CORE', 'CMO',
          'SBO', 'MV', 'AL', 'PH', 'CTO', 'II', 'III', 'S', 'A', 'L', 'BA', 'CEO'}
    out = []
    for i, w in enumerate(s.split()):
        wl = w.lower()
        if w.upper() in up and len(w) <= 6:
            out.append(w.upper())
        elif wl in low and i > 0:
            out.append(wl)
        else:
            out.append(w[:1].upper() + w[1:].lower())
    t = ' '.join(out)
    for a, b in ACENTOS:
        t = re.sub(r'\b' + a + r'\b', b, t)
    return t


ACENTOS = [('Alianca', 'Aliança'), ('Clinica', 'Clínica'), ('Odontologica', 'Odontológica'), ('Odontologico', 'Odontológico'),
           ('Consultorio', 'Consultório'), ('Saude', 'Saúde'), ('Referencia', 'Referência'), ('Medica', 'Médica'), ('Sao', 'São'),
           ('Estetica', 'Estética'), ('S e', 'S&E'), ('Espaco', 'Espaço'), ('Rosarios', 'Rosários'), ('Araujo', 'Araújo'),
           ('Pro', 'Pró'), ('Preventica', 'Preventiva'), ('Praca', 'Praça'), ('Joao', 'João'), ('Antonio', 'Antônio'),
           ('Maceio', 'Maceió'), ('Esperanca', 'Esperança'), ('Proteses', 'Próteses'), ('Voce', 'Você'), ('Gorgonio', 'Gorgônio'),
           ('Jose', 'José'), ('Themistocles', 'Themístocles'), ('Expedicionario', 'Expedicionário'), ('Conego', 'Cônego'),
           ('Lourenco', 'Lourenço'), ('Goes', 'Góes'), ('Avenida', 'Av.'), ('Sete de Setembro', 'Sete de Setembro')]


def brapi(cnpj):
    f = os.path.join(RAW, 'brapi', f'{cnpj}.json')
    if os.path.exists(f):
        try:
            d = json.load(open(f, encoding='utf-8'))
            if d.get('razao_social'):
                return d
        except Exception:
            pass
    return {}


def socios(d):
    return [titulo(x.get('nome_socio', '')) for x in d.get('qsa', []) if x.get('nome_socio')]


ACC = re.compile(r'contab|escritorio|legaliz|contace|kontik|ricos|lider|fiscal|assessor|truks|naranf|vmascon|transvall|'
                 r'marcelocont|portolopes|tellecom|rm-telecom|abr\.|lqcont|j\.l\.n|rcontab', re.I)
GEN = {'clinica', 'odontologia', 'odontologica', 'odontologico', 'ltda', 'servicos', 'saude', 'centro', 'consultorio',
       'integrada', 'especializada', 'dentista'}


def email_ok(email, *nomes):
    e = (email or '').strip().lower().replace(' ', '')
    if '@' not in e or ACC.search(e):
        return ''
    local = re.sub(r'[^a-z]', '', e.split('@')[0])
    toks = set()
    for n in nomes:
        for w in re.findall(r'[a-zà-ú]{4,}', (n or '').lower()):
            w = re.sub(r'[^a-z]', '', w.translate(str.maketrans('áàâãéêíóôõúç', 'aaaaeeiooouc')))
            if w and w not in GEN:
                toks.add(w)
    if any(t in local for t in toks) or re.search(r'odonto|dent|sorri|oral|clin', local) or 'amorsaude' in e or 'odontocompany' in e:
        return e
    return ''


def pts_prox(km):
    if km is None:
        return 3
    for lim, p in ((15, 20), (40, 18), (60, 15), (90, 11), (130, 7)):
        if km <= lim:
            return p
    return 3


def pontuar(r):
    v = {'A': 30, 'B': 15, 'C': 6, 'D': 0}[r['categoria']]
    if r['categoria'] == 'A' and r.get('vaga_perfil') == 'parcial':
        v = 24
    est = {'rede': 15, 'clinica': 11, 'pequena': 7, 'consultorio': 3, 'indefinida': 7}[r['estrutura']]
    comp = {'alta': 10, 'media': 8, 'baixa': 4}[r['compat_nivel']]
    cont = r['pts_contato']
    det = {'Vaga/sinal de contratação (0–30)': v, 'Proximidade de São Felipe (0–20)': pts_prox(r['dist_km']),
           'Estrutura da clínica (0–15)': est, 'Compatibilidade com clínico geral (0–10)': comp,
           'Contato direto (0–10)': cont, 'Diária/turno/produção (0–5)': r.get('pts_modelo', 0),
           'Indícios de expansão (0–5)': r.get('pts_expansao', 0), 'Facilidade de envio do currículo (0–5)': r.get('pts_facil', 1)}
    r['pontuacao'] = sum(det.values())
    r['pontuacao_detalhe'] = det


RECS = []


def rec(**k):
    r = dict(rede='Independente', endereco=NAO, site=NAO, instagram=NAO, n_unidades='1 (sem outras unidades identificadas)',
             data_vaga='—', socios=NAO, gestor='Não identificado', linkedin='', whatsapp='', email='', telefone='',
             outros=[], fontes=[], verificado=VER, cnpj='', obs='', pts_modelo=0, pts_expansao=0, pts_facil=1,
             estrutura='pequena', compat_nivel='media', pts_contato=2)
    r.update(k)
    r['dist_km'] = k.get('dist_km', DIST.get(r['cidade']))
    r['situacao'] = CAT[r['categoria']]
    if not any(l == 'Google Maps' for l, _ in r['outros']) and r['cidade'] in DIST:
        r['outros'].append(('Google Maps', maps(r['nome'], r['cidade'])))
    if r['instagram'] == NAO:
        r['instagram_busca'] = insta_busca(r['nome'], r['cidade'])
    if r['socios'] != NAO and not r['linkedin']:
        r['linkedin'] = linkedin_busca(r['socios'].split(';')[0].split('(')[0].strip() + ' odontologia')
        r['linkedin_tipo'] = 'busca'
    pontuar(r)
    RECS.append(r)
    return r


# ---------------------------------------------------------------- CNES (Recôncavo e entorno)
def load_cnes():
    rows = {}
    for f in glob.glob(os.path.join(RAW, 'cnes', '*_*.json')):
        m = re.search(r'(\d{6})_\d+\.json$', f)
        if not m or int(m.group(1)) == 291080:
            continue
        try:
            for e in json.load(open(f, encoding='utf-8')).get('estabelecimentos', []):
                rows[e['codigo_cnes']] = e
        except Exception:
            pass
    return rows


RX = re.compile(r'(ODONT|DENT|SORRI|ORAL|ORTO|IMPLANT|BUCAL|SMILE|TOOTH|AMOR SAUDE|AMOR E SAUDE|ARMOS|COMEDE|CLIMOD|PRO SAUDE)', re.I)
EXCL = re.compile(r'MUNICIPIO|PREFEITURA|FUNDO MUN|LABORAT|PROTESE|PROTESES|ORTOP|FISIO|JOELHO|OFTALMO|USEMED|CRISTO REDENTOR|'
                  r'GIRO 3D|ARTE DE SORRIR|ORTOCRUZ|ODONTO QUALI|^CEO |USF |UBS ', re.I)
SEM_CNPJ_OK = {510289, 6393136, 6003257, 9690506}  # consultórios de São Felipe e Conceição do Almeida (cidades de prioridade máxima)
ESPEC = re.compile(r'ORTO|IMPLANT|PEDIATR|ESTETIC|BARISON', re.I)
AMOR = {
    'Santo Antônio de Jesus': dict(tel='(75) 3016-2505', end='Rua Sete de Setembro, 284, Centro — CEP 44430-124', rt='Eliomar de Almeida Santos (CRO 18309/BA)'),
    'Cruz das Almas': dict(tel='(75) 99451-1516', end='Praça Geraldo Meyer Suerdieck, 48, Centro — CEP 44380-000', rt='Letícia Caitano Pereira (CRO 23615/BA)'),
    'Valença': dict(tel='(75) 3199-9540', end='Avenida Maçônica, 75, Graça — CEP 45400-000', rt='Douglas Sousa Andrade Brito (CRO 15693/BA)'),
}
AMOR_SITE = 'https://www.amorsaude.com.br/unidades/'
AMOR_TC = 'https://www.amorsaude.com.br/trabalhe-conosco/'
AB_REDE = ('Envie o currículo pelo canal "Trabalhe Conosco" da rede e, em paralelo, procure a gerência da unidade '
           '(a contratação de dentistas é feita pelo franqueado local). Destaque disponibilidade de segunda a sexta e experiência em clínica popular de alto fluxo.')


def cnes_records():
    for e in load_cnes().values():
        fant = (e.get('nome_fantasia') or '').strip()
        raz = (e.get('nome_razao_social') or '').strip()
        blob = fant + ' ' + raz
        if not RX.search(blob) or EXCL.search(blob):
            continue
        cidade = MUN.get(e['codigo_municipio'])
        if not cidade:
            continue
        cnpj = re.sub(r'\D', '', str(e.get('numero_cnpj') or e.get('numero_cnpj_entidade') or ''))
        cnpj = cnpj if len(cnpj) == 14 else ''
        if not cnpj and e['codigo_cnes'] not in SEM_CNPJ_OK:
            continue
        d = brapi(cnpj) if cnpj else {}
        sit = d.get('descricao_situacao_cadastral', '')
        if sit in ('BAIXADA', 'INAPTA') and cidade != 'São Felipe':
            continue
        tp = e.get('codigo_tipo_unidade')
        soc = socios(d)
        ano = (d.get('data_inicio_atividade') or '')[:4]
        nome = titulo(fant)
        end = f"{titulo(e.get('endereco_estabelecimento'))}, {e.get('numero_estabelecimento')} — {titulo(e.get('bairro_estabelecimento'))}"
        tel = fmt_tel(e.get('numero_telefone_estabelecimento'))
        mail = email_ok(e.get('endereco_email_estabelecimento'), fant, raz) or email_ok(d.get('email'), fant, raz)
        fontes = [('CNES/DataSUS — ficha do estabelecimento', f"https://cnes.datasus.gov.br/pages/estabelecimentos/ficha/index.jsp?coUnidade={e.get('codigo_estabelecimento_saude')}")]
        if cnpj:
            fontes.append(('Receita Federal (CNPJ/QSA)', f'https://cnpja.com/office/{cnpj}'))
        k = dict(nome=nome, cidade=cidade, endereco=end, cnpj=cnpj, telefone=tel, email=mail, fontes=fontes,
                 socios='; '.join(soc) if soc else (NAO if cnpj else 'Titular (pessoa física no CNES): ' + titulo(raz)))
        amor = bool(re.search(r'AMOR SAUDE|AMOR E SAUDE', blob, re.I))
        oc = 'ODONTOCOMPANY' in blob.upper()
        novo = ano.isdigit() and int(ano) >= 2024
        if amor:
            a = AMOR[cidade]
            k.update(nome=f'AmorSaúde {cidade}', rede='AmorSaúde (Cartão de TODOS) — franquia', endereco=a['end'], telefone=a['tel'],
                     site=AMOR_SITE, instagram='https://www.instagram.com/amorsaudebrasil', n_unidades='33 unidades na Bahia (site oficial); 3 no Recôncavo/Baixo Sul (SAJ, Cruz das Almas, Valença)',
                     perfil_equipe=f"Clínica popular médico-odontológica; odontologia com clínica geral e especialidades. Responsável técnico da odontologia: {a['rt']} — RT não é necessariamente quem contrata.",
                     categoria='C', estrutura='rede', compat_nivel='alta', pts_contato=8 if soc else 6, pts_modelo=2, pts_facil=5,
                     oportunidade='Sem vaga de dentista anunciada na data da verificação. Rede popular com fluxo alto e rotatividade de profissionais; candidatura espontânea é o caminho. Hipótese de prospecção, não vaga.',
                     compat='Alta — clínica popular de alto volume, perfil idêntico ao da experiência atual na Mais Sorriso.',
                     abordagem=AB_REDE, linkedin='https://www.linkedin.com/company/amorsaudebrasil/', linkedin_tipo='empresa')
            k['outros'] = [('Trabalhe Conosco (rede)', AMOR_TC)]
            k['fontes'].insert(0, ('Site oficial — unidades', AMOR_SITE))
            if cidade in ('Santo Antônio de Jesus', 'Cruz das Almas'):
                k['obs'] = 'Mesmo grupo franqueado opera SAJ, Cruz das Almas e Feira de Santana (sócios em comum na Receita Federal) — um contato pode abrir as três unidades.'
        elif oc:
            continue  # tratado na lista oficial da OdontoCompany
        else:
            estrut = 'clinica' if tp in (36, 4) else ('pequena' if cnpj else 'consultorio')
            clin = tp in (36, 4) or len(soc) >= 2 or re.search(r'CLINICA|CENTRO|INSTITUTO|CLIN\b|CLI[DOR]', fant, re.I)
            cat = 'C' if (cnpj and clin) else 'D'
            esp = bool(ESPEC.search(blob))
            k.update(categoria=cat, estrutura=estrut, compat_nivel='baixa' if esp else 'media',
                     pts_contato=(8 if soc and (mail or tel) else 6 if (soc or mail or tel) else 2),
                     pts_facil=3 if mail else (2 if tel else 1), pts_expansao=5 if novo else 0)
            k['perfil_equipe'] = ('Clínica/centro de especialidades (classificação CNES) — estrutura para mais de um profissional; nº de dentistas não confirmado.'
                                  if tp in (36, 4) else 'Consultório/clínica de pequeno porte (classificação CNES); nº de dentistas não confirmado.')
            if esp:
                k['perfil_equipe'] += ' Nome indica foco em especialidade (ortodontia/implante/estética).'
            k['oportunidade'] = ('Sem vaga anunciada. ' + ('Empresa aberta em ' + ano + ' (Receita Federal) — clínica nova, em fase de formação de equipe. ' if novo else '')
                                 + 'Candidatura espontânea para clínica geral/exodontias em dias fixos ou por produção. Hipótese de prospecção.')
            k['compat'] = ('Média/baixa — foco aparente em especialidade; clínico geral entra como apoio (avaliação, exodontias, restaurações).' if esp
                           else 'Média — clínica local; clínico geral com exodontia e dentística atende a demanda típica.')
            alvo = soc[0] if soc else 'o(a) responsável'
            k['abordagem'] = (f'Contato direto com {alvo} (sócio(a) na Receita Federal) por WhatsApp/telefone da clínica; se não houver resposta, visita em horário de baixo movimento com currículo impresso. '
                              'Oferecer dias fixos de segunda a sexta e cobertura de férias/licenças.') if cat == 'C' else \
                'Baixa prioridade: consultório individual. Abordar apenas para parceria por turno/diária ou cobertura de férias.'
            if cat == 'D':
                k['oportunidade'] = 'Consultório individual, sem evidência de equipe ou contratação. Incluído por estar em cidade de prioridade máxima.'
            # casos específicos
            if 'CLIDONTO' == fant.upper():
                k.update(rede='Clidonto (grupo regional — mesmos sócios em SAJ e Nazaré)', n_unidades='2 (Santo Antônio de Jesus e Nazaré)',
                         categoria='B', pts_expansao=5, estrutura='clinica',
                         oportunidade='Sem vaga anunciada, mas há expansão comprovada: os mesmos sócios da unidade de SAJ (2007) abriram a unidade de Nazaré em 2024 (Receita Federal). Grupo em crescimento tende a precisar de clínico geral para cobrir duas cidades.',
                         abordagem='Abordar os sócios apresentando-se como clínico geral residente em São Felipe, a ~30 km de SAJ e ~42 km de Nazaré, disponível de segunda a sexta para atender nas duas unidades.')
            if 'KEILA' in fant.upper():
                k.update(obs='Histórico de contratação: anúncio no CRO-BA em 25/08/2023 buscando dentista (particular e convênio). Anúncio antigo — NÃO é vaga atual.',
                         whatsapp='(75) 98223-9526', email='consultoriokeila2023@gmail.com', pts_contato=10, pts_facil=5)
                k['fontes'].append(('CRO-BA classificados (25/08/2023)', 'https://croba.org.br/classificados/precisa-se-de-dentista-clinico-exodontia-em-saj-ba/'))
                k['oportunidade'] = 'Sem vaga atual. Já anunciou vaga de dentista clínico/exodontia no CRO-BA (ago/2023), o que mostra que contrata por anúncio. Vale reapresentar currículo.'
                k['compat'] = 'Alta — o anúncio anterior pedia exatamente clínico com exodontia.'
            if 'IOB' in fant.upper():
                k.update(rede='IOB — Instituto de Ortodontia Barison', n_unidades='2 identificadas na Bahia (Santo Antônio de Jesus e Feira de Santana — CNES)', estrutura='rede')
            if fant.upper().startswith('ARMOS'):
                k['obs'] = 'No Doctoralia o endereço Av. Barros e Almeida, 773 aparece como "Clínica Odonto Médica Vida" — possivelmente o nome fantasia de atendimento desta empresa (não confirmado).'
            if cidade == 'São Felipe' and sit == 'BAIXADA':
                k.update(categoria='D', obs='ATENÇÃO: o CNPJ cadastrado no CNES consta como BAIXADO na Receita Federal; o CNES segue ativo (atualizado em 11/2025). Confirmar presencialmente se a clínica funciona e sob qual empresa.',
                         oportunidade='Situação cadastral divergente (CNPJ baixado × CNES ativo). Verificar no local antes de qualquer abordagem.')
            if e['codigo_cnes'] == 510289:
                k['obs'] = 'Homônimo da Mais Sorriso de Salvador; vínculo entre as duas NÃO verificado.'
        rec(**k)


# ---------------------------------------------------------------- OdontoCompany (localizador oficial)
OC_CID = {'Valença': 'Valença', 'Feira de Santana': 'Feira de Santana', 'Salvador': 'Salvador', 'Lauro de Freitas': 'Lauro de Freitas', 'Dias D´Ávila': "Dias d'Ávila"}


def oc_records():
    data = json.load(open(os.path.join(RAW, 'oc', 'ba_cidades.json'), encoding='utf-8'))
    for c in data:
        if c['nome'] not in OC_CID:
            continue
        for u in c['unidades']:
            cnpj = re.sub(r'\D', '', u.get('cnpj') or '')
            d = brapi(cnpj)
            soc = socios(d)
            cidade = OC_CID[c['nome']]
            url = f"https://odontocompany.com/{u['path']}"
            rec(nome=f"OdontoCompany {u.get('busca_fulltext')}", rede='OdontoCompany — franquia', cidade=cidade,
                endereco=f"{u.get('endereco')} — {u.get('bairro')}", site=url, instagram='https://www.instagram.com/odontocompany',
                n_unidades='23 unidades na Bahia em 16 cidades (localizador oficial); 1 no Baixo Sul (Valença); nenhuma em SAJ ou Cruz das Almas',
                perfil_equipe=f"Franquia de clínica popular com várias especialidades. Razão social do franqueado: {titulo(u.get('razao_social'))}. RT: {titulo(u.get('responsavel_nome'))} (CRO {u.get('responsavel_cro')}) — RT não é necessariamente quem contrata.",
                categoria='C', estrutura='rede', compat_nivel='alta', cnpj=cnpj, socios='; '.join(soc) if soc else NAO,
                email=(u.get('email_contato') or '').lower(), pts_contato=8 if soc else 6, pts_modelo=2, pts_facil=3,
                oportunidade='Sem vaga de dentista anunciada na data da verificação. Franquia popular: cada franqueado contrata diretamente, em geral por produção. Hipótese de prospecção, não vaga.',
                compat='Alta — clínica popular com avaliação, dentística, exodontia e prótese; perfil de clínico geral.',
                abordagem='Enviar currículo ao e-mail da unidade e, em paralelo, procurar o(a) sócio(a) franqueado(a) identificado(a) na Receita Federal. Citar experiência em clínica popular e disponibilidade de segunda a sexta.',
                fontes=[('OdontoCompany — página da unidade', url), ('OdontoCompany — localizador', 'https://odontocompany.com/clinicas'),
                        ('Receita Federal (CNPJ/QSA)', f'https://cnpja.com/office/{cnpj}')])


# ---------------------------------------------------------------- AmorSaúde (demais unidades — site oficial)
AMOR_OUTRAS = [
    ('Feira de Santana', 'AmorSaúde Feira de Santana (Centro)', 'Rua Germiniano Costa, 492, Centro — CEP 44001-120', '(75) 3021-9900', 'Jurandi Nery Pereira Filho (CRO 6291/BA)', '33509350000137'),
    ('Feira de Santana', 'AmorSaúde Feira de Santana (Tomba)', 'Av. Governador João Durval Carneiro, 267A, Tomba — CEP 44090-008', '', 'Rodrigo Oliveira e Silva (CRO 24783)', ''),
    ('Candeias', 'AmorSaúde Candeias', 'Rua Doutor Carlos Spínola Palma, 157, Pitanga — CEP 43810-000', '(71) 3026-9550', 'Maria Eduarda Lopes Silva (CRO 22044/BA)', ''),
    ('Simões Filho', 'AmorSaúde Simões Filho', 'Rua Recanto das Árvores, 20, Centro — CEP 43700-000', '(71) 3026-9550', 'Naiana Fortes Pereira (CRO 14175/BA)', ''),
    ('Salvador', 'AmorSaúde Salvador Paripe', 'Rua Doutor Eduardo Dotto, 184, Paripe — CEP 40800-010', '(71) 3037-1451', 'Ágata Cristian da Silva Albuquerque (CRO 11828/BA)', ''),
    ('Salvador', 'AmorSaúde Salvador Largo do Tanque', 'Rua Engenheiro Austricliano, 24, Largo do Tanque — CEP 40391-204', '(71) 99321-0020', 'Érica Lopes Bretas Cabral (CRO 10362/BA)', ''),
    ('Salvador', 'AmorSaúde Salvador Centro', 'Av. Sete de Setembro, 400, Ed. Fundação Politécnica, sobreloja 2, Dois de Julho — CEP 40060-001', '(71) 3037-1451', 'Bruna Pedral Sampaio de Souza Dantas (CRO 14416/BA)', ''),
    ('Salvador', 'AmorSaúde Salvador Cabula', 'Rua Silveira Martins, 68, Cabula — CEP 41150-000', '', 'Melina Alves Soares (CRO 20546/BA)', ''),
    ('Salvador', 'AmorSaúde Salvador Cajazeiras', 'Estrada do Coqueiro Grande, 1361, Fazenda Grande II — CEP 41342-315', '(71) 3037-1451', 'João Vitor Dantas da Silva dos Santos (CRO 17459/BA)', ''),
    ('Salvador', 'AmorSaúde Salvador Pernambués', 'Rua Thomaz Gonzaga, 155, loja 01, Pernambués — CEP 41100-000', '(71) 3037-1451', 'Matheus Reis Santos Aguiar (CRO 23917)', ''),
    ('Lauro de Freitas', 'AmorSaúde Lauro de Freitas', 'Rua São Matheus, 44, Vila Praiana — CEP 42704-650', '(71) 3026-9550', 'Rebeca Alves Pereira (CRO 25264/BA)', ''),
]


def amor_records():
    for cidade, nome, end, tel, rt, cnpj in AMOR_OUTRAS:
        soc = socios(brapi(cnpj)) if cnpj else []
        rec(nome=nome, rede='AmorSaúde (Cartão de TODOS) — franquia', cidade=cidade, endereco=end, telefone=tel, site=AMOR_SITE,
            instagram='https://www.instagram.com/amorsaudebrasil', cnpj=cnpj, socios='; '.join(soc) if soc else NAO,
            n_unidades='33 unidades na Bahia (site oficial)',
            perfil_equipe=f'Clínica popular médico-odontológica. Responsável técnico da odontologia: {rt} — RT não é necessariamente quem contrata.',
            categoria='C', estrutura='rede', compat_nivel='alta', pts_contato=8 if soc else 6, pts_modelo=2, pts_facil=5,
            oportunidade='Sem vaga de dentista anunciada na data da verificação. Candidatura espontânea via rede e gerência local. Hipótese de prospecção.',
            compat='Alta — clínica popular de alto volume.', abordagem=AB_REDE,
            linkedin='https://www.linkedin.com/company/amorsaudebrasil/', linkedin_tipo='empresa',
            outros=[('Trabalhe Conosco (rede)', AMOR_TC)],
            fontes=[('Site oficial — unidades', AMOR_SITE)] + ([('Receita Federal (CNPJ/QSA)', f'https://cnpja.com/office/{cnpj}')] if cnpj else []),
            obs='Mesmo grupo franqueado de SAJ e Cruz das Almas (sócio em comum na Receita Federal).' if cnpj else '')


# ---------------------------------------------------------------- Vamos Sorrir
VS_SITE = 'https://vamossorrir.com.br/clinicas/?estado=BA'
VS_SOC = 'Felipe Gallego; Lucas de Abreu Campos Carvalho; Philipe Moraes de Gouvea; Vandeir José de Oliveira Junior'
VS = [
    ('Santo Antônio de Jesus', 'Vamos Sorrir Santo Antônio de Jesus I (Gorgônio)', 'Rua Gorgônio José de Araújo, 86, Centro', '(75) 3631-4586', ''),
    ('Santo Antônio de Jesus', 'Vamos Sorrir Santo Antônio de Jesus (Francisco Manoel)', 'Centro — logradouro "Francisco Manoel" (número não confirmado)', '', ''),
    ('Cruz das Almas', 'Vamos Sorrir Cruz das Almas', 'Praça Senador Themístocles, Centro (número não confirmado)', '', ''),
    ('Valença', 'Vamos Sorrir Valença', 'Rua Governador Gonçalves, 104', '(75) 3641-2338', ''),
    ('Salvador', 'Vamos Sorrir Relógio de São Pedro', 'Av. Sete de Setembro, 329, Centro', '(71) 3011-5119', '28942629000170'),
    ('Salvador', 'Vamos Sorrir São Caetano', 'Estrada de Campinas, 366, São Caetano', '(71) 3303-0313', '31343889000133'),
    ('Salvador', 'Vamos Sorrir Calçada', 'Rua Barão de Cotegipe, 75, Calçada/Mares', '(71) 3312-5655', '34472051000138'),
    ('Salvador', 'Vamos Sorrir Liberdade', 'Estrada da Liberdade, 383, Liberdade (endereço do CNPJ)', '', '13839467000171'),
    ('Salvador', 'Vamos Sorrir Itapuã', 'Av. Dorival Caymmi, 13, Itapuã (endereço do CNPJ)', '', '26847093000188'),
    ('Salvador', 'Vamos Sorrir Boca do Rio', 'Rua Eduardo Campos, 47, Boca do Rio', '(71) 3371-1798', ''),
    ('Salvador', 'Vamos Sorrir Paripe', 'Av. Afrânio Peixoto, 17, Paripe', '(71) 3521-5178', ''),
    ('Salvador', 'Vamos Sorrir Tancredo Neves', 'Rua Bahia, 89, Tancredo Neves', '', ''),
    ('Salvador', 'Vamos Sorrir Cajazeiras', 'Estrada do Coqueiro Grande, 2006, Cajazeiras', '', ''),
    ('Lauro de Freitas', 'Vamos Sorrir Lauro de Freitas', 'Rua José Ernesto dos Santos, 371, Centro (endereço do CNPJ)', '', '25220475000114'),
    ('Camaçari', 'Vamos Sorrir Camaçari', 'Av. Getúlio Vargas, 29', '(71) 3040-2924', ''),
    ("Dias d'Ávila", "Vamos Sorrir Dias d'Ávila", 'Av. Brasil, 110', '(71) 3190-0375', ''),
]


def vs_records():
    for cidade, nome, end, tel, cnpj in VS:
        soc = socios(brapi(cnpj)) if cnpj else []
        rec(nome=nome, rede='Vamos Sorrir Odontologia — rede popular', cidade=cidade, endereco=end, telefone=tel, site=VS_SITE, cnpj=cnpj,
            socios='; '.join(soc) if soc else f'Não localizado para esta unidade. Nas unidades de Salvador/Lauro os sócios registrados são: {VS_SOC}',
            n_unidades='"Mais de 90 unidades no Brasil" (site oficial); na Bahia ao menos 20, incluindo 2 em SAJ, 1 em Cruz das Almas e 1 em Valença',
            perfil_equipe='Rede de clínicas populares de alto fluxo, com vários dentistas por unidade (avaliações de funcionários no InfoJobs descrevem "clínica popular com alto fluxo e grande demanda").',
            categoria='C', estrutura='rede', compat_nivel='alta', pts_contato=8 if soc else 6, pts_modelo=2, pts_facil=2 if tel else 1,
            oportunidade='Sem vaga de dentista localizada na data da verificação. Rede citada por você como referência; modelo de alto volume costuma ter reposição frequente de clínicos. Hipótese de prospecção, não vaga.',
            compat='Alta — mesmo segmento da Mais Sorriso (clínica popular, clínico geral, exodontias, dentística).',
            abordagem='Procurar a gerência/coordenação clínica da unidade (telefone fixo) pedindo o contato de quem seleciona dentistas; em paralelo, tentar os sócios do grupo via LinkedIn. Mencionar que já atua em clínica popular em Salvador.',
            fontes=[('Site oficial — unidades na Bahia (dados obtidos via busca; site inacessível para leitura direta em 16/11/2026)', VS_SITE)]
            + ([('Receita Federal (CNPJ/QSA)', f'https://cnpja.com/office/{cnpj}')] if cnpj else [])
            + [('InfoJobs — avaliações de funcionários', 'https://www.infojobs.com.br/availacoes-vamos-sorrir__-753038.aspx')],
            obs='Telefones divergem entre páginas do próprio site para algumas unidades; confirmar antes de ligar.' if not tel else '')


# ---------------------------------------------------------------- Oral Sin e Odonto Excellence
def outras_redes():
    rec(nome='Oral Sin Implantes Salvador', rede='Oral Sin — franquia de implantes', cidade='Salvador', endereco='Av. Milton Santos, 190',
        telefone='(71) 3838-8400', whatsapp='(71) 99730-8655', site='https://www.oralsin.com.br/salvador', instagram='https://www.instagram.com/oralsinimplantes',
        n_unidades='7 unidades na Bahia (sitemap oficial): Salvador, Lauro de Freitas, Ilhéus, Jacobina, Luís Eduardo Magalhães, Teixeira de Freitas e Vitória da Conquista. Nenhuma no Recôncavo nem em Feira de Santana',
        perfil_equipe='Clínica de implantes e reabilitação. RT: Dra. Joyce Naiane Bernardo de Oliveira Leite (CRO-BA 23046) — RT não é necessariamente quem contrata.',
        categoria='C', estrutura='rede', compat_nivel='baixa', pts_contato=6, pts_facil=5,
        oportunidade='Sem vaga anunciada. Foco em implantodontia e prótese; clínico geral entra como avaliador/clínico de apoio. Hipótese de prospecção.',
        compat='Baixa/média — rede focada em implantes; não se apresentar como especialista.',
        abordagem='Usar o formulário "Trabalhe Conosco" (área Odontologia) e o WhatsApp da unidade. Posicionar-se como clínico geral para avaliação, exodontias e preparo pré-protético.',
        linkedin='https://www.linkedin.com/company/oralsinfranchising/', linkedin_tipo='empresa',
        outros=[('Trabalhe Conosco (formulário)', 'https://www.oralsin.com.br/trabalhe-conosco')],
        fontes=[('Oral Sin — página da unidade', 'https://www.oralsin.com.br/salvador')])
    rec(nome='Oral Sin Implantes Lauro de Freitas', rede='Oral Sin — franquia de implantes', cidade='Lauro de Freitas', endereco='Av. Praia de Itapuã, 289, Vilas do Atlântico',
        telefone='(71) 3511-3970', whatsapp='(71) 99236-1761', site='https://www.oralsin.com.br/laurodefreitas', instagram='https://www.instagram.com/oralsinimplantes',
        n_unidades='7 unidades na Bahia (sitemap oficial)',
        perfil_equipe='Clínica de implantes e reabilitação. RT: Dra. Franciane Bizarria da Silva (CRO-BA 14.287) — RT não é necessariamente quem contrata.',
        categoria='C', estrutura='rede', compat_nivel='baixa', pts_contato=6, pts_facil=5,
        oportunidade='Sem vaga anunciada. Foco em implantodontia; hipótese de prospecção.',
        compat='Baixa/média — rede focada em implantes.',
        abordagem='Formulário "Trabalhe Conosco" e WhatsApp da unidade; oferecer atuação como clínico geral/avaliador.',
        linkedin='https://www.linkedin.com/company/oralsinfranchising/', linkedin_tipo='empresa',
        outros=[('Trabalhe Conosco (formulário)', 'https://www.oralsin.com.br/trabalhe-conosco')],
        fontes=[('Oral Sin — página da unidade', 'https://www.oralsin.com.br/laurodefreitas')])
    rec(nome='Odonto Excellence Salvador — Cajazeiras', rede='Odonto Excellence — franquia', cidade='Salvador', endereco='Estrada da Paciência, 15A, loja 001, Cajazeiras VIII — CEP 41338-700',
        site='https://www.odontoexcellence.com.br/unidades', instagram='https://www.instagram.com/odontoexcellence.franchising',
        n_unidades='Bahia (site oficial): Alagoinhas, Caetité, Irará, Porto Seguro, Salvador, Santa Bárbara, Santaluz, Senhor do Bonfim e Vitória da Conquista. Nenhuma no Recôncavo',
        perfil_equipe='Franquia de clínica popular (orto e clínica geral). RT: Marcos Hélio Barbosa Soares (CRO-BA-CD-21534) — RT não é necessariamente quem contrata.',
        categoria='C', estrutura='rede', compat_nivel='alta', pts_contato=6, pts_modelo=2, pts_facil=5,
        oportunidade='Sem vaga anunciada. A rede mantém formulário de candidatura que encaminha o currículo a todas as franquias da cidade escolhida. Hipótese de prospecção.',
        compat='Alta — clínica popular.', abordagem='Preencher o formulário "Trabalhe Conosco" escolhendo Salvador (e outras cidades de interesse) e a área Odontologia.',
        linkedin='https://br.linkedin.com/company/odontoexcellencefranchising', linkedin_tipo='empresa',
        outros=[('Trabalhe Conosco (formulário)', 'https://www.odontoexcellence.com.br/trabalhe-conosco')],
        fontes=[('Odonto Excellence — unidades', 'https://www.odontoexcellence.com.br/unidades')])


# ---------------------------------------------------------------- Vagas e sinais (CRO-BA e outros)
CRO = 'https://croba.org.br/classificados/'


def vagas():
    rec(nome='Clioral (anúncio CRO-BA — dentista avaliador)', cidade='Não informada (DDD 71)', dist_km=None, endereco='Não informado no anúncio (DDD 71 — provável Salvador/RMS; confirmar)',
        categoria='A', vaga_perfil='parcial', estrutura='indefinida', compat_nivel='media', data_vaga='09/11/2026',
        telefone='(71) 99140-9257', email='admin@clioral.com.br', pts_contato=10, pts_modelo=3, pts_facil=5,
        perfil_equipe='Clínica com atendimento a convênios e particulares (segundo o anúncio); equipe com avaliador e ortodontista.',
        oportunidade='VAGA CONFIRMADA: dentista avaliador — valor fixo + % de vendas, exige experiência em vendas. (O mesmo anúncio pede ortodontista aos sábados, por diária.)',
        compat='Média — vaga de avaliador exige perfil comercial; você realiza avaliação e planejamento, mas a experiência em vendas precisa ser demonstrada.',
        abordagem='Enviar currículo HOJE para admin@clioral.com.br com assunto "Dentista avaliador — CRO-BA 32800", citando avaliação/planejamento na Mais Sorriso. Perguntar a localização da clínica antes de assumir o deslocamento.',
        fontes=[('CRO-BA classificados (09/11/2026)', CRO + 'uma-vaga-para-dentista-avaliador-e-uma-vaga-para-ortodontista/')])
    rec(nome='Anunciante CRO-BA — "Dias para clínico geral"', cidade='Não informada (DDD 71)', dist_km=None, endereco='Não informado no anúncio (DDD 71; confirmar cidade)',
        categoria='A', estrutura='indefinida', compat_nivel='alta', data_vaga='10/11/2026', telefone='(71) 99926-2024', email='jessicajeu_14@hotmail.com',
        pts_contato=10, pts_modelo=5, pts_facil=5, perfil_equipe='Não informado. Anunciante não identifica a clínica.',
        oportunidade='VAGA CONFIRMADA: "vaga para clínico geral" com dias disponíveis (anúncio de 6 dias antes da verificação). Sem detalhes de local, remuneração ou dias.',
        compat='Alta — pede exatamente clínico geral por dias.', abordagem='Ligar/enviar mensagem ao contato do anúncio pedindo nome da clínica, cidade, dias e forma de remuneração. Informar disponibilidade de segunda a sexta.',
        fontes=[('CRO-BA classificados (10/11/2026)', CRO + 'dias-para-clinico-geral/')])
    rec(nome='Clínica em Brotas (anúncio CRO-BA — clínico geral às quintas)', cidade='Salvador', endereco='Brotas, Salvador (endereço não informado no anúncio)',
        categoria='A', estrutura='indefinida', compat_nivel='alta', data_vaga='13/10/2026', telefone='(71) 99619-9896', email='cristina.odonto12@gmail.com',
        pts_contato=10, pts_modelo=5, pts_facil=5, pts_expansao=5,
        perfil_equipe='Clínica com mais de um profissional: o mesmo contato anunciou clínico geral (terças, 24/08/2026), ortodontista (segundas, 24/08/2026) e clínico geral (quintas, 13/10/2026).',
        oportunidade='VAGA CONFIRMADA: clínico geral às quintas-feiras. Três anúncios em menos de 60 dias indicam equipe em ampliação.',
        compat='Alta — clínico geral em dia fixo de semana, compatível com sua agenda (segunda a sexta livre).',
        abordagem='Contato direto pelo telefone do anúncio. Oferecer a quinta-feira e perguntar se a terça ainda está aberta. Pesar o deslocamento São Felipe–Salvador (≈190 km) — viável se combinado com o sábado na Mais Sorriso.',
        fontes=[('CRO-BA classificados (13/10/2026)', CRO + 'clinico-geral-73/'), ('CRO-BA classificados (24/08/2026)', CRO + 'vaga-para-clinico-geral-67/')])
    rec(nome='Anunciante CRO-BA — 3 vagas (clínico geral, protesista e cirurgião)', cidade='Não informada (DDD 71)', dist_km=None, endereco='Não informado no anúncio (DDD 71; e-mail sugere o nome "Orthos Prime" — confirmar)',
        categoria='A', estrutura='clinica', compat_nivel='alta', data_vaga='15/10/2026', whatsapp='(71) 99348-6225', email='orthosprime.doc@outlook.com',
        pts_contato=10, pts_modelo=0, pts_facil=5, pts_expansao=5,
        perfil_equipe='Clínica com várias cadeiras: contrata simultaneamente clínico geral, protesista e cirurgião.',
        oportunidade='VAGA CONFIRMADA: 01 dentista clínico geral (além de protesista e cirurgião). Pagamento todo 5º dia útil. Contato por WhatsApp.',
        compat='Alta — vaga nominal para clínico geral; sua experiência em exodontias também conversa com a vaga de cirurgia (sem se apresentar como especialista).',
        abordagem='Mensagem de WhatsApp ao número do anúncio com o modelo deste relatório; perguntar cidade/bairro, dias e modelo de pagamento.',
        fontes=[('CRO-BA classificados (15/10/2026)', CRO + 'oportunidade-de-emprego-para-dentistas/')])
    rec(nome='Anunciante CRO-BA — "clínico que faça exodontia"', cidade='Não informada (DDD 71)', dist_km=None, endereco='Não informado no anúncio (DDD 71; confirmar cidade)',
        categoria='A', estrutura='clinica', compat_nivel='alta', data_vaga='17/10/2026', telefone='(71) 99157-8937', email='adriianelima@hotmail.com',
        pts_contato=10, pts_facil=5, pts_expansao=5,
        perfil_equipe='Clínica multiprofissional: o mesmo contato anunciou avaliador e protesista (27/08/2026), ortodontista e periodontista (17/10 e 31/10/2026).',
        oportunidade='VAGA CONFIRMADA: clínico que faça exodontia, experiência mínima de 2 anos. Cinco anúncios do mesmo contato desde agosto indicam contratação contínua.',
        compat='Alta — exodontia é ponto forte do seu perfil (inclui terceiros molares). Verificar se você atende ao mínimo de 2 anos de experiência exigido.',
        abordagem='Ligar para o contato do anúncio; destacar formação complementar em Cirurgia Oral Menor e rotina de exodontias. Confirmar local e o requisito de 2 anos.',
        fontes=[('CRO-BA classificados (17/10/2026)', CRO + 'vaga-para-ortodontista-e-periodontista/'), ('CRO-BA classificados (27/08/2026)', CRO + 'vaga-para-dentista-avaliador-8/')])
    rec(nome='Oral Centter Clínicas Odontológicas — Cruz das Almas', rede='Oral Centter (matriz em Espinosa-MG)', cidade='Cruz das Almas', endereco='Rua 15 de Novembro, 68, Centro (guia empresarial; confirmar)',
        categoria='B', estrutura='rede', compat_nivel='media', cnpj='60065244000184', socios='Luciano Freitas Antunes; Maria Alice Silveira de Freitas',
        n_unidades='Ao menos 2 (matriz em Espinosa-MG e unidade em Cruz das Almas); total não confirmado',
        pts_contato=6, pts_expansao=5, pts_facil=1, pts_modelo=0,
        perfil_equipe='Clínica popular em rede; a vaga publicada cita "vivência em clínicas populares, odontologia em rede ou franqueadas" como diferencial.',
        oportunidade='INDÍCIO FORTE: vaga de "dentista avaliador" (presencial, CLT) listada em agregador de empregos para Cruz das Almas, sem data visível; empresa aberta em 03/2025 (Receita Federal) — rede nova entrando no Recôncavo. Vaga atual não confirmada.',
        compat='Média/alta — experiência em clínica popular é o diferencial pedido; a função de avaliador exige perfil comercial.',
        abordagem='Ir à unidade (38 km de São Felipe) e pedir o contato da coordenação/gerência; citar a vaga de dentista avaliador e a experiência em clínica popular. Telefones dos diretórios divergem — confirmar no local.',
        fontes=[('Receita Federal (CNPJ/QSA)', 'https://cnpja.com/office/60065244000184'), ('TrabalhaBrasil — vagas de dentista (agregador)', 'https://www.trabalhabrasil.com.br/vagas-de-emprego-em-salvador-ba/cirurgiao-dentista-clinico-geral'),
                ('Guia empresarial — endereço', 'https://guiapinzon.com.br/ba/cruz-das-almas/centro/dentista-em-centro')],
        obs='Telefones divergentes nas listagens ((38) 2211-7100 e (75) 3621-1734) — não confirmados.')
    rec(nome='Anunciante CRO-BA — dentista avaliador em Cruz das Almas (5 dias/semana)', cidade='Cruz das Almas', endereco='Cruz das Almas (clínica não identificada no anúncio)',
        categoria='B', estrutura='indefinida', compat_nivel='media', data_vaga='13/04/2026', telefone='(75) 99879-5578', email='mayaraolivave@gmail.com',
        pts_contato=10, pts_facil=5, perfil_equipe='Não informado. Perfil da vaga (avaliador com experiência em orçamento, 5 dias/semana) é típico de clínica popular.',
        oportunidade='INDÍCIO FORTE: anúncio de 13/04/2026 buscando dentista com experiência em orçamento/avaliação para 5 dias por semana em Cruz das Almas. Anúncio com 7 meses — vaga pode estar preenchida; possivelmente ligado à Oral Centter (não confirmado).',
        compat='Média/alta — 5 dias por semana casa com sua disponibilidade de segunda a sexta; exige experiência em orçamento.',
        abordagem='Mensagem ao telefone do anúncio perguntando se a vaga segue aberta ou se há banco de currículos; informar que mora a 38 km e tem segunda a sexta livres.',
        fontes=[('CRO-BA classificados (13/04/2026)', CRO + 'vaga-para-clinico-geral-com-experiencia-em-orcamento/')])
    rec(nome='Anunciante CRO-BA — clínico geral às sextas em Santo Amaro', cidade='Santo Amaro', endereco='Santo Amaro da Purificação (clínica não identificada no anúncio)',
        categoria='B', estrutura='indefinida', compat_nivel='alta', data_vaga='13/06/2026', telefone='(71) 99216-1543', email='izislima@gmail.com',
        pts_contato=10, pts_modelo=5, pts_facil=5, perfil_equipe='Não informado.',
        oportunidade='INDÍCIO FORTE: anúncio de 13/06/2026 — vaga para clínico geral às sextas-feiras em Santo Amaro. Anúncio com 5 meses; confirmar se ainda está aberta.',
        compat='Alta — clínico geral em dia fixo de semana.', abordagem='Contato pelo telefone do anúncio; perguntar se a sexta segue disponível e se há outros dias.',
        fontes=[('CRO-BA classificados (13/06/2026)', CRO + 'vaga-para-clinico-geral-santo-amaro/')])
    rec(nome='Dra. Diana Aranha Odontologia Especializada', cidade='Feira de Santana', endereco='Feira de Santana (endereço não informado no anúncio)',
        categoria='B', estrutura='clinica', compat_nivel='media', data_vaga='09/06/2026', telefone='(75) 99199-5554', email='dianaaranhaodontoespecializada@gmail.com',
        pts_contato=10, pts_modelo=5, pts_facil=5, pts_expansao=5,
        perfil_equipe='"Clínica odontológica de alto padrão" com fluxo constante de pacientes (texto do anúncio).',
        oportunidade='INDÍCIO FORTE: anúncio de 09/06/2026 para clínico geral com foco em avaliação e vendas — 1 mês de experiência comissionado e depois contrato PJ. Em 21/09/2026 a clínica anunciou vaga de ASB no InfoJobs (equipe em ampliação). Vaga de dentista pode estar preenchida.',
        compat='Média — exige experiência comprovada em avaliações e vendas.', abordagem='E-mail com currículo e mensagem curta citando o anúncio de junho; perguntar se a seleção segue aberta.',
        fontes=[('CRO-BA classificados (09/06/2026)', CRO + 'oportunidade-cirurgiao-dentista-clinico-geral-foco-em-avalicao-e-vendas-em-feira-de-santana-ba/'),
                ('InfoJobs — vaga de ASB (21/09/2026)', 'https://www.infojobs.com.br/vaga-de-auxiliar-saude-bucal-em-bahia__12035592.aspx')])
    rec(nome='DentsFine Odontologia', cidade='Não informada (DDD 71)', dist_km=None, endereco='Não informado no anúncio (DDD 71; confirmar cidade)',
        categoria='B', estrutura='clinica', compat_nivel='media', data_vaga='08/06/2026', telefone='(71) 99717-0023', email='vagasdfo@gmail.com',
        pts_contato=10, pts_modelo=5, pts_facil=5, perfil_equipe='Clínica com e-mail próprio de recrutamento (vagasdfo@gmail.com), o que sugere seleção recorrente.',
        oportunidade='INDÍCIO FORTE: anúncio de 08/06/2026 para clínico geral, segunda a sábado, retirada média de R$ 4.500 a R$ 5.000 conforme produtividade; pede prótese fixa, pinos/coroas, inlays/onlays. Anúncio com 5 meses.',
        compat='Média — exige habilidade em prótese fixa; avaliar seu domínio antes de se candidatar. Jornada segunda a sábado conflita com o sábado na Mais Sorriso.',
        abordagem='Enviar currículo ao e-mail de vagas perguntando se há banco de talentos e possibilidade de jornada de segunda a sexta.',
        fontes=[('CRO-BA classificados (08/06/2026)', CRO + '%f0%9f%a6%b7-vaga-para-cirurgiao-dentista-clinico-geral/')])
    rec(nome='Essence Oral', cidade='Lauro de Freitas', endereco='Lauro de Freitas (endereço não informado no anúncio)',
        categoria='B', estrutura='clinica', compat_nivel='baixa', data_vaga='24/08/2026', telefone='(71) 99740-4596', email='clinicaessenceoral@gmail.com',
        pts_contato=10, pts_facil=5, perfil_equipe='Clínica com equipe; anúncio pede clínico com domínio de prótese.',
        oportunidade='INDÍCIO FORTE: anúncio de 24/08/2026 para clínico geral com mínimo de 3 anos de experiência e domínio de prótese odontológica. Quase 3 meses.',
        compat='Baixa/média — exige 3 anos de experiência e domínio em prótese; distância de ≈200 km.',
        abordagem='Só vale o contato se você atender aos requisitos; enviar currículo por e-mail.',
        fontes=[('CRO-BA classificados (24/08/2026)', CRO + 'vaga-para-clinico-geral-66/')])


# ---------------------------------------------------------------- Feira de Santana (seleção)
FEIRA = [
    ('IOB — Instituto de Ortodontia Barison (Feira)', 'Rua Barão do Rio Branco, 882, Centro', '05091831000130', 'IOB — Instituto de Ortodontia Barison', '2 identificadas na Bahia (SAJ e Feira de Santana — CNES)', 'rede', 'baixa', 0),
    ('Meu Dente (Rua Sampaio, 169)', 'Rua Sampaio, 169, Centro', '21385908000130', 'Meu Dente — rede local de Feira de Santana', '3 endereços no CNES (Rua Sampaio 155 e 169; Av. Getúlio Vargas 600)', 'rede', 'alta', 0),
    ('Clínica Meu Dente (Rua Sampaio, 155)', 'Rua Sampaio, 155, Centro', '38404537000190', 'Meu Dente — rede local de Feira de Santana', '3 endereços no CNES (Rua Sampaio 155 e 169; Av. Getúlio Vargas 600)', 'rede', 'alta', 0),
    ('Mais Sorriso Clínica Odontológica (Feira)', 'Rua Visconde do Rio Branco, 66, Centro', '36067313000104', 'Independente (homônimo da Mais Sorriso de Salvador — vínculo não verificado)', '1 (sem outras unidades identificadas)', 'clinica', 'alta', 0),
    ('Rizzo Odontologia (matriz)', 'Rua Barão do Rio Branco, 919, Kalilândia', '01184661000187', 'Rizzo Odontologia', '2 em Feira de Santana (matriz e filial na Praça Tertuliano Almeida)', 'rede', 'media', 0),
    ('Odonto Club', 'Av. Maria Quitéria, 1892, Capuchinhos', '96730395000157', 'Independente', '1–2 em Feira (diretório cita também Rua Comandante Almiro, 515)', 'clinica', 'media', 0),
    ('Central do Sorriso', 'Rua Quintino Bocaiúva, 101, Centro', '39735509000118', 'Independente', '1 (sem outras unidades identificadas)', 'pequena', 'alta', 0),
    ('Odonto+ Saúde', 'Rua Sampaio, 204, Centro', '53271675000131', 'Independente', '1 (sem outras unidades identificadas)', 'clinica', 'alta', 5),
]


def feira_records():
    for nome, end, cnpj, rede, nun, est, comp, exp in FEIRA:
        d = brapi(cnpj)
        soc = socios(d)
        ano = (d.get('data_inicio_atividade') or '')[:4]
        rec(nome=nome, rede=rede, cidade='Feira de Santana', endereco=end, cnpj=cnpj, socios='; '.join(soc) if soc else NAO, n_unidades=nun,
            categoria='C', estrutura=est, compat_nivel=comp, pts_contato=6, pts_expansao=exp, pts_facil=1,
            perfil_equipe='Clínica registrada no CNES em Feira de Santana; nº de dentistas não confirmado.' + (' Foco em ortodontia.' if 'Ortodontia' in nome else ''),
            oportunidade='Sem vaga anunciada. ' + (f'Empresa aberta em {ano} — clínica nova. ' if exp else '') + 'Candidatura espontânea; hipótese de prospecção.',
            compat={'alta': 'Alta — perfil de clínica popular/geral.', 'media': 'Média — clínica local multiprofissional.', 'baixa': 'Baixa — foco em ortodontia.'}[comp],
            abordagem='Contato com o(a) sócio(a) identificado(a) na Receita Federal; Feira fica a ≈110 km — priorizar apenas se oferecer dois ou mais dias consecutivos.',
            fontes=[('CNES/DataSUS — consulta de estabelecimentos', 'https://cnes.datasus.gov.br/pages/estabelecimentos/consulta.jsp'), ('Receita Federal (CNPJ/QSA)', f'https://cnpja.com/office/{cnpj}')])


def main():
    cnes_records(); oc_records(); amor_records(); vs_records(); outras_redes(); vagas(); feira_records()
    # deduplicação por nome+cidade
    seen, recs = set(), []
    for r in RECS:
        key = (r['nome'].lower(), r['cidade'])
        if key in seen:
            continue
        seen.add(key)
        recs.append(r)
    catord = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
    recs.sort(key=lambda r: (-r['pontuacao'], catord[r['categoria']], r['dist_km'] if r['dist_km'] is not None else 999, r['nome']))
    total = len(recs)
    # corte em 100: preserva cidades de prioridade máxima e categorias A/B
    if total > 100:
        keep = [r for r in recs if r['categoria'] in 'AB' or r['cidade'] in ('São Felipe', 'Conceição do Almeida')]
        rest = [r for r in recs if r not in keep]
        recs = keep + rest[:100 - len(keep)]
        recs.sort(key=lambda r: (-r['pontuacao'], catord[r['categoria']], r['dist_km'] if r['dist_km'] is not None else 999, r['nome']))
    for i, r in enumerate(recs, 1):
        r['ranking'] = i
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump({'verificado_em': VER, 'total_verificadas': total, 'clinicas': recs}, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    from collections import Counter
    print('total verificadas', total, '-> no relatório', len(recs))
    print('categorias', sorted(Counter(r['categoria'] for r in recs).items()))
    print('cidades', Counter(r['cidade'] for r in recs).most_common())
    for r in recs[:25]:
        print(r['ranking'], r['pontuacao'], r['categoria'], r['nome'][:60], '|', r['cidade'])
    print('...');
    for r in recs[-6:]:
        print(r['ranking'], r['pontuacao'], r['categoria'], r['nome'][:60], '|', r['cidade'])


if __name__ == '__main__':
    main()
