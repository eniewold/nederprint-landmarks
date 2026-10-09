// Genereert een vereenvoudigd, gesloten 3D-model van de Slauerhoffbrug over de
// Harlingervaart (Van Harinxmakanaal) in Leeuwarden: de vliegende ophaalbrug
// (staartbrug) uit 2000, waarvan het vierkante brugdek met een gebogen
// ladderarm aan een pyloon op de zuidwestoever wordt opgetild, hier in
// gesloten (neergelaten) stand. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-slauerhoffbrug.mjs              # 1:1000 (standaard)
//   node scripts/generate-slauerhoffbrug.mjs --scale 500
//
// Assenstelsel: oorsprong op de as van het dek midden op de klep (RD
// 180304,75, 579176,50), z = 0 op de waterspiegel zoals het PDOK-terrein die
// legt (ellipsoïdisch 40,96 m; het PDOK-terrein ligt hier 41,32 m boven het
// AHN, dus z = NAP + 0,36 m). +X loopt langs de brug naar het noorden
// (RD-richting 88,03 graden vanaf het oosten, de randen van het BGT-dek), +Y
// naar het westen. Alle dwarslijnen van het BGT-dek (landhoofden, pijlers,
// voegen van de klep) staan 5,2 graden scheef: x = c + 0,091 y.
//
// Werking (Wikipedia, foto's): de brug is een staartbrug. Op de zuidwestoever
// staan twee betonnen pyloonpoten met op hun top het scharnier; daarover ligt
// een gebogen ladderarm (twee zijliggers met dwarsdragers) met aan de staart
// een contragewicht: een liggende trommel met gele randen. De horizontale
// scharnieras staat 45 graden scheef op de weg, zodat de klep bij het openen
// over de zuidwesthoek omhoog draait en open als een ruit naast de pyloon
// staat. Gesloten loopt de arm vanaf de trommel (hoog, achter de pyloon) over
// het scharnier omlaag tot op dekhoogte naast de westrand van de zuidelijke
// vaste overspanning; de twee voorste armen liggen dan in het wegdek: de
// noordelijke over het water naar de westrand van de klep, de zuidelijke in
// een sleuf in de vaste overspanning.
//
// Bronnen: BGT overbruggingsdeel (dek 46 x 16,5 m, twee pijlers van 1,8 m, de
// klep van 14,6 m tussen de pijlers, de landhoofden met vleugelmuren) en
// wegdeel/ondersteunend wegdeel op het dek (rijbaan lokale weg, fietspad en
// voetpad, gesloten verharding); AHN DSM 0,5 m (PDOK WCS) voor het wegdek
// (NAP +3,8 tot +3,95 m), de bovenkant van de trommel (NAP +12,1 m), de arm
// boven het scharnier (NAP +10 m), het verloop van de arm en de fundering tussen de
// poten (NAP +3,8 m); PDOK luchtfoto (Actueel_orthoHR) voor de plattegrond van
// de arm (45 graden op de as), de trommel (7,4 m lang), de poten en de
// geleidewerken; Wikipedia (nl) voor de werking; Wikimedia Commons-foto's
// (20190419 Slauerhoffbrug1/2 Leeuwarden.jpg, De Slauwerhoffbrug
// Leeuwarden.JPG, Slauerhoffbrug - wegaanzicht - Bert Kaufmann.jpg,
// Slauerhoffbrug.JPG, Slauerhoffbrug "Flying" Drawbridge by Hindrik 1/2.jpg)
// voor de ladderarm, de trommel met gele randen, de poten met ronde vensters
// en de klep.
// Geschat: de dikte van de arm (2,7 m bij het scharnier, 1,0 m bij de
// landing), de diameter van de trommel (3,8 m over de randen, 3,0 m kern),
// de vorm van de poten (6,8 m breed aan de voet, 1,8 m aan de top, 1,5 m dik),
// de dekdiktes (vaste overspanningen 1,3 m, klep 1,2 m), de schampkanten
// (0,25 m hoog) en de hoogte van de geleidewerken (NAP +1,55 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "slauerhoffbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const area2 = (pts) => {
  let a = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  });
  return a / 2;
};
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Cilinder met de as langs Y van y0 tot y1 door (x, z).
const cylinderY = (x, z, r, y0, y1) =>
  Manifold.cylinder(y1 - y0, r, r).rotate([-90, 0, 0]).translate([x, y0, z]);

