// Genereert een gesloten 3D-model van het Van Gogh Museum in Amsterdam, uit
// bouwdelen en dakvlakken (geen AHN-hoogteveld):
//  - het hoofdgebouw van Rietveld (1973): een stapeling van platte daken op
//    +7,1 m (de lage terrassen rond het gebouw), +13,0 m (westvleugel), +21,0 m
//    (het centrale dak met de lichtstraten), +24,0 m (de trappenhuiskern met
//    versprongen plattegrond) en +26,5 m (een liftkern), met een rij van vier
//    zaagtanden (lichtstraten, +20,0 m) op het zuidwestelijke blok op +18,8 m,
//    een dakopbouw en een rand langs de kern;
//  - de Kurokawavleugel (1999): een exacte ellips (BAG) met zuidelijk een
//    bolvormig titaniumdak (kapje van een bol, straal 128 m, top +14,5 m), een
//    verticale dakrand langs een rechte snede, en noordelijk een lager dak dat als
//    een halve cilinder (straal 69 m) van de snede opwaarts loopt (+4 tot +9 m) met
//    een driehoekige lichtkoker tegen de rand (+11,3 m). Het bolvlak en het
//    cilindervlak zijn uit het AHN-DSM (0,25 m) gefit; de resten zijn 0,08 en 0,09 m.
// Het dak van het hoofdgebouw is alleen uit het DSM afgeleid: de lichtstraten op
// het centrale dak liggen vlak (0,1 m reliëf) en de nieuwe ingangshal van 2015 ligt
// ongeveer op maaiveld, dus die zijn niet apart gemodelleerd. Alle maten in het
// script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-van-gogh-museum.mjs              # 1:1000 (standaard)
//   node scripts/generate-van-gogh-museum.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (120520,94, 485729,13), het zwaartepunt van het
// hoofdgebouw, op maaiveldniveau (NAP +0,6 m), Z omhoog. +X loopt langs de
// gevels van het hoofdgebouw naar het noordoosten (23,25 graden tegen de klok in
// vanaf de RD-X-as) en +Y loodrecht daarop naar het noordwesten, naar de
// Paulus Potterstraat. De Kurokawavleugel ligt aan de zuidkant (v -70 tot -28 m).
//
// Bronnen: PDOK BAG-panden 0363100012098679 (het hoofdgebouw) en
// 0363100012211564 (de Kurokawavleugel, een exacte ellips); AHN DSM/DTM 0,25 m
// (PDOK WCS): de dakhoogtes, de bol- en cilindervlakken en het maaiveld (NAP
// +0,6 m); Wikipedia en de Hans van Heeswijk Architecten (de ingangshal); PDOK
// luchtfoto. Weggelaten: het rasterdak van de lichtstraten (vlak, 0,1 m reliëf),
// de dakranden en de gevelstructuur (onder 0,9 m), de glazen ingangshal van 2015
// (op maaiveld) en het onderaardse deel; het uitsteeksel van de BAG-contour aan de
// oostkant (u 25 tot 29, v 2,6 tot 8,4 m) staat in het DSM op maaiveld en is
// niet gebouwd.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "van-gogh-museum");
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
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

const SLUG = "van-gogh-museum";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP 0,6 m) ----------
const GROUND_NAP = 0.6;
const ORIGIN = [120520.94, 485729.13];
const X_AXIS = [0.918791, 0.394744]; // RD-richting 23,25 graden, langs de gevels van het hoofdgebouw
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Maaiveld (AHN NAP +0,6 m) rond het gebouw.
const GROUND_SAMPLES = [[40, -30], [30, -80], [0, -85], [-35, -40]];

// Convexe wanden en dakvlakken via een hull: een punt-wolk op een concaaf (naar boven
// bolle) dakvlak, plus de onderkant, geeft het volume onder dat vlak.
const surfaceHull = (surfacePoints, ring) =>
  Manifold.hull([...surfacePoints, ...ring.map(([x, y]) => [x, y, BASE])]);
