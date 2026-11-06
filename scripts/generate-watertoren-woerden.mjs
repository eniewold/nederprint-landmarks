// Watertoren van Woerden aan de Oostsingel 1A, rijksmonument 512630 (complex 512629; het machinegebouw ernaast is
// 512631 en blijft PDOK). Gebouwd in 1905-1906 naar ontwerp van J. Schotel in neorenaissance- en art-nouveautrant, tot
// 1979 in gebruik, één reservoir van 75 m³, sinds 2014 een woning ("De Kroon van Woerden"). Ronde toren van rode, bruine
// en gele rijnsteen in drie geledingen op een lage aangeaarde verhoging met de oude waterkelder: een licht taps
// toelopende voet met het ondiep uitgebouwde portaal onder een zadeldakje met tuitgevel (de ingang, met tegenover de
// ingang een rechthoekig venster), een uitkragende band, een taps toelopende schacht met tien in hoogte verspringende
// vensters langs de trap, een uitkragende band en daarop de uitkraging naar het reservoir (consoles op een ijzeren
// raamwerk met baksteenvulling), de gele reservoirgeleding met een geprofileerde onderrand, tien hoge smalle
// keperboogvensters, een rondboogfries en kantelen rond het vlakke dak.
//
// Oorsprong op het hart van BAG-pand 0632100000017372 (cirkelfit op de 33 hoekpunten, straal 3,96 m: de BAG-contour is
// de bovenaanzichtlijn van het reservoir; de voet zelf is smaller) op maaiveld. +X is de as van het portaal (RD -175
// graden, naar het westen): het portaal staat op de luchtfoto's van 2021 en 2024 aan de westkant van de toren en op de
// foto's vanaf de Oostsingel en de brug in het zuiden links op de rand van de toren.
// Hoogtes: het nulpunt ligt op de laagste PDOK-terreinhoogte op de groundSamplePoints min 0,1 m, ellipsoïdisch 45,69 =
// NAP +2,29 (PDOK-terrein = NAP + 43,4 op de verhoging en ernaast). De voet van de toren staat op de verhoging op NAP
// +2,65 (AHN-DTM tussen 4,5 en 5 m van het hart 2,6 à 2,7; de straat ernaast NAP +0,9), dus FOOT = 0,36 m boven nul.
// Maten: BAG (reservoirstraal 3,96), AHN-DSM 0,5 m (vlak dak NAP +25,7 à +25,8, kantelen NAP +26,7 à +26,9 tot circa
// 4,0 à 4,2 m van het hart), de luchtfoto's 2021 en 2024 (bovenkant 7,9 à 8,0 m breed, dakluik, portaal), het
// monumentenregister (28 m, doorsnede binnen 5,70 m onder en 7,10 m boven) en de foto's "Watertoren, Woerden 6805.jpg"
// (vanaf de Oostsingel, nagenoeg recht; schaal 0,0203 m per pixel, horizontaal en verticaal gelijk) en de RCE-foto's
// 20216460 tot 20216463 (onderste gedeelte frontaal op het portaal, bovenste gedeelte).
import { circle, ring3, prism, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [120552.67, 455716.78];
const DEG = -175;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints op 4,5 m van het hart, schuin tussen portaal en
// gevels (portaal-links 46,09, achter-links 45,79, achter-rechts 46,00, portaal-rechts 46,04), gemeten 2026-11-06; het
// PDOK-pand begint op 44,30 (de straat naast de verhoging).
const GROUND_ELLIPSOID = 45.79;
// Voet van de toren boven het nulpunt van het model (NAP +2,65 tegen NAP +2,29).
const FOOT = 0.36;
const z = (h) => FOOT + h; // hoogte boven de voet → modelhoogte

const N = 80;
const ring = (r, h) => ring3(circle([0, 0], r, N, Math.PI / N), h);
// Afgeknotte kegel tussen twee modelhoogtes.
const frustum = (r0, z0, r1, z1) => hull([...ring(r0, z0), ...ring(r1, z1)]);
const cyl = (r, z0, z1) => frustum(r, z0, r, z1);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, phase = 0) => Array.from({ length: n }, (_, k) => phase + (360 * k) / n);

