// Toren van Siza (Plein 1992 / Avenue Céramique, Maastricht, 2001, Álvaro Siza Vieira met A+D+P): woontoren
// van 17 lagen op de kop van de Avenue Céramique. Twee verticale volumes die ten opzichte van elkaar gedraaid
// zijn: west een zinken volume (−7,8° op RD-oost) met per laag een venster en een loggia op de zuidgevel en een
// sokkel van wit marmer met luifel, oost een volume van wit Thassos-marmer (+11°) met hoekloggia's die de
// zuidwesthoek uitsnijden (de zaagtand die je vanaf de Avenue Céramique ziet), een sokkel van grijze hardsteen
// met luifel en één laag minder: daar ligt het dakterras achter een witte borstwering. In de twee nissen tussen
// de volumes (zuid en noord) staat glas; aan de noordoostkant steekt het trappenhuis van natuursteen een laag
// boven alles uit. Op het zinken dak een uitsparing aan de westgevel met een uitkragende dakrand, de liftopbouw
// en een leidingkoker.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2024) en het AHN-DSM, gevelindeling uit foto's.
import { Manifold, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "toren-van-siza";
// Modelstelsel: x langs de gemeenschappelijke zuidgevel van beide volumes (−3,9° op RD-oost; BAG-randen 0→1 en
// 4→5 op −3,93° en −3,86°), y haaks erop naar het noorden. Oorsprong in het zwaartepunt van de BAG-contour.
const ORIGIN = [177158.37, 317457.0];
const ANGLE = -3.9;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const L = ([x, y]) => {
  const dx = x - ORIGIN[0], dy = y - ORIGIN[1];
  return [+(dx * AXIS[0] + dy * AXIS[1]).toFixed(3), +(-dx * AXIS[1] + dy * AXIS[0]).toFixed(3)];
};
const GROUND = 48.1; // NAP, maaiveld aan de noordkant (AHN-DTM 47,9–48,3; 3D BAG-maaiveld 48,08); het plein aan de
// zuidkant ligt op +49,0, de straat aan de oostkant op +49,15
const PLAZA = 49.0; // NAP, Avenue Céramique/Plein 1992 voor de zuidgevel: nulpunt van de gevelmaten uit foto's
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 (AHN5) en AHN-DSM ----------
const ROOF = 98.97; // zinken volume en middenstuk (3D BAG 98,95–98,99; DSM-mediaan 98,97)
const RIM = 99.9; // dakrand rond het zinken volume en de uitkragende rand boven de dakuitsparing (3D BAG 99,87–99,90)
const TERRACE = 95.7; // dakterras op het witte volume en de zuidelijke nis, uitsparing in het zinken dak (95,60–95,84)
const PARAPET = 97.8; // witte borstwering rond het dakterras (foto: 1,2 m onder de zinken dakrand; geschat)
const HINGE_PARAPET = 96.6; // borstwering boven de glazen nis (foto; geschat)
const STAIR = 102.7; // trappenhuis noordoost (3D BAG 102,64–102,79)
const LIFT = 102.9; // liftopbouw op het zinken dak (3D BAG 102,58–103,0; DSM-piek 103,8 is een rooster)
const DUCT = 101.2; // leidingkoker op het zinken dak (DSM 100,9–101,7)

// ---------- Plattegrond (RD), BAG-pand 0935100000023758 ----------
const P = [
  [177145.22, 317446.2], [177155.86, 317445.47], [177156.36, 317449.26], [177160.64, 317450.05],
  [177161.61, 317445.04], [177171.39, 317444.38], [177168.27, 317460.34], [177171.52, 317460.98],
  [177169.92, 317468.94], [177165.79, 317469.23], [177166.05, 317467.98], [177162.24, 317467.22],
  [177162.8, 317464.38], [177158.33, 317463.54], [177159.08, 317468.94], [177148.54, 317470.4],
];
const FOOT = P.map(L);
// Zinken volume: rechthoek op −7,8° met de zuidgevel op −3,9°; de oostgevel loopt door de nissen (1→2, 13→14).
const ZINC = [P[0], P[1], P[14], P[15]].map(L);
// Dakterras (3D BAG-dakvlak op 95,7): wit volume tot de grens met het middenstuk en de zuidelijke nis.
const TERRACE_POLY = [P[2], P[3], P[4], P[5], [177169.44, 317454.35], [177162.3, 317453.9], [177162.0, 317456.0], [177157.29, 317456.0]].map(L);
// Strook langs de oostgevel tot de sprong (bovenste loggia's van de loggiakolom, DSM 95,7).
const TERRACE_STRIP = [[177169.44, 317454.35], P[6], [177166.6, 317459.1], [177167.5, 317454.3]].map(L);
// Trappenhuis noordoost tot 102,7 (3D BAG-dakvlak).
const STAIR_POLY = [[177162.95, 317461.78], [177171.01, 317463.52], P[8], P[9], P[10], P[11], P[12]].map(L);
// Liftopbouw en leidingkoker op het zinken dak (3D BAG/DSM).
const LIFT_POLY = [[177152.75, 317455.66], [177155.1, 317456.0], [177154.7, 317459.4], [177152.85, 317459.0]].map(L);
const DUCT_POLY = [[177153.7, 317459.0], [177154.7, 317458.9], [177156.1, 317466.9], [177155.1, 317467.0]].map(L);

// Hulpen langs een rand a→b (contour linksom, buitennormaal rechts van de looprichting).
const frame = (a, b) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n = [d[1], -d[0]];
  return { len, P: (s, t, h) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t, h], Q: (s, t) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t] };
};
// Strook van w m binnen de gevel a→b, van s0 tot s1.
const inner = (a, b, w, s0 = -w, s1) => {
  const f = frame(a, b);
  const e = s1 ?? f.len + w;
  return [f.Q(s0, 0.01), f.Q(e, 0.01), f.Q(e, -w), f.Q(s0, -w)];
};

