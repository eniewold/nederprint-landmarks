// Pharos (Mercuriusplein 1, Hoofddorp, 2003, Kohn Pedersen Fox): kantoortoren van 19 lagen naast
// station Hoofddorp met een lange laagbouw van vijf lagen. De toren is een wig met een rechte
// noordwestgevel en een cirkelvormige zuidgevel (straal 67 m) die op een zuilengalerij boven een vijver
// staat; boven het dak loopt de gebogen gevel als kroon door rond een installatiezone onder een stalen
// kader. De laagbouw is een lens: rechte zuidoostgevel en een flauw gebogen noordwestgevel (straal
// 179 m) die tangentieel uit de torengevel komt; aan de noordoostkant kragen de verdiepingen 6 m uit
// boven een gang op kolommen. Langs de hele noordwestgevel loopt op dakhoogte van de laagbouw een
// lijst en vlak boven de weg een luifel. Tussen toren en laagbouw: een hoger blok en een lagere hal
// met een patio.
// Contour uit de BAG, hoogtes uit het AHN-DSM (AHN4) en de 3D BAG (LoD2.2, AHN5 2023: de installaties
// op de laagbouw zijn na het AHN4 geplaatst), gevelindeling en zuilengalerij uit foto's.
import { CrossSection, Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "mercuriusplein-hoofddorp";
// Gebouwstelsel: u langs de rechte noordwestgevel naar het noordoosten (48,0° op RD-oost; BAG-randen
// 47,93–48,02°), v haaks erop naar het noordwesten. Oorsprong midden in de BAG-contour.
const ORIGIN = [107950.0, 478590.0];
const ANGLE = 48.0;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = -5.0; // NAP, maaiveld aan de zuid- en oostkant (3D BAG -5,02, AHN-DTM -5,0); de weg aan de noordwestkant ligt op -2 tot -3
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const TOWER_ROOF = 69.7; // dak van de toren langs de noordwestgevel (3D BAG 69,63–69,70; DSM 70)
const CROWN = 76.6; // installatiezone onder het stalen kader (3D BAG 76,53–76,70; DSM 76–77)
const CROWN_RIM = 77.3; // gebogen kroon langs de zuidgevel en de oostgevel (3D BAG 77,27–77,33)
const PODIUM = 20.6; // laagbouw (3D BAG 20,60–20,71; DSM 20,5–20,6)
const CORNICE = 21.3; // lijst langs de noordwestgevel (DSM 21,3–21,4 tot 1,4 m buiten de gevel)
const BLOCK = 25.55; // hoger blok naast de toren (3D BAG 25,50–25,65; DSM 25–26)
const HALL = 16.5; // hal tussen toren en blok (DSM 16–17)
const PATIO = 3.5; // patio met ronde daklichten (DSM 3–4)
const CANOPY = 1.4; // luifel langs de noordwestgevel (DSM 1,4 op 1,5–2,5 m buiten de gevel)
const SOFFIT = 2.5; // onderkant van de verdiepingen boven de zuilengalerij en de gang (geschat, twee lagen)
// Installaties op de laagbouw (3D BAG LoD2.2, AHN5): [u0, v0, u1, v1, bovenkant NAP]
const PLANT = [
  [27.7, -0.7, 40.7, 1.2, 23.3],
  [29.5, -6.9, 38.5, -4.9, 23.15],
  [27.3, -8.8, 38.5, -6.9, 21.95],
  [38.9, -4.9, 40.6, -0.6, 21.9],
  [41.4, -4.9, 47.8, 1.0, 21.85],
  [44.7, -4.9, 55.3, -3.9, 22.8],
];

// ---------- Plattegronden in (u, v), uit de BAG ----------
const NW = 12.7; // rechte noordwestgevel (BAG 12,68–12,74)
const SE = -11.1; // rechte zuidoostgevel (BAG -11,08 tot -11,09; DSM-dakrand ook voor de uitkraging)
const SE_GROUND = -4.85; // teruggezette begane grond onder de uitkraging (BAG)
const TOWER_E = -18.73; // oostgevel van de toren (BAG)
const TOWER_E_NW = -24.9; // oostrand van de toren langs de noordwestgevel (DSM)
const CROWN_V = 4.3; // grens tussen het lage torendak en de kroonzone (DSM)
// Zuidgevel van de toren: cirkelboog door de BAG-punten (afwijking < 5 cm).
const ARC_C = [-12.79, 48.77], ARC_R = 67.04;
const arcPt = (deg, r = ARC_R) => [ARC_C[0] + r * Math.cos((deg * Math.PI) / 180), ARC_C[1] + r * Math.sin((deg * Math.PI) / 180)];
const ARC_FROM = -138.0, ARC_TO = -95.08; // westpunt (-62,63, 3,93) tot oosthoek (-18,73, -18,04)
const arc = Array.from({ length: 19 }, (_, k) => arcPt(ARC_FROM + ((ARC_TO - ARC_FROM) * k) / 18));
const TOWER = [[-56.99, NW], [-59.05, 4.51], [-62.86, 4.51], ...arc, [TOWER_E, CROWN_V], [TOWER_E_NW, CROWN_V], [TOWER_E_NW, NW]];
// Noordwestgevel van de laagbouw: cirkelboog (straal 178,9 m) die bij u = -12,6 aan de rechte gevel raakt.
const NW_C = [-12.55, -166.53], NW_R = 178.91;
const nwArc = (u) => [u, NW_C[1] + Math.sqrt(NW_R ** 2 - (u - NW_C[0]) ** 2)];
const NW_ARC = Array.from({ length: 25 }, (_, k) => nwArc(-12.6 + ((60.9 + 12.6) * k) / 24));
// Noordoostkop: de verdiepingen eindigen afgerond bij u = 64 (DSM); de BAG-punt tot u = 68 ligt op maaiveld.
const NOSE = [[62.8, -4.25], [63.8, -5.6], [64.1, -8.0], [63.6, -10.0], [62.3, -10.95], [61.5, SE]];
const PODIUM_UP = [
  [TOWER_E_NW, NW], ...NW_ARC, ...NOSE, [2.06, SE], [2.06, -10.91], [-3.93, -10.72], [-3.96, -7.79], [-9.91, -7.86],
  [-10.45, -3.91], [-18.75, -3.99], [TOWER_E, CROWN_V], [TOWER_E_NW, CROWN_V],
];
// Begane grond: zelfde contour, maar vanaf u = 38,46 teruggezet tot v = -4,85 (BAG).
const PODIUM_GROUND = [
  [TOWER_E_NW, NW], ...NW_ARC, [63.6, -3.55], [63.6, SE_GROUND], [38.46, SE_GROUND], [38.46, SE], [2.06, SE], [2.06, -10.91], [-3.93, -10.72],
  [-3.96, -7.79], [-9.91, -7.86], [-10.45, -3.91], [-18.75, -3.99], [TOWER_E, CROWN_V], [TOWER_E_NW, CROWN_V],
];
const BLOCK_POLY = rect(-5.2, -11.0, 3.3, 6.0); // DSM-randen; de 3D BAG legt dit blok 2,5 m westelijker
const HALL_POLY = rect(TOWER_E - 0.05, -3.95, -11.2, 3.3);
const PATIO_POLY = rect(TOWER_E - 0.05, -4.5, -13.0, 1.8);

// ---------- Lagen ----------
// Begane grond 7,5 m (tot de onderkant van de galerij), daarna 19 lagen van 3,537 m tot het torendak.
const STOREY = (TOWER_ROOF - SOFFIT) / 19;
const FLOOR = (k) => [z(SOFFIT) + STOREY * (k - 1), STOREY];
const floors = (k0, k1) => Array.from({ length: k1 - k0 + 1 }, (_, i) => FLOOR(k0 + i));
const CROWN_FLOORS = [[z(TOWER_ROOF), 3.6], [z(TOWER_ROOF) + 3.6, 3.4]];

// ---------- Massa's ----------
const tower = prism(TOWER, BASE, z(TOWER_ROOF)).subtract(prism(rect(-57.6, 10.7, -55.2, NW + 1), z(20.63), z(TOWER_ROOF) + 1));
const crownPoly = new CrossSection([ccw(TOWER)]).intersect(new CrossSection([rect(-70, -30, 0, CROWN_V)]));
const crown = Manifold.extrude(crownPoly, z(CROWN) - z(TOWER_ROOF) + 0.1).translate([0, 0, z(TOWER_ROOF) - 0.1]);
const rim = Manifold.extrude(crownPoly.subtract(crownPoly.offset(-1.2, "Miter")).intersect(new CrossSection([rect(-70, -30, 0, CROWN_V - 1.2)])), z(CROWN_RIM) - z(CROWN) + 0.1)
  .translate([0, 0, z(CROWN) - 0.1]);
const podium = union([
  prism(PODIUM_GROUND, BASE, z(PODIUM)),
  prism(PODIUM_UP, z(SOFFIT), z(PODIUM)),
]).subtract(union([prism(HALL_POLY, z(HALL), z(PODIUM) + 1), prism(PATIO_POLY, z(PATIO), z(PODIUM) + 1)]));
// Uitkraging boven de gang aan de zuidoostkant: kraag onder 45° van de teruggezette gevel naar de rand.
const DEPTH_SE = SE_GROUND - SE;
const seKraag = Manifold.hull([
  ...[38.46, 64.5].flatMap((u) => [[u, SE_GROUND + 0.05, z(SOFFIT) - DEPTH_SE], [u, SE - 0.3, z(SOFFIT) + 0.3], [u, SE_GROUND + 0.05, z(SOFFIT) + 0.5], [u, SE - 0.3, z(SOFFIT) + 0.5]]),
]).intersect(prism(PODIUM_UP, BASE, z(PODIUM)));
const cyl = (c, r, z0, z1, n = 20) => Manifold.cylinder(z1 - z0, r, r, n).translate([c[0], c[1], z0]);
const seColumns = [42.5, 50.5, 58.5].map((u) => cyl([u, SE + 0.7], 0.5, BASE, z(SOFFIT) + 0.2));
const block = prism(BLOCK_POLY, z(PODIUM) - 0.1, z(BLOCK));
const plant = PLANT.map(([u0, v0, u1, v1, top]) => prism(rect(u0, v0, u1, v1), z(PODIUM) - 0.1, z(top)));

// Zuilengalerij onder de gebogen zuidgevel: begane grond 4 m teruggezet, plafond met een kraag onder 45°
// naar de gevel op +2,5 m, zes ronde kolommen van 1,2 m op 0,9 m achter de gevellijn en een houten erker.
const RECESS = 4.0;
const ringProfile = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), 720).translate([ARC_C[0], ARC_C[1], 0]);
const sector = (a0, a1, r = 90) => prism([ARC_C, ...Array.from({ length: 9 }, (_, k) => arcPt(a0 + ((a1 - a0) * k) / 8, r))], BASE - 2, 200);
const GALLERY_FROM = -134.5, GALLERY_TO = -94.0;
const colonnadeCut = ringProfile([[ARC_R - RECESS, BASE - 1], [ARC_R + 1, BASE - 1], [ARC_R + 1, z(SOFFIT) + 1], [ARC_R - RECESS, z(SOFFIT) - RECESS]])
  .intersect(sector(GALLERY_FROM, GALLERY_TO));
