// Genereert een gesloten 3D-model van het Kröller-Müller Museum in Otterlo (Nationaal Park
// De Hoge Veluwe), opgebouwd uit bouwdelen en dakvlakken (geen AHN-hoogteveld):
//  - het museum van Henry van de Velde (1937-1938): gesloten bakstenen zalen met eigen
//    hoogtes, een westvleugel met lessenaarsdak, twee zalen met een flauw glazen zadeldak en
//    lichtkappen, het vierkante zalenblok rond de open binnenhof met de vijver, een
//    lessenaarsdak naar het oosten, het hoge zalenblok met een afgeknot schilddak en een
//    lichtkap in het plateau, en de zuidvleugel met drie lichtstraten, een lage rand en een
//    hoge zaal met schilddak boven de afgeschuinde kop (de latere uitbreiding van Van de Velde);
//  - de uitbreiding van Wim Quist (1969-1977): lange glazen gangen onder dunne platte daken
//    (de gevel 0,6 m terug onder een dakrand met een schuine kraag van 43 graden), de
//    entreehal, de hoge zaal met het witte dak (+8,3 m) en een goot, met de open hof ernaast, het
//    paviljoen in het zuidoosten (+9,5 m), de dienstvleugel met een hoge strook (+7,6 m), de
//    zaal met het glasdak in het noorden (+7,6 m) en het depot met twee velden van negen rijen zonnepanelen.
// Hoogtes zijn uit het AHN-DSM (PDOK WCS, 0,5 m; mediaan per zone, profielen dwars op de
// zalen), de indeling uit de BAG-contour en de PDOK-luchtfoto (8 cm). Alle maten in het
// script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-kroller-muller.mjs              # 1:1000 (standaard)
//   node scripts/generate-kroller-muller.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (184490, 456500), een rond punt in het hart van het complex
// (het plein tussen de oostkop van Van de Velde en de gang van Quist), z = 0 op NAP +37,8 m
// (het pad langs de noordgevel). +X (u) loopt langs de gevels van Van de Velde naar het
// oost-noordoosten (23,96 graden tegen de klok in vanaf de RD-X-as, de lengtegewogen richting
// van alle BAG-randen), +Y (v) loodrecht daarop naar het noord-noordwesten, langs de gangen.
// Het terrein loopt van NAP +39,8 m (zuid) tot +34,2 m (noordkant van het depot); daarom
// beginnen alle onderdelen op dezelfde vlakke onderkant 4,2 m onder z = 0.
//
// Bronnen: PDOK BAG-pand 0228100000019793 (het hele museum: Van de Velde, Quist en het
// depot) en 0228100000055941 (in de hof van Quist; AHN en luchtfoto tonen daar een open hof);
// AHN DSM/DTM 0,5 m (PDOK WCS); PDOK luchtfoto; Wikipedia; foto's op Wikimedia Commons.
// Geschat: de maten van de lichtkappen (luchtfoto), de kraag onder de dakranden van Quist
// (0,6 m terug, foto's), de borstweringen (0,3 m), de lichtstraten op de zuidvleugel en de
// rijen zonnepanelen (+0,1 tot +0,35 m). Weggelaten: de beeldentuin, het Rietveldpaviljoen en
// de andere paviljoens (eigen panden), de bomen, kleine installaties op het dak van de
// dienstvleugel (onder 0,9 m), glasroeden, gevelopschriften en het logo.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kroller-muller");
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
const rect = ([u0, u1, v0, v1]) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const section = (rects) => CrossSection.union(rects.map((r) => new CrossSection([ccw(rect(r))])));
const extrude = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
const box = (u0, u1, v0, v1, z0, z1) => Manifold.cube([u1 - u0, v1 - v0, z1 - z0]).translate([u0, v0, z0]);
// Veelhoek met punten [v, z] uitgetrokken langs u van u0 tot u1.
const profileU = (pts, u0, u1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), u1 - u0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, u0, 0, 0, 1]);
// Veelhoek met punten [u, z] uitgetrokken langs v van v0 tot v1.
const profileV = (pts, v0, v1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), v1 - v0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, v1, 0, 1]);
// Dakvlak z = a u + b v + c boven een doorsnede (planvergelijking).
const roofPlane = (cs, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return extrude(cs, BASE, 40).trimByPlane([a / n, b / n, -1 / n], -c / n);
};

const SLUG = "kroller-muller";

