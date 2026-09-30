// story_4_future.js — Act 4, ready for the future (138–168 s): Arman now sees a classmate's raised hand and helps her;
// the friends walk the website's growth path at dawn; the morning in his room rhymes with the night it began; and the
// name, the slogan and where to find Farda.
(() => {
  const DAWN = ['#8FB4F5', '#F5C58E'], SUN = '#FFF1D6', BRAND = [PAL.brand, PAL.cyan];

  // ---------- I1: now he's the one who sees a raised hand (138–146) ----------
  function shotHelp(t, lt, dur) {
    const TY = 830, u = 23;
    camBegin(1150, 700, 1.45 + .01 * lt);
    fardaRoom(t, { winX: 1450, posterX: 300, plantX: 620 });
    const walk = stroll(lt, 2.2, 3.6, 780, 1170, u), moving = lt > 2.2 && lt < 3.6;
    const aMood = acts(lt, [[0, 'neutral', { lookX: .3 }], [1.5, 'curious', { lookX: .9 }], [3.7, 'happy', { lookX: .8 }], [6.2, 'proud', { lookX: .7 }]]);
    student(walk.x, 985, u, { ...aMood, mouth: lt > 3.8 && lt < 5.4 ? talk(lt, 3.8, 5.4) : aMood.mouth, view: moving ? 'side' : 'front', walk: moving ? walk.walk : null,
      aR: lt > 3.9 && lt < 5.4 ? 1.1 + .08 * Math.sin(lt * 5) : .2, bR: lt > 3.9 && lt < 5.4 ? .4 : .3, aL: .2, seed: 61 });
    const hand = ease(seg(lt, .6, 1)) * (1 - ease(seg(lt, 3.8, 4.3)));
    person(1420, seatAt('mahsa', TY, u), u, { who: 'mahsa', ...acts(lt, [[0, 'confused', { lookX: .2 }], [3.8, 'thinking', { lookX: -.6, lookY: -.3 }], [5.4, 'idea', { lookX: -.5 }], [6, 'happy', { lookX: -.6 }]]),
      aL: lerp(.3, .95, hand), bL: lerp(1.8, .7, hand), aR: .3, bR: 1.8, seed: 62 });
    person(1650, seatAt('kian', TY, u), u, { who: 'kian', ...acts(lt, [[0, 'focused', { lookY: .4 }], [5.6, 'happy', { lookX: -.8 }]]), aL: .3, bL: 1.8, aR: .3, bR: 1.8, seed: 63 });
    if (lt > 4) holo(1300, 560, 170 * seg(lt, 4, 4.4), 115 * seg(lt, 4, 4.4));
    fardaTable(TY);
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, [PAL.cyan, PAL.brand]);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, DAWN);
  }

  // ---------- I2: the growth path at dawn, walking toward the future (146–154) ----------
  function shotPath(t, lt, dur) {
    const k = seg(lt, 0, dur), G = 860;
    dawnSky(lerp(.45, .9, k), 'path');
    camBegin(lerp(1250, 800, ease(k)), 540, 1);
    const sunY = lerp(780, 600, easeOut(k));
    boilSeed('path sun'); glow(300, sunY, 360, '#FFD27A', .9); paint(ellPts(300, sunY, 120, 120, 30), { wash: '#FFE3A3', ink: null });
    boilSeed('path hills');
    paint(ellPts(900, 1180, 1500, 380, 40, 2), { wash: mixCol('#3A3F8F', '#4E78C9', k), ink: PAL.ink, sw: .9 });
    paint(rectPts(-600, G, 3200, 400, 2), { wash: mixCol('#2B2E6E', '#2E6C9E', k), ink: null });
    inkLine([[-200, G], [960, G - 3], [2400, G + 1]], 1, PAL.ink, 'ink', .5);
    const lead = lerp(1900, 820, seg(lt, 0, 7.4));
    // the path lights up behind them, and each node as they reach it
    boilSeed('path line'); inkLine([[1950, G + 22], [Math.max(lead, 200), G + 22]], 2.2, PAL.cyan, 'ink', 0);
    [[1500, '۰۱ · اندیشه تحلیلی'], [1100, '۰۲ · یادگیری پروژه‌محور'], [700, '۰۳ · آمادگی برای آینده']].forEach(([nx, fa], i) => {
      if (lead > nx + 80) return;
      boilSeed('node ' + i);
      const a = clamp((nx + 80 - lead) / 120);
      glow(nx, G + 22, 90 * a, '#7FE6F5', .9); paint(ellPts(nx, G + 22, 20 * backOut(a), 20 * backOut(a), 14), { wash: PAL.cyan, ink: PAL.ink, sw: .7 });
      letter(fa, nx, G - 300 - i * 75, 34, PAL.cream, { reveal: a, weight: 700, stroke: PAL.deep });
    });
    [['kian', 600], ['mahsa', 450], ['nima', 300], ['sara', 150], ['arman', 0]].forEach(([who, dx], i) => {
      const x = lead + dx, w = (1900 - lead) / (4 * 16) + i * .2;
      person(x, G, 16, { who, ...expr('happy', { seed: i }), view: 'side', flip: true, walk: w, dy: -Math.abs(Math.sin(w * Math.PI)) * .3, aR: .35 * Math.sin(w * TAU), bR: .4, boilKey: 'walker ' + i });
    });
    buddy(lead - 60, G - 300, 26, { mood: 'happy', key: 'yara' });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, DAWN);
    cover(seg(lt, dur - .6, dur), SUN);
  }

  // ---------- J1: the same room, morning now: his own project on the screen, and a wave (154–158) ----------
  function shotMorning(t, lt, dur) {
    const DT = 720, view = lt < 1.4 ? 'back' : lt < 1.55 ? 'side' : lt < 1.7 ? 'q' : 'front';
    camBegin(960, 540, 1.05 + .01 * lt);
    boilSeed('morning wall');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: SETS.morning.wall, ink: null });
    glow(1500, 250, 700, '#FFE3A3', .6);
    desk(DT, 'morning');
    laptop(1180, DT, 620, { screen: 'project', key: 'morning' });
    const chair = () => { boilSeed('morning chair'); paint(rrPts(470, 880, 300, 320, 30), { wash: '#8C6E58', ink: PAL.ink, sw: 1 }); };
    if (view === 'q' || view === 'front') chair();
    const wave = lt > 2.2 ? 2.3 + .4 * Math.sin((lt - 2.2) * 11) : .2;
    student(620, 1008, 40, { ...acts(lt, [[0, 'happy'], [1.8, 'happy', { mouth: 'grin' }], [2.8, 'proud']]), view, smear: lt > 1.35 && lt < 1.75 ? .4 : 0, aR: view === 'front' ? wave : .2, bR: view === 'front' && lt > 2.2 ? -.2 : .3, aL: .2, seed: 71 });
    if (view === 'back' || view === 'side') chair();
    buddy(330, 420, 36, { mood: 'happy', key: 'yara' });
    camEnd();
    cover(1 - seg(lt, 0, .5), SUN);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, BRAND);
  }

  // ---------- J2: the name, the slogan, where to find us (158–168) ----------
  function shotEnd(t, lt, dur) {
    dawnSky(1, 'end');
    boilSeed('end sun'); glow(960, 760, 460, '#FFD27A', .8); paint(ellPts(960, 780, 150, 150, 30), { wash: '#FFE3A3', ink: null });
    boilSeed('end hill'); paint(ellPts(960, 1310, 1500, 420, 40, 2), { wash: '#2E6C9E', ink: PAL.ink, sw: 1 });
    [['kian', 450], ['sara', 640], ['arman', 830], ['mentor', 1060], ['mahsa', 1270], ['nima', 1460]].forEach(([who, x], i) => {
      const wv = Math.max(0, Math.sin(lt * 1.3 + i * 1.7));
      person(x, 950, 13, { who, ...expr('happy', { seed: i }), aR: .2 + 2.2 * wv + .3 * Math.sin(lt * 10) * wv, bR: -.2 * wv, boilKey: 'end ' + who });
    });
    buddy(830, 690, 20, { mood: 'heart', key: 'yara' });
    storyTitle('فردا', lt, .8, 1.8, 99, { x: 960, y: 250, size: 230, align: 'center', col: PAL.brandDk, stroke: PAL.cream, weight: 900 });
    storyTitle('از امروز به فردا بیایید', lt, 2.2, 3.2, 99, { x: 960, y: 420, size: 76, align: 'center', col: PAL.deep, stroke: PAL.cream, weight: 700 });
    storyTitle('حضوری در بابلسر · آنلاین', lt, 3.6, 4.3, 99, { x: 960, y: 515, size: 44, align: 'center', col: PAL.deep, stroke: PAL.cream, weight: 600 });
    if (lt > 4.2) letter('aifardainstitute.ir', 960, 585, 40, PAL.brandDk, { align: 'center', reveal: seg(lt, 4.2, 4.9), font: '700 40px Vazirmatn, sans-serif', stroke: PAL.cream, screen: true });
    if (lt < .3) brushWipe(.5 + lt / .6, BRAND);
    cover(seg(lt, dur - .8, dur), PAL.deep);
  }

  shots([[138, shotHelp], [146, shotPath], [154, shotMorning], [158, shotEnd]]);
})();
