// Haagse Poort (Schenkkade, Den Haag; Rob Ligtvoet / Nationale-Nederlanden,
// 1994): kantoorcomplex van 255 m dat de verdiepte Utrechtsebaan met een grote
// boog overspant. Eén lange schijf (15 m breed) loopt van een spitse punt in
// het zuidwesten over de laagbouw (+36,6) en als brug over de weg (+35,1) naar
// het hoogbouwdeel, waar ze als bovenste balk (+70,5) over twee torens van
// +59,9 heen loopt. Onder de brug een paraboolvormige boog van 55 m met een
// groene stalen boogrib; de laagbouw heeft drie kamvleugels (+31,1) met ronde
// trappenhuiskoppen en een lage driehoekige vleugel (+16,7) met de glazen
// koepel boven de centrale hal. De torens hebben een scheve punt (prow) naar
// het noordwesten, een verhoogde middenstrook op het dak en ronde
// trappenhuizen op de zuidkop; ertussen een glazen atrium met rotonde (noord)
// en een lager parkeerdek (zuid). Gevels in groen-wit gestreept metaal met
// weinig vensters (schijf) en vierkante vensters in een raster (torens,
// vleugels). Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen
// gestapelde DSM-lagen. Voorbeeld per rij: generate-evoluon.mjs (aanpak
// primitieven), generate-haagse-toren.mjs en generate-hoftoren.mjs
// (skylinetorens op efteling-kit.mjs).
//
//   node scripts/generate-haagse-poort.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel (u, v): +u langs de schijf op 35,64 graden in RD (BAG-gevels
// 35,6/125,6 graden), +v naar het noordwesten (Prinses Beatrixlaan), meet-
// oorsprong RD (82960, 454825). Het model krijgt zijn oorsprong in het midden
// van de boog op de as van de schijf (u = 3,0, v = -1,4), z = 0 op NAP +0,7 m
// (straten rondom: AHN-DTM +0,6 tot +0,8; de Utrechtsebaan ligt verdiept op
// NAP -3,3 tot -5,1 en de straatjes langs de bak op 0,0 tot +0,5).
//
// Bronnen: BAG-pand 0518100000229788 (het hele complex is één pand), AHN
// DSM/DTM 0,5 m (PDOK WCS, in dit stelsel uitgelezen), 3D BAG LoD2.2 (TU
// Delft/3D geoinformatie, CC BY 4.0: dakhoogtes 16,7/18,4/19,8/23,3/31,1/
// 34,7/35,1/36,6/59,9/61,5/70,5, koepel en rotonde), Actueel_orthoHR,
// Wikipedia (275 m, 70 m, boog vanaf de zevende etage, centrale hal met
// cilinder en koepel) en Commons-foto's van alle kanten (boog, gevels).
import { CrossSection, Manifold, prism, union, ccw, hull, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "haagse-poort";
const AXIS_DEG = 35.64;
const RAD = (AXIS_DEG * Math.PI) / 180;
const MEASURE_ORIGIN = [82960, 454825];
const HEART = [3.0, -1.4]; // midden van de boog op de as van de schijf (u, v)
const ORIGIN = [
  +(MEASURE_ORIGIN[0] + HEART[0] * Math.cos(RAD) - HEART[1] * Math.sin(RAD)).toFixed(2),
  +(MEASURE_ORIGIN[1] + HEART[0] * Math.sin(RAD) + HEART[1] * Math.cos(RAD)).toFixed(2),
];
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 0.7;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  lowSlab: 36.6, // laagbouwschijf (3D BAG 36,57-36,66, AHN 36,5-36,8 met dakrand)
  bridge: 35.1, // brugdeel over de Utrechtsebaan (3D BAG 35,12-35,15)
  highSlab: 70.5, // bovenste balk over de torens (3D BAG 70,50-70,59)
  plantWell: 68.6, // verlaagd installatiedek in de bovenste balk (3D BAG 68,62)
  tower: 59.9, // beide torens (3D BAG 59,91-60,01)
  towerRidge: 61.5, // verhoogde middenstrook op de torendaken (3D BAG 61,33-61,61)
  atrium: 34.7, // glazen atrium tussen de torens (3D BAG 34,65-34,77)
  rotunda: 39.0, // glazen rotonde op het atrium (AHN 38,9-39,0; 3D BAG 38,75)
  rotundaDrum: 37.0,
  courtNorth: 23.3, // strook van het zuidelijke deel langs de schijf (3D BAG 23,36-23,41)
  courtMid: 18.4, // parkeerdek (3D BAG 18,45)
  courtSouth: 19.8, // zuidelijk deel (3D BAG 19,81)
  finger: 31.1, // drie kamvleugels (3D BAG 31,11-31,23)
  hall: 16.7, // driehoekige vleugel met de centrale hal (3D BAG 16,67-16,72)
  hallBlock: 20.4, // blok tussen koepel en schijf en de cilinder (3D BAG 20,40-20,45)
  dome: 27.4, // top van de glazen koepel (AHN 27,4; 3D BAG 26,9)
  canopy: 5.8, // entreeluifel aan het atrium (AHN 5,8)
  entranceBay: 9.6, // ronde entree onder de luifel (AHN 9,5-9,6)
  street: 0.5, // voet van de boog (straatjes langs de bak, AHN-DTM 0,0-0,7)
};
// Verdiepingen (foto's): schijf en vleugels 3,5 m boven een begane grond tot
// +5,0; torens 3,6 m. De boog reikt tot in de zevende laag (Wikipedia).
const FLOOR0 = 5.0;
const SLAB_STOREY = 3.5;
const TOWER_STOREY = 3.6;
const NICHE = 0.35;

