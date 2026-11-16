"""Gera o relatório em PDF e a planilha Excel a partir de dados/clinicas.json."""
import json, os, re, sys
from xml.sax.saxutils import escape
from collections import Counter, OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import conteudo as C
from build_dataset import PRIORIDADE_MAX, tel_link, wa_link, NAO

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, PageBreak,
                                KeepTogether, NextPageTemplate)
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DATA = json.load(open(os.path.join(BASE, 'dados', 'clinicas.json'), encoding='utf-8'))
RECS = DATA['clinicas']
VER = DATA['verificado_em']
OUTDIR = os.path.join(BASE, 'relatorio')
os.makedirs(OUTDIR, exist_ok=True)
PDF = os.path.join(OUTDIR, 'Mapeamento_Oportunidades_Odontologia_Daniel_Passos.pdf')
XLSX = os.path.join(OUTDIR, 'Mapeamento_Oportunidades_Odontologia_Daniel_Passos.xlsx')

FD = '/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('DV', FD + 'DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVB', FD + 'DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DVI', FD + 'DejaVuSans.ttf'))
pdfmetrics.registerFontFamily('DV', normal='DV', bold='DVB', italic='DVI', boldItalic='DVB')

NAVY = colors.HexColor('#1F2A44')
LIME = colors.HexColor('#8ACE00')
INK = colors.HexColor('#1A1D1A')
GREY = colors.HexColor('#5A6058')
RULE = colors.HexColor('#D5D8D0')
PAPER = colors.HexColor('#F5F6F1')
LINK = '#0B57A4'
CATCOL = {'A': colors.HexColor('#1B7F3B'), 'B': colors.HexColor('#B36B00'), 'C': colors.HexColor('#2B5C9E'), 'D': colors.HexColor('#7A7F78')}
CATBG = {'A': colors.HexColor('#E3F4E8'), 'B': colors.HexColor('#FCF0DC'), 'C': colors.HexColor('#E6EEF8'), 'D': colors.HexColor('#EEEFEC')}


def S(name, **k):
    base = dict(fontName='DV', fontSize=9, leading=12.5, textColor=INK)
    base.update(k)
    return ParagraphStyle(name, **base)


ST = {
    'body': S('body'), 'small': S('small', fontSize=7.6, leading=10.2), 'tiny': S('tiny', fontSize=6.8, leading=9, textColor=GREY),
    'h1': S('h1', fontName='DVB', fontSize=17, leading=21, textColor=NAVY, spaceBefore=4, spaceAfter=8),
    'h2': S('h2', fontName='DVB', fontSize=12, leading=15, textColor=NAVY, spaceBefore=10, spaceAfter=5),
    'h3': S('h3', fontName='DVB', fontSize=9.6, leading=12.5, textColor=NAVY, spaceBefore=6, spaceAfter=3),
    'bul': S('bul', leftIndent=10, bulletIndent=1, spaceAfter=2),
    'cell': S('cell', fontSize=7.4, leading=9.6), 'cellb': S('cellb', fontName='DVB', fontSize=7.4, leading=9.6),
    'th': S('th', fontName='DVB', fontSize=7.2, leading=9, textColor=colors.white),
    'card_t': S('card_t', fontName='DVB', fontSize=9.4, leading=12, textColor=NAVY),
    'card': S('card', fontSize=7.7, leading=10.4),
    'msg': S('msg', fontSize=8.4, leading=12, backColor=PAPER, borderPadding=(7, 8, 7, 8), spaceBefore=4, spaceAfter=10),
    'cover_t': S('cover_t', fontName='DVB', fontSize=25, leading=30, textColor=colors.white),
    'cover_s': S('cover_s', fontSize=12, leading=17, textColor=colors.HexColor('#DCE3EE')),
    'cover_m': S('cover_m', fontSize=9.5, leading=14, textColor=colors.HexColor('#DCE3EE')),
}


def e(s):
    return escape(str(s if s is not None else ''))


def a(url, text=None):
    if not url:
        return e(text or '')
    return f'<a href="{e(url)}" color="{LINK}"><u>{e(text or url)}</u></a>'


def P(txt, st='body'):
    return Paragraph(txt, ST[st])


def bullets(items, st='bul'):
    return [Paragraph(e(i) if '<a ' not in i and '<b>' not in i else i, ST[st], bulletText='•') for i in items]


def contato_principal(r):
    out = []
    if r.get('whatsapp'):
        out.append(a(wa_link(r['whatsapp']), 'WhatsApp ' + r['whatsapp']))
    if r.get('telefone'):
        out.append(a(tel_link(r['telefone']), 'Tel. ' + r['telefone']))
    if r.get('email'):
        out.append(a('mailto:' + r['email'], r['email']))
    if not out:
        m = [u for l, u in r['outros'] if 'Trabalhe' in l] or [u for l, u in r['outros'] if l == 'Google Maps']
        if m:
            out.append(a(m[0], 'Trabalhe Conosco' if 'trabalhe' in m[0] else 'Ver no mapa'))
    return '<br/>'.join(out) or 'Presencial'


