// Genereert een vereenvoudigd, gesloten 3D-model van het Bonnefantenmuseum in
// Maastricht (Avenue Céramique 250), het museum van Aldo Rossi (1995) aan de
// oostoever van de Maas: de plattegrond in de vorm van een E met de noord- en
// zuidvleugel en de rug aan de oostkant (drie bouwlagen, baksteen op een
// hardstenen plint, bovenaan een zinken band op een kraag), op de zalen van de
// zijvleugels een plat dak met een lange glazen lichtstraat als schilddak, de
// hogere middenvleugel van vier bouwlagen met de borstwering, de verhoogde
// dwarsmuur bij de toren, het verzonken glazen zadeldak boven de grote trap en
// aan de binnenhoven de lichte, spits toelopende lisenen met de hoge vensters
// ertussen, de entree aan de Avenue Céramique tussen twee pylonen met een
// stenen kraag, de verdiepte glasstrook en de portaalnis, en aan de Maas de
// koepeltoren: de witte voet met acht hardstenen lisenen, vensters en de
// kroonlijst, de zinken ‘raket’ met acht ribben en twee rijen vensters, het
// rondgaande balkon en de achtkante kap met dakkapellen, met de twee
// mintgroene trappentorens, de loopbrug en de glazen verbinding naar de
// middenvleugel. Vensters en deuren zijn blinde nissen. Alle maten in het
// script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// één node met de materiaalklasse in de nodenaam) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-bonnefanten.mjs              # 1:1000 (standaard)
//   node scripts/generate-bonnefanten.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alles staat op dezelfde onderkant (1 m
// onder het maaiveld); de zinken band, de kraag van de pylonen en de
// kroonlijst van de toren springen 0,3 tot 0,55 m uit op een schuine onderkant
// van 45 graden, de lisenen aan de binnenhoven lopen vanaf de grond op en
// eindigen in een schuine punt tegen de gevel, de raket bolt onder hooguit 2
// graden uit en de onderkant van het balkon loopt onder 46 graden schuin terug
// naar de raket. Alleen de vlakke bovenkanten van de nissen (hooguit 0,4 m
// diep) wijzen naar beneden; de controle onderaan staat geen andere
// ondervlakken toe.
//
// Assenstelsel: oorsprong in het hart van de BAG-contour (bbox langs de as) op
// het maaiveld van de Maaskade (NAP +49,0 m), Z omhoog. +X loopt langs de
// vleugels van de Maas (west, de toren) naar de rug aan de oostkant,
// RD-richting (0,98878, 0,14936), 8,59 graden linksom vanaf het oosten; +Y 90
// graden linksom, naar het noorden. De binnenhoven liggen op +0,9 m, het
// entreebordes aan de oostkant op +1,0 m (AHN-DTM).
//
// Bronnen: BAG-pand 0935100000023799 (contour van het hele complex inclusief
// de toren); AHN DSM/DTM 0,5 m (PDOK WCS) als raster in het stelsel langs de
// as: de goot, de lichtstraten en hun nokken, het dak van de rug, de
// borstwering en het verzonken dak van de middenvleugel met de dwarsmuur, de
// glasstrook boven de trap, de installatiekasten, de pylonen, de lisenen (om
// de 4,0 m, 1 m voor de gevel), de trappentorens, de loopbrug, het balkon en
// het kapprofiel van de toren en het maaiveld; PDOK luchtfoto; Wikipedia
// (Aldo Rossi, 1995, E-vormige plattegrond, raketvormige toren van 28 m) en
// Wikimedia Commons-foto's van alle kanten, met de maquette en het
// doorsnedemodel in het museum. Geschat uit foto's: de plint (2,5 m), de
// zinken band (14,6 tot 16,2 m), de vensterrijen en de laaddeur, de hoogte
// van de lisenen, de pylonen en de glasstrook bij de entree, het profiel van
// de raket (6,9 m aan de voet, 7,0 m op 14 m, 5,85 m onder het balkon), de
// stand van de ribben en de vensters van de toren.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "bonnefanten");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const section = (pts) => new CrossSection([ccw(pts)]);
const prism = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
const box = (u0, u1, v0, v1, z0, z1) =>
  Manifold.cube([u1 - u0, v1 - v0, z1 - z0], false).translate([u0, v0, z0]);
