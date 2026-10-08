// Genereert een gesloten 3D-model van Kasteel Ammersoyen in Ammerzoden uit
// dakvlakken en bouwdelen: de zuidvleugel onder één nok (+24,3 m boven het
// water) met schilden, de west- en oostvleugel met zadeldaken, de lage
// noordvleugels met een weergang aan de gracht, het poortgebouw met een
// trapgevel aan de brug, de binnenplaats en vier ronde hoektorens: de grote
// noordwesttoren met een brede kegel, een lantaarn en een uitje, de lagere
// noordoosttoren met een kegeldak en de zuidtorens met een rok en een slanke
// spits. De voorburcht en het koetshuis zijn eigen BAG-panden en blijven
// PDOK-model. Elk dak is een vlak z = a u + b v + c uit het AHN en de
// LoD2.2-vlakken van de 3D BAG. Het Mapbox-model is niet gebruikt. Alle maten
// in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-kasteel-ammersoyen.mjs              # 1:1000 (standaard)
//   node scripts/generate-kasteel-ammersoyen.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (144102, 418104), midden in het kasteel, op het
// water van de slotgracht (NAP +1,6 m), Z omhoog. +X loopt langs de zuidgevel
// naar het oosten (1,75 graden rechtsom vanaf de RD-X-as) en +Y loodrecht
// daarop. Het kasteel staat rondom in de gracht; het model begint 1 m onder het
// water.
//
// Bronnen: PDOK BAG-pand 0263100000009351; AHN DSM/DTM 0,5 m (PDOK WCS) voor de
// daken, de torens, de binnenplaats en het water; 3D BAG LoD2.2
// (api.3dbag.nl); Wikipedia; PDOK luchtfoto; foto's op Wikimedia Commons vanaf
// de noordoost-, west- en noordkant. Geschat zijn de lantaarn en het uitje op de
// noordwesttoren, de hoogte van de slanke spitsen op de zuidtorens (het AHN
// mist de punt), de trapgevel, de dakkapellen, schoorstenen en vensternissen.
// Weggelaten: de houten brug, de luiken en de kleine aanbouwen op de
// binnenplaats.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-ammersoyen");
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
// Regelmatige veelhoek: hoekpunten op de hoeken angs (graden) rond c, voor een veelhoek met apothema apo en zijdehoek step.
const ngon = (c, apo, angs, step) =>
  angs.map((a) => {
    const r = apo / Math.cos(((step / 2) * Math.PI) / 180);
    return [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  });
// Dakvlak boven een gevel met de normaal naar phi (graden) op apothema apo rond c: goot z0, helling t naar binnen.
const facetPhi = (c, phi, apo, z0, t) => {
  const cp = Math.cos((phi * Math.PI) / 180);
  const sp = Math.sin((phi * Math.PI) / 180);
  return [-t * cp, -t * sp, z0 + t * apo + t * (c[0] * cp + c[1] * sp)];
};
// Doorsnede van een of meer veelhoeken en een rand (borstwering) van breedte w langs de omtrek, van z0 tot z1.
const section = (...polys) => CrossSection.union(polys.map((p) => new CrossSection([ccw(p)])));
const band = (cs, w, z0, z1) => Manifold.extrude(cs.subtract(cs.offset(-w, "Miter")), z1 - z0).translate([0, 0, z0]);
// Pinakel op een steunbeer die tot de onderkant doorloopt: vierkante schacht tot z1 en een piramide.
const pier = (c, half, z1, point) => loft([[BASE, sq(c, half)], [z1, sq(c, half)], [z1 + point, tip(c)]]);

const SLUG = "kasteel-ammersoyen";

// ---------- maten (lokaal stelsel, z = hoogte boven het water van de slotgracht op NAP +1,6 m) ----------
const GROUND_NAP = 1.6;
const ORIGIN = [144102.0, 418104.0];
const X_AXIS = [0.999534, -0.030538]; // RD-richting -1,75 graden, langs de zuidgevel
// De gevels staan rondom in de gracht; het model begint 1 m onder het water.
const BASE = -1.0;

// Dakvlakken z = a u + b v + c, gefit op het AHN-DSM (0,5 m).
const SOUTH_S = [-0.064, 1.362, 34.33]; // zuidvleugel, zuidhelling (56 graden)
const SOUTH_N = [0.062, -1.437, 13.66]; // zuidvleugel, noordhelling naar de binnenplaats
const SOUTH_W = [1.633, 0.063, 35.51]; // schild aan de westkant
const SOUTH_E = [-1.817, 0.158, 45.79]; // schild aan de oostkant
const WEST_W = [1.388, 0, 32.5]; // westvleugel, nok op u = -7,85 m (+21,6 m)
const WEST_E = [-1.507, 0, 9.78];
const EAST_W = [0.876, 0.015, 5.15]; // oostvleugel, nok op u = 12,7 m (+16,3 m)
const EAST_E = [-0.917, -0.029, 27.87];

// Vier ronde hoektorens (middelpunt, straal, muurhoogte).
const NW = { c: [-12.65, 13.15], r: 5.65, wall: 16.0 };
const NE = { c: [15.45, 13.85], r: 4.8, wall: 12.6 };
const SW = { c: [-11.05, -13.65], r: 4.35, wall: 16.2 };
const SE = { c: [15.55, -12.05], r: 3.95, wall: 15.9 };

// Maaiveld: het water van de gracht naast de zuidgevel, de zuidwesttoren en de oostgevel (NAP +1,5 tot +1,6 m).
const GROUND_SAMPLES = [[0, -15.5], [-17, -14], [22, 0]];

// ---------- kasteel ----------
const solids = [];
const circle = ([cx, cy], r, n = 48) =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);

