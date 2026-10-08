// Genereert een gedetailleerd, gesloten 3D-model van Het Scheepvaartmuseum in
// Amsterdam ('s Lands Zeemagazijn, 1656, Daniel Stalpaert): het vierkante gebouw
// van 70 bij 64 m aan het IJ met de vier vleugels onder een omlopend schilddak,
// de vier risalieten met een zadeldak en fronton, 36 dakkapellen, vier witte
// schoorstenen, de installatiekappen in de dakgoot, de gevel met sokkel,
// kroonlijst en 246 vensternissen, en de bolle glazen koepel (Ney & Partners,
// 2011) boven de binnenhof. Het dak bestaat uit vlakken (hulls van rechthoeken
// op nok-, goot- en voethoogte), geen hoogteveld; alle maten staan als
// constanten in het script. Het Mapbox-model is niet gebruikt. Alle maten in het
// script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-scheepvaartmuseum.mjs              # 1:1000 (standaard)
//   node scripts/generate-scheepvaartmuseum.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (122829,07, 487196,97), het zwaartepunt van het
// BAG-pand, op maaiveldniveau (NAP +2,3 m), Z omhoog. +X loopt langs de gevels
// naar het noordoosten (27,75 graden tegen de klok in vanaf de RD-X-as) en +Y
// loodrecht daarop naar het noordwesten, het IJ in. De voorgevel met de
// ingang en de weg ligt aan de -Y-kant (zuidoosten).
//
// Dakopbouw (hoogtes boven het maaiveld). Buitenste dakvlak: vier vlakken met een
// helling van 1,33 (53 graden) van de kroonlijst (+15,5 m) naar de nokken op
// +20,2 m, met graten op de hoeken. In de noord-, west- en oostvleugel volgt
// achter de nok een goot op +18,8 m (circa 5 m breed, met de installatiekappen)
// en een tweede nok op +20,2 m; de zuidvleugel (9 m diep) heeft maar een nok. Van
// de binnenste nok loopt een dakvlak (helling 1,39, 54 graden) naar de goot rond
// het glas op +16,0 m. De koepel is een gewelfd vlak z = 20,3 - 2,78 r^2 - 0,09 r^4
// (r = afstand tot het midden in een p-norm met p = 4,27, gedeeld door 15,5 m),
// gefit op de AHN-cellen die het glas zien (rms 0,07 m), als hull van een raster
// van 17 bij 17 punten op een massieve onderbouw: rand op +17,3 m (hoeken +16,1 m),
// top +20,3 m, 31,8 m breed.
//
// Bronnen: PDOK BAG-pand 0363100012170236 (de contour); AHN DSM/DTM 0,5 m (PDOK
// WCS, op 0,25 m geresampled): vlakfits per dakvlak (rms 0,01 m), de nok-, goot- en
// voethoogtes, de koepel, de plaats van de dakkapellen, schoorstenen en
// installatiekappen (als overschot boven het vlakkenmodel) en het maaiveld; PDOK
// luchtfoto (de nieuwste opname, 8 cm; relief verschuift het dak 1 tot 3 m, daarom zijn
// de plaatsen uit het AHN gehaald en dient de foto voor de vormen); Rijksmonument 2205
// (vier door een omlopend schilddak gedekte vleugels, per gevel een middenrisaliet
// met fronton), Wikipedia en Dok Architecten (koepel van Ney & Partners, 30 bij 30 m
// staal). Geschat: de sokkelhoogte (3,2 m), de terugligging van de gevel (0,5 m), de
// vensterassen (2,45 m uit de foto) en -afmetingen (1,2 bij 2,2 m, 0,9 m diep, groter dan
// werkelijk zodat ze op 1:1000 zichtbaar zijn), de vorm van de dakkapellen en de
// bekroning van het oostfronton. Weggelaten: de vlaggenmasten op de frontons, de
// leidingen kleiner dan 0,9 m, de glasstroken langs de goot, de kleinere
// glaskappen en techniek, de spleet rond het glas, de steigers en pontons rond
// het gebouw en het netwerk van spanten in de koepel.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "scheepvaartmuseum");
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

