// Eurotoren (Luchtmachtplein, Breda, 2000–2001): kantoortoren van 18 lagen en circa 71 m, het hoogste
// gebouw van Breda, nu met het complex ernaast het hoofdkwartier van de Koninklijke Luchtmacht
// (Commando Luchtstrijdkrachten). Drie bouwdelen naast elkaar langs een noord-zuidas:
// - in het westen een sikkel met een gebogen gevel van rode baksteen met doorlopende vensterbanden per
//   laag, een witte dakrand die over de gevel uitsteekt, een diepe nis met een betonnen kader over vier
//   lagen op het westen en een begane grond die achter een rij ronde kolommen terugligt;
// - in het midden een glazen schijf die drie lagen boven de rest uitsteekt als glazen kroon, met een
//   rand rondom op het dak en op de westrand het luchtmachtembleem (kroon) en installaties;
// - in het oosten een blok van rode baksteen met per laag vier vensters op het oosten en één op het
//   noorden en zuiden.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2024) en het AHN-DSM, gevelindeling uit
// Commons-foto's.
import { Manifold, circle, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "luchtmachtplein-breda";
// Gebouwstelsel: x langs de noord- en zuidgevels (3,0° op RD-oost; BAG-randen 2,9–3,2° en 93,0°),
// y langs de oostgevel naar het noorden. Oorsprong in de glazen schijf.
const ORIGIN = [108916.0, 402231.0];
const ANGLE = 3.0;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = 2.9; // NAP, AHN-DTM rondom (2,65–3,29, mediaan 2,88); 3D BAG-maaiveld 2,94
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG-dakvlakken (AHN5) en AHN-DSM ----------
const SLAB_ROOF = 74.35; // glazen schijf (3D BAG 74,28–74,43; DSM 74,3–74,4)
const CURVE_ROOF = 67.97; // sikkel (3D BAG 67,94–68,00; DSM 67,9–68,0)
const EAST_ROOF = 64.37; // bakstenen oostblok (3D BAG 64,34–64,39; DSM 64,3–64,4)
const EMBLEM = 75.77; // embleem met draagframe op de westrand van de schijf (3D BAG 75,76–75,78)
const PLANT_SLAB = 75.88; // installaties op de schijf (3D BAG 75,76–75,95; DSM 75,3–76,0)
const PLANT_EAST = 66.89; // installatiekast op het oostblok (3D BAG 66,88–66,90; DSM 66,9)

// ---------- Plattegrond in (x, y), BAG-contour ----------
// Sikkel: boog van de BAG (cirkelfit straal 33,2 m, restfout < 0,06 m) van de noordpunt tot de zuidpunt,
// daarna de korte rechte oostkant van de zuidpunt; de rest loopt binnen de schijf.
const ARC = [[0.46, 17.13], [-3.31, 20.66], [-5.46, 18.39], [-7.3, 15.84], [-8.77, 13.09], [-11.03, 7.49], [-12.23, 1.57], [-12.33, -4.46], [-11.32, -10.42], [-9.24, -16.09], [-6.28, -21.07]];
const CRESCENT = [...ARC, [-5.66, -17.9], [-5.26, -15.83], [-5.0, -14.51], [-5.0, -14.0], [-5.0, 13.5], [-0.17, 13.5], [-0.17, 13.94], [0.24, 15.97]];
const SLAB = rect(-6.0, -14.5, 4.3, 13.94); // westrand op de grens van de dakvlakken (−5,9 … −6,1), oostrand 4,0–4,6
const EAST = rect(2.97, -15.42, 13.01, 14.65);
const EMBLEM_POLY = [[-1.23, 1.26], [-5.92, 1.28], [-6.03, -0.3], [-1.17, -0.32]]; // 3D BAG
const PLANT_SLAB_POLY = [[-3.92, 7.34], [-2.22, 6.16], [-1.84, 3.03], [-0.79, 2.93], [-0.25, 7.3], [-0.71, 10.03]]; // 3D BAG
const PLANT_EAST_POLY = [[8.91, -7.89], [7.52, -8.24], [7.74, -10.98], [9.26, -11.01]]; // 3D BAG

// ---------- Verdiepingen ----------
// 18 lagen: een hoge begane grond van 9,0 m (glazen hal, onder de sikkel achter kolommen) en daarboven
// lagen van 3,6 m: 14 in het oostblok, 15 in de sikkel, 17 in de schijf (de bovenste drie als glazen kroon).
const GF = 9.0;
const STOREY = 3.6;
const zf = (k) => GF + STOREY * k;
const DEPTH = 0.35;

// ---------- Hulpfuncties langs een rand ----------
const edges = (poly) => poly.map((a, i) => [a, poly[(i + 1) % poly.length]]);
function frame(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]]; // n naar buiten (linksom)
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  return { L, d, n, P };
}
// Nis van s0 tot s1, van lo tot hi recht en daarboven een plafond onder 45° tot hi + depth.
const niche = (F, s0, s1, lo, hi, depth = DEPTH) =>
  Manifold.hull([F.P(s0, -0.2, lo), F.P(s1, -0.2, lo), F.P(s0, depth, lo), F.P(s1, depth, lo), F.P(s0, -0.2, hi + depth + 0.2), F.P(s1, -0.2, hi + depth + 0.2), F.P(s0, depth, hi), F.P(s1, depth, hi)]);
