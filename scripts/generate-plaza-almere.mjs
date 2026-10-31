// Martinez met het PLAZA Premium Almere (Mandelaplein 1, Almere-Centrum, 2010, ZZDP Architecten): hotel- en
// kantoortoren van vier aan elkaar geschakelde glazen schijven van 7,8 m dik, elk circa 42 m lang en
// verspringend in lengte en hoogte, aan de noordkant van station Almere Centrum naast het Carlton (WTC Almere).
// Van noord naar zuid: een schijf van 19 lagen die aan de westkant vanaf de vierde laag 4,6 m uitkraagt, de
// hoogste schijf van 21 lagen met een verdiept dakterras, een schijf van 15 lagen met de sky bar en aan de
// oostkant een uitkraging boven de entree van het restaurant, en een schijf van 17 lagen die aan de westkant
// boven een teruggezette entree hangt. Lange gevels met verticale witte stijlen op een stramien van 1,8 m,
// kopgevels met brede vensterbanden.
// Contour uit de BAG, hoogtes uit de 3D BAG LoD2.2 (AHN5, 2023) en het AHN-DSM, de uitkragingen en de
// gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "plaza-almere";
// Gebouwstelsel: u langs de lange gevels naar het oostnoordoosten (13,75° op RD-oost; BAG-randen evenwijdig
// binnen 0,01°), v haaks erop naar het noordnoordwesten. Oorsprong in het midden van de vier schijven.
const ORIGIN = [143507.0, 487577.0];
const ANGLE = 13.75;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = -3.47; // NAP, AHN-DTM op het plein rondom (-3,65…-3,37, mediaan -3,47; 3D BAG -3,64)
const GEOID = 42.9; // NLGEO2018 ter plekke (data/geoid), ellipsoïdisch = NAP + 42,90
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 en AHN-DSM ----------
const ROOF_N = 66.75; // noordschijf (3D BAG 66,72–66,78; DSM 67)
const ROOF_3 = 74.2; // hoogste schijf (3D BAG 73,86–74,51, licht aflopend naar het oosten; DSM 74)
const TERRACE_3 = 72.3; // verdiept dakterras in de zuidwesthoek (3D BAG 72,24–72,36; DSM 72,5–73)
const TERRACE_BOX = 73.7; // opbouw op het dakterras (3D BAG 73,66–73,71)
const ROOF_2 = 52.55; // derde schijf (3D BAG 52,52–52,59; DSM 52–53)
const SKYBAR = 55.65; // opbouw midden op de derde schijf (3D BAG 55,64–55,67; DSM 55–56)
const ROOF_S = 59.8; // zuidschijf (3D BAG 59,78–59,84; DSM 60)
const PLANT_S = 61.05; // installatiekast op de zuidschijf (3D BAG 61,03–61,09)

// ---------- Verdiepingen ----------
// Begane grond 4,6 m en een tweede plintlaag van 3,6 m (de glazen plint van twee lagen), daarboven lagen van
// 3,6 m; zo komen de daken uit op 15, 17, 19 en 21 lagen met een dakrand van 0,8–1,1 m.
const STOREY = 3.6;
const FLOORS = [[0, 4.6], ...Array.from({ length: 20 }, (_, k) => [4.6 + STOREY * k, STOREY])];
const LEVEL = (n) => FLOORS[n][0]; // onderkant van laag n (0 = begane grond)

// ---------- Plattegrond in (u, v), BAG-contour (stramientrapjes van 5 cm weggelaten) ----------
const BAR_N = [-28.41, 7.42, 13.77, 15.22];
const BAR_3 = [-23.84, -0.38, 18.35, 7.42];
const BAR_2 = [-10.45, -8.18, 33.58, -0.38];
const BAR_S = [-13.03, -15.98, 29.15, -8.18];
// Uitkragingen (foto's): de noordschijf hangt aan de westkant vanaf de vierde laag 4,57 m voorbij de hoogste
// schijf; de derde schijf hangt aan de oostkant vanaf de tweede laag 4,43 m voorbij de zuidschijf (entree en
// restaurant eronder); de zuidschijf hangt aan de westkant vanaf de tweede laag boven een entree die gelijk
// ligt met de kop van de derde schijf (2,58 m terug). Elke uitkraging rust op een kraag onder 45°.
const N_UNDER = LEVEL(4); // +15,4 m boven maaiveld
const E2_UNDER = LEVEL(2); // +8,2 m
const SW_UNDER = LEVEL(2);
// Dakopbouwen
const TERRACE = [[-22.9, -1], [-3.4, -1], [-3.4, 3.8], [-22.9, 3.8]]; // 0,94 m dakrand aan de westkop
const TERRACE_BOX_POLY = rect(-17.0, 1.55, -7.1, 3.8);
const SKYBAR_POLY = rect(-5.8, -8.18, 5.6, 0.0);
const PLANT_POLY = rect(23.6, -14.4, 26.8, -11.8);

