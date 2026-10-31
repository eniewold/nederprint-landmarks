// Haasje Over (Strijp-S, Eindhoven, 2021, VMX Architects voor Trudo): woontoren van 19 lagen in rood
// gepigmenteerde prefab-beton met een open kroon van zonnepanelen, en een dubbele glazen arm van twee
// lagen die op 12 m hoogte over de oude Philipshal met de skatebaan heen loopt (U-vorm rond een patio).
// Op de tiende verdieping loopt een stalen vakwerkbrug naar het dak van gebouw Anton.
// De BAG-taak heet "Woontoren Veemstraat"; het pand 0772100001026060 is Haasje Over (toren + arm).
// De hal uit 1958 (pand 0772100000303079) zit in de PDOK-reconstructie met de arm erin (blok tot
// NAP +38,6 m, 0,3 m buiten de armgevel); daarom vervangt dit model ook die hal, met zijn zaagtanddak.
// Contouren uit de BAG, hoogtes uit het AHN4-DSM en de 3D BAG (AHN5), gevelindeling uit foto's.
import { CrossSection, Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "veemstraat-strijp-s";
// Gebouwstelsel: u langs de lange armgevels naar het noordoosten (61,82° op RD-oost, BAG-randen 5 en 7
// evenwijdig), v 90° linksom (naar het noordwesten). Oorsprong in het hart van de torencontour.
const ORIGIN = [159726.94, 384339.05];
const AXIS = [0.4723, 0.8815];
const GROUND = 18.42; // NAP, 3D BAG-maaiveld (AHN-DTM rondom 18,29–19,01, mediaan 18,47)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const TOWER_ROOF = 91.51; // dakrand toren (AHN4-DSM, mediaan 91,51 binnen de contour)
const CROWN_TOP = 98.02; // bovenkant zonnepanelenkroon (3D BAG LoD2.2, AHN5: 98,01–98,03)
const STOREY = 3.65; // 14 woonlagen boven de arm plus een dichte bovenrand (foto zuidoostgevel)
const FLOORS = 14;
const COMMON = 4; // vijfde laag boven de arm: gemeenschappelijke glazen verdieping met de luchtbrug
const ARM_ROOF = 38.52; // dak van de arm (AHN4 38,51–38,52; 3D BAG 38,47–38,59)
const ARM_BOTTOM = 30.2; // onderkant van de arm en van de glazen band om de toren (foto, geschat)
const DECK = 31.5; // dekken aan beide kopse kanten van de patio (AHN4 31,49–31,50)
const HALL_ROOF = 26.55; // plat dak van de hal en dalen van de zaagtanden (AHN4 26,50–26,60)
const SAW_TOP = 28.6; // toppen van de zaagtanden (AHN4 28,4–28,6; 3D BAG tot 28,6–28,9)
const PLINTH_TOP = 21.6; // glazen begane grond onder de rode sokkel (foto, geschat)
const BRIDGE_BOTTOM = 52.4; // vakwerkbrug naar Anton (foto: ter hoogte van de glazen tiende verdieping)
const BRIDGE_TOP = 56.4;
const ANTON_ROOF = 51.3; // dak van gebouw Anton waar de brug landt (3D BAG 51,07–51,48)

// ---------- Plattegronden in (u, v), BAG ----------
const T = { u0: -11.32, u1: 11.42, v0: -15.05, v1: 15.05 }; // toren 22,74 × 30,10 m
const ARM = { u0: T.u1, u1: 69.16, v0: -15.05, v1: 15.05 }; // arm 57,74 m lang
const PATIO = { u0: T.u1, u1: 60.73, v0: -6.7, v1: 6.7 }; // 3D BAG-dakvlak rond de patio
const PIT = { u0: 16.0, u1: 49.5 }; // patio open tot op het haldak (AHN4), daarbuiten de dekken
const HALL = { u0: 17.92, u1: 58.3, v0: -93.2, v1: 21.55 }; // hal uit 1958, BAG vereenvoudigd (knikjes < 0,9 m)
const NECK = 2.0; // onderbouw onder de arm 2 m teruggezet, met een kraag onder 45°
const BRIDGE = { u0: -31.0, v0: T.v0, v1: -7.8 }; // breedte uit het DSM, landt 1 m over de dakrand van Anton
const ANTON_FACE = -30.0;

// Zaagtanden van de hal: periode 5,0 m, stijgend naar het noordoosten met een verticale lichtstrook.
const TEETH = Array.from({ length: 6 }, (_, k) => ({ u0: 28.6 + 5 * k, u1: 32.3 + 5 * k, v0: k < 5 ? -90.7 : -30.7, v1: -15.3 }));

// ---------- Kroon ----------
const CANOPY_OUT = 1.0; // paneelrand steekt 1,0 m buiten de gevel (foto's)
const CANOPY_EDGE = 1.0; // dikte van de paneelrand
const CORE_IN = 3.0; // installatiekern onder de panelen, 3 m achter de gevel
const POST = 0.9;
const HOLE = rect(-3.0, -2.6, 2.6, 10.4); // opening in het paneelveld rond de gevelonderhoudsinstallatie (luchtfoto)

const DEPTH = 0.35;
const box = (r, z0, z1) => prism(rect(r.u0, r.v0, r.u1, r.v1), z0, z1);
const ringPts = (r) => [[r.u0, r.v0], [r.u1, r.v0], [r.u1, r.v1], [r.u0, r.v1]];

// Gevelvlak van a naar b (linksom), naar buiten gericht; P(s, d, h) met d positief naar binnen.
function face(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h] };
}
const faces = (pts) => pts.map((a, i) => face(a, pts[(i + 1) % pts.length]));
// Blinde nis van s0 tot s1, van lo tot top op de gevel, met een plafond onder 45°.
function niche(F, s0, s1, lo, top, depth = DEPTH) {
  const hi = top - depth;
  return Manifold.hull([
    F.P(s0, -0.2, lo), F.P(s1, -0.2, lo), F.P(s0, depth, lo), F.P(s1, depth, lo),
    F.P(s0, -0.2, hi + depth + 0.2), F.P(s1, -0.2, hi + depth + 0.2), F.P(s0, depth, hi), F.P(s1, depth, hi),
  ]);
}
// Blinde nis met een willekeurige convexe vorm [[s, h], ...]: voorkant 0,55 m hoger dan de achterkant.
const nichePoly = (F, poly, depth = DEPTH) =>
  Manifold.hull([...poly.map(([s, h]) => F.P(s, depth, h)), ...poly.map(([s, h]) => F.P(s, -0.2, h + depth + 0.2))]);
