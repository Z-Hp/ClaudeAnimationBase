// student.js: a new mascot draft for Farda Institute: a bright, future-minded student who learns with AI agents and
// gadgets. Curly dark hair, smart glasses with a small HUD, a brand-blue hoodie with glowing cyan details, cargo pants,
// light sneakers and a backpack with an LED strip; a floating AI companion (buddy()) and a holographic tablet (holo()).
// Drawn in key views like the other characters (front, q, side, back), never projected.
//
//   student(x, y, u, { view, eyes, brows, mouth, lookX, lookY, blush, aL, aR, bL, bR, walk, dy, sq, rot, flip, emote })
//   (x, y) = the ground point between the feet; u = size unit (the student is about 15.5u tall, hair included).
//   aL / aR: arm angles from hanging straight down (+ = out and up; PI/2 = level, PI = straight up);
//   bL / bR: elbow bends (+ bends the forearm in, toward the chest).
//   eyes: open, wide, sparkle, focus, happy, closed, squeeze, wink. brows: neutral, up, down, worried, raise.
//   mouth: smile, grin, o, O, flat, wobble, laugh, smirk. Expressions bundle them: expr('curious') etc.
const STU = {
  skin: '#F1C7A2', skinDk: '#D39472', hair: '#43291F', hairLt: '#6E4636',
  hoodie: '#3D63D6', hoodieDk: '#2A469F', pants: '#2B2F45', pantsDk: '#1E2133',
  shoe: '#F2EEE6', pack: '#34364A', packDk: '#25273A', glow: '#3CCFE6', iris: '#5A3A2A', mouth: '#5A2430'
};
const STU_EXPR = {
  neutral: { eyes: 'open', brows: 'neutral', mouth: 'smile' },
  happy: { eyes: 'open', brows: 'up', mouth: 'grin', blush: .7 },
  curious: { eyes: 'open', brows: 'raise', mouth: 'o', lookX: .5, lookY: -.45 },
  amazed: { eyes: 'sparkle', brows: 'up', mouth: 'O', blush: .5 },
  focused: { eyes: 'focus', brows: 'down', mouth: 'flat', lookY: .3 },
  idea: { eyes: 'sparkle', brows: 'up', mouth: 'grin', emote: 'bulb' },
  confused: { eyes: 'open', brows: 'worried', mouth: 'wobble', lookX: -.4, emote: '?' },
  laugh: { eyes: 'squeeze', brows: 'up', mouth: 'laugh', blush: .9 },
  wink: { eyes: 'wink', brows: 'raise', mouth: 'smirk', blush: .4 },
};
const expr = (name, over = {}) => ({ ...STU_EXPR[name], ...over });

function student(x, y, u, o = {}) {
  const id = o.boilKey ?? ++CLAWD_N, rs = part => boilSeed(`student ${id} ${part}`);
  const view = o.view || 'front', sw = clamp(u / 16, .45, 2.2), P = pts => pts.map(([a, b]) => [a * u, b * u]);
  const dy = (o.dy || 0) * u, sq = o.sq || 0;
  rs('shadow');
  if (!o.noShadow) paint(ellPts(x, y + u * .1, u * (view === 'side' ? 3.2 : 3.6) * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * .7, 20), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, ink: null });
  push(); translate(x, y + dy); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + sq * .5), 1 - sq);

  const arm = (side, far) => {
    rs('arm' + side);
    const a = side < 0 ? o.aL ?? .12 : o.aR ?? .12, b = side < 0 ? o.bL ?? .15 : o.bR ?? .15;
    const px = view === 'side' ? 0 : view === 'q' ? (side < 0 ? -2.1 : 2.3) : side * 2.45;
    push(); translate(px * u, -7.9 * u); stuArm(view === 'side' ? 1 : side, a, b, u, sw, far, side < 0 ? o.handL : o.handR, side < 0 && view !== 'side'); pop();
  };

  // behind the body: the backpack, and the far arm in the 3/4 view
  rs('pack');
  if (view === 'front') paint(rrPts(-3.35 * u, -8.2 * u, 6.7 * u, 3.6 * u, .8 * u), { wash: STU.pack, ink: PAL.ink, sw: sw * .8 });
  if (view === 'q') paint(rrPts(-3.7 * u, -8.3 * u, 3 * u, 3.8 * u, .8 * u), { wash: STU.pack, ink: PAL.ink, sw: sw * .8 });
  if (view === 'q') arm(-1, true);

  rs('legs'); stuLegs(u, sw, view, o.walk);
  rs('torso'); stuTorso(u, sw, view);
  rs('head'); push(); translate(0, -11.7 * u); stuHead(u, o, sw, view); pop();
  if (view === 'front') { arm(-1); arm(1); } else if (view === 'q') arm(1); else if (view === 'side') arm(1); else { arm(-1); arm(1); }
  rs('draw'); if (o.draw) o.draw(u, sw);
  pop();
  rs('emote');
  if (o.emote) emote(o.emote, x + (o.flip ? -1 : 1) * 3.6 * u, y + dy - 15.2 * u, u * .75, o.emoteK ?? 1, o.emoteAge ?? T);
  rs('after');
}