// ---------- plattegrond (m, gebouwstelsel u, v; BAG-contour) ----------
const SE = -8.88; // zuidoostgevel van de schijf
const NW = 6.12; // noordwestgevel van de schijf
const LOW_SLAB = [[-155.6, NW], [-132.37, SE], [-28.5, SE], [-28.5, NW]]; // spitse zuidwestpunt (BAG)
const BRIDGE = [[-28.5, SE], [31.3, SE], [31.3, NW], [-28.5, NW]];
const HIGH_SLAB = [[31.3, SE], [99.83, SE], [99.83, NW], [31.3, NW]]; // west eind 3D BAG u 31,3; oostkop BAG
const TOWER_W = [[35.63, -48.49], [50.6, -48.49], [50.6, 31.45], [35.63, 45.93]];
const TOWER_E = [[78.86, -48.49], [93.83, -48.49], [93.83, 45.96], [78.86, 31.46]];
const ATRIUM = [[50.6, NW], [78.86, NW], [78.86, 31.45], [50.6, 31.45]];
const COURT = [
  { poly: [[50.6, -12.4], [78.86, -12.4], [78.86, SE], [50.6, SE]], top: H.courtNorth },
  { poly: [[50.6, -30.0], [78.86, -30.0], [78.86, -12.4], [50.6, -12.4]], top: H.courtMid },
  { poly: [[50.6, -48.49], [78.86, -48.49], [78.86, -30.0], [50.6, -30.0]], top: H.courtSouth },
];
const FINGERS = [[-129.94, -114.97], [-86.77, -71.77], [-43.56, -28.57]];
const FINGER_END = 45.73;
// Lage driehoekige vleugel met de gebogen zuidoostgevel (BAG).
const HALL = [
  [-28.58, SE], [-125.09, SE], [-125.14, -11.78], [-127.3, -11.81], [-123.08, -14.12], [-112.57, -19.53], [-101.69, -24.69],
  [-99.32, -25.74], [-88.26, -30.41], [-77.06, -34.71], [-76.42, -34.94], [-65.22, -38.77], [-53.91, -42.22], [-42.48, -45.29],
  [-41.92, -45.43], [-39.94, -45.92], [-36.91, -46.6], [-28.6, -48.48],
];
// Centrale hal: cilinder met glazen koepel (AHN: rand 20,4 op straal 12,2,
// top 27,4) en een blok tussen koepel en schijf (3D BAG u -64,9..-50,7).
const DOME = { c: [-58.0, -25.2], r: 12.2 };
const HALL_BLOCK = [[-64.9, -15.0], [-50.7, -15.0], [-50.7, SE], [-64.9, SE]];
// Rotonde op het atrium (AHN: straal 5,6 rond u 64,5, v 19).
const ROTUNDA = { c: [64.5, 19.0], r: 5.6 };
// Entree aan het atrium: ronde uitbouw (BAG, straal 3,2) en luifel (AHN 5,8).
const ENTRANCE = { c: [64.74, 31.45], r: 3.2 };
const CANOPY = [[56.0, 31.4], [73.0, 31.4], [73.0, 35.4], [56.0, 35.4]];
// Ronde trappenhuiskoppen (BAG): 3 m recht en een halve cirkel, volle hoogte.
const BAYS = [
  ...FINGERS.map(([u0, u1]) => ({ c: [(u0 + u1) / 2, FINGER_END], r: 2.13, stem: 2.99, dir: 1, top: H.finger })),
  { c: [43.12, -48.49], r: 2.1, stem: 2.98, dir: -1, top: H.tower },
  { c: [86.34, -48.49], r: 2.1, stem: 2.98, dir: -1, top: H.tower },
];
// Verhoogde middenstroken op de torendaken (AHN 61,5 over 2,8 m).
const RIDGES = [43.12, 86.34];

