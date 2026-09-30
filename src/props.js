// props.js: the things in Farda videos, drawn flat and hand-painted like the characters. Each is centred on (x, y)
// with a size s in px (roughly its width), so it can sit in a scene or in a hand hook.
//   laptop(x, y, s, { screen: 'off' | 'logo' | 'video' | 'search' | 'sim' | 'project' | 'code', glowK, progress, run })   phone(x, y, s, { notify })
//   earbuds(x, y, s)   headphones(x, y, s)   watch(x, y, s)   books(x, y, s)   notebook(x, y, s)   bottle(x, y, s)
//   backpack(x, y, s)   puzzlePiece(x, y, s, { rot, col, lit })   seatCard(x, y, s, seats)   knowledgeMap(x, y, s, filled)
//   springSim(x, y, s, weights)   examPaper(x, y, s, { mark })   starBadge(x, y, s)   bubble(x, y, s, { reply })
//   fardaMark(x, y, size, col): the institute's name, lettered.
const PROP = { dark: '#2B2F45', darker: '#1E2133', metal: '#B9BDC8', screen: '#16203F', glow: '#3CCFE6', paper: '#FBF7EE', math: '#3D63D6', physics: '#3FA89E', ai: '#7B5CA8', code: '#E5A63A' };

function fardaMark(x, y, size, col = PAL.brand) { letter('فردا', x, y, size, col, { ink: false, weight: 900 }); }

