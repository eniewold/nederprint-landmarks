// Watertoren van Laren aan de Rijksweg-West 27, gebouwd in 1931-1933 voor het Provinciaal Waterleidingbedrijf van
// Noord-Holland naar ontwerp van W. Hamdorff (rijksmonument 511249, onderdeel van complex 511248). Volgens het register
// circa 35,65 m hoog, expressionistisch, in paarsgrijze gesinterde baksteen rond een betonskelet; een zeer grote cilinder
// met een afgeplatte entreezijde naar het zuidoosten en een smalle rechthoekige traptoren aan de oostkant, plat
// afgedekt, zonder zichtbare scheiding tussen schacht en reservoir (dubbel reservoir van 2 x 500 m³, 11,60 m doorsnede).
// In de vlakke entreegevel een groot venster van glasbeton met daarboven een lichtstrook, onderaan een halfronde
// portiek met de ingang; in de noordkant de transformatoringang met de latei "1933" en reliëfs, met een smal venster
// erboven; in de traptoren zes gestapelde smalle lichtspleten op de zuidoost- en noordoostgevel en bovenin een balkon met
// een schuine luifel. Tegen de voet de garage (zadeldak, nok noordoost-zuidwest) en de bergplaats (twee lagen, plat dak).
//
// De toren ligt in één BAG-pand (0417100000012598) met de lange lage vleugel naar het noordwesten en de dienstwoning met
// zijn kruisende zadeldaken aan het eind daarvan; het model vervangt daarom het hele pand, anders blijft de
// PDOK-reconstructie van de vleugel en het huis door het model heen steken.
//
// Lokaal stelsel: oorsprong in het hart van de cilinder (cirkelfit op de rand van het AHN-DSM boven 31 m: straal 7,8 m)
// op maaiveld (AHN-DTM NAP +28,55, rondom 28,5 tot 28,75); +X langs de garage en de traptoren (BAG-randen, RD 24,6
// graden), +Y naar het noordwesten langs de lage vleugel; de vlakke entreegevel kijkt naar -Y (RD -65,4 graden). De
// dienstwoning staat 45 graden gedraaid; die is gebouwd in een eigen stelsel (hu, hv) langs zijn nokken (RD 69,6 graden),
// met dezelfde oorsprong als de AHN-analyse (RD 142670,555 474535,699), en daarna op zijn plek gedraaid.
// Maten: AHN-DSM 0,5 m (daken, nokken, de cilinder en de traptoren), BAG-contour (gevels op maaiveld), foto's van
// Wikimedia Commons voor de opstand (venster, portiek, spleten, balkon, luifel, lijst, garagedeuren, vensters van de
// bergplaats en de noordingang).
import { hull, union, prism, box, circle, place, writeLandmark } from "./efteling-kit.mjs";

