// Genereert een gesloten 3D-model van Teylers Museum aan het Spaarne in Haarlem:
// het samengestelde museumcomplex uit vlakken en bouwdelen, elk deel met een eigen
// hoogte en dakvorm.
//
// - De Spaarnevleugel (Christian Ulrich, 1879-1885): de natuurstenen gevel van drie
//   vensterassen met een middenrisaliet (gekoppelde zuilen, portiek en loggia als
//   nissen), hoekpilasters, cordonlijst en hoofdgestel op een schuine kraag, de
//   balustrade met obelisken op de zijtraveeën, het fronton met de beeldengroep van
//   Kunst, Wetenschap en Faam (Bart van Hove, 1886) en daarachter de rotonde met de
//   glazen lichtkoepel en een lichtkap op het platte dak.
// - De Fossielenzalen en de Instrumentenzaal (Van der Steur, 1880-1885): de lange
//   zinkbeklede zaal met lisenen, hoge vensters, een kroonlijst en het glazen dak als
//   mansardevlakken (57 graden) met een flauw glazen zadeldak en schilden.
// - De Ovale Zaal (Viervant, 1784) in een blok met plat dak: de lichtbeuk als
//   achtzijdige trommel, het achtzijdige schilddak (55 graden), daarop het
//   houten blok met het observatorium (belvedère met vensternissen en borstwering) en
//   de glazen lantaarn aan de zuidwestkant.
// - De Eerste (1838) en Tweede Schilderijenzaal (1893) langs de Nauwe Appelaarsteeg:
//   zadeldaken met opgehoogde daklichten en steile schilden, lisenen op de steeggevel.
// - De uitbreiding van Hubert-Jan Henket (1996): de tentoonstellingszaal met plat dak,
//   overstek op een kraag en een lagere glasstrook langs de tuin, de tuinzaal (café),
//   het hogere blok aan de tuin, de lage glazen galerij als lessenaarsdak en de
//   verbindingen; in de tuin het witgepleisterde tuinhuis.
// - Het Fundatiehuis (Damstraat 21, sinds 2021 deel van het museum): het voorhuis van
//   vier bouwlagen met de vlakke gevel (drie vensterassen, kroonlijst op een kraag)
//   en een zadeldak met schild, de lagere zijvleugel, de achtervleugel en de
//   dwarsvleugel met kilgoten, de vleugel naar de Ovale Zaal met lessenaarsdak, de
//   vleugel en het prieel rond de binnenplaats (die open blijft).
//
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, één node met de materiaalklasse in de nodenaam) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-teylers-museum.mjs              # 1:1000 (standaard)
//   node scripts/generate-teylers-museum.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (104120, 488350), op de as van de Fossielenzalen bij
// de Ovale Zaal, op het maaiveld aan het Spaarne (NAP +0,5 m), Z omhoog. +X loopt
// naar het noordoosten (45,6 graden tegen de klok in vanaf de RD-X-as, haaks op de
// zalen) en +Y langs de zalen naar het noordwesten (de Nauwe Appelaarsteeg). De
// Spaarnegevel staat aan de -Y-kant, maar volgt de kade onder -25,84 graden in dit
// stelsel; zij heeft daarom een eigen gevelstelsel.
//
// Bronnen: PDOK BAG-panden 0392100000065736 (museum, Spaarne 16), 0392100000037991
// (uitbreiding 1996), 0392100000063892 (Fundatiehuis, Damstraat 21) en
// 0392100000037992 (vleugel en prieel aan de binnenplaats van het Fundatiehuis) en
// 0392100000037264 (het tuinhuis); AHN
// DSM/DTM 0,5 m (PDOK WCS) voor goten, nokken, knikken, de koepel, de Ovale Zaal en het
// observatorium, de platte daken en het maaiveld; 3D BAG LoD2.2 (dakvlakken van de
// Ovale Zaal, de schilderijenzalen en het Fundatiehuis); PDOK luchtfoto; Rijksmonument
// 513441; Wikipedia; de plattegrond van het museum en foto's op Wikimedia Commons (de
// Spaarnegevel, de zalen met het glazen dak, het dak van de Ovale Zaal met het
// observatorium, de binnenplaats van het Fundatiehuis).
//
// Geschat (uit foto's): de geleding van de Spaarnegevel (cordonlijst +5,8 m, vensters,
// zuilen, balustrade, obelisken), de beeldengroep (top +18,9 m, het AHN ziet de
// bronzen beelden niet), de hoogte van het houten blok onder het observatorium, de
// lisenen en vensters van de Fossielenzalen en de steeggevels, de vensters van het
// Fundatiehuis, de lantaarn op het dak van de Ovale Zaal, de daken van het tuinhuis en de
// lage aanbouwen tussen het Fundatiehuis en de museumvleugel.
// Weggelaten: leuningen, hekken en de wenteltrap op het dak van de Ovale Zaal (dunner
// dan 0,9 m), schoorstenen en kleine daklichten (kleiner dan 0,9 m), het
// beeldhouwwerk in de gevel, de vlaggenmast; de winkel in Spaarne 18 (een eigen
// woonhuis met een eigen BAG-pand), het depot- en kantoorgebouw Zegelwaarden aan de Nauwe
// Appelaarsteeg (BAG 0392100000065737, eigen gebouw uit 1951, de PDOK-reconstructie blijft) en de
// schuurtjes aan de achterzijde van de Damstraat.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "teylers-museum");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
const rectPoly = ([x0, x1, y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const hullOf = (...groups) => Manifold.hull(groups.flat());
// Convexe veelhoek (linksom) een afstand d naar binnen verschoven: gelijke helling op elk vlak.
function insetConvex(pts, d) {
  const p = ccw(pts);
  const n = p.length;
  const lines = p.map(([x0, y0], i) => {
    const [x1, y1] = p[(i + 1) % n];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const ex = (x1 - x0) / len;
    const ey = (y1 - y0) / len;
    return { px: x0 - ey * d, py: y0 + ex * d, ex, ey };
  });
  return lines.map((a, i) => {
    const b = lines[(i + n - 1) % n];
    const det = b.ex * a.ey - b.ey * a.ex;
    const t = ((a.px - b.px) * a.ey - (a.py - b.py) * a.ex) / det;
    return [b.px + b.ex * t, b.py + b.ey * t];
  });
}
// Gevelstelsel: x langs de gevel, y naar buiten, z omhoog; `out` is de richting naar buiten in graden.
const onWall = ([x, y], out, solid) => solid.rotate([0, 0, out - 90]).translate([x, y, 0]);
// Blinde nis in een gevel (gevelstelsel), met een spitse bovenkant van 54 graden zodat er niets overhangt.
const niche = (x, w, z0, z1, depth) =>
  profileY([[x - w / 2, z0], [x + w / 2, z0], [x + w / 2, z1], [x, z1 + (w / 2) * 1.4], [x - w / 2, z1]], -depth, 0.3);
// Lijst op een schuine kraag (gevelstelsel): van de gevel (y = 0) op z0 onder 50 graden naar `out`, dan recht tot z1.
const corniceX = (x0, x1, z0, out, z1, y = 0) =>
  profileX([[y - 0.05, z0], [y + out, z0 + (out + 0.05) * 1.2], [y + out, z1], [y - 0.05, z1]], x0, x1);

const SLUG = "teylers-museum";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld aan het Spaarne, NAP +0,5 m) ----------
const GROUND_NAP = 0.5;
const nap = (h) => +(h - GROUND_NAP).toFixed(3);
const ORIGIN = [104120, 488350];
const AXIS_DEG = 45.6;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(6), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(6)];
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld aan het Spaarne
// (de Damstraat en de steeg liggen 0,8 m hoger, daar steekt de voet dieper in het terrein).
const BASE = -0.5;
// Maaiveld op de kade aan het Spaarne voor de gevel (AHN NAP +0,45 tot +0,6 m).
const GROUND_SAMPLES = [[-9.1, -53.5], [-3.7, -56.1], [-14.5, -50.9]];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op die drie punten.
const GROUND_HEIGHT = 43.44;

