import React from 'react';
import {Composition, Still, staticFile} from 'remotion';
import {Reel} from './Reel';
import {Cover} from './Cover';
import type {Plan} from './types';
import demo from '../planos/demo.json';

export const Root: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel as any} width={1080} height={1920} fps={30}
      durationInFrames={Math.round((demo as any).durationSec * 30)} defaultProps={{plan: demo as unknown as Plan}}
      calculateMetadata={({props}: any) => ({durationInFrames: Math.max(30, Math.round(props.plan.durationSec * 30))})} />
    <Still id="Capa" component={Cover as any} width={1080} height={1920} defaultProps={{plan: demo as unknown as Plan}} />
  </>
);
