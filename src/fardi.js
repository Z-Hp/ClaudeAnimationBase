// fardi.js: Fardi (فردی), the Farda Institute's mascot. It's Clawd's rig (the views, emotions, arms, legs and hooks
// all work the same) in the institute's colours: a cyan block, the website's dark-mode accent, so it reads against the
// cosmic indigo nights and the warm dawns alike, with round glasses (the teacher) and a mortarboard with a gold tassel
// (the student). Draw it with fardi() wherever you'd use clawd(); every clawd() option works.
//
//   fardi(x, y, 24, fardiEmotions(t, [[0, 'thinking'], [1.2, 'idea']]))     acted mood changes, in Fardi's colours
//   fardi(x, y, 24, { ...feel('happy', t), glasses: false, hat: 'party' })   any option overrides the defaults
const FARDI = { col: '#4CC3DA', dk: '#2A8FA8', lt: '#A6EAF4' };
function fardi(x, y, u, o = {}) { clawd(x, y, u, { ...FARDI, hat: 'grad', glasses: true, ...o }); }
// emotions() for Fardi: during a mood change the colours cross-fade from Fardi's cyan, not Clawd's clay. Outside a
// change it returns no colours, so fardi()'s own (and the mood's tint) apply.
function fardiEmotions(t, keys, o = {}) { return emotions(t, keys, { ...FARDI, ...o }); }

// Fardi's model sheet: studio.html?loop=fardi, or node render.mjs --loop=fardi --sheet=1 --cols=1 --w=1920 --out=docs/fardi.jpg
(() => {
  const label = (txt, x, y, size = 22) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .8, weight: 500 });
  const floor = y => inkLine([[80, y + 6], [W / 2, y + 4], [W - 80, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);
  LOOPS.fardi = t => {
    // row 1: the five key views
    ['front', 'q', 'side', 'qback', 'back'].forEach((v, i) => { const x = 240 + i * 360; fardi(x, 380, 19, { ...feel('neutral', t, { seed: i }), view: v }); label(v, x, 422); });
    floor(380);
    // rows 2 and 3: a range of emotions (every emotion in EMO works)
    const moods = [['happy', 'شاد'], ['excited', 'هیجان'], ['proud', 'افتخار'], ['love', 'عشق'], ['thinking', 'فکر'], ['idea', 'ایده'], ['determined', 'مصمم'], ['hopeful', 'امید'],
                   ['confused', 'گیج'], ['surprised', 'غافلگیر'], ['bored', 'بی‌حوصله'], ['sleepy', 'خواب‌آلود'], ['sad', 'غمگین'], ['nervous', 'نگران'], ['cool', 'باحال'], ['laugh', 'خنده']];
    moods.forEach(([m, fa], i) => {
      const x = 120 + (i % 8) * 240, y = i < 8 ? 700 : 990;
      fardi(x, y, 12, feel(m, t, { seed: i })); label(`${fa} · ${m}`, x, y + 36, 19);
    });
    floor(700); floor(990);
  };
  LOOPS.fardi.len = 4;
})();
