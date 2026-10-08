// Genereert een gesloten 3D-model van de Mevlana Moskee in Rotterdam (2001, aan
// het Zuiderpark): de gebedszaal van 23 bij 34 m met een vlak dak op +10,55 m
// en een dakrand, de grote koepel van 19,2 m doorsnee (top +21,6 m) op een
// achthoekige tamboer met kroonlijst en vier halve koepels, vier kleine
// koepels op lage trommels, de gebogen voorgevel met een galerij en een terras
// met bolkoepeltjes, en twee zijtorens met een schuin toelopende top waaruit de
// minaretten van circa 40 m (balkons op 27,5 en 33 m) oprijzen. Alle delen zijn
// vlakken, prisma's, revolves en bolkappen; de maten staan in meters op ware
// grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-mevlana-moskee.mjs              # 1:1000 (standaard)
//   node scripts/generate-mevlana-moskee.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (89956,73, 437396,58), het zwaartepunt van het
// BAG-pand, op maaiveldniveau (NAP -1,0 m), Z omhoog. +X loopt naar het
// noordoosten (53,25 graden tegen de klok in vanaf de RD-X-as) en +Y loodrecht
// daarop naar het noordwesten; de voorgevel met de minaretten staat aan de
// +Y-kant, de grote koepel aan de -Y-kant. Het gebouw is symmetrisch om u = -0,8.
//
// Bronnen: PDOK BAG-pand 0599100000652535 (de moskee; de voorste boog van het
// terras en de voetafdruk van de zijtorens); AHN DSM/DTM op 0,25 m (PDOK WCS):
// het dak (+10,5 m, de rand 0,8 m breed op +10,7 m), de dakrand die aan de
// west- en zuidkant 1,7 m buiten de BAG-contour ligt, de grote koepel (+21,6 m,
// radiaal profiel, de verticale wand van tamboer en hals rond r = 8,2 m), de
// vier kleine koepels (+12,1 en +13,3 m), de halve koepels op de diagonale
// zijden van de achthoek (+1,2 m boven het dak), het terras voor de voorgevel
// (+3,3 m) op de BAG-boog, de zijtorens (3,4 m breed; de AHN-rand loopt tot
// circa +25 m onder de balkons) en de minaretten (+40 m); Wikipedia; PDOK
// luchtfoto. Geschat zijn de hoogte van de zijtorens (loodrecht tot +14,5 m,
// dan toelopend tot +27,5 m), de galerijopeningen, de nissen in de gevel, de
// hals en de vensters, de balkons en doorsnede van de minaretten en de stralen
// van de halve en kleine koepels. Weggelaten: de zonnepanelen en installaties,
// het kantwerk, het gevelreliëf en de lagere aanbouw ten oosten van de
// achtergevel.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "mevlana-moskee");
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
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);
const deg = (rad) => (rad * 180) / Math.PI;

const SLUG = "mevlana-moskee";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP -1,0 m) ----------
const GROUND_NAP = -1.0;
const ORIGIN = [89956.73, 437396.58];
const X_AXIS = [0.598325, 0.801254]; // RD-richting 53,25 graden, langs de gevels
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// Voorgevel: twee bogen om de as u = -0,8. De buitenste boog (BAG) is de rand van
// het terras, de binnenste is de gevel van de gebedszaal erboven.
const OUTER_ARC = { c: [-0.75, 4.2], r: 13.8 };
const WALL_ARC = { c: [-0.75, -9.7], r: 26 };
const arcV = (arc, u) => arc.c[1] + Math.sqrt(arc.r ** 2 - (u - arc.c[0]) ** 2);
const arcPts = (arc, u0, u1, n) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = u0 + ((u1 - u0) * i) / n;
    return [u, arcV(arc, u)];
  });
// Zijtorens (AHN: 3,4 m breed): u-bereik, minaretvoet, zuidwand en noordhoek (de schuine voorkant loopt van de buitenhoek naar de binnenkant).
const TOWER_L = { u0: -11.2, u1: -7.8, minaret: [-9.5, 16.5] };
const TOWER_R = { u0: 6.2, u1: 9.6, minaret: [7.9, 16.5] };
const TOWER_S = 14.7;
const TOWER_N = 18.5;
const TOWER_Z = 14.5; // loodrechte wanden tot hier, daarboven de schuin toelopende top tot de minaretvoet
const TOWER_TOP = 27.5;