// An arm hanging from the shoulder (the current origin): sleeve, cuff, hand. side ±1 is the outward direction.
function stuArm(side, a, bend, u, sw, far, hook, watch) {
  const d1 = [side * Math.sin(a), Math.cos(a)], a2 = a - bend, d2 = [side * Math.sin(a2), Math.cos(a2)];
  const E = [d1[0] * 1.9 * u, d1[1] * 1.9 * u], H = [E[0] + d2[0] * 1.7 * u, E[1] + d2[1] * 1.7 * u];
  const col = far ? mixCol(STU.hoodie, STU.hoodieDk, .6) : STU.hoodie;
  paint(ribbon([[0, 0], [E[0] * .5, E[1] * .5], E, [(E[0] + H[0]) / 2, (E[1] + H[1]) / 2], H], 1.45 * u, 1.1 * u), { wash: col, ink: PAL.ink, sw: sw * .8 });
  paint(ellPts(H[0], H[1], .58 * u, .5 * u, 12, 0, Math.atan2(d2[1], d2[0]) + Math.PI / 2), { wash: STU.hoodieDk, ink: PAL.ink, sw: sw * .6 });
  const hand = [H[0] + d2[0] * .5 * u, H[1] + d2[1] * .5 * u];
  paint(ellPts(hand[0], hand[1], .52 * u, .56 * u, 12), { wash: far ? mixCol(STU.skin, STU.skinDk, .5) : STU.skin, ink: PAL.ink, sw: sw * .6 });
  if (watch) {   // a smartwatch on the left wrist, its screen lit
    const w = [H[0] - d2[0] * .35 * u, H[1] - d2[1] * .35 * u];
    paint(rrPts(w[0] - .38 * u, w[1] - .3 * u, .76 * u, .6 * u, .15 * u), { wash: PAL.ink, ink: null });
    paint(rrPts(w[0] - .25 * u, w[1] - .18 * u, .5 * u, .36 * u, .1 * u), { wash: STU.glow, ink: null });
  }
  if (hook) { push(); translate(...hand); rotate(Math.atan2(d2[1], d2[0]) - Math.PI / 2); hook(u, sw); pop(); }
}

function stuLegs(u, sw, view, walk) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  const shoe = (x, dir, dark) => {   // a chunky sneaker; dir 0 = facing out of the screen, ±1 = pointing that way
    if (!dir) {
      paint(rrPts((x - 1.05) * u, -1.1 * u, 2.1 * u, 1.1 * u, .45 * u), { wash: dark ? mixCol(STU.shoe, PAL.ink, .15) : STU.shoe, ink: PAL.ink, sw: sw * .7 });
      inkLine(P([[x - .95, -.22], [x, -.18], [x + .95, -.22]]), sw * .7, STU.glow, 'ink', 0);
      inkLine(P([[x - .45, -.85], [x + .45, -.85]]), sw * .4, mixCol(STU.shoe, PAL.ink, .4), 'inkfine', 0);
    } else {
      paint(P([[x - 1 * dir, 0], [x + 1.55 * dir, 0], [x + 1.75 * dir, -.45], [x + 1.1 * dir, -.95], [x - .8 * dir, -1.05], [x - 1.05 * dir, -.5]]), { wash: dark ? mixCol(STU.shoe, PAL.ink, .15) : STU.shoe, ink: PAL.ink, sw: sw * .7, curv: .4 });
      inkLine(P([[x - .95 * dir, -.2], [x + 1.6 * dir, -.2]]), sw * .7, STU.glow, 'ink', 0);
    }
  };
  if (view === 'side') {   // two legs swinging from the hip; the far one darker
    const w = walk ?? 0;
    [[.5, true], [0, false]].forEach(([ph, far]) => {
      const s = walk == null ? (far ? -.08 : .08) : .45 * Math.sin((w + ph) * TAU), lift = walk == null ? 0 : Math.max(0, Math.cos((w + ph) * TAU)) * .5;
      const fx = Math.sin(s) * 3.4, fy = -.9 - lift;
      paint(ribbon(P([[0, -4.3], [fx * .5, -2.6], [fx, fy]]), 1.9 * u, 1.55 * u), { wash: far ? STU.pantsDk : STU.pants, ink: PAL.ink, sw: sw * .8 });
      push(); translate(0, -lift * u); shoe(fx, 1, far); pop();
    });
    return;
  }
  const q = view === 'q' ? .25 : 0;
  for (const s of [-1, 1]) {
    const far = view === 'q' && s < 0;
    paint(P([[s * .15 + q, -4.4], [s * 2.05 + q, -4.4], [s * 2.2 + q, -.8], [s * .3 + q, -.8]]), { wash: far ? STU.pantsDk : STU.pants, ink: PAL.ink, sw: sw * .8 });
    if (view !== 'back') paint(rectPts((s < 0 ? -2.2 : 1.45) + q, -3.2 * u / u, .75, 1.1).map(([a, b]) => [a * u, b * u]), { wash: STU.pantsDk, ink: PAL.ink, sw: sw * .45 });   // cargo pocket
    shoe(s * 1.2 + q, 0, far);
  }
}

