// Genereert een vereenvoudigd, gesloten 3D-model van Stadion Feijenoord (De
// Kuip) in Rotterdam (Brinkman en Van der Vlugt, 1937; dak 1994): de open kom
// met de onderste ring in treden rond het veld, de ringgang langs de lange
// zijden, de loshangende tweede ring met zijn voorkant en treden onder de
// dakrand, het ringvormige dak met de binnenrand, de nok en de dakgoot op de
// gevel, en de gevel zelf in lagen: de glazen band onder de dakgoot, de
// buitengalerij met borstwering, de witte kolommen van het dak, de grote
// kruisverbanden in de hoeken en de stalen trappentorens met bordessen en
// trappen. Daarnaast de vier vakwerklichtmasten op de hoeken als aparte node.
// Alle vormen zijn op het AHN gefit; het Mapbox-landmarkmodel is niet
// gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, twee nodes met de materiaalklasse in
// de nodenaam) als catalogusbron voor de export en de kaart, plus een binaire
// STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-stadion-feijenoord.mjs              # 1:1000 (standaard)
//   node scripts/generate-stadion-feijenoord.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van het veld (midden van de
// veldomranding in het AHN) op straatniveau (NAP +2,0 m), Z omhoog. +X loopt
// langs de lengteas van het veld naar het zuidzuidoosten (RD-richting -63,06
// graden), +Y dwars daarop naar het noordnoordoosten, naar de kant van het
// BAG-pand onder de tribune en de loopbruggen naar het gebouw ernaast.
//
// Bronnen: AHN DSM/DTM 0,5 m (PDOK WCS), als raster in het stelsel van het
// stadion: de veldomranding (rechthoek, voor hart en as), de binnenrand, nok
// en buitenrand van het dak als superellipsen, de dakhoogte als functie van de
// afstand tot de nok (afwijking 0,23 m), de dakgoot per richting (tabel), de
// voorkant van de tweede ring per richting (tabel), de onderste ring en de
// ringgang, de galerij en de trappentorens buiten de dakgoot (om de drie
// traveeën), de koppen van de lichtmasten en het straatniveau; BAG-panden
// 0599100100005153 en 0599100110026028 (liggen onder het model; de kom zelf
// is geen BAG-pand); Wikipedia (veld 105 × 68 m, vrij dragend ringvormig dak,
// loshangende tweede ring); foto's op Wikimedia Commons (gevel met kolommen,
// kruisverbanden, galerij en trappen, de trappentoren van vak DD, het
// interieur met beide ringen); PDOK luchtfoto.
// Geschat: de hoogtes van de voorkant van de tweede ring (NAP +14 tot
// +17 m) en zijn treden (1,2 × 0,8 m), de dikte van de dakrand (2 m) en de
// dakgoot (1,2 m), de hoogtes van de glazen band en de galerij (NAP +19,5 m),
// de kolommen (60 stuks, 1 m), de bordessen (om de 3,4 m) en de maten van de
// lichtmasten (voet 4 m, kop 9 × 2 × 7,5 m). Het dak hangt in werkelijkheid
// los boven de tweede ring en de tweede ring los boven de eerste; hier lopen
// de onderkanten onder 50 en 45 graden schuin terug tot op de tribune eronder,
// zodat er niets vrij overhangt.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "stadion-feijenoord");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
// Straal van de superellips |x/a|^n + |y/b|^n = 1 in de richting phi.
const superellipse = ({ a, b, n }) => (phi) =>
  1 / ((Math.abs(Math.cos(phi)) / a) ** n + (Math.abs(Math.sin(phi)) / b) ** n) ** (1 / n);
