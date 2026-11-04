// Watertoren van Assendelft (Zaanstad), gebouwd in 1885 naar ontwerp van D. de Leeuw. Oorspronkelijk 31,4 m hoog met
// een reservoir van 540 m³; in de jaren twintig zijn het reservoir en het dak verwijderd en kreeg de toren een veel
// grotere en hogere kop met een betonnen reservoir van 1200 m³ (Wikipedia: 41,85 m). Nu kantoren met bovenin horeca.
// Een ronde bakstenen schacht met tien lisenen, een geprofileerde waterlijst boven de onderbouw, drie rijen
// rondboogvensters per travee en bovenaan een fries van gele boogjes onder een uitkragende lijst. Daarop de twaalfzijdige
// kop uit de jaren twintig: betonnen hoekpilasters met baksteen ertussen, twee betonnen banden onderin (de onderste
// smal, de bovenste breed), smalle lichtspleten, een zwaar overstekende betonnen kroonlijst en een plat twaalfzijdig
// tentdak met in het midden een rond opbouwtje.
//
// Oorsprong op het middelpunt van de ronde BAG-contour (pand 0479100000003917, cirkelfit straal 8,12 m op 1 cm) op
// maaiveld (AHN-DTM in een ring van 10 tot 16 m NAP -0,06 tot +0,99, mediaan +0,46; noord en oost lager dan zuid en
// west; gebruikt +0,3). Lokale +X is RD-oost (xAxis [1, 0]); de kop heeft een gevel recht op elke hoofdrichting
// (luchtfoto: noord- en oostgevel liggen vrijwel evenwijdig aan de RD-assen), dus hoekpilasters op 15 + 30k graden.
//
// Hoogtes uit het AHN-DSM 0,5 m (boven maaiveld): kroonlijst NAP +39,4 tot +40,0 op 9 tot 10 m van het hart (gebruikt
// 39,4 boven maaiveld); tentdak NAP +40,44 op 6,5 m, +41,76 op 2,5 m (helling 0,30); opbouwtje NAP +43,6 binnen 1 m
// van het hart (43,3). Kroonlijst van 19,4 m over de hoeken uit de luchtfoto (8 cm) en het DSM (rand tot 9,9 m). De
// geledingen uit de vrijwel frontale foto "Fiat Topolino C Giardiniera" (Joost J. Bakker, Commons; een gevel van de kop
// recht naar de camera), lineair geschaald tussen maaiveld en kroonlijst (23,35 px/m, horizontaal 22,7 tot 23,6 px/m op
// de BAG-diameter): waterlijst 6,0 tot 7,3 m, vensterrijen 1,0 tot 3,2, 9,1 tot 12,2 en 15,8 tot 18,8 m, fries 21,2 tot
// 24,0, lijst 24,0 tot 24,8, banden van de kop 26,1 tot 27,0 en 28,3 tot 30,0, overstek tot 37,1 en de kroonlijst van
// 38,5 tot 39,4 m. Tien traveeën uit de stand van de vensters en lisenen op die foto en "Watertoren Assendelft.JPG".
import { hull, union, prism, circle, ring3, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [112673.82, 497676.12];
const AXIS = [1, 0];
// De voet loopt 0,8 m door onder het maaiveld: de PDOK-grond aan de noordzijde (parkeerterrein) ligt 0,3 m lager dan
// op de groundSamplePoints aan de oost-, west- en zuidzijde, en daar moet de voet niet zweven.
const BASE = -0.8;
const GROUND_NAP = 0.3; // AHN-DTM 10 tot 16 m van het hart: mediaan +0,46, noord- en oostzijde +0,04 tot +0,43
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 in een export: 43,10 oost,
// 43,47 west, 43,66 zuid en 43,85 zuidwest (noordzijde 42,81, niet gebruikt). Geoïde circa 42,85 (PDOK-dak 86,40 bij
// 3D BAG dak_max NAP +43,55), dus 43,10 is NAP +0,25.
const GROUND_ELLIPSOID = 43.1;
const SEG = 96;
const DEG = Math.PI / 180;

const R = {
  plinth: 8.12, // onderbouw (BAG-cirkel)
  shaft: 7.95, // schacht boven de waterlijst (foto: 3,4 % smaller dan de onderbouw)
  ledge: 8.42, // waterlijst
  frieze: 8.1, // fries met boogjes
  cornice: 8.3, // lijst boven het fries
  head: 8.3, // kop over de hoeken (foto: even breed als de lijst)
  pier: 0.3, // uitsteek van de hoekpilasters
  lowBand: 0.2, // uitsteek van de smalle band
  bigBand: 0.42, // uitsteek van de brede band
  crown: 9.7, // kroonlijst over de hoeken (luchtfoto 19,4 m, DSM tot 9,9)
  roof: 9.2, // voet van het tentdak binnen de kroonlijstrand
  cabin: 1.3, // rond opbouwtje (DSM 43,6 binnen 1 m, luchtfoto ~2,6 m)
};
const H = {
  ledge: [6.0, 7.3], // waterlijst
  windows: [[1.0, 3.2], [9.1, 12.2], [15.8, 18.8]], // rondboogvensters per rij
  door: [1.2, 4.1], // deur boven de buitentrap
  frieze: [21.2, 24.0],
  cornice: [24.0, 24.8],
  lowBand: [26.1, 27.0],
  bigBand: [28.3, 30.0],
  soffit: 37.1, // overstek van de kroonlijst begint tegen de kop
  crown: [38.5, 39.4], // voorkant van de kroonlijst
  roofSlope: 0.3, // tentdak (DSM: 40,14 op 6,5 m, 41,46 op 2,5 m boven maaiveld)
  cabin: 43.3,
};
const BAYS = 10;
const WINDOW_PHASE = -2.5; // graden; vensters op -2,5 + 36k (geschat uit de stand ten opzichte van de kop)
const LISENE = { width: 0.6, out: 0.2 };

// Twaalfhoek met hoeken op 15 + 30k graden en straal r over de hoeken.
const dodeca = (r, z) => ring3(circle([0, 0], r, 12, 15 * DEG), z);
const ring = (r, z) => ring3(circle([0, 0], r, SEG), z);
// Rond lichaam tussen z0 en z1 met een kraag van 45 graden onder het uitstekende deel (vanaf straal rIn).
const collar = (rIn, rOut, z0, z1) => hull([...ring(rIn, z0 - (rOut - rIn)), ...ring(rOut, z0), ...ring(rOut, z1)]);
const dodecaCollar = (rIn, rOut, z0, z1) => hull([...dodeca(rIn, z0 - (rOut - rIn)), ...dodeca(rOut, z0), ...dodeca(rOut, z1)]);

// ---------- schacht ----------
const plinth = prism(circle([0, 0], R.plinth, SEG), BASE, H.ledge[0]);
const shaft = prism(circle([0, 0], R.shaft, SEG), H.ledge[0] - 0.5, H.cornice[1]);
const ledge = collar(R.plinth - 0.05, R.ledge, H.ledge[0] + 0.3, H.ledge[1]);
// Lisenen van 0,6 m breed en 0,2 m uit: van de voet tot het fries, over de onderbouw net zo ver uit als erboven.
const liseneAt = (deg, r, z0, z1) =>
  place(prism([[r - 0.5, -LISENE.width / 2], [r + LISENE.out, -LISENE.width / 2], [r + LISENE.out, LISENE.width / 2], [r - 0.5, LISENE.width / 2]], z0, z1), { deg });
const liseneDeg = Array.from({ length: BAYS }, (_, k) => WINDOW_PHASE + 18 + 36 * k);
const lisenen = liseneDeg.flatMap((deg) => [liseneAt(deg, R.plinth, BASE, H.ledge[0] + 0.3), liseneAt(deg, R.shaft, H.ledge[1] - 0.1, H.frieze[0] + 0.2)]);
// Fries en lijst bovenaan de schacht, elk met een kraag van 45 graden.
const frieze = collar(R.shaft, R.frieze, H.frieze[0] + (R.frieze - R.shaft), H.frieze[1]);
const cornice = collar(R.frieze, R.cornice, H.cornice[0] + (R.cornice - R.frieze), H.cornice[1]);

// ---------- kop ----------
const headWall = prism(circle([0, 0], R.head, 12, 15 * DEG), H.cornice[1] - 0.2, H.crown[1]);
// Hoekpilasters van 1,3 m breed, 0,3 m uit de hoek, met een voet van 45 graden op de lijst; boven lopen ze in het
// overstek van de kroonlijst.
const pierLocal = (() => {
  const c = R.head; // hoek op de x-as, pilaster loopt in radiale richting uit
  const sq = (r0, r1, hw, z) => [[r0, -hw, z], [r1, -hw, z], [r1, hw, z], [r0, hw, z]];
  return hull([...sq(c - 1.0, c, 0.65, H.cornice[1]), ...sq(c - 1.0, c + R.pier, 0.65, H.cornice[1] + R.pier), ...sq(c - 1.0, c + R.pier, 0.65, H.soffit + 0.5)]);
})();
const piers = Array.from({ length: 12 }, (_, k) => place(pierLocal, { deg: 15 + 30 * k }));
const lowBand = dodecaCollar(R.head, R.head + R.lowBand, H.lowBand[0] + R.lowBand, H.lowBand[1]);
const bigBand = dodecaCollar(R.head, R.head + R.bigBand, H.bigBand[0] + R.bigBand, H.bigBand[1]);
// Kroonlijst: overstek van 45 graden vanaf de kop (37,1 m), voorkant van 0,9 m, plat bovenvlak tot de dakvoet.
const crown = hull([...dodeca(R.head, H.crown[0] - (R.crown - R.head)), ...dodeca(R.crown, H.crown[0]), ...dodeca(R.crown, H.crown[1])]);
// Twaalfzijdig tentdak met helling 0,30 tot het opbouwtje.
const roofTopR = R.cabin + 0.2;
const roof = hull([...dodeca(R.roof, H.crown[1] - 0.1), ...dodeca(roofTopR, H.crown[1] + (R.roof - roofTopR) * H.roofSlope)]);
const cabin = prism(circle([0, 0], R.cabin, 32), H.crown[1], H.cabin);

// ---------- vensters en deur ----------
// Nis in het vlak met normaal +X op afstand f: 0,3 m diep, plafond onder 56 graden naar binnen oplopend.
const niche = (f, wd, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = -wd / 2, y1 = wd / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
const DOOR_BAY = 1;
const openings = [];
for (let k = 0; k < BAYS; k++) {
  const deg = WINDOW_PHASE + 36 * k;
  H.windows.forEach(([z0, z1], row) => {
    const r = row === 0 ? R.plinth : R.shaft;
    if (row === 0 && k === DOOR_BAY) openings.push(place(niche(r, 1.7, H.door[0], H.door[1]), { deg }));
    else openings.push(place(niche(r, 0.9, z0, z1), { deg }));
  });
}

const tower = union([plinth, shaft, ledge, ...lisenen, frieze, cornice, headWall, ...piers, lowBand, bigBand, crown, roof, cabin]).subtract(union(openings));

await writeLandmark({
  slug: "watertoren-assendelft",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:ronde-schacht-met-twaalfzijdige-kop", tower]],
  catalog: {
    name: "Watertoren Assendelft",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [[11, 0], [-11, 0], [0, -11], [-8, -8]],
    // Ellipsoïdisch: de PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0479100000003917"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +0,3 m), +X naar RD-oost. Ronde bakstenen schacht (16,24 m, BAG) met tien lisenen, waterlijst op 6-7,3 m, drie rijen vensters als nissen, fries en lijst tot 24,8 m; twaalfzijdige kop uit de jaren twintig met betonnen hoekpilasters, een smalle en een brede band, een kroonlijst van 19,4 m met overstek van 45 graden tot 39,4 m, een twaalfzijdig tentdak en een rond opbouwtje tot 43,3 m. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 41.85,
      reservoirM3: 1200,
      originalHeightM: 31.4,
      built: "1885, kop jaren twintig",
      architect: "D. de Leeuw",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 43.6,
      shaftDiameterM: R.plinth * 2,
      crownAcrossCornersM: R.crown * 2,
      ledgeM: H.ledge,
      friezeM: H.frieze,
      headBandsM: [H.lowBand, H.bigBand],
      crownM: H.crown,
      cabinTopM: H.cabin,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Assendelft) (1885, D. de Leeuw, 41,85 m, 1200 m³; oorspronkelijk 31,4 m en 540 m³, kop vernieuwd in de jaren twintig)",
      "https://commons.wikimedia.org/wiki/File:Fiat_Topolino_C_Giardiniera_-_Flickr_-_Joost_J._Bakker_IJmuiden.jpg (vrijwel frontaal: geledingen, traveeën, deur)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Assendelft.JPG en File:Watertoren_assendelft2.jpg (schuin van onderen: kop, pilasters, banden, fries, kroonlijst en opbouw)",
      "PDOK BAG-pand 0479100000003917 (BGT G0479.2e2bbf7742ff00fee0530a324301a3ef), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});