function laptop(x, y, s, o = {}) {
  boilSeed('laptop ' + (o.key || 0));
  const w = s, h = s * .62, P = pts => pts.map(([a, b]) => [x + a * w, y + b * w]), sw = clamp(s / 200, .5, 1.3), mode = o.screen || 'logo';
  if (mode !== 'off') glow(x, y - h * .35, w * .75, mode === 'video' ? '#9FB4E0' : '#7FE6F5', .45 * (o.glowK ?? 1));
  paint(rrPts(x - w / 2, y - h * .92, w, h * .88, w * .03), { wash: PROP.dark, ink: PAL.ink, sw });   // lid
  const sx = x - w * .45, sy = y - h * .86, swd = w * .9, sh = h * .74;
  paint(rectPts(sx, sy, swd, sh), { wash: mode === 'off' ? PROP.darker : mode === 'video' ? '#DDE3EE' : PROP.screen, ink: null });
  if (mode === 'logo') { glow(x, sy + sh / 2, w * .3, '#7FE6F5', .7); fardaMark(x, sy + sh / 2, w * .14, '#9FEAF6'); }
  if (mode === 'video') {   // a long, long lecture: a whiteboard of scribbles and a progress bar that never ends
    for (let i = 0; i < 5; i++) inkLine([[sx + swd * .1, sy + sh * (.18 + i * .13)], [sx + swd * (.35 + .4 * hash(i)), sy + sh * (.2 + i * .13)]], sw * .6, '#5A6480', 'inkfine', .5);
    paint(rectPts(sx + swd * .06, sy + sh * .86, swd * .88, sh * .04), { wash: '#9AA3B8', ink: null });
    paint(rectPts(sx + swd * .06, sy + sh * .86, swd * .09, sh * .04), { wash: '#D8394E', ink: null });
  }
  if (mode === 'search') {
    paint(rrPts(sx + swd * .12, sy + sh * .14, swd * .76, sh * .14, sh * .07), { wash: '#EEF3FA', ink: PROP.glow, sw: sw * .6 });
    for (let i = 0; i < 3; i++) paint(rrPts(sx + swd * .12, sy + sh * (.38 + i * .19), swd * .76, sh * .14, sh * .03), { wash: i === 1 ? '#1F4C7A' : '#394260', ink: i === 1 ? PROP.glow : null, sw: sw * .6 });
    glow(x, sy + sh * .64, w * .25, '#7FE6F5', .6);
  }
  if (mode === 'sim') springSim(x, sy + sh * .52, sh * .8, [1, 2]);
  if (mode === 'code') {   // code writing itself, line by line, and a green tick when it runs (o.run 0..1)
    const lines = Math.floor(clamp(o.progress ?? 1) * 7);
    for (let i = 0; i < lines; i++) {
      const ind = [0, 1, 2, 2, 1, 2, 0][i], w1 = .12 + .2 * hash(i + 3), w2 = .1 + .25 * hash(i + 8);
      paint(rrPts(sx + swd * (.08 + ind * .06), sy + sh * (.1 + i * .11), swd * w1, sh * .06, sh * .02), { wash: [PAL.nebula, PROP.glow, PROP.code][i % 3], ink: null });
      paint(rrPts(sx + swd * (.1 + ind * .06 + w1), sy + sh * (.1 + i * .11), swd * w2, sh * .06, sh * .02), { wash: '#6E7AA0', ink: null });
    }
    if (o.run > 0) { glow(x + w * .3, sy + sh * .7, w * .15, '#9FE8B0', o.run); paint(ribbon([[x + w * .24, sy + sh * .7], [x + w * .29, sy + sh * .78], [x + w * .38, sy + sh * .6]], w * .025, w * .025), { wash: '#7CC98C', ink: null }); }
  }
  if (mode === 'project') {   // something Arman made: a little painted rocket on a starry screen
    for (let i = 0; i < 8; i++) paint(starPts(sx + swd * hash(i + 4), sy + sh * hash(i + 9), w * .008, .4, 4), { wash: PAL.cream, ink: null });
    paint(rrPts(x - w * .12, sy + sh * .4, w * .24, sh * .22, sh * .1), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
    paint([[x - w * .12, sy + sh * .4], [x - w * .2, sy + sh * .51], [x - w * .12, sy + sh * .62]], { wash: PAL.nebula, ink: PAL.ink, sw: sw * .6 });
    glow(x + w * .15, sy + sh * .51, w * .06, '#FFB45E', .8);
  }
  paint(P([[-.56, -.04], [.56, -.04], [.62, .03], [-.62, .03]]), { wash: PROP.metal, ink: PAL.ink, sw, curv: .1 });   // the base
  inkLine([[x - w * .08, y - w * .005], [x + w * .08, y - w * .005]], sw * .5, PAL.ink, 'inkfine', 0);
}

function phone(x, y, s, o = {}) {
  boilSeed('phone ' + (o.key || 0));
  const w = s * .5, h = s, sw = clamp(s / 120, .5, 1.2);
  paint(rrPts(x - w / 2, y - h / 2, w, h, w * .16), { wash: PROP.darker, ink: PAL.ink, sw });
  paint(rrPts(x - w * .42, y - h * .44, w * .84, h * .88, w * .1), { wash: PROP.screen, ink: null });
  paint(rrPts(x - w * .15, y - h * .46, w * .3, h * .03, h * .015), { wash: PAL.ink, ink: null });
  if (o.notify) {   // a notification dropping in: the distraction
    const k = o.notify === true ? 1 : o.notify;
    glow(x, y - h * .28, w * .7, '#FF8FB0', .6 * k);
    paint(rrPts(x - w * .38, y - h * .36, w * .76, h * .16, h * .05), { wash: '#EEF3FA', ink: '#FF6F96', sw: sw * .6 });
    paint(ellPts(x - w * .24, y - h * .28, w * .07, w * .07, 10), { wash: '#FF6F96', ink: null });
    inkLine([[x - w * .1, y - h * .3], [x + w * .28, y - h * .3]], sw * .5, '#8A93A8', 'inkfine', 0);
  } else for (let i = 0; i < 6; i++) paint(rrPts(x - w * .3 + (i % 3) * w * .22, y - h * .15 + Math.floor(i / 3) * h * .14, w * .15, w * .15, w * .04), { wash: [PAL.brand, PROP.glow, PAL.nebula, PROP.code, PROP.physics, PAL.rose][i], ink: null });
}

function earbuds(x, y, s) {
  boilSeed('earbuds');
  const sw = clamp(s / 120, .5, 1.2);
  paint(rrPts(x - s * .35, y - s * .05, s * .7, s * .42, s * .18), { wash: '#EEF3FA', ink: PAL.ink, sw });   // the case
  inkLine([[x - s * .33, y + s * .08], [x + s * .33, y + s * .08]], sw * .5, PROP.metal, 'inkfine', 0);
  paint(ellPts(x, y + s * .24, s * .03, s * .03, 6), { wash: PROP.glow, ink: null });
  for (const d of [-1, 1]) {
    const bx = x + d * s * .18, by = y - s * .25;
    paint(ribbon([[bx, by], [bx + d * s * .02, by + s * .13]], s * .07, s * .05), { wash: '#F4F6FA', ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(bx, by - s * .02, s * .08, s * .07, 10), { wash: '#F4F6FA', ink: PAL.ink, sw: sw * .7 });
  }
}

function headphones(x, y, s) {
  boilSeed('headphones');
  const sw = clamp(s / 120, .5, 1.2), P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]);
  inkLine(P([[-.42, .1], [-.38, -.3], [0, -.46], [.38, -.3], [.42, .1]]), sw * 3, PROP.dark, 'ink', .6);
  for (const d of [-1, 1]) {
    paint(rrPts(x + (d * .42 - .14) * s, y - .02 * s, .28 * s, .4 * s, .12 * s), { wash: PROP.dark, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(x + d * .42 * s, y + .18 * s, .06 * s, .06 * s, 8), { wash: PROP.glow, ink: null });
  }
}

function watch(x, y, s) {
  boilSeed('watch');
  const sw = clamp(s / 120, .5, 1.2);
  paint(rrPts(x - s * .16, y - s * .5, s * .32, s, s * .1), { wash: PROP.dark, ink: PAL.ink, sw: sw * .7 });   // the strap
  paint(rrPts(x - s * .3, y - s * .3, s * .6, s * .6, s * .14), { wash: PROP.darker, ink: PAL.ink, sw });
  glow(x, y, s * .4, '#7FE6F5', .5);
  paint(rrPts(x - s * .23, y - s * .23, s * .46, s * .46, s * .1), { wash: PROP.screen, ink: null });
  paint(ribbon([[x - s * .12, y + s * .02], [x - s * .03, y + s * .1], [x + s * .13, y - s * .1]], s * .05, s * .05), { wash: PROP.glow, ink: null });
}

// The four subjects: math (π), physics (an atom), AI (a little network) and programming (brackets), as a stack.
function books(x, y, s) {
  const cols = [PROP.math, PROP.physics, PROP.ai, PROP.code], h = s * .18;
  cols.forEach((c, i) => {
    boilSeed('book ' + i);
    const by = y + (1.5 - i) * h, bx = x + (hash(i + 2) - .5) * s * .12, w = s * (.95 - .05 * i), sw = clamp(s / 200, .5, 1.2);
    paint(rrPts(bx - w / 2, by - h / 2, w, h, h * .15), { wash: c, ink: PAL.ink, sw });
    paint(rectPts(bx + w * .36, by - h / 2, w * .06, h), { wash: mixCol(c, PAL.ink, .3), ink: null });
    const ic = [bx - w * .22, by];
    if (i === 0) letter('π', ...ic, h * .8, PAL.cream, { ink: false, weight: 800 });
    if (i === 1) { for (const r of [0, 1.05, 2.1]) paint(ellPts(ic[0], ic[1], h * .38, h * .14, 14, 0, r), { ink: PAL.cream, sw: sw * .5 }); paint(ellPts(...ic, h * .07, h * .07, 6), { wash: PAL.cream, ink: null }); }
    if (i === 2) { const N = [[-.35, -.25], [-.35, .25], [0, 0], [.35, -.25], [.35, .25]]; for (const [a, b] of [[0, 2], [1, 2], [2, 3], [2, 4]]) inkLine([[ic[0] + N[a][0] * h, ic[1] + N[a][1] * h], [ic[0] + N[b][0] * h, ic[1] + N[b][1] * h]], sw * .5, PAL.cream, 'inkfine', 0); for (const [a, b] of N) paint(ellPts(ic[0] + a * h, ic[1] + b * h, h * .07, h * .07, 6), { wash: PAL.cream, ink: null }); }
    if (i === 3) letter('</>', ...ic, h * .62, PAL.cream, { ink: false, weight: 800, font: `800 ${h * .62}px Vazirmatn, sans-serif` });
  });
}

function notebook(x, y, s) {
  boilSeed('notebook');
  const w = s * .72, h = s, sw = clamp(s / 150, .5, 1.2);
  paint(rrPts(x - w / 2, y - h / 2, w, h, s * .04), { wash: PROP.dark, ink: PAL.ink, sw });
  for (let i = 0; i < 7; i++) paint(ellPts(x - w / 2, y - h * .4 + i * h * .13, s * .03, s * .03, 6), { wash: PROP.metal, ink: PAL.ink, sw: sw * .4 });
  paint(rectPts(x - w * .25, y - h * .2, w * .6, h * .22), { wash: PAL.cream, ink: null });
  paint(ellPts(x + w * .05, y - h * .09, s * .06, s * .06, 10), { wash: PAL.brand, ink: null });
  paint(ribbon([[x + w * .6, y + h * .3], [x + w * .8, y - h * .35]], s * .05, s * .03), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .6 });   // a pencil
}