// ---------- Massa ----------
const footprint = prism(FOOT, BASE, z(ROOF));
const ring = (poly, w, z0, z1) => union(poly.map((a, i) => prism(inner(a, poly[(i + 1) % poly.length], w), z0, z1))).intersect(prism(poly, z0 - 1, z1 + 1));
// Dakuitsparing in de westgevel van het zinken volume (s 5,3–13,1 m vanaf de zuidwesthoek, 3,5 m diep; DSM 95,7)
// met de uitkragende dakrand aan de zuidkant (3D BAG 99,9, 2,1 m over de uitsparing, ondervlak onder 45°).
const west = frame(ZINC[0], ZINC[3]); // langs de westgevel van zuid naar noord, buitennormaal naar het oosten (binnen)
const recess = prism([west.Q(5.3, -1), west.Q(13.1, -1), west.Q(13.1, 3.5), west.Q(5.3, 3.5)], z(TERRACE), z(RIM) + 1);
const stub = Manifold.hull([0, 2.2].flatMap((t) => [
  west.P(5.0, t, z(TERRACE)), west.P(5.0, t, z(RIM)), west.P(5.3, t, z(TERRACE)), west.P(7.4, t, z(RIM)), west.P(7.4, t, z(RIM) - 2.1),
]));
let body = union([
  footprint.subtract(prism(TERRACE_POLY, z(TERRACE), z(ROOF) + 1)).subtract(prism(TERRACE_STRIP, z(TERRACE), z(ROOF) + 1)),
  ring(ZINC, 0.9, z(ROOF) - 0.1, z(RIM)),
  prism(STAIR_POLY, z(ROOF) - 0.1, z(STAIR)),
  prism(LIFT_POLY, z(ROOF) - 0.1, z(LIFT)),
  prism(DUCT_POLY, z(ROOF) - 0.1, z(DUCT)),
]).subtract(recess);
body = union([body, stub]);
// Borstwering rond het dakterras: 0,9 m breed (werkelijk ca. 0,3 m; verbreed om te printen).
const parapets = union([
  prism(inner(FOOT[3], FOOT[4], 0.9), z(TERRACE) - 0.1, z(PARAPET)),
  prism(inner(FOOT[4], FOOT[5], 0.9), z(TERRACE) - 0.1, z(PARAPET)),
  prism(inner(FOOT[5], FOOT[6], 0.9, -0.9, 10.2), z(TERRACE) - 0.1, z(PARAPET)),
  prism(inner(FOOT[2], FOOT[3], 0.9), z(TERRACE) - 0.1, z(HINGE_PARAPET)),
]).intersect(footprint);
body = union([body, parapets]);

// ---------- Luifels ----------
// Op foto's een plaat van 0,4–0,5 m; als luifel van 1,5 m dik met een kraag onder 45° naar de gevel.
function canopy(a, b, s0, s1, top, out, thick = 1.5) {
  const f = frame(a, b);
  return Manifold.hull([s0, s1].flatMap((s) => [
    f.P(s, -0.3, top), f.P(s, -0.3, top - thick - out), f.P(s, out, top), f.P(s, out, top - thick),
  ]));
}
const WEST_CANOPY = PLAZA + 6.3; // bovenkant luifel aan de witte sokkel (foto)
const EAST_CANOPY = PLAZA + 4.5; // bovenkant van de hardstenen luifelrand (foto)
const canopies = union([
  canopy(FOOT[0], FOOT[1], 0, frame(FOOT[0], FOOT[1]).len + 1.0, z(WEST_CANOPY), 1.5),
  canopy(FOOT[4], FOOT[5], -5.9, frame(FOOT[4], FOOT[5]).len + 1.8, z(EAST_CANOPY), 1.8),
  canopy(FOOT[5], FOOT[6], -1.8, frame(FOOT[5], FOOT[6]).len + 0.3, z(EAST_CANOPY), 1.8),
]);
body = union([body, canopies]);

