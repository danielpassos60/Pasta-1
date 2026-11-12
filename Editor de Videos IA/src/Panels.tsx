import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND as B} from './brand';

// Painéis explicativos do modo "tela dividida": ficam na parte de cima enquanto o apresentador continua embaixo.
export const PANEL_H = 570;
export type Panel =
  | {kind: 'source'; tag?: string; big: string; sub?: string; chip?: string; subAt?: number; chipAt?: number}
  | {kind: 'calendar'; tag?: string; heading?: string; days: number; from?: number; to: number; label?: string}
  | {kind: 'checklist'; tag?: string; items: {text: string; at: number}[]}
  | {kind: 'versus'; tag?: string; rows: {left: string; right: string; at: number; rightAt?: number; good?: boolean}[]}
  | {kind: 'growth'; tag?: string; from: string; to: string; at?: number};

const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, t: f / fps}; };
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rise = (t: number, at: number, d = 0.45) => interpolate(t, [at, at + d], [0, 1], cl);
const ease = (x: number) => 1 - Math.pow(1 - x, 3);
const pop = (f: number, fps: number, at: number) => spring({frame: f - Math.round(at * fps), fps, config: {damping: 11, stiffness: 190, mass: 0.6}});

const Tag: React.FC<{text?: string}> = ({text}) => text ? (
  <div style={{position: 'absolute', top: 116, left: 70, fontFamily: B.mono, fontWeight: 500, fontSize: 24, letterSpacing: 5, color: B.lime, textTransform: 'uppercase'}}>{text}</div>) : null;