// Straal van een rechthoek met afgeronde hoeken in de richting phi.
const roundedRect = ({ halfU, halfV, r }) => (phi) => {
  const c = Math.abs(Math.cos(phi));
  const s = Math.abs(Math.sin(phi));
  let lo = 0;
  let hi = 2 * (halfU + halfV);
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    const x = m * c;
    const y = m * s;
    const dx = x - (halfU - r);
    const dy = y - (halfV - r);
    const inside = x <= halfU && y <= halfV && !(dx > 0 && dy > 0 && dx * dx + dy * dy > r * r);
    if (inside) lo = m;
    else hi = m;
  }
  return lo;
};
// Waarde uit een tabel per `step` graden over het eerste kwadrant; het stadion
// is in het AHN symmetrisch in beide assen, dus de richting wordt gespiegeld.
const quadrantTable = (table, step) => (phi) => {
  let q = Math.abs(((((phi * 180) / Math.PI) % 360) + 360) % 360);
  if (q > 180) q = 360 - q;
  if (q > 90) q = 180 - q;
  const i = Math.min(Math.floor(q / step), table.length - 2);
  const t = q / step - i;
  return table[i] * (1 - t) + table[i + 1] * t;
};

// ---------- maten (z = NAP - 2,0 m) ----------
const ORIGIN = [95527.1, 434280.49];
const X_AXIS = [0.45309, -0.89147]; // RD-richting -63,06 graden, langs het veld
const NAP = (h) => h - 2.0;
// Alle onderdelen beginnen op dezelfde onderkant, 1 m onder straatniveau.
const BASE = NAP(1.0);