const AHN_ORIGIN = [142670.555, 474535.699]; // stelsel van de AHN-analyse
const DEG = 24.6;
const C = Math.cos((DEG * Math.PI) / 180), S = Math.sin((DEG * Math.PI) / 180);
const HEART = [-1.0, -0.2]; // hart van de cilinder in het analysestelsel
const ORIGIN = [+(AHN_ORIGIN[0] + HEART[0] * C - HEART[1] * S).toFixed(2), +(AHN_ORIGIN[1] + HEART[0] * S + HEART[1] * C).toFixed(2)];
const AXIS = [+C.toFixed(5), +S.toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 28.55;
const GROUND_ELLIPSOID = 71.58; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 (71,58 tot 71,83)
const OFF = [-HEART[0], -HEART[1]]; // analysestelsel -> modelstelsel

// Daken als planvergelijking: houd alles onder z = a x + b y + c.
const under = (m, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return m.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Zadeldak met de nok evenwijdig aan X op y = yr (hoogte zr) en hellingen sN (kant +Y) en sS (kant -Y).
const saddleX = (m, yr, zr, sS, sN = sS) => under(under(m, 0, -sN, zr + sN * yr), 0, sS, zr - sS * yr);
// Idem met de nok evenwijdig aan Y op x = xr.
const saddleY = (m, xr, zr, sW, sE = sW) => under(under(m, -sE, 0, zr + sE * xr), sW, 0, zr - sW * xr);

// Nis in een gevel met normaal +X op x = f: profiel [[y, z], ...] (convex), diepte d. De bodem is vlak; het plafond
// loopt onder 56 graden naar binnen omhoog (en naar buiten omlaag), zodat de nis zonder steun print.
const niche = (f, d, profile) => {
  const z0 = Math.min(...profile.map(([, z]) => z));
  return hull(profile.flatMap(([y, z]) => (z - z0 < 1e-6
    ? [[f - d, y, z], [f + 0.3, y, z]]
    : [[f - d, y, z + 1.5 * d], [f, y, z], [f + 0.3, y, z - 0.45]])));
};
const rectProfile = (y0, y1, z0, z1) => [[y0, z0], [y1, z0], [y1, z1], [y0, z1]];
// Rondboog die boven 45 graden overgaat in een spitse top (plafond nergens vlakker dan 45 graden).
const archProfile = (yc, w, z0, spring) => {
  const r = w / 2, pts = [[yc - r, z0], [yc + r, z0]];
  for (let k = 0; k <= 6; k++) {
    const t = (k / 6) * (Math.PI / 4);
    pts.push([yc + r * Math.cos(t), spring + r * Math.sin(t)], [yc - r * Math.cos(t), spring + r * Math.sin(t)]);
  }
  pts.push([yc, spring + r * Math.SQRT2]);
  return pts;
};
// Gevel met normaal -Y op y = -f: bouw de nis met normaal +X en draai -90 graden (x -> -y, y -> x).
const southNiche = (f, d, profile) => place(niche(f, d, profile), { deg: -90 });
// Lijst of plaat tegen een gevel met normaal +X op x = f: van y0 tot y1, bovenkant z1, uitsteek p, onderkant onder 45
// graden tot dikte t aan de voorkant.
const ledgeX = (f, y0, y1, z1, p, t) => hull([
  [f - 0.3, y0, z1 - t - p - 0.35], [f - 0.3, y1, z1 - t - p - 0.35], [f + p, y0, z1 - t], [f + p, y1, z1 - t],
  [f - 0.3, y0, z1], [f - 0.3, y1, z1], [f + p, y0, z1], [f + p, y1, z1],
]);

// ---------- maten van de toren (modelstelsel, hoogtes boven maaiveld) ----------
const R = 7.8; // cilinder (AHN-rand 7,55 tot celrand + 0,25)
const H = {
  roof: 33.0, // plat dak binnen de borstwering (AHN NAP +61,55)
  parapet: 33.95, // borstwering (AHN NAP +62,5)
  band: [32.6, 33.0], // lijst onder de borstwering (foto's: een smalle uitstekende band circa 1 m onder de top)
  stair: 35.6, // traptoren (AHN NAP +64,15; Wikipedia 35,65 m)
};
const FRONT = -7.5; // vlakke entreegevel (BAG v -7,67; AHN-wandcellen tot -7,7)
const FRONT_W = -4.05; // westeinde, tegen de bergplaats
const STAIR = { x0: 4.9, x1: 8.1, y0: -10.2, y1: -2.4 }; // traptoren (AHN 35,6 m-vlak)

// Cilinder met de vlakke entreezijde.
const shell = union([prism(circle([0, 0], R, 128), BASE, H.parapet), box(FRONT_W, FRONT, BASE, STAIR.x0, 0, H.parapet)]);
// Plat dak binnen een borstwering van 0,6 m.
const dish = union([prism(circle([0, 0], R - 0.6, 128), H.roof, H.parapet + 1), box(FRONT_W + 0.6, FRONT + 0.6, H.roof, STAIR.x0 - 0.3, 0, H.parapet + 1)]);
// Lijst rondom: 0,25 m uit de gevel, onderkant onder 45 graden.
const bandRing = hull([
  ...circle([0, 0], R - 0.05, 128).map(([x, y]) => [x, y, H.band[0] - 0.3]),
  ...circle([0, 0], R + 0.25, 128).map(([x, y]) => [x, y, H.band[0]]),
  ...circle([0, 0], R + 0.25, 128).map(([x, y]) => [x, y, H.band[1]]),
]).trimByPlane([0, 1, 0], FRONT - 0.25);
const bandFront = place(ledgeX(-FRONT, FRONT_W - 0.25, STAIR.x0, H.band[1], 0.25, H.band[1] - H.band[0]), { deg: -90 });
const stairTower = box(STAIR.x0, STAIR.y0, BASE, STAIR.x1, STAIR.y1, H.stair);

// Balkon en luifel bovenin de noordoostgevel van de traptoren (foto's): balkon 2,0 m breed, 1,5 m diep, vloer 30,9 m,
// dichte borstwering tot 32,3 m (in het echt een hekwerk), op een console onder 45 graden; schuine luifel erboven.
const BALC = { y: -4.9, w: 2.0, p: 1.5, floor: 30.9, top: 32.3 };
const balcony = hull([
  [STAIR.x1 - 0.1, BALC.y - BALC.w / 2, BALC.floor - BALC.p - 0.2], [STAIR.x1 - 0.1, BALC.y + BALC.w / 2, BALC.floor - BALC.p - 0.2],
  [STAIR.x1 + BALC.p, BALC.y - BALC.w / 2, BALC.floor], [STAIR.x1 + BALC.p, BALC.y + BALC.w / 2, BALC.floor],
  [STAIR.x1 - 0.1, BALC.y - BALC.w / 2, BALC.top], [STAIR.x1 - 0.1, BALC.y + BALC.w / 2, BALC.top],
  [STAIR.x1 + BALC.p, BALC.y - BALC.w / 2, BALC.top], [STAIR.x1 + BALC.p, BALC.y + BALC.w / 2, BALC.top],
]);
const canopy = hull([
  [STAIR.x1 - 0.1, BALC.y - 1.1, 32.8], [STAIR.x1 - 0.1, BALC.y + 1.1, 32.8],
  [STAIR.x1 + 1.5, BALC.y - 1.1, 34.6], [STAIR.x1 + 1.5, BALC.y + 1.1, 34.6],
  [STAIR.x1 - 0.1, BALC.y - 1.1, 35.5], [STAIR.x1 - 0.1, BALC.y + 1.1, 35.5],
  [STAIR.x1 + 1.5, BALC.y - 1.1, 35.5], [STAIR.x1 + 1.5, BALC.y + 1.1, 35.5],
]);

// Noordingang (transformator) op 65,4 graden (RD-noord): dubbele deur, latei "1933", smal venster met een kap erboven.
const NORTH_DEG = 90 - DEG;
const northDoor = place(union([
  niche(R, 0.3, rectProfile(-0.95, 0.95, 0, 2.4)),
  niche(R, 0.3, rectProfile(-0.3, 0.3, 3.4, 7.0)),
]), { deg: NORTH_DEG });
const northLintels = place(union([
  ledgeX(R - 0.1, -1.4, 1.4, 3.25, 0.3, 0.5), // latei, rust boven de deur
  ledgeX(R - 0.1, -1.1, 1.1, 8.05, 0.3, 0.7), // kap boven het smalle venster
]), { deg: NORTH_DEG });

// Entreegevel: venster van glasbeton (3,8 x 14 m), lichtstrook (8 ruitjes, hier één nis van 2,8 x 0,9 m), portiek als
// rondboognis van 2,7 m, alles op de as van de gevel (x 0,4).
const FX = 0.4;
const frontOpenings = union([
  southNiche(-FRONT, 0.35, rectProfile(FX - 1.9, FX + 1.9, 4.9, 18.9)),
  southNiche(-FRONT, 0.35, rectProfile(FX - 1.4, FX + 1.4, 21.4, 22.3)),
  southNiche(-FRONT, 0.6, archProfile(FX, 2.7, 0, 1.6)),
]);
const frontSill = place(ledgeX(-FRONT - 0.05, FX - 2.2, FX + 2.2, 4.9, 0.2, 0.3), { deg: -90 });
// Traptoren: zes lichtspleten (in het echt circa 0,3 m, hier 0,6 m) op de noordoost- en de zuidoostgevel.
const SLITS = [8.6, 12.4, 16.2, 20.0, 23.8, 27.6];
const slitsNE = union(SLITS.map((z) => niche(STAIR.x1, 0.3, rectProfile(-5.4 - 0.3, -5.4 + 0.3, z - 0.7, z + 0.7))));
const slitsSE = union(SLITS.map((z) => southNiche(-STAIR.y0, 0.3, rectProfile(6.5 - 0.3, 6.5 + 0.3, z - 0.7, z + 0.7))));

const tower = union([shell.subtract(dish), bandRing, bandFront, stairTower, balcony, canopy, northLintels, frontSill])
  .subtract(union([frontOpenings, northDoor, slitsNE, slitsSE]));

// ---------- garage (zadeldak, nok langs X) ----------
// BAG en AHN: x 5,0 tot 14,2, y -13,0 tot -4,8; nok op y -8,9 en 7,65 m, goten 2,8 m (helling 50 graden); de westkop zit
// tegen de traptoren, de noordoostgevel is een topgevel met drie hoge vensters.
const GAR = { x0: 5.0, x1: 14.2, y0: -13.0, y1: -4.8, yr: -8.9, zr: 7.65, eave: 2.8 };
const garSlope = (GAR.zr - GAR.eave) / ((GAR.y1 - GAR.y0) / 2);
const garage = saddleX(box(GAR.x0, GAR.y0, BASE, GAR.x1, GAR.y1, 20), GAR.yr, GAR.zr, garSlope);
const garageOpenings = union([
  southNiche(-GAR.y0, 0.35, rectProfile(9.2 - 1.15, 9.2 + 1.15, 0, 2.4)),
  southNiche(-GAR.y0, 0.35, rectProfile(12.3 - 1.15, 12.3 + 1.15, 0, 2.4)),
  ...[-11.4, -8.9, -6.4].map((y) => niche(GAR.x1, 0.3, rectProfile(y - 0.45, y + 0.45, 0.5, 2.4))),
  ...[-9.6, -8.2].map((y) => niche(GAR.x1, 0.3, rectProfile(y - 0.3, y + 0.3, 4.3, 5.3))),
]);

// ---------- bergplaats (twee lagen, plat dak 6,15 m) ----------
const STORE = { x0: -9.55, x1: FRONT_W, y0: -10.4, y1: -3.8, top: 6.15 };
const store = box(STORE.x0, STORE.y0, BASE, STORE.x1, STORE.y1, STORE.top);
const storeOpenings = union([
  southNiche(-STORE.y0, 0.3, rectProfile(-6.8 - 1.75, -6.8 + 1.75, 1.15, 2.35)),
  southNiche(-STORE.y0, 0.3, rectProfile(-6.8 - 1.75, -6.8 + 1.75, 4.75, 5.65)),
  niche(STORE.x1, 0.3, rectProfile(-9.3, -8.1, 1.0, 2.2)),
  niche(STORE.x1, 0.3, rectProfile(-9.2, -8.2, 4.2, 5.1)),
]);

// ---------- lage ring tegen de westkant (BAG-boog r 10,82, AHN 1,5 m) ----------
const RING = { c: [1.21, -0.98], r: 10.82, top: 1.5 };
const ring = prism(circle(RING.c, RING.r, 96), BASE, RING.top).intersect(box(STORE.x0, STORE.y1 - 0.2, BASE - 1, -2.5, 8.3, RING.top + 1));

// ---------- lage vleugel naar het noordwesten ----------
// BAG x -5,75 tot 1,3; AHN: westdeel plat op 2,2 m, oostdeel zadeldak met de nok op x 0,2 en 4,55 m (hellingen 0,85 en
// 0,8), goot aan de oostkant 3,65 m met een strook vensters onder de goot (foto RCE).
const WING = { x0: -5.75, x1: 1.3, y0: 6.0, y1: 24.9, flat: 2.2, xs: -1.7, xr: 0.2, zr: 4.55 };
const wing = union([
  box(WING.x0, WING.y0, BASE, WING.xs + 0.01, WING.y1, WING.flat),
  saddleY(box(WING.xs, WING.y0, BASE, WING.x1, WING.y1, 20), WING.xr, WING.zr, 0.85, 0.8),
]);
const wingOpenings = union(Array.from({ length: 8 }, (_, k) => niche(WING.x1, 0.3, rectProfile(9.0 + 2.0 * k - 0.5, 9.0 + 2.0 * k + 0.5, 2.0, 2.9))));

// ---------- dienstwoning (stelsel hu, hv langs de nokken; RD 69,6 graden) ----------
// Uit het AHN-DSM per vleugel gemeten; alle dakvlakken als planvergelijking.
// A: lange vleugel langs hv met de nok op hu 30,2 (8,1 m; zuidoostkop tot hv 23,5 hoger, 8,9 m), hellingen 50 graden,
//    aan de oostkant onder 32,3 m een flauwer vlak (25 graden) naar de goot; topgevel op hv 42,15 met schoorsteen.
// X: dwars zadeldak langs hu met de nok op hv 23,65 (8,2 m), 45 graden; aan de oostkant alleen het zuidvlak (51
//    graden) tot een hoge dakopbouw op 9,86 m (hu 29,5 tot 35,8, hv 23,5 tot 24,8).
// C: lage dwarsvleugel naar de vleugel van de toren, nok op hv 21,0 (5,6 m), 45 graden.
// N: lage aanbouw aan de noordoostkant (lessenaarsdak van 6,0 naar 3,1 m).
const T50 = Math.tan((50 * Math.PI) / 180);
const A2 = saddleY(box(25.45, 18.4, BASE, 35.1, 23.6, 20), 30.3, 8.9, T50);
const A1 = union([
  saddleY(box(26.0, 23.4, BASE, 34.4, 42.15, 20), 30.2, 8.1, T50),
  under(box(32.2, 23.4, BASE, 34.4, 42.15, 20), -0.47, 0, 5.6 + 0.47 * 32.3), // flauwer vlak aan de oostkant
]);
const XW = saddleX(box(23.3, 18.4, BASE, 30.3, 28.9, 20), 23.65, 8.2, 1.0);
const XE = under(box(29.5, 18.4, BASE, 35.5, 23.6, 20), 0, 1.25, 2.9 - 1.25 * 18.4);
const ridgeBlock = box(29.5, 23.5, BASE, 35.8, 24.8, 9.86);
const CW = saddleX(box(14.4, 18.4, BASE, 23.4, 23.6, 20), 21.0, 5.6, 1.0);
const NE = under(box(33.0, 36.4, BASE, 37.3, 42.15, 20), -0.67, 0, 6.0 + 0.67 * 33.0);
const chimney = box(30.8, 41.1, 5.0, 32.3, 42.15, 9.4);
const house = place(union([A2, A1, XW, XE, ridgeBlock, CW, NE, chimney]), { deg: 45, at: [OFF[0], OFF[1], 0] });

const building = union([
  tower,
  garage.subtract(garageOpenings),
  store.subtract(storeOpenings),
  ring,
  wing.subtract(wingOpenings),
  house,
]);

await writeLandmark({
  slug: "watertoren-laren",
  base: BASE,
  nodes: [["building:watertoren-met-traptoren-garage-vleugel-en-dienstwoning", building]],
  catalog: {
    name: "Watertoren Laren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, -10.5], [10, 4], [16, -9], [4, 10], [-12, 0], [-7, -12.5], [-9, 15]],
    // Ellipsoïdisch: de PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0417100000012598"],
    description:
      "Oorsprong in het hart van de cilinder op maaiveld (NAP +28,55 m), +X langs garage en traptoren (RD 24,6 graden), vlakke entreegevel naar -Y. Cilinder van 15,6 m met afgeplatte entreezijde tot 33,95 m (plat dak binnen een borstwering, lijst eronder), traptoren tot 35,6 m met zes lichtspleten per gevel, balkon en luifel; venster van glasbeton, lichtstrook en portiek in de entreegevel, noordingang met latei; garage met zadeldak, bergplaats met plat dak, lage ring en vleugel naar de dienstwoning met kruisende zadeldaken (hetzelfde BAG-pand). Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 35.65,
      reservoirsM3: [500, 500],
      reservoirDiameterM: 11.6,
      built: "1931-1933",
      architect: "W. Hamdorff (PWN)",
      monument: 511249,
      ahnGroundNapM: GROUND_NAP,
      cylinderDiameterM: R * 2,
      cylinderTopM: H.parapet,
      roofM: H.roof,
      stairTowerTopM: H.stair,
      garageRidgeM: GAR.zr,
      storeRoofM: STORE.top,
      wingRidgeM: WING.zr,
      houseRidgesM: [8.1, 8.9, 8.2, 5.6],
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/511249 (1931-1933, Hamdorff, 35,65 m, cilinder met afgeplatte entreezijde, traptoren, garage en bergplaats)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Laren)",
      "https://commons.wikimedia.org/wiki/File:Laren_Watertoren_8452.JPG (entreegevel met venster, portiek, bergplaats en garage)",
      "https://commons.wikimedia.org/wiki/File:Laren_Watertoren_8454.JPG, File:WaterTowerLaren2017-4.jpg en File:Overzicht_watertoren_met_aangebouwde_traptoren_gezien_vanaf_de_weg_-_Laren_-_20408146_-_RCE.jpg (traptoren met spleten, balkon en luifel, lijst, noordingang, garage, vleugel)",
      "https://commons.wikimedia.org/wiki/File:WaterTowerLaren2017-3.jpg, File:WaterTowerLaren2017-1.jpg en File:WaterTowerLaren2017-2.jpg (noordingang met latei 1933 en reliëfs)",
      "PDOK BAG-pand 0417100000012598, 3D BAG, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});