// Rechthoekige nis in de gevel met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar
// binnen onder 56 graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Spitsboognis (keperboog) met normaal +X: rechte zijden tot zs, punt op za; za - zs ≥ 1,2 · w/2, dus de boogzijden
// staan steiler dan 50 graden.
const pointedNiche = (f, w, z0, zs, za, depth = 0.3) => {
  const a = f - depth, b = f + 1.0;
  const pts = [];
  for (const x of [a, b]) pts.push([x, -w / 2, z0], [x, w / 2, z0], [x, -w / 2, zs], [x, w / 2, zs], [x, 0, za]);
  return hull(pts);
};

// ---------- hoogtes boven de voet (foto 6805: 0,0203 m per pixel, AHN voor dak en kantelen) ----------
const H = {
  baseBand: [4.8, 5.0, 5.3, 5.55], // uitkragende band op de voet: onderkant, buitenkant, bovenkant buitenkant, schacht
  shaftBand: [14.05, 14.22, 14.95], // band boven aan de schacht
  flare: [14.6, 16.2], // uitkraging van de schacht naar het reservoir (binnenkegel)
  rib: [14.79, 16.37], // consoles op de uitkraging
  rim: [16.2, 16.37, 16.9, 17.05], // geprofileerde onderrand van het reservoir
  window: [18.43, 20.2, 20.74], // keperboogvensters: onderkant, aanzet, punt
  frieze: [21.3, 21.45], // rondboogfries: onderkant, buitenkant
  roof: 23.1, // vlak dak (AHN NAP +25,7 à +25,8)
  crenel: 23.25, // onderkant van de kantelopeningen
  merlon: 24.15, // bovenkant van de kantelen (AHN NAP +26,7 à +26,9)
};
const R = {
  base: [3.45, 3.1], // voet, taps (RCE 20216462: 0,4 m smaller over de hoogte)
  baseBand: 3.3,
  shaft: [2.85, 2.55], // schacht onder en boven (foto 6805: 5,6 en 5,1 m breed)
  shaftBand: 2.72,
  flare: 3.95,
  rim: 4.12,
  drum: 3.97, // reservoirgeleding (BAG 3,96; foto 6805: 7,8 m breed)
  parapet: [3.67, 4.12],
};

// ---------- voet, schacht, uitkraging, reservoir ----------
const base = frustum(R.base[0], BASE, R.base[1], z(H.baseBand[0]) + 0.01);
const baseBand = union([
  frustum(R.base[1], z(H.baseBand[0]), R.baseBand, z(H.baseBand[1])),
  cyl(R.baseBand, z(H.baseBand[1]) - 0.01, z(H.baseBand[2])),
  frustum(R.baseBand, z(H.baseBand[2]) - 0.01, R.shaft[0] + 0.05, z(H.baseBand[3])),
]);
const shaft = frustum(R.shaft[0], z(H.baseBand[2]), R.shaft[1], z(H.shaftBand[0]) + 0.01);
const shaftBand = union([
  frustum(R.shaft[1], z(H.shaftBand[0]), R.shaftBand, z(H.shaftBand[1])),
  cyl(R.shaftBand, z(H.shaftBand[1]) - 0.01, z(H.shaftBand[2])),
]);
// Binnenkegel van de uitkraging onder 41 graden, en zestien consoles die 0,17 m voor de kegel liggen (43 graden).
const flare = frustum(R.shaft[1] - 0.05, z(H.flare[0]), R.flare, z(H.flare[1]) + 0.01);
const rib = (() => {
  const w = 0.5, pts = [];
  for (const [r, h] of [[R.shaftBand - 0.3, H.rib[0]], [R.shaftBand, H.rib[0]], [R.flare - 0.3, H.rib[1]], [R.rim, H.rib[1]]]) pts.push([r, -w / 2, z(h)], [r, w / 2, z(h)]);
  return hull(pts);
})();
const ribs = around(rib, every(16, 360 / 32));
const rim = union([
  frustum(R.flare, z(H.rim[0]), R.rim, z(H.rim[1])),
  cyl(R.rim, z(H.rim[1]) - 0.01, z(H.rim[2])),
  frustum(R.rim, z(H.rim[2]) - 0.01, R.drum, z(H.rim[3])),
]);
const drum = cyl(R.drum, z(H.rim[2]), z(H.frieze[0]) + 0.01);
// Rondboogfries met de borstwering en de kantelen erop: 0,15 m voor de reservoirwand, onderkant onder 45 graden.
const frieze = frustum(R.drum, z(H.frieze[0]), R.parapet[1], z(H.frieze[1]));
const parapet = cyl(R.parapet[1], z(H.frieze[1]) - 0.01, z(H.merlon));

