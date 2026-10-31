// Skydome (KNSM-laan 327–525, KNSM-eiland, Amsterdam, 1994–1996, Wiel Arets): woontoren van 22 lagen
// op de verhoogde parkeerdek van een half verdiepte garage, het hoge punt van het Oostelijk Havengebied.
// Vier verticale volumes van gelijke hoogte, op de west-, zuid- en oostgevel gescheiden door diepe
// sleuven met kubusvormige balkons van staalgaas; de noordgevel heeft geen sleuven en knikt in het
// midden (afgerond). Gevels van antracietgrijze betonpanelen met per laag loggia's en raambanden.
// Contour uit de BAG, hoogtes uit de 3D BAG (AHN5 2023) en het AHN-DSM, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "skydome-amsterdam";
// Gebouwstelsel: u langs de zuidgevels naar het oosten (2,6° op RD-oost, BAG-randen 2,4–2,9°), v haaks
// erop naar het noorden. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [124655.0, 487818.0];
const ANGLE = 2.6;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 1.7; // NAP, straat KNSM-laan en kade (AHN-DTM 1,6–1,8; 3D BAG maaiveld 1,81)
const DECK = 3.3; // NAP, parkeerdek waarop de toren staat (AHN-DTM 3,2–3,4)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 63.78; // dak, 3D BAG 70e percentiel (AHN-DSM p70 63,80)
const PLANT = 65.27; // liftopbouw (3D BAG dakvlak 65,25; DSM 65,27)
const HOOD = 65.9; // ventilatiekappen (DSM 65,9–66,0)

// ---------- Plattegrond in (u, v), BAG-contour linksom, knikjes < 0,9 m weg ----------
// Sleuven: west (v 1,77–3,20), zuidwest (u -4,65…-3,08, 5 m diep), zuidoost (u 6,85…8,27) en oost
// (v 1,81–3,24). De noordgevel knikt bij u ≈ 1,4 met een afronding van zes stukjes.
const FOOTPRINT = [
  [-21.08, 7.04], [-18.8, 3.2], [-15.74, 3.2], [-15.74, 1.77], [-17.53, 1.77], [-17.53, -6.45],
  [-4.65, -6.47], [-4.65, -1.51], [-3.08, -1.51], [-3.1, -12.3], [6.85, -12.3], [6.85, -8.48],
  [8.27, -8.48], [8.27, -10.25], [16.13, -10.25], [16.13, 1.81], [14.31, 1.81], [14.31, 3.24],
  [17.31, 3.27], [18.68, 8.27], [3.35, 11.48], [2.72, 11.59], [2.07, 11.65], [1.42, 11.68],
  [0.75, 11.65], [0.09, 11.58], [-0.58, 11.47],
];
const PLANT_POLY = rect(1.3, -1.6, 6.8, 2.0); // liftopbouw (DSM 1,2–6,8 × -1,6–2,1)
const HOODS = [rect(5.9, 3.5, 7.0, 5.0), rect(-8.1, 3.6, -7.0, 5.1), rect(9.7, -0.8, 11.3, 0.3), rect(-7.0, -1.5, -6.1, 0.1), rect(5.6, -5.1, 6.6, -3.5)];

// ---------- Lagen ----------
// Begane grond (entree, glas) 3,3 m op het dek, eerste verdieping zonder ramen (bergingen), dan 21 lagen
// van 2,7 m tot onder de dakrand; 22 bouwlagen volgens Wikipedia.
const GF = [z(DECK), 3.3];
const STOREY = 2.7;
const FLOORS = Array.from({ length: 21 }, (_, k) => [z(DECK) + 3.3 + STOREY * k, STOREY]);
const WINDOWED = FLOORS.slice(1); // eerste verdieping zonder ramen

const body = union([
  prism(FOOTPRINT, BASE, z(ROOF)),
  prism(PLANT_POLY, z(ROOF) - 0.1, z(PLANT)),
  ...HOODS.map((h) => prism(h, z(ROOF) - 0.1, z(HOOD))),
]);

// ---------- Gevelreliëf ----------
// Nis langs de rand a→b (buitennormaal rechts van de looprichting) van s0 tot s1, van lo tot hi, met een
// plafond onder 45° (hoog aan de gevel, laag achterin), alleen waar de gevel buitengevel is.
const cuts = [];
const frame = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h] };
};
function exposed(P, s, h) {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
}
function niche(a, b, s0, s1, lo, hi, depth) {
  const { P } = frame(a, b);
  if (s1 - s0 < 0.9 || hi - lo < 0.9) return;
  if (![s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi - 0.05].every((h) => exposed(P, s, h)))) return;
  const top = hi - depth;
  cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + 0.2), P(s1, -0.2, hi + 0.2), P(s0, depth, top), P(s1, depth, top)]));
}
const LOGGIA = 0.6, WINDOW = 0.35;
// Per laag een loggia: borstwering 1,0 m, opening tot 0,3 m onder de volgende vloer.
const loggias = (a, b, s0, s1) => WINDOWED.forEach(([zf, fh]) => niche(a, b, s0, s1, zf + 1.0, zf + fh - 0.3, LOGGIA));
// Per laag een raamband of raam: borstwering 0,9 m, latei 0,35 m.
const windows = (a, b, s0, s1) => WINDOWED.forEach(([zf, fh]) => niche(a, b, s0, s1, zf + 0.9, zf + fh - 0.35, WINDOW));
const F = (i) => FOOTPRINT[i], E = (i) => [F(i), F((i + 1) % FOOTPRINT.length)];
const len = (i) => frame(...E(i)).L;