const SLUG = "scheepvaartmuseum";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP 2,3 m) ----------
const GROUND_NAP = 2.3;
const ORIGIN = [122829.07, 487196.97];
const X_AXIS = [0.884988, 0.465615]; // RD-richting 27,75 graden, langs de gevels
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// BAG-contour (u, v), op 0,3 m vereenvoudigd.
const FOOTPRINT = [[34.9,-6.4],[32.3,-6.4],[32.3,-28.9],[7.6,-28.9],[7.6,-32.1],[-7.9,-32.1],[-7.9,-29.0],[-32.4,-29.1],[-32.4,-6.5],[-35.1,-6.5],[-35.2,6.1],[-32.5,6.1],[-32.5,28.8],[-7.8,28.8],[-7.8,32.0],[7.5,32.0],[7.5,28.8],[32.3,28.9],[32.3,6.2],[34.9,6.2]];
// Maaiveld (AHN NAP +2,2 tot +2,5 m) rond het gebouw.
const GROUND_SAMPLES = [[30, -40], [20, -45], [50, -10]];

// Rechthoeken zijn [u0, u1, v0, v1].
const rectPts = ([u0, u1, v0, v1], z) => [[u0, v0, z], [u1, v0, z], [u1, v1, z], [u0, v1, z]];
const frustum = (r0, z0, r1, z1) => Manifold.hull([...rectPts(r0, z0), ...rectPts(r1, z1)]);
const grow = ([u0, u1, v0, v1], d) => [u0 - d, u1 + d, v0 - d, v1 + d];

// ---------- hoofdmaten (hoogtes boven het maaiveld) ----------
const Z_EAVE = 15.5; // goot- en kroonlijsthoogte rond het hele gebouw
const Z_RIDGE = 20.2; // de nokken van de vier vleugels
const Z_DECK = 18.8; // de goot tussen de twee nokken in de noord-, west- en oostvleugel
const Z_FOOT = 16.0; // de goot rond het glazen dak

// ---------- het buitenste dakvlak: steil dakvlak rondom, met schilddaken op de hoeken ----------
// De vier dakvlakken hebben een helling van 1,33 (53 graden); CREST is het snijpunt met
// nokhoogte (u0, u1, v0, v1), uit een vlakfit op het AHN-DSM.
const CREST = [-28.47, 28.07, -24.7, 24.85];
const OUT_SLOPE = 1.33;
const EAVE_RUN = (Z_RIDGE - Z_EAVE) / OUT_SLOPE;
const outerRoof = frustum(grow(CREST, EAVE_RUN + 0.2), Z_EAVE - 0.27, CREST, Z_RIDGE);
const wallBlock = prism(FOOTPRINT, BASE, Z_EAVE);

// ---------- de goot tussen de nokken (alleen noord, west en oost) ----------
// Elke arm is een kuil met een vlakke bodem op Z_DECK en schuine wanden: de achterkant van de buitenste
// nok (helling 1,1) en de voorkant van de binnenste nok (helling 1,2).
const BACK = 1.1;
const FRONT = 1.2;
const pocket = (r, [su0, su1, sv0, sv1]) => {
  const dz = 2.4;
  return frustum(r, Z_DECK, [r[0] - dz / su0, r[1] + dz / su1, r[2] - dz / sv0, r[3] + dz / sv1], Z_DECK + dz);
};
const deckPockets = [
  pocket([-26.9, 26.5, 18.6, 23.3], [BACK, BACK, FRONT, BACK]),
  pocket([-26.9, -22.0, -23.1, 23.3], [BACK, FRONT, BACK, BACK]),
  pocket([21.85, 26.5, -23.1, 23.3], [FRONT, BACK, BACK, BACK]),
];