export const PanelView: React.FC<{p: Panel; dur: number}> = ({p, dur}) => {
  const {f, fps, t} = useT();
  const fade = Math.min(rise(t, 0, 0.25), interpolate(f, [dur - 5, dur], [1, 0], cl));
  const box: React.CSSProperties = {position: 'absolute', left: 70, right: 70, top: 166, bottom: 40};
  let body: React.ReactNode = null;

  if (p.kind === 'source') {
    const s = pop(f, fps, 0.05);
    body = <div style={{...box, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{fontFamily: B.serif, fontWeight: 700, fontSize: 190, lineHeight: 0.9, color: B.paper, letterSpacing: -5, transform: `scale(${0.8 + 0.2 * s})`, transformOrigin: 'left center'}}>{p.big}</div>
      {p.sub && <div style={{fontFamily: B.sans, fontWeight: 600, fontSize: 40, color: B.paper, opacity: rise(t, p.subAt ?? 0.5), marginTop: 12}}>{p.sub}</div>}
      {p.chip && <div style={{marginTop: 18, opacity: rise(t, p.chipAt ?? 1.5), transform: `translateX(${(1 - ease(rise(t, p.chipAt ?? 1.5))) * -40}px) rotate(-2deg)`, alignSelf: 'flex-start',
        background: B.lime, color: B.ink, fontFamily: B.sans, fontWeight: 800, fontSize: 46, padding: '2px 16px', letterSpacing: -1}}>{p.chip}</div>}
    </div>;
  }

  if (p.kind === 'calendar') {
    const from = p.from ?? 0.3; const n = p.days; const per = (p.to - from) / n;
    const cell = 92, gap = 12, cols = 5;
    body = <div style={{...box, display: 'flex', alignItems: 'center', gap: 46}}>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap}}>
        {Array.from({length: n}).map((_, i) => {
          const a = from + i * per; const k = ease(rise(t, a, Math.min(0.28, per * 1.6))); const last = i === n - 1;
          const s = last ? pop(f, fps, a) : 1;
          return <div key={i} style={{width: cell, height: cell, borderRadius: 14, position: 'relative', border: `2px solid ${last && k > 0 ? B.lime : '#3a3a40'}`,
            background: last && k > 0 ? B.lime : 'transparent', transform: `scale(${last ? 0.9 + 0.22 * s - 0.12 * Math.min(1, s) : 1})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: B.mono, fontWeight: 700, fontSize: last ? 48 : 30, color: last && k > 0 ? B.ink : '#77777d'}}>
            {i + 1}
            {!last && <svg viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}>
              <line x1="20" y1="20" x2={20 + 60 * Math.min(1, k * 2)} y2={20 + 60 * Math.min(1, k * 2)} stroke={B.lime} strokeWidth="9" strokeLinecap="round" opacity={k > 0 ? 1 : 0} />
              <line x1="80" y1="20" x2={80 - 60 * Math.max(0, k * 2 - 1)} y2={20 + 60 * Math.max(0, k * 2 - 1)} stroke={B.lime} strokeWidth="9" strokeLinecap="round" opacity={k > 0.5 ? 1 : 0} />
            </svg>}
          </div>;
        })}
      </div>
      <div style={{flex: 1}}>
        {p.heading && <div style={{fontFamily: B.sans, fontWeight: 600, fontSize: 36, lineHeight: 1.15, color: B.paper, opacity: rise(t, 0.1)}}>{p.heading}</div>}
        <div style={{fontFamily: B.serif, fontWeight: 700, fontSize: 140, lineHeight: 1, color: B.lime, letterSpacing: -4, opacity: rise(t, p.to - 0.1, 0.2), transform: `scale(${pop(f, fps, p.to - 0.1)})`, transformOrigin: 'left center'}}>{n}</div>
        {p.label && <div style={{fontFamily: B.sans, fontWeight: 800, fontSize: 52, color: B.paper, opacity: rise(t, p.to + 0.1), letterSpacing: -1}}>{p.label}</div>}
      </div>
    </div>;
  }

  if (p.kind === 'checklist') {
    body = <div style={{...box, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 13}}>
      {p.items.map((it, i) => {
        const k = ease(rise(t, it.at, 0.4)); const s = pop(f, fps, it.at);
        return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: k, transform: `translateX(${(1 - k) * 50}px)`}}>
          <div style={{width: 48, height: 48, flex: 'none', borderRadius: 10, background: B.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`}}>
            <svg viewBox="0 0 24 24" width="31" height="31"><path d="M12 5 V14 M12 18.5 V19" stroke={B.ink} strokeWidth="3.4" strokeLinecap="round" fill="none" /></svg></div>
          <div style={{fontFamily: B.sans, fontWeight: 700, fontSize: 46, lineHeight: 1.05, color: B.paper, letterSpacing: -1.2}}>{it.text}</div>
        </div>;
      })}
    </div>;
  }

  if (p.kind === 'versus') {
    body = <div style={{...box, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22}}>
      {p.rows.map((r, i) => {
        const k = ease(rise(t, r.at, 0.4)); const s = pop(f, fps, r.rightAt ?? r.at + 0.35);
        return <div key={i} style={{opacity: k, transform: `translateY(${(1 - k) * 30}px)`}}>
          <div style={{fontFamily: B.sans, fontWeight: 600, fontSize: 38, color: '#b9b9b4', letterSpacing: -0.5}}>{r.left}</div>
          <div style={{display: 'inline-block', marginTop: 4, transform: `scale(${s}) rotate(${r.good ? 0 : -1.5}deg)`, transformOrigin: 'left center', fontFamily: B.sans, fontWeight: 800, fontSize: 70, letterSpacing: -2.5, lineHeight: 1.05,
            color: r.good ? B.paper : B.ink, background: r.good ? 'transparent' : B.lime, padding: r.good ? 0 : '0 16px'}}>{r.right}</div>
        </div>;
      })}
    </div>;
  }

  if (p.kind === 'growth') {
    const a = p.at ?? 0.3; const k = ease(rise(t, a, 1.6));
    const path = 'M 20 250 C 220 245, 380 210, 520 150 S 800 40, 920 22'; const len = 1010;
    body = <div style={{...box}}>
      <svg viewBox="0 0 940 280" style={{position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: 262}}>
        <line x1="20" y1="262" x2="930" y2="262" stroke="#3a3a40" strokeWidth="3" />
        <path d={path} fill="none" stroke={B.lime} strokeWidth="10" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
        <circle cx="20" cy="250" r="14" fill={B.paper} />
        <circle cx="920" cy="22" r={18 * pop(f, fps, a + 1.5)} fill={B.lime} />
      </svg>
      <div style={{position: 'absolute', left: 0, bottom: 0, fontFamily: B.sans, fontWeight: 700, fontSize: 44, color: B.paper, opacity: rise(t, a)}}>{p.from}</div>
      <div style={{position: 'absolute', right: 0, bottom: 0, transform: `scale(${pop(f, fps, a + 1.5)})`, transformOrigin: 'right bottom', background: B.lime, color: B.ink, fontFamily: B.sans, fontWeight: 800, fontSize: 50, padding: '0 14px', letterSpacing: -1}}>{p.to}</div>
    </div>;
  }

  return <div style={{position: 'absolute', inset: 0, opacity: fade}}><Tag text={(p as any).tag} />{body}</div>;
};
