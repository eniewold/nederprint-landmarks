// Genereert een gedetailleerd, gesloten 3D-model van de Grote of
// Sint-Jacobskerk in Den Haag, opgebouwd uit dakvlakken en bouwdelen (geen
// hoogteveld en geen lagen): de hallenkerk (schip met twee zijbeuken) onder
// kruisdaken, namelijk een langsnok boven het schip en drie dwarse zadeldaken
// over de volle breedte met kilgoten ertussen; de westtravee met langse
// zijbeukdaken; het hoge basilicale koor met vijfzijdige sluiting (hoekdaken) en
// kooromgang met lessenaarsdak; twee straalkapellen; de zeskantige toren met
// hoekbeer, schaftdak, lantaarn en spits; het dakruitertje, het trappentorentje,
// de steunberen en de lage aanbouwen. Elk dakvlak is een planvergelijking op een
// rechthoek of veelhoek (profiel of afgesneden prisma). Het Mapbox-model is niet
// gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-grote-kerk-den-haag.mjs              # 1:1000 (standaard)
//   node scripts/generate-grote-kerk-den-haag.mjs --scale 2000
//
// Assenstelsel van het model: oorsprong op RD (80961,30, 454897,72), het
// zwaartepunt van het BAG-pand, op maaiveldniveau (NAP +3,2 m), Z omhoog. +X
// loopt naar het oosten (11,75 graden tegen de klok in vanaf de RD-X-as) en +Y
// loodrecht daarop naar het noorden. De kerk zelf ligt 2,7 graden rechtsom
// gedraaid ten opzichte van die as (de nokken en de gevels van het AHN lopen
// onder die hoek): alle maten hieronder staan in het kerkstelsel (s langs het
// schip naar het oosten, t dwars naar het noorden, z boven het maaiveld) en het
// gebouw wordt aan het eind om de oorsprong gedraaid. In het kerkstelsel staat de
// toren in het westen (zeshoek met middelpunt (-38,55; 2,25), straal 8,6 m en de
// punten naar het noorden en zuiden), de hal in het midden (t -14,9 tot 19,65 m,
// schip op t 2,35 m, drie traveeen van 13,35 m en een westtravee van 9 m) en het
// koor in het oosten (s 16,5 tot 49 m, as op t 2,0 m).
//
// Bronnen: PDOK BAG-pand 0518100000269743 (de kerk met toren en kapellen);
// AHN DSM/DTM 0,5 m (PDOK WCS): nok-, goot- en hellingsvlakken per bouwdeel
// (vlakfits op honderden meetcellen), de ringprofielen van de toren en het
// maaiveld (NAP +3,1 tot +3,3 m); 3D BAG (LoD2.2-daken van het pand) voor de lage
// aanbouwen onder de bomen aan de zuidzijde, waar het DSM de kruinen meet;
// Wikipedia (middenbeuk 12 m, vijfzijdig priesterkoor met kooromgang, toren
// 92,5 m); PDOK luchtfoto. Geschat: de dakhelling onder de leien waar het DSM
// gaten heeft (gelijk gehouden aan het meetbare deel van het vlak), de hoogte van
// de steunberen en de vorm van de lage aanbouwen. Weggelaten: de spitsnaald boven
// +80,4 m (Wikipedia geeft 92,5 m; het AHN en de 3D BAG zien hem niet en hij is
// dunner dan 0,9 m), de pinakels, de vensters en alle gevelreliëf.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-den-haag");
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
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);

const SLUG = "grote-kerk-den-haag";

// ---------- maten (kerkstelsel, z = hoogte boven het maaiveld op NAP 3,2 m) ----------
const GROUND_NAP = 3.2;
const ORIGIN = [80961.3, 454897.72];
const X_AXIS = [0.979045, 0.203642]; // RD-richting 11,75 graden
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// De kerk ligt 2,7 graden rechtsom van de modelas (RD-richting 9,05 graden).
const TURN = -2.7;