const colAngles = [-131, -124.5, -118, -111.5, -105, -98.5];
const columns = colAngles.map((a) => cyl(arcPt(a, ARC_R - 0.9), 0.6, BASE, z(SOFFIT) + 0.2));
const erker = prism(
  [...Array.from({ length: 5 }, (_, k) => arcPt(-110.4 + 4.3 * k / 4, ARC_R - RECESS - 0.2)), ...Array.from({ length: 5 }, (_, k) => arcPt(-106.1 - 4.3 * k / 4, ARC_R - 1.0))],
  BASE, z(0.5),
);

// Lijst (op dakhoogte van de laagbouw, 1,4 m uit de gevel) en luifel (vlak boven de weg, 2,7 m uit de
// gevel) langs de hele noordwestgevel, elk met een kraag onder 45°.
const NW_LINE = [[-56.99, NW], ...NW_ARC];
function ledge(line, out, top, thick) {
  const parts = [];
  for (let i = 0; i + 1 < line.length; i++) {
    const a = line[i], b = line[i + 1];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [-d[1], d[0]]; // links = buiten (noordwest)
    const P = (s, t, h) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t, h];
    const s0 = i === 0 ? 0 : -0.3, s1 = L + 0.3;
    parts.push(Manifold.hull([s0, s1].flatMap((s) => [P(s, -0.3, top), P(s, out, top), P(s, out, top - thick), P(s, -0.3, top - thick - out - 0.3)])));
  }
  return union(parts);
}
const cornice = ledge(NW_LINE, 1.4, z(CORNICE), 1.0);
const canopy = ledge(NW_LINE.filter(([u]) => u < 58.5), 2.7, z(CANOPY), 1.5);

