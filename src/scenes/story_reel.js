// story_reel.js — the Instagram Reels framing (render.mjs --reel / studio.html?reel): where the 9:16 window sits on the
// 1920×1080 design screen, shot by shot, on the song's clock (the same rows as story_sync.js). Each row is
// [shot start, keys], keys [song time, cx, cy, h]: the window's centre and its height in design-screen pixels (its
// width is h × 9/16; h 1080 fills the frame's height, larger zooms out to show more, using the walls, sky and floor
// that run past the frame). Between keys the window eases, so a pan between two characters is two keys; a key with
// almost the same time as the one before it is a cut. Positions are on the design screen, after each shot's own
// camera, so read them off a landscape frame (render.mjs --sheet) at the same time.
(() => {
  const ROWS = [
    // Act 1
    [0, [[0, 1000, 530, 1700], [3.08, 1000, 530, 1650], [3.1, 960, 520, 2300], [5.06, 960, 520, 2300], [5.08, 990, 530, 1650], [10.95, 980, 530, 1600]]],   // night; the lecture insert
    [10.95, [[10.95, 930, 560, 1700], [17.21, 950, 560, 1650]]],                       // over the shoulder: the hand and the video
    [17.21, [[17.21, 1050, 520, 1500], [22, 1150, 560, 1350], [25.2, 1270, 640, 1150], [31.82, 1300, 660, 1050]]],   // the crowd: board and teacher, then him
    [31.82, [[31.82, 1000, 420, 1500], [33.28, 1000, 420, 1500], [33.3, 1000, 560, 1250], [35.99, 1000, 560, 1220]]],   // the board too simple; the bored face
    [35.99, [[35.99, 960, 500, 1500], [42.25, 980, 500, 1450]]],                       // the pieces that won't fit
    // Act 2
    [42.25, [[42.25, 960, 520, 2000], [48.51, 960, 520, 2000]]],                         // the search (insert)
    [48.51, [[48.51, 990, 560, 2300], [51.3, 1060, 600, 2100], [54.77, 1160, 640, 1800]]],   // the four doors; into the open one
    [54.77, [[54.77, 820, 540, 1700], [56.2, 820, 540, 1700], [57.3, 1250, 560, 1700], [57.9, 1250, 560, 1700]]],   // the spring, then its graph
    [57.9, [[57.9, 900, 560, 1450], [59.4, 1000, 520, 1450], [61.03, 1050, 520, 1450]]],   // the piece; Yara wakes
    // Act 3
    [61.03, [[61.03, 948, 470, 2350], [63.2, 948, 470, 2350], [64.4, 690, 440, 1500], [68.6, 730, 440, 1500], [69.8, 1180, 440, 1550], [73.56, 1220, 420, 1550]]],   // title; teacher and map; the cards and him
    [73.56, [[73.56, 920, 450, 1850], [77.73, 900, 450, 1850]]],                         // his hand, answered (teacher and him)
    [77.73, [[77.73, 960, 560, 1500], [86.08, 960, 560, 1450]]],                         // inside his mind
    [86.08, [[86.08, 1100, 440, 1450], [87.6, 1100, 440, 1450], [88.6, 720, 440, 1450], [90.9, 720, 440, 1450], [91.8, 900, 440, 1850], [93, 860, 420, 1700], [96.6, 880, 420, 1700], [97.4, 1180, 450, 1600], [98.6, 1220, 470, 1500]]],   // wrong answer; the teacher; the tick; the graph; him
    [98.6, [[98.6, 1040, 480, 1700], [111.12, 1050, 480, 1700]]],                        // Yara, the steps
    [111.12, [[111.12, 1080, 470, 1650], [113.5, 1100, 470, 1650]]],                      // the robot
    [113.5, [[113.5, 1520, 560, 1500], [114.0, 1500, 560, 1500], [114.9, 620, 600, 1500], [115.3, 600, 600, 1500]]],   // the teacher's star flies to him
    [115.3, [[115.3, 960, 540, 1500], [116.95, 960, 540, 1500], [116.97, 960, 470, 1350], [119.47, 960, 470, 1350]]],   // the paper; the puzzle complete
    // Act 4
    [119.47, [[119.47, 1260, 460, 1500], [120.9, 1260, 460, 1500], [121.6, 560, 460, 1500], [122.0, 560, 460, 1500], [123.3, 1170, 450, 1400], [127.82, 1180, 450, 1400]]],   // her hand; he sees it; he goes; hands meet
    [127.82, [[127.82, 1750, 540, 1550], [136.2, 820, 540, 1550], [146.6, 820, 540, 1550], [152.86, 640, 520, 2000]]],   // walking the path; the sun
    [152.86, [[152.86, 900, 560, 1750], [157.04, 900, 560, 1750]]],                      // the morning
    [157.04, [[157.04, 955, 600, 1500], [166.3, 955, 600, 1500]]],                       // the end card
  ];
  REEL_VIEW = t => {
    let i = 0; while (i + 1 < ROWS.length && t >= ROWS[i + 1][0]) i++;
    const [cx, cy, h] = kf(t, ROWS[i][1].map(([k, ...v]) => [k, v]));
    return { cx, cy, h };
  };
})();