// ---------- maten (meters, z = hoogte boven NAP +37,8 m) ----------
const ORIGIN = [184490, 456500];
const X_AXIS = [0.913836, 0.406104]; // 23,96 graden, langs de gevels
const BASE = -4.2; // gemeenschappelijke onderkant (laagste maaiveld NAP +34,2 m min 0,5 m)
const RIM = 0.6; // breedte van borstwering en dakrand

// BAG-contour (pand 0228100000019793) in het lokale stelsel, haaks rechtgetrokken op 0,05 m
// (oppervlak 10.978 m2, BAG 10.979 m2). Het gat in de BAG-ring (de hof van Quist) staat
// hieronder als HOF_QUIST op de plek die het AHN toont.
const FOOTPRINT = bagContour();
const FP = new CrossSection([ccw(FOOTPRINT)]);

// ---------- Van de Velde (1938) ----------
// Westvleugel: lessenaarsdak van 4,2 m (westgevel) naar 4,9 m tegen de eerste zaal.
const W1 = { rect: [-126, -115.6, -30.9, -10], a: 0.075, c: 4.2 + 0.075 * 124.85 };
// Lage zalen aan de zuidwestkant: plat dak +3,95 m achter een borstwering tot +4,25 m.
const W_SOUTH = { rects: [[-126, -104.7, -41, -30.9]], top: 4.25 };
// Zalen met een flauw zadeldak (glas) tussen de borstweringen: goot en nok uit de profielen
// dwars op de zaal (mediaan over 15 m lengte, 0,5 m stappen).
const HALL_1 = { rect: [-115.6, -90.45, -30.9, -14.3], eave: 5.3, ridge: 5.88 };
const HALL_2 = { rect: [-64.3, -39.75, -30.65, -13.9], eave: 5.4, ridge: 6.0 };
// Het vierkante zalenblok rond de binnenhof: plat dak +5,85 m, borstwering +6,15 m.
const RING = { rects: [[-90.45, -64.3, -41, -13.9], [-91, -64.5, -13.9, -4]], top: 6.15 };
const COURT_VDV = [-82.3, -71.7, -32.0, -12.0]; // open binnenhof met vijver (AHN op maaiveld)
// Oostelijk lessenaarsdak van 5,35 m naar 4,38 m en de lage strook ten noorden ervan.
const EAST_SLOPE = { rect: [-39.75, -30.05, -30.65, -13.9], a: -0.1, c: 5.35 - 0.1 * 39.75 };
const EAST_LOW = { rects: [[-39.75, -30.05, -13.9, -10]], top: 4.45 };
const SOUTH_LOW = { rects: [[-49.9, -29.7, -41, -30.65]], top: 4.35 };
// Hoog zalenblok: goot +6,2 m, afgeknot schilddak tot het plateau met de lichtkap (+7,4 m).
const HIGH = { rect: [-30.05, -12.05, -28.6, -16.3], eave: 6.2, top: 7.4, plateau: [-26, -16.5, -23.2, -20.0] };
// Zuidvleugel: noordelijk deel +5,85 m (borstwering +6,1 m) met drie lichtstraten; zuidelijk
// deel een lage rand (+5,5 m) rond de hoge zaal (goot +8,0 m, schilddak met nok +8,6 m).
const SOUTH_WING = { rects: [[-30.05, -11, -47.5, -31.35], [-30.05, -13.2, -31.35, -28.5]], top: 6.1 };
const SOUTH_RIDGES = { us: [-25.8, -21.2, -16.2], v0: -46, v1: -30, half: 0.8, ridge: 6.25 };
const SOUTH_BAND = { rects: [[-30.05, -11, -65, -47.5]], top: 5.5 };
const SOUTH_HALL = { rect: [-26.5, -15.0, -61.5, -47.5], eave: 8.0, ridge: 8.6, ridgeV: [-57.5, -51.5] };

