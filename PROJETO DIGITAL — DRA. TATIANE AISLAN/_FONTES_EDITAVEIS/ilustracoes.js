// Ilustrações exclusivas em traço fino (linha contínua, estilo da marca).
// Cada ilustração é desenhada numa área 200x200. c = { l: linha, a: destaque, f: preenchimento suave, bg: fundo }
const f1 = (n) => +n.toFixed(2);
let SWV = 1.25;

// Dente genérico (molar) — caixa 100x100, posicionado/escalado por transform
const MOLAR = 'M20 34 C14 16 24 4 38 6 C44 7 47 10 50 10 C53 10 56 7 62 6 C76 4 86 16 80 34 C77 46 74 62 70 92 C69 98 63 98 62 92 C60 78 57 66 50 66 C43 66 40 78 38 92 C37 98 31 98 30 92 C26 62 23 46 20 34 Z';
const COROA = 'M20 34 C14 16 24 4 38 6 C44 7 47 10 50 10 C53 10 56 7 62 6 C76 4 86 16 80 34 C78 42 76 48 74 54 C66 57 58 58 50 58 C42 58 34 57 26 54 C24 48 22 42 20 34 Z';
const dente = (x, y, s, extra = '') => `<path d="${MOLAR}" transform="translate(${x} ${y}) scale(${s})" stroke-width="${f1(SWV / s)}" ${extra}/>`;
const coroa = (x, y, s, extra = '') => `<path d="${COROA}" transform="translate(${x} ${y}) scale(${s})" stroke-width="${f1(SWV / s)}" ${extra}/>`;

function implante(cx, top, k = 1, c, { osso = true, gengiva = true } = {}) {
  const T = (y) => top + y * k, X = (x) => cx + x * k;
  let s = '';
  s += `<path d="M${X(-22)} ${T(24)} C${X(-24)} ${T(4)} ${X(-12)} ${T(0)} ${X(0)} ${T(0)} C${X(12)} ${T(0)} ${X(24)} ${T(4)} ${X(22)} ${T(24)} C${X(20)} ${T(34)} ${X(12)} ${T(38)} ${X(0)} ${T(38)} C${X(-12)} ${T(38)} ${X(-20)} ${T(34)} ${X(-22)} ${T(24)} Z"/>`;
  s += `<path d="M${X(-8)} ${T(38)} L${X(-9)} ${T(50)} L${X(9)} ${T(50)} L${X(8)} ${T(38)}"/>`;
  s += `<path d="M${X(-12)} ${T(50)} L${X(-7)} ${T(112)} Q${X(0)} ${T(118)} ${X(7)} ${T(112)} L${X(12)} ${T(50)} Z"/>`;
  for (let y = 58; y <= 104; y += 8) { const w = 12 - 5 * (y - 50) / 62; s += `<path d="M${X(-w - 3)} ${T(y + 2)} L${X(w + 3)} ${T(y - 2)}"/>`; }
  if (gengiva) s += `<path stroke="${c.a}" d="M${X(-62)} ${T(52)} C${X(-44)} ${T(46)} ${X(-30)} ${T(40)} ${X(-16)} ${T(44)} M${X(16)} ${T(44)} C${X(30)} ${T(40)} ${X(44)} ${T(46)} ${X(62)} ${T(52)}"/>`;
  if (osso) {
    s += `<path d="M${X(-62)} ${T(66)} C${X(-40)} ${T(62)} ${X(-26)} ${T(60)} ${X(-16)} ${T(62)} M${X(16)} ${T(62)} C${X(26)} ${T(60)} ${X(40)} ${T(62)} ${X(62)} ${T(66)}" stroke-dasharray="2 5"/>`;
    [[-44, 82], [-30, 96], [-48, 108], [-24, 120], [34, 84], [46, 100], [28, 112], [52, 120], [-38, 128], [40, 130]].forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${T(y)}" r="${f1(1.3 * k)}" fill="${c.l}" stroke="none"/>`; });
  }
  return s;
}

