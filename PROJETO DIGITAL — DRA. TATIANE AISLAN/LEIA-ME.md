# PROJETO DIGITAL — DRA. TATIANE AISLAN
Identidade visual aplicada, site, Instagram e manual · Desenvolvido por **Daniel dos Passos Gomes**

| Pasta | Conteúdo |
|---|---|
| 01_IDENTIDADE_VISUAL | Logomarca em SVG, PDF e PNG (horizontal, vertical, símbolo, mono, negativa, fundo claro/escuro), estampas, paleta e tipografia |
| 02_SITE | Site completo (`site/`) e instruções de publicação |
| 03_INSTAGRAM | 6 biografias, organização do perfil, 7 capas de destaques, simulação do perfil |
| 04_FEED_35_POSTS | 35 pastas (uma por publicação) com artes e legenda; legendas completas, referências e calendário |
| 05_ANTES_E_DEPOIS | 4 elementos PNG transparentes (+1 extra), em 2 tamanhos |
| 06_REELS | 3 roteiros completos + 3 capas ilustradas |
| 07_STORIES | 10 stories prontos + roteiro de interações |
| 08_MANUAL_PDF | Manual completo de identidade digital e posicionamento |
| _FONTES_EDITAVEIS | Arquivos-fonte para editar textos e gerar as artes novamente (ver abaixo) |

## Pendências (dependem da Dra.)
1. **@ do Instagram e print do perfil atual**: não foram enviados. O botão do Instagram no site está pronto, mas oculto até o preenchimento.
2. **Publicar o site**: siga `02_SITE/COMO_PUBLICAR.md` (cerca de 5 minutos).
3. **Autorizações de imagem**: a publicação 07 e o story 08 usam fotos da Dra. em atendimento. Confirme que nenhum paciente ou colega é identificável sem autorização.
4. **Revisar a publicação 35** (fluxo da primeira consulta): confirme se corresponde à rotina real da Dra.

## Como editar e gerar de novo (opcional, para quem usa computador)
Todo o conteúdo (textos das artes, legendas, bios, stories) está em `_FONTES_EDITAVEIS/conteudo.js`. Depois de editar, rode, com Node.js e Playwright instalados:
```
cd _FONTES_EDITAVEIS
node gerar_artes.js        # artes do feed, stories, destaques, antes/depois, logos
node gerar_simulacao.js    # simulação do perfil
node gerar_documentos.js   # documentos .md
node gerar_manual.js       # manual em PDF
```
