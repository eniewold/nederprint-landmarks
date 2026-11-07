import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hervormde-kerk-oosterhesselen");
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



const SLUG = "hervormde-kerk-oosterhesselen";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van de westgevel naar de driezijdige koorsluiting (oost), RD-richting
// 2,5 graden (BAG-zijgevels 2,5 graden, nok in 3D BAG en AHN evenwijdig); +v wijst naar het noorden. Oorsprong RD
// (244712,496; 530904,385): midden tussen de zijgevels van de kerk, 10,28 m achter de westgevel, op het laagste maaiveld
// (NAP +16,75 m bij de toren; rond de kerk ligt het maaiveld op NAP +17,1). De vrijstaande toren (eigen BAG-pand en
// rijksmonument 31633) staat 8 m westelijker en is 1,16 graden verder gedraaid (BAG 3,66 graden).
const AXIS_DEG = 2.5;
const ORIGIN = [244712.496, 530904.385];
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: 58,53 ten westen van de toren; rond de toren verder
// 58,79 tot 58,83, rond de kerk 58,77 tot 59,10 en 59,31 op het pad voor de westgevel (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 58.53;
const GROUND_SAMPLES = [[-12, 0], [0, -7], [0, 7], [6, -7.2], [6, 7.2], [12.5, 0], [-26, 0], [-21.15, -4.8], [-21.15, 4.9], [-16.4, 0]];

// ---------- kerk (meter boven NAP +16,75) ----------
// Zaal uit de BAG-contour (zonder steunberen): westgevel u = -10,28, zijgevels v = ±5,175, koorsluiting met twee schuine
// zijden van 45 graden vanaf u = 7,1 en een oostzijde op u = 10,02 van v = -2,15 tot 2,15.
const HALF = 5.175, WEST = -10.28, CHOIR_U = 7.1, EAST = 10.02, EAST_V = 2.15;
const WALL = [[WEST, -HALF], [CHOIR_U, -HALF], [EAST, -EAST_V], [EAST, EAST_V], [CHOIR_U, HALF], [WEST, HALF]];
// Zadeldak van 45 graden: nok NAP +30,68 (3D BAG 30,68, AHN 30,6 tot 30,7) = +13,93, goot op de muurlijn +8,755.
// Koor: de drie dakvlakken van de sluiting lopen naar één nokpunt op u = 6,5 (3D BAG 6,4 tot 6,6); hun helling volgt
// (oost 1,47 = 3D BAG 1,47, schuin 1,29 = 3D BAG 1,27). West: wolfseind boven de topgevel vanaf NAP +28,8 = +12,05 met
// helling 1,15 (3D BAG-vlak 63).
const RIDGE = 13.93, PITCH = 1.0, EAVE = RIDGE - PITCH * HALF, APEX = [6.5, 0];
const WOLF_Z = 12.05, WOLF_PITCH = 1.15;
const OVERHANG = 0.3, FASCIA = 8.15, CORBEL = 7.8; // dakoverstek met boeiboord en een kraag van 49 graden
const PLINTH = 1.0; // grijze plint; PDOK-maaiveld rond de kerk op +0,5 tot +0,85 (pad voor de westgevel)
// Steunberen (BAG 0,75 m breed, 1,05 m diep): twee per zijgevel tussen de traveeën, schuin op de hoeken van de westgevel,
// de aanzet van de sluiting en de hoeken van de oostzijde. Versprong op +3,3, schuine afdekking tot +7,0 (foto's).
const SIDE_BUTTRESS_U = [-3.33, 1.9];
const BUTTRESS_W = 0.9, BUTTRESS_D = 1.05;
// Spitsboogvensters: één per travee (u -6,8, -0,7 en 4,5) in beide zijgevels en één in elke schuine zijde van het koor;
// het middenvenster van de sluiting is dichtgezet (blinde nis). Westgevel: deur in een spitsboognis, venster erboven en een
// klein venster in de top (foto's 2016 en RCE).
const SIDE_WINDOWS = [-6.8, -0.7, 4.5];
const WIN = [1.5, 2.4, 6.0]; // breedte, onderkant, aanzet van de spitsboog