function bottle(x, y, s) {
  boilSeed('bottle');
  const w = s * .38, h = s, sw = clamp(s / 150, .5, 1.2);
  paint(rrPts(x - w / 2, y - h * .38, w, h * .88, w * .3), { wash: '#EEF3FA', ink: PAL.ink, sw });
  paint(rrPts(x - w * .32, y - h * .5, w * .64, h * .16, w * .1), { wash: PROP.dark, ink: PAL.ink, sw: sw * .8 });
  paint(rectPts(x - w / 2 + 1, y - h * .05, w - 2, h * .14), { wash: PAL.brand, ink: null });
}

function backpack(x, y, s) {
  boilSeed('backpack');
  const w = s * .8, h = s, sw = clamp(s / 150, .5, 1.3);
  inkLine([[x - w * .2, y - h * .45], [x, y - h * .6], [x + w * .2, y - h * .45]], sw * 1.5, STU.packDk, 'ink', .5);
  paint(rrPts(x - w / 2, y - h * .48, w, h * .96, w * .2), { wash: STU.pack, ink: PAL.ink, sw });
  paint(rrPts(x - w * .36, y + h * .02, w * .72, h * .36, w * .08), { wash: STU.packDk, ink: PAL.ink, sw: sw * .7 });
  inkLine([[x - w * .3, y - h * .1], [x + w * .3, y - h * .1]], sw * 1.2, STU.glow, 'ink', 0);
  glow(x, y - h * .1, w * .35, '#7FE6F5', .35);
}

