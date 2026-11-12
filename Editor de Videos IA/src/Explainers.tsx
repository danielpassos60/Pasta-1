import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND as B} from './brand';
import type {Explain} from './types';

// Explicações animadas (estilo vídeo 4): fundo escuro, número serifado, tag mono, elementos entram conforme a fala
const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, t: f / fps}; };
const rise = (t: number, at: number, d = 0.5) => interpolate(t, [at, at + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

const Tag: React.FC<{text?: string}> = ({text}) => text ? (
  <div style={{position: 'absolute', top: 170, left: 80, fontFamily: B.mono, fontSize: 26, letterSpacing: 4, color: B.lime, textTransform: 'uppercase'}}>{text}</div>) : null;

export const Explainer: React.FC<{e: Explain}> = ({e}) => {
  const {f, fps, t} = useT();
  const enter = ease(rise(t, 0, 0.4));
  const wrap: React.CSSProperties = {background: B.dark, opacity: enter};
  const ctr: React.CSSProperties = {position: 'absolute', left: 80, right: 80, top: 330, bottom: 560};

  if (e.kind === 'bignumber') {
    const v = e.value * ease(rise(t, 0.2, 1.2));
    return <AbsoluteFill style={wrap}><Tag text={e.tag} />
      <div style={{...ctr, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{fontFamily: B.serif, fontWeight: 700, fontSize: (e as any).size ?? 240, color: B.lime, letterSpacing: -6, whiteSpace: 'nowrap'}}>{e.prefix}{v.toFixed(e.decimals ?? 0)}{e.suffix}</div>
        {e.label && <div style={{fontFamily: B.sans, fontWeight: 600, fontSize: 52, color: B.paper, marginTop: 24, opacity: rise(t, 1.0), letterSpacing: -1}}>{e.label}</div>}
        {(e as any).note && <div style={{marginTop: 46, opacity: rise(t, (e as any).noteAt ?? 2), transform: `translateY(${(1 - ease(rise(t, (e as any).noteAt ?? 2))) * 24}px) rotate(-2deg)`,
          background: B.lime, color: B.ink, fontFamily: B.sans, fontWeight: 800, fontSize: 40, letterSpacing: -1, padding: '2px 16px'}}>{(e as any).note}</div>}
        {(e as any).source && <div style={{marginTop: 44, textAlign: 'center', fontFamily: B.mono, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: B.muted, opacity: rise(t, 0.6)}}>{(e as any).source}</div>}
      </div></AbsoluteFill>;
  }
  if (e.kind === 'bars') {
    const max = e.max ?? Math.max(...e.items.map((i) => i.value));
    return <AbsoluteFill style={wrap}><Tag text={e.tag} />
      <div style={{...ctr, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 40}}>
        {e.items.map((it, i) => {
          const p = ease(rise(t, it.at ?? 0.3 + i * 0.5, 0.9));
          return <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
            <div style={{fontFamily: B.serif, fontWeight: 700, fontSize: 64, color: B.lime, marginBottom: 12}}>{(it.value * p).toFixed(it.value % 1 ? 1 : 0)}{e.suffix}</div>
            <div style={{width: '100%', height: `${(it.value / max) * 78 * p}%`, background: i % 2 ? B.paper : B.lime}} />
            <div style={{fontFamily: B.sans, fontSize: 34, color: B.paper, marginTop: 16}}>{it.label}</div></div>;
        })}</div></AbsoluteFill>;
  }
  if (e.kind === 'checklist' || e.kind === 'flow') {
    return <AbsoluteFill style={wrap}><Tag text={e.tag} />
      <div style={{...ctr, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34}}>
        {e.items.map((it, i) => {
          const p = ease(rise(t, it.at, 0.45));
          return <React.Fragment key={i}>
            <div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
              <div style={{width: 64, height: 64, borderRadius: e.kind === 'flow' ? 32 : 12, background: B.lime, color: B.ink, fontFamily: B.mono, fontWeight: 700, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{e.kind === 'flow' ? i + 1 : '✓'}</div>
              <div style={{fontFamily: B.sans, fontWeight: 700, fontSize: 56, color: B.paper, letterSpacing: -1}}>{it.text}</div></div>
            {e.kind === 'flow' && i < e.items.length - 1 && <div style={{marginLeft: 31, width: 2, height: 36 * p, background: B.lime}} />}
          </React.Fragment>;
        })}</div></AbsoluteFill>;
  }
  // dots: grade de quadradinhos que vão acendendo (como o parlamento do vídeo 4)
  const cols = 20, rows = Math.ceil(e.total / cols);
  const lit = Math.round(e.filled * ease(rise(t, 0.3, 1.8)));
  return <AbsoluteFill style={wrap}><Tag text={e.tag} />
    <div style={{...ctr, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontFamily: B.serif, fontWeight: 700, fontSize: 180, color: B.lime}}>{lit}<span style={{fontSize: 64, color: B.muted}}> / {e.total}</span></div>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, width: '100%', marginTop: 30}}>
        {Array.from({length: e.total}).map((_, i) => <div key={i} style={{aspectRatio: '1', background: i < lit ? B.lime : '#26262a'}} />)}</div>
      {e.label && <div style={{fontFamily: B.sans, fontSize: 42, color: B.paper, marginTop: 30}}>{e.label}</div>}
    </div></AbsoluteFill>;
};
