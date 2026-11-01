// Nieuwe watertoren van Tiel (1946, G.B.F. Hoes), gemeentelijk monument aan
// het Fabriekslaantje bij de Echteldsedijk, 35 m hoog met een reservoir van
// 500 m³; sinds 2016 een woning. Ronde bakstenen schacht met acht steunberen
// die tot boven de onderkant van het reservoir doorlopen en daar eindigen in
// een natuurstenen blok; tussen de beren kraagt het cilindrische reservoir
// circa 0,8 m uit met een betonnen rand. Plat dak achter een opstaande rand
// met een koperen afdekking. Aan de oostkant twee lange vensterstroken in de
// schacht en de deur onder een betonnen latei; in elk vak onder de dakrand een
// klein venster.
// Oorsprong op het middelpunt van de ronde BAG-contour (straal 6,0 m) op
// maaiveld (NAP +6,40 m), assen in RD-richting. In het AHN staat het dak 0,90 m
// westelijk en 0,43 m noordelijk van de voet (de muurpunten aan de
// oostzuidoostkant lopen per hoogte geleidelijk mee, aan de westkant is een
// gat onder de overhang); het model helt zo over. Beren op noord, noordoost,
// oost enz. (luchtfoto en twee foto's vanuit het oosten), deur en
// vensterstroken in de vakken op 67,5 en 112,5 graden (kompas).
// Hoogtes: dak en rand uit het AHN, onderkant reservoir op 23 m uit de
// hoogteverplaatsing op de luchtfoto en de foto's, de rest van de foto's.
import { Manifold, CrossSection, box, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [158841.6, 433447.59];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  doorTop: 2.4,
  lintel: [2.8, 3.05], // betonnen latei boven de deur
  window: [7.0, 8.5], // los venster onder de zuidelijke strook
  strip: [10.5, 22.2], // vensterstroken
  soffit: 23.0, // onderkant van het reservoir (betonnen rand tot 23,3)
  bandTop: 23.3,
  ribTop: 25.8, // bovenkant van de steunberen met natuurstenen blok
  topWindow: [31.2, 32.1], // kleine vensters onder de dakrand
  roof: 33.05, // plat dak (AHN)
  rimEdge: 33.9,
  rim: 34.1, // opstaande rand met koperen afdekking (AHN 34,0 tot 34,16)
  hatch: 33.35, // dakluik (AHN 0,25 tot 0,3 m boven het dak)
};
const R = { core: 5.2, tank: 5.9, band: 6.0, rib: 6.2, rimInner: 5.1 };
const RIB_WIDTH = 1.0;
const LEAN = [-0.9 / 33.5, 0.43 / 33.5]; // overhelling per meter hoogte (oost, noord)
const BAY_ENE = 22.5; // modelgraden (linksom van oost): vak met deur en vensterstrook, kompas 67,5
const BAY_ESE = -22.5; // vak met vensterstrook en los venster, kompas 112,5

// ---------- schacht, reservoir en dak ----------
const core = Manifold.cylinder(H.soffit + 0.01 - BASE, R.core, R.core, 96).translate([0, 0, BASE]);
// Reservoir als omwentelingsprofiel: betonnen rand onderaan, cilinder, afgeschuinde koperen afdekking, dak binnen de rand.
const tank = Manifold.revolve(
  new CrossSection([[
    [0, H.soffit], [R.band, H.soffit], [R.band, H.bandTop], [R.tank, H.bandTop], [R.tank, H.rimEdge], [R.tank - 0.15, H.rim],
    [R.rimInner, H.rim], [R.rimInner, H.roof], [0, H.roof],
  ]]),
  96,
);
// Acht steunberen van 1,0 m breed, 1,0 m voor de schacht en 0,3 m voor het reservoir.
const ribs = union(Array.from({ length: 8 }, (_, k) => place(box(R.core - 0.2, -RIB_WIDTH / 2, BASE, R.rib, RIB_WIDTH / 2, H.ribTop), { deg: k * 45 })));
const hatch = box(-0.7, -0.8, H.roof - 0.01, 0.7, 0.8, H.hatch);

