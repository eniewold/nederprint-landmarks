// Genereert een 3D-model van station Amsterdam Centraal: het stationsgebouw
// van Cuypers (1881-1889) met de middenpartij, de twee torens, de vleugels,
// het westpaviljoen en het Koningspaviljoen, de latere oostvleugel, de vier
// perronkappen als open schalen op kolommen (eerste kap 1889, middenkap 1997,
// tweede kap 1922-1924, busstationkap 2014), het spoorplateau met de perrons
// eronder en het busplatform boven de IJ-hal. Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node per
// onderdeel met de materiaalklasse in de nodenaam, BGT-attributen op de
// weg- en perronlagen) als catalogusbron voor de export en de kaart, plus een
// binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-amsterdam-centraal.mjs             # 1:2000 (standaard)
//   node scripts/generate-amsterdam-centraal.mjs --scale 1000
//
// Het complex is 437 m lang; op 1:1000 past de STL niet op een printbed,
// daarom is 1:2000 hier de standaard.
//
// Waarom de kappen open zijn: het model toont de echte vorm (kappen van
// 1,2 m dik op kolommen, de glazen kopgevels alleen boven de treinen); de
// export vult op wat een print nodig heeft. Onder de kappen zakt het
// PDOK-terrein door tot NAP +2,4 m (het AHN ziet het spoor onder het glas
// niet), en het busplatform ligt er plat op maaiveld. Daarom brengt het model
// het spoorplateau (spoor NAP +5,6 m, perrons +6,6 m, gemeten waar het spoor
// buiten de kappen in het AHN staat) en het busplatform (+6,7 m) zelf mee, met
// de BGT-perrons en -wegdelen als vlakken.
//
// Meetstelsel: alle maten hieronder staan in een stelsel langs de sporen: u
// langs de sporen naar het oostzuidoosten (RD-richting -31,11 graden, de
// hoofdrichting van de BAG-contour), v loodrecht daarop naar het IJ, nulpunt
// RD (121880, 487930). Hoogtes staan als NAP-hoogte in het script en worden
// met `nap()` omgezet. Het model zelf heeft zijn oorsprong in het midden van
// de voorgevel van de middenpartij (u -48,4, v -21,6) op NAP +2,5 m
// (Stationsplein NAP +2,8 m min de 0,3 m van groundOffsetMetres), Z omhoog,
// +X langs de sporen naar het oosten en +Y naar het IJ; de voorgevel ligt
// richting -Y.
//
// Bronnen: BAG-panden en BGT-pand 0363100012185598 (contour van het
// stationsgebouw), BGT-perrons, -overkappingen, -wegdelen en
// -overbruggingsdeel van het busplatform; AHN DSM/DTM 0,5 m (PDOK WCS) voor
// alle hoogtes: dwarsprofielen per vleugel, de omhullende per meter hoogte van
// torens, middenpartij en westpaviljoen, de boogprofielen van de kappen (90e
// percentiel per meter dwars op de sporen, langs de hele kap constant binnen
// 5 cm), het spoor en de perrons buiten de kappen; PDOK luchtfoto
// (dakkapellen, topgevels, glasdak van de oostvleugel); foto's op Wikimedia
// Commons (torens, gevels, kopgevels van de kappen); Wikipedia en het
// Rijksmonumentenregister (5681) voor namen en jaartallen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "amsterdam-centraal");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- meetstelsel en hoogtes ----------
const SURVEY_ORIGIN_RD = [121880, 487930];
const AXIS_DEGREES = -31.11;
// Oorsprong van het model in het meetstelsel: midden van de voorgevel van de
// middenpartij, tussen de torens.
const MODEL_ORIGIN_UV = [-48.4, -21.6];
const Z_REF_NAP = 2.5;
const nap = (height) => height - Z_REF_NAP;
// Vlakke onderkant van alle onderdelen (NAP +0,5 m): onder het Stationsplein
// (NAP +2,8 m) en de IJ-zijde (NAP +0,8 m), zodat nergens een kier ontstaat.
const BOTTOM = nap(0.5);

// ---------- hulpfuncties (meetstelsel, meters) ----------
const union = (parts) => Manifold.union(parts.filter(Boolean));
const box = (u0, u1, v0, v1, z0, z1) =>
  Manifold.cube([u1 - u0, v1 - v0, z1 - z0], false).translate([u0, v0, z0]);
// Blok met NAP-hoogtes.
const block = (u0, u1, v0, v1, top, bottom = null) =>
  box(u0, u1, v0, v1, bottom === null ? BOTTOM : nap(bottom), nap(top));

function ccw(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];
    area += x0 * y1 - x1 * y0;
  }
  return area > 0 ? points : [...points].reverse();
}
const section = (points) => new CrossSection([ccw(points)]);

// Dwarsdoorsnede [v, z] (veelhoek of CrossSection) uitgetrokken langs u van
// u0 tot u1. Extrude trekt langs Z; de twee rotaties zetten (X, Y, Z) om naar
// (Z, X, Y) = (u, v, z).
const prismU = (profile, u0, u1) =>
  Manifold.extrude(profile instanceof CrossSection ? profile : section(profile), u1 - u0)
    .rotate([90, 0, 0])
    .rotate([0, 0, 90])
    .translate([u0, 0, 0]);

// Langsdoorsnede [u, z] uitgetrokken langs v van v0 tot v1: na de rotatie om X
// loopt de extrusie naar -v, dus eerst naar v1 schuiven.
const prismV = (profile, v0, v1) =>
  Manifold.extrude(profile instanceof CrossSection ? profile : section(profile), v1 - v0)
    .rotate([90, 0, 0])
    .translate([0, v1, 0]);

// Plattegrond [u, v] als verticaal prisma met NAP-hoogtes.
const plan = (points, top, bottom = null) =>
  Manifold.extrude(section(points), nap(top) - (bottom === null ? BOTTOM : nap(bottom))).translate([
    0,
    0,
    bottom === null ? BOTTOM : nap(bottom),
  ]);

// Een dak of topgevel als profiel met NAP-hoogtes, dicht gemaakt tot de onderkant.
const closedProfile = (top) => [
  [top[0][0], BOTTOM],
  ...top.map(([a, z]) => [a, nap(z)]),
  [top[top.length - 1][0], BOTTOM],
];

