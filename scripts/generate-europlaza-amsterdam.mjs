// Europlaza (Hoogoorddreef 56, Amsterdam-Zuidoost, 1991–1992, ZZ+P): kantoortoren aan het water naast
// station Bijlmer ArenA en AFAS Live. De plattegrond is een vierkant van circa 31 × 31 m dat diagonaal
// is gedeeld: de noordwestelijke driehoek is een hoge natuurstenen schijf (tot NAP +55,7 m) met aan de
// spitse zuidwestpunt twee kolommen ronde vensters, de zuidoostelijke helft een getrapt blok met
// lintvensters: negen lagen over de hele breedte, daarboven een loggialaag met kolommen en vijf lagen
// tot +48,2 m, en een teruggezette glazen opbouw tot +51,5 m. Tussen schijf en blok zit aan beide
// uiteinden een terugliggende naad van 2,4 m. Op de schijf twee stroken installaties.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023) en het AHN-DSM, gevelindeling uit
// één foto (zuidzijde) en de luchtfoto.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "europlaza-amsterdam";
// Gebouwstelsel: u langs de zuidgevel naar het oostzuidoosten (-16,1° op RD-oost, BAG-randen evenwijdig
// binnen 0,2°), v haaks erop naar het noordnoordoosten. De diagonaal tussen schijf en blok loopt in dit
// stelsel onder 45° (v = u + 1,49). Oorsprong midden in het vierkant.
const ORIGIN = [124915.0, 480455.0];
const ANGLE = -16.1;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = -1.9; // NAP, plein aan de oostkant (3D BAG -1,91, AHN-DTM -1,76…-1,91); west en noord water
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG-dakvlakken en AHN-DSM (mediaan) ----------
const SLAB = 55.68; // schijf (3D BAG 55,67, DSM 55,69)
const PLANT = 57.52; // twee installatiestroken op de schijf (3D BAG 57,5, DSM 57,5–57,6)
const PENT = 51.5; // glazen opbouw op het blok (3D BAG 51,5, DSM 51,5)
const UPPER = 48.17; // bovenste blok, rand rond de opbouw (3D BAG 48,15, DSM 48,18)
const LOWER = 28.39; // oostelijke strook van het onderste blok (3D BAG 28,4, DSM 28,39)
const BOX = 30.8; // dakopbouw op de oostelijke strook (DSM 30,7–30,9)

// ---------- Plattegrond in (u, v), BAG-contour en 3D BAG-dakvlakken ----------
const C = 1.49; // diagonaal: v = u + C
const SLAB_POLY = [[-18.89, -17.4], [11.95, 13.44], [-18.89, 13.44]];
// Blok: zuidgevel v = -11,89, oostgevel u = 20,85, noordoostgevel en de twee naden op v = u - 1,85;
// de punten op de diagonaal schuiven 0,3 m de schijf in zodat de delen overlappen.
const LOW_POLY = [[-10.04, -11.89], [20.85, -11.89], [20.85, 19.0], [10.61, 8.76], [8.73, 10.64], [-8.93, -7.02], [-7.05, -8.9]];
const U_UPPER = 13.55; // bovenste blok tot hier; oostelijk daarvan alleen het onderste blok
const UPPER_POLY = [[-10.04, -11.89], [U_UPPER, -11.89], [U_UPPER, U_UPPER - 1.85], [10.61, 8.76], [8.73, 10.64], [-8.93, -7.02], [-7.05, -8.9]];
const PENT_POLY = [[-7.05, -9.67], [11.3, -9.67], [11.3, 8.76], [10.61, 8.76], [8.73, 10.64], [-8.93, -7.02], [-7.05, -8.9]];
const PLANT_W = rect(-16.3, -0.3, -14.0, 10.0); // strook langs de westrand (3D BAG-dakvlak 21 m²)
const PLANT_D = [[-4.53, 0.02], [3.05, 8.02], [1.7, 9.41], [-5.86, 1.23]]; // strook evenwijdig aan de diagonaal (3D BAG 18 + 3 m²)
const BOX_POLY = rect(15.6, 10.7, 17.8, 13.4); // luchtfoto: kast van 2,2 × 2,7 m op de oostelijke strook

