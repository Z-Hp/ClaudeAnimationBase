// story_3_farda.js — Act 3, «فردا» (70–138 s): the assessment that finds what's missing and a class his size; a small
// class where his half-raised hand is already answered and a wrong answer is fine; AI used to understand, not to copy;
// building things with friends; an exam without fear; and the last pieces of the puzzle falling into place.
(() => {
  const LIGHT = '#E8FBFF', BRAND = [PAL.brand, PAL.cyan], WARM = [SETS.lamp.wallDk, SETS.lamp.wall];
  const holoPanel = (x, y, w, h, k = 1) => {   // a see-through hologram panel, for lessons over a table
    boilSeed('holo panel ' + x);
    glow(x, y, Math.max(w, h) * .75, '#7FE6F5', .45 * k);
    paint(rrPts(x - w / 2, y - h / 2, w, h, 18), { wash: '#D4F5FA', washOp: 120 * k, ink: PAL.cyan, sw: 1 });
  };
  const mark = (x, y, s, ok) => {   // a tick or a cross in the hologram
    boilSeed('mark ' + x);
    if (ok) { glow(x, y, s * 1.5, '#9FE8B0', .7); paint(ribbon([[x - s * .5, y], [x - s * .1, y + s * .4], [x + s * .6, y - s * .45]], s * .2, s * .2), { wash: '#6FC983', ink: PAL.ink, sw: .6 }); }
    else for (const d of [-1, 1]) paint(ribbon([[x - s * .45, y - d * s * .45], [x + s * .45, y + d * s * .45]], s * .16, s * .16), { wash: '#E36A6A', ink: PAL.ink, sw: .5 });
  };

  // ---------- E: the assessment and a class his size (70–82) ----------
  function shotAssess(t, lt, dur) {
    const TY = 800, u = 26;
    camBegin(965, 610, 1.38 + .006 * lt);
    fardaRoom(t);
    const talkM = talk(lt, 1.6, 4.6, 'smile');
    person(610, TY + 15, u,   // the teacher stands, so her staff badge shows above the table
      { who: 'mentor', ...acts(lt, [[0, 'neutral'], [1.5, 'happy', { lookX: .6 }], [6, 'neutral', { lookX: .7 }]]), mouth: lt < 6 ? talkM : 'smile',
      view: 'q', aR: lt > 2.4 && lt < 5.6 ? 1.15 + .05 * Math.sin(lt * 4) : .3, bR: lt > 2.4 && lt < 5.6 ? .15 : 1.6, aL: .3, bL: 1.6, seed: 11 });
    const pick = ease(seg(lt, 8.1, 8.9)), reach = ease(seg(lt, 7.6, 8.2)) * (1 - ease(seg(lt, 8.9, 9.6)));
    student(1290, seatAt('arman', TY, u), u, { ...acts(lt, [[0, 'worried', { lookX: .5 }], [3.2, 'curious', { lookX: .4, lookY: .3 }], [9.6, 'happy', { lookX: .3 }]]),
      view: 'q', flip: true, aR: lerp(.35, 1.1, reach), bR: lerp(1.9, .2, reach), aL: .35, bL: 1.9, seed: 12 });
    // the knowledge map, over the table: strong topics lit, gaps marked
    const mk = seg(lt, 1, 1.8) * (1 - seg(lt, 6, 6.6));
    if (mk > 0) { holoPanel(965, 560, 420 * mk, 330 * mk, mk); push(); translate(965, 560); scale(mk); translate(-965, -560); knowledgeMap(965, 565, 340); pop(); }
    // the class-size cards slide across; he takes the one for a small group
    [['۱ نفر', 1, 820], ['۲ تا ۳', 3, 965], ['۴ تا ۶', 6, 1110]].forEach(([fa, n, cx], i) => {
      const k = easeOut(seg(lt, 6.3 + i * .25, 7 + i * .25)); if (k <= 0) return;
      let x = lerp(700, cx, k), y = TY - 70;
      if (i === 2 && pick > 0) { x = lerp(cx, 1180, pick); y = lerp(TY - 70, TY - 190, pick); }
      if (i < 2) y += 40 * seg(lt, 9.2, 9.8);   // the others slide away
      seatCard(x, y, 100, n, fa);
    });
    // the rhyme: a room of forty becomes a table of a few
    const bk = seg(lt, 9.3, 9.8);
    if (bk > 0) {
      const bx = 1310, by = 400, m = ease(seg(lt, 10, 11.2));
      boilSeed('thought');
      paint(ellPts(bx, by, 160 * backOut(bk), 120 * backOut(bk), 26), { wash: '#FFFFFF', ink: PAL.ink, sw: .9 });
      for (let i = 0; i < 3; i++) paint(ellPts(bx - 60 - i * 26, by + 130 + i * 24, 14 - i * 3, 14 - i * 3, 10), { wash: '#FFFFFF', ink: PAL.ink, sw: .6 });
      for (let i = 0; i < 40; i++) {
        const g = [bx - 105 + (i % 8) * 30, by - 60 + Math.floor(i / 8) * 30], keep = i < 5, a = i / 5 * TAU;
        const f = keep ? [bx + Math.cos(a) * 60, by + Math.sin(a) * 45] : g;
        if (!keep && m > .6) continue;
        boilSeed('dot ' + i);
        paint(ellPts(lerp(g[0], f[0], m), lerp(g[1], f[1], m), 9 * bk, 9 * bk, 8), { wash: keep ? mixCol('#8A8FA0', PAL.brand, m) : '#8A8FA0', washOp: keep ? 255 : 255 * (1 - m), ink: null });
      }
      if (m > .5) paint(ellPts(bx, by, 26 * m, 20 * m, 14), { wash: SETS.farda.table, ink: PAL.ink, sw: .5 });
    }
    fardaTable(TY, 380, 1540);
    camEnd();
    storyTitle('فردا', lt, .3, 1.3, 3, { size: 110, col: PAL.brandDk, stroke: PAL.cream });
    cover(1 - seg(lt, 0, .5), LIGHT);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, BRAND);
  }

  // ---------- F: the small class: a hand answered before it's up, and a wrong answer that's fine (82–104) ----------
  function shotClass(t, lt, dur) {
    const TY = 830, u = 23;
    camBegin(kf(lt, [[0, 960], [6, 960], [7, 1020], [15, 1020], [16.5, 980]]), kf(lt, [[0, 620], [7, 600], [16.5, 590]]), kf(lt, [[0, 1.22], [6, 1.24], [7, 1.4], [15, 1.4], [16.5, 1.3]]));
    fardaRoom(t, { winX: 1400, posterX: 150, plantX: 1300 });
    // the lesson: a pendulum in a hologram over the table
    const PX = 960, PY = 330, amp = .35 + .25 * ease(seg(lt, 1.5, 3)) + .2 * seg(lt, 11, 12.5), ang = amp * Math.sin(t * 3.2);   // swings on t: steady whatever resync does to lt
    holoPanel(PX, 470, 420, 400);
    boilSeed('pendulum');
    const bob = [PX + Math.sin(ang) * 260, PY + Math.cos(ang) * 260];
    inkLine([[PX - 60, PY], [PX + 60, PY]], 2, PAL.brand, 'ink', 0);
    inkLine([[PX, PY], bob], 1.6, PAL.brandDk, 'ink', 0);
    glow(...bob, 60, '#FFD27A', .7); paint(ellPts(...bob, 28, 28, 16), { wash: PAL.ochre, ink: PAL.ink, sw: .8 });
    if (lt > 9 && lt < 11) mark(PX + 120, 330, 60, false);
    if (lt > 13.4 && lt < 15.5) mark(PX + 120, 330, 60, true);
    // the graph it gives them, dot by dot, and the line through the dots
    if (lt > 15) {
      const gx = PX - 150, gy = 610, gw = 300, gh = 200;
      boilSeed('class graph');
      inkLine([[gx, gy], [gx + gw, gy]], 1.2, PAL.brandDk, 'ink', 0); inkLine([[gx, gy], [gx, gy - gh]], 1.2, PAL.brandDk, 'ink', 0);
      for (let i = 0; i < 5; i++) { const k = seg(lt, 15.5 + i * .5, 15.8 + i * .5); if (k > 0) paint(ellPts(gx + (i + 1) * gw / 6, gy - Math.sqrt((i + 1) / 6) * gh, 7 * backOut(k), 7 * backOut(k), 8), { wash: PAL.ochre, ink: PAL.ink, sw: .4 }); }
      const lk = ease(seg(lt, 18, 19));
      if (lk > 0) { const P = []; for (let i = 0; i <= 20 * lk; i++) P.push([gx + i / 20 * gw, gy - Math.sqrt(i / 20) * gh]); if (P.length > 1) { inkLine(P, 1.8, PAL.cyan, 'ink', .5); glow(...P[P.length - 1], 40, '#7FE6F5', .8); } }
    }
    // the class, behind the table: Kian, Sara, the teacher, Arman, Mahsa, Nima
    const all = lt > 19 ? 'amazed' : 'happy';
    person(230, seatAt('kian', TY, u), u, { who: 'kian', ...acts(lt, [[0, 'neutral', { lookX: .8 }], [19.1, 'amazed', { lookX: .9 }]]), aL: .3, bL: 1.8, aR: .3, bR: 1.8, seed: 21 });
    const sReach = ease(seg(lt, 1.3, 1.8)) * (1 - ease(seg(lt, 3, 3.5)));
    person(450, seatAt('sara', TY, u), u, { who: 'sara', ...acts(lt, [[0, 'curious', { lookX: .8 }], [9.4, 'happy', { lookX: .9 }], [19.2, all, { lookX: .8 }]]), aR: lerp(.3, 1.6, sReach), bR: lerp(1.8, .1, sReach), aL: .3, bL: 1.8, seed: 22 });
    const mTurn = lt > 6.3;
    person(680, TY + 15, u,   // standing, beside the lesson
      { who: 'mentor', ...acts(lt, [[0, 'happy', { lookX: .5 }], [6.3, 'curious', { lookX: 1, mouth: 'smile' }], [9.5, 'happy', { lookX: .9 }], [10.6, 'neutral', { lookX: .6 }], [19.3, 'proud']]),
      mouth: lt > 10.6 && lt < 12.6 ? talk(lt, 10.6, 12.6) : undefined, view: mTurn ? 'q' : 'front', aR: lt > 10.6 && lt < 12.8 ? 1.2 : .3, bR: lt > 10.6 && lt < 12.8 ? .2 : 1.8, aL: .3, bL: 1.8, tilt: mTurn ? .05 : 0, seed: 23 });
    const up = ease(seg(lt, 6, 6.5)) * (1 - ease(seg(lt, 7.2, 7.8)));
    const aMood = acts(lt, [[0, 'curious', { lookX: -.5 }], [6.6, 'amazed', { lookX: -.8 }], [7.1, 'happy', { lookX: -.8 }], [9.2, 'embarrassed'], [11.2, 'thinking', { lookX: -.6 }], [13.2, 'idea', { lookX: -.5 }], [14.2, 'happy', { lookX: -.6 }], [19.2, 'amazed', { lookX: -.5 }]]);
    const armanG = seatAt('arman', TY, u);
    student(1240, armanG, u, { ...aMood, mouth: lt > 7.4 && lt < 9 ? talk(lt, 7.4, 9, 'grin') : aMood.mouth, aR: lerp(.35, 1.45, up), bR: lerp(1.9, .2, up), aL: .35, bL: 1.9, seed: 24 });
    person(1470, seatAt('mahsa', TY, u), u, { who: 'mahsa', ...acts(lt, [[0, 'neutral', { lookX: -.7 }], [9.4, 'happy', { lookX: -.6 }], [19.2, all, { lookX: -.7 }]]), aL: .3, bL: 1.8, aR: .3, bR: 1.8, seed: 25 });
    person(1690, seatAt('nima', TY, u), u, { who: 'nima', ...acts(lt, [[0, 'curious', { lookX: -.8 }], [9.4, 'happy', { lookX: -.8 }], [19.2, all, { lookX: -.8 }]]), aL: .3, bL: 1.8, aR: .3, bR: 1.8, seed: 26 });
    pieceSnap(t, 1240 - 150, armanG - 13 * u, 38, seg(lt, 20, 20.8), 1);
    fardaTable(TY);
    const eye = toScreen(1240, armanG - 11.7 * u);
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, BRAND);
    if (lt > dur - .6) iris(...eye, lerp(1500, 0, easeIn(seg(lt, dur - .6, dur - .05))), SETS.lamp.wallDk);
  }

  // ---------- G: AI, the right way: not the answer, the steps; and checking them (104–116) ----------
  function shotAI(t, lt, dur) {
    const DT = 790, u = 30, x = 900, G = seatAt('arman', DT, u);
    camBegin(1010, 600, 1.5 + .01 * lt);
    room(t, 'lamp', { lampX: 520 });
    const mood = acts(lt, [[0, 'neutral', { lookX: .8 }], [2.5, 'thinking', { lookX: .8 }], [3.2, 'determined', { lookX: .8 }], [4.4, 'curious', { lookX: .8 }],
                          [6, 'focused', { lookX: -.3, lookY: .5 }], [8.6, 'idea', { lookX: .8 }], [9.4, 'laugh'], [11, 'happy', { lookX: .6 }]]);
    const shove = ease(seg(lt, 3.2, 3.5)) * (1 - ease(seg(lt, 3.6, 4.2))), book = ease(seg(lt, 5.8, 6.2)), point = ease(seg(lt, 8.5, 8.8)) * (1 - ease(seg(lt, 9.8, 10.3)));
    const look = lt > 6 && lt < 8.5 ? (Math.floor((lt - 6) / .7) % 2 ? { lookX: .8, lookY: -.2 } : { lookX: -.3, lookY: .5 }) : {};
    student(x, G, u, { ...mood, ...look, mouth: (lt < 2.4 || (lt > 3.7 && lt < 4.5)) ? talk(lt, 0, 4.5) : mood.mouth,
      aR: lerp(lerp(.35, 1.3, shove), 1.3, point), bR: lerp(lerp(1.95, .1, shove), .15, point), aL: lerp(.35, .5, book), bL: lerp(1.95, 1.5, book), seed: 31,
      handL: book > .5 ? (uu, sw) => { push(); rotate(-.3); translate(0, uu * .6); paint([[-1.6 * uu, 0], [0, .3 * uu], [1.6 * uu, 0], [1.6 * uu, 2 * uu], [0, 2.2 * uu], [-1.6 * uu, 2 * uu]], { wash: PAL.cream, ink: PAL.ink, sw: sw * .7 }); inkLine([[0, .3 * uu], [0, 2.2 * uu]], sw * .5, PAL.ink, 'inkfine', 0); pop(); } : null });
    // Yara, and what it shows: first a ready-made answer (pushed away), then the steps, one by one
    buddy(1360, 470, 40, { mood: lt < 4.6 ? 'normal' : lt > 9 && lt < 10.5 ? 'shy' : 'happy', key: 'yara' });
    const ans = seg(lt, .8, 1.3), fly = easeIn(seg(lt, 3.3, 4));
    if (ans > 0 && fly < 1) examPaper(lerp(1180, 1700, fly), lerp(470, 300, fly), 170 * backOut(ans) * (1 - fly * .6), { mark: null });
    const steps = seg(lt, 4.6, 5);
    if (steps > 0) {
      holoPanel(1130, 480, 260 * steps, 300 * steps, steps);
      for (let i = 0; i < 3; i++) {
        const k = seg(lt, 4.8 + i * .6, 5.1 + i * .6); if (k <= 0) continue;
        boilSeed('step ' + i);
        const bad = i === 1 && lt > 8.6, y = 390 + i * 90;
        paint(rrPts(1030, y - 30, 200, 60, 12), { wash: bad ? '#F6C9C9' : '#EEF3FA', ink: bad ? '#E36A6A' : PAL.cyan, sw: bad ? 1.6 : 1 });
        paint(ellPts(1060, y, 16, 16, 12), { wash: bad ? '#E36A6A' : PAL.brand, ink: null });
        inkLine([[1090, y], [1090 + 110 * k, y]], 1.2, '#6E7690', 'inkfine', 0);
      }
    }
    pieceSnap(t, x - 150, G - 13.5 * u, 40, seg(lt, 11, 11.7), 2);
    laptopBack(1330, DT, 300, SETS.lamp.light, .7);
    desk(DT, 'lamp', { lampX: 520 });
    const eye = toScreen(x, G - 11.7 * u);
    camEnd();
    if (lt < .6) iris(...eye, lerp(0, 1500, easeIn(lt / .6)), SETS.lamp.wallDk);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [PAL.brand, PAL.ochre]);
  }

  // ---------- H1–H3: building things together (116–126) ----------
  function shotBuild(t, lt, dur) {
    const TY = 800, u = 26, k = i => seg(lt, .3 + i * .5, .6 + i * .5);
    camBegin(1000, 600, 1.3 + .02 * lt);
    fardaRoom(t);
    person(600, seatAt('nima', TY, u), u, { who: 'nima', ...acts(lt, [[0, 'focused', { lookX: .6, lookY: .5 }], [2, 'excited', { lookX: .6 }]]), aR: .9, bR: 1.3 + .2 * Math.sin(lt * 6), aL: .3, bL: 1.8, seed: 41 });
    student(1290, seatAt('arman', TY, u), u, { ...acts(lt, [[0, 'focused', { lookX: -.6, lookY: .5 }], [2, 'excited', { lookX: -.5 }]]), aL: 1, bL: 1.2 + .2 * Math.sin(lt * 7), aR: .35, bR: 1.9, seed: 42 });
    person(1560, seatAt('kian', TY, u), u, { who: 'kian', ...acts(lt, [[0, 'focused', { lookX: -.7, lookY: .5 }], [2, 'happy', { lookX: -.7 }]]), aL: .3, bL: 1.8, aR: .3, bR: 1.8, seed: 43 });
    // the little robot they build: body, wheels, head, then its eyes light up
    const RX = 960, RY = TY - 20;
    boilSeed('robot');
    if (k(0) > 0) paint(rrPts(RX - 70, RY - 110 - 40 * (1 - backOut(k(0))), 140, 100, 16), { wash: PAL.brand, ink: PAL.ink, sw: 1 });
    if (k(1) > 0) for (const d of [-1, 1]) paint(ellPts(RX + d * 55, RY - 10, 22 * backOut(k(1)), 22 * backOut(k(1)), 14), { wash: '#3A3F52', ink: PAL.ink, sw: .8 });
    if (k(2) > 0) paint(rrPts(RX - 45, RY - 190 - 30 * (1 - backOut(k(2))), 90, 70, 14), { wash: '#EEF3FA', ink: PAL.ink, sw: .9 });
    if (k(3) > 0) { for (const d of [-1, 1]) { glow(RX + d * 20, RY - 158, 30, '#7FE6F5', k(3)); paint(ellPts(RX + d * 20, RY - 158, 8, 8, 10), { wash: PAL.cyan, ink: null }); } inkLine([[RX, RY - 190], [RX + 10, RY - 230]], 1.2, PAL.ink, 'ink', 0); sparkleAt(RX + 12, RY - 236, 60, seg(lt, 1.9, 2.4)); }
    fardaTable(TY, 300, 1800);
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, [PAL.brand, PAL.ochre]);
    if (lt > dur - .25) brushWipe((lt - (dur - .25)) / .5, [PAL.cyan, PAL.brand]);
  }
  function shotCode(t, lt, dur) {
    const TY = 800, u = 26;
    camBegin(970, 600, 1.32 + .02 * lt);
    fardaRoom(t, { winX: 150, posterX: 1450, plantX: 1350 });
    student(700, seatAt('arman', TY, u), u, { ...acts(lt, [[0, 'focused', { lookX: .6, lookY: .4 }], [2.1, 'happy', { lookX: .5 }]]), aR: 1, bR: 1.4 + .15 * Math.sin(lt * 14), aL: .35, bL: 1.9, seed: 44 });
    person(1240, seatAt('sara', TY, u), u, { who: 'sara', ...acts(lt, [[0, 'curious', { lookX: -.6, lookY: .4 }], [2.1, 'excited', { lookX: -.4 }]]), mouth: lt < 2 ? talk(lt, .2, 2) : undefined, aL: 1.1, bL: .4, aR: .3, bR: 1.8, seed: 45 });
    fardaTable(TY, 300, 1620);
    laptop(970, TY + 4, 300, { screen: 'code', progress: seg(lt, .1, 1.9), run: seg(lt, 2, 2.4), key: 'code' });
    camEnd();
    if (lt < .25) brushWipe(.5 + lt / .5, [PAL.cyan, PAL.brand]);
    if (lt > dur - .25) brushWipe((lt - (dur - .25)) / .5, [PAL.ochre, PAL.brand]);
  }
  function shotShow(t, lt, dur) {
    camBegin(1000, 620, 1.2 + .01 * lt);
    fardaRoom(t, { winX: 1500 });
    // the big screen: their project, playing
    boilSeed('big screen');
    paint(rectPts(700, 170, 800, 460), { wash: '#16203F', ink: PAL.ink, sw: 1.4 });
    for (let i = 0; i < 12; i++) paint(starPts(720 + hash(i) * 760, 190 + hash(i + 5) * 420, 3 + 2 * hash(i + 2), .4, 4), { wash: PAL.cream, ink: null });
    const rx = 800 + ((lt * 180) % 700), ry = 420 - 80 * Math.sin(lt * 1.5);
    glow(rx - 70, ry, 60, '#FFB45E', .8);
    paint(rrPts(rx - 60, ry - 26, 120, 52, 22), { wash: PAL.cream, ink: PAL.ink, sw: .8 }); paint([[rx + 60, ry - 26], [rx + 100, ry], [rx + 60, ry + 26]], { wash: PAL.nebula, ink: PAL.ink, sw: .8 });
    student(520, 960, 26, { ...acts(lt, [[0, 'happy', { lookX: .6 }], [2.2, 'proud']]), mouth: lt < 2 ? talk(lt, 0, 2, 'grin') : undefined, aR: lt < 2.2 ? 1.5 : .3, bR: lt < 2.2 ? .1 : .3, aL: .2, seed: 46 });
    person(1650, 960, 22, { who: 'mentor', ...acts(lt, [[0, 'happy', { lookX: -.8 }], [2, 'proud']]), aL: 1.2 + .1 * Math.sin(lt * 5), bL: .3, aR: .3, bR: 1.5, seed: 47,
      handL: (uu, sw) => paint(rrPts(-uu, -.7 * uu, 2 * uu, 1.4 * uu, .15 * uu), { wash: '#2B2F45', ink: PAL.ink, sw: sw * .6 }) });
    // the creative-solution star flies from the teacher's tablet to Arman
    const sk = ease(seg(lt, 2, 2.8));
    if (sk > 0) { const p = arcPt([1560, 560], [560, 700], 220, sk); starBadge(p[0], p[1], 60 * (1 + .3 * Math.sin(sk * Math.PI))); }
    // classmates in the front row, from behind, clapping
    [['sara', 760], ['nima', 1000], ['mahsa', 1240], ['kian', 1480]].forEach(([who, x], i) => {
      const L = LOOKS[who], clap = Math.abs(Math.sin(lt * 9 + i)) * 12;
      crowdBack(x, 1180, 17, L, 'front row ' + i);
      boilSeed('clap ' + i);
      for (const d of [-1, 1]) paint(ellPts(x + d * (12 + clap), 1180 - 9.6 * 17, 13, 15, 10), { wash: L.skin, ink: PAL.ink, sw: .5 });
    });
    camEnd();
    if (lt < .25) brushWipe(.5 + lt / .5, [PAL.ochre, PAL.brand]);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, BRAND);
  }

  // ---------- H4–H5: an exam without fear, and the puzzle complete (126–138) ----------
  function shotExam(t, lt, dur) {
    if (lt >= 7 && lt < 9) {   // the paper, close: right, with the star
      boilSeed('exam desk'); paint(rectPts(-1500, -1500, W + 3000, H + 3000), { wash: SETS.farda.table, ink: null });
      for (let i = -6; i < 15; i++) inkLine([[-50, 120 + i * 130], [W + 50, 130 + i * 130]], .6, SETS.farda.tableDk, 'inkfine', .3);
      examPaper(960, 560, 820, { mark: lt > 7.5 ? 'good' : null });
      return;
    }
    const TY = 820, u = 30, x = 960, G = seatAt('arman', TY, u), headY = G - 11.7 * u;
    camBegin(960, 580, 1.35 + .01 * lt);
    fardaRoom(t, { posterX: 1500, winX: 120 });
    const mood = acts(lt, [[0, 'focused', { lookY: .6 }], [1.4, 'confident', { lookY: .5 }], [9, 'happy'], [10.6, 'amazed', { lookY: -.5 }]]);
    const writing = lt > 2 && lt < 7;
    student(x, G, u, { ...mood, aR: writing ? .55 + .05 * Math.sin(lt * 11) : .4, bR: writing ? 1.6 + .1 * Math.sin(lt * 17) : 1.9, aL: .4, bL: 1.9, seed: 51,
      handR: writing ? (uu, sw) => paint(ribbon([[0, .2 * uu], [.1 * uu, 1.6 * uu]], .22 * uu, .12 * uu), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .5 }) : null });
    mindPuzzle(t, x, headY - 30, 40, 3, seg(lt, 9.2, 11), 6);
    fardaTable(TY, 560, 1360);
    boilSeed('exam sheet on desk');
    paint([[860, TY - 6], [1060, TY - 6], [1090, TY + 20], [830, TY + 20]], { wash: PROP.paper, ink: PAL.ink, sw: .7 });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, BRAND);
    cover(seg(lt, 11.5, 12), LIGHT);
  }

  // ---------- F2 (song only): «تکه‌تکه، پازلِ ذهنت آروم سرِ جاش چیده می‌شه»: inside his mind, piece by piece ----------
  // Four of the six pieces land, one a bar, each a subject Farda teaches; two places stay open for the exam to fill.
  const ICONS = [
    (x, y, s) => { inkLine([[x - s * .3, y], [x + s * .3, y]], s / 30, PAL.deep, 'ink', 0); inkLine([[x, y - s * .3], [x, y + s * .3]], s / 30, PAL.deep, 'ink', 0);   // maths: + and √
                   inkLine([[x - s * .42, y + s * .12], [x - s * .34, y + s * .22], [x - s * .22, y - s * .34], [x + s * .1, y - s * .34]], s / 50, PAL.brandDk, 'inkfine', 0); },
    (x, y, s) => { for (let i = 0; i < 3; i++) { push(); translate(x, y); rotate(i * Math.PI / 3); paint(ellPts(0, 0, s * .36, s * .13, 24), { ink: PAL.deep, sw: s / 90 }); pop(); }   // physics: an atom
                   paint(ellPts(x, y, s * .06, s * .06, 10), { wash: PAL.nebula, ink: null }); },
    (x, y, s) => buddy(x, y + s * .05, s * .16, { mood: 'happy', key: 'mind yara' }),   // AI: Yara
    (x, y, s) => { for (const d of [-1, 1]) inkLine([[x + d * s * .18, y - s * .2], [x + d * s * .36, y], [x + d * s * .18, y + s * .2]], s / 34, PAL.deep, 'ink', 0);   // code: </>
                   inkLine([[x + s * .07, y - s * .26], [x - s * .07, y + s * .26]], s / 34, PAL.brand, 'ink', 0); },
  ];
  function shotMindPieces(t, lt, dur) {
    const s = 190, CX = 960, CY = 560, BAR = 4 * BEAT;
    camBegin(960, 540, 1 + .012 * lt);
    boilSeed('mind space');
    paint(rectPts(-1300, -1300, W + 2600, H + 2600), { wash: PAL.deep, ink: null });
    glow(CX, CY, 700, PAL.cosmos, .6); glow(CX, CY, 380, '#7FE6F5', .25 + .2 * seg(lt, 0, dur));
    for (let i = 0; i < 40; i++) { boilSeed('mind star ' + i); paint(starPts(hash(i) * W, hash(i + 70) * H, 2 + 3 * hash(i + 3), .35, 4), { wash: PAL.cream, washOp: 90 + 120 * hash(i + 9), ink: null }); }
    const KN = [[0, 1, -1, 0], [0, 0, 1, -1], [0, -1, 1, 1], [1, -1, 0, 0], [-1, 0, 0, 1], [1, 1, 0, -1]], ORDER = [0, 4, 2, 3];
    for (let i = 0; i < 6; i++) {
      const gx = CX + ((i % 3) - 1) * s * .98, gy = CY - s * .5 + Math.floor(i / 3) * s * .98, n = ORDER.indexOf(i);
      boilSeed('mind slot ' + i);
      paint(rrPts(gx - s * .42, gy - s * .42, s * .84, s * .84, 16), { ink: mixCol('#7FE6F5', PAL.deep, .45), sw: 1 });   // every place, waiting
      if (n < 0) { letter('؟', gx, gy, 70, '#7FE6F5', { alpha: .5, ink: false, weight: 700 }); continue; }
      const k = seg(lt, .15 + n * BAR, .15 + n * BAR + 1.1); if (k <= 0) continue;
      const from = [[-300, 200], [W + 300, 900], [W + 200, 100], [-200, 1000]][n], e = easeOut(k);
      const p = [lerp(from[0], gx, e), lerp(from[1], gy, e) - Math.sin(e * Math.PI) * 120];
      if (k >= 1) sparkleAt(gx, gy - s * .5, 70, seg(lt, .15 + n * BAR + 1.1, .15 + n * BAR + 1.6));
      puzzlePiece(p[0], p[1], s, { rot: (1 - e) * (2 + n), lit: k >= 1, knobs: KN[i] });
      push(); translate(p[0], p[1]); rotate((1 - e) * (2 + n)); ICONS[n](0, 0, s); pop();
    }
    camEnd();
    if (lt < .6) iris(960, 540, lerp(0, 1500, easeIn(lt / .6)), SETS.lamp.wallDk);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, BRAND);
  }
  SHOT_FNS.mindPieces = shotMindPieces;

  shots([[70, shotAssess], [82, shotClass], [104, shotAI], [116, shotBuild], [119.3, shotCode], [122.6, shotShow], [126, shotExam]]);
})();
