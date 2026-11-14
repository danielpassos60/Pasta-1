#!/usr/bin/env python3
"""Gera planos/ferida15.json (legendas + gráficos sincronizados) a partir de planos/ferida15_words.json."""
import json, os
D = os.path.dirname(__file__); W = json.load(open(f'{D}/ferida15_words.json'))
st = lambda i: W[i]['start']; en = lambda i: W[i]['end']
CAPS = [(0,3,'se você tem uma'),(4,6,'ferida na boca'),(7,9,'conta quantos dias'),(10,12,'ela tá aí'),(13,16,'porque tem um número'),(17,19,'que muda tudo'),
 (20,22,'a maioria das'),(23,25,'feridas na boca'),(26,26,'afta'),(27,27,'mordida'),(28,30,'uso de aparelho'),(31,33,'são comuns e'),(34,37,'são fáceis de tratar'),
 (38,40,'essas costumam normalmente'),(41,42,'sair sozinhas'),(43,45,'normalmente giram em'),(46,49,'torno de duas semanas'),(50,52,'e geralmente você'),(53,57,'mesmo já sabe a causa'),
 (58,60,'agora, o INCA'),(61,65,'Instituto Nacional de Câncer'),(66,67,'no Brasil'),(68,70,'coloca vários alertas'),(71,73,'pra gente'),
 (74,76,'feridas na boca'),(77,81,'ou até mesmo nos lábios'),(82,84,'que não cicatrizam'),(85,88,'em até 15 dias'),(89,90,'junto também'),(91,93,'com outros sinais'),
 (94,97,'e esses podem ser'),(98,100,'aquelas lesões brancas'),(101,104,'que não são removidas'),(105,105,'à raspagem'),(106,109,'então elas não saem'),(110,111,'lesões vermelhas'),
 (112,114,'lesões sangrantes demais'),(115,117,'sensíveis ao toque'),(118,119,'aquele caroço'),(120,121,'que aparece'),(122,125,'e também não some'),(126,129,'feridas que não doem'),(130,133,'também entram na lista'),
 (134,135,'mas calma'),(136,139,'isso não quer dizer'),(140,143,'que você tem câncer'),(144,147,'quer dizer que você'),(148,150,'precisa ser avaliado'),(151,153,'por um dentista'),(154,155,'ou médico'),
 (156,159,'porque câncer de boca'),(160,161,'descoberto cedo'),(162,164,'tem uma chance'),(165,168,'muito maior de cura'),(169,170,'e detalhe'),(171,173,'o Brasil tem'),(174,177,'cerca de 15 mil'),
 (178,181,'casos novos por ano'),(182,184,'segundo o INCA'),(185,187,'então a regra'),(188,189,'é simples'),(190,191,'sarou em até'),(192,193,'duas semanas'),(194,194,'ótimo'),
 (195,198,'passou de 15 dias'),(199,201,'é muito bom'),(202,204,'e vale procurar'),(205,206,'um profissional'),(207,209,'principalmente um dentista'),
 (210,212,'salva esse post'),(213,217,'e manda pra aquela pessoa'),(218,221,'que sempre vive dizendo'),(222,225,'que tem uma afta'),(226,227,'na boca')]
caps = [{'text': t, 'start': round(st(a), 2), 'end': round(en(b) + 0.12, 2)} for a, b, t in CAPS]
for c, n in zip(caps, caps[1:]):
    if n['start'] - c['end'] < 0.3: c['end'] = n['start']
