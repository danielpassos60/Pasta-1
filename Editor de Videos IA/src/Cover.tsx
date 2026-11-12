import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {TitleBlock} from './Overlays';
import {BRAND as B} from './brand';
import type {Plan} from './types';
// Capa do feed: sempre o mesmo padrão (faixa de imagens + etiqueta + título verde sobre o apresentador).
// Quando o vídeo não tem espaço acima da cabeça, `cover.shift` desce o apresentador e completa o fundo em cima.
export const Cover: React.FC<{plan: Plan}> = ({plan}) => {
  const shift = plan.cover?.shift ?? 0; const start = Math.round((plan.coverAt ?? 1) * 30); const src = staticFile(plan.video);
  // quadro da capa: imagem extraída do vídeo (cover.frame) ou, se não houver, o próprio vídeo no tempo coverAt
  const Frame: React.FC<{style: React.CSSProperties}> = ({style}) => plan.cover?.frame ? <Img src={staticFile(plan.cover.frame)} style={style} /> : <OffthreadVideo src={src} startFrom={start} style={style} />;
  const band = 216, srcH = 380, fillH = shift + 140;
  return (
    <AbsoluteFill style={{background: B.dark}}>
      {shift > 0 && Array.from({length: 5}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: i * band, top: 0, width: band, height: fillH, overflow: 'hidden', transform: `scaleX(${i % 2 ? -1 : 1})`}}>
          <Frame style={{position: 'absolute', left: -6, top: -40 * (fillH / srcH), width: 1080, height: 1920, transform: `scaleY(${fillH / srcH})`, transformOrigin: 'top left'}} />
        </div>))}
      <div style={{position: 'absolute', left: 0, right: 0, top: shift, height: 1920, WebkitMaskImage: shift > 0 ? 'linear-gradient(to bottom, transparent 0px, black 110px)' : undefined, maskImage: shift > 0 ? 'linear-gradient(to bottom, transparent 0px, black 110px)' : undefined}}>
        <Frame style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      {shift > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: shift + 260, background: 'linear-gradient(to bottom, rgba(11,11,13,.82) 0%, rgba(11,11,13,.7) 55%, rgba(11,11,13,0) 100%)'}} />}
      {plan.title && <TitleBlock title={{...plan.title, ...(plan.cover?.title ?? {}), until: 999}} />}
    </AbsoluteFill>);
};
