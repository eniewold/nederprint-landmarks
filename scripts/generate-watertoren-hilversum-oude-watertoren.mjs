// Oude watertoren van Hilversum aan de Jacobus Pennweg 16 (Trompenberg), gebouwd in 1893 voor de Utrechtsche
// Waterleiding Maatschappij naar ontwerp van de Compagnie Générale des Conduites d'Eau (Luik), in neoromaanse stijl;
// rijksmonument 522815, één reservoir van 600 m³ en 10 m doorsnede, 24,5 m hoog (Wikipedia), in 1944 beschadigd en in
// 2000 in de oude staat hersteld. Een ronde bakstenen toren: een iets breder basement met deur en getoogde vensters
// onder een natuurstenen kroonlijst; daarboven tien lisenen met kapitelen die rondbogen dragen (een blinde arcade
// van tien traveeën, in om en om een travee een smal rondboogvenster), dan een tandlijst, een rondboogfries, een
// band met ronde venstertjes (oculi) en een kroonlijst; bovenop een flauw twaalfzijdig leien tentdak achter een
// vlakke rand, met een zinken makelaar.
//
// Oorsprong op het hart van de ronde BAG-contour van pand 0402100001485425 (cirkel r 5,94 m, afwijking 6 cm; de
// BGT-contour is gelijk) op maaiveld (AHN-DTM NAP +25,77 tussen 9 en 12 m van het hart; 3D BAG-maaiveld 25,74).
// Lokale +X wijst naar de deur: de travee met de deur staat naar het westen, 174 graden linksom vanaf RD-oost
// (geschat uit de RCE-foto 20284790 vanaf het kruispunt in het noordwesten, met het BP-station rechts, de deur 30 graden
// rechts van het hart en de stand van de lisenen; onzeker op circa 15 graden). Lisenen op 18 + 36k graden, traveeën op 36k.
// Maten: de straal van het basement uit de BAG; de schacht, de kroonlijst en de kapitelen als verhouding tot het
// basement op de frontale RCE-foto (schacht 0,944, kroonlijst 0,978 van het basement; het AHN-DSM tekent de rand
// 0,25 m te breed). Hoogtes: gevelrand NAP +43,54 (3D BAG dak_min, AHN-DSM 43,5 tot 43,6) = 17,77 m; het tentdak
// in het AHN-DSM 45 graden (1,0 m per m van r 1 tot 4,5) tot de top op NAP +48,3 (3D BAG dak_max 48,2), de makelaar
// tot NAP +51,07 (DSM). De geledingen (basement, kroonlijst, kapitelen, bogen, friezen, oculi) uit de frontale
// RCE-foto met een lineaire schaal tussen maaiveld en gevelrand; breedtes van deur, vensters en nissen uit de foto's.
import { Manifold, CrossSection, hull, union, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [139746.22, 471809.12];
const DEG = 174;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 25.77; // AHN-DTM 25,65 tot 25,84 tussen 9 en 12 m van het hart
const GROUND_ELLIPSOID = 68.97; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 (68,97 tot 69,12; NAP +25,77 + 43,16)

const R = {
  plinth: 5.94, // basement (BAG)
  plinthCornice: 6.08, // kroonlijst op het basement
  wall: 5.65, // lisenen en wand boven de bogen (foto: 0,944 van het basement)
  bay: 5.45, // achterwand van de blinde arcade, 0,2 m achter de lisenen
  dentil: 5.75, // tandlijst
  string: 5.73, // band tussen rondboogfries en oculi
  cornice: 5.85, // kroonlijst (foto: 0,978 van het basement; AHN-DSM 6,05 met 0,25 m uitloop)
  capital: 5.8, // kapitelen 0,15 m voor de lisenen
  roof: 4.95, // voet van het tentdak (twaalfhoek, hoekpunten); vlakke rand tot de kroonlijst
};
const H = {
  corniceFoot: 3.94, // onderkant van de kroonlijst van het basement (kraag onder 45 graden)
  corniceTop: 4.55,
  shaftFoot: 4.78, // bovenkant van de waterslag, voet van de lisenen
  capitalFoot: 10.55, // kapitelen tot de aanzet van de bogen
  spring: 11.77, // aanzet van de rondbogen
  dentil: [13.55, 14.2], // tandlijst
  arcade: [14.35, 15.15], // rondboogfries: voet en aanzet (top 15,575)
  string: [15.76, 15.95],
  oculus: 16.4, // hart van de oculi
  cornice: [16.95, 17.15], // kraag van de kroonlijst
  rim: 17.77, // gevelrand (3D BAG NAP +43,54)
  apex: 22.55, // top van het tentdak (NAP +48,32)
  postTop: 23.7, // makelaar 0,9 m dik
  finial: 25.25, // punt van de makelaar (AHN NAP +51,07)
};

// ---------- omwentelingslichaam: basement, kroonlijsten, banden ----------
const profile = [
  [0, BASE],
  [R.plinth, BASE],
  [R.plinth, H.corniceFoot],
  [R.plinthCornice, H.corniceFoot + (R.plinthCornice - R.plinth)],
  [R.plinthCornice, H.corniceTop],
  [R.wall, H.shaftFoot],
  [R.wall, H.dentil[0] - (R.dentil - R.wall)],
  [R.dentil, H.dentil[0]],
  [R.dentil, H.dentil[1]],
  [R.wall, H.dentil[1]],
  [R.wall, H.string[0] - (R.string - R.wall)],
  [R.string, H.string[0]],
  [R.string, H.string[1]],
  [R.wall, H.string[1]],
  [R.wall, H.cornice[0]],
  [R.cornice, H.cornice[1]],
  [R.cornice, H.rim],
  [0, H.rim],
];
const body = Manifold.revolve(new CrossSection([profile]), 120);

// ---------- delen op de ring: lokaal x = radiaal vanaf straal r0, y = booglengte op r0 ----------
const onRing = (solid, r0, deg) =>
  solid
    .refineToLength(0.25)
    .warp((v) => {
      const a = v[1] / r0 + (deg * Math.PI) / 180, r = r0 + v[0];
      v[0] = r * Math.cos(a);
      v[1] = r * Math.sin(a);
    });
// Rondboognis in het vlak x = face, breedte wd, van z0 tot de aanzet z1 met een halve cirkel erboven, `depth` diep.
// De achterwand ligt 1,5 × depth lager dan de voorkant: het plafond loopt onder 56 graden op naar buiten, zodat de
// nis zonder steun te printen is (ook in de top van de boog).
const archNiche = (face, wd, z0, z1, depth) => {
  const outline = (drop) => {
    const pts = [[-wd / 2, z0], [wd / 2, z0]];
    for (let i = 0; i <= 12; i++) {
      const t = (i / 12) * Math.PI;
      pts.push([(wd / 2) * Math.cos(t), z1 - drop + (wd / 2) * Math.sin(t)]);
    }
    return pts;
  };
  const front = outline(0), back = outline(1.5 * depth);
  return hull([
    ...front.map(([y, z]) => [face + 0.6, y, z]),
    ...front.map(([y, z]) => [face, y, z]),
    ...back.map(([y, z]) => [face - depth, y, Math.max(z, z0)]),
  ]);
};
// Achthoekige nis (oculus) met hetzelfde hellende plafond.
const octNiche = (face, rad, zc, depth) => {
  const oct = (drop) => Array.from({ length: 8 }, (_, i) => {
    const t = ((i + 0.5) * Math.PI) / 4;
    return [rad * Math.cos(t), zc - drop + rad * Math.sin(t)];
  });
  return hull([
    ...oct(0).map(([y, z]) => [face + 0.4, y, z]),
    ...oct(0).map(([y, z]) => [face, y, z]),
    ...oct(1.5 * depth).map(([y, z]) => [face - depth, y, z]),
  ]);
};

const BAY = (2 * Math.PI * R.wall) / 10; // 3,55 m booglengte per travee op de lisenen
const PILASTER = 1.1; // lisene 1,1 m breed (foto)
const cuts = [];
for (let k = 0; k < 10; k++) {
  const deg = 36 * k;
  // Blinde arcade: nis tussen de lisenen, 0,2 m diep, rondboog met top op 13,0 m.
  cuts.push(onRing(archNiche(0, BAY - PILASTER, H.shaftFoot, H.spring, R.wall - R.bay), R.wall, deg));
  // Om en om een smal rondboogvenster in de achterwand (0,6 m breed in het echt 0,45; 7,1 tot 10,15 m), in de
  // travee met de deur en de traveeën op 72, 144, 216 en 288 graden.
  if (k % 2 === 0) cuts.push(onRing(archNiche(R.bay - R.wall, 0.6, 7.1, 9.85, 0.25), R.wall, deg));
  // Rondboogfries: twee nissen van 0,85 m per travee (in het echt vier van 0,5 m), penanten van 0,93 m.
  for (const s of [-BAY / 4, BAY / 4]) cuts.push(onRing(archNiche(0, 0.85, H.arcade[0], H.arcade[1], 0.2).translate([0, s, 0]), R.wall, deg));
  // Oculus boven het hart van elke travee, 0,84 m.
  cuts.push(onRing(octNiche(0, 0.42, H.oculus, 0.2), R.wall, deg));
  // Basement: deur in travee 0 (1,6 m breed, 3,1 m hoog met bovenlicht), getoogde vensters (1,1 m, 0,5 tot 2,55 m) in
  // de oneven traveeën; geschaald naar booglengte op het basement.
  const sp = R.wall / R.plinth;
  if (k === 0) cuts.push(onRing(archNiche(0, 1.6, 0, 2.3, 0.35).scale([1, sp, 1]), R.plinth, deg));
  else if (k % 2 === 1) cuts.push(onRing(archNiche(0, 1.1, 0.5, 2.0, 0.3).scale([1, sp, 1]), R.plinth, deg));
}

// Kapitelen op de lisenen: 1,3 m breed, 0,15 m voor de lisene, kraag van 45 graden eronder.
const capital = hull([
  ...[-0.1, 0].flatMap((x) => [-PILASTER / 2, PILASTER / 2].map((y) => [x, y, H.capitalFoot - 0.15])),
  ...[-0.1, R.capital - R.wall].flatMap((x) => [-0.65, 0.65].flatMap((y) => [[x, y, H.capitalFoot], [x, y, H.spring]])),
]);
const capitals = Array.from({ length: 10 }, (_, k) => onRing(capital, R.wall, 18 + 36 * k));

// ---------- tentdak en makelaar ----------
const ring12 = (r, z, phase = 0) => Array.from({ length: 12 }, (_, i) => {
  const t = phase + (i * Math.PI) / 6;
  return [r * Math.cos(t), r * Math.sin(t), z];
});
const roof = hull([...ring12(R.roof, H.rim - 0.05), [0, 0, H.apex]]);
const oct = (r, z) => Array.from({ length: 8 }, (_, i) => [r * Math.cos(((i + 0.5) * Math.PI) / 4), r * Math.sin(((i + 0.5) * Math.PI) / 4), z]);
const finial = hull([...oct(0.45, H.apex - 0.6), ...oct(0.45, H.postTop), [0, 0, H.finial]]);

const tower = union([body.subtract(union(cuts)), ...capitals, roof, finial]);

await writeLandmark({
  slug: "watertoren-hilversum-oude-watertoren",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:basement-arcade-friezen-en-tentdak", tower]],
  catalog: {
    name: "Oude watertoren Hilversum",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: Array.from({ length: 8 }, (_, k) => [+(7.5 * Math.cos((k * Math.PI) / 4)).toFixed(2), +(7.5 * Math.sin((k * Math.PI) / 4)).toFixed(2)]),
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0402100001485425"],
    description:
      "Oorsprong op het hart van de ronde BAG-contour op maaiveld (NAP +25,77 m), +X naar de deur (west, 174 graden linksom vanaf RD-oost, geschat). Rond basement van 11,9 m met deur, vijf getoogde vensters en een kroonlijst op 4,55 m; schacht van 11,3 m met tien lisenen en kapitelen onder een blinde rondboogarcade, vijf smalle rondboogvensters, tandlijst, rondboogfries, band en tien oculi; kroonlijst van 11,7 m tot de gevelrand op 17,77 m; twaalfzijdig tentdak van 45 graden tot 22,55 m met een makelaar tot 25,25 m. Maten uit BAG, AHN, 3D BAG en foto's.",
    realWorld: {
      publishedHeightM: 24.5,
      reservoirM3: 600,
      reservoirDiameterM: 10,
      built: 1893,
      designer: "Compagnie Générale des Conduites d'Eau (Luik)",
      monument: 522815,
      ahnGroundNapM: GROUND_NAP,
      bag3dRimNapM: 43.54,
      bag3dRoofMaxNapM: 48.2,
      ahnTopNapM: 51.07,
      plinthDiameterM: 2 * R.plinth,
      shaftDiameterM: 2 * R.wall,
      corniceDiameterM: 2 * R.cornice,
      plinthCorniceM: H.corniceTop,
      springM: H.spring,
      rimM: H.rim,
      apexM: H.apex,
      finialM: H.finial,
      bays: 10,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Oude_watertoren_(Hilversum) (1893, Compagnie Générale des Conduites d'Eau, 24,5 m, 600 m³, 10 m doorsnede, neoromaans)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/522815",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Hilversum_-_20284790_-_RCE.jpg (frontaal vanaf het noordwesten met de deur: geledingen, breedteverhoudingen, stand van de lisenen)",
      "https://commons.wikimedia.org/wiki/File:Hilversum_Watertoren_8441.JPG en File:522815-Oude_watertoren.jpg (schuin: basement met kroonlijst, arcade, friezen, oculi, tentdak en makelaar)",
      "PDOK BAG-pand 0402100001485425 en BGT-pand G0402.410674483c8e459fac56575b5a7fa756 (ronde contour r 5,94 m), AHN DSM/DTM 0,5 m, luchtfoto (twaalf dakvlakken) en 3D BAG (AHN5 2023), 2026-11-04",
    ],
  },
});