// Installaties op de daken (3D BAG / AHN): [u0, v0, u1, v1, NAP-top].
const PLANT = [
  [-132.0, -6.0, -114.0, 3.0, 38.4],
  [-137.5, -2.0, -133.5, 1.0, 38.7],
  [-109.5, -5.5, -107.0, 4.0, 39.0],
  [-104.0, -5.5, -101.5, 4.0, 39.0],
  [-86.0, -1.5, -82.0, 0.5, 38.3],
  [-76.5, -31.0, -72.5, -12.0, 18.2],
  [-71.5, -29.0, -68.5, -15.0, 18.2],
  [37.0, 0.0, 41.6, 3.7, 71.6],
  [41.6, -6.1, 43.9, 0.8, 71.7],
  [47.9, -6.1, 49.9, 0.8, 71.7],
  [78.2, -6.1, 80.8, 1.0, 71.6],
  [81.5, -6.2, 87.4, 1.5, 71.6],
  [93.6, -2.7, 96.0, 3.8, 72.0],
];
const PLANT_WELL = [[56.5, -7.0], [72.0, -7.0], [72.0, 5.0], [56.5, 5.0]];
const WELL_UNITS = [[57.5, -6.0, 63.5, -1.0], [57.5, 0.0, 63.5, 4.0], [65.0, -6.0, 71.0, -1.0], [65.0, 0.0, 71.0, 4.0]];

// ---------- de boog ----------
// Uit de frontale foto vanaf de Prinses Beatrixlaan (schaal 0,091 m per pixel
// op de schijf van 64 m tussen toren en kamvleugel): voeten op u -24,4 en
// +30,4 (binnen), kruin van de onderzijde 21,1 m boven de straat. Het profiel
// ligt tussen een parabool en een ellips: hoogte = H (1 - |x/a|^2,38). De
// groene stalen rib is 1,5 m breed en steekt 0,5 m voor de gevel.
const ARCH = { uc: 3.0, a: 27.4, h: 21.1, p: 2.38 };
const RIB = { width: 1.5, out: 0.5 };
const archZ = (x, a = ARCH.a, h = ARCH.h) => z(H.street) + h * (1 - Math.abs(x / a) ** ARCH.p);
const EXT = { a: ARCH.a + RIB.width, h: ARCH.h + RIB.width };
// Halve breedte van de extrados op hoogte zz (model-z), voor de gevelnissen.
const extHalf = (zz) => {
  const t = (zz - z(H.street)) / EXT.h;
  return t >= 1 ? -1 : EXT.a * (1 - Math.max(t, 0)) ** (1 / ARCH.p);
};
// Printbare doorgang. Het echte gewelf is een tongewelf met een vlakke kruin
// over de volle diepte van de schijf (16 m met de ribben); op 1:1000 vult de
// export daaronder alles op wat vlakker hangt dan 45 graden, en dat werd een
// dichte plaat onder de kruin met een wand tot de onderplaat (getest: ook
// een spits oplopend gewelf binnen de schijf hangt aan de gevelrand). Daarom:
// op de voorkant van beide ribben staat het echte boogprofiel; vandaar loopt
// de onderzijde onder 62 graden schuin naar binnen omlaag (een diepe, schuine
// dagkant), tot ze een spitsboog van 50 graden bereikt die als doorgang door
// de hele schijf loopt (top op de hoogte van de echte kruin, voeten 35 m uit
// elkaar). Elk deel van de onderzijde loopt zo steiler dan de printhoek.
const VAULT = { revealDeg: 62, innerDeg: 50 };