// Plaat van u0 tot u1 die boven zUnder uitkraagt aan de kant `open` (u-waarde van de vrije kop), met een kraag
// onder 45° tot de gevel die de plaat draagt.
function overhang([u0, v0, u1, v1], zUnder, zTop, open) {
  const inner = open === u0 ? u1 : u0;
  const into = open === u0 ? 0.05 : -0.05;
  const depth = Math.abs(inner + into - open); // kraag precies onder 45°
  const slab = prism(rect(Math.min(u0, u1) - (open === u1 ? 0.05 : 0), v0, Math.max(u0, u1) + (open === u0 ? 0.05 : 0), v1), zUnder, zTop);
  const collar = Manifold.hull([
    [open, v0, zUnder], [open, v1, zUnder],
    [inner + into, v0, zUnder], [inner + into, v1, zUnder],
    [inner + into, v0, zUnder - depth], [inner + into, v1, zUnder - depth],
  ]);
  return union([slab, collar]);
}

const body = union([
  // Noordschijf: plint gelijk met de westkop van de hoogste schijf, daarboven de uitkraging.
  prism(rect(BAR_3[0], BAR_N[1], BAR_N[2], BAR_N[3]), BASE, z(ROOF_N)),
  overhang([BAR_N[0], BAR_N[1], BAR_3[0], BAR_N[3]], N_UNDER, z(ROOF_N), BAR_N[0]),
  // Hoogste schijf met verdiept dakterras en een opbouw erop.
  prism(rect(...BAR_3), BASE, z(ROOF_3)).subtract(prism(TERRACE, z(TERRACE_3), z(ROOF_3) + 1)),
  prism(TERRACE_BOX_POLY, z(TERRACE_3) - 0.1, z(TERRACE_BOX)),
  // Derde schijf: plint tot de oostkop van de zuidschijf, oostelijke uitkraging, sky bar op het dak.
  prism(rect(BAR_2[0], BAR_2[1], BAR_S[2], BAR_2[3]), BASE, z(ROOF_2)),
  overhang([BAR_S[2], BAR_2[1], BAR_2[2], BAR_2[3]], E2_UNDER, z(ROOF_2), BAR_2[2]),
  prism(SKYBAR_POLY, z(ROOF_2) - 0.1, z(SKYBAR)),
  // Zuidschijf: teruggezette entree aan de westkop, installatiekast op het dak.
  prism(rect(BAR_2[0], BAR_S[1], BAR_S[2], BAR_S[3]), BASE, z(ROOF_S)),
  overhang([BAR_S[0], BAR_S[1], BAR_2[0], BAR_S[3]], SW_UNDER, z(ROOF_S), BAR_S[0]),
  prism(PLANT_POLY, z(ROOF_S) - 0.1, z(PLANT_S)),
]);