function stuTorso(u, sw, view) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  if (view === 'side') {
    paint(P([[-1.6, -8.35], [1.3, -8.35], [1.95, -6.8], [2.1, -4.05], [-1.95, -4.05], [-1.9, -6.8]]), { wash: STU.hoodie, ink: PAL.ink, sw, curv: .3 });
    paint(rectPts(-1.95 * u, -4.5 * u, 4.05 * u, .5 * u), { wash: STU.hoodieDk, ink: PAL.ink, sw: sw * .6 });
    paint(P([[.3, -5.8], [2, -5.8], [2.1, -4.5], [.3, -4.5]]), { wash: mixCol(STU.hoodie, STU.hoodieDk, .5), ink: PAL.ink, sw: sw * .5 });
    paint(rrPts(-3.7 * u, -8.3 * u, 2.1 * u, 3.9 * u, .7 * u), { wash: STU.pack, ink: PAL.ink, sw: sw * .8 });   // the backpack, from the side
    inkLine(P([[-3.45, -7.4], [-3.45, -5.2]]), sw * .9, STU.glow, 'ink', 0);
    inkLine(P([[-1.5, -8.3], [-.7, -8.1], [-.5, -6.2]]), sw * 1.8, STU.packDk, 'ink', .4);   // strap over the shoulder
    paint(rectPts(-.55 * u, -9.4 * u, 1.1 * u, 1.2 * u), { wash: STU.skin, ink: PAL.ink, sw: sw * .6 });
    paint(P([[-1.9, -8.2], [-1.6, -9.2], [-.5, -9.2], [.2, -8.2]]), { wash: STU.hoodieDk, ink: PAL.ink, sw: sw * .7, curv: .4 });   // the hood
    return;
  }
  const qx = view === 'q' ? .25 : 0, B = view === 'back';
  paint(P([[-2.55 + qx, -8.35], [2.55 + qx, -8.35], [2.95 + qx, -6.8], [3 + qx, -4.05], [-3 + qx, -4.05], [-2.95 + qx, -6.8]]), { wash: STU.hoodie, ink: PAL.ink, sw, curv: .3 });
  paint(rectPts((-3 + qx) * u, -4.5 * u, 6 * u, .5 * u), { wash: STU.hoodieDk, ink: PAL.ink, sw: sw * .6 });
  if (B) {   // the hood hanging down the back, and the backpack over it
    paint(P([[-2, -8.4], [2, -8.4], [1.6, -7], [0, -6.5], [-1.6, -7]]), { wash: STU.hoodieDk, ink: PAL.ink, sw: sw * .7, curv: .4 });
    paint(rrPts(-2.55 * u, -8.2 * u, 5.1 * u, 4.3 * u, .9 * u), { wash: STU.pack, ink: PAL.ink, sw: sw * .9 });
    paint(rrPts(-1.9 * u, -6.3 * u, 3.8 * u, 1.9 * u, .45 * u), { wash: STU.packDk, ink: PAL.ink, sw: sw * .7 });
    inkLine(P([[-1.5, -6.9], [1.5, -6.9]]), sw * 1.1, STU.glow, 'ink', 0);
    inkLine(P([[-.6, -8.2], [0, -8.75], [.6, -8.2]]), sw * 1.2, STU.packDk, 'ink', .5);   // the handle
    paint(rectPts(-.55 * u, -9.4 * u, 1.1 * u, 1.1 * u), { wash: STU.skin, ink: PAL.ink, sw: sw * .6 });
    return;
  }
  const F = view === 'q' ? .75 : 0;   // the chest details shift toward the heading in 3/4
  paint(P([[-1.8 + F, -5.9], [1.8 + F, -5.9], [2.2 + F, -4.5], [-2.2 + F, -4.5]]), { wash: mixCol(STU.hoodie, STU.hoodieDk, .45), ink: PAL.ink, sw: sw * .5 });   // pocket
  paint(P([[-2.2 + F, -8.2], [-1.8 + F, -9.3], [1.8 + F, -9.3], [2.2 + F, -8.2]]), { wash: STU.hoodieDk, ink: PAL.ink, sw: sw * .7, curv: .3 });   // hood, behind the neck
  paint(rectPts((-.6 + F) * u, -9.5 * u, 1.2 * u, 1.3 * u), { wash: STU.skin, ink: null });
  paint(P([[-.8 + F, -8.4], [.8 + F, -8.4], [F, -7.6]]), { wash: PAL.cream, ink: PAL.ink, sw: sw * .5 });   // tee
  paint(ribbon(P([[-2.15 + F, -8.9], [-.9 + F, -8.15], [F, -7.5], [.9 + F, -8.15], [2.15 + F, -8.9]]), .6 * u, .6 * u), { wash: STU.hoodie, ink: PAL.ink, sw: sw * .7 });   // hood rim
  for (const s of [-1, 1]) {   // drawstrings with glowing tips
    inkLine(P([[s * .45 + F, -8], [s * .55 + F, -7.2], [s * .5 + F, -6.5]]), sw * .5, PAL.cream, 'inkfine', .4);
    paint(ellPts((s * .5 + F) * u, -6.35 * u, .14 * u, .22 * u, 8), { wash: STU.glow, ink: null });
  }
  glow((1.6 + F) * u, -7.25 * u, .9 * u, '#7FE6F5', .5);
  paint(ellPts((1.6 + F) * u, -7.25 * u, .38 * u, .38 * u, 6, 0, Math.PI / 6), { wash: STU.glow, ink: PAL.ink, sw: sw * .45 });   // emblem
  // backpack straps over the shoulders, the near one with an LED strip
  const straps = view === 'q' ? [1] : [-1, 1];
  for (const s of straps) {
    const x0 = s * 1.65 + (view === 'q' ? .6 : 0);
    paint(P([[x0 - .35, -8.35], [x0 + .35, -8.35], [x0 + .45 * s + .2, -5.7], [x0 + .45 * s - .5, -5.7]]), { wash: STU.pack, ink: PAL.ink, sw: sw * .6 });
    if (s > 0) inkLine(P([[x0 + .05, -7.8], [x0 + .25, -6.3]]), sw * .8, STU.glow, 'ink', 0);
  }
}