// ---------- hulpfuncties ----------
const cs = (poly) => new CrossSection([ccw(poly)]);
const rect = (u0, v0, u1, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const box = (u0, v0, z0, u1, v1, z1) => prism(rect(u0, v0, u1, v1), z0, z1);
const arc = (c, r, a0, a1, n) => Array.from({ length: n + 1 }, (_, k) => {
  const t = ((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180;
  return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)];
});
const bayPoly = ({ c, r, stem, dir }, grow = 0) => {
  const y0 = c[1] - dir * 0.5; // 0,5 m de gevel in
  const y1 = c[1] + dir * stem;
  const rr = r + grow;
  const half = dir > 0 ? arc([c[0], y1], rr, 0, 180, 18) : arc([c[0], y1], rr, 180, 360, 18);
  return dir > 0 ? [[c[0] + rr, y0], ...half, [c[0] - rr, y0]] : [[c[0] - rr, y0], ...half, [c[0] + rr, y0]];
};
const inPoly = ([x, y], poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

// Alle volumes als {poly, top} voor de blootstellingstoets van de gevels:
// een nis komt alleen waar vóór de gevel niets anders staat.
const VOLUMES = [
  { name: "laagbouwschijf", poly: LOW_SLAB, top: H.lowSlab },
  { name: "brug", poly: BRIDGE, top: H.bridge },
  { name: "bovenste balk", poly: HIGH_SLAB, top: H.highSlab },
  { name: "westtoren", poly: TOWER_W, top: H.tower },
  { name: "oosttoren", poly: TOWER_E, top: H.tower },
  { name: "atrium", poly: ATRIUM, top: H.atrium },
  ...COURT.map((c, i) => ({ name: `zuiddeel${i}`, poly: c.poly, top: c.top })),
  ...FINGERS.map(([u0, u1], i) => ({ name: `kamvleugel${i + 1}`, poly: rect(u0, NW, u1, FINGER_END), top: H.finger })),
  { name: "halvleugel", poly: HALL, top: H.hall },
  { name: "halblok", poly: HALL_BLOCK, top: H.hallBlock },
  ...BAYS.map((b, i) => ({ name: `trappenhuis${i}`, poly: bayPoly(b), top: b.top })),
  { name: "entree", poly: arc(ENTRANCE.c, ENTRANCE.r, 0, 180, 12), top: H.entranceBay },
  { name: "luifel", poly: CANOPY, top: H.canopy },
];
// Ligt (u, v) op NAP-hoogte nap binnen een ander volume, of in de boog?
const covered = ([u, v], nap, self) =>
  VOLUMES.some((o) => o !== self && nap < o.top && inPoly([u, v], o.poly)) ||
  (v > SE - 1.5 && v < NW + 1.5 && Math.abs(u - ARCH.uc) < extHalf(z(nap)) + 0.6);

// Blinde nis in de gevel a→b (veelhoek tegen de klok in, buitenkant rechts):
// s0..s1 langs de gevel, NAP-hoogtes, diepte in de gevel, `out` naar buiten.
const niche = (a, b, s0, s1, nap0, nap1, depth = NICHE, out = 1.0) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return Manifold.cube([depth + out, s1 - s0, nap1 - nap0])
    .translate([-depth, s0, z(nap0)])
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
// Vrije stukken van een gevel op een hoogte: [s0, s1] waar de punten 0,6 m
// voor de gevel niet in een ander volume of de boog liggen (stap 0,25 m).
function exposedRuns(vol, a, b, nap0, nap1, margin = 0.4) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  const runs = [];
  let start = null;
  const steps = Math.ceil(len / 0.25);
  for (let k = 0; k <= steps; k++) {
    const s = (len * k) / steps;
    const p = [a[0] + (dx * s) / len + n[0] * 0.6, a[1] + (dy * s) / len + n[1] * 0.6];
    const free = !covered(p, nap0, vol) && !covered(p, nap1, vol) && !covered(p, (nap0 + nap1) / 2, vol);
    if (free && start === null) start = s;
    if ((!free || k === steps) && start !== null) {
      const end = free ? s : s - len / steps;
      if (end - start > 2 * margin + 0.9) runs.push([start + margin, end - margin]);
      start = null;
    }
  }
  return { runs, len };
}
// Vensters per travee in alle vrije stukken van de gevels van een volume.
function windows(vol, { pitch, width, rows, edges = () => true, offset = 0 }) {
  const P = ccw(vol.poly);
  const out = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length];
    if (!edges(a, b)) continue;
    for (const [r0, r1, rowPitch = pitch, rowOffset = offset] of rows) {
      if (r1 > vol.top - 0.4) continue;
      const { runs } = exposedRuns(vol, a, b, r0, r1);
      for (const [s0, s1] of runs) {
        const n = Math.floor((s1 - s0 + rowPitch - width) / rowPitch);
        if (n < 1) continue;
        const first = s0 + (s1 - s0 - (n - 1) * rowPitch - width) / 2;
        for (let k = 0; k < n; k++) {
          if (rowOffset && k % 2 === (rowOffset > 0 ? 1 : 0)) continue; // verspringende rijen
          const w0 = first + k * rowPitch;
          out.push(niche(a, b, w0, w0 + width, r0, r1));
        }
      }
    }
  }
  return out;
}
// Doorlopende horizontale groeven (verdiepingsbanden) over de vrije stukken.
function bands(vol, levels, height = 0.5, depth = 0.3, edges = () => true) {
  const P = ccw(vol.poly);
  const out = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length];
    if (!edges(a, b)) continue;
    for (const lvl of levels) {
      const { runs } = exposedRuns(vol, a, b, lvl - height / 2, lvl + height / 2, 0.3);
      for (const [s0, s1] of runs) out.push(niche(a, b, s0, s1, lvl - height / 2, lvl + height / 2, depth));
    }
  }
  return out;
}
const storeys = (from, to, pitch) => {
  const out = [];
  for (let f = from; f <= to + 1e-6; f += pitch) out.push(+f.toFixed(2));
  return out;
};