// Omwentelingslichaam uit een profiel [straal, hoogte] rond de Z-as.
const revolve = (profile, segments = 96) => Manifold.revolve([ccw(profile)], segments);
const deg = Math.PI / 180;

// Kraag langs een gevel van a naar b met de buitennormaal n (eenheidsvector):
// vanaf de gevel op z0 onder 47,7 graden `out` naar buiten, dan recht omhoog
// tot z1. De uiteinden lopen `out` door (`ext` = [begin, eind] als factor),
// zodat de kraag om buitenhoeken sluit.
const LEDGE_SLOPE = 1.1;
function ledge([u0, v0], [u1, v1], n, z0, z1, out, ext = [1, 1]) {
  const len = Math.hypot(u1 - u0, v1 - v0);
  const t = [(u1 - u0) / len, (v1 - v0) / len];
  const a = [u0 - t[0] * out * ext[0], v0 - t[1] * out * ext[0]];
  const b = [u1 + t[0] * out * ext[1], v1 + t[1] * out * ext[1]];
  const pts = [];
  for (const [pu, pv] of [a, b]) {
    pts.push([pu - n[0] * 0.05, pv - n[1] * 0.05, z0 - 0.05 * LEDGE_SLOPE]);
    pts.push([pu - n[0] * 0.05, pv - n[1] * 0.05, z1]);
    pts.push([pu + n[0] * out, pv + n[1] * out, z0 + out * LEDGE_SLOPE]);
    pts.push([pu + n[0] * out, pv + n[1] * out, z1]);
  }
  return Manifold.hull(pts);
}

// Blinde nis in een gevel: `at` = [u, v] op het gevelvlak, `normal` de
// richting naar buiten (eenheidsvector in het vlak), breedte w, van z0 tot z1,
// `depth` diep. Met `peak` krijgt de nis een spitse bovenkant tot z1 + peak.
function niche(at, normal, w, z0, z1, depth = 0.35, peak = 0) {
  const t = [-normal[1], normal[0]];
  const pts = [];
  for (const s of [-w / 2, w / 2]) {
    for (const d of [-depth, 1]) {
      const p = [at[0] + t[0] * s + normal[0] * d, at[1] + t[1] * s + normal[1] * d];
      pts.push([...p, z0], [...p, z1]);
    }
  }
  if (peak > 0) {
    for (const d of [-depth, 1]) {
      pts.push([at[0] + normal[0] * d, at[1] + normal[1] * d, z1 + peak]);
    }
  }
  return Manifold.hull(pts);
}

