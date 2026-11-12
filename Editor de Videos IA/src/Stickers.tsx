import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND as B} from './brand';

// Cartõezinhos desenhados que "pipocam" conforme a fala (ilustrações próprias, sem foto de paciente).
export type Sticker = {icon: 'afta' | 'mordida' | 'aparelho' | 'salvar' | 'enviar'; label: string; start: number; end: number; x: number; y: number; rot?: number; w?: number; img?: string};
const ink = {fill: 'none', stroke: B.ink, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const TOOTH = 'M40 34 C40 14 52 6 64 8 C70 9 72 12 75 12 C78 12 80 9 86 8 C98 6 110 14 110 34 C110 48 105 57 103 71 C101 86 99 97 94 105 C91 110 86 107 85 98 C84 89 82 80 75 80 C68 80 66 89 65 98 C64 107 59 110 56 105 C51 97 49 86 47 71 C45 57 40 48 40 34 Z';
const Icon: React.FC<{name: Sticker['icon']}> = ({name}) => {
  if (name === 'afta') return <svg viewBox="0 0 150 120" width="100%">
    <path {...ink} d="M14 52 C40 20 62 30 75 40 C88 30 110 20 136 52 C112 96 38 96 14 52 Z" />
    <path {...ink} strokeWidth={4} d="M14 52 C50 62 100 62 136 52" />
    <circle cx="98" cy="72" r="13" fill={B.lime} stroke={B.ink} strokeWidth="4" />
    <circle cx="98" cy="72" r="4.5" fill={B.ink} /></svg>;
  if (name === 'mordida') return <svg viewBox="0 0 150 120" width="100%">
    <path {...ink} d={TOOTH} />
    <path d="M112 30 L128 22 M116 46 L136 46 M112 62 L128 70" stroke={B.ink} strokeWidth="5" strokeLinecap="round" />
    <path d="M58 38 C66 46 84 46 92 38" {...ink} strokeWidth={4} />
    <circle cx="124" cy="46" r="0" /></svg>;
  if (name === 'aparelho') return <svg viewBox="0 0 150 120" width="100%">
    {[18, 58, 98].map((x) => <rect key={x} x={x} y="26" width="34" height="68" rx="12" {...ink} />)}
    <path d="M8 60 H142" stroke={B.ink} strokeWidth="4" />
    {[24, 64, 104].map((x) => <rect key={x} x={x} y="49" width="22" height="22" rx="4" fill={B.lime} stroke={B.ink} strokeWidth="4" />)}</svg>;
  if (name === 'salvar') return <svg viewBox="0 0 60 60" width="100%"><path d="M16 8 H44 V52 L30 40 L16 52 Z" fill={B.ink} stroke={B.ink} strokeWidth="4" strokeLinejoin="round" /></svg>;
  return <svg viewBox="0 0 60 60" width="100%"><path d="M6 28 L54 8 L40 54 L28 36 Z M28 36 L54 8" fill="none" stroke={B.ink} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" /></svg>;
};

export const StickerLayer: React.FC<{items: Sticker[]}> = ({items}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const t = frame / fps;
  return <>{items.filter((s) => t >= s.start && t < s.end).map((s, i) => {
    const f0 = frame - Math.round(s.start * fps);
    const k = spring({frame: f0, fps, config: {damping: 10, stiffness: 200, mass: 0.6}});
    const out = interpolate(t, [s.end - 0.18, s.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const pill = s.icon === 'salvar' || s.icon === 'enviar';
    if (pill) return <div key={i} style={{position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, transform: `translate(-50%,-50%) scale(${k * out}) rotate(${s.rot ?? 0}deg)`,
      background: B.lime, borderRadius: 999, padding: '18px 40px 18px 28px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 14px 40px rgba(0,0,0,.35)'}}>
      <div style={{width: 64}}><Icon name={s.icon} /></div>
      <div style={{fontFamily: B.sans, fontWeight: 800, fontSize: 62, letterSpacing: -2, color: B.ink, whiteSpace: 'nowrap'}}>{s.label}</div></div>;
    const w = s.w ?? 290;
    return <div key={i} style={{position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: w, transform: `translate(-50%,-50%) scale(${k * out}) rotate(${(s.rot ?? 0) + (1 - k) * -10}deg)`,
      background: B.paper, borderRadius: 30, padding: '26px 26px 22px', boxShadow: '0 18px 50px rgba(0,0,0,.4)', textAlign: 'center'}}>
      {s.img ? <Img src={staticFile(s.img)} style={{width: '100%', aspectRatio: '150 / 120', objectFit: 'cover', borderRadius: 16, display: 'block'}} /> : <Icon name={s.icon} />}
      <div style={{display: 'inline-block', marginTop: 10, background: B.lime, color: B.ink, fontFamily: B.sans, fontWeight: 800, fontSize: 44, letterSpacing: -1.5, padding: '0 12px'}}>{s.label}</div></div>;
  })}</>;
};
