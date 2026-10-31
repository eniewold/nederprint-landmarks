// Haagse Arc (Maanweg 174, Den Haag, 1992, T+T Design): kantorencomplex in de vorm van een poort. Een
// toren van 16 lagen (NAP +61,55 m) met een schuin afgesneden zuidoostkop en een toren van 13 lagen met
// een bol, gebogen dak (tot +51,2 m) staan aan weerszijden van het entreeplein; bovenin verbindt een brug
// van twee glazen lagen (+47,6 tot +57,67 m) ze, met een ronde kop die over de oostgevel steekt. Onder de
// brug staat een ronde kolom tegen de oosttoren. Achter de westtoren een vleugel van 9 lagen (+34,1 m,
// met een gebogen opbouw tot +39,2 m), achter de poort een lager blok van 6 lagen (+21,6 m) met een
// schuin glazen dak, een glazen atrium en een entreehal; de oosttoren staat aan de voorkant op kolommen
// boven een rond terras. Van 2003 tot 2015 het eerste gebouw van het Internationaal Strafhof.
// Contouren uit de BAG en de 3D BAG (LoD2.2, AHN5 2023), hoogtes uit de 3D BAG en het AHN-DSM, gevel-
// indeling en de brug uit foto's. De brug is geen boog over een weg: hij overspant het entreeplein.
import { Manifold, ccw, circle, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "haagse-arc";
// Gebouwstelsel: u langs de korte gevels naar het noordoosten (42,5° op RD-oost, haaks op de lange
// zuidwestgevel aan de Maanweg-zijde), v langs de lange gevels naar het noordwesten. Oorsprong onder het
// midden van de brug. De voorkant (entreeplein) ligt aan -v.
const ORIGIN = [84109.0, 453816.0];
const ANGLE = 42.5;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = 0.0; // NAP, maaiveld van de 3D BAG (0,01); straat zuidwest +0,8, parkeerterrein noordoost 0,0..-1,0, entreeplein +2,6
const BASE = -1.0;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 en AHN-DSM ----------
const WEST_ROOF = 61.55; // westtoren (3D BAG 61,53–61,57; DSM 61–62)
const WEST_PLANT = [63.7, 63.9]; // twee installatiekasten (3D BAG 63,4–63,8 en 63,9; DSM 63,5–64)
const WING_ROOF = 34.1; // noordwestvleugel (3D BAG 34,06–34,13)
const WING_TOP = 39.2; // gebogen opbouw op de vleugel (3D BAG 39,10–39,23)
const LINK_ROOF = 20.45; // verbinding tussen vleugel en achterblok (3D BAG 20,44–20,49)
const REAR_ROOF = 21.55; // achterblok (3D BAG 21,43–21,71)
const ATRIUM_ROOF = 6.73; // glazen atrium tussen de torens (3D BAG 6,71–6,74; DSM geen data: glas)
const HALL_ROOF = 10.1; // entreehal aan het plein (3D BAG 10,00–10,24; DSM 10)
const STRIP_ROOF = 7.45; // lage strook langs de noordoostgevel (3D BAG 7,42–7,55)
const TERRACE = 6.0; // rond terras onder de kop van de oosttoren (3D BAG 4,9–6,8; DSM 6–7)
const BRIDGE_BOTTOM = 47.6; // onderkant van de brug: gelijk met het achterdak van de oosttoren (47,6–47,9), uit foto's ~10 m dik
const BRIDGE_TOP = 57.67; // dak van de brug (3D BAG 57,66–57,68; DSM 57,6)
const EAST_FLAT = 47.9; // achterdak van de oosttoren onder en achter de brug (3D BAG 47,90–47,99)
// Gebogen dak van de oosttoren: profiel langs de eigen as t (naar de voorgevel), DSM-mediaan over de
// breedte, 3D BAG-vlakken voor de kop (nok 51,3 op t 27; voorrand 49,05 op 35,4 en 48,0 op 37,0).
const EAST_PROFILE = [[-30, 47.9], [10.5, 47.9], [13, 48.15], [15, 48.7], [17, 49.4], [19, 49.95], [21.5, 50.45], [24.5, 50.95], [27.5, 51.2], [30, 50.75], [32, 50.15], [34, 49.45], [35.5, 48.9], [37.0, 48.0], [40, 46.0]];

// ---------- Plattegronden in (u, v), uit de BAG-contour en de 3D BAG-dakvlakken ----------
const WEST = [[-26.7, -23.4], [-12.7, -11.5], [-12.7, 27.6], [-26.5, 27.6]]; // schuine kop aan het plein
const WING = [[-26.5, 27.6], [-12.7, 27.6], [-12.7, 48.6], [-26.4, 48.6]]; // tot de pandgrens in het noordwesten
const WING_UPPER = [[-12.7, 31.2], [-12.7, 48.6], [-25.3, 48.6], [-25.3, 46.0], [-25.0, 43.0], [-24.4, 40.0], [-23.6, 37.5], [-22.6, 35.0], [-21.6, 33.0], [-20.8, 31.2]];
const LINK = rect(-12.7, 26.3, -7.0, 31.8);
const REAR = [[-12.7, 48.7], [-12.7, 31.8], [-8.3, 31.7], [-5.4, 20.3], [4.6, 23.3], [10.7, 25.1], [3.1, 48.8]];
// Schuin glazen dak tussen atrium en achterblok: z = 1,3436 u + 0,448 v + 5,0 (3D BAG-vlak, 55°).
const GLASS_SLOPE = { poly: [[-7.5, 19.7], [-4.9, 15.4], [3.2, 17.5], [4.3, 19.6], [6.7, 23.9], [4.6, 23.3], [-5.4, 20.3]], a: 1.3436, b: 0.448, c: 5.0 };
const ATRIUM = [[-12.7, -4.6], [1.85, -4.6], [-1.4, 6.4], [-3.3, 9.1], [-2.2, 10.7], [-2.7, 11.7], [-3.2, 15.9], [-4.9, 15.4], [-7.5, 19.7], [-5.4, 20.3], [-7.0, 26.7], [-12.7, 26.3]];
const HALL = [[-12.7, -11.0], [3.7, -11.0], [1.8, -4.5], [-12.7, -4.5]];
// Oosttoren: een trapezium in een eigen stelsel (17,6° gedraaid): westgevel (-1,4; 6,4)–(9,7; -31,6),
// noordoostgevel (24,0; -29,7)–(7,8; 21,7), voorgevel met afgeschuinde hoek, achterkant schuin.
const EAST = [[9.7, -31.6], [12.1, -33.3], [13.1, -34.7], [24.5, -31.1], [24.0, -29.7], [7.8, 21.7], [4.2, 17.8], [-2.2, 10.7], [-3.3, 9.1], [-1.4, 6.4]];
const T_DIR = [0.3, -0.954]; // eigen as t van de oosttoren, naar de voorgevel (t = 0,3 u - 0,954 v)
const T_PILOTIS = 19.3; // vanaf hier staat de kop op kolommen boven het ronde terras (BAG-contour)
const STRIP = [[17.8, -10.0], [19.7, -13.3], [22.8, -12.2], [10.7, 25.1], [4.6, 23.3], [6.0, 19.75]];
const TERRACE_C = [18.3, -25.0], TERRACE_R = 11.0; // ronde BAG-contour
const COLUMN_C = [-0.5, -1.5], COLUMN_R = 3.5; // ronde kolom onder de brug tegen de oosttoren (foto's)
const BRIDGE_END = [9.75, 0.55]; // middelpunt van de ronde kop (straal = halve breedte)
const BRIDGE = { u0: -12.75, v0: -5.3, v1: 6.4 };
const ARCH_APEX = -7.0; // top van de spitse onderkant van de brug tussen westtoren en kolom/oosttoren
const ARCH_SLOPE = Math.tan((50 * Math.PI) / 180); // flanken van 50°: printbaar zonder steun

// ---------- Verdiepingen (lokaal z) ----------
const storeys = (z0, h, n) => Array.from({ length: n }, (_, k) => [z0 + h * k, h]);
const WEST_FLOORS = storeys(z(7.5), 3.75, 14); // begane grond + 1e als zuilengalerij tot +7,5, dan 14 lagen tot +60,0
const EAST_FLOORS = [[0, 4.5], ...storeys(4.5, 3.6, 12)]; // 13 lagen tot +47,7
const WING_FLOORS = [[0, 4.1], ...storeys(4.1, 3.75, 8)]; // 9 lagen tot +34,1
const REAR_FLOORS = [[0, 3.55], ...storeys(3.55, 3.6, 5)]; // 6 lagen tot +21,55
const DEPTH = 0.35;

// ---------- Hulpfuncties ----------
const roofPlane = (poly, a, b, c, top = 120) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, top).trimByPlane([a / n, b / n, -1 / n], -c / n);
};
const tOf = ([u, v]) => T_DIR[0] * u + T_DIR[1] * v;
const S_DIR = [-T_DIR[1], T_DIR[0]];
// Strook in het stelsel van de oosttoren tussen t0 en t1 (ruim over de breedte).
const tStrip = (t0, t1) => [-60, 60].flatMap((s) => [t0, t1].map((t) => [T_DIR[0] * t + S_DIR[0] * s, T_DIR[1] * t + S_DIR[1] * s]));
const quad = (t0, t1) => { const [p, q, r, s] = tStrip(t0, t1); return [p, q, s, r]; };

