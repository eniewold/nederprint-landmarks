// Watertoren van Mijdrecht aan de Industrieweg 6, gebouwd in 1937 naar ontwerp van ingenieursbureau MABEG voor de
// Drinkwatervoorziening Noord-West-Utrecht, in 2005 buiten gebruik gesteld; rijksmonument 514700. Volgens Wikipedia en
// het register 41 m hoog met een betonnen vlakbodemreservoir van 500 m³ (circa 8 x 8 x 8 m) bovenin. Een vierkante,
// rechte bakstenen schacht in de stijl van de Delftse School met een steil leien zadeldak als een kerktoren (nok
// noord-zuid, topgevels op noord en zuid), op beide topgevels halverwege een rondboogdeur met een halfrond balkon en
// bovenin twee kleine vensters; onder de goten een rij van vier kleine vensters, in de oostgevel een kolom van drie
// smalle hoge vensters op de verdieping onder het reservoir. Tegen de oostgevel een portaal met een leien lessenaardak
// en een dubbele rondboogdeur, met links (zuidelijk) ervan een verjongende steunbeer.
//
// Oorsprong op het hart van de rechthoekige schacht in BAG-pand 0736100000006955 (9,32 x 9,47 m) op het maaiveld: AHN-DTM
// NAP -5,05 (ring van 7 tot 15 m: -5,4 tot -4,7; 3D BAG -5,13). +X wijst naar RD-richting 0,2 graden (evenwijdig aan de
// BAG-gevels), +Y naar het noorden.
// Maten: schacht, portaal en steunbeer uit de BAG; het zadeldak uit het AHN-DSM 0,5 m: twee vlakken van 53,5 graden
// (helling 1,35, gemeten van 0,5 tot 4 m uit de nok, binnen 0,05 m), nok NAP +36,27 (3D BAG 36,32), goot net buiten de
// gevel (DSM-rand op circa 4,8 m). Vensters, balkons, portaal en steunbeer uit de foto's "Mijdrecht Watertoren 7622.JPG"
// (zuidoost), "Overzicht toren in zijn omgeving - Mijdrecht - 20530367 - RCE.jpg" (zuidoost, 28 px/m op de oostgevel),
// "Westgevel met ingang - Mijdrecht - 20530361 - RCE.jpg" (portaal en steunbeer, noordoost), "Onderste gedeelte van de
// watertoren - Mijdrecht - 20530360 - RCE.jpg" (noordgevel) en "Mijdrecht, Industrieweg 6, watertoren 1937 - img5749.jpg"
// (noordgevel vanaf de Industrieweg), geschaald op de BAG-breedte en de goot uit het AHN.
import { hull, union, box, place, prism, Manifold, CrossSection, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [119699.28, 468823.02];
const AXIS = [1, 0.0035];
const GROUND_NAP = -5.05;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: zuid 38,70, noord 38,73,
// west 38,79, oost 38,68. Het PDOK-pand staat op 38,46.
const GROUND_ELLIPSOID = 38.68;

// ---------- maten in het lokale stelsel (m, boven het maaiveld NAP -5,05) ----------
const W = { x: 4.66, y: 4.735 }; // halve breedte van de schacht (BAG: 9,32 x 9,47 m)
const ROOF = {
  ridge: 41.32, // nok NAP +36,27
  slope: 1.35, // dakvlakken van 53,5 graden (AHN-DSM)
  eaveOut: 4.96, // goot 0,3 m buiten de gevel
  fascia: [34.32, 34.62], // gootlijst: onderkant en bovenkant aan de buitenzijde
};
const BUTTRESS = { y: [-4.15, -2.9], front: 5.82, top: 30.5 }; // steunbeer: 1,16 m uit de gevel aan de voet, verloopt tot 30,5 m
const PORCH = { y: [-2.9, 2.55], front: 5.82, eave: 2.8, pitch: 60 }; // portaal tegen de oostgevel (BAG 1,16 x 5,45 m)
const BALCONY = { r: 0.9, floor: 20.7, top: 21.7 }; // halfrond balkon op beide topgevels, balustrade als dichte rand

// ---------- hulpvormen ----------
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar
// binnen onder 63 graden op, buiten de gevel loopt de snede schuin af.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [f + 1, -w / 2, z0], [a, w / 2, z0], [f + 1, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [f + 1, -w / 2, zb], [f + 1, w / 2, zb]]).translate([0, y, 0]);
};
// Rondboognis: zoals niche, met een top van twee schuine vlakken (60 graden) boven z1 tot z1 + w/2 · tan 60.
const archNiche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, h = (w / 2) * Math.tan(Math.PI / 3), zt = z1 + h;
  return hull([[a, -w / 2, z0], [f + 0.4, -w / 2, z0], [a, w / 2, z0], [f + 0.4, w / 2, z0], [a, -w / 2, z1], [f + 0.4, -w / 2, z1], [a, w / 2, z1], [f + 0.4, w / 2, z1], [f + 0.4, 0, zt], [a, 0, zt + 2 * depth]]).translate([0, y, 0]);
};
// Gevelrichtingen: draaihoek; s is de modelcoördinaat langs de gevel (Y bij +X/-X, X bij +Y/-Y).
const DIRS = { "+x": { deg: 0, s: (s) => s }, "+y": { deg: 90, s: (s) => -s }, "-x": { deg: 180, s: (s) => -s }, "-y": { deg: -90, s: (s) => s } };
const F = { "+x": W.x, "-x": W.x, "+y": W.y, "-y": W.y };
const win = (dir, s, w, z0, z1, depth = 0.3) => place(niche(F[dir], w, z0, z1, depth, DIRS[dir].s(s)), { deg: DIRS[dir].deg });
const archWin = (dir, s, w, z0, z1, depth = 0.3, f = F[dir]) => place(archNiche(f, w, z0, z1, depth, DIRS[dir].s(s)), { deg: DIRS[dir].deg });
const rowOf = (n, w, gap) => Array.from({ length: n }, (_, k) => (k - (n - 1) / 2) * (w + gap));

