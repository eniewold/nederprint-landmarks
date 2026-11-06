// Watertoren van Meerkerk aan de Burgemeester Sloblaan 18. Gebouwd in 1935-1936 voor de Drinkwaterleiding De
// Alblasserwaard en De Vijfheerenlanden naar ontwerp van het Technisch Advies Bureau van de VNG (Amersfoort); 59,72 m
// hoog, reservoir van 560 m³, rijksmonument 515486, sinds 1981 wit geschilderd. Een van de eerste watertorens in beton:
// een achtkante schacht van glijbekist beton met acht wandvlakken tussen sterk uitstekende hoeklisenen, op een met baksteen
// beklede onderbouw met de ingang (trap, betonnen luifel) en in de andere vlakken smalle drielichten. Per travee drie smalle
// vensters boven elkaar. Daarboven een ronde reservoirmantel met vier keer drie vensters, een trapsgewijs uitkragende rand
// met een rondlopende omloop en een betonnen kegeldak. Aan de noordwestzijde een halfrond trappenhuis over de volle hoogte,
// dat boven de omloop eindigt in een torentje met een deur en een kegeldakje (Rijksmonumentenregister, foto's).
//
// Oorsprong op het hart van de regelmatige achthoek van BAG-pand 0707100000372807 (gemiddelde van de acht hoeken,
// apothema 5,66 tot 5,82, gemiddeld 5,74 m); de top van het kegeldak in het AHN-DSM 0,5 m ligt er 0,2 m naast. Lokale
// X-as 2,3 graden linksom van RD-oost, loodrecht op het oostvlak van de achthoek; de vlakken staan dan op k maal 45 graden,
// de hoeken op 22,5 + k maal 45. Hoeken hieronder in graden linksom vanaf de lokale X-as. Maaiveld AHN-DTM NAP -0,5.
// Maten: kegel uit het AHN-DSM (top NAP +59,13, helling 1,77, dus 60,5 graden); omloop, reservoir, schacht en trappenhuis
// uit de foto's "Watertoren Meerkerk 2021.jpg" (vanaf het noordoosten, telelens) en "Watertoren Meerkerk Trappehuis.JPG"
// (Commons), geschaald op de BAG-achthoek (12,4 m over de hoeken) en de kegel uit het AHN; de onderbouw en de ingang uit
// "Watertoren Meerkerk Entree.JPG", geschaald op de deur. Omloop 15,8 m doorsnede ook op de luchtfoto.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [127932.05, 436833.73];
const AXIS_DEG = 2.3;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = -0.5;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 44,05, west 43,70, noord 43,91, zuid
// 42,99), gemeten 2026-11-06. Het PDOK-pand staat op 42,93; het PDOK-terrein rond de toren is hobbelig (42,7 tot 44,05).
const GROUND_ELLIPSOID = 42.99;

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const octagon = (apothem) => Array.from({ length: 8 }, (_, k) => polar(apothem / Math.cos(rad(22.5)), 22.5 + 45 * k));
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));

// ---------- hoogtes boven het maaiveld (NAP -0,5) ----------
const H = {
  brick: 5.2, // bakstenen onderbouw (foto entree: 5,2 m boven het pad)
  wash: 5.6, // betonnen afdekking, schuin naar de wandvlakken
  reservoir: 34.8, // onderkant van het reservoir, waar de lisenen ophouden
  reservoirChamfer: 33.55, // het reservoir kraagt onder 50 graden uit over de wandvlakken
  reservoirTop: 44.2, // bovenkant van de reservoirmantel, begin van de uitkragende rand
  rimUnder: 46.17, // onderkant van de rand (50 graden vanaf de mantel)
  deck: 47.85, // omloop (AHN NAP +46,3 à +47 op 6,5 tot 8 m; foto: 1,7 m onder de voet van de kegel)
  coneRing: 49.1, // opstand rond de voet van de kegel
  coneFoot: 49.9, // kegel op 5,5 m van het hart (AHN NAP +59,13 - 1,77 x 5,5)
  apex: 59.65, // top (AHN NAP +59,13; register 59,72 m)
  stairTop: 46.6, // trappenhuis loopt door tot in de rand
  turretWall: 49.9, // torentje op de omloop met deur
  turretApex: 52.15, // kegeldakje, 60 graden zoals het grote dak
};
const R = {
  brick: 5.74, // BAG: apothema van de achthoek
  panel: 5.3, // wandvlakken tussen de lisenen, 0,44 m terug
  lisene: 6.05, // voorvlak van de hoeklisenen (binnen de bakstenen achthoek)
  liseneWidth: 1.2,
  reservoirChamfer: 5.2,
  reservoir: 6.25, // foto: iets ruimer dan de lisenen
  rim: 7.9, // omloop, 15,8 m doorsnede (foto's en luchtfoto)
  coneRing: 5.75,
  coneFoot: 5.5,
};
const STAIR = { deg: 135, centre: 5.92, r: 1.65 }; // BAG: tot 7,57 m van het hart; foto: 3,3 m breed
const TURRET = { deg: 135, centre: 6.1, r: 1.3 };
const DOOR_DEG = 45; // ingang in het noordoostvlak, naar de Burgemeester Sloblaan

