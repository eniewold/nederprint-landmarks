// Q Residences (Buitenveldertselaan / Van Nijenrodeweg, Amsterdam, 2022, Studio Gang met Bureau Rijnboutt):
// twee woongebouwen op één BAG-pand aan de zuidrand van de Zuidas. Quartz is de toren van 23 lagen
// (circa 74 m) op een plattegrond van 21,8 × 35,4 m met afgeronde hoeken; zijn witbetonnen gevel bestaat
// uit schuine vinnen en golvende vloerranden, waardoor de balkons per laag in en uit het gevelvlak
// schuiven. Qube is het lage blok van acht lagen aan de zuidkant, met donkere gevels achter brede
// vloerranden met een schuin ondervlak. Tussen de twee ligt een plein boven de parkeergarage.
// Contouren uit de BAG en de 3D BAG, hoogtes uit de 3D BAG (AHN5, 2023): het AHN4-DSM van de PDOK-WCS
// toont hier nog de bouwput. Gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "q-residences";
// Gebouwstelsel: u langs de korte gevels naar het oosten (BAG-randen op -0,18° en -0,26° van RD-oost),
// v langs de lange gevels naar het noorden. Oorsprong in het hart van de BAG-contour, op het plein
// tussen de twee gebouwen.
const ORIGIN = [119614.9, 482272.6];
const ANGLE = -0.2;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const L = ([x, y]) => {
  const dx = x - ORIGIN[0], dy = y - ORIGIN[1];
  return [+(dx * AXIS[0] + dy * AXIS[1]).toFixed(2), +(-dx * AXIS[1] + dy * AXIS[0]).toFixed(2)];
};
const GROUND = -0.72; // NAP, 3D BAG-maaiveld (AHN-DTM rondom -0,84…-0,53)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 (puntwolk AHN5, 2023) ----------
const QUARTZ_ROOF = 72.8; // dakvlak 72,73–72,88 (70e percentiel van het hele pand 72,76)
const QUARTZ_PLANT = 73.99; // installatie op het dak (73,63–73,99)
const QUBE_ROOF = 30.24; // dakvlak 30,24–30,25
const QUBE_PV = 32.18; // verhoogd middendeel van het dak (32,14–32,20)

// ---------- Plattegronden (RD) ----------
// Quartz: west- en noordgevel vallen op de BAG-contour, oost- en zuidgevel uit de 3D BAG (het pand
// loopt oostelijk van de toren en tot aan Qube door over de parkeergarage onder het plein).
const QUARTZ_SW = L([119598.45, 482274.9]);
const QUARTZ_NE = L([119620.3, 482310.25]);
const QUBE_SW = L([119598.3, 482234.95]);
const QUBE_NE = L([119631.38, 482257.5]);
const PLANT_SW = L([119611.1, 482294.3]);
const PLANT_NE = L([119613.0, 482296.6]);
const PV_SW = L([119609.8, 482240.6]);
const PV_NE = L([119620.2, 482250.8]);

// ---------- Quartz ----------
// Hoeken afgerond met een straal van 3,0 m (ortho). Lagen: een hoge begane grond van 5,4 m en 22 lagen
// tot het dak. Gevelraster (foto's): op de lange gevels zes traveeën tussen de hoekbalkons, op de korte
// drie; vinnen van 0,9 m. Elke travee is per laag een loggia als blinde nis met een plafond onder 45°,
// waarvan de diepte (0,4 / 0,8 / 1,2 m) diagonaal over de gevel golft: de balkons die in en uit het
// gevelvlak schuiven. In de hoeken wisselen diepe en ondiepe gebogen loggia's per laag.
const R = 3.0;
const GROUND_FLOOR = 5.4;
const FLOORS = 22;
const STOREY = (z(QUARTZ_ROOF) - GROUND_FLOOR) / FLOORS; // 3,10 m
const FIN = 0.9;
const WAVE = [0.4, 0.8, 1.2, 0.8];
const [u0, v0] = QUARTZ_SW, [u1, v1] = QUARTZ_NE;