// Ligt de gevel op deze plek vrij? Horizontale straal van 3 m buiten de gevel naar binnen.
function exposed(body, F, s0, s1, lo, top) {
  return [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, top - 0.05].every((h) => {
    const from = F.P(s, -3, h), hit = body.rayCast(from, F.P(s, 1, h))[0];
    const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
    return at > 2.95 && at < 3.05;
  }));
}
// Vaste pseudowillekeur voor het verspringende vensterpatroon (zoals op de foto's).
const rnd = (a, b, c) => { const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return x - Math.floor(x); };

// ================= Toren met kroon en luchtbrug =================
const towerRing = ringPts(T);
const bridgeBox = prism(rect(BRIDGE.u0, BRIDGE.v0, T.u0 + 0.1, BRIDGE.v1), z(BRIDGE_BOTTOM), z(BRIDGE_TOP));
const bridgeAnchor = prism(rect(BRIDGE.u0, BRIDGE.v0, ANTON_FACE, BRIDGE.v1), z(ANTON_ROOF) - 0.3, z(BRIDGE_TOP));

// Kroon: installatiekern 3 m achter de gevel, palen op de hoeken en de traveelijnen, en een paneelrand
// die 1,0 m buiten de gevel steekt met een onderkant onder 45° naar de kern.
const coreR = { u0: T.u0 + CORE_IN, u1: T.u1 - CORE_IN, v0: T.v0 + CORE_IN, v1: T.v1 - CORE_IN };
const outR = { u0: T.u0 - CANOPY_OUT, u1: T.u1 + CANOPY_OUT, v0: T.v0 - CANOPY_OUT, v1: T.v1 + CANOPY_OUT };
const edgeBottom = z(CROWN_TOP) - CANOPY_EDGE;
const kraag = (CANOPY_OUT + CORE_IN) * 1.05; // iets steiler dan 45°
const canopy = Manifold.hull([
  ...ringPts(outR).map(([u, v]) => [u, v, z(CROWN_TOP)]),
  ...ringPts(outR).map(([u, v]) => [u, v, edgeBottom]),
  ...ringPts(coreR).map(([u, v]) => [u, v, edgeBottom - kraag]),
]);
const crownCore = box(coreR, z(TOWER_ROOF) - 0.1, z(CROWN_TOP));
const posts = [];
for (const F of faces(towerRing)) {
  const bays = Math.round(F.L / 7.55);
  for (let k = 0; k <= bays; k++) {
    const s = Math.min(Math.max((k * F.L) / bays - POST / 2, 0), F.L - POST);
    posts.push(Manifold.hull([F.P(s, 0, z(TOWER_ROOF) - 0.1), F.P(s + POST, 0, z(TOWER_ROOF) - 0.1), F.P(s, POST, z(TOWER_ROOF) - 0.1), F.P(s + POST, POST, z(TOWER_ROOF) - 0.1),
      F.P(s, 0, edgeBottom + 0.3), F.P(s + POST, 0, edgeBottom + 0.3), F.P(s, POST, edgeBottom + 0.3), F.P(s + POST, POST, edgeBottom + 0.3)]));
  }
}
const towerSolid = union([prism(towerRing, BASE, z(TOWER_ROOF)), crownCore, canopy, ...posts, bridgeBox, bridgeAnchor]);

