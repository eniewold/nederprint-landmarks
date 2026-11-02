// Watertoren aan het Hinthamereinde (73) in 's-Hertogenbosch, aan de Aa op de
// plek van de vroegere stadswal: 1885, ontwerp J. Kalff (hoofdingenieur van de
// Staatsspoorwegen), rijksmonument 522464, buiten gebruik sinds 1974, na de
// restauratie van 2010-2012 een bedrijfsverzamelgebouw. Volgens het register een
// eclectische bakstenen toren van 33 m op een vierkante plattegrond met een plat
// dak en kantelen, een hardstenen plint en vier bouwlagen gescheiden door
// hardstenen waterlijsten, bakstenen hoeklisenen, ingangen aan de noord- en
// zuidzijde in rondboognissen met hardstenen trappen, op de eerste bouwlaag een
// rondboogvensterpaar en (op de ingangsgevels) een groot rondboogvenster, op de
// derde twee rondboogvensters per gevel en op de vierde een rond venster per
// gevel; bovenin twee vierkante plaatijzeren reservoirs van 180 m³.
//
// Oorsprong op het midden van de BAG-contour (pand 0796100000218014, 197 m²:
// 13,67 × 14,90 m, de zijden op 40,5 en 130,5 graden van RD-oost) op maaiveld
// (AHN-DTM en 3D BAG NAP +7,0 m). Lokale +X loopt langs RD 40,5 graden (de
// noordoost- en zuidwestgevel staan op ±X), +Y langs 130,5 graden: de
// ingangsgevels met de trappen staan op ±Y (noordwest = noord, zuidoost = zuid;
// het DTM heeft daar de gaten van de trappen). Hoogtes uit het AHN-DSM 0,5 m en
// de 3D BAG: dak NAP +37,44 (30,44 m), hoekblokken NAP +40,7 tot +40,8 (33,75 m),
// installaties op het dak tot NAP +39,4 en +39,9. Bovenbouw uit het DSM (randen
// van het dak) en foto's; de banden, vensters, kantelen en trap uit de RCE-foto
// 20109301 (verticalen evenwijdig, geschaald op de kantelen en de hoekblokken).
import { hull, ring3, circle, union, box, rect, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [150145.26, 411313.44];
const ROT = 40.5; // lokale +X in graden linksom van RD-oost
const AXIS = [+Math.cos((ROT * Math.PI) / 180).toFixed(4), +Math.sin((ROT * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 7.0; // AHN-DTM rond de toren 6,4 tot 7,1; 3D BAG 6,99
const GEOID_N = 43.59; // NLGEO2018-geoïdehoogte op de oorsprong

// Halve maten [X, Y].
const W = {
  base: [6.84, 7.45], // onderbouw met hardstenen banden (BAG)
  baseRecess: 6.47, // middendeel van de zijgevels op de begane grond (BAG: 7,5 m breed, 0,37 m terug)
  pier: [6.3, 6.45], // hoeklisenen van de bovenbouw
  field: [6.0, 6.15], // bakstenen gevelvlakken tussen de lisenen (0,3 m terug)
  parapet: [6.45, 6.6], // kantelen op de boogfries (DSM: dakrand)
  inner: [5.55, 5.7], // binnenkant van de borstwering
};
const PIER_W = 1.5; // breedte van de hoeklisenen en de hoekblokken
const H = {
  base: 6.8, // bovenkant hardstenen onderbouw
  waterTable: 7.8, // schuine waterlijst naar de bovenbouw
  bands: [[19.0, 19.8], [22.9, 23.8]], // hardstenen waterlijsten tussen de bouwlagen
  friezeFoot: 28.6, // boogfries: kraag van 45 graden naar de kantelen
  frieze: 29.05,
  roof: 30.44, // plat dak (AHN NAP +37,44)
  embrasure: 31.9, // onderkant van de kantelopeningen
  merlon: 32.8, // bovenkant van de kantelen
  corner: 33.75, // hoekblokken (AHN NAP +40,7 tot +40,8)
};

const rectHull = ([a, b], z0, z1) => hull([...ring3(rect(-a, -b, a, b), z0), ...ring3(rect(-a, -b, a, b), z1)]);
const sym = (f) => [[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([sx, sy]) => f(sx, sy));

// ---------- onderbouw met trappen ----------
// Middendeel van de zijgevels 0,37 m terug, met een plafond van 45 graden onder de waterlijst.
const recessCuts = [1, -1].map((s) => {
  const zt = H.base - 0.7, x0 = W.baseRecess, x1 = W.base[0] + 1;
  const pts = [-3.77, 3.77].flatMap((y) => [[x0, y, BASE - 1], [x1, y, BASE - 1], [x0, y, zt], [x1, y, zt + (x1 - x0)]]);
  return hull(pts.map(([x, y, z]) => [s * x, y, z]));
});
const base = union([
  rectHull(W.base, BASE, H.base),
  // Waterlijst: van de onderbouw schuin (45 graden op de ingangsgevels) naar de hoeklisenen.
  hull([...ring3(rect(-W.base[0], -W.base[1], W.base[0], W.base[1]), H.base - 0.05), ...ring3(rect(-W.pier[0], -W.pier[1], W.pier[0], W.pier[1]), H.waterTable)]),
]).subtract(union(recessCuts));
// Hardstenen trappen voor de ingangen (DTM-gat tot 8,0 m uit het hart; DSM 0,3 tot 0,7 m boven maaiveld).
const stairs = [1, -1].flatMap((s) => [
  box(-3.0, s > 0 ? W.base[1] - 0.1 : -W.base[1] - 0.3, BASE, 3.0, s > 0 ? W.base[1] + 0.3 : -W.base[1] + 0.1, 0.6),
  box(-3.0, s > 0 ? W.base[1] + 0.25 : -W.base[1] - 0.6, BASE, 3.0, s > 0 ? W.base[1] + 0.6 : -W.base[1] - 0.25, 0.3),
]);

// ---------- bovenbouw: gevelvlakken, hoeklisenen en waterlijsten ----------
const shaftTop = H.friezeFoot + 0.05;
const shaft = union([
  rectHull(W.field, H.base, shaftTop),
  ...sym((sx, sy) => {
    const [a, b] = W.pier;
    const x0 = sx > 0 ? a - PIER_W : -a, y0 = sy > 0 ? b - PIER_W : -b;
    return box(x0, y0, H.waterTable - 0.1, x0 + PIER_W, y0 + PIER_W, shaftTop);
  }),
  // Waterlijsten tot de voorkant van de lisenen, met een kraag van 45 graden onder het gevelvlak.
  ...H.bands.map(([z0, z1]) => hull([...ring3(rect(-W.field[0], -W.field[1], W.field[0], W.field[1]), z0 - 0.3), ...ring3(rect(-W.pier[0], -W.pier[1], W.pier[0], W.pier[1]), z0), ...ring3(rect(-W.pier[0], -W.pier[1], W.pier[0], W.pier[1]), z1)])),
]);

// ---------- boogfries, borstwering met kantelen, hoekblokken en pinakels ----------
const crown = union([
  // Boogfries als kraag van 45 graden: 0,45 m uit het gevelvlak, 0,15 m uit de lisenen.
  hull([...ring3(rect(-W.field[0], -W.field[1], W.field[0], W.field[1]), H.friezeFoot), ...ring3(rect(-W.parapet[0], -W.parapet[1], W.parapet[0], W.parapet[1]), H.frieze)]),
  rectHull(W.parapet, H.frieze - 0.05, H.merlon),
]);
const cornerBlocks = sym((sx, sy) => {
  const [a, b] = W.parapet;
  const x0 = sx > 0 ? a - PIER_W : -a, y0 = sy > 0 ? b - PIER_W : -b;
  return box(x0, y0, H.roof - 0.1, x0 + PIER_W, y0 + PIER_W, H.corner);
});
// Pinakel op elk hoekblok: voetstuk van 0,9 m en een bol als achthoekig omhulsel (onderkant steiler dan 45 graden).
const finial = (cx, cy) => union([
  box(cx - 0.45, cy - 0.45, H.corner - 0.05, cx + 0.45, cy + 0.45, H.corner + 0.4),
  hull([...ring3(circle([cx, cy], 0.45, 8, Math.PI / 8), H.corner + 0.35), ...ring3(circle([cx, cy], 0.5, 8, Math.PI / 8), H.corner + 0.75), ...ring3(circle([cx, cy], 0.25, 8, Math.PI / 8), H.corner + 1.15), [cx, cy, H.corner + 1.3]]),
]);
const finials = sym((sx, sy) => finial(sx * (W.parapet[0] - PIER_W / 2), sy * (W.parapet[1] - PIER_W / 2)));
// Dak binnen de borstwering en de kantelopeningen: op elke zijde tussen de hoekblokken vijf kantelen en zes openingen.
const roofCut = box(-W.inner[0], -W.inner[1], H.roof, W.inner[0], W.inner[1], H.corner + 5);
const embrasures = [];
for (const axis of [0, 1]) {
  const len = 2 * W.parapet[1 - axis] - 2 * PIER_W, n = 11, w = len / n; // breedte 0,93 (±X) en 0,91 m (±Y)
  for (let k = 0; k < n; k += 2) {
    const t0 = -len / 2 + k * w, t1 = t0 + w;
    for (const s of [1, -1]) {
      const r0 = s > 0 ? W.inner[axis] - 0.5 : -W.parapet[axis] - 1, r1 = s > 0 ? W.parapet[axis] + 1 : -W.inner[axis] + 0.5;
      embrasures.push(axis === 0 ? box(r0, t0, H.embrasure, r1, t1, H.corner + 5) : box(t0, r0, H.embrasure, t1, r1, H.corner + 5));
    }
  }
}
// Installaties op het dak (DSM tot NAP +39,9 en +39,4).
const plant = union([box(-0.2, -2.8, H.roof - 0.1, 1.3, -1.2, 32.6), box(1.8, -5.2, H.roof - 0.1, 3.8, -2.3, 32.4)]);

// ---------- vensters, oculi en ingangen als nissen ----------
// Nis in een gevel met normaal +X op afstand f: omtrek (y, z) als convexe veelhoek; het plafond loopt naar
// binnen onder 56 graden op (1,5 maal de diepte); buiten de gevel loopt de omtrek recht door.
const niche = (f, outline, depth = 0.3) => hull([
  ...outline.map(([y, z]) => [f - depth, y, z + 1.5 * depth]),
  ...outline.map(([y, z]) => [f, y, z]),
  ...outline.map(([y, z]) => [f + 1.0, y, z]),
]);
// Rondboog (b breed, voet z0, kruin z1) als veelhoek.
const arch = (c, b, z0, z1, n = 8) => {
  const r = b / 2, spring = z1 - r;
  const pts = [[c - r, z0], [c + r, z0]];
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * Math.PI;
    pts.push([c + r * Math.cos(a), spring + r * Math.sin(a)]);
  }
  return pts;
};
const oculus = (c, r, zc) => circle([c, zc], r, 8, Math.PI / 8);

// Gevelvlak op ±X of ±Y: zet een nis met normaal +X om naar die gevel.
const onFace = (m, face) => m.rotate([0, 0, { "+X": 0, "+Y": 90, "-X": 180, "-Y": 270 }[face]]);
const fieldOf = (face) => (face[1] === "X" ? W.field[0] : W.field[1]);
const cuts = [];
for (const face of ["+X", "-X", "+Y", "-Y"]) {
  const f = fieldOf(face);
  // Vierde bouwlaag: rond venster, derde: twee rondboogvensters (op alle gevels).
  cuts.push(onFace(niche(f, oculus(0, 0.75, 27.2)), face));
  for (const c of [-2.0, 2.0]) cuts.push(onFace(niche(f, arch(c, 1.0, 20.1, 22.1)), face));
}
for (const face of ["+Y", "-Y"]) {
  const f = W.field[1];
  // Ingangsgevels: groot rondboogvenster en daaronder een rondboogvensterpaar.
  cuts.push(onFace(niche(f, arch(0, 3.8, 14.3, 16.6, 12)), face));
  for (const c of [-1.2, 1.2]) cuts.push(onFace(niche(f, arch(c, 1.35, 8.0, 11.1)), face));
  // Rondboognis van de ingang met de dubbele deur, 4,8 m breed tot 6,1 m, 0,45 m diep in de onderbouw.
  cuts.push(onFace(niche(W.base[1], arch(0, 4.8, 0.6, 6.1, 12), 0.45), face));
}
// Boogfries: onder elke kantelopening een blinde boog van 0,9 m tussen de consoles, 0,25 m diep in de borstwering.
for (const axis of [0, 1]) {
  const len = 2 * W.parapet[1 - axis] - 2 * PIER_W, w = len / 11;
  for (let k = 0; k < 11; k += 2) {
    const c = -len / 2 + (k + 0.5) * w;
    for (const face of axis === 0 ? ["+X", "-X"] : ["+Y", "-Y"]) {
      const cc = face === "+X" || face === "-Y" ? c : -c; // na de rotatie van onFace weer op dezelfde plek
      cuts.push(onFace(niche(W.parapet[axis], arch(cc, 0.9, H.frieze + 0.15, 30.6, 6), 0.25), face));
    }
  }
}
// Noordelijk trappenhuis in de zuidwestgevel, aan de kant van de noordingang: drie rondboogvensters boven elkaar.
for (const [z0, z1] of [[7.9, 10.2], [13.0, 15.6], [16.4, 18.8]]) cuts.push(onFace(niche(W.field[0], arch(-1.1, 0.9, z0, z1)), "-X"));

const tower = union([base, shaft, crown]).subtract(union([roofCut, ...embrasures, ...cuts]));
const all = union([tower, ...cornerBlocks, ...finials, plant, ...stairs]);

await writeLandmark({
  slug: "watertoren-s-hertogenbosch-hinthamereinde",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:onderbouw-lisenen-kantelen-en-hoekpinakels", all]],
  catalog: {
    name: "Watertoren Hinthamereinde 's-Hertogenbosch",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8.6], [0, -8.6]],
    // Ellipsoïdisch: NAP +7,0 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0796100000218014"],
    description:
      "Oorsprong op het midden van de BAG-contour op maaiveld (NAP +7,0 m), +X langs RD 40,5 graden (noordoost), +Y langs de ingangsgevels (noordwest en zuidoost). Vierkante bakstenen toren: hardstenen onderbouw van 13,7 × 14,9 m tot 6,8 m met trappen en rondboognissen voor de ingangen, waterlijst, bovenbouw met hoeklisenen (12,6 × 12,9 m) en waterlijsten op 19 en 23 m, boogfries als kraag, plat dak op 30,4 m, borstwering met vijf kantelen per zijde tot 32,8 m en hoekblokken tot 33,75 m met pinakels; rondboogvensters, het grote venster en de oculi als nissen, twee installaties op het dak. Maten uit BAG, AHN, 3D BAG en foto's.",
    realWorld: {
      publishedHeightM: 30.84,
      registerHeightM: 33,
      reservoirM3: [180, 180],
      built: 1885,
      architect: "J. Kalff",
      rijksmonument: 522464,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 37.44,
      ahnCornerNapM: [40.7, 40.8],
      geoidNlgeo2018M: GEOID_N,
      axisDeg: ROT,
      baseM: [2 * W.base[0], 2 * W.base[1]],
      shaftAcrossPiersM: [2 * W.pier[0], 2 * W.pier[1]],
      parapetM: [2 * W.parapet[0], 2 * W.parapet[1]],
      roofM: H.roof,
      merlonTopM: H.merlon,
      cornerTopM: H.corner,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_('s-Hertogenbosch_Hinthamereinde)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/522464 (J. Kalff, 1885, vierkant, 33 m, plat dak met kantelen, vier bouwlagen, ingangen noord en zuid, 2 × 180 m³)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_exterieur_-_'s-Hertogenbosch_-_20109301_-_RCE.jpg (zuidgevel frontaal, maten)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_met_kantelen_-_'s-Hertogenbosch_-_20348614_-_RCE.jpg, RM522464_Watertoren,_Hinthamereinde73,_'s-Hertogenbosch.jpg, Watertoren05jan2007.jpg, 522464_Watertoren_('s-Hertogenbosch_Hinthamereinde).jpg (noordgevel, zijgevel met trappenhuis, pinakels)",
      "PDOK BAG-pand 0796100000218014, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2, AHN4 2021) van pand 0796100000218014: maaiveld 6,99, dak 37,44, maximum 39,36 (NAP)",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,59 m) voor groundHeight",
    ],
  },
});