// Omtrek linksom vanaf de zuidwesthoek: rechte stukken en kwartcirkels, met per stuk het aantal traveeën.
const segments = [];
{
  const corners = [[u0 + R, v0 + R, -Math.PI / 2 - Math.PI / 2], [u1 - R, v0 + R, -Math.PI / 2], [u1 - R, v1 - R, 0], [u0 + R, v1 - R, Math.PI / 2]];
  const sides = [[[u0 + R, v0], [u1 - R, v0], 3], [[u1, v0 + R], [u1, v1 - R], 6], [[u1 - R, v1], [u0 + R, v1], 3], [[u0, v1 - R], [u0, v0 + R], 6]];
  for (let i = 0; i < 4; i++) {
    const c = corners[i];
    segments.push({ arc: true, c: [c[0], c[1]], a0: c[2], len: (Math.PI / 2) * R });
    const [a, b, bays] = sides[i];
    segments.push({ arc: false, a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]), bays, side: i });
  }
}
// Punt op stuk `seg` op afstand s langs de omtrek, t naar binnen (negatief = naar buiten).
function P(seg, s, t) {
  if (seg.arc) {
    const ang = seg.a0 + s / R;
    return [seg.c[0] + (R - t) * Math.cos(ang), seg.c[1] + (R - t) * Math.sin(ang)];
  }
  const d = [(seg.b[0] - seg.a[0]) / seg.len, (seg.b[1] - seg.a[1]) / seg.len], n = [-d[1], d[0]];
  return [seg.a[0] + d[0] * s + n[0] * t, seg.a[1] + d[1] * s + n[1] * t];
}
const outline = segments.flatMap((seg) => {
  if (!seg.arc) return [];
  return Array.from({ length: 9 }, (_, k) => P(seg, (seg.len * k) / 8, 0));
});

// Nis op een stuk tussen [s0, s1] onderaan en [t0, t1] bovenaan (schuine vinnen): op een boog per stukje
// van hoogstens 15° een convexe romp, zodat de achterwand de boog volgt.
function niche(seg, [s0, s1], [t0, t1], depth, lo, hi) {
  const n = seg.arc ? Math.max(1, Math.ceil((s1 - s0) / ((15 * Math.PI) / 180 * R))) : 1;
  const parts = [];
  for (let k = 0; k < n; k++) {
    const f0 = k / n, f1 = (k + 1) / n;
    const at = (a, b, f) => a + (b - a) * f;
    parts.push(Manifold.hull([
      ...[at(s0, s1, f0), at(s0, s1, f1)].flatMap((s) => [[...P(seg, s, -0.3), lo], [...P(seg, s, depth), lo]]),
      ...[at(t0, t1, f0), at(t0, t1, f1)].flatMap((s) => [[...P(seg, s, -0.3), hi + depth + 0.3], [...P(seg, s, depth), hi]]),
    ]));
  }
  return parts;
}
// Zijdelingse verschuiving van vin j op een recht stuk op hoogte h: een golf over vier lagen, per vin
// een kwart verschoven, zodat de vinnen als een schuin, golvend raster over de gevel lopen (foto's).
// De vinnen naast de hoekbalkons blijven recht.
const SWAY = 0.7;
const sway = (seg, j, h) => (j === 0 || j === seg.bays ? 0 : SWAY * Math.sin((2 * Math.PI * h) / (4 * STOREY) + (j * Math.PI) / 2));

const quartzBody = union([
  prism(outline, BASE, z(QUARTZ_ROOF)),
  prism(rect(PLANT_SW[0], PLANT_SW[1], PLANT_NE[0], PLANT_NE[1]), z(QUARTZ_ROOF) - 0.1, z(QUARTZ_PLANT)),
]);
const quartzCuts = [];
// Begane grond: glazen pui 0,8 m achter de kolommen, tot onder de eerste vloerrand van 0,9 m.
// Verdiepingen: borstwering 0,9 m, nis tot 0,35 m onder de volgende vloer.
const levels = [[0, 0.0, GROUND_FLOOR - FIN, true], ...Array.from({ length: FLOORS }, (_, f) => {
  const zf = GROUND_FLOOR + STOREY * f;
  return [f + 1, zf + FIN, zf + STOREY - 0.35, false];
})];
for (const [f, lo, top, plinth] of levels) {
  let k = 0; // traveenummer rond de toren, voor de golf
  for (const seg of segments) {
    if (seg.arc) {
      const depth = plinth ? 0.8 : f % 2 ? 1.2 : 0.4;
      const span = [FIN / 2, seg.len - FIN / 2];
      quartzCuts.push(...niche(seg, span, span, depth, lo, top - depth));
      k++;
      continue;
    }
    const bay = seg.len / seg.bays;
    for (let b = 0; b < seg.bays; b++, k++) {
      const depth = plinth ? 0.8 : WAVE[(k + f) % WAVE.length];
      const edges = (h) => [b * bay + FIN / 2 + sway(seg, b, h), (b + 1) * bay - FIN / 2 + sway(seg, b + 1, h)];
      quartzCuts.push(...niche(seg, edges(lo), edges(top), depth, lo, top - depth));
    }
  }
}
const quartz = quartzBody.subtract(union(quartzCuts));

