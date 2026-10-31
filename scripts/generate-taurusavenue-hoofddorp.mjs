// Zuidtoren (Taurusavenue 1-41, Hoofddorp, 2006): kantoortoren van 20 lagen bij station Hoofddorp, aan
// een vijver. De plattegrond is een schild: een bolle, gebogen westzijde met een gevel van horizontale
// aluminium ribben en raambanden, een holle glazen oostgevel aan de Taurusavenue en twee smalle
// rechte koppen in het zuiden en noorden. Het bolle schild staat boven de begane grond 1,6 tot 2,4 m
// buiten de BAG-contour op een rij witte kolommen (de lobby ligt erachter terug) en steekt boven het
// dak uit: in het zuiden en westen tot NAP +76,6 m, langs de noordwestkant als lage rand. Achter het
// schild ligt in het zuidwesten een verdiepte installatiezone met een lamellenband in de gevel.
// Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG (AHN5), gevelindeling uit foto's.
import { Manifold, circle, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "taurusavenue-hoofddorp";
// RD-assen: x naar het oosten, y naar het noorden; oorsprong midden in de BAG-contour.
const ORIGIN = [108055.0, 478410.0];
const AXIS = [1, 0];
const GROUND = -4.72; // NAP, AHN-DTM op het plein aan de Taurusavenue (−4,75…−4,60), 3D BAG maaiveld −4,77
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 73.55; // hoofddak (3D BAG dakvlak 721 m² op 73,54–73,58; AHN-DSM 73,5–73,9)
const SHIELD_TOP_S = 76.6; // bovenrand van het schild in het zuiden en westen (AHN-DSM 76,5–76,9)
const SHIELD_TOP_N = 74.2; // lage rand van het schild langs de noordwestkant (AHN-DSM 73,7–74,3)
const PIT = 68.7; // vloer van de installatiezone achter het schild (3D BAG 68,69–68,75)
const PIT_DECK = 71.3; // bordessen in de installatiezone (3D BAG 71,29–71,33)
const PIT_STEP = 72.4; // trede langs de oostrand van de installatiezone (3D BAG 72,41–72,44)
const ROOF_BOX = 75.0; // installatiekast op het hoofddak (AHN-DSM 74,8–75,1)
const LOBBY = 1.0; // onderkant van het schild boven de kolommen = eerste verdieping (foto, geschat)
const STOREY = 3.48; // verdiepingshoogte (foto: 19 raambanden plus een lamellenlaag tussen +1,0 en +70,6)

// ---------- Plattegrond (BAG-pand 0394100000242103, lokaal = RD − ORIGIN) ----------
// Linksom, vanaf de noordpunt van het schild. De uitbouw voor de draaideur aan de oostgevel (BAG-
// punten tussen V16 en V21) staat los als entree; de knik van 0,25 m bij de noordoosthoek is weg.
const V = {
  28: [3.04, 23.337], 29: [-0.678, 19.005], 30: [-4.199, 14.513], 31: [-7.779, 9.484],
  0: [-11.114, 4.29], 1: [-12.94, 0.751], 2: [-14.358, -2.97], 3: [-15.35, -6.827], 4: [-15.348, -9.5],
  5: [-14.611, -12.07], 6: [-13.197, -14.338], 7: [-11.215, -16.131], 8: [-7.872, -17.771],
  9: [-4.339, -18.949], 10: [-0.681, -19.644], 11: [3.038, -19.842], 12: [6.261, -19.579],
  13: [14.12, -19.046], 14: [11.766, -13.39], 15: [10.114, -7.49], 16: [9.187, -1.434],
  21: [9.036, 1.973], 22: [9.193, 6.84], 23: [9.826, 11.667], 24: [10.927, 16.41], 26: [9.59, 17.76],
};
const SHIELD_IDS = [28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const EAST_IDS = [13, 14, 15, 16, 21, 22, 23, 24];
// Afstand van de buitenkant van het schild tot de BAG-contour (AHN-DSM: dakrand 1,4–2,3 m buiten de
// contour langs het noordwesten, 2,1–2,9 m in het westen en zuiden).
const SHIELD_OUT = { 28: 1.6, 29: 1.6, 30: 1.6, 31: 1.6, 0: 1.6, 1: 1.6, 2: 1.9, 3: 2.2 };
const outOf = (id) => SHIELD_OUT[id] ?? 2.4;
const PARAPET = 1.5; // dikte van het schild boven het dak
const SHIELD_END = 0.7; // het schild loopt 0,7 m voorbij de BAG-hoek voor de zuidkop langs (DSM tot 2,5 m)

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const len = (a) => Math.hypot(a[0], a[1]);
const unit = (a) => [a[0] / len(a), a[1] / len(a)];
const outward = (a, b) => { const d = unit(sub(b, a)); return [d[1], -d[0]]; }; // linksom: buiten = rechts

// Verschuiving per schildpunt langs de bissectrice (verstek), aan de uiteinden langs de eigen rand.
const shieldPts = SHIELD_IDS.map((id) => V[id]);
const miter = shieldPts.map((p, i) => {
  const n0 = i > 0 ? outward(shieldPts[i - 1], p) : null;
  const n1 = i < shieldPts.length - 1 ? outward(p, shieldPts[i + 1]) : null;
  if (!n0) return n1;
  if (!n1) return n0;
  const k = 1 + n0[0] * n1[0] + n0[1] * n1[1];
  return [(n0[0] + n1[0]) / k, (n0[1] + n1[1]) / k];
});
const shieldS = [0];
for (let i = 1; i < shieldPts.length; i++) shieldS.push(shieldS[i - 1] + len(sub(shieldPts[i], shieldPts[i - 1])));
const offsetShield = (k) => shieldPts.map((p, i) => add(p, miter[i], typeof k === "function" ? k(SHIELD_IDS[i]) : k));
const shieldOut = offsetShield(outOf);
const shieldIn = offsetShield((id) => Math.max(0, outOf(id) - PARAPET));
// Zuidkop: het schild loopt SHIELD_END voorbij V12 langs de zuidrand.
const southDir = unit(sub(V[13], V[12]));
const endIn = add(V[12], southDir, SHIELD_END);
const endOut = add(shieldOut.at(-1), southDir, SHIELD_END);
const endInner = add(shieldIn.at(-1), southDir, SHIELD_END);

// Begane grond op de BAG-contour, bovenbouw tot de buitenkant van het schild.
const groundRing = [...shieldPts, ...EAST_IDS.map((id) => V[id]), V[26]];
const upperRing = [...shieldOut, endOut, endIn, ...EAST_IDS.map((id) => V[id]), V[26], V[28]];

// Bovenrand van het schild langs de booglengte vanaf de noordpunt: laag tot V1, stijgend tot V4.
const sOf = (id) => shieldS[SHIELD_IDS.indexOf(id)];
const shieldTop = (s) => {
  const s0 = sOf(1), s1 = sOf(4);
  if (s <= s0) return SHIELD_TOP_N;
  if (s >= s1) return SHIELD_TOP_S;
  return SHIELD_TOP_N + ((SHIELD_TOP_S - SHIELD_TOP_N) * (s - s0)) / (s1 - s0);
};

// ---------- Massa ----------
const UZ = z(LOBBY);
const COLLAR = 1.1; // onderkant van het schild loopt vanaf de lobbygevel onder 48° naar de buitenkant
const parts = [prism(groundRing, BASE, UZ), prism(upperRing, UZ, z(ROOF))];
// Kraag onder het schild en het schild boven het dak, per randstuk een convex blok.
const segs = shieldPts.map((p, i) => i).slice(0, -1).map((i) => ({
  a: shieldPts[i], b: shieldPts[i + 1], ao: shieldOut[i], bo: shieldOut[i + 1], ai: shieldIn[i], bi: shieldIn[i + 1],
  da: outOf(SHIELD_IDS[i]), db: outOf(SHIELD_IDS[i + 1]), sa: shieldS[i], sb: shieldS[i + 1],
}));
const sEnd = shieldS.at(-1) + SHIELD_END;
segs.push({ a: V[12], b: endIn, ao: shieldOut.at(-1), bo: endOut, ai: shieldIn.at(-1), bi: endInner, da: outOf(12), db: outOf(12), sa: shieldS.at(-1), sb: sEnd });
for (const g of segs) {
  parts.push(Manifold.hull([
    [...g.a, UZ - COLLAR * g.da], [...g.b, UZ - COLLAR * g.db], [...g.ao, UZ], [...g.bo, UZ],
    [...g.a, UZ + 0.5], [...g.b, UZ + 0.5], [...g.ao, UZ + 0.5], [...g.bo, UZ + 0.5],
  ]));
  parts.push(Manifold.hull([
    [...g.ai, z(ROOF) - 0.5], [...g.bi, z(ROOF) - 0.5], [...g.ao, z(ROOF) - 0.5], [...g.bo, z(ROOF) - 0.5],
    [...g.ai, z(shieldTop(g.sa))], [...g.ao, z(shieldTop(g.sa))], [...g.bi, z(shieldTop(g.sb))], [...g.bo, z(shieldTop(g.sb))],
  ]));
}

// Witte kolommen onder het schild (Ø 0,9 m, foto: om de circa 7 m), 0,75 m binnen de buitenkant.
const polyAt = (pts, s) => {
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const L = len(sub(pts[i + 1], pts[i]));
    if (s <= acc + L || i === pts.length - 2) {
      const t = unit(sub(pts[i + 1], pts[i]));
      return { p: add(pts[i], t, s - acc), t, n: [t[1], -t[0]], i };
    }
    acc += L;
  }
};
const polyLen = (pts) => pts.slice(1).reduce((sum, p, i) => sum + len(sub(p, pts[i])), 0);
const COLUMN_PITCH = 6.6;
const columns = [];
{
  const L = polyLen(shieldPts);
  const n = Math.round((L - 2) / COLUMN_PITCH);
  for (let k = 0; k <= n; k++) {
    const s = 1.0 + ((L - 2) * k) / n;
    const { p, n: nn, i } = polyAt(shieldPts, s);
    const d = outOf(SHIELD_IDS[i]) + ((outOf(SHIELD_IDS[i + 1]) - outOf(SHIELD_IDS[i])) * (s - shieldS[i])) / (shieldS[i + 1] - shieldS[i]);
    columns.push(add(p, nn, d - 0.75));
    parts.push(prism(circle(columns.at(-1), 0.45, 16), BASE, UZ));
  }
}

// Installatiezone achter het schild in het zuidwesten (3D BAG dakvlakken 91, 93, 94, 96): vloer op
// +68,7 m tot tegen de binnenkant van het schild, met bordessen en een trede.
const PIT_EDGE = [[-12.85, 0.93], [-10.75, 0.06], [-8.95, -0.69], [-8.1, -1.04], [-9.73, -8.33], [-9.54, -8.77], [-9.58, -10.13], [-8.95, -10.13], [-8.52, -11.11], [-7.2, -11.34], [-6.7, -12.99], [-6.93, -13.46], [-8.81, -17.31]];
const pitStart = SHIELD_IDS.indexOf(1), pitEnd = SHIELD_IDS.indexOf(7);
const pitInner = shieldIn.slice(pitStart, pitEnd + 1).reverse();
const pitPoly = [...PIT_EDGE, add([-8.81, -17.31], outward(V[7], V[8]), outOf(7) - PARAPET), ...pitInner];
const pitDecks = [
  [[-13.44, -7.55], [-12.35, -3.52], [-13.18, -3.69], [-13.59, -0.96], [-14.36, -2.97], [-15.35, -6.83], [-15.35, -7.75], [-14.66, -7.75]],
  [[-14.16, -11.84], [-11.39, -15.87], [-10.08, -14.84], [-10.82, -13.64], [-10.82, -12.61], [-11.49, -12.54], [-12.55, -10.8]],
].map((ring) => prism(ring, z(PIT) - 0.1, z(PIT_DECK)));
const pitStep = prism([[-8.52, -11.11], [-8.95, -10.13], [-9.58, -10.13], [-9.54, -8.77], [-9.73, -8.33], [-8.1, -1.04], [-8.95, -0.69], [-9.61, -0.69], [-10.41, -4.31], [-10.85, -4.46], [-10.83, -10.11], [-10.74, -10.73], [-10.68, -12.62], [-7.39, -12.96], [-6.93, -13.46], [-6.7, -12.99], [-7.2, -11.34]], z(PIT) - 0.1, z(PIT_STEP));
const roofBox = prism(rect(0.3, 10.0, 4.0, 11.8), z(ROOF) - 0.1, z(ROOF_BOX));

// ---------- Gevelreliëf ----------
const DEPTH = 0.35;
const cuts = [];
// Blinde nis van s0 tot s1 langs een gevellijn met een plafond onder 45°.
const niche = (pts, s0, s1, lo, hi) => {
  const { p, t, n } = polyAt(pts, (s0 + s1) / 2);
  const sc = (s0 + s1) / 2;
  const P = (s, depth, h) => [p[0] + t[0] * (s - sc) - n[0] * depth, p[1] + t[1] * (s - sc) - n[1] * depth, h];
  cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
};
// Vensters op een regelmatig raster: zoveel traveeën als passen met een penant van ≥ 0,9 m.
const grid = (pts, { pitch, pier = 0.9, from = 0, to, floors, skip = () => false }) => {
  const L = (to ?? polyLen(pts)) - from;
  const bays = Math.floor(L / pitch), step = L / bays, w = step - pier;
  for (const [lo, hi] of floors)
    for (let k = 0; k < bays; k++) {
      const s0 = from + k * step + (step - w) / 2;
      if (!skip((s0 + w / 2), lo)) niche(pts, s0, s0 + w, lo, hi);
    }
};
const FLOOR = (k) => UZ + STOREY * k;
const officeFloors = (n, sill) => Array.from({ length: n }, (_, k) => [FLOOR(k) + sill, FLOOR(k) + STOREY - 0.35 - DEPTH]);
const lobbyHi = UZ - 0.6 - DEPTH;

// Schild: per laag een doorlopende raamband tussen de aluminium borstweringen (19 lagen, opening
// 1,75 m), daarboven op de bovenste laag een lamellenband voor de installatiezone (zuid- en
// westkant); lobbygevel achter de kolommen. Een band is een reeks overlappende nissen langs de boog.
const shieldFace = [...shieldOut, endOut];
const band = (s0, s1, lo, hi) => {
  for (let s = s0; s < s1 - 0.1; s += 2.3) niche(shieldFace, s, Math.min(s + 2.4, s1), lo, hi);
};
for (let k = 0; k < 19; k++) band(0.6, polyLen(shieldFace) - 0.6, FLOOR(k) + 1.1, FLOOR(k) + 2.3);
band(sOf(2) + 1, polyLen(shieldFace) - 0.6, FLOOR(19) + 0.5, FLOOR(19) + 2.4);
grid(shieldPts, { pitch: 2.9, floors: [[0.3, UZ - COLLAR * 2.4 - 0.3 - DEPTH]], from: 0.4, to: polyLen(shieldPts) - 0.4 });
// Zuidkop en noordkop: drie vensters per laag; holle oostgevel: glasvakken van 2 m op 2,9 m.
const south = [endIn, V[13]];
const north = [V[26], V[28]];
const east = EAST_IDS.map((id) => V[id]);
const facadeFloors = [[0.3, lobbyHi], ...officeFloors(20, 0.9)];
grid(south, { pitch: 2.35, floors: facadeFloors, from: 0.15, to: polyLen(south) - 0.15 });
grid(north, { pitch: 2.35, floors: facadeFloors, from: 0.3, to: polyLen(north) - 0.3 });
// Entree: draaideur (BAG-uitbouw, cirkel r 1,7 m) met de witte ‘1’ erboven.
const DOOR = [8.9, 0.27];
grid(east, {
  pitch: 2.9, floors: facadeFloors, from: 0.4, to: polyLen(east) - 0.4,
  skip: (s, lo) => lo < UZ && len(sub(polyAt(east, s).p, DOOR)) < 3.4,
});

const tower = union(parts).add(union([...pitDecks, pitStep, roofBox]));
const towerCut = tower.subtract(prism(pitPoly, z(PIT), z(SHIELD_TOP_S) + 2)).add(union([...pitDecks, pitStep])).subtract(union(cuts));
const doorN = outward(V[16], V[21]), doorT = unit(sub(V[21], V[16]));
const entrance = union([
  prism(circle(DOOR, 1.7, 32), BASE, 3.2),
  prism([add(add(DOOR, doorT, -0.5), doorN, -0.1), add(add(DOOR, doorT, 0.5), doorN, -0.1), add(add(DOOR, doorT, 0.5), doorN, 1.3), add(add(DOOR, doorT, -0.5), doorN, 1.3)], 3.0, UZ - 0.3),
]).subtract(tower);

const nodes = [["toren", towerCut], ["entree", entrance]].map(([label, m]) => {
  const n = m.decompose().length;
  if (n !== 1) throw new Error(`${label}: ${n} losse delen`);
  console.log(label, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [`building:${slug}-${label}`, m];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Zuidtoren Hoofddorp",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 38.43, // NAP −4,72 + geoïde 43,15 (NLGEO2018 ter plekke 43,148; Pharos 43,15)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[15, 0], [16, -8], [14, 20], [5, 28], [-5, 25]],
    replacesBuildings: ["NL.IMBAG.Pand.0394100000242103"],
    description:
      "De Zuidtoren aan de Taurusavenue bij station Hoofddorp (2006): een schildvormige kantoortoren van 20 lagen op de BAG-contour tot NAP +73,55 m. De bolle west- en zuidkant is een schild van raambanden dat boven de begane grond 1,6 tot 2,4 m buiten de contour staat, op een rij kolommen van 0,9 m met een kraag onder 48° naar de teruggelegen lobby, en boven het dak uitsteekt tot +76,6 m (zuid en west) en +74,2 m (noordwest). Daarachter in het zuidwesten een verdiepte installatiezone op +68,7 m met bordessen en een lamellenband in de gevel; de holle oostgevel aan de Taurusavenue heeft een glasraster per laag en de draaideur met de witte ‘1’. Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG. Oorsprong midden in de contour, X-as naar RD-oost. Geschat: verdiepingshoogte (3,48 m) en lobbyhoogte, de vensterindeling, de plaats en dikte van de kolommen, de helling van de schildrand tussen noordwest en west en hoe ver het schild voor de zuidkop langs loopt.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      shieldTopNapM: [SHIELD_TOP_N, SHIELD_TOP_S],
      shieldOutsideBagM: [1.6, 2.4],
      plantPitNapM: PIT,
      plantDeckNapM: [PIT_DECK, PIT_STEP],
      roofBoxNapM: ROOF_BOX,
      lobbyTopNapM: LOBBY,
      floors: 20,
      storeyHeightM: STOREY,
      columnDiameterM: 0.9,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0394100000242103 (bouwjaar 2006, Taurusavenue 1-41, kantoorfunctie), actuele orthoHR, AHN-DSM en -DTM 0,5 m (AHN4), 3D BAG LoD2.2 (AHN5 2023)",
      "https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0394100000242103",
      "https://www.skyscrapercenter.com/building/zuidtoren/6661",
      "https://commons.wikimedia.org/wiki/File:Zuidtoren_Hoofddorp.jpg",
      "https://commons.wikimedia.org/wiki/File:Zuidtoren,_Hoofddorp_pic2.jpg",
      "https://commons.wikimedia.org/wiki/File:Pharos_toren_en_Zuidtoren_pic2.jpg",
    ],
  },
});