// Oosttoren: per profielsegment een vlak boven de plattegrond (bolle dakvorm uit vlakken).
function eastTower() {
  const plan = prism(EAST, BASE, 60);
  const parts = [];
  for (let i = 0; i + 1 < EAST_PROFILE.length; i++) {
    const [t0, z0] = EAST_PROFILE[i], [t1, z1] = EAST_PROFILE[i + 1];
    const k = (z1 - z0) / (t1 - t0);
    const a = k * T_DIR[0], b = k * T_DIR[1], c = z(z0) - k * t0;
    const n = Math.hypot(a, b, 1);
    parts.push(plan.intersect(prism(quad(t0, t1), BASE, 60)).trimByPlane([a / n, b / n, -1 / n], -c / n));
  }
  let body = union(parts);
  // Kop op kolommen: onder de kop (t > 19,3) tot +9,3 een kern 2,0 m binnen de gevels, met een
  // kraag van 50° naar de volle plattegrond op +11,7 (twee lagen boven de begane grond).
  const PIL_TOP = z(11.7), INSET = 2.0, RISE = INSET * ARCH_SLOPE;
  const head = prism(quad(T_PILOTIS, 60), BASE, PIL_TOP);
  body = body.subtract(head);
  const front = plan.intersect(prism(quad(T_PILOTIS - 4, 60), BASE, 60)); // kop plus 4 m de romp in
  const sec = front.slice(0); // doorsnede op de onderkant
  const inner = sec.offset(-INSET, "Miter");
  const core = Manifold.extrude(inner, PIL_TOP - RISE - BASE).translate([0, 0, BASE]);
  const collar = Manifold.hull([
    ...inner.toPolygons().flat().map(([u, v]) => [u, v, PIL_TOP - RISE]),
    ...sec.toPolygons().flat().map(([u, v]) => [u, v, PIL_TOP + 0.01]),
  ]).intersect(prism(quad(T_PILOTIS, 60), BASE, 60));
  // Kolommen van 1,0 m op 0,7 m binnen de gevels van de kop.
  const cols = [];
  const ring = ccw(EAST);
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm = [d[1], -d[0]];
    for (let s = 2.5; s < L - 1; s += 5.0) {
      const p = [a[0] + d[0] * s - nrm[0] * 0.7, a[1] + d[1] * s - nrm[1] * 0.7];
      if (tOf(p) < T_PILOTIS + 1.5 || L < 3) continue;
      cols.push(prism(circle(p, 0.5, 16), BASE, PIL_TOP + 0.3));
    }
  }
  return { body: union([body, core, collar, ...cols]), columns: cols.length };
}