// ---------- binnenhof: dakvlakken naar de goot rond het glas ----------
// Helling 1,39 (54 graden); PIT_TOP is het snijpunt met nokhoogte, PIT_FOOT met de goot op Z_FOOT.
const PIT_FOOT = [-17.58, 17.36, -21.4, 14.1];
const PIT_TOP = [-20.57, 20.37, -24.35, 17.15];
const pitTop = (zt) => {
  const k = (zt - Z_RIDGE) / (Z_RIDGE - Z_FOOT);
  return PIT_TOP.map((c, i) => c + (c - PIT_FOOT[i]) * k);
};
const pit = frustum(PIT_FOOT, Z_FOOT, pitTop(Z_RIDGE + 1), Z_RIDGE + 1);

// ---------- koepel boven de binnenhof ----------
const DOME = { cu: -0.1, cv: -3.7, half: 15.9, top: 20.3, a: 15.5, k2: 2.78, k4: 0.09, p: 4.27 };
const domeZ = (u, v) => {
  const r = ((Math.abs(u - DOME.cu) / DOME.a) ** DOME.p + (Math.abs(v - DOME.cv) / DOME.a) ** DOME.p) ** (1 / DOME.p);
  return DOME.top - DOME.k2 * r * r - DOME.k4 * r ** 4;
};
const domePoints = [];
const DOME_N = 16;
for (let i = 0; i <= DOME_N; i++) {
  for (let j = 0; j <= DOME_N; j++) {
    const u = DOME.cu - DOME.half + (2 * DOME.half * i) / DOME_N;
    const v = DOME.cv - DOME.half + (2 * DOME.half * j) / DOME_N;
    domePoints.push([u, v, domeZ(u, v)]);
  }
}
for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) domePoints.push([DOME.cu + su * DOME.half, DOME.cv + sv * DOME.half, Z_FOOT - 0.3]);
const dome = Manifold.hull(domePoints);

// ---------- risalieten met een zadeldak en fronton ----------
// Noord- en zuidrisaliet: nok langs v; west- en oostrisaliet: nok langs u. Alle vier hebben dezelfde
// dakhelling (0,455, 24,5 graden); de gevel eindigt in een driehoekig fronton op de contour.
const GABLE_SLOPE = 0.455;
const gableAlongV = (u0, u1, cu, zRidge, v0, v1) => {
  const ze = (u) => zRidge - GABLE_SLOPE * Math.abs(u - cu);
  return profileY([[u0, BASE], [u1, BASE], [u1, ze(u1)], [cu, zRidge], [u0, ze(u0)]], v0, v1);
};
const gableAlongU = (v0, v1, cv, zRidge, u0, u1) => {
  const ze = (v) => zRidge - GABLE_SLOPE * Math.abs(v - cv);
  return profileX([[v0, BASE], [v1, BASE], [v1, ze(v1)], [cv, zRidge], [v0, ze(v0)]], u0, u1);
};
const risalietN = gableAlongV(-8.1, 7.8, -0.17, 19.36, 24.5, 33);
const risalietS = gableAlongV(-8.2, 7.9, -0.16, 19.17, -33, -24.7);
const risalietW = gableAlongU(-6.8, 6.5, -0.24, 18.66, -36, -28);
const risalietE = gableAlongU(-6.7, 6.6, 0.14, 18.71, 28, 36);

// ---------- dakkapellen ----------
// Buitenzijde: 2,2 m breed, voorvlak 0,3 m achter de gevel, goot op +17,3 m en nok op +18,45 m, dak met
// een fronton aan de gevelzijde. De lijst geeft de plek langs de gevel (u of v van het hart).
const DORMER_W = 2.2;
const DORMER_EAVE = 17.3;
const DORMER_RIDGE = 18.45;
const dormerProfile = (w, ze, zr, z0) => [[-w / 2, z0], [w / 2, z0], [w / 2, ze], [0, zr], [-w / 2, ze]];
// Dakkapel op een dakvlak langs v (noord of zuid): hart op u = cu, voorvlak op v = front, naar binnen
// (richting het dak) tot back.
const dormerV = (cu, front, back, w, ze, zr, z0) =>
  profileY(dormerProfile(w, ze, zr, z0), Math.min(front, back), Math.max(front, back)).translate([cu, 0, 0]);
