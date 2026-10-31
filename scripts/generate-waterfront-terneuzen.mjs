// Woontoren Waterfront (Waterfront 200, Terneuzen, 2004–2005, Roodbeen Architectuur): woontoren van 26 lagen aan
// de Westerscheldedijk, het hoogste gebouw van Zeeland. Een slanke hoofdschijf van 10,8 × 22,8 m tot NAP +82,1 m
// met daarnaast, 60° gedraaid, een lagere vleugel van 10,2 × 17,1 m tot +70,7 m; tussen beide een verbindingsdeel
// dat aan de kant van de schijf mee omhoog gaat. Witte en donkere gevelpanelen met kleine vensters in kolommen.
// De toren staat in een halfverdiepte parkeergarage (tweede BAG-pand) waarvan het dek met zonnepanelen en gras
// aansluit op het dijklichaam; aan het plein en de vijver aan de zuidkant staat de garagewand 3,3 m hoog. In de
// hoek tussen garagewand, schijf en vleugel ligt de entree onder een hellend glasdak.
// Contouren uit de BAG, hoogtes uit de 3D BAG (AHN5) en het AHN-DSM, gevelindeling uit foto's.
import { Manifold, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "waterfront-terneuzen";
// Gebouwstelsel: u langs de korte noord- en zuidgevel van de schijf naar het oosten (3,96° op RD-oost, BAG-randen
// evenwijdig binnen 0,1°), v langs de lange gevels naar het noorden. Oorsprong in het hart van de schijf.
const ORIGIN = [46763.0, 373243.0];
const ANGLE = 3.96;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 2.95; // NAP, plein aan de zuidkant (AHN-DTM 2,9–3,0; 3D BAG-maaiveld 2,95)
const BASE = -1.5; // onder de vijver langs de garagewand door
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const TOWER_ROOF = 82.07; // dak van de schijf (3D BAG-dakvlak 82,05–82,10; AHN-DSM p50 82,06)
const WING_ROOF = 70.65; // dak van de vleugel en het lage deel van de verbinding (3D BAG 70,60–70,73; DSM p50 70,65)
const PLANT_TOP = 83.45; // installatiekast op de schijf (3D BAG 83,37–83,43; DSM 83,3–84,0)
const WING_BOX_A = 72.05; // installatiekast op de vleugel (DSM 71,9–72,0)
const WING_BOX_B = 72.6; // dakopbouw op de vleugel (DSM 72,2–73,8, schatting voor het blok)
const DECK = 6.25; // parkeerdek (DSM p50 6,21 over het dek; AHN-DTM rekent het dek tot het maaiveld)
// Glasdak van de entree: vlak z = 9,29 + 0,223 v (kleinste-kwadraten op het DSM, 6,5 aan de garagewand, 5,2 voor)
const ENTRY_PLANE = [0, 0.223, 9.29];

// ---------- Plattegronden in (u, v), BAG-contouren ----------
// Hoge deel: de schijf plus het deel van de verbinding dat tot het dak doorloopt (3D BAG-dakvlak op 82,07).
const HIGH = [[-5.28, -11.14], [5.52, -11.14], [5.52, -8.96], [6.76, -8.96], [6.76, -7.44], [8.87, -7.44], [8.87, -6.23], [9.6, -6.23], [11.82, -0.22], [5.5, 3.42], [5.51, 11.67], [-5.28, 11.67]];
// Lage deel: de vleugel (rechthoek 60° gedraaid) en de rest van de verbinding (3D BAG-dakvlak op 70,6).
const LOW = [[8.59, -14.55], [17.42, -19.66], [25.97, -4.84], [17.12, 0.26], [15.59, -2.38], [11.82, -0.22], [9.6, -6.23], [13.37, -6.23]];
// Parkeergarage: kwartcirkel tegen de dijk, zuidwand langs het plein en de vijver.
const GARAGE = [[-24.07, -12.6], [33.31, -12.6], [33.46, -12.28], [32.25, -8.13], [30.75, -3.33], [28.66, 1.27], [26.2, 5.2], [22.83, 9.45], [19.12, 12.85], [15.26, 16.04], [11.19, 18.98], [6.84, 21.51], [2.29, 23.61], [-2.47, 25.28], [-7.41, 26.45], [-11.12, 27.03], [-14.66, 27.29], [-18.82, 27.46], [-24.0, 27.45]];
// Entree: driehoek tussen garagewand, schijf en vleugel (ortho en DSM; geen BAG-pand).
const ENTRY = [[1.4, -12.6], [9.71, -12.6], [8.59, -14.55], [5.3, -18.2]];
const PLANT = [[0.6, 1.9], [3.0, 1.9], [3.0, 1.4], [5.0, 1.4], [5.0, 3.0], [3.0, 3.0], [3.0, 6.4], [0.6, 6.4]];
const BOX_A = [[11.8, -10.2], [14.0, -10.2], [14.0, -7.5], [11.8, -7.5]];
const BOX_B = [[18.5, -10.6], [21.5, -10.6], [21.5, -8.4], [18.5, -8.4]];

const plane = (poly, [a, b, c], top) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, top).trimByPlane([a / n, b / n, -1 / n], -(c - GROUND) / n);
};

