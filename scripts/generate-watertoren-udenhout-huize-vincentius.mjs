// Watertoren van Huize Vincentius in Udenhout (Schoorstraat 2a), gebouwd in 1925
// naar ontwerp van J.J.M. van Halteren als midden van het hoofdgebouw van het
// internaat Huize Vincentius (nu zorginstelling); het complex is rijksmonument.
// De toren is geen losse toren maar rijst op uit het midden van de voorgevel:
// een vierkante schacht van baksteen met hoekpilasters, hoekpijlers die halverwege
// op consoles eindigen, verticale ribben, op elk vlak een uurwerk, een kroonlijst
// en een groene koperen koepel op een tamboer. Het reservoir zit onzichtbaar in
// de schacht (inhoud onbekend). Omdat de toren in BAG-pand 0855100000071049 ligt,
// vervangt het model het hele pand: het middendeel met het steile voorschild, de
// platte achterkap en twee vierkante hoektorens, de twee ronde traptorens naast
// de ingang en twee aan de hoeken, het bordes met de luifel, de twee zijvleugels
// met een schilddak en dakkapellen, de lage aanbouwen erachter en de lage
// gangen rond de binnenhof met het portaal naar de kapel (eigen pand, blijft van
// PDOK).
//
// Oorsprong op het hart van de torenschacht uit het AHN-DSM, op maaiveld
// (AHN-DTM NAP +9,6 tot +9,7 rondom; gebruikt +9,65). De voorgevel loopt langs
// de BAG-contour onder -20,8 graden (RD): lokale +X loopt langs de voorgevel
// naar het oosten-zuidoosten, -Y is de voorzijde (zuid-zuidwest). Het gebouw is
// opgezet in een gebouwstelsel (u langs de gevel vanaf de as van de ingang, v
// vanaf de BAG-lijn van het bordes naar achteren) en aan het eind met -V0
// verschoven. Hoogtes boven maaiveld uit het AHN-DSM 0,5 m; breedtes uit de
// BAG-contour en het DSM; schachtindeling, consoles, uurwerken, ribben en
// vensters uit de RCE-foto's 20342745 en 20342746 en de foto's van 2010 en
// Omroep Tilburg, geschaald op de AHN-hoogtes.
import { hull, ring3, circle, union, prism, box, rect, writeLandmark, Manifold } from "./efteling-kit.mjs";

const AXIS_DEG = -20.8;
const O_ENTRANCE = [137763.09, 402702.78]; // as van de ingang op de BAG-lijn van het bordes
const V0 = 12.65; // hart van de schacht achter die lijn
const RAD = (AXIS_DEG * Math.PI) / 180;
const ORIGIN = [+(O_ENTRANCE[0] - Math.sin(RAD) * V0).toFixed(2), +(O_ENTRANCE[1] + Math.cos(RAD) * V0).toFixed(2)];
const AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 9.65; // AHN-DTM 9,5 tot 9,8 rond het gebouw
const GEOID_N = 43.71; // NLGEO2018-geoïdehoogte op de oorsprong

// Dakvlak z = a u + b v + c: alles van `solid` onder het vlak.
const below = (solid, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};

// ---------- maten (meter boven maaiveld) ----------
const FRONT = 6.93; // voorgevel (BAG 6,89 tot 7,08)
const WING = { back: 15.0, eave: 12.6, ridgeV: 10.98, ridge: 15.2, annexBack: 17.37, annex: 4.9 };
const WING_SLOPE = (WING.ridge - WING.eave) / (WING.ridgeV - FRONT); // 33 graden
const MID = { half: 27.53, back: 22.4, eave: 13.05, ridgeV: 13.1, ridge: 19.2, flat: 16.62 };
const ROUND = { r: 1.86, inR: 1.57, top: 13.95 };

