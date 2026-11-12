# Modelo de edição (copiado dos vídeos de referência)

**Base (vídeos 1 e 2 — @jviagens_):** apresentador falando direto pra câmera, cortes secos sem pausa, e a tela cheia de camadas gráficas.
**Animação (vídeo 4):** elementos que aparecem conforme a fala + gráficos/explicações desenhadas.

## Identidade
| Item | Valor |
|---|---|
| Verde oficial | `#CAFC00` (medido no vídeo 2) |
| Texto sobre o verde | `#0A0A0A` |
| Fundo das explicações | `#0B0B0D` + papel `#F3EFE6` |
| Fonte principal | Inter Tight (600 legenda / 800 títulos) — grotesca estilo Helvetica |
| Fonte de números | Playfair Display 700 · tags em JetBrains Mono |

## Camadas (de baixo pra cima)
1. **Vídeo cru** 9:16 1080×1920, silêncios cortados (>0,4s).
2. **Inserts** (tela cheia, entram com "pop"):
   - `card`: fundo verde, imagem/vídeo emoldurado no centro, `[rótulo]` em cima, legenda embaixo (ex.: "estagiário financeiro", datas de lembranças).
   - `full`: imagem/take em tela cheia com rótulo em caixa verde.
   - `float`: imagem pequena inclinada flutuando sobre o apresentador (ex.: merch, logo).
   - `explain`: explicação animada em fundo escuro — `bignumber`, `bars`, `checklist`, `flow`, `dots` — cada item aparece no momento que é falado.
3. **Título da capa** (primeiros ~3s): faixa de 3–5 imagens no topo + tag inclinada `(tour pelo meu)` + título grande verde `★ guia de marca ★`.
4. **Palavras-chave**: texto grande preto em caixa verde, inclinado ~-3°, pop-in (ou texto verde sem caixa pra frases de impacto).
5. **Legenda**: pequena, centro-inferior (~71% da altura), caixa verde marca-texto, 2–4 palavras por vez, minúsculas.

## Som (extraído dos espectrogramas dos vídeos 1 e 2)
Estalos curtos de banda larga (~10ms) a cada inserto/palavra-chave; pop grave quando a imagem entra; whoosh nas explicações; click ao sair. Gerados em `public/sfx/` por `npm run sfx`.

## Capa do feed
`Videos Prontos/<nome>_capa.png` — mesmo bloco do título (faixa de imagens + tag + título verde) sobre um frame do apresentador. Mantenha sempre esse padrão pra o feed ficar uniforme.

## Como usar
1. Coloque o vídeo cru em `Material Bruto/`.
2. `python3 scripts/editar.py "Material Bruto/video.mp4" --titulo "seu título" --tag "(tag)"` → corta, transcreve, cria `planos/<nome>.json`.
3. O Claude lê `planos/<nome>.transcricao.txt`, escolhe onde entram inserts/explicações/palavras-chave e preenche o plano (imagens em `public/midia/`).
4. `python3 scripts/editar.py --renderizar planos/<nome>.json` → `Videos Prontos/<nome>.mp4` + capa.
Pré-visualizar/ajustar: `npm run studio`.

## Regra fixa: posição da legenda
A legenda fica SEMPRE no mesmo lugar do vídeo 1: centralizada na horizontal, centro a 74% da altura da tela (abaixo das mãos/peito, acima do rodapé). Nunca mudar.
