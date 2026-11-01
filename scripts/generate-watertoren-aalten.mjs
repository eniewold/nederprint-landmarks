// Watertoren van Aalten (G.J. Postel Hzn, 1943), Delftse School, 37,15 m hoog
// met reservoirs van 375 en 195 m³; gemeentelijk monument.
// Oorsprong op het zwaartepunt van de BAG-contour (pand 0197100000024554, de
// top van het kegeldak in het AHN ligt er 0,1 m van) op maaiveld (NAP +37,2 m).
// De BAG-contour is een zeshoekige kern (hoeken op 4,4 m van het hart) met op
// elke hoek een steunbeer tot 5,85 m; +X wijst naar de steunbeer op 21,5 graden
// linksom van RD-oost, de steunberen staan op 0, 60, ... graden en de vakken
// daartussen op 30 + k·60 graden.
// Boven de vakken hangt het ronde reservoir (r 5,6) tussen de steunberen, met
// een witte vlakke onderrand; daarboven een gemetselde kraag, de omgang, een
// teruggezette opbouw met vensters, een overstekende dakrand en een koperen
// kegeldak. Hoogtes van omgang, dakrand en dak uit het AHN, de overige uit de
// foto "Iloveachterhoek" (van ver, bijna recht; 42 px/m op de gecropte toren,
// geschaald tussen de omgang en de dakrand in het AHN).
import { Manifold, CrossSection, box, circle, hull, ring3, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [236784.1, 438893.0];
const AXIS = [0.9304, 0.3665]; // 21,5 graden
const BASE = -0.3;
const H = {
  core: 23.0, // de zeshoekige kern loopt door tot in het reservoir
  ledge: 22.5, // witte vlakke onderrand van het reservoir tussen de steunberen
  corbel: 29.9, // begin van de gemetselde kraag onder de omgang
  gallery: 30.75, // onderkant van de omgangsvloer
  floor: 31.0, // omgang (AHN 31,0 met de leuning tot 32,1)
  pilaster: 30.4, // de steunberen eindigen in de kraag
  soffit: 33.3, // onderkant van de overstekende dakrand
  eave: 33.8, // bovenkant van de dakrand (AHN 33,8 op r 4,75 tot 5,25)
  roofFoot: 33.85,
  apex: 37.15, // top van het kegeldak (Wikipedia 37,15; AHN 37,0 tot 37,2)
};
const R = { core: 4.4, pilaster: 5.85, pilasterIn: 3.5, tank: 5.6, gallery: 6.15, drum: 4.6, eave: 5.35 };
const PILASTER_W = 1.3;
const BAYS = Array.from({ length: 6 }, (_, k) => 30 + k * 60);
const CORE_APOTHEM = R.core * Math.cos(Math.PI / 6); // 3,81

// ---------- zeshoekige kern met zes steunberen ----------
const hex = circle([0, 0], R.core, 6);
const core = hull([...ring3(hex, BASE), ...ring3(hex, H.core)]);
const pilasters = union(
  Array.from({ length: 6 }, (_, k) => place(box(R.pilasterIn, -PILASTER_W / 2, BASE, R.pilaster, PILASTER_W / 2, H.pilaster), { deg: k * 60 })),
);

// ---------- reservoir, kraag, omgang, opbouw, dakrand en kegeldak als omwentelingsprofiel ----------
const top = Manifold.revolve(
  new CrossSection([[
    [0, H.ledge], [R.tank, H.ledge], [R.tank, H.corbel],
    [R.gallery, H.gallery], [R.gallery, H.floor], // kraag onder 57 graden, omgangsvloer
    [R.drum, H.floor], [R.drum, H.soffit], // teruggezette opbouw
    [R.eave, H.soffit], [R.eave, H.eave], // overstekende dakrand met vlakke onderkant
    [R.drum, H.roofFoot], [0, H.apex], // koperen kegeldak (35,6 graden)
  ]]),
  96,
);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = [
  place(niche(CORE_APOTHEM, 1.4, 0, 2.4, 0.35), { deg: 270 }), // deur in het vak naar de open plek (zuidzuidoost)
  ...BAYS.flatMap((deg) => [
    // Reservoir: een kolom van drie vensters per vak (foto).
    ...[[24.2, 25.0], [26.9, 27.7], [28.6, 29.35]].map(([z0, z1]) => place(niche(R.tank, 0.65, z0, z1, 0.25), { deg })),
    // Vak onder het reservoir: brede raamband vlak onder de onderrand en twee trapvensters.
    place(niche(CORE_APOTHEM, 1.8, 19.8, 20.6, 0.3), { deg }),
    ...(deg === 270 ? [] : [[7.6, 8.6]]).concat([[13.6, 14.6]]).map(([z0, z1]) => place(niche(CORE_APOTHEM, 0.7, z0, z1, 0.3), { deg })),
  ]),
  // Opbouw: twaalf kleine vensters rondom onder de dakrand.
  ...Array.from({ length: 12 }, (_, k) => place(niche(R.drum, 0.7, 32.0, 32.7, 0.25), { deg: 15 + k * 30 })),
];

await writeLandmark({
  slug: "watertoren-aalten",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:kern-steunberen-reservoir-omgang-en-kegeldak", union([core, pilasters, top]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Aalten",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.4, 0], [-7.4, 0], [0, 7.4], [0, -7.4]],
    replacesBuildings: ["NL.IMBAG.Pand.0197100000024554"],
    description:
      "Oorsprong op het zwaartepunt van de BAG-contour op maaiveld (NAP +37,2 m), +X naar de steunbeer op 21,5 graden (oost-noordoost). Zeshoekige kern (hoeken op 4,4 m) met zes steunberen van 1,3 m tot 5,85 m uit het hart, deur in het vak naar het zuidzuidoosten, raamband en trapvensters in de vakken; rond reservoir van 11,2 m tussen de steunberen van 22,5 tot 29,9 m met drie vensters per vak, gemetselde kraag naar de omgang op 31,0 m (12,3 m), teruggezette opbouw van 9,2 m met twaalf vensters, overstekende dakrand van 10,7 m op 33,3 tot 33,8 m en koperen kegeldak tot 37,15 m. Maten uit BAG, AHN, Wikipedia en foto's.",
    realWorld: {
      publishedHeightM: 37.15,
      reservoirsM3: [375, 195],
      ahnGroundNapM: 37.2,
      ahnTopNapM: 74.61,
      bagCoreCornerRadiusM: 4.4,
      bagPilasterRadiusM: 5.85,
      pilasterWidthM: 1.3,
      tankDiameterM: 11.2,
      ledgeM: 22.5,
      galleryM: 31.0,
      galleryDiameterM: 12.3,
      drumDiameterM: 9.2,
      eaveDiameterM: 10.7,
      eaveM: 33.8,
      modelTopM: 37.15,
      photoScalePxPerM: 42,
      minimumPartM: 0.65,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Aalten)",
      "https://commons.wikimedia.org/wiki/File:Iloveachterhoek.jpg (van ver, bijna recht: maten van reservoir, omgang, opbouw en dak)",
      "https://commons.wikimedia.org/wiki/File:Water_Tower_Aalten.JPG (steunberen, onderrand, raamband en vensters)",
      "PDOK BAG-pand 0197100000024554, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});