const parts = [];
const cuts = [];
const longFace = (a, b) => Math.abs(a[1] - b[1]) < 0.01; // gevels evenwijdig aan de schijf

// ---------- de schijf: laagbouw, brug en bovenste balk ----------
const lowVol = VOLUMES[0], bridgeVol = VOLUMES[1], highVol = VOLUMES[2];
parts.push(prism(LOW_SLAB, BASE, z(H.lowSlab)), prism(BRIDGE, BASE, z(H.bridge)), prism(HIGH_SLAB, BASE, z(H.highSlab)));
// Gevel van de schijf (foto's van beide kanten): bovenste laag met kleine
// vierkante openingen, daaronder een rij hoge vensters over twee lagen, en
// lager verspringende vierkante vensters om de andere laag; groen-witte
// banden als groeven op elke verdiepingsvloer.
for (const vol of [lowVol, bridgeVol]) {
  const top = vol.top;
  cuts.push(
    ...windows(vol, {
      pitch: 3.6,
      width: 1.8,
      rows: [
        [top - 2.0, top - 0.9, 3.6, 0],
        [top - 9.6, top - 3.0, 3.6, 0],
        [top - 13.6, top - 11.8, 7.2, 0],
        [top - 20.6, top - 18.8, 7.2, 0],
        [top - 27.6, top - 25.8, 7.2, 0],
      ],
      edges: longFace,
    }),
  );
  cuts.push(...bands(vol, storeys(FLOOR0, top - 10.0, SLAB_STOREY), 0.5, 0.3, longFace));
}
// Spitse zuidwestpunt: vensters en banden ook op de schuine kopgevel.
cuts.push(...windows(lowVol, { pitch: 3.6, width: 1.8, rows: storeys(FLOOR0, 30, SLAB_STOREY).map((f) => [f + 0.8, f + 2.6]), edges: (a, b) => a[0] < -130 && b[0] < -130 }));
// Bovenste balk: kleine openingen bovenin en vierkante vensters om de andere
// laag, verspringend (foto's vanaf het noorden en de Utrechtsebaan).
{
  const top = H.highSlab;
  const rows = [[top - 2.0, top - 0.9, 3.6, 0]];
  storeys(FLOOR0, 64.5, SLAB_STOREY).forEach((f, i) => rows.push([f + 0.8, f + 2.6, 3.6, i % 2 ? 1 : -1]));
  cuts.push(...windows(highVol, { pitch: 3.6, width: 1.8, rows }));
  cuts.push(...bands(highVol, storeys(FLOOR0, 68.0, SLAB_STOREY), 0.5, 0.3));
}
// Begane grond van de schijf: glazen plint als hoge nissen.
cuts.push(...windows(lowVol, { pitch: 3.6, width: 2.6, rows: [[1.2, 4.4]], edges: longFace }));
cuts.push(...windows(highVol, { pitch: 3.6, width: 2.6, rows: [[1.2, 4.4]] }));

// ---------- torens ----------
const towerRows = [[1.2, 4.4]];
for (let f = FLOOR0; f + TOWER_STOREY <= H.tower + 0.2; f += TOWER_STOREY) towerRows.push([+(f + 0.6).toFixed(2), +(f + 3.0).toFixed(2)]);
for (const [vol, ridgeU] of [[VOLUMES[3], RIDGES[0]], [VOLUMES[4], RIDGES[1]]]) {
  parts.push(prism(vol.poly, BASE, z(H.tower)));
  // Middenstrook tot 1,5 m voor de schuine punt (binnen de toren gehouden).
  parts.push(box(ridgeU - 1.4, -47.0, z(H.tower) - 0.1, ridgeU + 1.4, 38.0, z(H.towerRidge)).intersect(prism(cs(vol.poly).offset(-1.5, "Miter").toPolygons()[0], BASE, z(H.towerRidge) + 1)));
  cuts.push(...windows(vol, { pitch: 2.5, width: 1.8, rows: towerRows }));
}

