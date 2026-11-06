// Watertoren van Boven-Hardinxveld (Hardinxveld-Giessendam). Gebouwd in 1923 door de N.V. Algemeene Beton Compagnie
// uit Den Haag, 42,90 m hoog, betonnen vlakbodemreservoir van 215 m³; interbellumstijl met invloeden van het Nieuwe
// Bouwen en een "zware kap" (Wikipedia). Rijksmonument 512954. Een vierkante, gepleisterde betonnen schacht met per
// gevel drie verdiepte verticale velden (een breed in het midden, een smal bij elke hoek) boven een gladde voet, een
// band onder de kraag; een breder vierkant reservoir met een schuine onderkant van 45 graden; daarboven een omloop op
// consoles met een stalen hekwerk; daarop een zware, geknikte piramidekap (onderste deel steiler) met een pinakel.
//
// Oorsprong op het hart van de rechthoekige BAG-voetafdruk van pand 0523100000012264 (7,0 x 6,6 m); lokale X-as langs
// de zuidgevel, 0,9 graden linksom van RD-oost. Maaiveld AHN-DTM NAP +0,05.
// Hoogtes uit het AHN-DSM (0,5 m): omloop NAP +30,7 (1 m breed rondom de kap, 11,5 tot 12 m in het vierkant), goot van de
// kap circa NAP +32,6 bij 5 m uit het hart, knik op 4,5 m (NAP +34,7), piramidevlak van 58 graden tot de top op
// NAP +42,0; Wikipedia 42,9 m met de pinakel. Breedtes van reservoir (9 m), goot (10 m) en omloop (11,5 m), de knik in
// de kap, de hoogte van reservoir en kraag en de indeling van de velden in de schacht van de foto's
// "Hardinxveld Watertoren 6853.JPG" (telelens, bijna orthografisch, 0,0234 m per pixel op het reservoir) en de RCE-foto
// 20276765, geschaald op het AHN.
import { Manifold, hull, union, prism, place, rect, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [119622.02, 426112.23];
const AXIS_DEG = 0.9;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.05;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 43,571 op de weg, noord 43,706, west
// 43,759, zuid 43,855), gemeten 2026-11-06. Het PDOK-pand staat op 43,55 met de top op 85,86.
const GROUND_ELLIPSOID = 43.571;

// ---------- maten (meters boven het maaiveld, halve breedtes vanaf het hart) ----------
const SX = 3.5; // schacht, halve breedte langs X (BAG 6,99 m)
const SY = 3.31; // schacht, halve breedte langs Y (BAG 6,62 m)
const H = {
  plain: 4.3, // gladde voet onder de velden
  panelTop: 21.0, // bovenkant van de verdiepte velden
  band: 21.7, // onderkant van de band onder de kraag
  bandTop: 22.5, // bovenkant band = begin schuine onderkant reservoir
  tank: 23.6, // onderkant van de rechte reservoirwand
  deckKraag: 29.05, // begin van de schuine kraag onder de omloop
  deckBottom: 30.3,
  deck: 30.75, // omloop (AHN NAP +30,7)
  eaveKraag: 31.7,
  eave: 32.2, // goot van de kap (AHN gemengd 32,3 tot 33,5 op de rand; foto 1,1 tot 1,4 m boven de omloop)
  eaveLip: 32.35,
  knee: 35.0, // knik in de kap (AHN: 34,7 op 4,5 m)
  apex: 42.0, // top van de piramide (AHN NAP +42,0)
  finial: 42.85, // pinakel (Wikipedia 42,9 m)
};
const R = {
  band: 0.15, // uitsprong van de band
  tank: 4.5, // reservoir 9 x 9 m
  deck: 5.75, // omloop 11,5 x 11,5 m
  eave: 5.0, // goot 10 x 10 m
  knee: 4.3, // knik: onderste kapdeel 74 graden, bovenste 58 graden
  finial: 0.45,
};

const sq = (h, z) => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]];
const rectPts = (hx, hy, z) => [[-hx, -hy, z], [hx, -hy, z], [hx, hy, z], [-hx, hy, z]];

// Nis in een gevel met normaal +X op afstand f, midden op y = c, breedte w, van z0 tot z1, 0,3 m diep; het plafond
// loopt naar binnen onder 56 graden op, zodat er niets vrij hangt.
const niche = (f, c, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  const y0 = c - w / 2, y1 = c + w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, zb], [b, y1, zb]]);
};
// Per gevel (lengte L, afstand f, rotatie deg) de drie verdiepte velden: breed in het midden (37 % van de gevel),
// smal (0,9 m; op de foto circa 0,5 m) op 0,6 m van elke hoek.
const facePanels = (f, L, deg) => {
  const wide = 0.37 * L, side = L / 2 - 0.6 - 0.45;
  return [niche(f, 0, wide, H.plain, H.panelTop), niche(f, side, 0.9, H.plain, H.panelTop), niche(f, -side, 0.9, H.plain, H.panelTop)].map((m) => place(m, { deg }));
};