// Dak en gebedszaal: DSM-rand (west en zuid 1,7 m buiten de BAG), oost en noord volgens BAG en AHN.
const ROOF_Z = 10.55;
const RIM = { width: 0.9, height: 0.3 };
const HALL_POLY = [
  [-12.35, -16.2], [-9, -19.6], [5.5, -19.6], [8.7, -16.4], [8.7, -10.8], [12.35, -10], [11.05, -4.2], [11.05, 12.4], [9, 12.4], [9, TOWER_S],
  [6.3, TOWER_S], ...arcPts(WALL_ARC, 6.3, -7.9, 24), [-7.9, TOWER_S], [-12.35, TOWER_S],
];

// De grote koepel op een achthoekige tamboer: platte vlakken op 8,4 m (kruisrichtingen) en 8,8 m (diagonalen) van het hart.
const DC = [-1.0, -6.0];
const TAMBOER = { flat: 8.4, diag: 8.8, top: 12.0, cornice: [12.4, 12.9], corniceOut: 0.4 };
// Gemeten radiaal profiel [straal, hoogte] uit het AHN-DSM, hals op r = 8,0 m tot +14,8 m.
const DOME = {
  neck: { r: 8, z0: 12.6, z1: 14.8 },
  profile: [[8, 14.8], [7, 17.1], [6, 18.6], [5, 19.6], [4, 20.3], [3, 20.8], [2, 21.1], [1, 21.4], [0, 21.6]],
};
// Halve koepels tegen de vier diagonale zijden van de tamboer (bolkap met het hart op het platte vlak).
const HALF_DOME = { radius: 2.6, height: 1.2 };
// Kleine koepels: bolkap op een trommel die 0,25 m breder is dan de koepel, rondom een ronde uitsparing in het dak.
const SMALL_DOMES = [
  { c: [-6.1, 5.4], r: 1.7, h: 1.05 },
  { c: [-0.9, 5.3], r: 2.5, h: 2.25 },
  { c: [4.3, 5.4], r: 1.7, h: 1.05 },
  { c: [-0.9, 12.6], r: 2.5, h: 2.25 },
];
const DRUM = { extra: 0.25, h: 0.5, groove: 0.9, grooveDepth: 0.5 };
// Terras voor de voorgevel met galerij en balustrade.
const TERRACE_Z = 3.0;
const BALUSTRADE = { w: 0.9, h: 0.45 };
const ARCADE = { pier: 3.7, opening: 4.82, w: 1.0, h: 1.5 }; // hoeken in graden om het hart van de buitenste boog, breedte en rechte hoogte van een opening
// Minaretten: 40 m, balkons op 27,5 en 33 m.
const MINARET_TOP = 40;
// Maaiveld (AHN NAP -1,0 tot -0,9 m) rond de moskee.
const GROUND_SAMPLES = [[-16, 0], [-16, -12], [0, -24], [0, 26]];

// ---------- bouwstenen ----------
// Bolkap met voetstraal `radius`, hoogte `height` boven het vlak z = base.
const cap = ([cx, cy], base, radius, height) => {
  const sphereR = (radius * radius + height * height) / (2 * height);
  const sphere = Manifold.sphere(sphereR, 96).translate([cx, cy, base + height - sphereR]);
  return Manifold.intersection([sphere, box(cx - radius - 1, cx + radius + 1, cy - radius - 1, cy + radius + 1, base - 0.01, base + height + 1)]);
};
// Nis met een puntdak van 48 graden (een kleine breedte w, rechte hoogte h) langs +Y van y0 tot y1, onderkant op z = 0.
const niche = (w, h, y0, y1) =>
  profileY([[-w / 2, 0], [w / 2, 0], [w / 2, h], [0, h + 0.56 * w], [-w / 2, h]], y0, y1);