DUR = 89.1
E_ = lambda text, s, e, **k: dict(text=text, start=round(s, 2), end=round(e, 2), **k)
plan = {
 'video': 'ferida15.mp4', 'durationSec': DUR, 'coverAt': 84.45,
 'title': {'tag': 'Ferida na boca há mais de 15 dias?', 'text': 'Assiste isso.', 'until': 2.75, 'top': 810},
 'captions': caps,
 'emphasis': [
  E_('15', st(16) - 0.05, 7.15, y=50, rot=0, size=400, box=False, countTo=15),
  E_('dias', st(18), 7.15, y=61.5, rot=-3, size=84),
  E_('fáceis de tratar', st(34), en(37) + 0.2, y=52, rot=-3, size=86),
  E_('saram sozinhas', st(41), en(42) + 0.15, y=52, rot=2, size=86),
  E_('≈ 2 semanas', st(46), en(49) + 0.2, y=52, rot=-3, size=104),
  E_('calma.', st(135) - 0.05, st(137), y=51, rot=0, size=230, box=False),
  E_('não quer dizer\ncâncer', st(137), en(143) + 0.15, y=52, rot=-3, size=88),
  E_('precisa ser\navaliado', st(148), en(155) + 0.1, y=52, rot=2, size=92),
  E_('a regra é simples', st(186), st(190) - 0.25, y=52, rot=-3, size=88),
 ],
 'stickers': [
  {'icon': 'afta', 'label': 'afta', 'start': st(26), 'end': en(30) + 0.2, 'x': 22, 'y': 56, 'rot': -5},
  {'icon': 'mordida', 'label': 'mordida', 'start': st(27), 'end': en(30) + 0.2, 'x': 50, 'y': 57.5, 'rot': 2},
  {'icon': 'aparelho', 'label': 'aparelho', 'start': st(28), 'end': en(30) + 0.2, 'x': 78, 'y': 56, 'rot': 5},
  {'icon': 'salvar', 'label': 'salva', 'start': st(210), 'end': DUR, 'x': 50, 'y': 50.5, 'rot': -3},
  {'icon': 'enviar', 'label': 'manda pra alguém', 'start': st(214), 'end': DUR, 'x': 50, 'y': 60, 'rot': 2},
 ],
 'inserts': [],
 'sfx': [{'at': st(210), 'name': 'ding', 'vol': 0.45}],
}
I = plan['inserts']
a0 = st(58) - 0.05; a1 = st(74) - 0.1; a2 = st(90) - 0.05; a3 = st(134) - 0.12
I.append({'type': 'split', 'start': a0, 'end': a1, 'panel': {'kind': 'source', 'tag': 'fonte oficial', 'big': 'INCA', 'sub': 'Instituto Nacional de Câncer', 'subAt': st(61) - a0, 'chip': 'sinais de alerta', 'chipAt': st(69) - a0}})
I.append({'type': 'split', 'start': a1, 'end': a2, 'panel': {'kind': 'calendar', 'tag': 'o número', 'heading': 'ferida que não cicatriza em', 'days': 15, 'from': 0.35, 'to': st(87) - a1, 'label': 'dias'}})
I.append({'type': 'split', 'start': a2, 'end': a3, 'panel': {'kind': 'signs', 'tag': 'sinais de alerta', 'source': 'fonte: INCA · OMS', 'intro': 'junto com\noutros sinais', 'items': [
  {'text': 'mancha branca que não sai', 'term': 'leucoplasia', 'icon': 'leuco', 'at': st(98) - a2},
  {'text': 'lesão vermelha', 'term': 'eritroplasia', 'icon': 'eritro', 'at': st(110) - 0.08 - a2},
  {'text': 'lesão que sangra fácil', 'icon': 'sangue', 'at': st(112) - a2},
  {'text': 'caroço que não some', 'icon': 'caroco', 'at': st(118) - a2},
  {'text': 'ferida que não dói', 'icon': 'semdor', 'at': st(126) - a2}]}})
b0 = st(156) - 0.1; b1 = en(168) + 0.02
I.append({'type': 'split', 'start': b0, 'end': b1, 'panel': {'kind': 'growth', 'tag': 'diagnóstico precoce', 'from': 'descoberto cedo', 'to': 'maior chance de cura', 'at': st(160) - b0 + 0.3}})
I.append({'type': 'explain', 'start': st(171) - 0.05, 'end': en(184) + 0.1, 'explain': {'kind': 'bignumber', 'tag': 'câncer de boca no Brasil', 'prefix': '≈ ', 'value': 15, 'suffix': ' mil', 'size': 250, 'label': 'casos novos por ano', 'source': 'fonte: INCA · Estimativa 2023–2025', 'note': 'estimativa 2026–2028: ≈ 17 mil por ano', 'noteAt': 2.3}})
c0 = st(190) - 0.2; c1 = en(209) + 0.1
I.append({'type': 'split', 'start': c0, 'end': c1, 'panel': {'kind': 'versus', 'tag': 'a regra', 'rows': [
  {'left': 'sarou em até 2 semanas', 'right': 'ótimo', 'at': 0.15, 'rightAt': st(194) - c0, 'good': True},
  {'left': 'passou de 15 dias', 'right': 'procure um dentista', 'at': st(195) - c0, 'rightAt': st(203) - c0}]}})
for i in I: i['start'] = round(i['start'], 2); i['end'] = round(i['end'], 2)
# capa: foto de estúdio enviada pelo Daniel, no modelo faixa de imagens + etiqueta + título verde
plan['cover'] = {'shift': 560, 'frame': 'midia/ferida15/capa_foto.png', 'title': {'top': 478, 'images': [
  'midia/ferida15/capa_15.png', 'midia/ferida15/capa_leuco.png', 'midia/ferida15/capa_cal.png', 'midia/ferida15/capa_eritro.png']}}
cuts = json.load(open(f'{D}/ferida15_cortes.json')); tcur = 0.0; plan['cuts'] = []
for a, b in cuts: plan['cuts'].append(round(tcur, 3)); tcur += round((b - a) * 30) / 30
json.dump(plan, open(f'{D}/ferida15.json', 'w'), ensure_ascii=False, indent=1)
print('plano ok:', len(caps), 'legendas,', len(I), 'inserts')