// ---------- atrium, rotonde en entree ----------
parts.push(prism(ATRIUM, BASE, z(H.atrium)));
parts.push(Manifold.cylinder(z(H.rotundaDrum) - z(H.atrium) + 0.1, ROTUNDA.r, ROTUNDA.r, 40).translate([...ROTUNDA.c, z(H.atrium) - 0.1]));
parts.push(hull([...circle3(ROTUNDA.c, ROTUNDA.r, z(H.rotundaDrum) - 0.01, 40), ...circle3(ROTUNDA.c, 1.2, z(H.rotunda), 16)]));
parts.push(prism(arc(ENTRANCE.c, ENTRANCE.r, 0, 180, 16).concat([[ENTRANCE.c[0] - ENTRANCE.r, ENTRANCE.c[1] - 0.5], [ENTRANCE.c[0] + ENTRANCE.r, ENTRANCE.c[1] - 0.5]]), BASE, z(H.entranceBay)));
parts.push(prism(CANOPY, z(H.canopy) - 0.9, z(H.canopy)));
// Glazen gevel van het atrium tussen de punten van de torens: ruitenraster.
cuts.push(...windows(VOLUMES[5], { pitch: 3.0, width: 2.6, rows: storeys(1.2, 31.0, 3.5).map((f) => [f, f + 3.1]) }));

// ---------- zuidelijk deel tussen de torens ----------
for (const [i, c] of COURT.entries()) {
  parts.push(prism(c.poly, BASE, z(c.top)));
  const vol = VOLUMES[6 + i];
  cuts.push(...windows(vol, { pitch: 3.6, width: 2.2, rows: [[1.2, 4.4], ...storeys(FLOOR0, c.top - 3.0, SLAB_STOREY).map((f) => [f + 0.8, f + 2.8])] }));
}

// ---------- kamvleugels ----------
const fingerRows = [[1.2, 4.4], ...storeys(FLOOR0, 26.0, SLAB_STOREY).map((f) => [f + 0.7, f + 2.9])];
FINGERS.forEach(([u0, u1], i) => {
  const vol = VOLUMES[9 + i];
  parts.push(prism(vol.poly, BASE, z(H.finger)));
  cuts.push(...windows(vol, { pitch: 3.6, width: 2.4, rows: fingerRows }));
});

// ---------- ronde trappenhuiskoppen ----------
// Glas tussen witte banden per verdieping: groeven rond de kop (foto's).
for (const b of BAYS) {
  parts.push(prism(bayPoly(b), BASE, z(b.top)));
  const ring = cs(bayPoly(b, 1.0)).subtract(cs(bayPoly(b, -0.3)));
  const front = cs(rect(b.c[0] - 5, b.dir > 0 ? b.c[1] + 0.25 : b.c[1] - 9, b.c[0] + 5, b.dir > 0 ? b.c[1] + 9 : b.c[1] - 0.25));
  const band = ring.intersect(front);
  const pitch = b.top > 40 ? TOWER_STOREY : SLAB_STOREY;
  for (let f = FLOOR0; f + pitch <= b.top - 0.6; f += pitch) cuts.push(Manifold.extrude(band, 2.5).translate([0, 0, z(f + 0.5)]));
}

// ---------- driehoekige vleugel met de centrale hal ----------
const hallVol = VOLUMES[12];
parts.push(prism(HALL, BASE, z(H.hall)));
parts.push(prism(HALL_BLOCK, BASE, z(H.hallBlock)));
parts.push(Manifold.cylinder(z(H.hallBlock) - z(H.hall) + 0.1, DOME.r, DOME.r, 64).translate([...DOME.c, z(H.hall) - 0.1]));
{
  // Koepel als bolkap: straal van de bol uit rand (12,2) en hoogte (7,0).
  const hCap = H.dome - H.hallBlock;
  const R = (DOME.r ** 2 + hCap ** 2) / (2 * hCap);
  const ring = [];
  for (let k = 0; k <= 8; k++) {
    const rr = DOME.r * (1 - k / 8);
    const zz = z(H.hallBlock) + Math.sqrt(Math.max(R * R - rr * rr, 0)) - (R - hCap);
    ring.push(...circle3(DOME.c, Math.max(rr, 0.01), zz - 0.01 * (k === 0), k === 8 ? 1 : 48));
  }
  parts.push(hull(ring));
}
cuts.push(...windows(hallVol, { pitch: 3.6, width: 2.2, rows: [[1.2, 4.4], ...storeys(FLOOR0, 12.0, SLAB_STOREY).map((f) => [f + 0.7, f + 2.8])] }));

// ---------- installaties ----------
for (const [u0, v0, u1, v1, top] of PLANT) {
  const base = top > 60 ? H.highSlab : top > 30 ? H.lowSlab : H.hall;
  parts.push(box(u0, v0, z(base) - 0.1, u1, v1, z(top)));
}

