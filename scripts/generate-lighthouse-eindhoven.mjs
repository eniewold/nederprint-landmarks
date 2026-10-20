// Lighthouse (Toren Niko; Machinekamerplein, Strijp-S, Eindhoven, 2022–2025; De Zwarte Hond): woontoren
// van 109 m naast het Klokgebouw. Een schijf van 58,4 × 23,8 m die naar het westen in twee lagere blokken
// afloopt (tot de hoogte van de buren), met een getande noordoosthoek (zes treden van 4,1 × 1,67 m), een
// colonnade van twee lagen langs de hele zuidgevel, een teruggezette noordwesthoek tot de 18e laag en een
// kroon van drie penthouselagen boven de westelijke helft. Het oostdeel heeft aan de zuidkant doorlopende
// balkonbanden; de rest van de gevels staande ramen tussen bakstenen penanten. Contour uit de BAG,
// plattegronden en doorsnede van De Zwarte Hond (1:200 en 1:500) voor de opbouw, hoogtes van de lage
// blokken uit de 3D BAG (AHN5, 2024). Het AHN van de PDOK-WCS is van vóór de bouw en toont hier het lege
// bouwterrein; de 3D BAG toont de toren in aanbouw (+82,7 m) en is voor de toren niet gebruikt.
import { CrossSection, Manifold, ccw, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "lighthouse-eindhoven";
// Gebouwstelsel: u langs de zuidgevel (colonnade) van west naar oost, -28,24° op RD-oost (BAG-hoekpunten
// 159768,958 384424,986 en 159820,390 384397,359, alle 28 pijlerhoekpunten op één lijn), v haaks erop
// naar het noordnoordoosten. A0 is de zuidwesthoek van het pand; de oorsprong ligt in het midden van de
// plattegrond (u 29,19, v 11,90).
const A0 = [159768.958, 384424.986];
const ANGLE = -28.2427;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const ORIGIN = [159800.3, 384421.66];
const UC = (ORIGIN[0] - A0[0]) * AXIS[0] + (ORIGIN[1] - A0[1]) * AXIS[1];
const VC = -(ORIGIN[0] - A0[0]) * AXIS[1] + (ORIGIN[1] - A0[1]) * AXIS[0];
const GROUND = 18.3; // NAP, AHN-DTM op de straten rondom (18,22–18,48); 3D BAG b3_h_maaiveld 17,83 ligt in de bouwput van 2024
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Plattegrond (u, v in m, uit de BAG-contour) ----------
const LEN = 58.38; // zuidgevel
const DEPTH_V = 23.8; // westgevel
// Getande noordoosthoek: zes treden van 4,1 m (u) bij 1,665 m (v) van (37,88, 23,80) naar (58,38, 15,47).
const TEETH = [[58.38, 15.47], [54.27, 15.47], [54.27, 17.14], [50.18, 17.14], [50.18, 18.8], [46.08, 18.8], [46.08, 20.47], [41.98, 20.47], [41.98, 22.14], [37.88, 22.14], [37.88, DEPTH_V]];
const FOOT = [[0, 0], [LEN, 0], ...TEETH, [0, DEPTH_V]];

// ---------- Hoogtes (boven maaiveld) ----------
// Doorsnede 1:500: begane grond en eerste verdieping samen 7,45 m, dertig woonlagen tot +98,5 m (3,035 m),
// drie penthouselagen tot het kroondak op +108,1 m, dakrand van de kroon +108,8 m (Wikipedia: 109 m).
const PLINTH_TOP = 7.45;
const STOREY = 3.035;
const BODY_ROOF = 98.5; // dak van het oostdeel en de noordstrook (vloer van de 32e laag)
const BODY_PARAPET = 99.5; // dakrand, 1,0 m breed (doorsnede: hekwerk tot +100,5 m, weggelaten)
const CROWN_ROOF = 108.1;
const CROWN_PARAPET = 108.8;
const CROWN_STOREY = (CROWN_ROOF - BODY_ROOF) / 3;
// Westblok W1 (u 0–8,0) tot en met de 3e laag en W2 (u 8,0–16,24) tot en met de 10e laag: 3D BAG
// (AHN5, 2024) dak 31,60 en 52,60, dakrand 32,52 en 53,52 NAP.
const W1 = { poly: [[0, 0], [8.0, 0], [8.0, DEPTH_V], [0, DEPTH_V]], roof: z(31.6), top: z(32.52), floors: 3 };
const W2 = { poly: [[8.0, 0], [16.24, 0], [16.24, DEPTH_V], [8.0, DEPTH_V]], roof: z(52.6), top: z(53.52), floors: 10 };
// Noordwesthoek van de toren (u 16,24–24,24, v 20,95–23,80): tot en met de 18e laag (plattegrond 19e
// verdieping: terras), dak plus dakrand geschat op 18 lagen.
const NOTCH_V = 20.95;
const NOTCH = { poly: [[16.24, NOTCH_V], [24.24, NOTCH_V], [24.24, DEPTH_V], [16.24, DEPTH_V]], top: PLINTH_TOP + 17 * STOREY + 0.9, floors: 18 };
// Schijf tot en met de 31e laag: alles oostelijk van W2 behalve de noordwesthoek.
const MAIN = { poly: [[16.24, 0], [LEN, 0], ...TEETH, [24.24, DEPTH_V], [24.24, NOTCH_V], [16.24, NOTCH_V]], roof: BODY_ROOF, top: BODY_PARAPET, floors: 31 };
// Kroon (32e–34e laag, plattegrond 32e verdieping): westelijke 21,6 m van de schijf tot v = 20,95, met
// een uitstulping tot u = 41,98 tussen v 5,6 en 18,2.
const CROWN = { poly: [[16.24, 0], [37.88, 0], [37.88, 5.6], [41.98, 5.6], [41.98, 18.2], [37.88, 18.2], [37.88, NOTCH_V], [16.24, NOTCH_V]], roof: CROWN_ROOF, top: CROWN_PARAPET };
// Trappenhuis naar het dakterras van het oostdeel (plattegrond 32e verdieping), één laag plus dakrand (geschat).
const STAIR = { poly: [[41.98, 10.4], [44.9, 10.4], [44.9, 15.9], [41.98, 15.9]], top: BODY_ROOF + CROWN_STOREY + 0.4 };
const PARAPET_W = 1.0, CROWN_PARAPET_W = 0.8;

const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (sec, z0, z1) => Manifold.extrude(sec, z1 - z0).translate([0, 0, z0]);
// Blok tot de dakrand met een verdiept dak binnen een rand van breedte w.
const block = (poly, roof, top, w) => prism(poly, BASE, top).subtract(prismCs(cs(poly).offset(-w, "Miter"), roof, top + 1));

const mass = union([
  prism(FOOT, BASE, PLINTH_TOP),
  block(W1.poly, W1.roof, W1.top, PARAPET_W),
  block(W2.poly, W2.roof, W2.top, PARAPET_W),
  prism(NOTCH.poly, BASE, NOTCH.top),
  block(MAIN.poly, MAIN.roof, MAIN.top, PARAPET_W),
  block(CROWN.poly, CROWN.roof, CROWN.top, CROWN_PARAPET_W).subtract(prism(CROWN.poly, BASE, BODY_ROOF - 0.1)),
  prism(CROWN.poly, BODY_ROOF - 0.2, BODY_ROOF + 0.1),
  prism(STAIR.poly, BODY_ROOF - 0.1, STAIR.top),
]);

// ---------- Gevelreliëf ----------
// Staande ramen tussen bakstenen penanten: per gevelzijde verticale nissen van 0,4 m diep, ≥ 0,9 m breed,
// penanten 0,9 m, doorlopend over alle lagen waar de gevel vrij ligt; onderaan 0,6 m borstwering, bovenaan
// een kopstuk van 1,0 m onder de rand van het blok en een kop onder 45° zodat de nis open blijft.
const DEPTH = 0.4, PIER = 0.9, PITCH = 2.0, SILL = 0.6, HEADER = 1.0;
const floorList = (n) => [[0, PLINTH_TOP], ...Array.from({ length: n - 1 }, (_, k) => [PLINTH_TOP + k * STOREY, STOREY])];
const CROWN_FLOORS = Array.from({ length: 3 }, (_, k) => [BODY_ROOF + k * CROWN_STOREY, CROWN_STOREY]);
const cuts = [];
// Oostdeel van de zuidgevel (u > 37,88) krijgt balkonbanden in plaats van nissen.
const bandFace = (pu, pv) => pv < 0.5 && pu > 37.88;
function grooves(poly, floors, { zone, top, sill = SILL, header = HEADER } = {}) {
  const p = ccw(poly);
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 3.5) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]]; // n wijst naar buiten
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    const cols = Math.max(1, Math.floor((L - PIER) / PITCH)), w = (L - PIER) / cols;
    for (let k = 0; k < cols; k++) {
      const s0 = PIER + k * w, s1 = s0 + w - PIER;
      const mid = P((s0 + s1) / 2, 0, 0);
      if (zone === "plinth" && mid[1] < 0.5) continue; // zuidgevel: colonnade
      if (zone === "body" && bandFace(mid[0], mid[1])) continue;
      // Per laag: ligt de gevel daar vrij, met ≥ 1 m materiaal achter de nis?
      const open = floors.map(([zf, fh]) => [zf + Math.min(1.0, fh / 3), zf + fh - Math.min(1.0, fh / 3)].every((h) => [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => {
        const from = P(s, -3, h), hits = mass.rayCast(from, P(s, 3, h));
        const at = (j) => hits[j] && Math.hypot(hits[j].position[0] - from[0], hits[j].position[1] - from[1]);
        return at(0) > 2.95 && at(0) < 3.05 && !(at(1) < 3 + DEPTH + 1);
      })));
      for (let f = 0; f < floors.length; f++) {
        if (!open[f]) continue;
        let g = f;
        while (g + 1 < floors.length && open[g + 1]) g++;
        const lo = floors[f][0] + (zone === "plinth" ? 0.3 : sill);
        const hi = Math.min(floors[g][0] + floors[g][1], top) - header - DEPTH;
        if (hi - lo > 0.9) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
        f = g;
      }
    }
  }
}
// Begane grond en eerste verdieping: hoge ramen van twee lagen tot 1,0 m onder de bovenkant van de plint.
grooves(FOOT, [[0, PLINTH_TOP]], { zone: "plinth", top: PLINTH_TOP, header: 0.6 });
grooves(W1.poly, floorList(W1.floors).slice(1), { zone: "body", top: W1.top });
grooves(W2.poly, floorList(W2.floors).slice(1), { zone: "body", top: W2.top });
grooves(NOTCH.poly, floorList(NOTCH.floors).slice(1), { zone: "body", top: NOTCH.top });
grooves(MAIN.poly, floorList(MAIN.floors).slice(1), { zone: "body", top: MAIN.top });
// Kroon: drie lagen hoge ramen boven een band van 1,9 m op de overgang (+97,5 tot +99,4 m).
grooves(CROWN.poly, CROWN_FLOORS, { zone: "crown", top: CROWN.top, sill: 0.9, header: 0.8 });

