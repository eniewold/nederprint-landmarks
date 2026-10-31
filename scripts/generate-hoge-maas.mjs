// De Hoge Maas (Charloisse Hoofd 47-97, Rotterdam-Charlois, 2001, Benthem Crouwel Architecten): woontoren van
// 24 woonlagen op een kruisvormige plattegrond ("Latijns kruis met ongelijke armen"). De brede arm (16 m) loopt
// zuidwest-noordoost en gaat tot de top; de smalle dwarsarm (8,3 m) stopt vier lagen lager. Boven de smalle arm
// hangen aan beide kanten drie lagen balkons aan schoren, op de kopse hoeken staan balkonstapels, op het dak een
// opbouw. De toren staat op een sokkel met een half verdiepte ovale parkeergarage; aan de rivierzijde ligt een
// glazen restaurantpaviljoen in een boog om de voet.
// Maten: brede en smalle arm, paviljoen en dakhoogtes uit de 3D BAG (LoD2.2, AHN5) en het AHN-DSM, verdiepingen
// uit het projectblad van Rotterdam Woont (24 lagen, 72 m, typische plattegrond 1e t/m 20e verdieping),
// gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "hoge-maas";
// Meetstelsel: u langs de brede arm (48,7° vanaf RD-oost, naar de rivier), v haaks daarop naar het noordwesten,
// rond M. Het model ligt rond de kruising van de twee armen: x = u - UC, y = v - VC.
const ANG = (48.7 * Math.PI) / 180;
const M = [91552, 434756];
const UC = -2.15, VC = 0.1;
const ORIGIN = [
  +(M[0] + UC * Math.cos(ANG) - VC * Math.sin(ANG)).toFixed(2),
  +(M[1] + UC * Math.sin(ANG) + VC * Math.cos(ANG)).toFixed(2),
];
const AXIS = [+Math.cos(ANG).toFixed(5), +Math.sin(ANG).toFixed(5)];
const GROUND = 5.5; // NAP, dek van de sokkel rond de toren (AHN-DTM 5,4-5,5; straat aan de kade 3,9)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 74.9; // brede arm, 3D BAG-dakvlak (74,89-74,97) en AHN-DSM 74,9
const PARAPET = 76.3; // dakrand langs de brede arm (AHN-DSM 76,2-76,4)
const BOX = 80.4; // dakopbouw (3D BAG 80,23-80,52, DSM 80,3-80,4)
const NARROW = 64.1; // smalle arm (3D BAG 63,96-64,28, DSM 64,1)
const UPPER = 72.15; // balkons boven de smalle arm en de hoekbalkons van de brede arm (3D BAG 72,02-72,15)
const NARROW_CORNER = 61.15; // hoekbalkons van de smalle arm (3D BAG 61,11-61,24)
const PAVILION = 8.75; // restaurantpaviljoen (3D BAG 8,63-8,82, DSM 8,6-8,8)
const BAY = 50.15; // erker aan de zuidwestkop: tot de 15e laag (DSM p99 45-50 tussen schaarse punten; geschat)

// Verdiepingen: begane grond 3,4 m, daarna 24 lagen van 2,75 m (8,9 + 24 x 2,75 = 74,9 = dak).
const GF = 3.4, STOREY = 2.75;
const floorZ = (k) => (k === 0 ? 0 : GF + (k - 1) * STOREY);
const floorH = (k) => (k === 0 ? GF : STOREY);