// ---------- toren (eigen stelsel, maaiveld NAP +16,75) ----------
// BAG 5,85 bij 5,9 m; hart in het kerkstelsel (-21,155; 0,075), 1,16 graden verder gedraaid. Drie geledingen met een
// versnijding op +5,8 en +12,3 (foto RM 31633), goot +15,55 (AHN 32,3), tentdak met een overstek van 0,3 m tot de top
// NAP +38,9 = +22,15 (3D BAG 39,0, AHN 38,7 tot 39,3).
const TOWER_C = [-21.155, 0.075], TOWER_ROT = 1.16;
const T1 = 2.95, T2 = 2.86, T3 = 2.78, SET1 = 5.8, SET2 = 12.3;
const T_EAVE = 15.55, T_KRAAG = 15.05, T_OVER = 0.3, T_TOP = 22.15;

// Convexe veelhoek (tegen de klok in) met elke rand d[i] naar buiten verschoven.
const offsetPoly = (pts, d) => {
  const lines = pts.map(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = [(y1 - y0) / len, -(x1 - x0) / len];
    const off = typeof d === "number" ? d : d[i];
    return { p: [x0 + n[0] * off, y0 + n[1] * off], t: [(x1 - x0) / len, (y1 - y0) / len] };
  });
  return lines.map((l, i) => {
    const m = lines[(i + lines.length - 1) % lines.length];
    const det = m.t[0] * -l.t[1] - m.t[1] * -l.t[0];
    const rx = l.p[0] - m.p[0], ry = l.p[1] - m.p[1];
    const s = (rx * -l.t[1] - ry * -l.t[0]) / det;
    return [m.p[0] + m.t[0] * s, m.p[1] + m.t[1] * s];
  });
};
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const dist = ([x, y], [x0, y0], [x1, y1]) => Math.abs((x1 - x0) * (y0 - y) - (x0 - x) * (y1 - y0)) / Math.hypot(x1 - x0, y1 - y0);
const nicheAt = ([px, py], angle, w, z0, z1, d = 0.35) => niche([px, py], angle, 0, 0, w, z0, z1, d);
const edgeNormal = ([x0, y0], [x1, y1]) => (Math.atan2(-(x1 - x0), y1 - y0) * 180) / Math.PI;
// Steunbeer met de voet op [x, y] in de gevel, naar buiten in de richting 'angle' (graden vanaf +u).
const pier = ([x, y], angle) =>
  profileX(
    [[0.1, BASE], [-BUTTRESS_D, BASE], [-BUTTRESS_D, 3.3], [-0.65 * BUTTRESS_D, 3.65], [-0.65 * BUTTRESS_D, 6.2], [-0.1, 7.0], [0.1, 7.0]],
    -BUTTRESS_W / 2,
    BUTTRESS_W / 2,
  )
    .rotate([0, 0, angle + 90])
    .translate([x, y, 0]);

// ---------- kerk ----------
const planes = [...ridgeV(0, RIDGE, PITCH), [WOLF_PITCH, 0, WOLF_Z - WOLF_PITCH * WEST]];
for (const i of [1, 2, 3]) {
  const p0 = WALL[i], p1 = WALL[i + 1];
  planes.push(facet(p0, p1, EAVE, (RIDGE - EAVE) / dist(APEX, p0, p1), APEX));
}
const ROOF_EDGE = offsetPoly(WALL, [OVERHANG, OVERHANG, OVERHANG, OVERHANG, OVERHANG, 0]);