// ================= Arm, onderbouw en hal =================
const neckR = { u0: ARM.u0, u1: ARM.u1 - NECK, v0: ARM.v0 + NECK, v1: ARM.v1 - NECK };
const neckTop = z(ARM_BOTTOM) - NECK * 1.05;
const neck = union([
  box(neckR, BASE, neckTop + 0.01),
  Manifold.hull([...ringPts(neckR).map(([u, v]) => [u, v, neckTop]), ...ringPts(ARM).map(([u, v]) => [u, v, z(ARM_BOTTOM)])]),
]);
const teeth = TEETH.map((t) => Manifold.hull([t.v0, t.v1].flatMap((v) => [[t.u0, v, z(HALL_ROOF) - 0.1], [t.u1, v, z(HALL_ROOF) - 0.1], [t.u1, v, z(SAW_TOP)]])));
const hall = union([box(HALL, BASE, z(HALL_ROOF)), ...teeth]);
const armMass = union([box(ARM, z(ARM_BOTTOM) - 0.01, z(ARM_ROOF)), neck, hall]);
const patio = union([
  box({ ...PATIO, u0: PATIO.u0 - 0.5 }, z(DECK), z(ARM_ROOF) + 1),
  box({ ...PATIO, u0: PIT.u0, u1: PIT.u1 }, z(HALL_ROOF), z(ARM_ROOF) + 1),
]);
const armSolid = armMass.subtract(patio);

