// Watertoren aan de Amstelveenseweg in Amsterdam (Buitenveldert, bij het pompstation van Waternet): 1965, ontwerp
// Piet Elling. Volgens Wikipedia 40 m hoog met één stalen reservoir van 2335 m³ in een aluminium mantel. Een ronde
// betonnen kern met zes vrijstaande ronde kolommen eromheen draagt een omgekeerde kegelstomp: het reservoir in de
// aluminium mantel met staande naden, onder op een betonnen ringbalk. Op het vrijwel vlakke dak staat een
// achtkantig glazen opbouwtje met een dun overstekend dak en een hekwerk.
//
// Oorsprong op het midden van de ronde BAG-contour (pand 0363100012216977, cirkelfit straal 8,74 m: de rand van het
// reservoir van boven gezien) op maaiveld (AHN-DTM in een ring van 10 tot 16 m NAP +0,69 tot +0,87, mediaan +0,79).
// De toren is rond: +X loopt langs RD-oost.
//
// Hoogtes uit het AHN-DSM (0,5 m): dakrand van het reservoir NAP +36,45 (r 8,5), het dak loopt flauw op naar
// +36,86 op 4,25 m uit het hart (helling 0,08); dakrand van het opbouwtje +39,7 op 3,5 m, top +40,06 in het hart.
// Opbouwtje en zijn oriëntatie uit de luchtfoto (8 cm): achthoek van 7,3 m over de hoeken, een hoek op -8 graden
// (net onder RD-oost). De rest uit de telefoto Amsterdam Watertoren Amstelveenseweg (Commons, 270 mm-equivalent van
// circa 250 m: vrijwel orthografisch), geschaald op de bovenrand van het reservoir (17,48 m, BAG): onderkant mantel
// 20,25 m onder de dakrand, onderzijde 13,4 m breed, ringbalk 0,75 m, kolommen 1,07 m dik op een kring van 5,06 m,
// kern 6,6 m, venster in de kern circa 3 m onder de ringbalk. Zes kolommen uit de stand van vier zichtbare kolommen op
// twee foto's; hun richting rond de toren is niet bekend (geschat).
import { hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [118826.29, 483272.19];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 0.8; // AHN-DTM in een ring van 10 tot 16 m: mediaan 0,79
const GEOID_N = 43.05; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 96;
const DEG = Math.PI / 180;

// Stralen.
const R = {
  core: 3.3, // betonnen kern (telefoto 6,6 m)
  columnRing: 5.06, // hart van de kolommen (telefoto: buitenkant 5,59)
  column: 0.535, // kolomdikte 1,07 m
  ringBeam: 6.45, // betonnen ringbalk onder het reservoir
  tankFoot: 6.68, // onderkant van de mantel (telefoto 13,36 m)
  tankTop: 8.74, // bovenrand (BAG-cirkel)
  roofTop: 3.0, // waar het opbouwtje op het dak staat
  lantern: 2.98, // opbouwtje over de hoeken (telefoto: 355/435 van de dakrand)
  lanternRoof: 3.65, // dakrand van het opbouwtje over de hoeken (luchtfoto 7,3 m)
};
const ROOF_SLOPE = 0.08; // AHN: NAP +36,86 op 4,25 m, +36,53 op 8,25 m
const H = {
  coreCone: 11.75, // waar de kraag van 45 graden onder de reservoirbodem de kern raakt
  ringBeam: [14.9, 15.17], // vertikale rand van de ringbalk
  tankFoot: 15.4, // onderkant van de mantel (dakrand - 20,25)
  rim: 35.65, // dakrand van het reservoir (AHN NAP +36,45)
  lanternFoot: 36.0,
  glass: [36.8, 37.7], // glasband als nis
  lanternCollar: 37.73, // kraag van 45 graden onder het dak van het opbouwtje
  lanternEave: [38.4, 38.9], // dakrand (AHN NAP +39,7)
  top: 39.26, // AHN NAP +40,06
};
const LANTERN_PHASE = -8 * DEG; // hoek van de achthoek (luchtfoto)
const COLUMN_PHASE = 0; // kolommen op 0, 60, ..., 300 graden (richting geschat)
const roofZ = (r) => H.rim + (R.tankTop - r) * ROOF_SLOPE;

const ring = (r, z, n = SEG, phase = 0) => ring3(circle([0, 0], r, n, phase), z);
const oct = (r, z) => ring(r, z, 8, LANTERN_PHASE);

// Nis in het vlak met normaal +X: achterwand op rFace - depth, plafond loopt naar binnen op onder 56 graden.
const niche = (rFace, depth, w, z0, z1) => hull([-w / 2, w / 2].flatMap((y) => [
  [rFace - depth, y, z0], [rFace - depth, y, z1 + 1.5 * depth],
  [rFace + 1.0, y, z0], [rFace + 1.0, y, Math.max(z0, z1 - 1.5)],
]));

// ---------- kern en zes kolommen ----------
const core = hull([...ring(R.core, BASE), ...ring(R.core, H.coreCone + 0.3)]);
const column = hull([...ring(R.column, BASE, 24), ...ring(R.column, H.ringBeam[0], 24)]);
const columns = Array.from({ length: 6 }, (_, k) => place(column, { at: [R.columnRing, 0, 0], deg: 0 }).rotate([0, 0, COLUMN_PHASE + 60 * k]));

// ---------- reservoirbodem en ringbalk ----------
// In het echt een vlakke bodem op kern en kolommen; hier een kraag van 45 graden van de ringbalk naar de kern, zodat
// de overspanning tussen de kolommen zonder steun te printen is. De kolommen steken er aan de buitenkant tot 14,0 m uit.
const bottom = hull([...ring(R.core - 0.02, H.coreCone), ...ring(R.ringBeam, H.ringBeam[0]), ...ring(R.ringBeam, H.ringBeam[1] + 0.03)]);

// ---------- reservoir in de aluminium mantel en dak ----------
// Mantel: kegelstomp van 13,36 m onder naar 17,48 m boven (wand 5,8 graden uit het lood), met een schuine overgang van
// 45 graden van de ringbalk; dak een flauwe kegel (helling 0,08) tot het opbouwtje.
const tank = hull([
  ...ring(R.ringBeam, H.ringBeam[1]),
  ...ring(R.tankFoot, H.tankFoot),
  ...ring(R.tankTop, H.rim),
  ...ring(R.roofTop, roofZ(R.roofTop)),
]);

// ---------- achtkantig opbouwtje ----------
const lanternBody = hull([...oct(R.lantern, H.lanternFoot), ...oct(R.lantern, H.lanternCollar + 0.02)]);
const lanternCollar = hull([...oct(R.lantern - 0.02, H.lanternCollar), ...oct(R.lanternRoof, H.lanternEave[0] + 0.01)]);
const lanternRoof = hull([...oct(R.lanternRoof, H.lanternEave[0]), ...oct(R.lanternRoof, H.lanternEave[1]), [0, 0, H.top]]);
// Glasband: per zijde één nis van 1,7 m breed en 0,9 m hoog, 0,3 m diep.
const apothem = R.lantern * Math.cos(Math.PI / 8);
const glassCuts = Array.from({ length: 8 }, (_, k) =>
  place(niche(apothem, 0.3, 1.7, H.glass[0], H.glass[1]), { deg: LANTERN_PHASE / DEG + 22.5 + 45 * k }));

// ---------- venster in de kern, naar het zuiden tussen twee kolommen ----------
const coreWindow = place(niche(R.core, 0.35, 1.8, 10.6, 11.5), { deg: -90 });

const tower = union([core, ...columns, bottom, tank, lanternBody, lanternCollar, lanternRoof])
  .subtract(union([...glassCuts, coreWindow]));

await writeLandmark({
  slug: "watertoren-amsterdam-amstelveenseweg",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:kern-kolommen-reservoir-en-opbouw", tower]],
  catalog: {
    name: "Watertoren Amstelveenseweg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    // Ellipsoïdisch: NAP +0,80 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0363100012216977"],
    description:
      "Oorsprong op het midden van de ronde BAG-contour op maaiveld (NAP +0,80 m), +X langs RD-oost. Ronde betonnen kern van 6,6 m met zes vrijstaande kolommen van 1,07 m op een kring van 10,1 m, een kraag van 45 graden onder de reservoirbodem naar een ringbalk van 12,9 m, een omgekeerde kegelstomp (aluminium mantel) van 13,36 m op 15,4 m naar 17,48 m op 35,65 m, een flauw kegeldak en een achtkantig opbouwtje met glasband en overstekend dak tot 39,26 m. Maten uit BAG, AHN, luchtfoto en telefoto; richting van de kolommen geschat.",
    realWorld: {
      publishedHeightM: 40,
      reservoirM3: 2335,
      built: 1965,
      architect: "Piet Elling",
      ahnGroundNapM: GROUND_NAP,
      ahnRimNapM: 36.45,
      ahnMaxNapM: 40.06,
      geoidNlgeo2018M: GEOID_N,
      coreDiameterM: 2 * R.core,
      columns: 6,
      columnDiameterM: 2 * R.column,
      columnRingDiameterM: 2 * R.columnRing,
      tankDiameterM: [2 * R.tankFoot, 2 * R.tankTop],
      tankM: [H.tankFoot, H.rim],
      lanternRoofDiameterM: 2 * R.lanternRoof,
      modelTopM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_Amstelveenseweg (1965, Piet Elling, 40 m, 2335 m³, stalen reservoir in aluminium mantel)",
      "https://commons.wikimedia.org/wiki/File:Amsterdam_Watertoren_Amstelveenseweg.jpg (telefoto: verhoudingen van mantel, ringbalk, kolommen, kern, venster en opbouwtje)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Amstelveenseweg_-_panoramio.jpg (kolommen voor de kern, ringbalk)",
      "PDOK BAG-pand 0363100012216977, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,05 m) voor groundHeight",
    ],
  },
});