const church = [];
church.push(prism(WALL, BASE, CORBEL + 0.01));
const eaves = Manifold.hull([...at(WALL, CORBEL), ...at(ROOF_EDGE, FASCIA), ...at(ROOF_EDGE, 30)]);
church.push(planes.reduce((s, p) => cutBelow(s, p), eaves));
// Plint van 0,12 m met een schuine bovenkant.
church.push(Manifold.hull([...at(offsetPoly(WALL, 0.12), BASE), ...at(offsetPoly(WALL, 0.12), PLINTH - 0.12), ...at(WALL, PLINTH)]));
// Topgevel (westgevel) met gevelrand 0,3 m boven de dakvlakken, een vlakke top onder het wolfseind en gebogen schouders
// boven de hoeken (foto's 2016: ingezwenkte aanzet boven de hoeksteunberen).
const COPE = 0.3, TOP = WOLF_Z + COPE, TOP_V = RIDGE + COPE - TOP;
const shoulder = [[5.375, 9.0], [5.3, 9.3], [5.1, 9.55], [4.8, 9.72], [4.45, RIDGE + COPE - 4.45]];
church.push(
  profileX(
    [[-5.375, BASE], [5.375, BASE], ...shoulder, [TOP_V, TOP], [-TOP_V, TOP], ...shoulder.reverse().map(([v, z]) => [-v, z])],
    WEST - 0.05,
    WEST + 0.4,
  ),
);
// Steunberen.
for (const u of SIDE_BUTTRESS_U) for (const s of [-1, 1]) church.push(pier([u, s * HALF], s < 0 ? -90 : 90));
const corner = (i) => {
  const p = WALL[i], a = WALL[(i + WALL.length - 1) % WALL.length], b = WALL[(i + 1) % WALL.length];
  const n0 = edgeNormal(a, p), n1 = edgeNormal(p, b);
  // bissectrice van de buitennormalen
  const x = Math.cos((n0 * Math.PI) / 180) + Math.cos((n1 * Math.PI) / 180), y = Math.sin((n0 * Math.PI) / 180) + Math.sin((n1 * Math.PI) / 180);
  return pier(p, (Math.atan2(y, x) * 180) / Math.PI);
};
for (const i of [0, 1, 2, 3, 4, 5]) church.push(corner(i));