// ---------- zijvleugels met schilddak ----------
// Linkervleugel tot de schuine hoek aan de kopse kant, rechtervleugel met de
// inspringende kop (BAG: vanaf u 58,2 pas op v 9,9).
const LEFT_END = -64.3;
const RIGHT_END = 62.0;
const wingRoof = (solid) => {
  let s = below(solid, 0, WING_SLOPE, WING.eave - WING_SLOPE * FRONT);
  s = below(s, 0, -WING_SLOPE, WING.eave + WING_SLOPE * WING.back);
  s = below(s, 1, 0, WING.eave - LEFT_END); // schild 45 graden aan de linkerkop
  return below(s, -1, 0, WING.eave + RIGHT_END); // en aan de rechterkop
};
const leftWing = wingRoof(prism(rect(LEFT_END, FRONT, -MID.half + 0.1, WING.back), BASE, 30));
const rightWing = wingRoof(
  prism([[MID.half - 0.1, FRONT], [58.23, FRONT], [58.23, 9.93], [RIGHT_END, 9.93], [RIGHT_END, WING.back], [MID.half - 0.1, WING.back]], BASE, 30),
);
// Lage aanbouwen (één laag, plat) achter en aan de koppen van de vleugels.
const annexes = [
  box(-66.72, WING.back - 0.1, BASE, -30.85, WING.annexBack, WING.annex),
  box(-66.72, FRONT, BASE, LEFT_END + 0.1, WING.back, WING.annex),
  box(28.04, WING.back - 0.1, BASE, 64.49, WING.annexBack, WING.annex),
  box(RIGHT_END - 0.1, 9.93, BASE, 64.49, WING.back, WING.annex),
  box(-64.26, 5.62, BASE, -58.73, FRONT + 0.1, 2.0), // stoep met trap bij de linker zijingang
];
// Dakkapellen op het voorschild: 3,0 m breed, voorkant op v 7,6, plat dak op 14,4.
const wingDormer = (u) => box(u - 1.5, 7.6, 12.0, u + 1.5, 10.2, 14.4);
const wingDormers = [-56.35, -46.45, -36.55, 34.8, 44.7, 54.6].map(wingDormer);

// ---------- middendeel ----------
// Voorschild onder 45 graden van de goot (13,05) tot de nok (19,2), achter de
// nok 45 graden terug tot het platte dak op 16,62 dat tot de achtergevel loopt.
// Tussen de binnenste traptorens een plat gedekte middentravee tot 13,05.
const midFoot = [[-MID.half, FRONT], [-2.8, FRONT], [-2.8, 9.0], [2.8, 9.0], [2.8, FRONT], [MID.half, FRONT], [MID.half, MID.back], [-MID.half, MID.back]];
const midRoof = below(below(prism(midFoot, BASE, 30), 0, 1, MID.eave - FRONT), 0, -1, MID.ridge + MID.ridgeV);
const midFlat = box(-MID.half, MID.ridgeV + MID.ridge - MID.flat, BASE, MID.half, MID.back, MID.flat);
const midBay = box(-2.85, FRONT, BASE, 2.85, 9.1, MID.eave);
// Dakkapellen op het voorschild: 3,6 m breed, voorkant op v 8,0, plat dak op 16,0.
const midDormer = (u) => box(u - 1.8, 8.0, 13.0, u + 1.8, 11.2, 16.0);
const midDormers = [-17, -9, 9, 17].map(midDormer);
// Vierkante hoektorens aan de uiteinden van het middendeel (DSM 20 tot 21 m),
// met een borstwering rond een verdiept plat dak.
const cornerTower = (u0, v0, u1, v1, top) => box(u0, v0, BASE, u1, v1, top).subtract(box(u0 + 0.9, v0 + 0.9, top - 0.6, u1 - 0.9, v1 - 0.9, top + 1));
const cornerTowers = [cornerTower(-30.9, 8.4, -26.0, 20.6, 20.35), cornerTower(24.0, 8.4, 28.1, 17.2, 19.95)];
// Ronde traptorens: twee naast de ingang (r 1,57) en twee op de hoeken van het
// middendeel (r 1,86), half voor de gevel, plat tot 13,95.
const roundTowers = [
  prism(circle([-25.67, FRONT], ROUND.r, 40), BASE, ROUND.top),
  prism(circle([25.67, FRONT], ROUND.r, 40), BASE, ROUND.top),
  prism(circle([-4.35, FRONT], ROUND.inR, 40), BASE, ROUND.top),
  prism(circle([4.35, FRONT], ROUND.inR, 40), BASE, ROUND.top),
];
// Bordes met twee treden voor de ingang en de luifel erboven (onderkant onder 45 graden).
const porch = union([
  box(-2.79, 1.5, BASE, 2.79, FRONT + 0.1, 2.0),
  box(-2.79, 0.75, BASE, 2.79, 1.6, 1.3),
  box(-2.79, 0.0, BASE, 2.79, 0.85, 0.65),
]);
const canopy = hull([
  [-2.6, FRONT + 0.05, 2.1], [2.6, FRONT + 0.05, 2.1], [-2.6, FRONT + 0.05, 4.45], [2.6, FRONT + 0.05, 4.45],
  [-2.6, 5.0, 4.15], [2.6, 5.0, 4.15], [-2.6, 5.0, 4.45], [2.6, 5.0, 4.45],
]);

