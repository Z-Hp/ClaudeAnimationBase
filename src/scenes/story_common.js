// story_common.js: the sets and helpers shared by the story video «از امروز به فردا بیایید» (STORYBOARD_STORY.md).
// The acts are in story_1_today.js … story_4_future.js; they only call what's here, the cast (people.js) and the
// props (props.js).

// Set palettes. night: the cold room of "today"; lamp: the same room, warm, once Farda is in his life; morning: the
// last shot; grey: the crowded class; farda: the institute (the website's cosmic colours, in daylight).
const SETS = {
  night:   { wall: '#27304F', wallDk: '#1E2640', desk: '#4E4048', deskDk: '#3A2F37', shelf: '#34304A', light: '#A8C4F0' },
  lamp:    { wall: '#3B416B', wallDk: '#2F3459', desk: '#7A5B4A', deskDk: '#5E4436', shelf: '#4A4060', light: '#FFD9A0' },
  morning: { wall: '#C9D4EE', wallDk: '#AEBBE0', desk: '#9C7A60', deskDk: '#7E5F48', shelf: '#8C7A9E', light: '#FFE9B8' },
  grey:    { wall: '#A3A7B2', wallDk: '#8E929E', floor: '#8C909B', board: '#46514A', boardDk: '#39433D' },
  farda:   { wall: '#EEF1FA', wallDk: '#DCE2F3', floor: '#D5DBEC', table: '#C9A27A', tableDk: '#A8835E' },
};

// ---------- acting for the cast ----------
// Expression changes for person(): keys = [[t0, 'name', {over}], ...]. At each change the eyes blink shut for a
// moment and a small take fires; the head tilt eases across; the new emote pops in. Returns fields for person().
function acts(t, keys, o = {}) {
  let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const [tc, name, over] = keys[i], age = t - tc, e = expr(name, { ...(over || {}) });
  const prev = i > 0 ? expr(keys[i - 1][1], keys[i - 1][2] || {}) : e;
  e.tilt = lerp(prev.tilt || 0, e.tilt || 0, ease(seg(age, 0, .35)));
  e.lookX = lerp(prev.lookX || 0, e.lookX || 0, ease(seg(age, 0, .25))); e.lookY = lerp(prev.lookY || 0, e.lookY || 0, ease(seg(age, 0, .25)));
  if (i > 0 && age < .12 && !['closed', 'happy', 'squeeze', 'cry', 'yawn'].includes(e.eyes)) e.eyes = 'closed';
  const tk = i > 0 ? take(t, tc, o.take ?? .45) : { sq: 0, dy: 0 };
  e.sq = (e.sq || 0) + tk.sq * .5; e.dy = (e.dy || 0) + tk.dy * .35;
  e.emoteK = prev.emote === e.emote && i > 0 ? 1 : seg(age, .05, .3); e.emoteAge = age;
  return e;
}
// Talking: the mouth opens and closes while t is inside [t0, t1].
const talk = (t, t0, t1, rest = 'smile') => t > t0 && t < t1 ? (Math.floor((t - t0) * 7) % 3 === 1 ? 'o' : Math.floor((t - t0) * 7) % 3 === 2 ? 'grin' : rest) : rest;

// A person sitting behind a table or desk whose top is at y: the ground point that puts the elbows on the top.
function seatAt(who, y, u) { const B = bodyOf(LOOKS[who]); return y - (B.shoulder + 1.75 * B.armK) * u; }

