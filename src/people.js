// people.js: the human cast for Farda videos, all on one rig: Arman (the student), the Farda teacher, the classmates,
// the teacher of the crowded class and the crowd. Each is a LOOK (proportions, skin, hair, outfit, accessories) drawn
// by person(); the face system (eyes, brows, mouths, expressions) is shared. Drawn in key views (front, q, side, back),
// never projected. Props live in props.js.
//
//   person(x, y, u, { who: 'arman', view, eyes, brows, mouth, lookX, lookY, blush, aL, aR, bL, bR, walk, dy, sq, rot,
//                     flip, tilt, emote, handL, handR })       student(x, y, u, o) is person() with who: 'arman'.
//   (x, y) = the ground point between the feet; u = size unit (Arman is about 15.5u tall; adults are taller).
//   aL / aR: arm angles from hanging straight down (+ = out and up; PI/2 = level, PI = straight up);
//   bL / bR: elbow bends (+ bends the forearm in, toward the chest). handL / handR(u, sw): hooks at the hands
//   (+y runs out past the fingers).
//   eyes: open, wide, sparkle, focus, half, sleepy, dull, tired, narrow, angry, scared, teary, cry, happy, closed,
//         squeeze, yawn, wink. brows: neutral, up, down, flat, worried, sad, angry, raise, skeptic.
//   mouth: smile, grin, o, O, flat, wobble, laugh, smirk, frown, yawn, teeth, wail, pout, side, meh, sigh.
//   face extras: blush 0..1+, gloom 0..1 (forehead lines), hud: 'notify' (a notification on smart glasses), tilt (head, rad).
//   Expressions bundle them: expr('curious') etc. (STU_EXPR; the sheet of all of them is studio.html?loop=studentFaces).
const STU = {
  skin: '#F1C7A2', skinDk: '#D39472', hair: '#43291F', hairLt: '#6E4636',
  hoodie: '#3D63D6', hoodieDk: '#2A469F', pants: '#2B2F45', pantsDk: '#1E2133',
  shoe: '#F2EEE6', pack: '#34364A', packDk: '#25273A', glow: '#3CCFE6', iris: '#5A3A2A', mouth: '#5A2430'
};
// The cast. top: hoodie | sweater | jacket (an open overshirt over a tee) | suit. hair: curly | short | buzz | bald | long (straight, side-
// parted, falling over the shoulders; hairLen sets how far: 1 = to the chest, .35 = a bob).
// glasses: smart | round | plain | null. legK / torsoK stretch the legs and torso (1 = Arman's proportions).
const LOOKS = {
  arman: { fa: 'آرمان', skin: STU.skin, skinDk: STU.skinDk, iris: STU.iris, hair: 'curly', hairCol: STU.hair, hairLt: STU.hairLt,
           top: 'hoodie', col: STU.hoodie, dk: STU.hoodieDk, pants: STU.pants, pantsDk: STU.pantsDk, shoe: STU.shoe, sole: STU.glow,
           pack: true, glasses: 'smart', freckles: true, cargo: true, legK: 1, torsoK: 1 },
  // the Farda teacher: young, warm; shoulder-length black hair, an olive overshirt, the Farda staff badge, wide pants
  mentor: { fa: 'مدرس فردا', skin: '#F3CDB0', skinDk: '#D69C7C', iris: '#3E2A22', hair: 'long', hairLen: .42, hairCol: '#26232C', hairLt: '#55525F',
            top: 'jacket', col: '#5E7148', dk: '#465634', inner: '#F4EFE6', pants: '#26252F', pantsDk: '#1B1A22', wide: .8, shoe: '#EDE9E2', sole: '#B9BDC8',
            lanyard: true, lash: 2, legK: 1.32, torsoK: 1.12, headK: .9 },
  // classmates at Farda
  sara:  { fa: 'سارا', skin: '#F2CBAE', skinDk: '#D49A7A', iris: '#4A3024', hair: 'long', hairLen: .8, hairCol: '#4A2E24', hairLt: '#6E4838', clip: '#3CCFE6',
           top: 'sweater', col: '#E8A0A8', dk: '#C97C86', accent: '#FFF5E2', pants: '#46557A', pantsDk: '#343F5C', shoe: '#F2EEE6', sole: '#E8A0A8', lash: 2, legK: 1, torsoK: 1 },
  nima:  { fa: 'نیما', skin: '#E0AE88', skinDk: '#BF8A66', iris: '#3A2A20', hair: 'short', hairCol: '#1F1B1E', hairLt: '#3C3438',
           top: 'sweater', col: '#E5A63A', dk: '#BF8424', accent: '#2F66E0', pants: '#3A3F55', pantsDk: '#2A2E40', shoe: '#2B2F45', sole: '#E5A63A',
           headphones: true, legK: 1.04, torsoK: 1 },
  mahsa: { fa: 'مهسا', skin: '#F0C8A8', skinDk: '#D29878', iris: '#4E3426', hair: 'long', hairLen: .32, hairCol: '#23202A', hairLt: '#3E3A48',
           top: 'hoodie', col: '#5BAE6A', dk: '#3F8A4E', pants: '#2B2F45', pantsDk: '#1E2133', shoe: '#F2EEE6', sole: '#5BAE6A', glasses: 'round', lash: 2, legK: .98, torsoK: 1 },
  kian:  { fa: 'کیان', skin: '#C98E68', skinDk: '#A8704E', iris: '#2E2018', hair: 'buzz', hairCol: '#3A2A22', hairLt: '#5A463A',
           top: 'jacket', col: '#C8553D', dk: '#A0402C', inner: '#D9DCE4', pants: '#2E3347', pantsDk: '#22263A', shoe: '#F2EEE6', sole: '#C8553D', pack: true, legK: .96, torsoK: .98 },
  // the crowded class of "today": an old-school teacher and a grey crowd
  oldTeacher: { fa: 'معلم کلاس شلوغ', skin: '#E9C0A0', skinDk: '#C99878', iris: '#3A3030', hair: 'bald', hairCol: '#8A8480', hairLt: '#A8A29E',
                top: 'suit', col: '#6F7280', dk: '#555866', inner: '#EEF0F2', tie: '#7A4A4A', pants: '#55586A', pantsDk: '#44475A', shoe: '#3A3436', sole: '#3A3436',
                glasses: 'plain', moustache: true, legK: 1.34, torsoK: 1.16, headK: .9 },
  crowdA: { fa: '', skin: '#E4BFA2', skinDk: '#C49C80', iris: '#3A3030', hair: 'short', hairCol: '#3E3A40', hairLt: '#55505A', top: 'sweater', col: '#8A8FA0', dk: '#707588', accent: '#9CA1B2', pants: '#5A5F70', pantsDk: '#4A4E5E', shoe: '#6A6E7C', sole: '#6A6E7C', legK: 1, torsoK: 1 },
  crowdB: { fa: '', skin: '#EAC7AA', skinDk: '#C9A386', iris: '#3A3030', hair: 'long', hairLen: .6, hairCol: '#4A4E60', hairLt: '#5E6275', top: 'sweater', col: '#9398A8', dk: '#777C8E', accent: '#A5AABB', pants: '#5A5F70', pantsDk: '#4A4E5E', shoe: '#6A6E7C', sole: '#6A6E7C', legK: 1, torsoK: 1 },
};
let LK = LOOKS.arman;   // the look being drawn (person() sets it; the part functions read it)