// Colonnade langs de zuidgevel: pijlers van 1,4 m op een stramien van 4,1 m (plattegrond begane grond,
// BAG-pijlerhoekpunten om de 4,1 m), openingen van 2,7 m, als nis van 1,5 m diep (werkelijk een gang van
// circa 4,5 m) met een kop onder 45° van +5,4 m achterin tot +6,9 m aan de gevel.
const ARC_DEPTH = 1.5, ARC_BACK = 5.4, ARC_FRONT = 6.9;
const ARCADE = [[0.5, 3.6], ...Array.from({ length: 13 }, (_, k) => [4.1 * (k + 1) + 0.9, 4.1 * (k + 2) - 0.5])];
for (const [u0, u1] of ARCADE) {
  cuts.push(Manifold.hull([[u0, -0.2, -0.3], [u1, -0.2, -0.3], [u0, ARC_DEPTH, -0.3], [u1, ARC_DEPTH, -0.3], [u0, ARC_DEPTH, ARC_BACK], [u1, ARC_DEPTH, ARC_BACK], [u0, -0.2, ARC_FRONT + 0.2], [u1, -0.2, ARC_FRONT + 0.2]]));
}

// Balkonbanden op de zuidgevel van het oostdeel (u 37,88–58,38), op elke vloer van de 2e tot en met de
// 31e laag: 0,7 m vóór de gevel (plattegrond 19e verdieping: 0,71 m), bovenkant 1,15 m boven de vloer
// (borstwering), buitenrand 0,9 m dik en een onderkant onder 45° naar de gevel.
const BAND_OUT = 0.7, BAND_TOP = 1.15, BAND_EDGE = 0.9;
const bands = [];
for (let k = 0; k < 30; k++) {
  const zf = PLINTH_TOP + k * STOREY, top = zf + BAND_TOP, edge = top - BAND_EDGE, foot = edge - BAND_OUT - 0.1 - 0.05;
  bands.push(Manifold.hull([[37.88, 0.1, foot], [LEN, 0.1, foot], [37.88, 0.1, top], [LEN, 0.1, top], [37.88, -BAND_OUT, edge], [LEN, -BAND_OUT, edge], [37.88, -BAND_OUT, top], [LEN, -BAND_OUT, top]]));
}