const IL = {
  // 02 — saúde bucal e saúde geral: dente no centro de uma constelação
  saude: (c) => `${dente(62, 52, .76)}
    <circle cx="100" cy="88" r="70" stroke-dasharray="1.5 6"/>
    <circle cx="100" cy="88" r="88" stroke="${c.a}" opacity=".55"/>
    ${[[30, 70], [170, 64], [52, 150], [156, 146], [100, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c.bg}" stroke="${c.a}"/>`).join('')}
    <path d="M100 0 L100 18 M30 70 L44 76 M170 64 L156 72 M52 150 L66 138 M156 146 L142 134" stroke="${c.a}"/>`,
  // 03 — reabilitação: três dentes, o do meio sendo reconstruído (tracejado)
  reabilitacao: (c) => `${dente(8, 52, .62)}${dente(130, 52, .62)}
    ${dente(69, 46, .62, `stroke="${c.a}" stroke-dasharray="3 5"`)}
    <path d="M10 118 C50 106 150 106 190 118" stroke="${c.a}"/>
    <path d="M100 22 A70 70 0 0 1 166 46" stroke="${c.a}" opacity=".7"/><path d="M160 38 L166 46 L157 49" stroke="${c.a}" opacity=".7"/>
    <path d="M100 22 A70 70 0 0 0 34 46" stroke-dasharray="1.5 6"/>`,
  // 05 — siso: dente vertical e siso inclinado sob a linha da gengiva
  siso: (c) => `${dente(26, 34, .78)}
    <g transform="rotate(-38 140 120)">${dente(100, 82, .7)}</g>
    <path d="M6 66 C40 58 60 58 90 66 C110 72 150 76 196 70" stroke="${c.a}"/>
    <path d="M14 82 C50 76 150 92 190 88" stroke-dasharray="2 6"/>
    <circle cx="150" cy="120" r="46" stroke="${c.a}" stroke-dasharray="1.5 5" opacity=".7"/>`,
  // 06 — gengiva que sangra: dente com gengiva em onda e uma gota
  gengiva: (c) => `${dente(46, 24, 1.08)}
    <path d="M8 96 C30 92 40 78 60 80 C76 82 84 96 100 96 C116 96 124 82 140 80 C160 78 170 92 192 96" stroke="${c.a}"/>
    <path d="M8 108 C30 104 40 92 60 94 C76 96 84 108 100 108 C116 108 124 94 140 94 C160 92 170 104 192 108" stroke="${c.a}" opacity=".5"/>
    <path d="M100 118 C96 128 92 134 92 140 A8 8 0 0 0 108 140 C108 134 104 128 100 118 Z" stroke="${c.a}" fill="${c.f}"/>`,
  // 08 — implante: corte com coroa, conexão, rosca e osso
  implante: (c) => implante(100, 26, 1.12, c),
  // 09 — mitos: lupa sobre um dente, aspas
  mitos: (c) => `${dente(46, 50, .7)}
    <circle cx="81" cy="82" r="50"/><path d="M117 118 L162 163" stroke-width="2.4"/><path d="M152 153 L172 173" stroke="${c.a}" stroke-width="5"/>
    <path d="M150 28 C140 30 136 38 138 48 M168 28 C158 30 154 38 156 48" stroke="${c.a}"/><circle cx="140" cy="48" r="3" fill="${c.a}" stroke="none"/><circle cx="158" cy="48" r="3" fill="${c.a}" stroke="none"/>`,
  // 10 — pós-extração: dente erguido, alvéolo tracejado e coágulo protegido
  extracao: (c) => `${dente(52, 6, .96)}
    <path d="M100 104 L100 124 M94 118 L100 124 L106 118" stroke="${c.a}" opacity=".0"/>
    <path d="M8 138 C36 132 52 132 64 136 C70 146 74 168 84 172 C92 175 108 175 116 172 C126 168 130 146 136 136 C148 132 164 132 192 138" stroke="${c.a}"/>
    <path d="M78 160 C90 166 110 166 122 160" stroke-dasharray="2 5"/>