let body = union([tower, crown, rim, podium, seKraag, block, ...plant]).subtract(colonnadeCut);
body = union([body, ...columns, ...seColumns, erker, cornice, canopy]);

// ---------- Gevelreliëf ----------
// Per laag een doorlopende raamband (de lintramen op de foto's) als blinde nis van 0,35 m met een plafond
// onder 45°: borstwering 1,2 m, latei 0,5 m. Alleen waar de gevel buitengevel is (straaltest).
const DEPTH = 0.35;
const cuts = [];
function bands(poly, floorList, { sill = 1.2, header = 0.5 } = {}) {
  const ring = ccw(poly);
  const m = ring.length;
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % m];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 1.0) return;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]]; // rechts = buiten bij linksom
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    // Doorlopend over flauwe knikken (< 20°), anders 0,95 m hoek laten staan.
    const turn = (p, q, r) => {
      const t1 = Math.atan2(q[1] - p[1], q[0] - p[0]), t2 = Math.atan2(r[1] - q[1], r[0] - q[0]);
      return Math.abs(((t2 - t1 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) * 180 / Math.PI;
    };
    const prev = ring[(i - 1 + m) % m], next = ring[(i + 2) % m];
    const m0 = turn(prev, a, b) < 20 ? -0.15 : 0.95, m1 = turn(a, b, next) < 20 ? -0.15 : 0.95;
    const sA = m0, sB = L - m1;
    if (sB - sA < 0.9) return;
    for (const [zf, fh] of floorList) {
      const lo = zf + sill, hi = zf + fh - header - DEPTH;
      if (hi - lo < 0.9) continue;
      const exposed = (s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      });
      const steps = Math.max(1, Math.ceil((sB - sA) / 0.5));
      let start = null, last = null;
      const flush = () => {
        if (start !== null && last - start >= 0.9) cuts.push(Manifold.hull([P(start, -0.2, lo), P(last, -0.2, lo), P(start, DEPTH, lo), P(last, DEPTH, lo), P(start, -0.2, hi + DEPTH + 0.2), P(last, -0.2, hi + DEPTH + 0.2), P(start, DEPTH, hi), P(last, DEPTH, hi)]));
        start = null;
      };
      for (let k = 0; k <= steps; k++) {
        const s = sA + ((sB - sA) * k) / steps;
        if (exposed(Math.min(Math.max(s, 0.05), L - 0.05))) { if (start === null) start = s; last = s; } else flush();
      }
      flush();
    }
  });
}
bands(TOWER, floors(1, 19));
bands(crownPoly.toPolygons()[0], CROWN_FLOORS);
bands(PODIUM_UP, floors(1, 5));
// Begane grond aan de zuidoostgevel: één hoge glasband.
bands([[2.06, SE], [38.46, SE], [38.46, SE + 1], [2.06, SE + 1]], [[0, z(SOFFIT)]], { sill: 1.0, header: 1.2 });
bands(BLOCK_POLY, floors(6, 6));
bands(HALL_POLY, floors(1, 4));

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Pharos: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Pharos", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [[`building:${slug}-pharos`, building]],
  catalog: {
    name: "Pharos Hoofddorp",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 38.15, // NAP -5,0 + geoïde NLGEO2018 43,15 (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[0, -20], [25, -17], [50, -17], [60, -22]],
    replacesBuildings: ["NL.IMBAG.Pand.0394100000242475"],
    description:
      "Pharos aan het Mercuriusplein bij station Hoofddorp (KPF, 2003): een torenwig met een rechte noordwestgevel en een cirkelvormige zuidgevel (straal 67 m) tot NAP +69,7 m, met een kroonzone tot +76,6 m en een gebogen kroonrand tot +77,3 m, een zuilengalerij van zes kolommen onder de zuidgevel tot +2,5 m met een erker, en een lensvormige laagbouw van vijf lagen tot +20,6 m (gebogen noordwestgevel, straal 179 m) met een 6 m uitkragende kop op drie kolommen, een hoger blok tot +25,55 m en een hal tot +16,5 m met een patio. Langs de hele noordwestgevel een lijst op +21,3 m en een luifel op +1,4 m, op de laagbouw de installaties uit de 3D BAG en per laag een doorlopende raamband. Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG. Oorsprong midden in de BAG-contour, X-as langs de noordwestgevel (48,0° op RD-oost). Geschat: verdiepingshoogte, raambanden, de hoogte en diepte van de zuilengalerij, de kolommen onder de kop, de erker en de vorm van de kroon (een stalen kader boven installaties, als dicht blok).",
    realWorld: {
      groundNapM: GROUND,
      towerRoofNapM: TOWER_ROOF,
      crownNapM: [CROWN, CROWN_RIM],
      podiumNapM: PODIUM,
      corniceNapM: CORNICE,
      blockNapM: BLOCK,
      hallNapM: HALL,
      patioNapM: PATIO,
      canopyNapM: CANOPY,
      galleryUndersideNapM: SOFFIT,
      southFacadeRadiusM: ARC_R,
      northwestFacadeRadiusM: NW_R,
      floors: 19,
      storeyHeightM: +STOREY.toFixed(3),
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0394100000242475 (bouwjaar 2003, Mercuriusplein 1-23), actuele orthoHR, AHN-DSM en -DTM 0,5 m (AHN4), 3D BAG LoD2.2 (AHN5 2023)",
      "https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0394100000242475",
      "https://skyscraperpage.com/b5526",
      "https://www.skyscrapercenter.com/building/pharos/6660",
      "https://commons.wikimedia.org/wiki/File:Pharos_toren,_Van_Heuven-Goedhartlaan_pic1.jpg",
      "https://commons.wikimedia.org/wiki/File:Pharos_toren,_Van_Heuven-Goedhartlaan_pic2.jpg",
    ],
  },
});