def dist_txt(r):
    return f"≈{r['dist_km']} km" if r['dist_km'] is not None else 'n/d'


# ------------------------------------------------------------------ PDF
def on_page(canv, doc):
    canv.saveState()
    w, h = A4
    canv.setStrokeColor(RULE); canv.setLineWidth(0.5)
    canv.line(16 * mm, 13 * mm, w - 16 * mm, 13 * mm)
    canv.setFont('DV', 6.8); canv.setFillColor(GREY)
    canv.drawString(16 * mm, 9 * mm, 'Mapeamento de Oportunidades Profissionais em Odontologia — Dr. Daniel Passos — CRO-BA 32800')
    canv.drawRightString(w - 16 * mm, 9 * mm, f'Dados verificados em {VER} · pág. {doc.page}')
    canv.setFillColor(LIME); canv.rect(0, h - 4, w, 4, stroke=0, fill=1)
    canv.restoreState()


def on_cover(canv, doc):
    w, h = A4
    canv.saveState()
    canv.setFillColor(NAVY); canv.rect(0, 0, w, h, stroke=0, fill=1)
    canv.setFillColor(LIME); canv.rect(18 * mm, h - 62 * mm, 26 * mm, 2.2 * mm, stroke=0, fill=1)
    canv.restoreState()


def tbl(data, widths, head=True, zebra=True, extra=None):
    t = Table(data, colWidths=widths, repeatRows=1 if head else 0)
    st = [('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 3.5), ('RIGHTPADDING', (0, 0), (-1, -1), 3.5),
          ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5), ('LINEBELOW', (0, 0), (-1, -1), 0.4, RULE)]
    if head:
        st += [('BACKGROUND', (0, 0), (-1, 0), NAVY)]
    if zebra:
        st += [('ROWBACKGROUNDS', (0, 1 if head else 0), (-1, -1), [colors.white, PAPER])]
    t.setStyle(TableStyle(st + (extra or [])))
    return t