`,
  // 11 — limpeza interdental: dois dentes e o fio passando entre eles
  interdental: (c) => `${dente(12, 40, .82)}${dente(106, 40, .82)}
    <path d="M18 18 C60 30 86 70 100 92 C114 70 140 30 182 18" stroke="${c.a}"/>
    <circle cx="100" cy="92" r="4" fill="${c.a}" stroke="none"/>
    <path d="M10 112 C50 104 150 104 190 112" stroke-dasharray="2 6"/>`,
  // 12 — cárie: dente com mancha que evolui (três estágios em pontos)
  carie: (c) => `${dente(40, 24, 1.2)}
    <circle cx="112" cy="54" r="10" fill="${c.f}" stroke="${c.a}"/><circle cx="112" cy="54" r="3" fill="${c.a}" stroke="none"/>
    ${[[160, 158, 3], [174, 158, 5], [190, 158, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" stroke="${c.a}"/>`).join('')}`,
  // 14 — tipos de prótese: meia arcada com ponte
  protese: (c) => `${coroa(18, 52, .5)}${coroa(75, 52, .5)}${coroa(132, 52, .5)}
    <path d="M44 82 L82 82 M118 82 L156 82" stroke="${c.a}" stroke-width="3"/>
    <path d="M31 80 L34 118 Q43 124 52 118 L55 80" /><path d="M145 80 L148 118 Q157 124 166 118 L169 80"/>
    <path d="M6 96 C40 90 70 92 100 98 C130 92 160 90 194 96" stroke="${c.a}"/>
    <path d="M6 108 C40 102 70 104 100 110 C130 104 160 102 194 108" stroke-dasharray="2 6"/>
    <path d="M30 40 C70 18 130 18 170 40" stroke="${c.a}" stroke-dasharray="1.5 6" opacity=".8"/>
    <circle cx="100" cy="150" r="3" fill="${c.a}" stroke="none"/><circle cx="84" cy="150" r="3" stroke="${c.a}"/><circle cx="116" cy="150" r="3" stroke="${c.a}"/>`,
  // 15 — dúvidas sobre implante: implante e balão de pergunta
  faqImplante: (c) => `${implante(76, 40, .96, c, { osso: true, gengiva: true })}
    <path d="M128 18 L186 18 Q194 18 194 26 L194 64 Q194 72 186 72 L152 72 L140 86 L142 72 L136 72 Q128 72 128 64 L128 26 Q128 18 136 18 Z" stroke="${c.a}"/>
    <path d="M152 36 C152 28 170 26 170 36 C170 44 161 44 161 52" stroke="${c.a}"/><circle cx="161" cy="60" r="1.8" fill="${c.a}" stroke="none"/>`,
  // 17 — escovação: escova a 45° junto ao dente
  escova: (c) => `${dente(26, 40, 1)}
    <g transform="rotate(-45 132 72)"><rect x="118" y="20" width="26" height="150" rx="13"/><path d="M122 28 L122 12 M128 28 L128 8 M134 28 L134 8 M140 28 L140 12" stroke="${c.a}"/><path d="M124 100 L138 100" opacity=".6"/></g>
    <path d="M14 112 C50 104 150 104 190 112" stroke-dasharray="2 6"/>`,
  // 18 — perder um dente: espaço vazio e osso que se remodela
  perda: (c) => `${dente(4, 40, .62)}${dente(134, 40, .62)}
    ${dente(69, 40, .62, `stroke-dasharray="2 6" opacity=".55"`)}
    <path d="M6 118 C40 114 60 116 72 120 C84 134 116 134 128 120 C140 116 160 114 194 118" stroke="${c.a}"/>
    <path d="M6 132 C40 128 60 130 72 134 C84 148 116 148 128 134 C140 130 160 128 194 132" stroke="${c.a}" opacity=".45"/>
    <path d="M100 150 L100 168 M94 162 L100 168 L106 162" stroke="${c.a}"/>`,
  // 20 — antes da cirurgia: prancheta com checklist e cápsula
  cirurgia: (c) => `<rect x="44" y="28" width="96" height="136" rx="6"/><rect x="72" y="20" width="40" height="16" rx="4" fill="${c.bg}"/>
    ${[62, 92, 122].map((y) => `<rect x="58" y="${y}" width="14" height="14" rx="2"/><path d="M61 ${y + 7} L65 ${y + 11} L71 ${y + 2}" stroke="${c.a}"/><path d="M82 ${y + 4} L126 ${y + 4} M82 ${y + 11} L112 ${y + 11}" opacity=".7"/>`).join('')}
    <g transform="rotate(-35 160 150)"><rect x="140" y="138" width="44" height="22" rx="11" stroke="${c.a}"/><path d="M162 138 L162 160" stroke="${c.a}"/></g>`,
  // 21 — restaurações: dente com restauração hachurada
  restauracao: (c) => `${dente(40, 24, 1.2)}
    <path d="M78 40 C84 52 96 56 100 56 C108 56 118 50 122 40" stroke="${c.a}" fill="${c.f}"/>
    ${[84, 92, 100, 108, 116].map((x) => `<path d="M${x} 42 L${x - 6} 52" stroke="${c.a}" opacity=".7"/>`).join('')}
    <circle cx="164" cy="40" r="16" stroke-dasharray="1.5 5"/><path d="M164 30 L164 40 L171 44"/>`,
  // 22 — diabetes e gengiva: gota e dente ligados por setas em ciclo
  diabetes: (c) => `${dente(18, 60, .66)}
    <path d="M150 52 C140 70 132 80 132 92 A18 18 0 0 0 168 92 C168 80 160 70 150 52 Z" stroke="${c.a}" fill="${c.f}"/>
    <path d="M70 46 C92 20 120 20 138 40" /><path d="M130 36 L138 40 L136 31"/>
    <path d="M136 134 C114 162 84 162 66 140"/><path d="M74 146 L66 140 L66 149"/>
    <path d="M150 84 L150 100 M142 92 L158 92" stroke="${c.a}" opacity=".0"/>`,
  // 23 — gengiva ao redor do implante: implante com camadas de tecido mole
  gengivaImplante: (c) => `${implante(100, 30, 1.05, c, { osso: true, gengiva: false })}
    <path d="M28 88 C50 72 70 70 84 76 M116 76 C130 70 150 72 172 88" stroke="${c.a}"/>
    <path d="M28 80 C50 62 70 60 84 66 M116 66 C130 60 150 62 172 80" stroke="${c.a}" opacity=".6"/>
    <path d="M28 72 C50 52 70 50 84 56 M116 56 C130 50 150 52 172 72" stroke="${c.a}" opacity=".35"/>`,
  // 25 — implante mitos e verdades: implante em lupa + balança
  mitosImplante: (c) => `${implante(82, 42, .74, c, { osso: false, gengiva: false })}
    <circle cx="82" cy="92" r="62"/><path d="M126 136 L164 174" stroke-width="2.4"/><path d="M156 166 L176 186" stroke="${c.a}" stroke-width="5"/>
    <path d="M150 24 L190 24 M170 18 L170 52 M150 24 L142 42 L158 42 Z M190 24 L182 42 L198 42 Z" stroke="${c.a}"/>`,
  // 26 — açúcar: cubos de açúcar e relógio (frequência)
  acucar: (c) => {
    const cubo = (x, y, s) => `<path d="M${x} ${y} L${x + s} ${y - s / 2} L${x + 2 * s} ${y} L${x + s} ${y + s / 2} Z M${x} ${y} L${x} ${y + s} L${x + s} ${y + 1.5 * s} L${x + 2 * s} ${y + s} L${x + 2 * s} ${y} M${x + s} ${y + s / 2} L${x + s} ${y + 1.5 * s}"/>`;
    return `${cubo(26, 110, 26)}${cubo(78, 120, 26)}${cubo(52, 76, 26)}
    <circle cx="146" cy="62" r="40" stroke="${c.a}"/><path d="M146 34 L146 62 L166 74" stroke="${c.a}"/>
    ${[0, 90, 180, 270].map((a) => `<path d="M${146 + 34 * Math.sin(a * Math.PI / 180)} ${62 - 34 * Math.cos(a * Math.PI / 180)} L${146 + 38 * Math.sin(a * Math.PI / 180)} ${62 - 38 * Math.cos(a * Math.PI / 180)}" stroke="${c.a}"/>`).join('')}`;
  },
  // 27 — rotina de cuidados com o implante: implante + escova interdental
  cuidadoImplante: (c) => `${implante(80, 30, 1, c, { osso: true, gengiva: true })}
    <g transform="rotate(30 160 90)"><path d="M160 30 L160 150" /><path d="M160 30 L160 70" stroke="${c.a}"/>${[34, 42, 50, 58, 66].map((y) => `<path d="M152 ${y} L168 ${y - 4}" stroke="${c.a}"/>`).join('')}<rect x="154" y="110" width="12" height="50" rx="6"/></g>`,
  // 28 — avaliação: espelho clínico e sonda cruzados
  avaliacao: (c) => `<circle cx="64" cy="58" r="30"/><circle cx="64" cy="58" r="24" stroke="${c.a}" opacity=".6"/><path d="M84 80 L170 172" stroke-width="2.2"/>
    <path d="M140 30 C150 28 156 36 150 44 L60 172" stroke-width="2.2"/>
    ${dente(118, 104, .5, `stroke="${c.a}"`)}`,
  // 29 — prótese removível: copo com água e prótese parcial
  removivel: (c) => `<path d="M40 150 C24 70 56 26 100 26 C144 26 176 70 160 150" />
    <path d="M62 150 C52 90 72 52 100 52 C128 52 148 90 138 150" />
    <path d="M40 150 L62 150 M138 150 L160 150"/>
    ${[[-58, 0], [-40, 0], [-20, 0], [0, 0], [20, 0], [40, 0], [58, 0]].map(([a]) => { const r = 62, cx = 100, cy = 104; const x = cx + r * Math.sin(a * Math.PI / 180), y = cy - r * Math.cos(a * Math.PI / 180); return Math.abs(a) === 20 ? '' : `<rect x="${f1(x - 7)}" y="${f1(y - 7)}" width="14" height="14" rx="5" transform="rotate(${a} ${f1(x)} ${f1(y)})" stroke="${c.a}"/>`; }).join('')}
    <path d="M70 50 C66 44 70 38 76 40 M130 50 C134 44 130 38 124 40" stroke="${c.a}"/>
    <path d="M30 176 C50 170 70 182 100 176 C130 170 150 182 170 176" stroke-dasharray="2 6"/>
    <path d="M44 190 C64 184 84 196 114 190 C134 184 150 192 158 190" stroke-dasharray="2 6" opacity=".6"/>`,
  // 30 — cigarro: cigarro com fumaça que se dissolve
  cigarro: (c) => `<rect x="20" y="138" width="160" height="16" rx="3"/><path d="M146 138 L146 154" stroke="${c.a}"/><path d="M180 140 L186 146 L180 152" stroke="${c.a}" opacity=".6"/>
    <path d="M184 130 C170 112 196 98 180 80 C166 64 188 48 174 30" stroke-dasharray="3 5"/>
    <path d="M170 128 C158 112 178 98 166 84 C154 70 170 58 160 44" opacity=".5" stroke-dasharray="2 6"/>
    ${dente(28, 30, .7, `opacity=".9"`)}`,
  // 32 — sensibilidade: dente com raios e floco de neve
  sensibilidade: (c) => `${dente(40, 30, 1.1)}
    <path d="M30 40 L18 34 M26 58 L12 58 M30 76 L18 82 M170 40 L182 34 M174 58 L188 58 M170 76 L182 82" stroke="${c.a}"/>
    <g stroke="${c.a}" transform="translate(160 158)"><path d="M0 -20 L0 20 M-17 -10 L17 10 M-17 10 L17 -10"/><path d="M-5 -15 L0 -10 L5 -15 M-5 15 L0 10 L5 15"/></g>`,
  // 33 — bruxismo: dentes que se encontram, marcas de tensão e lua
  bruxismo: (c) => `${dente(30, 104, .62)}${dente(98, 104, .62)}
    <g transform="rotate(180 100 92)">${dente(30, 106, .62)}${dente(98, 106, .62)}</g>
    <path d="M24 98 L176 98" stroke="${c.a}" stroke-dasharray="2 4"/>
    <path d="M16 84 L6 78 M16 112 L6 118 M184 84 L194 78 M184 112 L194 118" stroke="${c.a}"/>
    <path d="M170 6 A16 16 0 1 0 188 28 A13 13 0 0 1 170 6 Z" stroke="${c.a}" fill="${c.f}"/>`,
  // 34 — autoexame: espelho de mão com perfil do lábio
  autoexame: (c) => `<circle cx="100" cy="76" r="62"/><circle cx="100" cy="76" r="54" stroke="${c.a}" opacity=".5"/><path d="M100 138 L100 190 M92 190 L108 190"/>
    <path d="M66 78 C78 66 92 66 100 72 C108 66 122 66 134 78 C122 94 78 94 66 78 Z" stroke="${c.a}"/>
    <path d="M70 78 C86 82 114 82 130 78" stroke="${c.a}" opacity=".6"/>`,
  // 35 — primeira consulta: cadeira odontológica e refletor
  consulta: (c) => `<path d="M44 112 C40 92 50 84 64 92 L110 120 L166 120 Q178 120 178 132 L178 136 L104 136 Q96 136 90 132 L50 120 Q44 118 44 112 Z"/>
    <path d="M118 136 L118 168 M90 172 L146 172"/>
    <path d="M40 92 C34 86 34 78 40 74" />
    <path d="M150 14 L150 40 C150 48 140 52 132 52" /><path d="M114 52 L150 52 Q156 52 156 58 Q156 66 132 66 Q108 66 108 58 Q108 52 114 52 Z" stroke="${c.a}"/>
    <path d="M118 72 L112 84 M132 72 L132 86 M146 72 L152 84" stroke="${c.a}" opacity=".55" stroke-dasharray="2 4"/>`,
};

// Mapa: publicação → ilustração da capa
const POR_POST = { 2: 'saude', 3: 'reabilitacao', 5: 'siso', 6: 'gengiva', 8: 'implante', 9: 'mitos', 10: 'extracao', 11: 'interdental', 12: 'carie', 14: 'protese', 15: 'faqImplante', 17: 'escova', 18: 'perda', 20: 'cirurgia', 21: 'restauracao', 22: 'diabetes', 23: 'gengivaImplante', 25: 'mitosImplante', 26: 'acucar', 27: 'cuidadoImplante', 28: 'avaliacao', 29: 'removivel', 30: 'cigarro', 32: 'sensibilidade', 33: 'bruxismo', 34: 'autoexame', 35: 'consulta' };

function ilustracao(nome, size, c, sw = 1.25) {
  SWV = sw;
  return `<svg viewBox="-6 -6 212 212" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${c.l}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${IL[nome](c)}</g></svg>`;
}

module.exports = { IL, POR_POST, ilustracao };
