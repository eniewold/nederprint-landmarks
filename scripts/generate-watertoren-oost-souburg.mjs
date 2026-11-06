// Watertoren Oost-Souburg (Vlissingsestraat 239, bij de afrit van de A58/Sloeweg), gebouwd in 1939 in zakelijk-
// expressionistische stijl naar ontwerp van ir. J.H.J. Kording voor de N.V. Waterleiding Maatschappij "Midden-Zeeland";
// 35 m hoog (Wikipedia, register), rond betonnen vlakbodemreservoir van 450 m³, rijksmonument 508771, nu expositieruimte.
// Een betonskelet met een rode bakstenen mantel op een vierkante plattegrond. Onder: een vierkante schacht met in het midden
// van elke gevel een hoog, overhoeks geplaatst stalen venster (een vensterstrook die als een V uit de gevel steekt), daarboven
// een getrapte betonnen lateiplaat en een liseen die tot boven de dakrand doorloopt, met aan weerszijden een kort venster
// onder de betonnen band. Boven de band verjongt de toren zich en heeft hij afgeschuinde hoeken (de reservoirverdieping),
// met aan weerszijden van de liseen een hoog, smal venster; bovenaan een tweede betonnen band als dakrand. De ingang met
// een eenvoudige luifel zit onder het hoge venster van de zuidoostgevel; de andere drie gevels zijn verder gelijk (register).
// Op het platte dak staat sinds circa 2009 een glazen paviljoen met een overkapt terras aan de noordoostkant en een
// glazen kop die op de oosthoek over de dakrand steekt (foto 2010, AHN, luchtfoto).
//
// Oorsprong op het hart van BAG-pand 0718100000008321 (bouwjaar 1939, rechthoek 11,40 x 11,62 m, het enige pand op deze
// plek; de buurpanden van 2006 tot 2009 liggen 15 m en verder weg en raken het model niet). Lokale +X langs de BAG-zijde
// van 11,40 m naar het noordoosten (RD-hoek 56,01 graden; de noordoostgevel), +Y naar het noordwesten; de ingangsgevel
// (zuidoost) ligt op -Y. Het AHN-DSM 0,5 m ligt in dit stelsel binnen ±5,7 m, dus de BAG-rechthoek is de buitenmaat van
// de onderbouw.
//
// Hoogtes: maaiveld AHN-DTM NAP -0,1 rond de voet (pad voor de ingang NAP +0,3 tot +0,6); PDOK-terrein op de
// groundSamplePoints ellipsoïdisch 44,205 tot 44,61, AHN-DTM daar 44,27 tot 44,33 lager, dus z = 0 ligt op NAP -0,08.
// AHN-DSM 0,5 m (2026-11-06): dakrand NAP +29,7 tot +29,9 (mediaan 29,77) op de randcellen, dak van het paviljoen NAP
// +33,6 tot +33,7 over 9 x 9 m, op de oosthoek tot 5,3 m van het hart. De hoogtes onder de dakrand (band, vensters,
// lateiplaat, luifel) en de terugsprong, de afschuining, de liseen en de vensterbreedtes zijn geschat van de foto's
// "Oost-Souburg-Vlissingsestraat 239-ro3253.jpg" (2010, van het oosten), "...-detail-ro3251.jpg" (detail van de
// noordoostgevel) en "Overzicht watertoren - Oost-Souburg - 20342496 - RCE.jpg" (van het oosten, met maaiveld), geschaald
// op de BAG-breedte en de dakrand uit het AHN.
//
// Printbaar op 1:1000 zonder steun: banden en lateiplaat met een onderkant van 50 graden, de V van de vensters met een
// onderkant van 53 graden, nissen met een plafond van 56 graden, de luifel en de luifel van het terras met een onderkant van
// 50 graden, de glazen kop op de oosthoek onder 50 graden afgeschuind boven de afgeschuinde hoek van de toren.
import { Manifold, CrossSection, ccw, hull, union, prism, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [30678.03, 386900.38];
const AXIS = [0.55904, 0.82909]; // BAG-zijde van 11,40 m, RD-hoek 56,01 graden
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: +X 44,25, -X 44,205, +Y 44,228,
// -Y (pad voor de ingang) 44,608.
const GROUND_ELLIPSOID = 44.205;
const GEOID = 44.28; // ellipsoïdisch min NAP hier (PDOK-terrein min AHN-DTM: 44,27 tot 44,33)
const NAP0 = +(GROUND_ELLIPSOID - GEOID).toFixed(2); // NAP-hoogte van z = 0: -0,08

const rad = (deg) => (deg * Math.PI) / 180;
const T50 = Math.tan(rad(50));
const T56 = Math.tan(rad(56));

// ---------- maten ----------
const HX = 5.7, HY = 5.81; // halve BAG-maten van de onderbouw (11,40 x 11,62 m)
const STEP = 0.35; // terugsprong van de bovenbouw (foto's)
const UX = HX - STEP, UY = HY - STEP; // bovenbouw 10,70 x 10,92 m
const CHAMFER = 1.5; // afgeschuinde hoeken van de bovenbouw, beenlengte (foto's: schuine zijde 0,28 x de rechte gevel)
const BAND_OUT = 0.15; // uitsprong van de betonbanden
const LISENE = { w: 1.76, out: 0.15 }; // liseen: breed 1,76 m, buitenvlak gelijk met de banden
const H = {
  roof: +(29.77 - NAP0).toFixed(2), // bovenkant dakrand (AHN NAP +29,77)
  pavilion: +(33.7 - NAP0).toFixed(2), // dak van het glazen paviljoen (AHN NAP +33,6 tot +33,7)
  bandTop: 20.85, // betonband op de overgang naar de bovenbouw (foto's)
  band: 0.75,
  roofBand: 0.6,
  window: [3.7, 17.1], // hoog overhoeks venster
  slabTop: 17.7, // lateiplaat (2,55 m breed, 0,4 m uit de gevel)
  blockTop: 18.05, // blok onder de liseen
  shortWindow: [18.3, 19.85], // korte vensters onder de band
  upperWindow: [20.95, 28.1], // hoge smalle vensters in de bovenbouw
};
H.bandBottom = +(H.bandTop - H.band).toFixed(2);
H.roofBandBottom = +(H.roof - H.roofBand).toFixed(2);
H.liseneTop = +(H.roof + 0.3).toFixed(2);

// Achthoek van de bovenbouw met afschuiningen `c`, `grow` naar buiten verschoven (ook de schuine zijden).
const octagon = (ux, uy, c, grow = 0) => {
  // Schuine zijde `grow` naar buiten: langs de verschoven rechte zijden wordt het been c + grow (2 - wortel 2).
  const x = ux + grow, y = uy + grow, cc = c + grow * (2 - Math.SQRT2);
  return [[x, -y + cc], [x, y - cc], [x - cc, y], [-x + cc, y], [-x, y - cc], [-x, -y + cc], [-x + cc, -y], [x - cc, -y]];
};
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);