def card(r):
    cat = r['categoria']
    head = Table([[P(f"<b>#{r['ranking']}</b>", 'card_t'), P(e(r['nome']), 'card_t'),
                   Paragraph(f"<b>{e(r['situacao'])}</b><br/>{r['pontuacao']} pontos", S('cc', fontSize=7.4, leading=9.6, textColor=CATCOL[cat], alignment=2))]],
                 colWidths=[12 * mm, 103 * mm, 49 * mm])
    head.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                              ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 2)]))
    L = []

    def row(label, val):
        if val:
            L.append(P(f'<b>{e(label)}:</b> {val}', 'card'))

    row('Rede', e(r['rede']))
    row('Endereço', f"{e(r['endereco'])} — {e(r['cidade'])} ({dist_txt(r)} de São Felipe)")
    row('Unidades identificadas', e(r['n_unidades']))
    row('Equipe', e(r['perfil_equipe']))
    row('Oportunidade', e(r['oportunidade']) + (f" <b>Data do anúncio:</b> {e(r['data_vaga'])}." if r['data_vaga'] != '—' else ''))
    row('Compatibilidade', e(r['compat']))
    soc = e(r['socios'])
    if r.get('linkedin') and r.get('linkedin_tipo') == 'busca':
        soc += ' — ' + a(r['linkedin'], 'buscar no LinkedIn')
    row('Proprietário(s)/sócio(s) — Receita Federal', soc)
    row('Gestor/responsável pela contratação', e(r['gestor']))
    ch = []
    if r.get('whatsapp'):
        ch.append(a(wa_link(r['whatsapp']), 'WhatsApp ' + r['whatsapp']))
    if r.get('telefone'):
        ch.append(a(tel_link(r['telefone']), 'Tel. ' + r['telefone']))
    if r.get('email'):
        ch.append(a('mailto:' + r['email'], r['email']))
    if r['site'] != NAO:
        ch.append(a(r['site'], 'Site/página da unidade'))
    if r['instagram'] != NAO:
        ch.append(a(r['instagram'], 'Instagram oficial da rede'))
    elif r.get('instagram_busca'):
        ch.append('Instagram não verificado — ' + a(r['instagram_busca'], 'buscar'))
    if r.get('linkedin') and r.get('linkedin_tipo') == 'empresa':
        ch.append(a(r['linkedin'], 'LinkedIn da rede'))
    for l, u in r['outros']:
        ch.append(a(u, l))
    row('Canais', ' · '.join(ch))
    row('Abordagem recomendada', e(r['abordagem']))
    if r.get('obs'):
        row('Observação', e(r['obs']))
    row('Fontes', ' · '.join(a(u, l) for l, u in r['fontes']) + f' · verificado em {e(r["verificado"])}')
    body = Table([[head], [L]], colWidths=[178 * mm])
    body.setStyle(TableStyle([('BOX', (0, 0), (-1, -1), 0.6, RULE), ('LINEBEFORE', (0, 0), (0, -1), 3, CATCOL[cat]),
                              ('BACKGROUND', (0, 0), (-1, 0), CATBG[cat]), ('LEFTPADDING', (0, 0), (-1, -1), 7), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                              ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
    return [body, Spacer(1, 5)]


def build_pdf():
    doc = BaseDocTemplate(PDF, pagesize=A4, leftMargin=16 * mm, rightMargin=16 * mm, topMargin=17 * mm, bottomMargin=18 * mm,
                          title='Mapeamento de Oportunidades Profissionais em Odontologia', author='Daniel Passos',
                          subject='Inteligência de mercado, prospecção de clínicas e oportunidades para Cirurgião-Dentista Clínico Geral — Bahia')
    fr = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='f', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    frc = Frame(18 * mm, 30 * mm, A4[0] - 36 * mm, A4[1] - 95 * mm, id='c', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id='cover', frames=[frc], onPage=on_cover), PageTemplate(id='main', frames=[fr], onPage=on_page)])
    cat = Counter(r['categoria'] for r in RECS)
    rec_cities = Counter(r['cidade'] for r in RECS)
    nrec = sum(1 for r in RECS if r['cidade'] in PRIORIDADE_MAX)
    NSOC = sum(1 for r in RECS if r['socios'] != NAO and not r['socios'].startswith(('Não localizado', 'Titular')))
    s = []
    # ---- capa
    s += [P('MAPEAMENTO DE OPORTUNIDADES PROFISSIONAIS EM ODONTOLOGIA', 'cover_t'), Spacer(1, 10),
          P('Inteligência de mercado, prospecção de clínicas e oportunidades para Cirurgião-Dentista Clínico Geral — Bahia.', 'cover_s'), Spacer(1, 150),
          P(f'<b>Dr. Daniel Passos</b> — Cirurgião-Dentista Clínico Geral — CRO-BA 32800<br/>Base: São Felipe (BA) · Prioridade: Recôncavo Baiano<br/>'
            f'{len(RECS)} clínicas e unidades ranqueadas · {DATA["total_verificadas"]} estabelecimentos verificados<br/>Data da pesquisa e da verificação: {VER}', 'cover_m'),
          NextPageTemplate('main'), PageBreak()]
    # ---- sumário
    s += [P('Sumário', 'h1')]
    sm = ['1. Perfil profissional', '2. Resumo executivo', '3. Método, classificação e pontuação', '4. Vagas confirmadas (categoria A)',
          '5. Oportunidades potenciais (categoria B)', '6. Ranking das 100 clínicas e unidades', '7. Principais redes odontológicas',
          '8. Proprietários, sócios e gestores — contatos', '9. Fichas detalhadas por cidade', '10. Mensagens prontas para abordagem',
          '11. Plano de ação recomendado', '12. Fontes utilizadas e limitações']
    s += [P(e(x)) for x in sm]
    s += [Spacer(1, 8), P('Todos os links deste documento são clicáveis. A planilha Excel complementar traz as 23 colunas completas de cada clínica.', 'small'), PageBreak()]
    # ---- 1 perfil
    pf = C.PERFIL
    s += [P('1. Perfil profissional', 'h1')]
    rows = [[P('<b>Nome</b>', 'cell'), P(f"{e(pf['nome'])} — nome profissional: {e(pf['nome_prof'])}", 'cell')],
            [P('<b>Atuação</b>', 'cell'), P(e(pf['titulo']) + ' — sem título de especialista; não deve ser apresentado como especialista.', 'cell')],
            [P('<b>Registro</b>', 'cell'), P(e(pf['cro']) + ' (informado por você e confirmado no perfil público do Doctoralia)', 'cell')],
            [P('<b>Residência</b>', 'cell'), P(e(pf['residencia']), 'cell')],
            [P('<b>Vínculo atual</b>', 'cell'), P(e(pf['atual']), 'cell')],
            [P('<b>Disponibilidade</b>', 'cell'), P(e(pf['disp']), 'cell')],
            [P('<b>E-mail</b>', 'cell'), P(a('mailto:' + pf['email'], pf['email']), 'cell')],
            [P('<b>WhatsApp</b>', 'cell'), P(a('https://wa.me/5575988641058', '(75) 98864-1058'), 'cell')]]
    for lab, txt, url in pf['links']:
        rows.append([P(f'<b>{e(lab)}</b>', 'cell'), P(a(url, txt), 'cell')])
    s += [tbl(rows, [38 * mm, 140 * mm], head=False)]
    s += [P('Formação', 'h3')] + bullets(pf['formacao']) + [P('Experiência e atividades', 'h3')] + bullets(pf['experiencia'])
    s += [P('Habilidades clínicas', 'h3')] + bullets(pf['habilidades']) + [P('Dados pendentes', 'h3')] + bullets(pf['pendentes'])
    s += [P(e(pf['fonte']), 'tiny'), PageBreak()]
    # ---- 2 resumo
    s += [P('2. Resumo executivo', 'h1')]
    k = [[P(f'<b>{DATA["total_verificadas"]}</b><br/>estabelecimentos verificados', 'cell'), P(f'<b>{len(RECS)}</b><br/>no ranking final', 'cell'),
          P(f'<b>{cat["A"]}</b><br/>vagas confirmadas (A)', 'cell'), P(f'<b>{cat["B"]}</b><br/>indícios fortes (B)', 'cell'),
          P(f'<b>{cat["C"]}</b><br/>prospecção estratégica (C)', 'cell'), P(f'<b>{nrec}</b><br/>nas 14 cidades de prioridade máxima', 'cell')]]
    kt = Table(k, colWidths=[29.6 * mm] * 6)
    kt.setStyle(TableStyle([('BOX', (0, 0), (-1, -1), 0.5, RULE), ('INNERGRID', (0, 0), (-1, -1), 0.5, RULE), ('BACKGROUND', (0, 0), (-1, -1), PAPER),
                            ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6)]))
    s += [kt, Spacer(1, 6)]
    s += bullets([
        '<b>Não há vaga anunciada para clínico geral dentro do Recôncavo na data da verificação.</b> As seis vagas confirmadas (anúncios do CRO-BA de 13/10 a 10/11/2026, uma delas temporária) são de Salvador ou de anunciantes com DDD 71 que não informam a cidade. Elas estão no topo do ranking por serem as únicas oportunidades comprovadas, não por proximidade.',
        '<b>No Recôncavo, os sinais mais concretos estão em Cruz das Almas:</b> a rede Oral Centter (aberta em 03/2025, matriz em Espinosa-MG) tem vaga de dentista avaliador listada em agregador, e um anúncio do CRO-BA de 13/04/2026 buscava avaliador para 5 dias por semana na cidade.',
        '<b>Três redes populares têm unidades a até 38 km de São Felipe:</b> Vamos Sorrir (2 em SAJ, 1 em Cruz das Almas), AmorSaúde (SAJ e Cruz das Almas, com sócios em comum — um contato abre as duas) e Oral Centter (Cruz das Almas). OdontoCompany, Oral Sin e Odonto Excellence não têm unidade no Recôncavo.',
        f'<b>Santo Antônio de Jesus concentra o mercado privado da região:</b> {rec_cities["Santo Antônio de Jesus"]} clínicas e unidades ranqueadas, 4 delas abertas a partir de 2024 (Elleve, Odonto Médica S&amp;E, Dra. Daniela Araújo e Luciana Marques) e um grupo em expansão, a Clidonto, que abriu unidade em Nazaré em 2024 com os mesmos sócios.',
        '<b>Em São Felipe e Conceição do Almeida não há clínica com estrutura de equipe:</b> o CNES registra apenas consultórios individuais (6 no total), classificados como baixa prioridade. Uma delas tem o CNPJ baixado na Receita Federal.',
        f'<b>Sócios identificados para {NSOC} das {len(RECS)} unidades</b> (quadro societário da Receita Federal), o que permite abordar o proprietário em vez de deixar currículo na recepção. O responsável pela contratação, porém, só é público nos anúncios de vaga.',
    ])
    s += [P('Distribuição do ranking por cidade', 'h3')]
    order = [c for c in PRIORIDADE_MAX if c in rec_cities] + [c for c, _ in rec_cities.most_common() if c not in PRIORIDADE_MAX]
    drows = [[P('Cidade', 'th'), P('Unidades', 'th'), P('A', 'th'), P('B', 'th'), P('C', 'th'), P('D', 'th'), P('Distância de São Felipe', 'th')]]
    for c in order:
        rr = [r for r in RECS if r['cidade'] == c]
        cc = Counter(r['categoria'] for r in rr)
        drows.append([P(e(c) + (' ★' if c in PRIORIDADE_MAX else ''), 'cell'), P(str(len(rr)), 'cell')] + [P(str(cc.get(x, '')) if cc.get(x) else '—', 'cell') for x in 'ABCD']
                     + [P(dist_txt(rr[0]), 'cell')])
    s += [tbl(drows, [58 * mm, 20 * mm, 13 * mm, 13 * mm, 13 * mm, 13 * mm, 48 * mm]), P('★ cidade de prioridade máxima. Distâncias rodoviárias aproximadas (estimativa).', 'tiny'), PageBreak()]
    # ---- 3 método
    s += [P('3. Método, classificação e pontuação', 'h1'),
          P('A investigação cruzou cinco tipos de fonte: (1) classificados do CRO-BA — os 1.400 anúncios mais recentes da categoria Cirurgião-Dentista, lidos um a um para separar ofertas de vaga de pedidos de emprego; '
            '(2) CNES/DataSUS — todos os estabelecimentos de saúde ativos de 21 municípios, filtrados para odontologia privada; (3) Receita Federal — situação cadastral, data de abertura e quadro societário de 131 CNPJs; '
            '(4) sites oficiais das redes (localizadores de unidades e páginas de carreira); (5) portais de emprego e imprensa local. Cada registro traz o link da fonte e a data de verificação.'),
          P('Categorias', 'h3')]
    s += bullets(['<b>A — Vaga confirmada:</b> anúncio de vaga para dentista publicado nos 60 dias anteriores à verificação.',
                  '<b>B — Indício forte:</b> anúncio com mais de 60 dias, vaga listada sem data ou expansão comprovada (nova unidade, empresa recém-aberta com vaga listada).',
                  '<b>C — Prospecção estratégica:</b> sem vaga anunciada, mas com estrutura de clínica, rede ou empresa com sócios — faz sentido enviar currículo espontâneo. É hipótese, não vaga.',
                  '<b>D — Baixa prioridade:</b> consultório individual ou situação cadastral irregular; mantido apenas nas cidades de prioridade máxima.'])
    s += [P('Pontuação (0 a 100)', 'h3')]
    crow = [[P('Critério', 'th'), P('Pontos', 'th'), P('Regra', 'th')]] + [[P(e(x), 'cell'), P(e(y), 'cell'), P(e(z), 'cell')] for x, y, z in C.CRITERIOS]
    s += [tbl(crow, [50 * mm, 16 * mm, 112 * mm]), P('A pontuação não foi elevada para preencher a lista: sem vaga anunciada, nenhuma clínica passa de 64 pontos.', 'small'), PageBreak()]
    # ---- 4 e 5
    for catk, tit, intro in (('A', '4. Vagas confirmadas (categoria A)', 'Anúncios de vaga para dentista publicados nos 60 dias anteriores a ' + VER + '. Responder primeiro a estes.'),
                             ('B', '5. Oportunidades potenciais (categoria B)', 'Anúncios mais antigos, vagas sem data ou expansão comprovada. Não são vagas confirmadas: confirmar antes de se deslocar.')):
        s += [P(tit, 'h1'), P(e(intro)), Spacer(1, 4)]
        for r in [x for x in RECS if x['categoria'] == catk]:
            s += [KeepTogether(card(r))]
        s += [PageBreak()]
    # ---- 6 ranking
    s += [P('6. Ranking das 100 clínicas e unidades', 'h1'), P('Ordenado da maior para a menor pontuação. A ficha completa de cada item está na seção 9 e na planilha Excel.', 'small'), Spacer(1, 4)]
    rr = [[P('#', 'th'), P('Clínica / unidade', 'th'), P('Rede', 'th'), P('Cidade', 'th'), P('Dist.', 'th'), P('Cat.', 'th'), P('Pts', 'th'), P('Contato principal', 'th')]]
    ex = []
    for i, r in enumerate(RECS, 1):
        rede = r['rede'].split(' — ')[0].split(' (')[0]
        rr.append([P(str(r['ranking']), 'cell'), P(e(r['nome']), 'cellb'), P(e(rede), 'cell'), P(e(r['cidade']), 'cell'), P(dist_txt(r), 'cell'),
                   Paragraph(f"<b>{r['categoria']}</b>", S('c' + r['categoria'], fontSize=7.6, leading=9.6, textColor=CATCOL[r['categoria']])),
                   P(f"<b>{r['pontuacao']}</b>", 'cell'), P(contato_principal(r), 'cell')])
        ex.append(('BACKGROUND', (5, i), (5, i), CATBG[r['categoria']]))
    s += [tbl(rr, [8 * mm, 51 * mm, 27 * mm, 26 * mm, 13 * mm, 8 * mm, 9 * mm, 36 * mm], extra=ex), PageBreak()]
    # ---- 7 redes
    s += [P('7. Principais redes odontológicas', 'h1'), P('Análise das redes com presença na Bahia, com prioridade para as que têm unidades próximas de São Felipe.', 'small')]
    for n in C.REDES:
        rows = [[P('<b>Unidades na Bahia</b>', 'cell'), P(e(n['ba']), 'cell')], [P('<b>Cidades</b>', 'cell'), P(e(n['cidades']), 'cell')],
                [P('<b>No Recôncavo?</b>', 'cell'), P(e(n['reconcavo']), 'cell')], [P('<b>Expansão</b>', 'cell'), P(e(n['expansao']), 'cell')],
                [P('<b>Setor de recrutamento</b>', 'cell'), P(e(n['recrut']), 'cell')], [P('<b>Contratação de dentistas</b>', 'cell'), P(e(n['contrat']), 'cell')],
                [P('<b>Formulário/cadastro</b>', 'cell'), P(a(n['form'], n['form']) if n['form'].startswith('http') else e(n['form']), 'cell')],
                [P('<b>Operação regional</b>', 'cell'), P(e(n['regional']), 'cell')], [P('<b>Como enviar o currículo</b>', 'cell'), P(e(n['como']), 'cell')]]
        s += [KeepTogether([P(e(n['rede']), 'h2'), tbl(rows, [40 * mm, 138 * mm], head=False)])]
    s += [PageBreak()]
    # ---- 8 sócios
    s += [P('8. Proprietários, sócios e gestores — contatos', 'h1'),
          P('Sócios conforme o quadro societário público da Receita Federal. Sócio não é necessariamente quem recruta; o responsável técnico (RT), quando conhecido, está na ficha da unidade. '
            'O link "LinkedIn" é uma busca pelo nome — perfil não verificado. Não foram coletados telefones particulares nem endereços residenciais.', 'small'), Spacer(1, 4)]
    sr = [[P('#', 'th'), P('Clínica / unidade', 'th'), P('Cidade', 'th'), P('Sócio(s) — Receita Federal', 'th'), P('Canal profissional', 'th')]]
    for r in RECS:
        if r['socios'] == NAO or r['socios'].startswith('Não localizado'):
            continue
        soc = e(r['socios'])
        if r.get('linkedin') and r.get('linkedin_tipo') == 'busca':
            soc += '<br/>' + a(r['linkedin'], 'LinkedIn (busca)')
        sr.append([P(str(r['ranking']), 'cell'), P(e(r['nome']), 'cellb'), P(e(r['cidade']), 'cell'), P(soc, 'cell'), P(contato_principal(r), 'cell')])
    s += [tbl(sr, [8 * mm, 48 * mm, 26 * mm, 56 * mm, 40 * mm]), PageBreak()]
    # ---- 9 fichas por cidade
    s += [P('9. Fichas detalhadas por cidade', 'h1'), P('Cidades de prioridade máxima primeiro (★), na ordem que você definiu; depois as secundárias.', 'small')]
    for c in order:
        rc = [r for r in RECS if r['cidade'] == c]
        s += [P(f"{e(c)}{' ★' if c in PRIORIDADE_MAX else ''} — {len(rc)} unidade(s) · {dist_txt(rc[0])} de São Felipe", 'h2')]
        for r in rc:
            s += [KeepTogether(card(r))]
    s += [PageBreak()]
    # ---- 10 mensagens
    s += [P('10. Mensagens prontas para abordagem', 'h1'), P('Substitua os campos entre colchetes. Tom profissional e objetivo, sem se apresentar como especialista.', 'small')]
    for tit, txt in (('Modelo 1 — WhatsApp para proprietário(a) ou gestor(a)', C.MSG_WHATS), ('Modelo 1b — WhatsApp em resposta a anúncio de vaga', C.MSG_WHATS_VAGA),
                     ('Modelo 2 — Mensagem de Instagram para clínicas', C.MSG_INSTA), ('Modelo 3 — E-mail profissional com currículo', C.MSG_EMAIL)):
        s += [KeepTogether([P(e(tit), 'h2'), Paragraph(e(txt).replace('\n', '<br/>'), ST['msg'])])]
    s += [P('Como personalizar por perfil de empresa', 'h2')]
    s += [tbl([[P('Perfil', 'th'), P('Ajuste na mensagem', 'th')]] + [[P(e(x), 'cellb'), P(e(y), 'cell')] for x, y in C.PERSONALIZACAO], [58 * mm, 120 * mm]), PageBreak()]
    # ---- 11 plano
    s += [P('11. Plano de ação recomendado', 'h1')]
    for tit, its in C.PLANO:
        s += [P(e(tit), 'h2')] + bullets(its)
    s += [PageBreak()]
    # ---- 12 fontes
    s += [P('12. Fontes utilizadas e limitações', 'h1'), P('Fontes gerais', 'h2')]
    s += [Paragraph(f'{e(l)} — {a(u, u)}', ST['bul'], bulletText='•') for l, u in C.FONTES_GERAIS]
    s += [P('As fontes específicas de cada clínica (ficha do CNES, CNPJ na Receita Federal, anúncio do CRO-BA, página da unidade) estão na ficha de cada item e na aba "Fontes" da planilha.', 'small'),
          P('Limitações e o que não foi possível confirmar', 'h2')] + bullets(C.LIMITACOES)
    doc.build(s)