// Hal: schip (middenbeuk, 13,35 m tussen de goten) met twee zijbeuken. De
// dwarsdaken lopen over de volle breedte; de langsnok van het schip kruist ze.
const AXIS_T = 2.35; // hart van schip en hal
const HALL = { t0: -14.9, t1: 19.65 }; // zij- en kopgevels (zuid, noord)
const BAY = 13.35; // travee (nok tot nok van de dwarsdaken)
const RIDGES = [-16.75, -3.4, 9.95]; // s van de dwarsnokken
const Z_RIDGE = 23.65; // nokken van schip, dwarsdaken en westtravee
const Z_GUTTER = 13.9; // vlakke goten tussen de daken
const RUN = 6.375; // horizontale afstand van nok tot goot (helling 1,53)
const OVERLAP = 0.01; // aangrenzende stukken laten 1 cm overlappen
const S_NAVE_W = -36.5; // het schipdak loopt tot in de toren door
const S_CHOIR = 16.5; // oostelijke dakrand van het schip = westwand van het koor
const S_WEST = -32.6; // westgevels van de zijbeuken

// Koor: hoog schip (nok +34,05 m) met 5/10-sluiting en kooromgang eromheen.
const CH_T = 2.0; // hart van het koor
const APSE = [35.0, CH_T]; // middelpunt van de sluiting
const R_HIGH = 7.3; // halve breedte van het hoge koor
const R_AMB = 13.45; // halve breedte over de kooromgang
const Z_CH_RIDGE = 34.05;
const CH_SLOPE = 1.45;
const Z_CH_EAVE = Z_CH_RIDGE - CH_SLOPE * R_HIGH; // 23,5 m
const Z_AMB_IN = 18.0; // lessenaarsdak van de kooromgang: tegen de koorwand ...
const Z_AMB_OUT = 12.8; // ... en bij de buitenmuur

// Toren: zeshoek met de punten naar het noorden en zuiden (vlakke zijden naar west en oost).
const TOWER = { c: [-38.55, 2.25], r: 8.6, shaft: 54.7 };
// Schaftdak, lantaarn en spits als (hoogte, straal van de zeshoek), uit de mediaan van het DSM per ring; AHN-top +80,4 m.
const SPIRE = [[54.6, 7.25], [61.4, 4.5], [62.5, 4.2], [66.5, 3.8], [69.6, 3.0], [72.7, 2.3], [76.3, 1.6], [78.3, 1.0], [80.4, 0.55]];
const Z_TOP = 80.4;
// Hoekbeer van de toren: trapsgewijs smaller naar boven, (straal, hoogte) van de buitenrand.
const TOWER_BUTTRESS = [[10.0, BASE], [10.0, 8.0], [9.5, 8.0], [9.5, 17.0], [9.0, 17.0], [9.0, 26.0], [8.4, 26.0]];