// ---------- Gevelreliëf ----------
// Lange gevels: per laag een venster van 0,9 m op het stramien van 1,8 m tussen witte stijlen van 0,9 m.
// Kopgevels (7,8 m): per laag één vensterband tussen hoekstijlen van 0,9 m. Blinde nissen van 0,35 m diep met
// een plafond onder 45°, alleen waar de gevel op die hoogte buitengevel is.
const DEPTH = 0.35;
const cuts = [];
function face(a, b, { pitch, width, sill, header = 0.35 }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const bays = pitch ? Math.floor((L - 0.9) / pitch) : 1;
  const w = pitch ? (L - bays * pitch) / 2 : 0;
  for (const [zf, fh] of FLOORS) {
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
    if (hi - lo < 0.9) continue;
    for (let k = 0; k < bays; k++) {
      const s0 = pitch ? w + k * pitch + (pitch - width) / 2 : 0.9, s1 = pitch ? s0 + width : L - 0.9;
      const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const LONG = { pitch: 1.8, width: 0.9, sill: 0.7 };
const END = { pitch: 0, sill: 0.9 };
for (const [u0, v0, u1, v1] of [BAR_N, BAR_3, BAR_2, BAR_S]) {
  face([u0, v0], [u1, v0], LONG); // zuidgevel
  face([u1, v1], [u0, v1], LONG); // noordgevel
  face([u1, v0], [u1, v1], END); // oostkop
  face([u0, v1], [u0, v0], END); // westkop
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Martinez: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Martinez", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

const groundHeight = +(GROUND + GEOID).toFixed(2);
await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:plaza-almere-martinez", building]],
  catalog: {
    name: "Martinez (PLAZA Premium Almere)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight, // NAP-maaiveld + NLGEO2018-geoïde (42,90 m)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-33, 0], [-14, -20], [12, -20], [37, -5], [0, 19], [-30, 18]],
    replacesBuildings: ["NL.IMBAG.Pand.0034100000103008"],
    description:
      "Martinez aan het Mandelaplein met het PLAZA Premium Almere: vier geschakelde glazen schijven van 7,8 m dik op de BAG-contour, van noord naar zuid tot NAP +66,75 m (19 lagen, aan de westkant vanaf de vierde laag 4,6 m uitkragend), +74,2 m (21 lagen, met een verdiept dakterras op +72,3 m en een opbouw tot +73,7 m), +52,55 m (15 lagen, sky bar tot +55,65 m, aan de oostkant vanaf de tweede laag 4,4 m uitkragend) en +59,8 m (17 lagen, westkop boven een 2,6 m teruggezette entree, installatiekast tot +61,05 m); uitkragingen op een kraag onder 45°; lange gevels met vensters per laag op een stramien van 1,8 m, kopgevels met een vensterband per laag. Hoogtes uit de 3D BAG (AHN5 2023) en het AHN-DSM. Oorsprong in het midden van de schijven, X-as langs de lange gevels (13,75° op RD-oost). De laaghoogte, de hoogte en diepte van de uitkragingen en de gevelindeling zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      geoidM: GEOID,
      slabRoofsNapM: { north: ROOF_N, highest: ROOF_3, third: ROOF_2, south: ROOF_S },
      terraceNapM: TERRACE_3,
      terraceBoxNapM: TERRACE_BOX,
      skyBarNapM: SKYBAR,
      plantNapM: PLANT_S,
      slabDepthM: 7.8,
      floors: { north: 19, highest: 21, third: 15, south: 17 },
      storeyHeightM: STOREY,
      groundFloorM: 4.6,
      overhangs: {
        northWest: { depthM: 4.57, undersideAboveGroundM: N_UNDER },
        thirdEast: { depthM: 4.43, undersideAboveGroundM: E2_UNDER },
        southWest: { depthM: 2.58, undersideAboveGroundM: SW_UNDER },
      },
      facadeAngleDegrees: ANGLE,
      estimatedOverhangs: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0034100000103008 (bouwjaar 2010; bijeenkomst-, kantoor- en logiesfunctie), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0034100000103008",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Almere",
      "https://www.pss-archi.eu/immeubles/NL-34-63044.html",
      "https://www.visitalmere.com/en/locations/2617365838/martinez",
      "https://commons.wikimedia.org/wiki/File:Gebouw_Martinez_Almere.jpg",
      "https://commons.wikimedia.org/wiki/File:Martinez_Almere.jpg",
      "https://commons.wikimedia.org/wiki/File:Almere_Almere-Stad_1.jpg",
      "https://commons.wikimedia.org/wiki/File:Almere_Almere-Stad_2.jpg",
      "https://commons.wikimedia.org/wiki/File:20150316_Almere_03.JPG",
      "https://commons.wikimedia.org/wiki/File:20150316_Almere_08.JPG",
      "https://commons.wikimedia.org/wiki/File:20150316_Almere_10.JPG",
    ],
  },
});
