// Watertoren van Nieuw-Lekkerland aan de Lekdijk. Gebouwd in 1915 door Visser & Smit (Hanab), 34 m hoog volgens Wikipedia
// (gemeten boven het maaiveld aan de voet 30,4 m), reservoir 400 m³; gemeentelijk monument, sinds 2010 een woning. Een
// zeskante betonnen schacht met hoeklisenen die onderaan breder zijn, drie lijsten die de schacht in vier geledingen delen,
// ruitvormige vensters (afwisselend in de tweede en derde geleding), een deur en vensters aan de voet en onder het reservoir
// een uitgebouwde erker aan de dijkzijde. Het ronde reservoir kraagt met een bolle bodem uit over de schacht; de lisenen lopen
// als consoles en ribben door tot de platte bovenkant; in elk van de zes velden een paar hoge spleetvensters (foto's).
//
// Oorsprong op het hart van de zeskante BAG-voetafdruk van pand 0571100000000425 (zwaartepunt; de hoeken van de zeshoek
// liggen op -107 + k maal 60 graden RD, apothema 4,69 m, hoekstraal 5,42 m; de lisenen steken tot 5,75 m uit, 0,66 m breed).
// Lokale X-as 77 graden rechtsom van RD-oost, loodrecht op het vlak naar de Lekdijk (zuidzuidoost) met de deur en de erker;
// de vlakken staan dan op k maal 60 graden, de hoeken op 30 + k maal 60. Hoeken hieronder in graden linksom vanaf de X-as.
// Maaiveld AHN-DTM NAP +3,05 (de toren staat binnendijks naast de Lekdijk, die op NAP +3,1 à +3,3 ligt).
// Maten: platte bovenkant in het AHN-DSM 0,5 m op NAP +33,35, rand +33,45; reservoir 11 m doorsnede (DSM, luchtfoto 11,7 m
// over de rand); de schacht, lijsten, erker, vensters en lisenen uit de foto's "Overzicht watertoren - Nieuw-Lekkerland -
// 20276806 - RCE.jpg" (vanaf de Lekdijk, bijna frontaal; schaal 0,05 m per pixel op de reservoirbreedte en de AHN-hoogte),
// "Watertoren Nieuw Lekkerland.jpg" (vanaf de Lek, noordzijde) en "... 20335214 - RCE.jpg" (kleur, oostzuidoosten).
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [107344.8, 434004.91];
const AXIS_DEG = -77;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.05;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de zes groundSamplePoints (7 m voor elk vlak), gemeten 2026-11-07: 46,687 aan
// de dijkzijde, 46,72 tot 46,80 rondom. Het PDOK-pand staat op 46,66 met de bovenkant op 76,9 (30,25 m hoog).
const GROUND_ELLIPSOID = 46.69;

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const FACES = [0, 60, 120, 180, 240, 300];
const CORNERS = FACES.map((d) => d + 30);
const hexagon = (cornerR) => CORNERS.map((d) => polar(cornerR, d));
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Ruitvenster als nis: 1,0 m breed en 1,3 m hoog (randen onder 52 graden), 0,3 m diep, hart op hoogte zc.
const diamond = (f, zc, w = 1.0, h = 1.3, depth = 0.3) =>
  hull([f - depth, f + 1.0].flatMap((x) => [[x, 0, zc - h / 2], [x, -w / 2, zc], [x, w / 2, zc], [x, 0, zc + h / 2]]));