// Gevel met topgevel: rechthoek tot de schouders, driehoek tot de top.
const gable = (c, halfWidth, shoulder, peak) =>
  closedProfile([
    [c - halfWidth, shoulder],
    [c, peak],
    [c + halfWidth, shoulder],
  ]);

// Puntenwolk [u, v, NAP] → convex omhulsel.
const hullNap = (points) => Manifold.hull(points.map(([u, v, z]) => [u, v, nap(z)]));
const square = (cu, cv, half, z) => [
  [cu - half, cv - half, z],
  [cu + half, cv - half, z],
  [cu + half, cv + half, z],
  [cu - half, cv + half, z],
];

// Rij nissen (vensters) in een gevel evenwijdig aan u. `face` is de v van de
// gevel, `out` de richting naar buiten (-1 voorzijde, +1 achterzijde), de
// nissen zijn 0,35 m diep en snijden ook door een topgevel of risaliet die
// tot 0,5 m voor de gevel staat.
const NICHE_DEPTH = 0.35;
function nichesU(u0, u1, face, out, rows, { pitch = 3.6, width = 1.6, margin = 1.2 } = {}) {
  const count = Math.max(1, Math.floor((u1 - u0 - 2 * margin + pitch - width) / pitch));
  const start = (u0 + u1) / 2 - ((count - 1) * pitch) / 2;
  const [va, vb] = out < 0 ? [face - 0.5, face + NICHE_DEPTH] : [face - NICHE_DEPTH, face + 0.5];
  return rows.flatMap(([z0, z1]) =>
    Array.from({ length: count }, (_, k) => block(start + k * pitch - width / 2, start + k * pitch + width / 2, va, vb, z1, z0)),
  );
}
// Idem in een gevel evenwijdig aan v (kopgevels), `face` is de u van de gevel.
function nichesV(v0, v1, face, out, rows, { pitch = 3.6, width = 1.6, margin = 1.2 } = {}) {
  const count = Math.max(1, Math.floor((v1 - v0 - 2 * margin + pitch - width) / pitch));
  const start = (v0 + v1) / 2 - ((count - 1) * pitch) / 2;
  const [ua, ub] = out < 0 ? [face - 0.5, face + NICHE_DEPTH] : [face - NICHE_DEPTH, face + 0.5];
  return rows.flatMap(([z0, z1]) =>
    Array.from({ length: count }, (_, k) => block(ua, ub, start + k * pitch - width / 2, start + k * pitch + width / 2, z1, z0)),
  );
}

// ---------- stationsgebouw: hoofdvleugels ----------
// Dwarsprofiel uit het AHN (u -115..-92 en -20..22 gelijk): voorgevel op
// v -9,0 met de goot op NAP +21,3 m, steile mansarde tot de knik op NAP +25,3 m
// (v -6), flauw tot de nok op NAP +26,0 m in het midden en weer omlaag naar de
// achtergoot op NAP +21,0 m tegen de eerste kap.
const WING_FRONT = -9.0;
const BUILDING_BACK = 9.6; // achtergevel tegen perron 1, volgens de BGT
const WING_EAVE = 21.3;
const wingProfile = closedProfile([
  [WING_FRONT, WING_EAVE],
  [-6.0, 25.3],
  [0.0, 26.0],
  [6.0, 25.3],
  [BUILDING_BACK, 21.0],
]);
const mainWings = prismU(wingProfile, -139.3, 23.3);

// Topgevels van de dakkapellen aan de voorzijde (AHN: top op NAP +27 tot
// +28,7 m, luchtfoto: puntige schaduwen).
const TOPGEVELS = [
  { u: -105.5, peak: 27.0 },
  { u: -86.5, peak: 28.7 },
  { u: -11.5, peak: 27.7 },
  { u: 8.0, peak: 28.6 },
];
const topgevels = union(
  TOPGEVELS.map(({ u, peak }) => prismV(gable(u, 1.6, 23.0, peak), WING_FRONT - 0.3, -5.0)),
);

// Rij kleine dakkapellen in de voorste mansarde (luchtfoto: om de 3,6 m),
// elk 1,4 m breed met een puntdakje; niet waar een topgevel, toren of
// paviljoen staat.
const DORMER_RUNS = [
  [-138, -128],
  [-117.5, -108],
  [-103, -89],
  [-84, -73],
  [-24, -14],
  [-9, 5.5],
  [10.5, 22],
];
function dormer(u, front = WING_FRONT + 0.4) {
  return prismV(
    closedProfile([
      [u - 0.7, 23.3],
      [u, 24.3],
      [u + 0.7, 23.3],
    ]),
    front,
    -5.5,
  ).intersect(block(u - 1, u + 1, front - 1, -5, 30, 21.6));
}
const dormers = union(
  DORMER_RUNS.flatMap(([a, b]) => {
    const n = Math.floor((b - a) / 3.6) + 1;
    const start = (a + b) / 2 - ((n - 1) * 3.6) / 2;
    return Array.from({ length: n }, (_, k) => dormer(start + k * 3.6));
  }),
);

// ---------- westpaviljoen ----------
// Risaliet van 8,5 × 10,2 m, 2,2 m voor de vleugel, met gevels tot NAP +25 m
// en een steil schilddak tot de korte nok op NAP +32 m (AHN-omhullende), met
// een dakkapel per dakvlak aan voor- en zijkanten.
const PAVILION = { u0: -127.0, u1: -118.5, v0: -11.2, v1: -1.0, eave: 25.0, ridge: 32.0 };
const westPavilion = (() => {
  const { u0, u1, v0, v1, eave, ridge } = PAVILION;
  const cu = (u0 + u1) / 2;
  const roof = hullNap([
    [u0, v0, eave],
    [u1, v0, eave],
    [u1, v1, eave],
    [u0, v1, eave],
    [cu - 0.3, -7.6, ridge],
    [cu + 0.3, -7.6, ridge],
    [cu - 0.3, -5.6, ridge],
    [cu + 0.3, -5.6, ridge],
  ]);
  const cornice = block(u0 - 0.3, u1 + 0.3, v0 - 0.3, v1, eave, eave - 0.6);
  const front = prismV(
    closedProfile([
      [cu - 0.8, eave + 1.2],
      [cu, eave + 3.4],
      [cu + 0.8, eave + 1.2],
    ]),
    v0 + 0.4,
    v0 + 3.0,
  ).intersect(block(cu - 1, cu + 1, v0, v0 + 3, 40, eave - 0.6));
  return union([block(u0, u1, v0, v1, eave), cornice, roof, front]);
})();

