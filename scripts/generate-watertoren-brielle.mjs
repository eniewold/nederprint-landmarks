// Watertoren van Brielle (G.J. van den Boogerdweg 1). Gebouwd in 1923 naar ontwerp van A.D. Heederik, 40,50 m hoog,
// reservoir van 200 m³ (Wikipedia); rijksmonument 518188, in 1984 buiten gebruik. Een achtkante, wit gepleisterde
// schacht op een iets bredere achtkante plint; op elke hoek een lisene die bovenaan in twee trappen uitkraagt tot
// console onder het ronde reservoir; in elk van de acht verdiepte gevelvlakken een venster in de plint- of voetzone,
// een kolom van vier vensters halverwege en een venster onder het reservoir. Het ronde reservoir staat op een
// rand met twee lijnen en heeft acht paren smalle hoge vensters; daarboven een donkere gootlijst en een leien
// klokdak: een vrijwel verticale, iets bolle rok tot de knik, dan een kegel van 50 graden met een pinakel.
//
// Oorsprong op het zwaartepunt van de achtkante BAG-voetafdruk van pand 0501100001994429 (BAG-bouwjaar 1960 is fout;
// 7,26 m over de vlakken). Lokale X-as loodrecht op een gevelvlak, 6,2 graden rechtsom van RD-oost (gemiddelde van de
// BAG-zijden, die afwisselend op -3,1 en -9,3 graden staan). Maaiveld AHN-DTM NAP +1,25.
// Hoogtes uit het AHN-DSM (0,5 m): kegel van het dak met helling 1,2 (50 graden), top NAP +40,2 (38,95 m boven het
// maaiveld); de rok en de goot zijn steil en donker en geven gaten in het DSM. Diameter van dak (10,4 m) en reservoir
// uit de luchtfoto en de foto "Watertoren Brielle.jpg" (telelens, bijna orthografisch, 0,032 m per pixel op het dak);
// hoogtes van knik, goot en onderkant reservoir en de indeling van schacht en vensters van die foto en van de RCE-foto
// 20270371 (van onderen, alleen verhoudingen in de onderbouw), geschaald op het AHN.
import { Manifold, hull, union, prism, place, circle, dome, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [70542.95, 435107.67];
const AXIS_DEG = -6.2;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 1.25;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (zuid 44,964, west 45,015, noord 45,074,
// oost 45,129), gemeten 2026-11-06. Het PDOK-pand staat op 44,95 met de top op 83,71.
const GROUND_ELLIPSOID = 44.964;

// ---------- maten (meters boven het maaiveld; stralen vanaf het hart) ----------
const A = {
  plinth: 3.63, // apothema van de plint (BAG: 7,26 m over de vlakken)
  shaft: 3.43, // apothema van de lisenen (schacht 6,86 m over de vlakken)
  recess: 0.3, // diepte van de verdiepte gevelvlakken tussen de lisenen
};
const H = {
  plinth: 3.8, // bovenkant plint (schuine afzaat tot 4,0)
  plinthTop: 4.0,
  recessTop: 19.3, // bovenkant van de verdiepte vlakken
  corbel1: 19.6, // begin van de eerste trap van de consoles
  corbel2: 21.9, // begin van de tweede trap
  bottom: 21.65, // begin van de schuine onderkant van het reservoir (45 graden)
  ledge: 23.1, // rand onder het reservoir
  ledgeTop: 23.8,
  eaveKraag: 29.45, // kraag onder de goot
  eave: 30.0, // goot van het dak
  skirt: 30.9, // bolste punt van de rok
  knee: 32.9, // knik tussen rok en kegel
  apex: 38.95, // top van de kegel (AHN NAP +40,2)
  finial: 39.45, // pinakel
};
const R = {
  drum: 4.85, // reservoir 9,7 m
  ledge: 5.0,
  eave: 5.2, // dak 10,4 m (luchtfoto)
  skirt: 5.25,
  knee: 5.05,
  finial: 0.45,
};

const SEG = 64;
const oct = (a, z) => circle([0, 0], a / Math.cos(Math.PI / 8), 8, Math.PI / 8).map(([x, y]) => [x, y, z]);
const ring = (r, z, n = SEG) => circle([0, 0], r, n).map(([x, y]) => [x, y, z]);
const faces = [0, 45, 90, 135, 180, 225, 270, 315];

// Nis in een gevel met normaal +X op afstand f, midden op y = c, breedte w, van z0 tot z1; het plafond loopt naar
// binnen onder 63 graden op, zodat er niets vrij hangt.
const niche = (f, c, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 0.3, za = z1 + 2 * depth, zb = z0;
  const y0 = c - w / 2, y1 = c + w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, zb], [b, y1, zb]]);
};

// ---------- plint en schacht ----------
const plinth = hull([...oct(A.plinth, BASE), ...oct(A.plinth, H.plinth), ...oct(A.shaft, H.plinthTop)]);
const shaft = prism(circle([0, 0], A.shaft / Math.cos(Math.PI / 8), 8, Math.PI / 8), BASE, H.ledge);

