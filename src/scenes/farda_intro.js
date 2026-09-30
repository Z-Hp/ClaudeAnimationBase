// farda_intro.js: «از امروز به فردا بیایید» ("come from today to tomorrow"), a 24-second introduction to the Farda
// Institute, starring Fardi. It follows the website's growth path, right to left as Persian reads: analytical thinking →
// project-based learning → ready for the future. The storyboard is in STORYBOARD.md.
//   A  0–5.6    Today: a night of bored memorising. A star lights up on the left; Fardi drops the book and sets off.
//   B  5.6–11   01 Analytical thinking: Fardi thinks, then joins the scattered stars into a rocket constellation.
//   C  11–16.2  02 Project-based learning: the rocket's parts come down from the sky and Fardi hammers them together.
//   D  16.2–24  03 Ready for the future: Fardi rides the rocket into the sunrise, lands, and "Farda" is written in the sky.
(() => {
  const G = 860;                                            // ground line in shots A–C
  const COSMIC = [PAL.cosmos, PAL.brand];                   // the brush wipe B → C

  // ---------- sky ----------
  // Three painted bands in screen space, night → dawn (dawn 0..1), with jagged edges; soft nebulae over the night.
  function sky(dawn, key) {
    boilSeed('sky ' + key);
    const cols = [[PAL.deep, '#3F72D6'], ['#262A6B', '#8FB4F5'], ['#3B2F7A', '#F5C58E']].map(([n, d]) => mixCol(n, d, dawn));
    paint(rectPts(-80, -80, W + 160, H + 160), { wash: cols[0], ink: null });
    [[380, 1], [650, 2]].forEach(([y, i]) => {
      const P = [[-80, H + 80]]; for (let k = 0; k <= 12; k++) P.push([-80 + k * (W + 160) / 12, y + 22 * Math.sin(k * 1.3 + i) + jit(6)]);
      P.push([W + 80, H + 80]); paint(P, { wash: cols[i], ink: null });
    });
    if (dawn < .9) {
      paint(ellPts(W * .28, 250, 520, 170, 24, 12, -.2), { fill: PAL.nebula, fillOp: 70 * (1 - dawn), bleed: .3, tex: .6, ink: null });
      paint(ellPts(W * .78, 430, 420, 130, 24, 12, .15), { fill: PAL.cyan, fillOp: 45 * (1 - dawn), bleed: .3, tex: .6, ink: null });
    }
  }
  // Stars in world space (they slide with the camera), fading as dawn comes. Only those on screen are painted.
  function stars(t, dawn, n = 110) {
    if (dawn > .95) return;
    for (let i = 0; i < n; i++) {
      const x = -2800 + hash(i) * (W + 5600), y = hash(i + 50) * 640 - 40, [sx, sy] = toScreen(x, y);
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
      boilSeed('star ' + i);
      const tw = .55 + .45 * Math.sin(t * (2 + 2 * hash(i + 300)) + i);
      paint(starPts(x, y, (2.5 + 4.5 * hash(i + 200)) * tw, .35, 4), { wash: PAL.cream, washOp: (150 + 100 * tw) * (1 - dawn), ink: null });
    }
  }
  // Flat ground from the horizon down, wide enough for the whip pans; the horizon is one ink line around the camera.
  function ground(col, key, cx = W / 2) {
    boilSeed('ground ' + key);
    paint(rectPts(cx - 1300, G - 12, 2600, 700, 3), { wash: col, ink: null });
    inkLine([[cx - 1100, G - 10], [cx, G - 14], [cx + 1100, G - 9]], 1, PAL.ink, 'ink', .5);
  }

  // ---------- props ----------
  const sparkle = (x, y, r, k, col = PAL.cream) => { if (k > 0 && k < 1) paint(starPts(x, y, r * backOut(k) * (1 - k * .6), .25, 4, k * 2), { wash: col, washOp: 255 * (1 - k * k), ink: null }); };
  // An open book, upright, centred on (0, 0): a cover and two pages. s = its unit.
  function book(s, sw, col = PAL.brand) {
    paint([[-2.3 * s, -1.4 * s], [0, -1.1 * s], [2.3 * s, -1.4 * s], [2.3 * s, 1.5 * s], [0, 1.8 * s], [-2.3 * s, 1.5 * s]], { wash: col, ink: PAL.ink, sw });
    for (const d of [-1, 1]) {
      paint([[0, -.9 * s], [d * 2 * s, -1.15 * s], [d * 2 * s, 1.25 * s], [0, 1.5 * s]], { wash: PAL.cream, ink: PAL.ink, sw: sw * .7 });
      for (let k = 0; k < 3; k++) inkLine([[d * .4 * s, (-.4 + k * .5) * s], [d * 1.6 * s, (-.55 + k * .5) * s]], sw * .35, mixCol(PAL.ink, PAL.cream, .5), 'inkfine', 0);
    }
  }
  // A dull tower of closed books standing on the ground at x.
  function bookStack(x, key) {
    const cols = ['#6D6A8C', '#7E6F7F', '#5E6C88', '#857A92', '#626680', '#78708A'];
    for (let i = 0; i < 6; i++) {
      boilSeed(`books ${key} ${i}`);
      const w = 190 - 18 * hash(i + 3), h = 46, y = G - (i + 1) * h + 4, dx = (hash(i + 9) - .5) * 26;
      paint(rectPts(x - w / 2 + dx, y, w, h, 2), { wash: cols[i], ink: PAL.ink, sw: .9 });
      inkLine([[x - w / 2 + dx + 12, y + h * .5], [x + w / 2 + dx - 12, y + h * .5]], .4, mixCol(cols[i], PAL.cream, .45), 'inkfine', 0);
    }
  }
  // A hammer held at an arm tip (arm space: +x outward along the arm).
  const hammer = (u, sw) => {
    paint(rectPts(0, -.25 * u, 2.1 * u, .5 * u), { wash: '#B98A5E', ink: PAL.ink, sw: sw * .6 });
    paint(rectPts(1.7 * u, -1.1 * u, 1.1 * u, 2.2 * u, u * .04), { wash: '#8C8FA8', ink: PAL.ink, sw: sw * .7 });
  };

  // ---------- the rocket ----------
  // It points left, centred on its body; s is its unit (the body is 8.6s long and 2.8s tall, the fins reach ±3.2s).
  const ROCKET_STARS = [[-6.3, 0], [-3.6, -1.4], [1.6, -1.3], [4.7, -3.2], [4.7, 3.2], [1.6, 1.3], [-3.6, 1.4]];   // its outline, for the constellation
  function rocketPart(name, s, sw) {
    const P = pts => pts.map(([a, b]) => [a * s, b * s]);
    if (name === 'finT' || name === 'finB') {
      const d = name === 'finT' ? -1 : 1;
      paint(P([[1.4, d * 1.1], [4.4, d * 3.2], [5, d * 3.1], [4.5, d * 1.1]]), { wash: PAL.brand, ink: PAL.ink, sw, curv: .15 });
    } else if (name === 'body') {
      paint(rrPts(-4 * s, -1.4 * s, 8.6 * s, 2.8 * s, 1.1 * s), { wash: PAL.cream, ink: null });
      paint(rectPts(2.4 * s, -1.36 * s, .7 * s, 2.72 * s), { wash: PAL.brand, ink: null });
      paint(rrPts(-4 * s, -1.4 * s, 8.6 * s, 2.8 * s, 1.1 * s), { ink: PAL.ink, sw });
      paint(rectPts(4.55 * s, -.8 * s, .6 * s, 1.6 * s), { wash: '#8C8FA8', ink: PAL.ink, sw: sw * .8 });
    } else if (name === 'nose') {
      paint(P([[-3.5, -1.36], [-5, -1.05], [-6.3, 0], [-5, 1.05], [-3.5, 1.36]]), { wash: PAL.nebula, ink: PAL.ink, sw, curv: .5 });
    } else if (name === 'win') {
      paint(ellPts(-1.5 * s, 0, .8 * s, .8 * s, 16), { wash: PAL.cyan, ink: PAL.ink, sw });
      inkLine(P([[-1.95, -.2], [-1.6, -.55]]), sw * .6, PAL.cream, 'inkfine', 0);
    }
  }
  const PARTS = ['finT', 'finB', 'body', 'nose', 'win'];
  // The flame out of the nozzle (k 0..1 = thrust), with its light.
  function flame(s, k) {
    if (k < .02) return;
    const L = (2.2 + .5 * Math.sin(T * 47) + .3 * Math.sin(T * 31)) * s * k;
    glow(5.8 * s, 0, 3.4 * s * k, '#FFB45E', .9);
    paint(ribbon([[5.1 * s, 0], [5.1 * s + L * .5, jit(s * .1)], [5.1 * s + L, 0]], 1.5 * s * k, .1 * s), { wash: PAL.ochre, ink: PAL.ink, sw: .6 });
    paint(ribbon([[5.1 * s, 0], [5.1 * s + L * .55, 0]], .8 * s * k, .1 * s), { wash: PAL.cream, ink: null });
  }
  // The whole rocket at (x, y). o: rot, flip (points right), flame 0..1, rider (a function that paints Fardi in rocket
  // space, before the body so the body hides its legs), off { part: [dx, dy, alpha-ish k] } for parts still arriving.
  function rocket(x, y, s, o = {}) {
    const sw = clamp(s / 40, .5, 1.4);
    push(); translate(x, y); rotate(o.rot || 0); scale(o.flip ? -1 : 1, 1);
    boilSeed('rocket flame'); flame(s, o.flame || 0);
    if (o.rider) o.rider();
    for (const p of PARTS) {
      const off = o.off && o.off[p]; if (off === null) continue;
      boilSeed('rocket ' + p);
      push(); if (off) translate(off[0], off[1]); rocketPart(p, s, sw); pop();
    }
    pop();
  }
  // Fardi sitting in the rocket's hatch, in rocket space (so it tilts and flips with it).
  const riderAt = (s, u, o) => () => fardi(-.6 * s, -1.2 * s + 2.4 * u, u, { noShadow: true, boilKey: 'rider', ...o });
  // Puffs of smoke or dust spreading out from (x, y) after time t0.
  function puffs(x, y, a, n = 6, size = 40, col = PAL.cream) {
    if (a < 0 || a > 1.2) return;
    for (let i = 0; i < n; i++) {
      boilSeed('puff ' + i);
      const ang = Math.PI + (i / (n - 1)) * Math.PI, d = easeOut(a / 1.2) * (60 + 60 * hash(i)), r = size * (.5 + .7 * easeOut(a)) * (1 - a / 1.2);
      if (r > 2) paint(ellPts(x + Math.cos(ang) * d * 1.6, y + Math.sin(ang) * d * .5, r, r * .8, 12), { wash: col, washOp: 230 * (1 - a / 1.2), ink: null });
    }
  }
  // Speed lines for the whip pan (k = how fast the camera is moving, 0..1), in screen space.
  function whipLines(k, col) {
    if (k < .05) return;
    boilSeed('whip');
    for (let i = 0; i < 18; i++) {
      const y = 40 + hash(i + 7) * (H - 80), x0 = hash(i + 31) * W * .8 - 200, len = W * (.3 + .5 * hash(i + 13)) * k;
      inkLine([[x0, y], [x0 + len * .5, y + jit(3)], [x0 + len, y]], 3 * k, col, 'dry', .3);
    }
  }
  // A Persian title that writes itself in from the right, at the top right of the screen.
  function title(txt, lt, t0, t1, fadeAt = 99, o = {}) {
    const a = 1 - seg(lt, fadeAt, fadeAt + .35); if (lt < t0 || a <= 0) return;
    letter(txt, o.x ?? 1840, o.y ?? 130, o.size ?? 72, o.col ?? PAL.cream, { align: o.align ?? 'right', reveal: easeOut(seg(lt, t0, t1)), alpha: a, screen: true, ...o });
  }
  // Where an arm tip is, in world space, for a front-view character with no rotation or squash (a is the arm angle;
  // side -1 = the left arm, 1 = the right).
  const handAt = (x, y, u, a, side, dy = 0) => [x + side * (4.9 + 2.2 * Math.cos(a)) * u, y + dy * u - 4.5 * u - 2.2 * u * Math.sin(a)];

  // ---------- A: today ----------
  function shotToday(t, lt, dur) {
    const u = 26, fx0 = 1000, tStar = 2.9, tDrop = 3.0, tIdea = 3.8, tTurn = 4.5, tGo = 4.65;
    const whip = easeIn(seg(lt, dur - .45, dur)), camX = kf(lt, [[0, 960], [tGo, 940], [dur - .45, 820]]) - 2600 * whip;
    sky(0, 'A');
    camBegin(camX, 560, kf(lt, [[0, 1.04], [tStar, 1.1], [tGo, 1.06]]));
    stars(t, 0);
    // the star on the left that calls: a flash and a sparkle, then a steady twinkle
    const sa = lt - tStar;
    if (sa > 0) {
      boilSeed('call star');
      glow(330, 330, 70 + 90 * Math.exp(-sa * 3) + 10 * Math.sin(lt * 6), '#9FE8F5', .9);
      paint(starPts(330, 330, 22 * backOut(seg(sa, 0, .35)) * (1 + .08 * Math.sin(lt * 7)), .42, 4), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
      sparkle(330, 330, 90, seg(sa, 0, .6));
    }
    ground(mixCol(PAL.cosmos, PAL.deep, .78), 'A', camX);
    bookStack(1330, 'A');

    const mood = fardiEmotions(lt, [[0, 'bored', { lookX: .6, lookY: -.3 }], [2.0, 'sleepy'], [tDrop, 'surprised', { lookX: -.9, lookY: -.5 }],
                                    [tIdea, 'idea', { lookX: -.7, lookY: -.3 }], [4.35, 'excited']]);
    const walk = stroll(lt, tGo, dur + .6, fx0, fx0 - 1100, u);
    const x = lt < tGo ? fx0 : walk.x - 3400 * whip;   // in the whip, Fardi dashes off to the left ahead of the camera
    let pose = {};
    if (lt < tDrop) {   // reading: the book held up in the right hand, drooping as Fardi dozes off
      const aR = lerp(.55, -.1, ease(seg(lt, 2.0, 2.6))) + .05 * Math.sin(lt * 2);
      pose = { aR, armR: (uu, sw) => { push(); rotate(aR); translate(1.2 * uu, -1.2 * uu); book(uu * .8, sw * .8); pop(); } };
    }
    if (lt >= tTurn && lt < tGo) pose = turn(lt, tTurn, tGo, 0, -.25);
    if (lt >= tGo) pose = { view: 'side', flip: true, walk: walk.walk + 6 * whip, dy: (mood.dy || 0) * .3 + walk.dy, smear: whip, smearDir: 1 };
    fardi(x, G, u, { ...mood, ...pose });
    // the dropped book: jumps out of the hand with the take, tumbles on an arc and lands by the stack
    if (lt >= tDrop) {
      boilSeed('dropped book');
      const k = seg(lt, tDrop, tDrop + .55), h = handAt(fx0, G, u, -.1, 1), p = arcPt([h[0] + 30, h[1] - 30], [1180, G - 22], 160, easeIn(k));
      push(); translate(...p); rotate(k * 2.6 + (k >= 1 ? spring(lt, tDrop + .55, 8, 20) * .2 : 0)); book(u * .8, .8); pop();
      if (k >= 1) puffs(1180, G - 5, lt - tDrop - .55, 5, 22, mixCol(PAL.cosmos, PAL.cream, .5));
    }
    const eye = toScreen(fx0, G - 4 * u);
    camEnd();
    title('امروز', lt, .7, 1.5, 2.6, { size: 120, y: 150 });
    boilSeed('transition');
    if (lt < .6) iris(...eye, lerp(0, 1500, easeIn(lt / .6)), PAL.deep);
    whipLines(whip, mixCol(PAL.cream, PAL.cosmos, .45));
  }

  // ---------- B: 01 analytical thinking ----------
  function shotThink(t, lt, dur) {
    const u = 26, RC = [690, 360], RS = 82, tThink = 1.1, tIdea = 2.5, tLink = 2.8, tDone = 3.9;
    const whip = 1 - easeOut(seg(lt, 0, .45)), camX = 960 + 2600 * whip + 14 * Math.sin(lt * .7);
    sky(.08, 'B');
    camBegin(camX, 540, kf(lt, [[0, 1], [dur, 1.05]]));
    stars(t, .08);
    // the constellation: scattered stars, then the lines that join them into a rocket, one after another
    const P = ROCKET_STARS.map(([a, b]) => [RC[0] + a * RS, RC[1] + b * RS]), done = seg(lt, tDone, tDone + .25);
    if (done > 0) { boilSeed('constellation glow'); glow(RC[0], RC[1], 520, '#7FDDF0', .45 * done * (1 - .5 * seg(lt, tDone + .6, dur))); }
    for (let i = 0; i < P.length; i++) {
      const k = seg(lt, tLink + i * .15, tLink + i * .15 + .2); if (k <= 0) continue;
      boilSeed('link ' + i);
      const a = P[i], b = P[(i + 1) % P.length], e = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
      inkLine([a, e], 1.1, PAL.cyan, 'ink', 0);
      if (k < 1) glow(...e, 40, '#9FE8F5', .8);
    }
    [...P, [RC[0] - 1.5 * RS, RC[1]]].forEach((p, i) => {
      boilSeed('cstar ' + i);
      const lit = seg(lt, tLink + i * .15 - .05, tLink + i * .15 + .1), tw = 1 + .15 * Math.sin(lt * 5 + i * 1.7);
      glow(...p, 36 + 20 * lit, '#BFEFFF', .5 + .4 * lit);
      paint(starPts(...p, (11 + 5 * lit + 6 * done) * tw, .4, 4), { wash: PAL.cream, ink: PAL.ink, sw: .5 });
      sparkle(...p, 50, seg(lt, tLink + i * .15, tLink + i * .15 + .4));
    });
    ground(mixCol(PAL.nebula, PAL.deep, .78), 'B', camX);

    const walk = stroll(lt, 0, 1.0, 2050, 1420, u), x = walk.x + 2600 * whip;   // keeps pace with the whip, entering from the right
    const mood = fardiEmotions(lt, [[0, 'excited'], [tThink, 'thinking', { lookX: -.7, lookY: -.8 }], [tIdea, 'idea', { lookX: -.8, lookY: -.6 }], [tDone + .1, 'starstruck']]);
    const pose = lt < 1.0 ? { view: 'side', flip: true, walk: walk.walk, dy: walk.dy, smear: whip, smearDir: 1 } : lt < 1.12 ? turn(lt, 1.0, 1.12, -.25, 0) : {};
    const cl = { ...mood, ...pose, dy: (mood.dy || 0) * (lt < 1 ? .3 : 1) + (pose.dy || 0) };
    // pointing at the stars as they join: the left arm up toward them, with a little jab on each new star
    const point = ease(seg(lt, tLink - .2, tLink)) * (1 - ease(seg(lt, tDone + .1, tDone + .4)));
    const jab = .12 * Math.max(0, Math.sin(clamp((lt - tLink) / .15, 0, 7) * Math.PI));
    cl.aL = lerp(cl.aL ?? .2, .95 + jab, point); cl.aR = lerp(cl.aR ?? .2, -.3, point);
    fardi(x, G, u, cl);
    camEnd();
    title('۰۱ · اندیشه تحلیلی', lt, .5, 1.3);
    boilSeed('transition');
    whipLines(whip, mixCol(PAL.cream, PAL.cosmos, .45));
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, COSMIC); }
  }

  // ---------- C: 02 project-based learning ----------
  function shotBuild(t, lt, dur) {
    const u = 24, RX = 780, RY = 640, RS = 60, fx0 = 1330;
    const LAND = { body: .7, nose: 1.25, finT: 1.75, finB: 2.15, win: 2.55 }, tDone = 2.85, tJump = 4.1, tLand = 4.6, tFire = 4.75;
    const fire = seg(lt, tFire, dur), shake = fire > 0 ? shakeXY(t, 5 * fire) : [0, 0];
    sky(.22, 'C');
    camBegin(960 + shake[0], 540 + shake[1], kf(lt, [[0, 1.02], [tDone, 1.06], [dur, 1.1]]));
    stars(t, .22);
    ground(mixCol(PAL.cosmos, PAL.deep, .62), 'C');
    // the launch cradle
    boilSeed('cradle');
    for (const cx of [RX - 170, RX + 130]) paint([[cx - 50, G - 6], [cx - 20, RY + 1.2 * RS], [cx + 20, RY + 1.2 * RS], [cx + 50, G - 6]], { wash: '#8A6A55', ink: PAL.ink, sw: .9 });

    // the parts come down from the sky one at a time, glowing (they're the constellation, made real), and land with a bounce
    const off = {};
    for (const p of PARTS) {
      const a = lt - LAND[p];
      if (a < -.55) { off[p] = null; continue; }
      if (a < 0) { const k = easeIn(seg(a, -.55, 0)); off[p] = [lerp(260, 0, k), lerp(-760, 0, k)]; }
      else off[p] = [0, -Math.abs(spring(lt, LAND[p], 7, 20)) * 14];
    }
    for (const p of PARTS) {   // light around each falling part, and a sparkle where it lands
      const a = lt - LAND[p]; if (a < -.55 || a > .6) continue;
      boilSeed('part light ' + p);
      if (a < 0) glow(RX + off[p][0], RY + off[p][1], 120, '#9FE8F5', .7);
      sparkle(RX + (p === 'nose' ? -5.2 * RS : p === 'win' ? -1.5 * RS : 0), RY + (p === 'finT' ? -2.4 * RS : p === 'finB' ? 2.4 * RS : 0), 70, seg(a, 0, .5));
    }
    const doneK = seg(lt, tDone, tDone + .5);
    if (doneK > 0 && doneK < 1) { boilSeed('done glow'); glow(RX, RY, 460, '#FFE3A3', .6 * Math.sin(doneK * Math.PI)); }

    // Fardi: hammers each part home as it lands, is proud of the result, then jumps into the hatch
    const mood = fardiEmotions(lt, [[0, 'determined', { lookX: -.7 }], [tDone + .1, 'proud'], [3.9, 'excited']]);
    let swing = .2;
    for (const h of Object.values(LAND)) if (lt > h - .35 && lt < h + .4)
      swing = lt < h - .12 ? lerp(.2, 1.3, ease(seg(lt, h - .35, h - .12))) : lt < h ? lerp(1.3, -.45, easeIn(seg(lt, h - .12, h))) : lerp(-.45, .2, ease(seg(lt, h, h + .4)));
    const hammering = lt < tDone + .2;
    const jk = seg(lt, tJump, tLand), hop = jump(lt, tJump, tLand, 0);
    const seat = [RX - .6 * RS, RY - 1.2 * RS + 2.4 * u];
    const p = lt < tJump ? [fx0, G] : arcPt([fx0, G], seat, 260, jk);
    const cl = { ...mood, sq: (mood.sq || 0) + hop.sq };
    if (hammering) { cl.aL = swing; cl.armL = hammer; }
    const rider = lt >= tLand;
    const drawFardi = () => fardi(...p, u, { ...cl, noShadow: lt > tJump, boilKey: 'fardi' });
    const riding = riderAt(RS, u, { ...cl, dy: 0, aL: 1.1 + .3 * Math.sin(lt * 9), aR: 1.1 - .3 * Math.sin(lt * 9) });
    if (hammering) for (const h of Object.values(LAND)) { const hp = handAt(fx0, G, u, -.45, -1); boilSeed('hit ' + h); sparkle(hp[0] - 50, hp[1], 40, seg(lt, h, h + .35), PAL.ochre); }
    const rdx = -18 * ease(seg(lt, tFire, tFire + .2)) * (1 - seg(lt, tFire + .3, dur)) + (fire > 0 ? jit(3) : 0);
    if (rider) rocket(RX + rdx, RY, RS, { off, flame: fire, rider: riding });
    else { rocket(RX, RY, RS, { off }); drawFardi(); }
    if (rider) puffs(RX + 5.4 * RS, RY + RS, lt - tFire, 8, 60, mixCol(PAL.cream, PAL.nebula, .25));
    camEnd();
    title('۰۲ · یادگیری پروژه‌محور', lt, .4, 1.2, 3.6);
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, COSMIC);
  }

  // ---------- D: 03 ready for the future ----------
  function shotFuture(t, lt, dur) {
    const s = 40, u = 16, tSun = 1.6, tBack = 3.2, tLand = 4.4, tLogo = 4.9, tLine = 5.8, tWave = 5.6, tOut = 7.2;
    const dawn = kf(lt, [[0, .28], [tSun, .38], [tSun + 1.6, 1]]);
    sky(dawn, 'D');
    camBegin(960, 540, kf(lt, [[0, 1], [tLand, 1.02], [dur, 1.05]]));
    stars(t, dawn);
    // the sun comes up behind the hills
    const sunY = kf(lt, [[tSun, 1060], [tSun + 1.6, 650]], easeOut), SX = 1060;
    boilSeed('sun');
    if (lt > tSun) {
      glow(SX, sunY, 420, '#FFD27A', .8);
      paint(ellPts(SX, sunY, 150, 150, 36, 1.5), { wash: '#FFE3A3', fill: PAL.ochre, fillOp: 50, ink: null });
    }
    boilSeed('hills');
    paint(ellPts(1500, 1120, 900, 330, 40, 2), { wash: mixCol('#3A3F8F', '#4E78C9', dawn), ink: PAL.ink, sw: .9 });
    paint(ellPts(650, 1160, 1000, 340, 40, 2), { wash: mixCol('#2B2E6E', '#2E6C9E', dawn), ink: PAL.ink, sw: 1 });
    const hillY = x => 1160 - 340 * Math.sqrt(Math.max(0, 1 - ((x - 650) / 1000) ** 2));

    // the flight out: up and away to the top left, trailing smoke; then back, flipped to point right, and a landing
    const LX = 700, LY = hillY(700) - 3.2 * s + 6;
    let x, y, rot = 0, flip = false, fl = 1, sy = 1;
    if (lt < tBack) {
      const k = seg(lt, 0, 1.9), A = [1780, 1000], B = [-300, 120], pk = arcPt(A, B, 260, k), pn = arcPt(A, B, 260, k + .01);
      [x, y] = pk; rot = Math.atan2(pn[1] - pk[1], pn[0] - pk[0]) + Math.PI;
      for (let i = 1; i < 10; i++) { const q = arcPt(A, B, 260, Math.max(0, k - i * .035)); boilSeed('trail ' + i); if (k < 1.2) paint(ellPts(q[0] + 5.5 * s * Math.cos(rot) , q[1] + 5.5 * s * Math.sin(rot), 26 - i * 2, 22 - i * 2, 12), { wash: PAL.cream, washOp: 200 - i * 16, ink: null }); }
    } else {
      const k = easeOut(seg(lt, tBack, tLand)), A = [-280, 240], pk = arcPt(A, [LX, LY], -120, k), pn = arcPt(A, [LX, LY], -120, Math.min(1, k + .01));
      [x, y] = pk; flip = true; rot = k < .99 ? Math.atan2(pn[1] - pk[1], pn[0] - pk[0]) * (1 - ease(seg(lt, tLand - .35, tLand))) : 0;
      fl = 1 - seg(lt, tLand - .1, tLand + .2);
      sy = 1 - .12 * Math.exp(-(lt - tLand) * 8) * Math.cos((lt - tLand) * 22) * (lt > tLand ? 1 : 0);
    }
    const mood = fardiEmotions(lt, [[0, 'excited'], [tLand + .05, 'surprised', { lookX: .8, lookY: -.3 }], [tLand + .45, 'love', { lookX: .6 }], [tWave + .4, 'happy']]);
    const wave = lt > tWave ? { aR: lerp(mood.aR ?? .2, 1.2 + .5 * Math.sin((lt - tWave) * 13), ease(seg(lt, tWave, tWave + .2))) } : {};
    push(); translate(x, y); scale(1, sy); translate(-x, -y);
    rocket(x, y, s, { rot, flip, flame: fl, rider: riderAt(s, u, { ...mood, ...wave }) });
    pop();
    if (lt > tLand) puffs(LX, hillY(LX) - 4, lt - tLand, 8, 34, mixCol(PAL.cream, PAL.ochre, .3));
    camEnd();

    title('۰۳ · آمادگی برای آینده', lt, .5, 1.3, 2.4);
    title('فردا', lt, tLogo, tLogo + .8, 99, { x: 960, y: 250, size: 230, align: 'center', col: PAL.brandDk, stroke: PAL.cream });
    title('از امروز به فردا بیایید', lt, tLine, tLine + .8, 99, { x: 960, y: 440, size: 78, align: 'center', col: PAL.deep, stroke: PAL.cream, weight: 700 });
    boilSeed('transition');
    if (lt > tOut) { flushLetters(); flash(easeIn(seg(lt, tOut, dur - .05)), PAL.deep); }
  }

  shots([[0, shotToday], [5.6, shotThink], [11, shotBuild], [16.2, shotFuture]]);
})();
