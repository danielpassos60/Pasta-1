# Editor de Vídeos IA
Ferramentas: Remotion (monta o vídeo), HyperFrames (motion graphics), FFmpeg (corta), yt-dlp (baixa referências), Whisper (legendas).
Pastas: `Material Bruto/` (entrada), `Referencias/`, `Videos Prontos/` (saída).
Sempre leia `Meu Gosto.md` antes de editar.

## Fluxo ao receber vídeo em Material Bruto
1. Cortar silêncios (ffmpeg silenceremove / silencedetect).
2. Transcrever com Whisper (modelo base, -l pt) e gerar legendas.
3. Montar com Remotion (legendas + motion graphics) seguindo Meu Gosto.md.
4. Exportar em `Videos Prontos/` e pedir ajustes ("gancho 30% maior" etc.).

## Referências por link
`yt-dlp -o "Referencias/%(title)s.%(ext)s" <link>`