// Westkop van het noordvolume (4,5 m): loggia's over de hele breedte (foto vanaf de westkade).
loggias(...E(0), 0.9, len(0) - 0.9);
// Westgevel van het westvolume (8,2 m): een kolom kleine vensters naast de sleuf.
windows(...E(4), 0.9, 1.9);
// Zuidgevel van het westvolume (12,9 m): raamband op de westhelft, loggia op de oosthelft.
windows(...E(5), 0.9, 5.6);
loggias(...E(5), 6.5, len(5) - 0.9);
// Westgevel van het zuidvolume, deel buiten de sleuf (5,8 m): loggia's.
loggias(...E(8), 4.96 + 0.9, len(8) - 0.9);
// Zuidgevel van het zuidvolume (10 m): loggia op de westhelft, raamband op de oosthelft.
loggias(...E(9), 0.9, 4.9);
windows(...E(9), 5.8, len(9) - 0.9);
// Zuidgevel van het oostvolume (7,9 m): loggia's over de hele breedte.
loggias(...E(13), 0.9, len(13) - 0.9);
// Oostgevel van het oostvolume (12,1 m): een kolom raambanden van 2,6 m naast de sleuf.
windows(...E(14), len(14) - 3.5, len(14) - 0.9);
// Oostkop van het noordvolume (5,2 m): loggia's over de hele breedte.
loggias(...E(18), 0.9, len(18) - 0.9);
// Noordgevel, twee vlakken met de knik ertussen: raambanden per laag.
windows(...E(19), 0.9, len(19) - 0.9);
windows(...E(26), 0.9, len(26) - 0.9);
// Begane grond: glazen pui rondom, 0,5 m terug, op alle buitengevels van minstens 3 m.
FOOTPRINT.forEach((_, i) => {
  if (len(i) >= 3) niche(...E(i), 0.9, len(i) - 0.9, GF[0], GF[0] + GF[1] - 0.3, 0.5);
});

// ---------- Balkons in de sleuven ----------
// Kubusbalkons van staalgaas, per laag (vanaf de tweede woonlaag) één blok over de hele sleufbreedte in
// de monding, 1,2 m diep, tot 1,7 m boven de vloer, met een onderkant als spitsboog onder 45° tussen
// de sleufwanden.
// [monding a, monding b (buitennormaal rechts), diepte van de sleuf]
const SLOTS = [
  [[-17.53, 3.2], [-17.53, 1.77], 1.79], // west
  [[-4.65, -6.47], [-3.08, -6.47], 4.96], // zuidwest
  [[6.85, -10.25], [8.27, -10.25], 1.77], // zuidoost
  [[16.13, 1.81], [16.13, 3.24], 1.82], // oost
];
const balconies = [];
for (const [a, b, depthSlot] of SLOTS) {
  const { L: w, P } = frame(a, b);
  const deep = Math.min(1.2, depthSlot);
  for (const [zf] of WINDOWED) {
    const lo = zf + 0.2, apex = lo + w / 2, top = zf + 1.7;
    balconies.push(Manifold.hull([0, deep].flatMap((t) => [P(-0.05, t, lo), P(w + 0.05, t, lo), P(w / 2, t, apex), P(-0.05, t, top), P(w + 0.05, t, top)])));
  }
}

const building = union([body.subtract(union(cuts)), ...balconies]);
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Skydome: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Skydome", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length, "balkons", balconies.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:skydome-amsterdam", building]],
  catalog: {
    name: "Skydome",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.7, // NAP 1,7 + 42,98 (NLGEO2018 42,96, geijkt op Havengebouw en Bercylaan)
    groundOffsetMetres: -0.2,
    groundSamplePoints: [[-15, -24], [0, -24], [15, -24], [-10, 17], [5, 17], [15, 17]],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012126867"],
    description:
      "Skydome aan de KNSM-laan op het KNSM-eiland (Wiel Arets, 1996): woontoren van vier volumes op de BAG-contour tot NAP +63,78 m (3D BAG, 70e percentiel) met een liftopbouw tot +65,27 m en vijf ventilatiekappen, vier diepe sleuven in de west-, zuid- en oostgevel met per laag een kubusbalkon in de monding, per laag loggia's en raambanden als blinde nissen, een glazen pui op het parkeerdek (+3,3 m) en de geknikte noordgevel met raambanden. Oorsprong in het hart van de BAG-contour, X-as langs de zuidgevels (2,6° op RD-oost). Verdiepingshoogte, de verdeling van loggia's en raambanden per gevel en de balkons zijn geschat uit foto's; het parkeerdek eromheen is geen BAG-pand en zit niet in het model.",
    realWorld: {
      groundNapM: GROUND,
      deckNapM: DECK,
      roofNapM: ROOF,
      plantNapM: PLANT,
      hoodNapM: HOOD,
      floors: 22,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012126867 (bouwjaar 1995), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG (LoD2.2, AHN5 2023)",
      "https://nl.wikipedia.org/wiki/Skydome_(Amsterdam)",
      "https://commons.wikimedia.org/wiki/File:2023_Amsterdam,_KNSM-eiland,_Skydome_(03).jpg",
      "https://commons.wikimedia.org/wiki/File:2023_Amsterdam,_KNSM-eiland,_Skydome_(10).jpg",
      "https://commons.wikimedia.org/wiki/File:2023_Amsterdam,_KNSM-eiland,_Skydome_(13).jpg",
      "https://commons.wikimedia.org/wiki/File:Skydome_(1).jpg",
    ],
  },
});