// ---------- massa ----------
const lower = box(-HX, -HY, BASE, HX, HY, H.bandBottom + 0.01);
// Band: 0,15 m uit de gevel, onderkant van 50 graden naar de gevel.
const band = hull([
  ...ring([[HX, HY], [-HX, HY], [-HX, -HY], [HX, -HY]], H.bandBottom - BAND_OUT * T50),
  ...ring([[HX + BAND_OUT, HY + BAND_OUT], [-HX - BAND_OUT, HY + BAND_OUT], [-HX - BAND_OUT, -HY - BAND_OUT], [HX + BAND_OUT, -HY - BAND_OUT]], H.bandBottom),
  ...ring([[HX + BAND_OUT, HY + BAND_OUT], [-HX - BAND_OUT, HY + BAND_OUT], [-HX - BAND_OUT, -HY - BAND_OUT], [HX + BAND_OUT, -HY - BAND_OUT]], H.bandTop),
]);
const upper = prism(octagon(UX, UY, CHAMFER), H.bandTop - 0.01, H.roofBandBottom + 0.01);
const roofBand = hull([
  ...ring(octagon(UX, UY, CHAMFER), H.roofBandBottom - BAND_OUT * T50),
  ...ring(octagon(UX, UY, CHAMFER, BAND_OUT), H.roofBandBottom),
  ...ring(octagon(UX, UY, CHAMFER, BAND_OUT), H.roof),
]);