// ---------- maten (hoogte boven de Maaskade, NAP +49,0 m) ----------
const ORIGIN = [177140.234, 317008.108];
const X_AXIS = [0.98878, 0.14936];
const BASE = -1;
const COURT = 0.9; // binnenhoven (AHN-DTM NAP +49,9 m)
const TERRACE = 1.0; // entreebordes aan de oostkant (NAP +50,0 m)
// Plattegrond volgens de BAG-contour in het stelsel langs de as: de E met de
// noord- en zuidvleugel (14,7 m breed), de rug aan de oostkant en de
// middenvleugel. De middenvleugel is 16,6 m breed (AHN: de gevels op ±8,3 m
// boven en de lisenen ervoor symmetrisch; de BAG legt de zuidgevel op -7,42).
const WING = { u0: -21.74, u1: 35.26, inner: 23.66, outer: 38.34 };
const SPINE = { u0: 18.29, u1: 34.98 };
const MIDDLE = { u0: -17.73, v: 8.32 };
const ENTRANCE = { u1: 38.78, v: 8.34 };
const PLAN = [
  [MIDDLE.u0, MIDDLE.v],
  [SPINE.u0, MIDDLE.v],
  [SPINE.u0, WING.inner],
  [WING.u0, WING.inner],
  [WING.u0, WING.outer],
  [WING.u1, WING.outer],
  [WING.u1, WING.inner],
  [SPINE.u1, WING.inner],
  [SPINE.u1, ENTRANCE.v],
  [ENTRANCE.u1, ENTRANCE.v],
  [ENTRANCE.u1, -ENTRANCE.v],
  [SPINE.u1, -ENTRANCE.v],
  [SPINE.u1, -WING.inner],
  [WING.u1, -WING.inner],
  [WING.u1, -WING.outer],
  [WING.u0, -WING.outer],
  [WING.u0, -WING.inner],
  [SPINE.u0, -WING.inner],
  [SPINE.u0, -MIDDLE.v],
  [MIDDLE.u0, -MIDDLE.v],
];
// Goot en plat dak van de zijvleugels en de rug (AHN NAP +65,2 m), met
// bovenaan de zinken band op een kraag van 0,3 m (foto's).
const EAVE = 16.2;
const ZINC = { z0: 14.6, out: 0.3 };
// Hardstenen plint rondom, 0,3 m voor de gevel (foto's).
const PLINTH = { top: 2.5, out: 0.3 };
// Lichtstraat op de zalen van de zijvleugels: een glazen schilddak van de
// goot (1,6 m binnen de gevels) naar de nok op 18,52 m (NAP +67,5 m) midden
// boven de vleugel, dakvlakken 0,404 per meter (22 graden); de nok loopt van
// -14,56 tot 26,16 m (AHN, raster per 0,5 m).
const LANTERN = { u0: -20.3, u1: 31.9, inset: 1.6, ridge: 18.52 };
// Middenvleugel: borstwering op 20,6 m (NAP +69,6 m), 0,9 m dik, het dak
// erbinnen op 19,4 m; de dwarsmuur bij de toren tot 22,75 m (AHN).
const MIDDLE_TOP = 20.6;
const MIDDLE_ROOF = 19.4;
const PARAPET = 0.9;
const HEAD = { u: [-15.6, -11.4], v: 6.6, top: 22.75 };
// Glasstrook boven de grote trap: 5,5 m breed, verzonken tot 17,0 m met een
// glazen zadeldak tot 19,6 m (AHN: het 90e percentiel loopt van 16,5 aan de
// randen naar 19,1 m in het midden).
const STAIR_ROOF = { u: [-9.5, 15.5], v: 2.75, eave: 17.0, ridge: 19.6 };
// Twee rijen installatiekasten op het dak (AHN 20,7 m, luchtfoto).
const PLANT = { u: [-7.5, 3.5], v: [4.4, 7.0], top: 20.7 };
// Lisenen aan de binnenhoven: 1,0 m breed en 1,0 m voor de gevel, om de 4,0 m
// van u = -17,45 tot 14,55 m (AHN), recht tot 13,2 m en dan schuin tegen de
// gevel op tot een punt op 16,4 m (foto's).
const FIN = { u0: -17.45, step: 4.0, count: 9, w: 1.0, out: 1.0, top: 13.2, tip: 16.4 };
// Entree: twee pylonen van 6,2 m breed tot 21,0 m met een stenen kraag van
// 0,4 m op 19,5 m, ertussen de glasstrook van 4,2 m breed, 1,0 m terug, tot
// 19,6 m (foto's, AHN 20,6 tot 21,3 m op de pylonen).
const PYLON = { inner: 2.1, top: 21.0, ledge: 19.5, out: 0.4 };
const STRIP = { back: 1.0, top: 19.6 };
// Koepeltoren (BAG-cirkel om (-31,513, -0,057) met straal 7,277 m over de
// lisenen): de witte voet van 7,0 m straal met acht lisenen van 0,8 m breed
// en 0,3 m dik tot 9,25 m, de kroonlijst onder 45 graden tot 7,55 m en 10,4 m
// hoog, de raket, het balkon en de kap.
const TOWER = { cu: -31.513, cv: -0.057, r: 7.0, pilaster: 7.3, foot: 9.25, cornice: 7.55, corniceTop: 10.4 };
// Profiel [straal, hoogte] van de zinken raket (frontale foto, met de
// perspectief gecorrigeerd): 6,9 m op de kroonlijst, 7,0 m op 14 m, dan
// naar 5,85 m onder het balkon; de onderkant van het balkon loopt onder 46
// graden naar buiten tot 7,1 m op 23,0 m, de rand tot het dek op 23,6 m (AHN).
const ROCKET = [
  [6.9, 10.4], [6.97, 12.0], [7.0, 14.0], [6.95, 16.0], [6.8, 17.8],
  [6.55, 19.5], [6.25, 20.7], [5.85, 21.7],
];
const BALCONY = { r: 7.1, under: 23.0, deck: 23.6 };
// Achtkante kap van het dek naar de lantaarn met de top op 28,9 m (NAP +77,9
// m, AHN); straal over de graten.
const CAP = [[5.4, 23.6], [4.15, 25.0], [3.1, 26.8], [2.1, 27.5], [1.45, 28.0], [1.05, 28.9], [0, 28.9]];
// Ribben van de raket: acht, 0,7 m breed en 0,3 m dik, op de graten van de
// kap (de eerste naar de loopbrug, luchtfoto); vensters ertussen.
const RIB = { count: 8, w: 0.7, out: 0.3 };
// Twee trappentorens (BAG-cirkels, straal 1,35 m, AHN 28,25 m), de loopbrug
// van het balkon tussen de trappentorens door (AHN 21,8 m, 2,5 m breed) en
// de glazen verbinding naar de middenvleugel (AHN 14,6 m).
const STAIRS = { u: -20.95, v: 3.1, r: 1.35, top: 28.25 };
const BRIDGE = { u: [-24.6, -19.6], v: 1.25, top: 21.8 };
const LINK = { u: [-25.0, MIDDLE.u0 + 0.5], v: 2.2, top: 14.6 };

