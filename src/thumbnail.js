// thumbnail.js — the video's covers, painted with the kit itself: a YouTube thumbnail and a vertical cover for Shorts
// and Reels. Arman, amazed, raises his hand to Yara on a warm burst; the claim, big, on the brand's night blue.
//   node render.mjs --loop=thumbnail --stills=0.5 --out=out/cover          1920×1080 (upload as 1280×720 JPG, under 2 MB)
//   node render.mjs --reel --loop=cover --stills=0.5 --out=out/cover       1080×1920
//   node render.mjs --reel --loop=reelCover --stills=0.5 --out=out/cover   1080×1920, the Instagram Reels cover
// Kept clear: the bottom right of the thumbnail (YouTube puts the duration there), and the top and bottom 240 px of
// the vertical cover (the profile grid shows only its middle 3:4).
(() => {
  const WARM = PAL.cream, RAY = mixCol(PAL.cream, PAL.ochre, .38), EDGE = mixCol(PAL.cream, PAL.clayLt, .55);

  // a comic burst of rays around (cx, cy), warm and bright, for the character to pop against
  function burst(cx, cy) {
    boilSeed('cover ground');
    paint(rectPts(-1500, -1500, W + 3000, H + 3000), { wash: EDGE, ink: null });
    for (let i = 0; i < 18; i++) {
      boilSeed('cover ray ' + i);
      const a = i / 18 * TAU, d = TAU / 36;
      paint([[cx, cy], [cx + Math.cos(a - d) * 2600, cy + Math.sin(a - d) * 2600], [cx + Math.cos(a + d) * 2600, cy + Math.sin(a + d) * 2600]], { wash: RAY, ink: null });
    }
    boilSeed('cover core');
    paint(ellPts(cx, cy, 560, 520, 40), { wash: mixCol(WARM, RAY, .35), ink: null });
    paint(ellPts(cx, cy, 380, 360, 36), { wash: WARM, ink: null });
  }
  // the night-blue panel the words sit on, with a cyan edge
  function panel(P, edge) {
    boilSeed('cover panel');
    paint(P, { wash: PAL.deep, ink: null });
    for (let i = 0; i < 26; i++) { boilSeed('cover star ' + i); const [x, y] = [lerp(edge[0][0], 2000, hash(i)), lerp(-300, 1500, hash(i + 40))]; paint(starPts(x, y, 3 + 4 * hash(i + 7), .35, 4), { wash: PAL.cream, washOp: 110 + 120 * hash(i + 3), ink: null }); }
    inkLine(edge, 5, PAL.cyan, 'ink', 0);
  }
  function sparkles(list) { list.forEach(([x, y, r], i) => { boilSeed('cover spark ' + i); paint(starPts(x, y, r, .28, 4), { wash: '#FFFFFF', ink: PAL.ink, sw: .6 }); }); }
  function arman(x, y, u) {
    student(x, y, u, { ...expr('amazed', { lookX: .12, lookY: -.05, blush: .7 }), aL: .25, bL: .35, aR: 2.62, bR: .22, seed: 7, boilKey: 'cover arman' });
  }
  function yara(x, y, s) {
    boilSeed('cover yara glow'); glow(x, y, s * 3.2, '#7FE6F5', 1);
    buddy(x, y, s, { mood: 'happy', key: 'cover yara' });
  }
  function claim(x, y, k, sub = true) {   // ۱۰۰٪ / ساخت AI / what was made
    glow(x, y, 330 * k, '#3CCFE6', .45);
    letter('۱۰۰٪', x, y, 300 * k, PAL.cyan, { align: 'center', weight: 900, stroke: PAL.cream, screen: true });
    letter('ساخت AI', x, y + 250 * k, 150 * k, PAL.cream, { align: 'center', weight: 900, screen: true });
    if (sub) letter('داستان · شعر · آهنگ · انیمیشن', x, y + 420 * k, 54 * k, PAL.brandLt, { align: 'center', weight: 700, ink: false, screen: true });
  }

  // ---------- the YouTube thumbnail (16:9) ----------
  LOOPS.thumbnail = t => {
    burst(600, 560);
    panel([[1130, -200], [2200, -200], [2200, 1300], [990, 1300]], [[1145, -200], [1005, 1300]]);
    yara(1060, 300, 78);
    arman(590, 1390, 72);
    sparkles([[300, 300, 34], [930, 560, 26], [250, 760, 22], [1210, 140, 20]]);
    claim(1535, 350, 1);
    letter('آموزشگاه فردا', 1840, 80, 46, PAL.cream, { align: 'right', weight: 800, ink: false, screen: true });
  };
  LOOPS.thumbnail.len = 1;

  // ---------- the vertical cover (9:16), for Shorts and Reels: a window of the design screen (see REEL_VIEW) ----------
  LOOPS.cover = t => {
    burst(900, 650);
    panel([[200, -500], [1700, -500], [1700, 330], [200, 420]], [[200, 420], [1700, 330]]);
    yara(1255, 545, 70);
    arman(890, 1500, 72);
    sparkles([[600, 540, 26], [1330, 820, 22], [590, 900, 18]]);
    claim(960, 10, .72, false);
    letter('داستان · شعر · آهنگ · انیمیشن', 960, 290, 40, PAL.brandLt, { align: 'center', weight: 700, ink: false, screen: true });
    letter('آموزشگاه فردا', 960, -175, 40, PAL.cream, { align: 'center', weight: 800, ink: false, screen: true });
  };
  LOOPS.cover.len = 1;
  // ---------- the Instagram Reels cover (9:16): the caption's hook over the crowded class ----------
  // Grey room, forty grey backs, and one boy in colour who has turned round to us with his hand up. Everything that
  // must read sits in the middle 3:4 (design y −60–1140), the part the profile grid shows.
  LOOPS.reelCover = t => {
    greyClass(t, { scrib: 1 });
    greyCrowd(t, 4, 8);
    boilSeed('reel cover dim');   // the words' night band, fading into the room
    paint(rectPts(-1400, -1300, W + 2800, 1560), { wash: PAL.deep, washOp: 225, ink: null });
    for (let i = 0; i < 8; i++) paint(rectPts(-1400, 260 + i * 25, W + 2800, 25), { wash: PAL.deep, washOp: 200 * (1 - (i + 1) / 9), ink: null });
    student(935, 1400, 60, { ...expr('worried', { lookX: .05, lookY: -.05, emote: null, blush: .4 }), aL: .25, bL: .35, aR: 2.62, bR: .22, seed: 8, boilKey: 'reel cover arman' });
    [[1215, 470, 48, 0], [1300, 560, 40, .4], [1150, 395, 34, .8]].forEach(([x, y, s, a]) => { boilSeed('reel q ' + x); emote('?', x, y, s, 1, 1 + a); });
    boilSeed('reel cover pill'); paint(rrPts(835, -48, 250, 84, 42), { wash: PAL.cyan, ink: PAL.ink, sw: 1 });
    letter('ساخت AI', 960, -6, 46, PAL.deep, { align: 'center', weight: 900, ink: false, screen: true });
    letter('۴۰ نفر تو کلاس،', 960, 112, 104, PAL.cream, { align: 'center', weight: 900, stroke: PAL.deep, screen: true });
    letter('یه معلم، و سؤالی که', 960, 228, 64, PAL.cream, { align: 'center', weight: 800, stroke: PAL.deep, screen: true });
    letter('هیچ‌وقت پرسیده نشد', 960, 338, 88, PAL.cyan, { align: 'center', weight: 900, stroke: PAL.deep, screen: true });
    letter('آموزشگاه فردا', 960, 1255, 40, PAL.cream, { align: 'center', weight: 800, stroke: PAL.deep, screen: true });
  };
  LOOPS.reelCover.len = 1;
  // the vertical covers' 9:16 window: x 510–1410, y −260–1340 on the design screen
  const storyView = REEL_VIEW;
  REEL_VIEW = t => window.LOOP === LOOPS.cover || window.LOOP === LOOPS.reelCover ? { cx: 960, cy: 540, h: 1600 } : storyView(t);
})();
