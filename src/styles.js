// styles.js — the painting styles. Every shape and line in the kit goes through paint() and inkLine() in core.js; a style
// changes how those two draw, and the paper under them, so any scene, character or prop can be drawn in any style.
// Pick one with style: '...' in src/config.js, or studio.html?style=... / render.mjs --style=... for a one-off.
//
//   watercolor  the kit's own look: watercolour fills that bleed, tapered ink, boiling lines, grainy paper (default)
//   gouache     thick, opaque, textured paint and soft dark edges; still hand-painted, not watery
//   pencil      coloured pencil: a light tint, hatched strokes in the colour, graphite outlines, white paper
//   flat        flat motion graphics: solid colours, no outlines, no boil, clean ground
//   cartoon     cel animation: solid colours, an even dark outline, no boil
//   cutout      cut paper: solid colour pieces, each lifting a small shadow, on paper with fibre
//   chalk       chalk on a green board: pastel chalk fills and white chalk lines, broken by the board
//
// Two kinds: brush styles (watercolor, gouache, pencil) adapt the p5.brush calls; native styles (flat, cartoon, cutout,
// chalk) skip p5.brush and draw plain p5 shapes, which is also much faster to render (no GPU needed).
const STYLE_DEFS = (() => {
  const solid = o => o.wash || o.fill || (o.hatch && o.hatch.c) || null;
  const alphaOf = o => o.wash ? (o.washOp ?? 255) : o.fill ? ((o.fillOp ?? 255) < 120 ? o.fillOp : 255) : 255;
  // a native style: fill(pts, col, alpha, o), edge(pts, col, w, o) for outlines, line(P, col, w) for lines
  const native = d => ({ native: true, boil: 0, ...d });
  const big = pts => { let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } return (x1 - x0) * (y1 - y0) > W * H * .3; };
  const BOARD = '#24382F';
  return {
    watercolor: {},
    gouache: {
      adapt: o => {
        const c = solid(o); if (!c || o.hatch) return { ...o, br: o.br === 'dry' ? 'dry' : 'marker' };
        const op = alphaOf(o);
        return { ...o, wash: null, fill: c, fillOp: op < 255 ? op : 250, bleed: .015, tex: .85, border: .7, ink: o.ink === null ? null : mixCol(o.ink || PAL.ink, c, .35), br: 'marker' };
      },
      lineBrush: br => br === 'dry' ? 'dry' : 'marker',
    },
    pencil: {
      adapt: o => {
        const c = solid(o); if (!c) return { ...o, br: o.br === 'dry' ? 'charcoal' : '2B' };
        const op = alphaOf(o);
        return { ...o, wash: mixCol(c, '#FFFFFF', .35), washOp: op * .55, fill: null, br: '2B', ink: o.ink === null ? null : mixCol(o.ink || PAL.ink, '#6E6A66', .35),
          hatch: { d: 5, a: Math.PI / 4, c: mixCol(c, PAL.ink, .12), b: 'cpencil', w: 1, o: { rand: .35, continuous: false, gradient: .2 } } };
      },
      lineBrush: br => br === 'dry' ? 'charcoal' : 'cpencil',
      paper: '#FBFAF6',
    },
    flat: native({
      paper: '#F6F3EC', grain: false,
      fill: (P, c, a) => { noStroke(); fillA(c, a); poly(P); },
      edge: (P, c, w) => { noFill(); strokeA(c, 255, w * 1.4); poly(P); },
      line: (P, c, w) => { noFill(); strokeA(c, 255, w * 2.2); path(P); },
      outlineFilled: false,
    }),
    cartoon: native({
      paper: '#FFFFFF', grain: false,
      fill: (P, c, a) => { noStroke(); fillA(c, a); poly(P); },
      edge: (P, c, w) => { noFill(); strokeA(PAL.ink, 255, clamp(w * 5, 2.6, 11)); poly(P); },
      line: (P, c, w) => { noFill(); strokeA(c, 255, w * 3.4); path(P); },
      outlineFilled: true,
    }),
    cutout: native({
      paper: '#EFE6D6', grain: true, boil: 3,
      fill: (P, c, a) => { noStroke(); if (!big(P)) { push(); translate(6, 9); fillA('#2B2118', 95 * a / 255); poly(P); pop(); } fillA(c, a); poly(P); },
      edge: (P, c, w) => { noFill(); strokeA(c, 235, w * 1.6); poly(P); },
      line: (P, c, w) => { noFill(); push(); translate(3, 4); strokeA('#2B2118', 55, w * 2.4); path(P); pop(); strokeA(c, 255, w * 2.4); path(P); },
      outlineFilled: false,
    }),
    chalk: native({
      paper: BOARD, grain: false, boil: 8,
      fill: (P, c, a) => { noStroke(); if (big(P)) fillA(mixCol(BOARD, c, .14), 255); else fillA(mixCol(c, '#F4F1E8', .25), a); poly(P); },
      edge: (P, c, w) => { noFill(); strokeA('#EEEBE2', 225, clamp(w * 2.8, 1.4, 7)); poly(P); },
      line: (P, c, w) => { noFill(); strokeA(mixCol(c, '#F4F1E8', .55), 235, w * 2.8); path(P); },
      outlineFilled: true,
      post: c => { c.globalCompositeOperation = 'multiply'; c.drawImage(chalkDust(), 0, 0); c.globalCompositeOperation = 'source-over'; },
    }),
  };
})();
const STYLE_NAMES = Object.keys(STYLE_DEFS);
const STY = STYLE_DEFS[STYLE] || STYLE_DEFS.watercolor;