// ---------- opbouw ----------
const parts = [];
const cutters = [];
const nicheTops = []; // [z, oppervlak] van de vlakke bovenkanten
const addNiche = (at, normal, w, z0, z1, depth = 0.35, peak = 0) => {
  cutters.push(niche(at, normal, w, z0, z1, depth, peak));
  if (peak === 0) nicheTops.push([z1, w * depth]);
};
// Vleugels, rug en middenvleugel tot de goot, met de plint.
parts.push(prism(section(PLAN), BASE, EAVE));
parts.push(prism(section(PLAN).offset(PLINTH.out, "Miter", 2), BASE, PLINTH.top));
// Zinken band op de kraag langs de gevels van de zijvleugels en de rug (niet
// langs de middenvleugel en de entree, die hoger doorlopen).
for (const s of [1, -1]) {
  const P = (u, v) => [u, s * v];
  const runs = [
    [P(WING.u0, WING.inner), P(WING.u0, WING.outer), [-1, 0]],
    [P(WING.u0, WING.outer), P(WING.u1, WING.outer), [0, s]],
    [P(WING.u1, WING.inner), P(WING.u1, WING.outer), [1, 0]],
    [P(SPINE.u1, ENTRANCE.v), P(SPINE.u1, WING.inner), [1, 0]],
    [P(SPINE.u0, MIDDLE.v), P(SPINE.u0, WING.inner), [-1, 0]],
    [P(WING.u0, WING.inner), P(SPINE.u0, WING.inner), [0, -s]],
  ];
  for (const [a, b, n] of runs) parts.push(ledge(a, b, n, ZINC.z0, EAVE, ZINC.out));
}
// Lichtstraten op de zijvleugels.
for (const side of [1, -1]) {
  const vMid = (side * (WING.inner + WING.outer)) / 2;
  const half = (WING.outer - WING.inner) / 2 - LANTERN.inset;
  const { u0, u1 } = LANTERN;
  parts.push(
    Manifold.hull([
      ...[EAVE - 0.2, EAVE].flatMap((z) => [
        [u0, vMid - half, z],
        [u1, vMid - half, z],
        [u1, vMid + half, z],
        [u0, vMid + half, z],
      ]),
      [u0 + half, vMid, LANTERN.ridge],
      [u1 - half, vMid, LANTERN.ridge],
    ]),
  );
}
// Middenvleugel met de borstwering, het verzonken dak, de dwarsmuur, de
// glasstrook boven de trap en de installatiekasten.
parts.push(box(MIDDLE.u0, SPINE.u1 + 0.5, -MIDDLE.v, MIDDLE.v, BASE, MIDDLE_TOP));
cutters.push(
  box(MIDDLE.u0 + PARAPET, SPINE.u1 - PARAPET, -MIDDLE.v + PARAPET, MIDDLE.v - PARAPET, MIDDLE_ROOF, MIDDLE_TOP + 1),
);
cutters.push(box(STAIR_ROOF.u[0], STAIR_ROOF.u[1], -STAIR_ROOF.v, STAIR_ROOF.v, STAIR_ROOF.eave, MIDDLE_TOP + 1));
const roofAdds = [];
roofAdds.push(box(HEAD.u[0], HEAD.u[1], -HEAD.v, HEAD.v, MIDDLE_ROOF - 0.5, HEAD.top));
roofAdds.push(
  Manifold.hull([
    ...[STAIR_ROOF.eave - 0.3, STAIR_ROOF.eave].flatMap((z) => [
      [STAIR_ROOF.u[0], -STAIR_ROOF.v, z],
      [STAIR_ROOF.u[1], -STAIR_ROOF.v, z],
      [STAIR_ROOF.u[1], STAIR_ROOF.v, z],
      [STAIR_ROOF.u[0], STAIR_ROOF.v, z],
    ]),
    [STAIR_ROOF.u[0], 0, STAIR_ROOF.ridge],
    [STAIR_ROOF.u[1], 0, STAIR_ROOF.ridge],
  ]),
);
for (const s of [1, -1]) {
  roofAdds.push(box(PLANT.u[0], PLANT.u[1], s > 0 ? PLANT.v[0] : -PLANT.v[1], s > 0 ? PLANT.v[1] : -PLANT.v[0], MIDDLE_ROOF - 0.5, PLANT.top));
}
// Lisenen aan de binnenhoven, met de hoge vensters (drie boven elkaar) in de
// traveeën ertussen; de travee bij de dwarsmuur is dicht.
for (const s of [1, -1]) {
  const wall = s * MIDDLE.v;
  for (let k = 0; k < FIN.count; k++) {
    const u = FIN.u0 + k * FIN.step;
    const front = wall + s * FIN.out;
    const pts = [];
    for (const du of [-FIN.w / 2, FIN.w / 2]) {
      for (const v of [wall - s * 0.3, front]) pts.push([u + du, v, BASE], [u + du, v, FIN.top]);
      pts.push([u + du * 0.3, wall - s * 0.3, FIN.tip], [u + du * 0.3, wall, FIN.tip]);
    }
    parts.push(Manifold.hull(pts));
  }
  const bays = [];
  for (let k = 1; k < FIN.count - 1; k++) bays.push([FIN.u0 + (k + 0.5) * FIN.step, 2.2]);
  bays.push([(FIN.u0 + (FIN.count - 1) * FIN.step + SPINE.u0) / 2, 2.0]);
  for (const [u, w] of bays) {
    for (const [z0, z1] of [[1.6, 4.6], [5.6, 8.6], [9.6, 12.6]]) {
      addNiche([u, wall], [0, s], w, z0, z1);
    }
  }
}
// Entree aan de Avenue Céramique: de twee pylonen met de kraag, de
// glasstrook ertussen met de twee glasvlakken en de portaalnis.
parts.push(box(SPINE.u1, ENTRANCE.u1, -ENTRANCE.v, ENTRANCE.v, BASE, MIDDLE_TOP));
for (const s of [1, -1]) {
  const v0 = s * PYLON.inner;
  const v1 = s * ENTRANCE.v;
  parts.push(box(SPINE.u1, ENTRANCE.u1, Math.min(v0, v1), Math.max(v0, v1), BASE, PYLON.top));
  const runs = [
    [[ENTRANCE.u1, v0], [ENTRANCE.u1, v1], [1, 0]],
    [[SPINE.u1 + 0.3, v1], [ENTRANCE.u1, v1], [0, s]],
    [[ENTRANCE.u1 - STRIP.back, v0], [ENTRANCE.u1, v0], [0, -s]],
  ];
  for (const [a, b, n] of runs) parts.push(ledge(a, b, n, PYLON.ledge, PYLON.top, PYLON.out));
}
// Glasstrook tussen de pylonen: 1,0 m terug en lager.
cutters.push(box(ENTRANCE.u1 - STRIP.back, ENTRANCE.u1 + 1, -PYLON.inner, PYLON.inner, BASE, PYLON.top + 2));
cutters.push(box(SPINE.u1, ENTRANCE.u1 + 1, -PYLON.inner, PYLON.inner, STRIP.top, PYLON.top + 2));
const stripFace = ENTRANCE.u1 - STRIP.back;
const entranceNiches = [
  [[stripFace, 0], [1, 0], 2.6, TERRACE, 6.4, 0.4, 1.6],
  [[stripFace, 0], [1, 0], 3.2, 9.6, 13.4, 0.3],
  [[stripFace, 0], [1, 0], 3.2, 14.0, 18.4, 0.3],
];
// Vensters in de rug (oostgevel, drie rijen van vier) en de laaddeur in de
// zuidvleugel.
const spineCols = [10.4, 13.9, 17.4, 20.9];
const facadeNiches = [];
for (const s of [1, -1]) {
  for (const v of spineCols) {
    for (const [z0, z1] of [[2.4, 4.0], [6.6, 8.2], [10.8, 12.4]]) {
      facadeNiches.push([[SPINE.u1, s * v], [1, 0], 1.2, z0, z1]);
    }
    // Binnenhofgevel van de rug: hoge vensters in drie rijen.
    for (const [z0, z1] of [[1.6, 4.4], [5.6, 8.4], [9.6, 12.4]]) {
      facadeNiches.push([[SPINE.u0, s * (v + 0.2)], [-1, 0], 2.2, z0, z1]);
    }
  }
  // Buitengevels van de zijvleugels: een rij vensters op 6,2 m over de hele
  // lengte en een lage rij boven de plint in de oostelijke helft.
  const outer = s * WING.outer;
  const door = { u: -5, w: 4.0, top: 6.4, peak: 2.4 };
  for (let k = 0; k < 13; k++) {
    const u = -17 + 4 * k;
    if (s < 0 && Math.abs(u - door.u) < door.w) continue;
    facadeNiches.push([[u, outer], [0, s], 1.2, 6.2, 7.8]);
    if (u > 6) facadeNiches.push([[u, outer], [0, s], 1.2, 2.9, 4.3]);
  }
  if (s < 0) facadeNiches.push([[door.u, outer], [0, s], door.w, 0, door.top, 0.4, door.peak]);
  // Binnenhofgevels van de zijvleugels: twee rijen.
  const inner = s * WING.inner;
  for (let k = 0; k < 9; k++) {
    const u = -17 + 4 * k;
    facadeNiches.push([[u, inner], [0, -s], 1.2, 6.6, 8.2]);
    facadeNiches.push([[u, inner], [0, -s], 1.2, 2.8, 4.2]);
  }
}
for (const n of [...entranceNiches, ...facadeNiches]) addNiche(...n);