// ---------- samenvoegen, boog en groeven ----------
let model = union(parts);
// Verlaagd installatiedek in de bovenste balk met vier blokken koelers.
model = model.subtract(prism(PLANT_WELL, z(H.plantWell), z(H.highSlab) + 1));
model = union([model, ...WELL_UNITS.map(([u0, v0, u1, v1]) => box(u0, v0, z(H.plantWell) - 0.1, u1, v1, z(H.highSlab) - 0.3))]);
// Groene boogrib aan beide gevels: 1,5 m breed, 0,5 m voor de gevel.
{
  const samples = 48;
  const profile = (a, h) => Array.from({ length: samples + 1 }, (_, k) => {
    const x = -a + (2 * a * k) / samples;
    return [ARCH.uc + x, archZ(x, a, h)];
  });
  const sub = (a, h, v0, v1, z0) => hull(profile(a, h).flatMap(([u, zz]) => [[u, v0, zz], [u, v1, zz], [u, v0, z0], [u, v1, z0]]));
  const ribNW = sub(EXT.a, EXT.h, NW - 0.01, NW + RIB.out, BASE);
  const ribSE = sub(EXT.a, EXT.h, SE - RIB.out, SE + 0.01, BASE);
  model = union([model.subtract(union(cuts)), ribNW, ribSE]);
  // De doorgang: twee schuine dagkanten vanaf de voorkant van de ribben
  // (elk convex: het boogprofiel min t maal de diepte) en de spitsboog.
  const B = BASE - 1;
  const t = Math.tan((VAULT.revealDeg * Math.PI) / 180);
  const v0 = SE - RIB.out, v1 = NW + RIB.out, vm = (v0 + v1) / 2;
  const reveal = (front, dir) => hull(
    profile(ARCH.a, ARCH.h).flatMap(([u, zz]) => {
      const pts = [[u, front - dir, zz + t], [u, front - dir, B]];
      const deep = zz - t * Math.abs(vm - front);
      if (deep > B) pts.push([u, vm, deep], [u, vm, B]);
      else pts.push([u, front + (dir * (zz - B)) / t, B]);
      return pts;
    }),
  );
  const ti = Math.tan((VAULT.innerDeg * Math.PI) / 180);
  const apex = z(H.street) + ARCH.h;
  const half = (apex - B) / ti;
  const inner = hull([
    [ARCH.uc, v0 - 1, apex], [ARCH.uc, v1 + 1, apex],
    [ARCH.uc - half, v0 - 1, B], [ARCH.uc + half, v0 - 1, B], [ARCH.uc - half, v1 + 1, B], [ARCH.uc + half, v1 + 1, B],
  ]);
  model = model.subtract(union([reveal(v0, 1), reveal(v1, -1), inner]));
}
// Ingesloten holtes (nissen die een ander bouwdeel afdekt) vallen weg.
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
console.log("nissen en groeven:", cuts.length);
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));