const STU_EXPR = {
  neutral:      { fa: 'عادی', eyes: 'open', brows: 'neutral', mouth: 'smile' },
  // joy
  happy:        { fa: 'شاد', eyes: 'open', brows: 'up', mouth: 'grin', blush: .7 },
  excited:      { fa: 'هیجان‌زده', eyes: 'wide', brows: 'up', mouth: 'laugh', blush: .6, emote: 'spark' },
  laugh:        { fa: 'خنده', eyes: 'squeeze', brows: 'up', mouth: 'laugh', blush: .9 },
  proud:        { fa: 'افتخار', eyes: 'closed', brows: 'up', mouth: 'smile', blush: .5, tilt: -.1 },
  amazed:       { fa: 'شگفت‌زده', eyes: 'sparkle', brows: 'up', mouth: 'O', blush: .5 },
  relieved:     { fa: 'آسوده', eyes: 'closed', brows: 'worried', mouth: 'smile', emote: 'sweat', tilt: .06 },
  // learning
  curious:      { fa: 'کنجکاو', eyes: 'open', brows: 'raise', mouth: 'o', lookX: .5, lookY: -.45 },
  thinking:     { fa: 'در فکر', eyes: 'open', brows: 'raise', mouth: 'side', lookX: -.6, lookY: -.7, emote: 'dots', tilt: .06 },
  focused:      { fa: 'متمرکز', eyes: 'focus', brows: 'down', mouth: 'flat', lookY: .3 },
  idea:         { fa: 'ایده!', eyes: 'sparkle', brows: 'up', mouth: 'grin', emote: 'bulb' },
  determined:   { fa: 'مصمم', eyes: 'angry', brows: 'down', mouth: 'smirk', lookX: .3 },
  confident:    { fa: 'مطمئن', eyes: 'half', brows: 'raise', mouth: 'smirk', blush: .3, tilt: .05 },
  // low energy
  sleepy:       { fa: 'خواب‌آلود', eyes: 'sleepy', brows: 'flat', mouth: 'o', emote: 'zzz', tilt: .14 },
  yawn:         { fa: 'خمیازه', eyes: 'yawn', brows: 'up', mouth: 'yawn', tilt: -.06 },
  bored:        { fa: 'بی‌حوصله', eyes: 'half', brows: 'flat', mouth: 'meh', lookX: -.3, lookY: .35, tilt: .12 },
  distracted:   { fa: 'عدم تمرکز', eyes: 'open', brows: 'neutral', mouth: 'o', lookX: .95, lookY: -.35, hud: 'notify' },
  uninterested: { fa: 'بی‌علاقه', eyes: 'dull', brows: 'flat', mouth: 'side', lookX: -.9, tilt: -.07 },
  tired:        { fa: 'خسته', eyes: 'tired', brows: 'worried', mouth: 'sigh', tilt: .08 },
  // trouble
  confused:     { fa: 'گیج', eyes: 'open', brows: 'skeptic', mouth: 'wobble', lookX: -.4, emote: '?' },
  worried:      { fa: 'نگران', eyes: 'open', brows: 'sad', mouth: 'wobble', lookX: .4, lookY: .2, emote: 'sweat' },
  stressed:     { fa: 'استرس امتحان', eyes: 'scared', brows: 'sad', mouth: 'teeth', gloom: .8, emote: 'sweat' },
  frustrated:   { fa: 'کلافه', eyes: 'angry', brows: 'angry', mouth: 'teeth', emote: 'scribble' },
  sad:          { fa: 'غمگین', eyes: 'teary', brows: 'sad', mouth: 'frown', lookY: .4 },
  disappointed: { fa: 'ناامید', eyes: 'half', brows: 'sad', mouth: 'frown', lookY: .6, gloom: .6, tilt: .1 },
  // big feelings
  angry:        { fa: 'عصبانی', eyes: 'angry', brows: 'angry', mouth: 'teeth', blush: .9, emote: 'anger' },
  embarrassed:  { fa: 'خجالت‌زده', eyes: 'open', brows: 'sad', mouth: 'wobble', lookX: -.7, lookY: .5, blush: 1.3, emote: 'sweat', tilt: -.08 },
  scared:       { fa: 'ترسیده', eyes: 'scared', brows: 'sad', mouth: 'wail', emote: '!!' },
  cry:          { fa: 'گریه', eyes: 'cry', brows: 'sad', mouth: 'wail' },
  skeptical:    { fa: 'مشکوک', eyes: 'narrow', brows: 'skeptic', mouth: 'side', lookX: .6 },
  wink:         { fa: 'چشمک', eyes: 'wink', brows: 'raise', mouth: 'smirk', blush: .4 },
};
const expr = (name, over = {}) => ({ ...STU_EXPR[name], ...over });

// Where things are, for a look: the hip, shoulders and neck (in u, from the ground), after its legK / torsoK stretch.
function bodyOf(L) {
  const hip = -.8 - 3.6 * L.legK, lift = hip + 4.4;     // the top of the pants, and how far the torso moves up
  const neck = lift - 4.4 - 4.8 * L.torsoK;
  return { hip, lift, shoulder: lift - 4.4 - 3.5 * L.torsoK, neck, armK: L.torsoK, height: -neck + 6 };
}
function person(x, y, u, o = {}) {
  const L = LOOKS[o.who] || o.look || LOOKS.arman, prevLK = LK; LK = L;
  const id = o.boilKey ?? ++CLAWD_N, rs = part => boilSeed(`person ${id} ${part}`);
  const view = o.view || 'front', sw = clamp(u / 16, .45, 2.2), B = bodyOf(L);
  const dy = (o.dy || 0) * u, sq = o.sq || 0;
  rs('shadow');
  if (!o.noShadow) paint(ellPts(x, y + u * .1, u * (view === 'side' ? 3.2 : 3.6) * (1 - Math.min(.5, Math.abs(o.dy || 0) * .05)), u * .7, 20), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, ink: null });
  push(); translate(x, y + dy); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + sq * .5), 1 - sq);

  const arm = (side, far) => {
    rs('arm' + side);
    const a = side < 0 ? o.aL ?? .12 : o.aR ?? .12, b = side < 0 ? o.bL ?? .15 : o.bR ?? .15;
    const px = view === 'side' ? 0 : view === 'q' ? (side < 0 ? -2.1 : 2.3) : side * 2.45;
    push(); translate(px * u, B.shoulder * u); stuArm(view === 'side' ? 1 : side, a, b, u, sw, far, side < 0 ? o.handL : o.handR, side < 0 && view !== 'side' && L === LOOKS.arman, B.armK); pop();
  };

  // behind the body: the backpack, and the far arm in the 3/4 view
  rs('pack');
  push(); translate(0, B.lift * u);
  if (L.pack && view === 'front') paint(rrPts(-3.35 * u, -8.2 * u, 6.7 * u, 3.6 * u, .8 * u), { wash: STU.pack, ink: PAL.ink, sw: sw * .8 });
  if (L.pack && view === 'q') paint(rrPts(-3.7 * u, -8.3 * u, 3 * u, 3.8 * u, .8 * u), { wash: STU.pack, ink: PAL.ink, sw: sw * .8 });
  pop();
  if (view === 'q') arm(-1, true);

  rs('legs'); stuLegs(u, sw, view, o.walk);
  rs('torso'); push(); translate(0, B.lift * u); translate(0, -4.4 * u); scale(1, L.torsoK); translate(0, 4.4 * u); stuTorso(u, sw, view); pop();
  rs('head'); push(); translate(0, B.neck * u); rotate(o.tilt || 0); scale(L.headK || 1); translate(0, -2.5 * u); stuHead(u, o, sw, view); pop();
  if (view === 'front') { arm(-1); arm(1); } else if (view === 'q') arm(1); else if (view === 'side') arm(1); else { arm(-1); arm(1); }
  rs('draw'); if (o.draw) o.draw(u, sw);
  pop();
  rs('emote');
  if (o.emote) emote(o.emote, x + (o.flip ? -1 : 1) * 3.6 * u, y + dy - (B.height - .3) * u, u * .75, o.emoteK ?? 1, o.emoteAge ?? T);
  rs('after');
  LK = prevLK;
}
const student = (x, y, u, o = {}) => person(x, y, u, { who: 'arman', ...o });
// A head on its own (expression sheets, close-ups): centred on (x, y), in a look.
function headOf(who, x, y, u, o = {}) {
  const prevLK = LK; LK = LOOKS[who] || LOOKS.arman;
  push(); translate(x, y + 2.5 * u); rotate(o.tilt || 0); translate(0, -2.5 * u); stuHead(u, o, clamp(u / 16, .45, 2.2), o.view || 'front'); pop();
  LK = prevLK;
}

// An arm hanging from the shoulder (the current origin): sleeve, cuff, hand. side ±1 is the outward direction.
function stuArm(side, a, bend, u, sw, far, hook, watch, k = 1) {
  const d1 = [side * Math.sin(a), Math.cos(a)], a2 = a - bend, d2 = [side * Math.sin(a2), Math.cos(a2)];
  const E = [d1[0] * 1.9 * k * u, d1[1] * 1.9 * k * u], H = [E[0] + d2[0] * 1.7 * k * u, E[1] + d2[1] * 1.7 * k * u];
  const col = far ? mixCol(LK.col, LK.dk, .6) : LK.col;
  paint(ribbon([[0, 0], [E[0] * .5, E[1] * .5], E, [(E[0] + H[0]) / 2, (E[1] + H[1]) / 2], H], 1.45 * u, 1.1 * u), { wash: col, ink: PAL.ink, sw: sw * .8 });
  const cuff = LK.top === 'jacket' ? mixCol(LK.col, PAL.cream, .25) : LK.top === 'suit' ? LK.inner : LK.dk;   // rolled sleeves, shirt cuffs
  paint(ellPts(H[0], H[1], .58 * u, .5 * u, 12, 0, Math.atan2(d2[1], d2[0]) + Math.PI / 2), { wash: cuff, ink: PAL.ink, sw: sw * .6 });
  const hand = [H[0] + d2[0] * .5 * u, H[1] + d2[1] * .5 * u];
  paint(ellPts(hand[0], hand[1], .52 * u, .56 * u, 12), { wash: far ? mixCol(LK.skin, LK.skinDk, .5) : LK.skin, ink: PAL.ink, sw: sw * .6 });
  if (watch) {   // a smartwatch on the left wrist, its screen lit
    const w = [H[0] - d2[0] * .35 * u, H[1] - d2[1] * .35 * u];
    paint(rrPts(w[0] - .38 * u, w[1] - .3 * u, .76 * u, .6 * u, .15 * u), { wash: PAL.ink, ink: null });
    paint(rrPts(w[0] - .25 * u, w[1] - .18 * u, .5 * u, .36 * u, .1 * u), { wash: STU.glow, ink: null });
  }
  if (hook) { push(); translate(...hand); rotate(Math.atan2(d2[1], d2[0]) - Math.PI / 2); hook(u, sw); pop(); }
}

