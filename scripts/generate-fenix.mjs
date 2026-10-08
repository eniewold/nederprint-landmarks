// Genereert een gesloten 3D-model van het Fenix Museum in Rotterdam
// (Katendrecht): de Fenixloods, een langgerekte hal van 173 bij 49 m met een
// licht hellend dak (+11,9 tot +13,3 m), een schuin afgeschuinde noordrand, een
// rij van 16 dakramen (zaagtandkappen met een schuin glasvlak op het zuiden) en vier
// opbouwen op het dak, en daarop de Tornado van MAD Architects: een scheve, naar
// boven uitwaaiernde trechter die uit de glaskoker in het dak oprijst, met een
// schuin afgesneden platformring op +20 tot +25 m (het hoogst in het noordwesten),
// drie trapkuilen, het uitkijkplatform op +24 m met de zwarte kern en daarboven de
// schotelvormige kap tot +30 m. De loods volgt de BAG-contour en het dakvlak uit
// het AHN-DSM; de dakramen en opbouwen zijn uit het AHN op 0,25 m herbemonsterd
// (regelmatige verhogingen op een steek van 8,6 m). De Tornado staat niet in het
// AHN (die is van voor de bouw) en is geschat uit de PDOK-luchtfoto (omtrek en
// trapkuilen, met een correctie voor de scheefstand van de hoge delen in de foto),
// foto's van de bouw (dezeen, designboom) en de hoogtes uit de pers (platform op
// 24 m, top op 30 m). Zijn wand blijft op 30 graden of steiler (alleen de
// schotelkap hangt echt over, met OVERHANG_OK), zodat hij met weinig opvulling
// printbaar blijft. Het Mapbox-model is niet gebruikt. Alle maten in het script
// zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-fenix.mjs              # 1:1000 (standaard)
//   node scripts/generate-fenix.mjs --scale 2000
//
// Assenstelsel: oorsprong op het hart van de loods (RD 92862,65, 435227,87) op
// maaiveldniveau (NAP +3,4 m), Z omhoog. +X loopt langs de lange gevel naar het
// oosten (7,75 graden met de klok mee vanaf de RD-X-as) en +Y loodrecht daarop
// naar het noorden, naar de Maas.
//
// Bronnen: PDOK BAG-pand 0599100010056978 (de Fenixloods); AHN DSM/DTM 0,5 m
// (PDOK WCS): het dakvlak (NAP +15,3 m in het zuiden, +16,7 m in het noorden), de
// dakramen, de opbouwen, de afschuining van de noordrand en het maaiveld (NAP
// +3,3 tot +3,5 m); PDOK luchtfoto (de Tornado); Wikipedia, dezeen, designboom en
// persberichten (24 en 30 m, 297 panelen, dubbele helixtrap van 550 m). Geschat:
// de plaats, vorm en hoogte van de Tornado (zie de TORNADO-maten). Weggelaten: de
// klimaatkoepels en installaties kleiner dan 0,9 m, de geveldetails, de glazen
// strook langs de zuidrand van het dak en de dubbele helixtrap in de Tornado.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "fenix");
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

const SLUG = "fenix";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +3,4 m) ----------
const GROUND_NAP = 3.4;
const ORIGIN = [92862.65, 435227.87];
const X_AXIS = [0.990866, -0.134851]; // RD-richting -7,75 graden, langs de lange gevel
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// BAG-contour (u, v) van de Fenixloods, op 0,5 m vereenvoudigd.
const HALL_POLY = [
  [-86.7, -23.8], [86.2, -24.3], [86.4, 14.2], [87, 14.3], [86.9, 23.9], [-78.3, 24.4], [-78.2, 21.5], [-86.3, 21.5],
];
// Dakvlak uit het AHN-DSM: z = ROOF_SLOPE * v + ROOF_Z (NAP +15,3 m aan de zuidzijde, +16,7 m aan de noordzijde).
const ROOF_SLOPE = 0.035;
const ROOF_Z = 12.58;
const roofZ = (v) => ROOF_SLOPE * v + ROOF_Z;
// Aan de noordzijde loopt het dak over de laatste 3 m schuin af naar de bovenkant van de gevel (AHN).
const NORTH_SKIRT = [[21.4, 13.35], [23.4, 10.2], [24.45, 6.4]];
// Maaiveld (AHN NAP +3,3 tot +3,5 m) rond de loods: de promenade en de kade.
const GROUND_SAMPLES = [[-53, -7], [37, -9], [93, 22], [17, 32]];