// ---------- rooms ----------
// Arman's room: a wall, a window (night stars, or a sunrise in the morning), a bookshelf. mode: night | lamp | morning.
function room(t, mode, o = {}) {
  const S = SETS[mode];
  boilSeed('room wall ' + mode);
  paint(rectPts(-400, -300, W + 800, H + 600), { wash: S.wall, ink: null });
  paint(rectPts(-400, 760, W + 800, 500), { wash: S.wallDk, ink: null });
  // the window
  const wx = o.winX ?? 230, wy = 150, ww = 430, wh = 400;
  boilSeed('room window');
  if (mode === 'morning') {
    paint(rectPts(wx, wy, ww, wh), { wash: '#F6C58E', ink: null });
    paint(rectPts(wx, wy, ww, wh * .45), { wash: '#9FC0EE', ink: null });
    glow(wx + ww * .6, wy + wh * .7, 260, '#FFD27A', .8);
    paint(ellPts(wx + ww * .6, wy + wh * .72, 70, 70, 24), { wash: '#FFE3A3', ink: null });
  } else {
    paint(rectPts(wx, wy, ww, wh), { wash: '#141B36', ink: null });
    for (let i = 0; i < 16; i++) { boilSeed('wstar ' + i); const tw = .6 + .4 * Math.sin(t * (2 + hash(i)) + i); paint(starPts(wx + 20 + hash(i + 1) * (ww - 40), wy + 20 + hash(i + 7) * (wh - 40), (2 + 3 * hash(i + 3)) * tw, .35, 4), { wash: PAL.cream, washOp: 200, ink: null }); }
    boilSeed('room moon'); paint(ellPts(wx + ww * .75, wy + wh * .25, 34, 34, 20), { wash: PAL.cream, ink: null });
  }
  boilSeed('room frame');
  for (const [a, b] of [[[wx, wy], [wx + ww, wy]], [[wx, wy + wh], [wx + ww, wy + wh]], [[wx, wy], [wx, wy + wh]], [[wx + ww, wy], [wx + ww, wy + wh]], [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], [[wx, wy + wh / 2], [wx + ww, wy + wh / 2]]])
    inkLine([a, b], 2.2, mixCol(S.shelf, PAL.ink, .3), 'ink', 0);
  paint(rectPts(wx - 30, wy + wh, ww + 60, 26), { wash: S.shelf, ink: PAL.ink, sw: .8 });
  // the bookshelf
  const bx = o.shelfX ?? 1480;
  boilSeed('room shelf');
  paint(rectPts(bx, 170, 330, 560), { wash: S.shelf, ink: PAL.ink, sw: .9 });
  for (let r = 0; r < 4; r++) {
    inkLine([[bx + 10, 170 + (r + 1) * 135], [bx + 320, 170 + (r + 1) * 135]], 1.2, PAL.ink, 'ink', 0);
    for (let i = 0; i < 7; i++) {
      boilSeed(`shelf book ${r} ${i}`);
      const h = 70 + 45 * hash(r * 7 + i), w = 26 + 12 * hash(i + r), x = bx + 20 + i * 42, c = [PROP.math, PROP.physics, PROP.ai, PROP.code, PAL.rose, PAL.sky, PAL.ochre][(r * 3 + i) % 7];
      paint(rectPts(x, 170 + (r + 1) * 135 - h, w, h), { wash: mode === 'night' ? mixCol(c, S.wall, .6) : mixCol(c, S.wall, .15), ink: PAL.ink, sw: .5 });
    }
  }
  if (mode === 'lamp') { boilSeed('room lamp glow'); glow(o.lampX ?? 560, 640, 520, '#FFD9A0', .45); }
}
// The desk: its top at y, across the frame, in front of whoever sits at it.
function desk(y, mode, o = {}) {
  const S = SETS[mode] || SETS.night;
  boilSeed('desk ' + y);
  paint(rectPts(-300, y, W + 600, H - y + 400), { wash: S.deskDk, ink: null });
  paint(rectPts(-300, y - 12, W + 600, 34), { wash: S.desk, ink: null });
  inkLine([[-50, y - 12], [W / 2, y - 14], [W + 50, y - 12]], 1.1, PAL.ink, 'ink', .5);
  inkLine([[-50, y + 22], [W / 2, y + 20], [W + 50, y + 23]], .8, PAL.ink, 'ink', .5);
  if (mode === 'lamp' || o.lamp) {   // a desk lamp, lit
    const lx = o.lampX ?? 560;
    boilSeed('desk lamp');
    inkLine([[lx - 40, y - 12], [lx - 10, y - 150], [lx + 60, y - 210]], 3, '#3A3040', 'ink', .3);
    paint([[lx + 20, y - 250], [lx + 130, y - 205], [lx + 90, y - 165]], { wash: PAL.ochre, ink: PAL.ink, sw: .8 });
    glow(lx + 110, y - 170, 220, '#FFD9A0', .8);
    paint(ellPts(lx - 40, y - 8, 55, 12, 16), { wash: '#3A3040', ink: PAL.ink, sw: .7 });
  }
}
// A laptop seen from behind on a desk whose top is y: the lid, a small glowing mark, and its light on the viewer.
function laptopBack(x, y, s, col = '#A8C4F0', k = 1) {
  boilSeed('laptop back ' + x);
  glow(x - s * .1, y - s * .95, s * 1.1, col, .55 * k);
  paint([[x - s / 2, y - 6], [x + s / 2, y - 6], [x + s * .47, y - s * .6], [x - s * .47, y - s * .6]], { wash: '#3A3F52', ink: PAL.ink, sw: 1, curv: .08 });
  paint(ellPts(x, y - s * .32, s * .045, s * .045, 10), { wash: mixCol(col, PAL.cream, .4), ink: null });
  paint(rectPts(x - s * .55, y - 10, s * 1.1, 14), { wash: '#8C90A0', ink: PAL.ink, sw: .7 });
}