// ---------- hoofdmaten ----------
const BASE = -1.5; // gemeenschappelijke onderkant, onder de waterspiegel
const K = 0.091; // scheefstand van de dwarslijnen: x = c + K y
const DECK = { top: 4.25, east: -8.35, west: 8.2 }; // wegdek op NAP +3,89 m
const SPAN_DEPTH = 1.3; // vaste overspanningen
const LEAF_DEPTH = 1.2; // klep
const SOUTH_END = -22.98; // voorzijde zuidelijk landhoofd (BGT), c bij y = 0
const NORTH_END = 21.62; // voorzijde noordelijk landhoofd (BGT)
const S_PIER = [-9.71, -7.92]; // zuidelijke pijler (BGT)
const N_PIER = [6.66, 8.33]; // noordelijke pijler (BGT)
const LEAF = [S_PIER[1], N_PIER[0]]; // klep tussen de pijlers: 14,6 m
const ABUTMENT = 1.5; // dikte van de landhoofdwanden onder het dek
// Schampkanten op de bermen langs de dekranden (BGT ondersteunend wegdeel
// berm, waar de leuningen staan): 0,9 m breed en 0,25 m boven het wegdek.
const KERB = { east: [DECK.east, -7.45], west: [7.3, DECK.west], top: DECK.top + 0.25 };

// Strook tussen dwarslijnen c0 en c1 (scheef), over y0..y1, van z0 tot z1.
const skewSlab = (c0, c1, y0, y1, z0, z1) =>
  prism(
    [
      [c0 + K * y0, y0],
      [c1 + K * y0, y0],
      [c1 + K * y1, y1],
      [c0 + K * y1, y1],
    ],
    z0,
    z1,
  );

// ---------- vaste brug ----------
const spanBottom = DECK.top - SPAN_DEPTH;
const southSpan = skewSlab(SOUTH_END, LEAF[0], DECK.east, DECK.west, spanBottom, DECK.top);
const northSpan = skewSlab(LEAF[1], NORTH_END, DECK.east, DECK.west, spanBottom, DECK.top);
const fixedKerbs = [
  [SOUTH_END, LEAF[0]],
  [LEAF[1], NORTH_END],
].flatMap(([c0, c1]) =>
  [KERB.east, KERB.west].map(([y0, y1]) => skewSlab(c0, c1, y0, y1, DECK.top - 0.5, KERB.top)),
);
// Pijlers over de volle breedte, 0,3 tot 0,5 m buiten de dekranden (BGT).
const piers = [S_PIER, N_PIER].map(([c0, c1]) => skewSlab(c0, c1, -8.8, 8.6, BASE, spanBottom + 0.01));
const abutments = [
  skewSlab(SOUTH_END, SOUTH_END + ABUTMENT, DECK.east, DECK.west, BASE, spanBottom + 0.01),
  skewSlab(NORTH_END - ABUTMENT, NORTH_END, DECK.east, DECK.west, BASE, spanBottom + 0.01),
];
// Vleugelmuren van de landhoofden (BGT landhoofd), 0,5 m dik, tot de
// hoogte van de schampkanten.
// Ze lopen 0,5 m onder het dek door en sluiten op de dekrand aan.
const WINGS = [
  [-27.8, SOUTH_END + K * -8.5 + 0.5, -9.0, DECK.east + 0.05],
  [-26.2, SOUTH_END + K * 8.0 + 0.5, DECK.west - 0.05, 8.5],
  [NORTH_END + K * -8.1 - 0.5, 24.9, -8.6, DECK.east + 0.05],
  [NORTH_END + K * 8.45 - 0.5, 26.45, DECK.west - 0.05, 8.95],
];
const wings = WINGS.map(([x0, x1, y0, y1]) => boxFromTo(x0, x1, y0, y1, BASE, KERB.top));
// Geleidewerken (remmingwerk) langs de doorvaart, vier stuks van circa 10 m
// (luchtfoto), 1,2 m breed met de bovenkant op NAP +1,55 m.
const JETTY = { width: 1.2, top: 1.9 };
const JETTIES = [
  [[-6.4, 8.4], [-7.34, 18.51]],
  [[7.21, 8.4], [9.07, 18.47]],
  [[5.4, -8.6], [6.54, -18.54]],
  [[-6.99, -8.6], [-10.26, -18.81]],
];
const jetties = JETTIES.map(([[x0, y0], [x1, y1]]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const [nx, ny] = [(-(y1 - y0) / len) * (JETTY.width / 2), ((x1 - x0) / len) * (JETTY.width / 2)];
  return prism(
    [
      [x0 + nx, y0 + ny],
      [x1 + nx, y1 + ny],
      [x1 - nx, y1 - ny],
      [x0 - nx, y0 - ny],
    ],
    BASE,
    JETTY.top,
  );
});