// ---------- lage westvleugel ----------
// Gevel tot NAP +11,5 m, zadeldak met de nok op NAP +15,4 m, achter aflopend
// naar NAP +14,1 m; aan het westeinde een hoger kopgebouw. Voor de vleugel
// lage aanbouwen van één laag (AHN NAP +6,1 tot +7,1 m).
const westWingProfile = (front) =>
  closedProfile([
    [front, 11.5],
    [3.5, 15.4],
    [BUILDING_BACK, 14.1],
  ]);
const westWing = union([
  prismU(westWingProfile(-0.7), -205.6, -183.0),
  prismU(westWingProfile(-2.6), -183.0, -139.3),
  block(-205.6, -201.5, -0.7, BUILDING_BACK, 18.7),
  prismU(
    closedProfile([
      [-7.5, 6.1],
      [-2.6, 7.1],
    ]),
    -184.0,
    -146.0,
  ),
  block(-202.0, -190.0, -5.0, -0.7, 6.4),
]);

// ---------- middenpartij ----------
// Tussen de torens: een lager voorblok met mansarde (NAP +22,5 tot +25,8 m),
// daarachter de grote dwarskap over u -60..-38 met de nok op NAP +34,2 m van
// de voorgevel tot v -2, achter afgewolfd. Aan de voorzijde de topgevel tot
// NAP +38 m met twee hoektorentjes, en op de begane grond drie poorten.
const frontBlock = prismU(
  closedProfile([
    [-21.0, 22.5],
    [-18.5, 25.8],
    [WING_FRONT, 25.8],
  ]),
  -71.2,
  -25.6,
);
const CENTRAL = { u0: -60.0, u1: -38.0, front: -21.0, back: 2.5, eave: 26.0, ridge: 34.2 };
const centralRoof = prismV(
  closedProfile([
    [CENTRAL.u0, CENTRAL.eave],
    [-53.5, CENTRAL.ridge],
    [-43.5, CENTRAL.ridge],
    [CENTRAL.u1, CENTRAL.eave],
  ]),
  CENTRAL.front,
  CENTRAL.back,
).intersect(
  prismU(
    closedProfile([
      [CENTRAL.front, CENTRAL.ridge],
      [-2.0, CENTRAL.ridge],
      [CENTRAL.back, CENTRAL.eave],
    ]),
    CENTRAL.u0,
    CENTRAL.u1,
  ),
);
const centralGable = union([
  prismV(gable(-48.6, 5.4, 33.6, 38.0), -21.6, -20.4),
  // Hoektorentjes naast de topgevel.
  ...[-54.6, -42.6].flatMap((u) => [
    block(u - 0.6, u + 0.6, -21.6, -20.4, 35.6, 26.0),
    hullNap([...square(u, -21.0, 0.6, 35.6), [u, -21.0, 37.0]]),
  ]),
]);
const centralBlock = union([
  block(CENTRAL.u0, CENTRAL.u1, CENTRAL.front, CENTRAL.back, CENTRAL.eave),
  centralRoof,
  centralGable,
]);
const centralCuts = [
  // Drie poorten (de ingang) en twee hoge vensters erboven.
  ...[-53.0, -48.6, -44.2].map((u) => block(u - 1.6, u + 1.6, -21.7, -20.9, 9.5, 2.8)),
  ...[-51.0, -46.2].map((u) => block(u - 1.1, u + 1.1, -21.7, -20.9, 21.0, 12.0)),
];

// ---------- torens ----------
// Vierkante schachten van 9,3 × 9,0 m (AHN-omhullende) tot de kroonlijst op
// NAP +29 m, met hoekpinakels; daarboven een steile leien kap in twee
// geledingen (tot NAP +33 m en +37,8 m), een lantaarn en een naald tot de
// hoogste AHN-punten. In de schacht de wijzerplaat (west: klok, oost:
// windwijzer) als ronde nis aan drie kanten.
const TOWERS = [
  { cu: -67.35, cv: -17.0, top: 43.7 },
  { cu: -29.5, cv: -16.85, top: 44.0 },
];
const TOWER_HALF = [4.65, 4.5];
const TOWER_SHAFT_TOP = 29.0;
function tower({ cu, cv, top }) {
  const [hu, hv] = TOWER_HALF;
  const shaft = block(cu - hu, cu + hu, cv - hv, cv + hv, TOWER_SHAFT_TOP);
  const cornice = block(cu - hu - 0.35, cu + hu + 0.35, cv - hv - 0.35, cv + hv + 0.35, TOWER_SHAFT_TOP, TOWER_SHAFT_TOP - 0.7);
  const pinnacles = [-1, 1].flatMap((su) =>
    [-1, 1].flatMap((sv) => {
      const pu = cu + su * (hu - 0.2);
      const pv = cv + sv * (hv - 0.2);
      return [
        block(pu - 0.6, pu + 0.6, pv - 0.6, pv + 0.6, 31.4, TOWER_SHAFT_TOP - 0.1),
        hullNap([...square(pu, pv, 0.6, 31.4), [pu, pv, 32.6]]),
      ];
    }),
  );
  const roofLow = hullNap([...square(cu, cv, 3.8, TOWER_SHAFT_TOP), ...square(cu, cv, 2.8, 33.0)]);
  const roofHigh = hullNap([...square(cu, cv, 2.8, 33.0), ...square(cu, cv, 1.5, 37.8)]);
  const lantern = block(cu - 1.0, cu + 1.0, cv - 1.0, cv + 1.0, 40.0, 37.7);
  const needle = hullNap([...square(cu, cv, 1.0, 40.0), [cu, cv, top]]);
  // Een dakkapel op elk vlak van de onderste geleding.
  const dormers = [0, 90, 180, 270].map((deg) =>
    Manifold.hull([
      [-0.65, -3.75, nap(29.4)],
      [0.65, -3.75, nap(29.4)],
      [-0.65, -3.75, nap(31.0)],
      [0.65, -3.75, nap(31.0)],
      [0, -3.75, nap(31.8)],
      [-0.65, -2.2, nap(29.4)],
      [0.65, -2.2, nap(29.4)],
      [0, -2.2, nap(31.8)],
    ])
      .rotate([0, 0, deg])
      .translate([cu, cv, 0]),
  );
  return union([shaft, cornice, ...pinnacles, roofLow, roofHigh, lantern, needle, ...dormers]);
}
function towerCuts({ cu, cv }) {
  const [hu, hv] = TOWER_HALF;
  const disc = (r) => Manifold.cylinder(NICHE_DEPTH + 0.05, r, r, 32);
  const z = nap(24.2);
  return [
    disc(1.7).rotate([90, 0, 0]).translate([cu, cv - hv + NICHE_DEPTH, z]),
    disc(1.7).rotate([0, 90, 0]).translate([cu - hu - 0.05, cv, z]),
    disc(1.7).rotate([0, -90, 0]).translate([cu + hu + 0.05, cv, z]),
    // Twee rijen vensters onder de wijzerplaat aan de voorzijde.
    block(cu - 2.4, cu - 0.6, cv - hv - 0.05, cv - hv + NICHE_DEPTH, 20.4, 15.0),
    block(cu + 0.6, cu + 2.4, cv - hv - 0.05, cv - hv + NICHE_DEPTH, 20.4, 15.0),
    block(cu - 2.4, cu - 0.6, cv - hv - 0.05, cv - hv + NICHE_DEPTH, 13.2, 9.4),
    block(cu + 0.6, cu + 2.4, cv - hv - 0.05, cv - hv + NICHE_DEPTH, 13.2, 9.4),
  ];
}