// ---------- openingen ----------
// Twaalf kantelen van 1,0 m (in het echt circa 25 smallere): de kantelopeningen even breed, radiaal gesneden.
const crenelCut = (() => {
  const half = (360 / 24 / 2) * (Math.PI / 180), r = R.parapet[1] + 0.5;
  return hull([[0, 0, z(H.crenel)], [r * Math.cos(half), -r * Math.sin(half), z(H.crenel)], [r * Math.cos(half), r * Math.sin(half), z(H.crenel)],
    [0, 0, z(H.merlon) + 1], [r * Math.cos(half), -r * Math.sin(half), z(H.merlon) + 1], [r * Math.cos(half), r * Math.sin(half), z(H.merlon) + 1]]);
})();
const openings = union([
  // Dak binnen de borstwering.
  cyl(R.parapet[0], z(H.roof), z(H.merlon) + 1),
  ...around(crenelCut, every(12)),
  // Tien keperboogvensters in de reservoirgeleding, één boven het portaal.
  ...around(pointedNiche(R.drum, 0.8, z(H.window[0]), z(H.window[1]), z(H.window[2]), 0.3), every(10)),
  // Tien rechthoekige vensters langs de trap in de schacht, van 6,0 tot 11,4 m in hoogte verspringend.
  ...every(10, 18).map((deg, k) => {
    const z0 = 6.0 + 0.6 * k, rr = R.shaft[0] + ((R.shaft[1] - R.shaft[0]) * (z0 + 1.0 - H.baseBand[2])) / (H.shaftBand[0] - H.baseBand[2]);
    return place(niche(rr, 0.8, z(z0), z(z0 + 2.0), 0.3), { deg });
  }),
  // Rechthoekig venster in de voet recht tegenover de ingang.
  place(niche(R.base[0] - 0.12, 0.9, z(1.8), z(3.2), 0.3), { deg: 180 }),
]);

// ---------- portaal (+X) ----------
// Ondiep uitgebouwd portaal van 2,6 m breed tot 4,25 m van het hart, gootlijst op 3,5 m, tuitgevel tot 5,0 m met een
// zadeldakje erachter; spitsboogdeur van 1,4 m (dubbele deur) op een stoep van 0,6 m.
const P = { x0: 2.4, x1: 3.9, x2: 4.25, w: 2.6, eave: 3.5, ridge: 4.75, apex: 5.0 };
const gableProfile = (x, eave, top, w) => [[x, -w / 2, BASE], [x, w / 2, BASE], [x, -w / 2, z(eave)], [x, w / 2, z(eave)], [x, 0, z(top)]];
const portal = union([
  hull([...gableProfile(P.x0, P.eave, P.ridge, P.w), ...gableProfile(P.x1 + 0.01, P.eave, P.ridge, P.w)]),
  // Tuitgevel 0,35 m dik, iets hoger en breder dan het dakje.
  hull([...gableProfile(P.x1, P.eave + 0.1, P.apex, P.w + 0.2), ...gableProfile(P.x2, P.eave + 0.1, P.apex, P.w + 0.2)]),
  // Stoep voor de deur.
  box(P.x2 - 0.01, -1.0, BASE, P.x2 + 0.8, 1.0, z(0.6)),
]);
const door = pointedNiche(P.x2, 1.4, z(0.6), z(2.5), z(3.4), 0.4);