// ---------- native drawing helpers ----------
function fillA(c, a) { const k = color(c); k.setAlpha(a); fill(k); }
function strokeA(c, a, w) { const k = color(c); k.setAlpha(a); stroke(k); strokeWeight(w); strokeJoin(ROUND); strokeCap(ROUND); }
function poly(P) { beginShape(); for (const p of P) vertex(p[0], p[1]); endShape(CLOSE); }
function path(P) { beginShape(); for (const p of P) vertex(p[0], p[1]); endShape(); }
const smoothClosed = (P, curv) => curv > .05 && P.length > 3 ? through([...P, P[0]], 4).slice(0, -1) : P;
function nativePaint(P, o) {
  const c = o.wash || o.fill || (o.hatch && o.hatch.c), Q = smoothClosed(P, o.curv || 0);
  if (c) STY.fill(Q, c, o.wash ? (o.washOp ?? 255) : o.fill ? ((o.fillOp ?? 255) < 120 ? o.fillOp : 255) : 200, o);
  if (o.ink !== null && (!c || STY.outlineFilled)) STY.edge(Q, o.ink || PAL.ink, o.sw ?? 1, o);
}
function nativeLine(P, sw, col, br, curv) { STY.line(curv > 0 && P.length > 2 ? through(P, 5) : P, col, br === 'dry' ? sw * 2 : br === 'inkfine' ? sw * .6 : sw); }
// chalk: the board shows through the strokes where the chalk skipped
let CHALK_C = null;
function chalkDust() {
  if (CHALK_C) return CHALK_C;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'), rnd = lcg(21);
  const id = c.createImageData(W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const skip = rnd() < .14, v = skip ? 170 + rnd() * 50 : 255; d[i] = v - 12; d[i + 1] = v; d[i + 2] = v - 8; d[i + 3] = 255; }
  c.putImageData(id, 0, 0);
  for (let i = 0; i < 90; i++) { const x = rnd() * W, y = rnd() * H, r = 80 + rnd() * 260, g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(235,240,230,.10)'); g.addColorStop(1, 'rgba(235,240,230,0)'); c.fillStyle = g; c.globalCompositeOperation = 'screen'; c.fillRect(x - r, y - r, 2 * r, 2 * r); }
  return (CHALK_C = cv);
}
