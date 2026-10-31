// Scheepvaart en Transport College (STC-gebouw, Lloydstraat 300, Lloydkwartier, Rotterdam, 2005,
// Neutelings Riedijk): school van de STC Group als een "periscoop". Een vierkante schacht van 16 lagen
// met bovenop een kop van vier lagen die 13 tot 20 m naar het westen uitkraagt (de vergaderzaal met een
// groot ingelijst venster naar de haven); aan de noordkant een onderbouw met een schuin dak dat van de
// toren naar het noorden afloopt, rondom aan de west- en zuidkant een lage vleugel van drie lagen met op
// de zuidwesthoek de witte doos met het grote venster naar de rivier. Langs de oostgevel staat de begane
// grond terug achter een rij V-kolommen. De gevels zijn een schaakbord van blauwe en zilvergrijze
// golfplaat met een raamstrook per laag.
// Contour uit de BAG, hoogtes uit de 3D BAG (AHN5 2022) en het AHN-DSM, gevelindeling uit foto's.
import { CrossSection, Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "stc-gebouw";
// Gebouwstelsel (u, v): u langs de zuid- en noordgevels naar het oosten (8,1° op RD-oost, BAG-randen
// 8,05–8,09°), v haaks erop naar het noorden. (u, v) = (0, 0) is de zuidoosthoek van de BAG-contour
// (RD 91306,41 / 435176,64). De westgevels lopen 12,9° scheef (BAG: -94,8° tegen 98,2° aan de oostkant).
// Het model ligt met de oorsprong in het hart van de schacht: x = u + 16,7, y = v - 18,7.
const ORIGIN = [91287.24, 435192.8];
const ANGLE = 8.1;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const SHIFT = [16.7, -18.7];
const GROUND = 3.0; // NAP, kade aan de oost- en zuidkant (AHN-DTM 2,99–3,05; west en noord 3,3–3,5)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 en AHN-DSM ----------
const LOW_WING = 15.2; // lage vleugel west en zuid (3D BAG 14,6–15,6; DSM 14,8–15,4)
const PODIUM_SOUTH = 26.77; // schuin dak van de onderbouw tegen de toren (3D BAG 26,73–26,76)
const PODIUM_NORTH = 19.24; // idem aan de noordgevel (3D BAG 19,24; DSM 19,3–19,7)
const PODIUM_SLOPE = 0.175; // 9,9° naar het noorden (3D BAG; DSM 25,0 op v = 45, 22,35 op v = 60)
const COURT = 64.2; // dak van de schacht, binnen het scherm van de bovenste laag (3D BAG en DSM 64,2)
const HEAD_ROOF = 67.4; // dak van de uitkragende kop (3D BAG 67,35–67,53; DSM daar ruis)
const RIM = 68.4; // dakrand/scherm rondom de kop (3D BAG 68,38–68,45)
const HEAD_BOTTOM = 52.4; // onderkant van de uitkraging (foto's: vier lagen plus vloerrand; geschat)
const PLANT = 69.2; // installatiekast midden op de schacht (3D BAG 69,15–69,2; DSM 69,1–69,4)
const PLANT_SOUTH = 69.85; // opstand langs de zuidkant van de kast (3D BAG 69,69–69,99)
const PLANT_NORTH = 69.77; // opstand langs de noordkant (3D BAG 69,76–69,78)
const DECK = 67.4; // lager plateau ten noorden van de kast (3D BAG 67,42–67,45)
const DECK_SMALL = 66.6; // klein plateau ervoor (3D BAG 66,54–66,6)
const CRANE = 71.6; // voet van de gevelonderhoudskraan (DSM 71,6)

// ---------- Plattegronden in (u, v) ----------
// BAG-westgevel: u = -62,43 + 0,2285 (v + 3,71); westgevel van de kop (3D BAG) 7,7 m oostelijker.
const westBag = (v) => -62.43 + 0.2285 * (v + 3.71);
const westHead = (v) => -53.3 + 0.2285 * (v - 2.6);
const EAST = -0.5; // oostgevel (DSM; BAG 0,0)
const SHAFT_W = -32.9; // westgevel van de schacht (BAG-knik op de zuidrand, rand van de AHN-ruis van de kop)
const SOUTH = 2.4; // zuidgevel van schacht en kop (DSM 1,9–2,5; 3D BAG 3,0; de BAG-rand op 0 is maaiveld)
const NORTH = 35.0; // noordgevel van schacht en kop (3D BAG 34,85–34,9; DSM 35,0–35,5)
const BAG_NORTH = 77.8;
// Hele voetafdruk (lage vleugel): BAG-contour, oost- en zuidrand van de schacht naar het DSM.
const FOOTPRINT = [[EAST, SOUTH], [EAST, 77.75], [-22.46, BAG_NORTH], [westBag(BAG_NORTH), BAG_NORTH], [-62.43, -3.71], [-32.92, -3.73], [SHAFT_W, SOUTH]];
// Onderbouw met schuin dak: ten noorden van de toren; ten westen van u = -33 pas vanaf v = 48,6 (3D BAG).
const PODIUM = [[EAST, NORTH - 0.1], [EAST, 77.75], [-22.46, BAG_NORTH], [westBag(BAG_NORTH), BAG_NORTH], [westBag(48.6), 48.6], [-33.2, 48.6], [-33.0, NORTH - 0.1]];
const SHAFT = rect(SHAFT_W, SOUTH, EAST, NORTH);
const HEAD = [[westHead(SOUTH), SOUTH], [EAST, SOUTH], [EAST, NORTH], [westHead(NORTH), NORTH]];
const CANTILEVER = [[westHead(SOUTH), SOUTH], [SHAFT_W + 0.1, SOUTH], [SHAFT_W + 0.1, NORTH], [westHead(NORTH), NORTH]];
const RIM_WIDTH = 1.0; // het scherm is in werkelijkheid dunner; 1,0 m voor de print

// ---------- Lagen ----------
// Begane grond 4,6 m, daarboven lagen van 3,8 m: lage vleugel 3 lagen (12,2 m), onderbouw 6 lagen tegen
// de toren, schacht 16 lagen tot het dak van +64,2 met een schermlaag erboven; de kop telt vier lagen.
const STOREY = 3.8;
const FLOORS = [[0, 4.6], ...Array.from({ length: 16 }, (_, k) => [4.6 + STOREY * k, STOREY])];
const DEPTH = 0.35;

const roofPlane = (poly, b, c, top = 40) => {
  const n = Math.hypot(b, 1);
  return prism(poly, BASE, top).trimByPlane([0, b / n, -1 / n], -c / n);
};
const podiumC = z(PODIUM_SOUTH) + PODIUM_SLOPE * (NORTH - 0.1);
const rimRing = Manifold.extrude(new CrossSection([HEAD]).subtract(new CrossSection([HEAD]).offset(-RIM_WIDTH, "Miter")), z(RIM) - z(COURT) + 0.1).translate([0, 0, z(COURT) - 0.1]);

let body = union([
  prism(FOOTPRINT, BASE, z(LOW_WING)),
  roofPlane(PODIUM, -PODIUM_SLOPE, podiumC),
  prism(SHAFT, BASE, z(COURT)),
  prism(CANTILEVER, z(HEAD_BOTTOM), z(HEAD_ROOF)),
  rimRing,
  prism(rect(-32.4, 11.9, -10.9, 24.0), z(COURT) - 0.1, z(PLANT)),
  prism(rect(-32.2, 9.9, -11.5, 12.0), z(COURT) - 0.1, z(PLANT_SOUTH)),
  prism(rect(-37.7, 23.9, -10.7, 25.0), z(COURT) - 0.1, z(PLANT_NORTH)),
  prism(rect(-32.4, 24.9, -14.0, 28.3), z(COURT) - 0.1, z(DECK)),
  prism(rect(-25.7, 28.2, -20.2, 32.4), z(COURT) - 0.1, z(DECK_SMALL)),
  prism(rect(-16.0, 18.0, -14.0, 20.0), z(PLANT) - 0.1, z(CRANE)),
]);
const solidBody = body;

// ---------- Gevelreliëf ----------
const cuts = [];
// Raamstrook per vak van 3,6 m (vensters 2,7 m breed, 1,5 m hoog onderin de laag, de golfplaat erboven)
// als blinde nis van 0,35 m met een plafond onder 45°, alleen waar de rand op die hoogte buitengevel is.
function face(a, b, floors, { pitch = 3.6, width = 2.7 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < pitch) return;
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const bays = Math.floor(L / pitch), w = (L - bays * pitch) / 2;
  for (const [zf, fh] of floors) {
    const lo = zf + 0.6, hi = zf + (fh > 4 ? 3.4 : 2.1) - DEPTH;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * pitch + (pitch - width) / 2, s1 = s0 + width;
      const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH + 0.4].every((h) => {
        const from = P(s, -3, h), hit = solidBody.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
// Ingelijst venster: nis met een rand van `side`, `bottom` en `top` m, `depth` diep, plafond onder 45°.
function framed(a, b, z0, z1, { side, bottom, top, depth }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, dd, h) => [a[0] + d[0] * s - n[0] * dd, a[1] + d[1] * s - n[1] * dd, h];
  const lo = z0 + bottom, hi = z1 - top;
  return Manifold.hull([side, L - side].flatMap((s) => [P(s, -0.5, lo), P(s, depth, lo), P(s, depth, hi - depth), P(s, 0, hi), P(s, -0.5, hi + 0.5)]));
}
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
const isEast = ([a, b]) => Math.abs(a[0] - EAST) < 0.01 && Math.abs(b[0] - EAST) < 0.01;
const upper = FLOORS.slice(1);
// Kop en schacht (de kop-polygoon draagt ook de oost-, zuid- en noordgevel van de schacht); niet op de
// westgevel van de kop, daar zit het grote venster.
for (const [a, b] of edges(HEAD)) {
  const west = a[0] < -40 && b[0] < -40;
  if (!west) face(a, b, isEast([a, b]) ? upper : FLOORS);
}
face([SHAFT_W, NORTH], [SHAFT_W, SOUTH], FLOORS);
// Lage vleugel: niet op de zuidgevel van de witte doos (groot venster) en niet langs de oostgevel.
const BOX_SOUTH = [[-62.43, -3.71], [-32.92, -3.73]];
for (const [a, b] of edges(FOOTPRINT)) {
  if (isEast([a, b]) || (a[1] < -3 && b[1] < -3)) continue;
  face(a, b, FLOORS.slice(0, 3));
}
for (const [a, b] of edges(PODIUM)) face(a, b, isEast([a, b]) ? upper.slice(0, 5) : FLOORS.slice(0, 6));
// Grote vensters: de westkop (vergaderzaal, naar de haven) en de witte doos (naar de rivier).
cuts.push(framed([westHead(NORTH), NORTH], [westHead(SOUTH), SOUTH], z(HEAD_BOTTOM), z(RIM), { side: 1.8, bottom: 3.0, top: 2.6, depth: 1.2 }));
cuts.push(framed(BOX_SOUTH[0], BOX_SOUTH[1], 0, z(LOW_WING), { side: 1.5, bottom: 1.5, top: 2.0, depth: 1.0 }));

// Arcade langs de oostgevel (en de eerste travee van de zuidgevel bij de zuidoosthoek): begane grond
// 2,4 m teruggelegd, plafond onder 45° van +2,2 tegen de pui naar +4,6 aan de gevel.
const ARC_H = 4.6, ARC_D = 2.4, ARC_SOUTH_W = EAST - 7.5;
const arcadeEast = Manifold.hull([SOUTH - 1, 78.8].flatMap((v) => [[EAST + 1, v, 0], [EAST - ARC_D, v, 0], [EAST - ARC_D, v, ARC_H - ARC_D], [EAST, v, ARC_H], [EAST + 1, v, ARC_H + 1]]));
const arcadeSouth = Manifold.hull([ARC_SOUTH_W, EAST + 1].flatMap((u) => [[u, SOUTH - 1, 0], [u, SOUTH + ARC_D, 0], [u, SOUTH + ARC_D, ARC_H - ARC_D], [u, SOUTH, ARC_H], [u, SOUTH - 1, ARC_H + 1]]));
cuts.push(arcadeEast, arcadeSouth);

// V-kolommen in het gevelvlak, 0,9 m diep: per travee twee poten van 1,1 m van de bovenhoeken naar
// een voet in het midden.
function vColumns(P, s0, s1, bays) {
  const pitch = (s1 - s0) / bays, legs = [];
  for (let k = 0; k < bays; k++) {
    const a = s0 + k * pitch, b = a + pitch, m = (a + b) / 2;
    for (const [t0, t1] of [[a, a + 1.1], [b - 1.1, b]]) {
      legs.push(Manifold.hull([0, 0.9].flatMap((dd) => [P(t0, dd, ARC_H + 0.1), P(t1, dd, ARC_H + 0.1), P(m - 0.55, dd, -0.1), P(m + 0.55, dd, -0.1)])));
    }
  }
  return legs;
}
const V_EAST = vColumns((s, dd, h) => [EAST - dd, s, h], SOUTH, 77.75, 10);
const V_SOUTH = vColumns((s, dd, h) => [s, SOUTH + dd, h], ARC_SOUTH_W, EAST, 1);

body = union([body.subtract(union(cuts)), ...V_EAST, ...V_SOUTH]).translate([SHIFT[0], SHIFT[1], 0]);
const parts = body.decompose();
if (parts.length !== 1) throw new Error(`STC: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("STC", body.status(), "genus", body.genus(), "driehoeken", body.numTri(), "nissen", cuts.length);

const toModel = ([u, v]) => [+(u + SHIFT[0]).toFixed(2), +(v + SHIFT[1]).toFixed(2)];
await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:stc-gebouw", body]],
  catalog: {
    name: "Scheepvaart en Transport College (STC)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.5, // NAP + 43,5 (NLGEO2018 43,62; Lloydtoren 47,1 bij NAP +3,6)
    groundOffsetMetres: -0.15,
    // Kade en straat rondom (AHN-DTM 3,0 oost en zuid, 3,3–3,5 west en noord), niet in het water.
    groundSamplePoints: [[19.5, -8.7], [19.5, 21.3], [19.5, 51.3], [6.7, -21], [-3.3, -21], [-25, -25.5], [-48, -8.7], [-40, 21.3], [-20, 62]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000750477"],
    description:
      "Scheepvaart en Transport College (STC-gebouw) aan de Lloydstraat in het Lloydkwartier: een schacht van 32,4 × 32,6 m tot NAP +64,2 m met een scherm tot +68,4 en installaties tot +69,9 (kraanvoet +71,6), bovenop een kop van vier lagen die 13 tot 20 m naar het westen uitkraagt (onderkant +52,4, dak +67,4) met een ingelijst venster in de westkop; ten noorden een onderbouw met een schuin dak van +26,8 tegen de toren naar +19,2 aan de noordgevel, rondom aan de west- en zuidkant een lage vleugel tot +15,2 met het grote venster van de witte doos naar de rivier, langs de oostgevel een teruggelegde begane grond achter V-kolommen, en per laag een raamstrook per vak van 3,6 m. Contour uit de BAG, hoogtes uit de 3D BAG (AHN5) en het AHN-DSM. Oorsprong in het hart van de schacht, X-as langs de zuidgevel (8,1° op RD-oost). Onderkant van de kop, verdiepingshoogtes, vensters, de diepte van de arcade en de V-kolommen zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      lowWingNapM: LOW_WING,
      podiumRoofNapM: [PODIUM_SOUTH, PODIUM_NORTH],
      podiumRoofSlopeDegrees: +((Math.atan(PODIUM_SLOPE) * 180) / Math.PI).toFixed(1),
      shaftRoofNapM: COURT,
      headRoofNapM: HEAD_ROOF,
      rimNapM: RIM,
      headUndersideNapM: HEAD_BOTTOM,
      plantNapM: [PLANT, PLANT_NORTH, PLANT_SOUTH],
      craneBaseNapM: CRANE,
      shaftPlanM: [+(EAST - SHAFT_W).toFixed(2), +(NORTH - SOUTH).toFixed(2)],
      cantileverM: [+(SHAFT_W - westHead(SOUTH)).toFixed(2), +(SHAFT_W - westHead(NORTH)).toFixed(2)],
      floors: 16,
      storeyHeightM: STOREY,
      architect: "Neutelings Riedijk",
      completed: 2005,
      facadeAngleDegrees: ANGLE,
      modelCentre: toModel([-16.7, 18.7]),
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000750477 (bouwjaar 2005, onderwijsfunctie), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG NL.IMBAG.Pand.0599100000750477 (LoD2.2, puntenwolk AHN5 2022)",
      "https://neutelings-riedijk.com/shipping-and-transport-college/",
      "https://www.architectureguide.nl/project/item/prj_id/1952/alfa/S",
      "https://commons.wikimedia.org/wiki/File:STC_Lloydstraat.jpg",
      "https://commons.wikimedia.org/wiki/File:Shipping_and_Transport_College_-_panoramio.jpg",
      "https://commons.wikimedia.org/wiki/File:Scheepvaart_en_Transport_College_-_Lloydstraat_-_Rotterdam_(28872432443).jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_Scheepvaart_en_Transport_College_(5).jpg",
    ],
  },
});