function stuLegs(u, sw, view, walk) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), K = LK.legK, wide = LK.wide || 0;
  const shoe = (x, dir, dark) => {   // a chunky sneaker (or a plain shoe); dir 0 = facing out of the screen, ±1 = pointing that way
    const c = dark ? mixCol(LK.shoe, PAL.ink, .15) : LK.shoe;
    if (!dir) {
      paint(rrPts((x - 1.05) * u, -1.1 * u, 2.1 * u, 1.1 * u, .45 * u), { wash: c, ink: PAL.ink, sw: sw * .7 });
      inkLine(P([[x - .95, -.22], [x, -.18], [x + .95, -.22]]), sw * .7, LK.sole, 'ink', 0);
      inkLine(P([[x - .45, -.85], [x + .45, -.85]]), sw * .4, mixCol(LK.shoe, PAL.ink, .4), 'inkfine', 0);
    } else {
      paint(P([[x - 1 * dir, 0], [x + 1.55 * dir, 0], [x + 1.75 * dir, -.45], [x + 1.1 * dir, -.95], [x - .8 * dir, -1.05], [x - 1.05 * dir, -.5]]), { wash: c, ink: PAL.ink, sw: sw * .7, curv: .4 });
      inkLine(P([[x - .95 * dir, -.2], [x + 1.6 * dir, -.2]]), sw * .7, LK.sole, 'ink', 0);
    }
  };
  const hip = -.8 - 3.5 * K;
  if (view === 'side') {   // two legs swinging from the hip; the far one darker
    const w = walk ?? 0;
    [[.5, true], [0, false]].forEach(([ph, far]) => {
      const s = walk == null ? (far ? -.08 : .08) : .45 * Math.sin((w + ph) * TAU), lift = walk == null ? 0 : Math.max(0, Math.cos((w + ph) * TAU)) * .5;
      const fx = Math.sin(s) * 3.4 * K, fy = -.9 - lift;
      if (!wide) push(), translate(0, -lift * u), shoe(fx, 1, far), pop();
      paint(ribbon(P([[0, hip], [fx * .5, (hip + fy) / 2], [fx, fy + (wide ? .35 : 0)]]), 1.9 * u, (1.55 + wide * .9) * u), { wash: far ? LK.pantsDk : LK.pants, ink: PAL.ink, sw: sw * .8 });
      if (wide) push(), translate(0, -lift * u), shoe(fx + .25, 1, far), pop();
    });
    return;
  }
  const q = view === 'q' ? .25 : 0;
  for (const s of [-1, 1]) {
    const far = view === 'q' && s < 0;
    if (wide) shoe(s * 1.2 + q, 0, far);   // wide trousers fall over the shoes
    push(); translate(0, -.8 * u); scale(1, K); translate(0, .8 * u);
    const bot = wide ? -.45 : -.8, out = wide * .55;
    paint(P([[s * .15 + q, -4.4], [s * 2.05 + q, -4.4], [s * (2.2 + out) + q, bot], [s * (.3 - out * .3) + q, bot]]), { wash: far ? LK.pantsDk : LK.pants, ink: PAL.ink, sw: sw * .8 });
    if (LK.cargo && view !== 'back') paint(rectPts(((s < 0 ? -2.2 : 1.45) + q) * u, -3.2 * u, .75 * u, 1.1 * u), { wash: LK.pantsDk, ink: PAL.ink, sw: sw * .45 });   // cargo pocket
    if (wide) inkLine(P([[s * 1.1 + q, -3.6], [s * 1.25 + q, -1.2]]), sw * .4, LK.pantsDk, 'inkfine', 0);   // a crease
    pop();
    if (!wide) shoe(s * 1.2 + q, 0, far);
  }
}

