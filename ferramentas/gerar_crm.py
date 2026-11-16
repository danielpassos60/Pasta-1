"""Acrescenta as abas de CRM à planilha gerada por gerar_relatorio.py.

ATENÇÃO: rodar gerar_relatorio.py + este script recria a planilha do zero e apaga o que foi
preenchido à mão no painel. Depois que o CRM estiver em uso, atualize a planilha editando-a.
"""
import json, os, re, sys
from urllib.parse import quote
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
RECS = json.load(open(os.path.join(BASE, 'dados', 'clinicas.json'), encoding='utf-8'))['clinicas']
XLSX = os.path.join(BASE, 'relatorio', 'Mapeamento_Oportunidades_Odontologia_Daniel_Passos.xlsx')
NAO = 'Não localizado'
CONF = '16/11/2026, 02:26 UTC (15/11, 23:26 em Salvador)'
PAINEL = 'PAINEL DE PROSPECÇÃO'

SITUACOES = ['Pendente de contato', 'Pesquisa complementar necessária', 'Mensagem preparada', 'Contato realizado', 'Aguardando resposta', 'Respondeu',
             'Solicitou currículo', 'Entrevista agendada', 'Proposta recebida', 'Não possui oportunidade', 'Retomar futuramente']
CANAIS = ['WhatsApp', 'Ligação', 'E-mail', 'Instagram', 'LinkedIn', 'Formulário da rede', 'Visita presencial']
ASS = 'Dr. Daniel Passos\nCirurgião-Dentista — Clínico Geral — CRO-BA 32800\ndanielgomes.ss@yahoo.com | WhatsApp: (75) 98864-1058'


def digs(t):
    return re.sub(r'\D', '', t or '')


def movel(t):
    d = digs(t)
    return len(d) == 11 and d[2] == '9'


def wa(num, texto=''):
    return f'https://wa.me/55{digs(num)}' + (f'?text={quote(texto)}' if texto else '')


def mailto(email, assunto, corpo):
    return f'mailto:{email}?subject={quote(assunto)}&body={quote(corpo)}'


def li_pessoa(nome):
    return 'https://www.linkedin.com/search/results/people/?keywords=' + quote(nome)


def li_empresa(nome):
    return 'https://www.linkedin.com/search/results/companies/?keywords=' + quote(nome)


def socios_lista(r):
    s = r['socios']
    if s == NAO or s.startswith(('Não localizado', 'Titular')):
        return []
    return [x.split('(')[0].strip() for x in s.split(';') if x.strip() and 'Ltda' not in x and 'Participa' not in x]


def nome_curto(r):
    n = re.sub(r'\s*\((anúncio|Feira|matriz|Rua)[^)]*\)', '', r['nome'])
    return re.sub(r'^Anunciante CRO-BA — ', '', n)


WA_CONF = [('Orthos Prime', 'WhatsApp confirmado — o anúncio pede contato por WhatsApp neste número'),
           ('Oral Sin', 'WhatsApp confirmado — link de WhatsApp no site oficial da unidade'),
           ('Oral Centter', 'WhatsApp confirmado — número de agendamento divulgado pela clínica (07/2026); não é canal de RH'),
           ('Keila', 'WhatsApp informado no anúncio de 08/2023 — confirmar se segue ativo'),
           ('Clidonto', 'Tentativa de abertura — celular citado como WhatsApp em diretório não oficial')]


def tipo_contato(r):
    if r.get('whatsapp'):
        for k, v in WA_CONF:
            if k in r['nome']:
                return v, r['whatsapp']
        return 'WhatsApp informado na fonte', r['whatsapp']
    if movel(r.get('telefone')):
        return 'Tentativa de abertura — celular; WhatsApp NÃO confirmado', r['telefone']
    if r.get('telefone'):
        return 'Telefone fixo — ligação (sem WhatsApp)', ''
    return 'Sem telefone localizado', ''


P1 = ['Orthos Prime', 'Clínica em Brotas', 'clínico que faça exodontia', 'extrações às terças', 'Clioral', 'substituição temporária']
P2 = [('Oral Centter', None), ('Clidonto', 'Santo Antônio de Jesus'), ('Clidonto', 'Nazaré'), ('AmorSaúde Santo Antônio de Jesus', None), ('AmorSaúde Cruz das Almas', None),
      ('Vamos Sorrir Santo Antônio de Jesus I', None), ('Vamos Sorrir Santo Antônio de Jesus (Francisco', None), ('Vamos Sorrir Cruz das Almas', None)]


def prioridade(r):
    for i, k in enumerate(P1):
        if k in r['nome']:
            return 1, i
    for i, (k, c) in enumerate(P2):
        if (r['nome'] == k or (k != 'Clidonto' and k in r['nome'])) and (c is None or r['cidade'] == c):
            return 2, i
    return 3, r['ranking']


def msg_generica(r):
    nome, cid = nome_curto(r), r['cidade']
    perto = f', a cerca de {r["dist_km"]} km' if r.get('dist_km') and r['dist_km'] <= 110 else ''
    if 'rede' in r['rede'].lower() or 'franquia' in r['rede'].lower():
        return (f'Olá! Sou o Dr. Daniel Passos, cirurgião-dentista clínico geral (CRO-BA 32800), morador de São Felipe{perto}. Atuo aos sábados em clínica popular em Salvador '
                f'e tenho disponibilidade de segunda a sexta-feira. Gostaria de apresentar meu currículo para a equipe da {nome}. '
                'Poderiam me indicar o contato de quem cuida da seleção de dentistas? Obrigado!')
    return (f'Olá! Sou o Dr. Daniel Passos, cirurgião-dentista clínico geral (CRO-BA 32800), morador de São Felipe{perto}. Tenho disponibilidade de segunda a sexta-feira '
            f'e experiência em avaliação, dentística e exodontias. Gostaria de apresentar meu currículo à direção da {nome}, em {cid}, para dias fixos ou cobertura de férias. '
            'Com quem posso falar? Obrigado!')