const dormerU = (cv, front, back, w, ze, zr, z0) =>
  profileX(dormerProfile(w, ze, zr, z0), Math.min(front, back), Math.max(front, back)).translate([0, cv, 0]);
const DORMERS_N = [-28.2, -20.8, -13.4, 13.4, 20.9, 28.2];
const DORMERS_S = [-28.0, -20.9, -13.4, 13.3, 20.7, 28.1];
const DORMERS_W = [24.5, 17.1, 7.2, -7.5, -17.6, -25.0];
const DORMERS_E = [24.9, 17.4, 7.5, -7.1, -17.1, -24.5];
const dormers = [
  ...DORMERS_N.map((u) => dormerV(u, 28.5, 25.9, DORMER_W, DORMER_EAVE, DORMER_RIDGE, 15.0)),
  ...DORMERS_S.map((u) => dormerV(u, -28.7, -25.9, DORMER_W, DORMER_EAVE, DORMER_RIDGE, 15.0)),
  ...DORMERS_W.map((v) => dormerU(v, -32.1, -29.5, DORMER_W, DORMER_EAVE, DORMER_RIDGE, 15.0)),
  ...DORMERS_E.map((v) => dormerU(v, 32.0, 29.0, DORMER_W, DORMER_EAVE, DORMER_RIDGE, 15.0)),
];
// Binnenzijde (op de dakvlakken naar het glas): kleiner, 1,9 m breed, goot +17,2 m en nok +18,3 m.
const IN_W = 1.9;
const IN_EAVE = 17.2;
const IN_RIDGE = 18.3;
const innerDormers = [
  ...[-11.0, 0.0, 11.0].map((u) => dormerV(u, 13.9, 16.6, IN_W, IN_EAVE, IN_RIDGE, 15.6)),
  ...[-11.0, -0.1, 10.9].map((u) => dormerV(u, -21.2, -23.7, IN_W, IN_EAVE, IN_RIDGE, 15.6)),
  ...[7.3, -2.5, -14.9].map((v) => dormerU(v, -17.3, -19.9, IN_W, IN_EAVE, IN_RIDGE, 15.6)),
  ...[7.5, -2.2, -14.6].map((v) => dormerU(v, 17.2, 19.8, IN_W, IN_EAVE, IN_RIDGE, 15.6)),
];

// ---------- schoorstenen op de nok (vier, wit) ----------
const CHIMNEY = 1.8;
const chimneys = [[-17.1, 24.5], [17.2, 25.0], [-17.1, -24.8], [17.1, -24.4]].map(([u, v]) =>
  box(u - CHIMNEY / 2, u + CHIMNEY / 2, v - CHIMNEY / 2, v + CHIMNEY / 2, 17.0, 23.0));

// ---------- installatiekappen op de goot (acht witte units, 1,6 m hoog) ----------
const UNIT_TOP = 20.4;
const UNITS = [
  [-22.0, -9.7, 19.3, 21.9], [7.9, 20.6, 19.9, 22.4], // noordvleugel
  [-25.8, -22.6, 9.6, 18.1], [-26.4, -22.6, -10.0, 2.7], [-26.3, -22.6, -22.6, -11.8], // westvleugel
  [22.0, 25.8, 14.0, 21.9], [22.0, 25.8, 0.4, 13.7], [23.0, 26.0, -20.8, -9.0], // oostvleugel
];
const units = UNITS.map(([u0, u1, v0, v1]) => box(u0, u1, v0, v1, Z_DECK - 0.3, UNIT_TOP));
// Leidingbundels tussen de units (1,1 m boven de goot, 1,4 m breed).
const ducts = [[-24.6, -23.2, 2.4, 10.6], [23.4, 24.8, -9.2, 0.6]].map(([u0, u1, v0, v1]) =>
  box(u0, u1, v0, v1, Z_DECK - 0.3, Z_DECK + 1.1));