// ---------- Plattegrond (meetstelsel) ----------
const TA = { u0: -12.3, u1: 17.3, v0: -7.9, v1: 8.1 }; // brede arm (3D BAG en DSM-randen)
const NA = { u0: -6.3, u1: 2.0 }; // smalle arm
// Kopgevels van de smalle arm lopen schuin (plattegrond 1:500, 3D BAG): langer aan de zuidwestkant.
const NW_END = (u) => 18.0 - (0.9 * (u - NA.u0)) / (NA.u1 - NA.u0);
const SE_END = (u) => -17.8 + (0.9 * (u - NA.u0)) / (NA.u1 - NA.u0);
const NARROW_RING = [[NA.u0, SE_END(NA.u0)], [NA.u1, SE_END(NA.u1)], [NA.u1, NW_END(NA.u1)], [NA.u0, NW_END(NA.u0)]];
const FRAME_OUT = 3.0; // balkons boven de smalle arm steken 3 m uit de gevel van de brede arm (gevel 1:500: 3,2 m)
const OUT = 0.9; // uitsteek van de hoekbalkons buiten de gevel
// Hoekbalkonstapels: [rechthoek van de hoek in de romp, rechthoek van het uitsteeksel, bovenkant]
const LOGGIA_U = 14.6, LOGGIA_V = 5.5, NARROW_LOGGIA_U = -3.6, NARROW_LOGGIA_V = 14.6;
const CORNERS = [
  { name: "noordhoek", core: rect(LOGGIA_U, LOGGIA_V, TA.u1, TA.v1), lip: rect(LOGGIA_U, TA.v1 - 0.05, TA.u1, TA.v1 + OUT), lipDir: [0, 1], top: z(UPPER), floors: 23 },
  { name: "oosthoek", core: rect(LOGGIA_U, TA.v0, TA.u1, -LOGGIA_V), lip: rect(LOGGIA_U, TA.v0 - OUT, TA.u1, TA.v0 + 0.05), lipDir: [0, -1], top: z(UPPER), floors: 23 },
  { name: "westhoek", core: [[NA.u0, NARROW_LOGGIA_V], [NARROW_LOGGIA_U, NARROW_LOGGIA_V], [NARROW_LOGGIA_U, NW_END(NARROW_LOGGIA_U)], [NA.u0, NW_END(NA.u0)]], lip: [[NA.u0 - OUT, NARROW_LOGGIA_V], [NA.u0 + 0.05, NARROW_LOGGIA_V], [NA.u0 + 0.05, NW_END(NA.u0)], [NA.u0 - OUT, NW_END(NA.u0) + 0.1]], lipDir: [-1, 0], top: z(NARROW_CORNER), floors: 19 },
  { name: "zuidhoek", core: [[NA.u0, SE_END(NA.u0)], [NARROW_LOGGIA_U, SE_END(NARROW_LOGGIA_U)], [NARROW_LOGGIA_U, -NARROW_LOGGIA_V], [NA.u0, -NARROW_LOGGIA_V]], lip: [[NA.u0 - OUT, SE_END(NA.u0) - 0.1], [NA.u0 + 0.05, SE_END(NA.u0)], [NA.u0 + 0.05, -NARROW_LOGGIA_V], [NA.u0 - OUT, -NARROW_LOGGIA_V]], lipDir: [-1, 0], top: z(NARROW_CORNER), floors: 19 },
];
const inside = (poly, [u, v]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ui, vi] = poly[i], [uj, vj] = poly[j];
    if ((vi > v) !== (vj > v) && u < ((uj - ui) * (v - vi)) / (vj - vi) + ui) c = !c;
  }
  return c;
};

// ---------- Massa ----------
const tall = prism(rect(TA.u0, TA.v0, TA.u1, TA.v1), BASE, z(ROOF));
const narrow = prism(NARROW_RING, BASE, z(NARROW));
const frames = [rect(NA.u0, TA.v1 - 0.05, NA.u1, TA.v1 + FRAME_OUT), rect(NA.u0, TA.v0 - FRAME_OUT, NA.u1, TA.v0 + 0.05)]
  .map((r) => prism(r, z(NARROW) - 0.1, z(UPPER)));