// ---------- gangen rond de binnenhof en portaal naar de kapel ----------
const courtyard = [
  box(-27.58, 20.9, BASE, -24.6, 51.0, 4.85),
  box(-27.58, 50.9, BASE, -24.6, 65.2, 4.0),
  box(24.45, 20.9, BASE, 27.3, 51.0, 4.85),
  box(24.45, 50.9, BASE, 27.3, 65.2, 4.0),
  prism([[-27.58, 58.4], [-19.5, 58.4], [-19.5, 61.65], [19.3, 61.65], [19.3, 58.35], [27.3, 58.35], [27.3, 65.2], [-27.58, 65.2]], BASE, 4.0),
];
// Portaal naar de kapel: zadeldak langs v, goot 4,9, nok 11,9 (DSM).
const PORT = { u0: -5.83, u1: 5.17, eave: 4.9, ridge: 11.9 };
const portalMid = (PORT.u0 + PORT.u1) / 2, portalHalf = (PORT.u1 - PORT.u0) / 2;
const portalSlope = (PORT.ridge - PORT.eave) / portalHalf;
const portal = below(
  below(prism(rect(PORT.u0, 59.37, PORT.u1, 65.2), BASE, 30), portalSlope, 0, PORT.eave - portalSlope * PORT.u0),
  -portalSlope, 0, PORT.eave + portalSlope * PORT.u1,
);