// Dak (AHN): binnenrand, nok en buitenrand als superellipsen rond het hart.
const ROOF_INNER = { a: 80.6, b: 60.2, n: 3.0 };
const RIDGE = { a: 95.0, b: 77.45, n: 3.0 };
const ROOF_OUTER = { a: 102.1, b: 85.3, n: 2.88 };
// Dakhoogte als functie van de radiale afstand s tot de nok (AHN, mediane
// afwijking 0,23 m): nok op NAP +34,45 m, naar binnen 0,583 m per meter
// omlaag (binnenrand +26,0 m op de kopse kanten, +23,4 m in de hoeken), naar
// buiten 0,9 m per meter tot de dakgoot.
const ROOF = { ridge: 34.45, inner: 0.583, outer: 0.9 };
const roofNap = (s) => ROOF.ridge + (s < 0 ? ROOF.inner * s : -ROOF.outer * s);
// Dakgoot (AHN, waar het dak onder NAP +25,5 m zakt, 25e percentiel per 2,5
// graden plus 0,5 m, mediaan over de vier kwadranten en gladgestreken over
// 15 graden): radiale afstand tot de buitenrand-superellips. Op de kopse
// kanten steekt het dak tussen de trappentorens 2,5 m verder uit dan
// ernaast, in de hoeken bij de lichtmasten 2 m.
const EAVE_TABLE = [
  0.56, 0.34, -0.11, -0.59, -1.06, -1.53, -1.98, -2.32, -2.13, -1.81, -1.47, -1.12, -0.78,
  -0.41, -0.06, -0.13, -0.3, -0.37, -0.68, -0.97, -1.39, -1.66, -1.69, -1.8, -1.89, -1.75,
  -1.61, -1.3, -1.17, -1.18, -1.2, -1.3, -1.36, -1.39, -1.51, -1.67, -1.83,
];
// Voorkant van de tweede ring (AHN, eerste punt boven NAP +10 m): afstand
// binnen de binnenrand van het dak per 5 graden. Op de kopse kanten 4,5 m voor
// de dakrand, op de lange zijden 1,5 m, in de hoeken 0,9 m.
const UPPER_TABLE = [
  4.0, 4.2, 4.45, 4.5, 4.25, 3.25, 2.4, 1.45, 0.9, 0.95, 1.6, 2.2, 2.2, 2.0, 1.95, 1.55, 1.5,
  1.5, 1.4,
];
// Voorrand van de onderste ring langs de veldomranding (AHN: rechthoek van
// 128 × 88 m met afgeronde hoeken), op NAP +2,2 m oplopend met 0,19 m per
// meter, in treden van 2 m diep en 0,38 m hoog.
const FRONT = { halfU: 64, halfV: 44, r: 6, z: 2.2, slope: 0.19 };
const LOWER_TREAD = 2.0;
// Tweede ring (geschat op foto's, AHN NAP +14 tot +19 m vlak achter de
// voorkant): voorkant van NAP +14 tot +17 m, daarachter treden van 1,2 m
// diep en 0,8 m hoog. De onderkant loopt onder 45 graden terug tot op de
// onderste ring.
const UPPER = { bottom: 14.0, top: 17.0, tread: 1.2, rise: 0.8 };
// Ringgang tussen beide ringen langs de rechte lange zijden (AHN: 1,5 tot 2 m
// breed op straatniveau, |x| < 42 m).
const RINGGANG = { width: 2.0, halfLength: 42, floor: 2.2 };
// Dakrand 2 m dik; de onderkant loopt onder 50 graden schuin terug tot op de
// treden van de tweede ring.
const FASCIA = 2.0;
const UNDERSIDE = Math.tan((50 * Math.PI) / 180);
// Gevel in lagen, gemeten vanaf de dakgoot (radiaal): goot 1,2 m hoog, schuine
// onderkant tot de glazen band 1,1 m terug, glazen band 3 m hoog, daaronder
// de grijze band 0,8 m terug, de galerij op NAP +19,5 m tot 1,2 m voor de goot
// (AHN 1,2 m) met een borstwering van 1,2 m en een schuine onderkant tot de
// onderbouw 1,5 m achter de goot.
const GUTTER = 1.2;
const GLASS = { back: 1.1, height: 3.0 };
const GREY_BACK = 0.8;
const GALLERY = { top: 19.5, out: 1.2, parapet: 1.2 };
const LOWER_BACK = 1.5;
// Kolommen van het dak: 60 stuks van 1 × 1 m, om de 10,4 m langs de goot
// (traveeën), een kolom op elke as. Kruisverbanden in de twee traveeën aan
// weerszijden van elke hoek (zesde kolom vanaf de kopse as).
const COLUMNS = 60;
const COLUMN = { width: 1.0, front: 0.2, back: 1.6 };
const BRACE_BAYS = [5, 6, 23, 24, 35, 36, 53, 54];
const BRACE = { width: 0.9 };
// Trappentorens (AHN, om de drie traveeën, midden in een travee): de
// bordessen liggen om de 3,4 m en treden naar boven toe terug naar de gevel,
// zoals de trappen die naar de galerij oplopen. Per toren de bordessen van
// boven naar beneden als [NAP, afstand buiten de goot]: bij de kopse kanten 7 m
// breed (AHN: +16 m tot 4 m buiten de goot, +9 tot +11 m tot 5,5 m), midden op
// de kopse kanten 8 m breed en korter, op het midden van de lange zijden 5,5 m
// breed en lager.
const BIG_TOWER = [[16.1, 4.0], [12.7, 4.75], [9.3, 5.5], [5.9, 5.5]];
const END_TOWER = [[16.1, 2.0], [12.7, 3.0], [9.3, 4.0], [5.9, 4.5]];
const SMALL_TOWER = [[12.7, 3.5], [9.3, 4.0], [5.9, 4.0]];
const TOWERS = [
  { bay: 0, width: 8, levels: END_TOWER },
  { bay: 30, width: 8, levels: END_TOWER },
];
for (const bay of [1.5, 4.5, 7.5, 22.5, 25.5, 28.5]) {
  TOWERS.push({ bay, width: 7, levels: BIG_TOWER }, { bay: 60 - bay, width: 7, levels: BIG_TOWER });
}
for (const bay of [10.5, 13.5, 16.5, 19.5]) {
  TOWERS.push({ bay, width: 5.5, levels: SMALL_TOWER }, { bay: 60 - bay, width: 5.5, levels: SMALL_TOWER });
}
// Lichtmasten (AHN: koppen rond (±91,4, ±63,7) tot NAP +53,5 m).
const MAST = { u: 91.4, v: 63.7, foot: 4.0, neck: 1.6, neckNap: 46.0, head: [9.0, 2.0], headBottomNap: 49.7, topNap: 53.5 };
// Hoeken per omtrek: doorsnede om de 1 graad, treden om de 1,5 graad.
const STEPS = 360;
const RING_STEPS = 240;