// ---------- dakluik ----------
// Glazen dakluik op het vlakke dak (luchtfoto 2024: circa 2,0 bij 1,0 m, op 2,6 m van het hart naar het noordwesten),
// 0,5 m hoog.
const hatch = place(box(2.1, -1.0, z(H.roof) - 0.05, 3.1, 1.0, z(H.roof) + 0.5), { deg: 309 - (DEG + 360) });

const building = union([base, baseBand, shaft, shaftBand, flare, ...ribs, rim, drum, frieze, parapet, portal])
  .subtract(openings)
  .subtract(door)
  .add(hatch);

await writeLandmark({
  slug: "watertoren-woerden",
  base: BASE,
  nodes: [["building:watertoren-voet-portaal-schacht-reservoir-en-kantelen", building]],
  catalog: {
    name: "Watertoren Woerden",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[3.2, 3.2], [-3.2, 3.2], [-3.2, -3.2], [3.2, -3.2]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de verhoging rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0632100000017372"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op de aangeaarde verhoging, +X de as van het portaal naar het westen (RD -175 graden). Taps toelopende voet met het portaal (tuitgevel tot 5,3 m, spitsboogdeur) en een venster tegenover de ingang, uitkragende band, taps toelopende schacht met tien verspringende vensters, band en uitkraging met zestien consoles onder 45 graden, reservoirgeleding met geprofileerde onderrand en tien keperboogvensters, rondboogfries, borstwering met twaalf kantelen tot 24,5 m rond het vlakke dak met dakluik. Maten uit BAG, AHN, luchtfoto's, het monumentenregister en foto's.",
    realWorld: {
      built: "1905-1906",
      architect: "J. Schotel",
      monument: "rijksmonument 512630 (complex 512629; machinegebouw 512631)",
      wikipediaHeightM: "27 à 28 (register: 28)",
      reservoirM3: 75,
      innerDiameterM: { bottom: 5.7, top: 7.1 },
      ahnFootNapM: 2.65,
      ahnStreetNapM: 0.9,
      ahnRoofNapM: 25.75,
      ahnMerlonNapM: 26.8,
      footAboveModelZeroM: FOOT,
      baseRadiusM: R.base,
      shaftRadiusM: R.shaft,
      reservoirRadiusM: R.drum,
      parapetRadiusM: R.parapet[1],
      reservoirM: [z(H.rim[0]), z(H.merlon)],
      roofM: z(H.roof),
      apexM: z(H.merlon),
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Woerden) (1905-1906, J. Schotel, 27 à 28 m, 75 m³, doorsnede binnen 5,70 en 7,10 m)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/512630 (redengevende omschrijving: drie geledingen, portaal onder zadeldakje met tuitgevel, venster tegenover de ingang, tien verspringende vensters, overkragende geleding met tien keperboogvensters, rondboogfries en kantelen, vlak dak)",
      "https://commons.wikimedia.org/wiki/File:Watertoren,_Woerden_6805.jpg (vanaf de Oostsingel)",
      "https://commons.wikimedia.org/wiki/File:Watertoren,_onderste_gedeelte_-_Woerden_-_20216462_-_RCE.jpg (portaal en voet, frontaal)",
      "https://commons.wikimedia.org/wiki/File:Watertoren,_bovenste_gedeelte_-_Woerden_-_20216463_-_RCE.jpg (reservoirgeleding)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_(Woerden).JPG en File:Watertoren_-_Woerden_-_20216460_-_RCE.jpg (vanaf de brug in het zuiden)",
      "PDOK BAG-pand 0632100000017372, AHN DSM/DTM 0,5 m en luchtfoto's 2021, 2024 en actueel, 2026-11-06",
    ],
  },
});