// ---------- Koningspaviljoen ----------
// Koninklijke wachtkamer aan de oostkant: schilddak met een plat bovenvlak op
// NAP +29,9 m, en het naar voren stekende portaal met een kap langs v (nok
// NAP +27,6 m, AHN) en een topgevel tot NAP +31,5 m.
const royalPavilion = prismU(
  closedProfile([
    [-10.3, 20.7],
    [-6.0, 29.9],
    [4.5, 29.9],
    [BUILDING_BACK, 20.7],
  ]),
  23.3,
  42.6,
).intersect(
  prismV(
    closedProfile([
      [23.3, 20.7],
      [27.0, 29.9],
      [39.0, 29.9],
      [42.6, 20.7],
    ]),
    -10.3,
    BUILDING_BACK,
  ),
);
const royalPorch = union([
  prismV(
    closedProfile([
      [28.3, 21.0],
      [33.0, 27.6],
      [37.7, 21.0],
    ]),
    -21.0,
    -10.0,
  ),
  prismV(gable(33.0, 4.4, 21.5, 31.5), -21.3, -20.1),
]);
// Laag tussenstuk boven de oostelijke doorgang (NAP +14,5 m); de doorgang zelf
// (v tot 2,6) blijft open.
const eastPassage = block(42.6, 48.4, 2.6, BUILDING_BACK, 14.5);

// ---------- oostvleugel ----------
// Vier lagen baksteen met een mansarde: voorgevel op v -6,5 met de goot op
// NAP +18 m, plat bovendak op NAP +23,4 m met in het midden een glazen kap tot
// NAP +24,3 m (luchtfoto), achtergoot op NAP +17,9 m. Twee hogere risalieten
// met een plat dak op NAP +25,4 m en een topgevel, drie smalle topgevels naast
// elkaar (u 101, 107, 113; AHN-pieken op NAP +24 m), platte dakkapellen en aan
// het oosteinde een hoekblok met kantelen en een torentje.
const EAST_FRONT = -6.5;
const EAST_BACK = 9.1;
const EAST_EAVE = 18.0;
const eastProfile = closedProfile([
  [EAST_FRONT, EAST_EAVE],
  [-2.0, 23.4],
  [-1.0, 23.4],
  [0.8, 24.3],
  [2.6, 23.4],
  [5.0, 23.4],
  [EAST_BACK, 17.9],
]);
const EAST_RISALITS = [
  { u0: 59.0, u1: 70.5, peak: 26.4 },
  { u0: 146.0, u1: 157.5, peak: 25.6 },
];
const EAST_GABLES = [101, 107, 113];
const EAST_CORNER = { u0: 157.5, u1: 167.8, top: 23.9 };
const eastWing = union([
  prismU(eastProfile, 48.4, EAST_CORNER.u0),
  ...EAST_RISALITS.flatMap(({ u0, u1, peak }) => [
    block(u0, u1, EAST_FRONT, EAST_BACK, 25.4),
    block(u0 - 0.3, u1 + 0.3, EAST_FRONT - 0.3, EAST_BACK + 0.3, 25.4, 24.8),
    prismV(gable((u0 + u1) / 2, 3.2, 24.8, peak), EAST_FRONT - 0.4, EAST_FRONT + 1.0),
  ]),
  ...EAST_GABLES.map((u) => prismV(gable(u, 2.3, EAST_EAVE + 1.6, 24.0), EAST_FRONT - 0.3, -3.0)),
  // Platte dakkapellen in de voorste mansarde.
  ...[
    [72.5, 97.5],
    [117.0, 144.0],
  ].flatMap(([a, b]) => {
    const n = Math.floor((b - a) / 3.0) + 1;
    const start = (a + b) / 2 - ((n - 1) * 3.0) / 2;
    return Array.from({ length: n }, (_, k) => block(start + k * 3.0 - 0.8, start + k * 3.0 + 0.8, -5.2, -3.0, 21.2, EAST_EAVE));
  }),
  // Hoekblok met kantelen en een rond torentje op de voorhoek.
  block(EAST_CORNER.u0, EAST_CORNER.u1, EAST_FRONT, EAST_BACK, EAST_CORNER.top),
  ...Array.from({ length: 5 }, (_, k) => {
    const u = EAST_CORNER.u0 + 1.0 + k * 2.0;
    return [
      block(u, u + 1.0, EAST_FRONT, EAST_FRONT + 1.0, EAST_CORNER.top + 1.0, EAST_CORNER.top - 0.1),
      block(u, u + 1.0, EAST_BACK - 1.0, EAST_BACK, EAST_CORNER.top + 1.0, EAST_CORNER.top - 0.1),
    ];
  }).flat(),
  ...Array.from({ length: 7 }, (_, k) => {
    const v = EAST_FRONT + 1.5 + k * 2.0;
    return block(EAST_CORNER.u1 - 1.0, EAST_CORNER.u1, v, v + 1.0, EAST_CORNER.top + 1.0, EAST_CORNER.top - 0.1);
  }),
  Manifold.cylinder(nap(26.4) - nap(EAST_CORNER.top - 0.1), 1.5, 1.5, 24).translate([165.6, -4.3, nap(EAST_CORNER.top - 0.1)]),
  Manifold.cylinder(nap(27.4) - nap(26.4), 1.5, 0.15, 24).translate([165.6, -4.3, nap(26.4)]),
]);

