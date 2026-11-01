// Watertoren aan de Hofstede de Grootkade in Groningen ("Watertoren West",
// stadsarchitect J.A. Mulock Houwer, 1912), rijksmonument 485188, met een
// hangbodemreservoir van 1000 m³ en sinds 1925 een tweede van 782 m³ eronder;
// sinds 2013 buiten gebruik en verbouwd tot appartementen.
// Zestienhoekige bakstenen schacht met een lisene op elke hoek en getrapte
// kraagstenen bovenaan elk vlak, een stenen band, een zone met segmentboogvensters,
// een tweede band, de ronde reservoirmantel met vensters, een tegelfries en een
// overstekende kroonlijst. Daarop een zestienzijdig tentdak met vier dakkapellen
// (op 27 + k·90 graden), een lantaarn met zestien vensters, een koepel, een hals
// en een kleine koepel.
// Oorsprong op het hart in het AHN (cirkelfit per hoogte over de schone sectoren;
// de BAG-contour is een grove achthoek met straal 9,45 tot 9,96 m) op maaiveld
// (NAP +2,45 m, ring van 9,5 tot 11,5 m), assen in RD-richting. De zestien
// vlakken hebben hun midden op 4,5 + k·22,5 graden, zodat de dakkapellen (AHN)
// midden op een vlak staan, zoals op de foto's.
// Hoogtes van de gevelzones uit de bijna frontale foto RM485188 foto6 (2013),
// geschaald op het maaiveld en de kroonlijst in het AHN (26,4 px/m); het dak,
// de dakkapellen, de lantaarn en de koepels uit het AHN-profiel.
import { Manifold, CrossSection, hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [232618.08, 581972.45];
const AXIS = [1, 0];
const BASE = -0.3;
const N = 16;
const PHASE = 4.5; // graden: midden van vlak k op PHASE + k*22,5
const faceDeg = (k) => PHASE + k * (360 / N);
const H = {
  plinth: 2.2, // bovenkant van de plint, met een afgeschuinde lijst tot 2,6
  plinthLedge: 2.6,
  blocks: 27.6, // getrapte kraagstenen bovenaan elk vlak (midden lager)
  lowBand: 28.96, // onderste stenen band, op de lisenen
  lowBandTop: 29.3,
  upBand: 31.95, // bovenste stenen band, overgang naar de ronde mantel
  upBandTop: 32.33,
  frieze: 36.62, // tegelfries
  cornice: 37.76, // onderkant van de kroonlijst
  eave: 38.9, // bovenkant van de kroonlijst = dakvoet
  dormerEave: 41.6, // dakkapellen
  dormerRidge: 43.9,
  lantern: 47.9, // lantaarn op het dak
  dome: 49.6, // koepel van de lantaarn
  neck: 52.1, // hals
  neckTop: 54.8,
  top: 55.87, // kleine koepel; AHN-top NAP +58,32
};
const A = { foot: 9.05, top: 8.85, plinth: 9.3, lowBand: 9.15, arched: 8.95, eaveRoof: 9.25, lantern: 2.85 }; // apothema's
const R = { mantle: 9.1, upBand: 9.3, cornice: 9.5, neck: 0.97 };
const SEC = 1 / Math.cos(Math.PI / N);

// Zestienhoek met vlakmiddens op faceDeg(k) en apothema a.
const poly = (a) => circle([0, 0], a * SEC, N, ((PHASE + 180 / N) * Math.PI) / 180);
const apo = (z) => A.foot + (Math.max(0, z) / H.lowBand) * (A.top - A.foot); // verjongende schacht

// ---------- schacht met plint, lisenen en kraagstenen ----------
const shaft = hull([...ring3(poly(A.foot), BASE), ...ring3(poly(A.top), H.lowBand + 0.05)]);
const plinth = hull([...ring3(poly(A.plinth), BASE), ...ring3(poly(A.plinth), H.plinth), ...ring3(poly(apo(H.plinthLedge)), H.plinthLedge)]);
// Lisene op elke hoek: 1,0 m breed, 0,25 m buiten de hoek, verjongend met de schacht.
const pilaster = (k) => {
  const z0 = H.plinth, z1 = H.lowBand + 0.05;
  const c0 = apo(z0) * SEC, c1 = apo(z1) * SEC;
  return place(hull([
    [c0 - 0.6, -0.5, z0], [c0 + 0.25, -0.5, z0], [c0 - 0.6, 0.5, z0], [c0 + 0.25, 0.5, z0],
    [c1 - 0.6, -0.5, z1], [c1 + 0.25, -0.5, z1], [c1 - 0.6, 0.5, z1], [c1 + 0.25, 0.5, z1],
  ]), { deg: faceDeg(k) + 180 / N });
};
// Kraagsteen in het vlak met normaal +X: 0,2 m voor het vlak, onderkant onder 56 graden.
const block = (v0, v1, z0, z1) => {
  const a = apo(28), f = a + 0.2;
  return hull([
    [a - 0.1, v0, z0], [a - 0.1, v1, z0], [f, v0, z0 + 0.3], [f, v1, z0 + 0.3],
    [f, v0, z1], [f, v1, z1], [a - 0.1, v0, z1], [a - 0.1, v1, z1],
  ]);
};
const blocks = [block(-1.26, -0.42, H.blocks, H.lowBand + 0.05), block(0.42, 1.26, H.blocks, H.lowBand + 0.05), block(-0.43, 0.43, H.blocks - 0.5, H.blocks + 0.5)];

// ---------- banden, boogvensterzone, reservoirmantel en kroonlijst ----------
const lowBand = hull([...ring3(poly(A.top), H.lowBand - 0.46), ...ring3(poly(A.lowBand), H.lowBand), ...ring3(poly(A.lowBand), H.lowBandTop)]);
const arched = prism(poly(A.arched), H.lowBandTop - 0.05, H.upBand);
const round = (r, n = 96) => circle([0, 0], r, n);
const upBand = hull([...ring3(poly(A.arched), H.upBand - 0.55), ...ring3(round(R.upBand), H.upBand), ...ring3(round(R.upBand), H.upBandTop)]);
const mantle = union([prism(round(R.mantle), H.upBand, H.cornice + 0.05), prism(round(8.5), H.cornice, H.eave)]); // kern binnen de kroonlijst
const corniceRing = Manifold.revolve(
  new CrossSection([[[8.4, H.cornice], [R.mantle, H.cornice], [R.cornice, H.cornice + 0.6], [R.cornice, H.eave], [8.4, H.eave]]]),
  96,
);

// ---------- dak met dakkapellen ----------
const roof = hull([...ring3(poly(A.eaveRoof), H.eave - 0.05), ...ring3(poly(A.lantern), H.lantern + 0.05)]);
// Dakkapel op vlak k: front 4,4 m breed op 8,83 m (de hoeken vallen op de mantel), schilddakje tot 43,9.
const DORMER_W = 2.2, DORMER_F = 8.83;
const dormerLocal = union([
  prism([[5, -DORMER_W], [DORMER_F, -DORMER_W], [DORMER_F, DORMER_W], [5, DORMER_W]], H.frieze, H.dormerEave),
  hull([
    [DORMER_F, -DORMER_W, H.dormerEave - 0.05], [DORMER_F, DORMER_W, H.dormerEave - 0.05], [5, -DORMER_W, H.dormerEave - 0.05], [5, DORMER_W, H.dormerEave - 0.05],
    [7.3, 0, H.dormerRidge], [5, 0, H.dormerRidge],
  ]),
]);
const DORMERS = [1, 5, 9, 13];
// Kroonlijst onderbroken door de dakkapellen.
const corniceSlots = union(DORMERS.map((k) => place(prism([[6, -DORMER_W], [11, -DORMER_W], [11, DORMER_W], [6, DORMER_W]], H.cornice - 0.1, H.eave - 0.02), { deg: faceDeg(k) })));

// ---------- lantaarn, koepel, hals en kleine koepel ----------
const lantern = prism(poly(A.lantern), H.lantern - 0.3, H.dome + 0.05);
const ell = (r0, r1, z0, dz, steps, from = 0) =>
  Array.from({ length: steps }, (_, i) => {
    const t = ((i + from) / steps) * (Math.PI / 2);
    return [r1 + (r0 - r1) * Math.cos(t), z0 + dz * Math.sin(t)];
  });
const domes = Manifold.revolve(
  new CrossSection([[
    [0, H.dome - 0.1], [A.lantern * SEC, H.dome - 0.1], ...ell(A.lantern * SEC, R.neck, H.dome, H.neck - H.dome, 8),
    [R.neck, H.neck], [R.neck, H.neckTop], ...ell(R.neck, 0, H.neckTop, H.top - H.neckTop, 6, 1),
  ]]),
  N,
).rotate([0, 0, PHASE + 180 / N]);

// ---------- nissen: vensters en deur ----------
// Nis in het vlak met normaal +X op afstand f; het plafond loopt naar binnen op onder 56 graden.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Segmentboogvenster: rechte stijlen tot z1, boog met pijl `rise` erboven; plafond onder 56 graden.
const archNiche = (f, w, z0, z1, rise, depth = 0.3) => {
  const arc = Array.from({ length: 7 }, (_, i) => {
    const v = -w / 2 + (w * i) / 6;
    return [v, z1 + rise * (1 - (2 * v / w) ** 2)];
  });
  const a = f - depth, b = f + 1.0;
  return hull([
    [a, -w / 2, z0], [a, w / 2, z0], [b, -w / 2, z0], [b, w / 2, z0],
    ...arc.map(([v, z]) => [f, v, z]), ...arc.map(([v, z]) => [a, v, z + 1.5 * depth]),
    [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5],
  ]);
};
const cuts = [];
for (let k = 0; k < N; k++) {
  const deg = faceDeg(k);
  const at = (m) => place(m, { deg });
  // Boogvensters, afwisselend glas en gemetselde lamellen, in elk vlak.
  cuts.push(at(archNiche(A.arched, 1.8, 29.7, 31.0, 0.35)));
  // Vensters in de reservoirmantel (twee boven elkaar in één omlijsting).
  cuts.push(at(niche(R.mantle, 0.7, 33.3, 35.75)));
  if (DORMERS.includes(k)) {
    cuts.push(at(niche(DORMER_F, 2.5, 36.4, 40.9, 0.3))); // groot venster van de dakkapel
  } else {
    cuts.push(at(niche(R.mantle, 0.85, 36.75, 37.55))); // venstertje in het tegelfries
  }
  // Lantaarn: zestien vensters tussen smalle stijlen.
  cuts.push(at(niche(A.lantern, 0.55, H.lantern + 0.25, H.dome - 0.3, 0.2)));
  if (k % 2 === 1) {
    // Trappenhuisvensters in de oneven vlakken (onder de dakkapellen en ertussen): een paar boven, twee enkele eronder.
    for (const v of [-0.6, 0.6]) cuts.push(at(niche(apo(24.6), 0.65, 22.96, 26.2, 0.3).translate([0, v, 0])));
    cuts.push(at(niche(apo(17), 0.9, 15.3, 18.7, 0.3)));
    cuts.push(at(niche(apo(8.5), 0.9, 7.1, 9.9, 0.3)));
  }
}
cuts.push(place(niche(apo(1.5), 1.8, 0, 3.2, 0.35), { deg: faceDeg(8) })); // ingang naar het pad aan de westkant

const tower = union([
  shaft, plinth,
  ...Array.from({ length: N }, (_, k) => pilaster(k)),
  ...Array.from({ length: N }, (_, k) => place(union(blocks), { deg: faceDeg(k) })),
  lowBand, arched, upBand, mantle, corniceRing.subtract(corniceSlots), roof,
  ...DORMERS.map((k) => place(dormerLocal, { deg: faceDeg(k) })),
  lantern, domes,
]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-groningen-hofstede-de-grootkade",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los dak zou een voet tot de grondplaat krijgen.
  nodes: [["building:schacht-reservoir-dak-en-lantaarn", tower]],
  catalog: {
    name: "Watertoren Hofstede de Grootkade",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[11, 0], [-11, 0], [0, 11], [0, -11]],
    // Ellipsoïdisch maaiveld: NAP +2,45 m plus de NLGEO2018-geoïdehoogte 40,76 m op de oorsprong.
    groundHeight: 43.21,
    replacesBuildings: ["NL.IMBAG.Pand.0014100010913807"],
    description:
      "Oorsprong op het hart in het AHN op maaiveld (NAP +2,45 m), assen in RD-richting, vlakmiddens op 4,5 + k·22,5 graden. Zestienhoekige schacht (apothema 9,05 naar 8,85 m) met plint, zestien lisenen, getrapte kraagstenen en trappenhuisvensters, stenen banden op 29 en 32 m met daartussen segmentboogvensters, ronde reservoirmantel van 18,2 m met vensters en tegelfries, kroonlijst tot 38,9 m, zestienzijdig tentdak (55 graden) met vier dakkapellen tot 43,9 m, lantaarn met zestien vensters tot 49,6 m, koepel, hals en kleine koepel tot 55,9 m. Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 56.3,
      reservoirsM3: [1000, 782],
      ahnGroundNapM: 2.45,
      ahnTopNapM: 58.32,
      geoidHeightM: 40.76,
      shaftApothemFootM: 9.05,
      shaftApothemTopM: 8.85,
      pilasterOuterRadiusM: [9.48, 9.27],
      mantleDiameterM: 18.2,
      corniceDiameterM: 19.0,
      lowBandM: 28.96,
      upBandM: 31.95,
      eaveM: 38.9,
      roofPitchDeg: 54.6,
      dormerRidgeM: 43.9,
      lanternApothemM: 2.85,
      lanternM: [47.9, 49.6],
      modelTopM: 55.87,
      photoScalePxPerM: 26.4,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Groningen_Hofstede_de_Grootkade)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/485188",
      "https://commons.wikimedia.org/wiki/File:Groningen,_de_watertoren_aan_de_Hofstede_de_Grootkade,_RM485188_foto6_2013-08-04_17.35.jpg (bijna frontaal, hoogtes van de zones)",
      "https://commons.wikimedia.org/wiki/File:Watertower_Hofstede_de_Grootkade_(Groningen).JPG (dakkapellen, lantaarn en koepels)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_van_Groningenstad_01.jpg (lisenen, kraagstenen, banden en vensters)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Groningen.JPG (plint en trappenhuisvensters)",
      "PDOK BAG-pand 0014100010913807, AHN DSM/DTM 0,5 m en luchtfoto, NLGEO2018, 2026-11-01",
    ],
  },
});