// --- Spaarnevleugel (gevelstelsel: oorsprong in het midden van de gevel op het vlak van de zijtraveeën) ---
// Gevellijn uit de BAG-hoekpunten: richting -25,84 graden in het lokale stelsel, naar buiten (-0,436, -0,900).
const FACADE = { centre: [-5.644, -46.289], out: 244.16, half: 8.4 };
const RISALIT = { half: 3.6, proud: 1.1 };
const SPAARNE = {
  roof: nap(14.5), // plat dak achter de gevel en bovenkant van het hoofdgestel
  cordon: 5.8, // cordonlijst boven de begane grond
  balustrade: nap(15.7), // bovenkant balustrade op de zijtraveeën
  pedestal: nap(16.0), // hoekpostamenten
  obelisk: nap(17.9), // top van de obelisken
  frontonTop: nap(17.0), // top van het fronton (3D BAG 16,9)
  statueTop: nap(19.4), // top van de beeldengroep (geschat uit foto's)
};
// Rotonde met lichtkoepel: 7,9 m achter de gevel op de as, straal 4,0 m, top NAP +17,8 m.
const DOME = { y: -7.9, r: 4.0, drumTop: nap(14.9), top: nap(17.8) };
// Lichtkap achter de koepel (lokaal), NAP +15,5 m.
const SPAARNE_SKYLIGHT = [[-6.0, 1.5, -33.8, -31.2], nap(15.5)];
// Lagere stroken naast de gevel (garderobe en de hoek bij Spaarne 18), NAP +8,8 m.
const SIDE_LOW = nap(8.8);

// --- Fossielenzalen en Instrumentenzaal ---
const HALLS = { rect: [-8.25, 4.2, -29.4, 2.7], eave: nap(13.7), knik: nap(17.45), ridge: nap(17.9), axis: -2.03 };
const HALLS_KNIK = [-5.88, 1.82, -26.6, 0.3];
const HALLS_LINK = { rect: [-10.4, 4.15, 0.65, 5.3], top: nap(10.7) };