// ---------- klep ----------
// De klep overlapt de vaste overspanningen 1 cm, zodat de vereniging over de
// scheve voegen geen vlakken zonder dikte overhoudt; bij het opdelen gaat die
// overlap naar de klep.
const leaf = skewSlab(LEAF[0] - 0.01, LEAF[1] + 0.01, DECK.east, DECK.west, DECK.top - LEAF_DEPTH, DECK.top);
const leafKerbs = [KERB.east, KERB.west].map(([y0, y1]) =>
  skewSlab(LEAF[0] - 0.01, LEAF[1] + 0.01, y0, y1, DECK.top - 0.5, KERB.top),
);

// ---------- arm, trommel en pyloon ----------
// Eigen stelsel (u, v, z): u langs de arm van de trommel naar de brug (45
// graden op de as van de brug, naar het noordoosten), v 90 graden linksom
// (noordwest), z als in het model. Oorsprong in het hart van de trommel, in
// het lokale stelsel op (-20,64, 19,37).
const ARM_ORIGIN = [-20.64, 19.37];
const toLocal = (solid) => solid.rotate([0, 0, -45]).translate([ARM_ORIGIN[0], ARM_ORIGIN[1], 0]);
const PIVOT_U = 5.5; // scharnier op de top van de poten
// Contragewicht: liggende trommel met de as langs v, kern 3,0 m, gele randen
// van 3,8 m (bovenkant NAP +12,1 m volgens het AHN), de naaf steekt 0,3 m
// buiten de randen uit.
const DRUM = { z: 10.6, core: 1.5, rim: 1.9, rimV: [2.9, 3.4], hubV: 3.7 };
// Zijliggers van de ladderarm, 1,5 m breed, v = ±2,0 .. ±3,5.
const BEAM_V = [2.0, 3.5];
// Zijaanzicht van de arm (u, z), gesloten: bovenrand van de trommel over het
// scharnier (z 10,75) in een bocht omlaag tot de landing op dekhoogte naast de
// vaste overspanning (u 11 .. 12,6, bovenkant 0,4 m boven het wegdek). De
// onderrand loopt van het scharnier onder 45 tot 47 graden naar de landing.
const LANDING_TOP = DECK.top + 0.4;
const ARM_PROFILE = [
  [-0.5, 12.0],
  [2.5, 11.6],
  [PIVOT_U, 10.75],
  [7.0, 9.6],
  [8.5, 7.9],
  [10.0, 6.5],
  [11.2, 5.35],
  [12.0, LANDING_TOP + 0.1],
  [12.6, LANDING_TOP],
  [12.6, LANDING_TOP - 1.0],
  [10.0, LANDING_TOP - 1.0],
  [7.0, LANDING_TOP + 2.0],
  [PIVOT_U, 8.0],
  [2.5, 8.9],
  [-0.5, 9.1],
];
// Dwarsdragers over de volle breedte van de arm: bij het scharnier, halverwege
// de bocht en de landing; daartussen open (in het AHN en op de luchtfoto
// zichtbaar als gaten).
const CROSS = [
  [4.4, 6.6],
  [7.6, 8.6],
  [11.0, 12.6],
];
// Noordelijke voorarm: de zijligger loopt op dekhoogte over het water door tot
// de westrand van de klep (luchtfoto: RD 180296,4, 579171,8).
const PRONG = { u: [12.6, 19.0], top: LANDING_TOP, bottom: LANDING_TOP - 1.0 };
// As van het scharnier door de poten, met lagerdeksels van 0,3 m buiten de
// poten.
const AXLE = { z: 9.0, r: 0.8, v: 5.3 };
// Pyloonpoten (beton) aan weerszijden van de arm, v = ±3,5 .. ±5,0: een voet
// van 6,8 m breed, aan de brugzijde onder 62 graden versmald tot de top van
// 1,8 m, aan de trommelzijde verticaal met een schuine voet (foto's).
// De poten overlappen de zijliggers 1 cm (zie de klep).
const PIER_V = [BEAM_V[1] - 0.01, 5.0];
const PYLON_PROFILE = [
  [PIVOT_U + 3.6, BASE],
  [PIVOT_U + 3.6, 4.6],
  [PIVOT_U + 0.9, 9.6],
  [PIVOT_U + 0.9, 10.0],
  [PIVOT_U - 0.9, 10.0],
  [PIVOT_U - 0.9, 5.2],
  [PIVOT_U - 3.2, 1.4],
  [PIVOT_U - 3.2, BASE],
];
// Rond venster in de buitenkant van elke poot als blinde nis van 0,3 m.
const WINDOW = { u: PIVOT_U + 2.0, z: 2.2, r: 0.75, depth: 0.3 };
// Fundering tussen de poten tot NAP +3,8 m (AHN).
const FOOTING = { u: [PIVOT_U - 0.9, PIVOT_U + 3.6], top: 4.0 };