// ---------- Qube ----------
// Blok op de BAG-contour tot het dak, met een verhoogd middendeel. Begane grond 4,5 m, daarboven acht
// lagen; op elke vloer en langs de dakrand een vloerrand die 1,2 m uitsteekt, 0,9 m dik aan de voorkant,
// met een ondervlak onder 45° naar de gevel (de schuin aflopende balkonplaten op de foto's).
const QUBE_GROUND_FLOOR = 4.5;
const QUBE_FLOORS = 8;
const QUBE_STOREY = (z(QUBE_ROOF) - QUBE_GROUND_FLOOR) / QUBE_FLOORS; // 3,31 m
const OUT = 1.2;
const [q0, w0] = QUBE_SW, [q1, w1] = QUBE_NE;
const qubeRect = (e) => rect(q0 - e, w0 - e, q1 + e, w1 + e);
const band = (top, edge) => {
  const lo = top - edge, foot = lo - (OUT + 0.1) * 1.1;
  return Manifold.hull([
    ...qubeRect(OUT).flatMap(([x, y]) => [[x, y, top], [x, y, lo]]),
    ...qubeRect(-0.1).map(([x, y]) => [x, y, foot]),
  ]);
};
const qube = union([
  prism(qubeRect(0), BASE, z(QUBE_ROOF)),
  prism(rect(PV_SW[0], PV_SW[1], PV_NE[0], PV_NE[1]), z(QUBE_ROOF) - 0.1, z(QUBE_PV)),
  ...Array.from({ length: QUBE_FLOORS }, (_, k) => band(QUBE_GROUND_FLOOR + QUBE_STOREY * k + 0.3, 0.9)),
  band(z(QUBE_ROOF), 0.9),
]);

const nodes = [["quartz", quartz], ["qube", qube]].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [`building:q-residences-${name}`, m];
});
console.log("Quartz", { u: [u0, u1], v: [v0, v1], storey: +STOREY.toFixed(3), nissen: quartzCuts.length }, "Qube", { u: [q0, q1], v: [w0, w1], storey: +QUBE_STOREY.toFixed(3) });

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Q Residences",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.34, // NAP -0,72 + NLGEO2018-geoïde 43,056 (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0363100012089779"],
    description:
      "Q Residences aan de Buitenveldertselaan (Studio Gang en Bureau Rijnboutt, 2022): de toren Quartz op 21,8 × 35,4 m met hoeken van 3 m straal tot NAP +72,8 m met een installatie tot +74,0 m, een hoge begane grond met de pui achter de kolommen en 22 lagen loggia's tussen vinnen van 0,9 m, waarvan de diepte (0,4–1,2 m) diagonaal over de gevel golft; in de hoeken gebogen loggia's die per laag wisselen. Ten zuiden het blok Qube op de BAG-contour tot +30,2 m met een verhoogd middendeel tot +32,2 m en op elke vloer een vloerrand die 1,2 m uitsteekt met een ondervlak onder 45°. Hoogtes en de toren-plattegrond uit de 3D BAG (AHN5, 2023), want het AHN4 toont nog de bouwput. Oorsprong in het hart van de BAG-contour op het plein tussen de gebouwen, X-as langs de korte gevels (-0,2° op RD-oost). Verdiepingshoogtes, het traveeraster, de golf van de loggiadieptes, de hoekstraal en de uitsteek van de vloerranden van Qube zijn geschat uit foto's en de luchtfoto.",
    realWorld: {
      groundNapM: GROUND,
      quartzRoofNapM: QUARTZ_ROOF,
      quartzPlantNapM: QUARTZ_PLANT,
      quartzPlanM: [+(u1 - u0).toFixed(2), +(v1 - v0).toFixed(2)],
      quartzCornerRadiusM: R,
      quartzFloors: { ground: GROUND_FLOOR, upper: FLOORS, storeyM: +STOREY.toFixed(3) },
      quartzBays: { long: 6, short: 3, finM: FIN, loggiaDepthsM: [0.4, 0.8, 1.2] },
      qubeRoofNapM: QUBE_ROOF,
      qubeRaisedRoofNapM: QUBE_PV,
      qubeFloors: { ground: QUBE_GROUND_FLOOR, upper: QUBE_FLOORS, storeyM: +QUBE_STOREY.toFixed(3) },
      qubeSlabOverhangM: OUT,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012089779 (bouwjaar 2022), actuele orthoHR, AHN-DTM 0,5 m; 3D BAG LoD2.2 (puntwolk AHN5, 2023); NLGEO2018",
      "https://nl.wikipedia.org/wiki/Q_Residences",
      "https://www.dezeen.com/2022/12/16/studio-gangs-q-residences-amsterdam/",
      "https://studiogang.com/projects/amsterdam-tower/",
      "https://commons.wikimedia.org/wiki/Category:Q_Residences",
    ],
  },
});
