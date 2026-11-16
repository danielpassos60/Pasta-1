"""Gera o currículo do Dr. Daniel Passos em PDF (design, via Chromium) e DOCX (versão ATS).

Uso: python3 ferramentas/curriculo.py
Saída: curriculo/Curriculo_Daniel_Passos_Cirurgiao-Dentista.pdf e .docx
"""
import base64, html, json, os, subprocess, sys

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(BASE, 'curriculo')
FOTO = os.path.join(OUT, 'foto_daniel_passos.jpg')
PDF = os.path.join(OUT, 'Curriculo_Daniel_Passos_Cirurgiao-Dentista.pdf')
DOCX = os.path.join(OUT, 'Curriculo_Daniel_Passos_Cirurgiao-Dentista.docx')
HTML = os.path.join(OUT, 'curriculo.html')

# ------------------------------------------------------------------ conteúdo
CV = {
    'nome': 'Daniel Passos Gomes',
    'cargo': 'Cirurgião-Dentista Clínico Geral',
    'cro': 'CRO-BA 32800',
    'contato': [
        ('São Felipe – BA', None),
        ('(75) 98864-1058 · WhatsApp', 'https://wa.me/5575988641058'),
        ('danielgomes.ss@yahoo.com', 'mailto:danielgomes.ss@yahoo.com'),
        ('linkedin.com/in/daniel-passos-gomes-b18a69275', 'https://www.linkedin.com/in/daniel-passos-gomes-b18a69275'),
        ('instagram.com/drdanielpassos', 'https://www.instagram.com/drdanielpassos/'),
    ],
    'resumo': (
        'Cirurgião-dentista clínico geral graduado pela UNIME, atuando em clínica de alto fluxo em Salvador. '
        'Experiência em exodontias, incluindo terceiros molares; cirurgia oral menor, com biópsias e remoção de tórus mandibular '
        'e de outras alterações ósseas; restaurações estéticas em resina composta; pinos de fibra de vidro; urgências e '
        'odontopediatria. Prática orientada por evidências, com plano de tratamento claro e atendimento humanizado.'
    ),
    'disponibilidade': 'Disponível de segunda a sexta-feira · Recôncavo Baiano, Feira de Santana e Salvador · Produção, diária ou turno',
    'experiencia': [
        {
            'cargo': 'Cirurgião-Dentista Clínico Geral',
            'empresa': 'Clínica Mais Sorriso',
            'local': 'São Cristóvão, Salvador – BA',
            'periodo': '2026 – Atual',
            'descricao': 'Atendimento clínico geral em clínica odontológica de alto fluxo, com pacientes de todas as idades.',
            'itens': [
                'Exodontias simples e de terceiros molares, incluindo dentes inclusos e impactados.',
                'Cirurgia oral menor: biópsias, remoção de tórus mandibular e de outras alterações ósseas.',
                'Restaurações estéticas diretas em resina composta e reconstruções com pino de fibra de vidro e bloco.',
                'Atendimento de urgências odontológicas, com diagnóstico e conduta no mesmo atendimento.',
                'Atendimento odontopediátrico, com abordagem adequada à criança e orientação aos responsáveis.',
                'Raspagem e remoção de cálculo dentário (tártaro), com orientação de higiene bucal.',
                'Remoção de aparelhos ortodônticos.',
                'Avaliação clínica, diagnóstico e elaboração de plano de tratamento.',
            ],
        },
    ],
    'estagios': [
        ('Odontologia Hospitalar — Cardiologia Pediátrica', 'Hospital Ana Nery (HAN), Salvador – BA'),
        ('Odontologia Hospitalar — Cuidados Paliativos', 'Hospital Naval de Salvador (HNSa) — Marinha do Brasil'),
        ('Implantodontia', 'Instituto ÍCONE — Complexo Odonto-Médico Itaigara'),
    ],
    'formacao': [
        ('Bacharelado em Odontologia', 'UNIME — União Metropolitana de Educação e Cultura', ''),
    ],
    'competencias': [
        'Clínica geral', 'Exodontia', 'Terceiros molares', 'Cirurgia oral menor', 'Biópsia', 'Remoção de tórus mandibular',
        'Dentística restauradora', 'Resina composta', 'Pino de fibra de vidro', 'Urgência odontológica', 'Odontopediatria',
        'Raspagem e profilaxia', 'Diagnóstico e plano de tratamento', 'Interpretação radiográfica', 'Biossegurança',
    ],
    'cursos': [
        ('Cirurgia Oral Menor', 'CEBEO, Salvador – BA'),
        ('Imersão em Dentística Operatória', 'ABO-BA — Associação Brasileira de Odontologia'),
        ('Reanatomização Estética de Diastema com Resina Composta', 'Faculdade de Odontologia da UFBA (FOUFBA)'),
    ],
    'cursos_andamento': [
        ('Abordagem das Síndromes Geriátricas e Cuidados Paliativos na Atenção Primária à Saúde', 'Fiocruz Brasília (EAD)'),
        ('Atenção à Desnutrição em Crianças e Gestantes no SUS', 'Universidade Federal de Santa Catarina — UFSC (EAD)'),
        ('Escuta de Crianças e Adolescentes na Rede de Serviços do SUS', 'Fiocruz Brasília (EAD)'),
    ],
    'atividades': [
        'Ex-presidente da Liga de Odontopediatria (LAOPED).',
        'Liga de Odontologia Social (LAPOS), 2021–2024.',
        'Extensão em Radiologia Odontológica — UNIME.',
        'Organização do Congresso Acadêmico de Odontologia.',
        'Banco de Dentes Humanos (2022).',
        'Voluntário do GACC-BA (apoio à criança com câncer).',
    ],
}