// Zuidvleugel onder één nok (+24,3 m) met schilden aan beide kanten.
solids.push(roofed([[-12.4, -9.0], [-6.7, -14.0], [11.6, -13.4], [16.8, -8.2], [16.6, -1.6], [-12.4, -1.6]], [SOUTH_S, SOUTH_N, SOUTH_W, SOUTH_E]));
// Westvleugel tot aan de zuidvleugel, met de westgevel licht scheef (BAG).
solids.push(roofed([[-12.4, -7.4], [-3.3, -7.4], [-3.3, 10.4], [-12.9, 10.4], [-12.9, 7.5]], [WEST_W, WEST_E]));
// Oostvleugel tot aan de noordoosttoren.
solids.push(roofed([[9.2, -1.6], [16.6, -1.6], [16.3, 0.0], [16.2, 11.6], [9.2, 11.6]], [EAST_W, EAST_E]));
// Noordwestvleugel tussen de toren en de poort: nok langs u op v = 11,5 m (+18,5 m), een lage weergang ervoor.
solids.push(roofed(rect(-8.0, -0.8, 9.0, 12.9), ridgeV(11.5, 18.5, 1.5)));
solids.push(prism([[-8.0, 12.9], [-0.8, 12.9], [-0.8, 13.8], [-7.0, 13.5]], BASE, 10.8));
// Noordoostvleugel tussen de poort en de toren: vlak dak op +14,3 m en een lage weergang (+10,5 m).
solids.push(roofed(rect(5.2, 12.2, 10.0, 12.9), ridgeV(11.5, 14.6, 0.6)));
solids.push(prism([[5.2, 12.9], [12.2, 12.9], [10.9, 14.1], [5.3, 13.7]], BASE, 10.5));
// Poortgebouw naar het noorden met de nok langs v op u = 2,1 m (+17,5 m) en een trapgevel aan de brug.
solids.push(roofed(rect(-0.8, 5.3, 10.0, 17.5), ridgeU(2.1, 17.5, 1.4)));
for (const [u0, u1, z] of [[-0.8, 5.3, 14.6], [-0.1, 4.6, 15.5], [0.6, 3.9, 16.4], [1.3, 3.2, 17.4], [1.75, 2.75, 18.4]]) {
  solids.push(prism(rect(u0, u1, 17.4, 18.0), BASE, z));
}
// Binnenplaats (+4,2 m).
solids.push(prism(rect(-3.5, 9.4, -1.8, 10.2), BASE, 4.2));