// A jigsaw piece (a knowledge fragment): grey and loose, or lit when it has found its place.
function puzzlePiece(x, y, s, o = {}) {
  const r = s / 2, k = s * .17, P = [];
  const edge = (ax, ay, bx, by, knob) => {   // a side with a round knob sticking out (knob +1) or in (-1), or flat (0)
    const mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L;
    P.push([ax, ay], [lerp(ax, bx, .38), lerp(ay, by, .38)]);
    if (knob) for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; P.push([mx + Math.cos(a) * k * dx / L + nx * knob * (k * .6 + Math.sin(a) * -k), my + Math.cos(a) * k * dy / L + ny * knob * (k * .6 + Math.sin(a) * -k)]); }
    P.push([lerp(ax, bx, .62), lerp(ay, by, .62)]);
  };
  const kn = o.knobs || [1, -1, 1, -1];
  edge(-r, -r, r, -r, kn[0]); edge(r, -r, r, r, kn[1]); edge(r, r, -r, r, kn[2]); edge(-r, r, -r, -r, kn[3]);
  push(); translate(x, y); rotate(o.rot || 0);
  if (o.lit) glow(0, 0, s * .9, '#7FE6F5', .6);
  paint(P, { wash: o.col || (o.lit ? '#8FE3F0' : '#9AA0B2'), ink: PAL.ink, sw: clamp(s / 80, .5, 1.2), curv: .2 });
  pop();
}

// A class-size card: little chairs around a table, and the size in Persian digits.
function seatCard(x, y, s, seats, label = '') {
  boilSeed('seat ' + seats);
  const w = s, h = s * 1.2, sw = clamp(s / 150, .5, 1.2);
  paint(rrPts(x - w / 2, y - h / 2, w, h, s * .08), { wash: PAL.cream, ink: PAL.ink, sw });
  paint(ellPts(x, y - h * .1, w * .2, w * .2, 20), { wash: '#C9A27A', ink: PAL.ink, sw: sw * .6 });
  for (let i = 0; i < seats; i++) { const a = -Math.PI / 2 + i / seats * TAU; paint(rrPts(x + Math.cos(a) * w * .32 - w * .06, y - h * .1 + Math.sin(a) * w * .32 - w * .06, w * .12, w * .12, w * .03), { wash: PAL.brand, ink: PAL.ink, sw: sw * .5 }); }
  if (label) letter(label, x, y + h * .34, s * .2, PAL.ink, { ink: false, weight: 800 });
}

