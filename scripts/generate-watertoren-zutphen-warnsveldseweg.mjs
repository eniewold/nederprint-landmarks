// Watertoren aan de Warnsveldseweg in Zutphen (Hendrik Sangster, 1926-1927,
// gebouwd door de Hollandsche Maatschappij tot het Maken van Werken in Gewapend
// Beton), 46,2 m, reservoir 600 m³, rijksmonument 523419; sinds 1984 woningen in
// de schacht. Twaalfzijdige bakstenen schacht die licht verjongt, op een
// donkere plint. Elk vlak heeft een verdiept paneel tussen hoekpenanten met
// bovenaan een witte latei; op elke hoek loopt een witte vin van de koepel tot
// over de wand. Op elk tweede vlak een hoog smal venster onder de latei en
// halverwege een witte vin op een getrapte bakstenen console. Twaalfzijdige,
// gebolde betonnen koepel. Woonlagen met vensters, balkons op het zuidvlak en
// een hoge vensterstrook.
// Oorsprong op het hart van de schacht in het AHN (vrijwel het hart van
// BAG-pand 0301100000014935) op maaiveld (NAP +9,15 m). +X wijst naar het zuidvlak
// met de balkons (RD-richting -90 graden); de vlakken staan op k*30 graden, de
// hoeken op 15 + k*30 graden (BAG-contour en AHN).
// Hoogtes uit de frontale foto "Zutphen, de watertoren RM523419 foto2" (lijnen
// recht, 29,9 px/m op het voorste vlak), geschaald op de dakvoet in het AHN
// (39,4 m); de koepel per 0,5 m uit het AHN (top 46,0 m boven maaiveld).
import { hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [210993.15, 461874.42];
const AXIS = [0, -1];
const BASE = -0.3;
const N = 12;
const C = 1 / Math.cos(Math.PI / N); // apothema -> straal naar de hoek
const H = {
  plinth: 2.9, // bovenkant van de plint (witte band), voet van de schacht
  panel0: 3.2, // onderkant van de verdiepte panelen
  lintel0: 38.8, // onderkant van de witte lateien
  eave: 39.4, // bovenkant van de wand, voet van de koepel
  apex: 46.05,
};
// Apothema's: plint uit de BAG-contour, schacht verjongend (foto's 3–6 %, AHN-rand op de dakvoet).
const A = { plinth: 6.95, foot: 6.7, top: 6.45 };
const apo = (z) => A.foot + ((z - H.plinth) / (H.eave - H.plinth)) * (A.top - A.foot);
const ring = (a, z, phase = Math.PI / N) => ring3(circle([0, 0], a * C, N, phase), z);

// ---------- hoofdvolume ----------
const plinth = hull([...ring(A.plinth, BASE), ...ring(A.plinth, H.plinth)]);
const shaft = hull([...ring(A.foot, H.plinth - 0.01), ...ring(A.top, H.eave)]);
// Koepel: hoekstraal per hoogte uit het AHN (mediaan van twaalf sectoren), twaalf gebolde vlakken.
const DOME = [
  [39.35, 6.1], [40.0, 5.92], [40.5, 5.76], [41.0, 5.58], [41.5, 5.38], [42.0, 5.15], [42.5, 4.88],
  [43.0, 4.55], [43.5, 4.15], [44.0, 3.65], [44.5, 3.0], [45.0, 2.25], [45.5, 1.35], [45.85, 0.6],
];
const dome = hull([...DOME.flatMap(([z, r]) => ring(r / C, z)), [0, 0, H.apex]]);

// ---------- reliëf (gebouwd voor het vlak met normaal +X, daarna gedraaid) ----------
const PANEL_W = 2.1; // paneel tussen de hoekpenanten (0,7 m per kant van elke hoek)
const PANEL_D = 0.15;
// Verdiept paneel dat de verjonging volgt, met een plafond van 56 graden onder de latei.
const panelCut = (() => {
  const w = PANEL_W / 2, z0 = H.panel0, z1 = H.lintel0;
  const zi = z1 + 1.5 * PANEL_D;
  return hull([
    [apo(z0) - PANEL_D, -w, z0], [apo(z0) - PANEL_D, w, z0], [apo(z0) + 1, -w, z0], [apo(z0) + 1, w, z0],
    [apo(zi) - PANEL_D, -w, zi], [apo(zi) - PANEL_D, w, zi], [apo(z1), -w, z1], [apo(z1), w, z1],
    [apo(z1) + 1, -w, z1 - 1.5], [apo(z1) + 1, w, z1 - 1.5],
  ]);
})();
// Blok op het paneel: buitenvlak `out` m voor het paneelvlak (0,15 m achter de wand), breedte w,
// van z0 tot z1, met een onderkant van 55 graden (1,43 stijging per m uitsprong) vanaf het paneel.
const ledge = (out, w, z0, z1, back = 0.6) => {
  const face = (z) => apo(z) - PANEL_D;
  const wi = face(z0) - back, wo = face(z0) + out, zo = z0 + 1.43 * out;
  return hull([
    [wi, -w / 2, z0], [wi, w / 2, z0], [face(z0), -w / 2, z0], [face(z0), w / 2, z0],
    [wo, -w / 2, zo], [wo, w / 2, zo],
    [face(z1) - back, -w / 2, z1], [face(z1) - back, w / 2, z1], [face(z1) + out, -w / 2, z1], [face(z1) + out, w / 2, z1],
  ]);
};
// Witte latei boven elk paneel, 0,2 m voor de wand.
const lintel = ledge(PANEL_D + 0.2, PANEL_W + 0.2, H.lintel0, H.eave);
// Halverwege (elk tweede vlak): getrapte bakstenen console over de paneelbreedte, 0,4 m voor de wand, en een witte vin erop.
const corbel = ledge(PANEL_D + 0.4, PANEL_W + 0.15, 28.8, 30.1);
const midFin = ledge(PANEL_D + 0.3, 0.8, 30.0, 32.5);

// Hoekvin: 0,8 m breed, 0,35 m buiten de hoek, van een voet op 36,9 m over de wand en de koepelrib tot 44,5 m.
const FIN = { w: 0.8, out: 0.35, foot: 36.9 };
const cornerFin = (() => {
  const st = [
    [FIN.foot, apo(FIN.foot) * C, apo(FIN.foot) * C], // voet tegen de wand (onderkant 55 graden)
    [FIN.foot + 1.43 * FIN.out, apo(FIN.foot) * C, apo(FIN.foot) * C + FIN.out],
    [H.eave, apo(H.eave) * C, apo(H.eave) * C + FIN.out],
    ...DOME.filter(([z]) => z > H.eave && z <= 44.5).map(([z, r]) => [z, r, r + FIN.out]),
  ];
  const sec = ([z, rw, ro]) => [[rw - 0.8, -FIN.w / 2, z], [rw - 0.8, FIN.w / 2, z], [ro, -FIN.w / 2, z], [ro, FIN.w / 2, z]];
  const segs = [];
  for (let k = 0; k + 1 < st.length; k++) segs.push(hull([...sec(st[k]), ...sec(st[k + 1])]));
  return union(segs);
})();

// Nis in het vlak met normaal +X: plafond dat naar binnen onder 56 graden oploopt.
const niche = (w, z0, z1, depth = 0.3, f = null) => {
  const fz = f ?? apo(z1) - PANEL_D;
  const a = fz - depth, b = fz + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [fz, -w / 2, z1], [a, w / 2, za], [fz, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Balkon met dichte borstwering: 0,6 m voor het paneel, 2,0 m breed, vloer op f, borstwering tot f + 1,0.
// Het onderste balkon rust op de plint (een onderkant van 55 graden zou net boven de plint uitkomen).
const balcony = (f) => {
  const p = apo(f) - PANEL_D, w = 1.0, out = 0.6;
  const low = f - 0.15 - 1.43 * out < H.plinth + 0.6;
  const foot = low
    ? [[p - 0.3, -w, H.plinth - 0.01], [p - 0.3, w, H.plinth - 0.01], [A.plinth, -w, H.plinth - 0.01], [A.plinth, w, H.plinth - 0.01]]
    : [[p - 0.3, -w, f - 0.15 - 1.43 * out], [p - 0.3, w, f - 0.15 - 1.43 * out]];
  return hull([
    ...foot, [p + out, -w, f - 0.15], [p + out, w, f - 0.15],
    [p - 0.3, -w, f + 1.0], [p - 0.3, w, f + 1.0], [p + out, -w, f + 1.0], [p + out, w, f + 1.0],
  ]);
};

const FACES = Array.from({ length: N }, (_, k) => k * 30 - 150); // -150 … 180
const A_FACES = [0, 60, 120, 180, -120, -60]; // vlakken met hoog venster en vin op console
const FLOORS = [3.5, 6.8, 10.1]; // vloeren van de woonlagen (balkons op het zuidvlak)
const WINDOW_FACES = FACES.filter((d) => d !== 0 && d !== 60);

const additions = [
  ...FACES.map((deg) => place(lintel, { deg })),
  ...A_FACES.flatMap((deg) => [place(corbel, { deg }), place(midFin, { deg })]),
  ...FACES.map((deg) => place(cornerFin, { deg: deg + 15 })),
  ...FLOORS.map((f) => balcony(f)),
];
const cuts = [
  // Hoog smal venster onder de latei op elk tweede vlak.
  ...A_FACES.map((deg) => place(niche(0.7, 35.1, 38.3), { deg })),
  // Woonlagen: balkondeuren op het zuidvlak, een hoge vensterstrook op het vlak +60, dubbele vensters op de overige vlakken.
  ...FLOORS.map((f) => niche(1.8, f + 0.05, f + 2.15, 0.35)),
  place(niche(0.7, 3.3, 12.4), { deg: 60 }),
  ...WINDOW_FACES.flatMap((deg) => FLOORS.map((f) => place(niche(1.3, f + 0.5, f + 2.5), { deg }))),
  // Plint: deur op het zuidvlak en op het oostvlak (+90), venster op het vlak -30.
  niche(2.0, 0, 2.3, 0.35, A.plinth),
  place(niche(1.6, 0, 2.3, 0.35, A.plinth), { deg: 90 }),
  place(niche(1.3, 0.7, 2.4, 0.3, A.plinth), { deg: -30 }),
];

// Eerst panelen en nissen uit de wand, dan pas lateien, consoles, vinnen en balkons erop
// (de balkons staan voor de deurnissen).
const tower = union([plinth, shaft.subtract(union(FACES.map((deg) => place(panelCut, { deg })))), dome])
  .subtract(union(cuts))
  .add(union(additions));

await writeLandmark({
  slug: "watertoren-zutphen-warnsveldseweg",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-en-koepel", tower]],
  catalog: {
    name: "Watertoren Warnsveldseweg Zutphen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundHeight: 52.52,
    groundSamplePoints: [[8.7, 0], [0, 8.7], [-8.7, 0], [0, -8.7]],
    replacesBuildings: ["NL.IMBAG.Pand.0301100000014935"],
    description:
      "Oorsprong op het hart van de twaalfzijdige schacht op maaiveld (NAP +9,15 m), +X naar het zuidvlak met de balkons; vlakken op k·30 graden. Plint van 13,9 m over de vlakken tot 2,9 m, schacht verjongend van 13,4 naar 12,9 m tot de dakvoet op 39,4 m, verdiepte panelen met witte lateien, twaalf hoekvinnen, zes vinnen op consoles en zes hoge vensters, woonlagen met vensters, balkons en vensterstrook; gebolde twaalfzijdige koepel tot 46,05 m. Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 46.2,
      reservoirM3: 600,
      ahnGroundNapM: 9.15,
      ahnTopNapM: 55.13,
      groundHeightEllipsoidM: 52.52,
      plinthAcrossFlatsM: 13.9,
      shaftFootAcrossFlatsM: 13.4,
      shaftTopAcrossFlatsM: 12.9,
      plinthTopM: 2.9,
      eaveM: 39.4,
      modelTopM: 46.05,
      photoScalePxPerM: 29.9,
      minimumPartM: 0.7,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Zutphen_Warnsveldseweg)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/523419",
      "https://commons.wikimedia.org/wiki/File:Zutphen,_de_watertoren_RM523419_foto2_2014-03-10_15.02.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Zutphen,_de_watertoren_RM523419_IMG_3891_2020-03-31_14.00.jpg (zuidzijde)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Zutphen.jpg (koepel, vinnen en woonlagen)",
      "https://commons.wikimedia.org/wiki/File:Zutphen_Wasserturm.jpg (oostzijde vanaf de Warnsveldseweg)",
      "PDOK BAG-pand 0301100000014935, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});
