// Watertoren van de voormalige spinnerij Gebr. Jannink & Zonen aan de Haaksbergerstraat in Enschede, de Janninktoren
// (Wikipedia: 1900, ontwerp H. Reijgers; de toren hield het bluswater voor de sprinklerinstallatie van de spinnerij;
// hoogte en inhoud onbekend). Het fabriekscomplex is rijksmonument 15299 (Haaksbergerstraat 147); de RCE noemt de toren
// "trappenhuis annex sprinklertoren". Een rechthoekige bakstenen toren in de voorgevel aan de straat, smal aan de straat
// (8,2 m) en diep (10,7 m), met hoekpenanten en lisenen, verdiepte vakken, natuurstenen banden en vensters onder
// boogjes; in de brede zijgevels per geleding een grote rondboog boven een paar vensters. Boven de kroonlijst staan op
// de hoeken kleine pinakels, in het midden van elke gevel een topgevel (smal: met een ronde kop en een uurwerk of
// rozetvenster, breed: met schouders, een segmentboog en een rozetvenster) en daarachter een steil leien mansardedak
// met een plat dak en een smeedijzeren hek.
//
// De toren is geen eigen BAG-pand: hij hoort bij pand 0153100000257537 (bouwjaar 1924 in de BAG, 4668 m², 127
// verblijfsobjecten), het hele fabrieksgebouw van circa 85 × 75 m. De kaart en de export kunnen alleen hele panden
// verbergen; daarom vervangt het model dat pand en neemt de GLB de rest ervan over als tweede node: de dakvlakken van de
// 3D BAG (LoD2.2, CC BY 4.0, janninkBag3d() onderaan) als prisma's onder hun eigen dakvlak, zonder de dakvlakken van de
// toren (net als bij generate-watertoren-almelo-1914.mjs en generate-watertoren-zaandam.mjs).
//
// Oorsprong op het hart van de toren op het maaiveld aan de straat (AHN-DTM op de stoep NAP +36,65; 3D BAG-maaiveld van
// het hele pand 36,31). +X langs de voorgevel naar het noordoosten (RD-richting 29,14 graden, de straatgevel van het
// BAG-pand), +Y naar de straat (noordwest). De voorgevel van de toren ligt in de rooilijn van het BAG-pand (y = 5,33).
// Maten: plattegrond uit het AHN-DSM 0,5 m (toren 8,2 bij 10,7 m, kroonlijst circa 0,3 m daarbuiten); hoogtes uit het
// AHN-DSM (plat dak NAP +65,4 = 28,75 m, 3D BAG 28,71 tot 28,75; kroonlijst en dakvoet 22,0 tot 23,0; topgevels 25,8
// tot 26,0); de geledingen uit de RCE-foto 20351267 ("Overzicht voorgevel met trappenhuis annex sprinklertoren", vanaf
// de straat in het zuidwesten; circa 45 px/m op 1280 px bij de westhoek, verankerd op de kroonlijst), met "Watertoren
// jannink 1900" (Commons: topgevels, schouders en rozetvensters van dichtbij).
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [257461.04, 470578.07];
const AXIS_DEG = 29.14;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 36.65;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de stoep voor de toren, gemeten 2026-11-06 op y = 6,5 en 8 (x = -4:
// 80,19 en 80,20; 0: 80,22 en 80,23; 4: 80,35 en 80,27); de groundSamplePoints liggen daartussen op y = 7. De rest van
// het pand staat in PDOK op 79,9 tot 80,8; in de 1:1000-export staat de voet van de toren 0,1 m in het terrein.
const GROUND_ELLIPSOID = 80.19;

// ---------- maten ----------
const HX = 4.1; // halve breedte langs de straat (buitenkant van de hoekpenanten)
const HY = 5.33; // halve diepte; de voorgevel (+Y) ligt in de rooilijn van het BAG-pand
const RECESS = 0.2; // vakken tussen penanten en lisenen
const PIER = 0.9; // hoekpenant langs elk vlak
const LISENE = 0.6;
// Hoogtes boven het maaiveld (NAP +36,65).
const H = {
  plinth: 0.5, // onderkant van de vakken aan de straat
  bands: [4.1, 8.2, 12.3, 16.3], // natuurstenen banden, 0,3 m hoog (de bovenste op de foto 16,3 tot 16,6)
  panelTop: 21.0, // bovenkant van de vakken (plafond 45 graden), daarboven de fries
  cornice: [21.8, 22.3], // kroonlijst (AHN-DSM rond de rand 22,0 tot 23,0)
  pinnacle: 23.25, // hoekpinakels met kap
  apex: 26.0, // topgevels (AHN-DSM 25,8 tot 26,0)
  finial: 27.0, // pinakel op de topgevel
  top: 28.75, // plat dak boven het mansardedak (AHN NAP +65,4, 3D BAG 28,71 tot 28,75)
};
// Daken van de fabriek tegen de toren (3D BAG en AHN-DSM): daaronder is de gevel van de toren niet te zien, dus geen
// vakken of vensters (anders blijven er holtes tussen toren en fabriek).
const HIDDEN = { ne: 15.4, sw: 10.1, back: 15.6, front: 0 };

// ---------- hulpvormen (gebouwd voor het vlak met normaal +X op afstand f, langs het vlak y) ----------
const rectRing = (hx, hy, z) => [[-hx, -hy, z], [hx, -hy, z], [hx, hy, z], [-hx, hy, z]];
// Lijst rondom de hele toren, out buiten de gevel, met een onderkant onder 45 graden vanaf d binnen de gevel.
const ledge = (d, out, z0, z1) =>
  hull([...rectRing(HX - d, HY - d, z0 - d - out), ...rectRing(HX + out, HY + out, z0), ...rectRing(HX + out, HY + out, z1)]);
// Verdiept vak tussen y0 en y1, van z0 tot z1, met een plafond onder 45 graden.
const panel = (f, y0, y1, z0, z1) => hull([
  [f - RECESS, y0, z0], [f - RECESS, y1, z0], [f + 1, y0, z0], [f + 1, y1, z0],
  [f - RECESS, y0, z1 - RECESS], [f - RECESS, y1, z1 - RECESS], [f + 1, y0, z1 + 1], [f + 1, y1, z1 + 1],
]);
// Rechthoekige nis met een plafond dat naar binnen onder 63 graden oploopt.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Rondboognis: halfrond van 7 punten op de aanzet, het boogplafond loopt naar binnen onder 63 graden op.
const archNiche = (f, w, z0, zSpring, depth = 0.3, y = 0) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([v, z]) => [a, v, z + 2 * depth]),
    ...arc.map(([v, z]) => [f, v, z]),
    ...arc.map(([v, z]) => [f + 1, v, Math.max(z0, z - 1.5)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]).translate([0, y, 0]);
};
// Rond venster (uurwerk of rozet) als nis; het plafond loopt naar binnen onder 63 graden op.
const oculus = (f, zc, r, depth = 0.25) => {
  const ring = (x, dz) => Array.from({ length: 16 }, (_, k) => {
    const t = (2 * Math.PI * k) / 16;
    return [x, r * Math.cos(t), zc + dz + r * Math.sin(t)];
  });
  return hull([...ring(f - depth, 2 * depth), ...ring(f, 0), ...ring(f + 0.5, -1.0)]);
};

