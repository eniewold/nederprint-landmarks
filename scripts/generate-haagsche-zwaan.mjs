// De Haagsche Zwaan (Schenkkade 50, Beatrixkwartier, Den Haag, 2010, ZZDP Architecten): kantoortoren van
// 20 lagen die schuin over de verdiepte Utrechtsebaan hangt. De noordoostgevel helt naar buiten, zodat
// de bovenste laag ongeveer 12 m verder reikt dan de voet; de zuidwestgevel helt mee, minder sterk. Het
// noordoostelijke deel staat op schuine kolommen boven een open doorgang; een witte trekdiagonaal loopt
// op beide lange gevels van de bovenhoek naar de entree en daar als schuine plaat (de "hals" van de
// zwaan) naar het maaiveld, met de glazen entree eronder. Aan de zuidwestkant een laagbouw van drie
// lagen met parkeren en kantoortjes langs de rand.
// Contour uit de BAG, dakhoogtes uit de 3D BAG (AHN5) en het AHN-DSM, helling van de kopgevels,
// trekdiagonaal, kolommen en gevelraster uit foto's.
import { Manifold, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "haagsche-zwaan";
// Gebouwstelsel: u langs de lange gevels naar het noordoosten (35,45° op RD-oost; BAG-randen 35,39° en
// 35,48°), v haaks daarop naar het noordwesten. Oorsprong midden op het torendak.
const ORIGIN = [82845.0, 454910.0];
const ANGLE = 35.45;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
const GROUND = 0.7; // NAP, AHN-DTM langs de Schenkkade (0,6–0,9); de Utrechtsebaan ernaast ligt op -5,1
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 74.52; // torendak, 3D BAG LoD2.2 74,47–74,58 (70e percentiel 74,55), AHN-DSM 74–75
const ROOF_BOX = 76.43; // installatiekast midden op het dak, 3D BAG 76,42–76,45, DSM 76
const PIT = 73.4; // verdiepte installatieplaats met roosters in de zuidwesthoek van het dak, 3D BAG 73,3–73,6
const LOW = 12.1; // dak van de laagbouw, 3D BAG 12,09–12,14, DSM 12
const LOW_BOX = 13.6; // dakopbouw op de laagbouw, 3D BAG 13,57–13,63
const SOFFIT = 12.0; // onderkant van de toren boven de laagbouw en de open doorgang (foto's: gelijk met de plint)

// ---------- Plattegrond (BAG, vereenvoudigd) ----------
const SE = -9.95; // zuidoostgevel aan de Schenkkade, recht van u -36,7 tot 37,6
const nw = (u) => 10.0 + (37.6 - u) * 0.0589; // noordwestgevel, 3,4° uit de as (v 10,0 bij de kop, 14,4 bij de laagbouw)
const LOW_SW = -36.9; // zuidwestgevel van de laagbouw

// Kopgevels: u op de hoogte van de onderkant van de toren (SOFFIT) en per meter hoogte naar het noordoosten.
// Bovenaan: zuidwestgevel op u -16,0 (DSM en 3D BAG), noordoostgevel op de BAG-rand u 37,6, 1,5 m boven
// de rand van de verdiepte Utrechtsebaan (DTM -5 vanaf u 36). Helling uit foto's (Utrechtsebaan bij hagel,
// Schenkkade): kop 0,18, zuidwestgevel 0,12 m per m; de 3D BAG legt zijn schuine dakvlak van 9,5–11,8 m
// precies op de voet van de hellende zuidwestgevel (u -23 tot -15).
const SW_LEAN = 0.12, NE_LEAN = 0.18;
const SW_TOP = -16.0, NE_TOP = 37.6;
const H = z(ROOF) - z(SOFFIT);
const SW_FOOT = SW_TOP - SW_LEAN * H; // -23,5
const NE_FOOT = NE_TOP - NE_LEAN * H; // 26,35
const ENTRY = 12.2; // einde van de plint en voet van de trekdiagonaal; daarna de open doorgang
const PLATE_FOOT = -3.5; // waar de schuine witte plaat het maaiveld raakt (foto Schenkkade)

const trap = (u0, u1) => [[u0, SE], [u1, SE], [u1, nw(u1)], [u0, nw(u0)]];
const parts = []; // toren
const lowParts = []; // laagbouw

// Laagbouw (drie lagen, parkeren met kantoortjes langs de rand) en de plint onder de toren.
lowParts.push(prism(trap(LOW_SW, SW_FOOT), BASE, z(LOW)));
lowParts.push(prism([[-34.9, 12.4], [-34.5, 9.9], [-31.7, 9.7], [-30.9, 10.3], [-30.8, 12.4], [-33.4, 13.2]], z(LOW) - 0.1, z(LOW_BOX)));
parts.push(prism(trap(SW_FOOT, ENTRY), BASE, z(LOW)));

// Toren: zeszijdig blok waarvan beide kopgevels naar het noordoosten hellen; de lange gevels staan loodrecht.
const zs = z(SOFFIT), zt = z(ROOF);
parts.push(Manifold.hull([
  [SW_FOOT, SE, zs], [SW_FOOT, nw(SW_FOOT), zs], [NE_FOOT, SE, zs], [NE_FOOT, nw(NE_FOOT), zs],
  [SW_TOP, SE, zt], [SW_TOP, nw(SW_TOP), zt], [NE_TOP, SE, zt], [NE_TOP, nw(NE_TOP), zt],
]));
// Installatiekast (3D BAG-ring) en de verdiepte installatieplaats in de zuidwesthoek.
parts.push(prism([[4.2, -2.2], [4.3, 4.2], [-3.7, 4.9], [-3.8, -1.9]], zt - 0.1, z(ROOF_BOX)));
const pit = prism([[-14.4, -0.6], [-10.6, -0.6], [-10.2, 4.6], [-11.6, 7.2], [-14.4, 7.2]], z(PIT), zt + 1);

// Entreehal als omgekeerde V: de glazen hal onder de schuine plaat loopt door tot de schuine poten die
// van de voet van de diagonaal naar het maaiveld op u 22,0 gaan (het AHN-DTM heeft tot daar geen
// maaiveldpunten, daarna wel: open doorgang). Hier als wig over de hele breedte; de schuine kant is de
// rij poten.
const LEG_TOP = ENTRY + 0.6, LEG_FOOT = 22.0;
const legU = (h) => LEG_FOOT + ((LEG_TOP - LEG_FOOT) * h) / zs;
parts.push(Manifold.hull([[ENTRY - 0.1, BASE], [legU(BASE), BASE], [LEG_TOP, zs + 0.3], [ENTRY - 0.1, zs + 0.3]]
  .flatMap(([u, h]) => [[u, SE, h], [u, nw(u), h]])));
// Kolommen onder de open doorgang (1,0 m): een kolom op elke hoek en onder het midden van de kop een V
// van twee schuine poten.
const COL = 0.5;
const column = (top, bottom) => Manifold.hull([
  ...[[-COL, -COL], [COL, -COL], [COL, COL], [-COL, COL]].map(([du, dv]) => [top[0] + du, top[1] + dv, zs + 0.3]),
  ...[[-COL, -COL], [COL, -COL], [COL, COL], [-COL, COL]].map(([du, dv]) => [bottom[0] + du, bottom[1] + dv, BASE]),
]);
for (const v of [SE + 0.6, nw(NE_FOOT) - 0.6]) parts.push(column([NE_FOOT - 0.7, v], [NE_FOOT - 0.7, v]));
for (const dv of [-5.0, 5.0]) parts.push(column([NE_FOOT - 0.7, 0.0], [NE_FOOT - 0.7, dv]));

// Lange gevels: punt op de gevel bij u, diepte naar binnen (negatief = naar buiten), hoogte h.
const longFace = (side) => (u, depth, h) => (side === "se" ? [u, SE + depth, h] : [u, nw(u) - depth, h]);
// Trekdiagonaal: witte strook van 1,6 m (horizontaal gemeten) die 0,5 m uit de gevel steekt, van de voet
// boven de entree tot de bovenhoek boven de Utrechtsebaan.
const RIB = 0.5, RIB_W = 0.8;
const diagonals = [], plates = [], entrances = [];
for (const side of ["se", "nw"]) {
  const P = longFace(side);
  const a = [ENTRY + RIB_W, zs], b = [NE_TOP - RIB_W, zt - 0.01];
  diagonals.push(Manifold.hull([a, b].flatMap(([u, h]) => [P(u - RIB_W, -RIB, h), P(u + RIB_W, -RIB, h), P(u - RIB_W, 0.2, h), P(u + RIB_W, 0.2, h)])));
  // Schuine plaat van de entree naar het maaiveld (37°): bovenkant 0,8 m boven de lijn, onderkant met een
  // kraag onder 45° naar de gevel.
  const zl = (u) => ((u - PLATE_FOOT) / (ENTRY + RIB_W - PLATE_FOOT)) * zs;
  const ends = [PLATE_FOOT - 2, ENTRY + RIB_W];
  plates.push(Manifold.hull(ends.flatMap((u) => [P(u, -RIB, zl(u) + 0.8), P(u, 0.2, zl(u) + 0.8), P(u, -RIB, zl(u) - 0.8), P(u, 0.2, zl(u) - 1.5)]))
    .intersect(prism([[-40, -40], [40, -40], [40, 40], [-40, 40]], BASE, zs + 1)));
  // Glazen entree onder de plaat als nis van 0,4 m met een plafond onder de plaat.
  const top = (u) => zl(u) - 1.4;
  const u0 = PLATE_FOOT + (1.4 / zs) * (ENTRY + RIB_W - PLATE_FOOT), u1 = ENTRY - 1.0;
  entrances.push(Manifold.hull([P(u0, -0.2, 0), P(u1, -0.2, 0), P(u1, -0.2, top(u1)), P(u0 + 0.9, 0.4, 0), P(u1, 0.4, 0), P(u1, 0.4, top(u1) - 0.6)]));
}

const body = union([...parts, ...diagonals, ...plates]);

// ---------- Gevelraster ----------
// Glasgevel met stijlen op 1,8 m en per laag een borstwering: per laag en per travee een blinde nis van
// 0,9 m breed en 0,35 m diep met een plafond onder ruim 45°. 17 lagen van 3,68 m boven de plint (20
// bouwlagen in totaal). De plint en de laagbouw hebben grijze panelen met verticale voegen op hetzelfde
// raster: daar één hoge sleuf per travee van 1,0 m boven het maaiveld tot 1,2 m onder de dakrand.
const FLOORS = Array.from({ length: 17 }, (_, k) => zs + (H / 17) * k);
const FH = H / 17, DEPTH = 0.35, PITCH = 1.8, WIDTH = 0.9, CEIL = 1.3 * (DEPTH + 0.2);
const ROWS = FLOORS.map((zf) => [zf + 1.1, zf + FH - 0.35 - CEIL]);
const PLINTH_ROWS = [[1.0, z(LOW) - 1.2 - CEIL]];
const cuts = [...entrances, pit], lowCuts = [];
// P(s, depth, h) op een gevel; ray-test: de gevel ligt over de hele nis plus 0,85 m opzij op 3 m van een
// punt 3 m ervoor (niet achter een diagonaal, niet buiten de hellende kop).
function niches(P, s0s, rows = ROWS, solid = body, out = cuts) {
  for (const [lo, hi] of rows) {
    for (const s0 of s0s) {
      const s1 = s0 + WIDTH;
      const exposed = [s0 - 0.85, s0 + 0.1, s1 - 0.1, s1 + 0.85].every((s) => [lo + 0.05, hi + CEIL - 0.05].every((h) => {
        const from = P(s, -3, h), hit = solid.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) out.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + CEIL), P(s1, -0.2, hi + CEIL), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const grid = (from, to) => Array.from({ length: Math.floor((to - from) / PITCH) + 1 }, (_, k) => from + k * PITCH);
niches(longFace("se"), grid(-25.2, 38));
niches(longFace("nw"), grid(-25.2, 38));
// Kopgevels: s = v, de gevel schuift met de hoogte mee.
const endFace = (foot, lean, inward) => (v, depth, h) => [foot + lean * (h - zs) + inward * depth, v, h];
niches(endFace(SW_FOOT, SW_LEAN, 1), grid(-9.45, 13));
niches(endFace(NE_FOOT, NE_LEAN, -1), grid(-9.45, 11));
// Plint (tot de schuine plaat van de entree) en laagbouw: zuidoostgevel aan de Schenkkade, noordwestgevel
// van de plint en zuidwestgevel van de laagbouw; de noordwestgevel van de laagbouw is een gemene muur met
// pand 0518100000239895.
const lowSolid = union(lowParts);
const nTower = cuts.length;
niches(longFace("se"), grid(-25.2, PLATE_FOOT - 4.0), PLINTH_ROWS);
niches(longFace("nw"), grid(-25.2, PLATE_FOOT - 4.0), PLINTH_ROWS);
niches(longFace("se"), grid(-36.0, SW_FOOT - 1.0), PLINTH_ROWS, lowSolid, lowCuts);
niches(endFace(LOW_SW, 0, 1), grid(-9.0, 13.5), PLINTH_ROWS, lowSolid, lowCuts);

const tower = body.subtract(union(cuts));
const low = lowSolid.subtract(union(lowCuts));
const nodes = [
  ["building:haagsche-zwaan-toren", tower],
  ["building:haagsche-zwaan-laagbouw", low],
];
for (const [name, m] of nodes) {
  const n = m.decompose().length;
  if (n !== 1) throw new Error(`${name}: ${n} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "nissen", name.endsWith("toren") ? `${nTower - entrances.length - 1} + plint ${cuts.length - nTower}` : lowCuts.length);
}

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "De Haagsche Zwaan",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.22, // NAP 0,70 + 43,52 (PDOK-terrein bij de Groene Toren: NAP 0,49 = 44,009 ellipsoïdisch)
    groundOffsetMetres: -0.15,
    // De lader neemt anders het laagste punt rond de voetafdruk: de verdiepte Utrechtsebaan (NAP -5,1).
    groundSamplePoints: [[-30, -12.5], [0, -12.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100000250152"],
    description:
      "Kantoortoren De Haagsche Zwaan (Schenkkade 50, 2010, ZZDP Architecten) op de BAG-contour, een trapezium met een rechte zuidoostgevel aan de Schenkkade en een noordwestgevel 3,4° uit de as. De toren loopt van NAP +12,0 m (bovenkant plint) tot het dak op +74,52 m (3D BAG) en helt over de verdiepte Utrechtsebaan: de noordoostkop schuift 0,18 m per meter hoogte naar buiten tot de BAG-rand, 1,5 m boven de weg, de zuidwestgevel 0,12 m per meter. Op beide lange gevels een witte trekdiagonaal van de bovenhoek naar de entree die als schuine plaat naar het maaiveld loopt, met de glazen entree als nis eronder; de entreehal is een omgekeerde V tot u 22, daarachter een open doorgang onder de kop met kolommen van 1 m op de hoeken en een V onder het midden. Op het dak een installatiekast tot +76,43 m en een verdiepte installatieplaats; aan de zuidwestkant laagbouw tot +12,1 m met een dakopbouw. Gevelraster als blinde nissen per laag op stijlen van 1,8 m, op de plint en de laagbouw hoge sleuven op hetzelfde raster. Oorsprong midden op het torendak, X-as langs de lange gevels naar het noordoosten (35,45° op RD-oost). Geschat uit foto's: de helling van beide kopgevels, de hoogte van de plint en de onderkant van de toren, de lagen (17 boven de plint), de vorm van de entreehal, de kolommen, de diagonaal en het gevelraster.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      roofBoxNapM: ROOF_BOX,
      lowWingNapM: LOW,
      soffitNapM: SOFFIT,
      northEastLeanMPerM: NE_LEAN,
      southWestLeanMPerM: SW_LEAN,
      cantileverAboveSoffitM: +(NE_TOP - NE_FOOT).toFixed(2),
      floorsAbovePlinth: 17,
      storeyHeightM: +FH.toFixed(3),
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0518100000250152 (bouwjaar 2010), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000250152 (LoD2.2, puntwolk AHN5 2023)",
      "https://nl.wikipedia.org/wiki/De_Haagsche_Zwaan (73,5 m, 20 lagen, 12 m over de Utrechtsebaan)",
      "https://architectures.jidipi.com/j00033257/en/haagsche-zwaan (ZZDP: taps uitkragende vorm, trekdiagonalen op de lange gevels, entree als omgekeerde V)",
      "https://commons.wikimedia.org/wiki/Category:De_Haagsche_Zwaan (foto's vanaf de Schenkkade, de Utrechtsebaan en Bezuidenhout)",
    ],
  },
});
