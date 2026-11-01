// Watertoren aan de Noorderbinnensingel in Groningen ("Duiventil", 1908,
// vermoedelijk naar ontwerp van Carl Francke), rijksmonument 485963. Een
// Barkhausenreservoir van 1000 m³ in een twaalfzijdige bakstenen mantel, op
// een stalen vakwerk van twaalf poten met kruisverbanden en gietijzeren
// consoles onder de ringbalk, met in het midden een ronde bakstenen trapschacht
// met omloop. Daarop een twaalfzijdig tentdak met een houten lantaarn en een
// spits. Sinds de restauratie (2013-2014) staat er een zinken entreepaviljoen
// tussen de poten en aan de westkant een lift met een peilschaal van 33 m.
//
// Oorsprong op het hart van het dak in het AHN (zwaartepunt van de DSM-
// contouren van 34 tot 41 m) op maaiveld (NAP +3,95 m), assen in RD-richting.
// De hoeken van de twaalfhoek liggen op -5 + k·30 graden (luchtfoto 8 cm,
// dakrand en de voeten van twee poten, en de BAG-contour); de poten staan op
// de hoeken. Hoogtes van de mantel, de ringbalk en de bodem uit de foto
// "Watertoren vanaf Nieuwe Kerk (1)" (2016, telelens, 44,9 px/m), geschaald op
// de peilschaal zelf (een meter per vak, met de hoogte boven maaiveld erbij);
// dak, lantaarn en spits uit de silhouetbreedtes op die foto en het AHN-
// radiaalprofiel; de schacht en de omloop uit de foto van 2015 met dezelfde
// peilschaal (projectieve fit, 0,07 m restfout).
import { Manifold, CrossSection, hull, ring3, circle, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [233339.1, 582742.65];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 3.95;
const CORNER = -5; // graden: hoeken van de twaalfhoek op CORNER + k·30, vlakken op CORNER + 15 + k·30
const COS15 = Math.cos(Math.PI / 12);
const rad = (d) => (d * Math.PI) / 180;
const H = {
  plinth: 0.4, // betonnen voetstukken van de poten
  pavilion: 4.0, // zinken entreepaviljoen (2014)
  frameFoot: 0.4, // eerste knoop van de kruisverbanden
  legTop: 21.4, // voet van de consoles
  ring: 22.83, // onderkant van de ringbalk
  wallFoot: 23.18, // onderkant van het metselwerk
  bowl: 20.45, // laagste punt van de bodem, op de schacht
  corbelFoot: 26.35, // overkraging van de bovenste verdieping
  corbelTop: 27.28,
  soffit: 31.6, // dakgoot: schuine onderkant begint op de gevel
  fascia: 32.65,
  eave: 33.0,
  roofKnee: 33.35, // knik in het tentdak boven de gevel (opgelicht bij de goot)
  lanternFoot: 36.78,
  lanternTop: 37.86, // bovenkant lantaarnwand, onder de schuine onderkant van de bovenste goot
  upperFascia: 38.37,
  upperEave: 38.6,
  spireKnee: 39.05,
  apex: 43.05,
  gauge: 33.1, // bovenkant liftkoker met peilschaal
};
const A = { lowerWall: 7.45, upperWall: 7.75, ringBeam: 7.55, eave: 8.4, lantern: 3.4, upperEave: 3.8, spireKnee: 3.35, pavilion: 7.2 };
const R = { shaft: 1.75, gallery: 2.55, band: 1.95, bowlRim: 7.3, legFoot: 7.85, legTop: 7.55 };

// Twaalfhoek met apothema a, hoeken op CORNER + k·30 graden.
const poly = (a) => circle([0, 0], a / COS15, 12, rad(CORNER));
const ring = (a, z) => ring3(poly(a), z);
const prism12 = (a, z0, z1) => hull([...ring(a, z0), ...ring(a, z1)]);

// ---------- reservoir, gevel en daken ----------
const lowerWall = prism12(A.lowerWall, H.ring, H.corbelFoot + 0.05);
// Bovenste verdieping kraagt 0,3 m uit op een gemetselde overkraging (72 graden).
const upperWall = hull([...ring(A.lowerWall, H.corbelFoot), ...ring(A.upperWall, H.corbelTop), ...ring(A.upperWall, H.eave)]);
// Ringbalk onder de gevel, met een schuine onderkant (56 graden) tot op de bodem.
const ringBeam = hull([...ring(R.bowlRim, H.ring - 0.37), ...ring(A.ringBeam, H.ring), ...ring(A.ringBeam, H.wallFoot + 0.05)]);
// Barkhausenbodem: bolkap van de rand (r 7,3 op 22,85) tot 20,45 m op de schacht.
const SAG = H.ring + 0.02 - H.bowl;
const RS = (R.bowlRim ** 2 + SAG ** 2) / (2 * SAG);
const bowlProfile = [[0, H.bowl]];
for (let k = 1; k <= 16; k++) {
  const r = (R.bowlRim * k) / 16;
  bowlProfile.push([r, H.bowl + RS - Math.sqrt(RS * RS - r * r)]);
}
const bowl = Manifold.revolve(new CrossSection([[...bowlProfile, [R.bowlRim, H.wallFoot + 0.1], [0, H.wallFoot + 0.1]]]), 96);
// Dakgoot: schuine onderkant (56 graden) van de gevel naar de goot van 8,4 m.
const eave = hull([...ring(A.upperWall, H.soffit), ...ring(A.eave, H.fascia), ...ring(A.eave, H.eave), ...ring(A.upperWall, H.roofKnee)]);
// Twaalfzijdig tentdak (38 graden) van de gevellijn naar de lantaarn.
const roof = hull([...ring(A.upperWall, H.eave), ...ring(A.upperWall, H.roofKnee), ...ring(A.lantern, H.lanternFoot)]);
const lantern = prism12(A.lantern, H.lanternFoot - 0.8, H.lanternTop + 0.05);
// Goot van de spits met een schuine onderkant (52 graden) en de opgelichte voet van de spits.
const upperEave = hull([...ring(A.lantern, H.lanternTop), ...ring(A.upperEave, H.upperFascia), ...ring(A.upperEave, H.upperEave), ...ring(A.spireKnee, H.spireKnee)]);
const spire = hull([...ring(A.spireKnee, H.spireKnee - 0.2), ...ring(A.spireKnee, H.spireKnee), [0, 0, H.apex]]);

// ---------- schacht met omloop ----------
const shaft = Manifold.cylinder(H.bowl + 0.35 - BASE, R.shaft, R.shaft, 64).translate([0, 0, BASE]);
// Omloop op 16,45 m op een gemetselde kraag (56 graden), dubbele band rond 9,5 tot 11,1 m.
const gallery = Manifold.revolve(new CrossSection([[[R.shaft - 0.05, 15.2], [R.gallery, 16.45], [R.gallery, 16.7], [R.shaft - 0.05, 16.7]]]), 64);
const band = Manifold.revolve(new CrossSection([[[R.shaft - 0.05, 9.08], [R.band, 9.45], [R.band, 11.1], [R.shaft - 0.05, 11.4]]]), 64);

// ---------- vakwerk: twaalf poten met consoles en kruisverbanden ----------
const legR = (z) => R.legFoot + ((R.legTop - R.legFoot) * (z - BASE)) / (H.ring - BASE);
const legAt = (k, z) => {
  const t = rad(CORNER + 30 * k);
  const r = legR(z);
  return [r * Math.cos(t), r * Math.sin(t), z];
};
// Vierkant van 2a (tangentieel) bij 2b (radiaal) rond de poot k op hoogte z.
const legSquare = (k, z, a = 0.45, b = 0.45) => {
  const t = rad(CORNER + 30 * k);
  const [cx, cy] = legAt(k, z);
  const u = [Math.cos(t), Math.sin(t)], v = [-Math.sin(t), Math.cos(t)];
  return [[-a, -b], [a, -b], [a, b], [-a, b]].map(([s, n]) => [cx + v[0] * s + u[0] * n, cy + v[1] * s + u[1] * n, z]);
};
const legs = [], consoles = [], plinths = [], braces = [];
const LEVELS = 4;
const DZ = (H.legTop - H.frameFoot) / LEVELS; // 5,25 m per kruis: de verbanden staan onder 53 graden
for (let k = 0; k < 12; k++) {
  legs.push(hull([...legSquare(k, BASE), ...legSquare(k, H.ring + 0.1)]));
  // Gietijzeren console: van de poot (0,9 m) naar 1,6 m langs de ringbalk (76 graden).
  consoles.push(hull([...legSquare(k, H.legTop - 0.1), ...legSquare(k, H.ring + 0.1, 0.8)]));
  plinths.push(hull([...legSquare(k, BASE, 0.7, 0.7), ...legSquare(k, H.plinth, 0.7, 0.7)]));
  // Kruisverband in het vlak tussen poot k en k+1: banden van 0,9 m breed en 0,9 m dik.
  const t = rad(CORNER + 15 + 30 * k);
  const n = [0.45 * Math.cos(t), 0.45 * Math.sin(t)];
  for (let j = 0; j < LEVELS; j++) {
    const z1 = H.frameFoot + j * DZ, z2 = z1 + DZ;
    for (const [p, q] of [[legAt(k, z1), legAt(k + 1, z2)], [legAt(k + 1, z1), legAt(k, z2)]]) {
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      const h = 0.45 * Math.hypot(len, q[2] - p[2]) / len; // halve verticale dikte van een band van 0,9 m
      const pts = [];
      for (const e of [p, q]) for (const dz of [-h, h]) for (const s of [-1, 1]) pts.push([e[0] + s * n[0], e[1] + s * n[1], e[2] + dz]);
      braces.push(hull(pts));
    }
  }
}

// ---------- paviljoen en liftkoker ----------
const pavilion = prism12(A.pavilion, BASE, H.pavilion);
// Liftkoker met peilschaal aan de westhoek, tot net boven de goot.
const gauge = box(-9.0, -0.4, BASE, -7.6, 1.0, H.gauge);

// ---------- vensters als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const faces = Array.from({ length: 12 }, (_, k) => CORNER + 15 + 30 * k);
const cuts = [
  // Eén venster per vlak in beide verdiepingen.
  ...faces.map((deg) => place(niche(A.upperWall, 1.0, 29.1, 31.35, 0.3), { deg })),
  ...faces.map((deg) => place(niche(A.lowerWall, 1.0, 23.95, 25.7, 0.3), { deg })),
  // Vier lantaarnvensters.
  ...[0, 3, 6, 9].map((k) => place(niche(A.lantern, 0.9, 36.95, 37.5, 0.2), { deg: faces[k] })),
  // Drie vensters in de schacht, naar het zuiden.
  ...[[6.35, 7.36], [11.45, 12.33], [17.07, 18.22]].map(([z0, z1]) => place(niche(R.shaft - 0.06, 0.9, z0, z1, 0.25), { deg: -95 })),
];

const tower = union([lowerWall, upperWall, ringBeam, bowl, eave, roof, lantern, upperEave, spire, shaft, gallery, band, ...legs, ...consoles, ...plinths, ...braces, pavilion, gauge])
  .subtract(union(cuts))
  .trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-groningen-noorderbinnensingel",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los reservoir zou een voet tot de grondplaat krijgen.
  nodes: [["building:vakwerk-schacht-reservoir-en-tentdak", tower]],
  catalog: {
    name: "Watertoren Noorderbinnensingel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9.5, 0], [0, -9.5], [-9.6, -3], [6.7, -6.7]],
    // Terugval voor uitsnedes zonder deze punten: NAP +3,95 plus de geoïdehoogte
    // van circa 40,75 m in Groningen (zoals de andere modellen in de stad).
    groundHeight: 44.7,
    replacesBuildings: ["NL.IMBAG.Pand.0014100022186464"],
    description:
      "Oorsprong op het hart van het dak in het AHN op maaiveld (NAP +3,95 m), assen in RD-richting, hoeken van de twaalfhoek op -5 + k·30 graden. Twaalf stalen poten (0,9 m) met kruisverbanden onder 53 graden en consoles onder de ringbalk op 22,8 m, een Barkhausenbodem tot 20,45 m op de ronde bakstenen schacht (3,5 m) met omloop op 16,45 m, een twaalfzijdige bakstenen mantel van 14,9 m tot 26,4 m en 15,5 m tot de goot, met een venster per vlak in beide verdiepingen, een tentdak van 16,8 m van 33,0 tot 36,8 m, een twaalfzijdige lantaarn van 6,8 m en een spits tot 43,05 m. Op de grond het entreepaviljoen van 4 m tussen de poten en aan de westhoek de liftkoker met peilschaal tot 33,1 m. Maten uit AHN, luchtfoto, BAG en foto's met de peilschaal.",
    realWorld: {
      built: 1908,
      publishedHeightM: 45.3,
      reservoirM3: 1000,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 47.49,
      sides: 12,
      legs: 12,
      eaveApothemM: A.eave,
      upperWallApothemM: A.upperWall,
      lowerWallApothemM: A.lowerWall,
      wallFootM: H.wallFoot,
      ringBeamM: H.ring,
      bowlBottomM: H.bowl,
      eaveM: H.eave,
      lanternApothemM: A.lantern,
      lanternFootM: H.lanternFoot,
      modelTopM: H.apex,
      gaugeTopM: H.gauge,
      shaftDiameterM: 2 * R.shaft,
      galleryM: 16.45,
      photoScalePxPerM: 44.9,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Groningen_Noorderbinnensingel)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/485963",
      "https://commons.wikimedia.org/wiki/File:Watertoren_vanaf_Nieuwe_Kerk_(1).jpg (telefoto 2016 met peilschaal, hoogtes en silhouet van dak en lantaarn)",
      "https://commons.wikimedia.org/wiki/File:Groningen,_de_watertoren_aan_de_Noorderbinnensingel-de_Bovenkamer_van_Groningen_RM485963_foto4_2015-03-22_14.16.jpg (2015, peilschaal, schacht, omloop, vakwerk, paviljoen)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_vanuit_het_zuidwesten_-_Groningen_-_20533281_-_RCE.jpg (vakwerk, consoles en bodem, 2010)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Groningen_Noorderbinnensingel.jpg (telefoto 2016 van boven, lantaarn en liftkoker)",
      "PDOK BAG-pand 0014100022186464, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});