const churchCuts = [];
for (const u of SIDE_WINDOWS) for (const s of [-1, 1]) churchCuts.push(nicheAt([u, s * HALF], s < 0 ? -90 : 90, WIN[0], WIN[1], WIN[2]));
for (const i of [1, 2, 3]) {
  const p0 = WALL[i], p1 = WALL[i + 1];
  churchCuts.push(nicheAt([(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], edgeNormal(p0, p1), WIN[0], WIN[1], WIN[2], i === 2 ? 0.25 : 0.35));
}
// Westgevel: spitsboognis met de deur, venster erboven en een klein venster in de top.
churchCuts.push(nicheAt([WEST - 0.05, 0], 180, 1.9, 0.85, 3.3, 0.2));
churchCuts.push(nicheAt([WEST - 0.05, 0], 180, 1.2, 0.85, 2.8, 0.45));
churchCuts.push(nicheAt([WEST - 0.05, 0], 180, 1.1, 5.0, 6.6));
churchCuts.push(nicheAt([WEST - 0.05, 0], 180, 0.7, 9.4, 10.3));

let kerk = Manifold.union(church).subtract(Manifold.union(churchCuts));
kerk = kerk.trimByPlane([0, 0, 1], BASE);

// ---------- toren ----------
const tower = [];
const sqT = (h) => sq([0, 0], h);
tower.push(prism(sqT(T1), BASE, SET1));
tower.push(Manifold.hull([...at(sqT(T1), SET1 - 0.01), ...at(sqT(T2), SET1 + T1 - T2)]));
tower.push(prism(sqT(T2), SET1, SET2));
tower.push(Manifold.hull([...at(sqT(T2), SET2 - 0.01), ...at(sqT(T3), SET2 + T2 - T3)]));
tower.push(prism(sqT(T3), SET2, T_KRAAG));
// Plint.
tower.push(Manifold.hull([...at(sqT(T1 + 0.12), BASE), ...at(sqT(T1 + 0.12), 0.7), ...at(sqT(T1), 0.82)]));
// Kraag van 45 graden naar het overstek, boeiboord en tentdak (vier vlakken naar de top).
const TE = T3 + T_OVER;
tower.push(Manifold.hull([...at(sqT(T3), T_KRAAG - 0.01), ...at(sqT(TE), T_KRAAG + T_OVER + 0.05), ...at(sqT(TE), T_EAVE - 0.1)]));
const tPitch = (T_TOP - (T_EAVE - 0.1)) / TE;
tower.push(Manifold.hull([...at(sqT(TE), T_EAVE - 0.1), [0, 0, T_TOP]]));
const towerCuts = [];
// Westzijde: deur in een spitsboog en een venster erboven in de onderste geleding.
towerCuts.push(nicheAt([-T1, 0], 180, 1.2, 0.35, 2.5, 0.4));
towerCuts.push(nicheAt([-T1, 0], 180, 1.1, 3.1, 4.4));
// Middelste geleding: hoge spitsboognis op elke zijde; bovenste geleding: galmgat in een spitsboognis op elke zijde.
for (const a of [0, 90, 180, 270]) {
  const c = (h) => [h * Math.cos((a * Math.PI) / 180), h * Math.sin((a * Math.PI) / 180)];
  towerCuts.push(nicheAt(c(T2), a, a === 0 || a === 180 ? 1.3 : 0.9, 6.7, 10.0));
  towerCuts.push(nicheAt(c(T3), a, a === 0 || a === 180 ? 1.6 : 1.0, 12.8, 13.8));
}
let toren = Manifold.union(tower).subtract(Manifold.union(towerCuts));
toren = toren.trimByPlane([0, 0, 1], BASE).rotate([0, 0, TOWER_ROT]).translate([...TOWER_C, 0]);

const nodes = [["building:kerk", kerk], ["building:toren", toren]];
const all = Manifold.union([kerk, toren]);
const META = {
  name: "Hervormde Kerk Oosterhesselen",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0109100000007011", "0109100000011992"],
  plate: true,
  description:
    "Hervormde Kerk aan de Geserweg in Oosterhesselen: gepleisterde eenbeukige gotische kerk (koor 15e eeuw, westmuur 1628) met driezijdige koorsluiting onder een zadeldak van 45 graden (nok +13,93 m) met wolfseind boven de westgevel, steunberen tussen de traveeën en op de hoeken, spitsboogvensters (het middelste van de sluiting dichtgezet), westgevel met gebogen schouders, deurnis en vensters; met de vrijstaande laatgotische toren (15e eeuw, Drentse torenfamilie) van drie geledingen met spitsboognissen, deur, galmgaten en tentdak tot +22,15 m. Oorsprong RD (244712,496; 530904,385) midden in de kerk op het laagste maaiveld (NAP +16,75 m), X-as langs de nok naar het koor onder 2,5 graden. Vensters, deuren en galmgaten als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "kerk: koor 15e eeuw, schip na 1592 hersteld, westmuur 1628, gepleisterd 1862; toren laat-15e eeuw",
    monument: [31632, 31633],
    groundNapM: 16.75,
    ridgeM: RIDGE,
    eaveM: +EAVE.toFixed(3),
    towerEaveM: T_EAVE,
    towerTopM: T_TOP,
    towerRoofPitch: +tPitch.toFixed(2),
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Kerk_van_Oosterhesselen",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/31632",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/31633",
    "https://www.wikidata.org/wiki/Q17438578",
    "https://www.openstreetmap.org/way/279331888",
    "https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Oosterhesselen (Protestantse Kerk 2016 001/003/005/007/009; RM 31633 Kerktoren; kerk en toren foto6 2011; RCE 20135988, 20135989, 20322210)",
    "BAG panden 0109100000007011 (kerk) en 0109100000011992 (toren); 3D BAG LoD2.2 (dakvlakken)",
    "PDOK AHN dsm_05m/dtm_05m en actuele luchtfoto",
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