// ---------- schuine onderkant van het reservoir, consoles op de lisenen, rand ----------
const bottom = hull([...oct(A.shaft, H.bottom), ...ring(R.drum, H.ledge)]);
// Console op elke hoek (in het stelsel van de hoek: x radiaal, y langs de omtrek): de voet valt binnen de hoek van de
// achtkant, daarna twee trappen van 35 en 38 graden.
const cornerR = A.shaft / Math.cos(Math.PI / 8);
const corbel = union([
  hull([[3.0, -0.5, H.corbel1], [3.5, -0.5, H.corbel1], [cornerR - 0.02, 0, H.corbel1], [3.0, 0.5, H.corbel1], [3.5, 0.5, H.corbel1],
    [3.0, -0.5, 22.2], [4.3, -0.5, 20.75], [4.3, -0.5, 22.2], [3.0, 0.5, 22.2], [4.3, 0.5, 20.75], [4.3, 0.5, 22.2]]),
  hull([[3.0, -0.5, H.corbel2], [4.3, -0.5, H.corbel2], [3.0, 0.5, H.corbel2], [4.3, 0.5, H.corbel2],
    [3.0, -0.5, H.ledge + 0.1], [R.drum, -0.5, 22.6], [R.drum, -0.5, H.ledge + 0.1], [3.0, 0.5, H.ledge + 0.1], [R.drum, 0.5, 22.6], [R.drum, 0.5, H.ledge + 0.1]]),
]);
const corbels = union(faces.map((d) => place(corbel, { deg: d + 22.5 })));
const ledge = hull([...ring(R.drum, H.ledge), ...ring(R.ledge, H.ledge + 0.2), ...ring(R.ledge, H.ledgeTop)]);

// ---------- reservoir, goot en klokdak ----------
const drum = prism(circle([0, 0], R.drum, SEG), H.ledgeTop - 0.1, H.eaveKraag + 0.1);
const eave = hull([...ring(R.drum, H.eaveKraag), ...ring(R.eave, H.eave - 0.1), ...ring(R.eave, H.eave)]);
const roof = dome([0, 0], [[R.drum, H.eaveKraag + 0.05], [R.eave, H.eave], [R.skirt, H.skirt], [5.2, 31.9], [R.knee, H.knee], [0.01, H.apex]], SEG);
const finial = hull([...ring(R.finial, 38.4, 16), ...ring(R.finial, 38.9, 16), [0, 0, H.finial]]);

// ---------- nissen: verdiepte gevelvlakken, vensters, deur ----------
const faceLen = 2 * A.shaft * Math.tan(Math.PI / 8);
const fIn = A.shaft - A.recess;
const perFace = (deg) => {
  const parts = [
    niche(A.shaft, 0, faceLen - 1.2, H.plinthTop, H.recessTop, A.recess), // verdiept vlak tussen de lisenen
    // Kolom van vier vensters, 0,22 m diep: het schuine plafond (0,44 m) blijft onder de volgende borstwering van
    // 0,5 m, zodat de borstweringen geen losse bruggen worden.
    ...[9.6, 10.95, 12.3, 13.65].map((z) => niche(fIn, 0, 0.9, z, z + 0.85, 0.22)),
    niche(fIn, 0, 0.9, 5.2, 6.1), // venster boven de plint
    niche(A.shaft, 0, 0.9, 20.0, 20.9), // venster onder het reservoir
    niche(R.drum, 0, 1.0, 24.6, 28.8), // paar smalle hoge vensters in het reservoir
  ];
  return parts.map((m) => place(m, { deg }));
};
// Deur (1,4 x 2,4 m) in de zuidgevel aan het pad en twee vensters in de plint (oost en west): stand en maat geschat.
const openings = union([
  ...faces.flatMap(perFace),
  place(niche(A.plinth, 0, 1.4, 0, 2.4), { deg: 270 }),
  place(niche(A.plinth, 0, 0.9, 1.5, 2.4), { deg: 0 }),
  place(niche(A.plinth, 0, 0.9, 1.5, 2.4), { deg: 180 }),
]);

const all = union([plinth, shaft, bottom, corbels, ledge, drum, eave, roof, finial]).subtract(openings);

await writeLandmark({
  slug: "watertoren-brielle",
  base: BASE,
  nodes: [["building:watertoren-plint-schacht-consoles-reservoir-en-klokdak", all]],
  catalog: {
    name: "Watertoren Brielle",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6.5, 0], [-6.5, 0], [0, 6.5], [0, -6.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0501100001994429"],
    description:
      "Oorsprong op het zwaartepunt van de achtkante BAG-voetafdruk (7,26 m over de vlakken) op het maaiveld (NAP +1,25 m), X-as loodrecht op een gevelvlak, 6,2 graden rechtsom van RD-oost. Achtkante plint tot 4 m; achtkante schacht met lisenen op de hoeken, verdiepte gevelvlakken met vensters en consoles in twee trappen; schuine onderkant van 45 graden en een rand op 23,1 m; rond reservoir van 9,7 m met acht vensterparen tot 29,45 m; goot van 10,4 m op 30 m; leien klokdak met een bolle rok tot de knik op 32,9 m en een kegel van 50 graden tot 38,95 m (AHN), pinakel tot 39,45 m. Dakluikjes en hekwerk weggelaten. Maten uit BAG, AHN, luchtfoto en foto's.",
    realWorld: {
      built: 1923,
      architect: "A.D. Heederik",
      rijksmonument: 518188,
      publishedHeightM: 40.5,
      reservoirM3: 200,
      ahnGroundNapM: GROUND_NAP,
      ahnApexNapM: 40.2,
      ahnRoofSlope: 1.2,
      plinthAcrossFlatsM: 2 * A.plinth,
      shaftAcrossFlatsM: 2 * A.shaft,
      ledgeM: H.ledge,
      reservoirDiameterM: 2 * R.drum,
      eaveM: H.eave,
      roofDiameterM: 2 * R.eave,
      kneeM: H.knee,
      apexM: H.apex,
      topM: H.finial,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Brielle) (1923, A.D. Heederik, 40,50 m, 200 m³, rijksmonument 518188)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Brielle) (Watertoren Brielle.jpg; Watertoren Brielle 2020.jpg; Exterieur OVERZICHT - Brielle - 20270371 - RCE.jpg)",
      "PDOK BAG-pand 0501100001994429, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});