// The head, centred on the current origin.
function stuHead(u, o, sw, view) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  const F = { front: { cx: 0, fw: 1, sides: [-1, 1] }, q: { cx: .85, fw: .8, sides: [-1, 1] }, side: { cx: 1.4, fw: .55, sides: [1] }, back: null }[view];
  const ear = (x, back) => { paint(ellPts(x * u, .4 * u, .55 * u, .78 * u, 12), { wash: STU.skin, ink: PAL.ink, sw: sw * .7 }); if (!back) inkLine(P([[x - .05, .05], [x + .15, .4], [x - .05, .75]]), sw * .4, STU.skinDk, 'inkfine', .5); };
  if (view === 'front' || view === 'back') for (const s of [-1, 1]) ear(s * 3.05, view === 'back');
  // the head: round, a little narrower at the chin; a small nose in profile
  const H = []; for (let i = 0; i < 30; i++) { const a = i / 30 * TAU, low = Math.sin(a) > 0; H.push([Math.cos(a) * 3.15 * u * (low ? 1 - .12 * Math.sin(a) : 1), Math.sin(a) * 3.05 * u]); }
  paint(H, { wash: STU.skin, ink: PAL.ink, sw });
  if (view === 'side') paint(P([[2.85, .35], [3.45, 1.05], [2.9, 1.3]]), { wash: STU.skin, ink: PAL.ink, sw: sw * .6, curv: .5 });
  if (view === 'q') ear(-2.55);
  if (view === 'side') {   // in profile the ear sits on the cheek: an open C with a curl, not a closed ring
    paint(ellPts(-.35 * u, .4 * u, .5 * u, .72 * u, 12), { wash: STU.skin, ink: null });
    inkLine(P([[-.1, -.25], [-.6, -.2], [-.85, .4], [-.6, 1.05], [-.15, 1.1]]), sw * .7, PAL.ink, 'ink', .5);
    inkLine(P([[-.3, .05], [-.55, .4], [-.3, .75]]), sw * .4, STU.skinDk, 'inkfine', .5);
  }
  if (F) {
    push(); translate(F.cx * u, 0); scale(F.fw, 1);
    const bl = clamp(o.blush ?? .35);
    for (const s of F.sides) {
      const bx = s * (view === 'side' ? 1.3 : 2.05);
      paint(ellPts(bx * u, 1.3 * u, .6 * u, .32 * u, 12), { fill: PAL.rose, fillOp: 60 + 110 * bl, bleed: .2, ink: null });
      for (let k = 0; k < 3; k++) paint(ellPts((bx + (k - 1) * .3) * u, (1.1 + (k % 2) * .18) * u, .06 * u, .06 * u, 6), { wash: STU.skinDk, ink: null });   // freckles
    }
    for (const s of F.sides) { push(); translate(s * 1.2 * u, .35 * u); stuEye(o.eyes === 'wink' ? (s < 0 ? 'happy' : 'open') : o.eyes || 'open', s, u, o, sw); pop(); }
    for (const s of F.sides) stuBrow(s, o.brows || 'neutral', u, sw);
    if (view !== 'side') inkLine(P([[.05, .85], [.28, 1.2], [.05, 1.28]]), sw * .5, STU.skinDk, 'ink', .5);
    stuMouth(o.mouth || 'smile', u, sw);
    if (o.glasses !== false) stuGlasses(u, sw, F.sides, view === 'side' ? (-.35 - F.cx) / F.fw : null);
    pop();
  }
  stuHair(u, sw, view);
}