// Betonnen latei boven de deur, 0,2 m uit de gevel op een schuine onderkant (56 graden).
const lintel = place(
  hull([
    ...[-1.3, 1.3].flatMap((y) => [[R.core - 0.15, y, H.lintel[0] - 1.5 * 0.35], [R.core + 0.2, y, H.lintel[0]], [R.core + 0.2, y, H.lintel[1]], [R.core - 0.15, y, H.lintel[1]]]),
  ]),
  { deg: BAY_ENE },
);

// ---------- nissen (vlak met normaal +X op afstand f) ----------
// Vlakke bodem en een plafond dat naar binnen onder 56 graden oploopt (de export vult hem niet op).
const niche = (f, w, z0, z1, depth = 0.25, y = 0) => {
  const a = f - depth, b = f + Math.min(0.6, (z1 - z0) / 1.5 - 0.01), zb = z1 - 1.5 * (b - f), za = z1 + 1.5 * depth;
  const y0 = y - w / 2, y1 = y + w / 2;
  return hull([
    [a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0],
    [a, y0, za], [a, y1, za], [f, y0, z1], [f, y1, z1], [b, y0, zb], [b, y1, zb],
  ]);
};
const cuts = union([
  // Deur (1,2 × 2,4 m) en de vensterstroken (0,5 m breed) in de oostelijke vakken, het losse venster onder de zuidelijke strook.
  place(niche(R.core, 1.2, 0, H.doorTop, 0.35), { deg: BAY_ENE }),
  place(niche(R.core, 0.5, ...H.strip), { deg: BAY_ENE }),
  place(niche(R.core, 0.5, ...H.strip), { deg: BAY_ESE }),
  place(niche(R.core, 0.5, ...H.window), { deg: BAY_ESE }),
  // Klein venster (0,5 × 0,9 m) in elk vak onder de dakrand.
  ...Array.from({ length: 8 }, (_, k) => place(niche(R.tank, 0.5, ...H.topWindow), { deg: 22.5 + k * 45 })),
]);

// Scheefstand als afschuiving langs z (volume en hellingen veranderen nauwelijks).
const tower = union([core, tank, ribs, hatch, lintel])
  .subtract(cuts)
  .transform([1, 0, 0, 0, 0, 1, 0, 0, LEAN[0], LEAN[1], 1, 0, 0, 0, 0, 1]);

await writeLandmark({
  slug: "watertoren-tiel-nieuwe-watertoren",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los reservoir zou een eigen voet krijgen.
  nodes: [["building:schacht-met-steunberen-reservoir-en-dak", tower]],
  catalog: {
    name: "Nieuwe watertoren Tiel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.7, 0], [-7.7, 0], [0, 7.7], [0, -7.7]],
    replacesBuildings: ["NL.IMBAG.Pand.0281100000000199"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +6,40 m), assen in RD-richting. Ronde schacht van 10,4 m met acht steunberen (12,4 m over de beren) tot 25,8 m, reservoir van 11,8 m dat tussen de beren 0,7 m uitkraagt vanaf 23 m met een betonnen rand, plat dak op 33,05 m achter een opstaande rand tot 34,1 m met een dakluik, kleine vensters onder de dakrand, twee vensterstroken en de deur onder een latei aan de oostkant. De toren helt 1,0 m over naar het westnoordwesten, zoals in het AHN. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 35,
      reservoirM3: 500,
      built: 1946,
      architect: "G.B.F. Hoes",
      ahnGroundNapM: 6.4,
      ahnRoofM: 33.05,
      ahnRimM: 34.1,
      bagDiameterM: 12.0,
      shaftDiameterM: 10.4,
      tankDiameterM: 11.8,
      acrossRibsM: 12.4,
      ribs: 8,
      soffitM: 23.0,
      ribTopM: 25.8,
      leanAtRoofM: [-0.9, 0.43],
      modelTopM: 34.1,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Tiel)",
      "https://commons.wikimedia.org/wiki/File:Tiel_Watertoren_Fabriekslaantje_26.jpg (oostzijde met deur en vensterstroken, maten)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Tiel.jpg (oostzijde, beren, rand en vensters onder het dak)",
      "PDOK BAG-pand 0281100000000199, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});