// --- Ovale Zaal ---
const OVAL_BLOCK_TOP = nap(11.3);
const OVAL_BLOCK = [[-10.4, 5.2], [4.15, 5.2], [4.15, 5.05], [15.3, 5.05], [15.3, 14.0], [7.0, 14.0], [7.0, 17.6], [4.15, 17.6], [4.1, 27.75], [-7.4, 28.0], [-7.5, 26.1], [-10.1, 26.3]];
// Achtzijdige lichtbeuk en schilddak rond (-2,0; 16,7): halve breedte 4,7 m, halve lengte 8,8 m,
// lange zijden 13 m, kopse zijden 3,2 m (3D BAG-vlakken).
const OVAL = { c: [-2.0, 16.7], a: 4.7, b: 8.8, kv: 6.5, ku: 1.6, eave: nap(13.0), drumInset: 0.25, run: 2.35, top: nap(16.4) };
// Houten blok onder het observatorium (bovenkant AHN NAP +19,3 m) en de belvedère (NAP +22,6 m).
const OBS_BLOCK = { rect: [-4.0, 0.0, 12.15, 21.25], top: nap(19.3) };
const BELVEDERE = { c: [-1.8, 16.7], hu: 1.5, hv: 1.6, chamfer: 0.45, top: nap(22.1), parapet: nap(22.6) };
// Glazen lantaarn op het platte dak aan de zuidwestkant van de Ovale Zaal (AHN NAP +14,8 m).
const LANTERN = { rect: [-9.5, -7.5, 16.8, 19.2], wall: nap(13.8), top: nap(14.8) };

// --- Schilderijenzalen ---
const GALLERY1 = { rect: [4.05, 18.4, 17.6, 27.7], eave: nap(7.6), knikHalf: 2.3, knik: nap(12.4), endInset: 2.0, ridge: nap(13.4), ridgeEnd: 2.45 };
const GALLERY2 = { rect: [20.3, 38.65, 17.2, 27.6], eave: nap(9.1), ridge: nap(14.1), ridgeEnd: [2.0, 2.65] };
const GALLERY_LINK = { rect: [18.3, 20.4, 17.4, 27.7], top: nap(9.1) };
const LOW_FLAT = { rect: [6.9, 38.7, 13.9, 17.7], top: nap(7.9) };

// --- Uitbreiding Henket (1996) ---
const HENKET = {
  hall: [[9.2, -25.4], [13.9, -25.4], [13.9, -26.6], [17.1, -26.6], [17.1, 1.9], [9.2, 1.9]],
  hallTop: nap(7.8),
  overhang: 7.4, // dakrand aan de zuidwestkant (u), 1,8 m voor de gevel
  strip: [17.0, 21.8, -26.6, 6.6],
  stripTop: nap(7.55),
  link1: [[4.1, 9.3, -12.85, -10.2], nap(6.2)],
  link2: [[4.05, 17.1, 1.84, 5.3], nap(6.9)],
  cafe: [[15.2, 5.05], [21.8, 5.05], [21.8, 6.6], [47.0, 6.6], [47.0, 17.0], [15.2, 17.0]],
  cafeTop: nap(7.9),
  block: [[38.6, 47.0, 16.9, 31.2], nap(10.1)],
  leanTo: { rect: [21.7, 45.1, 2.8, 6.7], low: nap(3.4), high: nap(7.4) },
};
// Witgepleisterd tuinhuis in de tuin (BAG-pand 0392100000037264): lage vleugels met plat dak (NAP +4,7 m),
// een voorbouw (NAP +5,45 m) en het hogere middendeel met een flauw schilddak tot NAP +6,3 m (3D BAG, AHN).
const GARDEN_HOUSE = {
  outline: [[49.7, 12.69], [49.39, 1.27], [53.86, 1.21], [54.08, 7.42], [54.22, 12.24]],
  low: nap(4.7),
  front: [[50.4, 52.4, 1.21, 5.0], nap(5.45)],
  centre: { rect: [49.55, 53.4, 4.6, 8.9], eave: nap(5.7), top: nap(6.3) },
};

// --- Fundatiehuis en aanbouwen (maaiveld aan de Damstraat NAP +1,3 m) ---
const FUND = {
  front: { rect: [-50.05, -37.8, 7.6, 16.2], eave: nap(14.3), ridge: nap(18.6), ridgeV: 11.9, ridgeBack: -41.5, parapet: nap(18.4) },
  side: { rect: [-50.05, -32.6, 3.4, 7.7], eave: nap(7.9), ridge: nap(12.0), ridgeV: 5.5 },
  sideFront: { rect: [-50.05, -47.3, 3.4, 7.7], eave: nap(11.0), ridge: nap(13.4) },
  rear: { rect: [-38.4, -29.9, 7.6, 12.7], eave: nap(11.6), ridge: nap(14.65), ridgeV: 10.15 },
  cross: { rect: [-33.5, -25.5, 8.1, 15.8], eave: nap(8.9), ridge: nap(14.3), ridgeU: -29.5 },
  // Vleugel naar de Ovale Zaal: plat dak (NAP +12,0 m), aan de binnenplaatskant een lessenaarsdak tot NAP +9,6 m.
  west: { poly: [[-26.5, 3.8], [-18.05, 3.8], [-18.05, 0.7], [-10.3, 0.7], [-10.3, 7.8], [-26.5, 7.8]], top: nap(12.0), lean: [-26.5, -10.3, 7.7, 11.7], leanLow: nap(9.6) },
  westLow: [[-28.8, -26.4, 3.8, 8.3], nap(5.0)],
  courtSE: [[-16.0, -10.3, 10.9, 17.5], nap(10.1)],
  courtStrip: [[-25.2, -15.9, 16.2, 17.4], nap(6.4)],
  // BAG-pand 0392100000037992: blok naast het voorhuis (NAP +11,0 m) en de lage vleugel met het prieel (NAP +4,8 m).
  annex: [[-30.0, -23.5, 15.6, 26.0], nap(11.0)],
  // Lage aanbouwen tussen de vleugels (geen eigen BAG-pand in deze set; AHN NAP +8,5 en +3,8 m).
  notch: [[[-25.6, -21.5, 11.6, 16.3], nap(8.5)], [[-21.5, -15.9, 11.6, 16.3], nap(3.8)]],
  prieel: { poly: [[-34.8, 24.9], [-23.5, 25.9], [-11.2, 25.1], [-10.9, 29.7], [-12.8, 30.0], [-26.6, 27.8], [-34.8, 26.7]], top: nap(4.8) },
};

