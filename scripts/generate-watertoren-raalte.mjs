// Watertoren van Raalte aan de Korenstraat (BAG-adres Korenstraat 25; DBNL noemt nr. 18), gebouwd in 1933 voor de
// Waterleiding Maatschappij Overijssel; volgens Wikipedia 44,7 m hoog met een reservoir van 177 m³, gemeentelijk monument.
// Een vlakbodemreservoir van beton in een bakstenen omkleding "in licht expressionistische vormen" onder een "afgeknot
// tentdak" (DBNL, Monumenten in Nederland: Overijssel). In 2004 door Vitens verkocht; sinds 2025-2026 wordt hij verbouwd
// tot woning (BAG-status "Verbouwing pand", woonfunctie; de luchtfoto van 2026 toont een bouwplaats en een nieuwe
// funderingsplaat ten zuidwesten van de toren).
// Een achtkante, licht taps toelopende toren van donkere baksteen. Op de acht hoeken staan lisenen (circa 1,7 m breed,
// 0,25 m uit) die circa 2,7 m onder de goot met een schuine kop eindigen; de voet heeft een iets uitspringende plint
// met een band op 3,4 m en twee ventilatieroosters per vlak. De westgevel (naar de Korenstraat) heeft een kolom smalle
// trapvensters, bovenin een uitkragend betonnen balkon op consoles met een deur en een luifel; ook de noordwestgevel
// heeft bovenin een balkon. Een betonnen goot rond het achtkante, met pannen gedekte tentdak tot NAP +50,8.
//
// Oorsprong op het hart van de achtkante dakrand in het AHN-DSM (een regelmatige achthoek past het best met de vlakken
// naar RD-richting 0 + 45k graden; de BAG-voet van pand 0177100000191442 is slordig getekend en bevat ook de nieuwe
// aanbouw ten zuidwesten en een trappenhuis/lift ten noordoosten, maar de oost-, noord- en westzijde liggen op 6,0 à
// 6,2 m van dit hart) op het maaiveld, AHN-DTM NAP +6,3 (6,2 tot 6,5 in een ring van 6 tot 12 m). +X wijst naar
// RD-richting -4 graden (uit de oost- en westzijde en de noordzijde van het BAG-pand), +Y naar 86 graden.
// Maten: AHN-DSM 0,5 m (dakrand NAP +48,0 op 5,3 à 5,4 m van het hart; gevelpunten tot 6,0 à 6,3 m tussen NAP +13 en
// +38, dus taps; dak rechtlijnig 0,5 m per m tot de top op NAP +50,8; balkons tot NAP +44,2 buiten de goot naar het
// westen en noordwesten); geledingen uit "Raalte Watertoren 8245.JPG" (Commons, 2006, vanaf de Korenstraat in het
// westen, van onderaf; schaal circa 61 px/m bovenin en 72 px/m onderin uit de gevelbreedte).
import { hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [215613.7, 489468.1];
const AXIS_DEG = -4;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 6.3;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 49,26, west 49,27, noord 49,19, zuid
// 49,30; diagonalen op 9,2 m 49,22 tot 49,34; het PDOK-pand begint op 49,17), gemeten 2026-11-06 met de terreintegels
// van de export.
const GROUND_ELLIPSOID = 49.19;

const C = Math.cos(Math.PI / 8);
// Achthoek met apothema a (vlakken naar 0 + 45k graden) op hoogte z, als 3D-punten.
const oct = (a, z) => Array.from({ length: 8 }, (_, k) => {
  const t = Math.PI / 8 + (k * Math.PI) / 4;
  return [(a / C) * Math.cos(t), (a / C) * Math.sin(t), z];
});
const octPrism = (a0, z0, a1, z1) => hull([...oct(a0, z0), ...oct(a1, z1)]);
// Rechte nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen
// onder 56 graden op (zie generate-watertoren-deventer.mjs).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const FACES = Array.from({ length: 8 }, (_, k) => 45 * k);
const W = 180, NW = 135;

// ---------- hoogtes boven het maaiveld (NAP +6,3) ----------
const H = {
  plinth: 3.3, // plint met band (foto 3,4 tot 3,5 m)
  pierTop: 39.0, // kop van de hoeklisenen (foto 1,5 tot 2,5 m onder de goot)
  gutter: [41.15, 41.7], // betonnen goot (AHN dakrand NAP +48,0)
  apex: 44.25, // afgeknot dak (AHN NAP +50,6 à 50,8)
  top: 44.5, // dakschild op de top (AHN NAP +50,8)
  balcony: [36.85, 37.9], // balkonborstwering (AHN NAP +44,2)
  door: [37.9, 40.0],
  canopy: 41.15,
};
// Apothema's (afstand hart-gevelvlak).
const A = {
  foot: 6.0, // gevel op het maaiveld (BAG 6,0 à 6,2 met plint)
  top: 5.35, // gevel onder de goot (AHN-dakrand 5,3 à 5,4)
  plinth: 0.12, // uitsprong van de plint
  pier: 0.25, // uitsprong van de hoeklisenen
  gutter: 5.6,
  apex: 0.5,
};
const wallA = (z) => A.foot + ((A.top - A.foot) * z) / H.gutter[1];

// ---------- schacht, plint en goot ----------
const shaft = octPrism(A.foot, BASE, A.top, H.gutter[1]);
const plinth = union([
  octPrism(wallA(BASE) + A.plinth, BASE, wallA(H.plinth) + A.plinth, H.plinth),
  // Schuin afgezette band (50 graden) terug naar de gevel.
  octPrism(wallA(H.plinth) + A.plinth, H.plinth - 0.01, wallA(H.plinth + 0.15), H.plinth + 0.15),
]);
// Goot rond de dakvoet, met een onderkant van 50 graden vanaf de gevel.
const gutter = hull([...oct(A.top, H.gutter[0] - 1.2 * (A.gutter - A.top)), ...oct(A.gutter, H.gutter[0]), ...oct(A.gutter, H.gutter[1])]);

// ---------- hoeklisenen ----------
// Op de hoek in de richting +X gebouwd (hoek op 22,5 graden na draaien over -22,5): langs elk aangrenzend vlak
// 0,85 m vanaf de hoek, 0,25 m uit de gevel, met een schuine kop (de buitenkant 0,45 m lager, 61 graden).
const pierAt = (z, dz = 0) => {
  // Hoek op (rho, 0); de aangrenzende vlakken hebben normalen op ±22,5 graden en lopen van de hoek af in de richting
  // (-sin 22,5, ±cos 22,5).
  const a = wallA(z), rho = a / C, sn = Math.sin(Math.PI / 8), cs = Math.cos(Math.PI / 8), L = 0.85;
  const out = [];
  for (const s of [-1, 1]) {
    const along = [-sn, s * cs], nrm = [cs, s * sn];
    out.push([rho + along[0] * L + nrm[0] * A.pier, along[1] * L + nrm[1] * A.pier, z + dz]); // buitenvlak
    out.push([rho + along[0] * L - nrm[0] * 0.3, along[1] * L - nrm[1] * 0.3, z]); // in de muur
  }
  out.push([(a + A.pier) / C, 0, z + dz], [rho - 0.6, 0, z]);
  return out;
};
const pier = place(hull([...pierAt(BASE), ...pierAt(H.pierTop, -0.45)]), { deg: 22.5 });
const piers = union(around(pier, FACES));

// ---------- openingen ----------
// Westgevel: kolom smalle trapvensters (0,45 m breed, 1,2 m hoog, als nis) en twee ventilatieroosters per vlak (0,7
// bij 1,1 m) in de plint.
const slits = union([7, 14, 21, 28, 34.3].map((z) => niche(wallA(z + 1.2), 0.45, z, z + 1.2, 0.3)));
const vents = union([-1.0, 1.0].map((y) => niche(wallA(1.9) + A.plinth, 0.7, 0.8, 1.9, 0.3, y)));
// Deur in de noordwestgevel (1,3 m breed, 2,4 m hoog; positie uit de foto geschat).
const door = niche(wallA(2.4) + A.plinth, 1.3, BASE + 0.2, 2.4, 0.4);
// Balkondeur boven het westbalkon (1,2 m breed).
const balconyDoor = niche(wallA(H.door[1]), 1.2, H.door[0], H.door[1], 0.35);
const openings = union([
  ...around(vents, FACES),
  place(slits, { deg: W }),
  place(door, { deg: NW }),
  place(balconyDoor, { deg: W }),
]);

// ---------- balkons en luifel ----------
// Balkon: 1,9 m breed, 0,95 m uit, borstwering 1,05 m hoog, op een console onder 52 graden tot in de gevel.
const balcony = (() => {
  const a = wallA(H.balcony[1]), x0 = a - 0.3, x1 = a + 0.95, y = 0.95, z0 = H.balcony[0], z1 = H.balcony[1];
  return hull([
    [x0, -y, z0 - 1.3 * (x1 - a)], [x0, y, z0 - 1.3 * (x1 - a)],
    [x1, -y, z0], [x1, y, z0], [x1, -y, z1], [x1, y, z1], [x0, -y, z1], [x0, y, z1],
  ]);
})();
// Luifel boven de balkondeur tot de goot: 2,1 m breed, 0,55 m uit, onderkant 50 graden.
const canopy = (() => {
  const a = wallA(H.canopy), y = 1.05;
  return hull([
    [a - 0.3, -y, H.door[1]], [a - 0.3, y, H.door[1]],
    [a + 0.55, -y, H.door[1] + 0.65], [a + 0.55, y, H.door[1] + 0.65],
    [a + 0.55, -y, H.gutter[1] - 0.05], [a + 0.55, y, H.gutter[1] - 0.05],
    [a - 0.3, -y, H.gutter[1] - 0.05], [a - 0.3, y, H.gutter[1] - 0.05],
  ]);
})();

// ---------- dak ----------
// Achtkant tentdak, 0,5 m per m (27 graden) van de goot tot een afgeknotte top, met een dekschild.
const roof = union([
  hull([...oct(A.gutter, H.gutter[1] - 0.05), ...oct(A.apex, H.apex)]),
  octPrism(A.apex, H.apex - 0.05, A.apex, H.top),
]);

const tower = union([shaft, plinth, piers, gutter, roof, place(balcony, { deg: W }), place(balcony, { deg: NW }), place(canopy, { deg: W })])
  .subtract(openings);

await writeLandmark({
  slug: "watertoren-raalte",
  base: BASE,
  nodes: [["building:watertoren-schacht-lisenen-balkons-en-dak", tower]],
  catalog: {
    name: "Watertoren Raalte",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8.5, 0], [-8.5, 0], [0, 8.5], [0, -8.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0177100000191442"],
    description:
      "Oorsprong op het hart van de achtkante dakrand op het maaiveld (NAP +6,3 m), +X naar RD-richting -4 graden, +Y naar 86 graden; vlakken naar 0 + 45k graden, de westgevel (Korenstraat) naar -X. Achtkante, taps toelopende schacht (apothema 6,0 tot 5,35 m) met plint en roosters, acht hoeklisenen met schuine koppen op 39 m, een kolom trapvensters in de westgevel, een deur in de noordwestgevel, balkons op consoles op 37,9 m naar het westen en noordwesten (west met deur en luifel), betonnen goot op 41,7 m en een achtkant tentdak tot 44,5 m. Maten uit AHN, BAG en één foto.",
    realWorld: {
      built: 1933,
      client: "Waterleiding Maatschappij Overijssel",
      publishedHeightM: 44.7,
      reservoirM3: 177,
      ahnGroundNapM: GROUND_NAP,
      ahnEavesNapM: 48.0,
      ahnBalconyNapM: 44.2,
      ahnTopNapM: 50.8,
      apothemM: [A.foot, A.top],
      gutterApothemM: A.gutter,
      gutterM: H.gutter,
      pierTopM: H.pierTop,
      balconyM: H.balcony,
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Raalte) (1933, 44,7 m, 177 m³, gemeentelijk monument; in 2004 door Vitens verkocht)",
      "https://www.dbnl.org/tekst/sten009monu03_01/sten009monu03_01_0085.php (Monumenten in Nederland, Overijssel: Korenstraat 18, 1933, Waterleiding Maatschappij Overijssel, vlakbodemreservoir van beton, bakstenen omkleding in licht expressionistische vormen, afgeknot tentdak)",
      "https://commons.wikimedia.org/wiki/File:Raalte_Watertoren_8245.JPG (2006, vanuit het westen: hoeklisenen, balkons, luifel, goot, dak, trapvensters, plint en roosters)",
      "PDOK BAG-pand 0177100000191442, AHN DSM/DTM 0,5 m en luchtfoto's 2022 en 2026, 2026-11-06",
    ],
  },
});