// Schuintrekking z' = z + s * y (een dakvlak dat in y oploopt).
const shearZ = (solid, s) => solid.transform([1, 0, 0, 0, 0, 1, s, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

// ---------- hoofdgebouw (Rietveld, 1973) ----------
// BAG-contour van pand 0363100012098679 (u, v). Het uitsteeksel van de BAG-contour
// aan de oostkant (u 24 tot 29, v 2 tot 9 m) is hier weggelaten: het DSM ziet daar
// maaiveld.
const MAIN_FOOTPRINT = [[25.37,2.31],[23.16,12.34],[23.12,22.84],[8.14,22.78],[5.01,22.77],[5.04,17.37],[-4.33,17.31],[-4.38,27.75],[-10.88,27.72],[-19.95,27.67],[-19.95,27.43],[-24.38,27.43],[-24.38,27.64],[-24.94,27.64],[-24.98,-8.06],[-20.42,-8.04],[-20.42,-25.88],[-9.94,-25.85],[-9.91,-27.97],[25.64,-20.09],[25.62,-12.8],[28.54,-12.15]];
// Daken (hoogte boven het maaiveld, uit de mediaan van het AHN-DSM per vlak dak).
const Z_TERRACE = 7.1; // de lage terrassen rond het gebouw en de oostelijke aanbouw
const Z_WEST = 13.0; // de westvleugel
const Z_SW = 18.8; // het zuidwestelijke blok met de zaagtanden
const Z_MAIN = 21.0; // het centrale dak met de lichtstraten
const Z_CORE = 24.0; // de trappenhuiskern
const Z_LIFT = 26.5; // de liftkern naast het centrale dak
const Z_LEDGE = 15.3; // de verhoogde rand tussen westvleugel en centraal dak
const Z_STRIP = 12.0; // de strook langs de oostgevel van het centrale dak
const Z_TOOTH = 20.0; // de nok van de zaagtanden
const Z_BOX = 20.4; // de dakopbouw op het zuidwestelijke blok

const westWing = Manifold.union([
  box(-25.3, -9.5, -7.4, 27.9, BASE, Z_WEST),
  box(-25.3, -21.0, -8.6, -7.0, BASE, Z_WEST),
  box(-10.2, -4.5, 17.0, 27.9, BASE, Z_WEST),
]);
const mainRoof = box(-10.0, 17.9, -13.3, 17.5, BASE, Z_MAIN);
// Het zuidwestelijke blok met vier zaagtanden (lichtstraten): elke tand heeft een
// verticale noordkant van 1,2 m en een glasvlak dat naar het zuiden afloopt.
const swBlock = box(-20.8, -9.3, -26.2, -7.2, BASE, Z_SW);
const sawTeeth = [
  [-13.0, -17.9, -12.7],
  [-15.5, -17.9, -12.7],
  [-18.0, -17.9, -12.7],
  [-20.5, -17.9, -11.6],
].map(([vNorth, u0, u1]) =>
  profileX([[vNorth, Z_SW - 0.5], [vNorth, Z_TOOTH], [vNorth - 2.2, Z_SW], [vNorth - 2.2, Z_SW - 0.5]], u0, u1),
);
// Dakopbouw (techniek) op het zuidwestelijke blok.
const swBox = box(-14.2, -11.9, -11.8, -8.1, BASE, Z_BOX);
// De kern met de trappenhuizen: een versprongen plattegrond, 10 m breed in het
// zuiden en 5,3 m breed in het noorden; steekt 5 m ten zuiden van het centrale dak uit.
const core = prism([[-10.1, -18.3], [0.5, -18.3], [0.5, -2.5], [-4.6, -2.5], [-4.6, 2.5], [-10.1, 2.5]], BASE, Z_CORE);
const liftCore = box(-12.1, -9.0, 6.8, 10.3, BASE, Z_LIFT);
// De verhoogde rand tegen de westgevel van het centrale dak (1,9 m breed): +15,3 m bij de liftkern,
// naar het zuiden aflopend tot +14,0 m.
const ledge = profileX([[-6.3, BASE], [-6.3, 14.0], [0.2, 15.2], [7.2, Z_LEDGE], [7.2, BASE]], -12.1, -9.6);
// Een smalle verhoogde strook (1,8 m breed, 16 m lang) langs de oostgevel van het centrale dak.
const eastStrip = box(17.5, 20.4, -3.6, 12.6, BASE, Z_STRIP);
const terrace = prism(MAIN_FOOTPRINT, BASE, Z_TERRACE);
const mainBuilding = Manifold.intersection([
  Manifold.union([terrace, westWing, mainRoof, swBlock, swBox, core, liftCore, ledge, eastStrip, ...sawTeeth]),
  prism(MAIN_FOOTPRINT, BASE - 1, 60),
]);

// ---------- Kurokawavleugel (1999) ----------
// De BAG-contour van pand 0363100012211564 is een exacte ellips: middelpunt
// (-0,81, -51,69), halve assen 27,95 en 18,03 m, de lange as 12,52 graden gedraaid
// ten opzichte van de u-as (de 200 BAG-punten wijken er minder dan 0,15 m van af).
// Het titaniumdak steekt aan de zuidkant tot 1,4 m, aan de westkant 0,65 m buiten
// die gevellijn (AHN); de dakrand is een tweede, iets verschoven ellips.
const WALL_ELLIPSE = { c: [-0.81, -51.69], a: 27.95, b: 18.03, rot: 12.52 };
const EAVE_ELLIPSE = { c: [-1.1, -52.6], a: 28.3, b: 18.5, rot: 12.52 };
const ellipseRing = ({ c, a, b, rot }, n = 96) =>
  Array.from({ length: n }, (_, i) => {
    const t = (i / n) * 2 * Math.PI;
    const r = (rot * Math.PI) / 180;
    const x = a * Math.cos(t);
    const y = b * Math.sin(t);
    return [c[0] + x * Math.cos(r) - y * Math.sin(r), c[1] + x * Math.sin(r) + y * Math.cos(r)];
  });
// Genormeerde afstand van een punt tot het middelpunt van de gevelellips (1 = op de gevel).
const wallRadius = (x, y) => {
  const r = (WALL_ELLIPSE.rot * Math.PI) / 180;
  const dx = x - WALL_ELLIPSE.c[0];
  const dy = y - WALL_ELLIPSE.c[1];
  return Math.hypot((dx * Math.cos(r) + dy * Math.sin(r)) / WALL_ELLIPSE.a, (-dx * Math.sin(r) + dy * Math.cos(r)) / WALL_ELLIPSE.b);
};
const wallSolid = prism(ellipseRing(WALL_ELLIPSE), BASE - 1, 60);
const eaveSolid = prism(ellipseRing(EAVE_ELLIPSE), BASE - 1, 60);
// De snede door het dak: ten zuiden ervan ligt het hoge, bolle titaniumdak met een
// verticale noordwand. De wand loopt met de ellips mee naar zuiden aan de westkant
// (u -26 tot -22), ligt op v -47,4 tot u 5,2 en op v -49,0 oostelijk daarvan.
const CUT = [[-30, -54.0], [-27.9, -52.8], [-25.9, -49.7], [-23.9, -49.05], [-21.9, -47.85], [-19.9, -47.55], [-17.9, -47.4], [5.2, -47.4], [5.2, -49.0], [25, -49.0], [26.5, -50.2], [30, -50.2]];
const southRegion = prism([[-40, -90], [40, -90], [40, -50.2], ...[...CUT].reverse(), [-40, -54.0]], BASE - 1, 60);
// Het bolle dak: bolkap met top (-4,86, -49,83) op +14,50 m en straal 128,4 m.
const DOME = { apex: [-4.86, -49.83], z: 14.5, k: 0.003895 };
const domeZ = (x, y) => DOME.z - DOME.k * ((x - DOME.apex[0]) ** 2 + (y - DOME.apex[1]) ** 2);
const EAVE_THICKNESS = 1.5; // dikte van de overstekende dakrand (minimale plaatdikte)
const domePoints = [[DOME.apex[0], DOME.apex[1], DOME.z]];
const domeBottom = [];
for (let r = 4; r <= 36; r += 4) {
  const n = Math.ceil((2 * Math.PI * r) / 5);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const x = DOME.apex[0] + r * Math.cos(t);
    const y = DOME.apex[1] + r * Math.sin(t);
    domePoints.push([x, y, domeZ(x, y)]);
    if (r === 36) domeBottom.push([x, y]);
  }
}
const domeHull = surfaceHull(domePoints, domeBottom);
const domeBelowEave = surfaceHull(domePoints.map(([x, y, z]) => [x, y, z - EAVE_THICKNESS]), domeBottom);
const southDome = Manifold.intersection([domeHull, wallSolid, southRegion]);
// De overstekende dakrand: een plaat van 1,5 m onder het bolvlak tussen de gevellijn
// (0,4 m overlap met de wand) en de dakrandellips.
const eave = Manifold.difference(
  Manifold.intersection([domeHull, eaveSolid, southRegion]),
  Manifold.union([domeBelowEave, prism(ellipseRing({ ...WALL_ELLIPSE, a: WALL_ELLIPSE.a - 0.4, b: WALL_ELLIPSE.b - 0.4 }), BASE - 1, 60)]),
);
// Het lagere dak ten noorden van de snede: een halve cilinder (kromming in u) die in v
// opwaarts loopt: z = 18,07 + 0,3007 v + 0,007224 (u - 3,39)^2 (straal 69 m, helling 16,7 graden).
const NORTH = { c: 18.07, slope: 0.3007, k: 0.007224, u0: 3.39 };
const profileNorth = [];
for (let u = -36; u <= 42; u += 2) profileNorth.push([u, NORTH.c + NORTH.k * (u - NORTH.u0) ** 2]);
const northRoofVolume = shearZ(profileY([[-36, -60], ...profileNorth, [42, -60]], -60, -20), NORTH.slope);
const northRegion = prism([[-40, -51.0], [40, -51.0], [40, -20], [-40, -20]], BASE - 1, 60);
const northRoof = Manifold.intersection([northRoofVolume, wallSolid, northRegion, box(-40, 40, -60, -20, BASE, 40)]);
// De driehoekige lichtkoker tegen de wand (vlak dak op +11,3 m, schuine noordwand) en
// de lagere richel van 1,6 m breed langs de wand ten oosten ervan (+9,6 m).
const lantern = prism([[-9.4, -47.1], [3.0, -43.4], [4.0, -43.4], [4.7, -44.1], [4.7, -48.2], [-9.4, -48.2]], BASE, 11.3);
const cutLedge = box(5.0, 18.0, -49.4, -47.55, BASE, 9.6);
// Alleen de dakrand mag overhangen: ondervlakken buiten de gevelellips.
const OVERHANG_OK = (z, p) => z > BASE + 1 && p.every(([x, y]) => wallRadius(x, y) > 0.995);
const kurokawa = Manifold.union([southDome, eave, northRoof, lantern, cutLedge]);

const complex = Manifold.union([mainBuilding, kurokawa]);
const nodes = [["building:museum", complex]];
const all = complex;

const META = {
  name: "Van Gogh Museum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0363100012098679", "0363100012211564"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (120520,94, 485729,13), het zwaartepunt van het hoofdgebouw, op het maaiveld van het Museumplein (NAP +0,6 m), +X langs de gevels van het hoofdgebouw naar het noordoosten (23,25 graden vanaf de RD-X-as) en +Y loodrecht daarop. Eén node building:museum: het hoofdgebouw van Rietveld als stapeling van platte daken (+7,1 m terrassen en oostelijke aanbouw, +13,0 m westvleugel, +18,8 m zuidwestblok met vier zaagtanden, +21,0 m centraal dak, +24,0 m trappenhuiskern, +26,5 m liftkern, een verhoogde rand en een strook langs de gevels) en de ovale Kurokawavleugel ten zuiden ervan: een bolvormig titaniumdak (kapje van een bol, straal 128 m, top +14,5 m) met overstekende dakrand en een verticale snede, een lager noordelijk dak als halve cilinder (+4 tot +9 m), een driehoekige lichtkoker (+11,3 m) en een richel (+9,6 m), afgesneden op de BAG-contouren (de ellips van de Kurokawavleugel, het dak steekt tot 1,4 m uit). Onderkant op 0,5 m onder het maaiveld; alleen de dakrand van de Kurokawavleugel hangt over, alle andere vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van beide panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {"mainRoofM": [7.1, 26.5], "kurokawaRoofM": [4.0, 14.5], "groundNapM": 0.6, "baseM": -0.5},
  sources: [
      "https://nl.wikipedia.org/wiki/Van_Gogh_Museum",
      "https://www.heeswijk.nl/media/pers/pers-mauritshuis/entreegebouw-van-gogh-museum&lang=en",
      "PDOK BAG panden 0363100012098679 en 0363100012211564, EPSG:28992",
      "PDOK AHN DSM/DTM 0,25 m via WCS: de dakhoogtes, het bolvlak en het cilindervlak van de Kurokawavleugel en het maaiveld",
      "PDOK luchtfoto (Actueel_orthoHR)"
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
