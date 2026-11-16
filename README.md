# Mapeamento de Oportunidades Profissionais em Odontologia — Bahia

Pesquisa de mercado para o Dr. Daniel Passos (cirurgião-dentista clínico geral, CRO-BA 32800), com foco no Recôncavo Baiano. Dados verificados em 16/11/2026.

- `relatorio/Mapeamento_Oportunidades_Odontologia_Daniel_Passos.pdf` — relatório completo (perfil, resumo, ranking, fichas por cidade, redes, mensagens, plano de ação, fontes).
- `relatorio/Mapeamento_Oportunidades_Odontologia_Daniel_Passos.xlsx` — planilha com as 23 colunas por clínica, fontes, canais, redes, mensagens e critérios.
- `dados/clinicas.json` — base consolidada (100 clínicas/unidades ranqueadas).
- `ferramentas/` — scripts que consolidam os dados brutos (`build_dataset.py`) e geram o PDF e a planilha (`gerar_relatorio.py`, `conteudo.py`).

Para regenerar o PDF e a planilha a partir da base: `python3 ferramentas/gerar_relatorio.py`.