// Dakramen: een rij van 19 zaagtandkappen op v = -4,3 tot -9,2 met een vaste steek van 8,6 m (AHN 0,25 m
// herbemonsterd: regelmatige verhogingen van 2,0 m boven het dak op de nok, 3,1 m breed). Het zinken dak
// loopt van het dak in het noorden omhoog naar de nok op v = -7,7 (3,4 m run, 32 graden) en het schuine
// glasvlak met de witte raamkozijnen op de luchtfoto loopt aan de zuidkant weer af naar het dak (1,5 m
// run, 54 graden); de wangen zijn driehoeken (bouwfoto's). De drie ramen midden voor de Tornado (u -13,2,
// -4,6 en 4,0) staan in de glaskoker die de Tornado nu door het dak laat; die zijn in de luchtfoto
// verdwenen en blijven weg.
const DORMER = { u0: -81.96, pitch: 8.597, count: 19, skip: [8, 9, 10], width: 3.1, vNorth: -4.3, vRidge: -7.7, vSouth: -9.2, height: 2.1 };
// Opbouwen op het dak (AHN): twee liftkokers/installaties aan de zuidrand en twee kleine kasten bij de westkop.
const ROOF_BOXES = [
  { u: [-41.4, -36.3], v: [-22.2, -18.3], h: 1.5 },
  { u: [35.8, 40.9], v: [-22.4, -18.6], h: 1.5 },
  { u: [-84.7, -82.3], v: [6.6, 8.7], h: 1.5 },
  { u: [-74.7, -72.1], v: [5.7, 8.6], h: 2 },
];

// De Tornado (MAD Architects): een scheve, naar boven uitwaaierende trechter van gepolijst roestvrij staal
// die uit de glaskoker in het dak oprijst (voet u -17,7 tot 8,3 volgens de luchtfoto), met een brede,
// schuin afgesneden bovenrand (de platformring op +20 tot +25 m, het hoogst in het noordwesten), daarin
// de ketel met de dubbele trap, in het noordwesten het uitkijkplatform op +24 m met de zwarte kern en
// daarboven de schotelvormige kap tot +30 m. Alle maten uit de luchtfoto (omtrek), foto's van de bouw
// en de pers (24 en 30 m).
const TORNADO = {
  // Voet op het dak: een afgeronde rechthoek (superellips) rond c met halve maten a (u) en b (v).
  foot: { c: [-4.7, -0.85], a: 13, b: 13.5, n: 3, z0: 11.5, z1: 12.6 },
  // Omtrek van de platformring (u, v), tegen de klok in vanaf het zuiden.
  rim: [
    [-4, -17.4], [4.5, -14.8], [9, -10.8], [11.5, -5.8], [12.5, -0.8], [12.3, 5.2], [11, 10.6], [8.5, 15.6], [5.5, 19.8],
    [0, 22.7], [-6, 23.1], [-12, 21.9], [-17.5, 18.5], [-21.5, 14.1], [-21, 7.6], [-19.75, 3.1], [-18.9, -3.3],
    [-16.5, -8.8], [-12, -14.3], [-7, -17.05],
  ],
  // Bovenrand: een vlak door (u, v) = at op hoogte z, met helling du en dv per meter.
  rimPlane: { at: [-14.25, 8.95], z: 24, du: -0.08, dv: 0.1 },
  flareTop: 23, // op deze hoogte is de volle omtrek bereikt, daarboven loopt de wand verticaal
  ease: 1.2, // de omtrek waaiert onderaan sneller uit dan bovenaan (holle vorm)
  band: { z0: 18.2, z1: 20.4, out: 1 }, // de platformring steekt 1 m buiten de trechter uit, met een afschuining van ongeveer 45 graden eronder
  twist: 18, // graden waarmee de omtrek aan de voet tegen de klok in is gedraaid ten opzichte van de platformring
  // De drie trapkuilen in het dek (ovalen: middelpunt, halve assen, hoek in graden) met hun bodem op +floor m;
  // de stroken ertussen zijn de trapbanden en het platform.
  pits: {
    ovals: [
      { c: [-8.5, -2.3], rx: 9, ry: 5.6, angle: -50, floor: 15 },
      { c: [3.8, 1.4], rx: 9.5, ry: 3.6, angle: -76, floor: 16.5 },
      { c: [-2.4, 14.4], rx: 5.5, ry: 3, angle: 10, floor: 19 },
    ],
  },
  core: { c: [-14.25, 8.95], r: 2.9, top: 27.6 },
  // Kap: een afgeplatte schotel, rand op +28 m, top op +30 m, onderkant tot +26,2 m bij de kern.
  cap: { c: [-14.25, 8.95], rx: 8.1, ry: 6.1, angle: 22, rimZ: 28, top: { rx: 4.5, ry: 3.4, z: 30 }, neck: { r: 2.8, z: 26.2 } },
};

