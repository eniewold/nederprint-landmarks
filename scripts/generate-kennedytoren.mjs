// Kennedytoren (Kennedyplein / Fellenoord, Eindhoven, 2002; Van Aken Architectuur): kantoortoren met
// een plattegrond als parallellogram, waarvan de oostkant over de volle lengte 7,9 m uitkraagt boven
// een vlakke onderkant op circa 24 m hoogte. De toren staat in één BAG-pand met een lager complex van
// zes lagen: een westvleugel, een overdekte hal met glazen dak tussen westvleugel en toren, en een
// zuidvleugel langs het spoor. De noordgevels van toren, hal en westvleugel liggen op één schuine lijn.
// Contouren uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG (AHN5), de uitkraging en het gevelstramien
// uit foto's.
import { CrossSection, Manifold, ccw, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "kennedytoren";
// Gebouwstelsel: u langs de zuid- en westgevels van de vleugels (12,6° linksom op RD-oost, gemeten op
// de BAG-hoekpunten), v haaks erop naar het noorden. Oorsprong in het midden van de toren.
const ORIGIN = [161492.9, 383881.1];
const ANGLE = 12.6;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 15.91; // NAP, 3D BAG b3_h_maaiveld (15,913); straat zuid en voorplein 16,0, noord 16,4
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Schuine noord- en zuidgevel van de toren: 26,7° op de u-as (helling 0,503, BAG-hoekpunten op één
// lijn van de westvleugel tot de oostgevel van de toren).
const SKEW = 0.503;
const northV = (u) => 25.27 + SKEW * (u - 12.13); // door BAG (12,13, 25,27) en (-42,05, -2,01)
const southV = (u) => -12.83 + SKEW * (u - 12.16); // door BAG (12,16, -12,83) en (4,27, -16,80)
const band = (u0, u1) => [[u0, southV(u0)], [u1, southV(u1)], [u1, northV(u1)], [u0, northV(u0)]];

// ---------- Toren ----------
const TOWER_W = -12.3; // westgevel: AHN-DSM (dakrand -12,5…-12,0) en 3D BAG (-12,4…-11,9)
const TOWER_E = 12.15; // oostgevel: BAG-contour 12,13–12,16
const CORE_E = 4.27; // oostgevel onder de uitkraging, in lijn met de oostgevel van de zuidvleugel (BAG 4,26–4,27)
const TOWER = band(TOWER_W, TOWER_E); // 24,45 × 38,1 m
const CORE = band(TOWER_W, CORE_E);
const SOFFIT = 40.2; // onderkant van de uitkraging: 6 lagen onder, 15 lagen en de kroon erboven (foto's)
const STOREY = 3.38; // verdiepingshoogte: 15 lagen van +40,2 tot +90,9 m (foto's, gelijk aan de lagen eronder)
const CROWN_BOTTOM = 90.9; // lamellenkroon (installatieverdieping), 1,3 maal een verdieping hoog
const CROWN_TOP = 95.5; // buitenrand van de kroon (AHN-DSM 95,0–96,1 in een strook van 0,8 m langs de gevel)
const PARAPET = 98.85; // dakrand 0,8 m terug van de gevel (AHN-DSM 98,8–98,9; 3D BAG max 98,84)
const ROOF = 98.07; // dakvlak (3D BAG 98,05–98,07; DSM 98,0–98,2)
const PARAPET_INSET = 0.8, PARAPET_W = 1.0;
// Dakopbouwen (3D BAG-vlakken 100 en 101, ook op de luchtfoto).
const ROOF_BOXES = [
  { poly: [[-8.0, 4.4], [-4.0, 4.4], [-4.0, 6.1], [-8.0, 6.1]], top: 99.92 },
  { poly: [[-4.1, -0.5], [-1.6, -0.5], [-1.6, 2.0], [-4.1, 2.0]], top: 100.6 },
];

// ---------- Lage delen ----------
// Westvleugel en zuidvleugel: begane grond 4,0 m en vijf lagen van 3,38 m, dak op de 3D BAG-hoogte.
const WEST_WING = [[-42.15, -44.81], [-26.33, -44.81], [-26.33, northV(-26.33)], [-42.15, northV(-42.15)]];
const WEST_WING_ROOF = 38.6; // 3D BAG 38,53–38,65
const SOUTH_WING = [[-11.47, -44.8], [CORE_E, -44.8], [CORE_E, southV(CORE_E) + 0.5], [-11.47, southV(-11.47) + 0.5]];
const SOUTH_WING_ROOF = 38.55; // 3D BAG 38,54–38,56
// Hal tussen westvleugel en toren: glazen dak op +35,15 m dat aan de voorkant (zuid) afloopt naar +34,45 m.
const ATRIUM = [[-26.33, -35.41], [-11.47, -35.41], [-11.47, southV(-11.47) + 0.5], [TOWER_W + 0.5, southV(TOWER_W) + 0.5], [TOWER_W + 0.5, northV(TOWER_W + 0.5)], [-26.33, northV(-26.33)]];
const ATRIUM_ROOF = 35.15; // 3D BAG 35,11–35,17, DSM 34,9–35,3
const ATRIUM_FRONT = 34.45; // voorrand (3D BAG 34,37–34,57), helling vanaf v = -29,0 (35,69)
const ATRIUM_SLOPE_V = -29.0;
// Installatiekasten op de vleugeldaken (AHN-DSM 1,5–2,6 m boven het dak).
const PLANT = [
  { poly: [[-29.2, -36.2], [-26.8, -36.2], [-26.8, -33.4], [-29.2, -33.4]], top: 40.6 },
  { poly: [[-6.2, -36.0], [-3.8, -36.0], [-3.8, -33.0], [-6.2, -33.0]], top: 40.1 },
];

const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (sec, z0, z1) => Manifold.extrude(sec, z1 - z0).translate([0, 0, z0]);
function planeTop(poly, z0, z1, v0, v1) {
  // Prisma afgesneden door een vlak dat in v loopt van z0 (bij v0) naar z1 (bij v1).
  const b = (z1 - z0) / (v1 - v0), c = z0 - b * v0, n = Math.hypot(b, 1);
  return prism(poly, BASE, Math.max(z0, z1) + 1).trimByPlane([0, b / n, -1 / n], -c / n);
}

const towerSec = cs(TOWER);
const tower = union([
  prism(CORE, BASE, z(SOFFIT) + 0.01),
  prism(TOWER, z(SOFFIT), z(CROWN_TOP)),
  prismCs(towerSec.offset(-PARAPET_INSET, "Miter"), z(CROWN_TOP) - 0.01, z(PARAPET)),
]).subtract(prismCs(towerSec.offset(-PARAPET_INSET - PARAPET_W, "Miter"), z(ROOF), z(PARAPET) + 1));
const roofBoxes = ROOF_BOXES.map((b) => prism(b.poly, z(ROOF) - 0.05, z(b.top)));

const atriumRoof = (() => {
  const flat = prism(ATRIUM, BASE, z(ATRIUM_ROOF));
  const slope = planeTop(ATRIUM, z(ATRIUM_ROOF), z(ATRIUM_FRONT), ATRIUM_SLOPE_V, -35.41);
  // Vlak dak achter de helling, helling ervoor.
  const back = flat.intersect(prism([[-60, ATRIUM_SLOPE_V], [60, ATRIUM_SLOPE_V], [60, 60], [-60, 60]], BASE - 1, 200));
  const front = slope.intersect(prism([[-60, -60], [60, -60], [60, ATRIUM_SLOPE_V + 0.01], [-60, ATRIUM_SLOPE_V + 0.01]], BASE - 1, 200));
  return union([back, front]);
})();

// Glazen dak van de hal: liggers van 0,9 m breed en 0,5 m hoog om de 4,5 m in beide richtingen (de witte
// roosters op de luchtfoto), binnen het vlakke deel achter de helling.
const ATRIUM_RIB_W = 0.9, ATRIUM_RIB_H = 0.5, ATRIUM_RIB_STEP = 4.5;
const atriumRibs = (() => {
  const ribs = [];
  const u0 = -26.33, u1 = TOWER_W, v0 = ATRIUM_SLOPE_V, v1 = 30;
  for (let u = u0 + ATRIUM_RIB_STEP; u < u1 - 1; u += ATRIUM_RIB_STEP) ribs.push(prism([[u - ATRIUM_RIB_W / 2, v0], [u + ATRIUM_RIB_W / 2, v0], [u + ATRIUM_RIB_W / 2, v1], [u - ATRIUM_RIB_W / 2, v1]], z(ATRIUM_ROOF) - 0.1, z(ATRIUM_ROOF) + ATRIUM_RIB_H));
  for (let v = v0 + 2.5; v < v1; v += ATRIUM_RIB_STEP) ribs.push(prism([[u0, v - ATRIUM_RIB_W / 2], [u1, v - ATRIUM_RIB_W / 2], [u1, v + ATRIUM_RIB_W / 2], [u0, v + ATRIUM_RIB_W / 2]], z(ATRIUM_ROOF) - 0.1, z(ATRIUM_ROOF) + ATRIUM_RIB_H));
  // Alleen boven het dak van de hal, niet buiten de noordgevel.
  return union(ribs).intersect(prism(ATRIUM, z(ATRIUM_ROOF) - 0.2, z(ATRIUM_ROOF) + 1));
})();

const body = union([
  tower,
  ...roofBoxes,
  atriumRibs,
  prism(WEST_WING, BASE, z(WEST_WING_ROOF)),
  prism(SOUTH_WING, BASE, z(SOUTH_WING_ROOF)),
  atriumRoof,
  ...PLANT.map((p) => prism(p.poly, z(WEST_WING_ROOF) - 0.1, z(p.top))),
]);

// ---------- Gevelreliëf ----------
// Blinde nissen van 0,35 m per travee en verdieping, met 1 m materiaal erachter; de bovenkant loopt
// onder 45° zodat de nis na de printcorrectie open blijft.
const DEPTH = 0.35, SILL = 0.5, HEADER = 0.35;
const levels = (from, n, h) => Array.from({ length: n }, (_, k) => [from + h * k, h]);
const TOWER_FLOORS = levels(z(SOFFIT), 15, STOREY);
const GROUND_FLOOR = [[0, 4.0]];
const LOW_FLOORS = levels(4.0, 6, STOREY); // lagen van +19,91 tot +40,19 m
const cuts = [];
function facade(poly, floors, bay, pier, { minLen = 3.5, sill = SILL, header = HEADER, skipWE = false } = {}) {
  const p = ccw(poly);
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < minLen) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    if (skipWE && Math.abs(n[0]) > 0.9) continue;
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    const bays = Math.max(1, Math.round((L - pier) / bay)), w = (L - pier) / bays;
    for (const [zf, fh] of floors) {
      const lo = zf + sill, hi = zf + fh - header - DEPTH;
      if (hi - lo < 0.9) continue;
      for (let k = 0; k < bays; k++) {
        const s0 = pier + k * w, s1 = s0 + w - pier;
        if (s1 - s0 < 0.9) continue;
        const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
          const from = P(s, -3, h), hits = body.rayCast(from, P(s, 3, h));
          const at = (j) => hits[j] && Math.hypot(hits[j].position[0] - from[0], hits[j].position[1] - from[1]);
          return at(0) > 2.95 && at(0) < 3.05 && !(at(1) < 3 + DEPTH + 1);
        }));
        if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH), P(s1, -0.2, hi + DEPTH), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
      }
    }
  }
}
// Toren: dertien traveeën op de korte (schuine) gevels en achttien op de lange; lamellenkroon met twee
// liggende stroken per travee.
facade(TOWER, TOWER_FLOORS, 2.07, 0.9, { minLen: 20 });
facade(TOWER, [[z(CROWN_BOTTOM), 2.1], [z(CROWN_BOTTOM) + 2.1, 2.1]], 2.07, 0.9, { minLen: 20, sill: 0.4, header: 0.15 });
// Onderbouw van de toren, vleugels en hal: ruimere traveeën, begane grond alleen aan de straatkanten.
facade(CORE, LOW_FLOORS, 2.6, 1.0);
facade(CORE, GROUND_FLOOR, 2.6, 1.0, { sill: 0.9, skipWE: true });
facade(WEST_WING, levels(4.0, 5, STOREY), 2.6, 1.0);
facade(WEST_WING, GROUND_FLOOR, 2.6, 1.0, { sill: 0.9, skipWE: true });
facade(SOUTH_WING, levels(4.0, 5, STOREY), 2.6, 1.0);
facade(SOUTH_WING, GROUND_FLOOR, 2.6, 1.0, { sill: 0.9, skipWE: true });
facade(ATRIUM, levels(4.0, 4, STOREY), 2.6, 1.0);
facade(ATRIUM, GROUND_FLOOR, 2.6, 1.0, { sill: 0.9, skipWE: true });

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Kennedytoren: ${parts.length} losse delen`);
console.log("Kennedytoren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

// ---------- Bovengrondse delen op de parkeergarage (pand 0772100000936704) ----------
// De PDOK-reconstructie van de garage is een vlak op NAP +16,14 m met wanden naar de daken erboven; wat
// werkelijk boven de straat (+16,0…16,4 m) uitsteekt, staat in het AHN: een hellend plein tussen de
// westelijke buurpanden en twee hellende ingangen. Elk deel is een prisma vanaf de onderkant tot een
// vlak NAP = n0 + nu·(u - u0) + nv·(v - v0), gefit op het AHN-DSM/DTM (afwijking < 0,3 m).
function slopedSlab(poly, { n0, u0, v0, nu, nv, cap }) {
  // z = a u + b v + c in het modelstelsel; houd het deel onder het vlak.
  const a = nu, b = nv, c = n0 - nu * u0 - nv * v0 - GROUND, n = Math.hypot(a, b, 1);
  const s = prism(poly, BASE, z(cap)).trimByPlane([a / n, b / n, -1 / n], -c / n);
  return s;
}
// Plein tussen de buurpanden 0772100000354500 en 0772100000354499 (AHN-DTM, maaiveld): loopt op van
// +16,4 m aan de straat (v = 10) naar +19,7 m aan de noordrand (v = 56, BAG-contour van de garage) en
// helt licht naar het oosten. Westrand langs de verdiepte inrit (+13,1…15,7 m), oostrand tegen 0772100000354499.
const PLAZA = [[-58.5, 10.0], [-42.1, 10.0], [-42.1, 56.0], [-58.5, 56.0]];
const PLAZA_PLANE = { n0: 18.2, u0: -51, v0: 36, nu: -0.035, nv: 0.068, cap: 20.0 };
// Hellende ingang ten zuidwesten van de westvleugel (AHN-DSM): loopt op van de straat aan de zuidwestkant
// tot +21,3 m aan de noordoostkant (DSM 20,5–22,7 m in de hoge hoek).
const RAMP_SW = [[-62.5, -17.0], [-57.0, -21.5], [-53.0, -22.0], [-50.0, -20.0], [-46.0, -15.5], [-44.5, -13.0], [-45.5, -9.0], [-49.0, -8.5], [-55.0, -12.0], [-58.0, -14.0]];
const RAMP_SW_PLANE = { n0: 17.8, u0: -51, v0: -20, nu: 0.125, nv: 0.275, cap: 21.3 };
// Rode hellingbaan voor de noordgevel van het complex (AHN-DSM; deels pand 0772100001018431, dat geen
// PDOK-model heeft): hoog eind van +22,2 m aan de zuidkant, loopt af naar de straat op +17,8 m (v = 48,5).
const RAMP_NW = [[-4.5, 34.0], [0.5, 34.5], [4.4, 37.5], [4.4, 48.5], [-11.5, 48.5]];
const RAMP_NW_PLANE = { n0: 20.3, u0: -1, v0: 40, nu: -0.033, nv: -0.296, cap: 22.2 };
const garage = union([slopedSlab(PLAZA, PLAZA_PLANE), slopedSlab(RAMP_SW, RAMP_SW_PLANE), slopedSlab(RAMP_NW, RAMP_NW_PLANE)]);
if (garage.decompose().length !== 3) throw new Error("garagedelen: verwacht drie losse delen");
console.log("Garagedek en hellingbanen", garage.status(), "genus", garage.genus(), "driehoeken", garage.numTri());

await writeLandmark({
  slug,
  base: BASE,
  nodes: [
    ["building:kennedytoren-toren-met-uitkraging-hal-en-vleugels", building],
    ["building:kennedytoren-garagedek-en-hellingbanen", garage],
  ],
  catalog: {
    name: "Kennedytoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 59.831, // laagste PDOK-terrein op het voorplein en de straat aan de zuidkant (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-15, -42], [9, -46], [-20, -39], [-35, 12]],
    replacesBuildings: ["NL.IMBAG.Pand.0772100000354498", "NL.IMBAG.Pand.0772100000936704"],
    description:
      "Kennedytoren aan het Kennedyplein: toren met een parallellogram als plattegrond (24,45 m breed, schuine noord- en zuidgevel onder 26,7°, 38,1 m lang) tot de lamellenkroon op NAP +95,5 m, dakrand 0,8 m terug tot +98,85 m en dak op +98,07 m met twee dakopbouwen; de oostkant kraagt 7,9 m uit boven een vlakke onderkant op +40,2 m. Daaronder de westvleugel tot +38,6 m, de zuidvleugel tot +38,55 m en de hal met glazen dak op +35,15 m dat naar de voorkant afloopt tot +34,45 m, met installatiekasten op de vleugels; vensters per verdieping als blinde nissen. Contouren uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG. Oorsprong in het midden van de toren, X-as langs de zuidgevels van de vleugels (12,6° op RD-oost). Tweede node: de bovengrondse delen op de parkeergarage (pand 0772100000936704), waarvan de PDOK-reconstructie de toren meeneemt: een hellend plein tussen de westelijke buurpanden van +16,4 tot +19,7 m, een hellende ingang ten zuidwesten tot +21,3 m en de rode hellingbaan voor de noordgevel tot +22,2 m, als vlakken gefit op het AHN. Hoogte van de uitkraging, verdiepingshoogte, kroon en vensterstramien zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      crownNapM: [CROWN_BOTTOM, CROWN_TOP],
      soffitNapM: SOFFIT,
      cantileverM: +(TOWER_E - CORE_E).toFixed(2),
      towerWidthM: +(TOWER_E - TOWER_W).toFixed(2),
      towerLengthM: +(northV(0) - southV(0)).toFixed(2),
      skewDegrees: +((Math.atan(SKEW) * 180) / Math.PI).toFixed(1),
      storeyHeightM: STOREY,
      westWingRoofNapM: WEST_WING_ROOF,
      southWingRoofNapM: SOUTH_WING_ROOF,
      atriumRoofNapM: [ATRIUM_ROOF, ATRIUM_FRONT],
      atriumRibSpacingM: ATRIUM_RIB_STEP,
      facadeAngleDegrees: ANGLE,
      garagePlazaNapM: [16.4, 19.7],
      garageRampSouthWestTopNapM: RAMP_SW_PLANE.cap,
      garageRampNorthWestTopNapM: RAMP_NW_PLANE.cap,
      estimatedSoffit: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0772100000354498 (2002) en 0772100000936704 (2005, parkeergarage), actuele orthoHR, AHN-DSM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000354498",
      "https://nl.wikipedia.org/wiki/Kennedytoren",
      "https://commons.wikimedia.org/wiki/File:Kennedytoren_Eindhoven_in_2019.jpg",
      "https://commons.wikimedia.org/wiki/File:Kennedytoren_Eindhoven_2021.jpg",
      "https://commons.wikimedia.org/wiki/File:Kennedytoren_Eindhoven.JPG",
      "https://commons.wikimedia.org/wiki/File:Kennedy_tower_Eindhoven_-_panoramio.jpg",
      "https://commons.wikimedia.org/wiki/File:Buildings_Kennedyplein_Eindhoven.jpg",
      "https://commons.wikimedia.org/wiki/File:Kennedytoren01.jpg",
    ],
  },
});