// The knowledge map from the assessment: a honeycomb of topics, strong ones lit, gaps left empty.
function knowledgeMap(x, y, s, filled = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1]) {
  const r = s * .11;
  filled.forEach((f, i) => {
    boilSeed('cell ' + i);
    const c = i % 4, row = Math.floor(i / 4), cx = x + (c - 1.5) * r * 1.8 + (row % 2) * r * .9, cy = y + (row - 1) * r * 1.6;
    if (f) glow(cx, cy, r * 1.2, '#9FE8B0', .35);
    paint(ellPts(cx, cy, r * .95, r * .95, 6, 0, Math.PI / 6), { wash: f ? '#7CC98C' : PAL.cream, ink: f ? PAL.ink : '#D8394E', sw: f ? .6 : .8 });
    if (!f) letter('?', cx, cy, r * .9, '#D8394E', { ink: false, weight: 800 });
  });
}

// The spring and weights from Farda's free simulator: each 100 g stretches the spring 2 cm.
function springSim(x, y, s, weights = [1]) {
  boilSeed('spring');
  const top = y - s * .45, sw = clamp(s / 150, .5, 1.1), n = weights.length, stretch = s * .12 * weights.reduce((a, b) => a + b, 0);
  inkLine([[x - s * .3, top], [x + s * .3, top]], sw * 1.5, PAL.cream, 'ink', 0);
  const L = s * .35 + stretch, coil = []; for (let i = 0; i <= 24; i++) coil.push([x + (i % 2 ? 1 : -1) * s * .07 * (i > 0 && i < 24), top + L * i / 24]);
  inkLine(coil, sw, PROP.glow, 'ink', 0);
  for (let i = 0; i < n; i++) paint(rrPts(x - s * .09, top + L + i * s * .13, s * .18, s * .12, s * .03), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .6 });
  for (let i = 0; i < 4; i++) inkLine([[x + s * .22, top + s * .35 + i * s * .12], [x + s * .28, top + s * .35 + i * s * .12]], sw * .5, PAL.cream, 'inkfine', 0);   // the ruler
}

// An exam paper; mark: 'good' (a check and a gold star), 'bad' (a red circle), or none.
function examPaper(x, y, s, o = {}) {
  boilSeed('exam');
  const w = s * .74, h = s, sw = clamp(s / 150, .5, 1.2);
  paint(rectPts(x - w / 2, y - h / 2, w, h, 1), { wash: PROP.paper, ink: PAL.ink, sw });
  for (let i = 0; i < 6; i++) inkLine([[x - w * .38, y - h * .3 + i * h * .12], [x + w * (.1 + .25 * hash(i + 1)), y - h * .3 + i * h * .12]], sw * .5, '#9AA3B8', 'inkfine', 0);
  if (o.mark === 'good') {
    inkLine([[x + w * .1, y + h * .3], [x + w * .2, y + h * .4], [x + w * .38, y + h * .18]], sw * 2, '#3FA05A', 'ink', 0);
    starBadge(x + w * .32, y - h * .38, s * .3);
  }
  if (o.mark === 'bad') paint(ellPts(x + w * .25, y - h * .35, w * .18, w * .14, 16), { ink: '#D8394E', sw: sw * 1.4 });
}

// The "creative solution" star (a point for a creative answer, as on the teacher's panel).
function starBadge(x, y, s) {
  boilSeed('star badge');
  glow(x, y, s * .8, '#FFD27A', .7);
  paint(starPts(x, y, s * .5, .5, 5), { wash: '#F0BE46', ink: PAL.ink, sw: clamp(s / 60, .5, 1.2) });
  paint(starPts(x - s * .08, y - s * .08, s * .16, .5, 5), { wash: '#FFE9A8', ink: null });
}