// ---------- hoogtes boven het maaiveld (NAP +3,05) ----------
const H = {
  foot: 9.3, // de lisenen zijn tot de tweede geleding breder (foto: verspringing ter hoogte van de onderste ruiten)
  bands: [6.2, 12.4, 18.6], // drie lijsten (foto: geledingen van circa 6,2 m)
  shaftTop: 20.6, // begin van de bolle reservoirbodem
  reservoir: 21.9, // onderkant van de reservoirwand (foto, zijkant: 22,1)
  roof: 30.25, // plat dak (AHN NAP +33,35 à +33,3)
  rim: 30.4, // rand van het dak (AHN NAP +33,45)
};
const R = {
  corner: 5.42, // BAG: hoekstraal van de zeshoek aan de voet (apothema 4,69)
  cornerTop: 5.12, // de schacht verjongt (foto: 10,8 m tegen 10,2 m breed boven en onder)
  liseneFoot: 0.4, // BAG: lisenen tot 5,75 m (0,33 voorbij de hoek)
  liseneUp: 0.25,
  liseneWidth: 0.9, // BAG 0,66 m; 0,9 m zodat ze op 1:1000 staan
  reservoir: 5.5, // AHN: 11 m doorsnede
  rib: 5.7, // ribben op het reservoir, in het verlengde van de lisenen
  rimInner: 4.55,
};
const cornerAt = (z) => R.corner + ((R.cornerTop - R.corner) * z) / H.shaftTop;
const apothemAt = (z) => cornerAt(z) * Math.cos(rad(30));
const DOOR_DEG = 0; // deur en erker in het vlak naar de Lekdijk
const DOOR2_DEG = 60; // tweede deur (kleurenfoto; op de RCE-foto nog een venster)
const WINDOW_DEG = -60; // venster aan de voet (RCE-foto)

// ---------- schacht ----------
// Zeshoek met zes hoeklisenen als één doorsnede, verjongend geëxtrudeerd; onder H.foot met bredere lisenen.
const shaftSection = (protrusion) =>
  CrossSection.union([
    new CrossSection([ccw(hexagon(R.corner))]),
    ...CORNERS.map((d) => new CrossSection([ccw([[R.corner - 0.7, -R.liseneWidth / 2], [R.corner + protrusion, -R.liseneWidth / 2], [R.corner + protrusion, R.liseneWidth / 2], [R.corner - 0.7, R.liseneWidth / 2]])]).rotate(d)),
  ]);
const taper = (sec, z0, z1) => {
  const s0 = cornerAt(z0) / R.corner, s1 = cornerAt(z1) / R.corner;
  return Manifold.extrude(sec.scale([s0, s0]), z1 - z0, 0, 0, [s1 / s0, s1 / s0]).translate([0, 0, z0]);
};
const shaftFoot = taper(shaftSection(R.liseneFoot), BASE, H.foot);
const shaftUp = taper(shaftSection(R.liseneUp), H.foot, H.shaftTop + 0.01);
// Lijsten: 0,5 m hoog, 0,2 m uitstekend, onderkant onder 45 graden.
const band = (z) => {
  const c = cornerAt(z), d = 0.2 / Math.cos(rad(30));
  return hull([...hexagon(c).map(([x, y]) => [x, y, z - 0.2]), ...hexagon(c + d).map(([x, y]) => [x, y, z]), ...hexagon(c + d).map(([x, y]) => [x, y, z + 0.3])]);
};
const bands = union(H.bands.map(band));

// ---------- reservoir ----------
// Bolle bodem van de schacht (apothema 4,43) naar de wand (5,5) onder 52 graden, wand tot het dak, platte bovenkant met rand.
const reservoir = rev([
  [0, H.shaftTop - 0.5], [apothemAt(H.shaftTop) - 0.05, H.shaftTop - 0.5], [apothemAt(H.shaftTop) - 0.05, H.shaftTop],
  [R.reservoir - 0.35, H.reservoir - 0.35], [R.reservoir, H.reservoir], [R.reservoir, H.rim], [R.rimInner, H.rim], [R.rimInner, H.roof], [0, H.roof],
]);
// Ribben op de hoeken, met een console onder 48 graden vanaf de lisene.
const sTop = cornerAt(H.shaftTop) / R.corner;
const ribTop = (R.corner + R.liseneUp) * sTop, ribW = R.liseneWidth * sTop;
const rib = hull([
  ...[-1, 1].flatMap((s) => [[3.5, (s * ribW) / 2, H.shaftTop], [ribTop, (s * ribW) / 2, H.shaftTop]]),
  ...[-1, 1].flatMap((s) => [[3.5, (s * ribW) / 2, H.shaftTop + 0.45], [R.rib, (s * ribW) / 2, H.shaftTop + 0.45]]),
  ...[-1, 1].flatMap((s) => [[3.5, (s * ribW) / 2, H.rim], [R.rib, (s * ribW) / 2, H.rim]]),
]);
const ribs = union(around(rib, CORNERS));