// ---------- toren ----------
const T = { v: V0, base: 20.0, pierTop: 23.2, capTop: 23.8, shaftTop: 33.7, cornTop: 34.3, postTop: 34.9, drumTop: 35.25, R: 2.2 };
const sq = (h, z0, z1) => box(-h, T.v - h, z0, h, T.v + h, z1);
const sqRing = (h, z) => ring3(rect(-h, T.v - h, h, T.v + h), z);
// Onderbouw boven het dak: 7 m breed van v 9,0 tot 19,0 tot 20,0, achter het
// midden verlaagd tot 17,5 (DSM).
const towerBase = box(-3.5, 9.0, BASE, 3.5, 19.0, T.base).subtract(box(-1.5, 16.2, 17.5, 1.5, 19.5, 21));
// Schacht 5,3 m in het vierkant met hoekpilasters van 0,9 m tot 2,85 uit het hart.
const shaftCore = sq(2.65, T.base - 0.1, T.shaftTop + 0.05);
const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
const pilasters = corners.map(([a, b]) => {
  const x0 = a < 0 ? -2.85 : 1.95, y0 = T.v + (b < 0 ? -2.85 : 1.95);
  return box(x0, y0, T.base - 0.1, x0 + 0.9, y0 + 0.9, T.shaftTop + 0.05);
});
// Hoekpijlers van 1,3 m tot 3,25 uit het hart, tot 23,2 met een console die
// onder 45 graden 0,2 m uitkraagt (tot 23,8).
const piers = corners.map(([a, b]) => {
  const xs = a < 0 ? [-3.25, -1.95] : [1.95, 3.25], ys = (b < 0 ? [-3.25, -1.95] : [1.95, 3.25]).map((y) => T.v + y);
  const out = (x, d) => (Math.abs(x) > 3 ? x + Math.sign(x) * d : x);
  const capX = xs.map((x) => out(x, 0.2)), capY = ys.map((y) => T.v + out(y - T.v, 0.2));
  return union([
    box(xs[0], ys[0], T.base - 0.1, xs[1], ys[1], T.pierTop + 0.05),
    hull([...ring3(rect(xs[0], ys[0], xs[1], ys[1]), T.pierTop), ...ring3(rect(capX[0], capY[0], capX[1], capY[1]), T.pierTop + 0.2), ...ring3(rect(capX[0], capY[0], capX[1], capY[1]), T.capTop)]),
  ]);
});
// Kroonlijst onder 45 graden van de schacht (2,65) tot 3,05 uit het hart, met hoekposten tot 34,9.
const cornice = hull([...sqRing(2.65, T.shaftTop - 0.2), ...sqRing(3.05, T.shaftTop + 0.2), ...sqRing(3.05, T.cornTop)]);
const posts = corners.map(([a, b]) => {
  const x0 = a < 0 ? -3.05 : 2.15, y0 = T.v + (b < 0 ? -3.05 : 2.15);
  return box(x0, y0, T.cornTop - 0.05, x0 + 0.9, y0 + 0.9, T.postTop);
});
// Tamboer en halfbolvormige koperen koepel (AHN-top 37,43).
const drum = prism(circle([0, T.v], T.R, 48), T.cornTop - 0.05, T.drumTop);
const dome = Manifold.sphere(T.R, 48).trimByPlane([0, 0, 1], 0).translate([0, T.v, T.drumTop]);
// Uurwerk op elk vlak: plaat van 1,7 m, 0,15 m voor de schacht, onderrand onder 45 graden.
const clock = (deg) =>
  hull([
    [-0.85, -2.6, 31.2], [0.85, -2.6, 31.2], [-0.85, -2.8, 31.4], [0.85, -2.8, 31.4],
    [-0.85, -2.6, 33.05], [0.85, -2.6, 33.05], [-0.85, -2.8, 33.05], [0.85, -2.8, 33.05],
  ]).rotate([0, 0, deg]).translate([0, T.v, 0]);
const clocks = [0, 90, 180, 270].map(clock);

// ---------- nissen ----------
// Nis in een vlak met normaal -Y op v = f (naar voren), breedte w rond u = c, van z0
// tot z1; het plafond loopt naar binnen onder 56 graden op.
const niche = (c, f, w, z0, z1, depth = 0.3) => {
  const a = f + depth, b = f - 1.0, za = z1 + 1.5 * depth, u0 = c - w / 2, u1 = c + w / 2;
  return hull([[u0, a, z0], [u0, b, z0], [u1, a, z0], [u1, b, z0], [u0, a, za], [u0, f, z1], [u1, a, za], [u1, f, z1], [u0, b, z1 - 1.5], [u1, b, z1 - 1.5]]);
};
// Verticale ribben: twee groeven van 0,6 m per schachtvlak (ribben van 0,9 m).
const grooves = [0, 90, 180, 270].flatMap((deg) =>
  [-0.75, 0.75].map((c) => niche(c, -2.65, 0.6, 24.2, 30.8).rotate([0, 0, deg]).translate([0, T.v, 0])),
);
// Spleet in de voorkant van de onderbouw (foto).
const baseSlit = niche(0, 9.0, 0.9, 14.0, 19.0, 0.3);
// Vensters in de voorgevel: travees van 3,3 m, vier rijen.
const ROWS = [[0.9, 2.5], [4.0, 5.9], [7.2, 9.1], [10.3, 11.9]];
const bays = [
  ...Array.from({ length: 10 }, (_, k) => -61.3 + 3.3 * k),
  ...Array.from({ length: 8 }, (_, k) => 31.5 + 3.3 * k),
  ...[7.6, 11.0, 14.4, 17.8, 21.2].flatMap((u) => [u, -u]),
];
const windows = bays.flatMap((u) => ROWS.map(([z0, z1]) => niche(u, FRONT, 1.6, z0, z1)));
const midWindows = [[5.0, 6.6], [7.4, 9.1], [10.3, 11.9]].map(([z0, z1]) => niche(0, FRONT, 1.0, z0, z1));
// Achtergevels (normaal +Y): de zijvleugels boven de aanbouwen, het middendeel aan de binnenhof.
const backNiche = (u, f, w, z0, z1) => niche(u, -f, w, z0, z1).mirror([0, 1, 0]);
const backWindows = [
  ...bays.slice(0, 18).flatMap((u) => ROWS.slice(2).map(([z0, z1]) => backNiche(u, WING.back, 1.6, z0, z1))),
  ...Array.from({ length: 14 }, (_, k) => -21.45 + 3.3 * k).flatMap((u) => ROWS.map(([z0, z1]) => backNiche(u, MID.back, 1.6, z0, z1))),
];