const armSide = (s) => profileY(ARM_PROFILE, s > 0 ? BEAM_V[0] : -BEAM_V[1], s > 0 ? BEAM_V[1] : -BEAM_V[0]);
const armProfileSolid = profileY(ARM_PROFILE, -BEAM_V[1], BEAM_V[1]);
const armParts = [
  armSide(1),
  armSide(-1),
  ...CROSS.map(([u0, u1]) => armProfileSolid.intersect(boxFromTo(u0, u1, -BEAM_V[1], BEAM_V[1], 0, 20))),
  boxFromTo(PRONG.u[0] - 0.01, PRONG.u[1], BEAM_V[0], BEAM_V[1], PRONG.bottom, PRONG.top),
  cylinderY(0, DRUM.z, DRUM.core, -DRUM.hubV, DRUM.hubV),
  cylinderY(0, DRUM.z, DRUM.rim, DRUM.rimV[0], DRUM.rimV[1]),
  cylinderY(0, DRUM.z, DRUM.rim, -DRUM.rimV[1], -DRUM.rimV[0]),
  cylinderY(PIVOT_U, AXLE.z, AXLE.r, -AXLE.v, AXLE.v),
];
const arm = toLocal(union(armParts));
const pylonLegs = [1, -1].map((s) => {
  const [v0, v1] = s > 0 ? PIER_V : [-PIER_V[1], -PIER_V[0]];
  const leg = profileY(PYLON_PROFILE, v0, v1);
  const outer = s > 0 ? v1 : v0;
  const [n0, n1] = s > 0 ? [outer - WINDOW.depth, outer + 0.5] : [outer - 0.5, outer + WINDOW.depth];
  const niche = cylinderY(WINDOW.u, WINDOW.z, WINDOW.r, n0, n1);
  return leg.subtract(niche);
});
const footing = boxFromTo(FOOTING.u[0], FOOTING.u[1], -PIER_V[0] - 0.1, PIER_V[0] + 0.1, BASE, FOOTING.top);
const pylon = toLocal(union([...pylonLegs, footing]));

// ---------- printmodel ----------
const fixedParts = union([southSpan, northSpan, ...fixedKerbs, ...piers, ...abutments, ...wings, ...jetties]);
const liftParts = union([leaf, ...leafKerbs, arm]);
const printModel = union([fixedParts, liftParts, pylon]);