const towerMass = union([
  prism(HIGH, BASE, z(TOWER_ROOF)),
  prism(LOW, BASE, z(WING_ROOF)),
  prism(PLANT, z(TOWER_ROOF) - 0.1, z(PLANT_TOP)),
  prism(BOX_A, z(WING_ROOF) - 0.1, z(WING_BOX_A)),
  prism(BOX_B, z(WING_ROOF) - 0.1, z(WING_BOX_B)),
]);
const footprint = union([prism(HIGH, BASE - 1, 200), prism(LOW, BASE - 1, 200)]);
const garage = prism(GARAGE, BASE, z(DECK)).subtract(footprint);
const entry = plane(ENTRY, ENTRY_PLANE, 20).subtract(footprint);
const all = union([towerMass, garage, entry]);

// ---------- Gevelreliëf ----------
// Lagen: entreelaag van 4,2 m op pleinniveau (tot boven het parkeerdek), daarboven 25 woonlagen van 2,95 m
// (26 lagen, R+25 volgens de hoogbouwlijsten); de vleugel heeft 21 woonlagen.
const STOREY = 2.95;
const FLOORS = [[0, 4.2], ...Array.from({ length: 25 }, (_, k) => [4.2 + STOREY * k, STOREY])];
const upTo = (nap) => FLOORS.filter(([zf, fh]) => zf + fh <= z(nap) - 0.3);
const DEPTH = 0.35;
const cuts = [];
// Vensterkolommen langs de rand a→b (buitennormaal rechts van de looprichting) op afstanden `cols` vanaf a: per
// laag een blinde nis van `width` breed met een plafond onder 45°, alleen waar de gevel buitengevel is.
function face(a, b, cols, floors, { width = 1.3, sill = 0.9, header = 0.35 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
    if (hi - lo < 0.9) continue;
    for (const c of cols) {
      const s0 = c - width / 2, s1 = c + width / 2;
      if (s0 < 0.9 || s1 > L - 0.9) throw new Error(`venster buiten de rand (${a} → ${b}, ${c})`);
      const exposed = [s0 + 0.1, c, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = all.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const high = upTo(TOWER_ROOF), low = upTo(WING_ROOF);
// Schijf. Westgevel (foto vanaf de dijk): vier vensterkolommen op 3,2, 8,3, 13,2 en 19,1 m vanaf de noordhoek;
// noordgevel (donkere panelen): twee kolommen; zuid- en oostgevel naar analogie.
face([-5.28, 11.67], [-5.28, -11.14], [3.2, 8.3, 13.2, 19.1], high);
face([5.51, 11.67], [-5.28, 11.67], [2.95, 7.9], high);
face([-5.28, -11.14], [5.52, -11.14], [3.0, 7.8], high);
face([5.5, 3.42], [5.51, 11.67], [2.3, 6.0], high);
face([11.82, -0.22], [5.5, 3.42], [2.2, 5.1], high);
face([9.6, -6.23], [11.82, -0.22], [3.2], high.filter(([zf]) => zf >= z(WING_ROOF)));
// Vleugel: kolommen op een stramien van circa 4 m.
face([8.59, -14.55], [17.42, -19.66], [2.8, 7.4], low);
face([17.42, -19.66], [25.97, -4.84], [2.6, 6.6, 10.5, 14.5], low);
face([25.97, -4.84], [17.12, 0.26], [2.8, 7.4], low);
face([15.59, -2.38], [11.82, -0.22], [2.2], low);
face([13.37, -6.23], [8.59, -14.55], [2.6, 6.6], low);

const tower = towerMass.subtract(union(cuts));
const nodes = [
  ["toren", tower],
  ["parkeergarage", garage],
  ["entree", entry],
].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "volume", m.volume().toFixed(0));
  return [`building:${slug}-${name}`, m];
});
console.log("nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Woontoren Waterfront",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    // NLGEO2018-geoïde ter plekke 44,46 min de afwijking van SnowWorld Terneuzen (-0,12): 44,34 boven NAP.
    groundHeight: 47.29,
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[0, -20.5], [12, -22], [22, -21]],
    replacesBuildings: ["NL.IMBAG.Pand.0715100000024539", "NL.IMBAG.Pand.0715100000041714"],
    description:
      "Woontoren Waterfront (Waterfront 200, Roodbeen Architectuur, 2005) aan de Westerscheldedijk in Terneuzen, het hoogste gebouw van Zeeland: een schijf van 10,8 × 22,8 m op de BAG-contour tot NAP +82,07 m met een installatiekast tot +83,45 m, daarnaast een 60° gedraaide vleugel van 10,2 × 17,1 m tot +70,65 m met twee dakopbouwen, en een verbindingsdeel dat aan de kant van de schijf tot het hoge dak doorloopt; per laag vensterkolommen als blinde nissen (entreelaag van 4,2 m en 25 woonlagen van 2,95 m). De toren staat in de halfverdiepte parkeergarage (tweede BAG-pand, kwartcirkel tegen de dijk) met het dek op +6,25 m, dat aan de dijkkant gelijk ligt met het maaiveld en aan het plein en de vijver een wand van 3,3 m vormt; in de hoek tussen garagewand, schijf en vleugel de entree onder een hellend glasdak (6,5 naar 5,2 m), geen BAG-pand. Dakhoogtes uit de 3D BAG (AHN5) en het AHN-DSM, maaiveld het plein op +2,95 m. Oorsprong in het hart van de schijf, X-as langs de korte noord- en zuidgevel (3,96° op RD-oost). Verdiepingshoogtes, vensterkolommen (alleen de westgevel van een foto), de vorm van de dakopbouwen en de entree als dicht volume zijn geschat; groundHeight is de geoïde min de afwijking van SnowWorld Terneuzen.",
    realWorld: {
      groundNapM: GROUND,
      towerRoofNapM: TOWER_ROOF,
      wingRoofNapM: WING_ROOF,
      plantNapM: PLANT_TOP,
      wingBoxesNapM: [WING_BOX_A, WING_BOX_B],
      garageDeckNapM: DECK,
      entryGlassRoofNapM: [6.5, 5.2],
      towerPlanM: [10.79, 22.81],
      wingPlanM: [10.2, 17.1],
      wingRotationDegrees: 60,
      floors: { total: 26, groundFloorM: 4.2, storeyHeightM: STOREY },
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0715100000024539 (woontoren, bouwjaar 2004) en 0715100000041714 (parkeergarage, bouwjaar 2004), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG (LoD2.2, AHN5 2024) van beide panden",
      "https://www.pss-archi.eu/immeubles/NL-715-63550.html",
      "https://commons.wikimedia.org/wiki/File:TerneuzenDeich.JPG",
      "https://commons.wikimedia.org/wiki/File:Terneuzen_-_Skyline_langs_de_Westerschelde.jpg",
    ],
  },
});
