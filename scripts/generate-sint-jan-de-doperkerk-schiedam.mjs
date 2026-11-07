// Sint-Jan-de-Doperkerk (Havenkerk) in Schiedam: model uit BAG, 3D BAG, AHN en fotos; in meters, Z omhoog.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-jan-de-doperkerk-schiedam");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

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
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Vlak door de gevellijn p0-p1, stijgend naar binnen (kant van 'inside') met helling t vanaf z0.
const facet = ([x0, y0], [x1, y1], z0, t, [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len;
  let ny = (x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [t * nx, t * ny, z0 - t * (nx * x0 + ny * y0)];
};
// Doorsneden in plan voor de tussenstukken van een geleding (convexe veelhoeken).
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const diamond = ([cx, cy], r) => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) =>
  loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Steunbeer tegen een gevel die naar -v kijkt (zuid): breedte w, diepte d, bovenkant zw tegen de muur en zo aan de buitenkant.
// angle draait de gevel: 0 zuid, 90 oost, 180 noord, 270 west; [x, y] is het punt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 59 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.9) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);


// ---------- Sint-Jan-de-Doperkerk (Havenkerk), Lange Haven 72, Schiedam ----------
// Neoclassicistische hallenkerk van Adrianus Tollus (1822-1824): bakstenen zaal onder een gebroken
// schilddak (mansardevorm), aan de havenzijde een gevel van natuursteen met Dorisch zuilenportiek en
// fronton, op de voorkant van het dak een houten toren met klokkenverdieping, klokvormige kap,
// open lantaarn en koepeltje. Achter een vierkante koorbouw met eigen schilddak en lichtkap; aan de
// zuidoostzijde lage aanbouwen in hetzelfde BAG-pand.
// Stelsel: +X langs de nok van de haven (zuidwest) naar het koor (noordoost), +Y naar het noordwesten.
// Oorsprong op de as van de zaal, halverwege voorgevel en achtergevel; z = 0 op het kademaaiveld
// (NAP +0,9 m). Maten uit BAG 0606100000013902, 3D BAG (dakvlakken) en AHN dsm_05m; detail uit foto's.
const SLUG = "sint-jan-de-doperkerk-schiedam";
const BASE = -0.4;
const GROUND_NAP = 0.9;
const GROUND_ELLIPSOID = 44.5;
const ORIGIN = [86924.11, 436768.0];
const AXIS_DEG = 43.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_SAMPLES = [[-27, -6], [-27, 0], [-27, 8], [-23, 13.7], [-14, 13.7], [8, 13.7], [16, 13.7]];
const N = (nap) => +(nap - GROUND_NAP).toFixed(3); // NAP-hoogte naar modelhoogte

const solids = [];
const cuts = [];

// ---------- zaal ----------
const HALL = { x0: -21.0, x1: 20.0, w: 12.25 }; // gevels (BAG), halve breedte
const WALL_TOP = N(14.8); // onderkant kroonlijst
const CORNICE = 0.5; // uitsprong kroonlijst
const EAVE = N(15.5); // bovenkant kroonlijst = voet van het dak (3D BAG: dakvlak tot de gevel)
const KNIK = N(22.6); // knik van het gebroken dak (3D BAG, AHN)
const RIDGE = N(26.25); // nok (AHN 26,2 tot 26,3)
const LOWER_SLOPE = 1.36; // onderste dakvlakken (3D BAG 1,35 tot 1,38, 54 graden)
solids.push(prism(rect(HALL.x0, HALL.x1, -HALL.w, HALL.w), BASE, WALL_TOP));
// Kroonlijst rondom: onderkant onder 50 graden, dan een rechte rand.
const corniceRing = (x0, x1, y0, y1, z) =>
  loft([
    [z, rect(x0, x1, y0, y1)],
    [z + CORNICE * 1.2, rect(x0 - CORNICE, x1 + CORNICE, y0 - CORNICE, y1 + CORNICE)],
    [EAVE, rect(x0 - CORNICE, x1 + CORNICE, y0 - CORNICE, y1 + CORNICE)],
  ]);
solids.push(corniceRing(HALL.x0, HALL.x1, -HALL.w, HALL.w, WALL_TOP));
// Gebroken schilddak: onderste schilden van 54 graden tot de knik, bovenste van circa 26 graden tot de nok.
const E = { x0: HALL.x0 - CORNICE, x1: HALL.x1 + CORNICE, w: HALL.w + CORNICE };
const inset = (KNIK - EAVE) / LOWER_SLOPE;
const K = { x0: E.x0 + inset, x1: E.x1 - inset, w: E.w - inset };
const upperRun = K.w; // bovenste schilden even steil op alle vier de kanten
const ridge = [K.x0 + upperRun, K.x1 - upperRun];
solids.push(
  loft([
    [EAVE, rect(E.x0, E.x1, -E.w, E.w)],
    [KNIK, rect(K.x0, K.x1, -K.w, K.w)],
    [RIDGE, [[ridge[0], 0], [ridge[1], 0]]],
  ]),
);
// Dakkapellen (AHN-pieken op +17,6 tot +19,7 en foto's): twee per zijde op het onderste schild.
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
const dormer = (x, side) => {
  const yFront = side * (E.w - 1.9);
  const zFront = EAVE + LOWER_SLOPE * 1.9;
  const [y0, y1] = side > 0 ? [yFront - 3.2, yFront] : [yFront, yFront + 3.2];
  const box = prism(rect(x - 0.7, x + 0.7, y0, y1), zFront - 1.5, zFront + 1.7);
  // Zadeldakje met de nok haaks op de dakvoet.
  const gable = profileY([[x - 0.7, zFront + 1.65], [x + 0.7, zFront + 1.65], [x, zFront + 2.4]], y0, y1);
  return [box, gable];
};
for (const x of [-8.5, 5]) for (const side of [-1, 1]) solids.push(...dormer(x, side));

// Lisenen langs de zijgevels (BAG: 1,1 m breed, om de 5,65 m) en hoge vensters met boog in elke travee.
const PIL = [-20.45, -14.8, -9.15, -3.45, 2.25, 7.9, 13.6, 19.45];
for (const x of PIL) for (const side of [-1, 1]) {
  const y0 = side * HALL.w;
  solids.push(prism(rect(x - 0.55, x + 0.55, Math.min(y0, y0 + side * 0.3), Math.max(y0, y0 + side * 0.3)), BASE, WALL_TOP));
}
for (let i = 0; i < PIL.length - 1; i++) {
  const x = (PIL[i] + PIL[i + 1]) / 2;
  cuts.push(niche([0, 0], 90, HALL.w, -x, 2.2, N(6.6), N(12.4), 0.4));
  cuts.push(niche([0, 0], 270, HALL.w, x, 2.2, N(6.6), N(12.4), 0.4));
}

// ---------- voorgevel van natuursteen met attiek en hoekblokken ----------
const FRONT = HALL.x0;
const ATTIC = N(17.4); // AHN 17,2 tot 17,5
solids.push(prism(rect(FRONT, FRONT + 1.4, -HALL.w, HALL.w), BASE, ATTIC));
// Hoofdgestel over de hele gevel: kroonlijst met schuine onderkant onder de attiek (AHN +17,2 tot +17,5).
solids.push(
  loft([
    [N(16.7), rect(FRONT, FRONT + 1.4, -HALL.w, HALL.w)],
    [N(16.7) + 0.6, rect(FRONT - 0.5, FRONT + 1.4, -HALL.w - 0.5, HALL.w + 0.5)],
    [ATTIC, rect(FRONT - 0.5, FRONT + 1.4, -HALL.w - 0.5, HALL.w + 0.5)],
  ]),
);
// Gerustikeerde hoeken (wit natuursteen) als brede lisenen op voor- en zijgevel.
for (const side of [-1, 1]) {
  const yo = side * HALL.w;
  solids.push(prism(rect(FRONT - 0.3, FRONT + 1.3, side > 0 ? yo - 1.3 : yo - 0.3, side > 0 ? yo + 0.3 : yo + 1.3), BASE, WALL_TOP));
  // Hoge vensters in de zijvlakken van de voorgevel naast het portiek.
  cuts.push(niche([0, 0], 180, -FRONT, side * -8.9, 2.4, N(4.6), N(11.0), 0.4));
}

// ---------- zuilenportiek met fronton ----------
const P = { x0: -24.7, x1: FRONT, w: 5.55 }; // BAG: 3,7 m diep, 11,1 m breed
const STYLO = 0.6; // trede en stylobaat
const COL_TOP = N(12.5); // bovenkant kapitelen
const ENT_TOP = N(15.8); // bovenkant architraaf en fries
const PED_EAVE = N(16.6); // voet van het fronton (3D BAG)
const PED_TOP = N(19.1); // top van het fronton (3D BAG 19,1)
solids.push(prism(rect(P.x0 - 0.4, P.x1, -P.w - 0.3, P.w + 0.3), BASE, STYLO * 0.5));
solids.push(prism(rect(P.x0, P.x1, -P.w, P.w), BASE, STYLO));
// Gesloten blok van portiek en hoofdgestel; de ruimte tussen de zuilen wordt eruit gesneden.
solids.push(prism(rect(P.x0, P.x1, -P.w, P.w), BASE, ENT_TOP));
solids.push(
  loft([
    [ENT_TOP, rect(P.x0, P.x1, -P.w, P.w)],
    [ENT_TOP + 0.6, rect(P.x0 - 0.5, P.x1, -P.w - 0.5, P.w + 0.5)],
    [PED_EAVE, rect(P.x0 - 0.5, P.x1, -P.w - 0.5, P.w + 0.5)],
  ]),
);
// Fronton en zadeldak van het portiek tot in het schilddak.
const PW = P.w + 0.5;
solids.push(profileX([[-PW, PED_EAVE - 0.05], [PW, PED_EAVE - 0.05], [0, PED_TOP]], P.x0 - 0.5, FRONT + 2.6));
// Timpaan als ondiepe driehoekige nis (0,35 m); de schuine bovenkanten zakken naar binnen weg (steiler dan 45 graden).
{
  const k = (PED_TOP - PED_EAVE) / PW, xf = P.x0 - 0.5, t0 = PED_EAVE + 0.3, t1 = PED_TOP - 0.55;
  const tri = (x, drop) => {
    const top = t1 - drop, half = (top - t0) / k;
    return [[x, -half, t0], [x, half, t0], [x, 0, top]];
  };
  cuts.push(Manifold.hull([...tri(xf - 0.2, 0), ...tri(xf + 0.35, 0.65)]));
}
// Ruimte van het portiek: open naar voren en opzij; het plafond loopt onder 49 graden naar de gevel af.
{
  const void0 = prism(rect(P.x0 - 0.6, P.x1, -P.w - 0.6, P.w + 0.6), STYLO, COL_TOP);
  const slope = 1.15;
  cuts.push(cutBelow(void0, [-slope, 0, COL_TOP + slope * (P.x0 - 0.1)]));
}
// Vier Dorische zuilen met kapiteel; antepilasters tegen de gevel.
const COL_X = -23.9, COL_R = 0.62;
const columns = [];
for (const y of [-4.75, -1.65, 1.65, 4.75]) {
  columns.push(Manifold.cylinder(COL_TOP - 0.5 - STYLO, COL_R, COL_R * 0.86, 32).translate([COL_X, y, STYLO]));
  columns.push(loft([[COL_TOP - 0.85, oct([COL_X, y], COL_R * 1.5)], [COL_TOP - 0.2, sq([COL_X, y], 0.72)], [COL_TOP + 0.05, sq([COL_X, y], 0.72)]]));
  columns.push(prism(sq([COL_X, y], 0.75), STYLO - 0.05, STYLO + 0.3));
}
for (const y of [-4.75, 4.75]) columns.push(prism(rect(FRONT - 0.35, FRONT + 0.1, y - 0.6, y + 0.6), BASE, COL_TOP));
// Deur met bovenlicht en twee vensters in de gevel onder het portiek.
cuts.push(niche([0, 0], 180, -FRONT, 0, 2.0, STYLO, N(6.2), 0.4));
for (const s of [-3.2, 3.2]) cuts.push(niche([0, 0], 180, -FRONT, s, 1.6, N(3.0), N(6.4), 0.35));

// ---------- koorbouw met schilddak en lichtkap ----------
const C = { x0: HALL.x1 - 0.5, x1: 24.9, w: 6.1 }; // BAG: 5,2 m uitbouw, 12,2 m breed
solids.push(prism(rect(C.x0, C.x1, -C.w, C.w), BASE, WALL_TOP));
solids.push(corniceRing(C.x0, C.x1, -C.w, C.w, WALL_TOP));
const CK = N(22.5); // vlakke top van het koordak (AHN 22,4 tot 22,6)
const cIn = (CK - EAVE) / 1.39; // 3D BAG 1,40 en 1,41
solids.push(
  loft([
    [EAVE, rect(14, C.x1 + CORNICE, -C.w - CORNICE, C.w + CORNICE)],
    [CK, rect(14, C.x1 + CORNICE - cIn, -C.w - CORNICE + cIn, C.w + CORNICE - cIn)],
  ]),
);
// Lichtkap (witte glazen piramide op de luchtfoto, AHN-top +24,0).
solids.push(Manifold.hull([...rect(15.6, 19.6, -1.5, 1.5).map(([x, y]) => [x, y, CK - 0.2]), [17.6, 0, N(24.1)]]));
for (const side of [-1, 1]) cuts.push(niche([0, 0], side > 0 ? 90 : 270, C.w, side > 0 ? -22.4 : 22.4, 2.0, N(6.6), N(12.0), 0.4));
cuts.push(niche([0, 0], 0, C.x1, 0, 2.2, N(6.6), N(12.4), 0.4));

// ---------- dakruiter: houten toren op de voorkant van het dak ----------
const T = [-10.0, 0];
const TB = N(29.0); // bovenkant van de leien onderbouw
const TS = N(33.3); // bovenkant klokkenverdieping
const TC = N(34.3); // bovenkant kroonlijst
const TL = N(35.3); // voet van de lantaarn (3D BAG: kap tot +35,2)
solids.push(prism(sq(T, 2.9), N(23.0), TB - 0.4));
solids.push(loft([[TB - 0.4, sq(T, 2.9)], [TB, sq(T, 2.55)]]));
solids.push(prism(sq(T, 2.5), TB - 0.1, TS));
for (const [dx, dy] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) solids.push(prism(sq([T[0] + dx * 2.3, T[1] + dy * 2.3], 0.45), TB - 0.4, TS)); // hoekpilasters
solids.push(loft([[TS - 0.02, sq(T, 2.5)], [TS + 0.7, sq(T, 3.1)], [TC, sq(T, 3.1)]]));
// Klokvormige kap met uurwerkfronten, als geleding van vierkant naar achtkant.
solids.push(loft([[TC, sq(T, 2.85)], [TC + 0.35, sq(T, 2.2)], [TL - 0.2, oct(T, 3.2)], [TL, oct(T, 3.2)]]));
// Lantaarn: achtkant met boognissen (in werkelijkheid open), lijst, koepeltje en makelaar.
const LAN = N(38.2);
solids.push(prism(oct(T, 2.5), TL, LAN));
solids.push(loft([[LAN, oct(T, 2.5)], [LAN + 0.3, oct(T, 2.9)], [LAN + 0.5, oct(T, 2.9)]]));
solids.push(loft([[LAN + 0.5, oct(T, 2.6)], [LAN + 1.0, oct(T, 2.2)], [N(39.7), oct(T, 1.5)], [N(40.0), oct(T, 1.4)]]));
solids.push(loft([[N(40.0) - 0.05, oct(T, 0.95)], [N(41.3), tip(T)]]));
for (const a of [0, 90, 180, 270]) cuts.push(niche(T, a, 1.25, 0, 0.8, TL + 0.35, LAN - 0.95, 0.3));
// Galmgaten: twee boognissen per zijde in de klokkenverdieping.
for (const a of [0, 90, 180, 270]) for (const s of [-0.95, 0.95]) cuts.push(niche(T, a, 2.5, s, 1.0, TB + 0.4, TS - 1.35, 0.35));

// ---------- aanbouwen in hetzelfde BAG-pand ----------
// Zuidoost: woonhuis met zadeldak langs de kerk (nok +11,35, goten +9,0) en halsgevel naar de haven.
const Y = (v) => +(v - 2.75).toFixed(3); // v uit het meetstelsel naar y
const houseY = [Y(-19.3), Y(-14.0)];
const houseRidge = N(11.35), houseEave = N(9.0);
for (const [x0, x1] of [[-21.0, -9.2], [-6.6, 3.2]]) {
  solids.push(prism(rect(x0, x1, houseY[0], houseY[1]), BASE, houseEave));
  solids.push(profileX([[houseY[0], houseEave - 0.05], [houseY[1], houseEave - 0.05], [(houseY[0] + houseY[1]) / 2, houseRidge]], x0, x1));
}
solids.push(prism(rect(-9.3, -6.5, houseY[0], houseY[1]), BASE, N(9.4)));
{
  const cy = (houseY[0] + houseY[1]) / 2;
  solids.push(prism(rect(-21.0, -20.2, cy - 1.1, cy + 1.1), BASE, N(12.0)));
  solids.push(profileX([[cy - 1.1, N(12.0) - 0.05], [cy + 1.1, N(12.0) - 0.05], [cy, N(12.9)]], -21.0, -20.2));
  for (const z of [N(4.2), N(7.0)]) for (const s of [-1.2, 1.2]) cuts.push(niche([0, 0], 180, 21.0, -(cy + s), 1.0, z, z + 1.6, 0.35));
}
const SE_WALL = -HALL.w + 0.1; // de aanbouwen sluiten op de zuidoostgevel aan (BAG v -9,6)
// Platte aanbouwen: kantoor naast de gevel (+8,5) en lage sacristie langs de zuidoostgevel (+5,8).
solids.push(prism(rect(-21.4, -17.0, Y(-14.0), SE_WALL), BASE, N(8.5)));
solids.push(prism(rect(-17.0, -7.5, Y(-14.0), Y(-12.5)), BASE, N(8.5)));
solids.push(prism([[-17.0, Y(-14.0)], [21.5, Y(-14.0)], [21.5, SE_WALL], [-17.0, SE_WALL]], BASE, N(5.8)));
solids.push(prism(rect(13.5, 21.5, Y(-19.0), Y(-14.0)), BASE, N(5.8)));
// Lichtkap met zadeldak op de sacristie (3D BAG: nok +7,6).
solids.push(profileY([[-4.4, N(5.8) - 0.3], [2.6, N(5.8) - 0.3], [2.6, N(5.8)], [-0.4, N(7.6)], [-4.4, N(5.8)]], Y(-14.0), SE_WALL));
// Noordwest: lage platte aanbouw tegen de zijgevel (+5,2).
solids.push(prism(rect(-8.6, 1.7, HALL.w - 0.1, Y(16.5)), BASE, N(5.2)));

// Zuilen na het uitsnijden van het portiek toevoegen.
const complex = Manifold.union([Manifold.difference(Manifold.union(solids), Manifold.union(cuts)), ...columns]);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Sint-Jan-de-Doperkerk Schiedam",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0606100000013902"],
  plate: false,
  description:
    "Sint-Jan-de-Doperkerk (Havenkerk) aan de Lange Haven 72 in Schiedam: neoclassicistische hallenkerk van Adrianus Tollus (1822-1824). Bakstenen zaal met lisenen en hoge vensters onder een gebroken schilddak (goot NAP +15,5, knik +22,6, nok +26,25), voorgevel van natuursteen met attiek en gerustikeerde hoeken, Dorisch portiek met vier zuilen en fronton (top +19,1), houten dakruiter met klokkenverdieping, klokvormige kap, lantaarn en koepeltje (makelaar +41,3), vierkante koorbouw met schilddak en lichtkap, vier dakkapellen en de aanbouwen in hetzelfde BAG-pand (woonhuis met halsgevel, sacristie en kantoor aan de zuidoostzijde, lage aanbouw aan de noordwestzijde). Oorsprong RD (86924,11; 436768,0) op de as van de zaal halverwege voor- en achtergevel, op het kademaaiveld (NAP +0,9 m); X-as langs de nok van de haven naar het koor onder 43,5 graden. Vensters en de open lantaarn als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "1822-1824 (BAG-bouwjaar 1919 is een registratiejaar), architect Adrianus Tollus",
    monument: 33223,
    groundNapM: GROUND_NAP,
    eaveNapM: 15.5,
    knikNapM: 22.6,
    ridgeNapM: 26.25,
    facadeAtticNapM: 17.4,
    pedimentTopNapM: 19.1,
    towerTopNapM: 41.3,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Jan-de-Doperkerk_(Schiedam)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/33223",
    "https://www.openstreetmap.org/way/274172367",
    "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0606100000013902 (dakvlakken zaal, koorbouw, portiek, toren en aanbouwen)",
    "BAG pand 0606100000013902 (voetafdruk, lisenen)",
    "PDOK AHN dsm_05m/dtm_05m (goten, nok, attiek, toren, dakkapellen, aanbouwen) en actuele luchtfoto",
    "https://commons.wikimedia.org/wiki/Category:Sint-Jan-de-Doperkerk_(Schiedam) (o.a. 33223 Johannes de Doperkerk.jpg, Johannes de Doperkerk, Schiedam (01).JPG, Schiedam - Lange Haven 72.jpg, Schiedam Havenkerk.jpg, Schiedam Centrum DSCF3808.JPG, RCE 20369631, 20196844, 20196845, 20196559, 20378699)",
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
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
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
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
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
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
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
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
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



