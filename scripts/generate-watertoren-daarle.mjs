// Watertoren van Daarle aan de Watertorenweg, gebouwd in 1934 naar ontwerp van Duecker & Co uit Duisburg (gemeentelijk
// monument; Wikipedia: 33,7 m hoog, reservoir 145 m³; in 2004 door Vitens verkocht, in 2021 vergunning voor vijf
// appartementen). Kale betonnen schacht op een vierkant met diep teruggezette schuine hoeken: aan elke zijde een brede
// risaliet van 3,58 m die 0,95 m uitsteekt, in elke hoek een schuin vlak van 2,54 m. In het schuine vlak aan de
// zuidwestkant een kolom smalle trapvensters, bovenin elk schuin vlak een band vensters onder de dakrand. De achtkante
// dakrand overspant de hoeken (onderzijde schuin), daarop een vlak achtkant piramidedak (luchtfoto: achtkant met stalen
// naden, de top in het midden).
//
// Oorsprong op het hart van BAG-pand 0163100000529763 (gemiddelde van de zestien hoekpunten, RD [234054.68, 493947.57];
// de top in het AHN-DSM ligt erop) op maaiveld, AHN-DTM NAP +14,9 (ring van 6 tot 9 m: 14,8 tot 15,1, mediaan 15,0; 3D
// BAG 14,8). Lokale +X is de normaal van de oostelijke risaliet (RD 9,23 graden, gewogen gemiddelde van de randen van het
// BAG-pand); de plattegrond is in dat stelsel symmetrisch op 0,01 m: risalieten tot 4,535 m, 3,58 m breed (±1,79), het
// vierkant erachter tot 3,585 m, de schuine vlakken op x + y = 5,375.
// Maten: BAG (plattegrond), AHN-DSM 0,5 m (dakrand NAP +47,8 = 32,9 m, top NAP +49,73 = 34,8 m; 3D BAG h_dak_max 49,73,
// geen opstaande rand), luchtfoto (achtkant dak) en "Daarle Watertoren 3320.JPG" (Commons, 4 mei 2008 13:35 uur: zon in het
// zuiden, dus genomen vanuit het zuidwesten met de zuidelijke risaliet rechts en het schuine zuidwestvlak met de
// trapvensters in het midden; schaal circa 28 px/m uit de hoogte tot de dakrand).
import { hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [234054.68, 493947.57];
const DEG = 9.23;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 14.9;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints op 7 m van het hart (oost 57,65, noord 57,79, west
// 57,93, zuid 57,87), gemeten 2026-11-05; het PDOK-pand begint op 57,72.
const GROUND_ELLIPSOID = 57.65;
const S2 = Math.SQRT2;

// Plattegrond (BAG, gesymmetriseerd): risaliet tot R, halve breedte W; vierkant erachter tot Q; schuin vlak x + y = Q + W.
const R = 4.535;
const W = 1.79;
const Q = 3.585;
const plan = [];
for (let k = 0; k < 4; k++) {
  const rot = ([x, y]) => {
    const t = (Math.PI / 2) * k;
    return [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)];
  };
  plan.push(...[[Q, -W], [R, -W], [R, W], [Q, W]].map(rot));
}
// Achthoek met hoofdzijden op apothema m en schuine zijden op apothema d (punten op hoogte z).
const oct = (m, d, z) => {
  const c = d * S2 - m;
  const pts = [[m, -c], [m, c], [c, m], [-c, m], [-m, c], [-m, -c], [-c, -m], [c, -m]];
  return pts.map(([x, y]) => [x, y, z]);
};
const DIAG_OUT = (R + W) / S2; // schuine zijde van de omhullende achthoek (over de hoeken van de risalieten)
const DIAG_IN = (Q + W) / S2; // het teruggezette schuine vlak

// Hoogtes boven maaiveld.
const H = {
  soffit: 30.8, // onderzijde van de dakrand boven het schuine vlak (0,67 m uitkraging over 1,4 m: 26 graden uit het lood; bij 34 graden zet de export al schoren tussen de risalieten)
  capFoot: 32.1, // onderkant van de overstekende dakrand (0,1 m onder 45 graden)
  cap: 32.2,
  eave: 32.9, // dakrand (AHN-DSM NAP +47,8)
  apex: 34.8, // top van het dak (AHN-DSM NAP +49,73)
  band: [29.6, 30.5], // vensterband onder de dakrand (in het echt circa 0,6 m)
  door: [0, 2.3],
};

// Nis in het vlak met normaal +X (vlak op apothema f), breedte wd rond y, plafond onder 56 graden naar binnen oplopend. Het
// stuk buiten het vlak reikt niet verder dan het plafond boven z0 blijft, zodat ook een lage nis een plafond van 56 graden houdt.
const niche = (f, wd, z0, z1, depth, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 1.5 * depth, out = Math.min(1, (z1 - z0) / 1.5);
  return hull([
    [f - depth, y0, z0], [f + out, y0, z0], [f - depth, y1, z0], [f + out, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + out, y0, z1 - 1.5 * out], [f + out, y1, z1 - 1.5 * out],
  ]);
};

// ---------- schacht en dakrand ----------
const shaft = prism(plan, BASE, H.cap);
// De dakrand overspant de teruggezette hoeken: omhullende van het binnenste achtkant op 30,8 en het buitenste op 32,2.
const soffit = hull([...oct(Q, DIAG_IN, H.soffit), ...oct(R, DIAG_OUT, H.cap)]);
const cap = hull([...oct(R, DIAG_OUT, H.capFoot), ...oct(R + 0.1, DIAG_OUT + 0.1, H.cap), ...oct(R + 0.1, DIAG_OUT + 0.1, H.eave)]);
// Vlak achtkant piramidedak (circa 23 graden).
const roof = hull([...oct(R + 0.1, DIAG_OUT + 0.1, H.eave - 0.01), [0, 0, H.apex]]);

// ---------- openingen (in de schuine vlakken, normaal op 45 + 90k graden) ----------
const SW = 225;
const openings = union([
  // Vensterband van 2,0 m in elk schuin vlak, onder de dakrand.
  ...[45, 135, 225, 315].map((deg) => place(niche(DIAG_IN, 2.0, H.band[0], H.band[1], 0.3), { deg })),
  // Veertien trapvensters (louvres) van 0,4 × 1,0 m om de 1,6 m in het zuidwestvlak, de bovenste tot 24,8 m (foto: circa
  // 0,25 × 1,25 m om de 1,7 m, de bovenste tot circa 24,6 m; onderaan achter de struiken). Niet hoger dan 1,0 m: het
  // plafond loopt 0,45 m door en mag de volgende nis niet raken.
  ...Array.from({ length: 14 }, (_, k) => place(niche(DIAG_IN, 0.4, 3.0 + 1.6 * k, 4.0 + 1.6 * k, 0.3), { deg: SW })),
  // Deur onder de trapvensters (op de foto achter de struiken; plaats en maat geschat).
  place(niche(DIAG_IN, 1.2, H.door[0], H.door[1], 0.4), { deg: SW }),
]);

const building = union([shaft, soffit, cap, roof]).subtract(openings);

await writeLandmark({
  slug: "watertoren-daarle",
  base: BASE,
  nodes: [["building:betonnen-schacht-met-risalieten-dakrand-en-achtkant-dak", building]],
  catalog: {
    name: "Watertoren Daarle",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [0, 7], [-7, 0], [0, -7]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0163100000529763"],
    description:
      "Oorsprong op het hart van het BAG-pand op maaiveld (NAP +14,9 m), +X de normaal van de oostelijke risaliet (RD 9,23 graden). Betonnen schacht op een vierkant met vier risalieten van 3,58 m en diep teruggezette schuine hoeken; trapvensters en een deur in het zuidwestvlak, een vensterband onder de dakrand in elk schuin vlak; de achtkante dakrand overspant de hoeken tot 32,9 m, daarop een vlak achtkant piramidedak tot 34,8 m. Maten uit BAG, AHN, luchtfoto en één foto.",
    realWorld: {
      wikipediaHeightM: 33.7,
      reservoirM3: 145,
      built: 1934,
      designer: "Duecker & Co, Duisburg",
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 47.8,
      ahnTopNapM: 49.73,
      risalitAcrossM: R * 2,
      risalitWidthM: W * 2,
      cornerFaceWidthM: +((Q - W) * S2).toFixed(2),
      eaveM: H.eave,
      apexM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Daarle) (1934, Duecker & Co, 33,7 m, 145 m³)",
      "https://commons.wikimedia.org/wiki/File:Daarle_Watertoren_3320.JPG (vanuit het zuidwesten, 2008: risalieten, schuine hoekvlakken, trapvensters, vensterband en dakrand)",
      "PDOK BAG-pand 0163100000529763 en 3D BAG, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-05",
    ],
  },
});