// BAG-contour (u, v in het modelstelsel), op 0,3 m vereenvoudigd.
const FOOTPRINTS = [[[-47.02,8.44],[-46.12,9.94],[-44.57,9.02],[-39.19,11.89],[-39.15,13.61],[-37.70,13.60],[-37.67,17.12],[-34.90,18.54],[-32.08,17.64],[-31.96,20.07],[-33.22,20.20],[-33.11,21.20],[-31.71,21.32],[-31.64,22.56],[-30.63,22.53],[-30.69,21.27],[-28.76,21.18],[-28.70,22.39],[-25.21,22.23],[-25.26,20.99],[-22.93,20.87],[-22.86,22.08],[-21.87,22.03],[-21.92,20.64],[-9.60,20.19],[-9.56,21.39],[-8.55,21.35],[-8.62,20.27],[4.20,19.40],[4.29,20.63],[5.28,20.56],[5.25,19.30],[9.33,19.07],[9.40,20.25],[12.89,20.05],[12.83,18.80],[14.31,18.76],[14.38,21.28],[16.38,21.23],[15.82,21.88],[16.64,22.61],[17.69,21.40],[26.39,20.97],[27.55,21.99],[28.27,21.17],[27.11,20.16],[27.03,19.02],[31.07,18.79],[30.85,15.32],[31.36,15.30],[31.29,14.03],[36.60,13.78],[36.94,14.92],[37.82,14.66],[37.53,13.47],[38.72,13.01],[40.07,16.44],[43.16,15.19],[41.82,11.79],[43.34,11.19],[44.18,12.15],[44.93,11.49],[44.10,10.56],[48.23,4.22],[49.41,4.57],[49.70,3.60],[48.53,3.26],[47.98,-4.36],[49.12,-4.91],[48.69,-5.82],[47.52,-5.25],[42.77,-11.08],[43.40,-12.09],[42.62,-12.59],[41.95,-11.56],[35.97,-13.19],[36.13,-14.41],[35.19,-14.53],[35.03,-13.33],[30.03,-12.97],[29.95,-14.21],[29.44,-14.18],[29.20,-17.32],[24.90,-17.01],[24.79,-18.47],[25.78,-19.66],[24.95,-20.35],[23.99,-19.22],[15.95,-18.81],[11.72,-22.48],[-10.79,-21.36],[-10.86,-22.34],[-11.44,-22.31],[-11.41,-21.42],[-14.27,-21.22],[-14.33,-22.12],[-14.91,-22.08],[-14.85,-21.20],[-17.32,-21.05],[-17.38,-21.94],[-17.96,-21.92],[-17.89,-21.02],[-20.35,-20.87],[-20.40,-21.76],[-20.98,-21.72],[-20.93,-20.84],[-23.76,-20.67],[-23.80,-21.55],[-24.39,-21.52],[-24.35,-20.81],[-33.04,-20.28],[-33.07,-21.06],[-39.45,-20.69],[-38.80,-5.31],[-39.71,-5.23],[-39.69,-3.51],[-44.88,-0.26],[-46.40,-1.08],[-47.21,0.46],[-45.68,1.32],[-45.49,7.52]]];
// Maaiveld (AHN NAP +3,1 tot +3,3 m) rond het gebouw (modelstelsel).
const GROUND_SAMPLES = [[-50, 0], [-50, 15], [0, -22], [40, 18]];