// Lichtkappen op de daken (u-midden, v-midden, breedte u, diepte v), uit de luchtfoto; ze
// steken 0,3 m boven het dakvlak uit.
const SKYLIGHTS = [
  // zaal 1: twee rijen van drie, en een smalle lichtkap aan de westkant
  [-105.2, -16.2, 3.2, 1.6], [-98.3, -16.2, 3.0, 1.6], [-105.2, -21.4, 3.2, 2.0], [-98.3, -21.4, 3.0, 2.0],
  [-105.2, -26.5, 3.2, 1.8], [-98.3, -26.5, 3.0, 1.8], [-112.4, -21.4, 1.6, 4.4],
  // zaal 2: drie rijen van drie en een strook aan de westkant
  [-57.1, -16.0, 3.0, 1.6], [-50.1, -16.0, 3.0, 1.6], [-43.05, -16.0, 3.0, 1.6],
  [-57.1, -21.15, 3.0, 1.9], [-50.1, -21.15, 3.0, 1.9], [-43.05, -21.15, 3.0, 1.9],
  [-57.1, -26.6, 3.0, 2.0], [-50.1, -26.6, 3.0, 2.0], [-43.05, -26.6, 3.0, 2.0], [-63.4, -21.0, 1.6, 10.8],
  // zalenblok rond de hof: lichtstroken in de noord-, zuid- en westarm
  [-79.4, -7.6, 7.8, 2.0], [-79.8, -35.9, 7.0, 1.8], [-89.0, -21.5, 1.6, 9.0],
  // oostelijk lessenaarsdak: twee lichtstroken
  [-37.8, -21.8, 2.0, 4.4], [-32.6, -21.2, 2.0, 7.2],
];

// ---------- Quist (1969-1977) ----------
// Glazen gangen: dakvlak +3,75 m, dakrand +4,15 m; de gevel staat 0,6 m terug onder een
// dakplaat van 0,9 m met een kraag van 43 graden.
const GALLERY = {
  h: 3.75,
  rimTop: 4.15,
  rects: [
    [-13.2, 17.9, -31.35, -27.8], // verbinding met Van de Velde
    [-2.05, 17.9, -45.35, -31.35], // entreehal
    [12.6, 16.8, -27.8, 2.55], // gang naar het noorden
    [12.6, 27.9, 2.55, 24.2],
    [12.6, 35.9, 24.2, 45.8],
    [12.6, 41.2, 45.8, 67.7],
    [19.35, 27.45, 67.7, 82.4], // naar het depot
    [3.35, 12.8, -91, -45.35], // gang naar het zuiden, langs de hoge zaal
    [12.8, 21.25, -91, -65.0],
    [1.15, 14.35, -101, -91],
    [14.35, 21.25, -123.25, -84.65], // gang naar het paviljoen
    [14.35, 29.1, -123.5, -117.95],
    [17.95, 28.8, -131.75, -123.25],
  ],
};
const RECESS = 0.6;
const KRAAG = 0.65; // hoogte van de kraag: 0,6 m terug over 0,65 m (43 graden)
const SLAB = 0.9;
// Open hof naast de hoge zaal (AHN +0,35 m, grasveld op de luchtfoto).
const COURT_QUIST = [12.8, 20.6, -76.5, -65.0];
// Hoge zaal met het witte glasdak (+8,3 m, vlak tot op 0,05 m).
const HALL_GLASS = {
  rects: [[12.6, 21.8, -48.65, -40.25], [12.6, 29.75, -59.85, -48.65], [12.6, 32.7, -65.0, -59.85], [20.6, 32.7, -84.65, -65.0]],
  top: 8.3,
};
// Tussen het witte dak en het donkere dakdeel in het zuiden loopt een goot van 1,4 m breed
// en 1,7 m diep (AHN +6,6 m).
const HALL_GUTTER = [13.2, 21.6, -56.9, -55.5, 6.6];
// Paviljoen in het zuidoosten (+9,5 m, glasdak).
const PAVILION = { rects: [[28.8, 55, -148.45, -123.5]], top: 9.5 };
// Zaal met het glasdak in het noorden (+7,6 m).
const NORTH_HALL = { rects: [[-9.3, 12.6, 45.8, 68.1]], top: 7.6 };
// Depot met twee velden zonnepanelen op het platte dak (+4,5 m): elk negen rijen van 1,1 m
// diep op 1,55 m afstand, naar het zuiden hellend van +4,6 m naar +4,85 m.
const DEPOT = { rects: [[27.45, 65.5, 67.7, 105.7]], top: 4.5 };
const SOLAR = { u: [32.5, 60], v0: [89.2, 74.7], rows: 9, pitch: 1.55, depth: 1.1, low: 4.6, high: 4.85 };
// Dienstvleugel: plat dak +4,0 m, borstwering +4,3 m, met een hoge strook (+7,6 m).
const SERVICE = { rects: [[-58.1, 5.5, -91.2, -74.65], [-55.35, -50.2, -74.7, -70.85], [-64.25, -44.85, -111.3, -91.0]], top: 4.3 };
const SERVICE_STRIP = { rects: [[-54.3, -50.3, -95.6, -70.85]], top: 7.6 };

