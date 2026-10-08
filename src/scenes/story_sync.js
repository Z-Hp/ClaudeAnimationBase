// story_sync.js — the story fitted to its song, assets/music.m4a (115 bpm, first downbeat 0.51 s; a bar is 2.087 s).
// The shots in story_1..4 are written at their own pace (the written times in the second column); this table replays
// them on the song's clock so the cuts fall on bar lines and the story's moments on the lyrics that sing them:
//   intro   0–17     «شب... نورِ آبیِ مانیتور / دستی که بالا رفت، اما کسی ندید»        the night, the video that can't answer
//   verse 1 17–40    «بین هزار تا سر... دستمو بالا بردم... هیچ‌کی ندید منو... پازلِ به‌هم‌ریخته»   the crowded class; the pieces
//   break   40–42    (silence)                                                         he looks up at the screen
//   pre     42–61    «سرچ کردم... یه نورِ فیروزه‌ای... یک در باز شد رو به فردای من»     search, the doors, the simulator, Yara
//   chorus  61–86    «از امروز به فردا بیایید! ... کلاس هم‌اندازهٔ دنیای توئه / سؤالت همون لحظه دیده می‌شه / تکه‌تکه...»
//   verse 2 86–111   «استاد کنارم نشست... اول پدیده، بعد فرمول... دستیار هوشمند... تا بفهمم، نه فقط حفظ کنم»
//   bridge  111–128  «پروژه‌ای ساختم... پازل کامل شد... دستِ دیگه‌ای بالا رفته... دستشو می‌گیرم»
//   final   128–153  «از امروز به فردا بیایید! جایی که مسیر روشن می‌شه / ۰۱ ۰۲ ۰۳»      the path at dawn
//   outro   153–166  «همون میز، همون لپ‌تاپ... طلوعِ نوره... از امروز... به فردا.»       the morning; the end card
// Change a time here (and check the frames around it) to move a moment; STORYBOARD_STORY.md has the story per shot.
(() => {
  const BRAND = [PAL.brand, PAL.cyan];
  resync([
    // Act 1, «امروز»
    [0, 0],                                                   // the night room, the lecture on the screen
    [10.95, 14],                                              // over his shoulder: a hand raised to a video
    [17.21, 22, { pins: [[10.2, 25.8], [14.3, 29.9]] }],      // the band comes in: the crowded class; «دستمو بالا بردم» / «هیچ‌کی ندید منو»
    [31.82, 38, { pins: [[2.5, 33.3]] }],                     // the board too simple, the bored close-up, the bell
    [35.99, 44, { pins: [[6.3, 40.4]] }],                     // «پازلِ به‌هم‌ریخته»; in the break he looks up
    // Act 2, finding Farda
    [42.25, 52, { pins: [[3, 46.42]] }],                      // «سرچ کردم تو تاریکی: فهمیدنِ واقعی»; «یه نورِ فیروزه‌ای» lights a result
    [48.51, 57, { pins: [[2, 51.3], [3.2, 53]] }],            // «یک در باز شد رو به فردای من»
    [54.77, 62],                                              // the spring simulator
    [57.9, 66],                                               // the first piece; Yara wakes; the flash lands on the chorus
    // Act 3, «فردا»
    [61.03, 70, { pins: [[6.3, 69.2]] }],                     // «از امروز به فردا بیایید!» the title; «کلاس هم‌اندازهٔ دنیای توئه» the cards
    [73.56, 82, { from: 4.5, to: 8.5, wipeIn: BRAND }],       // «سؤالت همون لحظه دیده می‌شه»: his hand answered; iris into his eye
    [77.73, SHOT_FNS.mindPieces],                             // «تکه‌تکه، پازلِ ذهنت آروم سرِ جاش چیده می‌شه»
    [86.08, 82, { from: 8.5, pins: [[15, 93.2]], wipeIn: BRAND }],   // «استاد کنارم...»: a wrong answer is fine; «اول پدیده، بعد فرمول»
    [98.6, 104, { pins: [[3.2, 102.8]] }],                    // «دستیار هوشمند کنارم بود / تا بفهمم، نه فقط حفظ کنم»
    [111.12, 116, { to: 3.3 }],                               // «پروژه‌ای ساختم با اسم خودم»: the robot
    [113.5, 122.6, { from: 1.2, wipeIn: [PAL.cyan, PAL.brand] }],    // the project on the big screen; the star
    [115.3, 126, { from: 7, wipeIn: BRAND }],                 // «پازل کامل شد، آینده روشنه»: the exam paper, the puzzle complete
    // Act 4, ready for the future
    [119.47, 138],                                            // «دستِ دیگه‌ای بالا رفته تو کلاس / دستشو می‌گیرم»
    [127.82, 146, { to: 25.04 }],                             // «از امروز به فردا بیایید! جایی که مسیر روشن می‌شه / ۰۱ ۰۲ ۰۳» (timed in bars inside)
    [152.86, 154],                                            // «همون میز، همون لپ‌تاپ»: the morning
    [157.04, 158],                                            // «طلوعِ نوره...»: the dawn hill; «از امروز... به فردا.» the name and the slogan
  ]);
})();