// ---------- erker en ingang ----------
// Erker onder het reservoir in het vlak naar de dijk: 3,0 m breed aan de gevel, 2,0 m aan de voorkant, 1,0 m diep; onderkant
// onder 45 graden van 18,9 m aan de gevel tot 19,9 m aan de voorkant; loopt boven in de reservoirbodem over.
const af = apothemAt(19.5) - 0.2;
const bay = hull([
  [af, -1.5, 18.9], [af, 1.5, 18.9], [af + 1.0, -1.0, 19.9], [af + 1.0, 1.0, 19.9],
  [af, -1.5, H.reservoir + 0.3], [af, 1.5, H.reservoir + 0.3], [af + 1.0, -1.0, H.reservoir + 0.3], [af + 1.0, 1.0, H.reservoir + 0.3],
]);
// Stoep voor de deur.
const step = prism([[apothemAt(0) - 0.2, -1.2], [apothemAt(0) + 0.9, -1.2], [apothemAt(0) + 0.9, 1.2], [apothemAt(0) - 0.2, 1.2]], BASE, 0.15);

// ---------- vensters en deuren als blinde nissen ----------
// - deur 1,5 m breed tot 2,4 m in het dijkvlak, tweede deur 1,4 m breed tot 2,3 m in het vlak op 60 graden;
// - een venster van 1,2 bij 1,1 m in het vlak op -60 graden;
// - ruitvensters: in de derde geleding (hart 15,8 m) in de vlakken 0, 120 en 240, in de tweede (hart 9,3 m) in 60, 180 en 300;
// - een paar spleetvensters per reservoirveld als één nis van 1,2 m breed, 24,4 tot 28,4 m (in het echt twee spleten van 0,25 m).
const windows = union([
  place(niche(apothemAt(0), 1.5, 0.15, 2.4), { deg: DOOR_DEG }),
  place(niche(apothemAt(0), 1.4, 0, 2.3), { deg: DOOR2_DEG }),
  place(niche(apothemAt(2.1), 1.2, 1.0, 2.1), { deg: WINDOW_DEG }),
  ...around(diamond(apothemAt(15.8), 15.8), [0, 120, 240]),
  ...around(diamond(apothemAt(9.3), 9.3), [60, 180, 300]),
  ...around(niche(R.reservoir, 1.2, 24.4, 28.4), FACES),
]);

const all = union([shaftFoot, shaftUp, bands, reservoir, ribs, bay, step]).subtract(windows);

await writeLandmark({
  slug: "watertoren-nieuw-lekkerland",
  base: BASE,
  nodes: [["building:watertoren-schacht-lisenen-lijsten-erker-en-reservoir", all]],
  catalog: {
    name: "Watertoren Nieuw-Lekkerland",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: FACES.map((d) => polar(7, d).map((v) => +v.toFixed(2))),
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0571100000000425"],
    description:
      "Oorsprong op het hart van de zeskante BAG-voetafdruk (hoekstraal 5,42 m) op het maaiveld (NAP +3,05 m), X-as 77 graden rechtsom van RD-oost loodrecht op het vlak naar de Lekdijk. Zeskante, licht verjongende betonnen schacht met hoeklisenen (onderaan breder), drie lijsten, ruitvensters, twee deuren en een venster aan de voet en een erker onder het reservoir aan de dijkzijde; rond reservoir van 11 m met bolle bodem, zes ribben, spleetvensters per veld en een plat dak met rand op 30,4 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1915,
      builder: "Visser & Smit (Hanab)",
      monument: "gemeentelijk monument Molenlanden",
      publishedHeightM: 34,
      reservoirM3: 400,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 33.35,
      ahnRimNapM: 33.45,
      hexagonCornerRadiusM: R.corner,
      hexagonCornerRadiusTopM: R.cornerTop,
      bandsM: H.bands,
      shaftTopM: H.shaftTop,
      reservoirBottomM: H.reservoir,
      reservoirDiameterM: R.reservoir * 2,
      roofM: H.roof,
      topM: H.rim,
      entranceDegrees: DOOR_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Nieuw-Lekkerland) (1915, Visser & Smit Hanab, 34 m, 400 m³, sinds 2010 particulier en woning)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Nieuw-Lekkerland) (Overzicht watertoren - Nieuw-Lekkerland - 20276806 - RCE.jpg vanaf de Lekdijk, ... 20335214 - RCE.jpg, Watertoren Nieuw Lekkerland.jpg vanaf de Lek)",
      "PDOK BAG-pand 0571100000000425, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-07",
    ],
  },
});
