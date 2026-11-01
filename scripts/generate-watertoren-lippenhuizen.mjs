// Watertoren van Lippenhuizen (I.W.G.L. met de Bredasche Beton Mij., 1932),
// rijksmonument 513162, twee reservoirs van 300 m³. Achthoekige bakstenen
// schacht zonder verjonging, hoeken op k*45 graden in RD (luchtfoto: acht
// graten van het tentdak, AHN 8 tot 20 m). De vier diagonale hoeken zijn tot de
// gelede luifel op circa 23-25 m afgeschuind tot een plat paneel (de BAG-contour
// tekent ze als vlakken van 5,45 m) met drie smalle verticale vensters en een
// raampaar; daarboven springt de volle hoek terug met drie rijen raamparen en
// een rib op de hoek. De deur met portaal zit in het paneel naar het
// zuidoosten, aan het pad naar de weg. Koperen achtzijdig tentdak met een
// donkere opstand en een uitgebogen dakvoet.
// Oorsprong op het hart van de BAG-contour, bijgesteld op het AHN, op maaiveld
// (NAP +2,28 m), assen in RD-richting. Hoogtes uit de telelensfoto
// "Watertoren Lippenhuizen.jpg" (22,9 px/m op de breedte over de hoeken),
// gekoppeld aan de dakvoet en de top in het AHN en de 3D BAG.
import { Manifold, hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [202884.75, 559849.75];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  plinth: 2.6, // bovenkant van de plint
  cornice: 24.6, // bovenkant van de gelede luifel boven de panelen
  fascia: 24.0, // onderkant van de rechte voorkant van de luifel
  corbel: 22.2, // waar de schuine onderkant van de luifel het paneel raakt
  wall: 36.7, // bovenkant van het metselwerk
  attic: 37.9, // donkere koperen opstand onder het tentdak
  eave: 38.45, // uitgebogen dakvoet
  lip: 38.6,
  apex: 43.5,
};
const R = 7.3; // straal naar de hoeken (luchtfoto 7,1 tot 7,4, AHN en BAG op de hoofdrichtingen 7,4)
const C = 6.0; // afstand van het hart tot de afgeschuinde panelen op de diagonalen (BAG 6,05)
const PLINTH = 0.25; // vooruitsprong van de plint
const SIN = Math.sin(Math.PI / 8), COS = Math.cos(Math.PI / 8);
const APOTHEM = R * COS;
const PANEL_HALF = ((R - C) / SIN) * COS; // halve breedte van een paneel (3,14 m)
const MAIN = [0, 90, 180, 270]; // gewone hoeken
const DIAG = [45, 135, 225, 315]; // hoeken met paneel, luifel en raamparen
const DOOR = 315; // zuidoosten
const rad = (deg) => (deg * Math.PI) / 180;

const octagon = (r) => circle([0, 0], r, 8, 0);
// Plattegrond onder de luifel: de achthoek met de vier diagonale hoeken afgeschuind op afstand C.
const panelPlan = (grow = 0) =>
  [0, 45, 90, 135, 180, 225, 270, 315].flatMap((deg) => {
    const t = rad(deg), u = [Math.cos(t), Math.sin(t)], n = [-u[1], u[0]];
    if (deg % 90 === 0) {
      const r = R + grow / COS;
      return [[r * u[0], r * u[1]]];
    }
    // Snijpunten van het paneel (normaal u, afstand C + grow) met de twee aangrenzende vlakken (afstand APOTHEM + grow).
    const c = C + grow, a = APOTHEM + grow;
    const side = (s) => {
      const m = [Math.cos(t + s * rad(22.5)), Math.sin(t + s * rad(22.5))];
      // Los op: p.u = c en p.m = a, met p = c*u + y*n.
      const y = (a - c * (m[0] * u[0] + m[1] * u[1])) / (m[0] * n[0] + m[1] * n[1]);
      return [c * u[0] + y * n[0], c * u[1] + y * n[1]];
    };
    return [side(-1), side(1)];
  });

// ---------- schacht ----------
const lower = prism(panelPlan(), BASE, H.cornice);
const upper = prism(octagon(R), H.cornice - 0.2, H.wall);
const plinth = hull([...ring3(panelPlan(PLINTH), BASE), ...ring3(panelPlan(PLINTH), H.plinth - 0.35), ...ring3(panelPlan(), H.plinth)]); // bovenkant onder 54 graden

// ---------- gelede luifel boven elk paneel ----------
// V-vormig in plattegrond, 0,15 m voor de volle hoek; de onderkant loopt onder 52 graden schuin naar het paneel.
const OUT = 0.15;
const faceAt = (s, t) => [R - SIN * t + COS * OUT, s * (COS * t + SIN * OUT)]; // punt op vlak s=+-1 op afstand t van de hoek, OUT naar buiten
const tEnd = PANEL_HALF / COS + 0.2;
const cornice = hull([
  ...[-1, 1].flatMap((s) => [
    [C, s * PANEL_HALF, H.corbel],
    [C - 0.3, s * PANEL_HALF, H.corbel],
    [C - 0.3, s * PANEL_HALF, H.cornice],
    [...faceAt(s, tEnd), H.fascia],
    [...faceAt(s, tEnd), H.cornice],
  ]),
  [R + OUT / COS, 0, H.fascia],
  [R + OUT / COS, 0, H.cornice],
]);

