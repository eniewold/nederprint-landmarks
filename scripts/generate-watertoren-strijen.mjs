// Watertoren van Strijen (gemeente Hoeksche Waard). Gebouwd in 1914 naar ontwerp van Visser & Smit Hanab; 27 m hoog,
// reservoir van 150 m³ (Wikipedia). Geen waterfunctie meer: woning en bed & breakfast. Een ronde, licht verjongende
// bakstenen schacht met een rondboogdeur aan de straatkant draagt via drie uitgemetselde ringen en acht gebogen
// betonconsoles een iets wijder, uitlopend reservoir met een betonnen band, acht lisenen, smalle vensters, een tweede
// band en een borstwering met kleine vierkante openingen rond een plat (groen) dak. Rond de schacht hangt op 6,6 tot
// 10,35 m een achtkante woonuitbouw (latere toevoeging): een rondom glazen verdieping op een met leien beklede, iets naar
// binnen hellende plint, met een plat dak vol zonnepanelen; daaronder blijft de schacht met de deur vrij.
//
// Oorsprong op het middelpunt van een cirkelfit op de 26 hoekpunten van BAG-pand 0617100000720527 (straal 6,35 m, alle
// punten tussen 6,21 en 6,46 m): die voetafdruk is de achtkante uitbouw, de schacht staat er concentrisch in. Lokale
// X-as naar RD-oost; de achtkant heeft vlakke zijden naar het oosten, noorden, westen en zuiden (luchtfoto: rechte
// zuidzijde van 4,9 m). Maaiveld: AHN-DTM NAP -0,3 aan de zuid- en westkant (tuin aan het water); aan de straatkant
// (noordoost) ligt het maaiveld op NAP +1,45, dat talud laat het model aan het PDOK-terrein over.
// Hoogtes uit het AHN-DSM (0,5 m) en de 3D BAG (AHN5): dak van de uitbouw NAP +9,8, dak van de toren NAP +26,1, borstwering
// en nok NAP +26,9 (3D BAG b3_h_nok 26,91, maaiveld -0,32). Stralen van het reservoir uit de luchtfoto (8,3 m over de
// band) en het DSM (equivalente straal 4,27 m boven NAP +15). De hoogtes van ringen, consoles, banden en uitbouw komen
// uit "Strijen Watertoren 3628.JPG" (Commons, 2007) met een perspectieffit op drie bekende hoogtes (straat NAP +1,45,
// dak uitbouw +9,8, top +26,9).
import { Manifold, CrossSection, ccw, hull, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [97934.41, 416844.66];
const AXIS = [1, 0];
const GROUND_NAP = -0.3;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (west-zuidwest 43,500, zuidwest 43,529,
// zuid-zuidwest 44,083, west 43,915), gemeten 2026-11-07. Het PDOK-pand staat op 43,50 met de top op 70,06.
const GROUND_ELLIPSOID = 43.5;

// ---------- maten (meters boven het maaiveld NAP -0,3, stralen vanaf het hart) ----------
const R = {
  foot: 3.85, // schacht aan de voet
  shaftTop: 3.3, // schacht onder de uitgemetselde ringen
  ringStep: 0.12, // elke ring kraagt 0,12 m uit
  flareTop: 4.05, // reservoir boven de consoles, onder de band
  band: 4.2, // betonband
  wall: 4.0, // bovenste reservoirwand
  wallTop: 3.95,
  pilaster: 4.18,
  band2: 4.12, // band onder de borstwering
  parapet: 3.97,
  parapetIn: 2.77, // borstwering 1,2 m dik (na de nissen van 0,25 m blijft 0,95 m)
  annexR: 6.4, // omgeschreven straal van de achtkante uitbouw (BAG 6,21 tot 6,46)
  plinthBottom: 5.6, // apothema onderaan de leien plint
  plinthTop: 5.88, // apothema bovenaan de plint
  glass: 5.85, // apothema van de glazen verdieping
  fascia: 6.0, // apothema van de daklijst (hoeken 6,49 m)
};
const H = {
  soffit: 4.05, // ondervlak van de uitbouw raakt de schacht (45 graden)
  plinth: [6.6, 8.2], // leien plint van de uitbouw (foto: onderrand NAP +6,3)
  glass: [8.2, 9.7], // glazen verdieping
  fascia: 9.7,
  annexRoof: 10.1, // AHN NAP +9,8
  annexRim: 10.35, // daklijst (AHN max NAP +10,4)
  rings: 14.9, // begin van de uitgemetselde ringen (foto NAP +14,6)
  flare: 16.35, // bovenkant van de ringen, voet van de consoles (foto NAP +16,0)
  band: [19.0, 19.35], // betonband (foto NAP +18,7 tot +19,1)
  band2: [25.8, 26.1], // band onder de borstwering (foto NAP +25,5)
  roof: 26.4, // plat dak (AHN NAP +26,1)
  top: 27.2, // borstwering en lisenen (3D BAG nok NAP +26,91)
  hatch: 27.1, // dakopbouw (AHN NAP +26,8)
  door: [1.75, 3.45], // deur op straatniveau (NAP +1,45), rondboog als spitse nis
};

const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
const shaftR = (z) => R.foot + ((R.shaftTop - R.foot) * (z - 0)) / H.rings; // straal van de schacht op hoogte z
const COS = Math.cos(Math.PI / 8);
// Achthoek met apothema a op hoogte z, vlakke zijden naar 0, 45, ..., 315 graden.
const octPts = (a, z) => Array.from({ length: 8 }, (_, k) => { const t = ((2 * k + 1) * Math.PI) / 8; return [(a / COS) * Math.cos(t), (a / COS) * Math.sin(t), z]; });
const circlePts = (r, z, n = SEG) => Array.from({ length: n }, (_, k) => [r * Math.cos((2 * k * Math.PI) / n), r * Math.sin((2 * k * Math.PI) / n), z]);

// Rechthoekige nis in een gevel met normaal +X op afstand f, breedte w, van z0 tot z1, 0,3 m diep; het plafond loopt naar
// binnen onder 56 graden op, zodat er niets vrij hangt.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Nis met een spitse top van 50 graden (de rondboog van de deur), 0,35 m diep.
const pointedNiche = (f, w, z0, zs, depth = 0.35) => {
  const apex = zs + (w / 2) * Math.tan((50 * Math.PI) / 180);
  const pts = [];
  for (const x of [f - depth, f + 1.0]) pts.push([x, -w / 2, z0], [x, w / 2, z0], [x, -w / 2, zs], [x, w / 2, zs], [x, 0, apex]);
  return hull(pts);
};
const shaftNiche = (deg, w, z0, z1) => place(niche(shaftR((z0 + z1) / 2) - 0.02, w, z0, z1), { deg });

// ---------- schacht, ringen, consoles en reservoir als één omwentelingsprofiel ----------
const s = R.ringStep;
const z1 = H.rings + 0.45, z2 = H.rings + 0.9; // drie ringen van 0,45 m met een ondervlak van 45 graden
const body = solidRev([
  [shaftR(BASE), BASE],
  [R.shaftTop, H.rings],
  [R.shaftTop + s, H.rings + s],
  [R.shaftTop + s, z1],
  [R.shaftTop + 2 * s, z1 + s],
  [R.shaftTop + 2 * s, z2],
  [R.shaftTop + 3 * s, z2 + s],
  [R.shaftTop + 3 * s, H.flare],
  [R.flareTop - 0.06, H.band[0] - 0.9], // uitlopende reservoirbodem
  [R.flareTop, H.band[0] - 0.15],
  [R.band, H.band[0]], // band met een ondervlak van 45 graden
  [R.band, H.band[1]],
  [R.wall, H.band[1]],
  [R.wallTop, H.band2[0] - (R.band2 - R.wallTop)],
  [R.band2, H.band2[0]], // band onder de borstwering, 45 graden
  [R.band2, H.band2[1]],
  [R.parapet, H.band2[1]],
  [R.parapet, H.top],
  [R.parapetIn, H.top],
  [R.parapetIn, H.roof],
  [0.0001, H.roof],
]);

// Acht gebogen consoles onder de band (op 22,5 + k·45 graden, in lijn met de lisenen): 0,9 m breed, van de bovenste ring
// schuin naar de band.
const PIL = Array.from({ length: 8 }, (_, k) => 22.5 + 45 * k);
const consoleAt = (deg) => {
  const pts = [];
  for (const y of [-0.45, 0.45]) pts.push([R.shaftTop + 3 * s - 0.3, y, H.flare - 0.45], [R.shaftTop + 3 * s + 0.05, y, H.flare - 0.2], [R.shaftTop + 3 * s + 0.2, y, H.flare + 0.3], [R.band - 0.02, y, H.band[0]], [R.band - 0.5, y, H.band[0]]);
  return place(hull(pts), { deg });
};
const consoles = PIL.map(consoleAt);
// Acht lisenen op de bovenste reservoirwand, van de band tot de bovenkant van de borstwering.
const pilasters = PIL.map((deg) => place(box(R.wall - 0.6, -0.45, H.band[1], R.pilaster, 0.45, H.top), { deg }));

// ---------- achtkante uitbouw ----------
const annexSoffit = hull([...circlePts(shaftR(H.soffit), H.soffit, 48), ...octPts(R.plinthBottom, H.plinth[0])]);
const annexPlinth = hull([...octPts(R.plinthBottom, H.plinth[0]), ...octPts(R.plinthTop, H.plinth[1])]);
const annexGlass = hull([...octPts(R.glass, H.glass[0]), ...octPts(R.glass, H.glass[1])]);
const annexFascia = hull([...octPts(R.glass, H.fascia - 0.15), ...octPts(R.fascia, H.fascia), ...octPts(R.fascia, H.annexRim)]);
// Plat dak op 10,1 m met een daklijst van 0,9 m breed tot 10,35 m.
const annexRoofCut = hull([...octPts(R.fascia - 0.9, H.annexRoof), ...octPts(R.fascia - 0.9, H.annexRim + 1)]);
const annex = union([annexSoffit, annexPlinth, annexGlass, annexFascia]).subtract(annexRoofCut);

// ---------- dakopbouw ----------
// Dakluik/opbouw aan de noordkant van het dak (luchtfoto: lichte kasten; AHN NAP +26,8 op y 1 tot 2 m).
const hatch = box(-1.5, 1.0, H.roof - 0.1, 1.5, 2.2, H.hatch);

// ---------- vensters en deur als blinde nissen ----------
// Deur aan de straatkant (noordoost, 45 graden), rondboog als spitse nis van 50 graden.
const DOOR_DEG = 45;
const door = place(pointedNiche(shaftR(2.5) - 0.02, 1.1, H.door[0], H.door[1]), { deg: DOOR_DEG });
// Venster onder de uitbouw (zuidoost; foto) en een aangenomen venster aan de westkant.
const lowWindows = [-45, 180].map((d) => shaftNiche(d, 0.9, 2.4, 3.6));
// Twee kolommen van twee vensters boven de uitbouw (foto: zuidoost en noordoost, boven de deur); een derde kolom aan de
// westkant aangenomen.
const shaftWindows = [-45, 45, 200].flatMap((d) => [[10.7, 11.9], [12.6, 13.9]].map(([a, b]) => shaftNiche(d, 0.9, a, b)));
// Smalle vensters in het reservoir (foto: één per veld in om en om de velden), als nissen van 0,9 × 1,8 m.
const resWindows = [0, 90, 180, 270].map((d) => place(niche(R.wall - 0.01, 0.9, 21.6, 23.4), { deg: d }));
// Kleine vierkante openingen in de borstwering: twee per veld (16), nissen van 0,9 × 0,45 m, 0,2 m diep.
const parapetOpenings = PIL.flatMap((p) => [p + 15, p + 30].map((d) => place(niche(R.parapet, 0.9, 26.3, 26.75, 0.2), { deg: d })));
// Glazen verdieping: vier vensters per zijde van de uitbouw (foto: drie à vier ruiten per zijde).
const annexWindows = Array.from({ length: 8 }, (_, k) => k * 45).flatMap((d) => [-1.65, -0.55, 0.55, 1.65].map((dy) => place(niche(R.glass, 0.9, 8.35, 9.45, 0.25).translate([0, dy, 0]), { deg: d })));

const all = union([body, ...consoles, ...pilasters, annex, hatch]).subtract(union([door, ...lowWindows, ...shaftWindows, ...resWindows, ...parapetOpenings, ...annexWindows]));

await writeLandmark({
  slug: "watertoren-strijen",
  base: BASE,
  nodes: [["building:watertoren-schacht-achtkante-uitbouw-reservoir-en-borstwering", all]],
  catalog: {
    name: "Watertoren Strijen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-7, -3], [-5, -5], [-3, -7], [-7, 0]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0617100000720527"],
    description:
      "Oorsprong op het middelpunt van de BAG-voetafdruk (achtkante uitbouw, straal 6,35 m) op het maaiveld aan de tuinkant (NAP -0,3 m), X-as naar RD-oost, vlakke zijden van de achtkant naar oost, noord, west en zuid. Ronde bakstenen schacht die verjongt van 3,85 tot 3,3 m op 14,9 m met een rondboogdeur aan de straatkant (noordoost) en vensters als nissen; achtkante woonuitbouw van 6,6 tot 10,35 m met een ondervlak van 45 graden, leien plint, glazen verdieping en plat dak met daklijst; drie uitgemetselde ringen, acht consoles onder een uitlopende reservoirbodem, betonband van 8,4 m op 19,0 m, reservoirwand met acht lisenen en smalle vensters, band op 25,8 m en een borstwering met zestien openingen tot 27,2 m rond een plat dak met dakopbouw. Maten uit BAG, AHN, 3D BAG, luchtfoto en een foto.",
    realWorld: {
      built: 1914,
      architect: "Visser & Smit Hanab",
      publishedHeightM: 27,
      reservoirM3: 150,
      ahnGroundNapM: GROUND_NAP,
      ahnStreetNapM: 1.45,
      ahnAnnexRoofNapM: 9.8,
      ahnRoofNapM: 26.1,
      threeDBagRidgeNapM: 26.91,
      footRadiusM: R.foot,
      shaftTopRadiusM: R.shaftTop,
      bandDiameterM: 2 * R.band,
      annexCircumradiusM: R.annexR,
      annexM: [H.plinth[0], H.annexRim],
      bandM: H.band,
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Strijen) (1914, Visser & Smit Hanab, 27 m, 150 m³)",
      "Wikimedia Commons: Strijen Watertoren 3628.JPG (Willemjans, 2007)",
      "PDOK BAG-pand 0617100000720527, AHN DSM/DTM 0,5 m, luchtfoto (Actueel_orthoHR) en 3D BAG (AHN5), 2026-11-07",
    ],
  },
});