// Blinde vensters per laag: nissen van DEPTH diep met een plafond onder 45°, alleen waar de gevel
// buitengevel is (stralen van buiten raken de gevel op de rand).
function exposedAt(body, P, s, h) {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
}
function edgeFrame(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  return { L, P };
}
const niche = (P, s0, s1, lo, hi, depth) =>
  Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + depth + 0.2), P(s1, -0.2, hi + depth + 0.2), P(s0, depth, hi), P(s1, depth, hi)]);
function windows(body, poly, floors, { pitch, width, depth = DEPTH, sill = 0.9, head = 0.35, minLen = 4, skip = () => false }) {
  const cuts = [];
  const ring = ccw(poly);
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length];
    if (skip(a, b)) return;
    const { L, P } = edgeFrame(a, b);
    if (L < minLen) return;
    const bays = Math.floor((L - 0.9) / pitch), w = (L - bays * pitch) / 2;
    for (const [zf, fh] of floors) {
      const lo = zf + sill, hi = zf + fh - head - depth;
      if (hi - lo < 0.9) continue;
      for (let k = 0; k < bays; k++) {
        const s0 = w + k * pitch + (pitch - width) / 2, s1 = s0 + width;
        if ([s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + depth - 0.05].every((h) => exposedAt(body, P, s, h)))) cuts.push(niche(P, s0, s1, lo, hi, depth));
      }
    }
  });
  return cuts;
}
// Doorlopende glasbanden (per 0,5 m getest), zoals B'Tower. De rand a→b loopt linksom: buiten rechts.
function ribbons(body, a, b, bands, depth = 0.4) {
  const cuts = [];
  const { L, P } = edgeFrame(a, b);
  for (const [lo, hi] of bands) {
    let start = null;
    const flush = (s1) => {
      if (start !== null && s1 - start >= 0.9) cuts.push(niche(P, start, s1, lo, hi - depth, depth));
      start = null;
    };
    for (let s = 0.95; s <= L - 0.95 + 1e-6; s += 0.5) {
      const ok = [lo + 0.05, hi - 0.05].every((h) => exposedAt(body, P, s, h));
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.5);
    }
    flush(L - 0.95);
  }
  return cuts;
}