// ---------- voorgevel: nissen, luifel ----------
// Vensters als nissen van 0,35 m: in de vleugels van Cuypers drie lagen (de
// begane grond hoog en rondboogvormig afgekapt tot een rechthoek), in de
// oostvleugel vier lagen op 3 m, in de lage westvleugel één laag boven de
// aanbouwen.
const CUYPERS_ROWS = [
  [4.0, 8.8],
  [10.4, 14.4],
  [15.8, 19.6],
];
const facadeCuts = [
  ...nichesU(-139.3, PAVILION.u0, WING_FRONT, -1, CUYPERS_ROWS),
  ...nichesU(PAVILION.u1, -72.0, WING_FRONT, -1, CUYPERS_ROWS),
  // Achter de luifel alleen de verdiepingen.
  ...nichesU(-25.0, 23.3, WING_FRONT, -1, CUYPERS_ROWS.slice(1)),
  ...nichesU(PAVILION.u0, PAVILION.u1, PAVILION.v0, -1, [...CUYPERS_ROWS, [20.6, 23.6]], { pitch: 2.6, width: 1.4 }),
  ...nichesU(-62.7, CENTRAL.u0, -21.0, -1, CUYPERS_ROWS, { margin: 0.4, width: 1.2 }),
  ...nichesU(CENTRAL.u1, -34.2, -21.0, -1, CUYPERS_ROWS, { margin: 0.4, width: 1.2 }),
  ...nichesU(23.3, 28.0, -10.3, -1, CUYPERS_ROWS, { margin: 0.8, width: 1.4 }),
  ...nichesU(38.0, 42.6, -10.3, -1, CUYPERS_ROWS, { margin: 0.8, width: 1.4 }),
  ...nichesU(28.3, 37.7, -21.3, -1, [[12.0, 19.0]], { pitch: 3.0, width: 1.8 }),
  ...nichesU(48.4, 157.5, EAST_FRONT, -1, [
    [4.2, 6.8],
    [8.0, 10.4],
    [11.6, 14.0],
    [15.0, 17.2],
  ], { pitch: 3.0, width: 1.6 }),
  ...nichesU(EAST_CORNER.u0, EAST_CORNER.u1, EAST_FRONT, -1, [
    [4.2, 6.8],
    [8.0, 10.4],
    [11.6, 14.0],
    [15.0, 17.2],
    [18.6, 21.6],
  ], { pitch: 2.4, width: 1.3, margin: 0.8 }),
  ...nichesV(EAST_FRONT, EAST_BACK, EAST_CORNER.u1, 1, [
    [4.2, 6.8],
    [8.0, 10.4],
    [11.6, 14.0],
    [15.0, 17.2],
    [18.6, 21.6],
  ], { pitch: 2.6, width: 1.3, margin: 0.8 }),
  ...nichesU(-201.5, -183.0, -0.7, -1, [[8.0, 10.6]], { pitch: 3.0, width: 1.4 }),
  ...nichesU(-183.0, -139.3, -2.6, -1, [[8.0, 10.6]], { pitch: 3.0, width: 1.4 }),
  ...centralCuts,
  ...TOWERS.flatMap(towerCuts),
];

// Luifel voor de oostelijke hoofdvleugel (BGT-overkapping, AHN NAP +7,8 m):
// een plaat van 0,9 m tegen de gevel en tegen het portaal van het
// Koningspaviljoen.
const frontCanopy = union([
  block(-20.6, 28.0, -16.2, WING_FRONT + 0.2, 7.8, 6.9),
  block(1.6, 28.0, -19.0, -16.0, 7.8, 6.9),
]);

const stationBuilding = union([
  mainWings,
  topgevels,
  dormers,
  westPavilion,
  westWing,
  frontBlock,
  centralBlock,
  ...TOWERS.map(tower),
  royalPavilion,
  royalPorch,
  eastPassage,
  eastWing,
  frontCanopy,
]).subtract(union(facadeCuts));

// ---------- spoorplateau en perrons ----------
// Spoor op NAP +5,6 m en perrons op NAP +6,6 m (AHN-DTM waar het spoor buiten
// de kappen ligt: spoorstaven 5,5-5,7, perrons 6,5-6,6). De perrons volgen de
// BGT-perrons (dwars op de sporen gelijk tot u 80; daarna buigen perron 4 tot
// 6 af naar het noorden). Het plateau loopt onder de kappen door, vanaf
// u -202,75 (het westeinde van de eerste kap) onder de eerste kap en vanaf
// u -262 onder de andere kappen, tot u 105.
const TRACK = 5.6;
const PLATFORM = 6.6;
const DECK_EAST = 105.0;
const DECK_WEST = { south: -202.75, north: -262.0, split: 55.0 };
const DECK_NORTH = 109.9;
// [v-zuid, v-noord] op u ≤ 80 en op u = 105.
const PLATFORMS = [
  { v: [BUILDING_BACK, 19.5], east: [BUILDING_BACK, 19.5] },
  { v: [31.0, 39.0], east: [31.0, 39.0] },
  { v: [50.0, 60.0], east: [50.0, 59.5] },
  { v: [71.0, 79.0], east: [67.8, 75.3] },
  { v: [90.5, 99.0], east: [85.3, 90.8] },
  { v: [106.5, DECK_NORTH], east: [98.8, DECK_NORTH] },
];
const deckPlan = [
  [DECK_WEST.south, BUILDING_BACK],
  [DECK_EAST, BUILDING_BACK],
  [DECK_EAST, DECK_NORTH],
  [DECK_WEST.north, DECK_NORTH],
  [DECK_WEST.north, DECK_WEST.split],
  [DECK_WEST.south, DECK_WEST.split],
];
const platformPlan = ({ v: [a, b], east: [c, d] }) => {
  const west = a < DECK_WEST.split ? DECK_WEST.south : DECK_WEST.north;
  return [
    [west, a],
    [80, a],
    [DECK_EAST, c],
    [DECK_EAST, d],
    [80, b],
    [west, b],
  ];
};
const deckSection = section(deckPlan);
const platformSection = PLATFORMS.map((p) => section(platformPlan(p))).reduce((a, b) => a.add(b));
const extrudeSection = (cs, top, bottom) =>
  Manifold.extrude(cs, nap(top) - nap(bottom)).translate([0, 0, nap(bottom)]);