const building = union([
  leftWing, rightWing, ...annexes, ...wingDormers,
  midRoof, midFlat, midBay, ...midDormers, ...cornerTowers, ...roundTowers, porch, canopy,
  ...courtyard, portal,
  towerBase, shaftCore, ...pilasters, ...piers, cornice, ...posts, drum, dome, ...clocks,
])
  .subtract(union([...grooves, baseSlit, ...windows, ...midWindows, ...backWindows]))
  .translate([0, -V0, 0]);

await writeLandmark({
  slug: "watertoren-udenhout-huize-vincentius",
  base: BASE,
  // Eén node: de toren rijst op uit het hoofdgebouw en vervangt samen met dat gebouw het hele BAG-pand.
  nodes: [["building:hoofdgebouw-met-watertoren-en-koepel", building]],
  catalog: {
    name: "Watertoren Huize Vincentius",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, -14], [-20, -8], [20, -8], [-45, -8], [45, -8]],
    // Ellipsoïdisch: NAP +9,65 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0855100000071049"],
    description:
      "Oorsprong op het hart van de torenschacht uit het AHN-DSM op maaiveld (NAP +9,65 m), +X langs de voorgevel (RD -20,8 graden), voorzijde -Y. Vierkante schacht van 5,3 m met hoekpilasters, hoekpijlers met consoles tot 23,8 m, twee groeven per vlak, uurwerken, kroonlijst tot 34,3 m en een koepel op een tamboer tot 37,45 m, op een onderbouw van 7 m tot 20 m; daaronder het hele hoofdgebouw van Huize Vincentius: middendeel met voorschild (nok 19,2 m) en plat achterdak, vierkante hoektorens, vier ronde traptorens, bordes met luifel, zijvleugels met schilddak en dakkapellen, lage aanbouwen, gangen rond de binnenhof en het portaal naar de kapel; vensters als nissen in de voorgevel. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 35.5,
      ahnTopNapM: 47.08,
      built: 1925,
      architect: "J.J.M. van Halteren",
      reservoirM3: null,
      ahnGroundNapM: GROUND_NAP,
      geoidNlgeo2018M: GEOID_N,
      shaftM: 5.3,
      towerBaseTopM: T.base,
      pierCapM: T.capTop,
      corniceTopM: T.cornTop,
      apexM: +(T.drumTop + T.R).toFixed(2),
      midRidgeM: MID.ridge,
      midFlatRoofM: MID.flat,
      wingEaveM: WING.eave,
      wingRidgeM: WING.ridge,
      frontLengthM: 131.2,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Udenhout_Vincentius)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_internaat_met_toren_-_Udenhout_-_20342745_-_RCE.jpg en 20342746 (voorgevel, toren, traptorens, hoektorens)",
      "https://commons.wikimedia.org/wiki/File:Udenhout_Watertoren_2010.jpg (toren, bordes, luifel, dakkapellen)",
      "https://commons.wikimedia.org/wiki/File:Vincentius_Udenhout.jpg (schacht, consoles, uurwerken, koepel)",
      "PDOK BAG-pand 0855100000071049, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,71 m) voor groundHeight",
    ],
  },
});