const pieces = [];
const cutters = [];

// ==================== Spaarnevleugel ====================
const facadeLocal = (solid) => onWall(FACADE.centre, FACADE.out, solid);
{
  const out = (FACADE.out * Math.PI) / 180;
  const n = [Math.cos(out), Math.sin(out)];
  const t = [n[1], -n[0]]; // langs de gevel, zoals x in het gevelstelsel van onWall (naar het zuidwesten)
  const [cx, cy] = FACADE.centre;
  const P = (x, y) => [cx + t[0] * x + n[0] * y, cy + t[1] * x + n[1] * y];
  const NE = P(-FACADE.half, 0);
  const SW = P(FACADE.half, 0);
  const NE_BACK = P(-FACADE.half, -7.5);
  const SW_BACK = P(FACADE.half, -3.5);
  const body = [SW, NE, NE_BACK, [5.4, -38.0], [5.4, -35.56], [3.07, -35.58], [3.07, -29.2], [-7.3, -29.2], [-7.3, -34.9], [-10.0, -33.7], SW_BACK];
  pieces.push(prism(body, BASE, SPAARNE.roof));
  // Lagere stroken naast de gevel (garderobe aan de noordoostkant, hoek bij Spaarne 18).
  const grown = (pts) => Manifold.extrude(new CrossSection([ccw(pts)]).offset(0.05, "Miter"), SIDE_LOW - BASE).translate([0, 0, BASE]);
  pieces.push(grown([NE, [3.91, -50.75], [4.98, -43.3], NE_BACK]));
  pieces.push(grown([[-14.64, -41.35], SW, SW_BACK, [-14.15, -38.6]]));
}
{
  const H = FACADE.half;
  const RH = RISALIT.half;
  const RP = RISALIT.proud;
  const top = SPAARNE.roof;
  const f = [];
  // Middenrisaliet tot onder het hoofdgestel.
  f.push(box(-RH, RH, -0.05, RP, BASE, top));
  // Hoekpilasters van de zijtraveeën (0,3 m voor het gevelvlak) en de pilasters naast het risaliet.
  for (const s of [-1, 1]) {
    f.push(box(s > 0 ? H - 1.2 : -H, s > 0 ? H : -H + 1.2, -0.05, 0.3, BASE, top - 1.0));
    f.push(box(s > 0 ? RH : -RH - 0.8, s > 0 ? RH + 0.8 : -RH, -0.05, 0.3, BASE, top - 1.0));
    // Gekoppelde zuilen op het risaliet (half ingemetseld, op een sokkel van 0,8 m).
    for (const x of [1.95, 2.85]) {
      f.push(Manifold.cylinder(top - 1.0 - 0.8, 0.32, 0.32, 16).translate([s * x, RP, 0.8]));
      f.push(box(s * x - 0.4, s * x + 0.4, RP - 0.05, RP + 0.4, BASE, 0.85));
    }
  }
  // Cordonlijst boven de begane grond, over de hele gevel en het risaliet.
  f.push(corniceX(-H, H, SPAARNE.cordon, 0.4, SPAARNE.cordon + 0.75));
  f.push(corniceX(-RH, RH, SPAARNE.cordon, 0.45, SPAARNE.cordon + 0.75, RP));
  // Hoofdgestel met kroonlijst op een schuine kraag.
  f.push(corniceX(-H, H, top - 1.0, 0.55, top));
  f.push(corniceX(-RH, RH, top - 1.0, 0.55, top, RP));
  // Balustrade op de zijtraveeën en hoekpostamenten met obelisken.
  for (const s of [-1, 1]) {
    const [x0, x1] = s > 0 ? [RH + 0.6, H] : [-H, -RH - 0.6];
    f.push(box(x0, x1, -0.4, 0.55, top - 0.05, SPAARNE.balustrade));
    const [p0, p1] = s > 0 ? [H - 1.1, H] : [-H, -H + 1.1];
    f.push(box(p0, p1, -0.4, 0.55, top - 0.05, SPAARNE.pedestal));
    const cx = (p0 + p1) / 2;
    f.push(hullOf(at(rectPoly([cx - 0.45, cx + 0.45, -0.37, 0.53]), SPAARNE.pedestal - 0.02), [[cx, 0.08, SPAARNE.obelisk]]));
    // Postamenten op de hoeken van het risaliet, achter het fronton.
    f.push(box(s > 0 ? RH - 0.6 : -RH - 0.5, s > 0 ? RH + 0.5 : -RH + 0.6, -0.6, 0.5, top - 0.05, SPAARNE.balustrade + 0.3));
  }
  // Fronton: driehoek boven het risaliet, van de kroonlijst tot NAP +17,0 m.
  const FW = RH;
  f.push(profileY([[-FW, top - 0.05], [FW, top - 0.05], [0, SPAARNE.frontonTop]], -2.5, RP + 0.55));
  // Beeldengroep op een sokkel achter de top van het fronton: Faam in het midden met vleugels,
  // Kunst en Wetenschap ernaast (schematisch, smaller naar boven, hoofden als dubbele piramide).
  const pedTop = SPAARNE.frontonTop + 0.1;
  f.push(box(-1.4, 1.4, -1.9, 0.9, top, pedTop));
  const figure = (x, y, h, r) => {
    const z0 = pedTop - 0.02;
    const neck = z0 + h - 0.55;
    return Manifold.union([
      hullOf(at(rectPoly([x - r, x + r, y - r, y + r]), z0), at(rectPoly([x - r * 0.6, x + r * 0.6, y - r * 0.6, y + r * 0.6]), neck)),
      hullOf([[x, y, neck - 0.3]], at(rectPoly([x - 0.25, x + 0.25, y - 0.25, y + 0.25]), neck + 0.05), [[x, y, z0 + h]]),
    ]);
  };
  const faamH = SPAARNE.statueTop - pedTop;
  f.push(figure(0, -0.5, faamH, 0.5));
  f.push(figure(-0.95, 0.1, faamH - 1.1, 0.45));
  f.push(figure(0.95, 0.1, faamH - 1.1, 0.45));
  // Vleugels van Faam: een plaat van 0,9 m dik die naar boven smaller wordt.
  f.push(hullOf(at(rectPoly([-1.0, 1.0, -0.2, 0.7]), pedTop - 0.02), at(rectPoly([-0.35, 0.35, -0.05, 0.55]), pedTop + faamH - 0.3)));
  pieces.push(...f.map(facadeLocal));
  // Nissen: portiek en loggia in het risaliet, vensters in de zijtraveeën.
  const c = [];
  c.push(niche(0, 2.2, BASE, 4.3, 0.55).translate([0, RP, 0]));
  c.push(niche(0, 2.6, 6.9, 10.6, 0.55).translate([0, RP, 0]));
  for (const s of [-1, 1]) {
    const x = s * 5.45;
    c.push(niche(x, 1.6, 1.3, 4.4, 0.35));
    c.push(niche(x, 1.5, 7.1, 10.1, 0.35));
  }
  cutters.push(...c.map(facadeLocal));
  // Rotonde met lichtkoepel (24 ribben) als omwentelingsvorm van een kwartellips.
  const prof = [[0, SPAARNE.roof - 0.1], [DOME.r + 0.15, SPAARNE.roof - 0.1], [DOME.r + 0.15, DOME.drumTop]];
  const k = 10;
  for (let i = 0; i < k; i++) {
    const a = (i / k) * (Math.PI / 2);
    prof.push([DOME.r * Math.cos(a), DOME.drumTop + (DOME.top - DOME.drumTop) * Math.sin(a)]);
  }
  prof.push([0, DOME.top]);
  pieces.push(facadeLocal(Manifold.revolve(new CrossSection([ccw(prof)]), 24).translate([0, DOME.y, 0])));
  const [sr, sz] = SPAARNE_SKYLIGHT;
  pieces.push(hullOf(at(rectPoly(sr), SPAARNE.roof - 0.05), at(rectPoly([sr[0] + 0.9, sr[1] - 0.9, sr[2] + 0.9, sr[3] - 0.9]), sz)));
}

