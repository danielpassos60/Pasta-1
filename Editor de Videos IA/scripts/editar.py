#!/usr/bin/env python3
"""Pipeline: vídeo cru -> corta silêncios -> transcreve (Whisper) -> plano -> renderiza reel + capa.
Uso:  python3 scripts/editar.py "Material Bruto/meu_video.mp4" [--titulo "guia de marca"] [--tag "(tour pelo meu)"]
      python3 scripts/editar.py --renderizar planos/meu_video.json     # só renderiza um plano já editado
O plano (planos/<nome>.json) é onde entram inserts, palavras-chave e explicações — o Claude preenche
lendo a transcrição (planos/<nome>.transcricao.txt) e depois roda --renderizar."""
import argparse, json, os, re, subprocess, sys, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
def sh(cmd, **k): return subprocess.run(cmd, check=True, text=True, **k)
def dur(p): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p], text=True))

def cortar_silencios(src, dst, db=-32, minsil=0.4, pad=0.08):
    r = subprocess.run(['ffmpeg','-i',src,'-af',f'silencedetect=n={db}dB:d={minsil}','-f','null','-'], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    total = dur(src); keep, cur = [], 0.0
    for s, e in zip(starts, ends + [total] * (len(starts) - len(ends))):
        if s - cur > 0.15: keep.append((max(0, cur - pad), min(total, s + pad)))
        cur = e
    if total - cur > 0.15: keep.append((max(0, cur - pad), total))
    if not keep: keep = [(0, total)]
    f = ''.join(f"[0:v]trim={a:.3f}:{b:.3f},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[a{i}];" for i, (a, b) in enumerate(keep))
    f += ''.join(f'[v{i}][a{i}]' for i in range(len(keep))) + f'concat=n={len(keep)}:v=1:a=1[v][a]'
    sh(['ffmpeg','-y','-i',src,'-filter_complex',f + ';[v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30[vo]','-map','[vo]','-map','[a]','-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac',dst], stderr=subprocess.DEVNULL)

def transcrever(path, modelo='small'):
    import whisper
    m = whisper.load_model(modelo)
    return m.transcribe(path, language='pt', word_timestamps=True)

def legendas(res, max_palavras=4, max_gap=0.45):
    words = [w for s in res['segments'] for w in s['words']]
    caps, buf = [], []
    def flush():
        if buf: caps.append({'text': ' '.join(w['word'].strip() for w in buf).lower(), 'start': round(buf[0]['start'], 2), 'end': round(buf[-1]['end'] + 0.1, 2)})
    for w in words:
        if buf and (len(buf) >= max_palavras or w['start'] - buf[-1]['end'] > max_gap or re.search(r'[.?!]$', buf[-1]['word'])):
            flush(); buf.clear()
        buf.append(w)
    flush(); buf.clear()
    return caps

def renderizar(plano):
    nome = os.path.splitext(os.path.basename(plano))[0]
    plan = json.load(open(plano)); props = os.path.join(ROOT, 'planos', f'.{nome}.props.json')
    json.dump({'plan': plan}, open(props, 'w'))
    br = (glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome') or [None])[0]
    ex = ['--browser-executable=' + br, '--chrome-mode=chrome-for-testing'] if br else []
    os.makedirs(os.path.join(ROOT, 'Videos Prontos'), exist_ok=True)
    sh(['npx','remotion','render','src/index.ts','Reel',f'Videos Prontos/{nome}.mp4',f'--props={props}',*ex], cwd=ROOT)
    sh(['npx','remotion','still','src/index.ts','Capa',f'Videos Prontos/{nome}_capa.png',f'--props={props}',*ex], cwd=ROOT)
    print('PRONTO ->', f'Videos Prontos/{nome}.mp4', '+ capa')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('video', nargs='?'); ap.add_argument('--titulo'); ap.add_argument('--tag')
    ap.add_argument('--modelo', default='small'); ap.add_argument('--renderizar'); a = ap.parse_args()
    if a.renderizar: renderizar(a.renderizar); sys.exit()
    nome = re.sub(r'\W+', '_', os.path.splitext(os.path.basename(a.video))[0]).strip('_')
    pub = os.path.join(ROOT, 'public'); os.makedirs(pub, exist_ok=True); os.makedirs(os.path.join(ROOT, 'planos'), exist_ok=True)
    cut = os.path.join(pub, f'{nome}.mp4'); print('1/3 cortando silêncios…'); cortar_silencios(a.video, cut)
    print('2/3 transcrevendo…'); res = transcrever(cut, a.modelo)
    plano = {'video': f'{nome}.mp4', 'durationSec': round(dur(cut), 2), 'coverAt': 1,
             'title': {'tag': a.tag, 'text': a.titulo or nome.replace('_', ' ')}, 'captions': legendas(res), 'emphasis': [], 'inserts': []}
    json.dump(plano, open(os.path.join(ROOT, 'planos', f'{nome}.json'), 'w'), ensure_ascii=False, indent=2)
    open(os.path.join(ROOT, 'planos', f'{nome}.transcricao.txt'), 'w').write('\n'.join(f"[{c['start']:6.2f}] {c['text']}" for c in plano['captions']))
    print('3/3 plano criado: planos/%s.json — agora o Claude adiciona inserts/explicações e roda --renderizar' % nome)