// ---------- toren ----------
const brick = prism(octagon(R.brick), BASE, H.brick);
const wash = hull([...octagon(R.brick).map(([x, y]) => [x, y, H.brick]), ...octagon(R.panel).map(([x, y]) => [x, y, H.wash])]);
const core = prism(octagon(R.panel), BASE, H.reservoir + 0.01);
// Hoeklisenen: blokken van 1,2 m breed in de richting van elke hoek, binnen de bakstenen achthoek gehouden.
const lisenes = union(around(prism([[4.5, -R.liseneWidth / 2], [R.lisene, -R.liseneWidth / 2], [R.lisene, R.liseneWidth / 2], [4.5, R.liseneWidth / 2]], BASE, H.reservoir + 0.01), Array.from({ length: 8 }, (_, k) => 22.5 + 45 * k)))
  .intersect(prism(octagon(R.brick), BASE - 1, H.reservoir + 1));
// Reservoir, uitkragende rand, omloop, opstand en kegeldak in één omwentelingsprofiel.
const top = rev([
  [0, H.reservoirChamfer], [R.reservoirChamfer, H.reservoirChamfer], [R.reservoir, H.reservoir], [R.reservoir, H.reservoirTop],
  [R.rim, H.rimUnder], [R.rim, H.deck], [R.coneRing, H.deck], [R.coneRing, H.coneRing], [R.coneFoot, H.coneFoot], [0, H.apex],
]);
// Trappenhuis: halve cilinder over de volle hoogte aan de noordwestzijde; boven de omloop een torentje met kegeldakje.
const stair = Manifold.cylinder(H.stairTop - BASE, STAIR.r, STAIR.r, 48).translate([...polar(STAIR.centre, STAIR.deg), BASE]);
const turret = union([
  Manifold.cylinder(H.turretWall - 47, TURRET.r, TURRET.r, 48).translate([...polar(TURRET.centre, TURRET.deg), 47]),
  Manifold.cylinder(H.turretApex - H.turretWall, TURRET.r, 0, 48).translate([...polar(TURRET.centre, TURRET.deg), H.turretWall]),
]);
// Ingang: trap van twee treden tot de dorpel op 1,0 m en een betonnen luifel boven de deur (3,05 tot 4,0 m, 0,6 m diep,
// onderkant 50 graden).
const entrance = place(union([
  prism([[5.6, -1.7], [R.brick + 0.9, -1.7], [R.brick + 0.9, 1.7], [5.6, 1.7]], BASE, 1.0),
  prism([[5.6, -1.7], [R.brick + 1.8, -1.7], [R.brick + 1.8, 1.7], [5.6, 1.7]], BASE, 0.5),
  hull([-2, 2].flatMap((y) => [[5.6, y, 3.05], [R.brick, y, 3.05], [R.brick + 0.6, y, 3.77], [R.brick + 0.6, y, 4.0], [5.6, y, 4.0]])),
]), { deg: DOOR_DEG });