// The crowded classroom of "today", seen from the back of the room: a blackboard, the teacher, rows of a grey crowd.
// scrib: how much of the board is covered (0..1); simple: the board shows the too-easy sum instead.
function greyClass(t, o = {}) {
  const S = SETS.grey;
  boilSeed('grey wall');
  paint(rectPts(-400, -300, W + 800, H + 600), { wash: S.wall, ink: null });
  paint(rectPts(-400, 470, W + 800, 900), { wash: S.floor, ink: null });
  inkLine([[-100, 470], [W / 2, 468], [W + 100, 471]], .9, mixCol(S.wall, PAL.ink, .4), 'ink', .5);
  boilSeed('grey board');
  paint(rectPts(520, 110, 880, 300), { wash: S.board, ink: '#6E5A48', sw: 2 });
  paint(rectPts(520, 405, 880, 16), { wash: '#8A7560', ink: null });
  if (o.simple) letter('۲ + ۲ = ۴', 960, 250, 110, '#EDEBE2', { ink: false, weight: 400, alpha: .9 });
  else {
    const n = Math.floor(clamp(o.scrib ?? 0) * 26);
    for (let i = 0; i < n; i++) {   // lines of chalk scribble, one after another, too fast to follow
      boilSeed('chalk ' + i);
      const r = i % 6, c = Math.floor(i / 6), x0 = 560 + c * 205, y0 = 150 + r * 42, P = [];
      for (let k = 0; k < 7; k++) P.push([x0 + k * 24, y0 + Math.sin(k * 2.1 + i) * 9 + (hash(i * 7 + k) - .5) * 10]);
      inkLine(P, .8, '#E4E2D8', 'inkfine', .6);
      if (hash(i + 50) > .6) inkLine([[x0 + 60, y0 - 12], [x0 + 64, y0 + 14]], .7, '#E4E2D8', 'inkfine', 0);
    }
  }
  // the teacher at the board, writing, with his back to the room
  const w = o.writing ?? 1, aR = 2.0 + .25 * Math.sin(t * 9) * w;
  person(o.teacherX ?? 1180, 470, 11.5, { who: 'oldTeacher', view: o.teacherFaces ? 'front' : 'back', aR: o.teacherFaces ? .15 : aR, bR: .5, boilKey: 'old teacher', ...(o.teacherFace || {}) });
}
// The grey crowd in rows, from behind; each row sits on a bench. skip(r, c): leave a seat free (for Arman).
// inRow(r): draw something into row r (after its people, before its desks), e.g. Arman in his seat.
function greyCrowd(t, rows = 4, cols = 8, skip = () => false, inRow = () => {}) {
  for (let r = 0; r < rows; r++) {
    const y = 560 + r * 120, u = 8 + r * 2.4;
    for (let c = 0; c < cols; c++) {
      if (skip(r, c)) continue;
      const x = 120 + c * (1680 / (cols - 1)) + (r % 2) * 60 + (hash(r * 11 + c) - .5) * 40, who = hash(r * 7 + c + 3) > .5 ? 'crowdA' : 'crowdB';
      crowdBack(x, y + .08 * u * Math.sin(t * 1.3 + r + c), u, LOOKS[who], `crowd ${r} ${c}`);
    }
    inRow(r, y, u);
    boilSeed('bench ' + r);
    paint(rectPts(-100, y - 4.6 * u, W + 200, 5 * u), { wash: mixCol(SETS.grey.floor, PAL.ink, .15 + r * .03), ink: PAL.ink, sw: .6 });   // the row of desks behind them
  }
}

// One of the crowd from behind, as a cheap silhouette (a hundred of these stay fast): shoulders, a head, hair.
function crowdBack(x, y, u, L, key) {
  boilSeed(key);
  const P = pts => pts.map(([a, b]) => [x + a * u, y + b * u]);
  paint(P([[-2.9, -4.2], [-2.7, -7.6], [-1.6, -8.4], [1.6, -8.4], [2.7, -7.6], [2.9, -4.2]]), { wash: L.col, ink: PAL.ink, sw: .6, curv: .3 });
  paint(ellPts(x, y - 11.3 * u, 3.1 * u, 3 * u, 16), { wash: L.hairCol, ink: PAL.ink, sw: .6 });
  if (L.hair === 'long') paint(P([[-3, -11.5], [3, -11.5], [3.2, -7.6], [-3.2, -7.6]]), { wash: L.hairCol, ink: PAL.ink, sw: .6, curv: .3 });
  else paint(P([[-1, -8.6], [1, -8.6], [.9, -8.1], [-.9, -8.1]]), { wash: L.skin, ink: null });
}

