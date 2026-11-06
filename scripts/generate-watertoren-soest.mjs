// Watertoren van Soest aan de Oranjelaan 36, rijksmonument 512722. Gebouwd in 1931 voor de Arnhemsche
// Waterleiding-Maatschappij naar ontwerp van H.F. Mertens (Bilthoven), op het hoogste punt van de Soester Eng (NAP
// +19,8), daardoor maar 23,7 m hoog met een stalen reservoir van 200 m³ (6 m doorsnede). Sinds 1985-1986 en de verbouwing
// van 1993 (ZECC architecten) een woonhuis van negen lagen; het reservoir is verwijderd en het dak is een dakterras met
// een glazen trappenhuis. Ronde toren van baksteen: een blinde plint (alleen de ingang), daarboven een teruggezette
// schacht van vier lagen waarlangs acht steunberen omhoog lopen tot in de uitkragende reservoircilinder; tussen de
// steunberen aan vier zijden vierlichtvensters. De twee steunberen naast de ingang zijn vlak onder het reservoir verbonden
// door een betonnen latei, waarop een muur tot voor het reservoir doorloopt (met deklijst). Het reservoir heeft twee
// rijen platte driedelige vensters; erop een kleinere cilinder (nu de borstwering van het dakterras).
//
// Oorsprong op het hart van BAG-pand 0342100000009497 (cirkelfit op de 22 hoekpunten, straal 4,41 m) op maaiveld,
// AHN-DTM NAP +19,8 (ring van 6 tot 10 m: mediaan 19,82 tot 19,64; 3D BAG-maaiveld 19,65). +X is de as van de ingang
// (RD -151,5 graden, naar het zuidwesten): het tuinpad van de Oranjelaan komt daar aan (-154 graden op de luchtfoto), en
// de steunberen staan op 22,5 + 45k graden daarvan (AHN-DSM rond 4 tot 4,7 m: fase 5 à 13 graden; voeten op de luchtfoto
// op -124, -84 en -42 graden RD).
// Maten: BAG (cirkel), AHN-DSM 0,5 m (reservoirrand NAP +42,9 à +43,0 tot circa 4,1 m van het hart, borstwering
// +43,7 à +43,8 op 2,8 tot 3,4 m, dakterras +42,65, trappenhuis +45,19), luchtfoto 8 cm (borstwering 2,8 tot 3,35 m,
// reservoirrand tot 4,0 m, trappenhuis 0,9 m), de plattegronden en doorsnede van ZECC (divisare.com: acht radiale
// steunberen, schacht circa 3,4 m, reservoir circa 4,1 m; reservoirbodem 14,1 m, vensters op 3,4, 6,9, 10,3 en 13,6 m,
// reservoirvensters op 17,0 en 21,5 m), de vooraanzichtfoto van ZECC (frontaal op de ingang) en "Soest Watertoren
// 9167.JPG" (Commons, 2006, vanuit het westen).
import { circle, ring3, prism, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [148410.4, 466137.14];
const DEG = -151.5;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 19.8;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints op 6 m van het hart (ingang 62,98, links 63,03,
// achter 63,15, rechts 63,02), gemeten 2026-11-06; het PDOK-pand begint op 62,88.
const GROUND_ELLIPSOID = 62.98;

const N = 72;
const ring = (r, z) => ring3(circle([0, 0], r, N, Math.PI / N), z);
const cyl = (r, z0, z1) => prism(circle([0, 0], r, N, Math.PI / N), z0, z1);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
// Boog op straal r van a0 tot a1 graden.
const arc = (r, a0, a1, z, n = 12) =>
  Array.from({ length: n + 1 }, (_, k) => {
    const t = ((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180;
    return [r * Math.cos(t), r * Math.sin(t), z];
  });

// Nis in de gevel met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder 56
// graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};

// ---------- hoogtes boven maaiveld (NAP +19,8) ----------
const H = {
  plinth: 3.0, // bovenkant van de blinde plint
  soffit: [13.85, 14.6], // onderkant van het uitkragende reservoir, van de schacht tot de reservoirwand (47 graden)
  buttress: 15.0, // steunberen tot net in het reservoir
  lintel: [12.85, 13.92], // onderkant van de latei boven de ingang, van schacht tot gevel (46 graden)
  wall: 16.2, // deklijst van de muur boven de ingang
  rim: 23.1, // bovenrand van het reservoir (AHN NAP +42,9 à +43,0)
  parapet: 24.0, // borstwering van het dakterras (AHN NAP +43,7 à +43,8)
  terrace: 22.85, // dakterras (AHN NAP +42,65)
  stair: [24.95, 25.15, 25.4], // glazen trappenhuis, zinken kap, ventilatiekap (AHN NAP +45,19)
};
// Stralen.
const R = {
  plinth: 3.85,
  shaft: 3.4,
  reservoir: 4.1,
  buttress: 4.42, // buitenvlak van de steunberen (BAG-cirkel 4,41)
  parapet: [2.45, 3.35],
  stair: [0.95, 1.05, 0.6],
};
const BUTTRESS_W = 1.0;
const BUTTRESS_DEG = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
const ENTRANCE_PAIR = [22.5, 337.5];
const WINDOW_BAYS = [45, 135, 225, 315];

// ---------- plint, schacht, reservoir ----------
const plinth = cyl(R.plinth, BASE, H.plinth);
const shaft = cyl(R.shaft, BASE, H.soffit[0] + 0.01);
// Het reservoir kraagt 0,7 m uit over de schacht; de onderkant onder 47 graden (in het echt een gebogen betonnen rand).
const soffit = hull([...ring(R.shaft, H.soffit[0]), ...ring(R.reservoir, H.soffit[1])]);
const reservoir = cyl(R.reservoir, H.soffit[1] - 0.01, H.rim);
// Kleinere cilinder op het reservoir: sinds 1993 de borstwering om het verdiepte dakterras.
const parapet = cyl(R.parapet[1], H.rim - 0.01, H.parapet);
const terrace = cyl(R.parapet[0], H.terrace, H.parapet + 1);

// ---------- steunberen ----------
const buttress = (top) => box(R.shaft - 0.4, -BUTTRESS_W / 2, BASE, R.buttress, BUTTRESS_W / 2, top);
const buttresses = BUTTRESS_DEG.map((deg) => place(buttress(ENTRANCE_PAIR.includes(deg) ? H.wall : H.buttress), { deg }));

// ---------- latei en muur boven de ingang (+X) ----------
// Tussen de steunberen naast de ingang: een latei met een onderkant onder 45 graden van de schacht tot de gevel, en
// daarop de muur tot de deklijst, gebogen op de straal van de steunbeerkoppen, deels voor het reservoir.
const entranceWall = hull([
  ...arc(R.shaft - 0.4, -22.5, 22.5, H.lintel[0]),
  ...arc(R.shaft, -22.5, 22.5, H.lintel[0]),
  ...arc(R.buttress, -22.5, 22.5, H.lintel[1]),
  ...arc(R.buttress, -22.5, 22.5, H.wall),
  ...arc(R.shaft - 0.4, -22.5, 22.5, H.wall),
]);

// ---------- openingen ----------
const openings = union([
  // Vierlichtvensters (als nis van 1,3 m) in de vier schuine traveeën, op de vier lagen van de schacht; het bovenste
  // 0,45 m onder de onderkant van het reservoir.
  ...[[3.2, 4.1], [6.3, 7.2], [9.4, 10.3], [12.5, 13.4]].flatMap(([z0, z1]) => around(niche(R.shaft, 1.3, z0, z1, 0.35), WINDOW_BAYS)),
  // Twee rijen platte driedelige reservoirvensters, acht per rij.
  ...[[16.9, 17.7], [21.3, 22.1]].flatMap(([z0, z1]) => around(niche(R.reservoir, 1.6, z0, z1, 0.35), [0, 45, 90, 135, 180, 225, 270, 315])),
  // Groot venster (1993) in de muur boven de ingang.
  niche(R.buttress, 2.2, 14.7, 15.5, 0.35),
  // Voordeur met bovenlicht in de plint, rechts van het midden (gezien van buiten).
  niche(R.plinth, 1.1, 0, 2.4, 0.4, 0.45),
  // Dakterras.
  terrace,
]);

// ---------- trappenhuis op het dakterras ----------
const stair = union([
  cyl(R.stair[0], H.terrace - 0.05, H.stair[0]),
  hull([...ring(R.stair[0], H.stair[0] - 0.01), ...ring(R.stair[1], H.stair[0] + 0.12)]),
  cyl(R.stair[1], H.stair[0] + 0.11, H.stair[1]),
  cyl(R.stair[2], H.stair[1] - 0.01, H.stair[2]),
]);

const building = union([plinth, shaft, soffit, reservoir, parapet, ...buttresses, entranceWall]).subtract(openings).add(stair);

await writeLandmark({
  slug: "watertoren-soest",
  base: BASE,
  nodes: [["building:watertoren-plint-steunberen-reservoir-en-dakterras", building]],
  catalog: {
    name: "Watertoren Soest",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6, 0], [0, 6], [-6, 0], [0, -6]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0342100000009497"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op maaiveld (NAP +19,8 m), +X de as van de ingang naar het zuidwesten (RD -151,5 graden). Blinde plint tot 3,0 m met de deur, teruggezette schacht met acht steunberen tot 15,0 m en vierlichtvensters in de vier schuine traveeën, latei en muur boven de ingang tot 16,2 m, reservoircilinder van 14,6 tot 23,1 m met een onderkant onder 45 graden en twee rijen vensters, borstwering tot 24,0 m om het verdiepte dakterras en het glazen trappenhuis tot 25,4 m. Maten uit BAG, AHN, de plattegronden en doorsnede van de verbouwing en foto's.",
    realWorld: {
      built: "1931",
      architect: "H.F. Mertens",
      conversion: "1985-1986 en 1993 (ZECC architecten): woonhuis van negen lagen, reservoir verwijderd",
      monument: "rijksmonument 512722",
      wikipediaHeightM: 23.7,
      reservoirM3: 200,
      reservoirDiameterM: 6,
      ahnGroundNapM: GROUND_NAP,
      ahnRimNapM: 42.95,
      ahnParapetNapM: 43.77,
      ahnTopNapM: 45.19,
      plinthRadiusM: R.plinth,
      shaftRadiusM: R.shaft,
      reservoirRadiusM: R.reservoir,
      buttressRadiusM: R.buttress,
      plinthM: H.plinth,
      buttressTopM: H.buttress,
      entranceWallM: H.wall,
      reservoirM: [H.soffit[1], H.rim],
      parapetM: H.parapet,
      apexM: H.stair[2],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Soest) (1931, H.F. Mertens, 23,7 m, 200 m³, woonhuis sinds 1993)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/512722 (redengevende omschrijving: plint, schacht met steunberen, latei en muur boven de ingang, reservoircilinder met twee rijen vensters, kleinere cilinder met plat dak)",
      "https://divisare.com/projects/18063-zecc-architecten-jeroen-musch-herbestemming-watertoren-soest-woonhuis-over-9-lagen (ZECC architecten, foto's Jeroen Musch: vooraanzicht, dakterras met trappenhuis, plattegronden en doorsnede)",
      "https://commons.wikimedia.org/wiki/File:Soest_Watertoren_9167.JPG (vanuit het westen, 2006)",
      "PDOK BAG-pand 0342100000009497, AHN DSM/DTM 0,5 m, 3D BAG en luchtfoto, 2026-11-06",
    ],
  },
});