def email_generico(r):
    nome, cid = nome_curto(r), r['cidade']
    return ('Cirurgião-dentista clínico geral — currículo — Dr. Daniel Passos (CRO-BA 32800)',
            f'Prezados,\n\nSou cirurgião-dentista clínico geral (CRO-BA 32800), graduado pela UNIME e morador de São Felipe-BA. Gostaria de apresentar meu currículo à {nome}'
            f'{" em " + cid if cid in ("Santo Antônio de Jesus", "Cruz das Almas", "Nazaré", "Cachoeira", "Valença", "Amargosa", "Feira de Santana", "Salvador", "Lauro de Freitas") and cid not in nome else ""}.\n\n'
            'Atuo aos sábados em clínica popular em Salvador (avaliação, dentística e exodontias) e tenho disponibilidade de segunda a sexta-feira.\n\n'
            'Poderiam encaminhar meu currículo ao responsável pela seleção de dentistas?\n\nCurrículo em anexo.\n\nAtenciosamente,\n' + ASS)


# ---------------------------------------------------------------- Primeiros 15 contatos (mensagens individuais)
def E(assunto, corpo):
    return assunto, corpo + '\n\nAtenciosamente,\n' + ASS


PRIM = [
    dict(k='Orthos Prime', canal='WhatsApp', pessoa='Contato do anúncio (pessoa não identificada). Sócia-administradora na Receita Federal: Rebeca Alves de Almeida.',
         msg='Olá! Vi no classificados do CRO-BA o anúncio de 15/10 com vaga para dentista clínico geral. Sou o Dr. Daniel Passos, cirurgião-dentista clínico geral (CRO-BA 32800). '
             'Atuo em clínica popular em Salvador, com rotina de avaliação, dentística e exodontias, incluindo terceiros molares, e tenho disponibilidade de segunda a sexta-feira. '
             'A vaga segue aberta? Se sim, posso enviar meu currículo por aqui. Obrigado!',
         alt='E-mail do anúncio: orthosprime.doc@outlook.com', pend='O anúncio não cita o nome da clínica; a mensagem não afirma que é a Orthos Prime. Anexar o currículo quando pedirem.'),
    dict(k='Clínica em Brotas', canal='WhatsApp', pessoa='Contato do anúncio (pessoa não identificada).',
         msg='Olá! Vi no classificados do CRO-BA o anúncio de 13/10 da clínica em Brotas, com vaga para clínico geral às quintas-feiras. Sou o Dr. Daniel Passos, cirurgião-dentista '
             'clínico geral (CRO-BA 32800). Tenho as quintas livres e experiência em clínica popular: avaliação, dentística e exodontias. A vaga segue aberta? '
             'Se houver outros dias disponíveis, também tenho interesse. Posso enviar meu currículo por aqui? Obrigado!',
         alt='E-mail do anúncio: cristina.odonto12@gmail.com; ligação para o mesmo número.', pend='Se o número não tiver WhatsApp, ligar. Avaliar o deslocamento São Felipe–Salvador para um dia fixo.'),
    dict(k='clínico que faça exodontia', canal='WhatsApp', pessoa='Contato do anúncio (pessoa não identificada).',
         msg='Olá! Vi no classificados do CRO-BA o anúncio de 17/10 com vaga para clínico que faça exodontia. Sou o Dr. Daniel Passos, cirurgião-dentista clínico geral (CRO-BA 32800), '
             'com formação complementar em Cirurgia Oral Menor e rotina de exodontias, incluindo terceiros molares inclusos. Tenho disponibilidade de segunda a sexta-feira. '
             'A vaga segue aberta? Pode me informar o local e os dias de atendimento? Envio o currículo em seguida. Obrigado!',
         alt='E-mail do anúncio: adriianelima@hotmail.com; ligação para o mesmo número.',
         pend='O anúncio exige 2 anos de experiência: confirme se você atende antes de enviar (a mensagem não afirma esse tempo).'),
    dict(k='extrações às terças', canal='WhatsApp', pessoa='Contato do anúncio (pessoa não identificada).',
         msg='Olá! Vi seus anúncios no classificados do CRO-BA: o de 27/10, para extrações às terças-feiras, e o de 10/11, para clínico geral. Sou o Dr. Daniel Passos, '
             'cirurgião-dentista clínico geral (CRO-BA 32800), com curso de Cirurgia Oral Menor e rotina de exodontias, incluindo terceiros molares. Tenho as terças livres e '
             'disponibilidade em outros dias da semana. As vagas seguem abertas? Pode me informar o local? Envio o currículo em seguida. Obrigado!',
         alt='E-mail do anúncio: jessicajeu_14@hotmail.com; ligação para o mesmo número.', pend='Local não informado nos anúncios (DDD 71).'),
    dict(k='Clioral', canal='E-mail', pessoa='Destinatário indicado no anúncio: admin@clioral.com.br (pessoa não identificada).',
         email=E('Vaga de dentista avaliador (CRO-BA, 09/11) — Dr. Daniel Passos, CRO-BA 32800',
                 'Prezados,\n\nEnvio meu currículo para a vaga de dentista avaliador anunciada no classificados do CRO-BA em 09/11.\n\n'
                 'Sou cirurgião-dentista clínico geral (CRO-BA 32800), graduado pela UNIME. Atuo em clínica popular em Salvador, onde faço avaliação, diagnóstico e planejamento de '
                 'tratamentos, além de dentística e exodontias. Tenho disponibilidade de segunda a sexta-feira.\n\n'
                 'Poderiam me informar o endereço da clínica e os dias previstos para a função?\n\nCurrículo em anexo. Fico à disposição para uma conversa.'),
         alt='Telefone do anúncio: (71) 99140-9257 (tentativa de WhatsApp).',
         pend='Anexar o currículo (Curriculo_Daniel_Passos_Cirurgiao-Dentista.pdf) antes de enviar. A vaga pede experiência em vendas — o texto cita só avaliação e planejamento.'),
    dict(k='Oral Centter', canal='WhatsApp', pessoa='Sócios na Receita Federal: Maria Alice Silveira de Freitas (sócia-administradora) e Luciano Freitas Antunes. Gestor local não identificado.',
         msg='Olá! Sei que este é o canal de agendamento, então serei breve: sou o Dr. Daniel Passos, cirurgião-dentista clínico geral (CRO-BA 32800), morador de São Felipe. '
             'Tenho experiência em clínica popular e disponibilidade de segunda a sexta-feira, e gostaria de apresentar meu currículo para a unidade de Cruz das Almas. '
             'Poderiam me indicar o contato da coordenação clínica ou de quem cuida da seleção de dentistas? Obrigado!',
         alt='Visita à unidade (Rua 15 de Novembro, 68, Centro); busca dos sócios no LinkedIn.', pend='Número é de agendamento de pacientes; o objetivo é obter o contato certo.'),
    dict(k='Clidonto', cidade='Santo Antônio de Jesus', canal='WhatsApp', pessoa='Sócios-administradores na Receita Federal: Everton Miguel Ferreira Pereira e José Luiz Ollero Speggiorin.',
         msg='Olá! Sou o Dr. Daniel Passos, cirurgião-dentista clínico geral (CRO-BA 32800), morador de São Felipe. Acompanho o crescimento da Clidonto, com unidades em '
             'Santo Antônio de Jesus e Nazaré, e gostaria de apresentar meu currículo à direção. Tenho disponibilidade de segunda a sexta-feira e experiência em avaliação, '
             'dentística e exodontias, podendo atender nas duas cidades. Poderiam me indicar com quem devo falar sobre a seleção de dentistas? Obrigado!',
         alt='Ligação para a sede: (75) 3631-5435; Instagram @clidonto; LinkedIn dos sócios.', pend='Celular vem de diretório não oficial — se não abrir no WhatsApp, ligar para o fixo.'),
    dict(k='Clidonto', cidade='Nazaré', canal='(coberto pelo contato com a sede)', pessoa='Mesmos sócios da sede: Everton Miguel Ferreira Pereira e José Luiz Ollero Speggiorin.',
         msg='Sem envio separado: a mensagem à sede já oferece atendimento em Nazaré. Enviar outra mensagem aos mesmos sócios seria repetitivo.',
         alt='Se a sede indicar um gestor em Nazaré, usar a mesma mensagem trocando "à direção" por "à unidade de Nazaré".', pend='Telefone próprio da unidade de Nazaré não confirmado.'),
    dict(k='AmorSaúde Santo Antônio de Jesus', canal='E-mail', pessoa='Sócios-administradores na Receita Federal: Alex Alvares Pimentel Maciel e Altair de Jesus Vilar Guimaraes. Gerente da unidade não identificado.',
         email=E('Cirurgião-dentista clínico geral — currículo para a unidade de Santo Antônio de Jesus — Dr. Daniel Passos (CRO-BA 32800)',
                 'Prezados,\n\nSou cirurgião-dentista clínico geral (CRO-BA 32800), morador de São Felipe, e gostaria de apresentar meu currículo à gerência da AmorSaúde Santo Antônio de Jesus.\n\n'
                 'Atuo aos sábados em clínica popular em Salvador, com rotina de alto fluxo: avaliação, dentística e exodontias. Tenho disponibilidade de segunda a sexta-feira e posso '
                 'atender também na unidade de Cruz das Almas.\n\nPoderiam encaminhar meu currículo ao responsável pela seleção de dentistas?\n\nCurrículo em anexo.'),
         alt='Ligação: (75) 3016-2505; formulário "Trabalhe Conosco" da rede.', pend='Anexar o currículo (Curriculo_Daniel_Passos_Cirurgiao-Dentista.pdf) antes de enviar. E-mail vem do cadastro CNES da unidade.'),
    dict(k='AmorSaúde Cruz das Almas', canal='WhatsApp', pessoa='Sócios na Receita Federal: Alex Alvares Pimentel Maciel e Valdiria Alves Ferreira (sócios-administradores); Altair de Jesus Vilar Guimaraes (administrador). Gerente não identificado.',
         msg='Olá! Sou o Dr. Daniel Passos, cirurgião-dentista clínico geral (CRO-BA 32800), morador de São Felipe. Atuo aos sábados em clínica popular em Salvador e tenho '
             'disponibilidade de segunda a sexta-feira. Gostaria de apresentar meu currículo para a odontologia da AmorSaúde Cruz das Almas. Poderiam me indicar o contato da '
             'gerência ou de quem cuida da seleção de dentistas? Obrigado!',
         alt='Formulário "Trabalhe Conosco" da rede; visita à unidade (Praça Geraldo Meyer Suerdieck, 48).', pend='Número é o "Falar agora" do site oficial (celular); WhatsApp não confirmado.'),
    dict(k='Vamos Sorrir Santo Antônio de Jesus I', canal='Ligação', pessoa='Gestor da unidade não identificado. Sócios do grupo (unidades de Salvador): Felipe Gallego, Lucas de Abreu Campos Carvalho, Philipe Moraes de Gouvea, Vandeir José de Oliveira Junior.',
         msg='ROTEIRO DE LIGAÇÃO — "Bom dia! Meu nome é Daniel Passos, sou cirurgião-dentista clínico geral, CRO-BA 32800. Trabalho em clínica popular em Salvador e tenho '
             'disponibilidade de segunda a sexta. Com quem posso falar sobre a seleção de dentistas da unidade? Pode me passar o nome e o WhatsApp ou e-mail da coordenação clínica '
             'para eu enviar meu currículo?"',
         alt='Visita à unidade (Rua Gorgônio José de Araújo, 86, Centro).', pend='Telefone fixo — não há WhatsApp nem e-mail localizados.'),
    dict(k='Vamos Sorrir Cruz das Almas', canal='(pesquisa complementar)', pessoa='Gestor da unidade não identificado.',
         msg='Sem canal localizado. Usar o mesmo roteiro de ligação da unidade de SAJ quando o telefone for encontrado (Google Maps ou visita à Praça Senador Themístocles).',
         alt='Perguntar pelo contato de Cruz das Almas na ligação para a unidade de SAJ.', pend='Telefone e número do endereço não confirmados.'),
    dict(k='dentista avaliador em Cruz das Almas', canal='WhatsApp', pessoa='Contato do anúncio (pessoa não identificada).',
         msg='Olá! Vi no classificados do CRO-BA o anúncio de 13/04 buscando dentista com experiência em avaliação e orçamento para Cruz das Almas. Sou o Dr. Daniel Passos, '
             'cirurgião-dentista clínico geral (CRO-BA 32800), morador de São Felipe, a cerca de 38 km. Faço avaliação e planejamento em clínica popular e tenho disponibilidade de '
             'segunda a sexta-feira. A vaga ainda está aberta, ou vocês mantêm um banco de currículos? Obrigado!',
         alt='E-mail do anúncio: mayaraolivave@gmail.com.', pend='Anúncio de abril (7 meses) — vaga pode estar preenchida.'),
    dict(k='sextas em Santo Amaro', canal='WhatsApp', pessoa='Contato do anúncio (pessoa não identificada).',
         msg='Olá! Vi no classificados do CRO-BA o anúncio de 13/06 com vaga para clínico geral às sextas-feiras em Santo Amaro. Sou o Dr. Daniel Passos, cirurgião-dentista '
             'clínico geral (CRO-BA 32800), com experiência em avaliação, dentística e exodontias. Tenho as sextas livres. A vaga ainda está aberta? Se sim, envio meu currículo '
             'em seguida. Obrigado!',
         alt='E-mail do anúncio: izislima@gmail.com.', pend='Anúncio de junho (5 meses) — vaga pode estar preenchida.'),
    dict(k='Keila', canal='WhatsApp', pessoa='Sócios-administradores na Receita Federal: Keila Oliveira da Silva Freire e José Jorge Freire dos Santos.',
         msg='Olá! Sou o Dr. Daniel Passos, cirurgião-dentista clínico geral (CRO-BA 32800), morador de São Felipe. Vi que a clínica da Dra. Keila Oliveira já buscou dentista '
             'clínico com exodontia pelo CRO-BA e gostaria de apresentar meu currículo: tenho formação complementar em Cirurgia Oral Menor, rotina de exodontias e dentística, '
             'e disponibilidade de segunda a sexta-feira. Posso enviar o currículo por aqui? Obrigado!',
         alt='E-mail do anúncio: consultoriokeila2023@gmail.com.', pend='WhatsApp vem do anúncio de 08/2023 — pode ter mudado.'),
]