// ---------- gevels ----------
// Brede zijgevels (noordoost en zuidwest, langs y): hoekpenant 0,9, zijvak 2,15, lisene 0,6, middenvak 3,36. Smalle
// gevels (straat en achter, langs x): hoekpenant 0,9, vak 2,9, middenlisene 0,6.
const BROAD_BAYS = [[-(HY - PIER), -(1.68 + LISENE)], [-1.68, 1.68], [1.68 + LISENE, HY - PIER]];
const NARROW_BAYS = [[-(HX - PIER), -LISENE / 2], [LISENE / 2, HX - PIER]];
const SIDE_Y = (1.68 + LISENE + HY - PIER) / 2; // 3,355: hart van een zijvak van een brede gevel
const BAY_X = (LISENE / 2 + HX - PIER) / 2; // 1,75: hart van een vak van een smalle gevel
// place draait om Z: 0 = noordoostgevel (+X), 90 = straatgevel (+Y), 180 = zuidwestgevel, 270 = achtergevel.
const FACES = [
  { name: "noordoost", deg: 0, f: HX, bays: BROAD_BAYS, broad: true, hidden: HIDDEN.ne },
  { name: "straat", deg: 90, f: HY, bays: NARROW_BAYS, broad: false, hidden: HIDDEN.front },
  { name: "zuidwest", deg: 180, f: HX, bays: BROAD_BAYS, broad: true, hidden: HIDDEN.sw },
  { name: "achter", deg: 270, f: HY, bays: NARROW_BAYS, broad: false, hidden: HIDDEN.back },
];
// Vensters per geleding (onderkant en aanzet van de boog van 0,9 m); in de bovenste twee geledingen van de brede gevels
// in het middenvak een verdiepte rondboog van 3,0 m (onderkant, aanzet) met twee vensters van 1,1 m (onder, boven).
// Het boogplafond blijft achter het vak onder de onderkant van de band erboven (anders hangt die band er vlak boven).
const ZONES = [
  { win: [5.3, 6.8] }, // tussen de banden op 4,4 en 8,2
  { win: [9.4, 10.9] }, // 8,5 tot 12,3
  { win: [13.4, 14.9], field: [12.9, 14.05], pair: [13.1, 14.0] }, // 12,6 tot 16,3
  { win: [17.0, 18.6], field: [16.7, 19.0], pair: [16.9, 18.5] }, // 16,6 tot 21,0 (foto: vensters 16,9 tot 18,3, boog tot 20,5)
];
const cuts = [];
for (const face of FACES) {
  const { f, bays, broad, hidden } = face;
  const local = [];
  const z0 = Math.max(H.plinth, hidden);
  for (const [y0, y1] of bays) local.push(panel(f, y0, y1, z0, H.panelTop));
  const p = f - RECESS; // vlak van de vakken
  for (const zone of ZONES) {
    if (zone.win[0] < hidden + 0.3) continue;
    if (broad) {
      for (const y of [-SIDE_Y, SIDE_Y]) local.push(archNiche(p, 0.9, zone.win[0], zone.win[1], 0.3, y));
      if (zone.field) {
        local.push(archNiche(p, 3.0, zone.field[0], zone.field[1], 0.2));
        for (const y of [-0.7, 0.7]) local.push(niche(p - 0.2, 1.1, zone.pair[0], zone.pair[1], 0.3, y));
      } else local.push(archNiche(p, 0.9, zone.win[0], zone.win[1], 0.3));
    } else {
      for (const y of [-BAY_X, BAY_X]) local.push(archNiche(p, 0.9, zone.win[0], zone.win[1], 0.3, y));
    }
  }
  // Twee deuren onder de vensters aan de straat.
  if (face.name === "straat") for (const y of [-BAY_X, BAY_X]) local.push(niche(p, 1.3, 0, 3.0, 0.4, y));
  cuts.push(place(union(local), { deg: face.deg }));
}