const body = union([
  prism(SLAB_POLY, BASE, z(SLAB)),
  prism(LOW_POLY, BASE, z(LOWER)),
  prism(UPPER_POLY, z(LOWER) - 0.1, z(UPPER)),
  prism(PENT_POLY, z(UPPER) - 0.1, z(PENT)),
  prism(PLANT_W, z(SLAB) - 0.1, z(PLANT)),
  prism(PLANT_D, z(SLAB) - 0.1, z(PLANT)),
  prism(BOX_POLY, z(LOWER) - 0.1, z(BOX)),
]);

// ---------- Gevelreliëf ----------
// Lagen: begane grond 4,0 m, daarboven 3,29 m; laag 8 eindigt op het dak van de oostelijke strook,
// laag 9 is de loggialaag, laag 14 eindigt op +48,2 m, laag 15 is de glazen opbouw.
const STOREY = 3.29;
const floor = (k) => (k === 0 ? [0, 4.0] : [4.0 + (k - 1) * STOREY, STOREY]);
const floors = (k0, k1) => Array.from({ length: k1 - k0 + 1 }, (_, i) => floor(k0 + i));
const DEPTH = 0.35;
const cuts = [];
// Punt op de gevel a→b (binnenkant links, buitennormaal rechts): s langs de gevel, depth naar binnen.
const facade = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h] };
};
// Is de gevel op (s, h) buitengevel? Een straal van 3 m buiten de gevel moet hem op 3 m raken.
const exposed = (P, s, h) => {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
};
// Nis van s0 tot s1, open van lo tot top, depth diep, plafond onder 45°.
const niche = (P, s0, s1, lo, top, depth = DEPTH) =>
  Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, top + 0.2), P(s1, -0.2, top + 0.2), P(s0, depth, top - depth), P(s1, depth, top - depth)]);
