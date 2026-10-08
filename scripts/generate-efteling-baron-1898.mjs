// Genereert een vereenvoudigd, gesloten 3D-model van Baron 1898 in de Efteling
// (Kaatsheuvel, Ruigrijk, geopend 1 juli 2015): de duikachtbaan van Bolliger &
// Mabillard met de schachttoren (de "bok" van de goudmijn), de mijngebouwen
// met het station en de schoorsteen, en de baan. Alle maten in het script zijn
// meters op ware grootte. Uitvoer via scripts/efteling-kit.mjs: een GLB in
// meters (Y omhoog, nodes `klasse:label`), de catalogus-JSON en een binaire
// STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-efteling-baron-1898.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-baron-1898.mjs --scale 500
//
// Onderdelen:
// - building:schachttoren: de stalen bok (14,5 bij 10 m, zes poten met
//   kruisverbanden, de kop met een trechter van 45 graden onder het dek op
//   +28,8 m, lantaarns onder de hoeken en een seinpaal tot +31,8 m), de twee rode schijven van 8,8 m met
//   spaken en het goudkleurige medaillon op de lange zijden, de steunwand
//   achter de val, het Melkhuysje aan de voet en natuurstenen voeten onder de
//   poten.
//   De baan zelf is een dichte band van 1,4 m breed en 0,8 m dik. Bij de toren
//   horen ook de kettinglift van 45 graden uit het ophaalgebouw naar de top op
//   +29,6 m (met twee kolommen), het wachtpunt aan de rand en de val van 87
//   graden in de mijnschacht (37,5 m tot -7,5 m; onder het maaiveld
//   afgesneden), zodat de top in de export op het dek rust.
// - building:baan: de tunnel (niet zichtbaar), de uitgang uit de tweede put,
//   de Immelmann tot +24 m met een halve rol, de duik en de zero-g-roll over het
//   plein tot +14 m; randen om de valschacht en de tunnelput.
// - building:baan-oost: de lage rechte stukken, de scherpe spiraal (straal
//   9,5 m, 70 graden gekanteld), de camelback tot +12,5 m, de keerbocht en de
//   remmen terug het gebouw in, met een tweede (opstel)spoor ernaast. De baan
//   is in twee nodes gesplitst omdat de printopvulling hem op 1:500 als één
//   node niet aankan. Steunen als ronde kolommen van 1 m en A-bokken onder de
//   Immelmann en de zero-g-roll.
// - building:station: het mijncomplex binnen BAG-pand 0809100000019756: het
//   ophaalgebouw (de liftkamer, 17,6 m, schilddak met twee schoorstenen), de
//   middenhal (12 m), de hal met het tongewelf (12,4 m) en hoekpijlers, de
//   lage aanbouw met het lessenaarsdak aan de zuidoostkant, de noordvleugel met
//   twee zadeldaken, de directeurswoning met de versierde topgevel en het
//   torentje met de gouden ui, en het schoorsteenhuisje (BAG-pand
//   0809100000019757) met de fabrieksschoorsteen tot +22 m.
//
// Printbaar op 1:1000 zonder steun: muren staan recht op, daken lopen schuin
// omhoog, vensters zijn blinde nissen van 0,35 m. De kruisverbanden van de
// toren lopen onder 54 tot 55 graden; de kop van de toren rust op een trechter
// van 45 graden. Waar de baan hangt (de top van de Immelmann, de zero-g-roll, de
// spiraal) staat een kolom of A-bok, en de export legt onder de rest een wig.
// Het wateroppervlak (de vijver binnen de spiraal, de schacht) is niet
// gemodelleerd.
//
// Assenstelsel: oorsprong in het hart van de schachttoren op RD (131693,83,
// 406620,01), op het maaiveld (circa NAP +9,7 m), Z omhoog. +X loopt langs de
// as van het station, de lift en de tunnel naar het noordoosten (47 graden
// linksom van de RD-x-as); +Y wijst naar het noordwesten (het plein en de
// Gondoletta). De val ligt aan de zuidwestkant van de toren (-X), de remmen
// komen van het noordoosten (+X) het gebouw binnen.
//
// Bronnen: BAG-panden 0809100000019756 (mijncomplex, 2015, 874 m²) en
// 0809100000019757 (schoorsteenhuisje, 2015, 36 m²); AHN DSM/DTM 0,5 m
// (PDOK WCS): de hoogtes van de toren (dek +28 tot +29 m boven het maaiveld,
// de lift aan de noordoostkant), de gebouwdelen (17,5 / 12 / 12,4 / 8,5 tot 4,5
// / 10 tot 11 / 9,5 / 6 m), de schoorsteen (21,1 m), de valschacht en de
// tunnelput (geen data: water), de lage baan over het plein en de spiraal;
// PDOK-luchtfoto 8 cm: het baanverloop, de spiraal, de remmen, de schijven en
// de daken; Wikipedia (nl/en: hoogte 30 m, val 37,5 m onder 87 tot 90 graden,
// lengte 501 m, 90 km/u, 2 inversies, lift onder 45 graden, het baanverloop:
// lift, val, tunnel, Immelmann, zero-g-roll over het plein, scherpe spiraal,
// camelback, bocht, remmen); Wikimedia Commons (categorie Baron 1898).
//
// Geschat uit foto's (het AHN ziet de dunne stalen baan maar als losse
// punten): de hoogte van de Immelmann (+24 m), de zero-g-roll (+14 m, AHN-
// punten tot 14,5 m), de camelback (+12,5 m), de spiraal (+3,8 tot +9 m), de
// lage stukken (+3 m), het station op +4,5 m, de schijven (straal 4,4 m,
// midden op +26 m), het Melkhuysje en de voeten van de toren.
import { CrossSection, Manifold, box, ccw, circle, hipRoof, hull, prism, ribbon, ring3, spire, union, writeLandmark } from "./efteling-kit.mjs";