// ---------- bekroning van het oostfronton (sokkel met piramidedak) ----------
const finial = Manifold.union([
  box(32.7, 34.7, -0.7, 1.3, 17.8, 20.4),
  frustum([32.7, 34.7, -0.7, 1.3], 20.4, [33.55, 33.85, 0.15, 0.45], 22.3),
]);

// ---------- gevelreliëf: sokkel, kroonlijst en vensters ----------
// De BAG-contour is de buitenrand van de rustica-sokkel (tot SOKKEL). Daarboven staat de gevel INSET
// terug, met een schuine onderkant (rond 48 graden) onder de kroonlijst; de vensters zijn nissen met een
// schuin hoofd, dus zonder ondervlak onder 45 graden. De rechthoeken zijn de contour per bouwdeel
// (hoofdblok en vier risalieten); de risalieten lopen het hoofdblok in zodat de nissen aansluiten.
const SOKKEL = 3.2;
const INSET = 0.5;
const FACADE_RECTS = [
  [-32.4, 32.3, -29.0, 28.8],
  [-7.8, 7.5, 26.0, 32.0],
  [-7.9, 7.6, -32.1, -26.0],
  [-35.2, -30.0, -6.5, 6.1],
  [30.0, 34.9, -6.4, 6.2],
];
const shrink = ([u0, u1, v0, v1], d) => [u0 + d, u1 - d, v0 + d, v1 - d];
const CHAMFER_TOP = 14.45; // onderkant van de schuine kroonlijst
const CUT_OUT = 0.6; // het snijvolume reikt zoveel buiten de contour (wordt daarna op de contour afgesneden)
const insetSolid = Manifold.union(
  FACADE_RECTS.map((r) => {
    const inner = shrink(r, INSET);
    return Manifold.union([
      box(inner[0], inner[1], inner[2], inner[3], SOKKEL - 1, CHAMFER_TOP),
      frustum(inner, CHAMFER_TOP, grow(inner, INSET + CUT_OUT), CHAMFER_TOP + 1.1 * (INSET + CUT_OUT)),
    ]);
  }),
);
const outerCs = new CrossSection([ccw(FOOTPRINT)]).offset(CUT_OUT, "Miter", 2);
const reliefCut = Manifold.extrude(outerCs, CHAMFER_TOP + 1.1 * (INSET + CUT_OUT) - 0.05 - SOKKEL)
  .translate([0, 0, SOKKEL])
  .subtract(insetSolid);

