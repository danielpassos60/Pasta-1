import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND as B} from './brand';

// Painéis explicativos do modo "tela dividida": ficam na parte de cima enquanto o apresentador continua embaixo.
export const PANEL_H = 570;
export type Panel =
  | {kind: 'source'; tag?: string; big: string; sub?: string; chip?: string; subAt?: number; chipAt?: number}
  | {kind: 'calendar'; tag?: string; heading?: string; days: number; from?: number; to: number; label?: string}
  | {kind: 'checklist'; tag?: string; items: {text: string; at: number}[]}
  | {kind: 'versus'; tag?: string; rows: {left: string; right: string; at: number; rightAt?: number; good?: boolean}[]}
  | {kind: 'signs'; tag?: string; source?: string; intro?: string; items: {text: string; at: number; img?: string; icon?: 'sangue' | 'caroco' | 'semdor'; term?: string}[]}
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

  if (p.kind === 'signs') {
    const act = p.items.reduce((acc, it, i) => (t >= it.at ? i : acc), -1);
    const paper = B.paper, P = {fill: 'none', stroke: paper, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
    const Ill: React.FC<{name?: string}> = ({name}) => <svg viewBox="0 0 200 176" width="100%" height="100%">
      {name === 'sangue' && <>
        <path d="M22 44 C60 60 140 60 178 44" {...P} strokeWidth={5} opacity={0.55} />
        <path d="M100 52 C100 52 66 98 66 122 a34 34 0 0 0 68 0 C134 98 100 52 100 52 Z" fill={B.lime} />
        <path d="M84 124 a17 17 0 0 0 14 15" fill="none" stroke={B.ink} strokeWidth="5" strokeLinecap="round" />
        <path d="M152 78 C152 78 140 95 140 104 a12 12 0 0 0 24 0 C164 95 152 78 152 78 Z" {...P} strokeWidth={5} />
        <path d="M46 84 C46 84 37 97 37 104 a9 9 0 0 0 18 0 C55 97 46 84 46 84 Z" {...P} strokeWidth={5} /></>}
      {name === 'caroco' && <>
        <path d="M72 124 C84 124 82 64 100 64 C118 64 116 124 128 124 Z" fill={B.lime} />
        <path d="M16 124 H72 C84 124 82 64 100 64 C118 64 116 124 128 124 H184" {...P} />
        <circle cx="100" cy="92" r="50" fill="none" stroke={B.lime} strokeWidth="4" strokeDasharray="7 9" />
        <path d="M40 146 H160 M40 139 V153 M160 139 V153" {...P} strokeWidth={4} opacity={0.6} /></>}
      {name === 'semdor' && <>
        <circle cx="74" cy="92" r="40" {...P} />
        <circle cx="74" cy="92" r="15" fill={B.lime} />
        <path d="M150 44 L128 92 H146 L134 136 L170 80 H150 L162 44 Z" {...P} strokeWidth={5} />
        <path d="M118 40 L180 142" stroke={B.lime} strokeWidth="8" strokeLinecap="round" /></>}
    </svg>;
    body = <div style={{...box, display: 'flex', gap: 44}}>
      <div style={{width: 400, flex: 'none', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 24, background: B.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: act < 0 ? 1 : 0,
          transform: `scale(${0.9 + 0.1 * pop(f, fps, 0.05)})`}}>
          <div style={{fontFamily: B.serif, fontWeight: 700, fontSize: 280, lineHeight: 1, color: B.ink}}>!</div></div>
        {p.items.map((it, i) => {
          if (i !== act) return null;
          const s = pop(f, fps, it.at);
          return <div key={i} style={{position: 'absolute', inset: 0, transform: `scale(${0.86 + 0.14 * s})`, opacity: Math.min(1, s * 1.6)}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', background: '#17171b', border: it.img ? 'none' : '2px solid #2e2e35', padding: it.img ? 0 : 34}}>
              {it.img ? <Img src={staticFile(it.img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Ill name={it.icon} />}
              {it.img && <div style={{position: 'absolute', top: 14, right: 14, background: 'rgba(11,11,13,.72)', color: B.paper, fontFamily: B.mono, fontWeight: 500, fontSize: 17, letterSpacing: 2, padding: '4px 10px', borderRadius: 8}}>FOTO CLÍNICA</div>}
            </div>
            {it.term && <div style={{position: 'absolute', left: -14, bottom: 22, transform: `rotate(-3deg) scale(${pop(f, fps, it.at + 0.18)})`, transformOrigin: 'left bottom', background: B.lime, color: B.ink,
              fontFamily: B.sans, fontWeight: 800, fontSize: 46, letterSpacing: -1.5, padding: '0 14px', boxShadow: '0 8px 24px rgba(0,0,0,.4)'}}>{it.term}</div>}
          </div>;
        })}
      </div>
      <div style={{flex: 1, position: 'relative'}}>
        {p.intro && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', opacity: act < 0 ? rise(t, 0.15) : 0, whiteSpace: 'pre-line',
          fontFamily: B.sans, fontWeight: 800, fontSize: 68, lineHeight: 1.02, letterSpacing: -2.5, color: paper}}>{p.intro}</div>}
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12}}>
          {p.items.map((it, i) => {
            const k = ease(rise(t, it.at, 0.35)); const on = i === act;
            return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: k, transform: `translateX(${(1 - k) * 40}px)`}}>
              <div style={{width: 40, height: 40, flex: 'none', borderRadius: 20, background: on ? B.lime : 'transparent', border: `3px solid ${B.lime}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: B.mono, fontWeight: 700, fontSize: 22, color: on ? B.ink : B.lime}}>{i + 1}</div>
              <div style={{fontFamily: B.sans, fontWeight: 700, fontSize: 37, lineHeight: 1.2, letterSpacing: -1, whiteSpace: 'nowrap', color: on ? B.ink : paper, background: on ? B.lime : 'transparent', padding: on ? '0 10px' : 0, marginLeft: on ? -4 : 0}}>{it.text}</div>
            </div>;
          })}
        </div>
      </div>
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

  const src = (p as any).source;
  return <div style={{position: 'absolute', inset: 0, opacity: fade}}><Tag text={(p as any).tag} />
    {src && <div style={{position: 'absolute', top: 118, right: 70, fontFamily: B.mono, fontWeight: 500, fontSize: 20, letterSpacing: 2, color: B.muted}}>{src}</div>}
    {body}</div>;
};