// Zet een nis die naar +Y kijkt op punt [x, y, z], gedraaid zodat +Y naar `heading` graden (0 = +Y, positief naar +X) wijst.
const placeNiche = (cutter, [x, y, z], headingDeg) => cutter.rotate([0, 0, -headingDeg]).translate([x, y, z]);
// Achthoek om DC met platte vlakken op 0, 45, 90, ... graden; `grow` schuift alle vlakken naar buiten.
const octagon = (flat, diag, grow = 0) => {
  const line = (k) => [Math.cos((k * Math.PI) / 4), Math.sin((k * Math.PI) / 4), (k % 2 === 0 ? flat : diag) + grow];
  return Array.from({ length: 8 }, (_, k) => {
    const [ax, ay, ad] = line(k);
    const [bx, by, bd] = line(k + 1);
    const det = ax * by - ay * bx;
    return [DC[0] + (ad * by - bd * ay) / det, DC[1] + (ax * bd - bx * ad) / det];
  });
};
const octa = (grow = 0) => octagon(TAMBOER.flat, TAMBOER.diag, grow);
// Kegelstomp (bijvoorbeeld voor minaretten): straal r0 op z, straal r1 op z + h.
const stump = ([cx, cy], z, r0, r1, h) => Manifold.cylinder(h, r0, r1, 32).translate([cx, cy, z]);

// ---------- gebedszaal met dakrand, nissen in de gevel en ronde uitsparingen ----------
const hallSection = new CrossSection([ccw(HALL_POLY)]);
let hall = prism(HALL_POLY, BASE, ROOF_Z);
const rim = Manifold.extrude(hallSection.subtract(hallSection.offset(-RIM.width, "Miter")), RIM.height + 0.05).translate([0, 0, ROOF_Z - 0.05]);

// Pijlers en openingen van de galerij: hoeken om het hart van de buitenste boog, 0 graden is naar +Y.
const pitch = ARCADE.pier + ARCADE.opening;
const pierAngles = [-3, -2, -1, 0, 1, 2, 3].map((k) => k * pitch);
const openingAngles = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((k) => k * pitch);
const onArc = (arc, r, thetaDeg) => [
  arc.c[0] + r * Math.sin((thetaDeg * Math.PI) / 180),
  arc.c[1] + r * Math.cos((thetaDeg * Math.PI) / 180),
];

// Nissen in de gevel boven het terras (boven elke opening van de galerij), 1,0 m diep.
const facadeNiches = openingAngles.map((a) => {
  const [u] = onArc(OUTER_ARC, OUTER_ARC.r, a);
  const v = arcV(WALL_ARC, u);
  const heading = deg(Math.asin((u - WALL_ARC.c[0]) / WALL_ARC.r));
  return placeNiche(niche(1.1, 2.8, -1.0, 0.6), [u, v, 4.6], heading);
});
hall = hall.subtract(Manifold.union(facadeNiches));

// Ronde uitsparing (0,9 m breed, 0,5 m diep) rond de trommel van elke kleine koepel, niet in de dakrand, de tamboer of de buurtrommels.
const roofInside = prism(hallSection.offset(-(RIM.width + 0.2), "Miter").toPolygons()[0], ROOF_Z - 2, ROOF_Z + 2);
const halfDomeCentres = [1, 3, 5, 7].map((k) => [DC[0] + TAMBOER.diag * Math.cos((k * Math.PI) / 4), DC[1] + TAMBOER.diag * Math.sin((k * Math.PI) / 4)]);
const tamboerKeepOut = Manifold.union([
  prism(octa(0.6), ROOF_Z - 2, ROOF_Z + 2),
  ...halfDomeCentres.map((c) => cylinder(c, HALF_DOME.radius + 0.2, ROOF_Z - 2, ROOF_Z + 2, 64)),
]);
const drumRadius = (d) => d.r + DRUM.extra;
for (const d of SMALL_DOMES) {
  const ring = Manifold.cylinder(DRUM.grooveDepth + 1, drumRadius(d) + DRUM.groove, drumRadius(d) + DRUM.groove, 48)
    .translate([d.c[0], d.c[1], ROOF_Z - DRUM.grooveDepth])
    .subtract(Manifold.cylinder(DRUM.grooveDepth + 3, drumRadius(d), drumRadius(d), 48).translate([d.c[0], d.c[1], ROOF_Z - DRUM.grooveDepth - 1]));
  const others = SMALL_DOMES.filter((o) => o !== d).map((o) => cylinder(o.c, drumRadius(o) + 0.2, ROOF_Z - 2, ROOF_Z + 2, 64));
  hall = hall.subtract(ring.intersect(roofInside).subtract(tamboerKeepOut).subtract(Manifold.union(others)));
}