// ---------- ribben op de diagonale hoeken, bij elke rij raamparen ----------
const ROWS = [27.8, 31.5, 35.15]; // middens van de drie rijen raamparen boven de luifel
// Ribben: voorkant van 26,8 tot 28,6 en van 30,7 tot 32,3; de bovenste loopt van 34,4 door tot de muurrand.
const RIBS = [[25.7, 28.6], [29.6, 32.3], [33.3, 36.7]];
const rib =(z0, z1, out = 0.5) =>
  hull([
    ...[-0.45, 0.45].flatMap((y) => [
      [R - 0.3, y, z0],
      [R + out, y, z0 + (out + 0.3) * 1.4], // onderkant onder 54 graden
      [R + out, y, z1],
      [R - 0.3, y, z1],
    ]),
  ]);

// ---------- dak ----------
const attic = prism(octagon(R - 0.35), H.wall - 0.05, H.attic);
const flare = hull([...ring3(octagon(R - 0.35), H.attic - 0.05), ...ring3(octagon(R), H.eave)]); // onderkant onder 57 graden
const roof = hull([...ring3(octagon(R), H.eave - 0.05), ...ring3(octagon(R), H.lip), [0, 0, H.apex]]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};

// ---------- portaal voor de deur ----------
const portal = place(prism([[C - 0.2, -2.3], [C + 0.8, -2.3], [C + 0.8, 2.3], [C - 0.2, 2.3]], BASE, 4.0), { deg: DOOR });

const cuts = [
  // Deuropening tussen de wangen (0,9 m) van het portaal, tot het paneel. Een diepere nis waarvan het schuine plafond
  // boven het portaal in de schacht doorloopt, vult de export helemaal op.
  place(niche(C + 0.8, 2.8, 0, 2.65, 0.8), { deg: DOOR }),
  ...DIAG.flatMap((deg) => [
    // Drie smalle hoge vensters in het paneel, en het raampaar net onder de luifel (penant 0,9 m).
    ...[[5.4, 8.6], [9.6, 12.8], [14.6, 17.9]].map(([z0, z1]) => place(niche(C, 0.45, z0, z1), { deg })),
    ...[-0.95, 0.95].map((y) => place(niche(C, 1.0, 20.9, 21.9).translate([0, y, 0]), { deg })),
    // Raamparen boven de luifel: op elk vlak naast de hoek een liggend venster van 1,8 x 0,7 m.
    ...[-1, 1].flatMap((s) =>
      ROWS.map((z) => place(niche(APOTHEM, 1.8, z - 0.35, z + 0.35).translate([0, -s * (R * SIN - 1.5), 0]), { deg: deg + s * 22.5 })),
    ),
  ]),
];

const tower = union([
  lower,
  upper,
  plinth,
  ...DIAG.map((deg) => place(cornice, { deg })),
  ...DIAG.flatMap((deg) => RIBS.map(([z0, z1]) => place(rib(z0, z1), { deg }))),
  portal,
  attic,
  flare,
  roof,
]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-lippenhuizen",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:achthoekige-schacht-met-panelen-luifels-en-tentdak", tower]],
  catalog: {
    name: "Watertoren Lippenhuizen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [0, 9], [0, -9]],
    replacesBuildings: ["NL.IMBAG.Pand.0086100000354476"],
    description:
      "Oorsprong op het hart van de BAG-contour, bijgesteld op het AHN, op maaiveld (NAP +2,28 m), assen in RD-richting. Achthoekige bakstenen schacht (14,6 m over de hoeken) met plint; de vier diagonale hoeken zijn tot de gelede luifel op 24,6 m afgeschuind tot panelen met smalle vensters, de deur met portaal in het paneel naar het zuidoosten; daarboven drie rijen raamparen met ribben op de hoeken tot 36,7 m, een koperen opstand met uitgebogen dakvoet en een achtzijdig tentdak tot 43,5 m. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 44.25,
      reservoirsM3: [300, 300],
      ahnGroundNapM: 2.28,
      ahnTopNapM: 45.75,
      cornerRadiusM: R,
      panelDistanceM: C,
      panelWidthM: +(2 * PANEL_HALF).toFixed(2),
      corniceTopM: H.cornice,
      wallTopM: H.wall,
      eaveM: H.eave,
      modelTopM: H.apex,
      photoScalePxPerM: 22.9,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Lippenhuizen)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/513162",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Lippenhuizen.jpg (telelens, hoogtes van luifel, raamparen en dakvoet)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Lippenhuizen_2019.jpg (paneel, luifel en ribben aan de deurzijde)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_in_Lippenhuizen_Industrieel_erfgoed_1932,_signatuur_65872.jpg (portaal)",
      "PDOK BAG-pand 0086100000354476, AHN DSM/DTM 0,5 m, luchtfoto en 3D BAG, 2026-11-01",
    ],
  },
});