// ---------- assenstelsel ----------
const ORIGIN = [131693.83, 406620.01];
const ANGLE = (47 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(6), +Math.sin(ANGLE).toFixed(6)];
const BASE = -0.5;
const toLocal = ([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [dx * Math.cos(ANGLE) + dy * Math.sin(ANGLE), -dx * Math.sin(ANGLE) + dy * Math.cos(ANGLE)];
};
const deg = (d) => (d * Math.PI) / 180;

// ---------- vectorhulpen ----------
const add = (a, b) => a.map((c, i) => c + b[i]);
const sub = (a, b) => a.map((c, i) => c - b[i]);
const mul = (a, s) => a.map((c) => c * s);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (v) => mul(v, 1 / Math.hypot(...v));
// Rodrigues: draai v om de eenheidsas k over hoek a.
const rot = (v, k, a) => add(add(mul(v, Math.cos(a)), mul(cross(k, v), Math.sin(a))), mul(k, dot(k, v) * (1 - Math.cos(a))));
const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

// Centripetale Catmull-Rom door de punten, herbemonsterd op een vaste stap
// langs de boog. Elk monster krijgt de parameter s (index van het
// controlepunt plus de fractie) om onderdelen aan te wijzen.
function spline(ctrl, step) {
  const P = [ctrl[0].map((c, i) => 2 * c - ctrl[1][i]), ...ctrl, ctrl[ctrl.length - 1].map((c, i) => 2 * c - ctrl[ctrl.length - 2][i])];
  const dense = [];
  for (let i = 1; i + 2 < P.length; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const tj = (ti, a, b) => ti + Math.sqrt(Math.hypot(...sub(b, a))) + 1e-9;
    const t0 = 0;
    const t1 = tj(t0, p0, p1);
    const t2 = tj(t1, p1, p2);
    const t3 = tj(t2, p2, p3);
    const n = 24;
    for (let k = 0; k < n; k++) {
      const t = t1 + ((t2 - t1) * k) / n;
      const A1 = add(mul(p0, (t1 - t) / (t1 - t0)), mul(p1, (t - t0) / (t1 - t0)));
      const A2 = add(mul(p1, (t2 - t) / (t2 - t1)), mul(p2, (t - t1) / (t2 - t1)));
      const A3 = add(mul(p2, (t3 - t) / (t3 - t2)), mul(p3, (t - t2) / (t3 - t2)));
      const B1 = add(mul(A1, (t2 - t) / (t2 - t0)), mul(A2, (t - t0) / (t2 - t0)));
      const B2 = add(mul(A2, (t3 - t) / (t3 - t1)), mul(A3, (t - t1) / (t3 - t1)));
      dense.push({ p: add(mul(B1, (t2 - t) / (t2 - t1)), mul(B2, (t - t1) / (t2 - t1))), s: i - 1 + k / n });
    }
  }
  dense.push({ p: ctrl[ctrl.length - 1], s: ctrl.length - 1 });
  const out = [dense[0]];
  let acc = 0;
  for (let i = 1; i < dense.length; i++) {
    acc += Math.hypot(...sub(dense[i].p, dense[i - 1].p));
    if (acc >= step || i === dense.length - 1) {
      out.push(dense[i]);
      acc = 0;
    }
  }
  return out;
}

// Raaklijnen en horizontale kromming (positief = linksaf) per monster.
function tangents(samples) {
  const n = samples.length;
  samples.forEach((smp, i) => {
    smp.t = unit(sub(samples[Math.min(i + 1, n - 1)].p, samples[Math.max(i - 1, 0)].p));
  });
  samples.forEach((smp, i) => {
    const a = samples[Math.max(i - 3, 0)];
    const b = samples[Math.min(i + 3, n - 1)];
    const ds = Math.hypot(...sub(b.p, a.p)) || 1;
    const ha = Math.hypot(a.t[0], a.t[1]) || 1;
    const hb = Math.hypot(b.t[0], b.t[1]) || 1;
    const ang = Math.atan2(a.t[0] / ha * (b.t[1] / hb) - a.t[1] / ha * (b.t[0] / hb), a.t[0] / ha * (b.t[0] / hb) + a.t[1] / ha * (b.t[1] / hb));
    smp.kappa = ang / ds;
  });
}
// Vlakke bovenkant (loodrecht op de raaklijn, zo dicht mogelijk bij +Z) en een
// kanteling bank (positief = naar rechts) om de rijrichting.
const flatUp = (t) => {
  const l = unit(cross([0, 0, 1], t));
  return cross(t, l);
};
const banked = (t, bank) => rot(flatUp(t), t, bank);
// Bovenkant voor een baan in het verticale vlak y = constant die naar -X
// vertrekt (lift, val, Immelmann): loodrecht op de raaklijn in dat vlak.
const planeUp = (t) => unit(cross(t, [0, -1, 0]));

const W = 1.4; // baanbreedte
const H = 0.8; // baandikte
const band = (samples) => ribbon(samples.map((s) => s.p), W, H, { up: (i) => unit(add(samples[i].up, samples[i + 1].up)) });
// Laagste punt van de doorsnede van de band bij een monster.
const bandBottom = (smp) => {
  const s = unit(cross(smp.t, smp.up));
  return Math.min(...[-W / 2, W / 2].flatMap((a) => [0, -H].map((b) => smp.p[2] + s[2] * a + smp.up[2] * b)));
};
// Middelpunt van de doorsnede (in het grondvlak) bij een monster.
const bandCentre = (smp) => add(smp.p, mul(smp.up, -H / 2));

// Ronde kolom van de onderkant tot z1.
const column = ([x, y], z1, r = 0.5) => prism(circle([x, y], r, 16, Math.PI / 16), BASE, z1);
// Poot van een A-bok: omhulsel van twee vierkanten (d breed) tussen a en b.
const leg = (a, b, d = 0.9) =>
  hull([a, b].flatMap(([x, y, z]) => [[x - d / 2, y - d / 2, z], [x + d / 2, y - d / 2, z], [x + d / 2, y + d / 2, z], [x - d / 2, y + d / 2, z]]));

// ======================================================================
// 1. De baan
// ======================================================================

// --- 1a. station, lift, top en val (verticaal vlak y = 0, naar -X) ---
// Station op +4,5 m (de bezoekers lopen een trap op naar het loonlokaal en de
// vertrekhal); de lift begint in het ophaalgebouw en loopt onder 45 graden
// naar de top op +29,6 m (bovenkant baan; AHN 28 tot 29,5 m op het dek, de
// lift aan de noordoostkant op 26 tot 27,7 m). Dan zakt de baan licht naar het
// wachtpunt op de rand en valt hij onder 87 graden de schacht in.
const STATION_Z = 4.5;
const LIFT = { r1: 7, r2: 8, top: 29.6 };
const liftPath = [];
const pushLine = (arr, a, b, n) => {
  for (let k = 0; k <= n; k++) arr.push([a[0] + ((b[0] - a[0]) * k) / n, 0, a[1] + ((b[1] - a[1]) * k) / n]);
};
const pushArc = (arr, f, a0, a1, n) => {
  for (let k = 0; k <= n; k++) arr.push(f(a0 + ((a1 - a0) * k) / n));
};
{
  // station van x = 56 (binnen de tongewelfhal) tot de voet van de lift
  const footX = 31.5;
  pushLine(liftPath, [56, STATION_Z], [footX + 0.6, STATION_Z], 30);
  // onderbocht naar 45 graden (straal 7)
  const c1 = [footX, STATION_Z + LIFT.r1];
  pushArc(liftPath, (a) => [c1[0] - LIFT.r1 * Math.sin(a), 0, c1[1] - LIFT.r1 * Math.cos(a)], 0, deg(45), 10);
  const liftStart = [c1[0] - LIFT.r1 * Math.sin(deg(45)), c1[1] - LIFT.r1 * Math.cos(deg(45))];
  // bovenbocht (straal 8) met de top op LIFT.top; de 45-gradenlijn raakt hem
  const zc = LIFT.top - LIFT.r2;
  const s45 = LIFT.r2 * Math.sin(deg(45));
  const xc = liftStart[0] + liftStart[1] - zc - 2 * s45;
  pushLine(liftPath, liftStart, [xc + s45, zc + s45], 28);
  pushArc(liftPath, (a) => [xc + LIFT.r2 * Math.sin(a), 0, zc + LIFT.r2 * Math.cos(a)], deg(45), 0, 10);
  // vrijwel vlak naar het wachtpunt op de rand van het dek
  const hold = [-6.8, LIFT.top - 0.3];
  pushLine(liftPath, [xc, LIFT.top], hold, 12);
  // valbocht (straal 2,3) naar 87 graden en de val tot onder het maaiveld
  const r3 = 2.3;
  const c3 = [hold[0], hold[1] - r3];
  pushArc(liftPath, (a) => [c3[0] - r3 * Math.sin(a), 0, c3[1] + r3 * Math.cos(a)], 0, deg(87), 12);
  const d0 = [c3[0] - r3 * Math.sin(deg(87)), c3[1] + r3 * Math.cos(deg(87))];
  const dir = [-Math.cos(deg(87)), -Math.sin(deg(87))];
  const len = (d0[1] + 3) / Math.sin(deg(87));
  pushLine(liftPath, d0, [d0[0] + dir[0] * len, d0[1] + dir[1] * len], 20);
  LIFT.foot = footX;
  LIFT.liftStart = liftStart;
  LIFT.crestX = xc;
  LIFT.drop = d0;
}
const liftSamples = liftPath
  .filter((p, i) => i === 0 || Math.hypot(...sub(p, liftPath[i - 1])) > 1e-6)
  .map((p) => ({ p }));
tangents(liftSamples);
liftSamples.forEach((s) => (s.up = planeUp(s.t)));
// De lift begint in het ophaalgebouw: de band stopt 0,85 m achter de
// zuidwestgevel op een verborgen voet, zodat hij in de export op zichzelf
// steunt. Lift, top en val horen bij de toren (één node): de top rust zo op
// het dek en de val op de steunwand.
const LIFT_END_X = 27.2;
const liftBand = band(liftSamples).intersect(box(-200, -200, BASE, LIFT_END_X, 200, 100));
const liftPier = box(26.55, -0.6, BASE, LIFT_END_X, 0.6, 6.0);

// --- 1b. tunneluitgang, Immelmann, duik, zero-g-roll, spiraal, camelback,
// keerbocht en remmen ---
// Controlepunten [x, y, z] in rijrichting. De Immelmann ligt in het vlak
// y = 0 naast de tunnelput (x -50,75 tot -43,75): de baan komt uit de put naar
// -X, maakt een halve looping tot de top op +24,2 m (x = -55) en rolt dan een
// halve slag terug, dalend boven de aanloop (AHN: 16 tot 17 m boven de put,
// 13 m op x = -42 tot -35).
const IMMEL_LOOP = { c: [-55, 12.6], a: 7.5, b: 11.6 };
const IMMEL = [
  [-40.5, 0, -4.2],
  [-43.75, 0, -1.8],
  [-46.5, 0, -0.1],
  [-49.6, 0, 0.8],
  // halve looping: ellips met het midden op x = -55, z = +12,6 (7,5 m breed,
  // 11,6 m hoog), van de onderkant via de achterkant (x = -62,5) naar de top
  ...Array.from({ length: 11 }, (_, k) => {
    const th = deg(-100 - 17 * k);
    return [IMMEL_LOOP.c[0] + IMMEL_LOOP.a * Math.cos(th), 0, IMMEL_LOOP.c[1] + IMMEL_LOOP.b * Math.sin(th)];
  }),
  [-51.5, 0, 23.6],
  [-47.5, 0, 21.0],
  [-43.5, 0, 17.8],
  [-39.5, 0, 15.2],
  [-35.5, 0, 13.4], // einde halve rol
  [-31.9, 0.4, 11.2],
  [-29.2, 1.2, 7.9],
  [-26.6, 2.5, 5.0],
  [-23.6, 4.2, 3.5],
  [-19.8, 6.5, 3.1],
];
// Over het plein naar het noordoosten en de zero-g-roll (een uitgerekte
// kurkentrekker, top op +14 m; AHN-punten tot 14,5 m bij x = 10 tot 14).
const ROLL = [
  [-15.5, 9.0, 3.0],
  [-10.0, 12.0, 3.2],
  [-4.5, 14.5, 3.5],
  [0.5, 16.3, 4.6], // begin rol (index 3 hier)
  [4.5, 17.8, 8.5],
  [7.8, 19.0, 12.2],
  [11.0, 20.1, 14.0],
  [14.2, 21.3, 12.5],
  [17.2, 22.6, 8.6],
  [20.5, 24.0, 5.0], // einde rol (index 9 hier)
  [25.3, 25.7, 3.6],
  [31.3, 27.8, 3.1],
  [39.3, 30.6, 3.0],
  [47.3, 33.2, 3.0],
  [55.3, 35.9, 3.1],
  [62.6, 37.9, 3.6],
];
// Scherpe spiraal: middelpunt (72,25, 29,5), straal 9,5 m (luchtfoto en AHN),
// met de klok mee van 120 graden tot 60 graden na een volle slag (420
// graden); de eerste helft laag (+3,8 m), daarna klimmend zodat de uitgang
// 5 m boven de ingang kruist.
const HELIX = { c: [72.25, 29.5], r: 9.5 };
const helixPts = [];
for (let a = 120; a >= -300; a -= 15) {
  const f = (120 - a) / 420;
  const z = f < 0.4 ? 3.8 : 3.8 + 6.4 * smooth((f - 0.4) / 0.6);
  helixPts.push([HELIX.c[0] + HELIX.r * Math.cos(deg(a)), HELIX.c[1] + HELIX.r * Math.sin(deg(a)), z]);
}
// Camelback (+12,5 m), keerbocht bij de Gondoletta-oever en de remmen terug
// naar de tongewelfhal op stationshoogte.
const RETURN = [
  [82.3, 34.8, 11.3],
  [88.3, 32.6, 12.5],
  [94.3, 29.6, 12.0],
  [100.3, 25.8, 9.4],
  [106.3, 20.8, 6.4],
  [112.3, 15.0, 5.0],
  [117.0, 9.0, 4.7],
  [119.8, 3.0, 4.6],
  [120.4, -2.6, 4.6],
  [118.6, -7.6, 4.6],
  [114.6, -11.0, 4.6],
  [108.6, -12.2, 4.6],
  [101.5, -10.8, 4.5],
  [92.0, -8.3, 4.5],
  [82.0, -5.6, 4.5],
  [72.0, -2.8, 4.5],
  [64.0, -0.4, 4.5],
  [61.6, 0.2, 4.5],
];
const CTRL = [...IMMEL, ...ROLL, ...helixPts, ...RETURN];
const S_TOP = 14; // top van de looping (theta = -270 graden)
const S_ROLLED = 19;
const S_ZG0 = IMMEL.length + 3;
const S_ZG1 = IMMEL.length + 9;
const S_HELIX0 = IMMEL.length + ROLL.length;
const S_HELIX1 = S_HELIX0 + helixPts.length - 1;
const S_TURN0 = S_HELIX1 + 6;
const S_TURN1 = S_HELIX1 + 13;
const mainSamples = spline(CTRL, 0.9);
tangents(mainSamples);
// Kanteling uit de kromming: bank = atan(C * kromming) met C per onderdeel
// (spiraal 26: 70 graden op straal 9,5 m; keerbocht 9; elders 12, hooguit 50
// graden).
for (const smp of mainSamples) {
  const { s, t } = smp;
  if (s <= S_TOP) {
    smp.up = planeUp(t);
    smp.roll = 0;
  } else if (s <= S_ROLLED) {
    smp.roll = Math.PI * smooth((s - S_TOP) / (S_ROLLED - S_TOP));
    smp.up = rot(planeUp(t), t, smp.roll);
  } else {
    const c = s > S_HELIX0 && s < S_HELIX1 ? 26 : s > S_TURN0 && s < S_TURN1 ? 9 : 12;
    const lim = s > S_HELIX0 && s < S_HELIX1 ? deg(72) : deg(50);
    const fade = smooth((s - S_ROLLED) / 2);
    const bank = -Math.max(-lim, Math.min(lim, Math.atan(c * smp.kappa))) * fade;
    smp.roll = s > S_ZG0 && s < S_ZG1 ? 2 * Math.PI * smooth((s - S_ZG0) / (S_ZG1 - S_ZG0)) : 0;
    smp.up = banked(t, bank + smp.roll);
  }
}
const mainBand = band(mainSamples);

// Tweede (opstel)spoor naast de remmen, 2,7 m naar het zuidoosten.
const sideSamples = spline(
  [
    [61.6, -2.4, 4.5],
    [66.0, -3.5, 4.5],
    [72.0, -5.5, 4.5],
    [82.0, -8.3, 4.5],
    [93.0, -11.2, 4.5],
  ],
  0.8,
);
tangents(sideSamples);
sideSamples.forEach((s) => (s.up = flatUp(s.t)));
const sideBand = band(sideSamples);

// --- 1c. steunen ---
// Plattegronden waar geen kolom mag staan: het gebouw, de putten.
const inRect = ([x, y], [x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1;
const NO_COLUMN = [
  [19, -15.5, 63, 17.5], // mijncomplex en schoorsteenhuisje
  [-18.5, -5, -7, 5], // valschacht
  [-51.5, -5, -43, 5], // tunnelput
  [-60, -8, -36, 8], // Immelmann (eigen bokken)
];
[liftSamples, mainSamples, sideSamples].forEach((list, k) => list.forEach((s, i) => Object.assign(s, { list: k, idx: i })));
const allSamples = [...liftSamples, ...mainSamples, ...sideSamples];
// Een kolom mag geen ander stuk baan raken: geen monster binnen 1,6 m in het
// grondvlak dat lager ligt dan de bovenkant van de kolom (behalve de buren).
const clear = (smp, xy, top) =>
  !allSamples.some(
    (o) => !(o.list === smp.list && Math.abs(o.idx - smp.idx) < 8) && Math.hypot(o.p[0] - xy[0], o.p[1] - xy[1]) < 1.6 && o.p[2] < top + 0.5,
  );
const columns = [];
const placeColumns = (list, every, minZ = 1.8) => {
  let acc = every / 2;
  for (let i = 1; i < list.length; i++) {
    acc += Math.hypot(...sub(list[i].p, list[i - 1].p));
    if (acc < every) continue;
    const smp = list[i];
    const z = bandBottom(smp);
    const xy = bandCentre(smp).slice(0, 2);
    const upright = Math.cos(smp.roll ?? 0) > 0.8;
    if (z < minZ || !upright || NO_COLUMN.some((r) => inRect(xy, r)) || !clear(smp, xy, z)) continue;
    columns.push(column(xy, z + 0.35));
    acc = 0;
  }
};
placeColumns(mainSamples, 9);
placeColumns(sideSamples, 9);
// Lift: twee kolommen tussen het ophaalgebouw en de toren.
const liftColumns = [14.5, 20.5].map((x) => {
  const smp = liftSamples.reduce((a, b) => (Math.abs(b.p[0] - x) < Math.abs(a.p[0] - x) && b.p[2] > 5 ? b : a));
  return column([x, 0], bandBottom(smp) + 0.35, 0.55);
});
// Verborgen voeten onder de uiteinden van de remmen en het opstelspoor in de
// tongewelfhal.
columns.push(box(61.4, -0.6, BASE, 62.2, 0.9, 4.0), box(61.4, -3.1, BASE, 62.2, -1.7, 4.0));
// A-bok onder de top van de Immelmann (twee poten van buiten het vlak van de
// looping naar de top) en een tweede bok onder de uitloop.
const top = mainSamples.reduce((a, b) => (b.s <= S_ROLLED && b.p[2] > a.p[2] ? b : a));
const exitSmp = mainSamples.reduce((a, b) => (Math.abs(b.p[0] + 40.5) < Math.abs(a.p[0] + 40.5) && b.s > S_TOP && b.s < S_ROLLED + 1 ? b : a));
const aFrames = [
  leg([top.p[0] + 0.5, -6.2, BASE], [top.p[0], -0.5, top.p[2] + 0.35]),
  leg([top.p[0] + 0.5, 6.2, BASE], [top.p[0], 0.5, top.p[2] + 0.35]),
  leg([exitSmp.p[0], -4.5, BASE], [exitSmp.p[0], -0.4, bandBottom(exitSmp) + 0.4]),
  leg([exitSmp.p[0], 4.5, BASE], [exitSmp.p[0], 0.4, bandBottom(exitSmp) + 0.4]),
];
// A-bok onder de zero-g-roll: dwars op de baan bij het hoogste punt.
const zgTop = mainSamples.reduce((a, b) => (b.s > S_ZG0 && b.s < S_ZG1 && b.p[2] > a.p[2] ? b : a));
{
  const perp = unit([-zgTop.t[1], zgTop.t[0], 0]);
  for (const sgn of [-1, 1]) {
    const foot = add(zgTop.p, mul(perp, 5.5 * sgn));
    aFrames.push(leg([foot[0], foot[1], BASE], [zgTop.p[0] + perp[0] * 0.4 * sgn, zgTop.p[1] + perp[1] * 0.4 * sgn, zgTop.p[2] + 0.4]));
  }
}
// Randen (0,9 m dik) om de valschacht en de tunnelput.
const rim = (x0, y0, x1, y1, h) => box(x0, y0, BASE, x1, y1, h).subtract(box(x0 + 0.9, y0 + 0.9, BASE - 1, x1 - 0.9, y1 - 0.9, h + 1));
const SHAFT = [-17.5, -4, -8, 4];
const EXIT_PIT = [-50.75, -4, -43.75, 4];
// De valschacht staat in een omheining van groen gaas (foto's: circa 3 m);
// hier een dichte rand van 2,4 m, de tunnelput 1,1 m.
const rims = [rim(...SHAFT, 2.4), rim(...EXIT_PIT, 1.1)];

const below = box(-200, -200, BASE, 200, 200, 100);
// De baan is in de export te zwaar als één node (1:500 loopt vast): hij is
// gesplitst bij een kolom op het lage stuk na de zero-g-roll (x circa 25), in
// het westdeel (tunnelput, Immelmann, zero-g-roll) en het oostdeel (spiraal,
// camelback, keerbocht, remmen en opstelspoor). Beide delen hebben een kolom op
// de snede en overlappen 0,1 m.
const SPLIT = mainSamples.reduce((a, b) => (b.s > S_ZG1 && Math.abs(b.p[0] - 25) < Math.abs(a.p[0] - 25) ? b : a));
const splitXY = bandCentre(SPLIT).slice(0, 2);
const splitTop = bandBottom(SPLIT) + 0.35;
const all = union([mainBand, sideBand, ...columns, ...aFrames, ...rims]).intersect(below);
const trackWest = union([all.intersect(box(-200, -200, BASE, splitXY[0] + 0.05, 200, 100)), column(splitXY, splitTop, 0.55)]);
const trackEast = union([all.intersect(box(splitXY[0] - 0.05, -200, BASE, 200, 200, 100)), column(splitXY, splitTop, 0.6)]);

// ======================================================================
// 2. De schachttoren
// ======================================================================
// AHN: het dek ligt van x -7,25 tot 7,25 en y -5 tot 5 op +28 tot +29,5 m
// (met de baan en de leuning). Foto's: zes poten met kruisverbanden, onder
// het dek een donkere trechter (de kop van de bok), lantaarns aan de hoeken
// onder het dek en de schijven op de lange zijden aan de liftkant.
const T = { x: 7.25, y: 5, leg: 1.3, deck0: 26.8, deck1: 28.8, kop0: 25 };
const towerParts = [];
const legXs = [-T.x, 0, T.x];
for (const x of legXs)
  for (const y of [-T.y, T.y]) {
    towerParts.push(box(x - T.leg / 2, y - T.leg / 2, BASE, x + T.leg / 2, y + T.leg / 2, T.deck0 + 0.05));
    // natuurstenen voet met een afgeschuinde kop
    towerParts.push(box(x - 1.1, y - 1.1, BASE, x + 1.1, y + 1.1, 2.6));
    towerParts.push(hull([...ring3([[x - 1.1, y - 1.1], [x + 1.1, y - 1.1], [x + 1.1, y + 1.1], [x - 1.1, y + 1.1]], 2.55), ...ring3([[x - 0.7, y - 0.7], [x + 0.7, y - 0.7], [x + 0.7, y + 0.7], [x - 0.7, y + 0.7]], 3.0)]));
  }
// Kruisverbanden (0,9 m): lange zijden per vak van 7,25 m in drie lagen van
// 8,3 m (54 graden), korte zijden in twee lagen van 12,5 m (55 graden).
const brace = (a, b) => leg(a, b, 0.9);
const tiers = (z0, z1, n) => Array.from({ length: n + 1 }, (_, k) => z0 + ((z1 - z0) * k) / n);
for (const y of [-T.y, T.y]) {
  const zs = tiers(0, T.kop0, 3);
  for (let k = 0; k < 3; k++)
    for (const [x0, x1] of [[-T.x, 0], [0, T.x]]) {
      towerParts.push(brace([x0, y, zs[k]], [x1, y, zs[k + 1]]));
      towerParts.push(brace([x1, y, zs[k]], [x0, y, zs[k + 1]]));
    }
}
for (const x of [-T.x, T.x]) {
  const zs = tiers(0, T.kop0, 2);
  for (let k = 0; k < 2; k++) {
    towerParts.push(brace([x, -T.y, zs[k]], [x, T.y, zs[k + 1]]));
    towerParts.push(brace([x, T.y, zs[k]], [x, -T.y, zs[k + 1]]));
  }
}
// De kop: een gordingband van +25 m tot het dek tussen de poten, met eronder
// de trechter onder 45 graden tot +20,6 m.
towerParts.push(box(-T.x + 0.4, -T.y + 0.4, T.kop0, T.x - 0.4, T.y - 0.4, T.deck0 + 0.05));
towerParts.push(
  hull([
    ...ring3([[-T.x + 0.4, -T.y + 0.4], [T.x - 0.4, -T.y + 0.4], [T.x - 0.4, T.y - 0.4], [-T.x + 0.4, T.y - 0.4]], T.kop0 + 0.05),
    ...ring3([[-T.x + 4.8, -0.2], [T.x - 4.8, -0.2], [T.x - 4.8, 0.2], [-T.x + 4.8, 0.2]], T.kop0 - 4.4),
  ]),
);
const kopNiches = [];
// Het dek: een plaat over de hele toren tot x = 1, daarachter alleen de
// zijliggers zodat de lift er tussendoor naar boven komt.
towerParts.push(box(-T.x - 0.6, -T.y - 0.6, T.deck0, 1, T.y + 0.6, T.deck1));
towerParts.push(box(0.9, -T.y - 0.6, T.deck0, T.x + 0.6, -2.0, T.deck1));
towerParts.push(box(0.9, 2.0, T.deck0, T.x + 0.6, T.y + 0.6, T.deck1));
// Lantaarns aan de hoeken onder het dek (zeskant, 1,3 m, met een punt van
// 63 graden naar beneden) en een seinpaal op de zuidwesthoek van het dek.
for (const x of [-T.x - 0.75, T.x + 0.75])
  for (const y of [-T.y - 0.75, T.y + 0.75]) {
    const c = [x, y];
    towerParts.push(prism(circle(c, 0.65, 6), T.deck0 - 2.6, T.deck0 + 0.05));
    towerParts.push(hull([...ring3(circle(c, 0.65, 6), T.deck0 - 2.55), [x, y, T.deck0 - 3.9]]));
    // beugel naar de poot
    towerParts.push(leg([x, y, T.deck0 - 0.9], [x - Math.sign(x) * 0.9, y - Math.sign(y) * 0.9, T.deck0 - 0.3], 0.5));
  }
towerParts.push(prism(circle([-T.x - 0.1, -T.y - 0.1], 0.3, 8), T.deck1 - 0.1, T.deck1 + 2.2));
towerParts.push(box(-T.x - 0.55, -T.y - 0.55, T.deck1 + 2.2, -T.x + 0.35, -T.y + 0.35, T.deck1 + 3.0));
// De schijven: een rode spaakschijf (straal 4,4 m, 8 spaken, naaf) met het
// medaillon (straal 2,8 m, groene rand) iets lager ervoor, op beide lange
// zijden aan de liftkant (luchtfoto: rode schijven van x -2,75 tot 5,25);
// midden op +26 m.
const WHEEL = { x: 2.5, z: 26.0, r: 4.4, rim: 0.75, t: 0.6 };
const discY = (pts2, y0, y1) => hull(pts2.flatMap(([x, z]) => [[x, y0, z], [x, y1, z]]));
const circXZ = (c, r, n = 32) => circle(c, r, n, Math.PI / n);
for (const sgn of [-1, 1]) {
  const y0 = sgn * (T.y + 0.55);
  const y1 = sgn * (T.y + 0.55 + WHEEL.t);
  const lo = Math.min(y0, y1);
  const hi = Math.max(y0, y1);
  const ring = discY(circXZ([0, WHEEL.z], WHEEL.r), lo, hi).subtract(discY(circXZ([0, WHEEL.z], WHEEL.r - WHEEL.rim), lo - 1, hi + 1));
  const spokes = [0, 45, 90, 135].map((a) => {
    const d = [Math.cos(deg(a)), Math.sin(deg(a))];
    const n = [-d[1] * 0.3, d[0] * 0.3];
    const e = WHEEL.r - 0.3;
    return discY([[d[0] * e + n[0], WHEEL.z + d[1] * e + n[1]], [-d[0] * e + n[0], WHEEL.z - d[1] * e + n[1]], [-d[0] * e - n[0], WHEEL.z - d[1] * e - n[1]], [d[0] * e - n[0], WHEEL.z + d[1] * e - n[1]]], lo, hi);
  });
  const hub = discY(circXZ([0, WHEEL.z], 0.9, 16), lo - (sgn < 0 ? 0.3 : 0), hi + (sgn > 0 ? 0.3 : 0));
  // as van de schijf naar de toren
  const axle = discY(circXZ([0, WHEEL.z], 0.7, 16), Math.min(sgn * (T.y - 0.6), y0), Math.max(sgn * (T.y - 0.6), y0));
  const medY0 = sgn * (T.y + 0.5 + WHEEL.t);
  const medY1 = sgn * (T.y + 0.55 + WHEEL.t + 0.5);
  const med = discY(circXZ([0, WHEEL.z - 2.6], 2.8), Math.min(medY0, medY1), Math.max(medY0, medY1));
  const medRim = discY(circXZ([0, WHEEL.z - 2.6], 2.8), Math.min(medY1, medY1 + sgn * 0.3), Math.max(medY1, medY1 + sgn * 0.3)).subtract(
    discY(circXZ([0, WHEEL.z - 2.6], 2.15), -20, 20),
  );
  // het medaillon hangt aan de kop: een console van 45 graden eronder
  const medFoot = hull([
    [-1.2, sgn * (T.y - 0.3), WHEEL.z - 2.6 - 4.6],
    [1.2, sgn * (T.y - 0.3), WHEEL.z - 2.6 - 4.6],
    [-1.2, sgn * (T.y + 0.6 + WHEEL.t + 0.4), WHEEL.z - 2.6 - 2.4],
    [1.2, sgn * (T.y + 0.6 + WHEEL.t + 0.4), WHEEL.z - 2.6 - 2.4],
    [-1.2, sgn * (T.y - 0.3), WHEEL.z - 2.6 - 2.0],
    [1.2, sgn * (T.y - 0.3), WHEEL.z - 2.6 - 2.0],
  ]);
  towerParts.push(union([ring, ...spokes, hub, axle, med, medRim, medFoot]).translate([WHEEL.x, 0, 0]));
}
// Steunwand achter de val (van de band naar de zuidwestgevel van de toren).
towerParts.push(
  hull([
    [LIFT.drop[0] + 0.55, -0.45, LIFT.drop[1] - 0.6],
    [LIFT.drop[0] + 0.55, 0.45, LIFT.drop[1] - 0.6],
    [-T.x + 0.2, -0.45, LIFT.drop[1] - 0.6],
    [-T.x + 0.2, 0.45, LIFT.drop[1] - 0.6],
    [-T.x + 0.2, -0.45, BASE],
    [-T.x + 0.2, 0.45, BASE],
    [LIFT.drop[0] - 0.85, -0.45, BASE],
    [LIFT.drop[0] - 0.85, 0.45, BASE],
  ]),
);
// Het Melkhuysje aan de noordoostvoet van de toren (luchtfoto: een licht,
// laag gebouwtje tussen toren en ophaalgebouw; maten geschat).
towerParts.push(box(9.6, -5.2, BASE, 15.2, -1.4, 3.6));
towerParts.push(hipRoof(5.6, 3.8, 3.55, 5.0, 1.6).translate([12.4, -3.3, 0]));
// Sleuf in de kop en het dek waar de lift de toren in loopt.
const liftLine = (x) => LIFT.liftStart[1] + (LIFT.liftStart[0] - x);
const liftSlot = hull(
  [0.9, 9.5].flatMap((x) => [-1.9, 1.9].flatMap((y) => [[x, y, Math.max(liftLine(x) - 1.3, T.deck1 + 0.01 - (x < 1 ? 0 : 99))], [x, y, 31]])),
);
const tower = union([union(towerParts).subtract(union([...kopNiches, liftSlot])), liftBand, liftPier, ...liftColumns]).intersect(below);

// ======================================================================
// 3. Het mijncomplex
// ======================================================================
// BAG-contouren (RD) omgezet naar het lokale stelsel; de bouwdelen hieronder
// volgen de rechte zijden van die contour en de hoogtes uit het AHN.
const L = (u, v) => [u + 2.25, v + 0.5]; // meetstelsel (AHN-raster) naar dit stelsel
const blocks = [];
const niches = [];
// Blinde nis in een gevel loodrecht op x (gevel op x = x0, naar buiten +1/-1)
// of op y; venster b x h met onderkant z0, 0,35 m diep.
const nicheX = (x0, out, yc, z0, b, h, d = 0.35) => box(Math.min(x0, x0 - out * d), yc - b / 2, z0, Math.max(x0, x0 - out * d), yc + b / 2, z0 + h);
const nicheY = (y0, out, xc, z0, b, h, d = 0.35) => box(xc - b / 2, Math.min(y0, y0 - out * d), z0, xc + b / 2, Math.max(y0, y0 - out * d), z0 + h);
// Spitse nis (top onder 55 graden) in een gevel loodrecht op y.
const lancetY = (y0, out, xc, z0, b, zs, d = 0.35) => {
  const zt = zs + (b / 2) * Math.tan(deg(55));
  const poly = [[xc - b / 2, z0], [xc + b / 2, z0], [xc + b / 2, zs], [xc, zt], [xc - b / 2, zs]];
  return hull(poly.flatMap(([x, z]) => [[x, Math.min(y0, y0 - out * d), z], [x, Math.max(y0, y0 - out * d), z]]));
};
const lancetX = (x0, out, yc, z0, b, zs, d = 0.35) => {
  const zt = zs + (b / 2) * Math.tan(deg(55));
  const poly = [[yc - b / 2, z0], [yc + b / 2, z0], [yc + b / 2, zs], [yc, zt], [yc - b / 2, zs]];
  return hull(poly.flatMap(([y, z]) => [[Math.min(x0, x0 - out * d), y, z], [Math.max(x0, x0 - out * d), y, z]]));
};

// 3a. Ophaalgebouw (liftkamer): x 26,35..35,35, y -3,7..3,4; muren tot
// +13,6 m, schilddak tot +17,6 m (AHN 17,5 m op de nok, 13 tot 14 m aan de
// randen), twee schoorstenen op de nokuiteinden (foto's).
const OPH = { x0: 26.35, x1: 35.35, y0: -3.7, y1: 3.4, wall: 13.6, ridge: 17.6 };
blocks.push(box(OPH.x0, OPH.y0, BASE, OPH.x1, OPH.y1, OPH.wall));
blocks.push(hipRoof(OPH.x1 - OPH.x0 + 0.3, OPH.y1 - OPH.y0 + 0.3, OPH.wall - 0.05, OPH.ridge, 3.4).translate([(OPH.x0 + OPH.x1) / 2, (OPH.y0 + OPH.y1) / 2, 0]));
for (const x of [29.3, 32.4]) blocks.push(box(x - 0.5, -0.65, OPH.wall + 1, x + 0.5, 0.35, 19.4));
// Vensters: drie rijen op de noordwestgevel (y1) en twee kolommen naast de
// liftopening op de zuidwestgevel; een spitse poort waar de lift naar buiten
// komt.
for (const z0 of [2.2, 6.2, 10.2])
  for (const x of [28.4, 30.85, 33.3]) niches.push(nicheY(OPH.y1, 1, x, z0, 1.1, 2.0));
for (const z0 of [10.2]) for (const x of [28.4, 30.85, 33.3]) niches.push(nicheY(OPH.y0, -1, x, z0, 1.1, 2.0));
for (const y of [-2.5, 2.2]) for (const z0 of [2.2, 6.2, 10.2]) niches.push(nicheX(OPH.x0, -1, y, z0, 1.0, 2.0));
niches.push(lancetX(OPH.x0, -1, 0, 5.8, 2.6, 9.4, 0.45));

// 3b. Middenhal: x 35,35..46,75, y -3,7..6,8; muren tot +10 m, daken tot
// +12,1 m (AHN 11 tot 12 m).
const MID = { x0: 35.3, x1: 46.8, y0: -3.7, y1: 6.8 };
blocks.push(box(MID.x0, MID.y0, BASE, MID.x1, MID.y1, 10.0));
// drie dwarse zadeldaken met de nokken langs y (AHN: drie nokken op x 37,
// 40,5 en 44; op de foto's een rij van drie topgevels)
{
  const w = (MID.x1 - MID.x0) / 3;
  for (let k = 0; k < 3; k++) {
    const xa = MID.x0 + w * k;
    blocks.push(
      hull([
        [xa, MID.y0, 9.95], [xa + w, MID.y0, 9.95], [xa + w, MID.y1, 9.95], [xa, MID.y1, 9.95],
        [xa + w / 2, MID.y0, 12.1], [xa + w / 2, MID.y1, 12.1],
      ]),
    );
  }
}

// 3c. Hal met het tongewelf: x 46,75..62,25, y -3,7..6,8 (10,5 m breed);
// muren tot +9 m, gewelf tot +12,4 m (AHN 12 m in het midden, 10 tot 11 aan
// de randen); drie gordelbogen, vier hoekpijlers die boven het dak uitsteken,
// in de noordoostgevel een rond venster en de grote poort waar de remmen
// binnenkomen.
const BAR = { x0: 46.75, x1: 62.25, y0: -3.7, y1: 6.8, wall: 9.0, crown: 12.4 };
{
  const half = (BAR.y1 - BAR.y0) / 2;
  const yc = (BAR.y0 + BAR.y1) / 2;
  const rise = BAR.crown - BAR.wall;
  const R = (half * half + rise * rise) / (2 * rise);
  const zc = BAR.crown - R;
  const prof = (grow = 0) => {
    const pts = [[-half - grow, BASE], [half + grow, BASE]];
    for (let k = 0; k <= 16; k++) {
      const y = half - (2 * half * k) / 16;
      pts.push([y + Math.sign(y) * grow, zc + Math.sqrt(R * R - y * y) + grow]);
    }
    return pts;
  };
  // profiel in (y, z), geëxtrudeerd langs x
  const vault = (x0, x1, grow = 0) =>
    Manifold.extrude(new CrossSection([ccw(prof(grow))]), x1 - x0)
      .rotate([90, 0, 90])
      .translate([x0, yc, 0]);
  blocks.push(vault(BAR.x0, BAR.x1));
  for (const x of [50.6, 54.5, 58.4]) blocks.push(vault(x - 0.35, x + 0.35, 0.22));
  // gevelrand van de noordoostgevel (0,4 m boven het gewelf)
  blocks.push(vault(BAR.x1 - 0.6, BAR.x1, 0.35));
  for (const x of [BAR.x0 + 0.45, BAR.x1 - 0.45])
    for (const y of [BAR.y0 + 0.45, BAR.y1 - 0.45]) {
      blocks.push(box(x - 0.6, y - 0.6, BASE, x + 0.6, y + 0.6, 11.2));
      blocks.push(spire([x, y], 0.85, 11.2, 12.4, 4, Math.PI / 4));
    }
  niches.push(Manifold.cylinder(0.45, 1.0, 1.0, 24).rotate([0, 90, 0]).translate([BAR.x1 - 0.4, yc, 10.3]));
  // poort voor de remmen (spits) en twee vensters ernaast
  niches.push(lancetX(BAR.x1, 1, 0.3, 2.6, 3.4, 6.2, 0.5));
  for (const y of [-2.0, 4.6]) niches.push(lancetX(BAR.x1, 1, y, 2.0, 1.3, 6.0));
}

// 3d. Lage aanbouw met het lessenaarsdak (lichtblauw op de luchtfoto):
// x 28,85..56,65, y -14,5..-3,7; gevel aan de zuidoostkant +5 m, dak tot
// +8,6 m tegen het hoge deel (AHN 8 tot 4,5 m); lisenen en hoge vensters op
// de zuidoostgevel.
const LEAN = { x0: 28.85, x1: 56.65, y0: -14.5, y1: -3.6, lo: 5.0, hi: 8.6 };
blocks.push(
  hull([
    [LEAN.x0, LEAN.y0, BASE], [LEAN.x1, LEAN.y0, BASE], [LEAN.x1, LEAN.y1, BASE], [LEAN.x0, LEAN.y1, BASE],
    [LEAN.x0, LEAN.y0, LEAN.lo], [LEAN.x1, LEAN.y0, LEAN.lo], [LEAN.x1, LEAN.y1, LEAN.hi], [LEAN.x0, LEAN.y1, LEAN.hi],
  ]),
);
for (let x = LEAN.x0 + 2.3; x < LEAN.x1 - 1; x += 4.65) {
  blocks.push(box(x - 0.35, LEAN.y0 - 0.4, BASE, x + 0.35, LEAN.y0 + 0.05, LEAN.lo - 0.2));
  niches.push(lancetY(LEAN.y0, -1, x + 2.32, 0.9, 1.5, 2.9));
}
// 3e. Aanbouw in de oosthoek: x 56,65..60,45, y -14,5..-8; tot +3,2 m met een
// schilddak tot +4,6 m.
blocks.push(box(56.6, -14.5, BASE, 60.45, -8.0, 3.2));
blocks.push(hipRoof(6.5, 3.85, 3.15, 4.6, 1.9).rotate([0, 0, 90]).translate([58.53, -11.25, 0]));

// 3f. Noordvleugel, oostelijk deel: x 47,85..58,25, y 6,8..14,2; zadeldak
// met de nok langs x op +11,2 m (AHN 10 tot 11 m), goot +8,3 m; vensters op
// de noordwestgevel en een topgevel naar het noordoosten.
const NE = { x0: 47.85, x1: 58.25, y0: 6.75, y1: 14.2, eave: 8.3, ridge: 11.2 };
const gableBlock = ({ x0, x1, y0, y1, eave, ridge }) => [
  box(x0, y0, BASE, x1, y1, eave),
  hull([
    [x0, y0, eave - 0.05], [x1, y0, eave - 0.05], [x1, y1, eave - 0.05], [x0, y1, eave - 0.05],
    [x0, (y0 + y1) / 2, ridge], [x1, (y0 + y1) / 2, ridge],
  ]),
];
blocks.push(...gableBlock(NE));
for (const x of [49.6, 52.2, 54.8, 57.0]) {
  niches.push(lancetY(NE.y1, 1, x, 1.2, 1.2, 3.0));
  niches.push(nicheY(NE.y1, 1, x, 5.2, 1.2, 1.9));
}
for (const y of [8.6, 12.4]) niches.push(lancetX(NE.x1, 1, y, 1.2, 1.3, 3.2));
niches.push(Manifold.cylinder(0.4, 0.75, 0.75, 20).rotate([0, 90, 0]).translate([NE.x1 - 0.35, (NE.y0 + NE.y1) / 2, 9.0]));

// 3g. Noordvleugel, middendeel: x 35,25..47,85, y 6,8..15,6; zadeldak met de
// nok langs x op +10 m (AHN 9 tot 10 m), goot +7,4 m.
const NM = { x0: 35.25, x1: 47.9, y0: 6.75, y1: 15.3, eave: 7.4, ridge: 10.0 };
blocks.push(...gableBlock(NM));
for (const x of [37.6, 40.3, 43.0, 45.6]) {
  niches.push(lancetY(NM.y1, 1, x, 1.2, 1.2, 3.0));
  niches.push(nicheY(NM.y1, 1, x, 4.6, 1.2, 1.8));
}
// dakkapellen op het noordwestdakvlak
for (const x of [38.9, 44.3]) {
  const yb = NM.y1 - 1.6;
  blocks.push(
    hull([
      [x - 0.9, yb, 7.6], [x + 0.9, yb, 7.6], [x - 0.9, yb - 1.6, 7.6], [x + 0.9, yb - 1.6, 7.6],
      [x - 0.9, yb, 9.0], [x + 0.9, yb, 9.0], [x - 0.9, yb - 1.6, 9.6], [x + 0.9, yb - 1.6, 9.6],
    ]),
  );
}

// 3h. Directeurswoning (de entree met de versierde topgevel, "BARON 1898"):
// het gedraaide deel van de BAG-contour, 7,75 bij 5,6 m met de lange as
// 59,8 graden linksom van +x; zadeldak met de nok langs de lange as op +10 m
// (AHN 8 tot 9,5 m), goot +6,6 m, de topgevel naar het noord-noordwesten (het
// plein en de wachtrij) en een torentje met een gouden ui op de nok.
{
  const A = L(28.7, 9.5);
  const a = [Math.cos(deg(59.8)), Math.sin(deg(59.8))];
  const b = [a[1], -a[0]];
  const len = 7.75;
  const wid = 5.6;
  const P = (s, t) => [A[0] + a[0] * s + b[0] * t, A[1] + a[1] * s + b[1] * t];
  const foot = [P(0, 0), P(len, 0), P(len, wid), P(0, wid)];
  const eave = 6.6;
  const ridge = 10.0;
  blocks.push(prism(foot, BASE, eave));
  blocks.push(hull([...ring3(foot, eave - 0.05), [...P(0, wid / 2), ridge], [...P(len, wid / 2), ridge]]));
  // versierde topgevel: een iets naar voren springend geveldeel met
  // stoep (lijst) en spits geveltopje
  const g0 = P(len - 0.05, 0.6);
  const g1 = P(len + 0.5, 0.6);
  const g2 = P(len + 0.5, wid - 0.6);
  const g3 = P(len - 0.05, wid - 0.6);
  blocks.push(prism([g0, g1, g2, g3], BASE, eave + 0.4));
  blocks.push(hull([...ring3([g0, g1, g2, g3], eave + 0.35), [...P(len - 0.05, wid / 2), ridge + 0.9], [...P(len + 0.5, wid / 2), ridge + 0.9]]));
  // torentje met ui op de nok
  const tc = P(len * 0.45, wid / 2);
  blocks.push(prism(circle(tc, 0.9, 8, Math.PI / 8), 8.0, 11.3));
  blocks.push(spire(tc, 1.1, 11.3, 11.9, 8));
  blocks.push(
    union([
      Manifold.revolve(new CrossSection([ccw([[0, 11.8], [0.75, 11.9], [0.85, 12.4], [0.55, 12.9], [0.15, 13.3], [0, 13.3]])]), 24).translate([tc[0], tc[1], 0]),
      prism(circle(tc, 0.12, 8), 13.2, 14.2),
    ]),
  );
  // vensters (spits) in de topgevel en op de lange zijden
  const gnorm = a;
  for (const t of [1.6, wid / 2, wid - 1.6]) {
    const c = P(len + 0.5, t);
    for (const [z0, zs] of [[1.2, 3.1], [4.0, 5.6]]) {
      const zt = zs + 0.55 * Math.tan(deg(55));
      const poly = [[-0.55, z0], [0.55, z0], [0.55, zs], [0, zt], [-0.55, zs]];
      niches.push(hull(poly.flatMap(([s, z]) => [-0.4, 0.05].map((d) => [c[0] + b[0] * s + gnorm[0] * d, c[1] + b[1] * s + gnorm[1] * d, z]))));
    }
  }
  for (const s of [1.6, 3.9, 6.2]) {
    const c = P(s, 0);
    const poly = [[-0.55, 1.2], [0.55, 1.2], [0.55, 3.4], [0, 3.4 + 0.55 * Math.tan(deg(55))], [-0.55, 3.4]];
    niches.push(hull(poly.flatMap(([q, z]) => [-0.05, 0.35].map((d) => [c[0] + a[0] * q + b[0] * d, c[1] + a[1] * q + b[1] * d, z]))));
  }
}

// 3i. Schoorsteenhuisje (BAG 0809100000019757): x 19,55..25,55, y 3..9, muren
// tot +4,4 m, schilddak tot +6,4 m (AHN 5 tot 6 m). De fabrieksschoorsteen
// staat op een vierkante voet in de oosthoek (AHN 21,1 m op x 23, y 6,25):
// voet 3,2 m tot +8 m met een kraag, ronde schacht van 1,15 naar 0,85 m tot
// +20,6 m en een kopband tot +22 m.
blocks.push(box(19.55, 3.0, BASE, 25.55, 9.0, 4.4));
blocks.push(hipRoof(6.3, 6.3, 4.35, 6.4, 2.6).translate([22.55, 6.0, 0]));
{
  const c = [23.0, 6.25];
  blocks.push(box(c[0] - 1.6, c[1] - 1.6, BASE, c[0] + 1.6, c[1] + 1.6, 8.0));
  blocks.push(hull([...ring3([[c[0] - 1.6, c[1] - 1.6], [c[0] + 1.6, c[1] - 1.6], [c[0] + 1.6, c[1] + 1.6], [c[0] - 1.6, c[1] + 1.6]], 7.95), ...ring3(circle(c, 1.2, 16), 8.4)]));
  blocks.push(hull([...ring3(circle(c, 1.15, 16), 8.35), ...ring3(circle(c, 0.85, 16), 20.6)]));
  // kopband op een kraag van 45 graden
  blocks.push(hull([...ring3(circle(c, 0.85, 16), 20.5), ...ring3(circle(c, 1.15, 16), 20.8)]));
  blocks.push(prism(circle(c, 1.15, 16), 20.75, 22.0));
}

const station = union(blocks).subtract(union(niches)).intersect(below);

// ======================================================================
// 4. Wegschrijven
// ======================================================================
const nodes = [
  ["building:schachttoren", tower],
  ["building:baan", trackWest],
  ["building:baan-oost", trackEast],
  ["building:station", station],
];
// Controle: ligt het BAG-pand binnen het model?
const bagMain = [
  [131740.9, 406658.8], [131731.3, 406670.3], [131723.2, 406672.3], [131708.2, 406659.9], [131705.2, 406657.3],
  [131707.6, 406649.5], [131709.3, 406641.6], [131714.5, 406636.8], [131724.2, 406631.2], [131743.1, 406651.5],
].map(toLocal);
console.error("BAG-hoekpunten lokaal:", JSON.stringify(bagMain.map((p) => p.map((c) => +c.toFixed(1)))));
console.error("Immelmann-top:", top.p.map((c) => +c.toFixed(2)), "zero-g-top:", zgTop.p.map((c) => +c.toFixed(2)), "kolommen:", columns.length);
const pathLen = (list) => list.reduce((acc, s, i) => (i ? acc + Math.hypot(...sub(s.p, list[i - 1].p)) : 0), 0);
console.error("baanlengte (lift+hoofd):", (pathLen(liftSamples) + pathLen(mainSamples)).toFixed(0), "m");

await writeLandmark({
  slug: "efteling-baron-1898",
  nodes,
  base: BASE,
  catalog: {
    name: "Baron 1898 (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [
      [-22, 9],
      [16, -10],
      [40, -18],
      [36, 20],
      [66, -7],
    ],
    replacesBuildings: ["NL.IMBAG.Pand.0809100000019756", "NL.IMBAG.Pand.0809100000019757"],
    description:
      "Baron 1898 in de Efteling (B&M-duikachtbaan, 2015): oorsprong in het hart van de schachttoren op RD (131693,83, 406620,01), op het maaiveld (circa NAP +9,7 m); +X 47 graden linksom van de RD-x-as langs het station, de lift en de tunnel naar het noordoosten, +Y naar het noordwesten (plein). Schachttoren 14,5 bij 10 m met het dek op +28,8 m, seinpaal tot +31,8 m en twee rode schijven met medaillon; lift onder 45 graden naar +29,6 m, val van 87 graden in de schacht, Immelmann tot +24 m, zero-g-roll over het plein tot +14 m, scherpe spiraal, camelback tot +12,5 m, keerbocht en remmen; mijncomplex met ophaalgebouw (17,6 m), tongewelfhal (12,4 m), aanbouwen, directeurswoning met torentje en de schoorsteen tot +22 m. Baanhoogtes buiten de toren geschat uit foto's.",
    realWorld: {
      opened: "2015-07-01",
      manufacturer: "Bolliger & Mabillard (Dive Coaster)",
      trackLengthMetres: 501,
      liftHeightMetres: 30,
      dropMetres: 37.5,
      dropAngleDegrees: 87,
      speedKmh: 90,
      inversions: 2,
      towerDeckMetres: 28.8,
      towerFootprintMetres: [14.5, 10],
      immelmannTopMetres: 24.2,
      zeroGRollTopMetres: 14,
      helixRadiusMetres: 9.5,
      chimneyMetres: 22,
      liftHouseRidgeMetres: 17.6,
      modelFootprintMetres: [178, 52],
    },
    sources: [
      "BAG-panden 0809100000019756 (mijncomplex, bouwjaar 2015, 874 m²) en 0809100000019757 (schoorsteenhuisje, 2015, 36 m²) via de PDOK BAG-WFS",
      "AHN DSM/DTM 0,5 m (PDOK WCS dsm_05m/dtm_05m): toren, dek, lift, gebouwhoogtes, schoorsteen, valschacht, tunnelput, lage baandelen en maaiveld (NAP +9,1 tot +10,5 m)",
      "PDOK-luchtfoto 8 cm (Actueel_orthoHR): baanverloop, spiraal (straal 9,5 m), remmen, schijven en daken",
      "https://nl.wikipedia.org/wiki/Baron_1898 (rit: lift van 45 graden naar 30 m, val van 37,5 m onder 87 graden, tunnel, Immelmann, zero-g-roll over het plein, spiraal, camelback, remmen; schachttoren, Melkhuysje, schoorsteenhuisje)",
      "https://en.wikipedia.org/wiki/Baron_1898 (hoogte 30 m, val 37,5 m, lengte 501 m, 90 km/u, 2 inversies)",
      "https://commons.wikimedia.org/wiki/Category:Baron_1898 (foto's van alle kanten)",
    ],
  },
});