function stuEye(e, s, u, o, sw) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), lx = (o.lookX || 0) * .22 * u, ly = (o.lookY || 0) * .22 * u;
  const line = (pts, w = 1.3, c = .4) => inkLine(P(pts), sw * w, PAL.ink, 'ink', c);
  const blink = ['open', 'wide', 'sparkle'].includes(e) && ((T * .8 + (o.seed || 0) * 1.3 + (s > 0 ? .02 : 0)) % 3.7) < .12;
  if (blink) e = 'closed';
  const open = (k = 1, star = false) => {
    paint(ellPts(0, 0, .56 * u * k, .72 * u * k, 16), { wash: '#FFFDF8', ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(lx, ly + .06 * u, .43 * u * k, .55 * u * k, 14), { wash: STU.iris, ink: null });
    paint(ellPts(lx, ly + .1 * u, .25 * u, .32 * u, 10), { wash: PAL.ink, ink: null });
    if (star) paint(starPts(lx - .16 * u, ly - .18 * u, .3 * u, .35, 4), { wash: PAL.cream, ink: null });
    else paint(ellPts(lx - .17 * u, ly - .2 * u, .15 * u, .17 * u, 8), { wash: PAL.cream, ink: null });
    paint(ellPts(lx + .15 * u, ly + .28 * u, .07 * u, .07 * u, 6), { wash: PAL.cream, ink: null });
    line([[-.64 * k, -.28 * k], [-.3 * k, -.7 * k], [.28 * k, -.74 * k], [.66 * k, -.36 * k]], 1.4, .5);   // upper lid
    line([[s * .52 * k, -.5 * k], [s * .85 * k, -.68 * k]], .9, 0);   // a lash flick at the outer corner
  };
  switch (e) {
    case 'open': open(); break;
    case 'wide': open(1.14); break;
    case 'sparkle': open(1.08, true); break;
    case 'focus':
      open();
      paint(P([[-.9, -1.05], [.9, -1.05], [.9, -.12], [-.9, -.12]]), { wash: STU.skin, ink: null });
      line([[-.72, -.1], [0, -.2], [.74, -.12]], 1.5, .4); break;
    case 'happy': line([[-.62, .2], [0, -.32], [.62, .2]], 1.5, .5); break;
    case 'closed': line([[-.62, -.05], [0, .28], [.62, -.05]], 1.3, .5); break;
    case 'squeeze': line([[.55 * -s, -.5], [-.55 * -s, 0], [.55 * -s, .45]], 1.4, 0); break;
    default: open();
  }
}
function stuBrow(s, kind, u, sw) {
  // inner end near the nose, outer end at the temple; raised = more negative y
  const k = { neutral: [0, 0], up: [-.3, -.25], down: [.32, -.05], worried: [-.35, .15], raise: s > 0 ? [-.45, -.45] : [0, 0] }[kind] || [0, 0];
  const inner = [s * .55, -.95 + k[0]], mid = [s * 1.2, -1.15 + (k[0] + k[1]) / 2], outer = [s * 1.85, -.95 + k[1]];
  paint(ribbon([inner, mid, outer].map(([a, b]) => [a * u, b * u]), .34 * u, .16 * u), { wash: STU.hair, ink: null });
}
function stuMouth(m, u, sw) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), line = (pts, w = .9, c = .6) => inkLine(P(pts), sw * w, PAL.ink, 'ink', c);
  switch (m) {
    case 'smile': line([[-.65, 1.75], [0, 2.1], [.65, 1.75]]); break;
    case 'grin':
      paint(P([[-.95, 1.7], [.95, 1.7], [.6, 2.35], [0, 2.5], [-.6, 2.35]]), { wash: STU.mouth, ink: PAL.ink, sw: sw * .6, curv: .4 });
      paint(P([[-.8, 1.75], [.8, 1.75], [.65, 1.98], [-.65, 1.98]]), { wash: PAL.cream, ink: null }); break;
    case 'o': paint(ellPts(0, 2 * u, .26 * u, .3 * u, 10), { wash: STU.mouth, ink: PAL.ink, sw: sw * .5 }); break;
    case 'O':
      paint(ellPts(0, 2.05 * u, .5 * u, .62 * u, 14), { wash: STU.mouth, ink: PAL.ink, sw: sw * .6 });
      paint(ellPts(0, 2.4 * u, .3 * u, .14 * u, 10), { wash: PAL.rose, ink: null }); break;
    case 'flat': line([[-.45, 2], [.45, 1.98]], .9, 0); break;
    case 'wobble': line([[-.6, 2], [-.3, 1.85], [0, 2], [.3, 1.85], [.6, 2]], .8, .3); break;
    case 'laugh':
      paint(P([[-1.05, 1.6], [1.05, 1.6], [.7, 2.5], [0, 2.75], [-.7, 2.5]]), { wash: STU.mouth, ink: PAL.ink, sw: sw * .6, curv: .4 });
      paint(ellPts(0, 2.45 * u, .5 * u, .2 * u, 12), { wash: PAL.rose, ink: null });
      paint(P([[-.85, 1.65], [.85, 1.65], [.7, 1.85], [-.7, 1.85]]), { wash: PAL.cream, ink: null }); break;
    case 'smirk': line([[-.55, 2], [.2, 1.98], [.7, 1.7]], .9, .5); break;
  }
}
// Smart glasses: round frames with a cyan brow line, a tiny HUD on the right lens and a light at the temple.
// earX: in profile, where the arm runs back to (face space).
function stuGlasses(u, sw, sides, earX) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  for (const s of sides) {
    const cx = s * 1.2;
    paint(rrPts((cx - .95) * u, -.42 * u, 1.9 * u, 1.55 * u, .7 * u), { ink: PAL.ink, sw: sw * .75 });
    inkLine(P([[cx + s * .55, -.4], [cx + s * .9, -.1]]), sw * .7, STU.glow, 'ink', .4);
    if (s > 0) {
      glow((cx + .45) * u, .05 * u, .9 * u, '#7FE6F5', .35);
      inkLine(P([[cx + .25, -.15], [cx + .6, -.2], [cx + .75, .1]]), sw * .45, STU.glow, 'inkfine', .5);
      paint(ellPts((cx + .45) * u, .3 * u, .07 * u, .07 * u, 6), { wash: STU.glow, ink: null });
    }
  }
  if (sides.length > 1) {
    inkLine(P([[-.2, .05], [0, -.08], [.2, .05]]), sw * .7, PAL.ink, 'ink', .5);
    for (const s of [-1, 1]) inkLine(P([[s * 2.15, .1], [s * 2.95, .2]]), sw * .7, PAL.ink, 'ink', 0);
  } else {
    inkLine(P([[.2, .1], [earX + .9, .2]]), sw * .7, PAL.ink, 'ink', 0);
    paint(rrPts((earX * .5 - .35) * u, .02 * u, .7 * u, .28 * u, .12 * u), { wash: STU.glow, ink: PAL.ink, sw: sw * .35 });   // the temple light
  }
}
// Curly hair as one outline: a bumpy crown over the top, then its lower edge (a curly fringe in front, the nape behind).
function stuHair(u, sw, view) {
  const S = {
    front: { a0: Math.PI - .15, a1: TAU + .15, edge: [[2.95, -.3], [2.7, -1.3], ...fringe(2.4, -2.4), [-2.7, -1.3], [-2.95, -.3]] },
    q: { a0: Math.PI - .5, a1: TAU + .1, edge: [[3.05, -.4], [2.85, -1.4], ...fringe(2.6, -.8), [-1.9, -.9], [-2.25, .85]] },
    side: { a0: Math.PI * .72, a1: TAU - .12, edge: [[3.05, -.9], ...fringe(2.8, .9, 3), [-.2, -1.3], [-1.05, -.55], [-1.35, .9], [-1.85, 2.1]] },
    back: { a0: Math.PI - .35, a1: TAU + .35, edge: nape() },
  }[view];
  const pts = [], n = 44;
  for (let i = 0; i <= n; i++) { const t = i / n, a = lerp(S.a0, S.a1, t), r = 3.3 + .5 * Math.abs(Math.sin(t * Math.PI * 9)); pts.push([Math.cos(a) * r * u, Math.sin(a) * r * u]); }
  for (const [a, b] of S.edge) pts.push([a * u, b * u]);
  paint(pts, { wash: STU.hair, ink: PAL.ink, sw: sw * .9, curv: .35 });
  for (let i = 0; i < 6; i++) {   // a few lighter curls
    const a = lerp(S.a0 + .4, S.a1 - .4, (i + .5) / 6), r = 2.6 - .3 * hash(i + 3), cx = Math.cos(a) * r, cy = Math.sin(a) * r;
    if (view !== 'back' && cy > -1.6) continue;
    inkLine([[cx - .35, cy + .2], [cx - .1, cy - .2], [cx + .3, cy - .1], [cx + .25, cy + .2]].map(([p, q]) => [p * u, q * u]), sw * .5, STU.hairLt, 'inkfine', .6);
  }
  function fringe(xa, xb, curls = 5) {
    const out = []; for (let i = 0; i <= 12; i++) { const t = i / 12; out.push([lerp(xa, xb, t), -2.05 + .45 * Math.abs(Math.sin(t * Math.PI * curls))]); } return out;
  }
  function nape() { const out = []; for (let i = 0; i <= 12; i++) { const t = i / 12; out.push([lerp(2.75, -2.75, t), 1.55 + .45 * Math.abs(Math.sin(t * Math.PI * 5))]); } return out; }
}

