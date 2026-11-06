// Voormalige watertoren aan de Turfmarkt in Zwolle, gebouwd in 1892 naar een ontwerp van Jan Schotel, 36 m hoog met
// een reservoir van 500 m³ (Wikipedia). In 1935 gerenoveerd, in 1959 omgeven door een tienhoekige stenen mantel, sinds
// 1996 buiten gebruik. Tussen juli 2017 en november 2018 omgebouwd tot 21 appartementen: het onderste deel is in de
// oorspronkelijke staat hersteld (de ronde, onderaan uitlopende bakstenen schacht op een natuurstenen plint, met een
// natuurstenen band, vensters in vijf rijen en gekoppelde rondboogvensters met een medaillon op de begane grond), het
// bovenste deel is nieuwbouw: een tienhoekige opbouw van vijf lagen in rode gevelplaten met lichte banden, gedragen
// door tien donkere consoles op de hoeken, met een terugliggende glazen bovenste laag onder een overstekend, naar
// buiten hellend dakrandprofiel en een flauw tienzijdig tentdak van zink. Aan de noordkant een lage aanbouw (entree)
// met een plat dak.
//
// Oorsprong op het hart van de ronde schacht: cirkel door de actuele BGT-contour van pand 0193100000026499 (straal
// 6,38 m, de plint) en het hart van de tienhoekige BAG-contour (straal 8,54 m, de opbouw), op maaiveld NAP +1,6
// (AHN-DTM rondom 1,5 à 1,6; PDOK-terrein aan de zuid- en westkant iets hoger). +X wijst naar RD-richting 5,92 graden:
// naar een hoek van de tienhoek (BAG-hoekpunten op 5,92 + 36k graden, de dakrand op de luchtfoto ook); +Y naar 95,92
// graden (noord). De aanbouw (BGT-contour, AHN-DSM NAP +7,1) ligt lokaal tussen 36 en 110 graden.
// Hoogtes: dakrand en tentdak uit het AHN-DSM 0,5 m (dakrand NAP +38,4 op 9,3 m, top NAP +42,3; het dak loopt recht af
// met circa 0,43 m per m, 23 graden); de geledingen uit de foto "Voormalige watertoren Turfmarkt Zwolle.jpg"
// (Commons, 2020, vanuit het zuid-zuidwesten over het water): horizontaal 46,4 px/m (de breedte van de opbouw, 16,6 m,
// klopt met de BAG-tienhoek en de plint met de BGT-cirkel), verticaal 47,5 px/m in de opbouw (verankerd op de dakrand
// uit het AHN) en 49,5 px/m in de schacht (vanaf het maaiveld).
import { Manifold, CrossSection, ccw, hull, union, box, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [203684.3, 503011.32];
const AXIS_DEG = 5.92;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 1.6;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06 met de terreintegels van de
// export (oost 44,24, west 44,45, zuid 44,67, noordwest 44,27). Aan de zuidkant ligt het grastalud 0,4 m hoger; de
// plint zakt daar verder in.
const GROUND_ELLIPSOID = 44.24;

// RD naar lokaal (meters vanaf de oorsprong, X langs AXIS_DEG).
const local = ([x, y]) => {
  const a = (AXIS_DEG * Math.PI) / 180, dx = x - ORIGIN[0], dy = y - ORIGIN[1];
  return [+(dx * Math.cos(a) + dy * Math.sin(a)).toFixed(3), +(-dx * Math.sin(a) + dy * Math.cos(a)).toFixed(3)];
};

// Omwenteling van een gesloten profiel [[r, z], ...]; massief onder een profiel, gesloten langs de as.
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Ring tot r1 tussen z0 en z1 met een onderkant van 50 graden vanaf rIn.
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
// Tienhoek met hoekpunten op 36k graden, gegeven de afstand tot de zijden (apothema), als punten op hoogte z.
const COS18 = Math.cos(Math.PI / 10);
const deca = (apo, z) => Array.from({ length: 10 }, (_, k) => {
  const t = (k * Math.PI) / 5, r = apo / COS18;
  return [r * Math.cos(t), r * Math.sin(t), z];
});
const decaPrism = (apo, z0, z1) => hull([...deca(apo, z0), ...deca(apo, z1)]);
// Band rond de tienhoek: 'out' m uit de gevel, onderkant onder 50 graden.
const decaBand = (apo, out, z0, z1) => hull([...deca(apo - 0.01, z0 - 1.2 * out), ...deca(apo + out, z0), ...deca(apo + out, z1), ...deca(apo - 0.01, z1)]);
// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder 56
// graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const y0 = y - w / 2, y1 = y + w / 2, za = z1 + 1.5 * depth, out = Math.min(1, (z1 - z0) / 1.5);
  return hull([
    [f - depth, y0, z0], [f + out, y0, z0], [f - depth, y1, z0], [f + out, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + out, y0, z1 - 1.5 * out], [f + out, y1, z1 - 1.5 * out],
  ]);
};
// Rondboognis: als niche, met een halfrond (7 punten) vanaf zSpring; het boogplafond loopt naar binnen onder 63 graden op.
const archNiche = (f, w, z0, zSpring, depth = 0.3, y = 0) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [y - r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([yy, z]) => [a, yy, z + 2 * depth]),
    ...arc.map(([yy, z]) => [f, yy, z]),
    ...arc.map(([yy, z]) => [f + 1, yy, Math.max(z0, z - 1.5)]),
    [a, y - r, z0], [a, y + r, z0], [f + 1, y - r, z0], [f + 1, y + r, z0],
  ]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);