const rInner = superellipse(ROOF_INNER);
const rRidge = superellipse(RIDGE);
const rOuter = superellipse(ROOF_OUTER);
const rFront = roundedRect(FRONT);
const eaveOffset = quadrantTable(EAVE_TABLE, 2.5);
const upperOffset = quadrantTable(UPPER_TABLE, 5);
const rEave = (phi) => rOuter(phi) + eaveOffset(phi);
const rUpper = (phi) => rInner(phi) - upperOffset(phi);
const lowerNap = (phi, r) => FRONT.z + FRONT.slope * (r - rFront(phi));

// ---------- doorsnede per richting ----------
// Afstand achter de voorkant van de tweede ring waar de schuine onderkant de
// treden van de onderste ring (plus 0,4 m) raakt.
const caveDepth = (phi) =>
  (UPPER.bottom - FRONT.z - 0.4 - FRONT.slope * (rUpper(phi) - rFront(phi))) / (1 + FRONT.slope);
// Lijn onder de treden van de tweede ring en snijpunt met de onderkant van
// het dak.
const tierSlope = UPPER.rise / UPPER.tread;
const tierBase = UPPER.top - UPPER.rise;
function meetRadius(phi) {
  const ri = rInner(phi);
  const zIn = roofNap(ri - rRidge(phi));
  return (zIn - FASCIA - tierBase + tierSlope * rUpper(phi) + UNDERSIDE * ri) / (tierSlope + UNDERSIDE);
}
// Doorsnede (r, NAP) met de klok mee in het rz-vlak: voet en einde van de
// schuine onderkant van de tweede ring, voorkant tweede ring (met een lip
// van 0,3 m tot de bovenste rand), lijn onder de treden tot de onderkant van
// het dak, dakrand, nok, dakgoot, glazen band,
// grijze band, galerij met borstwering en schuine onderkant, onderbouw.
function profile(phi) {
  const rU = rUpper(phi);
  const ri = rInner(phi);
  const rr = rRidge(phi);
  const re = rEave(phi);
  const xc = caveDepth(phi);
  const zIn = roofNap(ri - rr);
  const zE = roofNap(re - rr);
  const rM = meetRadius(phi);
  const zM = tierBase + tierSlope * (rM - rU);
  return [
    [rU + xc, 1.0],
    [rU + xc, UPPER.bottom - xc],
    [rU, UPPER.bottom],
    [rU, UPPER.top],
    [rU + 0.3, UPPER.top],
    [rU + 0.3, tierBase + tierSlope * 0.3],
    [rM, zM],
    [ri, zIn - FASCIA],
    [ri, zIn],
    [rr, ROOF.ridge],
    [re, zE],
    [re, zE - GUTTER],
    [re - GLASS.back, zE - GUTTER - GLASS.back],
    [re - GLASS.back, zE - GUTTER - GLASS.back - GLASS.height],
    [re - GREY_BACK, zE - GUTTER - GLASS.back - GLASS.height],
    [re - GREY_BACK, GALLERY.top],
    [re + GALLERY.out, GALLERY.top],
    [re + GALLERY.out, GALLERY.top - GALLERY.parapet],
    [re - LOWER_BACK, GALLERY.top - GALLERY.parapet - (GALLERY.out + LOWER_BACK)],
    [re - LOWER_BACK, 1.0],
  ].map(([r, z]) => [r, NAP(z)]);
}
function bowlSolid() {
  const pos = [];
  let count = 0;
  for (let i = 0; i < STEPS; i++) {
    const phi = (2 * Math.PI * i) / STEPS;
    const [c, s] = [Math.cos(phi), Math.sin(phi)];
    const points = profile(phi);
    count = points.length;
    for (const [r, z] of points) pos.push(r * c, r * s, z);
  }
  const tri = [];
  for (let i = 0; i < STEPS; i++) {
    const a = i * count;
    const b = ((i + 1) % STEPS) * count;
    for (let k = 0; k < count; k++) {
      const k1 = (k + 1) % count;
      // Vierhoek tussen hoek i en i + 1, linksom gezien van buitenaf.
      tri.push(a + k, a + k1, b + k1, a + k, b + k1, b + k);
    }
  }
  return new Manifold(
    new Mesh({ numProp: 3, vertProperties: new Float32Array(pos), triVerts: new Uint32Array(tri) }),
  );
}