// The Farda room: light walls in the brand's colours, a big window onto the sky, a plant and a constellation poster.
function fardaRoom(t, o = {}) {
  const S = SETS.farda;
  boilSeed('farda wall');
  paint(rectPts(-400, -300, W + 800, H + 600), { wash: S.wall, ink: null });
  paint(rectPts(-400, 820, W + 800, 500), { wash: S.floor, ink: null });
  paint(rectPts(-400, 640, W + 800, 16), { wash: mixCol(PAL.brand, S.wall, .6), ink: null });   // a brand-blue stripe along the wall
  const wx = o.winX ?? 1320;
  boilSeed('farda window');
  paint(rectPts(wx, 120, 460, 440), { wash: '#9FC7EE', ink: null });
  paint(ellPts(wx + 300, 560, 360, 120, 24), { wash: '#BFE3D0', ink: null });
  glow(wx + 120, 200, 260, '#FFF0C8', .6);
  for (const x of [wx, wx + 230, wx + 460]) inkLine([[x, 120], [x, 560]], 2, '#9AA3C2', 'ink', 0);
  for (const y of [120, 560]) inkLine([[wx, y], [wx + 460, y]], 2, '#9AA3C2', 'ink', 0);
  boilSeed('farda poster');   // a poster of the growth path: three nodes rising
  const px = o.posterX ?? 200;
  paint(rectPts(px, 170, 300, 380), { wash: PAL.deep, ink: PAL.ink, sw: .8 });
  const N = [[px + 250, 470], [px + 150, 380], [px + 60, 260]];
  inkLine(through(N), 1.4, PAL.cyan, 'ink', .5);
  N.forEach(([x, y], i) => { glow(x, y, 40, '#7FE6F5', .6); paint(ellPts(x, y, 12, 12, 12), { wash: PAL.cyan, ink: PAL.ink, sw: .5 }); });
  fardaMark(px + 150, 520, 42, '#9FEAF6');
  boilSeed('farda plant');
  const pl = o.plantX ?? 620;
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .32 + .05 * Math.sin(t * 1.5 + i); paint(ribbon([[pl, 760], [pl + Math.cos(a) * 60, 760 + Math.sin(a) * 90], [pl + Math.cos(a) * 110, 760 + Math.sin(a) * 150]], 26, 6), { wash: i % 2 ? '#5BAE6A' : '#3F8A4E', ink: PAL.ink, sw: .5 }); }
  paint([[pl - 50, 740], [pl + 50, 740], [pl + 38, 830], [pl - 38, 830]], { wash: PAL.ochre, ink: PAL.ink, sw: .7 });
}
// A table at the Farda room, its top at y, from x0 to x1: a warm wooden top and front.
function fardaTable(y, x0 = -200, x1 = W + 200) {
  const S = SETS.farda;
  boilSeed('farda table ' + y);
  paint(rectPts(x0, y, x1 - x0, H - y + 300), { wash: S.tableDk, ink: PAL.ink, sw: .9 });
  paint(rrPts(x0, y - 18, x1 - x0, 40, 12), { wash: S.table, ink: PAL.ink, sw: .9 });
}

// The sky over the dawn hill (dawn 0..1), three painted bands like the intro video's.
function dawnSky(dawn, key = 'dawn') {
  boilSeed('sky ' + key);
  const cols = [[PAL.deep, '#3F72D6'], ['#262A6B', '#8FB4F5'], ['#3B2F7A', '#F5C58E']].map(([n, d]) => mixCol(n, d, dawn));
  paint(rectPts(-80, -80, W + 160, H + 160), { wash: cols[0], ink: null });
  [[380, 1], [650, 2]].forEach(([y, i]) => {
    const P = [[-80, H + 80]]; for (let k = 0; k <= 12; k++) P.push([-80 + k * (W + 160) / 12, y + 22 * Math.sin(k * 1.3 + i) + jit(6)]);
    P.push([W + 80, H + 80]); paint(P, { wash: cols[i], ink: null });
  });
}

