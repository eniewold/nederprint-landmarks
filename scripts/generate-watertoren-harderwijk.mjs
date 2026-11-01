// Watertoren van Harderwijk (D. de Leeuw, 1895), gemeentelijk monument, 15,85 m
// met een reservoir van 336 m³, in het bos aan de Stort. Lage, brede ronde
// bakstenen toren zonder aparte schacht: een plint, tien lisenen met
// verdiepte velden in drie geledingen (rondboognissen en de deur onderin,
// segmentbogen boven een natuurstenen band, vlakke velden onder een
// kroonlijst), een gladde attiek met een luik en een afdekband om een plat
// dak.
// Oorsprong op het hart van de dakrand in het AHN (cirkelfit, binnen 0,3 m van
// het hart van BAG-pand 0243100001326183) op maaiveld (NAP +19,30 m), assen in
// RD-richting. Hoogtes en breedtes uit de frontale foto "Harderwijk Watertoren
// 2007" (Olympus C-8080): een cilindrische camera teruggerekend op de voet, de
// dakrand (AHN 14,95 m boven maaiveld) en de breedte onder en boven, wat een
// straal van 5,09 m over de lisenen gaf; de camera stond circa 26 m van het hart.
// De lisenen staan op 36 graden (tien vakken; op de foto 36,0 graden tussen de
// vier middelste), de deur midden in een vak. Welke kant de deur op kijkt, toont
// geen bron: op de foto staat een grote spar rechts achter de toren en op de
// luchtfoto staat er een ten noorden ervan, dus de deur staat naar het zuiden,
// naar de open plek en het pad.
import { Manifold, CrossSection, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [173216.65, 482906.48];
const AXIS = [1, 0];
const BASE = -0.3;
const SEG = 120;
const DOOR = 270; // graden linksom vanaf RD-oost: naar het zuiden
const BAYS = Array.from({ length: 10 }, (_, k) => DOOR + k * 36); // vakken tussen de lisenen
const R = { plinth: 5.2, lisene: 5.05, field: 4.8, band: 5.17, cornice: 5.2, coping: 5.13, roof: 4.2 };
const LISENE_W = 0.7; // op de foto 0,6 m; iets breder voor de print
const HALF = 18 - (LISENE_W / R.lisene / 2) * (180 / Math.PI); // halve hoek van een veld (14,0 graden)
const H = {
  plinth: 0.45, // bovenkant van de plint, schuine waterlijst tot 0,72
  low: 0.62, // voet van de onderste velden
  bandFoot: 5.45, // schuine onderkant van de natuurstenen band
  band: 6.2,
  spring: 7.78, // segmentbogen van de middelste velden
  crest: 8.32,
  upper: 8.72, // voet van de bovenste velden
  corniceFoot: 12.45, // schuine onderkant van de kroonlijst
  cornice: 12.95,
  copingFoot: 14.75,
  roof: 14.53, // plat dak (AHN NAP +33,83)
  top: 14.95, // afdekband (AHN NAP +34,25)
};

const ring = (pts) => Manifold.revolve(new CrossSection([pts]), SEG);

// ---------- wand op de lisenen, met verdiepte velden ----------
// Een veld is een snijder met een plafond dat naar binnen onder 56 graden
// oploopt: z = top(t) + 1,5 (R.lisene - r). Doorsneden met een ring tussen het
// veldvlak en buiten, zodat de velden rond blijven.
const field = (z0, top) => {
  const rf = R.lisene + 0.6, rb = R.field - 0.4, pts = [];
  for (let k = 0; k <= 12; k++) {
    const s = ((-HALF + (2 * HALF * k) / 12) * Math.PI) / 180, t = R.lisene * Math.sin(s), z = top(t);
    for (const [r, zt] of [[rf, z - 1.5 * (rf - R.lisene)], [rb, z + 1.5 * (R.lisene - rb)]]) {
      pts.push([r * Math.cos(s), r * Math.sin(s), z0], [r * Math.cos(s), r * Math.sin(s), zt]);
    }
  }
  return hull(pts);
};
const sag = H.crest - H.spring, chord = R.lisene * Math.sin((HALF * Math.PI) / 180), arcR = (chord ** 2 + sag ** 2) / (2 * sag);
const fields = union(
  BAYS.flatMap((deg) => [
    place(field(H.low, () => H.bandFoot), { deg }),
    place(field(H.band, (t) => H.crest - arcR + Math.sqrt(Math.max(arcR ** 2 - t ** 2, 0))), { deg }),
    place(field(H.upper, () => H.corniceFoot), { deg }),
  ]),
).intersect(ring([[R.field, 0], [R.lisene + 2, 0], [R.lisene + 2, 14], [R.field, 14]]));
const wall = ring([[0, BASE], [R.lisene, BASE], [R.lisene, H.top], [0, H.top]]).subtract(fields);

// ---------- plint, band, kroonlijst en afdekband als ringen ----------
// Schuine onderkanten onder 56 graden; boven het veldplafond (1,5 x 0,25 m).
// De schuine onderkant begint 0,03 m binnen de wand, zodat er geen
// samenvallende vlakken met de lisenen ontstaan.
const IN = R.lisene - 0.03;
const rings = union([
  ring([[4.3, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.field, 0.72], [4.3, 0.72]]),
  ring([[4.3, H.bandFoot + 0.4], [IN, H.bandFoot + 0.4], [IN, H.bandFoot - 0.045], [R.band, H.bandFoot + 0.18], [R.band, H.band], [4.3, H.band]]),
  ring([[4.3, H.corniceFoot + 0.4], [IN, H.corniceFoot + 0.4], [IN, H.corniceFoot - 0.045], [R.cornice, H.corniceFoot + 0.225], [R.cornice, H.cornice], [4.3, H.cornice]]),
  ring([[4.3, H.copingFoot - 0.045], [IN, H.copingFoot - 0.045], [R.coping, H.copingFoot + 0.12], [R.coping, H.top], [4.3, H.top]]),
]);

// ---------- deur, blinde vensters, luik en dak ----------
// Rondboognis in het vlak met normaal +X op afstand f; het plafond loopt naar
// binnen onder 56 graden op, de voorkant zakt even steil weg (niet onder z0).
const archNiche = (f, w, z0, zs, depth) => {
  const a = f - depth, b = f + 1.0, r = w / 2, pts = [];
  for (const y of [-r, r]) pts.push([a, y, z0], [b, y, z0]);
  for (let k = 0; k <= 12; k++) {
    const t = (Math.PI * k) / 12, y = r * Math.cos(t), z = zs + r * Math.sin(t);
    pts.push([a, y, z + 1.5 * depth], [f, y, z], [b, y, Math.max(z0, z - 1.5 * (b - f))]);
  }
  return hull(pts);
};
const cuts = union([
  // Deur van 1,4 m in een rondboog tot 3,21 m, in een omlijsting van 1,9 m tot 3,48 m.
  place(archNiche(R.field, 1.9, 0, 2.53, 0.25), { deg: DOOR }),
  place(archNiche(R.field - 0.25, 1.4, 0, 2.51, 0.3), { deg: DOOR }),
  // In elk ander onderste veld een blind rondboogvenster van 0,82 m, 1,27 tot 3,43 m.
  ...BAYS.filter((deg) => deg !== DOOR).map((deg) => place(archNiche(R.field, 0.82, 1.27, 3.02, 0.3), { deg })),
  // Luik in de attiek boven de deur, 0,69 m, 12,96 tot 14,03 m.
  place(archNiche(R.lisene, 0.69, 12.96, 13.69, 0.3), { deg: DOOR }),
  // Plat dak binnen de borstwering. In het AHN ligt de binnenrand op r 4,25 tot
  // 4,6 m; met 0,85 m dikte wordt de borstwering in de export niet verdikt tot
  // de afdekband.
  ring([[0, H.roof], [R.roof, H.roof], [R.roof, H.top + 1], [0, H.top + 1]]),
]);

const body = union([wall, rings]).subtract(cuts);

await writeLandmark({
  slug: "watertoren-harderwijk",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:toren-met-lisenen-banden-en-dakrand", body]],
  catalog: {
    name: "Watertoren Harderwijk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6.7, 0], [-6.7, 0], [0, 6.7], [0, -6.7]],
    replacesBuildings: ["NL.IMBAG.Pand.0243100001326183"],
    description:
      "Oorsprong op het hart van de dakrand in het AHN op maaiveld (NAP +19,30 m), assen in RD-richting. Ronde bakstenen toren van 10,1 m over tien lisenen op een plint, met verdiepte velden in drie geledingen: blinde rondboogvensters en een deur naar het zuiden onderin, een natuurstenen band op 6,2 m, segmentbogen tot 8,3 m, vlakke velden onder een kroonlijst op 12,95 m, een gladde attiek met een luik en een afdekband tot 14,95 m om een plat dak op 14,53 m binnen een borstwering van 0,85 m. Maten uit AHN, BAG en één frontale foto.",
    realWorld: {
      publishedHeightM: 15.85,
      reservoirM3: 336,
      ahnGroundNapM: 19.3,
      ahnRoofNapM: 33.83,
      ahnRimNapM: 34.25,
      bagAreaM2: 80.2,
      diameterOverLisenesM: 10.1,
      fieldDiameterM: 9.6,
      lisenes: 10,
      bandM: [5.45, 6.2],
      archesM: [7.78, 8.32],
      corniceM: 12.95,
      roofM: 14.53,
      modelTopM: 14.95,
      photoCameraDistanceM: 26,
      roofInnerRadiusM: 4.2,
      minimumPartM: 0.7,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Harderwijk)",
      "https://commons.wikimedia.org/wiki/File:Harderwijk_Watertoren_2007.JPG (frontale foto: opbouw, hoogtes en breedtes)",
      "PDOK BAG-pand 0243100001326183, AHN DSM/DTM 0,5 m en luchtfoto's 2021-2025, 2026-11-01",
    ],
  },
});