// The upper body, in Arman's torso coordinates (person() stretches them by torsoK). Outfits: hoodie, sweater, jacket, suit.
function stuTorso(u, sw, view) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), top = LK.top, long = top === 'jacket' || top === 'suit' ? 1.3 : 0;
  const neck = (x0 = -.6, w = 1.2) => paint(rectPts(x0 * u, -9.5 * u, w * u, 1.3 * u), { wash: LK.skin, ink: null });
  if (view === 'side') {
    paint(P([[-1.6, -8.35], [1.3, -8.35], [1.95, -6.8], [2.1, -4.05 + long], [-1.95, -4.05 + long], [-1.9, -6.8]]), { wash: LK.col, ink: PAL.ink, sw, curv: .3 });
    if (top === 'hoodie' || top === 'sweater') paint(rectPts(-1.95 * u, -4.5 * u, 4.05 * u, .5 * u), { wash: LK.dk, ink: PAL.ink, sw: sw * .6 });
    if (top === 'hoodie') paint(P([[.3, -5.8], [2, -5.8], [2.1, -4.5], [.3, -4.5]]), { wash: mixCol(LK.col, LK.dk, .5), ink: PAL.ink, sw: sw * .5 });
    if (top === 'jacket' || top === 'suit') inkLine(P([[1.2, -8.2], [1.55, -6.5], [1.7, -2.9]]), sw * .6, LK.dk, 'ink', .3);   // the front edge
    if (LK.pack) {
      paint(rrPts(-3.7 * u, -8.3 * u, 2.1 * u, 3.9 * u, .7 * u), { wash: STU.pack, ink: PAL.ink, sw: sw * .8 });   // the backpack, from the side
      inkLine(P([[-3.45, -7.4], [-3.45, -5.2]]), sw * .9, STU.glow, 'ink', 0);
      inkLine(P([[-1.5, -8.3], [-.7, -8.1], [-.5, -6.2]]), sw * 1.8, STU.packDk, 'ink', .4);   // strap over the shoulder
    }
    if (LK.lanyard) {   // the staff badge, edge-on
      paint(ribbon(P([[.55, -8.4], [1.05, -7.6], [1.45, -7]]), .3 * u, .3 * u), { wash: PAL.brand, ink: PAL.ink, sw: sw * .4 });
      paint(rrPts(1.25 * u, -7.05 * u, .55 * u, 2 * u, .12 * u), { wash: PAL.cream, ink: PAL.ink, sw: sw * .5 });
      paint(rectPts(1.25 * u, -7.05 * u, .55 * u, .55 * u), { wash: PAL.brand, ink: null });
    }
    paint(rectPts(-.55 * u, -9.4 * u, 1.1 * u, 1.2 * u), { wash: LK.skin, ink: PAL.ink, sw: sw * .6 });
    if (top === 'hoodie') paint(P([[-1.9, -8.2], [-1.6, -9.2], [-.5, -9.2], [.2, -8.2]]), { wash: LK.dk, ink: PAL.ink, sw: sw * .7, curv: .4 });   // the hood
    else paint(P([[-.8, -8.45], [.6, -8.45], [.75, -8.1], [-.9, -8.1]]), { wash: top === 'sweater' ? LK.dk : LK.inner, ink: PAL.ink, sw: sw * .5 });   // collar
    return;
  }
  const qx = view === 'q' ? .25 : 0, BK = view === 'back', F = view === 'q' ? .75 : 0;
  const body = [[-2.55 + qx, -8.35], [2.55 + qx, -8.35], [2.95 + qx, -6.8], [3 + qx, -4.05 + long], [-3 + qx, -4.05 + long], [-2.95 + qx, -6.8]];
  if (BK) {
    paint(P(body), { wash: LK.col, ink: PAL.ink, sw, curv: .3 });
    if (top === 'hoodie' || top === 'sweater') paint(rectPts((-3 + qx) * u, -4.5 * u, 6 * u, .5 * u), { wash: LK.dk, ink: PAL.ink, sw: sw * .6 });
    if (top === 'hoodie') paint(P([[-2, -8.4], [2, -8.4], [1.6, -7], [0, -6.5], [-1.6, -7]]), { wash: LK.dk, ink: PAL.ink, sw: sw * .7, curv: .4 });   // the hood
    if (top === 'jacket' || top === 'suit') { inkLine(P([[0, -8.2], [0, -2.9]]), sw * .5, LK.dk, 'inkfine', 0); paint(P([[-1.6, -8.4], [1.6, -8.4], [1.2, -7.9], [-1.2, -7.9]]), { wash: LK.dk, ink: PAL.ink, sw: sw * .6 }); }
    if (LK.pack) {
      paint(rrPts(-2.55 * u, -8.2 * u, 5.1 * u, 4.3 * u, .9 * u), { wash: STU.pack, ink: PAL.ink, sw: sw * .9 });
      paint(rrPts(-1.9 * u, -6.3 * u, 3.8 * u, 1.9 * u, .45 * u), { wash: STU.packDk, ink: PAL.ink, sw: sw * .7 });
      inkLine(P([[-1.5, -6.9], [1.5, -6.9]]), sw * 1.1, STU.glow, 'ink', 0);
      inkLine(P([[-.6, -8.2], [0, -8.75], [.6, -8.2]]), sw * 1.2, STU.packDk, 'ink', .5);   // the handle
    }
    paint(rectPts(-.55 * u, -9.4 * u, 1.1 * u, 1.1 * u), { wash: LK.skin, ink: PAL.ink, sw: sw * .6 });
    if (LK.lanyard) paint(ribbon(P([[-.75, -8.45], [0, -8.3], [.75, -8.45]]), .3 * u, .3 * u), { wash: PAL.brand, ink: PAL.ink, sw: sw * .4 });   // the lanyard round the neck
    return;
  }
  if (top === 'hoodie') {
    paint(P(body), { wash: LK.col, ink: PAL.ink, sw, curv: .3 });
    paint(rectPts((-3 + qx) * u, -4.5 * u, 6 * u, .5 * u), { wash: LK.dk, ink: PAL.ink, sw: sw * .6 });
    paint(P([[-1.8 + F, -5.9], [1.8 + F, -5.9], [2.2 + F, -4.5], [-2.2 + F, -4.5]]), { wash: mixCol(LK.col, LK.dk, .45), ink: PAL.ink, sw: sw * .5 });   // pocket
    paint(P([[-2.2 + F, -8.2], [-1.8 + F, -9.3], [1.8 + F, -9.3], [2.2 + F, -8.2]]), { wash: LK.dk, ink: PAL.ink, sw: sw * .7, curv: .3 });   // hood, behind the neck
    neck(-.6 + F);
    paint(P([[-.8 + F, -8.4], [.8 + F, -8.4], [F, -7.6]]), { wash: PAL.cream, ink: PAL.ink, sw: sw * .5 });   // tee
    paint(ribbon(P([[-2.15 + F, -8.9], [-.9 + F, -8.15], [F, -7.5], [.9 + F, -8.15], [2.15 + F, -8.9]]), .6 * u, .6 * u), { wash: LK.col, ink: PAL.ink, sw: sw * .7 });   // hood rim
    for (const s of [-1, 1]) {   // drawstrings with glowing tips
      inkLine(P([[s * .45 + F, -8], [s * .55 + F, -7.2], [s * .5 + F, -6.5]]), sw * .5, PAL.cream, 'inkfine', .4);
      paint(ellPts((s * .5 + F) * u, -6.35 * u, .14 * u, .22 * u, 8), { wash: LK === LOOKS.arman ? STU.glow : PAL.cream, ink: null });
    }
    if (LK === LOOKS.arman) {
      glow((1.6 + F) * u, -7.25 * u, .9 * u, '#7FE6F5', .5);
      paint(ellPts((1.6 + F) * u, -7.25 * u, .38 * u, .38 * u, 6, 0, Math.PI / 6), { wash: STU.glow, ink: PAL.ink, sw: sw * .45 });   // emblem
    }
  } else if (top === 'sweater') {
    paint(P(body), { wash: LK.col, ink: PAL.ink, sw, curv: .3 });
    paint(rectPts((-2.93 + qx) * u, -7.1 * u, 5.9 * u, .55 * u), { wash: LK.accent, ink: null });   // a knitted stripe
    paint(rectPts((-3 + qx) * u, -4.5 * u, 6 * u, .5 * u), { wash: LK.dk, ink: PAL.ink, sw: sw * .6 });
    neck(-.6 + F);
    paint(ribbon(P([[-1.25 + F, -8.45], [-.6 + F, -8.05], [F, -7.95], [.6 + F, -8.05], [1.25 + F, -8.45]]), .45 * u, .45 * u), { wash: LK.dk, ink: PAL.ink, sw: sw * .6 });   // crew neck
  } else {   // jacket (open overshirt over a tee) or suit (closed jacket, shirt and tie)
    const suit = top === 'suit';
    paint(P([[-2.3 + qx, -8.35], [2.3 + qx, -8.35], [2.6 + qx, -6.8], [2.6 + qx, -4.2], [-2.6 + qx, -4.2], [-2.6 + qx, -6.8]]), { wash: LK.inner, ink: PAL.ink, sw: sw * .7, curv: .3 });   // the tee / shirt
    neck(-.6 + F);
    if (suit) paint(P([[-.22 + F, -8.1], [.22 + F, -8.1], [.35 + F, -5.6], [F, -5.1], [-.35 + F, -5.6]]), { wash: LK.tie, ink: PAL.ink, sw: sw * .5 });   // tie
    const open = suit ? .35 : .95;   // how far apart the two fronts hang
    for (const s of [-1, 1]) {
      const pts = s < 0 ? [[-2.55 + qx, -8.35], [-1.25 + F, -8.4], [-open * .6 + F, -6.6], [-open + F, -2.8], [-3.1 + qx, -2.8], [-2.95 + qx, -6.8]]
                        : [[2.55 + qx, -8.35], [1.25 + F, -8.4], [open * .6 + F, -6.6], [open + F, -2.8], [3.1 + qx, -2.8], [2.95 + qx, -6.8]];
      paint(P(pts), { wash: LK.col, ink: PAL.ink, sw, curv: .15 });
      paint(P([[s * 1.25 + F, -8.4], [s * .55 + F, -7.4], [s * 1.1 + F, -7.3], [s * 1.65 + F, -8.2]]), { wash: LK.dk, ink: PAL.ink, sw: sw * .55 });   // lapel
    }
    if (!suit) paint(rectPts((1.35 + F) * u, -6.9 * u, 1 * u, .9 * u), { wash: LK.dk, ink: PAL.ink, sw: sw * .45 });   // chest pocket
    else paint(P([[1.4 + F, -6.8], [2.2 + F, -6.8], [2.1 + F, -6.55], [1.5 + F, -6.55]]), { wash: LK.inner, ink: null });   // pocket square
  }
  if (LK.lanyard) staffBadge(u, sw, F);
  if (LK.headphones) {   // headphones resting around the neck
    inkLine(P([[-1.2 + F, -8.2], [-1.1 + F, -9], [1.1 + F, -9], [1.2 + F, -8.2]]), sw * 1.2, PAL.ink, 'ink', .5);
    for (const s of [-1, 1]) paint(rrPts((s * 1.2 - .45 + F) * u, -8.55 * u, .9 * u, .8 * u, .3 * u), { wash: '#2B2F45', ink: PAL.ink, sw: sw * .6 });
    for (const s of [-1, 1]) paint(ellPts((s * 1.2 + F) * u, -8.15 * u, .22 * u, .18 * u, 8), { wash: LK.accent, ink: null });
  }
  if (LK.pack) {   // backpack straps over the shoulders, the near one with an LED strip
    const straps = view === 'q' ? [1] : [-1, 1];
    for (const s of straps) {
      const x0 = s * 1.65 + (view === 'q' ? .6 : 0);
      paint(P([[x0 - .35, -8.35], [x0 + .35, -8.35], [x0 + .45 * s + .2, -5.7], [x0 + .45 * s - .5, -5.7]]), { wash: STU.pack, ink: PAL.ink, sw: sw * .6 });
      if (s > 0 && LK === LOOKS.arman) inkLine(P([[x0 + .05, -7.8], [x0 + .25, -6.3]]), sw * .8, STU.glow, 'ink', 0);
    }
  }
}

// The Farda staff badge on a brand-blue lanyard: big enough to read as "the teacher" from across the room. A blue header
// with a graduation-cap mark, a photo, name lines and a cyan strip. x0 shifts it toward the heading in 3/4.
function staffBadge(u, sw, x0 = 0) {
  const P = pts => pts.map(([a, b]) => [(a + x0) * u, b * u]);
  for (const s of [-1, 1]) paint(ribbon(P([[s * .75, -8.45], [s * .5, -7.6], [s * .18, -6.95]]), .34 * u, .3 * u), { wash: PAL.brand, ink: PAL.ink, sw: sw * .45 });
  paint(rrPts((x0 - .22) * u, -7.1 * u, .44 * u, .32 * u, .08 * u), { wash: '#B9BDC8', ink: PAL.ink, sw: sw * .4 });   // the clip
  paint(rrPts((x0 - .88) * u, -6.85 * u, 1.76 * u, 2.25 * u, .2 * u), { wash: PAL.cream, ink: PAL.ink, sw: sw * .65 });
  paint(P([[-.88, -6.65], [-.68, -6.85], [.68, -6.85], [.88, -6.65], [.88, -6.2], [-.88, -6.2]]), { wash: PAL.brand, ink: null });   // header
  paint(P([[-.45, -6.55], [0, -6.72], [.45, -6.55], [0, -6.38]]), { wash: PAL.cream, ink: null });   // the cap mark
  paint(P([[-.22, -6.47], [.22, -6.47], [.2, -6.3], [-.2, -6.3]]), { wash: PAL.cream, ink: null });
  inkLine(P([[.4, -6.56], [.42, -6.32]]), sw * .35, '#F0BE46', 'inkfine', 0);
  paint(rrPts((x0 - .7) * u, -6.05 * u, .62 * u, .72 * u, .08 * u), { wash: '#CFE3F5', ink: PAL.ink, sw: sw * .35 });   // photo
  paint(ellPts((x0 - .39) * u, -5.72 * u, .2 * u, .22 * u, 10), { wash: LK.skin, ink: null });
  paint(P([[-.62, -5.52], [-.39, -5.62], [-.16, -5.52], [-.12, -5.36], [-.66, -5.36]]), { wash: LK.col, ink: null });
  for (const [y, w] of [[-5.9, .52], [-5.62, .4]]) inkLine(P([[.1, y], [.1 + w, y]]), sw * .55, '#6E7690', 'inkfine', 0);
  paint(rectPts((x0 - .7) * u, -5.05 * u, 1.4 * u, .17 * u), { wash: STU.glow, ink: null });   // the cyan strip
}