// ==================== Fossielenzalen ====================
{
  const [u0, u1, v0, v1] = HALLS.rect;
  pieces.push(box(u0, u1, v0, v1, BASE, HALLS.eave));
  // Glazen dak: mansardevlakken van de goot naar de knik, daarboven een flauw glazen zadeldak.
  const ridge = [[HALLS.axis, HALLS_KNIK[2] + 0.7, HALLS.ridge], [HALLS.axis, HALLS_KNIK[3] - 0.7, HALLS.ridge]];
  pieces.push(hullOf(at(rectPoly(HALLS.rect), HALLS.eave - 0.02), at(rectPoly(HALLS_KNIK), HALLS.knik), ridge));
  // Kroonlijst op een kraag langs de lange gevels en lisenen van 1,0 m om de 4,0 m.
  const longWalls = [
    [[u1, (v0 + v1) / 2], 0],
    [[u0, (v0 + v1) / 2], 180],
  ];
  const len = v1 - v0;
  for (const [o, out] of longWalls) {
    pieces.push(onWall(o, out, corniceX(-len / 2, len / 2, HALLS.eave - 0.9, 0.4, HALLS.eave)));
    for (let k = 0; k < 8; k++) {
      const v = -27.2 + 4.0 * k;
      const x = out === 0 ? -(v - o[1]) : v - o[1];
      pieces.push(onWall(o, out, box(x - 0.5, x + 0.5, -0.05, 0.3, BASE, HALLS.eave - 0.9)));
    }
    // Hoge vensters tussen de lisenen.
    for (let k = 0; k < 7; k++) {
      const v = -25.2 + 4.0 * k;
      const x = out === 0 ? -(v - o[1]) : v - o[1];
      cutters.push(onWall(o, out, niche(x, 1.3, HALLS.eave - 3.6, HALLS.eave - 2.6, 0.35)));
    }
  }
  pieces.push(box(...HALLS_LINK.rect, BASE, HALLS_LINK.top));
}