// ---------- romp, banden, kroonlijst ----------
const body = box(-HX, -HY, BASE, HX, HY, H.cornice[1]);
const bands = H.bands.map((z) => ledge(RECESS, 0.08, z, z + 0.3));
const cornice = ledge(0, 0.3, H.cornice[0], H.cornice[1]);
// De banden en de kroonlijst lopen over de vakken door; ze komen er na het uitsnijden weer op.
const shaft = union([body.subtract(union(cuts)), ...bands, cornice]);

// ---------- bekroning: pinakels, topgevels, mansardedak ----------
// Hoekpinakel van 0,9 m met een kap die 0,1 m uitsteekt (onderkant 45 graden).
const pinnacle = (sx, sy) => {
  const cx = sx * (HX - PIER / 2), cy = sy * (HY - PIER / 2), h = PIER / 2;
  const at = (pts) => pts.map(([x, y, z]) => [cx + x, cy + y, z]);
  return union([
    box(cx - h, cy - h, H.cornice[1] - 0.1, cx + h, cy + h, H.pinnacle - 0.25),
    hull([...at(rectRing(h, h, H.pinnacle - 0.35)), ...at(rectRing(h + 0.1, h + 0.1, H.pinnacle - 0.25)), ...at(rectRing(h + 0.1, h + 0.1, H.pinnacle))]),
  ]);
};
const pinnacles = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([sx, sy]) => pinnacle(sx, sy));
// Boog van (±half, zEnd) naar de top op H.apex.
const arcPts = (half, zEnd, n = 10) => {
  const R = (half * half + (H.apex - zEnd) ** 2) / (2 * (H.apex - zEnd));
  const zc = H.apex - R, t0 = Math.atan2(zEnd - zc, half);
  return Array.from({ length: n + 1 }, (_, k) => {
    const t = t0 + ((Math.PI - 2 * t0) * k) / n;
    return [R * Math.cos(t), zc + R * Math.sin(t)];
  });
};
// Topgevel, 2,6 m diep het dak in: smal met een ronde kop (halve breedte 1,7, halfrond op 24,3), breed met schouders
// (halve breedte 2,8 tot 23,6, onder 45 graden naar 2,3 op 24,1) en een segmentboog tot 26,0; een rond venster (uurwerk
// of rozet) als nis en een pinakel van 0,9 m op de top.
const gableOutline = (broad) => broad
  ? [[-2.8, H.cornice[0]], [2.8, H.cornice[0]], [2.8, 23.6], ...arcPts(2.3, 24.1), [-2.8, 23.6]]
  : [[-1.7, H.cornice[0]], [1.7, H.cornice[0]], ...arcPts(1.7, 24.3)];