// ---------- Gevelreliëf ----------
// Laagindeling uit frontale foto's vanaf het plein (zuid): zinken volume met de eerste woonlaag op +8,3 m en
// lagen van 2,80 m (15 woonlagen boven de sokkel van twee lagen); wit volume met de eerste woonlaag op +4,7 m en
// lagen van 2,89 m (15 lagen tot het dakterras, het trappenhuis twee lagen meer).
const ZINC_ROWS = Array.from({ length: 15 }, (_, k) => PLAZA + 8.3 + 2.8 * k);
const WHITE_ROWS = Array.from({ length: 17 }, (_, k) => PLAZA + 4.7 + 2.89 * k);
const cuts = [];
// Nissen in de gevel a→b: items [s0, s1, diepte, hoogte opening] per rij, plafond onder 45°; alleen waar de gevel
// buitengevel is (straal van buiten raakt de gevel), tenzij force (hoekloggia die om de hoek doorloopt).
function face(a, b, rows, items, { maxTop = Infinity, force = false } = {}) {
  const f = frame(a, b);
  for (const nap of rows) {
    for (const [s0, s1, depth, height] of items) {
      const lo = z(nap), top = lo + height, hi = top - depth;
      if (nap + height > maxTop) continue;
      const exposed = force || [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, top - 0.05].every((h) => {
        const from = f.P(s, 3, h), hit = body.rayCast(from, f.P(s, -1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (!exposed) continue;
      cuts.push(Manifold.hull([
        f.P(s0, 0.2, lo), f.P(s1, 0.2, lo), f.P(s0, -depth, lo), f.P(s1, -depth, lo),
        f.P(s0, 0.2, top + 0.2), f.P(s1, 0.2, top + 0.2), f.P(s0, -depth, hi), f.P(s1, -depth, hi),
      ]));
    }
  }
}
const W = 0.35; // diepte venster
const LG = 0.9; // diepte loggia
const F = FOOT;
const sw = (s) => frame(F[15], F[0]).len - s; // westgevel: maat vanaf de zuidwesthoek
// Zinken volume.
face(F[0], F[1], ZINC_ROWS, [[2.1, 5.8, W, 1.4], [6.7, 9.6, LG, 1.75]], { maxTop: ROOF - 0.9 });
face(F[15], F[0], ZINC_ROWS, [[sw(7.25), sw(5.75), W, 1.4], [sw(10.05), sw(8.55), W, 1.4], [sw(12.85), sw(11.35), W, 1.4], [sw(19.8), sw(17.3), LG, 1.75], [sw(22.3), sw(20.8), W, 1.4]], { maxTop: ROOF - 0.9 });
face(F[14], F[15], ZINC_ROWS, [1.725, 4.125, 6.525, 8.925].map((c) => [c - 0.7, c + 0.7, W, 1.4]), { maxTop: ROOF - 0.9 });
// Sokkel van het zinken volume: hoge glazen puien tussen marmeren penanten.
face(F[0], F[1], [PLAZA + 0.3], [[2.2, 5.6, W, 2.1], [6.8, 9.4, W, 2.1]]);
face(F[15], F[0], [50.4], [[sw(5.5), sw(3.0), W, 4.6], [sw(10.0), sw(7.5), W, 4.6], [sw(14.5), sw(12.0), W, 4.6]]);
face(F[14], F[15], [48.6], [[2.0, 4.6, W, 4.8], [6.0, 8.6, W, 4.8]]);
// Wit volume: hoekloggia's op de zuidwesthoek (open naar zuid en west), venster rechts; vensters en de
// loggiakolom op de oostgevel; een smal venster op de westgevel in de nis.
face(F[4], F[5], WHITE_ROWS.slice(0, 15), [[-2.0, 3.9, 1.2, 1.75]], { force: true });
face(F[4], F[5], WHITE_ROWS.slice(0, 15), [[4.8, 8.6, W, 1.45]]);
face(F[3], F[4], WHITE_ROWS.slice(0, 15), [[1.6, 2.5, W, 1.45]]);
face(F[5], F[6], WHITE_ROWS.slice(0, 15), [[6.9, 8.3, W, 1.45], [9.2, 10.6, W, 1.45], [11.5, 12.9, W, 1.45], [14.0, frame(F[5], F[6]).len, LG, 1.75]]);
// Trappenhuis: loggia's op de zuidkant van de sprong en boven het dak, één klein venster per laag op de noordgevel.
face(F[6], F[7], WHITE_ROWS.slice(0, 15), [[0.9, 2.41, LG, 1.75]], { maxTop: ROOF - 0.9 });
face(STAIR_POLY[0], STAIR_POLY[1], WHITE_ROWS.slice(16), [[1.5, 3.5, LG, 1.75], [5.0, 7.0, LG, 1.75]], { maxTop: STAIR - 0.9 });
face(F[10], F[11], WHITE_ROWS, [[1.45, 2.45, W, 1.1]], { maxTop: STAIR - 0.9 });
// Glazen nissen tussen de volumes (zuid en noord): per laag een glasvlak achter een smalle vloerrand.
face(F[2], F[3], WHITE_ROWS.slice(0, 14), [[0.6, 3.75, W, 1.95]], { maxTop: TERRACE - 0.9 });
face(F[12], F[13], WHITE_ROWS.slice(0, 15), [[0.6, 3.94, W, 1.95]], { maxTop: ROOF - 0.9 });

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Toren van Siza: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Toren van Siza", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:toren-van-siza", building]],
  catalog: {
    name: "Toren van Siza",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 93.95, // NAP +48,1 + 45,85 (NLGEO2018 45,745 + 0,1, geijkt op de PDOK-Maas bij de Maastrichtse bruggen)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[177150.5, 317473.0], [177157.0, 317472.8], [177165.0, 317472.5]].map(L),
    replacesBuildings: ["NL.IMBAG.Pand.0935100000023758"],
    description:
      "Toren van Siza (Álvaro Siza, 2001) op de kop van de Avenue Céramique: de BAG-contour met twee gedraaide volumes. Het zinken westvolume en het middenstuk tot NAP +98,97 m met een dakrand van 0,9 m tot +99,9, een uitsparing van 7,8 × 3,5 m in de westgevel tot +95,7 met de uitkragende dakrand aan de zuidkant, de liftopbouw tot +102,9 en een leidingkoker tot +101,2; per laag een venster en een loggia op de zuidgevel, vensters en een loggia op de west- en noordgevel en een sokkel van twee lagen met luifel. Het witte oostvolume met het dakterras op +95,7 achter een borstwering tot +97,8, hoekloggia's die de zuidwesthoek uitsnijden, vensters en een loggiakolom op de oostgevel, een luifel rond de hardstenen sokkel en het trappenhuis in de noordoosthoek tot +102,7. In de nissen tussen de volumes glas per laag. Hoogtes uit de 3D BAG (AHN5) en het AHN-DSM, contour uit de BAG. Oorsprong in het zwaartepunt van de contour, X-as langs de zuidgevel (−3,9° op RD-oost). Laagindeling, gevelindeling, borstwering en luifels zijn geschat uit foto's; luifels en borstwering zijn dikker dan in het echt om te printen.",
    realWorld: {
      groundNapM: GROUND,
      plazaNapM: PLAZA,
      roofNapM: ROOF,
      rimNapM: RIM,
      terraceNapM: TERRACE,
      terraceParapetNapM: PARAPET,
      stairTowerNapM: STAIR,
      liftNapM: LIFT,
      ductNapM: DUCT,
      floors: 17,
      zincStoreyHeightM: 2.8,
      whiteStoreyHeightM: 2.89,
      facadeAngleDegrees: ANGLE,
      volumeAnglesDegrees: { zinc: -7.8, white: 11.0 },
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0935100000023758 (bouwjaar 2001), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (puntwolk AHN5 2024)",
      "NLGEO2018 (geoïde) voor de maaiveldoffset, geijkt op de landmarkmodellen van de Maastrichtse Maasbruggen",
      "https://nl.wikipedia.org/wiki/Toren_van_Siza",
      "https://commons.wikimedia.org/wiki/Category:Toren_van_Siza_(Maastricht)",
      "https://commons.wikimedia.org/wiki/File:Toren_van_Siza,_Maastricht-40468.jpg",
      "https://commons.wikimedia.org/wiki/File:Toren_van_Siza,_Maastricht-40464.jpg",
      "https://commons.wikimedia.org/wiki/File:20150312_Maastricht;_Siza%27s_Tower.jpg",
    ],
  },
});