// ==================== Ovale Zaal ====================
{
  pieces.push(prism(OVAL_BLOCK, BASE, OVAL_BLOCK_TOP));
  const { c, a, b, kv, ku } = OVAL;
  const oct = [[a, -kv], [a, kv], [ku, b], [-ku, b], [-a, kv], [-a, -kv], [-ku, -b], [ku, -b]].map(([x, y]) => [c[0] + x, c[1] + y]);
  const eaveOct = insetConvex(oct, OVAL.drumInset);
  const topOct = insetConvex(oct, OVAL.drumInset + OVAL.run);
  // Lichtbeuk: achtzijdige trommel met glas, iets naar binnen hellend.
  pieces.push(hullOf(at(oct, OVAL_BLOCK_TOP - 0.05), at(eaveOct, OVAL.eave)));
  // Achtzijdig schilddak (55 graden) tot het plat met het houten blok.
  pieces.push(hullOf(at(eaveOct, OVAL.eave - 0.02), at(topOct, OVAL.top)));
  pieces.push(box(...OBS_BLOCK.rect, OVAL.top - 0.1, OBS_BLOCK.top));
  // Belvedère: vierkant met afgeschuinde hoeken, kroonlijst op een kraag en borstwering.
  const { hu, hv, chamfer: ch } = BELVEDERE;
  const [bx, by] = BELVEDERE.c;
  const bel = [[hu, -hv + ch], [hu, hv - ch], [hu - ch, hv], [-hu + ch, hv], [-hu, hv - ch], [-hu, -hv + ch], [-hu + ch, -hv], [hu - ch, -hv]].map(([x, y]) => [bx + x, by + y]);
  const belTop = insetConvex(bel, -0.25);
  pieces.push(prism(bel, OBS_BLOCK.top - 0.05, BELVEDERE.top - 0.3));
  pieces.push(hullOf(at(bel, BELVEDERE.top - 0.4), at(belTop, BELVEDERE.top - 0.08), at(belTop, BELVEDERE.top)));
  pieces.push(prism(belTop, BELVEDERE.top - 0.05, BELVEDERE.parapet));
  // Rondboogvensters van de belvedère als spitse nissen op de vier hoofdzijden.
  for (const [o, out, w] of [[[bx + hu, by], 0, 0.9], [[bx - hu, by], 180, 0.9], [[bx, by + hv], 90, 0.9], [[bx, by - hv], 270, 0.9]]) {
    cutters.push(onWall(o, out, niche(0, w, OBS_BLOCK.top + 0.5, BELVEDERE.top - 1.4, 0.3)));
  }
  // Glazen lantaarn op het platte dak.
  const [l0, l1, m0, m1] = LANTERN.rect;
  pieces.push(box(l0, l1, m0, m1, OVAL_BLOCK_TOP - 0.05, LANTERN.wall));
  pieces.push(hullOf(at(rectPoly(LANTERN.rect), LANTERN.wall - 0.02), at(rectPoly([l0 + 0.6, l1 - 0.6, m0 + 0.6, m1 - 0.6]), LANTERN.top)));
  // Vensters naar de binnenplaats van het Fundatiehuis (zuidwestgevel, drie assen en twee lagen).
  for (const v of [18.6, 21.1, 23.6]) {
    for (const [z0, z1] of [[1.6, 3.9], [5.6, 7.9]]) cutters.push(onWall([-10.4, v], 180, niche(0, 1.3, z0, z1, 0.35)));
  }
}

// ==================== Schilderijenzalen ====================
{
  const g = GALLERY1;
  const [u0, u1, v0, v1] = g.rect;
  const vc = (v0 + v1) / 2;
  pieces.push(box(u0, u1, v0, v1, BASE, g.eave));
  // Steile dakvlakken naar het opgehoogde daklicht, daarboven een flauw glazen zadeldak; steile schilden.
  const knik = [u0 + g.endInset, u1 - g.endInset, vc - g.knikHalf, vc + g.knikHalf];
  pieces.push(hullOf(at(rectPoly(g.rect), g.eave - 0.02), at(rectPoly(knik), g.knik), [[u0 + g.ridgeEnd, vc, g.ridge], [u1 - g.ridgeEnd, vc, g.ridge]]));
}
{
  const g = GALLERY2;
  const [u0, u1, v0, v1] = g.rect;
  const vc = (v0 + v1) / 2;
  pieces.push(box(u0, u1, v0, v1, BASE, g.eave));
  // Zadeldak van 44 graden met het daklicht in de nok en steile schilden.
  pieces.push(hullOf(at(rectPoly(g.rect), g.eave - 0.02), [[u0 + g.ridgeEnd[0], vc, g.ridge], [u1 - g.ridgeEnd[1], vc, g.ridge]]));
}
pieces.push(box(...GALLERY_LINK.rect, BASE, GALLERY_LINK.top));
pieces.push(box(...LOW_FLAT.rect, BASE, LOW_FLAT.top));
// Lisenen op de gevels langs de Nauwe Appelaarsteeg.
for (const [u0, u1, va, vb, top] of [[4.05, 18.4, 27.7, 27.7, GALLERY1.eave], [20.3, 38.65, 27.6, 27.6, GALLERY2.eave], [-7.4, 4.1, 28.0, 27.75, OVAL_BLOCK_TOP]]) {
  const count = Math.max(2, Math.round((u1 - u0) / 3.6) + 1);
  for (let k = 0; k < count; k++) {
    const u = u0 + 0.45 + ((u1 - u0 - 0.9) * k) / (count - 1);
    const v = va + ((vb - va) * (u - u0)) / (u1 - u0); // gevellijn (bij de Ovale Zaal licht schuin)
    pieces.push(box(u - 0.45, u + 0.45, v - 0.1, v + 0.3, BASE, top - 0.6));
  }
}