// The head, centred on the current origin.
function stuHead(u, o, sw, view) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  const F = { front: { cx: 0, fw: 1, sides: [-1, 1] }, q: { cx: .85, fw: .8, sides: [-1, 1] }, side: { cx: 1.4, fw: .55, sides: [1] }, back: null }[view];
  const long = LK.hair === 'long';
  if (long && view !== 'side') longHair(u, sw, view, 'back');
  const ear = (x, back) => { paint(ellPts(x * u, .4 * u, .55 * u, .78 * u, 12), { wash: LK.skin, ink: PAL.ink, sw: sw * .7 }); if (!back) inkLine(P([[x - .05, .05], [x + .15, .4], [x - .05, .75]]), sw * .4, LK.skinDk, 'inkfine', .5); };
  if (!long && (view === 'front' || view === 'back')) for (const s of [-1, 1]) ear(s * 3.05, view === 'back');
  // the head: round, a little narrower at the chin; a small nose in profile
  {
    const H = []; for (let i = 0; i < 30; i++) { const a = i / 30 * TAU, low = Math.sin(a) > 0; H.push([Math.cos(a) * 3.15 * u * (low ? 1 - .12 * Math.sin(a) : 1), Math.sin(a) * 3.05 * u]); }
    paint(H, { wash: LK.skin, ink: PAL.ink, sw });
  }
  if (view === 'side') paint(P([[2.85, .35], [3.45, 1.05], [2.9, 1.3]]), { wash: LK.skin, ink: PAL.ink, sw: sw * .6, curv: .5 });
  if (!long && view === 'q') ear(-2.55);
  if (!long && view === 'side') {   // in profile the ear sits on the cheek: an open C with a curl, not a closed ring
    paint(ellPts(-.35 * u, .4 * u, .5 * u, .72 * u, 12), { wash: LK.skin, ink: null });
    inkLine(P([[-.1, -.25], [-.6, -.2], [-.85, .4], [-.6, 1.05], [-.15, 1.1]]), sw * .7, PAL.ink, 'ink', .5);
    inkLine(P([[-.3, .05], [-.55, .4], [-.3, .75]]), sw * .4, LK.skinDk, 'inkfine', .5);
  }
  if (F) {
    push(); translate(F.cx * u, 0); scale(F.fw, 1);
    const bl = clamp(o.blush ?? .35);   // (over 1 adds hatching)
    for (const s of F.sides) {
      const bx = s * (view === 'side' ? 1.3 : 2.05);
      paint(ellPts(bx * u, 1.3 * u, .6 * u, .32 * u, 12), { fill: PAL.rose, fillOp: 60 + 110 * bl, bleed: .2, ink: null });
      if ((o.blush || 0) > 1) for (let k = 0; k < 3; k++) inkLine(P([[bx - .35 + k * .3, 1.45], [bx - .2 + k * .3, 1.1]]), sw * .4, mixCol(PAL.rose, PAL.ink, .3), 'inkfine', 0);
      if (LK.freckles) for (let k = 0; k < 3; k++) paint(ellPts((bx + (k - 1) * .3) * u, (1.1 + (k % 2) * .18) * u, .06 * u, .06 * u, 6), { wash: LK.skinDk, ink: null });
    }
    for (const s of F.sides) { push(); translate(s * 1.2 * u, .35 * u); stuEye(o.eyes === 'wink' ? (s < 0 ? 'happy' : 'open') : o.eyes || 'open', s, u, o, sw); pop(); }
    for (const s of F.sides) stuBrow(s, o.brows || 'neutral', u, sw);
    if (view !== 'side') inkLine(P([[.05, .85], [.28, 1.2], [.05, 1.28]]), sw * .5, LK.skinDk, 'ink', .5);
    stuMouth(o.mouth || 'smile', u, sw);
    if (LK.moustache) paint(ribbon(P([[-.8, 1.62], [-.3, 1.42], [0, 1.5], [.3, 1.42], [.8, 1.62]]), .25 * u, .25 * u), { wash: LK.hairCol, ink: PAL.ink, sw: sw * .4 });
    if (o.gloom > .02) for (let i = 0; i < 5; i++) {   // gloom: hanging lines on the forehead
      const gx = -1.6 + i * .8; if (F.sides.length < 2 && gx < -.4) continue;
      inkLine(P([[gx, -1.6], [gx + .03, -1.6 + .5 * o.gloom * (.7 + .3 * hash(i))]]), sw * .45, mixCol(PAL.indigo, PAL.ink, .3), 'inkfine', 0);
    }
    const g = o.glasses ?? LK.glasses;
    if (g) stuGlasses(u, sw, F.sides, view === 'side' ? (-.35 - F.cx) / F.fw : null, g);
    if (g === 'smart' && o.hud === 'notify' && F.sides.includes(1)) {   // a notification lighting up on the right lens: the distraction
      const pulse2 = .7 + .3 * Math.sin(T * 8);
      glow(1.95 * u, -.05 * u, 1.1 * u * pulse2, '#FF8FB0', .6);
      paint(ellPts(1.95 * u, -.05 * u, .22 * u, .22 * u, 10), { wash: '#FF6F96', ink: PAL.ink, sw: sw * .35 });
      inkLine(P([[1.55, .45], [2.1, .45]]), sw * .4, '#FF6F96', 'inkfine', 0);
    }
    pop();
  }
  if (long) longHair(u, sw, view, 'front'); else stuHair(u, sw, view);
}

// ---------- long hair ----------
// Straight hair, parted to one side, falling over the shoulders in two curtains. part 'back': the mass behind the head
// and the curtains (drawn before the face); 'front': the crown and the side-swept fringe (after it). In profile and
// from behind it's one shape. The ends reach y = 3 + 4.5 * hairLen (head space: the chin is at +3).
function longHair(u, sw, view, part) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), yb = 3 + 4.5 * (LK.hairLen ?? 1), col = LK.hairCol;
  const ends = (x0, x1) => { const out = []; for (let i = 0; i <= 6; i++) { const t = i / 6; out.push([lerp(x0, x1, t), yb + .25 * Math.sin(t * Math.PI * 3) + (hash(i) - .5) * .2]); } return out; };
  const crown = (a0, a1, r = 3.45, cx = 0) => { const o = []; for (let i = 0; i <= 24; i++) { const a = lerp(a0, a1, i / 24); o.push([cx + Math.cos(a) * r, Math.sin(a) * r * .98]); } return o; };
  const strands = list => list.forEach(([a, b, c, d]) => inkLine(P([[a, b], [lerp(a, c, .5) + .1, lerp(b, d, .5)], [c, d]]), sw * .45, LK.hairLt, 'inkfine', .5));
  if (view === 'side') {   // one shape: the crown, the fall down the back, and a front edge behind the cheek
    const pts = crown(-Math.PI * .22, -Math.PI * 1.06).concat([[-3.55, 1.5], [-3.4, yb - .4], ...ends(-2.9, -.6), [-.4, 3.2], [-.3, 1.2], [.25, -.7], [1.2, -1.85], [2.3, -2.05]]);
    paint(P(pts), { wash: col, ink: PAL.ink, sw: sw * .9, curv: .3 });
    strands([[-2.2, -1.8, -2.6, yb - 1], [-1.2, -.5, -1.6, yb - 1.4]]);
    return;
  }
  if (view === 'back') {
    const pts = crown(Math.PI - .05, TAU + .05).concat([[3.55, 1], [3.5, yb - .5], ...ends(3.1, -3.1), [-3.5, yb - .5], [-3.55, 1]]);
    paint(P(pts), { wash: col, ink: PAL.ink, sw: sw * .9, curv: .3 });
    strands([[-1.2, -2.2, -1.6, yb - .6], [.3, -2.6, .1, yb - .5], [1.7, -1.8, 2, yb - .7]]);
    return;
  }
  const sh = view === 'q' ? -.3 : 0, fx = view === 'q' ? .8 : 0, fw = view === 'q' ? .8 : 1, X = ([a, b]) => [a + sh, b];
  if (part === 'back') {   // the mass behind the head, and two curtains over the shoulders with the neck between them
    const pts = crown(Math.PI - .05, TAU + .05, 3.5, sh).concat([[3.6, .8], [3.7, 3.4], [3.35, yb - .45], ...ends(2.8, 1.5), [1.55, 3.1], [1.2, 2.2], [-1.2, 2.2], [-1.55, 3.1], ...ends(-1.5, -2.8), [-3.35, yb - .45], [-3.7, 3.4], [-3.6, .8]].map(X));
    paint(P(pts), { wash: mixCol(col, PAL.ink, .12), ink: PAL.ink, sw: sw * .9, curv: .25 });
    strands([[2.9 + sh, 1.5, 2.6 + sh, yb - .6], [-2.9 + sh, 1.5, -2.6 + sh, yb - .6]]);
    return;
  }
  // front: the crown over the forehead and the side-swept fringe, parted a little right of centre, framing the face
  const F = ([a, b]) => [fx + a * fw, b];
  const pts = crown(Math.PI - .42, TAU + .42, 3.45, fx * .4).concat([[3.05, 1.35], [2.8, -.15], [1.75, -1.6], [.85, -2.3], [-.45, -1.85], [-1.7, -1.05], [-2.55, .15], [-2.9, 1.4]].map(F));
  paint(P(pts), { wash: col, ink: PAL.ink, sw: sw * .9, curv: .3 });
  const s1 = F([-.1, -2.9]), e1 = F([-1.6, -1.3]), s2 = F([1.3, -2.8]), e2 = F([2.4, -1]);
  strands([[...s1, ...e1], [...s2, ...e2]]);
  inkLine(P([F([.85, -2.3]), F([.95, -3.1])]), sw * .5, LK.hairLt, 'inkfine', 0);   // the parting
  if (LK.clip) { const c = F([-1.9, -1.2]); paint(rrPts((c[0] - .45) * u, (c[1] - .15) * u, .9 * u, .3 * u, .12 * u), { wash: LK.clip, ink: PAL.ink, sw: sw * .4 }); }   // a hair clip
}