// ================= Gevelreliëf =================
const all = union([towerSolid, armSolid]);
const towerCuts = [], armCuts = [];
const towerFaces = faces(towerRing); // 0 zuidoost, 1 noordoost (arm), 2 noordwest, 3 zuidwest (luchtbrug)
towerFaces.forEach((F, fi) => {
  const bays = Math.round(F.L / 7.55), pitch = F.L / bays;
  for (let b = 0; b < bays; b++) {
    const b0 = b * pitch, b1 = b0 + pitch;
    if (fi !== 1) {
      // Begane grond: glaspui tussen kolommen van 0,9 m op de traveelijnen, 0,6 m diep.
      towerCuts.push(niche(F, b0 + (b === 0 ? POST : POST / 2), b1 - (b === bays - 1 ? POST : POST / 2), -0.5, z(PLINTH_TOP) - 0.6, 0.6));
      // Glazen band ter hoogte van de arm: twee lagen, per travee twee ramen.
      for (const f0 of [z(ARM_BOTTOM), (z(ARM_BOTTOM) + z(ARM_ROOF)) / 2]) {
        const fh = (z(ARM_ROOF) - z(ARM_BOTTOM)) / 2, w = (pitch - 3 * POST) / 2;
        for (const s0 of [b0 + POST, b0 + 2 * POST + w]) towerCuts.push(niche(F, s0, s0 + w, f0 + 0.5, f0 + fh - 0.5));
      }
    }
    // Woonlagen: per travee één venster van 5,0 m (glas plus dicht paneel), verspringend links of rechts,
    // ongeveer een op de drie travees dicht; de gemeenschappelijke laag is rondom glas.
    for (let k = 0; k < FLOORS; k++) {
      const f0 = z(ARM_ROOF) + k * STOREY;
      let s0, s1, lo, top;
      if (k === COMMON) [s0, s1, lo, top] = [b0 + POST / 2 + 0.1, b1 - POST / 2 - 0.1, f0 + 0.45, f0 + STOREY - 0.45];
      else {
        if (rnd(fi, k, b) > 0.7) continue;
        const left = rnd(fi + 7, k, b) < 0.5;
        s0 = left ? b0 + 0.8 : b1 - 0.8 - 5.0;
        s1 = s0 + 5.0;
        [lo, top] = [f0 + 0.95, f0 + 0.95 + 2.2];
      }
      if (exposed(all, F, s0, s1, lo, top)) towerCuts.push(niche(F, s0, s1, lo, top));
    }
  }
});
// Arm: twee glazen lagen met stijlen van 0,9 m op 3,6 m, rondom en in de patio.
const armFaces = [
  ...faces(ringPts(ARM)).slice(0, 3), // zuidoost, noordoost (kop), noordwest
  ...faces([[PATIO.u0, PATIO.v1], [PATIO.u1, PATIO.v1], [PATIO.u1, PATIO.v0], [PATIO.u0, PATIO.v0]]).filter((_, i) => i !== 3), // patiowanden
];
for (const F of armFaces) {
  const n = Math.floor((F.L - 0.9) / 3.6), w0 = (F.L - n * 3.6) / 2;
  for (const f0 of [z(ARM_BOTTOM), (z(ARM_BOTTOM) + z(ARM_ROOF)) / 2]) {
    const fh = (z(ARM_ROOF) - z(ARM_BOTTOM)) / 2;
    for (let k = 0; k < n; k++) {
      const s0 = w0 + k * 3.6 + 0.45, s1 = s0 + 2.7, lo = f0 + 0.6, top = f0 + fh - 0.55;
      if (exposed(all, F, s0, s1, lo, top)) armCuts.push(niche(F, s0, s1, lo, top));
    }
  }
}
// Hal: vensters van 3,0 m op 5,0 m in de oude gevel (geschat), alleen waar de gevel vrij ligt.
for (const F of faces(ringPts(HALL))) {
  const n = Math.floor((F.L - 2) / 5.0), w0 = (F.L - n * 5.0) / 2;
  for (let k = 0; k < n; k++) {
    const s0 = w0 + k * 5.0 + 1.0, s1 = s0 + 3.0;
    if (exposed(all, F, s0, s1, 1.0, 5.5)) armCuts.push(niche(F, s0, s1, 1.0, 5.5));
  }
}
// Luchtbrug: vakwerk als driehoekige nissen tussen regels van 0,9 m, aan beide zijden.
const bridgeLen = T.u0 - ANTON_FACE, panels = 5, P = bridgeLen / panels;
const bh0 = z(BRIDGE_BOTTOM) + POST, bh1 = z(BRIDGE_TOP) - POST;
const tri = (pts) => new CrossSection([pts]).offset(-0.45, "Miter").toPolygons()[0];
for (const F of [face([ANTON_FACE, BRIDGE.v0], [T.u0, BRIDGE.v0]), face([T.u0, BRIDGE.v1], [ANTON_FACE, BRIDGE.v1])]) {
  for (let k = 0; k < panels; k++) {
    const up = tri([[k * P, bh0], [(k + 1) * P, bh0], [(k + 0.5) * P, bh1]]);
    towerCuts.push(nichePoly(F, up));
    if (k > 0) towerCuts.push(nichePoly(F, tri([[(k - 0.5) * P, bh1], [k * P, bh0], [(k + 0.5) * P, bh1]])));
  }
}