# ------------------------------------------------------------------ Excel
def build_xlsx():
    wb = Workbook()
    ws = wb.active
    ws.title = 'Clínicas'
    cols = ['Ranking', 'Nome da clínica', 'Nome da rede', 'Cidade', 'Endereço da unidade', 'Distância aproximada de São Felipe (km)', 'Site oficial',
            'Instagram oficial', 'Quantidade de unidades identificadas', 'Perfil da equipe clínica', 'Situação da contratação', 'Descrição da oportunidade',
            'Data da publicação da vaga', 'Nome do proprietário ou sócio', 'Nome do gestor ou responsável pela contratação', 'LinkedIn do responsável',
            'WhatsApp comercial', 'E-mail', 'Outros canais de contato', 'Link da fonte que comprova a informação', 'Compatibilidade com meu perfil', 'Pontuação',
            'Recomendação de abordagem', 'Telefone', 'CNPJ', 'Observações', 'Data da verificação', 'Detalhe da pontuação', 'Status do contato', 'Data do contato']
    widths = [8, 38, 30, 22, 40, 12, 26, 26, 34, 46, 24, 60, 14, 40, 28, 24, 20, 30, 34, 40, 44, 10, 60, 18, 18, 46, 13, 50, 18, 14]
    hfill = PatternFill('solid', fgColor='1F2A44')
    thin = Side(style='thin', color='D5D8D0')
    for i, (c, w) in enumerate(zip(cols, widths), 1):
        cell = ws.cell(row=1, column=i, value=c)
        cell.font = Font(bold=True, color='FFFFFF', name='Arial', size=10)
        cell.fill = hfill
        cell.alignment = Alignment(wrap_text=True, vertical='center', horizontal='center')
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[1].height = 44
    catfill = {'A': 'E3F4E8', 'B': 'FCF0DC', 'C': 'E6EEF8', 'D': 'EEEFEC'}
    lf = Font(color='0B57A4', underline='single', name='Arial', size=9)
    nf = Font(name='Arial', size=9)

    def link(cell, url, text=None):
        cell.value = text or url
        cell.hyperlink = url
        cell.font = lf

    for n, r in enumerate(RECS, 2):
        vals = [r['ranking'], r['nome'], r['rede'], r['cidade'], r['endereco'], r['dist_km'] if r['dist_km'] is not None else 'n/d', None, None,
                r['n_unidades'], r['perfil_equipe'], r['situacao'], r['oportunidade'], r['data_vaga'], r['socios'], r['gestor'], None, None, None, None, None,
                r['compat'], r['pontuacao'], r['abordagem'], r['telefone'] or '—', r['cnpj'] or '—', r.get('obs', ''), r['verificado'],
                '; '.join(f'{k}: {v}' for k, v in r['pontuacao_detalhe'].items()), '', '']
        for i, v in enumerate(vals, 1):
            c = ws.cell(row=n, column=i, value=v)
            c.font = nf
            c.alignment = Alignment(wrap_text=True, vertical='top')
            c.border = Border(bottom=thin)
        if r['site'] != NAO:
            link(ws.cell(row=n, column=7), r['site'])
        else:
            ws.cell(row=n, column=7, value=NAO)
        if r['instagram'] != NAO:
            link(ws.cell(row=n, column=8), r['instagram'])
        else:
            link(ws.cell(row=n, column=8), r.get('instagram_busca', ''), 'Não verificado — clicar para buscar')
        if r.get('linkedin'):
            link(ws.cell(row=n, column=16), r['linkedin'], 'Buscar sócio no LinkedIn (não verificado)' if r.get('linkedin_tipo') == 'busca' else 'LinkedIn da rede')
        else:
            ws.cell(row=n, column=16, value=NAO)
        if r.get('whatsapp'):
            link(ws.cell(row=n, column=17), wa_link(r['whatsapp']), r['whatsapp'])
        else:
            ws.cell(row=n, column=17, value='Não localizado (ver Telefone)')
        if r.get('email'):
            link(ws.cell(row=n, column=18), 'mailto:' + r['email'], r['email'])
        else:
            ws.cell(row=n, column=18, value=NAO)
        if r['outros']:
            link(ws.cell(row=n, column=19), r['outros'][0][1], ' | '.join(l for l, _ in r['outros']))
        else:
            ws.cell(row=n, column=19, value='—')
        link(ws.cell(row=n, column=20), r['fontes'][0][1], r['fontes'][0][0] + (f' (+{len(r["fontes"]) - 1} na aba Fontes)' if len(r['fontes']) > 1 else ''))
        for col in (7, 8, 16, 17, 18, 19, 20):
            ws.cell(row=n, column=col).alignment = Alignment(wrap_text=True, vertical='top')
        ws.cell(row=n, column=11).fill = PatternFill('solid', fgColor=catfill[r['categoria']])
        ws.cell(row=n, column=22).font = Font(bold=True, name='Arial', size=10)
    ws.freeze_panes = 'C2'
    ws.auto_filter.ref = f'A1:{get_column_letter(len(cols))}{len(RECS) + 1}'

    def sheet(name, header, rows, widths, linkcols=()):
        w = wb.create_sheet(name)
        for i, (h, wd) in enumerate(zip(header, widths), 1):
            c = w.cell(row=1, column=i, value=h)
            c.font = Font(bold=True, color='FFFFFF', name='Arial', size=10); c.fill = hfill
            c.alignment = Alignment(wrap_text=True, vertical='center')
            w.column_dimensions[get_column_letter(i)].width = wd
        for n, row in enumerate(rows, 2):
            for i, v in enumerate(row, 1):
                c = w.cell(row=n, column=i, value=v)
                c.font = nf; c.alignment = Alignment(wrap_text=True, vertical='top')
                if i in linkcols and isinstance(v, str) and v.startswith(('http', 'mailto')):
                    c.hyperlink = v; c.font = lf
        w.freeze_panes = 'A2'
        return w

    sheet('Fontes', ['Ranking', 'Clínica', 'Cidade', 'Fonte', 'Link', 'Data da verificação'],
          [[r['ranking'], r['nome'], r['cidade'], l, u, r['verificado']] for r in RECS for l, u in r['fontes']], [9, 44, 24, 50, 80, 14], linkcols=(5,))
    sheet('Canais', ['Ranking', 'Clínica', 'Cidade', 'Canal', 'Link'],
          [[r['ranking'], r['nome'], r['cidade'], l, u] for r in RECS for l, u in
           ([('WhatsApp ' + r['whatsapp'], wa_link(r['whatsapp']))] if r.get('whatsapp') else []) + ([('Telefone ' + r['telefone'], tel_link(r['telefone']))] if r.get('telefone') else [])
           + ([('E-mail', 'mailto:' + r['email'])] if r.get('email') else []) + ([('Site', r['site'])] if r['site'] != NAO else [])
           + ([('Instagram oficial', r['instagram'])] if r['instagram'] != NAO else [('Instagram (busca — não verificado)', r.get('instagram_busca', ''))])
           + ([('LinkedIn (' + ('busca — não verificado' if r.get('linkedin_tipo') == 'busca' else 'rede') + ')', r['linkedin'])] if r.get('linkedin') else []) + [(l, u) for l, u in r['outros']]],
          [9, 44, 24, 40, 90], linkcols=(5,))
    sheet('Redes', ['Rede', 'Unidades na Bahia', 'Cidades', 'No Recôncavo?', 'Expansão', 'Setor de recrutamento', 'Contratação de dentistas', 'Formulário/cadastro', 'Operação regional', 'Como enviar o currículo'],
          [[n['rede'], n['ba'], n['cidades'], n['reconcavo'], n['expansao'], n['recrut'], n['contrat'], n['form'], n['regional'], n['como']] for n in C.REDES],
          [28, 34, 50, 40, 46, 36, 44, 40, 50, 44], linkcols=(8,))
    sheet('Mensagens', ['Modelo', 'Texto'], [['WhatsApp — proprietário(a)/gestor(a)', C.MSG_WHATS], ['WhatsApp — resposta a anúncio', C.MSG_WHATS_VAGA],
                                             ['Instagram — clínicas', C.MSG_INSTA], ['E-mail — currículo', C.MSG_EMAIL]] + [['Personalização: ' + x, y] for x, y in C.PERSONALIZACAO], [38, 120])
    pf = C.PERFIL
    sheet('Perfil', ['Campo', 'Informação'], [['Nome', pf['nome']], ['Nome profissional', pf['nome_prof']], ['Atuação', pf['titulo']], ['Registro', pf['cro']],
                                              ['E-mail', 'mailto:' + pf['email']], ['WhatsApp', 'https://wa.me/5575988641058'], ['Residência', pf['residencia']],
                                              ['Vínculo atual', pf['atual']], ['Disponibilidade', pf['disp']]] + [[l, u] for l, t, u in pf['links']]
          + [['Formação', x] for x in pf['formacao']] + [['Experiência', x] for x in pf['experiencia']] + [['Habilidade', x] for x in pf['habilidades']]
          + [['PENDENTE', x] for x in pf['pendentes']], [26, 120], linkcols=(2,))
    sheet('Critérios', ['Item', 'Pontos / definição', 'Regra'],
          [[x, y, z] for x, y, z in C.CRITERIOS] + [['Categoria A', 'Vaga confirmada', 'Anúncio de vaga para dentista publicado nos 60 dias anteriores à verificação'],
                                                    ['Categoria B', 'Indício forte de contratação', 'Anúncio com mais de 60 dias, vaga sem data ou expansão comprovada'],
                                                    ['Categoria C', 'Prospecção estratégica', 'Sem vaga anunciada; estrutura de clínica/rede justifica currículo espontâneo (hipótese)'],
                                                    ['Categoria D', 'Baixa prioridade', 'Consultório individual ou situação cadastral irregular']]
          + [['Limitação', '', x] for x in C.LIMITACOES], [36, 30, 120])
    wb.save(XLSX)


if __name__ == '__main__':
    build_pdf()
    build_xlsx()
    print('ok', PDF, XLSX)
