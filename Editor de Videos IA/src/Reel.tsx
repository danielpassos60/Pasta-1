import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {Captions, EmphasisLayer, InsertLayer, TitleBlock} from './Overlays';
import {Explainer} from './Explainers';
import {BRAND as B} from './brand';
import type {Plan, Sfx} from './types';
import '@fontsource/inter-tight/400.css'; import '@fontsource/inter-tight/600.css'; import '@fontsource/inter-tight/700.css'; import '@fontsource/inter-tight/800.css';
import '@fontsource/playfair-display/700.css'; import '@fontsource/jetbrains-mono/500.css'; import '@fontsource/jetbrains-mono/700.css';

// Efeitos sonoros automáticos: pop a cada inserto, whoosh nas explicações, click nas palavras-chave
export const autoSfx = (p: Plan): Sfx[] => {
  const out: Sfx[] = [...(p.sfx ?? [])];
  if (p.title) out.push({at: 0.05, name: 'pop'});
  (p.inserts ?? []).forEach((i) => { out.push({at: i.start, name: i.type === 'explain' ? 'whoosh' : 'pop'}); out.push({at: i.end - 0.1, name: 'click', vol: 0.5}); });
  (p.emphasis ?? []).forEach((e) => out.push({at: e.start, name: 'click'}));
  return out;
};

export const Reel: React.FC<{plan: Plan}> = ({plan}) => {
  const fps = 30;
  const F = (s: number) => Math.round(s * fps);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile(plan.video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      {(plan.inserts ?? []).map((i, k) => (
        <Sequence key={k} from={F(i.start)} durationInFrames={Math.max(1, F(i.end - i.start))}>
          {i.type === 'explain' && i.explain
            ? <Explainer e={i.explain} />
            : <InsertLayer src={i.src} type={i.type as any} label={i.label} caption={i.caption} dur={F(i.end - i.start)} />}
        </Sequence>))}
      {plan.title && <TitleBlock title={plan.title} />}
      <EmphasisLayer items={plan.emphasis ?? []} />
      <Captions captions={plan.captions} />
      {plan.handle && <div style={{position: 'absolute', right: 30, bottom: 120, color: '#fff', fontFamily: B.sans, fontWeight: 700, fontSize: 26, opacity: 0}}>{plan.handle}</div>}
      {autoSfx(plan).map((s, k) => (
        <Sequence key={'s' + k} from={Math.max(0, F(s.at))}><Audio src={staticFile(`sfx/${s.name}.wav`)} volume={s.vol ?? 0.8} /></Sequence>))}
    </AbsoluteFill>
  );
};