// The AI companion: a small floating robot with a screen face and an antenna. s = its radius in px.
// mood: happy, normal, blink, heart. It bobs on its own; its thruster glows under it.
function buddy(x, y, s, o = {}) {
  boilSeed('buddy ' + (o.key || 0));
  const b = Math.sin(T * 2.6 + (o.phase || 0)) * s * .12; y += b;
  const sw = clamp(s / 40, .45, 1.3);
  glow(x, y + s * 1.05, s * 1.1, '#7FE6F5', .6);
  paint([[x - s * .35, y + s * .8], [x + s * .35, y + s * .8], [x, y + s * 1.45 + Math.sin(T * 30) * s * .06]], { wash: STU.glow, ink: null });
  for (const d of [-1, 1]) paint(ellPts(x + d * s * .98, y + s * .05, s * .26, s * .42, 12), { wash: PAL.brand, ink: PAL.ink, sw: sw * .7 });
  inkLine([[x + s * .1, y - s * .92], [x + s * .3, y - s * 1.4]], sw * .8, PAL.ink, 'ink', 0);
  glow(x + s * .3, y - s * 1.45, s * .35, '#7FE6F5', .7);
  paint(ellPts(x + s * .3, y - s * 1.45, s * .13, s * .13, 8), { wash: STU.glow, ink: PAL.ink, sw: sw * .5 });
  paint(ellPts(x, y, s, s * .95, 26), { wash: '#EEF3FA', ink: PAL.ink, sw });
  paint(ellPts(x - s * .35, y - s * .45, s * .3, s * .18, 10, 0, -.5), { wash: '#FFFFFF', ink: null });
  paint(rrPts(x - s * .68, y - s * .38, s * 1.36, s * .78, s * .34), { wash: PAL.deep, ink: PAL.ink, sw: sw * .7 });
  const mood = o.mood || 'happy', blink = mood !== 'heart' && ((T * .7 + (o.phase || 0)) % 3.1) < .12;
  for (const d of [-1, 1]) {
    const ex = x + d * s * .3, ey = y + s * .02;
    if (blink || mood === 'blink') inkLine([[ex - s * .13, ey], [ex + s * .13, ey]], sw * .9, STU.glow, 'ink', 0);
    else if (mood === 'happy') inkLine([[ex - s * .14, ey + s * .06], [ex, ey - s * .1], [ex + s * .14, ey + s * .06]], sw * .9, STU.glow, 'ink', .5);
    else if (mood === 'heart') paint(heartPts(ex, ey, s * .15), { wash: '#FF7FA8', ink: null });
    else paint(ellPts(ex, ey, s * .09, s * .13, 10), { wash: STU.glow, ink: null });
  }
}
// A holographic tablet: a see-through cyan panel with a little lesson on it (a right triangle and a bar chart).
function holo(x, y, w, h, k = 1) {
  if (k <= 0) return;
  boilSeed('holo');
  glow(x, y, Math.max(w, h) * .8, '#7FE6F5', .5 * k);
  paint(rrPts(x - w / 2, y - h / 2, w, h, h * .12), { wash: '#D4F5FA', washOp: 150 * k, ink: STU.glow, sw: .9 });
  const P = pts => pts.map(([a, b]) => [x + a * w / 2, y + b * h / 2]);
  inkLine(P([[-.75, .6], [-.1, .6], [-.1, -.55], [-.75, .6]]), .8, PAL.brand, 'ink', 0);
  inkLine(P([[-.1, .45], [-.24, .45], [-.24, .6]]), .5, PAL.brand, 'inkfine', 0);
  [[.15, .3], [.35, -.1], [.55, -.45], [.75, .05]].forEach(([bx, top]) => inkLine(P([[bx, .6], [bx, top]]), 1.6, STU.glow, 'ink', 0));
  inkLine(P([[-.8, -.72], [-.2, -.72]]), .6, PAL.brand, 'inkfine', 0);
}