E = html.escape


# ------------------------------------------------------------------ HTML / PDF
FONTES = '/root/.fonts'


def build_html():
    foto = base64.b64encode(open(FOTO, 'rb').read()).decode()
    ff = ''.join(f"@font-face {{ font-family: 'CVSans'; src: url('file://{FONTES}/CVSans-{n}.ttf') format('truetype'); font-weight: {w}; font-style: {st}; }}\n"
                 for n, w, st in (('Regular', 400, 'normal'), ('Medium', 500, 'normal'), ('SemiBold', 600, 'normal'), ('Bold', 700, 'normal'), ('Italic', 400, 'italic')))
    contato = '\n'.join(
        f'<li><a href="{E(u)}">{E(t)}</a></li>' if u else f'<li>{E(t)}</li>' for t, u in CV['contato'])
    exp = ''
    for x in CV['experiencia']:
        itens = '\n'.join(f'<li>{E(i)}</li>' for i in x['itens'])
        exp += f"""
      <article class="job">
        <div class="job-head">
          <h3>{E(x['cargo'])}</h3>
          <span class="when">{E(x['periodo'])}</span>
        </div>
        <p class="org">{E(x['empresa'])} · {E(x['local'])}</p>
        <ul class="bul">{itens}</ul>
      </article>"""
    li2 = lambda rows: '\n'.join(f'<li><strong>{E(a)}</strong><span>{E(b)}</span></li>' for a, b in rows)
    form = '\n'.join(f'<li><strong>{E(a)}</strong><span>{E(b)}{(" · " + E(c)) if c else ""}</span></li>' for a, b, c in CV['formacao'])
    comp = '<span class="dot"> · </span>'.join(f'<span class="kw">{E(c)}</span>' for c in CV['competencias'])
    ativ = '\n'.join(f'<li>{E(a)}</li>' for a in CV['atividades'])
    return f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Daniel Passos Gomes — Cirurgião-Dentista Clínico Geral — CRO-BA 32800</title>