// ---------- Massa ----------
const east = eastTower();
const bridgePlan = [...rect(BRIDGE.u0, BRIDGE.v0, BRIDGE_END[0], BRIDGE.v1)];
const endR = (BRIDGE.v1 - BRIDGE.v0) / 2;
const bridgeEnd = circle(BRIDGE_END, endR, 32, -Math.PI / 2).filter(([u]) => u >= BRIDGE_END[0] - 1e-6);
const bridge = union([prism(bridgePlan, z(BRIDGE_BOTTOM), z(BRIDGE_TOP)), prism(circle(BRIDGE_END, endR, 48), z(BRIDGE_BOTTOM), z(BRIDGE_TOP))]);
// Kraag onder de ronde kop die 1,1 m over de noordoostgevel steekt: 50° naar binnen.
const endCollar = Manifold.hull([
  ...bridgeEnd.map(([u, v]) => [u, v, z(BRIDGE_BOTTOM) + 0.05]),
  ...circle(BRIDGE_END, endR - 1.4, 32, -Math.PI / 2).filter(([u]) => u >= BRIDGE_END[0] - 1e-6).map(([u, v]) => [u, v, z(BRIDGE_BOTTOM) - 1.4 * ARCH_SLOPE]),
]);
// Spitse onderkant van de brug boven de poort: twee flanken van 50° vanaf de westtoren en de
// oosttoren/kolom naar de top op u = -7,0 (+47,6); de doorgang eronder blijft open.
const archSide = (u0, u1) => {
  const far = u0 === ARCH_APEX ? u1 : u0;
  const drop = Math.abs(far - ARCH_APEX) * ARCH_SLOPE;
  return Manifold.hull([BRIDGE.v0, BRIDGE.v1].flatMap((v) => [[u0, v, z(BRIDGE_BOTTOM) + 0.1], [u1, v, z(BRIDGE_BOTTOM) + 0.1], [far, v, z(BRIDGE_BOTTOM) - drop]]));
};
const arch = union([archSide(-12.8, ARCH_APEX), archSide(ARCH_APEX, 3.0)]);
const column = prism(circle(COLUMN_C, COLUMN_R, 40), BASE, z(BRIDGE_BOTTOM) + 0.1);
// Rond terras: glazen begane grond 0,6 m terug onder een rand van 50°.
const terrace = union([
  prism(circle(TERRACE_C, TERRACE_R - 0.6, 64), BASE, z(4.6)),
  Manifold.hull([...circle(TERRACE_C, TERRACE_R - 0.6, 64).map(([u, v]) => [u, v, z(4.6) - 0.01]), ...circle(TERRACE_C, TERRACE_R, 64).map(([u, v]) => [u, v, z(4.6) + 0.6 * ARCH_SLOPE])]),
  prism(circle(TERRACE_C, TERRACE_R, 64), z(4.6) + 0.6 * ARCH_SLOPE - 0.01, z(TERRACE)),
]);
const westPlant = [prism(rect(-21.0, 0.0, -18.5, 4.7), z(WEST_ROOF) - 0.1, z(WEST_PLANT[0])), prism(rect(-24.5, -5.5, -21.0, -3.0), z(WEST_ROOF) - 0.1, z(WEST_PLANT[1]))];
const glass = roofPlane(GLASS_SLOPE.poly, GLASS_SLOPE.a, GLASS_SLOPE.b, GLASS_SLOPE.c - GROUND, z(24.8));

