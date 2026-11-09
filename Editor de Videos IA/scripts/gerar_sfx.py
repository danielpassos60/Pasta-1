#!/usr/bin/env python3
"""Gera a biblioteca de efeitos sonoros (public/sfx/*.wav): cliques curtos, pops, whoosh, ding, riser.
Baseado nos sons dos vídeos de referência: estalos de banda larga (~10ms) quando um inserto aparece."""
import numpy as np, wave, os
SR = 44100
out = os.path.join(os.path.dirname(__file__), '..', 'public', 'sfx'); os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(7)
def t(d): return np.arange(int(SR * d)) / SR
def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    with wave.open(os.path.join(out, name + '.wav'), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
def hp(x, a=0.95):  # filtro passa-alta simples
    y = np.zeros_like(x); 
    for i in range(1, len(x)): y[i] = a * (y[i-1] + x[i] - x[i-1])
    return y
def lp(x, a=0.1):
    y = np.zeros_like(x)
    for i in range(1, len(x)): y[i] = y[i-1] + a * (x[i] - y[i-1])
    return y
# click: estalo de banda larga (como o tic visto nos espectrogramas)
tt = t(0.06); save('click', hp(rng.normal(size=len(tt))) * np.exp(-tt * 220) + 0.6 * np.sin(2*np.pi*2200*tt) * np.exp(-tt * 300))
# pop: gota grave + estalo
tt = t(0.18); f = 520 * np.exp(-tt * 18) + 120
save('pop', np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt * 26) + 0.5 * hp(rng.normal(size=len(tt))) * np.exp(-tt * 300))
# whoosh: ruído com varredura de brilho
tt = t(0.45); env = np.sin(np.pi * tt / 0.45) ** 2; n = rng.normal(size=len(tt))
a = np.linspace(0.03, 0.5, len(tt)); y = np.zeros_like(n)
for i in range(1, len(n)): y[i] = y[i-1] + a[i] * (n[i] - y[i-1])
save('whoosh', y * env)
# ding: sino curto
tt = t(0.8); save('ding', (np.sin(2*np.pi*1318*tt) + 0.4*np.sin(2*np.pi*2637*tt)) * np.exp(-tt * 6))
# riser: tensão crescente
tt = t(1.0); n = rng.normal(size=len(tt)); a = np.linspace(0.02, 0.6, len(tt)); y = np.zeros_like(n)
for i in range(1, len(n)): y[i] = y[i-1] + a[i] * (n[i] - y[i-1])
save('riser', y * np.linspace(0, 1, len(tt)) ** 2)
print('SFX gerados em', os.path.abspath(out))
