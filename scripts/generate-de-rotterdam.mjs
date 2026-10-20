// De Rotterdam (Wilhelminapier, Rotterdam, 2009–2013; OMA): de "verticale stad" van drie torens op een
// gezamenlijke plint. Elke toren bestaat uit een onderblok en een bovenblok die op circa NAP +87 tot +89 m
// ten opzichte van elkaar verspringen:
// - Westtoren (wonen): het bovenblok kraagt 7,25 m uit aan de kopse kant richting Hotel New York en laat
//   aan de binnenkant een richel van 6,85 m op het onderblok;
// - Middentoren (kantoren): een kolom van plint tot dak aan de westkant (springt 8 m naar de straat uit),
//   een onderblok dat 8 m verder naar het oosten loopt dan het bovenblok, en een bovenblok dat aan de
//   Maaszijde 10,8 m over een nis in het onderblok kraagt;
// - Oosttoren (hotel en kantoren): het onderblok steekt 7,4 m naar de straat uit; het bovenblok ligt over
//   de sleuf van 3,3 m tussen de onderblokken van midden- en oosttoren heen, die van de plint tot de
//   verspringing door de hele diepte loopt.
// De plint heeft een colonnade op de begane grond, drie horizontale banden met glasstroken en drie lagen
// met lamellen; de torens hebben een raster van glasvakken per verdieping en een dichte dakrand met
// installatieblokken erachter.
//
// Bronnen en maten: BAG-pand 0599100100002429 (rechthoek 107,1 × 49,6 m, gevelrichting 39,1° op RD-oost);
// de bovenkanten (dakvlakken, richels en dakopbouwen) uit de 3D BAG LoD2.2 en het AHN-DSM 0,5 m; wat het
// AHN niet ziet (de onderblokken onder de bovenblokken, de sleuf, de nis aan de Maaszijde, verdiepingen
// en plintgevel) uit frontale foto's op Wikimedia Commons, geschaald op de gevellengte van 107,1 m en de
// dakhoogte. Het DSM heeft langs de naar het zuidoosten en zuidwesten gerichte glasgevels een strook van
// 4 tot 8 m met spiegelpunten op alle hoogtes; daar volgen de gevels de 3D BAG en de BAG.
import { CrossSection, Manifold, ccw, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "de-rotterdam";
// Gebouwstelsel: x langs de lange gevel naar het noordoosten (39,1° op RD-oost, BAG-contour), y naar het
// noordwesten (de Nieuwe Maas); oorsprong in het midden van het BAG-pand. Westtoren aan de -x-kant.
const ORIGIN = [93136.02, 435733.86];
const ANGLE = 39.1;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 3.3; // NAP; 3D BAG b3_h_maaiveld 3,26, AHN-DTM op straat en kade 3,3–3,5
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (sec, z0, z1) => Manifold.extrude(sec, z1 - z0).translate([0, 0, z0]);

// ---------- Hoogtes (NAP) ----------
const ROOF = 148.4; // dakvlakken van de drie bovenblokken (3D BAG 148,38–148,45)
const PARAPET = 150.55; // dichte dakrand, 1,0 m breed (3D BAG-randen 150,56–150,59, DSM 150–151)
const W_SHIFT = 87.26; // dak van het westelijke onderblok = onderkant bovenblok (3D BAG 87,25–87,27)
const M_SHIFT = 89.4; // dak van het middelste onderblok (3D BAG 89,40–89,45, DSM 89)
const E_SHIFT = 86.9; // dak van het oostelijke onderblok (3D BAG 86,86–86,94, DSM 87)
const PLINTH_TOP = 31.45; // dakterras van de plint (3D BAG 31,38–31,49)
const PLINTH_RIM = 32.5; // lamellen boven het dakterras (foto van de Maaszijde: +32,6)
const BANDS_BOTTOM = 12.1; // onderkant van de bandenzone, bovenkant van de colonnade (foto: +12,1)
const BANDS_TOP = 21.2; // bovenkant van de bandenzone (foto: +21,1 tot +21,2)
const BAND_STOREY = 3.0; // drie banden: plaat 1,0 m en glasstrook 2,0 m (foto)
// De colonnade en de banden steken 1,0 m buiten de BAG-rand uit; de lamellenzone en de torens die tot
// de rand lopen liggen op de BAG-rand (foto van de Maaszijde; DSM +18 tot +28 m in de strook 0,5–1 m
// buiten de rand).
const BAND_PROJECTION = 1.0;

// ---------- Plattegrond (x, y in m) ----------
// BAG-rechthoek: x -53,55 tot 53,55, y -24,8 tot 24,8.
const HX = 53.55, HY = 24.8;
// Torens. Bovenblokken en richels uit de 3D BAG en het DSM (randen ±0,3 m); onderblokken onder de
// bovenblokken uit de frontale foto van de Maaszijde (8,13 px/m): westelijk onderblok tot x -46,3, sleuf
// x 21,6–24,9, nis onder het middelste bovenblok x -4,4 tot 2,5.
const W_LOWER_X = -46.3;
const W_LOWER = rect(W_LOWER_X, -12.9, -20.95, 21.8);
const W_UPPER = rect(-HX, -12.9, -27.8, 21.8);
// Middentoren: westkolom van plint tot dak (straatgevel y -21,7 uit de 3D BAG, Maasgevel y 14,0 uit de
// inkeping in het DSM, die tot op de plint loopt), onderblok tot de sleuf met de nis aan de Maaszijde,
// bovenblok tot x 13,6 (DSM-rand) tot de Maasgevel van de plint.
const M_COLUMN = rect(-21.0, -21.7, -4.4, 14.0);
const NICHE_X = 2.5;
const M_LOWER = [[-4.45, -13.6], [21.6, -13.6], [21.6, HY], [NICHE_X, HY], [NICHE_X, 14.0], [-4.45, 14.0]];
const M_UPPER = rect(-4.45, -13.6, 13.6, HY);
// Oosttoren: onderblok vanaf de sleuf met de uitsprong naar de straat (3D BAG-richel x 27,6–53,2,
// y -21 tot -13,6); bovenblok vanaf x 19,5 (DSM en 3D BAG) over de sleuf.
const SLOT = [21.6, 24.9];
const E_LOWER = [[SLOT[1], -13.6], [27.6, -13.6], [27.6, -21.0], [HX, -21.0], [HX, 22.2], [SLOT[1], 22.2]];
const E_UPPER = rect(19.5, -13.6, HX, 22.2);

// Verdiepingen per blok uit de periode van het gevelraster op de foto van de Maaszijde: wonen en hotel
// 3,0 m, kantoren 3,4 m.
const BLOCKS = [
  { name: "westtoren onderblok", poly: W_LOWER, from: PLINTH_TOP, to: W_SHIFT, floors: 19 },
  { name: "westtoren bovenblok", poly: W_UPPER, from: W_SHIFT, to: ROOF, floors: 20 },
  { name: "middentoren kolom", poly: M_COLUMN, from: PLINTH_TOP, to: ROOF, levels: [[PLINTH_TOP, M_SHIFT, 17], [M_SHIFT, ROOF, 17]] },
  { name: "middentoren onderblok", poly: M_LOWER, from: PLINTH_TOP, to: M_SHIFT, floors: 17 },
  { name: "middentoren bovenblok", poly: M_UPPER, from: M_SHIFT, to: ROOF, floors: 17 },
  { name: "oosttoren onderblok", poly: E_LOWER, from: PLINTH_TOP, to: E_SHIFT, floors: 19 },
  { name: "oosttoren bovenblok", poly: E_UPPER, from: E_SHIFT, to: ROOF, floors: 18 },
];
// Dakopbouwen (3D BAG-vlakken en DSM): west een kader met schermen tot +154,6 rond installaties tot
// +151,6; midden een dicht blok tot +154,8; oost een blok tot +154,8 met een schermkader tot +153,0.
const ROOF_FRAMES = [
  { poly: rect(-46.6, -5.5, -32.0, 8.6), inner: 151.6, rim: 154.6 },
  { poly: rect(28.0, -6.6, 45.0, 7.2), inner: null, rim: 153.0 },
];
const ROOF_BOXES = [
  { poly: rect(-12.5, -6.4, 0.6, 6.8), top: 154.8 },
  { poly: rect(35.0, -6.6, 45.0, 7.2), top: 154.8 },
];
// Opbouw op het plintdak aan de straatzijde voor de sleuf (3D BAG 32,33–32,44).
const PLINTH_BOXES = [{ poly: rect(21.0, -17.5, 28.0, -13.6), top: 32.4 }];

// ---------- Massa ----------
const plinthCs = cs(rect(-HX, -HY, HX, HY));
const BAND_RECT = rect(-HX - BAND_PROJECTION, -HY - BAND_PROJECTION, HX + BAND_PROJECTION, HY + BAND_PROJECTION);
// De torens beginnen op de bandenzone, zodat een torengevel die gelijk ligt met de BAG-rand (het
// middelste onderblok en bovenblok aan de Maaszijde, de kopse kant van de oosttoren) doorloopt tot daar.
const towerSolids = BLOCKS.map((b) => (b.from === PLINTH_TOP ? prismCs(cs(b.poly), z(BANDS_TOP) - 0.1, z(b.to)) : prismCs(cs(b.poly), z(b.from), z(b.to))));
const tops = [cs(W_UPPER), cs(M_COLUMN).add(cs(M_UPPER)), cs(E_UPPER)];
const ring = (sec, w) => sec.subtract(sec.offset(-w, "Miter"));
const body = union([
  prism(BAND_RECT, BASE, z(BANDS_TOP)),
  prismCs(plinthCs, z(BANDS_TOP) - 0.1, z(PLINTH_TOP)),
  prismCs(ring(plinthCs, 1.0), z(PLINTH_TOP) - 0.1, z(PLINTH_RIM)),
  ...PLINTH_BOXES.map((b) => prism(b.poly, z(PLINTH_TOP) - 0.1, z(b.top))),
  ...towerSolids,
  ...tops.map((t) => prismCs(ring(t, 1.0), z(ROOF) - 0.1, z(PARAPET))),
  ...ROOF_FRAMES.flatMap((f) => [
    prismCs(ring(cs(f.poly), 1.0), z(ROOF) - 0.1, z(f.rim)),
    f.inner && prism(f.poly, z(ROOF) - 0.1, z(f.inner)),
  ]),
  ...ROOF_BOXES.map((b) => prism(b.poly, z(ROOF) - 0.1, z(b.top))),
]);

// ---------- Gevelreliëf ----------
// Nissen per gevelzijde: n gelijke vakken met penanten (ook op de hoeken), per rij [onder, boven] een
// opening van de gegeven diepte met een kop onder 45°. Alleen waar de gevel vrij ligt met ≥ 1 m materiaal
// erachter (straal vanuit 3 m buiten de gevel, zoals in generate-marconitorens.mjs).
const DEPTH = 0.35, PIER = 0.9;
// `end`: breedte van de hoekpenanten (standaard die van de penanten).
function facadeNiches(mass, edges, rows, { pitch, pier = PIER, depth = DEPTH, bays, end = pier }) {
  const cuts = [];
  for (const [a, b] of edges) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]]; // n naar buiten (massa links van a→b)
    const P = (s, dep, h) => [a[0] + d[0] * s - n[0] * dep, a[1] + d[1] * s - n[1] * dep, h];
    const cnt = bays ?? Math.max(1, Math.round((L - 2 * end + pier) / pitch));
    const w = (L - 2 * end - pier * (cnt - 1)) / cnt;
    if (w < 0.9) continue;
    for (let k = 0; k < cnt; k++) {
      const s0 = end + k * (w + pier), s1 = s0 + w;
      // Lange vakken (doorlopende glasstroken) om de 3 m bemonsterd.
      const m = Math.max(2, Math.ceil(w / 3));
      const probes = Array.from({ length: m + 1 }, (_, i) => s0 + 0.1 + ((w - 0.2) * i) / m);
      for (const [lo, top] of rows) {
        const hi = top - depth;
        if (hi - lo < 0.9) continue;
        const free = [lo + 0.1, top - 0.1].every((h) => probes.every((s) => {
          const from = P(s, -3, h), hits = mass.rayCast(from, P(s, 3, h));
          const at = (j) => hits[j] && Math.hypot(hits[j].position[0] - from[0], hits[j].position[1] - from[1]);
          return at(0) > 2.95 && at(0) < 3.05 && !(at(1) < 3 + depth + 1);
        }));
        if (!free) continue;
        cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, top + 0.2), P(s1, -0.2, top + 0.2), P(s0, depth, hi), P(s1, depth, hi)]));
      }
    }
  }
  return cuts;
}
const edgesOf = (poly) => ccw(poly).map((p, i, r) => [p, r[(i + 1) % r.length]]);
// Verdiepingsrijen: glas van 0,5 m boven de vloer tot 0,5 m onder de volgende (band van 1,0 m).
const storeyRows = (from, to, n) => Array.from({ length: n }, (_, k) => {
  const h = (to - from) / n, f = z(from) + k * h;
  return [f + 0.5, f + h - 0.5];
});
const cuts = [];
// Torens: glasvakken van 2,7 m tussen stijlen van 0,9 m (het fijnere raster van lamellen om de 0,9 m is
// op 1:1000 niet te printen).
// Waar een toren tot de BAG-rand loopt, krijgt hij ook de lamellenrijen van de plint.
const finRows = storeyRows(BANDS_TOP, PLINTH_TOP, 3);
for (const b of BLOCKS) {
  const rows = b.levels ? b.levels.flatMap(([f, t, n]) => storeyRows(f, t, n)) : storeyRows(b.from, b.to, b.floors);
  cuts.push(...facadeNiches(body, edgesOf(b.poly), rows, { pitch: 3.6 }));
  if (b.from === PLINTH_TOP) cuts.push(...facadeNiches(body, edgesOf(b.poly), finRows, { pitch: 2.7 }));
}
// Plint: colonnade op de begane grond (glas 2,5 m achter de kolommen van 0,9 m om de circa 8 m, dus
// 1,5 m achter de BAG-rand; hoekkolommen van 3,0 m, zodat de colonnades om de hoek niet samenkomen), drie doorlopende glasstroken tussen de banden en drie lagen met lamellen.
const plinthEdges = edgesOf(BAND_RECT);
cuts.push(...facadeNiches(body, plinthEdges, [[0.2, z(BANDS_BOTTOM)]], { pitch: 8.9, depth: 2.5, end: 3.0 }));
const bandRows = [0, 1, 2].map((k) => [z(BANDS_BOTTOM) + k * BAND_STOREY + 1.0, z(BANDS_BOTTOM) + (k + 1) * BAND_STOREY]);
cuts.push(...facadeNiches(body, plinthEdges, bandRows, { bays: 1, depth: 0.4 }));
cuts.push(...facadeNiches(body, edgesOf(rect(-HX, -HY, HX, HY)), finRows, { pitch: 2.7 }));

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`De Rotterdam: ${parts.length} losse delen`);
console.log("De Rotterdam", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:de-rotterdam-drie-verspringende-torens-op-de-plint", building]],
  catalog: {
    name: "De Rotterdam",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.89, // laagste PDOK-terrein op de straat aan de zuidoostkant (ellipsoïdisch), NAP circa +3,2
    groundOffsetMetres: -0.15,
    // Op de rijbaan aan de straatzijde, 3,2 m voor de plint (PDOK 46,89–46,94); de kade aan de Maas ligt hoger.
    groundSamplePoints: [[-40, -28], [0, -28], [40, -28]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100100002429"],
    description:
      "De Rotterdam (OMA, 2013): plint over het hele BAG-pand van 107,1 × 49,6 m tot NAP +31,45 m (colonnade en drie banden met glasstroken die 1 m buiten de BAG-rand uitsteken, lamellenzone, dakrand +32,5) met drie torens tot +148,4 m (dakrand +150,55, dakopbouwen tot +154,8). Elke toren verspringt: westtoren op +87,26 m (bovenblok kraagt 7,25 m uit naar het zuidwesten, richel aan de binnenkant), middentoren op +89,4 m (kolom van plint tot dak aan de westkant, onderblok 8 m verder naar het oosten, bovenblok 10,8 m over een nis aan de Maaszijde), oosttoren op +86,9 m (onderblok 7,4 m naar de straat, bovenblok over de sleuf van 3,3 m tussen midden- en oosttoren). Gevels met glasvakken per verdieping (wonen en hotel 3,0 m, kantoren 3,4 m). Oorsprong in het midden van het BAG-pand, X-as langs de lange gevel naar het noordoosten (39,1° op RD-oost), +Y naar de Maas. Bovenkanten uit 3D BAG en AHN; onderblokken, sleuf, nis, verdiepingen en plintgevel uit foto's geschat.",
    realWorld: {
      lengthM: 2 * HX,
      widthM: 2 * HY,
      bandProjectionM: BAND_PROJECTION,
      groundNapM: GROUND,
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      roofStructuresNapM: [151.6, 153.0, 154.6, 154.8],
      shiftNapM: { west: W_SHIFT, mid: M_SHIFT, east: E_SHIFT },
      plinthNapM: PLINTH_TOP,
      plinthRimNapM: PLINTH_RIM,
      plinthBandsNapM: [BANDS_BOTTOM, BANDS_TOP],
      westOverhangM: +(W_LOWER_X + HX).toFixed(2),
      eastSlotM: SLOT,
      midNicheM: { x: [-4.45, NICHE_X], y: [14.0, HY] },
      storeyM: { west: 3.0, mid: 3.4, eastLower: 3.0, eastUpper: 3.4 },
      estimatedLowerBlocks: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100100002429 (bouwjaar 2013), AHN DSM/DTM 0,5 m (PDOK WCS)",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100002429",
      "https://nl.wikipedia.org/wiki/De_Rotterdam",
      "https://commons.wikimedia.org/wiki/File:De_Rotterdam,_September_2019_-_01.jpg",
      "https://commons.wikimedia.org/wiki/File:DeRotterdam.JPG",
      "https://commons.wikimedia.org/wiki/File:De_Rotterdam_south_side.jpg",
      "https://commons.wikimedia.org/wiki/File:Kantoorgebouw_De_Rotterdam_02.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_De_Rotterdam_(2).jpg",
    ],
  },
});
