import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND as B} from './brand';
import type {Caption, Emphasis, Plan} from './types';

const pop = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 180, mass: 0.6}});

const isVideo = (s?: string) => !!s && /\.(mp4|mov|webm)$/i.test(s);
export const Media: React.FC<{src?: string; style?: React.CSSProperties}> = ({src, style}) => {
  if (!src) return null;
  const f = staticFile(src);
  return isVideo(src)
    ? <OffthreadVideo src={f} muted style={{objectFit: 'cover', ...style}} />
    : <Img src={f} style={{objectFit: 'cover', ...style}} />;
};

// Legenda pequena com marca-texto verde (como nos vídeos 1 e 2)
export const Captions: React.FC<{captions: Caption[]}> = ({captions}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const t = frame / fps;
  const c = captions.find((x) => t >= x.start && t < x.end);
  if (!c) return null;
  const s = pop(frame - Math.round(c.start * fps), fps) ;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: '74%', transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', padding: '0 120px'}}  /* POSIÇÃO TRAVADA: igual ao vídeo 1 (centro a 74% da altura) */>
      <span style={{
        fontFamily: B.sans, fontWeight: 600, fontSize: 40, lineHeight: 1.25, color: B.ink, background: B.lime,
        padding: '2px 12px', textAlign: 'center', transform: `scale(${0.9 + 0.1 * Math.min(s, 1)})`,
        boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', letterSpacing: -0.5,
      }}>{c.text}</span>
    </div>
  );
};

// Palavra-chave grande: texto verde sem caixa OU preto na caixa verde inclinada
export const EmphasisLayer: React.FC<{items: Emphasis[]}> = ({items}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const t = frame / fps;
  return <>{items.filter((e) => t >= e.start && t < e.end).map((e, i) => {
    const s = pop(frame - Math.round(e.start * fps), fps);
    const box = e.box ?? true;
    return (
      <div key={i} style={{position: 'absolute', left: `${e.x ?? 50}%`, top: `${e.y ?? 22}%`,
        transform: `translate(-50%,-50%) rotate(${e.rot ?? -3}deg) scale(${s})`, textAlign: 'center', whiteSpace: 'pre'}}>
        <span style={{fontFamily: B.sans, fontWeight: 800, fontSize: e.size ?? 84, lineHeight: 1.1, letterSpacing: -2,
          color: box ? B.ink : B.lime, background: box ? B.lime : 'transparent', padding: box ? '0 14px' : 0,
          textShadow: box ? 'none' : '0 6px 30px rgba(0,0,0,.45)',
          boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{e.countTo ? `${Math.max(1, Math.round(e.countTo * Math.min(1, (t - e.start) / 0.7)))}${e.suffix ?? ''}` : e.text}</span>
      </div>);
  })}</>;
};

// Capa/gancho: faixa de imagens em cima + tag inclinada + título grande verde com estrelas
export const TitleBlock: React.FC<{title: NonNullable<Plan['title']>}> = ({title}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const t = frame / fps;
  const until = title.until ?? 3.5;
  if (t > until) return null;
  const s = until >= 999 ? 1 : pop(frame, fps);
  const out = until >= 999 ? 1 : interpolate(t, [until - 0.25, until], [1, 0], {extrapolateLeft: 'clamp'});
  const imgs = title.images ?? [];
  return (
    <AbsoluteFill style={{opacity: out}}>
      {imgs.length > 0 && (
        <div style={{position: 'absolute', top: 170, left: 120, right: 120, height: 280, display: 'flex', transform: `scale(${s})`, boxShadow: '0 8px 30px rgba(0,0,0,.25)'}}>
          {imgs.map((m, i) => <Media key={i} src={m} style={{flex: 1, height: '100%', width: 0}} />)}
        </div>)}
      <div style={{position: 'absolute', top: title.top ?? (imgs.length ? 480 : 300), left: 0, right: 0, textAlign: 'center', transform: `scale(${s})`}}>
        {title.tag && <div style={{display: 'inline-block', transform: 'rotate(-3deg)', background: B.lime, color: B.ink, fontFamily: B.sans, fontWeight: 600, fontSize: 36, padding: '0 10px', marginBottom: 10, marginRight: imgs.length ? 300 : 0}}>{title.tag}</div>}
        <div style={{fontFamily: B.sans, fontWeight: 800, fontSize: 112, letterSpacing: -4, lineHeight: 1, color: B.lime, textShadow: '0 4px 24px rgba(0,0,0,.35)'}}>
          <span style={{fontSize: 56}}>★ </span>{title.text}<span style={{fontSize: 56}}> ★</span>
        </div>
      </div>
    </AbsoluteFill>);
};

// Inserto: cartão (fundo verde + imagem emoldurada), tela cheia, ou flutuante sobre o apresentador
export const InsertLayer: React.FC<{src?: string; type: 'card' | 'full' | 'float'; label?: string; caption?: string; dur: number}> = ({src, type, label, caption, dur}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = pop(frame, fps);
  const out = interpolate(frame, [dur - 6, dur], [1, 0], {extrapolateLeft: 'clamp'});
  const txt = (x: string | undefined, pos: React.CSSProperties) => x ? (
    <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: B.sans, fontWeight: 600, fontSize: 44, ...pos}}>
      <span style={{background: type === 'full' ? B.lime : 'transparent', color: B.ink, padding: '0 10px'}}>{x}</span></div>) : null;
  if (type === 'full') return (
    <AbsoluteFill style={{opacity: out, transform: `scale(${0.96 + 0.04 * s})`}}><Media src={src} style={{width: '100%', height: '100%'}} />{txt(label, {top: '38%', fontSize: 64})}</AbsoluteFill>);
  if (type === 'float') return (
    <div style={{position: 'absolute', top: 220, left: '50%', width: 620, height: 760, opacity: out, transform: `translateX(-50%) scale(${s}) rotate(${(1 - s) * -6}deg)`, boxShadow: '0 20px 60px rgba(0,0,0,.45)', background: '#000'}}>
      <Media src={src} style={{width: '100%', height: '100%'}} />{label && <div style={{position: 'absolute', top: -70, width: '100%', textAlign: 'center', fontFamily: B.sans, fontWeight: 700, fontSize: 56, color: B.lime}}>{label}</div>}</div>);
  return (
    <AbsoluteFill style={{background: B.lime, opacity: out}}>
      {txt(label, {top: 110})}
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 760, height: 1100, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * s})`, boxShadow: '0 16px 50px rgba(0,0,0,.3)', background: '#000'}}>
        <Media src={src} style={{width: '100%', height: '100%'}} /></div>
      {txt(caption, {bottom: 110, fontSize: 38})}
    </AbsoluteFill>);
};