// Ring tussen twee radiale krommen, van z0 tot z1 (meters, model).
function ringBand(inner, outer, z0, z1) {
  const outerPts = [];
  const innerPts = [];
  for (let i = 0; i < RING_STEPS; i++) {
    const phi = (2 * Math.PI * i) / RING_STEPS;
    const [c, s] = [Math.cos(phi), Math.sin(phi)];
    const ro = outer(phi);
    const ri = Math.min(inner(phi), ro - 0.05);
    outerPts.push([ro * c, ro * s]);
    innerPts.push([ri * c, ri * s]);
  }
  innerPts.reverse();
  return new CrossSection([outerPts, innerPts]).extrude(z1 - z0).translate([0, 0, z0]);
}

// ---------- kom met dak ----------
const bowl = bowlSolid();
// Onderste ring in treden van de veldomranding tot onder de tweede ring.
const lowerOuter = (phi) => rUpper(phi) + caveDepth(phi) + 1;
const lowerSteps = [];
for (let k = 0; ; k++) {
  let any = false;
  for (let i = 0; i < 360 && !any; i++) {
    const phi = (2 * Math.PI * i) / 360;
    if (rFront(phi) + LOWER_TREAD * k < lowerOuter(phi) - 0.05) any = true;
  }
  if (!any) break;
  lowerSteps.push(
    ringBand((phi) => rFront(phi) + LOWER_TREAD * k, lowerOuter, BASE, NAP(FRONT.z + FRONT.slope * LOWER_TREAD * k)),
  );
}
// Tweede ring: treden van de voorkant tot onder de onderkant van het dak.
const upperOuter = (phi) => meetRadius(phi) + 1.5;
const upperSteps = [];
for (let k = 0; UPPER.top + UPPER.rise * k < 23; k++) {
  upperSteps.push(
    ringBand(
      (phi) => Math.min(rUpper(phi) + 0.15 + UPPER.tread * k, meetRadius(phi) + 1.2),
      upperOuter,
      NAP(UPPER.bottom + 0.5),
      NAP(UPPER.top + UPPER.rise * k),
    ),
  );
}
// Ringgang langs de rechte lange zijden, tussen de onderste ring en de
// voorkant van de tweede ring.
function ringgang(sign) {
  const pts = [];
  const inner = [];
  for (let i = 0; i <= 200; i++) {
    const x = -RINGGANG.halfLength + (2 * RINGGANG.halfLength * i) / 200;
    // Richting waarin de straal x oplevert op de lange zijde.
    const phi = Math.atan2(sign * 60, x);
    let lo = phi - 0.5;
    let hi = phi + 0.5;
    // Zoek phi zodat rUpper(phi) * cos(phi) = x (bisectie op de hoek).
    const f = (p) => rUpper(p) * Math.cos(p) - x;
    for (let k = 0; k < 60; k++) {
      const m = (lo + hi) / 2;
      if ((f(lo) > 0) === (f(m) > 0)) lo = m;
      else hi = m;
    }
    const p = (lo + hi) / 2;
    const r = rUpper(p);
    pts.push([r * Math.cos(p), r * Math.sin(p)]);
    const r2 = r - RINGGANG.width;
    inner.push([r2 * Math.cos(p), r2 * Math.sin(p)]);
  }
  // Iets voorbij de voorkant (0,01 m) zodat de snede de onderste ring geheel
  // doorsnijdt, maar onder de tweede ring blijft.
  const poly = [...pts.map(([x, y]) => [x * 1.0002, y * 1.0002]), ...inner.reverse()];
  const area = poly.reduce((acc, [x, y], i) => {
    const [x2, y2] = poly[(i + 1) % poly.length];
    return acc + x * y2 - x2 * y;
  }, 0);
  const ccw = area > 0 ? poly : poly.slice().reverse();
  return new CrossSection([ccw]).extrude(UPPER.bottom - 0.5 - RINGGANG.floor).translate([0, 0, NAP(RINGGANG.floor)]);
}
let stadium = Manifold.union([bowl, ...lowerSteps, ...upperSteps]).subtract(
  Manifold.union([ringgang(1), ringgang(-1)]),
);

