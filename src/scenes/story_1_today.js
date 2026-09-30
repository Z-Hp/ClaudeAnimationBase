// story_1_today.js — Act 1, «امروز» (0–52 s): a night of an offline video nobody answers, a crowded class where
// nobody sees his raised hand, and a desk at night with the pieces of what he's learned that won't fit together.
(() => {
  const GREY = ['#8E929E', '#A3A7B2'], NIGHT = [SETS.night.wallDk, SETS.night.wall];
  const phoneFlat = (x, y, buzz) => {   // a phone lying on the desk, lighting up with a notification
    boilSeed('flat phone');
    const j = buzz > 0 ? Math.sin(T * 60) * 2 * buzz : 0;
    if (buzz > 0) glow(x, y - 10, 90 * buzz, '#FF8FB0', .8 * buzz);
    paint(rrPts(x - 55 + j, y - 20, 110, 20, 6), { wash: buzz > 0 ? '#3A2A40' : '#1E2133', ink: PAL.ink, sw: .8 });
    if (buzz > 0) paint(rrPts(x - 40 + j, y - 17, 80, 8, 3), { wash: '#FF8FB0', ink: null });
  };

  // ---------- A1: the room at night, the offline video (0–14) ----------
  function shotNight(t, lt, dur) {
    if (lt >= 4 && lt < 6.5) return lectureInsert(t, lt - 4);
    const DT = 790, u = 30, x = 900, G = seatAt('arman', DT, u);
    camBegin(1010 + 10 * Math.sin(lt * .5), 620, kf(lt, [[0, 1.5], [dur, 1.6]]));
    room(t, 'night');
    const mood = acts(lt, [[0, 'focused', { lookX: .75, lookY: .2 }], [6.6, 'sleepy'], [9.6, 'amazed', { eyes: 'wide', mouth: 'o', blush: .2 }],
                          [10.4, 'distracted'], [12.7, 'focused', { lookX: .75, lookY: .2 }], [13.4, 'confused', { lookX: .75 }]]);
    const nod = .7 * ease(seg(lt, 7, 9.4)) * (lt < 9.6 ? 1 : Math.exp(-(lt - 9.6) * 10)) + .12 * Math.sin(lt * 1.3) * seg(lt, 6.6, 7);
    const raise = ease(seg(lt, 13.75, 14.3));
    student(x, G, u, { ...mood, dy: (mood.dy || 0) + nod, tilt: (mood.tilt || 0) + nod * .15, aL: .35, bL: 1.95, aR: lerp(.35, 1.3, raise), bR: lerp(1.95, .3, raise), seed: 1 });
    laptopBack(1250, DT, 330, SETS.night.light, 1);
    desk(DT, 'night');
    phoneFlat(560, DT, lt > 10.2 && lt < 12.8 ? 1 - seg(lt, 12.4, 12.8) : 0);
    camEnd();
    storyTitle('امروز', lt, .8, 1.8, 3.6, { size: 110 });
    cover(1 - seg(lt, 0, .8));
  }
  // the video on his screen: an endless lecture, a board of scribbles, a progress bar that has barely moved
  function lectureInsert(t, a) {
    const S = screenFrame({ screen: '#DDE2EC' });
    boilSeed('lecture board');
    paint(rectPts(S.x + 220, S.y + 90, S.w - 440, S.h - 300), { wash: '#F4F5F8', ink: '#9AA3B8', sw: 1.4 });
    for (let i = 0; i < 9; i++) {
      boilSeed('lecture line ' + i);
      const y = S.y + 150 + i * 62, n = i < 6 ? 8 : Math.floor(clamp((a - (i - 6) * .6) * 3) * 8);
      const P = []; for (let k = 0; k <= n; k++) P.push([S.x + 280 + k * 90, y + Math.sin(k * 1.7 + i) * 12]);
      if (P.length > 1) inkLine(P, 1.1, '#5A6480', 'inkfine', .5);
    }
    person(S.x + 150, S.y + S.h - 170, 12, { who: 'oldTeacher', view: 'q', aR: 1.3 + .3 * Math.sin(a * 6), bR: .3, mouth: talk(a, 0, 9, 'flat'), brows: 'flat', eyes: 'half', boilKey: 'video teacher' });
    boilSeed('lecture bar');
    const by = S.y + S.h - 70;
    paint(rectPts(S.x + 60, by, S.w - 380, 12), { wash: '#AEB5C6', ink: null });
    paint(rectPts(S.x + 60, by, 16 + a * 2, 12), { wash: '#D8394E', ink: null });
    paint(ellPts(S.x + 76 + a * 2, by + 6, 12, 12, 12), { wash: '#D8394E', ink: PAL.ink, sw: .5 });
    letter('۰:۰۴ / ۱:۴۷:۰۰', S.x + S.w - 180, by + 6, 34, '#5A6480', { ink: false, weight: 500, screen: true });
  }

  // ---------- A3: over his shoulder, a hand raised to a video that can't answer (14–22) ----------
  function shotAsk(t, lt, dur) {
    const DT = 720;
    camBegin(960, 540, kf(lt, [[0, 1.04], [dur, 1.08]]));
    boilSeed('ask wall');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: SETS.night.wall, ink: null });
    glow(1180, 520, 520, SETS.night.light, .35);
    desk(DT, 'night');
    laptop(1180, DT, 620, { screen: 'video', key: 'ask' });
    const mood = acts(lt, [[0, 'confused', { emote: '?' }], [4.6, 'frustrated'], [6.2, 'sad', { lookY: .4 }]]);
    const up = ease(seg(lt, .2, 1)) * (1 - ease(seg(lt, 4.5, 5.6))), wave = .08 * Math.sin(lt * 7) * up;
    student(620, 1008 + 20 * seg(lt, 5.6, 6.6), 40, { ...mood, view: 'back', aR: lerp(.2, 2.55, up) + wave, bR: lerp(.3, -.2, up), aL: .2, tilt: .1 * seg(lt, 5.4, 6.4), seed: 2 });
    boilSeed('ask chair');
    paint(rrPts(470, 880, 300, 320, 30), { wash: '#262B40', ink: PAL.ink, sw: 1 });
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, GREY);
  }

  // ---------- B1: the crowded class, from the back of the room (22–38) ----------
  function shotCrowd(t, lt, dur) {
    const ax = 1380, whip = easeIn(seg(lt, dur - .35, dur));
    const zoom = kf(lt, [[0, 1.05], [4, 1.1], [10, 1.28], [dur - .35, 1.34]]) * (1 + 1.2 * whip);
    camBegin(lerp(kf(lt, [[0, 960], [4, 980], [10, 1120]]), ax, whip * .8), lerp(kf(lt, [[0, 540], [10, 620]]), 700, whip * .8), zoom);
    greyClass(t, { scrib: seg(lt, 1.5, 10) });
    const mood = acts(lt, [[0, 'neutral'], [4.2, 'confused'], [10, 'determined'], [14.3, 'disappointed']]);
    const up = ease(seg(lt, 10.2, 10.9)) * (1 - ease(seg(lt, 14.2, 15))), toes = ease(seg(lt, 11.4, 12)) * (1 - ease(seg(lt, 13.8, 14.3)));
    greyCrowd(t, 4, 8, (r, c) => r === 3 && c === 5, r => {
      if (r !== 3) return;
      student(ax, 920 - toes * 18, 15.2, { ...mood, view: 'back', emote: null, aR: lerp(.15, 2.8, up) + .1 * Math.sin(lt * 8) * up, bR: lerp(.3, -.15, up), aL: .15, seed: 3, boilKey: 'arman class' });
    });
    // the questions pile up over his head, one after another, unanswered
    [4.5, 6, 7.5, 9].forEach((q, i) => {
      if (lt < q || lt > 14.6) return;
      boilSeed('q ' + i);
      emote('?', ax - 80 + i * 55 + 8 * Math.sin(lt * 2 + i), 920 - 15.2 * 16.5 - 20 * (i % 2) - 10 * Math.sin(lt * 1.5 + i), 13, seg(lt, q, q + .3), lt - q);
    });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, GREY);
  }

  // ---------- B3: the board goes too simple; a bored close-up; the bell (38–44) ----------
  function shotBored(t, lt, dur) {
    if (lt < 2.5) {   // the board, close: now it's something he learned years ago
      camBegin(960, 300, 1.7 + .03 * lt);
      greyClass(t, { simple: true, writing: .3 });
      camEnd();
      return;
    }
    const a = lt - 2.5;
    camBegin(960 - 10 * a, 540, 1.02 + .01 * a);
    boilSeed('bored wall');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: SETS.grey.wall, ink: null });
    paint(rectPts(1350, 120, 380, 420), { wash: '#C8CCD6', ink: '#7D818E', sw: 1.4 });   // the window he stares at
    for (let i = 0; i < 9; i++) { boilSeed('head ' + i); const hx = 60 + i * 230 + (hash(i) - .5) * 60, hy = 820 + (i % 2) * 90; paint(ellPts(hx, hy, 95, 105, 18), { wash: mixCol('#6E7382', SETS.grey.wall, .3 * (i % 2)), ink: null }); }
    const mood = acts(a, [[0, 'bored'], [1.8, 'uninterested', { lookX: 1 }]]);
    student(1000, 1330, 72, { ...mood, view: 'q', flip: true, aL: .2, aR: .2, seed: 4 });
    camEnd();
    // the bell
    const b = lt - 5; if (b > 0) { boilSeed('bell'); const s = Math.sin(b * 40) * Math.exp(-b * 1.5) * .25; push(); translate(1760, 140); rotate(s); paint([[-50, 40], [50, 40], [38, -20], [0, -50], [-38, -20]], { wash: PAL.ochre, ink: PAL.ink, sw: 1, curv: .4 }); paint(ellPts(0, 48, 12, 12, 10), { wash: '#8A6A2A', ink: PAL.ink, sw: .6 }); pop(); for (const d of [-1, 1]) inkLine([[1760 + d * 70, 120], [1760 + d * 95, 100]], 1.2, PAL.ink, 'ink', 0); }
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, NIGHT);
  }

  // ---------- C: the desk at night, the pieces that won't fit (44–52) ----------
  function shotPieces(t, lt, dur) {
    const DT = 790, u = 30, x = 900, G = seatAt('arman', DT, u);
    camBegin(990, 600, 1.62 + .012 * lt);
    room(t, 'night');
    const lift = ease(seg(lt, 6.3, 7.3));
    const mood = acts(lt, [[0, 'disappointed'], [6.4, 'tired', { lookX: .8 }], [7.2, 'curious', { lookX: .85, lookY: .1 }]]);
    const slump = 1.4 * (1 - lift);
    student(x, G, u, { ...mood, dy: (mood.dy || 0) + slump, tilt: (mood.tilt || 0) + .12 * (1 - lift), aL: .5, bL: 2.1, aR: .5, bR: 2.1, seed: 5 });
    mindPuzzle(t, x, G - (11.7 - slump) * u - 40, 42, 0, 0);
    laptopBack(1250, DT, 330, mixCol(SETS.night.light, '#9FEAF6', seg(lt, 6.5, 8)), .6 + .6 * seg(lt, 6.5, 8));
    desk(DT, 'night');
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, NIGHT);
  }

  shots([[0, shotNight], [14, shotAsk], [22, shotCrowd], [38, shotBored], [44, shotPieces]]);
})();
