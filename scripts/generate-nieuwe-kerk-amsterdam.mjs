// Genereert een gesloten 3D-model van de Nieuwe Kerk op de Dam in Amsterdam uit
// dakvlakken en bouwdelen: een kruisbasiliek met een schip, dwarsschip en koor
// onder één nok (+35,4 m, 57 graden), een borstwering met pinakels langs alle
// hoge daken, een koorsluiting van vijf zijden van een twaalfhoek met een
// kooromgang en vijf straalkapellen met tentdaken, zijbeuken met
// lessenaarsdaken, kapellen met schilddaken en dakkapellen, kapellen met
// schilddaken en dakjes langs het koor, topgevels met pinakels, de westgevel met
// twee hoektorens met leien spitsen en het stenen westportaal, het zuidportaal
// aan de Dam en de dakruiter op de viering (+56,2 m). De kerkmeesterskamer aan
// de Dam (een eigen BAG-pand, waarvan de PDOK-reconstructie punten van de kerk
// meeneemt) is een tweede onderdeel met een schilddak en dakkapellen. Elk dak
// is een vlak z = a u + b v + c uit het AHN en de LoD2.2-vlakken van de 3D BAG.
// Het Mapbox-model is niet gebruikt. Alle maten in het script zijn meters op
// ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-nieuwe-kerk-amsterdam.mjs              # 1:1000 (standaard)
//   node scripts/generate-nieuwe-kerk-amsterdam.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (121259,4, 487454,3), het midden van de viering
// onder de dakruiter, op het maaiveld aan de Dam (NAP +1,9 m), Z omhoog. +X loopt
// langs de nok van schip en koor naar het oosten (17,5 graden linksom vanaf de
// RD-X-as) en +Y loodrecht daarop naar het noorden. Het westportaal staat op
// u = -46,3 m, het koor eindigt met de straalkapellen op u = 49,6 m.
//
// Bronnen: PDOK BAG-panden 0363100012169079 (de kerk) en 0363100012169014 (de
// kerkmeesterskamer); AHN DSM/DTM 0,5 m (PDOK WCS) voor nokken, goten, de
// kapellen en het maaiveld; 3D BAG LoD2.2 (api.3dbag.nl) voor de hellingen;
// Wikipedia; PDOK luchtfoto; foto's op Wikimedia Commons. Geschat zijn de
// hoektorens en hun spitsen (het AHN ziet ze tot +34 m), de lantaarn van de
// dakruiter, de pinakels, steunberen, dakkapellen en vensternissen, de portalen
// en de lage aanbouwen tussen de straalkapellen. Weggelaten: maaswerk, het
// roosvenster, de open balustrades (dicht), dakramen onder 0,9 m en de huizen
// tegen de noordzijde (eigen BAG-panden, blijven als PDOK-model staan).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "nieuwe-kerk-amsterdam");
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
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Vlak door de gevellijn p0-p1, stijgend naar binnen (kant van 'inside') met helling t vanaf z0.
const facet = ([x0, y0], [x1, y1], z0, t, [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len;
  let ny = (x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [t * nx, t * ny, z0 - t * (nx * x0 + ny * y0)];
};
// Doorsneden in plan voor de tussenstukken van een geleding (convexe veelhoeken).
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const diamond = ([cx, cy], r) => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) =>
  loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Steunbeer tegen een gevel die naar -v kijkt (zuid): breedte w, diepte d, bovenkant zw tegen de muur en zo aan de buitenkant.
// angle draait de gevel: 0 zuid, 90 oost, 180 noord, 270 west; [x, y] is het punt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 59 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.9) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Regelmatige veelhoek: hoekpunten op de hoeken angs (graden) rond c, voor een veelhoek met apothema apo en zijdehoek step.
const ngon = (c, apo, angs, step) =>
  angs.map((a) => {
    const r = apo / Math.cos(((step / 2) * Math.PI) / 180);
    return [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  });
// Dakvlak boven een gevel met de normaal naar phi (graden) op apothema apo rond c: goot z0, helling t naar binnen.
const facetPhi = (c, phi, apo, z0, t) => {
  const cp = Math.cos((phi * Math.PI) / 180);
  const sp = Math.sin((phi * Math.PI) / 180);
  return [-t * cp, -t * sp, z0 + t * apo + t * (c[0] * cp + c[1] * sp)];
};
// Doorsnede van een of meer veelhoeken en een rand (borstwering) van breedte w langs de omtrek, van z0 tot z1.
const section = (...polys) => CrossSection.union(polys.map((p) => new CrossSection([ccw(p)])));
const band = (cs, w, z0, z1) => Manifold.extrude(cs.subtract(cs.offset(-w, "Miter")), z1 - z0).translate([0, 0, z0]);
// Pinakel op een steunbeer die tot de onderkant doorloopt: vierkante schacht tot z1 en een piramide.
const pier = (c, half, z1, point) => loft([[BASE, sq(c, half)], [z1, sq(c, half)], [z1 + point, tip(c)]]);

const SLUG = "nieuwe-kerk-amsterdam";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +1,9 m) ----------
const GROUND_NAP = 1.9;
const ORIGIN = [121259.4, 487454.3];
const X_AXIS = [0.953717, 0.300706]; // RD-richting 17,5 graden, langs de nokken van schip en koor
// Alle onderdelen beginnen op dezelfde onderkant; het maaiveld aan de noordkant ligt 0,5 m lager dan aan de Dam.
const BASE = -0.8;

// Hoofddaken van schip, dwarsschip en koor (AHN en 3D BAG: 57 graden, nok NAP +37,3 m).
const T = 1.55;
const RIDGE = 35.4;
const HW = 8.15; // halve breedte van schip, dwarsschip en koor tot de buitenkant van de muur
const EAVE = RIDGE - T * HW; // waar het dakvlak de muur snijdt
const PARAPET = 25.8; // bovenkant van de borstwering langs de hoge daken
const WEST = -40.6; // westgevel van het schip, achter het portaal
const S_FRONT = -29.6; // zuidgevel van het dwarsschip (aan de Dam)
const N_FRONT = 29.6; // noordgevel van het dwarsschip
// Koor: een sluiting van vijf zijden van een twaalfhoek rond AC, de kooromgang en de straalkapellen ook.
const AC = [27.6, 0];
const APSE = ngon(AC, HW, [-75, -45, -15, 15, 45, 75], 30);
const PHIS = [-90, -60, -30, 0, 30, 60, 90];
// Zijbeuken van het schip: lessenaarsdak van +15,3 m aan het schip naar +14,0 m aan de buitenmuur.
const AISLE = { u0: -40.0, out: 14.9, zIn: 15.3, zOut: 14.04 };
const AISLE_T = (AISLE.zIn - AISLE.zOut) / (AISLE.out - HW);
const BAYS = [-39.2, -32.6, -26.5, -20.5, -14.45]; // steunberen en pinakels, vijf traveeën
// Kooromgang: lessenaarsdak van +15,2 m tegen het koor naar +13,6 m bij de steunberen tussen de kapellen.
const AMB = { apo: 14.7, apoOut: 18.8, zIn: 15.2, zOut: 14.3 };
const AMB_T = (AMB.zIn - AMB.zOut) / (AMB.apo - HW);
// Straalkapellen: 3/8-sluiting, halve breedte 3,8 m, tot 21 m van AC, goot +12,9 m, dak 45 graden.
const CHAPEL = { r0: 14.4, half: 3.8, rEnd: 21.0, eave: 12.9 };

// Maaiveld (AHN NAP +1,9 tot +2,0 m) aan de westkant en aan de Dam.
const GROUND_SAMPLES = [[-52, 0], [-50, -12], [-12, -28], [0, -36]];

// ---------- kerk ----------
const solids = [];
const side = [-1, 1];

// Schip en koor: één langsdak met de nok op v = 0, de sluiting met vijf dakvlakken op de goot.
const naveChoir = [[WEST, -HW], ...APSE, [WEST, HW]];
solids.push(roofed(naveChoir, PHIS.map((p) => facetPhi(AC, p, HW, EAVE, T))));
// Dwarsschip met dezelfde nok en helling.
const transept = rect(-HW, HW, S_FRONT, N_FRONT);
solids.push(roofed(transept, [[-T, 0, RIDGE], [T, 0, RIDGE]]));
// Topgevels: 1,2 m dik en 1,1 m boven het dakvlak, met een pinakel op de top.
const GABLE = RIDGE + 1.1;
solids.push(roofed(rect(WEST, WEST + 1.2, -HW, HW), [[0, -T, GABLE], [0, T, GABLE]]));
solids.push(roofed(rect(-HW, HW, S_FRONT, S_FRONT + 1.2), [[-T, 0, GABLE], [T, 0, GABLE]]));
solids.push(roofed(rect(-HW, HW, N_FRONT - 1.2, N_FRONT), [[-T, 0, GABLE], [T, 0, GABLE]]));
for (const c of [[WEST + 0.6, 0], [0, S_FRONT + 0.6], [0, N_FRONT - 0.6]]) solids.push(pinnacle(c, 0.5, GABLE - 1.2, 2.0, 1.8));

// Borstwering langs alle hoge daken (0,9 m breed, tot +25,8 m) met pinakels op de traveegrenzen.
const high = section(naveChoir, transept);
solids.push(band(high, 0.9, EAVE - 1, PARAPET));
const highPinnacles = [];
for (const s of side) {
  for (const u of BAYS) highPinnacles.push([u, s * (HW - 0.45)]);
  for (const u of [15.35, 22.55]) highPinnacles.push([u, s * (HW - 0.45)]);
  for (const v of [15.2, 22.3]) highPinnacles.push([s * (HW - 0.45), v], [s * (HW - 0.45), -v]);
}
for (const c of highPinnacles) solids.push(pinnacle(c, 0.45, PARAPET - 0.3, 1.7, 1.8));
// Op de hoeken van de sluiting staan de pinakels op steunberen die tot het maaiveld doorlopen.
for (const c of ngon(AC, HW - 0.2, [-75, -45, -15, 15, 45, 75], 30)) solids.push(pier(c, 0.5, 27.2, 1.8));

// Hoektorens van de westgevel: achtkant van 3,4 m tot +26,5 m, een kraag van 4,0 m en een leien spits tot +37 m.
const TURRETS = [[WEST - 0.3, -7.7], [WEST - 0.3, 7.7]];
for (const c of TURRETS) {
  solids.push(
    loft([
      [BASE, oct(c, 3.4)],
      [26.2, oct(c, 3.4)],
      [26.6, oct(c, 4.0)],
      [27.6, oct(c, 4.0)],
      [37.0, oct(c, 0.9)],
    ]),
  );
}
// Westportaal (stenen voorbouw tot +12 m) met een spitse doorgang en blinde bogen.
solids.push(prism(rect(-46.3, WEST + 0.2, -8.6, 8.6), BASE, 12.0));
for (const s of side) solids.push(pinnacle([-45.9, s * 8.2], 0.4, 11.9, 1.4, 1.4));

// Zijbeuken van het schip met een borstwering en pinakels op de steunberen.
for (const s of side) {
  const a = rect(AISLE.u0, -HW + 0.05, s * (HW - 0.05), s * AISLE.out);
  solids.push(roofed(a, [[0, -s * AISLE_T, AISLE.zIn + AISLE_T * HW]]));
  // Borstwering langs de westgevel en de zijgevel tot de kapel.
  solids.push(prism(rect(AISLE.u0, -20.3, s * (AISLE.out - 0.9), s * AISLE.out), BASE, 15.7));
  solids.push(prism(rect(AISLE.u0, AISLE.u0 + 0.9, s * HW, s * AISLE.out), BASE, 15.7));
  for (const u of BAYS.slice(0, 3)) solids.push(pinnacle([u === -39.2 ? AISLE.u0 + 0.45 : u, s * (AISLE.out - 0.45)], 0.45, 15.5, 1.3, 1.6));
  // Steunberen tegen de zijgevel en de hoeksteunbeer.
  for (const u of [-32.6, -26.5]) solids.push(buttress([u, s * AISLE.out], s < 0 ? 0 : 180, 0.9, 1.4, 12.8, 11.6));
  solids.push(prism(rect(AISLE.u0, -38.6, s * AISLE.out, s * 16.4), BASE, 11.8));
  solids.push(prism(rect(-41.6, AISLE.u0 + 0.1, s * 13.5, s * 14.8), BASE, 11.8));
}

// Kapellen tegen de vierde en vijfde travee (noordwest en zuidwest): schilddak met de nok langs het schip op +21,6 m.
const CH_T = 1.75;
const CH_RIDGE = 21.6;
const CH_V = 19.1;
const CH_EAVE = CH_RIDGE - CH_T * (CH_V - AISLE.out);
for (const s of side) {
  const c = rect(-20.3, -HW + 0.05, s * (AISLE.out - 0.05), s * 24.0);
  solids.push(
    roofed(c, [...ridgeV(s * CH_V, CH_RIDGE, CH_T), [CH_T, 0, CH_EAVE + CH_T * 20.3]]),
  );
  // Dakkapel met een pinakel op het buitenste dakvlak.
  solids.push(roofed(rect(-14.5, -12.5, s * 21.0, s * 23.0), ridgeU(-13.5, 18.6, CH_T)));
  solids.push(pinnacle([-13.5, s * 22.5], 0.45, 17.6, 1.3, 1.5));
  // Hoekpinakels op de westhoeken van de kapel.
  solids.push(prism(rect(-21.1, -20.0, s * 23.2, s * 24.6), BASE, 12.4));
  solids.push(pinnacle([-20.55, s * 23.9], 0.5, 12.3, 2.6, 2.0));
  solids.push(pier([-20.75, s * 15.3], 0.45, 16.9, 2.0));
}

// Dwarsschip: steunberen met pinakels op de hoeken van beide gevels.
for (const s of side) {
  for (const [front, dir] of [[S_FRONT, -1], [N_FRONT, 1]]) {
    solids.push(prism(rect(s * 6.3, s * 7.9, front + dir * 0.0, front + dir * 1.0), BASE, 22.0));
    solids.push(pinnacle([s * 7.1, front + dir * 0.5], 0.5, 21.9, 3.2, 2.6));
    solids.push(buttress([s * HW, front - dir * 2.0], s < 0 ? 270 : 90, 1.1, 1.0, 21.0, 19.8));
  }
}
// Zuidportaal aan de Dam: een stenen voorbouw met lessenaarsdaken en in het midden een steil schilddak.
solids.push(roofed(rect(-7.3, 7.3, S_FRONT - 0.7, S_FRONT + 0.1), [[0, 2.1, 6.0 + 2.1 * (-S_FRONT)]]));
solids.push(roofed(rect(-2.5, 2.5, -32.4, S_FRONT + 0.1), [[-2.0, 0, 9.3], [2.0, 0, 9.3], [0, 2.0, 4.3 + 2.0 * 32.4]]));
solids.push(pinnacle([0, -31.9], 0.45, 4.2, 1.0, 1.8));
// Noordportaal: lage aanbouwen aan weerszijden van de ingang.
solids.push(prism(rect(-7.5, -2.5, N_FRONT - 0.1, 31.2), BASE, 7.0), prism(rect(2.2, 7.4, N_FRONT - 0.1, 31.2), BASE, 7.0));

// Dakruiter op de viering: achtkantige lantaarn tot +41 m en een naaldspits tot +56,2 m.
solids.push(
  loft([
    [30.0, oct([0, 0], 3.6)],
    [38.4, oct([0, 0], 3.6)],
    [38.8, oct([0, 0], 3.2)],
    [41.0, oct([0, 0], 3.2)],
    [41.3, oct([0, 0], 2.8)],
    [48.0, oct([0, 0], 1.7)],
    [56.2, oct([0, 0], 0.9)],
  ]),
);

// Kooromgang en zijbeuken van het koor: lessenaarsdak tot de steunberen tussen de straalkapellen.
const ambulatory = [
  [HW - 0.05, -AMB.apo],
  ...ngon(AC, AMB.apo, [-75], 30),
  ...ngon(AC, AMB.apoOut, [-45, -15, 15, 45], 30),
  ...ngon(AC, AMB.apo, [75], 30),
  [HW - 0.05, AMB.apo],
];
solids.push(roofed(ambulatory, PHIS.map((p) => facetPhi(AC, p, AMB.apo, AMB.zOut, AMB_T))));
// Pinakels op de steunberen tussen de kapellen.
for (const [u, v] of ngon(AC, AMB.apoOut - 0.4, [-45, -15, 15, 45], 30)) solids.push(pier([u, v], 0.45, 15.2, 1.8));
// Vijf straalkapellen met een tentdak (45 graden) en een pinakel op de top.
for (const phi of [-60, -30, 0, 30, 60]) {
  const cp = Math.cos((phi * Math.PI) / 180);
  const sp = Math.sin((phi * Math.PI) / 180);
  const at = (r, t) => [AC[0] + r * cp - t * sp, AC[1] + r * sp + t * cp];
  const { r0, half, rEnd, eave } = CHAPEL;
  const rc = rEnd - half;
  const k = half * Math.tan(Math.PI / 8);
  const local = [[r0, -half], [rc + k, -half], [rEnd, -k], [rEnd, k], [rc + k, half], [r0, half]];
  const poly = local.map(([r, t]) => at(r, t));
  const top = eave + half;
  const planes = [
    facetPhi(at(rc, 0), phi, half, eave, 1),
    facetPhi(at(rc, 0), phi + 45, half, eave, 1),
    facetPhi(at(rc, 0), phi - 45, half, eave, 1),
    facetPhi(at(rc, 0), phi + 90, half, eave, 1),
    facetPhi(at(rc, 0), phi - 90, half, eave, 1),
    facetPhi(at(rc, 0), phi + 180, half, eave, 1),
  ];
  solids.push(roofed(poly, planes));
  solids.push(pinnacle(at(rc, 0), 0.45, top - 1.0, 1.4, 1.5));
}
// Lage aanbouwen (+3,4 m) tussen de straalkapellen tot de rooilijn.
solids.push(
  prism(
    [[31.5, -17.5], [38.7, -17.5], [39.5, -13.3], [46.4, -13.2], [48.0, -8.6], [49.6, -2.2], [49.6, 2.6], [48.2, 9.1], [45.7, 13.5], [41.1, 18.2], [37.4, 18.9], [32.0, 16.0]],
    BASE,
    3.4,
  ),
);
// Zuidoosthoek: een strook op de hoogte van de omgang en een achtkantige traptoren met een spits.
solids.push(roofed(rect(24.4, 31.6, -17.6, -AMB.apo + 0.05), [[0, AMB_T, AMB.zOut + AMB_T * AMB.apo]]));
solids.push(loft([[BASE, oct([29.0, -16.9], 2.8)], [15.5, oct([29.0, -16.9], 2.8)], [21.3, oct([29.0, -16.9], 0.9)]]));
// Het achtkantige torentje op de grens met de kerkmeesterskamer (spits +21,8 m).
solids.push(loft([[BASE, oct([25.7, -19.6], 2.8)], [16.0, oct([25.7, -19.6], 2.8)], [16.3, oct([25.7, -19.6], 3.1)], [21.8, oct([25.7, -19.6], 0.9)]]));

// Kapellen ten noorden van het koor: twee schilddaken met de nok langs het koor op +19,2 m (53 graden, hoeken 56 graden).
const NCH = { v0: AMB.apo - 0.05, v1: 22.8, ridge: 19.2, t: 1.34, th: 1.48 };
const nchEave = NCH.ridge - NCH.t * ((NCH.v1 - NCH.v0) / 2);
const nchMid = (NCH.v0 + NCH.v1) / 2;
for (const [u0, u1] of [[HW - 0.05, 19.4], [19.4, 32.0]]) {
  solids.push(
    roofed(rect(u0, u1, NCH.v0, NCH.v1), [
      ...ridgeV(nchMid, NCH.ridge, NCH.t),
      [NCH.th, 0, nchEave - NCH.th * u0],
      [-NCH.th, 0, nchEave + NCH.th * u1],
    ]),
  );
}
// Lage aanbouw daarachter (+4,9 m) met een zadeldak langs de straat (nok +8 m).
solids.push(prism([[HW - 0.05, NCH.v1 - 0.05], [31.5, NCH.v1 - 0.05], [32.5, 24.6], [9.0, 30.6], [HW - 0.05, 30.6]], BASE, 4.9));
{
  const p0 = [9.0, 30.6];
  const p1 = [32.5, 24.6];
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const n = [(p1[1] - p0[1]) / len, -(p1[0] - p0[0]) / len]; // naar binnen (zuid)
  const strip = [p0, [26.0, p0[1] + ((26.0 - p0[0]) * (p1[1] - p0[1])) / (p1[0] - p0[0])], [26.0 + 4.8 * n[0], 26.3 + 4.8 * n[1]], [HW - 0.05 + 4.8 * n[0], 30.6 + 4.8 * n[1]], [HW - 0.05, 30.6]];
  const mid = [p0[0] + 2.4 * n[0], p0[1] + 2.4 * n[1]];
  const q = [mid[0] + (p1[0] - p0[0]) / len, mid[1] + (p1[1] - p0[1]) / len];
  solids.push(roofed(strip, [facet(mid, q, 8.0, -1.25, p0), facet(mid, q, 8.0, -1.25, [mid[0] + n[0], mid[1] + n[1]])]));
}

// Kapellen ten zuiden van het koor: drie dakjes met de nok langs het koor (+16,6 m), steile schilden ertussen.
const SCH = { v0: -22.1, v1: -AMB.apo + 0.05, ridgeV: -17.0, ridge: 16.6 };
for (const [u0, u1] of [[HW - 0.05, 13.2], [13.2, 19.0], [19.0, 25.2]]) {
  solids.push(
    roofed(rect(u0, u1, SCH.v0, SCH.v1), [
      [0, -1.0, SCH.ridge - 1.0 * SCH.ridgeV],
      [0, 0.4, SCH.ridge - 0.4 * SCH.ridgeV],
      [2.2, 0, 14.2 - 2.2 * u0],
      [-2.2, 0, 14.2 + 2.2 * u1],
    ]),
  );
}
solids.push(prism(rect(HW - 0.05, 25.2, SCH.v0, SCH.v0 + 0.9), BASE, 15.8));
for (const u of [13.05, 18.95, 24.8]) {
  solids.push(prism(rect(u - 0.45, u + 0.45, -22.9, SCH.v0 + 0.1), BASE, 13.0));
  solids.push(pier([u, SCH.v0 - 0.1], 0.45, 17.0, 1.6));
}

const churchMass = Manifold.union(solids);
let church = churchMass;

// Vensternissen (spitsbogen, 0,5 m diep).
const cuts = [];
// Schip: lichtbeuk en zijbeuken, een venster per travee.
const naveBays = [-35.9, -29.55, -23.5, -17.45, -11.3];
for (const u of naveBays) {
  cuts.push(niche([u, 0], 270, HW, 0, 3.0, 16.4, 21.4, 0.5), niche([u, 0], 90, HW, 0, 3.0, 16.4, 21.4, 0.5));
}
for (const u of naveBays.slice(0, 3)) {
  cuts.push(niche([u, 0], 270, AISLE.out, 0, 2.6, 3.5, 10.0, 0.5), niche([u, 0], 90, AISLE.out, 0, 2.6, 3.5, 10.0, 0.5));
}
// Westgevel boven het portaal en de westgevels van de zijbeuken.
cuts.push(niche([0, 0], 180, -WEST, 0, 6.0, 13.4, 20.8, 0.5));
for (const s of side) cuts.push(niche([0, s * 11.5], 180, -AISLE.u0, 0, 2.6, 3.5, 10.0, 0.5));
// Westportaal: spitse doorgang (4,4 m) en blinde bogen.
cuts.push(niche([0, 0], 180, 46.3, 0, 4.4, BASE - 0.1, 6.0, 3.8));
for (const s of side) cuts.push(niche([0, s * 5.4], 180, 46.3, 0, 3.4, 1.2, 6.8, 0.4));
// Dwarsschip: grote vensters in beide gevels.
cuts.push(niche([0, 0], 270, -S_FRONT, 0, 6.6, 7.5, 19.5, 0.5), niche([0, 0], 90, N_FRONT, 0, 6.6, 9.0, 19.5, 0.5));
cuts.push(niche([0, 0], 90, N_FRONT, 0, 3.6, BASE - 0.1, 4.6, 0.8));
// Koor en sluiting: lichtbeuk per travee en per zijde.
for (const u of [11.75, 18.95, 26.1]) cuts.push(niche([u, 0], 270, HW, 0, 2.6, 16.0, 21.4, 0.5), niche([u, 0], 90, HW, 0, 2.6, 16.0, 21.4, 0.5));
for (const phi of [-60, -30, 0, 30, 60]) cuts.push(niche(AC, phi, HW, 0, 2.6, 16.0, 21.4, 0.5));
// Straalkapellen: een venster in de kopse zijde.
for (const phi of [-60, -30, 0, 30, 60]) cuts.push(niche(AC, phi, CHAPEL.rEnd, 0, 1.6, 3.5, 9.0, 0.5));
// Kapellen ten noorden van het koor.
for (const u of [11.2, 16.4, 22.6, 28.6]) cuts.push(niche([u, 0], 90, NCH.v1, 0, 2.2, 6.0, 10.4, 0.5));
church = church.subtract(Manifold.union(cuts));

// ---------- kerkmeesterskamer (Dam 12, eigen BAG-pand) ----------
// Het PDOK-model van dit pand neemt punten van de kerk mee (tot NAP +27,8 m tegenover +17,6 m in het AHN);
// daarom zit het hier als eenvoudig gebouw met schilddak, dakkapellen en een achtkantig torentje.
const annex = [];
annex.push(roofed(rect(7.5, 25.2, -31.5, -22.0), [...ridgeV(-26.8, 13.5, 1.35), [-1.35, 0, 7.15 + 1.35 * 25.2]]));
for (const u of [11.0, 16.4, 21.8]) annex.push(prism(rect(u - 0.8, u + 0.8, -29.8, -27.2), BASE, 10.8));
const east = [[25.1, -17.6], [39.6, -18.3], [39.5, -13.3], [46.4, -13.2], [40.9, -23.4], [38.8, -25.6], [29.5, -30.2], [28.9, -31.4], [25.1, -31.4]];
annex.push(prism(east, BASE, 3.4));
annex.push(prism(east, BASE, 8.6).intersect(prism(rect(25.0, 30.5, -32, -17), BASE, 9)));
annex.push(prism(east, BASE, 10.7).intersect(prism(rect(30.5, 40.5, -26.3, -17.6), BASE, 11)));
let kerkmeesterskamer = Manifold.union(annex).subtract(churchMass);
for (const u of [10.4, 13.9, 18.9, 22.4]) kerkmeesterskamer = kerkmeesterskamer.subtract(niche([u, 0], 270, 31.5, 0, 1.6, 2.0, 5.2, 0.4));

const nodes = [
  ["building:kerk", church],
  ["building:kerkmeesterskamer", kerkmeesterskamer],
];
const all = Manifold.union([church, kerkmeesterskamer]);

const META = {
  name: "Nieuwe Kerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 44.88,
  replacesBuildings: ["0363100012169079", "0363100012169014"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (121259,4, 487454,3), het midden van de viering, op het maaiveld aan de Dam (NAP +1,9 m), +X langs de nok van schip en koor naar het oosten (17,5 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. Node building:kerk uit dakvlakken en bouwdelen: schip, dwarsschip en koor onder één nok op +35,4 m (57 graden) met een borstwering en pinakels, een koorsluiting van vijf zijden van een twaalfhoek met kooromgang en vijf straalkapellen, zijbeuken en kapellen met lessenaars- en schilddaken, topgevels, twee hoektorens met spitsen tot +37 m en het westportaal, het zuidportaal en de dakruiter tot +56,2 m. Node building:kerkmeesterskamer: het aangebouwde pand aan de Dam met schilddak en dakkapellen. Onderkant 0,8 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van beide panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { naveRidgeM: RIDGE, eaveM: +EAVE.toFixed(2), parapetM: PARAPET, flecheTopM: 56.2, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Nieuwe_Kerk_%28Amsterdam%29",
    "PDOK BAG panden 0363100012169079 (kerk) en 0363100012169014 (kerkmeesterskamer), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, goten, kapellen en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen van de daken",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's van de Dam, de Nieuwezijds Voorburgwal en de Eggertstraat",
  ],
};
// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
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
  const gltfNodes = [];
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
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
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
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
