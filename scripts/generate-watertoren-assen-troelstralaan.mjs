// Watertoren aan de Troelstralaan in Assen (W. ter Braake, 1959-1960, provinciaal monument).
// Oorsprong op het hart van de ronde BAG-contour (straal 6,35 m), op maaiveld
// (NAP +10,9 m). De ingang met het glazen portaal en de stalen trap ligt naar
// -Y (noordnoordwest, 117,5 graden linksom van RD-oost, zoals de trap op de
// luchtfoto), +X wijst naar het zuidzuidwesten.
// Hoogtes uit de frontale RCE-foto 20412964 (schaal op de tankbreedte van
// 12,7 m), dak en dakhuisje uit het AHN; het platte dak ligt vol zonnepanelen
// en geeft daardoor gaten in het DSM.
import { Manifold, box, circle, hull, prism, ring3, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [233082.07, 557060.25];
const AXIS = [-0.887, -0.462];
const BASE = -0.3;
const H = {
  collarFoot: 19.7, // ring rond de schacht onder de bodem
  collarTop: 20.3,
  bowlRim: 21.4, // buitenrand van de kegelvormige bodem
  lipTop: 21.8, // betonnen band onder het metselwerk
  wallTop: 28.5, // bovenkant van de gemetselde tankmantel
  bandTop: 28.8, // betonnen dekrand
  roofFoot: 30.3, // onderkant van de dakschijf boven de vensterband
  fascia: 30.8, // schuine onderkant (45 graden) tot de blauwe dakrand
  roofTop: 31.2,
  hutTop: 33.4, // zeskantig dakhuisje (AHN-mediaan op het hart)
};
const R = { glass: 2.55, pilaster: 2.92, collar: 3.6, rim: 6.45, wall: 6.35, band: 6.42, lantern: 5.75, roof: 6.25, hut: 1.45 };
const round = (r, z, n = 72) => ring3(circle([0, 0], r, n), z);
const cyl = (r, z0, z1, n = 72) => prism(circle([0, 0], r, n), z0, z1);

// ---------- schacht: glazen kern tussen acht betonnen pilasters, portaal en trap ----------
const pilasters = Array.from({ length: 8 }, (_, k) => place(box(R.glass - 0.3, -0.4, BASE, R.pilaster, 0.4, H.collarTop), { deg: k * 45 }));
// Gemetselde plint onder het glas tot +1,0 m (entreefoto).
const shaft = union([cyl(R.glass, BASE, H.collarTop, 48), cyl(R.glass + 0.12, BASE, 1.0, 48), ...pilasters]).rotate([0, 0, 22.5]);
// Glazen portaal op een gemetselde voet, vloer +1,0, dak +3,6; bordes en trap naar voren.
const porch = union([
  box(-1.15, -4.0, BASE, 1.15, -2.0, 3.6),
  box(-1.3, -4.15, 3.6, 1.3, -2.0, 3.85), // dakrand van het portaal
  box(0.05, -4.9, BASE, 1.35, -4.0, 1.0), // bordes voor de deur
  hull([[0.15, -4.8, BASE], [1.3, -4.8, BASE], [0.15, -4.8, 1.0], [1.3, -4.8, 1.0], [0.15, -7.4, BASE], [1.3, -7.4, BASE], [0.15, -7.4, 0.0], [1.3, -7.4, 0.0]]),
]);
// Glas van het portaal als ondiepe nis in de voorgevel.
const porchGlass = box(-0.95, -4.3, 1.3, 0.95, -3.7, 3.3);
const entrance = porch.subtract(porchGlass);

// ---------- kraag, kegelvormige bodem en betonnen band ----------
const bowl = union([
  hull([...round(R.collar, H.collarFoot), ...round(R.collar, H.collarTop)]),
  hull([...round(R.collar, H.collarTop - 0.05), ...round(R.rim, H.bowlRim)]),
  hull([...round(R.rim, H.bowlRim), ...round(R.rim, H.lipTop)]),
]);

// ---------- gemetselde tankmantel met betonnen dekrand ----------
const tank = union([cyl(R.wall, H.lipTop - 0.05, H.wallTop), cyl(R.band, H.wallTop, H.bandTop)]);

// ---------- omloop met zestien vensters, dakschijf en zeskantig dakhuisje ----------
let lantern = cyl(R.lantern, H.bandTop - 0.05, H.roofFoot + 0.05);
// Vensters 1,8 m breed tussen posten van 0,46 m, 0,3 m diep, met een latei van 0,25 m eronder de dakschijf.
const windows = Array.from({ length: 16 }, (_, k) => place(box(R.lantern - 0.3, -0.9, 29.0, R.lantern + 0.5, 0.9, H.roofFoot - 0.25), { deg: k * 22.5 + 11.25 }));
lantern = lantern.subtract(union(windows));
const roof = union([
  lantern,
  // Dakschijf met een schuine onderkant van 45 graden, zodat de overstek zonder opvulling print.
  hull([...round(R.lantern, H.roofFoot), ...round(R.roof, H.fascia)]),
  cyl(R.roof, H.fascia - 0.05, H.roofTop),
  prism(circle([0, 0], R.hut, 6, Math.PI / 6), H.roofTop - 0.05, H.hutTop),
]);

await writeLandmark({
  slug: "watertoren-assen-troelstralaan",
  base: BASE,
  // Eén node voor de hele toren: de export vult modellen zonder attributen per
  // node op, en een losse tank- of daknode zou een voet tot de grondplaat krijgen.
  nodes: [
    ["building:schacht-kegelbodem-tank-en-dak", union([shaft, bowl, tank, roof])],
    ["building:portaal-en-trap", entrance],
  ],
  catalog: {
    name: "Watertoren Troelstralaan Assen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -8]],
    replacesBuildings: ["NL.IMBAG.Pand.0106100000027379"],
    description:
      "Oorsprong op het hart van de ronde BAG-contour op maaiveld (NAP +10,9 m), ingang met glazen portaal en stalen trap naar -Y (noordnoordwest). Ronde schacht van glas tussen acht betonnen pilasters (5,84 m), kraag en kegelvormige bodem, gemetselde cilindrische tank van 12,7 m tot 28,8 m, terugliggende vensterband met zestien vensters onder een dakschijf op 31,2 m en een zeskantig dakhuisje tot 33,4 m. Maten uit BAG, AHN en een frontale RCE-foto; zonnepanelen en antenne weggelaten.",
    realWorld: {
      publishedHeightM: 34,
      reservoirM3: 550,
      ahnGroundNapM: 10.88,
      ahnHutTopNapM: 44.3,
      bagTankDiameterM: 12.7,
      shaftDiameterM: 5.84,
      tankWallTopM: 28.8,
      roofTopM: 31.2,
      modelTopM: 33.4,
      minimumPartM: 0.8,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Assen_Troelstralaan)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_-_Assen_-_20412964_-_RCE.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_het_reservoir_-_Assen_-_20412958_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_entree_van_de_watertoren_-_Assen_-_20412959_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:AssenWatertoren2017a.jpg",
      "PDOK BAG-pand 0106100000027379, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});