// Koepeltoren: witte voet met de kroonlijst, raket, balkon (één
// omwentelingslichaam), de achtkante kap, de lisenen, de ribben, de vensters
// en de dakkapellen.
const T = (m) => m.translate([TOWER.cu, TOWER.cv, 0]);
const towerProfile = [
  [0, BASE],
  [TOWER.r, BASE],
  [TOWER.r, TOWER.foot],
  [TOWER.cornice, TOWER.foot + (TOWER.cornice - TOWER.r)],
  [TOWER.cornice, TOWER.corniceTop],
  ...ROCKET,
  [BALCONY.r, BALCONY.under],
  [BALCONY.r, BALCONY.deck],
  [0, BALCONY.deck],
];
parts.push(T(revolve(towerProfile, 128)));
// Achtkant met de graten op k * 45 graden (revolve zet het eerste hoekpunt
// op +X).
parts.push(T(revolve([[0, BALCONY.deck - 0.5], ...CAP.map(([r, z]) => [r, z])], 8)));
const towerParts = [];
for (let k = 0; k < RIB.count; k++) {
  const a = k * 45;
  // Lisenen op de voet.
  towerParts.push(
    box(TOWER.r - 0.6, TOWER.pilaster, -0.4, 0.4, BASE, TOWER.foot).rotate([0, 0, a]),
  );
}
// Ribben: het raketprofiel 0,3 m naar buiten, gesneden tot latten van 0,7 m.
const ribShell = revolve(
  [[0, ROCKET[0][1] - 0.2], [ROCKET[0][0] + RIB.out, ROCKET[0][1] - 0.2], ...ROCKET.map(([r, z]) => [r + RIB.out, z]), [0, ROCKET.at(-1)[1]]],
  128,
);
for (let k = 0; k < RIB.count; k++) {
  const slab = box(0, 9, -RIB.w / 2, RIB.w / 2, ROCKET[0][1] - 0.2, ROCKET.at(-1)[1]).rotate([0, 0, k * 45]);
  towerParts.push(ribShell.intersect(slab));
}
// Dakkapellen op de kap, midden op de vlakken.
for (let k = 0; k < 8; k++) {
  towerParts.push(box(2.6, 4.75, -0.6, 0.6, BALCONY.deck, 25.4).rotate([0, 0, 22.5 + k * 45]));
}
parts.push(T(Manifold.union(towerParts)));
// Vensters in de voet (twee rijen) en de raket (twee rijen), midden tussen de
// lisenen en ribben; niet aan de kant van de loopbrug.
const radiusAt = (z) => {
  for (let i = 1; i < ROCKET.length; i++) {
    const [r0, z0] = ROCKET[i - 1];
    const [r1, z1] = ROCKET[i];
    if (z <= z1) return r0 + ((r1 - r0) * (z - z0)) / (z1 - z0);
  }
  return ROCKET.at(-1)[0];
};
const towerWindows = [];
for (let k = 0; k < 8; k++) {
  const a = 22.5 + k * 45;
  if (a === 22.5 || a === 337.5) continue;
  const rows = [
    [TOWER.r, 1.0, 4.2, 1.4],
    [TOWER.r, 6.0, 7.8, 1.5],
    [Math.min(radiusAt(17.2), radiusAt(18.4)), 17.2, 18.4, 1.2],
    [Math.min(radiusAt(20.2), radiusAt(21.3)), 20.2, 21.3, 1.2],
  ];
  for (const [r, z0, z1, w] of rows) {
    const c = [Math.cos(a * deg), Math.sin(a * deg)];
    towerWindows.push([[TOWER.cu + c[0] * r, TOWER.cv + c[1] * r], c, w, z0, z1, 0.3]);
  }
}
for (const n of towerWindows) addNiche(...n);
// Trappentorens, de loopbrug en de glazen verbinding.
for (const side of [1, -1]) {
  parts.push(
    Manifold.cylinder(STAIRS.top - BASE, STAIRS.r, STAIRS.r, 48, false).translate([
      STAIRS.u,
      side * STAIRS.v,
      BASE,
    ]),
  );
}
parts.push(box(BRIDGE.u[0], BRIDGE.u[1], -BRIDGE.v, BRIDGE.v, BASE, BRIDGE.top));
parts.push(box(LINK.u[0], LINK.u[1], -LINK.v, LINK.v, BASE, LINK.top));

