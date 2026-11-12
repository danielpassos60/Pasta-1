export type Caption = {text: string; start: number; end: number};
export type Emphasis = {text: string; start: number; end: number; x?: number; y?: number; rot?: number; size?: number; box?: boolean; countTo?: number; suffix?: string};
export type Explain =
  | {kind: 'bignumber'; tag?: string; value: number; prefix?: string; suffix?: string; decimals?: number; label?: string}
  | {kind: 'bars'; tag?: string; items: {label: string; value: number; at?: number}[]; suffix?: string; max?: number}
  | {kind: 'checklist'; tag?: string; items: {text: string; at: number}[]}
  | {kind: 'flow'; tag?: string; items: {text: string; at: number}[]}
  | {kind: 'dots'; tag?: string; total: number; filled: number; label?: string};
export type Insert = {
  type: 'card' | 'full' | 'float' | 'explain' | 'split';   // split = painel em cima + apresentador embaixo
  panel?: import('./Panels').Panel;
  start: number; end: number;
  src?: string;          // arquivo em public/midia (imagem ou vídeo)
  label?: string;        // texto no topo
  caption?: string;      // texto embaixo
  explain?: Explain;
};
export type Sfx = {at: number; name: 'pop' | 'click' | 'whoosh' | 'ding' | 'riser' | 'tick'; vol?: number};
export type Plan = {
  video: string; durationSec: number; handle?: string; coverAt?: number;
  title?: {tag?: string; text: string; images?: string[]; until?: number; top?: number};
  stickers?: import('./Stickers').Sticker[]; progress?: boolean;
  captions: Caption[]; emphasis?: Emphasis[]; inserts?: Insert[]; sfx?: Sfx[];
};