// ---------- gevelonderdelen, getekend voor de gevel met normaal +X op afstand f, daarna rond gedraaid ----------
// Rechthoekige nis van z0 tot z1, `depth` diep, plafond naar binnen onder 56 graden.
const niche = (f, yc, w, z0, z1, depth = 0.3) => {
  const za = z1 + depth * T56, a = f - depth, b = f + 0.3;
  return hull([[a, yc - w / 2, z0], [b, yc - w / 2, z0], [a, yc + w / 2, z0], [b, yc + w / 2, z0], [a, yc - w / 2, za], [a, yc + w / 2, za], [f, yc - w / 2, z1], [f, yc + w / 2, z1], [b, yc - w / 2, z1 - 0.3 * T56], [b, yc + w / 2, z1 - 0.3 * T56]]);
};
const faceParts = (f) => {
  const fu = f - STEP; // gevel van de bovenbouw
  // Overhoeks venster: V van 1,2 m breed die 0,3 m uitsteekt, onderkant van 53 graden naar de gevel.
  const vee = hull([
    [f - 0.05, -0.6, H.window[0]], [f - 0.05, 0.6, H.window[0]],
    [f - 0.05, -0.6, H.window[1]], [f - 0.05, 0.6, H.window[1]],
    [f + 0.3, 0, H.window[0] + 0.4], [f + 0.3, 0, H.window[1]],
  ]);
  // Lateiplaat: 2,55 m breed, bovenkant 0,4 m uit de gevel, voorkant 0,2 m hoog, onderkant van 50 graden naar de gevel.
  const slab = hull([
    [f - 0.05, -1.275, H.slabTop - 0.2 - 0.45 * T50], [f - 0.05, 1.275, H.slabTop - 0.2 - 0.45 * T50],
    [f + 0.4, -1.275, H.slabTop - 0.2], [f + 0.4, 1.275, H.slabTop - 0.2],
    [f + 0.4, -1.275, H.slabTop], [f + 0.4, 1.275, H.slabTop], [f - 0.05, -1.275, H.slabTop], [f - 0.05, 1.275, H.slabTop],
  ]);
  const block = box(f - 0.05, -LISENE.w / 2, H.slabTop - 0.01, f + 0.3, LISENE.w / 2, H.blockTop);
  // Liseen van het blok tot 0,3 m boven de dakrand, buitenvlak gelijk met de banden; in de bovenbouw vanaf de gevel daar.
  const lisene = box(fu - 0.05, -LISENE.w / 2, H.blockTop - 0.01, f + LISENE.out, LISENE.w / 2, H.liseneTop);
  const off = LISENE.w / 2 + 0.05 + 0.3; // hart van de vensters naast de liseen (0,6 m breed)
  const cuts = [
    niche(f, -off, 0.6, ...H.shortWindow), niche(f, off, 0.6, ...H.shortWindow),
    niche(fu, -off, 0.6, ...H.upperWindow), niche(fu, off, 0.6, ...H.upperWindow),
  ];
  return { adds: [vee, slab, block, lisene], cuts };
};
const FACES = [
  { deg: 0, f: HX }, // noordoost
  { deg: 90, f: HY }, // noordwest
  { deg: 180, f: HX }, // zuidwest
  { deg: 270, f: HY }, // zuidoost, ingang
];
const adds = [], cuts = [];
for (const { deg, f } of FACES) {
  const p = faceParts(f);
  adds.push(...p.adds.map((m) => place(m, { deg })));
  cuts.push(...p.cuts.map((m) => place(m, { deg })));
}

// ---------- ingang (zuidoostgevel, -Y) ----------
// Deur als nis van 1,4 x 2,4 m, 0,4 m diep; luifel 2,2 m breed, 0,8 m uit de gevel, bovenkant 3,2 m, voorkant 0,25 m hoog,
// onderkant van 50 graden naar de gevel (in het echt een vlakke plaat).
const door = place(niche(HY, 0, 1.4, BASE, 2.4, 0.4), { deg: 270 });
const LUIFEL = { w: 2.2, out: 0.8, top: 3.2, edge: 0.25 };
const luifel = hull([
  [-LUIFEL.w / 2, -HY + 0.05, LUIFEL.top], [LUIFEL.w / 2, -HY + 0.05, LUIFEL.top],
  [-LUIFEL.w / 2, -HY - LUIFEL.out, LUIFEL.top], [LUIFEL.w / 2, -HY - LUIFEL.out, LUIFEL.top],
  [-LUIFEL.w / 2, -HY - LUIFEL.out, LUIFEL.top - LUIFEL.edge], [LUIFEL.w / 2, -HY - LUIFEL.out, LUIFEL.top - LUIFEL.edge],
  [-LUIFEL.w / 2, -HY + 0.05, LUIFEL.top - LUIFEL.edge - (LUIFEL.out + 0.05) * T50], [LUIFEL.w / 2, -HY + 0.05, LUIFEL.top - LUIFEL.edge - (LUIFEL.out + 0.05) * T50],
]);