// ---------- tamboer, hals, grote koepel en halve koepels ----------
const tamboer = Manifold.union([
  prism(octa(), ROOF_Z - 0.3, TAMBOER.top - 0.1),
  // kroonlijst: schuine onderkant (0,4 m uit over 0,5 m hoogte) en een rechte band
  Manifold.hull([...octa().map(([x, y]) => [x, y, TAMBOER.top - 0.1]), ...octa(TAMBOER.corniceOut).map(([x, y]) => [x, y, TAMBOER.cornice[0]])]),
  prism(octa(TAMBOER.corniceOut), TAMBOER.cornice[0], TAMBOER.cornice[1]),
]);
let bigDome = Manifold.revolve(
  new CrossSection([ccw([[0, DOME.neck.z0], [DOME.neck.r, DOME.neck.z0], ...DOME.profile])]),
  96,
);
// Vensters in de hals: 16 nissen van 0,9 m breed, 0,45 m diep.
const neckCutters = Array.from({ length: 16 }, (_, k) => {
  const phi = ((k * 22.5 + 11.25) * Math.PI) / 180;
  return placeNiche(niche(0.9, 0.6, -0.45, 0.8), [DOME.neck.r * Math.cos(phi), DOME.neck.r * Math.sin(phi), 13.3], 90 - deg(phi));
});
bigDome = bigDome.subtract(Manifold.union(neckCutters)).translate([DC[0], DC[1], 0]);
const halfDomes = [1, 3, 5, 7].map((k) => {
  const phi = (k * Math.PI) / 4;
  const c = [DC[0] + TAMBOER.diag * Math.cos(phi), DC[1] + TAMBOER.diag * Math.sin(phi)];
  return cap(c, ROOF_Z - 0.01, HALF_DOME.radius, HALF_DOME.height + 0.01);
});

// ---------- kleine koepels op trommels ----------
const smallDomes = SMALL_DOMES.map((d) =>
  Manifold.union([
    cylinder(d.c, drumRadius(d), ROOF_Z - 0.01, ROOF_Z + DRUM.h),
    cap(d.c, ROOF_Z + DRUM.h - 0.01, d.r, d.h + 0.01),
  ]),
);

// ---------- terras en galerij voor de gebogen voorgevel ----------
const terraceU = [-7.9, 6.3];
const terraceOuter = arcPts(OUTER_ARC, terraceU[1], terraceU[0], 24);
const terraceInner = arcPts({ c: WALL_ARC.c, r: WALL_ARC.r - 0.12 }, terraceU[0], terraceU[1], 24);
let gallery = prism([...terraceOuter, ...terraceInner], BASE, TERRACE_Z);
// Openingen met een puntdak van 48 graden, 2,6 m diep gerekend vanaf de buitenste boog tot de gevel erachter.
const openings = openingAngles.map((a) => {
  const [u, v] = onArc(OUTER_ARC, OUTER_ARC.r, a);
  return placeNiche(niche(ARCADE.w, ARCADE.h, -2.6, 0.8), [u, v, 0], a);
});
gallery = gallery.subtract(Manifold.union(openings));
// Balustrade langs de buitenrand van het terras, met een rij bolkoepeltjes (1,3 m) boven de pijlers.
const balustradeOuter = arcPts(OUTER_ARC, terraceU[1], terraceU[0], 24);
const balustradeInner = arcPts({ c: OUTER_ARC.c, r: OUTER_ARC.r - BALUSTRADE.w }, terraceU[0], terraceU[1], 24);
const balustrade = prism([...balustradeOuter, ...balustradeInner], TERRACE_Z - 0.3, TERRACE_Z + BALUSTRADE.h);
const terraceDomes = pierAngles.map((a) => {
  const c = onArc(OUTER_ARC, OUTER_ARC.r - 0.75, a);
  return Manifold.union([cylinder(c, 0.65, TERRACE_Z - 0.05, TERRACE_Z + BALUSTRADE.h), cap(c, TERRACE_Z + BALUSTRADE.h - 0.01, 0.65, 0.66)]);
});