// Vensters en deur als blinde nissen:
// - de deur (1,7 m breed, 1,0 tot 3,0 m) in het noordoostvlak;
// - samengestelde drielichten in de onderbouw als één nis van 1,3 m breed, 1,45 tot 3,35 m, in de zes andere vlakken;
// - per travee drie vensters boven elkaar (foto's: circa 10 m uit elkaar, de bovenste vlak onder het reservoir), niet in
//   het vlak van het trappenhuis;
// - vier keer drie vensters in de reservoirmantel, op de vlakrichtingen 0, 90, 180 en 270 graden;
// - traplichten in het trappenhuis, om de 3,35 m.
// De vensters zijn in het echt 0,3 à 0,4 m breed; als nis 0,9 m breed zodat ze op 1:1000 te zien zijn.
const shaftLevels = [[12.6, 14.4], [22.6, 24.4], [31.2, 32.8]];
const reservoirLevels = [[36.5, 38.2], [39.6, 41.3], [42.4, 43.6]];
const windows = union([
  ...around(niche(R.brick, 1.7, 1.0, 3.0), [DOOR_DEG]),
  ...around(niche(R.brick, 1.3, 1.45, 3.35), [0, 90, 180, 225, 270, 315]),
  ...shaftLevels.flatMap(([z0, z1]) => around(niche(R.panel, 0.9, z0, z1), [0, 45, 90, 180, 225, 270, 315])),
  ...reservoirLevels.flatMap(([z0, z1]) => around(niche(R.reservoir, 0.9, z0, z1), [0, 90, 180, 270])),
  ...Array.from({ length: 12 }, (_, k) => 43.0 - 3.35 * k).map((zc) => place(niche(STAIR.centre + STAIR.r, 0.9, zc - 0.65, zc + 0.65), { deg: STAIR.deg })),
  place(niche(TURRET.centre + TURRET.r, 0.9, H.deck, H.turretWall - 0.5), { deg: TURRET.deg }),
]);

const all = union([brick, wash, core, lisenes, top, stair, turret, entrance]).subtract(windows);

await writeLandmark({
  slug: "watertoren-meerkerk",
  base: BASE,
  nodes: [["building:watertoren-schacht-reservoir-omloop-dak-en-trappenhuis", all]],
  catalog: {
    name: "Watertoren Meerkerk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[10, 0], [-10, 0], [0, 10], [0, -10]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0707100000372807"],
    description:
      "Oorsprong op het hart van de achthoekige BAG-voetafdruk (apothema 5,74 m) op het maaiveld (NAP -0,5 m), X-as 2,3 graden linksom van RD-oost loodrecht op het oostvlak. Bakstenen onderbouw tot 5,2 m met ingang (trap, luifel) in het noordoostvlak en drielichten; achtkante betonnen schacht met hoeklisenen en drie vensters per travee tot 34,8 m; ronde reservoirmantel met vier keer drie vensters tot 44,2 m; uitkragende rand met omloop op 47,85 m (15,8 m doorsnede); kegeldak van 60 graden tot 59,65 m; halfrond trappenhuis aan de noordwestzijde met torentje en kegeldakje op de omloop. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1936,
      architect: "Technisch Advies Bureau van de VNG (Amersfoort)",
      rijksmonument: 515486,
      publishedHeightM: 59.72,
      reservoirM3: 560,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 59.13,
      ahnConeSlope: 1.77,
      octagonApothemM: R.brick,
      brickBaseM: H.brick,
      reservoirBottomM: H.reservoir,
      reservoirTopM: H.reservoirTop,
      reservoirDiameterM: R.reservoir * 2,
      deckM: H.deck,
      deckDiameterM: R.rim * 2,
      coneFootM: H.coneFoot,
      topM: H.apex,
      stairDegrees: STAIR.deg,
      entranceDegrees: DOOR_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Meerkerk) (1936, Technisch Advies Bureau Nederlandse Gemeenten, 59,7 m, 560 m³, een van de eerste betonnen watertorens)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/515486 (achthoekig, glijbekist beton, acht wandvlakken tussen hoeklisenen, bakstenen onderbouw met ingang, trap en luifel en drielichten, drie vensters per travee, ronde reservoirmantel met vier keer drie vensters, kegeldak, uitkragende rand met omloop, halfrond trappenhuis aan de noordwestzijde met bovenbouw en deur naar de omloop)",
      "https://commons.wikimedia.org/wiki/Category:Water_tower_of_Meerkerk (Watertoren Meerkerk 2021.jpg vanaf het noordoosten, Watertoren Meerkerk Trappehuis.JPG vanaf het noordwesten, Watertoren Meerkerk Entree.JPG, Watertoren Meerkerk 1.jpg en 2.jpg)",
      "PDOK BAG-pand 0707100000372807, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});