// Hoekstapels: de romp boven de bovenste hoekbalkons is open (dakterras); het uitsteeksel begint op de 1e laag
// met een kraag van 45°.
const cornerTops = CORNERS.map((c) => prism(c.core, c.top, z(ROOF) + 1));
const lips = CORNERS.map((c) => {
  // Diepte buiten de gevel per hoekpunt van het uitsteeksel; aan de gevel begint de kraag 0,9 m lager.
  const wall = c.lipDir[0] < 0 ? NA.u0 : c.lipDir[1] > 0 ? TA.v1 : TA.v0;
  return Manifold.hull(c.lip.flatMap(([u, v]) => {
    const depth = Math.max(0, c.lipDir[0] !== 0 ? (u - wall) * c.lipDir[0] : (v - wall) * c.lipDir[1]);
    return [[u, v, c.top], [u, v, floorZ(1) - (OUT - Math.min(depth, OUT))]];
  }));
});
const pavilionRing = (() => {
  // Glazen paviljoen in een boog (middelpunt (1,0, 1,0), straal 16,3 m) aan de rivierkant van de smalle arm.
  const c = [1.0, 1.0], R = 16.3, pts = [];
  const a0 = -Math.acos((NA.u1 - 0.5 - c[0]) / R), a1 = Math.acos((NA.u1 - 0.5 - c[0]) / R);
  for (let k = 0; k <= 32; k++) { const a = a0 + ((a1 - a0) * k) / 32; pts.push([c[0] + R * Math.cos(a), Math.min(17.0, c[1] + R * Math.sin(a))]); }
  return pts;
})();
const pavilion = prism(pavilionRing, BASE, z(PAVILION));
const BAY_RING = rect(TA.u0 - 1.3, -2.9, TA.u0 + 0.05, 3.1);
const bay = prism(BAY_RING, BASE, z(BAY));
const roofRing = [[TA.u0, TA.v0], [LOGGIA_U, TA.v0], [LOGGIA_U, -LOGGIA_V], [TA.u1, -LOGGIA_V], [TA.u1, LOGGIA_V], [LOGGIA_U, LOGGIA_V], [LOGGIA_U, TA.v1], [TA.u0, TA.v1]];
const inset = 0.9;
const roofInner = [[TA.u0 + inset, TA.v0 + inset], [LOGGIA_U - inset, TA.v0 + inset], [LOGGIA_U - inset, -LOGGIA_V + inset], [TA.u1 - inset, -LOGGIA_V + inset], [TA.u1 - inset, LOGGIA_V - inset], [LOGGIA_U - inset, LOGGIA_V - inset], [LOGGIA_U - inset, TA.v1 - inset], [TA.u0 + inset, TA.v1 - inset]];
const parapet = prism(roofRing, z(ROOF) - 0.1, z(PARAPET)).subtract(prism(roofInner, z(ROOF) - 1, z(PARAPET) + 1));
const box = prism(rect(-8.2, -4.5, 2.0, 4.6), z(ROOF) - 0.1, z(BOX));

let body = union([tall, narrow, ...frames, pavilion, bay]).subtract(union(cornerTops));
body = union([body, ...lips, parapet, box]);

// ---------- Gevelreliëf ----------
const cuts = [];
const edgeFrame = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  // P(s, t, h): t > 0 naar binnen.
  return { L, d, n, P: (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h] };
};
const exposed = (P, s0, s1, lo, hi) => [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi - 0.05].every((h) => {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
}));
const inAnyCorner = (pts) => CORNERS.some((c) => pts.some((p) => inside(c.core, p) || inside(c.lip, p)));