const ROAD_LAYER = 0.5;
const railViaduct = extrudeSection(deckSection, TRACK - ROAD_LAYER, 0.5);
const trackBed = extrudeSection(deckSection.subtract(platformSection), TRACK, TRACK - ROAD_LAYER);
const platforms = extrudeSection(deckSection.intersect(platformSection), PLATFORM, TRACK - ROAD_LAYER);

// ---------- IJ-hal en busplatform ----------
// Het busplatform (BGT-overbruggingsdeel G0363.9806c03a…) ligt op NAP +6,7 m
// boven de IJ-hal (BAG 0363100012242112, u -206..46) en loopt onder de hele
// busstationkap door; naar het oosten daalt de busbaan over 75 m naar de
// kade. Waar geen IJ-hal onder ligt, staat de plaat op kolommen boven de weg.
const BUS = 6.7;
const BUS_DECK = { u0: -262.0, u1: 100.0, v0: DECK_NORTH, v1: 157.7 };
const IJ_HALL = [
  [-206.1, 111.5],
  [46.3, 111.5],
  [46.3, BUS_DECK.v1],
  [-206.1, BUS_DECK.v1],
];
const RAMP = { u0: BUS_DECK.u1, u1: 175.0, v0: 110.0, v1: 117.0, end: 1.8 };
const rampTop = (u) => BUS + ((RAMP.end - BUS) * (u - RAMP.u0)) / (RAMP.u1 - RAMP.u0);
const rampSolid = (top, thickness) =>
  hullNap([
    [RAMP.u0, RAMP.v0, top(RAMP.u0)],
    [RAMP.u0, RAMP.v1, top(RAMP.u0)],
    [RAMP.u1, RAMP.v0, top(RAMP.u1)],
    [RAMP.u1, RAMP.v1, top(RAMP.u1)],
    [RAMP.u0, RAMP.v0, top(RAMP.u0) - thickness],
    [RAMP.u0, RAMP.v1, top(RAMP.u0) - thickness],
    [RAMP.u1, RAMP.v0, top(RAMP.u1) - thickness],
    [RAMP.u1, RAMP.v1, top(RAMP.u1) - thickness],
  ]);
const busDeckColumns = [];
for (let u = BUS_DECK.u0 + 4; u < BUS_DECK.u1; u += 12) {
  if (u > -207 && u < 47.3) continue;
  for (const v of [124.0, 140.0, 155.5]) busDeckColumns.push(block(u - 0.6, u + 0.6, v - 0.6, v + 0.6, BUS - ROAD_LAYER));
}
for (let u = RAMP.u0 + 12; u < RAMP.u1 - 10; u += 12) {
  busDeckColumns.push(block(u - 0.6, u + 0.6, 112.9, 114.1, rampTop(u) - ROAD_LAYER));
}
const busStructure = union([
  plan(IJ_HALL, BUS - ROAD_LAYER),
  block(BUS_DECK.u0, BUS_DECK.u1, BUS_DECK.v0, BUS_DECK.v1, BUS - ROAD_LAYER, BUS - 2.0),
  rampSolid((u) => rampTop(u) - ROAD_LAYER, 1.2).intersect(block(RAMP.u0, RAMP.u1, RAMP.v0, RAMP.v1, 20)),
  ...busDeckColumns,
]);
// Wegdelen op het platform (BGT, relatieve hoogteligging 1): de busbanen
// (OV-baan) langs beide randen en op de helling, de busperrons (voetpad)
// ertussen.
const BUS_LANES = [
  [BUS_DECK.v0, 131.5],
  [149.5, BUS_DECK.v1],
];
const BUS_PLATFORMS = [131.5, 149.5];
const busLanes = union([
  ...BUS_LANES.map(([v0, v1]) => block(BUS_DECK.u0, BUS_DECK.u1, v0, v1, BUS, BUS - ROAD_LAYER)),
  rampSolid(rampTop, ROAD_LAYER).intersect(block(RAMP.u0, RAMP.u1, RAMP.v0, RAMP.v1, 20)),
]);
const busPlatforms = block(BUS_DECK.u0, BUS_DECK.u1, BUS_PLATFORMS[0], BUS_PLATFORMS[1], BUS, BUS - ROAD_LAYER);

