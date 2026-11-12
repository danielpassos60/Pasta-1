import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions, EmphasisLayer, InsertLayer, TitleBlock} from './Overlays';
import {Explainer} from './Explainers';
import {PANEL_H, PanelView} from './Panels';
import {StickerLayer} from './Stickers';
import {BRAND as B} from './brand';
import type {Plan, Sfx} from './types';
import '@fontsource/inter-tight/400.css'; import '@fontsource/inter-tight/600.css'; import '@fontsource/inter-tight/700.css'; import '@fontsource/inter-tight/800.css';
import '@fontsource/playfair-display/700.css'; import '@fontsource/jetbrains-mono/500.css'; import '@fontsource/jetbrains-mono/700.css';

// Efeitos sonoros automáticos: pop nos inserts/stickers, whoosh ao abrir painel/explicação, tick nos itens, click nas palavras-chave
export const autoSfx = (p: Plan): Sfx[] => {
  const out: Sfx[] = [...(p.sfx ?? [])];
  if (p.title) out.push({at: 0.05, name: 'pop', vol: 0.7});
  splitGroups(p).forEach(([a, b]) => { out.push({at: a, name: 'whoosh', vol: 0.55}); out.push({at: b - 0.05, name: 'whoosh', vol: 0.35}); });
  (p.inserts ?? []).forEach((i) => {
    if (i.type === 'split') {
      const pn: any = i.panel; out.push({at: i.start + 0.05, name: 'click', vol: 0.45});
      (pn?.items ?? pn?.rows ?? []).forEach((it: any) => out.push({at: i.start + it.at, name: 'tick', vol: 0.5}));
      if (pn?.kind === 'calendar') { const n = pn.days, f = pn.from ?? 0.3; for (let k = 0; k < n; k++) out.push({at: i.start + f + k * (pn.to - f) / n, name: k === n - 1 ? 'pop' : 'tick', vol: k === n - 1 ? 0.8 : 0.3}); }
    } else { out.push({at: i.start, name: i.type === 'explain' ? 'whoosh' : 'pop', vol: 0.6}); out.push({at: i.end - 0.1, name: 'click', vol: 0.35}); }
  });
  (p.stickers ?? []).forEach((s) => out.push({at: s.start, name: 'pop', vol: 0.6}));
  (p.emphasis ?? []).forEach((e) => out.push({at: e.start, name: 'click', vol: 0.6}));
  return out;
};

// junta painéis "split" encostados para a tela não abrir/fechar entre eles
export const splitGroups = (p: Plan): [number, number][] => {
  const g: [number, number][] = [];
  (p.inserts ?? []).filter((i) => i.type === 'split').sort((a, b) => a.start - b.start).forEach((i) => {
    const last = g[g.length - 1];
    if (last && i.start - last[1] < 0.35) last[1] = i.end; else g.push([i.start, i.end]);
  });
  return g;
};

export const Reel: React.FC<{plan: Plan}> = ({plan}) => {
  const frame = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  const F = (s: number) => Math.round(s * fps);
  const cfg = {damping: 200, stiffness: 170, mass: 0.7};
  let sp = 0;
  for (const [a, b] of splitGroups(plan)) {
    const pin = spring({frame: frame - F(a), fps, config: cfg}); const pout = 1 - spring({frame: frame - F(b), fps, config: cfg});
    sp = Math.max(sp, Math.min(pin, pout));
  }
  const top = sp * PANEL_H;
  // empurrão lento (push-in) dentro de cada corte, para a imagem nunca ficar parada
  const cuts = plan.cuts ?? []; const tt = frame / fps; let push = 1;
  for (let i = cuts.length - 1; i >= 0; i--) if (tt >= cuts[i]) { const end = cuts[i + 1] ?? plan.durationSec; push = 1 + 0.03 * Math.min(1, (tt - cuts[i]) / Math.max(1.5, end - cuts[i])); break; }
  return (
    <AbsoluteFill style={{background: B.dark}}>
      <div style={{position: 'absolute', left: 0, right: 0, top, bottom: 0, overflow: 'hidden'}}>
        <OffthreadVideo src={staticFile(plan.video)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 8%', transform: `scale(${push})`, transformOrigin: '50% 28%'}} />
      </div>
      {sp > 0.001 && <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: PANEL_H, transform: `translateY(${top - PANEL_H}px)`, background: B.dark, borderBottom: `8px solid ${B.lime}`, overflow: 'hidden'}}>
        {(plan.inserts ?? []).filter((i) => i.type === 'split' && i.panel).map((i, k) => (
          <Sequence key={'p' + k} from={F(i.start)} durationInFrames={Math.max(1, F(i.end) - F(i.start))} layout="none"><PanelView p={i.panel!} dur={F(i.end) - F(i.start)} /></Sequence>))}
      </div>}
      {(plan.inserts ?? []).filter((i) => i.type !== 'split').map((i, k) => (
        <Sequence key={k} from={F(i.start)} durationInFrames={Math.max(1, F(i.end - i.start))}>
          {i.type === 'explain' && i.explain
            ? <Explainer e={i.explain} />
            : <InsertLayer src={i.src} type={i.type as any} label={i.label} caption={i.caption} dur={F(i.end - i.start)} />}
        </Sequence>))}
      <StickerLayer items={plan.stickers ?? []} />
      {plan.title && <TitleBlock title={plan.title} />}
      <EmphasisLayer items={plan.emphasis ?? []} />
      <Captions captions={plan.captions} />
      {plan.progress && <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${(frame / Math.max(1, durationInFrames - 1)) * 100}%`, background: B.lime}} />}
      {autoSfx(plan).map((s, k) => (
        <Sequence key={'s' + k} from={Math.max(0, F(s.at))}><Audio src={staticFile(`sfx/${s.name}.wav`)} volume={(s.vol ?? 0.8) * (plan.sfxGain ?? 0.8)} /></Sequence>))}
    </AbsoluteFill>
  );
};