// ---------- zijtorens en minaretten ----------
const circlePts = ([cx, cy], r, n = 32) =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)]);
const tower = (t, side) => {
  // Voetafdruk (BAG): buitenwand, schuine voorkant naar de binnenwand, zuidwand 0,1 m in de gebedszaal.
  const outer = side === "L" ? t.u0 : t.u1;
  const inner = side === "L" ? t.u1 : t.u0;
  const foot = [[outer, TOWER_S - 0.1], [inner, TOWER_S - 0.1], [inner, 16.5], [outer, TOWER_N]];
  let body = prism(foot, BASE, TOWER_Z);
  // Nis in de buitenwand (de panelen van de zijtoren): 2 m breed, tot +13,3 m.
  const faceU = outer;
  const nicheCut = niche(2.0, 7.2, -0.5, 0.6).rotate([0, 0, side === "L" ? 90 : -90]).translate([faceU, 16.5, 5]);
  body = body.subtract(nicheCut);
  // Schuin toelopende top: van de voetafdruk op TOWER_Z naar de minaretvoet op TOWER_TOP.
  const wedge = Manifold.hull([
    ...foot.map(([x, y]) => [x, y, TOWER_Z - 0.01]),
    ...circlePts(t.minaret, 1.62).map(([x, y]) => [x, y, TOWER_TOP]),
  ]);
  return Manifold.union([body, wedge]);
};
// Minaret als omwentelingsprofiel [straal, hoogte]: schuine onderkant van het eerste balkon, schacht,
// tweede balkon, bovenschacht en spits.
const MINARET_PROFILE = [
  [0, TOWER_TOP - 0.01], [1.6, TOWER_TOP - 0.01], [1.85, 27.85], [1.85, 28.75], [0.95, 29.5], [0.95, 33], [1.2, 33.4], [1.2, 34], [0.9, 34.5], [0.12, MINARET_TOP], [0, MINARET_TOP],
];
const minaret = ([cx, cy]) => Manifold.revolve(new CrossSection([ccw(MINARET_PROFILE)]), 32).translate([cx, cy, 0]);

const complex = Manifold.union([
  hall,
  rim,
  tamboer,
  bigDome,
  ...halfDomes,
  ...smallDomes,
  gallery,
  balustrade,
  ...terraceDomes,
  tower(TOWER_L, "L"),
  tower(TOWER_R, "R"),
  minaret(TOWER_L.minaret),
  minaret(TOWER_R.minaret),
]);
const nodes = [["building:moskee", complex]];
const all = complex;

const META = {
  name: "Mevlana Moskee",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0599100000652535"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (89956,73, 437396,58), het zwaartepunt van het BAG-pand, op het maaiveld (NAP -1,0 m), +X naar het noordoosten (53,25 graden vanaf de RD-X-as) en +Y loodrecht daarop. Eén node building:moskee: de gebedszaal met een vlak dak op +10,55 m en een dakrand, de grote koepel (19,2 m doorsnee, top +21,6 m) op een achthoekige tamboer met kroonlijst, hals en vier halve koepels, vier kleine koepels op trommels in ronde uitsparingen, de gebogen voorgevel met een galerij, een terras en een rij bolkoepeltjes, twee zijtorens van +14,5 m met een schuin toelopende top en twee minaretten van +40 m met balkons op 27,5 en 33 m. Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog, staan verticaal of hellen onder 45 graden. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    hallRoofM: ROOF_Z,
    domeTopM: DOME.profile[DOME.profile.length - 1][1],
    domeDiameterM: DOME.profile[0][0] * 2 + 0.4,
    tamboerTopM: TAMBOER.cornice[1],
    smallDomeTopM: +(ROOF_Z + DRUM.h + SMALL_DOMES[1].h).toFixed(2),
    terraceM: TERRACE_Z,
    towerM: TOWER_Z,
    minaretTopM: MINARET_TOP,
    minaretBalconyM: TOWER_TOP,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Mevlana_Moskee",
    "PDOK BAG pand 0599100000652535, EPSG:28992",
    "PDOK AHN DSM/DTM 0,25 m via WCS: het dak, de koepels, de tamboer, het terras, de zijtorens, de minaretten en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR)",
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
