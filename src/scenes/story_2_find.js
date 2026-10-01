// story_2_find.js — Act 2, finding Farda (52–70 s): a search, the website's four doors, the free spring simulator he
// tries for himself, and the moment it clicks: the first piece lands and Yara wakes up.
(() => {
  const LIGHT = '#E8FBFF';

  // ---------- D1: the search (52–57) ----------
  function shotSearch(t, lt, dur) {
    const S = screenFrame({ screen: '#F2F4FA' });
    boilSeed('browser bar');
    paint(rectPts(S.x, S.y, S.w, 60), { wash: '#D5DAE6', ink: null });
    [0, 1, 2].forEach(i => paint(ellPts(S.x + 40 + i * 34, S.y + 30, 10, 10, 10), { wash: ['#E27A92', '#E8AA38', '#6E9F58'][i], ink: null }));
    const bx0 = S.x + 300, bx1 = S.x + S.w - 300, by = S.y + 130;
    boilSeed('search box');
    paint(rrPts(bx0, by, bx1 - bx0, 90, 45), { wash: '#FFFFFF', ink: lt > .2 ? PAL.cyan : '#B9BDC8', sw: 1.2 });
    paint(ellPts(bx0 + 55, by + 45, 18, 18, 14), { ink: '#8A93A8', sw: 1 }); inkLine([[bx0 + 68, by + 58], [bx0 + 80, by + 70]], 1.2, '#8A93A8', 'ink', 0);
    const typed = seg(lt, .3, 2);
    letter('فهمیدنِ واقعی', bx1 - 50, by + 45, 46, PAL.ink, { align: 'right', reveal: typed, ink: false, weight: 600, screen: true });
    if (lt < 2.3 && Math.floor(lt * 3) % 2 === 0) inkLine([[bx1 - 50 - 330 * typed - 8, by + 22], [bx1 - 50 - 330 * typed - 8, by + 68]], 1, PAL.ink, 'inkfine', 0);
    // the results: grey, grey, and one that lights up
    for (let i = 0; i < 4; i++) {
      const k = seg(lt, 2.2 + i * .12, 2.5 + i * .12); if (k <= 0) continue;
      boilSeed('result ' + i);
      const y = S.y + 290 + i * 150, hot = i === 2 && lt > 3;
      if (hot) glow(960, y + 55, 520, '#7FE6F5', .5);
      paint(rrPts(bx0, y + 30 * (1 - k), bx1 - bx0, 115, 16), { wash: hot ? '#E6FAFD' : '#E3E6EE', ink: hot ? PAL.cyan : '#C3C8D4', sw: hot ? 1.6 : .8 });
      for (let j = 0; j < 2; j++) inkLine([[bx1 - 180, y + 40 + j * 36], [bx0 + 120 + 200 * hash(i + j), y + 40 + j * 36]], 1.4, hot ? PAL.brand : '#AEB5C6', 'inkfine', 0);
      if (hot) fardaMark(bx1 - 90, y + 57, 48, PAL.brand);
    }
    pointerAt(lt, 3.4, 4.3, [900, 1000], [1250, S.y + 290 + 2 * 150 + 60]);
  }

  // ---------- D2: the website's four doors; the simulators' door opens (57–62) ----------
  function shotDoors(t, lt, dur) {
    const dive = easeIn(seg(lt, 3.2, 5)), DX = 1160, DY = 640;
    camBegin(lerp(960, DX, dive), lerp(540, DY, dive), 1 + 5 * dive);
    const S = screenFrame({ screen: '#0B0F19' });
    for (let i = 0; i < 30; i++) { boilSeed('site star ' + i); paint(starPts(S.x + hash(i) * S.w, S.y + hash(i + 40) * S.h, 2 + 3 * hash(i + 9), .35, 4), { wash: PAL.cream, washOp: 180, ink: null }); }
    glow(960, S.y + 110, 200, '#7FE6F5', .5);
    fardaMark(960, S.y + 110, 90, '#9FEAF6');
    const doors = [[1500, PAL.brand, 'دوره‌ها'], [1160, PAL.cyan, 'شبیه‌سازها'], [820, PAL.nebula, 'جدیدترین دوره'], [480, PAL.cosmos, 'آشنایی با ما']];
    doors.forEach(([x, col, fa], i) => {
      boilSeed('door ' + i);
      const w = 250, h = 380, y = DY, hot = i === 1 && lt > .6;
      if (hot) glow(x, y, 330, '#7FE6F5', .7);
      paint(rrPts(x - w / 2 - 14, y - h / 2 - 14, w + 28, h + 28, 18), { wash: '#1F2742', ink: PAL.ink, sw: 1 });
      const open = i === 1 ? ease(seg(lt, 2, 3.2)) : 0;
      if (open > 0) { glow(x, y, 300, '#FFF6D6', 1); paint(rectPts(x - w / 2, y - h / 2, w, h), { wash: '#FFF8E6', ink: null }); }
      const dw = w * (1 - .9 * open);   // the door swings open on its left hinge (drawn flat: it narrows)
      paint(rectPts(x - w / 2, y - h / 2, dw, h), { wash: mixCol(col, PAL.ink, open * .35), ink: PAL.ink, sw: 1 });
      paint(ellPts(x - w / 2 + dw * .85, y + 20, 10, 10, 10), { wash: PAL.ochre, ink: PAL.ink, sw: .6 });
      letter(fa, x, y + h / 2 + 50, 34, hot ? '#9FEAF6' : PAL.cream, { ink: false, weight: 600 });
    });
    camEnd();
    pointerAt(lt, .9, 1.8, [700, 1000], [1180, 700]);
    cover(seg(lt, 4.4, 5), LIGHT);
  }

  // ---------- D3: the spring simulator: one weight, then two; the stretch doubles (62–66) ----------
  function shotSim(t, lt, dur) {
    const S = screenFrame({ screen: '#16203F' });
    const top = S.y + 110, x = 760, drop = lt - 1, n = lt < 1.35 ? 1 : 2;
    const L = 200 + 110 * (lt < 1.35 ? 1 : 2 - Math.exp(-(lt - 1.35) * 5) * Math.cos((lt - 1.35) * 14));
    boilSeed('sim stand');
    inkLine([[x - 200, top], [x + 200, top]], 4, PAL.cream, 'ink', 0);
    inkLine([[x - 170, top], [x - 170, top + 700]], 3, '#8A93A8', 'ink', 0);
    const coil = []; for (let i = 0; i <= 30; i++) coil.push([x + (i % 2 ? 1 : -1) * 34 * (i > 0 && i < 30), top + L * i / 30]);
    inkLine(coil, 2.4, PAL.cyan, 'ink', 0);
    glow(x, top + L / 2, 180, '#7FE6F5', .35);
    boilSeed('sim weights');
    paint(rrPts(x - 55, top + L, 110, 80, 12), { wash: PAL.ochre, ink: PAL.ink, sw: 1 });
    if (n > 1) paint(rrPts(x - 55, top + L + 84, 110, 80, 12), { wash: PAL.ochre, ink: PAL.ink, sw: 1 });
    else if (drop > 0) { const p = arcPt([x + 380, top - 60], [x, top + L + 84], 120, easeIn(seg(lt, 1, 1.35))); paint(rrPts(p[0] - 55, p[1], 110, 80, 12), { wash: PAL.ochre, ink: PAL.ink, sw: 1 }); }
    boilSeed('sim ruler');
    for (let i = 0; i <= 12; i++) inkLine([[x + 160, top + 200 + i * 45], [x + (i % 2 ? 185 : 200), top + 200 + i * 45]], 1, PAL.cream, 'inkfine', 0);
    inkLine([[x + 160, top + 200], [x + 160, top + 740]], 1.2, PAL.cream, 'ink', 0);
    // the graph: two points and the straight line through them (every 100 g, the same stretch)
    const gx = 1180, gy = S.y + S.h - 140, gw = 440, gh = 420;
    boilSeed('sim graph');
    inkLine([[gx, gy], [gx + gw, gy]], 1.5, PAL.cream, 'ink', 0); inkLine([[gx, gy], [gx, gy - gh]], 1.5, PAL.cream, 'ink', 0);
    const pts = [[gx + gw * .4, gy - gh * .4], [gx + gw * .8, gy - gh * .8]];
    pts.forEach(([px, py], i) => { const k = seg(lt, .5 + i * 1.3, .8 + i * 1.3); if (k > 0) { glow(px, py, 40, '#FFD27A', .8 * k); paint(ellPts(px, py, 13 * backOut(k), 13 * backOut(k), 12), { wash: PAL.ochre, ink: PAL.ink, sw: .6 }); } });
    const lk = ease(seg(lt, 2.6, 3.4));
    if (lk > 0) { inkLine([[gx, gy], [lerp(gx, gx + gw * .95, lk), lerp(gy, gy - gh * .95, lk)]], 2, PAL.cyan, 'ink', 0); glow(lerp(gx, gx + gw * .95, lk), lerp(gy, gy - gh * .95, lk), 60, '#7FE6F5', .8); }
    cover(1 - seg(lt, 0, .45), LIGHT);
  }

  // ---------- D4: it clicks: the first piece lands, and Yara wakes up (66–70) ----------
  function shotClick(t, lt, dur) {
    const DT = 790, u = 30, x = 900, G = seatAt('arman', DT, u), headY = G - 11.7 * u;
    camBegin(1010, 600, 1.55 + .03 * lt);
    room(t, 'night');
    glow(1100, 520, 700, '#7FE6F5', .35);   // the screen's new light, cyan now
    const mood = acts(lt, [[0, 'curious', { lookX: .85 }], [.7, 'idea', { lookX: .7 }], [3, 'amazed', { lookX: .9, lookY: -.4 }]]);
    student(x, G, u, { ...mood, aL: .35, bL: 1.95, aR: .35, bR: 1.95, seed: 6 });
    pieceSnap(t, x - 150, headY - 60, 44, seg(lt, 1.2, 2), 0);
    if (lt > 2) sparkleAt(x - 150, headY - 60, 90, seg(lt, 2, 2.5));
    const rise = ease(seg(lt, 2.1, 3));
    if (rise > 0) buddy(1230, lerp(DT + 30, DT - 260, rise), 42, { mood: lt < 2.9 ? 'blink' : 'happy', key: 'yara' });
    laptopBack(1250, DT, 330, '#9FEAF6', 1.4);
    desk(DT, 'night');
    camEnd();
    cover(seg(lt, 3.55, 4), LIGHT);
  }

  shots([[52, shotSearch], [57, shotDoors], [62, shotSim], [66, shotClick]]);
})();