// ---------- wegdek als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is per functie een eigen node met de
// attributen van het BGT-wegdeel eronder (glTF `extras.attributes`), zodat de
// kleurregels van een thema op de brug werken zoals op de PDOK-wegdelen
// ernaast. Pas na het samenstellen van het printmodel uitgesneden, zodat de
// STL niet verandert. BGT-wegdelen op het dek (relatieve_hoogteligging 1,
// actueel), van oost naar west:
// - voetpad, gesloten verharding: G0080.24e907aaed683789e0530d0957918266
//   (zuid), G0080.24e907a7c8523789e0530d0957918266 (klep),
//   G0080.24e907a7c8513789e0530d0957918266 (noord);
// - fietspad, gesloten verharding: G0080.24e907a892683789e0530d0957918266,
//   G0080.24e907a956de3789e0530d0957918266, G0080.24e907a5f3043789e0530d0957918266;
// - rijbaan lokale weg, gesloten verharding:
//   G0080.24e907a6fe543789e0530d0957918266, G0080.24e907a5f3053789e0530d0957918266,
//   G0080.24e907a892693789e0530d0957918266.
// Geen van de wegdelen heeft een plus_fysiek_voorkomen. De berm en het
// verkeerseiland (ondersteunend wegdeel) tussen fietspad en rijbaan horen bij
// de rijbaan; de bermen langs de dekranden zijn de schampkanten.
const LAYER = 0.5;
const ABOVE = 1.0;
const GAP = 0.02;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "gesloten verharding" };
// Grenzen tussen de wegdelen (lokale coördinaten, BGT tot op 5 cm): over de
// drie dekdelen liggen ze op één rechte.
const FOOT_EDGE = [[-23.54, -6.15], [21.13, -5.67]]; // voetpad | fietspad
const BIKE_EDGE = [[-23.21, -2.58], [21.43, -2.18]]; // fietspad | berm en rijbaan
const lineY = ([[x0, y0], [x1, y1]], x) => y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
const OUT_X = [-32, 30];
const band = (lowEdge, highEdge, z0, z1) =>
  prism(
    [
      [OUT_X[0], lowEdge ? lineY(lowEdge, OUT_X[0]) : -30],
      [OUT_X[1], lowEdge ? lineY(lowEdge, OUT_X[1]) : -30],
      [OUT_X[1], highEdge ? lineY(highEdge, OUT_X[1]) : 30],
      [OUT_X[0], highEdge ? lineY(highEdge, OUT_X[0]) : 30],
    ],
    z0,
    z1,
  );
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek over het hele dek, ook
// voorbij de dekranden en de landhoofden.
const strip = skewSlab(SOUTH_END - 1, NORTH_END + 1, DECK.east - 1, DECK.west + 1, DECK.top - LAYER, DECK.top + ABOVE);
// Wat boven het wegdek uitsteekt, blijft constructie, met 2 cm vrij: de
// schampkanten, de landing van de arm en de noordelijke voorarm.
const guards = [
  ...[
    [SOUTH_END - 2, NORTH_END + 2],
  ].flatMap(([c0, c1]) =>
    [
      [KERB.east[0] - 1, KERB.east[1] + GAP],
      [KERB.west[0] - GAP, KERB.west[1] + 1],
    ].map(([y0, y1]) => skewSlab(c0, c1, y0, y1, 0, 10)),
  ),
  toLocal(
    union([
      boxFromTo(CROSS[2][0] - GAP, CROSS[2][1] + GAP, -BEAM_V[1] - GAP, BEAM_V[1] + GAP, 0, 10),
      boxFromTo(PRONG.u[0] - GAP, PRONG.u[1] + GAP, BEAM_V[0] - GAP, BEAM_V[1] + GAP, 0, 10),
    ]),
  ),
];
const roadCut = strip.subtract(union(guards));
const footArea = band(null, FOOT_EDGE, BASE - 1, 20);
const bikeArea = band(FOOT_EDGE, BIKE_EDGE, BASE - 1, 20);
const roadArea = band(BIKE_EDGE, null, BASE - 1, 20);
const footway = roadCut.intersect(footArea).intersect(printModel);
const bikeway = roadCut.intersect(bikeArea).intersect(printModel);
const roadway = roadCut.intersect(roadArea).intersect(printModel);
// De klep onder het wegdek en de arm zijn de ophaalbrug, de poten met de
// fundering de pyloon, de rest de vaste brug.
const liftPart = liftParts.subtract(roadCut);
const pylonPart = pylon.subtract(liftParts).subtract(roadCut);
const fixedPart = fixedParts.subtract(roadCut).subtract(liftParts).subtract(pylon);

const parts = [
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
  ["road:voetpad", footway, FOOT_ATTRIBUTES],
  ["building:brug", fixedPart],
  ["building:ophaalbrug", liftPart],
  ["building:pyloon", pylonPart],
];

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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}