function stuEye(e, s, u, o, sw) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), lx = (o.lookX || 0) * .22 * u, ly = (o.lookY || 0) * .22 * u;
  const line = (pts, w = 1.3, c = .4) => inkLine(P(pts), sw * w, PAL.ink, 'ink', c), lash = LK.lash || 1;
  const blink = ['open', 'wide', 'sparkle'].includes(e) && ((T * .8 + (o.seed || 0) * 1.3 + (s > 0 ? .02 : 0)) % 3.7) < .12;
  if (blink) e = 'closed';
  const open = (k = 1, star = false) => {
    paint(ellPts(0, 0, .56 * u * k, .72 * u * k, 16), { wash: '#FFFDF8', ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(lx, ly + .06 * u, .43 * u * k, .55 * u * k, 14), { wash: LK.iris, ink: null });
    paint(ellPts(lx, ly + .1 * u, .25 * u, .32 * u, 10), { wash: PAL.ink, ink: null });
    if (star) paint(starPts(lx - .16 * u, ly - .18 * u, .3 * u, .35, 4), { wash: PAL.cream, ink: null });
    else paint(ellPts(lx - .17 * u, ly - .2 * u, .15 * u, .17 * u, 8), { wash: PAL.cream, ink: null });
    paint(ellPts(lx + .15 * u, ly + .28 * u, .07 * u, .07 * u, 6), { wash: PAL.cream, ink: null });
    line([[-.64 * k, -.28 * k], [-.3 * k, -.7 * k], [.28 * k, -.74 * k], [.66 * k, -.36 * k]], lash > 1 ? 1.8 : 1.4, .5);   // upper lid
    line([[s * .52 * k, -.5 * k], [s * .85 * k, -.68 * k]], .9, 0);   // a lash flick at the outer corner
    if (lash > 1) line([[s * .6 * k, -.3 * k], [s * .92 * k, -.38 * k]], .7, 0);
  };
  // eyelids: skin drawn down over the eye to y0 (sl tilts it: + drops the inner end, toward the nose), or up from below
  const lid = (y0, sl = 0, w = 1.5) => {
    const yi = y0 + sl, yo = y0 - sl * .3, [yl, yr] = s > 0 ? [yi, yo] : [yo, yi];
    paint(P([[-.85, -1.1], [.85, -1.1], [.85, yr], [-.85, yl]]), { wash: LK.skin, ink: null });
    line([[-.66, yl + .02], [0, (yl + yr) / 2 - .06], [.68, yr + .02]], w, .4);
  };
  const low = y0 => { paint(P([[-.85, y0], [.85, y0], [.85, 1.05], [-.85, 1.05]]), { wash: LK.skin, ink: null }); line([[-.55, y0 + .03], [.55, y0 + .03]], .6, .3); };
  switch (e) {
    case 'open': open(); break;
    case 'wide': open(1.14); break;
    case 'half': open(); lid(.02); break;
    case 'sleepy': open(); lid(.3, 0, 1.6); low(.6); break;
    case 'narrow': open(); lid(-.12); low(.34); break;
    case 'angry': open(); lid(-.28, .38); break;
    case 'tired':
      open(); lid(.05);
      for (const d of [0, .2]) inkLine(P([[-.5, .82 + d], [0, .95 + d], [.5, .82 + d]]), sw * .4, mixCol(LK.skinDk, PAL.violet, .35), 'inkfine', .5);   // dark circles
      break;
    case 'dull':   // flat, unlit: small pupils, no shine, heavy lids
      paint(ellPts(0, 0, .56 * u, .72 * u, 16), { wash: '#FFFDF8', ink: PAL.ink, sw: sw * .5 });
      paint(ellPts(lx, ly + .1 * u, .3 * u, .38 * u, 12), { wash: LK.iris, ink: null });
      paint(ellPts(lx, ly + .12 * u, .15 * u, .18 * u, 8), { wash: PAL.ink, ink: null });
      lid(-.02, 0, 1.3); break;
    case 'scared': {   // wide whites, tiny trembling pupils
      const j = Math.sin(T * 40) * .03 * u;
      paint(ellPts(0, 0, .64 * u, .82 * u, 16), { wash: '#FFFDF8', ink: PAL.ink, sw: sw * .6 });
      paint(ellPts(lx * .5 + j, ly * .5, .2 * u, .24 * u, 10), { wash: LK.iris, ink: null });
      paint(ellPts(lx * .5 + j, ly * .5, .1 * u, .12 * u, 8), { wash: PAL.ink, ink: null });
      break;
    }
    case 'teary': {
      open();
      const w = Math.sin(T * 7 + s) * .04;
      paint(P([[-.52, .38 + w], [.52, .38 - w], [.36, .68], [0, .76], [-.36, .68]]), { wash: PAL.sky, washOp: 220, ink: PAL.ink, sw: sw * .35, curv: .5 });
      paint(ellPts(-.2 * u, .5 * u, .1 * u, .06 * u, 6), { wash: '#FFFFFF', ink: null });
      break;
    }
    case 'cry': {   // shut tight, tears running down the cheeks
      line([[-.6, .05], [0, -.25], [.6, .05]], 1.4, .5);
      const R = []; for (let k = 0; k <= 5; k++) R.push([(s * .35 + Math.sin(T * 8 + k * 1.3 + s) * .1 * k / 5) * u, (.25 + k * .42) * u]);
      paint(ribbon(R, .28 * u, .5 * u), { wash: PAL.sky, washOp: 230, ink: PAL.ink, sw: sw * .35 });
      break;
    }
    case 'yawn':   // squeezed, with a little tear at the outer corner
      line([[-.6, -.05], [0, .15], [.6, -.05]], 1.4, .5);
      paint(ellPts(s * .75 * u, .3 * u, .13 * u, .18 * u, 8), { wash: PAL.sky, ink: PAL.ink, sw: sw * .3 });
      break;
    case 'sparkle': open(1.08, true); break;
    case 'focus':
      open();
      paint(P([[-.9, -1.05], [.9, -1.05], [.9, -.12], [-.9, -.12]]), { wash: LK.skin, ink: null });
      line([[-.72, -.1], [0, -.2], [.74, -.12]], 1.5, .4); break;
    case 'happy': line([[-.62, .2], [0, -.32], [.62, .2]], 1.5, .5); break;
    case 'closed': line([[-.62, -.05], [0, .28], [.62, -.05]], 1.3, .5); break;
    case 'squeeze': line([[.55 * -s, -.5], [-.55 * -s, 0], [.55 * -s, .45]], 1.4, 0); break;
    default: open();
  }
}
function stuBrow(s, kind, u, sw) {
  // inner end near the nose, outer end at the temple; raised = more negative y
  const k = { neutral: [0, 0], up: [-.3, -.25], down: [.32, -.05], flat: [.18, .18], worried: [-.35, .15], sad: [-.45, .28], angry: [.5, -.15],
    raise: s > 0 ? [-.45, -.45] : [0, 0], skeptic: s > 0 ? [-.45, -.45] : [.3, .25] }[kind] || [0, 0];
  const inner = [s * .55, -.95 + k[0]], mid = [s * 1.2, -1.15 + (k[0] + k[1]) / 2], outer = [s * 1.85, -.95 + k[1]];
  const col = LK.hair === 'bald' ? mixCol(LK.hairCol, PAL.ink, .3) : LK.hairCol;
  paint(ribbon([inner, mid, outer].map(([a, b]) => [a * u, b * u]), (LK.lash > 1 ? .28 : .34) * u, .14 * u), { wash: col, ink: null });
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
    case 'frown': line([[-.6, 2.15], [0, 1.85], [.6, 2.15]]); break;
    case 'meh': line([[-.5, 1.95], [.2, 1.98], [.6, 2.14]], .9, .4); break;
    case 'side': line([[.05, 2.02], [.75, 1.94]], .9, 0); break;
    case 'pout': line([[-.3, 1.95], [0, 1.8], [.3, 1.95]], 1, .6); line([[-.18, 2.12], [0, 2.18], [.18, 2.12]], .6, .6); break;
    case 'sigh':
      paint(ellPts(.35 * u, 2.02 * u, .2 * u, .15 * u, 10), { wash: STU.mouth, ink: PAL.ink, sw: sw * .45 });
      for (let k = 0; k < 2; k++) { const a = frac(T * .8 + k * .5); paint(ellPts((.9 + a * .9) * u, (2 - a * .3) * u, (.1 + .15 * a) * u, (.08 + .12 * a) * u, 8), { wash: PAL.cream, washOp: 230 * (1 - a), ink: null }); }
      break;
    case 'yawn':
      paint(ellPts(0, 2.3 * u, .55 * u, .78 * u, 16), { wash: STU.mouth, ink: PAL.ink, sw: sw * .6 });
      paint(ellPts(0, 2.75 * u, .35 * u, .2 * u, 10), { wash: PAL.rose, ink: null }); break;
    case 'teeth':
      paint(rrPts(-.85 * u, 1.72 * u, 1.7 * u, .55 * u, .15 * u), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
      line([[-.8, 2], [.8, 2]], .4, 0);
      for (const tx of [-.42, 0, .42]) line([[tx, 1.76], [tx, 2.23]], .35, 0);
      break;
    case 'wail': {
      const w = Math.sin(T * 26) * .05;
      paint(P([[-.9, 1.9 + w], [-.35, 1.65], [.35, 1.65 - w], [.9, 1.9], [.7, 2.6], [-.7, 2.6]]), { wash: STU.mouth, ink: PAL.ink, sw: sw * .6, curv: .35 });
      paint(ellPts(0, 2.45 * u, .45 * u, .15 * u, 10), { wash: PAL.rose, ink: null }); break;
    }
  }
}
// Glasses. smart: round frames with a cyan corner, a tiny HUD on the right lens and a light at the temple;
// round: the same frames, plain; plain: small rectangular reading glasses. earX: in profile, where the arm runs to.
function stuGlasses(u, sw, sides, earX, kind = 'smart') {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), smart = kind === 'smart';
  for (const s of sides) {
    const cx = s * 1.2;
    if (kind === 'plain') paint(rrPts((cx - .85) * u, -.15 * u, 1.7 * u, 1.05 * u, .25 * u), { ink: PAL.ink, sw: sw * .6 });
    else paint(rrPts((cx - .95) * u, -.42 * u, 1.9 * u, 1.55 * u, .7 * u), { ink: PAL.ink, sw: sw * .75 });
    if (smart) inkLine(P([[cx + s * .55, -.4], [cx + s * .9, -.1]]), sw * .7, STU.glow, 'ink', .4);
    if (smart && s > 0) {
      glow((cx + .45) * u, .05 * u, .8 * u, '#7FE6F5', .18);
      inkLine(P([[cx + .25, -.15], [cx + .6, -.2], [cx + .75, .1]]), sw * .45, STU.glow, 'inkfine', .5);
      paint(ellPts((cx + .45) * u, .3 * u, .07 * u, .07 * u, 6), { wash: STU.glow, ink: null });
    }
  }
  if (sides.length > 1) {
    inkLine(P([[-.2, .05], [0, -.08], [.2, .05]]), sw * .7, PAL.ink, 'ink', .5);
    if (LK.hair !== 'long') for (const s of [-1, 1]) inkLine(P([[s * 2.15, .1], [s * 2.95, .2]]), sw * .7, PAL.ink, 'ink', 0);
  } else {
    inkLine(P([[.2, .1], [earX + .9, .2]]), sw * .7, PAL.ink, 'ink', 0);
    if (smart) paint(rrPts((earX * .5 - .35) * u, .02 * u, .7 * u, .28 * u, .12 * u), { wash: STU.glow, ink: PAL.ink, sw: sw * .35 });   // the temple light
  }
}
// Hair as one outline: a crown over the top (bumpy for curls), then its lower edge (a fringe in front, the nape behind).
// curly, short (a side-swept fringe), buzz (close-cropped), bald (a fringe of grey at the sides and back).
function stuHair(u, sw, view) {
  const type = LK.hair, P = pts => pts.map(([a, b]) => [a * u, b * u]);
  if (type === 'bald') {   // what's left: a band around the back, over the ears
    const band = s => [[s * 3.3, -1.2], [s * 2.75, -1.35], [s * 2.55, -.4], [s * 2.75, .75], [s * 3.2, .9]];
    if (view === 'front') for (const s of [-1, 1]) paint(P(band(s)), { wash: LK.hairCol, ink: PAL.ink, sw: sw * .7, curv: .4 });
    else if (view === 'q') paint(P(band(-1).map(([a, b]) => [a + .2, b])), { wash: LK.hairCol, ink: PAL.ink, sw: sw * .7, curv: .4 });
    else if (view === 'side') paint(P([[-1.1, -1.3], [-3.3, -.6], [-3.1, 1.6], [-1.6, 2.2], [-1.3, .9]]), { wash: LK.hairCol, ink: PAL.ink, sw: sw * .7, curv: .4 });
    else { const pts = []; for (let i = 0; i <= 14; i++) { const a = -.35 + i / 14 * (Math.PI + .7); pts.push([Math.cos(a) * 3.3, Math.sin(a) * 3.2 - .2]); } paint(P(pts.concat([[-2.4, .3], [0, 1.2], [2.4, .3]])), { wash: LK.hairCol, ink: PAL.ink, sw: sw * .7, curv: .4 }); }
    return;
  }
  const amp = { curly: .5, short: .14, buzz: .05 }[type] ?? .5, base = type === 'buzz' ? 3.2 : 3.3, bumps = type === 'curly' ? 9 : 6;
  const fr = (xa, xb, curls = 5) => type === 'curly' ? fringe(xa, xb, curls) : type === 'buzz' ? [[xa, -2.3], [lerp(xa, xb, .5), -2.4], [xb, -2.3]] : swoop(xa, xb);
  const S = {
    front: { a0: Math.PI - .15, a1: TAU + .15, edge: [[2.95, -.3], [2.7, -1.3], ...fr(2.4, -2.4), [-2.7, -1.3], [-2.95, -.3]] },
    q: { a0: Math.PI - .5, a1: TAU + .1, edge: [[3.05, -.4], [2.85, -1.4], ...fr(2.6, -.8), [-1.9, -.9], [-2.25, .85]] },
    side: { a0: Math.PI * .72, a1: TAU - .12, edge: [[3.05, -.9], ...fr(2.8, .9, 3), [-.2, -1.3], [-1.05, -.55], [-1.35, .9], [-1.85, 2.1]] },
    back: { a0: Math.PI - .35, a1: TAU + .35, edge: nape() },
  }[view];
  if (type === 'buzz' && view !== 'back') { S.a0 = view === 'side' ? Math.PI * .8 : Math.PI - .05; S.a1 = TAU + .05; S.edge = S.edge.filter(([, b]) => b < -.5); }
  const pts = [], n = 44;
  for (let i = 0; i <= n; i++) { const t = i / n, a = lerp(S.a0, S.a1, t), r = base + amp * Math.abs(Math.sin(t * Math.PI * bumps)); pts.push([Math.cos(a) * r * u, Math.sin(a) * r * u]); }
  for (const [a, b] of S.edge) pts.push([a * u, b * u]);
  paint(pts, { wash: LK.hairCol, ink: PAL.ink, sw: sw * .9, curv: .35 });
  for (let i = 0; i < 6; i++) {   // a few lighter strands
    const a = lerp(S.a0 + .4, S.a1 - .4, (i + .5) / 6), r = 2.6 - .3 * hash(i + 3), cx = Math.cos(a) * r, cy = Math.sin(a) * r;
    if ((view !== 'back' && cy > -1.6) || type === 'buzz') continue;
    const strand = type === 'curly' ? [[cx - .35, cy + .2], [cx - .1, cy - .2], [cx + .3, cy - .1], [cx + .25, cy + .2]] : [[cx - .5, cy + .15], [cx, cy - .1], [cx + .5, cy + .05]];
    inkLine(strand.map(([p, q]) => [p * u, q * u]), sw * .5, LK.hairLt, 'inkfine', .6);
  }
  function fringe(xa, xb, curls = 5) {
    const out = []; for (let i = 0; i <= 12; i++) { const t = i / 12; out.push([lerp(xa, xb, t), -2.05 + .45 * Math.abs(Math.sin(t * Math.PI * curls))]); } return out;
  }
  function swoop(xa, xb) {   // a side-swept fringe: low at the right, high at the left, in two soft points
    return [[xa, -1.35], [lerp(xa, xb, .25), -1.7], [lerp(xa, xb, .38), -1.5], [lerp(xa, xb, .6), -2], [lerp(xa, xb, .72), -1.85], [xb, -2.35]];
  }
  function nape() { const out = []; for (let i = 0; i <= 12; i++) { const t = i / 12; out.push([lerp(2.75, -2.75, t), (type === 'curly' ? 1.55 : 1) + (type === 'curly' ? .45 : .12) * Math.abs(Math.sin(t * Math.PI * 5))]); } return out; }
}