// ---------- bouwen ----------
const pieces = [];
const zone = (rects) => section(rects).intersect(FP);
// Plat dak met borstwering langs de rand van de zone.
const flat = ({ rects, top }, parapet = 0.3) => {
  const cs = zone(rects);
  const solid = extrude(cs, BASE, top);
  return parapet > 0 ? solid.subtract(extrude(cs.offset(-RIM, "Miter", 2), top - parapet, top + 1)) : solid;
};

// Van de Velde
pieces.push(roofPlane(zone([W1.rect]), W1.a, 0, W1.c));
pieces.push(flat(W_SOUTH));
for (const hall of [HALL_1, HALL_2]) {
  const [u0, u1, v0, v1] = hall.rect;
  const vm = (v0 + v1) / 2;
  const roof = profileU([[v0 - 1, BASE], [v1 + 1, BASE], [v1 + 1, hall.eave - (hall.ridge - hall.eave) / (v1 - vm)], [v1, hall.eave], [vm, hall.ridge], [v0, hall.eave], [v0 - 1, hall.eave - (hall.ridge - hall.eave) / (vm - v0)]], u0 - 1, u1 + 1);
  pieces.push(roof.intersect(extrude(zone([hall.rect]), BASE, 40)));
}
pieces.push(flat(RING).subtract(extrude(section([COURT_VDV]), BASE - 1, 40)));
pieces.push(roofPlane(zone([EAST_SLOPE.rect]), EAST_SLOPE.a, 0, EAST_SLOPE.c));
pieces.push(flat(EAST_LOW), flat(SOUTH_LOW));
{
  const [p0, p1, q0, q1] = HIGH.plateau;
  pieces.push(
    Manifold.hull([
      ...rect(HIGH.rect).map(([u, v]) => [u, v, BASE]),
      ...rect(HIGH.rect).map(([u, v]) => [u, v, HIGH.eave]),
      ...rect(HIGH.plateau).map(([u, v]) => [u, v, HIGH.top]),
    ]),
  );
  // Lichtkap in het plateau: een glazen kap van 0,3 m.
  pieces.push(box(p0 + 0.6, p1 - 0.6, q0 + 0.5, q1 - 0.5, HIGH.top - 0.5, HIGH.top + 0.3));
}
pieces.push(flat(SOUTH_WING, 0.25));
for (const u of SOUTH_RIDGES.us) {
  const { half, ridge, v0, v1 } = SOUTH_RIDGES;
  pieces.push(profileV([[u - half, 5.5], [u + half, 5.5], [u + half, 5.95], [u, ridge], [u - half, 5.95]], v0, v1));
}
pieces.push(flat(SOUTH_BAND));
{
  const [u0, u1] = SOUTH_HALL.rect;
  const um = (u0 + u1) / 2;
  pieces.push(
    Manifold.hull([
      ...rect(SOUTH_HALL.rect).map(([u, v]) => [u, v, BASE]),
      ...rect(SOUTH_HALL.rect).map(([u, v]) => [u, v, SOUTH_HALL.eave]),
      [um, SOUTH_HALL.ridgeV[0], SOUTH_HALL.ridge],
      [um, SOUTH_HALL.ridgeV[1], SOUTH_HALL.ridge],
    ]),
  );
}
// Lichtkappen: blok van 0,3 m boven het hoogste punt van het dakvlak eronder.
const roofZ = (u, v) => {
  for (const hall of [HALL_1, HALL_2]) {
    const [u0, u1, v0, v1] = hall.rect;
    if (u >= u0 && u <= u1 && v >= v0 && v <= v1) {
      const vm = (v0 + v1) / 2;
      return hall.eave + ((hall.ridge - hall.eave) * (1 - Math.abs(v - vm) / ((v1 - v0) / 2)));
    }
  }
  const [eu0, eu1, ev0, ev1] = EAST_SLOPE.rect;
  if (u >= eu0 && u <= eu1 && v >= ev0 && v <= ev1) return EAST_SLOPE.a * u + EAST_SLOPE.c;
  return RING.top - 0.3;
};
for (const [uc, vc, du, dv] of SKYLIGHTS) {
  const corners = [[uc - du / 2, vc - dv / 2], [uc + du / 2, vc - dv / 2], [uc + du / 2, vc + dv / 2], [uc - du / 2, vc + dv / 2]];
  const zs = corners.map(([u, v]) => roofZ(u, v));
  const lo = zs.reduce((a, b) => Math.min(a, b), Infinity);
  const hi = zs.reduce((a, b) => Math.max(a, b), -Infinity);
  pieces.push(box(uc - du / 2, uc + du / 2, vc - dv / 2, vc + dv / 2, lo - 0.5, hi + 0.3));
}