// ---------- controles en uitvoer ----------
await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of [...parts, ["printModel", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  if (solid.isEmpty()) throw new Error(`${name}: leeg`);
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    pieces: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(2),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
{
  const bb = printModel.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
}
// De onderdelen vormen samen precies de brug als geheel (geen overlap).
const partsVolume = parts.reduce((sum, [, solid]) => sum + solid.volume(), 0);
report.partition = {
  partsM3: +partsVolume.toFixed(3),
  wholeM3: +printModel.volume().toFixed(3),
  differenceM3: +(partsVolume - printModel.volume()).toFixed(4),
};
if (Math.abs(partsVolume - printModel.volume()) > 0.05) throw new Error("onderdelen overlappen");

const glbFile = path.join(outDir, "slauerhoffbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-slauerhoffbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en pyloon op het
// printbed.
const stlName = `slauerhoffbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Slauerhoffbrug Leeuwarden 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveldpunten op het water van de Harlingervaart aan beide zijden van de
// klep, tussen de geleidewerken (PDOK-water ellipsoïdisch 40,96 tot 40,99 m).
const GROUND_HEIGHT = 40.96;
const samplePoints = [
  [0, 13],
  [-3, 13],
  [0, -13],
  [3, -13],
];
await writeFile(
  path.join(outDir, "slauerhoffbrug.json"),
  JSON.stringify(
    {
      name: "Slauerhoffbrug",
      file: "slauerhoffbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [180304.75, 579176.5],
      xAxis: [0.03438, 0.99941],
      groundOffsetMetres: 0,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "G0080.24e907a53d573789e0530d0957918266",
        "G0080.24e907a5d8c23789e0530d0957918266",
        "G0080.24e907a5f0923789e0530d0957918266",
        "G0080.24e907a6fe513789e0530d0957918266",
        "G0080.24e907a6fe523789e0530d0957918266",
        "G0080.24e907a6fe533789e0530d0957918266",
        "G0080.24e907a7c84e3789e0530d0957918266",
        "G0080.24e907a7c84f3789e0530d0957918266",
        "G0080.24e907a7c8503789e0530d0957918266",
        "G0080.24e907a88e7a3789e0530d0957918266",
        "G0080.24e907a88e7b3789e0530d0957918266",
        "G0080.24e907a892673789e0530d0957918266",
        "G0080.24e907a956db3789e0530d0957918266",
        "G0080.24e907a956dc3789e0530d0957918266",
        "G0080.24e907a956dd3789e0530d0957918266",
        "G0080.24e907a95abd3789e0530d0957918266",
        "G0080.24e907aa23473789e0530d0957918266",
        "G0080.24e907aaed673789e0530d0957918266",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden op de klep op de waterspiegel van de Harlingervaart (z = 0, NAP -0,36 m volgens het PDOK-terrein) in de oorsprong, +X langs de brug naar het noorden (RD-richting 88,03 graden vanaf het oosten) en +Y naar het westen. Vliegende ophaalbrug (staartbrug) in gesloten stand: de klep van 14,6 x 16,5 m tussen twee pijlers, vaste overspanningen van 13,3 m, het wegdek op NAP +3,9 m. Op de zuidwestoever twee betonnen pyloonpoten met ronde vensters (nissen), 10 m boven het water, en de scharnieras op NAP +8,6 m; de gebogen ladderarm (twee zijliggers van 1,5 m, drie dwarsdragers) staat 45 graden op de as en loopt van het contragewicht, een liggende trommel van 3,8 m met gele randen (bovenkant NAP +12,1 m), over het scharnier omlaag tot op dekhoogte naast de zuidelijke overspanning, met de noordelijke voorarm over het water tot de westrand van de klep. Nodes: road:rijbaan, road:fietspad en road:voetpad zijn de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan lokale weg, fietspad of voetpad, bgt_fysiekvoorkomen gesloten verharding); building:brug de vaste brug (overspanningen onder het wegdek, schampkanten, pijlers, landhoofden met vleugelmuren, geleidewerken); building:ophaalbrug de klep onder het wegdek met haar schampkanten, de arm en de trommel; building:pyloon de poten met de fundering. Leuningen, lantaarns, slagbomen, seinen, de hydraulische cilinders en de open stand zijn weggelaten; de export vult onder de klep, de arm en de trommel op. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_END - SOUTH_END).toFixed(2),
        deckWidthM: +(DECK.west - DECK.east).toFixed(2),
        leafLengthM: +(LEAF[1] - LEAF[0]).toFixed(2),
        deckTopNapM: +(DECK.top - 0.36).toFixed(2),
        drumTopNapM: +(DRUM.z + DRUM.rim - 0.36).toFixed(2),
        drumDiameterM: DRUM.rim * 2,
        pivotNapM: +(AXLE.z - 0.36).toFixed(2),
        armAngleToAxisDeg: 45,
        waterNapM: -0.36,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Slauerhoffbrug",
        "PDOK BGT overbruggingsdeel (dek, pijlers, landhoofden) en wegdeel/ondersteunend wegdeel op het dek (OGC API), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de trommel, het scharnier, de arm en de fundering",
        "PDOK luchtfoto (Actueel_orthoHR) voor de plattegrond van de arm, de trommel, de poten en de geleidewerken",
        "Wikimedia Commons: 20190419 Slauerhoffbrug1 Leeuwarden.jpg, 20190419 Slauerhoffbrug2 Leeuwarden.jpg, De Slauwerhoffbrug Leeuwarden.JPG, Slauerhoffbrug - wegaanzicht - Bert Kaufmann.jpg, Slauerhoffbrug.JPG, Slauerhoffbrug \"Flying\" Drawbridge by Hindrik 1.jpg en 2.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