const gable = (f, broad) => {
  const outline = hull(gableOutline(broad).flatMap(([y, z]) => [[f - 2.6, y, z], [f, y, z]]));
  const finial = union([
    box(f - 0.75, -0.45, H.apex - 0.3, f - 0.15, 0.45, H.finial - 0.4),
    hull([[f - 0.75, -0.45, H.finial - 0.41], [f - 0.15, -0.45, H.finial - 0.41], [f - 0.75, 0.45, H.finial - 0.41], [f - 0.15, 0.45, H.finial - 0.41], [f - 0.45, 0, H.finial]]),
  ]);
  const eye = broad ? oculus(f, 24.1, 0.85) : oculus(f, 24.3, 0.75);
  return union([outline, finial]).subtract(eye);
};
const gables = FACES.map(({ deg, f, broad }) => place(gable(f, broad), { deg }));
// Leien mansardedak van de dakvoet (0,2 m binnen de gevel) naar het platte dak (2,5 m in, circa 69 graden).
const MANSARD_TOP = [1.4, 2.63];
const mansard = hull([...rectRing(HX - 0.2, HY - 0.2, H.cornice[1] - 0.05), ...rectRing(...MANSARD_TOP, H.top)]);
const tower = union([shaft, ...pinnacles, ...gables, mansard]);