// ---------- the laptop screen, filling the frame (an insert: what Arman sees) ----------
// Returns the screen rectangle so a scene can draw its own content: { x, y, w, h }. bg: the room around it.
function screenFrame(o = {}) {
  boilSeed('insert bg');
  paint(rectPts(-100, -100, W + 200, H + 200), { wash: o.bg || '#1A1F33', ink: null });
  const x = 170, y = 80, w = W - 340, h = H - 200;
  boilSeed('insert bezel');
  paint(rrPts(x - 26, y - 26, w + 52, h + 52, 30), { wash: '#2B2F3E', ink: PAL.ink, sw: 1.3 });
  paint(rectPts(x, y, w, h), { wash: o.screen || '#101830', ink: null });
  return { x, y, w, h };
}
// A pointer moving from p0 to p1 over [t0, t1], clicking at t1 (a ripple).
function pointerAt(t, t0, t1, p0, p1) {
  if (t < t0 - .3) return;
  boilSeed("pointer");
  const k = ease(seg(t, t0, t1)), x = lerp(p0[0], p1[0], k), y = lerp(p0[1], p1[1], k) - 40 * Math.sin(k * Math.PI);
  const c = t - t1; if (c > 0 && c < .5) paint(ellPts(x, y, 20 + 90 * c, 20 + 90 * c, 20), { ink: PAL.cyan, sw: 1.5 * (1 - c * 2) });
  const s = 1 - .15 * Math.exp(-Math.max(0, c) * 12) * (c > 0 ? 1 : 0);
  paint([[x, y], [x + 32 * s, y + 30 * s], [x + 16 * s, y + 32 * s], [x + 24 * s, y + 50 * s], [x + 16 * s, y + 54 * s], [x + 8 * s, y + 36 * s], [x, y + 46 * s]], { wash: PAL.cream, ink: PAL.ink, sw: 1 });
}

// ---------- the puzzle of the mind ----------
// Pieces drifting around a head at (x, y): grey and apart, until they light (lit = how many have found their place)
// and, with done 0..1, fly together into one glowing block above the head.
function mindPuzzle(t, x, y, s, lit = 0, done = 0, n = 6) {
  const KN = [[0, 1, -1, 0], [0, 0, 1, -1], [0, -1, 1, 1], [1, -1, 0, 0], [-1, 0, 0, 1], [1, 1, 0, -1]];
  for (let i = 0; i < n; i++) {
    boilSeed('mind piece ' + i);
    const a = i / n * TAU + t * .25, float = [x + Math.cos(a) * s * 3.4, y - s * 2.5 + Math.sin(a) * s * .8];
    const grid = [x + ((i % 3) - 1) * s * .98, y - s * 2.6 + Math.floor(i / 3) * s * .98];
    const k = ease(seg(done, i * .08, .5 + i * .08)), p = [lerp(float[0], grid[0], k), lerp(float[1], grid[1], k) - Math.sin(k * Math.PI) * s * .6];
    puzzlePiece(p[0], p[1], s, { rot: (1 - k) * (Math.sin(t * .8 + i) * .5 + i), lit: i < lit || k > .9, knobs: KN[i] });
  }
  if (done > .9) { boilSeed('mind glow'); glow(x, y - s * 2.1, s * 3 * (1 + .1 * Math.sin(t * 5)), '#7FE6F5', .7 * seg(done, .9, 1)); }
}
// A piece flying in and snapping to its place next to a head (k 0..1), then glowing.
function pieceSnap(t, x, y, s, k, i = 0) {
  if (k <= 0) return;
  const p = arcPt([x + s * 3, y + s * 1.5], [x, y], s * 2, easeOut(k));
  boilSeed('snap piece ' + i);
  puzzlePiece(p[0], p[1], s, { rot: (1 - k) * 2, lit: k >= 1, knobs: [[0, 1, -1, 0], [0, 0, 1, -1], [0, -1, 1, 1]][i % 3] });
}
const sparkleAt = (x, y, r, k, col = PAL.cream) => { if (k > 0 && k < 1) paint(starPts(x, y, r * backOut(k) * (1 - k * .6), .25, 4, k * 2), { wash: col, washOp: 255 * (1 - k * k), ink: null }); };

// A Persian title that writes itself in from the right (screen space).
function storyTitle(txt, lt, t0, t1, fadeAt = 99, o = {}) {
  const a = 1 - seg(lt, fadeAt, fadeAt + .35); if (lt < t0 || a <= 0) return;
  letter(txt, o.x ?? 1840, o.y ?? 120, o.size ?? 90, o.col ?? PAL.cream, { align: o.align ?? 'right', reveal: easeOut(seg(lt, t0, t1)), alpha: a, screen: true, stroke: o.stroke, weight: o.weight });
}
// Transitions in screen space: fade from/to a colour (k 0..1 = cover), after flushing any lettering under it.
function cover(k, col = PAL.deep) { if (k > .01) { flushLetters(); flash(clamp(k), col); } }