const body = union([
  prism(WEST, BASE, z(WEST_ROOF)),
  ...westPlant,
  prism(WING, BASE, z(WING_ROOF)),
  prism(WING_UPPER, z(WING_ROOF) - 0.1, z(WING_TOP)),
  prism(LINK, BASE, z(LINK_ROOF)),
  prism(REAR, BASE, z(REAR_ROOF)),
  glass,
  prism(ATRIUM, BASE, z(ATRIUM_ROOF)),
  prism(HALL, BASE, z(HALL_ROOF)),
  prism(STRIP, BASE, z(STRIP_ROOF)),
  terrace,
  east.body,
  bridge,
  endCollar,
  arch,
  column,
]);

// ---------- Gevelreliëf ----------
const atPandEdge = (a, b) => a[1] > 48 && b[1] > 48; // pandgrens met de vleugelkop in het buurpand
const cuts = [];
// Westtoren: per laag vensters van twee traveeën (3,66 m, 2,7 m breed); de zuilengalerij van de onderste
// twee lagen als hoge nissen van 0,6 m tussen pijlers op elke travee (1,83 m).
cuts.push(...windows(body, WEST, WEST_FLOORS, { pitch: 3.66, width: 2.7 }));
cuts.push(...windows(body, WEST, [[1.0, z(7.5) - 1.0]], { pitch: 1.83, width: 0.93, depth: 0.6, sill: 0, head: 0 }));
// Open loggia bovenin de schuine kop (foto's; DSM 51–54 op de rand): twee traveeën breed, van de
// bovenste twee lagen (+52,5) door de dakrand, 2,5 m diep.
{
  const { P } = edgeFrame(WEST[0], WEST[1]);
  const lo = WEST_FLOORS[12][0];
  cuts.push(Manifold.hull([5.0, 8.7].flatMap((s) => [-0.2, 2.5].flatMap((d) => [P(s, d, lo), P(s, d, z(WEST_ROOF) + 1)]))));
}
cuts.push(...windows(body, WING, WING_FLOORS, { pitch: 3.6, width: 2.4, skip: atPandEdge }));
cuts.push(...windows(body, REAR, REAR_FLOORS, { pitch: 3.6, width: 2.4, skip: atPandEdge }));
// Oosttoren: losse vensters op de lange gevels, doorlopende glasbanden op de voorgevel.
cuts.push(...windows(body, EAST, EAST_FLOORS, { pitch: 3.6, width: 2.4, minLen: 6, skip: (a, b) => Math.abs(tOf(a) - tOf(b)) < 4 }));
cuts.push(...ribbons(body, [13.1, -34.7], [24.5, -31.1], EAST_FLOORS.filter(([zf]) => zf >= z(11.7) - 0.01).map(([zf, fh]) => [zf + 1.0, zf + fh - 0.5])));
// Brug: twee glasbanden op de voor- en achtergevel tussen witte banden (foto's).
const bridgeBands = [[z(50.4), z(53.2)], [z(54.1), z(56.77)]];
cuts.push(...ribbons(body, [BRIDGE.u0, BRIDGE.v0], [BRIDGE_END[0], BRIDGE.v0], bridgeBands));
cuts.push(...ribbons(body, [BRIDGE_END[0], BRIDGE.v1], [BRIDGE.u0, BRIDGE.v1], bridgeBands));
// Entreehal: glazen pui aan het plein boven het plateau (+2,6).
cuts.push(...ribbons(body, [-12.7, -11.0], [3.7, -11.0], [[z(3.6), z(9.1)]]));

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Haagse Arc: ${parts.length} losse delen`);
console.log("Haagse Arc", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length, "kolommen", east.columns);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:haagse-arc", building]],
  catalog: {
    name: "Haagse Arc",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.45, // PDOK-terrein rondom (ellipsoïdisch, NAP + ~43,45 in Den Haag)
    groundOffsetMetres: -0.2,
    replacesBuildings: ["NL.IMBAG.Pand.0518100000320364"],
    description:
      "Haagse Arc (Maanweg 174, 1992, voormalig gebouw van het Internationaal Strafhof): een poortgebouw van twee torens met een brug. Westtoren van 16 lagen op de BAG-contour met een schuin afgesneden kop aan het entreeplein tot NAP +61,55 m, twee installatiekasten, een zuilengalerij en een loggia bovenin de kop; oosttoren van 13 lagen (een trapezium 17,6° gedraaid) met een bol dak van +47,9 tot +51,2 m uit vlakken, de kop op kolommen boven een rond terras (+6,0); daartussen een brug van twee glazen lagen van +47,6 tot +57,67 m met een ronde kop over de oostgevel, gedragen door een ronde kolom; de onderkant van de brug boven de poort is spits (flanken van 50°) zodat de doorgang zonder steun open blijft. Achter de westtoren een vleugel van 9 lagen (+34,1 m) met een gebogen opbouw (+39,2), achter de poort een blok van 6 lagen (+21,55) met een schuin glazen dak, een atrium (+6,73), een entreehal (+10,1) en een lage strook (+7,45). Hoogtes en contouren uit de 3D BAG (AHN5) en het AHN-DSM. Oorsprong onder het midden van de brug, X-as langs de korte gevels naar het noordoosten (42,5° op RD-oost). Geschat: de dikte van de brug, de plaats en maat van de kolom, de spitse onderkant, de kolommen onder de oosttoren, verdiepingshoogtes en vensterraster. Het noordwestelijke eind van de vleugel ligt in buurpand 0518100001640258 en is niet gemodelleerd.",
    realWorld: {
      groundNapM: GROUND,
      westTowerNapM: WEST_ROOF,
      westPlantNapM: WEST_PLANT,
      eastTowerNapM: { back: EAST_FLAT, crest: 51.2 },
      bridgeNapM: [BRIDGE_BOTTOM, BRIDGE_TOP],
      archApexNapM: BRIDGE_BOTTOM,
      archFlankDegrees: 50,
      wingNapM: [WING_ROOF, WING_TOP],
      rearBlockNapM: REAR_ROOF,
      hallNapM: HALL_ROOF,
      atriumNapM: ATRIUM_ROOF,
      terraceNapM: TERRACE,
      floors: { westTower: 16, eastTower: 13, wing: 9, rearBlock: 6 },
      axisDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0518100000320364 (bouwjaar 1992), 3D BAG LoD2.2 (AHN5 2023), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag",
      "https://www.pss-archi.eu/immeubles/NL-518-64227.html",
      "https://commons.wikimedia.org/wiki/File:Haagse_Arc.jpg",
      "https://commons.wikimedia.org/wiki/File:Maanweg_174_former_ICC_building_The_Hague_2.jpg",
      "https://commons.wikimedia.org/wiki/File:Building_of_the_International_Criminal_Court_in_The_Hague.jpg",
    ],
  },
});