// Noordwesttoren: brede kegel (54 graden), lantaarn met een uitje tot +26,8 m.
{
  const { c, r, wall } = NW;
  solids.push(loft([[BASE, circle(c, r)], [wall, circle(c, r)], [22.0, circle(c, 1.2, 16)]]));
  solids.push(loft([[21.8, oct(c, 2.0)], [23.6, oct(c, 2.0)], [24.2, oct(c, 2.4)], [25.0, oct(c, 1.6)], [25.4, oct(c, 0.9)], [26.8, tip(c)]]));
}
// Noordoosttoren: lager, kegel van 55 graden met een pinakel.
{
  const { c, r, wall } = NE;
  solids.push(loft([[BASE, circle(c, r)], [wall, circle(c, r)], [18.7, circle(c, 0.6, 16)], [19.9, tip(c)]]));
}
// Zuidtorens: een lage rok en een slanke, holle spits.
for (const [{ c, r, wall }, top] of [[SW, 23.5], [SE, 23.0]]) {
  solids.push(
    loft([
      [BASE, circle(c, r)],
      [wall, circle(c, r)],
      [wall + 1.7, circle(c, 1.6, 16)],
      [wall + 2.9, circle(c, 1.0, 16)],
      [wall + 4.2, circle(c, 0.5, 16)],
      [top, tip(c)],
    ]),
  );
}

// Dakkapellen op de zuidvleugel (beide hellingen) en de westvleugel.
for (const u of [-4.5, 0.5, 5.5]) solids.push(roofed(rect(u - 0.9, u + 0.9, -12.9, -10.0), ridgeU(u, 18.8, 1.6)));
for (const u of [-4.0, 0.5, 5.0]) solids.push(roofed(rect(u - 0.9, u + 0.9, -4.6, -2.0), ridgeU(u, 18.0, 1.6)));
for (const v of [-3.0, 3.0]) solids.push(roofed(rect(-12.0, -9.6, v - 0.9, v + 0.9), ridgeV(v, 17.8, 1.6)));
// Schoorstenen op de nok van de zuidvleugel en de westvleugel.
for (const [u, v, z] of [[-5.0, -7.4, 25.6], [9.0, -7.4, 25.6], [-7.8, 6.7, 23.0]]) solids.push(prism(sq([u, v], 0.5), BASE, z));

let castle = Manifold.union(solids);

// Vensternissen in de buitengevels en de torens, en de poort aan de brug.
const cuts = [];
for (const u of [-3.0, 2.5, 8.0]) cuts.push(niche([u, 0], 270, 13.7, 0, 1.4, 5.0, 8.0, 0.4), niche([u, 0], 270, 13.7, 0, 1.4, 10.0, 12.6, 0.4));
for (const v of [-4.0, 3.0]) cuts.push(niche([0, v], 180, 12.6, 0, 1.4, 5.0, 8.0, 0.4), niche([0, v], 180, 12.6, 0, 1.4, 10.0, 12.6, 0.4));
for (const v of [-0.5, 5.0]) cuts.push(niche([0, v], 0, 16.3, 0, 1.4, 5.0, 8.0, 0.4), niche([0, v], 0, 16.3, 0, 1.4, 10.0, 12.0, 0.4));
for (const [{ c, r }, angs] of [[NW, [120, 180, 240]], [NE, [20, 60]], [SW, [200, 260]], [SE, [300, 340]]]) {
  for (const a of angs) for (const z of [5.0, 10.0]) cuts.push(niche(c, a, r, 0, 1.0, z, z + 1.8, 0.4));
}
cuts.push(niche([2.1, 0], 90, 18.0, 0, 2.2, 1.6, 4.4, 0.6));
castle = castle.subtract(Manifold.union(cuts));

const nodes = [["building:kasteel", castle]];
const all = castle;

const META = {
  name: "Kasteel Ammersoyen",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 45.1,
  replacesBuildings: ["0263100000009351"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (144102, 418104), midden in het kasteel, op het water van de slotgracht (NAP +1,6 m), +X langs de zuidgevel (1,75 graden rechtsom vanaf de RD-X-as) en +Y loodrecht daarop. Een node building:kasteel uit dakvlakken en bouwdelen: de zuidvleugel onder één nok met schilden, de west- en oostvleugel met zadeldaken, de lage noordvleugels met een weergang, het poortgebouw met een trapgevel, de binnenplaats, vier ronde hoektorens (de noordwesttoren met een lantaarn en een uitje, de noordoosttoren met een kegeldak, de zuidtorens met een rok en een slanke spits), dakkapellen, schoorstenen en vensternissen. Onderkant 1 m onder het water; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van het kasteel. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { southRidgeM: 24.3, westRidgeM: 21.6, eastRidgeM: 16.3, northWestTowerTopM: 26.8, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Kasteel_Ammersoyen",
    "PDOK BAG pand 0263100000009351 (het kasteel), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dakvlakken, torens, binnenplaats en het water van de gracht",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's vanaf de noordoost-, west- en noordkant",
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
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
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