// Vensters als blinde nissen van 0,35 m met een plafond onder 45°. Donkere gevels (PanelCraft-platen): vensters
// van 1,0 m op 2,7 m; glazen gevels (koppen van de armen) en de begane grond: ruiten van 1,2 m op 2,1 m.
const DEPTH = 0.35;
const facade = (ring, topFloor, glassEdge) => ring.forEach((a, i) => {
  const b = ring[(i + 1) % ring.length];
  const { L, P } = edgeFrame(a, b);
  if (L < 2) return;
  for (let k = 0; k <= topFloor; k++) {
    const glass = k === 0 || glassEdge(i);
    const pitch = glass ? 2.1 : 2.7, width = glass ? 1.2 : 1.0;
    const bays = Math.floor((L - 0.9) / pitch), w = (L - bays * pitch) / 2;
    const zf = floorZ(k), fh = floorH(k);
    const lo = zf + (glass ? 0.55 : 0.9), hi = zf + fh - 0.35 - DEPTH;
    for (let j = 0; j < bays; j++) {
      const s0 = w + j * pitch + (pitch - width) / 2, s1 = s0 + width;
      if (inAnyCorner([P(s0, 0.5, 0), P(s1, 0.5, 0), P(s0, -0.5, 0), P(s1, -0.5, 0)])) continue;
      if (!exposed(P, s0, s1, lo, hi + DEPTH)) continue;
      cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
});
const TALL_RING = rect(TA.u0, TA.v0, TA.u1, TA.v1);
facade(TALL_RING, 24, (i) => i === 1); // kopgevel naar de rivier (u = TA.u1) is glas
facade(NARROW_RING, 20, (i) => i === 0 || i === 2); // de schuine koppen van de smalle arm zijn glas
facade(BAY_RING, 15, () => true); // glazen erker

// Hoekbalkons: per laag een open balkon van 0,9 m diep dat om de hoek loopt, met een plafond onder 45°.
const groove = (a, b, s0, s1, k) => {
  const { P } = edgeFrame(a, b);
  const zf = floorZ(k), fh = floorH(k), lo = zf + 0.9, hi = zf + fh - 1.0;
  const t0 = -0.2, t1 = 0.9;
  return Manifold.hull([s0, s1].flatMap((s) => [P(s, t0, lo), P(s, t1, lo), P(s, t0, hi + 0.9 + 0.2), P(s, t1, hi)]));
};
for (let k = 1; k <= 23; k++) {
  // Kop naar de rivier, noord- en oosthoek: langs de kopgevel en langs het uitsteeksel, met 0,9 m wang aan de binnenkant.
  cuts.push(groove([TA.u1, TA.v0 - OUT], [TA.u1, -LOGGIA_V], -0.2, -LOGGIA_V - (TA.v0 - OUT) - 0.9, k)); // oosthoek, kopgevel
  cuts.push(groove([LOGGIA_U, TA.v0 - OUT], [TA.u1, TA.v0 - OUT], 0.9, TA.u1 - LOGGIA_U + 0.2, k)); // oosthoek, zijkant
  cuts.push(groove([TA.u1, LOGGIA_V], [TA.u1, TA.v1 + OUT], 0.9, TA.v1 + OUT - LOGGIA_V + 0.2, k)); // noordhoek, kopgevel
  cuts.push(groove([TA.u1, TA.v1 + OUT], [LOGGIA_U, TA.v1 + OUT], -0.2, TA.u1 - LOGGIA_U - 0.9, k)); // noordhoek, zijkant
}
for (let k = 1; k <= 19; k++) {
  // Smalle arm: hoekbalkons aan de zuidwestkant van beide koppen.
  const nwA = [NA.u0 - OUT, NW_END(NA.u0) + 0.1], nwB = [NARROW_LOGGIA_U, NW_END(NARROW_LOGGIA_U)];
  cuts.push(groove(nwB, nwA, 0.9, Math.hypot(nwA[0] - nwB[0], nwA[1] - nwB[1]) + 0.2, k)); // westhoek, kopgevel
  cuts.push(groove([NA.u0 - OUT, NW_END(NA.u0) + 0.1], [NA.u0 - OUT, NARROW_LOGGIA_V], -0.2, NW_END(NA.u0) + 0.1 - NARROW_LOGGIA_V - 0.9, k)); // westhoek, zijkant
  const seA = [NARROW_LOGGIA_U, SE_END(NARROW_LOGGIA_U)], seB = [NA.u0 - OUT, SE_END(NA.u0) - 0.1];
  cuts.push(groove(seB, seA, -0.2, Math.hypot(seA[0] - seB[0], seA[1] - seB[1]) - 0.9, k)); // zuidhoek, kopgevel
  cuts.push(groove([NA.u0 - OUT, -NARROW_LOGGIA_V], [NA.u0 - OUT, SE_END(NA.u0) - 0.1], 0.9, -NARROW_LOGGIA_V - SE_END(NA.u0) + 0.1 + 0.2, k)); // zuidhoek, zijkant
}
// Balkons boven de smalle arm (lagen 21-23): per laag een doorlopende driehoekige uitsparing, de schoor onder 45°
// zoals op de gevel 1:500.
for (let k = 21; k <= 23; k++) {
  const zf = floorZ(k), lo = zf + 0.9, D = 1.75;
  for (const [vOut, sgn] of [[TA.v1 + FRAME_OUT, 1], [TA.v0 - FRAME_OUT, -1]]) {
    const pts = [];
    for (const u of [NA.u0 - 0.3, NA.u1 + 0.3]) pts.push([u, vOut + 0.2 * sgn, lo], [u, vOut - D * sgn, lo], [u, vOut + 0.2 * sgn, lo + D + 0.2]);
    cuts.push(Manifold.hull(pts));
  }
}

const tower = body.subtract(union(cuts)).translate([-UC, -VC, 0]);
const parts = tower.decompose();
if (parts.length !== 1) throw new Error(`toren: ${parts.length} losse delen`);
console.log("toren", tower.status(), "genus", tower.genus(), "driehoeken", tower.numTri(), "nissen", cuts.length);

const toModel = ([u, v]) => [+(u - UC).toFixed(2), +(v - VC).toFixed(2)];
await writeLandmark({
  slug,
  base: BASE,
  nodes: [[`building:${slug}-toren`, tower]],
  catalog: {
    name: "De Hoge Maas",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 49.0, // dek van de sokkel NAP +5,5 plus ~43,5 (ellipsoïdisch, Rotterdam)
    groundOffsetMetres: -0.15,
    // Op het dek rond de toren: de BAG-contour is de hele ovale sokkel, daarbuiten ligt de straat 1,6 m lager.
    groundSamplePoints: [[-17, 10], [-17, -10], [8, 20], [8, -19], [21, 0]].map(toModel),
    replacesBuildings: ["NL.IMBAG.Pand.0599100000616618"],
    description:
      "Woontoren De Hoge Maas aan het Charloisse Hoofd (Benthem Crouwel, 2001) op een kruisvormige plattegrond: de brede arm (29,6 x 16 m) tot NAP +74,9 m met een dakrand tot +76,3 m en een dakopbouw tot +80,4 m, de smalle dwarsarm (8,3 m breed, 35 m lang, schuine koppen) tot +64,1 m, daarboven aan beide kanten drie lagen balkons aan schoren tot +72,15 m, hoekbalkonstapels op de rivierkop (tot +72,15 m) en op de zuidwestelijke hoeken van de smalle arm (tot +61,15 m), een erker aan de zuidwestkop en een glazen paviljoen in een boog aan de rivierkant tot +8,75 m. Vensters per laag als blinde nissen: smal op de donkere gevels, breed op de glazen koppen. Oorsprong op de kruising van de armen, X-as langs de brede arm naar de rivier (noordoost); z = 0 is het sokkeldek op NAP +5,5 m. Hoogtes uit de 3D BAG (AHN5) en het AHN-DSM; verdiepingshoogte, vensterraster, uitsteek van de balkons en de hoogte van de erker zijn geschat; de sokkel met de half verdiepte garage zit in het maaiveld en is niet gemodelleerd.",
    realWorld: {
      groundNapM: GROUND,
      streetNapM: 3.9,
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      roofBoxNapM: BOX,
      narrowArmNapM: NARROW,
      upperBalconiesNapM: UPPER,
      narrowCornerBalconiesNapM: NARROW_CORNER,
      pavilionNapM: PAVILION,
      bayNapM: BAY,
      wideArmM: [29.6, 16.0],
      narrowArmM: [8.3, 35.0],
      floors: 24,
      groundFloorM: GF,
      storeyHeightM: STOREY,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000616618 (bouwjaar 2001), AHN-DSM en -DTM 0,5 m, actuele orthoHR",
      "3D BAG NL.IMBAG.Pand.0599100000616618 (LoD2.2, puntwolk AHN5 2022)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam",
      "https://rotterdamwoont.nl/app/uploads/2018/01/5.2001.1-projectblad-Hoge-Maas-2.pdf",
      "https://commons.wikimedia.org/wiki/Category:De_Hoge_Maas_(Rotterdam)",
    ],
  },
});