// ---------- rest van het fabrieksgebouw (3D BAG) ----------
// Elk dakvlak als prisma vanaf de onderkant, afgesneden door het vlak z = a x + b y + c (kleinste kwadraten door de
// hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen; binnenringen blijven open. De dakvlakken van
// de toren (toren = 1) beslaan ook stroken naast de toren; die krijgen de dakhoogte van de vleugel ernaast (zuidwest
// 10,1 m, achter 15,6 m, noordoost 15,4 m). De toren is eruit gesneden; toren en fabriek raken elkaar alleen.
const xyz = (flat) => Array.from({ length: flat.length / 3 }, (_, i) => flat.slice(i * 3, i * 3 + 3));
const fitPlane = (pts) => {
  const n = pts.length;
  const [mx, my, mz] = [0, 1, 2].map((k) => pts.reduce((s, p) => s + p[k], 0) / n);
  let sxx = 0, sxy = 0, syy = 0, sxz = 0, syz = 0;
  for (const [x, y, z] of pts) {
    const [u, v, w] = [x - mx, y - my, z - mz];
    sxx += u * u; sxy += u * v; syy += v * v; sxz += u * w; syz += v * w;
  }
  const det = sxx * syy - sxy * sxy;
  const a = Math.abs(det) < 1e-9 ? 0 : (sxz * syy - syz * sxy) / det;
  const b = Math.abs(det) < 1e-9 ? 0 : (syz * sxx - sxz * sxy) / det;
  return [a, b, mz - a * mx - b * my];
};
const section = (rings) => new CrossSection(
  [ccw(xyz(rings[0]).map(([x, y]) => [x, y])), ...rings.slice(1).map((r) => ccw(xyz(r).map(([x, y]) => [x, y])).reverse())],
  "EvenOdd",
).offset(0.02, "Miter");
const roofPrism = (rings) => {
  const pts = xyz(rings[0]);
  const [a, b, c] = fitPlane(pts);
  const top = Math.max(...pts.map(([x, y]) => a * x + b * y + c)) + 1;
  const len = Math.hypot(a, b, 1);
  return Manifold.extrude(section(rings), top - BASE).translate([0, 0, BASE]).trimByPlane([a / len, b / len, -1 / len], -c / len);
};
const ROOF = { sw: 10.1, back: 15.6, ne: 15.4 };
const filler = (rings) => {
  const flat = (z) => Manifold.extrude(section(rings), z - BASE).translate([0, 0, BASE]);
  return union([
    flat(ROOF.sw).intersect(box(-20, -20, BASE - 1, -HX, 20, 40)),
    flat(ROOF.back).intersect(box(-HX, -20, BASE - 1, HX, -HY, 40)),
    flat(ROOF.ne).intersect(box(HX, -20, BASE - 1, 20, 20, 40)),
  ]);
};
// De banden steken 0,08 m uit de gevel; waar een vleugel tegen de toren staat, vallen ze weg (anders een inkeping in
// de vleugel).
const towerBox = box(-HX, -HY, BASE - 1, HX, HY, 40);
const factory = union(janninkBag3d().map(([isTower, rings]) => (isTower ? filler(rings) : roofPrism(rings)))).subtract(towerBox);
const towerFinal = tower.subtract(factory);

await writeLandmark({
  slug: "watertoren-enschede-janninktoren",
  base: BASE,
  nodes: [
    ["building:watertoren-gevels-topgevels-en-mansardedak", towerFinal],
    ["building:spinnerij-jannink", factory],
  ],
  catalog: {
    name: "Janninktoren Enschede",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-3, 7], [0, 7], [3, 7]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de stoep voor de toren.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0153100000257537"],
    description:
      "Oorsprong op het hart van de watertoren op het maaiveld aan de straat (NAP +36,65 m), +X langs de voorgevel van de spinnerij (RD-richting 29,14 graden), +Y naar de Haaksbergerstraat (noordwest). Bakstenen toren van 8,2 bij 10,7 m met hoekpenanten, lisenen, verdiepte vakken, vier natuurstenen banden, vensters onder boogjes, twee deuren aan de straat en in de brede zijgevels grote rondbogen boven paren vensters; kroonlijst tot 22,3 m, hoekpinakels, vier topgevels met een rond venster of uurwerk tot 26,0 m (pinakel 27,0) en een steil mansardedak met een plat dak op 28,75 m. De toren hoort bij BAG-pand 0153100000257537 (het hele fabrieksgebouw); dat pand wordt vervangen en building:spinnerij-jannink is de 3D BAG-reconstructie (CC BY 4.0) van de rest ervan, zonder de toren.",
    realWorld: {
      built: 1900,
      architect: "H. Reijgers",
      purpose: "bluswater voor de sprinklerinstallatie van de spinnerij Gebr. Jannink & Zonen; ook trappenhuis",
      monument: 15299,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 65.4,
      bag3dTopNapM: 65.4,
      towerPlanM: [HX * 2, HY * 2],
      bandsM: H.bands,
      corniceM: H.cornice,
      gableApexM: H.apex,
      topM: H.top,
      photoScalePxPerM: 45,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Enschede_Janninktoren) (1900, H. Reijgers, sprinklerinstallatie van de spinnerij Jannink, rijksmonument)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/15299 (fabriekscomplex Jannink, Haaksbergerstraat 147)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_met_trappenhuis_annex_sprinklertoren_-_Enschede_-_20351267_-_RCE.jpg (vanaf de straat in het zuidwesten: geledingen, banden, vensters, rondbogen, deuren, schaal circa 45 px/m)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_met_trappenhuis_annex_sprinklertoren_-_Enschede_-_20351730_-_RCE.jpg (toren in de voorgevel)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_jannink_1900.jpg (topgevels, schouders, rozetvensters, pinakels, mansardedak met hek)",
      "https://commons.wikimedia.org/wiki/File:RM15299_-_Enschede_-_Haaksbergerstraat_147_(1).jpg en File:Aerial_-_Fabriekscomplex_Jannink_(6929512021).jpg (uurwerk, toren in het complex)",
      "PDOK BAG-pand 0153100000257537, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0153100000257537, LoD2.2-dakvlakken, opgehaald 2026-11-06",
    ],
  },
});