// ---------- bouwdelen ----------
// Gelijkbenig dakprofiel [coordinaat, z]: wanden tot de goot, dan twee vlakken naar de nok.
const gable = (c, half, zEave, zRidge, run, half0 = half) => [
  [c - half0, BASE],
  [c + half, BASE],
  [c + half, zEave],
  [c + run, zEave],
  [c, zRidge],
  [c - run, zEave],
  [c - half0, zEave],
];
// Prisma boven een convexe veelhoek (ccw of cw), afgesneden door een dakvlak per zijde:
// z = zEave + helling * (afstand tot die zijde). Zijden in `skip` krijgen geen vlak (wand of kopgevel).
const hipPrism = (pts, zEave, slope, zTop, skip = []) => {
  const poly = ccw(pts);
  let solid = prism(poly, BASE, zTop);
  poly.forEach(([x0, y0], i) => {
    if (skip.includes(i)) return;
    const [x1, y1] = poly[(i + 1) % poly.length];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const nx = -(y1 - y0) / len; // naar binnen (links van de zijde)
    const ny = (x1 - x0) / len;
    const a = slope * nx;
    const b = slope * ny;
    const c = zEave - slope * (x0 * nx + y0 * ny);
    const n = Math.hypot(a, b, 1);
    solid = solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
  });
  return solid;
};
// Houdt het deel onder het vlak z = a s + b t + c.
const trimBelow = (solid, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Zeshoek met de punten naar +t en -t.
const hexPts = (cx, cy, r) => [90, 150, 210, 270, 330, 30].map((d) => [cx + r * Math.cos((d * Math.PI) / 180), cy + r * Math.sin((d * Math.PI) / 180)]);
// Halve tienhoek (vijfzijdige sluiting) met de rechte zijden vanaf s0: [s0, t-r] ... [s0, t+r].
const apsePts = (r, s0) => {
  const [cx, cy] = APSE;
  const arc = [-90, -54, -18, 18, 54, 90].map((d) => [cx + r * Math.cos((d * Math.PI) / 180), cy + r * Math.sin((d * Math.PI) / 180)]);
  return [[s0, cy - r], ...arc, [s0, cy + r]];
};
// Trapsgewijs vernauwende zeshoeken: elk niveau [z, straal] met het volgende verbonden door een convexe romp.
const loft = (cx, cy, levels) => {
  const solids = [];
  for (let i = 0; i + 1 < levels.length; i++) {
    const [z0, r0] = levels[i];
    const [z1, r1] = levels[i + 1];
    const lo = hexPts(cx, cy, r0).map(([x, y]) => [x, y, z0]);
    const hi = r1 > 0 ? hexPts(cx, cy, r1).map(([x, y]) => [x, y, z1]) : [[cx, cy, z1]];
    solids.push(Manifold.hull([...lo, ...hi]));
  }
  return Manifold.union(solids);
};

const pieces = [];

// -- Hal: dwarsdaken, langsnok van het schip en de westtravee --
const HW = BAY / 2 + OVERLAP; // halve breedte van een dwarsdak inclusief overlap
for (const sr of RIDGES) pieces.push(profileY(gable(sr, HW, Z_GUTTER, Z_RIDGE, RUN), HALL.t0, HALL.t1));
pieces.push(profileX(gable(AXIS_T, HW, Z_GUTTER, Z_RIDGE, RUN), S_NAVE_W, S_CHOIR + 0.25));
// Westtravee: langse zijbeukdaken (nok op het hart van de zijbeuk, steiler: 9,75 m rijzing over 4,9 m).
const S_WB_E = RIDGES[0] - BAY / 2; // kilgoot tussen westtravee en eerste dwarsdak
const aisleS = [HALL.t0, AXIS_T - BAY / 2 + OVERLAP];
const aisleN = [AXIS_T + BAY / 2 - OVERLAP, HALL.t1];
for (const [t0, t1] of [aisleS, aisleN]) {
  pieces.push(profileX(gable((t0 + t1) / 2, (t1 - t0) / 2, Z_GUTTER, Z_RIDGE, 4.9), S_WEST, S_WB_E + 0.1));
}

// -- Steunberen langs de noordgevel van de hal: onder 1 m x 1,3 m, met schuine kop --
for (const s of [-32.2, -23.4, -10.05, 3.8]) {
  pieces.push(profileX([[HALL.t1 - 0.2, BASE], [20.8, BASE], [20.8, 8.5], [HALL.t1 - 0.2, 11.6]], s - 0.55, s + 0.55));
}
pieces.push(box(-29.7, -26.2, HALL.t1 - 0.2, 21.0, BASE, 4.4)); // trappenhuis/portaal in de westtravee
pieces.push(box(8.4, 11.9, HALL.t1 - 0.2, 20.7, BASE, 3.0));
pieces.push(box(14.0, 15.6, 19.0, 21.4, BASE, 20.6)); // trappentorentje bij de noordoosthoek van de hal

// -- Zuidzijde: lage kapellenrij langs de zuidgevel, drie delen onder zadeldaken met de nok langs s --
// (profiel [t, z]: buitenmuur op t -22, goot tegen de zuidgevel; hoogtes uit het 3D BAG-dakmodel en het DSM)
const southGallery = (profile, s0, s1) => profileX([[HALL.t0 + 0.2, BASE], [-22.0, BASE], ...profile, [HALL.t0 + 0.2, profile[profile.length - 1][1]]], s0, s1);
pieces.push(southGallery([[-22.0, 7.3], [-18.8, 11.2], [-15.55, 7.3]], -22.7, -9.4));
pieces.push(southGallery([[-22.0, 4.1], [-19.3, 7.6], [-16.4, 3.7]], -9.5, 17.0));
pieces.push(box(-28.6, -22.6, -22.0, HALL.t0 + 0.2, BASE, 6.4));

// -- Aanbouwen in het zuidwesten en noordwesten --
// Zuidwest: zadeldak (nok +12,1 m op t -17,7), aan de westkant afgeschuind (helling 1,2).
pieces.push(trimBelow(profileX(gable(-17.8, 4.6, 8.2, 12.1, 4.5), -38.5, -28.5), 1.2, 0, 8.2 + 1.2 * 38.5));
pieces.push(box(-38.4, S_WEST + 0.1, -13.3, -3.7, BASE, 6.3));
// Noordwest: zadeldak met nok langs t op s -35,55 (+6,9 m).
pieces.push(profileY(gable(-35.55, 3.0, 3.9, 6.9, 2.9), 8.95, 17.0));

// -- Koor: hoog schip met hoekige sluiting, kooromgang, kapellen --
{
  const high = apsePts(R_HIGH, S_CHOIR + 0.1);
  const out = apsePts(R_AMB, S_CHOIR - 0.1);
  // Hoog koor: dakvlakken op beide lange zijden en op de vijf zijden van de sluiting (de westwand blijft een kopgevel).
  pieces.push(hipPrism(high, Z_CH_EAVE, CH_SLOPE, Z_CH_RIDGE + 1, [high.length - 1]));
  // Kooromgang: lessenaarsdak van de buitenmuur naar de koorwand (convexe romp van twee gelijkvormige veelhoeken).
  pieces.push(prism(out, BASE, Z_AMB_OUT));
  pieces.push(Manifold.hull([...out.map(([x, y]) => [x, y, Z_AMB_OUT]), ...apsePts(R_HIGH, S_CHOIR - 0.1).map(([x, y]) => [x, y, Z_AMB_IN])]));
  // Steunberen op de hoeken van de buitenmuur van de sluiting.
  const [cx, cy] = APSE;
  for (const d of [-54, -18, 18, 54]) {
    const bx = profileY([[R_AMB - 0.6, BASE], [R_AMB + 1.1, BASE], [R_AMB + 1.1, 9.5], [R_AMB - 0.6, 12.4]], -0.65, 0.65);
    pieces.push(bx.rotate([0, 0, d]).translate([cx, cy, 0]));
  }
  // Straalkapellen noord en zuid van de kooromgang: dwarse zadeldaken (nok langs t).
  pieces.push(profileY(gable(21.35, 4.55, Z_GUTTER, 19.8, 4.0, 4.8), CH_T + R_AMB - 0.05, 22.1));
  pieces.push(profileY(gable(21.1, 4.6, Z_GUTTER, 19.3, 4.0, 4.55), -18.0, CH_T - R_AMB + 0.05));
  // Lage aanbouwen: noordkant, zuidkant (lessenaarsdak) en bij de noordoosthoek van de omgang.
  const tN = CH_T + R_AMB;
  const tS = CH_T - R_AMB;
  // Op s 26 tot 30,5 springt de omgang aan beide zijden 1,5 m uit; erachter een klein zadeldak (nok langs t).
  pieces.push(profileX([[tN - 0.05, BASE], [tN + 1.6, BASE], [tN + 1.6, 11.6], [tN - 0.05, Z_AMB_OUT]], 26.1, 30.5));
  pieces.push(profileX([[tS - 1.6, BASE], [tS + 0.05, BASE], [tS + 0.05, Z_AMB_OUT], [tS - 1.6, 11.6]], 26.1, 30.5));
  pieces.push(profileY(gable(28.2, 2.1, 4.0, 6.1, 2.0), tN + 1.5, 20.4));
  pieces.push(profileY(gable(28.2, 2.1, 3.7, 7.0, 2.0), -16.2, tS - 1.5));
  pieces.push(prism([[38.1, 13.9], [39.3, 18.3], [42.4, 17.2], [41.2, 12.9]], BASE, 6.2));
  // Blok in de oksel van het zuidelijke straalkapel en de hal.
  pieces.push(box(13.3, 16.9, -18.4, HALL.t0 + 0.2, BASE, 13.5));
  // Trappentorentje aan de noordwesthoek van het koor en dakruiter op de nok.
  pieces.push(box(S_CHOIR, 19.0, CH_T + R_HIGH - 0.05, 11.7, BASE, 27.0));
  pieces.push(Manifold.hull([[S_CHOIR, 9.25, 27.0], [19.0, 9.25, 27.0], [19.0, 11.7, 27.0], [S_CHOIR, 11.7, 27.0], [17.8, 10.5, 29.5]]));
  pieces.push(loft(18.9, CH_T, [[29.5, 2.1], [33.0, 2.1], [41.2, 0]]));
}

// -- Toren: zeskantige schacht met hoekbeer, schaftdak, lantaarn en spits --
{
  const [cx, cy] = TOWER.c;
  pieces.push(prism(hexPts(cx, cy, TOWER.r), BASE, TOWER.shaft));
  pieces.push(loft(cx, cy, SPIRE));
  // Hoekbeer op de zes hoeken: 1,8 m breed, met vier versnijdingen tot +26 m.
  for (const d of [90, 150, 210, 270, 330, 30]) {
    const bx = profileY([[TOWER.r - 1.4, BASE], ...TOWER_BUTTRESS, [TOWER.r - 1.4, 26.0]], -0.9, 0.9);
    pieces.push(bx.rotate([0, 0, d]).translate([cx, cy, 0]));
  }
}

// ---------- gebouw ----------
// Alles in het kerkstelsel samenvoegen, draaien naar het modelstelsel en op de BAG-contour (0,5 m ruimer) begrenzen.
const church = Manifold.union(pieces).rotate([0, 0, TURN]);
const clip = Manifold.union(FOOTPRINTS.map((ring) => Manifold.extrude(new CrossSection([ccw(ring)]).offset(0.5, "Miter", 2), 121).translate([0, 0, BASE - 1])));
const complex = Manifold.intersection(church, clip);
const nodes = [["building:kerk", complex]];
const all = complex;

const META = {
  name: "Grote of Sint-Jacobskerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0518100000269743"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (80961,30, 454897,72), het zwaartepunt van het BAG-pand, op het maaiveld (NAP +3,2 m), +X naar het oosten (11,75 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden; de kerk zelf ligt 2,7 graden rechtsom van die as. Eén node building:kerk uit dakvlakken en bouwdelen: de hallenkerk met kruisdaken (langsnok en drie dwarse zadeldaken tot +23,7 m, goten op +13,9 m) en westtravee, het hoge koor met vijfzijdige sluiting (nok +34 m) met kooromgang en twee kapellen, de zeskantige toren in het westen met schaftdak, lantaarn en spits (tot +80,4 m), steunberen, dakruiter en lage aanbouwen. Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { naveRidgeM: 23.65, choirRidgeM: 34.05, towerTopM: 80.4, groundNapM: 3.2, baseM: -0.5 },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_of_Sint-Jacobskerk_%28Den_Haag%29",
    "PDOK BAG pand 0518100000269743, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nok-, goot- en hellingsvlakken, torenprofiel en maaiveld",
    "3D BAG (api.3dbag.nl) LoD2.2-daken van het pand voor de lage aanbouwen",
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

// Losse delen van het model (genus onder 0 betekent meer dan ��n stuk).
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
