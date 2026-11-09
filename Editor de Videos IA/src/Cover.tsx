import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';
import {TitleBlock} from './Overlays';
import type {Plan} from './types';
// Capa do feed: sempre o mesmo padrão (faixa de imagens + tag + título verde sobre o apresentador)
export const Cover: React.FC<{plan: Plan}> = ({plan}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <OffthreadVideo src={staticFile(plan.video)} startFrom={Math.round((plan.coverAt ?? 1) * 30)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    {plan.title && <TitleBlock title={{...plan.title, until: 999}} />}
  </AbsoluteFill>);