// ---------- gevel: kolommen, kruisverbanden en trappentorens ----------
// Gelijk verdeeld naar booglengte langs de goot, te beginnen bij -X; de
// normaal komt van de gladde buitenrand-superellips.
const outline = [];
const N_OUT = 20000;
for (let i = 0; i <= N_OUT; i++) {
  const phi = -Math.PI + (2 * Math.PI * i) / N_OUT;
  const r = rEave(phi);
  outline.push({ phi, x: r * Math.cos(phi), y: r * Math.sin(phi) });
}
const arc = [0];
for (let i = 1; i < outline.length; i++) {
  arc.push(arc[i - 1] + Math.hypot(outline[i].x - outline[i - 1].x, outline[i].y - outline[i - 1].y));
}
const perimeter = arc[arc.length - 1];
const bayLength = perimeter / COLUMNS;
// Punt op de goot bij travee `bay` (0 = kopse as aan -X), met de normaal naar
// buiten en de goothoogte.
function eaveAt(bay) {
  const l = ((((bay * bayLength) % perimeter) + perimeter) % perimeter);
  let i = arc.findIndex((value) => value >= l);
  i = Math.min(Math.max(i, 1), outline.length - 2);
  const { phi, x, y } = outline[i];
  // Normaal van de gladde buitenrand (afgeleide naar phi).
  const d = 1e-4;
  const p0 = [rOuter(phi - d) * Math.cos(phi - d), rOuter(phi - d) * Math.sin(phi - d)];
  const p1 = [rOuter(phi + d) * Math.cos(phi + d), rOuter(phi + d) * Math.sin(phi + d)];
  const t = [p1[0] - p0[0], p1[1] - p0[1]];
  const len = Math.hypot(t[0], t[1]);
  const n = [t[1] / len, -t[0] / len];
  return { x, y, n, angle: (Math.atan2(n[1], n[0]) * 180) / Math.PI, zE: NAP(roofNap(Math.hypot(x, y) - rRidge(phi))) };
}
// Lokaal stelsel van een gevelonderdeel: x naar buiten (0 = goot), y langs de
// gevel, z omhoog (model).
const place = (solid, at) => solid.rotate([0, 0, at.angle]).translate([at.x, at.y, 0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);

const facadeParts = [];
// Kolommen van de onderbouw tot in de goot.
for (let k = 0; k < COLUMNS; k++) {
  const at = eaveAt(k);
  facadeParts.push(
    place(box(-COLUMN.back, COLUMN.front, -COLUMN.width / 2, COLUMN.width / 2, BASE, at.zE - GUTTER + 0.2), at),
  );
}
// Kruisverbanden: twee diagonalen van de voet van de ene kolom tot onder de
// glazen band bij de volgende, in het vlak van de kolommen.
function rib(p, q) {
  const corners = [];
  for (const end of [p, q]) {
    for (const dx of [-COLUMN.back + 0.1, COLUMN.front]) {
      for (const dy of [-BRACE.width / 2, BRACE.width / 2]) {
        for (const dz of [0, BRACE.width]) {
          const c = Math.cos((end.at.angle * Math.PI) / 180);
          const s = Math.sin((end.at.angle * Math.PI) / 180);
          corners.push([end.at.x + dx * c - dy * s, end.at.y + dx * s + dy * c, end.z + dz]);
        }
      }
    }
  }
  return Manifold.hull(corners);
}
for (const bay of BRACE_BAYS) {
  const a = eaveAt(bay);
  const b = eaveAt(bay + 1);
  const top = Math.min(a.zE, b.zE) - GUTTER - GLASS.back - BRACE.width;
  facadeParts.push(rib({ at: a, z: BASE }, { at: b, z: top }), rib({ at: b, z: BASE }, { at: a, z: top }));
}
// Trappentoren: per bordes een kern tot dat bordes, het bordes rondom met
// een rechte rand van 0,5 m en een schuine onderkant onder 45 graden,
// hoekstijlen en de trappen als schuine richels op de buitenvlakken. Lagere
// bordessen steken verder uit, dus de toren treedt naar boven toe terug.
function stairTower({ width, levels }) {
  const back = -LOWER_BACK - 0.5;
  const hw = width / 2;
  const inset = 0.4;
  const parts = [];
  // Trap als richel tussen twee punten (a, z) op een buitenvlak; doorsnede
  // met een onderkant van 60 graden.
  const flight = (p, q, axis) => {
    const pts = [];
    for (const [a, z] of [p, q]) {
      for (const [d, dz] of [[-0.1, -0.8], [-0.1, 0], [inset, 0], [inset, -0.1]]) pts.push(axis(a, d, z + dz));
    }
    return Manifold.hull(pts);
  };
  levels.forEach(([top, out], j) => {
    const z = NAP(top);
    // Bovenkant van het bordes eronder (of het maaiveld).
    const below = j + 1 < levels.length ? NAP(levels[j + 1][0]) : NAP(2.0);
    parts.push(box(back, out - inset, -hw + inset, hw - inset, BASE, z));
    const pts = [];
    for (const [x, y] of [[back, -hw], [back, hw], [out, -hw], [out, hw]]) pts.push([x, y, z], [x, y, z - 0.5]);
    for (const [x, y] of [[back, -hw + inset], [back, hw - inset], [out - inset, -hw + inset], [out - inset, hw - inset]]) {
      pts.push([x, y, z - 0.5 - inset]);
    }
    parts.push(Manifold.hull(pts));
    for (const sy of [-1, 1]) {
      parts.push(box(out - 0.9, out, sy > 0 ? hw - 0.9 : -hw, sy > 0 ? hw : -hw + 0.9, BASE, z));
    }
    // Trappen van het bordes eronder naar dit bordes, om en om.
    const flip = j % 2 ? -1 : 1;
    const yA = flip * (hw - 1.0);
    parts.push(flight([yA, below], [-yA, z - 0.5], (a, d, zz) => [out - inset + d, a, zz]));
    for (const sy of [-1, 1]) {
      const [xA, xB] = flip > 0 ? [back + 0.6, out - 1.0] : [out - 1.0, back + 0.6];
      parts.push(flight([xA, below], [xB, z - 0.5], (a, d, zz) => [a, sy * (hw - inset + d), zz]));
    }
  });
  return Manifold.union(parts);
}
for (const tower of TOWERS) facadeParts.push(place(stairTower(tower), eaveAt(tower.bay)));
// Bijna vlakke driehoeken samenvoegen (2 cm), voor een GLB onder 2 MB.
stadium = Manifold.union([stadium, ...facadeParts]).simplify(0.02);

// ---------- lichtmasten ----------
function mast(su, sv) {
  const [u, v] = [su * MAST.u, sv * MAST.v];
  const angle = (Math.atan2(v, u) * 180) / Math.PI;
  const shaftHeight = NAP(MAST.neckNap) - BASE;
  const shaft = CrossSection.square([MAST.foot, MAST.foot], true)
    .extrude(shaftHeight, 0, 0, [MAST.neck / MAST.foot, MAST.neck / MAST.foot])
    .translate([0, 0, BASE]);
  // Kop: 9 m breed (dwars op de richting naar het hart), 2 m diep; de
  // onderkant loopt onder 45 graden uit vanaf de hals.
  const [w, d] = MAST.head;
  const pts = [];
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      pts.push([(sx * MAST.neck) / 2, (sy * MAST.neck) / 2, NAP(MAST.neckNap) - 0.01]);
      pts.push([(sx * d) / 2, (sy * w) / 2, NAP(MAST.headBottomNap)]);
      pts.push([(sx * d) / 2, (sy * w) / 2, NAP(MAST.topNap)]);
    }
  }
  return Manifold.union([shaft, Manifold.hull(pts)]).rotate([0, 0, angle]).translate([u, v, 0]);
}
const masts = Manifold.union([mast(1, 1), mast(1, -1), mast(-1, 1), mast(-1, -1)]);