const building = union([mass.subtract(union(cuts)), ...bands]).translate([-UC, -VC, 0]);
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Lighthouse: ${parts.length} losse delen`);
console.log("Lighthouse", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length, "origin-uv", UC.toFixed(3), VC.toFixed(3));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:lighthouse-eindhoven-getrapte-woontoren-met-kroon-en-colonnade", building]],
  catalog: {
    name: "Lighthouse",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 61.97, // laagste PDOK-terrein op de stoep langs de zuidgevel (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-10, -18], [15, -18], [-5, 18.5], [-34, 0]],
    replacesBuildings: ["NL.IMBAG.Pand.0772100001039863"],
    description:
      "Lighthouse (Toren Niko) op Strijp-S: schijf van 58,4 × 23,8 m met een getande noordoosthoek (zes treden van 4,1 × 1,67 m), die naar het westen afloopt in twee blokken tot NAP +32,5 m (dakrand) en +53,5 m, een teruggezette noordwesthoek tot +78,3 m, de schijf tot het dak op +116,8 m (dakrand +117,8 m) met een trappenhuis tot +120,4 m, en een kroon van drie penthouselagen boven de westelijke helft tot +127,1 m. Colonnade van twee lagen langs de hele zuidgevel (pijlers om de 4,1 m, als nis van 1,5 m), balkonbanden op de zuidgevel van het oostdeel, verder staande ramen tussen penanten als doorlopende nissen. Contour uit de BAG, opbouw en hoogtes uit de plattegronden en doorsnede van De Zwarte Hond, lage blokken uit de 3D BAG. Oorsprong in het midden van de plattegrond, X-as langs de zuidgevel (-28,24° op RD-oost). De hoogte van de noordwesthoek, het trappenhuis, de diepte van de colonnade en het gevelstramien zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      footprintM: [LEN, DEPTH_V],
      plinthTopM: PLINTH_TOP,
      storeyM: STOREY,
      storeys: 34,
      westBlockRoofNapM: [31.6, 52.6],
      westBlockParapetNapM: [32.52, 53.52],
      northWestCornerTopNapM: +(NOTCH.top + GROUND).toFixed(2),
      slabRoofNapM: +(BODY_ROOF + GROUND).toFixed(2),
      slabParapetNapM: +(BODY_PARAPET + GROUND).toFixed(2),
      crownRoofNapM: +(CROWN_ROOF + GROUND).toFixed(2),
      crownParapetNapM: +(CROWN_PARAPET + GROUND).toFixed(2),
      heightM: CROWN_PARAPET,
      colonnadePitchM: 4.1,
      balconyBandProjectionM: BAND_OUT,
      teethM: [4.1, 1.665],
      facadeAngleDegrees: ANGLE,
      estimatedNorthWestCorner: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0772100001039863 (bouwjaar 2025), actuele orthoHR (toren af), AHN-DTM 0,5 m (van vóór de bouw)",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001039863",
      "https://nl.wikipedia.org/wiki/Lighthouse_(Eindhoven)",
      "https://dezwartehond.nl/en/projecten/lighthouse/",
      "https://commons.wikimedia.org/wiki/File:Toren_Niko_(2025)_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:Toren_Niko_(2025)_(2).jpg",
      "https://commons.wikimedia.org/wiki/File:Toren_Niko_(2025)_(3).jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_NIko_in_aanbouw.jpg",
      "https://commons.wikimedia.org/wiki/File:Toren_Niko_en_Klokgebouw_(2024).jpg",
    ],
  },
});