// ---------- schacht met band ----------
const shaft = prism(rect(-SX, -SY, SX, SY), BASE, H.bandTop);
const band = hull([...rectPts(SX, SY, H.band - R.band), ...rectPts(SX + R.band, SY + R.band, H.band), ...rectPts(SX + R.band, SY + R.band, H.bandTop)]);

// ---------- reservoir: schuine onderkant (45 graden of steiler), rechte wand tot onder de kap ----------
const tank = hull([...rectPts(SX + R.band, SY + R.band, H.bandTop), ...sq(R.tank, H.tank), ...sq(R.tank, H.eaveKraag)]);

// ---------- omloop: kraag van 45 graden (de consoles) en een plaat van 0,45 m ----------
const deck = hull([...sq(R.tank, H.deckKraag), ...sq(R.deck, H.deckBottom), ...sq(R.deck, H.deck)]);

// ---------- kap: goot met kraag, onderste steile deel tot de knik, piramide tot de top, pinakel ----------
const roof = hull([...sq(R.tank, H.eaveKraag), ...sq(R.eave, H.eave), ...sq(R.eave, H.eaveLip), ...sq(R.knee, H.knee), [0, 0, H.apex]]);
const finial = hull([...sq(R.finial, 41.2), ...sq(R.finial, 42.3), [0, 0, H.finial]]);

// ---------- nissen: velden in de schacht, deur en venster in de voet ----------
// Deur (1,4 x 2,4 m) aan de oostzijde en een klein venster (als nis van 0,9 m) aan de noordzijde: de stand is uit de
// twee foto's afgeleid en onzeker.
const openings = union([
  ...facePanels(SX, 2 * SY, 0),
  ...facePanels(SX, 2 * SY, 180),
  ...facePanels(SY, 2 * SX, 90),
  ...facePanels(SY, 2 * SX, 270),
  niche(SX, -0.9, 1.4, 0, 2.4),
  place(niche(SY, -1.6, 0.9, 1.5, 2.4), { deg: 90 }),
]);

const all = union([shaft, band, tank, deck, roof, finial]).subtract(openings);

await writeLandmark({
  slug: "watertoren-boven-hardinxveld",
  base: BASE,
  nodes: [["building:watertoren-schacht-reservoir-omloop-en-kap", all]],
  catalog: {
    name: "Watertoren Boven-Hardinxveld",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0523100000012264"],
    description:
      "Oorsprong op het hart van de rechthoekige BAG-voetafdruk (7,0 x 6,6 m) op het maaiveld (NAP +0,05 m), X-as langs de zuidgevel, 0,9 graden linksom van RD-oost. Vierkante betonnen schacht met per gevel drie verdiepte velden en een band op 21,7 m; reservoir van 9 x 9 m met een schuine onderkant van 45 graden (22,5 tot 23,6 m); omloop van 11,5 m op 30,75 m op een kraag van 45 graden; geknikte piramidekap van 32,2 m (goot 10 m) via de knik op 35 m tot de top op 42 m, pinakel tot 42,85 m. Hekwerk en consoles weggelaten. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1923,
      builder: "N.V. Algemeene Beton Compagnie, Den Haag",
      rijksmonument: 512954,
      publishedHeightM: 42.9,
      reservoirM3: 215,
      ahnGroundNapM: GROUND_NAP,
      ahnDeckNapM: 30.7,
      ahnEaveNapM: 32.6,
      ahnApexNapM: 42.0,
      shaftM: [2 * SX, 2 * SY],
      reservoirM: 2 * R.tank,
      reservoirBottomM: H.tank,
      deckM: H.deck,
      deckWidthM: 2 * R.deck,
      eaveM: H.eave,
      eaveWidthM: 2 * R.eave,
      kneeM: H.knee,
      apexM: H.apex,
      topM: H.finial,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Boven-Hardinxveld) (1923, N.V. Algemeene Beton Compagnie, 42,90 m, 215 m³, rijksmonument 512954)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Boven-Hardinxveld) (Hardinxveld Watertoren 6853.JPG, 2008; Exterieur OVERZICHT, VOORGEVEL, ZIJGEVEL - Boven-Hardinxveld - 20276765 - RCE.jpg, 1992)",
      "PDOK BAG-pand 0523100000012264, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});
