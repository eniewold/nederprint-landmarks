// Little Manhattan (Cornelis Lelyplein / Willem Frogerstraat, Amsterdam Nieuw-West, 2017, studioninedots):
// studentenwoningen bij station Lelylaan. Een Z-vormige voet van negen lagen (ruim 3.000 m²) met daarop twee
// torens: de noordtoren van 23 lagen (73 m) op de noordvleugel langs het spoor en de zuidtoren van 19 lagen (61 m)
// op de oostvleugel aan het plein. Gevels van lichte betonelementen met een strak vensterraster in diepe neggen; de
// buitenste torengevels (noord en west van de noordtoren, oost en zuid van de zuidtoren) hebben in plaats daarvan
// verspreide smalle venstersleuven. Een hoge glazen plint met penanten, en een glazen spleet over de hele hoogte van
// de voet waar de zuidvleugel en de oostvleugel elkaar raken. Op de torendaken luchtkanalen en een installatiekast.
// Alles is één BAG-pand (0363100012246893); het paviljoen in de binnenhof (0363100012246894, 6,8 m) blijft PDOK.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023) en het AHN-DSM (0,5 m), gevelindeling uit foto's.
import { Manifold, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "little-manhattan";
// Stelsel: x naar RD-oost, y naar RD-noord, oorsprong in het hart van de contour. Het gebouw heeft twee
// gevelrichtingen: de noordvleugel staat op 0,6° (BAG-randen binnen 0,1°), de oost- en zuidvleugel op -8,24°.
// De hoekpunten hieronder zijn BAG- en 3D BAG-punten op die rechte lijnen (collineaire knikjes < 0,9 m weggelaten).
const ORIGIN = [117413.0, 485619.0];
const AXIS = [1, 0];
const GROUND = -0.2; // NAP, maaiveld (3D BAG -0,18; AHN-DTM rondom -0,67…-0,03, binnenhof -0,14)
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const L = ([x, y]) => [x - ORIGIN[0], y - ORIGIN[1]];
// Punt op de lijn p–q met een gegeven RD-x of RD-y, zodat torenhoeken exact op de contourlijnen liggen.
const atX = (p, q, x) => [x, p[1] + ((q[1] - p[1]) * (x - p[0])) / (q[0] - p[0])];
const atY = (p, q, y) => [p[0] + ((q[0] - p[0]) * (y - p[1])) / (q[1] - p[1]), y];

// ---------- Hoogtes (NAP), 3D BAG-dakvlakken, gecontroleerd in het AHN-DSM ----------
const PODIUM = 30.8; // voet (3D BAG 30,79–30,84; DSM 30,74–30,79)
const NORTH = 72.97; // noordtoren (3D BAG 72,97–72,99; DSM 72,9–73,0; 73 m volgens de hoogbouwlijst)
const NORTH_KIT = 74.0; // kanalen en kast op de noordtoren (3D BAG 73,93–74,12; DSM +1,0)
const SOUTH = 61.12; // zuidtoren (3D BAG 61,11–61,17; DSM 61,08–61,11)
const SOUTH_KIT = 62.12; // kanalen en kast op de zuidtoren (3D BAG 62,11–62,15; DSM +1,0)

// ---------- Plattegronden (RD) ----------
// BAG-contour linksom: noordvleugel, oostvleugel langs de Willem Frogerstraat, zuidvleugel aan het plein.
const RD = [
  [117445.6, 485660.95], // 0 NO-hoek
  [117384.44, 485660.31], // 1 NW-hoek
  [117384.68, 485640.6], // 2 ZW-hoek noordvleugel
  [117416.53, 485640.95], // 3
  [117417.01, 485644.28], // 4
  [117423.3, 485644.27], // 5 binnenhoek, westgevel oostvleugel
  [117415.58, 485590.97], // 6
  [117409.46, 485591.84], // 7
  [117409.88, 485594.8], // 8
  [117387.63, 485598.01], // 9
  [117384.81, 485578.51], // 10 ZW-hoek zuidvleugel
  [117407.04, 485575.28], // 11
  [117407.32, 485577.19], // 12 glazen spleet, 6,2 m breed en 1,9 m diep
  [117413.46, 485576.29], // 13
  [117413.17, 485574.31], // 14
  [117432.69, 485571.49], // 15 ZO-hoek
];
const CONTOUR = RD.map(L);
// Noordtoren: 3D BAG-dakvlak 95; westgevel 7,5 m terug van de kopgevel, oostgevel 0,8 m buiten de lijn van de
// westgevel van de oostvleugel.
const NORTH_POLY = [
  atX(RD[2], RD[3], 117391.91), RD[3], RD[4], atX(RD[4], RD[5], 117424.1), atX(RD[0], RD[1], 117426.6), atX(RD[0], RD[1], 117391.69),
].map(L);
// Zuidtoren: 3D BAG-dakvlak 100, over de volle breedte van de oostvleugel, 5,4 m terug van de zuidgevel.
const SOUTH_POLY = [
  [117413.39, 485579.76], atY(RD[15], RD[0], 485576.91), atY(RD[15], RD[0], 485609.86), atY(RD[5], RD[6], 485612.57), RD[6],
].map(L);

// Uitsnijvormen voor de voet: de torenvoetafdruk, aan de buitengevels 2 m over de contour heen, zodat de voet
// geen vlak zonder dikte houdt waar toren- en voetgevel in één vlak liggen.
const NE_DIR = [Math.cos((-8.24 * Math.PI) / 180), Math.sin((-8.24 * Math.PI) / 180)]; // normaal op de oostgevel
const shift = (p, k) => [p[0] + NE_DIR[0] * k, p[1] + NE_DIR[1] * k];
const NW_A = atX(RD[2], RD[3], 117391.91), NW_F = atX(RD[0], RD[1], 117391.69); // westgevel noordtoren
const NORTH_CUT = [
  atY(NW_A, NW_F, 485638.0), [117421.5, 485638.0], RD[5], atX(RD[4], RD[5], 117424.1),
  atY(atX(RD[4], RD[5], 117424.1), atX(RD[0], RD[1], 117426.6), 485662.5), atY(NW_A, NW_F, 485662.5),
].map(L);
const SOUTH_CUT = [
  [117413.39, 485579.76], shift(atY(RD[15], RD[0], 485576.91), 2), shift(atY(RD[15], RD[0], 485609.86), 2),
  shift(atY(RD[5], RD[6], 485612.57), -2), RD[6],
].map(L);

// Daktoestellen (DSM 0,5 m; de 3D BAG legt de kast op de noordtoren 2–3 m westelijker).
const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(L);
// Strook langs de richting van de oostvleugel (-8,24°) rond een middellijn door c, van u0 tot u1, breedte w.
const D = [Math.cos((-8.24 * Math.PI) / 180), Math.sin((-8.24 * Math.PI) / 180)];
const band = (c, u0, u1, w) => [[u0, -w / 2], [u1, -w / 2], [u1, w / 2], [u0, w / 2]]
  .map(([u, v]) => L([c[0] + D[0] * u - D[1] * v, c[1] + D[1] * u + D[0] * v]));
const NORTH_KIT_POLYS = [
  box(117405.0, 485641.0, 117406.0, 485660.0), // twee luchtkanalen noord-zuid
  box(117407.0, 485641.0, 117408.0, 485660.0),
  box(117405.0, 485641.0, 117408.0, 485642.0), // bocht aan de zuidkant
  box(117417.0, 485642.0, 117419.0, 485650.0), // installatiekast
];
const SOUTH_KIT_POLYS = [
  band([117426.5, 485597.8], -9.2, 9.9, 1.0), // luchtkanaal noord
  band([117424.0, 485584.6], -8.6, 8.4, 1.0), // luchtkanaal zuid
  band([117420.6, 485588.8], -2.0, 2.0, 2.6), // installatiekast
];

// ---------- Lagen ----------
// Hoge glazen plint (geschat 6,6 m), daarboven lagen van 3,0 m: voet 1 + 8 lagen tot +30,6 m (dakrand 0,4 m),
// noordtoren 1 + 22 lagen (23, zoals de hoogbouwlijst) tot +72,6 m, zuidtoren 1 + 18 lagen tot +60,6 m.
const PLINTH = 6.6;
const STOREY = 3.0;
const floors = (n) => Array.from({ length: n }, (_, k) => PLINTH + STOREY * k);
const PODIUM_FLOORS = floors(8);
const NORTH_FLOORS = floors(22).filter((zf) => zf >= z(PODIUM) - 0.5);
const SOUTH_FLOORS = floors(18).filter((zf) => zf >= z(PODIUM) - 0.5);

const towerN = union([prism(NORTH_POLY, BASE, z(NORTH)), ...NORTH_KIT_POLYS.map((p) => prism(p, z(NORTH) - 0.1, z(NORTH_KIT)))]);
const towerS = union([prism(SOUTH_POLY, BASE, z(SOUTH)), ...SOUTH_KIT_POLYS.map((p) => prism(p, z(SOUTH) - 0.1, z(SOUTH_KIT)))]);
const podium = prism(CONTOUR, BASE, z(PODIUM)).subtract(prism(NORTH_CUT, BASE - 1, z(PODIUM) + 1)).subtract(prism(SOUTH_CUT, BASE - 1, z(PODIUM) + 1));
const body = union([podium, towerN, towerS]);

// ---------- Gevelreliëf ----------
// Blinde nissen van 0,4 m diep met een plafond onder 45° op een raster van 2,25 m dat per gevellijn vastligt
// (zodat voet en toren in hetzelfde vlak dezelfde kolommen hebben):
// - raster: vensters 1,3 m breed en 1,75 m hoog, penanten 0,95 m;
// - sleuven: 0,9 m breed en 2,05 m hoog, verspreid in korte verticale reeksen (per kolom en per drie lagen aan of uit);
// - plint: openingen van 1,35 m breed tot 5,7 m hoog tussen penanten van 0,9 m.
const DEPTH = 0.4;
const PITCH = 2.25;
const cuts = [];
const rnd = (a, b) => {
  const t = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return t - Math.floor(t);
};
function facade(a, b, style, zs) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (len < 4) return;
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n = [d[1], -d[0]]; // n wijst naar buiten (contour linksom)
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const t0 = a[0] * d[0] + a[1] * d[1]; // positie van a langs de gevellijn, vanaf de oorsprong
  const exposed = (s0, s1, lo, top) => [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, top - 0.05].every((h) => {
    const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
    const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
    return at > 2.95 && at < 3.05;
  }));
  for (const zf of zs) {
    const plinth = zf === 0;
    const kind = plinth ? "plint" : style;
    const width = { plint: 1.35, raster: 1.3, sleuf: 0.9 }[kind];
    const lo = plinth ? 0.2 : zf + (kind === "sleuf" ? 0.6 : 0.9);
    const hi = plinth ? PLINTH - 0.9 - DEPTH : zf + STOREY - 0.35 - DEPTH;
    const level = plinth ? -1 : Math.round((zf - PLINTH) / STOREY);
    for (let k = Math.ceil((t0 + 0.9) / PITCH); (k + 1) * PITCH <= t0 + len - 0.9 + 1e-6; k++) {
      const mid = (k + 0.5) * PITCH - t0, s0 = mid - width / 2, s1 = mid + width / 2;
      if (s0 < 0.9 || s1 > len - 0.9) continue;
      if (kind === "sleuf" && rnd(k + 0.37 * a[0], Math.floor(level / 3)) > 0.45) continue;
      if (!exposed(s0, s1, lo, hi + DEPTH)) continue;
      cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
// Voet: overal raster, behalve de westkop van de noordvleugel en de zuidkop van de oostvleugel (sleuven).
const SLIT_CONTOUR = new Set([1, 14]);
edges(CONTOUR).forEach(([a, b], i) => {
  if (i === 12) return; // achterwand van de glazen spleet, hieronder
  facade(a, b, SLIT_CONTOUR.has(i) ? "sleuf" : "raster", [0, ...PODIUM_FLOORS]);
});
// Torens boven de voet: noordtoren sleuven op de west- (rand 5) en noordgevel (rand 4), zuidtoren op de zuid-
// (rand 0) en oostgevel (rand 1); de gevels naar de binnenhof en het plein hebben het raster.
edges(NORTH_POLY).forEach(([a, b], i) => facade(a, b, i === 4 || i === 5 ? "sleuf" : "raster", NORTH_FLOORS));
edges(SOUTH_POLY).forEach(([a, b], i) => facade(a, b, i === 0 || i === 1 ? "sleuf" : "raster", SOUTH_FLOORS));
// Glazen spleet: één nis over de hele hoogte van de voet in de achterwand van de inham in de zuidgevel.
{
  const [a, b] = [CONTOUR[12], CONTOUR[13]];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const lo = 0.2, hi = z(PODIUM) - 1.2 - DEPTH, s0 = 0.9, s1 = len - 0.9;
  cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
}
const cut = union(cuts);

// ---------- Onderdelen ----------
// De voet valt zonder de torens in drie stukken uiteen: de westkop van de noordvleugel, de noordoostvleugel en de
// zuidvleugel met de strook voor de zuidtoren. Elk stuk is een eigen node.
const pieces = podium.subtract(cut).decompose().map((m) => {
  const bb = m.boundingBox();
  return [m, (bb.min[0] + bb.max[0]) / 2, (bb.min[1] + bb.max[1]) / 2];
});
const piece = (test) => pieces.find(([, cx, cy]) => test(cx, cy))[0];
const nodes = [
  ["building:little-manhattan-toren-noord", towerN.subtract(cut)],
  ["building:little-manhattan-toren-zuid", towerS.subtract(cut)],
  ["building:little-manhattan-voet-west", piece((x, y) => x < -20 && y > 15)],
  ["building:little-manhattan-voet-noordoost", piece((x, y) => x > 0 && y > 0)],
  ["building:little-manhattan-voet-zuid", piece((x, y) => y < -15)],
];
if (pieces.length !== 3) throw new Error(`voet: ${pieces.length} stukken`);
for (const [name, m] of nodes) {
  const parts = m.decompose().length;
  if (parts !== 1) throw new Error(`${name}: ${parts} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
}
console.log("nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Little Manhattan",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.82, // NAP -0,2 + geoïde NLGEO2018 43,02 (Leonardo Hotel Rembrandtpark: 43,0)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0363100012246893"],
    description:
      "Little Manhattan bij station Lelylaan (studioninedots, 2017): een Z-vormige voet van negen lagen op de BAG-contour tot NAP +30,8 m, met de noordtoren (23 lagen) tot +72,97 m en de zuidtoren (19 lagen) tot +61,12 m, elk met luchtkanalen en een installatiekast op het dak. Gevels als blinde nissen: een vensterraster van 2,25 m, verspreide venstersleuven op de buitenste torengevels en de koppen eronder, een hoge glazen plint met penanten en een glazen spleet over de hele hoogte van de voet in de inham van de zuidgevel. Hoogtes uit de 3D BAG en het AHN-DSM. Oorsprong in het hart van de contour, X-as naar RD-oost (de gevels staan op 0,6° en -8,24°). Plinthoogte, verdiepingshoogte, vensterraster en de verdeling raster/sleuven over de gevels zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      podiumNapM: PODIUM,
      northTowerNapM: NORTH,
      southTowerNapM: SOUTH,
      roofKitNapM: [NORTH_KIT, SOUTH_KIT],
      floors: { podium: 9, northTower: 23, southTower: 19 },
      plinthM: PLINTH,
      storeyHeightM: STOREY,
      windowPitchM: PITCH,
      footprintM2: 3045,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012246893 (bouwjaar 2017), 3D BAG (LoD2.2, AHN5 2023), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam",
      "https://nl.wikipedia.org/wiki/Willem_Frogerstraat",
      "https://commons.wikimedia.org/wiki/Category:Little_Manhattan_(Amsterdam)",
      "https://commons.wikimedia.org/wiki/File:Little_Manhattan_Amsterdam.jpg",
    ],
  },
});