// ---------- schacht met zadeldak ----------
// Dwarsprofiel in (x, z), geëxtrudeerd langs y over de hele diepte (topgevels gelijk met het dakvlak): gevels tot de
// gootlijst, die met een onderkant van 50 graden 0,3 m uitkraagt, en de twee dakvlakken tot de nok.
const eaveAtWall = ROOF.fascia[0] - (ROOF.eaveOut - W.x) * Math.tan((50 * Math.PI) / 180);
const eaveTop = ROOF.ridge - ROOF.slope * ROOF.eaveOut;
const profile = [
  [-W.x, BASE], [W.x, BASE], [W.x, eaveAtWall], [ROOF.eaveOut, ROOF.fascia[0]], [ROOF.eaveOut, ROOF.fascia[1]], [ROOF.eaveOut, eaveTop],
  [0, ROOF.ridge], [-ROOF.eaveOut, eaveTop], [-ROOF.eaveOut, ROOF.fascia[1]], [-ROOF.eaveOut, ROOF.fascia[0]], [-W.x, eaveAtWall],
].filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
// Profiel in het (x, y)-vlak extruderen langs z en daarna kantelen zodat de extrusie langs y loopt.
const shaftRoof = Manifold.extrude(new CrossSection([profile.map(([x, z]) => [x, z])]), 2 * W.y)
  .rotate([90, 0, 0])
  .translate([0, W.y, 0]);

// Vensters als blinde nissen (0,3 m diep):
// - topgevels (noord en zuid): rondboogdeur naar het balkon van 20,7 tot 23,2 m (boog tot 24,1), twee kleine vensters
//   bovenin de topgevel van 35,6 tot 37,3 m;
// - oost- en westgevel: vier kleine vensters onder de goot van 32,5 tot 33,4 m;
// - oostgevel: drie smalle hoge vensters van 21,5 tot 23,8 m, 1,9 m ten zuiden van het hart;
// - noordgevel: twee hoge vensters van 2,0 tot 5,0 m bij de oosthoek en een klein venster van 1,0 tot 2,0 m;
// - zuidgevel: een klein venster van 1,3 tot 2,4 m.
const windows = union([
  ...["+y", "-y"].flatMap((d) => [
    archWin(d, 0, 1.0, BALCONY.floor, 23.2),
    ...rowOf(2, 0.5, 0.3).map((s) => win(d, s, 0.5, 35.6, 37.3)),
  ]),
  ...["+x", "-x"].flatMap((d) => rowOf(4, 0.45, 0.23).map((s) => win(d, s, 0.45, 32.5, 33.4))),
  ...rowOf(3, 0.4, 0.35).map((s) => win("+x", -1.9 + s, 0.4, 21.5, 23.8)),
  win("+y", 3.24, 0.45, 2.0, 5.0),
  win("+y", 2.29, 0.45, 2.0, 5.0),
  win("+y", -1.5, 0.75, 1.0, 2.0),
  win("-y", 1.8, 0.75, 1.3, 2.4),
]);
const shaft = shaftRoof.subtract(windows);

// ---------- balkons op de topgevels ----------
// Halve schijf van 0,9 m straal met de balustrade als dichte rand tot 21,7 m en een kegelvormige onderkant van 50 graden.
const balconyAt = (side) => {
  const drop = BALCONY.r * Math.tan((50 * Math.PI) / 180);
  const disc = Manifold.revolve(new CrossSection([[[0, BALCONY.floor - 0.25 - drop], [BALCONY.r, BALCONY.floor - 0.25], [BALCONY.r, BALCONY.top], [0, BALCONY.top]]]), 48);
  return disc.translate([0, side * (W.y - 0.05), 0]);
};
const balconies = union([balconyAt(1), balconyAt(-1)]);

