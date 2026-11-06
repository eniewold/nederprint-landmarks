// Watertoren Sint Philipsland (Tholen, Zeeland), gebouwd in 1925 naar een ontwerp van H. Sangster; volgens Wikipedia 27,7 m
// hoog met een reservoir van 125 m³. Een betonnen toren in een expressionistische vorm: een vierkant met brede afgeschuinde
// hoeken, een rechte schacht, een reservoirdeel dat een kleine 0,3 m uitkraagt op getrapte consoles, en een laag achtzijdig
// tentdak met koperen platen. Op het midden van de vier hoofdgevels loopt een lisene van de voet tot een console-blok onder
// het reservoir; vanaf dat blok trapt de onderkant van het reservoir naar de hoeken omhoog. Op de vier afgeschuinde hoeken
// loopt over de hele hoogte een smalle sleuf (met kleine lichtopeningen), op het reservoirdeel tussen twee ribben die tot in
// de dakrand doorsteken.
//
// BAG-pand 0716100000282375 (bouwjaar 1930 in de BAG, 38 m²) is de toren. Zijn contour is een vierkant met afgeschuinde
// hoeken: hoofdgevels met normalen -22,1, 67,8, 161,1 en -111,8 graden en apothema 3,2 tot 3,48 m (gemiddeld 3,37),
// hoekvlakken van 2,1 tot 2,4 m breed met normalen 20,9, 113,2, -152,7 en -67,1 graden en apothema 3,5 tot 3,82 m
// (gemiddeld 3,61). Gemiddeld ligt het stelsel op -21,4 graden; de achthoekfit op het dak in het AHN-DSM geeft -22,5 tot
// -18. Oorsprong op het hart van de contour en het dak [70815.2, 404033.95] (BAG-gemiddelde [70815.15, 404033.96],
// DSM-fit [70815.2 à 70815.3, 404033.9]); +X is de normaal van de oostzuidoostgevel op RD -21,5 graden.
//
// Hoogtes uit het AHN (2026-11-06): maaiveld NAP +1,71 tot 1,86 rond de voet (DTM, 5 tot 6 m van het hart); dak van NAP
// +29,42 in het midden tot 27,8 à 28,1 op 3 m van het hart langs de hoofdgevels, een gelijkmatige helling van 27 à 28
// graden zonder knik (3D BAG: nok 29,30, dak 27,78 tot 29,39). PDOK-terrein op de groundSamplePoints ellipsoïdisch 45,859
// tot 45,941; het verschil met het AHN-DTM is 44,05 tot 44,15, dus z = 0 ligt op NAP +1,76 en de top op 27,7 m.
//
// De opstand uit de Commons-foto's "Sint Philipsland 6521.JPG" (2005), "Sint Philipsland, de watertoren foto6
// 2015-05-24 14.39.jpg" en "Overzicht watertoren - Sint Philipsland - 20352486 - RCE.jpg" (2002): het reservoirdeel is
// circa 10 % breder dan de schacht; onderkant van het reservoir 18,1 m bij de hoeken, 17,55 m in een tussentrede en 17,0 m
// onder het console-blok (2,0 m breed, tot 19,1 m); lisene 0,9 m breed; sleuf circa 0,5 m, ribben circa 0,3 m. Deze maten
// zijn met de fotoschaal (tophoogte uit het AHN) geschat.
//
// Printbaar op 1:1000 zonder steun: de uitkraging van het reservoir, de trede, het console-blok en de ribben hebben een
// onderkant van 47 graden naar de schacht; sleuven en deur zijn blinde nissen met een plafond van 63 graden; het dak loopt
// naar binnen.
import { Manifold, hull, union, prism, place, ring3, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [70815.2, 404033.95];
const DEG = -21.5;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const T47 = Math.tan((47 * Math.PI) / 180); // ondervlakken onder 47 graden: net steiler dan de printhoek
const GEOID = 44.1; // ellipsoïdisch min NAP hier (PDOK-terrein min AHN-DTM op vijf tot zes meter: 44,05 tot 44,15)
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: (5,5, 0) 45,941, (0, 5,5)
// 45,859, (-5,5, 0) 45,894, (0, -5,5) 45,897. Het PDOK-pand staat op 45,72.
const GROUND_ELLIPSOID = 45.859;
const GROUND_SAMPLES = [[5.5, 0], [0, 5.5], [-5.5, 0], [0, -5.5]];
const NAP0 = +(GROUND_ELLIPSOID - GEOID).toFixed(2); // NAP-hoogte van z = 0: +1,76

// ---------- plattegrond: vierkant met afgeschuinde hoeken ----------
// Vlakken met normalen op k·45 graden; apothema a voor de hoofdgevels (k even) en c voor de hoekvlakken (k oneven).
const plan = (a, c) => {
  const ap = (k) => (k % 2 === 0 ? a : c);
  const pts = [];
  for (let k = 0; k < 8; k++) {
    const t1 = (k * Math.PI) / 4, t2 = ((k + 1) * Math.PI) / 4, a1 = ap(k), a2 = ap((k + 1) % 8);
    const det = Math.cos(t1) * Math.sin(t2) - Math.sin(t1) * Math.cos(t2);
    pts.push([(a1 * Math.sin(t2) - a2 * Math.sin(t1)) / det, (Math.cos(t1) * a2 - Math.cos(t2) * a1) / det]);
  }
  return pts;
};

const A = { shaft: 3.1, tank: 3.4 }; // apothema van de hoofdgevels (BAG 3,37 gemiddeld)
const C = { shaft: 3.32, tank: 3.62 }; // apothema van de hoekvlakken (BAG 3,61 gemiddeld)
const H = {
  tankFoot: 18.1, // onderkant van het reservoir bij de hoeken (foto's)
  step: 17.55, // tussentrede (foto's)
  console: [17.0, 19.1], // console-blok boven de lisene (foto's)
  eaves: 25.95, // dakrand (AHN: 27,8 à 28,1 op 3 m van het hart, helling 27 à 28 graden)
  top: +(29.46 - NAP0).toFixed(2), // top van het tentdak (AHN NAP +29,42 à 29,52, 3D BAG-nok 29,30)
  ribTop: 26.2, // ribben naast de hoeksleuven steken door de dakrand (foto's)
};

// ---------- schacht, reservoir en dak ----------
const shaftPlan = plan(A.shaft, C.shaft), tankPlan = plan(A.tank, C.tank);
const shaft = prism(shaftPlan, BASE, H.tankFoot + 0.1);
// Uitkraging van het reservoir: 0,3 m onder 47 graden, ook langs de hoekribben (daar 0,3 / cos 22,5 graden uit).
const corbel = hull([...ring3(shaftPlan, H.tankFoot - (0.3 * T47) / Math.cos(Math.PI / 8)), ...ring3(tankPlan, H.tankFoot)]);
const tank = prism(tankPlan, H.tankFoot, H.eaves);
// Achtzijdig tentdak: vlakken van de dakrand naar de top (27 graden boven de hoofdgevels, 26 boven de hoeken).
const roof = hull([...ring3(tankPlan, H.eaves - 0.01), [0, 0, H.top]]);

// ---------- hoofdgevels: lisene, console-blok en tussentrede ----------
// In het stelsel van de gevel met normaal +X; y langs de gevel.
const slab = (x0, x1, w, zOut, zTop) => hull([
  [x1, -w, zOut], [x1, w, zOut], [x0, -w, zOut - (x1 - x0) * T47], [x0, w, zOut - (x1 - x0) * T47],
  [x1, -w, zTop], [x1, w, zTop], [x0, -w, zTop], [x0, w, zTop],
]);
const front = union([
  prism([[A.shaft - 0.1, -0.45], [A.tank, -0.45], [A.tank, 0.45], [A.shaft - 0.1, 0.45]], BASE, H.console[0] + 0.05), // lisene 0,9 m
  slab(A.shaft, A.tank + 0.12, 1.0, H.console[0], H.console[1]), // console-blok 2,0 m, 0,12 m voor de gevel
  slab(A.shaft, A.tank, 1.45, H.step, H.tankFoot + 0.1), // tussentrede 2,9 m
]);
const fronts = union([0, 90, 180, 270].map((deg) => place(front, { deg })));

// ---------- hoekvlakken: sleuf over de hele hoogte, ribben op het reservoirdeel ----------
// Blinde nis in het vlak met normaal +X op afstand f, breedte 2·w, van z0 tot z1, plafond van 63 graden naar binnen.
const niche = (f, w, z0, z1, depth = 0.3) => hull([
  [f - depth, -w, z0], [f + 0.6, -w, z0], [f - depth, w, z0], [f + 0.6, w, z0],
  [f - depth, -w, z1 + 2 * depth], [f - depth, w, z1 + 2 * depth], [f, -w, z1], [f, w, z1],
  [f + 0.6, -w, z1 - 1.2], [f + 0.6, w, z1 - 1.2],
]);
// Rib van 0,3 m breed, 0,15 m voor het hoekvlak; de onderkant loopt onder 47 graden van de schacht (onder de uitkraging) naar
// buiten, zodat hij niet onder de uitkraging uithangt.
const RIB_FOOT = H.tankFoot - (0.3 * T47) / Math.cos(Math.PI / 8);
const rib = (t0, t1) => hull([
  [C.shaft - 0.02, t0, RIB_FOOT], [C.shaft - 0.02, t1, RIB_FOOT],
  [C.tank + 0.15, t0, RIB_FOOT + (C.tank + 0.17 - C.shaft) * T47], [C.tank + 0.15, t1, RIB_FOOT + (C.tank + 0.17 - C.shaft) * T47],
  [C.tank + 0.15, t0, H.ribTop], [C.tank + 0.15, t1, H.ribTop], [C.tank - 0.05, t0, H.ribTop], [C.tank - 0.05, t1, H.ribTop],
]);
const cornerRibs = union([rib(0.25, 0.55), rib(-0.55, -0.25)]);
const cornerSlot = union([
  niche(C.shaft, 0.25, 0.6, H.tankFoot - 0.6), // schacht
  niche(C.tank, 0.25, H.tankFoot + 0.3, H.eaves - 0.6), // reservoirdeel tussen de ribben
]);
const corners = [45, 135, 225, 315];
const ribs = union(corners.map((deg) => place(cornerRibs, { deg })));
const slots = union(corners.map((deg) => place(cornerSlot, { deg })));

// ---------- deur ----------
// In de zuidzuidwestgevel (-Y, RD -111,5 graden) naast de lisene aan de westkant (luchtfoto en foto 2002): 0,9 × 2,1 m.
const door = place(niche(A.shaft, 0.45, 0, 2.1), { deg: -90 }).translate([-1.0, 0, 0]);

const all = union([shaft, corbel, tank, roof, fronts, ribs])
  .subtract(union([slots, door]))
  .trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-sint-philipsland",
  base: BASE,
  nodes: [["building:watertoren-schacht-lisenen-consoles-reservoir-en-tentdak", all]],
  catalog: {
    name: "Watertoren Sint Philipsland",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: GROUND_SAMPLES,
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0716100000282375"],
    description:
      "Oorsprong op het hart van het BAG-pand en het dak op het maaiveld (NAP circa +1,76 m), +X op RD -21,5 graden, de normaal van de oostzuidoostgevel. Betonnen toren op een vierkant met afgeschuinde hoeken: schacht van 6,2 m met een lisene op elke hoofdgevel, reservoirdeel van 6,8 m vanaf 18,1 m op een uitkraging van 47 graden met een tussentrede en een console-blok boven elke lisene, sleuven op de vier hoekvlakken met ribben op het reservoirdeel, deur in de zuidzuidwestgevel en een achtzijdig tentdak van 25,95 tot 27,7 m. Maten uit AHN, BAG en foto's.",
    realWorld: {
      built: 1925,
      architect: "H. Sangster",
      publishedHeightM: 27.7,
      reservoirM3: 125,
      groundNapM: NAP0,
      ahnTopNapM: 29.42,
      shaftAcrossFlatsM: 2 * A.shaft,
      tankAcrossFlatsM: 2 * A.tank,
      tankAcrossChamfersM: 2 * C.tank,
      tankFootM: H.tankFoot,
      consoleM: H.console,
      eavesM: H.eaves,
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Sint_Philipsland) (1925, H. Sangster, 27,7 m, 125 m³)",
      "https://commons.wikimedia.org/wiki/File:Sint_Philipsland_6521.JPG (2005, reservoirdeel met consoles, sleuven en ribben, koperen dak)",
      "https://commons.wikimedia.org/wiki/File:Sint_Philipsland,_de_watertoren_foto6_2015-05-24_14.39.jpg (2015, hoeksleuf met ribben, getrapte onderkant van het reservoir)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Sint_Philipsland_-_20352486_-_RCE.jpg (2002, RCE, CC BY-SA 4.0: schacht met lisenen en de deur)",
      "PDOK BAG-pand 0716100000282375, 3D BAG, AHN DSM/DTM 0,5 m, luchtfoto Actueel_orthoHR en PDOK-terrein, 2026-11-06",
    ],
  },
});