// ---------- glazen paviljoen op het dak ----------
// Hoofdvolume 9,2 x 9,5 m (AHN 33,6 tot 33,7 binnen ±4,5 tot 4,75 m), op de oosthoek een glazen kop van 2,85 x 2,95 m tot
// 5,25 / -5,35 m van het hart, over de afgeschuinde hoek heen. Terras aan de noordoostkant (+X) onder de doorlopende
// overkapping: 1,1 m diep, glaswand tot 32,2 m, onderkant van de overkapping onder 50 graden.
const PAV = { x0: -4.75, x1: 4.45, y: 4.75, head: [2.4, 5.25, -5.35, -2.4], terrace: 1.1, canopy: 0.3 };
let pavilion = union([
  box(PAV.x0, -PAV.y, H.roof - 0.05, PAV.x1, PAV.y, H.pavilion),
  box(PAV.head[0], PAV.head[2], H.roof - 0.05, PAV.head[1], PAV.head[3], H.pavilion),
]);
const wallTop = H.pavilion - PAV.canopy - PAV.terrace * T50;
pavilion = pavilion.subtract(hull([
  [PAV.x1 - PAV.terrace, PAV.head[3], H.roof], [PAV.x1 + 0.5, PAV.head[3], H.roof], [PAV.x1 - PAV.terrace, PAV.y + 0.5, H.roof], [PAV.x1 + 0.5, PAV.y + 0.5, H.roof],
  [PAV.x1 - PAV.terrace, PAV.head[3], wallTop], [PAV.x1 - PAV.terrace, PAV.y + 0.5, wallTop],
  [PAV.x1 + 0.5, PAV.head[3], wallTop + (PAV.terrace + 0.5) * T50], [PAV.x1 + 0.5, PAV.y + 0.5, wallTop + (PAV.terrace + 0.5) * T50],
]));
// Over een afgeschuinde hoek heen (vooral de kop op de oosthoek): onderkant onder 50 graden vanaf de buitenkant van de
// dakrand. Per hoek een halfruimte z >= roof + tan50 x (afstand buiten de dakrand).
const d0 = (UX + UY - CHAMFER) / Math.SQRT2 + BAND_OUT; // afstand van het hart tot de schuine buitenkant van de dakrand
for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const n = [sx / Math.SQRT2, sy / Math.SQRT2];
  const len = Math.hypot(T50, 1);
  // z - T50 (n.p) >= roof - T50 d0
  pavilion = pavilion.trimByPlane([(-T50 * n[0]) / len, (-T50 * n[1]) / len, 1 / len], (H.roof - 0.05 - T50 * d0) / len);
}

const tower = union([lower, band, upper, roofBand, ...adds, luifel, pavilion]).subtract(union([...cuts, door]));

await writeLandmark({
  slug: "watertoren-oost-souburg",
  base: BASE,
  nodes: [["building:watertoren-schacht-band-bovenbouw-liseen-en-paviljoen", tower]],
  catalog: {
    name: "Watertoren Oost-Souburg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, 7.5], [0, -7.5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0718100000008321"],
    description:
      "Oorsprong op het hart van de BAG-rechthoek (11,40 x 11,62 m) op het maaiveld (NAP circa -0,1 m), +X naar de noordoostgevel (RD-hoek 56 graden), ingang op -Y (zuidoost). Vierkante bakstenen schacht tot de betonband op 20,85 m, met per gevel een overhoeks hoog venster, een getrapte lateiplaat, een liseen tot boven de dakrand en korte vensters onder de band; verjongde bovenbouw met afgeschuinde hoeken en hoge smalle vensters tot de dakrand op 29,85 m (AHN); glazen paviljoen met terras en een kop over de oosthoek tot 33,78 m (AHN). Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1939,
      architect: "ir. J.H.J. Kording",
      rijksmonument: 508771,
      publishedHeightM: 35,
      reservoirM3: 450,
      groundNapM: NAP0,
      ahnRoofEdgeNapM: 29.77,
      ahnPavilionNapM: 33.7,
      lowerBodyM: [2 * HX, 2 * HY],
      upperBodyM: [+(2 * UX).toFixed(2), +(2 * UY).toFixed(2)],
      upperChamferM: CHAMFER,
      bandM: [H.bandBottom, H.bandTop],
      roofBandM: [H.roofBandBottom, H.roof],
      liseneWidthM: LISENE.w,
      liseneTopM: H.liseneTop,
      tallWindowM: H.window,
      pavilionTopM: H.pavilion,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Oost-Souburg) (1939, J.H.J. Kording, 35 m, 450 m³, expositieruimte)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/508771 (vierkante plattegrond, 35 m, betonskelet met bakstenen mantel; ingangspartij met luifel op het zuidoosten, overhoeks hoog stalen venster, liseen tot de dakrand met smalle hoge vensters; bovendeel verjongd met afgeschuinde hoeken tussen twee betonbanden; plat dak; rond vlakbodemreservoir)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Oost-Souburg) (Oost-Souburg-Vlissingsestraat 239-ro3253.jpg, Oost-Souburg-Vlissingsestraat 239-detail-ro3251.jpg, Overzicht watertoren - Oost-Souburg - 20342496 - RCE.jpg)",
      "PDOK BAG-pand 0718100000008321, AHN DSM/DTM 0,5 m, luchtfoto Actueel_orthoHR en PDOK-terrein, 2026-11-06",
    ],
  },
});