// ---------- hoogtes boven het maaiveld (NAP +1,6) en stralen ----------
const H = {
  plinth: 1.15, // natuurstenen plint, met een schuine bovenkant tot 1,4
  shaftFoot: 1.4,
  band: [6.8, 8.0], // natuurstenen band (blokken tussen de vensters)
  bracketFoot: 16.25, // voet van de consoles op de schacht
  soffit: 17.0, // de schuine onderkant van de opbouw begint hier op de schacht
  under: 20.8, // onderkant van de gevelplaten (hoeken)
  bottomBand: 21.15, // lichte onderrand van de gevelplaten, 0,1 m uit de gevel (de bovenrand van de schuine onderkant)
  facadeBand: [27.05, 27.35], // lichte band in de gevel
  coping: [33.25, 33.6], // bovenste band en bovenkant van de gevelplaten
  glassTop: 34.95, // de terugliggende glazen bovenste laag loopt tot de schuine onderkant van de dakrand
  fasciaFoot: 35.9,
  rim: 36.84, // bovenkant van de dakrand (AHN NAP +38,44)
  apex: 40.7, // top van het tentdak (AHN NAP +42,3)
  annex: 5.5, // plat dak van de aanbouw (AHN NAP +7,1)
};
const R = {
  plinth: 6.38, // BGT-cirkel
  shaft: [[6.2, 1.4], [5.9, 3.8], [5.75, 5.85], [5.57, 6.8], [5.45, 8.0]], // uitlopende voet tot boven de band
  band: 5.78,
  clad: 8.12, // apothema van de BAG-tienhoek (straal 8,54)
  glass: 7.75,
  fascia: 8.6,
  rim: 8.85, // apothema van de dakrand (straal 9,3 op de luchtfoto en in het DSM)
};
// Rechte verjonging boven de band: 5,45 m op 8,0 m tot 5,13 m op 19,1 m.
const shaftR = (z) => 5.45 - ((5.45 - 5.13) * (z - 8.0)) / 11.1;

// ---------- plint en schacht ----------
const shaftTop = H.soffit + 0.5;
const shaft = solidRev([[R.plinth, BASE], [R.plinth, H.plinth], [R.shaft[0][0], H.shaftFoot], ...R.shaft.slice(1), [shaftR(shaftTop), shaftTop]]);
const band = ledge(shaftR(H.band[0]) + 0.1, R.band, ...H.band);