def achar(p):
    for r in RECS:
        if (r['nome'] == p['k'] or (p['k'] != 'Clidonto' and p['k'] in r['nome'])) and ('cidade' not in p or r['cidade'] == p['cidade']):
            return r
    raise SystemExit('não achei ' + p['k'])


HF = PatternFill('solid', fgColor='1F2A44')
thin = Side(style='thin', color='D5D8D0')
NF = Font(name='Arial', size=9)
LF = Font(name='Arial', size=9, color='0B57A4', underline='single')


def cab(ws, cols, widths, h=40):
    for i, (c, w) in enumerate(zip(cols, widths), 1):
        x = ws.cell(row=1, column=i, value=c)
        x.font = Font(bold=True, color='FFFFFF', name='Arial', size=10); x.fill = HF
        x.alignment = Alignment(wrap_text=True, vertical='center', horizontal='center')
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[1].height = h
    ws.freeze_panes = 'A2'


def put(ws, row, col, val, url=None, bold=False, fill=None):
    c = ws.cell(row=row, column=col, value=val)
    c.font = LF if url else Font(name='Arial', size=9, bold=bold)
    if url:
        assert len(url) < 2050, (len(url), val)
        c.hyperlink = url
    c.alignment = Alignment(wrap_text=True, vertical='top')
    c.border = Border(bottom=thin)
    if fill:
        c.fill = PatternFill('solid', fgColor=fill)
    return c