// Vensters: assen om de 2,45 m, drie rijen, 1,2 m breed en 0,9 m diep (op de inset gevel).
const WIN_PITCH = 2.45;
const WIN_W = 1.2;
const WIN_DEPTH = 0.9;
const WIN_ROWS = [[4.1, 6.3], [7.9, 10.1], [11.7, 13.6]];
const winProfile = (sign, z0, z1) => {
  // Het hoofd loopt van (diepte 0,9; z1 - 1,0) schuin omhoog door het gevelvlak (diepte 0; z1) tot 0,05 m
  // erbuiten, zodat geen hoekpunt exact op het gevelvlak ligt.
  const zOut = z1 - 1.0 + (WIN_DEPTH + 0.05) * (1.0 / WIN_DEPTH);
  return [[sign * -0.3, z0], [sign * WIN_DEPTH, z0], [sign * WIN_DEPTH, z1 - 1.0], [sign * -0.05, zOut], [sign * -0.3, zOut]];
};
// Een gevelstuk op vlak 'plane' (inset), met de buitenkant in richting 'out' (+1 of -1) langs de as
// 'axis' ("v": gevel langs u, "u": gevel langs v), tussen a en b.
const windowsAlong = (axis, plane, out, a, b) => {
  const n = Math.floor((b - a - 4.8) / WIN_PITCH) + 1; // minstens 1,8 m gevel tot de hoek
  const start = (a + b) / 2 - ((n - 1) * WIN_PITCH) / 2;
  const cuts = [];
  for (let k = 0; k < n; k++) {
    const c = start + k * WIN_PITCH;
    for (const [z0, z1] of WIN_ROWS) {
      // Het profiel loopt vanaf het gevelvlak naar binnen: dieptecoordinaat = plane - out * diepte.
      const pts = winProfile(-out, z0, z1).map(([x, z]) => [plane + x, z]);
      cuts.push(
        axis === "v"
          ? profileX(pts, c - WIN_W / 2, c + WIN_W / 2)
          : profileY(pts, c - WIN_W / 2, c + WIN_W / 2),
      );
    }
  }
  return cuts;
};
const windows = [
  // hoofdblok, links en rechts van de risalieten
  ...windowsAlong("v", 28.3, +1, -31.9, -7.3), ...windowsAlong("v", 28.3, +1, 7.0, 31.8),
  ...windowsAlong("v", -28.5, -1, -31.9, -7.4), ...windowsAlong("v", -28.5, -1, 7.1, 31.8),
  ...windowsAlong("u", -31.9, -1, -28.5, -6.0), ...windowsAlong("u", -31.9, -1, 5.6, 28.3),
  ...windowsAlong("u", 31.8, +1, -28.5, -5.9), ...windowsAlong("u", 31.8, +1, 5.7, 28.3),
  // voorkanten van de risalieten
  ...windowsAlong("v", 31.5, +1, -7.3, 7.0), ...windowsAlong("v", -31.6, -1, -7.4, 7.1),
  ...windowsAlong("u", -34.7, -1, -6.0, 5.6), ...windowsAlong("u", 34.4, +1, -5.9, 5.7),
];

// ---------- gebouw ----------
let complex = Manifold.union([wallBlock, outerRoof]);
complex = complex.subtract(Manifold.union([pit, ...deckPockets]));
complex = Manifold.union([
  complex, dome, risalietN, risalietS, risalietW, risalietE,
  ...dormers, ...innerDormers, ...chimneys, ...units, ...ducts, finial,
]);
complex = complex.subtract(Manifold.union([reliefCut, ...windows]));
complex = Manifold.intersection([complex, prism(FOOTPRINT, BASE - 1, 60)]);
const nodes = [["building:zeemagazijn", complex]];
const all = complex;

const META = {
  name: "Het Scheepvaartmuseum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0363100012170236"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (122829,07, 487196,97), het zwaartepunt van het BAG-pand, op het maaiveld (NAP +2,3 m), +X langs de gevels naar het noordoosten (27,75 graden vanaf de RD-X-as) en +Y loodrecht daarop. Eén node building:zeemagazijn: 's Lands Zeemagazijn uit dakvlakken (vier vleugels onder een omlopend schilddak met nokken op +20,2 m, een goot op +18,8 m tussen de nokken, een tweede nok langs de binnenhof en een bolle glazen koepel op een massieve onderbouw), vier risalieten met zadeldak en fronton, 36 dakkapellen, vier schoorstenen, installatiekappen op de goot en een gevel met sokkel, kroonlijst en vensternissen, afgesneden op de BAG-contour. Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal of steiler dan 45 graden. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {"squareM": [70, 64], "eaveM": 15.5, "ridgeM": 20.2, "domeM": 20.3, "chimneyM": 23.0, "groundNapM": 2.3, "baseM": -0.5},
  sources: [
      "https://nl.wikipedia.org/wiki/Het_Scheepvaartmuseum",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/2205",
      "https://dokarchitecten.nl/project/pdf/56f2ae76332fa6082c23c219.en.pdf/Maritime-Museum-Amsterdam",
      "PDOK BAG pand 0363100012170236, EPSG:28992",
      "PDOK AHN DSM/DTM 0,5 m via WCS: vlakfits per dakvlak, de koepel, de dakkapellen en het maaiveld",
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