// Vensters. Hoekpunten van de tienhoek (consoles) op 36k graden, de velden ertussen op 18 + 36k.
const VERTS = every(10, 0);
const BAYS = every(10, 18);
// Begane grond: gekoppelde rondboogvensters (0,75 m, 0,3 m ertussen) in een ondiep rondboogveld met het medaillon, op
// de even hoekpunten behalve aan de kant van de aanbouw (72 graden).
const groundPair = union([
  archNiche(5.8, 2.3, H.shaftFoot + 0.05, 4.85, 0.12),
  archNiche(5.68, 0.75, 1.45, 3.8, 0.3, -0.53),
  archNiche(5.68, 0.75, 1.45, 3.8, 0.3, 0.53),
]);
const shaftOpenings = union([
  ...around(groundPair, [0, 144, 216, 288]),
  // Rij 1 (in de band) en rij 3: tien vensters van 0,9 m tussen de consoles.
  ...around(niche(shaftR(8.8), 0.9, 6.75, 8.8, 0.3), BAYS),
  ...around(niche(shaftR(14.6), 0.9, 12.1, 14.6, 0.3), BAYS),
  // Rij 2: vijf gekoppelde smalle vensters (samen 1,1 m) op de even hoekpunten.
  ...around(niche(shaftR(12.0), 1.1, 9.5, 12.0, 0.3), every(5, 0)),
  // Rij 4: tien smalle vensters onder de consoles; het plafond blijft onder de voet van de console (16,25 m).
  ...around(niche(shaftR(15.6), 0.7, 14.9, 15.6, 0.3), VERTS),
]);
const tower = union([shaft, band]).subtract(shaftOpenings);

// ---------- aanbouw (noord) ----------
// BGT-contour van pand 0193100000026499 buiten de schacht, aangevuld tot binnen de schacht.
const ANNEX_RD = [[203690.686, 503017.093], [203686.072, 503019.777], [203682.523, 503021.842], [203682.439, 503021.701], [203680.869, 503019.051], [203681.624, 503017.124]];
const annexPlan = [...ANNEX_RD.map(local), [-1.0, 3.5], [3.0, 2.5]];
const annex = prism(annexPlan, BASE, H.annex);

// ---------- consoles en schuine onderkant van de opbouw ----------
// Onderkant als omhullende van de schacht op 17,0 m en de onderrand van de gevel (0,1 m buiten de tienhoek) op 20,8 m:
// 50,6 graden midden op de zijden, 47 graden onder de hoeken. Een losse onderrand met een eigen schuine kant liet de
// export de hele onderkant in lagen van 0,2 mm opvullen; nu is de rand het bovenste stuk van de onderkant. Daaronder
// tien consoles van 0,9 m op de hoeken, met een onderkant van 50 graden.
const ringPts = (r, z, n = 48) => Array.from({ length: n }, (_, k) => [r * Math.cos((2 * Math.PI * k) / n), r * Math.sin((2 * Math.PI * k) / n), z]);
const soffit = hull([...ringPts(5.1, H.soffit), ...deca(R.clad + 0.1, H.under), ...deca(R.clad + 0.1, H.bottomBand)]);
const corner = R.clad / COS18;
const bracketOne = hull([
  [4.9, -0.45, H.bracketFoot], [4.9, 0.45, H.bracketFoot],
  [5.15, -0.45, H.bracketFoot], [5.15, 0.45, H.bracketFoot],
  [corner, -0.45, 20.3], [corner, 0.45, 20.3],
  [corner, -0.45, H.under + 0.05], [corner, 0.45, H.under + 0.05],
  [4.9, -0.45, H.under + 0.05], [4.9, 0.45, H.under + 0.05],
]);
const brackets = union(around(bracketOne, VERTS));