// A chat bubble to the teacher between sessions (reply: the answer coming back).
function bubble(x, y, s, o = {}) {
  boilSeed('bubble ' + (o.reply ? 1 : 0));
  const w = s, h = s * .6, sw = clamp(s / 120, .5, 1.2), d = o.reply ? -1 : 1;
  const fillC = o.reply ? '#DDF6F0' : '#EEF3FA';
  paint([[x + d * w * .12, y + h * .4], [x + d * w * .45, y + h * .78], [x + d * w * .34, y + h * .4]], { wash: fillC, ink: PAL.ink, sw });   // the tail, under the bubble
  paint(rrPts(x - w / 2, y - h / 2, w, h, h * .35), { wash: fillC, ink: PAL.ink, sw });
  for (let i = 0; i < 2; i++) inkLine([[x - w * .3, y - h * .12 + i * h * .25], [x + w * (.1 + .15 * i), y - h * .12 + i * h * .25]], sw * .6, '#8A93A8', 'inkfine', 0);
}

// The props sheet: studio.html?loop=props
(() => {
  const label = (txt, x, y, size = 21) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .85, weight: 600 });
  LOOPS.props = t => {
    label('وسایل', 960, 38, 32);
    const cells = [
      ['لپ‌تاپ (صفحه‌ی فردا)', (x, y) => laptop(x, y + 55, 250, { screen: 'logo', key: 1 })],
      ['لپ‌تاپ (ویدیوی آفلاین)', (x, y) => laptop(x, y + 55, 250, { screen: 'video', key: 2 })],
      ['لپ‌تاپ (جست‌وجو)', (x, y) => laptop(x, y + 55, 250, { screen: 'search', key: 3 })],
      ['موبایل و نوتیفیکیشن', (x, y) => { phone(x - 55, y, 150, { notify: .7 + .3 * Math.sin(t * 6), key: 1 }); phone(x + 55, y, 150, { key: 2 }); }],
      ['هندزفری و هدفون', (x, y) => { earbuds(x - 70, y + 10, 110); headphones(x + 70, y, 120); }],
      ['ساعت هوشمند', (x, y) => watch(x, y, 130)],
      ['کتاب‌ها: ریاضی · فیزیک · هوش مصنوعی · برنامه‌نویسی', (x, y) => books(x, y, 230)],
      ['دفتر، مداد، بطری آب', (x, y) => { notebook(x - 50, y, 150); bottle(x + 90, y + 5, 140); }],
      ['کوله‌پشتی', (x, y) => backpack(x, y, 170)],
      ['پازل ذهن (پراکنده و سر جا)', (x, y) => { puzzlePiece(x - 90, y - 20, 70, { rot: -.4 + .1 * Math.sin(t) }); puzzlePiece(x - 20, y + 30, 60, { rot: .5, knobs: [-1, 1, -1, 1] }); for (let i = 0; i < 4; i++) puzzlePiece(x + 60 + (i % 2) * 58, y - 35 + Math.floor(i / 2) * 58, 58, { lit: true, knobs: [[0, 1, -1, 0], [0, 0, 1, -1], [1, -1, 0, 0], [-1, 0, 0, 1]][i] }); }],
      ['کارت‌های اندازه‌ی کلاس', (x, y) => { seatCard(x + 105, y, 90, 1, '۱ نفر'); seatCard(x, y, 90, 3, '۲ تا ۳'); seatCard(x - 105, y, 90, 6, '۴ تا ۶'); }],
      ['نقشه‌ی دانسته‌ها (ارزیابی)', (x, y) => knowledgeMap(x, y, 230)],
      ['شبیه‌ساز فنر و وزنه', (x, y) => { paint(rrPts(x - 110, y - 95, 220, 190, 18), { wash: PROP.screen, ink: PAL.ink, sw: .8 }); springSim(x, y, 170, [1, 1 + (t % 2 > 1 ? 1 : 0)]); }],
      ['برگه‌ی امتحان', (x, y) => { examPaper(x - 55, y, 150, { mark: 'bad' }); examPaper(x + 60, y, 150, { mark: 'good' }); }],
      ['پیام به مدرس و جواب', (x, y) => { bubble(x - 30, y - 30, 150); bubble(x + 40, y + 55, 130, { reply: true }); }],
    ];
    cells.forEach(([fa, f], i) => {
      const c = i % 5, r = Math.floor(i / 5), x = 1740 - c * 375, y = 220 + r * 320;
      f(x, y); label(fa, x, y + 135);
    });
  };
  LOOPS.props.len = 4;
})();