// ---------- perronkappen ----------
// Boogprofielen uit het AHN-DSM: 90e percentiel per meter dwars op de sporen
// (NAP-hoogte vanaf de eerste v), over u -190 tot 80 gemeten. De eerste en de
// tweede kap hebben een lichtstraat in de nok (de sprong van ruim 1 m); de
// kappen sluiten in de goten op elkaar aan. Elke kap is een schaal van 1,2 m
// (loodrecht op het dakvlak) die in de goten op een rij kolommen staat. De
// historische kappen hebben aan beide kopse kanten een glazen kopgevel die
// 1 m terugligt en tot NAP +12,5 m reikt (foto's); daaronder rijden de
// treinen. De middenkap en de busstationkap zijn aan de kopse kanten open.
const HALLS = [
  {
    label: "eerste kap",
    // L.J. Eijmer, 1889: overspanning van bijna 45 m.
    from: 10,
    profile: [
      14.55, 15.70, 18.15, 19.05, 20.30, 21.25, 22.05, 22.75, 23.35, 23.95,
      24.45, 24.95, 25.35, 25.75, 26.05, 26.35, 26.60, 27.80, 28.15, 28.40,
      28.65, 28.85, 29.05, 28.90, 28.65, 28.45, 28.25, 27.95, 26.60, 26.40,
      26.10, 25.75, 25.40, 25.00, 24.55, 24.00, 23.45, 22.80, 22.15, 21.35,
      20.45, 19.35, 18.15, 16.15, 14.30, 13.25,
    ],
    // Sluit aan op de achtergevel van het stationsgebouw.
    start: [BUILDING_BACK, 14.1],
    u: [-202.75, 105.75],
    screen: 12.5,
  },
  {
    label: "middenkap",
    // Jan Garvelink, 1997, tussen de twee historische kappen.
    from: 55,
    profile: [
      13.25, 14.40, 15.35, 16.35, 17.20, 18.60, 18.95, 19.25, 19.40, 19.45,
      19.45, 19.35, 19.20, 18.90, 18.50, 17.15, 16.10, 15.50, 14.15, 13.25,
    ],
    u: [-262.75, 95.25],
  },
  {
    label: "tweede kap",
    // Werkspoor, 1922-1924, met dezelfde lichtstraat als de eerste kap.
    from: 74,
    profile: [
      13.25, 16.00, 18.30, 20.25, 21.20, 22.05, 22.80, 23.45, 24.00, 24.50,
      24.90, 25.25, 25.55, 27.20, 27.60, 28.05, 28.45, 28.80, 29.10, 28.70,
      28.40, 27.95, 27.60, 26.95, 25.50, 25.20, 24.80, 24.40, 23.85, 23.30,
      22.65, 21.85, 20.90, 20.25, 18.30, 16.10, 11.70, 11.20, 10.90,
    ],
    u: [-261.25, 93.75],
    screen: 12.5,
  },
  {
    label: "busstationkap",
    // Benthem Crouwel, 2014: glazen boog boven het busstation aan het IJ.
    from: 112,
    profile: [
      10.90, 12.10, 13.05, 13.80, 14.60, 15.20, 15.85, 16.50, 17.10, 17.65,
      18.20, 18.75, 18.95, 19.55, 20.00, 20.25, 20.75, 21.10, 21.35, 21.65,
      21.90, 22.05, 22.25, 22.40, 22.60, 22.70, 22.75, 22.80, 22.85, 22.85,
      22.80, 22.80, 22.70, 22.60, 22.45, 22.30, 22.10, 21.90, 21.65, 21.35,
      21.10, 20.75, 20.30, 20.00, 19.55, 19.00, 18.55, 17.90, 17.45, 16.65,
      15.80, 15.15, 14.40, 13.70,
    ],
    // Noordrand boven de kade aan de IJ-zijde.
    end: [165.5, 13.7],
    u: [-260.25, 100.5],
  },
];
const HALL_SHELL = 1.2;
const HALL_SCREEN = 0.9;
const HALL_SCREEN_RECESS = 1.0;
const COLUMN = 1.0;
const COLUMN_PITCH = 12.0;
// Waar de kolommen in de goten op staan: perron of busplatform; de noordrand
// van de busstationkap staat op de kade.
const columnFoot = (v) => (v > BUS_DECK.v1 ? 0.5 : v > DECK_NORTH ? BUS : PLATFORM);

function hallTop({ from, profile, start, end }) {
  const top = profile.map((z, i) => [from + i, z]);
  if (start) top.unshift(start);
  if (end) top.push(end);
  return top;
}

function hallSolid(hall) {
  const top = hallTop(hall);
  const [u0, u1] = hall.u;
  const [vs, zs] = top[0];
  const [ve, ze] = top[top.length - 1];
  // Gebied onder de boog tot 2 m onder de koorde; de schaal is dat gebied min
  // de binnenrand op 1,2 m en min alles onder 0,75 m onder de uiteinden, zodat
  // de schaal in de goten ophoudt en de buurkap daar aansluit.
  const area = section([
    ...top.map(([v, z]) => [v, nap(z)]),
    [ve, nap(ze) - 2.0],
    [vs, nap(zs) - 2.0],
  ]);
  const below = section([
    [vs - 1, nap(zs) - 0.75],
    [ve + 1, nap(ze) - 0.75],
    [ve + 1, BOTTOM - 10],
    [vs - 1, BOTTOM - 10],
  ]);
  const shell = area.subtract(area.offset(-HALL_SHELL, "Miter", 2)).subtract(below);
  const parts = [prismU(shell, u0, u1)];
  if (hall.screen) {
    const screen = area.intersect(section([
      [vs - 1, nap(hall.screen)],
      [ve + 1, nap(hall.screen)],
      [ve + 1, nap(40)],
      [vs - 1, nap(40)],
    ]));
    parts.push(
      prismU(screen, u0 + HALL_SCREEN_RECESS, u0 + HALL_SCREEN_RECESS + HALL_SCREEN),
      prismU(screen, u1 - HALL_SCREEN_RECESS - HALL_SCREEN, u1 - HALL_SCREEN_RECESS),
    );
  }
  // Kolommen in de goot aan de noordkant; de zuidkant rust op de goot van de
  // vorige kap of, bij de eerste kap, op de achtergevel van het stationsgebouw.
  const n = Math.floor((u1 - u0 - 4) / COLUMN_PITCH);
  const first = (u0 + u1) / 2 - (n * COLUMN_PITCH) / 2;
  const vc = ve - COLUMN / 2;
  for (let k = 0; k <= n; k++) {
    const u = first + k * COLUMN_PITCH;
    const foot = Math.max(columnFoot(ve) - 0.3, 0.5);
    parts.push(block(u - COLUMN / 2, u + COLUMN / 2, vc - COLUMN / 2, vc + COLUMN / 2, ze - 0.4, foot));
  }
  return union(parts);
}