const museum = Manifold.union(parts)
  .subtract(Manifold.union(cutters))
  .add(Manifold.union(roofAdds));
const nodes = [["building:bonnefanten", museum]];
const printModel = museum;

// ---------- controles ----------
if (museum.status() !== "NoError") throw new Error(museum.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de
  // onderkant: alleen de vlakke bovenkanten van de nissen horen erbij.
  const mesh = museum.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const levels = new Map();
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const z = Math.min(...p.map((q) => q[2])).toFixed(2);
    levels.set(z, (levels.get(z) ?? 0) + len / 2);
  }
  const total = [...levels.values()].reduce((sum, area) => sum + area, 0);
  console.log(`ondervlakken: ${total.toFixed(1)} m2`, Object.fromEntries([...levels].map(([z, a]) => [z, +a.toFixed(2)])));
  const allowed = new Map();
  for (const [z, area] of nicheTops) allowed.set(z.toFixed(2), (allowed.get(z.toFixed(2)) ?? 0) + area);
  for (const [z, area] of levels) {
    if (area > (allowed.get(z) ?? 0) + 0.05) {
      throw new Error(`ondervlak op ${z} m (${area.toFixed(2)} m2) is geen nisbovenkant`);
    }
  }
}

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
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "bonnefanten.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-bonnefanten.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `bonnefanten-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Bonnefantenmuseum 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