<meta name="author" content="Daniel Passos Gomes">
<meta name="description" content="Currículo — Cirurgião-Dentista Clínico Geral, CRO-BA 32800">
<style>
  {ff}
  @page {{ size: A4; margin: 0; }}
  :root {{ --ink: #1D2833; --ink2: #3F4C57; --ink3: #66727C; --rule: #D9E0E5; --brand: #133B5C; --accent: #23838A; --tint: #F0F5F6; --chip: #E8F1F2; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{ background: #fff; }}
  body {{ font-family: 'CVSans', Arial, sans-serif; color: var(--ink); font-size: 8.9pt; line-height: 1.4; hyphens: none;
          -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  a {{ color: inherit; text-decoration: none; }}
  .page {{ width: 210mm; height: 297mm; position: relative; overflow: hidden; }}
  header {{ background: var(--brand); color: #fff; padding: 7mm 14mm 6.5mm 14mm; display: flex; gap: 7mm; align-items: center; position: relative; }}
  header::after {{ content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1.4mm; background: var(--accent); }}
  .photo {{ width: 29mm; height: 29mm; border-radius: 50%; overflow: hidden; flex: none; border: 1mm solid #fff; }}
  .photo img {{ width: 100%; height: 100%; object-fit: cover; display: block; }}
  h1 {{ font-weight: 700; font-size: 23.5pt; line-height: 1.05; }}
  .role {{ margin-top: 1.8mm; font-size: 10.8pt; font-weight: 500; color: #D7E5EE; }}
  .role b {{ color: #fff; font-weight: 600; }}
  .contact {{ list-style: none; margin-top: 3mm; display: flex; flex-wrap: wrap; gap: 1mm 4.4mm; font-size: 8.1pt; color: #E4EDF2; }}
  .contact li {{ position: relative; padding-left: 2.8mm; }}
  .contact li::before {{ content: ''; position: absolute; left: 0; top: 1.5mm; width: 1.15mm; height: 1.15mm; border-radius: 50%; background: #6FC3C6; }}
  main {{ padding: 5.2mm 14mm 0 14mm; }}
  section {{ margin-top: 3.7mm; }}
  section:first-child {{ margin-top: 0; }}
  h2 {{ font-size: 10pt; font-weight: 700; color: var(--brand); display: flex; align-items: center; gap: 2.6mm; margin-bottom: 1.6mm; }}
  h2::before {{ content: ''; width: 4.2mm; height: 0.9mm; background: var(--accent); border-radius: 1mm; flex: none; }}
  h2::after {{ content: ''; height: 0.3mm; background: var(--rule); flex: 1; }}
  .summary {{ color: var(--ink2); font-size: 9.05pt; line-height: 1.48; }}
  .avail {{ margin-top: 2.2mm; background: var(--tint); border-left: 0.9mm solid var(--accent); padding: 1.7mm 3mm; font-size: 8.4pt;
            font-weight: 600; color: var(--brand); border-radius: 0 1.2mm 1.2mm 0; }}
  .job-head {{ display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }}
  h3 {{ font-size: 10.2pt; font-weight: 700; }}
  .when {{ font-size: 8.4pt; font-weight: 600; color: var(--accent); white-space: nowrap; }}
  .org {{ font-size: 8.9pt; font-weight: 600; color: var(--brand); margin-top: .3mm; }}
  .lead {{ font-size: 8.6pt; color: var(--ink3); margin-top: .8mm; font-style: italic; }}
  .bul {{ list-style: none; margin-top: 1.3mm; display: grid; grid-template-columns: 1fr; }}
  .bul li {{ position: relative; padding-left: 3.8mm; margin-top: .55mm; color: var(--ink2); }}
  .bul li::before {{ content: ''; position: absolute; left: .55mm; top: 1.75mm; width: 1.2mm; height: 1.2mm; background: var(--accent); transform: rotate(45deg); }}
  .tags {{ background: var(--tint); border-radius: 1.4mm; padding: 2.2mm 3.2mm; font-size: 8.7pt; line-height: 1.75; color: var(--brand); }}
  .tags .kw {{ font-weight: 600; white-space: nowrap; }}
  .tags .dot {{ color: var(--accent); font-weight: 700; }}
  .cols {{ display: grid; grid-template-columns: 1fr 1.28fr; gap: 0 7mm; margin-top: 3.7mm; }}
  .items {{ list-style: none; }}
  .items li {{ margin-top: 1.55mm; }}
  .items li:first-child {{ margin-top: 0; }}
  .items strong {{ display: block; font-weight: 600; font-size: 8.85pt; line-height: 1.3; }}
  .items span {{ display: block; color: var(--ink3); font-size: 8.2pt; margin-top: .2mm; line-height: 1.3; }}
  .sub {{ font-size: 8.2pt; font-weight: 700; color: var(--accent); margin: 2.4mm 0 1.3mm; }}
  .plain {{ list-style: none; }}
  .plain li {{ position: relative; padding-left: 3.6mm; margin-top: .9mm; color: var(--ink2); line-height: 1.32; }}
  .plain li:first-child {{ margin-top: 0; }}
  .plain.two {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0 7mm; }}
  .plain.two li {{ margin-top: .9mm; }}
  .plain.two li:nth-child(-n+2) {{ margin-top: 0; }}
  .plain li::before {{ content: ''; position: absolute; left: .5mm; top: 1.65mm; width: 1.1mm; height: 1.1mm; border-radius: 50%; background: var(--accent); }}
  footer {{ position: absolute; left: 14mm; right: 14mm; bottom: 6.5mm; display: flex; justify-content: space-between; font-size: 7.3pt; color: var(--ink3);
            border-top: 0.3mm solid var(--rule); padding-top: 1.8mm; }}
</style></head>
<body><div class="page">
  <header>
    <div class="photo"><img src="data:image/jpeg;base64,{foto}" alt="Foto de Daniel Passos Gomes"></div>
    <div class="id">
      <h1>{E(CV['nome'].upper())}</h1>
      <p class="role"><b>{E(CV['cargo'])}</b> · {E(CV['cro'])}</p>
      <ul class="contact">{contato}</ul>
    </div>
  </header>
  <main>
    <section>
      <h2>Resumo Profissional</h2>
      <p class="summary">{E(CV['resumo'])}</p>
      <p class="avail">{E(CV['disponibilidade'])}</p>
    </section>
    <section>
      <h2>Experiência Profissional</h2>{exp}
    </section>
    <section>
      <h2>Competências</h2>
      <p class="tags">{comp}</p>
    </section>
    <div class="cols">
      <div>
        <section>
          <h2>Formação Acadêmica</h2>
          <ul class="items">{form}</ul>
        </section>
        <section>
          <h2>Estágios</h2>
          <ul class="items">{li2(CV['estagios'])}</ul>
        </section>
      </div>
      <div>
        <section>
          <h2>Cursos e Aperfeiçoamento</h2>
          <ul class="items">{li2(CV['cursos'])}</ul>
          <p class="sub">Em andamento</p>
          <ul class="items">{li2(CV['cursos_andamento'])}</ul>
        </section>
      </div>
    </div>
    <section>
      <h2>Atividades Acadêmicas e Voluntariado</h2>
      <ul class="plain two">{ativ}</ul>
    </section>
  </main>
</div></body></html>"""


def build_pdf():
    open(HTML, 'w', encoding='utf-8').write(build_html())
    js = f'''
const {{ chromium }} = require('playwright');
(async () => {{
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://{HTML}', {{ waitUntil: 'load' }});
  await p.evaluate(() => document.fonts.ready);
  const h = await p.evaluate(() => {{ const m=document.querySelector('main'); return [Math.round(m.getBoundingClientRect().bottom), 1100]; }});
  console.log('altura_px', h);
  await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true }});
  await b.close();
}})();'''
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True, cwd='/tmp')
    print(r.stdout.strip(), r.stderr.strip()[-600:])


# ------------------------------------------------------------------ DOCX (ATS)
def build_docx():
    from docx import Document
    from docx.shared import Pt, Mm, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement

    BRAND = RGBColor(0x13, 0x3B, 0x5C)
    ACC = RGBColor(0x2A, 0x8C, 0x8C)
    GREY = RGBColor(0x44, 0x52, 0x5E)
    d = Document()
    sec = d.sections[0]
    sec.page_width, sec.page_height = Mm(210), Mm(297)
    sec.left_margin = sec.right_margin = Mm(18)
    sec.top_margin, sec.bottom_margin = Mm(11), Mm(10)
    st = d.styles['Normal']
    st.font.name = 'Calibri'
    st.element.rPr.rFonts.set(qn('w:eastAsia'), 'Calibri')
    st.font.size = Pt(9.5)
    st.paragraph_format.space_after = Pt(0)
    st.paragraph_format.line_spacing = 1.05
    d.core_properties.title = 'Currículo — Daniel Passos Gomes — Cirurgião-Dentista Clínico Geral'
    d.core_properties.author = 'Daniel Passos Gomes'

    def para(text='', bold=False, size=None, color=None, after=0, before=0, italic=False, align=None):
        p = d.add_paragraph()
        p.paragraph_format.space_after = Pt(after)
        p.paragraph_format.space_before = Pt(before)
        if align:
            p.alignment = align
        if text:
            r = p.add_run(text)
            r.bold, r.italic = bold, italic
            if size:
                r.font.size = Pt(size)
            if color:
                r.font.color.rgb = color
        return p

    def rule(p):
        pPr = p._p.get_or_add_pPr()
        b = OxmlElement('w:pBdr')
        bt = OxmlElement('w:bottom')
        for k, v in (('w:val', 'single'), ('w:sz', '6'), ('w:space', '1'), ('w:color', '2A8C8C')):
            bt.set(qn(k), v)
        b.append(bt)
        pPr.append(b)

    def h2(t):
        p = para(t.upper(), bold=True, size=10.5, color=BRAND, before=7, after=3)
        rule(p)

    def bullet(t, bold_prefix=None):
        p = d.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1)
        if bold_prefix:
            r = p.add_run(bold_prefix)
            r.bold = True
        r = p.add_run(t)
        r.font.color.rgb = GREY
        return p

    pf = d.add_paragraph()
    pf.add_run().add_picture(FOTO, width=Mm(24))
    pf.paragraph_format.space_after = Pt(2)
    para(CV['nome'].upper(), bold=True, size=20, color=BRAND)
    para(f"{CV['cargo']} | {CV['cro']}", bold=True, size=11.5, color=ACC, after=3)
    para(' | '.join(t for t, _ in CV['contato']), size=9, color=GREY, after=2)
    h2('Resumo Profissional')
    para(CV['resumo'], color=GREY, after=3)
    para(CV['disponibilidade'], bold=True, size=9.5, color=BRAND)
    h2('Experiência Profissional')
    for x in CV['experiencia']:
        para(f"{x['cargo']} | {x['empresa']}", bold=True, size=11)
        para(f"{x['local']} | {x['periodo']}", size=9.5, color=ACC, after=2)
        for i in x['itens']:
            bullet(i)
    h2('Competências')
    para(' • '.join(CV['competencias']), color=GREY)
    h2('Formação Acadêmica')
    for a, b, c in CV['formacao']:
        bullet(f' — {b}' + (f' ({c})' if c else ''), a)
    h2('Estágios')
    for a, b in CV['estagios']:
        bullet(f' — {b}', a)
    h2('Cursos e Aperfeiçoamento')
    for a, b in CV['cursos']:
        bullet(f' — {b}', a)
    para('Em andamento', bold=True, size=9.5, color=ACC, before=4, after=2)
    for a, b in CV['cursos_andamento']:
        bullet(f' — {b}', a)
    h2('Atividades Acadêmicas e Voluntariado')
    for a in CV['atividades']:
        bullet(a)
    d.save(DOCX)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if not os.path.exists(FOTO):
        sys.exit('foto não encontrada: ' + FOTO)
    build_pdf()
    build_docx()
    print('ok')