// ---------- gebouw ----------
// De loods: BAG-contour onder het AHN-dakvlak, met de afgeschuinde noordrand.
const hall = Manifold.intersection([
  prism(HALL_POLY, BASE, 20),
  planeRoof([[-90, -26], [90, -26], [90, 26], [-90, 26]], BASE, [0, ROOF_SLOPE, ROOF_Z]),
  profileX([[-30, BASE], [30, BASE], [30, NORTH_SKIRT[2][1]], ...[...NORTH_SKIRT].reverse(), [NORTH_SKIRT[0][0], 20], [-30, 20]], -95, 95),
]);

// Dakramen: een driehoeksprisma (hull) per kap, met de onderkant 0,3 m in het dak.
const dormer = (u) => {
  const { width, vNorth, vRidge, vSouth, height } = DORMER;
  const pts = [];
  for (const x of [u - width / 2, u + width / 2]) {
    pts.push([x, vNorth, roofZ(vNorth) - 0.05], [x, vSouth, roofZ(vSouth) - 0.05], [x, vRidge, roofZ(vRidge) + height], [x, vRidge, roofZ(vRidge) - 0.3]);
  }
  return Manifold.hull(pts);
};
const dormers = [];
for (let k = 0; k < DORMER.count; k++) if (!DORMER.skip.includes(k)) dormers.push(dormer(DORMER.u0 + k * DORMER.pitch));
const roofBoxes = ROOF_BOXES.map(({ u, v, h }) => box(u[0], u[1], v[0], v[1], roofZ((v[0] + v[1]) / 2) - 0.3, roofZ(v[1]) + h));

