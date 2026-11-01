// Watertoren van Doetinchem (G.J. Postel Hzn., 1937-1938), Oude Terborgseweg
// 208, rijksmonument 513133, 40,6 m hoog met twee vlakbodemreservoirs van
// 180 m³ boven elkaar. Vierkante bakstenen toren met een omlopende galerij op
// de eerste lekvloer, een glazen verdieping onder een luifel, het
// reservoirblok met hoeklisenen en stenen consoles onder een kroonlijst, een
// lichte fries en een tentdak met een knik aan de voet. Aan de ingangszijde een
// smalle, hoge risaliet tot tegen de galerij en een laag ingangsportaal.
// Oorsprong op het hart van de vierkante BAG-contour (pand 0222100000591573,
// 8,41 m; de top van het tentdak in het AHN ligt erop) op maaiveld (NAP +16,1 m).
// +X wijst naar de ingangszijde met risaliet en portaal, 36,8 graden linksom
// van RD-oost (gevels uit de BAG). Hoogtes van galerij, luifel, vensters,
// kroonlijst en dakrand uit de foto "Watertower Doetinchem by G.J. Postel Hzn."
// (van ver, bijna recht op een gevel; 36,7 px/m, geschaald op de breedte over
// de hoeklisenen), dakvoet en nok uit het AHN (helling 36 graden, top 40,6 m),
// vensters en deur in de schacht uit de foto "Doetinchem Watertoren" (zuidwest).
import { Manifold, box, hull, ring3, rect, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [218197.866, 440613.235];
const AXIS = [0.8004, 0.5995]; // 36,8 graden
const BASE = -0.3;
const A = 4.2; // halve breedte van schacht en reservoirblok (BAG 8,41 m)
const SLOPE = 1.8; // 61 graden: onderkant van kragen en dakrand (52 graden langs de hoekgraten)
const H = {
  galleryWall: 23.82 - 1.0 * SLOPE, // de kraag onder de galerij begint op de schacht
  gallerySoffit: 23.82,
  gallery: 24.1, // omlopende galerij op de eerste lekvloer
  luifelSoffit: 26.6,
  luifel: 26.98,
  console: 35.0, // onderkant van de stenen consoles op de hoeklisenen
  ledge: 36.25, // onderkant van de kroonlijst
  ledgeTop: 36.45,
  frieze: 36.7, // lichte fries tot de onderkant van de dakrand (37,15 - 0,25 * SLOPE)
  fascia: 37.15,
  eave: 37.4, // dakrand
  knick: 37.65, // knik in het tentdak
  apex: 40.6, // top (Wikipedia 40,6; AHN 40,4 tot 40,7)
};
const R = { gallery: 5.2, luifel: 4.9, lisene: 4.4, lisW: 0.9, ledge: 4.55, frieze: 4.3, eave: 4.55, knick: 4.1 };
const sq = (a, z) => ring3(rect(-a, -a, a, a), z);

// ---------- schacht en reservoirblok: één vierkant prisma tot de kroonlijst ----------
const body = box(-A, -A, BASE, A, A, H.ledge);

// Galerij en luifel rondom, met een onderkant onder 61 graden (in het echt dunne platen).
const gallery = hull([...sq(A, H.galleryWall), ...sq(R.gallery, H.gallerySoffit), ...sq(R.gallery, H.gallery)]);
const luifel = hull([...sq(A, H.luifelSoffit - (R.luifel - A) * SLOPE), ...sq(R.luifel, H.luifelSoffit), ...sq(R.luifel, H.luifel)]);

// Hoeklisenen van het reservoirblok (0,9 m breed, 0,2 m voor de gevel) met stenen consoles onder de kroonlijst.
const lisene = box(R.lisene - R.lisW, R.lisene - R.lisW, H.luifel - 0.05, R.lisene, R.lisene, H.ledge);
const consoleBlock = hull([
  ...ring3(rect(R.lisene - R.lisW, R.lisene - R.lisW, R.lisene, R.lisene), H.console),
  ...ring3(rect(R.lisene - R.lisW, R.lisene - R.lisW, R.ledge, R.ledge), H.console + (R.ledge - R.lisene) * SLOPE),
  ...ring3(rect(R.lisene - R.lisW, R.lisene - R.lisW, R.ledge, R.ledge), H.ledge),
]);
const corners = union([0, 90, 180, 270].map((deg) => place(union([lisene, consoleBlock]), { deg })));

// Kroonlijst, fries, dakrand en tentdak met een flauwere voet (knik).
const ledge = hull([...sq(A, H.ledge - (R.ledge - A) * SLOPE), ...sq(R.ledge, H.ledge), ...sq(R.ledge, H.ledgeTop)]);
const frieze = box(-R.frieze, -R.frieze, H.ledgeTop - 0.05, R.frieze, R.frieze, H.frieze);
const eave = hull([...sq(R.frieze, H.frieze), ...sq(R.eave, H.fascia), ...sq(R.eave, H.eave), ...sq(R.knick, H.knick)]);
const roof = hull([...sq(R.knick, H.knick - 0.1), ...sq(R.knick, H.knick), [0, 0, H.apex]]);

// ---------- ingangszijde (+X): risaliet tot tegen de galerij en laag portaal ----------
const RIS = { front: A + 1.0, w: 1.6, portal: 6.86, portalTop: 4.2 };
const risalit = box(A - 0.05, -RIS.w, BASE, RIS.front, RIS.w, H.gallerySoffit);
const portal = box(RIS.front - 0.05, -RIS.w, BASE, RIS.portal, RIS.w, RIS.portalTop);
const portalCap = hull([
  ...ring3(rect(RIS.front, -RIS.w, RIS.portal, RIS.w), RIS.portalTop - 0.3),
  ...ring3(rect(RIS.front, -RIS.w - 0.2, RIS.portal + 0.2, RIS.w + 0.2), RIS.portalTop - 0.3 + 0.2 * SLOPE),
  ...ring3(rect(RIS.front, -RIS.w - 0.2, RIS.portal + 0.2, RIS.w + 0.2), RIS.portalTop + 0.25),
]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const at = (m, y, deg) => place(m.translate([0, y, 0]), { deg });
const FACES = [0, 90, 180, 270]; // +X ingangszijde (noordoost), 180 de zuidwestgevel van de foto
const cuts = [
  ...FACES.flatMap((deg) => [
    // Reservoirblok: vier vensters onder de kroonlijst (0,4 m lager dan op de foto, zodat het latei onder de kraag
    // niet als te dun wordt opgevuld), rechts twee en links één trapvenster.
    ...[-2.34, -0.78, 0.78, 2.34].map((y) => at(niche(A, 0.5, 34.35, 35.15, 0.25), y, deg)),
    at(niche(A, 0.5, 32.97, 33.93, 0.25), 2.34, deg),
    at(niche(A, 0.5, 28.2, 29.18, 0.25), 2.34, deg),
    at(niche(A, 0.5, 30.79, 31.75, 0.25), -2.34, deg),
    // Glazen verdieping op de galerij: drie ramen per gevel (pijlers 1,0 m), aan de ingangszijde een deur in het midden.
    ...[-2.2, 0, 2.2].map((y) => at(niche(A, 1.2, deg === 0 && y === 0 ? H.gallery : 25.0, 26.3, 0.3), y, deg)),
  ]),
  // Schacht: twee paar smalle vensters in de drie gevels zonder risaliet, deur in de zuidwestgevel.
  ...[90, 180, 270].flatMap((deg) => [-0.78, 0.78].flatMap((y) => [[7.3, 8.5], [18.3, 19.5]].map(([z0, z1]) => at(niche(A, 0.45, z0, z1, 0.3), y, deg)))),
  at(niche(A, 1.6, 0, 2.4, 0.35), 0.4, 180),
  // Risaliet: een kolom trapvensters; portaal: ingang.
  ...[6.0, 9.5, 13.0, 16.5, 20.0].map((z) => niche(RIS.front, 0.5, z, z + 1.0, 0.25)),
  niche(RIS.portal, 1.6, 0, 2.8, 0.35),
];

await writeLandmark({
  slug: "watertoren-doetinchem",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los dak of losse galerij kreeg een voet tot de grondplaat.
  nodes: [["building:schacht-galerij-reservoirblok-en-tentdak", union([body, gallery, luifel, corners, ledge, frieze, eave, roof, risalit, portal, portalCap]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Doetinchem",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-5.7, 0], [0, 5.7], [0, -5.7], [8.3, 0]],
    replacesBuildings: ["NL.IMBAG.Pand.0222100000591573"],
    description:
      "Oorsprong op het hart van de vierkante BAG-contour op maaiveld (NAP +16,1 m), +X naar de ingangszijde op 36,8 graden (noordoost). Bakstenen toren van 8,4 m in het vierkant met paren smalle vensters en een deur in de schacht, aan de ingangszijde een risaliet van 3,2 m tot de galerij en een laag portaal; omlopende galerij van 10,4 m op 24,1 m, glazen verdieping met drie ramen per gevel onder een luifel tot 27,0 m, reservoirblok met hoeklisenen, vensters, stenen consoles en kroonlijst tot 36,45 m, fries, dakrand op 37,4 m en tentdak met knik tot 40,6 m. Maten uit BAG, AHN, Wikipedia en foto's.",
    realWorld: {
      publishedHeightM: 40.6,
      reservoirsM3: [180, 180],
      ahnGroundNapM: 16.1,
      ahnTopNapM: 56.93,
      bagSquareM: 8.41,
      bagEntranceM: [3.2, 2.66],
      risalitDepthM: 1.0,
      portalHeightM: 4.2,
      galleryM: 24.1,
      galleryWidthM: 10.4,
      luifelM: 26.98,
      ledgeM: 36.45,
      eaveM: 37.4,
      roofPitchDeg: 36,
      modelTopM: 40.6,
      photoScalePxPerM: 36.7,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Doetinchem)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/513133",
      "https://commons.wikimedia.org/wiki/File:Watertower_Doetinchem_by_G.J._Postel_Hzn.,_Doetinchem,_the_Netherlands.JPG (van ver, bijna recht: galerij, luifel, reservoirblok, kroonlijst en dak)",
      "https://commons.wikimedia.org/wiki/File:Doetinchem_Watertoren.JPG (zuidwestgevel: vensters en deur in de schacht)",
      "PDOK BAG-pand 0222100000591573, 3D BAG LoD2.2, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});