// Naar het modelstelsel: oorsprong in het midden van de boog.
model = model.translate([-HEART[0], -HEART[1], 0]);
const P = ([u, v]) => [+(u - HEART[0]).toFixed(2), +(v - HEART[1]).toFixed(2)];

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Haagse Poort met schijf boog torens kamvleugels en koepel", model]],
  catalog: {
    name: "Haagse Poort",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straatniveau rond het complex (AHN-DTM +0,6..+0,8): voor de
    // kamvleugels, ten noorden en zuiden van de torens, langs de gebogen
    // vleugel en bij de zuidwestpunt. Niet in de bak van de Utrechtsebaan
    // (NAP -5) en niet op de straatjes onder de boog (0,0..+0,5).
    groundSamplePoints: [P([-122.5, 55]), P([-79, 55]), P([-36, 55]), P([43, 52]), P([86, 52]), P([43, -57]), P([86, -57]), P([-60, -46]), P([-160, 5])],
    replacesBuildings: ["NL.IMBAG.Pand.0518100000229788"],
    description:
      "Oorsprong in het midden van de boog op de as van de schijf, straatniveau NAP +0,7 m; +X op 35,64 graden in RD langs de schijf (naar het hoogbouwdeel), +Y naar het noordwesten (Prinses Beatrixlaan). Schijf van 255 m van 15 m breed: laagbouw +36,6 met spitse zuidwestpunt, brug +35,1 over de Utrechtsebaan met een boog van 55 m (onderzijde tot 21,1 m boven de straat, groene rib), bovenste balk +70,5 over twee torens van +59,9 met scheve punten, atrium +34,7 met rotonde, zuiddeel +18,4..+23,3, drie kamvleugels +31,1 met ronde trappenhuizen en een driehoekige vleugel +16,7 met de glazen koepel (+27,4); boog en gevelritme uit foto's geschat; het echte boogprofiel staat op de ribben en loopt met schuine dagkanten (62 graden) over in een spitsboog van 50 graden door de schijf, zodat de doorgang op 1:1000 open blijft.",
    realWorld: {
      groundNapM: GROUND_NAP,
      heightsNapM: H,
      archM: { feetU: [+(ARCH.uc - ARCH.a).toFixed(2), +(ARCH.uc + ARCH.a).toFixed(2)], spanM: 2 * ARCH.a, soffitCrownAboveStreetM: ARCH.h, profile: "h (1 - |x/a|^2.38)", ribWidthM: RIB.width, ribProudM: RIB.out },
      printableArch: { revealDegrees: VAULT.revealDeg, innerPointedArchDegrees: VAULT.innerDeg, innerApexAboveStreetM: ARCH.h, innerFeetU: [+(ARCH.uc - ARCH.h / Math.tan((VAULT.innerDeg * Math.PI) / 180)).toFixed(1), +(ARCH.uc + ARCH.h / Math.tan((VAULT.innerDeg * Math.PI) / 180)).toFixed(1)] },
      slabWidthM: +(NW - SE).toFixed(2),
      lengthM: +(99.83 + 155.6).toFixed(1),
      towerPlanM: [15.0, 94.4],
      storeyPitchM: { slab: SLAB_STOREY, tower: TOWER_STOREY },
      axisDegrees: AXIS_DEG,
      estimates: [
        "boog: voeten, overspanning (54,8 m binnen, 57,8 m buiten) en kruin (21,1 m boven de straat) uit een frontale foto; het profiel tussen parabool en ellips (exponent 2,38) uit vier punten op die foto",
        "doorgang op 1:1000: het echte boogprofiel staat op de voorkant van de ribben; de onderzijde loopt vandaar onder 62 graden schuin naar binnen omlaag tot een spitsboog van 50 graden (top 21,1 m boven de straat, voeten 35,4 m uit elkaar) die door de hele schijf loopt; het echte tongewelf met vlakke kruin is op deze schaal niet zonder dichte opvulling te printen",
        "groene boogrib 1,5 m breed en 0,5 m voor de gevel; het stalen vakwerk en de glazen kap in het gewelf als gesloten vlak",
        "gevelritme uit foto's: schijf met kleine openingen bovenin, hoge vensters over twee lagen en verspringende vierkante vensters, groen-witte banden als groeven per verdieping van 3,5 m; torens vensters per 2,5 m en 3,6 m; vleugels per 3,6 m",
        "installaties op de daken als blokken uit de 3D BAG en het AHN; verlaagd installatiedek in de bovenste balk (3D BAG 68,6) met vier blokken koelers",
        "rotonde op het atrium als trommel tot +37,0 met een lage kap tot +39,0 (AHN); entreeluifel 0,9 m dik op +5,8",
        "koepel van de centrale hal als bolkap op een cilinder van straal 12,2 m (AHN)",
      ],
    },
    sources: [
      "PDOK BAG pand 0518100000229788, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000229788 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes, installatiedek, koepel en rotonde",
      "https://nl.wikipedia.org/wiki/Haagse_Poort",
      "https://en.wikipedia.org/wiki/Haagse_Poort",
      "https://commons.wikimedia.org/wiki/File:Bezuidenhout-West,_2595_Den_Haag,_Netherlands_-_panoramio_(11).jpg",
      "https://commons.wikimedia.org/wiki/File:Bezuidenhout-West,_2595_Den_Haag,_Netherlands_-_panoramio_(9).jpg",
      "https://commons.wikimedia.org/wiki/File:.._-_panoramio_(151).jpg",
      "https://commons.wikimedia.org/wiki/File:Netherlands,_The_Hague,_Utrechtsebaan_(03),_Haagse_Poort.jpg",
      "https://commons.wikimedia.org/wiki/File:Netherlands,_The_Hague,_Schenkkade_(03),_Haagse_Poort.jpg",
      "https://commons.wikimedia.org/wiki/File:Haagse_Poort_Den_Haag.jpg",
      "https://commons.wikimedia.org/wiki/File:Utrechtse_Baan_Haagse_Poort.jpg",
      "https://commons.wikimedia.org/wiki/File:The_Hague_-_panoramio.jpg",
      "https://commons.wikimedia.org/wiki/File:Haagse_Poort.JPG",
    ],
  },
});

// Ring van punten [u, v, z] op een cirkel (voor hull).
function circle3(c, r, zz, n) {
  return Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos((2 * Math.PI * k) / n), c[1] + r * Math.sin((2 * Math.PI * k) / n), zz]);
}