// The model sheet: studio.html?loop=student, or node render.mjs --loop=student --sheet=1.3 --cols=1 --w=1920 --out=docs/student.jpg
(() => {
  const label = (txt, x, y, size = 22, o = {}) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .85, weight: 600, ...o });
  const floor = (y, x0, x1) => inkLine([[x0, y + 6], [(x0 + x1) / 2, y + 4], [x1, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);
  LOOPS.student = t => {
    // the four key views
    label('نماها', 620, 42, 30);
    [['front', 'روبه‌رو'], ['q', 'سه‌رخ'], ['side', 'نیم‌رخ'], ['back', 'پشت']].forEach(([v, fa], i) => {
      const x = 180 + i * 290;
      student(x, 560, 28, { ...expr('neutral'), view: v, seed: i, aL: .12 + .03 * Math.sin(t * 2), aR: .12 - .03 * Math.sin(t * 2) });
      label(fa, x, 600);
    });
    floor(560, 40, 1160);
    // expressions, as heads
    label('حالت‌های چهره', 1590, 42, 30);
    const names = [['happy', 'شاد'], ['curious', 'کنجکاو'], ['amazed', 'شگفت‌زده'], ['focused', 'متمرکز'], ['idea', 'ایده!'], ['confused', 'گیج'], ['laugh', 'خنده'], ['wink', 'چشمک']];
    names.forEach(([n, fa], i) => {
      const x = 1810 - (i % 4) * 158, y = i < 4 ? 190 : 430, u = 17, E = expr(n, { seed: i });
      boilSeed('face ' + i);
      push(); translate(x, y); stuHead(u, E, clamp(u / 16, .45, 2.2), 'front'); pop();
      if (E.emote) emote(E.emote, x + 3.3 * u, y - 3.6 * u, u * .7, 1, t);
      label(fa, x, y + 4.4 * u, 21);
    });
    // action poses
    label('ژست‌ها', 560, 655, 30);
    const G = 1015, u2 = 19;
    // walking to class, the companion following
    const w = t * .9;
    student(170, G, u2, { ...expr('happy'), view: 'side', walk: w, dy: -Math.abs(Math.sin(w * TAU)) * .3, aR: .35 * Math.sin(w * TAU), bR: .5, seed: 1 });
    buddy(60, G - 13 * u2, 22, { mood: 'happy', key: 1 });
    // thinking with the holographic tablet, the companion helping
    student(500, G, u2, { ...expr('focused', { lookX: .6 }), aR: 1.35 + .05 * Math.sin(t * 3), bR: -.15, aL: .2, bL: .6, seed: 2 });
    holo(720, G - 9.8 * u2, 150, 100);
    buddy(360, G - 12.5 * u2, 20, { mood: 'normal', key: 2, phase: 1 });
    // a breakthrough: a jump for joy
    const k = frac(t / 1.4), hop = jump(k * 1.4, .3, .8, 2.5);
    student(880, G, u2, { ...expr('amazed'), dy: hop.dy, sq: hop.sq, aL: 2.6 + .15 * Math.sin(t * 9), aR: 2.7 - .15 * Math.sin(t * 9), bL: -.3, bR: -.3, seed: 3 });
    buddy(1010, G - 13.5 * u2, 20, { mood: 'heart', key: 3, phase: 2 });
    floor(G, 40, 1060);
    // props and colours
    label('دستیار هوشمند (ایجنت)', 1230, 655, 26);
    buddy(1230, 790, 62, { mood: 'happy', key: 4 });
    label('تبلت هولوگرافیک', 1560, 655, 26);
    holo(1560, 790, 230, 150);
    label('رنگ‌ها', 1840, 905, 26, { align: 'right' });
    [[STU.hoodie, 'هودی'], [STU.glow, 'نور'], [STU.pants, 'شلوار'], [STU.skin, 'پوست'], [STU.hair, 'مو'], [STU.shoe, 'کفش']].forEach(([c, fa], i) => {
      const x = 1840 - i * 110; boilSeed('swatch ' + i);
      paint(ellPts(x, 975, 34, 34, 20, 1), { wash: c, ink: PAL.ink, sw: .7 });
      label(fa, x, 1035, 19);
    });
  };
  LOOPS.student.len = 4;
})();