const tower = towerSolid.subtract(union(towerCuts)).subtract(Manifold.extrude(new CrossSection([HOLE]), z(CROWN_TOP) - z(TOWER_ROOF) + 1).translate([0, 0, z(TOWER_ROOF)]));
const arm = armSolid.subtract(union(armCuts));

const nodes = [
  [`building:${slug}-toren`, tower],
  [`building:${slug}-arm-en-skatehal`, arm],
];
for (const [name, m] of nodes) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "nissen", name.endsWith("toren") ? towerCuts.length : armCuts.length);
}

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Haasje Over",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 62.34, // NAP 18,42 + geoïde 43,92 (NLGEO2018 ter plekke); PDOK-voet van het pand 62,33–62,34
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0772100001026060", "NL.IMBAG.Pand.0772100000303079"],
    description:
      "Haasje Over op Strijp-S (VMX Architects, 2021; in de werklijst 'Woontoren Veemstraat'): rode toren van 22,7 × 30,1 m op de BAG-contour tot NAP +91,51 m met 14 woonlagen van 3,65 m boven de arm, per travee van 7,5 m één verspringend venster als blinde nis, een rondom glazen gemeenschappelijke laag, een glazen band van twee lagen ter hoogte van de arm, een rode sokkel en een glazen begane grond tussen kolommen. Kroon tot +98,02 m: installatiekern 3 m achter de gevel, palen op de hoeken en traveelijnen en een paneelrand die 1,0 m buiten de gevel steekt met een onderkant onder 45°, met de opening rond de gevelinstallatie. Dubbele glazen arm (57,7 m, +30,2 tot +38,52 m) in U-vorm rond een patio die tot op het haldak open is, met dekken op +31,5 m aan beide koppen; daaronder een onderbouw 2 m teruggezet met een kraag onder 45°. De hal uit 1958 (pand 0772100000303079) wordt mee vervangen omdat de PDOK-reconstructie de arm bevat: blok tot +26,55 m met zes zaagtanden tot +28,6 m. Stalen vakwerkbrug (+52,4 tot +56,4 m) van de zuidwestgevel naar het dak van Anton. Oorsprong in het hart van de torencontour, X-as langs de armgevels (61,82° op RD-oost). Hoogtes uit AHN4 en 3D BAG; onderkant van de arm, lagenindeling, vensterpatroon, kroonopbouw, brughoogte en de hallevensters zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      towerRoofNapM: TOWER_ROOF,
      crownTopNapM: CROWN_TOP,
      armRoofNapM: ARM_ROOF,
      armBottomNapM: ARM_BOTTOM,
      patioDeckNapM: DECK,
      hallRoofNapM: HALL_ROOF,
      sawtoothTopNapM: SAW_TOP,
      bridgeNapM: [BRIDGE_BOTTOM, BRIDGE_TOP],
      towerFootprintM: [22.74, 30.1],
      armLengthM: 57.74,
      storeys: 19,
      storeyHeightM: STOREY,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0772100001026060 (2021) en 0772100000303079 (1958), actuele orthoHR, AHN4-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (AHN5 2024), PDOK 3D-gebouwtegels",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Eindhoven",
      "https://divisare.com/projects/512191-vmx-architects-marcel-van-der-burg-haasje-over",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Haasje_Over_in_Eindhoven.jpg",
      "https://commons.wikimedia.org/wiki/File:Nieuwbouw_in_de_Eindhovense_wijk_Strijp-S.jpg",
      "https://commons.wikimedia.org/wiki/File:Haasje-2021.jpg",
    ],
  },
});