// The AI companion, Yara: a small floating robot with a screen face and an antenna. s = its radius in px.
// mood: happy, normal, blink, heart, shy. It bobs on its own; its thruster glows under it.
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
    else if (mood === 'shy') { inkLine([[ex - s * .13, ey + s * .04], [ex + s * .13, ey - s * .04]], sw * .9, STU.glow, 'ink', 0); paint(ellPts(ex, ey + s * .22, s * .1, s * .05, 8), { wash: '#FF7FA8', ink: null }); }
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

// ---------- model sheets ----------
(() => {
  const label = (txt, x, y, size = 22, o = {}) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .85, weight: 600, ...o });
  const floor = (y, x0, x1) => inkLine([[x0, y + 6], [(x0 + x1) / 2, y + 4], [x1, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);
  const idle = (t, i) => ({ aL: .12 + .03 * Math.sin(t * 2 + i), aR: .12 - .03 * Math.sin(t * 2 + i) });
  const swatches = (cols, x0, y) => cols.forEach(([c, fa], i) => {
    const x = x0 - i * 110; boilSeed('swatch ' + i);
    paint(ellPts(x, y, 34, 34, 20, 1), { wash: c, ink: PAL.ink, sw: .7 });
    label(fa, x, y + 60, 19);
  });

  // Arman: studio.html?loop=student
  LOOPS.student = t => {
    label('نماها', 620, 42, 30);
    [['front', 'روبه‌رو'], ['q', 'سه‌رخ'], ['side', 'نیم‌رخ'], ['back', 'پشت']].forEach(([v, fa], i) => {
      const x = 180 + i * 290;
      student(x, 560, 28, { ...expr('neutral'), view: v, seed: i, ...idle(t, 0) });
      label(fa, x, 600);
    });
    floor(560, 40, 1160);
    label('حالت‌های چهره', 1590, 42, 30);
    const names = ['happy', 'curious', 'amazed', 'focused', 'idea', 'confused', 'laugh', 'wink'];
    names.forEach((n, i) => {
      const x = 1810 - (i % 4) * 158, y = i < 4 ? 190 : 430, u = 17, E = expr(n, { seed: i });
      boilSeed('face ' + i); headOf('arman', x, y, u, { ...E, tilt: 0 });
      if (E.emote) emote(E.emote, x + 3.3 * u, y - 3.6 * u, u * .7, 1, t);
      label(E.fa, x, y + 4.4 * u, 21);
    });
    label('ژست‌ها', 560, 655, 30);
    const G = 1015, u2 = 19, w = t * .9;
    student(170, G, u2, { ...expr('happy'), view: 'side', walk: w, dy: -Math.abs(Math.sin(w * TAU)) * .3, aR: .35 * Math.sin(w * TAU), bR: .5, seed: 1 });
    buddy(60, G - 13 * u2, 22, { mood: 'happy', key: 1 });
    student(500, G, u2, { ...expr('focused', { lookX: .6 }), aR: 1.35 + .05 * Math.sin(t * 3), bR: -.15, aL: .2, bL: .6, seed: 2 });
    holo(720, G - 9.8 * u2, 150, 100);
    buddy(360, G - 12.5 * u2, 20, { mood: 'normal', key: 2, phase: 1 });
    const k = frac(t / 1.4), hop = jump(k * 1.4, .3, .8, 2.5);
    student(880, G, u2, { ...expr('amazed'), dy: hop.dy, sq: hop.sq, aL: 2.6 + .15 * Math.sin(t * 9), aR: 2.7 - .15 * Math.sin(t * 9), bL: -.3, bR: -.3, seed: 3 });
    buddy(1010, G - 13.5 * u2, 20, { mood: 'heart', key: 3, phase: 2 });
    floor(G, 40, 1060);
    label('دستیار هوشمند (یارا)', 1230, 655, 26);
    buddy(1230, 790, 62, { mood: 'happy', key: 4 });
    label('تبلت هولوگرافیک', 1560, 655, 26);
    holo(1560, 790, 230, 150);
    label('رنگ‌ها', 1840, 905, 26, { align: 'right' });
    swatches([[STU.hoodie, 'هودی'], [STU.glow, 'نور'], [STU.pants, 'شلوار'], [STU.skin, 'پوست'], [STU.hair, 'مو'], [STU.shoe, 'کفش']], 1840, 975);
  };
  LOOPS.student.len = 4;

  // every expression, as heads: studio.html?loop=studentFaces
  LOOPS.studentFaces = t => {
    label('حالت‌های چهره', 960, 34, 32);
    const names = Object.keys(STU_EXPR).filter(n => n !== 'neutral'), u = 18;
    names.forEach((n, i) => {
      const c = i % 6, r = Math.floor(i / 6), x = 1765 - c * 305, y = 150 + r * 203, E = expr(n, { seed: i });
      boilSeed('face ' + n); headOf('arman', x, y, u, E);
      if (E.emote) emote(E.emote, x + 3.4 * u, y - 3.7 * u, u * .7, 1, t);
      label(E.fa, x, y + 4.1 * u, 22);
    });
  };
  LOOPS.studentFaces.len = 4;

  // the Farda teacher: studio.html?loop=teacher
  LOOPS.teacher = t => {
    label('مدرس فردا · نماها', 640, 42, 30);
    [['front', 'روبه‌رو'], ['q', 'سه‌رخ'], ['side', 'نیم‌رخ'], ['back', 'پشت']].forEach(([v, fa], i) => {
      const x = 180 + i * 300;
      person(x, 640, 26, { who: 'mentor', ...expr('neutral'), view: v, seed: i, ...idle(t, i) });
      label(fa, x, 680);
    });
    floor(640, 40, 1180);
    label('حالت‌های چهره', 1590, 42, 30);
    const faces = [['neutral', 'لبخند گرم', {}], ['happy', 'توضیح دادن', { mouth: 'grin', eyes: 'open' }], ['curious', 'گوش دادن', { mouth: 'smile', lookX: -.4, lookY: 0 }],
                   ['proud', 'تشویق', { eyes: 'happy', mouth: 'grin' }], ['thinking', 'فکر کردن', { emote: null }], ['laugh', 'خنده', {}]];
    faces.forEach(([n, fa, over], i) => {
      const x = 1800 - (i % 3) * 200, y = i < 3 ? 200 : 450, u = 18, E = expr(n, { seed: i, ...over });
      boilSeed('tface ' + i); headOf('mentor', x, y, u, { ...E, tilt: 0 });
      label(fa, x, y + 5.6 * u, 21);
    });
    label('ژست‌ها', 560, 712, 30);
    const G = 1030, u2 = 17;
    // explaining at the holographic board, pointing with the stylus
    holo(480, G - 10.4 * u2, 250, 160);
    person(250, G, u2, { who: 'mentor', ...expr('happy', { mouth: 'grin', lookX: .7 }), aR: 1.55 + .08 * Math.sin(t * 3), bR: .1, aL: .35, bL: 1.3, seed: 5,
      handR: (u, sw) => inkLine([[0, 0], [0, 2.2 * u]], sw * 1.2, PAL.ink, 'ink', 0), handL: (u, sw) => paint(rrPts(-1 * u, -.6 * u, 2 * u, 1.3 * u, .15 * u), { wash: '#2B2F45', ink: PAL.ink, sw: sw * .6 }) });
    // beside a student, leaning in to listen
    person(820, G, u2, { who: 'mentor', ...expr('curious', { mouth: 'smile', lookX: .6, lookY: .3 }), rot: .05, aL: .4, bL: 1.4, aR: .25, bR: .5, tilt: .12, seed: 6 });
    student(1000, G, u2 * .95, { ...expr('happy', { lookX: -.6 }), aL: 2.4, bL: -.2, seed: 7 });
    floor(G, 40, 1180);
    label('رنگ‌ها', 1840, 700, 26, { align: 'right' });
    const M = LOOKS.mentor;
    swatches([[M.col, 'پیراهن'], [M.hairCol, 'مو'], [M.inner, 'تی‌شرت'], [M.pants, 'شلوار'], [M.skin, 'پوست'], [PAL.brand, 'کارت فردا']], 1840, 790);
    label('کارت شناسایی فردا، قلم و تبلت همراه همیشگی او هستند', 1560, 930, 22);
  };
  LOOPS.teacher.len = 4;

  // the classmates, the crowded class's teacher and the crowd: studio.html?loop=classmates
  LOOPS.classmates = t => {
    label('هم‌کلاسی‌ها در فردا', 960, 42, 30);
    const mates = [['sara', 'happy'], ['nima', 'excited'], ['mahsa', 'curious'], ['kian', 'confident']];
    mates.forEach(([who, e], i) => {
      const x = 1700 - i * 420, L = LOOKS[who];
      person(x - 90, 520, 22, { who, ...expr('neutral'), seed: i, ...idle(t, i) });
      person(x + 100, 520, 22, { who, ...expr('neutral'), view: 'q', seed: i + 4, ...idle(t, i + 1) });
      boilSeed('mface ' + i); headOf(who, x + 5, 635, 12, expr(e, { seed: i, emote: null }));
      label(L.fa, x + 5, 560, 26);
    });
    floor(520, 40, 1880);
    label('کلاس شلوغِ «امروز»', 700, 740, 30);
    person(1650, 1030, 17, { who: 'oldTeacher', ...expr('neutral', { mouth: 'flat', brows: 'flat' }), seed: 1, ...idle(t, 2) });
    person(1800, 1030, 17, { who: 'oldTeacher', view: 'back', seed: 2, aR: 1.7, bR: .7 });
    label(LOOKS.oldTeacher.fa, 1740, 1062, 22);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 7; c++) {   // the crowd, from behind, in rows
      const x = 220 + c * 150 + r * 70, y = 930 + r * 105, who = hash(r * 7 + c) > .5 ? 'crowdA' : 'crowdB';
      person(x, y, 8.5 + r * 1.5, { who, view: 'back', seed: r * 7 + c, boilKey: 'crowd ' + r + c, noShadow: true });
    }
    label('جمعیت کلاس (خاکستری و بی‌چهره)', 700, 1062, 22);
  };
  LOOPS.classmates.len = 4;
})();