// Tornado. Een loft is een gesloten lichaam door secties met evenveel punten (tegen de klok in, vanuit een
// middelpunt gezien stervormig), zodat de wand ook bij een niet-convexe omtrek vloeiend uitwaaiert.
const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const RING_N = 96;
// Afstand van c tot de omtrek van een stervormige veelhoek in richting hoek a.
const polarRadius = (poly, c, a) => {
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  let best = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    const ex = x1 - x0;
    const ey = y1 - y0;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) continue;
    const t = ((x0 - c[0]) * ey - (y0 - c[1]) * ex) / den;
    const s = ((x0 - c[0]) * dy - (y0 - c[1]) * dx) / den;
    if (t > 0 && s >= 0 && s <= 1) best = Math.max(best, t);
  }
  return best;
};
// Gesloten Catmull-Rom door de punten, als dichte veelhoek.
const smoothClosed = (pts, per = 8) => {
  const out = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([0, 1].map((a) => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)));
    }
  }
  return out;
};
const centroid = (poly) => [0, 1].map((a) => poly.reduce((s, p) => s + p[a], 0) / poly.length);
const ANGLES = Array.from({ length: RING_N }, (_, i) => (TAU * i) / RING_N);
const { foot, rim, rimPlane, twist, ease, band, pits, core, cap, flareTop } = TORNADO;
const rimPoly = smoothClosed(rim);
const rimC = centroid(rimPoly);
const footRadius = (a) => {
  const c = Math.abs(Math.cos(a)) / foot.a;
  const s = Math.abs(Math.sin(a)) / foot.b;
  return 1 / (c ** foot.n + s ** foot.n) ** (1 / foot.n);
};
// Sectie op hoogte z: de omtrek gaat lineair van de voet naar de platformring, tussen foot.z1 en flareTop; de
// ringvorm is bovenaan niet gedraaid en draait naar beneden toe op tot "twist" graden, zodat de wand wentelt.
const sectionAt = (z) => {
  const t = 1 - (1 - clamp01((z - foot.z1) / (flareTop - foot.z1))) ** ease;
  const c = [lerp(foot.c[0], rimC[0], t), lerp(foot.c[1], rimC[1], t)];
  const phi = ((twist * Math.PI) / 180) * (1 - t);
  const out = band.out * clamp01((z - band.z0) / (band.z1 - band.z0));
  return { z, pts: ANGLES.map((a) => { const r = lerp(footRadius(a), polarRadius(rimPoly, rimC, a + phi), t) + out; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]; }) };
};
// Loft door de secties (gesloten, met vlakken als deksel en bodem uit het middelpunt).
const loft = (sections) => {
  const n = sections[0].pts.length;
  const m = sections.length;
  const verts = [];
  for (const { z, pts } of sections) for (const [x, y] of pts) verts.push(x, y, z);
  const mid = (s) => centroid(sections[s].pts);
  const bottomC = verts.length / 3;
  verts.push(...mid(0), sections[0].z);
  const topC = verts.length / 3;
  verts.push(...mid(m - 1), sections[m - 1].z);
  const tris = [];
  for (let k = 0; k < m - 1; k++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const a = k * n + i;
      const b = k * n + j;
      const c = (k + 1) * n + j;
      const d = (k + 1) * n + i;
      tris.push(a, b, c, a, c, d);
    }
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    tris.push(bottomC, j, i);
    tris.push(topC, (m - 1) * n + i, (m - 1) * n + j);
  }
  return new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }));
};
const planeBelow = ({ at, z, du, dv }, margin = 60) => {
  const c = z - du * at[0] - dv * at[1];
  return planeRoof([[-margin, -margin], [margin, -margin], [margin, margin], [-margin, margin]], 0, [du, dv, c]);
};
const ellipsePoly = ([cx, cy], rx, ry, angle = 0, n = 72) => {
  const ca = Math.cos((angle * Math.PI) / 180);
  const sa = Math.sin((angle * Math.PI) / 180);
  return Array.from({ length: n }, (_, i) => {
    const t = (TAU * i) / n;
    const x = rx * Math.cos(t);
    const y = ry * Math.sin(t);
    return [cx + x * ca - y * sa, cy + x * sa + y * ca];
  });
};
const outerSections = [{ ...sectionAt(foot.z0), z: foot.z0 }];
for (const z of [12.6, 14, 15.5, 17, band.z0, band.z1, 21, flareTop, 27]) outerSections.push(sectionAt(z));
const outerLoft = loft(outerSections);
const rimCut = planeBelow(rimPlane);
const pitSolids = pits.ovals.map((o) => prism(ellipsePoly(o.c, o.rx, o.ry, o.angle), o.floor, 40));
const funnel = Manifold.difference([Manifold.intersection([outerLoft, rimCut]), ...pitSolids]);
// Kern en kap.
const coreSolid = cylinder(core.c, core.r, foot.z0, core.top, 36);
const disc = ([cx, cy], rx, ry, angle, z) =>
  Manifold.extrude(new CrossSection([ccw(ellipsePoly([0, 0], rx, ry, angle, 48))]), 0.01).translate([cx, cy, z - 0.01]);