// Ligt de gevel hier aan de buitenkant van de massa?
const exposed = (body, F, s, h) => {
  const from = F.P(s, -3, h), hit = body.rayCast(from, F.P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
};
// Doorlopende banden: per halve meter getest, aaneengesloten stukken ≥ 0,9 m worden één nis.
function bands(body, F, lo, top, cuts, margin = 0.45, marginEnd = margin) {
  let start = null;
  const flush = (s1) => {
    if (start !== null && s1 - start >= 0.9) cuts.push(niche(F, start, s1, lo, top - DEPTH));
    start = null;
  };
  for (let s = margin; s <= F.L - marginEnd + 1e-6; s += 0.25) {
    const ok = exposed(body, F, s, lo + 0.05) && exposed(body, F, s, top - 0.05);
    if (ok && start === null) start = s;
    if (!ok) flush(s - 0.25);
  }
  flush(F.L - marginEnd);
}

// ---------- Massa ----------
// Witte dakrand van de sikkel: 1,0 m buiten de gebogen gevel, 0,67 m dik, met een kraag onder 45°.
const BRIM_OUT = 1.0;
const brimTop = z(CURVE_ROOF), brimLow = brimTop - 0.67, brimFoot = brimLow - BRIM_OUT;
const brim = [];
const arcEdges = edges(ARC).slice(0, ARC.length - 1);
arcEdges.forEach(([a, b], i) => {
  const F = frame(a, b);
  brim.push(Manifold.hull([0, F.L].flatMap((s) => [F.P(s, 0.3, brimFoot - 0.3), F.P(s, 0.3, brimTop), F.P(s, -BRIM_OUT, brimLow), F.P(s, -BRIM_OUT, brimTop)])));
  if (i > 0) {
    // Wig op de knik tussen twee boogranden.
    const G = frame(...arcEdges[i - 1]);
    const out = (n) => [a[0] + n[0] * BRIM_OUT, a[1] + n[1] * BRIM_OUT];
    const inn = [a[0] - (F.n[0] + G.n[0]) * 0.15, a[1] - (F.n[1] + G.n[1]) * 0.15];
    brim.push(Manifold.hull([[...inn, brimFoot - 0.3], [...inn, brimTop], [...a, brimFoot], ...[F.n, G.n].flatMap((n) => [[...out(n), brimLow], [...out(n), brimTop]])]));
  }
});
// Rand rondom de glazen kroon: 0,9 m uitstekend, 0,9 m dik, kraag onder 45°.
const grow = (r, g) => [[r[0][0] - g, r[0][1] - g], [r[1][0] + g, r[1][1] - g], [r[2][0] + g, r[2][1] + g], [r[3][0] - g, r[3][1] + g]];
const ring3 = (pts, h) => pts.map(([x, y]) => [x, y, h]);
const slabTop = z(SLAB_ROOF);
const cornice = Manifold.hull([...ring3(grow(SLAB, 0.9), slabTop), ...ring3(grow(SLAB, 0.9), slabTop - 0.9), ...ring3(grow(SLAB, -0.3), slabTop - 2.1), ...ring3(grow(SLAB, -0.3), slabTop)]);

const mass = union([
  prism(CRESCENT, BASE, z(CURVE_ROOF)),
  prism(SLAB, BASE, slabTop),
  prism(EAST, BASE, z(EAST_ROOF)),
  ...brim,
  cornice,
  prism(EMBLEM_POLY, slabTop - 0.1, z(EMBLEM)),
  prism(PLANT_SLAB_POLY, slabTop - 0.1, z(PLANT_SLAB)),
  prism(PLANT_EAST_POLY, z(EAST_ROOF) - 0.1, z(PLANT_EAST)),
]);

// ---------- Gevelreliëf ----------
const cuts = [];
// Sikkel: vensterband per laag per boogsegment (0,9 m pijler op elke knik), 1,35 m glas met plafond tot
// 2,9 m boven de vloer; ook op de noordpunt en de rechte oostkant van de zuidpunt.
const SLOT_EDGE = 6; // boogrand van (−12,23, 1,57) naar (−12,33, −4,46), gevel naar het westen
const SLOT_FLOORS = [8, 9, 10, 11];
// Spitse zuidpunt (binnenhoek 41°): banden blijven 2,0 m van de punt, anders snijden ze er doorheen.
const TIP = ARC.length - 1;
for (const [i, [a, b]] of edges(CRESCENT).entries()) {
  const F = frame(a, b);
  if (F.L < 1.8) continue;
  for (let k = 0; k < 15; k++) {
    if (i === SLOT_EDGE && SLOT_FLOORS.includes(k)) continue;
    bands(mass, F, zf(k) + 1.2, zf(k) + 2.9, cuts, i === TIP ? 2.0 : 0.45, i === TIP - 1 ? 2.0 : 0.45);
  }
}
// Nis met betonnen kader op het westen: één boogsegment breed, vier lagen hoog, 1,5 m diep.
{
  const F = frame(ARC[SLOT_EDGE], ARC[SLOT_EDGE + 1]);
  cuts.push(niche(F, 0.6, F.L - 0.6, zf(8) + 0.3, zf(12) - 1.5, 1.5));
}
// Schijf: per laag een glasband achter een vloerrand van 0,9 m; de bovenste band blijft onder de dakrand.
// Begane grond: glazen hal tot 8,1 m.
for (const [a, b] of edges(SLAB)) {
  const F = frame(a, b);
  bands(mass, F, 0.3, GF - 0.9, cuts);
  for (let k = 0; k < 17; k++) bands(mass, F, zf(k) + 0.9, Math.min(zf(k) + STOREY, slabTop - 2.0), cuts);
}
// Oostblok: vensters van 4,2 × 1,55 m, vier per laag op het oosten en één op het noorden en zuiden;
// begane grond met vensters per travee en een glasband onder de baksteen.
for (const [a, b] of edges(EAST)) {
  const F = frame(a, b);
  if (F.L < 5) continue;
  const bays = Math.max(1, Math.round(F.L / 7.5)), pitch = F.L / bays, width = 4.2;
  const punched = (lo, top) => {
    for (let j = 0; j < bays; j++) {
      const s0 = pitch * (j + 0.5) - width / 2, s1 = s0 + width;
      const ok = [s0 + 0.1, s1 - 0.1].every((s) => exposed(mass, F, s, lo + 0.05) && exposed(mass, F, s, top - 0.05));
      if (ok) cuts.push(niche(F, s0, s1, lo, top - DEPTH));
    }
  };
  punched(0.3, 4.2);
  bands(mass, F, 5.4, GF - 0.9, cuts, 0.9);
  for (let k = 0; k < 14; k++) punched(zf(k) + 1.0, zf(k) + 2.9);
}
// Begane grond onder de sikkel: 2,5 m terug achter de gevel, plafond onder 45° van 6,5 tot 9,0 m.
const RECESS = 2.5;
for (const [a, b] of arcEdges.slice(1)) {
  const F = frame(a, b);
  cuts.push(Manifold.hull([-0.05, F.L + 0.05].flatMap((s) => [F.P(s, -0.5, BASE - 0.1), F.P(s, RECESS, BASE - 0.1), F.P(s, RECESS, GF - RECESS), F.P(s, -0.5, GF + 0.5)])));
}
// Ronde kolommen (doorsnede ≥ 0,95 m) op de knikken van de boog, met de buitenkant in de gevellijn.
const columns = ARC.slice(2, ARC.length - 1).map((v, j) => {
  const F = frame(ARC[j + 1], v), G = frame(v, ARC[j + 3]);
  const m = [-(F.n[0] + G.n[0]), -(F.n[1] + G.n[1])], ml = Math.hypot(...m);
  return prism(circle([v[0] + (m[0] / ml) * 0.5, v[1] + (m[1] / ml) * 0.5], 0.5, 12), BASE, GF + 0.2);
});

const building = union([mass.subtract(union(cuts)), ...columns]);
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Eurotoren: ${parts.length} losse delen`);
console.log("Eurotoren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [[`building:${slug}-toren`, building]],
  catalog: {
    name: "Eurotoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.76, // NAP 2,9 + 43,86 (NLGEO2018-geoïde 43,97, geijkt op het Rat Verlegh Stadion)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0758100000003827"],
    description:
      "Eurotoren aan het Luchtmachtplein (hoofdkwartier van de Koninklijke Luchtmacht), op de BAG-contour in drie delen: in het westen een sikkel met een gebogen gevel tot NAP +67,97 m met een witte dakrand van 1,0 m, vensterbanden per laag, een nis van vier lagen op het westen en een begane grond die 2,5 m terugligt achter ronde kolommen; in het midden een glazen schijf tot +74,35 m met glasbanden per laag, een dakrand rondom, het embleem (+75,77 m) en installaties (+75,88 m); in het oosten een bakstenen blok tot +64,37 m met vier vensters per laag op het oosten en één op het noorden en zuiden en een installatiekast (+66,89 m). Hoogtes uit de 3D BAG (AHN5). Oorsprong in de schijf, X-as langs de noord- en zuidgevels (3,0° op RD-oost). Verdiepingshoogtes, vensters, de nis, de dakranden en de terugliggende begane grond zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      slabRoofNapM: SLAB_ROOF,
      curveRoofNapM: CURVE_ROOF,
      eastRoofNapM: EAST_ROOF,
      emblemNapM: EMBLEM,
      plantNapM: [PLANT_SLAB, PLANT_EAST],
      floors: 18,
      groundFloorM: GF,
      storeyHeightM: STOREY,
      curveRadiusM: 33.2,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0758100000003827 (bouwjaar 2001, kantoorfunctie), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG LoD2.2 NL.IMBAG.Pand.0758100000003827 (puntenwolk AHN5 2024)",
      "https://skyscraperpage.com/b9552",
      "https://commons.wikimedia.org/wiki/File:Eurotoren_Breda.jpg",
      "https://commons.wikimedia.org/wiki/File:Eurotoren_Breda_DSCF5141.jpg",
      "https://commons.wikimedia.org/wiki/File:P1010384Eurotoren.JPG",
    ],
  },
});