def lista(ws, rng, opcoes):
    dv = DataValidation(type='list', formula1='"' + ','.join(opcoes) + '"', allow_blank=True)
    ws.add_data_validation(dv); dv.add(rng)


def main():
    wb = load_workbook(XLSX)
    for n in (PAINEL, 'PRIMEIROS 15 — APROVAÇÃO', 'LINKEDIN', 'REGISTRO DE CONTATOS', 'CONFERÊNCIA', 'RESUMO', 'COMO USAR'):
        if n in wb.sheetnames:
            del wb[n]
    prim = {id(achar(p)): p for p in PRIM}
    ordem = sorted(RECS, key=prioridade)
    # ------------------------------------------------ PAINEL
    ws = wb.create_sheet(PAINEL, 0)
    cols = ['#', 'Prioridade', 'Clínica', 'Rede', 'Cidade', 'Dist. (km)', 'Categoria de oportunidade', 'Proprietário ou gestor', 'Telefone', 'Tipo de contato',
            'WhatsApp — link direto com mensagem', 'E-mail — link com assunto e texto', 'Instagram', 'LinkedIn — busca do responsável', 'Situação da abordagem',
            'Data do primeiro contato', 'Canal utilizado', 'Resposta recebida', 'Data do próximo acompanhamento', 'Possibilidade de entrevista', 'Resultado final', 'Observações']
    cab(ws, cols, [5, 9, 34, 24, 20, 8, 22, 34, 16, 30, 24, 24, 20, 22, 24, 13, 15, 30, 14, 14, 20, 46])
    catfill = {'A': 'E3F4E8', 'B': 'FCF0DC', 'C': 'E6EEF8', 'D': 'EEEFEC'}
    for n, r in enumerate(ordem, 2):
        pr, _ = prioridade(r)
        tipo, num = tipo_contato(r)
        p = prim.get(id(r))
        soc = socios_lista(r)
        dono = ('Sócios (Receita Federal): ' + '; '.join(soc)) if soc else ('Contato do anúncio — pessoa não identificada' if 'CRO-BA' in r['nome'] or r['categoria'] in 'AB' else 'Não identificado')
        put(ws, n, 1, r['ranking']); put(ws, n, 2, pr, bold=True); put(ws, n, 3, r['nome'], bold=True); put(ws, n, 4, r['rede']); put(ws, n, 5, r['cidade'])
        put(ws, n, 6, r['dist_km'] if r['dist_km'] is not None else 'n/d'); put(ws, n, 7, r['situacao'], fill=catfill[r['categoria']]); put(ws, n, 8, dono)
        put(ws, n, 9, r.get('whatsapp') or r.get('telefone') or '—'); put(ws, n, 10, tipo)
        if num:
            texto = p['msg'] if p and p['canal'] == 'WhatsApp' else msg_generica(r)
            put(ws, n, 11, 'Abrir WhatsApp ' + num, wa(num, texto))
        else:
            put(ws, n, 11, '—')
        if r.get('email'):
            ass, corpo = p['email'] if p and 'email' in p else email_generico(r)
            put(ws, n, 12, r['email'], mailto(r['email'], ass, corpo))
        else:
            put(ws, n, 12, '—')
        if r['instagram'] != NAO:
            put(ws, n, 13, 'Perfil oficial' + (' (@clidonto — conferir)' if 'clidonto' in r['instagram'] else ' da rede'), r['instagram'])
        else:
            put(ws, n, 13, 'Não verificado — buscar', r.get('instagram_busca'))
        if soc:
            put(ws, n, 14, 'Buscar ' + soc[0], li_pessoa(soc[0]))
        else:
            put(ws, n, 14, 'Buscar a empresa', li_empresa(nome_curto(r)))
        if p:
            sit = 'Pesquisa complementar necessária' if 'pesquisa' in p['canal'] or 'coberto' in p['canal'] else 'Mensagem preparada'
        else:
            sit = 'Pendente de contato' if (num or r.get('email') or r.get('telefone') or any('Trabalhe' in l for l, _ in r['outros'])) else 'Pesquisa complementar necessária'
        put(ws, n, 15, sit)
        for c in (16, 17, 18, 20, 21):
            put(ws, n, c, '')
        put(ws, n, 19, f'=IF(P{n}="","",WORKDAY(P{n},4))').number_format = 'DD/MM/YYYY'
        ws.cell(row=n, column=16).number_format = 'DD/MM/YYYY'
        obs = []
        if p:
            obs.append('1º LOTE (15 primeiros) — ver aba de aprovação. ' + p['pend'])
        if r.get('obs'):
            obs.append(r['obs'])
        if r['data_vaga'] != '—':
            obs.append('Anúncio de ' + r['data_vaga'] + '.')
        put(ws, n, 22, ' '.join(obs))
    last = len(ordem) + 1
    ws.auto_filter.ref = f'A1:V{last}'
    ws.freeze_panes = 'D2'
    lista(ws, f'O2:O{last}', SITUACOES); lista(ws, f'Q2:Q{last}', CANAIS)
    lista(ws, f'T2:T{last}', ['Alta', 'Média', 'Baixa', 'A definir'])
    lista(ws, f'U2:U{last}', ['Em andamento', 'Entrevista realizada', 'Contratado', 'Parceria por diária/turno', 'Sem oportunidade', 'Sem resposta', 'Desisti'])
    verde, laranja, cinza = PatternFill('solid', bgColor='B7E4C7'), PatternFill('solid', bgColor='FFD9A0'), PatternFill('solid', bgColor='E2E3DF')
    ws.conditional_formatting.add(f'C2:O{last}', FormulaRule(formula=['OR($O2="Respondeu",$O2="Solicitou currículo",$O2="Entrevista agendada",$O2="Proposta recebida")'], fill=verde))
    ws.conditional_formatting.add(f'S2:S{last}', FormulaRule(formula=['AND($S2<>"",$S2<=TODAY(),OR($O2="Contato realizado",$O2="Aguardando resposta"))'], fill=laranja))
    ws.conditional_formatting.add(f'C2:O{last}', FormulaRule(formula=['$O2="Não possui oportunidade"'], fill=cinza))
    # ------------------------------------------------ PRIMEIROS 15
    w2 = wb.create_sheet('PRIMEIROS 15 — APROVAÇÃO', 1)
    cab(w2, ['Ordem', 'Prioridade', 'Destinatário', 'Cidade', 'Pessoa responsável (o que se sabe)', 'Canal principal', 'Tipo do contato', 'Abrir (link pronto)',
             'Mensagem — texto completo', 'Canal alternativo', 'Pendências antes do envio', 'Sua aprovação', 'Data do envio'], [7, 9, 30, 18, 38, 14, 30, 24, 80, 34, 40, 14, 12])
    for i, p in enumerate(PRIM, 1):
        r = achar(p)
        tipo, num = tipo_contato(r)
        n = i + 1
        put(w2, n, 1, i, bold=True); put(w2, n, 2, prioridade(r)[0]); put(w2, n, 3, r['nome'], bold=True); put(w2, n, 4, r['cidade']); put(w2, n, 5, p['pessoa']); put(w2, n, 6, p['canal'])
        if p['canal'] == 'E-mail':
            ass, corpo = p['email']
            put(w2, n, 7, 'E-mail — ' + ('indicado no anúncio' if 'Clioral' in r['nome'] else 'cadastro CNES da unidade'))
            put(w2, n, 8, 'Abrir e-mail para ' + r['email'], mailto(r['email'], ass, corpo)); put(w2, n, 9, 'ASSUNTO: ' + ass + '\n\n' + corpo)
        elif p['canal'] == 'WhatsApp':
            put(w2, n, 7, tipo); put(w2, n, 8, 'Abrir WhatsApp ' + num, wa(num, p['msg'])); put(w2, n, 9, p['msg'])
        elif p['canal'] == 'Ligação':
            put(w2, n, 7, tipo); put(w2, n, 8, 'Ligar ' + r['telefone'], 'tel:+55' + digs(r['telefone'])); put(w2, n, 9, p['msg'])
        else:
            put(w2, n, 7, '—'); put(w2, n, 8, 'Ver no mapa', next((u for l, u in r['outros'] if l == 'Google Maps'), None)); put(w2, n, 9, p['msg'])
        put(w2, n, 10, p['alt']); put(w2, n, 11, p['pend']); put(w2, n, 12, 'Pendente'); put(w2, n, 13, '')
        w2.cell(row=n, column=13).number_format = 'DD/MM/YYYY'
    lista(w2, 'L2:L16', ['Pendente', 'Aprovado', 'Ajustar', 'Não enviar'])
    # ------------------------------------------------ LINKEDIN
    w3 = wb.create_sheet('LINKEDIN', 2)
    cab(w3, ['Prioridade', 'Clínica', 'Cidade', 'Pessoa', 'Vínculo e fonte', 'Buscar pessoa', 'Buscar empresa', 'Como conferir se é a pessoa certa',
             'Convite de conexão (até 200 caracteres)', 'Mensagem após aceitar', 'Status da conferência', 'Link do perfil confirmado'], [9, 30, 18, 30, 26, 16, 16, 44, 50, 60, 20, 30])
    n = 2
    vistos = set()
    for r in ordem:
        pr = prioridade(r)[0]
        if pr == 3 and r['ranking'] > 45:
            continue
        soc = socios_lista(r)
        clin = re.sub(r' Santo Antônio de Jesus.*| Cruz das Almas.*| Clínicas Odontológicas.*', '', nome_curto(r))
        for s in soc:
            if (s, clin) in vistos:
                continue
            vistos.add((s, clin))
            prim_nome = s.split()[0]
            conv = f'Olá, {prim_nome}! Sou cirurgião-dentista clínico geral (CRO-BA 32800), de São Felipe. Acompanho o trabalho da {clin} e gostaria de me conectar.'
            if len(conv) > 200:
                conv = f'Olá, {prim_nome}! Sou cirurgião-dentista clínico geral (CRO-BA 32800), de São Felipe, e gostaria de me conectar.'
            assert len(conv) <= 200
            put(w3, n, 1, pr); put(w3, n, 2, r['nome'], bold=True); put(w3, n, 3, r['cidade']); put(w3, n, 4, s, bold=True)
            put(w3, n, 5, 'Sócio(a) no quadro societário (Receita Federal). Não confirma que recruta.')
            put(w3, n, 6, 'Buscar pessoa', li_pessoa(s)); put(w3, n, 7, 'Buscar empresa', li_empresa(clin))
            put(w3, n, 8, f'Aceitar só se o perfil citar odontologia/saúde E {r["cidade"]} ou região E a {clin} (ou a razão social). Nome igual sem esses três sinais = homônimo: descartar.')
            put(w3, n, 9, conv)
            put(w3, n, 10, f'Obrigado por aceitar, {prim_nome}. Tenho disponibilidade de segunda a sexta e experiência em clínica geral — avaliação, dentística e exodontias. '
                           f'Se fizer sentido, envio meu currículo; se preferir, me indique quem cuida da seleção de dentistas na {clin}.')
            put(w3, n, 11, 'Não pesquisado'); put(w3, n, 12, '')
            n += 1
    for nome, cid, url in (('AmorSaúde (página da rede)', 'Rede', 'https://www.linkedin.com/company/amorsaudebrasil/'), ('Oral Sin (franqueadora)', 'Rede', 'https://www.linkedin.com/company/oralsinfranchising/'),
                           ('Odonto Excellence (franqueadora)', 'Rede', 'https://br.linkedin.com/company/odontoexcellencefranchising'), ('Vamos Sorrir Odontologia', 'Rede', li_empresa('Vamos Sorrir Odontologia')),
                           ('Clioral', 'Não informada', li_empresa('Clioral')), ('Orthos Prime', 'Salvador', li_empresa('Orthos Prime'))):
        put(w3, n, 1, '—'); put(w3, n, 2, nome, bold=True); put(w3, n, 3, cid); put(w3, n, 4, 'Perfil institucional'); put(w3, n, 5, 'Página da empresa — usar para achar RH, gerentes e coordenadores na aba "Pessoas".')
        put(w3, n, 6, '—'); put(w3, n, 7, 'Abrir', url); put(w3, n, 8, 'Na página, abrir "Pessoas" e filtrar por Bahia; procurar cargos de gerente de unidade, coordenador clínico e RH.')
        put(w3, n, 9, 'Olá! Sou cirurgião-dentista clínico geral (CRO-BA 32800), na Bahia. Gostaria de me conectar para apresentar meu currículo à rede.'); put(w3, n, 10, '')
        put(w3, n, 11, 'Não pesquisado'); put(w3, n, 12, ''); n += 1
    lista(w3, f'K2:K{n}', ['Não pesquisado', 'Perfil confirmado', 'Perfil não encontrado', 'Homônimo — descartar', 'Convite enviado', 'Conectado'])
    w3.auto_filter.ref = f'A1:L{n - 1}'
    # ------------------------------------------------ REGISTRO
    w4 = wb.create_sheet('REGISTRO DE CONTATOS', 3)
    cab(w4, ['Data', 'Clínica', 'Canal', 'Destinatário', 'Conteúdo enviado', 'Resposta recebida', 'Pediram currículo?', 'Próximo acompanhamento', 'Observações'], [12, 34, 16, 28, 60, 50, 14, 14, 40])
    for n in range(2, 202):
        for c in range(1, 10):
            put(w4, n, c, f'=IF(A{n}="","",WORKDAY(A{n},4))' if c == 8 else '')
        w4.cell(row=n, column=1).number_format = 'DD/MM/YYYY'; w4.cell(row=n, column=8).number_format = 'DD/MM/YYYY'
    lista(w4, 'C2:C201', CANAIS); lista(w4, 'G2:G201', ['Sim', 'Não'])
    # ------------------------------------------------ CONFERÊNCIA
    w5 = wb.create_sheet('CONFERÊNCIA', 4)
    cab(w5, ['Item conferido', 'Resultado', 'O que isso significa', 'Quando'], [36, 70, 60, 26])
    conf = [
        ('Data de referência', 'A execução ocorreu em 16/11/2026, 02:26 UTC — 15/11/2026, 23:26 no horário de Salvador. A pesquisa original foi feita poucas horas antes, na mesma data UTC.',
         'A data "16/11/2026" do relatório é a data em UTC. Os itens prioritários foram reconferidos agora; os demais mantêm a verificação original.'),
        ('Vagas do CRO-BA (11 anúncios)', 'Todos os anúncios continuam publicados, com as mesmas datas e contatos. O site não marca anúncio como encerrado.',
         'Anúncio no ar NÃO confirma vaga aberta. Só o anunciante confirma — por isso toda mensagem pergunta se a vaga segue aberta.'),
        ('Novos anúncios', 'Nenhuma oferta nova entre 13/11 e a reconferência. Foram localizados 2 anúncios que o primeiro filtro tinha descartado: extrações às terças (27/10, mesmo contato de "dias para clínico geral") e substituição temporária de 04 a 09/01/2027 (06/11).',
         'O filtro inicial excluía textos iniciados por "Procuro". Corrigido; os dois anúncios foram incorporados.'),
        ('Anunciante das "3 vagas"', 'Identificado como Orthos Prime LTDA (CNPJ 26.461.678/0001-65), Rua Thomaz Gonzaga, 121, Pernambués, Salvador; sócia-administradora Rebeca Alves de Almeida.',
         'Identificação pelo e-mail do anúncio (orthosprime.doc@outlook.com) + CNPJ. O anúncio não cita o nome: confirmar no contato.'),
        ('Oral Centter — Cruz das Almas', 'Endereço confirmado (Rua 15 de Novembro, 68) e WhatsApp de agendamento (75) 98168-9393, divulgados em notícia local de 07/2026. Vaga de avaliador: sem nova evidência.',
         'Os telefones de diretórios seguem sem confirmação. O WhatsApp é de pacientes, não de RH.'),
        ('Clidonto', 'Três unidades (SAJ, Nazaré e Amargosa) segundo a Agência Sebrae; telefones da sede (75) 3631-5435 e 3632-1891; perfil @clidonto (Threads/Instagram); premiada em 2023 e 2025.',
         'A unidade de Amargosa não estava no levantamento. Sócios reconfirmados na Receita Federal.'),
        ('Sócios (Receita Federal)', 'Reconsultados os CNPJs de Clidonto SAJ e Nazaré, AmorSaúde SAJ e Cruz das Almas, Oral Centter, Dra. Keila e Orthos Prime: todos ativos. AmorSaúde Cruz das Almas tem também Valdiria Alves Ferreira como sócia-administradora.',
         'Sócio não é necessariamente quem contrata. Gestores de unidade e coordenadores clínicos continuam não identificados — dependem de LinkedIn/ligação.'),
        ('Telefones e e-mails', 'Conferidos contra a fonte (anúncio, site oficial, CNES). Removido o telefone da Dra. Keila que vinha do cadastro e pertence a terceiros. Não foi possível testar se os números atendem.',
         'Classificação por linha na coluna "Tipo de contato".'),
        ('WhatsApp confirmado × tentativa', 'Confirmados pela fonte: Orthos Prime, Oral Sin Salvador e Lauro, Oral Centter (agendamento). Informado em anúncio antigo: Dra. Keila. Todos os demais celulares são "tentativa de abertura".',
         'Ser celular não prova que há WhatsApp. O link wa.me só confirma ao abrir no seu aparelho.'),
        ('Redes sociais', 'Perfis oficiais das redes (AmorSaúde, OdontoCompany, Oral Sin, Odonto Excellence) vêm dos sites oficiais. Instagram/LinkedIn exigem login e NÃO puderam ser abertos nesta sessão.',
         'Para clínicas independentes a planilha traz link de busca, marcado como não verificado.'),
        ('Duplicações', 'Nenhum registro duplicado. Telefones repetidos entre unidades da AmorSaúde são centrais compartilhadas. Dra. Daniela Araújo e Luciana Marques dividem o endereço (Landulfo Alves, 186), mas são empresas distintas.',
         'Clidonto SAJ e Nazaré têm os mesmos sócios: uma única abordagem. O anúncio de avaliador em Cruz das Almas pode ser da Oral Centter (não confirmado).'),
        ('Pendências suas', 'Resolvidas: WhatsApp (75) 98864-1058 na assinatura e currículo novo (Curriculo_Daniel_Passos_Cirurgiao-Dentista.pdf e .docx).', 'Nos e-mails, o currículo precisa ser anexado manualmente — o link de e-mail não anexa arquivos.'),
    ]
    for n, (a, b, c) in enumerate(conf, 2):
        put(w5, n, 1, a, bold=True); put(w5, n, 2, b); put(w5, n, 3, c); put(w5, n, 4, CONF)
    # ------------------------------------------------ RESUMO
    w6 = wb.create_sheet('RESUMO', 5)
    cab(w6, ['Indicador', 'Quantidade'], [44, 14])
    ref = f"'{PAINEL}'"
    linhas = [(s, f'=COUNTIF({ref}!O:O,"{s}")') for s in SITUACOES] + [('', '')] + [(f'Prioridade {i}', f'=COUNTIF({ref}!B:B,{i})') for i in (1, 2, 3)] + [('', ''),
              ('Acompanhamentos vencidos (até hoje)', f'=COUNTIFS({ref}!S:S,"<="&TODAY(),{ref}!S:S,"<>",{ref}!O:O,"Aguardando resposta")+COUNTIFS({ref}!S:S,"<="&TODAY(),{ref}!S:S,"<>",{ref}!O:O,"Contato realizado")'),
              ('Respostas positivas (respondeu, pediu currículo, entrevista, proposta)', f'=COUNTIF({ref}!O:O,"Respondeu")+COUNTIF({ref}!O:O,"Solicitou currículo")+COUNTIF({ref}!O:O,"Entrevista agendada")+COUNTIF({ref}!O:O,"Proposta recebida")')]
    for n, (a, b) in enumerate(linhas, 2):
        put(w6, n, 1, a, bold=True); put(w6, n, 2, b)
    # ------------------------------------------------ COMO USAR
    w7 = wb.create_sheet('COMO USAR', 6)
    cab(w7, ['Como usar o CRM'], [150], h=24)
    txt = ['1. Trabalhe pela aba PAINEL DE PROSPECÇÃO. Use os filtros do cabeçalho para ver por cidade, rede, prioridade, categoria de oportunidade e situação da abordagem.',
           '2. Para contatar: clique no link da coluna "WhatsApp" (abre a conversa com o texto já escrito — você revisa e aperta enviar) ou no link de e-mail (abre o e-mail com assunto e texto; anexe o currículo em PDF).',
           '3. Depois de cada contato: preencha "Data do primeiro contato", "Canal utilizado" e mude a "Situação da abordagem". A data do próximo acompanhamento é calculada sozinha (4 dias úteis).',
           '4. Registre o texto enviado e a resposta na aba REGISTRO DE CONTATOS. Um único acompanhamento por contato; sem resposta após o segundo toque, marque "Retomar futuramente".',
           '5. Linhas ficam verdes quando há resposta positiva; a data de acompanhamento fica laranja quando vence.',
           '6. "Tipo de contato" diferencia WhatsApp confirmado, tentativa de abertura (celular sem confirmação) e telefone fixo. Celulares do cadastro CNES no formato antigo foram exibidos com o 9º dígito.',
           '7. Aba LINKEDIN: links de busca por sócio e por empresa, critério para não confundir homônimos, convite e mensagem. Marque o status após conferir cada perfil.',
           '8. Nada é enviado automaticamente. Cada mensagem sai do seu WhatsApp, e-mail ou LinkedIn, uma a uma.',
           '9. Esta planilha é gerada por script. Depois que você começar a preencher, as atualizações devem ser feitas editando o arquivo — regenerar do zero apaga o que foi preenchido.']
    for n, t in enumerate(txt, 2):
        put(w7, n, 1, t)
    wb.save(XLSX)
    print('ok', len(ordem), 'linhas no painel;', n, 'linhas de uso')


if __name__ == '__main__':
    main()