// ---------- opbouw ----------
// Gevelplaten van 20,8 tot 33,6 m op de BAG-tienhoek, met de onderrand, een lichte band en de bovenrand; per zijde een kolom vensters van 1,75 m
// (twee lagen boven elkaar, met een donkere borstwering) op de zijden met vensters op de foto en, geschat, op de zijden
// met hetzelfde ritme (twee met, één zonder) rondom.
const WINDOW_FACES = [0, 2, 3, 6, 7, 9];
const faceWin = union([niche(R.clad, 1.75, 21.6, 26.7, 0.3), niche(R.clad, 1.75, 27.6, 32.5, 0.3)]);
const cladding = union([
  decaPrism(R.clad, H.under, H.coping[1]),
  decaBand(R.clad, 0.1, ...H.facadeBand),
  decaBand(R.clad, 0.1, ...H.coping),
]).subtract(union(around(faceWin, WINDOW_FACES.map((k) => 18 + 36 * k))));
const glass = decaPrism(R.glass, H.coping[1] - 0.05, H.glassTop + 0.05);
// Dakrand en tentdak: schuine onderkant (48 graden) van het glas naar de voet van het dakrandprofiel, dat naar buiten
// helt tot de dakrand op 36,84 m; daarop het tienzijdige tentdak tot de top.
const roof = hull([...deca(R.glass, H.glassTop), ...deca(R.fascia, H.fasciaFoot), ...deca(R.rim, H.rim), [0, 0, H.apex]]);
const top = union([soffit, brackets, cladding, glass, roof]);

const turm = union([tower, annex, top]);

await writeLandmark({
  slug: "watertoren-zwolle-turfmarkt",
  base: BASE,
  nodes: [["building:watertoren-schacht-consoles-opbouw-dak-en-aanbouw", turm]],
  catalog: {
    name: "Watertoren Turfmarkt Zwolle",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, -7.5], [-5.3, 5.3]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0193100000026499"],
    description:
      "Oorsprong op het hart van de ronde schacht (BGT-cirkel, straal 6,38 m) op maaiveld NAP +1,6, +X naar RD-richting 5,92 graden (een hoek van de tienhoekige opbouw), +Y naar het noorden. Ronde, onderaan uitlopende bakstenen schacht van 1892 op een natuurstenen plint met band, vensters en gekoppelde rondboogvensters; tien consoles onder een schuine onderkant; tienhoekige opbouw van 2018 (BAG-tienhoek, straal 8,54 m) van 20,8 tot 33,6 m met lichte banden en vensterkolommen; terugliggende glazen bovenste laag, overstekende dakrand tot 36,84 m en tienzijdig tentdak tot 40,7 m; lage aanbouw aan de noordkant. Maten uit BAG, BGT, AHN en één foto.",
    realWorld: {
      built: 1892,
      converted: "2017-2018 (21 appartementen)",
      architect: "Jan Schotel",
      publishedHeightM: 36,
      reservoirM3: 500,
      ahnGroundNapM: GROUND_NAP,
      ahnRimNapM: 38.44,
      ahnTopNapM: 42.3,
      ahnAnnexNapM: 7.1,
      plinthDiameterM: R.plinth * 2,
      shaftDiameterM: [R.shaft[0][0] * 2, +(shaftR(H.soffit) * 2).toFixed(2)],
      claddingCornerDiameterM: +(corner * 2).toFixed(2),
      rimCornerDiameterM: +((R.rim / COS18) * 2).toFixed(2),
      underSideM: H.under,
      claddingTopM: H.coping[1],
      rimM: H.rim,
      topM: H.apex,
      photoScalePxPerM: 46.4,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Zwolle) (1892, Jan Schotel, 36 m, 500 m³, mantel 1959, appartementen 2017-2018)",
      "https://commons.wikimedia.org/wiki/File:Voormalige_watertoren_Turfmarkt_Zwolle.jpg (2020, vanuit het zuid-zuidwesten: schacht, consoles, opbouw, dakrand; schaal 46,4 px/m)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_voorzijde_-_Zwolle_-_20329066_-_RCE.jpg en File:Zwolle_Watertoren_1907.jpg (oorspronkelijke toren: ronde schacht en plint)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Zwolle.JPG en File:20150819_Watertoren_Zwolle.jpg (de tienhoekige mantel van 1959)",
      "PDOK BAG-pand 0193100000026499 (tienhoek), BGT-pand (ronde schacht en aanbouw), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});