const capSolid = Manifold.hull([
  disc(cap.c, cap.rx, cap.ry, cap.angle, cap.rimZ),
  disc(cap.c, cap.top.rx, cap.top.ry, cap.angle, cap.top.z),
  disc(cap.c, cap.neck.r, cap.neck.r, 0, cap.neck.z),
]);
const tornado = Manifold.union([funnel, coreSolid, capSolid]);

const complex = Manifold.union([hall, ...dormers, ...roofBoxes, tornado]);
const nodes = [["building:fenixloods", complex]];
const all = complex;

// Overhang: de schotelkap en de noordkant van de trechter (waar die verder uitwaaiert dan 45 graden) hangen
// echt over; de export vult die bij het printen op.
const inCap = (p) => p.every(([x, y, z]) => z >= cap.neck.z - 0.01 && Math.hypot(x - cap.c[0], y - cap.c[1]) <= cap.rx + 0.5);
const inFunnel = (p) => p.every(([x, y, z]) => z > 12.4 && x > -26 && x < 16 && y > -22 && y < 27);
// Hoek van een driehoek met het horizontale vlak (0 = plat plafond), uit de normaal.
const tilt = (p) => {
  const e1 = p[1].map((c, i) => c - p[0][i]);
  const e2 = p[2].map((c, i) => c - p[0][i]);
  const nz = e1[0] * e2[1] - e1[1] * e2[0];
  const len = Math.hypot(e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], nz);
  return (Math.acos(Math.min(1, Math.abs(nz) / len)) * 180) / Math.PI;
};
// De schotel hangt echt over (onderkant onder 15 tot 25 graden); de wand van de trechter mag tot 30 graden afwijken.
const OVERHANG_OK = (z, p) => (inCap(p) && tilt(p) >= 15) || (inFunnel(p) && tilt(p) >= 30);

const META = {
  name: "Fenix",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0599100010056978"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (92862,65, 435227,87), het hart van de Fenixloods, op het maaiveld (NAP +3,4 m), +X langs de lange gevel naar het oosten (-7,75 graden vanaf de RD-X-as) en +Y naar het noorden. Eén node building:fenixloods: de loods van 173 bij 49 m met een licht hellend dak (+11,9 m in het zuiden, +13,3 m in het noorden, de noordrand over de laatste 3 m afgeschuind), een rij van 16 dakramen (zaagtandkappen van 3,1 m breed en 2,1 m hoog), vier opbouwen op het dak en de Tornado: een scheve, uitwaaierende trechter uit de glaskoker in het dak tot een schuin afgesneden platformring op +20 tot +25 m met drie trapkuilen, het uitkijkplatform op +24 m met de zwarte kern en een schotelkap tot +30 m (geschat uit luchtfoto, bouwfoto's en persmaten, zonder helixtrap). Onderkant op 0,5 m onder het maaiveld; de wand van de trechter blijft 30 graden of steiler, alleen de schotelkap hangt over. Vervangt de PDOK-reconstructie van de loods. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    hallM: [173, 49],
    roofM: [11.9, 13.3],
    dormers: DORMER.count - DORMER.skip.length,
    tornadoPlatformM: rimPlane.z,
    tornadoTopM: cap.top.z,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Fenix_%28museum%29",
    "https://en.wikipedia.org/wiki/FENIX_Museum_of_Migration",
    "PDOK BAG pand 0599100010056978, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS (op 0,25 m herbemonsterd): het dakvlak, de dakramen, de opbouwen, de noordrand en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR): de omtrek en trapkuilen van de Tornado",
    "https://www.dezeen.com/2024/09/09/fenix-museum-rotterdam-mad-tornado-steel-staircase/",
    "https://www.designboom.com/architecture/mad-architects-fenix-museum-completion-double-helix-staircase-rotterdam-10-03-2024/",
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

// Losse delen van het model (genus onder 0 betekent meer dan één stuk).
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