// ---------- van meetstelsel naar model ----------
const toModel = (solid) => solid.translate([-MODEL_ORIGIN_UV[0], -MODEL_ORIGIN_UV[1], 0]);
// Kolommen staan 0,3 m in het plateau; het plateau en het busplatform gaan
// voor, zodat de onderdelen elkaar niet overlappen.
const ground = union([railViaduct, trackBed, platforms, busStructure, busLanes, busPlatforms]);
const hallParts = HALLS.map((hall) => [hall.label, hallSolid(hall).subtract(ground)]);
const BGT_SPOOR = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "half verhard" };
const BGT_PERRON = { bgt_type: "perron" };
const BGT_OV_BAAN = { bgt_functie: "OV-baan", bgt_fysiekvoorkomen: "gesloten verharding" };
const BGT_VOETPAD = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "open verharding" };
const parts = [
  ["building:stationsgebouw", toModel(stationBuilding.subtract(ground))],
  ...hallParts.map(([label, solid]) => [`building:${label}`, toModel(solid)]),
  ["building:spoorplateau", toModel(railViaduct)],
  ["road:spoor", toModel(trackBed), BGT_SPOOR],
  ["separation:perrons", toModel(platforms), BGT_PERRON],
  ["building:IJ-hal en busplatform", toModel(busStructure)],
  ["road:busbanen", toModel(busLanes), BGT_OV_BAAN],
  ["road:busperrons", toModel(busPlatforms), BGT_VOETPAD],
];
const printModel = union(parts.map(([, solid]) => solid));

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
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, (v[i + 2] - BOTTOM) * mmPerMetre];
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
  const nodes = [];
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
  for (const [name, solid, attributes] of namedParts) {
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
    nodes.push(attributes ? { name, mesh: meshes.length - 1, extras: { attributes } } : { name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  if (solid.isEmpty()) throw new Error(`${name}: leeg`);
  const bb = solid.boundingBox();
  if (bb.min[2] < BOTTOM - 1e-6) throw new Error(`${name}: onder de onderkant op ${bb.min[2]}`);
  report[name] = {
    genus: solid.genus(),
    parts: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "amsterdam-centraal.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-amsterdam-centraal.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `amsterdam-centraal-1-${scale}.stl`);
const { buffer, triangles } = toStl(
  printModel,
  `NederPrint Amsterdam Centraal 1:${scale} mm Z-up -Y=Stationsplein`,
);
await writeFile(stlFile, buffer);
const bb = printModel.boundingBox();
report.stl = {
  file: stlFile,
  status: printModel.status(),
  genus: printModel.genus(),
  triangles,
  volumeCm3: +((printModel.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. RD-oorsprong en -as volgen
// uit het meetstelsel. Het maaiveld wordt op het Stationsplein bemonsterd: rond
// de hele voetafdruk zou de lader het IJ of de lagere IJ-zijde (NAP +0,8 m)
// kunnen raken. De vervangen panden dekken samen stationsgebouw, kappen,
// IJ-hal en de tunnels eronder; de PDOK-reconstructie van het stationspand is
// een LoD1.1-blok (rf_extrusion_mode lod11_fallback) zonder kappen. Het
// busplatform vervangt het BGT-overbruggingsdeel dat PDOK plat op de kade legt.
const angle = (AXIS_DEGREES * Math.PI) / 180;
const xAxis = [Math.cos(angle), Math.sin(angle)];
const yAxis = [-xAxis[1], xAxis[0]];
const [ou, ov] = MODEL_ORIGIN_UV;
const origin = [0, 1].map(
  (i) => +(SURVEY_ORIGIN_RD[i] + ou * xAxis[i] + ov * yAxis[i]).toFixed(2),
);
const groundSamplePoints = [
  [-100, -28],
  [-48.4, -28],
  [0, -28],
  [60, -16],
  [100, -16],
].map(([u, v]) => [+(u - ou).toFixed(1), +(v - ov).toFixed(1)]);
await writeFile(
  path.join(outDir, "amsterdam-centraal.json"),
  JSON.stringify(
    {
      name: "Amsterdam Centraal",
      file: "amsterdam-centraal.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin,
      xAxis: xAxis.map((c) => +c.toFixed(5)),
      groundOffsetMetres: -0.3,
      groundSamplePoints,
      replacesBuildings: [
        "0363100012185598",
        "0363100012185599",
        "0363100012240304",
        "0363100012240311",
        "0363100012242112",
        "0363100012245758",
        "0363100012245759",
        "0363100012246251",
      ].map((id) => `NL.IMBAG.Pand.${id}`),
      replacesTerrain: ["G0363.9806c03a419f49e0b9858c9773357e70"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden van de voorgevel van de middenpartij (tussen de torens) in de oorsprong, +X langs de sporen naar het oosten (RD-azimut 121 graden) en +Y naar het IJ; de voorgevel aan het Stationsplein ligt richting -Y. Het maaiveld wordt op het Stationsplein bemonsterd. De vier perronkappen zijn open schalen op kolommen boven een eigen spoorplateau met perrons en het busplatform boven de IJ-hal. Vervangt de PDOK-reconstructie van het stationspand (een LoD1.1-blok), de IJ-hal en de tunnels, en het plat gelegde busplatform. Nodenamen klasse:label bepalen de materiaalklasse; spoor, perrons en busplatform dragen BGT-attributen.",
      printFiles: [`amsterdam-centraal-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(1),
        depthM: +(bb.max[1] - bb.min[1]).toFixed(1),
        stationBuildingLengthM: 373.4,
        wingEavesNapM: WING_EAVE,
        wingRidgeNapM: 26.0,
        centralRidgeNapM: CENTRAL.ridge,
        towerShaftM: TOWER_HALF.map((h) => 2 * h),
        towerTopsNapM: TOWERS.map((tower) => tower.top),
        trackNapM: TRACK,
        platformNapM: PLATFORM,
        busPlatformNapM: BUS,
        halls: HALLS.map((hall) => {
          const top = hallTop(hall);
          return {
            label: hall.label,
            spanM: +(top[top.length - 1][0] - top[0][0]).toFixed(1),
            lengthM: +(hall.u[1] - hall.u[0]).toFixed(1),
            topNapM: Math.max(...hall.profile),
            ...(hall.screen ? { screenBottomNapM: hall.screen } : {}),
          };
        }),
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Station_Amsterdam_Centraal",
        "https://en.wikipedia.org/wiki/Amsterdam_Centraal_station",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/5681",
        "PDOK BAG panden en BGT pand 0363100012185598 (contour stationsgebouw), EPSG:28992",
        "PDOK BGT perrons, overkappingen, wegdelen (OV-baan, voetpad) en overbruggingsdeel G0363.9806c03a419f49e0b9858c9773357e70 (busplatform)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor alle hoogtes, de omhullende van torens en paviljoens, de boogprofielen van de vier kappen, spoor en perrons",
        "PDOK luchtfoto Actueel_orthoHR (dakkapellen, topgevels, glasdak oostvleugel)",
        "https://commons.wikimedia.org/wiki/File:Amsterdam_Centraal_2024_01.jpg",
        "https://commons.wikimedia.org/wiki/File:Amsterdam_Centraal_station_2023.jpg",
        "https://commons.wikimedia.org/wiki/File:Aerial_photograph_of_Amsterdam_Central_Station_and_the_surrounding_area.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
