#!/usr/bin/env python3
"""Monta o vídeo-base a partir das melhores tomadas, usando o ÁUDIO DO MICROFONE como guia.
- Sincroniza câmera x microfone (offsets em spec), gira, espelha e corrige o bordado do jaleco
  (o texto volta a ficar legível mesmo com o vídeo espelhado, rastreado quadro a quadro).
- Remove silêncios internos de cada tomada e alterna zoom (punch-in) a cada corte.
Uso: python3 scripts/montar_tomadas.py planos/<nome>_spec.json"""
import json, os, subprocess, sys, wave
import numpy as np, cv2
sys.path.insert(0, os.path.dirname(__file__))
from bordado import TextFix
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
W, H, FPS = 1080, 1920, 30

def mic_rms(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    h = 160; n = len(x) // h
    return 20 * np.log10(np.sqrt((x[:n*h].reshape(n, h) ** 2).mean(1)) + 1e-6)  # dB a cada 10 ms

def split_silence(db, a, b, thr, minsil=0.38, pad=0.07):
    i0, i1 = int(a * 100), int(b * 100); s = db[i0:i1] > thr
    parts, cur, k = [], None, 0
    while k < len(s):
        if s[k]:
            if cur is None: cur = k
            k += 1
        else:
            j = k
            while j < len(s) and not s[j]: j += 1
            if cur is not None and (j - k) / 100 >= minsil:
                parts.append((cur, k)); cur = None
            k = j
    if cur is not None: parts.append((cur, len(s)))
    out = [(max(a, a + p / 100 - pad), min(b, a + q / 100 + pad)) for p, q in parts if (q - p) > 8]
    return out or [(a, b)]

def frames(cam, t, dur):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', cam, '-t', f'{dur:.3f}', '-vf', f'transpose=1,fps={FPS}',
                          '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    try:
        while True:
            b = p.stdout.read(W * H * 3)
            if len(b) < W * H * 3: break
            yield np.frombuffer(b, np.uint8).reshape(H, W, 3)
    finally:
        p.kill(); p.wait()

def zoom(img, z, top=0.30):
    if z == 1: return img
    w, h = int(W / z), int(H / z); x = (W - w) // 2; y = int((H - h) * top)
    return cv2.resize(img[y:y+h, x:x+w], (W, H), interpolation=cv2.INTER_LANCZOS4)

def main(spec_path):
    S = json.load(open(spec_path)); P = lambda p: os.path.join(ROOT, p)
    tmp = P('planos/.tmp_' + S['nome']); os.makedirs(tmp, exist_ok=True)
    db = mic_rms(P(S['mic'])); thr = np.percentile(db, 20) + S.get('silence_db_above_floor', 14)
    tf = None
    if S.get('fix_text'): tf = TextFix(cv2.imread(P(S['fix_text'])), pad=30, feather=20)
    cuts = []
    for seg in S['segments']:
        a, b = seg[0], seg[1]
        if len(seg) > 2 and seg[2] == 'raw': cuts.append((a, b))            # sem aparar (início/fim definidos à mão)
        else:
            sp = split_silence(db, a, b, thr)
            if len(seg) > 2 and seg[2] == 'keepstart': sp[0] = (a, sp[0][1])
            cuts += sp
    print(len(cuts), 'cortes; duração', round(sum(b - a for a, b in cuts), 2), 's')
    vlist = []
    for i, (a, b) in enumerate(cuts):
        cam = next(c for c in S['cams'] if c['offset'] <= a and b <= c['offset'] + c['dur'])
        z = S.get('zoom', 1.12) if i % 2 else 1.0
        out = f'{tmp}/v{i:03d}.mp4'; n = round((b - a) * FPS)
        enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                                '-frames:v', str(n), '-c:v', 'libx264', '-crf', '15', '-preset', 'fast', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
        k = 0; last = None
        if tf is not None: tf.reset()
        for F in frames(P(cam['file']), a - cam['offset'], b - a + 0.2):
            if k >= n: break
            M = np.ascontiguousarray(F[:, ::-1]) if S.get('mirror', True) else F.copy()
            if tf is not None and S.get('mirror', True): M = tf.apply(F, M)
            last = zoom(M, z); enc.stdin.write(last.tobytes()); k += 1
        while k < n and last is not None: enc.stdin.write(last.tobytes()); k += 1
        enc.stdin.close(); enc.wait(); vlist.append(out)
        print(f'  corte {i+1}/{len(cuts)}  mic {a:.2f}-{b:.2f}  zoom {z}', flush=True)
    # áudio do microfone: mesmos cortes, micro-fades, tratamento de voz
    fil = ''.join(f"[0:a]atrim={a:.3f}:{a + round((b-a)*FPS)/FPS:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={round((b-a)*FPS)/FPS-0.015:.3f}:d=0.015[a{i}];" for i, (a, b) in enumerate(cuts))
    fil += ''.join(f'[a{i}]' for i in range(len(cuts))) + f'concat=n={len(cuts)}:v=0:a=1,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-14:TP=-1.5:LRA=9[a]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', P(S['mic']), '-filter_complex', fil, '-map', '[a]', '-ar', '48000', f'{tmp}/audio.wav'], check=True)
    open(f'{tmp}/list.txt', 'w').write(''.join(f"file '{v}'\n" for v in vlist))
    grade = S.get('grade', 'null')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{tmp}/list.txt', '-i', f'{tmp}/audio.wav', '-vf', grade,
                    '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', P(S['out'])], check=True)
    json.dump([[a, b] for a, b in cuts], open(P(f"planos/{S['nome']}_cortes.json"), 'w'))
    print('PRONTO', S['out'])

if __name__ == '__main__': main(sys.argv[1])