const nodes = [
  ["building:stadion", stadium],
  ["building:lichtmasten", masts],
];
const printModel = Manifold.union([stadium, masts]);

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}


await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of nodes) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "stadion-feijenoord.glb");
const glb = toGlb(nodes, "NederPrint generate-stadion-feijenoord.mjs (manifold-3d)");
await writeFile(glbFile, glb);
report.glb = { file: glbFile, bytes: glb.length, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (NAP +1,0 m) op het printbed.
const stlFile = path.join(outDir, `stadion-feijenoord-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Stadion Feijenoord 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
const footprint = printModel.boundingBox();
await writeFile(
  path.join(outDir, "stadion-feijenoord.json"),
  JSON.stringify(
    {
      name: "Stadion Feijenoord (De Kuip)",
      file: "stadion-feijenoord.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Straten en pleinen vlak voor de gevel en de kopse trappentorens
      // (NAP +2,0 m), niet het lagere veld of de gracht eromheen.
      groundSamplePoints: [
        [108, 0],
        [-108, 0],
        [0, 91],
        [0, -91],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0599100100005153", "NL.IMBAG.Pand.0599100110026028"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van het veld op straatniveau (NAP +2,0 m) in de oorsprong, +X langs de lengteas van het veld naar het zuidzuidoosten (RD-richting -63,06 graden) en +Y dwars daarop naar het noordnoordoosten. Node building:stadion bevat de open kom met de onderste ring in treden, de ringgang langs de lange zijden, de tweede ring met voorkant en treden, het ringvormige dak (binnenrand, nok en buitenrand als superellipsen, de dakgoot per richting uit het AHN), de gevel met glazen band, galerij, 60 kolommen, kruisverbanden in de hoeken en 22 trappentorens met bordessen en trappen; node building:lichtmasten de vier vakwerkmasten op de hoeken. Het dak en de tweede ring hangen in werkelijkheid los; hier lopen hun onderkanten onder 50 en 45 graden schuin terug tot op de tribune eronder. Vervangt de PDOK-reconstructie van BAG-panden 0599100100005153 en 0599100110026028; de kom zelf is geen BAG-pand.",
      printFiles: [`stadion-feijenoord-1-${scale}.stl`],
      realWorld: {
        pitchM: [105, 68],
        pitchSurroundM: [FRONT.halfU * 2, FRONT.halfV * 2],
        roofInnerEdgeM: [ROOF_INNER.a * 2, +(ROOF_INNER.b * 2).toFixed(1)],
        roofRidgeM: [RIDGE.a * 2, +(RIDGE.b * 2).toFixed(1)],
        eaveM: [+(rEave(0) * 2).toFixed(1), +(rEave(Math.PI / 2) * 2).toFixed(1)],
        footprintM: [0, 1].map((i) => +(footprint.max[i] - footprint.min[i]).toFixed(1)),
        roofRidgeNapM: ROOF.ridge,
        roofInnerEdgeNapM: [+roofNap(rInner(Math.PI / 4) - rRidge(Math.PI / 4)).toFixed(2), +roofNap(ROOF_INNER.a - RIDGE.a).toFixed(2)],
        lowerTierTreadM: [LOWER_TREAD, +(LOWER_TREAD * FRONT.slope).toFixed(2)],
        upperTierFrontNapM: [UPPER.bottom, UPPER.top],
        upperTierTreadM: [UPPER.tread, UPPER.rise],
        galleryNapM: GALLERY.top,
        columns: COLUMNS,
        stairTowers: TOWERS.length,
        floodlightMasts: 4,
        floodlightTopNapM: MAST.topNap,
        streetNapM: 2.0,
        capacity: 47500,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Stadion_Feijenoord",
        "PDOK AHN DSM/DTM 0,5 m via WCS: veldomranding, dakranden, nok, dakhoogte, dakgoot, voorkant tweede ring, onderste ring, ringgang, galerij, trappentorens, lichtmasten en straatniveau",
        "PDOK BAG panden 0599100100005153 en 0599100110026028, EPSG:28992",
        "PDOK luchtfoto (Actueel_orthoHR): dak, tribunes en trappentorens",
        "Wikimedia Commons: Overzicht vanaf de straat - Rotterdam - 20349851 - RCE.jpg, De Kuip bij zonnig daglicht.jpg, Stadion Feyenoord Rotterdam.jpg, Overzicht buitenzijde voetbalstadion, trapopgang tribunes - Rotterdam - 20191829 - RCE.jpg, Stadion Feijenoord (47370311861).jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