const modelBox = museum.boundingBox();
await writeFile(
  path.join(outDir, "bonnefanten.json"),
  JSON.stringify(
    {
      name: "Bonnefantenmuseum",
      file: "bonnefanten.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op de Maaskade voor de toren en op de straten langs de noord- en
      // zuidvleugel (NAP +48,8 tot +49,0 m); niet op de verhoogde binnenhoven
      // en de entree aan de oostkant (NAP +49,9 tot +50,0 m) en niet op het
      // talud naar de Maas, dat 9 m ten westen van de toren begint.
      groundSamplePoints: [
        [-41, -9],
        [-41, 9],
        [0, -43],
        [0, 43],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0935100000023799"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de BAG-contour op het maaiveld van de Maaskade (NAP +49,0 m) in de oorsprong, +X langs de vleugels van de toren aan de Maas naar de rug aan de oostkant (RD-richting 8,59 graden linksom vanaf het oosten) en +Y naar het noorden. Eén node zonder vrije overhang: de E-vormige plattegrond op een hardstenen plint met de zinken band op een kraag, de glazen lichtstraten als schilddak op de zijvleugels, de middenvleugel met borstwering, dwarsmuur, verzonken glazen zadeldak boven de grote trap, installatiekasten en spitse lisenen aan de binnenhoven, de entree tussen twee pylonen met de verdiepte glasstrook en de portaalnis, en de koepeltoren met de witte voet met lisenen en kroonlijst, de zinken raket met acht ribben, het balkon en de achtkante kap met dakkapellen, met twee trappentorens, de loopbrug en de glazen verbinding; vensters en deuren als blinde nissen. Vervangt de PDOK-reconstructie van BAG-pand 0935100000023799, dat het hele museum met de toren omvat.",
      printFiles: [`bonnefanten-1-${scale}.stl`],
      realWorld: {
        lengthM: +(modelBox.max[0] - modelBox.min[0]).toFixed(2),
        widthM: +(modelBox.max[1] - modelBox.min[1]).toFixed(2),
        wingWidthM: +(WING.outer - WING.inner).toFixed(2),
        middleWingWidthM: +(2 * MIDDLE.v).toFixed(2),
        plinthM: PLINTH.top,
        eaveM: EAVE,
        lanternRidgeM: LANTERN.ridge,
        middleWingM: MIDDLE_TOP,
        middleRoofM: MIDDLE_ROOF,
        headM: HEAD.top,
        stairRoofRidgeM: STAIR_ROOF.ridge,
        finSpacingM: FIN.step,
        finTipM: FIN.tip,
        pylonsM: PYLON.top,
        towerRadiusM: TOWER.pilaster,
        towerFootM: TOWER.corniceTop,
        rocketMaxRadiusM: Math.max(...ROCKET.map(([r]) => r)),
        balconyRadiusM: BALCONY.r,
        balconyDeckM: BALCONY.deck,
        towerTopM: CAP.at(-1)[1],
        stairTowersM: STAIRS.top,
        bridgeM: BRIDGE.top,
        groundNapM: 49.0,
        courtsM: COURT,
        entranceTerraceM: TERRACE,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Bonnefantenmuseum",
        "PDOK BAG pand 0935100000023799, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS als raster langs de as: goot en lichtstraten van de zijvleugels, dak van de rug, borstwering, verzonken dak, dwarsmuur, glasstrook en installatiekasten van de middenvleugel, lisenen, pylonen, trappentorens, loopbrug, balkon en kap van de toren, maaiveld, binnenhoven en entreebordes",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: 20150312 Maastricht; Bonnefantenmuseum seen from Kennedybrug 04.jpg, 20150312 Maastricht; Bonnefantenmuseum seen from Kennedybrug 08.jpg, 20130504 Maastricht Céramique seen from West bank of the Meuse 01 Bonnefantenmuseum.JPG, Two short towers of the Bonnefantenmuseum.jpg, 20150312 Maastricht; Front of Bonnefantenmuseum seen from the east 01.jpg, Bonnefantenmuseum (Maastricht) 20-06-2018 11-04-22.jpg, Bonnefantenmuseum (Maastricht) 20-06-2018 11-55-33.jpg, 20150312 Maastricht; Southside of Bonnefantenmuseum seen from the southeast 03.jpg, Maastricht Bonnefantenmuseum 2.jpg, Maastricht - panoramio (4).jpg, View from the rooftop of the Bonnefantenmuseum - 14918328928.jpg, 2023 Maastricht, Bonnefantenmuseum, maquette (2).jpg, Bonnefantenmuseum, Maastricht, Schnittmodell.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