// Quist: glazen gangen onder een dunne dakplaat
{
  const { h, rimTop } = GALLERY;
  const cs = zone(GALLERY.rects).subtract(section([COURT_QUIST]));
  // De gevel springt alleen langs de buitenrand van het complex terug (en langs de hof).
  const outline = FP.subtract(section([COURT_QUIST]));
  const inner = cs.intersect(outline.offset(-RECESS, "Miter", 2));
  pieces.push(extrude(inner, BASE, h - SLAB - KRAAG + 0.02));
  // Kraag (iets steiler dan 45 graden) van de teruggezette gevel naar de dakrand.
  const pyramid = Manifold.hull([[0, 0, 0], [-RECESS, -RECESS, KRAAG], [RECESS, -RECESS, KRAAG], [RECESS, RECESS, KRAAG], [-RECESS, RECESS, KRAAG]]);
  const plate = extrude(inner, h - SLAB - KRAAG, h - SLAB - KRAAG + 0.02);
  pieces.push(plate.minkowskiSum(pyramid).intersect(extrude(cs, h - SLAB - KRAAG - 0.1, h - SLAB + 0.05)));
  pieces.push(extrude(cs, h - SLAB, rimTop).subtract(extrude(cs.offset(-RIM, "Miter", 2), h, rimTop + 1)));
}
{
  const [u0, u1, v0, v1, z] = HALL_GUTTER;
  pieces.push(flat(HALL_GLASS, 0).subtract(box(u0, u1, v0, v1, z, HALL_GLASS.top + 1)));
}
pieces.push(flat(PAVILION, 0), flat(NORTH_HALL, 0), flat(DEPOT, 0));
for (const start of SOLAR.v0) {
  for (let k = 0; k < SOLAR.rows; k++) {
    const v0 = start + k * SOLAR.pitch;
    const v1 = v0 + SOLAR.depth;
    pieces.push(profileU([[v0, DEPOT.top - 0.2], [v1, DEPOT.top - 0.2], [v1, SOLAR.high], [v0, SOLAR.low]], SOLAR.u[0], SOLAR.u[1]));
  }
}
pieces.push(flat(SERVICE), flat(SERVICE_STRIP));


// ---------- gebouw ----------
const museum = Manifold.union(pieces).subtract(extrude(section([COURT_QUIST]), BASE - 1, 41));
const nodes = [["building:museum", museum]];
const all = museum;
{
  // Dekking: wat binnen de BAG-contour niet door een zone gedekt wordt (behalve de hoven).
  const covered = CrossSection.union([
    section([W1.rect]), section(W_SOUTH.rects), section([HALL_1.rect]), section([HALL_2.rect]), section(RING.rects),
    section([EAST_SLOPE.rect]), section(EAST_LOW.rects), section(SOUTH_LOW.rects), section([HIGH.rect]), section(SOUTH_WING.rects),
    section(SOUTH_BAND.rects), section(GALLERY.rects), section(HALL_GLASS.rects), section(PAVILION.rects), section(NORTH_HALL.rects),
    section(DEPOT.rects), section(SERVICE.rects),
  ]);
  const gap = FP.subtract(covered).area();
  if (gap > 0.5) throw new Error(`BAG-contour niet gedekt: ${gap.toFixed(2)} m2`);
}

// Maaiveld: het pad langs de noordgevel van Van de Velde (NAP +37,8 m).
const GROUND_SAMPLES = [[-115, -2.5], [-95, -2.5], [-60, -2.5], [-45, -2.5]];