// ---------- data: dakvlakken van het fabrieksgebouw ----------
// Dakvlakken (RoofSurface, LoD2.2) van 3D BAG-pand NL.IMBAG.Pand.0153100000257537 in het modelstelsel: x langs
// RD-richting 29,14 graden, y haaks daarop (linksom), beide in meters vanaf ORIGIN, z in meters boven NAP +36,65,
// afgerond op 1 cm. Per vlak [toren, ringen]: de buitenring en eventuele binnenringen, elk als vlakke lijst x, y, z;
// toren = 1 voor de acht dakvlakken van de watertoren (alleen hun omtrek wordt gebruikt, als vulling naast de toren).
// Bron: https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0153100000257537, opgehaald 2026-11-06.
// Licentie: CC BY 4.0, 3D BAG door de 3D geoinformation-groep van de TU Delft en 3DGI.
function janninkBag3d() {
  return [
    [0, [[-2.21, -69.14, 11.05, -24.81, -69.35, 11.18, -24.81, -69.51, 11.21, -24.81, -69.95, 11.3, -2.2, -69.9, 11.2]]],
    [0, [[-0.29, -19.78, 12.67, 2.47, -19.64, 12.56, 2.4, -18.18, 12.54, -1.8, -18.3, 12.7, -2.35, -19.88, 12.75]]],
    [0, [[-15.85, -54.15, 10.99, -14.07, -54.44, 10.53, -13.74, -49.71, 10.44, -15.4, -48.6, 10.87]]],
    [0, [[-3.15, -25.62, 11.03, -3.2, -23.28, 11.01, -4.38, -24.22, 10.98]]],
    [0, [[-0.44, -32.94, 17.03, -1.49, -32.1, 17.03, -3.01, -32.14, 17.03, -2.91, -36.95, 17.05, -0.35, -36.69, 17.04]]],
    [1, [[0.76, 2.12, 28.71, -1.14, 2.31, 28.72, -1.05, -2.27, 28.75, 0.55, -2.13, 28.74, 0.78, -2.11, 28.74]]],
    [0, [[-13.96, -38.4, 10.42, -15.49, -38.31, 10.88, -15.63, -44.35, 10.91, -14.23, -44.44, 10.49]]],
    [0, [[-25.78, 4.33, 12.25, -24.71, 4.2, 12.19, -24.7, 5.34, 12.26, -25.78, 5.34, 12.31]]],
    [0, [[1.2, -36.53, 4.99, 1.87, -24.94, 5.13, 0.54, -24.98, 5.14, -0.02, -22.83, 5.17, -2.62, -22.81, 5.2, -3.2, -23.28, 5.2, -3.15, -25.62, 5.17, -3.01, -32.14, 5.08, -1.49, -32.1, 5.07, -0.44, -32.94, 5.05, -0.35, -36.69, 5]]],
    [0, [[7.26, -48.9, 11.05, 7.29, -41.65, 10.8, 6.83, -41.36, 12.12, 5.87, -49.04, 15.07]]],
    [1, [[0.8, -4.86, 24.66, 0.79, -2.56, 25.03, -0.55, -5.33, 25.42]]],
    [1, [[0.79, -2.38, 26.23, 0.55, -2.13, 26.07, -1.05, -2.27, 25.04, -3.92, -2.51, 23.2, -4.31, -0.69, 22.86, -5.65, -0.77, 22, -4.98, -4.84, 22.63, -3.2, -5.85, 23.83, -0.8, -5.84, 25.38, -0.55, -5.33, 25.51, 0.79, -2.56, 26.24]]],
    [1, [[2.82, -4.54, 18.35, 2.55, -4.26, 18.99, 0.8, -4.86, 17.71, -0.55, -5.33, 16.72, -0.8, -5.84, 15.59, 2.87, -5.8, 15.58]]],
    [0, [[-15.91, -32.73, 11.01, -14.84, -33.81, 10.73, -13.29, -31.3, 10.32, -13.99, -30.8, 10.51, -13.83, -29.49, 10.46, -15.4, -28.78, 10.87]]],
    [0, [[-24.45, 3.35, 10.17, -23.99, 1.1, 10.16, -24.71, -1.37, 10.16, -24.81, -69.35, 10.14, -2.21, -69.14, 10.1, -2.91, -36.95, 10.11, -3.01, -32.14, 10.11, -3.15, -25.62, 10.11, -4.38, -24.22, 10.12, -3.2, -23.28, 10.12, -3.22, -22.35, 10.12, -3.05, -21.88, 10.12, -1.07, -21.92, 10.11, -0.29, -19.78, 10.11, -2.35, -19.88, 10.12, -1.8, -18.3, 10.11, 2.4, -18.18, 10.11, 1.95, -9.26, 10.11, 0.91, -9.35, 10.11, -0.08, -10.23, 10.11, -0.96, -9.51, 10.12, -4.16, -9.78, 10.12, -4.8, -5.89, 10.13, -3.2, -5.85, 10.12, -4.98, -4.84, 10.13, -5.65, -0.77, 10.13, -10.53, -1.04, 10.14, -10.67, 3.13, 10.14], [-15.49, -38.31, 10.13, -13.96, -38.4, 10.13, -14.23, -44.44, 10.13, -15.63, -44.35, 10.13], [-15.85, -54.15, 10.13, -15.4, -48.6, 10.13, -13.74, -49.71, 10.13, -14.07, -54.44, 10.13], [-15.91, -32.73, 10.14, -15.4, -28.78, 10.14, -13.83, -29.49, 10.13, -13.99, -30.8, 10.13, -13.29, -31.3, 10.13, -14.84, -33.81, 10.13]]],
    [0, [[3.71, -24.89, 15.57, 1.87, -24.94, 15.57, 1.2, -36.53, 15.48, -0.35, -36.69, 15.48, -2.91, -36.95, 15.48, -2.21, -69.14, 15.24, -2.2, -69.9, 15.24, 7.18, -69.88, 15.24, 7.26, -48.9, 15.39, 5.87, -49.04, 15.39, 6.83, -41.36, 15.45, 7.29, -41.65, 15.44, 7.31, -36.64, 15.48, 31.77, -36.67, 15.48, 31.77, -37.6, 15.47, 37.59, -37.62, 15.47, 37.6, -36.68, 15.48, 59.36, -36.71, 15.48, 59.33, -23.35, 15.58]]],
    [0, [[1.87, -24.94, 11.95, 3.71, -24.89, 12.4, 3.81, -19.58, 12.4, 2.47, -19.64, 12.08, -0.29, -19.78, 11.4, -1.07, -21.92, 11.22, -3.05, -21.88, 10.73, -3.22, -22.35, 10.69, -3.2, -23.28, 10.7, -2.62, -22.81, 10.84, -0.02, -22.83, 11.48, 0.54, -24.98, 11.62]]],
    [1, [[0.76, 2.12, 25.99, 0.74, 5.34, 25.82, -2.78, 5.34, 23.55, -1.2, 4.93, 24.59, -1.14, 2.31, 24.75]]],
    [0, [[44.47, -18.21, 16.45, 44.77, -13.8, 16.49, 44.37, -13.67, 16.49, 41.79, -13.45, 16.49, 10.58, -13.04, 16.46, 10.74, -18.31, 16.41, 43.47, -18.11, 16.45, 43.64, -18.71, 16.45]]],
    [1, [[4.09, -3.73, 22.84, 4.15, 0.15, 25.4, 1.96, -0.16, 25.28, 2.53, -2.52, 23.7, 3.09, -2.92, 23.41, 3.09, -4.07, 22.65]]],
    [0, [[4.05, -5.79, 15.62, 2.87, -5.8, 15.62, -0.8, -5.84, 15.62, -3.2, -5.85, 15.62, -4.8, -5.89, 15.62, -4.16, -9.78, 15.69, -0.96, -9.51, 15.69, -0.08, -10.23, 15.71, 0.91, -9.35, 15.69, 1.95, -9.26, 15.69, 2.4, -18.18, 15.86, 2.47, -19.64, 15.89, 3.81, -19.58, 15.89, 3.71, -24.89, 15.99, 59.33, -23.35, 15.99, 59.26, 2.6, 15.48, 58.47, 4.91, 15.44, 4.24, 4.93, 15.41, 4.15, 0.15, 15.5, 4.09, -3.73, 15.58], [10.58, -13.04, 15.77, 41.79, -13.45, 15.79, 44.37, -13.67, 15.79, 44.77, -13.8, 15.79, 44.47, -18.21, 15.88, 43.64, -18.71, 15.89, 43.47, -18.11, 15.88, 10.74, -18.31, 15.87]]],
    [0, [[-10.67, 3.13, 10.5, -10.74, 5.34, 11.16, -24.7, 5.34, 11.32, -24.71, 4.2, 10.98, -24.62, 4.19, 10.97, -24.45, 3.35, 10.72]]],
    [1, [[-6.33, 3.29, 22.16, -5.65, -0.77, 24.6, -4.31, -0.69, 24.74, -3.92, -2.51, 25.84, -1.05, -2.27, 26.09, -1.14, 2.31, 23.43, -1.2, 4.93, 21.91, -2.78, 5.34, 21.46, -6.13, 5.34, 21.01]]],
    [0, [[-6.13, 5.34, 12.56, -10.74, 5.34, 12.58, -10.67, 3.13, 12.6, -10.53, -1.04, 12.64, -5.65, -0.77, 12.62, -6.33, 3.29, 12.58]]],
    [1, [[2.87, -5.8, 22.8, 4.05, -5.79, 19.37, 4.09, -3.73, 19.22, 3.09, -4.07, 22.1, 3.09, -2.92, 22.09, 2.53, -2.52, 23.7, 1.96, -0.16, 25.28, 4.15, 0.15, 18.94, 4.24, 4.93, 18.59, 4.24, 5.34, 18.56, 0.74, 5.34, 28.69, 0.76, 2.12, 28.71, 0.78, -2.11, 28.74, 0.55, -2.13, 29.42, 0.79, -2.38, 28.74, 0.79, -2.56, 28.74, 0.8, -4.86, 28.76, 2.55, -4.26, 23.68, 2.82, -4.54, 22.9]]],
    [0, [[59.26, 5.34, 16.33, 4.24, 5.34, 16.3, 4.24, 4.93, 16.3, 58.47, 4.91, 16.33, 59.26, 2.6, 16.32]]],
    [0, [[-25.66, -17.86, 11.09, -25.43, -69.95, 11.25, -24.81, -69.95, 11.22, -24.81, -69.51, 11.21, -24.81, -69.35, 11.21, -24.71, -1.37, 10.99, -23.99, 1.1, 10.95, -24.45, 3.35, 10.97, -24.62, 4.19, 10.97, -24.71, 4.2, 10.98, -25.78, 4.33, 11.03, -25.68, -13.86, 11.08, -26.68, -13.87, 11.13, -26.65, -17.87, 11.14]]],
  ];
}