// ---------- steunbeer en portaal aan de oostgevel ----------
// Verjongende steunbeer: voorvlak van 1,16 m uit de gevel aan de voet naar de gevel op 30,5 m (2,2 graden).
const buttress = hull([
  [W.x - 0.3, BUTTRESS.y[0], BASE], [BUTTRESS.front, BUTTRESS.y[0], BASE], [W.x - 0.3, BUTTRESS.y[1], BASE], [BUTTRESS.front, BUTTRESS.y[1], BASE],
  [W.x - 0.3, BUTTRESS.y[0], BUTTRESS.top], [W.x, BUTTRESS.y[0], BUTTRESS.top], [W.x - 0.3, BUTTRESS.y[1], BUTTRESS.top], [W.x, BUTTRESS.y[1], BUTTRESS.top],
]);
// Portaal: gevel tot 2,8 m, leien lessenaardak van 60 graden tegen de toren (4,8 m), dubbele rondboogdeur in het oostvlak.
const porchTop = PORCH.eave + (PORCH.front - W.x) * Math.tan((PORCH.pitch * Math.PI) / 180);
const porch = prism([[W.x - 0.3, 0], [PORCH.front, 0], [PORCH.front, PORCH.eave], [W.x, porchTop], [W.x - 0.3, porchTop]].map(([x, z]) => [x, z]), 0, 1)
  .rotate([90, 0, 0])
  .scale([1, PORCH.y[1] - PORCH.y[0], 1])
  .translate([0, PORCH.y[1], 0]);
const porchBase = box(W.x - 0.3, PORCH.y[0], BASE, PORCH.front, PORCH.y[1], 0.01);
const porchDoor = archNiche(PORCH.front, 1.6, 0.05, 1.85, 0.3, -0.2);
const entrance = union([porch, porchBase]).subtract(porchDoor);

const all = union([shaft, balconies, buttress, entrance]);

await writeLandmark({
  slug: "watertoren-mijdrecht",
  base: BASE,
  nodes: [["building:watertoren-schacht-zadeldak-balkons-steunbeer-en-portaal", all]],
  catalog: {
    name: "Watertoren Mijdrecht",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, -8], [0, 8], [-7.5, 0], [8, 0]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0736100000006955"],
    description:
      "Oorsprong op het hart van de vierkante schacht (BAG 9,32 x 9,47 m) op het maaiveld (NAP -5,05 m), +X naar RD-richting 0,2 graden, +Y noord. Rechte bakstenen schacht tot de gootlijst op 34,6 m, leien zadeldak van 53,5 graden met de nok noord-zuid op 41,3 m, op beide topgevels een rondboogdeur met halfrond balkon op 20,7 m en twee vensters bovenin, vier kleine vensters onder elke goot, drie hoge vensters in de oostgevel; tegen de oostgevel een portaal met lessenaardak en een verjongende steunbeer tot 30,5 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1937,
      architect: "MABEG",
      monument: 514700,
      publishedHeightM: 41,
      reservoirM3: 500,
      ahnGroundNapM: GROUND_NAP,
      ahnRidgeNapM: 36.27,
      roofPitchDegrees: 53.5,
      shaftM: [2 * W.x, 2 * W.y],
      eaveM: ROOF.fascia[1],
      ridgeM: ROOF.ridge,
      balconyFloorM: BALCONY.floor,
      buttressTopM: BUTTRESS.top,
      porchTopM: +porchTop.toFixed(2),
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Mijdrecht) (Industrieweg, 1937, MABEG, 41 m, 500 m³, vierkant met kerktoren-zadeldak, Delftse School, buiten gebruik sinds 2005)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/514700 (vierkante plattegrond, leien zadeldak, portaal met lessenaardak en dubbele rondboogdeur tegen de oostgevel, verjongende steunbeer links van de ingang, rondboogdeur met halfrond balkon halverwege de noord- en zuidgevel, kleine vensters vooral onder het dak, reservoir circa 8 x 8 x 8 m)",
      "https://commons.wikimedia.org/wiki/File:Mijdrecht_Watertoren_7622.JPG (zuidoost: topgevel met balkon, oostgevel met steunbeer en vensters)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Mijdrecht) (RCE-foto's 20530360 tot 20530369: portaal, steunbeer, noord- en zuidgevel, overzicht)",
      "PDOK BAG-pand 0736100000006955, AHN DSM/DTM 0,5 m, 3D BAG en luchtfoto, 2026-11-06",
    ],
  },
});