const META = {
  name: "Kröller-Müller Museum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: 81.17,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0228100000019793", "0228100000055941"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (184490, 456500), in het hart van het complex, op NAP +37,8 m (het pad langs de noordgevel), +X langs de gevels van Van de Velde naar het oost-noordoosten (23,96 graden vanaf de RD-X-as) en +Y loodrecht daarop langs de gangen van Quist. Eén node building:museum: het museum van Henry van de Velde (1938) met de westvleugel onder een lessenaarsdak, twee zalen met een flauw glazen zadeldak (goot +5,3/5,4 m, nok +5,9/6,0 m) en lichtkappen, het zalenblok rond de open binnenhof (+6,15 m), een lessenaarsdak naar het oosten, het hoge zalenblok met een afgeknot schilddak en lichtkap (+7,4 m) en de zuidvleugel met drie lichtstraten en een hoge zaal met schilddak (+8,6 m) boven de afgeschuinde kop; de uitbreiding van Wim Quist (1977) met lange glazen gangen onder een dunne dakplaat (+3,75 m, dakrand +4,15 m, gevel 0,6 m terug onder een kraag van 43 graden), de hoge zaal met wit dak (+8,3 m) en goot naast een open hof, het paviljoen (+9,5 m), de zaal met glasdak in het noorden (+7,6 m), de dienstvleugel (+4,3 m) met een hoge strook (+7,6 m) en het depot (+4,5 m) met twee velden van negen rijen zonnepanelen. Afgesneden op de BAG-contour; onderkant 4,2 m onder z = 0 omdat het terrein naar het noorden 3,6 m daalt; alle vlakken wijzen omhoog, staan verticaal of hangen onder hoogstens 43 graden. Vervangt de PDOK-reconstructie van het museum en van het pandje in de hof van Quist. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    vanDeVeldeHighHallM: SOUTH_HALL.ridge,
    vanDeVeldeLanternM: HIGH.top,
    quistGalleryRoofM: GALLERY.h,
    quistGlassHallM: HALL_GLASS.top,
    quistRecessM: RECESS,
    pavilionM: PAVILION.top,
    groundNapM: 37.8,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Kr%C3%B6ller-M%C3%BCller_Museum",
    "PDOK BAG panden 0228100000019793 en 0228100000055941, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dak- en goothoogtes, profielen van de zadeldaken en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR): de indeling van de daken en de lichtkappen",
    "Wikimedia Commons, categorie Kröller-Müller Museum: de gevels (alleen bekeken)",
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
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
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

// BAG-contour van pand 0228100000019793 (PDOK BAG WFS), omgezet naar het lokale stelsel
// (u langs X_AXIS, v loodrecht) en haaks rechtgetrokken op 0,05 m.
function bagContour() {
  return [[41.2,67.7],[65.5,67.7],[65.5,105.7],[52.85,105.6],[36.5,105.5],[27.45,105.5],[27.45,82.4],[19.35,82.4],[19.35,65.8],[11.85,65.8],[11.85,68.1],[-9.3,68.1],[-9.3,45.8],[12.6,45.8],[12.6,-27.8],[-12.05,-27.8],[-12.05,-16.3],[-30.05,-16.3],[-30.05,-10.7],[-39.75,-10.7],[-39.75,-13.9],[-64.5,-13.9],[-64.5,-9.25],[-69.25,-9.25],[-69.25,-5.25],[-85.8,-5.25],[-85.8,-9.6],[-90.45,-9.6],[-90.45,-14.3],[-115.6,-14.3],[-115.6,-11.4],[-124.85,-11.4],[-124.85,-34.1],[-119.95,-34.1],[-119.95,-39.75],[-104.7,-39.75],[-104.7,-30.9],[-90.45,-30.9],[-90.45,-35.45],[-85.7,-35.45],[-85.7,-39.75],[-68.95,-39.75],[-68.95,-35.55],[-64.3,-35.55],[-64.3,-30.65],[-49.9,-30.65],[-49.9,-40.4],[-29.7,-40.4],[-29.7,-53.45],[-29.25,-53.45],[-29.25,-60.8],[-25.55,-64.2],[-15.6,-64.2],[-11.95,-60.7],[-11.95,-39.95],[-13.2,-39.95],[-13.2,-31.35],[-2.05,-31.35],[-2.05,-45.35],[3.35,-45.35],[3.35,-74.65],[-50.2,-74.65],[-50.2,-70.85],[-55.35,-70.85],[-55.35,-74.7],[-58.1,-74.7],[-58.1,-91.2],[-64.25,-91.2],[-64.25,-111.3],[-44.85,-111.3],[-44.85,-91],[1.15,-91],[1.15,-101],[14.35,-101],[14.35,-123.25],[17.95,-123.25],[17.95,-131.75],[28.8,-131.75],[28.8,-148.45],[55,-148.45],[55,-123.5],[29.1,-123.5],[29.1,-117.95],[21.25,-117.95],[21.25,-84.65],[32.7,-84.65],[32.7,-59.85],[29.75,-59.85],[29.75,-48.65],[21.8,-48.65],[21.8,-40.25],[17.9,-40.25],[17.9,-29.55],[16.8,-29.55],[16.8,2.55],[27.9,2.55],[27.9,24.2],[35.9,24.2],[35.9,45.8],[41.2,45.8]];
}