// Lintvenster per laag langs a→b, alleen waar de gevel op die hoogte buitengevel is (per halve meter),
// met 0,95 m dicht aan de hoeken en een onderbreking rond elke kolom in `posts`.
function bands(a, b, fl, { sill = 1.0, head = 0.95, depth = DEPTH, posts = [] } = {}) {
  const { L, P } = facade(a, b);
  for (const [zf, fh] of fl) {
    const lo = zf + sill, top = zf + fh - head;
    if (top - depth - lo < 0.9) continue;
    let start = null;
    const flush = (s1) => {
      if (start !== null && s1 - start >= 0.9) cuts.push(niche(P, start, s1, lo, top, depth));
      start = null;
    };
    for (let s = 0.95; s <= L - 0.95 + 1e-6; s += 0.5) {
      const ok = [lo + 0.05, top - depth - 0.05].every((h) => exposed(P, s, h)) && posts.every((p) => Math.abs(s - p) > 0.5);
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.5);
    }
    flush(L - 0.95);
  }
}
const SW = [-18.89, -17.4], NW = [-18.89, 13.44], NE = [11.95, 13.44];
// Blok: begane grond als hoge glasband, lagen 1–8 en 10–14 lintvensters (zuid, oost, noordoost, naad),
// steeds alleen waar de gevel op die hoogte bestaat; laag 9 op de noordoostgevel en de naad gewoon.
const GF = [[0, 4.0]];
const LOW_EDGES = [[[-10.04, -11.89], [20.85, -11.89]], [[20.85, -11.89], [20.85, 19.0]], [[20.85, 19.0], [10.61, 8.76]], [[-7.05, -8.9], [-10.04, -11.89]]];
for (const [a, b] of LOW_EDGES) {
  bands(a, b, GF, { sill: 0.5, head: 0.6 });
  bands(a, b, [...floors(1, 8), ...floors(10, 14)]);
}
for (const [a, b] of LOW_EDGES.slice(2)) bands(a, b, floors(9, 9));
// Loggialaag (laag 9) op de zuid- en oostgevel van het bovenste blok: 1,0 m diep achter kolommen van
// circa 1 m op circa 7,1 m (foto); lagen 10–14 lintvensters ook op de oostgevel van het bovenste blok.
const LOGGIA = floors(9, 9);
bands([-10.04, -11.89], [U_UPPER, -11.89], LOGGIA, { sill: 0.05, head: 0.4, depth: 1.0, posts: [1.4, 8.5, 15.6, 22.65] });
bands([U_UPPER, -11.89], [U_UPPER, U_UPPER - 1.85], LOGGIA, { sill: 0.05, head: 0.4, depth: 1.0, posts: [0.95, 8.0, 15.5, 22.6] });
bands([U_UPPER, -11.89], [U_UPPER, U_UPPER - 1.85], floors(10, 14));
// Glazen opbouw: één band rondom op de open zijden.
for (const [a, b] of [[[-7.05, -9.67], [11.3, -9.67]], [[11.3, -9.67], [11.3, 8.76]]]) bands(a, b, [[z(UPPER), z(PENT) - z(UPPER)]], { sill: 0.6, head: 0.3 });
// Schijf: west- en noordgevel (aan het water) en het stukje diagonaal bij de oostpunt lintvensters tot
// laag 15, daarboven een dichte attiek.
for (const [a, b] of [[NW, SW], [NE, NW], [[8.94, 10.43], NE]]) {
  bands(a, b, GF, { sill: 0.5, head: 0.6 });
  bands(a, b, floors(1, 15));
}
// Spitse zuidwestpunt van de schijf (diagonaal van de punt tot de naad, 14,4 m): twee kolommen ronde
// vensters van 1,3 m, lagen 1–13, als achthoekige nissen met de bovenkant onder 45°.
{
  const { P } = facade(SW, [-8.72, -7.23]);
  const r = 0.65, oct = Array.from({ length: 8 }, (_, k) => (k + 0.5) * (Math.PI / 4));
  for (const [zf] of floors(1, 13)) {
    for (const sc of [5.8, 9.4]) {
      const hc = zf + 1.7;
      cuts.push(Manifold.hull(oct.flatMap((t) => [P(sc + r * Math.cos(t), -0.2, hc + r * Math.sin(t) + 0.2), P(sc + r * Math.cos(t), DEPTH, hc + r * Math.sin(t) - DEPTH)])));
    }
  }
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Europlaza: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Europlaza", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:europlaza-amsterdam", building]],
  catalog: {
    name: "Europlaza",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 41.1, // NAP -1,9 + 43,0 (Amsterdam-Zuidoost)
    groundOffsetMetres: -0.2,
    groundSamplePoints: [[23, -8], [23, 5], [23, 16]], // plein aan de oostkant; west en noord ligt water
    replacesBuildings: ["NL.IMBAG.Pand.0363100012088788"],
    description:
      "Europlaza aan de Hoogoorddreef (Amsterdam-Zuidoost, 1991–1992, ZZ+P): een vierkant van circa 31 × 31 m dat diagonaal is gedeeld in een natuurstenen schijf tot NAP +55,7 m met installatiestroken tot +57,5 m en twee kolommen ronde vensters in de spitse zuidwestpunt, en een getrapt blok met lintvensters: de oostelijke strook tot +28,4 m, daarboven een loggialaag met kolommen en vijf lagen tot +48,2 m en een teruggezette glazen opbouw tot +51,5 m, met aan beide uiteinden een terugliggende naad tussen schijf en blok. Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2) en het AHN-DSM. Oorsprong midden in het vierkant, X-as langs de zuidgevel (-16,1° op RD-oost). Verdiepingshoogte, vensterbanden, loggia en de gevels aan het water zijn geschat; de taak noemde het gebouw Dreeftoren, maar dat is een ander pand aan de Haaksbergweg.",
    realWorld: {
      groundNapM: GROUND,
      slabNapM: SLAB,
      plantNapM: PLANT,
      penthouseNapM: PENT,
      upperBlockNapM: UPPER,
      lowerBlockNapM: LOWER,
      planM: [30.84, 30.84],
      floors: 16,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012088788 (bouwjaar 1991, Hoogoorddreef 54–58), 3D BAG LoD2.2 (AHN5 2023), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://www.pss-archi.eu/immeubles/NL-363-68916.html",
      "https://commons.wikimedia.org/wiki/File:Europlaza_Amsterdam.jpg",
    ],
  },
});