// ==================== Uitbreiding Henket ====================
{
  const h = HENKET;
  pieces.push(prism(h.hall, BASE, h.hallTop));
  // Overstek aan de zuidwestkant op een kraag van 50 graden.
  const [v0, v1] = [-25.4, 1.9];
  const drop = (9.2 - h.overhang) * 1.2;
  pieces.push(profileY([[9.25, h.hallTop - 1.0 - drop], [9.25, h.hallTop], [h.overhang, h.hallTop], [h.overhang, h.hallTop - 1.0], [9.2, h.hallTop - 1.0 - drop]], v0, v1));
  pieces.push(box(...h.strip, BASE, h.stripTop));
  pieces.push(box(...h.link1[0], BASE, h.link1[1]));
  pieces.push(box(...h.link2[0], BASE, h.link2[1]));
  pieces.push(prism(h.cafe, BASE, h.cafeTop));
  pieces.push(box(...h.block[0], BASE, h.block[1]));
  const [a0, a1, b0, b1] = h.leanTo.rect;
  pieces.push(hullOf(at(rectPoly(h.leanTo.rect), BASE), [[a0, b0, h.leanTo.low], [a1, b0, h.leanTo.low], [a0, b1, h.leanTo.high], [a1, b1, h.leanTo.high]]));
}
{
  const g = GARDEN_HOUSE;
  pieces.push(prism(g.outline, BASE, g.low));
  pieces.push(box(...g.front[0], BASE, g.front[1]));
  const [u0, u1, v0, v1] = g.centre.rect;
  pieces.push(box(u0, u1, v0, v1, BASE, g.centre.eave));
  pieces.push(hullOf(at(rectPoly(g.centre.rect), g.centre.eave - 0.02), at(rectPoly([u0 + 0.8, u1 - 0.8, v0 + 0.8, v1 - 0.8]), g.centre.top)));
}

// ==================== Fundatiehuis ====================
{
  const F = FUND;
  // Voorhuis: zadeldak met de nok langs de diepte, schild aan de achterkant, vlakke gevel met kroonlijst.
  const fr = F.front;
  const [u0, u1, v0, v1] = fr.rect;
  pieces.push(box(u0, u1, v0, v1, BASE, fr.eave));
  pieces.push(hullOf(at(rectPoly(fr.rect), fr.eave - 0.02), [[u0 + 1.0, fr.ridgeV, fr.ridge], [fr.ridgeBack, fr.ridgeV, fr.ridge]]));
  pieces.push(box(u0, u0 + 1.05, v0, v1, BASE, fr.parapet));
  pieces.push(onWall([u0, (v0 + v1) / 2], 180, corniceX(-(v1 - v0) / 2, (v1 - v0) / 2, fr.parapet - 1.1, 0.5, fr.parapet)));
  // Drie vensterassen, vier lagen; de deur onder de zuidoostelijke as (straat op +0,8 m).
  for (const v of [9.3, 11.9, 14.5]) {
    const x = v - (v0 + v1) / 2; // gevelstelsel naar -u: x loopt met v mee
    const floors = [[6.0, 8.8], [10.0, 12.4], [13.9, 15.2]];
    floors.push(v === 9.3 ? [0.8, 3.9] : [1.6, 4.2]);
    for (const [z0, z1] of floors) cutters.push(onWall([u0, (v0 + v1) / 2], 180, niche(x, 1.3, z0, z1, 0.35)));
  }
  // Zijvleugel met zadeldak, het voorste deel hoger.
  const sd = F.side;
  pieces.push(box(...sd.rect, BASE, sd.eave));
  pieces.push(hullOf(at(rectPoly(sd.rect), sd.eave - 0.02), [[sd.rect[0], sd.ridgeV, sd.ridge], [sd.rect[1], sd.ridgeV, sd.ridge]]));
  const sf = F.sideFront;
  pieces.push(box(...sf.rect, BASE, sf.eave));
  pieces.push(hullOf(at(rectPoly(sf.rect), sf.eave - 0.02), [[sf.rect[0], sd.ridgeV, sf.ridge], [sf.rect[1], sd.ridgeV, sf.ridge]]));
  // Achtervleugel (nok langs u) en dwarsvleugel (nok langs v): kilgoten waar ze elkaar snijden.
  const rr = F.rear;
  pieces.push(box(...rr.rect, BASE, rr.eave));
  pieces.push(hullOf(at(rectPoly(rr.rect), rr.eave - 0.02), [[rr.rect[0], rr.ridgeV, rr.ridge], [rr.rect[1], rr.ridgeV, rr.ridge]]));
  const cr = F.cross;
  pieces.push(box(...cr.rect, BASE, cr.eave));
  pieces.push(hullOf(at(rectPoly(cr.rect), cr.eave - 0.02), [[cr.ridgeU, cr.rect[2], cr.ridge], [cr.ridgeU, cr.rect[3], cr.ridge]]));
  // Vleugel naar de Ovale Zaal met lessenaarsdak naar de binnenplaats.
  pieces.push(prism(F.west.poly, BASE, F.west.top));
  const [w0, w1, x0, x1] = F.west.lean;
  pieces.push(hullOf(at(rectPoly(F.west.lean), BASE), [[w0, x0, F.west.top], [w1, x0, F.west.top], [w0, x1, F.west.leanLow], [w1, x1, F.west.leanLow]]));
  for (const [r, top] of [F.westLow, F.courtSE, F.courtStrip, F.annex, ...F.notch]) pieces.push(box(...r, BASE, top));
  pieces.push(prism(F.prieel.poly, BASE, F.prieel.top));
}

