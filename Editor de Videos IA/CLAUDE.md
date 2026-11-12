# Editor de Vídeos IA
Leia `MODELO.md` (identidade visual, camadas, som) e `Meu Gosto.md` antes de editar. Verde oficial: #CAFC00.
Ferramentas: Remotion (monta), FFmpeg (corta), Whisper (legendas), yt-dlp (referências), HyperFrames (motion).
Pastas: `Material Bruto/` entrada · `Referencias/` · `Videos Prontos/` saída · `planos/` edição em JSON · `public/midia/` imagens/takes.

## Quando o usuário mandar um vídeo cru
1. `python3 scripts/editar.py "Material Bruto/<video>" --titulo "..." --tag "..."` (corta silêncios + transcreve + cria plano).
2. Leia `planos/<nome>.transcricao.txt`. Para cada ideia falada, adicione no plano um insert (`card`/`full`/`float`) com imagem bonita (gere/baixe em `public/midia/`) ou uma explicação animada (`explain`: bignumber/bars/checklist/flow/dots) sincronizada ao tempo da fala; palavras-chave em `emphasis`.
3. Título da capa: sempre `tag` pequena + título curto em verde + faixa de imagens (`title.images`).
4. `python3 scripts/editar.py --renderizar planos/<nome>.json` e entregue o mp4 + capa. Peça ajustes em chat ("gancho maior", "mais inserts").
Esquema do plano: `src/types.ts`. Exemplo: `planos/demo.json`.

## Regra fixa: posição da legenda
A legenda fica SEMPRE no mesmo lugar do vídeo 1: centralizada na horizontal, centro a 74% da altura da tela (abaixo das mãos/peito, acima do rodapé). Nunca mudar.