const building = Manifold.union(pieces).subtract(Manifold.union(cutters));
const nodes = [["building:museum", building]];
const all = building;

const META = {
  name: "Teylers Museum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0392100000065736", "0392100000037991", "0392100000063892", "0392100000037992", "0392100000037264"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (104120, 488350) op de as van de Fossielenzalen bij de Ovale Zaal, op het maaiveld aan het Spaarne (NAP +0,5 m), +X naar het noordoosten (45,6 graden vanaf de RD-X-as, haaks op de zalen) en +Y langs de zalen naar het noordwesten (de Nauwe Appelaarsteeg); de Spaarnegevel staat aan de -Y-kant. Eén node building:museum met de Spaarnevleugel van Ulrich (gevel van 16,8 m met middenrisaliet, gekoppelde zuilen, portiek en loggia, cordonlijst, kroonlijst op een kraag, balustrade met obelisken, fronton tot NAP +17,0 m met de beeldengroep tot +19,4 m, rotonde met glazen lichtkoepel tot +17,8 m), de Fossielenzalen onder een glazen mansardedak (goot +13,7 m, knik +17,45 m, nok +17,9 m) met lisenen en hoge vensters, de Ovale Zaal (achtzijdige lichtbeuk en schilddak tot +16,4 m, houten blok tot +19,3 m en de belvedère van het observatorium tot +22,6 m, glazen lantaarn), de twee schilderijenzalen met zadeldaken en daklichten (nokken +13,4 en +14,1 m), de uitbreiding van Henket (tentoonstellingszaal, tuinzaal, glazen galerij), het tuinhuis in de tuin, en het Fundatiehuis aan de Damstraat (voorhuis met vlakke gevel tot +18,4 m en zadeldak tot +18,6 m, zij-, achter- en dwarsvleugels met kilgoten, vleugel en prieel aan de open binnenplaats). Onderkant 0,5 m onder het maaiveld aan het Spaarne; het maaiveld wordt op de kade voor de gevel bemonsterd, groundHeight is de laagste PDOK-terreinhoogte daar (ellipsoïdisch). Vervangt de PDOK-reconstructie van de vijf BAG-panden van museum, tuinhuis en Fundatiehuis. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    groundNapM: GROUND_NAP,
    baseM: BASE,
    facadeWidthM: 16.8,
    facadeCorniceNapM: 14.5,
    frontonTopNapM: 17.0,
    statueTopNapM: 19.4,
    domeTopNapM: 17.8,
    hallsEaveNapM: 13.7,
    hallsRidgeNapM: 17.9,
    ovalRoofTopNapM: 16.9,
    observatoryBlockNapM: 19.3,
    belvedereTopNapM: 22.6,
    gallery1RidgeNapM: 13.4,
    gallery2RidgeNapM: 14.1,
    fundatiehuisParapetNapM: 18.4,
    fundatiehuisRidgeNapM: 18.6,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Teylers_Museum",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/513441",
    "PDOK BAG panden 0392100000065736, 0392100000037991, 0392100000063892, 0392100000037992 en 0392100000037264, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: goten, nokken, knikken, koepel, Ovale Zaal, observatorium, platte daken en maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): dakvlakken van de Ovale Zaal, de schilderijenzalen en het Fundatiehuis",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons: foto's van de Spaarnegevel, de zalen met het glazen dak, het dak van de Ovale Zaal met het observatorium, de binnenplaats en de gevel van het Fundatiehuis, de plattegrond van het museum",
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(p[0][2], p[1][2], p[2][2]);
      if (steep < (argv.includes("--list-overhang") ? 1e9 : 5)) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(3)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(3)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    for (const [label, m] of [["double", solid], ["float32", round]]) {
      for (const piece of m.decompose()) {
        const b = piece.boundingBox();
        console.log(label, "stuk genus", piece.genus(), piece.volume().toFixed(2), "m3", b.min.map((c) => c.toFixed(2)).join(","), b.max.map((c) => c.toFixed(2)).join(","));
      }
    }
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model.
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} Haarlem 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
